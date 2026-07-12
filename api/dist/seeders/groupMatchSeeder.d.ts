import { GroupLetter } from "./worldcup.js";
import type { DbClient } from "./dbTypes.js";
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
export declare function seedGroupMatchesAndStandings(db: DbClient, groupStagePhaseId: number, groupIdByLetter: Record<GroupLetter, number>, teamIdByName: Record<string, number>, seasonId: number, venueIds: number[]): Promise<GroupStandingsResult>;
//# sourceMappingURL=groupMatchSeeder.d.ts.map