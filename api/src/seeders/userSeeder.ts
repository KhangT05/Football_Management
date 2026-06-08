
import bcrypt from "bcrypt";
import { RoleName } from "./roleSeeder.js";
import { PrismaClient } from "../generated/prisma/client.js";

const BCRYPT_ROUNDS = 12;

interface SeedUser {
    name: string;
    email: string;
    password: string;
    phone?: string;
    roles: RoleName[];
    emailVerified: boolean;
}

const SEED_USERS: SeedUser[] = [
    {
        name: "System Admin",
        email: "admin@gmail.com",
        password: "password",
        roles: ["admin"],
        emailVerified: true,
    },
    {
        name: "Nguyễn Văn An",
        email: "an.2021001@student.edu.vn",
        password: "Player@123456",
        phone: "0901000001",
        roles: ["player", "leader"],
        emailVerified: true,
    },
    {
        name: "Trần Minh Khoa",
        email: "khoa.2021002@student.edu.vn",
        password: "Player@123456",
        phone: "0901000002",
        roles: ["player"],
        emailVerified: true,
    },
    {
        name: "Lê Văn Trọng Tài",
        email: "trongtai@football.local",
        password: "Referee@123456",
        roles: ["referee"],
        emailVerified: true,
    },
    {
        name: "Phạm Thị Bình",
        email: "binh.register@student.edu.vn",
        password: "User@123456",
        phone: "0901000005",
        roles: ["user"],
        emailVerified: false,
    },
];

export async function seedUsers(
    db: PrismaClient,
    roleMap: Record<RoleName, number>
): Promise<void> {
    for (const { roles, emailVerified, password, ...userFields } of SEED_USERS) {
        const exists = await db.user.findUnique({ where: { email: userFields.email } });
        if (exists) {
            console.log(`[UserSeeder] skip: ${userFields.email}`);
            continue;
        }

        await db.user.create({
            data: {
                ...userFields,
                password: await bcrypt.hash(password, BCRYPT_ROUNDS),
                email_verified: emailVerified,
                email_verified_at: emailVerified ? new Date() : null,
                user_roles: {
                    create: roles.map((name) => ({ role_id: roleMap[name] })),
                },
            },
        });

        console.log(`[UserSeeder] created: ${userFields.email} → [${roles.join(", ")}]`);
    }
}