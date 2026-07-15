import {
    Controller,
    Path,
    Tags,
    Route,
    Post,
    Patch,
    Body,
    SuccessResponse,
    Delete,
    Security,
    Query,
    Queries,
} from "tsoa";
import { MatchLifecycleService } from "../services/match.service.js";
import * as matchType from "../types/match.type.js";
import { ConfirmResultOutput } from "../types/matchResult.type.js";
import * as matchSchema from "../dtos/match.schema.js";

// NEW: shape trả về cho 4 endpoint correction (addEvent/deleteEvent/editEvent/
// editScore) — khớp CorrectionResult bên matchlifecycle.service.ts. Trước đây
// 4 endpoint này @SuccessResponse(204,...) — HTTP 204 KHÔNG được phép có
// response body (RFC 7231 §6.3.5), nên dù service đã trả postCommitWarnings,
// tsoa/Express strip sạch trước khi ra khỏi server. FE luôn nhận body rỗng
// bất kể standings/player stats recompute thành công hay fail — chuỗi fix
// ở service layer (matchlifecycle.service.ts) và FE (LiveControlTab.jsx) vô
// tác dụng nếu thiếu bước này.
type CorrectionApiResult = { postCommitWarnings?: string[] };

// ─── Controller ───────────────────────────────────────────────────────────────
// Route: /matches/:id/*
//
// Auth phân tầng:
//   GET (xem kết quả, events)   → không cần JWT (guest)
//   referee operations          → jwt [organizing]  (startMatch, recordEvent, finalize, transitionPeriod)
//   admin operations            → jwt [admin]        (confirmOfficial, forfeit, abandon, resolveAppeal, correction)
//   appeal / protest            → jwt [user, leader] (fileAppeal, fileProtest — team có thể tự file)
//
// handleGracePeriodTimeout KHÔNG expose qua HTTP — gọi từ cron/worker nội bộ.
// confirmOfficial expose để admin có thể trigger thủ công (ngoài auto-timeout).
//
// Body types: dùng Zod-inferred DTOs từ match.schema.ts thay vì inline interface.
// ForfeitMatchDto thay thế inline ForfeitMatchBody — đã có venueIds/matchTimes optional.
@Route("matches")
@Tags("Match")
export class MatchController extends Controller {
    constructor(
        private readonly lifecycleService: MatchLifecycleService,
    ) {
        super();
    }

    /**
     * Bắt đầu trận đấu — chuyển scheduled → ongoing.
     * Khởi tạo home_score/away_score = 0, current_period = first_half.
     */
    @Security("jwt", ["organizing", "admin"])
    @Post("{id}/start")
    @SuccessResponse(204, "Started")
    async startMatch(@Path() id: number): Promise<void> {
        this.setStatus(204);
        return this.lifecycleService.startMatch(id);
    }

    /**
     * Chuyển period (first_half → second_half → extra_time_first...).
     * Validate transition hợp lệ theo PERIOD_TRANSITIONS map.
     */
    @Security("jwt", ["organizing", "admin"])
    @Post("{id}/period")
    @SuccessResponse(204, "Period transitioned")
    async transitionPeriod(
        @Path() id: number,
        @Body() body: matchSchema.TransitionPeriodDto,
    ): Promise<void> {
        this.setStatus(204);
        return this.lifecycleService.transitionPeriod(id, body.period);
    }

    /**
     * Ghi nhận event trong trận (goal, thẻ, thay người...).
     * Cho phép nhập khi ongoing hoặc pending_official (grace period 15p).
     */
    @Security("jwt", ["organizing", "admin"])
    @Post("{id}/events")
    @SuccessResponse(204, "Event recorded")
    async recordEvent(
        @Path() id: number,
        @Body() body: matchType.RecordEventInput,
    ): Promise<void> {
        this.setStatus(204);
        return this.lifecycleService.recordEvent(id, body);
    }

    /**
     * Referee bấm kết thúc trận — chuyển ongoing → pending_official (grace period 15p).
     * KHÔNG tạo MatchResult. MatchResult chỉ tạo tại confirmOfficial.
     * Lưu referee input (resultType, penalty, half-time) để dùng lại khi confirm.
     */
    @Security("jwt", ["organizing", "admin"])
    @Post("{id}/finalize")
    @SuccessResponse(204, "Finalized")
    async finalizeMatch(
        @Path() id: number,
        @Body() body: matchSchema.FinalizeMatchDto,
    ): Promise<void> {
        this.setStatus(204);
        // FinalizeMatchDto không có venueIds/matchTimes — finalize không advance bracket.
        // scheduleOptions truyền empty vì knockout guard xảy ra tại confirmOfficial.
        return this.lifecycleService.finalizeMatch(id, body, {});
    }

    /**
     * Nhập tay kết quả — fallback khi referee không dùng app (giải nhỏ).
     * Reject nếu match đã có events. Manual path → needs_review sau timeout.
     */
    @Security("jwt", ["organizing", "admin"])
    @Post("{id}/manual-score")
    @SuccessResponse(204, "Manual score submitted")
    async submitManualScore(
        @Path() id: number,
        @Body() body: matchSchema.ManualScoreDto,
    ): Promise<void> {
        this.setStatus(204);
        // Manual score cũng không cần scheduleOptions tại bước này.
        return this.lifecycleService.submitManualScore(id, body, {});
    }

    /**
     * Xác nhận kết quả chính thức sau grace period.
     * Event path: compute score từ toàn bộ events.
     * Manual path: dùng manual_home_score / manual_away_score.
     * Tạo MatchResult, update standings, advance knockout bracket nếu có.
     * venueIds/matchTimes bắt buộc khi knockout (validated tại matchResultService).
     *
     * FIX (route mismatch): matchApi.js FE (comment tự document rõ endpoint
     * dự kiến) gọi `/matches/{id}/confirm-official`, nhưng route decorator ở
     * đây trước đây là `{id}/confirm` — lệch nhau, mọi lần FE gọi
     * confirmOfficial() sẽ nhận 404. Đổi route để khớp matchApi.js (giữ
     * nguyên FE, sửa BE) — nếu route `{id}/confirm` mới là chuẩn dự định,
     * cần sửa ngược lại matchApi.js thay vì ở đây, xác nhận với người review.
     */
    @Security("jwt", ["admin", 'organizing'])
    @Post("{id}/correction/confirm-official")
    async confirmOfficial(
        @Path() id: number,
        @Body() body: matchSchema.ConfirmOfficialDto,
    ): Promise<ConfirmResultOutput> {
        const { venueIds, dailyStartTime, dailyEndTime, bufferMinutes, dateRangeStart, dateRangeEnd } =
            matchSchema.ConfirmOfficialSchema.parse(body);
        return this.lifecycleService.confirmOfficial(id, {
            venueIds, dailyStartTime, dailyEndTime, bufferMinutes, dateRangeStart, dateRangeEnd,
        });
    }

    // ─── Special match outcomes ───────────────────────────────────────────────

    /**
     * Xử phạt thua cuộc (forfeit / walkover) — BTC quyết định.
     * Bypass grace period, tạo MatchResult trực tiếp.
     * walkover = scheduled + team không xuất hiện.
     * forfeit  = ongoing/finished + team bỏ cuộc / vi phạm.
     * venueIds/matchTimes optional — bắt buộc nếu knockout (validated tại matchResultService).
     */
    @Security("jwt", ["admin", 'organizing'])
    @Post("{id}/correction/forfeit")
    async forfeitMatch(
        @Path() id: number,
        @Body() body: matchSchema.ForfeitMatchDto,
    ): Promise<ConfirmResultOutput> {
        const { forfeitingTeamId, venueIds, dailyStartTime, dailyEndTime, bufferMinutes, dateRangeStart, dateRangeEnd } =
            matchSchema.ForfeitMatchSchema.parse(body);
        return this.lifecycleService.forfeitMatch(id, forfeitingTeamId, {
            venueIds, dailyStartTime, dailyEndTime, bufferMinutes, dateRangeStart, dateRangeEnd,
        });
    }

    /**
     * Dừng trận giữa chừng (thời tiết, bạo lực...).
     * Match chuyển sang abandoned, không tạo MatchResult.
     */
    @Security("jwt", ["admin", 'organizing'])
    @Post("{id}/abandon")
    @SuccessResponse(204, "Abandoned")
    async abandonMatch(
        @Path() id: number,
        @Body() body: matchSchema.AbandonMatchDto,
    ): Promise<void> {
        this.setStatus(204);
        return this.lifecycleService.abandonMatch(id, body.minute, body.reason);
    }

    // ─── Appeal / protest ─────────────────────────────────────────────────────

    /**
     * File khiếu nại — chỉ khi MatchResult.status = official.
     * Chuyển → under_review.
     */
    @Security("jwt", ["admin", "organizing", "user", "leader"])
    @Post("{id}/appeal")
    @SuccessResponse(204, "Appeal filed")
    async fileAppeal(
        @Path() id: number,
        @Body() body: matchSchema.FileDisputeDto,
    ): Promise<void> {
        this.setStatus(204);
        return this.lifecycleService.fileAppeal(id, body.reason);
    }

    /**
     * File phản đối chính thức — chỉ khi MatchResult.status = official.
     * Chuyển → protested.
     */
    @Security("jwt", ["admin", "organizing", "user", "leader"])
    @Post("{id}/protest")
    @SuccessResponse(204, "Protest filed")
    async fileProtest(
        @Path() id: number,
        @Body() body: matchSchema.FileDisputeDto,
    ): Promise<void> {
        this.setStatus(204);
        return this.lifecycleService.fileProtest(id, body.reason);
    }

    /**
     * Giải quyết khiếu nại / phản đối.
     * uphold   = giữ nguyên kết quả → official.
     * overturn = đảo ngược kết quả → overturned + recompute standings.
     * Knockout overturn chưa hỗ trợ tự động (bracket đã advance).
     */
    @Security("jwt", ["admin", 'organizing'])
    @Post("{id}/resolve-appeal")
    @SuccessResponse(204, "Appeal resolved")
    async resolveAppeal(
        @Path() id: number,
        @Body() body: matchSchema.ResolveAppealDto,
    ): Promise<CorrectionApiResult> {
        this.setStatus(204);
        return this.lifecycleService.resolveAppeal(id, body);
    }

    // ─── Correction window (admin only, 15p sau finished) ────────────────────

    /**
     * Thêm event bị sót sau khi match finished.
     * Chỉ trong 15p kể từ played_at. period bắt buộc (AddEventInput).
     * Tự recompute MatchResult sau khi thêm.
     * venueIds/matchTimes optional — cần nếu correction thay đổi winner ở knockout.
     *
     * FIX (204 nuốt body): trước đây @SuccessResponse(204,...) + setStatus(204)
     * + return type void — HTTP 204 không được phép có body, nên
     * postCommitWarnings từ lifecycleService.addEvent() (xem
     * matchlifecycle.service.ts) bị strip sạch trước khi tới FE, bất kể
     * recompute standings/player stats thành công hay fail âm thầm. Đổi sang
     * 200 + trả nguyên object.
     */
    @Security("jwt", ["admin", 'organizing'])
    @Post("{id}/correction/events")
    @SuccessResponse(200, "Event added")
    async addEvent(
        @Path() id: number,
        @Body() body: matchType.AddEventInput,   // ← bỏ & matchSchema.ConfirmOfficialDto
    ): Promise<CorrectionApiResult> {
        return this.lifecycleService.addEvent(id, body);
    }

    /**
     * Xóa event nhập sai sau khi match finished.
     * Chỉ trong 15p kể từ played_at.
     * Tự recompute MatchResult sau khi xóa.
     * scheduleOptions truyền qua query params vì DELETE không nên có body.
     * venueIds/matchTimes dạng CSV: ?venueIds=1,2&matchTimes=2025-01-01T10:00:00Z,...
     *
     * FIX: cùng lý do addEvent — 204 -> 200 + trả postCommitWarnings.
     */
    @Security("jwt", ["admin", 'organizing'])
    @Delete("{id}/correction/events/{eventId}")
    @SuccessResponse(200, "Event deleted")
    async deleteEvent(
        @Path() id: number,
        @Path() eventId: number,
        @Queries() query: matchSchema.DeleteEventQueryDto,
    ): Promise<CorrectionApiResult> {
        return this.lifecycleService.deleteEvent(id, eventId, query);
    }

    @Security("jwt", ["admin", 'organizing'])
    @Patch("{id}/correction/events/{eventId}")
    @SuccessResponse(200, "Event edited")
    async editEvent(
        @Path() id: number,
        @Path() eventId: number,
        @Body() body: matchType.EditEventInput,   // ← bỏ & matchSchema.ConfirmOfficialDto
    ): Promise<CorrectionApiResult> {
        return this.lifecycleService.editEvent(id, eventId, body);
    }


    @Security("jwt", ["admin", 'organizing'])
    @Patch("{id}/correction/score")
    @SuccessResponse(200, "Score corrected")
    async editScore(
        @Path() id: number,
        @Body() body: matchType.EditScoreInput,
    ): Promise<CorrectionApiResult> {
        return this.lifecycleService.editScore(id, body);
    }

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
    @Security("jwt", ["organizing", "admin"])
    @Post("{id}/admin-result")
    @SuccessResponse(201, "Result recorded")
    async adminRecordResult(
        @Path() id: number,
        @Body() body: matchType.AdminRecordResultInput,
    ): Promise<ConfirmResultOutput> {
        this.setStatus(201);
        // scheduleOptions: pass empty — knockout advance sẽ dùng venue/time default
        // Nếu cần override venue/matchTimes, mở rộng body hoặc thêm @Query params
        return this.lifecycleService.adminRecordResult(id, body, {});
    }

}