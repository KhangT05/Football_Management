import { PrismaClient } from "../generated/prisma/client.js";

export interface PhaseGroupResult {
    groupStagePhaseId: number;
    knockoutPhaseIds: { [key: string]: number }; // e.g. { quarter_final: 1, semi_final: 2, ... }
    groupIds: [number, number]; // [groupA_id, groupB_id]
}

export async function seedPhasesAndGroups(
    db: PrismaClient,
    seasonId: number,
    teamIds: number[] // 8 teams
): Promise<PhaseGroupResult> {
    console.log("[PhaseSeeder] seeding phases & groups...");

    // Phase 1: Group Stage (round_robin)
    let groupStagePhase = await db.phase.findFirst({
        where: { season_id: seasonId, type: "group_stage" },
    });
    if (!groupStagePhase) {
        groupStagePhase = await db.phase.create({
            data: {
                season_id: seasonId,
                name: "Vòng Bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                start_date: new Date("2024-03-01"),
                end_date: new Date("2024-04-15"),
                is_active: true,
            },
        });
    }

    // Knockout phases
    const knockoutDefs = [
        { type: "quarter_final", name: "Tứ Kết", order: 2, start: "2024-04-20", end: "2024-04-30" },
        { type: "semi_final", name: "Bán Kết", order: 3, start: "2024-05-05", end: "2024-05-15" },
        { type: "third_place", name: "Tranh Hạng Ba", order: 4, start: "2024-06-25", end: "2024-06-25" },
        { type: "final", name: "Chung Kết", order: 5, start: "2024-06-30", end: "2024-06-30" },
    ] as const;

    const knockoutPhaseIds: { [key: string]: number } = {};
    for (const def of knockoutDefs) {
        let phase = await db.phase.findFirst({
            where: { season_id: seasonId, type: def.type },
        });
        if (!phase) {
            phase = await db.phase.create({
                data: {
                    season_id: seasonId,
                    name: def.name,
                    type: def.type,
                    format: "knockout",
                    order: def.order,
                    start_date: new Date(def.start),
                    end_date: new Date(def.end),
                    is_active: true,
                },
            });
        }
        knockoutPhaseIds[def.type] = phase.id;
    }

    // Groups: A (4 teams) + B (4 teams)
    let groupA = await db.group.findFirst({
        where: { phase_id: groupStagePhase.id, name: "Bảng A" },
    });
    if (!groupA) {
        groupA = await db.group.create({
            data: { phase_id: groupStagePhase.id, name: "Bảng A", is_active: true },
        });
    }

    let groupB = await db.group.findFirst({
        where: { phase_id: groupStagePhase.id, name: "Bảng B" },
    });
    if (!groupB) {
        groupB = await db.group.create({
            data: { phase_id: groupStagePhase.id, name: "Bảng B", is_active: true },
        });
    }

    // Assign teams to groups: 0-3 → A, 4-7 → B
    const groupAssignments = [
        { groupId: groupA.id, ids: teamIds.slice(0, 4) },
        { groupId: groupB.id, ids: teamIds.slice(4, 8) },
    ];

    for (const { groupId, ids } of groupAssignments) {
        for (const teamId of ids) {
            const exists = await db.groupTeam.findUnique({
                where: { group_id_team_id: { group_id: groupId, team_id: teamId } },
            });
            if (!exists) {
                await db.groupTeam.create({ data: { group_id: groupId, team_id: teamId } });
            }
        }
    }

    // Update SeasonTeam.group_id
    for (const { groupId, ids } of groupAssignments) {
        await db.seasonTeam.updateMany({
            where: { season_id: seasonId, team_id: { in: ids } },
            data: { group_id: groupId },
        });
    }

    // Init TeamStandings
    const allGroupAssignments = [
        ...teamIds.slice(0, 4).map((tid) => ({ teamId: tid, groupId: groupA!.id })),
        ...teamIds.slice(4, 8).map((tid) => ({ teamId: tid, groupId: groupB!.id })),
    ];
    for (const { teamId, groupId } of allGroupAssignments) {
        const exists = await db.teamStanding.findUnique({
            where: { group_id_team_id: { group_id: groupId, team_id: teamId } },
        });
        if (!exists) {
            await db.teamStanding.create({
                data: {
                    team_id: teamId,
                    group_id: groupId,
                    position: 0,
                    matches_played: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goals_for: 0,
                    goals_against: 0,
                    points: 0,
                },
            });
        }
    }

    console.log(
        `  → GroupStage #${groupStagePhase.id} | GroupA #${groupA.id} | GroupB #${groupB.id}`
    );
    console.log(`  → Knockout phases:`, knockoutPhaseIds);

    return {
        groupStagePhaseId: groupStagePhase.id,
        knockoutPhaseIds,
        groupIds: [groupA.id, groupB.id],
    };
}