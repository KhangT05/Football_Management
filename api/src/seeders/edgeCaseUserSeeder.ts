// prisma/seed/edgeCaseUserSeeder.ts
//
// NEW FILE — tập hợp các trạng thái "dữ liệu chưa hoàn thiện" ở mức
// User/Team/Player mà pipeline gốc không tạo ra:
//   - User có role "leader" nhưng CHƯA từng được gán làm TeamLeader của đội nào.
//   - User có role "player" nhưng CHƯA từng có TeamPlayer (Player mồ côi).
//   - Team được tạo (đăng ký giải) nhưng CHƯA đủ 11 cầu thủ tối thiểu để đá.
//   - Team tồn tại nhưng KHÔNG đăng ký vào bất kỳ Season nào (đội "ngoài giải").
//   - TeamPlayer với approval_status=pending/rejected và status=injured/suspended
//     (bản gốc luôn hardcode approved/active).
import bcrypt from "bcrypt";
import { PrismaClient, PlayerPosition, PlayerRole, ApprovalStatus, PlayerStatus } from "../generated/prisma/client.js";
import { randInt, pickOrThrow } from "./helperSeeder.js";
import type { RoleName } from "./roleSeeder.js";

const BCRYPT_ROUNDS = 12;
const DEFAULT_PASSWORD = "EdgeCase@123456";

export interface OrphanLeader {
    userId: number;
    email: string;
}

/** Tạo N user role=leader nhưng KHÔNG gán TeamLeader — mô phỏng "đăng ký làm trưởng đoàn nhưng chưa lập đội". */
export async function seedOrphanLeaders(
    db: PrismaClient,
    roleMap: Record<RoleName, number>,
    count: number
): Promise<OrphanLeader[]> {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    const result: OrphanLeader[] = [];

    for (let i = 1; i <= count; i++) {
        const email = `leader.chua-lap-doi.${i}@fifa-seed.local`;
        const user = await db.user.upsert({
            where: { email },
            update: {},
            create: {
                name: `Trưởng đoàn chờ lập đội ${i}`,
                email,
                password: passwordHash,
                email_verified: true,
                email_verified_at: new Date(),
                user_roles: { create: [{ role_id: roleMap.leader }] },
            },
        });
        result.push({ userId: user.id, email });
    }

    console.log(`[EdgeCaseUserSeeder] tạo ${result.length} leader "mồ côi" (chưa gắn đội nào)`);
    return result;
}

/** Tạo N user role=player + Player row NHƯNG không đưa vào bất kỳ TeamPlayer nào — cầu thủ tự do. */
export async function seedFreeAgentPlayers(
    db: PrismaClient,
    roleMap: Record<RoleName, number>,
    count: number
): Promise<number[]> {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    const playerIds: number[] = [];

    for (let i = 1; i <= count; i++) {
        const email = `free-agent.${i}@fifa-seed.local`;
        const user = await db.user.upsert({
            where: { email },
            update: {},
            create: {
                name: `Cầu thủ tự do ${i}`,
                email,
                password: passwordHash,
                email_verified: true,
                email_verified_at: new Date(),
                user_roles: { create: [{ role_id: roleMap.player }] },
            },
        });

        const player = await db.player.upsert({
            where: { user_id: user.id },
            update: {},
            create: {
                user_id: user.id,
                date_of_birth: new Date(randInt(1996, 2007), randInt(0, 11), randInt(1, 28)),
                position: [PlayerPosition.goalkeeper, PlayerPosition.defender, PlayerPosition.midfielder, PlayerPosition.forward][
                    randInt(0, 3)
                ] as PlayerPosition,
                nationality: "Vietnam",
            },
        });
        playerIds.push(player.id);
    }

    console.log(`[EdgeCaseUserSeeder] tạo ${playerIds.length} cầu thủ tự do (chưa thuộc đội nào)`);
    return playerIds;
}

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
export async function seedOrphanTeam(
    db: PrismaClient,
    adminUserId: number,
    teamName: string,
    squadSize: number,
    classIdByName: Record<string, number>
): Promise<number> {
    const classIds = Object.values(classIdByName);
    if (classIds.length === 0) {
        throw new Error("seedOrphanTeam: classIdByName rỗng — cần chạy seedClasses trước seedOrphanTeam");
    }
    const classId = pickOrThrow(classIds, "seedOrphanTeam classIds");

    const team = await db.team.upsert({
        where: { name: teamName },
        update: {},
        create: { name: teamName, coach_name: `HLV trưởng ${teamName}`, user_id: adminUserId, class_id: classId },
    });

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    const positions = [PlayerPosition.goalkeeper, PlayerPosition.defender, PlayerPosition.midfielder, PlayerPosition.forward];

    const already = await db.teamPlayer.count({ where: { team_id: team.id } });
    for (let jersey = already + 1; jersey <= squadSize; jersey++) {
        const email = `orphan-team.${team.id}.p${jersey}@fifa-seed.local`;
        const user = await db.user.upsert({
            where: { email },
            update: {},
            create: {
                name: `CT dự bị #${jersey}`,
                email,
                password: passwordHash,
                email_verified: true,
                email_verified_at: new Date(),
            },
        });
        const position = positions[jersey % positions.length] as PlayerPosition;
        const player = await db.player.upsert({
            where: { user_id: user.id },
            update: {},
            create: { user_id: user.id, date_of_birth: new Date(2001, 0, 1), position, nationality: teamName },
        });
        await db.teamPlayer.upsert({
            where: { team_id_jersey_number: { team_id: team.id, jersey_number: jersey } },
            update: {},
            create: {
                team_id: team.id,
                player_id: player.id,
                jersey_number: jersey,
                position,
                role: PlayerRole.player,
                status: PlayerStatus.active,
                approval_status: ApprovalStatus.pending, // đội mới lập, HLV chưa duyệt xong danh sách
            },
        });
    }

    console.log(`[EdgeCaseUserSeeder] Team mồ côi "${teamName}" (#${team.id}): ${squadSize} cầu thủ, KHÔNG đăng ký season nào.`);
    return team.id;
}

/**
 * Đánh dấu ngẫu nhiên vài TeamPlayer trong 1 đội sang trạng thái chưa hoàn
 * thiện: approval_status pending/rejected, status injured/suspended. Bản gốc
 * (squadSeeder) luôn hardcode approved/active cho MỌI cầu thủ — không có
 * case nào thể hiện quy trình duyệt danh sách đăng ký còn dang dở.
 */
export async function seedIncompleteApprovalStates(db: PrismaClient, teamId: number): Promise<void> {
    const squad = await db.teamPlayer.findMany({ where: { team_id: teamId }, orderBy: { jersey_number: "asc" } });
    if (squad.length === 0) return;

    // ~15% pending, ~5% rejected, phần còn lại giữ approved (đã duyệt) — giống tỉ lệ thực tế.
    let pendingCount = 0;
    let rejectedCount = 0;
    let injuredCount = 0;
    let suspendedCount = 0;

    for (const tp of squad) {
        const roll = Math.random();
        let approvalStatus: ApprovalStatus = ApprovalStatus.approved;
        if (roll < 0.05) {
            approvalStatus = ApprovalStatus.rejected;
            rejectedCount++;
        } else if (roll < 0.2) {
            approvalStatus = ApprovalStatus.pending;
            pendingCount++;
        }

        let status: PlayerStatus = PlayerStatus.active;
        const statusRoll = Math.random();
        if (statusRoll < 0.08) {
            status = PlayerStatus.injured;
            injuredCount++;
        } else if (statusRoll < 0.13) {
            status = PlayerStatus.suspended;
            suspendedCount++;
        }

        if (approvalStatus !== tp.approval_status || status !== tp.status) {
            await db.teamPlayer.update({ where: { id: tp.id }, data: { approval_status: approvalStatus, status } });
        }
    }

    console.log(
        `[EdgeCaseUserSeeder] Team #${teamId}: ${pendingCount} pending, ${rejectedCount} rejected, ` +
        `${injuredCount} injured, ${suspendedCount} suspended (trên ${squad.length} cầu thủ).`
    );
}