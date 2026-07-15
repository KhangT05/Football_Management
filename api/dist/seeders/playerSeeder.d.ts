import { PrismaClient } from "../generated/prisma/client.js";
/**
 * Với MỌI user đang có role "player" (qua User_Role) mà chưa có Player row,
 * tự động tạo Player 1-1 link vào user đó — không cần khai báo tay từng người.
 * Trả về map email -> player_id để các seeder sau (TeamPlayer, ...) dùng lại
 * nếu muốn gán các user "thật" này vào một đội cụ thể.
 *
 * classIdByName (từ classSeeder.seedClasses, PHẢI chạy trước): mỗi user-player
 * chưa có class_id/student_code sẽ được gán vào 1 lớp (round-robin theo thứ
 * tự user) + sinh student_code tăng dần. Idempotent: user đã có class_id hoặc
 * student_code từ trước thì giữ nguyên field đó, không ghi đè.
 */
export declare function seedPlayersFromExistingUsers(db: PrismaClient, classIdByName: Record<string, number>): Promise<Record<string, number>>;
//# sourceMappingURL=playerSeeder.d.ts.map