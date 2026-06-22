import { useEffect } from 'react';
import { Trophy, Users, WifiOff, RefreshCw, ArrowRight, Shield, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import useTeamStore from '../store/teamStore';
import useSeasonStore from '../store/seasonStore';

// ── Helpers ───────────────────────────────────────────────────
const getInitials = (name) =>
  name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

const AVATAR_COLORS = [
  'from-blue-500 to-cyan-600',
  'from-purple-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-red-500 to-rose-700',
  'from-indigo-500 to-blue-700',
  'from-lime-500 to-green-600',
];

// ── Skeletons ─────────────────────────────────────────────────
function LeaderboardSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <tr key={i}>
          <td className="py-4 px-6"><div className="skeleton h-5 w-8 mx-auto rounded" /></td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="skeleton w-9 h-9 rounded-xl shrink-0" />
              <div className="skeleton h-4 w-28 rounded" />
            </div>
          </td>
          {[1,2,3,4,5,6,7,8].map(j => (
            <td key={j} className="py-4 px-4"><div className="skeleton h-4 w-8 mx-auto rounded" /></td>
          ))}
        </tr>
      ))}
    </>
  );
}

function TeamCardSkeleton() {
  return (
    <div className="bg-navy border border-navy-light rounded-xl p-6 shadow-lg shadow-black/20">
      <div className="flex items-start gap-4 mb-6">
        <div className="skeleton w-16 h-16 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-32 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
      </div>
      <div className="skeleton h-10 w-full rounded-lg" />
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
      className={`hover:bg-navy-dark/60 transition-colors duration-200 animate-fade-in ${
        rank === 1 ? 'bg-yellow-400/5 border-l-2 border-l-yellow-400/60' :
        rank === 2 ? 'bg-slate-400/5 border-l-2 border-l-slate-400/40' :
        rank === 3 ? 'bg-orange-400/5 border-l-2 border-l-orange-400/40' : ''
      }`}
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <td className="py-4 px-6 text-center">
        {rank <= 3 ? (
          <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center font-black text-sm ${
            rank === 1 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' :
            rank === 2 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/50' :
                         'bg-orange-400/20 text-orange-400 border border-orange-400/50'
          }`}>
            {rank}
          </span>
        ) : (
          <span className="font-bold text-gray-400">{rank}</span>
        )}
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-black text-sm text-white shadow-md shrink-0`}>
            {initial}
          </div>
          <div className="min-w-0">
            <Link
              to={`/doi-bong/${row.team_id}`}
              className="font-bold text-white hover:text-neon transition-colors truncate block"
            >
              {team?.name ?? row.team_name ?? `Đội #${row.team_id}`}
            </Link>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.played ?? 0}</td>
      <td className="py-4 px-4 text-center font-bold text-emerald-400">{row.won ?? 0}</td>
      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.drawn ?? 0}</td>
      <td className="py-4 px-4 text-center font-medium text-red-400">{row.lost ?? 0}</td>
      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.goals_for ?? 0}</td>
      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.goals_against ?? 0}</td>
      <td className="py-4 px-4 text-center font-medium text-gray-400">
        {(row.goal_difference ?? 0) > 0 ? `+${row.goal_difference}` : (row.goal_difference ?? 0)}
      </td>
      <td className="py-4 px-6 text-center font-black text-xl text-neon">{row.points ?? 0}</td>
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
      className="bg-navy border border-navy-light rounded-xl p-6 shadow-lg shadow-black/20 hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group animate-slide-up"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-16 h-16 shrink-0 rounded-2xl bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-black text-2xl text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}>
          {initial}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-white mb-1 line-clamp-2">{team.name}</h3>
          {team.abbreviation && (
            <span className="text-xs font-bold uppercase tracking-wider text-neon">{team.abbreviation}</span>
          )}
          {team.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{team.description}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-auto space-y-2.5">
        <div className="text-sm font-medium text-gray-400 bg-navy-dark py-2 px-3 rounded-lg flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-500" /> Cầu thủ</span>
          <strong className="text-white">{playerCount}</strong>
        </div>
        {team.captain_name && (
          <div className="text-sm font-medium text-gray-400 bg-navy-dark py-2 px-3 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-gray-500" /> Đội trưởng</span>
            <strong className="text-white truncate ml-2">{team.captain_name}</strong>
          </div>
        )}
        <Link
          to={`/doi-bong/${team.id}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-blue-600 text-neon font-bold rounded-lg hover:bg-blue-600/10 hover:border-blue-400 transition-all duration-300 uppercase tracking-wider text-sm group"
        >
          Xem chi tiết
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
    <div className="py-8 lg:py-12 bg-navy-dark min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ─── LEADERBOARD ─────────────────────────────── */}
        <section className="mb-12 lg:mb-20 max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-8 animate-slide-up flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center border border-navy-light shadow-lg shadow-black/20">
                <Trophy className="w-6 h-6 text-neon" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase italic tracking-tight">
                  Bảng <span className="text-neon">Xếp Hạng</span>
                </h2>
                {activeSeason && (
                  <p className="text-gray-400 text-sm mt-1">Mùa giải: <strong className="text-white">{activeSeason.name}</strong></p>
                )}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 bg-navy border border-navy-light px-3 py-2 rounded-lg"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Tải lại
            </button>
          </div>

          <div className="bg-navy border border-navy-light rounded-2xl overflow-hidden shadow-lg shadow-black/20 animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-[700px]">
                <thead className="bg-blue-700 text-white text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-center w-16">Hạng</th>
                    <th className="py-4 px-6">Đội Bóng</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Số trận đã đấu">P</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Thắng">W</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Hòa">D</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Thua">L</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Bàn thắng">GF</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Bàn thua">GA</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Hiệu số">GD</th>
                    <th className="py-4 px-6 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-light">
                  {isLoading ? (
                    <LeaderboardSkeleton />
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                            <Construction className="w-7 h-7 text-amber-400" />
                          </div>
                          <div>
                            <p className="font-bold text-amber-400 mb-1">Standings API đang phát triển</p>
                            <p className="text-gray-500 text-sm max-w-sm mx-auto">
                              Bảng xếp hạng sẽ hiển thị khi backend triển khai <code className="text-neon bg-neon/10 px-1.5 py-0.5 rounded text-xs">GET /seasons/&#123;id&#125;/standings</code>
                            </p>
                          </div>
                          {activeSeason && (
                            <p className="text-xs text-gray-600">Mùa giải: <strong className="text-white">{activeSeason.name}</strong></p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-navy-dark px-6 py-3 border-t border-navy-light text-xs text-gray-500 font-medium flex items-center gap-6 overflow-x-auto whitespace-nowrap">
              <span><strong className="text-gray-400">P:</strong> Played</span>
              <span><strong className="text-gray-400">W:</strong> Won</span>
              <span><strong className="text-gray-400">D:</strong> Drawn</span>
              <span><strong className="text-gray-400">L:</strong> Lost</span>
              <span><strong className="text-gray-400">GF:</strong> Goals For</span>
              <span><strong className="text-gray-400">GA:</strong> Goals Against</span>
              <span><strong className="text-gray-400">GD:</strong> Goal Difference</span>
              <span><strong className="text-neon">PTS:</strong> Points</span>
            </div>
          </div>
        </section>

        {/* ─── TEAMS ───────────────────────────────────── */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-slide-up flex-wrap gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase italic tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-navy-light flex items-center justify-center border border-navy-light">
                <Users className="w-5 h-5 text-neon" />
              </span>
              Danh Sách Đội Bóng
              {!isLoading && teams.length > 0 && (
                <span className="text-sm font-bold text-neon bg-neon/10 border border-neon/20 px-3 py-1 rounded-full">
                  {teams.length} đội
                </span>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <>{[1,2,3,4,5,6].map(i => <TeamCardSkeleton key={i} />)}</>
            ) : teams.length === 0 ? (
              <div className="col-span-3 py-16 flex flex-col items-center gap-3 text-gray-400">
                <Users className="w-12 h-12 text-gray-600" />
                <p className="font-semibold">Chưa có đội bóng nào trong hệ thống.</p>
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
