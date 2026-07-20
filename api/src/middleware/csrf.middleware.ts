// middleware/csrf.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// CSV trong env: APP_ORIGIN=http://localhost:5173,https://your-prod-domain.com
//
// FIX: chuẩn hoá từng origin qua `new URL(o).origin` ngay khi parse env —
// tránh trường hợp .env viết dư dấu "/" cuối (http://localhost:5173/) khiến
// so sánh string với `new URL(origin).origin` (không có "/" cuối) KHÔNG BAO
// GIỜ khớp -> mọi request state-changing (PATCH/POST/DELETE) bị chặn nhầm
// dù chạy đúng domain. Đây là nguyên nhân phổ biến của lỗi "Access denied".
const allowedOrigins = (process.env.APP_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
    .map((o) => {
        try {
            return new URL(o).origin;
        } catch {
            console.warn(`[originGuard] APP_ORIGIN entry không hợp lệ, bỏ qua: "${o}"`);
            return null;
        }
    })
    .filter((o): o is string => o !== null);

function rejectOrigin(res: Response) {
    res.status(403).json({
        status: false,
        code: 'FORBIDDEN',
        message: 'Access denied',
        data: null,
        timestamp: new Date().toISOString(),
    });
}

export const originGuard = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers['origin'];
    if (!origin) { next(); return; }

    try {
        const normalized = new URL(origin).origin;
        if (!allowedOrigins.includes(normalized)) {
            // FIX: log rõ origin thực tế bị từ chối vs whitelist hiện tại — trước đây
            // không log gì cả nên debug "Access denied" gần như không thể trace được
            // nếu chỉ nhìn response (message bị errorMiddleware generic hoá).
            console.warn(
                `[originGuard] Rejected origin "${normalized}". Allowed: [${allowedOrigins.join(', ')}]`
            );
            rejectOrigin(res);
            return;
        }
    } catch {
        rejectOrigin(res);
        return;
    }
    next();
};

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});