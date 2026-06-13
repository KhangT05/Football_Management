import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login, socialLogin, loading, error, clearError } = useAuthStore();
  const [socialLoadingProvider, setSocialLoadingProvider] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login({ email, password });
    if (result.success) {
      navigate('/');
    }
  };

  const handleSocialLogin = async (provider) => {
    clearError();
    setSocialLoadingProvider(provider);
    await socialLogin(provider);
    setSocialLoadingProvider(null);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Stadium Background with Dark Tint Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1ee7e1611b81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
      >
        {/* Dark semi-transparent tint */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs"></div>
      </div>

      {/* Decorative linear glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Back to Home Link */}
      <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-semibold bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md hover:bg-slate-800/60 shadow-lg">
         <ArrowLeft className="w-4 h-4" /> Về trang chủ
      </Link>

      {/* Login Card (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-blue-600"></div>
        
        <div className="p-8 sm:p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-slate-800/80 rounded-2xl border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-5">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">Đăng Nhập</h2>
            <p className="text-sm font-medium text-slate-400 mt-2 text-center">Hệ thống quản lý Giải bóng đá IT</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5 group">
              <label className="block text-sm font-semibold text-slate-300 group-focus-within:text-emerald-400 transition-colors">Tài khoản / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@khoait.edu.vn" 
                  className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 group">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-300 group-focus-within:text-emerald-400 transition-colors">Mật khẩu</label>
                <a href="#" className="font-medium text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="block w-full pl-11 pr-12 py-3 bg-slate-800/50 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-slate-300 transition-colors focus:outline-none"
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
                className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Đăng Nhập"
                )}
              </button>
            </div>
            
            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="grow border-t border-slate-700/50"></div>
              <span className="px-3 text-xs font-medium text-slate-400">Hoặc đăng nhập với</span>
              <div className="grow border-t border-slate-700/50"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading || socialLoadingProvider !== null}
                className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-700/70 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600 text-sm font-semibold text-slate-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {socialLoadingProvider === 'google' ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={loading || socialLoadingProvider !== null}
                className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-700/70 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600 text-sm font-semibold text-slate-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {socialLoadingProvider === 'github' ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                )}
                Github
              </button>
            </div>
            
            <div className="flex items-center justify-center pt-2">
              <p className="text-sm text-slate-400">
                Chưa có tài khoản?{' '}
                <Link to="/dang-ky" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
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
