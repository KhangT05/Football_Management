import { SeasonTeamStatus } from "../generated/prisma/client.js";
import type { DbClient } from "./dbTypes.js";
export interface RegistrationPlanEntry {
    status: SeasonTeamStatus;
    count: number;
}
export interface PartialRegistrationResult {
    seasonTeamIdByTeamId: Record<number, number>;
    registeredTeamIds: number[];
}
/**
 * Đăng ký MỘT PHẦN các đội vào season theo kế hoạch (status + số lượng),
 * KHÔNG gán group_id (vì group/phase chưa tồn tại ở các archetype này).
 * Chỉ đội có status approved/active mới được xem là "đã chốt tham dự" nên
 * mới có đủ jersey (đội pending/withdrawn thường chưa hoàn tất bước chọn
 * màu áo — đúng luồng đăng ký thật: chọn áo là bước sau khi được duyệt).
 */
export declare function seedPartialRegistrations(db: DbClient, seasonId: number, availableTeamIds: number[], plan: RegistrationPlanEntry[]): Promise<PartialRegistrationResult>;
//# sourceMappingURL=registrationSeeder.d.ts.map