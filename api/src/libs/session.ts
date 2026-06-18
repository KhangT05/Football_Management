import prisma from "./prisma.js";
import redis from "./redis.js";

export const REFRESH_TTL_SEC = 30 * 24 * 60 * 60; // 30 days
const ROLES_TTL_SEC = 120; // ngắn vì cần phản ánh role mới gần real-time
export interface RefreshSession {
    user_id: number;
    csrfToken: string;
}

const key = (uuid: string) => `rt:${uuid}`;
const rolesKey = (user_id: number) => `roles:${user_id}`;

export const sessionStore = {
    async set(uuid: string, session: RefreshSession): Promise<void> {
        await redis.set(key(uuid), JSON.stringify(session), { EX: REFRESH_TTL_SEC });
    },

    async get(uuid: string): Promise<RefreshSession | null> {
        const raw = await redis.get(key(uuid));
        return raw ? (JSON.parse(raw) as RefreshSession) : null;
    },

    async del(uuid: string): Promise<void> {
        await redis.del(key(uuid));
    },
    /**
   * Atomic GET + DELETE cho refresh token rotation.
   * Dùng GETDEL (Redis >= 6.2) để tránh race window giữa GET và DEL.
   * Nếu hai request gửi cùng lúc với cùng token, chỉ một cái nhận được session.
   */
    async getAndDelete(uuid: string): Promise<RefreshSession | null> {
        const raw = await redis.getDel(key(uuid));
        return raw ? (JSON.parse(raw) as RefreshSession) : null;
    },
};

/**
 * Fallback về DB nếu Redis lỗi — tránh outage lan sang auth layer.
 * Thundering herd không handle ở đây vì TTL 120s + role change ít thường xuyên.
 * Nếu cần: dùng external lock (SET NX) hoặc single-flight pattern.
 */

export async function getUserRoles(user_id: number): Promise<string[]> {
    try {
        const cached = await redis.get(rolesKey(user_id));
        if (cached !== null) return JSON.parse(cached) as string[];
    } catch {
        // Redis down → fallback to DB, không block request
    }

    const rows = await prisma.user_Role.findMany({
        where: { user_id, role: { is_active: true } },
        select: { role: { select: { name: true } } },
    });
    const roles = rows.map((r) => r.role.name);

    try {
        await redis.set(rolesKey(user_id), JSON.stringify(roles), {
            EX: ROLES_TTL_SEC,
        });
    } catch {
        // Cache write fail không phải hard error
    }

    return roles;
}

export async function invalidateUserRoles(user_id: number): Promise<void> {
    await redis.del(rolesKey(user_id));
}