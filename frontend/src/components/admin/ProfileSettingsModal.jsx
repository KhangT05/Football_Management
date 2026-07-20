import { User, Loader2, Save, AlertTriangle, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStore from '../store/authStore';
import { useUpdateProfile } from '../../store/userProfile';
import { profileSchema } from '../../schemas/profile.schema';
import { INPUT } from '../utils/adminStyles';

export default function ProfileSettingsModal({ onClose }) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile(user?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = (values) => {
    updateProfile.mutate(
      { name: values.name.trim(), phone: values.phone.trim() },
      { onSuccess: onClose }
    );
  };

  // Lỗi validate (client) ưu tiên hiển thị trước, sau đó tới lỗi server (mutation)
  const formError = errors.name?.message || errors.phone?.message;
  const serverError = updateProfile.isError
    ? updateProfile.error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.'
    : null;
  const displayError = formError || serverError;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-light bg-navy-dark flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-neon" /> Cấu hình tài khoản
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {displayError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{displayError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Họ tên <span className="text-red-400">*</span>
            </label>
            <input type="text" className={INPUT} placeholder="Nhập họ tên..." {...register('name')} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Số điện thoại</label>
            <input type="text" className={INPUT} placeholder="Nhập số điện thoại..." {...register('phone')} />
          </div>

          <div className="space-y-1.5 opacity-60">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
            <input type="email" className={INPUT + ' cursor-not-allowed'} value={user?.email || ''} disabled readOnly />
            <p className="text-[10px] text-gray-500 italic ml-1">Email không thể thay đổi</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light rounded-xl transition-colors">
            Hủy
          </button>
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="px-5 py-2 font-bold bg-neon text-navy-dark hover:bg-neon/90 rounded-xl flex items-center gap-2 disabled:opacity-70 transition-all shadow-lg shadow-neon/20"
          >
            {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}