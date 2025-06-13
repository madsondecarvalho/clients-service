// src/data/ClientRepositoryImpl.ts
import { ClientRepository } from '../repositories/ClientRepository';
import { Client } from '../entities/Client';
import { IClient, Client as ClientModel } from '../models/client';

export class ClientRepositoryImpl implements ClientRepository {
  async create(data: Partial<Client>): Promise<Client> {
    const doc = await ClientModel.create(data);
    return this.mapDocToEntity(doc);
  }

  async findById(id: string): Promise<Client | null> {
    const doc = await ClientModel.findById(id);
    if (!doc) return null;
    return this.mapDocToEntity(doc);
  }

  async findAll(): Promise<Client[]> {
    const docs = await ClientModel.find();
    return docs.map(doc => this.mapDocToEntity(doc));
  }

  async update(id: string, data: Partial<Client>): Promise<Client | null> {
    const doc = await ClientModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!doc) return null;
    return this.mapDocToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const doc = await ClientModel.findByIdAndDelete(id);
    return !!doc;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const doc = await ClientModel.findOne({ email });
    if (!doc) return null;
    return this.mapDocToEntity(doc);
  }

  async findByPhone(phone: string): Promise<Client | null> {
    const doc = await ClientModel.findOne({ phone });
    if (!doc) return null;
    return this.mapDocToEntity(doc);
  }

  private mapDocToEntity(doc: IClient): Client {
    return new Client({
      id: doc.id.toString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
