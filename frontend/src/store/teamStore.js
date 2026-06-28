import { create } from 'zustand';
import { teamApi } from '../api/teamApi';
import { playerApi } from '../api/playerApi';

/**
 * ============================================================
 * useTeamStore — Zustand store cho Teams + Team Players
 * ============================================================
 * Shared state cho:
 *   - ManageTeams   (CRUD đội bóng + danh sách cầu thủ)
 *   - LeaderboardTeams (danh sách đội công khai)
 *   - ManageMatches (dropdown chọn đội)
 *   - MatchDetail   (hiển thị đội hình)
 *   - TeamDetail    (trang chi tiết đội)
 *
 * teamPlayersCache: { [teamId]: { players: TeamPlayer[], fetchedAt: number } }
 *   → Cache riêng cho từng đội để tránh refetch không cần thiết
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
const PLAYERS_CACHE_TTL_MS = 30_000; // Cache cầu thủ 30s (thay đổi thường xuyên hơn)

const useTeamStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  teams: [],
  meta: { total: 0, page: 1, per_page: 20, last_page: 1 },
  isLoading: false,
  error: null,
  fetchedAt: null,

  /** Cache cầu thủ theo teamId: { [id]: { players, fetchedAt } } */
  teamPlayersCache: {},
  /** Loading state cho players theo teamId: { [id]: boolean } */
  playersLoading: {},

  /** Cờ cho biết đã fetch fallback public teams cho season chưa */
  publicTeamsFetchedForSeason: null,

  // ── Team Actions ──────────────────────────────────────────

  /**
   * Lấy danh sách đội bóng
   * @param {{ page?, per_page?, q?, sort?, direction?, force? }} params
   */
  fetchAll: async (params = {}) => {
    const { force = false, ...queryParams } = params;
    const { fetchedAt, isLoading } = get();

    if (isLoading) return;
    if (!force && fetchedAt && Date.now() - fetchedAt < CACHE_TTL_MS && !queryParams.q) return;

    set({ isLoading: true, error: null });
    try {
      const res = await teamApi.getTeams({ per_page: 100, ...queryParams });
      const { items, meta } = parsePaginatedResponse(res);
      set({ teams: items, meta, isLoading: false, fetchedAt: Date.now() });
    } catch (err) {
      set({
        error: err?.response?.data?.message || 'Không thể tải danh sách đội bóng.',
        isLoading: false,
      });
    }
  },

  /**
   * Fallback cho Guest: Vì teamApi.getTeams yêu cầu JWT, Guest sẽ bị 401.
   * Để đồng bộ dữ liệu (hiển thị tên đội thay vì Đội 1), ta dùng các API public
   * của season/group để trích xuất danh sách team.
   */
  fetchPublicTeamsBySeason: async (seasonId) => {
    const { teams, publicTeamsFetchedForSeason } = get();
    if (teams.length > 0 || publicTeamsFetchedForSeason === seasonId) return;

    try {
      const { seasonApi } = await import('../api/seasonApi');
      const { groupApi } = await import('../api/groupApi');
      
      const stRes = await seasonApi.getStandings(seasonId);
      const payload = typeof stRes?.status === 'boolean' ? stRes.data : stRes;
      const groupsData = Array.isArray(payload) ? payload : [];

      const teamMap = {};
      const teamList = [];

      await Promise.all(groupsData.map(async (g) => {
        if (!g.groupId) return;
        const groupDetailRes = await groupApi.getByIdWithTeams(g.groupId).catch(() => null);
        const groupDetail = typeof groupDetailRes?.status === 'boolean' ? groupDetailRes.data : groupDetailRes;
        
        if (groupDetail?.seasonTeams) {
          groupDetail.seasonTeams.forEach(st => {
            if (st.team && !teamMap[st.team.id]) {
              teamMap[st.team.id] = true;
              teamList.push(st.team);
            }
          });
        }
      }));

      if (teamList.length > 0) {
        set({ teams: teamList, publicTeamsFetchedForSeason: seasonId });
      } else {
        set({ publicTeamsFetchedForSeason: seasonId });
      }
    } catch (err) {
      console.error('Lỗi khi fetch public teams fallback:', err);
    }
  },

  /**
   * Lấy chi tiết 1 đội
   * @param {number} id
   */
  fetchById: async (id) => {
    const res = await teamApi.getTeamById(id);
    const payload = typeof res?.status === 'boolean' ? res.data : res;
    return payload;
  },

  /**
   * Tạo đội bóng mới (multipart nếu có logo)
   * @param {{ name, coach_name?, description?, logo?: File }} data
   */
  create: async (data) => {
    const res = await teamApi.registerTeam(data);
    set({ fetchedAt: null });
    get().fetchAll({ force: true });
    return res;
  },

  /**
   * Cập nhật đội bóng
   * @param {number} id
   * @param {object} data
   */
  update: async (id, data) => {
    const res = await teamApi.update(id, data);
    const payload = typeof res?.status === 'boolean' ? res.data : res;
    set(state => ({
      teams: state.teams.map(t => t.id === id ? { ...t, ...payload } : t),
    }));
    return payload;
  },

  /**
   * Xóa mềm đội bóng
   * @param {number} id
   */
  softDelete: async (id) => {
    await teamApi.delete(id);
    set(state => {
      const newCache = { ...state.teamPlayersCache };
      delete newCache[id];
      return {
        teams: state.teams.filter(t => t.id !== id),
        meta: { ...state.meta, total: Math.max(0, state.meta.total - 1) },
        teamPlayersCache: newCache,
      };
    });
  },

  // ── Team Players Actions ───────────────────────────────────

  /**
   * Lấy danh sách cầu thủ của đội (có cache)
   * @param {number} teamId
   * @param {{ approval_status?, position?, per_page?, force? }} params
   */
  fetchPlayers: async (teamId, params = {}) => {
    const { force = false, ...queryParams } = params;
    const cache = get().teamPlayersCache[teamId];
    const isLoading = get().playersLoading[teamId];

    if (isLoading) return;
    if (!force && cache && Date.now() - cache.fetchedAt < PLAYERS_CACHE_TTL_MS) return;

    set(state => ({ playersLoading: { ...state.playersLoading, [teamId]: true } }));
    try {
      const res = await playerApi.listTeamPlayers(teamId, { per_page: 50, ...queryParams });
      const { items } = parsePaginatedResponse(res);
      set(state => ({
        teamPlayersCache: {
          ...state.teamPlayersCache,
          [teamId]: { players: items, fetchedAt: Date.now() },
        },
        playersLoading: { ...state.playersLoading, [teamId]: false },
      }));
    } catch (err) {
      set(state => ({
        playersLoading: { ...state.playersLoading, [teamId]: false },
      }));
      throw err;
    }
  },

  /**
   * Lấy players từ cache (không fetch)
   * @param {number} teamId
   * @returns {TeamPlayer[]}
   */
  getPlayersFromCache: (teamId) => {
    return get().teamPlayersCache[teamId]?.players ?? [];
  },

  /**
   * Thêm cầu thủ mới vào đội (2 bước: tạo Player + addToTeam)
   * @param {number} teamId
   * @param {{ name: string, jersey_number: number, position: string, role? }} data
   */
  addNewPlayerToTeam: async (teamId, data) => {
    // Bước 1: Tạo Player record
    const player = await playerApi.create({ name: data.name });
    const playerPayload = typeof player?.status === 'boolean' ? player.data : player;

    // Bước 2: Gắn vào đội
    await playerApi.addToTeam(teamId, {
      player_id: playerPayload.id,
      jersey_number: parseInt(data.jersey_number),
      position: data.position,
      role: data.role ?? 'player',
    });

    // Invalidate cache của team này
    get().invalidatePlayers(teamId);
    await get().fetchPlayers(teamId, { force: true });
  },

  /**
   * Duyệt cầu thủ
   * @param {number} teamId
   * @param {number} teamPlayerId
   */
  approvePlayer: async (teamId, teamPlayerId) => {
    const res = await playerApi.approve(teamId, teamPlayerId);
    get().invalidatePlayers(teamId);
    return res;
  },

  /**
   * Từ chối cầu thủ
   * @param {number} teamId
   * @param {number} teamPlayerId
   */
  rejectPlayer: async (teamId, teamPlayerId) => {
    const res = await playerApi.reject(teamId, teamPlayerId);
    get().invalidatePlayers(teamId);
    return res;
  },

  /**
   * Xóa cầu thủ khỏi đội (bulk)
   * @param {number} teamId
   * @param {number[]} ids — mảng teamPlayer IDs
   */
  removePlayers: async (teamId, ids) => {
    await playerApi.bulkRemoveFromTeam(teamId, { ids });
    get().invalidatePlayers(teamId);
    await get().fetchPlayers(teamId, { force: true });
  },

  /** Invalidate cache cầu thủ của 1 đội */
  invalidatePlayers: (teamId) => {
    set(state => {
      const newCache = { ...state.teamPlayersCache };
      delete newCache[teamId];
      return { teamPlayersCache: newCache };
    });
  },

  clearError: () => set({ error: null }),
  invalidate: () => set({ fetchedAt: null }),
}));

export default useTeamStore;
