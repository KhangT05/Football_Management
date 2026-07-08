import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Shield, Activity, WifiOff, Construction, Settings, Star } from 'lucide-react';

import { getInitials, POSITION_LABELS } from '../utils/constants';
import { useShallow } from 'zustand/react/shallow';
import useScheduleStore from '../store/scheduleStore';
import useAuthStore from '../store/authStore';
import MatchHeaderSkeleton from '../components/skeletons/MatchHeaderSkeleton';
import StatusBadge from '../components/ui/StatusBadge';
import { teamApi, matchLineupApi } from '../api';
import useTeamStore from '../store/teamStore';

// ── Helpers ───────────────────────────────────────────────────
const POSITION_COLORS = {
  GK:  'bg-amber-400/10 text-amber-400',
  DEF: 'bg-blue-400/10 text-blue-400',
  MID: 'bg-emerald-400/10 text-emerald-400',
  FW:  'bg-red-400/10 text-red-400',
};

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
function PlayerItem({ tp, isCap }) {
  const name = tp.player?.name ?? tp.player?.player?.name ?? tp.name ?? `#${tp.player_id}`;
  const pos = tp.position;
  const jersey = tp.jersey_number ?? '?';
  return (
    <li className="flex items-center gap-2.5 py-2 border-b border-navy-light/50 last:border-0 relative group">
      <span className="w-7 text-right font-mono text-neon font-bold text-xs shrink-0">
        #{jersey}
      </span>
      <span className="font-medium text-white text-sm flex-1 truncate flex items-center gap-2">
        {name}
        {isCap && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" title="Đội trưởng" />}
      </span>
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
  const [lineups, setLineups] = useState({ home: [], away: [] });

  const detailData = getMatchDetailFromCache(matchId);
  const match = detailData?.match || null;

  useEffect(() => {
    if (teams.length === 0) fetchTeams();
  }, [fetchTeams, teams.length]);

  useEffect(() => {
    if (matchId) {
      fetchMatchDetail(matchId);
      // Fetch match lineups
      matchLineupApi.getMatchLineups(matchId).then(res => {
        const allLineups = Array.isArray(res?.data) ? res.data : [];
        setLineups({
          home: allLineups.filter(l => l.team_id === match?.home_team_id),
          away: allLineups.filter(l => l.team_id === match?.away_team_id)
        });
      }).catch(err => console.warn('Could not fetch lineups', err));
    }
  }, [matchId, fetchMatchDetail, match?.home_team_id, match?.away_team_id]);

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
  const hasScore = match?.home_score != null && match?.away_score != null;
  const dateStr = match?.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
    : null;

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
                  <StatusBadge status={match.status} size="fancy" />
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

          {/* Timeline */}
          <section className="lg:col-span-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3 animate-slide-up">
              <Activity className="w-6 h-6 text-neon" /> Diễn Biến Trận Đấu
            </h3>
            
            {events.length > 0 ? (
              <div className="bg-navy border border-navy-light rounded-2xl p-4 sm:p-6 shadow-lg shadow-black/20 relative overflow-hidden">
                {/* Dây timeline dọc */}
                <div className="absolute left-[39px] sm:left-[47px] top-8 bottom-8 w-px bg-navy-light z-0"></div>

                <div className="space-y-6 relative z-10">
                  {events.map((evt) => {
                    const isHome = evt.team_id === match.home_team_id;
                    const icon = evt.type === 'goal' ? '⚽' : evt.type === 'yellow' ? '🟨' : evt.type === 'red' ? '🟥' : '🔄';
                    const allLineups = [...lineups.home, ...lineups.away];
                    const allPlayers = [...(detailData?.homePlayers || []), ...(detailData?.awayPlayers || [])];
                    const lineupPlayer = allLineups.find(l => l.player_id === evt.player_id);
                    const rosterPlayer = allPlayers.find(p => p.player_id === evt.player_id || p.id === evt.player_id);
                    const resolvedName = lineupPlayer ? (lineupPlayer.player?.name ?? lineupPlayer.player?.player?.name ?? lineupPlayer.name) : (rosterPlayer?.user?.name ?? rosterPlayer?.player?.user?.name ?? rosterPlayer?.player?.name ?? rosterPlayer?.name);
                    const playerName = resolvedName ?? evt.player?.user?.name ?? evt.player?.name ?? `Cầu thủ #${evt.player_id}`;
                    
                    return (
                      <div key={evt.id} className="flex items-center gap-4 sm:gap-6 group">
                        <div className="w-12 h-12 rounded-full border-4 border-navy bg-navy-dark flex items-center justify-center shrink-0 shadow-md shadow-black/20 z-10 text-neon font-mono font-black text-sm group-hover:border-neon/30 transition-colors">
                          {evt.minute}'
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
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{evt.type}</span>
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
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-navy-light">
                  <div className="w-5 h-5 rounded bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white text-xs font-black">
                    {getInitials(homeName)[0]}
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider truncate">{homeName}</h4>
                </div>
                {lineups.home.length > 0 ? (
                  <>
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Đá chính</h5>
                    <ul className="mb-4">
                      {lineups.home.filter(l => l.lineup_type === 'starter').map(lu => (
                        <PlayerItem key={lu.id} tp={lu} isStarter={true} isCap={lu.is_captain} />
                      ))}
                    </ul>
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Dự bị</h5>
                    <ul>
                      {lineups.home.filter(l => l.lineup_type === 'substitute').map(lu => (
                        <PlayerItem key={lu.id} tp={lu} isStarter={false} />
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 opacity-80">
                    <Clock className="w-10 h-10 mb-3 text-neon/50 animate-pulse" />
                    <p className="text-sm font-medium tracking-wide">Hiện đang chờ đội hình</p>
                  </div>
                )}
              </div>

              {/* Away */}
              <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg shadow-black/20">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-navy-light">
                  <div className="w-5 h-5 rounded bg-linear-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white text-xs font-black">
                    {getInitials(awayName)[0]}
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider truncate">{awayName}</h4>
                </div>
                {lineups.away.length > 0 ? (
                  <>
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Đá chính</h5>
                    <ul className="mb-4">
                      {lineups.away.filter(l => l.lineup_type === 'starter').map(lu => (
                        <PlayerItem key={lu.id} tp={lu} isStarter={true} isCap={lu.is_captain} />
                      ))}
                    </ul>
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Dự bị</h5>
                    <ul>
                      {lineups.away.filter(l => l.lineup_type === 'substitute').map(lu => (
                        <PlayerItem key={lu.id} tp={lu} isStarter={false} />
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 opacity-80">
                    <Clock className="w-10 h-10 mb-3 text-neon/50 animate-pulse" />
                    <p className="text-sm font-medium tracking-wide">Hiện đang chờ đội hình</p>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
