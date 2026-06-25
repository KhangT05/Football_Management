import { MatchResultStatus, MatchStatus, PrismaClient } from '../generated/prisma/client.js';

// ─── Types ────────────────────────────────────────────────────────────────────

type StandingAccum = {
    teamId: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    yellowCards: number;
    redCards: number;
    points: number;
};

type H2HRecord = {
    goalsFor: number;
    goalsAgainst: number;
    points: number;
};

// ─── Service ──────────────────────────────────────────────────────────────────
// Nơi DUY NHẤT tính/ghi TeamStanding.
// Recompute từ đầu (full scan) thay vì incremental — đơn giản, không drift,
// chấp nhận được vì group size ≤ 8 và chỉ trigger khi có match mới hoặc appeal resolve.

export class StandingsService {
    constructor(private readonly prisma: PrismaClient) { }

    async recomputeGroupStandings(groupId: number): Promise<void> {
        const group = await this.prisma.group.findUniqueOrThrow({
            where: { id: groupId },
            select: {
                phase: {
                    select: {
                        season: {
                            select: {
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
        const tiebreakerOrder = (rule?.tiebreaker_order as string[]) ?? ['goal_diff', 'goals_scored', 'head_to_head'];

        // Tính trên finished + forfeited — cả 2 đều có MatchResult với score chính thức.
        // under_review/protested bị loại tạm — tính lại sau khi appeal resolve.
        // abandoned/cancelled không có MatchResult → không ảnh hưởng.
        const matches = await this.prisma.match.findMany({
            where: {
                group_id: groupId,
                status: { in: [MatchStatus.finished, MatchStatus.forfeited] },
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

        // Chỉ tính match có result official — under_review/protested loại tạm
        const officialMatches = matches.filter(
            m => m.matchResult?.status === MatchResultStatus.official,
        );

        const seasonTeams = await this.prisma.seasonTeam.findMany({
            where: { group_id: groupId },
            select: { team_id: true },
        });
        const teamIds = seasonTeams.map(st => st.team_id);

        // Build accumulators — init tất cả teams về 0
        const standings = new Map<number, StandingAccum>(
            teamIds.map(tid => [tid, {
                teamId: tid, played: 0, wins: 0, draws: 0, losses: 0,
                goalsFor: 0, goalsAgainst: 0, yellowCards: 0, redCards: 0, points: 0,
            }]),
        );

        // Single-pass accumulate
        for (const m of officialMatches) {
            const r = m.matchResult!;
            const home = standings.get(m.home_team_id);
            const away = standings.get(m.away_team_id);
            if (!home || !away) continue;

            const hg = r.home_final_score;
            const ag = r.away_final_score;

            home.played++; away.played++;
            home.goalsFor += hg; home.goalsAgainst += ag;
            away.goalsFor += ag; away.goalsAgainst += hg;

            if (hg > ag) {
                home.wins++; home.points += pointsWin;
                away.losses++; away.points += pointsLoss;
            } else if (ag > hg) {
                away.wins++; away.points += pointsWin;
                home.losses++; home.points += pointsLoss;
            } else {
                home.draws++; home.points += pointsDraw;
                away.draws++; away.points += pointsDraw;
            }
        }

        // Aggregate yellow/red từ PlayerStatistic nếu tiebreaker cần
        // Fetch 1 lần, không fetch trong sort loop
        const needsCardStats =
            tiebreakerOrder.includes('yellow_cards') ||
            tiebreakerOrder.includes('red_cards');

        if (needsCardStats) {
            // season_id lấy từ group → phase → season
            const season = await this.prisma.group.findUnique({
                where: { id: groupId },
                select: { phase: { select: { season: { select: { id: true } } } } },
            });
            const seasonId = season?.phase.season?.id;

            if (seasonId) {
                const cardStats = await this.prisma.playerStatistic.groupBy({
                    by: ['team_id'],
                    where: { team_id: { in: teamIds }, season_id: seasonId },
                    _sum: { yellow_cards: true, red_cards: true },
                });

                for (const stat of cardStats) {
                    const s = standings.get(stat.team_id);
                    if (!s) continue;
                    s.yellowCards = stat._sum.yellow_cards ?? 0;
                    s.redCards = stat._sum.red_cards ?? 0;
                }
            }
        }

        // Build H2H map nếu tiebreaker cần
        // O(n²) trong nhóm teams bằng điểm nhau — group size ≤ 8, trivial
        const h2h = new Map<string, H2HRecord>();

        if (tiebreakerOrder.includes('head_to_head')) {
            const k = (a: number, b: number) => `${a}:${b}`;

            for (const m of officialMatches) {
                const r = m.matchResult!;
                const hg = r.home_final_score;
                const ag = r.away_final_score;

                const homeH2H = h2h.get(k(m.home_team_id, m.away_team_id))
                    ?? { goalsFor: 0, goalsAgainst: 0, points: 0 };
                const awayH2H = h2h.get(k(m.away_team_id, m.home_team_id))
                    ?? { goalsFor: 0, goalsAgainst: 0, points: 0 };

                homeH2H.goalsFor += hg; homeH2H.goalsAgainst += ag;
                awayH2H.goalsFor += ag; awayH2H.goalsAgainst += hg;

                if (hg > ag) homeH2H.points += pointsWin;
                else if (ag > hg) awayH2H.points += pointsWin;
                else {
                    homeH2H.points += pointsDraw;
                    awayH2H.points += pointsDraw;
                }

                h2h.set(k(m.home_team_id, m.away_team_id), homeH2H);
                h2h.set(k(m.away_team_id, m.home_team_id), awayH2H);
            }
        }

        // Sort — điểm trước, sau đó tiebreaker theo thứ tự từ TournamentRule
        const sorted = [...standings.values()].sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;

            for (const criterion of tiebreakerOrder) {
                switch (criterion) {
                    case 'goal_diff': {
                        const diff = (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
                        if (diff !== 0) return diff;
                        break;
                    }
                    case 'goals_scored': {
                        const diff = b.goalsFor - a.goalsFor;
                        if (diff !== 0) return diff;
                        break;
                    }
                    case 'goals_conceded': {
                        // Ít bàn thua hơn = xếp trên
                        const diff = a.goalsAgainst - b.goalsAgainst;
                        if (diff !== 0) return diff;
                        break;
                    }
                    case 'head_to_head': {
                        const aH2H = h2h.get(`${a.teamId}:${b.teamId}`);
                        const bH2H = h2h.get(`${b.teamId}:${a.teamId}`);

                        // H2H points trước
                        const ptsDiff = (bH2H?.points ?? 0) - (aH2H?.points ?? 0);
                        if (ptsDiff !== 0) return ptsDiff;

                        // H2H goal diff
                        const gdDiff =
                            ((bH2H?.goalsFor ?? 0) - (bH2H?.goalsAgainst ?? 0)) -
                            ((aH2H?.goalsFor ?? 0) - (aH2H?.goalsAgainst ?? 0));
                        if (gdDiff !== 0) return gdDiff;

                        // H2H goals scored
                        const gsDiff = (bH2H?.goalsFor ?? 0) - (aH2H?.goalsFor ?? 0);
                        if (gsDiff !== 0) return gsDiff;
                        break;
                    }
                    case 'yellow_cards': {
                        // Ít thẻ vàng hơn = xếp trên
                        const diff = a.yellowCards - b.yellowCards;
                        if (diff !== 0) return diff;
                        break;
                    }
                    case 'red_cards': {
                        // Ít thẻ đỏ hơn = xếp trên
                        const diff = a.redCards - b.redCards;
                        if (diff !== 0) return diff;
                        break;
                    }
                    // Các tiebreaker không handle → silently skip, không crash
                    // drawing_of_lots và các giá trị custom xử lý ngoài system
                }
            }

            return 0; // vẫn bằng nhau → giữ nguyên thứ tự (drawing of lots ngoài system)
        });

        // Upsert standings — MySQL không có createMany + ON CONFLICT DO UPDATE
        // nên phải upsert từng row. N ≤ 8 (group size), không cần batch raw SQL.
        await this.prisma.$transaction(
            sorted.map((s, idx) =>
                this.prisma.teamStanding.upsert({
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
                }),
            ),
        );
    }
}