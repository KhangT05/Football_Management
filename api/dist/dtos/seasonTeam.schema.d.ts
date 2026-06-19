import { z } from "zod";
export declare const selfRegisterSeasonTeamSchema: z.ZodObject<{
    season_id: z.ZodNumber;
    team_id: z.ZodNumber;
}, z.core.$strip>;
export declare const adminAddSeasonTeamSchema: z.ZodObject<{
    season_id: z.ZodNumber;
    team_id: z.ZodNumber;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly approved: "approved";
        readonly pending: "pending";
        readonly active: "active";
        readonly eliminated: "eliminated";
        readonly withdrawn: "withdrawn";
    }>>>;
}, z.core.$strip>;
export declare const updateSeasonTeamStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        readonly approved: "approved";
        readonly pending: "pending";
        readonly active: "active";
        readonly eliminated: "eliminated";
        readonly withdrawn: "withdrawn";
    }>;
}, z.core.$strip>;
export declare const assignGroupSchema: z.ZodObject<{
    group_id: z.ZodNumber;
}, z.core.$strip>;
export type SelfRegisterSeasonTeamDto = z.infer<typeof selfRegisterSeasonTeamSchema>;
export type AdminAddSeasonTeamDto = z.infer<typeof adminAddSeasonTeamSchema>;
export type UpdateSeasonTeamStatusDto = z.infer<typeof updateSeasonTeamStatusSchema>;
export type AssignGroupDto = z.infer<typeof assignGroupSchema>;
//# sourceMappingURL=seasonTeam.schema.d.ts.map