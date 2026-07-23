import {
    Trophy, LayoutGrid, Layers, Repeat, Puzzle,
} from 'lucide-react';

// ============================================================
// Format metadata — khớp enum SeasonFormat (Prisma) + ràng buộc round_robin_stages
// mà TournamentRuleService.validateFormatConsistency() enforce ở BE.
// stagesMode 'fixed0'/'fixed1' -> field bị khóa. 'min1'/'min2' -> clamp theo min.
// 'custom' -> round_robin_stages KHÔNG được BE đọc, cấu trúc do custom_stages[] quyết định.
// ============================================================
export const FORMAT_META = [
    {
        value: 'round_robin', label: 'Vòng tròn',
        desc: 'Chỉ đá vòng bảng tính điểm, không có loại trực tiếp.',
        icon: LayoutGrid, color: 'emerald',
        hasGroupPhase: true, hasKnockout: false, stagesMode: 'min1',
    },
    {
        value: 'knockout', label: 'Loại trực tiếp',
        desc: 'Đá loại trực tiếp toàn giải ngay từ đầu.',
        icon: Trophy, color: 'orange',
        hasGroupPhase: false, hasKnockout: true, stagesMode: 'fixed0',
    },
    {
        value: 'round_robin_knockout', label: 'Vòng bảng → Loại trực tiếp',
        desc: '1 vòng bảng tính điểm, sau đó vào nhánh knockout.',
        icon: Layers, color: 'blue',
        hasGroupPhase: true, hasKnockout: true, stagesMode: 'min1',
    },
    {
        value: 'multi_round_robin_knockout', label: 'Nhiều vòng bảng → Loại trực tiếp',
        desc: 'Nhiều vòng bảng liên tiếp rồi vào knockout.',
        icon: Repeat, color: 'indigo',
        hasGroupPhase: true, hasKnockout: true, stagesMode: 'min2',
    },
    {
        value: 'custom', label: 'Tùy chỉnh (Hybrid)',
        desc: 'Tự dựng pipeline nhiều stage: vòng bảng → knockout → tranh hạng...',
        icon: Puzzle, color: 'fuchsia',
        hasGroupPhase: null, hasKnockout: null, stagesMode: 'custom',
    },
];

export const PITCH_TYPE_META = [
    { value: 'san_5', label: 'Sân 5' },
    { value: 'san_7', label: 'Sân 7' },
    { value: 'san_11', label: 'Sân 11' },
];

export const STAGE_TYPE_META = [
    { value: 'round_robin', label: 'Vòng bảng' },
    { value: 'knockout', label: 'Loại trực tiếp' },
    { value: 'classification', label: 'Tranh hạng (phụ)' },
];

export const SEED_MODE_META = [
    { value: 'standing_straight', label: 'Xếp thẳng theo bảng xếp hạng' },
    { value: 'standing_cross', label: 'Bắt cặp chéo (1A-2B, 1B-2A...)' },
    { value: 'standing_random', label: 'Bốc thăm ngẫu nhiên' },
    { value: 'manual', label: 'Xếp cặp thủ công' },
];

export const KNOCKOUT_LEG_TYPE_META = [
    { value: 'single_leg', label: '1 trận', desc: 'Đá 1 trận duy nhất (chung kết/sân trung lập).' },
    { value: 'two_legged', label: 'Lượt đi - lượt về', desc: 'Đá 2 lượt, cộng dồn tỷ số.' },
];

export const TIEBREAKER_LABELS = {
    goal_diff: 'Hiệu số bàn thắng-thua',
    goals_scored: 'Bàn thắng ghi được',
    goals_conceded: 'Bàn thua (càng ít càng ưu tiên)',
    head_to_head: 'Đối đầu trực tiếp',
    yellow_cards: 'Thẻ vàng (càng ít càng ưu tiên)',
    red_cards: 'Thẻ đỏ (càng ít càng ưu tiên)',
};
export const ALL_TIEBREAKERS = Object.keys(TIEBREAKER_LABELS);

export const getFormatMeta = (value) =>
    FORMAT_META.find(f => f.value === value) ?? FORMAT_META[2];

export const clampStagesForFormat = (format, stages) => {
    const meta = getFormatMeta(format);
    if (meta.stagesMode === 'fixed0') return 0;
    if (meta.stagesMode === 'fixed1') return 1;
    if (meta.stagesMode === 'min1') return stages < 1 ? 1 : stages;
    if (meta.stagesMode === 'min2') return stages < 2 ? 2 : stages;
    return stages;
};

// So sánh theo string ISO date (YYYY-MM-DD), KHÔNG qua Date object — new Date('2026-07-09')
// parse UTC midnight trong khi new Date() là local time -> off-by-one gần biên ngày nếu
// user không ở UTC. So string tránh hoàn toàn vấn đề này.
export const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const addDaysStr = (dateStr, delta) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    dt.setDate(dt.getDate() + delta);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
};

export const newCid = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `s${Date.now()}_${Math.random().toString(36).slice(2)}`;

// Numeric-only parsing — mọi input number trong wizard phải đi qua đây. Không dùng
// `+e.target.value` (chuỗi rỗng -> 0 im lặng sai) hay RHF `valueAsNumber` (input rỗng -> NaN
// chảy thẳng vào state, NaN < 1 luôn false -> qua mặt zod bên dưới).
export const safeInt = (raw, fallback = 0) => {
    if (raw === '' || raw === null || raw === undefined) return fallback;
    const n = Math.trunc(Number(raw));
    return Number.isFinite(n) ? n : fallback;
};
export const safeFloat = (raw, fallback = 0) => {
    if (raw === '' || raw === null || raw === undefined) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
};