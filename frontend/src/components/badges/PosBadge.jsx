/**
 * PosBadge — Hiển thị vị trí cầu thủ với màu sắc tương ứng.
 * Dùng ở MyTeam, TeamDetail, LeaderboardTeams…
 *
 * @param {'GK'|'DEF'|'MID'|'FW'} pos
 */
export default function PosBadge({ pos }) {
  const styles = {
    GK:  'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
    DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
    MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    FW:  'bg-red-400/10 text-red-400 border-red-400/30',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${styles[pos] || 'bg-gray-400/10 text-gray-400 border-gray-400/30'}`}>
      {pos}
    </span>
  );
}
