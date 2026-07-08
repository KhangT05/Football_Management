import { useState, useEffect } from 'react';
import { X, Clock, Shield, Activity, Users } from 'lucide-react';
import { teamApi, matchApi, matchLineupApi } from '../api';
import { getInitials, POSITION_LABELS } from '../utils/constants';

// ─── Constants ────────────────────────────────────────────────────────────────

const POSITION_COLORS = {
  GK: 'bg-amber-400/10 text-amber-400',
  DEF: 'bg-blue-400/10 text-blue-400',
  MID: 'bg-emerald-400/10 text-emerald-400',
  FW: 'bg-red-400/10 text-red-400',
};

// Full MatchStatus coverage — trước đây chỉ map finished/ongoing, mọi status
// khác (pending_official, needs_review, forfeited, abandoned, postponed, bye)
// rơi vào fallback sai "Sắp diễn ra".
const STATUS_LABEL = {
  scheduled: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  pending_official: 'Chờ xác nhận',
  needs_review: 'Cần rà soát',
  finished: 'Đã kết thúc',
  forfeited: 'Xử thua (forfeit)',
  abandoned: 'Đã hủy giữa chừng',
  postponed: 'Hoãn',
  bye: 'Miễn thi đấu',
  cancelled: 'Đã hủy',
};

const STATUS_BADGE_COLOR = {
  ongoing: 'bg-red-500/10 border-red-500/20 text-red-400',
  pending_official: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  needs_review: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  finished: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  forfeited: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  abandoned: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
  cancelled: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
};

// Status không có event thật (chưa từng recordEvent) — khỏi gọi API, khỏi
// render timeline giả "đang cập nhật" gây hiểu lầm là live.
const NO_EVENT_STATUSES = new Set(['scheduled', 'cancelled', 'postponed', 'bye']);

const EVENT_ICON = {
  goal: <span className="text-lg leading-none">⚽</span>,
  own_goal: <span className="text-lg leading-none">⚽</span>,
  penalty_scored: <span className="text-lg leading-none">🥅</span>,
  yellow_card: <div className="w-3 h-4 bg-yellow-400 rounded-sm shadow-[0_0_5px_rgba(250,204,21,0.5)]" />,
  second_yellow: (
    <div className="relative w-4 h-4 shrink-0">
      <div className="absolute inset-y-0 left-0 w-3 h-4 bg-yellow-400 rounded-sm" />
      <div className="absolute inset-y-0 left-1 w-3 h-4 bg-red-500 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
    </div>
  ),
  red_card: <div className="w-3 h-4 bg-red-500 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]" />,
  substitution_in: <span className="text-lg leading-none">🔄</span>,
  substitution_out: <span className="text-lg leading-none">🔄</span>,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlayerItem({ tp }) {
  const name = tp.name;
  let rawPos = tp.position;
  if (rawPos === 'goalkeeper') rawPos = 'GK';
  if (rawPos === 'defender') rawPos = 'DEF';
  if (rawPos === 'midfielder') rawPos = 'MID';
  if (rawPos === 'forward') rawPos = 'FW';

  return (
    <li className="flex items-center gap-3 py-2.5 border-b border-navy-light/50 last:border-0 hover:bg-navy-light/30 px-2 rounded-lg transition-colors">
      <span className="w-7 h-7 flex items-center justify-center rounded-md bg-navy-light/50 font-mono text-neon font-bold text-xs shrink-0">{tp.jersey_number ?? '?'}</span>
      <span className="font-medium text-white text-sm flex-1 truncate flex items-center gap-2">
        {name}
        {tp.is_captain && <span className="w-4 h-4 flex items-center justify-center bg-amber-500/20 text-amber-500 text-[10px] font-black rounded-full border border-amber-500/30" title="Đội trưởng">C</span>}
      </span>
      {rawPos && <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${POSITION_COLORS[rawPos] ?? 'bg-gray-400/10 text-gray-400'}`}>{POSITION_LABELS[rawPos] ?? rawPos}</span>}
    </li>
  );
}

function PlayerColumn({ title, color, players, loading }) {
  const borderCls = color === 'blue' ? 'text-blue-400' : 'text-rose-400';
  const badgeCls = color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400';

  const starters = players.filter(p => p.lineup_type === 'starter');
  const subs = players.filter(p => p.lineup_type === 'substitute');
  const unregistered = players.filter(p => p.lineup_type === 'unregistered');

  return (
    <div className="flex flex-col min-h-0 h-full bg-navy border border-navy-light rounded-2xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-navy-light/50 shrink-0">
        <Shield className={`w-5 h-5 ${borderCls}`} />
        <h3 className="font-black text-white uppercase tracking-wider text-sm truncate flex-1">{title}</h3>
        <span className={`${badgeCls} text-[10px] font-black px-2 py-0.5 rounded uppercase shrink-0`}>Đội hình</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          [1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-10 w-full rounded-lg mb-3" />)
        ) : unregistered.length > 0 ? (
          <ul>{unregistered.map(p => <PlayerItem key={p.id} tp={p} />)}</ul>
        ) : starters.length > 0 || subs.length > 0 ? (
          <div className="space-y-6">
            {starters.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Đá chính
                </h4>
                <ul>{starters.map(p => <PlayerItem key={p.id} tp={p} />)}</ul>
              </div>
            )}
            {subs.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  Dự bị
                </h4>
                <ul>{subs.map(p => <PlayerItem key={p.id} tp={p} />)}</ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6 text-sm">Chưa có danh sách</p>
        )}
      </div>
    </div>
  );
}

function EventTimeline({ events, status, allPlayers = [] }) {
  if (NO_EVENT_STATUSES.has(status)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10 opacity-70">
        <Clock className="w-12 h-12 mb-3 text-gray-600" />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Trận đấu chưa diễn ra</p>
      </div>
    );
  }
  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-70 py-10">
        <Activity className="w-10 h-10 mb-3 text-gray-600" />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Đang cập nhật diễn biến</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2 relative">
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-navy-light/50 -translate-x-1/2" />
      {events.map((ev, i) => {
        const isHome = ev.team === 'home';
        return (
          <div key={i} className={`flex items-center w-full relative z-10 ${isHome ? 'justify-start' : 'justify-end'}`}>
            <div className={`w-1/2 flex items-center ${isHome ? 'justify-end pr-4' : 'justify-start pl-4'}`}>
              <div className={`flex flex-col ${isHome ? 'items-end' : 'items-start'} bg-navy border border-navy-light p-2.5 rounded-xl shadow-lg w-full max-w-[180px]`}>
                <div className="flex items-center gap-1.5 mb-1">
                  {isHome && EVENT_ICON[ev.type]}
                  <span className="text-xs font-black text-gray-400">{ev.time}'</span>
                  {!isHome && EVENT_ICON[ev.type]}
                </div>
                <span className="text-sm font-bold text-white line-clamp-1">{allPlayers.find(p => p.id === ev.player_id)?.name || ev.player}</span>
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-navy border-2 border-navy-light" />
          </div>
        );
      })}
    </div>
  );
}

const TeamAvatar = ({ name, side, logo }) => {
  // Đồng bộ ngôn ngữ màu với PlayerColumn/tab lineup: home = blue, away = rose.
  // Bản cũ dùng amber/orange cho away — lệch hệ thống, không có lý do thẩm mỹ.
  const gradientCls = side === 'home'
    ? 'border-blue-500/30 from-blue-700 to-cyan-800 shadow-blue-900/30'
    : 'border-rose-500/30 from-rose-700 to-pink-800 shadow-rose-900/30';
  const borderOnly = side === 'home' ? 'border-blue-500/30' : 'border-rose-500/30';
  return (
    <div className="flex flex-col items-center flex-1 max-w-[150px]">
      {logo
        ? <img src={logo} alt={name} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-2 ${borderOnly}`} />
        : <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 bg-linear-to-br flex items-center justify-center font-black text-2xl text-white shadow-lg ${gradientCls}`}>{getInitials(name)}</div>
      }
      <h2 className="mt-3 text-center font-bold text-sm sm:text-base text-white uppercase line-clamp-2">{name}</h2>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MatchModal({ match, onClose }) {
  const [playerState, setPlayerState] = useState({ home: [], away: [], loading: true });
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);

  const { home: homePlayers, away: awayPlayers, loading: loadingPlayers } = playerState;

  // Lock body scroll
  useEffect(() => {
    if (!match) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [match]);

  // Fetch players and lineups
  useEffect(() => {
    if (!match) return;
    let cancelled = false;
    const parse = (res) => {
      const p = typeof res?.status === 'boolean' ? res.data : res;
      return Array.isArray(p?.data) ? p.data : Array.isArray(p) ? p : [];
    };
    setTimeout(() => { if (!cancelled) setPlayerState(s => ({ ...s, loading: true })); }, 0);
    Promise.allSettled([
      teamApi.getPlayers(match.home_team_id, { per_page: 50 }),
      teamApi.getPlayers(match.away_team_id, { per_page: 50 }),
      matchLineupApi.getMatchLineups(match.id)
    ]).then(([h, a, l]) => {
      if (cancelled) return;
      const homeRoster = h.status === 'fulfilled' ? parse(h.value) : [];
      const awayRoster = a.status === 'fulfilled' ? parse(a.value) : [];
      const lineups = l.status === 'fulfilled' ? parse(l.value) : [];

      const homeLineup = lineups.filter(x => x.team_id === match.home_team_id);
      const awayLineup = lineups.filter(x => x.team_id === match.away_team_id);

      const buildTeamPlayers = (roster, lineup) => {
        if (lineup.length === 0) {
           return roster.map(rPlayer => ({
             id: rPlayer.id,
             name: rPlayer?.user?.name ?? rPlayer?.player?.user?.name ?? rPlayer?.player?.name ?? rPlayer?.name ?? `#${rPlayer.player_id}`,
             jersey_number: rPlayer.jersey_number ?? rPlayer.number ?? '?',
             position: rPlayer.position,
             lineup_type: 'unregistered',
             is_captain: false
           }));
        }
        return lineup.map(entry => {
           const rPlayer = roster.find(p => p.player_id === entry.player_id || p.player?.id === entry.player_id);
           return {
             id: entry.player_id,
             name: rPlayer?.user?.name ?? rPlayer?.player?.user?.name ?? rPlayer?.player?.name ?? rPlayer?.name ?? entry.player?.name ?? `Cầu thủ #${entry.player_id}`,
             jersey_number: entry.jersey_number ?? rPlayer?.jersey_number ?? rPlayer?.number,
             position: entry.position,
             lineup_type: entry.lineup_type,
             is_captain: entry.is_captain
           };
        });
      };

      setPlayerState({ 
        home: buildTeamPlayers(homeRoster, homeLineup), 
        away: buildTeamPlayers(awayRoster, awayLineup), 
        loading: false 
      });
    });
    return () => { cancelled = true; };
  }, [match]);

  // ESC close
  useEffect(() => {
    if (!match) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [match, onClose]);

  // Fetch events — bỏ qua status chắc chắn không có event (giảm 1 network call vô ích)
  useEffect(() => {
    if (!match || NO_EVENT_STATUSES.has(match.status)) {
      setTimeout(() => setEvents([]), 0);
      return;
    }
    let cancelled = false;
    matchApi.getMatchEvents(match.id, { per_page: 100 }).then(res => {
      if (cancelled) return;
      const evs = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      const mappedEvents = evs.map(ev => ({
        time: ev.minute,
        team: ev.team_id === match.home_team_id ? 'home' : 'away',
        type: ev.type,
        player_id: ev.player_id,
        player: ev.player?.user?.name ?? ev.player?.name ?? `Cầu thủ #${ev.player_id}`,
      }));
      setEvents(mappedEvents.sort((a, b) => a.time - b.time));
    }).catch(err => {
      console.error('Fetch match events failed', err);
    });
    return () => { cancelled = true; };
  }, [match]);

  if (!match) return null;

  const homeName = match.home_team?.name ?? `Đội #${match.home_team_id}`;
  const awayName = match.away_team?.name ?? `Đội #${match.away_team_id}`;
  const hasScore = match.home_score != null && match.away_score != null;
  const statusLabel = STATUS_LABEL[match.status] ?? match.status;
  const badgeCls = STATUS_BADGE_COLOR[match.status] ?? 'bg-blue-500/10 border-blue-500/20 text-blue-400';

  return (
    // z-100 is supported or handled via custom config
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-navy-dark/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-5xl h-[min(720px,90vh)] bg-navy border border-navy-light shadow-2xl rounded-3xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">

        {/* Header */}
        <div className="relative shrink-0 p-6 bg-linear-to-b from-blue-900/20 to-transparent border-b border-navy-light/50">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-navy-light/50 hover:bg-navy-light text-gray-400 hover:text-white rounded-full transition-colors z-10">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center w-full gap-4 sm:gap-10 pt-2">
            <TeamAvatar name={homeName} side="home" logo={match.home_team?.logo} />

            <div className="flex flex-col items-center shrink-0">
              {hasScore
                ? <div className="px-5 py-3 sm:px-8 sm:py-4 bg-navy-dark border border-navy-light rounded-2xl shadow-inner flex items-center gap-3 sm:gap-5">
                  <span className="text-3xl sm:text-5xl font-black text-white">{match.home_score}</span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-500">–</span>
                  <span className="text-3xl sm:text-5xl font-black text-white">{match.away_score}</span>
                </div>
                : <div className="px-5 py-3 sm:px-8 sm:py-4 bg-navy-dark border border-navy-light rounded-2xl shadow-inner flex items-center justify-center">
                  <span className="text-xl sm:text-3xl font-black text-gray-400 tracking-widest italic">VS</span>
                </div>
              }
              <div className={`mt-3 px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${badgeCls}`}>
                <Clock className="w-3 h-3" /> {statusLabel}
              </div>
            </div>

            <TeamAvatar name={awayName} side="away" logo={match.away_team?.logo} />
          </div>
        </div>

        {/* Mobile tab nav */}
        <div className="lg:hidden flex border-b border-navy-light/50 bg-navy-dark/50 shrink-0">
          {[['events', Activity, 'Diễn biến', 'text-neon border-neon bg-neon/5'], ['lineup', Users, 'Đội hình', 'text-blue-400 border-blue-400 bg-blue-400/5']].map(([key, Icon, label, activeCls]) => (
            <button key={key} onClick={() => setActiveTab(key)} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${activeTab === key ? `${activeCls} border-b-2` : 'text-gray-400'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Body — flex-1 min-h-0, KHÔNG overflow-y-auto ở đây nữa: mỗi cột tự
            scroll độc lập bên trong (xem PlayerColumn/EventTimeline wrapper).
            Trước đây double scroll container (ngoài + trong) tranh nhau vì
            thiếu min-h-0 trong chain flex, khiến list bị nén/scroll sai. */}
        <div className="flex-1 min-h-0 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className={`${activeTab !== 'lineup' ? 'hidden lg:flex' : 'flex'} flex-col min-h-0`}>
              <PlayerColumn title={homeName} color="blue" players={homePlayers} loading={loadingPlayers} />
            </div>

            <div className={`${activeTab !== 'events' ? 'hidden lg:flex' : 'flex'} flex-col min-h-0 border border-navy-light/50 rounded-2xl bg-navy-dark/60 p-4 shadow-inner`}>
              <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-navy-light/50 shrink-0">
                <Activity className="w-5 h-5 text-neon" />
                <h3 className="font-black text-white uppercase tracking-wider text-sm">Diễn biến trận đấu</h3>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto px-2 custom-scrollbar">
                <EventTimeline events={events} status={match.status} allPlayers={[...homePlayers, ...awayPlayers]} />
              </div>
            </div>

            <div className={`${activeTab !== 'lineup' ? 'hidden lg:flex' : 'flex'} flex-col min-h-0`}>
              <PlayerColumn title={awayName} color="rose" players={awayPlayers} loading={loadingPlayers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}