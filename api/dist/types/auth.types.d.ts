export interface JwtPayload {
    sub: number;
    guard: string;
    iat?: number;
    exp?: number;
}
export interface AuthTokens {
    accessToken: string;
    csrfToken: string;
    refreshTokenUuid: string;
}
export interface UserPayload {
    id: number;
    name: string;
    email: string;
    roles: string[];
}
export interface TokenResponseDto {
    accessToken: string;
    tokenType: 'Bearer';
    expiresIn: number;
    csrfToken: string;
}
//# sourceMappingURL=auth.types.d.ts.map