import { CreateClientUseCase } from '../createClient';
import { ClientRepository } from '../../../repositories/ClientRepository';
import { RedisService } from '../../../services/RedisService';
import { Logger } from '../../../logger/LoggerInterface';

describe('CreateClientUseCase', () => {
  let clientRepo: jest.Mocked<ClientRepository>;
  let redis: jest.Mocked<RedisService>;
  let logger: jest.Mocked<Logger>;
  let useCase: CreateClientUseCase;

  beforeEach(() => {
    clientRepo = {
      create: jest.fn(),
      // ...adicione outros métodos mockados se necessário
    } as any;

    redis = {
      set: jest.fn(),
      del: jest.fn(),
    } as any;

    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    useCase = new CreateClientUseCase(clientRepo, redis, logger);
  });

  it('deve criar um novo cliente e atualizar o cache', async () => {
    const clientData = { email: 'test@example.com', name: 'Test' };
    const createdClient = { id: '1', ...clientData };

    clientRepo.create.mockResolvedValue(createdClient);

    const result = await useCase.execute(clientData);

    expect(clientRepo.create).toHaveBeenCalledWith(clientData);
    expect(redis.set).toHaveBeenCalledWith(
      'client:1',
      JSON.stringify(createdClient),
      expect.any(Number)
    );
    expect(redis.del).toHaveBeenCalledWith('clients');
    expect(logger.info).toHaveBeenCalledWith('Client created successfully: %o', createdClient);
    expect(result).toEqual({ message: 'Client created successfully', data: createdClient });
  });

  it('deve retornar mensagem de erro se email já estiver cadastrado', async () => {
    const clientData = { email: 'test@example.com' };
    const error = { code: 11000 };

    clientRepo.create.mockRejectedValue(error);

    const result = await useCase.execute(clientData);

    expect(logger.warn).toHaveBeenCalledWith('Attempt to create client with duplicate email');
    expect(result).toEqual({ message: 'Email já cadastrado' });
  });

  it('deve lançar erro e logar se ocorrer erro inesperado', async () => {
    const clientData = { email: 'test@example.com' };
    const error = new Error('Unexpected error');

    clientRepo.create.mockRejectedValue(error);

    await expect(useCase.execute(clientData)).rejects.toThrow('Unexpected error');
    expect(logger.error).toHaveBeenCalledWith('Error creating client: %o', error);
  });
});