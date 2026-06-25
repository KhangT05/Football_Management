import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Information } from '../data/data';
import useAuthStore from '../store/authStore';
import ThemeSwitcher from './ThemeSwitcher';
import {
  User, ChevronDown, LogOut, UserCircle, Shield, Trophy,
  Menu, X, CalendarDays, BarChart3, Home
} from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Trang Chủ', icon: Home },
    { to: '/lich-thi-dau', label: 'Lịch Thi Đấu', icon: CalendarDays },
    { to: '/bang-xep-hang', label: 'Bảng Xếp Hạng', icon: BarChart3 },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b shadow-lg text-white"
      style={{
        backgroundColor: 'var(--color-bg-header)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-header)',
        color: 'var(--color-text-primary)',
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setMobileOpen(false)}>
            <div>
              <img src={Information.imgUrl} alt="" className='w-12 h-12 text-white rounded-full' />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none uppercase italic">{Information.logoTitle}</h1>
              <p className="text-gray-400 text-xs font-semibold tracking-wider">{Information.logoSubtitle}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 font-medium">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                  isActive(to)
                    ? 'text-white bg-navy-light'
                    : 'text-blue-200 hover:text-white hover:bg-navy-light/60'
                }`}
              >
                {label}
                {/* Active underline */}
                {isActive(to) && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-neon rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3 relative">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/dang-ky-doi-bong"
                  className="hidden lg:inline-block bg-navy-light text-white px-5 py-2.5 rounded-lg font-bold hover:bg-navy-dark transition-all duration-300 shadow-md text-sm uppercase tracking-wider border border-navy-light"
                >
                  Đăng Kí Đội
                </Link>
                <Link
                  to="/quan-ly-giai-dau/dang-nhap"
                  className="bg-neon/10 border border-neon text-neon px-5 py-2.5 rounded-lg font-bold hover:bg-neon hover:text-navy transition-all duration-300 text-sm uppercase tracking-wider shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                >
                  Đăng Nhập
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-navy-light/50 border border-navy-light px-4 py-2 rounded-lg font-medium hover:bg-navy-light transition-colors text-white">
                  <div className="w-7 h-7 bg-neon/20 rounded-full flex items-center justify-center text-neon font-bold text-xs border border-neon/50">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold">{user?.name || 'Tài khoản'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-3 w-72 bg-navy/90 backdrop-blur-2xl border border-navy-light rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-3 z-50 overflow-hidden">
                  
                  {/* Dropdown Header */}
                  <div className="p-5 border-b border-navy-light bg-linear-to-br from-navy-dark via-navy to-blue-900/20 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/50">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-black text-white truncate">{user?.name || 'Thành Viên'}</p>
                        <p className="text-xs text-blue-300/80 truncate font-medium">{user?.email || 'Chưa cập nhật email'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Body */}
                  <div className="p-3 flex flex-col gap-1.5 bg-navy-dark/50">
                    <Link to="/profile" className="group/item flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20">
                      <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center group-hover/item:bg-blue-500/20 transition-colors">
                        <UserCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      Thông tin cá nhân
                    </Link>
                    <Link to="/dang-ky-doi-bong" className="group/item flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-yellow-500/10 rounded-xl transition-all border border-transparent hover:border-yellow-500/20">
                      <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center group-hover/item:bg-yellow-500/20 transition-colors">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                      </div>
                      Đăng ký đội thi đấu
                    </Link>
                    <Link to="/doi-cua-toi" className="group/item flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-xl transition-all border border-transparent hover:border-purple-500/20">
                      <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center group-hover/item:bg-purple-500/20 transition-colors">
                        <Shield className="w-4 h-4 text-purple-400" />
                      </div>
                      Đội bóng của tôi
                    </Link>
                    
                    <>
                      <div className="h-px bg-navy-light my-1 mx-2"></div>
                      <Link to="/quan-ly-giai-dau" className="group/item flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-600/10 rounded-xl transition-all border border-transparent hover:border-blue-600/20">
                        <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center group-hover/item:bg-blue-600/20 transition-colors">
                          <Shield className="w-4 h-4" />
                        </div>
                        Trang quản trị (Admin)
                      </Link>
                    </>
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-3 border-t border-navy-light bg-navy-dark/80">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-xl transition-all border border-red-500/20 hover:border-red-500 shadow-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Divider */}
            <div className="hidden lg:block h-6 w-px bg-gray-600/50 mx-1" style={{ backgroundColor: 'var(--color-border)' }}></div>
            <ThemeSwitcher />
          </div>

          {/* Mobile: Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg border border-navy-light bg-navy-light/50 text-white hover:bg-navy-light transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="border-t px-4 py-4 space-y-1"
          style={{
            backgroundColor: 'var(--color-bg-base)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Nav links */}
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive(to)
                  ? 'bg-navy-light text-white border-l-2 border-neon'
                  : 'text-gray-300 hover:bg-navy-light hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          {/* Theme Switcher in mobile */}
          <div className="flex items-center justify-between px-4 py-3 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Giao diện</span>
            <ThemeSwitcher />
          </div>

          <div className="border-t border-navy-light pt-3 mt-1">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/dang-ky-doi-bong"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-navy-light text-white font-bold text-sm hover:bg-navy transition-colors"
                >
                  <Trophy className="w-4 h-4" /> Đăng Kí Đội
                </Link>
                <Link
                  to="/quan-ly-giai-dau/dang-nhap"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-neon/10 border border-neon text-neon font-bold text-sm hover:bg-neon hover:text-navy transition-colors"
                >
                  Đăng Nhập
                </Link>
              </div>
            ) : (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-navy-light/40 rounded-lg">
                  <div className="w-9 h-9 bg-neon/20 rounded-full flex items-center justify-center text-neon font-bold border border-neon/50">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user?.name || 'Tài khoản'}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[180px]">{user?.email}</p>
                  </div>
                </div>

                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-navy-light hover:text-white transition-colors">
                  <UserCircle className="w-4 h-4 text-emerald-400" /> Thông tin cá nhân
                </Link>
                <Link to="/dang-ky-doi-bong" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-navy-light hover:text-white transition-colors">
                  <Trophy className="w-4 h-4 text-yellow-400" /> Đăng ký đội thi đấu
                </Link>
                <Link to="/doi-cua-toi" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-navy-light hover:text-white transition-colors">
                  <Shield className="w-4 h-4 text-purple-400" /> Đội bóng của tôi
                </Link>
                <div className="h-px bg-navy-light my-1 mx-4"></div>
                <Link to="/quan-ly-giai-dau" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 transition-colors">
                  <Shield className="w-4 h-4" /> Trang quản trị (Admin)
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}