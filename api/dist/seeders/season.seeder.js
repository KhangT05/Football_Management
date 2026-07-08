// // ============================================================
// // CONFIG
// // ============================================================
export {};
// import { PrismaClient } from "../generated/prisma/client.js";
// import { TeamSeedResult } from "./teamSeeder.js";
// interface SeasonScenario {
//     name: string;
//     description: string;
//     /** index vào allTeams[] (0-based). undefined = lấy tất cả */
//     teamIndices?: number[];
// }
// // ============================================================
// // SCENARIOS
// // ============================================================
// const SCENARIOS: SeasonScenario[] = [
//     {
//         name: "AutoSched Test 01 — 8 teams single group",
//         description: "Baseline: 1 group tất cả 8 teams, round-robin",
//     },
//     {
//         name: "AutoSched Test 02 — 8 teams, rest=1",
//         description: "Stress test scheduling gap: min rest 1 ngày",
//     },
//     {
//         name: "AutoSched Test 03 — 2 groups × 4 teams",
//         description: "Standard tournament layout",
//     },
//     {
//         name: "AutoSched Test 04 — 2 groups + semi + final",
//         description: "Multi-phase: group → semi_final → final",
//     },
//     {
//         name: "AutoSched Test 05 — 5 teams (odd, bye)",
//         description: "Edge: số lẻ → mỗi lượt 1 team bye",
//         teamIndices: [0, 1, 2, 3, 4],
//     },
//     {
//         name: "AutoSched Test 06 — 7 teams (odd, bye)",
//         description: "Edge: 7 teams → 1 bye mỗi vòng",
//         teamIndices: [0, 1, 2, 3, 4, 5, 6],
//     },
//     {
//         name: "AutoSched Test 07 — 4+3 teams",
//         description: "Edge: group B chỉ có 3 team → bye trong B",
//     },
//     {
//         name: "AutoSched Test 08 — 5+3 teams",
//         description: "Edge: cả hai group đều lẻ",
//     },
//     {
//         name: "AutoSched Test 09 — 4 groups × 2 teams",
//         description: "Minimal group: chỉ 1 trận mỗi group",
//     },
//     {
//         name: "AutoSched Test 10 — 8 teams, rest=7",
//         description: "Rest constraint cực cao → scheduler phải spread dài",
//     },
// ];
// // ============================================================
// // SEEDER
// // ============================================================
// export async function seedSeasons(
//     db: PrismaClient,
//     adminUserId: number,
//     tournamentId: number,
//     allTeams: TeamSeedResult[]
// ): Promise<void> {
//     console.log(`[SeasonSeeder] seeding ${SCENARIOS.length} seasons...`);
//     const baseDate = new Date("2025-03-01");
//     for (let si = 0; si < SCENARIOS.length; si++) {
//         const scenario = SCENARIOS[si]!;
//         const offsetMonths = si * 3;
//         const startDate = addMonths(baseDate, offsetMonths);
//         const endDate = addMonths(startDate, 2);
//         const existingSeason = await db.season.findFirst({
//             where: { name: scenario.name },
//         });
//         if (existingSeason) {
//             console.log(`  → Skip "${scenario.name}" (exists)`);
//             continue;
//         }
//         const season = await db.season.create({
//             data: {
//                 name: scenario.name,
//                 description: scenario.description,
//                 status: "upcoming",
//                 start_date: startDate,
//                 end_date: endDate,
//                 registration_deadline: addDays(startDate, -7),
//                 max_teams: 16,
//                 is_registration_open: false,
//                 is_active: true,
//                 tournament_id: tournamentId,
//                 user_id: adminUserId,
//             },
//         });
//         const teamIndices = scenario.teamIndices ?? allTeams.map((_, i) => i);
//         await registerTeamsToSeason(db, season.id, teamIndices, allTeams, adminUserId);
//         console.log(
//             `  ✓ "${scenario.name}" | season #${season.id} | ${teamIndices.length} teams`
//         );
//     }
//     console.log("[SeasonSeeder] done.");
// }
// // ============================================================
// // HELPERS
// // ============================================================
// async function registerTeamsToSeason(
//     db: PrismaClient,
//     seasonId: number,
//     teamIndices: number[],
//     allTeams: TeamSeedResult[],
//     adminUserId: number
// ): Promise<void> {
//     for (const idx of teamIndices) {
//         const teamResult = allTeams[idx];
//         if (!teamResult) {
//             console.warn(`  ⚠ teamIndices[${idx}] out of range, skip`);
//             continue;
//         }
//         await db.seasonTeam.upsert({
//             where: {
//                 season_id_team_id: {
//                     season_id: seasonId,
//                     team_id: teamResult.teamId,
//                 },
//             },
//             update: {},
//             create: {
//                 season_id: seasonId,
//                 team_id: teamResult.teamId,
//                 status: "active",
//                 is_active: true,
//                 user_id: adminUserId,
//             },
//         });
//     }
// }
// function addDays(date: Date, days: number): Date {
//     const d = new Date(date);
//     d.setDate(d.getDate() + days);
//     return d;
// }
// function addMonths(date: Date, months: number): Date {
//     const d = new Date(date);
//     d.setMonth(d.getMonth() + months);
//     return d;
// }
//# sourceMappingURL=season.seeder.js.map