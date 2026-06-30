import { Information, navItems } from "../../data/data";
import { LogOut, Trophy, X } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

// Map tên tiếng Anh → tiếng Việt cho nav items
const VI_LABELS = {
  'Dashboard':           'Tổng quan',
  'Manage Teams':        'Quản lý đội',
  'Manage Players':      'Quản lý cầu thủ',
  'Manage Users':        'Quản lý người dùng',
  'Manage Roles':        'Phân quyền',
  'Season Teams':        'Đăng ký giải đấu',
  'Manage Matches':      'Quản lý trận đấu',
  'Update Results':      'Cập nhật kết quả',
  'Manage Articles':     'Quản lý bài viết',
  'Tournament Settings': 'Cấu hình giải đấu',
};

export default function AsideAdmin({ onClose }) {
  return (
    <aside className="w-64 md:w-64 h-full bg-navy border-r border-navy-light text-white flex flex-col shadow-2xl z-20 shrink-0">

      {/* Logo / Brand */}
      <div className="h-16 md:h-[72px] flex items-center justify-between px-5 border-b border-navy-light shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div>
              <img src={Information.imgUrl} alt="" className='w-12 h-12 text-white rounded-full' />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none uppercase italic">{Information.logoTitle}</h1>
              <p className="text-gray-400 text-xs font-semibold tracking-wider">{Information.logoSubtitle}</p>
            </div>
          </Link>
        </div>

        {/* Close button (mobile) */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.12em]">Menu</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const label = VI_LABELS[item.name] ?? item.name;
          return (
            <NavLink
              end
              key={item.name}
              to={item.path}
              onClick={onClose}
              title={label}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-neon/10 text-neon border border-neon/20 shadow-sm shadow-neon/10 font-bold'
                    : 'text-gray-400 hover:bg-navy-light/60 hover:text-white border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all
                    ${isActive
                      ? 'bg-neon/20 text-neon'
                      : 'bg-navy-dark text-gray-500 group-hover:bg-navy-light group-hover:text-white'}
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: back to home */}
      <div className="p-3 border-t border-navy-light shrink-0">
        <Link
          to="/"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
          title="Về trang chủ"
        >
          <div className="w-8 h-8 rounded-lg bg-navy-dark flex items-center justify-center shrink-0 group-hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Về trang chính</span>
        </Link>
      </div>
    </aside>
  );
}