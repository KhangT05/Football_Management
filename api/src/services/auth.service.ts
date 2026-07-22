import crypto from 'crypto';
import bcrypt from 'bcrypt';
import type { AuthTokens, UserPayload } from '../types/auth.types.js';
import { createAppError } from '../common/app.error.js';
import { LoginDto, RegisterDto } from '../dtos/auth.schema.js';
import { invalidateUserRoles, sessionStore } from '../libs/session.js';
import { signAccessToken } from '../libs/jwt.js';
import { PrismaClient } from '../generated/prisma/client.js';

const DUMMY_HASH = '$2b$12$' + 'x'.repeat(53);

export class AuthService {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async login(dto: LoginDto): Promise<AuthTokens> {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

        const passwordMatch = await bcrypt.compare(dto.password, user?.password ?? DUMMY_HASH);

        if (!user || !passwordMatch) {
            throw createAppError('UNAUTHORIZED');
        }

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

        const user = await this.prisma.$transaction(async (tx) => {
            const created = await tx.user.create({
                data: { email: dto.email, password: hashed, name: dto.name },
            });

            const defaultRole = await tx.role.findFirst({
                where: { name: 'user', is_active: true },
                select: { id: true },
            });
            if (!defaultRole) {
                throw createAppError('INTERNAL_SERVER_ERROR', 'Default role "user" không tồn tại trong DB');
            }

            const attached = await tx.user_Role.createMany({
                data: [{ user_id: created.id, role_id: defaultRole.id }],
            });
            // Fail loudly nếu insert không thành công — không để silent gap tái diễn
            if (attached.count !== 1) {
                throw createAppError('INTERNAL_SERVER_ERROR', `Failed to attach default role for user ${created.id}`);
            }

            return created;
        });

        // Bắt buộc: cache roles (TTL 120s) phải được invalidate ngay sau commit,
        // nếu không request kế tiếp trong TTL window vẫn thấy roles rỗng dù DB đã đúng
        await invalidateUserRoles(user.id);

        return this.issueTokens(user.id);
    }

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
    async refresh(
        refreshTokenUuid: string | undefined,
        csrfHeader: string | undefined
    ): Promise<AuthTokens> {
        if (!refreshTokenUuid) {
            throw createAppError('UNAUTHORIZED', 'Missing refresh token cookie');
        }

        if (!csrfHeader) {
            throw createAppError('UNAUTHORIZED', 'Missing X-CSRF-TOKEN header');
        }

        // Atomic GET + DELETE — tránh race condition double-issue
        const session = await sessionStore.getAndDelete(refreshTokenUuid);

        if (!session) {
            throw createAppError('UNAUTHORIZED', 'Session not found or expired');
        }

        // CSRF validate sau khi đã del — nếu sai thì token cũ đã bị consume,
        // attacker không thể reuse dù biết UUID
        if (session.csrfToken !== csrfHeader) {
            throw createAppError('FORBIDDEN', 'CSRF mismatch');
        }

        return this.issueTokens(session.user_id);
    }

    async logout(refreshTokenUuid: string | undefined): Promise<void> {
        if (refreshTokenUuid) await sessionStore.del(refreshTokenUuid);
    }

    async getMe(id: number): Promise<UserPayload> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                user_roles: { select: { role: { select: { name: true } } } },
            },
        });

        if (!user) throw createAppError('NOT_FOUND', `User not found: ${id}`);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.user_roles.map((r) => r.role.name),
        };
    }

    private async issueTokens(user_id: number): Promise<AuthTokens> {
        const refreshTokenUuid = crypto.randomUUID();
        const csrfToken = crypto.randomUUID();

        try {
            await sessionStore.set(refreshTokenUuid, { user_id, csrfToken });
        } catch {
            throw createAppError(
                'INTERNAL_SERVER_ERROR',
                `Redis sessionStore.set failed for user_id: ${user_id}`
            );
        }

        return {
            accessToken: signAccessToken(user_id),
            csrfToken,
            refreshTokenUuid,
        };
    }
}