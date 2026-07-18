// prisma/seed/edgeCaseUserSeeder.ts
//
// tập hợp các trạng thái "dữ liệu chưa hoàn thiện" ở mức
// User/Team/SeasonTeam/TeamPlayer mà pipeline gốc không tạo ra.
//
// PHÂN CHIA TRÁCH NHIỆM (tránh trùng logic giữa các seeder file):
//   - squadSeeder.ts       : XÂY roster (số lượng, vị trí, jersey) — kể cả
//                            case thiếu người (seedBoundarySquad,
//                            seedGoalkeeperlessSquad) và chuyển nhượng
//                            (seedMidSeasonTransfer).
//   - edgeCaseUserSeeder.ts: trạng thái IDENTITY/REGISTRATION lệch chuẩn
//                            (role không gắn thực thể, tài khoản bất thường,
//                            approval/status desync trên roster có sẵn).
//   - matchDetailSeeder.ts : trạng thái TRẬN ĐẤU bất thường (forfeit,
//                            abandoned, disputed result).
//
// Vì roster (TeamPlayer) unique theo season_team_id (@@unique([season_team_id,
// jersey_number]) / ([season_team_id, player_id])) — KHÔNG có team_id trên
// TeamPlayer — "team chưa đủ người" hay "team thiếu vị trí" chỉ có ý nghĩa
// trong ngữ cảnh 1 season cụ thể. seedUnderStaffedSeasonTeam bên dưới vì vậy
// chỉ là 1 wrapper mỏng gọi squadSeeder.seedBoundarySquad, không tự build lại.
import bcrypt from "bcrypt";
import {
    PrismaClient,
    PlayerPosition,
    PlayerRole,
    ApprovalStatus,
    PlayerStatus,
} from "../generated/prisma/client.js";
import { randInt, pickOrThrow } from "./helperSeeder.js";
import { seedBoundarySquad } from "./squadSeeder.js";
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
 * Tạo 1 Team KHÔNG đăng ký vào season nào — đội tồn tại trong hệ thống (có
 * HLV) nhưng chưa từng đăng ký giải. FIX: bản trước còn seed luôn TeamPlayer
 * cho đội này bằng team_id — sai vì TeamPlayer chỉ tồn tại trong ngữ cảnh
 * season_team_id. Team chưa đăng ký season thì KHÔNG THỂ có roster hợp lệ
 * theo schema hiện tại — nên bản này chỉ tạo Team, không tạo squad.
 *
 * Nếu cần test "team đăng ký nhưng thiếu người", dùng
 * seedUnderStaffedSeasonTeam bên dưới (cần season_team_id thật, tức là team
 * ĐÃ đăng ký season, chỉ là chưa đủ người).
 */
export async function seedUnregisteredTeam(
    db: PrismaClient,
    adminUserId: number,
    teamName: string,
    classIdByName: Record<string, number>
): Promise<number> {
    const classIds = Object.values(classIdByName);
    if (classIds.length === 0) {
        throw new Error("seedUnregisteredTeam: classIdByName rỗng — cần chạy seedClasses trước");
    }
    const classId = pickOrThrow(classIds, "seedUnregisteredTeam classIds");

    const team = await db.team.upsert({
        where: { name: teamName },
        update: {},
        create: { name: teamName, coach_name: `HLV trưởng ${teamName}`, user_id: adminUserId, class_id: classId },
    });

    console.log(`[EdgeCaseUserSeeder] Team "${teamName}" (#${team.id}): tồn tại nhưng KHÔNG đăng ký season nào, không có roster.`);
    return team.id;
}

/**
 * Team ĐÃ đăng ký season (có season_team_id thật) nhưng số người dưới
 * min_players_per_team của TournamentRule (default 7). Chỉ là wrapper gọi
 * squadSeeder.seedBoundarySquad — không tự build lại logic vị trí ở đây,
 * tránh 2 nguồn sự thật cho cùng 1 việc "sinh roster".
 */
export async function seedUnderStaffedSeasonTeam(
    db: PrismaClient,
    seasonTeamId: number,
    teamNameForEmail: string,
    squadSize: number
): Promise<void> {
    await seedBoundarySquad(db, seasonTeamId, teamNameForEmail, squadSize);
    console.log(`[EdgeCaseUserSeeder] season_team #${seasonTeamId} (${teamNameForEmail}): ${squadSize} người — dưới mức tối thiểu.`);
}

/**
 * Đánh dấu ngẫu nhiên vài TeamPlayer trong 1 season_team sang trạng thái
 * chưa hoàn thiện: approval_status pending/rejected, status injured/suspended.
 * FIX: bản trước filter theo team_id (không tồn tại) — đổi sang season_team_id.
 */
export async function seedIncompleteApprovalStates(db: PrismaClient, seasonTeamId: number): Promise<void> {
    const squad = await db.teamPlayer.findMany({ where: { season_team_id: seasonTeamId }, orderBy: { jersey_number: "asc" } });
    if (squad.length === 0) return;

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
        `[EdgeCaseUserSeeder] season_team #${seasonTeamId}: ${pendingCount} pending, ${rejectedCount} rejected, ` +
        `${injuredCount} injured, ${suspendedCount} suspended (trên ${squad.length} cầu thủ).`
    );
}

// ============================================================
// EDGE CASES MỚI — identity/registration
// ============================================================

/**
 * User giữ đồng thời 2 role (player + leader) — hệ thống cho phép 1 user
 * nhiều role (User_Role là bảng nhiều-nhiều) nhưng flow UI/business logic
 * thường viết theo giả định 1 user = 1 role chủ đạo. Case này lộ ra chỗ
 * nào code đang implicit-assume single-role (vd: dashboard redirect theo
 * role đầu tiên tìm thấy, permission check thiếu OR-logic giữa các role).
 */
export async function seedRoleStackedUser(
    db: PrismaClient,
    roleMap: Record<RoleName, number>,
    label: string
): Promise<number> {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    const email = `role-stacked.${label}@fifa-seed.local`;

    const user = await db.user.upsert({
        where: { email },
        update: {},
        create: {
            name: `User đa vai trò ${label}`,
            email,
            password: passwordHash,
            email_verified: true,
            email_verified_at: new Date(),
            user_roles: { create: [{ role_id: roleMap.player }, { role_id: roleMap.leader }] },
        },
    });

    const player = await db.player.upsert({
        where: { user_id: user.id },
        update: {},
        create: { user_id: user.id, date_of_birth: new Date(1999, 5, 15), position: PlayerPosition.midfielder, nationality: "Vietnam" },
    });

    console.log(`[EdgeCaseUserSeeder] role-stacked user #${user.id} (player #${player.id}) — vừa là player vừa là leader.`);
    return user.id;
}

/**
 * User bị khoá (is_active=false) nhưng vẫn còn TeamPlayer status=active
 * trong 1 season_team đang thi đấu. Không có FK/constraint nào tự động
 * đồng bộ User.is_active với TeamPlayer.status — nếu login bị chặn ở tầng
 * auth nhưng match-day lineup validation không check User.is_active (chỉ
 * check TeamPlayer.status/approval_status), cầu thủ này vẫn được xếp đá dù
 * tài khoản đã khoá. Dùng để test đúng lớp nào PHẢI check is_active.
 */
export async function seedInactiveUserWithLiveRoster(
    db: PrismaClient,
    seasonTeamId: number,
    label: string,
    jerseyNumber: number
): Promise<void> {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    const email = `inactive-user.${label}@fifa-seed.local`;

    const user = await db.user.upsert({
        where: { email },
        update: { is_active: false },
        create: {
            name: `User bị khoá ${label}`,
            email,
            password: passwordHash,
            email_verified: true,
            email_verified_at: new Date(),
            is_active: false,
        },
    });

    const player = await db.player.upsert({
        where: { user_id: user.id },
        update: {},
        create: { user_id: user.id, date_of_birth: new Date(2000, 2, 10), position: PlayerPosition.defender, nationality: "Vietnam" },
    });

    await db.teamPlayer.upsert({
        where: { season_team_id_jersey_number: { season_team_id: seasonTeamId, jersey_number: jerseyNumber } },
        update: {},
        create: {
            season_team_id: seasonTeamId,
            player_id: player.id,
            jersey_number: jerseyNumber,
            position: PlayerPosition.defender,
            role: PlayerRole.player,
            status: PlayerStatus.active, // cố tình active dù user đã bị khoá — đây là điểm lệch cần test
            approval_status: ApprovalStatus.approved,
        },
    });

    console.log(`[EdgeCaseUserSeeder] user #${user.id} bị khoá (is_active=false) nhưng vẫn active trong season_team #${seasonTeamId}.`);
}

/**
 * User email chưa verify nhưng đã được đưa vào roster ở trạng thái pending —
 * mô phỏng luồng: leader thêm cầu thủ vào danh sách trước khi cầu thủ đó tự
 * verify email tài khoản. Test: approval flow có vô tình auto-approve user
 * chưa verify hay không (2 khái niệm "chưa xác thực" khác nhau: email
 * verification vs squad approval — dễ bị lẫn lộn khi review code).
 */
export async function seedUnverifiedEmailPendingPlayer(
    db: PrismaClient,
    seasonTeamId: number,
    label: string,
    jerseyNumber: number
): Promise<void> {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    const email = `unverified.${label}@fifa-seed.local`;

    const user = await db.user.upsert({
        where: { email },
        update: {},
        create: { name: `User chưa verify email ${label}`, email, password: passwordHash, email_verified: false },
    });

    const player = await db.player.upsert({
        where: { user_id: user.id },
        update: {},
        create: { user_id: user.id, date_of_birth: new Date(2001, 8, 20), position: PlayerPosition.forward, nationality: "Vietnam" },
    });

    await db.teamPlayer.upsert({
        where: { season_team_id_jersey_number: { season_team_id: seasonTeamId, jersey_number: jerseyNumber } },
        update: {},
        create: {
            season_team_id: seasonTeamId,
            player_id: player.id,
            jersey_number: jerseyNumber,
            position: PlayerPosition.forward,
            role: PlayerRole.player,
            status: PlayerStatus.active,
            approval_status: ApprovalStatus.pending,
        },
    });

    console.log(`[EdgeCaseUserSeeder] user #${user.id} (email chưa verify) — TeamPlayer pending trong season_team #${seasonTeamId}.`);
}