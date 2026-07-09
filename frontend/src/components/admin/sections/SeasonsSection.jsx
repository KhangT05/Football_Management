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
import { INPUT } from '../../../utils/adminStyles';

// Mirror backend STATUS_TRANSITIONS
const STATUS_TRANSITIONS = {
  upcoming: ['registration_open', 'cancelled'],
  registration_open: ['ongoing', 'cancelled'],
  ongoing: ['finished', 'cancelled'],
  finished: [],
  cancelled: [],
};

// Mirror backend validateStatusAllowsEdit — chỉ upcoming được sửa/xóa
const canEdit = (status) => status !== 'cancelled';
const canDelete = (status) => status === 'upcoming';

const EMPTY_SEASON = {
  name: '', description: '', tournament_id: '', start_date: '', end_date: '',
  registration_deadline: '', max_teams: 8, is_active: true, status: 'upcoming'
};

const statusMeta = {
  upcoming: { label: 'Sắp diễn ra', cls: 'bg-slate-400/10 text-slate-300 border-slate-500/30' },
  registration_open: { label: 'Mở đăng ký', cls: 'bg-blue-400/10 text-blue-400 border-blue-400/30' },
  ongoing: { label: 'Đang diễn ra', cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' },
  finished: { label: 'Kết thúc', cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30' },
  cancelled: { label: 'Đã hủy', cls: 'bg-red-400/10 text-red-400 border-red-400/30' },
};

const statusTransitionLabel = {
  registration_open: 'Mở đăng ký',
  ongoing: 'Bắt đầu giải',
  finished: 'Kết thúc giải',
  cancelled: 'Hủy giải',
};

// ── Date helpers — chuẩn hoá theo giờ VN (+07:00), không phụ thuộc TZ máy client ──

// "YYYY-MM-DD" (từ <input type="date">) → ISO string tại 00:00:00 +07:00 hoặc 23:59:59 +07:00
// Dùng khi build payload gửi lên backend.
const dateInputToVNISOString = (dateStr, isEndOfDay = false) => {
  if (!dateStr) return undefined;
  return isEndOfDay ? `${dateStr}T23:59:59+07:00` : `${dateStr}T00:00:00+07:00`;
};

// "YYYY-MM-DD" → Date object local-midnight (theo TZ trình duyệt).
// Dùng để so sánh trong validate() — chỉ cần đúng tương đối giữa các mốc trong cùng form,
// không cần khớp tuyệt đối với backend vì backend tự validate lại.
const dateInputToLocalDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0);
};

// ISO string từ server (UTC) → "YYYY-MM-DD" theo giờ VN (+07:00)
// Dùng khi load data có sẵn vào form Edit.
const isoToVNDateInput = (isoStr) => {
  if (!isoStr) return '';
  const utcDate = new Date(isoStr);
  const vnDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
  return vnDate.toISOString().slice(0, 10);
};

export default function SeasonsSection() {
  const toast = useToastStore();
  const { data: items, isLoading, fetch: fetchSeasons } = useApiQuery(
    (params) => seasonApi.getAll(params),
    {
      perPage: 50,
      params: { sort: 'id', direction: 'desc' },
      errorMsg: 'Không tải được dữ liệu mùa giải.'
    }
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const [filterStatus, setFilterStatus] = useState('');
  const [activeFilter, setActiveFilter] = useState('active'); // active, deleted, all

  useEffect(() => {
    fetchSeasons({
      sort: 'id',
      direction: 'desc',
      ...(activeFilter === 'active' ? { is_active: true } : activeFilter === 'deleted' ? { is_active: false } : {}),
    });
  }, [activeFilter, fetchSeasons]);

  const filteredItems = (items || []).filter(item => {
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    tournamentApi.getAll({ per_page: 100 }).then(res => {
      setTournaments(res?.data?.data || res?.data || []);
    }).catch(() => { });
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

  const openAdd = () => crud.openAdd({ ...EMPTY_SEASON, tournament_id: tournaments[0]?.id ?? '' });
  const openEdit = (item) => crud.openEdit(item, {
    name: item.name,
    description: item.description ?? '',
    tournament_id: item.tournament_id ?? item.tournament?.id ?? '',
    start_date: isoToVNDateInput(item.start_date),
    end_date: isoToVNDateInput(item.end_date),
    registration_deadline: isoToVNDateInput(item.registration_deadline),
    max_teams: item.max_teams ?? item.maxTeams ?? '',
    is_active: item.is_active ?? true,
    status: item.status ?? 'upcoming',
  });

  // ── Validate khớp backend validateDatesIfPresent ───
  const validate = () => {
    const { name, tournament_id, start_date, end_date, registration_deadline, max_teams } = crud.form;
    if (!name.trim()) return 'Tên mùa giải không được bỏ trống.';
    if (!tournament_id) return 'Vui lòng chọn giải đấu.';
    if (!start_date) return 'Vui lòng nhập ngày bắt đầu.';
    if (!end_date) return 'Vui lòng nhập ngày kết thúc.';
    if (!registration_deadline) return 'Vui lòng nhập hạn đăng ký.';
    if (Number(max_teams) < 2) return 'Số đội tham dự tối thiểu là 2.';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sd = dateInputToLocalDate(start_date);
    const rd = dateInputToLocalDate(registration_deadline);
    const ed = dateInputToLocalDate(end_date);

    // Backend: start_date must be in the future (chỉ check khi thêm mới)
    if (crud.modal === 'add' && sd <= today) return 'Ngày bắt đầu phải là ngày trong tương lai.';
    // Backend: registration_deadline must be in the future (chỉ check khi thêm mới)
    if (crud.modal === 'add' && rd <= today) return 'Hạn đăng ký phải là ngày trong tương lai.';
    // Backend: start_date must be before end_date
    if (sd >= ed) return 'Ngày kết thúc phải sau ngày bắt đầu.';
    // Backend: registration_deadline must be before start_date
    if (rd >= sd) return 'Hạn đăng ký phải trước hoặc trong ngày bắt đầu.';
    return '';
  };

  const handleSave = () => {
    const err = validate();
    if (err) { toast.error(err); crud.setFormError(err); return; }
    crud.save(async () => {
      const basePayload = {
        name: crud.form.name.trim(),
        description: crud.form.description.trim() || undefined,
        start_date: dateInputToVNISOString(crud.form.start_date),
        end_date: dateInputToVNISOString(crud.form.end_date, true),
        registration_deadline: dateInputToVNISOString(crud.form.registration_deadline, true),
        max_teams: Number(crud.form.max_teams),
        is_active: crud.form.is_active,
      };

      if (crud.modal === 'add') {
        const createPayload = {
          ...basePayload,
          tournament_id: Number(crud.form.tournament_id),
          status: 'upcoming',
          is_registration_open: false,
        };
        await seasonApi.create(createPayload);
        toast.success(`Đã tạo mùa giải "${crud.form.name.trim()}"!`);
      } else {
        const updatePayload = {
          ...basePayload,
          status: crud.form.status,
        };
        await seasonApi.update(crud.editing.id, updatePayload);
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

  const handleRestore = async (id) => {
    try {
      await seasonApi.restore(id);
      toast.success('Đã khôi phục mùa giải!');
      invalidateSeasonStore();
      fetchSeasons({
        sort: 'id',
        direction: 'desc',
        ...(activeFilter === 'active' ? { is_active: true } : activeFilter === 'deleted' ? { is_active: false } : {}),
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể khôi phục mùa giải.');
    }
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
      const msg = err?.response?.data?.message || '';
      if (msg.includes('registration_deadline has already passed')) {
        toast.error('Không thể mở đăng ký: Hạn đăng ký đã qua! Vui lòng cập nhật lại hạn đăng ký.');
      } else {
        toast.error(msg || 'Không thể thay đổi trạng thái.');
      }
    } finally {
      setStatusChanging(false);
    }
  };

  return (
    <section className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark gap-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2 shrink-0">
          <Calendar className="w-4 h-4 text-purple-400" /> Mùa giải ({filteredItems.length})
        </h3>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-navy border border-navy-light rounded-lg text-sm text-gray-300 focus:outline-none focus:border-purple-500"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusMeta).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={(e) => { setActiveFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-navy border border-navy-light rounded-lg text-sm text-gray-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">Tất cả (Kích hoạt/Khóa)</option>
            <option value="active">Đang kích hoạt</option>
            <option value="deleted">Đã khóa/xóa</option>
          </select>

          <button onClick={fetchSeasons} disabled={isLoading} className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors ml-auto sm:ml-0 shrink-0">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Thêm mới
          </button>
        </div>
      </div>

      <div className="divide-y divide-navy-light">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-lg" />)}</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Không tìm thấy mùa giải nào phù hợp</p>
          </div>
        ) : paginatedItems.map(item => {
          const sm = statusMeta[item.status] ?? statusMeta.upcoming;
          const nextStatuses = STATUS_TRANSITIONS[item.status] ?? [];
          const editable = canEdit(item.status);
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
                    <p className="text-xs text-gray-500 mt-0.5">
                      Hạn ĐK: {item.registration_deadline ? new Date(item.registration_deadline).toLocaleDateString('vi-VN') : 'Chưa có'}
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
                  {nextStatuses.map(target => {
                    const isDeadlinePassed = target === 'registration_open' && (!item.registration_deadline || new Date(item.registration_deadline) <= new Date());
                    return (
                      <button
                        key={target}
                        onClick={() => !isDeadlinePassed && openStatusModal(item, target)}
                        disabled={isDeadlinePassed}
                        title={isDeadlinePassed ? 'Hạn đăng ký đã qua hoặc chưa được thiết lập. Hãy cập nhật lại!' : `Chuyển sang: ${statusTransitionLabel[target]}`}
                        className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all ${isDeadlinePassed ? 'opacity-50 cursor-not-allowed bg-gray-500/10 text-gray-500 border-gray-500/30' :
                          target === 'cancelled'
                            ? 'text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50'
                            : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50'
                          }`}
                      >
                        <ArrowRight className="w-3 h-3" />
                        {statusTransitionLabel[target]}
                      </button>
                    );
                  })}

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

                  {/* Delete / Restore — chỉ upcoming hoặc khi bị xóa */}
                  {item.is_active ? (
                    deletable ? (
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
                    )
                  ) : (
                    <button
                      onClick={() => handleRestore(item.id)}
                      className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-colors"
                      title="Khôi phục"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {totalPages > 1 && filteredItems.length > 0 && !isLoading && (
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
            <select className={INPUT} value={crud.form.tournament_id} onChange={e => crud.setForm(f => ({ ...f, tournament_id: e.target.value }))} disabled={crud.modal === 'edit'}>
              <option value="">-- Chọn giải đấu --</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ngày bắt đầu" required>
              <input type="date" className={INPUT} value={crud.form.start_date} onChange={e => crud.setForm(f => ({ ...f, start_date: e.target.value }))} disabled={crud.modal === 'edit'} />
            </FormField>
            <FormField label="Ngày kết thúc" required>
              <input type="date" className={INPUT} value={crud.form.end_date} onChange={e => crud.setForm(f => ({ ...f, end_date: e.target.value }))} disabled={crud.modal === 'edit'} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={crud.modal === 'edit' ? 'Gia hạn đăng ký' : 'Hạn đăng ký'} required>
              <input type="date" className={INPUT} value={crud.form.registration_deadline} onChange={e => crud.setForm(f => ({ ...f, registration_deadline: e.target.value }))} />
            </FormField>
            <FormField label="Tối đa đội">
              <input type="number" min="2" max="64" className={INPUT} value={crud.form.max_teams} onChange={e => crud.setForm(f => ({ ...f, max_teams: e.target.value }))} />
            </FormField>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-red-700">
            ⚠️ Ngày bắt đầu và hạn đăng ký phải là ngày trong tương lai. Hạn đăng ký phải trước ngày bắt đầu.
          </div>
          <FormField label="Mô tả">
            <textarea className={INPUT + ' resize-none'} rows={2} value={crud.form.description} onChange={e => crud.setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả mùa giải..." />
          </FormField>
          {crud.modal === 'edit' && (
            <FormField label="Cập nhật trạng thái">
              <select className={INPUT} value={crud.form.status} onChange={e => crud.setForm(f => ({ ...f, status: e.target.value }))}>
                {Object.entries(statusMeta).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </FormField>
          )}
          <div className="flex items-center gap-3 py-2">
            <label className="flex items-center cursor-pointer gap-3">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={crud.form.is_active} onChange={e => crud.setForm(f => ({ ...f, is_active: e.target.checked }))} />
                <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
              <span className="text-sm font-bold text-gray-300">Trạng thái hoạt động</span>
            </label>
          </div>
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
                  className={`px-5 py-2.5 font-bold text-white rounded-xl flex items-center gap-2 transition-all disabled:opacity-70 ${statusModal.target === 'cancelled'
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