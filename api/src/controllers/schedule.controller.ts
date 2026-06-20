import {
    Controller, Route, Tags, Post, Patch, Get,
    Path, Body, Query, Security, SuccessResponse,
} from 'tsoa';

import { ScheduleService } from '../services/schedule.service.js';
import * as scheduleSchema from '../dtos/schedule.schema.js';
import { GenerateResult, MatchByTeamRow } from '../types/schedule.type.js';
import { rescheduleMatchSchema } from '../dtos/schedule.schema.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { Match } from '../generated/prisma/client.js';

@Route('schedules')
@Tags('Schedules')
export class ScheduleController extends Controller {
    constructor(private service: ScheduleService) {
        super();
    }
    @Security('jwt', ['admin'])
    @Post('seasons/{seasonId}/generate')
    @SuccessResponse(201, 'Created')
    async generateSchedule(
        @Path() seasonId: number,
        @Body() body: scheduleSchema.GenerateScheduleDto,
    ): Promise<GenerateResult> {
        const parsed = scheduleSchema.generateScheduleSchema.parse(body);
        this.setStatus(201);
        return this.service.generateGroupsAndSchedule(seasonId, parsed);
    }

    @Security('jwt', ['admin'])
    @Post('seasons/{seasonId}/schedule')
    async autoSchedule(
        @Path() seasonId: number,
        @Body() body: scheduleSchema.AutoScheduleDto,
    ): Promise<{ matchesScheduled: number; failedMatchIds: number[] }> {
        const parsed = scheduleSchema.autoScheduleSchema.parse(body);
        return this.service.autoScheduleMatches(seasonId, parsed);
    }

    @Security('jwt', ['admin'])
    @Patch('matches/{matchId}/reschedule')
    @SuccessResponse(204, 'No Content')
    async rescheduleMatch(
        @Path() matchId: number,
        @Body() body: scheduleSchema.RescheduleMatchDto,
    ): Promise<void> {
        const parsed = rescheduleMatchSchema.parse(body);
        await this.service.rescheduleMatch(matchId, parsed);
        this.setStatus(204);
    }

    @Get('seasons/{seasonId}/schedule')
    async getSchedule(
        @Path() seasonId: number,
        @Query() page = 1,
        @Query() per_page = 20,
        @Query() sort?: string,
        @Query() direction?: 'asc' | 'desc',
    ): Promise<PaginatedResult<Match>> {
        return this.service.findAll({
            page, per_page, sort, direction,
            season_id: seasonId,
        } as QueryRequest);
    }

    @Get('seasons/{seasonId}/teams/{teamId}/schedule')
    async getTeamSchedule(
        @Path() seasonId: number,
        @Path() teamId: number,
        @Query() page = 1,
        @Query() per_page = 20,
        @Query() sort?: 'round' | 'scheduled_at',
        @Query() direction?: 'asc' | 'desc',
    ): Promise<PaginatedResult<MatchByTeamRow>> {
        const req: QueryRequest = { page, per_page, sort, direction };
        return this.service.findMatchesByTeam(seasonId, teamId, req);
    }
}