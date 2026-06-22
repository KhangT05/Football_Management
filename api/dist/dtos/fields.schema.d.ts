import { z } from 'zod';
export declare const vnTimeRegex: RegExp;
export declare const venueIdsField: z.ZodArray<z.ZodNumber>;
export declare const matchTimesField: z.ZodArray<z.ZodString>;
export declare const isoDatetimeField: (fieldName: string) => z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
//# sourceMappingURL=fields.schema.d.ts.map