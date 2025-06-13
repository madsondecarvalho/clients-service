// src/usecases/client/createClient.ts
import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';

export class CreateClientUseCase {
  constructor(private clientRepo: ClientRepository) {}

  async execute(data: Partial<Client>): Promise<Client> {
    return this.clientRepo.create(data);
  }
}
