// ============================================================
// CONFIG
// ============================================================
// ============================================================
// SCENARIOS
// ============================================================
// allTeams có 8 teams (index 0..7)
const SCENARIOS = [
    // ── Scenario 1: 1 group × 8 teams ─────────────────────────
    {
        name: "Season Test 01 — 8 teams single group",
        description: "Baseline: 1 group tất cả 8 teams, round-robin",
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 3,
                groups: [{ name: "Bảng A", teamIndices: [0, 1, 2, 3, 4, 5, 6, 7] }],
            },
        ],
    },
    // ── Scenario 2: 1 group × 8 teams, rest day khác ──────────
    {
        name: "Season Test 02 — 8 teams single group, rest=1",
        description: "Stress test scheduling gap: min rest 1 ngày",
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 1,
                groups: [{ name: "Bảng A", teamIndices: [0, 1, 2, 3, 4, 5, 6, 7] }],
            },
        ],
    },
    // ── Scenario 3: 2 groups × 4 teams ────────────────────────
    {
        name: "Season Test 03 — 2 groups × 4 teams",
        description: "Standard tournament layout",
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 3,
                groups: [
                    { name: "Bảng A", teamIndices: [0, 1, 2, 3] },
                    { name: "Bảng B", teamIndices: [4, 5, 6, 7] },
                ],
            },
        ],
    },
    // ── Scenario 4: 2 groups × 4 teams + knockout phase ────────
    {
        name: "Season Test 04 — 2 groups + semi + final",
        description: "Multi-phase: group → semi_final → final",
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 3,
                groups: [
                    { name: "Bảng A", teamIndices: [0, 1, 2, 3] },
                    { name: "Bảng B", teamIndices: [4, 5, 6, 7] },
                ],
            },
            {
                name: "Bán kết",
                type: "semi_final",
                format: "knockout",
                order: 2,
                minRestDays: 3,
            },
            {
                name: "Chung kết",
                type: "final",
                format: "knockout",
                order: 3,
                minRestDays: 3,
            },
        ],
    },
    // ── Scenario 5: 5 teams — odd, bye case ───────────────────
    {
        name: "Season Test 05 — 5 teams (odd, bye expected)",
        description: "Edge: số lẻ → mỗi lượt 1 team bye",
        teamIndices: [0, 1, 2, 3, 4],
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 3,
                groups: [{ name: "Bảng A", teamIndices: [0, 1, 2, 3, 4] }],
            },
        ],
    },
    // ── Scenario 6: 7 teams — odd, bye case ───────────────────
    {
        name: "Season Test 06 — 7 teams (odd, bye expected)",
        description: "Edge: 7 teams → 1 bye mỗi vòng",
        teamIndices: [0, 1, 2, 3, 4, 5, 6],
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 3,
                groups: [{ name: "Bảng A", teamIndices: [0, 1, 2, 3, 4, 5, 6] }],
            },
        ],
    },
    // ── Scenario 7: mixed odd — 4 + 3 ────────────────────────
    {
        name: "Season Test 07 — 2 groups: 4 teams + 3 teams",
        description: "Edge: group B chỉ có 3 team → bye trong B",
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 3,
                groups: [
                    { name: "Bảng A", teamIndices: [0, 1, 2, 3] },
                    { name: "Bảng B", teamIndices: [4, 5, 6] },
                ],
            },
        ],
    },
    // ── Scenario 8: 5 + 3 ────────────────────────────────────
    {
        name: "Season Test 08 — 2 groups: 5 teams + 3 teams",
        description: "Edge: cả hai group đều lẻ",
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 3,
                groups: [
                    { name: "Bảng A", teamIndices: [0, 1, 2, 3, 4] },
                    { name: "Bảng B", teamIndices: [5, 6, 7] },
                ],
            },
        ],
    },
    // ── Scenario 9: 4 groups × 2 teams — minimal ─────────────
    {
        name: "Season Test 09 — 4 groups × 2 teams",
        description: "Minimal group: chỉ 1 trận mỗi group",
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 3,
                groups: [
                    { name: "Bảng A", teamIndices: [0, 1] },
                    { name: "Bảng B", teamIndices: [2, 3] },
                    { name: "Bảng C", teamIndices: [4, 5] },
                    { name: "Bảng D", teamIndices: [6, 7] },
                ],
            },
        ],
    },
    // ── Scenario 10: 1 group × 8, rest=7 — conservative ──────
    {
        name: "Season Test 10 — 8 teams, rest=7 days",
        description: "Rest constraint cực cao → scheduler phải spread dài",
        phases: [
            {
                name: "Vòng bảng",
                type: "group_stage",
                format: "round_robin",
                order: 1,
                minRestDays: 7,
                groups: [{ name: "Bảng A", teamIndices: [0, 1, 2, 3, 4, 5, 6, 7] }],
            },
        ],
    },
];
// ============================================================
// SEEDER
// ============================================================
export async function seedSeasons(db, adminUserId, tournamentId, allTeams) {
    console.log(`[SeasonSeeder] seeding ${SCENARIOS.length} seasons...`);
    const baseDate = new Date("2025-03-01");
    for (let si = 0; si < SCENARIOS.length; si++) {
        const scenario = SCENARIOS[si];
        // Tính start/end theo thứ tự season để không overlap
        const offsetMonths = si * 3;
        const startDate = addMonths(baseDate, offsetMonths);
        const endDate = addMonths(startDate, 2);
        // ── Season ──────────────────────────────────────────────
        const existingSeason = await db.season.findFirst({
            where: { name: scenario.name },
        });
        if (existingSeason) {
            console.log(`  → Skip "${scenario.name}" (exists)`);
            continue;
        }
        const season = await db.season.create({
            data: {
                name: scenario.name,
                description: scenario.description,
                status: "upcoming",
                start_date: startDate,
                end_date: endDate,
                registration_deadline: addDays(startDate, -7),
                max_teams: 16,
                is_registration_open: false,
                is_active: true,
                tournament_id: tournamentId,
                user_id: adminUserId,
            },
        });
        // ── Resolve teams cho season này ────────────────────────
        const teamIndices = scenario.teamIndices ?? allTeams.map((_, i) => i);
        const seasonTeams = await registerTeamsToSeason(db, season.id, teamIndices, allTeams, adminUserId);
        // Map: originalIndex → seasonTeamId
        const indexToSeasonTeamId = new Map(teamIndices.map((origIdx, pos) => [origIdx, seasonTeams[pos].id]));
        // ── Phases + Groups ──────────────────────────────────────
        for (const phaseConfig of scenario.phases) {
            const phase = await db.phase.create({
                data: {
                    season_id: season.id,
                    name: phaseConfig.name,
                    type: phaseConfig.type,
                    format: phaseConfig.format,
                    order: phaseConfig.order,
                    start_date: startDate,
                    end_date: endDate,
                    min_rest_days_per_team: phaseConfig.minRestDays ?? 3,
                    is_active: true,
                    status: "draft",
                },
            });
            if (phaseConfig.format === "round_robin" && phaseConfig.groups) {
                for (const groupConfig of phaseConfig.groups) {
                    const group = await db.group.create({
                        data: {
                            phase_id: phase.id,
                            name: groupConfig.name,
                            is_active: true,
                            status: "DRAFT",
                        },
                    });
                    // Assign teams vào group: update SeasonTeam.group_id
                    const seasonTeamIds = groupConfig.teamIndices
                        .map((origIdx) => indexToSeasonTeamId.get(origIdx))
                        .filter((id) => id !== undefined);
                    if (seasonTeamIds.length !== groupConfig.teamIndices.length) {
                        console.warn(`  ⚠ Group "${groupConfig.name}" in "${scenario.name}": some team indices out of range`);
                    }
                    await db.seasonTeam.updateMany({
                        where: { id: { in: seasonTeamIds } },
                        data: { group_id: group.id },
                    });
                    console.log(`    Group "${groupConfig.name}" → ${seasonTeamIds.length} teams (ids: ${seasonTeamIds.join(", ")})`);
                }
            }
        }
        console.log(`  ✓ "${scenario.name}" | season #${season.id} | ${teamIndices.length} teams | ${scenario.phases.length} phases`);
    }
    console.log("[SeasonSeeder] done.");
}
// ============================================================
// HELPERS
// ============================================================
async function registerTeamsToSeason(db, seasonId, teamIndices, allTeams, adminUserId) {
    const result = [];
    for (const idx of teamIndices) {
        const teamResult = allTeams[idx];
        if (!teamResult) {
            console.warn(`  ⚠ teamIndices[${idx}] out of range, skip`);
            continue;
        }
        const st = await db.seasonTeam.upsert({
            where: {
                season_id_team_id: {
                    season_id: seasonId,
                    team_id: teamResult.teamId,
                },
            },
            update: {},
            create: {
                season_id: seasonId,
                team_id: teamResult.teamId,
                status: "active",
                is_active: true,
                user_id: adminUserId,
            },
        });
        result.push({ id: st.id });
    }
    return result;
}
function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}
function addMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}
//# sourceMappingURL=season.seeder.js.map