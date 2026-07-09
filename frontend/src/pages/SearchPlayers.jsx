import { useState, useEffect } from 'react';
import { Search, UserCircle, Loader2, ArrowUpDown } from 'lucide-react';
import { playerApi } from '../api';
import { AVATAR_COLORS, getInitials, POSITION_LABELS } from '../utils/constants';
import PosBadge from '../components/myteam/PosBadge';
import Pagination from '../components/ui/Pagination';

export default function SearchPlayers() {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const res = await playerApi.getAll({ per_page: 500 });
        const list = (typeof res?.status === 'boolean') ? res.data?.data || res.data : res?.data?.data || res?.data || res || [];
        setPlayers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách cầu thủ:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  // Format player list (xử lý dữ liệu trả về từ API)
  const normalizedPlayers = players.map(p => ({
    id: p.id,
    name: p.user?.name || p.name || 'Cầu thủ vô danh',
    email: p.user?.email,
    position: p.position || 'OTHER',
    avatar: p.user?.avatar || p.avatar,
    nationality: p.nationality || 'Việt Nam',
    dateOfBirth: p.date_of_birth,
  }));

  // Lọc
  const filteredPlayers = normalizedPlayers.filter(p =>
    p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(debouncedQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPlayers = filteredPlayers.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="mb-10 text-center animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon uppercase tracking-tight mb-4">
            Tra Cứu Cầu Thủ
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tìm kiếm thông tin cá nhân của các cầu thủ, thống kê vị trí và các đội bóng tham gia.
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
                placeholder="Nhập tên cầu thủ hoặc email..."
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
            <p className="text-gray-400 font-bold">Đang tải danh sách cầu thủ...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="bg-navy/40 backdrop-blur-md border border-navy-light rounded-3xl p-12 text-center max-w-2xl mx-auto">
            <UserCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy cầu thủ nào</h3>
            <p className="text-gray-400">
              Vui lòng thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-navy/60 backdrop-blur-md border border-navy-light rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-navy-dark/60 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-navy-light/50">
                      <th className="py-4 px-6">Cầu thủ</th>
                      <th className="py-4 px-6 text-center">Vị trí</th>
                      <th className="py-4 px-6">Quốc tịch</th>
                      <th className="py-4 px-6">Ngày sinh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-light/50">
                    {paginatedPlayers.map((player, idx) => {
                      const initial = getInitials(player.name);
                      const colorIdx = player.id % AVATAR_COLORS.length;

                      return (
                        <tr
                          key={player.id}
                          className="hover:bg-navy-light/20 transition-all duration-300 group animate-fade-in"
                          style={{ animationDelay: `${(idx % 10) * 40}ms` }}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                                {player.avatar ? (
                                  <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full bg-navy-dark border-2 border-navy-light relative z-10 object-cover" />
                                ) : (
                                  <div className={`w-12 h-12 rounded-full bg-linear-to-br ${AVATAR_COLORS[colorIdx]} border-2 border-navy-light flex items-center justify-center font-black text-white text-sm relative z-10`}>
                                    {initial}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-white text-base group-hover:text-blue-400 transition-colors truncate">{player.name}</p>
                                {player.email && <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">{player.email}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <PosBadge pos={player.position} />
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-300 font-medium">{player.nationality}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-400">
                              {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
