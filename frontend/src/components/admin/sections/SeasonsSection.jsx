import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar, Edit, Trash2, Save, Loader2, AlertTriangle,
  RefreshCw, RefreshCcw, ArrowRight, Lock, CheckCircle2, XCircle, Landmark,
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
import { getFriendlyErrorMessage } from '../../../utils/errorHelper';

const STATUS_TRANSITIONS = {
  upcoming: ['registration_open', 'cancelled'],
  registration_open: ['ongoing', 'cancelled'],
  ongoing: ['finished', 'cancelled'],
  finished: [],
  cancelled: [],
};

// Field-level edit policy — PHẢI khớp với filterUpdatableFields() ở
// season.service.ts (BE là nguồn sự thật, đây chỉ là mirror để render UI
// đúng; nếu lệch nhau, BE sẽ trả 422 và người dùng thấy lỗi thay vì bị mất
// dữ liệu âm thầm).
// - full: sửa mọi field.
// - bank: CHỈ sửa 3 field ngân hàng — cho phép fix sai sót nhập liệu (nhập
//   nhầm số TK/tên chủ TK) giữa giải đang chạy, nhưng KHÔNG cho đổi thể lệ
//   (tên, mô tả, số đội) hay ngày tháng khi giải đã 'ongoing'.
// - none: khóa hoàn toàn (finished, cancelled).
const FULL_EDIT_STATUSES = ['upcoming', 'registration_open'];
const BANK_EDIT_STATUSES = ['ongoing'];
const getEditMode = (status) => {
  if (FULL_EDIT_STATUSES.includes(status)) return 'full';
  if (BANK_EDIT_STATUSES.includes(status)) return 'bank';
  return 'none';
};

const canDelete = (status) => status === 'upcoming';

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

const dateInputToVNISOString = (dateStr, isEndOfDay = false) => {
  if (!dateStr) return undefined;
  return isEndOfDay ? `${dateStr}T23:59:59+07:00` : `${dateStr}T00:00:00+07:00`;
};

const isoToVNDateInput = (isoStr) => {
  if (!isoStr) return '';
  const utcDate = new Date(isoStr);
  const vnDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
  return vnDate.toISOString().slice(0, 10);
};

const todayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const addDaysStr = (dateStr, delta) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + delta);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

export default function SeasonsSection({ onOpenWizard } = {}) {
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
  const [activeFilter, setActiveFilter] = useState('active');

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
    emptyForm: {},
    onSuccess: () => { fetchSeasons(); invalidateSeasonStore(); },
  });

  // Chế độ edit của modal đang mở — quyết định field nào bị disable và
  // payload nào được gửi lên. Set song song với crud.openEdit() theo status
  // của item đang sửa (xem openEdit bên dưới).
  const [editMode, setEditMode] = useState('full');

  const [statusModal, setStatusModal] = useState(null);
  const [statusChanging, setStatusChanging] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const [recreateConfirm, setRecreateConfirm] = useState(null);
  const [recreating, setRecreating] = useState(false);

  const handleRecreateViaWizard = async () => {
    if (!recreateConfirm) return;
    setRecreating(true);
    try {
      await seasonApi.updateStatus(recreateConfirm.id, {
        status: 'cancelled',
        cancel_reason: 'Hủy để tạo lại qua Wizard (cần đổi ngày bắt đầu/kết thúc).',
      });
      toast.success(`Đã hủy "${recreateConfirm.name}".${onOpenWizard ? ' Đang mở Wizard...' : ' Hãy mở Wizard để tạo mùa giải mới.'}`);
      setRecreateConfirm(null);
      crud.closeModal();
      fetchSeasons();
      invalidateSeasonStore();
      onOpenWizard?.();
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể hủy mùa giải để tạo lại.'));
    } finally {
      setRecreating(false);
    }
  };

  const openEdit = (item) => {
    setEditMode(getEditMode(item.status));
    crud.openEdit(item, {
      name: item.name,
      description: item.description ?? '',
      tournament_id: item.tournament_id ?? item.tournament?.id ?? '',
      start_date: isoToVNDateInput(item.start_date),
      end_date: isoToVNDateInput(item.end_date),
      registration_deadline: isoToVNDateInput(item.registration_deadline),
      max_teams: item.max_teams ?? item.maxTeams ?? '',
      is_active: item.is_active ?? true,
      status: item.status ?? 'upcoming',
      bank_id: item.bank_id ?? '',
      bank_account_no: item.bank_account_no ?? '',
      bank_account_name: item.bank_account_name ?? '',
    });
  };

  const validate = () => {
    const {
      name, registration_deadline, max_teams, start_date,
      bank_id, bank_account_no, bank_account_name,
    } = crud.form;

    // bank all-or-nothing luôn phải đúng bất kể editMode — kể cả ở chế độ
    // 'bank', thiếu 1-2/3 field vẫn phải chặn (mirror BE refine).
    const bankFilled = [bank_id, bank_account_no, bank_account_name]
      .filter(v => v && v.trim()).length;
    if (bankFilled > 0 && bankFilled < 3) {
      return 'Vui lòng nhập đầy đủ cả 3 trường ngân hàng, hoặc để trống toàn bộ.';
    }

    // Các field khác chỉ validate khi thực sự có thể bị ghi (editMode ===
    // 'full'). Ở editMode 'bank', các field này bị disable trên UI và
    // không được gửi lên BE — validate chúng ở đây là vô nghĩa và có thể
    // chặn nhầm submit hợp lệ (VD season cũ có name rỗng do data cũ).
    if (editMode === 'full') {
      if (!name.trim()) return 'Tên mùa giải không được bỏ trống.';
      if (!registration_deadline) return 'Vui lòng nhập hạn đăng ký.';
      if (Number(max_teams) < 2) return 'Số đội tham dự tối thiểu là 2.';
      if (registration_deadline < todayStr()) return 'Hạn đăng ký không được ở quá khứ.';
      if (start_date && registration_deadline >= start_date) {
        return 'Hạn đăng ký phải trước ngày bắt đầu, không được trùng ngày với ngày bắt đầu.';
      }
    }
    return '';
  };

  const handleSave = () => {
    const err = validate();
    if (err) { toast.error(err); crud.setFormError(err); return; }
    crud.save(async () => {
      const bankPayload = {
        // Gửi null tường minh khi rỗng để CLEAR được bank info trong DB
        // (Prisma: undefined = bỏ qua field, null = set NULL thật sự —
        // season schema là .nullable() nên BE chấp nhận null).
        bank_id: crud.form.bank_id?.trim() || null,
        bank_account_no: crud.form.bank_account_no?.trim() || null,
        bank_account_name: crud.form.bank_account_name?.trim() || null,
      };

      // Payload phải khớp filterUpdatableFields() ở BE: editMode 'bank' chỉ
      // gửi 3 field ngân hàng. Gửi thừa field khác không sai (BE tự lọc bỏ),
      // nhưng giữ payload tối thiểu để tránh nhầm lẫn khi debug/log.
      const updatePayload = editMode === 'bank'
        ? bankPayload
        : {
          name: crud.form.name.trim(),
          description: crud.form.description.trim() || undefined,
          registration_deadline: dateInputToVNISOString(crud.form.registration_deadline, true),
          max_teams: Number(crud.form.max_teams),
          is_active: crud.form.is_active,
          ...bankPayload,
        };

      await seasonApi.update(crud.editing.id, updatePayload);
      toast.success(`Đã cập nhật "${crud.form.name.trim()}"!`);
    }).catch(err => {
      const msg = getFriendlyErrorMessage(err, 'Lỗi khi cập nhật mùa giải.');
      toast.error(msg);
      crud.setFormError(msg);
    });
  };

  const handleDelete = () => {
    const item = crud.deleting;
    crud.confirmDelete(async () => {
      await seasonApi.delete(item.id);
      toast.success(`Đã xóa mùa giải "${item.name}".`);
    }).catch((err) => {
      toast.error(getFriendlyErrorMessage(err, 'Không thể xóa mùa giải.'));
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
      toast.error(getFriendlyErrorMessage(err, 'Không thể khôi phục mùa giải.'));
    }
  };

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
      const raw = err?.response?.data?.body?.message || err?.response?.data?.message || '';
      if (raw.includes('registration_deadline has already passed')) {
        toast.error('Không thể mở đăng ký: Hạn đăng ký đã qua! Vui lòng cập nhật lại hạn đăng ký.');
      } else if (raw.includes('start_date has already passed')) {
        toast.error('Không thể mở đăng ký: Ngày bắt đầu mùa giải đã qua, không thể mở đăng ký cho season này nữa.');
      } else {
        toast.error(getFriendlyErrorMessage(err, 'Không thể thay đổi trạng thái.'));
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

          <button onClick={() => fetchSeasons()} disabled={isLoading} className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors ml-auto sm:ml-0 shrink-0">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
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
          const itemEditMode = getEditMode(item.status);
          const editable = itemEditMode !== 'none';
          const deletable = canDelete(item.status);

          return (
            <div key={item.id} className="px-6 py-4 hover:bg-navy-light/10 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
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

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${sm.cls}`}>
                    {sm.label}
                  </span>
                  {/* Nhắc admin: ongoing/finished còn có cron tự chuyển theo
                      ngày — nút bên dưới chỉ để bấm SỚM/bấm BÙ, không bắt
                      buộc phải bấm nếu không cần gấp. */}
                  {item.status === 'registration_open' && item.start_date && (
                    <span className="text-[11px] text-gray-500" title="Tự động chuyển sang 'Đang diễn ra' khi tới ngày bắt đầu (cron); có thể bấm tay bên dưới để bắt đầu sớm hơn.">
                      auto: {new Date(item.start_date).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                  {item.status === 'ongoing' && item.end_date && (
                    <span className="text-[11px] text-gray-500" title="Tự động chuyển sang 'Kết thúc' khi tới ngày kết thúc (cron); có thể bấm tay bên dưới để kết thúc sớm hơn.">
                      auto: {new Date(item.end_date).toLocaleDateString('vi-VN')}
                    </span>
                  )}

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

                  {editable ? (
                    <button
                      onClick={() => openEdit(item)}
                      className={`p-1.5 rounded-lg border border-transparent transition-colors ${itemEditMode === 'bank'
                        ? 'text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30'
                        : 'text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30'
                        }`}
                      title={itemEditMode === 'bank' ? 'Chỉ có thể sửa thông tin ngân hàng khi giải đang diễn ra' : 'Chỉnh sửa'}
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

      {crud.modal && (
        <AdminModal
          title={editMode === 'bank' ? 'Cập nhật thông tin ngân hàng' : 'Chỉnh sửa mùa giải'}
          icon={Calendar} iconClass="text-purple-400"
          onClose={crud.closeModal}
          footer={<>
            <button onClick={crud.closeModal} className="px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light">Hủy</button>
            <button onClick={handleSave} disabled={crud.isSaving} className="px-5 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 disabled:opacity-70">
              {crud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </button>
          </>}
        >
          {crud.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{crud.formError}
            </div>
          )}

          {editMode === 'bank' && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-300 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              Giải đang "Đang diễn ra" — chỉ có thể sửa thông tin ngân hàng (fix sai sót nhập liệu).
              Các thông tin khác (tên, mô tả, số đội, ngày tháng) đã khóa để không làm thay đổi thể lệ giữa giải.
            </div>
          )}

          <FormField label="Tên mùa giải" required>
            <input
              className={INPUT}
              value={crud.form.name}
              onChange={e => crud.setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="VD: Mùa giải 2026"
              disabled={editMode === 'bank'}
            />
          </FormField>
          <FormField label="Giải đấu">
            <select className={INPUT} value={crud.form.tournament_id} disabled>
              <option value="">-- Không xác định --</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-1">Giải đấu không thể đổi sau khi tạo.</p>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ngày bắt đầu">
              <input type="date" className={INPUT} value={crud.form.start_date} disabled />
            </FormField>
            <FormField label="Ngày kết thúc">
              <input type="date" className={INPUT} value={crud.form.end_date} disabled />
            </FormField>
          </div>
          <div className="flex items-center justify-between gap-3 -mt-2 flex-wrap">
            <p className="text-xs text-gray-500">Ngày bắt đầu/kết thúc không thể sửa sau khi tạo season.</p>
            {editMode === 'full' && (STATUS_TRANSITIONS[crud.editing?.status] ?? []).includes('cancelled') ? (
              <button
                type="button"
                onClick={() => setRecreateConfirm(crud.editing)}
                className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 shrink-0"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> Hủy &amp; tạo lại qua Wizard
              </button>
            ) : editMode === 'full' ? (
              <span className="text-xs text-gray-600" title={`Không thể hủy khi season đang "${statusMeta[crud.editing?.status]?.label}"`}>
                Không thể hủy để tạo lại ở trạng thái này
              </span>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Gia hạn đăng ký" required={editMode === 'full'}>
              <input
                type="date"
                className={INPUT}
                min={todayStr()}
                max={crud.form.start_date ? addDaysStr(crud.form.start_date, -1) : undefined}
                value={crud.form.registration_deadline}
                onChange={e => crud.setForm(f => ({ ...f, registration_deadline: e.target.value }))}
                disabled={editMode === 'bank'}
              />
              {editMode === 'full' && crud.form.start_date && (
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ chọn được từ hôm nay đến trước ngày bắt đầu ({addDaysStr(crud.form.start_date, -1)}).
                </p>
              )}
            </FormField>
            <FormField label="Tối đa đội">
              <input
                type="number"
                min="2"
                max="64"
                className={INPUT}
                value={crud.form.max_teams}
                onChange={e => crud.setForm(f => ({ ...f, max_teams: e.target.value }))}
                disabled={editMode === 'bank'}
              />
            </FormField>
          </div>
          <FormField label="Mô tả">
            <textarea
              className={INPUT + ' resize-none'}
              rows={2}
              value={crud.form.description}
              onChange={e => crud.setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Mô tả mùa giải..."
              disabled={editMode === 'bank'}
            />
          </FormField>

          {/* Bank info — dùng cho leader chuyển khoản thủ công (song song VNPay).
              All-or-nothing: điền 1 phải điền đủ 3 (mirror BE refine), để trống
              toàn bộ = ẩn hẳn option chuyển khoản ở TeamPaymentModal. Đây là
              nhóm field DUY NHẤT còn sửa được khi season 'ongoing'. */}
          <div className="pt-2 border-t border-navy-light">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" /> Thông tin chuyển khoản (tuỳ chọn)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Mã ngân hàng (bank_id)">
                <input
                  className={INPUT}
                  value={crud.form.bank_id}
                  onChange={e => crud.setForm(f => ({ ...f, bank_id: e.target.value }))}
                  placeholder="VD: 970422 (VietinBank)"
                  maxLength={20}
                />
              </FormField>
              <FormField label="Số tài khoản">
                <input
                  className={INPUT}
                  value={crud.form.bank_account_no}
                  onChange={e => crud.setForm(f => ({ ...f, bank_account_no: e.target.value }))}
                  placeholder="0123456789"
                  maxLength={50}
                />
              </FormField>
            </div>
            <FormField label="Tên chủ tài khoản">
              <input
                className={INPUT}
                value={crud.form.bank_account_name}
                onChange={e => crud.setForm(f => ({ ...f, bank_account_name: e.target.value }))}
                placeholder="NGUYEN VAN A"
                maxLength={255}
              />
            </FormField>
            <p className="text-xs text-gray-500 mt-1">
              Để trống cả 3 nếu chỉ nhận thanh toán qua VNPay. Điền 1 phải điền đủ cả 3.
            </p>
          </div>

          <div className="flex items-center gap-3 py-2">
            <label className={`flex items-center gap-3 ${editMode === 'bank' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={crud.form.is_active}
                  onChange={e => crud.setForm(f => ({ ...f, is_active: e.target.checked }))}
                  disabled={editMode === 'bank'}
                />
                <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
              <span className="text-sm font-bold text-gray-300">Trạng thái hoạt động</span>
            </label>
          </div>
        </AdminModal>
      )}

      {statusModal && createPortal(
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
        </div>,
        document.body
      )}

      {crud.deleting && (
        <ConfirmDeleteModal
          title="Xóa mùa giải?"
          message={`Xóa "${crud.deleting.name}" khỏi hệ thống. Hành động này không thể hoàn tác.`}
          onConfirm={handleDelete}
          onCancel={() => crud.setDeleting(null)}
          isDeleting={crud.isDeleting}
        />
      )}

      {recreateConfirm && (
        <ConfirmDeleteModal
          title="Hủy mùa giải để tạo lại?"
          message={`Mùa giải "${recreateConfirm.name}" sẽ chuyển sang trạng thái "Đã hủy" VĨNH VIỄN (không quay lại "upcoming" được nữa — theo STATUS_TRANSITIONS phía backend). Wizard sẽ được mở ngay sau đó để bạn tạo mùa giải mới với ngày bắt đầu/kết thúc chính xác. Nhóm/lịch thi đấu đã có (nếu có) sẽ vẫn thuộc về season cũ đã hủy. Tiếp tục?`}
          onConfirm={handleRecreateViaWizard}
          onCancel={() => setRecreateConfirm(null)}
          isDeleting={recreating}
        />
      )}
    </section>
  );
}