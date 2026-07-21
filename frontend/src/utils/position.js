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

// ⚠️ DEPRECATED cho mọi mục đích VALIDATION — chỉ còn dùng cho hiển thị
// fallback khi CHƯA có data live (loading state), KHÔNG được dùng để tính
// squadLimit/cap starter/build zod schema nữa.
//
// LÝ DO: match.phase.season.pitch_type đến từ match-list/match-detail query,
// có thể đã được react-query cache TRƯỚC KHI admin đổi season.pitch_type
// (vd san_5 -> san_11) — object `match` không tự invalidate khi season thay
// đổi. BE (getMatchContextOrFail trong match-lineup.service.ts) luôn đọc
// pitch_type LIVE tại thời điểm register(), nên bất kỳ nơi nào ở FE dùng lại
// match.phase.season.pitch_type để tính số liệu QUYẾT ĐỊNH validate (starter
// cap, zod min/max) đều có nguy cơ lệch khỏi BE — đây chính là bug đã xảy ra
// (badge "SÂN 5" trong khi BE validate theo "SÂN 11" đã bị đổi sau khi tạo
// match). Nguồn sự thật cho pitchType/totalStarters phải là API
// GET /matches/:id/lineups/formation (wrap MatchLineupService.getFormationForMatch),
// gọi live mỗi lần mở LineupBuilderModal — xem cách dùng trong
// LineupBuilderModal.jsx.
export function getPitchInfo(match) {
    const pitchType = match?.phase?.season?.pitch_type ?? 'san_5';
    return {
        pitchType,
        totalStarters: PITCH_TOTAL_STARTERS[pitchType] ?? PITCH_TOTAL_STARTERS.san_5,
    };
}

export function getSquadRange(match) {
    const rule = match?.phase?.season?.tournamentRule;
    if (rule) return { min_players_per_team: rule.min_players_per_team, max_players_per_team: rule.max_players_per_team };
    return DEFAULT_SQUAD_LIMIT;
}

// FIX (stale pitch_type bug — phần 2): giờ nhận `totalStarters` LIVE làm
// tham số bắt buộc thay vì tự suy qua getPitchInfo(match). Caller (modal)
// phải lấy totalStarters từ formation query (GET .../lineups/formation) rồi
// truyền vào đây — không còn đường nào để squadLimit vô tình dùng lại
// pitch_type cache cũ.
//
// Nếu gọi mà chưa có totalStarters (formation đang loading), trả về
// min=max=null tường minh — buildLineupFormSchema/caller phải tự xử lý
// trạng thái "chưa xác định" này (chặn tương tác thay vì âm thầm dùng
// san_5 mặc định sai).
//
// tournament_rule (max_squad_size — tổng đăng ký chính+dự bị) vẫn lấy qua
// match.phase.season.tournamentRule như cũ: field này không phải nguồn gây
// bug đang fix (ít khi đổi giữa lúc season đang diễn ra — SeasonService chỉ
// cho sửa full field khi status upcoming/registration_open), nhưng cùng rủi
// ro cache về nguyên tắc — nếu sau này phát sinh lệch tương tự, áp dụng
// đúng pattern này: fetch live thay vì đọc qua match object.
export function getSquadLimit(match, totalStarters) {
    const rule = getSquadRange(match);

    return {
        min_players_per_team: totalStarters ?? null,
        max_players_per_team: totalStarters ?? null,
        max_squad_size: rule?.max_players_per_team ?? DEFAULT_SQUAD_LIMIT.max_players_per_team,
        pitchType: null, // không còn nguồn tin cậy ở layer này — dùng formation.pitchType từ modal để hiển thị
    };
}