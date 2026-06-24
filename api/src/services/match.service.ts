// import { createAppError } from '../common/app.error.js';
// import {
//     CardColor,
//     MatchEventType,
//     MatchPeriod,
//     MatchResultStatus,
//     MatchResultType,
//     MatchStatus,
//     PhaseFormat,
//     Prisma,
//     PrismaClient,
// } from '../generated/prisma/client.js';
// import { ConfirmResultOutput } from '../types/matchResult.type.js';
// import { ScheduleOptions } from '../types/schedule.type.js';
// import {
//     EXTRA_TIME_PERIODS,
//     FinalizeMatchInput,
//     isCreditedToHomeTeam,
//     ManualScoreInput,
//     PERIOD_TRANSITIONS,
//     RecordEventInput,
//     ResolveAppealInput,
//     SCORE_DELTA_BY_TYPE,
// } from '../types/match.type.js';
// import { MatchResultService } from './matchresult.service.js';
// import {
//     matchForFinalizeSelect,
//     matchForForfeitSelect,
// } from '../data/match.queries.js';
// import {
//     toMatchResultUpdateOnOverturn,
//     toMatchUpdateOnOverturn,
//     toMatchResultUpdateOnUphold,
// } from '../data/match.mappers.js';

// // ─── Service ──────────────────────────────────────────────────────────────────
// // Quản lý state machine (status/period) và event recording.
// // Không tự tạo MatchResult — delegate toàn bộ result logic sang MatchResultService.
// //
// // Flow chuẩn (event path):
// //   startMatch()       → ongoing
// //   recordEvent()*     → ghi events, live-score update
// //   finalizeMatch()    → pending_official  (KHÔNG tạo MatchResult)
// //   [grace period 15p] → referee bổ sung events bị sót
// //   confirmOfficial()  → _computeScoreFromEvents() → INSERT MatchResult → finished
// //
// // Flow manual (fallback khi không có referee app):
// //   startMatch()         → ongoing
// //   submitManualScore()  → pending_official  (lưu score vào Match, KHÔNG tạo MatchResult)
// //   [grace period 15p]   → timeout → needs_review (admin xác nhận thủ công)
// //   confirmOfficial()    → dùng manual score → INSERT MatchResult → finished
// //
// // Lý do tách finalizeMatch và confirmOfficial:
// //   referee cần 15p grace để bổ sung events bị sót sau còi kết thúc.
// //   Nếu tạo MatchResult ngay lúc finalize, events nhập trong grace period
// //   sẽ không reflect vào result — drift giữa match_events và match_results.

// export class MatchLifecycleService {
//     constructor(
//         private readonly prisma: PrismaClient,
//         private readonly matchResultService: MatchResultService,
//     ) { }

//     // ─── State machine ────────────────────────────────────────────────────────

//     async startMatch(matchId: number): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({
//             where: { id: matchId },
//             select: { status: true },
//         });

//         if (match.status !== MatchStatus.scheduled)
//             throw createAppError(
//                 'CONFLICT',
//                 `Match ${matchId} đang ở '${match.status}' — chỉ start từ 'scheduled'`,
//             );

//         await this.prisma.match.update({
//             where: { id: matchId },
//             data: {
//                 status: MatchStatus.ongoing,
//                 current_period: MatchPeriod.first_half,
//                 home_score: 0,
//                 away_score: 0,
//             },
//         });
//     }

//     async transitionPeriod(matchId: number, period: MatchPeriod): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({
//             where: { id: matchId },
//             select: { status: true, current_period: true },
//         });

//         if (match.status !== MatchStatus.ongoing)
//             throw createAppError('CONFLICT', `Match ${matchId} không ongoing — không đổi period`);

//         const current = match.current_period;
//         if (!current || !PERIOD_TRANSITIONS[current]?.includes(period))
//             throw createAppError('CONFLICT', `Không thể chuyển period '${current}' -> '${period}'`);

//         await this.prisma.match.update({
//             where: { id: matchId },
//             data: { current_period: period },
//         });
//     }

//     // ─── Event recording ──────────────────────────────────────────────────────
//     // Guard mở rộng: cho phép nhập event khi pending_official (grace period 15p).
//     // Sau confirmOfficial() → finished → block hoàn toàn.
//     //
//     // Live score (Match.home_score / away_score) chỉ update khi ongoing.
//     // Grace period: event nhập bổ sung, live display không có ý nghĩa sau còi cuối.

//     async recordEvent(matchId: number, input: RecordEventInput): Promise<void> {
//         await this.prisma.$transaction(async tx => {
//             const match = await tx.match.findUniqueOrThrow({
//                 where: { id: matchId },
//                 select: {
//                     status: true,
//                     home_score: true,
//                     away_score: true,
//                     home_team_id: true,
//                     current_period: true,
//                 },
//             });

//             const allowedStatuses: MatchStatus[] = [MatchStatus.ongoing, MatchStatus.pending_official];
//             if (!allowedStatuses.includes(match.status))
//                 throw createAppError(
//                     'CONFLICT',
//                     `Match ${matchId} ở trạng thái '${match.status}' — không nhập event`,
//                 );

//             if (match.status === MatchStatus.ongoing) {
//                 if (match.home_score === null || match.away_score === null)
//                     throw createAppError(
//                         'CONFLICT',
//                         `Match ${matchId} chưa init score — gọi startMatch trước`,
//                     );
//             }

//             // Second yellow guard — referee phải dùng type 'second_yellow' thay vì nhập yellow lần 2
//             if (input.type === MatchEventType.yellow_card && input.playerId) {
//                 const existingYellow = await tx.matchEvent.findFirst({
//                     where: {
//                         match_id: matchId,
//                         player_id: input.playerId,
//                         type: MatchEventType.yellow_card,
//                     },
//                     select: { id: true },
//                 });
//                 if (existingYellow)
//                     throw createAppError(
//                         'VALIDATION_ERROR',
//                         `Player ${input.playerId} đã có thẻ vàng trong trận này — dùng type 'second_yellow'`,
//                     );
//             }

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
//                     card_color: this._deriveCardColor(input.type),
//                     sub_out_player_id: input.subOutPlayerId,
//                 },
//             });

//             // Live score update chỉ khi ongoing.
//             // pending_official: _computeScoreFromEvents() sẽ tính lại từ đầu khi confirmOfficial,
//             // nên không cần update live score ở đây (tránh drift nếu goal_disallowed được nhập sau).
//             if (match.status === MatchStatus.ongoing) {
//                 await this._applyScoreDelta(tx, matchId, match.home_team_id, input);
//             }
//         });
//     }

//     private _deriveCardColor(type: MatchEventType): CardColor | undefined {
//         switch (type) {
//             case MatchEventType.yellow_card:
//             case MatchEventType.second_yellow:
//                 return CardColor.yellow;
//             case MatchEventType.red_card:
//                 return CardColor.red;
//             default:
//                 return undefined;
//         }
//     }

//     private async _applyScoreDelta(
//         tx: Prisma.TransactionClient,
//         matchId: number,
//         homeTeamId: number,
//         input: RecordEventInput,
//     ): Promise<void> {
//         if (!input.teamId) return;
//         const delta = SCORE_DELTA_BY_TYPE[input.type];
//         if (delta === undefined) return;

//         const scoringForHome = isCreditedToHomeTeam(
//             homeTeamId,
//             input.teamId,
//             input.type,
//             input.wasOwnGoal,
//         );

//         await tx.match.update({
//             where: { id: matchId },
//             data: scoringForHome
//                 ? { home_score: { increment: delta } }
//                 : { away_score: { increment: delta } },
//         });
//     }

//     // ─── Score computation ────────────────────────────────────────────────────
//     // Source of truth duy nhất cho kết quả cuối.
//     // Gọi tại confirmOfficial() và finalizeMatch() (chỉ để validate knockout draw sớm).
//     // KHÔNG gọi để tạo MatchResult — đó là việc của confirmResult().
//     //
//     // Return:
//     //   home90/away90 = goals trong 90p (first_half + second_half)
//     //   homeET/awayET = goals chỉ trong ET (extra_time_first + extra_time_second)
//     //   Cumulative ET score = home90 + homeET — tính ở caller khi cần.

//     private async _computeScoreFromEvents(
//         matchId: number,
//         homeTeamId: number,
//     ): Promise<{ home90: number; away90: number; homeET: number; awayET: number }> {
//         const scoreEventTypes = Object.keys(SCORE_DELTA_BY_TYPE) as MatchEventType[];

//         const events = await this.prisma.matchEvent.findMany({
//             where: { match_id: matchId, type: { in: scoreEventTypes } },
//             select: { team_id: true, type: true, period: true },
//         });

//         let home90 = 0, away90 = 0, homeET = 0, awayET = 0;

//         for (const e of events) {
//             if (!e.team_id) continue;
//             const delta = SCORE_DELTA_BY_TYPE[e.type as MatchEventType];
//             if (delta === undefined) continue;

//             const forHome = isCreditedToHomeTeam(homeTeamId, e.team_id, e.type as MatchEventType);
//             const isET = e.period !== null && EXTRA_TIME_PERIODS.includes(e.period);

//             if (isET) {
//                 if (forHome) homeET += delta; else awayET += delta;
//             } else {
//                 if (forHome) home90 += delta; else away90 += delta;
//             }
//         }

//         return { home90, away90, homeET, awayET };
//     }

//     // ─── Finalize ─────────────────────────────────────────────────────────────
//     // Referee bấm "kết thúc trận" — chuyển sang grace period 15p.
//     // KHÔNG tạo MatchResult ở đây. MatchResult chỉ tạo tại confirmOfficial().
//     //
//     // Lưu referee input (resultType, penalty, half-time) vào Match để confirmOfficial()
//     // dùng lại — referee không cần nhập lại khi confirm.
//     //
//     // Validate knockout draw sớm — tránh referee chờ 15p rồi confirmOfficial mới báo lỗi.

//     async finalizeMatch(
//         matchId: number,
//         input: FinalizeMatchInput = {},
//         _scheduleOptions: ScheduleOptions, // giữ signature, dùng khi confirm
//     ): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({
//             where: { id: matchId },
//             select: matchForFinalizeSelect,
//         });

//         if (match.status !== MatchStatus.ongoing)
//             throw createAppError('CONFLICT', `Match ${matchId} không ở trạng thái ongoing`);

//         const resultType = input.resultType ?? MatchResultType.full_time;

//         // Validate knockout draw sớm — preview score từ events, chưa commit gì
//         if (
//             match.phase.format === PhaseFormat.knockout &&
//             resultType === MatchResultType.full_time
//         ) {
//             const { home90, away90 } = await this._computeScoreFromEvents(
//                 matchId, match.home_team_id,
//             );
//             if (home90 === away90)
//                 throw createAppError(
//                     'CONFLICT',
//                     `Match ${matchId} đang hoà ${home90}-${away90} ở knockout — cần extra_time/penalty`,
//                 );
//         }

//         await this.prisma.match.update({
//             where: { id: matchId },
//             data: {
//                 status: MatchStatus.pending_official,
//                 pending_official_at: new Date(),
//                 // Persist referee input để confirmOfficial() dùng lại
//                 // Score KHÔNG lưu ở đây — sẽ compute lại từ events lúc confirm
//                 finalize_result_type: resultType,
//                 finalize_home_half_time: input.homeHalfTimeScore ?? null,
//                 finalize_away_half_time: input.awayHalfTimeScore ?? null,
//                 finalize_home_penalty: input.homePenaltyScore ?? null,
//                 finalize_away_penalty: input.awayPenaltyScore ?? null,
//             },
//         });
//     }

//     // ─── Manual score (fallback — không có events) ────────────────────────────
//     // Dùng khi referee không nhập events realtime (giải nhỏ, không có app).
//     // Score lấy trực tiếp từ input — không gọi _computeScoreFromEvents.
//     // Player stats sẽ trống (không có events → không có gì để aggregate).
//     //
//     // Guard: reject nếu match đã có events để tránh conflict giữa 2 nguồn score.
//     // Grace period timeout: manual path → flag needs_review thay vì auto-official.

//     async submitManualScore(
//         matchId: number,
//         input: ManualScoreInput,
//         _scheduleOptions: ScheduleOptions,
//     ): Promise<void> {
//         const match = await this.prisma.match.findUnique({
//             where: { id: matchId },
//             select: { status: true },
//         });

//         if (!match) throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);

//         if (match.status !== MatchStatus.ongoing)
//             throw createAppError(
//                 'CONFLICT',
//                 `Match ${matchId} không ongoing — manual score chỉ dùng trong trận`,
//             );

//         // Guard: nếu đã có events thì không cho nhập manual — yêu cầu dùng finalizeMatch()
//         // Tránh silent data loss: confirmOfficial() sẽ ưu tiên manual path nếu manual_home_score != null,
//         // bỏ qua toàn bộ events đã nhập
//         const eventCount = await this.prisma.matchEvent.count({
//             where: { match_id: matchId },
//         });
//         if (eventCount > 0)
//             throw createAppError(
//                 'CONFLICT',
//                 `Match ${matchId} đã có ${eventCount} events — dùng finalizeMatch() thay vì manual score`,
//             );

//         await this.prisma.match.update({
//             where: { id: matchId },
//             data: {
//                 status: MatchStatus.pending_official,
//                 pending_official_at: new Date(),
//                 manual_home_score: input.homeScore,
//                 manual_away_score: input.awayScore,
//                 finalize_result_type: input.resultType,
//                 finalize_home_penalty: input.homePenalty ?? null,
//                 finalize_away_penalty: input.awayPenalty ?? null,
//                 // Half-time không collect ở manual path
//                 finalize_home_half_time: null,
//                 finalize_away_half_time: null,
//             },
//         });
//     }

//     // ─── Confirm official ─────────────────────────────────────────────────────
//     // Nơi DUY NHẤT tạo MatchResult.
//     // Referee gọi sau grace period, hoặc admin gọi cho needs_review match.
//     //
//     // Event path: compute score từ toàn bộ events tại thời điểm này
//     //             (bao gồm events nhập trong grace period 15p)
//     // Manual path: dùng manual_home_score / manual_away_score, bỏ qua events
//     //
//     // ET score convention: homeExtraTime = cumulative (home90 + homeET)
//     //   → home_extra_time_score = score sau ET (không phải ET-only goals)
//     //   → home_final_score = homeExtraTime (cho penalty: ET score, không cộng penalty)

//     async confirmOfficial(
//         matchId: number,
//         scheduleOptions: ScheduleOptions,
//     ): Promise<ConfirmResultOutput> {
//         const match = await this.prisma.match.findUnique({
//             where: { id: matchId },
//             select: {
//                 status: true,
//                 home_team_id: true,
//                 manual_home_score: true,
//                 manual_away_score: true,
//                 finalize_result_type: true,
//                 finalize_home_half_time: true,
//                 finalize_away_half_time: true,
//                 finalize_home_penalty: true,
//                 finalize_away_penalty: true,
//                 phase: { select: { format: true } },
//             },
//         });

//         if (!match) throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);

//         // Cho phép cả needs_review — admin confirm thủ công cho manual-score match
//         if (
//             match.status !== MatchStatus.pending_official &&
//             match.status !== MatchStatus.needs_review
//         )
//             throw createAppError(
//                 'CONFLICT',
//                 `Match ${matchId} không ở pending_official/needs_review — không confirm được`,
//             );

//         const resultType = match.finalize_result_type ?? MatchResultType.full_time;
//         const isManual = match.manual_home_score !== null && match.manual_away_score !== null;

//         let homeScore: number;
//         let awayScore: number;
//         let homeExtraTime: number | undefined;
//         let awayExtraTime: number | undefined;

//         if (isManual) {
//             // Manual path — score từ referee input, không có event breakdown
//             // ET không thể tách ra từ manual input → homeExtraTime = undefined
//             homeScore = match.manual_home_score!;
//             awayScore = match.manual_away_score!;
//         } else {
//             // Event path — compute từ toàn bộ events (kể cả events nhập trong grace period)
//             const { home90, away90, homeET, awayET } = await this._computeScoreFromEvents(
//                 matchId, match.home_team_id,
//             );
//             homeScore = home90;
//             awayScore = away90;

//             const hasExtraTime =
//                 resultType === MatchResultType.extra_time ||
//                 resultType === MatchResultType.penalty;

//             if (hasExtraTime) {
//                 // Cumulative: home_extra_time_score = score sau ET (90p + ET goals)
//                 homeExtraTime = home90 + homeET;
//                 awayExtraTime = away90 + awayET;
//             }
//         }

//         // confirmResult tạo MatchResult + update stats + standings + knockout advance
//         return this.matchResultService.confirmResult(
//             matchId,
//             {
//                 homeScore,
//                 awayScore,
//                 homeHalfTimeScore: match.finalize_home_half_time ?? undefined,
//                 awayHalfTimeScore: match.finalize_away_half_time ?? undefined,
//                 homeExtraTime,
//                 awayExtraTime,
//                 homePenalty: match.finalize_home_penalty ?? undefined,
//                 awayPenalty: match.finalize_away_penalty ?? undefined,
//                 resultType,
//             },
//             scheduleOptions,
//         );
//     }

//     // ─── Grace period timeout handler ─────────────────────────────────────────
//     // Gọi bởi cron/BullMQ worker — KHÔNG dùng setTimeout trong process.
//     // Chạy mỗi 2p, tìm match pending_official đã quá gracePeriodMinutes.
//     //
//     // Strategy:
//     //   event-based  → auto confirmOfficial (score có events, đủ tin cậy)
//     //   manual-based → flag needs_review    (không có events, cần admin xác nhận)
//     //
//     // Event-based phải xử lý per-match (không batch) vì confirmOfficial gọi
//     // confirmResult → standings recompute + knockout advance, mỗi match có side-effect riêng.
//     // Manual-based batch update được vì chỉ đổi status, không có side-effect phụ.

//     async handleGracePeriodTimeout(
//         gracePeriodMinutes = 15,
//         scheduleOptions: ScheduleOptions,
//     ): Promise<{ autoOfficiated: number[]; flaggedForReview: number[] }> {
//         const cutoff = new Date(Date.now() - gracePeriodMinutes * 60 * 1000);

//         const expired = await this.prisma.match.findMany({
//             where: {
//                 status: MatchStatus.pending_official,
//                 pending_official_at: { lt: cutoff },
//             },
//             select: {
//                 id: true,
//                 manual_home_score: true,
//             },
//         });

//         if (expired.length === 0) return { autoOfficiated: [], flaggedForReview: [] };

//         const autoIds: number[] = [];
//         const reviewIds: number[] = [];

//         for (const m of expired) {
//             if (m.manual_home_score !== null) {
//                 reviewIds.push(m.id);
//             } else {
//                 autoIds.push(m.id);
//             }
//         }

//         // Event-based: auto confirm từng match
//         const confirmErrors: { matchId: number; error: unknown }[] = [];
//         for (const matchId of autoIds) {
//             try {
//                 await this.confirmOfficial(matchId, scheduleOptions);
//             } catch (err) {
//                 // Không throw — tiếp tục xử lý các match khác
//                 // Log lại để retry hoặc alert admin
//                 confirmErrors.push({ matchId, error: err });
//                 console.error(`[GracePeriod] auto-confirm failed for match ${matchId}:`, err);
//             }
//         }

//         // Manual-based: batch update sang needs_review
//         if (reviewIds.length > 0) {
//             await this.prisma.match.updateMany({
//                 where: { id: { in: reviewIds } },
//                 data: { status: MatchStatus.needs_review },
//             });
//             // TODO: emit notification tới admin dashboard / webhook
//         }

//         const succeededAutoIds = autoIds.filter(
//             id => !confirmErrors.some(e => e.matchId === id),
//         );

//         return { autoOfficiated: succeededAutoIds, flaggedForReview: reviewIds };
//     }

//     // ─── Forfeit / walkover ───────────────────────────────────────────────────
//     // Do BTC quyết định — bypass grace period, confirmResult trực tiếp.
//     // STATUS_BY_RESULT_TYPE map forfeit/walkover → MatchStatus.forfeited (không qua pending_official).
//     //
//     // Phân biệt:
//     //   walkover  = match chưa diễn ra (scheduled), team không xuất hiện
//     //   forfeit   = match đang/đã diễn ra, team bỏ cuộc hoặc vi phạm luật

//     async forfeitMatch(
//         matchId: number,
//         forfeitingTeamId: number,
//         scheduleOptions: ScheduleOptions,
//     ): Promise<ConfirmResultOutput> {
//         const match = await this.prisma.match.findUniqueOrThrow({
//             where: { id: matchId },
//             select: matchForForfeitSelect,
//         });

//         if (
//             match.status === MatchStatus.finished ||
//             match.status === MatchStatus.forfeited
//         )
//             throw createAppError('CONFLICT', `Match ${matchId} đã '${match.status}' — không forfeit được`);

//         if (
//             forfeitingTeamId !== match.home_team_id &&
//             forfeitingTeamId !== match.away_team_id
//         )
//             throw createAppError(
//                 'VALIDATION_ERROR',
//                 `Team ${forfeitingTeamId} không thuộc match ${matchId}`,
//             );

//         const rule = match.phase.season?.tournament?.tournamentRule;
//         if (!rule)
//             throw createAppError('NOT_FOUND', `Thiếu TournamentRule cho match ${matchId}`);

//         const winnerIsHome = forfeitingTeamId !== match.home_team_id;
//         const resultType =
//             match.status === MatchStatus.scheduled
//                 ? MatchResultType.walkover
//                 : MatchResultType.forfeit;

//         return this.matchResultService.confirmResult(
//             matchId,
//             {
//                 homeScore: winnerIsHome ? rule.forfeit_score : 0,
//                 awayScore: winnerIsHome ? 0 : rule.forfeit_score,
//                 resultType,
//             },
//             scheduleOptions,
//         );
//     }

//     // ─── Abandon ──────────────────────────────────────────────────────────────
//     // Match bị dừng giữa chừng (thời tiết, bạo lực...).
//     // TECH DEBT: reuse field postponed_reason cho abandoned_reason — cần field riêng.

//     async abandonMatch(matchId: number, minute: number, reason?: string): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({
//             where: { id: matchId },
//             select: { status: true, postponed_reason: true },
//         });

//         if (match.status !== MatchStatus.ongoing)
//             throw createAppError('CONFLICT', `Match ${matchId} không ongoing — không abandon được`);

//         // TECH DEBT: cần field abandoned_reason riêng.
//         // Hiện tại reuse postponed_reason — chặn nếu đã có giá trị để tránh ghi đè.
//         if (reason && match.postponed_reason)
//             throw createAppError(
//                 'CONFLICT',
//                 `Match ${matchId} đã có postponed_reason — cần field abandoned_reason riêng`,
//             );

//         await this.prisma.match.update({
//             where: { id: matchId },
//             data: {
//                 status: MatchStatus.abandoned,
//                 abandoned_minute: minute,
//                 postponed_reason: reason,
//             },
//         });
//     }

//     // ─── Appeal / protest ─────────────────────────────────────────────────────
//     // Chỉ file được khi MatchResult.status = official.
//     // appeal  = khiếu nại → under_review
//     // protest = phản đối chính thức → protested

//     async fileAppeal(matchId: number, reason: string): Promise<void> {
//         await this._fileDispute(matchId, reason, MatchResultStatus.under_review);
//     }

//     async fileProtest(matchId: number, reason: string): Promise<void> {
//         await this._fileDispute(matchId, reason, MatchResultStatus.protested);
//     }

//     private async _fileDispute(
//         matchId: number,
//         reason: string,
//         targetStatus: MatchResultStatus,
//     ): Promise<void> {
//         const result = await this.prisma.matchResult.findUnique({
//             where: { match_id: matchId },
//             select: { status: true },
//         });

//         if (!result)
//             throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult`);
//         if (result.status !== MatchResultStatus.official)
//             throw createAppError('CONFLICT', `MatchResult đang ở '${result.status}' — không file được`);

//         await this.prisma.matchResult.update({
//             where: { match_id: matchId },
//             data: { status: targetStatus, appeal_reason: reason },
//         });
//     }

//     async resolveAppeal(matchId: number, input: ResolveAppealInput): Promise<void> {
//         const match = await this.prisma.match.findUniqueOrThrow({
//             where: { id: matchId },
//             select: {
//                 home_team_id: true,
//                 away_team_id: true,
//                 group_id: true,
//                 phase: { select: { format: true } },
//             },
//         });

//         const result = await this.prisma.matchResult.findUnique({
//             where: { match_id: matchId },
//             select: { status: true },
//         });

//         if (!result)
//             throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult`);

//         if (
//             result.status !== MatchResultStatus.under_review &&
//             result.status !== MatchResultStatus.protested
//         )
//             throw createAppError('CONFLICT', `MatchResult đang ở '${result.status}' — không resolve được`);

//         if (input.resolution === 'uphold') {
//             await this.prisma.matchResult.update({
//                 where: { match_id: matchId },
//                 data: toMatchResultUpdateOnUphold(input.note),
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

//             await this.prisma.$transaction(async tx => {
//                 await tx.matchResult.update({
//                     where: { match_id: matchId },
//                     data: toMatchResultUpdateOnOverturn(
//                         input.newHomeScore!,
//                         input.newAwayScore!,
//                         newWinner,
//                         input.note,
//                     ),
//                 });

//                 await tx.match.update({
//                     where: { id: matchId },
//                     data: toMatchUpdateOnOverturn(input.newHomeScore!, input.newAwayScore!),
//                 });
//             });
//         }

//         const isKnockout = match.phase.format === PhaseFormat.knockout;

//         if (!isKnockout && match.group_id) {
//             await this.matchResultService.recomputeStandingsFor(match.group_id);
//         }

//         // Knockout overturn cần manual bracket correction — không thể tự động an toàn
//         // (winner có thể đã advance và thi đấu trận tiếp theo)
//         if (isKnockout && input.resolution === 'overturn') {
//             throw createAppError(
//                 'NOT_IMPLEMENTED',
//                 `Match ${matchId} là knockout — overturn bracket chưa được hỗ trợ tự động`,
//             );
//         }
//     }
// }