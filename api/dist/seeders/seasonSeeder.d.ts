import { PrismaClient } from "../generated/prisma/client.js";
import type { VenueSeed } from "./teamGenerator.js";
export interface SeasonSeedResult {
    seasonId: number;
    venueIds: number[];
    seasonTeamIdByTeamId: Record<number, number>;
}
export declare function seedVenues(db: PrismaClient, venues: VenueSeed[]): Promise<number[]>;
export declare function seedSeason(db: PrismaClient, tournamentId: number, tournamentRuleId: number, organizerUserId: number, teamIdByName: Record<string, number>, venues: VenueSeed[]): Promise<SeasonSeedResult>;
//# sourceMappingURL=seasonSeeder.d.ts.map