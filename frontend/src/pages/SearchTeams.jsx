import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, ArrowRight, Loader2, Users } from 'lucide-react';
import { teamApi } from '../api';
import { AVATAR_COLORS, getInitials } from '../utils/constants';

export default function SearchTeams() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const res = await teamApi.getTeams({ per_page: 100 });
        const list = (typeof res?.status === 'boolean') ? res.data?.data || res.data : res?.data?.data || res?.data || res || [];
        setTeams(Array.isArray(list) ? list.filter(t => t.is_active || t.status === 'approved') : []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách đội:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    team.coach_name?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-200 h-200 bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="mb-10 text-center animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon uppercase tracking-tight mb-4">
            Tra Cứu Đội Bóng
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tìm kiếm thông tin các đội bóng đang tham gia giải đấu, xem danh sách cầu thủ và ban huấn luyện.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center bg-navy/80 backdrop-blur-xl border border-navy-light rounded-2xl overflow-hidden shadow-2xl">
              <div className="pl-5 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Nhập tên đội bóng hoặc HLV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white px-4 py-4 focus:outline-none focus:ring-0 text-lg placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-neon animate-spin mb-4" />
            <p className="text-gray-400 font-bold">Đang tải danh sách đội bóng...</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="bg-navy/40 backdrop-blur-md border border-navy-light rounded-3xl p-12 text-center max-w-2xl mx-auto">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy đội bóng nào</h3>
            <p className="text-gray-400">
              Vui lòng thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeams.map((team, idx) => {
              const initial = getInitials(team.name);
              const colorIdx = team.id % AVATAR_COLORS.length;
              
              return (
                <div
                  key={team.id}
                  className="bg-navy/60 backdrop-blur-md border border-navy-light rounded-3xl p-6 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group shadow-lg animate-fade-in"
                  style={{ animationDelay: `${(idx % 10) * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-black text-2xl text-white shadow-lg border-2 border-white/10 shrink-0 overflow-hidden relative`}>
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        initial
                      )}
                    </div>
                    {team.is_active && (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        Hoạt động
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors truncate">
                    {team.name}
                  </h3>
                  
                  <p className="text-sm text-gray-400 mb-4 flex items-center gap-2 truncate">
                    <Users className="w-4 h-4 shrink-0" />
                    HLV: <span className="text-gray-300 font-semibold truncate">{team.coach_name || 'Đang cập nhật'}</span>
                  </p>
                  
                  <Link
                    to={`/doi-bong/${team.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-navy-dark hover:bg-blue-600 border border-navy-light hover:border-blue-500 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-all group/btn"
                  >
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
