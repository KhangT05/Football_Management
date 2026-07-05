import { User, Mail, Shield, Camera, Save, Phone, Loader2, CheckCircle2, Edit2, X, CalendarDays, Lock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import useProfileStore from '../store/profileStore';
import { useEffect } from 'react';
import { userApi } from '../api';
import { useShallow } from 'zustand/react/shallow';

const INPUT_CLASS = "w-full pl-11 pr-4 py-3.5 bg-navy/50 border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50 disabled:bg-navy-dark disabled:cursor-not-allowed transition-all duration-300 text-sm";

export default function Profile() {
  const { user, setUser } = useAuthStore(useShallow(state => ({ user: state.user, setUser: state.setUser })));
  const toast = useToastStore();
  
  const { 
    isEditing, isFetching, isSaving, saveSuccess, formData,
    setEditing, setFetching, setSaving, setSaveSuccess,
    updateField, syncFromUser, handleCancel, updateAfterSave
  } = useProfileStore(useShallow(state => ({
    isEditing: state.isEditing,
    isFetching: state.isFetching,
    isSaving: state.isSaving,
    saveSuccess: state.saveSuccess,
    formData: state.formData,
    setEditing: state.setEditing,
    setFetching: state.setFetching,
    setSaving: state.setSaving,
    setSaveSuccess: state.setSaveSuccess,
    updateField: state.updateField,
    syncFromUser: state.syncFromUser,
    handleCancel: state.handleCancel,
    updateAfterSave: state.updateAfterSave
  })));

  // Fetch full user details (including phone) when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      syncFromUser(user);

      // Fetch full profile from /users/{id}
      setFetching(true);
      userApi.getUserById(user.id)
        .then(res => {
          if (res.data) {
            syncFromUser(res.data);
            setUser(res.data);
          }
        })
        .catch(err => console.error("Failed to fetch full user profile", err))
        .finally(() => setFetching(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, setUser, syncFromUser, setFetching]);

  const handleChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      const res = await userApi.updateProfile(user.id, {
        name: formData.name,
        phone: formData.phone
      });

      if (res.data) {
        const updated = {
          name: res.data.name || formData.name,
          phone: res.data.phone || formData.phone,
        };
        updateAfterSave(updated);
        setUser({ ...user, ...res.data });
        toast.success('Cập nhật thông tin thành công! 🎉');
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setSaving(false);
    }
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
            {/* Profile Card */}
            <div className="bg-navy/80 backdrop-blur-xl border border-navy-light rounded-3xl p-6 md:p-8 flex flex-col items-center text-center shadow-2xl shadow-black/40 animate-slide-up">
              <div className="relative mb-6 group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-navy overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-blue-900/30 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-blue-500/20">
                  {isFetching ? (
                    <div className="w-full h-full skeleton rounded-full" />
                  ) : (
                    <span className="text-5xl md:text-6xl font-black text-white">{userInitial}</span>
                  )}
                </div>
                <button className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-10 h-10 md:w-12 md:h-12 bg-navy hover:bg-navy-light text-gray-300 hover:text-white rounded-full flex items-center justify-center border-4 border-navy shadow-lg transition-colors group-hover:scale-110">
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
                    <span className={`text-xs font-black uppercase tracking-wider ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">Cập nhật và quản lý thông tin hồ sơ của bạn để hệ thống hỗ trợ tốt hơn.</p>

                  {saveSuccess && (
                    <div className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-bold animate-fade-in shadow-inner">
                      <CheckCircle2 className="w-4 h-4" />
                      Thông tin đã được lưu!
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick Stats / Info */}
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
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 hover:-translate-y-0.5"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Chỉnh sửa</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 bg-navy text-gray-300 hover:text-white border border-navy-light hover:bg-navy-light"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Hủy bỏ</span>
                  </button>
                )}
              </div>

              <div className="p-6 md:p-8 flex-1">
                <form onSubmit={handleSave} className="space-y-6 h-full flex flex-col">

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
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={INPUT_CLASS}
                            placeholder="Nhập họ và tên..."
                          />
                        )}
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
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Chưa cập nhật số điện thoại"
                            className={INPUT_CLASS}
                          />
                        )}
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
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className={`${INPUT_CLASS} opacity-50 bg-navy-dark`}
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 ml-1 mt-1.5">Email là định danh duy nhất của tài khoản và không thể thay đổi.</p>
                    </div>

                  </div>

                  <div className="flex-1"></div>

                  {/* Actions */}
                  {isEditing && (
                    <div className="pt-6 mt-6 border-t border-navy-light flex justify-end animate-fade-in">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 w-full sm:w-auto"
                      >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Lưu thay đổi
                      </button>
                    </div>
                  )}

                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
