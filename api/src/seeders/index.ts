import { PrismaClient } from "../generated/prisma/client.js";
import { seedRoles } from "./roleSeeder.js";
import { seedUsers } from "./userSeeder.js";
import { seedVenues } from "./venueSeeder.js";
import { seedTournaments } from "./tournamentSeeder.js";
import { seedTeams } from "./teamSeeder.js";
import { seedPhasesAndGroups } from "./phaseSeeder.js";
import { seedMatches } from "./matchSeeder.js";
import { seedSeasons } from "./season.seeder.js";

export async function runSeeders(db: PrismaClient): Promise<void> {
    console.log("[DataSeeder] starting...\n");

    // Tier 0: lookup tables
    // await seedRoles(db);

    // Tier 1: users + venues
    // await seedUsers(db, roleMap);
    // await seedVenues(db);

    const adminUser = await db.user.findUniqueOrThrow({ where: { email: "admin@gmail.com" } });
    const adminUserId = adminUser.id;

    // const firstVenue = await db.venue.findFirstOrThrow({ where: { is_active: true } });
    // const defaultVenueId = firstVenue.id;

    // Tier 2: tournament + season gốc
    // const { seasonId, tournamentId } = await seedTournaments(db, adminUserId);
    const tournament = await db.tournament.findFirstOrThrow({ where: { is_active: true } });

    // Tier 3: teams
    // const teams = await seedTeams(db, adminUserId, seasonId);
    const teamRows = await db.team.findMany({
        where: { is_active: true },
        include: {
            season_teams: { take: 1, orderBy: { created_at: "asc" } },
            team_players: {
                where: { approval_status: "approved", is_active: true },
                select: { player_id: true },
            },
        },
    });
    const teams = teamRows.map((t) => ({
        teamId: t.id,
        teamName: t.name,
        seasonTeamId: t.season_teams[0]?.id ?? 0,
        playerIds: t.team_players.map((tp) => tp.player_id),
    }));

    // Tier 4: phases + groups
    // const phaseResult = await seedPhasesAndGroups(db, seasonId, teams.map(t => t.teamId));

    // Tier 5: matches
    // await seedMatches(db, seasonId, phaseResult, teams, defaultVenueId, adminUserId);

    // Tier 6: seed seasons để test auto-schedule
    await seedSeasons(db, adminUserId, tournament.id, teams);

    console.log("\n[DataSeeder] done.");
}