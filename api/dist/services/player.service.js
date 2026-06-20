import * as XLSX from "xlsx";
import { importPlayerRowSchema } from "../dtos/player.schema.js";
import { Queryable } from "../libs/queryable.js";
import { createAppError } from "../common/app.error.js";
import { ApprovalStatus } from "../generated/prisma/client.js";
import { storageService } from "./storage.service.js";
import { logger } from "../libs/logger.js";
import { PLAYER_SELECT, TEAM_PLAYER_SELECT } from "../types/player.type.js";
// ─── Service ──────────────────────────────────────────────────────────────────
export class PlayerService {
    prisma;
    teamPlayerQuery;
    constructor(prisma) {
        this.prisma = prisma;
        // KHÔNG đặt beforeBuild ở baseConfig: team_id chỉ có tại thời điểm
        // gọi run(), không có tại constructor. beforeBuild thật sự dùng để
        // filter team_id + deleted_at được truyền qua overrideConfig trong
        // listTeamPlayers() — xem comment ở đó.
        //
        // searchFields/sortable chỉ support flat field trên TeamPlayer
        // (QueryBuilder dùng {[field]: value} trực tiếp) — không join qua
        // player.user. Search theo tên/email phải tự query riêng nếu cần.
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
        // getPlayerByIdOrFail thay cho assertPlayerExists — tránh 2 round trip,
        // vừa validate exists vừa lấy avatar cũ để replaceAsset.
        const existing = await this.getPlayerByIdOrFail(id);
        // Fire-and-forget: không block update nếu Cloudinary fail.
        // existing.avatar là publicId-based URL, StorageService.extractPublicId
        // parse ra publicId trước khi delete.
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
        // Avatar không còn accessible sau soft delete — cleanup Cloudinary luôn.
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
        // overrideConfig REPLACE toàn bộ baseConfig.beforeBuild, không merge —
        // nên phải tự push đủ điều kiện fixed (team_id + deleted_at) ở đây,
        // không thể assume base có sẵn deleted_at filter nào khác.
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
        // P2002 trên [team_id, player_id] hoặc [team_id, jersey_number]
        // — KHÔNG catch ở đây, để caller (controller) map P2002 → 409 Conflict.
        // Catch + rethrow generic Error ở đây sẽ làm mất prisma error code,
        // controller không phân biệt được lý do conflict (player vs jersey).
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
    /** Hard delete — admin/cleanup only. Cascade schema xử lý seasonTeamPlayers. */
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
    exportImportTemplate() {
        const headers = [
            {
                jersey_number: 10, user_email: "player@example.com", date_of_birth: "2000-01-15",
                position: "goalkeeper|defender|midfielder|forward", height: 175, weight: 70, nationality: "Vietnam",
            },
        ];
        const ws = XLSX.utils.json_to_sheet(headers);
        ws["!cols"] = [
            { wch: 6 }, { wch: 28 }, { wch: 14 }, { wch: 36 },
            { wch: 8 }, { wch: 8 }, { wch: 14 },
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    }
    // ----------------------------------------------------------
    // IMPORT EXCEL
    // ----------------------------------------------------------
    /**
     * Per-row transaction → partial success. KHÔNG dùng 1 transaction bọc
     * toàn bộ loop: file lớn (vài trăm row) sẽ giữ transaction mở quá lâu,
     * tăng lock contention trên teamPlayer/player table. Trade-off: mất
     * atomicity toàn file, đổi lại import 500 dòng không block ghi khác.
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
        const emails = [...new Set(validRows.map((r) => r.dto.user_email))];
        const users = await this.prisma.user.findMany({
            where: { email: { in: emails } },
            select: { id: true, email: true },
        });
        const userByEmail = new Map(users.map((u) => [u.email, u.id]));
        // Re-fetch players after we have user ids
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
                select: { player_id: true },
            }),
        ]);
        const playerByUserId = new Map(players.map((p) => [p.user_id, p.id]));
        const teamPlayerSet = new Set(existingTeamPlayers.map((tp) => tp.player_id));
        // ── Phase 3: per-row transaction — chỉ còn create, không có lookup ──────
        for (const { rowNum, dto } of validRows) {
            const userId = userByEmail.get(dto.user_email);
            if (!userId) {
                result.failed++;
                result.errors.push({ row: rowNum, reason: `User not found: ${dto.user_email}` });
                continue;
            }
            try {
                await this.prisma.$transaction(async (tx) => {
                    let playerId = playerByUserId.get(userId);
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
                        playerByUserId.set(userId, playerId); // update local snapshot
                    }
                    if (teamPlayerSet.has(playerId)) {
                        throw createAppError('CONFLICT', 'Player already in team');
                    }
                    if (!dto.jersey_number) {
                        throw createAppError('BAD_REQUEST', 'jersey_number required for team assignment');
                    }
                    await tx.teamPlayer.create({
                        data: {
                            team_id,
                            player_id: playerId,
                            jersey_number: dto.jersey_number,
                            position: dto.position,
                            role: 'player',
                        },
                    });
                    teamPlayerSet.add(playerId); // prevent duplicate trong cùng file
                });
                result.success++;
            }
            catch (err) {
                result.failed++;
                result.errors.push({
                    row: rowNum,
                    reason: err instanceof Error ? err.message : 'Unknown error',
                });
            }
        }
        return result;
    }
    // ----------------------------------------------------------
    // MAPPERS — typed theo select payload, không còn `any`
    // ----------------------------------------------------------
    /**
     * Không map field-by-field vì PlayerRow (Prisma payload) đã match
     * PlayerDto 1:1 nhờ PLAYER_SELECT satisfies Prisma.PlayerSelect.
     * Chỉ height/weight cần convert Decimal -> number, còn lại spread
     * thẳng. Nếu PlayerDto thêm field tính toán (vd: age từ date_of_birth)
     * thì thêm vào đây, không quay lại copy hết field như cũ.
     */
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