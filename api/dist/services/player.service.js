import ExcelJS from "exceljs";
import crypto from "node:crypto";
import { importPlayerRowSchema } from "../dtos/player.schema.js";
import { Queryable } from "../libs/queryable.js";
import { createAppError } from "../common/app.error.js";
import { ApprovalStatus, PlayerPosition, Prisma } from "../generated/prisma/client.js";
import { storageService } from "./storage.service.js";
import { logger } from "../libs/logger.js";
import { PLAYER_SELECT, PLAYER_SELECT_WITH_SEASONS, TEAM_PLAYER_SELECT } from "../types/player.type.js";
import { mailService } from "./mail.service.js";
import redis from "../libs/redis.js";
const MAX_IMPORT_ROWS = 200;
const PLAYER_ROLE_NAME = "player";
// FIX: đổi từ 7 ngày -> 24h theo yêu cầu. Token invite chỉ có hiệu lực tạo
// tài khoản/đặt mật khẩu trong vòng 24h kể từ lúc admin/leader thêm player.
// Hết hạn -> user phải được admin resend invite (tạo token mới), không tự gia hạn.
const INVITE_TOKEN_TTL_SECONDS = 24 * 60 * 60; // 24 giờ
// ----------------------------------------------------------
// IMPORT EXCEL — HỖ TRỢ FILE THUẦN TIẾNG VIỆT
// ----------------------------------------------------------
// Map header tiếng Việt (và vài biến thể/tiếng Anh) -> key chuẩn của
// importPlayerRowSchema. So khớp sau khi đã trim + lowercase, nên không
// quan trọng hoa/thường hay khoảng trắng dư.
const IMPORT_HEADER_ALIASES = {
    "họ và tên": "name",
    "họ tên": "name",
    "tên": "name",
    "name": "name",
    "email": "user_email",
    "user_email": "user_email",
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
// Map value cột "Vị trí" (mã hoặc chữ Việt) -> enum PlayerPosition thật.
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
    return IMPORT_POSITION_ALIASES[key] ?? raw; // không match -> giữ nguyên, để Zod tự báo lỗi rõ ràng
}
/**
 * Nhận 1 dòng raw (key = text header gốc trong file Excel, có thể là tiếng
 * Việt, tiếng Anh, hoặc lệch hoa/thường/khoảng trắng), trả về object với key
 * chuẩn đúng tên field của importPlayerRowSchema. Header không nhận diện
 * được sẽ bị bỏ qua (không throw ở bước này — để Zod báo lỗi "required" rõ
 * ràng theo từng dòng/cột thiếu thay vì fail âm thầm).
 */
function normalizeImportRow(raw) {
    const out = {};
    for (const [rawKey, value] of Object.entries(raw)) {
        const mappedKey = IMPORT_HEADER_ALIASES[normalizeHeaderKey(rawKey)];
        if (!mappedKey)
            continue; // cột lạ, không map được -> bỏ qua
        out[mappedKey] = mappedKey === "position" ? normalizePositionValue(value) : value;
    }
    return out;
}
/**
 * exceljs trả cell.value có thể là string/number/Date, hoặc object phức tạp
 * (rich text, hyperlink, formula result...) — unwrap về giá trị thuần trước
 * khi đưa vào Zod.
 */
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
            return value.text; // hyperlink { text, hyperlink }
        if ("result" in value)
            return value.result; // formula
        return null;
    }
    return value;
}
/**
 * Đọc worksheet -> mảng object thô, key = text hàng header (hàng 1).
 * Bỏ qua các hàng trống hoàn toàn (khác với xlsx cũ luôn trả cả hàng
 * blank-template thành object toàn null, gây fail oan ở bước validate).
 */
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
    }
    // ----------------------------------------------------------
    // PLAYER CRUD
    // ----------------------------------------------------------
    /**
     * FIX: trước đây không validate user_id tồn tại (→ P2003 FK raw 500 nếu
     * user_id sai) và không dedupe theo user_id (→ 2 Player row cho cùng 1
     * user nếu Player.user_id không có @@unique DB — đã confirm schema.prisma
     * có @unique trên Player.user_id, nên DB tự chặn ở mức constraint, nhưng
     * vẫn check trước để trả lỗi rõ ràng thay vì raw P2002).
     * Trả CONFLICT rõ ràng thay vì raw Prisma error hoặc silent duplicate.
     * Dùng khi admin đã biết user_id có sẵn. Không dùng cho case "thêm player +
     * chưa chắc user tồn tại" — xem createPlayerForTeamWithUser.
     */
    async createPlayer(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.user_id },
            select: { id: true },
        });
        if (!user)
            throw createAppError("NOT_FOUND", `User ${dto.user_id} not found`);
        const existing = await this.prisma.player.findFirst({
            where: { user_id: dto.user_id, deleted_at: null },
            select: { id: true },
        });
        if (existing) {
            throw createAppError("CONFLICT", `User ${dto.user_id} already has a player profile (id=${existing.id})`);
        }
        const player = await this.prisma.player.create({
            data: dto,
            select: PLAYER_SELECT,
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
        const seasons = p.team_players.flatMap((tp) => tp.team.season_teams.map((st) => ({
            season_id: st.season.id,
            season_name: st.season.name,
            season_status: st.season.status,
            team_id: tp.team.id,
            team_name: tp.team.name,
            season_team_status: st.status,
            group_id: st.group_id,
            jersey_number: tp.jersey_number,
        })));
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
            logger.warn(`Role "${PLAYER_ROLE_NAME}" not found — skipping role assignment for user ${userId}`);
            return;
        }
        await tx.user_Role.upsert({
            where: { user_id_role_id: { user_id: userId, role_id: role.id } },
            create: { user_id: userId, role_id: role.id },
            update: {},
        });
    }
    // ----------------------------------------------------------
    // INVITE TOKEN (Redis — thay cho cột invite_token_hash/expires_at trong DB)
    // ----------------------------------------------------------
    inviteKey(tokenHash) {
        return `invite:token:${tokenHash}`;
    }
    /**
     * Sinh invite token cho 1 user mới tạo (chưa có mật khẩu — Player.user
     * password nullable theo schema.prisma: `password String?`), lưu bản HASH
     * (sha256) vào Redis với TTL 24h — không bao giờ lưu plaintext, không cần
     * cột DB (invite_token_hash/invite_token_expires_at), Redis tự hết hạn.
     * Trả về rawToken để gửi qua email (không log ra ngoài).
     *
     * QUAN TRỌNG: hàm này KHÔNG được gọi bên trong prisma.$transaction — Redis
     * không tham gia rollback của Prisma. Nếu gọi trong tx mà tx rollback sau
     * đó, token sẽ trỏ tới 1 userId "mồ côi" hoặc tệ hơn là bị tái sử dụng
     * nhầm cho user khác nếu id được cấp lại. Luôn gọi SAU khi transaction
     * tạo user/player/teamPlayer đã commit thành công.
     */
    async issueInviteToken(userId) {
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        await redis.set(this.inviteKey(tokenHash), String(userId), {
            EX: INVITE_TOKEN_TTL_SECONDS,
        });
        return rawToken;
    }
    /**
     * Xác thực raw token (dùng cho endpoint POST /auth/accept-invite — chưa
     * có trong file này). Trả về userId nếu hợp lệ. Token là one-time-use:
     * xoá ngay khỏi Redis sau khi đọc thành công để không dùng lại được lần 2.
     * Hết hạn (quá 24h) hoặc sai token đều rơi vào nhánh BAD_REQUEST như nhau
     * — không tiết lộ token đã từng tồn tại hay chưa.
     */
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
    /**
     * Cho admin/leader bấm "gửi lại lời mời" khi token cũ đã hết hạn (24h).
     * Phát hành token MỚI (token cũ nếu còn trong Redis vẫn còn hiệu lực tới
     * khi hết TTL của chính nó — không revoke, chấp nhận có thể có 2 token
     * sống song song trong thời gian ngắn, không phải vấn đề bảo mật vì cả
     * hai đều one-time-use).
     */
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
        const { team_id, ...req } = query;
        return this.teamPlayerQuery
            .run(req, {
            beforeBuild: (where) => {
                where.push({ team_id, deleted_at: null });
            },
        })
            .then((res) => ({
            ...res,
            data: res.data.map((tp) => this.mapTeamPlayer(tp)),
        }));
    }
    async getTeamPlayerById(id, team_id) {
        const tp = await this.prisma.teamPlayer.findFirst({
            where: { id, team_id, deleted_at: null },
            select: TEAM_PLAYER_SELECT,
        });
        return tp ? this.mapTeamPlayer(tp) : null;
    }
    async addPlayerToTeam(team_id, dto) {
        const player = await this.prisma.player.findFirst({
            where: { id: dto.player_id, deleted_at: null },
            select: { id: true, user_id: true },
        });
        if (!player)
            throw createAppError("NOT_FOUND", `Player ${dto.player_id} not found`);
        const [dupPlayer, dupJersey] = await Promise.all([
            this.prisma.teamPlayer.findFirst({
                where: { team_id, player_id: dto.player_id, deleted_at: null },
                select: { id: true },
            }),
            this.prisma.teamPlayer.findFirst({
                where: { team_id, jersey_number: dto.jersey_number, deleted_at: null },
                select: { id: true },
            }),
        ]);
        if (dupPlayer)
            throw createAppError("CONFLICT", "Player already in team");
        if (dupJersey)
            throw createAppError("CONFLICT", `Jersey number ${dto.jersey_number} đã được sử dụng trong đội`);
        try {
            const tp = await this.prisma.$transaction(async (tx) => {
                const created = await tx.teamPlayer.create({
                    data: {
                        team_id,
                        player_id: dto.player_id,
                        jersey_number: dto.jersey_number,
                        position: dto.position,
                        role: dto.role,
                        user_id: player.user_id,
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
     * Thêm cầu thủ vào team, tự find-or-create User theo email nếu chưa
     * tồn tại. Player KHÔNG có cột name/email (schema.prisma) — 2 field này
     * thuộc về User, Player chỉ giữ user_id (@unique, 1-1). Khác
     * createPlayer()+addPlayerToTeam() cũ (bắt buộc user có sẵn) — đây là
     * entrypoint cho flow "leader nhập tên+email, hệ thống tự lo phần tài
     * khoản".
     *
     * User mới tạo có password = null (cột nullable theo schema.prisma:
     * `password String?`), is_active = false, kèm invite token (hash lưu
     * Redis TTL 24h, raw token gửi qua email). Cần endpoint
     * POST /auth/accept-invite (chưa có trong file này) để user set mật
     * khẩu thật bằng token này rồi kích hoạt account, trong vòng 24h kể từ
     * lúc tạo — quá hạn phải dùng resendInvite() để admin gửi lại.
     *
     * issueInviteToken() được gọi SAU khi transaction Prisma đã commit,
     * không nằm trong tx — vì Redis không rollback theo transaction DB. Nếu
     * để trong tx và transaction rollback (vd. do lỗi jersey trùng ở bước
     * sau), sẽ có token "mồ côi" trỏ tới user không tồn tại (hoặc trỏ nhầm
     * user nếu id được tái sử dụng).
     *
     * Gửi email NGOÀI transaction: network call không nên giữ DB
     * connection, và nếu email fail thì không nên rollback việc tạo
     * player — leader vẫn thấy player trong đội, admin có thể gọi
     * resendInvite() thủ công sau.
     *
     * Pre-check jersey ngoài transaction để fail sớm (UX), P2002 trong
     * catch là nguồn chân lý chống race — giả định đã có unique constraint
     * (team_id, jersey_number) filter deleted_at null. Nếu chưa có, request
     * đồng thời có thể pass cả 2 pre-check → cần thêm constraint DB.
     */
    async createPlayerForTeamWithUser(team_id, dto) {
        const dupJersey = await this.prisma.teamPlayer.findFirst({
            where: { team_id, jersey_number: dto.jersey_number, deleted_at: null },
            select: { id: true },
        });
        if (dupJersey) {
            throw createAppError("CONFLICT", `Jersey number ${dto.jersey_number} đã được sử dụng trong đội`);
        }
        // Chỉ đánh dấu id user mới tạo (nếu có) — KHÔNG gọi Redis trong tx.
        let createdNewUserId = null;
        try {
            const tp = await this.prisma.$transaction(async (tx) => {
                let user = await tx.user.findUnique({
                    where: { email: dto.user_email },
                    select: { id: true },
                });
                if (!user) {
                    user = await tx.user.create({
                        data: {
                            email: dto.user_email,
                            name: dto.name,
                            password: null,
                            is_active: false,
                        },
                        select: { id: true },
                    });
                    createdNewUserId = user.id;
                }
                let player = await tx.player.findFirst({
                    where: { user_id: user.id, deleted_at: null },
                    select: { id: true },
                });
                if (!player) {
                    player = await tx.player.create({
                        data: {
                            user_id: user.id,
                            date_of_birth: dto.date_of_birth,
                            position: dto.position,
                        },
                        select: { id: true },
                    });
                }
                else {
                    const alreadyInTeam = await tx.teamPlayer.findFirst({
                        where: { team_id, player_id: player.id, deleted_at: null },
                        select: { id: true },
                    });
                    if (alreadyInTeam)
                        throw createAppError("CONFLICT", "Player already in team");
                }
                const created = await tx.teamPlayer.create({
                    data: {
                        team_id,
                        player_id: player.id,
                        jersey_number: dto.jersey_number,
                        position: dto.position,
                        role: "player",
                        user_id: user.id,
                    },
                    select: TEAM_PLAYER_SELECT,
                });
                await this.ensurePlayerRole(user.id, tx);
                return created;
            });
            // Transaction đã commit thành công -> giờ mới an toàn để phát
            // invite token (Redis, TTL 24h) + gửi mail.
            if (createdNewUserId) {
                try {
                    const inviteToken = await this.issueInviteToken(createdNewUserId);
                    await mailService.sendInviteEmail(dto.user_email, {
                        token: inviteToken,
                        name: dto.name,
                    });
                }
                catch (err) {
                    // fire-and-forget có kiểm soát: log để admin resendInvite() thủ
                    // công sau, không throw — player đã được tạo thành công, đừng
                    // revert vì Redis/email fail.
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
    /**
     * FIX: trước đây thiếu team_id trong where clause của check + update →
     * IDOR — team A có thể sửa TeamPlayer của team B nếu biết đúng id
     * (sequential integer, dễ enumerate). Giờ team_id là bắt buộc, service
     * là nơi enforce invariant này — không phụ thuộc controller nhớ pre-check.
     */
    async updateTeamPlayer(id, team_id, dto) {
        const exists = await this.prisma.teamPlayer.findFirst({
            where: { id, team_id, deleted_at: null },
            select: { id: true },
        });
        if (!exists)
            throw createAppError("NOT_FOUND", `TeamPlayer ${id} not found in team ${team_id}`);
        const tp = await this.prisma.teamPlayer.update({
            where: { id },
            data: dto,
            select: TEAM_PLAYER_SELECT,
        });
        return this.mapTeamPlayer(tp);
    }
    approveTeamPlayer(id, team_id) {
        return this.updateTeamPlayer(id, team_id, { approval_status: ApprovalStatus.approved });
    }
    rejectTeamPlayer(id, team_id) {
        return this.updateTeamPlayer(id, team_id, { approval_status: ApprovalStatus.rejected });
    }
    // ----------------------------------------------------------
    // BULK DELETE
    // ----------------------------------------------------------
    async bulkDeleteTeamPlayers(team_id, dto) {
        const now = new Date();
        const existing = await this.prisma.teamPlayer.findMany({
            where: { id: { in: dto.ids }, team_id, deleted_at: null },
            select: { id: true },
        });
        const existingIds = new Set(existing.map((r) => r.id));
        const notFound = dto.ids.filter((id) => !existingIds.has(id));
        if (existingIds.size === 0)
            return { deleted: 0, notFound };
        await this.prisma.teamPlayer.updateMany({
            where: { id: { in: [...existingIds] }, team_id },
            data: { deleted_at: now, is_active: false },
        });
        return { deleted: existingIds.size, notFound };
    }
    async hardDeleteTeamPlayers(team_id, dto) {
        const result = await this.prisma.teamPlayer.deleteMany({
            where: { id: { in: dto.ids }, team_id },
        });
        return { deleted: result.count };
    }
    // ----------------------------------------------------------
    // EXPORT EXCEL
    // ----------------------------------------------------------
    async exportTeamPlayersExcel(team_id) {
        const records = await this.prisma.teamPlayer.findMany({
            where: { team_id, deleted_at: null },
            select: TEAM_PLAYER_SELECT,
            orderBy: { jersey_number: "asc" },
        });
        const rows = records.map((tp) => ({
            jersey_number: tp.jersey_number,
            name: tp.player?.user?.name ?? "",
            email: tp.player?.user?.email ?? "",
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
    // FIX: đổi từ xlsx -> exceljs. Hàm này giờ là async (writeBuffer() trả
    // Promise) — nhớ `await playerService.exportImportTemplate(...)` ở
    // controller, khác với bản cũ (đồng bộ).
    async exportImportTemplate(minRows = 5) {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Danh sách cầu thủ");
        ws.columns = [
            { header: "Họ và tên", key: "name", width: 24 },
            { header: "Email", key: "email", width: 28 },
            { header: "Ngày sinh (YYYY-MM-DD)", key: "dob", width: 20 },
            { header: "Vị trí", key: "position", width: 10 },
            { header: "Số áo", key: "jersey_number", width: 8 },
        ];
        ws.addRow({
            name: "Nguyễn Văn A",
            email: "player1@example.com",
            dob: "2000-01-15",
            position: "FW",
            jersey_number: 10,
        });
        // Hàng ví dụ (hàng 2) — in nghiêng, màu xám để leader biết cần xoá/thay
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
        // Bold header row của cả 2 sheet cho dễ nhìn
        ws.getRow(1).font = { bold: true };
        wsInfo.getRow(1).font = { bold: true };
        const buffer = await wb.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    // ----------------------------------------------------------
    // IMPORT EXCEL
    // ----------------------------------------------------------
    /**
     * Hỗ trợ file Excel thuần tiếng Việt (header + giá trị "Vị trí" dạng
     * GK/DEF/MID/FW hoặc "Thủ môn"/"Hậu vệ"...) lẫn file tiếng Anh cũ, thông
     * qua normalizeImportRow() ở module-level phía trên. Nếu email chưa có
     * tài khoản → tự tạo User (password=null, is_active=false) + phát invite
     * token + gửi mail, đồng bộ hành vi với createPlayerForTeamWithUser().
     * Mỗi dòng là 1 transaction riêng — 1 dòng lỗi không ảnh hưởng dòng khác.
     */
    async importTeamPlayersFromExcel(team_id, fileBuffer) {
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
        const result = { success: 0, failed: 0, errors: [] };
        const validRows = [];
        for (const [i, rawRow] of raw.entries()) {
            const rowNum = i + 2; // +2: header ở hàng 1, data bắt đầu hàng 2
            const normalized = normalizeImportRow(rawRow); // dịch header + value tiếng Việt trước khi validate
            const parsed = importPlayerRowSchema.safeParse(normalized);
            if (!parsed.success) {
                result.failed++;
                result.errors.push({
                    row: rowNum,
                    reason: parsed.error.issues
                        .map((e) => `${e.path.join(".")}: ${e.message}`)
                        .join("; "),
                });
            }
            else {
                validRows.push({ rowNum, dto: parsed.data });
            }
        }
        if (validRows.length === 0)
            return result;
        const emails = [...new Set(validRows.map((r) => r.dto.user_email))];
        const users = await this.prisma.user.findMany({
            where: { email: { in: emails } },
            select: { id: true, email: true },
        });
        const userByEmail = new Map(users.map((u) => [u.email, u.id]));
        const userIds = users.map(u => u.id);
        const [players, existingTeamPlayers] = await Promise.all([
            userIds.length
                ? this.prisma.player.findMany({
                    where: { user_id: { in: userIds }, deleted_at: null },
                    select: { id: true, user_id: true },
                })
                : Promise.resolve([]),
            this.prisma.teamPlayer.findMany({
                where: { team_id, deleted_at: null },
                select: { player_id: true, jersey_number: true },
            }),
        ]);
        const playerByUserId = new Map(players.map((p) => [p.user_id, p.id]));
        const teamPlayerSet = new Set(existingTeamPlayers.map((tp) => tp.player_id));
        const usedJerseyNumbers = new Set(existingTeamPlayers.map((tp) => tp.jersey_number));
        const playerRole = await this.prisma.role.findUnique({ where: { name: PLAYER_ROLE_NAME } });
        if (!playerRole) {
            logger.warn(`Role "${PLAYER_ROLE_NAME}" not found — imported users will not be auto-assigned this role`);
        }
        for (const { rowNum, dto } of validRows) {
            if (dto.jersey_number == null) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: "jersey_number required for team assignment" });
                continue;
            }
            if (usedJerseyNumbers.has(dto.jersey_number)) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: `Jersey number ${dto.jersey_number} đã được sử dụng trong đội` });
                continue;
            }
            const existingUserId = userByEmail.get(dto.user_email);
            const existingPlayerId = existingUserId ? playerByUserId.get(existingUserId) : undefined;
            if (existingPlayerId && teamPlayerSet.has(existingPlayerId)) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: "Player already in team" });
                continue;
            }
            // Đánh dấu nếu dòng này tạo user mới — dùng để phát invite SAU tx.
            let createdNewUserId = null;
            try {
                const { playerId, userId } = await this.prisma.$transaction(async (tx) => {
                    let userId = existingUserId;
                    if (!userId) {
                        const newUser = await tx.user.create({
                            data: {
                                email: dto.user_email,
                                name: dto.name,
                                password: null,
                                is_active: false,
                            },
                            select: { id: true },
                        });
                        userId = newUser.id;
                        createdNewUserId = newUser.id;
                    }
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
                    await tx.teamPlayer.create({
                        data: {
                            team_id,
                            player_id: playerId,
                            jersey_number: dto.jersey_number,
                            position: dto.position,
                            role: "player",
                            user_id: userId,
                        },
                    });
                    if (playerRole) {
                        await tx.user_Role.upsert({
                            where: { user_id_role_id: { user_id: userId, role_id: playerRole.id } },
                            create: { user_id: userId, role_id: playerRole.id },
                            update: {},
                        });
                    }
                    return { playerId, userId };
                });
                // Tx đã commit — cập nhật cache cho các dòng tiếp theo trong vòng lặp.
                userByEmail.set(dto.user_email, userId);
                playerByUserId.set(userId, playerId);
                teamPlayerSet.add(playerId);
                usedJerseyNumbers.add(dto.jersey_number);
                result.success++;
                // Redis/mail NGOÀI transaction — không tham gia rollback DB.
                if (createdNewUserId) {
                    try {
                        const inviteToken = await this.issueInviteToken(createdNewUserId);
                        await mailService.sendInviteEmail(dto.user_email, {
                            token: inviteToken,
                            name: dto.name,
                        });
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