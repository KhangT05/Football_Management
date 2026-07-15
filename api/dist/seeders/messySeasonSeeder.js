// prisma/seed/messySeasonSeeder.ts
//
// NEW FILE — dành riêng cho mùa giải archetype "ongoing" (đang đá dở).
// Khác với groupMatchSeeder.ts (LUÔN kết thúc đủ 6 trận/bảng với status
// finished), file này cố ý tạo ra bức tranh "thật" của 1 giải đang chạy:
// một số trận đã xong, một số chưa đá, một số bị hoãn/hủy/bỏ dở, một số
// đang chờ trọng tài xác nhận kết quả chính thức — đúng những gì
// MatchStatus/MatchResultStatus/GroupStatus của schema định nghĩa nhưng
// pipeline gốc (World Cup demo) chưa bao giờ dùng tới.
//
// Đồng thời cố ý để 1 vài Group ở trạng thái DRAFT (chưa từng sinh lịch)
// hoặc SCHEDULE_FAILED (sinh lịch thất bại) — không có match nào — để tái
// hiện đúng bug "Bảng X: Trống" đã được ghi chú trong groupPhaseSeeder.ts.
import { MatchStatus, MatchResultType, MatchResultStatus, MatchPeriod, GroupStatus, PhaseStatus, } from "../generated/prisma/client.js";
import { pickOrThrow, randInt, simulateGroupMatch } from "./helperSeeder.js";
import { seedMatchDetails } from "./matchDetailSeeder.js";
const ROUND_ROBIN_PAIRS = [
    [0, 1],
    [2, 3],
    [0, 2],
    [1, 3],
    [0, 3],
    [1, 2],
];
const FLAVORS = [
    "finished_official",
    "finished_protested",
    "finished_under_review",
    "scheduled_future",
    "postponed",
    "forfeited",
    "ongoing_live",
    "abandoned",
    "pending_official",
    "needs_review",
    "cancelled",
];
// Flavor nào tính vào bảng xếp hạng (đã có tỉ số CHÍNH THỨC, đáng tin để cộng dồn).
const COUNTS_TOWARD_STANDINGS = new Set([
    "finished_official",
    "finished_protested",
    "finished_under_review",
    "forfeited",
    "abandoned", // có tỉ số tại thời điểm bỏ dở, vẫn được tính (như bóng đá thật)
]);
async function createFlavorMatch(db, flavor, phaseId, groupId, homeTeamId, awayTeamId, venueId, dayOffset, forfeitScore, round) {
    const now = Date.now();
    const future = new Date(now + (dayOffset + 3) * 86400000);
    const past = new Date(now - (14 - dayOffset) * 86400000);
    switch (flavor) {
        case "finished_official":
        case "finished_protested":
        case "finished_under_review": {
            const sim = simulateGroupMatch();
            const match = await db.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    venue_id: venueId,
                    scheduled_at: past,
                    played_at: past,
                    status: MatchStatus.finished,
                    home_score: sim.homeScore,
                    away_score: sim.awayScore,
                    leg: 1,
                    is_active: true,
                    round: String(round),
                    is_published: true,
                },
            });
            const resultStatus = flavor === "finished_protested"
                ? MatchResultStatus.protested
                : flavor === "finished_under_review"
                    ? MatchResultStatus.under_review
                    : MatchResultStatus.official;
            await db.matchResult.create({
                data: {
                    match_id: match.id,
                    winner_team_id: sim.homeScore === sim.awayScore ? null : sim.homeScore > sim.awayScore ? homeTeamId : awayTeamId,
                    home_final_score: sim.homeScore,
                    away_final_score: sim.awayScore,
                    result_type: MatchResultType.full_time,
                    status: resultStatus,
                    appeal_reason: flavor === "finished_protested" ? "Đội khách khiếu nại quyết định thẻ đỏ phút 78 của trọng tài." : null,
                    appeal_note: flavor === "finished_under_review" ? "Ban tổ chức đang xem lại pha bóng gây tranh cãi qua VAR/video." : null,
                },
            });
            return { matchId: match.id, homeScore: sim.homeScore, awayScore: sim.awayScore };
        }
        case "scheduled_future": {
            const match = await db.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    venue_id: venueId,
                    scheduled_at: future,
                    status: MatchStatus.scheduled,
                    leg: 1,
                    is_active: true,
                    round: String(round),
                },
            });
            return { matchId: match.id, homeScore: null, awayScore: null };
        }
        case "postponed": {
            const originalDate = new Date(now + dayOffset * 86400000);
            const match = await db.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    venue_id: venueId,
                    scheduled_at: future, // dời sang ngày mới
                    postponed_from: originalDate,
                    postponed_reason: "Sân đấu bị ngập nước do mưa lớn, phải dời lịch.",
                    status: MatchStatus.postponed,
                    leg: 1,
                    is_active: true,
                    round: String(round),
                },
            });
            return { matchId: match.id, homeScore: null, awayScore: null };
        }
        case "forfeited": {
            // Đội khách bỏ trận (không đủ 7 cầu thủ tối thiểu / không đến sân) — đội nhà thắng theo forfeit_score.
            const match = await db.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    venue_id: venueId,
                    scheduled_at: past,
                    played_at: past,
                    status: MatchStatus.forfeited,
                    home_score: forfeitScore,
                    away_score: 0,
                    leg: 1,
                    is_active: true,
                    round: String(round),
                },
            });
            await db.matchResult.create({
                data: {
                    match_id: match.id,
                    winner_team_id: homeTeamId,
                    home_final_score: forfeitScore,
                    away_final_score: 0,
                    result_type: MatchResultType.forfeit,
                    status: MatchResultStatus.official,
                    notes: "Đội khách không đủ số cầu thủ tối thiểu khi bắt đầu trận — xử thua kỹ thuật.",
                },
            });
            return { matchId: match.id, homeScore: forfeitScore, awayScore: 0 };
        }
        case "ongoing_live": {
            const match = await db.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    venue_id: venueId,
                    scheduled_at: new Date(now - 40 * 60000), // bắt đầu 40 phút trước
                    status: MatchStatus.ongoing,
                    current_period: MatchPeriod.second_half,
                    leg: 1,
                    is_active: true,
                    round: String(round),
                },
            });
            // vài sự kiện đã ghi nhận live, tỉ số CHƯA chốt (home_score/away_score vẫn null
            // cho đến khi trận kết thúc) — time_source=live vì API ghi ngay lúc xảy ra.
            await db.matchEvent.create({
                data: {
                    match_id: match.id,
                    team_id: homeTeamId,
                    type: "goal",
                    minute: randInt(50, 75),
                    period: MatchPeriod.second_half,
                    time_source: "live",
                },
            });
            return { matchId: match.id, homeScore: null, awayScore: null };
        }
        case "abandoned": {
            const sim = simulateGroupMatch();
            const match = await db.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    venue_id: venueId,
                    scheduled_at: past,
                    played_at: past,
                    status: MatchStatus.abandoned,
                    home_score: sim.homeScore,
                    away_score: sim.awayScore,
                    abandoned_minute: randInt(60, 88),
                    abandoned_reason: "Sự cố ánh sáng sân vận động, không thể tiếp tục thi đấu an toàn.",
                    leg: 1,
                    is_active: true,
                    round: String(round),
                },
            });
            // CỐ Ý không tạo MatchResult — trận bị bỏ dở, chưa có kết quả chính thức,
            // chờ ban tổ chức quyết định (đá lại / giữ tỉ số / xử hòa).
            return { matchId: match.id, homeScore: sim.homeScore, awayScore: sim.awayScore };
        }
        case "pending_official": {
            const match = await db.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    venue_id: venueId,
                    scheduled_at: past,
                    played_at: past,
                    status: MatchStatus.pending_official,
                    // tỉ số CHÍNH THỨC (home_score/away_score) chưa set — trọng tài mới
                    // nộp số liệu thô (finalize_*), chờ ban tổ chức xác nhận để chốt.
                    finalize_result_type: MatchResultType.full_time,
                    finalize_home_half_time: randInt(0, 2),
                    finalize_away_half_time: randInt(0, 2),
                    pending_official_at: new Date(now - 2 * 3600000),
                    leg: 1,
                    is_active: true,
                    round: String(round),
                },
            });
            return { matchId: match.id, homeScore: null, awayScore: null };
        }
        case "needs_review": {
            // Có báo cáo tỉ số KHÔNG chính thức (manual_*) nhưng bị flag để xem lại
            // (VD: 2 nguồn báo tỉ số khác nhau) — chưa tính vào standings.
            const match = await db.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    venue_id: venueId,
                    scheduled_at: past,
                    played_at: past,
                    status: MatchStatus.needs_review,
                    manual_home_score: randInt(0, 4),
                    manual_away_score: randInt(0, 4),
                    leg: 1,
                    is_active: true,
                    round: String(round),
                },
            });
            return { matchId: match.id, homeScore: null, awayScore: null };
        }
        case "cancelled": {
            const match = await db.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    venue_id: venueId,
                    scheduled_at: past,
                    status: MatchStatus.cancelled,
                    leg: 1,
                    is_active: true,
                    round: String(round),
                },
            });
            return { matchId: match.id, homeScore: null, awayScore: null };
        }
    }
}
export async function seedMessyGroupStageMatches(db, groupStagePhaseId, groupIdByLetter, teamIdByName, seasonId, venueIds, groups, rulePoints, forfeitScore) {
    const letters = Object.keys(groups);
    const createdMatches = [];
    const scheduledGroupLetters = [];
    const draftGroupLetters = [];
    const scheduleFailedGroupLetters = [];
    // Bảng cuối cùng luôn để DRAFT (chưa sinh lịch — "Trống"); nếu có >=2 bảng,
    // bảng áp chót để SCHEDULE_FAILED (sinh lịch nhưng lỗi — cũng "Trống").
    const draftIdx = letters.length - 1;
    const scheduleFailedIdx = letters.length >= 2 ? letters.length - 2 : -1;
    let globalDayOffset = 0;
    for (let gi = 0; gi < letters.length; gi++) {
        const letter = letters[gi];
        if (!letter)
            continue;
        const groupId = groupIdByLetter[letter];
        if (groupId === undefined)
            throw new Error(`messySeasonSeeder: thiếu group_id cho bảng "${letter}"`);
        if (gi === draftIdx) {
            await db.group.update({ where: { id: groupId }, data: { status: GroupStatus.DRAFT, scheduleGeneratedAt: null } });
            draftGroupLetters.push(letter);
            console.log(`[MessySeasonSeeder] Bảng ${letter}: DRAFT — chưa sinh lịch, không có match nào (mô phỏng "Trống").`);
            continue;
        }
        if (gi === scheduleFailedIdx) {
            await db.group.update({ where: { id: groupId }, data: { status: GroupStatus.SCHEDULE_FAILED, scheduleGeneratedAt: new Date() } });
            scheduleFailedGroupLetters.push(letter);
            console.log(`[MessySeasonSeeder] Bảng ${letter}: SCHEDULE_FAILED — sinh lịch thất bại, không có match nào.`);
            continue;
        }
        const teamNames = groups[letter];
        if (!teamNames)
            throw new Error(`messySeasonSeeder: groups thiếu bảng "${letter}"`);
        const teamIds = teamNames.map((n) => {
            const id = teamIdByName[n];
            if (id === undefined)
                throw new Error(`Không tìm thấy team_id cho đội "${n}" (bảng ${letter})`);
            return id;
        });
        const tally = new Map();
        teamIds.forEach((id) => tally.set(id, { teamId: id, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0 }));
        for (let pairIdx = 0; pairIdx < ROUND_ROBIN_PAIRS.length; pairIdx++) {
            const pair = ROUND_ROBIN_PAIRS[pairIdx];
            if (!pair)
                continue;
            const [i, j] = pair;
            const homeTeamId = teamIds[i];
            const awayTeamId = teamIds[j];
            if (homeTeamId === undefined || awayTeamId === undefined)
                continue;
            const flavor = FLAVORS[(gi * ROUND_ROBIN_PAIRS.length + pairIdx) % FLAVORS.length];
            if (!flavor)
                continue;
            const { matchId, homeScore, awayScore } = await createFlavorMatch(db, flavor, groupStagePhaseId, groupId, homeTeamId, awayTeamId, pickOrThrow(venueIds, "messySeasonSeeder venueIds"), globalDayOffset, forfeitScore, pairIdx + 1);
            globalDayOffset++;
            if (COUNTS_TOWARD_STANDINGS.has(flavor) && homeScore !== null && awayScore !== null) {
                createdMatches.push({ matchId, homeTeamId, awayTeamId, homeScore, awayScore });
                const homeTally = tally.get(homeTeamId);
                const awayTally = tally.get(awayTeamId);
                homeTally.played++;
                awayTally.played++;
                homeTally.gf += homeScore;
                homeTally.ga += awayScore;
                awayTally.gf += awayScore;
                awayTally.ga += homeScore;
                if (homeScore > awayScore) {
                    homeTally.wins++;
                    homeTally.points += rulePoints.win;
                    awayTally.losses++;
                    awayTally.points += rulePoints.loss;
                }
                else if (homeScore < awayScore) {
                    awayTally.wins++;
                    awayTally.points += rulePoints.win;
                    homeTally.losses++;
                    homeTally.points += rulePoints.loss;
                }
                else {
                    homeTally.draws++;
                    awayTally.draws++;
                    homeTally.points += rulePoints.draw;
                    awayTally.points += rulePoints.draw;
                }
            }
        }
        // Standings CHỈ phản ánh những trận đã có tỉ số chính thức — đúng thực tế 1 mùa
        // giải đang chạy dở, KHÔNG phải mọi đội đã đá đủ 6 trận.
        const sorted = Array.from(tally.values()).sort((a, b) => {
            if (b.points !== a.points)
                return b.points - a.points;
            const gdA = a.gf - a.ga;
            const gdB = b.gf - b.ga;
            if (gdB !== gdA)
                return gdB - gdA;
            return b.gf - a.gf;
        });
        for (let pos = 0; pos < sorted.length; pos++) {
            const t = sorted[pos];
            if (!t)
                continue;
            await db.teamStanding.upsert({
                where: { group_id_team_id: { group_id: groupId, team_id: t.teamId } },
                update: {
                    position: pos + 1,
                    matches_played: t.played,
                    wins: t.wins,
                    draws: t.draws,
                    losses: t.losses,
                    goals_for: t.gf,
                    goals_against: t.ga,
                    points: t.points,
                },
                create: {
                    group_id: groupId,
                    team_id: t.teamId,
                    season_id: seasonId,
                    position: pos + 1,
                    matches_played: t.played,
                    wins: t.wins,
                    draws: t.draws,
                    losses: t.losses,
                    goals_for: t.gf,
                    goals_against: t.ga,
                    points: t.points,
                },
            });
        }
        await db.group.update({ where: { id: groupId }, data: { status: GroupStatus.SCHEDULED, scheduleGeneratedAt: new Date() } });
        scheduledGroupLetters.push(letter);
        console.log(`[MessySeasonSeeder] Bảng ${letter}: SCHEDULED — ${createdMatches.filter((m) => teamIds.includes(m.homeTeamId)).length} trận có tỉ số chính thức / ${ROUND_ROBIN_PAIRS.length} tổng.`);
    }
    await db.phase.update({ where: { id: groupStagePhaseId }, data: { status: PhaseStatus.in_progress } });
    return { createdMatches, scheduledGroupLetters, draftGroupLetters, scheduleFailedGroupLetters };
}
/** Chạy matchDetailSeeder (lineup/jersey/event) CHỈ cho các trận đã có tỉ số chính thức. */
export async function seedMatchDetailsForMessyMatches(db, createdMatches, seasonTeamIdByTeamId) {
    for (const m of createdMatches) {
        const homeSeasonTeamId = seasonTeamIdByTeamId[m.homeTeamId];
        const awaySeasonTeamId = seasonTeamIdByTeamId[m.awayTeamId];
        if (homeSeasonTeamId === undefined || awaySeasonTeamId === undefined) {
            console.warn(`[MessySeasonSeeder] bỏ qua matchDetail cho match #${m.matchId}: thiếu seasonTeamId`);
            continue;
        }
        await seedMatchDetails(db, {
            matchId: m.matchId,
            homeTeamId: m.homeTeamId,
            awayTeamId: m.awayTeamId,
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            homeSeasonTeamId,
            awaySeasonTeamId,
        });
    }
}
//# sourceMappingURL=messySeasonSeeder.js.map