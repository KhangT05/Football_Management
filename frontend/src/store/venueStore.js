import { create } from 'zustand';
import { venueApi } from '../api/venueApi';

/**
 * ============================================================
 * useVenueStore — Zustand store cho Venues (Sân thi đấu)
 * ============================================================
 * Shared state cho:
 *   - Settings (CRUD sân)
 *   - ManageMatches (dropdown chọn sân)
 *   - ManageSeasonTeams (hiển thị sân)
 *
 * Không cần selectedVenueId vì sân không phải navigation state
 * ============================================================
 */

function parsePaginatedResponse(res) {
  if (!res) return { items: [], total: 0 };
  const payload = typeof res.status === 'boolean' ? res.data : res;
  const items = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {};
  return { items, total: meta.total ?? items.length };
}

const CACHE_TTL_MS = 120_000; // 2 phút (sân ít thay đổi)

const useVenueStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  venues: [],
  isLoading: false,
  error: null,
  fetchedAt: null,

  // ── Actions ───────────────────────────────────────────────

  /**
   * Lấy danh sách sân thi đấu
   * @param {{ force? }} params
   */
  fetchAll: async (params = {}) => {
    const { force = false } = params;
    const { fetchedAt, isLoading } = get();

    if (isLoading) return;
    if (!force && fetchedAt && Date.now() - fetchedAt < CACHE_TTL_MS) return;

    set({ isLoading: true, error: null });
    try {
      const res = await venueApi.getAll({ per_page: 200 }); // Sân ít → load hết 1 lần
      const { items } = parsePaginatedResponse(res);
      set({ venues: items, isLoading: false, fetchedAt: Date.now() });
    } catch (err) {
      set({
        error: err?.response?.data?.message || 'Không thể tải danh sách sân thi đấu.',
        isLoading: false,
      });
    }
  },

  /**
   * Tạo sân thi đấu mới
   * @param {{ name: string, address?: string, capacity?: number }} data
   */
  create: async (data) => {
    const res = await venueApi.create(data);
    set({ fetchedAt: null });
    get().fetchAll({ force: true });
    return res;
  },

  /**
   * Cập nhật sân
   * @param {number} id
   * @param {object} data
   */
  update: async (id, data) => {
    const res = await venueApi.update(id, data);
    const payload = typeof res?.status === 'boolean' ? res.data : res;
    set(state => ({
      venues: state.venues.map(v => v.id === id ? { ...v, ...payload } : v),
    }));
    return payload;
  },

  /**
   * Xóa mềm sân
   * @param {number} id
   */
  softDelete: async (id) => {
    await venueApi.delete(id);
    set(state => ({
      venues: state.venues.filter(v => v.id !== id),
    }));
  },

  /** Tìm sân theo ID */
  getById: (id) => get().venues.find(v => v.id === Number(id)),

  clearError: () => set({ error: null }),
  invalidate: () => set({ fetchedAt: null }),
}));

export default useVenueStore;
