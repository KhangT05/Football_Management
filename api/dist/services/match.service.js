import { createAppError } from '../common/app.error.js';
import { CardColor, MatchEventType, MatchPeriod, MatchResultStatus, MatchResultType, MatchStatus, PhaseFormat, } from '../generated/prisma/client.js';
import { EXTRA_TIME_PERIODS, isCreditedToHomeTeam, PERIOD_TRANSITIONS, SCORE_DELTA_BY_TYPE, } from '../types/match.type.js';
import { toMatchResultUpdateOnUphold, toMatchResultUpdateOnOverturn, toMatchUpdateOnOverturn, } from './matchresult.service.js';
import { matchForFinalizeSelect, matchForForfeitSelect } from '../types/match.queries.js';
// ─── Correction window ────────────────────────────────────────────────────────
// Sau khi match finished, admin có 15p để patch events/score nếu có sai sót.
// Sau 15p: lock hoàn toàn, mọi edit bị reject.
// Match status KHÔNG đổi — vẫn giữ nguyên finished.
// Flow correction:
//   addEvent()      → thêm event bị sót
//   deleteEvent()   → xóa event nhập sai
//   editEvent()     → sửa minute/type/player của event
//   editScore()     → override manual score trực tiếp (manual path không có events)
//   Mỗi operation trên tự gọi _recalculateResult() để recompute MatchResult từ events.
const CORRECTION_WINDOW_MS = 15 * 60 * 1000; // 15 phút
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
//   submitManualScore()  → pending_official  (lưu score vào Match, KHÔNG tạo MatchResult)
//   [grace period 15p]   → timeout → needs_review (admin xác nhận thủ công)
//   confirmOfficial()    → dùng manual score → INSERT MatchResult → finished
//   [correction 15p]     → editScore() override MatchResult trực tiếp
//
// Lý do tách finalizeMatch và confirmOfficial:
//   referee cần 15p grace để bổ sung events bị sót sau còi kết thúc.
//   Nếu tạo MatchResult ngay lúc finalize, events nhập trong grace period
//   sẽ không reflect vào result — drift giữa match_events và match_results.
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
    // Guard mở rộng: cho phép nhập event khi pending_official (grace period 15p).
    // Sau confirmOfficial() → finished → block hoàn toàn (dùng addEvent trong correction window).
    //
    // Live score (Match.home_score / away_score) chỉ update khi ongoing.
    // Grace period: event nhập bổ sung, live display không có ý nghĩa sau còi cuối.
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
            // Second yellow guard — referee phải dùng type 'second_yellow' thay vì nhập yellow lần 2
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
                    throw createAppError('VALIDATION_ERROR', `Player ${input.playerId} đã có thẻ vàng trong trận này — dùng type 'second_yellow'`);
            }
            await tx.matchEvent.create({
                data: {
                    match_id: matchId,
                    player_id: input.playerId,
                    team_id: input.teamId,
                    type: input.type,
                    minute: input.minute,
                    added_minute: input.addedMinute,
                    period: match.current_period ?? undefined,
                    note: input.note,
                    card_color: this._deriveCardColor(input.type),
                    sub_out_player_id: input.subOutPlayerId,
                },
            });
            // Live score update chỉ khi ongoing.
            // pending_official: _computeScoreFromEvents() sẽ tính lại từ đầu khi confirmOfficial,
            // nên không cần update live score ở đây (tránh drift nếu goal_disallowed được nhập sau).
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
    // Source of truth duy nhất cho kết quả cuối.
    // Gọi tại confirmOfficial() và finalizeMatch() (chỉ để validate knockout draw sớm).
    // KHÔNG gọi để tạo MatchResult — đó là việc của confirmResult().
    // Cũng gọi tại _recalculateResult() sau correction.
    //
    // Return:
    //   home90/away90 = goals trong 90p (first_half + second_half)
    //   homeET/awayET = goals chỉ trong ET (extra_time_first + extra_time_second)
    //   Cumulative ET score = home90 + homeET — tính ở caller khi cần.
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
    // Referee bấm "kết thúc trận" — chuyển sang grace period 15p.
    // KHÔNG tạo MatchResult ở đây. MatchResult chỉ tạo tại confirmOfficial().
    //
    // Lưu referee input (resultType, penalty, half-time) vào Match để confirmOfficial()
    // dùng lại — referee không cần nhập lại khi confirm.
    //
    // Validate knockout draw sớm — tránh referee chờ 15p rồi confirmOfficial mới báo lỗi.
    async finalizeMatch(matchId, input = {}, _scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: matchForFinalizeSelect,
        });
        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ở trạng thái ongoing`);
        const resultType = input.resultType ?? MatchResultType.full_time;
        // Validate knockout draw sớm — preview score từ events, chưa commit gì
        if (match.phase.format === PhaseFormat.knockout &&
            resultType === MatchResultType.full_time) {
            const { home90, away90 } = await this._computeScoreFromEvents(matchId, match.home_team_id);
            if (home90 === away90)
                throw createAppError('CONFLICT', `Match ${matchId} đang hoà ${home90}-${away90} ở knockout — cần extra_time/penalty`);
        }
        await this.prisma.match.update({
            where: { id: matchId },
            data: {
                status: MatchStatus.pending_official,
                pending_official_at: new Date(),
                // Persist referee input để confirmOfficial() dùng lại
                // Score KHÔNG lưu ở đây — sẽ compute lại từ events lúc confirm
                finalize_result_type: resultType,
                finalize_home_half_time: input.homeHalfTimeScore ?? null,
                finalize_away_half_time: input.awayHalfTimeScore ?? null,
                finalize_home_penalty: input.homePenaltyScore ?? null,
                finalize_away_penalty: input.awayPenaltyScore ?? null,
            },
        });
    }
    // ─── Manual score (fallback — không có events) ────────────────────────────
    // Dùng khi referee không nhập events realtime (giải nhỏ, không có app).
    // Score lấy trực tiếp từ input — không gọi _computeScoreFromEvents.
    // Player stats sẽ trống (không có events → không có gì để aggregate).
    //
    // Guard: reject nếu match đã có events để tránh conflict giữa 2 nguồn score.
    // Grace period timeout: manual path → flag needs_review thay vì auto-official.
    async submitManualScore(matchId, input, _scheduleOptions) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: { status: true },
        });
        if (!match)
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);
        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ongoing — manual score chỉ dùng trong trận`);
        // Guard: nếu đã có events thì không cho nhập manual — yêu cầu dùng finalizeMatch()
        // Tránh silent data loss: confirmOfficial() sẽ ưu tiên manual path nếu manual_home_score != null,
        // bỏ qua toàn bộ events đã nhập
        const eventCount = await this.prisma.matchEvent.count({
            where: { match_id: matchId },
        });
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
                // Half-time không collect ở manual path
                finalize_home_half_time: null,
                finalize_away_half_time: null,
            },
        });
    }
    // ─── Confirm official ─────────────────────────────────────────────────────
    // Nơi DUY NHẤT tạo MatchResult.
    // Referee gọi sau grace period, hoặc admin gọi cho needs_review match.
    //
    // Event path: compute score từ toàn bộ events tại thời điểm này
    //             (bao gồm events nhập trong grace period 15p)
    // Manual path: dùng manual_home_score / manual_away_score, bỏ qua events
    //
    // ET score convention: homeExtraTime = cumulative (home90 + homeET)
    //   → home_extra_time_score = score sau ET (không phải ET-only goals)
    //   → home_final_score = homeExtraTime (cho penalty: ET score, không cộng penalty)
    //
    // Sau confirm → played_at được set → correction window bắt đầu tính từ đây.
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
        // Cho phép cả needs_review — admin confirm thủ công cho manual-score match
        if (match.status !== MatchStatus.pending_official &&
            match.status !== MatchStatus.needs_review)
            throw createAppError('CONFLICT', `Match ${matchId} không ở pending_official/needs_review — không confirm được`);
        const resultType = match.finalize_result_type ?? MatchResultType.full_time;
        const isManual = match.manual_home_score !== null && match.manual_away_score !== null;
        let homeScore;
        let awayScore;
        let homeExtraTime;
        let awayExtraTime;
        if (isManual) {
            // Manual path — score từ referee input, không có event breakdown
            // ET không thể tách ra từ manual input → homeExtraTime = undefined
            homeScore = match.manual_home_score;
            awayScore = match.manual_away_score;
        }
        else {
            // Event path — compute từ toàn bộ events (kể cả events nhập trong grace period)
            const { home90, away90, homeET, awayET } = await this._computeScoreFromEvents(matchId, match.home_team_id);
            homeScore = home90;
            awayScore = away90;
            const hasExtraTime = resultType === MatchResultType.extra_time ||
                resultType === MatchResultType.penalty;
            if (hasExtraTime) {
                // Cumulative: home_extra_time_score = score sau ET (90p + ET goals)
                homeExtraTime = home90 + homeET;
                awayExtraTime = away90 + awayET;
            }
        }
        // confirmResult tạo MatchResult + update stats + standings + knockout advance
        // played_at được set trong confirmResult → correction window bắt đầu từ đây
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
    // Gọi bởi cron/BullMQ worker — KHÔNG dùng setTimeout trong process.
    // Chạy mỗi 2p, tìm match pending_official đã quá gracePeriodMinutes.
    //
    // Strategy:
    //   event-based  → auto confirmOfficial (score có events, đủ tin cậy)
    //   manual-based → flag needs_review    (không có events, cần admin xác nhận)
    //
    // Event-based phải xử lý per-match (không batch) vì confirmOfficial gọi
    // confirmResult → standings recompute + knockout advance, mỗi match có side-effect riêng.
    // Manual-based batch update được vì chỉ đổi status, không có side-effect phụ.
    async handleGracePeriodTimeout(gracePeriodMinutes = 15, scheduleOptions) {
        const cutoff = new Date(Date.now() - gracePeriodMinutes * 60 * 1000);
        const expired = await this.prisma.match.findMany({
            where: {
                status: MatchStatus.pending_official,
                pending_official_at: { lt: cutoff },
            },
            select: {
                id: true,
                manual_home_score: true,
            },
        });
        if (expired.length === 0)
            return { autoOfficiated: [], flaggedForReview: [] };
        const autoIds = [];
        const reviewIds = [];
        for (const m of expired) {
            if (m.manual_home_score !== null) {
                reviewIds.push(m.id);
            }
            else {
                autoIds.push(m.id);
            }
        }
        // Event-based: auto confirm từng match
        const confirmErrors = [];
        for (const matchId of autoIds) {
            try {
                await this.confirmOfficial(matchId, scheduleOptions);
            }
            catch (err) {
                // Không throw — tiếp tục xử lý các match khác
                // Log lại để retry hoặc alert admin
                confirmErrors.push({ matchId, error: err });
                console.error(`[GracePeriod] auto-confirm failed for match ${matchId}:`, err);
            }
        }
        // Manual-based: batch update sang needs_review
        if (reviewIds.length > 0) {
            await this.prisma.match.updateMany({
                where: { id: reviewIds.length === 1 ? { equals: reviewIds[0] } : { in: reviewIds } },
                data: { status: MatchStatus.needs_review },
            });
            // TODO: emit notification tới admin dashboard / webhook
        }
        const succeededAutoIds = autoIds.filter(id => !confirmErrors.some(e => e.matchId === id));
        return { autoOfficiated: succeededAutoIds, flaggedForReview: reviewIds };
    }
    // ─── Forfeit / walkover ───────────────────────────────────────────────────
    // Do BTC quyết định — bypass grace period, confirmResult trực tiếp.
    // STATUS_BY_RESULT_TYPE map forfeit/walkover → MatchStatus.forfeited (không qua pending_official).
    //
    // Phân biệt:
    //   walkover  = match chưa diễn ra (scheduled), team không xuất hiện
    //   forfeit   = match đang/đã diễn ra, team bỏ cuộc hoặc vi phạm luật
    async forfeitMatch(matchId, forfeitingTeamId, scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: matchForForfeitSelect,
        });
        if (match.status === MatchStatus.finished ||
            match.status === MatchStatus.forfeited)
            throw createAppError('CONFLICT', `Match ${matchId} đã '${match.status}' — không forfeit được`);
        if (forfeitingTeamId !== match.home_team_id &&
            forfeitingTeamId !== match.away_team_id)
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
    // Match bị dừng giữa chừng (thời tiết, bạo lực...).
    // TECH DEBT: reuse field postponed_reason cho abandoned_reason — cần field riêng.
    async abandonMatch(matchId, minute, reason) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { status: true, postponed_reason: true },
        });
        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ongoing — không abandon được`);
        // TECH DEBT: cần field abandoned_reason riêng.
        // Hiện tại reuse postponed_reason — chặn nếu đã có giá trị để tránh ghi đè.
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
    // Chỉ file được khi MatchResult.status = official.
    // appeal  = khiếu nại → under_review
    // protest = phản đối chính thức → protested
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
        const isKnockout = match.phase.format === PhaseFormat.knockout;
        if (!isKnockout && match.group_id) {
            await this.matchResultService.recomputeStandingsFor(match.group_id);
        }
        // Knockout overturn cần manual bracket correction — không thể tự động an toàn
        // (winner có thể đã advance và thi đấu trận tiếp theo)
        if (isKnockout && input.resolution === 'overturn') {
            throw createAppError('NOT_IMPLEMENTED', `Match ${matchId} là knockout — overturn bracket chưa được hỗ trợ tự động`);
        }
    }
    // ─── Correction window (admin only, sau finished) ─────────────────────────
    // Cho phép sửa events/score trong 15p sau khi match finished (played_at).
    // Match status KHÔNG đổi — vẫn giữ nguyên finished.
    // Sau mỗi operation: recompute MatchResult từ events → update standings/stats.
    //
    // Dùng khi:
    //   - Referee nhập sai event (sai player, sai phút, sai loại)
    //   - Quên nhập event trong cả grace period
    //   - Manual path: override score sau khi phát hiện sai
    //
    // KHÔNG dùng để:
    //   - Đổi match status (finished → bất kỳ status nào khác)
    //   - Thay đổi kết quả vì lý do khiếu nại (→ fileAppeal / fileProtest)
    //
    // Guard _assertCorrectionWindow() dùng chung cho tất cả correction ops.
    async _assertCorrectionWindow(matchId) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { status: true, played_at: true },
        });
        // Chỉ cho phép sửa khi match đã finished
        if (match.status !== MatchStatus.finished)
            throw createAppError('CONFLICT', `Match ${matchId} chưa finished — correction chỉ áp dụng sau khi xác nhận kết quả`);
        // Lock sau 15p kể từ played_at
        if (!match.played_at)
            throw createAppError('CONFLICT', `Match ${matchId} thiếu played_at — không xác định được correction window`);
        const elapsed = Date.now() - match.played_at.getTime();
        if (elapsed > CORRECTION_WINDOW_MS)
            throw createAppError('FORBIDDEN', `Match ${matchId}: correction window đã đóng (${Math.floor(elapsed / 60000)}p sau khi kết thúc, giới hạn 15p)`);
    }
    // ─── addEvent (correction) ────────────────────────────────────────────────
    // Thêm event bị sót sau khi match finished.
    // Gọi _recalculateResult() sau khi insert để recompute MatchResult.
    //
    // period phải được truyền tường minh — không có current_period sau finished.
    // Second yellow guard vẫn apply để tránh double yellow trong correction.
    async addEvent(matchId, input, // period bắt buộc trong correction
    scheduleOptions) {
        await this._assertCorrectionWindow(matchId);
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { home_team_id: true },
        });
        // Second yellow guard — apply ngay cả trong correction
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
        // Recompute MatchResult từ toàn bộ events sau khi thêm
        await this._recalculateResult(matchId, match.home_team_id, scheduleOptions);
    }
    // ─── deleteEvent (correction) ─────────────────────────────────────────────
    // Xóa event nhập sai.
    // Gọi _recalculateResult() sau khi delete.
    async deleteEvent(matchId, eventId, scheduleOptions) {
        await this._assertCorrectionWindow(matchId);
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: { home_team_id: true },
        });
        // Verify event thuộc match này trước khi xóa
        const event = await this.prisma.matchEvent.findUnique({
            where: { id: eventId },
            select: { match_id: true },
        });
        if (!event)
            throw createAppError('NOT_FOUND', `Event ${eventId} không tồn tại`);
        if (event.match_id !== matchId)
            throw createAppError('VALIDATION_ERROR', `Event ${eventId} không thuộc match ${matchId}`);
        await this.prisma.matchEvent.delete({ where: { id: eventId } });
        // Recompute MatchResult sau khi xóa event
        await this._recalculateResult(matchId, match.home_team_id, scheduleOptions);
    }
    // ─── editEvent (correction) ───────────────────────────────────────────────
    // Sửa các field của event (minute, type, player, team, period, note).
    // Chỉ update field được truyền vào — partial patch.
    // Gọi _recalculateResult() sau khi update.
    //
    // Lưu ý: nếu sửa type → card_color cần derive lại.
    // Nếu sửa player → yellow guard cần re-check với player mới.
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
        // Nếu type hoặc player thay đổi, re-check yellow guard với state mới
        const newType = input.type ?? event.type;
        const newPlayerId = input.playerId ?? event.player_id;
        if (newType === MatchEventType.yellow_card && newPlayerId) {
            const existingYellow = await this.prisma.matchEvent.findFirst({
                where: {
                    match_id: matchId,
                    player_id: newPlayerId,
                    type: MatchEventType.yellow_card,
                    // Exclude event đang edit — nếu chính event này là yellow cũ thì không conflict
                    NOT: { id: eventId },
                },
                select: { id: true },
            });
            if (existingYellow)
                throw createAppError('VALIDATION_ERROR', `Player ${newPlayerId} đã có thẻ vàng trong trận này — dùng type 'second_yellow'`);
        }
        // Build update data — chỉ field được truyền vào
        const updateData = {};
        if (input.type !== undefined) {
            updateData.type = input.type;
            // Derive lại card_color khi type thay đổi
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
        if ('period' in input && input.period !== undefined)
            updateData.period = input.period;
        if (input.note !== undefined)
            updateData.note = input.note;
        if (input.subOutPlayerId !== undefined)
            updateData.sub_out_player_id = input.subOutPlayerId;
        await this.prisma.matchEvent.update({
            where: { id: eventId },
            data: updateData,
        });
        // Recompute MatchResult sau khi sửa event
        await this._recalculateResult(matchId, match.home_team_id, scheduleOptions);
    }
    // ─── editScore (correction — manual path) ────────────────────────────────
    // Override score trực tiếp khi match dùng manual path (không có events).
    // Nếu match có events thì dùng addEvent/deleteEvent/editEvent để fix events,
    // rồi để _recalculateResult() tự compute — không override thủ công.
    //
    // Guard: reject nếu match có events (dùng event correction thay vì override).
    async editScore(matchId, input, scheduleOptions) {
        await this._assertCorrectionWindow(matchId);
        const eventCount = await this.prisma.matchEvent.count({
            where: { match_id: matchId },
        });
        if (eventCount > 0)
            throw createAppError('CONFLICT', `Match ${matchId} có ${eventCount} events — dùng addEvent/deleteEvent/editEvent thay vì editScore`);
        // Delegate sang matchResultService để update MatchResult + standings
        await this.matchResultService.overrideResult(matchId, input, scheduleOptions);
    }
    // ─── _recalculateResult (internal) ───────────────────────────────────────
    // Recompute score từ toàn bộ events hiện tại → update MatchResult + standings + player stats.
    // Gọi bởi addEvent / deleteEvent / editEvent sau mỗi correction.
    //
    // Không tạo MatchResult mới — update existing record.
    // Update Match.home_score / away_score để mirror MatchResult (query list không cần join).
    //
    // Standings recompute: chỉ cho group phase — knockout bracket không có standings.
    // Player stats recompute: full recompute từ events (stats có thể thay đổi khi event sửa).
    async _recalculateResult(matchId, homeTeamId, scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: {
                group_id: true,
                away_team_id: true,
                phase: { select: { format: true } },
                matchResult: {
                    select: {
                        id: true,
                        result_type: true,
                        home_penalty_score: true,
                        away_penalty_score: true,
                        home_half_time_score: true,
                        away_half_time_score: true,
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
        // homeFinal = score dùng cho standings display
        // Penalty: final = ET score; ET: final = cumulative; full_time: final = 90p score
        const homeFinal = homeExtraTime ?? home90;
        const awayFinal = awayExtraTime ?? away90;
        // Winner resolution sau khi recompute
        const homePenalty = match.matchResult.home_penalty_score;
        const awayPenalty = match.matchResult.away_penalty_score;
        let winnerTeamId = null;
        if (resultType === MatchResultType.penalty && homePenalty !== null && awayPenalty !== null) {
            winnerTeamId = homePenalty > awayPenalty ? homeTeamId : match.away_team_id;
        }
        else if (resultType === MatchResultType.extra_time) {
            winnerTeamId = homeFinal > awayFinal ? homeTeamId
                : awayFinal > homeFinal ? match.away_team_id
                    : null;
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
                    home_score: home90,
                    away_score: away90,
                    home_extra_time_score: homeExtraTime,
                    away_extra_time_score: awayExtraTime,
                    home_final_score: homeFinal,
                    away_final_score: awayFinal,
                    winner_team_id: winnerTeamId,
                    // Penalty scores giữ nguyên — không recompute từ events (penalty shootout events riêng)
                    // half-time giữ nguyên từ confirm — không có source nào để recompute
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
        // Standings recompute — ngoài TX vì đọc nhiều rows
        // Nếu fail: MatchResult đã update → cần retry standalone hoặc background job
        if (!isKnockoutFormat(match.phase.format) && match.group_id) {
            await this.matchResultService.recomputeStandingsFor(match.group_id);
        }
        // Player stats recompute toàn bộ từ events hiện tại
        // Gọi ngoài TX — stats là derived data, chấp nhận eventual consistency ngắn
        await this.matchResultService.recomputePlayerStats(matchId, scheduleOptions);
    }
}
// ─── Helpers ──────────────────────────────────────────────────────────────────
function isKnockoutFormat(format) {
    return format === PhaseFormat.knockout;
}
//# sourceMappingURL=match.service.js.map