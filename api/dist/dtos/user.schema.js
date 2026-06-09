import { z } from "zod";
export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string(),
});
export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    is_active: z.boolean().optional(),
});
//# sourceMappingURL=user.schema.js.map