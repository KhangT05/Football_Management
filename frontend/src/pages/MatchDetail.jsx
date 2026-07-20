// src/pages/MatchDetail.jsx
import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Shield, Activity, WifiOff, Settings, Trophy } from 'lucide-react';

import { RESULT_AVAILABLE_STATUSES } from '../components/MatchShared';
import { useMatchDetail, useIsMatchLeader } from '../queries/useMatchDetail.queries';
import useTeamStore from '../store/teamStore';
import MatchHeaderSkeleton from '../components/skeletons/MatchHeaderSkeleton';
import StatusBadge from '../components/ui/StatusBadge';
import {
  TeamAvatar, TeamBadge, PlayerItem,
  normalizePosition, POSITION_ORDER,
  FormationRow, computeFormationLabel,
  GOAL_EVENT_TYPES, EVENT_TYPE_LABEL, formatMinuteLabel, resolveEventPlayerName,
  getVsLabel,
} from '../components/MatchShared';
import { EVENT_ICON } from '../data/data';

function FormationPitch({ starters = [], kit, team, score, events = [], isWinner = false }) {
  const rows = POSITION_ORDER
    .map(pos => ({ pos, players: starters.filter(p => normalizePosition(p.position) === pos) }))
    .filter(r => r.players.length > 0);

  if (starters.length === 0) return null;
  const formationLabel = computeFormationLabel(starters);

  return (
    <div className={`relative rounded-2xl overflow-hidden border shadow-lg shadow-black/20 bg-linear-to-b from-emerald-700 to-emerald-800 ${isWinner ? 'border-amber-400/70 ring-1 ring-amber-400/40' : 'border-navy-light'}`}>
      <div className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <TeamBadge name={team?.name} logo={team?.logo} kit={kit} size={22} />
          <span className="text-xs font-black text-white uppercase tracking-wide truncate">{team?.name}</span>
          {isWinner && (
            <span className="shrink-0 flex items-center gap-1 text-[10px] font-black text-amber-300 bg-amber-500/10 border border-amber-400/40 rounded-full px-2 py-0.5">
              <Trophy className="w-3 h-3" /> Thắng
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {score != null && <span className="text-sm font-black text-white tabular-nums">{score}</span>}
          {formationLabel && (
            <span className="text-[10px] font-bold text-emerald-200 bg-emerald-900/60 border border-emerald-500/30 rounded-full px-2 py-0.5">
              {formationLabel}
            </span>
          )}
        </div>
      </div>

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

function headerEventIcon(evt) {
  if (evt.type === 'own_goal') return EVENT_ICON.own_goal;
  if (GOAL_EVENT_TYPES.has(evt.type)) return EVENT_ICON.goal;
  if (evt.type === 'yellow_card') return EVENT_ICON.yellow_card;
  if (evt.type === 'second_yellow') return EVENT_ICON.second_yellow;
  return EVENT_ICON.red_card;
}

function computeTeamEventStats(teamId, opponentId, events) {
  const teamEvents = events.filter(e => e.team_id === teamId);
  return {
    goals: teamEvents.filter(e => GOAL_EVENT_TYPES.has(e.type)).length
      + events.filter(e => e.team_id === opponentId && e.type === 'own_goal').length,
    yellows: teamEvents.filter(e => e.type === 'yellow_card').length,
    reds: teamEvents.filter(e => e.type === 'red_card' || e.type === 'second_yellow').length,
  };
}

const HEADER_SUMMARY_TYPES = new Set(['goal', 'penalty_scored', 'own_goal', 'yellow_card', 'second_yellow', 'red_card']);

function HeaderMatchEventsSummary({ homeTeamId, events, resolveName }) {
  const timeline = events
    .filter(e => HEADER_SUMMARY_TYPES.has(e.type))
    .slice()
    .sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0) || (a.added_minute ?? 0) - (b.added_minute ?? 0));

  if (timeline.length === 0) return null;

  return (
    <div className="mt-6 w-full max-w-md mx-auto flex flex-col gap-1.5">
      {timeline.map(evt => {
        const isHome = evt.team_id === homeTeamId;
        const name = resolveName(evt);
        const label = evt.type === 'own_goal' ? `${name} (phản lưới)` : name;
        return (
          <div key={evt.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <span className={`truncate text-xs font-bold text-gray-300 text-right ${!isHome ? 'invisible' : ''}`}>
              {isHome ? `${label} ${formatMinuteLabel(evt)}` : '·'}
            </span>
            <span className="text-sm shrink-0 leading-none">{headerEventIcon(evt)}</span>
            <span className={`truncate text-xs font-bold text-gray-300 text-left ${isHome ? 'invisible' : ''}`}>
              {!isHome ? `${label} ${formatMinuteLabel(evt)}` : '·'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function MatchDetail() {
  const { id } = useParams();
  const matchId = parseInt(id) || null;
  const navigate = useNavigate();

  const {
    match, matchResult, events, lineups: rawLineups, playerNames, jerseys,
    isLoading, isFatalError,
  } = useMatchDetail(matchId);

  const isLeader = useIsMatchLeader(match);
  const teams = useTeamStore(s => s.teams);
  const fetchTeams = useTeamStore(s => s.fetchAll);

  useMemo(() => { if (teams.length === 0) fetchTeams(); }, [teams.length, fetchTeams]);

  const lineups = useMemo(() => ({
    home: rawLineups.filter(l => l.team_id === match?.home_team_id),
    away: rawLineups.filter(l => l.team_id === match?.away_team_id),
  }), [rawLineups, match?.home_team_id, match?.away_team_id]);

  // hasError phụ thuộc DUY NHẤT vào matchQuery (endpoint đã xác nhận ổn
  // định qua network log: GET /matches/{id} -> 200). /result lỗi (403/404/
  // bất kỳ) KHÔNG được phép kéo trang vào trạng thái lỗi — xử lý qua
  // matchResult=null + hasScore=false, degrade UI bằng StatusBadge.
  const hasError = !matchId || (!isLoading && isFatalError) || (!isLoading && !isFatalError && !match);

  const homeTeamInfo = match?.home_team ?? teams.find(t => t.id === match?.home_team_id);
  const awayTeamInfo = match?.away_team ?? teams.find(t => t.id === match?.away_team_id);
  const homeName = homeTeamInfo?.name ?? `Đội #${match?.home_team_id ?? '?'}`;
  const awayName = awayTeamInfo?.name ?? `Đội #${match?.away_team_id ?? '?'}`;

  const finalHomeScore = matchResult?.home_final_score ?? null;
  const finalAwayScore = matchResult?.away_final_score ?? null;
  const hasScore = RESULT_AVAILABLE_STATUSES.has(match?.status)
    && finalHomeScore != null && finalAwayScore != null;

  const dateStr = match?.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
    : null;

  const enrichWithName = (l) => ({ ...l, name: playerNames[l.player_id] ?? `Cầu thủ #${l.player_id}` });
  const homeStarters = lineups.home.filter(l => l.lineup_type === 'starter').map(enrichWithName);
  const homeSubs = lineups.home.filter(l => l.lineup_type === 'substitute').map(enrichWithName);
  const awayStarters = lineups.away.filter(l => l.lineup_type === 'starter').map(enrichWithName);
  const awaySubs = lineups.away.filter(l => l.lineup_type === 'substitute').map(enrichWithName);

  const DEFAULT_KIT = {
    home: { bg: '#1d4ed8', text: '#ffffff', border: 'rgba(255,255,255,0.5)' },
    away: { bg: '#c2410c', text: '#ffffff', border: 'rgba(255,255,255,0.5)' },
  };
  const kitFor = (side) => {
    const jersey = jerseys[side];
    if (jersey?.primary_color) {
      return { bg: jersey.primary_color, text: jersey.secondary_color || '#ffffff', border: 'rgba(255,255,255,0.5)' };
    }
    return DEFAULT_KIT[side];
  };
  const homeKit = kitFor('home');
  const awayKit = kitFor('away');

  const isPenaltyResult = matchResult?.result_type === 'penalty'
    && matchResult?.home_penalty_score != null && matchResult?.away_penalty_score != null;
  const isExtraTimeResult = matchResult?.result_type === 'extra_time';

  const homeIsWinner = hasScore && (
    matchResult?.winner_team_id != null
      ? matchResult.winner_team_id === match.home_team_id
      : finalHomeScore > finalAwayScore
  );
  const awayIsWinner = hasScore && (
    matchResult?.winner_team_id != null
      ? matchResult.winner_team_id === match.away_team_id
      : finalAwayScore > finalHomeScore
  );

  const allPlayers = useMemo(
    () => Object.entries(playerNames).map(([player_id, name]) => ({ player_id, name })),
    [playerNames]
  );
  const resolveEventName = (evt) => resolveEventPlayerName(evt, allPlayers);

  const homeEventStats = useMemo(
    () => computeTeamEventStats(match?.home_team_id, match?.away_team_id, events),
    [match?.home_team_id, match?.away_team_id, events]
  );
  const awayEventStats = useMemo(
    () => computeTeamEventStats(match?.away_team_id, match?.home_team_id, events),
    [match?.away_team_id, match?.home_team_id, events]
  );

  useMemo(() => {
    if (!hasScore || events.length === 0) return;
    if (homeEventStats.goals !== finalHomeScore) {
      console.warn(`[MatchDetail] Score mismatch match #${matchId} (home): result=${finalHomeScore} vs events=${homeEventStats.goals}`);
    }
    if (awayEventStats.goals !== finalAwayScore) {
      console.warn(`[MatchDetail] Score mismatch match #${matchId} (away): result=${finalAwayScore} vs events=${awayEventStats.goals}`);
    }
  }, [hasScore, events.length, homeEventStats.goals, awayEventStats.goals, finalHomeScore, finalAwayScore, matchId]);

  return (
    <div className="min-h-screen bg-navy-dark text-white pb-20">

      <div className="container mx-auto px-4 lg:px-8 pt-6 animate-fade-in">
        <Link to="/lich-thi-dau" className="inline-flex items-center gap-2 text-gray-400 hover:text-neon transition-colors text-sm font-bold uppercase tracking-wider group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Lịch thi đấu
        </Link>
      </div>

      <section className="relative mt-6 mb-12 bg-navy border-b border-navy-light shadow-lg shadow-black/20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20 relative z-10">

          {isLoading ? (
            <MatchHeaderSkeleton />
          ) : hasError ? (
            <div className="flex flex-col items-center gap-4 text-gray-400 py-8">
              <WifiOff className="w-12 h-12 text-gray-600" />
              <p className="font-bold">Không tìm thấy trận đấu #{matchId}</p>
            </div>
          ) : (
            <div className="animate-slide-up">
              <div className="flex justify-center items-center gap-4 md:gap-16">
                <TeamAvatar name={homeName} side="home" logo={homeTeamInfo?.logo} jersey={hasScore ? jerseys.home : null} size="lg" isWinner={homeIsWinner} />

                <div className="flex flex-col items-center shrink-0 gap-3">
                  <div className="px-6 py-4 md:px-10 md:py-6 bg-navy border-2 border-navy-light rounded-3xl shadow-lg shadow-black/30 flex items-center gap-4 md:gap-8">
                    {hasScore ? (
                      <>
                        <span className="text-5xl md:text-7xl font-black text-white">{finalHomeScore}</span>
                        <span className="text-2xl md:text-4xl font-bold text-gray-500">–</span>
                        <span className="text-5xl md:text-7xl font-black text-white">{finalAwayScore}</span>
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

                  {/* Nguồn hiển thị duy nhất khi chưa/không có tỉ số — nhất
                      quán với card ở trang lịch thi đấu (CHỜ XÁC NHẬN / CẦN
                      RÀ SOÁT). KHÔNG hiện banner lỗi ở đây dù /result 403. */}
                  <StatusBadge status={match.status} size="fancy" />
                </div>

                <TeamAvatar name={awayName} side="away" logo={awayTeamInfo?.logo} jersey={hasScore ? jerseys.away : null} size="lg" isWinner={awayIsWinner} />
              </div>

              {hasScore && (
                <HeaderMatchEventsSummary homeTeamId={match.home_team_id} events={events} resolveName={resolveEventName} />
              )}

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

      {!isLoading && !hasError && match && (
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10">

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
                    const icon = EVENT_ICON[evt.type] || (GOAL_EVENT_TYPES.has(evt.type) ? EVENT_ICON.goal : EVENT_ICON.substitution_in);
                    const eventLabel = EVENT_TYPE_LABEL[evt.type] ?? evt.type;
                    const playerName = resolveEventName(evt);

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
              <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg shadow-black/20">
                {homeStarters.length > 0 ? (
                  <>
                    <FormationPitch starters={homeStarters} kit={homeKit} team={{ name: homeName, logo: homeTeamInfo?.logo }} score={hasScore ? finalHomeScore : null} events={events} isWinner={homeIsWinner} />
                    {homeSubs.length > 0 && (
                      <>
                        <h5 className="text-xs font-bold text-gray-400 uppercase mt-4 mb-2">Dự bị</h5>
                        <ul>{homeSubs.map(lu => <PlayerItem key={lu.id} tp={lu} isCap={lu.is_captain} />)}</ul>
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

              <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg shadow-black/20">
                {awayStarters.length > 0 ? (
                  <>
                    <FormationPitch starters={awayStarters} kit={awayKit} team={{ name: awayName, logo: awayTeamInfo?.logo }} score={hasScore ? finalAwayScore : null} events={events} isWinner={awayIsWinner} />
                    {awaySubs.length > 0 && (
                      <>
                        <h5 className="text-xs font-bold text-gray-400 uppercase mt-4 mb-2">Dự bị</h5>
                        <ul>{awaySubs.map(lu => <PlayerItem key={lu.id} tp={lu} isCap={lu.is_captain} />)}</ul>
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