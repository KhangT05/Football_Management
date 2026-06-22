// import { createAppError } from '../common/app.error.js';
// import { MatchResultStatus, MatchStatus, PrismaClient, TournamentRule } from '../generated/prisma/client.js';
export {};
// type Acc = { played: number; win: number; draw: number; loss: number; gf: number; ga: number; points: number };
// const emptyAcc = (): Acc => ({ played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, points: 0 });
// interface MatchForStandings {
//     home_team_id: number;
//     away_team_id: number;
//     matchResult: { home_final_score: number; away_final_score: number } | null;
// }
// export class StandingsService {
//     constructor(private readonly prisma: PrismaClient) { }
//     async recomputeGroupStandings(groupId: number): Promise<void> {
//         const lockKey = `standings_${groupId}`;
//         await this.prisma.$executeRaw`SELECT GET_LOCK(${lockKey}, 10)`;
//         try {
//             const group = await this.prisma.group.findUniqueOrThrow({
//                 where: { id: groupId },
//                 include: { phase: { include: { season: { include: { tournament: { include: { tournamentRule: true } } } } } } },
//             });
//             const rule = group.phase.season.tournament.tournamentRule;
//             if (!rule) throw createAppError('NOT_FOUND', 'Thiếu TournamentRule');
//             // status official: loại match đang protested/under_review/overturned-chưa-resolve.
//             // abandoned/cancelled/postponed/scheduled/ongoing không nằm trong [finished, forfeited]
//             // nên tự động bị loại, không cần thêm điều kiện riêng.
//             const matches = (await this.prisma.match.findMany({
//                 where: {
//                     group_id: groupId,
//                     status: { in: [MatchStatus.finished, MatchStatus.forfeited] },
//                     matchResult: { status: MatchResultStatus.official },
//                 },
//                 select: {
//                     home_team_id: true,
//                     away_team_id: true,
//                     matchResult: { select: { home_final_score: true, away_final_score: true } },
//                 },
//             })) as MatchForStandings[];
//             const teamIds = (
//                 await this.prisma.seasonTeam.findMany({
//                     where: { group_id: groupId, status: { not: 'withdrawn' } },
//                     select: { team_id: true },
//                 })
//             ).map(t => t.team_id);
//             const acc = new Map<number, Acc>(teamIds.map(id => [id, emptyAcc()]));
//             for (const m of matches) {
//                 if (!m.matchResult) continue;
//                 this.applyResult(acc, m.home_team_id, m.away_team_id, m.matchResult.home_final_score, m.matchResult.away_final_score, rule);
//             }
//             const ranked = this.rankWithTiebreak([...acc.entries()], rule.tiebreaker_order as string[], matches);
//             await this.prisma.$transaction(
//                 ranked.map(([teamId, s], i) =>
//                     this.prisma.teamStanding.upsert({
//                         where: { group_id_team_id: { group_id: groupId, team_id: teamId } },
//                         update: { ...this.toRow(s), position: i + 1 },
//                         create: { group_id: groupId, team_id: teamId, ...this.toRow(s), position: i + 1 },
//                     }),
//                 ),
//             );
//         } finally {
//             await this.prisma.$executeRaw`SELECT RELEASE_LOCK(${lockKey})`;
//         }
//     }
//     private applyResult(acc: Map<number, Acc>, homeId: number, awayId: number, hs: number, as: number, rule: TournamentRule) {
//         const home = acc.get(homeId);
//         const away = acc.get(awayId);
//         if (!home || !away) return; // team không thuộc group (đã rời/withdrawn) — bỏ qua, không crash cả batch
//         home.played++;
//         away.played++;
//         home.gf += hs;
//         home.ga += as;
//         away.gf += as;
//         away.ga += hs;
//         if (hs > as) {
//             home.win++;
//             away.loss++;
//             home.points += rule.points_per_win;
//             away.points += rule.points_per_loss;
//         } else if (hs < as) {
//             away.win++;
//             home.loss++;
//             away.points += rule.points_per_win;
//             home.points += rule.points_per_loss;
//         } else {
//             home.draw++;
//             away.draw++;
//             home.points += rule.points_per_draw;
//             away.points += rule.points_per_draw;
//         }
//     }
//     private rankWithTiebreak(entries: [number, Acc][], order: string[], matches: MatchForStandings[]): [number, Acc][] {
//         const byPoints = new Map<number, [number, Acc][]>();
//         for (const e of entries) byPoints.set(e[1].points, [...(byPoints.get(e[1].points) ?? []), e]);
//         const result: [number, Acc][] = [];
//         for (const points of [...byPoints.keys()].sort((a, b) => b - a)) {
//             result.push(...this.resolveTieGroup(byPoints.get(points)!, order, matches));
//         }
//         return result;
//     }
//     private resolveTieGroup(group: [number, Acc][], order: string[], matches: MatchForStandings[]): [number, Acc][] {
//         if (group.length === 1) return group;
//         for (const criterion of order) {
//             if (criterion === 'head_to_head') {
//                 const ids = new Set(group.map(([id]) => id));
//                 const subMatches = matches.filter(m => ids.has(m.home_team_id) && ids.has(m.away_team_id) && m.matchResult);
//                 if (subMatches.length === 0) continue;
//                 const mini = new Map<number, Acc>(group.map(([id]) => [id, emptyAcc()]));
//                 const fakeRule = { points_per_win: 3, points_per_draw: 1, points_per_loss: 0 } as TournamentRule;
//                 for (const m of subMatches) {
//                     this.applyResult(mini, m.home_team_id, m.away_team_id, m.matchResult!.home_final_score, m.matchResult!.away_final_score, fakeRule);
//                 }
//                 const sorted = [...group].sort((a, b) => mini.get(b[0])!.points - mini.get(a[0])!.points);
//                 const stillTied = new Set(sorted.map(([id]) => mini.get(id)!.points)).size < sorted.length;
//                 if (!stillTied) return sorted;
//                 continue; // 3-way cycle hoặc mini-league vẫn tie — fallback criterion kế
//             }
//             const sorted = [...group].sort((a, b) => this.compare(b[1], a[1], criterion));
//             const stillTied = sorted.some((s, i) => i > 0 && this.compare(s[1], sorted[i - 1][1], criterion) === 0);
//             if (!stillTied) return sorted;
//         }
//         // Hết criterion vẫn tie (3-way cycle A>B>C>A) — giữ nguyên order input, KHÔNG tự quyết
//         // định thứ tự. TODO: thêm field needs_manual_review trên Group để UI cảnh báo, tránh
//         // âm thầm trả thứ tự sai mà không ai biết.
//         return group;
//     }
//     private compare(a: Acc, b: Acc, criterion: string): number {
//         if (criterion === 'goal_diff') return a.gf - a.ga - (b.gf - b.ga);
//         if (criterion === 'goals_scored') return a.gf - b.gf;
//         return 0;
//     }
//     private toRow(s: Acc) {
//         return {
//             matches_played: s.played,
//             wins: s.win,
//             draws: s.draw,
//             losses: s.loss,
//             goals_for: s.gf,
//             goals_against: s.ga,
//             points: s.points,
//         };
//     }
// }
//# sourceMappingURL=standing.service.js.map