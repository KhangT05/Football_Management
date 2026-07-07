import { createAppError } from '../common/app.error.js';
import {
    CardColor,
    MatchEventType,
    MatchPeriod,
    MatchResultStatus,
    MatchResultType,
    MatchStatus,
    PhaseFormat,
    Prisma,
    PrismaClient,
} from '../generated/prisma/client.js';
import { ConfirmResultOutput } from '../types/matchResult.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import {
    EXTRA_TIME_PERIODS,
    AddEventInput,
    FinalizeMatchInput,
    ManualScoreInput,
    PERIOD_TRANSITIONS,
    RecordEventInput,
    ResolveAppealInput,
    SCORE_DELTA_BY_TYPE,
    EditEventInput,
    EditScoreInput,
    AdminRecordResultInput,
    DbClient,
    CORRECTION_WINDOW_MS,
} from '../types/match.type.js';
import {
    MatchResultService,
} from './matchresult.service.js';
import { matchForFinalizeSelect, matchForForfeitSelect } from '../types/match.queries.js';
import {
    assertMinuteInBounds,
    assertPlayerNotSentOff,
    isCreditedToHomeTeam, isKnockoutFormat, toMatchResultUpdateOnOverturn,
    toMatchResultUpdateOnUphold, toMatchUpdateOnOverturn
} from '../helper/match.helper.js';



export class MatchLifecycleService {
    constructor(
        private readonly prisma: PrismaClient,
        private readonly matchResultService: MatchResultService,
    ) { }

    async startMatch(matchId: number): Promise<void> {
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

    async transitionPeriod(matchId: number, period: MatchPeriod): Promise<void> {
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

    async recordEvent(matchId: number, input: RecordEventInput): Promise<void> {
        await this.prisma.$transaction(async tx => {
            await tx.$queryRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;

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

            const allowedStatuses: MatchStatus[] = [MatchStatus.ongoing, MatchStatus.pending_official];
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
                },
            });

            if (match.status === MatchStatus.ongoing) {
                await this._applyScoreDelta(tx, matchId, match.home_team_id, input);
            }
        });
    }

    private _deriveCardColor(type: MatchEventType): CardColor | undefined {
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

    private async _applyScoreDelta(
        tx: Prisma.TransactionClient,
        matchId: number,
        homeTeamId: number,
        input: RecordEventInput,
    ): Promise<void> {
        if (!input.teamId) return;
        const delta = SCORE_DELTA_BY_TYPE[input.type];
        if (delta === undefined) return;

        const scoringForHome = isCreditedToHomeTeam(
            homeTeamId,
            input.teamId,
            input.type,
            input.wasOwnGoal,
        );

        await tx.match.update({
            where: { id: matchId },
            data: scoringForHome
                ? { home_score: { increment: delta } }
                : { away_score: { increment: delta } },
        });
    }

    private async _computeScoreFromEvents(
        matchId: number,
        homeTeamId: number,
        client: DbClient = this.prisma,
    ): Promise<{ home90: number; away90: number; homeET: number; awayET: number }> {
        const scoreEventTypes = Object.keys(SCORE_DELTA_BY_TYPE) as MatchEventType[];

        const events = await client.matchEvent.findMany({
            where: { match_id: matchId, type: { in: scoreEventTypes } },
            select: { team_id: true, type: true, period: true },
        });

        let home90 = 0, away90 = 0, homeET = 0, awayET = 0;

        for (const e of events) {
            if (!e.team_id) continue;
            const delta = SCORE_DELTA_BY_TYPE[e.type as MatchEventType];
            if (delta === undefined) continue;

            const forHome = isCreditedToHomeTeam(homeTeamId, e.team_id, e.type as MatchEventType);
            const isET = e.period !== null && EXTRA_TIME_PERIODS.includes(e.period);

            if (isET) {
                if (forHome) homeET += delta; else awayET += delta;
            } else {
                if (forHome) home90 += delta; else away90 += delta;
            }
        }

        return { home90, away90, homeET, awayET };
    }

    async finalizeMatch(
        matchId: number,
        input: FinalizeMatchInput = {},
        _scheduleOptions: OptionalScheduleOptions,
    ): Promise<void> {
        await this.prisma.$transaction(async tx => {
            await tx.$queryRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;

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

    async submitManualScore(
        matchId: number,
        input: ManualScoreInput,
        _scheduleOptions: OptionalScheduleOptions,
    ): Promise<void> {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: { status: true, phase: { select: { format: true, legs: true } }, leg: true, home_team_id: true, away_team_id: true, phase_id: true },
        });

        if (!match) throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);

        if (match.status !== MatchStatus.ongoing)
            throw createAppError('CONFLICT', `Match ${matchId} không ongoing — manual score chỉ dùng trong trận`);

        const eventCount = await this.prisma.matchEvent.count({ where: { match_id: matchId } });
        if (eventCount > 0)
            throw createAppError('CONFLICT', `Match ${matchId} đã có ${eventCount} events — dùng finalizeMatch() thay vì manual score`);

        const resultType = input.resultType ?? MatchResultType.full_time;
        if (match.phase.format === PhaseFormat.knockout && resultType === MatchResultType.full_time) {
            const isTwoLegged = (match.phase.legs as 1 | 2) === 2 && match.leg != null;
            if (!isTwoLegged && input.homeScore === input.awayScore)
                throw createAppError('CONFLICT', `Match ${matchId} đang hoà ${input.homeScore}-${input.awayScore} ở knockout — cần extra_time/penalty`);
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

    async confirmOfficial(
        matchId: number,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<ConfirmResultOutput> {
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

        if (!match) throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);

        if (
            match.status !== MatchStatus.pending_official &&
            match.status !== MatchStatus.needs_review
        )
            throw createAppError('CONFLICT', `Match ${matchId} không ở pending_official/needs_review`);

        const resultType = match.finalize_result_type ?? MatchResultType.full_time;
        const isManual = match.manual_home_score !== null && match.manual_away_score !== null;

        let homeScore: number;
        let awayScore: number;
        let homeExtraTime: number | undefined;
        let awayExtraTime: number | undefined;

        if (isManual) {
            homeScore = match.manual_home_score!;
            awayScore = match.manual_away_score!;
        } else {
            const { home90, away90, homeET, awayET } = await this._computeScoreFromEvents(
                matchId, match.home_team_id,
            );
            homeScore = home90;
            awayScore = away90;

            const hasExtraTime =
                resultType === MatchResultType.extra_time ||
                resultType === MatchResultType.penalty;

            if (hasExtraTime) {
                homeExtraTime = home90 + homeET;
                awayExtraTime = away90 + awayET;
            }
        }

        return this.matchResultService.confirmResult(
            matchId,
            {
                homeScore,
                awayScore,
                homeHalfTimeScore: match.finalize_home_half_time ?? undefined,
                awayHalfTimeScore: match.finalize_away_half_time ?? undefined,
                homeExtraTime,
                awayExtraTime,
                homePenalty: match.finalize_home_penalty ?? undefined,
                awayPenalty: match.finalize_away_penalty ?? undefined,
                resultType,
            },
            scheduleOptions,
        );
    }

    /**
     * FIX (High #4 — claim correctness): bản cũ chỉ SELECT...FOR UPDATE SKIP LOCKED
     * rồi return true/false trong 1 transaction KHÔNG làm gì khác — row lock được
     * giải phóng ngay khi tx đó commit, không có write nào để tạo mutual exclusion
     * thực sự. Hai lần chạy job gần nhau (hoặc 2 instance) đều pass claim check
     * trước khi worker nào gọi confirmOfficial(); bảo vệ thực tế duy nhất trước đây
     * là unique constraint P2002 + string-match "đã có MatchResult" — coupling giữa
     * lỗi nghiệp vụ và logic idempotency, dễ vỡ nếu message đổi.
     *
     * Fix: claim bằng 1 UPDATE có điều kiện, atomic theo MVCC row lock của chính
     * statement UPDATE — chỉ 1 process thắng do Postgres serialize concurrent UPDATE
     * trên cùng row; process thua đọc affected rows = 0 và tự skip. Dùng
     * pending_official_at=NULL làm claim signal (an toàn vì confirmOfficial không
     * đọc field này); review path dùng chính status làm claim signal (đổi thẳng
     * sang needs_review trong 1 statement, không cần SELECT trước).
     */
    async handleGracePeriodTimeout(
        gracePeriodMinutes = 15,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<{ autoOfficiated: number[]; flaggedForReview: number[] }> {
        const cutoff = new Date(Date.now() - gracePeriodMinutes * 60 * 1000);

        const expired = await this.prisma.match.findMany({
            where: {
                status: MatchStatus.pending_official,
                pending_official_at: { lt: cutoff },
            },
            select: { id: true, manual_home_score: true },
        });

        if (expired.length === 0) return { autoOfficiated: [], flaggedForReview: [] };

        const autoIds: number[] = [];
        const reviewCandidateIds: number[] = [];

        for (const m of expired) {
            if (m.manual_home_score !== null) reviewCandidateIds.push(m.id);
            else autoIds.push(m.id);
        }

        const succeededAutoIds: number[] = [];

        for (const matchId of autoIds) {
            const claimed = await this.prisma.$queryRaw<{ id: number }[]>`
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
            } catch (err) {
                const isIdempotencyConflict =
                    err instanceof Error &&
                    (err as any).code === 'CONFLICT' &&
                    (err as any).message?.includes('đã có MatchResult');

                if (isIdempotencyConflict) {
                    console.warn(`[GracePeriod] match ${matchId} đã được confirm trước — skip (idempotent)`);
                } else {
                    console.error(`[GracePeriod] auto-confirm failed for match ${matchId}:`, err);
                    // Claim đã null hoá pending_official_at nhưng confirmOfficial fail —
                    // nếu không reset, match kẹt vĩnh viễn ngoài filter `pending_official_at < cutoff`
                    // ở lần chạy sau (vì now là null). Reset lại mốc cutoff để retry ở lần sau.
                    await this.prisma.match.updateMany({
                        where: { id: matchId, status: MatchStatus.pending_official, pending_official_at: null },
                        data: { pending_official_at: new Date(Date.now() - gracePeriodMinutes * 60 * 1000 - 1000) },
                    });
                }
            }
        }

        const reviewIds: number[] = [];
        for (const matchId of reviewCandidateIds) {
            const claimed = await this.prisma.$queryRaw<{ id: number }[]>`
                UPDATE matches
                SET status = ${MatchStatus.needs_review}
                WHERE id = ${matchId}
                  AND status = ${MatchStatus.pending_official}
                  AND pending_official_at < ${cutoff}
                RETURNING id
            `;
            if (claimed.length > 0) reviewIds.push(matchId);
        }

        return { autoOfficiated: succeededAutoIds, flaggedForReview: reviewIds };
    }

    async forfeitMatch(
        matchId: number,
        forfeitingTeamId: number,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<ConfirmResultOutput> {
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
        const resultType =
            match.status === MatchStatus.scheduled
                ? MatchResultType.walkover
                : MatchResultType.forfeit;

        return this.matchResultService.confirmResult(
            matchId,
            {
                homeScore: winnerIsHome ? rule.forfeit_score : 0,
                awayScore: winnerIsHome ? 0 : rule.forfeit_score,
                resultType,
                explicitWinnerTeamId: winnerIsHome ? match.home_team_id : match.away_team_id,
            },
            scheduleOptions,
        );
    }

    async abandonMatch(matchId: number, minute: number, reason?: string): Promise<void> {
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

    async fileAppeal(matchId: number, reason: string): Promise<void> {
        await this._fileDispute(matchId, reason, MatchResultStatus.under_review);
    }

    async fileProtest(matchId: number, reason: string): Promise<void> {
        await this._fileDispute(matchId, reason, MatchResultStatus.protested);
    }

    private async _fileDispute(
        matchId: number,
        reason: string,
        targetStatus: MatchResultStatus,
    ): Promise<void> {
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

    async resolveAppeal(matchId: number, input: ResolveAppealInput): Promise<void> {
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

        if (
            result.status !== MatchResultStatus.under_review &&
            result.status !== MatchResultStatus.protested
        )
            throw createAppError('CONFLICT', `MatchResult đang ở '${result.status}' — không resolve được`);

        const isKnockout = match.phase.format === PhaseFormat.knockout;

        if (isKnockout && input.resolution === 'overturn') {
            throw createAppError(
                'NOT_IMPLEMENTED',
                `Match ${matchId} là knockout — overturn bracket chưa được hỗ trợ tự động`,
            );
        }

        if (input.resolution === 'uphold') {
            await this.prisma.matchResult.update({
                where: { match_id: matchId },
                data: toMatchResultUpdateOnUphold(input.note),
            });
        } else {
            if (input.newHomeScore === undefined || input.newAwayScore === undefined)
                throw createAppError('VALIDATION_ERROR', 'overturn cần newHomeScore/newAwayScore');

            const newWinner =
                input.newHomeScore === input.newAwayScore
                    ? null
                    : input.newHomeScore > input.newAwayScore
                        ? match.home_team_id
                        : match.away_team_id;

            await this.prisma.$transaction(async tx => {
                await tx.matchResult.update({
                    where: { match_id: matchId },
                    data: toMatchResultUpdateOnOverturn(input.newHomeScore!, input.newAwayScore!, newWinner, input.note),
                });

                await tx.match.update({
                    where: { id: matchId },
                    data: toMatchUpdateOnOverturn(input.newHomeScore!, input.newAwayScore!),
                });
            });
        }

        if (!isKnockout && match.group_id) {
            try {
                await this.matchResultService.recomputeStandingsFor(match.group_id);
            } catch (err) {
                console.error(`[resolveAppeal] recompute standings failed for group ${match.group_id}:`, err);
            }
        }
    }

    private async _assertCorrectionWindow(matchId: number, client: DbClient = this.prisma): Promise<void> {
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
            throw createAppError(
                'FORBIDDEN',
                `Match ${matchId}: correction window đã đóng (${Math.floor(elapsed / 60000)}p sau khi kết thúc, giới hạn 15p)`,
            );
    }

    async addEvent(
        matchId: number,
        input: AddEventInput,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<void> {
        const { groupId, isKnockout } = await this.prisma.$transaction(async tx => {
            await tx.$queryRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;

            await this._assertCorrectionWindow(matchId, tx);

            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: { home_team_id: true },
            });
            // NEW: addEvent không có current_period fallback (input.period bắt buộc ở
            // đây vì match đã finished, không còn "current period" ongoing) — validate
            // trực tiếp trên input.period.
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
                },
            });

            return this._recalculateResultTx(tx, matchId, match.home_team_id);
        });

        await this._runPostCorrectionSteps(matchId, groupId, isKnockout);
    }

    async deleteEvent(
        matchId: number,
        eventId: number,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<void> {
        const { groupId, isKnockout } = await this.prisma.$transaction(async tx => {
            await tx.$queryRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;

            await this._assertCorrectionWindow(matchId, tx);

            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: { home_team_id: true },
            });

            const event = await tx.matchEvent.findUnique({
                where: { id: eventId },
                select: { match_id: true },
            });

            if (!event)
                throw createAppError('NOT_FOUND', `Event ${eventId} không tồn tại`);
            if (event.match_id !== matchId)
                throw createAppError('VALIDATION_ERROR', `Event ${eventId} không thuộc match ${matchId}`);

            await tx.matchEvent.delete({ where: { id: eventId } });

            return this._recalculateResultTx(tx, matchId, match.home_team_id);
        });

        await this._runPostCorrectionSteps(matchId, groupId, isKnockout);
    }

    async editEvent(
        matchId: number,
        eventId: number,
        input: EditEventInput,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<void> {
        if (input.playerId != null) {
            const exists = await this.prisma.player.findUnique({ where: { id: input.playerId }, select: { id: true } });
            if (!exists) throw createAppError('VALIDATION_ERROR', `Player ${input.playerId} không tồn tại`);
        }
        if (input.teamId != null) {
            const exists = await this.prisma.team.findUnique({ where: { id: input.teamId }, select: { id: true } });
            if (!exists) throw createAppError('VALIDATION_ERROR', `Team ${input.teamId} không tồn tại`);
        }
        if (input.subOutPlayerId != null) {
            const exists = await this.prisma.player.findUnique({ where: { id: input.subOutPlayerId }, select: { id: true } });
            if (!exists) throw createAppError('VALIDATION_ERROR', `Player ${input.subOutPlayerId} (subOut) không tồn tại`);
        }

        const { groupId, isKnockout } = await this.prisma.$transaction(async tx => {
            await tx.$queryRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;

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

            const updateData: Prisma.MatchEventUncheckedUpdateInput = {};
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

            if (input.teamId !== undefined) updateData.team_id = input.teamId;
            if (input.minute !== undefined) updateData.minute = input.minute;
            if (input.addedMinute !== undefined) updateData.added_minute = input.addedMinute;
            if (input.period !== undefined) updateData.period = input.period;
            if (input.note !== undefined) updateData.note = input.note;
            if (input.subOutPlayerId !== undefined) updateData.sub_out_player_id = input.subOutPlayerId;

            await tx.matchEvent.update({
                where: { id: eventId },
                data: updateData,
            });

            return this._recalculateResultTx(tx, matchId, match.home_team_id);
        });

        await this._runPostCorrectionSteps(matchId, groupId, isKnockout);
    }

    /**
     * FIX (Critical #2): lock row FOR UPDATE + check eventCount + gọi
     * matchResultService.overrideResultInTx TRONG CÙNG transaction — trước đây
     * 3 bước này không transaction, không lock, TOCTOU với addEvent/deleteEvent/
     * editEvent (đã lock). Xem chi tiết ở comment overrideResultInTx.
     */
    async editScore(
        matchId: number,
        input: EditScoreInput,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<void> {
        const { isKnockout, groupId } = await this.prisma.$transaction(async tx => {
            await tx.$queryRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;

            await this._assertCorrectionWindow(matchId, tx);

            const eventCount = await tx.matchEvent.count({ where: { match_id: matchId } });
            if (eventCount > 0)
                throw createAppError('CONFLICT', `Match ${matchId} có ${eventCount} events — dùng addEvent/deleteEvent/editEvent thay vì editScore`);

            return this.matchResultService.overrideResultInTx(tx, matchId, input);
        });

        if (!isKnockout && groupId) {
            try {
                await this.matchResultService.recomputeStandingsFor(groupId);
            } catch (err) {
                console.error(`[editScore] recompute standings failed for group ${groupId}:`, err);
            }
        }

        try {
            await this.matchResultService.recomputePlayerStats(matchId);
        } catch (err) {
            console.error(`[editScore] recompute player stats failed for match ${matchId}:`, err);
        }
    }

    private async _recalculateResultTx(
        tx: Prisma.TransactionClient,
        matchId: number,
        homeTeamId: number,
    ): Promise<{ groupId: number | null; isKnockout: boolean }> {
        const match = await tx.match.findUniqueOrThrow({
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

        const { home90, away90, homeET, awayET } = await this._computeScoreFromEvents(matchId, homeTeamId, tx);

        const resultType = match.matchResult.result_type;
        const hasExtraTime =
            resultType === MatchResultType.extra_time ||
            resultType === MatchResultType.penalty;

        const homeExtraTime = hasExtraTime ? home90 + homeET : null;
        const awayExtraTime = hasExtraTime ? away90 + awayET : null;

        const homeFinal = homeExtraTime ?? home90;
        const awayFinal = awayExtraTime ?? away90;

        const homePenalty = match.matchResult.home_penalty_score;
        const awayPenalty = match.matchResult.away_penalty_score;
        let winnerTeamId: number | null = null;

        if (resultType === MatchResultType.penalty && homePenalty !== null && awayPenalty !== null) {
            winnerTeamId = homePenalty > awayPenalty ? homeTeamId : match.away_team_id;
        } else {
            winnerTeamId = homeFinal > awayFinal ? homeTeamId
                : awayFinal > homeFinal ? match.away_team_id
                    : null;
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

        return {
            groupId: match.group_id,
            isKnockout: isKnockoutFormat(match.phase.format),
        };
    }

    private async _runPostCorrectionSteps(
        matchId: number,
        groupId: number | null,
        isKnockout: boolean,
    ): Promise<void> {
        if (!isKnockout && groupId) {
            try {
                await this.matchResultService.recomputeStandingsFor(groupId);
            } catch (err) {
                console.error(`[correction] recompute standings failed for group ${groupId}:`, err);
            }
        }

        try {
            await this.matchResultService.recomputePlayerStats(matchId);
        } catch (err) {
            console.error(`[correction] recompute player stats failed for match ${matchId}:`, err);
        }
    }

    /**
     * FIX (Critical #1 — atomicity): trước đây createMany(scorers/cards) chạy
     * trong 1 transaction riêng, sau đó confirmResult() mở transaction thứ 2 độc
     * lập. confirmResult throw (P2002 race, validation resultType/penalty, guard
     * knockout draw...) → events đã insert vẫn commit, orphan không có MatchResult.
     * Retry sau lỗi → duplicate events (không unique constraint chặn). Cũng không
     * lock row trong khi status cho phép cả 'ongoing' — race với recordEvent (đã lock).
     *
     * Fix: gộp toàn bộ vào 1 transaction có FOR UPDATE lock — status check + card
     * validation đọc lại TRONG lock (đóng TOCTOU với check ngoài lock cũ), event
     * insert, rồi confirmResultInTx (matchresult.service.ts) chạy guard+write
     * MatchResult/Match/PlayerStatistic cùng transaction. Post-commit steps
     * (standings/knockout advance) dùng chung runPostConfirmSteps với confirmResult().
     */
    async adminRecordResult(
        matchId: number,
        input: AdminRecordResultInput,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<ConfirmResultOutput> {
        const allowedStatuses: MatchStatus[] = [
            MatchStatus.scheduled,
            MatchStatus.postponed,
            MatchStatus.bye,
            MatchStatus.ongoing,
            MatchStatus.pending_official,
            MatchStatus.needs_review,
        ];

        const resultType = input.resultType ?? MatchResultType.full_time;

        const core = await this.prisma.$transaction(async tx => {
            await tx.$queryRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;

            const match = await tx.match.findUniqueOrThrow({
                where: { id: matchId },
                select: { status: true, home_team_id: true, away_team_id: true },
            });

            if (!allowedStatuses.includes(match.status)) {
                throw createAppError(
                    'CONFLICT',
                    `Match ${matchId} ở '${match.status}' — không thể nhập kết quả. ` +
                    `Dùng correction window (addEvent/editScore) cho match đã finished.`,
                );
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
                // Không cần assertPlayerNotSentOff ở đây vì đây là batch nhập 1 lần cho match
                // chưa có event nào từ trước (allowedStatuses bao gồm scheduled/postponed/bye) —
                // nhưng NẾU status là ongoing/pending_official/needs_review (đã có event cũ),
                // vẫn cần check để tránh nhập thẻ cho player đã bị đuổi từ batch trước.
                for (const c of input.cards) {
                    await assertPlayerNotSentOff(tx, matchId, c.playerId);
                }
            }

            if (input.cards?.length) {
                const yellowsInBatch = input.cards.filter(c => c.type === MatchEventType.yellow_card);

                const seen = new Set<number>();
                for (const c of yellowsInBatch) {
                    if (seen.has(c.playerId))
                        throw createAppError(
                            'VALIDATION_ERROR',
                            `Player ${c.playerId}: 2 yellow_card trong cùng submit — dùng type 'second_yellow' cho thẻ thứ 2`,
                        );
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
                        throw createAppError(
                            'VALIDATION_ERROR',
                            `Player(s) đã có yellow_card từ trước: ${existing.map(e => e.player_id).join(', ')} — dùng 'second_yellow'`,
                        );
                }

                const validTeamIds = new Set([match.home_team_id, match.away_team_id]);
                const badTeam = input.cards.find(c => !validTeamIds.has(c.teamId));
                if (badTeam)
                    throw createAppError(
                        'VALIDATION_ERROR',
                        `Team ${badTeam.teamId} không thuộc match ${matchId}`,
                    );
            }

            if (input.scorers?.length) {
                await tx.matchEvent.createMany({
                    data: input.scorers.map((s) => ({
                        match_id: matchId,
                        team_id: s.teamId,
                        player_id: null,
                        type:
                            s.type === "own_goal"
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

            return this.matchResultService.confirmResultInTx(tx, matchId, {
                homeScore: input.homeScore,
                awayScore: input.awayScore,
                homeHalfTimeScore: input.homeHalfTimeScore,
                awayHalfTimeScore: input.awayHalfTimeScore,
                resultType,
            });
        });

        return this.matchResultService.runPostConfirmSteps(matchId, core, scheduleOptions);
    }
}