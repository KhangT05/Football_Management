import { User, Mail, Shield, Camera, Save, Phone, Loader2, CheckCircle2, Edit2, X, CalendarDays, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseApiError } from '../utils/errorHelper';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { INPUT_CLASS } from '../data/data';
import { useUserProfile, useUpdateProfile, useChangePassword, useUpdateAvatar } from '../store/profileStore';
import { profileSchema, passwordSchema } from '../schemas/profile.schema';

export default function Profile() {
  const { user, setUser } = useAuthStore(useShallow((state) => ({ user: state.user, setUser: state.setUser })));

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToastStore();

  // ─── Fetch full profile (name/phone) ───────────────────────────────────────
  const { data: fullProfile, isFetching } = useUserProfile(user?.id);

  useEffect(() => {
    if (fullProfile) setUser((prev) => ({ ...prev, ...fullProfile }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullProfile]);

  // ─── Profile form ───────────────────────────────────────────────────────────
  const updateProfile = useUpdateProfile(user?.id);
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: { name: fullProfile?.name ?? user?.name ?? '', phone: fullProfile?.phone ?? user?.phone ?? '' },
  });

  const onSaveProfile = (values) => {
    updateProfile.mutate(
      { name: values.name.trim(), phone: values.phone.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
          setTimeout(() => updateProfile.reset(), 3000);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    resetProfileForm();
    setIsEditing(false);
  };

  // ─── Password form ──────────────────────────────────────────────────────────
  const changePassword = useChangePassword(user?.id);
  const {
    register: registerPassword,
    handleSubmit: handlePasswordFormSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const onSubmitPassword = (values) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          setPasswordSuccess(true);
          resetPasswordForm();
          setTimeout(() => {
            setPasswordSuccess(false);
            setIsPasswordModalOpen(false);
            changePassword.reset();
          }, 2000);
        },
      }
    );
  };

  const passwordFormError =
    passwordErrors.currentPassword?.message || passwordErrors.newPassword?.message || passwordErrors.confirmPassword?.message;
  const passwordServerError = changePassword.isError
    ? parseApiError(changePassword.error, 'Không thể đổi mật khẩu. Vui lòng thử lại.')
    : null;
  const passwordError = passwordFormError || passwordServerError;

  // ─── Avatar ─────────────────────────────────────────────────────────────────
  const updateAvatar = useUpdateAvatar(user?.id);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh quá lớn (tối đa 5MB).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    updateAvatar.mutate(file, {
      onSettled: () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const getRoleLabel = (role) => {
    const roles = {
      admin: { label: 'Quản trị viên', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
      user: { label: 'Thành viên', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    };
    return roles[role] || { label: role, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' };
  };

  const roleInfo = getRoleLabel(user?.role || 'user');
  const userInitial = (user?.name || 'U')[0].toUpperCase();

  return (
    <div className="bg-navy-dark min-h-screen pb-12">
      {/* Premium Banner */}
      <div className="h-56 md:h-72 w-full bg-linear-to-r from-blue-900 via-navy to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute top-12 -left-32 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 xl:px-8 max-w-7xl -mt-24 md:-mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column: Avatar & Basic Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-navy/80 backdrop-blur-xl border border-navy-light rounded-3xl p-6 md:p-8 flex flex-col items-center text-center shadow-2xl shadow-black/40 animate-slide-up">
              <div className="relative mb-6 group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-navy overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-blue-900/30 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-blue-500/20">
                  {isFetching || updateAvatar.isPending ? (
                    <div className="w-full h-full skeleton rounded-full flex items-center justify-center">
                      {updateAvatar.isPending && <Loader2 className="w-8 h-8 text-white animate-spin absolute" />}
                    </div>
                  ) : user?.avatar || user?.avatar_url ? (
                    <img src={user.avatar || user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl md:text-6xl font-black text-white">{userInitial}</span>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={updateAvatar.isPending || isFetching}
                  className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-10 h-10 md:w-12 md:h-12 bg-navy hover:bg-navy-light text-gray-300 hover:text-white rounded-full flex items-center justify-center border-4 border-navy shadow-lg transition-colors group-hover:scale-110 disabled:opacity-50"
                >
                  <Camera className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              {isFetching ? (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="skeleton h-8 w-48 rounded-lg" />
                  <div className="skeleton h-6 w-28 rounded-full mt-2" />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{user?.name || 'Tài Khoản Mới'}</h2>
                  <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${roleInfo.bg} mb-5`}>
                    <Shield className={`w-3.5 h-3.5 ${roleInfo.color}`} />
                    <span className={`text-xs font-black uppercase tracking-wider ${roleInfo.color}`}>{roleInfo.label}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">Cập nhật và quản lý thông tin hồ sơ của bạn để hệ thống hỗ trợ tốt hơn.</p>

                  {updateProfile.isSuccess && !isEditing && (
                    <div className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-bold animate-fade-in shadow-inner">
                      <CheckCircle2 className="w-4 h-4" />
                      Thông tin đã được lưu!
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-navy/80 backdrop-blur-xl border border-navy-light rounded-3xl p-6 shadow-xl shadow-black/20 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h3 className="font-bold text-gray-400 mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" /> Trạng thái tài khoản
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-navy border border-navy-light/50 transition-colors hover:border-navy-light">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Lần cập nhật cuối</p>
                    <p className="text-sm font-bold text-white mt-0.5">{new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-navy border border-navy-light/50 transition-colors hover:border-navy-light">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Xác thực</p>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">Đã bảo vệ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Form */}
          <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-navy/90 backdrop-blur-2xl border border-navy-light rounded-3xl shadow-2xl shadow-black/40 overflow-hidden h-full flex flex-col">
              <div className="px-6 py-5 md:px-8 md:py-6 border-b border-navy-light flex items-center justify-between bg-navy-dark/30">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Chi tiết hồ sơ</h3>
                  <p className="text-xs text-gray-400 mt-1">Thông tin cá nhân và phương thức liên lạc.</p>
                </div>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 hover:-translate-y-0.5"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Chỉnh sửa</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 bg-navy text-gray-300 hover:text-white border border-navy-light hover:bg-navy-light"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Hủy bỏ</span>
                  </button>
                )}
              </div>

              <div className="p-6 md:p-8 flex-1">
                <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-6 h-full flex flex-col">
                  {updateProfile.isError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl">
                      {parseApiError(updateProfile.error, 'Có lỗi xảy ra khi cập nhật thông tin.')}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {/* Họ và tên */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Họ và tên</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className={`w-4 h-4 transition-colors ${isEditing ? 'text-blue-400' : 'text-gray-500'}`} />
                        </div>
                        {isFetching ? (
                          <div className="skeleton h-[52px] w-full rounded-xl" />
                        ) : (
                          <input
                            type="text"
                            disabled={!isEditing}
                            className={INPUT_CLASS}
                            placeholder="Nhập họ và tên..."
                            {...registerProfile('name')}
                          />
                        )}
                        {profileErrors.name && <p className="text-xs text-red-400 mt-1 ml-1">{profileErrors.name.message}</p>}
                      </div>
                    </div>

                    {/* Số điện thoại */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Số điện thoại</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className={`w-4 h-4 transition-colors ${isEditing ? 'text-blue-400' : 'text-gray-500'}`} />
                        </div>
                        {isFetching ? (
                          <div className="skeleton h-[52px] w-full rounded-xl" />
                        ) : (
                          <input
                            type="text"
                            disabled={!isEditing}
                            placeholder="Chưa cập nhật số điện thoại"
                            className={INPUT_CLASS}
                            {...registerProfile('phone')}
                          />
                        )}
                        {profileErrors.phone && <p className="text-xs text-red-400 mt-1 ml-1">{profileErrors.phone.message}</p>}
                      </div>
                    </div>

                    {/* Email (readonly) */}
                    <div className="space-y-2 md:col-span-2 mt-2">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Địa chỉ Email</label>
                        <span className="text-[10px] text-gray-500 bg-navy px-2 py-0.5 rounded border border-navy-light">READ-ONLY</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-gray-500" />
                        </div>
                        {isFetching ? (
                          <div className="skeleton h-[52px] w-full rounded-xl" />
                        ) : (
                          <input type="email" value={user?.email || ''} disabled readOnly className={`${INPUT_CLASS} opacity-50 bg-navy-dark`} />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 ml-1 mt-1.5">Email là định danh duy nhất của tài khoản và không thể thay đổi.</p>
                    </div>
                  </div>

                  <div className="flex-1"></div>

                  {/* Actions */}
                  <div className="pt-6 mt-6 border-t border-navy-light flex justify-end items-center gap-4 animate-fade-in flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="bg-navy-dark hover:bg-navy border border-navy-light text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto"
                    >
                      <Shield className="w-5 h-5 text-purple-400" />
                      Đổi mật khẩu
                    </button>

                    {isEditing && (
                      <button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 w-full sm:w-auto"
                      >
                        {updateProfile.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Lưu thay đổi
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy border border-navy-light rounded-3xl w-full max-w-xl shadow-2xl shadow-black relative overflow-hidden animate-slide-up">
            <div className="p-6 md:p-8 relative z-10">
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  resetPasswordForm();
                  changePassword.reset();
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Shield className="text-purple-500 w-7 h-7" />
                  Bảo mật tài khoản
                </h3>
                <p className="text-gray-400 mt-2 text-sm">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
              </div>

              {passwordError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500 animate-fade-in">
                  <X className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3 text-green-500 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">Mật khẩu đã được cập nhật thành công!</p>
                </div>
              )}

              <form onSubmit={handlePasswordFormSubmit(onSubmitPassword)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input type="password" placeholder="Nhập mật khẩu hiện tại" className={INPUT_CLASS} {...registerPassword('currentPassword')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu mới</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-500" />
                      </div>
                      <input type="password" placeholder="Nhập mật khẩu mới" className={INPUT_CLASS} {...registerPassword('newPassword')} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-500" />
                      </div>
                      <input type="password" placeholder="Nhập lại mật khẩu mới" className={INPUT_CLASS} {...registerPassword('confirmPassword')} />
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-navy-light flex justify-end">
                  <button
                    type="submit"
                    disabled={changePassword.isPending}
                    className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                    {changePassword.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}