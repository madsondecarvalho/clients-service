import { ClientRepository } from '../../repositories/ClientRepository';
import { Logger } from '../../logger/LoggerInterface';

export class DeleteClientUseCase {
  constructor(
    private clientRepo: ClientRepository,
    private logger: Logger
  ) {}

  async execute(id: string): Promise<boolean> {
    this.logger.info(`Attempting to delete client with id: ${id}`);
    try {
      const result = await this.clientRepo.delete(id);
      if (result) {
        this.logger.info(`Client with id ${id} deleted successfully`);
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