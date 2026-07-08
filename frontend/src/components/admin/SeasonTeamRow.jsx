import { CheckCircle2, XCircle, Edit, Trash2, RefreshCw, Shirt, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

/**
 * SeasonTeamRow
 * ─────────────────────────────────────────────────────
 * @prop {Object}   seasonTeam         — object season_team
 * @prop {Function} onUpdateStatus     — (id, status) => void
 * @prop {Function} onDeleteRequest    — (id) => void
 * @prop {Function} onAssignGroup      — (seasonTeam) => void
 * @prop {Function} onTransfer         — (seasonTeam) => void
 * @prop {Function} onManageJerseys    — (seasonTeam) => void
 * @prop {boolean}  showSeasonColumn   — true khi đang xem "tất cả mùa giải"
 * @prop {boolean}  isSameTeamAsPrev   — true nếu row liền trước cùng team.id
 *                                       (parent phải sort theo team.name/id trước khi
 *                                       tính prop này, nếu không group visual sẽ vỡ)
 * @prop {number}   groupSize          — tổng số registration của team này, chính xác
 *                                       tuyệt đối vì parent paginate theo team-group
 *                                       (một group không bao giờ bị cắt ngang 2 trang)
 * @prop {boolean}  isGroupCollapsed   — true nếu group này đang bị thu gọn
 * @prop {Function} onToggleGroup      — () => void, chỉ gọi từ row đầu group
 */
export default function SeasonTeamRow({
  seasonTeam: st,
  onUpdateStatus,
  onDeleteRequest,
  onAssignGroup,
  onTransfer,
  onManageJerseys,
  seasons,
  hideSeason,
  showSeasonColumn = false,
  isSameTeamAsPrev = false,
  groupSize = 1,
  isGroupCollapsed = false,
  onToggleGroup,
}) {
  const tournamentName = st.season?.tournament?.name ?? st.tournament?.name ?? null;
  const seasonName = st.season?.name ?? null;

  return (
    <tr className={`hover:bg-navy-dark/70 transition-colors group ${isSameTeamAsPrev ? 'border-t-0' : 'border-t border-navy-light/40'}`}>
      <td className="py-4 px-6 text-center text-gray-500 text-xs font-mono">#{st.id}</td>

      <td className="py-4 px-6">
        {isSameTeamAsPrev ? (
          <div className="pl-12 text-gray-600 text-xs italic">↳ cùng đội</div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-navy-dark border border-navy-light flex items-center justify-center font-bold text-xs text-white shadow-md overflow-hidden">
              {st.team?.logo
                ? <img src={st.team.logo} alt="logo" className="w-full h-full object-cover" />
                : <span className="text-sm font-black text-neon">{st.team?.name?.[0]}</span>
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-white text-sm truncate">{st.team?.name || 'Unknown Team'}</p>
                {groupSize > 1 && (
                  <button
                    onClick={onToggleGroup}
                    title={isGroupCollapsed ? `Xem ${groupSize} đăng ký` : 'Thu gọn'}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-navy-dark border border-navy-light text-[10px] font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-all shrink-0"
                  >
                    {groupSize}
                    {isGroupCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  </button>
                )}
              </div>
              {!showSeasonColumn && tournamentName && (
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5 truncate">
                  <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                  {tournamentName}
                </p>
              )}
              {!showSeasonColumn && !tournamentName && st.team?.city && <p className="text-gray-500 text-xs">{st.team.city}</p>}
            </div>
          </div>
        )}
      </td>

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

      {!hideSeason && (
        <td className="py-4 px-6">
          <div className="inline-flex items-center px-2.5 py-1.5 bg-navy-light rounded-lg border border-navy-light/50 shadow-sm text-gray-200 text-[11px] font-bold whitespace-nowrap">
            {seasons?.find(s => s.id === st.season_id)?.name || 'Không rõ'}
          </div>
        </td>
      )}
      {!hideSeason && (
        <td className="py-4 px-6">
          {tournamentName ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-navy-light/40 rounded-lg border border-navy-light/70 text-amber-400">
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-bold leading-tight truncate uppercase tracking-wider">{tournamentName}</span>
            </div>
          ) : (
            <span className="text-gray-500 text-xs">—</span>
          )}
        </td>
      )}

      <td className="py-4 px-6 text-center">
        <StatusBadge status={st.status} variant="seasonTeam" />
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
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onManageJerseys(st)}
            className="p-1.5 rounded-lg bg-navy-light text-gray-500 hover:text-white hover:bg-emerald-600 border border-transparent hover:border-emerald-500 shadow-sm transition-all active:scale-90"
            title="Quản lý áo đấu"
          >
            <Shirt className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAssignGroup(st)}
            className="p-1.5 rounded-lg bg-navy-light text-gray-500 hover:text-white hover:bg-blue-600 border border-transparent hover:border-blue-500 shadow-sm transition-all active:scale-90"
            title="Xếp bảng thủ công"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTransfer(st)}
            className="p-1.5 rounded-lg bg-navy-light text-gray-500 hover:text-white hover:bg-purple-600 border border-transparent hover:border-purple-500 shadow-sm transition-all active:scale-90"
            title="Chuyển giải"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteRequest(st.id)}
            className="p-1.5 rounded-lg bg-navy-light text-gray-500 hover:text-white hover:bg-red-600 border border-transparent hover:border-red-500 shadow-sm transition-all active:scale-90"
            title="Xóa khỏi giải"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}