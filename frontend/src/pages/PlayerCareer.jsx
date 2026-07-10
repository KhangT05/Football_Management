import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Trophy, UserX } from 'lucide-react';
import { statisticsApi } from '../api';

/**
 * View thuần — nhận data đã fetch sẵn, không tự gọi API.
 * Cho phép tái sử dụng ở nơi khác (modal, side-panel trong roster team...)
 * mà không phải mount lại 1 page fetch riêng.
 */
export function PlayerCareerView({ data }) {
    const [activeTournamentId, setActiveTournamentId] = useState(
        data?.tournaments?.[0]?.tournament_id ?? null
    );

    if (!data || data.tournaments.length === 0) {
        return (
            <div className="bg-navy/40 backdrop-blur-md border border-navy-light rounded-3xl p-12 text-center">
                <UserX className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Chưa có dữ liệu thi đấu</h3>
                <p className="text-gray-400">Cầu thủ này chưa tham gia mùa giải nào được ghi nhận.</p>
            </div>
        );
    }

    const activeTournament =
        data.tournaments.find(t => t.tournament_id === activeTournamentId) ?? data.tournaments[0];

    return (
        <div className="space-y-6">
            {/* Tabs theo giải đấu */}
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                {data.tournaments.map(t => (
                    <button
                        key={t.tournament_id}
                        onClick={() => setActiveTournamentId(t.tournament_id)}
                        className={`shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${t.tournament_id === activeTournament.tournament_id
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-navy/60 text-gray-400 border border-navy-light hover:text-white hover:border-blue-400/50'
                            }`}
                    >
                        <Trophy className="w-4 h-4 inline mr-2 -mt-0.5" />
                        {t.tournament_name}
                    </button>
                ))}
            </div>

            {/* Bảng theo mùa của giải đang chọn */}
            <div className="bg-navy/60 backdrop-blur-md border border-navy-light rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-navy-dark/60 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-navy-light/50">
                                <th className="py-4 px-6">Mùa giải</th>
                                <th className="py-4 px-6 text-center">Trận</th>
                                <th className="py-4 px-6 text-center">Bàn thắng</th>
                                <th className="py-4 px-6 text-center">Kiến tạo</th>
                                <th className="py-4 px-6 text-center">Thẻ vàng</th>
                                <th className="py-4 px-6 text-center">Thẻ đỏ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-light/50">
                            {activeTournament.seasons.map(s => (
                                <tr key={s.season_id} className="hover:bg-navy-light/20 transition-colors">
                                    <td className="py-4 px-6 font-bold text-white">{s.season_name}</td>
                                    <td className="py-4 px-6 text-center text-gray-300">{s.matches_played}</td>
                                    <td className="py-4 px-6 text-center text-neon font-bold">{s.goals}</td>
                                    <td className="py-4 px-6 text-center text-gray-300">{s.assists}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="text-yellow-400 font-bold">{s.yellow_cards}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="text-red-400 font-bold">{s.red_cards}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/**
 * Page-level: tự đọc :playerId từ route, tự fetch.
 * Route cần thêm: <Route path="/players/:playerId/career" element={<PlayerCareer />} />
 */
export default function PlayerCareer() {
    const { playerId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchCareer = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await statisticsApi.getPlayerCareer(playerId);
                const body = res?.data ?? res;
                const payload = body?.data ?? body;
                if (!cancelled) setData(payload ?? null);
            } catch (err) {
                console.error('Lỗi khi tải career stats:', err);
                if (!cancelled) setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại.');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchCareer();
        return () => { cancelled = true; };
    }, [playerId]);

    return (
        <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-bold text-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-neon animate-spin mb-4" />
                        <p className="text-gray-400 font-bold">Đang tải thống kê sự nghiệp...</p>
                    </div>
                ) : error ? (
                    <div className="bg-navy/40 backdrop-blur-md border border-red-500/30 rounded-3xl p-12 text-center">
                        <p className="text-red-400 font-bold">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                                {data?.player_name}
                            </h1>
                            <p className="text-gray-400 mt-1">Thống kê sự nghiệp theo giải đấu</p>
                        </div>
                        <PlayerCareerView data={data} />
                    </>
                )}
            </div>
        </div>
    );
}