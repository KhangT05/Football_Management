import { X, CreditCard, Info, Users, QrCode } from 'lucide-react';

/**
 * PaymentModal — Modal hướng dẫn thanh toán lệ phí giải.
 * Dùng trong trang MyTeam.
 *
 * @param {string}   teamName — Tên đội bóng để điền vào nội dung chuyển khoản
 * @param {Function} onClose
 */
export default function PaymentModal({ teamName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-neon" /> Thanh toán Lệ phí giải
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-emerald-300 font-bold mb-1">Đội bóng của bạn đã được duyệt!</p>
              <p className="text-gray-300">Vui lòng hoàn tất thanh toán lệ phí để chính thức có tên trong danh sách bốc thăm chia bảng.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* QR Transfer */}
            <div className="border border-navy-light bg-navy-dark rounded-xl p-5 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                <QrCode className="w-full h-full text-black" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Chuyển khoản Online</p>
                <p className="text-xs text-gray-400 mt-1">Quét mã QR qua ứng dụng ngân hàng hoặc Momo</p>
              </div>
              <div className="mt-2 text-xs font-mono bg-navy px-3 py-1.5 rounded text-gray-300 w-full">
                ND: {teamName} LE PHI
              </div>
            </div>

            {/* Direct payment */}
            <div className="border border-navy-light bg-navy-dark rounded-xl p-5 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-navy rounded-full border border-navy-light flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Thanh toán trực tiếp</p>
                <p className="text-xs text-gray-400 mt-1">Gặp BTC tại Văn phòng Khoa CNTT (Phòng E3.1)</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 italic">
            * Sau khi thanh toán, vui lòng liên hệ Admin qua Fanpage để được xác nhận.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 font-bold bg-navy-light text-white rounded-xl hover:bg-gray-700 transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
