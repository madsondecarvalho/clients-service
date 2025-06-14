import { DeleteClientUseCase } from '../deleteClient';
import { ClientRepository } from '../../../repositories/ClientRepository';
import { RedisService } from '../../../services/RedisService';
import { Logger } from '../../../logger/LoggerInterface';

describe('DeleteClientUseCase', () => {
  let clientRepo: jest.Mocked<ClientRepository>;
  let redis: jest.Mocked<RedisService>;
  let logger: jest.Mocked<Logger>;
  let useCase: DeleteClientUseCase;

  beforeEach(() => {
    clientRepo = {
      delete: jest.fn(),
    } as any;

    redis = {
      del: jest.fn(),
    } as any;

    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    useCase = new DeleteClientUseCase(clientRepo, redis, logger);
  });

  it('deve deletar o cliente e limpar o cache', async () => {
    clientRepo.delete.mockResolvedValue(true);

    const result = await useCase.execute('123');

    expect(clientRepo.delete).toHaveBeenCalledWith('123');
    expect(redis.del).toHaveBeenCalledWith('client:123');
    expect(redis.del).toHaveBeenCalledWith('clients');
    expect(logger.info).toHaveBeenCalledWith('Client with id 123 deleted successfully');
    expect(result).toBe(true);
  });

  it('deve avisar se o cliente não for encontrado', async () => {
    clientRepo.delete.mockResolvedValue(false);

    const result = await useCase.execute('notfound');

    expect(clientRepo.delete).toHaveBeenCalledWith('notfound');
    expect(logger.warn).toHaveBeenCalledWith('Client with id notfound not found');
    expect(result).toBe(false);
  });

  it('deve logar e lançar erro em caso de exceção', async () => {
    const error = new Error('DB error');
    clientRepo.delete.mockRejectedValue(error);

    await expect(useCase.execute('fail')).rejects.toThrow('DB error');
    expect(logger.error).toHaveBeenCalledWith('Error deleting client: %o', error);
  });
});