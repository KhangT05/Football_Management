import { PhaseType, PhaseFormat, PhaseStatus, MatchStatus, MatchResultType, MatchResultStatus, } from "../generated/prisma/client.js";
import { pickOrThrow, simulateKnockoutMatch } from "./helperSeeder.js";
function toMatchSummary(p) {
    return {
        matchId: p.matchId,
        homeTeamId: p.homeTeamId,
        awayTeamId: p.awayTeamId,
        homeScore: p.homeScore,
        awayScore: p.awayScore,
    };
}
async function playAndRecordMatch(db, phaseId, round, homeTeamId, awayTeamId, venueId) {
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
            round: String(round),
            leg: null,
            is_active: true,
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
            status: MatchResultStatus.official,
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
export async function seedKnockoutBracket(db, seasonId, topTwoByGroup, venueIds, roundOf16Template) {
    const bracketSize = roundOf16Template.length * 2; // 16 khi có 8 cặp round 1
    const totalRounds = Math.log2(bracketSize);
    if (!Number.isInteger(totalRounds)) {
        throw new Error(`seedKnockoutBracket: roundOf16Template có ${roundOf16Template.length} cặp — bracketSize ${bracketSize} không phải lũy thừa của 2`);
    }
    const phase = await db.phase.create({
        data: {
            season_id: seasonId,
            name: "Vòng loại trực tiếp",
            type: PhaseType.round_of_16,
            format: PhaseFormat.knockout,
            status: PhaseStatus.draft,
            order: 2,
            legs: 1,
        },
    });
    const slotIdByRoundNum = new Map();
    for (let i = 0; i < roundOf16Template.length; i++) {
        const pairing = roundOf16Template[i];
        if (!pairing)
            throw new Error(`roundOf16Template thiếu cặp ở vị trí ${i}`);
        const [winnerGroup, runnerUpGroup] = pairing;
        const winnerPair = topTwoByGroup[winnerGroup];
        const runnerUpPair = topTwoByGroup[runnerUpGroup];
        if (!winnerPair || !runnerUpPair) {
            throw new Error(`seedKnockoutBracket: topTwoByGroup thiếu bảng "${winnerGroup}" hoặc "${runnerUpGroup}"`);
        }
        const slot = await db.bracketSlot.create({
            data: {
                phase_id: phase.id,
                round: 1,
                slot_number: i + 1,
                is_bye: false,
                seeded_home_team_id: winnerPair[0],
                seeded_away_team_id: runnerUpPair[1],
            },
        });
        slotIdByRoundNum.set(`1:${i + 1}`, slot.id);
    }
    for (let round = 2; round <= totalRounds; round++) {
        const slotsInRound = bracketSize / Math.pow(2, round);
        for (let slotNum = 1; slotNum <= slotsInRound; slotNum++) {
            const sourceASlotId = slotIdByRoundNum.get(`${round - 1}:${2 * slotNum - 1}`) ?? null;
            const sourceBSlotId = slotIdByRoundNum.get(`${round - 1}:${2 * slotNum}`) ?? null;
            const slot = await db.bracketSlot.create({
                data: {
                    phase_id: phase.id,
                    round,
                    slot_number: slotNum,
                    is_bye: false,
                    source_a_slot_id: sourceASlotId,
                    source_b_slot_id: sourceBSlotId,
                },
            });
            slotIdByRoundNum.set(`${round}:${slotNum}`, slot.id);
        }
    }
    const allMatches = [];
    let semiFinalResults = [];
    let championTeamId = null;
    for (let round = 1; round <= totalRounds; round++) {
        const slotsInRound = bracketSize / Math.pow(2, round);
        const roundResults = [];
        for (let slotNum = 1; slotNum <= slotsInRound; slotNum++) {
            const slotId = slotIdByRoundNum.get(`${round}:${slotNum}`);
            if (!slotId)
                throw new Error(`Thiếu slot ${round}:${slotNum}`);
            const slot = await db.bracketSlot.findUniqueOrThrow({
                where: { id: slotId },
                select: { id: true, seeded_home_team_id: true, seeded_away_team_id: true },
            });
            if (slot.seeded_home_team_id == null || slot.seeded_away_team_id == null) {
                throw new Error(`Slot ${round}:${slotNum} chưa đủ 2 đội trước khi đá — propagate ở round trước bị lỗi`);
            }
            const played = await playAndRecordMatch(db, phase.id, round, slot.seeded_home_team_id, slot.seeded_away_team_id, pickOrThrow(venueIds, "venueIds"));
            await db.bracketSlot.update({ where: { id: slotId }, data: { match_id: played.matchId } });
            roundResults.push(played);
            allMatches.push(toMatchSummary(played));
            if (round === totalRounds)
                championTeamId = played.winnerTeamId;
            if (round < totalRounds) {
                const parentSlotNum = Math.ceil(slotNum / 2);
                const parentSlotId = slotIdByRoundNum.get(`${round + 1}:${parentSlotNum}`);
                if (!parentSlotId)
                    throw new Error(`Thiếu slot cha ${round + 1}:${parentSlotNum}`);
                const isSourceA = slotNum % 2 === 1;
                await db.bracketSlot.update({
                    where: { id: parentSlotId },
                    data: isSourceA
                        ? { seeded_home_team_id: played.winnerTeamId }
                        : { seeded_away_team_id: played.winnerTeamId },
                });
            }
        }
        if (round === totalRounds - 1)
            semiFinalResults = roundResults;
        console.log(`[KnockoutSeeder] Round ${round}/${totalRounds} xong — Phase #${phase.id}`);
    }
    if (championTeamId == null)
        throw new Error("Không xác định được đội vô địch — final round không chạy");
    if (totalRounds >= 2 && semiFinalResults.length >= 2) {
        const sf1 = semiFinalResults[0];
        const sf2 = semiFinalResults[1];
        if (!sf1 || !sf2)
            throw new Error("Thiếu kết quả bán kết để tạo trận tranh hạng 3");
        const thirdPlacePhase = await db.phase.create({
            data: {
                season_id: seasonId,
                name: "Tranh hạng Ba",
                type: PhaseType.third_place,
                format: PhaseFormat.knockout,
                status: PhaseStatus.draft,
                order: totalRounds + 1,
                legs: 1,
            },
        });
        const thirdPlaceMatch = await playAndRecordMatch(db, thirdPlacePhase.id, 1, sf1.loserTeamId, sf2.loserTeamId, pickOrThrow(venueIds, "venueIds"));
        allMatches.push(toMatchSummary(thirdPlaceMatch));
        console.log(`[KnockoutSeeder] Tranh hạng 3 xong — Phase #${thirdPlacePhase.id}`);
    }
    else {
        console.log(`[KnockoutSeeder] Bỏ qua tranh hạng 3 — bracket chỉ có ${totalRounds} vòng, không có bán kết.`);
    }
    console.log(`[KnockoutSeeder] 🏆 Vô địch: team #${championTeamId}`);
    return { championTeamId, allMatches };
}
//# sourceMappingURL=knockoutSeeder.js.map