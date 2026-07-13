// prisma/seed/index.ts
//
// Chạy: npm run seed  (script riêng — KHÔNG được gọi từ app bootstrap, xem src/index.ts)
//
// ===== THỨ TỰ SEED =====
// 1. Role
// 2. User
// 3. Player  <- User(role=player)
// 4. Team + TeamLeader <- User(role=leader)   (teamNames sinh procedural, xem teamGenerator.ts)
// 5. Squad (23 người/đội — BẮT BUỘC xong trước bước 11, matchDetailSeeder cần >=11 để tạo lineup)
// 6. Tournament + TournamentRule
// 7. Venue + Season + SeasonTeam + SeasonTeamJersey
// --- Idempotency check: 2 điều kiện TÁCH BIỆT cho TX#1 và TX#2 (xem FIX bên dưới) ---
// 8-10. [TRANSACTION #1] Phase(group_stage)+Group(A-H) -> Match vòng bảng+TeamStanding -> Knockout(R16..Final)
// 11-12. [TRANSACTION #2, CHIA BATCH] MatchDetail (Lineup+Jersey+Event) cho toàn bộ match -> PlayerStatistic
// 13. Payment cho từng SeasonTeam
//
// Vì sao tách 2 transaction thay vì 1: bước 1-7 dùng toàn upsert nên tự idempotent,
// không cần transaction. Bước 8-10 phụ thuộc chuỗi nhau chặt (group phải xong mới có
// topTwoByGroup cho knockout) và tạo record KHÔNG unique-constraint-đủ (Match.leg
// trước đây nullable khiến duplicate lọt qua DB, Group không có unique DB-level) —
// nếu crash giữa chừng mà không có transaction, lần seed sau sẽ đọc state nửa vời
// và tạo lặp (đây là nguyên nhân matches=0/groups=15/tournaments=3 quan sát được).
// Transaction đảm bảo: hoặc toàn bộ vòng bảng+knockout được tạo, hoặc không gì cả.
//
// FIX (bug: "seed báo hoàn tất nhưng match không có lineup"):
// Bản trước dùng ĐÚNG 1 điều kiện duy nhất (final phase có matchResult — tức
// bằng chứng của riêng TX#1) để quyết định bỏ qua CẢ TX#1 lẫn TX#2. Nhưng TX#2
// (matchDetail — bọc ~56 trận × hàng chục round-trip/trận trong 1 transaction
// với timeout cố định 5 phút) rất dễ fail/timeout độc lập với TX#1. Khi đó
// TX#1 đã commit xong (final match đã có matchResult) nhưng TX#2 rollback
// sạch 100% (Prisma $transaction all-or-nothing) — không lineup nào tồn tại.
// Lần seed sau, guard cũ thấy "final có result" = true -> return ngay lập
// tức, KHÔNG BAO GIỜ thử lại TX#2 nữa, ở bất kỳ lần chạy nào sau đó — lineup
// kẹt vĩnh viễn ở trạng thái rỗng dù seed luôn báo "hoàn tất".
//
// Sửa: tách `groupKnockoutDone` (bằng chứng TX#1) và việc quyết định chạy
// lại TX#2 thành 2 điều kiện ĐỘC LẬP — điều kiện chạy TX#2 luôn dựa trên
// MatchLineup thực tế trong DB (bằng chứng thật của chính TX#2), không suy
// diễn từ TX#1. Đồng thời chia TX#2 thành các batch nhỏ (8 trận/batch) thay
// vì 1 transaction khổng lồ, để nếu bị ngắt giữa chừng, các batch đã commit
// vẫn giữ nguyên — lần chạy sau chỉ cần xử lý phần còn thiếu.
//
// LƯU Ý thứ tự lineup vs tỉ số: MatchLineup được tạo SAU khi Match.home_score/
// away_score đã tồn tại (TX#1 trước, TX#2 sau). Đây KHÔNG phải bug — MatchLineup
// chỉ phụ thuộc match_id (có từ TX#1) và player_id (có từ squadSeeder ở bước 5,
// chạy trước TX#1 rất xa). Không có FK/business rule nào bắt buộc lineup phải có
// trước tỉ số.
//
// FIX (bug: "standings PTS luôn hiện đúng với default nhưng sai nếu đổi rule"):
// groupMatchSeeder trước đây hardcode +3 (win) / +1 (draw) / +0 (loss) khi tính
// TeamStanding.points, bất kể TournamentRule đang active của season có
// points_per_win/draw/loss khác giá trị mặc định hay không. tournamentRuleId đã
// tồn tại từ bước 6 nhưng KHÔNG được truyền tiếp xuống seedGroupMatchesAndStandings
// — rule bị bỏ quên giữa chừng. Giờ đọc rule ngay sau khi tạo (bước 6) và truyền
// rulePoints xuống TX#1 tường minh, không để groupMatchSeeder tự giả định điểm số.
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
import { PhaseType } from "../generated/prisma/client.js";
import prisma from "../libs/prisma.js";
const TX_TIMEOUT_MS = 5 * 60 * 1000; // margin cho mỗi transaction/batch
const MATCH_DETAIL_BATCH_SIZE = 8; // số trận xử lý lineup/event trong 1 transaction
export async function seedDatabase() {
    console.log("🌱 Bắt đầu seed World Cup demo...\n");
    // Sinh data procedural — thay import worldcup.ts (đã xoá)
    const teamNames = generateTeamNames();
    const groups = generateGroups(teamNames);
    const roundOf16Template = generateRoundOf16Template(GROUP_LETTERS);
    const venues = generateVenues();
    // 1-2. Role + User
    const roleMap = await seedRoles(prisma);
    await seedUsers(prisma, roleMap);
    const adminUser = await prisma.user.findUniqueOrThrow({ where: { email: "admin@gmail.com" } });
    // 3. Player <- User(role=player)
    const linkedPlayerIds = await seedPlayersFromExistingUsers(prisma);
    // 4. Team + TeamLeader
    const { teamIdByName } = await seedTeams(prisma, adminUser.id, teamNames);
    await seedTeamLeadersFromExistingUsers(prisma, teamIdByName);
    // 5. Squad — PHẢI xong ở đây, trước TX#1/TX#2. matchDetailSeeder cần >=11
    // cầu thủ/đội để tạo lineup; nếu bước này fail âm thầm thì lineup sẽ bị skip
    // (xem cảnh báo log "squad chưa đủ 11" trong matchDetailSeeder).
    const unassignedRealPlayerIds = Object.values(linkedPlayerIds);
    await seedSquads(prisma, teamIdByName, unassignedRealPlayerIds);
    // Verify ngay: đảm bảo mọi team đều đủ 23 người trước khi đi tiếp. Fail loud
    // ở đây rẻ hơn nhiều so với để matchDetailSeeder skip từng trận một cách im lặng.
    const squadCounts = await prisma.teamPlayer.groupBy({
        by: ["team_id"],
        _count: { team_id: true },
        where: { team_id: { in: Object.values(teamIdByName) } },
    });
    const countByTeamId = new Map(squadCounts.map((s) => [s.team_id, s._count.team_id]));
    const understaffed = Object.entries(teamIdByName).filter(([, teamId]) => (countByTeamId.get(teamId) ?? 0) < 11);
    if (understaffed.length > 0) {
        throw new Error(`[Index] ${understaffed.length} đội chưa đủ 11 cầu thủ sau seedSquads: ` +
            understaffed.map(([name, id]) => `${name}(#${id})=${countByTeamId.get(id) ?? 0}`).join(", ") +
            ` — dừng seed trước khi tạo match, không để lineup bị skip âm thầm ở bước 11.`);
    }
    console.log(`[Index] Verify squad: ${Object.keys(teamIdByName).length}/${Object.keys(teamIdByName).length} đội đủ >=11 cầu thủ`);
    // 6. Tournament + TournamentRule
    const { tournamentId, tournamentRuleId } = await seedWorldCupTournament(prisma, adminUser.id);
    // NEW: đọc rule ngay sau khi tạo — rulePoints (win/draw/loss) phải được
    // truyền tường minh xuống TX#1 (seedGroupMatchesAndStandings), không để
    // groupMatchSeeder tự hardcode +3/+1/+0. Season dùng rule custom (vd. giải
    // nội bộ tính 2 điểm/thắng) mà không có bước này thì TeamStanding sai ngay
    // lúc seed, và vì Group.status set sẵn "in_progress" (xem groupPhaseSeeder)
    // nên FE hiển thị standings như đã chốt — sai mà trông như đúng.
    const tournamentRule = await prisma.tournamentRule.findUniqueOrThrow({ where: { id: tournamentRuleId } });
    const rulePoints = {
        win: tournamentRule.points_per_win,
        draw: tournamentRule.points_per_draw,
        loss: tournamentRule.points_per_loss,
    };
    // 7. Venue + Season + SeasonTeam + SeasonTeamJersey
    const { seasonId, venueIds, seasonTeamIdByTeamId } = await seedSeason(prisma, tournamentId, tournamentRuleId, adminUser.id, teamIdByName, venues);
    // ═══════════════════════════════════════════════════════════════════════
    // Idempotency guard — TÁCH RIÊNG bằng chứng của TX#1 và TX#2 (xem FIX ở
    // đầu file). groupKnockoutDone chỉ quyết định có seed lại TX#1 hay không;
    // việc chạy lại TX#2 luôn được quyết định độc lập, dựa trên MatchLineup
    // thực tế bên dưới — KHÔNG dùng chung 1 flag như bản cũ.
    // ═══════════════════════════════════════════════════════════════════════
    const existingFinal = await prisma.phase.findFirst({
        where: { season_id: seasonId, type: PhaseType.final },
        include: { matches: { include: { matchResult: true } } },
    });
    const groupKnockoutDone = existingFinal?.matches.some((m) => m.matchResult) ?? false;
    let allMatches;
    let championTeamId;
    if (groupKnockoutDone) {
        console.log(`[Index] Season #${seasonId} đã có group+knockout (TX#1) — tái sử dụng, không seed lại.`);
        // Nạp lại toàn bộ match đã có tỉ số của season từ DB — TX#2 phía dưới
        // cần danh sách này bất kể TX#1 có chạy ở lần seed này hay không.
        const allDbMatches = await prisma.match.findMany({
            where: {
                phase: { season_id: seasonId },
                home_score: { not: null },
                away_score: { not: null },
            },
            select: { id: true, home_team_id: true, away_team_id: true, home_score: true, away_score: true },
        });
        allMatches = allDbMatches.map((m) => ({
            matchId: m.id,
            homeTeamId: m.home_team_id,
            awayTeamId: m.away_team_id,
            homeScore: m.home_score,
            awayScore: m.away_score,
        }));
        const finalMatch = existingFinal.matches.find((m) => m.matchResult);
        if (!finalMatch?.matchResult?.winner_team_id) {
            throw new Error(`[Index] Season #${seasonId}: final match có result nhưng thiếu winner_team_id — ` +
                `data hỏng, cần migrate reset rồi seed lại từ đầu.`);
        }
        championTeamId = finalMatch.matchResult.winner_team_id;
        // LƯU Ý: nhánh này KHÔNG recompute lại TeamStanding.points theo rulePoints
        // mới nhất — TX#1 đã commit xong ở lần chạy trước với rule tại THỜI ĐIỂM
        // đó. Nếu rule bị đổi sau khi TX#1 đã chạy, standings cũ vẫn giữ điểm số
        // theo rule cũ (đúng theo lịch sử, nhưng có thể gây nhầm nếu người xem kỳ
        // vọng standings phản ánh rule hiện tại). Đây là trade-off chấp nhận được
        // cho seed script — không phải bug, nhưng cần biết nếu debug tiếp.
    }
    else {
        // 8-10. [TRANSACTION #1] Group phase + Group matches + Knockout bracket
        const tx1Result = await prisma.$transaction(async (tx) => {
            const { groupStagePhaseId, groupIdByLetter } = await seedGroupStage(tx, seasonId, teamIdByName, seasonTeamIdByTeamId, groups);
            const { topTwoByGroup, createdMatches: groupMatches } = await seedGroupMatchesAndStandings(tx, groupStagePhaseId, groupIdByLetter, teamIdByName, seasonId, venueIds, groups, rulePoints // NEW — thay hardcode +3/+1/+0 trong groupMatchSeeder
            );
            const { championTeamId, allMatches: knockoutMatches } = await seedKnockoutBracket(tx, seasonId, topTwoByGroup, venueIds, roundOf16Template);
            return {
                allMatches: [...groupMatches, ...knockoutMatches],
                championTeamId,
            };
        }, { timeout: TX_TIMEOUT_MS });
        allMatches = tx1Result.allMatches;
        championTeamId = tx1Result.championTeamId;
        console.log(`[Index] Transaction #1 xong: ${allMatches.length} trận (vòng bảng + knockout)`);
    }
    // ═══════════════════════════════════════════════════════════════════════
    // 11-12. [TRANSACTION #2, CHIA BATCH] MatchDetail cho toàn bộ trận cần
    // xử lý + PlayerStatistic. Luôn kiểm tra bằng chứng thật (MatchLineup),
    // không phụ thuộc groupKnockoutDone.
    // ═══════════════════════════════════════════════════════════════════════
    const matchIdsCreated = allMatches.map((m) => m.matchId);
    const existingLineupMatchIds = await prisma.matchLineup.findMany({
        where: { match_id: { in: matchIdsCreated } },
        select: { match_id: true },
        distinct: ["match_id"],
    });
    const doneSet = new Set(existingLineupMatchIds.map((l) => l.match_id));
    const matchesNeedingDetail = allMatches.filter((m) => !doneSet.has(m.matchId));
    if (matchesNeedingDetail.length === 0) {
        console.log(`[Index] Tất cả ${allMatches.length} trận đã có lineup — bỏ qua TX#2.`);
    }
    else {
        console.log(`[Index] ${matchesNeedingDetail.length}/${allMatches.length} trận CHƯA có lineup ` +
            `(${doneSet.size} trận đã có từ trước) — chạy TX#2 theo batch cho phần còn thiếu.`);
        let detailCount = 0;
        let skippedNoSeasonTeam = 0;
        // FIX (giảm rủi ro timeout/lock contention làm mất TOÀN BỘ tiến độ):
        // trước đây 1 transaction DUY NHẤT bọc mọi trận — nếu fail giữa
        // chừng, rollback sạch 100%, lần sau phải làm lại từ đầu (và do bug
        // guard ở trên, thực tế còn không được thử lại). Giờ chia batch nhỏ,
        // mỗi batch commit độc lập; nếu 1 batch fail, các batch trước đó vẫn
        // giữ nguyên, và matches trong các batch đã xong sẽ tự bị loại khỏi
        // matchesNeedingDetail ở lần chạy kế tiếp nhờ check `doneSet` ở trên.
        for (let i = 0; i < matchesNeedingDetail.length; i += MATCH_DETAIL_BATCH_SIZE) {
            const batch = matchesNeedingDetail.slice(i, i + MATCH_DETAIL_BATCH_SIZE);
            await prisma.$transaction(async (tx) => {
                for (const m of batch) {
                    const homeSeasonTeamId = seasonTeamIdByTeamId[m.homeTeamId];
                    const awaySeasonTeamId = seasonTeamIdByTeamId[m.awayTeamId];
                    if (homeSeasonTeamId === undefined || awaySeasonTeamId === undefined) {
                        console.warn(`[Index] Bỏ qua matchDetail cho match #${m.matchId}: thiếu seasonTeamId`);
                        skippedNoSeasonTeam++;
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
            }, { timeout: TX_TIMEOUT_MS });
            console.log(`[Index] Batch ${Math.floor(i / MATCH_DETAIL_BATCH_SIZE) + 1}/` +
                `${Math.ceil(matchesNeedingDetail.length / MATCH_DETAIL_BATCH_SIZE)} xong ` +
                `(${Math.min(i + MATCH_DETAIL_BATCH_SIZE, matchesNeedingDetail.length)}/${matchesNeedingDetail.length} trận)`);
        }
        console.log(`[Index] MatchDetail xong cho ${detailCount}/${matchesNeedingDetail.length} trận cần xử lý`);
        // PlayerStatistic recompute-from-scratch — chạy SAU khi mọi batch
        // lineup/event đã commit xong, tách transaction riêng.
        await prisma.$transaction(async (tx) => {
            await seedPlayerStatistics(tx, seasonId);
        }, { timeout: TX_TIMEOUT_MS });
        if (skippedNoSeasonTeam > 0) {
            console.warn(`[Index] ⚠️ ${skippedNoSeasonTeam} trận bị skip hoàn toàn (không có matchDetail/lineup) do thiếu seasonTeamId.`);
        }
    }
    // Verify lineup thực sự tồn tại sau TX#2 — fail loud thay vì im lặng nếu
    // matchDetailSeeder skip do squad thiếu (không nên xảy ra vì đã verify ở
    // bước 5, nhưng giữ lại như một safety net cho race condition/data drift).
    const lineupCount = await prisma.matchLineup.count({ where: { match_id: { in: matchIdsCreated } } });
    const matchesWithLineup = await prisma.matchLineup.findMany({
        where: { match_id: { in: matchIdsCreated } },
        select: { match_id: true },
        distinct: ["match_id"],
    });
    const matchesMissingLineup = matchIdsCreated.length - matchesWithLineup.length;
    console.log(`[Index] Verify lineup: ${lineupCount} lineup rows, ${matchesWithLineup.length}/${matchIdsCreated.length} trận có lineup`);
    if (matchesMissingLineup > 0) {
        console.warn(`[Index] ⚠️ ${matchesMissingLineup} trận KHÔNG có lineup dù đã có tỉ số. ` +
            `Kiểm tra log "squad chưa đủ 11" ở bước MatchDetail phía trên để xác định team nào bị thiếu.`);
    }
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