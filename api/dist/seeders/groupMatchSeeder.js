import { MatchStatus, MatchResultType, MatchResultStatus } from "../generated/prisma/client.js";
import { pickOrThrow, simulateGroupMatch } from "./helperSeeder.js";
// Round-robin 4 đội -> đúng 6 cặp đấu
const ROUND_ROBIN_PAIRS = [
    [0, 1],
    [2, 3],
    [0, 2],
    [1, 3],
    [0, 3],
    [1, 2],
];
/**
 * FIX (P1): bản trước quyết định "đã seed xong bảng này chưa" dựa vào
 * `existingCount >= 6` (aggregate count trên toàn group), rồi hoặc replay
 * TOÀN BỘ 6 cặp bằng match mới (nếu count < 6), hoặc đọc lại TOÀN BỘ 6 cặp
 * cũ (nếu count >= 6) — không có branch nào xử lý đúng case "crash giữa
 * chừng" (vd 3/6 match đã tạo). Nếu crash ở match thứ 4, lần seed lại sẽ có
 * `existingCount=3 < 6` -> chạy lại từ pair đầu tiên -> TẠO TRÙNG 3 match đã
 * có (vì `Match.leg` nullable nên unique constraint không chặn được — đúng
 * cảnh báo trong dbTypes.ts). Kết quả: 9 match thay vì 6, tally cộng dồn sai,
 * standings sai lặng lẽ.
 *
 * Fix: check tồn tại theo ĐÚNG cặp (home, away) trước khi tạo, y hệt pattern
 * đã áp dụng đúng ở messySeasonSeeder.ts (sau fix). Không còn phụ thuộc vào
 * aggregate count nữa — mỗi cặp tự quyết định resume hay tạo mới, độc lập
 * với các cặp khác trong cùng group.
 */
export async function seedGroupMatchesAndStandings(db, groupStagePhaseId, groupIdByLetter, teamIdByName, seasonId, venueIds, groups, rulePoints) {
    const topTwoByGroup = {};
    const createdMatches = [];
    let matchDayOffset = 0;
    for (const letter of Object.keys(groups)) {
        const groupId = groupIdByLetter[letter];
        if (groupId === undefined) {
            throw new Error(`groupMatchSeeder: groupIdByLetter thiếu bảng "${letter}" — seedGroupStage chưa tạo group này`);
        }
        const teamNames = groups[letter];
        if (!teamNames) {
            throw new Error(`groupMatchSeeder: groups thiếu bảng "${letter}"`);
        }
        const teamIds = teamNames.map((n) => {
            const id = teamIdByName[n];
            if (id === undefined) {
                throw new Error(`Không tìm thấy team_id cho đội "${n}" (bảng ${letter})`);
            }
            return id;
        });
        const tally = new Map();
        teamIds.forEach((id) => {
            tally.set(id, { teamId: id, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0 });
        });
        const getTally = (teamId) => {
            const t = tally.get(teamId);
            if (!t) {
                throw new Error(`Không tìm thấy tally cho team #${teamId} (bảng ${letter})`);
            }
            return t;
        };
        for (const [i, j] of ROUND_ROBIN_PAIRS) {
            const homeTeamId = teamIds[i];
            const awayTeamId = teamIds[j];
            if (homeTeamId === undefined || awayTeamId === undefined) {
                throw new Error(`Bảng ${letter} thiếu đội ở vị trí ${i}/${j} (cần đúng 4 đội)`);
            }
            // FIX: check tồn tại theo ĐÚNG cặp, không dựa vào aggregate count.
            const existing = await db.match.findFirst({
                where: { phase_id: groupStagePhaseId, group_id: groupId, home_team_id: homeTeamId, away_team_id: awayTeamId },
            });
            let homeScore, awayScore, matchId;
            if (existing) {
                if (existing.home_score === null || existing.away_score === null) {
                    throw new Error(`[GroupMatchSeeder] Bảng ${letter}: tìm thấy match #${existing.id} (${homeTeamId} vs ${awayTeamId}) ` +
                        `nhưng thiếu tỉ số (home_score/away_score null). Dữ liệu đã seed có khả năng bị lệch/hỏng ` +
                        `(vd crash giữa lúc tạo match và tạo match_result) — cần reset DB (migrate reset) rồi seed lại từ đầu, ` +
                        `không được để standings tính sai lặng lẽ.`);
                }
                matchId = existing.id;
                homeScore = existing.home_score;
                awayScore = existing.away_score;
            }
            else {
                const sim = simulateGroupMatch();
                homeScore = sim.homeScore;
                awayScore = sim.awayScore;
                const match = await db.match.create({
                    data: {
                        phase_id: groupStagePhaseId,
                        group_id: groupId,
                        home_team_id: homeTeamId,
                        away_team_id: awayTeamId,
                        venue_id: pickOrThrow(venueIds, "groupMatchSeeder venueIds"),
                        scheduled_at: new Date(Date.now() + matchDayOffset * 86400000),
                        played_at: new Date(Date.now() + matchDayOffset * 86400000),
                        status: MatchStatus.finished,
                        home_score: homeScore,
                        away_score: awayScore,
                        leg: 1,
                        is_active: true,
                        round: String(matchDayOffset + 1),
                    },
                });
                await db.matchResult.create({
                    data: {
                        match_id: match.id,
                        winner_team_id: homeScore === awayScore ? null : homeScore > awayScore ? homeTeamId : awayTeamId,
                        home_final_score: homeScore,
                        away_final_score: awayScore,
                        result_type: MatchResultType.full_time,
                        status: MatchResultStatus.official,
                    },
                });
                matchId = match.id;
                matchDayOffset++;
            }
            createdMatches.push({ matchId, homeTeamId, awayTeamId, homeScore, awayScore });
            const homeTally = getTally(homeTeamId);
            const awayTally = getTally(awayTeamId);
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
        const first = sorted[0];
        const second = sorted[1];
        if (!first || !second) {
            throw new Error(`Bảng ${letter} không đủ 2 đội để xác định nhất/nhì`);
        }
        topTwoByGroup[letter] = [first.teamId, second.teamId];
        console.log(`[GroupMatchSeeder] Bảng ${letter}: nhất=${first.teamId}, nhì=${second.teamId}`);
    }
    return { topTwoByGroup, createdMatches };
}
//# sourceMappingURL=groupMatchSeeder.js.map