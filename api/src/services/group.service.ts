import { createAppError } from "../common/app.error.js";
import { Prisma, PhaseFormat, PrismaClient, SeasonTeamStatus, PhaseStatus, PhaseType } from "../generated/prisma/client.js";
import { lockSeason } from "../helper/season-lock.helper.js";
import { shuffle } from "../libs/array.utils.js";
import { DrawAssignment, DrawGroupsOptions } from "../types/group.type.js";
export class GroupService {
    constructor(private readonly prisma: PrismaClient) { }

    // ============================================================
    // PHASE RESOLUTION (season-scoped, internal — FE không biết phaseId)
    // ============================================================

    /**
     * Lock ở mức season, không phải phase — vì phase có thể CHƯA TỒN TẠI
     * (get-or-create). Lock 1 row phase không có tác dụng chống race khi
     * row đó chưa được tạo; 2 request createGroupsBulk đồng thời cho cùng
     * season đều sẽ pass check "findFirst -> null" rồi cùng insert phase
     * mới nếu không serialize qua season trước.
     *
     * Hệ quả: mọi write-path (create/draw/clear) trên group của 1 season
     * giờ serialize qua season lock — chấp nhận được vì đây vốn là các
     * thao tác admin tần suất thấp, không phải hot path.
     */
    /** Chỉ dùng ở các entrypoint TẠO dữ liệu (createGroup, createGroupsBulk). */
    private async getOrCreateRoundRobinPhase(tx: Prisma.TransactionClient, seasonId: number) {
        await lockSeason(tx, seasonId);

        let phase = await tx.phase.findFirst({
            where: { season_id: seasonId, format: PhaseFormat.round_robin, is_active: true },
        });

        if (!phase) {
            phase = await tx.phase.create({
                data: {
                    season_id: seasonId,
                    format: PhaseFormat.round_robin,
                    status: PhaseStatus.draft,
                    type: PhaseType.group_stage,
                    order: 0,
                    name: "Group Stage",
                    is_active: true,
                },
            });
        }
        return phase;
    }

    /**
     * Dùng cho read/draw/clear — KHÔNG tự tạo phase. Auto-create trong 1
     * GET hoặc trong draw/clear là side-effect ẩn (gọi drawGroups trên
     * season chưa từng tạo group sẽ tạo ra 1 phase rỗng vô nghĩa trước
     * khi throw "chưa có group"). Rõ ràng hơn: null nghĩa là "chưa có gì",
     * caller tự quyết định thông báo phù hợp.
     */
    private async findRoundRobinPhase(tx: Prisma.TransactionClient, seasonId: number) {
        return tx.phase.findFirst({
            where: { season_id: seasonId, format: PhaseFormat.round_robin, is_active: true },
        });
    }

    // ============================================================
    // CREATE GROUP
    // ============================================================

    /**
     * FIX (root cause "bốc thăm không được dù đã tạo bảng"): insert giờ
     * set `is_active: true` TƯỜNG MINH thay vì phụ thuộc default cột
     * trong Prisma schema. Mọi read-path (buildGroupsPayload, drawGroups,
     * drawGroupsSeeded, clearDraw) đều filter cứng `is_active: true` —
     * nếu default schema/generated client không đảm bảo true, group vừa
     * tạo bị ẩn hoàn toàn khỏi list -> FE luôn thấy groups.length === 0
     * -> nút bốc thăm bị disable, và drawGroups() cũng tự throw "Phase
     * chưa có group nào" dù DB đã có row. Đây cùng bug class với fix đã
     * áp ở SeasonTeamService.createOrReactivate — không tự động lan sang
     * đây vì là 2 service riêng.
     */
    async createGroup(seasonId: number, name: string): Promise<{ id: number; name: string; phase_id: number }> {
        return this.prisma.$transaction(async (tx) => {
            const phase = await this.getOrCreateRoundRobinPhase(tx, seasonId);

            if (!phase.is_active) throw createAppError("CONFLICT", "Phase đã bị deactivate");
            if (phase.status === PhaseStatus.locked)
                throw createAppError("CONFLICT", "Phase đã locked, không thể tạo group mới");

            const existing = await tx.group.findFirst({
                where: { phase_id: phase.id, name, is_active: true },
                select: { id: true },
            });
            if (existing) throw createAppError("CONFLICT", `Group "${name}" đã tồn tại trong phase này`);

            return tx.group.create({
                data: { phase_id: phase.id, name, is_active: true },
                select: { id: true, name: true, phase_id: true },
            });
        });
    }

    async createGroupsBulk(seasonId: number, count: number): Promise<{ id: number; name: string }[]> {
        if (count < 1 || count > 26)
            throw createAppError("VALIDATION_ERROR", "count phải trong khoảng 1-26");

        return this.prisma.$transaction(async (tx) => {
            const phase = await this.getOrCreateRoundRobinPhase(tx, seasonId);

            if (!phase.is_active) throw createAppError("CONFLICT", "Phase đã bị deactivate");
            if (phase.status === PhaseStatus.locked)
                throw createAppError("CONFLICT", "Phase đã locked, không thể tạo group mới");

            const existingCount = await tx.group.count({ where: { phase_id: phase.id, is_active: true } });
            if (existingCount > 0)
                throw createAppError(
                    "CONFLICT",
                    `Season đã có ${existingCount} group — xoá hết group cũ trước khi bulk-create lại`
                );

            const names = Array.from({ length: count }, (_, i) => `Bảng ${String.fromCharCode(65 + i)}`);

            // FIX: is_active: true tường minh — xem comment ở createGroup().
            await tx.group.createMany({
                data: names.map((name) => ({ phase_id: phase.id, name, is_active: true })),
            });

            return tx.group.findMany({
                where: { phase_id: phase.id, name: { in: names } },
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            });
        });
    }

    /**
     * FIX (breaking change so với bản phaseId cũ): giờ nhận seasonId, trả
     * { phase: null, groups: [] } nếu season chưa từng tạo group/phase —
     * đây là trạng thái HỢP LỆ ("chưa bắt đầu"), không phải lỗi và không
     * tự tạo phase trong 1 read endpoint. FE phân biệt trạng thái này với
     * lỗi thật (network/500) qua try/catch như bình thường, không cần
     * thêm 1 field boolean riêng.
     */
    async findAllBySeason(seasonId: number) {
        const phase = await this.prisma.phase.findFirst({
            where: { season_id: seasonId, format: PhaseFormat.round_robin, is_active: true },
            select: { id: true, name: true, format: true, status: true, teams_per_group: true, season_id: true },
        });

        if (!phase) return { phase: null, groups: [] };

        return this.buildGroupsPayload(phase);
    }

    /**
     * NEW: list group theo phase_id trực tiếp — dùng khi FE đã biết
     * phaseId cụ thể (route GET /groups/phase/{phaseId}). Tách biệt khỏi
     * findAllBySeason vì khác semantic: cái này KHÔNG filter theo
     * season_id/format, chỉ cần đúng phase tồn tại và active. Cần thiết
     * cho trường hợp 1 season có nhiều phase (vd multi-stage: nhiều
     * round_robin phase, hoặc phase group_stage không phải round_robin)
     * — trước đây route này gọi nhầm findAllBySeason(phaseId), coi
     * phaseId như seasonId, sẽ trả sai/rỗng data khi 2 giá trị lệch nhau.
     */
    async findAllByPhase(phaseId: number) {
        const phase = await this.prisma.phase.findUnique({
            where: { id: phaseId },
            select: { id: true, name: true, format: true, status: true, teams_per_group: true, season_id: true, is_active: true },
        });

        if (!phase || !phase.is_active) return { phase: null, groups: [] };

        return this.buildGroupsPayload(phase);
    }

    private async buildGroupsPayload(phase: {
        id: number; name: string; format: PhaseFormat; status: PhaseStatus; teams_per_group: number | null; season_id: number;
    }) {
        const groups = await this.prisma.group.findMany({
            where: { phase_id: phase.id, is_active: true },
            select: {
                id: true,
                name: true,
                status: true,
                season_teams: {
                    where: { deleted_at: null, is_active: true, status: SeasonTeamStatus.approved },
                    select: { id: true, team_id: true },
                    orderBy: { id: "asc" },
                },
            },
            orderBy: { id: "asc" },
        });

        return { phase, groups };
    }

    async deactivateGroup(groupId: number): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM groups WHERE id = ${groupId} FOR UPDATE`;

            const group = await tx.group.findUnique({ where: { id: groupId }, select: { id: true } });
            if (!group) throw createAppError("NOT_FOUND", `Group ${groupId} not found`);

            const matchCount = await tx.match.count({ where: { group_id: groupId, deleted_at: null } });
            if (matchCount > 0) throw createAppError("CONFLICT", "Group đã có match — không thể xoá");

            await tx.seasonTeam.updateMany({ where: { group_id: groupId }, data: { group_id: null } });
            await tx.group.update({ where: { id: groupId }, data: { is_active: false } });
        });
    }

    // ============================================================
    // DRAW
    // ============================================================

    async drawGroups(seasonId: number, opts: DrawGroupsOptions): Promise<DrawAssignment[]> {
        if (opts.teams_per_group < 2)
            throw createAppError("VALIDATION_ERROR", "teams_per_group phải >= 2");

        return this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, seasonId);

            const phase = await this.findRoundRobinPhase(tx, seasonId);
            if (!phase) throw createAppError("CONFLICT", "Season chưa có group nào, tạo group trước khi draw");
            if (!phase.is_active) throw createAppError("CONFLICT", "Phase đã bị deactivate");

            const existingMatches = await tx.match.count({
                where: { phase_id: phase.id, deleted_at: null },
            });
            if (existingMatches > 0)
                throw createAppError(
                    "CONFLICT",
                    "Phase đã có match — xoá schedule trước khi re-draw (kết quả đã đá sẽ mất nếu xoá)"
                );

            const groups = await tx.group.findMany({
                where: { phase_id: phase.id, is_active: true },
                orderBy: { id: "asc" },
            });
            if (groups.length === 0)
                throw createAppError("CONFLICT", "Phase chưa có group nào, tạo group trước khi draw");

            const approvedTeams = await tx.seasonTeam.findMany({
                where: { season_id: phase.season_id, status: SeasonTeamStatus.approved, deleted_at: null },
                select: { id: true, team_id: true, group_id: true },
            });

            const minRequired = groups.length * 2;
            if (approvedTeams.length < minRequired)
                throw createAppError(
                    "CONFLICT",
                    `Chỉ có ${approvedTeams.length} approved team, cần ít nhất ${minRequired} cho ${groups.length} group`
                );

            const maxAllowed = groups.length * opts.teams_per_group;
            if (approvedTeams.length > maxAllowed)
                throw createAppError(
                    "CONFLICT",
                    `${approvedTeams.length} approved team vượt capacity ${groups.length} group x ` +
                    `${opts.teams_per_group} = ${maxAllowed} — tăng teams_per_group hoặc tạo thêm group`
                );

            await this.assertNoForeignGroupAssignment(tx, phase.id, approvedTeams);

            const shuffled = shuffle(approvedTeams);
            const distributed = this.snakeDistribute(shuffled, groups.length);

            const assignments: { seasonTeamId: number; group_id: number; team_id: number }[] = [];
            distributed.forEach((teamsInGroup, i) => {
                const group = groups[i]!;
                for (const st of teamsInGroup) {
                    assignments.push({ seasonTeamId: st.id, team_id: st.team_id, group_id: group.id });
                }
            });

            await this.applyAssignments(tx, assignments);

            const nominal = Math.max(...distributed.map((g) => g.length));
            await tx.phase.update({
                where: { id: phase.id },
                data: { teams_per_group: nominal },
            });

            return assignments.map(({ group_id, team_id }) => ({ group_id, team_id }));
        });
    }

    async clearDraw(seasonId: number): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, seasonId);

            const phase = await this.findRoundRobinPhase(tx, seasonId);
            if (!phase) return; // chưa từng tạo phase/group thì không có gì để xoá

            const existingMatches = await tx.match.count({
                where: { phase_id: phase.id, deleted_at: null },
            });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Phase đã có match — xoá schedule trước khi clear draw");

            const groups = await tx.group.findMany({ where: { phase_id: phase.id }, select: { id: true } });
            if (groups.length === 0) return;

            await tx.seasonTeam.updateMany({
                where: { group_id: { in: groups.map((g) => g.id) } },
                data: { group_id: null },
            });

            await tx.phase.update({
                where: { id: phase.id },
                data: { teams_per_group: null },
            });
        });
    }

    async assignTeamToGroup(seasonTeamId: number, groupId: number): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            const seasonTeamRows = await tx.$queryRaw<
                { id: number; status: SeasonTeamStatus; group_id: number | null; season_id: number }[]
            > `SELECT id, status, group_id, season_id FROM season_teams WHERE id = ${seasonTeamId} FOR UPDATE`;
            const seasonTeam = seasonTeamRows[0];
            if (!seasonTeam) throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamId} not found`);

            const groupRows = await tx.$queryRaw<
                { id: number; phase_id: number }[]
            > `SELECT id, phase_id FROM groups WHERE id = ${groupId} AND is_active = 1 FOR UPDATE`;
            const group = groupRows[0];
            if (!group) throw createAppError("NOT_FOUND", `Group ${groupId} not found hoặc inactive`);

            if (seasonTeam.status !== SeasonTeamStatus.approved)
                throw createAppError("CONFLICT", "Chỉ assign team có status approved");

            const phase = await tx.phase.findUnique({
                where: { id: group.phase_id },
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
                await tx.seasonTeam.update({ where: { id: seasonTeamId }, data: { group_id: null } });
            }

            const capacity = phase.teams_per_group ?? Infinity;

            const currentCount = await tx.seasonTeam.count({
                where: { group_id: groupId, deleted_at: null },
            });
            if (currentCount >= capacity)
                throw createAppError("CONFLICT", `Group ${groupId} đã full (${capacity} teams)`);

            await tx.seasonTeam.update({ where: { id: seasonTeamId }, data: { group_id: groupId } });
        });
    }

    async swapTeams(seasonTeamIdA: number, seasonTeamIdB: number): Promise<void> {
        if (seasonTeamIdA === seasonTeamIdB)
            throw createAppError("VALIDATION_ERROR", "Không thể swap team với chính nó");

        return this.prisma.$transaction(async (tx) => {
            const [first, second] = [seasonTeamIdA, seasonTeamIdB].sort((a, b) => a - b);
            const rows = await tx.$queryRaw<
                { id: number; group_id: number | null; status: SeasonTeamStatus; season_id: number }[]
            > `
                SELECT id, group_id, status, season_id FROM season_teams
                WHERE id IN (${first}, ${second})
                FOR UPDATE
            `;

            const teamA = rows.find((r) => r.id === seasonTeamIdA);
            const teamB = rows.find((r) => r.id === seasonTeamIdB);
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

            const groupA = await tx.group.findUnique({ where: { id: teamA.group_id }, select: { phase_id: true } });
            const groupB = await tx.group.findUnique({ where: { id: teamB.group_id }, select: { phase_id: true } });
            if (!groupA || !groupB)
                throw createAppError("NOT_FOUND", "Group của 1 trong 2 team không tồn tại");
            if (groupA.phase_id !== groupB.phase_id)
                throw createAppError(
                    "CONFLICT",
                    `2 team thuộc 2 phase khác nhau (phase ${groupA.phase_id} vs ${groupB.phase_id}) — chỉ swap trong cùng phase`
                );

            await tx.seasonTeam.update({ where: { id: seasonTeamIdA }, data: { group_id: teamB.group_id } });
            await tx.seasonTeam.update({ where: { id: seasonTeamIdB }, data: { group_id: teamA.group_id } });
        });
    }

    async drawGroupsSeeded(
        seasonId: number,
        opts: DrawGroupsOptions & { num_pots: number }
    ): Promise<DrawAssignment[]> {
        if (opts.teams_per_group < 2)
            throw createAppError("VALIDATION_ERROR", "teams_per_group phải >= 2");
        if (opts.num_pots < 1)
            throw createAppError("VALIDATION_ERROR", "num_pots phải >= 1");

        return this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, seasonId);

            const phase = await this.findRoundRobinPhase(tx, seasonId);
            if (!phase) throw createAppError("CONFLICT", "Season chưa có group nào, tạo group trước khi draw");
            if (!phase.is_active) throw createAppError("CONFLICT", "Phase đã deactivate");

            const existingMatches = await tx.match.count({
                where: { phase_id: phase.id, deleted_at: null },
            });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Phase đã có match — xoá schedule trước khi re-draw");

            const groups = await tx.group.findMany({
                where: { phase_id: phase.id, is_active: true },
                orderBy: { id: "asc" },
            });
            if (groups.length === 0)
                throw createAppError("CONFLICT", "Phase chưa có group");

            const approvedTeams = await tx.seasonTeam.findMany({
                where: { season_id: phase.season_id, status: SeasonTeamStatus.approved, deleted_at: null },
                select: { id: true, team_id: true, group_id: true, seed: true },
            });

            const minRequired = groups.length * 2;
            if (approvedTeams.length < minRequired)
                throw createAppError(
                    "CONFLICT",
                    `Chỉ có ${approvedTeams.length} approved team, cần ít nhất ${minRequired} cho ${groups.length} group`
                );

            await this.assertNoForeignGroupAssignment(tx, phase.id, approvedTeams);

            const seeded = [...approvedTeams]
                .filter((t) => t.seed !== null)
                .sort((a, b) => (a.seed ?? 0) - (b.seed ?? 0));
            const unseeded = shuffle(approvedTeams.filter((t) => t.seed === null));
            const sorted = [...seeded, ...unseeded];

            const pots = this.splitIntoPots(sorted, opts.num_pots);

            const maxPotSize = Math.max(...pots.map((p) => p.length));
            if (maxPotSize > groups.length)
                throw createAppError(
                    "CONFLICT",
                    `Pot lớn nhất có ${maxPotSize} team, vượt ${groups.length} group — không thể đảm bảo ` +
                    `mỗi group tối đa 1 team/pot. Giảm num_pots hoặc tăng số group.`
                );

            const assignments: { seasonTeamId: number; group_id: number; team_id: number }[] = [];
            const groupFillCount = new Array(groups.length).fill(0);

            for (const pot of pots) {
                const shuffledPot = shuffle(pot);
                const usedInPot = new Set<number>();
                for (const st of shuffledPot) {
                    let targetIdx = -1;
                    for (let i = 0; i < groups.length; i++) {
                        if (usedInPot.has(i)) continue;
                        if (targetIdx === -1 || groupFillCount[i] < groupFillCount[targetIdx]) targetIdx = i;
                    }
                    usedInPot.add(targetIdx);
                    groupFillCount[targetIdx]++;
                    assignments.push({
                        seasonTeamId: st.id,
                        team_id: st.team_id,
                        group_id: groups[targetIdx]!.id,
                    });
                }
            }

            const maxFill = Math.max(...groupFillCount);
            if (maxFill > opts.teams_per_group)
                throw createAppError(
                    "CONFLICT",
                    `Distribution tạo group với ${maxFill} team, vượt teams_per_group=${opts.teams_per_group} — ` +
                    `tăng teams_per_group hoặc tạo thêm group`
                );

            await this.applyAssignments(tx, assignments);

            await tx.phase.update({
                where: { id: phase.id },
                data: { teams_per_group: maxFill },
            });

            return assignments.map(({ group_id, team_id }) => ({ group_id, team_id }));
        });
    }

    async findByIdWithTeams(id: number) {
        const group = await this.prisma.group.findUnique({
            where: { id },
            include: {
                phase: {
                    select: { id: true, name: true, season_id: true, format: true, is_active: true },
                },
                season_teams: {
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

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private snakeDistribute<T>(items: T[], groupCount: number): T[][] {
        const groups: T[][] = Array.from({ length: groupCount }, () => []);
        let idx = 0;
        let dir = 1;
        for (const item of items) {
            groups[idx]!.push(item);
            idx += dir;
            if (idx === groupCount) { idx = groupCount - 1; dir = -1; }
            else if (idx === -1) { idx = 0; dir = 1; }
        }
        return groups;
    }

    private splitIntoPots<T>(items: T[], numPots: number): T[][] {
        const pots: T[][] = [];
        const base = Math.floor(items.length / numPots);
        const remainder = items.length % numPots;
        let idx = 0;
        for (let p = 0; p < numPots; p++) {
            const size = base + (p < remainder ? 1 : 0);
            pots.push(items.slice(idx, idx + size));
            idx += size;
        }
        return pots;
    }

    private async applyAssignments(
        tx: Prisma.TransactionClient,
        assignments: { seasonTeamId: number; group_id: number }[]
    ): Promise<void> {
        const byGroup = new Map<number, number[]>();
        for (const a of assignments) {
            const list = byGroup.get(a.group_id) ?? [];
            list.push(a.seasonTeamId);
            byGroup.set(a.group_id, list);
        }
        for (const [groupId, seasonTeamIds] of byGroup) {
            await tx.seasonTeam.updateMany({
                where: { id: { in: seasonTeamIds } },
                data: { group_id: groupId },
            });
        }
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