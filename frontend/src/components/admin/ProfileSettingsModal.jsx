import { useState } from 'react';
import { User, Phone, Save, Loader2, AlertTriangle, X } from 'lucide-react';
import { userApi } from '../../api/userApi';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';
import { useShallow } from 'zustand/react/shallow';

const INPUT = 'w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 transition-all text-sm';

export default function ProfileSettingsModal({ onClose }) {
  const { user, setUser } = useAuthStore(useShallow(state => ({ user: state.user, setUser: state.setUser })));
  const toast = useToastStore();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Tên không được bỏ trống.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await userApi.updateProfile(user.id, {
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      // Update local store
      setUser({ ...user, name: form.name.trim(), phone: form.phone.trim() });
      toast.success('Đã cập nhật thông tin tài khoản!');
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in overflow-hidden flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-light bg-navy-dark flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-neon" /> Cấu hình tài khoản
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Họ tên <span className="text-red-400">*</span></label>
            <input
              type="text"
              className={INPUT}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nhập họ tên..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Số điện thoại</label>
            <input
              type="text"
              className={INPUT}
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="Nhập số điện thoại..."
            />
          </div>

          <div className="space-y-1.5 opacity-60">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
            <input
              type="email"
              className={INPUT + ' cursor-not-allowed'}
              value={user?.email || ''}
              disabled
            />
            <p className="text-[10px] text-gray-500 italic ml-1">Email không thể thay đổi</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light rounded-xl transition-colors">
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 font-bold bg-neon text-navy-dark hover:bg-neon/90 rounded-xl flex items-center gap-2 disabled:opacity-70 transition-all shadow-lg shadow-neon/20"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
