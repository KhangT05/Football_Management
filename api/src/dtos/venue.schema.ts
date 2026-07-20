import { z } from "zod";

export const createVenueSchema = z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    is_active: z.boolean().optional(),
});

export const updateVenueSchema = createVenueSchema
    .partial()
    .extend({
        is_active: z.boolean().optional(),
    });

export type CreateVenueDto = z.infer<typeof createVenueSchema>;
export type UpdateVenueDto = z.infer<typeof updateVenueSchema>;