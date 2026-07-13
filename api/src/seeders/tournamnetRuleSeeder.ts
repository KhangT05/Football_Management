import { SeasonFormat } from "../generated/prisma/client.js";
import type { DbClient } from "./dbTypes.js";

/**
 * Seed TournamentRule mặc định cho tournament + gán tournament_rule_id vào season.
 * PHẢI chạy TRƯỚC seedGroupStage/seedGroupMatchesAndStandings — các bước đó
 * (hoặc StandingsService ở read-path) join qua season.tournamentRule để lấy
 * points_per_win/draw/loss. Season tạo ra thiếu tournament_rule_id sẽ khiến
 * mọi API/FE tính standings từ rule bị null-reference hoặc fallback 0 — đây
 * là nguyên nhân PTS luôn hiện 0 dù TeamStanding.points đã lưu đúng giá trị
 * (position vẫn đúng vì cột đó không phụ thuộc rule).
 */
export async function seedTournamentRule(
    db: DbClient,
    tournamentId: number,
    seasonId: number
): Promise<{ ruleId: number }> {
    let rule = await db.tournamentRule.findFirst({
        where: { tournament_id: tournamentId, is_active: true },
    });

    if (!rule) {
        rule = await db.tournamentRule.create({
            data: {
                name: "Default Rule",
                tournament_id: tournamentId,
                is_active: true,
                points_per_win: 3,
                points_per_draw: 1,
                points_per_loss: 0,
                format: SeasonFormat.round_robin_knockout,
                round_robin_stages: 1,
                forfeit_score: 3,
                yellow_cards_suspension: 3,
                suspension_match_count: 1,
                max_players_per_team: 11,
                min_players_per_team: 7,
                teams_advance_per_group: 2,
                fine_per_yellow_card: 0,
                fine_per_red_card: 0,
                bonus_per_goal: 0,
                bonus_per_assist: 0,
                tiebreaker_order: ["goal_diff", "goals_scored", "head_to_head"],
            },
        });
    }

    // FIX: đây là bước bị thiếu — Season tạo ra trước đó không có
    // tournament_rule_id, nên dù rule đã tồn tại trong bảng tournament_rules,
    // season vẫn không "thấy" nó qua relation.
    await db.season.update({
        where: { id: seasonId },
        data: { tournament_rule_id: rule.id },
    });

    console.log(`[TournamentRuleSeeder] Rule #${rule.id} đã gán cho Season #${seasonId}`);
    return { ruleId: rule.id };
}