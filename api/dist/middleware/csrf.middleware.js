import rateLimit from 'express-rate-limit';
// CSV trong env: APP_ORIGIN=http://localhost:5173,https://your-prod-domain.com
const allowedOrigins = (process.env.APP_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());
function rejectOrigin(res) {
    res.status(403).json({
        status: false,
        code: 'FORBIDDEN',
        message: 'Access denied',
        data: null,
        timestamp: new Date().toISOString(),
    });
}
export const originGuard = (req, res, next) => {
    const origin = req.headers['origin'];
    if (!origin) {
        next();
        return;
    }
    try {
        if (!allowedOrigins.includes(new URL(origin).origin)) {
            rejectOrigin(res);
            return;
        }
    }
    catch {
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
//# sourceMappingURL=csrf.middleware.js.map