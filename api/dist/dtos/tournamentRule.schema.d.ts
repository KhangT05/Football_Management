import { z } from "zod";
export interface TournamentRuleDto {
    id: number;
    tournament_id: number;
    is_active: boolean;
    points_per_win: number;
    points_per_draw: number;
    format: SeasonFormat;
    points_per_loss: number;
    forfeit_score: number;
    yellow_cards_suspension: number;
    max_players_per_team: number;
    min_players_per_team: number;
    teams_advance_per_group: number;
    tiebreaker_order: TiebreakerOption[];
    created_at: Date;
    round_robin_stages: number;
    updated_at: Date | null;
    user?: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    } | null;
    tournament?: {
        id: number;
        name: string;
    } | null;
}
export declare const TIEBREAKER_OPTIONS: readonly ["goal_diff", "goals_scored", "head_to_head", "goals_conceded", "yellow_cards", "red_cards"];
export declare const SEASON_FORMATS: readonly ["round_robin", "knockout", "round_robin_knockout", "multi_round_robin_knockout"];
export type SeasonFormat = (typeof SEASON_FORMATS)[number];
export type TiebreakerOption = (typeof TIEBREAKER_OPTIONS)[number];
export declare const createTournamentRuleSchema: z.ZodObject<{
    tournament_id: z.ZodNumber;
    points_per_win: z.ZodDefault<z.ZodNumber>;
    points_per_draw: z.ZodDefault<z.ZodNumber>;
    points_per_loss: z.ZodDefault<z.ZodNumber>;
    forfeit_score: z.ZodDefault<z.ZodNumber>;
    yellow_cards_suspension: z.ZodDefault<z.ZodNumber>;
    max_players_per_team: z.ZodDefault<z.ZodNumber>;
    min_players_per_team: z.ZodDefault<z.ZodNumber>;
    teams_advance_per_group: z.ZodDefault<z.ZodNumber>;
    round_robin_stages: z.ZodDefault<z.ZodNumber>;
    format: z.ZodDefault<z.ZodEnum<{
        round_robin: "round_robin";
        knockout: "knockout";
        round_robin_knockout: "round_robin_knockout";
        multi_round_robin_knockout: "multi_round_robin_knockout";
    }>>;
    tiebreaker_order: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        goal_diff: "goal_diff";
        goals_scored: "goals_scored";
        head_to_head: "head_to_head";
        goals_conceded: "goals_conceded";
        yellow_cards: "yellow_cards";
        red_cards: "red_cards";
    }>>>;
}, z.core.$strip>;
export declare const updateTournamentRuleSchema: z.ZodObject<{
    tournament_id: z.ZodOptional<z.ZodNumber>;
    points_per_win: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    points_per_draw: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    points_per_loss: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    forfeit_score: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    yellow_cards_suspension: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    max_players_per_team: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    min_players_per_team: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    teams_advance_per_group: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    round_robin_stages: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        round_robin: "round_robin";
        knockout: "knockout";
        round_robin_knockout: "round_robin_knockout";
        multi_round_robin_knockout: "multi_round_robin_knockout";
    }>>>;
    tiebreaker_order: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodEnum<{
        goal_diff: "goal_diff";
        goals_scored: "goals_scored";
        head_to_head: "head_to_head";
        goals_conceded: "goals_conceded";
        yellow_cards: "yellow_cards";
        red_cards: "red_cards";
    }>>>>;
}, z.core.$strip>;
export type CreateTournamentRuleDto = z.infer<typeof createTournamentRuleSchema>;
export type UpdateTournamentRuleDto = z.infer<typeof updateTournamentRuleSchema>;
//# sourceMappingURL=tournamentRule.schema.d.ts.map