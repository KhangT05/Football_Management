// ─── Projection ───────────────────────────────────────────────────────────────
// Định nghĩa relation 1 lần, dùng select.player.user mọi nơi cần tránh N+1.
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
        select: { id: true, name: true, email: true, phone: true },
    },
};
export const PLAYER_PUBLIC_SELECT = {
    id: true, date_of_birth: true, position: true, height: true,
    weight: true, nationality: true, avatar: true,
    user: { select: { id: true, name: true } }, // bỏ email, phone
};
export const TEAM_PLAYER_SELECT = {
    id: true,
    team_id: true,
    player_id: true,
    jersey_number: true,
    position: true,
    role: true,
    status: true,
    approval_status: true,
    is_active: true,
    created_at: true,
    updated_at: true,
    player: {
        select: PLAYER_SELECT,
    },
};
export const PLAYER_SELECT_WITH_SEASONS = {
    ...PLAYER_SELECT,
    team_players: {
        where: { deleted_at: null },
        select: {
            id: true,
            team_id: true,
            jersey_number: true,
            position: true,
            role: true,
            status: true,
            approval_status: true,
            team: {
                select: {
                    id: true,
                    name: true,
                    season_teams: {
                        where: { deleted_at: null },
                        select: {
                            id: true,
                            status: true,
                            group_id: true,
                            group: {
                                select: { id: true, name: true },
                            },
                            season: {
                                select: {
                                    id: true,
                                    name: true,
                                    status: true,
                                    // FIX: thêm tournament — mỗi season thuộc đúng 1 tournament
                                    // (tournament_id required, không nullable trong schema),
                                    // FE cần cái này để hiển thị "Giải X - Mùa Y" thay vì chỉ mùa giải.
                                    tournament: {
                                        select: { id: true, name: true, logo: true },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=player.type.js.map