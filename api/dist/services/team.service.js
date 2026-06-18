// services/team.service.ts
import { createAppError } from "../common/app.error.js";
import { Queryable } from "../libs/queryable.js";
// ─── Projections ──────────────────────────────────────────────────────────────
const USER_SELECT = {
    select: { id: true, name: true, email: true, phone: true },
};
const TEAM_WITH_OWNER = {
    include: { user: USER_SELECT },
};
const CAPTAIN_WITH_USER = {
    include: { user: USER_SELECT },
};
// ─── Service ──────────────────────────────────────────────────────────────────
export class TeamService {
    prisma;
    query;
    constructor(prisma) {
        this.prisma = prisma;
        this.query = new Queryable(prisma.team, {
            searchFields: ["name", "description"],
            sortable: ["id", "name", "created_at"],
            defaultSort: { column: "id", direction: "asc" },
            filterable: ["is_active"],
            defaultPerPage: 20,
            maxPerPage: 100,
            beforeBuild: (where) => { where.push({ is_active: true }); },
        });
    }
    // ─── Read ──────────────────────────────────────────────────────────────────
    findAll(req = {}) {
        return this.query.run(req, TEAM_WITH_OWNER);
    }
    async findByIdOrFail(id) {
        const team = await this.prisma.team.findUnique({
            where: { id, is_active: true },
            include: {
                user: USER_SELECT,
                // seasons include chỉ khi cần — tách ra endpoint riêng
            },
        });
        if (!team)
            throw createAppError("NOT_FOUND", `Team ${id} not found`);
        return team;
    }
    /** Lightweight existence check — không join, chỉ lấy fields cần thiết */
    async assertExists(id) {
        const team = await this.prisma.team.findUnique({
            where: { id, is_active: true },
            select: { id: true, user_id: true, logo: true },
        });
        if (!team)
            throw createAppError("NOT_FOUND", `Team ${id} not found`);
        return team;
    }
    // ─── Write ─────────────────────────────────────────────────────────────────
    /** user_id = creator, không phải captain */
    async create(data, userId) {
        return this.prisma.team.create({
            data: { ...data, user_id: userId },
            ...TEAM_WITH_OWNER,
        });
    }
    async update(id, data) {
        await this.assertExists(id);
        const patch = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
        // TODO: old logo leak until schema adds logo_public_id column
        return this.prisma.team.update({
            where: { id },
            data: patch,
            ...TEAM_WITH_OWNER,
        });
    }
    async softDelete(id) {
        await this.assertExists(id);
        const activeSeasonCount = await this.prisma.season.count({
            where: {
                team_id: id,
                is_deleted: false,
                status: { in: ["registration_open", "ongoing"] },
            },
        });
        if (activeSeasonCount > 0)
            throw createAppError("VALIDATION_ERROR", "Cannot delete team with active seasons");
        await this.prisma.team.update({
            where: { id },
            data: { is_active: false, deleted_at: new Date() },
        });
    }
    // ─── Captain ───────────────────────────────────────────────────────────────
    getCaptain(teamId) {
        return this.prisma.teamLeader.findFirst({
            where: { team_id: teamId, is_active: true },
            ...CAPTAIN_WITH_USER,
        });
    }
    async assignCaptain(teamId, newUserId, requesterId, requesterIsAdmin) {
        const [team, currentCaptain, newUser] = await Promise.all([
            this.prisma.team.findUnique({
                where: { id: teamId, is_active: true },
                select: { id: true, user_id: true },
            }),
            this.prisma.teamLeader.findFirst({
                where: { team_id: teamId, is_active: true },
                select: { user_id: true },
            }),
            this.prisma.user.findUnique({
                where: { id: newUserId, is_active: true },
                select: { id: true },
            }),
        ]);
        if (!team)
            throw createAppError("NOT_FOUND", `Team ${teamId} not found`);
        if (!newUser)
            throw createAppError("NOT_FOUND", `User ${newUserId} not found`);
        if (currentCaptain?.user_id === newUserId)
            throw createAppError("BAD_REQUEST", "User is already the captain");
        if (!requesterIsAdmin) {
            const isCaptain = currentCaptain?.user_id === requesterId;
            const isCreator = team.user_id === requesterId;
            if (!isCaptain && !isCreator)
                throw createAppError("FORBIDDEN", "Only current captain or team creator can assign captain");
        }
        // Atomic: deactivate current captain → insert new
        return this.prisma.$transaction(async (tx) => {
            if (currentCaptain) {
                await tx.teamLeader.updateMany({
                    where: { team_id: teamId, is_active: true },
                    data: { is_active: false, ended_at: new Date() },
                });
            }
            return tx.teamLeader.create({
                data: { team_id: teamId, user_id: newUserId, is_active: true },
                ...CAPTAIN_WITH_USER,
            });
        });
    }
}
//# sourceMappingURL=team.service.js.map