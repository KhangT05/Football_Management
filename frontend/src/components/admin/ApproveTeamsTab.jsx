import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search, Loader2, Building2, Calendar } from 'lucide-react';
import useToastStore from '../../store/toastStore';

import { seasonTeamApi } from '../../api';

export default function ApproveTeamsTab() {
  const toast = useToastStore();
  const [pendingTeams, setPendingTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingActionId, setLoadingActionId] = useState(null);

  const fetchPendingTeams = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await seasonTeamApi.getAll({ status: 'pending', limit: 100 });
      const data = res?.data?.data || res?.data || [];
      // map the data to the format used in UI
      const mapped = data.map(st => ({
        id: st.id,
        team_name: st.team?.name || 'Đội bóng ẩn',
        coach: st.team?.coach_name || st.team?.user?.name || 'Không rõ',
        season_name: st.season?.name || 'Giải đấu ẩn',
        requested_at: st.created_at,
        status: st.status
      }));
      setPendingTeams(mapped);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đội bóng chờ duyệt:', error);
      if (!silent) toast.error('Không thể tải danh sách chờ duyệt.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTeams();
  }, []);

  const handleApprove = async (id) => {
    try {
      setLoadingActionId(id);
      await seasonTeamApi.approve(id);
      toast.success('Đã duyệt đội bóng tham gia giải!');
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
      toast.error(errorText);
    } finally {
      await fetchPendingTeams(true);
      setLoadingActionId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoadingActionId(id);
      // Backend does not have "rejected" status, soft-delete the pending registration to reject it
      await seasonTeamApi.delete(id);
      toast.success('Đã từ chối yêu cầu tham gia giải!');
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
      toast.error(errorText);
    } finally {
      await fetchPendingTeams(true);
      setLoadingActionId(null);
    }
  };

  return (
    <div className="bg-navy-dark/50 backdrop-blur-md p-6 rounded-2xl border border-navy-light/50 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-neon" /> 
          Duyệt Đội bóng đăng ký giải đấu
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Danh sách các đội bóng đang chờ bạn duyệt để tham gia vào giải đấu.
        </p>
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
              Yêu cầu chờ duyệt ({pendingTeams.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
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
                {pendingTeams.map(t => {
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
                        {t.coach}
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
                            onClick={() => handleApprove(t.id)}
                            disabled={loadingActionId === t.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-neon to-cyan-500 text-black font-bold hover:from-cyan-400 hover:to-neon shadow-lg shadow-neon/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                          >
                            {loadingActionId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleReject(t.id)}
                            disabled={loadingActionId === t.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-dark border border-red-500/30 text-red-400 font-bold hover:bg-red-500/10 hover:border-red-500/50 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                          >
                            {loadingActionId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
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
        </div>
      )}
    </div>
  );
}
