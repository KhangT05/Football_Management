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
//# sourceMappingURL=player.type.js.map