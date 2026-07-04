import { Users, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getInitials, AVATAR_COLORS } from '../utils/constants';
import { useEffect } from 'react';
import useTeamStore from '../store/teamStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * LeaderboardTeamCard — Card hiển thị thông tin đội bóng trong trang LeaderboardTeams.
 */
export default function LeaderboardTeamCard({ team, idx }) {
  const { fetchPlayers, cachedPlayers } = useTeamStore(
    useShallow(state => ({
      fetchPlayers: state.fetchPlayers,
      cachedPlayers: state.teamPlayersCache[team.id]?.players,
    }))
  );
  useEffect(() => {
    if (cachedPlayers === undefined) {
      fetchPlayers(team.id, { approval_status: 'approved' }).catch(() => {});
    }
  }, [team.id, cachedPlayers, fetchPlayers]);

  const initial = getInitials(team.name);
  const colorIdx = (team.id ?? idx) % AVATAR_COLORS.length;
  // Ưu tiên count từ API nếu có, không thì lấy từ cache cầu thủ, sau cùng là fallback
  const playerCount = team._count?.team_players ?? team.players_count ?? cachedPlayers?.length ?? team.players?.length ?? '—';

  return (
    <div
      className="bg-navy/80 backdrop-blur-xl border border-navy-light rounded-3xl p-6 shadow-2xl shadow-black/20 hover:shadow-blue-900/20 hover:-translate-y-1.5 hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full group animate-slide-up relative overflow-hidden"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className={`w-16 h-16 shrink-0 rounded-2xl bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-black text-2xl text-white shadow-lg border border-white/10 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300`}>
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-white mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">{team.name}</h3>
          {team.abbreviation && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">{team.abbreviation}</span>
          )}
          {team.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{team.description}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-auto space-y-3 relative z-10">
        <div className="text-sm font-medium text-gray-400 bg-navy-dark/80 border border-navy-light/50 py-2.5 px-3.5 rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-500" /> Cầu thủ</span>
          <strong className="text-white text-base">{playerCount}</strong>
        </div>
        {team.captain_name && (
          <div className="text-sm font-medium text-gray-400 bg-navy-dark/80 border border-navy-light/50 py-2.5 px-3.5 rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500" /> Đội trưởng</span>
            <strong className="text-white truncate ml-2">{team.captain_name}</strong>
          </div>
        )}
        <Link
          to={`/doi-bong/${team.id}`}
          className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-navy border border-navy-light text-blue-400 font-bold rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 uppercase tracking-wider text-xs group/btn shadow-md"
        >
          Xem chi tiết
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
