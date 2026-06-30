/**
 * ============================================================
 * API Layer — Barrel Export
 * ============================================================
 * Import từ đây thay vì từng file riêng lẻ:
 *
 *   import { authApi, userApi, tournamentApi } from '@/api';
 *   import { seasonApi, venueApi, playerApi } from '../api';
 *
 * Trạng thái implementation:
 *   ✅ authApi          — Login, Register, Refresh, Logout, /auth/me
 *   ✅ userApi          — CRUD /users
 *   ✅ tournamentApi    — CRUD /tournaments (có logo upload)
 *   ✅ seasonApi        — CRUD /seasons + updateStatus
 *   ✅ venueApi         — CRUD /venues
 *   ✅ tournamentRuleApi — CRUD /tournamentrules
 *   ✅ teamApi          — CRUD /teams (có logo upload)
 *   ✅ playerApi        — CRUD /players + team-player management
 *   ✅ seasonTeamApi    — SeasonTeam registration + admin add
 *   ✅ groupApi         — Group draw/clear
 *   ✅ matchApi         — Schedule routes (/schedules/seasons/{id}/schedule...)
 *                        ⚠️ Legacy getMatches/create/update/delete đã deprecated
 *   🔧 paymentApi       — VNPay integration (chờ Backend endpoints sẵn sàng)
 * ============================================================
 */

export { authApi } from './authApi';
export { userApi } from './userApi';
export { tournamentApi } from './tournamentApi';
export { seasonApi } from './seasonApi';
export { venueApi } from './venueApi';
export { teamApi } from './teamApi';
export { playerApi } from './playerApi';
export { matchApi } from './matchApi';
export { tournamentRuleApi } from './tournamentRuleApi';
export { seasonTeamApi } from './seasonTeamApi';
export { groupApi } from './groupApi';
export { knockoutApi } from './knockoutApi';
export { jerseyApi } from './jerseyApi';
export { matchLineupApi } from './matchLineupApi';
export { paymentApi } from './paymentApi';
export { articleApi } from './articleApi';
export { uploadApi } from './uploadApi';
export { roleApi } from './roleApi';

// Re-export token utilities để dùng ngoài axiosClient nếu cần
export { setAccessToken, getAccessToken, clearAccessToken } from './axiosClient';
