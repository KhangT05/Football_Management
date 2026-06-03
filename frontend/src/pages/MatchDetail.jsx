import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Shield, Activity } from 'lucide-react';
import { lineupData, matchResults, timelineEvents } from '../data/data';
import SoccerBallIcon from '../components/SoccerBallIcon';

export default function MatchDetail() {
  const { id } = useParams();
  const matchId = id ? parseInt(id) : 3;
  // Fallback to the first match if not found
  const match = matchResults.find(m => m.id === matchId) || matchResults[0];

  return (
    <div className="min-h-screen bg-navy-dark text-white pb-20">
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 lg:px-8 pt-6">
        <Link to="/lich-thi-dau" className="inline-flex items-center gap-2 text-gray-400 hover:text-neon transition-colors text-sm font-bold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Lịch thi đấu
        </Link>
      </div>

      {/* Scoreboard Header */}
      <section className="relative mt-6 mb-12 bg-navy border-b border-navy-light shadow-lg shadow-black/20">
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20">
           <div className="flex justify-center items-center gap-4 md:gap-16">
              
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1 max-w-[200px]">
                 <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-navy-light bg-navy-dark flex items-center justify-center font-black text-3xl md:text-5xl text-gray-400 shadow-lg shadow-black/20 hover:border-blue-300 transition-colors duration-300">
                   {match.logoA}
                 </div>
                 <h2 className="mt-4 text-center font-black text-lg md:text-2xl text-white tracking-widest uppercase">
                   {match.teamA}
                 </h2>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center shrink-0">
                 <div className="px-6 py-4 md:px-10 md:py-6 bg-navy border border-navy-light rounded-3xl shadow-lg shadow-black/20 mb-4 flex items-center gap-4 md:gap-8">
                    <span className="text-5xl md:text-7xl font-black text-red-500">
                      {match.scoreA}
                    </span>
                    <span className="text-2xl md:text-4xl font-bold text-gray-300">-</span>
                    <span className="text-5xl md:text-7xl font-black text-red-500">
                      {match.scoreB}
                    </span>
                 </div>
                 <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest bg-navy-light border border-navy-light px-4 py-1.5 rounded-full">
                   Full Time
                 </span>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1 max-w-[200px]">
                 <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-navy-light bg-navy-dark flex items-center justify-center font-black text-3xl md:text-5xl text-gray-400 shadow-lg shadow-black/20 hover:border-blue-300 transition-colors duration-300">
                   {match.logoB}
                 </div>
                 <h2 className="mt-4 text-center font-black text-lg md:text-2xl text-white tracking-widest uppercase">
                   {match.teamB}
                 </h2>
              </div>

           </div>

           {/* Match Info Strip */}
           <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-2 text-gray-400 font-medium">
                 <Clock className="w-5 h-5 text-neon" />
                 <span>{match.date} • {match.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 font-medium">
                 <MapPin className="w-5 h-5 text-red-500" />
                 <span>{match.location}</span>
              </div>
           </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl">
        
        {/* Timeline (Left/Center col) */}
        <section className="lg:col-span-2 space-y-8">
           <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3">
             <Activity className="w-6 h-6 text-neon" /> Diễn Biến Trận Đấu
           </h3>
           
           <div className="relative pl-6 sm:pl-0 sm:mx-auto max-w-2xl">
              {/* Vertical line line */}
              <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 bg-blue-600 sm:-translate-x-1/2 rounded-full shadow-inner"></div>
              
              <div className="space-y-8">
                 {timelineEvents.map((evt) => {
                    const isHome = evt.team === 'home';
                    // Colors
                    const iconColor = evt.type === 'goal' ? 'text-white bg-navy border-navy-light' : 
                                      evt.type === 'card_yellow' ? 'text-yellow-500 bg-navy border-yellow-500' :
                                      'text-red-500 bg-navy border-red-600';
                    return (
                       <div key={evt.id} className={`relative flex sm:items-center sm:justify-between sm:w-full ${isHome ? 'sm:flex-row-reverse' : ''}`}>
                          
                          {/* Marker */}
                          <div className={`absolute left-0 sm:left-1/2 -translate-x-[14px] sm:-translate-x-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 shadow-lg shadow-black/20 ${iconColor}`}>
                             {evt.type === 'goal' ? <SoccerBallIcon className="w-4 h-4" /> : <div className="w-3 h-4 bg-current rounded-sm shadow-lg shadow-black/20"></div>}
                          </div>

                          {/* Empty space for SM offset */}
                          <div className="hidden sm:block sm:w-5/12"></div>
                          
                          {/* Content Card */}
                          <div className="ml-10 sm:ml-0 sm:w-5/12 relative group">
                             <div className={`bg-navy border border-navy-light p-4 rounded-xl shadow-lg shadow-black/20 flex items-center justify-between gap-4 group-hover:border-blue-300 group-hover:shadow-md transition-all duration-300 ${
                                 isHome && 'sm:flex-row-reverse sm:text-right'
                             }`}>
                                <div className="font-bold text-white group-hover:text-neon transition-colors">
                                   {evt.player}
                                </div>
                                <div className="text-xl font-black text-neon">
                                   {evt.minute}
                                </div>
                             </div>
                             {/* Connector Arrow (Hidden on Mobile) */}
                             <div className={`hidden sm:block absolute top-1/2 -translate-y-1/2 w-6 h-px bg-blue-200 ${
                                 isHome ? 'left-auto -right-6' : '-left-6'
                             }`}></div>
                          </div>
                          
                       </div>
                    );
                 })}
              </div>
           </div>
        </section>

        {/* Lineups (Right col) */}
        <section className="space-y-8">
           <h3 className="text-2xl font-black text-neon uppercase tracking-wider mb-8 flex items-center gap-3">
             <Shield className="w-6 h-6 text-neon" /> Đội Hình Xuất Phát
           </h3>
           
           <div className="grid grid-cols-2 gap-4">
              {/* Home Lineup */}
              <div className="bg-navy border border-navy-light rounded-2xl p-4 md:p-6 shadow-lg shadow-black/20">
                 <h4 className="text-center font-bold text-white border-b border-navy-light pb-3 mb-4 uppercase text-xs tracking-widest">{match.teamA}</h4>
                 <ul className="space-y-3">
                    {lineupData.home.map(p => (
                       <li key={p.number} className="flex items-center gap-3">
                          <span className="w-6 font-mono text-neon font-bold text-right text-xs shrink-0">{p.number}</span>
                          <span className="font-medium text-white text-sm truncate">{p.name}</span>
                       </li>
                    ))}
                 </ul>
              </div>

              {/* Away Lineup */}
              <div className="bg-navy border border-navy-light rounded-2xl p-4 md:p-6 shadow-lg shadow-black/20">
                 <h4 className="text-center font-bold text-white border-b border-navy-light pb-3 mb-4 uppercase text-xs tracking-widest">{match.teamB}</h4>
                 <ul className="space-y-3">
                    {lineupData.away.map(p => (
                       <li key={p.number} className="flex items-center gap-3">
                          <span className="font-medium text-white text-sm truncate flex-1">{p.name}</span>
                          <span className="w-6 font-mono text-neon font-bold text-left text-xs shrink-0">{p.number}</span>
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}
