import type { DbClient } from "./dbTypes.js";
/**
 * Quét toàn bộ MatchLineup + MatchEvent của các trận thuộc season (qua Phase.season_id)
 * rồi cộng dồn thành PlayerStatistic theo player+team+season. Recompute-from-scratch mỗi
 * lần chạy nên bản thân hàm này idempotent — điều kiện tiên quyết là MatchEvent không bị
 * nhân đôi ở bước trước (xem guard trong matchDetailSeeder.ts).
 *
 * Giới hạn: schema không có MatchEventType riêng cho "assist" nên assists giữ = 0.
 */
export declare function seedPlayerStatistics(db: DbClient, seasonId: number): Promise<void>;
//# sourceMappingURL=playerStatisticSeeder.d.ts.map