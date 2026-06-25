import { Controller } from "tsoa";
import { MatchResultService } from "../services/matchresult.service.js";
import { MatchLifecycleService } from "../services/match.service.js";
import { PrismaClient } from "../generated/prisma/client.js";
export declare class MatchResultController extends Controller {
    private readonly matchResultService;
    private readonly lifecycleService;
    private readonly prisma;
    constructor(matchResultService: MatchResultService, lifecycleService: MatchLifecycleService, prisma: PrismaClient);
    /**
     * Xem kết quả chính thức của trận đấu.
     * Trả về score 90p, ET, penalty, winner, result_type, status (official/protested...).
     */
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
        status: import("../generated/prisma/enums.js").MatchResultStatus;
        match_id: number;
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
     * List toàn bộ events của trận (goal, thẻ, thay người...).
     * Hỗ trợ filter theo type và period.
     */
    getMatchEvents(id: number, type?: string, period?: string): Promise<({
        match: {
            home_team_id: number;
            away_team_id: number;
        };
    } & {
        type: import("../generated/prisma/enums.js").MatchEventType;
        id: number;
        created_at: Date;
        team_id: number | null;
        player_id: number | null;
        match_id: number;
        minute: number | null;
        note: string | null;
        period: import("../generated/prisma/enums.js").MatchPeriod | null;
        added_minute: number | null;
        card_color: import("../generated/prisma/enums.js").CardColor | null;
        sub_out_player_id: number | null;
    })[]>;
    /**
     * Thống kê cầu thủ của 1 trận cụ thể (goals, cards per player).
     * Aggregate từ match_events — không phải PlayerStatistic (đó là season-level).
     */
    getMatchPlayerStats(id: number): Promise<(import("../generated/prisma/internal/prismaNamespace.js").PickEnumerable<import("../generated/prisma/models.js").MatchEventGroupByOutputType, ("type" | "team_id" | "player_id")[]> & {
        _count: {
            type: number;
        };
    })[]>;
}
//# sourceMappingURL=matchResult.controller.d.ts.map