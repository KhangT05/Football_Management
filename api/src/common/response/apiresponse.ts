export interface ApiResponseShape<T = null> {
    message: string;
    data: T | null;
    timestamp: string;
}

export function makeResponse<T>(data: T | null, message: string): ApiResponseShape<T> {
    return {
        message,
        data,
        timestamp: new Date().toISOString()
    };
}