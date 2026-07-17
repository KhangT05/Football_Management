import { Search, RefreshCw, Zap, Clock } from 'lucide-react';
import Pagination from '../ui/Pagination';

/**
 * MatchSelectorPanel
 * ─────────────────────────────────────────────────────
 * Panel tìm kiếm và chọn trận đấu để điều khiển live.
 *
 * @prop {Array}    matches              — danh sách trận đã lọc theo status + search
 * @prop {number}   allSeasonMatchesCount — tổng số trận scheduled/ongoing TRƯỚC khi
 *                                          áp search filter — dùng để phân biệt
 *                                          "season không có trận" vs "search 0 kết quả"
 * @prop {Array}    teams
 * @prop {boolean}  isLoading
 * @prop {string}   searchTerm
 * @prop {Function} setSearchTerm
 * @prop {Array}    displayedMatches
 * @prop {number}   currentPage
 * @prop {Function} setCurrentPage
 * @prop {number}   totalPages
 * @prop {string}   selectedMatchId
 * @prop {Function} onMatchSelect
 * @prop {Function} onRefresh
 * @prop {boolean}  isRefreshing
 * @prop {Function} [onGoToSchedule] — callback chuyển sang tab Lịch thi đấu (optional)
 */
export default function MatchSelectorPanel({
  matches,
  allSeasonMatchesCount,
  teams,
  isLoading,
  searchTerm,
  setSearchTerm,
  displayedMatches,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedMatchId,
  onMatchSelect,
  onRefresh,
  isRefreshing,
  onGoToSchedule,
}) {
  const fmtMatchDate = (m) => m?.scheduled_at
    ? new Date(m.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
    : 'TBD';

  const getTeamName = (match, side) => {
    const idKey = side === 'home' ? 'home_team_id' : 'away_team_id';
    const teamKey = side === 'home' ? 'home_team' : 'away_team';
    return match[teamKey]?.name
      ?? teams.find(t => Number(t.id) === Number(match[idKey]))?.name
      ?? `Đội #${match[idKey]}`;
  };

  const hasSearchTerm = searchTerm.trim().length > 0;

  return (
    <div className="space-y-5">
      {/* Search & Refresh */}
      <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-400" /> Tìm kiếm trận Live
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên đội..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-5 py-3 rounded-xl bg-navy-dark border border-navy-light text-gray-400 hover:text-white hover:border-gray-500 transition-all disabled:opacity-40"
              title="Tải lại danh sách trận"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Match Cards */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          Chọn Trận Đấu
          {matches.length > 0 && (
            <span className="ml-auto text-gray-600 font-normal">{matches.length} trận</span>
          )}
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-navy-light rounded-2xl">
            <div className="text-3xl mb-3">🏟️</div>
            {/* Phân 2 case: season thật sự trống vs search filter loại hết —
                trước đây render chung 1 message, không phân biệt được nguyên
                nhân, dead-end không có action. */}
            {allSeasonMatchesCount === 0 ? (
              <>
                <p className="text-gray-500 text-sm mb-4">
                  Mùa giải chưa có trận nào ở trạng thái{' '}
                  <span className="text-amber-400 font-bold">chờ diễn ra</span> hoặc{' '}
                  <span className="text-red-400 font-bold">đang diễn ra</span>.
                </p>
                {onGoToSchedule && (
                  <button
                    onClick={onGoToSchedule}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors"
                  >
                    + Đi tới Lịch thi đấu để tạo trận
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-3">
                  Không tìm thấy trận đấu khớp với{' '}
                  <span className="text-white font-bold">"{searchTerm}"</span>.
                </p>
                {hasSearchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-navy-dark border border-navy-light hover:border-gray-500 text-gray-300 hover:text-white font-bold text-sm rounded-xl transition-colors"
                  >
                    Xoá bộ lọc
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {displayedMatches.map(m => {
                const isSelected = String(m.id) === String(selectedMatchId);
                const isLive = m.status === 'ongoing';
                const homeName = getTeamName(m, 'home');
                const awayName = getTeamName(m, 'away');
                return (
                  <button
                    key={m.id}
                    onClick={() => onMatchSelect(String(m.id))}
                    className={`group relative text-left p-4 rounded-2xl border transition-all duration-200 overflow-hidden ${isSelected
                        ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-900/20'
                        : 'bg-navy border-navy-light hover:border-gray-500 hover:bg-navy-light/40'
                      }`}
                  >
                    {isLive && (
                      <div className="absolute inset-0 bg-linear-to-r from-red-600/5 to-transparent pointer-events-none" />
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className={`text-xs font-black px-2.5 py-1 rounded-full ${isLive
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-navy-dark text-gray-500 border border-navy-light'
                        }`}>
                        {isLive ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            LIVE
                          </span>
                        ) : <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Sắp diễn ra</span>}
                      </div>
                      <span className="text-xs text-gray-600">{fmtMatchDate(m)}</span>
                    </div>

                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {homeName[0]}
                        </div>
                        <span className="font-bold text-white text-sm truncate">{homeName}</span>
                      </div>
                      <span className="text-gray-600 font-black text-xs shrink-0 px-2">VS</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <span className="font-bold text-white text-sm truncate text-right">{awayName}</span>
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-orange-600 to-amber-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {awayName[0]}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}