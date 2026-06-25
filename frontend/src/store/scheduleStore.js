import { create } from 'zustand';
import { matchApi } from '../api/matchApi';

/**
 * ============================================================
 * useScheduleStore — Zustand store cho Schedule (Lịch thi đấu)
 * ============================================================
 * ⚠️  Backend dùng schedule.controller.ts — không có /matches endpoint
 *     Tất cả truy vấn lịch đấu phải có seasonId
 *
 * scheduleCache: { [seasonId]: { matches: Match[], fetchedAt: number } }
 *   → Cache riêng cho từng mùa giải
 *
 * Shared state cho:
 *   - ScheduleResults  (xem lịch/kết quả công khai, cần chọn season)
 *   - ManageMatches    (admin xem/đổi lịch trận)
 *   - MatchDetail      (chi tiết 1 trận)
 * ============================================================
 */

const CACHE_TTL_MS = 30_000; // 30 giây (lịch có thể thay đổi)

function parsePaginatedResponse(res) {
  if (!res) return { items: [], total: 0, meta: {} };
  const payload = typeof res.status === 'boolean' ? res.data : res;
  const items = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {};
  return { items, total: meta.total ?? items.length, meta };
}

const useScheduleStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  /** Cache lịch theo season: { [seasonId]: { matches: [], fetchedAt: number, meta: {} } } */
  scheduleCache: {},
  /** Loading state theo seasonId: { [seasonId]: boolean } */
  loadingSeasons: {},
  error: null,

  // ── Actions ───────────────────────────────────────────────

  /**
   * Lấy lịch thi đấu của 1 mùa giải
   * GET /schedules/seasons/{seasonId}/schedule
   *
   * @param {number} seasonId
   * @param {{ page?, per_page?, sort?, direction?, force? }} params
   * @returns {{ matches: Match[], meta: object }}
   */
  fetchBySeason: async (seasonId, params = {}) => {
    if (!seasonId) return { matches: [], meta: {} };

    const { force = false, ...queryParams } = params;
    const cache = get().scheduleCache[seasonId];
    const isLoading = get().loadingSeasons[seasonId];

    if (isLoading) return;
    if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
      return { matches: cache.matches, meta: cache.meta };
    }

    set(state => ({ loadingSeasons: { ...state.loadingSeasons, [seasonId]: true } }));
    try {
      const res = await matchApi.getScheduleBySeason(seasonId, { per_page: 100, ...queryParams });
      const { items, meta } = parsePaginatedResponse(res);

      set(state => ({
        scheduleCache: {
          ...state.scheduleCache,
          [seasonId]: { matches: items, fetchedAt: Date.now(), meta },
        },
        loadingSeasons: { ...state.loadingSeasons, [seasonId]: false },
        error: null,
      }));

      return { matches: items, meta };
    } catch (err) {
      set(state => ({
        loadingSeasons: { ...state.loadingSeasons, [seasonId]: false },
        error: err?.response?.data?.message || 'Không thể tải lịch thi đấu.',
      }));
      throw err;
    }
  },

  /**
   * Lấy lịch thi đấu của 1 đội trong mùa giải
   * GET /schedules/seasons/{seasonId}/teams/{teamId}/schedule
   *
   * @param {number} seasonId
   * @param {number} teamId
   * @param {object} params
   */
  fetchByTeam: async (seasonId, teamId, params = {}) => {
    if (!seasonId || !teamId) return { matches: [], meta: {} };

    try {
      const res = await matchApi.getTeamSchedule(seasonId, teamId, { per_page: 50, ...params });
      const { items, meta } = parsePaginatedResponse(res);
      return { matches: items, meta };
    } catch (err) {
      set({ error: err?.response?.data?.message || 'Không thể tải lịch của đội.' });
      throw err;
    }
  },

  /**
   * Đổi lịch 1 trận (admin)
   * PATCH /schedules/matches/{matchId}/reschedule
   *
   * @param {number} matchId
   * @param {{ scheduled_at: string, venue_id?: number }} data
   * @param {number} [seasonId] — nếu cung cấp sẽ invalidate cache của mùa đó
   */
  rescheduleMatch: async (matchId, data, seasonId = null) => {
    const res = await matchApi.rescheduleMatch(matchId, data);

    // Invalidate cache mùa liên quan
    if (seasonId) get().invalidateSeason(seasonId);

    return res;
  },

  /**
   * Tạo lịch thi đấu tự động (admin)
   * POST /schedules/seasons/{seasonId}/generate
   *
   * @param {number} seasonId
   * @param {object} body — GenerateScheduleDto
   */
  generateSchedule: async (seasonId, body) => {
    const res = await matchApi.generateSchedule(seasonId, body);
    get().invalidateSeason(seasonId);
    return res;
  },

  /**
   * Auto schedule (admin)
   * POST /schedules/seasons/{seasonId}/schedule
   *
   * @param {number} seasonId
   * @param {object} body — AutoScheduleDto
   */
  autoSchedule: async (seasonId, body) => {
    const res = await matchApi.autoSchedule(seasonId, body);
    get().invalidateSeason(seasonId);
    return res;
  },

  /**
   * Lấy matches từ cache (không fetch)
   * @param {number} seasonId
   * @returns {Match[]}
   */
  getMatchesFromCache: (seasonId) => {
    return get().scheduleCache[seasonId]?.matches ?? [];
  },

  /**
   * Kiểm tra loading state cho 1 season
   * @param {number} seasonId
   */
  isSeasonLoading: (seasonId) => get().loadingSeasons[seasonId] ?? false,

  /** Invalidate cache của 1 mùa giải */
  invalidateSeason: (seasonId) => {
    set(state => {
      const newCache = { ...state.scheduleCache };
      delete newCache[seasonId];
      return { scheduleCache: newCache };
    });
  },

  /** Invalidate tất cả cache */
  invalidateAll: () => set({ scheduleCache: {} }),

  clearError: () => set({ error: null }),
}));

export default useScheduleStore;
