import { verifyAccessToken } from '../libs/jwt.js';
import { createAppError } from '../common/app.error.js';
import rateLimit from 'express-rate-limit';
export function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next(createAppError('UNAUTHORIZED', 'Missing access token'));
    }
    const token = authHeader.slice(7);
    try {
        const payload = verifyAccessToken(token);
        req.user_id = payload.sub;
        next();
    }
    catch {
        next(createAppError('UNAUTHORIZED', 'Invalid or expired access token'));
    }
}
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});
export const originGuard = (req, res, next) => {
    const allowed = process.env.APP_ORIGIN ?? 'http://localhost:3000';
    const requestOrigin = (() => {
        try {
            return new URL(req.headers['origin'] ?? '').origin;
        }
        catch {
            return '';
        }
    })();
    if (allowed !== requestOrigin) {
        res.status(403).json({ message: 'Forbidden origin' });
        return;
    }
    next();
};
export async function expressAuthentication(req, securityName) {
    if (securityName === "jwt") {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            throw createAppError('UNAUTHORIZED', 'Missing access token'); // dùng AppError thay vì plain Error
        }
        try {
            const payload = verifyAccessToken(authHeader.slice(7));
            return { user_id: payload.sub };
        }
        catch {
            throw createAppError('UNAUTHORIZED', 'Invalid or expired access token');
        }
    }
    throw createAppError('FORBIDDEN', 'Unknown security scheme');
}
//# sourceMappingURL=auth.middleware.js.map