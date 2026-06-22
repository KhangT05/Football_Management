import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Settings as SettingsIcon, Trophy, Calendar, MapPin,
  Plus, Edit, Trash2, Save, Loader2, AlertTriangle,
  CheckCircle2, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';
import { tournamentApi, seasonApi, venueApi, tournamentRuleApi } from '../../api';
import { useApiQuery, useCrudModal } from '../../hooks';
import useToastStore from '../../store/toastStore';
import useTournamentStore from '../../store/tournamentStore';
import useSeasonStore from '../../store/seasonStore';
import useVenueStore from '../../store/venueStore';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';


// ─── Generic field ─────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT = "w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm";
const SEASON_STATUSES = [
  { value: 'upcoming',          label: 'Sắp diễn ra' },
  { value: 'registration_open', label: 'Mở đăng ký' },
  { value: 'ongoing',           label: 'Đang diễn ra' },
  { value: 'finished',          label: 'Đã kết thúc' },
  { value: 'cancelled',         label: 'Đã hủy' },
];

// ════════════════════════════════════════════════════
// SECTION: TOURNAMENTS
// ════════════════════════════════════════════════════
function TournamentsSection() {
  const toast = useToastStore();
  const { invalidate: invalidateTournamentStore } = useTournamentStore();
  const { data: items, isLoading, fetch } = useApiQuery(
    (params) => tournamentApi.getAll(params),
    { perPage: 50, errorMsg: 'Không tải được danh sách giải đấu.' }
  );

  const crud = useCrudModal({
    emptyForm: { name: '', description: '' },
    onSuccess: () => { fetch(); invalidateTournamentStore(); },
  });

  const openAdd = () => crud.openAdd();
  const openEdit = (item) => crud.openEdit(item, { name: item.name, description: item.description ?? '' });

  const handleSave = () => {
    if (!crud.form.name.trim()) { crud.setFormError('Tên giải đấu không được bỏ trống.'); return; }
    crud.save(async () => {
      if (crud.modal === 'add') {
        await tournamentApi.create({ name: crud.form.name.trim(), description: crud.form.description.trim() });
        toast.success(`Đã tạo giải đấu "${crud.form.name.trim()}"!`);
      } else {
        await tournamentApi.update(crud.editing.id, { name: crud.form.name.trim(), description: crud.form.description.trim() });
        toast.success(`Đã cập nhật "${crud.form.name.trim()}"!`);
      }
    });
  };

  const handleDelete = () => {
    const item = crud.deleting;
    crud.confirmDelete(async () => {
      await tournamentApi.delete(item.id);
      toast.success(`Đã xóa "${item.name}".`);
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa giải đấu.');
    });
  };

  return (
    <section className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Trophy className="w-4 h-4 text-blue-400" /> Giải đấu ({items.length})
        </h3>
        <div className="flex gap-2">
          <button onClick={fetch} disabled={isLoading} className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors">
            <Plus className="w-4 h-4" /> Thêm giải đấu
          </button>
        </div>
      </div>
      <div className="divide-y divide-navy-light">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500"><Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>Chưa có giải đấu nào</p></div>
        ) : items.map(item => (
          <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-navy-light/10 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                {item.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 truncate">{item.description || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${item.is_active ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-colors"><Edit className="w-4 h-4" /></button>
              <button onClick={() => crud.setDeleting(item)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {crud.modal && (
        <AdminModal
          title={crud.modal === 'add' ? 'Thêm giải đấu mới' : 'Chỉnh sửa giải đấu'}
          icon={Trophy} iconClass="text-blue-400"
          onClose={crud.closeModal}
          footer={
            <>
              <button onClick={crud.closeModal} className="px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light">Hủy</button>
              <button onClick={handleSave} disabled={crud.isSaving} className="px-5 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-70">
                {crud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {crud.modal === 'add' ? 'Tạo giải đấu' : 'Lưu thay đổi'}
              </button>
            </>
          }
        >
          {crud.formError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{crud.formError}</div>}
          <Field label="Tên giải đấu" required>
            <input className={INPUT} value={crud.form.name} onChange={e => crud.setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: IT Super League 2026" />
          </Field>
          <Field label="Mô tả">
            <textarea className={INPUT + ' resize-none'} rows={3} value={crud.form.description} onChange={e => crud.setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả ngắn về giải đấu..." />
          </Field>
        </AdminModal>
      )}

      {crud.deleting && <ConfirmDeleteModal
        title="Xóa giải đấu?"
        message={`Xóa "${crud.deleting.name}" khỏi hệ thống. Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        onCancel={() => crud.setDeleting(null)}
        isDeleting={crud.isDeleting}
      />}
    </section>
  );
}

// ════════════════════════════════════════════════════
// SECTION: SEASONS
// ════════════════════════════════════════════════════
function SeasonsSection() {
  const toast = useToastStore();
  const EMPTY_SEASON = { name: '', description: '', tournament_id: '', start_date: '', end_date: '', registration_deadline: '', max_teams: 8, status: 'upcoming' };

  const { data: items, isLoading, fetch: fetchSeasons } = useApiQuery(
    (params) => seasonApi.getAll(params),
    { perPage: 50, errorMsg: 'Không tải được dữ liệu mùa giải.' }
  );

  const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    tournamentApi.getAll({ per_page: 100 }).then(res => {
      // PaginatedResult trực tiếp: { data: T[], meta: {...} }
      // Có thể wrapped: { status, message, data: PaginatedResult, ... }
      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      setTournaments(Array.isArray(payload?.data) ? payload.data : []);
    }).catch(() => {});
  }, []);

  const { invalidate: invalidateSeasonStore } = useSeasonStore();
  const crud = useCrudModal({ emptyForm: EMPTY_SEASON, onSuccess: () => { fetchSeasons(); invalidateSeasonStore(); } });

  const toDateInput = (d) => d ? new Date(d).toISOString().slice(0, 10) : '';

  const openAdd = () => {
    crud.openAdd({ ...EMPTY_SEASON, tournament_id: tournaments[0]?.id ?? '' });
  };
  const openEdit = (item) => {
    crud.openEdit(item, {
      name: item.name, description: item.description ?? '',
      tournament_id: item.tournament_id ?? '',
      start_date: toDateInput(item.start_date),
      end_date: toDateInput(item.end_date),
      registration_deadline: toDateInput(item.registration_deadline),
      max_teams: item.max_teams, status: item.status,
    });
  };

  const validate = () => {
    if (!crud.form.name.trim()) return 'Tên mùa giải không được bỏ trống.';
    if (!crud.form.tournament_id) return 'Vui lòng chọn giải đấu.';
    if (!crud.form.start_date || !crud.form.end_date) return 'Vui lòng nhập ngày bắt đầu và kết thúc.';
    if (!crud.form.registration_deadline) return 'Vui lòng nhập hạn đăng ký.';
    if (new Date(crud.form.start_date) >= new Date(crud.form.end_date)) return 'Ngày kết thúc phải sau ngày bắt đầu.';
    return '';
  };

  const handleSave = () => {
    const err = validate();
    if (err) { crud.setFormError(err); return; }
    crud.save(async () => {
      const payload = {
        name: crud.form.name.trim(),
        description: crud.form.description.trim() || undefined,
        tournament_id: Number(crud.form.tournament_id),
        start_date: new Date(crud.form.start_date).toISOString(),
        end_date: new Date(crud.form.end_date).toISOString(),
        registration_deadline: new Date(crud.form.registration_deadline).toISOString(),
        max_teams: Number(crud.form.max_teams),
        status: crud.form.status,
      };
      if (crud.modal === 'add') {
        await seasonApi.create(payload);
        toast.success(`Đã tạo mùa giải "${crud.form.name.trim()}"!`);
      } else {
        await seasonApi.update(crud.editing.id, payload);
        toast.success(`Đã cập nhật "${crud.form.name.trim()}"!`);
      }
    });
  };

  const handleDelete = () => {
    const item = crud.deleting;
    crud.confirmDelete(async () => {
      await seasonApi.delete(item.id);
      toast.success(`Đã xóa mùa giải "${item.name}".`);
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa mùa giải.');
    });
  };

  const statusMeta = {
    upcoming:          { label: 'Sắp diễn ra',    cls: 'bg-slate-400/10 text-slate-300 border-slate-500/30' },
    registration_open: { label: 'Mở đăng ký',     cls: 'bg-blue-400/10 text-blue-400 border-blue-400/30' },
    ongoing:           { label: 'Đang diễn ra',    cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' },
    finished:          { label: 'Kết thúc',        cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30' },
    cancelled:         { label: 'Đã hủy',          cls: 'bg-red-400/10 text-red-400 border-red-400/30' },
  };

  return (
    <section className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" /> Mùa giải ({items.length})
        </h3>
        <div className="flex gap-2">
          <button onClick={fetchSeasons} disabled={isLoading} className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-sm transition-colors">
            <Plus className="w-4 h-4" /> Thêm mùa giải
          </button>
        </div>
      </div>
      <div className="divide-y divide-navy-light">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500"><Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>Chưa có mùa giải nào</p></div>
        ) : items.map(item => {
          const sm = statusMeta[item.status] ?? statusMeta.upcoming;
          return (
            <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-navy-light/10 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-linear-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                  {item.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.start_date).toLocaleDateString('vi-VN')} — {new Date(item.end_date).toLocaleDateString('vi-VN')}
                    {' · '}Max {item.max_teams} đội
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${sm.cls}`}>{sm.label}</span>
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => crud.setDeleting(item)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {crud.modal && (
        <AdminModal
          title={crud.modal === 'add' ? 'Thêm mùa giải mới' : 'Chỉnh sửa mùa giải'}
          icon={Calendar} iconClass="text-purple-400"
          onClose={crud.closeModal}
          footer={<>
            <button onClick={crud.closeModal} className="px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light">Hủy</button>
            <button onClick={handleSave} disabled={crud.isSaving} className="px-5 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 disabled:opacity-70">
              {crud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {crud.modal === 'add' ? 'Tạo mùa giải' : 'Lưu thay đổi'}
            </button>
          </>}
        >
          {crud.formError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{crud.formError}</div>}
          <Field label="Tên mùa giải" required>
            <input className={INPUT} value={crud.form.name} onChange={e => crud.setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Mùa giải 2026" />
          </Field>
          <Field label="Giải đấu" required>
            <select className={INPUT} value={crud.form.tournament_id} onChange={e => crud.setForm(f => ({ ...f, tournament_id: e.target.value }))}>
              <option value="">-- Chọn giải đấu --</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ngày bắt đầu" required>
              <input type="date" className={INPUT} value={crud.form.start_date} onChange={e => crud.setForm(f => ({ ...f, start_date: e.target.value }))} />
            </Field>
            <Field label="Ngày kết thúc" required>
              <input type="date" className={INPUT} value={crud.form.end_date} onChange={e => crud.setForm(f => ({ ...f, end_date: e.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hạn đăng ký" required>
              <input type="date" className={INPUT} value={crud.form.registration_deadline} onChange={e => crud.setForm(f => ({ ...f, registration_deadline: e.target.value }))} />
            </Field>
            <Field label="Tối đa đội">
              <input type="number" min="2" max="64" className={INPUT} value={crud.form.max_teams} onChange={e => crud.setForm(f => ({ ...f, max_teams: e.target.value }))} />
            </Field>
          </div>
          <Field label="Trạng thái">
            <select className={INPUT} value={crud.form.status} onChange={e => crud.setForm(f => ({ ...f, status: e.target.value }))}>
              {SEASON_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Mô tả">
            <textarea className={INPUT + ' resize-none'} rows={2} value={crud.form.description} onChange={e => crud.setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả mùa giải..." />
          </Field>
        </AdminModal>
      )}

      {crud.deleting && <ConfirmDeleteModal title="Xóa mùa giải?" message={`Xóa "${crud.deleting.name}" khỏi hệ thống. Hành động này không thể hoàn tác.`} onConfirm={handleDelete} onCancel={() => crud.setDeleting(null)} isDeleting={crud.isDeleting} />}
    </section>
  );
}

// ════════════════════════════════════════════════════
// SECTION: VENUES
// ════════════════════════════════════════════════════
function VenuesSection() {
  const toast = useToastStore();
  const { data: items, isLoading, fetch } = useApiQuery(
    (params) => venueApi.getAll(params),
    { perPage: 100, errorMsg: 'Không tải được danh sách sân.' }
  );

  const { invalidate: invalidateVenueStore } = useVenueStore();
  const crud = useCrudModal({
    emptyForm: { name: '', address: '' },
    onSuccess: () => { fetch(); invalidateVenueStore(); },
  });

  const openAdd = () => crud.openAdd();
  const openEdit = (item) => crud.openEdit(item, { name: item.name, address: item.address ?? '' });

  const handleSave = () => {
    if (!crud.form.name.trim()) { crud.setFormError('Tên sân không được bỏ trống.'); return; }
    crud.save(async () => {
      if (crud.modal === 'add') {
        await venueApi.create({ name: crud.form.name.trim(), address: crud.form.address.trim() || undefined });
        toast.success(`Đã thêm sân "${crud.form.name.trim()}"!`);
      } else {
        await venueApi.update(crud.editing.id, { name: crud.form.name.trim(), address: crud.form.address.trim() || undefined });
        toast.success(`Đã cập nhật sân "${crud.form.name.trim()}"!`);
      }
    });
  };

  const handleDelete = () => {
    const item = crud.deleting;
    crud.confirmDelete(async () => {
      await venueApi.delete(item.id);
      toast.success(`Đã xóa sân "${item.name}".`);
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa sân.');
    });
  };

  return (
    <section className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" /> Sân thi đấu ({items.length})
        </h3>
        <div className="flex gap-2">
          <button onClick={fetch} disabled={isLoading} className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-colors">
            <Plus className="w-4 h-4" /> Thêm sân
          </button>
        </div>
      </div>
      <div className="divide-y divide-navy-light">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500"><MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>Chưa có sân thi đấu nào</p></div>
        ) : items.map(item => (
          <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-navy-light/10 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 truncate">{item.address || 'Chưa có địa chỉ'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${item.is_active ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-colors"><Edit className="w-4 h-4" /></button>
              <button onClick={() => crud.setDeleting(item)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {crud.modal && (
        <AdminModal
          title={crud.modal === 'add' ? 'Thêm sân thi đấu' : 'Chỉnh sửa sân thi đấu'}
          icon={MapPin} iconClass="text-emerald-400"
          onClose={crud.closeModal}
          footer={<>
            <button onClick={crud.closeModal} className="px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light">Hủy</button>
            <button onClick={handleSave} disabled={crud.isSaving} className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 disabled:opacity-70">
              {crud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {crud.modal === 'add' ? 'Thêm sân' : 'Lưu thay đổi'}
            </button>
          </>}
        >
          {crud.formError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{crud.formError}</div>}
          <Field label="Tên sân" required>
            <input className={INPUT} value={crud.form.name} onChange={e => crud.setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Sân Mini Khu A" />
          </Field>
          <Field label="Địa chỉ">
            <input className={INPUT} value={crud.form.address} onChange={e => crud.setForm(f => ({ ...f, address: e.target.value }))} placeholder="VD: 65 Huỳnh Thúc Kháng, TP.HCM" />
          </Field>
        </AdminModal>
      )}

      {crud.deleting && <ConfirmDeleteModal title="Xóa sân thi đấu?" message={`Xóa sân "${crud.deleting.name}" khỏi hệ thống. Hành động này không thể hoàn tác.`} onConfirm={handleDelete} onCancel={() => crud.setDeleting(null)} isDeleting={crud.isDeleting} />}
    </section>
  );
}

// ════════════════════════════════════════════════════
// SECTION: TOURNAMENT RULES
// ════════════════════════════════════════════════════
const TIEBREAKER_OPTIONS = [
  { value: 'goal_diff',      label: 'Hiệu số bàn thắng' },
  { value: 'goals_scored',   label: 'Tổng bàn thắng' },
  { value: 'head_to_head',   label: 'Đối đầu trực tiếp' },
  { value: 'goals_conceded', label: 'Bàn thủng' },
  { value: 'yellow_cards',   label: 'Thẻ vàng' },
  { value: 'red_cards',      label: 'Thẻ đỏ' },
];

const DEFAULT_RULE_FORM = {
  tournament_id: '',
  points_per_win: 3,
  points_per_draw: 1,
  points_per_loss: 0,
  forfeit_score: 3,
  yellow_cards_suspension: 3,
  max_players_per_team: 25,
  min_players_per_team: 11,
  teams_advance_per_group: 2,
  tiebreaker_order: ['goal_diff', 'goals_scored', 'head_to_head'],
};

function TournamentRulesSection() {
  const toast = useToastStore();
  const { data: items, isLoading, fetch: fetchRules } = useApiQuery(
    () => tournamentRuleApi.getAll(),
    { perPage: 50, errorMsg: 'Không tải được dữ liệu luật giải.' }
  );

  const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    tournamentApi.getAll({ per_page: 100 }).then(res => {
      // PaginatedResult trực tiếp: { data: T[], meta: {...} }
      // Có thể wrapped: { status, message, data: PaginatedResult, ... }
      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      setTournaments(Array.isArray(payload?.data) ? payload.data : []);
    }).catch(() => {});
  }, []);

  const crud = useCrudModal({ emptyForm: DEFAULT_RULE_FORM, onSuccess: () => fetchRules() });

  const getTournamentName = (id) => tournaments.find(t => t.id === id)?.name ?? `#${id}`;

  const openAdd = () => {
    crud.openAdd({ ...DEFAULT_RULE_FORM, tournament_id: tournaments[0]?.id ?? '' });
  };
  const openEdit = (item) => {
    crud.openEdit(item, {
      tournament_id: item.tournament_id,
      points_per_win: item.points_per_win,
      points_per_draw: item.points_per_draw,
      points_per_loss: item.points_per_loss,
      forfeit_score: item.forfeit_score,
      yellow_cards_suspension: item.yellow_cards_suspension,
      max_players_per_team: item.max_players_per_team,
      min_players_per_team: item.min_players_per_team,
      teams_advance_per_group: item.teams_advance_per_group,
      tiebreaker_order: item.tiebreaker_order ?? DEFAULT_RULE_FORM.tiebreaker_order,
    });
  };

  const toggleTiebreaker = (value) => {
    crud.setForm(f => ({
      ...f,
      tiebreaker_order: f.tiebreaker_order.includes(value)
        ? f.tiebreaker_order.filter(v => v !== value)
        : [...f.tiebreaker_order, value]
    }));
  };

  const handleSave = () => {
    if (!crud.form.tournament_id) { crud.setFormError('Vui lòng chọn giải đấu.'); return; }
    if (crud.form.tiebreaker_order.length === 0) { crud.setFormError('Chọn ít nhất 1 tiêu chí phân điểm.'); return; }
    crud.save(async () => {
      const payload = {
        ...crud.form,
        tournament_id: Number(crud.form.tournament_id),
        points_per_win: Number(crud.form.points_per_win),
        points_per_draw: Number(crud.form.points_per_draw),
        points_per_loss: Number(crud.form.points_per_loss),
        forfeit_score: Number(crud.form.forfeit_score),
        yellow_cards_suspension: Number(crud.form.yellow_cards_suspension),
        max_players_per_team: Number(crud.form.max_players_per_team),
        min_players_per_team: Number(crud.form.min_players_per_team),
        teams_advance_per_group: Number(crud.form.teams_advance_per_group),
      };
      if (crud.modal === 'add') {
        await tournamentRuleApi.create(payload);
        toast.success('Tạo luật giải thành công!');
      } else {
        await tournamentRuleApi.update(crud.editing.id, payload);
        toast.success('Cập nhật luật giải thành công!');
      }
    });
  };

  const handleDelete = () => {
    const item = crud.deleting;
    crud.confirmDelete(async () => {
      await tournamentRuleApi.delete(item.id);
      toast.success('Xóa luật giải thành công.');
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa luật giải.');
    });
  };

  return (
    <section className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-orange-400" /> Luật giải ({items.length})
        </h3>
        <div className="flex gap-2">
          <button onClick={fetchRules} disabled={isLoading} className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-sm transition-colors">
            <Plus className="w-4 h-4" /> Thêm luật
          </button>
        </div>
      </div>

      <div className="divide-y divide-navy-light">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1, 2].map(i => <div key={i} className="skeleton h-16 rounded-lg" />)}</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Chưa có luật giải nào. Nhấn "Thêm luật" để bắt đầu.</p>
          </div>
        ) : items.map(item => (
          <div key={item.id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-navy-light/10 transition-colors">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white truncate">{getTournamentName(item.tournament_id)}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                <span className="text-xs text-gray-400">Thắng: <strong className="text-emerald-400">{item.points_per_win}pts</strong></span>
                <span className="text-xs text-gray-400">Hòa: <strong className="text-amber-400">{item.points_per_draw}pts</strong></span>
                <span className="text-xs text-gray-400">Thua: <strong className="text-red-400">{item.points_per_loss}pts</strong></span>
                <span className="text-xs text-gray-400">Max: <strong className="text-white">{item.max_players_per_team} HV</strong></span>
                <span className="text-xs text-gray-400">Min: <strong className="text-white">{item.min_players_per_team} HV</strong></span>
                <span className="text-xs text-gray-400">Thẻ vàng cấm: <strong className="text-amber-300">{item.yellow_cards_suspension}</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => crud.setDeleting(item)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {crud.modal && (
        <AdminModal
          title={crud.modal === 'add' ? 'Thêm luật giải mới' : 'Chỉnh sửa luật giải'}
          icon={CheckCircle2} iconClass="text-orange-400"
          onClose={crud.closeModal}
          footer={<>
            <button onClick={crud.closeModal} className="px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light">Hủy</button>
            <button onClick={handleSave} disabled={crud.isSaving} className="px-5 py-2 rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 disabled:opacity-70">
              {crud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {crud.modal === 'add' ? 'Tạo luật' : 'Lưu thay đổi'}
            </button>
          </>}
        >
          {crud.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{crud.formError}
            </div>
          )}

          <Field label="Giải đấu" required>
            <select className={INPUT} value={crud.form.tournament_id} onChange={e => crud.setForm(f => ({ ...f, tournament_id: e.target.value }))}>
              <option value="">-- Chọn giải đấu --</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Thắng (pts)">
              <input type="number" min="0" max="10" className={INPUT} value={crud.form.points_per_win}
                onChange={e => crud.setForm(f => ({ ...f, points_per_win: e.target.value }))} />
            </Field>
            <Field label="Hòa (pts)">
              <input type="number" min="0" max="10" className={INPUT} value={crud.form.points_per_draw}
                onChange={e => crud.setForm(f => ({ ...f, points_per_draw: e.target.value }))} />
            </Field>
            <Field label="Thua (pts)">
              <input type="number" min="0" max="10" className={INPUT} value={crud.form.points_per_loss}
                onChange={e => crud.setForm(f => ({ ...f, points_per_loss: e.target.value }))} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Max HV/Đội">
              <input type="number" min="1" max="50" className={INPUT} value={crud.form.max_players_per_team}
                onChange={e => crud.setForm(f => ({ ...f, max_players_per_team: e.target.value }))} />
            </Field>
            <Field label="Min HV/Đội">
              <input type="number" min="1" max="50" className={INPUT} value={crud.form.min_players_per_team}
                onChange={e => crud.setForm(f => ({ ...f, min_players_per_team: e.target.value }))} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Đội đi tiếp/Bảng">
              <input type="number" min="1" className={INPUT} value={crud.form.teams_advance_per_group}
                onChange={e => crud.setForm(f => ({ ...f, teams_advance_per_group: e.target.value }))} />
            </Field>
            <Field label="Thẻ vàng cấm thi đấu">
              <input type="number" min="1" max="10" className={INPUT} value={crud.form.yellow_cards_suspension}
                onChange={e => crud.setForm(f => ({ ...f, yellow_cards_suspension: e.target.value }))} />
            </Field>
          </div>

          <Field label="Tiêu chí phân điểm (chọn ít nhất 1)" required>
            <div className="flex flex-wrap gap-2 mt-1">
              {TIEBREAKER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleTiebreaker(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    crud.form.tiebreaker_order.includes(opt.value)
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'bg-navy-dark border-navy-light text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {crud.form.tiebreaker_order.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Thứ tự ưu tiên: {crud.form.tiebreaker_order.map(v => TIEBREAKER_OPTIONS.find(o => o.value === v)?.label ?? v).join(' → ')}
              </p>
            )}
          </Field>
        </AdminModal>
      )}

      {/* Delete Confirm */}
      {crud.deleting && (
        <ConfirmDeleteModal
          title="Xóa luật giải?"
          message={`Xóa luật giải của "${getTournamentName(crud.deleting.tournament_id)}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleDelete}
          onCancel={() => crud.setDeleting(null)}
          isDeleting={crud.isDeleting}
        />
      )}
    </section>
  );
}

// ════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════
export default function Settings() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-gray-400" /> Cài đặt hệ thống
          </h2>
          <p className="text-gray-400 text-sm mt-1">Quản lý giải đấu, mùa giải, sân thi đấu và luật giải trong hệ thống.</p>
        </div>

        <TournamentsSection />
        <SeasonsSection />
        <VenuesSection />
        <TournamentRulesSection />

      </div>
    </AdminLayout>
  );
}
