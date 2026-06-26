import { PrismaClient, TeamJersey, SeasonTeamJersey } from "../generated/prisma/client.js";
import { UpdateTeamJerseyDto, UpsertSeasonTeamJerseyDto } from "../dtos/jersey.schema.js";
export declare class JerseyService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    upsertTeamJersey(teamId: number, data: UpdateTeamJerseyDto, auth: {
        user_id: number;
        is_admin: boolean;
    }): Promise<TeamJersey>;
    upsertSeasonTeamJersey(seasonTeamId: number, data: UpsertSeasonTeamJerseyDto, auth: {
        user_id: number;
        is_admin: boolean;
    }): Promise<SeasonTeamJersey>;
    /**
     * Pass nếu requester là team.user_id (creator) HOẶC active TeamLeader (captain).
     * Không cần load cả Team entity — use findFirst(...OR) để check ownership
     * across creator + captain roles.
     */
    private assertTeamOwnership;
}
//# sourceMappingURL=jersey.service.d.ts.map