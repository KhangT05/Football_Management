import {
    Controller,
    Get,
    Path,
    Tags,
    Route,
    Post,
    Patch,
    Body,
    SuccessResponse,
    Delete,
    Query,
    Security,
    Request,
} from "tsoa";
import type { Request as ExRequest } from "express";

type AuthRequest = ExRequest & { user: { user_id: number } };

import {
    MatchLifecycleService, AddEventInput, EditEventInput,
    EditScoreInput
} from "../services/match.service.js";
import { MatchResultService } from "../services/matchresult.service.js";
import { MatchPeriod } from "../generated/prisma/client.js";
import {
    FinalizeMatchInput,
    ManualScoreInput,
    RecordEventInput,
    ResolveAppealInput,
} from "../types/match.type.js";
import { ConfirmResultOutput } from "../types/matchResult.type.js";
import { ScheduleOptions } from "../types/schedule.type.js";

// ─── Inline DTOs ──────────────────────────────────────────────────────────────
// Không tách file riêng vì các type này chỉ dùng ở controller này.
// Nếu reuse sang controller khác thì move sang dtos/match.schema.ts.

interface TransitionPeriodBody {
    period: MatchPeriod;
}

interface RecordEventBody extends RecordEventInput { }

interface FinalizeMatchBody extends FinalizeMatchInput { }

interface ManualScoreBody extends ManualScoreInput { }

interface ScheduleOptionsBody extends ScheduleOptions { }

interface ForfeitMatchBody {
    forfeitingTeamId: number;
    scheduleOptions: ScheduleOptions;
}

interface AbandonMatchBody {
    minute: number;
    reason?: string;
}

interface FileDisputeBody {
    reason: string;
}

interface ResolveAppealBody extends ResolveAppealInput { }

interface AddEventBody extends AddEventInput {
    period: MatchPeriod; // bắt buộc trong correction — override optional từ RecordEventInput
}

interface EditEventBody extends EditEventInput { }

interface EditScoreBody extends EditScoreInput { }

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

@Route("matches")
@Tags("Match")
export class MatchController extends Controller {
    constructor(
        private readonly lifecycleService: MatchLifecycleService,
        private readonly matchResultService: MatchResultService,
    ) {
        super();
    }

    // ─── State machine ────────────────────────────────────────────────────────

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
        @Body() body: TransitionPeriodBody,
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
        @Body() body: RecordEventBody,
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
        @Body() body: FinalizeMatchBody & { scheduleOptions: ScheduleOptions },
    ): Promise<void> {
        this.setStatus(204);
        const { scheduleOptions, ...finalizeInput } = body;
        return this.lifecycleService.finalizeMatch(id, finalizeInput, scheduleOptions);
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
        @Body() body: ManualScoreBody & { scheduleOptions: ScheduleOptions },
    ): Promise<void> {
        this.setStatus(204);
        const { scheduleOptions, ...manualInput } = body;
        return this.lifecycleService.submitManualScore(id, manualInput, scheduleOptions);
    }

    /**
     * Xác nhận kết quả chính thức sau grace period.
     * Event path: compute score từ toàn bộ events.
     * Manual path: dùng manual_home_score / manual_away_score.
     * Tạo MatchResult, update standings, advance knockout bracket nếu có.
     */
    @Security("jwt", ["admin"])
    @Post("{id}/confirm")
    async confirmOfficial(
        @Path() id: number,
        @Body() body: ScheduleOptionsBody,
    ): Promise<ConfirmResultOutput> {
        return this.lifecycleService.confirmOfficial(id, body);
    }

    // ─── Special match outcomes ───────────────────────────────────────────────

    /**
     * Xử phạt thua cuộc (forfeit / walkover) — BTC quyết định.
     * Bypass grace period, tạo MatchResult trực tiếp.
     * walkover = scheduled + team không xuất hiện.
     * forfeit  = ongoing/finished + team bỏ cuộc / vi phạm.
     */
    @Security("jwt", ["admin"])
    @Post("{id}/forfeit")
    async forfeitMatch(
        @Path() id: number,
        @Body() body: ForfeitMatchBody,
    ): Promise<ConfirmResultOutput> {
        return this.lifecycleService.forfeitMatch(
            id,
            body.forfeitingTeamId,
            body.scheduleOptions,
        );
    }

    /**
     * Dừng trận giữa chừng (thời tiết, bạo lực...).
     * Match chuyển sang abandoned, không tạo MatchResult.
     */
    @Security("jwt", ["admin"])
    @Post("{id}/abandon")
    @SuccessResponse(204, "Abandoned")
    async abandonMatch(
        @Path() id: number,
        @Body() body: AbandonMatchBody,
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
        @Body() body: FileDisputeBody,
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
        @Body() body: FileDisputeBody,
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
    @Security("jwt", ["admin"])
    @Post("{id}/resolve-appeal")
    @SuccessResponse(204, "Appeal resolved")
    async resolveAppeal(
        @Path() id: number,
        @Body() body: ResolveAppealBody,
    ): Promise<void> {
        this.setStatus(204);
        return this.lifecycleService.resolveAppeal(id, body);
    }

    // ─── Correction window (admin only, 15p sau finished) ────────────────────

    /**
     * Thêm event bị sót sau khi match finished.
     * Chỉ trong 15p kể từ played_at. period bắt buộc.
     * Tự recompute MatchResult sau khi thêm.
     */
    @Security("jwt", ["admin"])
    @Post("{id}/correction/events")
    @SuccessResponse(204, "Event added")
    async addEvent(
        @Path() id: number,
        @Body() body: AddEventBody & { scheduleOptions: ScheduleOptions },
    ): Promise<void> {
        this.setStatus(204);
        const { scheduleOptions, ...eventInput } = body;
        return this.lifecycleService.addEvent(
            id,
            eventInput as AddEventInput & { period: MatchPeriod },
            scheduleOptions,
        );
    }

    /**
     * Xóa event nhập sai sau khi match finished.
     * Chỉ trong 15p kể từ played_at.
     * Tự recompute MatchResult sau khi xóa.
     */
    @Security("jwt", ["admin"])
    @Delete("{id}/correction/events/{eventId}")
    @SuccessResponse(204, "Event deleted")
    async deleteEvent(
        @Path() id: number,
        @Path() eventId: number,
        @Body() body: ScheduleOptionsBody,
    ): Promise<void> {
        this.setStatus(204);
        return this.lifecycleService.deleteEvent(id, eventId, body);
    }

    /**
     * Sửa event (minute, type, player, period, note) sau khi match finished.
     * Chỉ trong 15p kể từ played_at. Partial patch — chỉ field được truyền.
     * Tự recompute MatchResult sau khi sửa.
     */
    @Security("jwt", ["admin"])
    @Patch("{id}/correction/events/{eventId}")
    @SuccessResponse(204, "Event edited")
    async editEvent(
        @Path() id: number,
        @Path() eventId: number,
        @Body() body: EditEventBody & { scheduleOptions: ScheduleOptions },
    ): Promise<void> {
        this.setStatus(204);
        const { scheduleOptions, ...editInput } = body;
        return this.lifecycleService.editEvent(id, eventId, editInput, scheduleOptions);
    }

    /**
     * Override score trực tiếp — chỉ dùng cho manual path (match không có events).
     * Chỉ trong 15p kể từ played_at.
     * Reject nếu match có events → dùng addEvent/deleteEvent/editEvent thay thế.
     */
    @Security("jwt", ["admin"])
    @Patch("{id}/correction/score")
    @SuccessResponse(204, "Score corrected")
    async editScore(
        @Path() id: number,
        @Body() body: EditScoreBody & { scheduleOptions: ScheduleOptions },
    ): Promise<void> {
        this.setStatus(204);
        const { scheduleOptions, ...scoreInput } = body;
        return this.lifecycleService.editScore(id, scoreInput, scheduleOptions);
    }
}