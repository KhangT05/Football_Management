import { z } from "zod";
export const TIEBREAKER_OPTIONS = [
    "goal_diff",
    "goals_scored",
    "head_to_head",
    "goals_conceded",
    "yellow_cards",
    "red_cards",
];
export const SEASON_FORMATS = [
    "round_robin",
    "knockout",
    "round_robin_knockout",
    "multi_round_robin_knockout",
];
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
    round_robin_stages: z.number().int().min(1).default(1),
    format: z.enum(SEASON_FORMATS).default("round_robin_knockout"),
    tiebreaker_order: z.array(z.enum(TIEBREAKER_OPTIONS)).min(1).default([
        "goal_diff",
        "goals_scored",
        "head_to_head",
    ]),
});
export const updateTournamentRuleSchema = createTournamentRuleSchema.partial();
//# sourceMappingURL=tournamentRule.schema.js.map