export const ERROR_REGISTRY = {
    // Auth/Access — luôn map về 403
    UNAUTHORIZED: { httpStatus: 401, expose: 403, isAuthError: true },
    FORBIDDEN: { httpStatus: 403, expose: 403, isAuthError: true },
    NOT_FOUND: { httpStatus: 404, expose: 403, isAuthError: true },
    BAD_REQUEST: { httpStatus: 400, expose: 400, isAuthError: false },

    // Business logic — expose thật vì cần client handle
    CONFLICT: { httpStatus: 409, expose: 409, isAuthError: false },
    VALIDATION_ERROR: { httpStatus: 422, expose: 422, isAuthError: false },
    RATE_LIMITED: { httpStatus: 429, expose: 429, isAuthError: false },

    // Server — che hết
    DB_ERROR: { httpStatus: 500, expose: 500, isAuthError: false },
    EXTERNAL_API_ERROR: { httpStatus: 502, expose: 500, isAuthError: false }, // đừng leak vendor info
    TIMEOUT: { httpStatus: 504, expose: 500, isAuthError: false },
} as const;

export type ErrorCode = keyof typeof ERROR_REGISTRY;

export const AUTH_CODE = new Set(
    Object.entries(ERROR_REGISTRY)
        .filter(([, v]) => v.isAuthError)
        .map(([k]) => k as ErrorCode)
);