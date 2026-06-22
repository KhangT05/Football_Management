import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  CalendarDays, Clock, MapPin, RefreshCw,
  Construction, ChevronDown, AlertTriangle, RotateCcw,
  Edit, X, Save, Loader2
} from 'lucide-react';
import useScheduleStore from '../../store/scheduleStore';
import useSeasonStore from '../../store/seasonStore';
import useTeamStore from '../../store/teamStore';
import useVenueStore from '../../store/venueStore';
import useToastStore from '../../store/toastStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

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

const INPUT = 'w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm';

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

  // Derive auto-selected season mà không cần setState trong effect
  const autoSeasonId = useMemo(() => {
    if (seasons.length === 0) return '';
    const ongoing = seasons.find(s => s.status === 'ongoing');
    return String(ongoing?.id ?? seasons[0].id);
  }, [seasons]);

  const effectiveSeasonId = selectedSeasonId || autoSeasonId;

  const matches = effectiveSeasonId ? getMatchesFromCache(Number(effectiveSeasonId)) : [];
  const isLoadingMatches = effectiveSeasonId ? isSeasonLoading(Number(effectiveSeasonId)) : false;

  // Tải dữ liệu support ban đầu
  useEffect(() => {
    fetchSeasons();
    fetchTeams();
    fetchVenues();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Khi effectiveSeasonId thay đổi → fetch lịch
  useEffect(() => {
    if (effectiveSeasonId) {
      fetchBySeason(Number(effectiveSeasonId));
    }
  }, [effectiveSeasonId]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setIsSaving(true);
    try {
      const scheduledAt = new Date(`${rescheduleForm.date}T${rescheduleForm.time}:00`).toISOString();
      await rescheduleMatch(
        rescheduleModal.match.id,
        { scheduled_at: scheduledAt, venue_id: rescheduleForm.venue_id ? Number(rescheduleForm.venue_id) : undefined },
        Number(effectiveSeasonId),
      );
      // Refetch để cập nhật danh sách
      fetchBySeason(Number(effectiveSeasonId), { force: true });
      toast.success('Đã đổi lịch trận đấu!');
      setRescheduleModal(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể đổi lịch trận đấu.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = () => {
    if (effectiveSeasonId) fetchBySeason(Number(effectiveSeasonId), { force: true });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Trận Đấu</h2>
            <p className="text-gray-400 text-sm mt-1">
              Xem và đổi lịch thi đấu theo mùa giải
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoadingMatches || !effectiveSeasonId}
              className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingMatches ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Season Selector */}
        <div className="bg-navy p-4 rounded-xl border border-navy-light shadow-lg shadow-black/20 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-purple-400" />
            Mùa giải:
          </label>
          <div className="relative flex-1 max-w-xs">
            <select
              value={effectiveSeasonId}
              onChange={e => setSelectedSeasonId(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm appearance-none"
            >
              <option value="">-- Chọn mùa giải --</option>
              {seasons.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {effectiveSeasonId && (
            <span className="text-xs text-gray-500 font-medium">
              {matches.length} trận đấu
            </span>
          )}
        </div>

        {/* API Info Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <Construction className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 text-sm font-bold">Thông tin về tính năng Match</p>
            <p className="text-amber-400/80 text-xs mt-1">
              Tạo lịch thi đấu tự động qua <strong>Admin Settings → Mùa giải → Generate Schedule</strong>.
              Trang này chỉ hỗ trợ <strong>đổi lịch</strong> (reschedule) từng trận.
            </p>
          </div>
        </div>

        {/* No season selected */}
        {!effectiveSeasonId && !seasonsLoading && (
          <div className="bg-navy border border-navy-light rounded-xl py-20 text-center text-gray-500">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Chọn mùa giải để xem lịch thi đấu</p>
          </div>
        )}

        {/* Table */}
        {effectiveSeasonId && (
          <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Thời gian</th>
                    <th className="py-4 px-6">Đội nhà</th>
                    <th className="py-4 px-6 text-center">VS</th>
                    <th className="py-4 px-6">Đội khách</th>
                    <th className="py-4 px-6 text-center">Tỷ số</th>
                    <th className="py-4 px-6 text-center">Trạng thái</th>
                    <th className="py-4 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-light">
                  {isLoadingMatches ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {[1, 2, 3, 4, 5, 6, 7].map(j => (
                          <td key={j} className="py-4 px-6">
                            <div className="skeleton h-4 w-full rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : matches.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-gray-400">
                        <CalendarDays className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="font-semibold">Chưa có trận đấu nào trong mùa giải này.</p>
                        <p className="text-xs text-gray-600 mt-1">Tạo lịch tự động trong phần Cài đặt mùa giải.</p>
                      </td>
                    </tr>
                  ) : (
                    matches.map((match, idx) => (
                      <tr key={match.id} className="hover:bg-navy-dark/70 transition-colors group animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                            <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                            {formatDateTime(match.scheduled_at)}
                          </div>
                          {match.venue_id && (
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                              <MapPin className="w-3 h-3" /> {getVenueName(match.venue_id)}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 font-bold text-white">{getTeamName(match.home_team_id)}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-2 py-0.5 bg-navy-dark text-gray-400 font-black text-xs rounded border border-navy-light">VS</span>
                        </td>
                        <td className="py-4 px-6 font-bold text-white">{getTeamName(match.away_team_id)}</td>
                        <td className="py-4 px-6 text-center font-black text-white">
                          {match.home_score != null && match.away_score != null
                            ? `${match.home_score} – ${match.away_score}`
                            : '—'
                          }
                        </td>
                        <td className="py-4 px-6 text-center">
                          <StatusBadge status={match.status} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {match.status === 'scheduled' && (
                              <button
                                onClick={() => openReschedule(match)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors text-xs font-bold"
                                title="Đổi lịch"
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

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRescheduleModal(null)} />
          <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden flex flex-col">

            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-400" />
                Đổi lịch trận đấu
              </h3>
              <button onClick={() => setRescheduleModal(null)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Match preview */}
              <div className="bg-navy-dark border border-navy-light rounded-xl p-4 flex items-center justify-center gap-4">
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
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ngày thi đấu <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    value={rescheduleForm.date}
                    onChange={e => setRescheduleForm(f => ({ ...f, date: e.target.value }))}
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Giờ thi đấu</label>
                  <input
                    type="time"
                    value={rescheduleForm.time}
                    onChange={e => setRescheduleForm(f => ({ ...f, time: e.target.value }))}
                    className={INPUT}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Sân thi đấu</label>
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

            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3">
              <button onClick={() => setRescheduleModal(null)} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">Hủy</button>
              <button
                onClick={handleReschedule}
                disabled={isSaving}
                className="px-6 py-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 shadow-md shadow-blue-500/20"
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
