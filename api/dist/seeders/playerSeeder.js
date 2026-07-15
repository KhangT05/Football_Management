import { PlayerPosition } from "../generated/prisma/client.js";
import { pickOrThrow, randInt } from "./helperSeeder.js";
const POSITIONS = [
    PlayerPosition.goalkeeper,
    PlayerPosition.defender,
    PlayerPosition.midfielder,
    PlayerPosition.forward,
];
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
export async function seedPlayersFromExistingUsers(db, classIdByName) {
    const playerRoleUsers = await db.user.findMany({
        where: { user_roles: { some: { role: { name: "player" } } } },
        select: { id: true, email: true, player: true, class_id: true, student_code: true },
    });
    const classIds = Object.values(classIdByName);
    if (classIds.length === 0) {
        throw new Error("seedPlayersFromExistingUsers: classIdByName rỗng — cần chạy seedClasses trước");
    }
    const result = {};
    let studentSeq = 1;
    for (let i = 0; i < playerRoleUsers.length; i++) {
        const u = playerRoleUsers[i];
        if (u.class_id === null || u.student_code === null) {
            const classId = pickOrThrow(classIds, "playerSeeder classIds");
            const studentCode = u.student_code ?? `SV${String(studentSeq).padStart(5, "0")}`;
            studentSeq++;
            await db.user.update({
                where: { id: u.id },
                data: {
                    class_id: u.class_id ?? classId,
                    student_code: studentCode,
                },
            });
        }
        if (u.player) {
            result[u.email] = u.player.id;
            continue;
        }
        const player = await db.player.create({
            data: {
                user_id: u.id,
                date_of_birth: new Date(randInt(1995, 2006), randInt(0, 11), randInt(1, 28)),
                position: pickOrThrow(POSITIONS, "playerSeeder POSITIONS"),
                nationality: "Vietnam",
            },
        });
        result[u.email] = player.id;
        console.log(`[PlayerSeeder] linked Player #${player.id} <- User ${u.email}`);
    }
    return result;
}
//# sourceMappingURL=playerSeeder.js.map