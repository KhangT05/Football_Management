import {
    Controller,
    Get,
    Path,
    Tags,
    Route,
    Post,
    Body,
    Security,
    Query,
} from "tsoa";

import { MatchResultService } from "../services/matchresult.service.js";
import { StandingsService } from "../services/standing.service.js";
import { KnockoutService } from "../services/knockout.service.js";

import * as matchResultType from "../types/matchResult.type.js";
import { buildMatchEventsQueryRequest, buildPlayerStatsQueryRequest, buildStandingsQueryRequest } from "../helper/match.helper.js";

@Route("matches")
@Tags("Match Result")
export class MatchResultController extends Controller {
    constructor(
        private readonly matchResultService: MatchResultService,
    ) {
        super();
    }

    @Get("{id}/result")
    async getMatchResult(@Path() id: number) {
        const result = await this.matchResultService.getMatchResult(id);
        return result;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GET — MATCH EVENTS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * List events của 1 trận.
     * 
     * Query params:
     *   Simple filters: ?type=goal&period=first_half
     *   Pagination: ?page=1&per_page=30
     *   Sort: ?sort=minute&direction=asc
     *   Search: ?q=keyword (if searchFields enabled)
     */
    @Get("{id}/events")
    async getMatchEvents(
        @Path() id: number,
        @Query() type?: string,
        @Query() period?: string,
        @Query() page?: number,
        @Query() per_page?: number,
        @Query() sort?: string,
        @Query() direction?: 'asc' | 'desc',
        @Query() q?: string,
    ) {
        // Build QueryRequest từ parsed query params
        const req = buildMatchEventsQueryRequest({
            type,
            period,
            page,
            per_page,
            sort,
            direction,
            q,
        });

        // Service gọi queryable.run(req)
        const result = await this.matchResultService.listMatchEvents(id, req);
        return result;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GET — MATCH PLAYER STATS (public, không pagination)
    // ═══════════════════════════════════════════════════════════════════════════

    @Get("{id}/result/stats")
    async getMatchPlayerStats(@Path() id: number) {
        const stats = await this.matchResultService.getMatchPlayerStats(id);
        return stats;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // POST — CONFIRM RESULT (require auth)
    // ═══════════════════════════════════════════════════════════════════════════

    @Security("jwt")
    @Post("{id}/result/confirm")
    async confirmResult(
        @Path() id: number,
        @Body() body: matchResultType.ConfirmOfficialBody,
    ) {
        const result = await this.matchResultService.confirmResult(
            id,
            body.input,
            body.scheduleOptions,
        );

        this.setStatus(201);
        return result;
    }

    @Get("{id}/report")
    async getMatchReport(@Path() id: number) {
        return this.matchResultService.getMatchReport(id);
    }
}