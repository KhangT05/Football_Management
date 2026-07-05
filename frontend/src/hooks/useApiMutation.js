import { useState, useCallback } from 'react';
import { parseApiError } from '../utils/errorHelper';

/**
 * useApiMutation
 * ─────────────────────────────────────────────────────
 * Lightweight hook cho one-shot async operations (save, delete, approve, v.v.)
 * Quản lý loading + error state.
 *
 * Khác với useCrudModal:
 * - Không có modal/form state
 * - Dùng cho standalone mutations ngoài modal flow
 *
 * @returns {{
 *   mutate: (asyncFn: Function) => Promise<any>,
 *   isLoading: boolean,
 *   error: string|null,
 *   reset: () => void,
 * }}
 *
 * @example
 * const { mutate, isLoading } = useApiMutation();
 *
 * const handleApprove = (id) => mutate(async () => {
 *   await teamApi.approvePlayer(teamId, id, 'approved');
 *   toast.success('Đã duyệt!');
 *   refetch();
 * });
 */
export function useApiMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (asyncFn) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      const msg = parseApiError(err, 'Có lỗi xảy ra.');
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { mutate, isLoading, error, reset };
}
