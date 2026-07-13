export const POSITION_ORDER = [
    { key: 'forward', label: 'Tiền đạo' },
    { key: 'midfielder', label: 'Tiền vệ' },
    { key: 'defender', label: 'Hậu vệ' },
    { key: 'goalkeeper', label: 'Thủ môn' },
];

export const POS_LABEL_SHORT = { goalkeeper: 'TM', defender: 'HV', midfielder: 'TV', forward: 'TĐ' };
export const POS_LABEL_VI = { goalkeeper: 'Thủ môn', defender: 'Hậu vệ', midfielder: 'Tiền vệ', forward: 'Tiền đạo' };

export function mapPosition(rawPos) {
    const p = (rawPos || '').toUpperCase();
    if (p === 'GK' || p === 'GOALKEEPER') return 'goalkeeper';
    if (p === 'DEF' || p === 'DEFENDER') return 'defender';
    if (p === 'MID' || p === 'MIDFIELDER') return 'midfielder';
    if (p === 'FW' || p === 'FORWARD') return 'forward';
    return (rawPos || 'midfielder').toLowerCase();
}

export const DEFAULT_SQUAD_LIMIT = { min_players_per_team: 7, max_players_per_team: 11 };

// NEW — sơ đồ đá chính CỐ ĐỊNH theo loại sân (khớp PITCH_FORMATION bên BE).
// Đây là số lượng ĐÚNG từng vị trí phải điền đủ, không phải khoảng min/max.
export const PITCH_FORMATIONS = {
    san_5: { goalkeeper: 1, defender: 2, midfielder: 1, forward: 1 },
    san_7: { goalkeeper: 1, defender: 3, midfielder: 2, forward: 1 },
    san_11: { goalkeeper: 1, defender: 4, midfielder: 3, forward: 3 },
};

export const PITCH_LABEL_VI = { san_5: 'Sân 5', san_7: 'Sân 7', san_11: 'Sân 11' };

const formationTotal = (f) => Object.values(f).reduce((a, b) => a + b, 0);

// Match -> phase -> season.pitch_type. Fallback san_5 khớp default ở schema.
export function getPitchFormation(match) {
    const pitchType = match?.phase?.season?.pitch_type ?? 'san_5';
    return { pitchType, formation: PITCH_FORMATIONS[pitchType] ?? PITCH_FORMATIONS.san_5 };
}

// FIX: trước đây suy ra min/max đá chính từ tournament_rule (1 khoảng chung
// chung, không liên quan gì tới sân 5/7/11 thật sự đang đá). Giờ đá chính
// phải ĐÚNG bằng tổng sơ đồ sân (min = max = số cầu thủ sân yêu cầu).
// tournament_rule chỉ còn dùng cho max_squad_size (tổng đăng ký gồm dự bị).
export function getSquadLimit(match) {
    const rule = match?.phase?.season?.tournament_rule ?? match?.phase?.season?.tournamentRule;
    const { pitchType, formation } = getPitchFormation(match);
    const startersNeeded = formationTotal(formation);

    return {
        min_players_per_team: startersNeeded,
        max_players_per_team: startersNeeded,
        max_squad_size: rule?.max_players_per_team ?? Math.max(DEFAULT_SQUAD_LIMIT.max_players_per_team, startersNeeded),
        pitchType,
        formation,
    };
}