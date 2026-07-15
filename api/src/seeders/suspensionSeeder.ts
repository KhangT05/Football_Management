// prisma/seed/suspensionSeeder.ts
//
// NEW FILE — bản gốc có sẵn các cột PlayerStatistic.is_suspended /
// suspension_matches_remaining / total_fine_owed / yellow_cards_since_reset
// nhưng playerStatisticSeeder.ts CHƯA BAO GIỜ ghi giá trị khác 0/false vào
// đó. File này chạy SAU seedPlayerStatistics: với mỗi cầu thủ đã tích luỹ
// đủ thẻ vàng theo TournamentRule.yellow_cards_suspension (hoặc dính thẻ đỏ),
// đánh dấu treo giò + tính tiền phạt theo fine_per_yellow_card/fine_per_red_card.
import { Prisma } from "../generated/prisma/client.js";
import type { DbClient } from "./dbTypes.js";

export interface SuspensionRuleParams {
    yellowCardsSuspension: number;
    suspensionMatchCount: number;
    finePerYellowCard: number;
    finePerRedCard: number;
}

export async function applySuspensionsAndFines(
    db: DbClient,
    seasonId: number,
    rule: SuspensionRuleParams
): Promise<void> {
    const stats = await db.playerStatistic.findMany({ where: { season_id: seasonId } });

    let suspendedCount = 0;
    let finedCount = 0;

    for (const s of stats) {
        const shouldSuspend =
            s.yellow_cards_since_reset >= rule.yellowCardsSuspension || s.red_cards > 0;

        const fine =
            s.yellow_cards * rule.finePerYellowCard + s.red_cards * rule.finePerRedCard;

        const data: {
            is_suspended?: boolean;
            suspension_matches_remaining?: number;
            yellow_cards_since_reset?: number;
            total_fine_owed?: Prisma.Decimal;
        } = {};

        if (shouldSuspend) {
            data.is_suspended = true;
            data.suspension_matches_remaining = rule.suspensionMatchCount;
            // Reset driver tích luỹ thẻ vàng sau khi án treo giò được kích hoạt —
            // đúng theo comment thiết kế sẵn trong schema (yellow_cards_since_reset
            // là driver RIÊNG cho suspension, tách khỏi yellow_cards thống kê tổng).
            data.yellow_cards_since_reset = 0;
            suspendedCount++;
        }

        if (fine > 0) {
            data.total_fine_owed = new Prisma.Decimal(fine);
            finedCount++;
        }

        if (Object.keys(data).length > 0) {
            await db.playerStatistic.update({ where: { id: s.id }, data });
        }
    }

    console.log(
        `[SuspensionSeeder] Season #${seasonId}: ${suspendedCount} cầu thủ bị treo giò, ${finedCount} cầu thủ có tiền phạt.`
    );
}