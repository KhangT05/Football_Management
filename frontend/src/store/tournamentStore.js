import { create } from 'zustand';
import { tournamentApi } from '../api/tournamentApi';

/**
 * ============================================================
 * useTournamentStore — Zustand store cho Tournaments
 * ============================================================
 * Shared state tránh duplicate fetching giữa:
 *   - Dashboard (hiển thị danh sách ngắn)
 *   - Settings  (CRUD đầy đủ)
 *   - ManageMatches (dropdown chọn giải)
 *   - ManageSeasonTeams (dropdown chọn giải)
 *
 * Cache: fetchedAt — bỏ qua fetch nếu dữ liệu < 60 giây tuổi
 * ============================================================
 */

/** Parse response từ cả 2 dạng backend trả về */
function parsePaginatedResponse(res) {
  if (!res) return { items: [], total: 0, meta: {} };
  // Auth controller dùng makeResponse → { status: bool, message, data: PaginatedResult }
  const payload = typeof res.status === 'boolean' ? res.data : res;
  const items = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {};
  return { items, total: meta.total ?? items.length, meta };
}

const CACHE_TTL_MS = 60_000; // 60 giây

const useTournamentStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  tournaments: [],
  meta: { total: 0, page: 1, per_page: 20, last_page: 1 },
  isLoading: false,
  error: null,
  fetchedAt: null, // timestamp lần fetch cuối

  // ── Actions ───────────────────────────────────────────────

  /**
   * Lấy danh sách giải đấu
   * @param {{ page?, per_page?, q?, sort?, direction?, force? }} params
   *   force=true: bỏ qua cache, fetch lại ngay
   */
  fetchAll: async (params = {}) => {
    const { force = false, ...queryParams } = params;
    const { fetchedAt, isLoading } = get();

    // Skip nếu đang load hoặc cache còn hợp lệ và không force
    if (isLoading) return;
    if (!force && fetchedAt && Date.now() - fetchedAt < CACHE_TTL_MS && !queryParams.q) return;

    set({ isLoading: true, error: null });
    try {
      const res = await tournamentApi.getAll({ per_page: 100, ...queryParams });
      const { items, meta } = parsePaginatedResponse(res);
      set({ tournaments: items, meta, isLoading: false, fetchedAt: Date.now() });
    } catch (err) {
      set({
        error: err?.response?.data?.message || 'Không thể tải danh sách giải đấu.',
        isLoading: false,
      });
    }
  },

  /**
   * Tạo giải đấu mới
   * @param {{ name: string, description?: string, logo?: File }} data
   * @returns {Promise<Tournament>}
   */
  create: async (data) => {
    const res = await tournamentApi.create(data);
    // Invalidate cache và refetch
    set({ fetchedAt: null });
    get().fetchAll({ force: true });
    return res;
  },

  /**
   * Cập nhật giải đấu
   * @param {number} id
   * @param {object} data
   * @returns {Promise<Tournament>}
   */
  update: async (id, data) => {
    const res = await tournamentApi.update(id, data);
    // Cập nhật optimistic trong store
    set(state => ({
      tournaments: state.tournaments.map(t =>
        t.id === id ? { ...t, ...res } : t
      ),
    }));
    return res;
  },

  /**
   * Xóa mềm giải đấu
   * @param {number} id
   */
  softDelete: async (id) => {
    await tournamentApi.delete(id);
    set(state => ({
      tournaments: state.tournaments.filter(t => t.id !== id),
      meta: { ...state.meta, total: Math.max(0, state.meta.total - 1) },
    }));
  },

  /** Xóa error message */
  clearError: () => set({ error: null }),

  /** Invalidate cache, buộc fetch lại lần sau */
  invalidate: () => set({ fetchedAt: null }),
}));

export default useTournamentStore;
