import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getInitials, AVATAR_COLORS } from '../utils/constants';

/**
 * StandingRow — Một hàng trong bảng xếp hạng (LeaderboardTeams).
 */
export default function StandingRow({ row, idx, teams }) {
  const team = teams.find(t => t.id === row.team_id);
  const initial = getInitials(team?.name ?? row.team_name ?? `Đội ${row.team_id}`);
  const colorIdx = (row.team_id ?? idx) % AVATAR_COLORS.length;
  const rank = idx + 1;

  return (
    <tr
      className={`group/row transition-all duration-300 animate-slide-up border-b border-navy-light/50 hover:bg-navy-light/20 ${
        rank === 1 ? 'bg-yellow-500/5' :
        rank === 2 ? 'bg-gray-400/5' :
        rank === 3 ? 'bg-amber-600/5' : ''
      }`}
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <td className="py-4 px-6 text-center">
        {rank === 1 ? (
          <div className="inline-flex w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50 items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
        ) : rank === 2 ? (
          <div className="inline-flex w-8 h-8 rounded-full bg-gray-300/20 border border-gray-300/50 items-center justify-center">
            <Trophy className="w-4 h-4 text-gray-300" />
          </div>
        ) : rank === 3 ? (
          <div className="inline-flex w-8 h-8 rounded-full bg-amber-600/20 border border-amber-600/50 items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
        ) : (
          <span className="font-bold text-gray-500">{rank}</span>
        )}
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-black text-sm text-white shadow-md border border-white/10 shrink-0 group-hover/row:scale-105 transition-transform`}>
            {initial}
          </div>
          <div className="min-w-0">
            <Link
              to={`/doi-bong/${row.team_id}`}
              className="font-bold text-white text-base hover:text-blue-400 transition-colors truncate block"
            >
              {team?.name ?? row.team_name ?? `Đội #${row.team_id}`}
            </Link>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.played ?? 0}</td>
      <td className="py-4 px-4 text-center font-bold text-emerald-400 bg-emerald-500/5">{row.won ?? 0}</td>
      <td className="py-4 px-4 text-center font-medium text-gray-400 bg-gray-500/5">{row.drawn ?? 0}</td>
      <td className="py-4 px-4 text-center font-bold text-red-400 bg-red-500/5">{row.lost ?? 0}</td>
      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.goals_for ?? 0}</td>
      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.goals_against ?? 0}</td>
      <td className="py-4 px-4 text-center font-medium text-gray-400">
        {(row.goal_difference ?? 0) > 0 ? `+${row.goal_difference}` : (row.goal_difference ?? 0)}
      </td>
      <td className="py-4 px-6 text-center">
        <span className={`px-3 py-1.5 rounded-lg font-black text-lg ${
          rank <= 3 ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' : 'text-white'
        }`}>
          {row.points ?? 0}
        </span>
      </td>
    </tr>
  );
}
