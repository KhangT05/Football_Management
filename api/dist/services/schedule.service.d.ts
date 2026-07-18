import { Match, PrismaClient } from '../generated/prisma/client.js';
import { GenerateFromGroupsOptions, GenerateOptions, GenerateResult, MatchByTeamRow, RescheduleInput, RoundSummary, ScheduleOptions, AutoScheduleFilterOptions, SeasonSchedule, MatchSlotOption, UnscheduledMatchOption } from '../types/schedule.type.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
export declare class ScheduleService extends ScheduleEngine {
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Match>>;
    findMatchesBySeason(seasonId: number, req?: QueryRequest): Promise<PaginatedResult<Match>>;
    private _attachCardCounts;
    findMatchesByTeam(seasonId: number, teamId: number, req?: QueryRequest): Promise<PaginatedResult<MatchByTeamRow>>;
    /**
     * NEW: DTO cho round-selector FE. groupIds optional — nếu truyền, chỉ
     * tính round trong phạm vi các group đó (dùng khi admin đã chọn subset
     * bảng đấu trước khi mở round selector).
     */
    getGroupStageRoundsSummary(seasonId: number, groupIds?: number[]): Promise<RoundSummary[]>;
    generateGroupsAndSchedule(seasonId: number, options: GenerateOptions): Promise<GenerateResult>;
    generateMatchesFromDrawnGroups(seasonId: number, options: GenerateFromGroupsOptions): Promise<GenerateResult>;
    /**
     * FIX: nhận thêm rounds/groupIds (AutoScheduleFilterOptions) — lọc TẬP
     * MATCH cần xếp lịch trong lần gọi này, cho phép admin chọn cùng lúc
     * nhiều round của nhiều bảng (vd vòng 1,2,3 cho 5 bảng), để lại các round
     * khác chưa xếp cho lần gọi sau — không bắt buộc xếp hết 1 lần.
     *
     * FIX: bỏ matchTimes cố định, dùng dailyStartTime/dailyEndTime/
     * bufferMinutes liên tục (xem ScheduleEngine.buildSlotPool) — buffer mặc
     * định DEFAULT_VENUE_BUFFER_MINUTES nếu không truyền.
     */
    autoScheduleMatches(seasonId: number, options: ScheduleOptions & AutoScheduleFilterOptions & {
        allowPastDate?: boolean;
    }): Promise<{
        matchesScheduled: number;
        failedMatchIds: number[];
    }>;
    /**
     * FIX (venue buffer chính xác + configurable): trước đây window check
     * dùng `±ASSUMED_MATCH_DURATION_MS` đối xứng quanh scheduledAt — không
     * phải overlap thật theo [start, start+duration], và không có khái niệm
     * buffer riêng giữa 2 trận. Giờ tính đúng overlap [newStart,newEnd] so
     * với [existingStart,existingEnd] rồi mở rộng thêm bufferMs mỗi phía.
     */
    rescheduleMatch(matchId: number, input: RescheduleInput): Promise<void>;
    getSeasonSchedule(seasonId: number): Promise<SeasonSchedule>;
    findUnscheduledMatchesInRound(seasonId: number, groupId: number, round: number): Promise<UnscheduledMatchOption[]>;
    getAvailableSlotsForMatch(seasonId: number, matchId: number, options: ScheduleOptions & {
        limit?: number;
    }): Promise<MatchSlotOption[]>;
    getScheduleDefaults(seasonId: number): Promise<{
        venueIds: number[];
        dailyStartTime: string | null;
        dailyEndTime: string | null;
        bufferMinutes: number | null;
    } | null>;
    saveScheduleDefaults(seasonId: number, input: {
        venueIds: number[];
        dailyStartTime: string;
        dailyEndTime: string;
        bufferMinutes?: number;
    }): Promise<void>;
    private resolveGroupCount;
    private assignTeamsToGroups;
    private generateRoundRobin;
    private rotate;
}
//# sourceMappingURL=schedule.service.d.ts.map