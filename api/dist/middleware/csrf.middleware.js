import rateLimit from 'express-rate-limit';
export const originGuard = (req, res, next) => {
    const allowed = process.env.APP_ORIGIN ?? 'http://localhost:3000';
    const origin = req.headers['origin'];
    if (!origin) {
        next();
        return;
    }
    try {
        if (new URL(origin).origin !== allowed) {
            res.status(403).json({ message: 'Forbidden origin' });
            return;
        }
    }
    catch {
        res.status(403).json({ message: 'Forbidden origin' });
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