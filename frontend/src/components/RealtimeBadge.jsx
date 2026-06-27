import { useSocket } from '../hooks/useSocket';

export default function RealtimeBadge({ seasonId }) {
  const { connectionMode } = useSocket({ seasonId, enabled: !!seasonId });

  if (connectionMode === 'disconnected') return null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
      connectionMode === 'socket'
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        connectionMode === 'socket' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
      }`} />
      {connectionMode === 'socket' ? 'Live' : 'Auto-refresh'}
    </span>
  );
}
