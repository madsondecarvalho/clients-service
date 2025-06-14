import { ClientRepository } from '../../repositories/ClientRepository';
import { Logger } from '../../logger/LoggerInterface';
import { RedisService } from '../../services/RedisService';

export class DeleteClientUseCase {
  constructor(
    private clientRepo: ClientRepository,
    private redis: RedisService,
    private logger: Logger
  ) {}

  async execute(id: string): Promise<boolean> {
    this.logger.info(`Attempting to delete client with id: ${id}`);
    try {
      const result = await this.clientRepo.delete(id);
      if (result) {
        this.logger.info(`Client with id ${id} deleted successfully`);

        this.redis.del(`client:${id}`);
        this.redis.del('clients'); 
      } else {
        this.logger.warn(`Client with id ${id} not found`);
      }
      return result;
    } catch (error) {
      this.logger.error('Error deleting client: %o', error);
      throw error;
    }
  }
}