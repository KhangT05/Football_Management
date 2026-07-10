import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Shield, Users, Loader2, Info
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import useScheduleStore from '../store/scheduleStore';
import { teamApi, matchLineupApi } from '../api';
import { POSITION_LABELS } from '../utils/constants';
import PitchFormation from '../components/PitchFormation';

const POS_COLORS = {
  GK: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  FW: 'bg-red-400/10 text-red-400 border-red-400/30',
};

const DEFAULT_SQUAD_LIMIT = { min_players_per_team: 7, max_players_per_team: 11 };

// Map mọi biến thể vị trí (GK/DEF/MID/FW hoặc full-word) về 1 chuẩn duy nhất
// dùng cho cả payload lưu server lẫn logic kéo-thả trên sơ đồ sân.
function mapPosition(rawPos) {
  const p = (rawPos || '').toUpperCase();
  if (p === 'GK' || p === 'GOALKEEPER') return 'goalkeeper';
  if (p === 'DEF' || p === 'DEFENDER') return 'defender';
  if (p === 'MID' || p === 'MIDFIELDER') return 'midfielder';
  if (p === 'FW' || p === 'FORWARD') return 'forward';
  return (rawPos || 'midfielder').toLowerCase();
}

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

  // key: player_id, value: { lineup_type: 'starter' | 'substitute' | null, is_captain: boolean }
  const [selections, setSelections] = useState({});

  const matchDetailData = getMatchDetailFromCache(Number(matchId));
  const match = matchDetailData?.match;

  // Rule đăng ký đội hình đi theo đúng chuỗi quan hệ Prisma thật:
  // Match -> phase -> season -> tournamentRule (Match KHÔNG có field `season`
  // trực tiếp). Fallback nếu API chưa include quan hệ này tới tận nơi.
  // Tính trực tiếp từ `match` mỗi render, không cần thêm state/effect riêng.
  const rule = match?.phase?.season?.tournament_rule ?? match?.phase?.season?.tournamentRule;
  const squadLimit = {
    min_players_per_team: rule?.min_players_per_team ?? DEFAULT_SQUAD_LIMIT.min_players_per_team,
    max_players_per_team: rule?.max_players_per_team ?? DEFAULT_SQUAD_LIMIT.max_players_per_team,
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        await fetchMatchDetail(Number(matchId));
        const currentMatch = getMatchDetailFromCache(Number(matchId))?.match;
        if (!currentMatch) throw new Error('Không tìm thấy trận đấu');

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

        const playersRes = await teamApi.getPlayers(myTeamId, { per_page: 50 });
        const players = Array.isArray(playersRes?.data) ? playersRes.data : [];
        setAllPlayers(players);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const startersCount = Object.values(selections).filter(s => s.lineup_type === 'starter').length;
  const subsCount = Object.values(selections).filter(s => s.lineup_type === 'substitute').length;
  const hasCaptain = Object.values(selections).some(s => s.is_captain);

  const findPlayer = (playerId) =>
    allPlayers.find(p => String(p.player_id ?? p.player?.id) === String(playerId));

  const toggleLineupType = (playerId, type) => {
    setSelections(prev => {
      const current = prev[playerId];
      const newSelections = { ...prev };

      if (current?.lineup_type === type) {
        // Deselect
        delete newSelections[playerId];
      } else {
        if (type === 'starter' && current?.lineup_type !== 'starter' && startersCount >= squadLimit.max_players_per_team) {
          toast.error(`Chỉ được chọn tối đa ${squadLimit.max_players_per_team} cầu thủ đá chính`);
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

  // Được gọi khi thả 1 cầu thủ vào 1 hàng vị trí trên sơ đồ sân.
  // Chỉ chấp nhận nếu vị trí thật của cầu thủ khớp với hàng đích
  // (ví dụ: GK chỉ thả được vào hàng thủ môn).
  const handleDropOnPitch = (playerId, rowPosition) => {
    const tp = findPlayer(playerId);
    if (!tp) return;

    const playerPos = mapPosition(tp.position);
    if (playerPos !== rowPosition) {
      toast.error(
        `${tp.player?.name ?? tp.name} chơi vị trí ${POSITION_LABELS[tp.position] || tp.position}, không thể xếp vào vị trí này`
      );
      return;
    }

    setSelections(prev => {
      const current = prev[playerId];
      if (current?.lineup_type === 'starter') return prev; // đã có trên sân rồi

      if (startersCount >= squadLimit.max_players_per_team) {
        toast.error(`Chỉ được chọn tối đa ${squadLimit.max_players_per_team} cầu thủ đá chính`);
        return prev;
      }

      return {
        ...prev,
        [playerId]: { lineup_type: 'starter', is_captain: current?.is_captain || false }
      };
    });
  };

  const setCaptain = (playerId) => {
    setSelections(prev => {
      if (!prev[playerId]) return prev; // Must be selected first

      const newSelections = { ...prev };
      Object.keys(newSelections).forEach(id => {
        newSelections[id] = { ...newSelections[id], is_captain: false };
      });
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
        const playerDetails = findPlayer(playerId);
        const mappedPosition = mapPosition(playerDetails?.position);

        const jNum = parseInt(playerDetails?.jersey_number || playerDetails?.number || 1, 10);
        const validJersey = isNaN(jNum) || jNum < 1 ? 1 : (jNum > 99 ? 99 : jNum);

        return {
          player_id: Number(playerId),
          jersey_number: validJersey,
          position: mappedPosition,
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

  // Danh sách cầu thủ đá chính, kèm vị trí đã chuẩn hoá (goalkeeper/defender/...)
  // để PitchFormation gom đúng hàng.
  const starters = allPlayers
    .filter(tp => selections[tp.player_id ?? tp.player?.id]?.lineup_type === 'starter')
    .map(tp => {
      const pid = tp.player_id ?? tp.player?.id;
      return {
        ...selections[pid],
        player_id: pid,
        name: tp.player?.name ?? tp.name,
        jersey_number: tp.jersey_number ?? tp.number,
        position: mapPosition(tp.position),
      };
    });

  return (
    <div className="min-h-screen bg-navy-dark text-white pb-24 relative overflow-hidden">
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
            {team?.jersey_color && (
              <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                Màu áo ({team.name}):
                <div
                  className="w-5 h-5 rounded border border-gray-600 shadow-sm"
                  style={{ backgroundColor: team.jersey_color }}
                  title={team.jersey_color}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="bg-navy border border-navy-light rounded-xl p-3 flex flex-col items-center min-w-[100px]">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Đá chính</span>
              <span className={`text-xl font-black ${startersCount === squadLimit.max_players_per_team ? 'text-emerald-400' : 'text-blue-400'}`}>
                {startersCount}/{squadLimit.max_players_per_team}
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

        <div className="bg-navy border border-navy-light p-4 rounded-xl mb-8 flex items-start gap-3 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400 font-medium leading-relaxed">
            Bạn cần chọn tối đa {squadLimit.max_players_per_team} cầu thủ đá chính và bầu 1 Đội trưởng (nhấn biểu tượng
            Ngôi sao bên cạnh cầu thủ). Kéo cầu thủ từ danh sách vào đúng hàng vị trí trên sơ đồ sân, hoặc dùng nút
            trong bảng bên dưới. Đội hình có thể được thay đổi trước khi trận đấu diễn ra ít nhất 10 phút.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PitchFormation
            starters={starters}
            onRemove={pid => toggleLineupType(pid, 'starter')}
            onSetCaptain={setCaptain}
            onDropPlayer={handleDropOnPitch}
          />

          <div className="bg-navy border border-navy-light rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-navy-light bg-navy-dark/50 flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-black uppercase tracking-wider">Danh Sách Đăng Ký</h2>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-navy/80 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-navy-light sticky top-0">
                    <th className="py-4 px-6 w-16 text-center">Số áo</th>
                    <th className="py-4 px-6">Cầu thủ</th>
                    <th className="py-4 px-6 text-center">Vị trí</th>
                    <th className="py-4 px-6 text-center">Đá chính</th>
                    <th className="py-4 px-6 text-center">Dự bị</th>
                    <th className="py-4 px-6 text-center">C</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-light/50">
                  {allPlayers.map(tp => {
                    const pid = tp.player_id ?? tp.player?.id;
                    const sel = selections[pid];
                    const isStarter = sel?.lineup_type === 'starter';
                    const isSub = sel?.lineup_type === 'substitute';
                    const isCap = sel?.is_captain;
                    const mappedPos = mapPosition(tp.position);

                    return (
                      <tr
                        key={tp.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('app/player-id', String(pid));
                          e.dataTransfer.setData(`app/position-${mappedPos}`, '1');
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        className={`transition-colors cursor-grab active:cursor-grabbing ${sel ? 'bg-blue-900/10' : 'hover:bg-navy-light/30'}`}
                      >
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
                            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all mx-auto ${isStarter
                              ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                              : 'bg-navy-dark border-navy-light hover:border-blue-500/50'
                              }`}
                          >
                            {isStarter && <span className="w-2 h-2 rounded-full bg-white" />}
                          </button>
                        </td>

                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() => toggleLineupType(pid, 'substitute')}
                            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all mx-auto ${isSub
                              ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                              : 'bg-navy-dark border-navy-light hover:border-emerald-500/50'
                              }`}
                          >
                            {isSub && <span className="w-2 h-2 rounded-full bg-white" />}
                          </button>
                        </td>

                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() => setCaptain(pid)}
                            disabled={!sel}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all mx-auto ${isCap
                              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                              : sel
                                ? 'bg-navy-dark border border-navy-light text-gray-600 hover:text-amber-500 hover:border-amber-500/50'
                                : 'opacity-20 cursor-not-allowed'
                              }`}
                            title="Chọn làm đội trưởng"
                          >
                            ★
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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