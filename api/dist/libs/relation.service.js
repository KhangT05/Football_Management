export class RelationService {
    config;
    constructor(config) {
        this.config = config;
    }
    model(db) {
        const m = db[this.config.table];
        if (!m) {
            throw new Error(`RelationService: "${this.config.table}" not found on Prisma client. ` +
                `Check that it matches the Prisma model name exactly (camelCase).`);
        }
        return m;
    }
    async attach(ownerId, targetIds, db) {
        if (!targetIds.length)
            return;
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
    async detach(ownerId, targetIds, db) {
        if (!targetIds.length)
            return;
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
    async sync(ownerId, targetIds, tx) {
        await this.config.validateOwner?.(ownerId, tx);
        if (targetIds.length)
            await this.config.validateTargets?.(targetIds, tx);
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
//# sourceMappingURL=relation.service.js.map