import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Shield, Activity, WifiOff, Construction, Settings } from 'lucide-react';
import { RESULT_AVAILABLE_STATUSES } from '../components/MatchShared'

import { getInitials } from '../utils/constants';
import { useShallow } from 'zustand/react/shallow';
import useScheduleStore from '../store/scheduleStore';
import useAuthStore from '../store/authStore';
import MatchHeaderSkeleton from '../components/skeletons/MatchHeaderSkeleton';
import StatusBadge from '../components/ui/StatusBadge';
import { teamApi, matchLineupApi } from '../api';
import useTeamStore from '../store/teamStore';
import {
  useMatchExtras, TeamAvatar, TeamBadge, PlayerItem,
  normalizePosition, POSITION_ORDER, STATUS_LABEL, STATUS_BADGE_COLOR,
  NO_EVENT_STATUSES, getVsLabel,
} from '../components/MatchShared';

// ── Construction Banner ───────────────────────────────────────
function ApiBanner({ message }) {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3 mb-6">
      <Construction className="w-5 h-5 text-amber-400 shrink-0" />
      <p className="text-amber-400 text-sm">{message}</p>
    </div>
  );
}

// ── Formation pitch (sơ đồ đội hình) ────────────────────────────
// FIX: bỏ FormationPlayerDot cũ (chỉ hiện chấm tròn + tên), thay bằng
// PitchFormation-style: số áo theo ĐÚNG màu áo trận đấu (kit), badge sự
// kiện (bàn thắng ⚽ / phản lưới OG / thẻ vàng 🟨 / thẻ đỏ 🟥) tính thẳng từ
// mảng `events` đã fetch sẵn ở trang này (không gọi thêm API nào khác), và
// header card có logo đội + tỉ số + sơ đồ chiến thuật (vd "4-1-3-2") — cùng
// tinh thần với LineupColumn trong ScheduleTab.jsx (admin) nhưng dùng dữ
// liệu match-detail công khai thay vì report preview.
//
// LƯU Ý: field màu áo đọc từ `kit` (kit?.primaryColor / kit?.shirt_color /
// kit?.color) — mình đoán theo cách TeamAvatar/TeamBadge trong
// MatchShared.jsx đang dùng `kit`. Nếu shape thực tế của kitFor() khác,
// chỉnh lại đúng 2 dòng `shirtColor` / `numberColor` bên dưới cho khớp.

function resolvePlayerName(tp) {
  const name = tp.player?.user?.name ?? tp.player?.player?.name ?? tp.player?.name ?? tp.name;
  return (name || '').trim() || `#${tp.player_id ?? tp.id ?? '?'}`;
}

// FIX: khớp ĐÚNG giá trị enum MatchEventType thật của BE (xem
// match.lifecycle.service.ts / matchresult.service.ts) — trước đây so
// type === 'goal'/'yellow'/'red' (sai hoàn toàn với enum thật), nên badge
// gần như không bao giờ hiện. Enum thật: 'goal', 'own_goal', 'yellow_card',
// 'second_yellow', 'red_card', 'penalty_scored', 'substitution_in',
// 'substitution_out'.
//   - goals: 'goal' VÀ 'penalty_scored' đều tính là bàn thắng (giống cách
//     _recomputeStatsForPlayers ở BE gộp 2 type này vào goals_scored).
//   - ownGoals: type riêng 'own_goal' — KHÔNG phải cờ is_own_goal trên type 'goal'.
//   - yellows: chỉ đếm 'yellow_card' (thẻ vàng đầu, chưa bị đuổi).
//   - reds: 'red_card' VÀ 'second_yellow' (thẻ vàng thứ 2 = bị đuổi thực
//     chất là đỏ) đều tính vào reds — khớp _deriveCardColor/is_suspended ở BE.
const GOAL_EVENT_TYPES = new Set(['goal', 'penalty_scored']);

const EVENT_TYPE_LABEL = {
  goal: 'Bàn thắng',
  penalty_scored: 'Bàn thắng (phạt đền)',
  own_goal: 'Phản lưới nhà',
  yellow_card: 'Thẻ vàng',
  second_yellow: 'Thẻ vàng thứ 2 (Đuổi)',
  red_card: 'Thẻ đỏ',
  substitution_in: 'Vào sân',
  substitution_out: 'Ra sân',
};

// Hiện phút kèm bù giờ đúng field `added_minute` (BE trả field này, không
// phải addedMinute — đó là field đã transform riêng ở report preview).
function formatMinuteLabel(evt) {
  const added = evt.added_minute ?? evt.addedMinute;
  return `${evt.minute}${added ? `+${added}` : ''}'`;
}

// Gom bàn thắng/phản lưới/thẻ của 1 cầu thủ từ mảng events của trận —
// events đã có sẵn ở component cha (detailData?.events), không cần thêm
// request nào.
function getPlayerEventBadges(playerId, events) {
  if (!playerId) return { goals: 0, ownGoals: 0, yellows: 0, reds: 0 };
  const playerEvents = events.filter(e => e.player_id === playerId);
  return {
    goals: playerEvents.filter(e => GOAL_EVENT_TYPES.has(e.type)).length,
    ownGoals: playerEvents.filter(e => e.type === 'own_goal').length,
    yellows: playerEvents.filter(e => e.type === 'yellow_card').length,
    reds: playerEvents.filter(e => e.type === 'red_card' || e.type === 'second_yellow').length,
  };
}

function FormationPlayerCell({ tp, kit, events }) {
  const displayName = resolvePlayerName(tp);
  const badges = getPlayerEventBadges(tp.player_id, events);
  const hasBadge = badges.goals > 0 || badges.ownGoals > 0 || badges.yellows > 0 || badges.reds > 0;

  // Màu áo thật của đội trong trận này (có thể khác logo CLB nếu đổi áo).
  const shirtColor = kit?.primaryColor ?? kit?.shirt_color ?? kit?.color ?? '#1d4ed8';
  const numberColor = kit?.numberColor ?? kit?.text_color ?? '#ffffff';
  const borderColor = kit?.secondaryColor ?? kit?.border_color ?? 'rgba(255,255,255,0.75)';

  return (
    <div className="flex flex-col items-center w-16 sm:w-[4.5rem] shrink-0">
      <div className="relative">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-xs sm:text-sm border-2 shadow-lg shadow-black/30"
          style={{ backgroundColor: shirtColor, color: numberColor, borderColor }}
        >
          {tp.jersey_number ?? '-'}
        </div>

        {tp.is_captain && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-amber-200 rounded-full flex items-center justify-center text-[8px] font-black text-black shadow">
            C
          </span>
        )}

        {hasBadge && (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-black/85 rounded-full px-1 py-[1px] whitespace-nowrap">
            {badges.goals > 0 && (
              <span className="text-[9px] leading-none">⚽{badges.goals > 1 ? badges.goals : ''}</span>
            )}
            {badges.ownGoals > 0 && (
              <span className="text-[8px] leading-none font-black text-red-400">OG{badges.ownGoals > 1 ? badges.ownGoals : ''}</span>
            )}
            {badges.yellows > 0 && <span className="text-[9px] leading-none">🟨</span>}
            {badges.reds > 0 && <span className="text-[9px] leading-none">🟥</span>}
          </div>
        )}
      </div>

      <span
        className="mt-2 w-full text-center text-[10px] sm:text-[11px] font-bold text-white leading-snug px-1 py-0.5 rounded bg-black/70 break-words"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
        title={displayName}
      >
        {displayName}
      </span>
    </div>
  );
}

function FormationRow({ players, kit, events }) {
  if (!players.length) return null;
  return (
    <div className="flex justify-evenly items-start w-full px-1 sm:px-6">
      {players.map(tp => (
        <FormationPlayerCell key={tp.id ?? tp.player_id} tp={tp} kit={kit} events={events} />
      ))}
    </div>
  );
}

// Suy ra sơ đồ chiến thuật (vd "4-1-3-2") từ đội hình đá chính, bỏ thủ môn,
// theo đúng thứ tự POSITION_ORDER (DEF → MID → FWD).
function computeFormationLabel(starters) {
  const counts = {};
  starters.forEach(p => {
    const pos = normalizePosition(p.position);
    if (pos === 'GK') return;
    counts[pos] = (counts[pos] || 0) + 1;
  });
  const parts = POSITION_ORDER.filter(pos => pos !== 'GK' && counts[pos]).map(pos => counts[pos]);
  return parts.length ? parts.join('-') : null;
}

// team: { name, logo } — hiển thị badge (logo thật hoặc initials theo màu
// áo) ở header cùng tỉ số + sơ đồ, để phân biệt "sơ đồ này là của đội nào"
// mà không cần đọc tiêu đề card bên ngoài.
function FormationPitch({ starters = [], kit, team, score, events = [], isWinner = false }) {
  const rows = POSITION_ORDER
    .map(pos => ({ pos, players: starters.filter(p => normalizePosition(p.position) === pos) }))
    .filter(r => r.players.length > 0);

  if (starters.length === 0) return null;

  const formationLabel = computeFormationLabel(starters);

  return (
    <div className={`relative rounded-2xl overflow-hidden border shadow-lg shadow-black/20 bg-linear-to-b from-emerald-700 to-emerald-800 ${isWinner ? 'border-amber-400/70 ring-1 ring-amber-400/40' : 'border-navy-light'}`}>
      {/* Header: logo + tên đội + tỉ số + sơ đồ chiến thuật + badge thắng */}
      <div className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <TeamBadge name={team?.name} logo={team?.logo} kit={kit} size={22} />
          <span className="text-xs font-black text-white uppercase tracking-wide truncate">{team?.name}</span>
          {isWinner && (
            <span className="shrink-0 flex items-center gap-1 text-[10px] font-black text-amber-300 bg-amber-500/10 border border-amber-400/40 rounded-full px-2 py-0.5">
              🏆 Thắng
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {score != null && (
            <span className="text-sm font-black text-white tabular-nums">{score}</span>
          )}
          {formationLabel && (
            <span className="text-[10px] font-bold text-emerald-200 bg-emerald-900/60 border border-emerald-500/30 rounded-full px-2 py-0.5">
              {formationLabel}
            </span>
          )}
        </div>
      </div>

      {/* Đường kẻ sân */}
      <div className="absolute inset-3 top-14 border-2 border-white/25 rounded-md pointer-events-none" />
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1/2 h-14 border-2 border-t-0 border-white/25 pointer-events-none" />
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-6 border-2 border-t-0 border-white/25 pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[58%] w-24 h-24 border-2 border-white/25 rounded-full -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 py-6 sm:py-8 flex flex-col gap-6 sm:gap-10">
        {rows.map(row => (
          <FormationRow key={row.pos} players={row.players} kit={kit} events={events} />
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function MatchDetail() {
  const { id } = useParams();
  const matchId = parseInt(id) || null;
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuthStore(useShallow(state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user
  })));

  const { fetchMatchDetail, matchDetailLoading, matchDetailError, getMatchDetailFromCache } = useScheduleStore(useShallow(state => ({
    fetchMatchDetail: state.fetchMatchDetail,
    matchDetailLoading: state.matchDetailLoading,
    matchDetailError: state.matchDetailError,
    getMatchDetailFromCache: state.getMatchDetailFromCache,
  })));

  const { teams, fetchTeams } = useTeamStore(useShallow(state => ({
    teams: state.teams,
    fetchTeams: state.fetchAll
  })));

  const [isLeader, setIsLeader] = useState(false);
  const [rawLineups, setRawLineups] = useState([]);

  const detailData = getMatchDetailFromCache(matchId);
  const match = detailData?.match || null;

  const { matchResult, jerseys, kitFor, isPenaltyResult, isExtraTimeResult } = useMatchExtras(match);

  useEffect(() => {
    if (teams.length === 0) fetchTeams();
  }, [fetchTeams, teams.length]);

  useEffect(() => {
    if (matchId) fetchMatchDetail(matchId);
  }, [matchId, fetchMatchDetail]);

  useEffect(() => {
    if (!matchId) return;
    let cancelled = false;
    matchLineupApi.getMatchLineups(matchId).then(res => {
      if (cancelled) return;
      setRawLineups(Array.isArray(res?.data) ? res.data : []);
    }).catch(err => console.warn('Could not fetch lineups', err));
    return () => { cancelled = true; };
  }, [matchId]);

  const lineups = useMemo(() => ({
    home: rawLineups.filter(l => l.team_id === match?.home_team_id),
    away: rawLineups.filter(l => l.team_id === match?.away_team_id),
  }), [rawLineups, match?.home_team_id, match?.away_team_id]);

  useEffect(() => {
    if (isAuthenticated && match && user) {
      teamApi.getTeams({ per_page: 50 }).then(res => {
        const teams = Array.isArray(res?.data) ? res.data : [];
        const leader = teams.some(t =>
          (t.id === match.home_team_id || t.id === match.away_team_id) &&
          t.user_id === user.id
        );
        setIsLeader(leader);
      }).catch(err => console.warn('Could not check leader status', err));
    }
  }, [isAuthenticated, match, user]);

  const isLoading = matchDetailLoading[matchId] || false;
  const matchApiError = matchDetailError[matchId] || null;
  const hasError = !matchId || (!isLoading && !matchApiError && !match);

  const events = detailData?.events || [];

  const homeTeamInfo = match?.home_team ?? teams.find(t => t.id === match?.home_team_id);
  const awayTeamInfo = match?.away_team ?? teams.find(t => t.id === match?.away_team_id);

  const homeName = homeTeamInfo?.name ?? `Đội #${match?.home_team_id ?? '?'}`;
  const awayName = awayTeamInfo?.name ?? `Đội #${match?.away_team_id ?? '?'}`;
  const hasScore = RESULT_AVAILABLE_STATUSES.has(match?.status)
    && match?.home_score != null && match?.away_score != null;
  const dateStr = match?.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
    : null;

  const homeStarters = lineups.home.filter(l => l.lineup_type === 'starter');
  const homeSubs = lineups.home.filter(l => l.lineup_type === 'substitute');
  const awayStarters = lineups.away.filter(l => l.lineup_type === 'starter');
  const awaySubs = lineups.away.filter(l => l.lineup_type === 'substitute');

  const homeKit = kitFor('home');
  const awayKit = kitFor('away');

  // "Thắng" chỉ xác định khi đã có tỉ số CHÍNH THỨC (hasScore) và không hoà
  // — không tự suy diễn winner_team_id vì matchResult chưa chắc có trong
  // payload `match` (tuỳ getMatchById có include hay không).
  const homeIsWinner = hasScore && match.home_score > match.away_score;
  const awayIsWinner = hasScore && match.away_score > match.home_score;

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
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20 relative z-10">

          {isLoading ? (
            <MatchHeaderSkeleton />
          ) : matchApiError ? (
            <div className="text-center space-y-4">
              <ApiBanner message={matchApiError} />
              <p className="text-gray-500 text-sm">Match ID: {matchId}</p>
            </div>
          ) : hasError || !match ? (
            <div className="flex flex-col items-center gap-4 text-gray-400 py-8">
              <WifiOff className="w-12 h-12 text-gray-600" />
              <p className="font-bold">Không tìm thấy trận đấu #{matchId}</p>
            </div>
          ) : (
            <div className="animate-slide-up">
              <div className="flex justify-center items-center gap-4 md:gap-16">
                {/* Jersey/kit chỉ hiện khi đã có tỉ số xác nhận — trước đó
                    kit có thể chưa chốt (đổi áo phút chót), tránh gây hiểu nhầm */}
                <TeamAvatar name={homeName} side="home" logo={homeTeamInfo?.logo} jersey={hasScore ? jerseys.home : null} size="lg" />

                {/* Score / VS / TBD */}
                <div className="flex flex-col items-center shrink-0 gap-3">
                  <div className="px-6 py-4 md:px-10 md:py-6 bg-navy border-2 border-navy-light rounded-3xl shadow-lg shadow-black/30 flex items-center gap-4 md:gap-8">
                    {hasScore ? (
                      <>
                        <span className="text-5xl md:text-7xl font-black text-white">{match.home_score}</span>
                        <span className="text-2xl md:text-4xl font-bold text-gray-500">–</span>
                        <span className="text-5xl md:text-7xl font-black text-white">{match.away_score}</span>
                      </>
                    ) : (
                      <span className="text-3xl md:text-5xl font-black text-gray-500 tracking-widest px-2">
                        {getVsLabel(match.status)}
                      </span>
                    )}
                  </div>

                  {isExtraTimeResult && (
                    <span className="text-xs text-amber-400 font-black uppercase tracking-widest">Sau hiệp phụ</span>
                  )}
                  {isPenaltyResult && (
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-widest rounded-full">
                      Pen {matchResult.home_penalty_score} – {matchResult.away_penalty_score}
                    </span>
                  )}

                  <StatusBadge status={match.status} size="fancy" />
                </div>

                <TeamAvatar name={awayName} side="away" logo={awayTeamInfo?.logo} jersey={hasScore ? jerseys.away : null} size="lg" />
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

          {/* Timeline */}
          <section className="lg:col-span-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3 animate-slide-up">
              <Activity className="w-6 h-6 text-neon" /> Diễn Biến Trận Đấu
            </h3>

            {events.length > 0 ? (
              <div className="bg-navy border border-navy-light rounded-2xl p-4 sm:p-6 shadow-lg shadow-black/20 relative overflow-hidden">
                <div className="absolute left-[39px] sm:left-[47px] top-8 bottom-8 w-px bg-navy-light z-0"></div>

                <div className="space-y-6 relative z-10">
                  {events.map((evt) => {
                    const isHome = evt.team_id === match.home_team_id;
                    // FIX: khớp đúng enum thật ('goal'/'own_goal'/'yellow_card'/
                    // 'second_yellow'/'red_card'/'penalty_scored'/'substitution_*')
                    // thay vì 'goal'/'yellow'/'red' cũ (không khớp gì cả, luôn rơi
                    // vào nhánh 🔄 mặc định).
                    const icon = GOAL_EVENT_TYPES.has(evt.type) ? '⚽'
                      : evt.type === 'own_goal' ? '⚽'
                        : evt.type === 'yellow_card' ? '🟨'
                          : evt.type === 'second_yellow' ? '🟨🟥'
                            : evt.type === 'red_card' ? '🟥'
                              : '🔄';
                    const eventLabel = EVENT_TYPE_LABEL[evt.type] ?? evt.type;
                    const allLineups = [...lineups.home, ...lineups.away];
                    const allPlayers = [...(detailData?.homePlayers || []), ...(detailData?.awayPlayers || [])];
                    const lineupPlayer = allLineups.find(l => l.player_id === evt.player_id);
                    const rosterPlayer = allPlayers.find(p => p.player_id === evt.player_id || p.id === evt.player_id);
                    const resolvedName = lineupPlayer ? (lineupPlayer.player?.name ?? lineupPlayer.player?.player?.name ?? lineupPlayer.name) : (rosterPlayer?.user?.name ?? rosterPlayer?.player?.user?.name ?? rosterPlayer?.player?.name ?? rosterPlayer?.name);
                    const playerName = resolvedName ?? evt.player?.user?.name ?? evt.player?.name ?? (evt.player_id ? `Cầu thủ #${evt.player_id}` : 'Không rõ cầu thủ');

                    return (
                      <div key={evt.id} className="flex items-center gap-4 sm:gap-6 group">
                        <div className="w-12 h-12 rounded-full border-4 border-navy bg-navy-dark flex items-center justify-center shrink-0 shadow-md shadow-black/20 z-10 text-neon font-mono font-black text-xs group-hover:border-neon/30 transition-colors">
                          {formatMinuteLabel(evt)}
                        </div>
                        <div className={`flex-1 bg-navy-dark/50 border border-navy-light rounded-xl p-3 sm:p-4 flex items-center gap-4 shadow-sm hover:bg-navy-dark transition-colors ${isHome ? 'border-l-blue-500/50 border-l-4' : 'border-l-amber-500/50 border-l-4'}`}>
                          <span className="text-2xl shrink-0 drop-shadow-md">{icon}</span>
                          <div className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                              <span className="font-bold text-white text-sm sm:text-base">{playerName}</span>
                              <span className={`text-[10px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded border ${isHome ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                {isHome ? 'Sân nhà' : 'Sân khách'}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{eventLabel}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-navy-dark border border-navy-light rounded-xl p-8 text-center text-gray-500">
                Chưa có sự kiện nào được ghi nhận.
              </div>
            )}
          </section>

          {/* Lineups */}
          <section className="animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                <Shield className="w-6 h-6 text-neon" /> Đội Hình
              </h3>
              {isLeader && (
                <button
                  onClick={() => navigate(`/tran-dau/${matchId}/doi-hinh`)}
                  className="px-4 py-2 bg-navy border border-neon/50 text-neon font-bold rounded-xl hover:bg-neon/10 transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(57,255,20,0.15)]"
                >
                  <Settings className="w-4 h-4" /> Cập nhật đội hình
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Home */}
              <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg shadow-black/20">
                {homeStarters.length > 0 ? (
                  <>
                    <FormationPitch
                      starters={homeStarters}
                      kit={homeKit}
                      team={{ name: homeName, logo: homeTeamInfo?.logo }}
                      score={hasScore ? match.home_score : null}
                      events={events}
                      isWinner={homeIsWinner}
                    />
                    {homeSubs.length > 0 && (
                      <>
                        <h5 className="text-xs font-bold text-gray-400 uppercase mt-4 mb-2">Dự bị</h5>
                        <ul>
                          {homeSubs.map(lu => (
                            <PlayerItem key={lu.id} tp={lu} isCap={lu.is_captain} />
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-navy-light">
                      <TeamBadge name={homeName} logo={homeTeamInfo?.logo} kit={homeKit} size={20} />
                      <h4 className="font-bold text-white text-sm uppercase tracking-wider truncate">{homeName}</h4>
                    </div>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 opacity-80">
                      <Clock className="w-10 h-10 mb-3 text-neon/50 animate-pulse" />
                      <p className="text-sm font-medium tracking-wide">Hiện đang chờ đội hình</p>
                    </div>
                  </>
                )}
              </div>

              {/* Away */}
              <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg shadow-black/20">
                {awayStarters.length > 0 ? (
                  <>
                    <FormationPitch
                      starters={awayStarters}
                      kit={awayKit}
                      team={{ name: awayName, logo: awayTeamInfo?.logo }}
                      score={hasScore ? match.away_score : null}
                      events={events}
                      isWinner={awayIsWinner}
                    />
                    {awaySubs.length > 0 && (
                      <>
                        <h5 className="text-xs font-bold text-gray-400 uppercase mt-4 mb-2">Dự bị</h5>
                        <ul>
                          {awaySubs.map(lu => (
                            <PlayerItem key={lu.id} tp={lu} isCap={lu.is_captain} />
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-navy-light">
                      <TeamBadge name={awayName} logo={awayTeamInfo?.logo} kit={awayKit} size={20} />
                      <h4 className="font-bold text-white text-sm uppercase tracking-wider truncate">{awayName}</h4>
                    </div>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 opacity-80">
                      <Clock className="w-10 h-10 mb-3 text-neon/50 animate-pulse" />
                      <p className="text-sm font-medium tracking-wide">Hiện đang chờ đội hình</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}