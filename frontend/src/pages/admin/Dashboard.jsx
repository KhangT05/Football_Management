import AdminLayout from '../../layouts/AdminLayout';
import { Users, UserPlus, CalendarCheck, CalendarClock, Trophy, Goal } from 'lucide-react';
import { topScorers, upcomingMatches } from '../../data/data';
import StatCard from '../../components/StatCard';

export default function Dashboard() {  
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-lg shadow-black/20 border-l-4 border-l-neon relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Trophy className="w-32 h-32 text-neon" />
           </div>
           <h2 className="text-2xl font-extrabold text-neon tracking-tight mb-2 relative z-10">
             Welcome back, Admin! 👋
           </h2>
           <p className="text-gray-400 font-medium relative z-10">
             Here is the current status of the tournament at a glance.
           </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard title="Total Teams" value="8" icon={Users} colorClass="border-navy-light text-neon" />
           <StatCard title="Total Players" value="142" icon={UserPlus} colorClass="border-navy-light text-neon" />
           <StatCard title="Matches Completed" value="12" icon={CalendarCheck} colorClass="border-navy-light text-neon" />
           <StatCard title="Upcoming Matches" value="4" icon={CalendarClock} colorClass="border-red-200 text-red-500" />
        </div>

        {/* Widgets section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Upcoming Matches */}
           <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-navy-light flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-red-500" />
                    Upcoming Matches
                 </h3>
                 <button className="text-sm font-bold text-neon hover:text-neon-hover transition-colors">View All</button>
              </div>
              <div className="p-6 flex-1 bg-navy-dark/50">
                 <div className="space-y-4">
                    {upcomingMatches.slice(0, 3).map((match) => (
                       <div key={match.id} className="bg-navy border border-navy-light p-4 rounded-xl shadow-lg shadow-black/20 hover:border-red-500 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">{match.date} • {match.time}</span>
                             <span className="text-sm font-medium text-gray-400">{match.location}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="font-bold text-white text-right w-20 truncate">{match.teamA}</div>
                             <div className="px-3 py-1 bg-navy-light text-gray-400 text-xs font-black rounded-lg border border-navy-light">VS</div>
                             <div className="font-bold text-white w-20 truncate">{match.teamB}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Top Scorers */}
           <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-navy-light flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Goal className="w-5 h-5 text-neon" />
                    Top Scorers
                 </h3>
              </div>
              <div className="flex-1 overflow-x-auto">
                 <table className="w-full text-left whitespace-nowrap">
                   <thead>
                      <tr className="bg-navy-dark/80 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-navy-light">
                         <th className="py-4 px-6 w-16 text-center">Rank</th>
                         <th className="py-4 px-6">Player</th>
                         <th className="py-4 px-6">Team</th>
                         <th className="py-4 px-6 text-center">Goals</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-navy-light">
                      {topScorers.map((scorer) => (
                         <tr key={scorer.id} className="hover:bg-navy-dark transition-colors">
                            <td className="py-4 px-6 text-center">
                               <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mx-auto shadow-lg shadow-black/20 ${
                                  scorer.rank === 1 ? 'bg-red-100 text-red-500 border border-red-500' :
                                  scorer.rank === 2 ? 'bg-navy-light text-gray-200 border border-navy-light' :
                                  scorer.rank === 3 ? 'bg-navy-light text-gray-400 border border-navy-light' :
                                  'bg-navy-dark text-gray-400 border border-navy-light'
                               }`}>
                                 {scorer.rank}
                               </div>
                            </td>
                            <td className="py-4 px-6 font-bold text-white">{scorer.name}</td>
                            <td className="py-4 px-6 text-gray-400 font-medium text-sm">{scorer.team}</td>
                            <td className="py-4 px-6 text-center font-black text-neon text-lg">
                               {scorer.goals}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                 </table>
              </div>
           </div>

        </div>

      </div>
    </AdminLayout>
  );
}

