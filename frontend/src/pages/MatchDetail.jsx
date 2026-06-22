import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Shield, Activity, WifiOff, Construction, Hash } from 'lucide-react';
import { matchApi, teamApi } from '../api';

// ── Helpers ───────────────────────────────────────────────────
const getInitials = (name) =>
  name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

const STATUS_MAP = {
  scheduled:  { label: 'Sắp diễn ra', cls: 'bg-amber-400/10 text-amber-400 border-amber-400/30' },
  ongoing:    { label: '🔴 Đang diễn ra', cls: 'bg-red-400/10 text-red-400 border-red-400/30 animate-pulse' },
  finished:   { label: 'Kết thúc',     cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' },
  cancelled:  { label: 'Đã hủy',       cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30' },
};

const POSITION_LABELS = { GK: 'TM', DEF: 'HV', MID: 'TV', FW: 'TĐ' };
const POSITION_COLORS = {
  GK:  'bg-amber-400/10 text-amber-400',
  DEF: 'bg-blue-400/10 text-blue-400',
  MID: 'bg-emerald-400/10 text-emerald-400',
  FW:  'bg-red-400/10 text-red-400',
};

// ── Skeletons ─────────────────────────────────────────────────
function HeaderSkeleton() {
  return (
    <div className="flex justify-center items-center gap-8">
      {[0, 1].map(i => (
        <div key={i} className="flex flex-col items-center gap-4">
          <div className="skeleton w-28 h-28 rounded-full" />
          <div className="skeleton h-5 w-20 rounded" />
        </div>
      ))}
      <div className="flex flex-col items-center gap-3">
        <div className="skeleton h-20 w-44 rounded-3xl" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

// ── Construction Banner ───────────────────────────────────────
function ApiBanner({ message }) {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3 mb-6">
      <Construction className="w-5 h-5 text-amber-400 shrink-0" />
      <p className="text-amber-400 text-sm">{message}</p>
    </div>
  );
}

// ── Player list item ──────────────────────────────────────────
function PlayerItem({ tp }) {
  const name = tp.player?.name ?? tp.player?.player?.name ?? `#${tp.player_id}`;
  const pos = tp.position;
  const jersey = tp.jersey_number ?? '?';
  return (
    <li className="flex items-center gap-2.5 py-2 border-b border-navy-light/50 last:border-0">
      <span className="w-7 text-right font-mono text-neon font-bold text-xs shrink-0">
        #{jersey}
      </span>
      <span className="font-medium text-white text-sm flex-1 truncate">{name}</span>
      {pos && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${POSITION_COLORS[pos] ?? 'bg-gray-400/10 text-gray-400'}`}>
          {POSITION_LABELS[pos] ?? pos}
        </span>
      )}
    </li>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function MatchDetail() {
  const { id } = useParams();
  const matchId = parseInt(id) || null;

  const [isLoading, setIsLoading] = useState(true);
  const [match, setMatch] = useState(null);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [matchApiError, setMatchApiError] = useState(null);

  useEffect(() => {
    if (!matchId) { setHasError(true); setIsLoading(false); return; }
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setMatchApiError(null);

    const parsePage = (res) => {
      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    };

    matchApi.getMatchById(matchId)
      .then(async (res) => {
        if (cancelled) return;
        const payload = (typeof res?.status === 'boolean') ? res.data : res;
        setMatch(payload);

        // Load lineups if we have team IDs
        if (payload?.home_team_id && payload?.away_team_id) {
          const [homeRes, awayRes] = await Promise.allSettled([
            teamApi.getPlayers(payload.home_team_id, { approval_status: 'approved', per_page: 30 }),
            teamApi.getPlayers(payload.away_team_id, { approval_status: 'approved', per_page: 30 }),
          ]);
          if (!cancelled) {
            if (homeRes.status === 'fulfilled') setHomePlayers(parsePage(homeRes.value));
            if (awayRes.status === 'fulfilled') setAwayPlayers(parsePage(awayRes.value));
          }
        }
      })
      .catch(err => {
        if (!cancelled) {
          if (err?.response?.status === 404 || err?.code === 'ERR_NETWORK') {
            setMatchApiError('Match API chưa được triển khai. Dữ liệu sẽ xuất hiện khi backend hoàn thiện.');
          } else {
            setHasError(true);
          }
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [matchId]);

  const homeName = match?.home_team?.name ?? `Đội #${match?.home_team_id ?? '?'}`;
  const awayName = match?.away_team?.name ?? `Đội #${match?.away_team_id ?? '?'}`;
  const hasScore = match?.home_score != null && match?.away_score != null;
  const dateStr = match?.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
    : null;
  const statusInfo = STATUS_MAP[match?.status] ?? STATUS_MAP.scheduled;

  return (
    <div className="min-h-screen bg-navy-dark text-white pb-20">

      {/* Back */}
      <div className="container mx-auto px-4 lg:px-8 pt-6 animate-fade-in">
        <Link
          to="/lich-thi-dau"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-neon transition-colors text-sm font-bold uppercase tracking-wider group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Lịch thi đấu
        </Link>
      </div>

      {/* Match Header */}
      <section className="relative mt-6 mb-12 bg-navy border-b border-navy-light shadow-lg shadow-black/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20 relative z-10">

          {isLoading ? (
            <HeaderSkeleton />
          ) : matchApiError ? (
            <div className="text-center space-y-4">
              <ApiBanner message={matchApiError} />
              <p className="text-gray-500 text-sm">Match ID: #{matchId}</p>
            </div>
          ) : hasError || !match ? (
            <div className="flex flex-col items-center gap-4 text-gray-400 py-8">
              <WifiOff className="w-12 h-12 text-gray-600" />
              <p className="font-bold">Không tìm thấy trận đấu #{matchId}</p>
            </div>
          ) : (
            <div className="animate-slide-up">
              <div className="flex justify-center items-center gap-4 md:gap-16">
                {/* Home */}
                <div className="flex flex-col items-center flex-1 max-w-[200px]">
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-2 border-navy-light bg-linear-to-br from-blue-700 to-cyan-800 flex items-center justify-center font-black text-3xl md:text-5xl text-white shadow-lg shadow-blue-900/30 hover:border-blue-400 transition-colors duration-300">
                    {getInitials(homeName)}
                  </div>
                  <h2 className="mt-4 text-center font-black text-lg md:text-2xl text-white tracking-widest uppercase line-clamp-2">
                    {homeName}
                  </h2>
                </div>

                {/* Score / VS */}
                <div className="flex flex-col items-center shrink-0 gap-3">
                  <div className="px-6 py-4 md:px-10 md:py-6 bg-navy border-2 border-navy-light rounded-3xl shadow-lg shadow-black/30 flex items-center gap-4 md:gap-8">
                    {hasScore ? (
                      <>
                        <span className="text-5xl md:text-7xl font-black text-white">{match.home_score}</span>
                        <span className="text-2xl md:text-4xl font-bold text-gray-500">–</span>
                        <span className="text-5xl md:text-7xl font-black text-white">{match.away_score}</span>
                      </>
                    ) : (
                      <span className="text-xl md:text-3xl font-black text-gray-400 tracking-widest px-2">VS</span>
                    )}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest border px-4 py-1.5 rounded-full ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center flex-1 max-w-[200px]">
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-2 border-navy-light bg-linear-to-br from-amber-700 to-orange-800 flex items-center justify-center font-black text-3xl md:text-5xl text-white shadow-lg shadow-amber-900/30 hover:border-amber-400 transition-colors duration-300">
                    {getInitials(awayName)}
                  </div>
                  <h2 className="mt-4 text-center font-black text-lg md:text-2xl text-white tracking-widest uppercase line-clamp-2">
                    {awayName}
                  </h2>
                </div>
              </div>

              {/* Match Meta */}
              <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 animate-fade-in">
                {dateStr && (
                  <div className="flex items-center gap-2 text-gray-400 font-medium">
                    <Clock className="w-5 h-5 text-neon" />
                    <span>{dateStr}</span>
                  </div>
                )}
                {match.venue && (
                  <div className="flex items-center gap-2 text-gray-400 font-medium">
                    <MapPin className="w-5 h-5 text-red-400" />
                    <span>{match.venue.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Detail Content */}
      {!isLoading && !hasError && !matchApiError && match && (
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Timeline — chờ backend */}
          <section className="lg:col-span-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3 animate-slide-up">
              <Activity className="w-6 h-6 text-neon" /> Diễn Biến Trận Đấu
            </h3>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 flex items-start gap-3">
              <Construction className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-400 mb-1">Tính năng đang phát triển</p>
                <p className="text-sm text-gray-400">
                  Chi tiết diễn biến bàn thắng, thẻ phạt sẽ được hiển thị khi backend hoàn thiện Match Events API.
                </p>
              </div>
            </div>
          </section>

          {/* Lineups */}
          <section className="animate-slide-in-right">
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-neon" /> Đội Hình
            </h3>

            <div className="space-y-4">
              {/* Home */}
              <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg shadow-black/20">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-navy-light">
                  <div className="w-5 h-5 rounded bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white text-xs font-black">
                    {getInitials(homeName)[0]}
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider truncate">{homeName}</h4>
                  <span className="ml-auto text-neon font-bold text-xs">{homePlayers.length}♟</span>
                </div>
                {homePlayers.length > 0 ? (
                  <ul>
                    {homePlayers.map(tp => <PlayerItem key={tp.id} tp={tp} />)}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs text-center py-4">Chưa có danh sách cầu thủ</p>
                )}
              </div>

              {/* Away */}
              <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg shadow-black/20">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-navy-light">
                  <div className="w-5 h-5 rounded bg-linear-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white text-xs font-black">
                    {getInitials(awayName)[0]}
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider truncate">{awayName}</h4>
                  <span className="ml-auto text-neon font-bold text-xs">{awayPlayers.length}♟</span>
                </div>
                {awayPlayers.length > 0 ? (
                  <ul>
                    {awayPlayers.map(tp => <PlayerItem key={tp.id} tp={tp} />)}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs text-center py-4">Chưa có danh sách cầu thủ</p>
                )}
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
