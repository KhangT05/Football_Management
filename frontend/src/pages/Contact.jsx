import { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Information } from '../data/data';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen relative p-4 py-12 overflow-x-hidden">
      {/* Background with Dark Tint Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1ee7e1611b81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
      >
        <div 
          className="absolute inset-0 backdrop-blur-sm transition-colors duration-500" 
          style={{ backgroundColor: 'var(--color-bg-base)', opacity: 0.90 }}
        ></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 font-semibold px-4 py-2 mb-8 rounded-xl border backdrop-blur-md shadow-lg transition-all hover:opacity-80"
          style={{ 
            backgroundColor: 'var(--color-bg-elevated)', 
            borderColor: 'var(--color-border)', 
            color: 'var(--color-text-primary)' 
          }}
        >
           <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Contact Information */}
          <div className="bg-navy border border-navy-light rounded-3xl shadow-2xl p-8 sm:p-10 animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider mb-2">Liên Hệ</h1>
              <p className="text-gray-400 mb-10 leading-relaxed">
                Bạn có câu hỏi hoặc cần hỗ trợ về giải đấu? Vui lòng gửi tin nhắn hoặc liên hệ trực tiếp với Ban tổ chức qua các thông tin bên dưới.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Địa chỉ</h3>
                    <p className="text-gray-400 text-sm">{Information.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Điện thoại</h3>
                    <p className="text-gray-400 text-sm">{Information.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neon/10 rounded-2xl border border-neon/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-neon" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Email</h3>
                    <p className="text-gray-400 text-sm">{Information.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-navy-light">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{Information.logoSubtitle}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-navy border border-navy-light rounded-3xl shadow-2xl p-8 sm:p-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6">Gửi tin nhắn</h2>
            
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Đã gửi thành công!</h3>
                <p className="text-gray-400">Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất qua email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-300">Họ và Tên</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nguyễn Văn A" 
                    className="block w-full px-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-300">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="sinhvien@khoait.edu.vn" 
                    className="block w-full px-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-300">Nội dung tin nhắn</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Bạn cần hỗ trợ gì?" 
                    className="block w-full px-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
                >
                  <Send className="w-5 h-5" /> Gửi Tin Nhắn
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
