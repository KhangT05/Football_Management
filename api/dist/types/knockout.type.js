import { PhaseType } from "../generated/prisma/client.js";
import { KNOCKOUT_PHASE_TYPES } from "../dtos/knockout.schema.js";
// Map bracket size -> PhaseType. third_place CỐ TÌNH không có trong map này —
// xem giải thích ở knockout.schema.ts. Nếu bracketSize không khớp key nào
// (vd 3, 5, 6 team sau khi pad power-of-2 vẫn lệch) throw ngay, không đoán.
export const BRACKET_SIZE_TO_PHASE_TYPE = {
    2: PhaseType.final,
    4: PhaseType.semi_final,
    8: PhaseType.quarter_final,
    16: PhaseType.round_of_16,
};
export const KNOCKOUT_PHASE_TYPE_SET = new Set(KNOCKOUT_PHASE_TYPES);
export const seededTeamsSelect = {
    seeded_home_team_id: true,
    seeded_away_team_id: true,
};
export const slotLinksSelect = {
    source_a_slot_id: true,
    source_b_slot_id: true,
};
export const byeSlotSelect = {
    id: true,
    ...seededTeamsSelect,
    ...slotLinksSelect,
};
export const bracketSlotNodeSelect = {
    id: true,
    round: true,
    slot_number: true,
    match_id: true,
    is_bye: true,
    ...seededTeamsSelect,
    ...slotLinksSelect,
};
export const slotWithParentLinksSelect = {
    id: true,
    ...seededTeamsSelect,
    fed_as_a: { select: { id: true } },
    fed_as_b: { select: { id: true } },
};
//# sourceMappingURL=knockout.type.js.map