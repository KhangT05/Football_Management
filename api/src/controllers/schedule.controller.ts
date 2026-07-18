import {
    Controller, Route, Tags, Post, Patch, Get,
    Path, Body, Query, Security, SuccessResponse,
} from 'tsoa';
import { ScheduleService } from '../services/schedule.service.js';
import * as scheduleSchema from '../dtos/schedule.schema.js';
import { GenerateResult, MatchByTeamRow, MatchSlotOption, RoundSummary, UnscheduledMatchOption } from '../types/schedule.type.js';
import { rescheduleMatchSchema } from '../dtos/schedule.schema.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { Match } from '../generated/prisma/client.js';

@Route('schedules')
@Tags('Schedules')
export class ScheduleController extends Controller {
    constructor(private service: ScheduleService) {
        super();
    }

    @Security('jwt', ['organizing'])
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
    // NEW: round-selector cho GenerateScheduleModal — cho biết mỗi round
    // group_stage còn bao nhiêu match chưa xếp lịch. groupIds query param
    // (CSV) optional — nếu admin đã chọn subset bảng đấu trước khi mở
    // round selector, chỉ tính round trong phạm vi đó.
    @Security('jwt', ['organizing'])
    @Get('seasons/{seasonId}/rounds-summary')
    async getRoundsSummary(
        @Path() seasonId: number,
        @Query() groupIds?: string,
    ): Promise<RoundSummary[]> {
        const parsedGroupIds = groupIds
            ? groupIds.split(',').map(Number).filter(n => !Number.isNaN(n))
            : undefined;
        return this.service.getGroupStageRoundsSummary(seasonId, parsedGroupIds);
    }
    /**
     * NEW: Sinh lịch thi đấu cho season ĐÃ có bảng đấu + đã bốc thăm qua
     * GroupService (POST /groups/bulk, POST /groups/{seasonId}/draw hoặc
     * /draw-seeded). KHÔNG tạo lại bảng, KHÔNG tự chia đội — chỉ sinh match
     * round-robin cho các group hiện có rồi xếp giờ/sân.
     *
     * Dùng endpoint này thay vì /generate khi season.phases.length > 0
     * (endpoint /generate sẽ throw CONFLICT trong trường hợp đó).
     */
    @Security('jwt', ['organizing'])
    @Post('seasons/{seasonId}/generate-from-groups')
    @SuccessResponse(201, 'Created')
    async generateFromGroups(
        @Path() seasonId: number,
        @Body() body: scheduleSchema.GenerateFromGroupsDto,
    ): Promise<GenerateResult> {
        const parsed = scheduleSchema.generateFromGroupsSchema.parse(body);
        this.setStatus(201);
        return this.service.generateMatchesFromDrawnGroups(seasonId, parsed);
    }

    @Security('jwt', ['organizing'])
    @Post('seasons/{seasonId}/schedule')
    async autoSchedule(
        @Path() seasonId: number,
        @Body() body: scheduleSchema.AutoScheduleDto,
    ): Promise<{ matchesScheduled: number; failedMatchIds: number[] }> {
        const parsed = scheduleSchema.autoScheduleSchema.parse(body);
        return this.service.autoScheduleMatches(seasonId, parsed);
    }

    @Security('jwt', ['organizing'])
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
    // schedule.controller.ts
    @Get('seasons/{seasonId}/schedule')
    async getSchedule(
        @Path() seasonId: number,
        @Query() page = 1,
        @Query() per_page = 20,
        @Query() sort?: string,
        @Query() direction?: 'asc' | 'desc',
    ): Promise<PaginatedResult<Match>> {
        return this.service.findMatchesBySeason(seasonId, { page, per_page, sort, direction });
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
    @Security('jwt', ['organizing'])
    @Get('seasons/{seasonId}/groups/{groupId}/rounds/{round}/unscheduled-matches')
    async getUnscheduledMatchesInRound(
        @Path() seasonId: number,
        @Path() groupId: number,
        @Path() round: number,
    ): Promise<UnscheduledMatchOption[]> {
        return this.service.findUnscheduledMatchesInRound(seasonId, groupId, round);
    }

    @Security('jwt', ['organizing'])
    @Post('seasons/{seasonId}/matches/{matchId}/available-slots')
    async getAvailableSlotsForMatch(
        @Path() seasonId: number,
        @Path() matchId: number,
        @Body() body: scheduleSchema.GetAvailableSlotsDto,
    ): Promise<MatchSlotOption[]> {
        const parsed = scheduleSchema.getAvailableSlotsSchema.parse(body);
        return this.service.getAvailableSlotsForMatch(seasonId, matchId, parsed);
    }
    @Security('jwt', ['organizing'])
    @Get('seasons/{seasonId}/defaults')
    async getScheduleDefaults(@Path() seasonId: number) {
        return this.service.getScheduleDefaults(seasonId);
    }

    @Security('jwt', ['organizing'])
    @Patch('seasons/{seasonId}/defaults')
    @SuccessResponse(204, 'No Content')
    async saveScheduleDefaults(
        @Path() seasonId: number,
        @Body() body: scheduleSchema.SeasonScheduleDefaultsDto,
    ): Promise<void> {
        const parsed = scheduleSchema.seasonScheduleDefaultsSchema.parse(body);
        await this.service.saveScheduleDefaults(seasonId, parsed);
        this.setStatus(204);
    }
}