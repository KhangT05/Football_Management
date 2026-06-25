import { PrismaClient } from '../generated/prisma/client.js';
import { AdvanceWinnerInput, BracketSlotNode, KnockoutGenerateOptions, KnockoutGenerateResult } from '../types/knockout.type.js';
import { ScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
export declare class KnockoutService extends ScheduleEngine {
    constructor(prisma: PrismaClient);
    generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult>;
    advanceWinner(phaseId: number, seasonId: number, input: AdvanceWinnerInput, scheduleOptions: ScheduleOptions): Promise<{
        matchCreated: boolean;
        newMatchId?: number;
    }>;
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
    private propagateWinner;
    private createRound1Matches;
    private scheduleMatchBatch;
    private buildAllSlotCreateData;
    private bulkLinkSlots;
    private nextPowerOf2;
    private buildRound1Pairings;
}
//# sourceMappingURL=knockout.service.d.ts.map