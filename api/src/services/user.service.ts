import { CreateUserDto, UpdateUserDto } from "../dtos/user.schema.js";
import { PrismaClient, User } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";
import prisma from "../libs/prisma.js";

export type SafeUser = Omit<User, "password">;

export class UserService {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    findAll(): Promise<SafeUser[]> {
        return prisma.user.findMany({
            where: { is_active: true },
            omit: { password: true },
        });
    }

    findById(id: number): Promise<SafeUser | null> {
        return prisma.user.findUnique({
            where: { id },
            omit: { password: true },
        });
    }

    async findByIdOrFail(id: number): Promise<SafeUser> {
        const user = await prisma.user.findUnique({
            where: { id },
            omit: { password: true },
        });
        if (!user) throw new Error(`User ${id} not found`);
        return user;
    }

    findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async create(data: CreateUserDto): Promise<SafeUser> {
        const existing = await this.findByEmail(data.email);
        if (existing) throw new Error("Email đã tồn tại.");
        const hashed = await bcrypt.hash(data.password, 10);
        return prisma.user.create({
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
        return prisma.user.update({
            where: { id },
            data: clean,
            omit: { password: true },
        });
    }

    async softDelete(id: number): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { is_active: false },
        });
    }
}