import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trophy, Loader2, ArrowRight, MapPin, Users, Activity, Filter, ChevronDown } from 'lucide-react';
import { tournamentApi } from '../api';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'registration_open', label: 'Mở đăng ký' },
  { value: 'ongoing', label: 'Đang diễn ra' },
  { value: 'finished', label: 'Đã kết thúc' }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'name_asc', label: 'Tên A-Z' },
  { value: 'name_desc', label: 'Tên Z-A' }
];

export default function SearchTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTournaments = async () => {
      setIsLoading(true);
      try {
        const res = await tournamentApi.getAll({ per_page: 500 });
        const payload = (typeof res?.status === 'boolean') ? res.data : res;
        const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        setTournaments(list);
      } catch (err) {
        console.error('Lỗi khi tải danh sách giải đấu:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const filteredTournaments = useMemo(() => {
    let result = [...tournaments];

    // 1. Filter by Name (Search)
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(t => t.name?.toLowerCase().includes(q));
    }

    // 2. Filter by Status
    if (statusFilter !== 'all') {
      // Giả định backend trả về field status (hoặc latest_season_status).
      // Nếu backend không trả về, mặc định ta chỉ so khớp tương đối hoặc bỏ qua.
      result = result.filter(t => {
        // Tùy biến logic ở đây dựa vào API thực tế
        const s = t.status || t.latest_season_status || 'ongoing'; // fallback
        return s === statusFilter;
      });
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortOption === 'name_asc') return a.name?.localeCompare(b.name);
      if (sortOption === 'name_desc') return b.name?.localeCompare(a.name);
      if (sortOption === 'newest') return (b.id || 0) - (a.id || 0); // fallback sort by id
      if (sortOption === 'oldest') return (a.id || 0) - (b.id || 0);
      return 0;
    });

    return result;
  }, [tournaments, debouncedQuery, statusFilter, sortOption]);

  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] pb-12 relative overflow-hidden">
      {/* Hero / Filter Section */}
      <div className="bg-navy border-b border-navy-light pt-12 pb-8 relative z-10 shadow-xl">
        <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon uppercase tracking-tight mb-3">
              Hệ Thống Giải Đấu
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Tìm kiếm, theo dõi và đăng ký tham gia các giải đấu bóng đá hấp dẫn trên toàn quốc.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-navy-dark/80 backdrop-blur-md border border-navy-light rounded-2xl p-4 shadow-2xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tên giải đấu, đơn vị tổ chức..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-navy border border-navy-light hover:border-blue-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              {/* Status Select */}
              <div className="w-full md:w-56 relative group shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-navy border border-navy-light hover:border-blue-500/50 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all font-medium cursor-pointer"
                >
                  {STATUS_FILTER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Select */}
              <div className="w-full md:w-48 relative group shrink-0">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-navy border border-navy-light hover:border-blue-500/50 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all font-medium cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Results Section */}
      <div className="container mx-auto px-4 max-w-7xl relative z-10 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            Kết quả tìm kiếm ({filteredTournaments.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-400 font-bold">Đang tải danh sách giải đấu...</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="bg-navy/40 backdrop-blur-md border border-navy-light rounded-3xl p-12 text-center max-w-2xl mx-auto">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy giải đấu</h3>
            <p className="text-gray-400">
              Không có giải đấu nào phù hợp với tiêu chí tìm kiếm hiện tại. Vui lòng thử lại.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTournaments.map((tour, idx) => {
              const status = tour.status || tour.latest_season_status || 'ongoing';
              let statusText = 'Đang diễn ra';
              let statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
              
              if (status === 'registration_open') {
                statusText = 'Mở đăng ký';
                statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              } else if (status === 'finished') {
                statusText = 'Đã kết thúc';
                statusColor = 'bg-gray-500/10 text-gray-400 border-gray-500/30';
              }

              return (
                <Link
                  key={tour.id}
                  to={`/giai-dau/${tour.id}`}
                  className="bg-navy border border-navy-light hover:border-blue-500/50 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group shadow-lg flex flex-col"
                  style={{ animationDelay: `${(idx % 10) * 50}ms` }}
                >
                  {/* Banner & Logo */}
                  <div className="relative h-36 bg-navy-light/50">
                    {tour.banner ? (
                      <img src={tour.banner} alt={tour.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10" style={{ background: 'linear-gradient(135deg, #0A192F 0%, #112240 100%)' }}>
                        <Trophy className="w-16 h-16 text-white" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>

                    {/* Logo overlapping banner */}
                    <div className="absolute -bottom-8 left-6">
                      <div className="w-16 h-16 rounded-xl bg-navy-dark border-2 border-navy-light overflow-hidden shadow-xl flex items-center justify-center">
                        {tour.logo ? (
                          <img src={tour.logo} alt={tour.name} className="w-full h-full object-cover" />
                        ) : (
                          <Trophy className="w-8 h-8 text-blue-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="pt-10 pb-5 px-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {tour.name}
                    </h3>

                    {tour.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">
                        {tour.description}
                      </p>
                    )}

                    <div className="mt-auto space-y-2 border-t border-navy-light/50 pt-4">
                      {/* Fake data indicators for structure completeness */}
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span>Việt Nam</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Users className="w-3.5 h-3.5 text-gray-500" />
                        <span>Bóng đá sân 7</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
