import { Controller } from 'tsoa';
import { KnockoutService } from '../services/knockout.service.js';
import * as knockoutSchema from '../dtos/knockout.schema.js';
import { BracketSlotNode, KnockoutGenerateResult } from '../types/knockout.type.js';
export declare class KnockoutController extends Controller {
    private service;
    constructor(service: KnockoutService);
    /**
     * Route đổi: /phases/{phaseId}/knockout/generate -> /seasons/{seasonId}/knockout/generate.
     * phaseId KHÔNG còn là input — nó là OUTPUT (service get-or-create Phase,
     * type derive từ bracket size qua BRACKET_SIZE_TO_PHASE_TYPE). Giữ phaseId
     * làm path param ở đây là tự mâu thuẫn: client phải có phaseId để tạo
     * phase, nhưng phase chưa tồn tại tới khi generate chạy xong.
     *
     * Idempotency: không cần idempotency key riêng — CONFLICT tự nhiên xảy ra
     * ở service (existingCount > 0 trên bracket_slots của phase vừa
     * get-or-create) nếu gọi generate 2 lần cho cùng season+phaseType.
     */
    generateKnockoutBracket(seasonId: number, body: knockoutSchema.GenerateKnockoutRequestDto): Promise<KnockoutGenerateResult>;
    advanceWinner(seasonId: number, phaseId: number, body: knockoutSchema.AdvanceWinnerRequestDto): Promise<{
        matchCreated: boolean;
        newMatchId?: number;
    }>;
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
}
//# sourceMappingURL=knockout.controller.d.ts.map