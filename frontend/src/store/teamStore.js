import { create } from 'zustand';
import { teamApi } from '../api/teamApi';
import { playerApi } from '../api/playerApi';
import { matchApi } from '../api/matchApi';
import { userApi } from '../api/userApi';

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
  const items = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
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

  /** Cache chi tiết đội: { [teamId]: { data: any, fetchedAt: number } } */
  teamDetailCache: {},
  teamDetailLoading: {},
  teamDetailError: {},

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
   * Lấy chi tiết đầy đủ 1 đội (TeamDetail)
   */
  fetchTeamDetail: async (teamId, options = {}) => {
    if (!teamId) return;

    const { force = false } = options;
    const cache = get().teamDetailCache[teamId];
    const isLoading = get().teamDetailLoading[teamId];

    if (isLoading) return;
    if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return;

    set(state => ({
      teamDetailLoading: { ...state.teamDetailLoading, [teamId]: true },
      teamDetailError: { ...state.teamDetailError, [teamId]: null },
    }));

    try {
      const [teamRes, playersRes, matchesRes] = await Promise.all([
        teamApi.getTeamById(teamId),
        teamApi.getPlayers(teamId, { approval_status: 'approved', per_page: 50 }).catch(() => null),
        matchApi.getTeamSchedule(null, teamId, { per_page: 20 }).catch(() => null)
      ]);

      const teamPayload = typeof teamRes?.status === 'boolean' ? teamRes.data : teamRes;
      
      const parsePage = (res) => {
        const payload = typeof res?.status === 'boolean' ? res.data : res;
        return Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      };

      const players = playersRes ? parsePage(playersRes) : [];
      const matches = matchesRes ? parsePage(matchesRes) : [];

      set(state => ({
        teamDetailCache: {
          ...state.teamDetailCache,
          [teamId]: { 
            data: { team: teamPayload, players, matches }, 
            fetchedAt: Date.now() 
          }
        },
        teamDetailLoading: { ...state.teamDetailLoading, [teamId]: false }
      }));
    } catch (err) {
      set(state => ({
        teamDetailError: {
          ...state.teamDetailError,
          [teamId]: err?.response?.data?.message || 'Không thể tải thông tin đội bóng.'
        },
        teamDetailLoading: { ...state.teamDetailLoading, [teamId]: false }
      }));
    }
  },

  getTeamDetailFromCache: (teamId) => {
    return get().teamDetailCache[teamId]?.data ?? null;
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
   * Thêm cầu thủ mới vào đội (tạo User nếu cần + tạo Player + addToTeam)
   * @param {number} teamId
   * @param {object} data
   */
  addNewPlayerToTeam: async (teamId, data) => {
    let userId = null;

    if (data.email) {
      // Tìm user theo email
      try {
        const searchRes = await userApi.getAll({ q: data.email });
        const payload = typeof searchRes?.status === 'boolean' ? searchRes.data : searchRes;
        const users = Array.isArray(payload?.data) ? payload.data : [];
        const exactUser = users.find(u => u.email === data.email);
        if (exactUser) {
          userId = exactUser.id;
        }
      } catch (e) {
        console.error('Error finding user by email', e);
      }
    }

    if (!userId) {
      // Tạo user mới
      const dummyEmail = data.email || `player_${Date.now()}@temp.local`;
      const createRes = await userApi.create({
        name: data.name,
        email: dummyEmail,
        password: 'Password123!',
        phone: '0000000000'
      });
      const userPayload = typeof createRes?.status === 'boolean' ? createRes.data : createRes;
      userId = userPayload.id;
    }

    // Bước 2: Tạo Player record
    let playerId = null;
    try {
      // Cố gắng tạo Player
      const playerPayloadData = {
        user_id: userId,
        date_of_birth: data.date_of_birth || "2000-01-01",
        position: data.position || 'FW',
        ...(data.height && { height: parseFloat(data.height) }),
        ...(data.weight && { weight: parseFloat(data.weight) }),
        ...(data.nationality && { nationality: data.nationality })
      };
      const playerRes = await playerApi.create(playerPayloadData);
      const playerPayload = typeof playerRes?.status === 'boolean' ? playerRes.data : playerRes;
      playerId = playerPayload.id;
    } catch (e) {
      // Nếu đã có Player (do User_id bị trùng), cần lấy thông tin player ra
      // Thực tế thì playerApi không có endpoint lấy Player by userId, nhưng backend có thể báo lỗi
      // Tạm thời nếu lỗi, ta không thể lấy được playerId từ user_id bằng API hiện tại trừ khi có route.
      // Giải pháp: API importTeamPlayers từ excel đã tạo sẵn, API này hiện tại throw nếu trùng.
      // Việc này xử lý rất phức tạp nếu không có endpoint getPlayerByUserId, ta log lỗi.
      console.error('Lỗi khi tạo Player (có thể đã tồn tại):', e);
      throw e;
    }

    if (!playerId) throw new Error('Không thể tạo Player');

    // Bước 3: Gắn vào đội
    await playerApi.addToTeam(teamId, {
      player_id: playerId,
      jersey_number: parseInt(data.jersey_number),
      position: data.position,
      role: data.role ?? 'player',
    });

    // Invalidate cache của team này
    get().invalidatePlayers(teamId);
    await get().fetchPlayers(teamId, { force: true });
  },

  /**
   * Cập nhật thông tin cầu thủ
   * @param {number} teamId
   * @param {number} teamPlayerId
   * @param {number} playerId
   * @param {number} userId
   * @param {object} data
   */
  updatePlayerInTeam: async (teamId, teamPlayerId, playerId, userId, data) => {
    // 0. Cập nhật User profile (name)
    if (userId && data.name !== undefined) {
      try {
        await userApi.update(userId, { name: data.name });
      } catch (e) {
        console.error('Failed to update User name', e);
      }
    }

    // 1. Cập nhật Player profile (dob, height, weight, nationality)
    const playerPatch = {};
    if (data.date_of_birth !== undefined) playerPatch.date_of_birth = data.date_of_birth;
    if (data.height !== undefined) playerPatch.height = parseFloat(data.height) || null;
    if (data.weight !== undefined) playerPatch.weight = parseFloat(data.weight) || null;
    if (data.nationality !== undefined) playerPatch.nationality = data.nationality;

    if (Object.keys(playerPatch).length > 0) {
      await playerApi.update(playerId, playerPatch);
    }

    // 2. Cập nhật TeamPlayer (jersey_number, position, role)
    const tpPatch = {};
    if (data.jersey_number !== undefined) tpPatch.jersey_number = parseInt(data.jersey_number);
    if (data.position !== undefined) tpPatch.position = data.position;
    if (data.role !== undefined) tpPatch.role = data.role;

    if (Object.keys(tpPatch).length > 0) {
      await playerApi.updateTeamPlayer(teamId, teamPlayerId, tpPatch);
    }

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
