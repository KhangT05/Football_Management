import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  options = [8, 10, 25, 50, 100],
  isLoading = false,
  totalCount = null,
}) {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handlePageInput = (e) => {
    setInputPage(e.target.value);
  };

  const handlePageSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      let newPage = parseInt(inputPage, 10);
      if (isNaN(newPage) || newPage < 1) newPage = 1;
      if (newPage > totalPages) newPage = totalPages;

      setInputPage(newPage);
      if (newPage !== currentPage && !isLoading) {
        onPageChange(newPage);
      }
    }
  };

  // FIX: đổi items/page mà không về trang 1 dễ khiến trang hiện tại vượt quá
  // totalPages mới (VD: đang trang 5/limit 10 → đổi limit 100 → totalPages
  // mới có thể chỉ còn 2) → parent nhận currentPage=5 vô nghĩa. Ép reset về
  // trang 1 ngay tại nguồn thay vào việc dựa vào parent nhớ làm việc này.
  const handleItemsPerPageChange = (e) => {
    const newLimit = Number(e.target.value);
    onItemsPerPageChange(newLimit);
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const isFirst = currentPage <= 1 || isLoading;
  const isLast = currentPage >= totalPages || isLoading;

  if (totalPages <= 1 && options.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-navy border border-navy-light rounded-2xl p-4 gap-4 shadow-lg">

      <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
        <span className="text-sm font-bold text-gray-400">Hiển thị:</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          disabled={isLoading}
          className="bg-navy-dark border border-navy-light text-white text-sm font-bold rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer appearance-none text-center min-w-[70px] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto', paddingRight: '2rem' }}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="text-sm font-bold text-gray-500">dòng</span>
        {totalCount !== null && (
          <span className="text-xs text-gray-500 hidden sm:inline">
            ({totalCount.toLocaleString('vi-VN')} bản ghi)
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${isFirst
            ? 'border-navy-light bg-navy-dark/50 text-gray-600 cursor-not-allowed'
            : 'border-navy-light bg-navy-dark text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10'
            }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-2">
          <span className="text-sm font-bold text-gray-400">Trang</span>
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
          ) : (
            <input
              type="number"
              value={inputPage}
              onChange={handlePageInput}
              onKeyDown={handlePageSubmit}
              onBlur={handlePageSubmit}
              min={1}
              max={totalPages}
              disabled={isLoading || totalPages <= 0}
              className="w-14 bg-navy-dark border border-navy-light text-white text-sm font-bold rounded-xl px-2 py-2 text-center outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hide-spin-button [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50"
              title="Nhấn Enter để chuyển trang"
            />
          )}
          <span className="text-sm font-bold text-gray-400">/ {totalPages || 1}</span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${isLast
            ? 'border-navy-light bg-navy-dark/50 text-gray-600 cursor-not-allowed'
            : 'border-navy-light bg-navy-dark text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10'
            }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}