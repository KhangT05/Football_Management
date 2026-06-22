import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

/**
 * ConfirmDeleteModal — Component xác nhận xóa dùng chung cho toàn bộ admin pages.
 *
 * @param {string}   title       — Tiêu đề modal (mặc định: "Xác nhận xóa?")
 * @param {string}   message     — Nội dung mô tả (có thể chứa JSX)
 * @param {string}   confirmText — Text nút xác nhận (mặc định: "Xóa")
 * @param {Function} onConfirm   — Callback khi xác nhận
 * @param {Function} onCancel    — Callback khi hủy
 * @param {boolean}  isDeleting  — Đang xử lý xóa
 * @param {'red'|'orange'} variant — Màu sắc modal
 */
export default function ConfirmDeleteModal({
  title = 'Xác nhận xóa?',
  message,
  confirmText = 'Xóa',
  onConfirm,
  onCancel,
  isDeleting = false,
  variant = 'red',
}) {
  const borderColor = variant === 'orange' ? 'border-orange-500/30' : 'border-red-500/30';
  const iconBg = variant === 'orange' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-red-500/10 border-red-500/30';
  const iconColor = variant === 'orange' ? 'text-orange-400' : 'text-red-400';
  const btnColor = variant === 'orange' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className={`relative bg-navy border ${borderColor} rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4 animate-slide-up`}>
        <div className={`w-14 h-14 rounded-full ${iconBg} border flex items-center justify-center`}>
          <AlertTriangle className={`w-7 h-7 ${iconColor}`} />
        </div>
        <div className="text-center">
          <h4 className="text-lg font-black text-white mb-1">{title}</h4>
          {message && (
            typeof message === 'string'
              ? <p className="text-sm text-gray-400">{message}</p>
              : <div className="text-sm text-gray-400">{message}</div>
          )}
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-bold bg-navy-light text-gray-300 hover:text-white border border-navy-light transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`flex-1 py-2.5 rounded-xl font-bold ${btnColor} text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-70`}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
