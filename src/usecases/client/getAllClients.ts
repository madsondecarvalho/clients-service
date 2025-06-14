import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';
import { Logger } from '../../logger/LoggerInterface';

export class GetAllClientsUseCase {
  constructor(
    private clientRepo: ClientRepository,
    private logger: Logger
  ) {}

  async execute(): Promise<Client[]> {
    this.logger.info('Fetching all clients');
    try {
      const clients = await this.clientRepo.find();
      this.logger.info(`Fetched ${clients.length} clients`);
      return clients;
    } catch (error) {
      this.logger.error('Error fetching clients: %o', error);
      throw error;
    }
  }
}