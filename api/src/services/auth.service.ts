import crypto from 'crypto';
import bcrypt from 'bcrypt';
import type { AuthTokens, UserPayload } from '../types/auth.types.js';
import prisma from '../libs/prisma.js';
import { createAppError } from '../common/app.error.js';
import { LoginDto, RegisterDto } from '../dtos/auth.schema.js';
import { sessionStore } from '../libs/session.js';
import { signAccessToken } from '../libs/jwt.js';
import { PrismaClient } from '../generated/prisma/client.js';

export class AuthService {
    constructor(
        private readonly prisma: PrismaClient
    ) {

    }
    async login(dto: LoginDto): Promise<AuthTokens> {
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

    async register(dto: RegisterDto): Promise<AuthTokens> {
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

    async refresh(refreshTokenUuid: string | undefined, csrfHeader: string | undefined): Promise<AuthTokens> {
        if (!refreshTokenUuid) throw createAppError('UNAUTHORIZED', 'Missing refresh token cookie');
        if (!csrfHeader) throw createAppError('UNAUTHORIZED', 'Missing X-CSRF-TOKEN header');

        const session = await sessionStore.get(refreshTokenUuid);
        if (!session) throw createAppError('UNAUTHORIZED', `Session not found or expired: ${refreshTokenUuid}`);

        if (session.csrfToken !== csrfHeader) {
            throw createAppError('FORBIDDEN', `CSRF mismatch for session: ${refreshTokenUuid}`);
        }

        // Issue trước, del sau — tránh lock-out nếu Redis fail giữa chừng
        const tokens = await this.issueTokens(session.user_id);
        await sessionStore.del(refreshTokenUuid);

        return tokens;
    }

    async logout(refreshTokenUuid: string | undefined): Promise<void> {
        if (refreshTokenUuid) await sessionStore.del(refreshTokenUuid);
    }

    async getMe(id: number): Promise<UserPayload> {

        const user = await this.prisma.user.findUnique({
            where: { id: id },
            select: { id: true, name: true, email: true },
        });

        if (!user) throw createAppError('NOT_FOUND', `User not found: ${id}`);
        return user;
    }

    private async issueTokens(user_id: number): Promise<AuthTokens> {
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