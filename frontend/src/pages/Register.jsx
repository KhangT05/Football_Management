import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Fingerprint, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Register() {
  const [formData, setFormData] = useState({
    ten: '',
    mssv: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
    if (error) clearError();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');

    if (formData.password !== formData.confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp!');
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    
    const result = await register(registerData);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/quan-ly-giai-dau/dang-nhap');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden py-12">
      {/* Stadium Background with Dark Tint Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1ee7e1611b81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs"></div>
      </div>

      {/* Decorative linear glowing orbs */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Back to Home Link */}
      <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-semibold bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md hover:bg-slate-800/60 shadow-lg">
         <ArrowLeft className="w-4 h-4" /> Về trang chủ
      </Link>

      {/* Register Card (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-blue-600"></div>
        
        <div className="p-8 sm:p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-slate-800/80 rounded-2xl border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-5">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">Đăng Ký Tài Khoản</h2>
            <p className="text-sm font-medium text-slate-400 mt-2 text-center">Tham gia hệ thống Giải bóng đá IT</p>
          </div>

          {(error || formError) && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
              {error || formError}
            </div>
          )}

          {isSuccess && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5" />
              Đăng ký thành công! Đang chuyển hướng...
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="space-y-1.5 group">
                <label className="block text-sm font-semibold text-slate-300 group-focus-within:text-emerald-400 transition-colors">Họ và Tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    name="ten"
                    required
                    value={formData.ten}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A" 
                    className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* MSSV Field */}
              <div className="space-y-1.5 group">
                <label className="block text-sm font-semibold text-slate-300 group-focus-within:text-emerald-400 transition-colors">MSSV</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Fingerprint className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    name="mssv"
                    required
                    value={formData.mssv}
                    onChange={handleChange}
                    placeholder="20T102xxxx" 
                    className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 group">
              <label className="block text-sm font-semibold text-slate-300 group-focus-within:text-emerald-400 transition-colors">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sinhvien@khoait.edu.vn" 
                  className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 group">
              <label className="block text-sm font-semibold text-slate-300 group-focus-within:text-emerald-400 transition-colors">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5 group">
              <label className="block text-sm font-semibold text-slate-300 group-focus-within:text-emerald-400 transition-colors">Xác nhận mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="block w-full pl-11 pr-12 py-3 bg-slate-800/50 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-slate-300 transition-colors focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading || isSuccess}
                className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Tạo Tài Khoản"
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center pt-2">
              <p className="text-sm text-slate-400">
                Đã có tài khoản?{' '}
                <Link to="/quan-ly-giai-dau/dang-nhap" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
