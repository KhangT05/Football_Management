import { PrismaClient } from "../generated/prisma/client";
import { seedRoles } from "./roleSeeder";
import { seedUsers } from "./userSeeder";

export async function runSeeders(db: PrismaClient): Promise<void> {
    console.log("[DataSeeder] starting...\n");

    // Roles phải có trước — users FK vào roles
    // roleMap trả về ngay sau seed, tránh query lại
    const roleMap = await seedRoles(db);
    await seedUsers(db, roleMap);

    console.log("\n[DataSeeder] done.");
}