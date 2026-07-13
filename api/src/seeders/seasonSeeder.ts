// prisma/seed/seasonSeeder.ts
import { PrismaClient, JerseyType } from "../generated/prisma/client.js";
import type { VenueSeed } from "./teamGenerator.js";

export interface SeasonSeedResult {
  seasonId: number;
  venueIds: number[];
  seasonTeamIdByTeamId: Record<number, number>;
}

export async function seedVenues(db: PrismaClient, venues: VenueSeed[]): Promise<number[]> {
  if (venues.length === 0) {
    throw new Error("seedVenues: venues rỗng — kiểm tra lại teamGenerator.generateVenues()");
  }

  const ids: number[] = [];
  for (const v of venues) {
    const venue = await db.venue.upsert({
      where: { name: v.name },
      update: {},
      create: { name: v.name, address: v.address },
    });
    ids.push(venue.id);
  }
  console.log(`[SeasonSeeder] seeded ${ids.length} venues`);
  return ids;
}

export async function seedSeason(
  db: PrismaClient,
  tournamentId: number,
  tournamentRuleId: number,
  organizerUserId: number,
  teamIdByName: Record<string, number>,
  venues: VenueSeed[]
): Promise<SeasonSeedResult> {
  const season = await db.season.upsert({
    where: { name: "World Cup Season" },
    update: {},
    create: {
      name: "World Cup Season",
      tournament_id: tournamentId,
      tournament_rule_id: tournamentRuleId,
      user_id: organizerUserId,
      max_teams: 32,
      group_count: 8,
      status: "ongoing",
      is_registration_open: false,
      is_active: true,
    },
  });

  const seasonTeamIdByTeamId: Record<number, number> = {};
  for (const teamId of Object.values(teamIdByName)) {
    const st = await db.seasonTeam.upsert({
      where: { season_id_team_id: { season_id: season.id, team_id: teamId } },
      update: {},
      create: { season_id: season.id, team_id: teamId, status: "active" },
    });
    seasonTeamIdByTeamId[teamId] = st.id;

    await db.seasonTeamJersey.upsert({
      where: { season_team_id_type: { season_team_id: st.id, type: JerseyType.home } },
      update: {},
      create: {
        season_team_id: st.id,
        type: JerseyType.home,
        primary_color: "#FFFFFF",
        secondary_color: "#111111",
      },
    });
    await db.seasonTeamJersey.upsert({
      where: { season_team_id_type: { season_team_id: st.id, type: JerseyType.away } },
      update: {},
      create: {
        season_team_id: st.id,
        type: JerseyType.away,
        primary_color: "#111111",
        secondary_color: "#FFFFFF",
      },
    });
  }

  const venueIds = await seedVenues(db, venues);

  console.log(`[SeasonSeeder] Season #${season.id} với ${Object.keys(seasonTeamIdByTeamId).length} SeasonTeam`);
  return { seasonId: season.id, venueIds, seasonTeamIdByTeamId };
}