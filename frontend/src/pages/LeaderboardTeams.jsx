import { useEffect, useState, useMemo } from 'react';
import { Trophy, Users, RefreshCw, ArrowRight, Shield, ChevronDown, Loader2 } from 'lucide-react';
import useTeamStore from '../store/teamStore';
import useSeasonStore from '../store/seasonStore';
// APIs and constants (if any)
import { useShallow } from 'zustand/react/shallow';
import useSeasonTeamStore from '../store/seasonTeamStore';
import useAuthStore from '../store/authStore';
// Shared imports
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton';
import TeamCardSkeleton from '../components/skeletons/TeamCardSkeleton';
import StandingRow from '../components/StandingRow';
import LeaderboardTeamCard from '../components/LeaderboardTeamCard';
import Pagination from '../components/ui/Pagination';
import { groupApi } from '../api/groupApi';
import { seasonApi } from '../api/seasonApi';
import { statisticsApi } from '../api/statisticsApi';
import StandingPlayerRow from '../components/StandingPlayerRow';
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
  const { user } = useAuthStore();
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [activeTab, setActiveTab] = useState('group'); // 'group' or 'knockout'
  const groupedStandings = getStandingsFromCache(selectedSeasonId);
  const isLoadingStandings = standingsLoading[selectedSeasonId] || false;
  const currentStandingsError = standingsError[selectedSeasonId] || null;
  const seasonTeams = getSeasonTeamsFromCache(selectedSeasonId);
  const loadingSeasonTeams = seasonTeamsLoading[selectedSeasonId] || false;
  
  const [seasonGroups, setSeasonGroups] = useState([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);

  const [activeMainTab, setActiveMainTab] = useState('teams'); // 'teams' | 'players'
  const [activeStatTab, setActiveStatTab] = useState('goals'); // 'goals' | 'assists' | 'yellow' | 'red' | 'best' | 'suspended'
  const [playerStats, setPlayerStats] = useState([]);
  const [isPlayerStatsLoading, setIsPlayerStatsLoading] = useState(false);

  const fetchPlayerStats = async (seasonId, statTab) => {
    if (!seasonId) {
      setPlayerStats([]);
      return;
    }
    setIsPlayerStatsLoading(true);
    try {
      let res;
      if (statTab === 'goals') {
        res = await seasonApi.getPlayerStats(seasonId, { sort: 'goals_scored', direction: 'desc', per_page: 50 });
      } else if (statTab === 'assists') {
        res = await statisticsApi.getTopAssists(seasonId, 50);
      } else if (statTab === 'yellow') {
        res = await statisticsApi.getTopYellowCards(seasonId, 50);
      } else if (statTab === 'red') {
        res = await statisticsApi.getTopRedCards(seasonId, 50);
      } else if (statTab === 'best') {
        res = await statisticsApi.getBestPlayers(seasonId, 50);
      } else if (statTab === 'suspended') {
        res = await seasonApi.getSuspendedPlayers(seasonId);
      }
      
      const items = res?.data?.data || res?.data || [];
      setPlayerStats(items);
    } catch (error) {
      console.error("Failed to fetch player stats", error);
      setPlayerStats([]);
    } finally {
      setIsPlayerStatsLoading(false);
    }
  };

  useEffect(() => {
    if (activeMainTab === 'players' && selectedSeasonId) {
      fetchPlayerStats(selectedSeasonId, activeStatTab);
    }
  }, [activeMainTab, activeStatTab, selectedSeasonId]);
  // --- END NEW STATE ---

  useEffect(() => {
    if (selectedSeasonId) {
      const fetchGroups = async () => {
        setIsGroupsLoading(true);
        try {
          const res = await groupApi.listBySeason(selectedSeasonId);
          const payload = typeof res.status === 'boolean' ? res.data : res;
          setSeasonGroups(payload?.groups || []);
        } catch (error) {
          console.error("Failed to fetch groups", error);
          setSeasonGroups([]);
        } finally {
          setIsGroupsLoading(false);
        }
      };
      fetchGroups();
    } else {
      setSeasonGroups([]);
    }
  }, [selectedSeasonId]);

  const isLoading = teamsLoading || seasonsLoading || loadingSeasonTeams || isGroupsLoading;
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
    // Nếu có seasonTeams (có quyền truy cập API hoặc có dữ liệu), lọc theo status 'approved'
    if (seasonTeams.length > 0) {
      const approvedSeasonTeamIds = new Set(
        seasonTeams
          .filter(st => st.status === 'approved' && String(st.season_id) === String(selectedSeasonId))
          .map(st => st.team_id)
      );
      return teams.filter(t => approvedSeasonTeamIds.has(t.id));
    }
    // Guest fallback: Nếu không có seasonTeams (vd: lỗi 401 khi chưa login),
    // cố gắng trích xuất danh sách team_id từ groupedStandings (công khai).
    if (!user) {
      const standingTeamIds = new Set();
      (groupedStandings || []).forEach(group => {
        (group.standings || []).forEach(row => {
          if (row.team_id) standingTeamIds.add(row.team_id);
        });
      });
      if (standingTeamIds.size > 0) {
        return teams.filter(t => standingTeamIds.has(t.id));
      }
      
      // Nếu bảng xếp hạng trống, trả về mảng rỗng thay vì hiển thị toàn bộ đội bóng.
      return [];
    }
    return [];
  }, [teams, seasonTeams, selectedSeasonId, user, groupedStandings]);

  const displayGroups = useMemo(() => {
    if (seasonGroups && seasonGroups.length > 0) {
      return seasonGroups.map(sg => {
        const matchingStandingGroup = (groupedStandings || []).find(g => g.groupId === sg.id);
        
        const standings = (sg.season_teams || []).map(st => {
          const existing = matchingStandingGroup?.standings?.find(row => row.team_id === st.team_id);
          if (existing) return existing;
          
          return {
            team_id: st.team_id,
            played: 0, won: 0, drawn: 0, lost: 0,
            goals_for: 0, goals_against: 0, goal_difference: 0,
            points: 0,
          };
        });

        standings.sort((a, b) => {
          if (b.points !== a.points) return (b.points || 0) - (a.points || 0);
          const gdA = a.goal_difference ?? ((a.goals_for || 0) - (a.goals_against || 0));
          const gdB = b.goal_difference ?? ((b.goals_for || 0) - (b.goals_against || 0));
          if (gdB !== gdA) return gdB - gdA;
          return (b.goals_for || 0) - (a.goals_for || 0);
        });

        return {
          groupId: sg.id,
          groupName: sg.name,
          standings
        };
      });
    }
    return groupedStandings || [];
  }, [seasonGroups, groupedStandings]);

  const overallStandings = useMemo(() => {
    if (!displayGroups || displayGroups.length === 0) return [];
    const allTeams = displayGroups.flatMap(g => g.standings || []);
    // Sắp xếp lại theo PTS, GD, GF
    return allTeams.sort((a, b) => {
      const ptsA = a.points ?? 0;
      const ptsB = b.points ?? 0;
      if (ptsB !== ptsA) return ptsB - ptsA;
      const gdA = a.goal_difference ?? ((a.goals_for || 0) - (a.goals_against || 0));
      const gdB = b.goal_difference ?? ((b.goals_for || 0) - (b.goals_against || 0));
      if (gdB !== gdA) return gdB - gdA;
      const gfA = a.goals_for ?? 0;
      const gfB = b.goals_for ?? 0;
      return gfB - gfA;
    });
  }, [displayGroups]);
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
                  Bảng <span className="text-[#00529C] font-sans font-black">Xếp Hạng</span>
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
          {/* Main Tabs (Teams vs Players) */}
          <div className="flex items-center gap-8 mb-6 border-b border-navy-light px-2">
            <button
              onClick={() => setActiveMainTab('teams')}
              className={`pb-4 text-base md:text-lg font-bold transition-all border-b-2 -mb-px ${
                activeMainTab === 'teams' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              Bảng xếp hạng Đội bóng
            </button>
            <button
              onClick={() => setActiveMainTab('players')}
              className={`pb-4 text-base md:text-lg font-bold transition-all border-b-2 -mb-px ${
                activeMainTab === 'players' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              Thống kê Cá nhân
            </button>
          </div>

          {activeMainTab === 'teams' ? (
            <>
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
              ) : displayGroups.length === 0 ? (
                <div className="bg-navy/80 backdrop-blur-2xl border border-navy-light rounded-3xl p-20 text-center shadow-2xl shadow-black/40">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner mb-5">
                    <Trophy className="w-10 h-10 text-blue-400/50" />
                  </div>
                  <p className="text-xl font-black text-gray-400 mb-2">Chưa có dữ liệu xếp hạng</p>
                  <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                    Mùa giải này chưa được chia bảng đấu hoặc chưa có dữ liệu xếp hạng.
                  </p>
                </div>
              ) : (
                <>
                  {/* BẢNG XẾP HẠNG TỔNG (MAIN BOARD) */}
                  <div className="bg-navy/80 backdrop-blur-2xl border border-navy-light rounded-3xl overflow-hidden shadow-2xl shadow-black/40 mb-12">
                    <div className="px-6 py-4 bg-navy-dark border-b border-navy-light">
                      <h3 className="text-lg font-black text-white">Bảng Xếp Hạng Tổng</h3>
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
                          {overallStandings.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="py-8 text-center text-gray-500 text-sm">Chưa có dữ liệu đội bóng.</td>
                            </tr>
                          ) : (
                            overallStandings.map((row, idx) => (
                              <StandingRow key={row.team_id ?? idx} row={row} idx={idx} teams={teams} />
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* CÁC BẢNG GROUP (MINI CARDS) */}
                  {displayGroups.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                      {displayGroups.map((group, groupIdx) => (
                        <div key={group.groupId || groupIdx} className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col transition-transform hover:-translate-y-1 duration-300">
                          <div className="px-5 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                            <div>
                              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{activeSeason?.name || 'Mùa giải'}</h3>
                              <h4 className="text-base font-black text-gray-900 mt-0.5">{group.groupName || 'Bảng đấu'}</h4>
                            </div>
                            <Trophy className="w-5 h-5 text-gray-300" />
                          </div>
                          <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap min-w-[320px]">
                              <thead className="bg-white text-gray-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                  <th className="py-3 px-4">Đội</th>
                                  <th className="py-3 px-2 text-center" title="Số trận đã đấu">ĐĐ</th>
                                  <th className="py-3 px-2 text-center" title="Thắng">T</th>
                                  <th className="py-3 px-2 text-center" title="Hòa">H</th>
                                  <th className="py-3 px-2 text-center" title="Thua">B</th>
                                  <th className="py-3 px-2 text-center" title="Hiệu số">HS</th>
                                  <th className="py-3 px-4 text-center text-gray-900 font-black">Đ</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {group.standings.length === 0 ? (
                                  <tr>
                                    <td colSpan={7} className="py-6 text-center text-gray-400 text-xs">Trống</td>
                                  </tr>
                                ) : (
                                  group.standings.map((row, idx) => {
                                    const team = teams.find(t => t.id === row.team_id);
                                    const teamName = team?.name ?? row.team_name ?? `Đội ${row.team_id}`;
                                    const initial = teamName.substring(0, 1).toUpperCase();
                                    
                                    const played = row.played ?? row.matches_played ?? 0;
                                    const won = row.won ?? row.wins ?? 0;
                                    const drawn = row.drawn ?? row.draws ?? 0;
                                    const lost = row.lost ?? row.losses ?? 0;
                                    const goalsFor = row.goals_for ?? 0;
                                    const goalsAgainst = row.goals_against ?? 0;
                                    const goalDifference = row.goal_difference ?? (goalsFor - goalsAgainst);
                                    const points = row.points ?? 0;

                                    return (
                                      <tr key={row.team_id ?? idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                          <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-400 w-3">{idx + 1}</span>
                                            <div className="w-6 h-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-600 shrink-0 relative overflow-hidden">
                                              <span className="absolute inset-0 flex items-center justify-center">
                                                {initial}
                                              </span>
                                              {team?.logo && (
                                                <img 
                                                  src={team.logo} 
                                                  alt={teamName} 
                                                  className="w-full h-full object-contain relative z-10" 
                                                  onError={(e) => { e.target.style.display = 'none'; }} 
                                                />
                                              )}
                                            </div>
                                            <span className="text-sm font-bold text-gray-800 truncate max-w-[120px]" title={teamName}>
                                              {teamName}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{played}</td>
                                        <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{won}</td>
                                        <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{drawn}</td>
                                        <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{lost}</td>
                                        <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{goalDifference}</td>
                                        <td className="py-3 px-4 text-center text-sm font-black text-gray-900 bg-gray-50/50">{points}</td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {/* Footer Legend */}
              {displayGroups.length > 0 && !isLoadingStandings && (
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
            </>
          ) : (
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-6 mb-8 border-b border-navy-light px-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <button
                  onClick={() => setActiveStatTab('goals')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${
                    activeStatTab === 'goals' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  Số bàn thắng
                </button>
                <button
                  onClick={() => setActiveStatTab('assists')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${
                    activeStatTab === 'assists' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  Số lần kiến tạo
                </button>
                <button
                  onClick={() => setActiveStatTab('best')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${
                    activeStatTab === 'best' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  Cầu thủ XS
                </button>
                <button
                  onClick={() => setActiveStatTab('yellow')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${
                    activeStatTab === 'yellow' ? 'text-yellow-400 border-yellow-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  Thẻ vàng
                </button>
                <button
                  onClick={() => setActiveStatTab('red')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${
                    activeStatTab === 'red' ? 'text-red-400 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  Thẻ đỏ
                </button>
                <button
                  onClick={() => setActiveStatTab('suspended')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${
                    activeStatTab === 'suspended' ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  Treo giò
                </button>
              </div>

              {/* BẢNG XẾP HẠNG CẦU THỦ */}
              <div className="bg-navy/80 backdrop-blur-2xl border border-navy-light rounded-3xl overflow-hidden shadow-2xl shadow-black/40 mb-12">
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap min-w-[600px]">
                    <thead className="bg-linear-to-r from-navy-dark via-navy to-navy-dark text-white text-[11px] sm:text-xs font-black uppercase tracking-widest border-b border-navy-light">
                      <tr>
                        <th className="py-4 px-6 text-center w-20">Hạng</th>
                        <th className="py-4 px-6">Vận động viên</th>
                        {activeStatTab !== 'suspended' && (
                          <th className="py-4 px-6 text-right">
                            {activeStatTab === 'goals' && 'Số bàn thắng'}
                            {activeStatTab === 'assists' && 'Số lần kiến tạo'}
                            {activeStatTab === 'best' && 'Điểm Rating'}
                            {activeStatTab === 'yellow' && 'Thẻ vàng'}
                            {activeStatTab === 'red' && 'Thẻ đỏ'}
                          </th>
                        )}
                        {activeStatTab === 'suspended' && (
                          <th className="py-4 px-6 text-right">Tình trạng</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-transparent">
                      {isPlayerStatsLoading ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" /></td>
                        </tr>
                      ) : playerStats.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">Chưa có dữ liệu thống kê cầu thủ.</td>
                        </tr>
                      ) : (
                        playerStats.map((row, idx) => (
                          <StandingPlayerRow key={row.id || row.player_id || idx} playerStat={row} rank={idx + 1} activeStatTab={activeStatTab} />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
