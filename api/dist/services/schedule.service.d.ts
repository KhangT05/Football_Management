import { Match, PrismaClient } from '../generated/prisma/client.js';
import { GenerateFromGroupsOptions, GenerateOptions, GenerateResult, MatchByTeamRow, RescheduleInput, ScheduleOptions, SeasonSchedule } from '../types/schedule.type.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
export declare class ScheduleService extends ScheduleEngine {
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Match>>;
    findMatchesByTeam(seasonId: number, teamId: number, req?: QueryRequest): Promise<PaginatedResult<MatchByTeamRow>>;
    generateGroupsAndSchedule(seasonId: number, options: GenerateOptions): Promise<GenerateResult>;
    /**
     * Sinh match round-robin cho các group ĐÃ tồn tại + đã bốc thăm qua
     * GroupService (createGroupsBulk + drawGroups/drawGroupsSeeded), rồi
     * auto-schedule giờ/sân. Dùng cho luồng: admin tạo bảng + bốc thăm trước
     * (GroupDrawUI) → sau đó bấm "Tạo lịch thi đấu" ở ScheduleTab.
     *
     * KHÁC generateGroupsAndSchedule(): method đó tự tạo Phase + Group + tự
     * chia đội (assignTeamsToGroups) và sẽ throw CONFLICT nếu season đã có
     * phase — nên không dùng được sau khi đã bốc thăm thủ công. Method này
     * ngược lại: BẮT BUỘC phải có phase + group + season_team.group_id đã
     * set sẵn, và KHÔNG tự tạo hay tự chia đội.
     */
    generateMatchesFromDrawnGroups(seasonId: number, options: GenerateFromGroupsOptions): Promise<GenerateResult>;
    autoScheduleMatches(seasonId: number, options: ScheduleOptions & {
        allowPastDate?: boolean;
    }): Promise<{
        matchesScheduled: number;
        failedMatchIds: number[];
    }>;
    rescheduleMatch(matchId: number, input: RescheduleInput): Promise<void>;
    getSeasonSchedule(seasonId: number): Promise<SeasonSchedule>;
    private resolveGroupCount;
    private assignTeamsToGroups;
    private generateRoundRobin;
    private rotate;
}
//# sourceMappingURL=schedule.service.d.ts.map