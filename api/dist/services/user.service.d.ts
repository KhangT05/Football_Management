import { PrismaClient, Role, User } from "../generated/prisma/client.js";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.schema.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
export type SafeUser = Omit<User, "password"> & {
    roles?: Role[];
};
export declare class UserService {
    private readonly prisma;
    private readonly query;
    private readonly rolesRelationService;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<SafeUser>>;
    findById(id: number): Promise<SafeUser | null>;
    findByIdOrFail(id: number): Promise<SafeUser>;
    /** Full record including password — auth only, never expose */
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserDto): Promise<SafeUser>;
    update(id: number, data: UpdateUserDto): Promise<SafeUser>;
    updatePassword(id: number, currentPassword: string, newPassword: string): Promise<void>;
    softDelete(id: number): Promise<void>;
    getRoles(userId: number): Promise<Role[]>;
    /** Idempotent — skipDuplicates, safe khi gọi nhiều lần */
    attachRoles(userId: number, roleIds: number[]): Promise<void>;
    detachRoles(userId: number, roleIds: number[]): Promise<void>;
    /** Replace toàn bộ role set — wrap $transaction enforce bởi RelationService.sync */
    syncRoles(userId: number, roleIds: number[]): Promise<void>;
    restore(id: number): Promise<SafeUser>;
    updateAvatar(id: number, avatarFile: Express.Multer.File): Promise<SafeUser>;
    private resetTokenKey;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map