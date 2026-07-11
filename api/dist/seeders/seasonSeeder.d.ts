import { PrismaClient } from "../generated/prisma/client.js";
export interface SeasonSeedResult {
    seasonId: number;
    venueIds: number[];
    seasonTeamIdByTeamId: Record<number, number>;
}
export declare function seedVenues(db: PrismaClient): Promise<number[]>;
export declare function seedSeason(db: PrismaClient, tournamentId: number, tournamentRuleId: number, organizerUserId: number, teamIdByName: Record<string, number>): Promise<SeasonSeedResult>;
//# sourceMappingURL=seasonSeeder.d.ts.map