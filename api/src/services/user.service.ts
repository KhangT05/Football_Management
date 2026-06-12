import { CreateUserDto, UpdateUserDto } from "../dtos/user.schema.js";
import { PrismaClient, User } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";
import { PaginatedResult, Queryable, QueryRequest } from "../libs/queryable.js";

export type SafeUser = Omit<User, "password">;

export class UserService {

    private readonly query: Queryable<SafeUser>;

    constructor(
        private readonly prisma: PrismaClient
    ) {
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

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<SafeUser>> {
        // return this.prisma.user.findMany({
        //     where: { is_active: true },
        //     omit: { password: true },
        // });
        return this.query.run(req);
    }
    findById(id: number): Promise<SafeUser | null> {
        return this.prisma.user.findUnique({
            where: { id },
            omit: { password: true },
        });
    }

    async findByIdOrFail(id: number): Promise<SafeUser> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            omit: { password: true },
        });
        if (!user) throw new Error(`User ${id} not found`);
        return user;
    }

    findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async create(data: CreateUserDto): Promise<SafeUser> {

        const existing = await this.findByEmail(data.email);
        if (existing) throw new Error("Email đã tồn tại.");
        const hashed = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                ...data,
                password: hashed,

            },
            omit: { password: true },
        });
    }

    update(id: number, data: UpdateUserDto): Promise<SafeUser> {
        const clean = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined)
        );
        return this.prisma.user.update({
            where: { id },
            data: clean,
            omit: { password: true },
        });
    }

    async softDelete(id: number): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { is_active: false },
        });
    }
}