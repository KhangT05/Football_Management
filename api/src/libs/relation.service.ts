// libs/relation.service.ts
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

export class RelationService {
    constructor(private readonly config: RelationConfig) { }

    private model(db: DbClient) {
        const m = (db as Record<string, unknown>)[this.config.table];
        if (!m) {
            throw new Error(
                `RelationService: "${this.config.table}" not found on Prisma client. ` +
                `Check that it matches the Prisma model name exactly (camelCase).`
            );
        }
        return m as any;
    }

    async attach(ownerId: number, targetIds: number[], db: DbClient): Promise<void> {
        if (!targetIds.length) return;
        await this.config.validateOwner?.(ownerId, db);
        await this.config.validateTargets?.(targetIds, db);
        await this.model(db).createMany({
            data: targetIds.map((id) => ({
                [this.config.ownerKey]: ownerId,
                [this.config.targetKey]: id,
            })),
            skipDuplicates: true,
        });
    }

    async detach(ownerId: number, targetIds: number[], db: DbClient): Promise<void> {
        if (!targetIds.length) return;
        await this.config.validateOwner?.(ownerId, db);
        await this.model(db).deleteMany({
            where: {
                [this.config.ownerKey]: ownerId,
                [this.config.targetKey]: { in: targetIds },
            },
        });
    }

    /**
     * Replace toàn bộ relations cho owner với set mới.
     * Nhận TxClient — caller phải wrap trong $transaction.
     * Validate TRƯỚC delete: nếu validateTargets throw thì không mutate.
     */
    async sync(ownerId: number, targetIds: number[], tx: TxClient): Promise<void> {
        await this.config.validateOwner?.(ownerId, tx);
        if (targetIds.length) await this.config.validateTargets?.(targetIds, tx);

        await this.model(tx).deleteMany({ where: { [this.config.ownerKey]: ownerId } });

        if (targetIds.length) {
            await this.model(tx).createMany({
                data: targetIds.map((id) => ({
                    [this.config.ownerKey]: ownerId,
                    [this.config.targetKey]: id,
                })),
            });
        }
    }
}