import { createAppError } from "../common/app.error.js";
import { Prisma, PhaseFormat, PrismaClient, SeasonTeamStatus } from "../generated/prisma/client.js";
import { shuffle } from "../libs/array.utils.js";
import { DrawAssignment, DrawGroupsOptions } from "../types/group.type.js";

export class GroupService {
    constructor(private readonly prisma: PrismaClient) { }

    /**
     * Lock: schema dùng MySQL — pg_advisory_xact_lock KHÔNG TỒN TẠI, đổi sang
     * SELECT ... FOR UPDATE trên row Phase (InnoDB row lock, transaction-scoped,
     * tự release khi commit/rollback).
     *
     * Cross-phase guard: chặn draw nếu approved team đang giữ group_id thuộc
     * MỘT PHASE KHÁC (xem note ở SeasonTeamService.assignGroup) — bắt buộc
     * clear draw phase đó trước.
     *
     * FIX: persist opts.teams_per_group vào phase.teams_per_group sau khi draw
     * thành công — trước đây giá trị này chỉ tồn tại tạm thời trong request,
     * khiến assignTeamToGroup() (thêm 1 team lẻ sau draw) không có cách nào
     * biết group đã đầy chưa (field phase.teams_per_group không tồn tại trong
     * schema gốc, đã thêm ở schema.diff.prisma).
     */
    async drawGroups(phaseId: number, opts: DrawGroupsOptions): Promise<DrawAssignment[]> {
        if (opts.teams_per_group < 2)
            throw createAppError("VALIDATION_ERROR", "teams_per_group phải >= 2");

        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM phases WHERE id = ${phaseId} FOR UPDATE`;

            const phase = await tx.phase.findUnique({ where: { id: phaseId } });
            if (!phase) throw createAppError("NOT_FOUND", `Phase ${phaseId} not found`);
            if (!phase.is_active) throw createAppError("CONFLICT", "Phase đã bị deactivate");
            if (phase.format !== PhaseFormat.round_robin)
                throw createAppError("CONFLICT", "Phase không phải round_robin, không draw group");

            const existingMatches = await tx.match.count({ where: { phase_id: phaseId } });
            if (existingMatches > 0)
                throw createAppError(
                    "CONFLICT",
                    "Phase đã có match — xoá schedule trước khi re-draw (kết quả đã đá sẽ mất nếu xoá)"
                );

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
                throw createAppError(
                    "CONFLICT",
                    `${approvedTeams.length} approved team không khớp ${groups.length} groups x ${opts.teams_per_group} = ${expected}`
                );

            await this.assertNoForeignGroupAssignment(tx, phaseId, approvedTeams);

            const shuffled = shuffle(approvedTeams);
            const assignments = shuffled.map((st, i) => {
                const group = groups[Math.floor(i / opts.teams_per_group)];
                if (!group) throw createAppError("CONFLICT", "Group index out of bounds — invariant violated");
                return { seasonTeamId: st.id, team_id: st.team_id, group_id: group.id };
            });

            await Promise.all(
                assignments.map((a) =>
                    tx.seasonTeam.update({ where: { id: a.seasonTeamId }, data: { group_id: a.group_id } })
                )
            );

            // FIX: persist teams_per_group lên Phase — assignTeamToGroup cần field
            // này để biết group đã đầy chưa khi thêm 1 team lẻ sau draw.
            await tx.phase.update({
                where: { id: phaseId },
                data: { teams_per_group: opts.teams_per_group },
            });

            return assignments.map(({ group_id, team_id }) => ({ group_id, team_id }));
        });
    }

    async clearDraw(phaseId: number): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM phases WHERE id = ${phaseId} FOR UPDATE`;

            const phase = await tx.phase.findUnique({ where: { id: phaseId } });
            if (!phase) throw createAppError("NOT_FOUND", `Phase ${phaseId} not found`);

            const existingMatches = await tx.match.count({ where: { phase_id: phaseId } });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Phase đã có match — xoá schedule trước khi clear draw");

            const groups = await tx.group.findMany({ where: { phase_id: phaseId }, select: { id: true } });
            if (groups.length === 0) return;

            await tx.seasonTeam.updateMany({
                where: { group_id: { in: groups.map((g) => g.id) } },
                data: { group_id: null },
            });

            // FIX: clear draw cũng nên clear nominal capacity — phase coi như
            // chưa có cấu hình group size, tránh assignTeamToGroup dùng số cũ
            // (vd nếu re-draw sau đó với teams_per_group khác).
            await tx.phase.update({
                where: { id: phaseId },
                data: { teams_per_group: null },
            });
        });
    }

    /**
     * Assign đơn lẻ: 1 team vào 1 group.
     *
     * Lock: FOR UPDATE trên cả season_teams và groups để chặn concurrent assign
     * vào cùng group — tránh race condition vượt quá teams_per_group.
     *
     * clearDraw trước assign: nếu team đang giữ group_id khác trong cùng phase,
     * unset trước khi assign mới — tránh team xuất hiện ở 2 group cùng lúc.
     *
     * Cross-phase guard: group phải thuộc cùng season với seasonTeam; nếu team
     * đang giữ group thuộc phase khác → reject, caller phải clear draw phase đó trước.
     *
     * FIX: phase.teams_per_group giờ tồn tại thật trong schema (xem
     * schema.diff.prisma). Vẫn giữ fallback nếu null (phase chưa từng qua
     * drawGroups, vd group được tạo + team gán thủ công từ đầu) — dùng
     * Infinity nghĩa là "không giới hạn", an toàn hơn throw cứng vì caller
     * (admin) có thể đang cố tình build group thủ công không qua draw flow.
     */
    async assignTeamToGroup(seasonTeamId: number, groupId: number): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`
                SELECT id FROM season_teams WHERE id = ${seasonTeamId} FOR UPDATE
            `;
            await tx.$queryRaw`
                SELECT id FROM groups WHERE id = ${groupId} FOR UPDATE
            `;

            const [seasonTeam, group] = await Promise.all([
                tx.seasonTeam.findUnique({
                    where: { id: seasonTeamId, deleted_at: null },
                    select: { id: true, status: true, group_id: true, season_id: true },
                }),
                tx.group.findUnique({
                    where: { id: groupId, is_active: true },
                    select: { id: true, phase_id: true },
                }),
            ]);

            if (!seasonTeam) throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamId} not found`);
            if (!group) throw createAppError("NOT_FOUND", `Group ${groupId} not found hoặc inactive`);
            if (seasonTeam.status !== SeasonTeamStatus.approved)
                throw createAppError("CONFLICT", "Chỉ assign team có status approved");

            const phase = await tx.phase.findUnique({
                where: { id: group.phase_id },
                // FIX: field teams_per_group giờ tồn tại — xem schema.diff.prisma
                select: { id: true, season_id: true, is_active: true, teams_per_group: true },
            });
            if (!phase) throw createAppError("NOT_FOUND", `Phase of group ${groupId} not found`);
            if (!phase.is_active) throw createAppError("CONFLICT", "Phase đã deactivate");

            if (phase.season_id !== seasonTeam.season_id)
                throw createAppError(
                    "CONFLICT",
                    "Group thuộc season khác với SeasonTeam — cross-season assign bị chặn"
                );

            if (seasonTeam.group_id !== null) {
                const currentGroup = await tx.group.findUnique({
                    where: { id: seasonTeam.group_id },
                    select: { phase_id: true },
                });
                if (currentGroup && currentGroup.phase_id !== group.phase_id)
                    throw createAppError(
                        "CONFLICT",
                        `Team đang giữ group thuộc phase ${currentGroup.phase_id} — clear draw phase đó trước`
                    );
            }

            if (seasonTeam.group_id !== null && seasonTeam.group_id !== groupId) {
                await tx.seasonTeam.update({
                    where: { id: seasonTeamId },
                    data: { group_id: null },
                });
            }

            // FIX: fallback Infinity nếu phase chưa từng draw (teams_per_group null)
            // — không chặn admin build group thủ công không qua draw flow.
            const capacity = phase.teams_per_group ?? Infinity;

            const currentCount = await tx.seasonTeam.count({
                where: { group_id: groupId, deleted_at: null },
            });
            if (currentCount >= capacity)
                throw createAppError("CONFLICT", `Group ${groupId} đã full (${capacity} teams)`);

            await tx.seasonTeam.update({
                where: { id: seasonTeamId },
                data: { group_id: groupId },
            });
        });
    }

    /**
     * Swap group_id của 2 SeasonTeam trong 1 transaction.
     *
     * Lock: theo id ascending để tránh deadlock khi 2 concurrent request
     * swap A↔B và B↔A đồng thời.
     *
     * Cross-phase guard: 2 group phải thuộc cùng phase — swap cross-phase
     * không có nghĩa business và có thể corrupt draw của phase kia.
     *
     * Status check: cả 2 team phải approved — pending/rejected không được
     * tham gia draw.
     */
    async swapTeams(seasonTeamIdA: number, seasonTeamIdB: number): Promise<void> {
        if (seasonTeamIdA === seasonTeamIdB)
            throw createAppError("VALIDATION_ERROR", "Không thể swap team với chính nó");

        return this.prisma.$transaction(async (tx) => {
            const [first, second] = [seasonTeamIdA, seasonTeamIdB].sort((a, b) => a - b);
            await tx.$queryRaw`
                SELECT id FROM season_teams
                WHERE id IN (${first}, ${second})
                FOR UPDATE
            `;

            const [teamA, teamB] = await Promise.all([
                tx.seasonTeam.findUnique({
                    where: { id: seasonTeamIdA, deleted_at: null },
                    select: { id: true, group_id: true, status: true, season_id: true },
                }),
                tx.seasonTeam.findUnique({
                    where: { id: seasonTeamIdB, deleted_at: null },
                    select: { id: true, group_id: true, status: true, season_id: true },
                }),
            ]);

            if (!teamA) throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamIdA} not found`);
            if (!teamB) throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamIdB} not found`);

            if (teamA.status !== SeasonTeamStatus.approved)
                throw createAppError("CONFLICT", `SeasonTeam ${seasonTeamIdA} chưa approved`);
            if (teamB.status !== SeasonTeamStatus.approved)
                throw createAppError("CONFLICT", `SeasonTeam ${seasonTeamIdB} chưa approved`);

            if (teamA.group_id === null || teamB.group_id === null)
                throw createAppError("CONFLICT", "Cả 2 team phải đang ở trong 1 group trước khi swap");
            if (teamA.group_id === teamB.group_id)
                throw createAppError("CONFLICT", "2 team đang cùng group");

            const [groupA, groupB] = await Promise.all([
                tx.group.findUnique({ where: { id: teamA.group_id }, select: { phase_id: true } }),
                tx.group.findUnique({ where: { id: teamB.group_id }, select: { phase_id: true } }),
            ]);
            if (!groupA || !groupB)
                throw createAppError("NOT_FOUND", "Group của 1 trong 2 team không tồn tại");
            if (groupA.phase_id !== groupB.phase_id)
                throw createAppError(
                    "CONFLICT",
                    `2 team thuộc 2 phase khác nhau (phase ${groupA.phase_id} vs ${groupB.phase_id}) — chỉ swap trong cùng phase`
                );

            await Promise.all([
                tx.seasonTeam.update({
                    where: { id: seasonTeamIdA },
                    data: { group_id: teamB.group_id }
                }),
                tx.seasonTeam.update({
                    where: { id: seasonTeamIdB },
                    data: { group_id: teamA.group_id }
                }),
            ]);
        });
    }

    /**
     * Seeded draw: chia team vào group theo pot dựa trên field `seed`.
     * FIX: persist teams_per_group lên Phase, đồng nhất với drawGroups().
     */
    async drawGroupsSeeded(
        phaseId: number,
        opts: DrawGroupsOptions & { num_pots: number }
    ): Promise<DrawAssignment[]> {
        if (opts.teams_per_group < 2)
            throw createAppError("VALIDATION_ERROR", "teams_per_group phải >= 2");
        if (opts.num_pots < 1)
            throw createAppError("VALIDATION_ERROR", "num_pots phải >= 1");

        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM phases WHERE id = ${phaseId} FOR UPDATE`;

            const phase = await tx.phase.findUnique({ where: { id: phaseId } });
            if (!phase) throw createAppError("NOT_FOUND", `Phase ${phaseId} not found`);
            if (!phase.is_active) throw createAppError("CONFLICT", "Phase đã deactivate");
            if (phase.format !== PhaseFormat.round_robin)
                throw createAppError("CONFLICT", "Phase không phải round_robin");

            const existingMatches = await tx.match.count({ where: { phase_id: phaseId } });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Phase đã có match — xoá schedule trước khi re-draw");

            const groups = await tx.group.findMany({
                where: { phase_id: phaseId, is_active: true },
                orderBy: { id: "asc" },
            });
            if (groups.length === 0)
                throw createAppError("CONFLICT", "Phase chưa có group");

            if (opts.num_pots !== opts.teams_per_group)
                throw createAppError(
                    "VALIDATION_ERROR",
                    `num_pots (${opts.num_pots}) phải bằng teams_per_group (${opts.teams_per_group}) — mỗi pot assign 1 team/group`
                );

            const approvedTeams = await tx.seasonTeam.findMany({
                where: { season_id: phase.season_id, status: SeasonTeamStatus.approved, deleted_at: null },
                select: { id: true, team_id: true, group_id: true, seed: true },
            });

            const expected = groups.length * opts.teams_per_group;
            if (approvedTeams.length !== expected)
                throw createAppError(
                    "CONFLICT",
                    `${approvedTeams.length} approved team không khớp ${groups.length} x ${opts.teams_per_group} = ${expected}`
                );

            await this.assertNoForeignGroupAssignment(tx, phaseId, approvedTeams);

            const seeded = [...approvedTeams]
                .filter(t => t.seed !== null)
                .sort((a, b) => (a.seed ?? 0) - (b.seed ?? 0));
            const unseeded = shuffle(approvedTeams.filter(t => t.seed === null));
            const sorted = [...seeded, ...unseeded];

            const potSize = groups.length;
            const pots: typeof approvedTeams[] = [];
            for (let p = 0; p < opts.num_pots; p++) {
                const pot = sorted.slice(p * potSize, (p + 1) * potSize);
                if (pot.length !== potSize)
                    throw createAppError(
                        "CONFLICT",
                        `Pot ${p + 1} chỉ có ${pot.length} team, cần ${potSize} — kiểm tra lại seed data`
                    );
                pots.push(pot);
            }

            const assignments: { seasonTeamId: number; group_id: number; team_id: number }[] = [];

            for (const pot of pots) {
                const shuffledPot = shuffle(pot);
                shuffledPot.forEach((st, i) => {
                    const group = groups[i];
                    if (!group) throw createAppError("CONFLICT", "Group index out of bounds — invariant violated");
                    assignments.push({ seasonTeamId: st.id, team_id: st.team_id, group_id: group.id });
                });
            }

            await Promise.all(
                assignments.map(a =>
                    tx.seasonTeam.update({ where: { id: a.seasonTeamId }, data: { group_id: a.group_id } })
                )
            );

            // FIX: persist teams_per_group — đồng nhất với drawGroups()
            await tx.phase.update({
                where: { id: phaseId },
                data: { teams_per_group: opts.teams_per_group },
            });

            return assignments.map(({ group_id, team_id }) => ({ group_id, team_id }));
        });
    }

    async findByIdWithTeams(id: number) {
        const group = await this.prisma.group.findUnique({
            where: { id },
            include: {
                phase: {
                    select: {
                        id: true, name: true, season_id: true,
                        format: true, is_active: true
                    }
                },
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
        if (!group) throw createAppError("NOT_FOUND", `Group ${id} not found`);
        return group;
    }

    private async assertNoForeignGroupAssignment(
        tx: Prisma.TransactionClient,
        phaseId: number,
        approvedTeams: { group_id: number | null }[]
    ): Promise<void> {
        const currentGroupIds = [
            ...new Set(approvedTeams.map((t) => t.group_id).filter((id): id is number => id !== null)),
        ];
        if (currentGroupIds.length === 0) return;

        const foreignGroups = await tx.group.findMany({
            where: { id: { in: currentGroupIds }, phase_id: { not: phaseId } },
            select: { id: true, phase_id: true },
        });
        if (foreignGroups.length > 0) {
            const foreignPhaseIds = [...new Set(foreignGroups.map((g) => g.phase_id))];
            throw createAppError(
                "CONFLICT",
                `${foreignGroups.length} team đang giữ group_id của phase khác (phase_id: ${foreignPhaseIds.join(", ")}) — clear draw phase đó trước`
            );
        }
    }
}