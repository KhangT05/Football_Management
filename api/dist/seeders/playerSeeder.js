// prisma/seed/playerSeeder.ts
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
 */
export async function seedPlayersFromExistingUsers(db) {
    const playerRoleUsers = await db.user.findMany({
        where: { user_roles: { some: { role: { name: "player" } } } },
        select: { id: true, email: true, player: true },
    });
    const result = {};
    for (const u of playerRoleUsers) {
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