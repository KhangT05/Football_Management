import { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Users, Trophy, ListChecks, Shield, DollarSign, UserPlus, TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from '../../components/StatCard';
import useAuthStore from '../../store/authStore';
import { useShallow } from 'zustand/react/shallow';
import { tournamentApi, seasonApi, teamApi, userApi, statisticsApi } from '../../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const { user } = useAuthStore(useShallow(state => ({ user: state.user })));
  
  // Filter States
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30ngày');

  // Stats States
  const [overviewStats, setOverviewStats] = useState({
    tournaments: 0, seasons: 0, teams: 0, users: 0, revenue: 0, newUsers: 0
  });
  const [dailyRegistrations, setDailyRegistrations] = useState([]);
  
  const [seasonStats, setSeasonStats] = useState({
    revenue: null,
    teamRegistrations: null,
    topScorers: [],
    discipline: []
  });

  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Lists for Dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const seasonsRes = await seasonApi.getAll({ per_page: 100 });
        setSeasons(seasonsRes.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };
    fetchDropdownData();
  }, []);

  // 2. Fetch Stats based on Filters
  useEffect(() => {
    let isMounted = true;
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        if (selectedSeasonId) {
          // A. Fetch Season Stats
          const [revenueRes, teamsRes, topScorersRes, disciplineRes] = await Promise.allSettled([
            statisticsApi.getSeasonRevenue(selectedSeasonId),
            statisticsApi.getTeamRegistrations(selectedSeasonId),
            statisticsApi.getTopScorers(selectedSeasonId, 10),
            statisticsApi.getTeamDiscipline(selectedSeasonId)
          ]);
          
          if (isMounted) {
            setSeasonStats({
              revenue: revenueRes.status === 'fulfilled' ? revenueRes.value?.data?.seasons?.[0] : null,
              teamRegistrations: teamsRes.status === 'fulfilled' ? teamsRes.value?.data?.seasons?.[0] : null,
              topScorers: topScorersRes.status === 'fulfilled' ? (topScorersRes.value?.data?.scorers || []) : [],
              discipline: disciplineRes.status === 'fulfilled' ? (disciplineRes.value?.data?.teams || []) : []
            });
          }
        } else {
          // B. Fetch System Overview Stats
          const results = await Promise.allSettled([
            tournamentApi.getAll({ per_page: 1 }),
            seasonApi.getAll({ per_page: 1 }),
            teamApi.getAll({ per_page: 1 }),
            userApi.getAll({ per_page: 1 }),
            statisticsApi.getSeasonRevenue(),
            statisticsApi.getUserRegistrations(selectedPeriod)
          ]);

          if (isMounted) {
            setOverviewStats({
              tournaments: results[0].status === 'fulfilled' ? (results[0].value?.data?.meta?.total || 0) : 0,
              seasons: results[1].status === 'fulfilled' ? (results[1].value?.data?.meta?.total || 0) : 0,
              teams: results[2].status === 'fulfilled' ? (results[2].value?.data?.meta?.total || 0) : 0,
              users: results[3].status === 'fulfilled' ? (results[3].value?.data?.meta?.total || 0) : 0,
              revenue: results[4].status === 'fulfilled' ? (results[4].value?.data?.total_net_revenue || 0) : 0,
              newUsers: results[5].status === 'fulfilled' ? (results[5].value?.data?.total_new_users || 0) : 0
            });
            
            const rawDaily = results[5].status === 'fulfilled' ? (results[5].value?.data?.daily || []) : [];
            // Format date for chart (e.g. "2023-10-01" -> "01/10")
            const formattedDaily = rawDaily.map(item => ({
              ...item,
              displayDate: item.day.split('-').slice(1, 3).reverse().join('/') 
            }));
            setDailyRegistrations(formattedDaily);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch dashboard stats:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchDashboardStats();
    return () => { isMounted = false; };
  }, [selectedSeasonId, selectedPeriod]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  // Pie chart data prep
  const pieData = useMemo(() => {
    if (!seasonStats.teamRegistrations) return [];
    const stats = seasonStats.teamRegistrations;
    return [
      { name: 'Chờ duyệt', value: stats.pending_count },
      { name: 'Đã duyệt', value: stats.approved_count },
      { name: 'Đang thi đấu', value: stats.active_count },
      { name: 'Bị loại', value: stats.eliminated_count },
      { name: 'Rút lui', value: stats.withdrawn_count }
    ].filter(item => item.value > 0);
  }, [seasonStats.teamRegistrations]);

  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-10">

        {/* Welcome Section */}
        <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg shadow-black/20 border-l-4 border-l-neon relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-neon tracking-tight mb-1 relative z-10">
              Xin chào, {user?.name || 'Admin'}! 👋
            </h2>
            <p className="text-gray-400 font-medium relative z-10">
              Tổng quan thống kê hệ thống quản lý giải đấu bóng đá.
            </p>
          </div>
          <Trophy className="w-20 h-20 text-neon opacity-20 absolute right-4 top-4 md:relative md:opacity-100 md:right-0 md:top-0" />
        </div>

        {/* Filters */}
        <div className="bg-navy-light/30 p-4 rounded-xl border border-navy-light flex flex-wrap gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Mùa giải</label>
            <select 
              className="bg-navy border border-navy-light text-white text-sm rounded-lg focus:ring-neon focus:border-neon block p-2 outline-none"
              value={selectedSeasonId}
              onChange={(e) => setSelectedSeasonId(e.target.value)}
            >
              <option value="">Tất cả mùa giải</option>
              {seasons.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {!selectedSeasonId && (
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Thời gian (User)</label>
              <select 
                className="bg-navy border border-navy-light text-white text-sm rounded-lg focus:ring-neon focus:border-neon block p-2 outline-none"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="7 ngày">7 ngày qua</option>
                <option value="30 ngày">30 ngày qua</option>
                <option value="90 ngày">90 ngày qua</option>
                <option value="3 tháng">3 tháng qua</option>
                <option value="6 tháng">6 tháng qua</option>
                <option value="1 năm">1 năm qua</option>
              </select>
            </div>
          )}
        </div>

        {/* C. SYSTEM OVERVIEW (Default) */}
        {!selectedSeasonId && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Vận hành Hệ thống</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Giải đấu" value={isLoading ? '—' : overviewStats.tournaments.toString()} icon={Trophy} colorClass="border-navy-light text-blue-400" />
                <StatCard title="Mùa giải" value={isLoading ? '—' : overviewStats.seasons.toString()} icon={ListChecks} colorClass="border-navy-light text-purple-400" />
                <StatCard title="Đội bóng" value={isLoading ? '—' : overviewStats.teams.toString()} icon={Shield} colorClass="border-navy-light text-emerald-400" />
                <StatCard title="Người dùng" value={isLoading ? '—' : overviewStats.users.toString()} icon={Users} colorClass="border-navy-light text-neon" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4">Tài chính & Tăng trưởng</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <StatCard title="Doanh thu hệ thống" value={isLoading ? '—' : formatCurrency(overviewStats.revenue)} icon={DollarSign} colorClass="border-navy-light text-yellow-400" />
                <StatCard title={`Người dùng mới`} value={isLoading ? '—' : `+${overviewStats.newUsers}`} icon={UserPlus} colorClass="border-navy-light text-pink-400" />
              </div>
            </div>

            {/* Line Chart for Users */}
            <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neon" /> Biểu đồ người dùng đăng ký ({selectedPeriod})
              </h3>
              <div className="h-[300px] w-full">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Đang tải biểu đồ...</div>
                ) : dailyRegistrations.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Không có dữ liệu</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyRegistrations}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A303C" vertical={false} />
                      <XAxis dataKey="displayDate" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#00e5ff' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                      />
                      <Line type="monotone" dataKey="count" name="Số đăng ký" stroke="#00e5ff" strokeWidth={3} dot={{ fill: '#00e5ff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* A. SEASON DETAILS (Season Selected) */}
        {selectedSeasonId && (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg border-l-4 border-l-purple-500">
               <h3 className="text-xl font-bold text-white mb-2">{seasonStats.revenue?.season_name || 'Chi tiết Mùa giải'}</h3>
               <p className="text-gray-400 text-sm">Thống kê chi tiết tài chính, đội bóng và chuyên môn.</p>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <StatCard 
                  title="Doanh thu xác nhận" 
                  value={isLoading ? '—' : formatCurrency(seasonStats.revenue?.confirmed_revenue)} 
                  icon={DollarSign} 
                  colorClass="border-navy-light text-emerald-400" 
                />
                <StatCard 
                  title="Đã hoàn tiền" 
                  value={isLoading ? '—' : formatCurrency(seasonStats.revenue?.refunded_amount)} 
                  icon={DollarSign} 
                  colorClass="border-navy-light text-red-400" 
                />
                <StatCard 
                  title="Doanh thu thực (Net)" 
                  value={isLoading ? '—' : formatCurrency(seasonStats.revenue?.net_revenue)} 
                  icon={DollarSign} 
                  colorClass="border-navy-light text-neon" 
                />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Team Registration Pie Chart */}
               <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                   <Users className="w-5 h-5 text-purple-400" /> Trạng thái đăng ký đội bóng
                 </h3>
                 <div className="h-[300px] w-full">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Đang tải biểu đồ...</div>
                    ) : pieData.length === 0 ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Không có dữ liệu đội bóng</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelStyle={{ fill: '#fff', fontSize: '12px' }}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                 </div>
               </div>

               {/* Top Scorers */}
               <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg overflow-hidden">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                   <Trophy className="w-5 h-5 text-yellow-400" /> Top Ghi Bàn
                 </h3>
                 <div className="overflow-x-auto max-h-[260px] custom-scrollbar">
                   <table className="w-full text-left text-sm text-gray-300">
                     <thead className="bg-navy-light/50 text-xs uppercase text-gray-400 sticky top-0 z-10">
                       <tr>
                         <th className="px-4 py-3 rounded-tl-lg">Cầu thủ</th>
                         <th className="px-4 py-3">Đội</th>
                         <th className="px-4 py-3 rounded-tr-lg text-center">Bàn thắng</th>
                       </tr>
                     </thead>
                     <tbody>
                       {isLoading ? (
                         <tr><td colSpan={3} className="text-center py-4">Đang tải...</td></tr>
                       ) : seasonStats.topScorers?.length === 0 ? (
                         <tr><td colSpan={3} className="text-center py-4">Chưa có dữ liệu</td></tr>
                       ) : (
                         seasonStats.topScorers?.map((scorer, idx) => (
                           <tr key={idx} className="border-b border-navy-light last:border-0 hover:bg-navy-light/30">
                             <td className="px-4 py-3 font-medium text-white">{scorer.player_name}</td>
                             <td className="px-4 py-3">{scorer.team_name}</td>
                             <td className="px-4 py-3 text-center text-neon font-bold">{scorer.goal_count}</td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
               
               {/* Discipline Stats */}
               <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg lg:col-span-2">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                   <AlertTriangle className="w-5 h-5 text-red-500" /> Kỷ luật (Thẻ phạt)
                 </h3>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-gray-300">
                     <thead className="bg-navy-light/50 text-xs uppercase text-gray-400">
                       <tr>
                         <th className="px-4 py-3 rounded-tl-lg">Đội bóng</th>
                         <th className="px-4 py-3 text-center text-yellow-500">Thẻ Vàng</th>
                         <th className="px-4 py-3 text-center text-red-500">Thẻ Đỏ</th>
                         <th className="px-4 py-3 rounded-tr-lg text-center">Điểm Kỷ Luật</th>
                       </tr>
                     </thead>
                     <tbody>
                       {isLoading ? (
                         <tr><td colSpan={4} className="text-center py-4">Đang tải...</td></tr>
                       ) : seasonStats.discipline?.length === 0 ? (
                         <tr><td colSpan={4} className="text-center py-4">Chưa có dữ liệu</td></tr>
                       ) : (
                         seasonStats.discipline?.map((team, idx) => (
                           <tr key={idx} className="border-b border-navy-light last:border-0 hover:bg-navy-light/30">
                             <td className="px-4 py-3 font-medium text-white">{team.team_name}</td>
                             <td className="px-4 py-3 text-center">{team.yellow_card_count}</td>
                             <td className="px-4 py-3 text-center">{team.red_card_count}</td>
                             <td className="px-4 py-3 text-center font-bold text-red-400">{team.disciplinary_points}</td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>

             </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
