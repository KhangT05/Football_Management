import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search, Loader2, Building2 } from 'lucide-react';
import { teamApi, playerApi } from '../../api';
import useToastStore from '../../store/toastStore';
import { INPUT } from '../../utils/adminStyles';

export default function ApprovePlayersTab() {
  const toast = useToastStore();
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState(null);

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await teamApi.getAll({ per_page: 100 });
      const data = res.data?.data || res.data || [];
      setTeams(data);
    } catch {
      toast.error('Lỗi khi tải danh sách đội bóng');
    }
  };

  const fetchTeamPlayers = async (teamId) => {
    if (!teamId) return setPlayers([]);
    setLoading(true);
    try {
      const res = await playerApi.listTeamPlayers(teamId, { per_page: 100 });
      const data = res.data?.data || res.data || [];
      setPlayers(data);
    } catch {
      toast.error('Lỗi tải danh sách cầu thủ');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamChange = (e) => {
    const tid = e.target.value;
    setSelectedTeamId(tid);
    fetchTeamPlayers(tid);
  };

  const handleApprove = async (playerId) => {
    setLoadingActionId(playerId);
    try {
      await playerApi.approve(selectedTeamId, playerId);
      toast.success('Đã duyệt cầu thủ!');
      fetchTeamPlayers(selectedTeamId);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi duyệt cầu thủ');
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleReject = async (playerId) => {
    setLoadingActionId(playerId);
    try {
      await playerApi.reject(selectedTeamId, playerId);
      toast.success('Đã từ chối cầu thủ!');
      fetchTeamPlayers(selectedTeamId);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi từ chối cầu thủ');
    } finally {
      setLoadingActionId(null);
    }
  };

  const pendingPlayers = players.filter(p => p.approval_status === 'pending');

  return (
    <div className="bg-navy p-6 rounded-xl border border-navy-light shadow-xl">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
            <Building2 className="w-4 h-4" /> Chọn Đội Bóng
          </label>
          <select 
            className={INPUT} 
            value={selectedTeamId}
            onChange={handleTeamChange}
          >
            <option value="">-- Chọn đội bóng để xét duyệt cầu thủ --</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : selectedTeamId && pendingPlayers.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-navy-light rounded-xl bg-navy-dark/30">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-gray-300">Không có cầu thủ chờ duyệt</h3>
          <p className="text-gray-500 text-sm mt-1">Đội bóng này không có cầu thủ nào đang ở trạng thái chờ duyệt.</p>
        </div>
      ) : selectedTeamId && pendingPlayers.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-navy-light bg-navy-dark">
          <table className="w-full text-left whitespace-nowrap min-w-[600px]">
            <thead className="bg-navy-light/30 border-b border-navy-light text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Số áo</th>
                <th className="py-3 px-4">Tên cầu thủ</th>
                <th className="py-3 px-4">Vị trí</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-light">
              {pendingPlayers.map(p => (
                <tr key={p.id} className="hover:bg-navy-light/10 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-300">{p.jersey_number ?? '—'}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{p.player?.name ?? p.name ?? '—'}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{p.position ?? '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Chờ duyệt
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={loadingActionId === p.id}
                        className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 disabled:opacity-50"
                        title="Duyệt"
                      >
                        {loadingActionId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        disabled={loadingActionId === p.id}
                        className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 disabled:opacity-50"
                        title="Từ chối"
                      >
                        {loadingActionId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-navy-light rounded-xl bg-navy-dark/30">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-400">Chọn một đội bóng</h3>
          <p className="text-gray-500 text-sm mt-1">Vui lòng chọn đội bóng từ danh sách thả xuống để xem các cầu thủ đang chờ duyệt.</p>
        </div>
      )}
    </div>
  );
}
