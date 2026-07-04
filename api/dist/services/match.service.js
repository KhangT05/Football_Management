import { createAppError } from '../common/app.error.js';
import { CardColor, MatchEventType, MatchPeriod, MatchResultStatus, MatchResultType, MatchStatus, PhaseFormat, } from '../generated/prisma/client.js';
import { EXTRA_TIME_PERIODS, PERIOD_TRANSITIONS, SCORE_DELTA_BY_TYPE, } from '../types/match.type.js';
import { matchForFinalizeSelect, matchForForfeitSelect } from '../types/match.queries.js';
import { isCreditedToHomeTeam, isKnockoutFormat, toMatchResultUpdateOnOverturn, toMatchResultUpdateOnUphold, toMatchUpdateOnOverturn } from '../helper/match.helper.js';
const CORRECTION_WINDOW_MS = 15 * 60 * 1000;
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
    // recordEvent và finalizeMatch cùng SELECT...FOR UPDATE trên row match →
    // 2 thao tác tự serialize qua nhau (loại race draw-guard vs event chen giữa).
    async recordEvent(matchId, input) {
        await this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
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
                    period: input.period ?? match.current_period ?? undefined,
                    note: input.note,
                    card_color: this._deriveCardColor(input.type),
                    sub_out_player_id: input.subOutPlayerId,
                },
            });
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
    async _computeScoreFromEvents(matchId, homeTeamId, client = this.prisma) {
        const scoreEventTypes = Object.keys(SCORE_DELTA_BY_TYPE);
        const events = await client.matchEvent.findMany({
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
    async finalizeMatch(matchId, input = {}, _scheduleOptions) {
        await this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: matchForFinalizeSelect,
            });
            if (match.status !== MatchStatus.ongoing)
                throw createAppError('CONFLICT', `Match ${matchId} không ở trạng thái ongoing`);
            const resultType = input.resultType ?? MatchResultType.full_time;
            if (match.phase.format === PhaseFormat.knockout && resultType === MatchResultType.full_time) {
                const { home90, away90 } = await this._computeScoreFromEvents(matchId, match.home_team_id, tx);
                if (home90 === away90)
                    throw createAppError('CONFLICT', `Match ${matchId} đang hoà ${home90}-${away90} ở knockout — cần extra_time/penalty`);
            }
            await tx.match.update({
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
        });
    }
    // ─── Manual score ─────────────────────────────────────────────────────────
    // submitManualScore — thêm guard fail-fast, đặt ngay sau check eventCount
    async submitManualScore(matchId, input, _scheduleOptions) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: { status: true, phase: { select: { format: true, legs: true } }, leg: true, home_team_id: true, away_team_id: true, phase_id: true },
        });
        if (!match)
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);
        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ongoing — manual score chỉ dùng trong trận`);
        const eventCount = await this.prisma.matchEvent.count({ where: { match_id: matchId } });
        if (eventCount > 0)
            throw createAppError('CONFLICT', `Match ${matchId} đã có ${eventCount} events — dùng finalizeMatch() thay vì manual score`);
        // FIX: fail-fast — trước đây guard này chỉ có ở finalizeMatch, manual score
        // path đẩy lỗi xuống tận _guardConfirm ở confirmResult, tốn round-trip + admin
        // debug ngược khó hơn.
        const resultType = input.resultType ?? MatchResultType.full_time;
        if (match.phase.format === PhaseFormat.knockout && resultType === MatchResultType.full_time) {
            const isTwoLegged = match.phase.legs === 2 && match.leg != null;
            if (!isTwoLegged && input.homeScore === input.awayScore)
                throw createAppError('CONFLICT', `Match ${matchId} đang hoà ${input.homeScore}-${input.awayScore} ở knockout — cần extra_time/penalty`);
            // Two-legged: check aggregate tương tự finalizeMatch nếu cần — bỏ qua ở đây
            // vì manual score input không có sẵn events để suy leg1 score chính xác;
            // guard đầy đủ vẫn chạy đúng ở _guardConfirm downstream.
        }
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
    // VERIFIED (matchresult.service.ts thật): confirmResult() KHÔNG nhận tx —
    // tự mở this.prisma.$transaction() bằng connection riêng. Do đó
    // confirmOfficial() KHÔNG ĐƯỢC gọi từ bên trong 1 transaction đang giữ
    // row lock trên `matches` (vd claim-tx của handleGracePeriodTimeout) —
    // nếu làm vậy, tx.match.update() trong confirmResult (connection B) sẽ
    // block chờ lock của connection A trong khi A đang await B → deadlock.
    // confirmOfficial luôn dùng this.prisma trực tiếp, chạy SAU khi mọi
    // claim-transaction đã commit và release lock.
    //
    // Correctness cho race "2 instance cùng confirm 1 match" nằm ở
    // matchResultService.confirmResult(): match_id là unique constraint trên
    // matchResult, insert thua cuộc nhận P2002 → convert CONFLICT "đã có
    // MatchResult". SELECT FOR UPDATE SKIP LOCKED ở tầng dưới chỉ là
    // best-effort để tránh gọi thừa, KHÔNG phải nguồn correctness.
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
    // Claim (SELECT FOR UPDATE SKIP LOCKED) chạy trong 1 transaction NGẮN,
    // riêng biệt với confirmOfficial() — không bọc chung để tránh deadlock
    // (xem comment ở confirmOfficial). Claim chỉ là best-effort filter: nếu
    // 2 instance đọc trùng lúc cùng thấy row chưa bị lock, cả 2 có thể cùng
    // "claimed = true" và cùng gọi confirmOfficial — cửa sổ hở này CHẤP NHẬN
    // ĐƯỢC vì unique constraint match_id trên matchResult (P2002 trong
    // confirmResult) mới là nguồn correctness thật, claim chỉ giảm số lần
    // cron instance khác phải ăn CONFLICT vô ích.
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
        const reviewCandidateIds = [];
        for (const m of expired) {
            if (m.manual_home_score !== null)
                reviewCandidateIds.push(m.id);
            else
                autoIds.push(m.id);
        }
        const confirmErrors = [];
        const succeededAutoIds = [];
        for (const matchId of autoIds) {
            const claimed = await this.prisma.$transaction(async (tx) => {
                const rows = await tx.$queryRaw `
                    SELECT id FROM matches
                    WHERE id = ${matchId} AND status = ${MatchStatus.pending_official}
                    FOR UPDATE SKIP LOCKED
                `;
                return rows.length > 0;
            });
            if (!claimed) {
                console.warn(`[GracePeriod] match ${matchId} đang bị instance khác xử lý — skip`);
                continue;
            }
            try {
                await this.confirmOfficial(matchId, scheduleOptions);
                succeededAutoIds.push(matchId);
            }
            catch (err) {
                const isIdempotencyConflict = err instanceof Error &&
                    err.code === 'CONFLICT' &&
                    err.message?.includes('đã có MatchResult');
                if (isIdempotencyConflict) {
                    console.warn(`[GracePeriod] match ${matchId} đã được confirm trước — skip (idempotent)`);
                }
                else {
                    confirmErrors.push({ matchId, error: err });
                    console.error(`[GracePeriod] auto-confirm failed for match ${matchId}:`, err);
                }
            }
        }
        const reviewIds = [];
        for (const matchId of reviewCandidateIds) {
            const claimed = await this.prisma.$transaction(async (tx) => {
                const rows = await tx.$queryRaw `
                    SELECT id FROM matches
                    WHERE id = ${matchId} AND status = ${MatchStatus.pending_official}
                    FOR UPDATE SKIP LOCKED
                `;
                if (rows.length === 0)
                    return false;
                await tx.match.update({
                    where: { id: matchId },
                    data: { status: MatchStatus.needs_review },
                });
                return true;
            });
            if (claimed)
                reviewIds.push(matchId);
        }
        return { autoOfficiated: succeededAutoIds, flaggedForReview: reviewIds };
    }
    // ─── Forfeit / walkover ───────────────────────────────────────────────────
    // VERIFIED: matchResultService._resolveWinner() đọc explicitWinnerTeamId
    // và ưu tiên nó trước khi so sánh score — bug forfeit_score=0 config sai
    // → 0-0 → winner vô định đã được đóng đúng nghĩa.
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
            explicitWinnerTeamId: winnerIsHome ? match.home_team_id : match.away_team_id,
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
        if (!isKnockout && match.group_id) {
            try {
                await this.matchResultService.recomputeStandingsFor(match.group_id);
            }
            catch (err) {
                console.error(`[resolveAppeal] recompute standings failed for group ${match.group_id}:`, err);
            }
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
        await this.prisma.matchEvent.create({
            data: {
                match_id: matchId,
                player_id: input.playerId,
                team_id: input.teamId,
                type: input.type,
                minute: input.minute,
                added_minute: input.addedMinute,
                period: input.period,
                note: input.note,
                card_color: this._deriveCardColor(input.type),
                sub_out_player_id: input.subOutPlayerId,
            },
        });
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
        const newPlayerId = input.playerId !== undefined ? input.playerId : event.player_id;
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
        if (input.playerId != null) {
            const exists = await this.prisma.player.findUnique({ where: { id: input.playerId }, select: { id: true } });
            if (!exists)
                throw createAppError('VALIDATION_ERROR', `Player ${input.playerId} không tồn tại`);
        }
        if (input.teamId != null) {
            const exists = await this.prisma.team.findUnique({ where: { id: input.teamId }, select: { id: true } });
            if (!exists)
                throw createAppError('VALIDATION_ERROR', `Team ${input.teamId} không tồn tại`);
        }
        if (input.subOutPlayerId != null) {
            const exists = await this.prisma.player.findUnique({ where: { id: input.subOutPlayerId }, select: { id: true } });
            if (!exists)
                throw createAppError('VALIDATION_ERROR', `Player ${input.subOutPlayerId} (subOut) không tồn tại`);
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
    async editScore(matchId, input, scheduleOptions) {
        await this._assertCorrectionWindow(matchId);
        const eventCount = await this.prisma.matchEvent.count({ where: { match_id: matchId } });
        if (eventCount > 0)
            throw createAppError('CONFLICT', `Match ${matchId} có ${eventCount} events — dùng addEvent/deleteEvent/editEvent thay vì editScore`);
        await this.matchResultService.overrideResult(matchId, input, scheduleOptions);
    }
    // ─── _recalculateResult ───────────────────────────────────────────────────
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
        const homeFinal = homeExtraTime ?? home90;
        const awayFinal = awayExtraTime ?? away90;
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
            await tx.matchResult.update({
                where: { match_id: matchId },
                data: {
                    home_final_score: homeFinal,
                    away_final_score: awayFinal,
                    home_extra_time_score: homeExtraTime,
                    away_extra_time_score: awayExtraTime,
                    winner_team_id: winnerTeamId,
                    updated_at: new Date(),
                },
            });
            await tx.match.update({
                where: { id: matchId },
                data: {
                    home_score: homeFinal,
                    away_score: awayFinal,
                    updated_at: new Date(),
                },
            });
        });
        if (!isKnockoutFormat(match.phase.format) && match.group_id) {
            try {
                await this.matchResultService.recomputeStandingsFor(match.group_id);
            }
            catch (err) {
                console.error(`[_recalculateResult] recompute standings failed for group ${match.group_id}:`, err);
            }
        }
        try {
            await this.matchResultService.recomputePlayerStats(matchId);
        }
        catch (err) {
            console.error(`[_recalculateResult] recompute player stats failed for match ${matchId}:`, err);
        }
    }
    async adminRecordResult(matchId, input, scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: {
                status: true,
                home_team_id: true,
                away_team_id: true,
            },
        });
        const allowedStatuses = [
            MatchStatus.scheduled,
            MatchStatus.postponed,
            MatchStatus.bye,
            MatchStatus.ongoing,
            MatchStatus.pending_official,
            MatchStatus.needs_review,
        ];
        if (!allowedStatuses.includes(match.status)) {
            throw createAppError("CONFLICT", `Match ${matchId} ở '${match.status}' — không thể nhập kết quả. ` +
                `Dùng correction window (addEvent/editScore) cho match đã finished.`);
        }
        // ─── Card batch guard ───────────────────────────────────────────────
        // adminRecordResult dùng createMany, KHÔNG qua recordEvent() nên
        // KHÔNG có per-write "1 yellow → phải second_yellow" guard tự nhiên.
        // Validate theo batch (2 query cố định, không N+1):
        //   1. Trong-batch: reject nếu 2 yellow_card cùng playerId trong 1 submit
        //   2. Đối chiếu DB: playerId đã có yellow_card từ trước (event cũ, nếu
        //      match đang ở needs_review/pending_official với event có sẵn)
        if (input.cards?.length) {
            const yellowsInBatch = input.cards.filter(c => c.type === MatchEventType.yellow_card);
            const seen = new Set();
            for (const c of yellowsInBatch) {
                if (seen.has(c.playerId))
                    throw createAppError('VALIDATION_ERROR', `Player ${c.playerId}: 2 yellow_card trong cùng submit — dùng type 'second_yellow' cho thẻ thứ 2`);
                seen.add(c.playerId);
            }
            if (yellowsInBatch.length > 0) {
                const playerIds = [...seen];
                const existing = await this.prisma.matchEvent.findMany({
                    where: {
                        match_id: matchId,
                        player_id: { in: playerIds },
                        type: MatchEventType.yellow_card,
                    },
                    select: { player_id: true },
                });
                if (existing.length > 0)
                    throw createAppError('VALIDATION_ERROR', `Player(s) đã có yellow_card từ trước: ${existing.map(e => e.player_id).join(', ')} — dùng 'second_yellow'`);
            }
            // teamId phải thuộc match — cùng constraint forfeitMatch() đang check,
            // admin free-input dễ typo teamId sai giải khác
            const validTeamIds = new Set([match.home_team_id, match.away_team_id]);
            const badTeam = input.cards.find(c => !validTeamIds.has(c.teamId));
            if (badTeam)
                throw createAppError('VALIDATION_ERROR', `Team ${badTeam.teamId} không thuộc match ${matchId}`);
        }
        // ─── Atomic write: scorers + cards ─────────────────────────────────
        // 1 transaction cho cả 2 — không chung tx với confirmResult() bên dưới
        // (confirmResult tự mở $transaction riêng, wrap chung risk deadlock
        // giống pattern đã tránh ở confirmOfficial/handleGracePeriodTimeout).
        // Trade-off: nếu confirmResult() fail SAU khi block này commit, scorer/card
        // events orphan trên match chưa có MatchResult — giống gap sẵn có ở code
        // gốc (scorers createMany trước, confirmResult sau, không atomic).
        // Không mở rộng transaction ra ngoài vì risk deadlock lớn hơn risk orphan event
        // (orphan event recoverable qua addEvent/deleteEvent trong correction window
        // sau khi confirm thành công lần retry).
        if ((input.scorers?.length ?? 0) > 0 || (input.cards?.length ?? 0) > 0) {
            await this.prisma.$transaction(async (tx) => {
                if (input.scorers?.length) {
                    await tx.matchEvent.createMany({
                        data: input.scorers.map((s) => ({
                            match_id: matchId,
                            team_id: s.teamId,
                            player_id: null,
                            type: s.type === "own_goal"
                                ? MatchEventType.own_goal
                                : MatchEventType.goal,
                            minute: s.minute,
                            period: s.period ?? null,
                            note: s.playerName ?? null,
                        })),
                    });
                }
                if (input.cards?.length) {
                    await tx.matchEvent.createMany({
                        data: input.cards.map((c) => ({
                            match_id: matchId,
                            team_id: c.teamId,
                            player_id: c.playerId,
                            type: c.type,
                            minute: c.minute,
                            period: c.period ?? null,
                            card_color: this._deriveCardColor(c.type),
                        })),
                    });
                }
            });
        }
        const resultType = input.resultType ?? MatchResultType.full_time;
        return this.matchResultService.confirmResult(matchId, {
            homeScore: input.homeScore,
            awayScore: input.awayScore,
            homeHalfTimeScore: input.homeHalfTimeScore,
            awayHalfTimeScore: input.awayHalfTimeScore,
            resultType,
        }, scheduleOptions);
    }
}
//# sourceMappingURL=match.service.js.map