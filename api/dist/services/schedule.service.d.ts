import { Match, PrismaClient } from '../generated/prisma/client.js';
import { GenerateOptions, GenerateResult, MatchByTeamRow, RescheduleInput, ScheduleOptions, SeasonSchedule } from '../types/schedule.type.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
export declare class ScheduleService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Match>>;
    findMatchesByTeam(seasonId: number, teamId: number, req?: QueryRequest): Promise<PaginatedResult<MatchByTeamRow>>;
    generateGroupsAndSchedule(seasonId: number, options: GenerateOptions): Promise<GenerateResult>;
    autoScheduleMatches(seasonId: number, options: ScheduleOptions): Promise<{
        matchesScheduled: number;
        failedMatchIds: number[];
    }>;
    rescheduleMatch(matchId: number, input: RescheduleInput): Promise<void>;
    getSeasonSchedule(seasonId: number): Promise<SeasonSchedule>;
    private loadTakenSlots;
    private writeScheduleBatch;
    private buildSlotPool;
    private findEarliestValidSlot;
    private resolveGroupCount;
    private assignTeamsToGroups;
    private generateRoundRobin;
    private vnTimeToUtc;
    private rotate;
}
//# sourceMappingURL=schedule.service.d.ts.map