/**
 * Base repository interface defining standard CRUD operations
 */
export interface IRepository<T, CreateDTO, UpdateDTO> {
  create(data: CreateDTO): Promise<T>;
  findById(id: number): Promise<T | null>;
  findAll(limit?: number, offset?: number): Promise<T[]>;
  update(id: number, data: UpdateDTO): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
