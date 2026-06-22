import { PrismaClient } from '../generated/prisma/client.js';
import { AdvanceWinnerInput, BracketSlotNode, KnockoutGenerateOptions, KnockoutGenerateResult } from '../types/knockout.type.js';
import { ScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
export declare class KnockoutService extends ScheduleEngine {
    constructor(prisma: PrismaClient);
    generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult>;
    /**
     * Gọi sau khi MatchResultService đã xác định winner (aggregate 2 legs nếu cần).
     * KnockoutService không tự aggregate — nhận winnerTeamId từ caller.
     *
     * winnerTeamId: number (không nullable) — invalid state "draw trong knockout"
     * bị loại ở schema layer (advanceWinnerInputSchema), không model ở đây nữa.
     */
    advanceWinner(phaseId: number, seasonId: number, input: AdvanceWinnerInput, scheduleOptions: ScheduleOptions): Promise<{
        matchCreated: boolean;
        newMatchId?: number;
    }>;
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
    private propagateWinner;
    /**
     * Batch-create match cho round 1 (thay N sequential `tx.match.create()`).
     *
     * MySQL `createMany` không trả id → re-fetch theo composite key
     * (home_team_id:away_team_id:leg) để map ngược lại match.id. Key này
     * unique trong phạm vi round 1 vì seededTeamIds đã được validate
     * không trùng (knockout.schema.ts) — mỗi team chỉ xuất hiện ở đúng
     * 1 slot, nên mọi pairing home/away trong round 1 là duy nhất.
     *
     * Chỉ leg 1 được link vào bracket_slots.match_id (đúng hành vi gốc) —
     * leg 2 được resolve qua home/away đảo trong advanceWinner().
     */
    private createRound1Matches;
    private scheduleMatchBatch;
    /**
     * Build flat data array cho createMany — không có source links (set sau).
     * Iterate round 1 → totalRounds (không cần reverse vì links set riêng).
     *
     * Round 1 (leaf) và round>1 (internal) gộp chung 1 nhánh — khác biệt duy
     * nhất là seed data, phần còn lại (phase_id/round/slot_number/source_*)
     * giống nhau nên không cần 2 object literal lặp lại.
     */
    private buildAllSlotCreateData;
    /**
     * Bulk-update source_a/b_slot_id sau khi có IDs từ createMany.
     * 1 roundtrip thay vì N updates.
     */
    private bulkLinkSlots;
    private nextPowerOf2;
    private buildRound1Pairings;
}
//# sourceMappingURL=knockout.service.d.ts.map