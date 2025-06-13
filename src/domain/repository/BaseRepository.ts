export interface BaseRepository<T, ID = string> {
  save(entity: T): Promise<T>;
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: ID): Promise<void>;
}
