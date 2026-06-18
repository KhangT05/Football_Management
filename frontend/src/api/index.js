/**
 * ============================================================
 * API Layer — Barrel Export
 * ============================================================
 * Import từ đây thay vì từng file riêng lẻ:
 *
 *   import { authApi, userApi, tournamentApi } from '@/api';
 *   import { seasonApi, venueApi } from '../api';
 *
 * Trạng thái implementation:
 *   ✅ authApi        — Login, Register, Refresh, Logout, /auth/me
 *   ✅ userApi        — CRUD /users
 *   ✅ tournamentApi  — CRUD /tournaments (có logo upload)
 *   ✅ seasonApi      — CRUD /seasons
 *   ✅ venueApi            — CRUD /venues
 *   ✅ tournamentRuleApi  — CRUD /tournamentrules
 *   ✅ teamApi            — CRUD /teams (có logo upload)
 *   ⚠️  matchApi          — Backend chưa có controller (stub, fallback mock)
 * ============================================================
 */

export { authApi } from './authApi';
export { userApi } from './userApi';
export { tournamentApi } from './tournamentApi';
export { seasonApi } from './seasonApi';
export { venueApi } from './venueApi';
export { teamApi } from './teamApi';
export { matchApi } from './matchApi';
export { tournamentRuleApi } from './tournamentRuleApi';

// Re-export token utilities để dùng ngoài axiosClient nếu cần
export { setAccessToken, getAccessToken, clearAccessToken } from './axiosClient';
