import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Users, Trophy, ListChecks, Shield, DollarSign, UserPlus } from 'lucide-react';
import StatCard from '../../components/StatCard';
import useAuthStore from '../../store/authStore';
import { useShallow } from 'zustand/react/shallow';
import { tournamentApi, seasonApi, teamApi, userApi, statisticsApi } from '../../api';

export default function Dashboard() {
  const { user } = useAuthStore(useShallow(state => ({ user: state.user })));
  
  const [stats, setStats] = useState({
    tournaments: 0,
    seasons: 0,
    teams: 0,
    users: 0,
    revenue: 0,
    newUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.allSettled([
          tournamentApi.getAll({ per_page: 1 }),
          seasonApi.getAll({ per_page: 1 }),
          teamApi.getAll({ per_page: 1 }),
          userApi.getAll({ per_page: 1 }),
          statisticsApi.getSeasonRevenue(),
          statisticsApi.getUserRegistrations(30)
        ]);

        results.forEach((r, i) => {
          if (r.status === 'rejected') {
            console.error(`Dashboard API ${i} failed:`, r.reason);
          }
        });

        if (isMounted) {
          setStats({
            tournaments: results[0].status === 'fulfilled' ? (results[0].value?.data?.meta?.total || 0) : 0,
            seasons: results[1].status === 'fulfilled' ? (results[1].value?.data?.meta?.total || 0) : 0,
            teams: results[2].status === 'fulfilled' ? (results[2].value?.data?.meta?.total || 0) : 0,
            users: results[3].status === 'fulfilled' ? (results[3].value?.data?.meta?.total || 0) : 0,
            revenue: results[4].status === 'fulfilled' ? (results[4].value?.data?.total_net_revenue || 0) : 0,
            newUsers: results[5].status === 'fulfilled' ? (results[5].value?.data?.total_new_users || 0) : 0
          });
        }
      } catch (err) {
        console.warn('Failed to fetch dashboard stats:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchDashboardStats();
    return () => { isMounted = false; };
  }, []);

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

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
            Tổng quan thống kê hệ thống quản lý giải đấu bóng đá.
          </p>
        </div>

        {/* System Operations Grid */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Vận hành Hệ thống</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Giải đấu"
              value={isLoading ? '—' : stats.tournaments.toString()}
              icon={Trophy}
              colorClass="border-navy-light text-blue-400"
            />
            <StatCard
              title="Mùa giải"
              value={isLoading ? '—' : stats.seasons.toString()}
              icon={ListChecks}
              colorClass="border-navy-light text-purple-400"
            />
            <StatCard
              title="Đội bóng"
              value={isLoading ? '—' : stats.teams.toString()}
              icon={Shield}
              colorClass="border-navy-light text-emerald-400"
            />
            <StatCard
              title="Người dùng"
              value={isLoading ? '—' : stats.users.toString()}
              icon={Users}
              colorClass="border-navy-light text-neon"
            />
          </div>
        </div>

        {/* Financial & Growth Grid */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Tài chính & Tăng trưởng</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              title="Doanh thu hệ thống"
              value={isLoading ? '—' : formatCurrency(stats.revenue)}
              icon={DollarSign}
              colorClass="border-navy-light text-yellow-400"
            />
            <StatCard
              title="Người dùng mới (30 ngày)"
              value={isLoading ? '—' : `+${stats.newUsers}`}
              icon={UserPlus}
              colorClass="border-navy-light text-pink-400"
            />
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
