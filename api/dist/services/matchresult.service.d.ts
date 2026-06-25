import { Prisma, PrismaClient } from '../generated/prisma/client.js';
import { ConfirmResultInput, ConfirmResultOutput } from '../types/matchResult.type.js';
import { ScheduleOptions } from '../types/schedule.type.js';
import { KnockoutService } from './knockout.service.js';
import { StandingsService } from './standing.service.js';
import { EditScoreInput } from './match.service.js';
export declare function toMatchResultUpdateOnUphold(note?: string): Prisma.MatchResultUpdateInput;
export declare function toMatchResultUpdateOnOverturn(newHomeScore: number, newAwayScore: number, newWinnerTeamId: number | null, note?: string): Prisma.MatchResultUpdateInput;
export declare function toMatchUpdateOnOverturn(newHomeScore: number, newAwayScore: number): Prisma.MatchUpdateInput;
export declare class MatchResultService {
    private readonly prisma;
    private readonly knockoutService;
    private readonly standingsService;
    constructor(prisma: PrismaClient, knockoutService: KnockoutService, standingsService: StandingsService);
    confirmResult(matchId: number, input: ConfirmResultInput, scheduleOptions: ScheduleOptions): Promise<ConfirmResultOutput>;
    overrideResult(matchId: number, input: EditScoreInput, scheduleOptions: ScheduleOptions): Promise<void>;
    recomputePlayerStats(matchId: number, _scheduleOptions: ScheduleOptions): Promise<void>;
    private _recomputeStatsForPlayers;
    recomputeStandingsFor(groupId: number): Promise<void>;
    private _guardConfirm;
    private _resolveWinner;
    private _updatePlayerStatistics;
    private _tryRecomputeStandings;
}
//# sourceMappingURL=matchresult.service.d.ts.map