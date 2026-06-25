import { useEffect } from 'react';
import { Trophy, Users, RefreshCw, ArrowRight, Shield, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import useTeamStore from '../store/teamStore';
import useSeasonStore from '../store/seasonStore';

// ── Helpers ───────────────────────────────────────────────────
const getInitials = (name) =>
  name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

const AVATAR_COLORS = [
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-violet-700',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-red-600 to-rose-800',
  'from-indigo-600 to-blue-800',
  'from-lime-500 to-green-600',
];

// ── Skeletons ─────────────────────────────────────────────────
function LeaderboardSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <tr key={i} className="border-b border-navy-light/50">
          <td className="py-5 px-6"><div className="skeleton h-6 w-8 mx-auto rounded-lg" /></td>
          <td className="py-5 px-6">
            <div className="flex items-center gap-4">
              <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
              <div className="skeleton h-5 w-32 rounded-lg" />
            </div>
          </td>
          {[1,2,3,4,5,6,7,8].map(j => (
            <td key={j} className="py-5 px-4"><div className="skeleton h-5 w-8 mx-auto rounded-lg" /></td>
          ))}
        </tr>
      ))}
    </>
  );
}

function TeamCardSkeleton() {
  return (
    <div className="bg-navy/50 border border-navy-light rounded-3xl p-6 shadow-xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="skeleton w-16 h-16 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-5 w-32 rounded-lg" />
          <div className="skeleton h-4 w-20 rounded-lg" />
          <div className="skeleton h-4 w-24 rounded-lg" />
        </div>
      </div>
      <div className="skeleton h-12 w-full rounded-xl" />
    </div>
  );
}

// ── Standing Row ──────────────────────────────────────────────
function StandingRow({ row, idx, teams }) {
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

// ── Team Card ─────────────────────────────────────────────────
function TeamCard({ team, idx }) {
  const initial = getInitials(team.name);
  const colorIdx = (team.id ?? idx) % AVATAR_COLORS.length;
  const playerCount = team.players_count ?? team.players ?? '—';

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

// ── Page ──────────────────────────────────────────────────────
export default function LeaderboardTeams() {
  // ── Zustand stores ─────────────────────────────────────────
  const {
    teams, isLoading: teamsLoading,
    fetchAll: fetchTeams,
  } = useTeamStore();

  const {
    seasons, isLoading: seasonsLoading,
    fetchAll: fetchSeasons,
  } = useSeasonStore();

  const isLoading = teamsLoading || seasonsLoading;
  const activeSeason = seasons.find(s => s.status === 'ongoing') ?? seasons[0] ?? null;

  useEffect(() => {
    fetchTeams({ sort: 'name', direction: 'asc' });
    fetchSeasons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    fetchTeams({ sort: 'name', direction: 'asc', force: true });
    fetchSeasons({ force: true });
  };

  return (
    <div className="py-12 bg-navy-dark min-h-screen relative overflow-hidden">
      {/* Background ambient lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-4 xl:px-8 relative z-10">

        {/* ─── LEADERBOARD ─────────────────────────────── */}
        <section className="mb-16 lg:mb-24 max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-8 animate-slide-up flex-wrap bg-navy/40 backdrop-blur-md border border-navy-light p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                <Trophy className="w-7 h-7 text-white drop-shadow-md" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                  Bảng <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon italic">Xếp Hạng</span>
                </h2>
                {activeSeason && (
                  <p className="text-gray-400 text-sm mt-1 font-medium">Mùa giải hiện tại: <strong className="text-white">{activeSeason.name}</strong></p>
                )}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors disabled:opacity-50 bg-navy-dark hover:bg-navy-light border border-navy-light px-5 py-3 rounded-xl shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Tải lại dữ liệu</span>
            </button>
          </div>

          <div className="bg-navy/80 backdrop-blur-2xl border border-navy-light rounded-3xl overflow-hidden shadow-2xl shadow-black/40 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                <thead className="bg-linear-to-r from-navy-dark via-navy to-navy-dark text-white text-[11px] sm:text-xs font-black uppercase tracking-widest border-b border-navy-light">
                  <tr>
                    <th className="py-5 px-6 text-center w-20">Hạng</th>
                    <th className="py-5 px-6">Đội Bóng</th>
                    <th className="py-5 px-4 text-center text-gray-400 cursor-help" title="Số trận đã đấu">P</th>
                    <th className="py-5 px-4 text-center text-emerald-400/80 cursor-help" title="Thắng">W</th>
                    <th className="py-5 px-4 text-center text-gray-400 cursor-help" title="Hòa">D</th>
                    <th className="py-5 px-4 text-center text-red-400/80 cursor-help" title="Thua">L</th>
                    <th className="py-5 px-4 text-center text-gray-400 cursor-help" title="Bàn thắng">GF</th>
                    <th className="py-5 px-4 text-center text-gray-400 cursor-help" title="Bàn thua">GA</th>
                    <th className="py-5 px-4 text-center text-gray-400 cursor-help" title="Hiệu số">GD</th>
                    <th className="py-5 px-6 text-center text-blue-400">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-transparent">
                  {isLoading ? (
                    <LeaderboardSkeleton />
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-5">
                          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-amber-500/20 animate-pulse"></div>
                            <Construction className="w-10 h-10 text-amber-400 relative z-10" />
                          </div>
                          <div>
                            <p className="text-xl font-black text-amber-400 mb-2 uppercase tracking-wider">Hệ thống xếp hạng đang được xây dựng</p>
                            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                              Bảng xếp hạng tự động sẽ hiển thị khi API <code className="text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md font-mono text-xs mx-1">GET /seasons/&#123;id&#125;/standings</code> hoàn thiện.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer Legend */}
            <div className="bg-navy-dark/90 px-6 py-4 border-t border-navy-light text-[10px] sm:text-xs text-gray-500 font-semibold flex items-center gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <span className="flex items-center gap-1.5"><strong className="text-gray-300">P:</strong> Played</span>
              <span className="flex items-center gap-1.5"><strong className="text-emerald-400">W:</strong> Won</span>
              <span className="flex items-center gap-1.5"><strong className="text-gray-300">D:</strong> Drawn</span>
              <span className="flex items-center gap-1.5"><strong className="text-red-400">L:</strong> Lost</span>
              <span className="flex items-center gap-1.5"><strong className="text-gray-300">GF:</strong> Goals For</span>
              <span className="flex items-center gap-1.5"><strong className="text-gray-300">GA:</strong> Goals Against</span>
              <span className="flex items-center gap-1.5"><strong className="text-gray-300">GD:</strong> Goal Diff</span>
              <span className="flex items-center gap-1.5"><strong className="text-blue-400">PTS:</strong> Points</span>
            </div>
          </div>
        </section>

        {/* ─── TEAMS ───────────────────────────────────── */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-slide-up flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <Users className="w-6 h-6 text-blue-400 drop-shadow-md" />
              </div>
              Danh Sách Đội Bóng
              {!isLoading && teams.length > 0 && (
                <span className="text-xs font-black text-blue-400 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full ml-2">
                  {teams.length} đội
                </span>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {isLoading ? (
              <>{[1,2,3,4,5,6].map(i => <TeamCardSkeleton key={i} />)}</>
            ) : teams.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 flex flex-col items-center gap-4 bg-navy/30 backdrop-blur-md rounded-3xl border border-navy-light border-dashed">
                <div className="w-20 h-20 rounded-full bg-navy border border-navy-light flex items-center justify-center shadow-inner">
                  <Users className="w-10 h-10 text-gray-600" />
                </div>
                <p className="font-bold text-gray-400 text-lg">Chưa có đội bóng nào trong hệ thống.</p>
              </div>
            ) : (
              teams.map((team, idx) => <TeamCard key={team.id} team={team} idx={idx} />)
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
