import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Trophy, X, Search, Ban, Clock, CheckCircle2, Loader2, CalendarClock, CalendarCheck,
} from 'lucide-react';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const isUrgent = (deadline) => {
    if (!deadline) return false;
    const days = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 3;
};

// Badge trạng thái mùa giải — tách riêng khỏi disabledReason vì đây là info
// luôn hiển thị (kể cả khi eligible), không phải lý do chặn.
function SeasonStatusBadge({ status }) {
    if (status === 'registration_open') {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                <CalendarCheck className="w-3 h-3" /> Đang mở đăng ký
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-gray-500/10 text-gray-400 border border-gray-500/30 px-2 py-0.5 rounded-md">
            <CalendarClock className="w-3 h-3" /> Sắp mở đăng ký
        </span>
    );
}

// Chip lý do không đăng ký được — 3 case, ưu tiên theo mức độ hữu ích cho
// user: đã đăng ký (thông tin) > conflict cầu thủ (cần hành động) > chưa mở
// (chỉ cần chờ). Mỗi case 1 icon + màu riêng để quét mắt nhanh, không phải
// đọc hết câu chữ.
function DisabledReasonChip({ reason }) {
    if (!reason) return null;
    const variants = {
        already_registered: { icon: CheckCircle2, cls: 'bg-blue-500/10 text-blue-400 border-blue-500/30', text: 'Đội đã đăng ký giải này' },
        conflict: { icon: Ban, cls: 'bg-red-500/10 text-red-400 border-red-500/30', text: reason.detail },
        not_open: { icon: Clock, cls: 'bg-gray-500/10 text-gray-400 border-gray-500/30', text: 'Giải chưa mở đăng ký — quay lại sau' },
    };
    const v = variants[reason.type];
    const Icon = v.icon;
    return (
        <p className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border mt-2 ${v.cls}`}>
            <Icon className="w-3.5 h-3.5 shrink-0" /> <span>{v.text}</span>
        </p>
    );
}

function SeasonCard({ season: s, registeringId, onRegister }) {
    const disabledReason = s.already_registered
        ? { type: 'already_registered' }
        : s.conflict
            ? { type: 'conflict', detail: `Cầu thủ ${s.conflict.playerName} đang thuộc đội ${s.conflict.teamName}, đội này đã đăng ký giải này` }
            : s.season_status !== 'registration_open'
                ? { type: 'not_open' }
                : null;

    const urgent = !disabledReason && isUrgent(s.registration_deadline);

    return (
        <div className={`p-4 rounded-2xl border transition-colors ${disabledReason ? 'bg-navy-dark/50 border-navy-light/50' : 'bg-navy-dark border-navy-light hover:border-blue-500/40'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <SeasonStatusBadge status={s.season_status} />
                        {urgent && (
                            <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md">
                                Sắp hết hạn
                            </span>
                        )}
                    </div>
                    <p className={`font-bold truncate ${disabledReason ? 'text-gray-400' : 'text-white'}`}>{s.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Khai mạc: {formatDate(s.start_date)}
                        {s.registration_deadline && <> · Hạn ĐK: {formatDate(s.registration_deadline)}</>}
                    </p>
                    <DisabledReasonChip reason={disabledReason} />
                </div>

                <button
                    disabled={!!disabledReason || registeringId === s.season_id}
                    onClick={() => onRegister(s.season_id)}
                    className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-navy-light disabled:hover:bg-navy-light"
                >
                    {registeringId === s.season_id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Đăng ký'}
                </button>
            </div>
        </div>
    );
}

export default function SeasonRegistrationModal({ seasons, registeringId, onRegister, onClose }) {
    const [search, setSearch] = useState('');
    const [tournamentFilter, setTournamentFilter] = useState('all');

    const tournaments = useMemo(() => {
        const map = new Map();
        seasons.forEach(s => { if (s.tournament && !map.has(s.tournament.id)) map.set(s.tournament.id, s.tournament); });
        return Array.from(map.values());
    }, [seasons]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return seasons.filter(s => {
            if (tournamentFilter !== 'all' && String(s.tournament?.id) !== tournamentFilter) return false;
            if (!q) return true;
            return s.name.toLowerCase().includes(q) || (s.tournament?.name ?? '').toLowerCase().includes(q);
        });
    }, [seasons, search, tournamentFilter]);

    // Nhóm theo trạng thái trước (đang mở lên đầu), rồi trong mỗi nhóm sort
    // eligible lên trước disabled — user quét từ trên xuống thấy ngay cái gì
    // bấm được, cái gì phải chờ/đã xong.
    const { openSeasons, upcomingSeasons } = useMemo(() => {
        const sortWithinGroup = (list) => [...list].sort((a, b) => {
            const aBlocked = a.already_registered || a.conflict;
            const bBlocked = b.already_registered || b.conflict;
            if (aBlocked !== bBlocked) return aBlocked ? 1 : -1;
            const da = a.registration_deadline ? new Date(a.registration_deadline).getTime() : Infinity;
            const db = b.registration_deadline ? new Date(b.registration_deadline).getTime() : Infinity;
            return da - db;
        });
        return {
            openSeasons: sortWithinGroup(filtered.filter(s => s.season_status === 'registration_open')),
            upcomingSeasons: sortWithinGroup(filtered.filter(s => s.season_status !== 'registration_open')),
        };
    }, [filtered]);

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center p-4 pt-16 sm:pt-20" onClick={onClose}>
            <div
                className="bg-navy border border-navy-light rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 pb-4 shrink-0">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-emerald-400" /> Đăng ký giải đấu
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {seasons.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm font-medium">Chưa có giải đấu nào sắp diễn ra.</p>
                        <p className="text-gray-600 text-xs mt-1">Quay lại sau khi Ban tổ chức tạo giải mới.</p>
                    </div>
                ) : (
                    <>
                        <div className="px-6 space-y-3 mb-4 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên mùa giải hoặc tên giải đấu..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500" />
                            </div>
                            {tournaments.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                                    <button onClick={() => setTournamentFilter('all')}
                                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${tournamentFilter === 'all' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-navy-dark border-navy-light text-gray-400 hover:text-white'}`}>
                                        Tất cả giải
                                    </button>
                                    {tournaments.map(t => (
                                        <button key={t.id} onClick={() => setTournamentFilter(String(t.id))}
                                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${tournamentFilter === String(t.id) ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-navy-dark border-navy-light text-gray-400 hover:text-white'}`}>
                                            {t.logo && <img src={t.logo} alt="" className="w-4 h-4 rounded-full object-cover" />}
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="px-6 pb-6 space-y-6 overflow-y-auto custom-scrollbar">
                            {filtered.length === 0 ? (
                                <p className="text-center text-gray-500 text-sm py-8">Không tìm thấy mùa giải nào khớp bộ lọc.</p>
                            ) : (
                                <>
                                    {openSeasons.length > 0 && (
                                        <div>
                                            <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                                                <CalendarCheck className="w-3.5 h-3.5" /> Đang mở đăng ký ({openSeasons.length})
                                            </p>
                                            <div className="space-y-3">
                                                {openSeasons.map(s => (
                                                    <SeasonCard key={s.season_id} season={s} registeringId={registeringId} onRegister={onRegister} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {upcomingSeasons.length > 0 && (
                                        <div>
                                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                                                <CalendarClock className="w-3.5 h-3.5" /> Sắp mở đăng ký ({upcomingSeasons.length})
                                            </p>
                                            <div className="space-y-3">
                                                {upcomingSeasons.map(s => (
                                                    <SeasonCard key={s.season_id} season={s} registeringId={registeringId} onRegister={onRegister} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}