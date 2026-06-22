import { seedRoles } from "./roleSeeder.js";
import { seedUsers } from "./userSeeder.js";
import { seedVenues } from "./venueSeeder.js";
import { seedTournaments } from "./tournamentSeeder.js";
import { seedSeasons } from "./season.seeder.js";
export async function runSeeders(db) {
    console.log("[DataSeeder] starting...\n");
    // // Tier 0: lookup tables
    const roleMap = await seedRoles(db);
    // // Tier 1: users
    await seedUsers(db, roleMap);
    const adminUser = await db.user.findUniqueOrThrow({ where: { email: "admin@gmail.com" } });
    const adminUserId = adminUser.id;
    // // Tier 1: venues
    await seedVenues(db);
    const firstVenue = await db.venue.findFirstOrThrow({ where: { is_active: true } });
    const defaultVenueId = firstVenue.id;
    // // Tier 2: tournament + season + rule
    const { seasonId, tournamentId } = await seedTournaments(db, adminUserId);
    const tournament = await db.tournament.findFirstOrThrow({ where: { is_active: true } });
    // // Tier 3: teams + players + season registration + payment
    // const teams = await seedTeams(db, adminUserId, seasonId);
    const teamRows = await db.team.findMany({
        where: { is_active: true },
        include: {
            season_teams: { take: 1, orderBy: { created_at: "asc" } },
            team_players: { where: { approval_status: "approved", is_active: true }, select: { player_id: true } },
        },
    });
    const teams = teamRows.map((t) => ({
        teamId: t.id,
        teamName: t.name,
        seasonTeamId: t.season_teams[0]?.id ?? 0,
        playerIds: t.team_players.map((tp) => tp.player_id),
    }));
    // // Tier 4: phases + groups
    // const phaseResult = await seedPhasesAndGroups(db, seasonId, teams);
    // // Tier 5: matches → events → results → standings → player stats
    // await seedMatches(db, seasonId, phaseResult, teams, defaultVenueId, adminUserId);
    // Tier 6: seed seasons để test auto-schedule
    await seedSeasons(db, adminUserId, tournament.id, teams);
    console.log("\n[DataSeeder] done.");
}
//# sourceMappingURL=index.js.map