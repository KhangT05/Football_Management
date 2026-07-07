import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Trophy, Calendar, Users, Shield, ArrowLeft, ChevronRight,
  Clock, Activity, XCircle, BarChart2, Zap, AlertCircle
} from 'lucide-react';
import { tournamentApi, seasonApi, seasonTeamApi } from '../api';
import { AVATAR_COLORS, getInitials } from '../utils/constants';

// ── Helpers ───────────────────────────────────────────────────
const STATUS_CONFIG = {
  upcoming: {
    label: 'Sắp diễn ra',
    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotCls: 'bg-blue-400',
  },
  registration_open: {
    label: 'Mở đăng ký',
    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotCls: 'bg-emerald-400 animate-pulse',
  },
  ongoing: {
    label: 'Đang diễn ra',
    cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    dotCls: 'bg-orange-400 animate-pulse',
  },
  finished: {
    label: 'Đã kết thúc',
    cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    dotCls: 'bg-gray-400',
  },
  cancelled: {
    label: 'Đã hủy',
    cls: 'bg-red-700/10 text-red-500 border-red-700/20',
    dotCls: 'bg-red-500',
  },
};

const parseList = (res) => {
  const payload = typeof res?.status === 'boolean' ? res.data : res;
  return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status || 'Không rõ',
    cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    dotCls: 'bg-gray-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotCls}`} />
      {cfg.label}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function TournamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [seasonTeamsMap, setSeasonTeamsMap] = useState({});
  const [activeSeasonId, setActiveSeasonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [tRes, sRes] = await Promise.all([
          tournamentApi.getById(id),
          seasonApi.getAll({ tournament_id: id, per_page: 50 }),
        ]);
        if (cancelled) return;

        const t = tRes?.data ?? tRes;
        setTournament(t);

        const sList = parseList(sRes);
        sList.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        setSeasons(sList);

        if (sList.length > 0) {
          const active = sList.find(s => ['registration_open', 'ongoing'].includes(s.status)) || sList[0];
          setActiveSeasonId(active.id);
        }
      } catch {
        if (!cancelled) setError('Không tìm thấy giải đấu hoặc đã bị xóa.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!activeSeasonId || seasonTeamsMap[activeSeasonId] !== undefined) return;
    seasonTeamApi.getAll({ season_id: activeSeasonId, per_page: 100 })
      .then(res => {
        setSeasonTeamsMap(prev => ({ ...prev, [activeSeasonId]: parseList(res) }));
      })
      .catch(() => {
        setSeasonTeamsMap(prev => ({ ...prev, [activeSeasonId]: [] }));
      });
  }, [activeSeasonId, seasonTeamsMap]);

  const activeSeason = useMemo(() => seasons.find(s => s.id === activeSeasonId), [seasons, activeSeasonId]);
  const activeTeams = seasonTeamsMap[activeSeasonId] ?? [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-navy-dark">
        <div className="bg-navy border border-navy-light p-8 rounded-2xl text-center max-w-sm w-full mx-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="font-bold text-white mb-1">Không tìm thấy</p>
          <p className="text-sm text-gray-400 mb-5">{error || 'Giải đấu không tồn tại.'}</p>
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-sm">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const totalTeams = activeTeams.length;
  const maxTeams = activeSeason?.max_teams || 0;
  const fillPct = maxTeams ? Math.min(100, Math.round((totalTeams / maxTeams) * 100)) : 0;

  return (
    <div className="min-h-screen bg-navy-dark relative">
      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-52 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[180px] opacity-[0.06]" />
        <div className="absolute bottom-0 -left-52 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[180px] opacity-[0.06]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10 max-w-6xl">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Quay lại
        </button>

        {/* ── Hero ────────────────────────────────────── */}
        <div className="bg-navy border border-navy-light rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-black/30">
          {/* Banner / header bg */}
          <div className="relative">
            {tournament.banner ? (
              <div className="w-full h-52 md:h-64 overflow-hidden">
                <img src={tournament.banner} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-navy/90 to-transparent" />
              </div>
            ) : (
              <div className="w-full h-36 md:h-48"
                style={{ background: 'linear-gradient(135deg, #0A192F 0%, #112240 50%, #1a3155 100%)' }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <Trophy className="w-32 h-32 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 md:px-8 pb-8 pt-0 -mt-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl bg-navy-dark border-2 border-navy-light flex items-center justify-center shrink-0 shadow-xl overflow-hidden">
                {tournament.logo
                  ? <img src={tournament.logo} alt={tournament.name} className="w-full h-full object-cover" />
                  : <Trophy className="w-9 h-9 text-blue-400" />}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[10px] font-black px-2 py-1 rounded-full bg-navy-light text-gray-400 uppercase tracking-widest border border-navy-light">
                    Giải đấu
                  </span>
                  {tournament.is_active === false && (
                    <span className="text-[10px] font-black px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest">
                      Ngưng hoạt động
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{tournament.name}</h1>
              </div>
            </div>

            {tournament.description && (
              <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-2xl">
                {tournament.description}
              </p>
            )}

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-navy-light">
              {[
                { label: 'Mùa giải', value: seasons.length, color: 'text-blue-400' },
                { label: 'Đội tham gia', value: totalTeams, color: 'text-emerald-400' },
                { label: 'Trạng thái', value: activeSeason ? (STATUS_CONFIG[activeSeason.status]?.label || activeSeason.status) : '—', color: 'text-amber-400' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className={`text-xl md:text-2xl font-black ${item.color}`}>{item.value}</p>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar: seasons */}
          <div className="lg:col-span-4">
            <div className="bg-navy border border-navy-light rounded-2xl p-5 sticky top-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                Các mùa giải
              </h2>

              {seasons.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">Chưa có mùa giải nào</p>
              ) : (
                <div className="space-y-1.5">
                  {seasons.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSeasonId(s.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between gap-3 text-sm font-bold
                        ${activeSeasonId === s.id
                          ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                          : 'text-gray-400 hover:bg-navy-light hover:text-white border border-transparent'
                        }`}
                    >
                      <span className="truncate">{s.name}</span>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_CONFIG[s.status]?.dotCls || 'bg-gray-500'}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main: season detail */}
          <div className="lg:col-span-8 space-y-5">
            {activeSeason ? (
              <>
                {/* Season info card */}
                <div className="bg-navy border border-navy-light rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-black text-white">{activeSeason.name}</h3>
                      {activeSeason.description && (
                        <p className="text-sm text-gray-400 mt-1">{activeSeason.description}</p>
                      )}
                    </div>
                    <StatusBadge status={activeSeason.status} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Bắt đầu: {new Date(activeSeason.start_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                      <span>Kết thúc: {new Date(activeSeason.end_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Tối đa: {activeSeason.max_teams} đội</span>
                    </div>
                    {activeSeason.registration_deadline && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>HĐK: {new Date(activeSeason.registration_deadline).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  {['ongoing', 'finished'].includes(activeSeason.status) && (() => {
                    const now = new Date();
                    const start = new Date(activeSeason.start_date);
                    const end = new Date(activeSeason.end_date);
                    const pct = end > start ? Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100))) : 0;
                    return (
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1.5">
                          <span>Tiến độ mùa giải</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-navy-light rounded-full overflow-hidden">
                          <div className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Teams */}
                <div className="bg-navy border border-navy-light rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      Đội tham gia ({totalTeams}/{maxTeams})
                    </h3>
                    <Link to="/bang-xep-hang" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                      Xem BXH <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {maxTeams > 0 && (
                    <div className="mb-4">
                      <div className="h-2 bg-navy-light rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${fillPct}%` }} />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 font-medium">
                        {maxTeams - totalTeams > 0 ? `Còn ${maxTeams - totalTeams} suất đăng ký` : 'Đã đủ số đội'}
                      </p>
                    </div>
                  )}

                  {activeTeams.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">Chưa có đội đăng ký cho mùa giải này</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto custom-scrollbar pr-0.5">
                      {activeTeams.map((st, i) => {
                        const team = st.team ?? {};
                        const name = team.name ?? `Đội ${i + 1}`;
                        const logo = team.logo;
                        const ini = getInitials(name);
                        const colorIdx = i % AVATAR_COLORS.length;
                        return (
                          <Link
                            key={st.id}
                            to={`/doi-bong/${team.id}`}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-navy-dark border border-navy-light hover:border-blue-500/40 hover:bg-navy-light/50 transition-all duration-200 group"
                          >
                            <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-white font-black text-xs shrink-0 overflow-hidden shadow`}>
                              {logo ? <img src={logo} alt={name} className="w-full h-full object-cover" /> : ini}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">{name}</p>
                              <p className="text-[11px] text-gray-500 font-medium">
                                {st.status === 'approved' ? '✅ Đã duyệt' : st.status === 'pending' ? '⏳ Chờ duyệt' : st.status}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/bang-xep-hang?season=${activeSeason.id}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  >
                    <BarChart2 className="w-4 h-4" />
                    Bảng xếp hạng
                  </Link>
                  <Link
                    to="/lich-thi-dau"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-navy border border-navy-light hover:border-blue-500/40 text-white transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Calendar className="w-4 h-4" />
                    Lịch thi đấu
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-navy border border-navy-light rounded-2xl p-12 text-center">
                <Trophy className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="font-bold text-gray-400">Chọn mùa giải để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
