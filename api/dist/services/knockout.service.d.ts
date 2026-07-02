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
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
    /**
     * FIX (idempotency): thêm guard `parentSlot.match_id !== null` ngay sau khi
     * xác nhận cả 2 slot con đã có winner, TRƯỚC khi tạo match mới.
     *
     * Trước đây nếu propagateWinner bị gọi 2 lần cho cùng matchId (retry sau
     * timeout dù request đầu đã commit, hoặc cron grace-period chen vào) —
     * lần gọi thứ 2 vẫn set lại seeded_home/away_team_id (vô hại, giá trị
     * giống cũ), nhưng sau đó vẫn tạo THÊM 1 match mới cho round kế tiếp vì
     * code cũ không check parent slot đã có match_id chưa. Bug này trước đây
     * được "cứu" gián tiếp qua _guardConfirm ở MatchResultService — nhưng đó
     * là phòng thủ ở tầng khác, không phải invariant của chính hàm này.
     *
     * NOTE: slotWithParentLinksSelect cần đảm bảo fed_as_a/fed_as_b nested
     * select có include match_id — nếu chưa, thêm vào types/knockout.type.ts.
     */
    private propagateWinner;
    private createRound1Matches;
    private scheduleMatchBatch;
    private buildAllSlotCreateData;
    private bulkLinkSlots;
}
//# sourceMappingURL=knockout.service.d.ts.map