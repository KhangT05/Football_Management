import { MatchStatus, MatchResultType, MatchResultStatus } from "../generated/prisma/client.js";
import { pickOrThrow, simulateGroupMatch } from "./helperSeeder.js";
import type { DbClient } from "./dbTypes.js";
import type { GroupLetter } from "./teamGenerator.js";

interface TeamTally {
  teamId: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  points: number;
}

export interface GroupStandingsResult {
  topTwoByGroup: Record<GroupLetter, [number, number]>;
  createdMatches: CreatedMatchInfo[];
}

export interface CreatedMatchInfo {
  matchId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
}

// Round-robin 4 đội -> đúng 6 cặp đấu
const ROUND_ROBIN_PAIRS: [number, number][] = [
  [0, 1],
  [2, 3],
  [0, 2],
  [1, 3],
  [0, 3],
  [1, 2],
];

export async function seedGroupMatchesAndStandings(
  db: DbClient,
  groupStagePhaseId: number,
  groupIdByLetter: Record<GroupLetter, number>,
  teamIdByName: Record<string, number>,
  seasonId: number,
  venueIds: number[],
  groups: Record<GroupLetter, string[]>,
  // NEW — bị thiếu ở bản trước, gây ReferenceError
  rulePoints: { win: number; draw: number; loss: number }
): Promise<GroupStandingsResult> {
  const topTwoByGroup = {} as Record<GroupLetter, [number, number]>;
  const createdMatches: CreatedMatchInfo[] = [];
  let matchDayOffset = 0;

  for (const letter of Object.keys(groups) as GroupLetter[]) {
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

    const tally = new Map<number, TeamTally>();
    teamIds.forEach((id) => {
      tally.set(id, { teamId: id, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0 });
    });

    const getTally = (teamId: number): TeamTally => {
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

      let homeScore: number, awayScore: number;

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
            // FIX: THIẾU is_active — ScheduleService lọc is_active: true ở
            // gần như mọi read-path (Queryable.beforeBuild cho findAll,
            // findMatchesBySeason, getSeasonSchedule). Match seed ra thiếu
            // field này vẫn đá được, vẫn tính standings đúng (TeamStanding
            // không lọc theo Match.is_active), nhưng biến mất khỏi mọi màn
            // lịch thi đấu công khai (ScheduleResults).
            is_active: true,
            // FIX: gán round theo thứ tự cặp đấu (1-6) trong vòng bảng —
            // trước đây không set, khiến getSeasonSchedule()/
            // ScheduleMatchCard hiển thị "Vòng 0" cho mọi trận vòng bảng
            // (round parse mặc định về '0' khi null).
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

        createdMatches.push({ matchId: match.id, homeTeamId, awayTeamId, homeScore, awayScore });
        matchDayOffset++;
      } else {
        // Reseed: đọc lại kết quả đã tạo trước đó để tính lại standings cho nhất quán.
        // KHÔNG được default 0-0 khi không tìm thấy — đó là silent data corruption.
        // Nếu existingCount đủ 6 nhưng không tìm thấy đúng cặp home/away này, nghĩa là
        // dữ liệu đã bị seed lệch — phải throw để dừng seed ngay.
        const existing = await db.match.findFirst({
          where: { phase_id: groupStagePhaseId, group_id: groupId, home_team_id: homeTeamId, away_team_id: awayTeamId },
        });

        if (!existing || existing.home_score === null || existing.away_score === null) {
          throw new Error(
            `[GroupMatchSeeder] Bảng ${letter}: existingCount=${existingCount} (đủ ${ROUND_ROBIN_PAIRS.length}) ` +
            `nhưng không tìm thấy match hợp lệ cho ${homeTeamId} vs ${awayTeamId}. ` +
            `Dữ liệu đã seed có khả năng bị lệch/hỏng — cần reset DB (migrate reset) rồi seed lại từ đầu, ` +
            `không được để standings tính sai lặng lẽ.`
          );
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
        homeTally.points += rulePoints.win;      // thay vì += 3
        awayTally.losses++;
        awayTally.points += rulePoints.loss;     // NEW — trước đây không cộng loss=0 tường minh, ok nếu loss luôn 0 nhưng nếu rule khác 0 thì sai
      } else if (homeScore < awayScore) {
        awayTally.wins++;
        awayTally.points += rulePoints.win;
        homeTally.losses++;
        homeTally.points += rulePoints.loss;
      } else {
        homeTally.draws++;
        awayTally.draws++;
        homeTally.points += rulePoints.draw;     // thay vì += 1
        awayTally.points += rulePoints.draw;
      }
    }

    const sorted = Array.from(tally.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.gf - a.ga;
      const gdB = b.gf - b.ga;
      if (gdB !== gdA) return gdB - gdA;
      return b.gf - a.gf;
    });

    for (let pos = 0; pos < sorted.length; pos++) {
      const t = sorted[pos];
      if (!t) continue;

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