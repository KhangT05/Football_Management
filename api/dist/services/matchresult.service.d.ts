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
     * FIX (root cause #3): _guardConfirm cũ chỉ chặn draw ở resultType=full_time.
     * _resolveWinner case extra_time cũng có thể trả winnerTeamId=null nếu hoà sau
     * hiệp phụ — không có gì chặn input resultType=extra_time với homeExtraTime
     * === awayExtraTime đi qua guard. Hệ quả: knockout match confirm với
     * winner_team_id=null, knockoutAdvanced bị skip (if isKnockout && winnerTeamId)
     * nhưng match status vẫn set finished theo STATUS_BY_RESULT_TYPE — "finished"
     * mà không ai advance bracket, không warning nào log vì code không coi đây là lỗi.
     *
     * overrideResult có guard riêng, tách biệt khỏi _guardConfirm — cùng thiếu sót
     * lặp lại ở 2 nơi. Gộp về 1 helper để tránh drift lần nữa.
     */
    private _knockoutDrawBlocked;
    /**
     * FIX (Critical #1 — atomicity): confirmResult/adminRecordResult trước đây gọi
     * qua 2 transaction độc lập (createMany events ở lifecycle service, rồi
     * confirmResult mở transaction riêng) → nếu confirmResult throw, events đã
     * insert vẫn commit (orphan); nếu caller retry, events insert lại (duplicate,
     * không unique constraint chặn). Tách guard+write ra method nhận `tx` từ
     * ngoài để adminRecordResult có thể gộp event-insert + confirm vào CÙNG 1
     * transaction. confirmResult (public) tự mở transaction riêng khi gọi trực tiếp.
     *
     * Đồng thời fix lock: bản cũ lock match row ở CHÍNH transaction này rồi mới
     * SELECT lại — findUnique ngoài tx cũ đã bị bỏ, mọi guard check giờ đọc từ
     * snapshot đã lock, nhất quán với pattern recordEvent/addEvent đã dùng.
     */
    confirmResultInTx(tx: Prisma.TransactionClient, matchId: number, input: ConfirmResultInputWithExplicitWinner): Promise<ConfirmResultCore>;
    /**
     * Post-commit steps (standings recompute, knockout advance) — tách ra để
     * confirmResult() và adminRecordResult() (lifecycle service) dùng chung, tránh
     * lặp lại logic warning-collection ở 2 nơi (nguồn của bug #3 kiểu drift).
     */
    runPostConfirmSteps(matchId: number, core: ConfirmResultCore, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutputWithWarnings>;
    confirmResult(matchId: number, input: ConfirmResultInputWithExplicitWinner, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutputWithWarnings>;
    /**
     * FIX (Critical #2 — race/TOCTOU): overrideResult trước đây KHÔNG lock row,
     * chạy 2 write riêng (không transaction) sau khi đọc match bằng plain
     * findUniqueOrThrow. editScore (lifecycle service) check eventCount===0 rồi
     * gọi method này — giữa lúc check và lúc write, addEvent/deleteEvent/editEvent
     * (đã có FOR UPDATE lock) có thể insert event + recompute + commit trước, rồi
     * overrideResult ghi đè home_final_score/winner_team_id bằng score input tay
     * → event tồn tại trong DB nhưng score không phản ánh event đó, vỡ invariant
     * "score = f(events)".
     *
     * Fix: tách phần guard+write ra nhận `tx` từ ngoài — editScore (lifecycle)
     * giờ lock row FOR UPDATE, check eventCount, rồi gọi method này TRONG CÙNG
     * transaction đã lock, serialize đúng với các method addEvent/deleteEvent/editEvent.
     */
    overrideResultInTx(tx: Prisma.TransactionClient, matchId: number, input: EditScoreInput): Promise<{
        isKnockout: boolean;
        groupId: number | null;
    }>;
    overrideResult(matchId: number, input: EditScoreInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    recomputePlayerStats(matchId: number): Promise<void>;
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