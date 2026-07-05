import { Controller } from "tsoa";
import { UserService, type SafeUser } from "../services/user.service.js";
import { type CreateUserDto, type UpdateUserDto } from "../dtos/user.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
export declare class UserController extends Controller {
    private service;
    constructor(service: UserService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<SafeUser>>;
    findById(id: number): Promise<SafeUser>;
    create(body: CreateUserDto): Promise<SafeUser>;
    update(id: number, body: UpdateUserDto): Promise<SafeUser>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<SafeUser>;
}
//# sourceMappingURL=user.controller.d.ts.map