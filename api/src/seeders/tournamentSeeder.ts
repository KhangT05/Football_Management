import { PrismaClient } from "../generated/prisma/client.js";

export async function seedTournaments(
    db: PrismaClient,
    adminUserId: number
): Promise<{ tournamentId: number; seasonId: number }> {
    console.log("[TournamentSeeder] seeding...");

    const tournament = await db.tournament.upsert({
        where: { name: "Giải Bóng Đá Thành Phố 2024" },
        update: {},
        create: {
            name: "Giải Bóng Đá Thành Phố 2024",
            description: "Giải bóng đá thường niên cấp thành phố",
            is_active: true,
            user_id: adminUserId,
        },
    });

    // TournamentRule — 1-1 với tournament
    await db.tournamentRule.upsert({
        where: { tournament_id: tournament.id },
        update: {},
        create: {
            tournament_id: tournament.id,
            user_id: adminUserId,
            points_per_win: 3,
            points_per_draw: 1,
            points_per_loss: 0,
            forfeit_score: 3,
            yellow_cards_suspension: 3,
            max_players_per_team: 20,
            min_players_per_team: 7,
            teams_advance_per_group: 2,
            tiebreaker_order: ["goal_diff", "goals_scored", "head_to_head"],
        },
    });

    const season = await db.season.upsert({
        where: { name: "Mùa Giải 2024" },
        update: {},
        create: {
            name: "Mùa Giải 2024",
            description: "Mùa giải chính thức 2024",
            status: "finished", // seed completed state để test toàn bộ flow
            start_date: new Date("2024-03-01"),
            end_date: new Date("2024-06-30"),
            registration_deadline: new Date("2024-02-15"),
            max_teams: 8,
            is_registration_open: false,
            registration_fee: 5000000, // 5 triệu VND
            tournament_id: tournament.id,
            user_id: adminUserId,
        },
    });

    console.log(`  → Tournament #${tournament.id}, Season #${season.id}`);
    return { tournamentId: tournament.id, seasonId: season.id };
}