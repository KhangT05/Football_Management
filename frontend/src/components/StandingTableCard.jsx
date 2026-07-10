import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export default function StandingTableCard({ group, teams = [], activeSeasonName = 'Mùa giải' }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col transition-transform hover:-translate-y-1 duration-300">
      <div className="px-5 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{activeSeasonName}</h3>
          <h4 className="text-base font-black text-gray-900 mt-0.5">{group.groupName || 'Bảng đấu'}</h4>
        </div>
        <Trophy className="w-5 h-5 text-gray-300" />
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap min-w-[320px]">
          <thead className="bg-white text-gray-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="py-3 px-4">Đội</th>
              <th className="py-3 px-2 text-center" title="Số trận đã đấu">ĐĐ</th>
              <th className="py-3 px-2 text-center" title="Thắng">T</th>
              <th className="py-3 px-2 text-center" title="Hòa">H</th>
              <th className="py-3 px-2 text-center" title="Thua">B</th>
              <th className="py-3 px-2 text-center" title="Hiệu số">HS</th>
              <th className="py-3 px-4 text-center text-gray-900 font-black">Đ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {group.standings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400 text-xs">Trống</td>
              </tr>
            ) : (
              group.standings.map((row, idx) => {
                const team = teams.find(t => t.id === row.team_id);
                const teamName = team?.name ?? row.team_name ?? `Đội ${row.team_id}`;
                const initial = teamName.substring(0, 1).toUpperCase();
                
                const played = row.played ?? row.matches_played ?? 0;
                const won = row.won ?? row.wins ?? 0;
                const drawn = row.drawn ?? row.draws ?? 0;
                const lost = row.lost ?? row.losses ?? 0;
                const goalsFor = row.goals_for ?? 0;
                const goalsAgainst = row.goals_against ?? 0;
                const goalDifference = row.goal_difference ?? (goalsFor - goalsAgainst);
                const points = row.points ?? 0;

                return (
                  <tr key={row.team_id ?? idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/doi-bong/${row.team_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <span className="text-xs font-bold text-gray-400 w-3">{idx + 1}</span>
                        <div className="w-6 h-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-600 shrink-0 relative overflow-hidden">
                          <span className="absolute inset-0 flex items-center justify-center">
                            {initial}
                          </span>
                          {team?.logo && (
                            <img 
                              src={team.logo} 
                              alt={teamName} 
                              className="w-full h-full object-contain relative z-10" 
                              onError={(e) => { e.target.style.display = 'none'; }} 
                            />
                          )}
                        </div>
                        <span className="text-sm font-bold text-blue-600 hover:underline truncate max-w-[120px]" title={teamName}>
                          {teamName}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{played}</td>
                    <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{won}</td>
                    <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{drawn}</td>
                    <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{lost}</td>
                    <td className="py-3 px-2 text-center text-xs text-gray-600 font-medium">{goalDifference}</td>
                    <td className="py-3 px-4 text-center text-sm font-black text-gray-900 bg-gray-50/50">{points}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
