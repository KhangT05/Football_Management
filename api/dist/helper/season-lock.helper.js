import { createAppError } from "../common/app.error.js";
export async function lockSeason(tx, seasonId) {
    const rows = await tx.$queryRaw `SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;
    if (rows.length === 0)
        throw createAppError("NOT_FOUND", `Season ${seasonId} not found`);
}
//# sourceMappingURL=season-lock.helper.js.map