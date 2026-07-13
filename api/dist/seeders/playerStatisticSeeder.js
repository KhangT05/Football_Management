// prisma/seed/playerStatisticSeeder.ts
import { MatchEventType } from "../generated/prisma/client.js";
/**
 * Quét toàn bộ MatchLineup + MatchEvent của các trận thuộc season (qua Phase.season_id)
 * rồi cộng dồn thành PlayerStatistic theo player+team+season. Recompute-from-scratch mỗi
 * lần chạy nên bản thân hàm này idempotent — điều kiện tiên quyết là MatchEvent không bị
 * nhân đôi ở bước trước (xem guard trong matchDetailSeeder.ts).
 *
 * FIX: match query phải lọc is_active: true — cùng lý do với ScheduleService
 * (xem comment trong groupMatchSeeder.ts/knockoutSeeder.ts). Match rác còn sót
 * từ lần seed cũ bị crash giữa chừng (is_active mặc định false/không set) vẫn
 * nằm trong DB và match phase_id -> season_id, nên nếu không lọc, lineup/event
 * của match rác đó vẫn bị cộng vào matches_played/goals_scored — silent data
 * corruption, không throw, không log warning.
 *
 * Giới hạn: schema không có MatchEventType riêng cho "assist" nên assists giữ = 0.
 */
export async function seedPlayerStatistics(db, seasonId) {
    const matches = await db.match.findMany({
        where: { phase: { season_id: seasonId }, is_active: true },
        select: { id: true },
    });
    const matchIds = matches.map((m) => m.id);
    if (matchIds.length === 0)
        return;
    const lineups = await db.matchLineup.findMany({
        where: { match_id: { in: matchIds } },
        select: { match_id: true, player_id: true, team_id: true, lineup_type: true },
    });
    const events = await db.matchEvent.findMany({
        where: { match_id: { in: matchIds }, player_id: { not: null }, team_id: { not: null } },
        select: { player_id: true, team_id: true, type: true },
    });
    const acc = new Map();
    const key = (playerId, teamId) => `${playerId}:${teamId}`;
    for (const l of lineups) {
        const k = key(l.player_id, l.team_id);
        if (!acc.has(k)) {
            acc.set(k, { playerId: l.player_id, teamId: l.team_id, matchIds: new Set(), goals: 0, yellow: 0, red: 0, minutes: 0 });
        }
        const a = acc.get(k);
        a.matchIds.add(l.match_id);
        if (l.lineup_type === "starter")
            a.minutes += 90;
    }
    for (const e of events) {
        if (!e.player_id || !e.team_id)
            continue;
        const k = key(e.player_id, e.team_id);
        const a = acc.get(k);
        if (!a)
            continue;
        if (e.type === MatchEventType.goal || e.type === MatchEventType.penalty_scored)
            a.goals++;
        if (e.type === MatchEventType.yellow_card)
            a.yellow++;
        if (e.type === MatchEventType.red_card || e.type === MatchEventType.second_yellow)
            a.red++;
    }
    let count = 0;
    for (const a of acc.values()) {
        await db.playerStatistic.upsert({
            where: { player_id_team_id_season_id: { player_id: a.playerId, team_id: a.teamId, season_id: seasonId } },
            update: {
                matches_played: a.matchIds.size,
                goals_scored: a.goals,
                yellow_cards: a.yellow,
                red_cards: a.red,
                minutes_played: a.minutes,
                accumulated_yellow_cards: a.yellow,
                yellow_cards_since_reset: a.yellow,
            },
            create: {
                player_id: a.playerId,
                team_id: a.teamId,
                season_id: seasonId,
                matches_played: a.matchIds.size,
                goals_scored: a.goals,
                yellow_cards: a.yellow,
                red_cards: a.red,
                minutes_played: a.minutes,
                accumulated_yellow_cards: a.yellow,
                yellow_cards_since_reset: a.yellow,
            },
        });
        count++;
    }
    console.log(`[PlayerStatisticSeeder] tổng hợp ${count} PlayerStatistic`);
}
//# sourceMappingURL=playerStatisticSeeder.js.map