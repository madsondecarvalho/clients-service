import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';
import { EventPublisher } from '../../services/EventPublisher';
import { Logger } from '../../logger/LoggerInterface';

export class CreateClientMessageUseCase {
  constructor(
    private eventPublisher: EventPublisher,
    private clientRepo: ClientRepository,
    private logger: Logger
  ) {}

  async execute(data: Partial<Client>): Promise<{message: string, data?: Partial<Client>}> {
    try {
      this.logger.info('Checking if client email already exists');
      const email = data.email as string;

      const existingClient = await this.clientRepo.findByEmail(email);

      if (existingClient) {
        this.logger.warn('Attempt to create client with duplicate email');
        return {message: 'Email já cadastrado', data};
      }

      this.logger.info('Publishing CREATE_CLIENT event');
      await this.eventPublisher.publish('CREATE_CLIENT', data);

      this.logger.info('Client creation event published successfully');
      return {message: 'Client created successfully', data};
    } catch (error: any) {
      if (error.code === 11000) {
        this.logger.warn('Attempt to create client with duplicate email (caught by error code)');
        return {message: 'Email já cadastrado'};
      }
      this.logger.error('Error creating client message: %o', error);
      throw error;
    }
  }
}