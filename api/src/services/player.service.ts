import ExcelJS from "exceljs";
import crypto from "node:crypto";
import {
    AddPlayerToTeamDto, BulkDeleteDto,
    CreatePlayerDto, CreatePlayerForTeamDto, ImportPlayerRowDto,
    importPlayerRowSchema,
    PlayerDetailDto,
    PlayerDto, PlayerPublicDto, TeamPlayerDto,
    UpdatePlayerDto, UpdateTeamPlayerDto
} from "../dtos/player.schema.js";
import { Queryable } from "../libs/queryable.js";
import { createAppError } from "../common/app.error.js";
import { ApprovalStatus, LeaveReason, PlayerPosition, Prisma, PrismaClient } from "../generated/prisma/client.js";
import { storageService } from "./storage.service.js";
import { logger } from "../libs/logger.js";
import { PaginatedResult } from "../types/queryable.type.js";
import {
    ImportResult, ListTeamPlayersQuery, PLAYER_PUBLIC_SELECT, PLAYER_SELECT,
    PLAYER_SELECT_WITH_SEASONS, PlayerPublicRow, PlayerRow, PlayerSeasonInfo,
    PlayerWithSeasonsRow, TEAM_PLAYER_SELECT, TeamPlayerRow
} from "../types/player.type.js";
import { mailService } from "./mail.service.js";
import redis from "../libs/redis.js";


const MAX_IMPORT_ROWS = 200;
const PLAYER_ROLE_NAME = "player";
const INVITE_TOKEN_TTL_SECONDS = 24 * 60 * 60;

// ----------------------------------------------------------
// IMPORT EXCEL — HỖ TRỢ FILE THUẦN TIẾNG VIỆT
// ----------------------------------------------------------

const IMPORT_HEADER_ALIASES: Record<string, keyof ImportPlayerRowDto> = {
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

const IMPORT_POSITION_ALIASES: Record<string, PlayerPosition> = {
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

function normalizeHeaderKey(raw: string): string {
    return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePositionValue(raw: unknown): unknown {
    if (typeof raw !== "string") return raw;
    const key = normalizeHeaderKey(raw);
    return IMPORT_POSITION_ALIASES[key] ?? raw;
}

function normalizeImportRow(raw: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [rawKey, value] of Object.entries(raw)) {
        const mappedKey = IMPORT_HEADER_ALIASES[normalizeHeaderKey(rawKey)];
        if (!mappedKey) continue;
        out[mappedKey] = mappedKey === "position" ? normalizePositionValue(value) : value;
    }
    return out;
}

function unwrapCellValue(value: ExcelJS.CellValue): unknown {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) return value;
    if (typeof value === "object") {
        if ("richText" in (value as any)) {
            return (value as any).richText.map((t: any) => t.text).join("");
        }
        if ("text" in (value as any)) return (value as any).text;
        if ("result" in (value as any)) return (value as any).result;
        return null;
    }
    return value;
}

function worksheetToRawRows(ws: ExcelJS.Worksheet): Record<string, unknown>[] {
    const headers: Record<number, string> = {};
    ws.getRow(1).eachCell({ includeEmpty: false }, (cell, colNumber) => {
        const text = unwrapCellValue(cell.value);
        if (typeof text === "string" && text.trim()) headers[colNumber] = text.trim();
    });

    const rows: Record<string, unknown>[] = [];
    for (let r = 2; r <= ws.rowCount; r++) {
        const row = ws.getRow(r);
        if (row.cellCount === 0) continue;

        const obj: Record<string, unknown> = {};
        let hasValue = false;
        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const header = headers[colNumber];
            if (!header) return;
            const value = unwrapCellValue(cell.value);
            obj[header] = value;
            if (value !== null && value !== undefined && value !== "") hasValue = true;
        });

        if (hasValue) rows.push(obj);
    }
    return rows;
}

// ----------------------------------------------------------
// SỐ ÁO THEO VỊ TRÍ — validate sát thực tế bóng đá
// ----------------------------------------------------------
// FIX: quy ước số áo theo vị trí, ĐỒNG BỘ với FE (RegisterTeam.jsx —
// hằng số POSITION_JERSEY_NUMBERS). Trước đây rule này CHỈ tồn tại ở FE,
// nhánh "Nhập Thủ Công" — mọi entrypoint khác của BE (addPlayerToTeam,
// createPlayerForTeamWithUser, updateTeamPlayer, importTeamPlayersFromExcel,
// copyRosterToSeasonTeam) hoàn toàn không enforce, nghĩa là 1 file Excel
// hoặc 1 request API trực tiếp (Postman, app khác) vẫn có thể gán bất kỳ
// số 1-99 cho bất kỳ vị trí nào, bỏ qua rule FE. Đưa validate xuống service
// layer để áp dụng THỰC SỰ ĐỒNG NHẤT, không phụ thuộc FE nào gọi vào.
//
// Nếu sau này cần đổi bảng số — chỉ sửa DUY NHẤT tại đây (BE là nguồn sự
// thật); nhớ đồng bộ lại hằng số tương ứng bên FE.
const POSITION_JERSEY_NUMBERS: Record<PlayerPosition, number[]> = {
    [PlayerPosition.goalkeeper]: [1, 13, 26],
    [PlayerPosition.defender]: [2, 3, 4, 5, 6, 14, 15, 16, 17, 27, 28],
    [PlayerPosition.midfielder]: [7, 8, 9, 18, 19, 20, 29, 30],
    [PlayerPosition.forward]: [10, 11, 12, 21, 22, 23, 24, 25],
};

const POSITION_LABEL_VN: Record<PlayerPosition, string> = {
    [PlayerPosition.goalkeeper]: "Thủ Môn",
    [PlayerPosition.defender]: "Hậu Vệ",
    [PlayerPosition.midfielder]: "Tiền Vệ",
    [PlayerPosition.forward]: "Tiền Đạo",
};

/**
 * Ném BAD_REQUEST nếu số áo không thuộc dải cho phép của vị trí. Gọi ở
 * MỌI nơi tạo/sửa cặp (position, jersey_number) — xem danh sách call site
 * trong comment phía trên POSITION_JERSEY_NUMBERS.
 */
function assertJerseyNumberMatchesPosition(position: PlayerPosition, jerseyNumber: number): void {
    const allowed = POSITION_JERSEY_NUMBERS[position];
    if (!allowed || !allowed.includes(jerseyNumber)) {
        throw createAppError(
            "BAD_REQUEST",
            `Số áo ${jerseyNumber} không hợp lệ cho vị trí ${POSITION_LABEL_VN[position] ?? position} — số áo cho phép: ${allowed?.join(", ") ?? "không xác định"}`
        );
    }
}

// Kết quả resolve giới hạn roster cho 1 season_team — gộp class_id (check
// cầu thủ cùng lớp) và min/max_players_per_team (check sĩ số ĐĂNG KÝ cho
// mùa giải này) trong 1 query, vì cả 2 đều cần join season_team -> team /
// season -> tournament_rule, tránh round-trip trùng lặp.
type SeasonTeamRosterConstraints = {
    teamClassId: number | null;
    // null = season chưa gán tournament_rule -> không enforce (migration-safe,
    // giống cách teamClassId == null bỏ qua check class-match).
    maxPlayers: number | null;
};

export class PlayerService {
    private readonly teamPlayerQuery: Queryable<TeamPlayerRow>;
    private readonly playerQuery: Queryable<PlayerRow>;
    constructor(
        private readonly prisma: PrismaClient
    ) {
        this.teamPlayerQuery = new Queryable<TeamPlayerRow>(prisma.teamPlayer, {
            select: TEAM_PLAYER_SELECT,
            sortable: ["jersey_number", "id", "created_at"],
            defaultSort: { column: "jersey_number", direction: "asc" },
            filterable: ["position", "status", "approval_status"],
            defaultPerPage: 20,
            maxPerPage: 100,
        });
        this.playerQuery = new Queryable<PlayerRow>(prisma.player, {
            select: PLAYER_PUBLIC_SELECT,
            sortable: ["id", "created_at", "date_of_birth"],
            defaultSort: { column: "id", direction: "desc" },
            filterable: ["position", "nationality"],
            defaultPerPage: 20,
            maxPerPage: 500,
        });

    }

    toPlayerPublicDto(row: PlayerPublicRow): PlayerPublicDto {
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

    listPlayers(query: Record<string, unknown>): Promise<PaginatedResult<PlayerPublicDto>> {
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
     *
     * LƯU Ý: createPlayer KHÔNG gắn player vào season_team nào cả (chỉ tạo
     * hồ sơ Player gắn với Team qua pool chung), nên KHÔNG áp
     * max_players_per_team ở đây — giới hạn đó chỉ áp khi tạo TeamPlayer
     * (đăng ký vào roster của 1 season cụ thể), xem addPlayerToTeam /
     * createPlayerForTeamWithUser / importTeamPlayersFromExcel bên dưới.
     * Tương tự, rule số áo theo vị trí (assertJerseyNumberMatchesPosition)
     * KHÔNG áp ở đây vì createPlayer không nhận jersey_number.
     */
    async createPlayer(dto: CreatePlayerDto): Promise<PlayerDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.user_id },
            select: { id: true },
        });
        if (!user) throw createAppError("NOT_FOUND", `User ${dto.user_id} not found`);

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

    async getPlayerById(id: number): Promise<PlayerDetailDto | null> {
        const player = await this.prisma.player.findFirst({
            where: { id, deleted_at: null },
            select: PLAYER_SELECT_WITH_SEASONS,
        });
        return player ? this.mapPlayerWithSeasons(player) : null;
    }

    private mapPlayerWithSeasons(p: PlayerWithSeasonsRow): PlayerDetailDto {
        const base = this.mapPlayer(p);
        const seasons: PlayerSeasonInfo[] = p.team_players.map((tp) => ({
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

    async getPlayerByIdOrFail(id: number): Promise<PlayerDto> {
        const player = await this.getPlayerById(id);
        if (!player) throw createAppError("NOT_FOUND", `Player ${id} not found`);
        return player;
    }

    async updatePlayer(id: number, dto: UpdatePlayerDto): Promise<PlayerDto> {
        const existing = await this.getPlayerByIdOrFail(id);

        storageService.replaceAsset(existing.avatar, dto.avatar, logger);

        const player = await this.prisma.player.update({
            where: { id },
            data: dto,
            select: PLAYER_SELECT,
        });
        return this.mapPlayer(player);
    }

    async softDeletePlayer(id: number): Promise<void> {
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

    private async ensurePlayerRole(
        userId: number,
        tx: Prisma.TransactionClient | PrismaClient = this.prisma
    ): Promise<void> {
        const role = await tx.role.findUnique({ where: { name: PLAYER_ROLE_NAME } });
        if (!role) {
            throw createAppError(
                "INTERNAL_SERVER_ERROR",
                `Role "${PLAYER_ROLE_NAME}" not found — kiểm tra lại seed data bảng roles`
            );
        }

        await tx.user_Role.upsert({
            where: { user_id_role_id: { user_id: userId, role_id: role.id } },
            create: { user_id: userId, role_id: role.id },
            update: {},
        });
    }

    /**
     * FIX (roster cap — bug chính): trước đây tournament_rule.max_players_per_team
     * tồn tại trong schema nhưng KHÔNG được đọc ở bất kỳ đâu. Team (Chelsea)
     * có thể chứa N cầu thủ không giới hạn (đúng ý đồ), nhưng TeamPlayer
     * luôn scope theo season_team_id — đây chính là "danh sách đăng ký cho
     * 1 mùa giải cụ thể" mà max_players_per_team phải áp, KHÔNG áp lên Team
     * (pool) và KHÔNG áp lên MatchLineup (đội hình ra sân từng trận, đã có
     * enum LineupType.starter/substitute lo phần đó rồi, khác phạm vi).
     *
     * Trả về null cho maxPlayers nếu season chưa gán tournament_rule —
     * migration-safe, giống pattern teamClassId == null ở trên.
     */
    private async getSeasonTeamRosterConstraints(
        seasonTeamId: number,
        tx: Prisma.TransactionClient | PrismaClient = this.prisma
    ): Promise<SeasonTeamRosterConstraints> {
        const seasonTeam = await tx.seasonTeam.findUniqueOrThrow({
            where: { id: seasonTeamId },
            select: {
                team: { select: { class_id: true } },
                season: {
                    select: {
                        tournamentRule: { select: { max_players_per_team: true } },
                    },
                },
            },
        });

        return {
            teamClassId: seasonTeam.team.class_id,
            maxPlayers: seasonTeam.season.tournamentRule?.max_players_per_team ?? null,
        };
    }

    /**
     * Đếm số TeamPlayer đã approved trong roster của season_team này — đây
     * là con số đối chiếu với max_players_per_team (chỉ cầu thủ approved
     * mới tính là "đã đăng ký chính thức"; pending/rejected không chiếm slot).
     * Luôn gọi trong CÙNG transaction với insert để thu hẹp race window
     * (2 request add cùng lúc gần chạm max).
     */
    private async assertRosterCapacity(
        seasonTeamId: number,
        maxPlayers: number | null,
        tx: Prisma.TransactionClient
    ): Promise<void> {
        if (maxPlayers == null) return;

        const approvedCount = await tx.teamPlayer.count({
            where: { season_team_id: seasonTeamId, approval_status: ApprovalStatus.approved },
        });
        if (approvedCount >= maxPlayers) {
            throw createAppError(
                "CONFLICT",
                `Đội đã đăng ký đủ ${maxPlayers} cầu thủ cho mùa giải này (theo tournament rule) — không thể thêm cầu thủ mới`
            );
        }
    }

    // ----------------------------------------------------------
    // INVITE TOKEN
    // ----------------------------------------------------------

    private inviteKey(tokenHash: string): string {
        return `invite:token:${tokenHash}`;
    }

    private async issueInviteToken(userId: number): Promise<string> {
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

        await redis.set(this.inviteKey(tokenHash), String(userId), {
            EX: INVITE_TOKEN_TTL_SECONDS,
        });

        return rawToken;
    }

    async consumeInviteToken(rawToken: string): Promise<number> {
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const key = this.inviteKey(tokenHash);

        const userId = await redis.get(key);
        if (!userId) {
            throw createAppError("BAD_REQUEST", "Invite token không hợp lệ hoặc đã hết hạn (quá 24h)");
        }

        await redis.del(key);
        return Number(userId);
    }

    async resendInvite(userId: number): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, password: true },
        });
        if (!user) throw createAppError("NOT_FOUND", `User ${userId} not found`);
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

    listTeamPlayers(query: ListTeamPlayersQuery): Promise<PaginatedResult<TeamPlayerDto>> {
        const { season_team_id, ...req } = query;
        return this.teamPlayerQuery
            .run(req, { beforeBuild: (where) => { where.push({ season_team_id }); } })
            .then((res) => ({ ...res, data: res.data.map((tp) => this.mapTeamPlayer(tp)) }));
    }

    async getTeamPlayerById(id: number, season_team_id: number): Promise<TeamPlayerDto | null> {
        const tp = await this.prisma.teamPlayer.findFirst({
            where: { id, season_team_id },
            select: TEAM_PLAYER_SELECT,
        });
        return tp ? this.mapTeamPlayer(tp) : null;
    }

    /**
     * FIX (roster cap): thêm assertRosterCapacity TRONG transaction, ngay
     * trước insert — chặn vượt max_players_per_team của tournament rule áp
     * cho season của season_team_id này. Đặt sau assertPlayerClassMatchesUser
     * và sau check trùng player/jersey (fail nhanh các lỗi rẻ trước, lỗi cần
     * transaction sau cùng).
     *
     * FIX (số áo theo vị trí): assertJerseyNumberMatchesPosition chạy NGAY
     * ĐẦU HÀM — fail nhanh nhất có thể (không tốn query DB nào) nếu cặp
     * position/jersey_number gửi lên đã sai quy ước trước khi làm bất cứ
     * việc gì khác.
     */
    async addPlayerToTeam(season_team_id: number, dto: AddPlayerToTeamDto): Promise<TeamPlayerDto> {
        assertJerseyNumberMatchesPosition(dto.position, dto.jersey_number);

        const player = await this.prisma.player.findFirst({
            where: { id: dto.player_id, deleted_at: null },
            select: { id: true, user_id: true },
        });
        if (!player) throw createAppError("NOT_FOUND", `Player ${dto.player_id} not found`);

        const { teamClassId, maxPlayers } = await this.getSeasonTeamRosterConstraints(season_team_id);

        const [dupPlayer, dupJersey] = await Promise.all([
            this.prisma.teamPlayer.findFirst({ where: { season_team_id, player_id: dto.player_id }, select: { id: true } }),
            this.prisma.teamPlayer.findFirst({ where: { season_team_id, jersey_number: dto.jersey_number }, select: { id: true } }),
        ]);
        if (dupPlayer) throw createAppError("CONFLICT", "Player already in team");
        if (dupJersey) throw createAppError("CONFLICT", `Số Áo ${dto.jersey_number} đã được sử dụng trong đội`);

        try {
            const tp = await this.prisma.$transaction(async (tx) => {
                await this.assertRosterCapacity(season_team_id, maxPlayers, tx);

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
        } catch (err) {
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
     * FIX (roster cap): assertRosterCapacity chạy trong cùng tx, ngay trước
     * insert TeamPlayer — cùng vị trí như addPlayerToTeam.
     *
     * FIX (số áo theo vị trí): assertJerseyNumberMatchesPosition chạy NGAY
     * ĐẦU HÀM, trước cả việc query dupJersey / tạo user mới — fail nhanh,
     * không tốn công tạo tài khoản mới rồi mới phát hiện số áo sai vị trí.
     *
     * LƯU Ý CÒN HỞ: user mới tạo có class_id = null (chưa gán lớp), nên
     * assertPlayerClassMatchesUser sẽ pass cho user mới bất kể team thuộc
     * lớp nào (điều kiện `teamClassId != null && user.class_id !== ...`
     * chỉ fail khi cả 2 khác nhau VÀ đều có giá trị). Nếu cần chặn cứng
     * "user phải có lớp trước khi vào team", phải thêm field class_id vào
     * CreatePlayerForTeamDto và set ngay lúc tạo user — hỏi lại UX trước
     * khi đổi, vì hiện tại đang cho phép admin gán lớp sau.
     */
    async createPlayerForTeamWithUser(season_team_id: number, dto: CreatePlayerForTeamDto): Promise<TeamPlayerDto> {
        assertJerseyNumberMatchesPosition(dto.position, dto.jersey_number);

        const dupJersey = await this.prisma.teamPlayer.findFirst({
            where: { season_team_id, jersey_number: dto.jersey_number },
            select: { id: true },
        });
        if (dupJersey) throw createAppError("CONFLICT", `Số Áo ${dto.jersey_number} đã được sử dụng trong đội`);

        let createdNewUserId: number | null = null;

        const { teamClassId, maxPlayers } = await this.getSeasonTeamRosterConstraints(season_team_id);

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
                } else if (!user.student_code && dto.student_code) {
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
                } else {
                    const alreadyInTeam = await tx.teamPlayer.findFirst({
                        where: { season_team_id, player_id: player.id },
                        select: { id: true },
                    });
                    if (alreadyInTeam) throw createAppError("CONFLICT", "Player already in team");
                }

                await this.assertRosterCapacity(season_team_id, maxPlayers, tx);

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
                } catch (err) {
                    logger.error(`Failed to issue invite / send email to ${dto.user_email}`);
                }
            }

            return this.mapTeamPlayer(tp);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw createAppError("CONFLICT", "Trùng dữ liệu — request khác vừa thêm player/số áo này");
            }
            throw err;
        }
    }

    /**
     * FIX (số áo theo vị trí): updateTeamPlayer có thể sửa jersey_number
     * và/hoặc position ĐỘC LẬP với nhau (chỉ 1 trong 2 field, hoặc cả 2).
     * Validate cô lập từng field đang đổi là KHÔNG đủ — ví dụ đổi
     * position từ forward -> goalkeeper mà không đổi jersey_number thì số
     * áo cũ (vd 10) không còn hợp lệ với vị trí mới, dù dto không hề gửi
     * jersey_number. Nên PHẢI merge dto với giá trị hiện có rồi validate
     * lại CẶP GIÁ TRỊ SAU KHI MERGE.
     */
    async updateTeamPlayer(id: number, season_team_id: number, dto: UpdateTeamPlayerDto): Promise<TeamPlayerDto> {
        const existing = await this.prisma.teamPlayer.findFirst({
            where: { id, season_team_id },
            select: { id: true, user_id: true, position: true, jersey_number: true },
        });
        if (!existing) throw createAppError("NOT_FOUND", `TeamPlayer ${id} not found in season_team ${season_team_id}`);

        if (dto.position != null || dto.jersey_number != null) {
            const resolvedPosition = dto.position ?? existing.position;
            const resolvedJerseyNumber = dto.jersey_number ?? existing.jersey_number;
            assertJerseyNumberMatchesPosition(resolvedPosition, resolvedJerseyNumber);
        }

        // FIX (roster cap): updateTeamPlayer có thể dùng để approve một
        // TeamPlayer đang pending (approval_status: pending -> approved) —
        // đường này KHÔNG đi qua addPlayerToTeam/createPlayerForTeamWithUser
        // nên roster cap phải re-check ở đây nếu request đang chuyển sang
        // approved, nếu không admin có thể approve vượt max_players_per_team
        // qua route generic update. Các field khác (jersey_number, position...)
        // không ảnh hưởng sĩ số nên không cần check.
        if (dto.approval_status === ApprovalStatus.approved) {
            const { maxPlayers } = await this.getSeasonTeamRosterConstraints(season_team_id);
            if (maxPlayers != null) {
                const approvedCount = await this.prisma.teamPlayer.count({
                    where: {
                        season_team_id,
                        approval_status: ApprovalStatus.approved,
                        id: { not: id },
                    },
                });
                if (approvedCount >= maxPlayers) {
                    throw createAppError(
                        "CONFLICT",
                        `Đội đã đăng ký đủ ${maxPlayers} cầu thủ cho mùa giải này (theo tournament rule) — không thể approve thêm`
                    );
                }
            }
        }

        const tp = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.teamPlayer.update({ where: { id }, data: dto, select: TEAM_PLAYER_SELECT });
            if (existing.user_id) await this.ensurePlayerRole(existing.user_id, tx);
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

    approveTeamPlayer(id: number, season_team_id: number): Promise<TeamPlayerDto> {
        return this.updateTeamPlayer(id, season_team_id, { approval_status: ApprovalStatus.approved });
    }

    rejectTeamPlayer(id: number, season_team_id: number): Promise<TeamPlayerDto> {
        return this.updateTeamPlayer(id, season_team_id, { approval_status: ApprovalStatus.rejected });
    }

    // ----------------------------------------------------------
    // BULK DELETE — TeamPlayer không soft-delete được (không có is_active/
    // deleted_at trên schema). Xoá cứng + ghi TeamPlayerHistory trong cùng
    // transaction để giữ lịch sử rời đội.
    // ----------------------------------------------------------


    async bulkDeleteTeamPlayers(
        season_team_id: number,
        dto: BulkDeleteDto,
    ): Promise<{ deleted: number; notFound: number[] }> {
        const existing = await this.prisma.teamPlayer.findMany({
            where: { id: { in: dto.ids }, season_team_id },
            select: { id: true, player_id: true, jersey_number: true, position: true, role: true, joined_at: true },
        });

        const existingIds = new Set(existing.map((r) => r.id));
        const notFound = dto.ids.filter((id) => !existingIds.has(id));
        if (existing.length === 0) return { deleted: 0, notFound };

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

    async hardDeleteTeamPlayers(
        season_team_id: number,
        dto: BulkDeleteDto,
        reason: LeaveReason = LeaveReason.dropped
    ): Promise<{ deleted: number; notFound: number[] }> {
        const existing = await this.prisma.teamPlayer.findMany({
            where: { id: { in: dto.ids }, season_team_id },
            select: { id: true, player_id: true, jersey_number: true, position: true, role: true, joined_at: true },
        });

        const existingIds = new Set(existing.map((r) => r.id));
        const notFound = dto.ids.filter((id) => !existingIds.has(id));
        if (existing.length === 0) return { deleted: 0, notFound };

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
    async getPlayerTeamHistory(player_id: number) {
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

    async exportTeamPlayersExcel(season_team_id: number): Promise<Buffer> {
        const records = await this.prisma.teamPlayer.findMany({
            where: { season_team_id },
            select: TEAM_PLAYER_SELECT,
            orderBy: { jersey_number: "asc" },
        });

        const rows = records.map((tp: any) => ({
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

    async exportImportTemplate(minRows = 5): Promise<Buffer> {
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

        for (let i = 1; i < minRows; i++) ws.addRow({});

        const wsInfo = wb.addWorksheet("Hướng dẫn");
        wsInfo.columns = [
            { header: "Cột", key: "field", width: 24 },
            { header: "Mô tả / Yêu cầu", key: "note", width: 60 },
        ];

        const positionHint = Object.values(PlayerPosition).join(" | ");
        // FIX: thêm dòng hướng dẫn số áo theo vị trí vào sheet "Hướng dẫn"
        // — trước đây rule này chỉ nằm trong code, người điền file Excel
        // không có cách nào biết trước mà tránh, phải nộp lên mới bị BE
        // trả lỗi.
        const jerseyHint = (Object.keys(POSITION_JERSEY_NUMBERS) as PlayerPosition[])
            .map((pos) => `${POSITION_LABEL_VN[pos]}: ${POSITION_JERSEY_NUMBERS[pos].join(", ")}`)
            .join(" | ");
        const instructions = [
            { field: "name", note: "Họ và tên đầy đủ — bắt buộc. Dùng để tạo tài khoản mới nếu email chưa có trong hệ thống." },
            { field: "email", note: "Bắt buộc. Nếu email đã có tài khoản → gắn cầu thủ vào tài khoản đó. Nếu chưa có → hệ thống tự tạo tài khoản (chưa có mật khẩu) và gửi email mời đặt mật khẩu, hiệu lực 24h." },
            { field: "student_code", note: "MSSV — bắt buộc. Xác nhận tư cách sinh viên, điều kiện tiên quyết để tham gia đội." },
            { field: "jersey_number", note: `Số nguyên, duy nhất trong đội, PHẢI thuộc dải cho phép của vị trí: ${jerseyHint}` },
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
     * user có sẵn nhưng chưa có. assertPlayerClassMatchesUser chạy trong
     * tx per-row, TRƯỚC khi tạo TeamPlayer — lỗi rơi vào catch hiện có,
     * tự động log vào result.errors[].reason theo đúng hành vi cũ (1 dòng
     * lỗi không ảnh hưởng dòng khác).
     *
     * FIX (roster cap): maxPlayers resolve 1 lần cho toàn batch (cố định
     * theo season_team_id, giống teamClassId). approvedCount khởi tạo từ
     * số TeamPlayer approved hiện có, tăng dần in-memory sau mỗi dòng
     * thành công — tránh query count lại DB mỗi dòng (N round-trip thừa),
     * cùng pattern với usedJerseyNumbers/teamPlayerSet đã có sẵn. Dòng nào
     * vượt max bị fail với lý do rõ ràng, KHÔNG chặn các dòng còn lại.
     *
     * FIX (số áo theo vị trí — bug chính của lần sửa này): trước đây rule
     * số áo theo vị trí CHỈ tồn tại ở FE, nhánh Import Excel hoàn toàn
     * không check gì — 1 file Excel có thể gán số áo bất kỳ 1-99 cho bất
     * kỳ vị trí nào mà vẫn import thành công. Check ngay sau bước validate
     * jersey_number != null (rẻ, không tốn query DB nào), TRƯỚC khi query
     * users/players/existingTeamPlayers cho cả batch — dòng nào sai vị
     * trí/số áo bị đánh fail sớm, không kéo theo các dòng khác.
     */
    async importTeamPlayersFromExcel(
        season_team_id: number,
        fileBuffer: Buffer | Uint8Array | ArrayBuffer
    ): Promise<ImportResult> {
        const wb = new ExcelJS.Workbook();
        try {
            await wb.xlsx.load(fileBuffer as any);
        } catch (err) {
            throw createAppError("BAD_REQUEST", "File Excel không hợp lệ hoặc bị hỏng");
        }

        const ws = wb.worksheets[0];
        if (!ws) throw createAppError("BAD_REQUEST", "Excel file has no sheets");

        const raw = worksheetToRawRows(ws);
        if (raw.length > MAX_IMPORT_ROWS) {
            throw createAppError("BAD_REQUEST", `File has ${raw.length} rows, max ${MAX_IMPORT_ROWS} allowed`);
        }

        const result: ImportResult = { success: 0, failed: 0, skipped: 0, errors: [], skippedRows: [] };

        type ValidRow = { rowNum: number; dto: ImportPlayerRowDto };
        const validRows: ValidRow[] = [];
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
            } else {
                validRows.push({ rowNum, dto: parsed.data });
            }
        }
        if (validRows.length === 0) return result;

        const { teamClassId, maxPlayers } = await this.getSeasonTeamRosterConstraints(season_team_id);

        const emails = [...new Set(validRows.map((r) => r.dto.user_email))];
        const users = await this.prisma.user.findMany({
            where: { email: { in: emails } },
            select: { id: true, email: true, student_code: true, class_id: true },
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
            this.prisma.teamPlayer.findMany({
                where: { season_team_id },
                select: { player_id: true, jersey_number: true, approval_status: true },
            }),
        ]);

        const playerByUserId = new Map(players.map((p) => [p.user_id, p.id]));
        const teamPlayerSet = new Set(existingTeamPlayers.map((tp) => tp.player_id));
        const usedJerseyNumbers = new Set(existingTeamPlayers.map((tp) => tp.jersey_number));
        // FIX (roster cap): approvedCount khởi tạo từ DB, tăng dần in-memory —
        // chỉ TeamPlayer approved mới chiếm slot max_players_per_team.
        let approvedCount = existingTeamPlayers.filter((tp) => tp.approval_status === ApprovalStatus.approved).length;

        const playerRole = await this.prisma.role.findUnique({ where: { name: PLAYER_ROLE_NAME } });
        if (!playerRole) {
            throw createAppError(
                "INTERNAL_SERVER_ERROR",
                `Role "${PLAYER_ROLE_NAME}" not found — kiểm tra lại seed data bảng roles trước khi import`
            );
        }
        for (const { rowNum, dto } of validRows) {
            if (dto.jersey_number == null) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: "jersey_number required for team assignment" });
                continue;
            }

            // FIX (số áo theo vị trí): check ngay sau khi biết jersey_number
            // không null, TRƯỚC mọi query/side-effect khác của dòng này.
            try {
                assertJerseyNumberMatchesPosition(dto.position, dto.jersey_number);
            } catch (err) {
                result.failed++;
                result.errors.push({
                    row: rowNum,
                    reason: err instanceof Error ? err.message : "Số áo không hợp lệ cho vị trí",
                });
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
                    const studentCode = studentCodeByUserId.get(existingUserId!);
                    const classId = classIdByUserId.get(existingUserId!);
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
                result.errors.push({ row: rowNum, reason: `Số Áo ${dto.jersey_number} đã được sử dụng trong đội` });
                continue;
            }

            // FIX (roster cap): check trước khi tốn công tạo user/player mới —
            // dòng nào vượt max fail ngay, không rollback các dòng đã thành công.
            if (maxPlayers != null && approvedCount >= maxPlayers) {
                result.failed++;
                result.errors.push({
                    row: rowNum,
                    reason: `Đội đã đăng ký đủ ${maxPlayers} cầu thủ cho mùa giải này (theo tournament rule)`,
                });
                continue;
            }

            let createdNewUserId: number | null = null;

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
                    } else if (!studentCodeByUserId.get(userId) && dto.student_code) {
                        await tx.user.update({ where: { id: userId }, data: { student_code: dto.student_code } });
                        studentCodeByUserId.set(userId, dto.student_code);
                    }
                    // Re-check trong tx để thu hẹp race window giữa lúc đọc
                    // approvedCount in-memory ở trên và lúc insert thật —
                    // cùng lý do addPlayerToTeam/createPlayerForTeamWithUser
                    // gọi assertRosterCapacity bên trong transaction.
                    await this.assertRosterCapacity(season_team_id, maxPlayers, tx);

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
                            season_team_id,
                            player_id: playerId,
                            jersey_number: dto.jersey_number!,
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
                approvedCount++;
                result.success++;

                if (createdNewUserId) {
                    try {
                        const inviteToken = await this.issueInviteToken(createdNewUserId);
                        await mailService.sendInviteEmail(dto.user_email, { token: inviteToken, name: dto.name });
                    } catch (err) {
                        logger.error(`Failed to issue invite / send email to ${dto.user_email} (row ${rowNum})`);
                    }
                }
            } catch (err) {
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
    /**
     * Copy roster từ 1 season_team NGUỒN sang season_team ĐÍCH — dùng khi đội
     * đăng ký mùa giải mới và muốn kế thừa danh sách cầu thủ cũ thay vì
     * add/import lại từ đầu. Chỉ copy TeamPlayer đang approved (không copy
     * pending/rejected). approval_status luôn reset về 'approved' vì đây là
     * đăng ký MỚI cho mùa MỚI, không kế thừa lịch sử duyệt của mùa cũ.
     *
     * Roster cap của season ĐÍCH vẫn được enforce (assertRosterCapacity) —
     * nếu roster nguồn > max_players_per_team của season đích, dừng lại và
     * báo lỗi rõ ràng thay vì copy tràn giới hạn.
     *
     * FIX (số áo theo vị trí): rule POSITION_JERSEY_NUMBERS được thêm SAU
     * khi nhiều roster cũ đã tồn tại — dữ liệu nguồn có thể có cặp
     * (position, jersey_number) không còn hợp lệ theo rule mới. Validate
     * TRƯỚC khi copy từng dòng, KHÔNG chặn cả batch — dòng nào vi phạm bị
     * đẩy vào `errors` (giống cách xử lý trùng số áo/vượt cap hiện có),
     * các dòng hợp lệ khác vẫn copy bình thường. Leader thấy rõ dòng nào
     * cần sửa thủ công (đổi vị trí hoặc đổi số áo) trước khi thêm lại.
     */
    async copyRosterToSeasonTeam(
        fromSeasonTeamId: number,
        toSeasonTeamId: number
    ): Promise<{ copied: number; skipped: number; errors: { player_id: number; reason: string }[] }> {
        if (fromSeasonTeamId === toSeasonTeamId) {
            throw createAppError("BAD_REQUEST", "Season_team nguồn và đích không được trùng nhau");
        }

        const [fromTeam, toTeam] = await Promise.all([
            this.prisma.seasonTeam.findUnique({ where: { id: fromSeasonTeamId }, select: { id: true, team_id: true } }),
            this.prisma.seasonTeam.findUnique({ where: { id: toSeasonTeamId }, select: { id: true, team_id: true } }),
        ]);
        if (!fromTeam) throw createAppError("NOT_FOUND", `SeasonTeam ${fromSeasonTeamId} not found`);
        if (!toTeam) throw createAppError("NOT_FOUND", `SeasonTeam ${toSeasonTeamId} not found`);
        if (fromTeam.team_id !== toTeam.team_id) {
            throw createAppError("BAD_REQUEST", "Chỉ có thể copy roster giữa các season_team CÙNG một team");
        }

        const sourcePlayers = await this.prisma.teamPlayer.findMany({
            where: { season_team_id: fromSeasonTeamId, approval_status: ApprovalStatus.approved },
            select: { player_id: true, jersey_number: true, position: true, role: true, user_id: true },
        });
        if (sourcePlayers.length === 0) {
            return { copied: 0, skipped: 0, errors: [] };
        }

        const { maxPlayers } = await this.getSeasonTeamRosterConstraints(toSeasonTeamId);

        const existingInDest = await this.prisma.teamPlayer.findMany({
            where: { season_team_id: toSeasonTeamId },
            select: { player_id: true, jersey_number: true },
        });
        const existingPlayerIds = new Set(existingInDest.map(p => p.player_id));
        const existingJerseys = new Set(existingInDest.map(p => p.jersey_number));

        let approvedCount = existingInDest.length; // tất cả TeamPlayer tạo qua copy đều approved
        let copied = 0, skipped = 0;
        const errors: { player_id: number; reason: string }[] = [];

        for (const p of sourcePlayers) {
            if (existingPlayerIds.has(p.player_id)) {
                skipped++;
                continue;
            }

            try {
                assertJerseyNumberMatchesPosition(p.position, p.jersey_number);
            } catch (err) {
                errors.push({
                    player_id: p.player_id,
                    reason: err instanceof Error ? err.message : "Số áo không hợp lệ cho vị trí (dữ liệu cũ không còn hợp lệ)",
                });
                continue;
            }

            if (existingJerseys.has(p.jersey_number)) {
                errors.push({ player_id: p.player_id, reason: `Số áo ${p.jersey_number} đã dùng ở season đích` });
                continue;
            }
            if (maxPlayers != null && approvedCount >= maxPlayers) {
                errors.push({ player_id: p.player_id, reason: `Đã đạt giới hạn ${maxPlayers} cầu thủ của season đích` });
                continue;
            }

            try {
                await this.prisma.$transaction(async (tx) => {
                    await this.assertRosterCapacity(toSeasonTeamId, maxPlayers, tx);
                    await tx.teamPlayer.create({
                        data: {
                            season_team_id: toSeasonTeamId,
                            player_id: p.player_id,
                            jersey_number: p.jersey_number,
                            position: p.position,
                            role: p.role,
                            user_id: p.user_id,
                            approval_status: ApprovalStatus.approved,
                        },
                    });
                });
                existingJerseys.add(p.jersey_number);
                approvedCount++;
                copied++;
            } catch (err) {
                errors.push({
                    player_id: p.player_id,
                    reason: err instanceof Error ? err.message : "Unknown error",
                });
            }
        }

        return { copied, skipped, errors };
    }
    // ----------------------------------------------------------
    // MAPPERS
    // ----------------------------------------------------------

    private mapPlayer(p: PlayerRow): PlayerDto {
        return {
            ...p,
            height: p.height ? Number(p.height) : null,
            weight: p.weight ? Number(p.weight) : null,
        };
    }

    private mapTeamPlayer(tp: TeamPlayerRow): TeamPlayerDto {
        return {
            ...tp,
            player: tp.player ? this.mapPlayer(tp.player) : null,
        };
    }
}