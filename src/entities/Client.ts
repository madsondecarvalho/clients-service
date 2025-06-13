import { BaseEntity } from './BaseEntity';

export class Client extends BaseEntity {
  name: string;
  email: string;
  phone?: string;

  constructor({ id, name, email, phone, createdAt, updatedAt }: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
