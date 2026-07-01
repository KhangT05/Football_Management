import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Save, CheckCircle2, Plus, Trash2, Clock, Activity,
  Loader2, AlertTriangle, RefreshCw,
  RotateCcw, Minus, ChevronDown, CalendarDays,
  Flag, Zap, Target, ArrowLeftRight, Shield, Search
} from 'lucide-react';
import { teamApi, matchApi, matchLineupApi } from '../../api';
import useScheduleStore from '../../store/scheduleStore';
import useSeasonStore from '../../store/seasonStore';
import useToastStore from '../../store/toastStore';

import EventCard from '../../components/admin/EventCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { 
  TransitionPeriodModal, 
  ForfeitMatchModal, 
  AbandonMatchModal, 
  DisputeModal, 
  ResolveAppealModal 
} from '../../components/admin/AdvancedMatchControlModals';

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  { key: 'goal',         label: 'Bàn thắng',  icon: '⚽', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-400' },
  { key: 'yellow',       label: 'Thẻ Vàng',   icon: '🟨', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40 hover:bg-yellow-500/20 hover:border-yellow-400' },
  { key: 'red',          label: 'Thẻ Đỏ',     icon: '🟥', cls: 'bg-red-500/10 text-red-400 border-red-500/40 hover:bg-red-500/20 hover:border-red-400' },
  { key: 'substitution', label: 'Thay người',  icon: '🔄', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/40 hover:bg-blue-500/20 hover:border-blue-400' },
];

// ─── Payload builders ─────────────────────────────────────────────────────────

function buildEventPayload(evt, teamId) {
  const base = { teamId, minute: Number(evt.minute) || 1 };
  switch (evt.type) {
    case 'goal':         return [{ ...base, type: 'goal',             playerId: evt.player || undefined }];
    case 'yellow':       return [{ ...base, type: 'yellow_card',      playerId: evt.player || undefined }];
    case 'red':          return [{ ...base, type: 'red_card',         playerId: evt.player || undefined }];
    case 'substitution': return [
      { ...base, type: 'substitution_in',  playerId: evt.playerIn  || undefined },
      { ...base, type: 'substitution_out', playerId: evt.playerOut || undefined },
    ];
    default: return [];
  }
}

function countEvents(events) {
  return {
    goals:  events.filter(e => e.type === 'goal').length,
    yellow: events.filter(e => e.type === 'yellow').length,
    red:    events.filter(e => e.type === 'red').length,
    subs:   events.filter(e => e.type === 'substitution').length,
  };
}

// ─── MatchTimer (inline — no separate component needed) ───────────────────────

function useTimer(isRunning, onTick) {
  const timerRef = useRef(null);
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => onTick(p => p + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]); // eslint-disable-line react-hooks/exhaustive-deps
}

// ─── Main Component: LiveControlTab ──────────────────────────────────────────

export default function LiveControlTab({ selectedSeasonId, selectedMatchId, setSelectedMatchId }) {
  const toast = useToastStore();
  const { getMatchesFromCache, isSeasonLoading, fetchBySeason, scheduleCache } = useScheduleStore();

  const effectiveSeasonId = selectedSeasonId;

  const allSeasonMatches = useMemo(
    () => effectiveSeasonId
      ? getMatchesFromCache(Number(effectiveSeasonId))
      : [],
    [effectiveSeasonId, scheduleCache, getMatchesFromCache],
  );

  const isLoadingMatches = effectiveSeasonId
    ? isSeasonLoading(Number(effectiveSeasonId))
    : false;

  const [searchTerm, setSearchTerm] = useState('');

  const matches = useMemo(() => {
    let list = allSeasonMatches.filter(m => m.status === 'scheduled' || m.status === 'ongoing');
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(m => 
        m.home_team?.name?.toLowerCase().includes(lower) || 
        m.away_team?.name?.toLowerCase().includes(lower)
      );
    }
    return list;
  }, [allSeasonMatches, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(matches.length / itemsPerPage);
  const displayedMatches = matches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedMatch = useMemo(
    () => matches.find(m => String(m.id) === String(selectedMatchId)) ?? null,
    [matches, selectedMatchId],
  );

  // ── Players & Lineups ─────────────────────────────────────────────────────────────────
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [lineups, setLineups] = useState({ home: [], away: [] });

  useEffect(() => {
    if (!selectedMatch) return;
    let cancelled = false;
    const parsePlayers = (res) => {
      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    };
    const load = async () => {
      setLoadingPlayers(true);
      try {
        const [homeRes, awayRes, lineupRes] = await Promise.allSettled([
          teamApi.getPlayers(selectedMatch.home_team_id, { per_page: 50 }),
          teamApi.getPlayers(selectedMatch.away_team_id, { per_page: 50 }),
          matchLineupApi.getMatchLineups(selectedMatch.id)
        ]);
        if (cancelled) return;
        setHomePlayers(homeRes.status === 'fulfilled' ? parsePlayers(homeRes.value) : []);
        setAwayPlayers(awayRes.status === 'fulfilled' ? parsePlayers(awayRes.value) : []);
        
        const allLineups = lineupRes.status === 'fulfilled' && Array.isArray(lineupRes.value?.data) ? lineupRes.value.data : [];
        setLineups({
          home: allLineups.filter(l => l.team_id === selectedMatch.home_team_id),
          away: allLineups.filter(l => l.team_id === selectedMatch.away_team_id)
        });
      } finally {
        if (!cancelled) setLoadingPlayers(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedMatch?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Score & events ──────────────────────────────────────────────────────────
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homeEvents, setHomeEvents] = useState([]);
  const [awayEvents, setAwayEvents] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const [matchStatus, setMatchStatus] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [isStarting, setIsStarting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const [activeModal, setActiveModal] = useState(null); // 'period', 'forfeit', 'abandon', 'appeal', 'protest', 'resolve'

  // Use the timer hook
  useTimer(timerRunning, setTimerSeconds);

  const prevSeasonRef = useRef(effectiveSeasonId);
  useEffect(() => {
    if (!effectiveSeasonId) return;
    fetchBySeason(Number(effectiveSeasonId), { force: true });
    if (prevSeasonRef.current !== effectiveSeasonId) {
      prevSeasonRef.current = effectiveSeasonId;
      setTimeout(() => resetForm(), 0);
    }
  }, [effectiveSeasonId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedMatch) {
      setMatchStatus(selectedMatch.status);
      setTimerRunning(selectedMatch.status === 'ongoing');
    } else {
      setMatchStatus('');
      setTimerRunning(false);
    }
  }, [selectedMatch?.id, selectedMatch?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setSelectedMatchId('');
    setHomeScore(0); setAwayScore(0);
    setHomeEvents([]); setAwayEvents([]);
    setIsDirty(false);
    setTimerSeconds(0); setTimerRunning(false);
    setMatchStatus('');
  };

  const handleMatchSelect = (matchId) => {
    setSelectedMatchId(matchId);
    setHomeScore(0); setAwayScore(0);
    setHomeEvents([]); setAwayEvents([]);
    setIsDirty(false);
    setTimerSeconds(0);
  };

  const handleScoreChange = (side, val) => {
    const n = Math.max(0, parseInt(val) || 0);
    if (side === 'home') setHomeScore(n); else setAwayScore(n);
    setIsDirty(true);
  };

  const updateScoreDelta = (side, delta) => {
    if (side === 'home') setHomeScore(prev => Math.max(0, prev + delta));
    else setAwayScore(prev => Math.max(0, prev + delta));
    setIsDirty(true);
  };

  const addEvent = (side, type) => {
    const base = { id: Date.now(), type, minute: '', player: '' };
    const newEvt = type === 'substitution' ? { ...base, playerIn: '', playerOut: '' } : base;
    if (side === 'home') setHomeEvents(prev => [...prev, newEvt]);
    else setAwayEvents(prev => [...prev, newEvt]);
    setIsDirty(true);
  };

  const removeEvent = (side, id) => {
    if (side === 'home') setHomeEvents(prev => prev.filter(e => e.id !== id));
    else setAwayEvents(prev => prev.filter(e => e.id !== id));
    setIsDirty(true);
  };

  const updateEvent = (side, id, field, value) => {
    const updater = evts => evts.map(e => e.id === id ? { ...e, [field]: value } : e);
    if (side === 'home') setHomeEvents(updater); else setAwayEvents(updater);
    setIsDirty(true);
  };

  const getHomeName = () => selectedMatch?.home_team?.name ?? `Đội ${selectedMatch?.home_team_id ?? ''}`;
  const getAwayName = () => selectedMatch?.away_team?.name ?? `Đội ${selectedMatch?.away_team_id ?? ''}`;

  const handleRefresh = () => {
    if (effectiveSeasonId) {
      fetchBySeason(Number(effectiveSeasonId), { force: true });
    } else {
      seasons.forEach(s => fetchBySeason(s.id, { force: true }));
    }
  };

  const validate = () => {
    const homeGoalCount = homeEvents.filter(e => e.type === 'goal').length;
    const awayGoalCount = awayEvents.filter(e => e.type === 'goal').length;
    if (homeGoalCount !== homeScore)
      return `Đội nhà có ${homeScore} bàn nhưng chỉ có ${homeGoalCount} sự kiện bàn thắng.`;
    if (awayGoalCount !== awayScore)
      return `Đội khách có ${awayScore} bàn nhưng chỉ có ${awayGoalCount} sự kiện bàn thắng.`;
    if (homeEvents.some(e => !e.minute) || awayEvents.some(e => !e.minute))
      return 'Vui lòng điền phút cho tất cả sự kiện.';
    return '';
  };

  const syncUnsavedEvents = async () => {
    const pushSide = async (events, teamId) => {
      for (const evt of events) {
        if (evt.isSaved) continue;
        const payloads = buildEventPayload(evt, teamId);
        for (const payload of payloads) {
          try { await matchApi.recordEvent(selectedMatch.id, payload); }
          catch (err) { console.warn('[syncEvents] recordEvent failed:', payload, err); }
        }
        evt.isSaved = true;
      }
    };
    await pushSide(homeEvents, selectedMatch.home_team_id);
    await pushSide(awayEvents, selectedMatch.away_team_id);
  };

  const handleStartMatch = async () => {
    if (!selectedMatch) return;
    setIsStarting(true);
    try {
      await matchApi.startMatch(selectedMatch.id);
      setMatchStatus('ongoing');
      setTimerSeconds(0);
      setTimerRunning(true);
      toast.success('Trận đấu đã bắt đầu!');
      handleRefresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể bắt đầu trận đấu.');
    } finally { setIsStarting(false); }
  };

  const handleSaveDraft = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setIsSavingDraft(true);
    try {
      await syncUnsavedEvents();
      toast.info('Đã đồng bộ sự kiện (chưa kết thúc trận).');
      setIsDirty(false);
    } catch {
      toast.error('Lỗi khi đồng bộ sự kiện.');
    } finally { setIsSavingDraft(false); }
  };

  const handleFinishMatch = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setIsFinishing(true);
    try {
      const homeScorers = homeEvents.filter(e => e.type === 'goal').map(e => ({
        teamId: selectedMatch.home_team_id, type: 'goal',
        minute: Number(e.minute) || 1, playerName: e.player || undefined,
      }));
      const awayScorers = awayEvents.filter(e => e.type === 'goal').map(e => ({
        teamId: selectedMatch.away_team_id, type: 'goal',
        minute: Number(e.minute) || 1, playerName: e.player || undefined,
      }));
      await matchApi.adminRecordResult(selectedMatch.id, {
        homeScore: Number(homeScore), awayScore: Number(awayScore),
        scorers: [...homeScorers, ...awayScorers], resultType: 'full_time',
      });
      await syncUnsavedEvents().catch(() => {});
      setTimerRunning(false);
      setMatchStatus('finished');
      toast.success('Kết thúc trận! Standings và bracket đã được cập nhật. 🎉', 5000);
      setIsDirty(false);
      handleRefresh();
    } catch (err) {
      toast.error('Lỗi khi kết thúc trận: ' + (err?.response?.data?.message || err.message));
    } finally { setIsFinishing(false); }
  };

  const handleReset = () => {
    setHomeScore(0); setAwayScore(0);
    setHomeEvents([]); setAwayEvents([]);
    setIsDirty(false);
    toast.info('Đã đặt lại form.');
  };

  const isOngoing  = matchStatus === 'ongoing' || matchStatus === 'pending_official' || matchStatus === 'needs_review';
  const isScheduled = matchStatus === 'scheduled' || matchStatus === 'postponed';
  const isFinished  = matchStatus === 'finished';
  const isProtested = matchStatus === 'protested';
  
  const handleModalSuccess = (msg) => {
    toast.success(msg);
    setActiveModal(null);
    handleRefresh();
  };

  const timerMins = Math.floor(timerSeconds / 60);
  const timerSecs = timerSeconds % 60;
  const timerDisplay = `${timerMins.toString().padStart(2,'0')}:${timerSecs.toString().padStart(2,'0')}`;

  // ── Formatted scheduled_at ─────────────────────────────────────────────────
  const fmtMatchDate = (m) => m?.scheduled_at
    ? new Date(m.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
    : 'TBD';

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-5 animate-fade-in">
        {/* ── Search & Refresh ── */}
      <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-400" /> Tìm kiếm trận Live
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên đội..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Refresh */}
          <div className="flex items-end">
            <button
              onClick={() => fetchBySeason(Number(effectiveSeasonId), { force: true })}
              disabled={isLoadingMatches}
              className="px-5 py-3 rounded-xl bg-navy-dark border border-navy-light text-gray-400 hover:text-white hover:border-gray-500 transition-all disabled:opacity-40"
              title="Tải lại danh sách trận"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingMatches ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

        {/* ── Match Cards ── */}
        <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Chọn Trận Đấu
              {matches.length > 0 && (
                <span className="ml-auto text-gray-600 font-normal">{matches.length} trận</span>
              )}
            </h3>

            {isLoadingMatches ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-navy-light rounded-2xl">
                <div className="text-3xl mb-3">🏟️</div>
                <p className="text-gray-500 text-sm">Không có trận nào đang <span className="text-amber-400 font-bold">chờ diễn ra</span> hoặc <span className="text-red-400 font-bold">đang diễn ra</span>.</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {displayedMatches.map(m => {
                    const isSelected = String(m.id) === String(selectedMatchId);
                  const isLive = m.status === 'ongoing';
                  const homeName = m.home_team?.name ?? `Đội #${m.home_team_id}`;
                  const awayName = m.away_team?.name ?? `Đội #${m.away_team_id}`;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleMatchSelect(String(m.id))}
                      className={`group relative text-left p-4 rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-900/20'
                          : 'bg-navy border-navy-light hover:border-gray-500 hover:bg-navy-light/40'
                      }`}
                    >
                      {/* Live pulse glow */}
                      {isLive && (
                        <div className="absolute inset-0 bg-linear-to-r from-red-600/5 to-transparent pointer-events-none" />
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <div className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          isLive
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-navy-dark text-gray-500 border border-navy-light'
                        }`}>
                          {isLive ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                              LIVE
                            </span>
                          ) : '⏳ SẮP DIỄN RA'}
                        </div>
                        <span className="text-xs text-gray-600">{fmtMatchDate(m)}</span>
                      </div>

                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                            {homeName[0]}
                          </div>
                          <span className="font-bold text-white text-sm truncate">{homeName}</span>
                        </div>
                        <span className="text-gray-600 font-black text-xs shrink-0 px-2">VS</span>
                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                          <span className="font-bold text-white text-sm truncate text-right">{awayName}</span>
                          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-orange-600 to-amber-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                            {awayName[0]}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      )}
                    </button>
                  );
                })}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={setCurrentPage} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>

        {/* ── Main Workspace ── */}
        {selectedMatch && (
          <div className="space-y-5">

            {/* ── Live Scoreboard ── */}
            <div className="relative bg-navy border border-navy-light rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
              {/* Top accent line */}
              <div className={`h-1 w-full ${isOngoing ? 'bg-linear-to-r from-red-600 via-orange-500 to-red-600 animate-gradient' : 'bg-linear-to-r from-blue-600 via-indigo-500 to-blue-600'}`} />

              {/* BG glow */}
              <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />

              <div className="p-5 sm:p-8 relative">
                {/* Status row */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <StatusBadge status={matchStatus || selectedMatch.status} />
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-gray-500 text-xs font-medium">{fmtMatchDate(selectedMatch)}</span>
                  {selectedMatch.venue?.name && (
                    <>
                      <span className="text-gray-600 text-xs">•</span>
                      <span className="text-gray-500 text-xs">{selectedMatch.venue.name}</span>
                    </>
                  )}
                </div>

                {/* Teams + Score */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">

                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white font-black text-2xl sm:text-4xl shadow-lg shadow-blue-900/40 border-2 border-white/10">
                      {getHomeName()[0]}
                    </div>
                    <span className="font-black text-white text-sm sm:text-base text-center line-clamp-2 leading-tight">
                      {getHomeName()}
                    </span>
                    {/* +/- controls */}
                    <div className="flex items-center gap-1 bg-navy-dark border border-navy-light rounded-full p-1">
                      <button onClick={() => updateScoreDelta('home', -1)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <Minus className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateScoreDelta('home', 1)} className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Score + Timer */}
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <input
                        type="number" min="0" max="99" value={homeScore}
                        onChange={e => handleScoreChange('home', e.target.value)}
                        className="w-14 h-18 sm:w-20 sm:h-24 text-center text-4xl sm:text-6xl font-black bg-navy-dark border-2 border-navy-light rounded-2xl focus:border-blue-500 outline-none transition-all text-white shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-gray-700">–</span>
                      </div>
                      <input
                        type="number" min="0" max="99" value={awayScore}
                        onChange={e => handleScoreChange('away', e.target.value)}
                        className="w-14 h-18 sm:w-20 sm:h-24 text-center text-4xl sm:text-6xl font-black bg-navy-dark border-2 border-navy-light rounded-2xl focus:border-orange-500 outline-none transition-all text-white shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full border font-mono font-black text-lg sm:text-2xl tracking-widest transition-all ${
                      isOngoing
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_16px_rgba(239,68,68,0.2)]'
                        : 'bg-navy-dark border-navy-light text-gray-500'
                    }`}>
                      <Clock className="w-4 h-4 opacity-70" />
                      {timerDisplay}
                    </div>

                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 py-1.5 px-4 bg-navy-dark hover:bg-navy-light text-gray-500 hover:text-gray-300 border border-navy-light rounded-xl text-xs font-bold transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Đặt lại
                    </button>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-orange-600 to-amber-700 flex items-center justify-center text-white font-black text-2xl sm:text-4xl shadow-lg shadow-orange-900/40 border-2 border-white/10">
                      {getAwayName()[0]}
                    </div>
                    <span className="font-black text-white text-sm sm:text-base text-center line-clamp-2 leading-tight">
                      {getAwayName()}
                    </span>
                    <div className="flex items-center gap-1 bg-navy-dark border border-navy-light rounded-full p-1">
                      <button onClick={() => updateScoreDelta('away', -1)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <Minus className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateScoreDelta('away', 1)} className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Match Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  {isScheduled && (
                    <button
                      onClick={handleStartMatch}
                      disabled={isStarting}
                      className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white font-black rounded-2xl shadow-lg shadow-emerald-900/40 transition-all uppercase tracking-wider text-sm"
                    >
                      {isStarting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                      Bắt đầu trận đấu
                    </button>
                  )}

                  {isOngoing && (
                    <button
                      onClick={handleFinishMatch}
                      disabled={isFinishing}
                      className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-60 text-white font-black rounded-2xl shadow-lg shadow-red-900/40 transition-all uppercase tracking-wider text-sm"
                    >
                      {isFinishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Flag className="w-5 h-5" />}
                      Kết thúc trận
                    </button>
                  )}

                  {isFinished && (
                    <div className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 bg-navy border border-emerald-500/30 text-emerald-400 font-black rounded-2xl text-sm">
                      <CheckCircle2 className="w-5 h-5" /> Trận đã kết thúc
                    </div>
                  )}
                </div>

                {/* ── Advanced Match Controls ── */}
                <div className="mt-4 pt-4 border-t border-navy-light flex flex-wrap gap-2 justify-center">
                  {(isScheduled || isOngoing) && (
                    <>
                      <button onClick={() => setActiveModal('period')} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-xs font-bold border border-blue-500/20 transition-colors">Đổi Hiệp</button>
                      <button onClick={() => setActiveModal('forfeit')} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold border border-red-500/20 transition-colors">Xử Thua</button>
                      <button onClick={() => setActiveModal('abandon')} className="px-3 py-1.5 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg text-xs font-bold border border-orange-500/20 transition-colors">Hủy Trận</button>
                    </>
                  )}
                  {(isFinished || isProtested) && (
                    <>
                      <button onClick={() => setActiveModal('appeal')} className="px-3 py-1.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg text-xs font-bold border border-purple-500/20 transition-colors">Kháng cáo</button>
                      <button onClick={() => setActiveModal('protest')} className="px-3 py-1.5 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 rounded-lg text-xs font-bold border border-pink-500/20 transition-colors">Khiếu nại</button>
                      {isProtested && (
                        <button onClick={() => setActiveModal('resolve')} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-bold border border-emerald-500/20 transition-colors">Giải quyết Khiếu nại</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Event Columns ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <EventColumn
                title={getHomeName()}
                teamColor="blue"
                events={homeEvents}
                players={homePlayers}
                lineup={lineups.home}
                loadingPlayers={loadingPlayers}
                onAdd={type => addEvent('home', type)}
                onUpdate={(id, f, v) => updateEvent('home', id, f, v)}
                onRemove={id => removeEvent('home', id)}
              />
              <EventColumn
                title={getAwayName()}
                teamColor="orange"
                events={awayEvents}
                players={awayPlayers}
                lineup={lineups.away}
                loadingPlayers={loadingPlayers}
                onAdd={type => addEvent('away', type)}
                onUpdate={(id, f, v) => updateEvent('away', id, f, v)}
                onRemove={id => removeEvent('away', id)}
              />
            </div>

          </div>
        )}

        {/* ── Empty state ── */}
        {!selectedMatch && effectiveSeasonId && !isLoadingMatches && matches.length > 0 && (
          <div className="text-center py-16 border border-dashed border-navy-light rounded-3xl">
            <div className="text-5xl mb-4">👆</div>
            <p className="text-gray-500 font-medium">Chọn một trận đấu ở trên để bắt đầu quản lý</p>
          </div>
        )}

      </div>

      {/* ── Sticky Bottom Action Bar ── */}
      {selectedMatch && !isFinished && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-navy-light bg-navy/80 backdrop-blur-xl px-4 py-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Summary */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-white">{homeScore}</span>
                <span className="text-gray-600">–</span>
                <span className="font-black text-white">{awayScore}</span>
              </div>
              <div className="text-gray-600 hidden sm:block">•</div>
              <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
                <span>⚽ {homeEvents.filter(e=>e.type==='goal').length + awayEvents.filter(e=>e.type==='goal').length} bàn</span>
                <span>🟨 {homeEvents.filter(e=>e.type==='yellow').length + awayEvents.filter(e=>e.type==='yellow').length} thẻ vàng</span>
                <span>🔄 {homeEvents.filter(e=>e.type==='substitution').length + awayEvents.filter(e=>e.type==='substitution').length} thay</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isDirty && isOngoing && (
                <button
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-navy-dark hover:bg-navy-light border border-navy-light hover:border-gray-500 text-gray-300 hover:text-white font-bold rounded-xl transition-all disabled:opacity-40 text-sm"
                >
                  {isSavingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu nháp
                </button>
              )}

              {isOngoing && (
                <button
                  onClick={handleFinishMatch}
                  disabled={isFinishing}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-black rounded-xl transition-all shadow-lg shadow-red-900/40 text-sm"
                >
                  {isFinishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                  Kết thúc
                </button>
              )}

              {isScheduled && (
                <button
                  onClick={handleStartMatch}
                  disabled={isStarting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-900/40 text-sm"
                >
                  {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                  Bắt đầu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Control Modals */}
      <TransitionPeriodModal isOpen={activeModal === 'period'} onClose={() => setActiveModal(null)} match={selectedMatch} onSuccess={handleModalSuccess} />
      <ForfeitMatchModal isOpen={activeModal === 'forfeit'} onClose={() => setActiveModal(null)} match={selectedMatch} onSuccess={handleModalSuccess} />
      <AbandonMatchModal isOpen={activeModal === 'abandon'} onClose={() => setActiveModal(null)} match={selectedMatch} currentMinute={timerMins} onSuccess={handleModalSuccess} />
      <DisputeModal isOpen={activeModal === 'appeal' || activeModal === 'protest'} onClose={() => setActiveModal(null)} match={selectedMatch} type={activeModal} onSuccess={handleModalSuccess} />
      <ResolveAppealModal isOpen={activeModal === 'resolve'} onClose={() => setActiveModal(null)} match={selectedMatch} onSuccess={handleModalSuccess} />
    </>
  );
}

// ─── EventColumn ──────────────────────────────────────────────────────────────

function EventColumn({ title, teamColor, events, players, lineup, loadingPlayers, onAdd, onUpdate, onRemove }) {
  const c = countEvents(events);

  const headerGradient = teamColor === 'blue'
    ? 'from-blue-600/20 to-navy border-blue-500/20'
    : 'from-orange-600/20 to-navy border-orange-500/20';

  const avatarGradient = teamColor === 'blue'
    ? 'from-blue-600 to-cyan-700'
    : 'from-orange-600 to-amber-700';

  return (
    <div className="bg-navy border border-navy-light rounded-2xl overflow-hidden shadow-lg flex flex-col">
      {/* Header */}
      <div className={`bg-linear-to-r ${headerGradient} border-b px-5 py-4`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-base shadow-md shrink-0`}>
            {title[0]}
          </div>
          <h3 className={`font-black text-white text-base uppercase tracking-wide line-clamp-1`}>
            {title}
          </h3>
        </div>

        {/* Event counters */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { icon: '⚽', val: c.goals,  label: 'Bàn',  color: 'emerald' },
            { icon: '🟨', val: c.yellow, label: 'Vàng', color: 'yellow'  },
            { icon: '🟥', val: c.red,    label: 'Đỏ',   color: 'red'     },
            { icon: '🔄', val: c.subs,   label: 'Thay', color: 'blue'    },
          ].map(({ icon, val, label, color }) => (
            <div key={label} className={`flex flex-col items-center py-2 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
              <span className="text-base">{icon}</span>
              <span className={`text-sm font-black text-${color}-400`}>{val}</span>
              <span className={`text-xs text-${color}-500/70`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Buttons */}
      <div className="px-4 pt-4 pb-3 border-b border-navy-light">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {EVENT_TYPES.map(et => (
            <button
              key={et.key}
              onClick={() => onAdd(et.key)}
              className={`py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${et.cls}`}
            >
              <span className="text-sm">{et.icon}</span>
              <span className="hidden sm:inline">{et.label}</span>
              <Plus className="w-3 h-3 sm:hidden" />
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[400px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-navy-light [&::-webkit-scrollbar-thumb]:rounded-full">
        {loadingPlayers ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
            <p className="text-xs text-gray-600">Đang tải cầu thủ...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Shield className="w-8 h-8 text-gray-700" />
            <p className="text-xs text-gray-600 text-center">Chưa có sự kiện nào.<br />Nhấn nút bên trên để thêm.</p>
          </div>
        ) : (
          events.map(evt => (
            <EventCard
              key={evt.id}
              evt={evt}
              players={players}
              lineup={lineup}
              allEvents={events}
              onUpdate={(id, f, v) => onUpdate(id, f, v)}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
}