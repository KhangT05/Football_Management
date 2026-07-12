// prisma/seed/groupPhaseSeeder.ts
import { PhaseType, PhaseFormat } from "../generated/prisma/client.js";
import { GROUP_LETTERS, WORLD_CUP_GROUPS } from "./worldcup.js";
export async function seedGroupStage(db, seasonId, teamIdByName, seasonTeamIdByTeamId) {
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
            },
        });
    }
    const groupIdByLetter = {};
    for (const letter of GROUP_LETTERS) {
        let group = await db.group.findFirst({ where: { phase_id: phase.id, name: `Bảng ${letter}` } });
        if (!group) {
            group = await db.group.create({ data: { phase_id: phase.id, name: `Bảng ${letter}` } });
        }
        groupIdByLetter[letter] = group.id;
        for (const teamName of WORLD_CUP_GROUPS[letter]) {
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
                data: { group_id: group.id },
            });
        }
    }
    console.log(`[GroupPhaseSeeder] Phase #${phase.id} + 8 groups (A-H) đã gán SeasonTeam.group_id`);
    return { groupStagePhaseId: phase.id, groupIdByLetter };
}
//# sourceMappingURL=groupPhaseSeeder.js.map