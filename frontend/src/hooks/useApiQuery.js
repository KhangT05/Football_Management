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
 * - deps[] — re-fetch tự động khi dependencies thay đổi
 *
 * @param {Function} apiFn — hàm API (e.g. teamApi.getTeams). Nhận object params.
 * @param {Object} [options]
 * @param {number}   [options.perPage=20]       — số item mỗi trang
 * @param {boolean}  [options.autoFetch=true]   — tự fetch khi mount
 * @param {string}   [options.errorMsg]         — fallback error message
 * @param {Object}   [options.params={}]        — params tĩnh gắn vào mỗi request
 * @param {any[]}    [options.deps=[]]          — dependencies để trigger re-fetch tự động
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
 * // Re-fetch tự động khi selectedSeason thay đổi
 * const { data: seasonTeams, isLoading } = useApiQuery(
 *   (p) => seasonTeamApi.getAll(p),
 *   { autoFetch: true, params: { season_id: selectedSeason }, deps: [selectedSeason] }
 * );
 */
export function useApiQuery(apiFn, options = {}) {
  const {
    perPage = 20,
    autoFetch = true,
    errorMsg = 'Không thể tải dữ liệu.',
    params: staticParams = {},
    deps = [],
  } = options;

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ ...DEFAULT_META, per_page: perPage });
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Ref để tránh stale closure khi apiFn thay đổi
  const fnRef = useRef(apiFn);
  fnRef.current = apiFn;

  // Ref cho staticParams để tránh re-render loops
  const staticParamsRef = useRef(staticParams);
  staticParamsRef.current = staticParams;

  const fetchData = useCallback(async (extraParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fnRef.current({
        per_page: perPage,
        ...staticParamsRef.current,
        ...extraParams,
      });

      // ── Normalize response ─────────────────────────────────────────
      // axiosClient interceptor trả về response.data (HTTP body).
      // Chỉ auth.controller dùng makeResponse:
      //   body = { status: boolean, message, data: PaginatedResult, timestamp }
      // Tất cả controller khác trả PaginatedResult trực tiếp:
      //   body = { data: T[], meta: { total, page, per_page, ... } }
      const payload = (typeof res?.status === 'boolean') ? res.data : res;

      const items = Array.isArray(payload)
        ? payload
        : (Array.isArray(payload?.data) ? payload.data : []);

      const resultMeta = Array.isArray(payload) ? null : payload?.meta;

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

  // Auto-fetch on mount và khi deps thay đổi
  useEffect(() => {
    if (!autoFetch) return;
    // Không fetch nếu deps có giá trị null hoặc undefined
    const hasFalsyDep = deps.some(d => d === null || d === undefined);
    if (deps.length > 0 && hasFalsyDep) {
      setData([]);
      setIsLoading(false);
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, fetchData, ...deps]);

  return { data, meta, isLoading, error, fetch: fetchData, setData };
}
