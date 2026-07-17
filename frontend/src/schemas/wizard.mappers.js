import { newCid } from './wizard.constants';

// Convert state FE (_cid-based) -> payload BE (order số nguyên). Gọi ĐÚNG 1 LẦN lúc build
// request submit — không lưu dạng order trong RHF state, tránh vỡ liên kết khi thêm/xóa
// stage giữa chừng (index dịch chuyển nhưng _cid luôn ổn định).
export const toApiCustomStages = (stages) => {
    const cidToOrder = new Map(stages.map((s, idx) => [s._cid, idx]));
    return stages.map((s, idx) => {
        const { _cid, source_stage_cid, ...rest } = s;
        return {
            ...rest,
            order: idx,
            source_stage_order: source_stage_cid != null ? (cidToOrder.get(source_stage_cid) ?? null) : null,
        };
    });
};

// Convert ngược: payload BE (order số) -> state FE (_cid). Dùng khi load 1 rule template
// có sẵn custom_stages từ DB vào form để sửa tiếp.
export const fromApiCustomStages = (stagesFromApi) => {
    if (!Array.isArray(stagesFromApi)) return [];
    const sorted = [...stagesFromApi].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const cids = sorted.map(() => newCid());
    return sorted.map((s, idx) => {
        const { order: _order, source_stage_order, ...rest } = s;
        return {
            ...rest,
            _cid: cids[idx],
            source_stage_cid: source_stage_order != null ? (cids[source_stage_order] ?? null) : null,
        };
    });
};

// Map 1 TournamentRuleDto (từ BE) -> RuleFormValues (để prefill form + so dirty-state).
export const ruleDtoToFormValues = (rule) => ({
    name: rule.name ?? '',
    format: rule.format,
    round_robin_stages: rule.round_robin_stages ?? 1,
    points_per_win: rule.points_per_win ?? 3,
    points_per_draw: rule.points_per_draw ?? 1,
    points_per_loss: rule.points_per_loss ?? 0,
    max_players_per_team: rule.max_players_per_team ?? 11,
    min_players_per_team: rule.min_players_per_team ?? 7,
    suspension_match_count: rule.suspension_match_count ?? 1,
    yellow_cards_suspension: rule.yellow_cards_suspension ?? 3,
    fine_per_yellow_card: Number(rule.fine_per_yellow_card ?? 0),
    fine_per_red_card: Number(rule.fine_per_red_card ?? 0),
    forfeit_score: rule.forfeit_score ?? 3,
    bonus_per_goal: Number(rule.bonus_per_goal ?? 0),
    bonus_per_assist: Number(rule.bonus_per_assist ?? 0),
    teams_advance_per_group: rule.teams_advance_per_group ?? 2,
    tiebreaker_order: Array.isArray(rule.tiebreaker_order) ? [...rule.tiebreaker_order] : [],
    custom_stages: fromApiCustomStages(rule.custom_stages),
});