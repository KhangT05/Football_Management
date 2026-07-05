import { PhaseType, Prisma } from "../generated/prisma/client.js";
export type SeedSource = {
    kind: 'standing';
    groupId: number;
    rank: number;
} | {
    kind: 'manual';
    teamId: number;
};
export declare const BRACKET_SIZE_TO_PHASE_TYPE: Partial<Record<number, PhaseType>>;
export interface KnockoutGenerateOptions {
    seasonId: number;
    /** Ordered: index 0 = seed 1. Resolve sang teamId xảy ra TRONG transaction
     *  của generateKnockoutBracket — không nhận teamId list tĩnh từ FE nữa,
     *  vì standings có thể vừa đổi ngay trước lúc admin bấm generate. */
    seeds: SeedSource[];
    venueIds: number[];
    matchTimes: string[];
    /** From Phase.legs — 1 or 2 */
    legs: 1 | 2;
    /** Bắt buộc phải set nếu bracket size không map được qua
     *  BRACKET_SIZE_TO_PHASE_TYPE (hiện tại: không case nào cần, third_place
     *  không đi qua flow này). Giữ lại cho tương lai, KHÔNG dùng để bypass
     *  validation bracket size. */
    phaseTypeOverride?: PhaseType;
}
export interface KnockoutGenerateResult {
    /** Phase vừa được get-or-create — caller cần ID này cho các call sau
     *  (GET bracket, POST advance) vì generate không còn nhận phaseId nữa. */
    phaseId: number;
    phaseType: PhaseType;
    totalSlots: number;
    round1Matches: number;
    byeSlots: number;
    warnings: string[];
}
export interface AdvanceWinnerInput {
    matchId: number;
    winnerTeamId: number;
}
export interface BracketSlotNode {
    slotId: number;
    round: number;
    slotNumber: number;
    matchId: number | null;
    isBye: boolean;
    seededHomeTeamId: number | null;
    seededAwayTeamId: number | null;
    sourceASlotId: number | null;
    sourceBSlotId: number | null;
}
export declare const KNOCKOUT_PHASE_TYPE_SET: Set<PhaseType>;
export type SlotLinkUpdate = {
    id: number;
    source_a_slot_id: number | null;
    source_b_slot_id: number | null;
};
export declare const seededTeamsSelect: {
    seeded_home_team_id: true;
    seeded_away_team_id: true;
};
export declare const slotLinksSelect: {
    source_a_slot_id: true;
    source_b_slot_id: true;
};
export declare const byeSlotSelect: {
    source_a_slot_id: true;
    source_b_slot_id: true;
    seeded_home_team_id: true;
    seeded_away_team_id: true;
    id: true;
};
export declare const bracketSlotNodeSelect: {
    source_a_slot_id: true;
    source_b_slot_id: true;
    seeded_home_team_id: true;
    seeded_away_team_id: true;
    id: true;
    round: true;
    slot_number: true;
    match_id: true;
    is_bye: true;
};
export declare const slotWithParentLinksSelect: {
    fed_as_a: {
        select: {
            id: true;
        };
    };
    fed_as_b: {
        select: {
            id: true;
        };
    };
    seeded_home_team_id: true;
    seeded_away_team_id: true;
    id: true;
};
export type SlotWithParentLinks = Prisma.BracketSlotGetPayload<{
    select: typeof slotWithParentLinksSelect;
}>;
//# sourceMappingURL=knockout.type.d.ts.map