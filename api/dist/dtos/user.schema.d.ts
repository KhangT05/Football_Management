import { z } from "zod";
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodString;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    role_ids: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export declare const roleIdsSchema: z.ZodObject<{
    role_ids: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type RoleIdsDto = z.infer<typeof roleIdsSchema>;
//# sourceMappingURL=user.schema.d.ts.map