// import {
//     Controller, Route, Tags,
//     Post, Get, Path, Body, Query,
//     Security, SuccessResponse,
// } from 'tsoa';
// import { MatchLifecycleService } from '../services/match.service.js';
// import * as matchSchema from '../dtos/match.schema.js';
// import { ConfirmResultOutput } from '../types/matchResult.type.js';
// import { MatchDetail, MatchList } from '../types/match.queries.js';
// import { PaginatedResult } from '../types/queryable.type.js';
export {};
// @Route('')
// @Tags('Match')
// export class MatchController extends Controller {
//     constructor(private service: MatchLifecycleService) {
//         super();
//     }
//     // ─── Read — guest, không cần jwt ─────────────────────────────────────────
//     /**
//      * List matches theo phase — dùng cho lịch thi đấu, bracket display.
//      * Filter theo status/groupId nếu cần (round_robin group view, knockout round).
//      */
//     @Get('phases/{phaseId}/matches')
//     async listByPhase(
//         @Path() phaseId: number,
//         @Query() page = 1,
//         @Query() per_page = 20,
//         @Query() status?: string,
//         @Query() groupId?: number,
//     ): Promise<PaginatedResult<MatchList>> {
//         return this.service.listByPhase(phaseId, { page, per_page, status, groupId });
//     }
//     /**
//      * Match detail — full events, result, lineup.
//      * Dùng cho referee app, spectator, live score polling.
//      */
//     @Get('matches/{matchId}')
//     async findById(
//         @Path() matchId: number,
//     ): Promise<MatchDetail> {
//         return this.service.findByIdOrFail(matchId);
//     }
//     // ─── Lifecycle — referee + admin ──────────────────────────────────────────
//     /**
//      * Bắt đầu trận: scheduled → ongoing.
//      * Init home_score = away_score = 0, current_period = first_half.
//      */
//     @Security('jwt', ['admin', 'referee'])
//     @Post('matches/{matchId}/start')
//     @SuccessResponse(204, 'Started')
//     async startMatch(
//         @Path() matchId: number,
//     ): Promise<void> {
//         this.setStatus(204);
//         await this.service.startMatch(matchId);
//     }
//     /**
//      * Chuyển period (second_half, extra_time_first, extra_time_second, penalty_shootout).
//      * Transition không hợp lệ bị reject bởi PERIOD_TRANSITIONS guard.
//      */
//     @Security('jwt', ['admin', 'referee'])
//     @Post('matches/{matchId}/period')
//     @SuccessResponse(204, 'Period transitioned')
//     async transitionPeriod(
//         @Path() matchId: number,
//         @Body() body: matchSchema.TransitionPeriodDto,
//     ): Promise<void> {
//         const { period } = matchSchema.TransitionPeriodSchema.parse(body);
//         this.setStatus(204);
//         await this.service.transitionPeriod(matchId, period);
//     }
//     /**
//      * Nhập event (goal, thẻ, thay người...).
//      * Available khi ongoing (live score update) và pending_official (grace period, chỉ lưu event).
//      * second_yellow guard: reject nếu player đã có yellow — phải dùng type 'second_yellow'.
//      */
//     @Security('jwt', ['admin', 'referee'])
//     @Post('matches/{matchId}/events')
//     @SuccessResponse(204, 'Event recorded')
//     async recordEvent(
//         @Path() matchId: number,
//         @Body() body: matchSchema.RecordEventDto,
//     ): Promise<void> {
//         const input = matchSchema.RecordEventSchema.parse(body);
//         this.setStatus(204);
//         await this.service.recordEvent(matchId, input);
//     }
//     /**
//      * Referee bấm còi kết thúc: ongoing → pending_official (grace period 15p).
//      * KHÔNG tạo MatchResult — referee còn 15p để bổ sung events bị sót.
//      * Knockout draw ở full_time bị reject tại đây (sớm, không chờ đến confirm).
//      * Half-time score nhập ở đây để lưu snapshot display.
//      */
//     @Security('jwt', ['admin', 'referee'])
//     @Post('matches/{matchId}/finalize')
//     @SuccessResponse(204, 'Finalized — grace period started')
//     async finalizeMatch(
//         @Path() matchId: number,
//         @Body() body: matchSchema.FinalizeMatchDto,
//     ): Promise<void> {
//         const input = matchSchema.FinalizeMatchSchema.parse(body);
//         this.setStatus(204);
//         await this.service.finalizeMatch(matchId, input, {});
//     }
//     /**
//      * Fallback khi referee không nhập events realtime (giải nhỏ, không có app).
//      * Bị reject nếu match đã có events — phải dùng finalizeMatch() thay thế.
//      * Sau grace period timeout: flag needs_review thay vì auto-official.
//      */
//     @Security('jwt', ['admin', 'referee'])
//     @Post('matches/{matchId}/manual-score')
//     @SuccessResponse(204, 'Manual score submitted — grace period started')
//     async submitManualScore(
//         @Path() matchId: number,
//         @Body() body: matchSchema.ManualScoreDto,
//     ): Promise<void> {
//         const input = matchSchema.ManualScoreSchema.parse(body);
//         this.setStatus(204);
//         await this.service.submitManualScore(matchId, input, {});
//     }
//     /**
//      * Referee xác nhận kết quả sau grace period: pending_official/needs_review → finished.
//      * Đây là nơi DUY NHẤT tạo MatchResult.
//      * Event path: compute score từ toàn bộ events (kể cả events nhập trong grace period).
//      * Manual path: dùng manual_home_score đã lưu lúc submitManualScore.
//      * venueIds/matchTimes: schedule options cho match tiếp theo nếu là knockout advance.
//      */
//     @Security('jwt', ['admin', 'referee'])
//     @Post('matches/{matchId}/confirm-official')
//     async confirmOfficial(
//         @Path() matchId: number,
//         @Body() body: matchSchema.ConfirmOfficialDto,
//     ): Promise<ConfirmResultOutput> {
//         const { venueIds, matchTimes } = matchSchema.ConfirmOfficialSchema.parse(body);
//         return this.service.confirmOfficial(matchId, { venueIds, matchTimes });
//     }
//     /**
//      * BTC quyết định forfeit/walkover — bypass grace period, tạo MatchResult ngay.
//      * walkover: match chưa diễn ra (scheduled), team không xuất hiện.
//      * forfeit:  match đang/đã diễn ra, team vi phạm hoặc bỏ cuộc.
//      * venueIds/matchTimes: knockout advance nếu cần.
//      */
//     @Security('jwt', ['admin'])
//     @Post('matches/{matchId}/forfeit')
//     async forfeitMatch(
//         @Path() matchId: number,
//         @Body() body: matchSchema.ForfeitMatchDto,
//     ): Promise<ConfirmResultOutput> {
//         const { forfeitingTeamId, venueIds, matchTimes } = matchSchema.ForfeitMatchSchema.parse(body);
//         return this.service.forfeitMatch(matchId, forfeitingTeamId, { venueIds, matchTimes });
//     }
//     /**
//      * Dừng trận giữa chừng (thời tiết, bạo lực, sự cố sân...).
//      * Match → abandoned. BTC quyết định sau: replay hoặc walkover cho team vi phạm.
//      */
//     @Security('jwt', ['admin', 'referee'])
//     @Post('matches/{matchId}/abandon')
//     @SuccessResponse(204, 'Abandoned')
//     async abandonMatch(
//         @Path() matchId: number,
//         @Body() body: matchSchema.AbandonMatchDto,
//     ): Promise<void> {
//         const { minute, reason } = matchSchema.AbandonMatchSchema.parse(body);
//         this.setStatus(204);
//         await this.service.abandonMatch(matchId, minute, reason);
//     }
// }
//# sourceMappingURL=match.controller.js.map