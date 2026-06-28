import { useEffect, useState, useMemo } from 'react';
import { Trophy, Users, RefreshCw, ArrowRight, Shield, ChevronDown, Loader2 } from 'lucide-react';
import useTeamStore from '../store/teamStore';
import useSeasonStore from '../store/seasonStore';
// APIs and constants (if any)

import { useShallow } from 'zustand/react/shallow';
import useSeasonTeamStore from '../store/seasonTeamStore';

// Shared imports
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton';
import TeamCardSkeleton from '../components/skeletons/TeamCardSkeleton';
import StandingRow from '../components/StandingRow';
import LeaderboardTeamCard from '../components/LeaderboardTeamCard';
import Pagination from '../components/ui/Pagination';

// ── Page ──────────────────────────────────────────────────────
export default function LeaderboardTeams() {
  // ── Zustand stores ─────────────────────────────────────────
  const { teams, isLoading: teamsLoading, fetchAll: fetchTeams, fetchPublicTeamsBySeason } = useTeamStore(
    useShallow((state) => ({
      teams: state.teams,
      isLoading: state.isLoading,
      fetchAll: state.fetchAll,
      fetchPublicTeamsBySeason: state.fetchPublicTeamsBySeason,
    }))
  );

  const { seasons, isLoading: seasonsLoading, fetchAll: fetchSeasons, fetchStandings, standingsLoading, standingsError, getStandingsFromCache } = useSeasonStore(
    useShallow((state) => ({
      seasons: state.seasons,
      isLoading: state.isLoading,
      fetchAll: state.fetchAll,
      fetchStandings: state.fetchStandings,
      standingsLoading: state.standingsLoading,
      standingsError: state.standingsError,
      getStandingsFromCache: state.getStandingsFromCache,
    }))
  );

  const { fetchSeasonTeams, loadingSeasons: seasonTeamsLoading, getSeasonTeamsFromCache } = useSeasonTeamStore(
    useShallow((state) => ({
      fetchSeasonTeams: state.fetchSeasonTeams,
      loadingSeasons: state.loadingSeasons,
      getSeasonTeamsFromCache: state.getSeasonTeamsFromCache,
    }))
  );

  // ── Standings state ────────────────────────────────────────
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [activeTab, setActiveTab] = useState('group'); // 'group' or 'knockout'

  const groupedStandings = getStandingsFromCache(selectedSeasonId);
  const isLoadingStandings = standingsLoading[selectedSeasonId] || false;
  const currentStandingsError = standingsError[selectedSeasonId] || null;

  const seasonTeams = getSeasonTeamsFromCache(selectedSeasonId);
  const loadingSeasonTeams = seasonTeamsLoading[selectedSeasonId] || false;

  const isLoading = teamsLoading || seasonsLoading || loadingSeasonTeams;

  // Removed auto-select logic to default to All/Empty
  const activeSeason = seasons.find(s => String(s.id) === String(selectedSeasonId)) ?? null;

  useEffect(() => {
    fetchTeams({ sort: 'name', direction: 'asc' });
    fetchSeasons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-select latest season on mount
  useEffect(() => {
    if (!selectedSeasonId && seasons?.length > 0) {
      const ongoing = seasons.find(s => s.status === 'ongoing');
      const registering = seasons.find(s => s.status === 'registration_open');
      setTimeout(() => {
        if (ongoing) {
          setSelectedSeasonId(String(ongoing.id));
        } else if (registering) {
          setSelectedSeasonId(String(registering.id));
        } else {
          const latest = [...seasons].sort((a, b) => b.id - a.id)[0];
          setSelectedSeasonId(String(latest.id));
        }
      }, 0);
    }
  }, [seasons, selectedSeasonId]);
  // Khi season thay đổi: fetch standings mới
  useEffect(() => {
    if (selectedSeasonId) {
      fetchStandings(selectedSeasonId);
      fetchSeasonTeams(selectedSeasonId);
      if (teams.length === 0) {
        fetchPublicTeamsBySeason(selectedSeasonId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeasonId]);

  const filteredTeams = useMemo(() => {
    if (!selectedSeasonId) return teams;
    if (seasonTeams.length === 0) return teams; // Guest fallback
    const approvedSeasonTeamIds = new Set(seasonTeams.filter(st => st.status === 'approved').map(st => st.team_id));
    return teams.filter(t => approvedSeasonTeamIds.has(t.id));
  }, [teams, seasonTeams, selectedSeasonId]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const [prevSeasonId, setPrevSeasonId] = useState(selectedSeasonId);
  if (prevSeasonId !== selectedSeasonId) {
    setPrevSeasonId(selectedSeasonId);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTeams = filteredTeams.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

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
                disabled={isLoading || isLoadingStandings}
                className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors disabled:opacity-50 bg-navy-dark hover:bg-navy-light border border-navy-light px-5 py-3 rounded-xl shadow-md"
              >
                {isLoadingStandings ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
                <span className="hidden sm:inline">Tải lại</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 mb-8 border-b border-navy-light px-2">
            <button
              onClick={() => setActiveTab('group')}
              className={`pb-4 text-sm md:text-base font-bold transition-all border-b-2 -mb-px ${
                activeTab === 'group' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              Vòng Đấu bảng
            </button>
            <button
              onClick={() => setActiveTab('knockout')}
              className={`pb-4 text-sm md:text-base font-bold transition-all border-b-2 -mb-px ${
                activeTab === 'knockout' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              Vòng loại trực tiếp
            </button>
          </div>

          {activeTab === 'knockout' ? (
            <div className="bg-navy/40 backdrop-blur-md border border-navy-light p-16 rounded-3xl text-center">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">Vòng loại trực tiếp</h3>
              <p className="text-gray-500">Sơ đồ đấu loại trực tiếp sẽ được cập nhật khi có dữ liệu.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              {isLoadingStandings || isLoading ? (
                <div className="bg-navy/80 backdrop-blur-2xl border border-navy-light rounded-3xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                      <tbody className="divide-y divide-transparent">
                        <LeaderboardSkeleton />
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : currentStandingsError ? (
                <div className="bg-navy/80 backdrop-blur-2xl border border-navy-light rounded-3xl p-16 text-center">
                  <p className="text-red-400 font-bold mb-4">{currentStandingsError}</p>
                  <button onClick={() => fetchStandings(selectedSeasonId, { force: true })} className="text-sm text-blue-400 hover:text-blue-300 font-bold underline">Thử lại</button>
                </div>
              ) : groupedStandings.length === 0 ? (
                <div className="bg-navy/80 backdrop-blur-2xl border border-navy-light rounded-3xl p-20 text-center shadow-2xl shadow-black/40">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner mb-5">
                    <Trophy className="w-10 h-10 text-blue-400/50" />
                  </div>
                  <p className="text-xl font-black text-gray-400 mb-2">Chưa có dữ liệu xếp hạng</p>
                  <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                    Bảng xếp hạng sẽ được cập nhật khi các trận đấu bắt đầu có kết quả.
                  </p>
                </div>
              ) : (
                groupedStandings.map((group, groupIdx) => (
                  <div key={group.groupId || groupIdx} className="bg-navy/80 backdrop-blur-2xl border border-navy-light rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                    <div className="px-6 py-4 bg-navy-dark border-b border-navy-light">
                      <h3 className="text-lg font-black text-white">{group.groupName || 'Bảng đấu'}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                        <thead className="bg-linear-to-r from-navy-dark via-navy to-navy-dark text-white text-[11px] sm:text-xs font-black uppercase tracking-widest border-b border-navy-light">
                          <tr>
                            <th className="py-4 px-6 text-center w-20">Hạng</th>
                            <th className="py-4 px-6">Đội Bóng</th>
                            <th className="py-4 px-4 text-center text-gray-400 cursor-help" title="Số trận đã đấu">P</th>
                            <th className="py-4 px-4 text-center text-emerald-400/80 cursor-help" title="Thắng">W</th>
                            <th className="py-4 px-4 text-center text-gray-400 cursor-help" title="Hòa">D</th>
                            <th className="py-4 px-4 text-center text-red-400/80 cursor-help" title="Thua">L</th>
                            <th className="py-4 px-4 text-center text-gray-400 cursor-help" title="Bàn thắng">GF</th>
                            <th className="py-4 px-4 text-center text-gray-400 cursor-help" title="Bàn thua">GA</th>
                            <th className="py-4 px-4 text-center text-gray-400 cursor-help" title="Hiệu số">GD</th>
                            <th className="py-4 px-6 text-center text-blue-400">PTS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-transparent">
                          {group.standings.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="py-8 text-center text-gray-500 text-sm">Chưa có đội nào trong bảng này.</td>
                            </tr>
                          ) : (
                            group.standings.map((row, idx) => (
                              <StandingRow key={row.team_id ?? idx} row={row} idx={idx} teams={teams} />
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
              
              {/* Footer Legend */}
              {groupedStandings.length > 0 && !isLoadingStandings && (
                <div className="bg-navy-dark/90 px-6 py-4 border border-navy-light rounded-2xl text-[10px] sm:text-xs text-gray-500 font-semibold flex items-center gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  <span className="flex items-center gap-1.5"><strong className="text-gray-300">P:</strong> Played</span>
                  <span className="flex items-center gap-1.5"><strong className="text-emerald-400">W:</strong> Won</span>
                  <span className="flex items-center gap-1.5"><strong className="text-gray-300">D:</strong> Drawn</span>
                  <span className="flex items-center gap-1.5"><strong className="text-red-400">L:</strong> Lost</span>
                  <span className="flex items-center gap-1.5"><strong className="text-gray-300">GF:</strong> Goals For</span>
                  <span className="flex items-center gap-1.5"><strong className="text-gray-300">GA:</strong> Goals Against</span>
                  <span className="flex items-center gap-1.5"><strong className="text-gray-300">GD:</strong> Goal Diff</span>
                  <span className="flex items-center gap-1.5"><strong className="text-blue-400">PTS:</strong> Points</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ─── TEAMS ───────────────────────────────────── */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-slide-up flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <Users className="w-6 h-6 text-blue-400 drop-shadow-md" />
              </div>
              Danh Sách Đội Bóng
              {!isLoading && filteredTeams.length > 0 && (
                <span className="text-xs font-black text-blue-400 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full ml-2">
                  {filteredTeams.length} đội
                </span>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {isLoading ? (
              <>{[1,2,3,4,5,6].map(i => <TeamCardSkeleton key={i} />)}</>
            ) : filteredTeams.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 flex flex-col items-center gap-4 bg-navy/30 backdrop-blur-md rounded-3xl border border-navy-light border-dashed">
                <div className="w-20 h-20 rounded-full bg-navy border border-navy-light flex items-center justify-center shadow-inner">
                  <Users className="w-10 h-10 text-gray-600" />
                </div>
                <p className="font-bold text-gray-400 text-lg">
                  {selectedSeasonId ? 'Chưa có đội bóng nào tham gia mùa giải này.' : 'Chưa có đội bóng nào trong hệ thống.'}
                </p>
              </div>
            ) : (
              paginatedTeams.map((team, idx) => <LeaderboardTeamCard key={team.id} team={team} idx={idx} />)
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
