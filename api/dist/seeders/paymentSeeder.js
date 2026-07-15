// prisma/seed/paymentSeeder.ts
import { PaymentStatus, Prisma } from "../generated/prisma/client.js";
import { randInt } from "./helperSeeder.js";
const REGISTRATION_FEE = 5_000_000; // VND, giống registration_fee khai trong Season
// Trọng số mặc định — giống hành vi gốc (85% confirmed / 10% pending / 5% refunded),
// KHÔNG có rejected/refund_pending (bản gốc thiếu 2 trạng thái này trong enum PaymentStatus).
const DEFAULT_WEIGHTS = {
    confirmed: 0.85,
    pending: 0.1,
    rejected: 0,
    refund_pending: 0,
    refunded: 0.05,
};
function rollStatus(weights) {
    const entries = [
        [PaymentStatus.confirmed, weights.confirmed],
        [PaymentStatus.pending, weights.pending],
        [PaymentStatus.rejected, weights.rejected],
        [PaymentStatus.refund_pending, weights.refund_pending],
        [PaymentStatus.refunded, weights.refunded],
    ];
    const total = entries.reduce((s, [, w]) => s + w, 0);
    if (total <= 0)
        return PaymentStatus.pending;
    let roll = Math.random() * total;
    for (const [status, w] of entries) {
        if (roll < w)
            return status;
        roll -= w;
    }
    return PaymentStatus.pending;
}
/**
 * NEW: mở rộng so với bản gốc — nhận `weights` tuỳ chỉnh để có thể sinh đủ
 * CẢ 5 giá trị PaymentStatus (bản gốc chỉ tạo confirmed/pending/refunded,
 * thiếu hẳn rejected và refund_pending — 2 trạng thái schema có định nghĩa
 * nhưng chưa từng xuất hiện trong dữ liệu seed). amountOverride cho phép
 * dùng registration_fee thực tế của từng Season thay vì hardcode 1 mức phí
 * chung cho mọi giải.
 */
export async function seedPayments(db, seasonTeamIdByTeamId, weights = DEFAULT_WEIGHTS, amountOverride) {
    const seasonTeamIds = Object.values(seasonTeamIdByTeamId);
    let created = 0;
    const amount = amountOverride ?? REGISTRATION_FEE;
    for (const seasonTeamId of seasonTeamIds) {
        const existing = await db.payment.findFirst({ where: { season_team_id: seasonTeamId } });
        if (existing)
            continue;
        const status = rollStatus(weights);
        const paidAt = status === PaymentStatus.pending ? null : new Date(Date.now() - randInt(5, 60) * 86400000);
        await db.payment.create({
            data: {
                season_team_id: seasonTeamId,
                amount: new Prisma.Decimal(amount),
                status,
                transaction_ref: `SEED-TXN-${seasonTeamId}-${Date.now()}-${randInt(1000, 9999)}`,
                paid_at: paidAt,
                confirmed_at: status === PaymentStatus.confirmed ? paidAt : null,
                refunded_at: status === PaymentStatus.refunded ? new Date() : status === PaymentStatus.refund_pending ? null : null,
                refund_amount: status === PaymentStatus.refunded || status === PaymentStatus.refund_pending ? amount : null,
            },
        });
        created++;
    }
    console.log(`[PaymentSeeder] tạo ${created} Payment`);
}
/** Trọng số dùng riêng cho các mùa giải "messy"/registration/cancelled — rải đều cả 5 trạng thái. */
export const FULL_SPREAD_WEIGHTS = {
    confirmed: 0.4,
    pending: 0.25,
    rejected: 0.15,
    refund_pending: 0.1,
    refunded: 0.1,
};
//# sourceMappingURL=paymentSeeder.js.map