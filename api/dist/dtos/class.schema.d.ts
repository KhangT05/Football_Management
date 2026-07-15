import { z } from "zod";
export declare const createClassSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const updateClassSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateClassDto = z.infer<typeof createClassSchema>;
export type UpdateClassDto = z.infer<typeof updateClassSchema>;
export interface ClassDto {
    id: number;
    name: string;
    is_active: boolean;
    created_at: Date;
}
//# sourceMappingURL=class.schema.d.ts.map