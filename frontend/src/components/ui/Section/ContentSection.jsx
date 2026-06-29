import { useEffect, useState } from "react";
import MatchCard from "../../MatchCard";
import { ChevronRight, Loader2, CalendarX2 } from 'lucide-react';
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
    const [matches, setMatches] = useState({ live: [], upcoming: [], finished: [] });
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
                    // Fetch matches for the target season
                    const matchRes = await matchApi.getScheduleBySeason(targetSeason.id, { per_page: 100 }).catch(() => null);

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

                    const live = mappedMatches
                        .filter(m => m.status === 'LIVE')
                        .sort((a, b) => a.scheduled_at - b.scheduled_at)
                        .slice(0, 3);

                    const upcoming = mappedMatches
                        .filter(m => m.status === 'UPCOMING')
                        .sort((a, b) => a.scheduled_at - b.scheduled_at)
                        .slice(0, 3);

                    const finished = mappedMatches
                        .filter(m => m.status === 'FT')
                        .sort((a, b) => b.scheduled_at - a.scheduled_at)
                        .slice(0, 3);

                    setMatches({ live, upcoming, finished });
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

                <div className="w-full relative group">
                    {/* Glowing background blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-500/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

                    {/* Main Content: Latest Results Widget */}
                    <div className="bg-navy/40 backdrop-blur-3xl border border-navy-light/50 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none"></div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-navy-light/50 pb-8 relative z-10">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-neon uppercase tracking-tight">Kết quả & Lịch thi đấu</h2>
                                <p className="text-gray-400 text-sm md:text-base mt-2 font-medium">Cập nhật nhanh diễn biến mới nhất của mùa giải hiện tại</p>
                            </div>
                            <Link to="/lich-thi-dau" className="shrink-0 flex items-center gap-2 text-white text-sm font-bold bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all px-6 py-3.5 rounded-2xl group/link">
                                Xem tất cả <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 relative z-10">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                                <p className="text-gray-400 font-bold text-lg">Đang tải dữ liệu trận đấu...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 mt-10 relative z-10">
                                {/* Sắp diễn ra */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-base font-black text-white flex items-center gap-3 uppercase tracking-widest bg-linear-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500 pl-4 py-2 pr-8 rounded-r-2xl">
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"></div> 
                                            Sắp diễn ra
                                        </h3>
                                    </div>

                                    {matches.upcoming.length > 0 ? (
                                        <div className="flex flex-col gap-5">
                                            {matches.upcoming.map(match => (
                                                <MatchCard key={match.id} {...match} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-navy/30 border border-navy-light/40 rounded-3xl p-10 flex flex-col items-center justify-center text-center h-48 transition-all hover:bg-navy/40 group/card">
                                            <CalendarX2 className="w-10 h-10 text-gray-500/50 mb-4 group-hover/card:text-amber-500/50 transition-colors" />
                                            <p className="text-gray-400 font-medium">Không có trận đấu nào sắp tới</p>
                                        </div>
                                    )}
                                </div>

                                {/* Trực tiếp */}
                                <div className="space-y-6 relative">
                                    <div className="hidden lg:block absolute -left-6 top-0 bottom-0 w-px bg-linear-to-b from-navy-light/0 via-navy-light to-navy-light/0"></div>
                                    
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-base font-black text-white flex items-center gap-3 uppercase tracking-widest bg-linear-to-r from-red-500/20 to-transparent border-l-4 border-red-500 pl-4 py-2 pr-8 rounded-r-2xl">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-pulse"></div> 
                                            Đang diễn ra
                                        </h3>
                                    </div>
                                    
                                    {matches.live.length > 0 ? (
                                        <div className="flex flex-col gap-5">
                                            {matches.live.map(match => (
                                                <MatchCard key={match.id} {...match} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-navy/30 border border-navy-light/40 rounded-3xl p-10 flex flex-col items-center justify-center text-center h-48 transition-all hover:bg-navy/40 group/card">
                                            <CalendarX2 className="w-10 h-10 text-gray-500/50 mb-4 group-hover/card:text-red-500/50 transition-colors" />
                                            <p className="text-gray-400 font-medium">Không có trận đấu nào đang diễn ra</p>
                                        </div>
                                    )}
                                </div>

                                {/* Đã kết thúc */}
                                <div className="space-y-6 relative">
                                    <div className="hidden lg:block absolute -left-6 top-0 bottom-0 w-px bg-linear-to-b from-navy-light/0 via-navy-light to-navy-light/0"></div>
                                    
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-base font-black text-white flex items-center gap-3 uppercase tracking-widest bg-linear-to-r from-gray-500/20 to-transparent border-l-4 border-gray-400 pl-4 py-2 pr-8 rounded-r-2xl">
                                            <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div> 
                                            Đã kết thúc
                                        </h3>
                                    </div>

                                    {matches.finished.length > 0 ? (
                                        <div className="flex flex-col gap-5 opacity-90 hover:opacity-100 transition-opacity">
                                            {matches.finished.map(match => (
                                                <MatchCard key={match.id} {...match} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-navy/30 border border-navy-light/40 rounded-3xl p-10 flex flex-col items-center justify-center text-center h-48 transition-all hover:bg-navy/40 group/card">
                                            <CalendarX2 className="w-10 h-10 text-gray-500/50 mb-4 group-hover/card:text-gray-400 transition-colors" />
                                            <p className="text-gray-400 font-medium">Chưa có kết quả trận đấu nào</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thể thức thi đấu */}
                <TournamentFormats />
            </div>
        </section>
    )
}