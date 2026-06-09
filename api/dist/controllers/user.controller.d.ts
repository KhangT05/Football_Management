import { Controller } from "tsoa";
import { UserService, SafeUser } from "../services/user.service.js";
import * as userSchema from "../dtos/user.schema.js";
export declare class UserController extends Controller {
    private service;
    constructor(service: UserService);
    findAll(): Promise<SafeUser[]>;
    findById(id: number): Promise<SafeUser>;
    create(body: userSchema.CreateUserDto): Promise<SafeUser>;
    update(id: number, body: userSchema.UpdateUserDto): Promise<SafeUser>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map