// import {
//     Controller, Route, Tags,
//     Post, Get, Path, Body, Query,
//     Security, SuccessResponse,
// } from 'tsoa';
// import { MatchAdmin } from '../types/match.queries.js';
// import { PaginatedResult } from '../types/queryable.type.js';
// import { MatchLifecycleService } from '../services/match.service.js';
export {};
// @Route('')
// @Tags('MatchResult')
// export class MatchResultController extends Controller {
//     constructor(private service: MatchLifecycleService) {
//         super();
//     }
//     // ─── Read — admin only ────────────────────────────────────────────────────
//     /**
//      * List matches pending admin review (manual-score path timeout).
//      * Dùng cho admin dashboard → không expose public.
//      * Status = needs_review: manual score submitted, grace period expired,
//      * cần admin confirm hoặc đội bóng bổ sung events.
//      */
//     @Security('jwt', ['admin'])
//     @Get('matches/needs-review')
//     async listNeedsReview(
//         @Query() page = 1,
//         @Query() per_page = 20,
//     ): Promise<PaginatedResult<MatchAdmin>> {
//         return this.service.listNeedsReview({ page, per_page });
//     }
//     // ─── Dispute management ───────────────────────────────────────────────────
//     /**
//      * File appeal: MatchResult.status official → under_review.
//      * Appeal = khiếu nại về quyết định, thường từ đội bóng.
//      * Admin xử lý: uphold (giữ) hoặc overturn (đổi kết quả).
//      *
//      * Guard: MatchResult.status phải = official.
//      * Chỉ 1 appeal per MatchResult — reject nếu đã có appeal/protest.
//      */
//     @Security('jwt', ['admin'])
//     @Post('matches/{matchId}/appeal')
//     @SuccessResponse(204, 'Appeal filed')
//     async fileAppeal(
//         @Path() matchId: number,
//         @Body() body: any,
//     ): Promise<void> {
//         const { reason } = FileDisputeSchema.parse(body);
//         this.setStatus(204);
//         await this.service.fileAppeal(matchId, reason);
//     }
//     /**
//      * File protest: MatchResult.status official → protested.
//      * Protest = phản đối chính thức, thường từ BTC/giám sát viên.
//      * Quy trình xử lý có thể khác appeal (formal meeting, escalation...).
//      *
//      * Guard: MatchResult.status phải = official.
//      * Chỉ 1 protest per MatchResult — reject nếu đã có appeal/protest.
//      */
//     @Security('jwt', ['admin'])
//     @Post('matches/{matchId}/protest')
//     @SuccessResponse(204, 'Protest filed')
//     async fileProtest(
//         @Path() matchId: number,
//         @Body() body: any,
//     ): Promise<void> {
//         const { reason } = FileDisputeSchema.parse(body);
//         this.setStatus(204);
//         await this.service.fileProtest(matchId, reason);
//     }
//     /**
//      * Resolve appeal/protest — uphold hoặc overturn.
//      *
//      * uphold:
//      *   MatchResult.status under_review/protested → official
//      *   Ghi resolution_note, clear appeal_reason, set appeal_resolved_at.
//      *
//      * overturn:
//      *   Đổi score → cập nhật MatchResult + Match
//      *   Recompute standings (round_robin)
//      *   Knockout overturn: throw NOT_IMPLEMENTED (bracket invalid, need manual)
//      *
//      * Guard overturn:
//      *   - resultType phải = full_time (ET/penalty cần input riêng biệt)
//      *   - newHomeScore !== newAwayScore (không draw)
//      */
//     @Security('jwt', ['admin'])
//     @Post('matches/{matchId}/resolve-appeal')
//     @SuccessResponse(204, 'Appeal resolved')
//     async resolveAppeal(
//         @Path() matchId: number,
//         @Body() body: any,
//     ): Promise<void> {
//         const input = ResolveAppealSchema.parse(body);
//         this.setStatus(204);
//         await this.service.resolveAppeal(matchId, input);
//     }
// }
//# sourceMappingURL=matchResult.controller.js.map