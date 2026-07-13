import type { DbClient } from "./dbTypes.js";
/**
 * Quét toàn bộ MatchLineup + MatchEvent của các trận thuộc season (qua Phase.season_id)
 * rồi cộng dồn thành PlayerStatistic theo player+team+season. Recompute-from-scratch mỗi
 * lần chạy nên bản thân hàm này idempotent — điều kiện tiên quyết là MatchEvent không bị
 * nhân đôi ở bước trước (xem guard trong matchDetailSeeder.ts).
 *
 * FIX: match query phải lọc is_active: true — cùng lý do với ScheduleService
 * (xem comment trong groupMatchSeeder.ts/knockoutSeeder.ts). Match rác còn sót
 * từ lần seed cũ bị crash giữa chừng (is_active mặc định false/không set) vẫn
 * nằm trong DB và match phase_id -> season_id, nên nếu không lọc, lineup/event
 * của match rác đó vẫn bị cộng vào matches_played/goals_scored — silent data
 * corruption, không throw, không log warning.
 *
 * Giới hạn: schema không có MatchEventType riêng cho "assist" nên assists giữ = 0.
 */
export declare function seedPlayerStatistics(db: DbClient, seasonId: number): Promise<void>;
//# sourceMappingURL=playerStatisticSeeder.d.ts.map