import { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search, Loader2, Building2, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import useToastStore from '../../store/toastStore';

import { seasonTeamApi, roleApi, userApi } from '../../api';

export default function ApproveTeamsTab() {
  const toastError = useToastStore((state) => state.error);
  const toastSuccess = useToastStore((state) => state.success);
  const [pendingTeams, setPendingTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApproveId, setLoadingApproveId] = useState(null);
  const [loadingRejectId, setLoadingRejectId] = useState(null);

  // Filter & Pagination state
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPendingTeams = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await seasonTeamApi.getAll({ status: 'pending', limit: 100 });
      const data = res?.data?.data || res?.data || [];
      // map the data to the format used in UI
      const mapped = data.map(st => ({
        id: st.id,
        team_name: st.team?.name || 'Đội bóng ẩn',
        representative: st.user?.name || st.team?.user?.name || st.team?.coach_name || 'Không rõ',
        user_id: st.user_id || st.team?.user_id,
        season_name: st.season?.name || 'Giải đấu ẩn',
        season_id: st.season_id,
        requested_at: st.created_at,
        status: st.status
      }));
      setPendingTeams(mapped);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đội bóng chờ duyệt:', error);
      if (!silent) toastError('Không thể tải danh sách chờ duyệt.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTeams();
  }, []);

  const handleApprove = async (id, userId) => {
    try {
      setLoadingApproveId(id);
      await seasonTeamApi.approve(id);
      toastsuccess('Đã duyệt đội bóng tham gia giải!');

      // Tự động gán quyền Leader cho người đăng ký
      if (userId) {
        try {
          const rolesRes = await roleApi.getRoles();
          const rPayload = (typeof rolesRes?.status === 'boolean') ? rolesRes.data : rolesRes;
          const roles = Array.isArray(rPayload?.data) ? rPayload.data : Array.isArray(rPayload) ? rPayload : [];

          const leaderRole = roles.find(r => ['leader', 'đội trưởng', 'doitruong'].includes(r.name.toLowerCase()));

          if (leaderRole) {
            const userRes = await userApi.getUserById(userId);
            const uPayload = (typeof userRes?.status === 'boolean') ? userRes.data : userRes;
            const user = uPayload?.data || uPayload;

            const currentRoleIds = user?.roles?.map(r => r.id) || [];

            if (!currentRoleIds.includes(leaderRole.id)) {
              await userApi.updateProfile(userId, { role_ids: [...currentRoleIds, leaderRole.id] });
              toastsuccess(`Đã tự động cấp quyền Đội trưởng cho user đăng ký.`);
            }
          }
        } catch (e) {
          console.error("Lỗi khi cấp quyền Leader", e);
        }
      }
    } catch (error) {
      console.error('Lỗi duyệt:', error);
      const msg = error.response?.data?.message || 'Lỗi khi duyệt đội bóng.';
      const details = error.response?.data?.details;
      let errorText = msg;
      if (details) {
        if (typeof details === 'string') errorText += ` - ${details}`;
        else if (Array.isArray(details)) errorText += ` - ${details.map(d => typeof d === 'string' ? d : JSON.stringify(d)).join(', ')}`;
        else errorText += ` - ${JSON.stringify(details)}`;
      }
      toastError(errorText);
    } finally {
      await fetchPendingTeams(true);
      setLoadingApproveId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoadingRejectId(id);
      // Backend does not have "rejected" status, soft-delete the pending registration to reject it
      await seasonTeamApi.delete(id);
      toastsuccess('Đã từ chối yêu cầu tham gia giải!');
    } catch (error) {
      console.error('Lỗi từ chối:', error);
      const msg = error.response?.data?.message || 'Lỗi khi từ chối đội bóng.';
      const details = error.response?.data?.details;
      let errorText = msg;
      if (details) {
        if (typeof details === 'string') errorText += ` - ${details}`;
        else if (Array.isArray(details)) errorText += ` - ${details.map(d => typeof d === 'string' ? d : JSON.stringify(d)).join(', ')}`;
        else errorText += ` - ${JSON.stringify(details)}`;
      }
      toastError(errorText);
    } finally {
      await fetchPendingTeams(true);
      setLoadingRejectId(null);
    }
  };

  const uniqueSeasons = useMemo(() => {
    const seasons = pendingTeams.map(t => t.season_name);
    return ['All', ...new Set(seasons)];
  }, [pendingTeams]);

  const filteredTeams = useMemo(() => {
    if (selectedSeason === 'All') return pendingTeams;
    return pendingTeams.filter(t => t.season_name === selectedSeason);
  }, [pendingTeams, selectedSeason]);

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

  const currentTeams = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeams.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeams, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSeason]);

  return (
    <div className="bg-navy-dark/50 backdrop-blur-md p-6 rounded-2xl border border-navy-light/50 shadow-2xl">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-neon" />
            Duyệt Đội bóng đăng ký giải đấu
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Danh sách các đội bóng đang chờ bạn duyệt để tham gia vào giải đấu.
          </p>
        </div>

        {pendingTeams.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="pl-9 pr-8 py-2 bg-navy-dark border border-navy-light rounded-xl text-white text-sm focus:outline-none focus:border-neon appearance-none"
              >
                {uniqueSeasons.map(season => (
                  <option key={season} value={season}>
                    {season === 'All' ? 'Tất cả giải đấu' : season}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-navy/50 rounded-xl border border-navy-light/50">
          <Loader2 className="w-10 h-10 animate-spin text-neon mb-4" />
          <p className="text-gray-400 font-medium animate-pulse">Đang tải danh sách chờ duyệt...</p>
        </div>
      ) : pendingTeams.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neon/30 rounded-2xl bg-neon/5">
          <div className="w-20 h-20 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10 text-neon" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Không có yêu cầu nào!</h3>
          <p className="text-gray-400 max-w-md mx-auto">Hiện tại không có đội bóng nào đang chờ duyệt để tham gia các giải đấu.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy-light bg-navy/80 shadow-inner">
          <div className="px-6 py-4 border-b border-navy-light bg-navy-dark/80 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse"></span>
              Yêu cầu chờ duyệt ({filteredTeams.length})
            </h3>
          </div>

          {/* Mobile view (Cards) */}
          <div className="md:hidden divide-y divide-navy-light/50">
            {currentTeams.map(t => (
              <div key={t.id} className="p-4 hover:bg-navy-light/10 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                      {t.team_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{t.team_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(t.requested_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Chờ duyệt
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Giải đấu:</span>
                    <span className="text-gray-200 font-medium">{t.season_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Đại diện:</span>
                    <span className="text-gray-200 font-medium">{t.representative}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(t.id, t.user_id)}
                    disabled={loadingApproveId === t.id || loadingRejectId === t.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-linear-to-r from-neon to-cyan-500 text-black font-bold text-sm disabled:opacity-50"
                  >
                    {loadingApproveId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Duyệt
                  </button>
                  <button
                    onClick={() => handleReject(t.id)}
                    disabled={loadingRejectId === t.id || loadingApproveId === t.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-navy-dark border border-red-500/30 text-red-400 font-bold text-sm disabled:opacity-50"
                  >
                    {loadingRejectId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view (Table) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[900px]">
              <thead className="bg-navy/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="py-4 px-6 font-semibold">Đội bóng</th>
                  <th className="py-4 px-6 font-semibold">Giải đấu đăng ký</th>
                  <th className="py-4 px-6 font-semibold">Người đại diện</th>
                  <th className="py-4 px-6 font-semibold text-center">Trạng thái</th>
                  <th className="py-4 px-6 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-light/50">
                {currentTeams.map(t => {
                  const initials = t.team_name.substring(0, 2).toUpperCase();

                  return (
                    <tr key={t.id} className="hover:bg-navy-light/20 transition-all duration-300 group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-white text-base">{t.team_name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Yêu cầu lúc: {new Date(t.requested_at).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-neon" />
                          <span className="font-medium text-gray-300">{t.season_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-300">
                        {t.representative}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          Chờ duyệt
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleApprove(t.id, t.user_id)}
                            disabled={loadingApproveId === t.id || loadingRejectId === t.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-neon to-cyan-500 text-black font-bold hover:from-cyan-400 hover:to-neon shadow-lg shadow-neon/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                          >
                            {loadingApproveId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleReject(t.id)}
                            disabled={loadingRejectId === t.id || loadingApproveId === t.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-dark border border-red-500/30 text-red-400 font-bold hover:bg-red-500/10 hover:border-red-500/50 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                          >
                            {loadingRejectId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            Từ chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark/80 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredTeams.length)} trong số {filteredTeams.length} đội
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${currentPage === page
                        ? 'bg-neon text-black'
                        : 'bg-navy border border-navy-light text-gray-400 hover:text-white'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
