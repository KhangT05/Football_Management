import { z } from "zod";

export const createClassSchema = z.object({
    name: z.string().trim().min(1).max(100),
    is_active: z.boolean().optional(),
});
export const updateClassSchema = createClassSchema.partial();

export type CreateClassDto = z.infer<typeof createClassSchema>;
export type UpdateClassDto = z.infer<typeof updateClassSchema>;

export interface ClassDto {
    id: number;
    name: string;
    is_active: boolean;
    created_at: Date;
}