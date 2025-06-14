import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';
import { Logger } from '../../logger/LoggerInterface';
import { RedisService } from '../../services/RedisService';

export class GetAllClientsUseCase {
  constructor(
    private clientRepo: ClientRepository,
    private redis: RedisService,
    private logger: Logger
  ) {}

  async execute(): Promise<Client[]> {
    this.logger.info('Fetching all clients');
    try {
      const cachedClients = await this.redis.get(`clients`);

      if (cachedClients) {
        this.logger.info('Clients found in cache');
        return JSON.parse(cachedClients);
      }

      const clients = await this.clientRepo.find();
      this.logger.info(`Fetched ${clients.length} clients`);

      if (clients.length > 0) {
        this.logger.info('Caching clients result');
        await this.redis.set(`clients`, JSON.stringify(clients), Number(process.env.CACHE_TTL) || 3600);
      } else {
        this.logger.warn('No clients found in database');
      }

      return clients;
    } catch (error) {
      this.logger.error('Error fetching clients: %o', error);
      throw error;
    }
  }
}