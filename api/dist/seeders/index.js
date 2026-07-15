// prisma/seed/index.ts
import { seedClasses } from "./classSeeder.js";
import { seedRoles } from "./roleSeeder.js";
import { seedUsers } from "./userSeeder.js";
import { seedPlayersFromExistingUsers } from "./playerSeeder.js";
import { seedTeams, seedTeamLeadersFromExistingUsers } from "./teamSeeder.js";
import { seedSquads } from "./squadSeeder.js";
import { seedWorldCupTournament } from "./tournamentSeeder.js";
import { seedSeason } from "./seasonSeeder.js";
import { seedGroupStage } from "./groupPhaseSeeder.js";
import { seedGroupMatchesAndStandings } from "./groupMatchSeeder.js";
import { seedKnockoutBracket } from "./knockoutSeeder.js";
import { seedMatchDetails } from "./matchDetailSeeder.js";
import { seedPlayerStatistics } from "./playerStatisticSeeder.js";
import { seedPayments } from "./paymentSeeder.js";
import { generateTeamNames, generateGroups, generateRoundOf16Template, generateVenues, GROUP_LETTERS, } from "./teamGenerator.js";
import { PhaseType, } from "../generated/prisma/client.js";
import prisma from "../libs/prisma.js";
const TX_TIMEOUT_MS = 5 * 60 * 1000;
const MATCH_DETAIL_BATCH_SIZE = 8;
export async function seedDatabase() {
    console.log("🌱 Bắt đầu seed database...\n");
    // ============================================================
    // Generate dữ liệu nền
    // ============================================================
    const teamNames = generateTeamNames();
    const groups = generateGroups(teamNames);
    const roundOf16Template = generateRoundOf16Template(GROUP_LETTERS);
    const venues = generateVenues();
    // ============================================================
    // 1. CLASS
    // ============================================================
    // PHẢI chạy trước Team + Player
    // vì User(class_id) và Team(class_id) phụ thuộc vào đây
    const { classIdByName } = await seedClasses(prisma);
    // ============================================================
    // 2. ROLE + USER
    // ============================================================
    const roleMap = await seedRoles(prisma);
    await seedUsers(prisma, roleMap);
    const adminUser = await prisma.user.findUniqueOrThrow({
        where: {
            email: "admin@gmail.com"
        }
    });
    // ============================================================
    // 3. PLAYER
    // User có role player -> tạo Player 1-1
    // ============================================================
    const linkedPlayerIds = await seedPlayersFromExistingUsers(prisma, classIdByName);
    // ============================================================
    // 4. TEAM + TEAM LEADER
    // ============================================================
    const { teamIdByName } = await seedTeams(prisma, adminUser.id, teamNames, classIdByName);
    await seedTeamLeadersFromExistingUsers(prisma, teamIdByName);
    // ============================================================
    // 5. SQUAD
    // ============================================================
    const unassignedRealPlayerIds = Object.values(linkedPlayerIds);
    await seedSquads(prisma, teamIdByName, unassignedRealPlayerIds);
    // Verify squad
    const squadCounts = await prisma.teamPlayer.groupBy({
        by: ["team_id"],
        _count: {
            team_id: true
        },
        where: {
            team_id: {
                in: Object.values(teamIdByName)
            }
        }
    });
    const countByTeamId = new Map(squadCounts.map(s => [
        s.team_id,
        s._count.team_id
    ]));
    const understaffed = Object.entries(teamIdByName)
        .filter(([, teamId]) => (countByTeamId.get(teamId) ?? 0) < 11);
    if (understaffed.length > 0) {
        throw new Error(`[Index] Có đội chưa đủ 11 cầu thủ: ${understaffed
            .map(([name, id]) => `${name}(#${id})=${countByTeamId.get(id) ?? 0}`)
            .join(", ")}`);
    }
    console.log(`[Index] Verify squad OK: ${Object.keys(teamIdByName).length} teams`);
    // ============================================================
    // 6. TOURNAMENT + RULE
    // ============================================================
    const { tournamentId, tournamentRuleId } = await seedWorldCupTournament(prisma, adminUser.id);
    const tournamentRule = await prisma.tournamentRule.findUniqueOrThrow({
        where: {
            id: tournamentRuleId
        }
    });
    const rulePoints = {
        win: tournamentRule.points_per_win,
        draw: tournamentRule.points_per_draw,
        loss: tournamentRule.points_per_loss,
    };
    // ============================================================
    // 7. SEASON + VENUE + SEASON TEAM
    // ============================================================
    const { seasonId, venueIds, seasonTeamIdByTeamId } = await seedSeason(prisma, tournamentId, tournamentRuleId, adminUser.id, teamIdByName, venues);
    // ============================================================
    // CHECK TX #1 (Group + Knockout)
    // ============================================================
    const existingFinal = await prisma.phase.findFirst({
        where: {
            season_id: seasonId,
            type: PhaseType.final,
        },
        include: {
            matches: {
                include: {
                    matchResult: true
                }
            }
        }
    });
    const groupKnockoutDone = existingFinal?.matches.some(m => m.matchResult !== null) ?? false;
    let allMatches;
    let championTeamId;
    if (groupKnockoutDone) {
        console.log(`[Index] Season #${seasonId} đã có knockout`);
        const dbMatches = await prisma.match.findMany({
            where: {
                phase: {
                    season_id: seasonId
                },
                home_score: {
                    not: null
                },
                away_score: {
                    not: null
                }
            },
            select: {
                id: true,
                home_team_id: true,
                away_team_id: true,
                home_score: true,
                away_score: true
            }
        });
        allMatches =
            dbMatches.map(m => ({
                matchId: m.id,
                homeTeamId: m.home_team_id,
                awayTeamId: m.away_team_id,
                homeScore: m.home_score,
                awayScore: m.away_score
            }));
        const finalMatch = existingFinal?.matches.find(m => m.matchResult);
        if (!finalMatch ||
            !finalMatch.matchResult?.winner_team_id) {
            throw new Error("Final match thiếu winner_team_id");
        }
        championTeamId =
            finalMatch.matchResult.winner_team_id;
    }
    else {
        // ====================================================
        // TX #1
        // Group + Match vòng bảng + Knockout
        // ====================================================
        const result = await prisma.$transaction(async (tx) => {
            const { groupStagePhaseId, groupIdByLetter } = await seedGroupStage(tx, seasonId, teamIdByName, seasonTeamIdByTeamId, groups);
            const { topTwoByGroup, createdMatches: groupMatches } = await seedGroupMatchesAndStandings(tx, groupStagePhaseId, groupIdByLetter, teamIdByName, seasonId, venueIds, groups, rulePoints);
            const { championTeamId, allMatches: knockoutMatches } = await seedKnockoutBracket(tx, seasonId, topTwoByGroup, venueIds, roundOf16Template);
            return {
                championTeamId,
                allMatches: [
                    ...groupMatches,
                    ...knockoutMatches
                ]
            };
        }, {
            timeout: TX_TIMEOUT_MS
        });
        allMatches =
            result.allMatches;
        championTeamId =
            result.championTeamId;
        console.log(`[Index] TX#1 hoàn tất ${allMatches.length} matches`);
    }
    // ============================================================
    // TX #2
    // MatchDetail + Lineup + Event
    // ============================================================
    const matchIds = allMatches.map(m => m.matchId);
    const existingLineups = await prisma.matchLineup.findMany({
        where: {
            match_id: {
                in: matchIds
            }
        },
        select: {
            match_id: true
        },
        distinct: [
            "match_id"
        ]
    });
    const doneMatchIds = new Set(existingLineups.map(x => x.match_id));
    const needDetails = allMatches.filter(m => !doneMatchIds.has(m.matchId));
    if (needDetails.length === 0) {
        console.log("[Index] MatchDetail đã tồn tại");
    }
    else {
        console.log(`[Index] Seed MatchDetail ${needDetails.length} trận`);
        let detailCount = 0;
        for (let i = 0; i < needDetails.length; i += MATCH_DETAIL_BATCH_SIZE) {
            const batch = needDetails.slice(i, i + MATCH_DETAIL_BATCH_SIZE);
            await prisma.$transaction(async (tx) => {
                for (const m of batch) {
                    const homeSeasonTeamId = seasonTeamIdByTeamId[m.homeTeamId];
                    const awaySeasonTeamId = seasonTeamIdByTeamId[m.awayTeamId];
                    if (homeSeasonTeamId === undefined ||
                        awaySeasonTeamId === undefined) {
                        console.warn(`[Index] Skip match ${m.matchId}`);
                        continue;
                    }
                    await seedMatchDetails(tx, {
                        matchId: m.matchId,
                        homeTeamId: m.homeTeamId,
                        awayTeamId: m.awayTeamId,
                        homeScore: m.homeScore,
                        awayScore: m.awayScore,
                        homeSeasonTeamId,
                        awaySeasonTeamId
                    });
                    detailCount++;
                }
            }, {
                timeout: TX_TIMEOUT_MS
            });
        }
        console.log(`[Index] MatchDetail seeded ${detailCount}`);
        await prisma.$transaction(async (tx) => {
            await seedPlayerStatistics(tx, seasonId);
        }, {
            timeout: TX_TIMEOUT_MS
        });
    }
    // ============================================================
    // VERIFY LINEUP
    // ============================================================
    const lineupCount = await prisma.matchLineup.count({
        where: {
            match_id: {
                in: matchIds
            }
        }
    });
    const matchesHaveLineup = await prisma.matchLineup.findMany({
        where: {
            match_id: {
                in: matchIds
            }
        },
        select: {
            match_id: true
        },
        distinct: [
            "match_id"
        ]
    });
    console.log(`[Index] Verify lineup: ${lineupCount} rows / ${matchesHaveLineup.length}/${matchIds.length} matches`);
    // ============================================================
    // PAYMENT
    // ============================================================
    await seedPayments(prisma, seasonTeamIdByTeamId);
    console.log(`\n✅ Seed hoàn tất! Champion team #${championTeamId}`);
}
// ================================================================
// RUN
// ================================================================
seedDatabase()
    .catch(err => {
    console.error("[Seed] Error:", err);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=index.js.map