import { useState } from 'react';
import { parseApiError } from '../utils/errorHelper';

import { Mail, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { authApi } from '../api/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(parseApiError(err, 'Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại sau.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-x-hidden">
      {/* Background (Same as Login) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1ee7e1611b81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
      >
        <div 
          className="absolute inset-0 backdrop-blur-sm transition-colors duration-500" 
          style={{ backgroundColor: 'var(--color-bg-base)', opacity: 0.85 }}
        ></div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Utilities */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
        <Link 
          to="/dang-nhap" 
          className="flex items-center gap-2 font-semibold px-4 py-2 rounded-xl border backdrop-blur-md shadow-lg transition-all hover:opacity-80"
          style={{ 
            backgroundColor: 'var(--color-bg-elevated)', 
            borderColor: 'var(--color-border)', 
            color: 'var(--color-text-primary)' 
          }}
        >
           <ArrowLeft className="w-4 h-4" /> Quay lại Đăng nhập
        </Link>
        <ThemeSwitcher />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-navy border border-navy-light rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 shadow-2xl">
        <div 
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(to right, var(--color-accent), var(--color-text-muted))' }}
        ></div>
        
        <div className="p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-navy-light rounded-2xl border border-neon/30 flex items-center justify-center shadow-[0_0_15px_var(--color-accent-glow)] mb-5">
              <ShieldCheck className="w-8 h-8 text-neon" />
            </div>
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider text-center">Khôi phục mật khẩu</h2>
            <p className="text-sm font-medium text-gray-400 mt-2 text-center">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-center text-emerald-400 font-medium">
                Liên kết khôi phục đã được gửi!
                <br />
                <span className="text-gray-400 text-sm">Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam) của bạn.</span>
              </p>
              <Link to="/login" className="mt-4 w-full py-3.5 bg-navy-light hover:bg-navy-dark text-white rounded-xl text-sm font-bold text-center border border-navy-light transition-all">
                Quay lại trang đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="block w-full pl-11 pr-4 py-3.5 bg-navy-dark border border-navy-light rounded-xl focus:ring-2 focus:ring-neon/50 focus:border-neon text-white placeholder-gray-500 transition-all text-sm shadow-inner"
                    placeholder="Nhập email của bạn"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] text-sm font-bold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...
                  </span>
                ) : (
                  'Gửi yêu cầu'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
