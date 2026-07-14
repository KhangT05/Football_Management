import { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Users, Trophy, ListChecks, Shield, DollarSign, UserPlus,
  TrendingUp, AlertTriangle, Target, Calendar, Ban
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import useAuthStore from '../../store/authStore';
import { useShallow } from 'zustand/react/shallow';
import { seasonApi, statisticsApi } from '../../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PERIOD_OPTIONS = [
  { value: '7d', label: '7 ngày qua' },
  { value: '30d', label: '30 ngày qua' },
  { value: '90d', label: '90 ngày qua' },
  { value: '3m', label: '3 tháng qua' },
  { value: '6m', label: '6 tháng qua' },
  { value: '1y', label: '1 năm qua' },
];

const GRANULARITY_OPTIONS = [
  { value: 'day', label: 'Ngày' },
  { value: 'month', label: 'Tháng' },
  { value: 'year', label: 'Năm' },
];

const formatSuspendedDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN');
};

export default function Dashboard() {
  const { user } = useAuthStore(useShallow(state => ({ user: state.user })));

  const userRoles = Array.isArray(user?.roles)
    ? user.roles.map(r => typeof r === 'string' ? r.toLowerCase() : r)
    : (user?.role ? [typeof user.role === 'string' ? user.role.toLowerCase() : user.role] : []);
  const isAdmin = userRoles.includes('admin') || user?.is_admin === true;
  const isOrganizing = userRoles.includes('organizing');

  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const [overviewStats, setOverviewStats] = useState({
    tournaments: 0, seasons: 0, teams: 0, users: 0, revenue: 0, newUsers: 0
  });
  const [dailyRegistrations, setDailyRegistrations] = useState([]);

  const [seasonStats, setSeasonStats] = useState({
    revenue: null,
    teamRegistrations: null,
    topScorers: [],
    discipline: [],
    suspendedPlayers: []
  });

  // NEW — Standings (PhaseStandingsBlock | null)
  const [standingsBlock, setStandingsBlock] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamOverview, setTeamOverview] = useState(null);
  const [teamTimeSeries, setTeamTimeSeries] = useState([]);
  const [teamGranularity, setTeamGranularity] = useState('month');
  const [isTeamLoading, setIsTeamLoading] = useState(false);

  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [playerOverview, setPlayerOverview] = useState(null);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);

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

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        if (selectedSeasonId) {
          const [revenueRes, teamsRes, topScorersRes, disciplineRes, suspendedRes, standingsRes] = await Promise.allSettled([
            statisticsApi.getSeasonRevenue(selectedSeasonId),
            statisticsApi.getTeamRegistrations(selectedSeasonId),
            statisticsApi.getTopScorers(selectedSeasonId, 10),
            statisticsApi.getTeamDiscipline(selectedSeasonId),
            seasonApi.getSuspendedPlayers(selectedSeasonId),
            statisticsApi.getActiveStandings(selectedSeasonId)
          ]);

          if (isMounted) {
            const revData = revenueRes.status === 'fulfilled' ? (revenueRes.value?.data || revenueRes.value) : null;
            const tmsData = teamsRes.status === 'fulfilled' ? (teamsRes.value?.data || teamsRes.value) : null;
            const topData = topScorersRes.status === 'fulfilled' ? (topScorersRes.value?.data || topScorersRes.value) : null;
            const disData = disciplineRes.status === 'fulfilled' ? (disciplineRes.value?.data || disciplineRes.value) : null;
            const susData = suspendedRes.status === 'fulfilled' ? (suspendedRes.value?.data || suspendedRes.value) : null;
            const susList = Array.isArray(susData?.data) ? susData.data : (Array.isArray(susData) ? susData : []);

            // standingsRes.value có thể là `null` hợp lệ (chưa vào vòng bảng)
            // — phân biệt với "fetch fail" (rejected). Không coi null là lỗi.
            const stdRaw = standingsRes.status === 'fulfilled' ? (standingsRes.value?.data ?? standingsRes.value) : null;
            setStandingsBlock(stdRaw ?? null);

            setSeasonStats({
              revenue: revData?.seasons?.[0] || null,
              teamRegistrations: tmsData?.seasons?.[0] || null,
              topScorers: topData?.scorers || [],
              discipline: disData?.teams || [],
              suspendedPlayers: susList
            });
          }
        } else {
          const [overviewRes, registrationsRes] = await Promise.allSettled([
            statisticsApi.getSystemOverview(selectedPeriod),
            statisticsApi.getUserRegistrations(selectedPeriod)
          ]);

          if (isMounted) {
            const ov = overviewRes.status === 'fulfilled' ? (overviewRes.value?.data || overviewRes.value) : null;
            setOverviewStats({
              tournaments: ov?.tournament_count || 0,
              seasons: ov?.season_count || 0,
              teams: ov?.team_count || 0,
              users: ov?.user_count || 0,
              revenue: ov?.total_revenue || 0,
              newUsers: ov?.new_user_count || 0
            });

            const regData = registrationsRes.status === 'fulfilled' ? (registrationsRes.value?.data || registrationsRes.value) : null;
            const rawDaily = regData?.daily || [];
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

  useEffect(() => {
    setSelectedTeamId(null);
    setTeamOverview(null);
    setTeamTimeSeries([]);
    setSelectedPlayerId(null);
    setPlayerOverview(null);
    setStandingsBlock(null);   // NEW — reset tránh dính bảng xếp hạng season cũ
    setSelectedGroupId(null);  // NEW
  }, [selectedSeasonId]);

  // NEW — auto-chọn group đầu tiên khi standingsBlock load xong / đổi season
  useEffect(() => {
    if (standingsBlock?.groups?.length) {
      setSelectedGroupId(prev =>
        standingsBlock.groups.some(g => g.groupId === prev) ? prev : standingsBlock.groups[0].groupId
      );
    } else {
      setSelectedGroupId(null);
    }
  }, [standingsBlock]);

  useEffect(() => {
    if (!selectedTeamId) return;
    let isMounted = true;
    setIsTeamLoading(true);
    Promise.allSettled([
      statisticsApi.getTeamOverview(selectedTeamId),
      statisticsApi.getTeamMatchTimeSeries(selectedTeamId, { granularity: teamGranularity }),
    ]).then(([ovRes, tsRes]) => {
      if (!isMounted) return;
      const ovData = ovRes.status === 'fulfilled' ? (ovRes.value?.data || ovRes.value) : null;
      const tsData = tsRes.status === 'fulfilled' ? (tsRes.value?.data || tsRes.value) : null;
      setTeamOverview(ovData);
      setTeamTimeSeries(tsData?.points || []);
    }).finally(() => { if (isMounted) setIsTeamLoading(false); });
    return () => { isMounted = false; };
  }, [selectedTeamId, teamGranularity]);

  useEffect(() => {
    if (!selectedPlayerId) return;
    let isMounted = true;
    setIsPlayerLoading(true);
    statisticsApi.getPlayerOverview(selectedPlayerId)
      .then((res) => { if (isMounted) setPlayerOverview(res?.data || res); })
      .catch(() => { if (isMounted) setPlayerOverview(null); })
      .finally(() => { if (isMounted) setIsPlayerLoading(false); });
    return () => { isMounted = false; };
  }, [selectedPlayerId]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

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

  // NEW — group đang chọn để render bảng
  const activeGroup = useMemo(() => {
    if (!standingsBlock?.groups?.length) return null;
    return standingsBlock.groups.find(g => g.groupId === selectedGroupId) || standingsBlock.groups[0];
  }, [standingsBlock, selectedGroupId]);

  const periodLabel = PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.label || '';

  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-10">

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

        <div className="bg-navy-light/30 p-4 rounded-xl border border-navy-light flex flex-wrap gap-4 items-center">
          {isOrganizing && (
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
          )}

          {!selectedSeasonId && (
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Thời gian (Thống kê)</label>
              <select
                className="bg-navy border border-navy-light text-white text-sm rounded-lg focus:ring-neon focus:border-neon block p-2 outline-none"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                {PERIOD_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {!selectedSeasonId && (
          <div className="space-y-8 animate-fade-in">
            {(isOrganizing || isAdmin) && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Vận hành Hệ thống</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isOrganizing && <StatCard title="Giải đấu" value={isLoading ? '—' : overviewStats.tournaments.toString()} icon={Trophy} colorClass="border-navy-light text-blue-400" />}
                  {isOrganizing && <StatCard title="Mùa giải" value={isLoading ? '—' : overviewStats.seasons.toString()} icon={ListChecks} colorClass="border-navy-light text-purple-400" />}
                  {isOrganizing && <StatCard title="Đội bóng" value={isLoading ? '—' : overviewStats.teams.toString()} icon={Shield} colorClass="border-navy-light text-emerald-400" />}
                  {isAdmin && <StatCard title="Người dùng" value={isLoading ? '—' : overviewStats.users.toString()} icon={Users} colorClass="border-navy-light text-neon" />}
                </div>
              </div>
            )}

            {(isOrganizing || isAdmin) && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">{isOrganizing ? "Tài chính & Tăng trưởng" : "Tăng trưởng"}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {isOrganizing && <StatCard title="Doanh thu hệ thống" value={isLoading ? '—' : formatCurrency(overviewStats.revenue)} icon={DollarSign} colorClass="border-navy-light text-yellow-400" />}
                  {isAdmin && <StatCard title="Người dùng mới" value={isLoading ? '—' : `+${overviewStats.newUsers}`} icon={UserPlus} colorClass="border-navy-light text-pink-400" />}
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-neon" /> Biểu đồ người dùng đăng ký ({periodLabel})
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
            )}
          </div>
        )}

        {selectedSeasonId && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg border-l-4 border-l-purple-500">
              <h3 className="text-xl font-bold text-white mb-2">{seasonStats.revenue?.season_name || 'Chi tiết Mùa giải'}</h3>
              <p className="text-gray-400 text-sm">Thống kê chi tiết tài chính, đội bóng và chuyên môn. Bấm vào một dòng trong bảng để xem chi tiết.</p>
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

            {/* NEW — BẢNG XẾP HẠNG (group-aware). Tự thích ứng 1 group hay nhiều
                group — không hardcode giả định. null = chưa vào vòng bảng
                (trạng thái hợp lệ, không phải lỗi/loading). */}
            <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-neon" /> Bảng xếp hạng
                  {standingsBlock?.phaseName && (
                    <span className="text-xs font-normal text-gray-400 ml-2">({standingsBlock.phaseName})</span>
                  )}
                </h3>
                {standingsBlock?.groups?.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {standingsBlock.groups.map(g => (
                      <button
                        key={g.groupId}
                        onClick={() => setSelectedGroupId(g.groupId)}
                        className={`px-3 py-1 text-xs rounded-lg border transition-colors ${selectedGroupId === g.groupId ? 'bg-neon text-navy border-neon font-bold' : 'border-navy-light text-gray-400 hover:text-white'}`}
                      >
                        {g.groupName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-gray-400">Đang tải...</div>
              ) : !standingsBlock ? (
                <div className="text-center py-8 text-gray-400">Mùa giải chưa vào vòng bảng</div>
              ) : !activeGroup ? (
                <div className="text-center py-8 text-gray-400">Chưa có dữ liệu bảng xếp hạng</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-navy-light/50 text-xs uppercase text-gray-400">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">#</th>
                        <th className="px-4 py-3">Đội bóng</th>
                        <th className="px-4 py-3 text-center">Trận</th>
                        <th className="px-4 py-3 text-center">T</th>
                        <th className="px-4 py-3 text-center">H</th>
                        <th className="px-4 py-3 text-center">B</th>
                        <th className="px-4 py-3 text-center">BT</th>
                        <th className="px-4 py-3 text-center">BB</th>
                        <th className="px-4 py-3 text-center">HS</th>
                        <th className="px-4 py-3 rounded-tr-lg text-center">Điểm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeGroup.standings.length === 0 ? (
                        <tr><td colSpan={10} className="text-center py-4">Chưa có dữ liệu</td></tr>
                      ) : (
                        activeGroup.standings.map((row) => {
                          const gd = row.goals_for - row.goals_against;
                          return (
                            <tr
                              key={row.id}
                              onClick={() => setSelectedTeamId(row.team_id)}
                              className={`border-b border-navy-light last:border-0 hover:bg-navy-light/30 cursor-pointer transition-colors ${selectedTeamId === row.team_id ? 'bg-navy-light/50' : ''}`}
                            >
                              <td className="px-4 py-3 font-bold text-gray-400">{row.position}</td>
                              <td className="px-4 py-3 font-medium text-white">
                                {row.team?.name || `Đội #${row.team_id}`}
                              </td>
                              <td className="px-4 py-3 text-center">{row.matches_played}</td>
                              <td className="px-4 py-3 text-center text-emerald-400">{row.wins}</td>
                              <td className="px-4 py-3 text-center text-yellow-400">{row.draws}</td>
                              <td className="px-4 py-3 text-center text-red-400">{row.losses}</td>
                              <td className="px-4 py-3 text-center">{row.goals_for}</td>
                              <td className="px-4 py-3 text-center">{row.goals_against}</td>
                              <td className="px-4 py-3 text-center">{gd > 0 ? `+${gd}` : gd}</td>
                              <td className="px-4 py-3 text-center font-black text-neon">{row.points}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                          <tr
                            key={idx}
                            onClick={() => setSelectedPlayerId(scorer.player_id)}
                            className={`border-b border-navy-light last:border-0 hover:bg-navy-light/30 cursor-pointer transition-colors ${selectedPlayerId === scorer.player_id ? 'bg-navy-light/50' : ''}`}
                          >
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
                          <tr
                            key={idx}
                            onClick={() => setSelectedTeamId(team.team_id)}
                            className={`border-b border-navy-light last:border-0 hover:bg-navy-light/30 cursor-pointer transition-colors ${selectedTeamId === team.team_id ? 'bg-navy-light/50' : ''}`}
                          >
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

              <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg lg:col-span-2">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-500" /> Cầu thủ đang treo giò
                  {!isLoading && (
                    <span className="text-xs font-black text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full ml-2">
                      {seasonStats.suspendedPlayers?.length || 0}
                    </span>
                  )}
                </h3>
                <div className="overflow-x-auto max-h-[300px] custom-scrollbar">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-navy-light/50 text-xs uppercase text-gray-400 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Cầu thủ</th>
                        <th className="px-4 py-3">Đội</th>
                        <th className="px-4 py-3 text-center">Trận còn treo</th>
                        <th className="px-4 py-3 rounded-tr-lg text-center">Cập nhật lúc</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan={4} className="text-center py-4">Đang tải...</td></tr>
                      ) : seasonStats.suspendedPlayers?.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-4">Không có cầu thủ nào bị treo giò</td></tr>
                      ) : (
                        seasonStats.suspendedPlayers?.map((row, idx) => (
                          <tr key={row.id ?? idx} className="border-b border-navy-light last:border-0">
                            <td className="px-4 py-3 font-medium text-white">
                              {row.player?.user?.name || row.player?.name || `Cầu thủ #${row.player_id}`}
                            </td>
                            <td className="px-4 py-3">{row.team?.name || `Đội #${row.team_id}`}</td>
                            <td className="px-4 py-3 text-center text-red-400 font-bold">
                              {row.suspension_matches_remaining ?? '—'}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-400">
                              {formatSuspendedDate(row.updated_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {selectedTeamId && (
              <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg animate-fade-in">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    {isTeamLoading ? 'Đang tải...' : (teamOverview?.team_name || 'Chi tiết đội')}
                  </h3>
                  <div className="flex gap-2 items-center">
                    {GRANULARITY_OPTIONS.map(g => (
                      <button
                        key={g.value}
                        onClick={() => setTeamGranularity(g.value)}
                        className={`px-3 py-1 text-xs rounded-lg border transition-colors ${teamGranularity === g.value ? 'bg-neon text-navy border-neon font-bold' : 'border-navy-light text-gray-400 hover:text-white'}`}
                      >
                        {g.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedTeamId(null)}
                      className="px-3 py-1 text-xs rounded-lg border border-navy-light text-gray-400 hover:text-white"
                    >
                      ✕ Đóng
                    </button>
                  </div>
                </div>

                {teamOverview && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                    <StatCard title="Tổng trận" value={teamOverview.total_matches_played} icon={ListChecks} colorClass="border-navy-light text-gray-300" />
                    <StatCard title="Thắng" value={teamOverview.total_wins} icon={Trophy} colorClass="border-navy-light text-emerald-400" />
                    <StatCard title="Hòa" value={teamOverview.total_draws} icon={Shield} colorClass="border-navy-light text-yellow-400" />
                    <StatCard title="Thua" value={teamOverview.total_losses} icon={AlertTriangle} colorClass="border-navy-light text-red-400" />
                    <StatCard
                      title="Hiệu số"
                      value={teamOverview.goal_difference > 0 ? `+${teamOverview.goal_difference}` : teamOverview.goal_difference}
                      icon={Target}
                      colorClass="border-navy-light text-neon"
                    />
                  </div>
                )}

                <div className="h-[280px] w-full">
                  {isTeamLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Đang tải biểu đồ...</div>
                  ) : teamTimeSeries.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Chưa có trận đã kết thúc</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamTimeSeries}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A303C" vertical={false} />
                        <XAxis dataKey="bucket" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="wins" name="Thắng" stackId="a" fill="#10b981" />
                        <Bar dataKey="draws" name="Hòa" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="losses" name="Thua" stackId="a" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}

            {selectedPlayerId && (
              <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-neon" />
                    {isPlayerLoading ? 'Đang tải...' : (playerOverview?.player_name || 'Chi tiết cầu thủ')}
                  </h3>
                  <button
                    onClick={() => setSelectedPlayerId(null)}
                    className="px-3 py-1 text-xs rounded-lg border border-navy-light text-gray-400 hover:text-white"
                  >
                    ✕ Đóng
                  </button>
                </div>

                {isPlayerLoading ? (
                  <div className="text-gray-400 text-sm py-4">Đang tải...</div>
                ) : playerOverview && (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <StatCard title="Giải đã tham gia" value={playerOverview.tournament_count} icon={Trophy} colorClass="border-navy-light text-blue-400" />
                      <StatCard title="Đội đã khoác áo" value={playerOverview.team_count} icon={Shield} colorClass="border-navy-light text-emerald-400" />
                      <StatCard title="Mùa giải đã đá" value={playerOverview.season_count} icon={Calendar} colorClass="border-navy-light text-purple-400" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <StatCard title="Tổng trận" value={playerOverview.total_matches_played} icon={ListChecks} colorClass="border-navy-light text-gray-300" />
                      <StatCard title="Tổng bàn thắng" value={playerOverview.total_goals} icon={Target} colorClass="border-navy-light text-neon" />
                      <StatCard title="Tổng kiến tạo" value={playerOverview.total_assists} icon={TrendingUp} colorClass="border-navy-light text-cyan-400" />
                      <StatCard title="Thẻ (V/Đ)" value={`${playerOverview.total_yellow_cards}/${playerOverview.total_red_cards}`} icon={AlertTriangle} colorClass="border-navy-light text-yellow-400" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}