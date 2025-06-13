// src/usecases/client/updateClient.ts
import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';

export class UpdateClientUseCase {
  constructor(private clientRepo: ClientRepository) {}

  async execute(id: string, data: Partial<Client>): Promise<Client | null> {
    return this.clientRepo.update(id, data);
  }
}
