import { PrismaClient } from '../generated/prisma/client.js';
import { AdvanceWinnerInput, BracketSlotNode, KnockoutGenerateOptions, KnockoutGenerateResult } from '../types/knockout.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
import { StandingsService } from './standing.service.js';
export declare class KnockoutService extends ScheduleEngine {
    private readonly standingsService;
    constructor(prisma: PrismaClient, standingsService: StandingsService);
    private getOrCreateKnockoutPhase;
    private phaseNameFor;
    private ensureSeasonOngoing;
    private resolveSeeds;
    generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult>;
    advanceWinner(phaseId: number, seasonId: number, input: AdvanceWinnerInput, scheduleOptions: OptionalScheduleOptions): Promise<{
        matchCreated: boolean;
        newMatchId?: number;
        scheduleWarning?: string;
    }>;
    private _computeAggregateWinner;
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
    private propagateWinner;
    private createRound1Matches;
    private scheduleMatchBatch;
    private buildAllSlotCreateData;
    private bulkLinkSlots;
}
//# sourceMappingURL=knockout.service.d.ts.map