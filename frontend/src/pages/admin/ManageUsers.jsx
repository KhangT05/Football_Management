import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Plus, Edit, Trash2, Users, UserCircle,
  AlertTriangle, RefreshCw, Search, Shield
} from 'lucide-react';
import { useCrudModal, useDebouncedValue } from '../../hooks';
import useToastStore from '../../store/toastStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import UserFormModal from '../../components/admin/UserFormModal';
import Pagination from '../../components/ui/Pagination';
import { userApi } from '../../api';

const EMPTY_USER = { name: '', email: '', phone: '', password: '', role_ids: [] };

export default function ManageUsers() {
  const toast = useToastStore();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const res = await userApi.getAll({
        page: currentPage,
        per_page: itemsPerPage,
        q: debouncedSearch || undefined,
        sort: 'created_at',
        direction: 'desc'
      });
      setUsers(res.data.data || []);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
      setFetchError(err?.response?.data?.message || 'Lỗi khi tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalPages = meta?.last_page || 1;

  // CRUD Modal
  const userCrud = useCrudModal({ emptyForm: EMPTY_USER, onSuccess: fetchUsers });

  const handleSaveUser = async (payload) => {
    try {
      userCrud.setIsSaving(true);
      if (userCrud.modal === 'add') {
        await userApi.create(payload);
        toast.success(`Đã tạo người dùng "${payload.name}"`);
      } else {
        const updateData = {
          name: payload.name,
          phone: payload.phone,
          role_ids: payload.role_ids
        };
        await userApi.updateProfile(userCrud.editing.id, updateData);
        toast.success(`Đã cập nhật người dùng "${payload.name}"`);
      }
      userCrud.closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Lỗi khi lưu người dùng');
    } finally {
      userCrud.setIsSaving(false);
    }
  };

  const handleDeleteUser = () => {
    const user = userCrud.deleting;
    userCrud.confirmDelete(async () => {
      await userApi.softDelete(user.id);
      toast.success(`Đã xóa người dùng "${user.name}".`);
      fetchUsers();
    }).catch((err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Không thể xóa người dùng.');
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Người Dùng</h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-bold text-neon">{meta?.total || 0}</span> người dùng trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchUsers} disabled={isLoading} className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={userCrud.openAdd} className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all">
              <Plus className="w-5 h-5" /> Thêm người dùng
            </button>
          </div>
        </div>

        <div className="bg-navy p-4 rounded-xl border border-navy-light flex flex-col sm:flex-row gap-3 shadow-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm email, tên người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        <div className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-16">ID</th>
                  <th className="py-4 px-6">Thông tin</th>
                  <th className="py-4 px-6">Vai trò (Roles)</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-navy-light">
                      {[1, 2, 3, 4, 5].map(j => (
                        <td key={j} className="py-4 px-6"><div className="skeleton h-4 w-full rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : fetchError ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-red-400">
                      <div className="flex flex-col items-center gap-3">
                        <AlertTriangle className="w-10 h-10 text-red-500/50" />
                        <p className="font-semibold">{fetchError}</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-10 h-10 text-gray-600" />
                        <p className="font-semibold">Chưa có người dùng nào.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-navy-light hover:bg-navy-dark/70 transition-colors">
                      <td className="py-4 px-6 text-gray-400 font-medium">#{u.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {u.roles && u.roles.length > 0 ? (
                            u.roles.map(role => (
                              <span key={role.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-neon/10 text-neon font-bold text-[10px] uppercase tracking-wider border border-neon/30 rounded-md">
                                <Shield className="w-3 h-3" /> {role.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500 italic">User</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          u.is_active !== false
                            ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                            : 'bg-red-400/10 text-red-400 border-red-400/30'
                        }`}>
                          {u.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => userCrud.openEdit(u)} className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => userCrud.setDeleting(u)} className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors">
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

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark rounded-b-xl">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </div>
      </div>

      {userCrud.modal && (
        <UserFormModal
          mode={userCrud.modal}
          initialData={userCrud.form}
          isSaving={userCrud.isSaving}
          onSave={handleSaveUser}
          onClose={userCrud.closeModal}
        />
      )}

      {userCrud.deleting && (
        <ConfirmDeleteModal
          title="Xóa người dùng?"
          message={<>Xóa <strong className="text-white">{userCrud.deleting.name}</strong>? Hệ thống sẽ vô hiệu hóa (soft delete) tài khoản này.</>}
          onConfirm={handleDeleteUser}
          onCancel={() => userCrud.setDeleting(null)}
          isDeleting={userCrud.isDeleting}
        />
      )}
    </AdminLayout>
  );
}
