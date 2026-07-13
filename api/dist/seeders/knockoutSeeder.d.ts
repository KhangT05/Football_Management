import type { DbClient } from "./dbTypes.js";
import type { GroupLetter } from "./teamGenerator.js";
interface MatchSummary {
    matchId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
}
export declare function seedKnockoutBracket(db: DbClient, seasonId: number, topTwoByGroup: Record<GroupLetter, [number, number]>, venueIds: number[], roundOf16Template: [GroupLetter, GroupLetter][]): Promise<{
    championTeamId: number;
    allMatches: MatchSummary[];
}>;
export {};
//# sourceMappingURL=knockoutSeeder.d.ts.map