import { useState } from 'react';
import { CreditCard, X, Info, QrCode, Users, ExternalLink, Loader2 } from 'lucide-react';
import { paymentApi } from '../../api';
import useToastStore from '../../store/toastStore';

export default function TeamPaymentModal({ teamName, seasonTeamId, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToastStore();

  const handleVNPay = async () => {
    if (!seasonTeamId) {
      toast.error('Không tìm thấy thông tin đăng ký giải.');
      return;
    }
    
    setIsLoading(true);
    try {
      const returnUrl = `${window.location.origin}/thanh-toan/ket-qua`;
      const res = await paymentApi.initiatePayment({
        season_team_id: seasonTeamId,
        return_url: returnUrl
      });
      
      const paymentUrl = res.data?.payment_url || res.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error('Không nhận được URL thanh toán từ máy chủ.');
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi khi khởi tạo thanh toán VNPay.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-navy-dark/95 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-2xl animate-scale-in flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>

        <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light bg-navy/40 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Thanh toán Lệ phí</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto relative z-10 custom-scrollbar max-h-[75vh]">
          <div className="bg-navy border border-navy-light p-5 rounded-2xl flex items-start gap-4 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="p-2 bg-emerald-500/20 rounded-xl shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-sm">
              <p className="text-emerald-400 font-black mb-1.5 text-base tracking-tight">Đội bóng của bạn đã được duyệt!</p>
              <p className="text-gray-300 font-medium leading-relaxed">Vui lòng hoàn tất thanh toán lệ phí để chính thức có tên trong danh sách bốc thăm chia bảng.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Thanh toán trực tuyến
            </h4>
            
            <button
              onClick={handleVNPay}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-3xl p-6 flex items-center justify-between group transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] disabled:opacity-70 disabled:cursor-not-allowed border border-blue-500/30"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner">
                  {/* VNPay Logo Placeholder */}
                  <span className="text-blue-600 font-black text-xl italic tracking-tighter">VNPAY</span>
                </div>
                <div className="text-left space-y-1">
                  <p className="font-black text-lg text-white group-hover:text-blue-100 transition-colors">Thanh toán qua VNPAY</p>
                  <p className="text-blue-200/70 text-sm font-medium">Hỗ trợ thẻ ATM, Visa, MasterCard, QR Code</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ExternalLink className="w-6 h-6" />}
              </div>
            </button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy-light"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-navy-dark px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Hoặc thanh toán thủ công</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="border border-navy-light bg-navy/50 rounded-4xl p-6 text-center flex flex-col items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-full h-full text-black" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-black">Chuyển khoản</p>
                <p className="text-[11px] text-gray-400 font-medium">Quét mã qua ứng dụng ngân hàng</p>
              </div>
              <div className="mt-2 text-xs font-mono font-bold bg-navy-dark px-4 py-3 rounded-xl border border-navy-light text-neon w-full flex items-center justify-center gap-2">
                <span className="text-gray-500">ND:</span> {teamName} LE PHI
              </div>
            </div>

            <div className="border border-navy-light bg-navy/50 rounded-4xl p-6 text-center flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 group">
              <div className="w-16 h-16 bg-navy rounded-2xl border border-navy-light flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-500/50">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-black">Trực tiếp</p>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Gặp BTC tại Văn phòng Khoa CNTT (E3.1)</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 font-medium px-4">
            * Nếu thanh toán thủ công, vui lòng liên hệ Admin qua Fanpage để được xác nhận trạng thái.
          </p>
        </div>

        <div className="px-8 py-6 border-t border-navy-light bg-navy/40 flex justify-end relative z-10">
          <button onClick={onClose} className="px-8 py-3.5 font-bold bg-navy-light text-white rounded-2xl hover:bg-gray-700 transition-all duration-300 shadow-lg">
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}