import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';
import { RedisService } from '../../services/RedisService';
import { Logger } from '../../logger/LoggerInterface';

export class GetClientByIdUseCase {
  constructor(
    private clientRepo: ClientRepository,
    private redis: RedisService,
    private logger: Logger
  ) {}

  async execute(id: string): Promise<Client | null> {
    this.logger.info(`Fetching client with id: ${id}`);

    const cachedClient = await this.redis.get(`client:${id}`);
    if (cachedClient) {
      this.logger.info(`Client with id ${id} found in cache`);
      return JSON.parse(cachedClient);
    }

    const client = await this.clientRepo.findById(id);

    if (client) {
      this.logger.info(`Client with id ${id} found in database, caching result`);
      await this.redis.set(`client:${id}`, JSON.stringify(client), Number(process.env.CACHE_TTL) || 3600 );
    } else {
      this.logger.warn(`Client with id ${id} not found`);
    }

    return client;
  }
}