// import { PrismaClient, Prisma } from "@prisma/client";
// import * as XLSX from "xlsx";
// import {
//     CreatePlayerDto,
//     UpdatePlayerDto,
//     AddPlayerToTeamDto,
//     UpdateTeamPlayerDto,
//     BulkDeleteDto,
//     ImportPlayerRowDto,
//     importPlayerRowSchema,
//     PlayerDto,
//     TeamPlayerDto,
// } from "./player.schema";
export {};
// // ============================================================
// // TYPES
// // ============================================================
// export interface ImportResult {
//     success: number;
//     failed: number;
//     errors: { row: number; reason: string }[];
// }
// export interface PaginatedResult<T> {
//     data: T[];
//     total: number;
//     page: number;
//     limit: number;
// }
// export interface ListTeamPlayersQuery {
//     team_id: number;
//     page?: number;
//     limit?: number;
//     position?: string;
//     status?: string;
//     approval_status?: string;
// }
// // ============================================================
// // SELECTORS
// // ============================================================
// const PLAYER_SELECT = {
//     id: true,
//     date_of_birth: true,
//     position: true,
//     height: true,
//     weight: true,
//     nationality: true,
//     avatar: true,
//     is_active: true,
//     created_at: true,
//     updated_at: true,
//     user_id: true,
//     user: {
//         select: { id: true, name: true, email: true, phone: true },
//     },
// } satisfies Prisma.PlayerSelect;
// const TEAM_PLAYER_SELECT = {
//     id: true,
//     team_id: true,
//     player_id: true,
//     jersey_number: true,
//     position: true,
//     role: true,
//     status: true,
//     approval_status: true,
//     is_active: true,
//     created_at: true,
//     updated_at: true,
//     player: {
//         select: {
//             ...PLAYER_SELECT,
//         },
//     },
// } satisfies Prisma.TeamPlayerSelect;
// // ============================================================
// // SERVICE
// // ============================================================
// export class PlayerService {
//     constructor(private readonly db: PrismaClient) { }
//     // ----------------------------------------------------------
//     // PLAYER CRUD
//     // ----------------------------------------------------------
//     async createPlayer(dto: CreatePlayerDto): Promise<PlayerDto> {
//         // user_id unique constraint will throw P2002 if duplicate
//         const player = await this.db.player.create({
//             data: {
//                 user_id: dto.user_id,
//                 date_of_birth: dto.date_of_birth,
//                 position: dto.position,
//                 height: dto.height ?? null,
//                 weight: dto.weight ?? null,
//                 nationality: dto.nationality ?? null,
//                 avatar: dto.avatar ?? null,
//             },
//             select: PLAYER_SELECT,
//         });
//         return this.mapPlayer(player);
//     }
//     async getPlayerById(id: number): Promise<PlayerDto | null> {
//         const player = await this.db.player.findFirst({
//             where: { id, deleted_at: null },
//             select: PLAYER_SELECT,
//         });
//         return player ? this.mapPlayer(player) : null;
//     }
//     async updatePlayer(id: number, dto: UpdatePlayerDto): Promise<PlayerDto> {
//         const player = await this.db.player.update({
//             where: { id },
//             data: {
//                 ...(dto.date_of_birth && { date_of_birth: dto.date_of_birth }),
//                 ...(dto.position && { position: dto.position }),
//                 ...(dto.height !== undefined && { height: dto.height }),
//                 ...(dto.weight !== undefined && { weight: dto.weight }),
//                 ...(dto.nationality !== undefined && { nationality: dto.nationality }),
//                 ...(dto.avatar !== undefined && { avatar: dto.avatar }),
//             },
//             select: PLAYER_SELECT,
//         });
//         return this.mapPlayer(player);
//     }
//     async softDeletePlayer(id: number): Promise<void> {
//         await this.db.player.update({
//             where: { id },
//             data: { deleted_at: new Date(), is_active: false },
//         });
//     }
//     // ----------------------------------------------------------
//     // TEAM PLAYER
//     // ----------------------------------------------------------
//     async listTeamPlayers(
//         query: ListTeamPlayersQuery
//     ): Promise<PaginatedResult<TeamPlayerDto>> {
//         const { team_id, page = 1, limit = 20, position, status, approval_status } =
//             query;
//         const where: Prisma.TeamPlayerWhereInput = {
//             team_id,
//             deleted_at: null,
//             ...(position && { position: position as any }),
//             ...(status && { status: status as any }),
//             ...(approval_status && { approval_status: approval_status as any }),
//         };
//         const [data, total] = await this.db.$transaction([
//             this.db.teamPlayer.findMany({
//                 where,
//                 select: TEAM_PLAYER_SELECT,
//                 skip: (page - 1) * limit,
//                 take: limit,
//                 orderBy: { jersey_number: "asc" },
//             }),
//             this.db.teamPlayer.count({ where }),
//         ]);
//         return {
//             data: data.map(this.mapTeamPlayer),
//             total,
//             page,
//             limit,
//         };
//     }
//     async addPlayerToTeam(
//         team_id: number,
//         dto: AddPlayerToTeamDto,
//         user_id?: number
//     ): Promise<TeamPlayerDto> {
//         // P2002 on [team_id, player_id] or [team_id, jersey_number] → surface to caller
//         const tp = await this.db.teamPlayer.create({
//             data: {
//                 team_id,
//                 player_id: dto.player_id,
//                 jersey_number: dto.jersey_number,
//                 position: dto.position,
//                 role: dto.role,
//                 ...(user_id && { user_id }),
//             },
//             select: TEAM_PLAYER_SELECT,
//         });
//         return this.mapTeamPlayer(tp);
//     }
//     async updateTeamPlayer(
//         id: number,
//         dto: UpdateTeamPlayerDto
//     ): Promise<TeamPlayerDto> {
//         const tp = await this.db.teamPlayer.update({
//             where: { id },
//             data: dto,
//             select: TEAM_PLAYER_SELECT,
//         });
//         return this.mapTeamPlayer(tp);
//     }
//     async approveTeamPlayer(id: number): Promise<TeamPlayerDto> {
//         return this.updateTeamPlayer(id, { approval_status: "approved" });
//     }
//     async rejectTeamPlayer(id: number): Promise<TeamPlayerDto> {
//         return this.updateTeamPlayer(id, { approval_status: "rejected" });
//     }
//     // ----------------------------------------------------------
//     // BULK DELETE
//     // ----------------------------------------------------------
//     /**
//      * Soft-delete team_players by ids.
//      * Only deletes records belonging to team_id to prevent cross-team tampering.
//      * Returns count of actually deleted records.
//      */
//     async bulkDeleteTeamPlayers(
//         team_id: number,
//         dto: BulkDeleteDto
//     ): Promise<{ deleted: number; notFound: number[] }> {
//         const now = new Date();
//         // Fetch existing records first to identify notFound ids
//         const existing = await this.db.teamPlayer.findMany({
//             where: {
//                 id: { in: dto.ids },
//                 team_id,
//                 deleted_at: null,
//             },
//             select: { id: true },
//         });
//         const existingIds = existing.map((r) => r.id);
//         const notFound = dto.ids.filter((id) => !existingIds.includes(id));
//         if (existingIds.length === 0) {
//             return { deleted: 0, notFound };
//         }
//         await this.db.teamPlayer.updateMany({
//             where: { id: { in: existingIds }, team_id },
//             data: { deleted_at: now, is_active: false },
//         });
//         return { deleted: existingIds.length, notFound };
//     }
//     /**
//      * Hard delete — use only for admin/cleanup.
//      * Cascade in schema handles seasonTeamPlayers.
//      */
//     async hardDeleteTeamPlayers(
//         team_id: number,
//         dto: BulkDeleteDto
//     ): Promise<{ deleted: number }> {
//         const result = await this.db.teamPlayer.deleteMany({
//             where: { id: { in: dto.ids }, team_id },
//         });
//         return { deleted: result.count };
//     }
//     // ----------------------------------------------------------
//     // EXPORT EXCEL
//     // ----------------------------------------------------------
//     /**
//      * Returns raw Buffer — caller writes to response or disk.
//      * Columns: jersey_number, name, email, position, role, status, approval_status, dob, nationality, height, weight
//      */
//     async exportTeamPlayersExcel(team_id: number): Promise<Buffer> {
//         const records = await this.db.teamPlayer.findMany({
//             where: { team_id, deleted_at: null },
//             select: TEAM_PLAYER_SELECT,
//             orderBy: { jersey_number: "asc" },
//         });
//         const rows = records.map((tp) => ({
//             jersey_number: tp.jersey_number,
//             name: tp.player?.user?.name ?? "",
//             email: tp.player?.user?.email ?? "",
//             position: tp.position,
//             role: tp.role,
//             status: tp.status,
//             approval_status: tp.approval_status,
//             date_of_birth: tp.player?.date_of_birth
//                 ? tp.player.date_of_birth.toISOString().split("T")[0]
//                 : "",
//             nationality: tp.player?.nationality ?? "",
//             height: tp.player?.height ? Number(tp.player.height) : "",
//             weight: tp.player?.weight ? Number(tp.player.weight) : "",
//         }));
//         const ws = XLSX.utils.json_to_sheet(rows);
//         // Column widths
//         ws["!cols"] = [
//             { wch: 6 },  // jersey
//             { wch: 24 }, // name
//             { wch: 28 }, // email
//             { wch: 12 }, // position
//             { wch: 14 }, // role
//             { wch: 10 }, // status
//             { wch: 16 }, // approval
//             { wch: 12 }, // dob
//             { wch: 14 }, // nationality
//             { wch: 8 },  // height
//             { wch: 8 },  // weight
//         ];
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Players");
//         return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
//     }
//     /**
//      * Export import template (blank with headers + dropdown hints as comments).
//      */
//     exportImportTemplate(): Buffer {
//         const headers = [
//             {
//                 jersey_number: 10, user_email: "player@example.com", date_of_birth: "2000-01-15",
//                 position: "goalkeeper|defender|midfielder|forward", height: 175, weight: 70, nationality: "Vietnam"
//             },
//         ];
//         const ws = XLSX.utils.json_to_sheet(headers);
//         ws["!cols"] = [
//             { wch: 6 }, { wch: 28 }, { wch: 14 }, { wch: 36 },
//             { wch: 8 }, { wch: 8 }, { wch: 14 },
//         ];
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Template");
//         return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
//     }
//     // ----------------------------------------------------------
//     // IMPORT EXCEL
//     // ----------------------------------------------------------
//     /**
//      * Import flow:
//      * 1. Parse sheet → validate each row with Zod
//      * 2. Lookup user by email (must exist)
//      * 3. Upsert Player (create if no player row for that user)
//      * 4. Add to team via addPlayerToTeam (skip if already member)
//      *
//      * Transaction per-row → partial success supported.
//      * jersey_number in sheet is optional; if absent, must be assigned elsewhere.
//      */
//     async importTeamPlayersFromExcel(
//         team_id: number,
//         fileBuffer: Buffer
//     ): Promise<ImportResult> {
//         const wb = XLSX.read(fileBuffer, { type: "buffer", cellDates: true });
//         const ws = wb.Sheets[wb.SheetNames[0]];
//         const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
//             defval: null,
//         });
//         const result: ImportResult = { success: 0, failed: 0, errors: [] };
//         for (let i = 0; i < rows.length; i++) {
//             const rowNum = i + 2; // 1-indexed + header row
//             const raw = rows[i];
//             // Validate
//             const parsed = importPlayerRowSchema.safeParse(raw);
//             if (!parsed.success) {
//                 result.failed++;
//                 result.errors.push({
//                     row: rowNum,
//                     reason: parsed.error.issues
//                         .map((e) => `${e.path.join(".")}: ${e.message}`)
//                         .join("; "),
//                 });
//                 continue;
//             }
//             const dto: ImportPlayerRowDto = parsed.data;
//             try {
//                 await this.db.$transaction(async (tx) => {
//                     // 1. Resolve user
//                     const user = await tx.user.findFirst({
//                         where: { email: dto.user_email },
//                         select: { id: true },
//                     });
//                     if (!user) throw new Error(`User not found: ${dto.user_email}`);
//                     // 2. Upsert player
//                     let player = await tx.player.findFirst({
//                         where: { user_id: user.id, deleted_at: null },
//                         select: { id: true },
//                     });
//                     if (!player) {
//                         player = await tx.player.create({
//                             data: {
//                                 user_id: user.id,
//                                 date_of_birth: dto.date_of_birth,
//                                 position: dto.position,
//                                 height: dto.height ?? null,
//                                 weight: dto.weight ?? null,
//                                 nationality: dto.nationality ?? null,
//                             },
//                             select: { id: true },
//                         });
//                     }
//                     // 3. Check already member
//                     const existing = await tx.teamPlayer.findFirst({
//                         where: { team_id, player_id: player.id, deleted_at: null },
//                         select: { id: true },
//                     });
//                     if (existing) throw new Error("Player already in team");
//                     // 4. jersey_number required to add — skip silently if missing
//                     if (!dto.jersey_number) {
//                         throw new Error("jersey_number required for team assignment");
//                     }
//                     await tx.teamPlayer.create({
//                         data: {
//                             team_id,
//                             player_id: player.id,
//                             jersey_number: dto.jersey_number,
//                             position: dto.position,
//                             role: "player",
//                         },
//                     });
//                 });
//                 result.success++;
//             } catch (err: unknown) {
//                 result.failed++;
//                 result.errors.push({
//                     row: rowNum,
//                     reason: err instanceof Error ? err.message : "Unknown error",
//                 });
//             }
//         }
//         return result;
//     }
//     // ----------------------------------------------------------
//     // MAPPERS
//     // ----------------------------------------------------------
//     private mapPlayer(p: any): PlayerDto {
//         return {
//             id: p.id,
//             date_of_birth: p.date_of_birth,
//             position: p.position,
//             height: p.height ? Number(p.height) : null,
//             weight: p.weight ? Number(p.weight) : null,
//             nationality: p.nationality,
//             avatar: p.avatar,
//             is_active: p.is_active,
//             created_at: p.created_at,
//             updated_at: p.updated_at,
//             user_id: p.user_id,
//             user: p.user ?? null,
//         };
//     }
//     private mapTeamPlayer(tp: any): TeamPlayerDto {
//         return {
//             id: tp.id,
//             team_id: tp.team_id,
//             player_id: tp.player_id,
//             jersey_number: tp.jersey_number,
//             position: tp.position,
//             role: tp.role,
//             status: tp.status,
//             approval_status: tp.approval_status,
//             is_active: tp.is_active,
//             created_at: tp.created_at,
//             updated_at: tp.updated_at,
//             player: tp.player ? this.mapPlayer(tp.player) : null,
//         };
//     }
// }
//# sourceMappingURL=player.service.js.map