import { User, Mail, Shield, Camera, Save, Phone, MapPin } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useState } from 'react';

export default function Profile() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-neon rounded-full"></div>
          <h1 className="text-3xl font-extrabold text-white uppercase italic tracking-wider">Thông Tin Cá Nhân</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="col-span-1">
            <div className="bg-navy border border-navy-light rounded-2xl p-6 flex flex-col items-center text-center shadow-lg shadow-black/20">
              <div className="relative mb-6 group cursor-pointer">
                <div className="w-32 h-32 rounded-full border-4 border-navy-light overflow-hidden bg-navy-dark flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-500" />
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user?.name || 'Tài Khoản Mới'}</h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon/10 border border-neon/30 text-neon rounded-full text-xs font-bold uppercase mb-4">
                <Shield className="w-3 h-3" />
                <span>Quản lý Đội</span>
              </div>
              <p className="text-gray-400 text-sm">Cập nhật ảnh đại diện để nhận diện dễ dàng hơn trên bảng xếp hạng.</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-navy border border-navy-light rounded-2xl p-6 md:p-8 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white border-b border-navy-light pb-2 inline-block">Hồ sơ chi tiết</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors ${isEditing ? 'bg-navy-light text-white' : 'bg-neon/10 text-neon hover:bg-neon hover:text-navy'}`}
                >
                  {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Họ và tên</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <input 
                        type="text" 
                        defaultValue={user?.name || 'Nguyễn Văn A'} 
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon disabled:opacity-60 disabled:cursor-not-allowed transition-colors" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-gray-500" />
                      </div>
                      <input 
                        type="email" 
                        defaultValue={user?.email || 'admin@example.com'} 
                        disabled={true}
                        className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-gray-400 opacity-60 cursor-not-allowed transition-colors" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-4 h-4 text-gray-500" />
                      </div>
                      <input 
                        type="text" 
                        defaultValue="0123456789" 
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon disabled:opacity-60 disabled:cursor-not-allowed transition-colors" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mã số sinh viên</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <input 
                        type="text" 
                        defaultValue="03062024" 
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon disabled:opacity-60 disabled:cursor-not-allowed transition-colors" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lớp / Chuyên ngành</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <input 
                      type="text" 
                      defaultValue="Kỹ thuật phần mềm K21" 
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon disabled:opacity-60 disabled:cursor-not-allowed transition-colors" 
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 flex justify-end">
                    <button type="button" className="bg-neon text-navy font-bold px-6 py-2.5 rounded-lg hover:bg-neon-hover flex items-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all">
                      <Save className="w-4 h-4" />
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
