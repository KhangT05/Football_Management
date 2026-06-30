import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

export default function RoleFormModal({ mode, initialData, isSaving, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    is_active: initialData?.is_active ?? true,
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Vui lòng nhập tên vai trò (Role Name).');
      return;
    }
    setFormError('');
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-navy border border-navy-light rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-light flex items-center justify-between bg-navy-dark/50">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            {mode === 'add' ? 'Thêm Vai Trò Mới' : 'Chỉnh sửa Vai Trò'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {formError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium animate-slide-down">
              {formError}
            </div>
          )}

          <form id="role-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Tên Vai Trò (Role Name) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="VD: Admin, Referee, User..."
                className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Mô tả (Description)
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Nhập mô tả về vai trò này..."
                rows="3"
                className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium resize-none custom-scrollbar"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-navy-light bg-navy-dark text-emerald-500 focus:ring-emerald-500 focus:ring-offset-navy"
                />
                Kích hoạt (Active)
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="role-form"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {mode === 'add' ? 'Lưu mới' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );
}
