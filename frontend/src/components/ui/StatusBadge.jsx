/**
 * StatusBadge — Hiển thị trạng thái trận đấu với màu sắc tương ứng.
 * Dùng cho ManageMatches, ScheduleResults, MatchDetail…
 *
 * @param {'scheduled'|'ongoing'|'finished'|'cancelled'|'forfeited'} status
 */
export default function StatusBadge({ status }) {
  const map = {
    scheduled: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    ongoing:   'bg-red-400/10 text-red-400 border-red-400/30 animate-pulse',
    finished:  'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    cancelled: 'bg-gray-400/10 text-gray-400 border-gray-400/30',
    forfeited: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
  };
  const labels = {
    scheduled: 'Sắp diễn ra',
    ongoing:   '🔴 Đang diễn ra',
    finished:  'Đã kết thúc',
    cancelled: 'Đã hủy',
    forfeited: 'Xử thua',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${map[status] || map.scheduled}`}>
      {labels[status] || status}
    </span>
  );
}
