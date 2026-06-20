import { Controller } from "tsoa";
import { RoleService } from "../services/role.service.js";
import type { Role } from "../generated/prisma/client.js";
import { type CreateRoleDto, type UpdateRoleDto } from "../dtos/role.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
export declare class RoleController extends Controller {
    private service;
    constructor(service: RoleService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<Role>>;
    findById(id: number): Promise<Role>;
    create(body: CreateRoleDto): Promise<Role>;
    update(id: number, body: UpdateRoleDto): Promise<Role>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=role.controller.d.ts.map