import { createAppError } from "../common/app.error.js";
import { PhaseFormat, SeasonTeamStatus } from "../generated/prisma/client.js";
import { shuffle } from "../libs/array.utils.js";
export class GroupService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Lock: schema dùng MySQL — pg_advisory_xact_lock KHÔNG TỒN TẠI, đổi sang
     * SELECT ... FOR UPDATE trên row Phase (InnoDB row lock, transaction-scoped,
     * tự release khi commit/rollback).
     *
     * Cross-phase guard: chặn draw nếu approved team đang giữ group_id thuộc
     * MỘT PHASE KHÁC (xem note ở SeasonTeamService.assignGroup) — bắt buộc
     * clear draw phase đó trước.
     */
    async drawGroups(phaseId, opts) {
        if (opts.teams_per_group < 2)
            throw createAppError("VALIDATION_ERROR", "teams_per_group phải >= 2");
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM phases WHERE id = ${phaseId} FOR UPDATE`;
            const phase = await tx.phase.findUnique({ where: { id: phaseId } });
            if (!phase)
                throw createAppError("NOT_FOUND", `Phase ${phaseId} not found`);
            if (!phase.is_active)
                throw createAppError("CONFLICT", "Phase đã bị deactivate");
            if (phase.format !== PhaseFormat.round_robin)
                throw createAppError("CONFLICT", "Phase không phải round_robin, không draw group");
            const existingMatches = await tx.match.count({ where: { phase_id: phaseId } });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Phase đã có match — xoá schedule trước khi re-draw (kết quả đã đá sẽ mất nếu xoá)");
            const groups = await tx.group.findMany({
                where: { phase_id: phaseId, is_active: true },
                orderBy: { id: "asc" },
            });
            if (groups.length === 0)
                throw createAppError("CONFLICT", "Phase chưa có group nào, tạo group trước khi draw");
            const approvedTeams = await tx.seasonTeam.findMany({
                where: { season_id: phase.season_id, status: SeasonTeamStatus.approved, deleted_at: null },
                select: { id: true, team_id: true, group_id: true },
            });
            const expected = groups.length * opts.teams_per_group;
            if (approvedTeams.length !== expected)
                throw createAppError("CONFLICT", `${approvedTeams.length} approved team không khớp ${groups.length} groups x ${opts.teams_per_group} = ${expected}`);
            await this.assertNoForeignGroupAssignment(tx, phaseId, approvedTeams);
            const shuffled = shuffle(approvedTeams);
            const assignments = shuffled.map((st, i) => {
                const group = groups[Math.floor(i / opts.teams_per_group)];
                if (!group)
                    throw createAppError("CONFLICT", "Group index out of bounds — invariant violated");
                return { seasonTeamId: st.id, team_id: st.team_id, group_id: group.id };
            });
            // N update riêng lẻ — chấp nhận được ở scale vài chục team/phase. N lớn
            // (vài trăm+), đổi sang raw SQL UPDATE ... CASE WHEN id IN (...) (MySQL
            // không có UPDATE ... FROM VALUES như Postgres).
            await Promise.all(assignments.map((a) => tx.seasonTeam.update({ where: { id: a.seasonTeamId }, data: { group_id: a.group_id } })));
            return assignments.map(({ group_id, team_id }) => ({ group_id, team_id }));
        });
    }
    async clearDraw(phaseId) {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM phases WHERE id = ${phaseId} FOR UPDATE`;
            const phase = await tx.phase.findUnique({ where: { id: phaseId } });
            if (!phase)
                throw createAppError("NOT_FOUND", `Phase ${phaseId} not found`);
            const existingMatches = await tx.match.count({ where: { phase_id: phaseId } });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Phase đã có match — xoá schedule trước khi clear draw");
            const groups = await tx.group.findMany({ where: { phase_id: phaseId }, select: { id: true } });
            if (groups.length === 0)
                return;
            await tx.seasonTeam.updateMany({
                where: { group_id: { in: groups.map((g) => g.id) } },
                data: { group_id: null },
            });
        });
    }
    async assertNoForeignGroupAssignment(tx, phaseId, approvedTeams) {
        const currentGroupIds = [
            ...new Set(approvedTeams.map((t) => t.group_id).filter((id) => id !== null)),
        ];
        if (currentGroupIds.length === 0)
            return;
        const foreignGroups = await tx.group.findMany({
            where: { id: { in: currentGroupIds }, phase_id: { not: phaseId } },
            select: { id: true, phase_id: true },
        });
        if (foreignGroups.length > 0) {
            const foreignPhaseIds = [...new Set(foreignGroups.map((g) => g.phase_id))];
            throw createAppError("CONFLICT", `${foreignGroups.length} team đang giữ group_id của phase khác (phase_id: ${foreignPhaseIds.join(", ")}) — clear draw phase đó trước`);
        }
    }
    // group.service.ts
    async findByIdWithTeams(id) {
        const group = await this.prisma.group.findUnique({
            where: { id },
            include: {
                phase: { select: { id: true, name: true, season_id: true, format: true, is_active: true } },
                // ⚠ verify đúng tên relation field trong schema.prisma (back-relation
                // từ Group -> SeasonTeam), tạm đặt là `seasonTeams`
                seasonTeams: {
                    where: { deleted_at: null, is_active: true },
                    select: {
                        id: true,
                        status: true,
                        team: { select: { id: true, name: true, logo: true } },
                    },
                    orderBy: { id: "asc" },
                },
            },
        });
        if (!group)
            throw createAppError("NOT_FOUND", `Group ${id} not found`);
        return group;
    }
}
//# sourceMappingURL=group.service.js.map