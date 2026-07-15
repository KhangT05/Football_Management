import {
    Controller, Route, Tags, Post, Get,
    Path, Body, Security, SuccessResponse,
    Query,
} from 'tsoa';
import { KnockoutService } from '../services/knockout.service.js';
import * as knockoutSchema from '../dtos/knockout.schema.js';
import { BracketSlotNode, KnockoutGenerateResult } from '../types/knockout.type.js';
import { RoundSummary } from '../types/schedule.type.js';

@Route('')
@Tags('Knockout')
export class KnockoutController extends Controller {
    constructor(private service: KnockoutService) {
        super();
    }

    /**
     * Route đổi: /phases/{phaseId}/knockout/generate -> /seasons/{seasonId}/knockout/generate.
     * phaseId KHÔNG còn là input — nó là OUTPUT (service get-or-create Phase,
     * type derive từ bracket size qua BRACKET_SIZE_TO_PHASE_TYPE).
     *
     * Idempotency: CONFLICT tự nhiên ở service (existingCount > 0 trên
     * bracket_slots của phase vừa get-or-create) nếu gọi generate 2 lần
     * cho cùng season+phaseType.
     */
    @Security('jwt', ['organizing'])
    @Post('seasons/{seasonId}/knockout/generate')
    @SuccessResponse(201, 'Created')
    async generateKnockoutBracket(
        @Path() seasonId: number,
        @Body() body: knockoutSchema.GenerateKnockoutRequestDto,
    ): Promise<KnockoutGenerateResult> {
        const parsed = knockoutSchema.knockoutGenerateOptionsSchema.parse({
            ...body,
            seasonId,
        });
        this.setStatus(201);
        return this.service.generateKnockoutBracket(parsed);
    }

    @Security('jwt', ['organizing'])
    @Post('seasons/{seasonId}/phases/{phaseId}/knockout/advance')
    @SuccessResponse(200, 'OK')
    async advanceWinner(
        @Path() seasonId: number,
        @Path() phaseId: number,
        @Body() body: knockoutSchema.AdvanceWinnerRequestDto,
    ): Promise<{ matchCreated: boolean; newMatchId?: number; scheduleWarning?: string }> {
        const { venueIds, dailyStartTime, dailyEndTime, bufferMinutes, dateRangeStart, dateRangeEnd, ...input } =
            knockoutSchema.advanceWinnerRequestSchema.parse(body);
        return this.service.advanceWinner(phaseId, seasonId, input, {
            venueIds, dailyStartTime, dailyEndTime, bufferMinutes, dateRangeStart, dateRangeEnd,
        });
    }

    @Get('phases/{phaseId}/knockout/bracket')
    async getBracket(
        @Path() phaseId: number,
    ): Promise<BracketSlotNode[]> {
        return this.service.getBracket(phaseId);
    }
    /**
     * Auto-seed knockout từ standing hiện tại của các group — không cần
     * nhập tay SeedSource[]. Cùng idempotency guard với generate thường:
     * CONFLICT nếu phase (get-or-create theo bracket size) đã có sẵn bracket.
     */
    @Security('jwt', ['organizing'])
    @Post('seasons/{seasonId}/knockout/generate-from-standings')
    @SuccessResponse(201, 'Created')
    async generateKnockoutFromStandings(
        @Path() seasonId: number,
        @Body() body: knockoutSchema.AutoSeedKnockoutRequestDto,
    ): Promise<KnockoutGenerateResult> {
        const parsed = knockoutSchema.autoSeedKnockoutRequestSchema.parse(body);
        this.setStatus(201);
        return this.service.generateKnockoutFromStandings({ ...parsed, seasonId });
    }
    /**
 * Đổi 2 đội giữa 2 vị trí round 1 — chỉ khi phase chưa locked và chưa
 * có trận liên quan kết thúc (chặn ở service).
 */
    @Security('jwt', ['organizing'])
    @Post('seasons/{seasonId}/phases/{phaseId}/knockout/swap-seeds')
    @SuccessResponse(204, 'No Content')
    async swapSeeds(
        @Path() seasonId: number,
        @Path() phaseId: number,
        @Body() body: knockoutSchema.SwapSeedsRequestDto,
    ): Promise<void> {
        const parsed = knockoutSchema.swapSeedsRequestSchema.parse(body);
        return this.service.swapSeeds(phaseId, parsed);
    }

    /**
     * Chốt sơ đồ (phase -> locked), không cho swap-seeds nữa.
     */
    @Security('jwt', ['organizing'])
    @Post('seasons/{seasonId}/phases/{phaseId}/knockout/confirm')
    @SuccessResponse(204, 'No Content')
    async confirmBracket(
        @Path() seasonId: number,
        @Path() phaseId: number,
    ): Promise<void> {
        return this.service.confirmBracket(phaseId);
    }
}