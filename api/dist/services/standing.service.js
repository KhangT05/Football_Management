// import { MatchStatus, PrismaClient } from '../generated/prisma/client.js';
export {};
// /**
//  * Nơi DUY NHẤT tính/ghi TeamStanding. Trước đây logic này bị duplicate giữa
//  * MatchLifecycleService (gọi standingsService.recomputeGroupStandings) và
//  * MatchResultService (tự viết lại _recalculateGroupStanding riêng) — 2 bản tiebreaker
//  * có thể drift khi sửa rule. Giờ MatchResultService.confirmResult cũng gọi method này.
//  *
//  * Nếu class StandingsService gốc của bạn đã có method khác tên/signature khác, merge
//  * phần body recomputeGroupStandings dưới đây vào, đừng giữ 2 implementation song song.
//  */
// export class StandingsService {
//     constructor(private readonly prisma: PrismaClient) { }
//     async recomputeGroupStandings(groupId: number): Promise<void> {
//         const group = await this.prisma.group.findUniqueOrThrow({
//             where: { id: groupId },
//             select: {
//                 phase: {
//                     select: {
//                         season: {
//                             select: {
//                                 tournament: {
//                                     select: {
//                                         tournamentRule: {
//                                             select: {
//                                                 points_per_win: true,
//                                                 points_per_draw: true,
//                                                 points_per_loss: true,
//                                                 tiebreaker_order: true,
//                                             },
//                                         },
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         });
//         const rule = group.phase.season?.tournament?.tournamentRule;
//         const pointsWin = rule?.points_per_win ?? 3;
//         const pointsDraw = rule?.points_per_draw ?? 1;
//         const pointsLoss = rule?.points_per_loss ?? 0;
//         const tiebreakerOrder = (rule?.tiebreaker_order as string[]) ?? ['goal_diff', 'goals_scored', 'head_to_head'];
//         // Chỉ tính trên match status=finished — match forfeited/abandoned/under_review
//         // có chính sách riêng (forfeit_score thay vì score thật, under_review bị loại
//         // tạm cho tới khi appeal resolve — xem comment trong fileAppeal).
//         const matches = await this.prisma.match.findMany({
//             where: { group_id: groupId, status: MatchStatus.finished, is_active: true },
//             select: {
//                 id: true,
//                 home_team_id: true,
//                 away_team_id: true,
//                 matchResult: {
//                     select: { home_final_score: true, away_final_score: true, winner_team_id: true, status: true },
//                 },
//             },
//         });
//         const seasonTeams = await this.prisma.seasonTeam.findMany({
//             where: { group_id: groupId },
//             select: { team_id: true },
//         });
//         const teamIds = seasonTeams.map(st => st.team_id);
//         type StandingAccum = {
//             teamId: number;
//             played: number;
//             wins: number;
//             draws: number;
//             losses: number;
//             goalsFor: number;
//             goalsAgainst: number;
//             points: number;
//         };
//         const standings = new Map<number, StandingAccum>(
//             teamIds.map(tid => [tid, {
//                 teamId: tid, played: 0, wins: 0, draws: 0, losses: 0,
//                 goalsFor: 0, goalsAgainst: 0, points: 0,
//             }]),
//         );
//         // under_review/protested bị loại — chỉ tính match có result chính thức.
//         const officialMatches = matches.filter(m => m.matchResult?.status === 'official');
//         for (const m of officialMatches) {
//             const r = m.matchResult!;
//             const home = standings.get(m.home_team_id);
//             const away = standings.get(m.away_team_id);
//             if (!home || !away) continue;
//             const hg = r.home_final_score;
//             const ag = r.away_final_score;
//             home.played++; away.played++;
//             home.goalsFor += hg; home.goalsAgainst += ag;
//             away.goalsFor += ag; away.goalsAgainst += hg;
//             if (hg > ag) {
//                 home.wins++; home.points += pointsWin;
//                 away.losses++; away.points += pointsLoss;
//             } else if (ag > hg) {
//                 away.wins++; away.points += pointsWin;
//                 home.losses++; home.points += pointsLoss;
//             } else {
//                 home.draws++; home.points += pointsDraw;
//                 away.draws++; away.points += pointsDraw;
//             }
//         }
//         // Build head_to_head map nếu cần — O(n²) nhưng group size ≤ 8 nên trivial.
//         const h2h = new Map<string, { goalsFor: number; goalsAgainst: number; points: number }>();
//         if (tiebreakerOrder.includes('head_to_head')) {
//             const k = (a: number, b: number) => `${a}:${b}`;
//             for (const m of officialMatches) {
//                 const r = m.matchResult!;
//                 const hg = r.home_final_score;
//                 const ag = r.away_final_score;
//                 const homeH2H = h2h.get(k(m.home_team_id, m.away_team_id)) ?? { goalsFor: 0, goalsAgainst: 0, points: 0 };
//                 const awayH2H = h2h.get(k(m.away_team_id, m.home_team_id)) ?? { goalsFor: 0, goalsAgainst: 0, points: 0 };
//                 homeH2H.goalsFor += hg; homeH2H.goalsAgainst += ag;
//                 awayH2H.goalsFor += ag; awayH2H.goalsAgainst += hg;
//                 if (hg > ag) homeH2H.points += pointsWin;
//                 else if (ag > hg) awayH2H.points += pointsWin;
//                 else { homeH2H.points += pointsDraw; awayH2H.points += pointsDraw; }
//                 h2h.set(k(m.home_team_id, m.away_team_id), homeH2H);
//                 h2h.set(k(m.away_team_id, m.home_team_id), awayH2H);
//             }
//         }
//         const sorted = [...standings.values()].sort((a, b) => {
//             if (b.points !== a.points) return b.points - a.points;
//             for (const criterion of tiebreakerOrder) {
//                 switch (criterion) {
//                     case 'goal_diff': {
//                         const diff = (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
//                         if (diff !== 0) return diff;
//                         break;
//                     }
//                     case 'goals_scored': {
//                         const diff = b.goalsFor - a.goalsFor;
//                         if (diff !== 0) return diff;
//                         break;
//                     }
//                     case 'head_to_head': {
//                         const aH2H = h2h.get(`${a.teamId}:${b.teamId}`);
//                         const bH2H = h2h.get(`${b.teamId}:${a.teamId}`);
//                         const ptsDiff = (bH2H?.points ?? 0) - (aH2H?.points ?? 0);
//                         if (ptsDiff !== 0) return ptsDiff;
//                         const gdDiff = ((bH2H?.goalsFor ?? 0) - (bH2H?.goalsAgainst ?? 0))
//                             - ((aH2H?.goalsFor ?? 0) - (aH2H?.goalsAgainst ?? 0));
//                         if (gdDiff !== 0) return gdDiff;
//                         break;
//                     }
//                 }
//             }
//             return 0; // vẫn bằng nhau → giữ nguyên thứ tự (draw lot ngoài system)
//         });
//         // MySQL không có createMany + update nên dùng upsert theo unique(group_id, team_id).
//         await this.prisma.$transaction(
//             sorted.map((s, idx) =>
//                 this.prisma.teamStanding.upsert({
//                     where: { group_id_team_id: { group_id: groupId, team_id: s.teamId } },
//                     create: {
//                         group_id: groupId,
//                         team_id: s.teamId,
//                         position: idx + 1,
//                         matches_played: s.played,
//                         wins: s.wins,
//                         draws: s.draws,
//                         losses: s.losses,
//                         goals_for: s.goalsFor,
//                         goals_against: s.goalsAgainst,
//                         points: s.points,
//                     },
//                     update: {
//                         position: idx + 1,
//                         matches_played: s.played,
//                         wins: s.wins,
//                         draws: s.draws,
//                         losses: s.losses,
//                         goals_for: s.goalsFor,
//                         goals_against: s.goalsAgainst,
//                         points: s.points,
//                     },
//                 }),
//             ),
//         );
//     }
// }
//# sourceMappingURL=standing.service.js.map