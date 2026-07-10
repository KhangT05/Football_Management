import { STATUS_CONFIG } from "../../data/data";

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status || 'Không rõ',
    cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    dotCls: 'bg-gray-400',
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotCls}`} />
      {cfg.label}
    </span>
  );
}