import { createAppError } from "../common/app.error.js";
import { PhaseFormat, SeasonTeamStatus } from "../generated/prisma/client.js";
import { Queryable } from "../libs/queryable.js";
import { withRelations } from "../types/seasonTeam.type.js";
export class SeasonTeamService {
    prisma;
    query;
    constructor(prisma) {
        this.prisma = prisma;
        this.query = new Queryable(prisma.seasonTeam, {
            searchFields: [],
            sortable: ["id", "created_at", "status"],
            defaultSort: { column: "created_at", direction: "desc" },
            filterable: ["season_id", "team_id", "status", "is_active"],
            defaultPerPage: 20,
            maxPerPage: 100,
            beforeBuild: (where) => {
                where.push({ is_active: true, deleted_at: null });
            },
        });
    }
    findAll(req = {}) {
        return this.query.run(req, { include: withRelations.include });
    }
    async findByIdOrFail(id) {
        const record = await this.prisma.seasonTeam.findUnique({ where: { id }, ...withRelations });
        if (!record)
            throw createAppError("NOT_FOUND", `SeasonTeam ${id} not found`);
        return record;
    }
    async selfRegister(data, userId) {
        const team = await this.prisma.team.findFirst({
            where: { user_id: userId },
            select: { id: true },
        });
        if (!team)
            throw createAppError("FORBIDDEN", "You are not a leader of any team");
        return this.prisma.$transaction(async (tx) => {
            // Lock season row — serialize register cùng season, tránh TOCTOU trên
            // assertSlotAvailable (2 request đọc count cùng lúc trước khi cái đầu
            // commit, cả 2 pass check, vượt max_teams).
            await tx.$queryRaw `SELECT id FROM seasons WHERE id = ${data.season_id} FOR UPDATE`;
            const season = await tx.season.findUnique({ where: { id: data.season_id } });
            if (!season)
                throw createAppError("NOT_FOUND", `Season ${data.season_id} not found`);
            if (!season.is_registration_open)
                throw createAppError("FORBIDDEN", "Season is not open for registration");
            if (season.registration_deadline && season.registration_deadline < new Date())
                throw createAppError("FORBIDDEN", "Registration deadline has passed");
            await this.assertSlotAvailable(tx, data.season_id, season.max_teams);
            return this.createOrReactivate(tx, data.season_id, team.id, userId, SeasonTeamStatus.pending);
        });
    }
    async adminAdd(data, userId) {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM seasons WHERE id = ${data.season_id} FOR UPDATE`;
            const season = await tx.season.findUnique({ where: { id: data.season_id } });
            if (!season)
                throw createAppError("NOT_FOUND", `Season ${data.season_id} not found`);
            await this.assertSlotAvailable(tx, data.season_id, season.max_teams);
            return this.createOrReactivate(tx, data.season_id, data.team_id, userId, data.status ?? SeasonTeamStatus.approved);
        });
    }
    async updateStatus(id, data) {
        await this.findByIdOrFail(id);
        return this.prisma.seasonTeam.update({
            where: { id },
            data: { status: data.status },
            ...withRelations,
        });
    }
    /**
     * group_id trên SeasonTeam season-scoped, Group phase-scoped — season có
     * >1 phase round_robin sẽ overwrite lẫn nhau, không có FK nào chặn việc này.
     * Mitigate (không fix triệt để) bằng cách chỉ cho gán khi: team đã approved,
     * group/phase còn active, phase đúng format round_robin, group thuộc đúng
     * season của team.
     */
    async assignGroup(id, data) {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM season_teams WHERE id = ${id} FOR UPDATE`;
            const seasonTeam = await tx.seasonTeam.findUnique({ where: { id }, ...withRelations });
            if (!seasonTeam)
                throw createAppError("NOT_FOUND", `SeasonTeam ${id} not found`);
            if (seasonTeam.status !== SeasonTeamStatus.approved)
                throw createAppError("CONFLICT", "Chỉ team đã approved mới được gán group");
            const group = await tx.group.findUnique({
                where: { id: data.group_id },
                include: { phase: { select: { id: true, season_id: true, format: true, is_active: true } } },
            });
            if (!group)
                throw createAppError("NOT_FOUND", `Group ${data.group_id} not found`);
            if (!group.is_active || !group.phase.is_active)
                throw createAppError("CONFLICT", "Group hoặc phase đã bị deactivate");
            if (group.phase.format !== PhaseFormat.round_robin)
                throw createAppError("CONFLICT", "Chỉ gán group cho phase round_robin");
            if (group.phase.season_id !== seasonTeam.season.id)
                throw createAppError("CONFLICT", "Group không thuộc season của team này");
            return tx.seasonTeam.update({ where: { id }, data: { group_id: data.group_id }, ...withRelations });
        });
    }
    async softDelete(id) {
        await this.findByIdOrFail(id);
        await this.prisma.seasonTeam.update({
            where: { id },
            data: { is_active: false, deleted_at: new Date() },
        });
    }
    async assertSlotAvailable(tx, seasonId, maxTeams) {
        const count = await tx.seasonTeam.count({
            where: { season_id: seasonId, status: SeasonTeamStatus.approved, deleted_at: null },
        });
        if (count >= maxTeams)
            throw createAppError("CONFLICT", "Season has reached maximum team capacity");
    }
    /**
     * @@unique([season_id, team_id]) không exclude deleted_at (MySQL không có
     * partial unique index). Team withdraw rồi đăng ký lại phải reactivate row
     * cũ, không create mới — create thẳng sẽ đụng unique constraint.
     */
    async createOrReactivate(tx, seasonId, teamId, userId, status) {
        const existing = await tx.seasonTeam.findUnique({
            where: { season_id_team_id: { season_id: seasonId, team_id: teamId } },
        });
        if (existing) {
            if (!existing.deleted_at)
                throw createAppError("CONFLICT", "Team đã đăng ký season này");
            return tx.seasonTeam.update({
                where: { id: existing.id },
                data: {
                    is_active: true,
                    deleted_at: null,
                    status,
                    user_id: userId,
                    group_id: null, // group cũ (nếu còn) có thể thuộc phase đã đóng — reset
                },
                ...withRelations,
            });
        }
        return tx.seasonTeam.create({
            data: { season_id: seasonId, team_id: teamId, user_id: userId, status },
            ...withRelations,
        });
    }
}
//# sourceMappingURL=seasonTeam.service.js.map