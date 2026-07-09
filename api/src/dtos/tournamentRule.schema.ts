import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";

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
    created_at: Date;
    round_robin_stages: number;
    updated_at: Date | null;
    user?: { id: number; name: string; email: string; phone: string | null } | null;
    tournament?: { id: number; name: string } | null;
}

export const TIEBREAKER_OPTIONS = [
    "goal_diff",
    "goals_scored",
    "head_to_head",
    "goals_conceded",
    "yellow_cards",
    "red_cards",
] as const;

export const SEASON_FORMATS = [
    "round_robin",
    "knockout",
    "round_robin_knockout",
    "multi_round_robin_knockout",
] as const;

export type SeasonFormat = (typeof SEASON_FORMATS)[number];
export type TiebreakerOption = (typeof TIEBREAKER_OPTIONS)[number];

const tournamentRuleBaseSchema = z.object({
    tournament_id: z.number().int().positive(),
    name: z.string().trim().min(1).max(100).default("Default Rule"),
    points_per_win: z.number().int().min(0).max(10).default(3),
    points_per_draw: z.number().int().min(0).max(10).default(1),
    points_per_loss: z.number().int().min(0).max(10).default(0),
    forfeit_score: z.number().int().min(0).max(20).default(3),
    suspension_match_count: z.number().int().min(1).max(20).default(1),
    yellow_cards_suspension: z.number().int().min(1).max(10).default(3),
    fine_per_yellow_card: z.number().min(0).max(99_999_999.99).default(0),
    fine_per_red_card: z.number().min(0).max(99_999_999.99).default(0),
    bonus_per_goal: z.number().min(0).max(99_999_999.99).default(0),
    bonus_per_assist: z.number().min(0).max(99_999_999.99).default(0),
    max_players_per_team: z.number().int().min(1).max(50).default(25),
    min_players_per_team: z.number().int().min(1).max(50).default(11),
    teams_advance_per_group: z.number().int().min(1).default(2),
    round_robin_stages: z.number().int().min(0).max(50).default(1),
    format: z.enum(SEASON_FORMATS).default("round_robin_knockout"),
    tiebreaker_order: z.array(z.enum(TIEBREAKER_OPTIONS)).min(1).default([
        "goal_diff",
        "goals_scored",
        "head_to_head",
    ]),
});

export const createTournamentRuleSchema = tournamentRuleBaseSchema.refine(
    (data) => data.max_players_per_team >= data.min_players_per_team,
    { message: "max_players_per_team phải >= min_players_per_team", path: ["max_players_per_team"] }
);

// Update: chỉ validate nếu CẢ HAI field cùng có mặt trong payload.
// Nếu chỉ 1 field được gửi, việc so sánh với DB hiện tại phải làm ở service layer
// (giống pattern format/round_robin_stages bạn đã có trong TournamentRuleService).
export const updateTournamentRuleSchema = tournamentRuleBaseSchema.partial().refine(
    (data) =>
        data.max_players_per_team === undefined ||
        data.min_players_per_team === undefined ||
        data.max_players_per_team >= data.min_players_per_team,
    { message: "max_players_per_team phải >= min_players_per_team", path: ["max_players_per_team"] }
);

export type CreateTournamentRuleInput = z.input<typeof createTournamentRuleSchema>;
export type UpdateTournamentRuleInput = z.input<typeof updateTournamentRuleSchema>;
export type CreateTournamentRuleDto = z.output<typeof createTournamentRuleSchema>;
export type UpdateTournamentRuleDto = z.output<typeof updateTournamentRuleSchema>;