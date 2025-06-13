import { Client } from '../entities/Client';
import { BaseRepository } from './BaseRepository';

export interface ClientRepository extends BaseRepository<Client> {
  findByEmail(email: string): Promise<Client | null>;
  findByPhone(phone: string): Promise<Client | null>;
}
