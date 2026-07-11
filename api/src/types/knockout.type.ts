import { MatchStatus, PhaseType, Prisma } from "../generated/prisma/client.js";
import { KNOCKOUT_PHASE_TYPES } from "../dtos/knockout.schema.js";

// ─── SEED RESOLUTION ────────────────────────────────────────────────────────
// 'standing': lấy team theo hạng trong bảng — nguồn thật là group_stage kết quả.
// 'manual': chọn tay — dùng cho wildcard hoặc season không có group stage.
// Union thay vì optional fields riêng lẻ để loại trừ trạng thái vô nghĩa
// (vd groupId có mà rank null) ngay ở compile time.
export type SeedSource =
    | { kind: 'standing'; groupId: number; rank: number }
    | { kind: 'manual'; teamId: number };

// Map bracket size -> PhaseType. third_place CỐ TÌNH không có trong map này —
// xem giải thích ở knockout.schema.ts. Nếu bracketSize không khớp key nào
// (vd 3, 5, 6 team sau khi pad power-of-2 vẫn lệch) throw ngay, không đoán.
export const BRACKET_SIZE_TO_PHASE_TYPE: Partial<Record<number, PhaseType>> = {
    2: PhaseType.final,
    4: PhaseType.semi_final,
    8: PhaseType.quarter_final,
    16: PhaseType.round_of_16,
};

export interface KnockoutGenerateOptions {
    seasonId: number;
    seeds: SeedSource[];
    legs: 1 | 2;
    phaseTypeOverride?: PhaseType;
    venueIds?: number[];
    matchTimes?: string[];
    dateRangeStart?: Date;
    dateRangeEnd?: Date;
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
export type BracketSlotSide = 'home' | 'away';
export interface SwapSeedsInput {
    slotIdA: number;
    sideA: BracketSlotSide;
    slotIdB: number;
    sideB: BracketSlotSide;
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
    matchStatus: MatchStatus | null;
}

export const KNOCKOUT_PHASE_TYPE_SET = new Set<PhaseType>(KNOCKOUT_PHASE_TYPES);

export type SlotLinkUpdate = {
    id: number;
    source_a_slot_id: number | null;
    source_b_slot_id: number | null;
};

export const seededTeamsSelect = {
    seeded_home_team_id: true,
    seeded_away_team_id: true,
} satisfies Prisma.BracketSlotSelect;

export const slotLinksSelect = {
    source_a_slot_id: true,
    source_b_slot_id: true,
} satisfies Prisma.BracketSlotSelect;

export const byeSlotSelect = {
    id: true,
    ...seededTeamsSelect,
    ...slotLinksSelect,
} satisfies Prisma.BracketSlotSelect;

export const bracketSlotNodeSelect = {
    id: true,
    round: true,
    slot_number: true,
    match_id: true,
    is_bye: true,
    ...seededTeamsSelect,
    ...slotLinksSelect,
    match: { select: { status: true } },
} satisfies Prisma.BracketSlotSelect;

export const slotWithParentLinksSelect = {
    id: true,
    ...seededTeamsSelect,
    fed_as_a: { select: { id: true } },
    fed_as_b: { select: { id: true } },
} satisfies Prisma.BracketSlotSelect;

export type SlotWithParentLinks = Prisma.BracketSlotGetPayload<{
    select: typeof slotWithParentLinksSelect;
}>;

export type KnockoutSeedMode = 'straight' | 'cross' | 'random';

export interface AutoSeedKnockoutOptions {
    seasonId: number;
    /** Group tham gia knockout — thứ tự mảng quyết định cách ghép (straight/
     *  cross ghép theo cặp group LIÊN TIẾP: [0]&[1], [2]&[3], ...). Mode
     *  'random' không yêu cầu thứ tự hay số lượng chẵn. */
    groupIds: number[];
    /** Lấy top N đội mỗi group theo TeamStanding.position. */
    topN: number;
    mode: KnockoutSeedMode;
    legs: 1 | 2;
    phaseTypeOverride?: PhaseType;
    venueIds?: number[];
    matchTimes?: string[];
    dateRangeStart?: Date;
    dateRangeEnd?: Date;
}