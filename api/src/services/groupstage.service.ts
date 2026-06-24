// // test-fixtures/seed-group-stage.fixture.ts
// //
// // THAY THẾ SimulateService + GroupStageRunner.
// // Đây KHÔNG phải production service — là fixture cho e2e test workflow
// // group → bracket → standings → player-stats. Lý do bỏ SimulateService:
// // nó là 1 code path riêng (god-mode) phải giữ đồng bộ tay với
// // MatchLifecycleService/MatchResultService mỗi khi business rule đổi.
// // Driving trực tiếp qua lifecycle methods = chạy đúng code path mà referee
// // thật sẽ chạy, không có gì để giữ đồng bộ.

// import { MatchEventType, MatchPeriod, MatchStatus, PrismaClient } from '../generated/prisma/client.js';
// import { MatchLifecycleService } from '../services/match.service.js';
// import { ConfirmResultOutput } from '../types/matchResult.type.js';
// import { ScheduleOptions } from '../types/schedule.type.js';

// export interface SeedMatchOptions {
//     homePlayerIds: number[];
//     awayPlayerIds: number[];
// }

// export interface RunGroupStageFixtureOptions {
//     seasonId: number;
//     scheduleOptions: ScheduleOptions;
//     /** Provider lấy player_id của 1 team. Mặc định load từ DB (TeamPlayer approved). */
//     playerIdProvider?: (teamId: number) => Promise<number[]>;
// }

// export interface GroupStageFixtureResult {
//     totalMatches: number;
//     finalized: number;
//     failed: { matchId: number; error: string }[];
//     /** Snake-seeded team IDs [1A, 1B, 2A, 2B, ...] — truyền thẳng vào generateKnockoutBracket. */
//     seededTeamIds: number[];
// }

// // ─── Random event generation — giữ nguyên thuật toán cũ, chỉ đổi nơi consume ──────

// /** Poisson random variable dùng Knuth algorithm. λ ≤ ~30 là OK. */
// function poisson(lambda: number): number {
//     const L = Math.exp(-lambda);
//     let k = 0, p = 1;
//     do { k++; p *= Math.random(); } while (p > L);
//     return k - 1;
// }

// /** Trả số thẻ vàng: 0 với p=0.55, 1 với p=0.35, 2 với p=0.1 */
// function binomialCards(): number {
//     const r = Math.random();
//     if (r < 0.55) return 0;
//     if (r < 0.90) return 1;
//     return 2;
// }

// function pick<T>(arr: T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)]!;
// }

// /**
//  * Bơm 1 match từ scheduled → finished bằng cách gọi ĐÚNG lifecycle methods mà
//  * referee app sẽ gọi. Không tự tính score/winner — finalizeMatch tự derive từ
//  * MatchEvent đã ghi.
//  */
// export async function seedMatchWithRandomEvents(
//     lifecycle: MatchLifecycleService,
//     matchId: number,
//     homeTeamId: number,
//     awayTeamId: number,
//     options: SeedMatchOptions,
//     scheduleOptions: ScheduleOptions,
// ): Promise<ConfirmResultOutput> {
//     await lifecycle.startMatch(matchId);

//     const homeGoals = poisson(1.3);
//     const awayGoals = poisson(1.3);
//     const homeYellows = binomialCards();
//     const awayYellows = binomialCards();
//     const homeRed = Math.random() < 0.04;
//     const awayRed = Math.random() < 0.04;

//     await emitGoals(lifecycle, matchId, homeTeamId, options.homePlayerIds, homeGoals);
//     await emitGoals(lifecycle, matchId, awayTeamId, options.awayPlayerIds, awayGoals);
//     await emitCards(lifecycle, matchId, homeTeamId, options.homePlayerIds, homeYellows, homeRed);
//     await emitCards(lifecycle, matchId, awayTeamId, options.awayPlayerIds, awayYellows, awayRed);

//     // transitionPeriod sang second_half trước khi finalize — current_period đang là
//     // first_half từ startMatch, finalizeMatch không tự transition giùm.
//     await lifecycle.transitionPeriod(matchId, MatchPeriod.second_half);

//     return lifecycle.finalizeMatch(matchId, {}, scheduleOptions);
// }

// async function emitGoals(
//     lifecycle: MatchLifecycleService,
//     matchId: number,
//     teamId: number,
//     players: number[],
//     count: number,
// ): Promise<void> {
//     for (let i = 0; i < count; i++) {
//         await lifecycle.recordEvent(matchId, { teamId, type: MatchEventType.goal, playerId: pick(players) });
//     }
// }

// async function emitCards(
//     lifecycle: MatchLifecycleService,
//     matchId: number,
//     teamId: number,
//     players: number[],
//     yellows: number,
//     hasRed: boolean,
// ): Promise<void> {
//     const yellowedPlayers = new Set<number>();

//     for (let i = 0; i < yellows; i++) {
//         const available = players.filter(p => !yellowedPlayers.has(p));
//         if (available.length === 0) break;
//         const player = pick(available);
//         yellowedPlayers.add(player);
//         await lifecycle.recordEvent(matchId, { teamId, type: MatchEventType.yellow_card, playerId: player });
//     }

//     if (hasRed) {
//         const available = players.filter(p => !yellowedPlayers.has(p));
//         const pool = available.length > 0 ? available : players;
//         await lifecycle.recordEvent(matchId, { teamId, type: MatchEventType.red_card, playerId: pick(pool) });
//     }
// }

// // ─── Chạy toàn bộ group stage cho 1 season ────────────────────────────────────────

// export async function runGroupStageFixture(
//     prisma: PrismaClient,
//     lifecycle: MatchLifecycleService,
//     options: RunGroupStageFixtureOptions,
// ): Promise<GroupStageFixtureResult> {
//     const { seasonId, scheduleOptions } = options;

//     const matches = await prisma.match.findMany({
//         where: {
//             season_id: seasonId,
//             group_id: { not: null },
//             status: MatchStatus.scheduled, // fixture chỉ chạy match chưa start — không resume ongoing
//             is_active: true,
//         },
//         select: { id: true, home_team_id: true, away_team_id: true },
//         orderBy: [{ round: 'asc' }, { id: 'asc' }],
//     });

//     if (matches.length === 0)
//         throw new Error(`Season ${seasonId} không có group-stage match 'scheduled' nào để seed`);

//     const playerCache = new Map<number, number[]>();
//     const getPlayers = async (teamId: number): Promise<number[]> => {
//         if (playerCache.has(teamId)) return playerCache.get(teamId)!;
//         let ids: number[];
//         if (options.playerIdProvider) {
//             ids = await options.playerIdProvider(teamId);
//         } else {
//             const rows = await prisma.teamPlayer.findMany({
//                 where: { team_id: teamId, is_active: true, approval_status: 'approved' },
//                 select: { player_id: true },
//             });
//             ids = rows.map(r => r.player_id);
//         }
//         if (ids.length === 0)
//             throw new Error(`Team ${teamId} không có approved player — fixture cần data thật, không dùng dummy`);
//         playerCache.set(teamId, ids);
//         return ids;
//     };

//     const failed: { matchId: number; error: string }[] = [];
//     let finalized = 0;

//     // Sequential — tránh race condition khi 2 match cùng group recompute standings
//     // đồng thời (StandingsService.recomputeGroupStandings không có lock riêng).
//     for (const match of matches) {
//         try {
//             const [homePlayerIds, awayPlayerIds] = await Promise.all([
//                 getPlayers(match.home_team_id),
//                 getPlayers(match.away_team_id),
//             ]);

//             await seedMatchWithRandomEvents(
//                 lifecycle,
//                 match.id,
//                 match.home_team_id,
//                 match.away_team_id,
//                 { homePlayerIds, awayPlayerIds },
//                 scheduleOptions,
//             );
//             finalized++;
//         } catch (err) {
//             const msg = err instanceof Error ? err.message : String(err);
//             failed.push({ matchId: match.id, error: msg });
//             console.error(`[seed-group-stage] Match ${match.id} failed: ${msg}`);
//             // Continue — 1 match fail không nên abort toàn bộ run.
//         }
//     }

//     const seededTeamIds = await resolveSeededTeams(prisma, seasonId);

//     return { totalMatches: matches.length, finalized, failed, seededTeamIds };
// }

// /**
//  * Đọc TournamentRule.teams_advance_per_group, lấy top-N từ mỗi group theo
//  * TeamStanding.position (đã được StandingsService cập nhật sau mỗi finalize).
//  * Snake seeding [1A, 1B, 2A, 2B, ...] để bracket balanced — truyền thẳng vào
//  * generateKnockoutBracket({ seededTeamIds }).
//  */
// async function resolveSeededTeams(prisma: PrismaClient, seasonId: number): Promise<number[]> {
//     const season = await prisma.season.findUnique({
//         where: { id: seasonId },
//         select: { tournament: { select: { tournamentRule: { select: { teams_advance_per_group: true } } } } },
//     });
//     const teamsAdvance = season?.tournament?.tournamentRule?.teams_advance_per_group ?? 2;

//     const groups = await prisma.group.findMany({
//         where: { phase: { season_id: seasonId }, is_active: true },
//         select: {
//             id: true,
//             name: true,
//             teamStandings: {
//                 select: { team_id: true, position: true },
//                 orderBy: { position: 'asc' },
//                 take: teamsAdvance,
//             },
//         },
//         orderBy: { name: 'asc' },
//     });

//     if (groups.length === 0) return [];

//     const seeded: number[] = [];
//     for (let pos = 1; pos <= teamsAdvance; pos++) {
//         for (const group of groups) {
//             const standing = group.teamStandings.find(s => s.position === pos);
//             if (standing) seeded.push(standing.team_id);
//         }
//     }
//     return seeded;
// }