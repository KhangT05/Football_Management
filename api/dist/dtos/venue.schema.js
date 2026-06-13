import { z } from "zod";
export const createVenueSchema = z.object({
    name: z.string().min(1),
    address: z.string(),
});
export const updateVenueSchema = createVenueSchema
    .partial()
    .extend({
    is_active: z.boolean().optional(),
});
//# sourceMappingURL=venue.schema.js.map