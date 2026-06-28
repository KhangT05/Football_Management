import { useEffect, useState, useRef } from "react";
import { Search, Shield, Trophy, Users, Calendar, Swords, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { tournamentApi, teamApi, seasonApi, matchApi } from "../../../api";

/**
 * Animated counter hook — counts from 0 to target over duration ms.
 */
function useCountUp(target, duration = 1200) {
    const [count, setCount] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!target || target <= 0) { 
            rafRef.current = requestAnimationFrame(() => setCount(0)); 
            return; 
        }
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [target, duration]);

    return count;
}

/**
 * Helper: parse paginated response → extract meta.total
 */
function extractTotal(res) {
    const payload = typeof res?.status === 'boolean' ? res.data : res;
    return payload?.meta?.total ?? 0;
}

export default function BannerSection() {
    const [stats, setStats] = useState({
        tournaments: 0,
        teams: 0,
        seasons: 0,
        matches: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchStats() {
            try {
                // Fetch tournaments, teams, seasons concurrently (per_page=1 to minimize payload)
                const [tourRes, teamRes, seasonRes] = await Promise.all([
                    tournamentApi.getAll({ per_page: 1 }).catch(() => null),
                    teamApi.getTeams({ per_page: 1 }).catch(() => null),
                    seasonApi.getAll({ per_page: 1 }).catch(() => null),
                ]);

                const tourTotal = extractTotal(tourRes);
                const teamTotal = extractTotal(teamRes);
                const seasonTotal = extractTotal(seasonRes);

                // Try to get match count from the latest season
                let matchTotal = 0;
                if (seasonRes) {
                    const seasonPayload = typeof seasonRes?.status === 'boolean' ? seasonRes.data : seasonRes;
                    const seasons = Array.isArray(seasonPayload?.data) ? seasonPayload.data : [];
                    // Find ongoing season first, fallback to latest
                    const ongoingSeason = seasons.find(s => s.status === 'ongoing');
                    const targetSeason = ongoingSeason || seasons[0];
                    if (targetSeason?.id) {
                        try {
                            const matchRes = await matchApi.getScheduleBySeason(targetSeason.id, { per_page: 1 });
                            matchTotal = extractTotal(matchRes);
                        } catch { /* no matches available */ }
                    }
                }

                if (!cancelled) {
                    setStats({
                        tournaments: tourTotal,
                        teams: teamTotal,
                        seasons: seasonTotal,
                        matches: matchTotal,
                    });
                }
            } catch (err) {
                console.warn('[BannerSection] Failed to fetch stats:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchStats();
        return () => { cancelled = true; };
    }, []);

    // Animated counters
    const tourCount = useCountUp(stats.tournaments);
    const teamCount = useCountUp(stats.teams);
    const seasonCount = useCountUp(stats.seasons);
    const matchCount = useCountUp(stats.matches);

    return (
        <div className="mb-20 rounded-3xl overflow-hidden relative border border-navy-light shadow-2xl">
            <div className="absolute inset-0 bg-navy/80 z-10"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1e12222374be?q=80&w=2070')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <div className="relative z-20 p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="w-full lg:w-3/5 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.2]">
                        Tổ chức giải đấu dễ dàng <br/>
                        <span className="text-gray-300 font-bold text-3xl md:text-4xl">Quản lý đội thể thao đơn giản!</span>
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-xl">
                        <Link to="/quan-ly-giai-dau" className="px-6 py-4 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-center transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:-translate-y-1">
                            <Trophy className="w-5 h-5" />
                            Tạo giải đấu
                        </Link>
                        <Link to="/giai-dau" className="px-6 py-4 flex items-center justify-center gap-3 bg-navy-dark border border-navy-light hover:bg-navy text-white font-bold rounded-2xl text-center transition-all duration-300 hover:-translate-y-1">
                            <Search className="w-5 h-5" />
                            Tìm giải đấu
                        </Link>
                        <Link to="/dang-ky-doi-bong" className="px-6 py-4 flex items-center justify-center gap-3 bg-navy-dark border border-navy-light hover:bg-navy text-white font-bold rounded-2xl text-center transition-all duration-300 hover:-translate-y-1">
                            <Users className="w-5 h-5" />
                            Tạo đội hình
                        </Link>
                        <Link to="/quan-ly-doi-bong" className="px-6 py-4 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-center transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:-translate-y-1">
                            <Shield className="w-5 h-5" />
                            Quản lý đội
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="relative z-20 grid grid-cols-2 md:grid-cols-4 bg-navy-dark/90 backdrop-blur-md border-t border-navy-light/50">
                <StatBlock
                    label="Giải đấu"
                    value={tourCount}
                    loading={loading}
                    icon={<Trophy className="w-4 h-4 text-emerald-400" />}
                />
                <StatBlock
                    label="Đội thi đấu"
                    value={teamCount}
                    loading={loading}
                    icon={<Users className="w-4 h-4 text-blue-400" />}
                    border
                />
                <StatBlock
                    label="Mùa giải"
                    value={seasonCount}
                    loading={loading}
                    icon={<Calendar className="w-4 h-4 text-purple-400" />}
                    border
                />
                <StatBlock
                    label="Trận đấu"
                    value={matchCount}
                    loading={loading}
                    icon={<Swords className="w-4 h-4 text-amber-400" />}
                    border
                    last
                />
            </div>
        </div>
    )
}

function StatBlock({ label, value, loading, icon, border, last }) {
    return (
        <div className={`p-8 text-center ${border && !last ? 'border-l' : ''} ${!last ? 'border-b md:border-b-0' : 'border-l'} border-navy-light/50`}>
            <div className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2 bg-white/5 inline-flex items-center gap-2 px-3 py-1 rounded-lg">
                {icon}
                {label}
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-10">
                    <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
            ) : (
                <div className="text-4xl font-black text-white">
                    {value.toLocaleString('vi-VN')}
                </div>
            )}
        </div>
    );
}