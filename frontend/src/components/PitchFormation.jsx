import { useState } from 'react';
import { Star, X } from 'lucide-react';

const POS_LABEL = { goalkeeper: 'TM', defender: 'HV', midfielder: 'TV', forward: 'TĐ' };

// Sân được vẽ từ trên (tiền đạo) xuống dưới (thủ môn).
const ROW_ORDER = [
    { key: 'forward', label: 'Tiền đạo' },
    { key: 'midfielder', label: 'Tiền vệ' },
    { key: 'defender', label: 'Hậu vệ' },
    { key: 'goalkeeper', label: 'Thủ môn' },
];

// starters: [{ player_id, name, jersey_number, position: 'goalkeeper'|'defender'|'midfielder'|'forward', is_captain }]
// onDropPlayer(playerId, rowPosition) — cha tự validate + set state, component này chỉ phát sự kiện.
export default function PitchFormation({ starters, onRemove, onSetCaptain, onDropPlayer }) {
    const [dragOverRow, setDragOverRow] = useState(null);

    const grouped = starters.reduce((acc, p) => {
        const row = POS_LABEL[p.position] ? p.position : 'midfielder';
        (acc[row] ||= []).push(p);
        return acc;
    }, {});

    // Chỉ cho phép drop nếu dataTransfer có mang type "app/position-<row>" —
    // type này chỉ được set khi cầu thủ được kéo đúng là vị trí của hàng đó
    // (xem onDragStart ở bảng danh sách cầu thủ). Nhờ đó GK chỉ thả được vào
    // hàng thủ môn, DEF chỉ thả được vào hàng hậu vệ, v.v.
    const handleDragOver = (rowKey) => (e) => {
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
        if (!e.dataTransfer.types.includes(`app/position-${rowKey}`)) return; // sai vị trí, bỏ qua
        const playerId = e.dataTransfer.getData('app/player-id');
        if (playerId && onDropPlayer) onDropPlayer(playerId, rowKey);
    };

    return (
        <div className="relative w-full aspect-[3/4] bg-emerald-800/40 rounded-3xl border border-emerald-500/30 overflow-hidden">
            {/* vạch sân */}
            <div className="absolute inset-4 border-2 border-white/20 rounded-xl" />
            <div className="absolute top-1/2 left-4 right-4 border-t-2 border-white/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/20" />

            <div className="relative h-full flex flex-col justify-between py-8">
                {ROW_ORDER.map(({ key, label }) => (
                    <div
                        key={key}
                        onDragOver={handleDragOver(key)}
                        onDragLeave={handleDragLeave(key)}
                        onDrop={handleDrop(key)}
                        className={`flex justify-center items-center gap-4 flex-wrap px-4 py-2 min-h-[4.5rem] rounded-xl transition-colors ${dragOverRow === key ? 'bg-blue-400/20 ring-2 ring-blue-400/60' : ''
                            }`}
                    >
                        {(grouped[key] || []).length === 0 && (
                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                                {label} — kéo cầu thủ vào đây
                            </span>
                        )}
                        {(grouped[key] || []).map(p => (
                            <div key={p.player_id} className="flex flex-col items-center group relative">
                                <button
                                    onClick={() => onSetCaptain(p.player_id)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-2 shadow-lg
                    ${p.is_captain ? 'bg-amber-400 border-amber-200 text-black' : 'bg-blue-600 border-blue-300 text-white'}`}
                                >
                                    {p.jersey_number ?? p.player_id}
                                </button>
                                {p.is_captain && <Star className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 fill-current" />}
                                <span className="text-[10px] text-white/80 font-bold mt-1 max-w-[64px] truncate">{p.name}</span>
                                <span className="text-[9px] text-white/50">{POS_LABEL[p.position]}</span>
                                <button
                                    onClick={() => onRemove(p.player_id)}
                                    className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"
                                >
                                    <X className="w-2.5 h-2.5 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}