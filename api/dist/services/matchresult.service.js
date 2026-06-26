import { MatchEventType, MatchResultType, MatchStatus, PhaseFormat, } from '../generated/prisma/client.js';
import { createAppError } from '../common/app.error.js';
import { STATUS_BY_RESULT_TYPE, } from '../types/matchResult.type.js';
import { Queryable, } from '../libs/queryable.js';
import { buildStatDeltas, MATCH_EVENT_SELECT, matchForConfirmSelect, statKey, toMatchResultCreateInput, toMatchUpdateOnConfirm } from '../helper/match.helper.js';
export class MatchResultService {
    prisma;
    knockoutService;
    standingsService;
    matchEventQueryable;
    constructor(prisma, knockoutService, standingsService) {
        this.prisma = prisma;
        this.knockoutService = knockoutService;
        this.standingsService = standingsService;
        // Queryable config cho match events
        // sortable fields, default sort, filterable, select, hooks
        const matchEventConfig = {
            select: MATCH_EVENT_SELECT,
            sortable: ['minute', 'added_minute', 'created_at', 'id'],
            defaultSort: { column: 'minute', direction: 'asc' },
            filterable: ['type', 'period'],
            defaultPerPage: 30,
            maxPerPage: 100,
            // beforeBuild hook: match_id constraint — inject vào where
            beforeBuild: () => {
                // match_id sẽ được thêm bởi caller (build QueryRequest)
                // Hook này chỉ cho fixed constraints (deleted_at, tenant_id, etc)
            },
        };
        this.matchEventQueryable = new Queryable(this.prisma.matchEvent, matchEventConfig);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // READ — MATCH RESULT
    // ═══════════════════════════════════════════════════════════════════════════
    async getMatchResult(matchId) {
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
    // READ — MATCH EVENTS (paginated với existing Queryable)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * List events của 1 trận, hỗ trợ pagination, sort, filter.
     *
     * Pattern:
     *   - QueryRequest build từ HTTP query params
     *   - match_id inject vào filter (context)
     *   - Queryable.run() handle pagination + sort + validation
     *
     * API:
     *   queryable.run(req: QueryRequest, overrideConfig?)
     *   QueryRequest = { filter?: Record<string, unknown>, q?: string, sort?, direction?, page?, per_page?, ...simple }
     */
    async listMatchEvents(matchId, req) {
        // Build query request: simple fields (type, period) + complex filter (match_id)
        // Existing Queryable support both patterns
        const queryReq = {
            ...req,
            // match_id chỉ có thể pass qua filter (complex) vì không phải simple field
            filter: {
                ...(req.filter || {}),
                match_id: { eq: matchId },
            },
        };
        return this.matchEventQueryable.run(queryReq);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // READ — MATCH PLAYER STATS
    // ═══════════════════════════════════════════════════════════════════════════
    async getMatchPlayerStats(matchId) {
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
    async confirmResult(matchId, input, scheduleOptions) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: matchForConfirmSelect,
        });
        if (!match)
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);
        this._guardConfirm(match, input);
        const isKnockout = match.phase.format === PhaseFormat.knockout;
        const seasonId = match.phase.season.id;
        const yellowSuspension = match.phase.season.tournament.tournamentRule?.yellow_cards_suspension ?? 3;
        const resolution = this._resolveWinner(match.home_team_id, match.away_team_id, input);
        const targetMatchStatus = STATUS_BY_RESULT_TYPE[input.resultType] ?? MatchStatus.finished;
        const matchResultId = await this.prisma.$transaction(async (tx) => {
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
        const standingUpdated = await this._tryRecomputeStandings(isKnockout, match.group_id);
        let knockoutAdvanced = false;
        let newMatchId;
        if (isKnockout && resolution.winnerTeamId) {
            const advance = await this.knockoutService.advanceWinner(match.phase_id, seasonId, { matchId, winnerTeamId: resolution.winnerTeamId }, scheduleOptions);
            knockoutAdvanced = advance.matchCreated;
            newMatchId = advance.newMatchId;
        }
        return { matchResultId, winnerTeamId: resolution.winnerTeamId, standingUpdated, knockoutAdvanced, newMatchId };
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // WRITE — OVERRIDE RESULT
    // ═══════════════════════════════════════════════════════════════════════════
    async overrideResult(matchId, input, scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: {
                home_team_id: true,
                away_team_id: true,
                group_id: true,
                phase: { select: { format: true } },
                matchResult: {
                    select: {
                        id: true,
                        result_type: true,
                    },
                },
            },
        });
        if (!match.matchResult)
            throw createAppError('NOT_FOUND', `Match ${matchId} chưa có MatchResult`);
        const resultType = input.resultType ?? match.matchResult.result_type;
        if (resultType === MatchResultType.penalty) {
            if (input.homePenalty === undefined || input.awayPenalty === undefined)
                throw createAppError('VALIDATION_ERROR', `editScore: resultType=penalty cần homePenalty + awayPenalty`);
            if (input.homePenalty === input.awayPenalty)
                throw createAppError('VALIDATION_ERROR', `editScore: penalty không được hoà — ${input.homePenalty}-${input.awayPenalty}`);
        }
        const resolution = this._resolveWinner(match.home_team_id, match.away_team_id, {
            homeScore: input.homeScore,
            awayScore: input.awayScore,
            homeExtraTime: input.homeExtraTime,
            awayExtraTime: input.awayExtraTime,
            homePenalty: input.homePenalty,
            awayPenalty: input.awayPenalty,
            resultType,
        });
        await this.prisma.$transaction(async (tx) => {
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
            await this.standingsService.recomputeGroupStandings(match.group_id);
        }
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // WRITE — RECOMPUTE PLAYER STATS
    // ═══════════════════════════════════════════════════════════════════════════
    async recomputePlayerStats(matchId) {
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
        const seasonId = match.phase.season.id;
        const yellowSuspension = match.phase.season.tournament.tournamentRule?.yellow_cards_suspension ?? 3;
        const events = await this.prisma.matchEvent.findMany({
            where: { match_id: matchId },
            select: { player_id: true, team_id: true, type: true },
        });
        const { played } = buildStatDeltas(events);
        if (played.size === 0)
            return;
        const playerKeys = [...played].map(k => {
            const [pid, tid] = k.split(':').map(Number);
            return { player_id: pid, team_id: tid };
        });
        await this._recomputeStatsForPlayers(playerKeys, seasonId, yellowSuspension);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════
    _guardConfirm(match, input) {
        if (match.status === MatchStatus.finished || match.status === MatchStatus.cancelled)
            throw createAppError('CONFLICT', `Match ${match.id} đã ở status '${match.status}'`);
        if (match.matchResult)
            throw createAppError('CONFLICT', `Match ${match.id} đã có MatchResult`);
        const isKnockout = match.phase.format === PhaseFormat.knockout;
        if (isKnockout && input.resultType === MatchResultType.full_time) {
            if (input.homeScore === input.awayScore)
                throw createAppError('VALIDATION_ERROR', `Match ${match.id}: knockout draw ở full_time — cần extra_time hoặc penalty`);
        }
        if (input.resultType === MatchResultType.penalty) {
            if (input.homePenalty === undefined || input.awayPenalty === undefined)
                throw createAppError('VALIDATION_ERROR', `Match ${match.id}: resultType=penalty cần homePenalty + awayPenalty`);
            if (input.homePenalty === input.awayPenalty)
                throw createAppError('VALIDATION_ERROR', `Match ${match.id}: penalty không được hoà — ${input.homePenalty}-${input.awayPenalty}`);
        }
    }
    _resolveWinner(homeTeamId, awayTeamId, input) {
        switch (input.resultType) {
            case MatchResultType.full_time: {
                const winnerTeamId = input.homeScore > input.awayScore ? homeTeamId
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
                const winnerTeamId = input.homePenalty > input.awayPenalty ? homeTeamId : awayTeamId;
                const h = input.homeExtraTime ?? input.homeScore;
                const a = input.awayExtraTime ?? input.awayScore;
                return { winnerTeamId, homeFinal: h, awayFinal: a };
            }
            case MatchResultType.forfeit:
            case MatchResultType.walkover: {
                const winnerTeamId = input.homeScore > input.awayScore ? homeTeamId : awayTeamId;
                return { winnerTeamId, homeFinal: input.homeScore, awayFinal: input.awayScore };
            }
        }
    }
    async _updatePlayerStatistics(tx, matchId, seasonId, yellowSuspension) {
        const events = await tx.matchEvent.findMany({
            where: { match_id: matchId },
            select: { player_id: true, team_id: true, type: true },
        });
        if (events.length === 0)
            return;
        const { played, deltas } = buildStatDeltas(events);
        if (played.size === 0)
            return;
        const playerKeys = [...played].map(k => {
            const [pid, tid] = k.split(':').map(Number);
            return { player_id: pid, team_id: tid, season_id: seasonId };
        });
        const existingStats = await tx.playerStatistic.findMany({
            where: { OR: playerKeys },
            select: { player_id: true, team_id: true, accumulated_yellow_cards: true },
        });
        const accumMap = new Map();
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
    async _recomputeStatsForPlayers(players, seasonId, yellowSuspension) {
        const allEventsWithMatch = await this.prisma.matchEvent.findMany({
            where: {
                player_id: { in: players.map(p => p.player_id) },
                match: {
                    phase: {
                        season_id: seasonId,
                    },
                },
            },
            select: { player_id: true, team_id: true, type: true, match_id: true },
        });
        const statsMap = new Map();
        for (const ev of allEventsWithMatch) {
            if (!ev.player_id || !ev.team_id)
                continue;
            const k = statKey(ev.player_id, ev.team_id);
            const entry = statsMap.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0, matchIds: new Set() };
            entry.matchIds.add(ev.match_id);
            switch (ev.type) {
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
    async _tryRecomputeStandings(isKnockout, groupId) {
        if (isKnockout || !groupId)
            return false;
        await this.standingsService.recomputeGroupStandings(groupId);
        return true;
    }
    async recomputeStandingsFor(groupId) {
        await this.standingsService.recomputeGroupStandings(groupId);
    }
}
//# sourceMappingURL=matchresult.service.js.map