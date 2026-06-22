import { KNOCKOUT_PHASE_TYPES } from "../dtos/knockout.schema.js";
import { PhaseType, Prisma } from "../generated/prisma/client.js";

export interface KnockoutGenerateOptions {
    phaseId: number;
    seasonId: number;
    /** Ordered list of seeded teams: index 0 = seed 1, etc.
     *  Must be power-of-2 or will be padded with byes. */
    seededTeamIds: number[];
    venueIds: number[];
    matchTimes: string[]; // "HH:mm" VN time
    /** From Phase.legs — 1 or 2 */
    legs: 1 | 2;
}

export interface KnockoutGenerateResult {
    totalSlots: number;
    round1Matches: number;  // matches created immediately
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

export const KNOCKOUT_PHASE_TYPE_SET = new Set<PhaseType>(KNOCKOUT_PHASE_TYPES);

export type SlotLinkUpdate = {
    id: number;
    source_a_slot_id: number | null;
    source_b_slot_id: number | null
};

export const seededTeamsSelect = {
    seeded_home_team_id: true,
    seeded_away_team_id: true,
} satisfies Prisma.BracketSlotSelect;

export const slotLinksSelect = {
    source_a_slot_id: true,
    source_b_slot_id: true,
} satisfies Prisma.BracketSlotSelect;

// Dùng cho byeSlots fetch (step 5) — id + seeded teams + source links.
export const byeSlotSelect = {
    id: true,
    ...seededTeamsSelect,
    ...slotLinksSelect,
} satisfies Prisma.BracketSlotSelect;

// Dùng cho getBracket() — full projection map ra BracketSlotNode.
export const bracketSlotNodeSelect = {
    id: true,
    round: true,
    slot_number: true,
    match_id: true,
    is_bye: true,
    ...seededTeamsSelect,
    ...slotLinksSelect,
} satisfies Prisma.BracketSlotSelect;

// select thay include: propagateWinner chỉ cần .id của parent slot (fed_as_a/
// fed_as_b), không cần full BracketSlot row. select cũng an toàn hơn omit khi
// schema thêm cột mới — field mới không tự lộ ra nếu không khai báo trong select.
export const slotWithParentLinksSelect = {
    id: true,
    ...seededTeamsSelect,
    fed_as_a: { select: { id: true } },
    fed_as_b: { select: { id: true } },
} satisfies Prisma.BracketSlotSelect;

export type SlotWithParentLinks = Prisma.BracketSlotGetPayload<{
    select: typeof slotWithParentLinksSelect;
}>;