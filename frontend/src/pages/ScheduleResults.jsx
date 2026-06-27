import { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Trophy, WifiOff, RefreshCw, ChevronDown, Users, Filter, X } from 'lucide-react';
import useScheduleStore from '../store/scheduleStore';
import useSeasonStore from '../store/seasonStore';
import useTeamStore from '../store/teamStore';
import useVenueStore from '../store/venueStore';
import MatchModal from '../components/MatchModal';
import StatusBadge from '../components/ui/StatusBadge';
import MatchRowSkeleton from '../components/skeletons/MatchRowSkeleton';
import ScheduleMatchCard from '../components/schedule/ScheduleMatchCard';

// ── Page ──────────────────────────────────────────────────────
export default function ScheduleResults() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [filterRound, setFilterRound] = useState('');

  // ── Zustand stores ─────────────────────────────────────────
  const { seasons, isLoading: seasonsLoading, fetchAll: fetchSeasons } = useSeasonStore();
  const { teams, fetchAll: fetchTeams } = useTeamStore();
  const { venues, fetchAll: fetchVenues } = useVenueStore();
  const {
    getMatchesFromCache, isSeasonLoading,
    fetchBySeason, error: scheduleError,
    scheduleCache
  } = useScheduleStore();

  // ── Lookup maps từ stores ──────────────────────────────────
  const teamMap  = useMemo(() => Object.fromEntries((teams  || []).map(t => [t.id, t])), [teams]);
  const venueMap = useMemo(() => Object.fromEntries((venues || []).map(v => [v.id, v])), [venues]);


  // ── Matches raw + enriched ─────────────────────────────────
  // Enrich: gắn home_team, away_team, venue từ store
  const allMatches = useMemo(() => {
    const rawMatches = selectedSeasonId 
      ? getMatchesFromCache(Number(selectedSeasonId)) 
      : seasons.flatMap(s => scheduleCache[s.id]?.matches ?? []);
    return rawMatches.map(m => ({
      ...m,
      home_team: teamMap[m.home_team_id] ?? null,
      away_team: teamMap[m.away_team_id] ?? null,
      venue:     venueMap[m.venue_id]    ?? null,
    }));
  }, [selectedSeasonId, seasons, scheduleCache, getMatchesFromCache, teamMap, venueMap]);

  const isLoading = seasonsLoading || (selectedSeasonId 
    ? isSeasonLoading(Number(selectedSeasonId)) 
    : seasons.some(s => isSeasonLoading(s.id)));

  // ── Tabs ───────────────────────────────────────────────────
  // Available rounds derived from all matches
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

  // Khi season thay đổi: fetch lịch mới
  useEffect(() => {
    if (selectedSeasonId) {
      fetchBySeason(Number(selectedSeasonId));
    } else {
      seasons.forEach(s => fetchBySeason(s.id));
    }
  }, [selectedSeasonId, seasons, fetchBySeason]);

  const handleRefresh = () => {
    if (selectedSeasonId) fetchBySeason(Number(selectedSeasonId), { force: true });
  };

  const currentData = activeTab === 'upcoming' ? upcoming : results;
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
                className={`flex-1 md:w-40 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-colors duration-300 flex justify-center items-center gap-2 relative z-10 ${
                  activeTab === 'upcoming' ? 'text-white' : 'text-gray-500 hover:text-white'
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
                className={`flex-1 md:w-40 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-colors duration-300 flex justify-center items-center gap-2 relative z-10 ${
                  activeTab === 'results' ? 'text-white' : 'text-gray-500 hover:text-white'
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
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-black border transition-all ${
                    !filterRound
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
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black border transition-all ${
                      String(filterRound) === String(r)
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
                {currentData.map((match, idx) => (
                  <ScheduleMatchCard key={match.id} match={match} idx={idx} onSelectMatch={setSelectedMatch} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
}
