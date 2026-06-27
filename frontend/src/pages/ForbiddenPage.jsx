import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ShieldOff, LogIn } from 'lucide-react';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center relative overflow-x-hidden px-4">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-700 rounded-full blur-[160px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-[160px] opacity-10 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg w-full animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 rounded-3xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center shadow-2xl shadow-red-500/10 relative">
            <ShieldOff className="w-14 h-14 text-red-400 opacity-80" />
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center">
              <span className="text-red-400 text-sm font-black">×</span>
            </div>
          </div>
        </div>

        {/* Error code */}
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-400 via-orange-400 to-amber-500 leading-none mb-4 tracking-tight drop-shadow-md">
          403
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
          Không có quyền truy cập
        </h2>
        <p className="text-gray-400 text-base mb-3 leading-relaxed max-w-md mx-auto">
          Bạn không có quyền truy cập vào trang này.
          Chỉ tài khoản <span className="text-red-400 font-bold">Administrator</span> mới có thể vào khu vực quản trị.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-400 mb-10">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          Khu vực dành riêng cho Admin
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-300 bg-navy border border-navy-light hover:border-gray-500 hover:bg-navy-light hover:text-white transition-all shadow-lg shadow-black/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-navy border border-navy-light hover:bg-navy-light transition-all shadow-lg shadow-black/20"
          >
            <Home className="w-4 h-4" />
            Trang chủ
          </Link>
          <Link
            to="/quan-ly-giai-dau/dang-nhap"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-navy-dark bg-red-500 hover:bg-red-400 transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
          >
            <LogIn className="w-4 h-4" />
            Đăng nhập Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
