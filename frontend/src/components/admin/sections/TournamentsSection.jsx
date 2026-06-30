import { useState, useEffect } from 'react';
import { Trophy, Plus, Edit, Trash2, Save, Loader2, AlertTriangle, RefreshCw, Shield, UploadCloud, Search } from 'lucide-react';
import { tournamentApi } from '../../../api';
import { useApiQuery, useCrudModal } from '../../../hooks';
import useToastStore from '../../../store/toastStore';
import useTournamentStore from '../../../store/tournamentStore';
import AdminModal from '../AdminModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import FormField from '../../ui/FormField';
import Pagination from '../../ui/Pagination';
import { useShallow } from 'zustand/react/shallow';

const INPUT = 'w-full px-4 py-3 bg-navy border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm';

export default function TournamentsSection() {
  const toast = useToastStore();
  const { invalidate: invalidateTournamentStore } = useTournamentStore(useShallow(state => ({ invalidate: state.invalidate })));
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data: items, meta, isLoading, fetch: fetchTournaments } = useApiQuery(
    (params) => tournamentApi.getAll(params),
    { 
      autoFetch: false, 
      errorMsg: 'Không tải được danh sách giải đấu.' 
    }
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTournaments({
        page: currentPage,
        per_page: itemsPerPage,
        sort: 'id',
        direction: 'desc',
        ...(searchTerm.trim() ? { q: searchTerm.trim() } : {})
      });
    }, 300);
    return () => clearTimeout(delay);
  }, [currentPage, itemsPerPage, searchTerm, fetchTournaments]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const crud = useCrudModal({
    emptyForm: { name: '', description: '', logo: null, is_active: true },
    onSuccess: () => { 
      invalidateTournamentStore(); 
      setCurrentPage(1);
      fetchTournaments({
        page: 1, per_page: itemsPerPage, sort: 'id', direction: 'desc',
        ...(searchTerm.trim() ? { q: searchTerm.trim() } : {})
      });
    },
  });

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const totalPages = meta?.last_page || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = items || [];

  const [logoPreview, setLogoPreview] = useState(null);

  const openAdd = () => {
    setLogoPreview(null);
    crud.openAdd();
  };
  const openEdit = (item) => {
    setLogoPreview(item.logo || null);
    crud.openEdit(item, { name: item.name, description: item.description ?? '', logo: null, is_active: item.is_active ?? true });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      crud.setForm(f => ({ ...f, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const name = (crud.form.name || '').trim();
    const description = (crud.form.description || '').trim();
    if (!name) { crud.setFormError('Tên giải đấu không được bỏ trống.'); return; }
    crud.save(async () => {
      if (crud.modal === 'add') {
        await tournamentApi.create({ name, description, logo: crud.form.logo, is_active: crud.form.is_active });
        toast.success(`Đã tạo giải đấu "${name}"!`);
      } else {
        await tournamentApi.update(crud.editing.id, { name, description, logo: crud.form.logo, is_active: crud.form.is_active });
        toast.success(`Đã cập nhật "${name}"!`);
      }
    });
  };

  const handleDelete = () => {
    const item = crud.deleting;
    crud.confirmDelete(async () => {
      await tournamentApi.delete(item.id);
      toast.success(`Đã xóa "${item.name}".`);
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa giải đấu.');
      crud.setDeleting(null);
    });
  };

  return (
    <section className="bg-navy border border-navy-light rounded-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="relative px-6 py-5 border-b border-navy-light bg-linear-to-r from-navy-dark via-navy to-navy-dark overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-inner">
              <Trophy className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg sm:text-xl tracking-tight uppercase">Quản lý Giải Đấu</h3>
              <p className="text-xs text-gray-400 mt-0.5">Tổng số: <strong className="text-blue-400">{meta?.total || 0}</strong> giải đấu</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Tìm giải đấu..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2.5 bg-navy-dark/80 border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm shadow-sm"
              />
            </div>
            <button 
              onClick={() => fetchTournaments()} 
              disabled={isLoading} 
              className="p-2.5 rounded-xl bg-navy-dark/80 border border-navy-light text-gray-400 hover:text-white hover:bg-navy-light hover:border-gray-500 transition-all shadow-sm disabled:opacity-50 shrink-0"
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={openAdd} 
              className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap shrink-0"
            >
              <Plus className="w-5 h-5" /> 
              <span className="hidden sm:inline">Thêm mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content list */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 bg-navy-dark/30 min-h-[300px]">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-2xl w-full" />)
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-500 flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-navy-light flex items-center justify-center mb-5 shadow-inner">
              <Trophy className="w-10 h-10 text-gray-600" />
            </div>
            <p className="font-bold text-gray-400 text-lg">Chưa có giải đấu nào</p>
            <p className="text-sm mt-1">Hãy bắt đầu bằng cách tạo giải đấu đầu tiên của bạn.</p>
            <button onClick={openAdd} className="mt-6 px-6 py-2.5 rounded-xl bg-navy border border-navy-light hover:bg-navy-light text-blue-400 font-bold transition-colors">
              Tạo giải đấu ngay
            </button>
          </div>
        ) : (
          paginatedItems.map((item, idx) => (
            <div 
              key={item.id} 
              className="group bg-navy border border-navy-light hover:border-blue-500/30 hover:bg-navy-dark rounded-2xl px-5 py-4 flex items-center justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-900/10 animate-slide-up"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg shadow-blue-900/40 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <p className="font-black text-white text-base sm:text-lg truncate group-hover:text-blue-400 transition-colors">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate max-w-md lg:max-w-xl">{item.description || 'Không có mô tả'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <span className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider px-3 py-1.5 rounded-full border ${item.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {item.is_active ? <Shield className="w-3 h-3" /> : null}
                  {item.is_active ? 'Hoạt động' : 'Đã khóa'}
                </span>
                
                <div className="w-px h-8 bg-navy-light mx-1 hidden sm:block"></div>
                
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="p-2.5 rounded-xl text-gray-400 bg-navy-dark hover:text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/30 transition-all shadow-sm" title="Chỉnh sửa">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => crud.setDeleting(item)} className="p-2.5 rounded-xl text-gray-400 bg-navy-dark hover:text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/30 transition-all shadow-sm" title="Xóa">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        
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

      {crud.modal && (
        <AdminModal
          title={crud.modal === 'add' ? 'Thêm giải đấu mới' : 'Chỉnh sửa giải đấu'}
          icon={Trophy} iconClass="text-blue-400"
          onClose={crud.closeModal}
          footer={
            <>
              <button onClick={crud.closeModal} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light transition-colors">Hủy</button>
              <button onClick={handleSave} disabled={crud.isSaving} className="px-6 py-2.5 rounded-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-900/40 transition-all">
                {crud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {crud.modal === 'add' ? 'Tạo giải đấu' : 'Lưu thay đổi'}
              </button>
            </>
          }
        >
          {crud.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex gap-3 items-start animate-fade-in shadow-inner">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div className="font-medium mt-0.5">{crud.formError}</div>
            </div>
          )}
          
          <div className="space-y-5">
            {crud.modal === 'add' && (
              <div className="text-center text-sm font-medium text-gray-400 bg-navy-dark py-2 rounded-xl border border-navy-light shadow-inner">
                Thời gian tạo: <span className="text-white font-bold">{new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
            )}

            {/* Logo Upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-2xl bg-navy-dark border border-navy-light flex items-center justify-center overflow-hidden shadow-inner relative group">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Trophy className="w-10 h-10 text-gray-600" />
                )}
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <UploadCloud className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
              </div>
              <div className="text-xs text-gray-500 font-medium">{logoPreview ? 'Nhấn vào ảnh để đổi logo' : 'Nhấn để tải logo lên'}</div>
            </div>

            <FormField label="Tên giải đấu" required>
              <input 
                className={INPUT} 
                value={crud.form.name} 
                onChange={e => crud.setForm(f => ({ ...f, name: e.target.value }))} 
                placeholder="VD: IT Super League 2026" 
                autoFocus
              />
            </FormField>
            
            <FormField label="Mô tả chi tiết">
              <textarea 
                className={`${INPUT} resize-none`} 
                rows={4} 
                value={crud.form.description} 
                onChange={e => crud.setForm(f => ({ ...f, description: e.target.value }))} 
                placeholder="Nhập thông tin giới thiệu, mục đích, hoặc các ghi chú về giải đấu..." 
              />
            </FormField>
            
            <div className="flex items-center gap-3 py-2">
              <label className="flex items-center cursor-pointer gap-3">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" checked={crud.form.is_active} onChange={e => crud.setForm(f => ({ ...f, is_active: e.target.checked }))} />
                  <div className="w-11 h-6 bg-navy-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </div>
                <span className="text-sm font-bold text-gray-300">Trạng thái hoạt động</span>
              </label>
            </div>
          </div>
        </AdminModal>
      )}

      {crud.deleting && (
        <ConfirmDeleteModal
          title="Xóa giải đấu?"
          message={`Toàn bộ dữ liệu của giải đấu "${crud.deleting.name}" bao gồm luật, mùa giải và trận đấu có thể bị ảnh hưởng. Hành động này không thể hoàn tác!`}
          onConfirm={handleDelete}
          onCancel={() => crud.setDeleting(null)}
          isDeleting={crud.isDeleting}
        />
      )}
    </section>
  );
}
