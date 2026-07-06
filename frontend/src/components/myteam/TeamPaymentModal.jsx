import { useEffect } from 'react';
import { CreditCard, X, Info, QrCode, Users, ExternalLink, Loader2 } from 'lucide-react';
import { paymentApi } from '../../api';
import useToastStore from '../../store/toastStore';

const DEFAULT_BANK = {
  BANK_ID: '970415', // ID-Bank (https://api.vietqr.io/v2/banks)
  ACCOUNT_NO: '108879326878', // STK Thật
  ACCOUNT_NAME: 'NGUYEN HOANG HUY' //Tên TK Thật
};

export default function TeamPaymentModal({ teamName, seasonTeamId, amount = 1400000, onClose }) {
  const toast = useToastStore();

  // Auto polling status
  useEffect(() => {
    let interval;
    if (seasonTeamId) {
      interval = setInterval(async () => {
        try {
          const res = await paymentApi.getPaymentStatus(seasonTeamId);
          // res = ApiResponseShape: res.data = PaymentRow, res.data.status = PaymentStatus enum
          const paymentStatus = res?.data?.status;
          if (paymentStatus === 'PAID') {
            toast.success('Thanh toán thành công! Trạng thái đã được cập nhật.');
            onClose();
          }
        } catch (error) {
          console.log(error);
          // Ignore polling errors
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [seasonTeamId, onClose, toast]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-navy-dark/95 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-2xl animate-scale-in flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-navy-light bg-navy/40 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
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



          <div className="grid grid-cols-1 gap-5">
            {/* VietQR – bank transfer */}
            <div className="border border-navy-light bg-navy/50 rounded-4xl p-6 text-center flex flex-col items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 group">
              {/* Real VietQR image */}
              <div className="w-full max-w-[300px] aspect-square bg-white rounded-3xl flex items-center justify-center p-3 shadow-xl group-hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={`https://img.vietqr.io/image/${DEFAULT_BANK.BANK_ID}-${DEFAULT_BANK.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent((teamName || 'TEAM') + ' LE PHI')}&accountName=${encodeURIComponent(DEFAULT_BANK.ACCOUNT_NAME)}`}
                  alt="VietQR chuyển khoản"
                  className="w-full h-full object-contain rounded-2xl"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                  <QrCode className="w-20 h-20 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400 font-medium mt-1">Quét mã qua ứng dụng ngân hàng</p>
              </div>
              <div className="text-xs font-mono font-bold bg-navy-dark px-4 py-3 rounded-xl border border-navy-light text-emerald-400 w-full text-center">
                ND: {teamName} LE PHI
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

        <div className="px-4 py-3 border-t border-navy-light bg-navy/40 flex justify-end relative z-10">
          <button onClick={onClose} className="px-6 py-3 font-bold bg-navy-light text-white rounded-2xl hover:bg-gray-700 transition-all duration-300 shadow-lg">
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}