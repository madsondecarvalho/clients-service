import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';
import { Logger } from '../../logger/LoggerInterface';
import { RedisService } from '../../services/RedisService';


export class UpdateClientUseCase {
  constructor(
    private clientRepo: ClientRepository,
    private redis: RedisService,
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

    if (!updatedClient) {
      this.logger.error(`Failed to update client with id ${id}`);
      return null;
    }

    this.logger.info(`Client with id ${id} updated successfully: %o`, updatedClient);
    this.logger.info(`Updating cache for client with id ${id}`);
    this.redis.set(`client:${updatedClient.id}`, JSON.stringify(updatedClient), Number(process.env.CACHE_TTL) || 3600);
    this.redis.del('clients'); 

    return updatedClient;
  }
}