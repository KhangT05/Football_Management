import { PrismaClient, SeasonTeamJersey } from "../generated/prisma/client.js";
import { UpsertSeasonTeamJerseyDto } from "../dtos/jersey.schema.js";
export declare class JerseyService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getSeasonTeamJerseys(seasonTeamId: number): Promise<SeasonTeamJersey[]>;
    upsertSeasonTeamJersey(seasonTeamId: number, data: UpsertSeasonTeamJerseyDto, auth: {
        user_id: number;
        is_admin: boolean;
    }): Promise<SeasonTeamJersey>;
    deleteSeasonTeamJersey(seasonTeamId: number, type: string, auth: {
        user_id: number;
        is_admin: boolean;
    }): Promise<void>;
    private assertTeamOwnership;
}
//# sourceMappingURL=jersey.service.d.ts.map