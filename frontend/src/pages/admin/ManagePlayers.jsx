import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Search, Filter, Plus, Edit, Trash2, X, UploadCloud,
  ChevronLeft, ChevronRight, User, Loader2, AlertTriangle, CheckCircle2,
  RefreshCw, Phone, Mail, ShieldCheck
} from 'lucide-react';
import { userApi } from '../../api';
import useToastStore from '../../store/toastStore';

// ─── Reusable Modal ────────────────────────────────────
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-navy-light bg-navy-dark shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ───────────────────────────────
function ConfirmDeleteModal({ player, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-navy border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4 animate-slide-up">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h4 className="text-lg font-black text-white mb-1">Vô hiệu hóa người dùng?</h4>
          <p className="text-sm text-gray-400">
            Bạn có chắc muốn vô hiệu hóa <strong className="text-white">{player?.name}</strong>?
            Tài khoản sẽ bị khóa, không thể đăng nhập.
          </p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold bg-navy-light text-gray-300 hover:text-white border border-navy-light transition-colors">
            Hủy
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { name: '', email: '', password: '', phone: '' };
const EMPTY_EDIT_FORM = { name: '', phone: '' };
const PAGE_SIZE = 8;

export default function ManagePlayers() {
  const toast = useToastStore();

  // ── Data State ─────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: PAGE_SIZE, last_page: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── UI State ───────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Modal State ────────────────────────────────────────
  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ── Delete Confirm State ───────────────────────────────
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch users từ API ─────────────────────────────────
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await userApi.getAll({
        page,
        per_page: PAGE_SIZE,
        q: search || undefined,
        sort: 'created_at',
        direction: 'desc',
      });
      // PaginatedResult<SafeUser> → { data: SafeUser[], meta: {...} }
      setUsers(res.data ?? []);
      setMeta(res.meta ?? { total: 0, page: 1, per_page: PAGE_SIZE, last_page: 1 });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Không thể tải danh sách người dùng.';
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load khi mount và khi page/search thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(currentPage, searchTerm);
    }, searchTerm ? 400 : 0); // Debounce 400ms khi search
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, fetchUsers]);

  // ── Handlers ──────────────────────────────────────────
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setFormError('');
    setEditingUser(null);
    setModalMode('add');
  };

  const openEdit = (user) => {
    setFormData({ name: user.name, phone: user.phone ?? '' });
    setFormError('');
    setEditingUser(user);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateForm = () => {
    if (!formData.name?.trim()) return 'Vui lòng nhập họ tên.';
    if (modalMode === 'add') {
      if (!formData.email?.trim()) return 'Vui lòng nhập email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email không hợp lệ.';
      if (!formData.password || formData.password.length < 6) return 'Mật khẩu tối thiểu 6 ký tự.';
    }
    return '';
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setIsSaving(true);
    try {
      if (modalMode === 'add') {
        // POST /users — tạo user mới
        await userApi.create({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone?.trim() || undefined,
        });
        toast.success(`Đã thêm người dùng "${formData.name.trim()}" thành công!`);
      } else {
        // PATCH /users/{id}
        await userApi.updateProfile(editingUser.id, {
          name: formData.name.trim(),
          phone: formData.phone?.trim() || undefined,
        });
        toast.success(`Đã cập nhật "${formData.name.trim()}" thành công!`);
      }
      closeModal();
      // Reload trang hiện tại
      fetchUsers(currentPage, searchTerm);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // DELETE /users/{id} → soft delete (set is_active = false)
      await userApi.softDelete(deletingUser.id);
      toast.success(`Đã vô hiệu hóa tài khoản "${deletingUser.name}".`);
      setDeletingUser(null);
      // Nếu xóa hết item trên trang hiện tại → về trang trước
      const newPage = users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);
      fetchUsers(newPage, searchTerm);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể vô hiệu hóa tài khoản.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi search
  };

  const totalPages = meta.last_page;
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  // Tạo avatar từ tên (initials)
  const getInitials = (name) =>
    name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

  const getAvatarColor = (id) => {
    const colors = [
      'from-emerald-500 to-teal-600',
      'from-blue-500 to-cyan-600',
      'from-purple-500 to-violet-600',
      'from-orange-500 to-amber-600',
      'from-pink-500 to-rose-600',
    ];
    return colors[id % colors.length];
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Người Dùng</h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-bold text-neon">{meta.total}</span> người dùng trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchUsers(currentPage, searchTerm)}
              disabled={isLoading}
              title="Tải lại"
              className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openAdd}
              className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-5 h-5" /> Thêm người dùng
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-navy p-4 rounded-xl border border-navy-light flex flex-col sm:flex-row gap-3 shadow-lg shadow-black/20">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-14">Avatar</th>
                  <th className="py-4 px-6">Người dùng</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Số điện thoại</th>
                  <th className="py-4 px-6 text-center">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-light">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="py-4 px-6">
                          <div className="skeleton h-4 w-full rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : fetchError ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-red-400">
                      <div className="flex flex-col items-center gap-3">
                        <AlertTriangle className="w-10 h-10 text-red-500/50" />
                        <p className="font-semibold">{fetchError}</p>
                        <button
                          onClick={() => fetchUsers(currentPage, searchTerm)}
                          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-colors"
                        >
                          Thử lại
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <User className="w-10 h-10 text-gray-600" />
                        <p className="font-semibold">
                          {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : 'Chưa có người dùng nào.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-navy-dark/70 transition-colors group animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                      {/* Avatar */}
                      <td className="py-3 px-6">
                        <div className={`w-10 h-10 rounded-full bg-linear-to-br ${getAvatarColor(u.id)} flex items-center justify-center mx-auto font-black text-white text-sm shadow-md`}>
                          {getInitials(u.name)}
                        </div>
                      </td>
                      {/* Name */}
                      <td className="py-3 px-6">
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">#{u.id}</p>
                      </td>
                      {/* Email */}
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                          <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          {u.email}
                          {u.email_verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Email đã xác thực" />
                          )}
                        </div>
                      </td>
                      {/* Phone */}
                      <td className="py-3 px-6">
                        {u.phone ? (
                          <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                            <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            {u.phone}
                          </div>
                        ) : (
                          <span className="text-gray-600 text-sm">—</span>
                        )}
                      </td>
                      {/* Status */}
                      <td className="py-3 px-6 text-center">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          u.is_active
                            ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                            : 'bg-red-400/10 text-red-400 border-red-400/30'
                        }`}>
                          {u.is_active ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(u)}
                            className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingUser(u)}
                            className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors"
                            title="Vô hiệu hóa"
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

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex items-center justify-between gap-4 text-sm text-gray-400 flex-wrap">
            <span>
              Trang <strong className="text-white">{safePage}</strong> / <strong className="text-white">{totalPages}</strong>
              {' · '}Tổng <strong className="text-white">{meta.total}</strong> người dùng
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage <= 1 || isLoading}
                className="p-1.5 rounded-lg hover:bg-navy-light transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {/* Chỉ hiển thị tối đa 5 page buttons */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const offset = Math.max(0, Math.min(safePage - 3, totalPages - 5));
                const page = i + 1 + offset;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      page === safePage ? 'bg-blue-600 text-white' : 'hover:bg-navy-light text-gray-400 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages || isLoading}
                className="p-1.5 rounded-lg hover:bg-navy-light transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalMode && (
        <Modal
          title={modalMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
          onClose={closeModal}
          footer={
            <div className="flex gap-3 justify-end">
              <button onClick={closeModal} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl transition-colors border border-navy-light">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 shadow-md shadow-emerald-500/20"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {modalMode === 'add' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            {/* Name — always shown */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Họ và tên <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
              />
            </div>

            {/* Email + Password — only when adding */}
            {modalMode === 'add' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Mật khẩu <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
                  />
                </div>
              </>
            )}

            {/* Phone — always shown */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số điện thoại</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="0901 234 567"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deletingUser && (
        <ConfirmDeleteModal
          player={deletingUser}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingUser(null)}
          isDeleting={isDeleting}
        />
      )}
    </AdminLayout>
  );
}
