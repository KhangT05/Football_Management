import { useEffect, useState, useRef } from "react";
import { Search, Shield, Trophy, Users, Calendar, Swords, Loader2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { tournamentApi, teamApi, seasonApi, matchApi } from "../../../api";
import useAuthStore from "../../../store/authStore";
import { useShallow } from "zustand/react/shallow";

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
    const [showSearchModal, setShowSearchModal] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuthStore(useShallow(state => ({ user: state.user })));

    const handleManageTeamClick = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            navigate('/dang-ky-doi-bong');
            return;
        }
        try {
            const res = await teamApi.getTeams({ per_page: 10 });
            const payload = (typeof res?.status === 'boolean') ? res.data : res;
            const allTeams = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
            const myTeam = allTeams.find(t => t.user_id === user.id);
            if (myTeam) {
                navigate('/doi-cua-toi');
            } else {
                navigate('/dang-ky-doi-bong');
            }
        } catch {
            navigate('/dang-ky-doi-bong');
        }
    };

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
            
            <div className="relative z-20 p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col items-center text-center justify-center min-h-[350px] md:min-h-[450px]">
                <div className="w-full max-w-4xl space-y-6 md:space-y-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                        Tổ chức giải đấu dễ dàng <br className="hidden sm:block"/>
                        <span className="text-gray-300 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 block">Quản lý đội thể thao đơn giản!</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
                        <button onClick={() => setShowSearchModal(true)} className="px-4 py-3.5 md:px-6 md:py-4 flex items-center justify-center gap-2 sm:gap-3 bg-navy-dark border border-navy-light hover:bg-navy text-white font-bold rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            Tìm giải đấu
                        </button>
                        <Link to="/dang-ky-doi-bong" className="px-4 py-3.5 md:px-6 md:py-4 flex items-center justify-center gap-2 sm:gap-3 bg-navy-dark border border-navy-light hover:bg-navy text-white font-bold rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            Tạo đội hình
                        </Link>
                        <button onClick={handleManageTeamClick} className="px-4 py-3.5 md:px-6 md:py-4 flex items-center justify-center gap-2 sm:gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-center transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:-translate-y-1 text-sm sm:text-base">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            Quản lý đội
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="relative z-20 grid grid-cols-2 lg:grid-cols-4 bg-navy-dark/90 backdrop-blur-md border-t border-navy-light/50">
                <StatBlock
                    label="Giải đấu"
                    value={tourCount}
                    loading={loading}
                    icon={<Trophy className="w-4 h-4 text-emerald-400" />}
                    className="border-b lg:border-b-0 border-r border-navy-light/50"
                />
                <StatBlock
                    label="Đội thi đấu"
                    value={teamCount}
                    loading={loading}
                    icon={<Users className="w-4 h-4 text-blue-400" />}
                    className="border-b lg:border-b-0 lg:border-r border-navy-light/50"
                />
                <StatBlock
                    label="Mùa giải"
                    value={seasonCount}
                    loading={loading}
                    icon={<Calendar className="w-4 h-4 text-purple-400" />}
                    className="border-r border-navy-light/50"
                />
                <StatBlock
                    label="Trận đấu"
                    value={matchCount}
                    loading={loading}
                    icon={<Swords className="w-4 h-4 text-amber-400" />}
                    className=""
                />
            </div>
            
            <TournamentSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
        </div>
    )
}

function TournamentSearchModal({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        let cancelled = false;
        async function fetchTours() {
            setLoading(true);
            try {
                const res = await tournamentApi.getAll({ per_page: 50, q: searchQuery });
                const payload = (typeof res?.status === 'boolean') ? res.data : res;
                const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
                if (!cancelled) setTournaments(data);
            } catch (error) {
                console.warn(error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        
        const timeout = setTimeout(fetchTours, 300);
        return () => {
            cancelled = true;
            clearTimeout(timeout);
        }
    }, [isOpen, searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-navy-dark/95 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh] md:h-[600px] animate-scale-in">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
                <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light relative z-10 bg-navy/40">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Search className="w-6 h-6 text-blue-400" />
                        Tìm kiếm giải đấu
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 relative z-10 shrink-0 border-b border-navy-light/50 bg-navy/20">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Nhập tên giải đấu..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-navy border border-navy-light rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-base font-medium transition-all shadow-inner"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 relative z-10 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : tournaments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                            <Trophy className="w-16 h-16 opacity-20" />
                            <p className="font-bold text-lg">Không tìm thấy giải đấu nào</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tournaments.map(tour => (
                                <Link key={tour.id} to={`/giai-dau/${tour.id}`} className="flex items-center gap-4 p-4 rounded-2xl border border-navy-light bg-navy/40 hover:bg-navy hover:border-blue-500/50 transition-all group">
                                    <div className="w-16 h-16 rounded-xl bg-navy-dark border border-navy-light overflow-hidden shrink-0">
                                        {tour.logo ? <img src={tour.logo} alt={tour.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500"><Trophy className="w-8 h-8" /></div>}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-lg group-hover:text-blue-400 transition-colors">{tour.name}</h4>
                                        {tour.description && <p className="text-sm text-gray-400 line-clamp-1 mt-1">{tour.description}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatBlock({ label, value, loading, icon, className = "" }) {
    return (
        <div className={`p-4 sm:p-6 md:p-8 text-center ${className}`}>
            <div className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-wider mb-2 bg-white/5 inline-flex items-center gap-2 px-3 py-1 rounded-lg">
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
