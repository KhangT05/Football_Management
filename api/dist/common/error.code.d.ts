export declare const ERROR_REGISTRY: {
    readonly UNAUTHORIZED: {
        readonly httpStatus: 401;
        readonly expose: 403;
        readonly isAuthError: true;
    };
    readonly FORBIDDEN: {
        readonly httpStatus: 403;
        readonly expose: 403;
        readonly isAuthError: true;
    };
    readonly NOT_FOUND: {
        readonly httpStatus: 404;
        readonly expose: 403;
        readonly isAuthError: true;
    };
    readonly BAD_REQUEST: {
        readonly httpStatus: 400;
        readonly expose: 400;
        readonly isAuthError: false;
    };
    readonly CONFLICT: {
        readonly httpStatus: 409;
        readonly expose: 409;
        readonly isAuthError: false;
    };
    readonly VALIDATION_ERROR: {
        readonly httpStatus: 422;
        readonly expose: 422;
        readonly isAuthError: false;
    };
    readonly RATE_LIMITED: {
        readonly httpStatus: 429;
        readonly expose: 429;
        readonly isAuthError: false;
    };
    readonly DB_ERROR: {
        readonly httpStatus: 500;
        readonly expose: 500;
        readonly isAuthError: false;
    };
    readonly EXTERNAL_API_ERROR: {
        readonly httpStatus: 502;
        readonly expose: 500;
        readonly isAuthError: false;
    };
    readonly TIMEOUT: {
        readonly httpStatus: 504;
        readonly expose: 500;
        readonly isAuthError: false;
    };
};
export type ErrorCode = keyof typeof ERROR_REGISTRY;
export declare const AUTH_CODE: Set<"UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "BAD_REQUEST" | "CONFLICT" | "VALIDATION_ERROR" | "RATE_LIMITED" | "DB_ERROR" | "EXTERNAL_API_ERROR" | "TIMEOUT">;
//# sourceMappingURL=error.code.d.ts.map