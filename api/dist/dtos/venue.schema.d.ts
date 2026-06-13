import { z } from "zod";
export declare const createVenueSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
}, z.core.$strip>;
export declare const updateVenueSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateVenueDto = z.infer<typeof createVenueSchema>;
export type UpdateVenueDto = z.infer<typeof updateVenueSchema>;
//# sourceMappingURL=venue.schema.d.ts.map