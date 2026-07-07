import { MatchResultType, Prisma, PrismaClient } from '../generated/prisma/client.js';
import { ConfirmResultInput, ConfirmResultOutput, WinnerResolution } from '../types/matchResult.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { KnockoutService } from './knockout.service.js';
import { StandingsService } from './standing.service.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { MatchEventRow } from '../helper/match.helper.js';
import { EditScoreInput } from '../types/match.type.js';
import { MatchReportOutput } from '../types/matchReport.type.js';
type ConfirmResultInputWithExplicitWinner = ConfirmResultInput & {
    explicitWinnerTeamId?: number | null;
};
type ConfirmResultOutputWithWarnings = ConfirmResultOutput & {
    postCommitWarnings?: string[];
};
type ConfirmResultCore = {
    matchResultId: number;
    resolution: WinnerResolution;
    isKnockout: boolean;
    phaseId: number;
    seasonId: number;
    groupId: number | null;
};
type PlayerKey = {
    player_id: number;
    team_id: number;
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
    private _knockoutDrawBlocked;
    confirmResultInTx(tx: Prisma.TransactionClient, matchId: number, input: ConfirmResultInputWithExplicitWinner): Promise<ConfirmResultCore>;
    runPostConfirmSteps(matchId: number, core: ConfirmResultCore, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutputWithWarnings>;
    confirmResult(matchId: number, input: ConfirmResultInputWithExplicitWinner, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutputWithWarnings>;
    /**
     * FIX (round-robin → knockout seeding lock, thêm sau bug report): khi
     * knockout bracket của season đã seed (KnockoutService.generateKnockoutBracket
     * đã chạy), override score lên match round-robin có thể đổi standings/
     * tie-break mà KHÔNG re-seed bracket — sai suất đi tiếp âm thầm. Chặn
     * cứng, đẩy case hiếm (lỗi phát hiện sau) sang resolveAppeal.
     *
     * Bracket-advance guard (isKnockout branch) giữ nguyên logic cũ, chỉ
     * extract ra findAdvancedChildMatchId để dùng chung với
     * match.lifecycle.service.ts _recalculateResultTx (trước đây guard này
     * chỉ có ở đây, addEvent/deleteEvent/editEvent thiếu — xem bug report).
     */
    overrideResultInTx(tx: Prisma.TransactionClient, matchId: number, input: EditScoreInput): Promise<{
        isKnockout: boolean;
        groupId: number | null;
    }>;
    overrideResult(matchId: number, input: EditScoreInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    /**
     * FIX (player stats drift — bug report #2): trước đây `played` set chỉ
     * suy từ match_events HIỆN TẠI của match này (đọc SAU khi đã
     * delete/update). Hệ quả:
     * - deleteEvent xóa event DUY NHẤT của 1 player trong match → player đó
     *   biến mất khỏi `played` → không bao giờ recompute lại →
     *   PlayerStatistic giữ nguyên count cũ (từ event đã xóa) vĩnh viễn.
     * - editEvent đổi player_id (A → B): A (không còn event nào trong match
     *   này) không nằm trong `played` → stats A vẫn tính event đã chuyển
     *   sang B.
     *
     * Fix: nhận thêm `additionalPlayers` — player/team CAPTURED TRƯỚC khi
     * mutate (caller ở match.lifecycle.service.ts truyền vào), union vào
     * tập cần recompute. `_recomputeStatsForPlayers` vốn recompute TUYỆT ĐỐI
     * theo toàn bộ match_events trong season (không phải incremental) nên
     * gọi thêm cho player không còn event nào trong match này vẫn cho kết
     * quả đúng (0 hoặc số liệu từ match khác trong season).
     */
    recomputePlayerStats(matchId: number, additionalPlayers?: PlayerKey[]): Promise<void>;
    recomputeStandingsFor(groupId: number): Promise<void>;
    private _guardConfirm;
    private _resolveWinner;
    private _updatePlayerStatistics;
    private _recomputeStatsForPlayers;
    private _tryRecomputeStandings;
    getMatchReport(matchId: number): Promise<MatchReportOutput>;
}
export {};
//# sourceMappingURL=matchresult.service.d.ts.map