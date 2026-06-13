import type { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user_id: number;
        }
    }
}
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const originGuard: (req: Request, res: Response, next: NextFunction) => void;
export declare function expressAuthentication(req: Request, securityName: string): Promise<{
    user_id: number;
}>;
//# sourceMappingURL=auth.middleware.d.ts.map