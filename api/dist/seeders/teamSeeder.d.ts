import { PrismaClient } from "../generated/prisma/client.js";
export interface TeamSeedResult {
    teamIdByName: Record<string, number>;
}
/**
 * Tạo 32 Team (theo ALL_TEAM_NAMES). Nếu đã tồn tại (chạy seed lại) thì tái sử dụng.
 * adminUserId dùng làm user sở hữu Team (Team.user_id).
 */
export declare function seedTeams(db: PrismaClient, adminUserId: number): Promise<TeamSeedResult>;
export declare function seedTeamLeadersFromExistingUsers(db: PrismaClient, teamIdByName: Record<string, number>): Promise<void>;
//# sourceMappingURL=teamSeeder.d.ts.map