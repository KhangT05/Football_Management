import { PrismaClient } from "../generated/prisma/client.js";
export interface TeamSeedResult {
    teamIdByName: Record<string, number>;
}
/**
 * Tạo Team theo danh sách `teamNames` truyền vào (từ teamGenerator.generateTeamNames()).
 * Nếu đã tồn tại (chạy seed lại) thì tái sử dụng — idempotent qua upsert theo `name`.
 * adminUserId dùng làm user sở hữu Team (Team.user_id).
 *
 * classIdByName (từ classSeeder.seedClasses, PHẢI chạy trước): mỗi Team được gán
 * vào 1 Class theo kiểu round-robin (i % số lớp) — không random để lần seed lại
 * cho ra map Team -> Class giống hệt lần trước (dù `update: {}` không đổi field
 * cũ, nhưng nếu sau này thêm update thì vẫn ổn định).
 */
export declare function seedTeams(db: PrismaClient, adminUserId: number, teamNames: string[], classIdByName: Record<string, number>): Promise<TeamSeedResult>;
export declare function seedTeamLeadersFromExistingUsers(db: PrismaClient, teamIdByName: Record<string, number>): Promise<void>;
//# sourceMappingURL=teamSeeder.d.ts.map