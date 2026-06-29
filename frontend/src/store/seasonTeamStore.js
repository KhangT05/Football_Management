import { create } from 'zustand';
import { seasonTeamApi } from '../api';

/**
 * ============================================================
 * useSeasonTeamStore — Zustand store cho Season Teams
 * ============================================================
 * Quản lý danh sách đội bóng tham gia vào các mùa giải.
 * ============================================================
 */

const CACHE_TTL_MS = 60_000;

const useSeasonTeamStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  /** Cache seasonTeams theo seasonId: { [seasonId]: { data: SeasonTeam[], fetchedAt: number } } */
  seasonTeamsCache: {},
  /** Loading state theo seasonId: { [seasonId]: boolean } */
  loadingSeasons: {},
  /** Error state theo seasonId: { [seasonId]: string | null } */
  errors: {},

  // ── Actions ───────────────────────────────────────────────

  /**
   * Lấy danh sách đội bóng tham gia 1 mùa giải
   * @param {number} seasonId
   * @param {{ force?: boolean }} options
   */
  fetchSeasonTeams: async (seasonId, options = {}) => {
    if (!seasonId) return;

    const { force = false } = options;
    const cache = get().seasonTeamsCache[seasonId];
    const isLoading = get().loadingSeasons[seasonId];

    if (isLoading) return;
    if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return;

    set(state => ({
      loadingSeasons: { ...state.loadingSeasons, [seasonId]: true },
      errors: { ...state.errors, [seasonId]: null },
    }));

    try {
      const res = await seasonTeamApi.getAll({ season_id: seasonId, per_page: 200 });
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

      set(state => ({
        seasonTeamsCache: {
          ...state.seasonTeamsCache,
          [seasonId]: { data, fetchedAt: Date.now() }
        },
        loadingSeasons: { ...state.loadingSeasons, [seasonId]: false }
      }));
    } catch (err) {
      if (err?.response?.status !== 401 && err?.response?.status !== 403) {
        console.error('Không thể tải danh sách đội theo mùa giải.', err);
      }
      set(state => ({
        errors: {
          ...state.errors,
          [seasonId]: err?.response?.data?.message || 'Không thể tải danh sách đội theo mùa giải.'
        },
        loadingSeasons: { ...state.loadingSeasons, [seasonId]: false }
      }));
    }
  },

  /**
   * Lấy season teams từ cache (không fetch)
   * @param {number} seasonId
   */
  getSeasonTeamsFromCache: (seasonId) => {
    return get().seasonTeamsCache[seasonId]?.data ?? [];
  },

  /** Invalidate cache của 1 mùa giải */
  invalidateSeason: (seasonId) => {
    set(state => {
      const newCache = { ...state.seasonTeamsCache };
      delete newCache[seasonId];
      return { seasonTeamsCache: newCache };
    });
  },
}));

export default useSeasonTeamStore;
