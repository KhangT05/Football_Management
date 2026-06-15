import { User, Mail, Shield, Camera, Save, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const toast = useToastStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for form fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  // Keep a copy for cancel
  const [savedData, setSavedData] = useState({ name: '', phone: '' });

  // Fetch full user details (including phone) when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      const initial = {
        name: user.name || '',
        phone: user.phone || '',
      };
      setFormData(initial);
      setSavedData(initial);

      // Fetch full profile from /users/{id}
      setIsFetching(true);
      userApi.getUserById(user.id)
        .then(res => {
          if (res.data) {
            const full = {
              name: res.data.name || '',
              phone: res.data.phone || '',
            };
            setFormData(full);
            setSavedData(full);
            setUser(res.data);
          }
        })
        .catch(err => console.error("Failed to fetch full user profile", err))
        .finally(() => setIsFetching(false));
    }
  }, [user?.id, setUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData(savedData); // Restore original
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
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
        setSavedData(updated);
        setUser({ ...user, ...res.data });
        setIsEditing(false);
        setSaveSuccess(true);
        toast.success('Cập nhật thông tin thành công! 🎉');
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12">
      <div className="container mx-auto px-4 max-w-4xl animate-fade-in">
        <div className="mb-8 flex items-center gap-3 animate-slide-up">
          <div className="w-1.5 h-8 bg-neon rounded-full" />
          <h1 className="text-3xl font-extrabold text-white uppercase italic tracking-wider">Thông Tin Cá Nhân</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="col-span-1 animate-slide-up" style={{ animationDelay: '80ms' }}>
            <div className="bg-navy border border-navy-light rounded-2xl p-6 flex flex-col items-center text-center shadow-lg shadow-black/20">
              <div className="relative mb-6 group cursor-pointer">
                <div className="w-32 h-32 rounded-full border-4 border-navy-light overflow-hidden bg-navy-dark flex items-center justify-center transition-all duration-300 group-hover:border-neon/50">
                  {isFetching ? (
                    <div className="w-full h-full skeleton rounded-full" />
                  ) : (
                    <User className="w-16 h-16 text-gray-500" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              {isFetching ? (
                <>
                  <div className="skeleton h-6 w-32 mb-2" />
                  <div className="skeleton h-5 w-24 mb-4" />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white mb-1">{user?.name || 'Tài Khoản Mới'}</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon/10 border border-neon/30 text-neon rounded-full text-xs font-bold uppercase mb-4">
                    <Shield className="w-3 h-3" />
                    <span>Thành viên</span>
                  </div>
                </>
              )}
              <p className="text-gray-400 text-sm">Cập nhật thông tin cá nhân để quản lý giải đấu dễ dàng hơn.</p>

              {saveSuccess && (
                <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-semibold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Đã lưu thành công!
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="col-span-1 md:col-span-2 animate-slide-up" style={{ animationDelay: '160ms' }}>
            <div className="bg-navy border border-navy-light rounded-2xl p-6 md:p-8 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white border-b border-navy-light pb-2 inline-block">Hồ sơ chi tiết</h3>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-bold px-4 py-2 rounded-lg transition-all duration-200 bg-neon/10 text-neon hover:bg-neon hover:text-navy border border-neon/30 hover:border-neon"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-sm font-bold px-4 py-2 rounded-lg transition-all duration-200 bg-navy-light text-gray-300 hover:text-white border border-navy-light"
                  >
                    Hủy
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Họ và tên */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Họ và tên</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      {isFetching ? (
                        <div className="skeleton h-10 w-full" />
                      ) : (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                        />
                      )}
                    </div>
                  </div>

                  {/* Email (readonly) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-gray-500" />
                      </div>
                      {isFetching ? (
                        <div className="skeleton h-10 w-full" />
                      ) : (
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-gray-400 opacity-60 cursor-not-allowed"
                        />
                      )}
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-4 h-4 text-gray-500" />
                      </div>
                      {isFetching ? (
                        <div className="skeleton h-10 w-full" />
                      ) : (
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Chưa cập nhật"
                          className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                        />
                      )}
                    </div>
                  </div>

                  {/* Role badge */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vai trò</label>
                    <div className="py-2.5 px-3 bg-navy-dark border border-navy-light rounded-lg flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-blue-300 capitalize">
                        {user?.role || 'user'}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 flex justify-end animate-fade-in">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-neon text-navy font-bold px-6 py-2.5 rounded-lg hover:bg-neon-hover flex items-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
  );
}
