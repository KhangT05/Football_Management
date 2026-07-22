import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import useToastStore from '../store/toastStore';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: {
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
    bar: 'bg-emerald-500',
  },
  error: {
    border: 'border-red-500/50',
    bg: 'bg-red-500/10',
    icon: 'text-red-400',
    bar: 'bg-red-500',
  },
  info: {
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/10',
    icon: 'text-blue-400',
    bar: 'bg-blue-500',
  },
  warning: {
    border: 'border-yellow-500/50',
    bg: 'bg-yellow-500/10',
    icon: 'text-yellow-400',
    bar: 'bg-yellow-500',
  },
};

function ToastItem({ toast }) {
  const { removeToast } = useToastStore(useShallow(state => ({ removeToast: state.removeToast })));
  const [visible, setVisible] = useState(false);

  const color = COLORS[toast.type] || COLORS.info;
  const Icon = ICONS[toast.type] || Info;

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => removeToast(toast.id), 300);
  };

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl shadow-black/50
        min-w-70 max-w-md relative overflow-hidden
        transition-all duration-300 ease-out
        ${color.border}
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
      style={{ backgroundColor: 'var(--color-navy)' }}
    >
      {/* Tint overlay */}
      <div className={`absolute inset-0 pointer-events-none ${color.bg}`} />

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${color.bar} animate-progress-bar z-10`}
        style={{ animationDuration: `${toast.duration}ms` }}
      />

      <Icon className={`w-5 h-5 shrink-0 mt-0.5 relative z-10 ${color.icon}`} />

      <div className="flex-1 min-w-0 relative z-10">
        {toast.title && <p className="text-sm font-bold text-white mb-0.5">{toast.title}</p>}
        <p className={`text-sm font-medium leading-relaxed text-wrap ${toast.title ? 'text-gray-300' : 'text-white'}`}>
          {toast.message}
        </p>
        {toast.details && (
          <ul 
            className="mt-2 text-xs text-gray-400 list-disc list-inside space-y-1 p-2.5 rounded-lg border border-black/5"
            style={{ backgroundColor: 'var(--color-navy-dark)' }}
          >
            {Array.isArray(toast.details) 
              ? toast.details.map((d, i) => <li key={i}>{d}</li>)
              : typeof toast.details === 'object'
                ? Object.entries(toast.details).map(([k, v]) => (
                    <li key={k} className="break-all">
                      <span className="font-semibold text-gray-300">{k}:</span> {Array.isArray(v) ? v.join(', ') : String(v)}
                    </li>
                  ))
                : <li>{String(toast.details)}</li>
            }
          </ul>
        )}
      </div>

      <button
        onClick={handleClose}
        className="shrink-0 text-gray-400 hover:text-white transition-colors ml-1 relative z-10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * ToastContainer - Đặt trong App.jsx để render toasts toàn cục
 */
export default function ToastContainer() {
  const { toasts } = useToastStore(useShallow(state => ({ toasts: state.toasts })));

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
