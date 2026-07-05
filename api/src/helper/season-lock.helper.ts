import { createAppError } from "../common/app.error.js";
import { Prisma } from "../generated/prisma/client.js";

export async function lockSeason(tx: Prisma.TransactionClient, seasonId: number): Promise<void> {
    const rows = await tx.$queryRaw<{ id: number }[]>`SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;
    if (rows.length === 0) throw createAppError("NOT_FOUND", `Season ${seasonId} not found`);
}