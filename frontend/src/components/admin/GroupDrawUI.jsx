import { useState, useEffect } from 'react';
import { Users, Shuffle, Save, GripVertical, AlertTriangle } from 'lucide-react';
import { seasonTeamApi } from '../../api';
import useToastStore from '../../store/toastStore';
import useTeamStore from '../../store/teamStore';
import { useShallow } from 'zustand/react/shallow';

export default function GroupDrawUI({ seasonId }) {
  const toast = useToastStore();
  const { teams } = useTeamStore(useShallow(state => ({ teams: state.teams })));
  
  const [loading, setLoading] = useState(false);
  const [unassignedTeams, setUnassignedTeams] = useState([]);
  const [groups, setGroups] = useState([
    { id: 'group_A', name: 'Bảng A', teams: [] },
    { id: 'group_B', name: 'Bảng B', teams: [] },
  ]);
  const [groupCount, setGroupCount] = useState(2);
  const [draggedTeam, setDraggedTeam] = useState(null);

  useEffect(() => {
    if (seasonId) {
      loadTeams();
    }
  }, [seasonId]);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const res = await seasonTeamApi.getAll({ season_id: seasonId, per_page: 100 });
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      const allTeams = Array.isArray(payload?.data) ? payload.data : [];
      // Only approved teams can participate in draw
      const approved = allTeams.filter(st => st.status === 'approved');
      
      setUnassignedTeams(approved);
      
      // Reset groups based on current count
      generateEmptyGroups(groupCount);
    } catch (err) {
      toast.error('Không thể tải danh sách đội');
    } finally {
      setLoading(false);
    }
  };

  const getTeamName = (teamId) => {
    return teams.find(t => t.id === Number(teamId))?.name ?? `Đội #${teamId}`;
  };

  const generateEmptyGroups = (count) => {
    const newGroups = [];
    for (let i = 0; i < count; i++) {
      newGroups.push({
        id: `group_${String.fromCharCode(65 + i)}`,
        name: `Bảng ${String.fromCharCode(65 + i)}`,
        teams: []
      });
    }
    setGroups(newGroups);
  };

  const handleGroupCountChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value) || 1);
    setGroupCount(count);
    // Put all teams back to unassigned when changing group count
    const allTeams = [
      ...unassignedTeams,
      ...groups.flatMap(g => g.teams)
    ];
    setUnassignedTeams(allTeams);
    generateEmptyGroups(count);
  };

  const handleRandomize = () => {
    const allTeams = [
      ...unassignedTeams,
      ...groups.flatMap(g => g.teams)
    ];
    
    if (allTeams.length === 0) return;

    // Shuffle
    const shuffled = [...allTeams].sort(() => Math.random() - 0.5);
    
    const newGroups = groups.map(g => ({ ...g, teams: [] }));
    let groupIdx = 0;
    
    shuffled.forEach(team => {
      newGroups[groupIdx].teams.push(team);
      groupIdx = (groupIdx + 1) % newGroups.length;
    });

    setGroups(newGroups);
    setUnassignedTeams([]);
    toast.success('Đã chia bảng ngẫu nhiên!');
  };

  // --- HTML5 Drag and Drop ---
  const handleDragStart = (e, team, sourceGroupId) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTeam({ team, sourceGroupId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetGroupId) => {
    e.preventDefault();
    if (!draggedTeam) return;

    const { team, sourceGroupId } = draggedTeam;
    
    if (sourceGroupId === targetGroupId) {
      setDraggedTeam(null);
      return;
    }

    // Remove from source
    if (sourceGroupId === 'unassigned') {
      setUnassignedTeams(prev => prev.filter(t => t.id !== team.id));
    } else {
      setGroups(prev => prev.map(g => {
        if (g.id === sourceGroupId) {
          return { ...g, teams: g.teams.filter(t => t.id !== team.id) };
        }
        return g;
      }));
    }

    // Add to target
    if (targetGroupId === 'unassigned') {
      setUnassignedTeams(prev => [...prev, team]);
    } else {
      setGroups(prev => prev.map(g => {
        if (g.id === targetGroupId) {
          return { ...g, teams: [...g.teams, team] };
        }
        return g;
      }));
    }

    setDraggedTeam(null);
  };

  const handleSave = () => {
    if (unassignedTeams.length > 0) {
      toast.error('Vui lòng chia tất cả các đội vào các bảng trước khi lưu.');
      return;
    }
    toast.info('Đây là bản xem trước chia bảng (Mô phỏng). API Backend hiện tại không hỗ trợ lưu bảng đấu độc lập.');
  };

  if (!seasonId) {
    return <div className="text-gray-400 py-10 text-center bg-navy rounded-xl border border-navy-light shadow-inner mt-6">Vui lòng chọn mùa giải để bắt đầu chia bảng</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in mt-6">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 shadow-lg shadow-amber-500/5">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-400 text-sm font-bold">Chế độ Mô phỏng Chia Bảng</p>
          <p className="text-amber-400/80 text-xs mt-1">
            Tính năng cho phép quản trị viên kéo thả đội vào các bảng theo ý muốn. Lưu ý: Do giới hạn của hệ thống, kết quả chia bảng này hiện tại <strong>chỉ mang tính chất tham khảo</strong> và chưa thể tự động chuyển thành lịch thi đấu.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between bg-navy-dark p-4 rounded-xl border border-navy-light shadow-inner">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Số bảng đấu</label>
            <input 
              type="number" 
              min="1" 
              max="8"
              value={groupCount} 
              onChange={handleGroupCountChange} 
              className="w-24 px-3 py-1.5 bg-navy border border-navy-light rounded-lg text-white font-bold focus:border-neon focus:ring-1 focus:ring-neon/20 outline-none transition-all"
            />
          </div>
          <button 
            onClick={handleRandomize}
            className="mt-5 px-4 py-1.5 rounded-lg font-bold text-sm bg-navy border border-navy-light text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" /> Bốc thăm ngẫu nhiên
          </button>
        </div>
        
        <button 
          onClick={handleSave}
          className="mt-5 px-6 py-1.5 rounded-lg font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Lưu kết quả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Unassigned Teams */}
        <div 
          className="lg:col-span-1 bg-navy border border-navy-light rounded-2xl flex flex-col max-h-[600px] shadow-lg shadow-black/20"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'unassigned')}
        >
          <div className="p-4 border-b border-navy-light bg-navy-dark rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              Chưa chia bảng
            </h3>
            <span className="bg-gray-700 text-white font-bold text-xs px-2 py-0.5 rounded-full">{unassignedTeams.length}</span>
          </div>
          <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-2">
            {loading ? (
              <div className="text-center text-gray-500 py-4 text-sm animate-pulse font-bold">Đang tải...</div>
            ) : unassignedTeams.length === 0 ? (
              <div className="text-center text-gray-500 py-10 text-sm border-2 border-dashed border-navy-light rounded-xl font-medium">
                Tất cả các đội đã được chia bảng
              </div>
            ) : (
              unassignedTeams.map(team => (
                <div 
                  key={team.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, team, 'unassigned')}
                  className="bg-navy-dark border border-navy-light p-3 rounded-xl flex items-center gap-3 cursor-grab active:cursor-grabbing hover:border-neon transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-sm font-bold text-white truncate">{getTeamName(team.team_id)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map(group => (
            <div 
              key={group.id}
              className="bg-navy border border-navy-light rounded-2xl flex flex-col shadow-lg shadow-black/20"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, group.id)}
            >
              <div className="p-3 border-b border-navy-light bg-navy-dark rounded-t-2xl flex justify-between items-center">
                <h4 className="font-black text-emerald-400 uppercase tracking-wide">{group.name}</h4>
                <span className="text-xs font-bold text-gray-400 bg-navy px-2 py-1 rounded-md">{group.teams.length} đội</span>
              </div>
              <div className="p-3 min-h-[150px] space-y-2 bg-navy/50">
                {group.teams.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-navy-light rounded-xl min-h-[120px] font-medium">
                    Kéo thả đội vào đây
                  </div>
                ) : (
                  group.teams.map(team => (
                    <div 
                      key={team.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, team, group.id)}
                      className="bg-navy-dark border border-navy-light p-2.5 rounded-lg flex items-center gap-3 cursor-grab active:cursor-grabbing hover:border-emerald-500 transition-colors shadow-sm"
                    >
                      <GripVertical className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="text-sm font-bold text-white truncate">{getTeamName(team.team_id)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
