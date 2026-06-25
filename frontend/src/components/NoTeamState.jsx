import { UserPlus, ArrowRight, ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * NoTeamState — Empty state hiển thị khi người dùng chưa có đội bóng.
 */
export default function NoTeamState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-navy-light border-2 border-dashed border-navy-light flex items-center justify-center">
        <ShieldOff className="w-10 h-10 text-gray-500" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Bạn chưa có đội bóng</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Hãy đăng ký đội bóng để tham gia giải đấu và quản lý đội hình của bạn.
        </p>
      </div>
      <Link
        to="/dang-ky-doi-bong"
        className="flex items-center gap-2 px-6 py-3 bg-neon text-navy font-bold rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:bg-neon-hover transition-all duration-200"
      >
        <UserPlus className="w-4 h-4" /> Đăng Ký Đội Bóng
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
