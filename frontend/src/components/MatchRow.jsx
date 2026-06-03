import { CalendarDays, MapPin, Clock } from 'lucide-react';


export default function MatchRow({ match, isResult }) {
    const isAWin = isResult && match.scoreA > match.scoreB;
    const isBWin = isResult && match.scoreB > match.scoreA;

    return(
        <div className="bg-navy border border-navy-light rounded-2xl p-4 md:p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-md shadow-lg shadow-black/20">
            <div className={`flex flex-row items-center justify-between text-[11px] md:text-sm font-bold uppercase tracking-wider border-b border-navy-light pb-3 mb-4 ${isResult ? 'text-gray-400' : 'text-neon'}`}>
                <div className="flex items-center gap-1.5 flex-1">
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span>{match.date}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-1 justify-end text-right">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{match.location}</span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-1 md:gap-4">
                
                <div className="flex-1 flex flex-col-reverse md:flex-row items-center md:justify-end gap-2 md:gap-4 text-center md:text-right">
                <span className={`text-sm md:text-xl ${isAWin ? 'font-black text-white' : 'font-semibold text-gray-200'}`}>
                    {match.teamA}
                </span>
                <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex flex-col items-center justify-center font-bold text-sm md:text-xl border border-navy-light bg-navy-dark text-gray-400">
                    {match.logoA}
                </div>
                </div>

                <div className="shrink-0 w-24 md:w-32 flex justify-center">
                {isResult ? (
                    <div className="px-2 py-1.5 md:px-4 md:py-3 flex flex-col items-center justify-center min-w-[70px] md:min-w-[100px]">
                    <span className="text-2xl md:text-4xl font-black text-red-500 tracking-widest">
                        {match.scoreA}<span className="text-gray-300 mx-1 md:mx-2">-</span>{match.scoreB}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">FT</span>
                    </div>
                ) : (
                    <div className="px-2 py-1.5 md:px-4 md:py-3 flex flex-col items-center justify-center min-w-[70px] md:min-w-[100px]">
                    <Clock className="w-4 h-4 md:w-6 md:h-6 text-neon mb-1" />
                    <span className="text-sm md:text-xl font-bold text-neon">{match.time}</span>
                    </div>
                )}
                </div>

                <div className="flex-1 flex flex-col md:flex-row items-center justify-start gap-2 md:gap-4 text-center md:text-left">
                <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex flex-col items-center justify-center font-bold text-sm md:text-xl border border-navy-light bg-navy-dark text-gray-400">
                    {match.logoB}
                </div>
                <span className={`text-sm md:text-xl ${isBWin ? 'font-black text-white' : 'font-semibold text-gray-200'}`}>
                    {match.teamB}
                </span>
                </div>
                
            </div>
            </div>
    )
}