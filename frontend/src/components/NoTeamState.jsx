import { ShieldOff, UserPlus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NoTeamState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-8 animate-fade-in">
      <div className="w-32 h-32 rounded-4xl bg-navy-light/30 border-2 border-dashed border-navy-light flex items-center justify-center relative group shadow-[0_0_50px_rgba(30,58,138,0.2)]">
        <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-4xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
        <ShieldOff className="w-14 h-14 text-gray-400 group-hover:scale-110 group-hover:text-blue-400 transition-all duration-500 relative z-10" />
      </div>
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-black text-white tracking-tight">Bạn chưa có đội bóng</h3>
        <p className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed">
          Hãy đăng ký đội bóng để tham gia giải đấu và quản lý đội hình của bạn ngay hôm nay.
        </p>
      </div>
      <Link
        to="/dang-ky-doi-bong"
        className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-neon to-emerald-400 text-navy-dark font-black rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_50px_rgba(57,255,20,0.5)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
      >
        <UserPlus className="w-5 h-5" /> Đăng Ký Đội Bóng
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}