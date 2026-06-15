var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Get, Route, Tags, Security, Body, Request, SuccessResponse, Middlewares, Header } from 'tsoa';
import { AuthService } from '../services/auth.service.js';
import { makeResponse } from '../common/api.response.js';
import { authLimiter, originGuard } from '../middleware/auth.middleware.js';
const COOKIE_NAME = 'refresh_token';
const COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const IS_PROD = process.env.NODE_ENV === 'production';
const COOKIE_PATH = '/api/v1/auth/refresh';
function setRefreshCookie(res, uuid) {
    res.cookie(COOKIE_NAME, uuid, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: 'lax',
        maxAge: COOKIE_TTL_MS,
        path: COOKIE_PATH,
    });
}
function clearRefreshCookie(res) {
    res.clearCookie(COOKIE_NAME, { path: COOKIE_PATH });
}
let AuthController = class AuthController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async login(body, req) {
        const res = req.res;
        const tokens = await this.service.login(body);
        setRefreshCookie(res, tokens.refreshTokenUuid);
        return makeResponse({
            accessToken: tokens.accessToken,
            tokenType: 'Bearer',
            expiresIn: 900,
            csrfToken: tokens.csrfToken
        }, 'Đăng nhập thành công');
    }
    async register(body, req) {
        const res = req.res;
        const tokens = await this.service.register(body);
        setRefreshCookie(res, tokens.refreshTokenUuid);
        this.setStatus(201);
        return makeResponse({
            accessToken: tokens.accessToken,
            tokenType: 'Bearer',
            expiresIn: 900,
            csrfToken: tokens.csrfToken
        }, 'Đăng ký thành công');
    }
    async refresh(req, csrfHeader) {
        const res = req.res;
        const uuid = req.cookies?.[COOKIE_NAME];
        const tokens = await this.service.refresh(uuid, csrfHeader);
        setRefreshCookie(res, tokens.refreshTokenUuid);
        return makeResponse({ accessToken: tokens.accessToken, tokenType: 'Bearer', expiresIn: 900, csrfToken: tokens.csrfToken }, 'Token đã được làm mới');
    }
    async logout(req) {
        const res = req.res;
        await this.service.logout(req.cookies?.[COOKIE_NAME]);
        clearRefreshCookie(res);
        this.setStatus(204);
    }
    async me(req) {
        const user = await this.service.getMe(req.user.user_id);
        return makeResponse(user, 'OK');
    }
};
__decorate([
    Post('/login'),
    Middlewares(authLimiter),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('/register'),
    Middlewares(authLimiter),
    SuccessResponse(201, 'Created'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    Post('/refresh'),
    Middlewares(originGuard),
    __param(0, Request()),
    __param(1, Header('x-csrf-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    Post('/logout'),
    Security('jwt'),
    SuccessResponse(204, 'No Content'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    Get('/me'),
    Security('jwt'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
AuthController = __decorate([
    Route('auth'),
    Tags('Auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map