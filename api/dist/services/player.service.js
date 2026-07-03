import * as XLSX from "xlsx";
import { importPlayerRowSchema } from "../dtos/player.schema.js";
import { Queryable } from "../libs/queryable.js";
import { createAppError } from "../common/app.error.js";
import { ApprovalStatus, PlayerPosition, Prisma } from "../generated/prisma/client.js";
import { storageService } from "./storage.service.js";
import { logger } from "../libs/logger.js";
import { PLAYER_SELECT, TEAM_PLAYER_SELECT } from "../types/player.type.js";
const MAX_IMPORT_ROWS = 200;
// ─── Service ──────────────────────────────────────────────────────────────────
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
    async createPlayer(dto) {
        const player = await this.prisma.player.create({
            data: dto,
            select: PLAYER_SELECT,
        });
        return this.mapPlayer(player);
    }
    async getPlayerById(id) {
        const player = await this.prisma.player.findFirst({
            where: { id, deleted_at: null },
            select: PLAYER_SELECT,
        });
        return player ? this.mapPlayer(player) : null;
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
    async addPlayerToTeam(team_id, dto, user_id) {
        // FIX: pre-check duplicate trước khi insert để trả message VN rõ ràng,
        // thay vì phụ thuộc controller/middleware map P2002 (không tồn tại trong
        // PlayerController hiện tại → race trước fix này trả raw Prisma 500).
        // Vẫn giữ @@unique DB làm lưới an toàn cuối cho race condition thật.
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
            const tp = await this.prisma.teamPlayer.create({
                data: {
                    team_id,
                    player_id: dto.player_id,
                    jersey_number: dto.jersey_number,
                    position: dto.position,
                    role: dto.role,
                    ...(user_id && { user_id }),
                },
                select: TEAM_PLAYER_SELECT,
            });
            return this.mapTeamPlayer(tp);
        }
        catch (err) {
            // Race window giữa pre-check và create (2 request đồng thời) → P2002 thật.
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw createAppError("CONFLICT", "Trùng dữ liệu — request khác vừa thêm player/số áo này");
            }
            throw err;
        }
    }
    async updateTeamPlayer(id, dto) {
        const exists = await this.prisma.teamPlayer.findFirst({
            where: { id, deleted_at: null },
            select: { id: true },
        });
        if (!exists)
            throw createAppError("NOT_FOUND", `TeamPlayer ${id} not found`);
        const tp = await this.prisma.teamPlayer.update({
            where: { id },
            data: dto,
            select: TEAM_PLAYER_SELECT,
        });
        return this.mapTeamPlayer(tp);
    }
    approveTeamPlayer(id) {
        return this.updateTeamPlayer(id, { approval_status: ApprovalStatus.approved });
    }
    rejectTeamPlayer(id) {
        return this.updateTeamPlayer(id, { approval_status: ApprovalStatus.rejected });
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
        const ws = XLSX.utils.json_to_sheet(rows);
        ws["!cols"] = [
            { wch: 6 }, { wch: 24 }, { wch: 28 }, { wch: 12 },
            { wch: 14 }, { wch: 10 }, { wch: 16 }, { wch: 12 },
            { wch: 14 }, { wch: 8 }, { wch: 8 },
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Players");
        return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    }
    /**
     * Template có sẵn `minRows` dòng trống (mặc định 7 — số cầu thủ tối thiểu/đội)
     * + sheet "Instructions" tách riêng enum hint khỏi vùng data, tránh leader
     * hiểu nhầm "goalkeeper|defender|..." là 1 giá trị hợp lệ để nguyên.
     * Enum lấy trực tiếp từ Prisma generated client — không hardcode string,
     * tránh drift khi schema.prisma đổi.
     */
    exportImportTemplate(minRows = 7) {
        const wb = XLSX.utils.book_new();
        const sampleRow = {
            jersey_number: 10, user_email: "player1@example.com",
            date_of_birth: "2000-01-15", position: PlayerPosition.forward,
            height: 175, weight: 70, nationality: "Vietnam",
        };
        const blankRow = {
            jersey_number: "", user_email: "", date_of_birth: "",
            position: "", height: "", weight: "", nationality: "",
        };
        const rows = [
            sampleRow,
            ...Array.from({ length: Math.max(minRows - 1, 0) }, () => ({ ...blankRow })),
        ];
        const ws = XLSX.utils.json_to_sheet(rows);
        ws["!cols"] = [
            { wch: 6 }, { wch: 28 }, { wch: 14 }, { wch: 14 },
            { wch: 8 }, { wch: 8 }, { wch: 14 },
        ];
        XLSX.utils.book_append_sheet(wb, ws, "Players");
        const positionHint = Object.values(PlayerPosition).join(" | ");
        const instructions = [
            { field: "jersey_number", note: "Số nguyên 1-99, duy nhất trong đội" },
            { field: "user_email", note: "Email tài khoản đã đăng ký trong hệ thống" },
            { field: "date_of_birth", note: "Định dạng YYYY-MM-DD" },
            { field: "position", note: positionHint },
            { field: "height", note: "cm, có thể để trống" },
            { field: "weight", note: "kg, có thể để trống" },
            { field: "nationality", note: "Có thể để trống" },
            { field: "", note: `Đội cần tối thiểu ${minRows} cầu thủ` },
            { field: "", note: `Tối đa ${MAX_IMPORT_ROWS} dòng / file` },
        ];
        const wsInfo = XLSX.utils.json_to_sheet(instructions);
        wsInfo["!cols"] = [{ wch: 16 }, { wch: 55 }];
        XLSX.utils.book_append_sheet(wb, wsInfo, "Instructions");
        return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    }
    // ----------------------------------------------------------
    // IMPORT EXCEL
    // ----------------------------------------------------------
    /**
     * Per-row transaction → partial success.
     *
     * playerByUserId / teamPlayerSet / usedJerseyNumbers chỉ được cập nhật SAU KHI
     * transaction commit thành công (ngoài closure). Set state trong tx callback
     * trước throw ở bước sau sẽ khiến rollback không đồng bộ với local cache, làm
     * row kế tiếp tưởng player đã tồn tại → insert teamPlayer trỏ player_id không
     * có thật trong DB.
     *
     * OPTION A (đã chốt): TeamPlayer.position là nguồn sự thật cho context team này,
     * ĐỘC LẬP với Player.position. Khi player đã tồn tại (existingPlayerId có sẵn),
     * KHÔNG update Player.position dù dto.position khác — đây là intent, không phải bug.
     * Lý do: 1 player có thể đăng ký nhiều đội với vị trí thi đấu khác nhau, hồ sơ gốc
     * (Player.position) chỉ set 1 lần lúc tạo mới, không bị leader import ghi đè.
     */
    async importTeamPlayersFromExcel(team_id, fileBuffer) {
        const wb = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
        const sheetName = wb.SheetNames[0];
        if (!sheetName)
            throw createAppError('BAD_REQUEST', 'Excel file has no sheets');
        const ws = wb.Sheets[sheetName];
        if (!ws)
            throw createAppError('BAD_REQUEST', `Sheet "${sheetName}" is empty or corrupted`);
        const raw = XLSX.utils.sheet_to_json(ws, { defval: null });
        // FIX: cap số dòng trước khi validate/loop — tránh block event loop nếu
        // leader paste nhầm file lớn.
        if (raw.length > MAX_IMPORT_ROWS) {
            throw createAppError('BAD_REQUEST', `File has ${raw.length} rows, max ${MAX_IMPORT_ROWS} allowed`);
        }
        const result = { success: 0, failed: 0, errors: [] };
        const validRows = [];
        for (let i = 0; i < raw.length; i++) {
            const rowNum = i + 2;
            const parsed = importPlayerRowSchema.safeParse(raw[i]);
            if (!parsed.success) {
                result.failed++;
                result.errors.push({
                    row: rowNum,
                    reason: parsed.error.issues
                        .map((e) => `${e.path.join('.')}: ${e.message}`)
                        .join('; '),
                });
            }
            else {
                validRows.push({ rowNum, dto: parsed.data });
            }
        }
        if (validRows.length === 0)
            return result;
        // ── Phase 2: batch pre-fetch snapshot ───────────────────────────────────
        // user_email đã normalize lowercase/trim ở schema (zod transform), nên
        // match ở đây consistent nếu DB cũng lưu lowercase. Nếu DB không enforce
        // lowercase, cân nhắc unique index case-insensitive (citext / lower(email)).
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
        // ── Phase 3: per-row transaction ─────────────────────────────────────────
        for (const { rowNum, dto } of validRows) {
            const userId = userByEmail.get(dto.user_email);
            if (!userId) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: `User not found: ${dto.user_email}` });
                continue;
            }
            if (dto.jersey_number == null) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: 'jersey_number required for team assignment' });
                continue;
            }
            if (usedJerseyNumbers.has(dto.jersey_number)) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: `Jersey number ${dto.jersey_number} đã được sử dụng trong đội` });
                continue;
            }
            const existingPlayerId = playerByUserId.get(userId);
            if (existingPlayerId && teamPlayerSet.has(existingPlayerId)) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: 'Player already in team' });
                continue;
            }
            try {
                const committedPlayerId = await this.prisma.$transaction(async (tx) => {
                    let playerId = existingPlayerId;
                    if (!playerId) {
                        // Player mới → Player.position set từ dto (1 lần duy nhất lúc tạo).
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
                    // else: player đã tồn tại → KHÔNG update Player.position (Option A, xem docstring).
                    await tx.teamPlayer.create({
                        data: {
                            team_id,
                            player_id: playerId,
                            jersey_number: dto.jersey_number,
                            position: dto.position, // luôn set — context vị trí riêng cho team này
                            role: 'player',
                        },
                    });
                    return playerId;
                });
                playerByUserId.set(userId, committedPlayerId);
                teamPlayerSet.add(committedPlayerId);
                usedJerseyNumbers.add(dto.jersey_number);
                result.success++;
            }
            catch (err) {
                result.failed++;
                const isDuplicate = err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
                result.errors.push({
                    row: rowNum,
                    reason: isDuplicate
                        ? 'Trùng dữ liệu (jersey_number hoặc player đã có trong đội — race condition với request khác)'
                        : (err instanceof Error ? err.message : 'Unknown error'),
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