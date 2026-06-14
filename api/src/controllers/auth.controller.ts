import {
    Controller,
    Post,
    Get,
    Route,
    Tags,
    Security,
    Body,
    Request,
    SuccessResponse,
    Middlewares,
    Header
} from 'tsoa';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { AuthService } from '../services/auth.service.js';
import type { TokenResponseDto, UserPayload } from '../types/auth.types.js';
import { ApiResponseShape, makeResponse } from '../common/api.response.js';
import type { LoginDto, RegisterDto } from '../dtos/auth.schema.js';
import { authLimiter, originGuard } from '../middleware/auth.middleware.js';
type AuthRequest = ExpressRequest & { user: { user_id: number } };

const COOKIE_NAME = 'refresh_token';
const COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const IS_PROD = process.env.NODE_ENV === 'production';
const COOKIE_PATH = '/api/v1/auth/refresh';

function setRefreshCookie(res: ExpressResponse, uuid: string) {
    res.cookie(COOKIE_NAME, uuid, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: 'lax',
        maxAge: COOKIE_TTL_MS,
        path: COOKIE_PATH,
    });
}

function clearRefreshCookie(res: ExpressResponse) {
    res.clearCookie(COOKIE_NAME, { path: COOKIE_PATH });
}

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
    constructor(private readonly service: AuthService) {
        super();
    }

    @Post('/login')
    @Middlewares(authLimiter)
    async login(
        @Body() body: LoginDto,
        @Request() req: ExpressRequest,
    ): Promise<ApiResponseShape<TokenResponseDto>> {
        const res = (req as any).res as ExpressResponse;
        const tokens = await this.service.login(body);
        setRefreshCookie(res, tokens.refreshTokenUuid);
        return makeResponse<TokenResponseDto>(
            {
                accessToken: tokens.accessToken,
                tokenType: 'Bearer',
                expiresIn: 900,
                csrfToken: tokens.csrfToken
            },
            'Đăng nhập thành công',
        );
    }


    @Post('/register')
    @Middlewares(authLimiter)
    @SuccessResponse(201, 'Created')
    async register(
        @Body() body: RegisterDto,
        @Request() req: ExpressRequest,
    ): Promise<ApiResponseShape<TokenResponseDto>> {
        const res = (req as any).res as ExpressResponse;
        const tokens = await this.service.register(body);
        setRefreshCookie(res, tokens.refreshTokenUuid);
        this.setStatus(201);
        return makeResponse<TokenResponseDto>(
            {
                accessToken: tokens.accessToken,
                tokenType: 'Bearer',
                expiresIn: 900,
                csrfToken: tokens.csrfToken
            },
            'Đăng ký thành công',
        );
    }

    @Post('/refresh')
    @Middlewares(originGuard)
    async refresh(
        @Request() req: ExpressRequest,
        @Header('x-csrf-token') csrfHeader?: string,
    ): Promise<ApiResponseShape<TokenResponseDto>> {
        const res = (req as any).res as ExpressResponse;
        const uuid = req.cookies?.[COOKIE_NAME];
        const tokens = await this.service.refresh(uuid, csrfHeader);
        setRefreshCookie(res, tokens.refreshTokenUuid);
        return makeResponse<TokenResponseDto>(
            { accessToken: tokens.accessToken, tokenType: 'Bearer', expiresIn: 900, csrfToken: tokens.csrfToken },
            'Token đã được làm mới',
        );
    }

    @Post('/logout')
    @Security('jwt')
    @SuccessResponse(204, 'No Content')
    async logout(@Request() req: ExpressRequest): Promise<void> {
        const res = (req as any).res as ExpressResponse;
        await this.service.logout(req.cookies?.[COOKIE_NAME]);
        clearRefreshCookie(res);
        this.setStatus(204);
    }

    @Get('/me')
    @Security('jwt')
    async me(@Request() req: AuthRequest): Promise<ApiResponseShape<UserPayload>> {
        const user = await this.service.getMe(req.user.user_id);
        return makeResponse<UserPayload>(user, 'OK');
    }
}