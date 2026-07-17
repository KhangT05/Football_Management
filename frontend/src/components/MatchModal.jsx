import { useState, useEffect } from 'react';
import { X, Clock, MapPin, Shield, Activity, Users, ArrowRightLeft } from 'lucide-react';
import { teamApi, matchApi, matchLineupApi } from '../api';
import {
  useMatchExtras,
  TeamAvatar,
  PlayerItem,
  FormationRow,
  groupPlayersByPosition,
  computeFormationLabel,
  resolveEventPlayerName,
  formatMinuteLabel,
  GOAL_EVENT_TYPES,
  EVENT_TYPE_LABEL,
  STATUS_LABEL,
  STATUS_BADGE_COLOR,
  NO_EVENT_STATUSES,
  getVsLabel,
} from './MatchShared';
import { EVENT_ICON } from '../data/data';

// ─── Constants ────────────────────────────────────────────────────────────────
// FIX: dùng chung 1 nguồn icon duy nhất (EVENT_ICON từ data/data.js) thay vì
// tự implement lại y hệt logic ở local eventIcon() — trước đây 2 nơi định
// nghĩa icon cho cùng khái niệm, sửa 1 chỗ (vd thêm type mới) dễ quên chỗ kia.
function eventIcon(type) {
  return EVENT_ICON[type] ?? <ArrowRightLeft className="w-4 h-4" />;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FormationPitchSingleTeam({ starters, kit, events }) {
  const rows = groupPlayersByPosition(starters, { reverse: true });
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-6 opacity-70 border border-navy-light rounded-2xl bg-navy-dark/30">
        <Users className="w-8 h-8 mb-2 text-gray-600" />
        <p className="text-xs font-bold uppercase tracking-widest text-center">Chưa có đội hình ra sân</p>
      </div>
    );
  }
  return (
    <div
      className="relative flex flex-col justify-between h-full rounded-2xl overflow-hidden border border-emerald-900/40 py-3"
      style={{ background: 'repeating-linear-gradient(to bottom, #0f3d24 0px, #0f3d24 36px, #124a2c 36px, #124a2c 72px)' }}
    >
      <div className="relative rounded-2xl border border-navy-light overflow-hidden shadow-lg shadow-black/20 h-full w-full">
        <div className="absolute inset-0 bg-[#1e5e1e]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#1a521a_50%,transparent_50%)] bg-size-[100%_20%] opacity-50" />
        <div className="absolute inset-4 border-2 border-white/40 pointer-events-none" />
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/40 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-16 sm:w-24 h-16 sm:h-24 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-4 left-1/2 w-32 sm:w-48 h-12 sm:h-24 border-2 border-b-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-4 left-1/2 w-16 sm:w-24 h-4 sm:h-10 border-2 border-b-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-4 left-1/2 w-32 sm:w-48 h-12 sm:h-24 border-2 border-t-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-4 left-1/2 w-16 sm:w-24 h-4 sm:h-10 border-2 border-t-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute left-1/2 bottom-4 -translate-x-1/2 w-14 h-14 rounded-full border border-white/20 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-evenly py-6 pointer-events-auto z-10 text-white">
          {/* FIX: biến gốc là `orderedRows` (không tồn tại) → ReferenceError
              crash toàn bộ modal ngay khi có starters. Đổi sang `rows` đúng
              tên. Đồng thời row là { pos, players }, không phải mảng — dùng
              lại FormationRow (đã có sẵn trong MatchShared, dùng
              FormationPlayerCell) thay vì FormationPlayerDot chưa import và
              row.map(...) sai shape. Được thêm miễn phí: badge ⚽/OG/🟨🟥 trên
              sân, đồng bộ với PlayerColumn list view. */}
          {rows.map((row, i) => (
            <FormationRow key={row.pos ?? i} players={row.players} kit={kit} events={events} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerColumn({ title, side, players, loading, kit, events, viewMode, onToggleView }) {
  const color = side === 'home' ? 'blue' : 'rose';
  const borderCls = color === 'blue' ? 'text-blue-400' : 'text-rose-400';
  const badgeCls = color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400';
  const starters = players.filter(p => p.lineup_type === 'starter');
  const subs = players.filter(p => p.lineup_type === 'substitute');
  const unregistered = players.filter(p => p.lineup_type === 'unregistered');
  const hasFormationData = starters.length > 0;
  const formationLabel = hasFormationData ? computeFormationLabel(starters) : null;
  return (
    <div className="flex flex-col min-h-0 h-full bg-navy border border-navy-light rounded-2xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-navy-light/50 shrink-0">
        <Shield className={`w-5 h-5 ${borderCls}`} />
        <h3 className="font-black text-white uppercase tracking-wider text-sm truncate flex-1">{title}</h3>
        {formationLabel && (
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/40 border border-emerald-500/30 rounded-full px-2 py-0.5 shrink-0">
            {formationLabel}
          </span>
        )}
        <div className="flex items-center gap-1 bg-navy-dark/60 border border-navy-light rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => onToggleView('formation')}
            className={`px-2 py-1 rounded-md text-[10px] font-black uppercase transition-colors ${viewMode === 'formation' ? badgeCls : 'text-gray-500 hover:text-gray-300'}`}
          >
            Sơ đồ
          </button>
          <button
            onClick={() => onToggleView('list')}
            className={`px-2 py-1 rounded-md text-[10px] font-black uppercase transition-colors ${viewMode === 'list' ? badgeCls : 'text-gray-500 hover:text-gray-300'}`}
          >
            Danh sách
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          [1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-10 w-full rounded-lg mb-3" />)
        ) : viewMode === 'formation' ? (
          <div className="space-y-4 h-full flex flex-col">
            <div className="h-[300px] sm:h-[340px] shrink-0">
              <FormationPitchSingleTeam starters={starters} kit={kit} events={events} />
            </div>
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
        const resolvedName = resolveEventPlayerName(ev, allPlayers);
        const eventLabel = EVENT_TYPE_LABEL[ev.type] ?? ev.type;
        return (
          <div key={i} className={`flex items-center w-full relative z-10 ${isHome ? 'justify-start' : 'justify-end'}`}>
            <div className={`w-1/2 flex items-center ${isHome ? 'justify-end pr-4' : 'justify-start pl-4'}`}>
              <div className={`flex flex-col ${isHome ? 'items-end' : 'items-start'} bg-navy border border-navy-light p-2.5 rounded-xl shadow-lg w-full max-w-[180px]`}>
                <div className="flex items-center gap-1.5 mb-1">
                  {isHome && eventIcon(ev.type)}
                  <span className="text-xs font-black text-gray-400">{formatMinuteLabel(ev)}</span>
                  {!isHome && eventIcon(ev.type)}
                </div>
                <span className="text-sm font-bold text-white line-clamp-1">{resolvedName}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{eventLabel}</span>
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-navy border-2 border-navy-light" />
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MatchModal({ match, onClose }) {
  const [playerState, setPlayerState] = useState({ home: [], away: [], loading: true });
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [lineupView, setLineupView] = useState({ home: 'formation', away: 'formation' });
  const toggleLineupView = (side, mode) =>
    setLineupView(prev => ({ ...prev, [side]: mode }));
  const { home: homePlayers, away: awayPlayers, loading: loadingPlayers } = playerState;

  const {
    matchResult, jerseys, kitFor, isPenaltyResult, isExtraTimeResult,
    finalHomeScore, finalAwayScore, hasScore, homeIsWinner, awayIsWinner,
  } = useMatchExtras(match);

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
      if (h.status === 'rejected') console.warn('[MatchModal] getPlayers(home) failed:', match.home_team_id, h.reason);
      if (a.status === 'rejected') console.warn('[MatchModal] getPlayers(away) failed:', match.away_team_id, a.reason);
      if (l.status === 'rejected') console.warn('[MatchModal] getMatchLineups failed:', match.id, l.reason);
      const homeRoster = h.status === 'fulfilled' ? parse(h.value) : [];
      const awayRoster = a.status === 'fulfilled' ? parse(a.value) : [];
      const lineups = l.status === 'fulfilled' ? parse(l.value) : [];
      const homeLineup = lineups.filter(x => x.team_id === match.home_team_id);
      const awayLineup = lineups.filter(x => x.team_id === match.away_team_id);
      const buildTeamPlayers = (roster, lineup) => {
        if (lineup.length === 0) {
          return roster.map(rPlayer => ({
            id: rPlayer.id,
            player_id: rPlayer.player_id ?? rPlayer.id,
            name: rPlayer?.player?.user?.name ?? rPlayer?.player?.name ?? rPlayer?.name ?? `#${rPlayer.player_id ?? rPlayer.id}`,
            jersey_number: rPlayer.jersey_number ?? rPlayer.number ?? '?',
            position: rPlayer.position,
            lineup_type: 'unregistered',
            is_captain: false
          }));
        }
        return lineup.map(entry => {
          const rPlayer = roster.find(p => p.player_id === entry.player_id || p.player?.id === entry.player_id);
          return {
            id: entry.id ?? entry.player_id,
            player_id: entry.player_id,
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

  // Fetch events
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
        added_minute: ev.added_minute,
        team: ev.team_id === match.home_team_id ? 'home' : 'away',
        type: ev.type,
        player_id: ev.player_id,
        player: ev.player ?? null,
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
  const statusLabel = STATUS_LABEL[match.status] ?? match.status;
  const badgeCls = STATUS_BADGE_COLOR[match.status] ?? 'bg-blue-500/10 border-blue-500/20 text-blue-400';
  const dateStr = match.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' })
    : null;
  const allPlayers = [...homePlayers, ...awayPlayers];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-navy-dark/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-5xl h-[min(760px,92vh)] bg-navy border border-navy-light shadow-2xl rounded-3xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="relative shrink-0 p-6 bg-linear-to-b from-blue-900/20 to-transparent border-b border-navy-light/50">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-navy-light/50 hover:bg-navy-light text-gray-400 hover:text-white rounded-full transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center w-full gap-4 sm:gap-10 pt-2">
            <div className="flex flex-col items-center flex-1 max-w-[200px]">
              <TeamAvatar name={homeName} side="home" logo={match.home_team?.logo} jersey={hasScore ? jerseys.home : null} size="md" isWinner={homeIsWinner} />
            </div>
            <div className="flex flex-col items-center shrink-0">
              {hasScore
                ? <div className="px-5 py-3 sm:px-8 sm:py-4 bg-navy-dark border border-navy-light rounded-2xl shadow-inner flex items-center gap-3 sm:gap-5">
                  <span className="text-3xl sm:text-5xl font-black text-white">{finalHomeScore}</span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-500">–</span>
                  <span className="text-3xl sm:text-5xl font-black text-white">{finalAwayScore}</span>
                </div>
                : <div className="px-5 py-3 sm:px-8 sm:py-4 bg-navy-dark border border-navy-light rounded-2xl shadow-inner flex items-center justify-center">
                  <span className="text-xl sm:text-3xl font-black text-gray-400 tracking-widest italic">{getVsLabel(match.status)}</span>
                </div>
              }
              {/* NOTE: isExtraTimeResult / isPenaltyResult loại trừ nhau vì
                  đều đọc từ matchResult.result_type (field đơn). Trận đá hiệp
                  phụ rồi vào luân lưu (rất phổ biến ở vòng knockout) sẽ mất
                  badge "Sau hiệp phụ" nếu BE set result_type='penalty'. Cần
                  BE trả thêm field độc lập (vd went_to_extra_time: boolean)
                  để 2 badge hiện đồng thời — không fix được chỉ ở FE. */}
              {isExtraTimeResult && (
                <span className="mt-2 text-[10px] text-amber-400 font-black uppercase tracking-widest">Sau hiệp phụ</span>
              )}
              {isPenaltyResult && (
                <span className="mt-2 px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-black uppercase tracking-widest rounded-full">
                  Pen {matchResult.home_penalty_score} – {matchResult.away_penalty_score}
                </span>
              )}
              <div className={`mt-3 px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${badgeCls}`}>
                <Clock className="w-3 h-3" /> {statusLabel}
              </div>
              {(dateStr || match.venue?.name) && (
                <div className="mt-2 flex flex-col items-center gap-0.5 text-[11px] text-gray-400 font-medium">
                  {dateStr && (
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-neon shrink-0" />{dateStr}</span>
                  )}
                  {match.venue?.name && (
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-red-400 shrink-0" />{match.venue.name}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center flex-1 max-w-[200px]">
              <TeamAvatar name={awayName} side="away" logo={match.away_team?.logo} jersey={hasScore ? jerseys.away : null} size="md" isWinner={awayIsWinner} />
            </div>
          </div>
        </div>
        {/* Mobile tab nav */}
        <div className="lg:hidden flex border-b border-navy-light/50 bg-navy-dark/50 shrink-0">
          {/* eslint-disable-next-line no-unused-vars */}
          {[['events', Activity, 'Diễn biến', 'text-neon border-neon bg-neon/5'], ['lineup', Users, 'Đội hình', 'text-blue-400 border-blue-400 bg-blue-400/5']].map(([key, Icon, label, activeCls]) => (
            <button key={key} onClick={() => setActiveTab(key)} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${activeTab === key ? `${activeCls} border-b-2` : 'text-gray-400'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}

        </div>
        {/* Body */}
        <div className="flex-1 min-h-0 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className={`${activeTab !== 'lineup' ? 'hidden lg:flex' : 'flex'} flex-col min-h-0`}>
              <PlayerColumn
                title={homeName}
                side="home"
                players={homePlayers}
                loading={loadingPlayers}
                kit={kitFor('home')}
                events={events}
                viewMode={lineupView.home}
                onToggleView={(mode) => toggleLineupView('home', mode)}
              />
            </div>
            <div className={`${activeTab !== 'events' ? 'hidden lg:flex' : 'flex'} flex-col min-h-0 border border-navy-light/50 rounded-2xl bg-navy-dark/60 p-4 shadow-inner`}>
              <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-navy-light/50 shrink-0">
                <Activity className="w-5 h-5 text-neon" />
                <h3 className="font-black text-white uppercase tracking-wider text-sm">Diễn biến trận đấu</h3>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto px-2 custom-scrollbar">
                <EventTimeline events={events} status={match.status} allPlayers={allPlayers} />
              </div>
            </div>
            <div className={`${activeTab !== 'lineup' ? 'hidden lg:flex' : 'flex'} flex-col min-h-0`}>
              <PlayerColumn
                title={awayName}
                side="away"
                players={awayPlayers}
                loading={loadingPlayers}
                kit={kitFor('away')}
                events={events}
                viewMode={lineupView.away}
                onToggleView={(mode) => toggleLineupView('away', mode)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}