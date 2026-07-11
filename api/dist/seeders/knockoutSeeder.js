// prisma/seed/knockoutSeeder.ts
import { PhaseType, PhaseFormat, MatchStatus, MatchResultType, } from "../generated/prisma/client.js";
import { pickOrThrow, simulateKnockoutMatch } from "./helperSeeder.js";
import { ROUND_OF_16_TEMPLATE } from "./worldcup.js";
function toMatchSummary(p) {
    return {
        matchId: p.matchId,
        homeTeamId: p.homeTeamId,
        awayTeamId: p.awayTeamId,
        homeScore: p.homeScore,
        awayScore: p.awayScore,
    };
}
async function playAndRecordMatch(db, phaseId, homeTeamId, awayTeamId, venueId) {
    const sim = simulateKnockoutMatch();
    const match = await db.match.create({
        data: {
            phase_id: phaseId,
            group_id: null,
            home_team_id: homeTeamId,
            away_team_id: awayTeamId,
            venue_id: venueId,
            scheduled_at: new Date(),
            played_at: new Date(),
            status: MatchStatus.finished,
            home_score: sim.homeScore,
            away_score: sim.awayScore,
        },
    });
    const winnerTeamId = sim.winnerIsHome ? homeTeamId : awayTeamId;
    const loserTeamId = sim.winnerIsHome ? awayTeamId : homeTeamId;
    await db.matchResult.create({
        data: {
            match_id: match.id,
            winner_team_id: winnerTeamId,
            home_final_score: sim.homeScore,
            away_final_score: sim.awayScore,
            home_penalty_score: sim.homePenalty ?? null,
            away_penalty_score: sim.awayPenalty ?? null,
            result_type: sim.wentToPenalty
                ? MatchResultType.penalty
                : sim.wentToExtraTime
                    ? MatchResultType.extra_time
                    : MatchResultType.full_time,
        },
    });
    return {
        matchId: match.id,
        winnerTeamId,
        loserTeamId,
        homeTeamId,
        awayTeamId,
        homeScore: sim.homeScore,
        awayScore: sim.awayScore,
    };
}
/**
 * Vòng 1/8 (Round of 16): trường hợp đặc biệt vì các slot được seed TRỰC TIẾP
 * từ kết quả vòng bảng (nhất/nhì bảng), không phải từ source_a/source_b.
 */
async function seedRoundOf16(db, seasonId, topTwoByGroup, venueIds) {
    const phase = await db.phase.create({
        data: {
            season_id: seasonId,
            name: "Vòng 1/8",
            type: PhaseType.round_of_16,
            format: PhaseFormat.knockout,
            order: 2,
        },
    });
    const results = [];
    for (let i = 0; i < ROUND_OF_16_TEMPLATE.length; i++) {
        const pairing = ROUND_OF_16_TEMPLATE[i];
        if (!pairing) {
            throw new Error(`ROUND_OF_16_TEMPLATE thiếu cặp ở vị trí ${i}`);
        }
        const [winnerGroup, runnerUpGroup] = pairing;
        const homeTeamId = topTwoByGroup[winnerGroup][0]; // nhất bảng winnerGroup
        const awayTeamId = topTwoByGroup[runnerUpGroup][1]; // nhì bảng runnerUpGroup
        const slot = await db.bracketSlot.create({
            data: {
                phase_id: phase.id,
                round: 1,
                slot_number: i + 1,
                seeded_home_team_id: homeTeamId,
                seeded_away_team_id: awayTeamId,
            },
        });
        const played = await playAndRecordMatch(db, phase.id, homeTeamId, awayTeamId, pickOrThrow(venueIds, "venueIds"));
        await db.bracketSlot.update({ where: { id: slot.id }, data: { match_id: played.matchId } });
        results.push({
            slotId: slot.id,
            winnerTeamId: played.winnerTeamId,
            loserTeamId: played.loserTeamId,
            matchId: played.matchId,
            homeTeamId: played.homeTeamId,
            awayTeamId: played.awayTeamId,
            homeScore: played.homeScore,
            awayScore: played.awayScore,
        });
    }
    console.log(`[KnockoutSeeder] Round of 16 xong — Phase #${phase.id}`);
    return { phaseId: phase.id, results };
}
/**
 * Vòng knockout kế tiếp bất kỳ (QF, SF, Final): ghép cặp tuần tự các winner
 * của vòng trước (0v1, 2v3, ...), mỗi BracketSlot mới trỏ source_a/source_b
 * về đúng BracketSlot của vòng trước — đây chính là cơ chế "winner tiến vào
 * slot kế tiếp" mà schema mô tả.
 */
async function advanceKnockoutRound(db, seasonId, previousRound, opts, venueIds) {
    const phase = await db.phase.create({
        data: {
            season_id: seasonId,
            name: opts.name,
            type: opts.type,
            format: PhaseFormat.knockout,
            order: opts.order,
        },
    });
    const results = [];
    for (let i = 0, slotNumber = 1; i < previousRound.length; i += 2, slotNumber++) {
        const a = previousRound[i];
        const b = previousRound[i + 1];
        if (!a || !b) {
            throw new Error(`Thiếu cặp đấu ở vị trí ${i} khi ghép vòng ${opts.name}`);
        }
        const slot = await db.bracketSlot.create({
            data: {
                phase_id: phase.id,
                round: 1,
                slot_number: slotNumber,
                source_a_slot_id: a.slotId,
                source_b_slot_id: b.slotId,
                // seeded_home/away để null: đội tham gia được xác định qua source_a/source_b
            },
        });
        const played = await playAndRecordMatch(db, phase.id, a.winnerTeamId, b.winnerTeamId, pickOrThrow(venueIds, "venueIds"));
        await db.bracketSlot.update({ where: { id: slot.id }, data: { match_id: played.matchId } });
        results.push({
            slotId: slot.id,
            winnerTeamId: played.winnerTeamId,
            loserTeamId: played.loserTeamId,
            matchId: played.matchId,
            homeTeamId: played.homeTeamId,
            awayTeamId: played.awayTeamId,
            homeScore: played.homeScore,
            awayScore: played.awayScore,
        });
    }
    console.log(`[KnockoutSeeder] ${opts.name} xong — Phase #${phase.id}`);
    return { phaseId: phase.id, results };
}
/**
 * Trận tranh hạng 3: dùng 2 đội THUA ở bán kết. Lưu ý: schema BracketSlot chỉ
 * model "winner tiến vào slot kế" (source_a/source_b -> winner), KHÔNG có khái
 * niệm "loser advance". Vì vậy trận tranh 3 được tạo trực tiếp bằng Match,
 * không gắn qua BracketSlot. Nếu muốn model đầy đủ, có thể cân nhắc thêm field
 * kiểu `advance_loser: Boolean` vào BracketSlot ở lần thiết kế sau.
 */
async function seedThirdPlaceMatch(db, seasonId, semiFinalResults, order, venueIds) {
    const phase = await db.phase.create({
        data: {
            season_id: seasonId,
            name: "Tranh hạng Ba",
            type: PhaseType.third_place,
            format: PhaseFormat.knockout,
            order,
        },
    });
    const sf1 = semiFinalResults[0];
    const sf2 = semiFinalResults[1];
    if (!sf1 || !sf2) {
        throw new Error("Thiếu kết quả bán kết để tạo trận tranh hạng 3");
    }
    const played = await playAndRecordMatch(db, phase.id, sf1.loserTeamId, sf2.loserTeamId, pickOrThrow(venueIds, "venueIds"));
    console.log(`[KnockoutSeeder] Tranh hạng 3 xong — Phase #${phase.id}`);
    return played;
}
export async function seedKnockoutBracket(db, seasonId, topTwoByGroup, venueIds) {
    const r16 = await seedRoundOf16(db, seasonId, topTwoByGroup, venueIds);
    const qf = await advanceKnockoutRound(db, seasonId, r16.results, { name: "Tứ kết", type: PhaseType.quarter_final, order: 3 }, venueIds);
    const sf = await advanceKnockoutRound(db, seasonId, qf.results, { name: "Bán kết", type: PhaseType.semi_final, order: 4 }, venueIds);
    const thirdPlace = await seedThirdPlaceMatch(db, seasonId, sf.results, 5, venueIds);
    const final = await advanceKnockoutRound(db, seasonId, sf.results, { name: "Chung kết", type: PhaseType.final, order: 6 }, venueIds);
    const finalResult = final.results[0];
    if (!finalResult) {
        throw new Error("Không có kết quả chung kết");
    }
    const championTeamId = finalResult.winnerTeamId;
    console.log(`[KnockoutSeeder] 🏆 Vô địch: team #${championTeamId}`);
    const allMatches = [
        ...r16.results.map(toMatchSummary),
        ...qf.results.map(toMatchSummary),
        ...sf.results.map(toMatchSummary),
        toMatchSummary(thirdPlace),
        ...final.results.map(toMatchSummary),
    ];
    return { championTeamId, allMatches };
}
//# sourceMappingURL=knockoutSeeder.js.map