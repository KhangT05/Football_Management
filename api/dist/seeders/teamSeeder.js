import { atOrThrow } from "./helperSeeder.js";
/**
 * Tạo Team theo danh sách `teamNames` truyền vào (từ teamGenerator.generateTeamNames()).
 * Nếu đã tồn tại (chạy seed lại) thì tái sử dụng — idempotent qua upsert theo `name`.
 * adminUserId dùng làm user sở hữu Team (Team.user_id).
 */
export async function seedTeams(db, adminUserId, teamNames) {
    if (teamNames.length === 0) {
        throw new Error("seedTeams: teamNames rỗng — kiểm tra lại teamGenerator.generateTeamNames()");
    }
    const teamIdByName = {};
    for (const name of teamNames) {
        const team = await db.team.upsert({
            where: { name },
            update: {},
            create: {
                name,
                coach_name: `HLV trưởng ${name}`,
                user_id: adminUserId,
            },
        });
        teamIdByName[name] = team.id;
    }
    console.log(`[TeamSeeder] seeded ${Object.keys(teamIdByName).length} teams`);
    return { teamIdByName };
}
export async function seedTeamLeadersFromExistingUsers(db, teamIdByName) {
    const leaderUsers = await db.user.findMany({
        where: { user_roles: { some: { role: { name: "leader" } } } },
        select: { id: true, email: true },
    });
    const teamIds = Object.values(teamIdByName);
    let assigned = 0;
    const pairCount = Math.min(leaderUsers.length, teamIds.length);
    for (let i = 0; i < pairCount; i++) {
        const teamId = atOrThrow(teamIds, i, "seedTeamLeadersFromExistingUsers teamIds");
        const leader = atOrThrow(leaderUsers, i, "seedTeamLeadersFromExistingUsers leaderUsers");
        const exists = await db.teamLeader.findFirst({
            where: { team_id: teamId, user_id: leader.id },
        });
        if (exists)
            continue;
        await db.teamLeader.create({
            data: { team_id: teamId, user_id: leader.id },
        });
        assigned++;
    }
    console.log(`[TeamSeeder] assigned ${assigned} TeamLeader từ user thật (còn lại chưa có leader)`);
}
//# sourceMappingURL=teamSeeder.js.map