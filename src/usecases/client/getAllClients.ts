import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';

export class GetAllClientsUseCase {
  constructor(private clientRepo: ClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.clientRepo.find();
  }
}
