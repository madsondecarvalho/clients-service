import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';
import { Logger } from '../../logger/LoggerInterface';

export class UpdateClientUseCase {
  constructor(
    private clientRepo: ClientRepository,
    private logger: Logger
  ) {}

  async execute(id: string, data: Partial<Client>): Promise<Client | null> {
    this.logger.info(`Attempting to update client with id: ${id}`);

    const existingClient = await this.clientRepo.findById(id);

    if (!existingClient) {
      this.logger.warn(`Client with id ${id} not found`);
      return null;
    }

    const updatedClient = await this.clientRepo.update(id, data);
    this.logger.info(`Client with id ${id} updated successfully`);
    return updatedClient;
  }
}