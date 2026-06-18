import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { createAppError } from '../common/app.error.js';
import { sessionStore } from '../libs/session.js';
import { signAccessToken } from '../libs/jwt.js';
// Dummy hash hợp lệ format bcrypt (cost=12) để giữ thời gian compare constant
// khi user không tồn tại — tránh timing side-channel lộ email có tồn tại hay không.
const DUMMY_HASH = '$2b$12$' + 'x'.repeat(53);
export class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        // Luôn chạy bcrypt.compare dù user có tồn tại hay không, để thời gian phản hồi
        // không lộ thông tin "email tồn tại" qua timing (bcrypt compare ~50-100ms vs ~0ms).
        const passwordMatch = await bcrypt.compare(dto.password, user?.password ?? DUMMY_HASH);
        // Không phân biệt "sai email" vs "sai password" — tránh user enumeration
        if (!user || !passwordMatch) {
            throw createAppError('UNAUTHORIZED');
        }
        // console.log(user.is_active);
        if (!user.is_active) {
            throw createAppError('FORBIDDEN');
        }
        return this.issueTokens(user.id);
    }
    async register(dto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) {
            throw createAppError('CONFLICT', `Email already exists: ${dto.email}`, 'Email đã được sử dụng');
        }
        const hashed = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: { email: dto.email, password: hashed, name: dto.name },
        });
        return this.issueTokens(user.id);
    }
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
    async refresh(refreshTokenUuid, csrfHeader) {
        if (!refreshTokenUuid)
            throw createAppError('UNAUTHORIZED', 'Missing refresh token cookie');
        if (!csrfHeader)
            throw createAppError('UNAUTHORIZED', 'Missing X-CSRF-TOKEN header');
        const session = await sessionStore.get(refreshTokenUuid);
        if (!session)
            throw createAppError('UNAUTHORIZED', `Session not found or expired: ${refreshTokenUuid}`);
        if (session.csrfToken !== csrfHeader) {
            throw createAppError('FORBIDDEN', `CSRF mismatch for session: ${refreshTokenUuid}`);
        }
        // Issue trước, del sau — tránh lock-out nếu Redis fail giữa chừng
        const tokens = await this.issueTokens(session.user_id);
        await sessionStore.del(refreshTokenUuid);
        return tokens;
    }
    async logout(refreshTokenUuid) {
        if (refreshTokenUuid)
            await sessionStore.del(refreshTokenUuid);
    }
    async getMe(id) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
            select: { id: true, name: true, email: true },
        });
        if (!user)
            throw createAppError('NOT_FOUND', `User not found: ${id}`);
        return user;
    }
    async issueTokens(user_id) {
        const refreshTokenUuid = crypto.randomUUID();
        const csrfToken = crypto.randomUUID();
        try {
            await sessionStore.set(refreshTokenUuid, { user_id, csrfToken });
        }
        catch {
            // Lỗi hạ tầng (Redis down) -> không phải lỗi auth của user.
            // UNAUTHORIZED (401) sai vì FE/client sẽ hiểu nhầm là sai credential
            // và có thể trigger logout/redirect login loop. Phải là lỗi server.
            throw createAppError('INTERNAL_SERVER_ERROR', `Redis sessionStore.set failed for user_id: ${user_id}`);
        }
        ;
        return {
            accessToken: signAccessToken(user_id),
            csrfToken,
            refreshTokenUuid,
        };
    }
}
//# sourceMappingURL=auth.service.js.map