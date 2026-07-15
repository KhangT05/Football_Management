import { PrismaClient } from "../generated/prisma/client.js";
import type { RoleName } from "./roleSeeder.js";
export interface OrphanLeader {
    userId: number;
    email: string;
}
/** Tạo N user role=leader nhưng KHÔNG gán TeamLeader — mô phỏng "đăng ký làm trưởng đoàn nhưng chưa lập đội". */
export declare function seedOrphanLeaders(db: PrismaClient, roleMap: Record<RoleName, number>, count: number): Promise<OrphanLeader[]>;
/** Tạo N user role=player + Player row NHƯNG không đưa vào bất kỳ TeamPlayer nào — cầu thủ tự do. */
export declare function seedFreeAgentPlayers(db: PrismaClient, roleMap: Record<RoleName, number>, count: number): Promise<number[]>;
/**
 * Tạo 1 Team mới KHÔNG đăng ký vào season nào — đội tồn tại trong hệ thống
 * (đã có HLV, có thể có vài cầu thủ) nhưng chưa từng tham dự giải đấu nào.
 * Nếu squadSize < 11, đội này cũng minh hoạ luôn case "chưa đủ người đá".
 *
 * NEW classIdByName (từ classSeeder.seedClasses, PHẢI chạy trước): đội mồ côi
 * vẫn cần class_id giống mọi Team khác trong hệ thống (đội sinh viên gắn với
 * 1 lớp cụ thể) — trước đây hàm này tạo Team thiếu field này, khiến đội mồ
 * côi trở thành trường hợp KHÔNG đại diện đúng cho business rule "Team luôn
 * thuộc 1 Class".
 */
export declare function seedOrphanTeam(db: PrismaClient, adminUserId: number, teamName: string, squadSize: number, classIdByName: Record<string, number>): Promise<number>;
/**
 * Đánh dấu ngẫu nhiên vài TeamPlayer trong 1 đội sang trạng thái chưa hoàn
 * thiện: approval_status pending/rejected, status injured/suspended. Bản gốc
 * (squadSeeder) luôn hardcode approved/active cho MỌI cầu thủ — không có
 * case nào thể hiện quy trình duyệt danh sách đăng ký còn dang dở.
 */
export declare function seedIncompleteApprovalStates(db: PrismaClient, teamId: number): Promise<void>;
//# sourceMappingURL=edgeCaseUserSeeder.d.ts.map