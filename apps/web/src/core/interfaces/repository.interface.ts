export interface Repository<TEntity> {
  findAll(): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity | null>;
}
