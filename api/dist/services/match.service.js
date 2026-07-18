import { createAppError } from '../common/app.error.js';
import { CardColor, MatchEventTimeSource, MatchEventType, MatchPeriod, MatchResultStatus, MatchResultType, MatchStatus, PhaseFormat, } from '../generated/prisma/client.js';
import { EXTRA_TIME_PERIODS, PERIOD_TRANSITIONS, SCORE_DELTA_BY_TYPE, CORRECTION_WINDOW_MS, } from '../types/match.type.js';
import { matchForFinalizeSelect, matchForForfeitSelect } from '../types/match.queries.js';
import { assertMinuteInBounds, assertPlayerNotSentOff, isCreditedToHomeTeam, isKnockoutFormat, toMatchResultUpdateOnOverturn, toMatchResultUpdateOnUphold, toMatchUpdateOnOverturn, findAdvancedChildMatchId, isKnockoutBracketSeeded, } from '../helper/match.helper.js';
const MAX_GRACE_PERIOD_RETRY = 5;
// Marker string prepended vào message của lỗi CONFLICT khi knockout hoà ở
// full_time. KHÔNG dùng 1 error kind riêng vì createAppError's kind enum
// hiện không có type cho case này (chỉ NOT_FOUND/VALIDATION_ERROR/CONFLICT/
// FORBIDDEN/NOT_IMPLEMENTED/INTERNAL_SERVER_ERROR) — team BE cần cân nhắc
// thêm 1 kind chuyên biệt (vd 'KNOCKOUT_DRAW') thay vì so message string,
// đây là giải pháp tạm nhưng đủ để FE phân biệt case này với CONFLICT khác.
// Marker cho case knockout hoà ở full_time (90') — chưa vào ET/pen.
export const KNOCKOUT_DRAW_MARKER = 'KNOCKOUT_DRAW_NEEDS_EXTRA_TIME_OR_PENALTY';
// Marker cho case knockout vẫn hoà SAU khi đã nhập kết quả extra_time —
// chỉ còn đường vào loạt sút luân lưu, không có "hiệp phụ phụ" nào khác.
export const KNOCKOUT_ET_DRAW_MARKER = 'KNOCKOUT_ET_DRAW_NEEDS_PENALTY';
// Marker để FE detect lỗi "knockout draw" ném từ MatchResultService._guardConfirm
// — message gốc: `Match ${id}: knockout draw ở ${resultType} — cần extra_time
// hoặc penalty`. Export marker này thay vì để FE tự đoán string, tránh 2 nơi
// hard-code cùng 1 chuỗi khác nhau (bug đã xảy ra ở bản fix trước).
export const KNOCKOUT_DRAW_MESSAGE_MARKER = 'knockout draw ở';
export class MatchLifecycleService {
    prisma;
    matchResultService;
    constructor(prisma, matchResultService) {
        this.prisma = prisma;
        this.matchResultService = matchResultService;
    }
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
            assertMinuteInBounds(input.period ?? match.current_period, input.minute, input.addedMinute);
            await assertPlayerNotSentOff(tx, matchId, input.playerId);
            if (input.type === MatchEventType.substitution_out ||
                input.type === MatchEventType.substitution_in) {
                await assertPlayerNotSentOff(tx, matchId, input.subOutPlayerId);
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
                    time_source: MatchEventTimeSource.live,
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
                    throw createAppError('CONFLICT', `${KNOCKOUT_DRAW_MARKER}: Match ${matchId} đang hoà ${home90}-${away90} ở knockout — cần extra_time/penalty`);
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
        const resultType = input.resultType ?? MatchResultType.full_time;
        if (match.phase.format === PhaseFormat.knockout && resultType === MatchResultType.full_time) {
            const isTwoLegged = match.phase.legs === 2 && match.leg != null;
            if (!isTwoLegged && input.homeScore === input.awayScore)
                throw createAppError('CONFLICT', `${KNOCKOUT_DRAW_MARKER}: Match ${matchId} đang hoà ${input.homeScore}-${input.awayScore} ở knockout — cần extra_time/penalty`);
        }
        // NEW: resultType=extra_time bắt buộc phải có tổng bàn sau ET, nếu
        // không confirmOfficial() sẽ fallback sai (homeExtraTime=homeScore,
        // tức coi như KHÔNG có ET nào được đá — sai lệch dữ liệu report).
        if (resultType === MatchResultType.extra_time &&
            (input.homeExtraTime === undefined || input.awayExtraTime === undefined)) {
            throw createAppError('VALIDATION_ERROR', `submitManualScore: resultType=extra_time cần homeExtraTime + awayExtraTime (tổng bàn sau hiệp phụ, không phải chỉ bàn ghi trong ET)`);
        }
        if (resultType === MatchResultType.extra_time && input.homeExtraTime === input.awayExtraTime) {
            throw createAppError('CONFLICT', `${KNOCKOUT_ET_DRAW_MARKER}: Match ${matchId} vẫn hoà ${input.homeExtraTime}-${input.awayExtraTime} sau hiệp phụ — cần penalty`);
        }
        await this.prisma.match.update({
            where: { id: matchId },
            data: {
                status: MatchStatus.pending_official,
                pending_official_at: new Date(),
                manual_home_score: input.homeScore,
                manual_away_score: input.awayScore,
                finalize_result_type: input.resultType,
                finalize_home_extra_time: input.homeExtraTime ?? null, // NEW
                finalize_away_extra_time: input.awayExtraTime ?? null, // NEW
                finalize_home_penalty: input.homePenalty ?? null,
                finalize_away_penalty: input.awayPenalty ?? null,
                finalize_home_half_time: null,
                finalize_away_half_time: null,
            },
        });
    }
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
                finalize_home_extra_time: true, // NEW
                finalize_away_extra_time: true, // NEW
                phase: { select: { format: true } },
            },
        });
        if (!match)
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);
        if (match.status !== MatchStatus.pending_official && match.status !== MatchStatus.needs_review)
            throw createAppError('CONFLICT', `Match ${matchId} không ở pending_official/needs_review`);
        const resultType = match.finalize_result_type ?? MatchResultType.full_time;
        const isManual = match.manual_home_score !== null && match.manual_away_score !== null;
        let homeScore, awayScore;
        let homeExtraTime, awayExtraTime;
        if (isManual) {
            homeScore = match.manual_home_score;
            awayScore = match.manual_away_score;
            const hasExtraTime = resultType === MatchResultType.extra_time || resultType === MatchResultType.penalty;
            if (hasExtraTime) {
                // Fallback về homeScore khi không có finalize_home_extra_time
                // (case penalty đá thẳng không qua ET) — khớp hành vi nhánh
                // event-driven bên dưới, nơi hasExtraTime luôn ghi
                // home_extra_time_score kể cả khi homeET=0.
                homeExtraTime = match.finalize_home_extra_time ?? homeScore;
                awayExtraTime = match.finalize_away_extra_time ?? awayScore;
            }
        }
        else {
            const { home90, away90, homeET, awayET } = await this._computeScoreFromEvents(matchId, match.home_team_id);
            homeScore = home90;
            awayScore = away90;
            const hasExtraTime = resultType === MatchResultType.extra_time || resultType === MatchResultType.penalty;
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
    async handleGracePeriodTimeout(gracePeriodMinutes = 15, scheduleOptions) {
        const cutoff = new Date(Date.now() - gracePeriodMinutes * 60 * 1000);
        const expired = await this.prisma.match.findMany({
            where: {
                status: MatchStatus.pending_official,
                pending_official_at: { lt: cutoff },
            },
            select: { id: true, manual_home_score: true, grace_period_retry_count: true },
        });
        if (expired.length === 0)
            return { autoOfficiated: [], flaggedForReview: [] };
        const retryCountMap = new Map(expired.map(m => [m.id, m.grace_period_retry_count]));
        const autoIds = [];
        const reviewCandidateIds = [];
        for (const m of expired) {
            if (m.manual_home_score !== null)
                reviewCandidateIds.push(m.id);
            else
                autoIds.push(m.id);
        }
        const succeededAutoIds = [];
        for (const matchId of autoIds) {
            const claimed = await this.prisma.$queryRaw `
                UPDATE matches
                SET pending_official_at = NULL
                WHERE id = ${matchId}
                  AND status = ${MatchStatus.pending_official}
                  AND pending_official_at < ${cutoff}
                RETURNING id
            `;
            if (claimed.length === 0) {
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
                    continue;
                }
                const nextRetryCount = (retryCountMap.get(matchId) ?? 0) + 1;
                if (nextRetryCount >= MAX_GRACE_PERIOD_RETRY) {
                    console.error(`[GracePeriod] match ${matchId} fail ${nextRetryCount} lần liên tiếp — ` +
                        `escalate needs_review, dừng auto-retry. Lỗi cuối:`, err);
                    await this.prisma.match.updateMany({
                        where: { id: matchId, status: MatchStatus.pending_official, pending_official_at: null },
                        data: { status: MatchStatus.needs_review, grace_period_retry_count: nextRetryCount },
                    });
                }
                else {
                    console.error(`[GracePeriod] auto-confirm failed for match ${matchId} (retry ${nextRetryCount}/${MAX_GRACE_PERIOD_RETRY}):`, err);
                    await this.prisma.match.updateMany({
                        where: { id: matchId, status: MatchStatus.pending_official, pending_official_at: null },
                        data: {
                            pending_official_at: new Date(Date.now() - gracePeriodMinutes * 60 * 1000 - 1000),
                            grace_period_retry_count: nextRetryCount,
                        },
                    });
                }
            }
        }
        const reviewIds = [];
        for (const matchId of reviewCandidateIds) {
            const claimed = await this.prisma.$queryRaw `
                UPDATE matches
                SET status = ${MatchStatus.needs_review}
                WHERE id = ${matchId}
                  AND status = ${MatchStatus.pending_official}
                  AND pending_official_at < ${cutoff}
                RETURNING id
            `;
            if (claimed.length > 0)
                reviewIds.push(matchId);
        }
        return { autoOfficiated: succeededAutoIds, flaggedForReview: reviewIds };
    }
    async forfeitMatch(matchId, forfeitingTeamId, scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: matchForForfeitSelect,
        });
        if (match.status === MatchStatus.finished || match.status === MatchStatus.forfeited)
            throw createAppError('CONFLICT', `Match ${matchId} đã '${match.status}' — không forfeit được`);
        if (forfeitingTeamId !== match.home_team_id && forfeitingTeamId !== match.away_team_id)
            throw createAppError('VALIDATION_ERROR', `Team ${forfeitingTeamId} không thuộc match ${matchId}`);
        const rule = match.phase.season?.tournamentRule;
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
    async abandonMatch(matchId, minute, reason) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { status: true },
        });
        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ongoing — không abandon được`);
        await this.prisma.match.update({
            where: { id: matchId },
            data: {
                status: MatchStatus.abandoned,
                abandoned_minute: minute,
                abandoned_reason: reason,
            },
        });
    }
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
    async resolveAppeal(matchId, input) {
        const { isKnockout, groupId } = await this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: {
                    home_team_id: true,
                    away_team_id: true,
                    group_id: true,
                    phase: { select: { format: true } },
                },
            });
            const result = await tx.matchResult.findUnique({
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
                await tx.matchResult.update({
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
                await tx.matchResult.update({
                    where: { match_id: matchId },
                    data: toMatchResultUpdateOnOverturn(input.newHomeScore, input.newAwayScore, newWinner, input.note),
                });
                await tx.match.update({
                    where: { id: matchId },
                    data: toMatchUpdateOnOverturn(input.newHomeScore, input.newAwayScore),
                });
            }
            return { isKnockout, groupId: match.group_id };
        });
        const warnings = [];
        if (!isKnockout && groupId) {
            try {
                await this.matchResultService.recomputeStandingsFor(groupId);
            }
            catch (err) {
                const msg = `Recompute standings thất bại cho group ${groupId}: ${err instanceof Error ? err.message : String(err)}`;
                console.error(`[resolveAppeal] ${msg}`);
                warnings.push(msg);
            }
        }
        return warnings.length > 0 ? { postCommitWarnings: warnings } : {};
    }
    async _assertCorrectionWindow(matchId, client = this.prisma) {
        const match = await client.match.findUniqueOrThrow({
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
    // FIX (silent recompute failure): trước đây trả Promise<void> — nếu addEvent
    // sync sự kiện thành công nhưng recomputeGroupStandings sau đó fail
    // (deadlock do FOR UPDATE trên groups, timeout transaction, v.v.), lỗi chỉ
    // console.error, KHÔNG có cách nào caller/FE biết standings đang stale.
    // Giờ trả về danh sách warnings — caller (addEvent/deleteEvent/editEvent)
    // forward nguyên lên FE để hiện toast + cho phép admin bấm "Tính lại BXH"
    // thủ công thay vì standings kẹt sai vô thời hạn cho tới khi có trận khác
    // trong CÙNG group confirm thành công (recompute là full-scan lại cả group).
    async _runPostCorrectionSteps(matchId, groupId, isKnockout, additionalPlayers = []) {
        const warnings = [];
        if (!isKnockout && groupId) {
            try {
                await this.matchResultService.recomputeStandingsFor(groupId);
            }
            catch (err) {
                const msg = `Recompute standings thất bại cho group ${groupId}: ${err instanceof Error ? err.message : String(err)}`;
                console.error(`[correction] ${msg}`);
                warnings.push(msg);
            }
        }
        try {
            await this.matchResultService.recomputePlayerStats(matchId, additionalPlayers);
        }
        catch (err) {
            const msg = `Recompute player stats thất bại cho match ${matchId}: ${err instanceof Error ? err.message : String(err)}`;
            console.error(`[correction] ${msg}`);
            warnings.push(msg);
        }
        return warnings;
    }
    async addEvent(matchId, input) {
        const { groupId, isKnockout } = await this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
            await this._assertCorrectionWindow(matchId, tx);
            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: { home_team_id: true },
            });
            assertMinuteInBounds(input.period, input.minute, input.addedMinute);
            await assertPlayerNotSentOff(tx, matchId, input.playerId);
            if (input.subOutPlayerId) {
                await assertPlayerNotSentOff(tx, matchId, input.subOutPlayerId);
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
                    period: input.period,
                    note: input.note,
                    card_color: this._deriveCardColor(input.type),
                    sub_out_player_id: input.subOutPlayerId,
                    time_source: MatchEventTimeSource.live,
                },
            });
            return this._recalculateResultTx(tx, matchId, match.home_team_id);
        });
        const warnings = await this._runPostCorrectionSteps(matchId, groupId, isKnockout);
        return warnings.length > 0 ? { postCommitWarnings: warnings } : {};
    }
    async deleteEvent(matchId, eventId, scheduleOptions) {
        const { groupId, isKnockout, affectedPlayers } = await this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
            await this._assertCorrectionWindow(matchId, tx);
            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: { home_team_id: true },
            });
            const event = await tx.matchEvent.findUnique({
                where: { id: eventId },
                select: { match_id: true, player_id: true, team_id: true },
            });
            if (!event)
                throw createAppError('NOT_FOUND', `Event ${eventId} không tồn tại`);
            if (event.match_id !== matchId)
                throw createAppError('VALIDATION_ERROR', `Event ${eventId} không thuộc match ${matchId}`);
            await tx.matchEvent.delete({ where: { id: eventId } });
            const recalc = await this._recalculateResultTx(tx, matchId, match.home_team_id);
            const affectedPlayers = event.player_id
                ? [{ player_id: event.player_id, team_id: event.team_id }]
                : [];
            return { ...recalc, affectedPlayers };
        });
        const warnings = await this._runPostCorrectionSteps(matchId, groupId, isKnockout, affectedPlayers);
        return warnings.length > 0 ? { postCommitWarnings: warnings } : {};
    }
    async editEvent(matchId, eventId, input) {
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
        const { groupId, isKnockout, affectedPlayers } = await this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
            await this._assertCorrectionWindow(matchId, tx);
            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: { home_team_id: true },
            });
            const event = await tx.matchEvent.findUnique({
                where: { id: eventId },
                select: {
                    match_id: true,
                    player_id: true,
                    team_id: true,
                    type: true,
                    minute: true,
                    added_minute: true,
                    period: true,
                },
            });
            if (!event)
                throw createAppError('NOT_FOUND', `Event ${eventId} không tồn tại`);
            if (event.match_id !== matchId)
                throw createAppError('VALIDATION_ERROR', `Event ${eventId} không thuộc match ${matchId}`);
            const newType = input.type ?? event.type;
            const newPlayerId = input.playerId !== undefined ? input.playerId : event.player_id;
            if (newType === MatchEventType.yellow_card && newPlayerId) {
                const existingYellow = await tx.matchEvent.findFirst({
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
            const newMinute = input.minute ?? event.minute;
            const newAddedMinute = input.addedMinute !== undefined ? input.addedMinute : event.added_minute;
            const newPeriod = input.period ?? event.period;
            if (input.minute !== undefined || input.addedMinute !== undefined || input.period !== undefined) {
                assertMinuteInBounds(newPeriod, newMinute, newAddedMinute);
            }
            if (input.playerId !== undefined && input.playerId !== event.player_id) {
                await assertPlayerNotSentOff(tx, matchId, input.playerId);
            }
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
            await tx.matchEvent.update({
                where: { id: eventId },
                data: updateData,
            });
            const recalc = await this._recalculateResultTx(tx, matchId, match.home_team_id);
            const affectedPlayers = event.player_id
                ? [{ player_id: event.player_id, team_id: event.team_id }]
                : [];
            return { ...recalc, affectedPlayers };
        });
        const warnings = await this._runPostCorrectionSteps(matchId, groupId, isKnockout, affectedPlayers);
        return warnings.length > 0 ? { postCommitWarnings: warnings } : {};
    }
    async editScore(matchId, input) {
        const { isKnockout, groupId } = await this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
            await this._assertCorrectionWindow(matchId, tx);
            const eventCount = await tx.matchEvent.count({ where: { match_id: matchId } });
            if (eventCount > 0)
                throw createAppError('CONFLICT', `Match ${matchId} có ${eventCount} events — dùng addEvent/deleteEvent/editEvent thay vì editScore`);
            return this.matchResultService.overrideResultInTx(tx, matchId, input);
        });
        // FIX: cùng bug như addEvent/deleteEvent/editEvent — trước đây 2
        // try/catch riêng lẻ ở đây chỉ console.error, không trả gì lên caller.
        // editScore không có event nên KHÔNG có additionalPlayers để truyền
        // (recomputePlayerStats tự đọc lại matchEvent hiện tại của match — 0
        // event thì players rỗng, không có gì để recompute, không phải lỗi).
        const warnings = [];
        if (!isKnockout && groupId) {
            try {
                await this.matchResultService.recomputeStandingsFor(groupId);
            }
            catch (err) {
                const msg = `Recompute standings thất bại cho group ${groupId}: ${err instanceof Error ? err.message : String(err)}`;
                console.error(`[editScore] ${msg}`);
                warnings.push(msg);
            }
        }
        try {
            await this.matchResultService.recomputePlayerStats(matchId);
        }
        catch (err) {
            const msg = `Recompute player stats thất bại cho match ${matchId}: ${err instanceof Error ? err.message : String(err)}`;
            console.error(`[editScore] ${msg}`);
            warnings.push(msg);
        }
        return warnings.length > 0 ? { postCommitWarnings: warnings } : {};
    }
    async _recalculateResultTx(tx, matchId, homeTeamId) {
        const match = await tx.match.findUniqueOrThrow({
            where: { id: matchId },
            select: {
                away_team_id: true,
                group_id: true,
                phase: { select: { format: true, season: { select: { id: true } } } },
                matchResult: {
                    select: {
                        id: true,
                        result_type: true,
                        winner_team_id: true,
                        home_penalty_score: true,
                        away_penalty_score: true,
                    },
                },
            },
        });
        if (!match.matchResult)
            throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult — không recompute được`);
        const seasonId = match.phase.season?.id;
        if (!seasonId)
            throw createAppError('INTERNAL_SERVER_ERROR', `Match ${matchId}: phase không có season`);
        const isKnockout = isKnockoutFormat(match.phase.format);
        if (!isKnockout) {
            const seeded = await isKnockoutBracketSeeded(tx, seasonId);
            if (seeded)
                throw createAppError('FORBIDDEN', `Match ${matchId}: knockout bracket của season ${seasonId} đã seed — không thể sửa ` +
                    `kết quả vòng bảng qua correction window. Dùng resolveAppeal nếu cần xử lý khiếu nại ` +
                    `(có thể ảnh hưởng suất đi tiếp, cần xử lý nghiệp vụ thủ công).`);
        }
        const { home90, away90, homeET, awayET } = await this._computeScoreFromEvents(matchId, homeTeamId, tx);
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
        if (isKnockout && winnerTeamId !== match.matchResult.winner_team_id) {
            const childMatchId = await findAdvancedChildMatchId(tx, matchId);
            if (childMatchId !== null)
                throw createAppError('CONFLICT', `Match ${matchId}: winner đổi từ ${match.matchResult.winner_team_id} sang ` +
                    `${winnerTeamId}, nhưng round kế tiếp đã tạo (match ${childMatchId}) dựa trên winner cũ. ` +
                    `Không thể sửa event ở đây — xử lý qua resolveAppeal + can thiệp thủ công vào bracket.`);
        }
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
        return { groupId: match.group_id, isKnockout };
    }
    /**
     * FIX (knockout draw guard + penalty forwarding):
     * - Trước đây không guard gì cho knockout hoà ở full_time → confirm được
     *   0-0, winner_team_id=null, bracket advance sai/silent. Giờ chặn với
     *   marker KNOCKOUT_DRAW_MARKER để FE bắt và show modal nhập pen — luồng
     *   dự kiến: admin bấm "Xác nhận" (full_time) -> BE reject với marker ->
     *   FE mở modal nhập penalty -> gọi lại adminRecordResult với
     *   resultType='penalty' + homePenaltyScore/awayPenaltyScore.
     * - Trước đây input.homePenaltyScore/awayPenaltyScore (nếu có) KHÔNG
     *   được forward vào confirmResultInTx — winner luôn tính theo
     *   home/awayScore (90') nên penalty không ảnh hưởng gì tới winner.
     *   Giờ forward đúng field.
     * - REQUIRES: AdminRecordResultInput cần có 2 field optional
     *   `homePenaltyScore?: number` và `awayPenaltyScore?: number` trong
     *   types/match.type.ts — đã có sẵn.
     */
    /**
     * FIX (knockout draw + extra_time + penalty flow):
     *
     * Luồng dự kiến cho knockout hoà:
     *   1. Admin bấm "Xác nhận" với resultType='full_time', homeScore=awayScore
     *      -> BE reject với KNOCKOUT_DRAW_MARKER.
     *   2. FE mở modal hiệp phụ. Admin có 2 lựa chọn:
     *      a. Nhập thêm bàn ET -> gọi lại với resultType='extra_time',
     *         homeScore/awayScore = TỔNG SAU HIỆP PHỤ (không phải chỉ bàn ET).
     *         Nếu vẫn hoà -> BE reject KNOCKOUT_ET_DRAW_MARKER -> FE mở modal pen.
     *      b. Bỏ qua hiệp phụ (giải không đá ET) -> gọi thẳng resultType='penalty'.
     *   3. resultType='penalty' -> cần homePenaltyScore/awayPenaltyScore, không
     *      được hoà.
     *
     * GIỚI HẠN THỰC TẾ (đã kiểm tra lại): match_events hiện KHÔNG có period
     * tag đáng tin cậy (FE không gửi period khi tạo event qua recordEvent),
     * nên KHÔNG THỂ tự tách 90' vs ET từ event data như _computeScoreFromEvents
     * làm cho recordEvent-driven flow. Do đó với admin path này, homeScore/
     * awayScore LUÔN được hiểu là "tỉ số cuối cùng tại thời điểm gọi" (có thể
     * đã bao gồm ET), và được dùng làm cả homeScore lẫn homeExtraTime khi
     * resultType cần ET — ĐÂY LÀ GIẢ ĐỊNH CHƯA VERIFY được với
     * matchresult.service.ts. Cần xác nhận confirmResultInTx có nhận & xử lý
     * đúng homeExtraTime/awayExtraTime giống confirmResult (dùng ở
     * confirmOfficial) hay không — nếu confirmResultInTx bỏ qua field này,
     * home_extra_time_score sẽ bị null sai lệch dù winner vẫn đúng (vì final
     * score dùng luôn homeScore).
     *
     * FIX (scorers không gắn player_id thật — bug report mới nhất):
     * - Trước đây `input.scorers` LUÔN tạo MatchEvent với player_id=null,
     *   tên cầu thủ chỉ nằm ở `note` (free-text). Hệ quả:
     *     1. PlayerStatistic.goals_scored KHÔNG tăng cho các bàn này —
     *        buildStatDeltas/_updatePlayerStatistics group theo player_id,
     *        player_id=null bị bỏ qua hoàn toàn khỏi thống kê.
     *     2. buildGoalsTimeline() (dùng ở getMatchReport, chính là nguồn
     *        data cho UI kiểu "Alexis Mac Allister 10'") resolve tên qua
     *        `playerNameLookup` (map từ Player thật trong lineup) chứ KHÔNG
     *        đọc `note` — nên trước đây các bàn nhập qua scorers luôn hiện
     *        "Unknown" trên UI report, dù `note` có lưu đúng tên.
     * - Giờ: nếu `AdminScorerInput.playerId` được truyền, dùng nó làm
     *   player_id thật (validate giống hệt pattern đang áp dụng cho
     *   `cards`: teamId phải thuộc match, player phải tồn tại, chưa bị
     *   truất quyền thi đấu). Nếu không có playerId (case chưa có đội hình
     *   chi tiết), giữ hành vi cũ — player_id=null, name chỉ nằm ở note,
     *   goalsTimeline sẽ fallback "Unknown" (không thể tránh khi không có
     *   Player thật để liên kết).
     */
    async adminRecordResult(matchId, input, scheduleOptions) {
        const allowedStatuses = [
            MatchStatus.scheduled,
            MatchStatus.postponed,
            MatchStatus.bye,
            MatchStatus.ongoing,
            MatchStatus.pending_official,
            MatchStatus.needs_review,
        ];
        const resultType = input.resultType ?? MatchResultType.full_time;
        const core = await this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: { status: true, home_team_id: true, away_team_id: true },
            });
            if (!allowedStatuses.includes(match.status)) {
                throw createAppError('CONFLICT', `Match ${matchId} ở '${match.status}' — không thể nhập kết quả. ` +
                    `Dùng correction window (addEvent/editScore) cho match đã finished.`);
            }
            if (input.scorers?.length) {
                for (const s of input.scorers) {
                    assertMinuteInBounds(s.period ?? null, s.minute, undefined);
                }
            }
            if (input.cards?.length) {
                for (const c of input.cards) {
                    assertMinuteInBounds(c.period ?? null, c.minute, undefined);
                }
                for (const c of input.cards) {
                    await assertPlayerNotSentOff(tx, matchId, c.playerId);
                }
            }
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
                    const existing = await tx.matchEvent.findMany({
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
                const validTeamIds = new Set([match.home_team_id, match.away_team_id]);
                const badTeam = input.cards.find(c => !validTeamIds.has(c.teamId));
                if (badTeam)
                    throw createAppError('VALIDATION_ERROR', `Team ${badTeam.teamId} không thuộc match ${matchId}`);
            }
            if (input.scorers?.length) {
                // teamId phải thuộc match — cùng chuẩn với validate của cards.
                const validTeamIds = new Set([match.home_team_id, match.away_team_id]);
                const badScorerTeam = input.scorers.find(s => !validTeamIds.has(s.teamId));
                if (badScorerTeam)
                    throw createAppError('VALIDATION_ERROR', `Team ${badScorerTeam.teamId} không thuộc match ${matchId}`);
                // playerId (nếu có) phải là Player có thật và chưa bị truất
                // quyền thi đấu ở trận này — cùng guard đang áp dụng cho cards,
                // để tránh ghi bàn cho cầu thủ đã nhận thẻ đỏ trước đó.
                const scorerPlayerIds = [...new Set(input.scorers.filter(s => s.playerId != null).map(s => s.playerId))];
                if (scorerPlayerIds.length > 0) {
                    for (const s of input.scorers) {
                        if (s.playerId != null) {
                            await assertPlayerNotSentOff(tx, matchId, s.playerId);
                        }
                    }
                    const existingPlayers = await tx.player.findMany({
                        where: { id: { in: scorerPlayerIds } },
                        select: { id: true },
                    });
                    const foundIds = new Set(existingPlayers.map(p => p.id));
                    const missing = scorerPlayerIds.filter(id => !foundIds.has(id));
                    if (missing.length > 0)
                        throw createAppError('VALIDATION_ERROR', `Player(s) không tồn tại: ${missing.join(', ')}`);
                }
                await tx.matchEvent.createMany({
                    data: input.scorers.map((s) => ({
                        match_id: matchId,
                        team_id: s.teamId,
                        player_id: s.playerId ?? null,
                        type: s.type === "own_goal"
                            ? MatchEventType.own_goal
                            : MatchEventType.goal,
                        minute: s.minute,
                        period: s.period ?? null,
                        note: s.playerName ?? null,
                        time_source: MatchEventTimeSource.estimated,
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
                        time_source: MatchEventTimeSource.estimated,
                    })),
                });
            }
            // Không tự guard draw/penalty ở đây — confirmResultInTx (bên dưới)
            // gọi _guardConfirm, tự throw đúng cho mọi resultType. Chỉ forward
            // field, KHÔNG suy diễn thêm.
            return this.matchResultService.confirmResultInTx(tx, matchId, {
                homeScore: input.homeScore,
                awayScore: input.awayScore,
                homeHalfTimeScore: input.homeHalfTimeScore,
                awayHalfTimeScore: input.awayHalfTimeScore,
                homeExtraTime: input.homeExtraTimeScore,
                awayExtraTime: input.awayExtraTimeScore,
                homePenalty: input.homePenaltyScore,
                awayPenalty: input.awayPenaltyScore,
                resultType,
            });
        });
        return this.matchResultService.runPostConfirmSteps(matchId, core, scheduleOptions);
    }
}
//# sourceMappingURL=match.service.js.map