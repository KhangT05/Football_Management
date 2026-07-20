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
    return (rawPos || 'unknown').toLowerCase();
}

export const DEFAULT_SQUAD_LIMIT = { min_players_per_team: 7, max_players_per_team: 11 };

// Tổng số cầu thủ đá chính theo LUẬT sân (5/7/11 người) — con số duy nhất bị
// ép cứng bởi loại sân. KHÔNG có tỷ lệ DEF/MID/FW cố định: đội bóng tự chọn
// sơ đồ chiến thuật riêng (vd sân 5 có thể đá 2-1-1 hay 1-2-1 tuỳ HLV).
// Ràng buộc cứng duy nhất khác ngoài tổng số là: đúng 1 thủ môn (xem
// PITCH_GOALKEEPER_COUNT bên dưới) — khớp với BE (PITCH_TOTAL_STARTERS trong
// match-lineup.service.ts), phải giữ đồng bộ 2 bên.
export const PITCH_TOTAL_STARTERS = { san_5: 5, san_7: 7, san_11: 11 };

export const PITCH_GOALKEEPER_COUNT = 1;

export const PITCH_LABEL_VI = { san_5: 'Sân 5', san_7: 'Sân 7', san_11: 'Sân 11' };

// Match -> phase -> season.pitch_type. Fallback san_5 khớp default ở schema.
export function getPitchInfo(match) {
    const pitchType = match?.phase?.season?.pitch_type ?? 'san_5';
    return {
        pitchType,
        totalStarters: PITCH_TOTAL_STARTERS[pitchType] ?? PITCH_TOTAL_STARTERS.san_5,
    };
}

// FIX: trước đây suy ra min/max đá chính từ tournament_rule (1 khoảng chung
// chung, không liên quan gì tới sân 5/7/11 thật sự đang đá). Giờ đá chính
// phải ĐÚNG bằng tổng số người/sân theo luật (min = max = totalStarters).
// tournament_rule chỉ còn dùng cho max_squad_size (tổng đăng ký gồm dự bị,
// KHÔNG liên quan luật số người trên sân).
export function getStarterRequirement(match) {
    const { pitchType } = getPitchInfo(match);
    return PITCH_TOTAL_STARTERS[pitchType] ?? PITCH_TOTAL_STARTERS.san_5;
}

export function getSquadRange(match) {
    const rule = match?.phase?.season?.tournamentRule;
    if (rule) return { min_players_per_team: rule.min_players_per_team, max_players_per_team: rule.max_players_per_team };
    return DEFAULT_SQUAD_LIMIT;
}

// Giữ lại hàm cũ nếu có nơi nào vẫn dùng, nhưng nó đã được decouple thành 2 hàm trên
export function getSquadLimit(match) {
    const rule = getSquadRange(match);
    const { pitchType, totalStarters } = getPitchInfo(match);

    return {
        min_players_per_team: totalStarters,
        max_players_per_team: totalStarters,
        max_squad_size: rule?.max_players_per_team ?? Math.max(DEFAULT_SQUAD_LIMIT.max_players_per_team, totalStarters),
        pitchType,
    };
}