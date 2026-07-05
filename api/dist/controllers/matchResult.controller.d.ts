import { Controller } from "tsoa";
import { MatchResultService } from "../services/matchresult.service.js";
import * as matchResultType from "../types/matchResult.type.js";
export declare class MatchResultController extends Controller {
    private readonly matchResultService;
    constructor(matchResultService: MatchResultService);
    getMatchResult(id: number): Promise<{
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
        result_type: import("../generated/prisma/enums.js").MatchResultType;
        duration: number | null;
        notes: string | null;
        appeal_reason: string | null;
        appeal_note: string | null;
    }>;
    /**
     * List events của 1 trận.
     *
     * Query params:
     *   Simple filters: ?type=goal&period=first_half
     *   Pagination: ?page=1&per_page=30
     *   Sort: ?sort=minute&direction=asc
     *   Search: ?q=keyword (if searchFields enabled)
     */
    getMatchEvents(id: number, type?: string, period?: string, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc', q?: string): Promise<import("../types/queryable.type.js").PaginatedResult<{
        type: import("../generated/prisma/enums.js").MatchEventType;
        id: number;
        match_id: number;
        created_at: Date;
        period: import("../generated/prisma/enums.js").MatchPeriod | null;
        player_id: number | null;
        team_id: number | null;
        minute: number | null;
        added_minute: number | null;
    }>>;
    getMatchPlayerStats(id: number): Promise<(import("../generated/prisma/internal/prismaNamespace.js").PickEnumerable<import("../generated/prisma/models.js").MatchEventGroupByOutputType, ("type" | "player_id" | "team_id")[]> & {
        _count: {
            type: number;
        };
    })[]>;
    confirmResult(id: number, body: matchResultType.ConfirmOfficialBody): Promise<matchResultType.ConfirmResultOutput & {
        postCommitWarnings?: string[];
    }>;
    getMatchReport(id: number): Promise<import("../types/matchReport.type.js").MatchReportOutput>;
}
//# sourceMappingURL=matchResult.controller.d.ts.map