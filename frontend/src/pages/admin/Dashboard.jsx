import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Users, CalendarCheck, CalendarClock,
  Trophy, Globe, ListChecks
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import useAuthStore from '../../store/authStore';
import useTournamentStore from '../../store/tournamentStore';
import useSeasonStore from '../../store/seasonStore';
import { useShallow } from 'zustand/react/shallow';

export default function Dashboard() {
  const { user } = useAuthStore(useShallow(state => ({ user: state.user })));
  const navigate = useNavigate();

  // ── Zustand stores ─────────────────────────────────────────
  const { tournaments,
    meta: tMeta,
    isLoading: tLoading,
    fetchAll: fetchTournaments, } = useTournamentStore(useShallow(state => ({ tournaments: state.tournaments, meta: state.meta, isLoading: state.isLoading, fetchAll: state.fetchAll })));

  const { seasons,
    meta: sMeta,
    isLoading: sLoading,
    fetchAll: fetchSeasons, } = useSeasonStore(useShallow(state => ({ seasons: state.seasons, meta: state.meta, isLoading: state.isLoading, fetchAll: state.fetchAll })));

  const isLoading = tLoading || sLoading;

  useEffect(() => {
    fetchTournaments();
    fetchSeasons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Status badge helper
  const statusMeta = {
    upcoming:          { label: 'Sắp diễn ra',    cls: 'bg-slate-400/10 text-slate-300 border-slate-500/30' },
    registration_open: { label: 'Mở đăng ký',     cls: 'bg-blue-400/10 text-blue-400 border-blue-400/30' },
    ongoing:           { label: 'Đang diễn ra',    cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' },
    finished:          { label: 'Đã kết thúc',     cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30' },
    cancelled:         { label: 'Đã hủy',          cls: 'bg-red-400/10 text-red-400 border-red-400/30' },
  };

  // Chỉ hiển thị 5 item gần nhất trên Dashboard
  const recentTournaments = tournaments.slice(0, 5);
  const recentSeasons     = seasons.slice(0, 5);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Section */}
        <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg shadow-black/20 border-l-4 border-l-neon relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Trophy className="w-32 h-32 text-neon" />
          </div>
          <h2 className="text-2xl font-extrabold text-neon tracking-tight mb-1 relative z-10">
            Xin chào, {user?.name || 'Admin'}! 👋
          </h2>
          <p className="text-gray-400 font-medium relative z-10">
            Tổng quan hệ thống quản lý giải đấu bóng đá.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Giải đấu"
            value={isLoading ? '—' : tMeta.total.toString()}
            icon={Trophy}
            colorClass="border-navy-light text-blue-400"
          />
          <StatCard
            title="Mùa giải"
            value={isLoading ? '—' : sMeta.total.toString()}
            icon={ListChecks}
            colorClass="border-navy-light text-purple-400"
          />
          <StatCard
            title="Mùa đang diễn ra"
            value={isLoading ? '—' : seasons.filter(s => s.status === 'ongoing').length.toString()}
            icon={Users}
            colorClass="border-navy-light text-neon"
          />
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Tournaments List */}
          <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-navy-light flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Giải đấu gần đây
              </h3>
              <button
                onClick={() => navigate('/quan-ly-giai-dau/cai-dat')}
                className="text-sm font-bold text-neon hover:text-neon-hover transition-colors"
              >
                Quản lý →
              </button>
            </div>
            <div className="flex-1 bg-navy-dark/50">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
                </div>
              ) : recentTournaments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Chưa có giải đấu nào</p>
                </div>
              ) : (
                <div className="divide-y divide-navy-light">
                  {recentTournaments.map(t => (
                    <div key={t.id} className="px-6 py-4 flex items-center gap-4 hover:bg-navy-light/20 transition-colors">
                      {/* Logo */}
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
                        {t.name?.[0]?.toUpperCase() || 'T'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{t.name}</p>
                        <p className="text-xs text-gray-500 truncate">{t.description || 'Không có mô tả'}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${t.is_active ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seasons List */}
          <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-navy-light flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-purple-400" />
                Mùa giải gần đây
              </h3>
              <button
                onClick={() => navigate('/quan-ly-giai-dau/cai-dat')}
                className="text-sm font-bold text-neon hover:text-neon-hover transition-colors"
              >
                Quản lý →
              </button>
            </div>
            <div className="flex-1 bg-navy-dark/50">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
                </div>
              ) : recentSeasons.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Chưa có mùa giải nào</p>
                </div>
              ) : (
                <div className="divide-y divide-navy-light">
                  {recentSeasons.map(s => {
                    const sm = statusMeta[s.status] ?? statusMeta.upcoming;
                    return (
                      <div key={s.id} className="px-6 py-4 flex items-center gap-4 hover:bg-navy-light/20 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
                          {s.name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">{s.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(s.start_date).toLocaleDateString('vi-VN')}
                            {' → '}
                            {new Date(s.end_date).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-md border shrink-0 ${sm.cls}`}>
                          {sm.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
