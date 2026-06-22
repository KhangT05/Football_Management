// import { createAppError } from '../common/app.error.js';
// import {
//     CardColor,
//     Match,
//     MatchEventType,
//     MatchPeriod,
//     MatchResultStatus,
//     MatchResultType,
//     MatchStatus,
//     PhaseFormat,
//     Prisma,
//     PrismaClient,
// } from '../generated/prisma/client.js';
// import { StandingsService } from './standing.service.js';
export {};
// // Chưa tách vào types/ — đưa qua match.type.ts nếu controller cần reuse.
// export interface RecordEventInput {
//     playerId?: number;
//     teamId?: number;
//     type: MatchEventType;
//     minute?: number;
//     addedMinute?: number;
//     note?: string;
//     subOutPlayerId?: number;
//     // BẮT BUỘC khi type === 'goal_disallowed' và bàn bị huỷ ban đầu là own_goal — chỉ
//     // teamId không đủ phân biệt hướng cộng/trừ. MatchEvent không có field
//     // `voided_event_id` (self-ref) để tự suy ra bàn nào đang bị huỷ, nên phải để caller
//     // khai báo rõ. Nên thêm voided_event_id vào schema nếu dùng tính năng này thường xuyên.
//     wasOwnGoal?: boolean;
// }
// export interface FinalizeMatchInput {
//     resultType?: MatchResultType; // default 'full_time'
//     homePenaltyScore?: number;
//     awayPenaltyScore?: number;
//     // TODO: home_extra_time_score/away_extra_time_score (có sẵn trên MatchResult) chưa
//     // nhận input ở đây — nếu UI cần breakdown riêng hiệp phụ khác với home_score/away_score
//     // cumulative qua recordEvent, bổ sung field + logic cộng dồn riêng.
// }
// export interface ResolveAppealInput {
//     resolution: 'uphold' | 'overturn';
//     newHomeScore?: number; // bắt buộc nếu resolution = 'overturn'
//     newAwayScore?: number;
//     note: string;
// }
// const PERIOD_TRANSITIONS: Record<MatchPeriod, MatchPeriod[]> = {
//     first_half: [MatchPeriod.second_half],
//     second_half: [MatchPeriod.extra_time_first, MatchPeriod.penalty_shootout],
//     extra_time_first: [MatchPeriod.extra_time_second],
//     extra_time_second: [MatchPeriod.penalty_shootout],
//     penalty_shootout: [],
// };
// export class MatchLifecycleService {
//     constructor(
//         private readonly prisma: PrismaClient,
//         private readonly standingsService: StandingsService,
//     ) { }
//     async startMatch(matchId: number): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({ where: { id: matchId } });
//         if (match.status !== MatchStatus.scheduled)
//             throw createAppError('CONFLICT', `Match ${matchId} đang ở '${match.status}' — chỉ start từ 'scheduled'`);
//         // KHÔNG check "thiếu team": home_team_id/away_team_id là Int NOT NULL trong schema
//         // hiện tại, match không thể tồn tại với 1 slot rỗng. Nếu sau này migrate 2 cột này
//         // thành Int? (cần cho knockout placeholder bracket), phải thêm lại check này.
//         await this.prisma.match.update({
//             where: { id: matchId },
//             data: {
//                 status: MatchStatus.ongoing,
//                 current_period: MatchPeriod.first_half,
//                 // home_score/away_score là Int? KHÔNG có @default — PHẢI init ở đây.
//                 // Nếu để null, recordEvent dùng { increment: 1 } trên cột NULL ra NULL
//                 // (SQL: NULL + 1 = NULL) — không throw, không tăng, silent data corruption.
//                 home_score: 0,
//                 away_score: 0,
//             },
//         });
//     }
//     async transitionPeriod(matchId: number, period: MatchPeriod): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({ where: { id: matchId } });
//         if (match.status !== MatchStatus.ongoing)
//             throw createAppError('CONFLICT', `Match ${matchId} không ongoing — không đổi period`);
//         const current = match.current_period;
//         if (!current || !PERIOD_TRANSITIONS[current].includes(period))
//             throw createAppError('CONFLICT', `Không thể chuyển period '${current}' -> '${period}'`);
//         await this.prisma.match.update({ where: { id: matchId }, data: { current_period: period } });
//     }
//     async recordEvent(matchId: number, input: RecordEventInput): Promise<void> {
//         await this.prisma.$transaction(async tx => {
//             const match = await tx.match.findUniqueOrThrow({ where: { id: matchId } });
//             if (match.status !== MatchStatus.ongoing)
//                 throw createAppError('CONFLICT', `Match ${matchId} không ở trạng thái ongoing`);
//             if (match.home_score === null || match.away_score === null)
//                 // Không nên xảy ra nếu startMatch luôn init — fail loud thay vì increment NULL âm thầm.
//                 throw createAppError('CONFLICT', `Match ${matchId} chưa init score — gọi lại startMatch`);
//             await tx.matchEvent.create({
//                 data: {
//                     match_id: matchId,
//                     player_id: input.playerId,
//                     team_id: input.teamId,
//                     type: input.type,
//                     minute: input.minute,
//                     added_minute: input.addedMinute,
//                     period: match.current_period ?? undefined,
//                     note: input.note,
//                     card_color:
//                         input.type === MatchEventType.yellow_card || input.type === MatchEventType.second_yellow
//                             ? CardColor.yellow
//                             : input.type === MatchEventType.red_card
//                                 ? CardColor.red
//                                 : undefined,
//                     sub_out_player_id: input.subOutPlayerId,
//                 },
//             });
//             await this.applyScoreDelta(tx, match, input);
//             // card_rescinded chỉ xử lý yellow ở đây — accumulated_yellow_cards/is_suspended
//             // chỉ có counter cho yellow. Red card rescind không có suspension-threshold system
//             // trong schema hiện tại (PlayerStatistic.red_cards chỉ là counter thuần, không gắn rule).
//             if (input.type === MatchEventType.yellow_card && input.playerId && match.season_id) {
//                 await this.bumpAccumulatedCards(tx, input.playerId, match.season_id, 1);
//             }
//             if (input.type === MatchEventType.card_rescinded && input.playerId && match.season_id) {
//                 await this.bumpAccumulatedCards(tx, input.playerId, match.season_id, -1);
//             }
//         });
//     }
//     private async applyScoreDelta(tx: Prisma.TransactionClient, match: Match, input: RecordEventInput) {
//         if (!input.teamId) return;
//         const incrementTypes: MatchEventType[] = [
//             MatchEventType.goal,
//             MatchEventType.own_goal,
//             MatchEventType.penalty_scored,
//         ];
//         const decrementTypes: MatchEventType[] = [MatchEventType.goal_disallowed];
//         let delta: number;
//         let scoringForHome: boolean;
//         if (incrementTypes.includes(input.type)) {
//             delta = 1;
//             scoringForHome =
//                 input.type === MatchEventType.own_goal
//                     ? input.teamId !== match.home_team_id
//                     : input.teamId === match.home_team_id;
//         } else if (decrementTypes.includes(input.type)) {
//             delta = -1;
//             scoringForHome = input.wasOwnGoal
//                 ? input.teamId !== match.home_team_id
//                 : input.teamId === match.home_team_id;
//         } else {
//             return;
//         }
//         await tx.match.update({
//             where: { id: match.id },
//             data: scoringForHome ? { home_score: { increment: delta } } : { away_score: { increment: delta } },
//         });
//     }
//     async finalizeMatch(matchId: number, input: FinalizeMatchInput = {}): Promise<void> {
//         const resultType = input.resultType ?? MatchResultType.full_time;
//         const match = await this.prisma.match.findUniqueOrThrow({
//             where: { id: matchId },
//             include: { phase: true },
//         });
//         if (match.status !== MatchStatus.ongoing)
//             throw createAppError('CONFLICT', `Match ${matchId} không ở trạng thái ongoing`);
//         const homeScore = match.home_score ?? 0;
//         const awayScore = match.away_score ?? 0;
//         const isDraw = homeScore === awayScore;
//         if (isDraw && match.phase.format === PhaseFormat.knockout && resultType === MatchResultType.full_time)
//             throw createAppError(
//                 'CONFLICT',
//                 `Match ${matchId} hoà ${homeScore}-${awayScore} ở knockout — cần extra_time/penalty trước, không finalize trực tiếp`,
//             );
//         let winnerTeamId: number | null;
//         if (resultType === MatchResultType.penalty) {
//             if (input.homePenaltyScore === undefined || input.awayPenaltyScore === undefined)
//                 throw createAppError('VALIDATION_ERROR', 'Thiếu homePenaltyScore/awayPenaltyScore cho resultType penalty');
//             // Penalty không có hoà. home_final_score/away_final_score giữ score chính thức
//             // (90'/120'), điểm luật penalty chỉ quyết winner — không cộng vào goal_for/
//             // goal_against của standings (penalty shootout không tính goal difference).
//             winnerTeamId = input.homePenaltyScore > input.awayPenaltyScore ? match.home_team_id : match.away_team_id;
//         } else {
//             winnerTeamId = isDraw ? null : homeScore > awayScore ? match.home_team_id : match.away_team_id;
//         }
//         await this.prisma.$transaction(async tx => {
//             await tx.match.update({
//                 where: { id: matchId },
//                 data: { status: MatchStatus.finished, played_at: new Date() },
//             });
//             await tx.matchResult.create({
//                 data: {
//                     match_id: matchId,
//                     winner_team_id: winnerTeamId,
//                     home_score: homeScore,
//                     away_score: awayScore,
//                     home_final_score: homeScore,
//                     away_final_score: awayScore,
//                     home_penalty_score: input.homePenaltyScore,
//                     away_penalty_score: input.awayPenaltyScore,
//                     result_type: resultType,
//                     status: MatchResultStatus.official,
//                 },
//             });
//             // BLOCKED: advanceWinner (ghi winner vào match.next_match_id) đáng lẽ ở đây.
//             // home_team_id/away_team_id NOT NULL trong schema hiện tại -> không thể tạo
//             // match round sau với 1 slot rỗng để fill dần. Cần quyết định migrate nullable
//             // hoặc đổi sang lazy-create bracket trước khi implement — xem note đầu file.
//         });
//         if (match.group_id) await this.standingsService.recomputeGroupStandings(match.group_id);
//     }
//     async forfeitMatch(matchId: number, forfeitingTeamId: number): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({
//             where: { id: matchId },
//             include: { season: { include: { tournament: { include: { tournamentRule: true } } } } },
//         });
//         if (match.status === MatchStatus.finished)
//             throw createAppError('CONFLICT', `Match ${matchId} đã finished — không forfeit được`);
//         if (!match.season)
//             throw createAppError('NOT_FOUND', `Match ${matchId} thiếu season_id — không lấy được TournamentRule`);
//         const rule = match.season.tournament.tournamentRule;
//         if (!rule) throw createAppError('NOT_FOUND', 'Thiếu TournamentRule cho tournament này');
//         if (forfeitingTeamId !== match.home_team_id && forfeitingTeamId !== match.away_team_id)
//             throw createAppError('VALIDATION_ERROR', `Team ${forfeitingTeamId} không thuộc match ${matchId}`);
//         const winnerTeamId = forfeitingTeamId === match.home_team_id ? match.away_team_id : match.home_team_id;
//         const winnerIsHome = winnerTeamId === match.home_team_id;
//         const winScore = rule.forfeit_score;
//         const loseScore = 0;
//         await this.prisma.$transaction(async tx => {
//             await tx.match.update({
//                 where: { id: matchId },
//                 data: {
//                     status: MatchStatus.forfeited,
//                     played_at: new Date(),
//                     home_score: winnerIsHome ? winScore : loseScore,
//                     away_score: winnerIsHome ? loseScore : winScore,
//                 },
//             });
//             await tx.matchResult.create({
//                 data: {
//                     match_id: matchId,
//                     winner_team_id: winnerTeamId,
//                     home_score: winnerIsHome ? winScore : loseScore,
//                     away_score: winnerIsHome ? loseScore : winScore,
//                     home_final_score: winnerIsHome ? winScore : loseScore,
//                     away_final_score: winnerIsHome ? loseScore : winScore,
//                     result_type: MatchResultType.forfeit,
//                     status: MatchResultStatus.official,
//                 },
//             });
//         });
//         if (match.group_id) await this.standingsService.recomputeGroupStandings(match.group_id);
//     }
//     async abandonMatch(matchId: number, minute: number, reason?: string): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({ where: { id: matchId } });
//         if (match.status !== MatchStatus.ongoing)
//             throw createAppError('CONFLICT', `Match ${matchId} không ongoing — không abandon được`);
//         // Abandoned: không tự quyết winner/score — để trạng thái treo, chờ ban tổ chức
//         // quyết định (huỷ trận, đá lại từ đầu qua replay_of_match_id, hoặc xử thắng/thua
//         // thủ công qua forfeitMatch). Không tạo MatchResult ở đây.
//         await this.prisma.match.update({
//             where: { id: matchId },
//             data: { status: MatchStatus.abandoned, abandoned_minute: minute, postponed_reason: reason },
//         });
//     }
//     // ---- Appeal / protest resolution ----
//     // MatchResultStatus.protested/under_review tồn tại trong schema nhưng workflow gốc
//     // chưa có service nào set/resolve 2 status này — bổ sung tối thiểu ở đây.
//     async fileAppeal(matchId: number, reason: string): Promise<void> {
//         const result = await this.prisma.matchResult.findUnique({ where: { match_id: matchId } });
//         if (!result) throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult — không file appeal được`);
//         if (result.status !== MatchResultStatus.official)
//             throw createAppError('CONFLICT', `MatchResult đang ở '${result.status}' — không file appeal được`);
//         await this.prisma.matchResult.update({
//             where: { match_id: matchId },
//             data: { status: MatchResultStatus.under_review, appeal_reason: reason },
//         });
//         // Match under_review bị loại khỏi recomputeGroupStandings (filter status: official)
//         // -> standings hiện tại thiếu trận này tạm thời cho tới khi resolveAppeal — không phải bug.
//     }
//     async resolveAppeal(matchId: number, input: ResolveAppealInput): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({ where: { id: matchId } });
//         const result = await this.prisma.matchResult.findUnique({ where: { match_id: matchId } });
//         if (!result) throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult`);
//         if (result.status !== MatchResultStatus.under_review && result.status !== MatchResultStatus.protested)
//             throw createAppError('CONFLICT', `MatchResult đang ở '${result.status}' — không resolve được`);
//         if (input.resolution === 'uphold') {
//             await this.prisma.matchResult.update({
//                 where: { match_id: matchId },
//                 data: { status: MatchResultStatus.official, appeal_note: input.note },
//             });
//         } else {
//             if (input.newHomeScore === undefined || input.newAwayScore === undefined)
//                 throw createAppError('VALIDATION_ERROR', 'overturn cần newHomeScore/newAwayScore');
//             const newWinner =
//                 input.newHomeScore === input.newAwayScore
//                     ? null
//                     : input.newHomeScore > input.newAwayScore
//                         ? match.home_team_id
//                         : match.away_team_id;
//             // Sửa thẳng vào row hiện tại, không giữ row lịch sử bản gốc trước overturn — nếu
//             // cần audit trail (ai sửa, score cũ là gì), cần bảng match_result_revisions riêng.
//             // Hiện tại chấp nhận mất lịch sử bản gốc để giữ đơn giản.
//             await this.prisma.matchResult.update({
//                 where: { match_id: matchId },
//                 data: {
//                     winner_team_id: newWinner,
//                     home_final_score: input.newHomeScore,
//                     away_final_score: input.newAwayScore,
//                     status: MatchResultStatus.official,
//                     appeal_note: input.note,
//                 },
//             });
//         }
//         if (match.group_id) await this.standingsService.recomputeGroupStandings(match.group_id);
//     }
//     private async bumpAccumulatedCards(
//         tx: Prisma.TransactionClient,
//         playerId: number,
//         seasonId: number,
//         delta: 1 | -1,
//     ) {
//         const stat = await tx.playerStatistic.findFirst({ where: { player_id: playerId, season_id: seasonId } });
//         if (!stat) return; // chưa setup PlayerStatistic — không block trận đấu
//         const season = await tx.season.findUniqueOrThrow({
//             where: { id: seasonId },
//             select: { tournament: { select: { tournamentRule: true } } },
//         });
//         const rule = season.tournament.tournamentRule;
//         if (!rule) return;
//         const newCount = Math.max(0, stat.accumulated_yellow_cards + delta);
//         await tx.playerStatistic.update({
//             where: { id: stat.id },
//             data: {
//                 accumulated_yellow_cards: newCount,
//                 yellow_cards: { increment: delta },
//                 is_suspended: newCount >= rule.yellow_cards_suspension,
//             },
//         });
//     }
// }
//# sourceMappingURL=match.service.js.map