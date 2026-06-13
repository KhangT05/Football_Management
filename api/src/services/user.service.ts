// services/user.service.ts
import bcrypt from "bcrypt";
import { PrismaClient, Role, User } from "../generated/prisma/client.js";
import { PaginatedResult, Queryable, QueryRequest } from "../libs/queryable.js";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.schema.js";
import { createAppError } from "../common/app.error.js";
import { RelationService } from "../libs/relation.service.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SafeUser = Omit<User, "password">;

// ─── Projection ───────────────────────────────────────────────────────────────

const USER_SELECT = {
    omit: { password: true } as const,
};

// ─── Service ──────────────────────────────────────────────────────────────────

export class UserService {
    private readonly query: Queryable<SafeUser>;

    private readonly rolesRelationService = new RelationService({
        table: "user_role",
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
        });
    }

    // ─── Read ──────────────────────────────────────────────────────────────────

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

        // Tách role_ids ra — không update trực tiếp qua user.update
        const { role_ids, ...fields } = data;
        const patch = Object.fromEntries(
            Object.entries(fields).filter(([, v]) => v !== undefined)
        );

        return this.prisma.user.update({ where: { id }, data: patch, ...USER_SELECT });
    }

    async updatePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw createAppError("NOT_FOUND", `User ${id} not found`);

        const valid = await bcrypt.compare(currentPassword, user.password);
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
    }

    async detachRoles(userId: number, roleIds: number[]): Promise<void> {
        await this.rolesRelationService.detach(userId, roleIds, this.prisma);
    }

    /** Replace toàn bộ role set — wrap $transaction enforce bởi RelationService.sync */
    async syncRoles(userId: number, roleIds: number[]): Promise<void> {
        await this.prisma.$transaction((tx) =>
            this.rolesRelationService.sync(userId, roleIds, tx)
        );
    }
}