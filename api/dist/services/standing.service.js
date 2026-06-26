import { Queryable } from '../libs/queryable.js';
import { PLAYER_STATISTIC_SELECT, TEAM_STANDING_SELECT } from '../types/standing.type.js';
export class StandingsService {
    prisma;
    standingQueryable;
    playerStatQueryable;
    constructor(prisma) {
        this.prisma = prisma;
        // Config cho standings
        const standingConfig = {
            select: TEAM_STANDING_SELECT,
            sortable: ['position', 'points', 'goals_for', 'wins', 'id'],
            defaultSort: { column: 'position', direction: 'asc' },
            filterable: [],
            defaultPerPage: 20,
            maxPerPage: 50,
            // beforeBuild: add season_id constraint qua group join
            beforeBuild: () => {
                // season_id constraint inject bởi caller via filter
            },
        };
        // Config cho player stats
        const playerStatConfig = {
            select: PLAYER_STATISTIC_SELECT,
            sortable: ['goals_scored', 'yellow_cards', 'red_cards', 'matches_played', 'id'],
            defaultSort: { column: 'goals_scored', direction: 'desc' },
            filterable: [],
            defaultPerPage: 20,
            maxPerPage: 100,
        };
        this.standingQueryable = new Queryable(this.prisma.teamStanding, standingConfig);
        this.playerStatQueryable = new Queryable(this.prisma.playerStatistic, playerStatConfig);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // READ — STANDINGS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * List standings của season.
     *
     * Pattern:
     *   - seasonId dùng để filter qua group.phase.season_id
     *   - groupId optional (filter thêm group)
     *   - QueryRequest build từ HTTP query params (page, sort, etc)
     */
    async listStandings(seasonId, req) {
        // Build complex filter: season_id (qua group) + group_id (optional)
        const queryReq = {
            ...req,
            filter: {
                ...(req.filter || {}),
                // season constraint via nested filter (group.phase.season_id)
                // Existing Queryable support nested filters nếu schema cho phép
                // Nếu không, có thể dùng beforeBuild hook hoặc call finMany manual
            },
        };
        // TODO: Nếu Queryable không support nested filter (group.phase.season_id),
        // phải dùng approach khác:
        // Option 1: beforeBuild hook (season_id inject vào where)
        // Option 2: Manual findMany + count (bypass Queryable cho case phức tạp)
        // Option 3: View + join bảng season trực tiếp vào TeamStanding
        // Tạm thời: call manual nếu cần nested filter
        return this._listStandingsManual(seasonId, req);
    }
    async _listStandingsManual(seasonId, req) {
        const page = Math.max(1, Number(req.page) || 1);
        const per_page = Math.min(Math.max(1, Number(req.per_page) || 20), 50);
        const skip = (page - 1) * per_page;
        const sortColumn = req.sort || 'position';
        const sortDir = req.direction || 'asc';
        // Build where: season_id (via group.phase.season_id) + group_id (optional)
        const where = {
            group: {
                phase: { season_id: seasonId },
                ...(req.filter?.group_id && { id: req.filter.group_id }),
            },
            is_active: true,
        };
        const [data, total] = await Promise.all([
            this.prisma.teamStanding.findMany({
                where,
                select: TEAM_STANDING_SELECT,
                orderBy: { [sortColumn]: sortDir },
                skip,
                take: per_page,
            }),
            this.prisma.teamStanding.count({ where }),
        ]);
        const last_page = Math.ceil(total / per_page) || 1;
        return {
            data,
            meta: {
                total,
                page,
                per_page,
                last_page,
                has_next: page < last_page,
            },
        };
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // READ — PLAYER STATS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * List player stats trong season.
     *
     * Pattern: seasonId context + QueryRequest from HTTP
     */
    async listPlayerStats(seasonId, req) {
        // Build QueryRequest: season_id (context) + team_id (optional filter)
        const queryReq = {
            ...req,
            filter: {
                ...(req.filter || {}),
                season_id: { eq: seasonId },
                ...(req.filter?.team_id && { team_id: req.filter.team_id }),
            },
        };
        return this.playerStatQueryable.run(queryReq);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // READ — SUSPENDED PLAYERS (simple list, không pagination)
    // ═══════════════════════════════════════════════════════════════════════════
    async getSuspendedPlayers(seasonId) {
        return this.prisma.playerStatistic.findMany({
            where: { season_id: seasonId, is_suspended: true },
            include: {
                player: { select: { id: true, name: true } },
                team: { select: { id: true, name: true } },
            },
            orderBy: { team_id: 'asc' },
        });
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // WRITE — RECOMPUTE STANDINGS
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Recompute standings của 1 group từ đầu.
     * Full scan: không incremental (group size ≤ 8).
     */
    async recomputeGroupStandings(groupId) {
        const group = await this.prisma.group.findUniqueOrThrow({
            where: { id: groupId },
            select: {
                phase: {
                    select: {
                        season: {
                            select: {
                                id: true,
                                tournament: {
                                    select: {
                                        tournamentRule: {
                                            select: {
                                                points_per_win: true,
                                                points_per_draw: true,
                                                points_per_loss: true,
                                                tiebreaker_order: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const rule = group.phase.season?.tournament?.tournamentRule;
        const pointsWin = rule?.points_per_win ?? 3;
        const pointsDraw = rule?.points_per_draw ?? 1;
        const pointsLoss = rule?.points_per_loss ?? 0;
        const tiebreakerOrder = rule?.tiebreaker_order ?? ['goal_diff', 'goals_scored', 'head_to_head'];
        const seasonId = group.phase.season?.id;
        // Load official matches (finished + forfeited)
        const matches = await this.prisma.match.findMany({
            where: {
                group_id: groupId,
                status: { in: ['finished', 'forfeited'] },
                is_active: true,
            },
            select: {
                id: true,
                home_team_id: true,
                away_team_id: true,
                matchResult: {
                    select: {
                        home_final_score: true,
                        away_final_score: true,
                        winner_team_id: true,
                        status: true,
                    },
                },
            },
        });
        const officialMatches = matches.filter(m => m.matchResult?.status === 'official');
        const seasonTeams = await this.prisma.seasonTeam.findMany({
            where: { group_id: groupId },
            select: { team_id: true },
        });
        const teamIds = seasonTeams.map(st => st.team_id);
        // Init accumulators
        const standings = new Map(teamIds.map(tid => [tid, {
                teamId: tid, played: 0, wins: 0, draws: 0, losses: 0,
                goalsFor: 0, goalsAgainst: 0, yellowCards: 0, redCards: 0, points: 0,
            }]));
        // Accumulate scores từ matches
        for (const m of officialMatches) {
            const r = m.matchResult;
            const home = standings.get(m.home_team_id);
            const away = standings.get(m.away_team_id);
            if (!home || !away)
                continue;
            const hg = r.home_final_score;
            const ag = r.away_final_score;
            home.played++;
            away.played++;
            home.goalsFor += hg;
            home.goalsAgainst += ag;
            away.goalsFor += ag;
            away.goalsAgainst += hg;
            if (hg > ag) {
                home.wins++;
                home.points += pointsWin;
                away.losses++;
                away.points += pointsLoss;
            }
            else if (ag > hg) {
                away.wins++;
                away.points += pointsWin;
                home.losses++;
                home.points += pointsLoss;
            }
            else {
                home.draws++;
                home.points += pointsDraw;
                away.draws++;
                away.points += pointsDraw;
            }
        }
        // Load card stats nếu tiebreaker cần
        const needsCardStats = tiebreakerOrder.includes('yellow_cards') ||
            tiebreakerOrder.includes('red_cards');
        if (needsCardStats && seasonId) {
            const cardStats = await this.prisma.playerStatistic.groupBy({
                by: ['team_id'],
                where: { team_id: { in: teamIds }, season_id: seasonId },
                _sum: { yellow_cards: true, red_cards: true },
            });
            for (const stat of cardStats) {
                const s = standings.get(stat.team_id);
                if (!s)
                    continue;
                s.yellowCards = stat._sum.yellow_cards ?? 0;
                s.redCards = stat._sum.red_cards ?? 0;
            }
        }
        // Build H2H map
        const h2h = new Map();
        if (tiebreakerOrder.includes('head_to_head')) {
            const k = (a, b) => `${a}:${b}`;
            for (const m of officialMatches) {
                const r = m.matchResult;
                const hg = r.home_final_score;
                const ag = r.away_final_score;
                const homeH2H = h2h.get(k(m.home_team_id, m.away_team_id)) ?? { goalsFor: 0, goalsAgainst: 0, points: 0 };
                const awayH2H = h2h.get(k(m.away_team_id, m.home_team_id)) ?? { goalsFor: 0, goalsAgainst: 0, points: 0 };
                homeH2H.goalsFor += hg;
                homeH2H.goalsAgainst += ag;
                awayH2H.goalsFor += ag;
                awayH2H.goalsAgainst += hg;
                if (hg > ag) {
                    homeH2H.points += pointsWin;
                }
                else if (ag > hg) {
                    awayH2H.points += pointsWin;
                }
                else {
                    homeH2H.points += pointsDraw;
                    awayH2H.points += pointsDraw;
                }
                h2h.set(k(m.home_team_id, m.away_team_id), homeH2H);
                h2h.set(k(m.away_team_id, m.home_team_id), awayH2H);
            }
        }
        // Sort with H2H mini-league logic
        const sorted = this._sortStandings([...standings.values()], tiebreakerOrder, h2h, officialMatches, pointsWin, pointsDraw);
        // Upsert batch
        await this.prisma.$transaction(sorted.map((s, idx) => this.prisma.teamStanding.upsert({
            where: { group_id_team_id: { group_id: groupId, team_id: s.teamId } },
            create: {
                group_id: groupId,
                team_id: s.teamId,
                position: idx + 1,
                matches_played: s.played,
                wins: s.wins,
                draws: s.draws,
                losses: s.losses,
                goals_for: s.goalsFor,
                goals_against: s.goalsAgainst,
                points: s.points,
            },
            update: {
                position: idx + 1,
                matches_played: s.played,
                wins: s.wins,
                draws: s.draws,
                losses: s.losses,
                goals_for: s.goalsFor,
                goals_against: s.goalsAgainst,
                points: s.points,
            },
        })));
    }
    // ─── Sort logic ────────────────────────────────────────────────────────────
    _sortStandings(teams, tiebreakerOrder, h2h, officialMatches, pointsWin, pointsDraw) {
        const useH2H = tiebreakerOrder.includes('head_to_head');
        if (!useH2H) {
            return [...teams].sort((a, b) => this._compareOverall(a, b, tiebreakerOrder, h2h));
        }
        const criteriaBeforeH2H = tiebreakerOrder.slice(0, tiebreakerOrder.indexOf('head_to_head'));
        const criteriaAfterH2H = tiebreakerOrder.slice(tiebreakerOrder.indexOf('head_to_head') + 1);
        const preliminary = [...teams].sort((a, b) => {
            if (b.points !== a.points)
                return b.points - a.points;
            return this._applyTiebreakers(a, b, criteriaBeforeH2H, h2h);
        });
        const result = [];
        let i = 0;
        while (i < preliminary.length) {
            let j = i + 1;
            while (j < preliminary.length &&
                preliminary[j].points === preliminary[i].points &&
                this._applyTiebreakers(preliminary[i], preliminary[j], criteriaBeforeH2H, h2h) === 0)
                j++;
            const group = preliminary.slice(i, j);
            if (group.length === 1) {
                result.push(group[0]);
            }
            else {
                const miniH2H = this._buildMiniH2H(group.map(t => t.teamId), officialMatches, pointsWin, pointsDraw);
                const sortedGroup = [...group].sort((a, b) => {
                    const aH2H = miniH2H.get(a.teamId);
                    const bH2H = miniH2H.get(b.teamId);
                    const ptsDiff = (bH2H?.points ?? 0) - (aH2H?.points ?? 0);
                    if (ptsDiff !== 0)
                        return ptsDiff;
                    const gdDiff = ((bH2H?.goalsFor ?? 0) - (bH2H?.goalsAgainst ?? 0)) -
                        ((aH2H?.goalsFor ?? 0) - (aH2H?.goalsAgainst ?? 0));
                    if (gdDiff !== 0)
                        return gdDiff;
                    const gsDiff = (bH2H?.goalsFor ?? 0) - (aH2H?.goalsFor ?? 0);
                    if (gsDiff !== 0)
                        return gsDiff;
                    return this._applyTiebreakers(a, b, criteriaAfterH2H, h2h);
                });
                result.push(...sortedGroup);
            }
            i = j;
        }
        return result;
    }
    _buildMiniH2H(teamIds, officialMatches, pointsWin, pointsDraw) {
        const idSet = new Set(teamIds);
        const map = new Map(teamIds.map(id => [id, { points: 0, goalsFor: 0, goalsAgainst: 0 }]));
        for (const m of officialMatches) {
            if (!idSet.has(m.home_team_id) || !idSet.has(m.away_team_id))
                continue;
            if (!m.matchResult)
                continue;
            const hg = m.matchResult.home_final_score;
            const ag = m.matchResult.away_final_score;
            const home = map.get(m.home_team_id);
            const away = map.get(m.away_team_id);
            home.goalsFor += hg;
            home.goalsAgainst += ag;
            away.goalsFor += ag;
            away.goalsAgainst += hg;
            if (hg > ag) {
                home.points += pointsWin;
            }
            else if (ag > hg) {
                away.points += pointsWin;
            }
            else {
                home.points += pointsDraw;
                away.points += pointsDraw;
            }
        }
        return map;
    }
    _compareOverall(a, b, tiebreakerOrder, h2h) {
        if (b.points !== a.points)
            return b.points - a.points;
        return this._applyTiebreakers(a, b, tiebreakerOrder, h2h);
    }
    _applyTiebreakers(a, b, criteria, h2h) {
        for (const criterion of criteria) {
            switch (criterion) {
                case 'goal_diff': {
                    const diff = (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
                    if (diff !== 0)
                        return diff;
                    break;
                }
                case 'goals_scored': {
                    const diff = b.goalsFor - a.goalsFor;
                    if (diff !== 0)
                        return diff;
                    break;
                }
                case 'goals_conceded': {
                    const diff = a.goalsAgainst - b.goalsAgainst;
                    if (diff !== 0)
                        return diff;
                    break;
                }
                case 'head_to_head': {
                    const aH2H = h2h.get(`${a.teamId}:${b.teamId}`);
                    const bH2H = h2h.get(`${b.teamId}:${a.teamId}`);
                    const ptsDiff = (bH2H?.points ?? 0) - (aH2H?.points ?? 0);
                    if (ptsDiff !== 0)
                        return ptsDiff;
                    const gdDiff = ((bH2H?.goalsFor ?? 0) - (bH2H?.goalsAgainst ?? 0)) -
                        ((aH2H?.goalsFor ?? 0) - (aH2H?.goalsAgainst ?? 0));
                    if (gdDiff !== 0)
                        return gdDiff;
                    const gsDiff = (bH2H?.goalsFor ?? 0) - (aH2H?.goalsFor ?? 0);
                    if (gsDiff !== 0)
                        return gsDiff;
                    break;
                }
                case 'yellow_cards': {
                    const diff = a.yellowCards - b.yellowCards;
                    if (diff !== 0)
                        return diff;
                    break;
                }
                case 'red_cards': {
                    const diff = a.redCards - b.redCards;
                    if (diff !== 0)
                        return diff;
                    break;
                }
            }
        }
        return 0;
    }
}
//# sourceMappingURL=standing.service.js.map