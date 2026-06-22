// common/fields.schema.ts — generic, không thuộc domain nào
import { z } from 'zod';
export const vnTimeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
export const venueIdsField = z.array(z.number().int()
    .positive()).min(1).refine(ids => new Set(ids).size === ids.length);
export const matchTimesField = z.array(z.string().regex(vnTimeRegex)).min(1);
export const isoDatetimeField = (fieldName) => z.string().datetime().transform(s => new Date(s));
//# sourceMappingURL=fields.schema.js.map