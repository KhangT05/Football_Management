import { MatchResultType, Prisma, PrismaClient } from '../generated/prisma/client.js';
import { ConfirmResultInput, ConfirmResultOutput } from '../types/matchResult.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { KnockoutService } from './knockout.service.js';
import { StandingsService } from './standing.service.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { MatchEventRow } from '../helper/match.helper.js';
import { EditScoreInput } from '../types/match.type.js';
type ConfirmResultInputWithExplicitWinner = ConfirmResultInput & {
    explicitWinnerTeamId?: number | null;
};
type ConfirmResultOutputWithWarnings = ConfirmResultOutput & {
    postCommitWarnings?: string[];
};
export declare class MatchResultService {
    private readonly prisma;
    private readonly knockoutService;
    private readonly standingsService;
    private matchEventQueryable;
    constructor(prisma: PrismaClient, knockoutService: KnockoutService, standingsService: StandingsService);
    getMatchResult(matchId: number): Promise<{
        winner_team: {
            id: number;
            name: string;
        } | null;
    } & {
        id: number;
        match_id: number;
        status: import("../generated/prisma/enums.js").MatchResultStatus;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        winner_team_id: number | null;
        home_extra_time_score: number | null;
        away_extra_time_score: number | null;
        home_penalty_score: number | null;
        away_penalty_score: number | null;
        home_final_score: number;
        away_final_score: number;
        result_type: MatchResultType;
        duration: number | null;
        notes: string | null;
        appeal_reason: string | null;
        appeal_note: string | null;
    }>;
    listMatchEvents(matchId: number, req: QueryRequest): Promise<PaginatedResult<MatchEventRow>>;
    getMatchPlayerStats(matchId: number): Promise<(Prisma.PickEnumerable<Prisma.MatchEventGroupByOutputType, ("type" | "player_id" | "team_id")[]> & {
        _count: {
            type: number;
        };
    })[]>;
    /**
     * Finalize 1 trận: tạo MatchResult, update Match status, update player stats.
     *
     * Idempotency: tx.matchResult.create() catch P2002 trên unique constraint
     * match_id — nguồn correctness thật cho race "2 caller cùng confirm 1 match",
     * không phải bất kỳ lock/claim nào ở tầng gọi.
     *
     * Post-commit steps (standings, knockout advance) chạy try-catch riêng,
     * gom lỗi vào postCommitWarnings thay vì throw — match đã finalize thành
     * công thì response phải phản ánh đúng, không để lỗi phụ khiến caller
     * tưởng cả request fail rồi retry (retry sẽ đụng _guardConfirm reject vì
     * MatchResult đã tồn tại).
     */
    confirmResult(matchId: number, input: ConfirmResultInputWithExplicitWinner, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutputWithWarnings>;
    overrideResult(matchId: number, input: EditScoreInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    recomputePlayerStats(matchId: number): Promise<void>;
    recomputeStandingsFor(groupId: number): Promise<void>;
    private _guardConfirm;
    private _resolveWinner;
    private _updatePlayerStatistics;
    private _recomputeStatsForPlayers;
    private _tryRecomputeStandings;
}
export {};
//# sourceMappingURL=matchresult.service.d.ts.map