import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * ConfirmModal — Modal xác nhận hành động (destructive hoặc non-destructive).
 * Dùng cho các thao tác cần xác nhận người dùng (khác với ConfirmDeleteModal chỉ dùng cho delete).
 *
 * @param {string}   title        — Tiêu đề modal
 * @param {string}   message      — Nội dung (hỗ trợ HTML qua dangerouslySetInnerHTML)
 * @param {Function} onConfirm    — Callback khi xác nhận
 * @param {Function} onCancel     — Callback khi hủy
 * @param {boolean}  isLoading    — Trạng thái đang xử lý
 * @param {boolean}  isDestructive — true = màu đỏ, false = màu xanh
 */
export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
  isDestructive = true,
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div
        className={`relative bg-navy border ${
          isDestructive ? 'border-red-500/30' : 'border-blue-500/30'
        } rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4`}
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            isDestructive
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
          }`}
        >
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="text-center">
          <h4 className="text-lg font-black text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: message }} />
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-bold bg-navy-light text-gray-300 hover:text-white border border-navy-light transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 text-white ${
              isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
