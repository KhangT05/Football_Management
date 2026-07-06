export const normalizePosition = (posStr) => {
    if (!posStr) return 'OTHER';
    const p = posStr.toUpperCase().trim();
    if (p === 'GOALKEEPER' || p.includes('GK') || p.includes('THỦ MÔN')) return 'GK';
    if (p === 'DEFENDER' || p.includes('DEF') || p === 'DF' || p.includes('HẬU VỆ')) return 'DEF';
    if (p === 'MIDFIELDER' || p.includes('MID') || p === 'MF' || p.includes('TIỀN VỆ')) return 'MID';
    if (p === 'FORWARD' || p.includes('FW') || p === 'FWD' || p.includes('TIỀN ĐẠO')) return 'FW';
    return p;
};

// Trích tên file từ header Content-Disposition (nếu backend có set), fallback về tên mặc định
export const extractFilename = (contentDisposition, fallback) => {
    if (!contentDisposition) return fallback;
    const match = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^;"]+)"?/i);
    return match ? decodeURIComponent(match[1]) : fallback;
};

export const parseSingle = (res) => {
    const payload = typeof res?.status === 'boolean' ? res.data : res;
    return Array.isArray(payload?.data) ? payload.data[0] : (payload?.data ?? payload);
};

export const parseList = (res) => {
    const payload = typeof res?.status === 'boolean' ? res.data : res;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
};

// Normalize player from team-player record
export const normalizePlayer = (tp) => ({
    id: tp.id, // teamPlayer ID
    player_id: tp.player_id ?? tp.player?.id,
    name: tp.player?.user?.name ?? tp.player?.name ?? tp.name ?? `Cầu thủ #${tp.id}`,
    number: tp.jersey_number ?? tp.number ?? 0,
    position: tp.position ?? 'MID',
    goals: tp.goals_scored ?? tp.goals ?? 0,
    status: tp.status ?? 'active',
    role: tp.role ?? 'player',
    avatar: tp.player?.avatar ?? null,
});