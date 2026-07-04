import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit, Trash2, Shield,
  AlertTriangle, RefreshCw, Search
} from 'lucide-react';
import { useCrudModal } from '../../../hooks';
import useToastStore from '../../../store/toastStore';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import RoleFormModal from '../RoleFormModal';
import { roleApi } from '../../../api';

export default function RolesTab() {
  const toast = useToastStore();
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const res = await roleApi.getRoles();
      setRoles(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      setFetchError(err?.response?.data?.message || 'Lỗi khi tải danh sách vai trò');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const roleCrud = useCrudModal({ emptyForm: { name: '', description: '', is_active: true }, onSuccess: fetchRoles });

  const handleSaveRole = async (payload) => {
    try {
      roleCrud.setIsSaving(true);
      if (roleCrud.modal === 'add') {
        await roleApi.createRole(payload);
        toast.success(`Đã tạo vai trò "${payload.name}"`);
      } else {
        await roleApi.updateRole(roleCrud.editing.id, payload);
        toast.success(`Đã cập nhật vai trò "${payload.name}"`);
      }
      roleCrud.closeModal();
      fetchRoles();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Lỗi khi lưu vai trò');
    } finally {
      roleCrud.setIsSaving(false);
    }
  };

  const handleDeleteRole = () => {
    const role = roleCrud.deleting;
    roleCrud.confirmDelete(async () => {
      await roleApi.deleteRole(role.id);
      toast.success(`Đã xóa vai trò "${role.name}".`);
      fetchRoles();
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa vai trò.');
    });
  };

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Phân Quyền (Roles)</h2>
          <p className="text-gray-400 text-sm mt-1">Quản lý các vai trò trong hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRoles}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={roleCrud.openAdd}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all"
          >
            <Plus className="w-5 h-5" /> Thêm vai trò
          </button>
        </div>
      </div>

      <div className="bg-navy p-4 rounded-xl border border-navy-light flex flex-col sm:flex-row gap-3 shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm vai trò..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
          />
        </div>
      </div>

      <div className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[600px]">
            <thead>
              <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6 w-16">ID</th>
                <th className="py-4 px-6">Tên Vai Trò</th>
                <th className="py-4 px-6">Mô Tả</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
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
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Shield className="w-10 h-10 text-gray-600" />
                      <p className="font-semibold">Chưa có vai trò nào.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr key={role.id} className="border-b border-navy-light hover:bg-navy-dark/70 transition-colors">
                    <td className="py-4 px-6 text-gray-400 font-medium">#{role.id}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 rounded-lg">
                        <Shield className="w-3.5 h-3.5" />
                        {role.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300 text-sm whitespace-normal max-w-sm">
                      {role.description || <span className="text-gray-500 italic">Không có mô tả</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${role.is_active !== false
                        ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                        : 'bg-red-400/10 text-red-400 border-red-400/30'
                        }`}>
                        {role.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => roleCrud.openEdit(role)} className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => roleCrud.setDeleting(role)} className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors">
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

      {roleCrud.modal && (
        <RoleFormModal
          mode={roleCrud.modal}
          initialData={roleCrud.form}
          isSaving={roleCrud.isSaving}
          onSave={handleSaveRole}
          onClose={roleCrud.closeModal}
        />
      )}

      {roleCrud.deleting && (
        <ConfirmDeleteModal
          title="Xóa vai trò?"
          message={<>Xóa <strong className="text-white">{roleCrud.deleting.name}</strong>? Hệ thống có thể lỗi nếu vai trò này đang được sử dụng.</>}
          onConfirm={handleDeleteRole}
          onCancel={() => roleCrud.setDeleting(null)}
          isDeleting={roleCrud.isDeleting}
        />
      )}
    </div>
  );
}
