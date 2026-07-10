export const POSITION_ORDER = [
    { key: 'forward', label: 'Tiền đạo' },
    { key: 'midfielder', label: 'Tiền vệ' },
    { key: 'defender', label: 'Hậu vệ' },
    { key: 'goalkeeper', label: 'Thủ môn' },
];

export const POS_LABEL_SHORT = { goalkeeper: 'TM', defender: 'HV', midfielder: 'TV', forward: 'TĐ' };
export const POS_LABEL_VI = { goalkeeper: 'Thủ môn', defender: 'Hậu vệ', midfielder: 'Tiền vệ', forward: 'Tiền đạo' };

// Chuẩn hoá mọi biến thể vị trí (GK/DEF/MID/FW hoặc full-word, hoa/thường)
// về 1 giá trị duy nhất khớp Prisma enum PlayerPosition.
export function mapPosition(rawPos) {
    const p = (rawPos || '').toUpperCase();
    if (p === 'GK' || p === 'GOALKEEPER') return 'goalkeeper';
    if (p === 'DEF' || p === 'DEFENDER') return 'defender';
    if (p === 'MID' || p === 'MIDFIELDER') return 'midfielder';
    if (p === 'FW' || p === 'FORWARD') return 'forward';
    return (rawPos || 'midfielder').toLowerCase();
}

export const DEFAULT_SQUAD_LIMIT = { min_players_per_team: 7, max_players_per_team: 11 };

// Match -> phase -> season -> tournamentRule (Match không có field `season` trực tiếp).
export function getSquadLimit(match) {
    const rule = match?.phase?.season?.tournament_rule ?? match?.phase?.season?.tournamentRule;
    return {
        min_players_per_team: rule?.min_players_per_team ?? DEFAULT_SQUAD_LIMIT.min_players_per_team,
        max_players_per_team: rule?.max_players_per_team ?? DEFAULT_SQUAD_LIMIT.max_players_per_team,
    };
}