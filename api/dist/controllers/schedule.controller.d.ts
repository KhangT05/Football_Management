import { Controller } from 'tsoa';
import { ScheduleService } from '../services/schedule.service.js';
import * as scheduleSchema from '../dtos/schedule.schema.js';
import { GenerateResult, MatchByTeamRow, MatchSlotOption, RoundSummary, UnscheduledMatchOption } from '../types/schedule.type.js';
import { PaginatedResult } from '../types/queryable.type.js';
import { Match } from '../generated/prisma/client.js';
export declare class ScheduleController extends Controller {
    private service;
    constructor(service: ScheduleService);
    generateSchedule(seasonId: number, body: scheduleSchema.GenerateScheduleDto): Promise<GenerateResult>;
    getRoundsSummary(seasonId: number, groupIds?: string): Promise<RoundSummary[]>;
    /**
     * NEW: Sinh lịch thi đấu cho season ĐÃ có bảng đấu + đã bốc thăm qua
     * GroupService (POST /groups/bulk, POST /groups/{seasonId}/draw hoặc
     * /draw-seeded). KHÔNG tạo lại bảng, KHÔNG tự chia đội — chỉ sinh match
     * round-robin cho các group hiện có rồi xếp giờ/sân.
     *
     * Dùng endpoint này thay vì /generate khi season.phases.length > 0
     * (endpoint /generate sẽ throw CONFLICT trong trường hợp đó).
     */
    generateFromGroups(seasonId: number, body: scheduleSchema.GenerateFromGroupsDto): Promise<GenerateResult>;
    autoSchedule(seasonId: number, body: scheduleSchema.AutoScheduleDto): Promise<{
        matchesScheduled: number;
        failedMatchIds: number[];
    }>;
    rescheduleMatch(matchId: number, body: scheduleSchema.RescheduleMatchDto): Promise<void>;
    getSchedule(seasonId: number, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc'): Promise<PaginatedResult<Match>>;
    getTeamSchedule(seasonId: number, teamId: number, page?: number, per_page?: number, sort?: 'round' | 'scheduled_at', direction?: 'asc' | 'desc'): Promise<PaginatedResult<MatchByTeamRow>>;
    getUnscheduledMatchesInRound(seasonId: number, groupId: number, round: number): Promise<UnscheduledMatchOption[]>;
    getAvailableSlotsForMatch(seasonId: number, matchId: number, body: scheduleSchema.GetAvailableSlotsDto): Promise<MatchSlotOption[]>;
    getScheduleDefaults(seasonId: number): Promise<{
        venueIds: number[];
        dailyStartTime: string | null;
        dailyEndTime: string | null;
        bufferMinutes: number | null;
    } | null>;
    saveScheduleDefaults(seasonId: number, body: scheduleSchema.SeasonScheduleDefaultsDto): Promise<void>;
}
//# sourceMappingURL=schedule.controller.d.ts.map