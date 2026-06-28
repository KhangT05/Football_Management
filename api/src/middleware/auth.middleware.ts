/**
 * CSRF/cross-origin guard cho cookie-based request (vd /auth/refresh).
 * Chỉ áp dụng khi browser thực sự gửi Origin header (cross-site hoặc same-site
 * navigation đa số có). Server-to-server/mobile client không có Origin header
 * -> bỏ qua check này, vì chúng không bị CSRF risk qua cookie (không tự gửi cookie
 * theo browser same-origin policy).
 *
 * Nếu cần chặt hơn (zero-trust mobile), nên dùng custom header bắt buộc (vd X-Client-Type)
 * thay vì suy luận qua Origin.
 */

// Không có Origin header -> không phải browser cross-site request (curl, mobile, server-to-server).
// Để middleware auth khác (JWT/CSRF token) xử lý authorization, không block ở đây.


/**
 * Duy nhất 1 expressAuthentication cho toàn project (tsoa chỉ cho phép 1).
 * req.user phải được set trước bởi `authenticate` middleware chạy trong pipeline
 * (vd app.use(authenticate) trước khi routes tsoa-generated được mount).
 *
 * "admin" luôn bypass scope check, đồng bộ với requireRoles().
 */
import type { Request } from 'express';
import { verifyAccessToken } from '../libs/jwt.js';
import { createAppError } from '../common/app.error.js';
import prisma from '../libs/prisma.js';
import { getUserRoles } from '../libs/session.js';

export type AuthenticatedUser = {
    user_id: number;
    roles: string[];
};

function extractBearerToken(req: Request): string | null {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return null;
    return header.slice(7);
}

/**
 * expressAuthentication cho tsoa.
 *
 * is_active check vẫn hit DB vì không cache field này.
 * Trade-off: 1 DB query nhỏ (select 1 field) vs risk serve deactivated user
 * từ cache trong TTL window. Với graduation project, acceptable.
 *
 * Nếu cần optimize: thêm is_active vào Redis session hoặc encode vào JWT claim,
 * invalidate khi admin deactivate user.
 *
 * roles lấy từ Redis cache (TTL 120s) thay vì JOIN mỗi request.
 */
export async function expressAuthentication(
    req: Request,
    securityName: string,
    scopes: string[] = []
): Promise<AuthenticatedUser> {
    if (securityName !== 'jwt') {
        throw createAppError('FORBIDDEN', 'Unknown security scheme');
    }

    const token = extractBearerToken(req);
    if (!token) {
        throw createAppError('UNAUTHORIZED', 'Missing token');
    }

    const payload = verifyAccessToken(token);

    // DB hit chỉ để check is_active — không lấy roles ở đây
    const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { is_active: true },
    });

    if (!user?.is_active) {
        throw createAppError('UNAUTHORIZED', 'Not authenticated');
    }

    // Roles từ Redis cache → DB fallback (TTL 120s, xem session.ts)
    const roles = await getUserRoles(payload.sub);

    if (scopes.length > 0) {
        const isAdmin = roles.includes('admin');
        const hasScope = scopes.some((s) => roles.includes(s));
        if (!isAdmin && !hasScope) {
            throw createAppError('FORBIDDEN', 'Insufficient permissions');
        }
    }

    (req as any).user = { user_id: payload.sub, roles };
    return { user_id: payload.sub, roles };
}