import { z } from "zod";
export const createVenueSchema = z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    is_active: z.boolean().default(true),
});
export const updateVenueSchema = createVenueSchema
    .partial()
    .extend({
    is_active: z.boolean().default(true),
});
//# sourceMappingURL=venue.schema.js.map