import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AsideAdmin from '../pages/admin/AsideAdmin';
import useAuthStore from '../store/authStore';
import {
  LogOut, Home, ChevronRight, Bell, User, Settings,
  Shield, Menu, X, UserCog
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import ProfileSettingsModal from '../components/admin/ProfileSettingsModal';

// Map path → tên trang hiển thị trên breadcrumb
const PAGE_NAMES = {
  '/quan-ly-giai-dau':              { label: 'Dashboard',         sub: 'Tổng quan hệ thống' },
  '/quan-ly-giai-dau/doi-bong':     { label: 'Quản lý Đội bóng', sub: 'Danh sách & đội hình' },
  '/quan-ly-giai-dau/tai-khoan':    { label: 'Tài khoản & Phân quyền', sub: 'Tài khoản hệ thống' },
  '/quan-ly-giai-dau/dang-ky-giai': { label: 'Quản lý Mùa giải',     sub: 'Đội bóng & Bốc thăm' },
  '/quan-ly-giai-dau/tran-dau':     { label: 'Quản lý Trận đấu',          sub: 'Lịch thi đấu & Kết quả' },
  '/quan-ly-giai-dau/bai-viet':     { label: 'Quản lý Bài viết', sub: 'Tin tức & Thông báo' },
  '/quan-ly-giai-dau/lop-hoc':      { label: 'Quản lý Lớp học', sub: 'Danh sách Lớp Khoa' },
  '/quan-ly-giai-dau/giai-dau&mua-giai': { label: 'Giải đấu & Mùa giải',  sub: 'Quản lý giải và mùa' },
  '/quan-ly-giai-dau/san-bong-luat': { label: 'Sân bóng & Luật giải', sub: 'Địa điểm & Điều lệ' },
};

export default function AdminLayout({ children }) {
  const { user, logout } = useAuthStore(useShallow(state => ({ user: state.user, logout: state.logout })));
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1280);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tự động thu gọn/mở rộng sidebar khi resize màn hình
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1279px)');
    const handleResize = (e) => setIsCollapsed(e.matches);
    
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  // Lấy thông tin trang hiện tại
  const currentPage = PAGE_NAMES[location.pathname] ?? { label: 'Admin', sub: '' };

  // Initials từ tên user
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : 'AD';

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/dang-nhap');
  };

  return (
    <div className="h-dvh w-full flex overflow-hidden bg-navy-dark text-white font-sans">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40 md:z-auto
        transition-transform duration-300 ease-in-out shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <AsideAdmin onClose={() => setSidebarOpen(false)} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">

        {/* ─── Header ─────────────────────────────────────────────── */}
        <header className="h-16 md:h-[72px] bg-navy border-b border-navy-light px-4 md:px-6 flex items-center justify-between shrink-0 gap-3 shadow-lg shadow-black/30 relative z-10 transition-all duration-300">

          {/* Left: Mobile menu + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0 ml-1">
              <Link
                to="/"
                className="hidden sm:flex items-center gap-1.5 text-gray-400 hover:text-neon transition-colors text-sm font-medium"
                title="Trang chủ"
              >
                <Home className="w-4 h-4 shrink-0" />
                <span className="hidden lg:block">Trang chủ</span>
              </Link>

              <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-gray-600 shrink-0" />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-neon shrink-0 hidden sm:block" />
                  <h1 className="text-base md:text-lg font-bold text-white truncate leading-tight">
                    {currentPage.label}
                  </h1>
                </div>
                {currentPage.sub && (
                  <p className="text-xs text-gray-500 hidden md:block leading-none mt-0.5">
                    {currentPage.sub}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Divider */}
            <div className="h-8 w-px bg-navy-light hidden sm:block" />

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className={`
                  flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all duration-200
                  border ${dropdownOpen
                    ? 'bg-navy-light border-neon/40 shadow-lg shadow-neon/10'
                    : 'border-transparent hover:bg-navy-light hover:border-navy-light'}
                `}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-neon/80 to-blue-500 flex items-center justify-center font-black text-sm text-navy-dark select-none shadow-md shadow-neon/20 shrink-0">
                  {initials}
                </div>

                {/* Name (desktop only) */}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-bold text-white leading-tight truncate max-w-[120px]">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-neon font-medium leading-none mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-neon rounded-full inline-block" />
                    Administrator
                  </p>
                </div>

                {/* Chevron */}
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${dropdownOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-navy border border-navy-light rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-slide-down">

                  {/* User info header */}
                  <div className="px-4 py-4 bg-navy-dark border-b border-navy-light">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-neon/80 to-blue-500 flex items-center justify-center font-black text-lg text-navy-dark shadow-lg shadow-neon/20 shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-neon/10 border border-neon/30 rounded-full text-xs font-bold text-neon">
                          <Shield className="w-2.5 h-2.5" />
                          Administrator
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-2">
                    <Link
                      to="/"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-navy-light transition-colors text-sm font-medium"
                    >
                      <Home className="w-4 h-4 text-gray-400" />
                      Về trang chủ
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-navy-light transition-colors text-sm font-medium"
                    >
                      <UserCog className="w-4 h-4 text-gray-400" />
                      Cấu hình hệ thống
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-2 border-t border-navy-light">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 relative">
          {children}
        </div>
      </main>

      {profileModalOpen && (
        <ProfileSettingsModal onClose={() => setProfileModalOpen(false)} />
      )}
    </div>
  );
}
