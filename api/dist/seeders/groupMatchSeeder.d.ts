import type { DbClient } from "./dbTypes.js";
import type { GroupLetter } from "./teamGenerator.js";
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
export declare function seedGroupMatchesAndStandings(db: DbClient, groupStagePhaseId: number, groupIdByLetter: Record<GroupLetter, number>, teamIdByName: Record<string, number>, seasonId: number, venueIds: number[], groups: Record<GroupLetter, string[]>, rulePoints: {
    win: number;
    draw: number;
    loss: number;
}): Promise<GroupStandingsResult>;
//# sourceMappingURL=groupMatchSeeder.d.ts.map