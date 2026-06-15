import { useState, useEffect } from 'react';
import { CalendarDays, Trophy, WifiOff } from 'lucide-react';
import { matchResults, upcomingMatches } from '../data/data';
import MatchRow from '../components/MatchRow';

// Skeleton cho một MatchRow
function MatchRowSkeleton() {
  return (
    <div className="bg-navy border border-navy-light rounded-2xl p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="flex items-center gap-4 flex-1 justify-center">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-8 w-16 rounded-lg" />
          <div className="skeleton h-5 w-20 rounded" />
        </div>
        <div className="skeleton h-4 w-16 rounded" />
      </div>
    </div>
  );
}

export default function ScheduleResults() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [results, setResults] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate API fetch với loading state
    // Khi backend có match endpoint → thay bằng matchApi.getMatches()
    setIsLoading(true);
    setHasError(false);

    const timer = setTimeout(() => {
      try {
        setUpcoming(upcomingMatches);
        setResults(matchResults);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }, 700); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  const currentData = activeTab === 'upcoming' ? upcoming : results;

  return (
    <div className="py-8 lg:py-12 bg-navy-dark min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-10 md:mb-16 animate-slide-up">
            <h1 className="text-3xl md:text-5xl font-black text-neon uppercase italic tracking-tight mb-4">
              Lịch thi đấu & <span className="text-white">Kết quả</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
              Theo dõi lịch thi đấu và cập nhật kết quả mới nhất của giải đấu một cách nhanh chóng và chính xác.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-navy p-1.5 rounded-xl border border-navy-light max-w-md mx-auto mb-10 md:mb-12 shadow-lg shadow-black/20 animate-fade-in">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-3.5 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-[#003280] text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-navy-dark'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Các trận sắp tới
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

          {/* Content */}
          <div className="space-y-4 md:space-y-6">
            {isLoading ? (
              // Skeleton loading
              <>
                <MatchRowSkeleton />
                <MatchRowSkeleton />
                <MatchRowSkeleton />
                <MatchRowSkeleton />
              </>
            ) : hasError ? (
              // Error state
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400 animate-fade-in">
                <WifiOff className="w-12 h-12 text-gray-600" />
                <p className="font-semibold">Không thể tải dữ liệu. Vui lòng thử lại.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-navy-light border border-navy-light rounded-lg text-sm font-bold hover:bg-navy transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : currentData.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400 animate-fade-in">
                <CalendarDays className="w-12 h-12 text-gray-600" />
                <p className="font-semibold">Chưa có dữ liệu trận đấu.</p>
              </div>
            ) : (
              // Match list with stagger animation
              <div className="space-y-4 md:space-y-6 stagger-children">
                {currentData.map(match => (
                  <div key={match.id} className="animate-slide-up">
                    <MatchRow match={match} isResult={activeTab === 'results'} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
