// prisma/seed/paymentSeeder.ts
import { PaymentStatus } from "../generated/prisma/client.js";
import { randInt } from "./helperSeeder.js";
const REGISTRATION_FEE = 5_000_000; // VND, giống registration_fee khai trong Season
export async function seedPayments(db, seasonTeamIdByTeamId) {
    const seasonTeamIds = Object.values(seasonTeamIdByTeamId);
    let created = 0;
    for (const seasonTeamId of seasonTeamIds) {
        const existing = await db.payment.findFirst({ where: { season_team_id: seasonTeamId } });
        if (existing)
            continue;
        // 85% đã confirmed, 10% pending, 5% refunded — mô phỏng thực tế
        const roll = Math.random();
        const status = roll < 0.85 ? PaymentStatus.confirmed : roll < 0.95 ? PaymentStatus.pending : PaymentStatus.refunded;
        const paidAt = status === PaymentStatus.pending ? null : new Date(Date.now() - randInt(5, 60) * 86400000);
        await db.payment.create({
            data: {
                season_team_id: seasonTeamId,
                amount: REGISTRATION_FEE,
                status,
                transaction_ref: `SEED-TXN-${seasonTeamId}-${Date.now()}-${randInt(1000, 9999)}`,
                paid_at: paidAt,
                confirmed_at: status === PaymentStatus.confirmed ? paidAt : null,
                refunded_at: status === PaymentStatus.refunded ? new Date() : null,
                refund_amount: status === PaymentStatus.refunded ? REGISTRATION_FEE : null,
            },
        });
        created++;
    }
    console.log(`[PaymentSeeder] tạo ${created} Payment`);
}
//# sourceMappingURL=paymentSeeder.js.map