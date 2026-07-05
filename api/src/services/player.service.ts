import * as XLSX from "xlsx";
import {
    AddPlayerToTeamDto, BulkDeleteDto,
    CreatePlayerDto, ImportPlayerRowDto,
    importPlayerRowSchema,
    PlayerDetailDto,
    PlayerDto, TeamPlayerDto,
    UpdatePlayerDto, UpdateTeamPlayerDto
} from "../dtos/player.schema.js";
import { Queryable } from "../libs/queryable.js";
import { createAppError } from "../common/app.error.js";
import { ApprovalStatus, PlayerPosition, Prisma, PrismaClient } from "../generated/prisma/client.js";
import { storageService } from "./storage.service.js";
import { logger } from "../libs/logger.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { ImportResult, ListTeamPlayersQuery, PLAYER_SELECT, PLAYER_SELECT_WITH_SEASONS, PlayerRow, PlayerSeasonInfo, PlayerWithSeasonsRow, TEAM_PLAYER_SELECT, TeamPlayerRow } from "../types/player.type.js";

const MAX_IMPORT_ROWS = 200;
const PLAYER_ROLE_NAME = "player";

export class PlayerService {
    private readonly teamPlayerQuery: Queryable<TeamPlayerRow>;

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
    }

    // ----------------------------------------------------------
    // PLAYER CRUD
    // ----------------------------------------------------------

    /**
     * FIX: trước đây không validate user_id tồn tại (→ P2003 FK raw 500 nếu
     * user_id sai) và không dedupe theo user_id (→ 2 Player row cho cùng 1
     * user nếu Player.user_id không có @@unique DB — chưa confirm schema.prisma).
     * Trả CONFLICT rõ ràng thay vì raw Prisma error hoặc silent duplicate.
     * Không auto-reuse existing player ở đây (khác semantics với import Excel,
     * nơi reuse là intent — xem docstring importTeamPlayersFromExcel) vì
     * single-add qua FE nên biết rõ user đã có player profile để chuyển
     * sang gọi addPlayerToTeam(player_id) trực tiếp, tránh 2 code path
     * cùng verb "create" nhưng semantics khác nhau.
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

        const player = await this.prisma.player.create({
            data: dto,
            select: PLAYER_SELECT,
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
        const seasons: PlayerSeasonInfo[] = p.team_players.flatMap((tp) =>
            tp.team.season_teams.map((st) => ({
                season_id: st.season.id,
                season_name: st.season.name,
                season_status: st.season.status,
                team_id: tp.team.id,
                team_name: tp.team.name,
                season_team_status: st.status,
                group_id: st.group_id,
                jersey_number: tp.jersey_number,
            }))
        );
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
    // TEAM PLAYER
    // ----------------------------------------------------------

    listTeamPlayers(query: ListTeamPlayersQuery): Promise<PaginatedResult<TeamPlayerDto>> {
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

    async getTeamPlayerById(id: number, team_id: number): Promise<TeamPlayerDto | null> {
        const tp = await this.prisma.teamPlayer.findFirst({
            where: { id, team_id, deleted_at: null },
            select: TEAM_PLAYER_SELECT,
        });
        return tp ? this.mapTeamPlayer(tp) : null;
    }

    async addPlayerToTeam(
        team_id: number,
        dto: AddPlayerToTeamDto
    ): Promise<TeamPlayerDto> {
        const player = await this.prisma.player.findFirst({
            where: { id: dto.player_id, deleted_at: null },
            select: { id: true, user_id: true },
        });
        if (!player) throw createAppError("NOT_FOUND", `Player ${dto.player_id} not found`);

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
        if (dupPlayer) throw createAppError("CONFLICT", "Player already in team");
        if (dupJersey) throw createAppError("CONFLICT", `Jersey number ${dto.jersey_number} đã được sử dụng trong đội`);

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
        } catch (err) {
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
     * là nơi enforce invariant này — không phụ thuộc controller nhớ pre-check
     * (pattern cũ: controller tự getTeamPlayerById(id, team_id) trước rồi
     * gọi service không kèm team_id — TOCTOU + fragile, dễ vỡ nếu route khác
     * gọi thẳng service sau này mà quên pre-check).
     */
    async updateTeamPlayer(id: number, team_id: number, dto: UpdateTeamPlayerDto): Promise<TeamPlayerDto> {
        const exists = await this.prisma.teamPlayer.findFirst({
            where: { id, team_id, deleted_at: null },
            select: { id: true },
        });
        if (!exists) throw createAppError("NOT_FOUND", `TeamPlayer ${id} not found in team ${team_id}`);

        const tp = await this.prisma.teamPlayer.update({
            where: { id },
            data: dto,
            select: TEAM_PLAYER_SELECT,
        });
        return this.mapTeamPlayer(tp);
    }

    approveTeamPlayer(id: number, team_id: number): Promise<TeamPlayerDto> {
        return this.updateTeamPlayer(id, team_id, { approval_status: ApprovalStatus.approved });
    }

    rejectTeamPlayer(id: number, team_id: number): Promise<TeamPlayerDto> {
        return this.updateTeamPlayer(id, team_id, { approval_status: ApprovalStatus.rejected });
    }

    // ----------------------------------------------------------
    // BULK DELETE
    // ----------------------------------------------------------

    async bulkDeleteTeamPlayers(
        team_id: number,
        dto: BulkDeleteDto
    ): Promise<{ deleted: number; notFound: number[] }> {
        const now = new Date();

        const existing = await this.prisma.teamPlayer.findMany({
            where: { id: { in: dto.ids }, team_id, deleted_at: null },
            select: { id: true },
        });

        const existingIds = new Set(existing.map((r) => r.id));
        const notFound = dto.ids.filter((id) => !existingIds.has(id));

        if (existingIds.size === 0) return { deleted: 0, notFound };

        await this.prisma.teamPlayer.updateMany({
            where: { id: { in: [...existingIds] }, team_id },
            data: { deleted_at: now, is_active: false },
        });

        return { deleted: existingIds.size, notFound };
    }

    async hardDeleteTeamPlayers(team_id: number, dto: BulkDeleteDto): Promise<{ deleted: number }> {
        const result = await this.prisma.teamPlayer.deleteMany({
            where: { id: { in: dto.ids }, team_id },
        });
        return { deleted: result.count };
    }

    // ----------------------------------------------------------
    // EXPORT EXCEL
    // ----------------------------------------------------------

    async exportTeamPlayersExcel(team_id: number): Promise<Buffer> {
        const records = await this.prisma.teamPlayer.findMany({
            where: { team_id, deleted_at: null },
            select: TEAM_PLAYER_SELECT,
            orderBy: { jersey_number: "asc" },
        });

        const rows = records.map((tp: any) => ({
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
        return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
    }

    exportImportTemplate(minRows = 7): Buffer {
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

        return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
    }

    // ----------------------------------------------------------
    // IMPORT EXCEL
    // ----------------------------------------------------------

    async importTeamPlayersFromExcel(team_id: number, fileBuffer: Buffer): Promise<ImportResult> {
        const wb = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
        const sheetName = wb.SheetNames[0];
        if (!sheetName) throw createAppError('BAD_REQUEST', 'Excel file has no sheets');

        const ws = wb.Sheets[sheetName];
        if (!ws) throw createAppError('BAD_REQUEST', `Sheet "${sheetName}" is empty or corrupted`);

        const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: null });

        if (raw.length > MAX_IMPORT_ROWS) {
            throw createAppError('BAD_REQUEST', `File has ${raw.length} rows, max ${MAX_IMPORT_ROWS} allowed`);
        }

        const result: ImportResult = { success: 0, failed: 0, errors: [] };

        type ValidRow = { rowNum: number; dto: ImportPlayerRowDto };
        const validRows: ValidRow[] = [];

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
            } else {
                validRows.push({ rowNum, dto: parsed.data });
            }
        }

        if (validRows.length === 0) return result;

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
                            jersey_number: dto.jersey_number!,
                            position: dto.position,
                            role: 'player',
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

                    return playerId;
                });

                playerByUserId.set(userId, committedPlayerId);
                teamPlayerSet.add(committedPlayerId);
                usedJerseyNumbers.add(dto.jersey_number);
                result.success++;
            } catch (err) {
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