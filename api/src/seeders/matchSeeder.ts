import { PrismaClient } from "../generated/prisma/client.js";
import { TeamSeedResult } from "./teamSeeder.js";
import { PhaseGroupResult } from "./phaseSeeder.js";

// Tạo tất cả cặp round-robin trong 1 group (C(n,2))
function roundRobinPairs(teamIds: number[]): [number, number][] {
    const pairs: [number, number][] = [];
    for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
            pairs.push([teamIds[i]!, teamIds[j]!]);
        }
    }
    return pairs;
}

// Random score (1-0 weighted toward low scores, realistic)
function randomScore(): [number, number] {
    const options: [number, number][] = [
        [1, 0], [2, 0], [3, 0], [1, 1], [2, 1],
        [3, 1], [2, 2], [3, 2], [0, 1], [0, 2],
        [1, 2], [0, 3], [1, 3], [2, 3], [3, 3],
        [4, 1], [1, 4], [0, 0],
    ];
    return options[Math.floor(Math.random() * options.length)]!;
}

// Build match events cho 1 match (goals + cards)
async function createMatchEvents(
    db: PrismaClient,
    matchId: number,
    homeTeamId: number,
    awayTeamId: number,
    homeScore: number,
    awayScore: number,
    homePlayerIds: number[],
    awayPlayerIds: number[]
) {
    // Goals
    const goalMinutes = Array.from({ length: homeScore + awayScore }, () =>
        Math.floor(Math.random() * 90) + 1
    ).sort((a, b) => a - b);

    let hGoals = 0;
    let aGoals = 0;

    for (const minute of goalMinutes) {
        const isHome = hGoals < homeScore && (aGoals >= awayScore || Math.random() > 0.5);
        const teamId = isHome ? homeTeamId : awayTeamId;
        const players = isHome ? homePlayerIds : awayPlayerIds;
        const scorerId = players[Math.floor(Math.random() * players.length)];
        if (scorerId === undefined) continue;

        if (isHome) hGoals++;
        else aGoals++;

        await db.matchEvent.create({
            data: {
                match_id: matchId,
                player_id: scorerId,
                team_id: teamId,
                type: "goal",
                minute,
                period: minute <= 45 ? "first_half" : "second_half",
            },
        });
    }

    // Yellow cards (1-3 per match, random)
    const numYellows = Math.floor(Math.random() * 4);
    for (let i = 0; i < numYellows; i++) {
        const isHome = Math.random() > 0.5;
        const teamId = isHome ? homeTeamId : awayTeamId;
        const players = isHome ? homePlayerIds : awayPlayerIds;
        const slice = players.length > 3 ? players.slice(3) : players;
        const playerId = slice[Math.floor(Math.random() * slice.length)];
        if (playerId === undefined) continue;

        await db.matchEvent.create({
            data: {
                match_id: matchId,
                player_id: playerId,
                team_id: teamId,
                type: "yellow_card",
                minute: Math.floor(Math.random() * 90) + 1,
                period: "second_half",
                card_color: "yellow",
            },
        });
    }
}

// Update TeamStanding sau mỗi match
async function updateStanding(
    db: PrismaClient,
    groupId: number,
    teamId: number,
    goalsFor: number,
    goalsAgainst: number,
    result: "win" | "draw" | "loss"
) {
    const standing = await db.teamStanding.findUnique({
        where: { group_id_team_id: { group_id: groupId, team_id: teamId } },
    });
    if (!standing) return;

    await db.teamStanding.update({
        where: { id: standing.id },
        data: {
            matches_played: { increment: 1 },
            wins: result === "win" ? { increment: 1 } : undefined,
            draws: result === "draw" ? { increment: 1 } : undefined,
            losses: result === "loss" ? { increment: 1 } : undefined,
            goals_for: { increment: goalsFor },
            goals_against: { increment: goalsAgainst },
            points: {
                increment: result === "win" ? 3 : result === "draw" ? 1 : 0,
            },
        },
    });
}

// Update player statistics
async function updatePlayerStat(
    db: PrismaClient,
    playerId: number,
    teamId: number,
    seasonId: number,
    goals: number,
    yellowCards: number
) {
    const existing = await db.playerStatistic.findUnique({
        where: { player_id_team_id_season_id: { player_id: playerId, team_id: teamId, season_id: seasonId } },
    });

    if (existing) {
        await db.playerStatistic.update({
            where: { id: existing.id },
            data: {
                matches_played: { increment: 1 },
                goals_scored: { increment: goals },
                yellow_cards: { increment: yellowCards },
                accumulated_yellow_cards: { increment: yellowCards },
                minutes_played: { increment: 90 },
                is_suspended: existing.accumulated_yellow_cards + yellowCards >= 3,
            },
        });
    } else {
        await db.playerStatistic.create({
            data: {
                player_id: playerId,
                team_id: teamId,
                season_id: seasonId,
                matches_played: 1,
                goals_scored: goals,
                yellow_cards: yellowCards,
                accumulated_yellow_cards: yellowCards,
                minutes_played: 90,
                is_suspended: yellowCards >= 3,
            },
        });
    }
}

export async function seedMatches(
    db: PrismaClient,
    seasonId: number,
    phaseResult: PhaseGroupResult,
    teams: TeamSeedResult[],
    venueId: number,
    adminUserId: number
) {
    console.log("[MatchSeeder] seeding group stage matches...");

    const { groupStagePhaseId, knockoutPhaseIds, groupIds } = phaseResult;
    const [groupAId, groupBId] = groupIds;

    // teams[0..3] = Group A, teams[4..7] = Group B
    const groupATeams = teams.slice(0, 4);
    const groupBTeams = teams.slice(4, 8);

    const groupConfig = [
        { groupId: groupAId, groupTeams: groupATeams },
        { groupId: groupBId, groupTeams: groupBTeams },
    ] as const;

    // Track standings: 1st/2nd per group → quarter final
    const groupWinners: Record<number, number[]> = {};

    for (const { groupId, groupTeams } of groupConfig) {
        const pairs = roundRobinPairs(groupTeams.map((t) => t.teamId));
        let matchDate = new Date("2024-03-01");

        for (const [homeTeamId, awayTeamId] of pairs) {
            const [homeScore, awayScore] = randomScore();

            const homeTeam = groupTeams.find((t) => t.teamId === homeTeamId)!;
            const awayTeam = groupTeams.find((t) => t.teamId === awayTeamId)!;

            // Match
            const match = await db.match.create({
                data: {
                    phase_id: groupStagePhaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    scheduled_at: new Date(matchDate),
                    played_at: new Date(matchDate),
                    home_score: homeScore,
                    away_score: awayScore,
                    status: "finished",
                    season_id: seasonId,
                    venue_id: venueId,
                    is_published: true,
                    user_id: adminUserId,
                },
            });

            // Events
            await createMatchEvents(
                db, match.id,
                homeTeamId, awayTeamId,
                homeScore, awayScore,
                homeTeam.playerIds, awayTeam.playerIds
            );

            // MatchResult
            const winnerId = homeScore > awayScore ? homeTeamId : awayScore > homeScore ? awayTeamId : null;
            await db.matchResult.create({
                data: {
                    match_id: match.id,
                    winner_team_id: winnerId,
                    home_score: homeScore,
                    away_score: awayScore,
                    home_half_time_score: Math.floor(homeScore / 2),
                    away_half_time_score: Math.floor(awayScore / 2),
                    home_final_score: homeScore,
                    away_final_score: awayScore,
                    result_type: "full_time",
                    status: "official",
                    duration: 90,
                },
            });

            // Update standings
            if (homeScore > awayScore) {
                await updateStanding(db, groupId, homeTeamId, homeScore, awayScore, "win");
                await updateStanding(db, groupId, awayTeamId, awayScore, homeScore, "loss");
            } else if (homeScore < awayScore) {
                await updateStanding(db, groupId, awayTeamId, awayScore, homeScore, "win");
                await updateStanding(db, groupId, homeTeamId, homeScore, awayScore, "loss");
            } else {
                await updateStanding(db, groupId, homeTeamId, homeScore, awayScore, "draw");
                await updateStanding(db, groupId, awayTeamId, awayScore, homeScore, "draw");
            }

            // Update player stats from events
            const events = await db.matchEvent.findMany({ where: { match_id: match.id } });
            const allTeamPlayers = [
                ...homeTeam.playerIds.map((pid) => ({ playerId: pid, teamId: homeTeamId })),
                ...awayTeam.playerIds.map((pid) => ({ playerId: pid, teamId: awayTeamId })),
            ];

            for (const { playerId, teamId } of allTeamPlayers) {
                const goals = events.filter((e) => e.player_id === playerId && e.type === "goal").length;
                const yellows = events.filter((e) => e.player_id === playerId && e.type === "yellow_card").length;
                if (goals > 0 || yellows > 0) {
                    await updatePlayerStat(db, playerId, teamId, seasonId, goals, yellows);
                }
            }

            matchDate = new Date(matchDate.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 ngày
        }

        // Compute group winners (top 2 by points)
        const standings = await db.teamStanding.findMany({
            where: { group_id: groupId },
            orderBy: [
                { points: "desc" },
                { goals_for: "desc" },
            ],
        });

        // Update position
        for (let i = 0; i < standings.length; i++) {
            await db.teamStanding.update({
                where: { id: standings[i]!.id },
                data: { position: i + 1 },
            });
        }

        groupWinners[groupId] = standings.slice(0, 2).map((s) => s.team_id);
        console.log(`  → Group #${groupId} top 2:`, groupWinners[groupId]);
    }

    // ============================================================
    // KNOCKOUT PHASE
    // ============================================================
    console.log("[MatchSeeder] seeding knockout matches...");

    const groupAWinners = groupWinners[groupAId];
    const groupBWinners = groupWinners[groupBId];

    if (!groupAWinners || !groupBWinners) {
        throw new Error("Missing group winners — standings not computed correctly");
    }

    const [a1, a2] = groupAWinners as [number, number];
    const [b1, b2] = groupBWinners as [number, number];

    const qfPhaseId = knockoutPhaseIds["quarter_final"];
    const sfPhaseId = knockoutPhaseIds["semi_final"];
    const thirdPlacePhaseId = knockoutPhaseIds["third_place"];
    const finalPhaseId = knockoutPhaseIds["final"];

    if (!qfPhaseId || !sfPhaseId || !thirdPlacePhaseId || !finalPhaseId) {
        throw new Error("Missing one or more knockout phase IDs");
    }

    // Quarter finals: A1 vs B2, B1 vs A2 (cross pairing)
    const qfPairs: [number, number][] = [
        [a1, b2],
        [b1, a2],
    ];

    // Track knockout winners
    const sfTeams: number[] = [];

    for (const [homeId, awayId] of qfPairs) {
        const [hs, as_] = randomScore();
        // Knockout: nếu draw → penalty
        const isExtraTime = hs === as_;
        const finalHomeWin = isExtraTime ? Math.random() > 0.5 : hs > as_;
        const winnerId = finalHomeWin ? homeId : awayId;
        sfTeams.push(winnerId);

        const match = await db.match.create({
            data: {
                phase_id: qfPhaseId,
                home_team_id: homeId,
                away_team_id: awayId,
                scheduled_at: new Date("2024-04-20"),
                played_at: new Date("2024-04-20"),
                home_score: hs,
                away_score: as_,
                status: "finished",
                season_id: seasonId,
                venue_id: venueId,
                is_published: true,
                user_id: adminUserId,
            },
        });

        await db.matchResult.create({
            data: {
                match_id: match.id,
                winner_team_id: winnerId,
                home_score: hs,
                away_score: as_,
                home_half_time_score: Math.floor(hs / 2),
                away_half_time_score: Math.floor(as_ / 2),
                home_final_score: hs,
                away_final_score: as_,
                home_penalty_score: isExtraTime ? (finalHomeWin ? 5 : 4) : null,
                away_penalty_score: isExtraTime ? (finalHomeWin ? 4 : 5) : null,
                result_type: isExtraTime ? "penalty" : "full_time",
                status: "official",
                duration: isExtraTime ? 120 : 90,
            },
        });
    }

    // Semi finals
    const finalists: number[] = [];
    const thirdPlaceTeams: number[] = [];

    for (let i = 0; i + 1 < sfTeams.length; i += 2) {
        const homeId = sfTeams[i]!;
        const awayId = sfTeams[i + 1]!;

        const [hs, as_] = randomScore();
        const isExtraTime = hs === as_;
        const finalHomeWin = isExtraTime ? Math.random() > 0.5 : hs > as_;
        const winnerId = finalHomeWin ? homeId : awayId;
        const loserId = finalHomeWin ? awayId : homeId;
        finalists.push(winnerId);
        thirdPlaceTeams.push(loserId);

        const match = await db.match.create({
            data: {
                phase_id: sfPhaseId,
                home_team_id: homeId,
                away_team_id: awayId,
                scheduled_at: new Date("2024-05-05"),
                played_at: new Date("2024-05-05"),
                home_score: hs,
                away_score: as_,
                status: "finished",
                season_id: seasonId,
                venue_id: venueId,
                is_published: true,
                user_id: adminUserId,
            },
        });

        await db.matchResult.create({
            data: {
                match_id: match.id,
                winner_team_id: winnerId,
                home_score: hs,
                away_score: as_,
                home_half_time_score: Math.floor(hs / 2),
                away_half_time_score: Math.floor(as_ / 2),
                home_final_score: hs,
                away_final_score: as_,
                home_penalty_score: isExtraTime ? (finalHomeWin ? 5 : 4) : null,
                away_penalty_score: isExtraTime ? (finalHomeWin ? 4 : 5) : null,
                result_type: isExtraTime ? "penalty" : "full_time",
                status: "official",
                duration: isExtraTime ? 120 : 90,
            },
        });
    }

    // Third place match
    const thirdHome = thirdPlaceTeams[0];
    const thirdAway = thirdPlaceTeams[1];

    if (thirdHome !== undefined && thirdAway !== undefined) {
        const [hs, as_] = randomScore();
        const winnerId = hs >= as_ ? thirdHome : thirdAway;

        const match = await db.match.create({
            data: {
                phase_id: thirdPlacePhaseId,
                home_team_id: thirdHome,
                away_team_id: thirdAway,
                scheduled_at: new Date("2024-06-25"),
                played_at: new Date("2024-06-25"),
                home_score: hs,
                away_score: as_,
                status: "finished",
                season_id: seasonId,
                venue_id: venueId,
                is_published: true,
                user_id: adminUserId,
            },
        });

        await db.matchResult.create({
            data: {
                match_id: match.id,
                winner_team_id: winnerId,
                home_score: hs,
                away_score: as_,
                home_half_time_score: Math.floor(hs / 2),
                away_half_time_score: Math.floor(as_ / 2),
                home_final_score: hs,
                away_final_score: as_,
                result_type: "full_time",
                status: "official",
                duration: 90,
            },
        });

        console.log(`  → 3rd place match: Team #${thirdHome} vs #${thirdAway}, winner: #${winnerId}`);
    }

    // Final
    const finalist0 = finalists[0];
    const finalist1 = finalists[1];

    if (finalist0 !== undefined && finalist1 !== undefined) {
        const [hs, as_] = randomScore();
        const isExtraTime = hs === as_;
        const finalHomeWin = isExtraTime ? Math.random() > 0.5 : hs > as_;
        const champion = finalHomeWin ? finalist0 : finalist1;

        const match = await db.match.create({
            data: {
                phase_id: finalPhaseId,
                home_team_id: finalist0,
                away_team_id: finalist1,
                scheduled_at: new Date("2024-06-30"),
                played_at: new Date("2024-06-30"),
                home_score: hs,
                away_score: as_,
                status: "finished",
                season_id: seasonId,
                venue_id: venueId,
                is_published: true,
                user_id: adminUserId,
            },
        });

        await db.matchResult.create({
            data: {
                match_id: match.id,
                winner_team_id: champion,
                home_score: hs,
                away_score: as_,
                home_half_time_score: Math.floor(hs / 2),
                away_half_time_score: Math.floor(as_ / 2),
                home_final_score: hs,
                away_final_score: as_,
                home_penalty_score: isExtraTime ? (finalHomeWin ? 5 : 4) : null,
                away_penalty_score: isExtraTime ? (finalHomeWin ? 4 : 5) : null,
                result_type: isExtraTime ? "penalty" : "full_time",
                status: "official",
                duration: isExtraTime ? 120 : 90,
            },
        });

        console.log(`  → CHAMPION: Team #${champion}`);

        // Notification cho đội vô địch
        await db.notification.create({
            data: {
                title: "🏆 Chúc mừng Vô Địch!",
                content: `Đội #${champion} đã vô địch Mùa Giải 2024!`,
                type: "match_result",
                source: "system",
                season_id: seasonId,
                target_team_id: champion,
                is_read: false,
            },
        });
    }

    console.log("[MatchSeeder] done.");
}