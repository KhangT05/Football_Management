import { createAppError } from "../common/app.error.js";
import { Prisma, SeasonStatus, } from "../generated/prisma/client.js";
export class JerseyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ─── SeasonTeamJersey ──────────────────────────────────────────────────────
    async getSeasonTeamJerseys(seasonTeamId) {
        const exists = await this.prisma.seasonTeam.findFirst({
            where: { id: seasonTeamId, deleted_at: null },
            select: { id: true },
        });
        if (!exists)
            throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamId} not found`);
        return this.prisma.seasonTeamJersey.findMany({
            where: { season_team_id: seasonTeamId },
        });
    }
    async upsertSeasonTeamJersey(seasonTeamId, data, auth) {
        await this.assertEditable(seasonTeamId, auth);
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
    async deleteSeasonTeamJersey(seasonTeamId, type, auth) {
        await this.assertEditable(seasonTeamId, auth);
        try {
            await this.prisma.seasonTeamJersey.delete({
                where: { season_team_id_type: { season_team_id: seasonTeamId, type } },
            });
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === "P2025")
                    throw createAppError("NOT_FOUND", "SeasonTeamJersey not found");
                if (err.code === "P2003")
                    throw createAppError("CONFLICT", "Jersey already assigned to a match, cannot delete");
            }
            throw err;
        }
    }
    // ─── Guard chung: existence + season lock + ownership ──────────────────────
    async assertEditable(seasonTeamId, auth) {
        const seasonTeam = await this.prisma.seasonTeam.findFirst({
            where: { id: seasonTeamId, deleted_at: null },
            select: { id: true, team_id: true, season: { select: { status: true } } },
        });
        if (!seasonTeam)
            throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamId} not found`);
        if (seasonTeam.season.status === SeasonStatus.finished)
            throw createAppError("CONFLICT", "Cannot modify jersey for a finished season");
        if (!auth.is_admin)
            await this.assertTeamOwnership(seasonTeam.team_id, auth.user_id);
        return seasonTeam;
    }
    async assertTeamOwnership(teamId, userId) {
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
//# sourceMappingURL=jersey.service.js.map