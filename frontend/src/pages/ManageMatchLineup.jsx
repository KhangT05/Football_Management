import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Shield, Users, Loader2, AlertTriangle, 
  CheckCircle2, Info, Star
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import useScheduleStore from '../store/scheduleStore';
import { teamApi, matchLineupApi } from '../api';
import { POSITION_LABELS } from '../utils/constants';

const POS_COLORS = {
  GK:  'bg-amber-400/10 text-amber-400 border-amber-400/30',
  DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  FW:  'bg-red-400/10 text-red-400 border-red-400/30',
};

export default function ManageMatchLineup() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const toast = useToastStore();
  const { user } = useAuthStore(useShallow(state => ({ user: state.user })));

  const { fetchMatchDetail, getMatchDetailFromCache } = useScheduleStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [team, setTeam] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  
  // State for the lineup form
  // key: player_id, value: { lineup_type: 'starter' | 'substitute' | null, is_captain: boolean }
  const [selections, setSelections] = useState({});

  const matchDetailData = getMatchDetailFromCache(Number(matchId));
  const match = matchDetailData?.match;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        await fetchMatchDetail(Number(matchId));
        const currentMatch = getMatchDetailFromCache(Number(matchId))?.match;
        if (!currentMatch) throw new Error('Không tìm thấy trận đấu');

        // Check if user is leader of home or away team
        const userTeamsRes = await teamApi.getTeams({ per_page: 50 });
        const userTeams = Array.isArray(userTeamsRes?.data) ? userTeamsRes.data : [];
        const isHomeLeader = userTeams.some(t => t.id === currentMatch.home_team_id && t.user_id === user.id);
        const isAwayLeader = userTeams.some(t => t.id === currentMatch.away_team_id && t.user_id === user.id);

        let myTeamId = null;
        if (isHomeLeader) myTeamId = currentMatch.home_team_id;
        else if (isAwayLeader) myTeamId = currentMatch.away_team_id;

        if (!myTeamId) {
          toast.error('Bạn không có quyền quản lý đội hình trận này');
          navigate(`/matches/${matchId}`);
          return;
        }

        const teamInfo = isHomeLeader ? currentMatch.home_team : currentMatch.away_team;
        setTeam(teamInfo);

        // Fetch all players of the team
        const playersRes = await teamApi.getPlayers(myTeamId, { per_page: 50 });
        const players = Array.isArray(playersRes?.data) ? playersRes.data : [];
        setAllPlayers(players);

        // Fetch existing lineup
        const lineupRes = await matchLineupApi.getLineup(matchId, myTeamId);
        const existingLineup = Array.isArray(lineupRes?.data) ? lineupRes.data : [];

        const initialSelections = {};
        existingLineup.forEach(lu => {
          initialSelections[lu.player_id] = {
            lineup_type: lu.lineup_type,
            is_captain: lu.is_captain
          };
        });
        setSelections(initialSelections);

      } catch (err) {
        toast.error(err?.response?.data?.message || err.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [matchId]); // eslint-disable-line react-hooks/exhaustive-deps

  const startersCount = Object.values(selections).filter(s => s.lineup_type === 'starter').length;
  const subsCount = Object.values(selections).filter(s => s.lineup_type === 'substitute').length;
  const hasCaptain = Object.values(selections).some(s => s.is_captain);

  const toggleLineupType = (playerId, type) => {
    setSelections(prev => {
      const current = prev[playerId];
      const newSelections = { ...prev };
      
      if (current?.lineup_type === type) {
        // Deselect
        delete newSelections[playerId];
      } else {
        // Enforce max 11 starters
        if (type === 'starter' && current?.lineup_type !== 'starter' && startersCount >= 11) {
          toast.error('Chỉ được chọn tối đa 11 cầu thủ đá chính');
          return prev;
        }
        
        newSelections[playerId] = {
          lineup_type: type,
          is_captain: current?.is_captain || false
        };
      }
      
      return newSelections;
    });
  };

  const setCaptain = (playerId) => {
    setSelections(prev => {
      if (!prev[playerId]) return prev; // Must be selected first
      
      const newSelections = { ...prev };
      // Remove captain from others
      Object.keys(newSelections).forEach(id => {
        newSelections[id] = { ...newSelections[id], is_captain: false };
      });
      // Set to this player
      newSelections[playerId].is_captain = true;
      return newSelections;
    });
  };

  const handleSave = async () => {
    if (startersCount === 0) {
      toast.error('Vui lòng chọn đội hình xuất phát');
      return;
    }
    if (!hasCaptain) {
      toast.error('Vui lòng chọn một đội trưởng');
      return;
    }

    const payload = {
      team_id: team.id,
      players: Object.entries(selections).map(([playerId, sel]) => {
        const playerDetails = allPlayers.find(p => String(p.player_id) === String(playerId) || String(p.player?.id) === String(playerId));
        return {
          player_id: Number(playerId),
          jersey_number: playerDetails?.jersey_number || playerDetails?.number || 0,
          position: playerDetails?.position || 'MID',
          lineup_type: sel.lineup_type,
          is_captain: sel.is_captain
        };
      })
    };

    setSaving(true);
    try {
      await matchLineupApi.updateLineup(matchId, payload);
      toast.success('Lưu đội hình thành công!');
      navigate(`/matches/${matchId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi khi lưu đội hình');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!match || !team) {
    return (
      <div className="min-h-screen bg-navy-dark text-white flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy thông tin trận đấu</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-dark text-white pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 pt-6">
        <button
          onClick={() => navigate(`/matches/${matchId}`)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-neon transition-colors text-sm font-bold uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Chi tiết trận đấu
        </button>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              Đăng Ký Đội Hình
            </h1>
            <p className="text-gray-400 mt-2 font-medium">
              Trận đấu: {match.home_team?.name} vs {match.away_team?.name}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-navy border border-navy-light rounded-xl p-3 flex flex-col items-center min-w-[100px]">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Đá chính</span>
              <span className={`text-xl font-black ${startersCount === 11 ? 'text-emerald-400' : 'text-blue-400'}`}>
                {startersCount}/11
              </span>
            </div>
            <div className="bg-navy border border-navy-light rounded-xl p-3 flex flex-col items-center min-w-[100px]">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Dự bị</span>
              <span className="text-xl font-black text-gray-300">
                {subsCount}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl mb-8 flex items-start gap-3 shadow-lg">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-400/90 font-medium leading-relaxed">
            Bạn cần chọn tối đa 11 cầu thủ đá chính và bầu 1 Đội trưởng (nhấn biểu tượng Ngôi sao bên cạnh cầu thủ). 
            Đội hình có thể được thay đổi trước khi trận đấu diễn ra ít nhất 10 phút.
          </p>
        </div>

        <div className="bg-navy border border-navy-light rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-navy-light bg-navy-dark/50 flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-black uppercase tracking-wider">Danh Sách Đăng Ký</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-navy/80 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-navy-light">
                  <th className="py-4 px-6 w-16 text-center">Số áo</th>
                  <th className="py-4 px-6">Cầu thủ</th>
                  <th className="py-4 px-6 text-center">Vị trí</th>
                  <th className="py-4 px-6 text-center">Đá chính</th>
                  <th className="py-4 px-6 text-center">Dự bị</th>
                  <th className="py-4 px-6 text-center">C</th >
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-light/50">
                {allPlayers.map(tp => {
                  const pid = tp.player_id ?? tp.player?.id;
                  const sel = selections[pid];
                  const isStarter = sel?.lineup_type === 'starter';
                  const isSub = sel?.lineup_type === 'substitute';
                  const isCap = sel?.is_captain;
                  
                  return (
                    <tr key={tp.id} className={`transition-colors ${sel ? 'bg-blue-900/10' : 'hover:bg-navy-light/30'}`}>
                      <td className="py-3 px-6 text-center">
                        <span className="font-black text-gray-300">{tp.jersey_number ?? tp.number}</span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <img src={tp.player?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tp.player?.name ?? tp.name ?? 'Player')}&background=random`} alt="" className="w-8 h-8 rounded-full border border-navy-light" />
                          <span className="font-bold text-sm text-white">{tp.player?.name ?? tp.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded border ${POS_COLORS[tp.position] || 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                          {POSITION_LABELS[tp.position] || tp.position}
                        </span>
                      </td>
                      
                      <td className="py-3 px-6 text-center">
                        <button 
                          onClick={() => toggleLineupType(pid, 'starter')}
                          className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all mx-auto ${
                            isStarter 
                              ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                              : 'bg-navy-dark border-navy-light hover:border-blue-500/50'
                          }`}
                        >
                          {isStarter && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      </td>
                      
                      <td className="py-3 px-6 text-center">
                        <button 
                          onClick={() => toggleLineupType(pid, 'substitute')}
                          className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all mx-auto ${
                            isSub 
                              ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                              : 'bg-navy-dark border-navy-light hover:border-emerald-500/50'
                          }`}
                        >
                          {isSub && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      </td>
                      
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => setCaptain(pid)}
                          disabled={!sel}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all mx-auto ${
                            isCap
                              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                              : sel 
                                ? 'bg-navy-dark border border-navy-light text-gray-600 hover:text-amber-500 hover:border-amber-500/50'
                                : 'opacity-20 cursor-not-allowed'
                          }`}
                          title="Chọn làm đội trưởng"
                        >
                          <Star className={`w-4 h-4 ${isCap ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-navy-dark/90 backdrop-blur-xl border-t border-navy-light z-40 flex justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full max-w-md py-4 px-8 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-70 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all uppercase tracking-wider text-sm"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Lưu Đội Hình
          </button>
        </div>
      </div>
    </div>
  );
}
