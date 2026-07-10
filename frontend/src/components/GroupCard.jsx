import React from 'react';

export default function GroupCard({ group, teamMap = {} }) {
  const teamsCount = group.season_teams?.length || 0;

  return (
    <div className="w-full bg-navy-dark/80 backdrop-blur-xl border border-navy-light rounded-3xl p-6 shadow-2xl hover:border-blue-500/30 transition-colors">
      <div className="flex items-center justify-between border-b border-navy-light/50 pb-4 mb-5">
        <h3 className="text-lg md:text-xl font-black text-blue-400 uppercase tracking-widest">
          {group.name}
        </h3>
        <span className="text-xs font-black text-gray-300 bg-navy-light/80 px-3 py-1.5 rounded-lg border border-white/5">
          {teamsCount} Đội
        </span>
      </div>
      <div className="space-y-3">
        {(!group.season_teams || teamsCount === 0) ? (
          <p className="text-sm text-gray-500 italic text-center py-6 bg-navy/30 rounded-2xl border border-navy-light/30">
            Chưa có đội nào
          </p>
        ) : (
          group.season_teams.map(st => {
            const team = teamMap[st.team_id] || teamMap[st.id] || st.team;
            if (!team) return null;
            return (
              <div key={st.id} className="flex items-center gap-4 bg-navy/40 p-3 rounded-2xl border border-navy-light/30 hover:bg-navy-light/50 hover:border-blue-500/30 transition-all cursor-default group/team">
                <div className="w-10 h-10 rounded-xl shadow-sm group-hover/team:shadow-md transition-all relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 border border-white/10 shrink-0">
                  <span className="absolute inset-0 flex items-center justify-center font-black text-gray-600 text-lg">
                    {team.name ? team.name.charAt(0).toUpperCase() : '?'}
                  </span>
                  {team.logo && (
                    <div className="absolute inset-0 bg-white p-1.5 z-10 flex items-center justify-center">
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.onerror = null; e.target.parentElement.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-gray-200 group-hover/team:text-white transition-colors">
                  {team.name}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
