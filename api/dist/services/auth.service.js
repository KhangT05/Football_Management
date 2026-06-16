import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { createAppError } from '../common/app.error.js';
import { sessionStore } from '../libs/session.js';
import { signAccessToken } from '../libs/jwt.js';
export class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        const passwordMatch = user
            ? await bcrypt.compare(dto.password, user.password)
            : false;
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
        await sessionStore.set(refreshTokenUuid, { user_id, csrfToken }).catch(() => {
            throw createAppError('UNAUTHORIZED', `Redis sessionStore.set failed for user_id: ${user_id}`);
        });
        return {
            accessToken: signAccessToken(user_id),
            csrfToken,
            refreshTokenUuid,
        };
    }
}
//# sourceMappingURL=auth.service.js.map