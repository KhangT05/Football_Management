import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Settings as SettingsIcon, Trophy, Calendar, MapPin,
  Plus, Edit, Trash2, X, Save, Loader2, AlertTriangle,
  CheckCircle2, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';
import { tournamentApi, seasonApi, venueApi } from '../../api';
import useToastStore from '../../store/toastStore';

// ─── Shared Modal ────────────────────────────────────────
function Modal({ title, icon: Icon, iconClass, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            {Icon && <Icon className={`w-5 h-5 ${iconClass}`} />}
            {title}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-navy-light bg-navy-dark shrink-0 flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  );
}

function ConfirmDelete({ name, onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-navy border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h4 className="text-lg font-black text-white mb-1">Xác nhận xóa?</h4>
          <p className="text-sm text-gray-400">Xóa <strong className="text-white">"{name}"</strong> khỏi hệ thống. Hành động này không thể hoàn tác.</p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold bg-navy-light text-gray-300 hover:text-white border border-navy-light transition-colors">Hủy</button>
          <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [formErr, setFormErr] = useState('');

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await tournamentApi.getAll({ per_page: 50 });
      setItems(res.data ?? []);
    } catch {
      toast.error('Không tải được danh sách giải đấu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setForm({ name: '', description: '' }); setFormErr(''); setEditing(null); setModal('add'); };
  const openEdit = (item) => { setForm({ name: item.name, description: item.description ?? '' }); setFormErr(''); setEditing(item); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditing(null); setFormErr(''); };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormErr('Tên giải đấu không được bỏ trống.'); return; }
    setIsSaving(true);
    try {
      if (modal === 'add') {
        await tournamentApi.create({ name: form.name.trim(), description: form.description.trim() });
        toast.success(`Đã tạo giải đấu "${form.name.trim()}"!`);
      } else {
        await tournamentApi.update(editing.id, { name: form.name.trim(), description: form.description.trim() });
        toast.success(`Đã cập nhật "${form.name.trim()}"!`);
      }
      closeModal();
      fetch();
    } catch (err) {
      setFormErr(err?.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await tournamentApi.delete(deleting.id);
      toast.success(`Đã xóa "${deleting.name}".`);
      setDeleting(null);
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể xóa giải đấu.');
    } finally {
      setIsDeleting(false);
    }
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
              <button onClick={() => setDeleting(item)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Thêm giải đấu mới' : 'Chỉnh sửa giải đấu'}
          icon={Trophy} iconClass="text-blue-400"
          onClose={closeModal}
          footer={<>
            <button onClick={closeModal} className="px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light">Hủy</button>
            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-70">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {modal === 'add' ? 'Tạo giải đấu' : 'Lưu thay đổi'}
            </button>
          </>}
        >
          {formErr && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{formErr}</div>}
          <Field label="Tên giải đấu" required>
            <input className={INPUT} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: IT Super League 2026" />
          </Field>
          <Field label="Mô tả">
            <textarea className={INPUT + ' resize-none'} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả ngắn về giải đấu..." />
          </Field>
        </Modal>
      )}

      {deleting && <ConfirmDelete name={deleting.name} onConfirm={handleDelete} onCancel={() => setDeleting(null)} isLoading={isDeleting} />}
    </section>
  );
}

// ════════════════════════════════════════════════════
// SECTION: SEASONS
// ════════════════════════════════════════════════════
function SeasonsSection() {
  const toast = useToastStore();
  const [items, setItems] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', tournament_id: '',
    start_date: '', end_date: '', registration_deadline: '',
    max_teams: 8, status: 'upcoming',
  });
  const [formErr, setFormErr] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [seasonsRes, tournamentsRes] = await Promise.allSettled([
        seasonApi.getAll({ per_page: 50 }),
        tournamentApi.getAll({ per_page: 100 }),
      ]);
      if (seasonsRes.status === 'fulfilled') setItems(seasonsRes.value.data ?? []);
      if (tournamentsRes.status === 'fulfilled') setTournaments(tournamentsRes.value.data ?? []);
    } catch {
      toast.error('Không tải được dữ liệu mùa giải.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toDateInput = (d) => d ? new Date(d).toISOString().slice(0, 10) : '';

  const openAdd = () => {
    setForm({ name: '', description: '', tournament_id: tournaments[0]?.id ?? '', start_date: '', end_date: '', registration_deadline: '', max_teams: 8, status: 'upcoming' });
    setFormErr(''); setEditing(null); setModal('add');
  };
  const openEdit = (item) => {
    setForm({
      name: item.name, description: item.description ?? '',
      tournament_id: item.tournament_id ?? '',
      start_date: toDateInput(item.start_date),
      end_date: toDateInput(item.end_date),
      registration_deadline: toDateInput(item.registration_deadline),
      max_teams: item.max_teams, status: item.status,
    });
    setFormErr(''); setEditing(item); setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); setFormErr(''); };

  const validate = () => {
    if (!form.name.trim()) return 'Tên mùa giải không được bỏ trống.';
    if (!form.tournament_id) return 'Vui lòng chọn giải đấu.';
    if (!form.start_date || !form.end_date) return 'Vui lòng nhập ngày bắt đầu và kết thúc.';
    if (!form.registration_deadline) return 'Vui lòng nhập hạn đăng ký.';
    if (new Date(form.start_date) >= new Date(form.end_date)) return 'Ngày kết thúc phải sau ngày bắt đầu.';
    return '';
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setFormErr(err); return; }
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        tournament_id: Number(form.tournament_id),
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
        registration_deadline: new Date(form.registration_deadline).toISOString(),
        max_teams: Number(form.max_teams),
        status: form.status,
      };
      if (modal === 'add') {
        await seasonApi.create(payload);
        toast.success(`Đã tạo mùa giải "${form.name.trim()}"!`);
      } else {
        await seasonApi.update(editing.id, payload);
        toast.success(`Đã cập nhật "${form.name.trim()}"!`);
      }
      closeModal();
      fetchData();
    } catch (err) {
      setFormErr(err?.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await seasonApi.delete(deleting.id);
      toast.success(`Đã xóa mùa giải "${deleting.name}".`);
      setDeleting(null);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể xóa mùa giải.');
    } finally {
      setIsDeleting(false);
    }
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
          <button onClick={fetchData} disabled={isLoading} className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors">
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
                <button onClick={() => setDeleting(item)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Thêm mùa giải mới' : 'Chỉnh sửa mùa giải'}
          icon={Calendar} iconClass="text-purple-400"
          onClose={closeModal}
          footer={<>
            <button onClick={closeModal} className="px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light">Hủy</button>
            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 disabled:opacity-70">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {modal === 'add' ? 'Tạo mùa giải' : 'Lưu thay đổi'}
            </button>
          </>}
        >
          {formErr && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{formErr}</div>}
          <Field label="Tên mùa giải" required>
            <input className={INPUT} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Mùa giải 2026" />
          </Field>
          <Field label="Giải đấu" required>
            <select className={INPUT} value={form.tournament_id} onChange={e => setForm(f => ({ ...f, tournament_id: e.target.value }))}>
              <option value="">-- Chọn giải đấu --</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ngày bắt đầu" required>
              <input type="date" className={INPUT} value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
            </Field>
            <Field label="Ngày kết thúc" required>
              <input type="date" className={INPUT} value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hạn đăng ký" required>
              <input type="date" className={INPUT} value={form.registration_deadline} onChange={e => setForm(f => ({ ...f, registration_deadline: e.target.value }))} />
            </Field>
            <Field label="Tối đa đội">
              <input type="number" min="2" max="64" className={INPUT} value={form.max_teams} onChange={e => setForm(f => ({ ...f, max_teams: e.target.value }))} />
            </Field>
          </div>
          <Field label="Trạng thái">
            <select className={INPUT} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {SEASON_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Mô tả">
            <textarea className={INPUT + ' resize-none'} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả mùa giải..." />
          </Field>
        </Modal>
      )}

      {deleting && <ConfirmDelete name={deleting.name} onConfirm={handleDelete} onCancel={() => setDeleting(null)} isLoading={isDeleting} />}
    </section>
  );
}

// ════════════════════════════════════════════════════
// SECTION: VENUES
// ════════════════════════════════════════════════════
function VenuesSection() {
  const toast = useToastStore();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: '', address: '' });
  const [formErr, setFormErr] = useState('');

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await venueApi.getAll({ per_page: 100 });
      setItems(res.data ?? []);
    } catch {
      toast.error('Không tải được danh sách sân.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setForm({ name: '', address: '' }); setFormErr(''); setEditing(null); setModal('add'); };
  const openEdit = (item) => { setForm({ name: item.name, address: item.address ?? '' }); setFormErr(''); setEditing(item); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditing(null); setFormErr(''); };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormErr('Tên sân không được bỏ trống.'); return; }
    setIsSaving(true);
    try {
      if (modal === 'add') {
        await venueApi.create({ name: form.name.trim(), address: form.address.trim() || undefined });
        toast.success(`Đã thêm sân "${form.name.trim()}"!`);
      } else {
        await venueApi.update(editing.id, { name: form.name.trim(), address: form.address.trim() || undefined });
        toast.success(`Đã cập nhật sân "${form.name.trim()}"!`);
      }
      closeModal();
      fetch();
    } catch (err) {
      setFormErr(err?.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await venueApi.delete(deleting.id);
      toast.success(`Đã xóa sân "${deleting.name}".`);
      setDeleting(null);
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể xóa sân.');
    } finally {
      setIsDeleting(false);
    }
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
              <button onClick={() => setDeleting(item)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Thêm sân thi đấu' : 'Chỉnh sửa sân thi đấu'}
          icon={MapPin} iconClass="text-emerald-400"
          onClose={closeModal}
          footer={<>
            <button onClick={closeModal} className="px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light">Hủy</button>
            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 disabled:opacity-70">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {modal === 'add' ? 'Thêm sân' : 'Lưu thay đổi'}
            </button>
          </>}
        >
          {formErr && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{formErr}</div>}
          <Field label="Tên sân" required>
            <input className={INPUT} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Sân Mini Khu A" />
          </Field>
          <Field label="Địa chỉ">
            <input className={INPUT} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="VD: 65 Huỳnh Thúc Kháng, TP.HCM" />
          </Field>
        </Modal>
      )}

      {deleting && <ConfirmDelete name={deleting.name} onConfirm={handleDelete} onCancel={() => setDeleting(null)} isLoading={isDeleting} />}
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
          <p className="text-gray-400 text-sm mt-1">Quản lý giải đấu, mùa giải và sân thi đấu trong hệ thống.</p>
        </div>

        <TournamentsSection />
        <SeasonsSection />
        <VenuesSection />

      </div>
    </AdminLayout>
  );
}
