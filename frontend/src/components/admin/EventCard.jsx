import { Clock, Trash2 } from 'lucide-react';

/**
 * EventCard — Card hiển thị 1 sự kiện trận đấu (bàn thắng, thẻ vàng, thẻ đỏ).
 * Dùng trong trang UpdateResults (admin).
 */
export default function EventCard({ evt, players, onUpdate, onRemove }) {
  const getEventStyle = (type) => {
    switch (type) {
      case 'goal': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'yellow': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'red': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow': return '🟨';
      case 'red': return '🟥';
      default: return '❓';
    }
  };

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border relative group transition-all ${getEventStyle(evt.type)}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          {getEventIcon(evt.type)} {evt.type === 'goal' ? 'Bàn thắng' : evt.type === 'yellow' ? 'Thẻ vàng' : 'Thẻ đỏ'}
        </span>
        <button
          onClick={() => onRemove(evt.id)}
          className="w-6 h-6 bg-navy border border-red-500/40 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          title="Xóa sự kiện"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <select
        value={evt.player}
        onChange={e => onUpdate(evt.id, 'player', e.target.value)}
        className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none focus:border-neon"
      >
        <option value="">Chọn cầu thủ...</option>
        {players.map(p => (
          <option key={p.id} value={String(p.id)}>
            {p.name || p.player?.name} ({p.jersey_number ?? p.number ?? '?'})
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 opacity-70 shrink-0" />
        <input
          type="number"
          min="1" max="120"
          placeholder="Phút"
          value={evt.minute}
          onChange={e => onUpdate(evt.id, 'minute', e.target.value)}
          className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none text-center font-bold focus:border-neon"
        />
        <span className="text-xs opacity-70 shrink-0">'</span>
      </div>
    </div>
  );
}
