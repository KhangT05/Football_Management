import type { AuthTokens, UserPayload } from '../types/auth.types.js';
import { LoginDto, RegisterDto } from '../dtos/auth.schema.js';
import { PrismaClient } from '../generated/prisma/client.js';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    login(dto: LoginDto): Promise<AuthTokens>;
    register(dto: RegisterDto): Promise<AuthTokens>;
    /**
     * Refresh token rotation với atomic consume.
     *
     * Fix race condition: bản cũ issue token mới TRƯỚC khi xoá session cũ
     * -> 2 request refresh song song cùng 1 token đều pass, đều issue được
     * token mới -> double-issue, không detect được token reuse.
     *
     * Fix: del trước, kiểm tra kết quả del để xác nhận request này là người
     * duy nhất "consume" được token. Nếu sessionStore.del trả về 0/false
     * (key đã bị xoá bởi request khác) -> coi như race/replay, reject.
     *
     * Trade-off: nếu Redis chết giữa del và issueTokens, user bị logout
     * (phải login lại) thay vì lock-out vĩnh viễn — đây là tradeoff đúng,
     * ưu tiên an toàn hơn tiện lợi.
     *
     * Assumption: sessionStore.del(key) trả về number/boolean cho biết có
     * xoá được key hay không (giống ioredis .del() trả count). Nếu hiện tại
     * sessionStore.del trả void, cần sửa lib session.ts để trả count trước.
     */
    refresh(refreshTokenUuid: string | undefined, csrfHeader: string | undefined): Promise<AuthTokens>;
    logout(refreshTokenUuid: string | undefined): Promise<void>;
    getMe(id: number): Promise<UserPayload>;
    private issueTokens;
}
//# sourceMappingURL=auth.service.d.ts.map