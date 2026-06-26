import { Controller } from 'tsoa';
import { KnockoutService } from '../services/knockout.service.js';
import * as knockoutSchema from '../dtos/knockout.schema.js';
import { BracketSlotNode, KnockoutGenerateResult } from '../types/knockout.type.js';
export declare class KnockoutController extends Controller {
    private service;
    constructor(service: KnockoutService);
    /**
        * GET /phases/{phaseId}/bracket
        */
    /**
     * phaseId/seasonId lấy từ path, KHÔNG bắt client gửi lại trong body —
     * tránh conflict (path=5, body=7 thì theo cái nào?). Merge vào object
     * rồi validate lại bằng full schema gốc (knockoutGenerateOptionsSchema)
     * làm invariant check cuối, body schema con chỉ là contract cho OpenAPI.
     */
    generateKnockoutBracket(seasonId: number, phaseId: number, body: knockoutSchema.GenerateKnockoutRequestDto): Promise<KnockoutGenerateResult>;
    /**
     * Action-style mutation (không idempotent, không phải partial update của
     * resource) → POST giống autoSchedule, không dùng PATCH như rescheduleMatch.
     * venueIds/matchTimes trong body là ScheduleOptions cho match round sau
     * vừa được tạo ra (nếu advance làm xong 1 cặp slot).
     */
    advanceWinner(seasonId: number, phaseId: number, body: knockoutSchema.AdvanceWinnerRequestDto): Promise<{
        matchCreated: boolean;
        newMatchId?: number;
    }>;
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
}
//# sourceMappingURL=knockout.controller.d.ts.map