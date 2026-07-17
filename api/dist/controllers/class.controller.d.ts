import { Controller } from "tsoa";
import { ClassService } from "../services/class.service.js";
import type { Class } from "../generated/prisma/client.js";
import * as classSchema from "../dtos/class.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
export declare class ClassController extends Controller {
    private readonly service;
    constructor(service: ClassService);
    /** Danh sách active, không phân trang — dùng cho dropdown/select. */
    listActive(): Promise<Class[]>;
    findDeleted(): Promise<Class[]>;
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<Class>>;
    findById(id: number): Promise<Class>;
    create(body: classSchema.CreateClassDto): Promise<Class>;
    update(id: number, body: classSchema.UpdateClassDto): Promise<Class>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<Class>;
}
//# sourceMappingURL=class.controller.d.ts.map