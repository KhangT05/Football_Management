// libs/relation.service.ts
import { Prisma } from "../generated/prisma/client.js";
import prisma from "./prisma.js";

type TxClient = Prisma.TransactionClient;

export interface RelationConfig {
    table: string;           // "user_role"
    ownerKey: string;        // "user_id"
    targetKey: string;       // "role_id"
    validateOwner?: (id: number, tx: TxClient) => Promise<void>;
    validateTargets?: (ids: number[], tx: TxClient) => Promise<void>;
}

export class RelationService {
    constructor(private config: RelationConfig) { }

    private get model() {
        return (prisma as any)[this.config.table];
    }

    async attach(ownerId: number, targetIds: number[]): Promise<void> {
        if (!targetIds.length) return;
        await prisma.$transaction(async (tx) => {
            await this.config.validateOwner?.(ownerId, tx);
            await this.config.validateTargets?.(targetIds, tx);
            await (tx as any)[this.config.table].createMany({
                data: targetIds.map((id) => ({
                    [this.config.ownerKey]: ownerId,
                    [this.config.targetKey]: id,
                })),
                skipDuplicates: true,
            });
        });
    }

    async detach(ownerId: number, targetIds: number[]): Promise<void> {
        if (!targetIds.length) return;
        await prisma.$transaction(async (tx) => {
            await this.config.validateOwner?.(ownerId, tx);
            await (tx as any)[this.config.table].deleteMany({
                where: {
                    [this.config.ownerKey]: ownerId,
                    [this.config.targetKey]: { in: targetIds },
                },
            });
        });
    }

    async sync(ownerId: number, targetIds: number[]): Promise<void> {
        await prisma.$transaction(async (tx) => {
            await this.config.validateOwner?.(ownerId, tx);
            if (targetIds.length) {
                await this.config.validateTargets?.(targetIds, tx);
            }
            await (tx as any)[this.config.table].deleteMany({
                where: { [this.config.ownerKey]: ownerId },
            });
            if (targetIds.length) {
                await (tx as any)[this.config.table].createMany({
                    data: targetIds.map((id) => ({
                        [this.config.ownerKey]: ownerId,
                        [this.config.targetKey]: id,
                    })),
                });
            }
        });
    }
}