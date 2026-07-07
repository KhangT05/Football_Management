import { CheckCircle2, XCircle, Edit, Trash2, RefreshCw, Shirt, Trophy } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

/**
 * SeasonTeamRow
 * ─────────────────────────────────────────────────────
 * Hiển thị một hàng trong bảng danh sách đội đăng ký mùa giải.
 * Tách từ ManageSeasonTeams.jsx để giảm kích thước component cha.
 *
 * @prop {Object}   seasonTeam         — object season_team
 * @prop {Function} onUpdateStatus     — (id, status) => void
 * @prop {Function} onDeleteRequest    — (id) => void
 * @prop {Function} onAssignGroup      — (seasonTeam) => void
 * @prop {Function} onTransfer         — (seasonTeam) => void
 * @prop {Function} onManageJerseys    — (seasonTeam) => void
 * @prop {boolean}  showSeasonColumn   — true khi đang xem "tất cả mùa giải"
 *                                       (selectedSeason rỗng ở parent). Khi false,
 *                                       season đã cố định qua filter nên ẩn cột
 *                                       này để giảm noise — thông tin đã implicit
 *                                       từ context (season đang chọn).
 */
export default function SeasonTeamRow({
  seasonTeam: st,
  onUpdateStatus,
  onDeleteRequest,
  onAssignGroup,
  onTransfer,
  onManageJerseys,
  showSeasonColumn = false,
}) {
  // Tên giải đấu (tournament) mà season này thuộc về.
  // API có thể trả theo 2 dạng tuỳ chỗ populate: st.season.tournament hoặc st.tournament — check cả 2 cho chắc.
  const tournamentName = st.season?.tournament?.name ?? st.tournament?.name ?? null;
  const seasonName = st.season?.name ?? null;

  // Tên bảng — ưu tiên object group.name nếu BE đã join, fallback về group_id thô,
  // còn không có gì (đội đá knockout, chưa/không chia bảng) thì hiện dấu gạch ngang.
  const groupLabel = st.group?.name ?? (st.group_id != null ? `Bảng #${st.group_id}` : null);

  return (
    <tr className="hover:bg-navy-dark/70 transition-colors group">
      <td className="py-4 px-6 text-center text-gray-500 text-xs font-mono">#{st.id}</td>

      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy-dark border border-navy-light flex items-center justify-center font-bold text-xs text-white shadow-md overflow-hidden">
            {st.team?.logo
              ? <img src={st.team.logo} alt="logo" className="w-full h-full object-cover" />
              : <span className="text-sm font-black text-neon">{st.team?.name?.[0]}</span>
            }
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-sm truncate">{st.team?.name || 'Unknown Team'}</p>
            {!showSeasonColumn && tournamentName && (
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5 truncate">
                <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                {tournamentName}
              </p>
            )}
            {!showSeasonColumn && !tournamentName && st.team?.city && <p className="text-gray-500 text-xs">{st.team.city}</p>}
          </div>
        </div>
      </td>

      {/* Cột riêng cho Season/Tournament — chỉ hiện khi list gộp nhiều season.
          Khi đã filter theo 1 season cụ thể, cột này bị bỏ (season implicit từ filter),
          tournamentName vẫn hiện dạng subtext ở cột Đội bóng phía trên. */}
      {showSeasonColumn && (
        <td className="py-4 px-6">
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {seasonName ?? <span className="text-gray-500 italic">— chưa rõ mùa —</span>}
            </p>
            {tournamentName && (
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5 truncate">
                <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                {tournamentName}
              </p>
            )}
          </div>
        </td>
      )}

      <td className="py-4 px-6 text-center">
        <StatusBadge status={st.status} variant="seasonTeam" />
      </td>

      <td className="py-4 px-6 text-center">
        {groupLabel ? (
          <span className="font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30 text-xs shadow-sm shadow-purple-500/10">
            {groupLabel}
          </span>
        ) : (
          <span className="text-gray-500 text-xs italic">Knockout</span>
        )}
      </td>

      <td className="py-4 px-6 text-center">
        {st.status === 'pending' && (
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => onUpdateStatus(st.id, 'approved')}
              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all active:scale-90"
              title="Duyệt đăng ký"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateStatus(st.id, 'rejected')}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 shadow-sm shadow-red-500/10 hover:shadow-red-500/20 transition-all active:scale-90"
              title="Từ chối"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onManageJerseys(st)}
            className="p-1.5 rounded-lg bg-navy-light text-emerald-400 hover:text-white hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 shadow-sm transition-all active:scale-90"
            title="Quản lý áo đấu"
          >
            <Shirt className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAssignGroup(st)}
            className="p-1.5 rounded-lg bg-navy-light text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 shadow-sm transition-all active:scale-90"
            title="Xếp bảng thủ công"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTransfer(st)}
            className="p-1.5 rounded-lg bg-navy-light text-purple-400 hover:text-white hover:bg-purple-600 border border-purple-500/20 hover:border-purple-500 shadow-sm transition-all active:scale-90"
            title="Chuyển giải"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteRequest(st.id)}
            className="p-1.5 rounded-lg bg-navy-light text-red-400 hover:text-white hover:bg-red-600 border border-red-500/20 hover:border-red-500 shadow-sm transition-all active:scale-90"
            title="Xóa khỏi giải"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}