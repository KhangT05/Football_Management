import { z } from "zod";

export interface TournamentRuleDto {
    id: number;
    tournament_id: number;
    is_active: boolean;
    points_per_win: number;
    points_per_draw: number;
    points_per_loss: number;
    forfeit_score: number;
    yellow_cards_suspension: number;
    max_players_per_team: number;
    min_players_per_team: number;
    teams_advance_per_group: number;
    tiebreaker_order: TiebreakerOption[];   // ← không phải JsonValue
    created_at: Date;
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

export type TiebreakerOption = (typeof TIEBREAKER_OPTIONS)[number];

export const createTournamentRuleSchema = z.object({
    tournament_id: z.number().int().positive(),
    points_per_win: z.number().int().min(0).max(10).default(3),
    points_per_draw: z.number().int().min(0).max(10).default(1),
    points_per_loss: z.number().int().min(0).max(10).default(0),
    forfeit_score: z.number().int().min(0).max(20).default(3),
    yellow_cards_suspension: z.number().int().min(1).max(10).default(3),
    max_players_per_team: z.number().int().min(1).max(50).default(25),
    min_players_per_team: z.number().int().min(1).max(50).default(11),
    teams_advance_per_group: z.number().int().min(1).default(2),
    tiebreaker_order: z.array(z.enum(TIEBREAKER_OPTIONS)).min(1).default([
        "goal_diff",
        "goals_scored",
        "head_to_head",
    ]),
});

export const updateTournamentRuleSchema = createTournamentRuleSchema.partial();

export type CreateTournamentRuleDto = z.infer<typeof createTournamentRuleSchema>;
export type UpdateTournamentRuleDto = z.infer<typeof updateTournamentRuleSchema>;