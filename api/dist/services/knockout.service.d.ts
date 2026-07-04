import { PrismaClient } from '../generated/prisma/client.js';
import { AdvanceWinnerInput, BracketSlotNode, KnockoutGenerateOptions, KnockoutGenerateResult } from '../types/knockout.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
export declare class KnockoutService extends ScheduleEngine {
    constructor(prisma: PrismaClient);
    generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult>;
    advanceWinner(phaseId: number, seasonId: number, input: AdvanceWinnerInput, scheduleOptions: OptionalScheduleOptions): Promise<{
        matchCreated: boolean;
        newMatchId?: number;
    }>;
    /**
     * Tính winner theo aggregate 2 lượt. Away-goals KHÔNG áp dụng (assumption —
     * đổi lại nếu giải dùng luật cũ). Nếu aggregate hoà, winner quyết bằng
     * penalty của leg 2 (rule chuẩn: ET/pen chỉ đá ở lượt về khi cần) — nếu leg 2
     * không có penalty score, fail loud thay vì đoán.
     */
    private _computeAggregateWinner;
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
    private propagateWinner;
    private createRound1Matches;
    /**
     * FIX: trước đây không query season — startDate = new Date() và rangeEnd
     * luôn hardcode +6 tháng, bỏ qua hoàn toàn season.end_date. Match knockout
     * có thể bị xếp lịch sau khi season đã đóng. Giờ end_date là hard boundary
     * bắt buộc (throw nếu thiếu), startDate = max(now, season.start_date) vì
     * knockout luôn diễn ra sau group stage.
     */
    private scheduleMatchBatch;
    private buildAllSlotCreateData;
    private bulkLinkSlots;
}
//# sourceMappingURL=knockout.service.d.ts.map