import { createAppError } from "../common/app.error.js";
import { SeasonStatus } from "../generated/prisma/client.js";
export class JerseyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ─── TeamJersey ────────────────────────────────────────────────────────────
    async upsertTeamJersey(teamId, data, auth) {
        if (!auth.is_admin) {
            await this.assertTeamOwnership(teamId, auth.user_id);
        }
        return this.prisma.teamJersey.upsert({
            where: { team_id_type: { team_id: teamId, type: data.type } },
            create: {
                team_id: teamId,
                type: data.type,
                primary_color: data.primary_color,
                secondary_color: data.secondary_color ?? null,
            },
            update: {
                primary_color: data.primary_color,
                secondary_color: data.secondary_color ?? null,
            },
        });
    }
    // ─── SeasonTeamJersey ──────────────────────────────────────────────────────
    async upsertSeasonTeamJersey(seasonTeamId, data, auth) {
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
        if (!auth.is_admin) {
            await this.assertTeamOwnership(seasonTeam.team_id, auth.user_id);
        }
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
    // ─── Auth helper ───────────────────────────────────────────────────────────
    /**
     * Pass nếu requester là team.user_id (creator) HOẶC active TeamLeader (captain).
     * Không cần load cả Team entity — use findFirst(...OR) để check ownership
     * across creator + captain roles.
     */
    async assertTeamOwnership(teamId, userId) {
        const access = await this.prisma.team.findFirst({
            where: {
                id: teamId,
                is_active: true,
                OR: [
                    // Creator
                    { user_id: userId },
                    // Captain (active)
                    {
                        teamLeaders: {
                            some: { user_id: userId, is_active: true },
                        },
                    },
                ],
            },
            select: { id: true },
        });
        if (!access)
            throw createAppError("FORBIDDEN", "Only team creator or captain can update jersey");
    }
}
//# sourceMappingURL=jersey.service.js.map