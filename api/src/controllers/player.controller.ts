import {
  Controller, Get, Path, Tags, Route, Post, Patch, Body,
  SuccessResponse, Delete, Query, Security, Request, Res,
  UploadedFile, Consumes
} from "tsoa";
import type { TsoaResponse } from "tsoa";
import type { Request as ExRequest } from "express";

type AuthRequest = ExRequest & { user: { user_id: number } };

import { PlayerService } from "../services/player.service.js";
import {
  type CreatePlayerDto,
  type UpdatePlayerDto,
  type PlayerDto,
  type TeamPlayerDto,
  type AddPlayerToTeamDto,
  type CreatePlayerForTeamDto,
  type UpdateTeamPlayerDto,
  type BulkDeleteDto,
} from "../dtos/player.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { ImportResult, ListTeamPlayersQuery } from "../types/player.type.js";

const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;
const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

@Route("players")
@Tags("Players")
export class PlayerController extends Controller {
  constructor(private readonly service: PlayerService) {
    super();
  }

  // ────────────────────────────────────────────────────────────────
  // QUAN TRỌNG VỀ THỨ TỰ ROUTE:
  // tsoa generate routes.ts theo ĐÚNG thứ tự khai báo method trong
  // class này. Express match route theo thứ tự đăng ký, nên bất kỳ
  // route "tĩnh" nào (vd. "import-template", "export") mà đứng SAU
  // một route "động" cùng cấp (vd. "{id}") sẽ bị route động nuốt mất
  // — request khớp nhầm vào "{id}" với id = chuỗi tĩnh đó, gây lỗi
  // "invalid float number" khi tsoa cố ép kiểu sang number.
  //
  // => Mọi route tĩnh PHẢI khai báo TRƯỚC route động cùng cấp
  // (cùng số lượng segment, cùng HTTP method).
  // ────────────────────────────────────────────────────────────────

  // Không có PII, chỉ template rỗng — giữ public để leader tải mà không cần login trước.
  // Đứng TRƯỚC findById("{id}") vì cùng là GET, cùng cấp "players/...".
  //
  // FIX (file tải về không mở được): trước đây method này tự gọi
  // request.res.send(buffer) rồi để tsoa tiếp tục xử lý response như
  // bình thường (vì return type là Promise<void>) — tsoa generate code
  // vẫn cố ghi thêm 1 lần response nữa sau khi handler resolve, ghi đè/
  // nối byte vào sau khi socket đã kết thúc => file .xlsx (vốn là 1 file
  // zip) bị hỏng cấu trúc, Excel không mở được.
  //
  // Cách đúng theo tsoa: dùng @Res() + TsoaResponse — tsoa nhận diện
  // đây là "custom response", tự gọi hàm callback để gửi response DUY
  // NHẤT, không tự động ghi thêm lần 2 nữa.
  @Get("import-template")
  async downloadImportTemplate(
    @Query() minRows: number = 7,
    @Res() successResponse: TsoaResponse<200, Buffer>
  ): Promise<void> {
    const buffer = await this.service.exportImportTemplate(minRows);
    successResponse(200, buffer, {
      "Content-Type": XLSX_CONTENT_TYPE,
      "Content-Disposition": 'attachment; filename="import-template.xlsx"',
    } as any);
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<PlayerDto> {
    return this.service.getPlayerByIdOrFail(id);
  }

  @Security("jwt", ["admin", "organizing", "leader"])
  @Post("/")
  @SuccessResponse(201, "Created")
  async create(@Body() body: CreatePlayerDto): Promise<PlayerDto> {
    this.setStatus(201);
    return this.service.createPlayer(body);
  }

  @Security("jwt", ["admin", "organizing", "leader"])
  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: UpdatePlayerDto
  ): Promise<PlayerDto> {
    return this.service.updatePlayer(id, body);
  }

  @Security("jwt", ["admin", "organizing", "leader"])
  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDeletePlayer(id);
  }

  // ─── Team Players ─────────────────────────────────────────────────────────

  @Get("{team_id}/team-players")
  async listTeamPlayers(
    @Path() team_id: number,
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc",
    @Query() position?: string,
    @Query() status?: string,
    @Query() approval_status?: string
  ): Promise<PaginatedResult<TeamPlayerDto>> {
    return this.service.listTeamPlayers({
      team_id,
      page,
      per_page,
      sort,
      direction,
      ...(position && { position }),
      ...(status && { status }),
      ...(approval_status && { approval_status }),
    } as ListTeamPlayersQuery);
  }

  // FIX: cùng nhóm bug route-ordering như import-template — route tĩnh
  // "export" phải đứng TRƯỚC route động "{id}" (cùng là GET, cùng cấp
  // "{team_id}/team-players/..."). Trước đây getTeamPlayer("{id}") khai
  // báo trước nên GET /players/5/team-players/export bị match nhầm,
  // gán id="export" → lỗi "invalid float number" y hệt bug import-template.
  //
  // FIX (file không mở được): đổi sang @Res()/TsoaResponse, lý do giống
  // hệt downloadImportTemplate ở trên — tránh tsoa ghi response 2 lần.
  @Security("jwt", ["admin", "organizing", "user", "player", "leader"])
  @Get("{team_id}/team-players/export")
  async exportTeamPlayers(
    @Path() team_id: number,
    @Res() successResponse: TsoaResponse<200, Buffer>
  ): Promise<void> {
    const buffer = await this.service.exportTeamPlayersExcel(team_id);
    successResponse(200, buffer, {
      "Content-Type": XLSX_CONTENT_TYPE,
      "Content-Disposition": `attachment; filename="team-${team_id}-players.xlsx"`,
    } as any);
  }

  @Get("{team_id}/team-players/{id}")
  async getTeamPlayer(
    @Path() team_id: number,
    @Path() id: number
  ): Promise<TeamPlayerDto> {
    const tp = await this.service.getTeamPlayerById(id, team_id);
    if (!tp) {
      this.setStatus(404);
      throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
    }
    return tp;
  }

  // FIX: bỏ user_id — chưa từng được dùng trong body, AuthRequest param là dead
  // param. Nếu cần audit "ai thêm player này", thêm cột created_by ở service,
  // không giữ param không dùng ở controller.
  @Security("jwt", ["admin", "organizing", "user", "player", "leader"])
  @Post("{team_id}/team-players")
  @SuccessResponse(201, "Created")
  async addPlayerToTeam(
    @Path() team_id: number,
    @Body() body: AddPlayerToTeamDto
  ): Promise<TeamPlayerDto> {
    this.setStatus(201);
    return this.service.addPlayerToTeam(team_id, body);
  }

  // Thêm cầu thủ mới + tự tạo tài khoản (find-or-create theo email) — dùng
  // cho flow "leader nhập tên + email" ở MyTeam.jsx / RegisterTeam.jsx.
  // Khác addPlayerToTeam (yêu cầu player_id có sẵn). Path có 3 segment tĩnh
  // ("create-with-user") nên không đụng độ thứ tự với addPlayerToTeam
  // ("{team_id}/team-players", 2 segment) hay bất kỳ route POST nào khác.
  @Security("jwt", ["admin", "organizing", "user", "player", "leader"])
  @Post("{team_id}/team-players/create-with-user")
  @SuccessResponse(201, "Created")
  async createPlayerForTeamWithUser(
    @Path() team_id: number,
    @Body() body: CreatePlayerForTeamDto
  ): Promise<TeamPlayerDto> {
    this.setStatus(201);
    return this.service.createPlayerForTeamWithUser(team_id, body);
  }

  // FIX: bỏ pre-check getTeamPlayerById ở controller — TOCTOU + fragile
  // (an toàn phụ thuộc discipline của caller, không phải data layer).
  // service.updateTeamPlayer giờ tự scope theo team_id và tự 404.
  @Security("jwt", ["organizing", "leader"])
  @Patch("{team_id}/team-players/{id}")
  async updateTeamPlayer(
    @Path() team_id: number,
    @Path() id: number,
    @Body() body: UpdateTeamPlayerDto
  ): Promise<TeamPlayerDto> {
    return this.service.updateTeamPlayer(id, team_id, body);
  }

  @Security("jwt", ["admin", "organizing", "user", "player", "leader"])
  @Post("{team_id}/team-players/{id}/approve")
  async approveTeamPlayer(
    @Path() team_id: number,
    @Path() id: number
  ): Promise<TeamPlayerDto> {
    return this.service.approveTeamPlayer(id, team_id);
  }

  @Security("jwt", ["admin", "organizing", "leader"])
  @Post("{team_id}/team-players/{id}/reject")
  async rejectTeamPlayer(
    @Path() team_id: number,
    @Path() id: number
  ): Promise<TeamPlayerDto> {
    return this.service.rejectTeamPlayer(id, team_id);
  }

  @Security("jwt", ["admin", "organizing", "leader"])
  @Delete("{team_id}/team-players")
  async bulkDeleteTeamPlayers(
    @Path() team_id: number,
    @Body() body: BulkDeleteDto
  ): Promise<{ deleted: number; notFound: number[] }> {
    return this.service.bulkDeleteTeamPlayers(team_id, body);
  }

  // FIX: thiếu @Security hoàn toàn — bất kỳ ai cũng bulk-tạo Player/TeamPlayer
  // + gán role vào bất kỳ team_id nào không cần auth. Đây là lỗ hổng nghiêm
  // trọng nhất trong file, không phải cosmetic.
  @Security("jwt", ["admin", "organizing", "leader"])
  @Post("{team_id}/team-players/import")
  @Consumes("multipart/form-data")
  async importTeamPlayers(
    @Path() team_id: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImportResult> {
    if (!file || file.size === 0) {
      this.setStatus(400);
      throw Object.assign(new Error("File is required"), { status: 400 });
    }
    if (file.size > MAX_IMPORT_FILE_BYTES) {
      this.setStatus(413);
      throw Object.assign(new Error(`File too large (max ${MAX_IMPORT_FILE_BYTES / 1024 / 1024}MB)`), { status: 413 });
    }
    return this.service.importTeamPlayersFromExcel(team_id, file.buffer);
  }
}