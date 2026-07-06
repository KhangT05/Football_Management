var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Security, Queries, } from "tsoa";
import { MatchLifecycleService } from "../services/match.service.js";
import * as matchType from "../types/match.type.js";
import * as matchSchema from "../dtos/match.schema.js";
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
let MatchController = class MatchController extends Controller {
    lifecycleService;
    constructor(lifecycleService) {
        super();
        this.lifecycleService = lifecycleService;
    }
    // ─── State machine ────────────────────────────────────────────────────────
    /**
     * Bắt đầu trận đấu — chuyển scheduled → ongoing.
     * Khởi tạo home_score/away_score = 0, current_period = first_half.
     */
    async startMatch(id) {
        this.setStatus(204);
        return this.lifecycleService.startMatch(id);
    }
    /**
     * Chuyển period (first_half → second_half → extra_time_first...).
     * Validate transition hợp lệ theo PERIOD_TRANSITIONS map.
     */
    async transitionPeriod(id, body) {
        this.setStatus(204);
        return this.lifecycleService.transitionPeriod(id, body.period);
    }
    /**
     * Ghi nhận event trong trận (goal, thẻ, thay người...).
     * Cho phép nhập khi ongoing hoặc pending_official (grace period 15p).
     */
    async recordEvent(id, body) {
        this.setStatus(204);
        return this.lifecycleService.recordEvent(id, body);
    }
    /**
     * Referee bấm kết thúc trận — chuyển ongoing → pending_official (grace period 15p).
     * KHÔNG tạo MatchResult. MatchResult chỉ tạo tại confirmOfficial.
     * Lưu referee input (resultType, penalty, half-time) để dùng lại khi confirm.
     */
    async finalizeMatch(id, body) {
        this.setStatus(204);
        // FinalizeMatchDto không có venueIds/matchTimes — finalize không advance bracket.
        // scheduleOptions truyền empty vì knockout guard xảy ra tại confirmOfficial.
        return this.lifecycleService.finalizeMatch(id, body, {});
    }
    /**
     * Nhập tay kết quả — fallback khi referee không dùng app (giải nhỏ).
     * Reject nếu match đã có events. Manual path → needs_review sau timeout.
     */
    async submitManualScore(id, body) {
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
     */
    async confirmOfficial(id, body) {
        return this.lifecycleService.confirmOfficial(id, body);
    }
    // ─── Special match outcomes ───────────────────────────────────────────────
    /**
     * Xử phạt thua cuộc (forfeit / walkover) — BTC quyết định.
     * Bypass grace period, tạo MatchResult trực tiếp.
     * walkover = scheduled + team không xuất hiện.
     * forfeit  = ongoing/finished + team bỏ cuộc / vi phạm.
     * venueIds/matchTimes optional — bắt buộc nếu knockout (validated tại matchResultService).
     */
    async forfeitMatch(id, body) {
        const { forfeitingTeamId, ...scheduleOptions } = body;
        return this.lifecycleService.forfeitMatch(id, forfeitingTeamId, scheduleOptions);
    }
    /**
     * Dừng trận giữa chừng (thời tiết, bạo lực...).
     * Match chuyển sang abandoned, không tạo MatchResult.
     */
    async abandonMatch(id, body) {
        this.setStatus(204);
        return this.lifecycleService.abandonMatch(id, body.minute, body.reason);
    }
    // ─── Appeal / protest ─────────────────────────────────────────────────────
    /**
     * File khiếu nại — chỉ khi MatchResult.status = official.
     * Chuyển → under_review.
     */
    async fileAppeal(id, body) {
        this.setStatus(204);
        return this.lifecycleService.fileAppeal(id, body.reason);
    }
    /**
     * File phản đối chính thức — chỉ khi MatchResult.status = official.
     * Chuyển → protested.
     */
    async fileProtest(id, body) {
        this.setStatus(204);
        return this.lifecycleService.fileProtest(id, body.reason);
    }
    /**
     * Giải quyết khiếu nại / phản đối.
     * uphold   = giữ nguyên kết quả → official.
     * overturn = đảo ngược kết quả → overturned + recompute standings.
     * Knockout overturn chưa hỗ trợ tự động (bracket đã advance).
     */
    async resolveAppeal(id, body) {
        this.setStatus(204);
        return this.lifecycleService.resolveAppeal(id, body);
    }
    // ─── Correction window (admin only, 15p sau finished) ────────────────────
    /**
     * Thêm event bị sót sau khi match finished.
     * Chỉ trong 15p kể từ played_at. period bắt buộc (AddEventInput).
     * Tự recompute MatchResult sau khi thêm.
     * venueIds/matchTimes optional — cần nếu correction thay đổi winner ở knockout.
     */
    async addEvent(id, body) {
        this.setStatus(204);
        const { venueIds, matchTimes, ...eventInput } = body;
        return this.lifecycleService.addEvent(id, eventInput, { venueIds, matchTimes });
    }
    /**
     * Xóa event nhập sai sau khi match finished.
     * Chỉ trong 15p kể từ played_at.
     * Tự recompute MatchResult sau khi xóa.
     * scheduleOptions truyền qua query params vì DELETE không nên có body.
     * venueIds/matchTimes dạng CSV: ?venueIds=1,2&matchTimes=2025-01-01T10:00:00Z,...
     */
    async deleteEvent(id, eventId, query) {
        this.setStatus(204);
        return this.lifecycleService.deleteEvent(id, eventId, query);
    }
    /**
     * Sửa event (minute, type, player, period, note) sau khi match finished.
     * Chỉ trong 15p kể từ played_at. Partial patch — chỉ field được truyền.
     * Tự recompute MatchResult sau khi sửa.
     */
    async editEvent(id, eventId, body) {
        this.setStatus(204);
        const { venueIds, matchTimes, ...editInput } = body;
        return this.lifecycleService.editEvent(id, eventId, editInput, { venueIds, matchTimes });
    }
    /**
     * Override score trực tiếp — chỉ dùng cho manual path (match không có events).
     * Chỉ trong 15p kể từ played_at.
     * Reject nếu match có events → dùng addEvent/deleteEvent/editEvent thay thế.
     */
    async editScore(id, body) {
        this.setStatus(204);
        const { venueIds, matchTimes, ...scoreInput } = body;
        return this.lifecycleService.editScore(id, scoreInput, { venueIds, matchTimes });
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
    async adminRecordResult(id, body) {
        this.setStatus(201);
        // scheduleOptions: pass empty — knockout advance sẽ dùng venue/time default
        // Nếu cần override venue/matchTimes, mở rộng body hoặc thêm @Query params
        return this.lifecycleService.adminRecordResult(id, body, {});
    }
};
__decorate([
    Security("jwt", ["organizing", "admin"]),
    Post("{id}/start"),
    SuccessResponse(204, "Started"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "startMatch", null);
__decorate([
    Security("jwt", ["organizing", "admin"]),
    Post("{id}/period"),
    SuccessResponse(204, "Period transitioned"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "transitionPeriod", null);
__decorate([
    Security("jwt", ["organizing", "admin"]),
    Post("{id}/events"),
    SuccessResponse(204, "Event recorded"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "recordEvent", null);
__decorate([
    Security("jwt", ["organizing", "admin"]),
    Post("{id}/finalize"),
    SuccessResponse(204, "Finalized"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "finalizeMatch", null);
__decorate([
    Security("jwt", ["organizing", "admin"]),
    Post("{id}/manual-score"),
    SuccessResponse(204, "Manual score submitted"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "submitManualScore", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("{id}/confirm"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "confirmOfficial", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("{id}/forfeit"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "forfeitMatch", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("{id}/abandon"),
    SuccessResponse(204, "Abandoned"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "abandonMatch", null);
__decorate([
    Security("jwt", ["admin", "organizing", "user", "leader"]),
    Post("{id}/appeal"),
    SuccessResponse(204, "Appeal filed"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "fileAppeal", null);
__decorate([
    Security("jwt", ["admin", "organizing", "user", "leader"]),
    Post("{id}/protest"),
    SuccessResponse(204, "Protest filed"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "fileProtest", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("{id}/resolve-appeal"),
    SuccessResponse(204, "Appeal resolved"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "resolveAppeal", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("{id}/correction/events"),
    SuccessResponse(204, "Event added"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "addEvent", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("{id}/correction/events/{eventId}"),
    SuccessResponse(204, "Event deleted"),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Queries()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "deleteEvent", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{id}/correction/events/{eventId}"),
    SuccessResponse(204, "Event edited"),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "editEvent", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{id}/correction/score"),
    SuccessResponse(204, "Score corrected"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "editScore", null);
__decorate([
    Security("jwt", ["organizing", "admin"]),
    Post("{id}/admin-result"),
    SuccessResponse(201, "Result recorded"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "adminRecordResult", null);
MatchController = __decorate([
    Route("matches"),
    Tags("Match"),
    __metadata("design:paramtypes", [MatchLifecycleService])
], MatchController);
export { MatchController };
//# sourceMappingURL=match.controller.js.map