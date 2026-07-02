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

// FIX: ConfirmResultInput cần thêm field optional này trong types/matchResult.type.js
// để forfeitMatch() pass winner tường minh thay vì để _resolveWinner suy luận qua
// so sánh score.
//   export interface ConfirmResultInput {
//     ...
//     explicitWinnerTeamId?: number | null;
//   }
type ConfirmResultInputWithExplicitWinner = ConfirmResultInput & {
    explicitWinnerTeamId?: number | null;
};

type ConfirmResultOutputWithWarnings = ConfirmResultOutput & {
    postCommitWarnings?: string[];
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

    // ═══════════════════════════════════════════════════════════════════════════
    // READ — MATCH RESULT
    // ═══════════════════════════════════════════════════════════════════════════

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

    // ═══════════════════════════════════════════════════════════════════════════
    // READ — MATCH EVENTS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════

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

    // ═══════════════════════════════════════════════════════════════════════════
    // READ — MATCH PLAYER STATS (grouped)
    // ═══════════════════════════════════════════════════════════════════════════

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

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITE — CONFIRM RESULT
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Finalize 1 trận: tạo MatchResult, update Match status, update player stats.
     *
     * Idempotency: tx.matchResult.create() catch P2002 trên unique constraint
     * match_id — nguồn correctness thật cho race "2 caller cùng confirm 1 match",
     * không phải bất kỳ lock/claim nào ở tầng gọi.
     *
     * Post-commit steps (standings, knockout advance) chạy try-catch riêng,
     * gom lỗi vào postCommitWarnings thay vì throw — match đã finalize thành
     * công thì response phải phản ánh đúng, không để lỗi phụ khiến caller
     * tưởng cả request fail rồi retry (retry sẽ đụng _guardConfirm reject vì
     * MatchResult đã tồn tại).
     */
    async confirmResult(
        matchId: number,
        input: ConfirmResultInputWithExplicitWinner,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<ConfirmResultOutputWithWarnings> {
        const match = await this.prisma.match.findUnique({
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
        // FIX (tie-score forfeit/walkover): _resolveWinner giờ throw
        // VALIDATION_ERROR nếu resultType=forfeit/walkover mà homeScore===awayScore
        // và không có explicitWinnerTeamId — thay vì silent default winner=away.
        // Xem comment trong _resolveWinner.
        const resolution = this._resolveWinner(match.home_team_id, match.away_team_id, input);
        const targetMatchStatus = STATUS_BY_RESULT_TYPE[input.resultType] ?? MatchStatus.finished;

        let matchResultId: number;
        try {
            matchResultId = await this.prisma.$transaction(async tx => {
                const result = await tx.matchResult.create({
                    data: toMatchResultCreateInput(matchId, input, resolution),
                    select: { id: true },
                });

                await tx.match.update({
                    where: { id: matchId },
                    data: toMatchUpdateOnConfirm(resolution, targetMatchStatus),
                });

                await this._updatePlayerStatistics(tx, matchId, seasonId, yellowSuspension);

                return result.id;
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')
                throw createAppError('CONFLICT', `Match ${matchId} đã có MatchResult (race condition detected)`);
            throw err;
        }

        const postCommitWarnings: string[] = [];

        let standingUpdated = false;
        try {
            standingUpdated = await this._tryRecomputeStandings(isKnockout, match.group_id);
        } catch (err) {
            const msg = `Recompute standings thất bại cho group ${match.group_id}: ${err instanceof Error ? err.message : String(err)}`;
            console.error(`[confirmResult] ${msg}`);
            postCommitWarnings.push(msg);
        }

        let knockoutAdvanced = false;
        let newMatchId: number | undefined;

        if (isKnockout && resolution.winnerTeamId) {
            try {
                const advance = await this.knockoutService.advanceWinner(
                    match.phase_id,
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

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITE — OVERRIDE RESULT (admin correction)
    // ═══════════════════════════════════════════════════════════════════════════

    async overrideResult(
        matchId: number,
        input: EditScoreInput,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<void> {
        const match = await this.prisma.match.findUniqueOrThrow({
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
                matchResult: {
                    select: { id: true, result_type: true },
                },
            },
        });

        if (!match.matchResult)
            throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult`);

        const seasonId = match.phase.season?.id;
        if (!seasonId) {
            throw createAppError('INTERNAL_SERVER_ERROR', `Match ${matchId}: phase không có season`);
        }

        const resultType = input.resultType ?? match.matchResult.result_type;

        if (resultType === MatchResultType.penalty) {
            if (input.homePenalty === undefined || input.awayPenalty === undefined)
                throw createAppError('VALIDATION_ERROR', `overrideResult: resultType=penalty cần homePenalty + awayPenalty`);
            if (input.homePenalty === input.awayPenalty)
                throw createAppError('VALIDATION_ERROR', `overrideResult: penalty không được hoà — ${input.homePenalty}-${input.awayPenalty}`);
        }

        // FIX: overrideResult đi qua CÙNG _resolveWinner như confirmResult —
        // trước đây đây là 1 trong 2 lối vào bị bỏ sót khi patch chỉ ở
        // forfeitMatch(). Admin đổi resultType sang forfeit/walkover với
        // homeScore===awayScore giờ bị chặn ngay tại _resolveWinner, không
        // còn silent-default winner=away.
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

        await this.prisma.$transaction(async tx => {
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
        });

        if (match.phase.format !== PhaseFormat.knockout && match.group_id) {
            try {
                await this.standingsService.recomputeGroupStandings(match.group_id);
            } catch (err) {
                console.error(`[overrideResult] recompute standings failed for group ${match.group_id}:`, err);
            }
        }

        try {
            await this.recomputePlayerStats(matchId);
        } catch (err) {
            console.error(`[overrideResult] recompute player stats failed for match ${matchId}:`, err);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITE — RECOMPUTE PLAYER STATS (admin correction)
    // ═══════════════════════════════════════════════════════════════════════════

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

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC HELPER (exposed for admin controller)
    // ═══════════════════════════════════════════════════════════════════════════

    async recomputeStandingsFor(groupId: number): Promise<void> {
        await this.standingsService.recomputeGroupStandings(groupId);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    private _guardConfirm(match: MatchForConfirmFull, input: ConfirmResultInputWithExplicitWinner): void {
        if (match.status === MatchStatus.finished || match.status === MatchStatus.cancelled)
            throw createAppError('CONFLICT', `Match ${match.id} đã ở status '${match.status}'`);

        if (match.matchResult)
            throw createAppError('CONFLICT', `Match ${match.id} đã có MatchResult`);

        const isKnockout = match.phase.format === PhaseFormat.knockout;
        if (isKnockout && input.resultType === MatchResultType.full_time) {
            if (input.homeScore === input.awayScore)
                throw createAppError(
                    'VALIDATION_ERROR',
                    `Match ${match.id}: knockout draw ở full_time — cần extra_time hoặc penalty`,
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
                // FIX: đây là root cause thật của bug forfeit_score=0. Trước đây
                // `input.homeScore > input.awayScore ? home : away` silent default
                // về awayTeamId khi hoà — sai hoàn toàn nếu forfeit_score config = 0
                // (0 > 0 === false). explicitWinnerTeamId (checked ở trên) là cách
                // caller AVOID rơi vào nhánh này, nhưng nếu caller nào đó (override,
                // adminRecordResult) không truyền, phải FAIL LOUD thay vì đoán sai.
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
}