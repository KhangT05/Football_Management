import { MatchPeriod, PrismaClient } from '../generated/prisma/client.js';
import { ConfirmResultOutput } from '../types/matchResult.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { AddEventInput, FinalizeMatchInput, ManualScoreInput, RecordEventInput, ResolveAppealInput, EditEventInput, EditScoreInput, AdminRecordResultInput } from '../types/match.type.js';
import { MatchResultService } from './matchresult.service.js';
type CorrectionResult = {
    postCommitWarnings?: string[];
};
export declare const KNOCKOUT_DRAW_MARKER = "KNOCKOUT_DRAW_NEEDS_EXTRA_TIME_OR_PENALTY";
export declare const KNOCKOUT_ET_DRAW_MARKER = "KNOCKOUT_ET_DRAW_NEEDS_PENALTY";
export declare const KNOCKOUT_DRAW_MESSAGE_MARKER = "knockout draw \u1EDF";
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
    handleGracePeriodTimeout(gracePeriodMinutes: number | undefined, scheduleOptions: OptionalScheduleOptions): Promise<{
        autoOfficiated: number[];
        flaggedForReview: number[];
    }>;
    forfeitMatch(matchId: number, forfeitingTeamId: number, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
    abandonMatch(matchId: number, minute: number, reason?: string): Promise<void>;
    fileAppeal(matchId: number, reason: string): Promise<void>;
    fileProtest(matchId: number, reason: string): Promise<void>;
    private _fileDispute;
    resolveAppeal(matchId: number, input: ResolveAppealInput): Promise<CorrectionResult>;
    private _assertCorrectionWindow;
    private _runPostCorrectionSteps;
    addEvent(matchId: number, input: AddEventInput): Promise<CorrectionResult>;
    deleteEvent(matchId: number, eventId: number, scheduleOptions: OptionalScheduleOptions): Promise<CorrectionResult>;
    editEvent(matchId: number, eventId: number, input: EditEventInput): Promise<CorrectionResult>;
    editScore(matchId: number, input: EditScoreInput): Promise<CorrectionResult>;
    private _recalculateResultTx;
    /**
     * FIX (knockout draw guard + penalty forwarding):
     * - Trước đây không guard gì cho knockout hoà ở full_time → confirm được
     *   0-0, winner_team_id=null, bracket advance sai/silent. Giờ chặn với
     *   marker KNOCKOUT_DRAW_MARKER để FE bắt và show modal nhập pen — luồng
     *   dự kiến: admin bấm "Xác nhận" (full_time) -> BE reject với marker ->
     *   FE mở modal nhập penalty -> gọi lại adminRecordResult với
     *   resultType='penalty' + homePenaltyScore/awayPenaltyScore.
     * - Trước đây input.homePenaltyScore/awayPenaltyScore (nếu có) KHÔNG
     *   được forward vào confirmResultInTx — winner luôn tính theo
     *   home/awayScore (90') nên penalty không ảnh hưởng gì tới winner.
     *   Giờ forward đúng field.
     * - REQUIRES: AdminRecordResultInput cần có 2 field optional
     *   `homePenaltyScore?: number` và `awayPenaltyScore?: number` trong
     *   types/match.type.ts — đã có sẵn.
     */
    /**
     * FIX (knockout draw + extra_time + penalty flow):
     *
     * Luồng dự kiến cho knockout hoà:
     *   1. Admin bấm "Xác nhận" với resultType='full_time', homeScore=awayScore
     *      -> BE reject với KNOCKOUT_DRAW_MARKER.
     *   2. FE mở modal hiệp phụ. Admin có 2 lựa chọn:
     *      a. Nhập thêm bàn ET -> gọi lại với resultType='extra_time',
     *         homeScore/awayScore = TỔNG SAU HIỆP PHỤ (không phải chỉ bàn ET).
     *         Nếu vẫn hoà -> BE reject KNOCKOUT_ET_DRAW_MARKER -> FE mở modal pen.
     *      b. Bỏ qua hiệp phụ (giải không đá ET) -> gọi thẳng resultType='penalty'.
     *   3. resultType='penalty' -> cần homePenaltyScore/awayPenaltyScore, không
     *      được hoà.
     *
     * GIỚI HẠN THỰC TẾ (đã kiểm tra lại): match_events hiện KHÔNG có period
     * tag đáng tin cậy (FE không gửi period khi tạo event qua recordEvent),
     * nên KHÔNG THỂ tự tách 90' vs ET từ event data như _computeScoreFromEvents
     * làm cho recordEvent-driven flow. Do đó với admin path này, homeScore/
     * awayScore LUÔN được hiểu là "tỉ số cuối cùng tại thời điểm gọi" (có thể
     * đã bao gồm ET), và được dùng làm cả homeScore lẫn homeExtraTime khi
     * resultType cần ET — ĐÂY LÀ GIẢ ĐỊNH CHƯA VERIFY được với
     * matchresult.service.ts. Cần xác nhận confirmResultInTx có nhận & xử lý
     * đúng homeExtraTime/awayExtraTime giống confirmResult (dùng ở
     * confirmOfficial) hay không — nếu confirmResultInTx bỏ qua field này,
     * home_extra_time_score sẽ bị null sai lệch dù winner vẫn đúng (vì final
     * score dùng luôn homeScore).
     *
     * FIX (scorers không gắn player_id thật — bug report mới nhất):
     * - Trước đây `input.scorers` LUÔN tạo MatchEvent với player_id=null,
     *   tên cầu thủ chỉ nằm ở `note` (free-text). Hệ quả:
     *     1. PlayerStatistic.goals_scored KHÔNG tăng cho các bàn này —
     *        buildStatDeltas/_updatePlayerStatistics group theo player_id,
     *        player_id=null bị bỏ qua hoàn toàn khỏi thống kê.
     *     2. buildGoalsTimeline() (dùng ở getMatchReport, chính là nguồn
     *        data cho UI kiểu "Alexis Mac Allister 10'") resolve tên qua
     *        `playerNameLookup` (map từ Player thật trong lineup) chứ KHÔNG
     *        đọc `note` — nên trước đây các bàn nhập qua scorers luôn hiện
     *        "Unknown" trên UI report, dù `note` có lưu đúng tên.
     * - Giờ: nếu `AdminScorerInput.playerId` được truyền, dùng nó làm
     *   player_id thật (validate giống hệt pattern đang áp dụng cho
     *   `cards`: teamId phải thuộc match, player phải tồn tại, chưa bị
     *   truất quyền thi đấu). Nếu không có playerId (case chưa có đội hình
     *   chi tiết), giữ hành vi cũ — player_id=null, name chỉ nằm ở note,
     *   goalsTimeline sẽ fallback "Unknown" (không thể tránh khi không có
     *   Player thật để liên kết).
     */
    adminRecordResult(matchId: number, input: AdminRecordResultInput, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
}
export {};
//# sourceMappingURL=match.service.d.ts.map