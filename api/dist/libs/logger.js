import pino from 'pino';
const isDev = process.env.NODE_ENV !== 'production';
const baseOptions = {
    level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
        pid: process.pid,
        env: process.env.NODE_ENV,
    },
    // Redact sensitive fields — log goes to external system (CloudWatch, Loki, etc.)
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            '*.password',
            '*.token',
            '*.secret',
        ],
        censor: '[REDACTED]',
    },
};
const transport = isDev
    ? pino.transport({
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname,env',
        },
    })
    : undefined; // production: newline-delimited JSON to stdout → shipper picks up
const rootLogger = transport
    ? pino(baseOptions, transport)
    : pino(baseOptions);
/**
 * createLogger('season-service') → child logger với context "module"
 * Tất cả log từ child tự carry context — không cần lặp field ở mỗi call.
 */
export function createLogger(module, extra) {
    return rootLogger.child({ module, ...extra });
}
/** Request-scoped logger — dùng trong middleware, gắn requestId/userId */
export function createRequestLogger(requestId, meta) {
    return rootLogger.child({ requestId, ...meta });
}
export { rootLogger as logger };
//# sourceMappingURL=logger.js.map