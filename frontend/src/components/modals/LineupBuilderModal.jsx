import { useMemo, useState } from 'react';
import { X, Save, Loader2, Users, AlertCircle } from 'lucide-react';
import useLineupSelection from '../../hooks/useLineupSelection';
import { mapPosition, getPitchInfo, PITCH_LABEL_VI, POS_LABEL_VI } from '../../utils/position';
import PitchFormation from '../PitchFormation';

// roster (prop, đến từ bên trong useLineupSelection): [{ player_id, name, number, position, avatar }]
export default function LineupBuilderModal({ match, teamId, onClose, onSave }) {
  // Màu áo — chỉ là state hiển thị cục bộ trong modal, không cần lưu store
  // (mỗi lần mở modal chọn lại là hợp lý cho use-case này).
  const [jerseyColor, setJerseyColor] = useState('#3b82f6');

  // Chỉ dùng để hiện badge "Sân 5/7/11" trên header — giá trị thật sự chốt
  // giới hạn nằm trong starterReq (đã đọc pitch_type bên trong getStarterRequirement).
  const { pitchType } = useMemo(() => getPitchInfo(match), [match]);

  const {
    selections, isLoading, isSaving,
    startersCount, maxStarters,
    starters, substitutes, roster, canSave,
    toggleLineupType, handleDropOnPitch, setCaptain, save,
  } = useLineupSelection({
    matchId: match?.id,
    teamId,
    match,
    onSaved: () => { onSave?.(); onClose(); },
  });

  if (!match?.id) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy-dark/95 border border-navy-light rounded-[2.5rem] w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-navy-light bg-navy/40 shrink-0">
          <h3 className="text-2xl font-black text-white uppercase flex items-center gap-3 flex-wrap">
            <Users className="w-6 h-6 text-neon" /> Đội hình ra sân
            <span className="text-xs font-black bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-lg">
              {PITCH_LABEL_VI[pitchType] ?? pitchType}
            </span>
          </h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 bg-navy/20">

          {/* Sơ đồ sân — kéo cầu thủ từ danh sách bên phải vào đúng hàng vị trí.
              Đội tự chọn sơ đồ chiến thuật (DEF/MID/FW không bị ép tỷ lệ cố
              định), chỉ cần đủ tổng số theo luật sân + đúng 1 thủ môn. */}
          <div className="w-full md:w-2/5 min-w-[320px] max-w-105 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">Sơ đồ đội hình</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-navy border border-navy-light px-2 py-1 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Màu áo:</span>
                  <input
                    type="color"
                    value={jerseyColor}
                    onChange={(e) => setJerseyColor(e.target.value)}
                    className="w-5 h-5 p-0 border-0 rounded cursor-pointer bg-transparent"
                    title="Chọn màu áo"
                  />
                </div>
                <span className={`text-xs font-black px-2 py-1.5 rounded-md ${startersCount === maxStarters ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {startersCount}/{maxStarters}
                </span>
              </div>
            </div>
            {isLoading ? (
              <div className="aspect-3/4 flex items-center justify-center bg-emerald-800/20 rounded-3xl border border-emerald-500/20">
                <Loader2 className="w-8 h-8 text-neon animate-spin" />
              </div>
            ) : (
              <PitchFormation
                starters={starters}
                jerseyColor={jerseyColor}
                onRemove={pid => toggleLineupType(pid, 'starter')}
                onSetCaptain={setCaptain}
                onDropPlayer={handleDropOnPitch}
              />
            )}
            <div className="mt-4 bg-navy/50 border border-blue-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-blue-400 uppercase">Dự bị</span>
                <span className="text-xs font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md">{substitutes.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {substitutes.length === 0 && <span className="text-xs text-gray-500">Chưa chọn</span>}
                {substitutes.map(p => (
                  <span key={p.player_id} className="text-xs font-bold text-gray-300 bg-navy-light/50 px-2 py-1 rounded-lg">
                    {p.jersey_number} · {p.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Roster — vừa là nguồn kéo-thả vừa toggle Chính/Dự bị bằng nút */}
          <div className="flex-1 bg-navy/50 border border-navy-light rounded-3xl p-5 overflow-y-auto max-h-150 custom-scrollbar">
            <h4 className="text-sm font-black text-white mb-3 uppercase tracking-wider border-b border-navy-light pb-2">
              Danh sách đội bóng ({roster.length})
            </h4>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-neon animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {[...roster].sort((a, b) => {
                  const selA = selections[a.player_id]?.lineup_type;
                  const selB = selections[b.player_id]?.lineup_type;

                  const getWeight = (type) => {
                    if (type === 'starter') return 3;
                    if (type === 'substitute') return 2;
                    return 1;
                  };

                  const weightA = getWeight(selA);
                  const weightB = getWeight(selB);

                  // Đưa đá chính lên đầu, rồi dự bị, rồi chưa chọn
                  if (weightA !== weightB) return weightB - weightA;

                  // Nếu cùng loại, xếp theo số áo
                  return (parseInt(a.jersey_number) || 999) - (parseInt(b.jersey_number) || 999);
                }).map(player => {
                  const sel = selections[player.player_id];
                  const isStarter = sel?.lineup_type === 'starter';
                  const isSub = sel?.lineup_type === 'substitute';
                  const mappedPos = mapPosition(player.position);

                  return (
                    <div
                      key={player.player_id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('app/player-id', String(player.player_id));
                        e.dataTransfer.setData(`app/position-${mappedPos}`, '1');
                        e.dataTransfer.setData('text/plain', String(player.player_id)); // fallback cho Firefox
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${isStarter ? 'bg-emerald-500/10 border-emerald-500/30'
                        : isSub ? 'bg-blue-500/10 border-blue-500/30'
                          : 'bg-navy-light/30 border-transparent hover:bg-navy-light/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-navy border border-navy-light flex items-center justify-center overflow-hidden font-black text-gray-300 text-sm">
                          {player.avatar ? (
                            // FIX: <img> có draggable="true" mặc định của browser — nếu nhả
                            // chuột đúng lúc con trỏ nằm trên ảnh, browser sẽ dùng chính <img>
                            // làm drag source (kéo file ảnh) thay vì bubble lên onDragStart của
                            // div cha → setData không chạy → mất data ngay từ nguồn kéo.
                            <img src={player.avatar} alt="" draggable={false} className="w-full h-full object-cover" />
                          ) : player.jersey_number}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${isStarter ? 'text-emerald-400' : isSub ? 'text-blue-400' : 'text-white'}`}>{player.name}</p>
                          <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                            Số {player.jersey_number || '?'} · {POS_LABEL_VI[player.position]}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => toggleLineupType(player.player_id, 'starter')}
                          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${isStarter ? 'bg-emerald-500 text-white' : 'bg-navy-light text-gray-400 hover:text-emerald-400'}`}>
                          Chính
                        </button>
                        <button onClick={() => toggleLineupType(player.player_id, 'substitute')}
                          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${isSub ? 'bg-blue-500 text-white' : 'bg-navy-light text-gray-400 hover:text-blue-400'}`}>
                          Dự bị
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-3.5 border-t border-navy-light bg-navy/40 shrink-0 flex justify-between items-center">
          <div className="flex items-center gap-2 text-yellow-500/80 text-xs font-medium">
            <AlertCircle className="w-4 h-4" /> Kéo cầu thủ vào sân hoặc dùng nút Chính/Dự bị. Bấm ★ trên sân để chọn đội trưởng.
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-3 font-bold text-gray-400 hover:text-white hover:bg-navy-light rounded-xl transition-all">
              Hủy bỏ
            </button>
            <button
              onClick={save}
              disabled={isSaving || !canSave}
              className="px-8 py-3 font-black bg-neon text-black rounded-xl flex items-center gap-2 hover:bg-neon-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Lưu Đội Hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}