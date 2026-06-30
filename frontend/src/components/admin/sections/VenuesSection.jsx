import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Save, Loader2, AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { venueApi } from '../../../api';
import { useApiQuery, useCrudModal } from '../../../hooks';
import useToastStore from '../../../store/toastStore';
import useVenueStore from '../../../store/venueStore';
import AdminModal from '../AdminModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import FormField from '../../ui/FormField';
import Pagination from '../../ui/Pagination';
import { useShallow } from 'zustand/react/shallow';

const INPUT = 'w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm';

export default function VenuesSection() {
  const toast = useToastStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: items, meta, isLoading, fetch: fetchVenues } = useApiQuery(
    (params) => venueApi.getAll(params),
    { 
      autoFetch: false, 
      errorMsg: 'Không tải được danh sách sân.' 
    }
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchVenues({
        page: currentPage,
        per_page: itemsPerPage,
        sort: 'id',
        direction: 'desc',
        ...(searchTerm.trim() ? { q: searchTerm.trim() } : {})
      });
    }, 300);
    return () => clearTimeout(delay);
  }, [currentPage, itemsPerPage, searchTerm, fetchVenues]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const { invalidate: invalidateVenueStore } = useVenueStore(useShallow(state => ({ invalidate: state.invalidate })));
  const crud = useCrudModal({
    emptyForm: { name: '', address: '', is_active: true },
    onSuccess: () => { 
      invalidateVenueStore(); 
      setCurrentPage(1);
      fetchVenues({
        page: 1, per_page: itemsPerPage, sort: 'id', direction: 'desc',
        ...(searchTerm.trim() ? { q: searchTerm.trim() } : {})
      });
    },
  });

  const openAdd = () => crud.openAdd();
  const openEdit = (item) => crud.openEdit(item, { name: item.name, address: item.address ?? '', is_active: item.is_active ?? true });

  const handleSave = () => {
    if (!crud.form.name.trim()) { crud.setFormError('Tên sân không được bỏ trống.'); return; }
    crud.save(async () => {
      if (crud.modal === 'add') {
        await venueApi.create({ name: crud.form.name.trim(), address: crud.form.address.trim() || undefined, is_active: crud.form.is_active });
        toast.success(`Đã thêm sân "${crud.form.name.trim()}"!`);
      } else {
        await venueApi.update(crud.editing.id, { name: crud.form.name.trim(), address: crud.form.address.trim() || undefined, is_active: crud.form.is_active });
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
  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const totalPages = meta?.last_page || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = items || [];

  return (
    <section className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark gap-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2 shrink-0">
          <MapPin className="w-4 h-4 text-emerald-400" /> Sân thi đấu ({meta?.total || 0})
        </h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Tìm sân thi đấu..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-navy border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
          </div>
          <button 
            onClick={() => fetchVenues()} 
            disabled={isLoading} 
            className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={openAdd} 
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" /> Thêm sân
          </button>
        </div>
      </div>
      <div className="divide-y divide-navy-light">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500"><MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>Chưa có sân thi đấu nào</p></div>
        ) : paginatedItems.map(item => (
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
      {totalPages > 1 && items.length > 0 && !isLoading && (
        <div className="px-6 py-4 border-t border-navy-light flex justify-center bg-navy-dark/30">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}


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
          <FormField label="Tên sân" required>
            <input className={INPUT} value={crud.form.name} onChange={e => crud.setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Sân Mini Khu A" />
          </FormField>
          <FormField label="Địa chỉ">
            <input className={INPUT} value={crud.form.address} onChange={e => crud.setForm(f => ({ ...f, address: e.target.value }))} placeholder="VD: 65 Huỳnh Thúc Kháng, TP.HCM" />
          </FormField>
          <div className="flex items-center gap-3 py-2">
            <label className="flex items-center cursor-pointer gap-3">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={crud.form.is_active} onChange={e => crud.setForm(f => ({ ...f, is_active: e.target.checked }))} />
                <div className="w-11 h-6 bg-navy-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
              <span className="text-sm font-bold text-gray-300">Trạng thái hoạt động</span>
            </label>
          </div>
        </AdminModal>
      )}

      {crud.deleting && (
        <ConfirmDeleteModal
          title="Xóa sân thi đấu?"
          message={`Xóa sân "${crud.deleting.name}" khỏi hệ thống. Hành động này không thể hoàn tác.`}
          onConfirm={handleDelete}
          onCancel={() => crud.setDeleting(null)}
          isDeleting={crud.isDeleting}
        />
      )}
    </section>
  );
}
