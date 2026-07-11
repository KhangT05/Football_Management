import { useEffect, useState } from 'react';
import { CreditCard, X, Info, QrCode, Users, ExternalLink, Loader2, Wallet } from 'lucide-react';
import { paymentApi } from '../../api';
import useToastStore from '../../store/toastStore';

const DEFAULT_BANK = {
  BANK_ID: '970415', // ID-Bank (https://api.vietqr.io/v2/banks)
  ACCOUNT_NO: '108879326878', // STK Thật
  ACCOUNT_NAME: 'NGUYEN HOANG HUY' //Tên TK Thật
};

export default function TeamPaymentModal({ teamName, seasonTeamId, amount = 2000, onClose }) {
  const toast = useToastStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto polling status
  useEffect(() => {
    let interval;
    if (seasonTeamId) {
      interval = setInterval(async () => {
        try {
          const res = await paymentApi.getPaymentStatus(seasonTeamId);
          const paymentStatus = res?.data?.status;
          if (paymentStatus === 'PAID' || paymentStatus === 'confirmed') {
            toast.success('Thanh toán thành công! Trạng thái đã được cập nhật.');
            onClose();
          }
        } catch (error) {
          console.log(error);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [seasonTeamId, onClose, toast]);

  const handleVNPay = async () => {
    try {
      setIsProcessing(true);
      const res = await paymentApi.initiatePayment({
        season_team_id: seasonTeamId,
        return_url: `${window.location.origin}/thanh-toan/ket-qua`
      });
      if (res?.data?.payment_url) {
        window.location.href = res.data.payment_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi khi tạo giao dịch VNPay');
      setIsProcessing(false);
    }
  };

  const handleManualPayment = async () => {
    try {
      setIsProcessing(true);
      await paymentApi.initiateManualPayment({ season_team_id: seasonTeamId });
      toast.success('Đã gửi xác nhận thanh toán thủ công. Đang chờ Ban tổ chức duyệt!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi khi xác nhận thanh toán');
      setIsProcessing(false);
    }
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* VNPay Option */}
            <div className="border border-navy-light bg-navy/50 rounded-4xl p-6 flex flex-col gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">VNPay</h4>
                  <p className="text-xs text-gray-400">Thanh toán tự động</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 flex-1">
                Thanh toán nhanh chóng qua cổng VNPay bằng thẻ ATM nội địa, QR Pay hoặc thẻ quốc tế.
              </p>
              <button
                onClick={handleVNPay}
                disabled={isProcessing}
                className="w-full mt-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                Thanh toán bằng VNPay
              </button>
            </div>

            {/* Manual Payment Option */}
            <div className="border border-navy-light bg-navy/50 rounded-4xl p-6 text-center flex flex-col items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 group">
              <div className="w-full max-w-[200px] aspect-square bg-white rounded-3xl flex items-center justify-center p-3 shadow-xl group-hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={`https://img.vietqr.io/image/${DEFAULT_BANK.BANK_ID}-${DEFAULT_BANK.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent((teamName || 'TEAM') + ' LE PHI')}&accountName=${encodeURIComponent(DEFAULT_BANK.ACCOUNT_NAME)}`}
                  alt="VietQR chuyển khoản"
                  className="w-full h-full object-contain rounded-2xl"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div className="text-xs font-mono font-bold bg-navy-dark px-3 py-2 rounded-xl border border-navy-light text-emerald-400 w-full text-center truncate">
                ND: {teamName} LE PHI
              </div>
              <button
                onClick={handleManualPayment}
                disabled={isProcessing}
                className="w-full mt-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                Tôi đã chuyển khoản
              </button>
            </div>
          </div>
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