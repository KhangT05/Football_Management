import { useEffect, useState } from 'react';
import { Trophy, Users, RefreshCw, ArrowRight, Shield, ChevronDown, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useTeamStore from '../store/teamStore';
import useSeasonStore from '../store/seasonStore';
import { seasonApi } from '../api';

// Shared imports
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton';
import TeamCardSkeleton from '../components/skeletons/TeamCardSkeleton';
import StandingRow from '../components/StandingRow';
import LeaderboardTeamCard from '../components/LeaderboardTeamCard';

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

  // ── Standings state ────────────────────────────────────────
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [standings, setStandings] = useState([]);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [standingsError, setStandingsError] = useState(null);

  const isLoading = teamsLoading || seasonsLoading;

  // Removed auto-select logic to default to All/Empty
  const activeSeason = seasons.find(s => String(s.id) === String(selectedSeasonId)) ?? null;

  const fetchStandings = async (seasonId) => {
    if (!seasonId) { setStandings([]); return; }
    setStandingsLoading(true);
    setStandingsError(null);
    try {
      const res = await seasonApi.getStandings(seasonId);
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      const data = Array.isArray(payload?.data) ? payload.data :
                   Array.isArray(payload) ? payload : [];
      setStandings(data);
    } catch (err) {
      setStandingsError(err?.response?.data?.message || 'Không thể tải bảng xếp hạng.');
      setStandings([]);
    } finally {
      setStandingsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams({ sort: 'name', direction: 'asc' });
    fetchSeasons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Khi season thay đổi: fetch standings mới
  useEffect(() => {
    if (selectedSeasonId) fetchStandings(selectedSeasonId);
    else setStandings([]);
  }, [selectedSeasonId]);

  const handleRefresh = () => {
    fetchTeams({ sort: 'name', direction: 'asc', force: true });
    fetchSeasons({ force: true });
    if (selectedSeasonId) fetchStandings(selectedSeasonId);
  };

  return (
    <div className="py-12 bg-navy-dark min-h-screen relative">
      {/* Background ambient lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]"></div>
      </div>

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
                  <p className="text-gray-400 text-sm mt-1 font-medium">Mùa giải: <strong className="text-white">{activeSeason.name}</strong></p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <select
                  value={selectedSeasonId}
                  onChange={e => setSelectedSeasonId(e.target.value)}
                  disabled={seasonsLoading}
                  className="pl-4 pr-9 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-blue-500 text-sm appearance-none disabled:opacity-60 cursor-pointer"
                >
                  <option value="">-- Chọn mùa giải --</option>
                  {seasons.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}{s.status === 'ongoing' ? ' 🔴' : s.status === 'registration_open' ? ' 📋' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading || standingsLoading}
                className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors disabled:opacity-50 bg-navy-dark hover:bg-navy-light border border-navy-light px-5 py-3 rounded-xl shadow-md"
              >
                {standingsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
                <span className="hidden sm:inline">Tải lại</span>
              </button>
            </div>
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
                  {standingsLoading || isLoading ? (
                    <LeaderboardSkeleton />
                  ) : standingsError ? (
                    <tr>
                      <td colSpan={10} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <p className="text-red-400 font-bold">{standingsError}</p>
                          <button onClick={() => fetchStandings(selectedSeasonId)} className="text-sm text-blue-400 hover:text-blue-300 font-bold underline">Thử lại</button>
                        </div>
                      </td>
                    </tr>
                  ) : standings.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-5">
                          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
                            <Trophy className="w-10 h-10 text-blue-400/50" />
                          </div>
                          <div>
                            <p className="text-xl font-black text-gray-400 mb-2">Chưa có dữ liệu xếp hạng</p>
                            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                              Bảng xếp hạng sẽ được cập nhật khi các trận đấu bắt đầu có kết quả.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    standings.map((row, idx) => (
                      <StandingRow key={row.team_id ?? idx} row={row} idx={idx} teams={teams} />
                    ))
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
              teams.map((team, idx) => <LeaderboardTeamCard key={team.id} team={team} idx={idx} />)
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
