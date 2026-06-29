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

  /** Cache bảng xếp hạng theo seasonId: { [seasonId]: { data: any[], fetchedAt: number } } */
  standingsCache: {},
  standingsLoading: {},
  standingsError: {},

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
   * Lấy bảng xếp hạng
   */
  fetchStandings: async (seasonId, options = {}) => {
    if (!seasonId) return;

    const { force = false } = options;
    const cache = get().standingsCache[seasonId];
    const isLoading = get().standingsLoading[seasonId];

    if (isLoading) return;
    if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return;

    set(state => ({
      standingsLoading: { ...state.standingsLoading, [seasonId]: true },
      standingsError: { ...state.standingsError, [seasonId]: null },
    }));

    try {
      const res = await seasonApi.getStandings(seasonId);
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      const groups = Array.isArray(payload) ? payload : [];
      
      const formattedGroups = groups.map(group => ({
        ...group,
        standings: (group.standings || []).map(row => ({
          ...row,
          played: row.matches_played ?? row.played ?? 0,
          won: row.wins ?? row.won ?? 0,
          drawn: row.draws ?? row.drawn ?? 0,
          lost: row.losses ?? row.lost ?? 0,
          goal_difference: (row.goals_for ?? 0) - (row.goals_against ?? 0),
        })).sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference)
      }));

      set(state => ({
        standingsCache: {
          ...state.standingsCache,
          [seasonId]: { data: formattedGroups, fetchedAt: Date.now() }
        },
        standingsLoading: { ...state.standingsLoading, [seasonId]: false }
      }));
    } catch (err) {
      set(state => ({
        standingsError: {
          ...state.standingsError,
          [seasonId]: err?.response?.data?.message || 'Không thể tải bảng xếp hạng.'
        },
        standingsLoading: { ...state.standingsLoading, [seasonId]: false }
      }));
    }
  },

  getStandingsFromCache: (seasonId) => {
    return get().standingsCache[seasonId]?.data ?? [];
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
