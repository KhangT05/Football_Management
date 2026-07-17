export const parseList = (res) => {
    const payload = typeof res?.status === 'boolean' ? res.data : res;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
};

export const unwrap = (res) => (typeof res?.status === 'boolean' ? res.data : res);

export const normalizePlayer = (tp) => ({
    id: tp.id,
    player_id: tp.player_id ?? tp.player?.id,
    user_id: tp.player?.user_id ?? tp.player?.user?.id,
    name: (tp.player?.user?.name || tp.player?.name || tp.name || '').trim() || `Cầu thủ #${tp.id}`,
    email: tp.player?.user?.email ?? null,
    student_code: tp.player?.user?.student_code ?? tp.player?.student_code ?? null,
    number: tp.jersey_number ?? tp.number ?? 0,
    position: tp.position ?? 'MID',
    goals: tp.goals_scored ?? tp.goals ?? 0,
    status: tp.status ?? 'active',
    role: tp.role ?? 'player',
    avatar: tp.player?.user?.avatar ?? tp.player?.avatar ?? null,
});

export const extractFilename = (contentDisposition, fallback) => {
    if (!contentDisposition) return fallback;
    const m = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^;"]+)"?/i);
    return m ? decodeURIComponent(m[1]) : fallback;
};

export const downloadBlob = (res, fallbackName) => {
    const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
    if (!blob.size) throw new Error('File rỗng, vui lòng thử lại.');
    const filename = extractFilename(res?.headers?.['content-disposition'], fallbackName);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove();
    window.URL.revokeObjectURL(url);
};