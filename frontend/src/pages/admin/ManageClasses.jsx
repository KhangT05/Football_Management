import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Plus, Edit, Trash2, GraduationCap,
  AlertTriangle, RefreshCw, Search
} from 'lucide-react';
import { useCrudModal, useDebouncedValue } from '../../hooks';
import useToastStore from '../../store/toastStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import ClassFormModal from '../../components/admin/ClassFormModal';
import Pagination from '../../components/ui/Pagination';
import { classApi } from '../../api';

const EMPTY_CLASS = { name: '', is_active: true };

export default function ManageClasses() {
  const toast = useToastStore();
  const [classesList, setClassesList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch]);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const res = await classApi.getAll({
        page: currentPage,
        per_page: itemsPerPage,
        q: debouncedSearch || undefined,
        sort: 'created_at',
        direction: 'desc'
      });

      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      const items = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
      const resultMeta = Array.isArray(payload) ? null : payload?.meta;

      setClassesList(items);
      setMeta(resultMeta);
    } catch (err) {
      console.error(err);
      setFetchError(err?.response?.data?.message || 'Lỗi khi tải danh sách lớp học');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const totalPages = meta?.last_page || 1;

  // CRUD Modal
  const classCrud = useCrudModal({ emptyForm: EMPTY_CLASS, onSuccess: fetchClasses });

  const handleSaveClass = async (payload) => {
    await classCrud.save(async () => {
      if (classCrud.modal === 'add') {
        await classApi.create(payload);
        toast.success(`Đã tạo lớp học "${payload.name}"`);
      } else {
        await classApi.update(classCrud.editing.id, payload);
        toast.success(`Đã cập nhật lớp học "${payload.name}"`);
      }
    });
  };

  const handleDeleteClass = () => {
    const cls = classCrud.deleting;
    classCrud.confirmDelete(async () => {
      await classApi.delete(cls.id);
      toast.success(`Đã xóa lớp học "${cls.name}".`);
    }).catch((err) => {
      console.error(err);
      toast.error(parseApiError(err, 'Không thể xóa lớp học.'));
    });
  };

  return (
    <AdminLayout>
      <div className="w-full space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Lớp học</h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-bold text-neon">{meta?.total || 0}</span> lớp học trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchClasses} disabled={isLoading} className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={classCrud.openAdd} className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all">
              <Plus className="w-5 h-5" /> Thêm Lớp học
            </button>
          </div>
        </div>

        <div className="bg-navy p-4 rounded-xl border border-navy-light flex flex-col sm:flex-row gap-3 shadow-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên lớp học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        <div className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[500px]">
              <thead>
                <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-16">ID</th>
                  <th className="py-4 px-6">Tên lớp học</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6">Ngày tạo</th>
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
                ) : classesList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <GraduationCap className="w-10 h-10 text-gray-600" />
                        <p className="font-semibold">Chưa có lớp học nào.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  classesList.map((cls) => (
                    <tr key={cls.id} className="border-b border-navy-light hover:bg-navy-dark/70 transition-colors">
                      <td className="py-4 px-6 text-gray-400 font-medium">#{cls.id}</td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-white">{cls.name}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${cls.is_active !== false
                          ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                          : 'bg-red-400/10 text-red-400 border-red-400/30'
                          }`}>
                          {cls.is_active !== false ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-400">
                        {cls.created_at ? new Date(cls.created_at).toLocaleDateString('vi-VN') : '---'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => classCrud.openEdit(cls, {
                              name: cls.name,
                              is_active: cls.is_active,
                            })} className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => classCrud.setDeleting(cls)} className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors">
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

        {classCrud.modal && (
          <ClassFormModal
            mode={classCrud.modal}
            initialData={classCrud.form}
            isSaving={classCrud.isSaving}
            onSave={handleSaveClass}
            onClose={classCrud.closeModal}
          />
        )}

        {classCrud.deleting && (
          <ConfirmDeleteModal
            title="Xóa lớp học?"
            message={<>Xóa lớp <strong className="text-white">{classCrud.deleting.name}</strong>? Hành động này có thể ảnh hưởng đến các cầu thủ đang thuộc lớp học này.</>}
            onConfirm={handleDeleteClass}
            onCancel={() => classCrud.setDeleting(null)}
            isDeleting={classCrud.isDeleting}
          />
        )}
      </div>
    </AdminLayout>
  );
}
