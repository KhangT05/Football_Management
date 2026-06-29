import { useState, useEffect, useMemo, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Save, CheckCircle2, Plus, Trash2, Clock, Activity,
  Loader2, AlertTriangle, RefreshCw,
  RotateCcw, Minus, ChevronDown, CalendarDays,
  Flag,
} from 'lucide-react';
import { teamApi, matchApi } from '../../api';
import useScheduleStore from '../../store/scheduleStore';
import useSeasonStore from '../../store/seasonStore';
import useToastStore from '../../store/toastStore';

import EventCard from '../../components/admin/EventCard';
import MatchTimer from '../../components/admin/MatchTimer';
import StatusBadge from '../../components/ui/StatusBadge';

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * EVENT_TYPES dùng để render button + truyền vào EventCard.
 * substitution được tách thành pair (in/out) khi build payload.
 */
const EVENT_TYPES = [
  { key: 'goal', label: 'Bàn', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' },
  { key: 'yellow', label: 'Vàng', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20' },
  { key: 'red', label: 'Đỏ', cls: 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' },
  { key: 'substitution', label: 'Thay', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' },
];

// ─── Payload builders ─────────────────────────────────────────────────────────

function buildEventPayload(evt, teamId) {
  const base = {
    teamId,
    minute: Number(evt.minute) || 1,
  };

  switch (evt.type) {
    case 'goal':
      return [{ ...base, type: 'goal', playerId: evt.player || undefined }];
    case 'yellow':
      return [{ ...base, type: 'yellow_card', playerId: evt.player || undefined }];
    case 'red':
      return [{ ...base, type: 'red_card', playerId: evt.player || undefined }];
    case 'substitution':
      // Substitution = pair of events. playerIn/playerOut lưu trong evt.
      return [
        { ...base, type: 'substitution_in', playerId: evt.playerIn || undefined },
        { ...base, type: 'substitution_out', playerId: evt.playerOut || undefined },
      ];
    default:
      return [];
  }
}

// ─── EventList counter ────────────────────────────────────────────────────────

function countEvents(events) {
  return {
    goals: events.filter(e => e.type === 'goal').length,
    yellow: events.filter(e => e.type === 'yellow').length,
    red: events.filter(e => e.type === 'red').length,
    subs: events.filter(e => e.type === 'substitution').length,
  };
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function UpdateResults() {
  const toast = useToastStore();

  // ── Season / Match store ────────────────────────────────────────────────────
  const { seasons, isLoading: seasonsLoading, fetchAll: fetchSeasons } = useSeasonStore();
  const { getMatchesFromCache, isSeasonLoading, fetchBySeason, scheduleCache } = useScheduleStore();

  const [selectedSeasonId, setSelectedSeasonId] = useState('');

  useEffect(() => {
    if (selectedSeasonId) {
      fetchBySeason(Number(selectedSeasonId));
    } else {
      seasons.forEach(s => fetchBySeason(s.id));
    }
  }, [selectedSeasonId, seasons, fetchBySeason]);

  const effectiveSeasonId = selectedSeasonId;

  const allSeasonMatches = useMemo(
    () => effectiveSeasonId
      ? getMatchesFromCache(Number(effectiveSeasonId))
      : seasons.flatMap(s => scheduleCache[s.id]?.matches ?? []),
    [effectiveSeasonId, seasons, scheduleCache, getMatchesFromCache],
  );

  const isLoadingMatches = effectiveSeasonId
    ? isSeasonLoading(Number(effectiveSeasonId))
    : seasons.some(s => isSeasonLoading(s.id));

  const matches = useMemo(
    () => allSeasonMatches.filter(m => m.status === 'scheduled' || m.status === 'ongoing'),
    [allSeasonMatches],
  );

  const [selectedMatchId, setSelectedMatchId] = useState('');

  const selectedMatch = useMemo(
    () => matches.find(m => String(m.id) === String(selectedMatchId)) ?? null,
    [matches, selectedMatchId],
  );

  // ── Players ─────────────────────────────────────────────────────────────────
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

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
        const [homeRes, awayRes] = await Promise.allSettled([
          teamApi.getPlayers(selectedMatch.home_team_id, { per_page: 50 }),
          teamApi.getPlayers(selectedMatch.away_team_id, { per_page: 50 }),
        ]);
        if (cancelled) return;
        setHomePlayers(homeRes.status === 'fulfilled' ? parsePlayers(homeRes.value) : []);
        setAwayPlayers(awayRes.status === 'fulfilled' ? parsePlayers(awayRes.value) : []);
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

  // ── Match lifecycle state ───────────────────────────────────────────────────
  // matchStatus mirrors selectedMatch.status nhưng có thể cập nhật optimistically
  // sau startMatch/adminRecordResult mà chưa refetch từ server.
  const [matchStatus, setMatchStatus] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // ── Action loading flags ────────────────────────────────────────────────────
  const [isStarting, setIsStarting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // ── Init / season change ────────────────────────────────────────────────────
  useEffect(() => {
    fetchSeasons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const prevSeasonRef = useRef(effectiveSeasonId);
  useEffect(() => {
    if (!effectiveSeasonId) return;
    fetchBySeason(Number(effectiveSeasonId));
    if (prevSeasonRef.current !== effectiveSeasonId) {
      prevSeasonRef.current = effectiveSeasonId;
      setTimeout(() => resetForm(), 0);
    }
  }, [effectiveSeasonId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync matchStatus từ selectedMatch
  useEffect(() => {
    if (selectedMatch) {
      setMatchStatus(selectedMatch.status);
      // Nếu match đang ongoing (chọn lại sau khi đã start), tự chạy timer
      setTimerRunning(selectedMatch.status === 'ongoing');
    } else {
      setMatchStatus('');
      setTimerRunning(false);
    }
  }, [selectedMatch?.id, selectedMatch?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setSelectedMatchId('');
    setHomeScore(0);
    setAwayScore(0);
    setHomeEvents([]);
    setAwayEvents([]);
    setIsDirty(false);
    setTimerSeconds(0);
    setTimerRunning(false);
    setMatchStatus('');
  };

  const handleMatchChange = (e) => {
    setSelectedMatchId(e.target.value);
    setHomeScore(0);
    setAwayScore(0);
    setHomeEvents([]);
    setAwayEvents([]);
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
    // Substitution cần thêm playerIn/playerOut
    const newEvt = type === 'substitution'
      ? { ...base, playerIn: '', playerOut: '' }
      : base;
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

  const formatMatchLabel = (m) => {
    const home = m.home_team?.name ?? `Đội #${m.home_team_id}`;
    const away = m.away_team?.name ?? `Đội #${m.away_team_id}`;
    const date = m.scheduled_at ? ` — ${new Date(m.scheduled_at).toLocaleDateString('vi-VN')}` : '';
    return `${home} vs ${away}${date}`;
  };

  const handleRefresh = () => {
    if (effectiveSeasonId) fetchBySeason(Number(effectiveSeasonId), { force: true });
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const homeGoalCount = homeEvents.filter(e => e.type === 'goal').length;
    const awayGoalCount = awayEvents.filter(e => e.type === 'goal').length;
    if (homeGoalCount !== homeScore)
      return `Đội nhà có ${homeScore} bàn nhưng ${homeGoalCount} sự kiện bàn thắng.`;
    if (awayGoalCount !== awayScore)
      return `Đội khách có ${awayScore} bàn nhưng ${awayGoalCount} sự kiện bàn thắng.`;
    const isIncomplete = (e) => {
      if (!e.minute) return true;
      if (e.type === 'substitution') return false; // player optional cho sub
      return false; // player optional cho card/goal (có thể nhập tên thủ công sau)
    };
    if (homeEvents.some(isIncomplete) || awayEvents.some(isIncomplete))
      return 'Vui lòng điền phút cho tất cả sự kiện.';
    return '';
  };

  // ── Sync events lên server ───────────────────────────────────────────────────
  // Fire-and-forget từng event. Không dừng nếu 1 event lỗi — log và tiếp tục.
  // Idempotency: backend guard second_yellow nếu yellow đã tồn tại.
  const syncUnsavedEvents = async () => {
    const pushSide = async (events, teamId) => {
      for (const evt of events) {
        if (evt.isSaved) continue;
        const payloads = buildEventPayload(evt, teamId);
        for (const payload of payloads) {
          try {
            await matchApi.recordEvent(selectedMatch.id, payload);
          } catch (err) {
            console.warn('[syncEvents] recordEvent failed:', payload, err);
          }
        }
        evt.isSaved = true;
      }
    };
    await pushSide(homeEvents, selectedMatch.home_team_id);
    await pushSide(awayEvents, selectedMatch.away_team_id);
  };

  // ── Actions ──────────────────────────────────────────────────────────────────

  /**
   * Bắt đầu trận → startMatch API → status: ongoing → bật timer.
   * Chỉ available khi status === 'scheduled'.
   */
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
    } finally {
      setIsStarting(false);
    }
  };

  /**
   * Lưu nháp → sync events → chưa kết thúc trận.
   */
  const handleSaveDraft = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setIsSavingDraft(true);
    try {
      await syncUnsavedEvents();
      toast.info('Đã đồng bộ sự kiện (chưa kết thúc trận).');
      setIsDirty(false);
    } catch (err) {
      toast.error('Lỗi khi đồng bộ sự kiện.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  /**
   * Kết thúc trận → adminRecordResult.
   *
   * Flow:
   *   - adminRecordResult nhận score + scorers (audit trail)
   *   - Backend: insert MatchResult → update standings → advance knockout nếu cần
   *   - Frontend: dừng timer, reset form, refresh list
   *
   * Dùng adminRecordResult thay vì finalizeMatch+confirmOfficial vì:
   *   - Admin page không cần grace period
   *   - Direct path, kết quả ngay lập tức
   *   - Standings + knockout được handle trong confirmResult() của backend
   */
  const handleFinishMatch = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setIsFinishing(true);
    try {
      // Build scorers cho audit trail / player stats
      // Chỉ gồm goal events — cards/subs đã push qua recordEvent ở saveDraft
      const buildScorers = (events, match) =>
        events
          .filter(e => e.type === 'goal')
          .map(e => ({
            teamId: match.home_team_id, // override bên dưới per side
            type: 'goal',
            minute: Number(e.minute) || 1,
            playerName: e.player || undefined,
          }));

      const homeScorers = homeEvents
        .filter(e => e.type === 'goal')
        .map(e => ({
          teamId: selectedMatch.home_team_id,
          type: 'goal',
          minute: Number(e.minute) || 1,
          playerName: e.player || undefined,
        }));

      const awayScorers = awayEvents
        .filter(e => e.type === 'goal')
        .map(e => ({
          teamId: selectedMatch.away_team_id,
          type: 'goal',
          minute: Number(e.minute) || 1,
          playerName: e.player || undefined,
        }));

      await matchApi.adminRecordResult(selectedMatch.id, {
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        scorers: [...homeScorers, ...awayScorers],
        resultType: 'full_time',
      });

      // Push card/sub events còn chưa saved (nếu không gọi saveDraft trước)
      // recordEvent lúc này bị backend reject nếu status đã finished —
      // acceptable: events là audit trail, không ảnh hưởng standings.
      await syncUnsavedEvents().catch(() => { });

      setTimerRunning(false);
      setMatchStatus('finished');
      toast.success('Kết thúc trận! Standings và bracket đã được cập nhật. 🎉', 5000);
      setIsDirty(false);
      handleRefresh();
    } catch (err) {
      toast.error('Lỗi khi kết thúc trận: ' + (err?.response?.data?.message || err.message));
    } finally {
      setIsFinishing(false);
    }
  };

  const handleReset = () => {
    setHomeScore(0);
    setAwayScore(0);
    setHomeEvents([]);
    setAwayEvents([]);
    setIsDirty(false);
    toast.info('Đã đặt lại form.');
  };

  // ── Derived ──────────────────────────────────────────────────────────────────
  const isOngoing = matchStatus === 'ongoing';
  const isScheduled = matchStatus === 'scheduled';
  const isFinished = matchStatus === 'finished';

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-18 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-neon" /> Quản lý Trận Đấu (Live)
            </h2>
            <p className="text-gray-400 text-sm mt-1">Cập nhật tỷ số, thẻ phạt, thay người và kết thúc trận.</p>
          </div>
          {isDirty && (
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold bg-amber-400/10 border border-amber-400/30 px-4 py-2 rounded-xl animate-fade-in">
              <AlertTriangle className="w-4 h-4" /> Có thay đổi chưa lưu
            </div>
          )}
        </div>

        {/* Season selector */}
        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-lg shadow-black/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-emerald-400" /> Mùa giải:
          </label>
          <div className="relative flex-1 max-w-sm">
            <select
              value={selectedSeasonId}
              onChange={e => setSelectedSeasonId(e.target.value)}
              disabled={seasonsLoading}
              className="w-full pl-4 pr-10 py-3 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon text-sm appearance-none disabled:opacity-60"
            >
              <option value="">-- Chọn mùa giải --</option>
              {seasons.map(s => {
                const statusLabel = {
                  registration_open: '✅ Đang mở đăng ký',
                  ongoing: '🔴 Đang diễn ra',
                  finished: '✓ Đã kết thúc',
                  upcoming: '⏳ Sắp diễn ra',
                  cancelled: '❌ Đã hủy',
                }[s.status] ?? s.status;
                return <option key={s.id} value={s.id}>{s.name} — {statusLabel}</option>;
              })}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoadingMatches || !effectiveSeasonId}
            className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Tải lại"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingMatches ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Match selector */}
        <div className="bg-navy p-5 rounded-3xl border border-navy-light shadow-lg shadow-black/20">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Chọn trận đấu</label>
          {!effectiveSeasonId ? (
            <p className="text-gray-500 text-sm py-2">Vui lòng chọn mùa giải trước.</p>
          ) : isLoadingMatches ? (
            <div className="skeleton h-14 rounded-xl" />
          ) : matches.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              Không có trận nào ở trạng thái <strong className="text-amber-400">sắp diễn ra</strong> hoặc{' '}
              <strong className="text-red-400">đang diễn ra</strong>.
            </div>
          ) : (
            <select
              className="w-full text-base p-4 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon transition-colors"
              value={selectedMatchId}
              onChange={handleMatchChange}
            >
              <option value="">-- Chọn trận đấu --</option>
              {matches.map(m => (
                <option key={m.id} value={m.id}>{formatMatchLabel(m)}</option>
              ))}
            </select>
          )}
        </div>

        {/* Main workspace */}
        {selectedMatch && (
          <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6 items-start">

            {/* ── Scoreboard center ─────────────────────────────────────── */}
            <div className="lg:col-span-12 xl:col-span-6 order-1 xl:order-2 flex flex-col gap-6">

              {/* Timer — controlled */}
              <MatchTimer
                isRunning={timerRunning}
                seconds={timerSeconds}
                onTick={setTimerSeconds}
              />

              <div className="bg-navy p-6 md:p-8 rounded-3xl border border-navy-light shadow-xl relative overflow-hidden flex flex-col justify-center gap-6">
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-blue-500 via-emerald-400 to-amber-400" />

                {/* Status + date */}
                <div className="text-center flex items-center justify-center gap-3">
                  <StatusBadge status={matchStatus || selectedMatch.status} />
                  <span className="text-gray-500 text-xs font-bold">
                    {selectedMatch.scheduled_at
                      ? new Date(selectedMatch.scheduled_at).toLocaleDateString('vi-VN', { dateStyle: 'medium' })
                      : '—'}
                  </span>
                </div>

                {/* Teams + score */}
                <div className="flex items-center justify-center gap-2 sm:gap-6 md:gap-8">
                  {/* Home */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-14 h-14 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-navy-light bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white font-black text-xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 shadow-inner">
                      {getHomeName()[0]}
                    </div>
                    <div className="flex gap-1 sm:gap-2 bg-navy-dark p-1 sm:p-1.5 rounded-full border border-navy-light">
                      <button onClick={() => updateScoreDelta('home', -1)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light transition-all"><Minus className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                      <button onClick={() => updateScoreDelta('home', 1)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light transition-all"><Plus className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                    </div>
                  </div>

                  {/* Score inputs */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <input
                      type="number" min="0" max="99" value={homeScore}
                      onChange={e => handleScoreChange('home', e.target.value)}
                      className="w-14 h-20 sm:w-24 sm:h-28 md:w-28 md:h-32 text-center text-3xl sm:text-6xl md:text-7xl font-black bg-navy-dark border-2 border-navy-light rounded-2xl sm:rounded-3xl focus:border-neon outline-none transition-all text-white shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-2xl sm:text-4xl font-black text-gray-600">–</span>
                    <input
                      type="number" min="0" max="99" value={awayScore}
                      onChange={e => handleScoreChange('away', e.target.value)}
                      className="w-14 h-20 sm:w-24 sm:h-28 md:w-28 md:h-32 text-center text-3xl sm:text-6xl md:text-7xl font-black bg-navy-dark border-2 border-navy-light rounded-2xl sm:rounded-3xl focus:border-neon outline-none transition-all text-white shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-14 h-14 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-navy-light bg-linear-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white font-black text-xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 shadow-inner">
                      {getAwayName()[0]}
                    </div>
                    <div className="flex gap-1 sm:gap-2 bg-navy-dark p-1 sm:p-1.5 rounded-full border border-navy-light">
                      <button onClick={() => updateScoreDelta('away', -1)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light transition-all"><Minus className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                      <button onClick={() => updateScoreDelta('away', 1)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light transition-all"><Plus className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                    </div>
                  </div>
                </div>

                {/* Reset score */}
                <div className="flex justify-center">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 py-2.5 px-6 bg-navy-dark hover:bg-navy-light text-gray-400 hover:text-white border border-navy-light rounded-xl text-sm font-bold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Đặt lại
                  </button>
                </div>
              </div>

              {/* ── Bắt đầu / Kết thúc trận ── */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Bắt đầu trận — chỉ khi scheduled */}
                {isScheduled && (
                  <button
                    onClick={handleStartMatch}
                    disabled={isStarting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider text-sm"
                  >
                    {isStarting
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <Activity className="w-5 h-5" />}
                    Bắt đầu trận
                  </button>
                )}

                {/* Kết thúc trận — chỉ khi ongoing */}
                {isOngoing && (
                  <button
                    onClick={handleFinishMatch}
                    disabled={isFinishing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-extrabold rounded-xl shadow-lg shadow-red-500/20 transition-all uppercase tracking-wider text-sm"
                  >
                    {isFinishing
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <Flag className="w-5 h-5" />}
                    Kết thúc trận
                  </button>
                )}

                {isFinished && (
                  <div className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-navy border border-emerald-500/30 text-emerald-400 font-extrabold rounded-xl text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Trận đã kết thúc
                  </div>
                )}
              </div>
            </div>

            {/* ── Home events column ───────────────────────────────────── */}
            <div className="lg:col-span-6 xl:col-span-3 order-2 xl:order-1">
              <EventColumn
                title={getHomeName()}
                events={homeEvents}
                players={homePlayers}
                loadingPlayers={loadingPlayers}
                onAdd={type => addEvent('home', type)}
                onUpdate={(id, f, v) => updateEvent('home', id, f, v)}
                onRemove={id => removeEvent('home', id)}
              />
            </div>

            {/* ── Away events column ───────────────────────────────────── */}
            <div className="lg:col-span-6 xl:col-span-3 order-3 xl:order-3">
              <EventColumn
                title={getAwayName()}
                events={awayEvents}
                players={awayPlayers}
                loadingPlayers={loadingPlayers}
                onAdd={type => addEvent('away', type)}
                onUpdate={(id, f, v) => updateEvent('away', id, f, v)}
                onRemove={id => removeEvent('away', id)}
              />
            </div>

          </div>
        )}

        {/* Footer actions */}
        {selectedMatch && !isFinished && (
          <div className="bg-navy p-3 rounded-2xl border border-navy-light shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-6 z-10">
            <p className="text-sm font-medium text-gray-400 text-center sm:text-left flex-1">
              Kiểm tra kỹ tỷ số và sự kiện trước khi kết thúc trận.
            </p>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={isSavingDraft || !isDirty || !isOngoing}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-navy-dark hover:bg-navy-light border border-navy-light text-gray-300 hover:text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSavingDraft ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu Nháp
              </button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

// ─── EventColumn ──────────────────────────────────────────────────────────────

function EventColumn({ title, events, players, loadingPlayers, onAdd, onUpdate, onRemove }) {
  const c = countEvents(events);

  return (
    <div className="bg-navy p-4 sm:p-5 rounded-3xl border border-navy-light shadow-lg flex flex-col h-[500px] xl:h-[680px]">
      {/* Header */}
      <div className="border-b border-navy-light pb-4 mb-4">
        <h3 className="font-extrabold text-white text-lg uppercase tracking-wider line-clamp-1 mb-3 text-center">
          {title}
        </h3>

        {/* Counters */}
        <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap text-xs font-bold">
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-md">⚽ {c.goals}</span>
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-md">🟨 {c.yellow}</span>
          <span className="px-2 py-1 bg-red-500/20    text-red-400    border border-red-500/20    rounded-md">🟥 {c.red}</span>
          <span className="px-2 py-1 bg-blue-500/20   text-blue-400   border border-blue-500/20   rounded-md">🔄 {c.subs}</span>
        </div>

        {/* Add buttons */}
        <div className="grid grid-cols-4 gap-2">
          {EVENT_TYPES.map(et => (
            <button
              key={et.key}
              onClick={() => onAdd(et.key)}
              className={`py-2.5 border rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${et.cls}`}
            >
              <Plus className="w-4 h-4" /> {et.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-navy-light [&::-webkit-scrollbar-thumb]:rounded-full">
        {loadingPlayers ? (
          <p className="text-xs text-center text-gray-500 py-6">Đang tải cầu thủ...</p>
        ) : events.length === 0 ? (
          <p className="text-xs text-center text-gray-500 py-6">Chưa có sự kiện nào.</p>
        ) : (
          events.map(evt => (
            <EventCard
              key={evt.id}
              evt={evt}
              players={players}
              onUpdate={(id, f, v) => onUpdate(id, f, v)}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
}