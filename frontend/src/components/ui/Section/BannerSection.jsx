import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, Shield, Trophy, Users, Calendar, Swords, Loader2, X, ChevronRight } from "lucide-react";
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
        <div className="mb-24 sm:mb-28 relative">
            {/* Hero panel */}
            <div className="rounded-3xl overflow-hidden relative border border-navy-light shadow-2xl bg-navy-dark">
                {/* Ambient "floodlight" glows */}
                <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-10 w-104 h-104 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

                {/* Faint scoreboard grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage: 'repeating-linear-linear(45deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 16px)',
                    }}
                />

                {/* Oversized watermark icon, grounds the section in "sports" */}
                <Trophy
                    aria-hidden="true"
                    className="hidden lg:block absolute -right-14 -top-14 w-[340px] h-[340px] text-white/[0.035] rotate-12 pointer-events-none"
                />

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy-dark to-transparent pointer-events-none" />

                <div className="relative z-10 p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col items-center text-center justify-center min-h-[380px] md:min-h-[460px]">
                    <div className="w-full max-w-4xl space-y-6 md:space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                            </span>
                            Nền tảng quản lý thể thao
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                            Tổ chức giải đấu dễ dàng
                            <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                                Quản lý đội thể thao đơn giản!
                            </span>
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-2">
                            <button
                                onClick={() => setShowSearchModal(true)}
                                className="px-3 py-3 md:px-4 md:py-4 flex flex-col items-center justify-center gap-2 bg-white/4 border border-white/10 hover:bg-white/8 hover:border-white/20 text-white font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1 text-xs sm:text-sm text-center"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 shrink-0">
                                    <Search className="w-5 h-5" />
                                </span>
                                Tìm giải đấu
                            </button>
                            <Link
                                to="/tra-cuu-doi-bong"
                                className="px-3 py-3 md:px-4 md:py-4 flex flex-col items-center justify-center gap-2 bg-white/4 border border-white/10 hover:bg-white/8 hover:border-white/20 text-white font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1 text-xs sm:text-sm text-center"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                                    <Shield className="w-5 h-5" />
                                </span>
                                Tra cứu đội
                            </Link>
                            <Link
                                to="/tra-cuu-cau-thu"
                                className="px-3 py-3 md:px-4 md:py-4 flex flex-col items-center justify-center gap-2 bg-white/4 border border-white/10 hover:bg-white/8 hover:border-white/20 text-white font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1 text-xs sm:text-sm text-center"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
                                    <Users className="w-5 h-5" />
                                </span>
                                Tra cứu cầu thủ
                            </Link>
                            <button
                                onClick={handleManageTeamClick}
                                className="px-3 py-3 md:px-4 md:py-4 flex flex-col items-center justify-center gap-2 bg-linear-to-br from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:-translate-y-1 text-xs sm:text-sm text-center"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 shrink-0">
                                    <Trophy className="w-5 h-5" />
                                </span>
                                Quản lý đội
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating stats card, overlapping the hero's bottom edge */}
            <div className="relative z-20 -mt-10 sm:-mt-14 mx-4 sm:mx-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-navy-light/70 bg-navy/95 backdrop-blur-xl border border-navy-light rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
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
                    />
                    <StatBlock
                        label="Mùa giải"
                        value={seasonCount}
                        loading={loading}
                        icon={<Calendar className="w-4 h-4 text-purple-400" />}
                    />
                    <StatBlock
                        label="Trận đấu"
                        value={matchCount}
                        loading={loading}
                        icon={<Swords className="w-4 h-4 text-amber-400" />}
                    />
                </div>
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

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-navy-dark/95 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh] md:h-[600px] animate-scale-in">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
                <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light relative z-10 bg-navy/40">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400">
                            <Search className="w-5 h-5" />
                        </span>
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
                            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-navy-light/60">
                                <Trophy className="w-9 h-9 opacity-40" />
                            </div>
                            <p className="font-bold text-lg">Không tìm thấy giải đấu nào</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tournaments.map(tour => (
                                <Link key={tour.id} to={`/giai-dau/${tour.id}`} className="flex items-center gap-4 p-4 rounded-2xl border border-navy-light bg-navy/40 hover:bg-navy hover:border-blue-500/50 transition-all group">
                                    <div className="w-16 h-16 rounded-xl bg-navy-dark border border-navy-light overflow-hidden shrink-0">
                                        {tour.logo ? <img src={tour.logo} alt={tour.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500"><Trophy className="w-8 h-8" /></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-white text-lg group-hover:text-blue-400 transition-colors truncate">{tour.name}</h4>
                                        {tour.description && <p className="text-sm text-gray-400 line-clamp-1 mt-1">{tour.description}</p>}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

function StatBlock({ label, value, loading, icon }) {
    return (
        <div className="group p-5 sm:p-6 md:p-7 text-center transition-colors hover:bg-white/3">
            <div className="flex items-center justify-center mb-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
                    {icon}
                </span>
            </div>
            <div className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mb-1.5">
                {label}
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-9">
                    <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                </div>
            ) : (
                <div className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                    {value.toLocaleString('vi-VN')}
                </div>
            )}
        </div>
    );
}