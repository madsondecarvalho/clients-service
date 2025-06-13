// src/usecases/client/getClientById.ts
import { Client } from '../../entities/Client';
import { ClientRepository } from '../../repositories/ClientRepository';

export class GetClientByIdUseCase {
  constructor(private clientRepo: ClientRepository) {}

  async execute(id: string): Promise<Client | null> {
    return this.clientRepo.findById(id);
  }
}
