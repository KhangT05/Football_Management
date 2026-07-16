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
 * classIdByName (từ classSeeder.seedClasses, PHẢI chạy trước): đội mồ côi
 * vẫn cần class_id giống mọi Team khác trong hệ thống (đội sinh viên gắn với
 * 1 lớp cụ thể).
 *
 * FIX (P1 — jersey convention mismatch): bản trước gán vị trí theo
 * `positions[jersey % 4]` (round-robin 4 vị trí cơ bản theo thứ tự cố định:
 * GK, DF, MF, FW lặp lại mỗi 4 người) — KHÁC HẲN convention thật của hệ
 * thống. `squadSeeder.seedSquads` dùng `buildSquadPositions()`
 * (helperSeeder.ts): 23 người xếp thành BLOCK liên tục 3 GK (jersey 1-3) + 8
 * DF (4-11) + 8 MF (12-19) + 4 FW (20-23). `matchDetailSeeder.splitStartersSubs`
 * đọc ngược lại đúng theo block đó (`jersey<=3` -> GK, `4-11` -> DF,
 * `12-19` -> MF, `>=20` -> FW) để dựng đội hình ra sân.
 *
 * Nếu orphan team (squadSize >= 11) từng được lịch vào 1 trận thật, 2
 * convention lệch nhau sẽ khiến `splitStartersSubs` gán sai vị trí thực tế:
 * jersey #4 ở orphan team là DF theo modulo-4 nhưng `matchDetailSeeder` vẫn
 * coi #4 là DF (đúng ở biên này) — nhưng jersey #5 modulo-4 lại là GK (vì
 * `positions[5%4]=positions[1]=DF`... thực chất mọi vị trí modulo-4 lệch
 * hoàn toàn khỏi block 3/8/8/4 ngay từ jersey #4 trở đi) trong khi
 * `matchDetailSeeder` coi #5-11 đều là DF — kết quả: cầu thủ đăng ký vị trí
 * X (Player.position) có thể bị xếp đá ở vị trí khác trên sân
 * (MatchLineup.position lấy theo TeamPlayer.position, TeamPlayer.position
 * lại lấy theo convention modulo-4 sai). Fix: dùng chung
 * `buildSquadPositions()` như squadSeeder để 2 nơi luôn khớp nhau.
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