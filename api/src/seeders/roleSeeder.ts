import { PrismaClient } from "../generated/prisma/client.js";


export const ROLE_NAMES = ["admin", "leader", "player", "referee", "user"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

const ROLES: { name: RoleName; description: string }[] = [
    { name: "admin", description: "Quản trị hệ thống" },
    { name: "leader", description: "Trưởng đội / đại diện đội bóng" },
    { name: "player", description: "Cầu thủ đã claim tài khoản" },
    { name: "referee", description: "Trọng tài" },
    { name: "user", description: "Tài khoản mặc định khi đăng ký" },
];

export async function seedRoles(db: PrismaClient): Promise<Record<RoleName, number>> {
    for (const role of ROLES) {
        await db.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }

    const rows = await db.role.findMany({
        where: { name: { in: [...ROLE_NAMES] } },
        select: { id: true, name: true },
    });

    const roleMap = Object.fromEntries(
        rows.map((r) => [r.name, r.id])
    ) as Record<RoleName, number>;

    console.log(`[RoleSeeder] seeded: ${ROLE_NAMES.join(", ")}`);
    return roleMap;
}