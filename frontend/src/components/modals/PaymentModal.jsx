import { useState } from 'react';
import { X, CreditCard, Info, Users, QrCode, Loader2, ExternalLink, ChevronRight, ShieldCheck } from 'lucide-react';
import { paymentApi } from '../../api/paymentApi';

/**
 * PaymentModal — Modal thanh toán lệ phí tích hợp VNPay.
 * Dùng trong trang MyTeam.
 *
 * @param {string}   teamName      — Tên đội bóng (hiển thị trong nội dung)
 * @param {number}   seasonTeamId  — ID season_team để tạo link thanh toán
 * @param {number}   amount        — Số tiền lệ phí (VNĐ)
 * @param {Function} onClose
 */
export default function PaymentModal({ teamName, seasonTeamId, amount = 500000, onClose }) {
  const [isLoadingVnpay, setIsLoadingVnpay] = useState(false);
  const [vnpayError, setVnpayError] = useState('');

  const formatCurrency = (num) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const handleVnpayPayment = async () => {
    setIsLoadingVnpay(true);
    setVnpayError('');
    try {
      const res = await paymentApi.initiatePayment({
        season_team_id: seasonTeamId,
        return_url: `${window.location.origin}/thanh-toan/ket-qua`,
      });
      
      const paymentUrl = res.data?.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('Không nhận được URL thanh toán từ máy chủ.');
      }
    } catch (err) {
      setVnpayError(err?.response?.data?.message || 'Không thể kết nối tới cổng thanh toán. Vui lòng thử lại.');
    } finally {
      setIsLoadingVnpay(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden flex flex-col">

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
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-emerald-300 font-bold mb-1">Đội bóng của bạn đã được duyệt!</p>
              <p className="text-gray-300">Vui lòng hoàn tất thanh toán lệ phí để chính thức có tên trong danh sách bốc thăm chia bảng.</p>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-navy-dark border border-navy-light rounded-xl px-5 py-4 flex items-center justify-between">
            <span className="text-gray-400 text-sm">Số tiền cần thanh toán</span>
            <span className="text-white font-black text-xl">{formatCurrency(amount)}</span>
          </div>

          {/* ── VNPay CTA ── */}
          <div className="relative border border-blue-500/40 rounded-2xl overflow-hidden">
            {/* BG Glow */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-900/30 via-navy to-indigo-900/20 pointer-events-none" />
            <div className="absolute -top-8 -right-8 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 p-5">
              {/* Logo & Title */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg shrink-0">
                  <span className="font-black text-blue-600 text-base leading-tight tracking-tighter">VN</span>
                  <span className="font-black text-red-500 text-base leading-tight tracking-tighter">PAY</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">Thanh toán qua VNPAY</h4>
                  <p className="text-gray-400 text-xs mt-0.5">An toàn · Nhanh chóng · Tin cậy</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Bảo mật SSL</span>
                  </div>
                </div>
              </div>

              {/* Payment methods badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['ATM nội địa', 'Visa/MasterCard', 'QR Code', 'Ví điện tử'].map(method => (
                  <span key={method} className="text-xs text-gray-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                    {method}
                  </span>
                ))}
              </div>

              {/* Error message */}
              {vnpayError && (
                <div className="mb-3 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                  {vnpayError}
                </div>
              )}

              {/* Pay button */}
              <button
                onClick={handleVnpayPayment}
                disabled={isLoadingVnpay}
                className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 text-base"
              >
                {isLoadingVnpay ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang kết nối...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Thanh toán ngay
                    <ExternalLink className="w-4 h-4 opacity-70" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-navy-light" />
            <span className="text-gray-600 text-xs font-medium">hoặc thanh toán bằng</span>
            <div className="flex-1 border-t border-navy-light" />
          </div>

          {/* Alternative methods */}
          <div className="grid grid-cols-2 gap-3">
            {/* QR / Bank transfer */}
            <div className="border border-navy-light bg-navy-dark rounded-xl p-4 text-center flex flex-col items-center gap-2.5 hover:border-gray-500 transition-colors cursor-default group">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <QrCode className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Chuyển khoản</p>
                <p className="text-xs text-gray-500 mt-0.5">Quét mã QR ngân hàng</p>
              </div>
              <div className="text-xs font-mono bg-navy/80 border border-navy-light px-2 py-1 rounded text-gray-400 w-full truncate">
                ND: {teamName} LE PHI
              </div>
            </div>

            {/* In person */}
            <div className="border border-navy-light bg-navy-dark rounded-xl p-4 text-center flex flex-col items-center gap-2.5 hover:border-gray-500 transition-colors cursor-default group">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Trực tiếp</p>
                <p className="text-xs text-gray-500 mt-0.5">Gặp BTC tại văn phòng</p>
              </div>
              <div className="text-xs bg-navy/80 border border-navy-light px-2 py-1 rounded text-gray-500 w-full text-center">
                Phòng E3.1 – Khoa CNTT
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-600 italic px-4">
            * Đối với chuyển khoản thủ công, sau khi thanh toán vui lòng liên hệ Admin qua Fanpage để được xác nhận trong 24h.
          </p>
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
