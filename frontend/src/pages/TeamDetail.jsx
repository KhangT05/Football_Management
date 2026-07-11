import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, Trophy, Target, Shield, Activity,
  WifiOff, Crown, UserCheck, UserX, Hash, CalendarDays
} from 'lucide-react';

import { AVATAR_COLORS, getInitials, POSITION_LABELS } from '../utils/constants';
import TeamHeaderSkeleton from '../components/skeletons/TeamHeaderSkeleton';
import PlayerCardSkeleton from '../components/skeletons/PlayerCardSkeleton';
import Pagination from '../components/ui/Pagination';
import { useShallow } from 'zustand/react/shallow';
import useTeamStore from '../store/teamStore';
import PlayerStatsModal from '../components/modals/PlayerStatsModal';

// ── Helpers ───────────────────────────────────────────────────
const POSITION_COLORS = {
  GK: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  FW: 'bg-red-400/10 text-red-400 border-red-400/30',
};

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

// FIX (blank pill) + bỏ border
function FormationDot({ tp, kit, onClick }) {
  const player = tp.player ?? tp;
  const rawName = player?.user?.name || player?.name || tp.name || '';
  const name = rawName.trim() || `#${tp.player_id ?? tp.id}`;
  const jersey = tp.jersey_number ?? '?';
  const isCap = tp.role === 'captain';
  const isVice = tp.role === 'vice_captain';

  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1 w-20 sm:w-24 shrink-0 group">
      <div className="relative">
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-black text-[11px] sm:text-xs shadow-md shadow-black/40 transition-transform group-hover:scale-110"
          style={{ backgroundColor: kit.bg, color: kit.text, borderColor: kit.border }}
        >
          {jersey}
        </div>
        {isCap && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 flex items-center justify-center bg-amber-500 text-navy text-[8px] font-black rounded-full border border-navy">C</span>
        )}
        {isVice && !isCap && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 flex items-center justify-center bg-blue-400 text-navy text-[8px] font-black rounded-full border border-navy">P</span>
        )}
      </div>
      {/* FIX (không đọc được tên): trước đây "truncate" trên khung cố định
          max-w-[70px] cắt gần hết tên tiếng Việt có dấu. Giờ bỏ truncate,
          cho chữ wrap tự nhiên (không giới hạn số dòng) — KHÔNG dùng
          line-clamp vì từng gây mất chữ hoàn toàn khi lỡ kết hợp với
          "block"/"inline-block" khác thứ tự CSS. title vẫn giữ để xem full
          tên khi hover trên desktop. */}
      <span
        className="mt-1 max-w-full inline-block break-words text-[10px] font-black text-white text-center leading-snug px-1.5 py-0.5 rounded bg-black/80"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
        title={name}
      >
        {name}
      </span>
    </button>
  );
}

// Vị trí thật trên sân theo % chiều cao — thay cho việc chia đều 4 hàng
// bằng flex justify-between (bản cũ), vì cách đó khiến hàng rỗng vẫn chiếm
// chỗ và tạo khoảng trắng lớn khi đội chưa đủ 4 tuyến (vd chỉ có GK+DEF).
// FIX (đội hình dính liền): giãn lại khoảng cách hàng — tên giờ có thể
// wrap 2 dòng nên mỗi hàng cao hơn trước, cần nhiều chỗ hơn để không đè
// lên hàng kế tiếp.
const PITCH_ROW_TOP = { FW: '10%', MID: '37%', DEF: '64%', GK: '92%' };

// ── Formation pitch (sơ đồ đội hình, FW trên cùng, GK dưới cùng) ─
// Chỉ render hàng có cầu thủ; height co theo số hàng thực có, không cố định
// min-h lớn như trước.
function FormationPitch({ byPosition, kit, badge, onSelectPlayer }) {
  const rows = ['FW', 'MID', 'DEF', 'GK'].filter(pos => byPosition[pos]?.length);
  if (rows.length === 0) return null;

  const minHeight = rows.length <= 2 ? 240 : 360;

  return (
    <div
      className="relative rounded-2xl border border-navy-light overflow-hidden shadow-lg shadow-black/20"
      style={{ minHeight }}
    >
      {/* Nền sân: gradient xanh lá + vạch giữa sân mờ, chỉ mang tính trang trí */}
      <div className="absolute inset-0 bg-linear-to-b from-emerald-900/50 via-emerald-950/60 to-emerald-900/50" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
      <div className="absolute inset-3 border border-white/10 rounded-lg pointer-events-none" />

      {/* Badge màu áo + số lượng cầu thủ, góc trên trái — nhận diện nhanh đội nào */}
      {badge && <div className="absolute top-3 left-3 z-20">{badge}</div>}

      {rows.map(pos => (
        <div
          key={pos}
          className="absolute left-0 right-0 flex flex-wrap justify-center gap-2 sm:gap-4 px-3"
          style={{ top: PITCH_ROW_TOP[pos], transform: 'translateY(-50%)' }}
        >
          {byPosition[pos].map((tp, idx) => (
            <FormationDot
              key={tp.id ?? `${pos}-${idx}`}
              tp={tp}
              kit={kit}
              onClick={() => onSelectPlayer(tp)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Player Card (giữ nguyên cho danh sách chi tiết bên dưới) ───
function PlayerCard({ tp, idx, onClick }) {
  const player = tp.player ?? tp;
  const name = player?.user?.name ?? player?.name ?? tp.name ?? `#${tp.player_id || tp.id}`;
  const initial = getInitials(name);
  const colorIdx = (tp.player_id ?? idx) % AVATAR_COLORS.length;
  const rawPos = tp.position ?? player.position;
  const pos = normalizePosition(rawPos);
  const jerseyNum = tp.jersey_number ?? '?';
  const isCaptain = tp.role === 'captain';
  const isVice = tp.role === 'vice_captain';
  const avatarUrl = player?.avatar ?? player?.user?.avatar;

  return (
    <div
      onClick={onClick}
      className="bg-navy border border-navy-light rounded-xl p-4 shadow-lg shadow-black/20 hover:border-blue-500/40 hover:shadow-blue-900/10 transition-all duration-300 animate-slide-up cursor-pointer group"
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-black text-white text-sm shadow-md shrink-0 relative overflow-hidden`}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
          {isCaptain && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow">
              <Crown className="w-2.5 h-2.5 text-yellow-900" />
            </span>
          )}
          {isVice && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center shadow">
              <Shield className="w-2.5 h-2.5 text-blue-900" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm truncate">{name}</div>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {pos && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${POSITION_COLORS[pos] ?? 'bg-gray-400/10 text-gray-400 border-gray-400/30'}`}>
                {POSITION_LABELS[pos] ?? pos}
              </span>
            )}
            {isCaptain && <span className="text-xs text-yellow-400 font-bold">Đội trưởng</span>}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-lg font-black text-neon leading-none">#{jerseyNum}</div>
        </div>
      </div>
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(players.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPlayers = players.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const totalByPosition = players.reduce((acc, tp) => {
    const player = tp.player ?? tp;
    const rawPos = tp.position ?? player.position;
    const pos = normalizePosition(rawPos);
    if (!acc[pos]) acc[pos] = 0;
    acc[pos]++;
    return acc;
  }, {});

  const byPosition = paginatedPlayers.reduce((acc, tp) => {
    const player = tp.player ?? tp;
    const rawPos = tp.position ?? player.position;
    const pos = normalizePosition(rawPos);
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(tp);
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

  const positionOrder = ['GK', 'DEF', 'MID', 'FW', 'OTHER'];

  const homeName = team?.name ?? '—';
  const initial = getInitials(homeName);
  const colorIdx = (teamId ?? 0) % AVATAR_COLORS.length;

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

        {/* Player Roster */}
        <section>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy-light animate-slide-up flex-wrap gap-3">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Users className="w-6 h-6 text-neon" /> Danh Sách Cầu Thủ
            </h2>
            {!isLoading && players.length > 0 && (
              <span className="text-neon font-bold bg-neon/10 border border-neon/20 px-4 py-1.5 rounded-lg text-sm">
                Sĩ số: {players.length}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => <PlayerCardSkeleton key={i} />)}
            </div>
          ) : players.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <Users className="w-12 h-12 text-gray-600" />
              <p className="font-semibold">Đội bóng chưa có cầu thủ nào.</p>
            </div>
          ) : (
            <>
              {positionOrder.filter(pos => byPosition[pos]?.length).map(pos => (
                <div key={pos} className="mb-8">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5" />
                    {POSITION_LABELS[pos] ?? 'Khác'} ({byPosition[pos].length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {byPosition[pos].map((tp, idx) => (
                      <PlayerCard key={tp.id} tp={tp} idx={idx} onClick={() => setSelectedPlayer(tp)} />
                    ))}
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              )}
            </>
          )}
        </section>

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