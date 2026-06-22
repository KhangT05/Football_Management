import { PhaseType, Prisma } from "../generated/prisma/client.js";
export interface KnockoutGenerateOptions {
    phaseId: number;
    seasonId: number;
    /** Ordered list of seeded teams: index 0 = seed 1, etc.
     *  Must be power-of-2 or will be padded with byes. */
    seededTeamIds: number[];
    venueIds: number[];
    matchTimes: string[];
    /** From Phase.legs — 1 or 2 */
    legs: 1 | 2;
}
export interface KnockoutGenerateResult {
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