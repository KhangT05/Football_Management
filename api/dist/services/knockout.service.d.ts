import { PrismaClient } from '../generated/prisma/client.js';
import { AdvanceWinnerInput, BracketSlotNode, KnockoutGenerateOptions, KnockoutGenerateResult } from '../types/knockout.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
import { StandingsService } from './standing.service.js';
export declare class KnockoutService extends ScheduleEngine {
    private readonly standingsService;
    constructor(prisma: PrismaClient, standingsService: StandingsService);
    /**
     * Get-or-create knockout Phase theo (season, phaseType) — FE không còn
     * gửi phaseId, vì phaseId là OUTPUT của generate, không phải input.
     * Lock season trước để tránh race 2 request generate cùng lúc tạo trùng
     * phase (giống invariant của GroupService.getOrCreateRoundRobinPhase).
     */
    private getOrCreateKnockoutPhase;
    private phaseNameFor;
    /**
     * Resolve SeedSource[] -> teamId[], GIỮ NGUYÊN thứ tự input (thứ tự này
     * quyết định seed 1 gặp seed cuối cùng qua buildRound1Pairings — không
     * được sort lại hay dùng Map iteration order thay thế).
     *
     * Trust-boundary: đọc TeamStanding.position đã persist là KHÔNG đủ an
     * toàn — recomputeGroupStandings vốn "eventually consistent" theo
     * comment gốc trong StandingsService (chạy sau khi match transaction
     * commit, có thể pending/fail). Recompute lại NGAY TRONG transaction
     * này trước khi đọc để loại race giữa "trận cuối vừa confirm" và
     * "admin bấm generate knockout".
     */
    private resolveSeeds;
    generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult>;
    advanceWinner(phaseId: number, seasonId: number, input: AdvanceWinnerInput, scheduleOptions: OptionalScheduleOptions): Promise<{
        matchCreated: boolean;
        newMatchId?: number;
    }>;
    /**
     * Tính winner theo aggregate 2 lượt. Away-goals KHÔNG áp dụng (assumption
     * — đổi lại nếu giải dùng luật cũ). Nếu aggregate hoà, winner quyết bằng
     * penalty của leg 2 — nếu leg 2 không có penalty score, fail loud thay
     * vì đoán.
     */
    private _computeAggregateWinner;
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
    private propagateWinner;
    private createRound1Matches;
    private scheduleMatchBatch;
    private buildAllSlotCreateData;
    private bulkLinkSlots;
}
//# sourceMappingURL=knockout.service.d.ts.map