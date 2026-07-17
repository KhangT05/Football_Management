import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, RefreshCw, ArrowRight, Shield, ChevronDown, Loader2 } from 'lucide-react';
import useTeamStore from '../store/teamStore';
import useSeasonStore from '../store/seasonStore';
import { useShallow } from 'zustand/react/shallow';
import useAuthStore from '../store/authStore';
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton';
import TeamCardSkeleton from '../components/skeletons/TeamCardSkeleton';
import StandingRow from '../components/StandingRow';
import LeaderboardTeamCard from '../components/LeaderboardTeamCard';
import Pagination from '../components/ui/Pagination';
import { groupApi } from '../api/groupApi';
import { seasonApi } from '../api/seasonApi';
import { knockoutApi } from '../api/knockoutApi';
import { matchApi } from '../api/matchApi';
import axiosClient from '../api/axiosClient';
import StandingPlayerRow from '../components/StandingPlayerRow';
import PublicBracketView from '../components/PublicBracketView';
import { useSeasonTeams } from '../queries/useSeasonTeamQueries';
// axiosClient interceptor luôn unwrap 1 lớp axios envelope, trả về
// ApiResponseShape { status, message, data, timestamp }. Payload thật
// luôn nằm ở .data.
const unwrap = (res) => res?.data ?? res;

const MATCH_DONE_STATUSES = new Set(['finished', 'forfeited']);

// FIX: PhaseStatus.locked (BE: KnockoutService.confirmBracket()) là trạng
// thái "đã xác nhận" — dùng để hiện badge trên selector, mirror đúng logic
// isBracketConfirmedStatus() bên KnockoutUI.jsx.
const isBracketConfirmedStatus = (status) => status === 'locked';

// ── Page ──────────────────────────────────────────────────────
export default function LeaderboardTeams() {
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



  const { user } = useAuthStore();
  const [selectedSeasonId, setSelectedSeasonId] = useState('');

  const {
    data: seasonTeams = [],
    isLoading: loadingSeasonTeams,
    refetch: refetchSeasonTeams,
  } = useSeasonTeams(selectedSeasonId);

  const [activeTab, setActiveTab] = useState('group');
  const groupedStandings = getStandingsFromCache(selectedSeasonId);
  const isLoadingStandings = standingsLoading[selectedSeasonId] || false;
  const currentStandingsError = standingsError[selectedSeasonId] || null;

  const [seasonGroups, setSeasonGroups] = useState([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);

  // ── Knockout bracket (public, read-only) ──────────────────────────────
  // FIX: trước đây bracketData/fetchBracket tồn tại nhưng không có gì gọi
  // fetchBracket() — không có phaseId nào trong scope. Giờ fetch danh sách
  // phase knockout của season (từ seasonApi.getById, giống KnockoutUI),
  // auto-chọn phase mới nhất, và fetch lại bracket mỗi khi đổi phase.
  const [knockoutPhases, setKnockoutPhases] = useState([]);
  const [selectedKnockoutPhaseId, setSelectedKnockoutPhaseId] = useState('');
  const [bracketData, setBracketData] = useState(null);
  const [loadingBracket, setLoadingBracket] = useState(false);

  const fetchBracket = async (phaseId) => {
    if (!phaseId) {
      setBracketData(null);
      return;
    }
    setLoadingBracket(true);
    try {
      const res = await knockoutApi.getBracket(phaseId);
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      setBracketData(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.log('Chưa có bracket hoặc lỗi:', err);
      setBracketData(null);
    } finally {
      setLoadingBracket(false);
    }
  };

  // Fetch danh sách phase knockout mỗi khi đổi season; auto-chọn phase mới
  // nhất (id lớn nhất). Season public không cần khôi phục lựa chọn qua
  // sessionStorage như KnockoutUI (đây là trang xem, không phải trang thao
  // tác — chọn lại phase mới nhất mỗi lần vào trang là hành vi hợp lý hơn).
  useEffect(() => {
    if (!selectedSeasonId) {
      setKnockoutPhases([]);
      setSelectedKnockoutPhaseId('');
      setBracketData(null);
      return;
    }
    const fetchKnockoutPhases = async () => {
      try {
        const res = await matchApi.getScheduleBySeason(selectedSeasonId);
        const scheduleRes = typeof res?.status === 'boolean' ? res.data : res;
        const matches = Array.isArray(scheduleRes?.data) ? scheduleRes.data : [];

        const knockoutPhaseIds = new Set();
        matches.forEach(m => {
          if (m.phase_id && !m.group_id) {
            knockoutPhaseIds.add(m.phase_id);
          }
        });

        if (knockoutPhaseIds.size > 0) {
          const phases = Array.from(knockoutPhaseIds).map(id => ({
            id,
            name: `Vòng loại trực tiếp`,
            format: 'knockout'
          }));
          setKnockoutPhases(phases);
          const latest = [...phases].sort((a, b) => b.id - a.id)[0];
          setSelectedKnockoutPhaseId(latest.id);
        } else {
          setKnockoutPhases([]);
          setSelectedKnockoutPhaseId('');
          setBracketData(null);
        }
      } catch (error) {
        console.error('Failed to fetch knockout phases', error);
        setKnockoutPhases([]);
        setSelectedKnockoutPhaseId('');
        setBracketData(null);
      }
    };
    fetchKnockoutPhases();
  }, [selectedSeasonId]);

  useEffect(() => {
    if (selectedKnockoutPhaseId) {
      fetchBracket(selectedKnockoutPhaseId);
    }
  }, [selectedKnockoutPhaseId]);

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
      if (statTab === 'suspended') {
        const res = await seasonApi.getSuspendedPlayers(seasonId);
        const payload = unwrap(res);
        setPlayerStats(Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []));
        return;
      }

      // Instead of using statisticsApi which crashes due to `player.name` not existing in Prisma schema,
      // and filters by `gt: 0` which doesn't work with seed data, we use the standing service's player-stats.
      const res = await axiosClient.get(`/seasons/${seasonId}/player-stats`, { params: { per_page: 1000 } });
      const payload = unwrap(res);
      let rawItems = [];
      if (Array.isArray(payload)) {
        rawItems = payload;
      } else if (payload && Array.isArray(payload.data)) {
        rawItems = payload.data;
      }

      let allPlayers = rawItems.map((r) => ({
        player_id: r.player_id,
        player_name: r.player?.user?.name || 'Unknown',
        team_id: r.team_id,
        team_name: r.team?.name || 'Unknown',
        goals: r.goals_scored || 0,
        assists: r.assists || 0,
        yellow: r.yellow_cards || 0,
        red: r.red_cards || 0,
        score: ((r.goals_scored || 0) * 4) + ((r.assists || 0) * 3) + ((r.yellow_cards || 0) * -1) + ((r.red_cards || 0) * -3),
        matches_played: r.matches_played || 0,
      }));

      if (statTab === 'goals') {
        allPlayers = allPlayers.sort((a, b) => b.goals - a.goals).map(p => ({ ...p, value: p.goals }));
      } else if (statTab === 'assists') {
        allPlayers = allPlayers.sort((a, b) => b.assists - a.assists).map(p => ({ ...p, value: p.assists }));
      } else if (statTab === 'yellow') {
        allPlayers = allPlayers.sort((a, b) => b.yellow - a.yellow).map(p => ({ ...p, value: p.yellow }));
      } else if (statTab === 'red') {
        allPlayers = allPlayers.sort((a, b) => b.red - a.red).map(p => ({ ...p, value: p.red }));
      } else if (statTab === 'best') {
        allPlayers = allPlayers.sort((a, b) => b.score - a.score || a.matches_played - b.matches_played).map(p => ({ ...p, value: p.score }));
      }

      setPlayerStats(allPlayers);
    } catch (error) {
      console.error('Failed to fetch player stats', error);
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

  useEffect(() => {
    if (selectedSeasonId) {
      const fetchGroups = async () => {
        setIsGroupsLoading(true);
        try {
          const res = await groupApi.listBySeason(selectedSeasonId);
          const payload = unwrap(res);
          setSeasonGroups(payload?.groups || []);
        } catch (error) {
          console.error('Failed to fetch groups', error);
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
  const activeSeason = seasons.find(s => String(s.id) === String(selectedSeasonId)) ?? null;

  useEffect(() => {
    fetchTeams({ sort: 'name', direction: 'asc' });
    fetchSeasons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  useEffect(() => {
    if (selectedSeasonId) {
      fetchStandings(selectedSeasonId);
      if (selectedSeasonId) refetchSeasonTeams();
      if (teams.length === 0) {
        fetchPublicTeamsBySeason(selectedSeasonId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeasonId]);

  const filteredTeams = useMemo(() => {
    if (!selectedSeasonId) return teams;
    if (seasonTeams.length > 0) {
      const approvedSeasonTeamIds = new Set(
        seasonTeams
          .filter(st => st.status === 'approved' && String(st.season_id) === String(selectedSeasonId))
          .map(st => st.team_id)
      );
      return teams.filter(t => approvedSeasonTeamIds.has(t.id));
    }
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

  const [playerCurrentPage, setPlayerCurrentPage] = useState(1);
  const [playerItemsPerPage, setPlayerItemsPerPage] = useState(10);
  const handlePlayerItemsPerPageChange = (newLimit) => {
    setPlayerItemsPerPage(newLimit);
    setPlayerCurrentPage(1);
  };

  const [prevSeasonId, setPrevSeasonId] = useState(selectedSeasonId);
  if (prevSeasonId !== selectedSeasonId) {
    setPrevSeasonId(selectedSeasonId);
    setCurrentPage(1);
    setPlayerCurrentPage(1);
  }

  const [prevStatTab, setPrevStatTab] = useState(activeStatTab);
  if (prevStatTab !== activeStatTab) {
    setPrevStatTab(activeStatTab);
    setPlayerCurrentPage(1);
  }
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedTeams = filteredTeams.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const playerTotalPages = Math.ceil(playerStats.length / playerItemsPerPage) || 1;
  const safePlayerPage = Math.min(playerCurrentPage, Math.max(1, playerTotalPages));
  const paginatedPlayerStats = playerStats.slice((safePlayerPage - 1) * playerItemsPerPage, safePlayerPage * playerItemsPerPage);
  const handleRefresh = () => {
    fetchTeams({ sort: 'name', direction: 'asc', force: true });
    fetchSeasons({ force: true });
    if (selectedSeasonId) fetchStandings(selectedSeasonId);
    if (selectedKnockoutPhaseId) fetchBracket(selectedKnockoutPhaseId);
  };
  return (
    <div className="py-12 bg-navy-dark min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]"></div>
      </div>
      <div className="container mx-auto px-4 xl:px-8 relative z-10">
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
                      {s.name}{s.status === 'ongoing' ? ' (đang diễn)' : s.status === 'registration_open' ? ' (mở đk)' : ''}
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
          <div className="flex items-center gap-8 mb-6 border-b border-navy-light px-2">
            <button
              onClick={() => setActiveMainTab('teams')}
              className={`pb-4 text-base md:text-lg font-bold transition-all border-b-2 -mb-px ${activeMainTab === 'teams' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
            >
              Bảng xếp hạng Đội bóng
            </button>
            <button
              onClick={() => setActiveMainTab('players')}
              className={`pb-4 text-base md:text-lg font-bold transition-all border-b-2 -mb-px ${activeMainTab === 'players' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
            >
              Bảng xếp hạng cầu thủ
            </button>
          </div>

          {activeMainTab === 'teams' ? (
            <>
              <div className="flex items-center gap-8 mb-8 border-b border-navy-light px-2">
                <button
                  onClick={() => setActiveTab('group')}
                  className={`pb-4 text-sm md:text-base font-bold transition-all border-b-2 -mb-px ${activeTab === 'group' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                  Vòng Đấu bảng
                </button>
                <button
                  onClick={() => setActiveTab('knockout')}
                  className={`pb-4 text-sm md:text-base font-bold transition-all border-b-2 -mb-px ${activeTab === 'knockout' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                  Vòng loại trực tiếp
                </button>
              </div>
              {activeTab === 'knockout' ? (
                <div className="space-y-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
                  {knockoutPhases.length > 1 && (
                    <div className="bg-navy/40 backdrop-blur-md border border-navy-light p-4 rounded-2xl">
                      <label className="block text-xs font-bold text-gray-400 mb-1">Xem theo vòng</label>
                      <select
                        value={selectedKnockoutPhaseId}
                        onChange={e => setSelectedKnockoutPhaseId(Number(e.target.value))}
                        className="px-3 py-2 bg-navy-dark border border-navy-light rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 w-full sm:w-auto"
                      >
                        {knockoutPhases.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}{isBracketConfirmedStatus(p.status) ? ' (đã xác nhận)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="bg-navy border border-navy-light rounded-xl p-5 overflow-x-auto">
                    {loadingBracket ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
                      </div>
                    ) : Array.isArray(bracketData) && bracketData.length > 0 ? (
                      <PublicBracketView slots={bracketData} teams={teams} />
                    ) : (
                      <div className="text-center py-16">
                        <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 font-bold">Chưa có dữ liệu sơ đồ knockout</p>
                        <p className="text-gray-500 text-sm mt-1">Mùa giải này chưa tạo vòng loại trực tiếp.</p>
                      </div>
                    )}
                  </div>
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

                      {displayGroups.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                          {displayGroups.map((group, groupIdx) => (
                            <div key={group.groupId || groupIdx} className="bg-navy rounded-3xl overflow-hidden shadow-xl border border-navy-light flex flex-col transition-transform hover:-translate-y-1 duration-300">
                              <div className="px-5 py-4 bg-navy-dark/80 border-b border-navy-light flex items-center justify-between">
                                <div>
                                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{activeSeason?.name || 'Mùa giải'}</h3>
                                  <h4 className="text-base font-black text-white mt-0.5">{group.groupName || 'Bảng đấu'}</h4>
                                </div>
                                <Trophy className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left whitespace-nowrap min-w-[320px]">
                                  <thead className="bg-navy-dark text-gray-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border-b border-navy-light">
                                    <tr>
                                      <th className="py-3 px-4">Đội</th>
                                      <th className="py-3 px-2 text-center" title="Số trận đã đấu">ĐĐ</th>
                                      <th className="py-3 px-2 text-center" title="Thắng">T</th>
                                      <th className="py-3 px-2 text-center" title="Hòa">H</th>
                                      <th className="py-3 px-2 text-center" title="Thua">B</th>
                                      <th className="py-3 px-2 text-center" title="Hiệu số">HS</th>
                                      <th className="py-3 px-4 text-center text-white font-black">Đ</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-navy-light">
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
                                          <tr key={row.team_id ?? idx} className="hover:bg-navy-light/50 transition-colors">
                                            <td className="py-3 px-4">
                                              <Link to={`/doi-bong/${row.team_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                                <span className="text-xs font-bold text-gray-400 w-3">{idx + 1}</span>
                                                <div className="w-6 h-6 rounded border border-navy-light bg-navy-dark flex items-center justify-center text-[10px] font-black text-gray-300 shrink-0 relative overflow-hidden">
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
                                                <span className="text-sm font-bold text-white hover:text-blue-400 hover:underline truncate max-w-[120px]" title={teamName}>
                                                  {teamName}
                                                </span>
                                              </Link>
                                            </td>
                                            <td className="py-3 px-2 text-center text-xs text-gray-300 font-medium">{played}</td>
                                            <td className="py-3 px-2 text-center text-xs text-gray-300 font-medium">{won}</td>
                                            <td className="py-3 px-2 text-center text-xs text-gray-300 font-medium">{drawn}</td>
                                            <td className="py-3 px-2 text-center text-xs text-gray-300 font-medium">{lost}</td>
                                            <td className="py-3 px-2 text-center text-xs text-gray-300 font-medium">{goalDifference}</td>
                                            <td className="py-3 px-4 text-center text-sm font-black text-white bg-navy-dark/50">{points}</td>
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
              <div className="flex items-center gap-6 mb-8 border-b border-navy-light px-2 whitespace-nowrap scrollbar-hide">
                <button
                  onClick={() => setActiveStatTab('goals')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${activeStatTab === 'goals' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                  Số bàn thắng
                </button>
                <button
                  onClick={() => setActiveStatTab('assists')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${activeStatTab === 'assists' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                  Số lần kiến tạo
                </button>
                <button
                  onClick={() => setActiveStatTab('best')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${activeStatTab === 'best' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                  Cầu thủ XS
                </button>
                <button
                  onClick={() => setActiveStatTab('yellow')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${activeStatTab === 'yellow' ? 'text-yellow-400 border-yellow-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                  Thẻ vàng
                </button>
                <button
                  onClick={() => setActiveStatTab('red')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${activeStatTab === 'red' ? 'text-red-400 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                  Thẻ đỏ
                </button>
                <button
                  onClick={() => setActiveStatTab('suspended')}
                  className={`pb-4 text-sm font-bold transition-all border-b-2 -mb-px ${activeStatTab === 'suspended' ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                  Treo giò
                </button>
              </div>

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
                        paginatedPlayerStats.map((row, idx) => {
                          const actualRank = (safePlayerPage - 1) * playerItemsPerPage + idx + 1;
                          return <StandingPlayerRow key={row.player_id ?? idx} playerStat={row} rank={actualRank} activeStatTab={activeStatTab} />
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {playerTotalPages > 1 && (
                <div className="mt-8 mb-4 flex justify-center">
                  <Pagination
                    currentPage={safePlayerPage}
                    totalPages={playerTotalPages}
                    onPageChange={setPlayerCurrentPage}
                    itemsPerPage={playerItemsPerPage}
                    onItemsPerPageChange={handlePlayerItemsPerPageChange}
                  />
                </div>
              )}
            </div>
          )}
        </section>
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
              <>{[1, 2, 3, 4, 5, 6].map(i => <TeamCardSkeleton key={i} />)}</>
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