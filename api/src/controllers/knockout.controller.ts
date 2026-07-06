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
     * Route đổi: /phases/{phaseId}/knockout/generate -> /seasons/{seasonId}/knockout/generate.
     * phaseId KHÔNG còn là input — nó là OUTPUT (service get-or-create Phase,
     * type derive từ bracket size qua BRACKET_SIZE_TO_PHASE_TYPE).
     *
     * Idempotency: CONFLICT tự nhiên ở service (existingCount > 0 trên
     * bracket_slots của phase vừa get-or-create) nếu gọi generate 2 lần
     * cho cùng season+phaseType.
     */
    @Security('jwt', ['admin'])
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
    @Get('phases/{phaseId}/knockout/bracket')
    async getBracket(
        @Path() phaseId: number,
    ): Promise<BracketSlotNode[]> {
        return this.service.getBracket(phaseId);
    }
}