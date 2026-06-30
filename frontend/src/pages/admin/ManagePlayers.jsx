import { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Search, Plus, Edit, Trash2,
  ChevronLeft, ChevronRight, User, Loader2, AlertTriangle, CheckCircle2,
  RefreshCw, Phone, Mail, ShieldCheck, Check, X, Building2
} from 'lucide-react';
import { userApi, teamApi, playerApi } from '../../api';
import { useApiQuery, useCrudModal, useDebouncedValue } from '../../hooks';
import useToastStore from '../../store/toastStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import AdminModal from '../../components/admin/AdminModal';
import Pagination from '../../components/ui/Pagination';
import ApprovePlayersTab from '../../components/admin/ApprovePlayersTab';
import { getInitials, AVATAR_COLORS } from '../../utils/constants';

const EMPTY_FORM = { name: '', email: '', password: '', phone: '' };
const EMPTY_EDIT_FORM = { name: '', phone: '' };

export default function ManagePlayers() {
  const toast = useToastStore();
  const PAGE_SIZE = 10;
  
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'approve'

  // ── Data: Users (useApiQuery) ──────────────────────────
  const { data: users, meta, isLoading, error: fetchError, fetch: fetchUsers } = useApiQuery(
    userApi.getAll,
    { perPage: PAGE_SIZE, autoFetch: false, errorMsg: 'Không thể tải danh sách người dùng.' }
  );

  // ── Search + Pagination ─────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const refetchUsers = useCallback((page) => {
    fetchUsers({ page: page ?? currentPage, per_page: itemsPerPage, q: debouncedSearch || undefined, sort: 'created_at', direction: 'desc' });
  }, [fetchUsers, currentPage, itemsPerPage, debouncedSearch]);

  const prevSearchRef = useRef(debouncedSearch);

  useEffect(() => {
    // Khi debouncedSearch thay đổi so với lần trước, trang đã được reset ở handleSearchChange
    // Effect này chỉ fetch data, không set state trực tiếp
    const page = prevSearchRef.current !== debouncedSearch ? 1 : currentPage;
    prevSearchRef.current = debouncedSearch;
    fetchUsers({ page, per_page: itemsPerPage, q: debouncedSearch || undefined, sort: 'created_at', direction: 'desc' });
  }, [currentPage, debouncedSearch, itemsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── CRUD Modal (useCrudModal) ───────────────────────────
  const crud = useCrudModal({
    emptyForm: EMPTY_FORM,
    onSuccess: () => refetchUsers(currentPage),
  });

  const openAdd = () => crud.openAdd();
  const openEdit = (user) => crud.openEdit(user, { name: user.name, phone: user.phone ?? '' });

  const handleFormChange = (e) => {
    crud.setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    crud.setFormError('');
  };

  const validateForm = () => {
    if (!crud.form.name?.trim()) return 'Vui lòng nhập họ tên.';
    if (crud.modal === 'add') {
      if (!crud.form.email?.trim()) return 'Vui lòng nhập email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(crud.form.email)) return 'Email không hợp lệ.';
      if (!crud.form.password || crud.form.password.length < 6) return 'Mật khẩu tối thiểu 6 ký tự.';
    }
    return '';
  };

  const handleSave = () => {
    const err = validateForm();
    if (err) { crud.setFormError(err); return; }
    crud.save(async () => {
      if (crud.modal === 'add') {
        await userApi.create({
          name: crud.form.name.trim(),
          email: crud.form.email.trim(),
          password: crud.form.password,
          phone: crud.form.phone?.trim() || undefined,
        });
        toast.success(`Đã thêm người dùng "${crud.form.name.trim()}" thành công!`);
      } else {
        await userApi.updateProfile(crud.editing.id, {
          name: crud.form.name.trim(),
          phone: crud.form.phone?.trim() || undefined,
        });
        toast.success(`Đã cập nhật "${crud.form.name.trim()}" thành công!`);
      }
    });
  };

  const handleDeleteConfirm = () => {
    const user = crud.deleting;
    crud.confirmDelete(async () => {
      await userApi.softDelete(user.id);
      toast.success(`Đã vô hiệu hóa tài khoản "${user.name}".`);
      // Nếu trang hiện tại chỉ còn 1 item → về trang trước rồi fetch lại
      const newPage = users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
        // useEffect sẽ tự gọi fetchUsers khi currentPage thay đổi
      } else {
        // Cùng trang → fetch trực tiếp
        refetchUsers(newPage);
      }
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể vô hiệu hóa tài khoản.');
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset trang ngay khi user gõ (không đợi debounce) — tránh setState trong effect
    setCurrentPage(1);
  };

  const totalPages = meta.last_page;

  const getAvatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Tài khoản & Cầu thủ</h2>
            <p className="text-gray-400 text-sm mt-1">
              Quản lý người dùng hệ thống và xét duyệt đăng ký cầu thủ.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'users' && (
              <>
                <button
                  onClick={() => refetchUsers(currentPage)}
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
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-navy border-b border-navy-light">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'users' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <User className="w-4 h-4" /> Danh sách Người dùng
          </button>
          <button
            onClick={() => setActiveTab('approve')}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'approve' ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Duyệt Đăng ký Cầu thủ
          </button>
        </div>

        {activeTab === 'users' ? (
          <>
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
                          onClick={() => refetchUsers()}
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
                            onClick={() => crud.setDeleting(u)}
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
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark rounded-b-xl">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </div>
        </>
      ) : (
          <ApprovePlayersTab />
        )}
      </div>

      {/* Add/Edit Modal */}
      {crud.modal && (
        <AdminModal
          title={crud.modal === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
          onClose={crud.closeModal}
          footer={
            <>
              <button onClick={crud.closeModal} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl transition-colors border border-navy-light">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={crud.isSaving}
                className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 shadow-md shadow-emerald-500/20"
              >
                {crud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {crud.modal === 'add' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            {crud.formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {crud.formError}
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
                value={crud.form.name}
                onChange={handleFormChange}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
              />
            </div>

            {/* Email + Password — only when adding */}
            {crud.modal === 'add' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={crud.form.email}
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
                    value={crud.form.password}
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
                value={crud.form.phone}
                onChange={handleFormChange}
                placeholder="0901 234 567"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirm */}
      {crud.deleting && (
        <ConfirmDeleteModal
          title="Vô hiệu hóa tài khoản?"
          message={
            <>
              Bạn có chắc muốn vô hiệu hóa <strong className="text-white">{crud.deleting.name}</strong>?{' '}
              Tài khoản sẽ bị khóa, không thể đăng nhập.
            </>
          }
          confirmText="Vô hiệu hóa"
          onConfirm={handleDeleteConfirm}
          onCancel={() => crud.setDeleting(null)}
          isDeleting={crud.isDeleting}
          variant="orange"
        />
      )}
    </AdminLayout>
  );
}
