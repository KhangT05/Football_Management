import {
    Controller, Route, Tags, Post, Get,
    Path, Body, Security, SuccessResponse,
} from 'tsoa';
import { KnockoutService } from '../services/knockout.service.js';
import * as knockoutSchema from '../dtos/knockout.schema.js';
import { BracketSlotNode, KnockoutGenerateResult } from '../types/knockout.type.js';

@Route('')
@Tags('Knockout')
export class KnockoutController extends Controller {
    constructor(private service: KnockoutService) {
        super();
    }

    /**
     * phaseId/seasonId lấy từ path, KHÔNG bắt client gửi lại trong body —
     * tránh conflict (path=5, body=7 thì theo cái nào?). Merge vào object
     * rồi validate lại bằng full schema gốc (knockoutGenerateOptionsSchema)
     * làm invariant check cuối, body schema con chỉ là contract cho OpenAPI.
     */
    @Security('jwt', ['admin'])
    @Post('seasons/{seasonId}/phases/{phaseId}/knockout/generate')
    @SuccessResponse(201, 'Created')
    async generateKnockoutBracket(
        @Path() seasonId: number,
        @Path() phaseId: number,
        @Body() body: knockoutSchema.GenerateKnockoutRequestDto,
    ): Promise<KnockoutGenerateResult> {
        const parsed = knockoutSchema.knockoutGenerateOptionsSchema.parse({
            ...body,
            seasonId,
            phaseId,
        });
        this.setStatus(201);
        return this.service.generateKnockoutBracket(parsed);
    }

    /**
     * Action-style mutation (không idempotent, không phải partial update của
     * resource) → POST giống autoSchedule, không dùng PATCH như rescheduleMatch.
     * venueIds/matchTimes trong body là ScheduleOptions cho match round sau
     * vừa được tạo ra (nếu advance làm xong 1 cặp slot).
     *
     * Service return newMatchId (singular) — leg 1 match ID của round tiếp theo.
     * Leg 2 match được tạo cùng lúc nhưng không expose vì client chỉ cần
     * anchor ID để poll/redirect; leg 2 visible qua GET bracket.
     */
    @Security('jwt', ['admin'])
    @Post('seasons/{seasonId}/phases/{phaseId}/knockout/advance')
    @SuccessResponse(200, 'OK')
    async advanceWinner(
        @Path() seasonId: number,
        @Path() phaseId: number,
        @Body() body: knockoutSchema.AdvanceWinnerRequestDto,
    ): Promise<{ matchCreated: boolean; newMatchId?: number }> {
        const { venueIds, matchTimes, ...input } = knockoutSchema.advanceWinnerRequestSchema.parse(body);
        return this.service.advanceWinner(phaseId, seasonId, input, { venueIds, matchTimes });
    }

    /**
     * Read-only — không @Security, theo đúng pattern getSchedule/getTeamSchedule.
     * Trả toàn bộ slot tree; client tự build visual bracket từ
     * sourceASlotId/sourceBSlotId links.
     */
    @Get('phases/{phaseId}/knockout/bracket')
    async getBracket(
        @Path() phaseId: number,
    ): Promise<BracketSlotNode[]> {
        return this.service.getBracket(phaseId);
    }
}