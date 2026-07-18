// ─── Projection ───────────────────────────────────────────────────────────────
export const PLAYER_SELECT = {
    id: true,
    user_id: true,
    date_of_birth: true,
    position: true,
    height: true,
    weight: true,
    nationality: true,
    avatar: true,
    is_active: true,
    created_at: true,
    updated_at: true,
    user: {
        select: { id: true, name: true, email: true, student_code: true, phone: true },
    },
};
export const PLAYER_PUBLIC_SELECT = {
    id: true, date_of_birth: true, position: true, height: true,
    weight: true, nationality: true, avatar: true,
    user: { select: { id: true, name: true, student_code: true } },
};
// FIX: bỏ team_id/is_active/deleted_at (không tồn tại trên TeamPlayer).
// Thêm season_team_id + season_team.team_id để resolve team khi cần.
export const TEAM_PLAYER_SELECT = {
    id: true,
    season_team_id: true,
    player_id: true,
    jersey_number: true,
    position: true,
    role: true,
    status: true,
    approval_status: true,
    created_at: true,
    updated_at: true,
    joined_at: true,
    season_team: {
        select: {
            id: true,
            team_id: true,
            season_id: true,
        },
    },
    player: {
        select: PLAYER_SELECT,
    },
};
// FIX: đi đúng chiều team_players -> season_team -> {team, season.tournament, group}
// thay vì team_players -> team -> season_teams (sai quan hệ, và trả về mọi
// season của team thay vì đúng season của team_player đang xét).
export const PLAYER_SELECT_WITH_SEASONS = {
    ...PLAYER_SELECT,
    team_players: {
        select: {
            id: true,
            season_team_id: true,
            jersey_number: true,
            position: true,
            role: true,
            status: true,
            approval_status: true,
            season_team: {
                select: {
                    id: true,
                    status: true,
                    group_id: true,
                    group: {
                        select: { id: true, name: true },
                    },
                    team: {
                        select: { id: true, name: true },
                    },
                    season: {
                        select: {
                            id: true,
                            name: true,
                            status: true,
                            tournament: {
                                select: { id: true, name: true, logo: true },
                            },
                        },
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=player.type.js.map