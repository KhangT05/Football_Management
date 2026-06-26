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

// ─── Unified Event Card ──────────────────────────────────────
function EventCard({ evt, players, onUpdate, onRemove }) {
  const getEventStyle = (type) => {
    switch (type) {
      case 'goal': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'yellow': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'red': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow': return '🟨';
      case 'red': return '🟥';
      default: return '❓';
    }
  };

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border relative group transition-all ${getEventStyle(evt.type)}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          {getEventIcon(evt.type)} {evt.type === 'goal' ? 'Bàn thắng' : evt.type === 'yellow' ? 'Thẻ vàng' : 'Thẻ đỏ'}
        </span>
        <button
          onClick={() => onRemove(evt.id)}
          className="w-6 h-6 bg-navy border border-red-500/40 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          title="Xóa sự kiện"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <select
        value={evt.player}
        onChange={e => onUpdate(evt.id, 'player', e.target.value)}
        className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none focus:border-neon"
      >
        <option value="">Chọn cầu thủ...</option>
        {players.map(p => (
          <option key={p.id} value={String(p.id)}>
            {p.name || p.player?.name} ({p.jersey_number ?? p.number ?? '?'})
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 opacity-70 shrink-0" />
        <input
          type="number"
          min="1" max="120"
          placeholder="Phút"
          value={evt.minute}
          onChange={e => onUpdate(evt.id, 'minute', e.target.value)}
          className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none text-center font-bold focus:border-neon"
        />
        <span className="text-xs opacity-70 shrink-0">'</span>
      </div>
    </div>
  );
}

// ─── Match Timer Component ──────────────────────────────────────
function MatchTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-navy rounded-3xl border border-navy-light shadow-lg shadow-black/20">
      <div className="flex w-full items-center justify-between mb-3">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-neon" /> Thời gian trận đấu
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isRunning 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
          </button>
          <button
            onClick={resetTimer}
            className="flex items-center justify-center p-1.5 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-all"
            title="Đặt lại thời gian"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="text-5xl font-black text-white tracking-widest font-mono drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    scheduled:  'bg-amber-400/10 text-amber-400 border-amber-400/30',
    ongoing:    'bg-red-400/10 text-red-400 border-red-400/30 animate-pulse',
    finished:   'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    cancelled:  'bg-gray-400/10 text-gray-400 border-gray-400/30',
  };
  const labels = {
    scheduled: 'Sắp diễn ra',
    ongoing:   '🔴 Đang diễn ra',
    finished:  'Đã kết thúc',
    cancelled: 'Đã hủy',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${map[status] || map.scheduled}`}>
      {labels[status] || status}
    </span>
  );
}

export default function UpdateResults() {
  const toast = useToastStore();

  // ── Season Store ────────────────────────────────────────────
  const { seasons, isLoading: seasonsLoading, fetchAll: fetchSeasons } = useSeasonStore();
  const { getMatchesFromCache, isSeasonLoading, fetchBySeason } = useScheduleStore();

  const [selectedSeasonId, setSelectedSeasonId] = useState('');

  // Auto-select: chọn mùa tốt nhất khi seasons thay đổi (useMemo để tránh setState trong effect)
  const bestSeasonId = useMemo(() => {
    if (seasons.length === 0) return '';
    const ongoing = seasons.find(s => s.status === 'ongoing');
    const regOpen = seasons.find(s => s.status === 'registration_open');
    return String((ongoing ?? regOpen ?? seasons[0]).id);
  }, [seasons]);

  // selectedSeasonId: '' = chưa chọn tay, nếu rỗng sẽ fallback sang bestSeasonId
  const effectiveSeasonId = selectedSeasonId || bestSeasonId;

  // ── Matches from schedule store ─────────────────────────────
  const allSeasonMatches = useMemo(
    () => effectiveSeasonId ? getMatchesFromCache(Number(effectiveSeasonId)) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectiveSeasonId, getMatchesFromCache]
  );
  const isLoadingMatches = effectiveSeasonId ? isSeasonLoading(Number(effectiveSeasonId)) : false;

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

    setLoadingPlayers(true);
    Promise.allSettled([
      teamApi.getPlayers(selectedMatch.home_team_id, { per_page: 50 }),
      teamApi.getPlayers(selectedMatch.away_team_id, { per_page: 50 }),
    ]).then(([homeRes, awayRes]) => {
      if (cancelled) return;
      setHomePlayers(homeRes.status === 'fulfilled' ? parsePlayers(homeRes.value) : []);
      setAwayPlayers(awayRes.status === 'fulfilled' ? parsePlayers(awayRes.value) : []);
      setLoadingPlayers(false);
    });

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
      setSelectedMatchId('');
      setHomeScore(0);
      setAwayScore(0);
      setHomeEvents([]);
      setAwayEvents([]);
      setIsDirty(false);
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
      <div className="max-w-7xl mx-auto space-y-6 pb-24 animate-fade-in">
        
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Home Column */}
            <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-4">
              <div className="bg-navy p-5 rounded-3xl border border-navy-light shadow-lg flex flex-col h-[650px]">
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

            {/* Central Scoreboard */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col gap-6">
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

                <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
                  {/* Home */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-navy-light bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white font-black text-3xl sm:text-4xl mb-4 shadow-inner">
                      {getHomeName()[0]}
                    </div>
                    <div className="flex gap-2 bg-navy-dark p-1.5 rounded-full border border-navy-light">
                      <button onClick={() => updateScoreDelta('home', -1)} className="w-10 h-10 rounded-full bg-navy border border-transparent flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light hover:border-navy-light transition-all shadow-sm"><Minus className="w-5 h-5"/></button>
                      <button onClick={() => updateScoreDelta('home', 1)} className="w-10 h-10 rounded-full bg-navy border border-transparent flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light hover:border-navy-light transition-all shadow-sm"><Plus className="w-5 h-5"/></button>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-4 shrink-0">
                    <input
                      type="number" min="0" max="99"
                      value={homeScore}
                      onChange={e => handleScoreChange('home', e.target.value)}
                      className="w-20 h-24 sm:w-28 sm:h-32 text-center text-5xl sm:text-7xl font-black bg-navy-dark border-2 border-navy-light rounded-3xl focus:border-neon outline-none transition-all text-white shadow-inner"
                    />
                    <span className="text-4xl font-black text-gray-600">–</span>
                    <input
                      type="number" min="0" max="99"
                      value={awayScore}
                      onChange={e => handleScoreChange('away', e.target.value)}
                      className="w-20 h-24 sm:w-28 sm:h-32 text-center text-5xl sm:text-7xl font-black bg-navy-dark border-2 border-navy-light rounded-3xl focus:border-neon outline-none transition-all text-white shadow-inner"
                    />
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-navy-light bg-linear-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white font-black text-3xl sm:text-4xl mb-4 shadow-inner">
                      {getAwayName()[0]}
                    </div>
                    <div className="flex gap-2 bg-navy-dark p-1.5 rounded-full border border-navy-light">
                      <button onClick={() => updateScoreDelta('away', -1)} className="w-10 h-10 rounded-full bg-navy border border-transparent flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light hover:border-navy-light transition-all shadow-sm"><Minus className="w-5 h-5"/></button>
                      <button onClick={() => updateScoreDelta('away', 1)} className="w-10 h-10 rounded-full bg-navy border border-transparent flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-light hover:border-navy-light transition-all shadow-sm"><Plus className="w-5 h-5"/></button>
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

            {/* Away Column */}
            <div className="lg:col-span-3 order-3 flex flex-col gap-4">
              <div className="bg-navy p-5 rounded-3xl border border-navy-light shadow-lg flex flex-col h-[650px]">
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
          <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-6 z-10">
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
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider"
              >
                {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Xác nhận & Cập nhật
              </button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
