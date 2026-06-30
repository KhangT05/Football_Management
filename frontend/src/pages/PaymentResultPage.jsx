import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Home, ReceiptText, AlertTriangle } from 'lucide-react';
import { paymentApi } from '../api/paymentApi';

/**
 * PaymentResultPage — Trang kết quả sau khi VNPay callback về
 *
 * URL pattern: /thanh-toan/ket-qua?vnp_ResponseCode=00&vnp_TxnRef=...&...
 */
export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'failed' | 'error'
  const [txnInfo, setTxnInfo] = useState(null);

  const responseCode = searchParams.get('vnp_ResponseCode');
  const txnRef = searchParams.get('vnp_TxnRef');
  const amount = searchParams.get('vnp_Amount');
  const bankCode = searchParams.get('vnp_BankCode');
  const orderInfo = searchParams.get('vnp_OrderInfo');
  const payDate = searchParams.get('vnp_PayDate');

  useEffect(() => {
    const verify = async () => {
      if (!responseCode) {
        navigate('/');
        return;
      }

      try {
        const res = await paymentApi.verifyReturn(Object.fromEntries(searchParams));
        
        if (res.data?.is_verified && res.data?.is_success) {
          setStatus('success');
          setTxnInfo({
            txnRef,
            amount: amount ? parseInt(amount) / 100 : 0,
            bankCode,
            orderInfo,
            payDate: payDate
              ? `${payDate.slice(6, 8)}/${payDate.slice(4, 6)}/${payDate.slice(0, 4)} ${payDate.slice(8, 10)}:${payDate.slice(10, 12)}:${payDate.slice(12, 14)}`
              : null,
          });
        } else {
          setStatus('failed');
        }
      } catch {
        setStatus('error');
      }
    };

    verify();
  }, []);

  const formatCurrency = (num) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Loading */}
        {status === 'loading' && (
          <div className="bg-navy border border-navy-light rounded-3xl p-10 text-center shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-navy-light border-t-blue-500 animate-spin" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">Đang xác nhận giao dịch</h2>
            <p className="text-gray-400 text-sm">Vui lòng không đóng trang này...</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="bg-navy border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-br from-emerald-600/20 to-navy p-8 text-center border-b border-emerald-500/20">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                </div>
              </div>
              <h1 className="text-white font-black text-2xl">Thanh toán thành công!</h1>
              <p className="text-emerald-400 font-bold text-3xl mt-2">{formatCurrency(txnInfo?.amount || 0)}</p>
            </div>

            {/* Transaction details */}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <ReceiptText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm font-medium">Chi tiết giao dịch</span>
              </div>

              {[
                { label: 'Mã giao dịch', value: txnInfo?.txnRef },
                { label: 'Ngân hàng', value: txnInfo?.bankCode },
                { label: 'Nội dung', value: txnInfo?.orderInfo },
                { label: 'Thời gian', value: txnInfo?.payDate },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex justify-between items-center py-2 border-b border-navy-light last:border-0">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className="text-white text-sm font-medium text-right max-w-[55%] break-all">{value}</span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 space-y-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                <p className="text-emerald-400 text-sm font-medium">✓ Đội bóng của bạn đã được xác nhận tham gia giải đấu</p>
              </div>
              <Link
                to="/doi-cua-toi"
                className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center transition-colors"
              >
                Về trang đội bóng
              </Link>
              <Link
                to="/"
                className="block w-full py-3 bg-navy-light hover:bg-gray-700 text-gray-300 font-medium rounded-xl text-center transition-colors text-sm"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}

        {/* Failed */}
        {(status === 'failed' || status === 'error') && (
          <div className="bg-navy border border-red-500/30 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-br from-red-600/20 to-navy p-8 text-center border-b border-red-500/20">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center">
                  {status === 'error' ? (
                    <AlertTriangle className="w-12 h-12 text-amber-400" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-400" />
                  )}
                </div>
              </div>
              <h1 className="text-white font-black text-2xl">
                {status === 'error' ? 'Lỗi xác thực' : 'Thanh toán thất bại'}
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                {status === 'error'
                  ? 'Không thể xác minh giao dịch từ máy chủ. Vui lòng liên hệ Admin.'
                  : 'Giao dịch bị huỷ hoặc không thành công. Vui lòng thử lại.'}
              </p>
            </div>

            <div className="p-6 space-y-3">
              {txnRef && (
                <div className="flex justify-between items-center py-2 border-b border-navy-light">
                  <span className="text-gray-400 text-sm">Mã tham chiếu</span>
                  <span className="text-white text-sm font-mono">{txnRef}</span>
                </div>
              )}
              {responseCode && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-sm">Mã lỗi VNPay</span>
                  <span className="text-red-400 text-sm font-mono">{responseCode}</span>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-center transition-colors"
              >
                Thử lại
              </button>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 w-full py-3 bg-navy-light hover:bg-gray-700 text-gray-300 font-medium rounded-xl text-center transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
