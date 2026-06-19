import { PrismaClient } from "../generated/prisma/client.js";
import { seedRoles } from "./roleSeeder.js";
import { seedUsers } from "./userSeeder.js";
import { seedVenues } from "./venueSeeder.js";
import { seedTournaments } from "./tournamentSeeder.js";
import { seedTeams } from "./teamSeeder.js";
import { seedPhasesAndGroups } from "./phaseSeeder.js";
import { seedMatches } from "./matchSeeder.js";

export async function runSeeders(db: PrismaClient): Promise<void> {
    console.log("[DataSeeder] starting...\n");

    // Tier 0: lookup tables
    const roleMap = await seedRoles(db);

    // Tier 1: users — seedUsers return void, query admin sau
    await seedUsers(db, roleMap);
    const adminUser = await db.user.findUniqueOrThrow({ where: { email: "admin@gmail.com" } });
    const adminUserId = adminUser.id;

    // Tier 1: venues — seedVenues return void, query sau
    await seedVenues(db);
    const firstVenue = await db.venue.findFirstOrThrow({ where: { is_active: true } });
    const defaultVenueId = firstVenue.id;

    // Tier 2: tournament + season + rule
    const { seasonId } = await seedTournaments(db, adminUserId);

    // Tier 3: teams + players + season registration + payment
    const teams = await seedTeams(db, adminUserId, seasonId);
    const teamIds = teams.map((t) => t.teamId);

    // Tier 4: phases + groups
    const phaseResult = await seedPhasesAndGroups(db, seasonId, teamIds);

    // Tier 5: matches → events → results → standings → player stats
    await seedMatches(db, seasonId, phaseResult, teams, defaultVenueId, adminUserId);

    console.log("\n[DataSeeder] done.");
}