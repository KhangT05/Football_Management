const venueSelect = {
    select: { id: true, name: true, address: true },
};
const teamSelect = {
    select: { id: true, name: true, logo: true },
};
const phaseSelect = {
    select: { id: true, name: true, format: true },
};
const matchResultSelect = {
    select: {
        id: true,
        winner_team_id: true,
        home_extra_time_score: true,
        away_extra_time_score: true,
        home_penalty_score: true,
        away_penalty_score: true,
        home_final_score: true,
        away_final_score: true,
        result_type: true,
        status: true,
        notes: true,
    },
};
// Dùng cho MỌI nơi cần đọc TournamentRule của 1 season (confirm/forfeit/
// recompute). 1 nguồn sự thật duy nhất — đừng inline lại field list ở nơi khác.
const tournamentRuleSuspensionSelect = {
    select: { yellow_cards_suspension: true, forfeit_score: true },
};
// phase + tournamentRule — dùng cho confirm/forfeit/recompute cần business rule.
// LƯU Ý: rule nằm ở Season.tournamentRule (quan hệ 1-1 qua tournament_rule_id),
// KHÔNG phải Tournament.tournamentRule (đó là mảng TournamentRule[] — toàn bộ
// rule từng tạo cho tournament, không đảm bảo là rule đang active cho season này).
const phaseWithRuleSelect = {
    select: {
        id: true,
        format: true,
        season: {
            select: {
                id: true,
                tournamentRule: tournamentRuleSuspensionSelect,
            },
        },
    },
};
export const matchListSelect = {
    id: true,
    status: true,
    round: true,
    leg: true,
    scheduled_at: true,
    played_at: true,
    home_score: true,
    away_score: true,
    current_period: true,
    is_published: true,
    referee: true,
    phase_id: true,
    group_id: true,
    home_team_id: true,
    away_team_id: true,
    home_team: teamSelect,
    away_team: teamSelect,
    venue: venueSelect,
    phase: phaseSelect,
    matchResult: {
        select: {
            result_type: true,
            status: true,
            home_final_score: true,
            away_final_score: true,
        },
    },
};
// ── 2. Detail / live view ─────────────────────────────────────
export const matchDetailSelect = {
    ...matchListSelect,
    postponed_from: true,
    postponed_reason: true,
    abandoned_minute: true,
    matchResult: matchResultSelect,
    events: {
        select: {
            id: true,
            type: true,
            minute: true,
            added_minute: true,
            period: true,
            team_id: true,
            player_id: true,
            card_color: true,
            note: true,
        },
        orderBy: [{ minute: 'asc' }, { id: 'asc' }],
    },
};
// ── 3. Confirm result (internal — MatchResultService.confirmResultInTx) ───
// Cần: status guard, phase.format, tournamentRule (yellow_cards_suspension),
// matchResult existence check, phase_id (trả về ConfirmResultCore).
export const matchForConfirmSelect = {
    id: true,
    status: true,
    home_team_id: true,
    away_team_id: true,
    group_id: true,
    phase_id: true,
    phase: phaseWithRuleSelect,
    matchResult: { select: { id: true } },
};
// ── 4. Override result (internal — MatchResultService.overrideResultInTx) ──
// KHÔNG cần tournamentRule (overrideResultInTx hiện không tính yellowSuspension),
// chỉ cần phase.format + season.id cho guard seeded-bracket. Giữ select nhẹ,
// đừng tái sử dụng matchForConfirmSelect ở đây — 2 use-case khác field set.
export const matchForOverrideSelect = {
    id: true,
    home_team_id: true,
    away_team_id: true,
    group_id: true,
    phase: {
        select: {
            format: true,
            season: { select: { id: true } },
        },
    },
    matchResult: { select: { id: true, result_type: true } },
};
// ── 5. Finalize (internal — MatchLifecycleService) ───────────
export const matchForFinalizeSelect = {
    id: true,
    status: true,
    home_team_id: true,
    group_id: true,
    phase: {
        select: { format: true },
    },
};
// ── 6. Forfeit (internal — MatchLifecycleService) ────────────
// forfeitMatch() cần: status, team ids, forfeit_score từ tournamentRule.
export const matchForForfeitSelect = {
    id: true,
    status: true,
    home_team_id: true,
    away_team_id: true,
    phase: phaseWithRuleSelect,
};
// ── 7. Admin / management ─────────────────────────────────────
export const Select = {
    ...matchDetailSelect,
    is_active: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    user_id: true,
    matchResult: {
        select: {
            ...matchResultSelect.select,
            appeal_reason: true,
            appeal_note: true,
            duration: true,
            is_active: true,
            created_at: true,
            updated_at: true,
        },
    },
};
export { phaseWithRuleSelect };
//# sourceMappingURL=match.queries.js.map