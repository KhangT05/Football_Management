import { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Trophy, WifiOff, RefreshCw, ChevronDown, Users, Filter, X, LayoutGrid, GitBranch } from 'lucide-react';
import useScheduleStore from '../store/scheduleStore';
import useSeasonStore from '../store/seasonStore';
import useTeamStore from '../store/teamStore';
import useVenueStore from '../store/venueStore';
import MatchModal from '../components/MatchModal';
import StatusBadge from '../components/ui/StatusBadge';
import MatchRowSkeleton from '../components/skeletons/MatchRowSkeleton';
import ScheduleMatchCard from '../components/schedule/ScheduleMatchCard';
import Pagination from '../components/ui/Pagination';
import { useShallow } from 'zustand/react/shallow';
import { groupApi } from '../api/groupApi';
// GIẢ ĐỊNH: knockoutApi tồn tại ở '../api/knockoutApi' với method
// getBracket(seasonId) trả về { rounds: [{ round, phaseName, matches: [...] }] }
// hoặc null/404 nếu season chưa có phase knockout. Đây chỉ là suy đoán dựa
// theo pattern knockoutApi.generateBracket(seasonId, payload) đã thấy trước
// — CHƯA xác nhận được shape thật vì không có source file knockoutApi.
// Nếu request fail hoặc shape khác, section bracket tự ẩn (không crash trang).
import { knockoutApi } from '../api/knockoutApi';

function unwrapGroupsResponse(res) {
  const candidates = [res?.data?.data, res?.data, res];
  for (const c of candidates) {
    if (c && Array.isArray(c.groups)) return c.groups;
    if (Array.isArray(c)) return c;
  }
  console.warn('[ScheduleResults] Không parse được groups response. Shape thực tế:', res);
  return [];
}

// GIẢ ĐỊNH: cùng PHASE_TYPE_LABELS với ScheduleMatchCard — nếu enum thực tế
// khác, sửa đồng thời cả 2 chỗ hoặc rút ra 1 file constants chung.
const PHASE_TYPE_LABELS = {
  round_of_32: 'Vòng 1/16',
  round_of_16: 'Vòng 1/8',
  quarter_final: 'Tứ kết',
  semi_final: 'Bán kết',
  third_place: 'Tranh hạng 3',
  final: 'Chung kết',
};

// ── Bracket Section (knockout) ──────────────────────────────────
function BracketSection({ rounds, teamMap, venueMap, onSelectMatch }) {
  if (!rounds || rounds.length === 0) return null;

  return (
    <div className="mt-12 pt-12 animate-fade-in border-t border-navy-light/50 w-full mb-10">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <GitBranch className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500 uppercase tracking-wider">
            Sơ đồ Knockout
          </h2>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {rounds.map(r => (
          <div key={r.round} className="min-w-[280px] sm:min-w-[320px] bg-navy-dark/80 backdrop-blur-xl border border-navy-light rounded-3xl p-5 shadow-2xl snap-start shrink-0">
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-4 pb-3 border-b border-navy-light/50">
              {r.phaseName || PHASE_TYPE_LABELS[r.phaseType] || `Vòng ${r.round}`}
            </h3>
            <div className="space-y-3">
              {r.matches.map(m => {
                const home = teamMap[m.home_team_id];
                const away = teamMap[m.away_team_id];
                const hasScore = m.home_score != null && m.away_score != null;
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMatch({ ...m, home_team: home, away_team: away, venue: venueMap[m.venue_id] })}
                    className="cursor-pointer bg-navy/60 border border-navy-light rounded-xl p-3 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-white truncate flex-1">{home?.name ?? `Đội #${m.home_team_id ?? '?'}`}</span>
                      <span className="font-black text-gray-400 mx-2 text-xs shrink-0">
                        {hasScore ? `${m.home_score} - ${m.away_score}` : 'vs'}
                      </span>
                      <span className="font-bold text-white truncate flex-1 text-right">{away?.name ?? `Đội #${m.away_team_id ?? '?'}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function ScheduleResults() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [filterRound, setFilterRound] = useState('');

  const [groups, setGroups] = useState([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);

  const [bracketRounds, setBracketRounds] = useState([]);

  // ── Zustand stores ─────────────────────────────────────────
  const { seasons, isLoading: seasonsLoading, fetchAll: fetchSeasons } = useSeasonStore(useShallow(state => ({ seasons: state.seasons, isLoading: state.isLoading, fetchAll: state.fetchAll })));
  const { teams, fetchAll: fetchTeams } = useTeamStore(useShallow(state => ({ teams: state.teams, fetchAll: state.fetchAll })));
  const { venues, fetchAll: fetchVenues } = useVenueStore(useShallow(state => ({ venues: state.venues, fetchAll: state.fetchAll })));
  const { getMatchesFromCache, isSeasonLoading,
    fetchBySeason, error: scheduleError,
    scheduleCache } = useScheduleStore(useShallow(state => ({ getMatchesFromCache: state.getMatchesFromCache, isSeasonLoading: state.isSeasonLoading, fetchBySeason: state.fetchBySeason, error: state.error, scheduleCache: state.scheduleCache })));

  // ── Lookup maps từ stores ──────────────────────────────────
  const teamMap = useMemo(() => Object.fromEntries((teams || []).map(t => [t.id, t])), [teams]);
  const venueMap = useMemo(() => Object.fromEntries((venues || []).map(v => [v.id, v])), [venues]);


  // ── Matches raw + enriched ─────────────────────────────────
  // Enrich: gắn home_team, away_team, venue từ store. Giữ nguyên match.phase
  // nếu API đã trả (không override) — dùng bởi ScheduleMatchCard cho phase badge.
  const allMatches = useMemo(() => {
    const rawMatches = selectedSeasonId
      ? getMatchesFromCache(Number(selectedSeasonId))
      : seasons.flatMap(s => scheduleCache[s.id]?.matches ?? []);
    return rawMatches.map(m => ({
      ...m,
      home_team: teamMap[m.home_team_id] ?? null,
      away_team: teamMap[m.away_team_id] ?? null,
      venue: venueMap[m.venue_id] ?? null,
    }));
  }, [selectedSeasonId, seasons, scheduleCache, getMatchesFromCache, teamMap, venueMap]);

  const isLoading = seasonsLoading || (selectedSeasonId
    ? isSeasonLoading(Number(selectedSeasonId))
    : seasons.some(s => isSeasonLoading(s.id)));

  // ── Tabs ───────────────────────────────────────────────────
  const availableRounds = useMemo(() => {
    const rounds = [...new Set(allMatches.map(m => m.round).filter(Boolean))].sort((a, b) => a - b);
    return rounds;
  }, [allMatches]);

  const upcoming = useMemo(() => {
    let list = allMatches.filter(m => m.status === 'scheduled' || m.status === 'ongoing');
    if (filterRound) list = list.filter(m => String(m.round) === String(filterRound));
    return list.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  }, [allMatches, filterRound]);

  const results = useMemo(() => {
    let list = allMatches.filter(m => m.status === 'finished' || m.status === 'cancelled' || m.status === 'forfeited');
    if (filterRound) list = list.filter(m => String(m.round) === String(filterRound));
    return list.sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));
  }, [allMatches, filterRound]);

  // ── Fetch on mount ─────────────────────────────────────────
  useEffect(() => {
    fetchSeasons();
    fetchTeams();
    fetchVenues();
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

  // Khi season thay đổi: fetch lịch mới + groups + bracket knockout
  useEffect(() => {
    if (selectedSeasonId) {
      fetchBySeason(Number(selectedSeasonId));

      const fetchGroups = async () => {
        setIsGroupsLoading(true);
        try {
          const res = await groupApi.listBySeason(selectedSeasonId);
          setGroups(unwrapGroupsResponse(res));
        } catch (error) {
          console.error("Failed to fetch groups", error);
          setGroups([]);
        } finally {
          setIsGroupsLoading(false);
        }
      };
      fetchGroups();

      // Bracket knockout — độc lập với groups, season có thể chỉ có 1 trong 2
      // hoặc cả 2 (round-robin xong rồi mới có knockout). Fail im lặng: đây
      // là section bổ sung, không phải nội dung chính của trang.
      const fetchBracket = async () => {
        try {
          const res = await knockoutApi.getBracket(selectedSeasonId);
          const payload = typeof res?.status === 'boolean' ? res.data : res;
          setBracketRounds(Array.isArray(payload?.rounds) ? payload.rounds : []);
        } catch (error) {
          // 404/chưa có knockout phase = expected, không log như lỗi thật
          setBracketRounds([]);
        }
      };
      fetchBracket();
    } else {
      setGroups([]);
      setBracketRounds([]);
    }
  }, [selectedSeasonId, fetchBySeason]);

  const handleRefresh = () => {
    if (selectedSeasonId) fetchBySeason(Number(selectedSeasonId), { force: true });
  };

  const currentData = activeTab === 'upcoming' ? upcoming : results;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const [prevFilterState, setPrevFilterState] = useState({ activeTab, selectedSeasonId, filterRound });
  if (
    prevFilterState.activeTab !== activeTab ||
    prevFilterState.selectedSeasonId !== selectedSeasonId ||
    prevFilterState.filterRound !== filterRound
  ) {
    setPrevFilterState({ activeTab, selectedSeasonId, filterRound });
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(currentData.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = currentData.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const selectedSeason = seasons.find(s => String(s.id) === String(selectedSeasonId));

  return (
    <div className="py-12 lg:py-16 bg-navy-dark min-h-screen relative">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 translate-x-1/4"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* Title */}
          <div className="text-center mb-10 md:mb-16 animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon uppercase italic tracking-tight mb-4 drop-shadow-md">
              Lịch thi đấu &amp; <span className="text-white">Kết quả</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium">
              Theo dõi lịch thi đấu, không bỏ lỡ trận cầu nào và cập nhật kết quả mới nhất của giải đấu.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col gap-4 mb-10 animate-fade-in bg-navy/40 backdrop-blur-xl border border-navy-light rounded-4xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Season Selector */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest shrink-0 flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                  <CalendarDays className="w-4 h-4" />
                  Mùa giải
                </label>
                <div className="relative w-full sm:w-64">
                  <select
                    value={selectedSeasonId}
                    onChange={e => setSelectedSeasonId(e.target.value)}
                    disabled={seasonsLoading}
                    className="w-full pl-5 pr-10 py-3 bg-navy-dark/80 border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm appearance-none disabled:opacity-60 transition-all cursor-pointer shadow-inner"
                  >
                    <option value="">-- Chọn mùa giải --</option>
                    {seasons.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                        {s.status === 'ongoing' ? ' 🔴' : s.status === 'registration_open' ? ' 📋' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex bg-navy-dark p-1.5 rounded-xl border border-navy-light w-full md:w-auto shadow-inner relative">
                <div
                  className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg transition-transform duration-300 ease-out shadow-md`}
                  style={{
                    transform: activeTab === 'upcoming' ? 'translateX(0)' : 'translateX(100%)',
                    left: '6px'
                  }}
                ></div>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`flex-1 md:w-40 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-colors duration-300 flex justify-center items-center gap-2 relative z-10 ${activeTab === 'upcoming' ? 'text-white' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Sắp tới
                  {!isLoading && upcoming.length > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-navy-light text-gray-400'}`}>{upcoming.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className={`flex-1 md:w-40 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-colors duration-300 flex justify-center items-center gap-2 relative z-10 ${activeTab === 'results' ? 'text-white' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  <Trophy className="w-4 h-4" />
                  Kết quả
                  {!isLoading && results.length > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${activeTab === 'results' ? 'bg-white/20 text-white' : 'bg-navy-light text-gray-400'}`}>{results.length}</span>
                  )}
                </button>
              </div>
            </div>{/* end flex row */}

            {/* Round filter row — chỉ hiện khi có dữ liệu */}
            {availableRounds.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap border-t border-navy-light/50 pt-4">
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider shrink-0">
                  <Filter className="w-3.5 h-3.5" /> Vòng đấu:
                </div>
                <button
                  onClick={() => setFilterRound('')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-black border transition-all ${!filterRound
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-sm shadow-blue-500/15'
                    : 'bg-navy-dark border-navy-light text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                >
                  Tất cả
                </button>
                {availableRounds.map(r => (
                  <button
                    key={r}
                    onClick={() => setFilterRound(prev => String(prev) === String(r) ? '' : String(r))}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black border transition-all ${String(filterRound) === String(r)
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-sm shadow-blue-500/15'
                      : 'bg-navy-dark border-navy-light text-gray-400 hover:text-white hover:border-gray-500'
                      }`}
                  >
                    Vòng {r}
                  </button>
                ))}
                {filterRound && (
                  <button
                    onClick={() => setFilterRound('')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-black text-gray-500 border border-navy-light hover:text-white hover:border-gray-500 transition-all ml-auto"
                  >
                    <X className="w-3 h-3" /> Xóa filter
                  </button>
                )}
              </div>
            )}
          </div>



          {/* Stats bar */}
          <div className="flex items-center justify-between mb-6 px-2 animate-fade-in">
            {selectedSeason && (
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20"><Users className="w-3.5 h-3.5" /> Max {selectedSeason.max_teams} đội</span>
              </div>
            )}

            <div className="flex items-center gap-4 ml-auto">
              {!isLoading && selectedSeasonId && allMatches.length > 0 && (
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest hidden sm:block">
                  Tổng <span className="text-white">{allMatches.length}</span> trận <span className="mx-1 text-gray-600">|</span>
                  <span className="text-emerald-400 ml-1">{results.length} KQ</span> <span className="mx-1 text-gray-600">|</span>
                  <span className="text-amber-400 ml-1">{upcoming.length} Tới</span>
                </p>
              )}

              <button
                onClick={handleRefresh}
                disabled={isLoading || !selectedSeasonId}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-white hover:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-500/30 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Tải lại
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {!selectedSeasonId && !seasonsLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-500 animate-fade-in bg-navy/30 rounded-4xl border border-navy-light/50 border-dashed backdrop-blur-sm">
                <div className="p-5 bg-navy border border-navy-light rounded-full shadow-lg">
                  <CalendarDays className="w-12 h-12 text-blue-400" />
                </div>
                <p className="font-bold text-lg">Vui lòng chọn mùa giải để xem lịch thi đấu.</p>
              </div>
            ) : isLoading ? (
              <>
                <MatchRowSkeleton /><MatchRowSkeleton /><MatchRowSkeleton />
              </>
            ) : scheduleError ? (
              <div className="flex flex-col items-center justify-center py-32 gap-5 text-gray-400 animate-fade-in bg-navy/30 rounded-4xl border border-red-500/20 backdrop-blur-sm">
                <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-full shadow-lg">
                  <WifiOff className="w-12 h-12 text-red-400" />
                </div>
                <p className="font-bold text-lg text-white">Không thể tải dữ liệu.</p>
                <button onClick={handleRefresh} className="px-6 py-3 bg-linear-to-r from-red-500 to-rose-600 rounded-xl text-sm font-black text-white hover:from-red-400 hover:to-rose-500 transition-all shadow-lg hover:shadow-red-500/25">
                  Thử lại ngay
                </button>
              </div>
            ) : currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-5 text-gray-500 animate-fade-in bg-navy/30 rounded-4xl border border-navy-light/50 border-dashed backdrop-blur-sm">
                <div className="p-5 bg-navy border border-navy-light rounded-full shadow-lg relative">
                  {activeTab === 'upcoming' ? (
                    <CalendarDays className="w-12 h-12 text-blue-400" />
                  ) : (
                    <Trophy className="w-12 h-12 text-yellow-400" />
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-navy-dark border border-navy-light rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xl leading-none block -mt-1">-</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-black text-xl text-white mb-2 tracking-tight">
                    {activeTab === 'upcoming' ? 'Chưa có lịch thi đấu' : 'Chưa có kết quả'}
                  </p>
                  <p className="text-sm font-medium">
                    {activeTab === 'upcoming' ? 'Các trận đấu sẽ được cập nhật sớm nhất.' : 'Giải đấu chưa có trận nào kết thúc.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {paginatedData.map((match, idx) => (
                  <ScheduleMatchCard key={match.id} match={match} idx={idx} onSelectMatch={setSelectedMatch} />
                ))}
              </div>
            )}

            {totalPages > 1 && currentData.length > 0 && !isLoading && !scheduleError && (
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
          </div>

        </div>

        {/* Groups Section (Wide Layout) */}
        {!isGroupsLoading && groups.length > 0 && (
          <div className="mt-12 pt-12 animate-fade-in border-t border-navy-light/50 w-full mb-10">
            {/* Title aligned with max-w-4xl content */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <LayoutGrid className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon uppercase tracking-wider">
                  Các bảng đấu
                </h2>
              </div>
            </div>

            {/* Scrollable container taking full width of the main container */}
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {groups.map(group => (
                <div key={group.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-[350px] bg-navy-dark/80 backdrop-blur-xl border border-navy-light rounded-3xl p-6 shadow-2xl snap-start shrink-0 hover:border-blue-500/30 transition-colors duration-300">
                  <div className="flex items-center justify-between border-b border-navy-light/50 pb-4 mb-5">
                    <h3 className="text-lg md:text-xl font-black text-blue-400 uppercase tracking-widest">{group.name}</h3>
                    <span className="text-xs font-black text-gray-300 bg-navy-light/80 px-3 py-1.5 rounded-lg border border-white/5">{group.season_teams?.length || 0} Đội</span>
                  </div>
                  <div className="space-y-3">
                    {(!group.season_teams || group.season_teams.length === 0) ? (
                      <p className="text-sm text-gray-500 italic text-center py-6 bg-navy/30 rounded-2xl border border-navy-light/30">Chưa có đội nào</p>
                    ) : (
                      group.season_teams.map(st => {
                        const team = teamMap[st.team_id];
                        if (!team) return null;
                        return (
                          <div key={st.id} className="flex items-center gap-4 bg-navy/40 p-3 rounded-2xl border border-navy-light/30 hover:bg-navy-light/50 hover:border-blue-500/30 transition-all cursor-default group/team">
                            <div className="w-10 h-10 rounded-xl shadow-sm group-hover/team:shadow-md transition-all relative overflow-hidden bg-linear-to-br from-gray-200 to-gray-300 border border-white/10 shrink-0">
                              <span className="absolute inset-0 flex items-center justify-center font-black text-gray-600 text-lg">
                                {team.name ? team.name.charAt(0).toUpperCase() : '?'}
                              </span>
                              {team.logo && (
                                <div className="absolute inset-0 bg-white p-1.5 z-10 flex items-center justify-center">
                                  <img
                                    src={team.logo}
                                    alt={team.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.target.onerror = null; e.target.parentElement.style.display = 'none'; }}
                                  />
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-bold text-black group-hover/team:text-gray-600 transition-colors">{team.name}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bracket Section (knockout) — song song với Groups, hiện khi có phase knockout */}
        <BracketSection
          rounds={bracketRounds}
          teamMap={teamMap}
          venueMap={venueMap}
          onSelectMatch={setSelectedMatch}
        />
      </div>

      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
}