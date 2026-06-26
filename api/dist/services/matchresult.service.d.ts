import { MatchResultType, Prisma, PrismaClient } from '../generated/prisma/client.js';
import { ConfirmResultInput, ConfirmResultOutput } from '../types/matchResult.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { KnockoutService } from './knockout.service.js';
import { StandingsService } from './standing.service.js';
import { EditScoreInput } from './match.service.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { MatchEventRow } from '../helper/match.helper.js';
export declare class MatchResultService {
    private readonly prisma;
    private readonly knockoutService;
    private readonly standingsService;
    private matchEventQueryable;
    constructor(prisma: PrismaClient, knockoutService: KnockoutService, standingsService: StandingsService);
    getMatchResult(matchId: number): Promise<{
        winner_team: {
            name: string;
            id: number;
        } | null;
    } & {
        is_active: boolean;
        id: number;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        status: import("../generated/prisma/enums.js").MatchResultStatus;
        match_id: number;
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
    /**
     * List events của 1 trận, hỗ trợ pagination, sort, filter.
     *
     * Pattern:
     *   - QueryRequest build từ HTTP query params
     *   - match_id inject vào filter (context)
     *   - Queryable.run() handle pagination + sort + validation
     *
     * API:
     *   queryable.run(req: QueryRequest, overrideConfig?)
     *   QueryRequest = { filter?: Record<string, unknown>, q?: string, sort?, direction?, page?, per_page?, ...simple }
     */
    listMatchEvents(matchId: number, req: QueryRequest): Promise<PaginatedResult<MatchEventRow>>;
    getMatchPlayerStats(matchId: number): Promise<(Prisma.PickEnumerable<Prisma.MatchEventGroupByOutputType, ("type" | "team_id" | "player_id")[]> & {
        _count: {
            type: number;
        };
    })[]>;
    confirmResult(matchId: number, input: ConfirmResultInput, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
    overrideResult(matchId: number, input: EditScoreInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    recomputePlayerStats(matchId: number): Promise<void>;
    private _guardConfirm;
    private _resolveWinner;
    private _updatePlayerStatistics;
    private _recomputeStatsForPlayers;
    private _tryRecomputeStandings;
    recomputeStandingsFor(groupId: number): Promise<void>;
}
//# sourceMappingURL=matchresult.service.d.ts.map