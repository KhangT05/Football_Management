import { useState, useEffect, useRef } from 'react';

/**
 * useDebouncedValue
 * ─────────────────────────────────────────────────────
 * Trả về giá trị đã được debounce sau `delay` ms.
 * Khi `value` thay đổi liên tục, chỉ cập nhật sau khi
 * người dùng ngừng nhập đủ `delay` ms.
 *
 * @param {*} value   — giá trị gốc (thường là searchTerm)
 * @param {number} delay — thời gian debounce (ms), mặc định 400
 * @returns {*} debounced value
 *
 * @example
 * const debouncedSearch = useDebouncedValue(searchTerm, 400);
 * useEffect(() => { fetchData(debouncedSearch); }, [debouncedSearch]);
 */
export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // Không debounce nếu value rỗng → fetch ngay lập tức
    if (!value) {
      setDebounced(value);
      return;
    }
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
