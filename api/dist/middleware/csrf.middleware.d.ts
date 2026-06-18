import type { Request, Response, NextFunction } from 'express';
export declare const originGuard: (req: Request, res: Response, next: NextFunction) => void;
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=csrf.middleware.d.ts.map