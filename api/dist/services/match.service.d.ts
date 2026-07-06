import { MatchPeriod, PrismaClient } from '../generated/prisma/client.js';
import { ConfirmResultOutput } from '../types/matchResult.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { AddEventInput, FinalizeMatchInput, ManualScoreInput, RecordEventInput, ResolveAppealInput, EditEventInput, EditScoreInput, AdminRecordResultInput } from '../types/match.type.js';
import { MatchResultService } from './matchresult.service.js';
export declare class MatchLifecycleService {
    private readonly prisma;
    private readonly matchResultService;
    constructor(prisma: PrismaClient, matchResultService: MatchResultService);
    startMatch(matchId: number): Promise<void>;
    transitionPeriod(matchId: number, period: MatchPeriod): Promise<void>;
    recordEvent(matchId: number, input: RecordEventInput): Promise<void>;
    private _deriveCardColor;
    private _applyScoreDelta;
    private _computeScoreFromEvents;
    finalizeMatch(matchId: number, input: FinalizeMatchInput | undefined, _scheduleOptions: OptionalScheduleOptions): Promise<void>;
    submitManualScore(matchId: number, input: ManualScoreInput, _scheduleOptions: OptionalScheduleOptions): Promise<void>;
    confirmOfficial(matchId: number, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
    /**
     * FIX (High #4 — claim correctness): bản cũ chỉ SELECT...FOR UPDATE SKIP LOCKED
     * rồi return true/false trong 1 transaction KHÔNG làm gì khác — row lock được
     * giải phóng ngay khi tx đó commit, không có write nào để tạo mutual exclusion
     * thực sự. Hai lần chạy job gần nhau (hoặc 2 instance) đều pass claim check
     * trước khi worker nào gọi confirmOfficial(); bảo vệ thực tế duy nhất trước đây
     * là unique constraint P2002 + string-match "đã có MatchResult" — coupling giữa
     * lỗi nghiệp vụ và logic idempotency, dễ vỡ nếu message đổi.
     *
     * Fix: claim bằng 1 UPDATE có điều kiện, atomic theo MVCC row lock của chính
     * statement UPDATE — chỉ 1 process thắng do Postgres serialize concurrent UPDATE
     * trên cùng row; process thua đọc affected rows = 0 và tự skip. Dùng
     * pending_official_at=NULL làm claim signal (an toàn vì confirmOfficial không
     * đọc field này); review path dùng chính status làm claim signal (đổi thẳng
     * sang needs_review trong 1 statement, không cần SELECT trước).
     */
    handleGracePeriodTimeout(gracePeriodMinutes: number | undefined, scheduleOptions: OptionalScheduleOptions): Promise<{
        autoOfficiated: number[];
        flaggedForReview: number[];
    }>;
    forfeitMatch(matchId: number, forfeitingTeamId: number, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
    abandonMatch(matchId: number, minute: number, reason?: string): Promise<void>;
    fileAppeal(matchId: number, reason: string): Promise<void>;
    fileProtest(matchId: number, reason: string): Promise<void>;
    private _fileDispute;
    resolveAppeal(matchId: number, input: ResolveAppealInput): Promise<void>;
    private _assertCorrectionWindow;
    addEvent(matchId: number, input: AddEventInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    deleteEvent(matchId: number, eventId: number, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    editEvent(matchId: number, eventId: number, input: EditEventInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    /**
     * FIX (Critical #2): lock row FOR UPDATE + check eventCount + gọi
     * matchResultService.overrideResultInTx TRONG CÙNG transaction — trước đây
     * 3 bước này không transaction, không lock, TOCTOU với addEvent/deleteEvent/
     * editEvent (đã lock). Xem chi tiết ở comment overrideResultInTx.
     */
    editScore(matchId: number, input: EditScoreInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    private _recalculateResultTx;
    private _runPostCorrectionSteps;
    /**
     * FIX (Critical #1 — atomicity): trước đây createMany(scorers/cards) chạy
     * trong 1 transaction riêng, sau đó confirmResult() mở transaction thứ 2 độc
     * lập. confirmResult throw (P2002 race, validation resultType/penalty, guard
     * knockout draw...) → events đã insert vẫn commit, orphan không có MatchResult.
     * Retry sau lỗi → duplicate events (không unique constraint chặn). Cũng không
     * lock row trong khi status cho phép cả 'ongoing' — race với recordEvent (đã lock).
     *
     * Fix: gộp toàn bộ vào 1 transaction có FOR UPDATE lock — status check + card
     * validation đọc lại TRONG lock (đóng TOCTOU với check ngoài lock cũ), event
     * insert, rồi confirmResultInTx (matchresult.service.ts) chạy guard+write
     * MatchResult/Match/PlayerStatistic cùng transaction. Post-commit steps
     * (standings/knockout advance) dùng chung runPostConfirmSteps với confirmResult().
     */
    adminRecordResult(matchId: number, input: AdminRecordResultInput, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
}
//# sourceMappingURL=match.service.d.ts.map