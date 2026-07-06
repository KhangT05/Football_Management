import { Controller } from 'tsoa';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from '../services/auth.service.js';
import type { TokenResponseDto, UserPayload } from '../types/auth.types.js';
import { ApiResponseShape } from '../common/api.response.js';
import type { LoginDto, RegisterDto } from '../dtos/auth.schema.js';
import * as userSchema from '../dtos/user.schema.js';
import { UserService } from '../services/user.service.js';
type AuthRequest = ExpressRequest & {
    user: {
        user_id: number;
    };
};
export declare class AuthController extends Controller {
    private readonly service;
    private readonly userService;
    constructor(service: AuthService, userService: UserService);
    login(body: LoginDto, req: ExpressRequest): Promise<ApiResponseShape<TokenResponseDto>>;
    register(body: RegisterDto, req: ExpressRequest): Promise<ApiResponseShape<TokenResponseDto>>;
    refresh(req: ExpressRequest, csrfHeader?: string): Promise<ApiResponseShape<TokenResponseDto>>;
    logout(req: ExpressRequest): Promise<void>;
    me(req: AuthRequest): Promise<ApiResponseShape<UserPayload>>;
    forgotPassword(body: userSchema.ForgotPasswordDto): Promise<void>;
    resetPassword(body: userSchema.ResetPasswordDto): Promise<void>;
}
export {};
//# sourceMappingURL=auth.controller.d.ts.map