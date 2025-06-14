import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';
import { EventPublisher } from '../../services/EventPublisher';

export class CreateClientMessageUseCase {
  constructor(
    private eventPublisher: EventPublisher,
    private clientRepo: ClientRepository
  ) {}

  async execute(data: Partial<Client>): Promise<{message: string, data?: Partial<Client>}> {
    try {
      const email = data.email as string;
      
      const existingClient = await this.clientRepo.findByEmail(email);
      
      if (existingClient) {
        return {message: 'Email já cadastrado', data};
      }

      await this.eventPublisher.publish('CREATE_CLIENT', data);
      
      return {message: 'Client created successfully', data};
    } catch (error: any) {
      if (error.code === 11000) {
        return {message: 'Email já cadastrado'};
      }
      throw error;
    }
  }
}
