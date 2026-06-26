import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  CalendarDays, Clock, MapPin, RefreshCw,
  Construction, ChevronDown, AlertTriangle, RotateCcw,
  Edit, X, Save, Loader2, Play, Settings, Dices,
  CheckCircle2
} from 'lucide-react';
import useScheduleStore from '../../store/scheduleStore';
import useSeasonStore from '../../store/seasonStore';
import useTeamStore from '../../store/teamStore';
import useVenueStore from '../../store/venueStore';
import useToastStore from '../../store/toastStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { matchApi, seasonTeamApi } from '../../api';

// ─── Status Badge ────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    scheduled:  'bg-amber-400/10 text-amber-400 border-amber-400/30',
    ongoing:    'bg-red-400/10 text-red-400 border-red-400/30 animate-pulse',
    finished:   'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    cancelled:  'bg-gray-400/10 text-gray-400 border-gray-400/30',
    forfeited:  'bg-orange-400/10 text-orange-400 border-orange-400/30',
  };
  const labels = {
    scheduled: 'Sắp diễn ra',
    ongoing:   '🔴 Đang diễn ra',
    finished:  'Đã kết thúc',
    cancelled: 'Đã hủy',
    forfeited: 'Xử thua',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${map[status] || map.scheduled}`}>
      {labels[status] || status}
    </span>
  );
}

const INPUT = 'w-full px-4 py-2.5 bg-navy border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm';

export default function ManageMatches() {
  const toast = useToastStore();

  // ── Zustand stores ─────────────────────────────────────────
  const { seasons, isLoading: seasonsLoading, fetchAll: fetchSeasons } = useSeasonStore();
  const { teams, fetchAll: fetchTeams } = useTeamStore();
  const { venues, fetchAll: fetchVenues } = useVenueStore();
  const {
    getMatchesFromCache, isSeasonLoading,
    fetchBySeason, rescheduleMatch,
  } = useScheduleStore();

  // ── Local state ───────────────────────────────────────────
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '15:30', venue_id: '' });
  const [isSaving, setIsSaving] = useState(false);

  // ── Generate Schedule State ────────────────────────────────
  const [genModal, setGenModal] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [genTeamCount, setGenTeamCount] = useState(null); // số đội active trong mùa giải
  const [genForm, setGenForm] = useState({
    desiredGroupCount: 2,
    minGroupSize: 4,
    maxGroupSize: 5,
    venueIds: [], // array of venue ids
    startTime: '08:00',
    matchDuration: 90,
    breakTime: 30,
    matchesPerDay: 4,
    doubleRound: true,
    minRestDaysPerTeam: 2
  });

  // Không auto-select — bảng chỉ hiện khi user chủ động chọn mùa giải

  const selectedSeason = seasons.find(s => String(s.id) === String(selectedSeasonId)) ?? null;

  const matches = selectedSeasonId ? getMatchesFromCache(Number(selectedSeasonId)) : [];
  const isLoadingMatches = selectedSeasonId ? isSeasonLoading(Number(selectedSeasonId)) : false;

  // Cờ cho biết mùa giải hiện tại có thể generate schedule không
  const canGenerate = selectedSeason?.status === 'registration_open';

  useEffect(() => {
    fetchSeasons();
    fetchTeams();
    fetchVenues();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Khi season thay đổi: fetch lịch mới
  useEffect(() => {
    if (selectedSeasonId) fetchBySeason(Number(selectedSeasonId));
  }, [selectedSeasonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTeamName = (id) => teams.find(t => t.id === Number(id))?.name ?? `#${id}`;
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
    if (!rescheduleForm.date) { toast.error('Vui lòng chọn ngày thi đấu.'); return; }
    if (!rescheduleForm.venue_id) { toast.error('Vui lòng chọn sân thi đấu.'); return; }
    setIsSaving(true);
    try {
      // ⚠️ Backend schema dùng camelCase: scheduledAt + venueId (không phải snake_case)
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

  // Mở gen modal — fetch số đội active trong mùa giải
  const openGenModal = async () => {
    setGenModal(true);
    setGenTeamCount(null);
    if (!selectedSeasonId) return;
    try {
      const res = await seasonTeamApi.getAll({ season_id: selectedSeasonId, per_page: 100 });
      // Normalize response
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      const allTeams = Array.isArray(payload?.data) ? payload.data : [];
      const active = allTeams.filter(st => st.status !== 'withdrawn');
      setGenTeamCount(active.length);
    } catch {
      setGenTeamCount(null); // Không query được, bỏ qua
    }
  };

  const handleGenerateSchedule = async () => {
    if (genForm.venueIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sân thi đấu!'); return;
    }
    if (!canGenerate) {
      toast.error(`Mùa giải phải ở trạng thái "Đang mở đăng ký" (registration_open) mới có thể tạo lịch!`); return;
    }
    setGenLoading(true);
    try {
      // Tính toán mảng matchTimes từ config
      const { startTime, matchDuration, breakTime, matchesPerDay } = genForm;
      const matchTimes = [];
      
      const [hh, mm] = startTime.split(':').map(Number);
      let currentMinutes = hh * 60 + mm;

      for (let i = 0; i < Number(matchesPerDay); i++) {
        // Chặn overflow qua nửa đêm (24:00 = 1440 phút)
        if (currentMinutes >= 1440) break;
        const h = Math.floor(currentMinutes / 60);
        const m = currentMinutes % 60;
        // Backend regex: /^([01]\d|2[0-3]):[0-5]\d$/ — phải đúng format HH:MM
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
      // Backend trả { code, message } — message thường là "Request failed" (generic)
      // Nên map code sang tiếng Việt để UX tốt hơn
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

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">

        {/* Header */}
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
            <button
              onClick={openGenModal}
              disabled={!canGenerate}
              title={!canGenerate ? 'Mùa giải phải ở trạng thái Đang mở đăng ký' : undefined}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Settings className="w-4 h-4" /> Tạo lịch thi đấu tự động
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoadingMatches || !selectedSeasonId}
              className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingMatches ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Season Selector */}
        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-lg shadow-black/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-2">
            Mùa giải:
          </label>
          <div className="relative flex-1 max-w-sm">
            <select
              value={selectedSeasonId}
              onChange={e => setSelectedSeasonId(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon text-sm appearance-none"
            >
              <option value="">-- Chọn mùa giải --</option>
              {seasons.map(s => {
                const statusLabel = {
                  registration_open: '✅ Đang mở đăng ký',
                  ongoing: '🔴 Đang diễn ra',
                  finished: '✓ Đã kết thúc',
                  upcoming: '⏳ Sắp diễn ra',
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
            Đang có <strong className="text-white">{matches.length}</strong> trận đấu
          </span>
        )}
        </div>

        {/* Warning: season không ở registration_open */}
        {selectedSeasonId && !canGenerate && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 text-sm font-bold">Không thể tạo lịch cho mùa giải này</p>
              <p className="text-amber-400/80 text-xs mt-1">
                Mùa giải hiện ở trạng thái <strong>{selectedSeason?.status}</strong>.
                Chức năng “Tạo lịch tự động” chỉ hoạt động khi mùa giải ở trạng thái{' '}
                <strong className="text-amber-300">registration_open (Đang mở đăng ký)</strong>.
                Bạn vẫn có thể <strong>chỉnh sửa lịch từng trận</strong> có sẵn bên dưới.
              </p>
            </div>
          </div>
        )}

        {/* No season selected */}
        {!selectedSeasonId && !seasonsLoading && (
          <div className="bg-navy border border-navy-light rounded-2xl py-20 text-center text-gray-500">
            <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-lg">Vui lòng chọn mùa giải để xem lịch thi đấu</p>
          </div>
        )}

        {/* Matches Table */}
        {selectedSeasonId && (
          <div className="bg-navy border border-navy-light rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                <thead>
                  <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Thời gian & Sân</th>
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
                        {[1, 2, 3, 4, 5, 6, 7].map(j => (
                          <td key={j} className="py-4 px-6">
                            <div className="skeleton h-5 w-full rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : matches.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-24 text-center text-gray-400">
                        <Dices className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-white mb-2">Chưa có lịch thi đấu</h4>
                        <p className="text-sm text-gray-500 mb-6">Mùa giải này chưa được xếp lịch thi đấu nào.</p>
                        <button
                          onClick={openGenModal}
                          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          Tạo lịch tự động ngay
                        </button>
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
                          <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            {match.status === 'scheduled' && (
                              <button
                                onClick={() => openReschedule(match)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-dark text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500/30 transition-all text-xs font-bold shadow-md"
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

      {/* ─── Generate Schedule Modal ───────────────────────────────── */}
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
                    Công cụ này sẽ tiến hành chia bảng, tạo danh sách trận đấu và sắp xếp thời gian tự động dựa trên số lượng đội đã đăng ký trong mùa giải. Các trận đấu sẽ được rải đều trên các sân và khung giờ bạn chọn.
                  </p>
                </div>
              </div>

              {/* Team Count Check */}
              {genTeamCount !== null && (
                <div className={`rounded-2xl p-4 flex items-start gap-3 border ${
                  genTeamCount < 2
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-blue-500/10 border-blue-500/20'
                }`}>
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${genTeamCount < 2 ? 'text-red-400' : 'text-blue-400'}`} />
                  <div>
                    {genTeamCount < 2 ? (
                      <>
                        <p className="text-red-400 text-sm font-bold">Không đủ đội để tạo lịch</p>
                        <p className="text-red-400/80 text-xs mt-1">
                          Mùa giải hiện có <strong>{genTeamCount}</strong> đội đăng ký (chưa rút).
                          Cần ít nhất <strong>2 đội</strong> mới có thể tạo lịch thi đấu.
                          Hãy thêm đội vào mùa giải trước.
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
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Số lượng bảng đấu</label>
                    <input type="number" min="1" value={genForm.desiredGroupCount} onChange={e => setGenForm(f => ({...f, desiredGroupCount: e.target.value}))} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Số đội / Bảng (Tối thiểu)</label>
                    <input type="number" min="2" value={genForm.minGroupSize} onChange={e => setGenForm(f => ({...f, minGroupSize: e.target.value}))} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Số đội / Bảng (Tối đa)</label>
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
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" title="Thời gian bắt đầu trận đầu tiên trong ngày">Giờ bắt đầu</label>
                    <input type="time" value={genForm.startTime} onChange={e => setGenForm(f => ({...f, startTime: e.target.value}))} className={INPUT + ' font-mono'} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" title="Thời lượng mỗi trận đấu (phút)">Thời lượng (phút)</label>
                    <input type="number" min="30" value={genForm.matchDuration} onChange={e => setGenForm(f => ({...f, matchDuration: e.target.value}))} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" title="Thời gian nghỉ giữa các trận (phút)">Nghỉ giữa trận</label>
                    <input type="number" min="0" value={genForm.breakTime} onChange={e => setGenForm(f => ({...f, breakTime: e.target.value}))} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" title="Số trận tổ chức trên mỗi sân trong 1 ngày">Số trận / Ngày</label>
                    <input type="number" min="1" value={genForm.matchesPerDay} onChange={e => setGenForm(f => ({...f, matchesPerDay: e.target.value}))} className={INPUT} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" title="Số ngày nghỉ tối thiểu giữa 2 trận của cùng 1 đội">Số ngày nghỉ tối thiểu cho mỗi đội</label>
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
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'bg-emerald-500/20 border-emerald-500 text-white' 
                            : 'bg-navy border-navy-light text-gray-400 hover:border-gray-500 hover:bg-navy-light'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-500'}`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className="font-bold text-sm truncate">{v.name}</span>
                      </button>
                    )
                  })}
                  {venues.length === 0 && <p className="text-gray-500 text-sm">Chưa có sân thi đấu nào trong hệ thống.</p>}
                </div>
              </div>

            </div>

            <div className="px-6 py-5 border-t border-navy-light bg-navy-dark rounded-b-3xl flex justify-end gap-3 shrink-0">
              <button onClick={() => !genLoading && setGenModal(false)} className="px-6 py-3 font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light rounded-xl transition-colors">
                Hủy
              </button>
              <button
                onClick={handleGenerateSchedule}
                disabled={genLoading}
                className="px-8 py-3 font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-emerald-500/20 uppercase tracking-wide"
              >
                {genLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                Tạo lịch thi đấu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
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
              <div className="bg-navy-dark border border-navy-light rounded-2xl p-4 flex items-center justify-center gap-4">
                <span className="font-black text-white text-sm text-right flex-1 truncate">
                  {getTeamName(rescheduleModal.match.home_team_id)}
                </span>
                <span className="px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-lg shrink-0">VS</span>
                <span className="font-black text-white text-sm flex-1 truncate">
                  {getTeamName(rescheduleModal.match.away_team_id)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ngày thi đấu <span className="text-red-400">*</span></label>
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
              <button onClick={() => setRescheduleModal(null)} className="px-6 py-2.5 font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light rounded-xl transition-colors">Hủy</button>
              <button
                onClick={handleReschedule}
                disabled={isSaving}
                className="px-6 py-2.5 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 shadow-lg shadow-blue-500/20"
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
