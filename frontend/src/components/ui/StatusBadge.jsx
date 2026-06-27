/**
 * StatusBadge — Unified status badge component.
 *
 * Supports two variants:
 *   - "match"      (default): scheduled | ongoing | finished | cancelled | forfeited
 *   - "seasonTeam":           approved | pending | rejected | active | withdrawn
 *
 * @param {string}  status   — Status key
 * @param {'match'|'seasonTeam'} [variant='match']
 * @param {'default'|'compact'|'fancy'} [size='default']
 */
export default function StatusBadge({ status, variant = 'match', size = 'default' }) {
  const configs = {
    match: {
      scheduled:  { cls: 'bg-amber-400/10 text-amber-400 border-amber-400/30', label: 'Sắp diễn ra' },
      ongoing:    { cls: 'bg-red-400/10 text-red-400 border-red-400/30 animate-pulse', label: '🔴 Đang diễn ra' },
      finished:   { cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30', label: 'Đã kết thúc' },
      cancelled:  { cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30', label: 'Đã hủy' },
      forfeited:  { cls: 'bg-orange-400/10 text-orange-400 border-orange-400/30', label: 'Xử thua' },
    },
    seasonTeam: {
      approved:   { cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30', label: 'Đã duyệt' },
      pending:    { cls: 'bg-amber-400/10 text-amber-400 border-amber-400/30', label: 'Chờ duyệt' },
      rejected:   { cls: 'bg-red-400/10 text-red-400 border-red-400/30', label: 'Từ chối' },
      active:     { cls: 'bg-blue-400/10 text-blue-400 border-blue-400/30', label: 'Hoạt động' },
      withdrawn:  { cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30', label: 'Đã rút' },
    },
  };

  const sizeClasses = {
    default: 'px-3 py-1 rounded-full text-xs font-bold',
    compact: 'px-2 py-1 rounded-full text-xs font-bold',
    fancy: 'px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest',
  };

  const map = configs[variant] ?? configs.match;
  const s = map[status] ?? { cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30', label: status };

  return (
    <span className={`border shadow-sm ${sizeClasses[size] || sizeClasses.default} ${s.cls}`}>
      {s.label}
    </span>
  );
}
