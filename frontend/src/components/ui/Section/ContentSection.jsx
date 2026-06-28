import { useEffect, useState } from "react";
import MatchCard from "../../MatchCard";
import { ChevronRight, BarChart, Trophy, Loader2, CalendarX2 } from 'lucide-react';
import { Link } from "react-router-dom";
import BannerSection from "./BannerSection";
import TournamentFormats from "./TournamentFormats";
import { seasonApi, matchApi, teamApi } from "../../../api";
import useTeamStore from "../../../store/teamStore";

// Helper to format date relative to today
function formatMatchTime(dateString) {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    const now = new Date();
    
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear();
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return `Hôm nay, ${timeStr}`;
    if (isTomorrow) return `Ngày mai, ${timeStr}`;
    if (isYesterday) return `Hôm qua, ${timeStr}`;
    
    return `${date.toLocaleDateString('vi-VN')} ${timeStr}`;
}

// Helper to extract array data from paginated response
function extractItems(res) {
    if (!res) return [];
    const payload = typeof res?.status === 'boolean' ? res.data : res;
    return Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
}

export default function ContentSection() {
    const [matches, setMatches] = useState({ liveUpcoming: [], finished: [] });
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                // Fetch seasons and teams to get context
                const [seasonRes, teamRes] = await Promise.all([
                    seasonApi.getAll({ per_page: 10 }).catch(() => null),
                    teamApi.getTeams({ per_page: 500 }).catch(() => null)
                ]);
                
                if (cancelled) return;

                const seasons = extractItems(seasonRes);
                let teams = extractItems(teamRes);

                // Luôn chọn mùa giải mới nhất (nằm ở đầu mảng) cho bảng xếp hạng và lịch
                const targetSeason = seasons[0];

                if (teams.length === 0 && targetSeason?.id) {
                    await useTeamStore.getState().fetchPublicTeamsBySeason(targetSeason.id);
                    teams = useTeamStore.getState().teams;
                }

                const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]));
                
                if (targetSeason?.id) {
                    // Fetch matches and standings for the target season
                    const [matchRes, standingsRes] = await Promise.all([
                        matchApi.getScheduleBySeason(targetSeason.id, { per_page: 100 }).catch(() => null),
                        seasonApi.getStandings(targetSeason.id).catch(() => null)
                    ]);

                    if (cancelled) return;

                    // -- Process Matches --
                    const rawMatches = extractItems(matchRes);
                    const mappedMatches = rawMatches.map(m => ({
                        id: m.id,
                        status: m.status === 'ongoing' ? 'LIVE' : (m.status === 'completed' ? 'FT' : 'UPCOMING'),
                        time: formatMatchTime(m.scheduled_at),
                        teamA: teamMap[m.home_team_id] || `Đội ${m.home_team_id}`,
                        teamB: teamMap[m.away_team_id] || `Đội ${m.away_team_id}`,
                        scoreA: m.home_score ?? 0,
                        scoreB: m.away_score ?? 0,
                        isUpcoming: m.status === 'scheduled',
                        scheduled_at: new Date(m.scheduled_at || 0).getTime()
                    }));

                    const liveUpcoming = mappedMatches
                        .filter(m => m.status === 'LIVE' || m.status === 'UPCOMING')
                        .sort((a, b) => a.scheduled_at - b.scheduled_at)
                        .slice(0, 3); // Hiện 3 kết quả gần nhất

                    const finished = mappedMatches
                        .filter(m => m.status === 'FT')
                        .sort((a, b) => b.scheduled_at - a.scheduled_at)
                        .slice(0, 3); // Hiện 3 kết quả gần nhất

                    // -- Process Standings --
                    const stPayload = typeof standingsRes?.status === 'boolean' ? standingsRes.data : standingsRes;
                    const groups = Array.isArray(stPayload) ? stPayload : [];
                    const flatStandings = groups.flatMap(g => g.standings || [])
                        .map(row => ({
                            team_id: row.team_id,
                            team: teamMap[row.team_id] || row.team_name || `Đội ${row.team_id}`,
                            p: row.matches_played ?? row.played ?? 0,
                            pts: row.points ?? 0,
                            goal_difference: (row.goals_for ?? 0) - (row.goals_against ?? 0)
                        }))
                        .sort((a, b) => b.pts - a.pts || b.goal_difference - a.goal_difference); // Sort by pts then GD

                    // Assign ranks (Top 5 only)
                    const rankedStandings = flatStandings.slice(0, 5).map((row, i) => ({
                        ...row,
                        rank: i + 1,
                        isTop: i < 3
                    }));

                    setMatches({ liveUpcoming, finished });
                    setStandings(rankedStandings);
                }
            } catch (err) {
                console.warn('[ContentSection] Failed to fetch dashboard data:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();
        return () => { cancelled = true; };
    }, []);

    return(
        <section className="py-24 bg-navy-dark relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-navy-light to-transparent"></div>
            <div className="absolute -top-40 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
            
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Banner Section */}
                <BannerSection />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                    
                    {/* Main Content: Latest Results Widget */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-end justify-between border-b border-navy-light pb-4">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Kết quả & Lịch thi đấu</h2>
                                <p className="text-gray-400 text-sm mt-1">Cập nhật nhanh diễn biến mới nhất của mùa giải hiện tại</p>
                            </div>
                            <Link to="/lich-thi-dau" className="hidden sm:flex items-center gap-2 text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-xl">
                                Xem tất cả <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-navy/30 rounded-3xl border border-navy-light/50 backdrop-blur-sm">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                                <p className="text-gray-400 font-medium">Đang tải dữ liệu trận đấu...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2.5 uppercase tracking-wider bg-navy-dark border border-navy-light px-4 py-2 rounded-xl shadow-sm w-fit">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div> Trực tiếp / Sắp tới
                                    </h3>
                                    {matches.liveUpcoming.length > 0 ? (
                                        <div className="flex flex-col gap-4">
                                            {matches.liveUpcoming.map(match => (
                                                <MatchCard key={match.id} {...match} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-navy/50 border border-navy-light/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                                            <CalendarX2 className="w-8 h-8 text-gray-500 mb-3" />
                                            <p className="text-gray-400 text-sm">Không có trận đấu nào sắp tới</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-5">
                                    <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2.5 uppercase tracking-wider bg-navy-dark border border-navy-light px-4 py-2 rounded-xl shadow-sm w-fit">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div> Đã kết thúc
                                    </h3>
                                    {matches.finished.length > 0 ? (
                                        <div className="flex flex-col gap-4 opacity-90 hover:opacity-100 transition-opacity">
                                            {matches.finished.map(match => (
                                                <MatchCard key={match.id} {...match} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-navy/50 border border-navy-light/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                                            <CalendarX2 className="w-8 h-8 text-gray-500 mb-3" />
                                            <p className="text-gray-400 text-sm">Chưa có kết quả trận đấu nào</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <Link to="/lich-thi-dau" className="sm:hidden w-full flex items-center justify-center gap-2 text-blue-400 text-sm font-bold bg-navy border border-navy-light py-3 rounded-xl mt-4">
                            Xem toàn bộ lịch thi đấu <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Sidebar: Mini Leaderboard */}
                    <div className="lg:col-span-1">
                        <div className="bg-navy/80 backdrop-blur-xl border border-navy-light rounded-3xl p-6 lg:p-8 shadow-2xl shadow-black/40 relative overflow-hidden h-full flex flex-col group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-colors duration-500"></div>
                            
                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                    <BarChart className="w-5 h-5 text-blue-400" />
                                </div>
                                Bảng xếp hạng
                            </h3>
                            
                            <div className="flex-1 relative z-10">
                                {loading ? (
                                    <div className="flex items-center justify-center h-40">
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    </div>
                                ) : standings.length > 0 ? (
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead>
                                            <tr className="border-b border-navy-light text-xs font-bold uppercase tracking-wider text-gray-500">
                                                <th className="pb-3 px-2 font-medium">Hạng</th>
                                                <th className="pb-3 px-2 font-medium">Đội bóng</th>
                                                <th className="pb-3 px-2 text-center font-medium">P</th>
                                                <th className="pb-3 px-2 text-right font-medium">Điểm</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-navy-light/50">
                                            {standings.map((row, i) => (
                                                <tr key={i} className="group/row hover:bg-navy-light/20 transition-colors">
                                                    <td className="py-4 px-2">
                                                        {row.rank === 1 ? (
                                                            <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                                                                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                                                            </div>
                                                        ) : row.rank === 2 ? (
                                                            <div className="w-7 h-7 rounded-full bg-gray-300/20 border border-gray-300/50 flex items-center justify-center">
                                                                <Trophy className="w-3.5 h-3.5 text-gray-300" />
                                                            </div>
                                                        ) : row.rank === 3 ? (
                                                            <div className="w-7 h-7 rounded-full bg-amber-600/20 border border-amber-600/50 flex items-center justify-center">
                                                                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-7 h-7 rounded-full bg-navy-dark flex items-center justify-center font-bold text-gray-500 text-xs">
                                                                {row.rank}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className={`py-4 px-2 font-bold ${row.isTop ? 'text-white' : 'text-gray-300'} truncate max-w-[120px]`}>{row.team}</td>
                                                    <td className="py-4 px-2 text-center text-gray-500">{row.p}</td>
                                                    <td className="py-4 px-2 text-right">
                                                        <span className={`px-2 py-1 rounded-md font-bold text-sm ${row.isTop ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400'}`}>
                                                            {row.pts}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-center">
                                        <p className="text-gray-500 text-sm">Chưa có dữ liệu xếp hạng</p>
                                    </div>
                                )}
                            </div>
                            
                            <Link to="/bang-xep-hang" className="w-full mt-6 py-3.5 rounded-2xl bg-linear-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-blue-400 text-sm font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn relative z-10">
                                Xem bảng xếp hạng đầy đủ <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                    
                </div>

                {/* Thể thức thi đấu */}
                <TournamentFormats />
            </div>
        </section>
    )
}