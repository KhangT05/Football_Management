import { useState } from 'react';
import { CalendarDays, MapPin, Clock, Trophy } from 'lucide-react';
import { matchResults, upcomingMatches } from '../data/data';
import MatchRow from '../components/MatchRow';

export default function ScheduleResults() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="py-8 lg:py-12 bg-navy-dark min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-black text-neon uppercase italic tracking-tight mb-4">
              Lịch thi đấu & <span className="text-white">Kết quả</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
              Theo dõi lịch thi đấu và cập nhật kết quả mới nhất của giải đấu một cách nhanh chóng và chính xác.
            </p>
          </div>

          <div className="flex bg-navy p-1.5 rounded-xl border border-navy-light max-w-md mx-auto mb-10 md:mb-12 shadow-lg shadow-black/20">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-3.5 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                activeTab === 'upcoming' 
                  ? 'bg-[#003280] text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-navy-dark'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Các trận đấu sắp tới
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-3.5 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                activeTab === 'results' 
                  ? 'bg-[#003280] text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-navy-dark'
              }`}
            >
              <Trophy className="w-4 h-4" /> Kết quả trận đấu
            </button>
          </div>

          <div className="space-y-4 md:space-y-6">
            {activeTab === 'upcoming' 
              ? upcomingMatches.map(match => <MatchRow key={match.id} match={match} isResult={false} />)
              : matchResults.map(match => <MatchRow key={match.id} match={match} isResult={true} />)
            }
          </div>
        </div>
      </div>
    </div>
  );
}
