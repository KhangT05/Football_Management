import { Logger } from 'pino';
declare const rootLogger: Logger;
/**
 * createLogger('season-service') → child logger với context "module"
 * Tất cả log từ child tự carry context — không cần lặp field ở mỗi call.
 */
export declare function createLogger(module: string, extra?: Record<string, unknown>): Logger;
/** Request-scoped logger — dùng trong middleware, gắn requestId/userId */
export declare function createRequestLogger(requestId: string, meta?: {
    userId?: number;
    ip?: string;
    method?: string;
    url?: string;
}): Logger;
export { rootLogger as logger };
export type { Logger };
//# sourceMappingURL=logger.d.ts.map