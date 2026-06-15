import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Plus, Edit, Trash2, X, Save, Goal, Loader2,
  AlertTriangle, CheckCircle2, CalendarDays, Clock, MapPin
} from 'lucide-react';
import { Matches, teamsData } from '../../data/data';
import useToastStore from '../../store/toastStore';

// ─── Status Badge ────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Scheduled: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    Played:    'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    Live:      'bg-red-400/10 text-red-400 border-red-400/30 animate-pulse',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${map[status] || map.Scheduled}`}>
      {status === 'Scheduled' ? 'Sắp diễn ra' : status === 'Played' ? 'Đã kết thúc' : status}
    </span>
  );
}

// ─── Delete Confirm ───────────────────────────────────────
function ConfirmDeleteModal({ match, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-navy border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4 animate-slide-up">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h4 className="text-lg font-black text-white mb-1">Xóa trận đấu?</h4>
          <p className="text-sm text-gray-400">
            Xóa trận <strong className="text-white">{match?.home} vs {match?.away}</strong>? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold bg-navy-light text-gray-300 border border-navy-light hover:text-white transition-colors">Hủy</button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70 transition-colors">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { home: '', away: '', date: '', time: '15:30', location: '', status: 'Scheduled' };

export default function ManageMatches() {
  const toast = useToastStore();

  // ── Data State ─────────────────────────────────────────
  const [matches, setMatches] = useState(Matches);

  // ── Modal State ────────────────────────────────────────
  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
  const [editingMatch, setEditingMatch] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ── Delete State ───────────────────────────────────────
  const [deletingMatch, setDeletingMatch] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Handlers ──────────────────────────────────────────
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setFormError('');
    setEditingMatch(null);
    setModalMode('add');
  };

  const openEdit = (match) => {
    // Parse date/time from combined string
    const [datePart = '', timePart = ''] = match.date.includes(' ')
      ? match.date.split(' ')
      : [match.date, '15:30'];
    setFormData({
      home: match.home,
      away: match.away,
      date: datePart,
      time: timePart,
      location: match.location || '',
      status: match.status,
    });
    setFormError('');
    setEditingMatch(match);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingMatch(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const validate = () => {
    if (!formData.home) return 'Vui lòng chọn đội nhà.';
    if (!formData.away) return 'Vui lòng chọn đội khách.';
    if (formData.home === formData.away) return 'Đội nhà và đội khách không thể là cùng một đội.';
    if (!formData.date) return 'Vui lòng chọn ngày thi đấu.';
    return '';
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setFormError(err); return; }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500));

    const dateStr = formData.time
      ? `${formData.date} ${formData.time}`
      : formData.date;

    if (modalMode === 'add') {
      const newMatch = {
        id: Date.now(),
        home: formData.home,
        away: formData.away,
        date: dateStr,
        location: formData.location,
        status: formData.status,
      };
      setMatches(prev => [newMatch, ...prev]);
      toast.success(`Đã tạo trận "${newMatch.home} vs ${newMatch.away}" thành công!`);
    } else {
      setMatches(prev => prev.map(m => m.id === editingMatch.id
        ? { ...m, home: formData.home, away: formData.away, date: dateStr, location: formData.location, status: formData.status }
        : m
      ));
      toast.success(`Đã cập nhật thông tin trận đấu.`);
    }

    setIsSaving(false);
    closeModal();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 400));
    setMatches(prev => prev.filter(m => m.id !== deletingMatch.id));
    toast.success(`Đã xóa trận "${deletingMatch.home} vs ${deletingMatch.away}".`);
    setIsDeleting(false);
    setDeletingMatch(null);
  };

  const teamNames = teamsData.map(t => t.name);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Trận Đấu</h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-bold text-neon">{matches.length}</span> trận đấu trong giải
            </p>
          </div>
          <button
            onClick={openAdd}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Tạo trận đấu mới
          </button>
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
                  <th className="py-4 px-6 text-center">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-light">
                {matches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      <CalendarDays className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="font-semibold">Chưa có trận đấu nào.</p>
                    </td>
                  </tr>
                ) : (
                  matches.map((match, idx) => (
                    <tr key={match.id} className="hover:bg-navy-dark/70 transition-colors group animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                          <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                          {match.date}
                        </div>
                        {match.location && (
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                            <MapPin className="w-3 h-3" /> {match.location}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">{match.home}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-2 py-0.5 bg-navy-dark text-gray-400 font-black text-xs rounded border border-navy-light">VS</span>
                      </td>
                      <td className="py-4 px-6 font-bold text-white">{match.away}</td>
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
                            onClick={() => setDeletingMatch(match)}
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
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {modalMode === 'add' ? 'Tạo trận đấu mới' : 'Chỉnh sửa trận đấu'}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {formError}
                </div>
              )}

              {/* VS Matchup preview */}
              <div className="bg-navy-dark border border-navy-light rounded-xl p-4 flex items-center justify-center gap-4">
                <span className="font-black text-white text-sm truncate text-right flex-1">{formData.home || 'Đội nhà'}</span>
                <span className="px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-lg shrink-0">VS</span>
                <span className="font-black text-white text-sm truncate flex-1">{formData.away || 'Đội khách'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Đội nhà <span className="text-red-400">*</span></label>
                  <select name="home" value={formData.home} onChange={handleChange} className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm">
                    <option value="">-- Chọn --</option>
                    {teamNames.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Đội khách <span className="text-red-400">*</span></label>
                  <select name="away" value={formData.away} onChange={handleChange} className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm">
                    <option value="">-- Chọn --</option>
                    {teamNames.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ngày thi đấu <span className="text-red-400">*</span></label>
                  <input name="date" type="date" value={formData.date} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Giờ thi đấu</label>
                  <input name="time" type="time" value={formData.time} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Địa điểm</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input name="location" type="text" value={formData.location} onChange={handleChange}
                    placeholder="VD: Sân Mini Khu A"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Trạng thái</label>
                <div className="flex gap-3">
                  {['Scheduled', 'Played', 'Live'].map(s => (
                    <label key={s} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer text-sm font-bold transition-all ${
                      formData.status === s
                        ? s === 'Scheduled' ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                          : s === 'Played' ? 'bg-emerald-400/10 border-emerald-400 text-emerald-400'
                          : 'bg-red-400/10 border-red-400 text-red-400'
                        : 'border-navy-light text-gray-400 hover:border-gray-500'
                    }`}>
                      <input type="radio" name="status" value={s} checked={formData.status === s} onChange={handleChange} className="hidden" />
                      {s === 'Scheduled' ? 'Sắp tới' : s === 'Played' ? 'Đã đấu' : '🔴 Live'}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3 shrink-0">
              <button onClick={closeModal} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">Hủy</button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 shadow-md shadow-blue-500/20"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {modalMode === 'add' ? 'Tạo trận' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deletingMatch && (
        <ConfirmDeleteModal
          match={deletingMatch}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingMatch(null)}
          isDeleting={isDeleting}
        />
      )}
    </AdminLayout>
  );
}
