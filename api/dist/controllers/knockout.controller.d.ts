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
     * type derive từ bracket size qua BRACKET_SIZE_TO_PHASE_TYPE).
     *
     * Idempotency: CONFLICT tự nhiên ở service (existingCount > 0 trên
     * bracket_slots của phase vừa get-or-create) nếu gọi generate 2 lần
     * cho cùng season+phaseType.
     */
    generateKnockoutBracket(seasonId: number, body: knockoutSchema.GenerateKnockoutRequestDto): Promise<KnockoutGenerateResult>;
    advanceWinner(seasonId: number, phaseId: number, body: knockoutSchema.AdvanceWinnerRequestDto): Promise<{
        matchCreated: boolean;
        newMatchId?: number;
    }>;
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
    /**
     * Auto-seed knockout từ standing hiện tại của các group — không cần
     * nhập tay SeedSource[]. Cùng idempotency guard với generate thường:
     * CONFLICT nếu phase (get-or-create theo bracket size) đã có sẵn bracket.
     */
    generateKnockoutFromStandings(seasonId: number, body: knockoutSchema.AutoSeedKnockoutRequestDto): Promise<KnockoutGenerateResult>;
}
//# sourceMappingURL=knockout.controller.d.ts.map