import { Prisma, PrismaClient } from "../generated/prisma/client.js";
export type TxClient = Prisma.TransactionClient;
export type DbClient = TxClient | PrismaClient;
export interface RelationConfig {
    /** Prisma model delegate key — must match camelCase Prisma model name, e.g. "user_role" */
    table: string;
    ownerKey: string;
    targetKey: string;
    /** Called before write ops. Throw AppException to abort. */
    validateOwner?: (id: number, db: DbClient) => Promise<void>;
    validateTargets?: (ids: number[], db: DbClient) => Promise<void>;
}
export declare class RelationService {
    private readonly config;
    constructor(config: RelationConfig);
    private model;
    attach(ownerId: number, targetIds: number[], db: DbClient): Promise<void>;
    detach(ownerId: number, targetIds: number[], db: DbClient): Promise<void>;
    /**
     * Replace toàn bộ relations cho owner với set mới.
     * Nhận TxClient — caller phải wrap trong $transaction.
     * Validate TRƯỚC delete: nếu validateTargets throw thì không mutate.
     */
    sync(ownerId: number, targetIds: number[], tx: TxClient): Promise<void>;
}
//# sourceMappingURL=relation.service.d.ts.map