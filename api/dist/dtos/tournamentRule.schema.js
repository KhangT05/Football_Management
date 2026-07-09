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
    name: z.string().trim().min(1).max(100).default("Default Rule"),
    points_per_win: z.number().int().min(0).max(10).default(3),
    points_per_draw: z.number().int().min(0).max(10).default(1),
    points_per_loss: z.number().int().min(0).max(10).default(0),
    forfeit_score: z.number().int().min(0).max(20).default(3),
    suspension_match_count: z.number().int().min(1).max(20).default(1),
    yellow_cards_suspension: z.number().int().min(1).max(10).default(3),
    // Decimal(10,2) ở Prisma -> validate range hợp lý, tránh overflow silent truncate.
    fine_per_yellow_card: z.number().min(0).max(99_999_999.99).default(0),
    fine_per_red_card: z.number().min(0).max(99_999_999.99).default(0),
    bonus_per_goal: z.number().min(0).max(99_999_999.99).default(0),
    bonus_per_assist: z.number().min(0).max(99_999_999.99).default(0),
    max_players_per_team: z.number().int().min(1).max(50).default(25),
    min_players_per_team: z.number().int().min(1).max(50).default(11),
    teams_advance_per_group: z.number().int().min(1).default(2),
    // 0 = knockout thuần (không có vòng bảng). Business rule khớp với format nằm ở service.
    round_robin_stages: z.number().int().min(0).max(50).default(1),
    format: z.enum(SEASON_FORMATS).default("round_robin_knockout"),
    tiebreaker_order: z.array(z.enum(TIEBREAKER_OPTIONS)).min(1).default([
        "goal_diff",
        "goals_scored",
        "head_to_head",
    ]),
}).refine((data) => data.max_players_per_team >= data.min_players_per_team, {
    message: "max_players_per_team phải >= min_players_per_team",
    path: ["max_players_per_team"],
});
export const updateTournamentRuleSchema = createTournamentRuleSchema
    .partial();
//# sourceMappingURL=tournamentRule.schema.js.map