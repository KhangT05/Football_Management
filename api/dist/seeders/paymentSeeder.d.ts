import type { DbClient } from "./dbTypes.js";
export interface PaymentStatusWeights {
    confirmed: number;
    pending: number;
    rejected: number;
    refund_pending: number;
    refunded: number;
}
/**
 * NEW: mở rộng so với bản gốc — nhận `weights` tuỳ chỉnh để có thể sinh đủ
 * CẢ 5 giá trị PaymentStatus (bản gốc chỉ tạo confirmed/pending/refunded,
 * thiếu hẳn rejected và refund_pending — 2 trạng thái schema có định nghĩa
 * nhưng chưa từng xuất hiện trong dữ liệu seed). amountOverride cho phép
 * dùng registration_fee thực tế của từng Season thay vì hardcode 1 mức phí
 * chung cho mọi giải.
 */
export declare function seedPayments(db: DbClient, seasonTeamIdByTeamId: Record<number, number>, weights?: PaymentStatusWeights, amountOverride?: number): Promise<void>;
/** Trọng số dùng riêng cho các mùa giải "messy"/registration/cancelled — rải đều cả 5 trạng thái. */
export declare const FULL_SPREAD_WEIGHTS: PaymentStatusWeights;
//# sourceMappingURL=paymentSeeder.d.ts.map