import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';
import { Logger } from '../../logger/LoggerInterface';

export class CreateClientUseCase {
  constructor(
    private clientRepo: ClientRepository,
    private logger: Logger
  ) {}

  async execute(data: Partial<Client>): Promise<{message: string, data?: Partial<Client>}> {
    this.logger.info('Attempting to create a new client');
    try {
      const client = await this.clientRepo.create(data);
      this.logger.info('Client created successfully: %o', client);
      return {message: 'Client created successfully', data: client};
    } catch (error: any) {
      if (error.code === 11000) {
        this.logger.warn('Attempt to create client with duplicate email');
        return {message: 'Email já cadastrado'};
      }
      this.logger.error('Error creating client: %o', error);
      throw error;
    }
  }
}