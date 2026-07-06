import { useState, useEffect } from 'react';
import { X, Save, Loader2, Shield } from 'lucide-react';
import { createPortal } from 'react-dom';
import { roleApi } from '../../api';

export default function UserFormModal({ mode, initialData, isSaving, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    phone: initialData?.phone || '',
    role_ids: initialData?.role_ids || [], 
    // Fallback if the API provides roles objects instead of role_ids
    ...(initialData?.roles ? { role_ids: initialData.roles.map(r => r.id) } : {})
  });
  
  const [formError, setFormError] = useState('');
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const res = await roleApi.getRoles();
        setRoles(res.data.data || res.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách roles", error);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (roleId) => {
    setForm(prev => {
      const currentRoles = prev.role_ids;
      if (currentRoles.includes(roleId)) {
        return { ...prev, role_ids: currentRoles.filter(id => id !== roleId) };
      } else {
        return { ...prev, role_ids: [...currentRoles, roleId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Vui lòng nhập họ tên.');
      return;
    }
    if (mode === 'add' && (!form.email.trim() || !form.password.trim())) {
      setFormError('Vui lòng nhập đầy đủ Email và Mật khẩu cho user mới.');
      return;
    }
    setFormError('');
    onSave(form);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-navy border border-navy-light rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-navy-light flex items-center justify-between bg-navy-dark/50">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            {mode === 'add' ? 'Thêm Người Dùng Mới' : 'Cập Nhật Người Dùng'}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {formError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium animate-slide-down">
              {formError}
            </div>
          )}

          <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Họ tên <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="VD: 0987654321"
                  className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={mode === 'edit'}
                  placeholder="VD: email@example.com"
                  className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {mode === 'edit' && <span className="text-xs text-gray-500 mt-1 block">Không thể đổi email sau khi tạo.</span>}
              </div>

              {mode === 'add' && (
                <div>
                  <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Mật khẩu <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  />
                </div>
              )}
            </div>

            {/* Phân quyền */}
            <div className="mt-8 pt-6 border-t border-navy-light">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon" /> Phân quyền (Roles)
              </label>
              
              {loadingRoles ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh sách vai trò...</div>
              ) : roles.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có vai trò nào trong hệ thống.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {roles.map(role => (
                    <label key={role.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      form.role_ids.includes(role.id) ? 'bg-blue-600/10 border-blue-500/50' : 'bg-navy-dark border-navy-light hover:border-gray-500'
                    }`}>
                      <input
                        type="checkbox"
                        checked={form.role_ids.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="mt-0.5 w-4 h-4 rounded border-navy-light bg-navy text-blue-500 focus:ring-blue-500"
                      />
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${form.role_ids.includes(role.id) ? 'text-blue-400' : 'text-gray-300'}`}>{role.name}</span>
                        {role.description && <span className="text-xs text-gray-500">{role.description}</span>}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark/50 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            Hủy
          </button>
          <button type="submit" form="user-form" disabled={isSaving || loadingRoles} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {mode === 'add' ? 'Lưu người dùng' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
