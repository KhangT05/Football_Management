import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { POSITION_ORDER, POS_LABEL_SHORT } from '../utils/position';

export default function PitchFormation({ starters, formation, onRemove, onSetCaptain, onDropPlayer }) {
    const [dragOverRow, setDragOverRow] = useState(null);

    const grouped = starters.reduce((acc, p) => {
        const row = POS_LABEL_SHORT[p.position] ? p.position : 'midfielder';
        (acc[row] ||= []).push(p);
        return acc;
    }, {});

    const handleDragOver = (rowKey, isFull) => (e) => {
        if (isFull) return; // FIX: sân đã đủ quân ở hàng này — không cho preventDefault → browser tự chặn drop
        if (e.dataTransfer.types.includes(`app/position-${rowKey}`)) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDragOverRow(rowKey);
        }
    };

    const handleDragLeave = (rowKey) => () => {
        setDragOverRow(prev => (prev === rowKey ? null : prev));
    };

    const handleDrop = (rowKey, isFull) => (e) => {
        e.preventDefault();
        setDragOverRow(null);
        if (isFull) return;
        if (!e.dataTransfer.types.includes(`app/position-${rowKey}`)) return;
        const playerId = e.dataTransfer.getData('app/player-id');
        if (playerId && onDropPlayer) onDropPlayer(playerId, rowKey);
    };

    return (
        <div className="relative w-full aspect-[3/4] bg-emerald-800/40 rounded-3xl border border-emerald-500/30 overflow-hidden">
            <div className="absolute inset-4 border-2 border-white/20 rounded-xl" />
            <div className="absolute top-1/2 left-4 right-4 border-t-2 border-white/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/20" />

            <div className="relative h-full flex flex-col justify-between py-8">
                {POSITION_ORDER.map(({ key, label }) => {
                    const rowPlayers = grouped[key] || [];
                    const limit = formation?.[key]; // NEW — số slot đúng theo sơ đồ sân, undefined nếu không truyền formation
                    const isFull = limit != null && rowPlayers.length >= limit;

                    return (
                        <div
                            key={key}
                            onDragOver={handleDragOver(key, isFull)}
                            onDragLeave={handleDragLeave(key)}
                            onDrop={handleDrop(key, isFull)}
                            className={`flex justify-center items-center gap-4 flex-wrap px-4 py-2 min-h-[5.5rem] rounded-xl transition-colors ${dragOverRow === key ? 'bg-blue-400/20 ring-2 ring-blue-400/60' : ''
                                } ${isFull ? 'bg-emerald-500/5' : ''}`}
                        >
                            {rowPlayers.length === 0 && (
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                                    {label}{limit != null && ` (0/${limit})`} — kéo cầu thủ vào đây
                                </span>
                            )}
                            {rowPlayers.map(p => {
                                const displayName = (p.name || '').trim() || `#${p.player_id}`;
                                return (
                                    <div key={p.player_id} className="flex flex-col items-center group relative w-20">
                                        <button
                                            onClick={() => onSetCaptain(p.player_id)}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-2 shadow-lg
                          ${p.is_captain ? 'bg-amber-400 border-amber-200 text-black' : 'bg-blue-600 border-blue-300 text-white'}`}
                                        >
                                            {p.jersey_number ?? p.player_id}
                                        </button>
                                        {p.is_captain && <Star className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 fill-current" />}
                                        <span
                                            className="mt-1 w-full max-w-full inline-block break-words text-[10px] font-black text-white text-center leading-snug px-1.5 py-0.5 rounded bg-black/80"
                                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
                                            title={displayName}
                                        >
                                            {displayName}
                                        </span>
                                        <span className="text-[9px] font-bold text-white/70 mt-0.5">
                                            {POS_LABEL_SHORT[p.position]}{limit != null && ` ${rowPlayers.length}/${limit}`}
                                        </span>
                                        <button
                                            onClick={() => onRemove(p.player_id)}
                                            className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"
                                        >
                                            <X className="w-2.5 h-2.5 text-white" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}