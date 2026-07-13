import {
    PhaseType,
    PhaseFormat,
    PhaseStatus,
    MatchStatus,
    MatchResultType,
    MatchResultStatus,
} from "../generated/prisma/client.js";
import type { DbClient } from "./dbTypes.js";
import { pickOrThrow, simulateKnockoutMatch } from "./helperSeeder.js";
import type { GroupLetter } from "./teamGenerator.js";

interface PlayedMatch {
    matchId: number;
    winnerTeamId: number;
    loserTeamId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
}

interface MatchSummary {
    matchId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
}

function toMatchSummary(p: PlayedMatch): MatchSummary {
    return {
        matchId: p.matchId,
        homeTeamId: p.homeTeamId,
        awayTeamId: p.awayTeamId,
        homeScore: p.homeScore,
        awayScore: p.awayScore,
    };
}

// simulateKnockoutMatch() (helperSeeder.ts) handle: hoà 90p -> hiệp phụ -> vẫn hoà ->
// luân lưu (loại trực tiếp không được hoà).
//
// FIX (khớp knockout.service.ts thật):
// - Match KHÔNG có cột home_score/away_score — bản cũ ghi thẳng field này,
//   không tồn tại trên schema Match. Điểm số CHỈ nằm ở MatchResult
//   (home_final_score/away_final_score) — xem _computeAggregateWinner().
// - Match luôn set `round` (string) — service thật set round ở
//   createRound1Matches()/propagateWinner(). Bản cũ bỏ trống field này.
// - `leg` luôn null vì seeder chỉ mô phỏng knockout single-leg (legs=1).
async function playAndRecordMatch(
    db: DbClient,
    phaseId: number,
    round: number,
    homeTeamId: number,
    awayTeamId: number,
    venueId: number,
): Promise<PlayedMatch> {
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
            // FIX: thiếu is_active khiến các trận knockout không hiện trong
            // ScheduleService.getSeasonSchedule()/findMatchesBySeason dù
            // bracket vẫn advance đúng (KnockoutService không dựa vào
            // Match.is_active để advance winner).
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

// FIX (root cause chính): TOÀN BỘ cây knockout (R16 → QF → SF → F) giờ nằm
// trong 1 PHASE DUY NHẤT, bracket_slots.round chạy 1..totalRounds, link qua
// source_a_slot_id/source_b_slot_id — mirror ĐÚNG _buildBracketInPhase() +
// bulkLinkSlots() thật trong knockout.service.ts. Công thức slot cha:
// slot (round, n) nhận nguồn từ (round-1, 2n-1) và (round-1, 2n).
//
// Bản cũ tạo 1 PHASE RIÊNG cho mỗi vòng (round_of_16/quarter_final/
// semi_final/final), mỗi slot hardcode round=1 — getBracket(phaseId) của
// BE chỉ đọc 1 phase 1 lần nên mỗi phase seed ra sẽ luôn bị tính
// totalRounds=1, khiến BracketView gắn nhãn sai (mọi phase hiện "Chung kết")
// và không thể hiển thị cây đấu liên round.
export async function seedKnockoutBracket(
    db: DbClient,
    seasonId: number,
    topTwoByGroup: Record<GroupLetter, [number, number]>,
    venueIds: number[],
    roundOf16Template: [GroupLetter, GroupLetter][],
): Promise<{ championTeamId: number; allMatches: MatchSummary[] }> {
    const bracketSize = roundOf16Template.length * 2; // 16 khi có 8 cặp round 1
    const totalRounds = Math.log2(bracketSize);
    if (!Number.isInteger(totalRounds)) {
        throw new Error(
            `seedKnockoutBracket: roundOf16Template có ${roundOf16Template.length} cặp — bracketSize ${bracketSize} không phải lũy thừa của 2`,
        );
    }

    const phase = await db.phase.create({
        data: {
            season_id: seasonId,
            name: "Vòng loại trực tiếp",
            type: PhaseType.round_of_16, // ~ BRACKET_SIZE_TO_PHASE_TYPE[16] ở service thật
            format: PhaseFormat.knockout,
            status: PhaseStatus.draft,
            order: 2,
            legs: 1,
        },
    });

    // ── Round 1: slot có sẵn 2 đội (seeded_home/away_team_id) từ topTwoByGroup ──
    const slotIdByRoundNum = new Map<string, number>();
    for (let i = 0; i < roundOf16Template.length; i++) {
        const pairing = roundOf16Template[i];
        if (!pairing) throw new Error(`roundOf16Template thiếu cặp ở vị trí ${i}`);
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

    // ── Round 2..totalRounds: tạo slot rỗng trước, link source_a/b_slot_id ──
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

    // ── Đá từng round, propagate winner lên slot cha — mirror propagateWinner() ──
    const allMatches: MatchSummary[] = [];
    let semiFinalResults: PlayedMatch[] = [];
    let championTeamId: number | null = null;

    for (let round = 1; round <= totalRounds; round++) {
        const slotsInRound = bracketSize / Math.pow(2, round);
        const roundResults: PlayedMatch[] = [];

        for (let slotNum = 1; slotNum <= slotsInRound; slotNum++) {
            const slotId = slotIdByRoundNum.get(`${round}:${slotNum}`);
            if (!slotId) throw new Error(`Thiếu slot ${round}:${slotNum}`);

            const slot = await db.bracketSlot.findUniqueOrThrow({
                where: { id: slotId },
                select: { id: true, seeded_home_team_id: true, seeded_away_team_id: true },
            });
            if (slot.seeded_home_team_id == null || slot.seeded_away_team_id == null) {
                throw new Error(`Slot ${round}:${slotNum} chưa đủ 2 đội trước khi đá — propagate ở round trước bị lỗi`);
            }

            const played = await playAndRecordMatch(
                db,
                phase.id,
                round,
                slot.seeded_home_team_id,
                slot.seeded_away_team_id,
                pickOrThrow(venueIds, "venueIds"),
            );
            await db.bracketSlot.update({ where: { id: slotId }, data: { match_id: played.matchId } });

            roundResults.push(played);
            allMatches.push(toMatchSummary(played));
            if (round === totalRounds) championTeamId = played.winnerTeamId;

            if (round < totalRounds) {
                const parentSlotNum = Math.ceil(slotNum / 2);
                const parentSlotId = slotIdByRoundNum.get(`${round + 1}:${parentSlotNum}`);
                if (!parentSlotId) throw new Error(`Thiếu slot cha ${round + 1}:${parentSlotNum}`);
                const isSourceA = slotNum % 2 === 1;
                await db.bracketSlot.update({
                    where: { id: parentSlotId },
                    data: isSourceA
                        ? { seeded_home_team_id: played.winnerTeamId }
                        : { seeded_away_team_id: played.winnerTeamId },
                });
            }
        }

        if (round === totalRounds - 1) semiFinalResults = roundResults; // vòng áp chót = bán kết
        console.log(`[KnockoutSeeder] Round ${round}/${totalRounds} xong — Phase #${phase.id}`);
    }

    if (championTeamId == null) throw new Error("Không xác định được đội vô địch — final round không chạy");

    // ── Tranh hạng 3: KHÔNG thuộc cây bracket_slots (generateKnockoutBracket
    // thật không tự sinh phase này) — vẫn giữ 1 phase riêng, 1 trận độc lập
    // giữa 2 đội thua bán kết. Bỏ qua nếu bracket quá nhỏ để có bán kết
    // (bracketSize=2 → totalRounds=1 → không có vòng bán kết).
    if (totalRounds >= 2 && semiFinalResults.length >= 2) {
        const sf1 = semiFinalResults[0];
        const sf2 = semiFinalResults[1];
        if (!sf1 || !sf2) throw new Error("Thiếu kết quả bán kết để tạo trận tranh hạng 3");

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
        const thirdPlaceMatch = await playAndRecordMatch(
            db,
            thirdPlacePhase.id,
            1,
            sf1.loserTeamId,
            sf2.loserTeamId,
            pickOrThrow(venueIds, "venueIds"),
        );
        allMatches.push(toMatchSummary(thirdPlaceMatch));
        console.log(`[KnockoutSeeder] Tranh hạng 3 xong — Phase #${thirdPlacePhase.id}`);
    } else {
        console.log(`[KnockoutSeeder] Bỏ qua tranh hạng 3 — bracket chỉ có ${totalRounds} vòng, không có bán kết.`);
    }

    console.log(`[KnockoutSeeder] 🏆 Vô địch: team #${championTeamId}`);

    return { championTeamId, allMatches };
}