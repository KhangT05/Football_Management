import { createAppError } from "../common/app.error.js";
import {
    PrismaClient,
    SeasonTeamJersey,
    SeasonStatus,
} from "../generated/prisma/client.js";
import {
    UpsertSeasonTeamJerseyDto,
} from "../dtos/jersey.schema.js";

export class JerseyService {
    constructor(private readonly prisma: PrismaClient) { }

    // ─── SeasonTeamJersey ──────────────────────────────────────────────────────

    async getSeasonTeamJerseys(seasonTeamId: number): Promise<SeasonTeamJersey[]> {
        return this.prisma.seasonTeamJersey.findMany({
            where: { season_team_id: seasonTeamId },
        });
    }

    async upsertSeasonTeamJersey(
        seasonTeamId: number,
        data: UpsertSeasonTeamJerseyDto,
        auth: { user_id: number; is_admin: boolean }
    ): Promise<SeasonTeamJersey> {
        const seasonTeam = await this.prisma.seasonTeam.findUnique({
            where: { id: seasonTeamId },
            select: {
                id: true,
                team_id: true,
                season: { select: { status: true } },
            },
        });
        if (!seasonTeam)
            throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamId} not found`);
        if (seasonTeam.season.status === SeasonStatus.finished)
            throw createAppError("CONFLICT", "Cannot update jersey for a finished season");
        if (!auth.is_admin)
            await this.assertTeamOwnership(seasonTeam.team_id, auth.user_id);

        return this.prisma.seasonTeamJersey.upsert({
            where: { season_team_id_type: { season_team_id: seasonTeamId, type: data.type } },
            create: {
                season_team_id: seasonTeamId,
                type: data.type,
                primary_color: data.primary_color,
                secondary_color: data.secondary_color ?? null,
                image_url: data.image_url ?? null,
            },
            update: {
                primary_color: data.primary_color,
                secondary_color: data.secondary_color ?? null,
                image_url: data.image_url ?? null,
            },
        });
    }

    async deleteSeasonTeamJersey(
        seasonTeamId: number,
        type: string,
        auth: { user_id: number; is_admin: boolean }
    ): Promise<void> {
        const seasonTeam = await this.prisma.seasonTeam.findUnique({
            where: { id: seasonTeamId },
            select: { team_id: true, season: { select: { status: true } } },
        });
        if (!seasonTeam)
            throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamId} not found`);
        if (seasonTeam.season.status === SeasonStatus.finished)
            throw createAppError("CONFLICT", "Cannot delete jersey for a finished season");
        if (!auth.is_admin)
            await this.assertTeamOwnership(seasonTeam.team_id, auth.user_id);

        const existing = await this.prisma.seasonTeamJersey.findUnique({
            where: { season_team_id_type: { season_team_id: seasonTeamId, type: type as any } },
            select: { id: true },
        });
        if (!existing)
            throw createAppError("NOT_FOUND", "SeasonTeamJersey not found");

        await this.prisma.seasonTeamJersey.delete({
            where: { season_team_id_type: { season_team_id: seasonTeamId, type: type as any } },
        });
    }

    // ─── Auth helper ───────────────────────────────────────────────────────────

    private async assertTeamOwnership(teamId: number, userId: number): Promise<void> {
        const access = await this.prisma.team.findFirst({
            where: {
                id: teamId,
                is_active: true,
                OR: [
                    { user_id: userId },
                    { teamLeaders: { some: { user_id: userId, is_active: true } } },
                ],
            },
            select: { id: true },
        });
        if (!access)
            throw createAppError("FORBIDDEN", "Only team creator or captain can update jersey");
    }
}