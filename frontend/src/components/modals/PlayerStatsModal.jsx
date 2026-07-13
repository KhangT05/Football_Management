import { useState, useEffect } from 'react';
import { X, Trophy, Activity, Loader2, AlertCircle } from 'lucide-react';
import { statisticsApi } from '../../api/statisticsApi';

export default function PlayerStatsModal({ player, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // player prop here is the `tp` object from TeamDetail, or a `Player` object
  const playerId = player?.player_id || player?.id;
  const playerName = player?.player?.user?.name || player?.user?.name || player?.player?.name || player?.name || 'Cầu thủ';

  useEffect(() => {
    const fetchStats = async () => {
      if (!playerId) {
        setError('Không tìm thấy thông tin cầu thủ.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await statisticsApi.getPlayerCareer(playerId);
        const payload = (res && typeof res === 'object' && 'data' in res &&
          ('status' in res || 'timestamp' in res || 'code' in res))
          ? res.data
          : res;
        setStats(payload ?? null);
      } catch (err) {
        const status = err?.response?.status;
        const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
        if (status === 404) {
          setError('API thống kê chưa sẵn sàng (404) — kiểm tra lại route backend đã được deploy/regenerate chưa.');
        } else if (status) {
          setError(`Lỗi từ server (${status}): ${serverMsg || 'Không có chi tiết.'}`);
        } else {
          setError('Không thể kết nối tới server (network error / CORS). Kiểm tra backend có đang chạy không.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [playerId]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-navy border border-navy-light rounded-3xl shadow-2xl w-full max-w-3xl animate-scale-in flex flex-col overflow-hidden max-h-[90vh]">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-cyan-500/5 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy-light relative z-10 bg-navy-dark/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Thống Kê Chi Tiết
              </h3>
              <p className="text-sm font-semibold text-gray-400">{playerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto relative z-10 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-400 font-medium">Đang tải dữ liệu thống kê...</p>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-500/80" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          ) : !stats?.tournaments || stats.tournaments.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-navy-light flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 font-medium text-lg">Cầu thủ chưa có thống kê thi đấu nào.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {stats.tournaments.map((tournament) => (
                <div key={tournament.tournament_id} className="bg-navy-dark/50 border border-navy-light rounded-2xl overflow-hidden shadow-lg">
                  <div className="px-5 py-3 bg-navy-light/30 border-b border-navy-light flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-bold text-white uppercase tracking-wider">{tournament.tournament_name}</h4>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-navy-light/50">
                          <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Mùa giải</th>
                          <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider text-center">Số trận</th>
                          <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider text-center">Bàn thắng</th>
                          <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider text-center">Kiến tạo</th>
                          <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider text-center">Thẻ vàng</th>
                          <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider text-center">Thẻ đỏ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(tournament.seasons ?? []).map((season) => (
                          <tr key={season.season_id} className="border-b border-navy-light/30 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 font-bold text-white text-sm">
                              {season.season_name}
                            </td>
                            <td className="py-4 px-4 font-bold text-gray-300 text-center">
                              {season.matches_played}
                            </td>
                            <td className="py-4 px-4 font-black text-emerald-400 text-center">
                              {season.goals}
                            </td>
                            <td className="py-4 px-4 font-bold text-blue-400 text-center">
                              {season.assists}
                            </td>
                            <td className="py-4 px-4 font-bold text-yellow-400 text-center">
                              {season.yellow_cards}
                            </td>
                            <td className="py-4 px-4 font-bold text-red-400 text-center">
                              {season.red_cards}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}