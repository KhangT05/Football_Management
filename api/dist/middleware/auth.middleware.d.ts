import type { Request } from 'express';
export type AuthenticatedUser = {
    user_id: number;
    roles: string[];
};
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
/**
 * Duy nhất 1 expressAuthentication cho toàn project (tsoa chỉ cho phép 1).
 * req.user phải được set trước bởi `authenticate` middleware chạy trong pipeline
 * (vd app.use(authenticate) trước khi routes tsoa-generated được mount).
 *
 * "admin" luôn bypass scope check, đồng bộ với requireRoles().
 */
export declare function expressAuthentication(req: Request, securityName: string, scopes?: string[]): Promise<AuthenticatedUser>;
//# sourceMappingURL=auth.middleware.d.ts.map