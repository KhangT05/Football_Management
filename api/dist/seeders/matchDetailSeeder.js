// prisma/seed/matchDetailSeeder.ts
import { MatchEventType, JerseyType, LineupType } from "../generated/prisma/client.js";
import { randInt, pickOrThrow } from "./helperSeeder.js";
async function getSquadOrdered(db, teamId) {
    const rows = await db.teamPlayer.findMany({
        where: { team_id: teamId },
        orderBy: { jersey_number: "asc" },
        select: { player_id: true, jersey_number: true, position: true, role: true },
    });
    return rows;
}
// Đội hình ra sân theo đúng thứ tự jersey đã sinh ở squadSeeder (1-3 GK, 4-11 DF, 12-19 MF, 20-23 FW):
// lấy 1 GK + 4 DF + 4 MF + 2 FW = 11 người đá chính, còn lại là dự bị.
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
    // đăng ký thêm vài dự bị vào danh sách trận (không nhất thiết vào sân)
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
async function seedGoalEvents(db, matchId, teamId, starters, goals) {
    // ưu tiên tiền đạo/tiền vệ ghi bàn cho hợp lý, vẫn cho phép hậu vệ ghi bàn (thực tế có)
    const scorers = starters.filter((p) => p.position === "forward" || p.position === "midfielder");
    const pool = scorers.length ? scorers : starters;
    if (pool.length === 0)
        return;
    for (let i = 0; i < goals; i++) {
        const scorer = pickOrThrow(pool, `seedGoalEvents team=${teamId}`);
        await db.matchEvent.create({
            data: { match_id: matchId, team_id: teamId, player_id: scorer.player_id, type: MatchEventType.goal, minute: randInt(1, 90) },
        });
    }
}
async function seedCardEvents(db, matchId, teamId, starters) {
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
                minute: randInt(1, 90),
            },
        });
    }
    // ~6% trận có thẻ đỏ trực tiếp cho 1 đội
    if (Math.random() < 0.06) {
        const p = pickOrThrow(starters, `seedCardEvents red team=${teamId}`);
        await db.matchEvent.create({
            data: {
                match_id: matchId,
                team_id: teamId,
                player_id: p.player_id,
                type: MatchEventType.red_card,
                card_color: "red",
                minute: randInt(1, 90),
            },
        });
    }
}
/**
 * Sinh đầy đủ MatchLineup + MatchJerseyAssignment + MatchEvent cho 1 trận,
 * số bàn thắng event khớp đúng với home_score/away_score đã lưu ở Match.
 */
export async function seedMatchDetails(db, params) {
    const { matchId, homeTeamId, awayTeamId, homeScore, awayScore, homeSeasonTeamId, awaySeasonTeamId } = params;
    const homeSquad = await getSquadOrdered(db, homeTeamId);
    const awaySquad = await getSquadOrdered(db, awayTeamId);
    if (homeSquad.length < 11 || awaySquad.length < 11)
        return; // squad chưa đủ thì bỏ qua an toàn
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
//# sourceMappingURL=matchDetailSeeder.js.map