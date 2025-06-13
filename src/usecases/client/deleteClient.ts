// src/usecases/client/deleteClient.ts
import { ClientRepository } from '../../repositories/ClientRepository';

export class DeleteClientUseCase {
  constructor(private clientRepo: ClientRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.clientRepo.delete(id);
  }
}
