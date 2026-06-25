/**
 * FormField — Label wrapper dùng chung cho tất cả admin forms.
 *
 * @param {string}    label    — Nhãn hiển thị
 * @param {boolean}   required — Hiển thị dấu * màu đỏ
 * @param {ReactNode} children — Input/Select/Textarea bên trong
 */
export default function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
