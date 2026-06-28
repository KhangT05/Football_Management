export interface JwtPayload {
    sub: number;   // userId
    guard: string;
    iat?: number;
    exp?: number;
}

export interface AuthTokens {
    accessToken: string;
    csrfToken: string;
    refreshTokenUuid: string; // chỉ dùng internally để set cookie
}

export interface UserPayload {
    id: number;
    name: string;
    email: string;
    roles: string[]; // thay role: string -> roles: string[]
}
export interface TokenResponseDto {
    accessToken: string;
    tokenType: 'Bearer';
    expiresIn: number;  // seconds
    csrfToken: string;
}