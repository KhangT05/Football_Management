import { PrismaClient } from "../generated/prisma/client.js";
export interface TeamSeedResult {
    teamIdByName: Record<string, number>;
}
/**
 * Tạo Team theo danh sách `teamNames` truyền vào (từ teamGenerator.generateTeamNames()).
 * Nếu đã tồn tại (chạy seed lại) thì tái sử dụng — idempotent qua upsert theo `name`.
 * adminUserId dùng làm user sở hữu Team (Team.user_id).
 */
export declare function seedTeams(db: PrismaClient, adminUserId: number, teamNames: string[]): Promise<TeamSeedResult>;
export declare function seedTeamLeadersFromExistingUsers(db: PrismaClient, teamIdByName: Record<string, number>): Promise<void>;
//# sourceMappingURL=teamSeeder.d.ts.map