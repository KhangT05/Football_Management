import { SeasonFormat } from "../generated/prisma/client.js";
export async function seedWorldCupTournament(db, organizerUserId) {
    const tournament = await db.tournament.upsert({
        where: { name: "FIFA World Cup (Seed Demo)" },
        update: {},
        create: {
            name: "FIFA World Cup (Seed Demo)",
            description: "Dữ liệu demo mô phỏng thể thức World Cup: 8 bảng x 4 đội -> knockout.",
            user_id: organizerUserId,
        },
    });
    const existingRule = await db.tournamentRule.findFirst({
        where: { tournament_id: tournament.id },
    });
    const rule = existingRule ??
        (await db.tournamentRule.create({
            data: {
                name: "World Cup Rule",
                tournament_id: tournament.id,
                user_id: organizerUserId,
                format: SeasonFormat.round_robin_knockout,
                round_robin_stages: 1,
                points_per_win: 3,
                points_per_draw: 1,
                points_per_loss: 0,
                max_players_per_team: 26,
                min_players_per_team: 18,
                teams_advance_per_group: 2, // nhất + nhì mỗi bảng vào knockout
                yellow_cards_suspension: 2,
                suspension_match_count: 1,
                forfeit_score: 3,
                tiebreaker_order: ["goal_diff", "goals_scored", "head_to_head"],
            },
        }));
    console.log(`[TournamentSeeder] Tournament #${tournament.id}, Rule #${rule.id}`);
    return { tournamentId: tournament.id, tournamentRuleId: rule.id };
}
//# sourceMappingURL=tournamentSeeder.js.map