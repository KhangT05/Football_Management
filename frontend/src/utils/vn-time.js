// Việt Nam không có DST → offset cố định +7h, không cần IANA tz lib.
export const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * 'YYYY-MM-DDTHH:mm' (hiểu là giờ VN, wall-clock) -> Date (instant UTC thật)
 */
export function vnInputToUtcDate(value) {
    if (!value) return null;
    const utcMs = Date.parse(`${value}:00.000Z`) - VN_OFFSET_MS;
    return new Date(utcMs);
}
export const utcToVnDateInput = (value) => {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    return new Date(d.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10);
};
/**
 * Date/ISO string (UTC instant) -> 'YYYY-MM-DDTHH:mm' để feed vào
 * <input type="datetime-local">, hiển thị đúng giờ VN bất kể TZ máy client.
 */
export function utcToVnInput(isoOrDate) {
    if (!isoOrDate) return '';
    const utcMs = new Date(isoOrDate).getTime();
    if (Number.isNaN(utcMs)) return '';
    return new Date(utcMs + VN_OFFSET_MS).toISOString().slice(0, 16);
}

/**
 * Build mảng 'YYYY-MM-DD' giữa 2 ngày, thuần UTC-calendar-day arithmetic —
 * không đi qua local Date parsing nên không có TZ round-trip bug.
 */
export function getDatesInRangeUtc(start, end) {
    if (!start || !end) return [];
    const [sy, sm, sd] = start.split('-').map(Number);
    const [ey, em, ed] = end.split('-').map(Number);
    const startMs = Date.UTC(sy, sm - 1, sd);
    const endMs = Date.UTC(ey, em - 1, ed);
    if (Number.isNaN(startMs) || Number.isNaN(endMs) || startMs > endMs) return [];
    const dates = [];
    for (let ms = startMs; ms <= endMs; ms += 86_400_000) {
        dates.push(new Date(ms).toISOString().slice(0, 10));
    }
    return dates;
}

export function formatDateChipUtc(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const utcDate = new Date(Date.UTC(y, m - 1, d));
    const weekday = utcDate.toLocaleDateString('vi-VN', { weekday: 'short', timeZone: 'UTC' });
    const dm = utcDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
    return `${weekday} ${dm}`;
}