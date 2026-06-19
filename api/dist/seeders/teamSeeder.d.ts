import { PrismaClient } from "../generated/prisma/client.js";
export interface TeamSeedResult {
    teamId: number;
    teamName: string;
    seasonTeamId: number;
    playerIds: number[];
}
export declare function seedTeams(db: PrismaClient, adminUserId: number, seasonId: number): Promise<TeamSeedResult[]>;
//# sourceMappingURL=teamSeeder.d.ts.map