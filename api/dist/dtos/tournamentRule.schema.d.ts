import { z } from "zod";
export interface TournamentRuleDto {
    id: number;
    tournament_id: number;
    name: string;
    is_active: boolean;
    points_per_win: number;
    points_per_draw: number;
    format: SeasonFormat;
    points_per_loss: number;
    forfeit_score: number;
    suspension_match_count: number;
    fine_per_yellow_card: number;
    fine_per_red_card: number;
    bonus_per_goal: number;
    bonus_per_assist: number;
    yellow_cards_suspension: number;
    max_players_per_team: number;
    min_players_per_team: number;
    teams_advance_per_group: number;
    tiebreaker_order: TiebreakerOption[];
    custom_stages: StageConfig[] | null;
    created_at: Date;
    round_robin_stages: number;
    updated_at: Date | null;
    deleted_at: Date | null;
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
export declare const SEASON_FORMATS: readonly ["round_robin", "knockout", "round_robin_knockout", "multi_round_robin_knockout", "custom"];
export type SeasonFormat = (typeof SEASON_FORMATS)[number];
export type TiebreakerOption = (typeof TIEBREAKER_OPTIONS)[number];
export declare const stageConfigSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    order: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodLiteral<"round_robin">;
    group_count: z.ZodNumber;
    teams_advance_per_group: z.ZodNumber;
    points_per_win: z.ZodNumber;
    points_per_draw: z.ZodNumber;
    points_per_loss: z.ZodNumber;
    source_stage_order: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    order: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodLiteral<"knockout">;
    source_stage_order: z.ZodNumber;
    seed_mode: z.ZodEnum<{
        standing_straight: "standing_straight";
        standing_cross: "standing_cross";
        standing_random: "standing_random";
        manual: "manual";
    }>;
    leg_type: z.ZodEnum<{
        single_leg: "single_leg";
        two_legged: "two_legged";
    }>;
}, z.core.$strip>, z.ZodObject<{
    order: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodLiteral<"classification">;
    source_stage_order: z.ZodNumber;
    source_kind: z.ZodEnum<{
        loser_of_stage: "loser_of_stage";
        standing: "standing";
    }>;
    leg_type: z.ZodEnum<{
        single_leg: "single_leg";
        two_legged: "two_legged";
    }>;
}, z.core.$strip>], "type">;
export type StageConfig = z.infer<typeof stageConfigSchema>;
export declare const customStagesSchema: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
    order: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodLiteral<"round_robin">;
    group_count: z.ZodNumber;
    teams_advance_per_group: z.ZodNumber;
    points_per_win: z.ZodNumber;
    points_per_draw: z.ZodNumber;
    points_per_loss: z.ZodNumber;
    source_stage_order: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    order: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodLiteral<"knockout">;
    source_stage_order: z.ZodNumber;
    seed_mode: z.ZodEnum<{
        standing_straight: "standing_straight";
        standing_cross: "standing_cross";
        standing_random: "standing_random";
        manual: "manual";
    }>;
    leg_type: z.ZodEnum<{
        single_leg: "single_leg";
        two_legged: "two_legged";
    }>;
}, z.core.$strip>, z.ZodObject<{
    order: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodLiteral<"classification">;
    source_stage_order: z.ZodNumber;
    source_kind: z.ZodEnum<{
        loser_of_stage: "loser_of_stage";
        standing: "standing";
    }>;
    leg_type: z.ZodEnum<{
        single_leg: "single_leg";
        two_legged: "two_legged";
    }>;
}, z.core.$strip>], "type">>;
export declare const createTournamentRuleSchema: z.ZodObject<{
    tournament_id: z.ZodNumber;
    name: z.ZodDefault<z.ZodString>;
    points_per_win: z.ZodDefault<z.ZodNumber>;
    points_per_draw: z.ZodDefault<z.ZodNumber>;
    points_per_loss: z.ZodDefault<z.ZodNumber>;
    forfeit_score: z.ZodDefault<z.ZodNumber>;
    suspension_match_count: z.ZodDefault<z.ZodNumber>;
    yellow_cards_suspension: z.ZodDefault<z.ZodNumber>;
    fine_per_yellow_card: z.ZodDefault<z.ZodNumber>;
    fine_per_red_card: z.ZodDefault<z.ZodNumber>;
    bonus_per_goal: z.ZodDefault<z.ZodNumber>;
    bonus_per_assist: z.ZodDefault<z.ZodNumber>;
    max_players_per_team: z.ZodDefault<z.ZodNumber>;
    min_players_per_team: z.ZodDefault<z.ZodNumber>;
    teams_advance_per_group: z.ZodDefault<z.ZodNumber>;
    round_robin_stages: z.ZodDefault<z.ZodNumber>;
    format: z.ZodDefault<z.ZodEnum<{
        custom: "custom";
        round_robin: "round_robin";
        knockout: "knockout";
        round_robin_knockout: "round_robin_knockout";
        multi_round_robin_knockout: "multi_round_robin_knockout";
    }>>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    tiebreaker_order: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        goal_diff: "goal_diff";
        goals_scored: "goals_scored";
        head_to_head: "head_to_head";
        goals_conceded: "goals_conceded";
        yellow_cards: "yellow_cards";
        red_cards: "red_cards";
    }>>>;
    custom_stages: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        order: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodLiteral<"round_robin">;
        group_count: z.ZodNumber;
        teams_advance_per_group: z.ZodNumber;
        points_per_win: z.ZodNumber;
        points_per_draw: z.ZodNumber;
        points_per_loss: z.ZodNumber;
        source_stage_order: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        order: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodLiteral<"knockout">;
        source_stage_order: z.ZodNumber;
        seed_mode: z.ZodEnum<{
            standing_straight: "standing_straight";
            standing_cross: "standing_cross";
            standing_random: "standing_random";
            manual: "manual";
        }>;
        leg_type: z.ZodEnum<{
            single_leg: "single_leg";
            two_legged: "two_legged";
        }>;
    }, z.core.$strip>, z.ZodObject<{
        order: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodLiteral<"classification">;
        source_stage_order: z.ZodNumber;
        source_kind: z.ZodEnum<{
            loser_of_stage: "loser_of_stage";
            standing: "standing";
        }>;
        leg_type: z.ZodEnum<{
            single_leg: "single_leg";
            two_legged: "two_legged";
        }>;
    }, z.core.$strip>], "type">>>>;
}, z.core.$strip>;
export declare const updateTournamentRuleSchema: z.ZodObject<{
    tournament_id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    points_per_win: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    points_per_draw: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    points_per_loss: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    forfeit_score: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    suspension_match_count: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    yellow_cards_suspension: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    fine_per_yellow_card: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    fine_per_red_card: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    bonus_per_goal: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    bonus_per_assist: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    max_players_per_team: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    min_players_per_team: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    teams_advance_per_group: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    round_robin_stages: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        custom: "custom";
        round_robin: "round_robin";
        knockout: "knockout";
        round_robin_knockout: "round_robin_knockout";
        multi_round_robin_knockout: "multi_round_robin_knockout";
    }>>>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    tiebreaker_order: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodEnum<{
        goal_diff: "goal_diff";
        goals_scored: "goals_scored";
        head_to_head: "head_to_head";
        goals_conceded: "goals_conceded";
        yellow_cards: "yellow_cards";
        red_cards: "red_cards";
    }>>>>;
    custom_stages: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        order: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodLiteral<"round_robin">;
        group_count: z.ZodNumber;
        teams_advance_per_group: z.ZodNumber;
        points_per_win: z.ZodNumber;
        points_per_draw: z.ZodNumber;
        points_per_loss: z.ZodNumber;
        source_stage_order: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        order: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodLiteral<"knockout">;
        source_stage_order: z.ZodNumber;
        seed_mode: z.ZodEnum<{
            standing_straight: "standing_straight";
            standing_cross: "standing_cross";
            standing_random: "standing_random";
            manual: "manual";
        }>;
        leg_type: z.ZodEnum<{
            single_leg: "single_leg";
            two_legged: "two_legged";
        }>;
    }, z.core.$strip>, z.ZodObject<{
        order: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodLiteral<"classification">;
        source_stage_order: z.ZodNumber;
        source_kind: z.ZodEnum<{
            loser_of_stage: "loser_of_stage";
            standing: "standing";
        }>;
        leg_type: z.ZodEnum<{
            single_leg: "single_leg";
            two_legged: "two_legged";
        }>;
    }, z.core.$strip>], "type">>>>>;
}, z.core.$strip>;
export type CreateTournamentRuleInput = z.input<typeof createTournamentRuleSchema>;
export type UpdateTournamentRuleInput = z.input<typeof updateTournamentRuleSchema>;
export type CreateTournamentRuleDto = z.output<typeof createTournamentRuleSchema>;
export type UpdateTournamentRuleDto = z.output<typeof updateTournamentRuleSchema>;
//# sourceMappingURL=tournamentRule.schema.d.ts.map