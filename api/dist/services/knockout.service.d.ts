import { PrismaClient } from '../generated/prisma/client.js';
import { AdvanceWinnerInput, BracketSlotNode, KnockoutGenerateOptions, KnockoutGenerateResult, AutoSeedKnockoutOptions } from '../types/knockout.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
import { StandingsService } from './standing.service.js';
export declare class KnockoutService extends ScheduleEngine {
    private readonly standingsService;
    constructor(prisma: PrismaClient, standingsService: StandingsService);
    private getOrCreateKnockoutPhase;
    private phaseNameFor;
    private ensureSeasonOngoing;
    /**
     * Guard dùng chung cho cả resolveSeeds (manual seed theo rank) và
     * generateKnockoutFromStandings (auto-seed theo topN): group phải hết
     * match pending, và standings phải được recompute mới nhất trước khi
     * đọc position.
     */
    private _ensureGroupsReadyAndRecompute;
    private resolveSeeds;
    generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult>;
    /**
     * Tự chọn top-N mỗi group theo TeamStanding.position rồi ghép cặp round 1
     * theo `mode`, không cần nhập tay từng SeedSource:
     * - 'straight': top-k group[i] đấu top-k group[i+1] (ghép cặp group liên
     *   tiếp trong mảng groupIds) — vd top1 A vs top1 B, top2 A vs top2 B.
     * - 'cross': top-k group[i] đấu top-(N+1-k) group[i+1] — vd top1 A vs
     *   top2 B, top2 A vs top1 B.
     * - 'random': random toàn bộ pool top-N của mọi group, đảm bảo không có
     *   cặp nào cùng group (round-robin interleave, không cần retry/backtrack).
     *
     * Tổng số đội (groupIds.length × topN) BẮT BUỘC là lũy thừa của 2 — đây
     * là ràng buộc cấu trúc bracket single-elimination, không né được.
     */
    generateKnockoutFromStandings(options: AutoSeedKnockoutOptions): Promise<KnockoutGenerateResult>;
    private _buildStraightPairs;
    private _buildCrossPairs;
    /**
     * Random nhưng không trùng group bằng round-robin interleave thay vì
     * shuffle-rồi-thử-lại: xáo trong từng group trước, rồi trải đều theo
     * chu kỳ group1,group2,...,groupG lặp topN lần. Với mọi group có ĐÚNG
     * topN phần tử, 2 phần tử liên tiếp trong chuỗi trải đều luôn khác group
     * (groupIds.length >= 2 đã được validate ở entrypoint). Ghép cặp
     * (index 2k, 2k+1) của chuỗi đã trải đều.
     */
    private _buildRandomPairs;
    private _finalizeWithSchedule;
    /**
     * Refactor chung từ generateKnockoutBracket cũ: mọi logic tạo
     * phase/slot/link/round1-match/bye-propagation/stranded-match giờ nhận
     * thẳng `round1Pairings` đã build sẵn — dùng chung cho cả manual-seed
     * (buildRound1Pairings từ SeedSource, có thể có bye) và auto-seed từ
     * standings (luôn đủ cặp, byeCount = 0). is_bye tự suy ra từ pairing
     * có null hay không, không cần tham số byeCount riêng.
     */
    private _buildBracketInPhase;
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