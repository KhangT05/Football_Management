import { create } from 'zustand';
import { seasonApi } from '../api/seasonApi';

/**
 * ============================================================
 * useSeasonStore — Zustand store cho Seasons
 * ============================================================
 * Shared state tránh duplicate fetching giữa:
 *   - Dashboard (widget mùa giải gần đây)
 *   - Settings  (CRUD mùa giải)
 *   - ManageMatches (dropdown chọn mùa)
 *   - ManageSeasonTeams (dropdown chọn mùa)
 *   - ScheduleResults (chọn mùa xem lịch)
 * ============================================================
 */

function parsePaginatedResponse(res) {
  if (!res) return { items: [], total: 0, meta: {} };
  const payload = typeof res.status === 'boolean' ? res.data : res;
  const items = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {};
  return { items, total: meta.total ?? items.length, meta };
}

const CACHE_TTL_MS = 60_000;

const useSeasonStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  seasons: [],
  meta: { total: 0, page: 1, per_page: 20, last_page: 1 },
  /** Season đang được chọn (cho ManageMatches, ScheduleResults) */
  selectedSeasonId: null,
  isLoading: false,
  error: null,
  fetchedAt: null,

  // ── Actions ───────────────────────────────────────────────

  /**
   * Lấy danh sách mùa giải
   * @param {{ page?, per_page?, q?, sort?, direction?, force? }} params
   */
  fetchAll: async (params = {}) => {
    const { force = false, ...queryParams } = params;
    const { fetchedAt, isLoading } = get();

    if (isLoading) return;
    if (!force && fetchedAt && Date.now() - fetchedAt < CACHE_TTL_MS && !queryParams.q) return;

    set({ isLoading: true, error: null });
    try {
      const res = await seasonApi.getAll({ per_page: 50, ...queryParams });
      const { items, meta } = parsePaginatedResponse(res);
      set({ seasons: items, meta, isLoading: false, fetchedAt: Date.now() });
    } catch (err) {
      set({
        error: err?.response?.data?.message || 'Không thể tải danh sách mùa giải.',
        isLoading: false,
      });
    }
  },

  /**
   * Lấy chi tiết 1 mùa giải
   * @param {number} id
   */
  fetchById: async (id) => {
    const res = await seasonApi.getById(id);
    const payload = typeof res?.status === 'boolean' ? res.data : res;
    return payload;
  },

  /**
   * Tạo mùa giải mới
   * @param {object} data — CreateSeasonDto
   */
  create: async (data) => {
    const res = await seasonApi.create(data);
    set({ fetchedAt: null });
    get().fetchAll({ force: true });
    return res;
  },

  /**
   * Cập nhật mùa giải
   * @param {number} id
   * @param {object} data
   */
  update: async (id, data) => {
    const res = await seasonApi.update(id, data);
    set(state => ({
      seasons: state.seasons.map(s => s.id === id ? { ...s, ...res } : s),
    }));
    return res;
  },

  /**
   * Cập nhật trạng thái mùa giải (admin)
   * @param {number} id
   * @param {{ status: string, cancel_reason?: string }} data
   */
  updateStatus: async (id, data) => {
    const res = await seasonApi.updateStatus(id, data);
    set(state => ({
      seasons: state.seasons.map(s => s.id === id ? { ...s, ...res } : s),
    }));
    return res;
  },

  /**
   * Xóa mềm mùa giải
   * @param {number} id
   */
  softDelete: async (id) => {
    await seasonApi.delete(id);
    set(state => ({
      seasons: state.seasons.filter(s => s.id !== id),
      meta: { ...state.meta, total: Math.max(0, state.meta.total - 1) },
      selectedSeasonId: state.selectedSeasonId === id ? null : state.selectedSeasonId,
    }));
  },

  /** Chọn mùa giải đang xem (dùng cho ManageMatches, ScheduleResults) */
  selectSeason: (id) => set({ selectedSeasonId: id }),

  clearError: () => set({ error: null }),
  invalidate: () => set({ fetchedAt: null }),
}));

export default useSeasonStore;
