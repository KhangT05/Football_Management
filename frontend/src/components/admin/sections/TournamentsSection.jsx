import { Trophy, Plus, Edit, Trash2, Save, Loader2, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { tournamentApi } from '../../../api';
import { useApiQuery, useCrudModal } from '../../../hooks';
import useToastStore from '../../../store/toastStore';
import useTournamentStore from '../../../store/tournamentStore';
import AdminModal from '../AdminModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import FormField from '../../ui/FormField';

const INPUT = 'w-full px-4 py-3 bg-navy border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm';

export default function TournamentsSection() {
  const toast = useToastStore();
  const { invalidate: invalidateTournamentStore } = useTournamentStore();
  const { data: items, isLoading, fetch } = useApiQuery(
    (params) => tournamentApi.getAll(params),
    { perPage: 50, errorMsg: 'Không tải được danh sách giải đấu.' }
  );

  const crud = useCrudModal({
    emptyForm: { name: '', description: '' },
    onSuccess: () => { fetch(); invalidateTournamentStore(); },
  });

  const openAdd = () => crud.openAdd();
  const openEdit = (item) => crud.openEdit(item, { name: item.name, description: item.description ?? '' });

  const handleSave = () => {
    if (!crud.form.name.trim()) { crud.setFormError('Tên giải đấu không được bỏ trống.'); return; }
    crud.save(async () => {
      if (crud.modal === 'add') {
        await tournamentApi.create({ name: crud.form.name.trim(), description: crud.form.description.trim() });
        toast.success(`Đã tạo giải đấu "${crud.form.name.trim()}"!`);
      } else {
        await tournamentApi.update(crud.editing.id, { name: crud.form.name.trim(), description: crud.form.description.trim() });
        toast.success(`Đã cập nhật "${crud.form.name.trim()}"!`);
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
    });
  };

  return (
    <section className="bg-navy border border-navy-light rounded-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="relative px-6 py-5 border-b border-navy-light bg-linear-to-r from-navy-dark via-navy to-navy-dark overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-inner">
              <Trophy className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg sm:text-xl tracking-tight uppercase">Quản lý Giải Đấu</h3>
              <p className="text-xs text-gray-400 mt-0.5">Tổng số: <strong className="text-blue-400">{items.length}</strong> giải đấu</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetch} 
              disabled={isLoading} 
              className="p-2.5 rounded-xl bg-navy-dark/80 border border-navy-light text-gray-400 hover:text-white hover:bg-navy-light hover:border-gray-500 transition-all shadow-sm disabled:opacity-50"
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={openAdd} 
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Plus className="w-5 h-5" /> 
              <span className="hidden sm:inline">Thêm giải đấu</span>
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
          items.map((item, idx) => (
            <div 
              key={item.id} 
              className="group bg-navy border border-navy-light hover:border-blue-500/30 hover:bg-navy-dark rounded-2xl px-5 py-4 flex items-center justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-900/10 animate-slide-up"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg shadow-blue-900/40 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {item.name?.[0]?.toUpperCase()}
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
