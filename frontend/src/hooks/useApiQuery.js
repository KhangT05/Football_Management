import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * DEFAULT_META
 * Giá trị mặc định cho pagination metadata.
 */
const DEFAULT_META = Object.freeze({
  total: 0,
  page: 1,
  per_page: 20,
  last_page: 1,
});

/**
 * useApiQuery
 * ─────────────────────────────────────────────────────
 * Hook quản lý fetch list data từ API với:
 * - Loading / error state
 * - Pagination metadata
 * - Response normalization (xử lý cả ApiResponseShape lẫn PaginatedResult trực tiếp)
 *
 * Thay thế pattern lặp lại ở mọi admin page:
 *   const [items, setItems] = useState([]);
 *   const [meta, setMeta] = useState(DEFAULT);
 *   const [isLoading, setIsLoading] = useState(true);
 *   const [fetchError, setFetchError] = useState(null);
 *   const fetch = useCallback(async () => { ... try/catch/finally }, []);
 *
 * @param {Function} apiFn — hàm API (e.g. teamApi.getTeams). Nhận object params.
 * @param {Object} [options]
 * @param {number} [options.perPage=20]       — số item mỗi trang
 * @param {boolean} [options.autoFetch=true]  — tự fetch khi mount
 * @param {string} [options.errorMsg]         — fallback error message
 *
 * @returns {{
 *   data: any[],
 *   meta: { total, page, per_page, last_page },
 *   isLoading: boolean,
 *   error: string|null,
 *   fetch: (params?: object) => Promise<void>,
 *   setData: Function,
 * }}
 *
 * @example
 * const { data: teams, meta, isLoading, error, fetch } = useApiQuery(
 *   teamApi.getTeams,
 *   { perPage: 20, autoFetch: false }
 * );
 * // Gọi fetch với query params tùy ý:
 * fetch({ q: 'keyword', sort: 'name', page: 2 });
 */
export function useApiQuery(apiFn, options = {}) {
  const {
    perPage = 20,
    autoFetch = true,
    errorMsg = 'Không thể tải dữ liệu.',
  } = options;

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ ...DEFAULT_META, per_page: perPage });
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Ref để tránh stale closure khi apiFn thay đổi
  const fnRef = useRef(apiFn);
  fnRef.current = apiFn;

  const fetchData = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fnRef.current({ per_page: perPage, ...params });

      // ── Normalize response ────────────────────────
      // axiosClient interceptor trả về response.data = { status, message, data, timestamp }
      //   → res.data = PaginatedResult { data: T[], meta: {...} }
      // Một số endpoint trả trực tiếp PaginatedResult hoặc array.
      // Pattern `res.data ?? res` xử lý cả hai case.
      const result = res?.data ?? res;
      const items = Array.isArray(result)
        ? result
        : (result?.data ?? []);
      const resultMeta = Array.isArray(result) ? null : result?.meta;

      setData(items);
      if (resultMeta) setMeta(resultMeta);
    } catch (err) {
      const msg = err?.response?.data?.message || errorMsg;
      setError(msg);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [perPage, errorMsg]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, meta, isLoading, error, fetch: fetchData, setData };
}
