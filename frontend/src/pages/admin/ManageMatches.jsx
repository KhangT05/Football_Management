import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Plus, Edit, Trash2, X, Save, Loader2,
  AlertTriangle, CalendarDays, Clock, MapPin, RefreshCw
} from 'lucide-react';
import { matchApi, teamApi, venueApi, seasonApi } from '../../api';
import { useApiQuery, useCrudModal } from '../../hooks';
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

const EMPTY_FORM = {
  home_team_id: '',
  away_team_id: '',
  date: '',
  time: '15:30',
  venue_id: '',
  season_id: '',
  status: 'scheduled',
};

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Sắp tới' },
  { value: 'ongoing',   label: '🔴 Live' },
  { value: 'finished',  label: 'Đã đấu' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function ManageMatches() {
  const toast = useToastStore();

  // ── Data: Matches (useApiQuery) ────────────────────
  const { data: matches, meta, isLoading, error: fetchError, fetch: fetchMatches } = useApiQuery(
    matchApi.getMatches,
    { perPage: 20, errorMsg: 'Chưa có dữ liệu trận đấu từ server.' }
  );

  // ── Support Data (teams/venues/seasons cho dropdowns) ───
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const [teamsRes, venuesRes, seasonsRes] = await Promise.allSettled([
        teamApi.getTeams({ per_page: 100 }),
        venueApi.getAll({ per_page: 100 }),
        seasonApi.getAll({ per_page: 50 }),
      ]);
      if (cancelled) return;
      const parsePage = (res) => {
        const payload = (typeof res?.status === 'boolean') ? res.data : res;
        return Array.isArray(payload?.data) ? payload.data : [];
      };
      if (teamsRes.status === 'fulfilled') setTeams(parsePage(teamsRes.value));
      if (venuesRes.status === 'fulfilled') setVenues(parsePage(venuesRes.value));
      if (seasonsRes.status === 'fulfilled') setSeasons(parsePage(seasonsRes.value));
    };
    run();
    return () => { cancelled = true; };
  }, []);

  // ── CRUD Modal (useCrudModal) ─────────────────────────
  const crud = useCrudModal({
    emptyForm: EMPTY_FORM,
    onSuccess: () => fetchMatches(),
  });

  // ── Helpers ──────────────────────────────────────────
  const getTeamName = (id) => teams.find(t => t.id === Number(id))?.name ?? `#${id}`;
  const getVenueName = (id) => venues.find(v => v.id === Number(id))?.name ?? '—';

  // ── Handlers ─────────────────────────────────────────
  const openAdd = () => {
    crud.openAdd({ ...EMPTY_FORM, season_id: seasons[0]?.id ?? '' });
  };

  const openEdit = (match) => {
    const scheduledDate = match.scheduled_at ? new Date(match.scheduled_at) : null;
    crud.openEdit(match, {
      home_team_id: match.home_team_id ?? '',
      away_team_id: match.away_team_id ?? '',
      date: scheduledDate ? scheduledDate.toISOString().slice(0, 10) : '',
      time: scheduledDate ? scheduledDate.toTimeString().slice(0, 5) : '15:30',
      venue_id: match.venue_id ?? '',
      season_id: match.season_id ?? '',
      status: match.status ?? 'scheduled',
    });
  };

  const handleChange = (e) => {
    crud.setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    crud.setFormError('');
  };

  const validate = () => {
    if (!crud.form.home_team_id) return 'Vui lòng chọn đội nhà.';
    if (!crud.form.away_team_id) return 'Vui lòng chọn đội khách.';
    if (String(crud.form.home_team_id) === String(crud.form.away_team_id)) return 'Đội nhà và đội khách không thể giống nhau.';
    if (!crud.form.date) return 'Vui lòng chọn ngày thi đấu.';
    return '';
  };

  const handleSave = () => {
    const err = validate();
    if (err) { crud.setFormError(err); return; }
    crud.save(async () => {
      const scheduledAt = crud.form.time
        ? new Date(`${crud.form.date}T${crud.form.time}:00`).toISOString()
        : new Date(`${crud.form.date}T15:30:00`).toISOString();
      const payload = {
        home_team_id: Number(crud.form.home_team_id),
        away_team_id: Number(crud.form.away_team_id),
        scheduled_at: scheduledAt,
        venue_id: crud.form.venue_id ? Number(crud.form.venue_id) : undefined,
        season_id: crud.form.season_id ? Number(crud.form.season_id) : undefined,
        status: crud.form.status,
      };
      if (crud.modal === 'add') {
        await matchApi.create(payload);
        toast.success('Đã tạo trận đấu mới thành công!');
      } else {
        await matchApi.update(crud.editing.id, payload);
        toast.success('Đã cập nhật trận đấu thành công!');
      }
    });
  };

  const handleDeleteConfirm = () => {
    const match = crud.deleting;
    crud.confirmDelete(async () => {
      await matchApi.delete(match.id);
      toast.success('Đã xóa trận đấu.');
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa trận đấu.');
    });
  };

  const formatDateTime = (isoStr) => {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  };

  const INPUT = "w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm";

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Trận Đấu</h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-bold text-neon">{meta.total}</span> trận đấu trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchMatches()}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openAdd}
              disabled={!!fetchError}
              title={fetchError ? 'Match API chưa khả dụng từ backend' : undefined}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus className="w-5 h-5" /> Tạo trận đấu mới
            </button>
          </div>
        </div>

        {/* Table */}
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
                {isLoading ? (
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
                      <p className="font-semibold">
                        {fetchError ? fetchError : 'Chưa có trận đấu nào.'}
                      </p>
                      {fetchError && (
                        <p className="text-xs text-gray-600 mt-1">Match API chưa được triển khai ở backend.</p>
                      )}
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
                          <button
                            onClick={() => openEdit(match)}
                            className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => crud.setDeleting(match)}
                            className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {crud.modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={crud.closeModal} />
          <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">

            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {crud.modal === 'add' ? 'Tạo trận đấu mới' : 'Chỉnh sửa trận đấu'}
              </h3>
              <button onClick={crud.closeModal} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {crud.formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {crud.formError}
                </div>
              )}

              {/* VS Matchup preview */}
              <div className="bg-navy-dark border border-navy-light rounded-xl p-4 flex items-center justify-center gap-4">
                <span className="font-black text-white text-sm truncate text-right flex-1">
                  {crud.form.home_team_id ? getTeamName(crud.form.home_team_id) : 'Đội nhà'}
                </span>
                <span className="px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-lg shrink-0">VS</span>
                <span className="font-black text-white text-sm truncate flex-1">
                  {crud.form.away_team_id ? getTeamName(crud.form.away_team_id) : 'Đội khách'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Đội nhà <span className="text-red-400">*</span></label>
                  <select name="home_team_id" value={crud.form.home_team_id} onChange={handleChange} className={INPUT}>
                    <option value="">-- Chọn --</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Đội khách <span className="text-red-400">*</span></label>
                  <select name="away_team_id" value={crud.form.away_team_id} onChange={handleChange} className={INPUT}>
                    <option value="">-- Chọn --</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ngày thi đấu <span className="text-red-400">*</span></label>
                  <input name="date" type="date" value={crud.form.date} onChange={handleChange} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Giờ thi đấu</label>
                  <input name="time" type="time" value={crud.form.time} onChange={handleChange} className={INPUT} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Sân thi đấu</label>
                  <select name="venue_id" value={crud.form.venue_id} onChange={handleChange} className={INPUT}>
                    <option value="">-- Chọn sân --</option>
                    {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mùa giải</label>
                  <select name="season_id" value={crud.form.season_id} onChange={handleChange} className={INPUT}>
                    <option value="">-- Chọn mùa giải --</option>
                    {seasons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Trạng thái</label>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map(s => (
                    <label key={s.value} className={`flex-1 min-w-[80px] flex items-center justify-center gap-1 py-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                      crud.form.status === s.value
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-navy-light text-gray-400 hover:border-gray-500'
                    }`}>
                      <input type="radio" name="status" value={s.value} checked={crud.form.status === s.value} onChange={handleChange} className="hidden" />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3 shrink-0">
              <button onClick={crud.closeModal} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">Hủy</button>
              <button
                onClick={handleSave}
                disabled={crud.isSaving}
                className="px-6 py-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 shadow-md shadow-blue-500/20"
              >
                {crud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {crud.modal === 'add' ? 'Tạo trận' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {crud.deleting && (
        <ConfirmDeleteModal
          title="Xóa trận đấu?"
          message={
            <>
              Xóa trận{' '}
              <strong className="text-white">
                {teams.find(t => t.id === crud.deleting?.home_team_id)?.name ?? `#${crud.deleting?.home_team_id}`}
                {' vs '}
                {teams.find(t => t.id === crud.deleting?.away_team_id)?.name ?? `#${crud.deleting?.away_team_id}`}
              </strong>? Hành động này không thể hoàn tác.
            </>
          }
          onConfirm={handleDeleteConfirm}
          onCancel={() => crud.setDeleting(null)}
          isDeleting={crud.isDeleting}
        />
      )}
    </AdminLayout>
  );
}
