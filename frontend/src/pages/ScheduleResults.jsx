import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Trophy, WifiOff, Clock, MapPin, RefreshCw, Construction } from 'lucide-react';
import { matchApi } from '../api';

// ── Skeleton ─────────────────────────────────────────────────
function MatchRowSkeleton() {
  return (
    <div className="bg-navy border border-navy-light rounded-2xl p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="flex items-center gap-4 flex-1 justify-center">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-8 w-16 rounded-lg" />
          <div className="skeleton h-5 w-20 rounded" />
        </div>
        <div className="skeleton h-4 w-16 rounded" />
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    scheduled:  { label: 'Sắp diễn ra', cls: 'bg-amber-400/10 text-amber-400 border-amber-400/30' },
    ongoing:    { label: '🔴 Live',      cls: 'bg-red-400/10 text-red-400 border-red-400/30 animate-pulse' },
    finished:   { label: 'Đã kết thúc', cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' },
    cancelled:  { label: 'Đã hủy',      cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30' },
    forfeited:  { label: 'Xử thua',     cls: 'bg-orange-400/10 text-orange-400 border-orange-400/30' },
  };
  const s = map[status] ?? map.scheduled;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ── Match Card ────────────────────────────────────────────────
function MatchCard({ match, idx }) {
  const homeName = match.home_team?.name ?? `Đội #${match.home_team_id}`;
  const awayName = match.away_team?.name ?? `Đội #${match.away_team_id}`;
  const homeInitial = homeName[0]?.toUpperCase() ?? '?';
  const awayInitial = awayName[0]?.toUpperCase() ?? '?';
  const hasScore = match.home_score != null && match.away_score != null;

  const dateLabel = match.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Chưa xác định';

  return (
    <div
      className="bg-navy border border-navy-light rounded-2xl p-5 shadow-lg shadow-black/20 hover:border-blue-500/40 hover:shadow-blue-900/20 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      {/* Date & Status */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          {dateLabel}
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Match Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Home */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center font-black text-white text-xl shadow-md shadow-blue-900/30">
            {homeInitial}
          </div>
          <span className="font-bold text-white text-sm text-center line-clamp-2">{homeName}</span>
        </div>

        {/* Score / VS */}
        <div className="shrink-0 text-center">
          {hasScore ? (
            <div className="bg-navy-dark border border-navy-light rounded-xl px-4 py-2 shadow-inner">
              <span className="text-2xl font-black text-white tracking-wider">
                {match.home_score} – {match.away_score}
              </span>
            </div>
          ) : (
            <div className="bg-navy-dark border border-navy-light rounded-xl px-5 py-2.5">
              <span className="text-sm font-black text-gray-400 tracking-widest">VS</span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-600 to-orange-700 flex items-center justify-center font-black text-white text-xl shadow-md shadow-amber-900/30">
            {awayInitial}
          </div>
          <span className="font-bold text-white text-sm text-center line-clamp-2">{awayName}</span>
        </div>
      </div>

      {/* Venue */}
      {match.venue && (
        <div className="mt-3 pt-3 border-t border-navy-light flex items-center gap-1.5 text-gray-500 text-xs">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {match.venue.name ?? '—'}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function ScheduleResults() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const parsePage = (res) => {
    const payload = (typeof res?.status === 'boolean') ? res.data : res;
    return Array.isArray(payload?.data) ? payload.data : [];
  };

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setApiUnavailable(false);
    try {
      const [upcomingRes, resultsRes] = await Promise.allSettled([
        matchApi.getMatches({ status: 'scheduled,ongoing', per_page: 20, sort: 'scheduled_at', direction: 'asc' }),
        matchApi.getMatches({ status: 'finished', per_page: 20, sort: 'scheduled_at', direction: 'desc' }),
      ]);
      if (upcomingRes.status === 'fulfilled') setUpcoming(parsePage(upcomingRes.value));
      if (resultsRes.status === 'fulfilled') setResults(parsePage(resultsRes.value));

      // Nếu cả 2 đều bị từ chối → API chưa có
      if (upcomingRes.status === 'rejected' && resultsRes.status === 'rejected') {
        setApiUnavailable(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const currentData = activeTab === 'upcoming' ? upcoming : results;

  return (
    <div className="py-8 lg:py-12 bg-navy-dark min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Title */}
          <div className="text-center mb-10 md:mb-16 animate-slide-up">
            <h1 className="text-3xl md:text-5xl font-black text-neon uppercase italic tracking-tight mb-4">
              Lịch thi đấu & <span className="text-white">Kết quả</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
              Theo dõi lịch thi đấu và cập nhật kết quả mới nhất của giải đấu.
            </p>
          </div>

          {/* API Unavailable Banner */}
          {apiUnavailable && (
            <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
              <Construction className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-amber-400 text-sm font-medium">
                Match API chưa được triển khai. Dữ liệu sẽ xuất hiện khi backend hoàn thiện.
              </p>
            </div>
          )}

          {/* Tab switcher */}
          <div className="flex bg-navy p-1.5 rounded-xl border border-navy-light max-w-md mx-auto mb-10 md:mb-12 shadow-lg shadow-black/20 animate-fade-in">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-3.5 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-900/50'
                  : 'text-gray-400 hover:text-white hover:bg-navy-dark'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Sắp diễn ra
              {!isLoading && upcoming.length > 0 && (
                <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-black">{upcoming.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-3.5 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                activeTab === 'results'
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-900/50'
                  : 'text-gray-400 hover:text-white hover:bg-navy-dark'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Kết quả
              {!isLoading && results.length > 0 && (
                <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-black">{results.length}</span>
              )}
            </button>
          </div>

          {/* Refresh */}
          <div className="flex justify-end mb-4">
            <button
              onClick={fetchMatches}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Tải lại
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 md:space-y-5">
            {isLoading ? (
              <>
                <MatchRowSkeleton /><MatchRowSkeleton /><MatchRowSkeleton /><MatchRowSkeleton />
              </>
            ) : hasError ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400 animate-fade-in">
                <WifiOff className="w-12 h-12 text-gray-600" />
                <p className="font-semibold">Không thể tải dữ liệu. Vui lòng thử lại.</p>
                <button onClick={fetchMatches} className="px-4 py-2 bg-navy-light border border-navy-light rounded-lg text-sm font-bold hover:bg-navy transition-colors">
                  Thử lại
                </button>
              </div>
            ) : currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400 animate-fade-in">
                <CalendarDays className="w-12 h-12 text-gray-600" />
                <p className="font-semibold">
                  {activeTab === 'upcoming' ? 'Chưa có trận đấu nào được lên lịch.' : 'Chưa có kết quả trận đấu nào.'}
                </p>
              </div>
            ) : (
              currentData.map((match, idx) => (
                <MatchCard key={match.id} match={match} idx={idx} />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
