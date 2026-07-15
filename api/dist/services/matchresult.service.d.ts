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
            name: string;
            id: number;
        } | null;
    } & {
        is_active: boolean;
        id: number;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        duration: number | null;
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
        notes: string | null;
        appeal_reason: string | null;
        appeal_note: string | null;
    }>;
    listMatchEvents(matchId: number, req: QueryRequest): Promise<PaginatedResult<MatchEventRow>>;
    getMatchPlayerStats(matchId: number): Promise<(Prisma.PickEnumerable<Prisma.MatchEventGroupByOutputType, ("type" | "team_id" | "player_id")[]> & {
        _count: {
            type: number;
        };
    })[]>;
    private _knockoutDrawBlocked;
    confirmResultInTx(tx: Prisma.TransactionClient, matchId: number, input: ConfirmResultInputWithExplicitWinner): Promise<ConfirmResultCore>;
    runPostConfirmSteps(matchId: number, core: ConfirmResultCore, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutputWithWarnings>;
    confirmResult(matchId: number, input: ConfirmResultInputWithExplicitWinner, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutputWithWarnings>;
    /**
     * FIX (round-robin → knockout seeding lock): khi knockout bracket của
     * season đã seed, override score lên match round-robin có thể đổi
     * standings/tie-break mà KHÔNG re-seed bracket — sai suất đi tiếp âm
     * thầm. Chặn cứng, đẩy case hiếm sang resolveAppeal.
     *
     * FIX (select layer): dùng matchForOverrideSelect từ match.queries.ts
     * thay vì tự viết select inline — trước đây select tay ở đây trỏ nhầm
     * `season.tournament.tournamentRule` (mảng, sai rule) và field này
     * còn không được dùng ở đâu trong hàm, chỉ tốn thêm 1 join thừa.
     *
     * FIX (half-time write — không có cột lưu trữ): trước đây hàm này ghi
     * `home_half_time_score`/`away_half_time_score` vào MatchResult qua
     * spread có điều kiện — 2 cột này KHÔNG tồn tại trên model MatchResult
     * (xem schema.prisma, match.helper.ts#MATCH_RESULT_SELECT, và
     * match.queries.ts#matchResultSelect — không nơi nào có field này).
     * Bất kỳ request nào truyền homeHalfTime/awayHalfTime sẽ khiến Prisma
     * throw lỗi "Unknown field" ngay khi update. Đã bỏ nhánh ghi này (và bỏ
     * 2 field khỏi EditScoreInput ở match.type.ts) theo đúng yêu cầu KHÔNG
     * đổi schema. Nếu sau này cần sửa half-time sau khi match đã finished,
     * phải bổ sung cột trên MatchResult trước rồi mới thêm lại logic ghi ở
     * đây.
     */
    overrideResultInTx(tx: Prisma.TransactionClient, matchId: number, input: EditScoreInput): Promise<{
        isKnockout: boolean;
        groupId: number | null;
    }>;
    /**
     * FIX (player stats drift — bug report #2): trước đây `played` set chỉ
     * suy từ match_events HIỆN TẠI của match này (đọc SAU khi đã
     * delete/update). Fix: nhận thêm `additionalPlayers` — player/team
     * CAPTURED TRƯỚC khi mutate (caller ở match.lifecycle.service.ts truyền
     * vào), union vào tập cần recompute.
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