import { PrismaClient } from "../generated/prisma/client.js";
import { GroupLetter } from "./worldcup.js";
export interface GroupStandingsResult {
    topTwoByGroup: Record<GroupLetter, [number, number]>;
    createdMatches: CreatedMatchInfo[];
}
export interface CreatedMatchInfo {
    matchId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
}
export declare function seedGroupMatchesAndStandings(db: PrismaClient, groupStagePhaseId: number, groupIdByLetter: Record<GroupLetter, number>, teamIdByName: Record<string, number>, seasonId: number, venueIds: number[]): Promise<GroupStandingsResult>;
//# sourceMappingURL=groupMatchSeeder.d.ts.map