import type { AuthTokens, UserPayload } from '../types/auth.types.js';
import { LoginDto, RegisterDto } from '../dtos/auth.schema.js';
import { PrismaClient } from '../generated/prisma/client.js';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    login(dto: LoginDto): Promise<AuthTokens>;
    register(dto: RegisterDto): Promise<AuthTokens>;
    refresh(refreshTokenUuid: string | undefined, csrfHeader: string | undefined): Promise<AuthTokens>;
    logout(refreshTokenUuid: string | undefined): Promise<void>;
    getMe(id: number): Promise<UserPayload>;
    private issueTokens;
}
//# sourceMappingURL=auth.service.d.ts.map