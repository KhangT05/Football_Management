import { PrismaClient, SeasonStatus, PitchType } from "../generated/prisma/client.js";
import type { VenueSeed } from "./teamGenerator.js";
export interface SeasonSeedResult {
    seasonId: number;
    venueIds: number[];
    seasonTeamIdByTeamId: Record<number, number>;
}
export declare function seedVenues(db: PrismaClient, venues: VenueSeed[]): Promise<number[]>;
export interface SeasonConfig {
    name: string;
    tournamentId: number;
    tournamentRuleId: number;
    organizerUserId: number;
    maxTeams: number;
    groupCount: number;
    status: SeasonStatus;
    isRegistrationOpen: boolean;
    registrationDeadline?: Date | null;
    startDate?: Date | null;
    endDate?: Date | null;
    registrationFee?: number;
    cancelReason?: string | null;
    pitchType?: PitchType;
    description?: string;
    registerAllTeams?: boolean;
}
/**
 * FIX (multi-season): bản gốc hardcode tên "World Cup Season", status luôn
 * "ongoing", is_registration_open luôn false, và LUÔN đăng ký toàn bộ đội
 * ngay lập tức — chỉ mô phỏng được đúng 1 kiểu mùa giải "đang đá dở, mọi đội
 * đã duyệt". Giờ nhận SeasonConfig tường minh để mô phỏng đủ 5 giá trị của
 * SeasonStatus (upcoming/registration_open/ongoing/finished/cancelled) và
 * tách rời bước "tạo Season" khỏi bước "đăng ký đội" (registerAllTeams).
 */
export declare function seedSeasonConfigurable(db: PrismaClient, config: SeasonConfig, teamIdByName: Record<string, number>, venues: VenueSeed[]): Promise<SeasonSeedResult>;
/**
 * Giữ nguyên chữ ký/hành vi cũ (tương thích ngược) cho bất kỳ code nào còn
 * gọi seedSeason() trực tiếp — tương đương seedSeasonConfigurable với
 * status=ongoing, registerAllTeams=true, tên "World Cup Season".
 */
export declare function seedSeason(db: PrismaClient, tournamentId: number, tournamentRuleId: number, organizerUserId: number, teamIdByName: Record<string, number>, venues: VenueSeed[]): Promise<SeasonSeedResult>;
//# sourceMappingURL=seasonSeeder.d.ts.map