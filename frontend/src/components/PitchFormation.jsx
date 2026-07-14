import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { POSITION_ORDER, POS_LABEL_SHORT, PITCH_GOALKEEPER_COUNT } from '../utils/position';

// PitchFormation — sơ đồ đá chính kéo-thả.
// Chỉ hàng "goalkeeper" có giới hạn cứng (đúng PITCH_GOALKEEPER_COUNT = 1)
// vì đó là luật bóng đá bắt buộc. Các hàng DEF/MID/FW không có trần riêng —
// đội tự chọn sơ đồ chiến thuật, giới hạn TỔNG số đá chính (theo luật sân
// 5/7/11) được chặn ở tầng useLineupSelection (maxStarters), không phải ở đây.
export default function PitchFormation({ starters, onRemove, onSetCaptain, onDropPlayer }) {
    const [dragOverRow, setDragOverRow] = useState(null);

    const grouped = starters.reduce((acc, p) => {
        const row = POS_LABEL_SHORT[p.position] ? p.position : 'midfielder';
        (acc[row] ||= []).push(p);
        return acc;
    }, {});

    const isRowFull = (rowKey) => {
        if (rowKey !== 'goalkeeper') return false;
        return (grouped.goalkeeper || []).length >= PITCH_GOALKEEPER_COUNT;
    };

    const handleDragOver = (rowKey) => (e) => {
        if (isRowFull(rowKey)) return; // hàng thủ môn đã đủ — không preventDefault, browser tự chặn drop
        if (e.dataTransfer.types.includes(`app/position-${rowKey}`)) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDragOverRow(rowKey);
        }
    };

    const handleDragLeave = (rowKey) => () => {
        setDragOverRow(prev => (prev === rowKey ? null : prev));
    };

    const handleDrop = (rowKey) => (e) => {
        e.preventDefault();
        setDragOverRow(null);
        if (isRowFull(rowKey)) return;
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
                    const rowFull = isRowFull(key);

                    return (
                        <div
                            key={key}
                            onDragOver={handleDragOver(key)}
                            onDragLeave={handleDragLeave(key)}
                            onDrop={handleDrop(key)}
                            className={`flex justify-center items-center gap-4 flex-wrap px-4 py-2 min-h-[5.5rem] rounded-xl transition-colors ${dragOverRow === key ? 'bg-blue-400/20 ring-2 ring-blue-400/60' : ''
                                } ${rowFull ? 'bg-emerald-500/5' : ''}`}
                        >
                            {rowPlayers.length === 0 && (
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                                    {label}{key === 'goalkeeper' && ` (0/${PITCH_GOALKEEPER_COUNT})`} — kéo cầu thủ vào đây
                                </span>
                            )}
                            {rowPlayers.map(p => {
                                // FIX (blank pill): p.name có thể undefined/"" nếu payload kéo-thả
                                // thiếu field — trước đây không có fallback nào, pill trắng hoàn toàn.
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
                                        {/* FIX (không đọc được tên): trước đây "truncate" trên max-w-[70px]
                                            cắt gần hết tên có dấu, nhiều trường hợp gần như không còn ký
                                            tự nào hiển thị. Giờ bỏ truncate, cho chữ wrap tự nhiên (không
                                            line-clamp — từng gây mất chữ hoàn toàn khi kết hợp sai với
                                            block/inline-block ở nơi khác). Vẫn giữ nền đen mờ + text-shadow. */}
                                        <span
                                            className="mt-1 w-full max-w-full inline-block break-words text-[10px] font-black text-white text-center leading-snug px-1.5 py-0.5 rounded bg-black/80"
                                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
                                            title={displayName}
                                        >
                                            {displayName}
                                        </span>
                                        <span className="text-[9px] font-bold text-white/70 mt-0.5">
                                            {POS_LABEL_SHORT[p.position]}
                                            {key === 'goalkeeper' && ` ${rowPlayers.length}/${PITCH_GOALKEEPER_COUNT}`}
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