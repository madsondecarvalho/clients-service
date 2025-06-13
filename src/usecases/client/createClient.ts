import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';

export class CreateClientUseCase {
  constructor(
    private clientRepo: ClientRepository,
  ) {}

  async execute(data: Partial<Client>): Promise<{message: string, data?: Partial<Client>}> {
    try {
      const client = await this.clientRepo.create(data);
      return {message: 'Client created successfully', data: client};
    } catch (error: any) {
      if (error.code === 11000) {
        return {message: 'Email já cadastrado'};
      }
      throw error;
    }
  }
}
