import { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Trophy, WifiOff, Clock, MapPin, RefreshCw, ChevronDown, Users, Filter, X } from 'lucide-react';
import useScheduleStore from '../store/scheduleStore';
import useSeasonStore from '../store/seasonStore';
import useTeamStore from '../store/teamStore';
import useVenueStore from '../store/venueStore';
import MatchModal from '../components/MatchModal';

// ── Skeleton ─────────────────────────────────────────────────
function MatchRowSkeleton() {
  return (
    <div className="bg-navy/60 backdrop-blur-md border border-navy-light rounded-4xl p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-5">
        <div className="skeleton h-4 w-32 rounded-lg" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="skeleton w-16 h-16 rounded-2xl" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
        <div className="skeleton h-12 w-24 rounded-xl" />
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="skeleton w-16 h-16 rounded-2xl" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    scheduled:  { label: 'Sắp diễn ra', cls: 'bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.15)]' },
    ongoing:    { label: '🔴 Live',      cls: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]' },
    finished:   { label: 'Đã kết thúc', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]' },
    cancelled:  { label: 'Đã hủy',      cls: 'bg-gray-500/10 text-gray-400 border-gray-500/30' },
    forfeited:  { label: 'Xử thua',     cls: 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]' },
  };
  const s = map[status] ?? map.scheduled;
  return (
    <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ── Match Card ────────────────────────────────────────────────
// match được enrich với home_team, away_team, venue objects
function MatchCard({ match, idx, onSelectMatch }) {
  const homeName  = match.home_team?.name  ?? `Đội #${match.home_team_id}`;
  const awayName  = match.away_team?.name  ?? `Đội #${match.away_team_id}`;
  const homeInitial = homeName[0]?.toUpperCase() ?? '?';
  const awayInitial = awayName[0]?.toUpperCase() ?? '?';
  const hasScore  = match.home_score != null && match.away_score != null;
  const venueName = match.venue?.name ?? null;

  const dateLabel = match.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Chưa xác định';

  const roundLabel = match.round ? `Vòng ${match.round}` : null;

  return (
    <div
      onClick={() => onSelectMatch(match)}
      className="cursor-pointer bg-navy/60 backdrop-blur-xl border border-navy-light rounded-4xl p-6 sm:p-8 shadow-2xl shadow-black/40 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 animate-slide-up group relative overflow-hidden"
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Date & Status */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            {dateLabel}
          </div>
          {roundLabel && (
            <span className="text-[10px] font-black text-gray-400 bg-navy-dark border border-navy-light px-3 py-1 rounded-full shadow-inner uppercase tracking-widest">
              {roundLabel}
            </span>
          )}
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Match Row */}
      <div className="flex items-center justify-between gap-4 relative z-10">
        {/* Home */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0 group/team">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover/team:opacity-100 transition-opacity duration-300"></div>
            {match.home_team?.logo ? (
              <img
                src={match.home_team.logo}
                alt={homeName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-[3px] border-navy-light relative z-10 group-hover/team:scale-105 transition-transform duration-300"
                onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-3xl shadow-lg border-[3px] border-navy-light relative z-10 group-hover/team:scale-105 transition-transform duration-300">
                {homeInitial}
              </div>
            )}
          </div>
          <span className="font-bold text-white text-sm sm:text-base text-center line-clamp-2 w-full group-hover/team:text-blue-400 transition-colors">{homeName}</span>
        </div>

        {/* Score / VS */}
        <div className="shrink-0 text-center px-2">
          {hasScore ? (
            <div className="bg-navy-dark border border-navy-light rounded-2xl px-6 py-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-navy-dark border border-navy-light px-2 py-0.5 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Kết quả
              </div>
              <span className={`text-4xl font-black tracking-wider ${
                match.home_score > match.away_score ? 'text-neon drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]' :
                match.home_score < match.away_score ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-white'
              }`}>
                {match.home_score}
              </span>
              <span className="text-2xl font-black text-gray-600 mx-3">—</span>
              <span className={`text-4xl font-black tracking-wider ${
                match.away_score > match.home_score ? 'text-neon drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]' :
                match.away_score < match.home_score ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-white'
              }`}>
                {match.away_score}
              </span>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20"></div>
              <div className="bg-navy-dark border border-navy-light rounded-full w-14 h-14 flex items-center justify-center relative z-10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]">
                <span className="text-sm font-black text-transparent bg-clip-text bg-linear-to-br from-gray-300 to-gray-500 italic tracking-widest pr-0.5">VS</span>
              </div>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0 group/team">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 rounded-2xl blur-lg opacity-0 group-hover/team:opacity-100 transition-opacity duration-300"></div>
            {match.away_team?.logo ? (
              <img
                src={match.away_team.logo}
                alt={awayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-[3px] border-navy-light relative z-10 group-hover/team:scale-105 transition-transform duration-300"
                onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-rose-600 to-red-800 flex items-center justify-center font-black text-white text-3xl shadow-lg border-[3px] border-navy-light relative z-10 group-hover/team:scale-105 transition-transform duration-300">
                {awayInitial}
              </div>
            )}
          </div>
          <span className="font-bold text-white text-sm sm:text-base text-center line-clamp-2 w-full group-hover/team:text-rose-400 transition-colors">{awayName}</span>
        </div>
      </div>

      {/* Venue */}
      {venueName && (
        <div className="mt-6 pt-4 border-t border-navy-light/50 flex items-center gap-2 text-gray-400 text-xs font-bold relative z-10">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          {venueName}
        </div>
      )}
    </div>
  );
}

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
  } = useScheduleStore();

  // ── Lookup maps từ stores ──────────────────────────────────
  const teamMap  = useMemo(() => Object.fromEntries((teams  || []).map(t => [t.id, t])), [teams]);
  const venueMap = useMemo(() => Object.fromEntries((venues || []).map(v => [v.id, v])), [venues]);

  // Auto-select season khi load xong – dùng useEffect nhưng tránh setState
  // đồng bộ bằng cách tính toán ngoài và chỉ gọi setter khi cần
  useEffect(() => {
    if (!selectedSeasonId && seasons.length > 0) {
      const ongoing = seasons.find(s => s.status === 'ongoing');
      const regOpen = seasons.find(s => s.status === 'registration_open');
      const best = ongoing ?? regOpen ?? seasons[0];
      const nextId = best ? String(best.id) : '';
      if (nextId) {
        // Dùng setTimeout để tránh setState đồng bộ trong effect body
        const id = setTimeout(() => setSelectedSeasonId(nextId), 0);
        return () => clearTimeout(id);
      }
    }
  }, [seasons, selectedSeasonId]);

  // ── Matches raw + enriched ─────────────────────────────────
  // Enrich: gắn home_team, away_team, venue từ store
  const allMatches = useMemo(() => {
    const rawMatches = selectedSeasonId ? getMatchesFromCache(Number(selectedSeasonId)) : [];
    return rawMatches.map(m => ({
      ...m,
      home_team: teamMap[m.home_team_id] ?? null,
      away_team: teamMap[m.away_team_id] ?? null,
      venue:     venueMap[m.venue_id]    ?? null,
    }));
  }, [selectedSeasonId, getMatchesFromCache, teamMap, venueMap]);

  const isLoading = seasonsLoading || (selectedSeasonId ? isSeasonLoading(Number(selectedSeasonId)) : false);

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
    if (selectedSeasonId) fetchBySeason(Number(selectedSeasonId));
  }, [selectedSeasonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    if (selectedSeasonId) fetchBySeason(Number(selectedSeasonId), { force: true });
  };

  const currentData = activeTab === 'upcoming' ? upcoming : results;
  const selectedSeason = seasons.find(s => String(s.id) === String(selectedSeasonId));

  return (
    <div className="py-12 lg:py-16 bg-navy-dark min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 translate-x-1/4 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none"></div>

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
                  <MatchCard key={match.id} match={match} idx={idx} onSelectMatch={setSelectedMatch} />
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
