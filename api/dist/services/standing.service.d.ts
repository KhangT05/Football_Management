import { PrismaClient } from '../generated/prisma/client.js';
export declare class StandingsService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    recomputeGroupStandings(groupId: number): Promise<void>;
}
//# sourceMappingURL=standing.service.d.ts.map