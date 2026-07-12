// prisma/seed/groupMatchSeeder.ts
import { MatchStatus, MatchResultType } from "../generated/prisma/client.js";
import { pickOrThrow, simulateGroupMatch } from "./helperSeeder.js";
import { GROUP_LETTERS, WORLD_CUP_GROUPS } from "./worldcup.js";
// Round-robin 4 đội -> đúng 6 cặp đấu
const ROUND_ROBIN_PAIRS = [
    [0, 1],
    [2, 3],
    [0, 2],
    [1, 3],
    [0, 3],
    [1, 2],
];
export async function seedGroupMatchesAndStandings(db, groupStagePhaseId, groupIdByLetter, teamIdByName, seasonId, venueIds) {
    const topTwoByGroup = {};
    const createdMatches = [];
    let matchDayOffset = 0;
    for (const letter of GROUP_LETTERS) {
        const groupId = groupIdByLetter[letter];
        const teamNames = WORLD_CUP_GROUPS[letter];
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
        const existingCount = await db.match.count({ where: { phase_id: groupStagePhaseId, group_id: groupId } });
        const alreadySimulated = existingCount >= ROUND_ROBIN_PAIRS.length;
        for (const [i, j] of ROUND_ROBIN_PAIRS) {
            const homeTeamId = teamIds[i];
            const awayTeamId = teamIds[j];
            if (homeTeamId === undefined || awayTeamId === undefined) {
                throw new Error(`Bảng ${letter} thiếu đội ở vị trí ${i}/${j} (cần đúng 4 đội)`);
            }
            let homeScore, awayScore;
            if (!alreadySimulated) {
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
                    },
                });
                await db.matchResult.create({
                    data: {
                        match_id: match.id,
                        winner_team_id: homeScore === awayScore ? null : homeScore > awayScore ? homeTeamId : awayTeamId,
                        home_final_score: homeScore,
                        away_final_score: awayScore,
                        result_type: MatchResultType.full_time,
                    },
                });
                createdMatches.push({ matchId: match.id, homeTeamId, awayTeamId, homeScore, awayScore });
                matchDayOffset++;
            }
            else {
                // Reseed: đọc lại kết quả đã tạo trước đó để tính lại standings cho nhất quán.
                // KHÔNG được default 0-0 khi không tìm thấy — đó là silent data corruption
                // (đứng bảng sai mà không có bất kỳ log/error nào báo hiệu). Nếu existingCount
                // đủ 6 nhưng không tìm thấy đúng cặp home/away này, nghĩa là dữ liệu đã bị
                // seed lệch (vd. bị xoá một phần, hoặc pairing bị đổi giữa các lần chạy) —
                // phải throw để dừng seed ngay, không được âm thầm tính sai.
                const existing = await db.match.findFirst({
                    where: { phase_id: groupStagePhaseId, group_id: groupId, home_team_id: homeTeamId, away_team_id: awayTeamId },
                });
                if (!existing || existing.home_score === null || existing.away_score === null) {
                    throw new Error(`[GroupMatchSeeder] Bảng ${letter}: existingCount=${existingCount} (đủ ${ROUND_ROBIN_PAIRS.length}) ` +
                        `nhưng không tìm thấy match hợp lệ cho ${homeTeamId} vs ${awayTeamId}. ` +
                        `Dữ liệu đã seed có khả năng bị lệch/hỏng — cần kiểm tra tay hoặc reset DB (migrate reset) rồi seed lại từ đầu, ` +
                        `không được để standings tính sai lặng lẽ.`);
                }
                homeScore = existing.home_score;
                awayScore = existing.away_score;
                createdMatches.push({ matchId: existing.id, homeTeamId, awayTeamId, homeScore, awayScore });
            }
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
                homeTally.points += 3;
                awayTally.losses++;
            }
            else if (homeScore < awayScore) {
                awayTally.wins++;
                awayTally.points += 3;
                homeTally.losses++;
            }
            else {
                homeTally.draws++;
                awayTally.draws++;
                homeTally.points += 1;
                awayTally.points += 1;
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