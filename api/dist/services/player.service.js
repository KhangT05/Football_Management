import ExcelJS from "exceljs";
import crypto from "node:crypto";
import { importPlayerRowSchema } from "../dtos/player.schema.js";
import { Queryable } from "../libs/queryable.js";
import { createAppError } from "../common/app.error.js";
import { ApprovalStatus, LeaveReason, PlayerPosition, Prisma } from "../generated/prisma/client.js";
import { storageService } from "./storage.service.js";
import { logger } from "../libs/logger.js";
import { PLAYER_PUBLIC_SELECT, PLAYER_SELECT, PLAYER_SELECT_WITH_SEASONS, TEAM_PLAYER_SELECT } from "../types/player.type.js";
import { mailService } from "./mail.service.js";
import redis from "../libs/redis.js";
const MAX_IMPORT_ROWS = 200;
const PLAYER_ROLE_NAME = "player";
const INVITE_TOKEN_TTL_SECONDS = 24 * 60 * 60;
// ----------------------------------------------------------
// IMPORT EXCEL — HỖ TRỢ FILE THUẦN TIẾNG VIỆT
// ----------------------------------------------------------
const IMPORT_HEADER_ALIASES = {
    "họ và tên": "name",
    "họ tên": "name",
    "tên": "name",
    "name": "name",
    "email": "user_email",
    "user_email": "user_email",
    // FIX: thêm alias MSSV — field bắt buộc mới, cần map từ header VN.
    "mssv": "student_code",
    "mã số sinh viên": "student_code",
    "student_code": "student_code",
    "ngày sinh": "date_of_birth",
    "ngày sinh (yyyy-mm-dd)": "date_of_birth",
    "date_of_birth": "date_of_birth",
    "vị trí": "position",
    "position": "position",
    "số áo": "jersey_number",
    "so ao": "jersey_number",
    "jersey_number": "jersey_number",
    "chiều cao": "height",
    "chiều cao (cm)": "height",
    "height": "height",
    "cân nặng": "weight",
    "cân nặng (kg)": "weight",
    "weight": "weight",
    "quốc tịch": "nationality",
    "nationality": "nationality",
};
const IMPORT_POSITION_ALIASES = {
    "gk": PlayerPosition.goalkeeper,
    "thủ môn": PlayerPosition.goalkeeper,
    "goalkeeper": PlayerPosition.goalkeeper,
    "def": PlayerPosition.defender,
    "hậu vệ": PlayerPosition.defender,
    "defender": PlayerPosition.defender,
    "mid": PlayerPosition.midfielder,
    "tiền vệ": PlayerPosition.midfielder,
    "midfielder": PlayerPosition.midfielder,
    "fw": PlayerPosition.forward,
    "tiền đạo": PlayerPosition.forward,
    "forward": PlayerPosition.forward,
};
function normalizeHeaderKey(raw) {
    return raw.trim().toLowerCase().replace(/\s+/g, " ");
}
function normalizePositionValue(raw) {
    if (typeof raw !== "string")
        return raw;
    const key = normalizeHeaderKey(raw);
    return IMPORT_POSITION_ALIASES[key] ?? raw;
}
function normalizeImportRow(raw) {
    const out = {};
    for (const [rawKey, value] of Object.entries(raw)) {
        const mappedKey = IMPORT_HEADER_ALIASES[normalizeHeaderKey(rawKey)];
        if (!mappedKey)
            continue;
        out[mappedKey] = mappedKey === "position" ? normalizePositionValue(value) : value;
    }
    return out;
}
function unwrapCellValue(value) {
    if (value === null || value === undefined)
        return null;
    if (value instanceof Date)
        return value;
    if (typeof value === "object") {
        if ("richText" in value) {
            return value.richText.map((t) => t.text).join("");
        }
        if ("text" in value)
            return value.text;
        if ("result" in value)
            return value.result;
        return null;
    }
    return value;
}
function worksheetToRawRows(ws) {
    const headers = {};
    ws.getRow(1).eachCell({ includeEmpty: false }, (cell, colNumber) => {
        const text = unwrapCellValue(cell.value);
        if (typeof text === "string" && text.trim())
            headers[colNumber] = text.trim();
    });
    const rows = [];
    for (let r = 2; r <= ws.rowCount; r++) {
        const row = ws.getRow(r);
        if (row.cellCount === 0)
            continue;
        const obj = {};
        let hasValue = false;
        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const header = headers[colNumber];
            if (!header)
                return;
            const value = unwrapCellValue(cell.value);
            obj[header] = value;
            if (value !== null && value !== undefined && value !== "")
                hasValue = true;
        });
        if (hasValue)
            rows.push(obj);
    }
    return rows;
}
export class PlayerService {
    prisma;
    teamPlayerQuery;
    playerQuery;
    constructor(prisma) {
        this.prisma = prisma;
        this.teamPlayerQuery = new Queryable(prisma.teamPlayer, {
            select: TEAM_PLAYER_SELECT,
            sortable: ["jersey_number", "id", "created_at"],
            defaultSort: { column: "jersey_number", direction: "asc" },
            filterable: ["position", "status", "approval_status"],
            defaultPerPage: 20,
            maxPerPage: 100,
        });
        this.playerQuery = new Queryable(prisma.player, {
            select: PLAYER_PUBLIC_SELECT,
            sortable: ["id", "created_at", "date_of_birth"],
            defaultSort: { column: "id", direction: "desc" },
            filterable: ["position", "nationality"],
            defaultPerPage: 20,
            maxPerPage: 500,
        });
    }
    toPlayerPublicDto(row) {
        return {
            id: row.id,
            date_of_birth: row.date_of_birth?.toISOString() ?? null,
            position: row.position,
            height: row.height ? Number(row.height) : null,
            weight: row.weight ? Number(row.weight) : null,
            nationality: row.nationality,
            avatar: row.avatar,
            user: { id: row.user.id, name: row.user.name },
        };
    }
    listPlayers(query) {
        return this.playerQuery
            .run(query, {
            beforeBuild: (where) => { where.push({ deleted_at: null }); },
        })
            .then((res) => ({
            ...res,
            data: res.data.map((p) => this.toPlayerPublicDto(p)),
        }));
    }
    // ----------------------------------------------------------
    // PLAYER CRUD
    // ----------------------------------------------------------
    /**
     * FIX (giữ nguyên fix cũ) + FIX MỚI: bắt buộc user.student_code tồn tại
     * trước khi tạo Player — "sinh viên đang học" là điều kiện tiên quyết
     * theo yêu cầu đồ án. Check ở đây (path admin tạo trực tiếp bằng
     * user_id có sẵn) vì đây là entrypoint duy nhất không đi qua
     * createPlayerForTeamWithUser/import (2 path kia tự nhận student_code
     * qua DTO và ghi vào User trước).
     */
    async createPlayer(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.user_id },
            select: { id: true, student_code: true },
        });
        if (!user)
            throw createAppError("NOT_FOUND", `User ${dto.user_id} not found`);
        if (!user.student_code) {
            throw createAppError("BAD_REQUEST", "User chưa có MSSV — không thể tạo hồ sơ cầu thủ");
        }
        const existing = await this.prisma.player.findFirst({
            where: { user_id: dto.user_id, deleted_at: null },
            select: { id: true },
        });
        if (existing) {
            throw createAppError("CONFLICT", `User ${dto.user_id} already has a player profile (id=${existing.id})`);
        }
        const player = await this.prisma.$transaction(async (tx) => {
            const created = await tx.player.create({
                data: dto,
                select: PLAYER_SELECT,
            });
            await this.ensurePlayerRole(dto.user_id, tx);
            return created;
        });
        return this.mapPlayer(player);
    }
    async getPlayerById(id) {
        const player = await this.prisma.player.findFirst({
            where: { id, deleted_at: null },
            select: PLAYER_SELECT_WITH_SEASONS,
        });
        return player ? this.mapPlayerWithSeasons(player) : null;
    }
    mapPlayerWithSeasons(p) {
        const base = this.mapPlayer(p);
        const seasons = p.team_players.map((tp) => ({
            season_id: tp.season_team.season.id,
            season_name: tp.season_team.season.name,
            season_status: tp.season_team.season.status,
            tournament_id: tp.season_team.season.tournament.id,
            tournament_name: tp.season_team.season.tournament.name,
            tournament_logo: tp.season_team.season.tournament.logo,
            group_name: tp.season_team.group?.name ?? null,
            team_id: tp.season_team.team.id,
            team_name: tp.season_team.team.name,
            season_team_status: tp.season_team.status,
            group_id: tp.season_team.group_id,
            jersey_number: tp.jersey_number,
        }));
        return { ...base, seasons };
    }
    async getPlayerByIdOrFail(id) {
        const player = await this.getPlayerById(id);
        if (!player)
            throw createAppError("NOT_FOUND", `Player ${id} not found`);
        return player;
    }
    async updatePlayer(id, dto) {
        const existing = await this.getPlayerByIdOrFail(id);
        storageService.replaceAsset(existing.avatar, dto.avatar, logger);
        const player = await this.prisma.player.update({
            where: { id },
            data: dto,
            select: PLAYER_SELECT,
        });
        return this.mapPlayer(player);
    }
    async softDeletePlayer(id) {
        const existing = await this.getPlayerByIdOrFail(id);
        if (existing.avatar) {
            storageService.replaceAsset(existing.avatar, null, logger);
        }
        await this.prisma.player.update({
            where: { id },
            data: { deleted_at: new Date(), is_active: false },
        });
    }
    // ----------------------------------------------------------
    // ROLE HELPERS
    // ----------------------------------------------------------
    async ensurePlayerRole(userId, tx = this.prisma) {
        const role = await tx.role.findUnique({ where: { name: PLAYER_ROLE_NAME } });
        if (!role) {
            throw createAppError("INTERNAL_SERVER_ERROR", `Role "${PLAYER_ROLE_NAME}" not found — kiểm tra lại seed data bảng roles`);
        }
        await tx.user_Role.upsert({
            where: { user_id_role_id: { user_id: userId, role_id: role.id } },
            create: { user_id: userId, role_id: role.id },
            update: {},
        });
    }
    /**
     * FIX MỚI: class-match giữa User của player và Team đang gán vào.
     * Không FK-enforce được (derived qua User.class_id vs Team.class_id,
     * 2 hop khác bảng) nên validate ở service layer. Gọi TRƯỚC mọi thao
     * tác tạo TeamPlayer, dùng cùng `tx` của caller khi có transaction mở
     * để tránh 1 round-trip riêng ngoài transaction (race giữa check và
     * write nếu class_id của user/team đổi giữa chừng — chấp nhận được ở
     * scale đồ án, nhưng cùng tx vẫn rẻ hơn tách riêng).
     *
     * team.class_id == null (chưa gán lớp / data cũ) -> bỏ qua check để
     * không phá migration path. Enforce cứng sau khi backfill xong bằng
     * cách đổi Team.class_id thành NOT NULL ở schema.
     */
    /**
 * FIX: đọc team.category TRƯỚC — nếu amateur, return ngay, không query User
 * (tránh round-trip thừa). Chỉ team.category === "student" mới enforce
 * student_code + class match.
 */
    /**
 * FIX: nhận teamClassId đã biết thay vì tự query seasonTeam mỗi lần gọi.
 * Trước đây mỗi call query lại team.class_id — trong import loop, giá trị
 * này CỐ ĐỊNH cho toàn bộ request (cùng season_team_id), nên query lặp lại
 * N lần là N-1 lần thừa. Caller chịu trách nhiệm fetch 1 lần duy nhất.
 */
    async assertPlayerClassMatchesUser(teamClassId, userId, tx = this.prisma) {
        if (teamClassId == null)
            return;
        const user = await tx.user.findUniqueOrThrow({
            where: { id: userId },
            select: { class_id: true, student_code: true },
        });
        if (!user.student_code) {
            throw createAppError("BAD_REQUEST", "Tài khoản chưa có MSSV — không thể tham gia đội sinh viên");
        }
        if (user.class_id !== teamClassId) {
            throw createAppError("CONFLICT", "Cầu thủ không thuộc lớp của đội");
        }
    }
    /** Helper fetch teamClassId 1 lần — dùng ở mọi entrypoint gọi assertPlayerClassMatchesUser */
    async getTeamClassId(seasonTeamId, tx = this.prisma) {
        const seasonTeam = await tx.seasonTeam.findUniqueOrThrow({
            where: { id: seasonTeamId },
            select: { team: { select: { class_id: true } } },
        });
        return seasonTeam.team.class_id;
    }
    // ----------------------------------------------------------
    // INVITE TOKEN
    // ----------------------------------------------------------
    inviteKey(tokenHash) {
        return `invite:token:${tokenHash}`;
    }
    async issueInviteToken(userId) {
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        await redis.set(this.inviteKey(tokenHash), String(userId), {
            EX: INVITE_TOKEN_TTL_SECONDS,
        });
        return rawToken;
    }
    async consumeInviteToken(rawToken) {
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const key = this.inviteKey(tokenHash);
        const userId = await redis.get(key);
        if (!userId) {
            throw createAppError("BAD_REQUEST", "Invite token không hợp lệ hoặc đã hết hạn (quá 24h)");
        }
        await redis.del(key);
        return Number(userId);
    }
    async resendInvite(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, password: true },
        });
        if (!user)
            throw createAppError("NOT_FOUND", `User ${userId} not found`);
        if (user.password !== null) {
            throw createAppError("CONFLICT", "User đã đặt mật khẩu, không cần gửi lại lời mời");
        }
        const inviteToken = await this.issueInviteToken(user.id);
        await mailService.sendInviteEmail(user.email, {
            token: inviteToken,
            name: user.name,
        });
    }
    // ----------------------------------------------------------
    // TEAM PLAYER
    // ----------------------------------------------------------
    listTeamPlayers(query) {
        const { season_team_id, ...req } = query;
        return this.teamPlayerQuery
            .run(req, { beforeBuild: (where) => { where.push({ season_team_id }); } })
            .then((res) => ({ ...res, data: res.data.map((tp) => this.mapTeamPlayer(tp)) }));
    }
    async getTeamPlayerById(id, season_team_id) {
        const tp = await this.prisma.teamPlayer.findFirst({
            where: { id, season_team_id },
            select: TEAM_PLAYER_SELECT,
        });
        return tp ? this.mapTeamPlayer(tp) : null;
    }
    async addPlayerToTeam(season_team_id, dto) {
        const player = await this.prisma.player.findFirst({
            where: { id: dto.player_id, deleted_at: null },
            select: { id: true, user_id: true },
        });
        if (!player)
            throw createAppError("NOT_FOUND", `Player ${dto.player_id} not found`);
        const teamClassId = await this.getTeamClassId(season_team_id);
        await this.assertPlayerClassMatchesUser(teamClassId, player.user_id);
        const [dupPlayer, dupJersey] = await Promise.all([
            this.prisma.teamPlayer.findFirst({ where: { season_team_id, player_id: dto.player_id }, select: { id: true } }),
            this.prisma.teamPlayer.findFirst({ where: { season_team_id, jersey_number: dto.jersey_number }, select: { id: true } }),
        ]);
        if (dupPlayer)
            throw createAppError("CONFLICT", "Player already in team");
        if (dupJersey)
            throw createAppError("CONFLICT", `Jersey number ${dto.jersey_number} đã được sử dụng trong đội`);
        try {
            const tp = await this.prisma.$transaction(async (tx) => {
                const created = await tx.teamPlayer.create({
                    data: {
                        season_team_id,
                        player_id: dto.player_id,
                        jersey_number: dto.jersey_number,
                        position: dto.position,
                        role: dto.role,
                        user_id: player.user_id,
                        approval_status: ApprovalStatus.approved,
                    },
                    select: TEAM_PLAYER_SELECT,
                });
                await this.ensurePlayerRole(player.user_id, tx);
                return created;
            });
            return this.mapTeamPlayer(tp);
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw createAppError("CONFLICT", "Trùng dữ liệu — request khác vừa thêm player/số áo này");
            }
            throw err;
        }
    }
    /**
     * FIX MỚI: dto giờ bắt buộc student_code. Với user MỚI tạo, ghi luôn
     * student_code vào User trong cùng tx (user mới chưa có gì để mất).
     * Với user ĐÃ tồn tại, KHÔNG ghi đè student_code có sẵn (tránh leader
     * sửa MSSV người khác qua form thêm player) — chỉ backfill nếu user
     * đó đang null. Class-match check luôn chạy sau bước này, trong cùng
     * tx, trước khi tạo TeamPlayer.
     *
     * LƯU Ý CÒN HỞ: user mới tạo có class_id = null (chưa gán lớp), nên
     * assertPlayerClassMatchesTeam sẽ pass cho user mới bất kể team thuộc
     * lớp nào (điều kiện `team.class_id != null && user.class_id !== ...`
     * chỉ fail khi cả 2 khác nhau VÀ đều có giá trị). Nếu cần chặn cứng
     * "user phải có lớp trước khi vào team", phải thêm field class_id vào
     * CreatePlayerForTeamDto và set ngay lúc tạo user — hỏi lại UX trước
     * khi đổi, vì hiện tại đang cho phép admin gán lớp sau.
     */
    async createPlayerForTeamWithUser(season_team_id, dto) {
        const dupJersey = await this.prisma.teamPlayer.findFirst({
            where: { season_team_id, jersey_number: dto.jersey_number },
            select: { id: true },
        });
        if (dupJersey)
            throw createAppError("CONFLICT", `Jersey number ${dto.jersey_number} đã được sử dụng trong đội`);
        let createdNewUserId = null;
        const teamClassId = await this.getTeamClassId(season_team_id);
        try {
            const tp = await this.prisma.$transaction(async (tx) => {
                let user = await tx.user.findUnique({
                    where: { email: dto.user_email },
                    select: { id: true, student_code: true },
                });
                if (!user) {
                    const created = await tx.user.create({
                        data: {
                            email: dto.user_email,
                            name: dto.name,
                            student_code: dto.student_code ?? null,
                            password: null,
                            is_active: false,
                        },
                        select: { id: true, student_code: true },
                    });
                    user = created;
                    createdNewUserId = created.id;
                }
                else if (!user.student_code && dto.student_code) {
                    await tx.user.update({ where: { id: user.id }, data: { student_code: dto.student_code } });
                }
                let player = await tx.player.findFirst({
                    where: { user_id: user.id, deleted_at: null },
                    select: { id: true },
                });
                if (!player) {
                    player = await tx.player.create({
                        data: { user_id: user.id, date_of_birth: dto.date_of_birth, position: dto.position },
                        select: { id: true },
                    });
                }
                else {
                    const alreadyInTeam = await tx.teamPlayer.findFirst({
                        where: { season_team_id, player_id: player.id },
                        select: { id: true },
                    });
                    if (alreadyInTeam)
                        throw createAppError("CONFLICT", "Player already in team");
                }
                await this.assertPlayerClassMatchesUser(teamClassId, user.id, tx);
                const created = await tx.teamPlayer.create({
                    data: {
                        season_team_id,
                        player_id: player.id,
                        jersey_number: dto.jersey_number,
                        position: dto.position,
                        role: "player",
                        user_id: user.id,
                        approval_status: ApprovalStatus.approved,
                    },
                    select: TEAM_PLAYER_SELECT,
                });
                await this.ensurePlayerRole(user.id, tx);
                return created;
            });
            if (createdNewUserId) {
                try {
                    const inviteToken = await this.issueInviteToken(createdNewUserId);
                    await mailService.sendInviteEmail(dto.user_email, { token: inviteToken, name: dto.name });
                }
                catch (err) {
                    logger.error(`Failed to issue invite / send email to ${dto.user_email}`);
                }
            }
            return this.mapTeamPlayer(tp);
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw createAppError("CONFLICT", "Trùng dữ liệu — request khác vừa thêm player/số áo này");
            }
            throw err;
        }
    }
    async updateTeamPlayer(id, season_team_id, dto) {
        const existing = await this.prisma.teamPlayer.findFirst({
            where: { id, season_team_id },
            select: { id: true, user_id: true },
        });
        if (!existing)
            throw createAppError("NOT_FOUND", `TeamPlayer ${id} not found in season_team ${season_team_id}`);
        const tp = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.teamPlayer.update({ where: { id }, data: dto, select: TEAM_PLAYER_SELECT });
            if (existing.user_id)
                await this.ensurePlayerRole(existing.user_id, tx);
            return updated;
        });
        return this.mapTeamPlayer(tp);
    }
    // ----------------------------------------------------------
    // BULK DELETE — TeamPlayer không soft-delete được (không có is_active/
    // deleted_at). Schema có sẵn TeamPlayerHistory cho đúng mục đích này —
    // xoá cứng TeamPlayer + ghi lại lịch sử rời đội trong cùng transaction.
    // LƯU Ý: BulkDeleteDto chưa có field `reason`, tạm default "dropped" —
    // nên thêm reason?: LeaveReason vào bulkDeleteSchema nếu FE cần chọn lý do.
    // ----------------------------------------------------------
    approveTeamPlayer(id, season_team_id) {
        return this.updateTeamPlayer(id, season_team_id, { approval_status: ApprovalStatus.approved });
    }
    rejectTeamPlayer(id, season_team_id) {
        return this.updateTeamPlayer(id, season_team_id, { approval_status: ApprovalStatus.rejected });
    }
    // ----------------------------------------------------------
    // BULK DELETE — TeamPlayer không soft-delete được (không có is_active/
    // deleted_at trên schema). Xoá cứng + ghi TeamPlayerHistory trong cùng
    // transaction để giữ lịch sử rời đội.
    // ----------------------------------------------------------
    async bulkDeleteTeamPlayers(season_team_id, dto) {
        const existing = await this.prisma.teamPlayer.findMany({
            where: { id: { in: dto.ids }, season_team_id },
            select: { id: true, player_id: true, jersey_number: true, position: true, role: true, joined_at: true },
        });
        const existingIds = new Set(existing.map((r) => r.id));
        const notFound = dto.ids.filter((id) => !existingIds.has(id));
        if (existing.length === 0)
            return { deleted: 0, notFound };
        const now = new Date();
        await this.prisma.$transaction([
            this.prisma.teamPlayerHistory.createMany({
                data: existing.map((tp) => ({
                    season_team_id,
                    player_id: tp.player_id,
                    jersey_number: tp.jersey_number,
                    position: tp.position,
                    role: tp.role,
                    joined_at: tp.joined_at,
                    left_at: now,
                    left_reason: dto.reason,
                })),
            }),
            this.prisma.teamPlayer.deleteMany({ where: { id: { in: [...existingIds] } } }),
        ]);
        return { deleted: existingIds.size, notFound };
    }
    async hardDeleteTeamPlayers(season_team_id, dto, reason = LeaveReason.dropped) {
        const existing = await this.prisma.teamPlayer.findMany({
            where: { id: { in: dto.ids }, season_team_id },
            select: { id: true, player_id: true, jersey_number: true, position: true, role: true, joined_at: true },
        });
        const existingIds = new Set(existing.map((r) => r.id));
        const notFound = dto.ids.filter((id) => !existingIds.has(id));
        if (existing.length === 0)
            return { deleted: 0, notFound };
        const now = new Date();
        await this.prisma.$transaction([
            this.prisma.teamPlayerHistory.createMany({
                data: existing.map((tp) => ({
                    season_team_id,
                    player_id: tp.player_id,
                    jersey_number: tp.jersey_number,
                    position: tp.position,
                    role: tp.role,
                    joined_at: tp.joined_at,
                    left_at: now,
                    left_reason: reason,
                })),
            }),
            this.prisma.teamPlayer.deleteMany({ where: { id: { in: [...existingIds] } } }),
        ]);
        return { deleted: existingIds.size, notFound };
    }
    async getPlayerTeamHistory(player_id) {
        const rows = await this.prisma.teamPlayerHistory.findMany({
            where: { player_id },
            select: {
                id: true,
                jersey_number: true,
                position: true,
                role: true,
                joined_at: true,
                left_at: true,
                left_reason: true,
                season_team: {
                    select: {
                        team: { select: { id: true, name: true } },
                        season: {
                            select: {
                                id: true,
                                name: true,
                                tournament: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { left_at: "desc" },
        });
        return rows.map((r) => ({
            history_id: r.id,
            team_id: r.season_team.team.id,
            team_name: r.season_team.team.name,
            season_id: r.season_team.season.id,
            season_name: r.season_team.season.name,
            tournament_id: r.season_team.season.tournament.id,
            tournament_name: r.season_team.season.tournament.name,
            jersey_number: r.jersey_number,
            position: r.position,
            role: r.role,
            joined_at: r.joined_at,
            left_at: r.left_at,
            left_reason: r.left_reason,
        }));
    }
    // ----------------------------------------------------------
    // EXPORT EXCEL
    // ----------------------------------------------------------
    async exportTeamPlayersExcel(season_team_id) {
        const records = await this.prisma.teamPlayer.findMany({
            where: { season_team_id },
            select: TEAM_PLAYER_SELECT,
            orderBy: { jersey_number: "asc" },
        });
        const rows = records.map((tp) => ({
            jersey_number: tp.jersey_number,
            name: tp.player?.user?.name ?? "",
            email: tp.player?.user?.email ?? "",
            student_code: tp.player?.user?.student_code ?? "", // FIX: xuất kèm MSSV
            position: tp.position,
            role: tp.role,
            status: tp.status,
            approval_status: tp.approval_status,
            date_of_birth: tp.player?.date_of_birth
                ? tp.player.date_of_birth.toISOString().split("T")[0]
                : "",
            nationality: tp.player?.nationality ?? "",
            height: tp.player?.height ? Number(tp.player.height) : "",
            weight: tp.player?.weight ? Number(tp.player.weight) : "",
        }));
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Players");
        ws.columns = [
            { header: "jersey_number", key: "jersey_number", width: 6 },
            { header: "name", key: "name", width: 24 },
            { header: "email", key: "email", width: 28 },
            { header: "student_code", key: "student_code", width: 14 },
            { header: "position", key: "position", width: 12 },
            { header: "role", key: "role", width: 14 },
            { header: "status", key: "status", width: 10 },
            { header: "approval_status", key: "approval_status", width: 16 },
            { header: "date_of_birth", key: "date_of_birth", width: 12 },
            { header: "nationality", key: "nationality", width: 14 },
            { header: "height", key: "height", width: 8 },
            { header: "weight", key: "weight", width: 8 },
        ];
        ws.addRows(rows);
        const buffer = await wb.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async exportImportTemplate(minRows = 5) {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Danh sách cầu thủ");
        ws.columns = [
            { header: "Họ và tên", key: "name", width: 24 },
            { header: "Email", key: "email", width: 28 },
            { header: "MSSV", key: "student_code", width: 14 },
            { header: "Ngày sinh (YYYY-MM-DD)", key: "dob", width: 20 },
            { header: "Vị trí", key: "position", width: 10 },
            { header: "Số áo", key: "jersey_number", width: 8 },
        ];
        ws.addRow({
            name: "Nguyễn Văn A",
            email: "player1@example.com",
            student_code: "20120001",
            dob: "2000-01-15",
            position: "FW",
            jersey_number: 10,
        });
        const sampleRow = ws.getRow(2);
        sampleRow.font = { italic: true, color: { argb: "FF888888" } };
        for (let i = 1; i < minRows; i++)
            ws.addRow({});
        const wsInfo = wb.addWorksheet("Hướng dẫn");
        wsInfo.columns = [
            { header: "Cột", key: "field", width: 24 },
            { header: "Mô tả / Yêu cầu", key: "note", width: 60 },
        ];
        const positionHint = Object.values(PlayerPosition).join(" | ");
        const instructions = [
            { field: "name", note: "Họ và tên đầy đủ — bắt buộc. Dùng để tạo tài khoản mới nếu email chưa có trong hệ thống." },
            { field: "email", note: "Bắt buộc. Nếu email đã có tài khoản → gắn cầu thủ vào tài khoản đó. Nếu chưa có → hệ thống tự tạo tài khoản (chưa có mật khẩu) và gửi email mời đặt mật khẩu, hiệu lực 24h." },
            { field: "student_code", note: "MSSV — bắt buộc. Xác nhận tư cách sinh viên, điều kiện tiên quyết để tham gia đội." },
            { field: "jersey_number", note: "Số nguyên 1-99, duy nhất trong đội" },
            { field: "date_of_birth", note: "Định dạng YYYY-MM-DD" },
            { field: "position", note: positionHint },
            { field: "height", note: "cm, có thể để trống" },
            { field: "weight", note: "kg, có thể để trống" },
            { field: "nationality", note: "Có thể để trống" },
            { field: "", note: `Nên chuẩn bị tối thiểu ${minRows} dòng cầu thủ` },
            { field: "", note: `Tối đa ${MAX_IMPORT_ROWS} dòng / file` },
        ];
        wsInfo.addRows(instructions);
        ws.getRow(1).font = { bold: true };
        wsInfo.getRow(1).font = { bold: true };
        const buffer = await wb.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    // ----------------------------------------------------------
    // IMPORT EXCEL
    // ----------------------------------------------------------
    /**
     * FIX MỚI: student_code bắt buộc trong schema (validate ở
     * importPlayerRowSchema), ghi vào User khi tạo mới hoặc backfill khi
     * user có sẵn nhưng chưa có. assertPlayerClassMatchesTeam chạy trong
     * tx per-row, TRƯỚC khi tạo TeamPlayer — lỗi rơi vào catch hiện có,
     * tự động log vào result.errors[].reason theo đúng hành vi cũ (1 dòng
     * lỗi không ảnh hưởng dòng khác).
     */
    async importTeamPlayersFromExcel(season_team_id, fileBuffer) {
        const wb = new ExcelJS.Workbook();
        try {
            await wb.xlsx.load(fileBuffer);
        }
        catch (err) {
            throw createAppError("BAD_REQUEST", "File Excel không hợp lệ hoặc bị hỏng");
        }
        const ws = wb.worksheets[0];
        if (!ws)
            throw createAppError("BAD_REQUEST", "Excel file has no sheets");
        const raw = worksheetToRawRows(ws);
        if (raw.length > MAX_IMPORT_ROWS) {
            throw createAppError("BAD_REQUEST", `File has ${raw.length} rows, max ${MAX_IMPORT_ROWS} allowed`);
        }
        const result = { success: 0, failed: 0, skipped: 0, errors: [], skippedRows: [] };
        const validRows = [];
        for (const [i, rawRow] of raw.entries()) {
            const rowNum = i + 2;
            const normalized = normalizeImportRow(rawRow);
            const parsed = importPlayerRowSchema.safeParse(normalized);
            if (!parsed.success) {
                result.failed++;
                result.errors.push({
                    row: rowNum,
                    reason: parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; "),
                });
            }
            else {
                validRows.push({ rowNum, dto: parsed.data });
            }
        }
        if (validRows.length === 0)
            return result;
        const teamClassId = await this.getTeamClassId(season_team_id);
        const emails = [...new Set(validRows.map((r) => r.dto.user_email))];
        const users = await this.prisma.user.findMany({
            where: { email: { in: emails } },
            select: { id: true, email: true, student_code: true, class_id: true }, // FIX: thêm class_id
        });
        const userByEmail = new Map(users.map((u) => [u.email, u.id]));
        const studentCodeByUserId = new Map(users.map((u) => [u.id, u.student_code]));
        const classIdByUserId = new Map(users.map((u) => [u.id, u.class_id]));
        const userIds = users.map((u) => u.id);
        const [players, existingTeamPlayers] = await Promise.all([
            userIds.length
                ? this.prisma.player.findMany({
                    where: { user_id: { in: userIds }, deleted_at: null },
                    select: { id: true, user_id: true },
                })
                : Promise.resolve([]),
            // FIX: bỏ deleted_at (không tồn tại) — filter theo season_team_id
            this.prisma.teamPlayer.findMany({
                where: { season_team_id },
                select: { player_id: true, jersey_number: true },
            }),
        ]);
        const playerByUserId = new Map(players.map((p) => [p.user_id, p.id]));
        const teamPlayerSet = new Set(existingTeamPlayers.map((tp) => tp.player_id));
        const usedJerseyNumbers = new Set(existingTeamPlayers.map((tp) => tp.jersey_number));
        const playerRole = await this.prisma.role.findUnique({ where: { name: PLAYER_ROLE_NAME } });
        if (!playerRole) {
            throw createAppError("INTERNAL_SERVER_ERROR", `Role "${PLAYER_ROLE_NAME}" not found — kiểm tra lại seed data bảng roles trước khi import`);
        }
        for (const { rowNum, dto } of validRows) {
            if (dto.jersey_number == null) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: "jersey_number required for team assignment" });
                continue;
            }
            const existingUserId = userByEmail.get(dto.user_email);
            const existingPlayerId = existingUserId ? playerByUserId.get(existingUserId) : undefined;
            if (existingPlayerId && teamPlayerSet.has(existingPlayerId)) {
                // FIX: trước đây skip vô điều kiện — giờ re-validate class-match
                // bằng data đã có sẵn trong memory (không query DB thêm). Nếu
                // team đổi class_id SAU KHI player đã join, lần import lại sẽ
                // bắt được thay vì âm thầm skip qua vi phạm.
                if (teamClassId != null) {
                    const studentCode = studentCodeByUserId.get(existingUserId);
                    const classId = classIdByUserId.get(existingUserId);
                    if (!studentCode) {
                        result.failed++;
                        result.errors.push({ row: rowNum, reason: "Tài khoản chưa có MSSV — không thể tham gia đội sinh viên" });
                        continue;
                    }
                    if (classId !== teamClassId) {
                        result.failed++;
                        result.errors.push({ row: rowNum, reason: "Cầu thủ không thuộc lớp của đội (dữ liệu cũ không còn hợp lệ)" });
                        continue;
                    }
                }
                result.skipped++;
                result.skippedRows.push({ row: rowNum, reason: "Player already in team — skipped" });
                continue;
            }
            if (usedJerseyNumbers.has(dto.jersey_number)) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: `Jersey number ${dto.jersey_number} đã được sử dụng trong đội` });
                continue;
            }
            let createdNewUserId = null;
            try {
                const { playerId, userId } = await this.prisma.$transaction(async (tx) => {
                    let userId = existingUserId;
                    if (!userId) {
                        const newUser = await tx.user.create({
                            data: {
                                email: dto.user_email,
                                name: dto.name,
                                student_code: dto.student_code ?? null,
                                password: null,
                                is_active: false,
                            },
                            select: { id: true },
                        });
                        userId = newUser.id;
                        createdNewUserId = newUser.id;
                    }
                    else if (!studentCodeByUserId.get(userId) && dto.student_code) {
                        await tx.user.update({ where: { id: userId }, data: { student_code: dto.student_code } });
                        studentCodeByUserId.set(userId, dto.student_code);
                    }
                    await this.assertPlayerClassMatchesUser(teamClassId, userId, tx);
                    let playerId = existingPlayerId;
                    if (!playerId) {
                        const created = await tx.player.create({
                            data: {
                                user_id: userId,
                                date_of_birth: dto.date_of_birth,
                                position: dto.position,
                                height: dto.height ?? null,
                                weight: dto.weight ?? null,
                                nationality: dto.nationality ?? null,
                            },
                            select: { id: true },
                        });
                        playerId = created.id;
                    }
                    // FIX: data.team_id -> data.season_team_id
                    await tx.teamPlayer.create({
                        data: {
                            season_team_id,
                            player_id: playerId,
                            jersey_number: dto.jersey_number,
                            position: dto.position,
                            role: "player",
                            user_id: userId,
                            approval_status: ApprovalStatus.approved,
                        },
                    });
                    await tx.user_Role.upsert({
                        where: { user_id_role_id: { user_id: userId, role_id: playerRole.id } },
                        create: { user_id: userId, role_id: playerRole.id },
                        update: {},
                    });
                    return { playerId, userId };
                });
                userByEmail.set(dto.user_email, userId);
                playerByUserId.set(userId, playerId);
                teamPlayerSet.add(playerId);
                usedJerseyNumbers.add(dto.jersey_number);
                result.success++;
                if (createdNewUserId) {
                    try {
                        const inviteToken = await this.issueInviteToken(createdNewUserId);
                        await mailService.sendInviteEmail(dto.user_email, { token: inviteToken, name: dto.name });
                    }
                    catch (err) {
                        logger.error(`Failed to issue invite / send email to ${dto.user_email} (row ${rowNum})`);
                    }
                }
            }
            catch (err) {
                result.failed++;
                const isDuplicate = err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
                result.errors.push({
                    row: rowNum,
                    reason: isDuplicate
                        ? "Trùng dữ liệu (jersey_number, email, hoặc player đã có trong đội — race condition với request khác)"
                        : (err instanceof Error ? err.message : "Unknown error"),
                });
            }
        }
        return result;
    }
    // ----------------------------------------------------------
    // MAPPERS
    // ----------------------------------------------------------
    mapPlayer(p) {
        return {
            ...p,
            height: p.height ? Number(p.height) : null,
            weight: p.weight ? Number(p.weight) : null,
        };
    }
    mapTeamPlayer(tp) {
        return {
            ...tp,
            player: tp.player ? this.mapPlayer(tp.player) : null,
        };
    }
}
//# sourceMappingURL=player.service.js.map