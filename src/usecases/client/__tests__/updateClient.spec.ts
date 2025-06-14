import { UpdateClientUseCase } from '../updateClient';
import { ClientRepository } from '../../../repositories/ClientRepository';
import { RedisService } from '../../../services/RedisService';
import { Logger } from '../../../logger/LoggerInterface';
import { Client } from '../../../entities/Client';

describe('UpdateClientUseCase', () => {
  let clientRepo: jest.Mocked<ClientRepository>;
  let redis: jest.Mocked<RedisService>;
  let logger: jest.Mocked<Logger>;
  let useCase: UpdateClientUseCase;

  beforeEach(() => {
    clientRepo = {
      findById: jest.fn(),
      update: jest.fn(),
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

    useCase = new UpdateClientUseCase(clientRepo, redis, logger);
  });

  it('deve atualizar o cliente e atualizar o cache', async () => {
    const id = '1';
    const data = { name: 'Novo Nome' };
    const existingClient: Client = { id, email: 'a@a.com', name: 'Antigo Nome' };
    const updatedClient: Client = { id, email: 'a@a.com', name: 'Novo Nome' };

    clientRepo.findById.mockResolvedValue(existingClient);
    clientRepo.update.mockResolvedValue(updatedClient);

    const result = await useCase.execute(id, data);

    expect(clientRepo.findById).toHaveBeenCalledWith(id);
    expect(clientRepo.update).toHaveBeenCalledWith(id, data);
    expect(redis.set).toHaveBeenCalledWith(
      `client:${updatedClient.id}`,
      JSON.stringify(updatedClient),
      expect.any(Number)
    );
    expect(redis.del).toHaveBeenCalledWith('clients');
    expect(logger.info).toHaveBeenCalledWith(`Client with id ${id} updated successfully: %o`, updatedClient);
    expect(result).toEqual(updatedClient);
  });

  it('deve retornar null e logar se cliente não existir', async () => {
    clientRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('notfound', { name: 'Novo' });

    expect(clientRepo.findById).toHaveBeenCalledWith('notfound');
    expect(logger.warn).toHaveBeenCalledWith('Client with id notfound not found');
    expect(result).toBeNull();
  });

  it('deve retornar null e logar se update falhar', async () => {
    const id = '1';
    const data = { name: 'Novo Nome' };
    const existingClient: Client = { id, email: 'a@a.com', name: 'Antigo Nome' };

    clientRepo.findById.mockResolvedValue(existingClient);
    clientRepo.update.mockResolvedValue(null);

    const result = await useCase.execute(id, data);

    expect(clientRepo.update).toHaveBeenCalledWith(id, data);
    expect(logger.error).toHaveBeenCalledWith('Failed to update client with id 1');
    expect(result).toBeNull();
  });
});