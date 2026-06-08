import { PrismaClient } from "../../generated/prisma/client.js";
import { IBaseRepository } from "../ibaserepository.js";

type ModelDelegate = {
    findFirst(args: any): Promise<any>;
    findMany(args?: any): Promise<any[]>;
    create(args: any): Promise<any>;
    update(args: any): Promise<any>;
    delete(args: any): Promise<any>;
};
export abstract class BaseRepository<T, CreateDTO, UpdateDTO>
    implements IBaseRepository<T, CreateDTO, UpdateDTO> {
    constructor(
        protected readonly model: ModelDelegate,
        protected readonly prisma: PrismaClient,
        protected readonly modelName: string
    ) { }
    findAll(): Promise<T[]> {
        return this.model.findMany({ where: { deletedAt: null } });
    }
    findById(id: number): Promise<T | null> {
        return this.model.findFirst({ where: { id, deletedAt: null } });
    }
    async findByIdOrFail(id: number): Promise<T> {
        const entity = await this.findById(id);
        if (!entity) throw new Error(`${this.modelName} #${id} không tồn tại.`);
        return entity;

    }
    create(data: CreateDTO): Promise<T> {
        return this.model.create({ data });
    }
    update(id: number, data: UpdateDTO): Promise<T | null> {
        return this.model.update({ where: { id }, data });
    }
    delete(id: number): Promise<void> {
        return this.model.delete({ where: { id } });
    }
    softDelete(id: number): Promise<void> {
        return this.model.update({ where: { id }, data: { deletedAt: new Date() } });
    }
}