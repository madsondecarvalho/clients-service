import { Repository, DataSource } from 'typeorm';
import { BaseEntity } from '../../domain/entities/BaseEntity';
import { BaseRepository } from '../../domain/repositories/BaseRepository';

export abstract class TypeORMBaseRepository<
  E extends BaseEntity<ID>,
  ID = string
> implements BaseRepository<E, ID> {
  protected ormRepo: Repository<E>;

  constructor(protected dataSource: DataSource, entityClass: new () => E) {
    this.ormRepo = dataSource.getRepository(entityClass);
  }

  async save(entity: E): Promise<E> {
    entity.touch();
    await this.ormRepo.save(entity as any);
    return entity;
  }

  async findById(id: ID): Promise<E | null> {
    return await this.ormRepo.findOneBy({ id } as any);
  }

  async findAll(): Promise<E[]> {
    return await this.ormRepo.find();
  }

  async delete(id: ID): Promise<void> {
    await this.ormRepo.delete(id as any);
  }
}
