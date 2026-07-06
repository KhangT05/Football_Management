import {
    MatchEventType,
    MatchResultType,
    MatchStatus,
    PhaseFormat,
    Prisma,
    PrismaClient,
} from '../generated/prisma/client.js';
import { createAppError } from '../common/app.error.js';
import {
    ConfirmResultInput,
    ConfirmResultOutput,
    STATUS_BY_RESULT_TYPE,
    WinnerResolution,
} from '../types/matchResult.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { KnockoutService } from './knockout.service.js';
import { StandingsService } from './standing.service.js';
import { Queryable } from '../libs/queryable.js';
import { PaginatedResult, QueryableConfig, QueryRequest } from '../types/queryable.type.js';
import {
    buildGoalsTimeline,
    buildMatchReportPlayerRows,
    buildStatDeltas,
    MATCH_EVENT_SELECT,
    MatchEventRow,
    MatchForConfirmFull,
    matchForConfirmSelect,
    StatDelta,
    statKey,
    toMatchResultCreateInput,
    toMatchUpdateOnConfirm,
} from '../helper/match.helper.js';
import { EditScoreInput } from '../types/match.type.js';
import { MatchReportOutput } from '../types/matchReport.type.js';

type ConfirmResultInputWithExplicitWinner = ConfirmResultInput & {
    explicitWinnerTeamId?: number | null;
};

type ConfirmResultOutputWithWarnings = ConfirmResultOutput & {
    postCommitWarnings?: string[];
};

// Kết quả trung gian trả ra từ transaction có lock — cần đủ data để chạy
// post-commit steps (standings/knockout advance) SAU khi tx đã commit.
type ConfirmResultCore = {
    matchResultId: number;
    resolution: WinnerResolution;
    isKnockout: boolean;
    phaseId: number;
    seasonId: number;
    groupId: number | null;
};

export class MatchResultService {
    private matchEventQueryable: Queryable<MatchEventRow>;

    constructor(
        private readonly prisma: PrismaClient,
        private readonly knockoutService: KnockoutService,
        private readonly standingsService: StandingsService,
    ) {
        const matchEventConfig: QueryableConfig = {
            select: MATCH_EVENT_SELECT,
            sortable: ['minute', 'added_minute', 'created_at', 'id'],
            defaultSort: { column: 'minute', direction: 'asc' },
            filterable: ['type', 'period'],
            defaultPerPage: 30,
            maxPerPage: 100,
        };

        this.matchEventQueryable = new Queryable<MatchEventRow>(
            this.prisma.matchEvent,
            matchEventConfig,
        );
    }

    async getMatchResult(matchId: number) {
        const result = await this.prisma.matchResult.findUnique({
            where: { match_id: matchId },
            include: {
                winner_team: { select: { id: true, name: true } },
            },
        });

        if (!result) {
            throw createAppError('NOT_FOUND', `Match ${matchId} chưa có kết quả`);
        }

        return result;
    }

    async listMatchEvents(
        matchId: number,
        req: QueryRequest,
    ): Promise<PaginatedResult<MatchEventRow>> {
        const queryReq: QueryRequest = {
            ...req,
            filter: {
                ...(req.filter || {}),
                match_id: { eq: matchId },
            },
        };

        return this.matchEventQueryable.run(queryReq);
    }

    async getMatchPlayerStats(matchId: number) {
        return this.prisma.matchEvent.groupBy({
            by: ['player_id', 'team_id', 'type'],
            where: {
                match_id: matchId,
                player_id: { not: null },
            },
            _count: { type: true },
        });
    }

    /**
     * FIX (root cause #3): _guardConfirm cũ chỉ chặn draw ở resultType=full_time.
     * _resolveWinner case extra_time cũng có thể trả winnerTeamId=null nếu hoà sau
     * hiệp phụ — không có gì chặn input resultType=extra_time với homeExtraTime
     * === awayExtraTime đi qua guard. Hệ quả: knockout match confirm với
     * winner_team_id=null, knockoutAdvanced bị skip (if isKnockout && winnerTeamId)
     * nhưng match status vẫn set finished theo STATUS_BY_RESULT_TYPE — "finished"
     * mà không ai advance bracket, không warning nào log vì code không coi đây là lỗi.
     *
     * overrideResult có guard riêng, tách biệt khỏi _guardConfirm — cùng thiếu sót
     * lặp lại ở 2 nơi. Gộp về 1 helper để tránh drift lần nữa.
     */
    private _knockoutDrawBlocked(
        resultType: MatchResultType,
        input: { homeScore: number; awayScore: number; homeExtraTime?: number; awayExtraTime?: number },
    ): boolean {
        if (resultType === MatchResultType.full_time) {
            return input.homeScore === input.awayScore;
        }
        if (resultType === MatchResultType.extra_time) {
            const h = input.homeExtraTime ?? input.homeScore;
            const a = input.awayExtraTime ?? input.awayScore;
            return h === a;
        }
        return false;
    }

    /**
     * FIX (Critical #1 — atomicity): confirmResult/adminRecordResult trước đây gọi
     * qua 2 transaction độc lập (createMany events ở lifecycle service, rồi
     * confirmResult mở transaction riêng) → nếu confirmResult throw, events đã
     * insert vẫn commit (orphan); nếu caller retry, events insert lại (duplicate,
     * không unique constraint chặn). Tách guard+write ra method nhận `tx` từ
     * ngoài để adminRecordResult có thể gộp event-insert + confirm vào CÙNG 1
     * transaction. confirmResult (public) tự mở transaction riêng khi gọi trực tiếp.
     *
     * Đồng thời fix lock: bản cũ lock match row ở CHÍNH transaction này rồi mới
     * SELECT lại — findUnique ngoài tx cũ đã bị bỏ, mọi guard check giờ đọc từ
     * snapshot đã lock, nhất quán với pattern recordEvent/addEvent đã dùng.
     */
    async confirmResultInTx(
        tx: Prisma.TransactionClient,
        matchId: number,
        input: ConfirmResultInputWithExplicitWinner,
    ): Promise<ConfirmResultCore> {
        await tx.$queryRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;

        const match = await tx.match.findUnique({
            where: { id: matchId },
            select: matchForConfirmSelect,
        });

        if (!match)
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);

        this._guardConfirm(match, input);

        const isKnockout = match.phase.format === PhaseFormat.knockout;
        const seasonId = match.phase.season.id;

        if (!seasonId) {
            throw createAppError('INTERNAL_SERVER_ERROR', `Match ${matchId}: phase không có season`);
        }

        const yellowSuspension = match.phase.season.tournament.tournamentRule?.yellow_cards_suspension ?? 3;
        const resolution = this._resolveWinner(match.home_team_id, match.away_team_id, input);
        const targetMatchStatus = STATUS_BY_RESULT_TYPE[input.resultType] ?? MatchStatus.finished;

        const result = await tx.matchResult.create({
            data: toMatchResultCreateInput(matchId, input, resolution),
            select: { id: true },
        });

        await tx.match.update({
            where: { id: matchId },
            data: toMatchUpdateOnConfirm(resolution, targetMatchStatus),
        });

        await this._updatePlayerStatistics(tx, matchId, seasonId, yellowSuspension);

        return {
            matchResultId: result.id,
            resolution,
            isKnockout,
            phaseId: match.phase_id,
            seasonId,
            groupId: match.group_id,
        };
    }

    /**
     * Post-commit steps (standings recompute, knockout advance) — tách ra để
     * confirmResult() và adminRecordResult() (lifecycle service) dùng chung, tránh
     * lặp lại logic warning-collection ở 2 nơi (nguồn của bug #3 kiểu drift).
     */
    async runPostConfirmSteps(
        matchId: number,
        core: ConfirmResultCore,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<ConfirmResultOutputWithWarnings> {
        const { matchResultId, resolution, isKnockout, phaseId, seasonId, groupId } = core;
        const postCommitWarnings: string[] = [];

        let standingUpdated = false;
        try {
            standingUpdated = await this._tryRecomputeStandings(isKnockout, groupId);
        } catch (err) {
            const msg = `Recompute standings thất bại cho group ${groupId}: ${err instanceof Error ? err.message : String(err)}`;
            console.error(`[confirmResult] ${msg}`);
            postCommitWarnings.push(msg);
        }

        let knockoutAdvanced = false;
        let newMatchId: number | undefined;

        if (isKnockout && resolution.winnerTeamId) {
            try {
                const advance = await this.knockoutService.advanceWinner(
                    phaseId,
                    seasonId,
                    { matchId, winnerTeamId: resolution.winnerTeamId },
                    scheduleOptions,
                );
                knockoutAdvanced = advance.matchCreated;
                newMatchId = advance.newMatchId;
            } catch (err) {
                const msg = `Advance bracket thất bại cho match ${matchId}: ${err instanceof Error ? err.message : String(err)}`;
                console.error(`[confirmResult] ${msg}`);
                postCommitWarnings.push(msg);
            }
        }

        return {
            matchResultId,
            winnerTeamId: resolution.winnerTeamId,
            standingUpdated,
            knockoutAdvanced,
            newMatchId,
            ...(postCommitWarnings.length > 0 && { postCommitWarnings }),
        };
    }

    async confirmResult(
        matchId: number,
        input: ConfirmResultInputWithExplicitWinner,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<ConfirmResultOutputWithWarnings> {
        let core: ConfirmResultCore;
        try {
            core = await this.prisma.$transaction(tx => this.confirmResultInTx(tx, matchId, input));
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')
                throw createAppError('CONFLICT', `Match ${matchId} đã có MatchResult (race condition detected)`);
            throw err;
        }

        return this.runPostConfirmSteps(matchId, core, scheduleOptions);
    }

    /**
     * FIX (Critical #2 — race/TOCTOU): overrideResult trước đây KHÔNG lock row,
     * chạy 2 write riêng (không transaction) sau khi đọc match bằng plain
     * findUniqueOrThrow. editScore (lifecycle service) check eventCount===0 rồi
     * gọi method này — giữa lúc check và lúc write, addEvent/deleteEvent/editEvent
     * (đã có FOR UPDATE lock) có thể insert event + recompute + commit trước, rồi
     * overrideResult ghi đè home_final_score/winner_team_id bằng score input tay
     * → event tồn tại trong DB nhưng score không phản ánh event đó, vỡ invariant
     * "score = f(events)".
     *
     * Fix: tách phần guard+write ra nhận `tx` từ ngoài — editScore (lifecycle)
     * giờ lock row FOR UPDATE, check eventCount, rồi gọi method này TRONG CÙNG
     * transaction đã lock, serialize đúng với các method addEvent/deleteEvent/editEvent.
     */
    async overrideResultInTx(
        tx: Prisma.TransactionClient,
        matchId: number,
        input: EditScoreInput,
    ): Promise<{ isKnockout: boolean; groupId: number | null }> {
        const match = await tx.match.findUniqueOrThrow({
            where: { id: matchId },
            select: {
                home_team_id: true,
                away_team_id: true,
                group_id: true,
                phase: {
                    select: {
                        format: true,
                        season: {
                            select: {
                                id: true,
                                tournament: { select: { tournamentRule: { select: { yellow_cards_suspension: true } } } },
                            },
                        },
                    },
                },
                matchResult: { select: { id: true, result_type: true } },
            },
        });

        if (!match.matchResult)
            throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult`);

        const isKnockout = match.phase.format === PhaseFormat.knockout;

        if (isKnockout) {
            const slot = await tx.bracketSlot.findFirst({
                where: { match_id: matchId },
                select: {
                    fed_as_a: { select: { match_id: true } },
                    fed_as_b: { select: { match_id: true } },
                },
            });
            const parentHasMatch = slot?.fed_as_a?.[0]?.match_id ?? slot?.fed_as_b?.[0]?.match_id;
            if (parentHasMatch)
                throw createAppError(
                    'CONFLICT',
                    `Match ${matchId}: round kế tiếp đã được tạo (match ${parentHasMatch}) — ` +
                    `không thể override winner qua correction window. Dùng resolveAppeal (hiện chưa hỗ trợ overturn cho knockout).`,
                );
        }

        const seasonId = match.phase.season?.id;
        if (!seasonId)
            throw createAppError('INTERNAL_SERVER_ERROR', `Match ${matchId}: phase không có season`);

        const resultType = input.resultType ?? match.matchResult.result_type;

        if (isKnockout && this._knockoutDrawBlocked(resultType, input)) {
            throw createAppError(
                'VALIDATION_ERROR',
                `Match ${matchId}: knockout draw ở ${resultType} — cần resultType=extra_time hoặc penalty, ` +
                `không thể override về tỉ số hoà khi đã confirm với winner xác định.`,
            );
        }

        if (resultType === MatchResultType.penalty) {
            if (input.homePenalty === undefined || input.awayPenalty === undefined)
                throw createAppError('VALIDATION_ERROR', `overrideResult: resultType=penalty cần homePenalty + awayPenalty`);
            if (input.homePenalty === input.awayPenalty)
                throw createAppError('VALIDATION_ERROR', `overrideResult: penalty không được hoà — ${input.homePenalty}-${input.awayPenalty}`);
        }

        const resolution = this._resolveWinner(
            match.home_team_id,
            match.away_team_id,
            {
                homeScore: input.homeScore,
                awayScore: input.awayScore,
                homeExtraTime: input.homeExtraTime,
                awayExtraTime: input.awayExtraTime,
                homePenalty: input.homePenalty,
                awayPenalty: input.awayPenalty,
                resultType,
            },
        );

        await tx.matchResult.update({
            where: { match_id: matchId },
            data: {
                home_final_score: resolution.homeFinal,
                away_final_score: resolution.awayFinal,
                home_extra_time_score: input.homeExtraTime ?? null,
                away_extra_time_score: input.awayExtraTime ?? null,
                home_penalty_score: input.homePenalty ?? null,
                away_penalty_score: input.awayPenalty ?? null,
                ...(input.homeHalfTime !== undefined && { home_half_time_score: input.homeHalfTime }),
                ...(input.awayHalfTime !== undefined && { away_half_time_score: input.awayHalfTime }),
                winner_team_id: resolution.winnerTeamId,
                result_type: resultType,
                ...(input.notes !== undefined && { notes: input.notes }),
                updated_at: new Date(),
            },
        });

        await tx.match.update({
            where: { id: matchId },
            data: {
                home_score: resolution.homeFinal,
                away_score: resolution.awayFinal,
                updated_at: new Date(),
            },
        });

        return { isKnockout, groupId: match.group_id };
    }

    async overrideResult(
        matchId: number,
        input: EditScoreInput,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<void> {
        const { isKnockout, groupId } = await this.prisma.$transaction(async tx => {
            await tx.$queryRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
            return this.overrideResultInTx(tx, matchId, input);
        });

        if (!isKnockout && groupId) {
            try {
                await this.standingsService.recomputeGroupStandings(groupId);
            } catch (err) {
                console.error(`[overrideResult] recompute standings failed for group ${groupId}:`, err);
            }
        }

        try {
            await this.recomputePlayerStats(matchId);
        } catch (err) {
            console.error(`[overrideResult] recompute player stats failed for match ${matchId}:`, err);
        }
    }

    async recomputePlayerStats(matchId: number): Promise<void> {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: {
                phase: {
                    select: {
                        season: {
                            select: {
                                id: true,
                                tournament: {
                                    select: {
                                        tournamentRule: {
                                            select: { yellow_cards_suspension: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const seasonId = match.phase.season?.id;
        if (!seasonId) {
            throw createAppError('INTERNAL_SERVER_ERROR', `Match ${matchId}: phase không có season`);
        }

        const yellowSuspension = match.phase.season.tournament.tournamentRule?.yellow_cards_suspension ?? 3;

        const events = await this.prisma.matchEvent.findMany({
            where: { match_id: matchId },
            select: { player_id: true, team_id: true, type: true },
        });

        const { played } = buildStatDeltas(events);
        if (played.size === 0) return;

        const playerKeys = [...played].map(k => {
            const [pid, tid] = k.split(':').map(Number);
            return { player_id: pid!, team_id: tid! };
        });

        await this._recomputeStatsForPlayers(playerKeys, seasonId, yellowSuspension);
    }

    async recomputeStandingsFor(groupId: number): Promise<void> {
        await this.standingsService.recomputeGroupStandings(groupId);
    }

    private _guardConfirm(match: MatchForConfirmFull, input: ConfirmResultInputWithExplicitWinner): void {
        if (match.status === MatchStatus.finished || match.status === MatchStatus.cancelled)
            throw createAppError('CONFLICT', `Match ${match.id} đã ở status '${match.status}'`);

        if (match.matchResult)
            throw createAppError('CONFLICT', `Match ${match.id} đã có MatchResult`);

        const isKnockout = match.phase.format === PhaseFormat.knockout;
        if (isKnockout && this._knockoutDrawBlocked(input.resultType, input)) {
            throw createAppError(
                'VALIDATION_ERROR',
                `Match ${match.id}: knockout draw ở ${input.resultType} — cần extra_time hoặc penalty`,
            );
        }

        if (input.resultType === MatchResultType.penalty) {
            if (input.homePenalty === undefined || input.awayPenalty === undefined)
                throw createAppError('VALIDATION_ERROR', `Match ${match.id}: resultType=penalty cần homePenalty + awayPenalty`);
            if (input.homePenalty === input.awayPenalty)
                throw createAppError(
                    'VALIDATION_ERROR',
                    `Match ${match.id}: penalty không được hoà — ${input.homePenalty}-${input.awayPenalty}`,
                );
        }
    }

    private _resolveWinner(
        homeTeamId: number,
        awayTeamId: number,
        input: ConfirmResultInputWithExplicitWinner,
    ): WinnerResolution {
        if (input.explicitWinnerTeamId !== undefined && input.explicitWinnerTeamId !== null) {
            return {
                winnerTeamId: input.explicitWinnerTeamId,
                homeFinal: input.homeScore,
                awayFinal: input.awayScore,
            };
        }

        switch (input.resultType) {
            case MatchResultType.full_time: {
                const winnerTeamId =
                    input.homeScore > input.awayScore ? homeTeamId
                        : input.awayScore > input.homeScore ? awayTeamId
                            : null;
                return { winnerTeamId, homeFinal: input.homeScore, awayFinal: input.awayScore };
            }
            case MatchResultType.extra_time: {
                const h = input.homeExtraTime ?? input.homeScore;
                const a = input.awayExtraTime ?? input.awayScore;
                const winnerTeamId = h > a ? homeTeamId : a > h ? awayTeamId : null;
                return { winnerTeamId, homeFinal: h, awayFinal: a };
            }
            case MatchResultType.penalty: {
                const winnerTeamId = input.homePenalty! > input.awayPenalty! ? homeTeamId : awayTeamId;
                const h = input.homeExtraTime ?? input.homeScore;
                const a = input.awayExtraTime ?? input.awayScore;
                return { winnerTeamId, homeFinal: h, awayFinal: a };
            }
            case MatchResultType.forfeit:
            case MatchResultType.walkover: {
                if (input.homeScore === input.awayScore) {
                    throw createAppError(
                        'VALIDATION_ERROR',
                        `resultType=${input.resultType}: homeScore === awayScore (${input.homeScore}) và không có ` +
                        `explicitWinnerTeamId — không xác định được winner. Kiểm tra TournamentRule.forfeit_score, ` +
                        `hoặc truyền explicitWinnerTeamId tường minh.`,
                    );
                }
                const winnerTeamId = input.homeScore > input.awayScore ? homeTeamId : awayTeamId;
                return { winnerTeamId, homeFinal: input.homeScore, awayFinal: input.awayScore };
            }
        }
    }

    private async _updatePlayerStatistics(
        tx: Prisma.TransactionClient,
        matchId: number,
        seasonId: number,
        yellowSuspension: number,
    ): Promise<void> {
        const events = await tx.matchEvent.findMany({
            where: { match_id: matchId },
            select: { player_id: true, team_id: true, type: true },
        });

        if (events.length === 0) return;

        const { played, deltas } = buildStatDeltas(events);
        if (played.size === 0) return;

        const playerKeys = [...played].map(k => {
            const [pid, tid] = k.split(':').map(Number);
            return { player_id: pid!, team_id: tid!, season_id: seasonId };
        });

        const existingStats = await tx.playerStatistic.findMany({
            where: { OR: playerKeys },
            select: { player_id: true, team_id: true, accumulated_yellow_cards: true },
        });

        const accumMap = new Map<string, number>();
        for (const s of existingStats) {
            accumMap.set(statKey(s.player_id, s.team_id), s.accumulated_yellow_cards);
        }

        for (const k of played) {
            const [pidStr, tidStr] = k.split(':');
            const playerId = Number(pidStr);
            const teamId = Number(tidStr);
            const d = deltas.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0 };

            const prevAccum = accumMap.get(k) ?? 0;
            const newAccum = prevAccum + d.yellowCards;

            const isSuspended = newAccum >= yellowSuspension || d.redCards > 0;

            await tx.playerStatistic.upsert({
                where: {
                    player_id_team_id_season_id: {
                        player_id: playerId,
                        team_id: teamId,
                        season_id: seasonId,
                    },
                },
                create: {
                    player_id: playerId,
                    team_id: teamId,
                    season_id: seasonId,
                    matches_played: 1,
                    goals_scored: d.goals,
                    yellow_cards: d.yellowCards,
                    red_cards: d.redCards,
                    accumulated_yellow_cards: newAccum,
                    is_suspended: isSuspended,
                },
                update: {
                    matches_played: { increment: 1 },
                    goals_scored: { increment: d.goals },
                    yellow_cards: { increment: d.yellowCards },
                    red_cards: { increment: d.redCards },
                    accumulated_yellow_cards: newAccum,
                    is_suspended: isSuspended,
                },
            });
        }
    }

    private async _recomputeStatsForPlayers(
        players: { player_id: number; team_id: number }[],
        seasonId: number,
        yellowSuspension: number,
    ): Promise<void> {
        const allEventsWithMatch = await this.prisma.matchEvent.findMany({
            where: {
                player_id: { in: players.map(p => p.player_id) },
                match: { phase: { season_id: seasonId } },
            },
            select: { player_id: true, team_id: true, type: true, match_id: true },
        });

        const statsMap = new Map<string, StatDelta & { matchIds: Set<number> }>();

        for (const ev of allEventsWithMatch) {
            if (!ev.player_id || !ev.team_id) continue;
            const k = statKey(ev.player_id, ev.team_id);

            const entry = statsMap.get(k) ?? {
                goals: 0, yellowCards: 0, redCards: 0, matchIds: new Set<number>(),
            };
            entry.matchIds.add(ev.match_id);

            switch (ev.type as MatchEventType) {
                case MatchEventType.goal:
                case MatchEventType.penalty_scored:
                    entry.goals++;
                    break;
                case MatchEventType.yellow_card:
                    entry.yellowCards++;
                    break;
                case MatchEventType.red_card:
                case MatchEventType.second_yellow:
                    entry.redCards++;
                    break;
            }
            statsMap.set(k, entry);
        }

        for (const { player_id, team_id } of players) {
            const k = statKey(player_id, team_id);
            const entry = statsMap.get(k);

            const goals = entry?.goals ?? 0;
            const yellowCards = entry?.yellowCards ?? 0;
            const redCards = entry?.redCards ?? 0;
            const matchesPlayed = entry?.matchIds.size ?? 0;

            const isSuspended = yellowCards >= yellowSuspension || redCards > 0;

            await this.prisma.playerStatistic.upsert({
                where: {
                    player_id_team_id_season_id: { player_id, team_id, season_id: seasonId },
                },
                create: {
                    player_id,
                    team_id,
                    season_id: seasonId,
                    matches_played: matchesPlayed,
                    goals_scored: goals,
                    yellow_cards: yellowCards,
                    red_cards: redCards,
                    accumulated_yellow_cards: yellowCards,
                    is_suspended: isSuspended,
                },
                update: {
                    matches_played: matchesPlayed,
                    goals_scored: goals,
                    yellow_cards: yellowCards,
                    red_cards: redCards,
                    accumulated_yellow_cards: yellowCards,
                    is_suspended: isSuspended,
                },
            });
        }
    }

    private async _tryRecomputeStandings(isKnockout: boolean, groupId: number | null): Promise<boolean> {
        if (isKnockout || !groupId) return false;
        await this.standingsService.recomputeGroupStandings(groupId);
        return true;
    }

    async getMatchReport(matchId: number): Promise<MatchReportOutput> {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: {
                id: true,
                played_at: true,
                scheduled_at: true,
                referee: true,
                status: true,
                home_team_id: true,
                away_team_id: true,
                home_score: true,
                away_score: true,
                finalize_home_half_time: true,
                finalize_away_half_time: true,
                venue: { select: { name: true } },
                home_team: { select: { id: true, name: true, logo: true } },
                away_team: { select: { id: true, name: true, logo: true } },
                matchResult: true,
                matchJerseyAssignment: {
                    select: {
                        team_id: true,
                        season_jersey: { select: { primary_color: true, secondary_color: true, image_url: true } },
                    },
                },
            },
        });

        if (!match) throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);
        if (!match.matchResult)
            throw createAppError('CONFLICT', `Match ${matchId} chưa confirm kết quả, chưa thể tạo biên bản`);

        const [lineup, events] = await Promise.all([
            this.prisma.matchLineup.findMany({
                where: { match_id: matchId },
                select: {
                    player_id: true, team_id: true, position: true, lineup_type: true,
                    is_captain: true, minute_in: true, minute_out: true,
                    player: { select: { user: { select: { name: true } } } },
                },
            }),
            this.prisma.matchEvent.findMany({
                where: { match_id: matchId },
                select: { player_id: true, team_id: true, type: true, minute: true, added_minute: true },
            }),
        ]);

        const teamIds = [match.home_team_id, match.away_team_id];
        const jerseyLookup = await this.prisma.teamPlayer.findMany({
            where: { team_id: { in: teamIds }, player_id: { in: lineup.map(l => l.player_id) } },
            select: { team_id: true, player_id: true, jersey_number: true },
        });

        const jerseyOf = (teamId: number) => {
            const a = match.matchJerseyAssignment.find(j => j.team_id === teamId);
            return {
                logoUrl: a?.season_jersey.image_url ?? (teamId === match.home_team_id ? match.home_team.logo : match.away_team.logo) ?? null,
                primaryColor: a?.season_jersey.primary_color ?? null,
                secondaryColor: a?.season_jersey.secondary_color ?? null,
            };
        };

        const r = match.matchResult;
        const playerNameLookup = new Map<number, string>(
            lineup.map(l => [l.player_id, l.player.user.name]),
        );

        const goalsTimeline = buildGoalsTimeline(events, match.home_team_id, match.away_team_id, playerNameLookup);

        return {
            matchId: match.id,
            playedAt: match.played_at ?? match.scheduled_at,
            venueName: match.venue?.name ?? null,
            referee: match.referee,
            status: match.status,
            resultType: r.result_type,
            score: {
                homeHalfTime: match.finalize_home_half_time,
                awayHalfTime: match.finalize_away_half_time,
                homeFullTime: match.home_score,
                awayFullTime: match.away_score,
                homeExtraTime: r.home_extra_time_score,
                awayExtraTime: r.away_extra_time_score,
                homePenalty: r.home_penalty_score,
                awayPenalty: r.away_penalty_score,
                homeFinal: r.home_final_score,
                awayFinal: r.away_final_score,
            },
            winnerTeamId: r.winner_team_id,
            home: { id: match.home_team.id, name: match.home_team.name, jersey: jerseyOf(match.home_team_id) },
            away: { id: match.away_team.id, name: match.away_team.name, jersey: jerseyOf(match.away_team_id) },
            lineups: {
                home: buildMatchReportPlayerRows(lineup, jerseyLookup, events, match.home_team_id),
                away: buildMatchReportPlayerRows(lineup, jerseyLookup, events, match.away_team_id),
            },
        };
    }
}