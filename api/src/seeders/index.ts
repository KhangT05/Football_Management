// prisma/seed/index.ts
//
// Chạy: npx tsx prisma/seed/index.ts
//
// ===== THỨ TỰ SEED (đã sửa lại cho đúng dependency FK) =====
// 1. Role
// 2. User
// 3. Player  <- User(role=player)
// 4. Team + TeamLeader <- User(role=leader)
// 5. Squad
// 6. Tournament + TournamentRule
// 7. Venue + Season + SeasonTeam + SeasonTeamJersey
// 8. Phase(group_stage) + Group(A-H) + SeasonTeam.group_id
// 9. Match vòng bảng + MatchResult + TeamStanding
// 10. Knockout: R16 -> QF -> SF -> third_place -> final
// 11. MatchDetail (Lineup + JerseyAssignment + Event) cho TẤT CẢ match ở bước 9+10
// 12. PlayerStatistic (tổng hợp từ MatchLineup + MatchEvent, phải chạy SAU bước 11)
// 13. Payment cho từng SeasonTeam
//
// Bước 11-13 trước đây tồn tại như file riêng nhưng KHÔNG được gọi — bổ sung
// lại vào flow chính, nếu không toàn bộ Lineup/Event/Statistic/Payment rỗng.
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
import prisma from "../libs/prisma.js";

export async function seedDatabase() {
    console.log("🌱 Bắt đầu seed World Cup demo...\n");

    // 1-2. Role + User
    const roleMap = await seedRoles(prisma);
    await seedUsers(prisma, roleMap);

    const adminUser = await prisma.user.findUniqueOrThrow({ where: { email: "admin@gmail.com" } });

    // 3. Player <- User(role=player)
    const linkedPlayerIds = await seedPlayersFromExistingUsers(prisma);

    // 4. Team + TeamLeader
    const { teamIdByName } = await seedTeams(prisma, adminUser.id);
    await seedTeamLeadersFromExistingUsers(prisma, teamIdByName);

    // 5. Squad
    const unassignedRealPlayerIds = Object.values(linkedPlayerIds);
    await seedSquads(prisma, teamIdByName, unassignedRealPlayerIds);

    // 6. Tournament + TournamentRule
    const { tournamentId, tournamentRuleId } = await seedWorldCupTournament(prisma, adminUser.id);

    // 7. Venue + Season + SeasonTeam + SeasonTeamJersey
    const { seasonId, venueIds, seasonTeamIdByTeamId } = await seedSeason(
        prisma,
        tournamentId,
        tournamentRuleId,
        adminUser.id,
        teamIdByName
    );

    // 8. Phase(group_stage) + Group(A-H)
    const { groupStagePhaseId, groupIdByLetter } = await seedGroupStage(
        prisma,
        seasonId,
        teamIdByName,
        seasonTeamIdByTeamId
    );

    // 9. Match vòng bảng + TeamStanding
    const { topTwoByGroup, createdMatches: groupMatches } = await seedGroupMatchesAndStandings(
        prisma,
        groupStagePhaseId,
        groupIdByLetter,
        teamIdByName,
        seasonId,
        venueIds
    );

    // 10. Knockout
    const { championTeamId, allMatches: knockoutMatches } = await seedKnockoutBracket(
        prisma,
        seasonId,
        topTwoByGroup,
        venueIds
    );

    // 11. MatchDetail cho toàn bộ trận (group + knockout)
    const allMatches = [...groupMatches, ...knockoutMatches];
    let detailCount = 0;
    for (const m of allMatches) {
        const homeSeasonTeamId = seasonTeamIdByTeamId[m.homeTeamId];
        const awaySeasonTeamId = seasonTeamIdByTeamId[m.awayTeamId];
        if (homeSeasonTeamId === undefined || awaySeasonTeamId === undefined) {
            console.warn(`[Index] Bỏ qua matchDetail cho match #${m.matchId}: thiếu seasonTeamId`);
            continue;
        }
        await seedMatchDetails(prisma, {
            matchId: m.matchId,
            homeTeamId: m.homeTeamId,
            awayTeamId: m.awayTeamId,
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            homeSeasonTeamId,
            awaySeasonTeamId,
        });
        detailCount++;
    }
    console.log(`[Index] MatchDetail xong cho ${detailCount}/${allMatches.length} trận`);

    // 12. PlayerStatistic — PHẢI chạy sau bước 11 vì đọc từ MatchLineup + MatchEvent
    await seedPlayerStatistics(prisma, seasonId);

    // 13. Payment
    await seedPayments(prisma, seasonTeamIdByTeamId);

    console.log(`\n✅ Seed hoàn tất! Vô địch: team #${championTeamId}`);
}
