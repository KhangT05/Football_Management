import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

/**
 * AdminModal — Modal wrapper dùng chung cho toàn bộ admin pages.
 *
 * @param {string}      title     — Tiêu đề modal
 * @param {ReactNode}   icon      — Icon component (optional)
 * @param {string}      iconClass — Class màu sắc icon
 * @param {Function}    onClose   — Callback đóng modal
 * @param {ReactNode}   children  — Nội dung body
 * @param {ReactNode}   footer    — Nội dung footer (buttons)
 * @param {'sm'|'md'|'lg'|'xl'} size — Kích thước modal
 */
export default function AdminModal({
  title,
  icon: Icon,
  iconClass = 'text-neon',
  onClose,
  children,
  footer,
  size = 'md',
}) {
  const maxW = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size] ?? 'max-w-lg';

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full ${maxW} flex flex-col max-h-[90vh] animate-slide-up overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
            {Icon && <Icon className={`w-5 h-5 ${iconClass}`} />}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-navy-light bg-navy-dark shrink-0 flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
