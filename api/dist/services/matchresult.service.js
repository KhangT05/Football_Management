import { MatchEventType, MatchResultType, MatchStatus, PhaseFormat, } from '../generated/prisma/client.js';
import { createAppError } from '../common/app.error.js';
import { STATUS_BY_RESULT_TYPE, } from '../types/matchResult.type.js';
import { Queryable } from '../libs/queryable.js';
import { buildStatDeltas, MATCH_EVENT_SELECT, matchForConfirmSelect, statKey, toMatchResultCreateInput, toMatchUpdateOnConfirm, } from '../helper/match.helper.js';
export class MatchResultService {
    prisma;
    knockoutService;
    standingsService;
    matchEventQueryable;
    constructor(prisma, knockoutService, standingsService) {
        this.prisma = prisma;
        this.knockoutService = knockoutService;
        this.standingsService = standingsService;
        // Queryable cho match events — match_id inject từ caller qua filter
        const matchEventConfig = {
            select: MATCH_EVENT_SELECT,
            sortable: ['minute', 'added_minute', 'created_at', 'id'],
            defaultSort: { column: 'minute', direction: 'asc' },
            filterable: ['type', 'period'],
            defaultPerPage: 30,
            maxPerPage: 100,
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
    // READ — MATCH EVENTS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * List events của 1 trận, hỗ trợ pagination, sort, filter theo type/period.
     * match_id inject vào filter — không thể sort/filter trực tiếp trên FK.
     */
    async listMatchEvents(matchId, req) {
        const queryReq = {
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
    /**
     * Finalize 1 trận: tạo MatchResult, update Match status, update player stats.
     *
     * Flow:
     *   1. Load match + guard (status, existing result, knockout draw check)
     *   2. Transaction: create MatchResult + update Match + update PlayerStatistics
     *   3. Recompute group standings (nếu group phase) — ngoài transaction
     *   4. Advance knockout (nếu knockout phase) — ngoài transaction
     *
     * Bước 3 và 4 ngoài transaction là chủ ý:
     *   - Nếu standings/knockout fail, match vẫn finalized
     *   - Eventually consistent — acceptable cho scale này
     *   - Tránh transaction timeout do standings recompute scan nhiều rows
     */
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
        if (!seasonId) {
            throw createAppError('INTERNAL_SERVER_ERROR', `Match ${matchId}: phase không có season`);
        }
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
            // Update player stats trong transaction để đảm bảo atomic với match finalization.
            // Nếu stats fail → toàn bộ rollback, match không bị finalized với stats sai.
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
    // WRITE — OVERRIDE RESULT (admin correction)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Admin sửa score sau khi match đã finalized.
     *
     * Override chỉ sửa scores (final, extra time, penalty, half-time) và winner.
     * KHÔNG sửa MatchEvents — nếu cần sửa events, dùng editEvent/deleteEvent riêng.
     *
     * Sau khi sửa score:
     *   - Standings recompute (group phase)
     *   - Player stats recompute từ đầu (vì goals_scored derive từ events, không phải score)
     *     → Thực ra goals không đổi khi chỉ sửa score. Nhưng nếu override được gọi cùng
     *     với event correction, stats cần consistent. Recompute để safe.
     *
     * NOTE: Knockout bracket KHÔNG tự cập nhật khi override —
     * nếu winner thay đổi, admin phải handle bracket manually.
     * Lý do: bracket advancement có thể đã tạo match mới → side effect phức tạp.
     */
    async overrideResult(matchId, input, scheduleOptions) {
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
        // Standings phụ thuộc vào scores — recompute sau mỗi override
        if (match.phase.format !== PhaseFormat.knockout && match.group_id) {
            await this.standingsService.recomputeGroupStandings(match.group_id);
        }
        // Player stats recompute: goals/cards derive từ events, không phải score.
        // Score override không thay đổi events → goals/cards không đổi.
        // Tuy nhiên nếu override đi kèm event correction (editEvent/deleteEvent),
        // stats đã được update bởi recomputePlayerStats riêng.
        // Giữ call này để đảm bảo consistency — cost thấp (scan events của 1 match).
        await this.recomputePlayerStats(matchId);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // WRITE — RECOMPUTE PLAYER STATS (admin correction)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Recompute player stats của 1 match từ events hiện tại.
     *
     * Dùng khi:
     *   - Admin edit/delete event sau khi match finalized
     *   - Admin override score (gọi từ overrideResult)
     *
     * Logic accumulated_yellow_cards:
     *   - `accumulated_yellow_cards` = tổng thẻ vàng từ đầu season, có thể reset sau khi
     *     bị treo giò (theo quy định giải). Field này KHÔNG tự reset ở đây.
     *   - Recompute tính lại từ toàn bộ events của season cho player đó.
     *   - Reset logic (khi nào reset sau suspension) phải implement riêng nếu giải có quy định.
     *   - Hiện tại: accumulated = tổng yellow_cards của season (không reset).
     */
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
        const seasonId = match.phase.season?.id;
        if (!seasonId) {
            throw createAppError('INTERNAL_SERVER_ERROR', `Match ${matchId}: phase không có season`);
        }
        const yellowSuspension = match.phase.season.tournament.tournamentRule?.yellow_cards_suspension ?? 3;
        // Load events của match này để biết players nào cần recompute
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
        // Recompute từ toàn bộ events của season cho các players này
        await this._recomputeStatsForPlayers(playerKeys, seasonId, yellowSuspension);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC HELPER (exposed for admin controller)
    // ═══════════════════════════════════════════════════════════════════════════
    async recomputeStandingsFor(groupId) {
        await this.standingsService.recomputeGroupStandings(groupId);
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
                // homeFinal = score sau extra time (không phải penalty score)
                const winnerTeamId = input.homePenalty > input.awayPenalty ? homeTeamId : awayTeamId;
                const h = input.homeExtraTime ?? input.homeScore;
                const a = input.awayExtraTime ?? input.awayScore;
                return { winnerTeamId, homeFinal: h, awayFinal: a };
            }
            case MatchResultType.forfeit:
            case MatchResultType.walkover: {
                // Score được set manual bởi admin (thường 3-0 hoặc theo quy định)
                const winnerTeamId = input.homeScore > input.awayScore ? homeTeamId : awayTeamId;
                return { winnerTeamId, homeFinal: input.homeScore, awayFinal: input.awayScore };
            }
        }
    }
    /**
     * Update player statistics trong transaction — chạy cùng với match finalization.
     *
     * Logic accumulated_yellow_cards:
     *   - Load accumulated hiện tại của player trong season
     *   - Cộng thêm yellow cards từ trận này
     *   - Nếu accumulated >= yellowSuspension hoặc có red_card → is_suspended = true
     *
     * NOTE: Không có reset logic ở đây.
     *   accumulated_yellow_cards chỉ tăng, không reset.
     *   Nếu giải có quy định reset sau khi lĩnh án treo giò (common trong FIFA/UEFA),
     *   cần implement reset endpoint riêng (admin action).
     *   Lý do không auto-reset: quy định reset khác nhau giữa các giải,
     *   và cần audit trail rõ ràng khi admin reset.
     */
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
        // Load existing accumulated counts — cần để tính suspension threshold
        const existingStats = await tx.playerStatistic.findMany({
            where: { OR: playerKeys },
            select: { player_id: true, team_id: true, accumulated_yellow_cards: true },
        });
        const accumMap = new Map();
        for (const s of existingStats) {
            accumMap.set(statKey(s.player_id, s.team_id), s.accumulated_yellow_cards);
        }
        // Sequential upserts — tránh deadlock với Promise.all trong MySQL transaction
        for (const k of played) {
            const [pidStr, tidStr] = k.split(':');
            const playerId = Number(pidStr);
            const teamId = Number(tidStr);
            const d = deltas.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0 };
            const prevAccum = accumMap.get(k) ?? 0;
            const newAccum = prevAccum + d.yellowCards;
            // is_suspended = true nếu đạt ngưỡng accumulated HOẶC nhận thẻ đỏ trực tiếp
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
    /**
     * Full recompute player stats từ tất cả events của season cho các players chỉ định.
     *
     * Dùng cho admin correction (sau editEvent, deleteEvent, overrideResult).
     * Scan toàn bộ events của season cho players đó — không incremental.
     * Acceptable vì: số players per team nhỏ (≤ 25), số matches per season nhỏ (≤ 50).
     *
     * accumulated_yellow_cards trong recompute = tổng yellow_cards của season (không reset).
     * Nếu cần reset logic, implement riêng (xem note trong _updatePlayerStatistics).
     */
    async _recomputeStatsForPlayers(players, seasonId, yellowSuspension) {
        // Load tất cả events của season cho các players này
        // Path: matchEvent → match → phase → season_id
        const allEventsWithMatch = await this.prisma.matchEvent.findMany({
            where: {
                player_id: { in: players.map(p => p.player_id) },
                match: { phase: { season_id: seasonId } },
            },
            select: { player_id: true, team_id: true, type: true, match_id: true },
        });
        // Aggregate stats per player-team pair
        const statsMap = new Map();
        for (const ev of allEventsWithMatch) {
            if (!ev.player_id || !ev.team_id)
                continue;
            const k = statKey(ev.player_id, ev.team_id);
            const entry = statsMap.get(k) ?? {
                goals: 0, yellowCards: 0, redCards: 0, matchIds: new Set(),
            };
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
                // own_goal, substitution, card_rescinded, goal_disallowed, penalty_missed:
                // không ảnh hưởng goals/cards của player (own_goal tính cho team, không phải player stat)
            }
            statsMap.set(k, entry);
        }
        // Upsert từng player — set (không increment) vì recompute from scratch
        for (const { player_id, team_id } of players) {
            const k = statKey(player_id, team_id);
            const entry = statsMap.get(k);
            const goals = entry?.goals ?? 0;
            const yellowCards = entry?.yellowCards ?? 0;
            const redCards = entry?.redCards ?? 0;
            const matchesPlayed = entry?.matchIds.size ?? 0;
            // accumulated = tổng yellow cards của season (không có reset logic)
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
}
//# sourceMappingURL=matchresult.service.js.map