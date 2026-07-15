import { atOrThrow } from "./helperSeeder.js";
/**
 * Tạo Team theo danh sách `teamNames` truyền vào (từ teamGenerator.generateTeamNames()).
 * Nếu đã tồn tại (chạy seed lại) thì tái sử dụng — idempotent qua upsert theo `name`.
 * adminUserId dùng làm user sở hữu Team (Team.user_id).
 *
 * classIdByName (từ classSeeder.seedClasses, PHẢI chạy trước): mỗi Team được gán
 * vào 1 Class theo kiểu round-robin (i % số lớp) — không random để lần seed lại
 * cho ra map Team -> Class giống hệt lần trước (dù `update: {}` không đổi field
 * cũ, nhưng nếu sau này thêm update thì vẫn ổn định).
 */
export async function seedTeams(db, adminUserId, teamNames, classIdByName) {
    if (teamNames.length === 0) {
        throw new Error("seedTeams: teamNames rỗng — kiểm tra lại teamGenerator.generateTeamNames()");
    }
    const classIds = Object.values(classIdByName);
    if (classIds.length === 0) {
        throw new Error("seedTeams: classIdByName rỗng — cần chạy seedClasses trước seedTeams");
    }
    const teamIdByName = {};
    for (let i = 0; i < teamNames.length; i++) {
        const name = atOrThrow(teamNames, i, "seedTeams teamNames");
        const classId = atOrThrow(classIds, i % classIds.length, "seedTeams classIds");
        const team = await db.team.upsert({
            where: { name },
            update: {},
            create: {
                name,
                coach_name: `HLV trưởng ${name}`,
                user_id: adminUserId,
                class_id: classId,
            },
        });
        teamIdByName[name] = team.id;
    }
    console.log(`[TeamSeeder] seeded ${Object.keys(teamIdByName).length} teams (đã rải theo ${classIds.length} lớp)`);
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