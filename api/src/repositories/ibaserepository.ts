export interface IBaseRepository<T, CreateDTO, UpdateDTO> {
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    findByIdOrFail(id: number): Promise<T>;
    create(data: CreateDTO): Promise<T>;
    update(id: number, data: UpdateDTO): Promise<T | null>;
    delete(id: number): Promise<void>;
    softDelete(id: number): Promise<void>;
}