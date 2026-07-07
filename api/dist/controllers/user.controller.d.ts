import { Controller } from "tsoa";
import { UserService, type SafeUser } from "../services/user.service.js";
import * as userSchema from "../dtos/user.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
export declare class UserController extends Controller {
    private service;
    constructor(service: UserService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<SafeUser>>;
    findById(id: number): Promise<SafeUser>;
    create(body: userSchema.CreateUserDto): Promise<SafeUser>;
    update(id: number, body: userSchema.UpdateUserDto): Promise<SafeUser>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<SafeUser>;
    updateAvatar(id: number, avatar: Express.Multer.File): Promise<SafeUser>;
    updatePassword(id: number, body: userSchema.ChangePasswordDto): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map