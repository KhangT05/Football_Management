import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  CalendarDays, Clock, MapPin, RefreshCw,
  ChevronDown, AlertTriangle, RotateCcw,
  Edit, X, Save, Loader2, Play, Settings, Dices,
  CheckCircle2, Filter, Search, Users
} from 'lucide-react';
import useScheduleStore from '../../store/scheduleStore';
import useSeasonStore from '../../store/seasonStore';
import useTeamStore from '../../store/teamStore';
import useVenueStore from '../../store/venueStore';
import useToastStore from '../../store/toastStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { matchApi, seasonTeamApi } from '../../api';
import GroupDrawUI from '../../components/admin/GroupDrawUI';
import RealtimeBadge from '../../components/RealtimeBadge';
import StatusBadge from '../../components/ui/StatusBadge';
import { INPUT, BTN_PRIMARY, BTN_SECONDARY, BTN_ICON } from '../../utils/adminStyles';



const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'scheduled',  label: '📅 Sắp diễn ra' },
  { value: 'ongoing',    label: '🔴 Đang diễn ra' },
  { value: 'finished',   label: '✅ Đã kết thúc' },
  { value: 'cancelled',  label: '❌ Đã hủy' },
  { value: 'forfeited',  label: '⚠️ Xử thua' },
];

export default function ManageMatches() {
  const toast = useToastStore();

  // ── Zustand stores ─────────────────────────────────────────
  const { seasons, fetchAll: fetchSeasons } = useSeasonStore();
  const { teams, fetchAll: fetchTeams } = useTeamStore();
  const { venues, fetchAll: fetchVenues } = useVenueStore();
  const {
    isSeasonLoading,
    fetchBySeason, rescheduleMatch,
    scheduleCache
  } = useScheduleStore();

  // ── Local state ───────────────────────────────────────────
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [activeTab, setActiveTab]               = useState('schedule');
  const [filterStatus, setFilterStatus]         = useState('');
  const [filterRound, setFilterRound]           = useState('');
  const [rescheduleModal, setRescheduleModal]   = useState(null);
  const [rescheduleForm, setRescheduleForm]     = useState({ date: '', time: '15:30', venue_id: '' });
  const [isSaving, setIsSaving]                 = useState(false);

  // ── Generate Schedule State ────────────────────────────────
  const [genModal, setGenModal]         = useState(false);
  const [genLoading, setGenLoading]     = useState(false);
  const [genTeamCount, setGenTeamCount] = useState(null);
  const [genForm, setGenForm] = useState({
    desiredGroupCount: 2,
    minGroupSize: 4,
    maxGroupSize: 5,
    venueIds: [],
    startTime: '08:00',
    matchDuration: 90,
    breakTime: 30,
    matchesPerDay: 4,
    doubleRound: true,
    minRestDaysPerTeam: 2
  });

  const selectedSeason = useMemo(
    () => seasons.find(s => String(s.id) === String(selectedSeasonId)) ?? null,
    [seasons, selectedSeasonId],
  );

  // useMemo để reference ổn định, tránh các useMemo phụ thuộc vào rawMatches
  // re-compute mỗi render do conditional expression
  const rawMatches = useMemo(() => {
    if (selectedSeasonId) return scheduleCache[selectedSeasonId]?.matches ?? [];
    return seasons.flatMap(s => scheduleCache[s.id]?.matches ?? []);
  }, [selectedSeasonId, seasons, scheduleCache]);

  const isLoadingMatches = selectedSeasonId 
    ? isSeasonLoading(Number(selectedSeasonId)) 
    : seasons.some(s => isSeasonLoading(s.id));

  const canGenerate    = selectedSeason?.status === 'registration_open';

  // ── Available rounds (derived from matches) ────────────────
  const availableRounds = useMemo(() => {
    const rounds = [...new Set(rawMatches.map(m => m.round).filter(Boolean))].sort((a, b) => a - b);
    return rounds;
  }, [rawMatches]);

  // ── Filtered matches ───────────────────────────────────────
  const matches = useMemo(() => {
    let filtered = rawMatches;
    if (filterStatus) filtered = filtered.filter(m => m.status === filterStatus);
    if (filterRound)  filtered = filtered.filter(m => String(m.round) === String(filterRound));
    return filtered;
  }, [rawMatches, filterStatus, filterRound]);

  // ── Count by status ─────────────────────────────────────────
  const statusCounts = useMemo(() => {
    return rawMatches.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {});
  }, [rawMatches]);

  useEffect(() => {
    fetchSeasons();
    fetchTeams();
    fetchVenues();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch logic
  useEffect(() => {
    if (selectedSeasonId) {
      fetchBySeason(Number(selectedSeasonId));
    } else {
      seasons.forEach(s => fetchBySeason(s.id));
    }
    setFilterStatus('');
    setFilterRound('');
  }, [selectedSeasonId, seasons, fetchBySeason]);

  const getTeamName  = (id) => teams.find(t => t.id === Number(id))?.name ?? `#${id}`;
  const getVenueName = (id) => venues.find(v => v.id === Number(id))?.name ?? '—';

  const formatDateTime = (isoStr) => {
    if (!isoStr) return '—';
    return new Date(isoStr).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  };

  // ── Reschedule ─────────────────────────────────────────────
  const openReschedule = (match) => {
    const scheduledDate = match.scheduled_at ? new Date(match.scheduled_at) : null;
    setRescheduleForm({
      date: scheduledDate ? scheduledDate.toISOString().slice(0, 10) : '',
      time: scheduledDate ? scheduledDate.toTimeString().slice(0, 5) : '15:30',
      venue_id: match.venue_id ?? '',
    });
    setRescheduleModal({ match });
  };

  const handleReschedule = async () => {
    if (!rescheduleForm.date)     { toast.error('Vui lòng chọn ngày thi đấu.'); return; }
    if (!rescheduleForm.venue_id) { toast.error('Vui lòng chọn sân thi đấu.'); return; }
    setIsSaving(true);
    try {
      const scheduledAt = new Date(`${rescheduleForm.date}T${rescheduleForm.time}:00`).toISOString();
      await rescheduleMatch(
        rescheduleModal.match.id,
        { scheduledAt, venueId: Number(rescheduleForm.venue_id) },
        Number(selectedSeasonId),
      );
      fetchBySeason(Number(selectedSeasonId), { force: true });
      toast.success('Đã đổi lịch trận đấu!');
      setRescheduleModal(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể đổi lịch trận đấu.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Generate Schedule ──────────────────────────────────────
  const toggleVenue = (id) => {
    setGenForm(prev => {
      const exists = prev.venueIds.includes(id);
      return { ...prev, venueIds: exists ? prev.venueIds.filter(v => v !== id) : [...prev.venueIds, id] };
    });
  };

  const openGenModal = async () => {
    setGenModal(true);
    setGenTeamCount(null);
    if (!selectedSeasonId) return;
    try {
      const res = await seasonTeamApi.getAll({ season_id: selectedSeasonId, per_page: 100 });
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      const allTeams = Array.isArray(payload?.data) ? payload.data : [];
      const active = allTeams.filter(st => st.status !== 'withdrawn');
      setGenTeamCount(active.length);
    } catch {
      setGenTeamCount(null);
    }
  };

  const handleGenerateSchedule = async () => {
    if (genForm.venueIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sân thi đấu!'); return;
    }
    if (!canGenerate) {
      toast.error('Mùa giải phải ở trạng thái "Đang mở đăng ký" mới có thể tạo lịch!'); return;
    }
    setGenLoading(true);
    try {
      const { startTime, matchDuration, breakTime, matchesPerDay } = genForm;
      const matchTimes = [];
      const [hh, mm] = startTime.split(':').map(Number);
      let currentMinutes = hh * 60 + mm;

      for (let i = 0; i < Number(matchesPerDay); i++) {
        if (currentMinutes >= 1440) break;
        const h = Math.floor(currentMinutes / 60);
        const m = currentMinutes % 60;
        if (h > 23) break;
        matchTimes.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        currentMinutes += Number(matchDuration) + Number(breakTime);
      }

      if (matchTimes.length === 0) {
        toast.error('Không tính được khung giờ hợp lệ. Kiểm tra lại giờ bắt đầu và thời lượng trận.');
        setGenLoading(false); return;
      }

      const payload = {
        desiredGroupCount: Number(genForm.desiredGroupCount),
        minGroupSize: Number(genForm.minGroupSize),
        maxGroupSize: Number(genForm.maxGroupSize),
        venueIds: genForm.venueIds.map(Number),
        matchTimes,
        doubleRound: genForm.doubleRound,
        minRestDaysPerTeam: Number(genForm.minRestDaysPerTeam)
      };

      await matchApi.generateSchedule(Number(selectedSeasonId), payload);
      toast.success(`Đã tạo lịch thi đấu tự động thành công! Khung giờ: ${matchTimes.join(', ')} 🎉`);
      setGenModal(false);
      fetchBySeason(Number(selectedSeasonId), { force: true });
    } catch (err) {
      const data = err?.response?.data;
      const codeMessages = {
        'VALIDATION_ERROR': data?.message === 'Request failed'
          ? 'Mùa giải chưa đủ điều kiện: cần ít nhất 2 đội đã đăng ký và chưa có lịch nào được tạo.'
          : data?.message,
        'CONFLICT': 'Mùa giải đã có lịch thi đấu hoặc không ở đúng trạng thái để tạo lịch.',
        'NOT_FOUND': 'Không tìm thấy mùa giải.',
      };
      const msg = codeMessages[data?.code] || data?.message || 'Lỗi khi tạo lịch thi đấu.';
      toast.error(msg);
    } finally {
      setGenLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedSeasonId) fetchBySeason(Number(selectedSeasonId), { force: true });
  };

  const hasActiveFilter = filterStatus || filterRound;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-emerald-400" /> Quản lý Trận Đấu
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Khởi tạo, sắp xếp và thay đổi lịch thi đấu cho mùa giải hiện tại
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedSeasonId && <RealtimeBadge seasonId={Number(selectedSeasonId)} />}
            <button
              onClick={openGenModal}
              disabled={!canGenerate}
              title={!canGenerate ? 'Mùa giải phải ở trạng thái Đang mở đăng ký' : undefined}
              className={BTN_PRIMARY + ' bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'}
            >
              <Settings className="w-4 h-4" /> Tạo lịch tự động
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoadingMatches || !selectedSeasonId}
              className={BTN_ICON}
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingMatches ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Season Selector ─────────────────────────────────── */}
        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-xl shadow-black/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider shrink-0">
            Mùa giải:
          </label>
          <div className="relative flex-1 max-w-sm">
            <select
              value={selectedSeasonId}
              onChange={e => setSelectedSeasonId(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/20 text-sm appearance-none transition-all cursor-pointer"
            >
              <option value="">-- Chọn mùa giải --</option>
              {seasons.map(s => {
                const statusLabel = {
                  registration_open: '✅ Đang mở đăng ký',
                  ongoing:           '🔴 Đang diễn ra',
                  finished:          '✓ Đã kết thúc',
                  upcoming:          '⏳ Sắp diễn ra',
                }[s.status] ?? s.status;
                return (
                  <option key={s.id} value={s.id}>{s.name} — {statusLabel}</option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {selectedSeasonId && (
            <span className="text-sm text-gray-400 font-medium">
              <strong className="text-white">{rawMatches.length}</strong> trận đấu
            </span>
          )}
        </div>

        {/* ── Filter Bar ──────────────────────────────────────── */}
        {selectedSeasonId && rawMatches.length > 0 && (
          <div className="bg-navy/60 backdrop-blur-sm p-4 rounded-2xl border border-navy-light shadow-lg shadow-black/15 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
              <Filter className="w-3.5 h-3.5" /> Lọc:
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="pl-3 pr-8 py-2 bg-navy-dark border border-navy-light rounded-lg text-white text-xs font-bold focus:outline-none focus:border-neon appearance-none cursor-pointer transition-all"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Round filter */}
            {availableRounds.length > 0 && (
              <div className="relative">
                <select
                  value={filterRound}
                  onChange={e => setFilterRound(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-navy-dark border border-navy-light rounded-lg text-white text-xs font-bold focus:outline-none focus:border-neon appearance-none cursor-pointer transition-all"
                >
                  <option value="">Tất cả vòng</option>
                  {availableRounds.map(r => (
                    <option key={r} value={r}>Vòng {r}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            )}

            {/* Status count chips */}
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {Object.entries(statusCounts).map(([s, count]) => {
                const colors = {
                  scheduled: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
                  ongoing:   'bg-red-400/10 text-red-400 border-red-400/20',
                  finished:  'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
                  cancelled: 'bg-gray-400/10 text-gray-400 border-gray-400/20',
                  forfeited: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
                }[s] ?? 'bg-gray-400/10 text-gray-400 border-gray-400/20';
                return (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(prev => prev === s ? '' : s)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider transition-all ${colors} ${filterStatus === s ? 'ring-1 ring-offset-1 ring-offset-navy ring-current' : 'opacity-70 hover:opacity-100'}`}
                  >
                    {count} {s}
                  </button>
                );
              })}
              {hasActiveFilter && (
                <button
                  onClick={() => { setFilterStatus(''); setFilterRound(''); }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black text-gray-400 border border-gray-600 hover:border-gray-400 hover:text-white transition-all uppercase"
                >
                  <X className="w-3 h-3" /> Xóa filter
                </button>
              )}
            </div>

            {hasActiveFilter && (
              <p className="text-xs text-blue-400 font-bold shrink-0">
                Hiển thị <span className="text-white">{matches.length}</span> / {rawMatches.length} trận
              </p>
            )}
          </div>
        )}

        {/* ── Warning: season không ở registration_open ────────── */}
        {selectedSeasonId && !canGenerate && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 shadow-lg shadow-amber-500/5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 text-sm font-bold">Không thể tạo lịch cho mùa giải này</p>
              <p className="text-amber-400/80 text-xs mt-1">
                Mùa giải hiện ở trạng thái <strong>{selectedSeason?.status}</strong>.{' '}
                Chức năng "Tạo lịch tự động" chỉ hoạt động khi mùa giải ở trạng thái{' '}
                <strong className="text-amber-300">registration_open (Đang mở đăng ký)</strong>.
                Bạn vẫn có thể <strong>chỉnh sửa lịch từng trận</strong> có sẵn bên dưới.
              </p>
            </div>
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-navy-light pb-4">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : 'text-gray-400 hover:text-white hover:bg-navy-light'
            }`}
          >
            <CalendarDays className="w-4 h-4" /> Lịch thi đấu
          </button>
          <button
            onClick={() => setActiveTab('draw')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'draw'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-lg shadow-blue-500/10'
                : 'text-gray-400 hover:text-white hover:bg-navy-light'
            }`}
          >
            <Users className="w-4 h-4" /> Bốc thăm chia bảng
          </button>
        </div>

        {/* ── Tab Content ─────────────────────────────────────── */}
        {activeTab === 'draw' && (
          <GroupDrawUI seasonId={selectedSeasonId ? Number(selectedSeasonId) : null} />
        )}

        {/* ── Matches Table (Schedule Tab) ─────────────────────── */}
        {activeTab === 'schedule' && (
          <div className="bg-navy border border-navy-light rounded-2xl shadow-2xl shadow-black/25 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                <thead>
                  <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Thời gian & Sân</th>
                    <th className="py-4 px-6 text-center">Vòng</th>
                    <th className="py-4 px-6 text-right">Đội nhà</th>
                    <th className="py-4 px-6 text-center">VS</th>
                    <th className="py-4 px-6">Đội khách</th>
                    <th className="py-4 px-6 text-center">Tỷ số</th>
                    <th className="py-4 px-6 text-center">Trạng thái</th>
                    <th className="py-4 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-light/50">
                  {isLoadingMatches ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {[1,2,3,4,5,6,7,8].map(j => (
                          <td key={j} className="py-4 px-6">
                            <div className="skeleton h-5 w-full rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : matches.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-24 text-center text-gray-400">
                        <Dices className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-white mb-2">
                          {hasActiveFilter ? 'Không có trận nào khớp bộ lọc' : 'Chưa có lịch thi đấu'}
                        </h4>
                        <p className="text-sm text-gray-500 mb-6">
                          {hasActiveFilter
                            ? 'Thử thay đổi điều kiện lọc hoặc xóa bộ lọc.'
                            : 'Mùa giải này chưa được xếp lịch thi đấu nào.'}
                        </p>
                        {!hasActiveFilter && (
                          <button
                            onClick={openGenModal}
                            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 active:scale-[.98]"
                          >
                            Tạo lịch tự động ngay
                          </button>
                        )}
                        {hasActiveFilter && (
                          <button
                            onClick={() => { setFilterStatus(''); setFilterRound(''); }}
                            className="px-6 py-3 rounded-xl bg-navy border border-navy-light hover:bg-navy-light text-white font-bold transition-all shadow-lg shadow-black/20"
                          >
                            Xóa bộ lọc
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    matches.map((match) => (
                      <tr key={match.id} className="hover:bg-navy-light/30 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-white font-bold text-sm">
                            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                            {formatDateTime(match.scheduled_at)}
                          </div>
                          {match.venue_id && (
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1.5 font-medium">
                              <MapPin className="w-3.5 h-3.5" /> {getVenueName(match.venue_id)}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {match.round ? (
                            <span className="px-2.5 py-1 bg-navy-dark text-blue-400 font-black text-[10px] rounded-lg border border-blue-500/20 uppercase">
                              V{match.round}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="py-4 px-6 font-bold text-white text-right">{getTeamName(match.home_team_id)}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-2.5 py-1 bg-navy-dark text-gray-500 font-black text-[10px] rounded border border-navy-light uppercase">VS</span>
                        </td>
                        <td className="py-4 px-6 font-bold text-white">{getTeamName(match.away_team_id)}</td>
                        <td className="py-4 px-6 text-center font-black text-white text-lg">
                          {match.home_score != null && match.away_score != null
                            ? `${match.home_score} – ${match.away_score}`
                            : '—'
                          }
                        </td>
                        <td className="py-4 px-6 text-center">
                          <StatusBadge status={match.status} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                            {match.status === 'scheduled' && (
                              <button
                                onClick={() => openReschedule(match)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-dark text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500/30 hover:border-blue-500 transition-all text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[.97]"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Đổi lịch
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ─── Generate Schedule Modal ──────────────────────────── */}
      {genModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !genLoading && setGenModal(false)} />
          <div className="relative bg-navy border border-navy-light rounded-3xl shadow-2xl w-full max-w-3xl animate-slide-up flex flex-col max-h-[90vh]">

            <div className="flex items-center justify-between px-6 py-5 border-b border-navy-light bg-navy-dark rounded-t-3xl">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Settings className="w-6 h-6 text-emerald-400" />
                Thiết lập lịch thi đấu
              </h3>
              <button onClick={() => !genLoading && setGenModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Dices className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-emerald-400 text-sm font-bold">Hệ thống tạo lịch tự động</p>
                  <p className="text-emerald-400/80 text-xs mt-1">
                    Công cụ này sẽ tiến hành chia bảng, tạo danh sách trận đấu và sắp xếp thời gian tự động dựa trên số lượng đội đã đăng ký trong mùa giải.
                  </p>
                </div>
              </div>

              {genTeamCount !== null && (
                <div className={`rounded-2xl p-4 flex items-start gap-3 border ${
                  genTeamCount < 2 ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'
                }`}>
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${genTeamCount < 2 ? 'text-red-400' : 'text-blue-400'}`} />
                  <div>
                    {genTeamCount < 2 ? (
                      <>
                        <p className="text-red-400 text-sm font-bold">Không đủ đội để tạo lịch</p>
                        <p className="text-red-400/80 text-xs mt-1">
                          Mùa giải hiện có <strong>{genTeamCount}</strong> đội. Cần ít nhất <strong>2 đội</strong>.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-blue-400 text-sm font-bold">{genTeamCount} đội sẵn sàng thi đấu</p>
                        <p className="text-blue-400/80 text-xs mt-1">
                          Hệ thống sẽ chia <strong>{genTeamCount}</strong> đội vào các bảng và tạo lịch tự động.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Group Setting */}
              <div>
                <h4 className="font-bold text-white mb-4 border-b border-navy-light pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-navy-light flex items-center justify-center text-xs">1</span>
                  Cấu hình Bảng Đấu & Thể thức
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Số bảng đấu</label>
                    <input type="number" min="1" value={genForm.desiredGroupCount} onChange={e => setGenForm(f => ({...f, desiredGroupCount: e.target.value}))} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Số đội / Bảng (Min)</label>
                    <input type="number" min="2" value={genForm.minGroupSize} onChange={e => setGenForm(f => ({...f, minGroupSize: e.target.value}))} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Số đội / Bảng (Max)</label>
                    <input type="number" min="2" value={genForm.maxGroupSize} onChange={e => setGenForm(f => ({...f, maxGroupSize: e.target.value}))} className={INPUT} />
                  </div>
                </div>
                <div className="mt-4 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={genForm.doubleRound} onChange={e => setGenForm(f => ({...f, doubleRound: e.target.checked}))} className="w-4 h-4 rounded bg-navy border-navy-light text-emerald-500 focus:ring-emerald-500 focus:ring-offset-navy-dark" />
                    <span className="text-sm text-gray-300 font-medium">Thi đấu vòng tròn 2 lượt (Lượt đi - Lượt về)</span>
                  </label>
                </div>
              </div>

              {/* Time Setting */}
              <div>
                <h4 className="font-bold text-white mb-4 border-b border-navy-light pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-navy-light flex items-center justify-center text-xs">2</span>
                  Khung thời gian thi đấu
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Giờ bắt đầu</label>
                    <input type="time" value={genForm.startTime} onChange={e => setGenForm(f => ({...f, startTime: e.target.value}))} className={INPUT + ' font-mono'} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Thời lượng (phút)</label>
                    <input type="number" min="30" value={genForm.matchDuration} onChange={e => setGenForm(f => ({...f, matchDuration: e.target.value}))} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nghỉ giữa trận</label>
                    <input type="number" min="0" value={genForm.breakTime} onChange={e => setGenForm(f => ({...f, breakTime: e.target.value}))} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Số trận / Ngày</label>
                    <input type="number" min="1" value={genForm.matchesPerDay} onChange={e => setGenForm(f => ({...f, matchesPerDay: e.target.value}))} className={INPUT} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ngày nghỉ tối thiểu / đội</label>
                  <input type="number" min="1" value={genForm.minRestDaysPerTeam} onChange={e => setGenForm(f => ({...f, minRestDaysPerTeam: e.target.value}))} className={INPUT + ' max-w-[200px]'} />
                </div>
              </div>

              {/* Venue Setting */}
              <div>
                <h4 className="font-bold text-white mb-4 border-b border-navy-light pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-navy-light flex items-center justify-center text-xs">3</span>
                  Chọn sân thi đấu
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {venues.map(v => {
                    const isSelected = genForm.venueIds.includes(v.id);
                    return (
                      <button
                        key={v.id}
                        onClick={() => toggleVenue(v.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all shadow-md active:scale-[.97] ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-emerald-500/15'
                            : 'bg-navy border-navy-light text-gray-400 hover:border-gray-500 hover:bg-navy-light shadow-black/10'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-500'}`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className="font-bold text-sm truncate">{v.name}</span>
                      </button>
                    );
                  })}
                  {venues.length === 0 && <p className="text-gray-500 text-sm">Chưa có sân thi đấu nào.</p>}
                </div>
              </div>

            </div>

            <div className="px-6 py-5 border-t border-navy-light bg-navy-dark rounded-b-3xl flex justify-end gap-3 shrink-0">
              <button onClick={() => !genLoading && setGenModal(false)} className={BTN_SECONDARY}>
                Hủy
              </button>
              <button
                onClick={handleGenerateSchedule}
                disabled={genLoading}
                className={BTN_PRIMARY + ' px-8 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 uppercase tracking-wide'}
              >
                {genLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                Tạo lịch thi đấu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Reschedule Modal ─────────────────────────────────── */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRescheduleModal(null)} />
          <div className="relative bg-navy border border-navy-light rounded-3xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden flex flex-col">

            <div className="flex items-center justify-between px-6 py-5 border-b border-navy-light bg-navy-dark">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-400" />
                Đổi lịch trận đấu
              </h3>
              <button onClick={() => setRescheduleModal(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Match preview */}
              <div className="bg-navy-dark border border-navy-light rounded-2xl p-4 flex items-center justify-center gap-4 shadow-inner">
                <span className="font-black text-white text-sm text-right flex-1 truncate">
                  {getTeamName(rescheduleModal.match.home_team_id)}
                </span>
                <span className="px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-lg shrink-0 shadow-md shadow-blue-600/30">VS</span>
                <span className="font-black text-white text-sm flex-1 truncate">
                  {getTeamName(rescheduleModal.match.away_team_id)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Ngày thi đấu <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={rescheduleForm.date}
                    onChange={e => setRescheduleForm(f => ({ ...f, date: e.target.value }))}
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Giờ thi đấu</label>
                  <input
                    type="time"
                    value={rescheduleForm.time}
                    onChange={e => setRescheduleForm(f => ({ ...f, time: e.target.value }))}
                    className={INPUT}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sân thi đấu</label>
                <select
                  value={rescheduleForm.venue_id}
                  onChange={e => setRescheduleForm(f => ({ ...f, venue_id: e.target.value }))}
                  className={INPUT}
                >
                  <option value="">-- Chọn sân --</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-navy-light bg-navy-dark flex justify-end gap-3">
              <button onClick={() => setRescheduleModal(null)} className={BTN_SECONDARY}>Hủy</button>
              <button
                onClick={handleReschedule}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-70 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 active:scale-[.98]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu lịch mới
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
