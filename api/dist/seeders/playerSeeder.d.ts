import { PrismaClient } from "../generated/prisma/client.js";
/**
 * Với MỌI user đang có role "player" (qua User_Role) mà chưa có Player row,
 * tự động tạo Player 1-1 link vào user đó — không cần khai báo tay từng người.
 * Trả về map email -> player_id để các seeder sau (TeamPlayer, ...) dùng lại
 * nếu muốn gán các user "thật" này vào một đội cụ thể.
 */
export declare function seedPlayersFromExistingUsers(db: PrismaClient): Promise<Record<string, number>>;
//# sourceMappingURL=playerSeeder.d.ts.map