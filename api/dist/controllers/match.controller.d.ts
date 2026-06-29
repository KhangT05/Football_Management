import { Controller } from "tsoa";
import { MatchLifecycleService } from "../services/match.service.js";
import * as matchType from "../types/match.type.js";
import { ConfirmResultOutput } from "../types/matchResult.type.js";
import * as matchSchema from "../dtos/match.schema.js";
export declare class MatchController extends Controller {
    private readonly lifecycleService;
    constructor(lifecycleService: MatchLifecycleService);
    /**
     * Bắt đầu trận đấu — chuyển scheduled → ongoing.
     * Khởi tạo home_score/away_score = 0, current_period = first_half.
     */
    startMatch(id: number): Promise<void>;
    /**
     * Chuyển period (first_half → second_half → extra_time_first...).
     * Validate transition hợp lệ theo PERIOD_TRANSITIONS map.
     */
    transitionPeriod(id: number, body: matchSchema.TransitionPeriodDto): Promise<void>;
    /**
     * Ghi nhận event trong trận (goal, thẻ, thay người...).
     * Cho phép nhập khi ongoing hoặc pending_official (grace period 15p).
     */
    recordEvent(id: number, body: matchType.RecordEventInput): Promise<void>;
    /**
     * Referee bấm kết thúc trận — chuyển ongoing → pending_official (grace period 15p).
     * KHÔNG tạo MatchResult. MatchResult chỉ tạo tại confirmOfficial.
     * Lưu referee input (resultType, penalty, half-time) để dùng lại khi confirm.
     */
    finalizeMatch(id: number, body: matchSchema.FinalizeMatchDto): Promise<void>;
    /**
     * Nhập tay kết quả — fallback khi referee không dùng app (giải nhỏ).
     * Reject nếu match đã có events. Manual path → needs_review sau timeout.
     */
    submitManualScore(id: number, body: matchSchema.ManualScoreDto): Promise<void>;
    /**
     * Xác nhận kết quả chính thức sau grace period.
     * Event path: compute score từ toàn bộ events.
     * Manual path: dùng manual_home_score / manual_away_score.
     * Tạo MatchResult, update standings, advance knockout bracket nếu có.
     * venueIds/matchTimes bắt buộc khi knockout (validated tại matchResultService).
     */
    confirmOfficial(id: number, body: matchSchema.ConfirmOfficialDto): Promise<ConfirmResultOutput>;
    /**
     * Xử phạt thua cuộc (forfeit / walkover) — BTC quyết định.
     * Bypass grace period, tạo MatchResult trực tiếp.
     * walkover = scheduled + team không xuất hiện.
     * forfeit  = ongoing/finished + team bỏ cuộc / vi phạm.
     * venueIds/matchTimes optional — bắt buộc nếu knockout (validated tại matchResultService).
     */
    forfeitMatch(id: number, body: matchSchema.ForfeitMatchDto): Promise<ConfirmResultOutput>;
    /**
     * Dừng trận giữa chừng (thời tiết, bạo lực...).
     * Match chuyển sang abandoned, không tạo MatchResult.
     */
    abandonMatch(id: number, body: matchSchema.AbandonMatchDto): Promise<void>;
    /**
     * File khiếu nại — chỉ khi MatchResult.status = official.
     * Chuyển → under_review.
     */
    fileAppeal(id: number, body: matchSchema.FileDisputeDto): Promise<void>;
    /**
     * File phản đối chính thức — chỉ khi MatchResult.status = official.
     * Chuyển → protested.
     */
    fileProtest(id: number, body: matchSchema.FileDisputeDto): Promise<void>;
    /**
     * Giải quyết khiếu nại / phản đối.
     * uphold   = giữ nguyên kết quả → official.
     * overturn = đảo ngược kết quả → overturned + recompute standings.
     * Knockout overturn chưa hỗ trợ tự động (bracket đã advance).
     */
    resolveAppeal(id: number, body: matchSchema.ResolveAppealDto): Promise<void>;
    /**
     * Thêm event bị sót sau khi match finished.
     * Chỉ trong 15p kể từ played_at. period bắt buộc (AddEventInput).
     * Tự recompute MatchResult sau khi thêm.
     * venueIds/matchTimes optional — cần nếu correction thay đổi winner ở knockout.
     */
    addEvent(id: number, body: matchType.AddEventInput & matchSchema.ConfirmOfficialDto): Promise<void>;
    /**
     * Xóa event nhập sai sau khi match finished.
     * Chỉ trong 15p kể từ played_at.
     * Tự recompute MatchResult sau khi xóa.
     * scheduleOptions truyền qua query params vì DELETE không nên có body.
     * venueIds/matchTimes dạng CSV: ?venueIds=1,2&matchTimes=2025-01-01T10:00:00Z,...
     */
    deleteEvent(id: number, eventId: number, venueIds?: string, matchTimes?: string): Promise<void>;
    /**
     * Sửa event (minute, type, player, period, note) sau khi match finished.
     * Chỉ trong 15p kể từ played_at. Partial patch — chỉ field được truyền.
     * Tự recompute MatchResult sau khi sửa.
     */
    editEvent(id: number, eventId: number, body: matchType.EditEventInput & matchSchema.ConfirmOfficialDto): Promise<void>;
    /**
     * Override score trực tiếp — chỉ dùng cho manual path (match không có events).
     * Chỉ trong 15p kể từ played_at.
     * Reject nếu match có events → dùng addEvent/deleteEvent/editEvent thay thế.
     */
    editScore(id: number, body: matchType.EditScoreInput & matchSchema.ConfirmOfficialDto): Promise<void>;
    /**
 * Admin nhập kết quả trực tiếp cho trận ở bất kỳ trạng thái hợp lệ nào.
 *
 * Khác với recordEvent (từng event riêng lẻ):
 *   - Finalize toàn bộ match ngay lập tức
 *   - Score = input.homeScore / input.awayScore (không compute từ events)
 *   - scorers[] chỉ để audit trail / player stats, không ảnh hưởng score
 *
 * Allowed statuses: scheduled, postponed, bye, ongoing, pending_official, needs_review
 * Reject: finished, cancelled, forfeited, abandoned
 */
    adminRecordResult(id: number, body: matchType.AdminRecordResultInput): Promise<ConfirmResultOutput>;
}
//# sourceMappingURL=match.controller.d.ts.map