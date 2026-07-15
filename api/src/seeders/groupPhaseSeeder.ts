import { PhaseType, PhaseFormat, PhaseStatus, SeasonTeamStatus } from "../generated/prisma/client.js";
import type { DbClient } from "./dbTypes.js";
import type { GroupLetter } from "./teamGenerator.js";

export interface GroupPhaseSeedResult {
  groupStagePhaseId: number;
  groupIdByLetter: Record<GroupLetter, number>;
}

export async function seedGroupStage(
  db: DbClient,
  seasonId: number,
  teamIdByName: Record<string, number>,
  seasonTeamIdByTeamId: Record<number, number>,
  groups: Record<GroupLetter, string[]>
): Promise<GroupPhaseSeedResult> {
  let phase = await db.phase.findFirst({
    where: { season_id: seasonId, type: PhaseType.group_stage },
  });

  if (!phase) {
    phase = await db.phase.create({
      data: {
        season_id: seasonId,
        name: "Vòng bảng",
        type: PhaseType.group_stage,
        format: PhaseFormat.round_robin,
        order: 1,
        teams_per_group: 4,
        teams_advance_per_group: 2,
        // FIX: trước đây không set status, phụ thuộc default của schema.
        // GroupService.generateGroupsAndSchedule (ScheduleService) luôn set
        // tường minh in_progress cho phase đã có match thật — seeder đang ở
        // đúng tình huống đó (match được tạo ngay sau bước này trong
        // groupMatchSeeder), nên phải khớp status để FE/GroupService hiểu
        // đây là phase đã "chốt", không phải draft rỗng.
        status: PhaseStatus.in_progress,
      },
    });
  }

  const groupIdByLetter = {} as Record<GroupLetter, number>;
  const letters = Object.keys(groups) as GroupLetter[];

  for (const letter of letters) {
    let group = await db.group.findFirst({ where: { phase_id: phase.id, name: `Bảng ${letter}` } });
    if (!group) {
      group = await db.group.create({
        data: {
          phase_id: phase.id,
          name: `Bảng ${letter}`,
          // FIX: THIẾU is_active — mọi read-path của GroupService
          // (buildGroupsPayload / findAllBySeason / findAllByPhase) đều lọc
          // `where: { phase_id, is_active: true }`. Group tạo ra thiếu field
          // này sẽ không bao giờ hiện trên FE dù group_id đã gán đúng cho
          // season_team (đây chính là lý do "Bảng A..H: Trống" dù standings
          // API vẫn trả dữ liệu — standings query thẳng theo group_id, không
          // qua filter is_active của Group).
          is_active: true,
        },
      });
    }
    groupIdByLetter[letter] = group.id;

    const teamNames = groups[letter];
    if (!teamNames) {
      throw new Error(`groupPhaseSeeder: groups thiếu bảng "${letter}"`);
    }

    for (const teamName of teamNames) {
      const teamId = teamIdByName[teamName];
      if (teamId === undefined) {
        throw new Error(`Không tìm thấy team_id cho đội "${teamName}" (bảng ${letter})`);
      }

      const seasonTeamId = seasonTeamIdByTeamId[teamId];
      if (seasonTeamId === undefined) {
        throw new Error(`Không tìm thấy season_team_id cho team #${teamId} ("${teamName}")`);
      }

      await db.seasonTeam.update({
        where: { id: seasonTeamId },
        data: {
          group_id: group.id,
          // FIX (root cause chính của bug report): buildGroupsPayload lọc
          // season_teams theo status: SeasonTeamStatus.approved VÀ
          // is_active: true. Bản trước chỉ update group_id, giữ nguyên
          // status hiện có của season_team (thực tế đang là "active" —
          // xem network tab: season_team #32 có status "active"). "active"
          // !== "approved" nên GroupService không bao giờ trả đội này về
          // cho FE, dù group_id đã đúng và standings vẫn tính được (path
          // standings không qua status filter này). Set tường minh 2 field
          // ở đây để không phụ thuộc trạng thái season_team được tạo từ
          // bước seed trước đó.
          status: SeasonTeamStatus.approved,
          is_active: true,
        },
      });
    }
  }

  console.log(`[GroupPhaseSeeder] Phase #${phase.id} + ${letters.length} groups đã gán SeasonTeam.group_id`);
  return { groupStagePhaseId: phase.id, groupIdByLetter };
}