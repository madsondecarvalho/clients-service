import { GetClientByIdUseCase } from '../getClientById';
import { ClientRepository } from '../../../repositories/ClientRepository';
import { RedisService } from '../../../services/RedisService';
import { Logger } from '../../../logger/LoggerInterface';
import { Client } from '../../../entities/Client';

describe('GetClientByIdUseCase', () => {
  let clientRepo: jest.Mocked<ClientRepository>;
  let redis: jest.Mocked<RedisService>;
  let logger: jest.Mocked<Logger>;
  let useCase: GetClientByIdUseCase;

  beforeEach(() => {
    clientRepo = {
      findById: jest.fn(),
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

    useCase = new GetClientByIdUseCase(clientRepo, redis, logger);
  });

  it('deve retornar cliente do cache se existir', async () => {
    const cachedClient = { id: '1', email: 'a@a.com', name: 'A' };
    redis.get.mockResolvedValue(JSON.stringify(cachedClient));

    const result = await useCase.execute('1');

    expect(redis.get).toHaveBeenCalledWith('client:1');
    expect(logger.info).toHaveBeenCalledWith('Client with id 1 found in cache');
    expect(result).toEqual(cachedClient);
    expect(clientRepo.findById).not.toHaveBeenCalled();
  });

  it('deve buscar do banco, cachear e retornar se não houver cache', async () => {
    redis.get.mockResolvedValue(null);
    const dbClient: Client = { id: '2', email: 'b@b.com', name: 'B' };
    clientRepo.findById.mockResolvedValue(dbClient);

    const result = await useCase.execute('2');

    expect(redis.get).toHaveBeenCalledWith('client:2');
    expect(clientRepo.findById).toHaveBeenCalledWith('2');
    expect(redis.set).toHaveBeenCalledWith('client:2', JSON.stringify(dbClient), expect.any(Number));
    expect(logger.info).toHaveBeenCalledWith('Client with id 2 found in database, caching result');
    expect(result).toEqual(dbClient);
  });

  it('deve logar aviso e retornar null se cliente não for encontrado', async () => {
    redis.get.mockResolvedValue(null);
    clientRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('notfound');

    expect(logger.warn).toHaveBeenCalledWith('Client with id notfound not found');
    expect(result).toBeNull();
  });

  it('deve lançar erro e logar se ocorrer exceção', async () => {
    const error = new Error('DB error');
    redis.get.mockRejectedValue(error);

    await expect(useCase.execute('fail')).rejects.toThrow('DB error');
    expect(logger.error).toHaveBeenCalledWith('Error fetching client by id: %o', error);
  });
});