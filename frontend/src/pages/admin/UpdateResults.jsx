import { useState, useEffect, useMemo, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Save, CheckCircle2, Plus, Trash2, Clock, Activity,
  Loader2, AlertTriangle, RefreshCw,
  Play, Pause, RotateCcw, Minus, ChevronDown, CalendarDays
} from 'lucide-react';
import { teamApi } from '../../api';
import useScheduleStore from '../../store/scheduleStore';
import useSeasonStore from '../../store/seasonStore';
import useToastStore from '../../store/toastStore';

import EventCard from '../../components/admin/EventCard';
import MatchTimer from '../../components/admin/MatchTimer';
import StatusBadge from '../../components/ui/StatusBadge';

export default function UpdateResults() {
  const toast = useToastStore();

  // ── Season Store ────────────────────────────────────────────
  const { seasons, isLoading: seasonsLoading, fetchAll: fetchSeasons } = useSeasonStore();
  const { getMatchesFromCache, isSeasonLoading, fetchBySeason, scheduleCache } = useScheduleStore();

  const [selectedSeasonId, setSelectedSeasonId] = useState('');

  // Fetch logic for all seasons if selectedSeasonId is empty
  useEffect(() => {
    if (selectedSeasonId) {
      fetchBySeason(Number(selectedSeasonId));
    } else {
      seasons.forEach(s => fetchBySeason(s.id));
    }
  }, [selectedSeasonId, seasons, fetchBySeason]);

  const effectiveSeasonId = selectedSeasonId;

  // ── Matches from schedule store ─────────────────────────────
  const allSeasonMatches = useMemo(
    () => effectiveSeasonId ? getMatchesFromCache(Number(effectiveSeasonId)) : seasons.flatMap(s => scheduleCache[s.id]?.matches ?? []),
    [effectiveSeasonId, seasons, scheduleCache, getMatchesFromCache]
  );
  
  const isLoadingMatches = effectiveSeasonId 
    ? isSeasonLoading(Number(effectiveSeasonId)) 
    : seasons.some(s => isSeasonLoading(s.id));

  // Chỉ lấy trận đang diễn hoặc sắp diễn để cập nhật kết quả
  const matches = useMemo(() =>
    allSeasonMatches.filter(m => m.status === 'scheduled' || m.status === 'ongoing'),
    [allSeasonMatches]
  );

  const [selectedMatchId, setSelectedMatchId] = useState('');

  const selectedMatch = useMemo(() => {
    if (!selectedMatchId || matches.length === 0) return null;
    return matches.find(m => String(m.id) === String(selectedMatchId)) ?? null;
  }, [matches, selectedMatchId]);

  // ── Load players ────────────────────────────────────────────
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

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homeEvents, setHomeEvents] = useState([]);
  const [awayEvents, setAwayEvents] = useState([]);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // ── Fetch on mount ──────────────────────────────────────────
  useEffect(() => {
    fetchSeasons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Khi season thay đổi: fetch lịch mới + reset trận đang chọn
  const prevSeasonRef = useRef(effectiveSeasonId);
  useEffect(() => {
    if (!effectiveSeasonId) return;
    fetchBySeason(Number(effectiveSeasonId));
    // Chỉ reset khi season thực sự thay đổi (không phải lần mount đầu tiên)
    if (prevSeasonRef.current !== effectiveSeasonId) {
      prevSeasonRef.current = effectiveSeasonId;
      setTimeout(() => {
        setSelectedMatchId('');
        setHomeScore(0);
        setAwayScore(0);
        setHomeEvents([]);
        setAwayEvents([]);
        setIsDirty(false);
      }, 0);
    }
  }, [effectiveSeasonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMatchChange = (e) => {
    setSelectedMatchId(e.target.value);
    setHomeScore(0);
    setAwayScore(0);
    setHomeEvents([]);
    setAwayEvents([]);
    setIsDirty(false);
  };

  const handleScoreChange = (side, val) => {
    const n = Math.max(0, parseInt(val) || 0);
    if (side === 'home') setHomeScore(n);
    else setAwayScore(n);
    setIsDirty(true);
  };

  const updateScoreDelta = (side, delta) => {
    if (side === 'home') setHomeScore(prev => Math.max(0, prev + delta));
    else setAwayScore(prev => Math.max(0, prev + delta));
    setIsDirty(true);
  };

  const addEvent = (side, type) => {
    const newEvt = { id: Date.now(), player: '', minute: '', type };
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
    if (side === 'home') setHomeEvents(updater);
    else setAwayEvents(updater);
    setIsDirty(true);
  };

  const validate = () => {
    const homeGoalCount = homeEvents.filter(e => e.type === 'goal').length;
    const awayGoalCount = awayEvents.filter(e => e.type === 'goal').length;
    
    if (homeGoalCount !== homeScore) {
      return `Đội nhà có ${homeScore} bàn nhưng có ${homeGoalCount} sự kiện bàn thắng.`;
    }
    if (awayGoalCount !== awayScore) {
      return `Đội khách có ${awayScore} bàn nhưng có ${awayGoalCount} sự kiện bàn thắng.`;
    }
    
    const isIncomplete = (e) => !e.player || !e.minute;
    if (homeEvents.some(isIncomplete) || awayEvents.some(isIncomplete)) {
      return 'Vui lòng điền đủ cầu thủ và phút cho tất cả các sự kiện.';
    }
    return '';
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    await new Promise(r => setTimeout(r, 400));
    setIsSavingDraft(false);
    setIsDirty(false);
    toast.info('Đã lưu nháp. Kết quả chưa được công bố công khai.');
  };

  const handlePublish = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setIsPublishing(true);
    await new Promise(r => setTimeout(r, 600));
    setIsPublishing(false);
    setIsDirty(false);
    toast.success('Đã cập nhật kết quả thành công! 🎉', 5000);
  };

  const handleReset = () => {
    setHomeScore(0);
    setAwayScore(0);
    setHomeEvents([]);
    setAwayEvents([]);
    setIsDirty(false);
    toast.info('Đã đặt lại form.');
  };

  const handleRefresh = () => {
    if (effectiveSeasonId) fetchBySeason(Number(effectiveSeasonId), { force: true });
  };

  const getHomeName = () => selectedMatch?.home_team?.name ?? `Đội ${selectedMatch?.home_team_id ?? ''}`;
  const getAwayName = () => selectedMatch?.away_team?.name ?? `Đội ${selectedMatch?.away_team_id ?? ''}`;

  const formatMatchLabel = (m) => {
    const home = m.home_team?.name ?? `Đội #${m.home_team_id}`;
    const away = m.away_team?.name ?? `Đội #${m.away_team_id}`;
    const date = m.scheduled_at ? ` — ${new Date(m.scheduled_at).toLocaleDateString('vi-VN')}` : '';
    return `${home} vs ${away}${date}`;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-18 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-neon" /> Quản lý Trận Đấu (Live)
            </h2>
            <p className="text-gray-400 text-sm mt-1">Cập nhật tỷ số, thẻ phạt và diễn biến trận đấu theo thời gian thực.</p>
          </div>
          {isDirty && (
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold bg-amber-400/10 border border-amber-400/30 px-4 py-2 rounded-xl animate-fade-in">
              <AlertTriangle className="w-4 h-4" /> Có thay đổi chưa lưu
            </div>
          )}
        </div>

        {/* Season Selector */}
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
                return (
                  <option key={s.id} value={s.id}>{s.name} — {statusLabel}</option>
                );
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

        {/* Match Selector */}
        <div className="bg-navy p-5 rounded-3xl border border-navy-light shadow-lg shadow-black/20">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Chọn trận đấu</label>
          {!effectiveSeasonId ? (
            <p className="text-gray-500 text-sm py-2">Vui lòng chọn mùa giải trước.</p>
          ) : isLoadingMatches ? (
            <div className="skeleton h-14 rounded-xl" />
          ) : matches.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              Không có trận đấu nào ở trạng thái <strong className="text-amber-400">sắp diễn ra</strong> hoặc{' '}
              <strong className="text-red-400">đang diễn ra</strong> trong mùa giải này.
            </div>
          ) : (
            <select
              className="w-full text-base p-4 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon transition-colors"
              value={selectedMatchId}
              onChange={handleMatchChange}
            >
              <option value="">-- Chọn trận đấu --</option>
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  {formatMatchLabel(m)}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedMatch && (
          <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6 items-start">
            
            {/* Central Scoreboard (moves to top on lg, middle on xl) */}
            <div className="lg:col-span-12 xl:col-span-6 order-1 xl:order-2 flex flex-col gap-6">
              <MatchTimer />

              <div className="bg-navy p-6 md:p-8 rounded-3xl border border-navy-light shadow-xl relative overflow-hidden flex-1 flex flex-col justify-center">
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-blue-500 via-emerald-400 to-amber-400" />
                
                {/* Match status */}
                <div className="text-center mb-4 flex items-center justify-center gap-3">
                  <StatusBadge status={selectedMatch.status} />
                  <span className="text-gray-500 text-xs font-bold">
                    {selectedMatch.scheduled_at
                      ? new Date(selectedMatch.scheduled_at).toLocaleDateString('vi-VN', { dateStyle: 'medium' })
                      : '—'
                    }
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-6 md:gap-8 mb-4">
                  {/* Home */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-14 h-14 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-navy-light bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white font-black text-xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 shadow-inner">
                      {getHomeName()[0]}
                    </div>
                    <div className="flex gap-1 sm:gap-2 bg-navy-dark p-1 sm:p-1.5 rounded-full border border-navy-light">
                      <button onClick={() => updateScoreDelta('home', -1)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy border border-transparent flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light hover:border-navy-light transition-all shadow-sm"><Minus className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                      <button onClick={() => updateScoreDelta('home', 1)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy border border-transparent flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light hover:border-navy-light transition-all shadow-sm"><Plus className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <input
                      type="number" 
                      min="0" 
                      max="99"
                      value={homeScore}
                      onChange={e => handleScoreChange('home', e.target.value)}
                      className="w-14 h-20 sm:w-24 sm:h-28 md:w-28 md:h-32 text-center text-3xl sm:text-6xl md:text-7xl font-black bg-navy-dark border-2 border-navy-light rounded-2xl sm:rounded-3xl focus:border-neon outline-none transition-all text-white shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-2xl sm:text-4xl font-black text-gray-600">–</span>
                    <input
                      type="number" 
                      min="0" 
                      max="99"
                      value={awayScore}
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
                      <button onClick={() => updateScoreDelta('away', -1)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy border border-transparent flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light hover:border-navy-light transition-all shadow-sm"><Minus className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                      <button onClick={() => updateScoreDelta('away', 1)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy border border-transparent flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light hover:border-navy-light transition-all shadow-sm"><Plus className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 py-2.5 px-6 bg-navy-dark hover:bg-navy-light text-gray-400 hover:text-white border border-navy-light rounded-xl text-sm font-bold transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Đặt lại tỷ số
                  </button>
                </div>
              </div>
            </div>

            {/* Home Column */}
            <div className="lg:col-span-6 xl:col-span-3 order-2 xl:order-1 flex flex-col gap-4">
              <div className="bg-navy p-4 sm:p-5 rounded-3xl border border-navy-light shadow-lg flex flex-col h-[450px] xl:h-[650px]">
                <div className="border-b border-navy-light pb-4 mb-4">
                  <h3 className="font-extrabold text-white text-lg uppercase tracking-wider line-clamp-1 mb-3 text-center">
                    {getHomeName()}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-md">⚽ {homeEvents.filter(e => e.type==='goal').length}</span>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-md">🟨 {homeEvents.filter(e => e.type==='yellow').length}</span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/20 rounded-md">🟥 {homeEvents.filter(e => e.type==='red').length}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => addEvent('home', 'goal')} className="py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1"><Plus className="w-4 h-4"/> Bàn</button>
                    <button onClick={() => addEvent('home', 'yellow')} className="py-2.5 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1"><Plus className="w-4 h-4"/> Vàng</button>
                    <button onClick={() => addEvent('home', 'red')} className="py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1"><Plus className="w-4 h-4"/> Đỏ</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-navy-light [&::-webkit-scrollbar-thumb]:rounded-full">
                  {loadingPlayers ? (
                    <p className="text-xs text-center text-gray-500 py-6">Đang tải cầu thủ...</p>
                  ) : homeEvents.length === 0 ? (
                    <p className="text-xs text-center text-gray-500 py-6">Chưa có sự kiện nào.</p>
                  ) : (
                    homeEvents.map(evt => (
                      <EventCard key={evt.id} evt={evt} players={homePlayers} onUpdate={(i, f, v) => updateEvent('home', i, f, v)} onRemove={id => removeEvent('home', id)} />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Away Column */}
            <div className="lg:col-span-6 xl:col-span-3 order-3 xl:order-3 flex flex-col gap-4">
              <div className="bg-navy p-4 sm:p-5 rounded-3xl border border-navy-light shadow-lg flex flex-col h-[450px] xl:h-[650px]">
                <div className="border-b border-navy-light pb-4 mb-4">
                  <h3 className="font-extrabold text-white text-lg uppercase tracking-wider line-clamp-1 mb-3 text-center">
                    {getAwayName()}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-md">⚽ {awayEvents.filter(e => e.type==='goal').length}</span>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-md">🟨 {awayEvents.filter(e => e.type==='yellow').length}</span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/20 rounded-md">🟥 {awayEvents.filter(e => e.type==='red').length}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => addEvent('away', 'goal')} className="py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1"><Plus className="w-4 h-4"/> Bàn</button>
                    <button onClick={() => addEvent('away', 'yellow')} className="py-2.5 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1"><Plus className="w-4 h-4"/> Vàng</button>
                    <button onClick={() => addEvent('away', 'red')} className="py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1"><Plus className="w-4 h-4"/> Đỏ</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-navy-light [&::-webkit-scrollbar-thumb]:rounded-full">
                  {loadingPlayers ? (
                    <p className="text-xs text-center text-gray-500 py-6">Đang tải cầu thủ...</p>
                  ) : awayEvents.length === 0 ? (
                    <p className="text-xs text-center text-gray-500 py-6">Chưa có sự kiện nào.</p>
                  ) : (
                    awayEvents.map(evt => (
                      <EventCard key={evt.id} evt={evt} players={awayPlayers} onUpdate={(i, f, v) => updateEvent('away', i, f, v)} onRemove={id => removeEvent('away', id)} />
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        {selectedMatch && (
          <div className="bg-navy p-3 rounded-2xl border border-navy-light shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-6 z-10">
            <p className="text-sm font-medium text-gray-400 text-center sm:text-left flex-1">
              Kiểm tra kỹ tỷ số, thẻ phạt và sự kiện bàn thắng trước khi công bố.
            </p>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={isSavingDraft || !isDirty}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-navy-dark hover:bg-navy-light border border-navy-light text-gray-300 hover:text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSavingDraft ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu Nháp
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider"
              >
                {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Cập nhật
              </button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
