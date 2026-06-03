import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MatchCard({ id = 3, status, time, teamA, teamB, scoreA, scoreB, isUpcoming }) {
    return(
        <Link to={`/tran-dau/${id}`} className="block bg-navy border border-navy-light shadow-lg shadow-black/20 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden">
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${status === 'LIVE' ? 'bg-red-600' : isUpcoming ? 'bg-[#003280]' : 'bg-gray-300'} group-hover:w-1.5 transition-all duration-300`} />
      
      <div className="flex justify-between items-center mb-4 pl-2">
        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
          status === 'LIVE' ? 'bg-red-50 text-red-500 border border-red-200' : 
          status === 'FT' ? 'bg-navy-light text-gray-400' : 
          'bg-blue-50 text-neon border border-navy-light'
        }`}>
          {status === 'LIVE' ? (
             <span className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span> 
               Trực tiếp
             </span>
          ) : status === 'FT' ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span> 
              Đã kết thúc
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 
              Sắp diễn ra
            </span>
          )}
        </span>
        <span className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4" /> {time}
        </span>
      </div>
      
      <div className="space-y-4 pl-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-navy-light flex items-center justify-center border border-navy-light">
              <span className="text-xs font-bold text-gray-400">{teamA.substring(0,2).toUpperCase()}</span>
            </div>
            <span className="font-bold text-white">{teamA}</span>
          </div>
          {!isUpcoming && <span className="text-xl font-black text-red-500">{scoreA}</span>}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-navy-light flex items-center justify-center border border-navy-light">
               <span className="text-xs font-bold text-gray-400">{teamB.substring(0,2).toUpperCase()}</span>
             </div>
             <span className="font-bold text-white">{teamB}</span>
          </div>
          {!isUpcoming && <span className="text-xl font-black text-red-500">{scoreB}</span>}
          {isUpcoming && <span className="text-sm font-bold text-gray-400 border border-navy-light rounded-md px-2 py-1 bg-navy-dark">VS</span>}
        </div>
      </div>
    </Link>
    )
}