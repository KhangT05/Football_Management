import { Controller } from "tsoa";
import { MatchResultService } from "../services/matchresult.service.js";
import * as matchResultType from "../types/matchResult.type.js";
export declare class MatchResultController extends Controller {
    private readonly matchResultService;
    constructor(matchResultService: MatchResultService);
    getMatchResult(id: number): Promise<{
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
        match_id: number;
        winner_team_id: number | null;
        home_extra_time_score: number | null;
        away_extra_time_score: number | null;
        home_penalty_score: number | null;
        away_penalty_score: number | null;
        home_final_score: number;
        away_final_score: number;
        result_type: import("../generated/prisma/enums.js").MatchResultType;
        status: import("../generated/prisma/enums.js").MatchResultStatus;
        duration: number | null;
        notes: string | null;
        appeal_reason: string | null;
        appeal_note: string | null;
    }>;
    getMatchEvents(id: number, type?: string, period?: string, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc', q?: string): Promise<import("../types/queryable.type.js").PaginatedResult<{
        type: import("../generated/prisma/enums.js").MatchEventType;
        period: import("../generated/prisma/enums.js").MatchPeriod | null;
        id: number;
        created_at: Date;
        match_id: number;
        team_id: number | null;
        player_id: number | null;
        minute: number | null;
        added_minute: number | null;
    }>>;
    getMatchPlayerStats(id: number): Promise<(import("../generated/prisma/internal/prismaNamespace.js").PickEnumerable<import("../generated/prisma/models.js").MatchEventGroupByOutputType, ("type" | "team_id" | "player_id")[]> & {
        _count: {
            type: number;
        };
    })[]>;
    /**
     * FIX (Critical #1 — auth bypass): @Security("jwt") trước đây không role-restrict
     * — bất kỳ authenticated user (user/leader/organizing) đều gọi được endpoint này
     * để confirmResult() trực tiếp, bypass toàn bộ state machine ở MatchController
     * (finalizeMatch → grace period → confirmOfficial), vốn siết admin cho mọi
     * confirm/forfeit/resolve-appeal operation. _guardConfirm chỉ chặn status
     * finished/cancelled — match ongoing/pending_official/needs_review/abandoned/
     * bye/postponed đều pass, và nếu body.input cho set explicitWinnerTeamId, đây
     * là privilege escalation thực sự (set winner tuỳ ý cho bất kỳ match).
     *
     * Siết về admin. Khuyến nghị đánh giá lại: endpoint này có còn cần thiết không
     * — MatchController đã có confirmOfficial/forfeitMatch/adminRecordResult cho
     * đầy đủ use case; nếu không có consumer riêng (integration test, internal
     * tool), nên xoá hẳn thay vì giữ 1 entrypoint thứ 2 vào cùng service method.
     */
    confirmResult(id: number, body: matchResultType.ConfirmOfficialBody): Promise<matchResultType.ConfirmResultOutput & {
        postCommitWarnings?: string[];
    }>;
}
//# sourceMappingURL=matchResult.controller.d.ts.map