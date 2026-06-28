import type { AuthTokens, UserPayload } from '../types/auth.types.js';
import { LoginDto, RegisterDto } from '../dtos/auth.schema.js';
import { PrismaClient } from '../generated/prisma/client.js';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    login(dto: LoginDto): Promise<AuthTokens>;
    register(dto: RegisterDto): Promise<AuthTokens>;
    /**
     * Refresh token rotation với atomic GETDEL (Redis >= 6.2).
     *
     * getAndDelete đảm bảo chỉ 1 trong N concurrent request với cùng UUID
     * nhận được session — request còn lại nhận null → reject.
     *
     * Flow:
     * 1. GETDEL uuid → nhận session hoặc null (atomic)
     * 2. Validate CSRF
     * 3. Issue token mới (bao gồm session mới trong Redis)
     *
     * Failure mode: nếu issueTokens fail sau khi đã del session
     * → user phải login lại. Đây là trade-off đúng: ưu tiên security hơn UX.
     */
    refresh(refreshTokenUuid: string | undefined, csrfHeader: string | undefined): Promise<AuthTokens>;
    logout(refreshTokenUuid: string | undefined): Promise<void>;
    getMe(id: number): Promise<UserPayload>;
    private issueTokens;
}
//# sourceMappingURL=auth.service.d.ts.map