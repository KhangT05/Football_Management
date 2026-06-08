import { IBaseRepository } from "../repositories/ibaserepository.js";


export abstract class BaseService<T, CreateDTO, UpdateDTO> {
    constructor(
        protected readonly repository: IBaseRepository<T, CreateDTO, UpdateDTO>
    ) { }

    findById(id: number): Promise<T | null> {
        return this.repository.findById(id);
    }

    findByIdOrFail(id: number): Promise<T> {
        return this.repository.findByIdOrFail(id);
    }

    findAll(): Promise<T[]> {
        return this.repository.findAll();
    }

    create(data: CreateDTO): Promise<T> {
        return this.repository.create(data);
    }

    update(id: number, data: UpdateDTO): Promise<T | null> {
        return this.repository.update(id, data);
    }

    softDelete(id: number): Promise<void> {
        return this.repository.softDelete(id);
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id);
    }
}