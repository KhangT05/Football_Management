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

  return (
    <Fragment>
      <tr className="border-b border-navy-light hover:bg-navy-dark/70 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
        <td className="py-4 px-6 text-center">
          {team.logo ? (
            <img src={team.logo} alt={team.name} className="w-10 h-10 rounded-full object-cover mx-auto border border-navy-light" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-navy-dark border border-navy-light flex items-center justify-center font-bold text-base mx-auto text-white">
              {team.name?.[0]?.toUpperCase()}
            </div>
          )}
        </td>
        <td className="py-4 px-6">
          <p className="font-bold text-white">{team.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">#{team.id}</p>
        </td>
        <td className="py-4 px-6">
          {team.user?.name ? (
            <div>
              <span className="font-bold text-white">{team.user.name}</span>
              <span className="block text-xs text-gray-500 mt-0.5">Người đăng ký (Đội trưởng)</span>
            </div>
          ) : (
            <span className="text-gray-300 text-sm">{team.coach_name || '—'}</span>
          )}
        </td>
        <td className="py-4 px-6">
          {team.season_teams && team.season_teams.length > 0 ? (
            <div className="flex flex-col gap-2">
              {team.season_teams.map(st => (
                <div key={st.season.id} className="inline-flex items-center px-2.5 py-1.5 bg-navy-light rounded-lg border border-navy-light/50 shadow-sm text-black text-[11px] font-bold whitespace-nowrap self-start">
                  {st.season?.name || 'Không rõ'}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-500 text-xs">—</span>
          )}
        </td>
        <td className="py-4 px-6">
          {team.season_teams && team.season_teams.length > 0 ? (
            <div className="flex flex-col gap-2">
              {team.season_teams.map(st => {
                const tName = st.season?.tournament?.name || st.tournament?.name;
                return tName ? (
                  <div key={st.season.id} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-navy-light/40 rounded-lg border border-navy-light/70 text-black self-start min-w-0">
                    <Trophy className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-bold leading-tight truncate uppercase tracking-wider">{tName}</span>
                  </div>
                ) : (
                  <div key={st.season.id} className="h-7 flex items-center">
                    <span className="text-gray-500 text-xs">—</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-gray-500 text-xs">—</span>
          )}
        </td>
        <td className="py-4 px-6 text-center">
          {team.is_active ? (
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-emerald-400/10 text-emerald-400 border-emerald-400/30">
              Đã Duyệt
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-yellow-400/10 text-yellow-400 border-yellow-400/30">
              Chờ Duyệt
            </span>
          )}
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center justify-end gap-2">
            {!team.is_active && (
              <button onClick={() => onApprove(team)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-colors" title="Duyệt Đội bóng">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold">Duyệt</span>
              </button>
            )}
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
          <td colSpan={7} className="p-0">
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
