import type { DbClient } from "./dbTypes.js";
/**
 * Sinh đầy đủ MatchLineup + MatchJerseyAssignment + MatchEvent cho 1 trận,
 * số bàn thắng event khớp đúng với home_score/away_score đã lưu ở Match.
 */
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