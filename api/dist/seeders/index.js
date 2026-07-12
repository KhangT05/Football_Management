// prisma/seed/index.ts
//
// Chạy: npm run seed  (script riêng — KHÔNG được gọi từ app bootstrap, xem src/index.ts)
//
// ===== THỨ TỰ SEED =====
// 1. Role
// 2. User
// 3. Player  <- User(role=player)
// 4. Team + TeamLeader <- User(role=leader)
// 5. Squad
// 6. Tournament + TournamentRule
// 7. Venue + Season + SeasonTeam + SeasonTeamJersey
// --- Idempotency check: nếu season đã có trận chung kết với kết quả, dừng ở đây ---
// 8-10. [TRANSACTION #1] Phase(group_stage)+Group(A-H) -> Match vòng bảng+TeamStanding -> Knockout(R16..Final)
// 11-12. [TRANSACTION #2] MatchDetail (Lineup+Jersey+Event) cho toàn bộ match -> PlayerStatistic
// 13. Payment cho từng SeasonTeam
//
// Vì sao tách 2 transaction thay vì 1: bước 1-7 dùng toàn upsert nên tự idempotent,
// không cần transaction. Bước 8-10 phụ thuộc chuỗi nhau chặt (group phải xong mới có
// topTwoByGroup cho knockout) và tạo record KHÔNG unique-constraint-đủ (Match.leg
// trước đây nullable khiến duplicate lọt qua DB, Group không có unique DB-level) —
// nếu crash giữa chừng mà không có transaction, lần seed sau sẽ đọc state nửa vời
// và tạo lặp (đây là nguyên nhân matches=0/groups=15/tournaments=3 quan sát được).
// Transaction đảm bảo: hoặc toàn bộ vòng bảng+knockout được tạo, hoặc không gì cả.
// Bước 11-12 tách riêng vì nó đọc dữ liệu từ bước 8-10 (không thể gộp chung 1
// transaction quá dài — matchDetail của 56 trận + player stats mất thời gian,
// tăng nguy cơ transaction timeout/lock contention không cần thiết).
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
import { PhaseType } from "../generated/prisma/client.js";
import prisma from "../libs/prisma.js";
const TX_TIMEOUT_MS = 5 * 60 * 1000; // 56 match + bracket slots có thể mất vài chục giây, đủ margin
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
    const { seasonId, venueIds, seasonTeamIdByTeamId } = await seedSeason(prisma, tournamentId, tournamentRuleId, adminUser.id, teamIdByName);
    // --- Idempotency guard ---
    // Nếu season này đã có phase "final" với match đã có MatchResult, coi như đã
    // seed xong toàn bộ giải — không chạy lại bước 8-13. Đây là lớp bảo vệ thứ 2
    // (lớp thứ 1 là gate RUN_SEED_ON_BOOT ở src/index.ts) để `npm run seed` chạy
    // tay nhiều lần cũng không tạo trùng dữ liệu.
    const existingFinal = await prisma.phase.findFirst({
        where: { season_id: seasonId, type: PhaseType.final },
        include: { matches: { include: { matchResult: true } } },
    });
    if (existingFinal?.matches.some((m) => m.matchResult)) {
        console.log(`[Index] Season #${seasonId} đã có trận chung kết với kết quả — bỏ qua bước 8-13 (group/knockout/stats/payment).`);
        console.log("✅ Seed: không có gì để làm thêm, dữ liệu đã đầy đủ.");
        return;
    }
    // 8-10. [TRANSACTION #1] Group phase + Group matches + Knockout bracket
    const { groupMatches, knockoutMatches, championTeamId } = await prisma.$transaction(async (tx) => {
        const { groupStagePhaseId, groupIdByLetter } = await seedGroupStage(tx, seasonId, teamIdByName, seasonTeamIdByTeamId);
        const { topTwoByGroup, createdMatches: groupMatches } = await seedGroupMatchesAndStandings(tx, groupStagePhaseId, groupIdByLetter, teamIdByName, seasonId, venueIds);
        const { championTeamId, allMatches: knockoutMatches } = await seedKnockoutBracket(tx, seasonId, topTwoByGroup, venueIds);
        return { groupMatches, knockoutMatches, championTeamId };
    }, { timeout: TX_TIMEOUT_MS });
    console.log(`[Index] Transaction #1 xong: ${groupMatches.length} trận vòng bảng + ${knockoutMatches.length} trận knockout`);
    // 11-12. [TRANSACTION #2] MatchDetail cho toàn bộ trận + PlayerStatistic
    const allMatches = [...groupMatches, ...knockoutMatches];
    await prisma.$transaction(async (tx) => {
        let detailCount = 0;
        for (const m of allMatches) {
            const homeSeasonTeamId = seasonTeamIdByTeamId[m.homeTeamId];
            const awaySeasonTeamId = seasonTeamIdByTeamId[m.awayTeamId];
            if (homeSeasonTeamId === undefined || awaySeasonTeamId === undefined) {
                console.warn(`[Index] Bỏ qua matchDetail cho match #${m.matchId}: thiếu seasonTeamId`);
                continue;
            }
            await seedMatchDetails(tx, {
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
        await seedPlayerStatistics(tx, seasonId);
    }, { timeout: TX_TIMEOUT_MS });
    // 13. Payment — idempotent qua findFirst-guard trong paymentSeeder, không cần transaction
    await seedPayments(prisma, seasonTeamIdByTeamId);
    console.log(`\n✅ Seed hoàn tất! Vô địch: team #${championTeamId}`);
}
// Cho phép chạy trực tiếp: npx tsx prisma/seed/index.ts
seedDatabase()
    .catch((err) => {
    console.error("[Seed] Lỗi:", err);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=index.js.map