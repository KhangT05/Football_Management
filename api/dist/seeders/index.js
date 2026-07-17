// prisma/seed/index.ts
//
// Orchestrator chính. Thứ tự gọi seeder tuân theo dependency graph thật của
// schema (không phải thứ tự file được viết ra) — vi phạm thứ tự này sẽ crash
// ngay (các seeder đều throw sớm khi thiếu input thay vì silently skip).
//
// QUAN TRỌNG: KHÔNG gọi `tournamentRuleSeeder.seedTournamentRule` trong file
// này. `seedTournament` (tournamentSeeder.ts) đã tạo rule với is_active=true
// và `seedSeasonConfigurable` (seasonSeeder.ts) đã nhận tournamentRuleId để
// gán thẳng vào season khi tạo — gọi thêm seedTournamentRule sẽ tạo rule
// generic 3-1-0 và ghi đè rule đúng theo từng giải (xem comment trong
// tournamentRuleSeeder.ts).
import { SeasonTeamStatus } from "../generated/prisma/client.js";
import { TOURNAMENTS, seasonStatusOf } from "./config.js";
import { seedRoles } from "./roleSeeder.js";
import { seedUsers } from "./userSeeder.js";
import { seedClasses } from "./classSeeder.js";
import { seedTournament } from "./tournamentSeeder.js";
import { generateTeamNamesFromOffset, generateVenues, generateGroups, generateRoundOf16Template, generateCrossPairingForTwoGroups, } from "./teamGenerator.js";
import { seedTeams, seedTeamLeadersFromExistingUsers } from "./teamSeeder.js";
import { seedPlayersFromExistingUsers } from "./playerSeeder.js";
import { seedSquads } from "./squadSeeder.js";
import { seedSeasonConfigurable } from "./seasonSeeder.js";
import { seedPartialRegistrations } from "./registrationSeeder.js";
import { seedGroupStage } from "./groupPhaseSeeder.js";
import { seedGroupMatchesAndStandings } from "./groupMatchSeeder.js";
import { seedMessyGroupStageMatches, seedMatchDetailsForMessyMatches } from "./messySeasonSeeder.js";
import { seedMatchDetails } from "./matchDetailSeeder.js";
import { seedKnockoutBracket } from "./knockoutSeeder.js";
import { seedPayments, FULL_SPREAD_WEIGHTS } from "./paymentSeeder.js";
import { seedPlayerStatistics } from "./playerStatisticSeeder.js";
import { applySuspensionsAndFines } from "./suspensionSeeder.js";
import { seedOrphanLeaders, seedFreeAgentPlayers, seedOrphanTeam, seedIncompleteApprovalStates } from "./edgeCaseUserSeeder.js";
import prisma from "../libs/prisma.js";
const REGISTRATION_FEE = 5_000_000;
/**
 * Kế hoạch đăng ký cho các archetype KHÔNG có group/phase
 * (registration_open / upcoming / cancelled). Tổng count phải == teamCount
 * của season đó, và availableTeamIds phải cắt từ đúng đầu pool team của
 * tournament (assumption: pool team theo tournamentDef.teamPoolSize luôn đủ
 * lớn hơn hoặc bằng teamCount của mọi season — đã đúng theo config.ts hiện
 * tại, nhưng KHÔNG có runtime check enforce invariant này ở seedTeams/
 * generateTeamNamesFromOffset; nếu sau này thêm season lớn hơn teamPoolSize
 * mà quên bump, seedPartialRegistrations sẽ warn "hết đội khả dụng" và dừng
 * sớm — không silent-fail).
 */
function buildRegistrationPlan(archetype, teamCount) {
    switch (archetype) {
        case "registration_open":
            // Giải đang mở đăng ký: phần lớn còn pending duyệt, 1 số đã approved sớm.
            return [
                { status: SeasonTeamStatus.approved, count: Math.round(teamCount * 0.3) },
                { status: SeasonTeamStatus.pending, count: teamCount - Math.round(teamCount * 0.3) },
            ];
        case "upcoming":
            // Chưa mở đăng ký chính thức — chỉ có vài đội đăng ký sớm (pending),
            // chưa ai được duyệt.
            return [{ status: SeasonTeamStatus.pending, count: teamCount }];
        case "cancelled":
            // Giải bị huỷ giữa chừng quá trình đăng ký: 1 phần đã approved rồi phải
            // rút lui (withdrawn), 1 phần còn pending khi huỷ.
            return [
                { status: SeasonTeamStatus.withdrawn, count: Math.round(teamCount * 0.4) },
                { status: SeasonTeamStatus.pending, count: teamCount - Math.round(teamCount * 0.4) },
            ];
        default:
            throw new Error(`buildRegistrationPlan: archetype "${archetype}" không thuộc nhóm registration-only`);
    }
}
function groupLettersToBracketTemplate(letters) {
    if (letters.length === 2) {
        return generateCrossPairingForTwoGroups(letters);
    }
    return generateRoundOf16Template(letters);
}
/** Mùa "finished"/"ongoing": season đăng ký đủ toàn bộ đội, có group + phase thật. */
async function seedFullSeason(tournament, season, tournamentId, tournamentRuleId, organizerUserId, teamNamesForSeason, teamIdByName) {
    const seasonName = `${tournament.name} - Mùa ${season.key}`;
    const venues = generateVenues(8 + (season.groupCount >= 8 ? 2 : 0));
    const status = seasonStatusOf(season.archetype);
    const seasonTeamIdByNameSubset = {};
    for (const name of teamNamesForSeason) {
        const id = teamIdByName[name];
        if (id === undefined)
            throw new Error(`seedFullSeason: thiếu team_id cho "${name}"`);
        seasonTeamIdByNameSubset[name] = id;
    }
    const seasonConfig = {
        name: seasonName,
        tournamentId,
        tournamentRuleId,
        organizerUserId,
        maxTeams: season.teamCount,
        groupCount: season.groupCount,
        status,
        isRegistrationOpen: false,
        registrationFee: REGISTRATION_FEE,
        registerAllTeams: true,
    };
    const { seasonId, venueIds, seasonTeamIdByTeamId } = await seedSeasonConfigurable(prisma, seasonConfig, seasonTeamIdByNameSubset, venues);
    const groups = generateGroups(teamNamesForSeason, season.groupCount);
    const { groupStagePhaseId, groupIdByLetter } = await seedGroupStage(prisma, seasonId, seasonTeamIdByNameSubset, seasonTeamIdByTeamId, groups);
    const rulePoints = {
        win: tournament.ruleOverrides.points_per_win ?? 3,
        draw: tournament.ruleOverrides.points_per_draw ?? 1,
        loss: tournament.ruleOverrides.points_per_loss ?? 0,
    };
    const forfeitScore = tournament.ruleOverrides.forfeit_score ?? 3;
    if (season.archetype === "finished") {
        const { topTwoByGroup, createdMatches } = await seedGroupMatchesAndStandings(prisma, groupStagePhaseId, groupIdByLetter, seasonTeamIdByNameSubset, seasonId, venueIds, groups, rulePoints);
        for (const m of createdMatches) {
            const homeSeasonTeamId = seasonTeamIdByTeamId[m.homeTeamId];
            const awaySeasonTeamId = seasonTeamIdByTeamId[m.awayTeamId];
            if (homeSeasonTeamId === undefined || awaySeasonTeamId === undefined)
                continue;
            await seedMatchDetails(prisma, {
                matchId: m.matchId,
                homeTeamId: m.homeTeamId,
                awayTeamId: m.awayTeamId,
                homeScore: m.homeScore,
                awayScore: m.awayScore,
                homeSeasonTeamId,
                awaySeasonTeamId,
            });
        }
        const letters = Object.keys(groupIdByLetter);
        const bracketTemplate = groupLettersToBracketTemplate(letters);
        await seedKnockoutBracket(prisma, seasonId, topTwoByGroup, venueIds, bracketTemplate);
        await seedPayments(prisma, seasonTeamIdByTeamId, undefined, seasonConfig.registrationFee);
    }
    else {
        // ongoing — "messy": bức tranh giải đang chạy dở, rải đủ flavor trạng thái.
        const { createdMatches } = await seedMessyGroupStageMatches(prisma, groupStagePhaseId, groupIdByLetter, seasonTeamIdByNameSubset, seasonId, venueIds, groups, rulePoints, forfeitScore);
        await seedMatchDetailsForMessyMatches(prisma, createdMatches, seasonTeamIdByTeamId);
        // Giải đang chạy: payment rải đều đủ 5 trạng thái (confirmed/pending/
        // rejected/refund_pending/refunded), thay vì phân phối "sạch" 85/10/5
        // mặc định (chỉ phù hợp mùa đã finished, mọi khoản thu đã ổn định).
        await seedPayments(prisma, seasonTeamIdByTeamId, FULL_SPREAD_WEIGHTS, seasonConfig.registrationFee);
    }
    await seedPlayerStatistics(prisma, seasonId);
    await applySuspensionsAndFines(prisma, seasonId, {
        yellowCardsSuspension: tournament.ruleOverrides.yellow_cards_suspension ?? 2,
        suspensionMatchCount: tournament.ruleOverrides.suspension_match_count ?? 1,
        finePerYellowCard: tournament.ruleOverrides.fine_per_yellow_card ?? 0,
        finePerRedCard: tournament.ruleOverrides.fine_per_red_card ?? 0,
    });
    console.log(`[Index] Season "${seasonName}" (#${seasonId}, ${season.archetype}) xong.`);
}
/** Mùa "registration_open"/"upcoming"/"cancelled": KHÔNG có group/phase, chỉ mô phỏng luồng đăng ký dở dang. */
async function seedRegistrationOnlySeason(tournament, season, tournamentId, tournamentRuleId, organizerUserId, teamNamesForSeason, teamIdByName) {
    const seasonName = `${tournament.name} - Mùa ${season.key}`;
    const venues = generateVenues(8);
    const status = seasonStatusOf(season.archetype);
    const availableTeamIds = teamNamesForSeason.map((name) => {
        const id = teamIdByName[name];
        if (id === undefined)
            throw new Error(`seedRegistrationOnlySeason: thiếu team_id cho "${name}"`);
        return id;
    });
    const seasonConfig = {
        name: seasonName,
        tournamentId,
        tournamentRuleId,
        organizerUserId,
        maxTeams: season.teamCount,
        groupCount: season.groupCount,
        status,
        isRegistrationOpen: season.archetype === "registration_open",
        registrationFee: REGISTRATION_FEE,
        cancelReason: season.archetype === "cancelled" ? "Không đủ số đội tối thiểu tham dự trước hạn chót đăng ký." : null,
        registerAllTeams: false, // KHÔNG dùng seedSeasonConfigurable để đăng ký — dùng registrationSeeder ở dưới
    };
    const { seasonId, seasonTeamIdByTeamId: emptyMap } = await seedSeasonConfigurable(prisma, seasonConfig, {}, // registerAllTeams=false nên map team không dùng tới ở bước này
    venues);
    void emptyMap;
    const plan = buildRegistrationPlan(season.archetype, season.teamCount);
    const { seasonTeamIdByTeamId } = await seedPartialRegistrations(prisma, seasonId, availableTeamIds, plan);
    await seedPayments(prisma, seasonTeamIdByTeamId, FULL_SPREAD_WEIGHTS, seasonConfig.registrationFee);
    console.log(`[Index] Season "${seasonName}" (#${seasonId}, ${season.archetype}) xong — chỉ có đăng ký, chưa có group/phase.`);
}
export async function main() {
    console.log("[Index] === Bắt đầu seed ===");
    const roleMap = await seedRoles(prisma);
    await seedUsers(prisma, roleMap);
    const { classIdByName } = await seedClasses(prisma);
    const adminUser = await prisma.user.findUniqueOrThrow({
        where: { email: "admin@gmail.com" },
        select: { id: true },
    });
    const organizerUserId = adminUser.id;
    // Chạy 1 lần, dùng chung cho toàn bộ tournament — hàm quét TOÀN BỘ user có
    // role player trong prisma, không phải theo tournament.
    const realPlayerIdByEmail = await seedPlayersFromExistingUsers(prisma, classIdByName);
    const realPlayerIds = Object.values(realPlayerIdByEmail);
    for (const tournament of TOURNAMENTS) {
        console.log(`[Index] --- Tournament "${tournament.name}" (${tournament.key}) ---`);
        const { tournamentId, tournamentRuleId } = await seedTournament(prisma, organizerUserId, {
            name: tournament.name,
            description: tournament.description,
            ruleName: `${tournament.name} Rule`,
            ruleOverrides: tournament.ruleOverrides,
        });
        const teamNames = generateTeamNamesFromOffset(tournament.teamPoolSize, tournament.teamPoolOffset);
        const { teamIdByName } = await seedTeams(prisma, organizerUserId, teamNames, classIdByName);
        await seedTeamLeadersFromExistingUsers(prisma, teamIdByName);
        // Squad đầy đủ cho CẢ pool đội của tournament (Team là entity dùng
        // chung qua nhiều season/mùa) — chỉ cần seed 1 lần trước khi vào loop
        // season; idempotent qua teamPlayer.count nên season sau tái sử dụng
        // đúng squad đã seed, không tạo trùng.
        await seedSquads(prisma, teamIdByName, realPlayerIds, 23);
        for (const season of tournament.seasons) {
            // Mỗi mùa lấy N đội đầu tiên trong pool của tournament — deterministic
            // theo thứ tự generateTeamNamesFromOffset trả về, không random, để
            // idempotent giữa các lần seed lại.
            const teamNamesForSeason = teamNames.slice(0, season.teamCount);
            if (season.archetype === "finished" || season.archetype === "ongoing") {
                await seedFullSeason(tournament, season, tournamentId, tournamentRuleId, organizerUserId, teamNamesForSeason, teamIdByName);
            }
            else {
                await seedRegistrationOnlySeason(tournament, season, tournamentId, tournamentRuleId, organizerUserId, teamNamesForSeason, teamIdByName);
            }
        }
    }
    // Edge-case data ở mức User/Team — độc lập với tournament cụ thể nào,
    // chạy 1 lần cuối cùng sau khi mọi season/team "hợp lệ" đã có sẵn.
    await seedOrphanLeaders(prisma, roleMap, 3);
    const freeAgentPlayerIds = await seedFreeAgentPlayers(prisma, roleMap, 5);
    void freeAgentPlayerIds; // cố ý không gán vào team nào — đúng mục đích "cầu thủ tự do"
    const orphanTeamId = await seedOrphanTeam(prisma, organizerUserId, "CLB Chờ Đăng Ký", 8, classIdByName);
    await seedIncompleteApprovalStates(prisma, orphanTeamId);
    console.log("[Index] === Seed hoàn tất ===");
}
//# sourceMappingURL=index.js.map