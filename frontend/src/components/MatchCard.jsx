import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MatchCard({ id = 3, status, time, teamA, teamB, scoreA, scoreB, isUpcoming }) {
    return(
        <Link to={`/tran-dau/${id}`} className="block bg-navy/60 backdrop-blur-lg border border-navy-light shadow-lg shadow-black/20 rounded-2xl p-5 hover:border-blue-500/50 hover:bg-navy hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${status === 'LIVE' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : isUpcoming ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-gray-500'} group-hover:w-1.5 transition-all duration-300`} />
      
      <div className="flex justify-between items-center mb-5 pl-3">
        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${
          status === 'LIVE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
          status === 'FT' ? 'bg-navy-light text-gray-400 border border-navy-light/50' : 
          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {status === 'LIVE' ? (
             <span className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span> 
               Trực tiếp
             </span>
          ) : status === 'FT' ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> 
              Đã kết thúc
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 
              Sắp diễn ra
            </span>
          )}
        </span>
        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 bg-navy-dark px-2.5 py-1 rounded-lg border border-navy-light/50">
          <CalendarDays className="w-3.5 h-3.5" /> {time}
        </span>
      </div>
      
      <div className="space-y-4 pl-3">
        <div className="flex justify-between items-center group/team">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy-light to-navy flex items-center justify-center border border-navy-light/80 shadow-inner group-hover/team:border-blue-500/30 transition-colors">
              <span className="text-xs font-black text-gray-300">{teamA.substring(0,2).toUpperCase()}</span>
            </div>
            <span className="font-bold text-white text-lg group-hover/team:text-blue-400 transition-colors">{teamA}</span>
          </div>
          {!isUpcoming && <span className="text-xl font-black text-white">{scoreA}</span>}
        </div>
        
        <div className="flex justify-between items-center group/team">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy-light to-navy flex items-center justify-center border border-navy-light/80 shadow-inner group-hover/team:border-blue-500/30 transition-colors">
               <span className="text-xs font-black text-gray-300">{teamB.substring(0,2).toUpperCase()}</span>
             </div>
             <span className="font-bold text-white text-lg group-hover/team:text-blue-400 transition-colors">{teamB}</span>
          </div>
          {!isUpcoming && <span className="text-xl font-black text-white">{scoreB}</span>}
          {isUpcoming && <span className="text-[10px] font-black text-blue-400 border border-blue-500/30 rounded-lg px-2.5 py-1 bg-blue-500/10">VS</span>}
        </div>
      </div>
    </Link>
    )
}