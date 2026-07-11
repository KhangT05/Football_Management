// prisma/seed/teamSeeder.ts
import { PrismaClient } from "../generated/prisma/client.js";
import { atOrThrow } from "./helperSeeder.js";
import { ALL_TEAM_NAMES } from "./worldcup.js";

export interface TeamSeedResult {
  teamIdByName: Record<string, number>;
}

/**
 * Tạo 32 Team (theo ALL_TEAM_NAMES). Nếu đã tồn tại (chạy seed lại) thì tái sử dụng.
 * adminUserId dùng làm user sở hữu Team (Team.user_id).
 */
export async function seedTeams(db: PrismaClient, adminUserId: number): Promise<TeamSeedResult> {
  const teamIdByName: Record<string, number> = {};

  for (const name of ALL_TEAM_NAMES) {
    const team = await db.team.upsert({
      where: { name },
      update: {},
      create: {
        name,
        coach_name: `HLV trưởng ${name}`,
        user_id: adminUserId,
      },
    });
    teamIdByName[name] = team.id;
  }

  console.log(`[TeamSeeder] seeded ${Object.keys(teamIdByName).length} teams`);
  return { teamIdByName };
}

export async function seedTeamLeadersFromExistingUsers(
  db: PrismaClient,
  teamIdByName: Record<string, number>
): Promise<void> {
  const leaderUsers = await db.user.findMany({
    where: { user_roles: { some: { role: { name: "leader" } } } },
    select: { id: true, email: true },
  });

  const teamIds = Object.values(teamIdByName);
  let assigned = 0;

  const pairCount = Math.min(leaderUsers.length, teamIds.length);
  for (let i = 0; i < pairCount; i++) {
    const teamId = atOrThrow(teamIds, i, "seedTeamLeadersFromExistingUsers teamIds");
    const leader = atOrThrow(leaderUsers, i, "seedTeamLeadersFromExistingUsers leaderUsers");

    const exists = await db.teamLeader.findFirst({
      where: { team_id: teamId, user_id: leader.id },
    });
    if (exists) continue;

    await db.teamLeader.create({
      data: { team_id: teamId, user_id: leader.id },
    });
    assigned++;
  }

  console.log(`[TeamSeeder] assigned ${assigned} TeamLeader từ user thật (còn lại chưa có leader)`);
}