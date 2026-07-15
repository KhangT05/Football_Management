import { PrismaClient } from "../generated/prisma/client.js";

export interface ClassSeedResult {
    classIdByName: Record<string, number>;
}

// Danh sách lớp cố định — đủ đa dạng để rải Team + User(student) vào nhiều lớp khác nhau.
const CLASS_NAMES = [
    "CNTT1",
    "CNTT2",
    "CNTT3",
    "K21-DTVT1",
    "K21-DTVT2",
    "K22-KTPM1",
    "K22-KTPM2",
    "K20-ATTT1",
];

/**
 * Seed các lớp (Class). Idempotent qua upsert theo `name` (unique).
 * PHẢI chạy trước seedTeams và seedPlayersFromExistingUsers vì cả 2 đều
 * cần classIdByName để gán Team.class_id / User.class_id.
 */
export async function seedClasses(db: PrismaClient): Promise<ClassSeedResult> {
    const classIdByName: Record<string, number> = {};

    for (const name of CLASS_NAMES) {
        const cls = await db.class.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        classIdByName[name] = cls.id;
    }

    console.log(`[ClassSeeder] seeded ${Object.keys(classIdByName).length} classes`);
    return { classIdByName };
}