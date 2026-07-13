import {
    Controller,
    Get,
    Path,
    Tags,
    Route,
    Put,
    Body,
    SuccessResponse,
    Delete,
    Security,
    Request,
    Query,
} from "tsoa";
import type { Request as ExRequest } from "express";
import { JerseyService } from "../services/jersey.service.js";
import type { SeasonTeamJersey, JerseyType } from "../generated/prisma/client.js";
import * as jerseySchema from "../dtos/jersey.schema.js";

type AuthRequest = ExRequest & { user: { user_id: number; is_admin: boolean } };

@Route("jerseys")
@Tags("Jerseys")
export class JerseyController extends Controller {
    constructor(private service: JerseyService) {
        super();
    }

    // ─── SeasonTeamJersey ──────────────────────────────────────────────────────

    /** GET /jerseys/season-teams/:seasonTeamId */
    @Get("season-teams/{seasonTeamId}")
    async getSeasonTeamJerseys(
        @Path() seasonTeamId: number
    ): Promise<SeasonTeamJersey[]> {
        return this.service.getSeasonTeamJerseys(seasonTeamId);
    }
    @Security("jwt", ["leader", "organizing"])
    /** PUT /jerseys/season-teams/:seasonTeamId — upsert by type */
    @Put("season-teams/{seasonTeamId}")
    async upsertSeasonTeamJersey(
        @Path() seasonTeamId: number,
        @Body() body: jerseySchema.UpsertSeasonTeamJerseyDto,
        @Request() req: AuthRequest
    ): Promise<SeasonTeamJersey> {
        return this.service.upsertSeasonTeamJersey(seasonTeamId, body, req.user);
    }
    @Security("jwt", ["leader", "organizing"])
    /** DELETE /jerseys/season-teams/:seasonTeamId?type=home */
    @Delete("season-teams/{seasonTeamId}")
    @SuccessResponse(204, "Deleted")
    async deleteSeasonTeamJersey(
        @Path() seasonTeamId: number,
        @Query() type: JerseyType,
        @Request() req: AuthRequest
    ): Promise<void> {
        this.setStatus(204);
        return this.service.deleteSeasonTeamJersey(seasonTeamId, type, req.user);
    }
}