import { MatchStatus, PhaseType, Prisma } from "../generated/prisma/client.js";
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
    match: {
        select: {
            status: true;
        };
    };
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
//# sourceMappingURL=knockout.type.d.ts.map