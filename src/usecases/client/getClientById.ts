import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';
import { RedisService } from '../../services/RedisService';

export class GetClientByIdUseCase {
  constructor(private clientRepo: ClientRepository, private redis: RedisService) {}

  async execute(id: string): Promise<Client | null> {
    const cachedClient = await this.redis.get(`client:${id}`);

    if (cachedClient) {
      return JSON.parse(cachedClient);
    }

    const client = await this.clientRepo.findById(id);

    if (client) {
      await this.redis.set(`client:${id}`, JSON.stringify(client), Number(process.env.CACHE_TTL) || 3600 );
    }

    return client;
  }
}
