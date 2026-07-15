import type { DbClient } from "./dbTypes.js";
export declare function seedMatchDetails(db: DbClient, params: {
    matchId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
    homeSeasonTeamId: number;
    awaySeasonTeamId: number;
}): Promise<void>;
//# sourceMappingURL=matchDetailSeeder.d.ts.map