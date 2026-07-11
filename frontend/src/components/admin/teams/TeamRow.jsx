import { Fragment } from 'react';
import { Trophy, CheckCircle2, Edit, Trash2, Users, ChevronUp, ChevronDown } from 'lucide-react';
import TeamRosterPanel from '../TeamRosterPanel';

export default function TeamRow({
  team,
  idx,
  expandedTeamId,
  onToggleExpand,
  onApprove,
  onEdit,
  onDelete,
  getTeamRoster,
  playersLoading,
  onAddPlayer,
  onEditPlayer,
  onDeletePlayer,
}) {
  const isExpanded = expandedTeamId === team.id;

  // Extract unique tournaments
  const tournaments = Array.from(new Set(
    (team.season_teams || [])
      .map(st => st.season?.tournament?.name || st.tournament?.name)
      .filter(Boolean)
  ));

  // Extract unique seasons
  const seasons = Array.from(new Set(
    (team.season_teams || [])
      .map(st => st.season?.name)
      .filter(Boolean)
  ));

  return (
    <Fragment>
      <tr className="border-b border-navy-light hover:bg-navy-dark/70 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
        {/* ID */}
        <td className="py-4 px-6 text-center text-gray-400 font-medium text-xs">
          {team.id}
        </td>

        {/* Đội bóng */}
        <td className="py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-10 h-10 rounded-xl object-cover border border-navy-light bg-white" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-base text-blue-600 shadow-sm border border-gray-200">
                  {team.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white text-sm truncate leading-tight max-w-[250px]">{team.name}</span>
              {tournaments.length > 0 && (
                <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                  <span className="text-[11px] font-medium leading-tight truncate max-w-[180px]">{tournaments[0]}</span>
                  {tournaments.length > 1 && (
                    <span className="text-[10px] font-bold bg-navy-light px-1.5 py-0.5 rounded text-gray-300 shrink-0">
                      +{tournaments.length - 1}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </td>

        {/* Mùa giải */}
        <td className="py-4 px-6">
          {seasons.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {seasons.slice(0, 2).map((sName, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 bg-white text-black rounded-lg border border-gray-200 shadow-sm text-xs font-bold whitespace-nowrap">
                  {sName}
                </span>
              ))}
              {seasons.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 bg-navy-light text-gray-300 rounded-lg text-[11px] font-bold whitespace-nowrap">
                  +{seasons.length - 2}
                </span>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 bg-navy-dark text-gray-500 rounded-lg border border-navy-light shadow-sm text-xs font-medium whitespace-nowrap">
              Chưa tham gia
            </span>
          )}
        </td>

        {/* Trạng thái */}
        <td className="py-4 px-6 text-center">
          {team.is_active ? (
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-400/10 text-emerald-500 border border-emerald-400/20">
              Đã duyệt
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full bg-blue-400/10 text-blue-500 border border-blue-400/20">
              Hoạt động
            </span>
          )}
        </td>

        {/* Duyệt */}
        <td className="py-4 px-6 text-center">
          {!team.is_active && (
            <button onClick={() => onApprove(team)} className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-colors mx-auto" title="Duyệt Đội bóng">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold">Duyệt</span>
            </button>
          )}
        </td>

        {/* Thao tác */}
        <td className="py-4 px-6">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => onEdit(team)} className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors" title="Chỉnh sửa">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(team)} className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors" title="Xóa đội">
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleExpand(team.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-lg border transition-all ${isExpanded
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-navy-dark text-gray-300 border-navy-light hover:bg-navy-light'
                }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Đội hình</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-b border-navy-light">
          <td colSpan={6} className="p-0">
            <TeamRosterPanel
              team={team}
              players={getTeamRoster(team)}
              isLoading={!!playersLoading[team.id]}
              onAddPlayer={onAddPlayer}
              onEditPlayer={onEditPlayer}
              onDeletePlayer={onDeletePlayer}
            />
          </td>
        </tr>
      )}
    </Fragment>
  );
}
