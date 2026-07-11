import { PrismaClient } from "../generated/prisma/client.js";
/**
 * Sinh đội hình cho TẤT CẢ team trong teamIdByName.
 *
 * existingPlayerIds: danh sách player_id "thật" (từ seedPlayersFromExistingUsers)
 * chưa được gán vào team nào — sẽ được ưu tiên nhét vào các team đầu tiên trước
 * khi sinh thêm player giả để lấp đầy 23 người/đội. Cách này thoả đúng yêu cầu
 * "player tự link sang user" mà không tạo trùng Player cho user đã có sẵn.
 */
export declare function seedSquads(db: PrismaClient, teamIdByName: Record<string, number>, existingPlayerIds?: number[]): Promise<void>;
//# sourceMappingURL=squadSeeder.d.ts.map