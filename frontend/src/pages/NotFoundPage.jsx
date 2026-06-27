import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, SearchX } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center relative overflow-x-hidden px-4">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-700 rounded-full blur-[160px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[160px] opacity-10 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg w-full animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 rounded-3xl bg-navy border-2 border-navy-light flex items-center justify-center shadow-2xl shadow-black/40 relative">
            <SearchX className="w-14 h-14 text-blue-400 opacity-80" />
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center">
              <span className="text-red-400 text-sm font-black">!</span>
            </div>
          </div>
        </div>

        {/* Error code */}
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-500 leading-none mb-4 tracking-tight drop-shadow-md">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
          Trang không tồn tại
        </h2>
        <p className="text-gray-400 text-base mb-10 leading-relaxed max-w-md mx-auto">
          Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa. Kiểm tra lại URL hoặc quay về trang chủ.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-300 bg-navy border border-navy-light hover:border-gray-500 hover:bg-navy-light hover:text-white transition-all shadow-lg shadow-black/20 hover:shadow-black/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-navy-dark bg-neon hover:bg-neon-hover transition-all shadow-lg shadow-neon/20 hover:shadow-neon/30"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
