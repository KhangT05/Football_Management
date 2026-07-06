import { z } from "zod";
export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string(),
});
export const updateUserSchema = createUserSchema
    .omit({ password: true, email: true })
    .partial()
    .extend({
    // password update tách riêng — không nên update trong cùng profile update
    role_ids: z.array(z.number().int().positive()).optional(),
});
export const roleIdsSchema = z.object({
    role_ids: z.array(z.number().int().positive()).min(1),
});
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
});
export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});
export const resetPasswordSchema = z.object({
    token: z.string().min(1),
    newPassword: z.string().min(6),
});
//# sourceMappingURL=user.schema.js.map