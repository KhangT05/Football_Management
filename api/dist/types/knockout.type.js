import { KNOCKOUT_PHASE_TYPES } from "../dtos/knockout.schema.js";
export const KNOCKOUT_PHASE_TYPE_SET = new Set(KNOCKOUT_PHASE_TYPES);
export const seededTeamsSelect = {
    seeded_home_team_id: true,
    seeded_away_team_id: true,
};
export const slotLinksSelect = {
    source_a_slot_id: true,
    source_b_slot_id: true,
};
// Dùng cho byeSlots fetch (step 5) — id + seeded teams + source links.
export const byeSlotSelect = {
    id: true,
    ...seededTeamsSelect,
    ...slotLinksSelect,
};
// Dùng cho getBracket() — full projection map ra BracketSlotNode.
export const bracketSlotNodeSelect = {
    id: true,
    round: true,
    slot_number: true,
    match_id: true,
    is_bye: true,
    ...seededTeamsSelect,
    ...slotLinksSelect,
};
// select thay include: propagateWinner chỉ cần .id của parent slot (fed_as_a/
// fed_as_b), không cần full BracketSlot row. select cũng an toàn hơn omit khi
// schema thêm cột mới — field mới không tự lộ ra nếu không khai báo trong select.
export const slotWithParentLinksSelect = {
    id: true,
    ...seededTeamsSelect,
    fed_as_a: { select: { id: true } },
    fed_as_b: { select: { id: true } },
};
//# sourceMappingURL=knockout.type.js.map