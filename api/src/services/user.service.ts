// services/user.service.ts
import bcrypt from "bcrypt";
import { PrismaClient, Role, User } from "../generated/prisma/client.js";
import { Queryable } from "../libs/queryable.js";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.schema.js";
import { createAppError } from "../common/app.error.js";
import { RelationService } from "../libs/relation.service.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { mailService } from "./mail.service.js";
import crypto from "crypto";
import redis from "../libs/redis.js";
import { storageService } from "./storage.service.js";
import { invalidateUserRoles } from "../libs/session.js";
export type SafeUser = Omit<User, "password"> & { roles?: Role[] };

// ─── Projection ───────────────────────────────────────────────────────────────

const USER_SELECT = {
    omit: { password: true } as const,
};

// FIX: include cho Queryable.findAll() — trước đây không có, nên list user
// luôn thiếu role (bug "danh sách user không lấy được role").
const USER_ROLES_INCLUDE = {
    user_roles: {
        where: { role: { is_active: true } },
        select: { role: true },
    },
} as const;

// ─── Service ──────────────────────────────────────────────────────────────────

export class UserService {
    private readonly query: Queryable<SafeUser>;

    // FIX: table name phải khớp CHÍNH XÁC tên delegate Prisma Client generate
    // cho model "User_Role" (không có @@map trong schema.prisma) — Prisma
    // lowercase ký tự đầu, giữ nguyên phần còn lại -> "user_Role", không phải
    // "user_role". Trước đây sai tên -> RelationService.model() luôn throw
    // "not found on Prisma client" ngay từ attach/detach/sync đầu tiên, khiến
    // mọi thao tác sửa role user (RolesTab) fail 100%.
    private readonly rolesRelationService = new RelationService({
        table: "user_Role",
        ownerKey: "user_id",
        targetKey: "role_id",
        validateOwner: async (id, db) => {
            const exists = await (db as any).user.findUnique({ where: { id }, select: { id: true } });
            if (!exists) throw createAppError("NOT_FOUND", `User ${id} not found`);
        },
        validateTargets: async (ids, db) => {
            const found = await (db as any).role.findMany({
                where: { id: { in: ids }, is_active: true },
                select: { id: true },
            });
            if (found.length !== ids.length) {
                const missing = ids.filter((id: number) => !found.some((r: { id: number }) => r.id === id));
                throw createAppError("BAD_REQUEST", `Role IDs không hợp lệ: ${missing.join(", ")}`);
            }
        },
    });

    constructor(private readonly prisma: PrismaClient) {
        this.query = new Queryable<SafeUser>(prisma.user, {
            searchFields: ["name", "email", "phone"],
            sortable: ["id", "name", "created_at"],
            defaultSort: { column: "id", direction: "asc" },
            filterable: ["is_active"],
            defaultPerPage: 20,
            maxPerPage: 100,
            beforeBuild: (where) => {
                where.push({ is_active: true });
            },
            // FIX: thêm include để join user_roles trong list — không set kèm
            // `select` nên không xung đột với logic build của Queryable.
            include: USER_ROLES_INCLUDE,
            // FIX: flatten user_roles[].role -> roles: Role[], đồng thời bỏ
            // password (Prisma include không tự omit theo USER_SELECT được vì
            // include và omit không kết hợp cùng lúc trong 1 query — xử lý ở
            // afterFetch thay vì select).
            afterFetch: (rows: any[]) =>
                rows.map(({ password, user_roles, ...rest }) => ({
                    ...rest,
                    roles: (user_roles ?? []).map((ur: any) => ur.role),
                })),
        });
    }

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<SafeUser>> {
        return this.query.run(req);
    }

    findById(id: number): Promise<SafeUser | null> {
        return this.prisma.user.findUnique({ where: { id }, ...USER_SELECT });
    }

    async findByIdOrFail(id: number): Promise<SafeUser> {
        const user = await this.findById(id);
        if (!user) throw createAppError("NOT_FOUND", `User ${id} not found`);
        return user;
    }

    /** Full record including password — auth only, never expose */
    findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    // ─── Write ─────────────────────────────────────────────────────────────────

    async create(data: CreateUserDto): Promise<SafeUser> {
        const existing = await this.findByEmail(data.email);
        if (existing) throw createAppError("CONFLICT", `Email ${data.email} already exists`);

        const hashed = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: { ...data, password: hashed },
            ...USER_SELECT,
        });
    }

    async update(id: number, data: UpdateUserDto): Promise<SafeUser> {
        const exists = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
        if (!exists) throw createAppError("NOT_FOUND", `User ${id} not found`);

        const { role_ids, ...fields } = data;
        const patch = Object.fromEntries(
            Object.entries(fields).filter(([, v]) => v !== undefined)
        );

        const user = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.user.update({ where: { id }, data: patch, ...USER_SELECT });
            if (role_ids !== undefined) {
                await this.rolesRelationService.sync(id, role_ids, tx);
            }
            return updated;
        });

        return user;
    }

    async updatePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw createAppError("NOT_FOUND", `User ${id} not found`);

        const valid = await bcrypt.compare(currentPassword, user.password!);
        if (!valid) throw createAppError("UNAUTHORIZED", "Mật khẩu hiện tại không đúng");

        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({ where: { id }, data: { password: hashed } });
    }

    async softDelete(id: number): Promise<void> {
        const exists = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
        if (!exists) throw createAppError("NOT_FOUND", `User ${id} not found`);

        await this.prisma.user.update({ where: { id }, data: { is_active: false } });
    }

    // ─── Role N-N ──────────────────────────────────────────────────────────────

    async getRoles(userId: number): Promise<Role[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                user_roles: {
                    where: { role: { is_active: true } },
                    select: { role: true },
                },
            },
        });
        if (!user) throw createAppError("NOT_FOUND", `User ${userId} not found`);
        return user.user_roles.map((ur) => ur.role);
    }

    /** Idempotent — skipDuplicates, safe khi gọi nhiều lần */
    async attachRoles(userId: number, roleIds: number[]): Promise<void> {
        await this.rolesRelationService.attach(userId, roleIds, this.prisma);
        await invalidateUserRoles(userId);
    }

    async detachRoles(userId: number, roleIds: number[]): Promise<void> {
        await this.rolesRelationService.detach(userId, roleIds, this.prisma);
        await invalidateUserRoles(userId);
    }

    /** Replace toàn bộ role set — wrap $transaction enforce bởi RelationService.sync */
    async syncRoles(userId: number, roleIds: number[]): Promise<void> {
        await this.prisma.$transaction((tx) =>
            this.rolesRelationService.sync(userId, roleIds, tx)
        );
        await invalidateUserRoles(userId);
    }

    async restore(id: number): Promise<SafeUser> {
        const result = await this.prisma.user.updateMany({
            where: { id, is_active: false },
            data: {
                is_active: true,
            },
        });
        if (result.count === 0) {
            throw createAppError("NOT_FOUND", `user ${id} not found or not deleted`);
        }
        return this.findByIdOrFail(id);
    }

    async updateAvatar(id: number, avatarFile: Express.Multer.File): Promise<SafeUser> {
        const exists = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
        if (!exists) throw createAppError("NOT_FOUND", `User ${id} not found`);

        const result = await storageService.upload({ namespace: "users", kind: "avatar", file: avatarFile });

        // TODO: old avatar leak until schema adds avatar_public_id column
        return this.prisma.user.update({
            where: { id },
            data: { avatar: result.url },
            ...USER_SELECT,
        });
    }

    // ─── Forgot / Reset password ────────────────────────────────────────────────

    private resetTokenKey(tokenHash: string): string {
        return `reset-password:${tokenHash}`;
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return; // im lặng — tránh user enumeration

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        await redis.set(this.resetTokenKey(tokenHash), String(user.id), { EX: 60 * 60 });

        try {
            await mailService.sendResetPasswordEmail(user.email, { token, name: user.name });
        } catch (err) {
            console.error(`[UserService] Failed to send reset password email to ${user.email}`, err);
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const key = this.resetTokenKey(tokenHash);

        const userId = await redis.get(key);
        if (!userId) throw createAppError("BAD_REQUEST", "Token không hợp lệ hoặc đã hết hạn");

        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: Number(userId) },
            data: { password: hashed },
        });

        await redis.del(key);
    }
}