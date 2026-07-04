import { useState, useEffect } from 'react';
import { X, Save, Loader2, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { matchLineupApi } from '../../api';
import useToastStore from '../../store/toastStore';

export default function LineupBuilderModal({ match, teamId, roster, onClose, onSave }) {
  const toastError = useToastStore((state) => state.error);
  const toastSuccess = useToastStore((state) => state.success);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lineup, setLineup] = useState([]); // { player_id, is_starting, position, jersey_number }

  useEffect(() => {
    const fetchLineup = async () => {
      setIsLoading(true);
      try {
        const res = await matchLineupApi.getLineup(match.id, teamId);
        const data = (typeof res?.status === 'boolean') ? res.data : res;
        const lineupData = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setLineup(lineupData.map(p => ({
          player_id: p.player_id,
          is_starting: p.is_starting,
          position: p.position || 'MID',
          jersey_number: p.jersey_number || 0
        })));
      } catch (err) {
        console.error(err);
        // If not found or error, initialize empty
        setLineup([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLineup();
  }, [match.id, teamId]);

  const togglePlayerStatus = (player) => {
    setLineup(prev => {
      const existing = prev.find(p => p.player_id === player.player_id);
      if (existing) {
        if (existing.is_starting) {
          return prev.map(p => p.player_id === player.player_id ? { ...p, is_starting: false } : p);
        } else {
          return prev.filter(p => p.player_id !== player.player_id);
        }
      } else {
        return [...prev, {
          player_id: player.player_id,
          is_starting: true,
          position: player.position || 'MID',
          jersey_number: player.number || 0
        }];
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { team_id: teamId, players: lineup };
      await matchLineupApi.updateLineup(match.id, payload);
      toastsuccess('Đã lưu đội hình thành công!');
      if (onSave) onSave();
      onClose();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu đội hình.');
    } finally {
      setIsSaving(false);
    }
  };

  const starters = lineup.filter(p => p.is_starting);
  const subs = lineup.filter(p => !p.is_starting);

  const getPlayerDetails = (playerId) => roster.find(p => p.player_id === playerId);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy-dark/95 border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light bg-navy/40 shrink-0">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Users className="w-6 h-6 text-neon" /> Đội hình ra sân
            </h3>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Trận đấu: {match.home_team?.name || 'Đội nhà'} vs {match.away_team?.name || 'Đội khách'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 bg-navy/20">

          {/* Roster Selection */}
          <div className="flex-1 bg-navy/50 border border-navy-light rounded-3xl p-5 overflow-y-auto max-h-[500px] custom-scrollbar">
            <h4 className="text-lg font-black text-white mb-4 border-b border-navy-light pb-2">Danh sách đội bóng ({roster.length})</h4>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-neon animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {roster.map(player => {
                  const statusInfo = lineup.find(p => p.player_id === player.player_id);
                  const isStarting = statusInfo?.is_starting;
                  const isSub = statusInfo && !isStarting;

                  return (
                    <div
                      key={player.id}
                      onClick={() => togglePlayerStatus(player)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isStarting ? 'bg-emerald-500/10 border-emerald-500/30' :
                        isSub ? 'bg-blue-500/10 border-blue-500/30' :
                          'bg-navy-light/30 border-transparent hover:bg-navy-light/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-navy border border-navy-light flex items-center justify-center overflow-hidden font-black text-gray-300">
                          {player.avatar ? <img src={player.avatar} alt="" className="w-full h-full object-cover" /> : player.number}
                        </div>
                        <div>
                          <p className={`font-bold ${isStarting ? 'text-emerald-400' : isSub ? 'text-blue-400' : 'text-white'}`}>{player.name}</p>
                          <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Số {player.number} • {player.position}</p>
                        </div>
                      </div>
                      <div>
                        {isStarting && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {isSub && <div className="text-xs font-black text-blue-400 px-2 py-1 rounded-md bg-blue-500/20">Dự bị</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lineup View */}
          <div className="flex-1 space-y-6 flex flex-col">

            {/* Starters */}
            <div className="bg-navy/50 border border-emerald-500/20 rounded-3xl p-5 flex-1 overflow-y-auto max-h-[250px] custom-scrollbar shadow-[0_0_20px_rgba(16,185,129,0.05)]">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-4">
                <h4 className="text-lg font-black text-emerald-400 uppercase tracking-tight">Đội hình chính</h4>
                <span className={`text-xs font-black px-2 py-1 rounded-md ${starters.length === 7 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {starters.length}/7
                </span>
              </div>
              <div className="space-y-2">
                {starters.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-sm font-medium">Chưa chọn cầu thủ đá chính</div>
                )}
                {starters.map(p => {
                  const details = getPlayerDetails(p.player_id);
                  return (
                    <div key={p.player_id} className="flex items-center gap-3 p-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xs">
                        {p.jersey_number}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">{details?.name}</p>
                        <p className="text-[10px] text-emerald-500/70 uppercase font-black">{p.position}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Substitutes */}
            <div className="bg-navy/50 border border-blue-500/20 rounded-3xl p-5 flex-1 overflow-y-auto max-h-[200px] custom-scrollbar shadow-[0_0_20px_rgba(59,130,246,0.05)]">
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-2 mb-4">
                <h4 className="text-lg font-black text-blue-400 uppercase tracking-tight">Dự bị</h4>
                <span className="text-xs font-black bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">
                  {subs.length}
                </span>
              </div>
              <div className="space-y-2">
                {subs.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-sm font-medium">Chưa chọn cầu thủ dự bị</div>
                )}
                {subs.map(p => {
                  const details = getPlayerDetails(p.player_id);
                  return (
                    <div key={p.player_id} className="flex items-center gap-3 p-2 bg-blue-500/5 rounded-xl border border-blue-500/10">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-black flex items-center justify-center text-xs">
                        {p.jersey_number}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-300 text-sm">{details?.name}</p>
                        <p className="text-[10px] text-blue-500/70 uppercase font-black">{p.position}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-navy-light bg-navy/40 shrink-0 flex justify-between items-center">
          <div className="flex items-center gap-2 text-yellow-500/80 text-xs font-medium">
            <AlertCircle className="w-4 h-4" /> Bấm vào danh sách để chọn Đá chính / Dự bị / Bỏ chọn
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-3 font-bold text-gray-400 hover:text-white hover:bg-navy-light rounded-xl transition-all duration-300">
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || starters.length !== 7}
              className="px-8 py-3 font-black bg-neon text-black rounded-xl flex items-center gap-2 hover:bg-neon-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:-translate-y-0.5"
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
