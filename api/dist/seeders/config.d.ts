import { SeasonStatus } from "../generated/prisma/client.js";
import type { TournamentRuleOverrides } from "./tournamentSeeder.js";
export type SeasonArchetype = "upcoming" | "registration_open" | "ongoing" | "finished" | "cancelled";
export interface SeasonDef {
    key: string;
    archetype: SeasonArchetype;
    teamCount: 8 | 16 | 32;
    groupCount: 2 | 4 | 8;
}
export interface TournamentDef {
    key: string;
    name: string;
    description: string;
    teamPoolOffset: number;
    teamPoolSize: number;
    ruleOverrides: TournamentRuleOverrides;
    seasons: SeasonDef[];
}
export declare const TOURNAMENTS: TournamentDef[];
export declare function seasonStatusOf(archetype: SeasonArchetype): SeasonStatus;
//# sourceMappingURL=config.d.ts.map