import type { DbClient } from "./dbTypes.js";
import type { GroupLetter } from "./worldcup.js";
interface MatchSummary {
    matchId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
}
export declare function seedKnockoutBracket(db: DbClient, seasonId: number, topTwoByGroup: Record<GroupLetter, [number, number]>, venueIds: number[]): Promise<{
    championTeamId: number;
    allMatches: MatchSummary[];
}>;
export {};
//# sourceMappingURL=knockoutSeeder.d.ts.map