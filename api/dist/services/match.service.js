import { createAppError } from '../common/app.error.js';
import { CardColor, MatchEventType, MatchPeriod, MatchResultStatus, MatchResultType, MatchStatus, PhaseFormat, } from '../generated/prisma/client.js';
import { EXTRA_TIME_PERIODS, isCreditedToHomeTeam, PERIOD_TRANSITIONS, SCORE_DELTA_BY_TYPE, } from '../types/match.type.js';
import { matchForFinalizeSelect, matchForForfeitSelect } from '../types/match.queries.js';
import { isKnockoutFormat, toMatchResultUpdateOnOverturn, toMatchResultUpdateOnUphold, toMatchUpdateOnOverturn } from '../helper/match.helper.js';
// ─── Correction window ────────────────────────────────────────────────────────
// Sau khi match finished, admin có 15p để patch events/score nếu có sai sót.
// Sau 15p: lock hoàn toàn, mọi edit bị reject.
// Match status KHÔNG đổi — vẫn giữ nguyên finished.
const CORRECTION_WINDOW_MS = 15 * 60 * 1000;
// ─── Service ──────────────────────────────────────────────────────────────────
// Quản lý state machine (status/period) và event recording.
// Không tự tạo MatchResult — delegate toàn bộ result logic sang MatchResultService.
//
// Flow chuẩn (event path):
//   startMatch()       → ongoing
//   recordEvent()*     → ghi events, live-score update
//   finalizeMatch()    → pending_official  (KHÔNG tạo MatchResult)
//   [grace period 15p] → referee bổ sung events bị sót
//   confirmOfficial()  → _computeScoreFromEvents() → INSERT MatchResult → finished
//   [correction 15p]   → admin sửa event sai/thiếu → recompute MatchResult
//
// Flow manual (fallback khi không có referee app):
//   startMatch()         → ongoing
//   submitManualScore()  → pending_official
//   [grace period 15p]   → timeout → needs_review
//   confirmOfficial()    → dùng manual score → INSERT MatchResult → finished
//   [correction 15p]     → editScore() override MatchResult trực tiếp
export class MatchLifecycleService {
    prisma;
    matchResultService;
    constructor(prisma, matchResultService) {
        this.prisma = prisma;
        this.matchResultService = matchResultService;
    }
    // ─── State machine ────────────────────────────────────────────────────────
    async startMatch(matchId) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { status: true },
        });
        if (match.status !== MatchStatus.scheduled)
            throw createAppError('CONFLICT', `Match ${matchId} đang ở '${match.status}' — chỉ start từ 'scheduled'`);
        await this.prisma.match.update({
            where: { id: matchId },
            data: {
                status: MatchStatus.ongoing,
                current_period: MatchPeriod.first_half,
                home_score: 0,
                away_score: 0,
            },
        });
    }
    async transitionPeriod(matchId, period) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { status: true, current_period: true },
        });
        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ongoing — không đổi period`);
        const current = match.current_period;
        if (!current || !PERIOD_TRANSITIONS[current]?.includes(period))
            throw createAppError('CONFLICT', `Không thể chuyển period '${current}' -> '${period}'`);
        await this.prisma.match.update({
            where: { id: matchId },
            data: { current_period: period },
        });
    }
    // ─── Event recording ──────────────────────────────────────────────────────
    // Guard: cho phép nhập event khi ongoing và pending_official (grace period 15p).
    // Live score update chỉ khi ongoing.
    async recordEvent(matchId, input) {
        await this.prisma.$transaction(async (tx) => {
            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: {
                    status: true,
                    home_score: true,
                    away_score: true,
                    home_team_id: true,
                    current_period: true,
                },
            });
            const allowedStatuses = [MatchStatus.ongoing, MatchStatus.pending_official];
            if (!allowedStatuses.includes(match.status))
                throw createAppError('CONFLICT', `Match ${matchId} ở trạng thái '${match.status}' — không nhập event`);
            if (match.status === MatchStatus.ongoing) {
                if (match.home_score === null || match.away_score === null)
                    throw createAppError('CONFLICT', `Match ${matchId} chưa init score — gọi startMatch trước`);
            }
            // Second yellow guard
            if (input.type === MatchEventType.yellow_card && input.playerId) {
                const existingYellow = await tx.matchEvent.findFirst({
                    where: {
                        match_id: matchId,
                        player_id: input.playerId,
                        type: MatchEventType.yellow_card,
                    },
                    select: { id: true },
                });
                if (existingYellow)
                    throw createAppError('VALIDATION_ERROR', `Player ${input.playerId} đã có thẻ vàng — dùng type 'second_yellow'`);
            }
            await tx.matchEvent.create({
                data: {
                    match_id: matchId,
                    player_id: input.playerId,
                    team_id: input.teamId,
                    type: input.type,
                    minute: input.minute,
                    added_minute: input.addedMinute,
                    // Live recording: dùng current_period từ match state.
                    // Correction: period được truyền tường minh từ AddEventInput.
                    period: input.period ?? match.current_period ?? undefined,
                    note: input.note,
                    card_color: this._deriveCardColor(input.type),
                    sub_out_player_id: input.subOutPlayerId,
                },
            });
            // Live score: chỉ update khi ongoing
            // pending_official: _computeScoreFromEvents sẽ tính lại khi confirmOfficial
            if (match.status === MatchStatus.ongoing) {
                await this._applyScoreDelta(tx, matchId, match.home_team_id, input);
            }
        });
    }
    _deriveCardColor(type) {
        switch (type) {
            case MatchEventType.yellow_card:
            case MatchEventType.second_yellow:
                return CardColor.yellow;
            case MatchEventType.red_card:
                return CardColor.red;
            default:
                return undefined;
        }
    }
    async _applyScoreDelta(tx, matchId, homeTeamId, input) {
        if (!input.teamId)
            return;
        const delta = SCORE_DELTA_BY_TYPE[input.type];
        if (delta === undefined)
            return;
        const scoringForHome = isCreditedToHomeTeam(homeTeamId, input.teamId, input.type, input.wasOwnGoal);
        await tx.match.update({
            where: { id: matchId },
            data: scoringForHome
                ? { home_score: { increment: delta } }
                : { away_score: { increment: delta } },
        });
    }
    // ─── Score computation ────────────────────────────────────────────────────
    // Return:
    //   home90/away90 = goals trong 90p (first_half + second_half)
    //   homeET/awayET = goals chỉ trong ET (extra_time_first + extra_time_second)
    //   Cumulative ET = home90 + homeET — tính ở caller khi cần.
    async _computeScoreFromEvents(matchId, homeTeamId) {
        const scoreEventTypes = Object.keys(SCORE_DELTA_BY_TYPE);
        const events = await this.prisma.matchEvent.findMany({
            where: { match_id: matchId, type: { in: scoreEventTypes } },
            select: { team_id: true, type: true, period: true },
        });
        let home90 = 0, away90 = 0, homeET = 0, awayET = 0;
        for (const e of events) {
            if (!e.team_id)
                continue;
            const delta = SCORE_DELTA_BY_TYPE[e.type];
            if (delta === undefined)
                continue;
            const forHome = isCreditedToHomeTeam(homeTeamId, e.team_id, e.type);
            const isET = e.period !== null && EXTRA_TIME_PERIODS.includes(e.period);
            if (isET) {
                if (forHome)
                    homeET += delta;
                else
                    awayET += delta;
            }
            else {
                if (forHome)
                    home90 += delta;
                else
                    away90 += delta;
            }
        }
        return { home90, away90, homeET, awayET };
    }
    // ─── Finalize ─────────────────────────────────────────────────────────────
    // Referee bấm "kết thúc trận" → grace period 15p.
    // KHÔNG tạo MatchResult. Persist referee input vào Match để confirmOfficial dùng lại.
    // Validate knockout draw sớm để tránh báo lỗi muộn sau grace period.
    async finalizeMatch(matchId, input = {}, _scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: matchForFinalizeSelect,
        });
        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ở trạng thái ongoing`);
        const resultType = input.resultType ?? MatchResultType.full_time;
        if (match.phase.format === PhaseFormat.knockout && resultType === MatchResultType.full_time) {
            const { home90, away90 } = await this._computeScoreFromEvents(matchId, match.home_team_id);
            if (home90 === away90)
                throw createAppError('CONFLICT', `Match ${matchId} đang hoà ${home90}-${away90} ở knockout — cần extra_time/penalty`);
        }
        await this.prisma.match.update({
            where: { id: matchId },
            data: {
                status: MatchStatus.pending_official,
                pending_official_at: new Date(),
                finalize_result_type: resultType,
                finalize_home_half_time: input.homeHalfTimeScore ?? null,
                finalize_away_half_time: input.awayHalfTimeScore ?? null,
                finalize_home_penalty: input.homePenaltyScore ?? null,
                finalize_away_penalty: input.awayPenaltyScore ?? null,
            },
        });
    }
    // ─── Manual score ─────────────────────────────────────────────────────────
    // Guard: reject nếu đã có events để tránh conflict giữa 2 nguồn score.
    async submitManualScore(matchId, input, _scheduleOptions) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: { status: true },
        });
        if (!match)
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);
        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ongoing — manual score chỉ dùng trong trận`);
        const eventCount = await this.prisma.matchEvent.count({ where: { match_id: matchId } });
        if (eventCount > 0)
            throw createAppError('CONFLICT', `Match ${matchId} đã có ${eventCount} events — dùng finalizeMatch() thay vì manual score`);
        await this.prisma.match.update({
            where: { id: matchId },
            data: {
                status: MatchStatus.pending_official,
                pending_official_at: new Date(),
                manual_home_score: input.homeScore,
                manual_away_score: input.awayScore,
                finalize_result_type: input.resultType,
                finalize_home_penalty: input.homePenalty ?? null,
                finalize_away_penalty: input.awayPenalty ?? null,
                finalize_home_half_time: null,
                finalize_away_half_time: null,
            },
        });
    }
    // ─── Confirm official ─────────────────────────────────────────────────────
    // Nơi DUY NHẤT tạo MatchResult (qua matchResultService.confirmResult).
    // Event path: compute score từ toàn bộ events tại thời điểm này.
    // Manual path: dùng manual_home_score / manual_away_score.
    //
    // played_at được set trong confirmResult → correction window bắt đầu từ đây.
    async confirmOfficial(matchId, scheduleOptions) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: {
                status: true,
                home_team_id: true,
                manual_home_score: true,
                manual_away_score: true,
                finalize_result_type: true,
                finalize_home_half_time: true,
                finalize_away_half_time: true,
                finalize_home_penalty: true,
                finalize_away_penalty: true,
                phase: { select: { format: true } },
            },
        });
        if (!match)
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);
        if (match.status !== MatchStatus.pending_official &&
            match.status !== MatchStatus.needs_review)
            throw createAppError('CONFLICT', `Match ${matchId} không ở pending_official/needs_review`);
        const resultType = match.finalize_result_type ?? MatchResultType.full_time;
        const isManual = match.manual_home_score !== null && match.manual_away_score !== null;
        let homeScore;
        let awayScore;
        let homeExtraTime;
        let awayExtraTime;
        if (isManual) {
            homeScore = match.manual_home_score;
            awayScore = match.manual_away_score;
        }
        else {
            const { home90, away90, homeET, awayET } = await this._computeScoreFromEvents(matchId, match.home_team_id);
            homeScore = home90;
            awayScore = away90;
            const hasExtraTime = resultType === MatchResultType.extra_time ||
                resultType === MatchResultType.penalty;
            if (hasExtraTime) {
                homeExtraTime = home90 + homeET;
                awayExtraTime = away90 + awayET;
            }
        }
        return this.matchResultService.confirmResult(matchId, {
            homeScore,
            awayScore,
            homeHalfTimeScore: match.finalize_home_half_time ?? undefined,
            awayHalfTimeScore: match.finalize_away_half_time ?? undefined,
            homeExtraTime,
            awayExtraTime,
            homePenalty: match.finalize_home_penalty ?? undefined,
            awayPenalty: match.finalize_away_penalty ?? undefined,
            resultType,
        }, scheduleOptions);
    }
    // ─── Grace period timeout handler ─────────────────────────────────────────
    // Gọi bởi cron — KHÔNG dùng setTimeout trong process.
    // event-based  → auto confirmOfficial (đủ tin cậy)
    // manual-based → flag needs_review    (cần admin xác nhận)
    //
    // Idempotency: confirmOfficial có _guardConfirm check matchResult existing —
    // nếu cron chạy 2 lần, lần 2 throw CONFLICT (không crash, log warn).
    // TODO: thêm SELECT FOR UPDATE nếu cần đảm bảo chỉ 1 instance xử lý.
    async handleGracePeriodTimeout(gracePeriodMinutes = 15, scheduleOptions) {
        const cutoff = new Date(Date.now() - gracePeriodMinutes * 60 * 1000);
        const expired = await this.prisma.match.findMany({
            where: {
                status: MatchStatus.pending_official,
                pending_official_at: { lt: cutoff },
            },
            select: { id: true, manual_home_score: true },
        });
        if (expired.length === 0)
            return { autoOfficiated: [], flaggedForReview: [] };
        const autoIds = [];
        const reviewIds = [];
        for (const m of expired) {
            if (m.manual_home_score !== null)
                reviewIds.push(m.id);
            else
                autoIds.push(m.id);
        }
        const confirmErrors = [];
        for (const matchId of autoIds) {
            try {
                await this.confirmOfficial(matchId, scheduleOptions);
            }
            catch (err) {
                confirmErrors.push({ matchId, error: err });
                console.error(`[GracePeriod] auto-confirm failed for match ${matchId}:`, err);
            }
        }
        if (reviewIds.length > 0) {
            await this.prisma.match.updateMany({
                where: { id: { in: reviewIds } },
                data: { status: MatchStatus.needs_review },
            });
        }
        const succeededAutoIds = autoIds.filter(id => !confirmErrors.some(e => e.matchId === id));
        return { autoOfficiated: succeededAutoIds, flaggedForReview: reviewIds };
    }
    // ─── Forfeit / walkover ───────────────────────────────────────────────────
    async forfeitMatch(matchId, forfeitingTeamId, scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: matchForForfeitSelect,
        });
        if (match.status === MatchStatus.finished || match.status === MatchStatus.forfeited)
            throw createAppError('CONFLICT', `Match ${matchId} đã '${match.status}' — không forfeit được`);
        if (forfeitingTeamId !== match.home_team_id && forfeitingTeamId !== match.away_team_id)
            throw createAppError('VALIDATION_ERROR', `Team ${forfeitingTeamId} không thuộc match ${matchId}`);
        const rule = match.phase.season?.tournament?.tournamentRule;
        if (!rule)
            throw createAppError('NOT_FOUND', `Thiếu TournamentRule cho match ${matchId}`);
        const winnerIsHome = forfeitingTeamId !== match.home_team_id;
        const resultType = match.status === MatchStatus.scheduled
            ? MatchResultType.walkover
            : MatchResultType.forfeit;
        return this.matchResultService.confirmResult(matchId, {
            homeScore: winnerIsHome ? rule.forfeit_score : 0,
            awayScore: winnerIsHome ? 0 : rule.forfeit_score,
            resultType,
        }, scheduleOptions);
    }
    // ─── Abandon ──────────────────────────────────────────────────────────────
    // TECH DEBT: reuse field postponed_reason cho abandoned_reason — cần field riêng.
    async abandonMatch(matchId, minute, reason) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { status: true, postponed_reason: true },
        });
        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ongoing — không abandon được`);
        if (reason && match.postponed_reason)
            throw createAppError('CONFLICT', `Match ${matchId} đã có postponed_reason — cần field abandoned_reason riêng`);
        await this.prisma.match.update({
            where: { id: matchId },
            data: {
                status: MatchStatus.abandoned,
                abandoned_minute: minute,
                postponed_reason: reason,
            },
        });
    }
    // ─── Appeal / protest ─────────────────────────────────────────────────────
    async fileAppeal(matchId, reason) {
        await this._fileDispute(matchId, reason, MatchResultStatus.under_review);
    }
    async fileProtest(matchId, reason) {
        await this._fileDispute(matchId, reason, MatchResultStatus.protested);
    }
    async _fileDispute(matchId, reason, targetStatus) {
        const result = await this.prisma.matchResult.findUnique({
            where: { match_id: matchId },
            select: { status: true },
        });
        if (!result)
            throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult`);
        if (result.status !== MatchResultStatus.official)
            throw createAppError('CONFLICT', `MatchResult đang ở '${result.status}' — không file được`);
        await this.prisma.matchResult.update({
            where: { match_id: matchId },
            data: { status: targetStatus, appeal_reason: reason },
        });
    }
    // ─── resolveAppeal ────────────────────────────────────────────────────────
    // Knockout overturn check TRƯỚC khi recompute standings để tránh partial update.
    async resolveAppeal(matchId, input) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: {
                home_team_id: true,
                away_team_id: true,
                group_id: true,
                phase: { select: { format: true } },
            },
        });
        const result = await this.prisma.matchResult.findUnique({
            where: { match_id: matchId },
            select: { status: true },
        });
        if (!result)
            throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult`);
        if (result.status !== MatchResultStatus.under_review &&
            result.status !== MatchResultStatus.protested)
            throw createAppError('CONFLICT', `MatchResult đang ở '${result.status}' — không resolve được`);
        const isKnockout = match.phase.format === PhaseFormat.knockout;
        // Guard knockout overturn TRƯỚC khi thực hiện bất kỳ update nào
        // Tránh partial state: standings recompute xảy ra dù overturn bracket không xử lý được
        if (isKnockout && input.resolution === 'overturn') {
            throw createAppError('NOT_IMPLEMENTED', `Match ${matchId} là knockout — overturn bracket chưa được hỗ trợ tự động`);
        }
        if (input.resolution === 'uphold') {
            await this.prisma.matchResult.update({
                where: { match_id: matchId },
                data: toMatchResultUpdateOnUphold(input.note),
            });
        }
        else {
            if (input.newHomeScore === undefined || input.newAwayScore === undefined)
                throw createAppError('VALIDATION_ERROR', 'overturn cần newHomeScore/newAwayScore');
            const newWinner = input.newHomeScore === input.newAwayScore
                ? null
                : input.newHomeScore > input.newAwayScore
                    ? match.home_team_id
                    : match.away_team_id;
            await this.prisma.$transaction(async (tx) => {
                await tx.matchResult.update({
                    where: { match_id: matchId },
                    data: toMatchResultUpdateOnOverturn(input.newHomeScore, input.newAwayScore, newWinner, input.note),
                });
                await tx.match.update({
                    where: { id: matchId },
                    data: toMatchUpdateOnOverturn(input.newHomeScore, input.newAwayScore),
                });
            });
        }
        // Recompute standings chỉ cho group phase — knockout đã bị guard ở trên
        if (!isKnockout && match.group_id) {
            await this.matchResultService.recomputeStandingsFor(match.group_id);
        }
    }
    // ─── Correction window guard ──────────────────────────────────────────────
    async _assertCorrectionWindow(matchId) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { status: true, played_at: true },
        });
        if (match.status !== MatchStatus.finished)
            throw createAppError('CONFLICT', `Match ${matchId} chưa finished — correction chỉ áp dụng sau khi xác nhận kết quả`);
        if (!match.played_at)
            throw createAppError('CONFLICT', `Match ${matchId} thiếu played_at — không xác định được correction window`);
        const elapsed = Date.now() - match.played_at.getTime();
        if (elapsed > CORRECTION_WINDOW_MS)
            throw createAppError('FORBIDDEN', `Match ${matchId}: correction window đã đóng (${Math.floor(elapsed / 60000)}p sau khi kết thúc, giới hạn 15p)`);
    }
    // ─── addEvent (correction) ────────────────────────────────────────────────
    async addEvent(matchId, input, scheduleOptions) {
        await this._assertCorrectionWindow(matchId);
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { home_team_id: true },
        });
        if (input.type === MatchEventType.yellow_card && input.playerId) {
            const existingYellow = await this.prisma.matchEvent.findFirst({
                where: {
                    match_id: matchId,
                    player_id: input.playerId,
                    type: MatchEventType.yellow_card,
                },
                select: { id: true },
            });
            if (existingYellow)
                throw createAppError('VALIDATION_ERROR', `Player ${input.playerId} đã có thẻ vàng — dùng type 'second_yellow'`);
        }
        // Dùng recordEvent để tái sử dụng logic create — period đã có trong input (AddEventInput)
        await this.recordEvent(matchId, input);
        await this._recalculateResult(matchId, match.home_team_id, scheduleOptions);
    }
    // ─── deleteEvent (correction) ─────────────────────────────────────────────
    async deleteEvent(matchId, eventId, scheduleOptions) {
        await this._assertCorrectionWindow(matchId);
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { home_team_id: true },
        });
        const event = await this.prisma.matchEvent.findUnique({
            where: { id: eventId },
            select: { match_id: true },
        });
        if (!event)
            throw createAppError('NOT_FOUND', `Event ${eventId} không tồn tại`);
        if (event.match_id !== matchId)
            throw createAppError('VALIDATION_ERROR', `Event ${eventId} không thuộc match ${matchId}`);
        await this.prisma.matchEvent.delete({ where: { id: eventId } });
        await this._recalculateResult(matchId, match.home_team_id, scheduleOptions);
    }
    // ─── editEvent (correction) ───────────────────────────────────────────────
    async editEvent(matchId, eventId, input, scheduleOptions) {
        await this._assertCorrectionWindow(matchId);
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { home_team_id: true },
        });
        const event = await this.prisma.matchEvent.findUnique({
            where: { id: eventId },
            select: { match_id: true, player_id: true, type: true },
        });
        if (!event)
            throw createAppError('NOT_FOUND', `Event ${eventId} không tồn tại`);
        if (event.match_id !== matchId)
            throw createAppError('VALIDATION_ERROR', `Event ${eventId} không thuộc match ${matchId}`);
        const newType = input.type ?? event.type;
        const newPlayerId = input.playerId ?? event.player_id;
        if (newType === MatchEventType.yellow_card && newPlayerId) {
            const existingYellow = await this.prisma.matchEvent.findFirst({
                where: {
                    match_id: matchId,
                    player_id: newPlayerId,
                    type: MatchEventType.yellow_card,
                    NOT: { id: eventId },
                },
                select: { id: true },
            });
            if (existingYellow)
                throw createAppError('VALIDATION_ERROR', `Player ${newPlayerId} đã có thẻ vàng — dùng type 'second_yellow'`);
        }
        const updateData = {};
        if (input.type !== undefined) {
            updateData.type = input.type;
            updateData.card_color = this._deriveCardColor(input.type) ?? null;
        }
        if (input.playerId !== undefined)
            updateData.player_id = input.playerId;
        if (input.teamId !== undefined)
            updateData.team_id = input.teamId;
        if (input.minute !== undefined)
            updateData.minute = input.minute;
        if (input.addedMinute !== undefined)
            updateData.added_minute = input.addedMinute;
        if (input.period !== undefined)
            updateData.period = input.period;
        if (input.note !== undefined)
            updateData.note = input.note;
        if (input.subOutPlayerId !== undefined)
            updateData.sub_out_player_id = input.subOutPlayerId;
        await this.prisma.matchEvent.update({
            where: { id: eventId },
            data: updateData,
        });
        await this._recalculateResult(matchId, match.home_team_id, scheduleOptions);
    }
    // ─── editScore (correction — manual path only) ────────────────────────────
    // Guard: reject nếu match có events — dùng event correction thay vì override.
    async editScore(matchId, input, scheduleOptions) {
        await this._assertCorrectionWindow(matchId);
        const eventCount = await this.prisma.matchEvent.count({ where: { match_id: matchId } });
        if (eventCount > 0)
            throw createAppError('CONFLICT', `Match ${matchId} có ${eventCount} events — dùng addEvent/deleteEvent/editEvent thay vì editScore`);
        await this.matchResultService.overrideResult(matchId, input, scheduleOptions);
    }
    // ─── _recalculateResult ───────────────────────────────────────────────────
    // Recompute score từ toàn bộ events → update MatchResult + standings + player stats.
    // Gọi sau mỗi correction operation.
    //
    // MatchResult fields đúng theo schema:
    //   home_final_score / away_final_score  (display + standings)
    //   home_extra_time_score / away_extra_time_score (cumulative ET nếu có)
    //   KHÔNG có home_score / away_score trên MatchResult — chỉ có trên Match
    //
    // Match.home_score / away_score được mirror từ final score để query list không cần join.
    async _recalculateResult(matchId, homeTeamId, scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: {
                away_team_id: true,
                group_id: true,
                phase: { select: { format: true } },
                matchResult: {
                    select: {
                        id: true,
                        result_type: true,
                        home_penalty_score: true,
                        away_penalty_score: true,
                    },
                },
            },
        });
        if (!match.matchResult)
            throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult — không recompute được`);
        const { home90, away90, homeET, awayET } = await this._computeScoreFromEvents(matchId, homeTeamId);
        const resultType = match.matchResult.result_type;
        const hasExtraTime = resultType === MatchResultType.extra_time ||
            resultType === MatchResultType.penalty;
        const homeExtraTime = hasExtraTime ? home90 + homeET : null;
        const awayExtraTime = hasExtraTime ? away90 + awayET : null;
        // homeFinal = score dùng cho display + standings
        const homeFinal = homeExtraTime ?? home90;
        const awayFinal = awayExtraTime ?? away90;
        // Winner resolution sau recompute
        const homePenalty = match.matchResult.home_penalty_score;
        const awayPenalty = match.matchResult.away_penalty_score;
        let winnerTeamId = null;
        if (resultType === MatchResultType.penalty && homePenalty !== null && awayPenalty !== null) {
            winnerTeamId = homePenalty > awayPenalty ? homeTeamId : match.away_team_id;
        }
        else {
            winnerTeamId = homeFinal > awayFinal ? homeTeamId
                : awayFinal > homeFinal ? match.away_team_id
                    : null;
        }
        await this.prisma.$transaction(async (tx) => {
            // Update MatchResult — chỉ các field tồn tại trong schema
            await tx.matchResult.update({
                where: { match_id: matchId },
                data: {
                    home_final_score: homeFinal,
                    away_final_score: awayFinal,
                    home_extra_time_score: homeExtraTime,
                    away_extra_time_score: awayExtraTime,
                    winner_team_id: winnerTeamId,
                    // home_penalty_score / away_penalty_score giữ nguyên — penalty shootout events riêng
                    // home_half_time_score / away_half_time_score giữ nguyên từ confirm
                    updated_at: new Date(),
                },
            });
            // Mirror lên Match để query list không cần join MatchResult
            await tx.match.update({
                where: { id: matchId },
                data: {
                    home_score: homeFinal,
                    away_score: awayFinal,
                    updated_at: new Date(),
                },
            });
        });
        // Standings recompute ngoài TX — eventual consistency chấp nhận được
        if (!isKnockoutFormat(match.phase.format) && match.group_id) {
            await this.matchResultService.recomputeStandingsFor(match.group_id);
        }
        // Player stats recompute từ toàn bộ events hiện tại
        await this.matchResultService.recomputePlayerStats(matchId);
    }
}
//# sourceMappingURL=match.service.js.map