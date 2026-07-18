import { MatchEventType, JerseyType, LineupType, MatchStatus, MatchResultType, MatchResultStatus, } from "../generated/prisma/client.js";
import { randInt, pickOrThrow } from "./helperSeeder.js";
/**
 * FIX: squad membership scoped theo season_team_id (@@unique([season_team_id, ...])
 * trong schema), KHÔNG phải team_id. Bản trước query where: { team_id }
 * — field đó không tồn tại trên TeamPlayer, không compile được.
 */
async function getSquadOrdered(db, seasonTeamId) {
    const rows = await db.teamPlayer.findMany({
        where: { season_team_id: seasonTeamId },
        orderBy: { jersey_number: "asc" },
        select: { player_id: true, jersey_number: true, position: true, role: true },
    });
    return rows;
}
function splitStartersSubs(squad) {
    const gk = squad.filter((p) => p.jersey_number <= 3).slice(0, 1);
    const df = squad.filter((p) => p.jersey_number >= 4 && p.jersey_number <= 11).slice(0, 4);
    const mf = squad.filter((p) => p.jersey_number >= 12 && p.jersey_number <= 19).slice(0, 4);
    const fw = squad.filter((p) => p.jersey_number >= 20).slice(0, 2);
    const starters = [...gk, ...df, ...mf, ...fw];
    const starterIds = new Set(starters.map((p) => p.player_id));
    const subs = squad.filter((p) => !starterIds.has(p.player_id));
    return { starters, subs };
}
async function seedLineupForTeam(db, matchId, teamId, starters, subs) {
    for (const p of starters) {
        await db.matchLineup.upsert({
            where: { match_id_player_id: { match_id: matchId, player_id: p.player_id } },
            update: {},
            create: {
                match_id: matchId,
                team_id: teamId,
                player_id: p.player_id,
                position: p.position,
                lineup_type: LineupType.starter,
                is_captain: p.role === "captain",
            },
        });
    }
    for (const p of subs.slice(0, 5)) {
        await db.matchLineup.upsert({
            where: { match_id_player_id: { match_id: matchId, player_id: p.player_id } },
            update: {},
            create: {
                match_id: matchId,
                team_id: teamId,
                player_id: p.player_id,
                position: p.position,
                lineup_type: LineupType.substitute,
            },
        });
    }
}
async function seedJerseyForTeam(db, matchId, teamId, seasonTeamId, type) {
    const jersey = await db.seasonTeamJersey.findUnique({
        where: { season_team_id_type: { season_team_id: seasonTeamId, type } },
    });
    if (!jersey)
        return;
    await db.matchJerseyAssignment.upsert({
        where: { match_id_team_id: { match_id: matchId, team_id: teamId } },
        update: {},
        create: { match_id: matchId, team_id: teamId, season_jersey_id: jersey.id },
    });
}
async function seedGoalEvents(db, matchId, teamId, starters, goals, maxMinute = 90) {
    const scorers = starters.filter((p) => p.position === "forward" || p.position === "midfielder");
    const pool = scorers.length ? scorers : starters;
    if (pool.length === 0)
        return;
    for (let i = 0; i < goals; i++) {
        const scorer = pickOrThrow(pool, `seedGoalEvents team=${teamId}`);
        await db.matchEvent.create({
            data: { match_id: matchId, team_id: teamId, player_id: scorer.player_id, type: MatchEventType.goal, minute: randInt(1, maxMinute) },
        });
    }
}
async function seedCardEvents(db, matchId, teamId, starters, maxMinute = 90) {
    const yellowCount = randInt(0, 3);
    for (let i = 0; i < yellowCount; i++) {
        const p = pickOrThrow(starters, `seedCardEvents yellow team=${teamId}`);
        await db.matchEvent.create({
            data: {
                match_id: matchId,
                team_id: teamId,
                player_id: p.player_id,
                type: MatchEventType.yellow_card,
                card_color: "yellow",
                minute: randInt(1, maxMinute),
            },
        });
    }
    if (Math.random() < 0.06) {
        const p = pickOrThrow(starters, `seedCardEvents red team=${teamId}`);
        await db.matchEvent.create({
            data: {
                match_id: matchId,
                team_id: teamId,
                player_id: p.player_id,
                type: MatchEventType.red_card,
                card_color: "red",
                minute: randInt(1, maxMinute),
            },
        });
    }
}
export async function seedMatchDetails(db, params) {
    const { matchId, homeTeamId, awayTeamId, homeScore, awayScore, homeSeasonTeamId, awaySeasonTeamId } = params;
    const existingLineupCount = await db.matchLineup.count({ where: { match_id: matchId } });
    if (existingLineupCount > 0) {
        console.log(`[MatchDetailSeeder] match #${matchId} đã có ${existingLineupCount} lineup — bỏ qua (idempotent).`);
        return;
    }
    // FIX: lookup roster theo season_team_id, không phải team_id.
    const homeSquad = await getSquadOrdered(db, homeSeasonTeamId);
    const awaySquad = await getSquadOrdered(db, awaySeasonTeamId);
    if (homeSquad.length < 11 || awaySquad.length < 11) {
        console.warn(`[MatchDetailSeeder] bỏ qua match #${matchId}: squad chưa đủ 11 ` +
            `(home season_team #${homeSeasonTeamId}=${homeSquad.length}, away season_team #${awaySeasonTeamId}=${awaySquad.length}). ` +
            `Kiểm tra lại thứ tự seed — squadSeeder phải chạy xong trước bước này.`);
        return;
    }
    const homeSplit = splitStartersSubs(homeSquad);
    const awaySplit = splitStartersSubs(awaySquad);
    await seedLineupForTeam(db, matchId, homeTeamId, homeSplit.starters, homeSplit.subs);
    await seedLineupForTeam(db, matchId, awayTeamId, awaySplit.starters, awaySplit.subs);
    await seedJerseyForTeam(db, matchId, homeTeamId, homeSeasonTeamId, JerseyType.home);
    await seedJerseyForTeam(db, matchId, awayTeamId, awaySeasonTeamId, JerseyType.away);
    await seedGoalEvents(db, matchId, homeTeamId, homeSplit.starters, homeScore);
    await seedGoalEvents(db, matchId, awayTeamId, awaySplit.starters, awayScore);
    await seedCardEvents(db, matchId, homeTeamId, homeSplit.starters);
    await seedCardEvents(db, matchId, awayTeamId, awaySplit.starters);
}
// ============================================================
// EDGE CASES MỚI — trạng thái trận đấu bất thường
// ============================================================
/**
 * Forfeit: 1 đội không ra sân (thiếu người hợp lệ, vi phạm kỷ luật...).
 * Đội forfeit KHÔNG có lineup (không đá thật). Điểm số theo
 * TournamentRule.forfeit_score (default 3) — truyền vào từ caller vì
 * seeder này không tự query TournamentRule (giữ hàm thuần, không side-query
 * ngoài phạm vi match).
 *
 * Lưu ý: MatchResult.home_final_score/away_final_score dùng để hiển thị kết
 * quả cuối; winner nhận forfeitScore-0, không phải tỉ số thật.
 */
export async function seedForfeitMatchDetails(db, params) {
    const { matchId, winningTeamId, winningSeasonTeamId, forfeitScore, isHomeForfeiting } = params;
    const existingResult = await db.matchResult.findUnique({ where: { match_id: matchId } });
    if (existingResult) {
        console.log(`[MatchDetailSeeder] match #${matchId} đã có MatchResult — bỏ qua (idempotent).`);
        return;
    }
    // đội thắng vẫn có lineup đầy đủ (họ có ra sân, chỉ đối thủ không đến)
    const winningSquad = await getSquadOrdered(db, winningSeasonTeamId);
    if (winningSquad.length >= 11) {
        const { starters, subs } = splitStartersSubs(winningSquad);
        await seedLineupForTeam(db, matchId, winningTeamId, starters, subs);
    }
    await db.match.update({
        where: { id: matchId },
        data: { status: MatchStatus.forfeited },
    });
    await db.matchResult.create({
        data: {
            match_id: matchId,
            winner_team_id: winningTeamId,
            home_final_score: isHomeForfeiting ? 0 : forfeitScore,
            away_final_score: isHomeForfeiting ? forfeitScore : 0,
            result_type: MatchResultType.forfeit,
            status: MatchResultStatus.official,
            notes: `Đội ${isHomeForfeiting ? "chủ nhà" : "khách"} bỏ trận (forfeit).`,
        },
    });
    console.log(`[MatchDetailSeeder] match #${matchId}: forfeit, đội #${winningTeamId} thắng ${forfeitScore}-0.`);
}
/**
 * Abandoned: trận đang đá thì bị dừng giữa chừng (mưa bão, sự cố an ninh,
 * chấn thương nặng...). Cả 2 đội có lineup đầy đủ (trận đã bắt đầu), nhưng
 * events chỉ phát sinh trong khoảng [0, abandonedMinute] — không tạo
 * MatchResult vì kết quả CHƯA được phân định (cần review thủ công, đúng
 * với field pending_official_at / MatchResultStatus.under_review sẵn có
 * trong schema).
 */
export async function seedAbandonedMatchDetails(db, params) {
    const { matchId, homeTeamId, awayTeamId, homeSeasonTeamId, awaySeasonTeamId, abandonedMinute, abandonedReason, homeScoreAtAbandonment, awayScoreAtAbandonment, } = params;
    const existingLineupCount = await db.matchLineup.count({ where: { match_id: matchId } });
    if (existingLineupCount > 0) {
        console.log(`[MatchDetailSeeder] match #${matchId} đã có lineup — bỏ qua (idempotent).`);
        return;
    }
    const homeSquad = await getSquadOrdered(db, homeSeasonTeamId);
    const awaySquad = await getSquadOrdered(db, awaySeasonTeamId);
    if (homeSquad.length < 11 || awaySquad.length < 11) {
        console.warn(`[MatchDetailSeeder] bỏ qua abandoned match #${matchId}: squad chưa đủ 11.`);
        return;
    }
    const homeSplit = splitStartersSubs(homeSquad);
    const awaySplit = splitStartersSubs(awaySquad);
    await seedLineupForTeam(db, matchId, homeTeamId, homeSplit.starters, homeSplit.subs);
    await seedLineupForTeam(db, matchId, awayTeamId, awaySplit.starters, awaySplit.subs);
    await seedGoalEvents(db, matchId, homeTeamId, homeSplit.starters, homeScoreAtAbandonment, abandonedMinute);
    await seedGoalEvents(db, matchId, awayTeamId, awaySplit.starters, awayScoreAtAbandonment, abandonedMinute);
    await seedCardEvents(db, matchId, homeTeamId, homeSplit.starters, abandonedMinute);
    await seedCardEvents(db, matchId, awayTeamId, awaySplit.starters, abandonedMinute);
    await db.match.update({
        where: { id: matchId },
        data: {
            status: MatchStatus.abandoned,
            abandoned_minute: abandonedMinute,
            abandoned_reason: abandonedReason,
            pending_official_at: new Date(),
        },
    });
    console.log(`[MatchDetailSeeder] match #${matchId}: abandoned tại phút ${abandonedMinute} (${abandonedReason}), chờ review.`);
}
/**
 * Disputed result: mutate 1 MatchResult ĐÃ tồn tại (tạo bởi seedMatchDetails
 * / flow bình thường) sang trạng thái tranh chấp — protested (đang khiếu
 * nại), overturned (đã lật kèo sau khiếu nại), hoặc under_review. Không tự
 * tạo MatchResult mới vì dispute luôn xảy ra SAU khi đã có kết quả chính
 * thức.
 */
export async function seedDisputedResultDetails(db, params) {
    const { matchId, newStatus, appealReason, appealNote } = params;
    const existing = await db.matchResult.findUnique({ where: { match_id: matchId } });
    if (!existing) {
        throw new Error(`[MatchDetailSeeder] match #${matchId} chưa có MatchResult — cần seedMatchDetails trước khi tạo dispute.`);
    }
    await db.matchResult.update({
        where: { match_id: matchId },
        data: { status: newStatus, appeal_reason: appealReason, appeal_note: appealNote ?? null },
    });
    console.log(`[MatchDetailSeeder] match #${matchId}: MatchResult -> ${newStatus} (${appealReason}).`);
}
//# sourceMappingURL=matchDetailSeeder.js.map