import { useState, useEffect } from 'react';
import {
  Calendar, Plus, Edit, Trash2, Save, Loader2, AlertTriangle,
  RefreshCw, ArrowRight, Lock, CheckCircle2, XCircle,
} from 'lucide-react';
import { tournamentApi, seasonApi } from '../../../api';
import { useApiQuery, useCrudModal } from '../../../hooks';
import useToastStore from '../../../store/toastStore';
import useSeasonStore from '../../../store/seasonStore';
import AdminModal from '../AdminModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import FormField from '../../ui/FormField';
import Pagination from '../../ui/Pagination';

const INPUT = 'w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm';

// Mirror backend STATUS_TRANSITIONS
const STATUS_TRANSITIONS = {
  upcoming:          ['registration_open', 'cancelled'],
  registration_open: ['ongoing', 'cancelled'],
  ongoing:           ['finished', 'cancelled'],
  finished:          [],
  cancelled:         [],
};

// Mirror backend validateStatusAllowsEdit — chỉ upcoming được sửa/xóa
const canEdit   = (status) => status === 'upcoming';
const canDelete = (status) => status === 'upcoming';

const EMPTY_SEASON = {
  name: '', description: '', tournament_id: '', start_date: '', end_date: '',
  registration_deadline: '', max_teams: 8,
};

const statusMeta = {
  upcoming:          { label: 'Sắp diễn ra',  cls: 'bg-slate-400/10 text-slate-300 border-slate-500/30' },
  registration_open: { label: 'Mở đăng ký',   cls: 'bg-blue-400/10 text-blue-400 border-blue-400/30' },
  ongoing:           { label: 'Đang diễn ra',  cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' },
  finished:          { label: 'Kết thúc',      cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30' },
  cancelled:         { label: 'Đã hủy',        cls: 'bg-red-400/10 text-red-400 border-red-400/30' },
};

const statusTransitionLabel = {
  registration_open: 'Mở đăng ký',
  ongoing:           'Bắt đầu giải',
  finished:          'Kết thúc giải',
  cancelled:         'Hủy giải',
};

export default function SeasonsSection() {
  const toast = useToastStore();
  const { data: items, isLoading, fetch: fetchSeasons } = useApiQuery(
    (params) => seasonApi.getAll(params),
    { perPage: 50, errorMsg: 'Không tải được dữ liệu mùa giải.' }
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((items || []).length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = (items || []).slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    tournamentApi.getAll({ per_page: 100 }).then(res => {
      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      setTournaments(Array.isArray(payload?.data) ? payload.data : []);
    }).catch(() => {});
  }, []);

  const { invalidate: invalidateSeasonStore } = useSeasonStore();
  const crud = useCrudModal({
    emptyForm: EMPTY_SEASON,
    onSuccess: () => { fetchSeasons(); invalidateSeasonStore(); },
  });

  // ── Status Change Modal ─────────────────────────────
  const [statusModal, setStatusModal] = useState(null);
  const [statusChanging, setStatusChanging] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const toDateInput = (d) => d ? new Date(d).toISOString().slice(0, 10) : '';

  const openAdd = () => crud.openAdd({ ...EMPTY_SEASON, tournament_id: tournaments[0]?.id ?? '' });
  const openEdit = (item) => crud.openEdit(item, {
    name:                   item.name,
    description:            item.description ?? '',
    tournament_id:          item.tournament_id ?? '',
    start_date:             toDateInput(item.start_date),
    end_date:               toDateInput(item.end_date),
    registration_deadline:  toDateInput(item.registration_deadline),
    max_teams:              item.max_teams,
  });

  // ── Validate khớp backend validateDatesIfPresent ───
  const validate = () => {
    const { name, tournament_id, start_date, end_date, registration_deadline, max_teams } = crud.form;
    if (!name.trim()) return 'Tên mùa giải không được bỏ trống.';
    if (!tournament_id) return 'Vui lòng chọn giải đấu.';
    if (!start_date || !end_date) return 'Vui lòng nhập ngày bắt đầu và kết thúc.';
    if (!registration_deadline) return 'Vui lòng nhập hạn đăng ký.';
    if (Number(max_teams) < 2) return 'Số đội tham dự tối thiểu là 2.';

    const now = new Date();
    const sd  = new Date(start_date);
    const ed  = new Date(end_date);
    const rd  = new Date(registration_deadline);

    // Backend: start_date must be in the future
    if (sd <= now) return 'Ngày bắt đầu phải là ngày trong tương lai.';
    // Backend: registration_deadline must be in the future
    if (rd <= now) return 'Hạn đăng ký phải là ngày trong tương lai.';
    // Backend: start_date must be before end_date
    if (sd >= ed) return 'Ngày kết thúc phải sau ngày bắt đầu.';
    // Backend: registration_deadline must be before start_date
    if (rd >= sd) return 'Hạn đăng ký phải trước ngày bắt đầu.';

    return '';
  };

  const handleSave = () => {
    const err = validate();
    if (err) { crud.setFormError(err); return; }
    crud.save(async () => {
      // ── Build payload ────────────────────────────────────────
      // tsoa generated schema requires `status`, `is_registration_open`, `is_active`
      // as required fields even though Zod schema has .default() for them.
      // Not sending them causes 422 Unprocessable Entity from tsoa validation.
      const basePayload = {
        name:                   crud.form.name.trim(),
        description:            crud.form.description.trim() || undefined,
        start_date:             new Date(crud.form.start_date).toISOString(),
        end_date:               new Date(crud.form.end_date).toISOString(),
        registration_deadline:  new Date(crud.form.registration_deadline).toISOString(),
        max_teams:              Number(crud.form.max_teams),
        is_active:              true,
      };

      if (crud.modal === 'add') {
        // Create: cần thêm tournament_id, status, is_registration_open
        const createPayload = {
          ...basePayload,
          tournament_id:         Number(crud.form.tournament_id),
          status:                'upcoming',         // Mùa giải mới luôn bắt đầu ở upcoming
          is_registration_open:  false,              // Chưa mở đăng ký
        };
        await seasonApi.create(createPayload);
        toast.success(`Đã tạo mùa giải "${crud.form.name.trim()}"!`);
      } else {
        // Update: updateSeasonSchema omits tournament_id (partial)
        await seasonApi.update(crud.editing.id, basePayload);
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

  // ── Status change ────────────────────────────────
  const openStatusModal = (season, targetStatus) => {
    setCancelReason('');
    setStatusModal({ season, target: targetStatus });
  };

  const handleStatusChange = async () => {
    if (!statusModal) return;
    setStatusChanging(true);
    try {
      const body = { status: statusModal.target };
      if (statusModal.target === 'cancelled' && cancelReason.trim()) {
        body.cancel_reason = cancelReason.trim();
      }
      await seasonApi.updateStatus(statusModal.season.id, body);
      toast.success(`Đã chuyển sang "${statusTransitionLabel[statusModal.target] || statusModal.target}"!`);
      setStatusModal(null);
      fetchSeasons();
      invalidateSeasonStore();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể thay đổi trạng thái.');
    } finally {
      setStatusChanging(false);
    }
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
          <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-lg" />)}</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Chưa có mùa giải nào</p>
          </div>
        ) : paginatedItems.map(item => {
          const sm = statusMeta[item.status] ?? statusMeta.upcoming;
          const nextStatuses = STATUS_TRANSITIONS[item.status] ?? [];
          const editable  = canEdit(item.status);
          const deletable = canDelete(item.status);

          return (
            <div key={item.id} className="px-6 py-4 hover:bg-navy-light/10 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                    {item.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.start_date ? new Date(item.start_date).toLocaleDateString('vi-VN') : '—'}
                      {' — '}
                      {item.end_date ? new Date(item.end_date).toLocaleDateString('vi-VN') : '—'}
                      {' · '}Max {item.max_teams} đội
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* Status Badge */}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${sm.cls}`}>
                    {sm.label}
                  </span>

                  {/* Status Transition Buttons */}
                  {nextStatuses.map(target => (
                    <button
                      key={target}
                      onClick={() => openStatusModal(item, target)}
                      title={`Chuyển sang: ${statusTransitionLabel[target]}`}
                      className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                        target === 'cancelled'
                          ? 'text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50'
                          : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50'
                      }`}
                    >
                      <ArrowRight className="w-3 h-3" />
                      {statusTransitionLabel[target]}
                    </button>
                  ))}

                  {/* Edit — chỉ upcoming */}
                  {editable ? (
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  ) : (
                    <span
                      className="p-1.5 rounded-lg text-gray-600 cursor-not-allowed"
                      title={`Không thể sửa khi mùa giải đang "${sm.label}"`}
                    >
                      <Lock className="w-4 h-4" />
                    </span>
                  )}

                  {/* Delete — chỉ upcoming */}
                  {deletable ? (
                    <button
                      onClick={() => crud.setDeleting(item)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span
                      className="p-1.5 rounded-lg text-gray-600 cursor-not-allowed"
                      title={`Không thể xóa khi mùa giải đang "${sm.label}"`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {totalPages > 1 && (items || []).length > 0 && !isLoading && (
          <div className="mt-4 mb-2 flex justify-center">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ──────────────────────────────── */}
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
          {crud.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{crud.formError}
            </div>
          )}
          <FormField label="Tên mùa giải" required>
            <input className={INPUT} value={crud.form.name} onChange={e => crud.setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Mùa giải 2026" />
          </FormField>
          <FormField label="Giải đấu" required>
            <select className={INPUT} value={crud.form.tournament_id} onChange={e => crud.setForm(f => ({ ...f, tournament_id: e.target.value }))}>
              <option value="">-- Chọn giải đấu --</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ngày bắt đầu" required>
              <input type="date" className={INPUT} value={crud.form.start_date} onChange={e => crud.setForm(f => ({ ...f, start_date: e.target.value }))} />
            </FormField>
            <FormField label="Ngày kết thúc" required>
              <input type="date" className={INPUT} value={crud.form.end_date} onChange={e => crud.setForm(f => ({ ...f, end_date: e.target.value }))} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Hạn đăng ký" required>
              <input type="date" className={INPUT} value={crud.form.registration_deadline} onChange={e => crud.setForm(f => ({ ...f, registration_deadline: e.target.value }))} />
            </FormField>
            <FormField label="Tối đa đội">
              <input type="number" min="2" max="64" className={INPUT} value={crud.form.max_teams} onChange={e => crud.setForm(f => ({ ...f, max_teams: e.target.value }))} />
            </FormField>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-400/80">
            ⚠️ Ngày bắt đầu và hạn đăng ký phải là ngày trong tương lai. Hạn đăng ký phải trước ngày bắt đầu.
          </div>
          <FormField label="Mô tả">
            <textarea className={INPUT + ' resize-none'} rows={2} value={crud.form.description} onChange={e => crud.setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả mùa giải..." />
          </FormField>
        </AdminModal>
      )}

      {/* ── Status Change Modal ───────────────────────────── */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !statusChanging && setStatusModal(null)} />
          <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up overflow-hidden">
            <div className="px-6 py-4 border-b border-navy-light bg-navy-dark flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-purple-400" /> Chuyển trạng thái
              </h3>
              <button onClick={() => !statusChanging && setStatusModal(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-300">
                Chuyển{' '}
                <strong className="text-white">"{statusModal.season.name}"</strong>{' '}
                <span className={`font-bold text-xs px-1.5 py-0.5 rounded border ${statusMeta[statusModal.season.status]?.cls}`}>
                  {statusMeta[statusModal.season.status]?.label}
                </span>
                {' → '}
                <span className={`font-bold text-xs px-1.5 py-0.5 rounded border ${statusMeta[statusModal.target]?.cls}`}>
                  {statusMeta[statusModal.target]?.label}
                </span>
              </p>

              {statusModal.target === 'registration_open' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300">
                  ℹ️ Mùa giải phải có đầy đủ ngày bắt đầu, kết thúc và hạn đăng ký còn hiệu lực mới có thể mở đăng ký.
                </div>
              )}

              {statusModal.target === 'cancelled' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Lý do hủy (tuỳ chọn, tối đa 500 ký tự)
                  </label>
                  <textarea
                    className={INPUT + ' resize-none'}
                    rows={2}
                    maxLength={500}
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    placeholder="Nhập lý do hủy giải..."
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setStatusModal(null)}
                  disabled={statusChanging}
                  className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light rounded-xl transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={statusChanging}
                  className={`px-5 py-2.5 font-bold text-white rounded-xl flex items-center gap-2 transition-all disabled:opacity-70 ${
                    statusModal.target === 'cancelled'
                      ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20'
                      : 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20'
                  }`}
                >
                  {statusChanging ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ─────────────────────────────────── */}
      {crud.deleting && (
        <ConfirmDeleteModal
          title="Xóa mùa giải?"
          message={`Xóa "${crud.deleting.name}" khỏi hệ thống. Hành động này không thể hoàn tác.`}
          onConfirm={handleDelete}
          onCancel={() => crud.setDeleting(null)}
          isDeleting={crud.isDeleting}
        />
      )}
    </section>
  );
}
