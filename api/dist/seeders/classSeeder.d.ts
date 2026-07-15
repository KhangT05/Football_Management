import { PrismaClient } from "../generated/prisma/client.js";
export interface ClassSeedResult {
    classIdByName: Record<string, number>;
}
/**
 * Seed các lớp (Class). Idempotent qua upsert theo `name` (unique).
 * PHẢI chạy trước seedTeams và seedPlayersFromExistingUsers vì cả 2 đều
 * cần classIdByName để gán Team.class_id / User.class_id.
 */
export declare function seedClasses(db: PrismaClient): Promise<ClassSeedResult>;
//# sourceMappingURL=classSeeder.d.ts.map