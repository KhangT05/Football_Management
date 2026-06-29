import { CalendarDays, MapPin, Clock } from 'lucide-react';

function TeamSide({ name, logo, isWinner, reverse }) {
    return (
        <div className={`flex-1 flex ${reverse ? 'flex-col md:flex-row' : 'flex-col-reverse md:flex-row-reverse'} items-center gap-2 md:gap-4 ${reverse ? 'text-center md:text-left' : 'text-center md:text-right'}`}>
            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex items-center justify-center font-bold text-sm md:text-xl border border-navy-light bg-navy-dark text-gray-400">
                {logo}
            </div>
            <span className={`text-sm md:text-xl ${isWinner ? 'font-black text-white' : 'font-semibold text-gray-200'}`}>{name}</span>
        </div>
    );
}

export default function MatchRow({ match, isResult }) {
    const isAWin = isResult && match.scoreA > match.scoreB;
    const isBWin = isResult && match.scoreB > match.scoreA;

    return (
        <div className="bg-navy border border-navy-light rounded-2xl p-4 md:p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-md shadow-lg shadow-black/20">
            <div className={`flex items-center justify-between text-[11px] md:text-sm font-bold uppercase tracking-wider border-b border-navy-light pb-3 mb-4 ${isResult ? 'text-gray-400' : 'text-neon'}`}>
                <div className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 shrink-0" />{match.date}</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 shrink-0" />{match.location}</div>
            </div>

            <div className="flex items-center justify-between gap-1 md:gap-4">
                <TeamSide name={match.teamA} logo={match.logoA} isWinner={isAWin} reverse={false} />

                <div className="shrink-0 w-24 md:w-32 flex justify-center">
                    {isResult ? (
                        <div className="flex flex-col items-center">
                            <span className="text-2xl md:text-4xl font-black text-red-500 tracking-widest">
                                {match.scoreA}<span className="text-gray-300 mx-1 md:mx-2">-</span>{match.scoreB}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">FT</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Clock className="w-4 h-4 md:w-6 md:h-6 text-neon mb-1" />
                            <span className="text-sm md:text-xl font-bold text-neon">{match.time}</span>
                        </div>
                    )}
                </div>

                <TeamSide name={match.teamB} logo={match.logoB} isWinner={isBWin} reverse={true} />
            </div>
        </div>
    );
}