import { CreateClientMessageUseCase } from '../createClientMessage';
import { ClientRepository } from '../../../repositories/ClientRepository';
import { EventPublisher } from '../../../services/EventPublisher';
import { Logger } from '../../../logger/LoggerInterface';

describe('CreateClientMessageUseCase', () => {
    let clientRepo: jest.Mocked<ClientRepository>;
    let eventPublisher: jest.Mocked<EventPublisher>;
    let logger: jest.Mocked<Logger>;
    let useCase: CreateClientMessageUseCase;

    beforeEach(() => {
        clientRepo = {
            findByEmail: jest.fn(),
        } as any;

        eventPublisher = {
            publish: jest.fn(),
        } as any;

        logger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        };

        useCase = new CreateClientMessageUseCase(eventPublisher, clientRepo, logger);
    });

    it('deve retornar erro se o email já estiver cadastrado', async () => {
        clientRepo.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com', name: 'Test User' });

        const result = await useCase.execute({ email: 'test@example.com' });

        expect(clientRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(logger.warn).toHaveBeenCalledWith('Attempt to create client with duplicate email');
        expect(result).toEqual({ message: 'Email já cadastrado', data: { email: 'test@example.com' } });
        expect(eventPublisher.publish).not.toHaveBeenCalled();
    });

    it('deve publicar evento se o email não existir', async () => {
        clientRepo.findByEmail.mockResolvedValue(null);
        eventPublisher.publish.mockResolvedValue(undefined);

        const data = { email: 'new@example.com', name: 'New' };
        const result = await useCase.execute(data);

        expect(clientRepo.findByEmail).toHaveBeenCalledWith('new@example.com');
        expect(eventPublisher.publish).toHaveBeenCalledWith('CREATE_CLIENT', data);
        expect(logger.info).toHaveBeenCalledWith('Client creation event published successfully');
        expect(result).toEqual({ message: 'Client created successfully', data });
    });

    it('deve retornar erro se o email já estiver cadastrado', async () => {
        clientRepo.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com', name: 'Test User' });

        const result = await useCase.execute({ email: 'test@example.com' });

        expect(clientRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(logger.warn).toHaveBeenCalledWith('Attempt to create client with duplicate email');
        expect(result).toEqual({ message: 'Email já cadastrado', data: { email: 'test@example.com' } });
        expect(eventPublisher.publish).not.toHaveBeenCalled();
    });

    it('deve lançar erro inesperado', async () => {
        clientRepo.findByEmail.mockResolvedValue(null);
        const error = new Error('Unexpected');
        eventPublisher.publish.mockRejectedValue(error);

        await expect(useCase.execute({ email: 'fail@example.com' })).rejects.toThrow('Unexpected');
        expect(logger.error).toHaveBeenCalledWith('Error creating client message: %o', error);
    });
});