import { Clock, Trash2, ArrowRight } from 'lucide-react';

/**
 * EventCard — Card hiển thị 1 sự kiện trận đấu (bàn thắng, thẻ vàng, thẻ đỏ, thay người).
 * Dùng trong trang UpdateResults (admin).
 */
export default function EventCard({ evt, players, lineup, allEvents, onUpdate, onRemove }) {
  const getEventStyle = (type) => {
    switch (type) {
      case 'goal': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'yellow': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'red': return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'substitution': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow': return '🟨';
      case 'red': return '🟥';
      case 'substitution': return '🔄';
      default: return '❓';
    }
  };

  const getEventTitle = (type) => {
    switch (type) {
      case 'goal': return 'Bàn thắng';
      case 'yellow': return 'Thẻ vàng';
      case 'red': return 'Thẻ đỏ';
      case 'substitution': return 'Thay người';
      default: return 'Sự kiện';
    }
  };

  // Determine current players on field and on bench
  let starters = players;
  let subs = [];

  if (lineup && lineup.length > 0) {
    const starterIds = lineup.filter(l => l.lineup_type === 'starter').map(l => String(l.player_id));
    const subIds = lineup.filter(l => l.lineup_type === 'substitute').map(l => String(l.player_id));
    
    starters = players.filter(p => starterIds.includes(String(p.id)) || starterIds.includes(String(p.player?.id)));
    subs = players.filter(p => subIds.includes(String(p.id)) || subIds.includes(String(p.player?.id)));
  }

  let currentOnFieldIds = new Set(starters.map(p => String(p.id)));
  let currentBenchIds = new Set(subs.map(p => String(p.id)));

  if (allEvents) {
    for (const e of allEvents) {
      if (e.id === evt.id) break;
      if (e.type === 'substitution') {
        if (e.playerOut) {
          currentOnFieldIds.delete(String(e.playerOut));
          currentBenchIds.add(String(e.playerOut));
        }
        if (e.playerIn) {
          currentBenchIds.delete(String(e.playerIn));
          currentOnFieldIds.add(String(e.playerIn));
        }
      }
    }
  }

  const onFieldPlayers = players.filter(p => currentOnFieldIds.has(String(p.id)));
  const benchPlayers = players.filter(p => currentBenchIds.has(String(p.id)));

  const renderPlayerOptions = (list) => {
    return list.map(p => {
      const name = p.name || p.player?.name || p.player?.user?.name || `Cầu thủ #${p.player_id || p.id}`;
      return (
        <option key={p.id} value={String(p.id)}>
          {name} ({p.jersey_number ?? p.number ?? '?'})
        </option>
      );
    });
  };

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border relative group transition-all ${getEventStyle(evt.type)}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          {getEventIcon(evt.type)} {getEventTitle(evt.type)}
        </span>
        <button
          onClick={() => onRemove(evt.id)}
          className="w-6 h-6 bg-navy border border-red-500/40 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          title="Xóa sự kiện"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {evt.type === 'substitution' ? (
        <div className="flex flex-col gap-2 bg-navy-dark/30 p-2 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-red-400 uppercase w-6 shrink-0">Ra</span>
            <select
              value={evt.playerOut}
              onChange={e => onUpdate(evt.id, 'playerOut', e.target.value)}
              className="w-full text-xs p-2 bg-navy border border-red-500/30 rounded-lg text-white outline-none focus:border-red-400"
            >
              <option value="">Chọn người ra sân...</option>
              {renderPlayerOptions(onFieldPlayers)}
              {/* Fallback if player was manually selected but not in list */}
              {evt.playerOut && !onFieldPlayers.find(p => String(p.id) === String(evt.playerOut)) && (
                <option value={evt.playerOut}>Cầu thủ #{evt.playerOut} (đã chọn)</option>
              )}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase w-6 shrink-0">Vào</span>
            <select
              value={evt.playerIn}
              onChange={e => onUpdate(evt.id, 'playerIn', e.target.value)}
              className="w-full text-xs p-2 bg-navy border border-emerald-500/30 rounded-lg text-white outline-none focus:border-emerald-400"
            >
              <option value="">Chọn người vào sân...</option>
              {renderPlayerOptions(benchPlayers)}
              {evt.playerIn && !benchPlayers.find(p => String(p.id) === String(evt.playerIn)) && (
                <option value={evt.playerIn}>Cầu thủ #{evt.playerIn} (đã chọn)</option>
              )}
            </select>
          </div>
        </div>
      ) : (
        <select
          value={evt.player}
          onChange={e => onUpdate(evt.id, 'player', e.target.value)}
          className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none focus:border-neon"
        >
          <option value="">Chọn cầu thủ...</option>
          {lineup && lineup.length > 0 ? (
            <>
              <optgroup label="Đang đá">
                {renderPlayerOptions(onFieldPlayers)}
              </optgroup>
              <optgroup label="Dự bị">
                {renderPlayerOptions(benchPlayers)}
              </optgroup>
            </>
          ) : (
            renderPlayerOptions(players)
          )}
        </select>
      )}

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
