import { PrismaClient } from "../generated/prisma/client.js";
/**
 * Quét toàn bộ MatchLineup + MatchEvent của các trận thuộc season (qua Phase.season_id)
 * rồi cộng dồn thành PlayerStatistic theo player+team+season.
 *
 * Giới hạn: schema không có MatchEventType riêng cho "assist" nên assists giữ = 0
 * (có thể mở rộng thêm enum sau nếu cần track chính xác).
 */
export declare function seedPlayerStatistics(db: PrismaClient, seasonId: number): Promise<void>;
//# sourceMappingURL=playerStatisticSeeder.d.ts.map