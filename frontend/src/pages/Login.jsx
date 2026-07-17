import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useShallow } from 'zustand/react/shallow';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const { login, loading, error, clearError } = useAuthStore(useShallow(state => ({ login: state.login, loading: state.loading, error: state.error, clearError: state.clearError })));

  const toast = useToastStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();

    const errors = [];
    if (!email.trim()) errors.push('Vui lòng nhập email.');
    if (!password) errors.push('Vui lòng nhập mật khẩu.');

    if (errors.length > 0) {
      toast.warning(errors.length === 1 ? errors[0] : 'Vui lòng kiểm tra lại thông tin:', { details: errors.length > 1 ? errors : undefined });
      return;
    }

    const result = await login({ email, password });
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      if (result.error) {
         toast.error(result.error);
      }
    }
  };



  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-x-hidden">
      {/* Stadium Background with Dark Tint Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1ee7e1611b81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
      >
        <div 
          className="absolute inset-0 backdrop-blur-sm transition-colors duration-500" 
          style={{ backgroundColor: 'var(--color-bg-base)', opacity: 0.85 }}
        ></div>
      </div>

      {/* Decorative linear glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Utilities */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold px-4 py-2 rounded-xl border backdrop-blur-md shadow-lg transition-all hover:opacity-80"
          style={{ 
            backgroundColor: 'var(--color-bg-elevated)', 
            borderColor: 'var(--color-border)', 
            color: 'var(--color-text-primary)' 
          }}
        >
           <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
        <ThemeSwitcher />
      </div>

      {/* Login Card (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md bg-navy border border-navy-light rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Top Accent Bar */}
        <div 
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(to right, var(--color-accent), var(--color-text-muted))' }}
        ></div>
        
        <div className="p-8 sm:p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-navy-light rounded-2xl border border-neon/30 flex items-center justify-center shadow-[0_0_15px_var(--color-accent-glow)] mb-5">
              <ShieldCheck className="w-8 h-8 text-neon" />
            </div>
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">Đăng Nhập</h2>
            <p className="text-sm font-medium text-gray-400 mt-2 text-center">Hệ thống quản lý Giải bóng đá IT</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5 group">
              <label className="block text-sm font-semibold text-slate-200 group-focus-within:text-neon transition-colors">Tài khoản / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-neon transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@khoait.edu.vn" 
                  className="block w-full pl-11 pr-4 py-3 bg-navy-light/50 border border-navy-light rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/50 focus:border-neon transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 group">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-200 group-focus-within:text-neon transition-colors">Mật khẩu</label>
                <Link to="/quen-mau-khau" className="font-medium text-xs text-neon hover:underline transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-neon transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="block w-full pl-11 pr-12 py-3 bg-navy-light/50 border border-navy-light rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/50 focus:border-neon transition-all font-medium"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_var(--color-accent-glow)] text-sm font-bold text-white bg-neon hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Đăng Nhập"
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center pt-2">
              <p className="text-sm text-gray-400">
                Chưa có tài khoản?{' '}
                <Link to="/dang-ky" className="font-semibold text-neon hover:underline transition-colors">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
