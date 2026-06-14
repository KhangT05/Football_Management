import { z } from "zod";
export declare const createTournamentSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    logo: z.ZodOptional<z.ZodString>;
    max_teams: z.ZodNumber;
    is_active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateTournamentSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    logo: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    max_teams: z.ZodOptional<z.ZodNumber>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreateTournamentDto = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentDto = z.infer<typeof updateTournamentSchema>;
//# sourceMappingURL=tournament.schema.d.ts.map