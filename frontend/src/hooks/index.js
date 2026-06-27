/**
 * ============================================================
 * Custom Hooks — Barrel Export
 * ============================================================
 * Tập trung export tất cả custom hooks cho frontend.
 *
 * Hooks:
 *   ✅ useApiQuery       — Paginated list fetching (loading/error/meta/deps)
 *   ✅ useCrudModal      — CRUD modal state (add/edit/delete + form)
 *   ✅ useApiMutation    — One-shot async operations
 *   ✅ useDebouncedValue — Debounce search input
 *   ✅ useSocket         — Socket.IO realtime với graceful polling fallback
 * ============================================================
 */

export { useApiQuery } from './useApiQuery';
export { useCrudModal } from './useCrudModal';
export { useApiMutation } from './useApiMutation';
export { useDebouncedValue } from './useDebouncedValue';
export { useSocket } from './useSocket';
