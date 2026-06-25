import { MatchEventType, MatchResultType, MatchStatus, PhaseFormat } from '../generated/prisma/client.js';
import { createAppError } from '../common/app.error.js';
import { STATUS_BY_RESULT_TYPE, } from '../types/matchResult.type.js';
// ─── Internal select — chỉ dùng trong service này ─────────────────────────────
// Không import từ match.queries để tránh circular dependency nếu queries import service types.
const matchForConfirmSelect = {
    id: true,
    status: true,
    home_team_id: true,
    away_team_id: true,
    group_id: true,
    phase_id: true,
    phase: {
        select: {
            format: true,
            season: {
                select: {
                    id: true,
                    tournament: {
                        select: {
                            tournamentRule: {
                                select: { yellow_cards_suspension: true, forfeit_score: true },
                            },
                        },
                    },
                },
            },
        },
    },
    matchResult: { select: { id: true } },
};
// ─── Mapper helpers ───────────────────────────────────────────────────────────
// Tách ra để _guardConfirm và confirmResult không làm việc với raw Prisma shape.
function toMatchResultCreateInput(matchId, input, resolution, matchStatus) {
    return {
        match: { connect: { id: matchId } },
        winner_team: resolution.winnerTeamId
            ? { connect: { id: resolution.winnerTeamId } }
            : undefined,
        // ET score — cumulative (90+ET), undefined nếu không có ET
        home_extra_time_score: input.homeExtraTime ?? null,
        away_extra_time_score: input.awayExtraTime ?? null,
        // Penalty tiebreaker
        home_penalty_score: input.homePenalty ?? null,
        away_penalty_score: input.awayPenalty ?? null,
        // Final score — dùng cho display và standings
        // = ET score nếu có ET, ngược lại = 90p score
        home_final_score: resolution.homeFinal,
        away_final_score: resolution.awayFinal,
        result_type: input.resultType,
        // MatchResult.status luôn = official sau khi tạo.
        // Match.status (finished/forfeited) được set riêng ở toMatchUpdateOnConfirm.
        status: 'official',
        notes: input.notes ?? null,
    };
}
function toMatchUpdateOnConfirm(input, resolution, targetMatchStatus) {
    return {
        status: targetMatchStatus,
        played_at: new Date(),
        // Mirror final score lên Match để query list không cần join MatchResult
        home_score: resolution.homeFinal,
        away_score: resolution.awayFinal,
        // Clear grace-period fields sau khi confirm — không cần giữ lại
        pending_official_at: null,
        manual_home_score: null,
        manual_away_score: null,
        finalize_result_type: null,
        finalize_home_half_time: null,
        finalize_away_half_time: null,
        finalize_home_penalty: null,
        finalize_away_penalty: null,
    };
}
// ─── Appeal / dispute mapper helpers ─────────────────────────────────────────
// Dùng trong MatchLifecycleService.resolveAppeal() — tách ra để service không
// làm việc trực tiếp với Prisma.MatchResultUpdateInput shape.
export function toMatchResultUpdateOnUphold(note) {
    return {
        status: 'official',
        appeal_note: note ?? null,
    };
}
export function toMatchResultUpdateOnOverturn(newHomeScore, newAwayScore, newWinnerTeamId, note) {
    return {
        home_final_score: newHomeScore,
        away_final_score: newAwayScore,
        winner_team: newWinnerTeamId
            ? { connect: { id: newWinnerTeamId } }
            : { disconnect: true },
        status: 'overturned',
        appeal_note: note ?? null,
    };
}
export function toMatchUpdateOnOverturn(newHomeScore, newAwayScore) {
    // Mirror final score lên Match sau overturn — query list không cần join MatchResult
    return {
        home_score: newHomeScore,
        away_score: newAwayScore,
    };
}
// ─── Service ──────────────────────────────────────────────────────────────────
export class MatchResultService {
    prisma;
    knockoutService;
    standingsService;
    constructor(prisma, knockoutService, standingsService) {
        this.prisma = prisma;
        this.knockoutService = knockoutService;
        this.standingsService = standingsService;
    }
    // ─── Public entry point ───────────────────────────────────────────────────
    // SINGLE SOURCE OF TRUTH cho mọi path dẫn đến "match có kết quả":
    //   - confirmOfficial()  (referee confirm sau grace period)
    //   - forfeitMatch()     (BTC quyết, bypass grace period)
    //   - walkover/seed fixture (bypass)
    //
    // Không có caller nào được tự tạo MatchResult hoặc set status=finished ngoài đây.
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
        // Match.status sau confirm — forfeited cho forfeit/walkover, finished cho normal
        const targetMatchStatus = STATUS_BY_RESULT_TYPE[input.resultType] ?? MatchStatus.finished;
        const matchResultId = await this.prisma.$transaction(async (tx) => {
            const result = await tx.matchResult.create({
                data: toMatchResultCreateInput(matchId, input, resolution, targetMatchStatus),
                select: { id: true },
            });
            await tx.match.update({
                where: { id: matchId },
                data: toMatchUpdateOnConfirm(input, resolution, targetMatchStatus),
            });
            // Player stats update trong cùng TX để đảm bảo atomicity:
            // nếu stats fail → MatchResult cũng rollback.
            // Trade-off: TX dài hơn, nhưng đây là operation quan trọng, không chấp nhận partial commit.
            await this._updatePlayerStatistics(tx, matchId, seasonId, yellowSuspension);
            return result.id;
        });
        // Standings + knockout ngoài TX:
        // Recompute standings đọc nhiều rows + có thể gọi service khác.
        // Nếu fail ở đây, MatchResult đã committed — cần idempotent retry hoặc background job.
        // TODO: wrap trong job queue nếu tournament có nhiều group (N groups × M matches).
        const standingUpdated = await this._tryRecomputeStandings(isKnockout, match.group_id);
        let knockoutAdvanced = false;
        let newMatchId;
        if (isKnockout && resolution.winnerTeamId) {
            // advanceWinner tạo match tiếp theo trong bracket nếu cả 2 slot đã có winner.
            // Không call nếu draw (winnerTeamId = null) — knockout không có draw.
            const advance = await this.knockoutService.advanceWinner(match.phase_id, seasonId, { matchId, winnerTeamId: resolution.winnerTeamId }, scheduleOptions);
            knockoutAdvanced = advance.matchCreated;
            newMatchId = advance.newMatchId;
        }
        return {
            matchResultId,
            winnerTeamId: resolution.winnerTeamId,
            standingUpdated,
            knockoutAdvanced,
            newMatchId,
        };
    }
    // ─── overrideResult (correction — manual path only) ──────────────────────
    // Gọi bởi MatchLifecycleService.editScore() — chỉ khi match không có events.
    // Update MatchResult trực tiếp từ input thay vì recompute từ events.
    //
    // Không tạo MatchResult mới — chỉ update existing record.
    // Recompute standings sau khi update.
    // Player stats bỏ qua — manual path không có events để compute.
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
        // Validate penalty input nếu resultType = penalty
        if (resultType === MatchResultType.penalty) {
            if (input.homePenalty === undefined || input.awayPenalty === undefined)
                throw createAppError('VALIDATION_ERROR', `editScore: resultType=penalty cần homePenalty + awayPenalty`);
            if (input.homePenalty === input.awayPenalty)
                throw createAppError('VALIDATION_ERROR', `editScore: penalty không được hoà — ${input.homePenalty}-${input.awayPenalty}`);
        }
        // Winner resolution từ input score
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
                    home_score: input.homeScore,
                    away_score: input.awayScore,
                    home_extra_time_score: input.homeExtraTime ?? null,
                    away_extra_time_score: input.awayExtraTime ?? null,
                    home_penalty_score: input.homePenalty ?? null,
                    away_penalty_score: input.awayPenalty ?? null,
                    home_half_time_score: input.homeHalfTime ?? undefined, // giữ nguyên nếu không truyền
                    away_half_time_score: input.awayHalfTime ?? undefined,
                    home_final_score: resolution.homeFinal,
                    away_final_score: resolution.awayFinal,
                    winner_team_id: resolution.winnerTeamId,
                    result_type: resultType,
                    notes: input.notes ?? undefined,
                    updated_at: new Date(),
                },
            });
            // Mirror lên Match
            await tx.match.update({
                where: { id: matchId },
                data: {
                    home_score: resolution.homeFinal,
                    away_score: resolution.awayFinal,
                    updated_at: new Date(),
                },
            });
        });
        // Standings recompute — chỉ group phase
        if (match.phase.format !== PhaseFormat.knockout && match.group_id) {
            await this.standingsService.recomputeGroupStandings(match.group_id);
        }
        // Knockout bracket correction sau override không tự động —
        // winner có thể đã advance, cần admin xử lý thủ công.
        // TODO: flag match để admin review nếu knockout và winner đã thay đổi.
    }
    // ─── recomputePlayerStats (correction) ────────────────────────────────────
    // Full recompute player stats từ toàn bộ events hiện tại của match.
    // Gọi sau addEvent / deleteEvent / editEvent để đồng bộ stats.
    //
    // Strategy: reset stats của trận này về 0, rồi apply lại toàn bộ events.
    // Không dùng increment/decrement vì sửa event có thể thay đổi cả player lẫn type.
    //
    // Implementation:
    //   1. Fetch tất cả events của match
    //   2. Xác định set players bị ảnh hưởng (player_id × team_id × season_id)
    //   3. Subtract stats cũ của trận này (rollback)
    //   4. Recompute từ events mới (apply)
    //
    // Trade-off: 2 pass qua events + N upserts — acceptable cho ~22-30 players.
    // Nếu scale lên (nhiều correction đồng thời), cần queue serialization per-match.
    async recomputePlayerStats(matchId, _scheduleOptions) {
        const match = await this.prisma.match.findUniqueOrThrow({
            where: { id: matchId },
            select: {
                season_id: true,
                phase: {
                    select: {
                        season: {
                            select: {
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
        const seasonId = match.season_id;
        const yellowSuspension = match.phase.season.tournament.tournamentRule?.yellow_cards_suspension ?? 3;
        const events = await this.prisma.matchEvent.findMany({
            where: { match_id: matchId },
            select: { player_id: true, team_id: true, type: true },
        });
        // Build new deltas từ events hiện tại
        const played = new Set();
        const newDeltas = new Map();
        const key = (pid, tid) => `${pid}:${tid}`;
        for (const ev of events) {
            if (!ev.player_id || !ev.team_id)
                continue;
            const k = key(ev.player_id, ev.team_id);
            played.add(k);
            const d = newDeltas.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0 };
            switch (ev.type) {
                case MatchEventType.goal:
                case MatchEventType.penalty_scored:
                    d.goals++;
                    break;
                case MatchEventType.yellow_card:
                    d.yellowCards++;
                    break;
                case MatchEventType.red_card:
                case MatchEventType.second_yellow:
                    d.redCards++;
                    break;
            }
            newDeltas.set(k, d);
        }
        if (played.size === 0)
            return;
        // Fetch existing stats để biết old deltas của trận này trước khi correction
        // ASSUMPTION: PlayerStatistic lưu cumulative — cần biết contribution của match này.
        // LIMITATION: không có per-match snapshot → dùng approach subtract-old/add-new
        // yêu cầu lưu old delta trước khi correction.
        //
        // Current design lưu accumulated stats (không có per-match breakdown).
        // → Không thể subtract chính xác contribution của match này mà không có snapshot.
        //
        // Workaround hiện tại: full recompute tất cả matches của player trong season.
        // Cost: O(matches × players) — chấp nhận được cho tournament nhỏ (~50 matches).
        // TODO: nếu scale lên, thêm MatchPlayerStat table để lưu per-match contribution.
        // split(':').map(Number) inferred as number[] — cast explicit để tránh ts(2345)
        const playerKeys = [...played].map(k => {
            const parts = k.split(':');
            return { player_id: Number(parts[0]), team_id: Number(parts[1]) };
        });
        // Full recompute từ đầu mùa cho các players bị ảnh hưởng
        await this._recomputeStatsForPlayers(playerKeys, seasonId, yellowSuspension);
    }
    // ─── _recomputeStatsForPlayers ────────────────────────────────────────────
    // Full recompute PlayerStatistic cho danh sách players trong season.
    // Đọc toàn bộ events của player trong season → compute lại từ đầu.
    //
    // Atomic per-player: mỗi player upsert trong TX riêng.
    // Không batch trong 1 TX lớn — tránh deadlock khi N players lớn.
    async _recomputeStatsForPlayers(players, seasonId, yellowSuspension) {
        // Single query với match_id để deduplicate matches_played
        // (allEvents đã bỏ — duplicate, thiếu match_id)
        const allEventsWithMatch = await this.prisma.matchEvent.findMany({
            where: {
                player_id: { in: players.map(p => p.player_id) },
            },
            select: { player_id: true, team_id: true, type: true, match_id: true },
        });
        // Group events theo player × team
        const statsMap = new Map();
        const key = (pid, tid) => `${pid}:${tid}`;
        const matchesPlayedMap = new Map();
        for (const ev of allEventsWithMatch) {
            if (!ev.player_id || !ev.team_id)
                continue;
            const k = key(ev.player_id, ev.team_id);
            // Track unique matches
            const matchSet = matchesPlayedMap.get(k) ?? new Set();
            matchSet.add(ev.match_id);
            matchesPlayedMap.set(k, matchSet);
            const d = statsMap.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0, matchesPlayed: 0 };
            switch (ev.type) {
                case MatchEventType.goal:
                case MatchEventType.penalty_scored:
                    d.goals++;
                    break;
                case MatchEventType.yellow_card:
                    d.yellowCards++;
                    break;
                case MatchEventType.red_card:
                case MatchEventType.second_yellow:
                    d.redCards++;
                    break;
            }
            statsMap.set(k, d);
        }
        // Upsert từng player với stats đã recompute
        await Promise.all(players.map(async ({ player_id, team_id }) => {
            const k = key(player_id, team_id);
            const d = statsMap.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0, matchesPlayed: 0 };
            const matchesPlayed = matchesPlayedMap.get(k)?.size ?? 0;
            // accumulated_yellow_cards = total yellow cards trong season
            // is_suspended = accumulated >= threshold HOẶC có red card
            const isSuspended = d.yellowCards >= yellowSuspension || d.redCards > 0;
            await this.prisma.playerStatistic.upsert({
                where: {
                    player_id_team_id_season_id: { player_id, team_id, season_id: seasonId },
                },
                create: {
                    player_id,
                    team_id,
                    season_id: seasonId,
                    matches_played: matchesPlayed,
                    goals_scored: d.goals,
                    yellow_cards: d.yellowCards,
                    red_cards: d.redCards,
                    accumulated_yellow_cards: d.yellowCards,
                    is_suspended: isSuspended,
                },
                update: {
                    matches_played: matchesPlayed,
                    goals_scored: d.goals,
                    yellow_cards: d.yellowCards,
                    red_cards: d.redCards,
                    accumulated_yellow_cards: d.yellowCards,
                    is_suspended: isSuspended,
                },
            });
        }));
    }
    // Expose cho resolveAppeal (không tạo MatchResult mới, chỉ recompute sau overturn).
    async recomputeStandingsFor(groupId) {
        await this.standingsService.recomputeGroupStandings(groupId);
    }
    // ─── Guards ───────────────────────────────────────────────────────────────
    _guardConfirm(match, input) {
        // finished/cancelled → terminal, không confirm được
        if (match.status === MatchStatus.finished ||
            match.status === MatchStatus.cancelled)
            throw createAppError('CONFLICT', `Match ${match.id} đã ở status '${match.status}'`);
        // Guard duplicate — chỉ 1 MatchResult per match (unique constraint ở DB cũng cover,
        // nhưng throw ở đây sớm hơn và có message rõ hơn constraint violation)
        if (match.matchResult)
            throw createAppError('CONFLICT', `Match ${match.id} đã có MatchResult`);
        // Knockout không cho draw ở full_time — phải có extra_time hoặc penalty
        const isKnockout = match.phase.format === PhaseFormat.knockout;
        if (isKnockout && input.resultType === MatchResultType.full_time) {
            if (input.homeScore === input.awayScore)
                throw createAppError('VALIDATION_ERROR', `Match ${match.id}: knockout draw ở full_time — cần extra_time hoặc penalty`);
        }
        // Validate penalty input
        if (input.resultType === MatchResultType.penalty) {
            if (input.homePenalty === undefined || input.awayPenalty === undefined)
                throw createAppError('VALIDATION_ERROR', `Match ${match.id}: resultType=penalty cần homePenalty + awayPenalty`);
            if (input.homePenalty === input.awayPenalty)
                throw createAppError('VALIDATION_ERROR', `Match ${match.id}: penalty không được hoà — ${input.homePenalty}-${input.awayPenalty}`);
        }
    }
    // ─── Winner resolution ────────────────────────────────────────────────────
    // homeFinal / awayFinal = score dùng cho home_final_score (display) và standings.
    // Cho penalty: final = ET score (không cộng penalty goals).
    _resolveWinner(homeTeamId, awayTeamId, input) {
        switch (input.resultType) {
            case MatchResultType.full_time: {
                const winnerTeamId = input.homeScore > input.awayScore ? homeTeamId
                    : input.awayScore > input.homeScore ? awayTeamId
                        : null; // round_robin có thể hoà
                return {
                    winnerTeamId,
                    homeFinal: input.homeScore,
                    awayFinal: input.awayScore,
                };
            }
            case MatchResultType.extra_time: {
                // homeExtraTime = cumulative (90+ET) — bắt buộc ở ET path
                const h = input.homeExtraTime ?? input.homeScore;
                const a = input.awayExtraTime ?? input.awayScore;
                const winnerTeamId = h > a ? homeTeamId : a > h ? awayTeamId : null;
                return { winnerTeamId, homeFinal: h, awayFinal: a };
            }
            case MatchResultType.penalty: {
                // homePenalty/awayPenalty đã được validate ở _guardConfirm
                const winnerTeamId = input.homePenalty > input.awayPenalty ? homeTeamId : awayTeamId;
                // final score = ET score, không cộng penalty
                const h = input.homeExtraTime ?? input.homeScore;
                const a = input.awayExtraTime ?? input.awayScore;
                return { winnerTeamId, homeFinal: h, awayFinal: a };
            }
            case MatchResultType.forfeit:
            case MatchResultType.walkover: {
                const winnerTeamId = input.homeScore > input.awayScore ? homeTeamId : awayTeamId;
                return {
                    winnerTeamId,
                    homeFinal: input.homeScore,
                    awayFinal: input.awayScore,
                };
            }
        }
    }
    // ─── Player statistics ────────────────────────────────────────────────────
    // Gọi trong TX của confirmResult — phải complete trước khi commit.
    //
    // Logic:
    //   1. Single-pass qua events → build delta map (goals, yellowCards, redCards)
    //   2. Batch-fetch accumulated_yellow_cards để tính suspension
    //   3. Upsert từng player — N rows (~22-30 per match)
    //
    // Scale note: Prisma không support bulk upsert với arithmetic increment.
    // Nếu N > 50 hoặc cần performance, dùng raw SQL ON CONFLICT DO UPDATE.
    async _updatePlayerStatistics(tx, matchId, seasonId, yellowSuspension) {
        const events = await tx.matchEvent.findMany({
            where: { match_id: matchId },
            select: { player_id: true, team_id: true, type: true },
        });
        if (events.length === 0)
            return;
        // Build deltas — single pass qua events
        const played = new Set();
        const deltas = new Map();
        const key = (pid, tid) => `${pid}:${tid}`;
        for (const ev of events) {
            if (!ev.player_id || !ev.team_id)
                continue;
            const k = key(ev.player_id, ev.team_id);
            played.add(k);
            const d = deltas.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0 };
            switch (ev.type) {
                case MatchEventType.goal:
                case MatchEventType.penalty_scored:
                    d.goals++;
                    break;
                case MatchEventType.yellow_card:
                    d.yellowCards++;
                    break;
                case MatchEventType.red_card:
                case MatchEventType.second_yellow:
                    d.redCards++;
                    break;
                // own_goal → goals_against cho team đối thủ (TeamStanding), bỏ qua ở player stats
                // substitution, card_rescinded, goal_disallowed → không tác động stats cá nhân
            }
            deltas.set(k, d);
        }
        if (played.size === 0)
            return;
        // Batch-fetch accumulated yellow cards — 1 query thay vì N findUnique trong loop
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
            accumMap.set(key(s.player_id, s.team_id), s.accumulated_yellow_cards);
        }
        // Upsert từng player — N rows, parallel Promise.all
        // Suspension trigger: accumulated yellows >= threshold HOẶC có red/second_yellow trong trận này
        await Promise.all([...played].map(async (k) => {
            const [playerIdStr, teamIdStr] = k.split(':');
            const playerId = Number(playerIdStr);
            const teamId = Number(teamIdStr);
            const d = deltas.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0 };
            const prevAccum = accumMap.get(k) ?? 0;
            const newAccumYellow = prevAccum + d.yellowCards;
            const isSuspended = newAccumYellow >= yellowSuspension || d.redCards > 0;
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
                    accumulated_yellow_cards: newAccumYellow,
                    is_suspended: isSuspended,
                },
                update: {
                    matches_played: { increment: 1 },
                    goals_scored: { increment: d.goals },
                    yellow_cards: { increment: d.yellowCards },
                    red_cards: { increment: d.redCards },
                    accumulated_yellow_cards: newAccumYellow, // set, không increment — đã cộng prevAccum
                    is_suspended: isSuspended,
                },
            });
        }));
    }
    // ─── Helpers ──────────────────────────────────────────────────────────────
    async _tryRecomputeStandings(isKnockout, groupId) {
        if (isKnockout || !groupId)
            return false;
        await this.standingsService.recomputeGroupStandings(groupId);
        return true;
    }
}
//# sourceMappingURL=matchresult.service.js.map