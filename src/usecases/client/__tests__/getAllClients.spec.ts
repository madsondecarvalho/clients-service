import { GetAllClientsUseCase } from '../getAllClients';
import { ClientRepository } from '../../../repositories/ClientRepository';
import { RedisService } from '../../../services/RedisService';
import { Logger } from '../../../logger/LoggerInterface';
import { Client } from '../../../entities/Client';

describe('GetAllClientsUseCase', () => {
  let clientRepo: jest.Mocked<ClientRepository>;
  let redis: jest.Mocked<RedisService>;
  let logger: jest.Mocked<Logger>;
  let useCase: GetAllClientsUseCase;

  beforeEach(() => {
    clientRepo = {
      find: jest.fn(),
    } as any;

    redis = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;

    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    useCase = new GetAllClientsUseCase(clientRepo, redis, logger);
  });

  it('deve retornar clientes do cache se existir', async () => {
    const cachedClients = [{ id: '1', email: 'a@a.com', name: 'A' }];
    redis.get.mockResolvedValue(JSON.stringify(cachedClients));

    const result = await useCase.execute();

    expect(redis.get).toHaveBeenCalledWith('clients');
    expect(logger.info).toHaveBeenCalledWith('Clients found in cache');
    expect(result).toEqual(cachedClients);
    expect(clientRepo.find).not.toHaveBeenCalled();
  });

  it('deve buscar do banco, cachear e retornar se não houver cache', async () => {
    redis.get.mockResolvedValue(null);
    const dbClients: Client[] = [
      { id: '2', email: 'b@b.com', name: 'B' },
      { id: '3', email: 'c@c.com', name: 'C' },
    ];
    clientRepo.find.mockResolvedValue(dbClients);

    const result = await useCase.execute();

    expect(redis.get).toHaveBeenCalledWith('clients');
    expect(clientRepo.find).toHaveBeenCalled();
    expect(redis.set).toHaveBeenCalledWith('clients', JSON.stringify(dbClients), expect.any(Number));
    expect(logger.info).toHaveBeenCalledWith(`Fetched ${dbClients.length} clients`);
    expect(result).toEqual(dbClients);
  });

  it('deve logar aviso se nenhum cliente for encontrado', async () => {
    redis.get.mockResolvedValue(null);
    clientRepo.find.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(logger.warn).toHaveBeenCalledWith('No clients found in database');
    expect(result).toEqual([]);
  });

  it('deve lançar erro e logar se ocorrer exceção', async () => {
    const error = new Error('DB error');
    redis.get.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('DB error');
    expect(logger.error).toHaveBeenCalledWith('Error fetching clients: %o', error);
  });
});