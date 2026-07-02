import { useState, useEffect } from 'react';
import { Users, Shuffle, Save, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { seasonTeamApi, groupApi, seasonApi } from '../../api';
import useToastStore from '../../store/toastStore';
import useTeamStore from '../../store/teamStore';
import { useShallow } from 'zustand/react/shallow';

export default function GroupDrawUI({ seasonId }) {
  const toast = useToastStore();
  const { teams } = useTeamStore(useShallow(state => ({ teams: state.teams })));
  
  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // States cho API call
  const [phaseId, setPhaseId] = useState('');
  const [teamsPerGroup, setTeamsPerGroup] = useState(4);
  const [numPots, setNumPots] = useState(4);
  
  // Hiển thị kết quả bốc thăm
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [totalTeams, setTotalTeams] = useState(0);

  useEffect(() => {
    if (phaseId) {
      loadStandings();
      loadTotalTeams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseId, seasonId]);

  const loadTotalTeams = async () => {
    try {
      const res = await seasonTeamApi.getAll({ season_id: seasonId, per_page: 500 });
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      const allTeams = Array.isArray(payload?.data) ? payload.data : [];
      const seasonTeams = allTeams.filter(st => String(st.season_id) === String(seasonId));
      const approved = seasonTeams.filter(st => st.status === 'approved');
      setTotalTeams(approved.length);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStandings = async () => {
    setLoading(true);
    try {
      // Dùng API standings để lấy cấu trúc groups hiện tại của season
      const res = await seasonApi.getStandings(seasonId);
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      const standings = Array.isArray(payload) ? payload : [];
      setAssignedGroups(standings);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách bảng đấu');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawRandom = async () => {
    if (!phaseId) return toast.error('Vui lòng nhập ID Vòng bảng (Phase ID)');
    setIsDrawing(true);
    try {
      await groupApi.drawGroups(phaseId, { teams_per_group: Number(teamsPerGroup) });
      toast.success('Bốc thăm ngẫu nhiên thành công!');
      loadStandings();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi bốc thăm ngẫu nhiên');
    } finally {
      setIsDrawing(false);
    }
  };

  const handleDrawSeeded = async () => {
    if (!phaseId) return toast.error('Vui lòng nhập ID Vòng bảng (Phase ID)');
    setIsDrawing(true);
    try {
      await groupApi.drawSeeded(phaseId, { teams_per_group: Number(teamsPerGroup), num_pots: Number(numPots) });
      toast.success('Bốc thăm hạt giống thành công!');
      loadStandings();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi bốc thăm hạt giống');
    } finally {
      setIsDrawing(false);
    }
  };

  const handleClearDraw = async () => {
    if (!phaseId) return toast.error('Vui lòng nhập ID Vòng bảng (Phase ID)');
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ kết quả bốc thăm của vòng này?')) return;
    setIsDrawing(true);
    try {
      await groupApi.clearDraw(phaseId);
      toast.success('Đã xóa kết quả bốc thăm!');
      setAssignedGroups([]);
      loadStandings();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi xóa bốc thăm');
    } finally {
      setIsDrawing(false);
    }
  };

  const getTeamName = (teamId) => {
    return teams.find(t => t.id === Number(teamId))?.name ?? `Đội #${teamId}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-navy border border-navy-light p-5 rounded-2xl shadow-xl shadow-black/20">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mb-4">
          <Shuffle className="w-5 h-5 text-purple-400" /> API Bốc thăm chia bảng
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-1">Phase ID (Bắt buộc)</label>
            <input 
              type="number"
              value={phaseId}
              onChange={e => setPhaseId(e.target.value)}
              placeholder="VD: 1, 2"
              className="w-full bg-navy-dark border border-navy-light rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-[10px] text-gray-500 mt-1">ID của Phase loại Group trong DB</p>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-1">Số đội mỗi bảng</label>
            <input 
              type="number"
              value={teamsPerGroup}
              onChange={e => setTeamsPerGroup(e.target.value)}
              className="w-full bg-navy-dark border border-navy-light rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-1">Số hạt giống (Seeded)</label>
            <input 
              type="number"
              value={numPots}
              onChange={e => setNumPots(e.target.value)}
              className="w-full bg-navy-dark border border-navy-light rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-1">Tổng đội tham gia</label>
            <div className="w-full bg-navy-dark border border-navy-light rounded-lg px-3 py-2 text-emerald-400 font-bold">
              {totalTeams} đội
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleDrawRandom} 
            disabled={isDrawing || loading}
            className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {isDrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
            Bốc thăm Ngẫu nhiên
          </button>

          <button 
            onClick={handleDrawSeeded} 
            disabled={isDrawing || loading}
            className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isDrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
            Bốc thăm Có Hạt Giống
          </button>

          <button 
            onClick={handleClearDraw} 
            disabled={isDrawing || loading || assignedGroups.length === 0}
            className="flex items-center gap-2 bg-navy-dark border border-red-500/30 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-50 ml-auto"
          >
            <Trash2 className="w-4 h-4" /> Xóa Bốc Thăm
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
      ) : assignedGroups.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignedGroups.map((group) => (
            <div key={group.groupId} className="bg-navy border border-navy-light rounded-xl overflow-hidden shadow-lg">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 py-4 px-5 text-white flex justify-between items-center shadow-inner">
                <h4 className="font-black text-lg tracking-wide uppercase flex items-center gap-2">
                  {group.groupName} <span className="text-blue-200 text-xs font-medium">({group.standings?.length || 0} đội)</span>
                </h4>
              </div>
              <div className="p-3">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="text-gray-500 font-bold border-b border-navy-light/50">
                      <th className="pb-2 pl-2">#</th>
                      <th className="pb-2">Đội</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.standings.map((st, idx) => (
                      <tr key={st.id} className="border-b border-navy-light/30 last:border-0 hover:bg-navy-light/10">
                        <td className="py-2 pl-2 text-gray-400 font-mono text-xs">{idx + 1}</td>
                        <td className="py-2 font-bold text-white">
                          {getTeamName(st.team_id)}
                          <span className="text-xs text-gray-500 font-normal ml-2">(ID: {st.team_id})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-navy border border-navy-light rounded-xl border-dashed">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h4 className="text-gray-400 font-bold">Chưa có kết quả bốc thăm</h4>
          <p className="text-gray-500 text-sm mt-1">Sử dụng công cụ phía trên để tự động chia bảng.</p>
        </div>
      )}
    </div>
  );
}
