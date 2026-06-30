import { Match, PrismaClient } from '../generated/prisma/client.js';
import { GenerateOptions, GenerateResult, MatchByTeamRow, RescheduleInput, ScheduleOptions, SeasonSchedule } from '../types/schedule.type.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
export declare class ScheduleService extends ScheduleEngine {
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Match>>;
    findMatchesByTeam(seasonId: number, teamId: number, req?: QueryRequest): Promise<PaginatedResult<MatchByTeamRow>>;
    generateGroupsAndSchedule(seasonId: number, options: GenerateOptions): Promise<GenerateResult>;
    autoScheduleMatches(seasonId: number, options: ScheduleOptions & {
        allowPastDate?: boolean;
    }): Promise<{
        matchesScheduled: number;
        failedMatchIds: number[];
    }>;
    private runGreedyPass;
    private orderByMostConstrained;
    private isRestDaysSatisfied;
    rescheduleMatch(matchId: number, input: RescheduleInput): Promise<void>;
    getSeasonSchedule(seasonId: number): Promise<SeasonSchedule>;
    private resolveGroupCount;
    private assignTeamsToGroups;
    private generateRoundRobin;
    private rotate;
}
//# sourceMappingURL=schedule.service.d.ts.map