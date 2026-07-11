import { useEffect, useState } from 'react';
import { X, CreditCard, Info, QrCode, Users, Loader2, Wallet } from 'lucide-react';
import { paymentApi } from '../../api/paymentApi';

const DEFAULT_BANK = {
  BANK_ID: '970415', // Vietcombank
  ACCOUNT_NO: '108879326878', // Example — thay bằng số tài khoản thật
  ACCOUNT_NAME: 'NGUYEN HOANG HUY'
};

/**
 * PaymentModal — Modal thanh toán lệ phí tích hợp VNPay.
 * Dùng trong trang MyTeam.
 *
 * @param {string}   teamName      — Tên đội bóng (hiển thị trong nội dung)
 * @param {number}   seasonTeamId  — ID season_team để tạo link thanh toán
 * @param {number}   amount        — Số tiền lệ phí (VNĐ)
 * @param {Function} onClose
 */
export default function PaymentModal({ teamName, seasonTeamId, amount = 2000, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto polling — detect PAID status every 5s after user opened modal
  useEffect(() => {
    let interval;
    if (seasonTeamId) {
      interval = setInterval(async () => {
        try {
          const res = await paymentApi.getPaymentStatus(seasonTeamId);
          const paymentStatus = res?.data?.status;
          if (paymentStatus === 'PAID' || paymentStatus === 'confirmed') {
            onClose();
          }
        } catch {
          // Ignore polling errors silently
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [seasonTeamId, onClose]);

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
      alert(error.response?.data?.message || 'Có lỗi khi tạo giao dịch VNPay');
      setIsProcessing(false);
    }
  };

  const handleManualPayment = async () => {
    try {
      setIsProcessing(true);
      await paymentApi.initiateManualPayment({ season_team_id: seasonTeamId });
      alert('Đã gửi xác nhận thanh toán thủ công. Đang chờ Ban tổ chức duyệt!');
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi xác nhận thanh toán');
      setIsProcessing(false);
    }
  };

  const formatCurrency = (num) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">Thanh toán Lệ phí</h3>
              <p className="text-xs text-gray-500">{teamName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">

          {/* Notice */}
          <div className="bg-navy border border-navy-light p-4 rounded-xl flex items-start gap-3 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-emerald-400 font-bold mb-1">Đội bóng của bạn đã được duyệt!</p>
              <p className="text-gray-300">Vui lòng hoàn tất thanh toán lệ phí để chính thức có tên trong danh sách bốc thăm chia bảng.</p>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-navy-dark border border-navy-light rounded-xl px-5 py-4 flex items-center justify-between">
            <span className="text-gray-400 text-sm">Số tiền cần thanh toán</span>
            <span className="text-white font-black text-xl">{formatCurrency(amount)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* VNPay */}
            <div className="border border-navy-light bg-navy-dark rounded-xl p-5 flex flex-col gap-3 hover:border-blue-500/50 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold">VNPay</h4>
                  <p className="text-xs text-gray-400">Thanh toán tự động</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 flex-1">
                Thanh toán nhanh chóng qua cổng VNPay bằng thẻ ATM nội địa, QR Pay hoặc thẻ quốc tế.
              </p>
              <button
                onClick={handleVNPay}
                disabled={isProcessing}
                className="w-full mt-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Thanh toán bằng VNPay
              </button>
            </div>

            {/* Manual Payment */}
            <div className="border border-navy-light bg-navy-dark rounded-xl p-5 text-center flex flex-col items-center gap-3 hover:border-emerald-500/50 transition-colors group">
              <div className="w-full max-w-[180px] aspect-square bg-white rounded-xl flex items-center justify-center p-2 shadow-xl group-hover:scale-[1.02] transition-transform">
                <img
                  src={`https://img.vietqr.io/image/${DEFAULT_BANK.BANK_ID}-${DEFAULT_BANK.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent((teamName || 'TEAM') + ' LE PHI')}&accountName=${encodeURIComponent(DEFAULT_BANK.ACCOUNT_NAME)}`}
                  alt="VietQR"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div className="text-xs font-mono font-bold bg-navy/80 border border-navy-light px-3 py-2 rounded-lg text-emerald-400 w-full text-center truncate">
                ND: {teamName} LE PHI
              </div>
              <button
                onClick={handleManualPayment}
                disabled={isProcessing}
                className="w-full mt-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                Tôi đã chuyển khoản
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-sm bg-navy-light text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
