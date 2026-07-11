import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, Trophy, Target, Shield, Activity,
  WifiOff, UserCheck, UserX, CalendarDays
} from 'lucide-react';

import { getInitials } from '../utils/constants';
import TeamHeaderSkeleton from '../components/skeletons/TeamHeaderSkeleton';
import { useShallow } from 'zustand/react/shallow';
import useTeamStore from '../store/teamStore';
import PlayerStatsModal from '../components/modals/PlayerStatsModal';

// ── Helpers ───────────────────────────────────────────────────


const normalizePosition = (posStr) => {
  if (!posStr) return 'OTHER';
  let p = posStr.toUpperCase().trim();
  if (p === 'GOALKEEPER' || p.includes('GK') || p.includes('THỦ MÔN')) return 'GK';
  if (p === 'DEFENDER' || p.includes('DEF') || p === 'DF' || p.includes('HẬU VỆ')) return 'DEF';
  if (p === 'MIDFIELDER' || p.includes('MID') || p === 'MF' || p.includes('TIỀN VỆ')) return 'MID';
  if (p === 'FORWARD' || p.includes('FW') || p === 'FWD' || p.includes('TIỀN ĐẠO')) return 'FW';
  return p;
};

// Kit mặc định khi team CHƯA có jersey_color — dùng tông trung tính (xám-navy)
// thay vì xanh dương nổi bật như trước. Lý do: màu xanh dương rực trước đây
// dễ khiến người xem tưởng nhầm đó là màu áo thật của đội, trong khi thực ra
// là fallback do BE chưa trả jersey_color.
const FALLBACK_KIT = { bg: '#334155', text: '#e2e8f0', border: 'rgba(255,255,255,0.35)' };

// Contrast tối thiểu: nếu jersey_color sáng thì chữ tối, ngược lại chữ trắng.
// Không cần chính xác WCAG, chỉ cần tránh chữ biến mất trên nền sáng.
function textColorFor(hex) {
  if (!hex || hex[0] !== '#' || (hex.length !== 7 && hex.length !== 4)) return '#ffffff';
  const full = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
  const r = parseInt(full.slice(1, 3), 16);
  const g = parseInt(full.slice(3, 5), 16);
  const b = parseInt(full.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65 ? '#0b1220' : '#ffffff';
}

// ── StatBox ───────────────────────────────────────────────────
function StatBox({ label, value, icon: Icon, colorClass = 'text-neon' }) {
  return (
    <div className="bg-navy border border-navy-light rounded-xl p-3 text-center shadow-lg shadow-black/20">
      {Icon && <Icon className={`w-4 h-4 ${colorClass} mx-auto mb-1.5`} />}
      <div className={`text-2xl font-black ${colorClass} mb-0.5`}>{value ?? '—'}</div>
      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

function FormationDot({ tp, kit, onClick }) {
  const player = tp.player ?? tp;
  const rawName = player?.user?.name || player?.name || tp.name || '';
  const name = rawName.trim() || `#${tp.player_id ?? tp.id}`;
  const jersey = tp.jersey_number ?? '?';
  const isCap = tp.role === 'captain';
  const isVice = tp.role === 'vice_captain';
  const avatarUrl = player?.avatar ?? player?.user?.avatar;

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${name} — bấm để xem/sửa`}
      className="flex flex-col items-center gap-1.5 w-[64px] sm:w-[88px] shrink-0 group cursor-pointer"
    >
      <div className="relative">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={name} 
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 shadow-md shadow-black/40 transition-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-white/40" 
            style={{ borderColor: kit.border }} 
          />
        ) : (
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center font-black text-[10px] sm:text-sm shadow-md shadow-black/40 transition-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-white/40"
            style={{ backgroundColor: kit.bg, color: kit.text, borderColor: kit.border }}
          >
            {jersey}
          </div>
        )}
        {isCap && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center bg-amber-500 text-white text-[8px] sm:text-[10px] font-black rounded-full border-2 border-black/20 shadow-sm">
            C
          </span>
        )}
        {isVice && !isCap && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center bg-blue-500 text-white text-[8px] sm:text-[10px] font-black rounded-full border-2 border-black/20 shadow-sm">
            P
          </span>
        )}
      </div>
      <span
        className="text-[9px] sm:text-[10px] font-bold text-white! text-center leading-tight px-1 sm:px-1.5 py-1 rounded-md bg-black/30 backdrop-blur-md border border-white/10 shadow-sm w-full wrap-break-words group-hover:bg-black/50 transition-all"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
      >
        {name}
      </span>
    </button>
  );
}

// ── Formation pitch (sơ đồ đội hình, FW trên cùng, GK dưới cùng) ─
function FormationPitch({ byPosition, kit, badge, onSelectPlayer }) {
  const [pitchSize, setPitchSize] = useState('7'); // '7' or '5'

  const gks = byPosition['GK'] || [];
  const defs = byPosition['DEF'] || [];
  const mids = byPosition['MID'] || [];
  const fws = byPosition['FW'] || [];

  let layout = [];
  if (pitchSize === '11') {
    layout = [
      { pos: 'FW', count: 3 },
      { pos: 'MID', count: 3 },
      { pos: 'DEF', count: 4 },
      { pos: 'GK', count: 1 },
    ];
  } else if (pitchSize === '7') {
    layout = [
      { pos: 'FW', count: 1 },
      { pos: 'MID', count: 2 },
      { pos: 'DEF', count: 3 },
      { pos: 'GK', count: 1 },
    ];
  } else {
    layout = [
      { pos: 'FW', count: 1 },
      { pos: 'MID', count: 1 },
      { pos: 'DEF', count: 2 },
      { pos: 'GK', count: 1 },
    ];
  }

  const usedIds = new Set();
  const getPlayersForSlot = (posType, count) => {
    let pool = [];
    if (posType === 'FW') pool = [...fws, ...mids, ...defs, ...gks];
    else if (posType === 'MID') pool = [...mids, ...fws, ...defs, ...gks];
    else if (posType === 'DEF') pool = [...defs, ...mids, ...fws, ...gks];
    else if (posType === 'GK') pool = [...gks, ...defs, ...mids, ...fws];

    const selected = [];
    for (const tp of pool) {
      if (!usedIds.has(tp.id) && selected.length < count) {
        selected.push(tp);
        usedIds.add(tp.id);
      }
    }
    while (selected.length < count) selected.push(null);
    return selected;
  };

  const rowsData = layout.map(row => ({
    ...row,
    players: getPlayersForSlot(row.pos, row.count)
  }));

  const allPlayers = [...fws, ...mids, ...defs, ...gks];
  const subs = allPlayers.filter(tp => !usedIds.has(tp.id));

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl border border-navy-light overflow-hidden shadow-lg shadow-black/20" style={{ minHeight: 560 }}>
        {/* Toggle Sân 5/7/11 */}
        <div className="absolute top-2 right-2 z-20 flex bg-black/40 backdrop-blur-md p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setPitchSize('5')}
            className={`px-2 sm:px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all ${pitchSize === '5' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}
          >
            Sân 5
          </button>
          <button
            onClick={() => setPitchSize('7')}
            className={`px-2 sm:px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all ${pitchSize === '7' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}
          >
            Sân 7
          </button>
          <button
            onClick={() => setPitchSize('11')}
            className={`px-2 sm:px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all ${pitchSize === '11' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}
          >
            Sân 11
          </button>
        </div>

        {/* Badge */}
        {badge && <div className="absolute top-3 left-3 z-20">{badge}</div>}

        {/* Beautiful Pitch Background */}
        <div className="absolute inset-0 bg-[#1e5e1e]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#1a521a_50%,transparent_50%)] bg-size-[100%_20%] opacity-50" />
        <div className="absolute inset-4 border-2 border-white/40 pointer-events-none" />
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/40 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-4 left-1/2 w-48 h-24 border-2 border-b-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-4 left-1/2 w-24 h-10 border-2 border-b-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-4 left-1/2 w-48 h-24 border-2 border-t-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-4 left-1/2 w-24 h-10 border-2 border-t-0 border-white/40 -translate-x-1/2 pointer-events-none" />

        {/* Players */}
        <div className="absolute inset-0 flex flex-col justify-evenly py-6 pointer-events-auto z-10 mt-6 sm:mt-0">
          {rowsData.map((row, i) => (
            <div key={i} className="flex justify-center gap-2 sm:gap-6 px-2">
              {row.players.map((tp, j) => (
                tp ? (
                  <FormationDot key={tp.id} tp={tp} kit={kit} onClick={() => onSelectPlayer?.(tp)} />
                ) : (
                  <div key={`empty-${j}`} className="flex flex-col items-center gap-1.5 w-[64px] sm:w-[88px] shrink-0 opacity-40">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white/30 bg-black/20 flex items-center justify-center text-white text-xs">
                      +
                    </div>
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách dự bị */}
      {subs.length > 0 && (
        <div className="bg-navy/30 border border-navy-light rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            Danh sách dự bị ({subs.length})
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-start">
            {subs.map(tp => (
              <FormationDot key={tp.id} tp={tp} kit={kit} onClick={() => onSelectPlayer?.(tp)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ── Page ──────────────────────────────────────────────────────
export default function TeamDetail() {
  const { id } = useParams();
  const teamId = parseInt(id) || null;

  const { fetchTeamDetail, teamDetailLoading, teamDetailError, getTeamDetailFromCache } = useTeamStore(useShallow(state => ({
    fetchTeamDetail: state.fetchTeamDetail,
    teamDetailLoading: state.teamDetailLoading,
    teamDetailError: state.teamDetailError,
    getTeamDetailFromCache: state.getTeamDetailFromCache,
  })));

  useEffect(() => {
    if (teamId) {
      fetchTeamDetail(teamId);
    }
  }, [teamId, fetchTeamDetail]);

  const isLoading = teamDetailLoading[teamId] || false;
  const hasError = !teamId || teamDetailError[teamId];

  const detailData = getTeamDetailFromCache(teamId);
  const team = detailData?.team || null;
  const players = detailData?.players || [];

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const totalByPosition = players.reduce((acc, tp) => {
    const player = tp.player ?? tp;
    const rawPos = tp.position ?? player.position;
    const pos = normalizePosition(rawPos);
    if (!acc[pos]) acc[pos] = 0;
    acc[pos]++;
    return acc;
  }, {});



  // Formation dùng TOÀN BỘ roster (không phân trang) — pitch nhỏ, chỉ mang
  // tính overview; danh sách chi tiết bên dưới vẫn giữ pagination.
  const byPositionFull = players.reduce((acc, tp) => {
    const player = tp.player ?? tp;
    const rawPos = tp.position ?? player.position;
    const pos = normalizePosition(rawPos);
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(tp);
    return acc;
  }, {});

  const homeName = team?.name ?? '—';
  const initial = getInitials(homeName);

  const kit = team?.jersey_color
    ? { bg: team.jersey_color, text: textColorFor(team.jersey_color), border: 'rgba(255,255,255,0)' }
    : FALLBACK_KIT;

  // Số mùa giải đội đã tham gia — chỉ hiển thị nếu backend trả field này,
  // không tự gọi thêm API để đoán (chưa có endpoint per-team xác nhận).
  const seasonCount = team?.season_count ?? team?.seasons_count ?? team?.total_seasons ?? null;

  return (
    <div className="pb-20 bg-navy-dark min-h-screen">

      <div className="container mx-auto px-4 lg:px-8 pt-6 animate-fade-in">
        <Link
          to="/bang-xep-hang"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-neon transition-colors text-sm font-bold uppercase tracking-wider group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>
      </div>

      {/* Hero Header */}
      <section className="relative mt-6 mb-8 bg-navy border-b border-navy-light shadow-lg shadow-black/20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/10 via-transparent to-cyan-900/5 pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 lg:px-8 py-8 md:py-14 animate-slide-up">
          {isLoading ? (
            <TeamHeaderSkeleton />
          ) : hasError ? (
            <div className="flex flex-col items-center gap-4 text-gray-400 py-8">
              <WifiOff className="w-12 h-12 text-gray-600" />
              <p className="font-bold">Không thể tải thông tin đội bóng.</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              {/* Kích thước cũ (w-48 h-48 ở desktop) quá to so với nội dung còn lại,
                  và không có nhánh hiển thị team.logo — luôn render initials dù
                  BE đã trả logo. Giờ ưu tiên logo thật, fallback về kit màu áo. */}
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-2xl shrink-0 border-4 border-white/10 animate-fade-in overflow-hidden bg-navy-dark">
                {team?.logo ? (
                  <img src={team.logo} alt={homeName} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-black text-3xl md:text-4xl"
                    style={{ backgroundColor: kit.bg, color: kit.text }}
                  >
                    {initial}
                  </div>
                )}
              </div>

              <div className="text-center md:text-left space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {team?.is_active !== undefined && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${team.is_active ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30' : 'bg-gray-400/10 text-gray-400 border border-gray-400/30'}`}>
                      {team.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {team.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                    </div>
                  )}
                  {seasonCount != null && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-400/10 text-blue-400 border border-blue-400/30">
                      <CalendarDays className="w-3 h-3" />
                      {seasonCount} mùa giải
                    </div>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase italic tracking-tight">
                  {team?.name}
                </h1>
                {team?.description && (
                  <p className="text-gray-400 text-lg md:text-xl font-medium">{team.description}</p>
                )}
                {team?.coach_name && (
                  <p className="text-gray-400">
                    Huấn luyện viên: <span className="text-white font-bold">{team.coach_name}</span>
                  </p>
                )}
                {team?.jersey_color && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                    Màu áo:
                    <div
                      className="w-6 h-6 rounded border border-gray-600 shadow-sm"
                      style={{ backgroundColor: team.jersey_color }}
                      title={team.jersey_color}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 space-y-8 max-w-6xl">

        {/* Stats */}
        {!isLoading && !hasError && (
          <section className="animate-slide-up">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-neon" /> Thống kê đội bóng
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatBox label="Cầu thủ" value={players.length} icon={Users} colorClass="text-blue-400" />
              <StatBox label="Thủ môn" value={totalByPosition['GK'] ?? 0} icon={Shield} colorClass="text-amber-400" />
              <StatBox label="Hậu vệ" value={totalByPosition['DEF'] ?? 0} icon={Shield} colorClass="text-blue-400" />
              <StatBox label="Tiền vệ" value={totalByPosition['MID'] ?? 0} icon={Activity} colorClass="text-emerald-400" />
              <StatBox label="Tiền đạo" value={totalByPosition['FW'] ?? 0} icon={Target} colorClass="text-red-400" />
            </div>
          </section>
        )}

        {/* Formation Pitch */}
        {!isLoading && !hasError && players.length > 0 && (
          <section className="animate-slide-up">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-neon" /> Sơ Đồ Đội Hình
            </h2>
            <FormationPitch
              byPosition={byPositionFull}
              kit={kit}
              onSelectPlayer={setSelectedPlayer}
              badge={
                <div className="flex items-center gap-2 self-start">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border border-white/30"
                    style={{ backgroundColor: kit.bg, color: kit.text }}
                  >
                    {initial[0]}
                  </div>
                  <span className="text-xs font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded">
                    {team?.name} · {players.length} cầu thủ
                  </span>
                </div>
              }
            />
          </section>
        )}



      </div>

      {selectedPlayer && (
        <PlayerStatsModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}