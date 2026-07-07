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
     * FIX (retry cap — bug report #5): trước đây fail (không phải idempotency
     * conflict) → reset pending_official_at về mốc quá hạn, retry vô thời
     * hạn mỗi cron tick nếu lỗi deterministic (thiếu TournamentRule, data
     * hỏng...). Giờ đếm grace_period_retry_count, sau MAX_GRACE_PERIOD_RETRY
     * lần escalate thẳng needs_review thay vì tiếp tục retry.
     */
    handleGracePeriodTimeout(gracePeriodMinutes: number | undefined, scheduleOptions: OptionalScheduleOptions): Promise<{
        autoOfficiated: number[];
        flaggedForReview: number[];
    }>;
    forfeitMatch(matchId: number, forfeitingTeamId: number, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
    /**
     * FIX (field reuse conflict — bug report #4): trước đây check
     * `match.postponed_reason` để tránh ghi đè, nhưng field đó có thể còn
     * giá trị từ lần postpone TRƯỚC nếu match từng postpone rồi resume
     * (status → ongoing) — check này block nhầm abandon hợp lệ có kèm
     * reason. Tách hẳn field abandoned_reason (migration required), không
     * dùng chung với postponed_reason nữa.
     */
    abandonMatch(matchId: number, minute: number, reason?: string): Promise<void>;
    fileAppeal(matchId: number, reason: string): Promise<void>;
    fileProtest(matchId: number, reason: string): Promise<void>;
    private _fileDispute;
    /**
     * FIX (race condition — bug report #3): trước đây KHÔNG lock row, đọc
     * match/matchResult bằng plain findUniqueOrThrow/findUnique NGOÀI
     * transaction, ghi 2 statement (overturn) TRONG 1 transaction riêng —
     * 2 admin resolve cùng lúc là race, last-write-wins, không CONFLICT.
     * Giờ toàn bộ đọc+ghi gộp vào 1 transaction có FOR UPDATE lock ngay từ
     * đầu, serialize đúng với addEvent/deleteEvent/editEvent/editScore/
     * confirmResult (đều lock cùng row).
     *
     * KNOWN GAP (chưa giải quyết, cần confirm nghiệp vụ trước khi ship):
     * overturn ghi thẳng home_final_score/away_final_score MỚI nhưng KHÔNG
     * đụng match_events — phá invariant "score = f(events)" mà
     * overrideResultInTx/_recalculateResultTx bảo vệ. PlayerStatistic (tính
     * từ events) sẽ KHÔNG đổi theo overturn này. Nếu overturn có thể do đổi
     * 1 bàn thắng cụ thể (offside phát hiện sau), cần sửa match_events
     * tương ứng qua addEvent/deleteEvent TRƯỚC KHI gọi overturn, hoặc mở
     * rộng ResolveAppealInput nhận eventChanges và tự áp dụng ở đây.
     */
    resolveAppeal(matchId: number, input: ResolveAppealInput): Promise<void>;
    private _assertCorrectionWindow;
    addEvent(matchId: number, input: AddEventInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    deleteEvent(matchId: number, eventId: number, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    editEvent(matchId: number, eventId: number, input: EditEventInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    editScore(matchId: number, input: EditScoreInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    /**
     * FIX (bracket-advance guard + round-robin seeding lock — bug report #1
     * và câu hỏi "round robin rồi tới knockout"): trước đây method này
     * KHÔNG có guard nào — sửa event có thể đổi winner_team_id của 1 match
     * knockout đã advance (round kế tiếp đã tạo, có thể đã đá), hoặc đổi
     * kết quả round-robin sau khi standings đã dùng để seed knockout bracket
     * (đổi thứ hạng mà bracket không re-seed theo).
     *
     * Fix: 1 điểm check duy nhất, chạy TRONG transaction (throw sẽ rollback
     * cả insert/delete/update event ở caller):
     * - Round-robin: chặn cứng nếu season đã seed knockout bracket.
     * - Knockout: chỉ chặn nếu winner THỰC SỰ đổi so với trước VÀ round kế
     *   tiếp đã tạo — sửa minute/note không đổi winner thì vẫn cho qua.
     */
    private _recalculateResultTx;
    private _runPostCorrectionSteps;
    adminRecordResult(matchId: number, input: AdminRecordResultInput, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
}
//# sourceMappingURL=match.service.d.ts.map