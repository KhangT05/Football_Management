import { create } from 'zustand';
import { matchApi } from '../api/matchApi';
import { teamApi } from '../api/teamApi';
import useSeasonStore from './seasonStore';

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

// FIX (bug nghiêm trọng hơn bản trước): matchApi.getMatchById() gọi
// GET /matches/{id}/result → MatchResultService.getMatchResult() trả THẲNG
// row bảng `match_results` (matchresult.service.ts), KHÔNG phải bảng
// `matches`. 2 bảng này CÙNG có field tên `id`, `status`, `created_at`,
// `updated_at` nhưng Ý NGHĨA HOÀN TOÀN KHÁC NHAU:
//   - MatchResult.id     = PK riêng của bảng match_results (KHÁC match.id)
//   - MatchResult.status = MatchResultStatus ('official'/'under_review'/
//                          'protested') — enum hoàn toàn khác
//   - Match.id           = PK thật của trận đấu (dùng cho route /tran-dau/:id)
//   - Match.status       = MatchStatus ('scheduled'/'finished'/
//                          'pending_official'/...) — cái RESULT_AVAILABLE_STATUSES
//                          ở FE đang so sánh
//
// Spread ngây thơ `{ ...scheduleMatch, ...matchResultPayload }` sẽ để
// matchResultPayload.status / .id ĐÈ LÊN status/id thật của Match — sau đó
// `RESULT_AVAILABLE_STATUSES.has(match.status)` luôn false (vì so sánh với
// "official" chứ không phải "finished") → hasScore luôn false ở FE dù
// home_final_score/away_final_score đã đúng. Đây là nguyên nhân điểm số
// "biến mất" dù data BE hoàn toàn đúng.
//
// Fix: merge có kiểm soát — matchResultPayload CHỈ được đóng góp field nó
// sở hữu riêng (không có trên Match: home_final_score, away_final_score,
// winner_team_id, winner_team, result_type, home_extra_time_score,
// away_extra_time_score, home_penalty_score, away_penalty_score, notes,
// appeal_reason, appeal_note). Field sở hữu bởi Match (id, status,
// created_at, updated_at, home_team_id, away_team_id, scheduled_at, venue,
// home_score, away_score...) LUÔN lấy từ scheduleMatch, không bao giờ bị đè.
const MATCH_RESULT_OWNED_FIELDS = new Set([
  'match_id', 'winner_team_id', 'winner_team',
  'home_final_score', 'away_final_score',
  'home_extra_time_score', 'away_extra_time_score',
  'home_penalty_score', 'away_penalty_score',
  'result_type', 'notes', 'appeal_reason', 'appeal_note',
  'is_active', 'deleted_at',
]);

function mergeResultIntoMatch(matchResultPayload, scheduleMatch) {
  const resultOnly = {};
  for (const key of MATCH_RESULT_OWNED_FIELDS) {
    if (matchResultPayload?.[key] !== undefined) resultOnly[key] = matchResultPayload[key];
  }
  // Giữ nguyên toàn bộ matchResultPayload dưới key `matchResult` (namespace
  // riêng) để chỗ nào cần status thật của MatchResult (vd hiện "Đang khiếu
  // nại") vẫn truy cập được qua match.matchResult.status, KHÔNG lẫn với
  // match.status.
  return {
    ...scheduleMatch,
    ...resultOnly,
    matchResult: matchResultPayload,
  };
}

const useScheduleStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  /** Cache lịch theo season: { [seasonId]: { matches: [], fetchedAt: number, meta: {} } } */
  scheduleCache: {},
  /** Loading state theo seasonId: { [seasonId]: boolean } */
  loadingSeasons: {},
  error: null,

  /** Cache chi tiết trận đấu: { [matchId]: { data: any, fetchedAt: number } } */
  matchDetailCache: {},
  matchDetailLoading: {},
  matchDetailError: {},

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
   * Lấy chi tiết trận đấu
   */
  fetchMatchDetail: async (matchId, options = {}) => {
    if (!matchId) return;

    const { force = false } = options;
    const cache = get().matchDetailCache[matchId];
    const isLoading = get().matchDetailLoading[matchId];

    if (isLoading) return;
    if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return;

    set(state => ({
      matchDetailLoading: { ...state.matchDetailLoading, [matchId]: true },
      matchDetailError: { ...state.matchDetailError, [matchId]: null },
    }));

    try {
      const [res, eventsRes] = await Promise.all([
        matchApi.getMatchById(matchId),
        matchApi.getMatchEvents(matchId, { per_page: 100, sort: 'minute', direction: 'asc' }).catch(() => null)
      ]);

      const payload = typeof res?.status === 'boolean' ? res.data : res;
      let match = payload?.data || payload;
      if (Array.isArray(match)) match = match[0];

      // FIX (cold-cache / hard refresh): matchApi.getMatchById() CHỈ trả về
      // MatchResult (id, match_id, winner_team_id, home_final_score,...) —
      // KHÔNG có home_team_id/away_team_id/scheduled_at/venue. BE không có
      // endpoint lấy 1 match kèm team info mà không cần seasonId (xem
      // comment đầu file), nên nguồn team info DUY NHẤT là scheduleCache
      // (populate qua fetchBySeason).
      //
      // Bản cũ chỉ merge từ scheduleCache SẴN CÓ trong bộ nhớ — hoạt động
      // khi user vào từ trang Lịch thi đấu (cache còn ấm), nhưng THẤT BẠI
      // khi:
      //   - Hard refresh / mở thẳng URL /tran-dau/{id} (Zustand reset về rỗng)
      //   - Deep link chia sẻ từ nơi khác
      // → home_team_id undefined → hiện "Đội #?" như ảnh chụp.
      //
      // Patch: nếu merge từ cache sẵn có vẫn thiếu team info, brute-force
      // tìm match trong TẤT CẢ season (song song, không tuần tự để giảm
      // latency). Đây là workaround, KHÔNG phải fix triệt để — cost là
      // O(số season) request mỗi lần cache-miss. Fix đúng là BE thêm
      // GET /schedules/matches/:matchId trả thẳng match kèm team refs.
      //
      // QUAN TRỌNG: dùng mergeResultIntoMatch() (không spread tay) — xem
      // giải thích ở khai báo hàm phía trên file. Spread ngây thơ từng làm
      // status/id của MatchResult đè lên status/id thật của Match, khiến
      // hasScore ở FE luôn false dù data BE đúng.
      if (match && (!match.home_team_id || !match.home_team)) {
        // Bước 1: quét scheduleCache hiện có trong bộ nhớ (rẻ nhất, không gọi API)
        for (const seasonId in get().scheduleCache) {
          const scheduleMatch = get().scheduleCache[seasonId]?.matches?.find(m => String(m.id) === String(matchId));
          if (scheduleMatch) {
            match = mergeResultIntoMatch(match, scheduleMatch);
            break;
          }
        }

        // Bước 2: cache-miss hoàn toàn (cold start) → cần biết match thuộc
        // season nào. Không có field season_id trên MatchResult payload để
        // tra thẳng, nên phải load danh sách season rồi fetch schedule của
        // TỪNG season song song, sau đó quét lại cache vừa được populate.
        if (!match.home_team_id) {
          let seasons = useSeasonStore.getState().seasons;
          if (!seasons || seasons.length === 0) {
            try {
              await useSeasonStore.getState().fetchAll();
              seasons = useSeasonStore.getState().seasons;
            } catch {
              seasons = [];
            }
          }

          if (seasons?.length > 0) {
            await Promise.allSettled(seasons.map(s => get().fetchBySeason(s.id)));

            for (const seasonId in get().scheduleCache) {
              const scheduleMatch = get().scheduleCache[seasonId]?.matches?.find(m => String(m.id) === String(matchId));
              if (scheduleMatch) {
                match = mergeResultIntoMatch(match, scheduleMatch);
                break;
              }
            }
          }
        }
      }

      let events = [];
      if (eventsRes) {
        const evtPayload = typeof eventsRes?.status === 'boolean' ? eventsRes.data : eventsRes;
        events = Array.isArray(evtPayload?.data) ? evtPayload.data : (Array.isArray(evtPayload) ? evtPayload : []);
      }

      let homePlayers = [];
      let awayPlayers = [];

      if (match?.home_team_id && match?.away_team_id) {
        const parsePage = (response) => {
          const pl = typeof response?.status === 'boolean' ? response.data : response;
          return Array.isArray(pl?.data) ? pl.data : Array.isArray(pl) ? pl : [];
        };

        const [homeRes, awayRes] = await Promise.allSettled([
          teamApi.getPlayers(match.home_team_id, { approval_status: 'approved', per_page: 30 }),
          teamApi.getPlayers(match.away_team_id, { approval_status: 'approved', per_page: 30 }),
        ]);

        if (homeRes.status === 'fulfilled') homePlayers = parsePage(homeRes.value);
        if (awayRes.status === 'fulfilled') awayPlayers = parsePage(awayRes.value);
      }

      set(state => ({
        matchDetailCache: {
          ...state.matchDetailCache,
          [matchId]: {
            data: { match, events, homePlayers, awayPlayers },
            fetchedAt: Date.now()
          }
        },
        matchDetailLoading: { ...state.matchDetailLoading, [matchId]: false }
      }));
    } catch (err) {
      set(state => ({
        matchDetailError: {
          ...state.matchDetailError,
          [matchId]: err?.response?.status === 404 || err?.code === 'ERR_NETWORK'
            ? 'Match API chưa được triển khai hoặc không tìm thấy trận đấu.'
            : 'Đã có lỗi xảy ra.'
        },
        matchDetailLoading: { ...state.matchDetailLoading, [matchId]: false }
      }));
    }
  },

  getMatchDetailFromCache: (matchId) => {
    return get().matchDetailCache[matchId]?.data ?? null;
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
   * Tạo lịch thi đấu từ các bảng/nhóm đã chia (admin)
   * POST /schedules/seasons/{seasonId}/generate-from-groups
   *
   * @param {number} seasonId
   * @param {object} body — GenerateFromGroupsDto
   */
  generateFromGroups: async (seasonId, body) => {
    const res = await matchApi.generateFromGroups(seasonId, body);
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