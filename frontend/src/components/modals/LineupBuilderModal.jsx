import { useMemo } from 'react';
import { X, Save, Loader2, Users, AlertCircle } from 'lucide-react';
import useLineupSelection from '../../hooks/useLineupSelection';
import { mapPosition, getSquadLimit, POS_LABEL_VI } from '../../utils/position';
import PitchFormation from '../PitchFormation';

// roster (prop): [{ player_id, name, number, position, avatar }]
export default function LineupBuilderModal({ match, teamId, roster: rawRoster, onClose, onSave }) {
  const squadLimit = useMemo(() => getSquadLimit(match), [match]);

  // Normalize field names khớp với hook + PitchFormation (jersey_number, không phải number).
  const roster = useMemo(() => rawRoster.map(p => ({
    player_id: p.player_id,
    name: p.name,
    jersey_number: p.number,
    position: p.position,
    avatar: p.avatar,
  })), [rawRoster]);

  const {
    selections, isLoading, isSaving,
    startersCount, maxStarters,
    starters, substitutes,
    toggleLineupType, handleDropOnPitch, setCaptain, save,
  } = useLineupSelection({
    matchId: match?.id,
    teamId,
    roster,
    squadLimit,
    onSaved: () => { onSave?.(); onClose(); },
  });

  if (!match?.id) return null; // không render nếu thiếu match — chặn crash tại nguồn thay vì fail ở API call

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy-dark/95 border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">

        <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light bg-navy/40 shrink-0">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Users className="w-6 h-6 text-neon" /> Đội hình ra sân
            </h3>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              {match.home_team?.name || 'Đội nhà'} <span className="text-gray-600 mx-1">vs</span> {match.away_team?.name || 'Đội khách'}
            </p>
            {match.start_time && !isNaN(new Date(match.start_time).getTime()) && (
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(match.start_time).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 bg-navy/20">

          {/* Sơ đồ sân — kéo cầu thủ từ danh sách bên phải vào đúng hàng vị trí */}
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">Sơ đồ đội hình</h4>
              <span className={`text-xs font-black px-2 py-1 rounded-md ${startersCount === maxStarters ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {startersCount}/{maxStarters}
              </span>
            </div>

            {isLoading ? (
              <div className="aspect-[3/4] flex items-center justify-center bg-emerald-800/20 rounded-3xl border border-emerald-500/20">
                <Loader2 className="w-8 h-8 text-neon animate-spin" />
              </div>
            ) : (
              <PitchFormation
                starters={starters}
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
          <div className="flex-1 bg-navy/50 border border-navy-light rounded-3xl p-5 overflow-y-auto max-h-[600px] custom-scrollbar">
            <h4 className="text-sm font-black text-white mb-3 uppercase tracking-wider border-b border-navy-light pb-2">
              Danh sách đội bóng ({roster.length})
            </h4>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-neon animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {roster.map(player => {
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
                        // FIX: PitchFormation nhóm + check drop-target bằng p.position
                        // NGUYÊN BẢN ('forward'/'midfielder'/...), không phải short code
                        // từ mapPosition() ('FW'/'MID'/...). Trước đây set bằng mappedPos
                        // → key "app/position-FW" không bao giờ khớp "app/position-forward"
                        // mà PitchFormation check → dataTransfer.types.includes() luôn false
                        // → handleDragOver không preventDefault() → browser chặn drop toàn bộ.
                        e.dataTransfer.setData(`app/position-${player.position}`, '1');
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
                            Số {player.jersey_number} · {POS_LABEL_VI[mappedPos]}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleLineupType(player.player_id, 'starter')}
                          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${isStarter ? 'bg-emerald-500 text-white' : 'bg-navy-light text-gray-400 hover:text-emerald-400'}`}
                        >
                          Chính
                        </button>
                        <button
                          onClick={() => toggleLineupType(player.player_id, 'substitute')}
                          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${isSub ? 'bg-blue-500 text-white' : 'bg-navy-light text-gray-400 hover:text-blue-400'}`}
                        >
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

        <div className="px-8 py-5 border-t border-navy-light bg-navy/40 shrink-0 flex justify-between items-center">
          <div className="flex items-center gap-2 text-yellow-500/80 text-xs font-medium">
            <AlertCircle className="w-4 h-4" /> Kéo cầu thủ vào sân hoặc dùng nút Chính/Dự bị. Bấm ★ trên sân để chọn đội trưởng.
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-3 font-bold text-gray-400 hover:text-white hover:bg-navy-light rounded-xl transition-all">
              Hủy bỏ
            </button>
            <button
              onClick={save}
              disabled={isSaving || startersCount !== maxStarters}
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