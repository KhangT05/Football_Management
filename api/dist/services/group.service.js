import { createAppError } from "../common/app.error.js";
import { Prisma, PhaseFormat, SeasonStatus, SeasonTeamStatus, PhaseStatus, PhaseType } from "../generated/prisma/client.js";
import { lockSeason } from "../helper/season-lock.helper.js";
import { shuffle } from "../libs/array.utils.js";
const GROUP_OPS_ALLOWED_SEASON_STATUS = [
    SeasonStatus.registration_open,
    SeasonStatus.ongoing,
];
export class GroupService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertSeasonAcceptsGroupOps(tx, seasonId) {
        const season = await tx.season.findUnique({
            where: { id: seasonId },
            select: { status: true, is_active: true },
        });
        if (!season)
            throw createAppError("NOT_FOUND", `Season ${seasonId} not found`);
        if (!season.is_active)
            throw createAppError("CONFLICT", `Season ${seasonId} không còn active`);
        if (!GROUP_OPS_ALLOWED_SEASON_STATUS.includes(season.status))
            throw createAppError("CONFLICT", `Season đang ở status '${season.status}' — chỉ được tạo/sửa group khi season ở ` +
                `'registration_open' hoặc 'ongoing'`);
    }
    /**
     * NEW: gộp check "phase còn sửa được không" ở 1 chỗ duy nhất.
     * - locked: phase đã đá xong / đã advance — không bao giờ sửa lại được.
     * - in_progress: phase đã được admin "xác nhận" (confirmGroups) — cấu trúc
     *   group coi như chốt, muốn sửa cấu trúc (tạo/xoá/draw/clear group) phải
     *   unconfirmGroups() về draft trước. assignTeamToGroup/swapTeams KHÔNG
     *   đi qua check này — đó là thao tác "sửa nhẹ" (đổi chỗ 1-1, không đổi
     *   sĩ số/cấu trúc) nên vẫn cho phép ngay cả khi đã confirm.
     */
    assertPhaseIsDraft(phase, action) {
        if (phase.status === PhaseStatus.locked)
            throw createAppError("CONFLICT", `Phase đã locked — không thể ${action}`);
        if (phase.status === PhaseStatus.in_progress)
            throw createAppError("CONFLICT", `Phase đã được xác nhận (in_progress) — hủy xác nhận trước khi ${action}`);
    }
    async getOrCreateRoundRobinPhase(tx, seasonId) {
        await lockSeason(tx, seasonId);
        await this.assertSeasonAcceptsGroupOps(tx, seasonId);
        let phase = await tx.phase.findFirst({
            where: {
                season_id: seasonId,
                format: PhaseFormat.round_robin,
                is_active: true,
                status: { not: PhaseStatus.locked },
            },
            orderBy: { order: 'desc' },
        });
        if (!phase) {
            const lastRoundRobin = await tx.phase.findFirst({
                where: { season_id: seasonId, format: PhaseFormat.round_robin },
                orderBy: { order: 'desc' },
                select: { order: true },
            });
            const nextOrder = (lastRoundRobin?.order ?? 0) + 1;
            // FIX: seed teams_advance_per_group từ TournamentRule.default_teams_advance_per_group
            // — trước đây field này luôn null trên Phase mới tạo, khiến
            // advanceToNextRoundRobin() luôn throw "chưa cấu hình" dù wizard
            // đã cho admin nhập giá trị này ở bước tạo rule.
            const season = await tx.season.findUnique({
                where: { id: seasonId },
                select: { tournamentRule: { select: { teams_advance_per_group: true } } },
            });
            phase = await tx.phase.create({
                data: {
                    season_id: seasonId,
                    format: PhaseFormat.round_robin,
                    status: PhaseStatus.draft,
                    type: PhaseType.group_stage,
                    order: nextOrder,
                    name: nextOrder === 1 ? "Vòng bảng" : `Vòng bảng ${nextOrder}`,
                    is_active: true,
                    teams_advance_per_group: season?.tournamentRule?.teams_advance_per_group ?? null,
                },
            });
        }
        return phase;
    }
    async findRoundRobinPhase(tx, seasonId) {
        return tx.phase.findFirst({
            where: {
                season_id: seasonId,
                format: PhaseFormat.round_robin,
                is_active: true,
                status: { not: PhaseStatus.locked },
            },
            orderBy: { order: 'desc' },
        });
    }
    // ============================================================
    // CREATE GROUP
    // ============================================================
    async createGroup(seasonId, name) {
        return this.prisma.$transaction(async (tx) => {
            const phase = await this.getOrCreateRoundRobinPhase(tx, seasonId);
            if (!phase.is_active)
                throw createAppError("CONFLICT", "Phase đã bị deactivate");
            this.assertPhaseIsDraft(phase, "tạo group mới");
            const existing = await tx.group.findFirst({
                where: { phase_id: phase.id, name, is_active: true },
                select: { id: true },
            });
            if (existing)
                throw createAppError("CONFLICT", `Group "${name}" đã tồn tại trong phase này`);
            return tx.group.create({
                data: { phase_id: phase.id, name, is_active: true },
                select: { id: true, name: true, phase_id: true },
            });
        });
    }
    async createGroupsBulk(seasonId, count) {
        if (count < 1 || count > 26)
            throw createAppError("VALIDATION_ERROR", "count phải trong khoảng 1-26");
        return this.prisma.$transaction(async (tx) => {
            const phase = await this.getOrCreateRoundRobinPhase(tx, seasonId);
            if (!phase.is_active)
                throw createAppError("CONFLICT", "Phase đã bị deactivate");
            this.assertPhaseIsDraft(phase, "tạo group mới");
            const existingCount = await tx.group.count({ where: { phase_id: phase.id, is_active: true } });
            if (existingCount > 0)
                throw createAppError("CONFLICT", `Season đã có ${existingCount} group — xoá hết group cũ trước khi bulk-create lại`);
            const names = Array.from({ length: count }, (_, i) => `Bảng ${String.fromCharCode(65 + i)}`);
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
    async previewGroupSplitBySeason(seasonId, desiredGroupCount) {
        const approvedTeamCount = await this.prisma.seasonTeam.count({
            where: { season_id: seasonId, status: SeasonTeamStatus.approved, deleted_at: null },
        });
        return this.previewGroupSplit(approvedTeamCount, desiredGroupCount);
    }
    previewGroupSplit(approvedTeamCount, desiredGroupCount) {
        if (desiredGroupCount < 1)
            throw createAppError("VALIDATION_ERROR", "desiredGroupCount phải >= 1");
        if (approvedTeamCount < desiredGroupCount * 2)
            return {
                groupCount: desiredGroupCount,
                distribution: [],
                warning: `Chỉ có ${approvedTeamCount} team, không đủ cho ${desiredGroupCount} group (cần ít nhất ${desiredGroupCount * 2})`,
            };
        const dummy = Array.from({ length: approvedTeamCount }, (_, i) => i);
        const distributed = this.snakeDistribute(dummy, desiredGroupCount);
        const sizes = distributed.map(g => g.length);
        const max = Math.max(...sizes);
        const min = Math.min(...sizes);
        return {
            groupCount: desiredGroupCount,
            distribution: sizes,
            warning: max - min > 1
                ? `Lệch ${min}-${max} team/group (không tránh được với ${approvedTeamCount} team / ${desiredGroupCount} group)`
                : undefined,
        };
    }
    async createAndDrawGroups(seasonId, groupCount) {
        return this.prisma.$transaction(async (tx) => {
            const phase = await this.getOrCreateRoundRobinPhase(tx, seasonId);
            if (!phase.is_active)
                throw createAppError("CONFLICT", "Phase đã bị deactivate");
            this.assertPhaseIsDraft(phase, "tạo group mới");
            const existingCount = await tx.group.count({ where: { phase_id: phase.id, is_active: true } });
            if (existingCount > 0)
                throw createAppError("CONFLICT", `Season đã có ${existingCount} group — clearDraw trước khi tạo lại`);
            const approvedTeams = await tx.seasonTeam.findMany({
                where: { season_id: seasonId, status: SeasonTeamStatus.approved, deleted_at: null },
                select: { id: true, team_id: true },
            });
            if (approvedTeams.length < groupCount * 2)
                throw createAppError("CONFLICT", `Chỉ có ${approvedTeams.length} approved team, cần ít nhất ${groupCount * 2} cho ${groupCount} group`);
            const names = Array.from({ length: groupCount }, (_, i) => `Bảng ${String.fromCharCode(65 + i)}`);
            await tx.group.createMany({ data: names.map((name) => ({ phase_id: phase.id, name, is_active: true })) });
            const groups = await tx.group.findMany({
                where: { phase_id: phase.id, name: { in: names } },
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            });
            const shuffled = shuffle(approvedTeams);
            const distributed = this.snakeDistribute(shuffled, groups.length);
            const assignments = [];
            distributed.forEach((teamsInGroup, i) => {
                const group = groups[i];
                for (const st of teamsInGroup) {
                    assignments.push({ seasonTeamId: st.id, team_id: st.team_id, group_id: group.id });
                }
            });
            await this.applyAssignments(tx, assignments);
            const nominal = Math.max(...distributed.map((g) => g.length));
            await tx.phase.update({ where: { id: phase.id }, data: { teams_per_group: nominal } });
            return assignments.map(({ group_id, team_id }) => ({ group_id, team_id }));
        });
    }
    async autoFinalizeGroups(seasonId, opts = {}) {
        const minPerGroup = opts.minTeamsPerGroup ?? 2;
        const maxPerGroup = opts.maxTeamsPerGroup ?? 8;
        if (minPerGroup < 2)
            throw createAppError("VALIDATION_ERROR", "minTeamsPerGroup phải >= 2 (round_robin cần tối thiểu 2 team/group)");
        if (maxPerGroup < minPerGroup)
            throw createAppError("VALIDATION_ERROR", "maxTeamsPerGroup phải >= minTeamsPerGroup");
        return this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, seasonId);
            await this.assertSeasonAcceptsGroupOps(tx, seasonId);
            const phase = await this.findRoundRobinPhase(tx, seasonId);
            if (!phase)
                return [];
            this.assertPhaseIsDraft(phase, "auto-finalize group");
            const existingMatches = await tx.match.count({ where: { phase_id: phase.id, deleted_at: null } });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Phase đã có match — không thể auto-finalize lại (xoá schedule trước nếu thực sự cần đổi số group)");
            const approvedTeams = await tx.seasonTeam.findMany({
                where: { season_id: seasonId, status: SeasonTeamStatus.approved, deleted_at: null },
                select: { id: true, team_id: true },
            });
            if (approvedTeams.length < minPerGroup)
                throw createAppError("CONFLICT", `Chỉ có ${approvedTeams.length} approved team — không đủ ${minPerGroup} team tối thiểu để tổ chức 1 group`);
            const currentGroupCount = await tx.group.count({ where: { phase_id: phase.id, is_active: true } });
            const byMin = Math.max(1, Math.floor(approvedTeams.length / minPerGroup));
            const byMax = Math.max(1, Math.ceil(approvedTeams.length / maxPerGroup));
            let groupCount;
            if (currentGroupCount > 0) {
                groupCount = Math.max(byMax, Math.min(currentGroupCount, byMin));
            }
            else {
                groupCount = Math.max(byMax, Math.min(byMin, 26));
            }
            groupCount = Math.min(groupCount, 26);
            const oldGroups = await tx.group.findMany({
                where: { phase_id: phase.id, is_active: true },
                select: { id: true },
            });
            if (oldGroups.length > 0) {
                await tx.seasonTeam.updateMany({
                    where: { group_id: { in: oldGroups.map((g) => g.id) } },
                    data: { group_id: null },
                });
                await tx.group.updateMany({
                    where: { id: { in: oldGroups.map((g) => g.id) } },
                    data: { is_active: false },
                });
            }
            const names = Array.from({ length: groupCount }, (_, i) => `Bảng ${String.fromCharCode(65 + i)}`);
            await tx.group.createMany({ data: names.map((name) => ({ phase_id: phase.id, name, is_active: true })) });
            const newGroups = await tx.group.findMany({
                where: { phase_id: phase.id, name: { in: names } },
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            });
            const shuffled = shuffle(approvedTeams);
            const distributed = this.snakeDistribute(shuffled, newGroups.length);
            const assignments = [];
            distributed.forEach((teamsInGroup, i) => {
                const group = newGroups[i];
                for (const st of teamsInGroup) {
                    assignments.push({ seasonTeamId: st.id, team_id: st.team_id, group_id: group.id });
                }
            });
            await this.applyAssignments(tx, assignments);
            const nominal = Math.max(...distributed.map((g) => g.length));
            await tx.phase.update({ where: { id: phase.id }, data: { teams_per_group: nominal } });
            return assignments.map(({ group_id, team_id }) => ({ group_id, team_id }));
        });
    }
    async advanceToNextRoundRobin(fromPhaseId, newGroupCount) {
        return this.prisma.$transaction(async (tx) => {
            const fromPhase = await tx.phase.findUniqueOrThrow({ where: { id: fromPhaseId } });
            if (fromPhase.format !== PhaseFormat.round_robin)
                throw createAppError("VALIDATION_ERROR", `Phase ${fromPhaseId} không phải round_robin`);
            if (fromPhase.status !== PhaseStatus.locked)
                throw createAppError("CONFLICT", `Phase ${fromPhaseId} chưa locked — không thể advance`);
            if (!fromPhase.teams_advance_per_group)
                throw createAppError("VALIDATION_ERROR", `Phase ${fromPhaseId} chưa cấu hình teams_advance_per_group`);
            await lockSeason(tx, fromPhase.season_id);
            const advanceN = fromPhase.teams_advance_per_group;
            const groups = await tx.group.findMany({ where: { phase_id: fromPhaseId, is_active: true } });
            const advancedTeamIds = [];
            for (const g of groups) {
                const standings = await tx.teamStanding.findMany({
                    where: { group_id: g.id, deleted_at: null },
                    orderBy: { position: "asc" },
                    take: advanceN,
                    select: { team_id: true },
                });
                if (standings.length < advanceN)
                    throw createAppError("CONFLICT", `Group ${g.id} chưa đủ ${advanceN} standings để advance`);
                advancedTeamIds.push(...standings.map((s) => s.team_id));
            }
            const newPhase = await tx.phase.create({
                data: {
                    season_id: fromPhase.season_id,
                    format: PhaseFormat.round_robin,
                    type: PhaseType.group_stage,
                    order: fromPhase.order + 1,
                    status: PhaseStatus.draft,
                    name: `Vòng bảng ${fromPhase.order + 1}`,
                    is_active: true,
                    // FIX: kế thừa teams_advance_per_group từ TournamentRule của
                    // season — cùng lý do với getOrCreateRoundRobinPhase, tránh
                    // chain RR->RR->RR thứ 3 lại throw "chưa cấu hình".
                    teams_advance_per_group: fromPhase.teams_advance_per_group,
                },
            });
            const names = Array.from({ length: newGroupCount }, (_, i) => `Bảng ${String.fromCharCode(65 + i)}`);
            await tx.group.createMany({ data: names.map((name) => ({ phase_id: newPhase.id, name, is_active: true })) });
            const newGroups = await tx.group.findMany({
                where: { phase_id: newPhase.id, name: { in: names } },
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            });
            const seasonTeams = await tx.seasonTeam.findMany({
                where: { season_id: fromPhase.season_id, team_id: { in: advancedTeamIds }, status: SeasonTeamStatus.approved },
                select: { id: true, team_id: true },
            });
            const shuffled = shuffle(seasonTeams);
            const distributed = this.snakeDistribute(shuffled, newGroups.length);
            const assignments = [];
            distributed.forEach((teamsInGroup, i) => {
                const group = newGroups[i];
                for (const st of teamsInGroup)
                    assignments.push({ seasonTeamId: st.id, team_id: st.team_id, group_id: group.id });
            });
            await this.applyAssignments(tx, assignments);
            const nominal = Math.max(...distributed.map((g) => g.length));
            await tx.phase.update({ where: { id: newPhase.id }, data: { teams_per_group: nominal } });
            return {
                newPhaseId: newPhase.id,
                assignments: assignments.map(({ group_id, team_id }) => ({ group_id, team_id })),
            };
        });
    }
    async findAllBySeason(seasonId) {
        const phase = await this.prisma.phase.findFirst({
            where: {
                season_id: seasonId,
                format: PhaseFormat.round_robin,
                is_active: true,
                status: { not: PhaseStatus.locked },
            },
            orderBy: { order: 'desc' },
            select: { id: true, name: true, format: true, status: true, teams_per_group: true, season_id: true },
        });
        if (!phase)
            return { phase: null, groups: [] };
        return this.buildGroupsPayload(phase);
    }
    async findAllByPhase(phaseId) {
        const phase = await this.prisma.phase.findUnique({
            where: { id: phaseId },
            select: { id: true, name: true, format: true, status: true, teams_per_group: true, season_id: true, is_active: true },
        });
        if (!phase || !phase.is_active)
            return { phase: null, groups: [] };
        return this.buildGroupsPayload(phase);
    }
    async buildGroupsPayload(phase) {
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
    async deactivateGroup(groupId) {
        return this.prisma.$transaction(async (tx) => {
            // FIX: "groups" là từ khóa reserved trong MySQL 8.0+ (dùng cho
            // window frame ROWS/RANGE/GROUPS). Raw query trước đây không bọc
            // backtick nên MySQL parse nhầm thành keyword -> lỗi cú pháp 1064
            // "near 'groups WHERE id = ? FOR UPDATE'", khiến deactivateGroup()
            // (và mọi thao tác xoá bảng ở UI) luôn trả 500. Bọc tên bảng bằng
            // backtick để MySQL hiểu đúng đây là identifier, không phải keyword.
            await tx.$queryRaw `SELECT id FROM \`groups\` WHERE id = ${groupId} FOR UPDATE`;
            const group = await tx.group.findUnique({
                where: { id: groupId },
                select: { id: true, phase_id: true, phase: { select: { status: true } } },
            });
            if (!group)
                throw createAppError("NOT_FOUND", `Group ${groupId} not found`);
            // FIX: trước đây chỉ chặn theo matchCount, không chặn theo phase.status
            // — cho phép xoá 1 group ngay cả khi phase đã confirmGroups(), phá vỡ
            // cấu trúc mà admin vừa chốt mà không cần unconfirm trước.
            this.assertPhaseIsDraft(group.phase, "xoá group");
            const matchCount = await tx.match.count({ where: { group_id: groupId, deleted_at: null } });
            if (matchCount > 0)
                throw createAppError("CONFLICT", "Group đã có match — không thể xoá");
            await tx.seasonTeam.updateMany({ where: { group_id: groupId }, data: { group_id: null } });
            await tx.group.update({ where: { id: groupId }, data: { is_active: false } });
        });
    }
    // ============================================================
    // DRAW
    // ============================================================
    async drawGroups(seasonId, opts) {
        if (opts.teams_per_group < 2)
            throw createAppError("VALIDATION_ERROR", "teams_per_group phải >= 2");
        return this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, seasonId);
            await this.assertSeasonAcceptsGroupOps(tx, seasonId);
            const phase = await this.findRoundRobinPhase(tx, seasonId);
            if (!phase)
                throw createAppError("CONFLICT", "Season chưa có group nào, tạo group trước khi draw");
            if (!phase.is_active)
                throw createAppError("CONFLICT", "Phase đã bị deactivate");
            // FIX: findRoundRobinPhase chỉ loại trừ locked, không loại trừ
            // in_progress — thiếu dòng này, đã confirmGroups() vẫn re-draw được.
            this.assertPhaseIsDraft(phase, "bốc thăm");
            const existingMatches = await tx.match.count({
                where: { phase_id: phase.id, deleted_at: null },
            });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Phase đã có match — xoá schedule trước khi re-draw (kết quả đã đá sẽ mất nếu xoá)");
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
                throw createAppError("CONFLICT", `Chỉ có ${approvedTeams.length} approved team, cần ít nhất ${minRequired} cho ${groups.length} group`);
            const maxAllowed = groups.length * opts.teams_per_group;
            if (approvedTeams.length > maxAllowed)
                throw createAppError("CONFLICT", `${approvedTeams.length} approved team vượt capacity ${groups.length} group x ` +
                    `${opts.teams_per_group} = ${maxAllowed} — tăng teams_per_group hoặc tạo thêm group`);
            await this.assertNoForeignGroupAssignment(tx, phase.id, approvedTeams);
            const shuffled = shuffle(approvedTeams);
            const distributed = this.snakeDistribute(shuffled, groups.length);
            const assignments = [];
            distributed.forEach((teamsInGroup, i) => {
                const group = groups[i];
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
    async clearDraw(seasonId) {
        return this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, seasonId);
            const phase = await this.findRoundRobinPhase(tx, seasonId);
            if (!phase)
                return;
            this.assertPhaseIsDraft(phase, "xoá bốc thăm");
            const existingMatches = await tx.match.count({
                where: { phase_id: phase.id, deleted_at: null },
            });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Phase đã có match — xoá schedule trước khi clear draw");
            const groups = await tx.group.findMany({ where: { phase_id: phase.id }, select: { id: true } });
            if (groups.length === 0)
                return;
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
    /**
     * NEW: chốt cấu trúc group của phase hiện tại — draft -> in_progress.
     * Yêu cầu mọi group active phải có >= 2 team approved (đồng nhất điều
     * kiện tối thiểu của drawGroups). Sau khi confirm, mọi thao tác cấu
     * trúc (tạo/xoá group, draw, clear) bị chặn qua assertPhaseIsDraft —
     * chỉ còn assignTeamToGroup/swapTeams (đổi chỗ 1-1, không đổi cấu trúc)
     * là còn dùng được, phục vụ đúng nhu cầu "confirm rồi chỉ còn swap".
     */
    async confirmGroups(seasonId) {
        return this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, seasonId);
            await this.assertSeasonAcceptsGroupOps(tx, seasonId);
            const phase = await this.findRoundRobinPhase(tx, seasonId);
            if (!phase)
                throw createAppError("CONFLICT", "Season chưa có group nào để xác nhận");
            if (phase.status === PhaseStatus.in_progress)
                return; // idempotent
            const groups = await tx.group.findMany({
                where: { phase_id: phase.id, is_active: true },
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: {
                            season_teams: {
                                where: { deleted_at: null, is_active: true, status: SeasonTeamStatus.approved },
                            },
                        },
                    },
                },
            });
            if (groups.length === 0)
                throw createAppError("CONFLICT", "Chưa có group nào để xác nhận");
            const empty = groups.filter((g) => g._count.season_teams < 2);
            if (empty.length > 0)
                throw createAppError("CONFLICT", `${empty.length} group chưa đủ tối thiểu 2 đội (${empty.map((g) => g.name).join(", ")}) — ` +
                    `bốc thăm/gán đội trước khi xác nhận`);
            await tx.phase.update({ where: { id: phase.id }, data: { status: PhaseStatus.in_progress } });
        });
    }
    /**
     * NEW: hủy xác nhận — in_progress -> draft, để admin mở lại draw/clear/
     * xoá group. Chặn nếu đã có match (giống mọi thao tác cấu trúc khác) vì
     * lúc đó việc "mở khoá" chỉ tạo ảo giác sửa được trong khi lịch đã chốt.
     */
    async unconfirmGroups(seasonId) {
        return this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, seasonId);
            const phase = await this.findRoundRobinPhase(tx, seasonId);
            if (!phase)
                throw createAppError("NOT_FOUND", "Season chưa có group");
            if (phase.status !== PhaseStatus.in_progress)
                return; // idempotent
            const existingMatches = await tx.match.count({ where: { phase_id: phase.id, deleted_at: null } });
            if (existingMatches > 0)
                throw createAppError("CONFLICT", "Đã có lịch thi đấu — không thể hủy xác nhận");
            await tx.phase.update({ where: { id: phase.id }, data: { status: PhaseStatus.draft } });
        });
    }
    async assignTeamToGroup(seasonTeamId, groupId) {
        return this.prisma.$transaction(async (tx) => {
            const seasonTeamRows = await tx.$queryRaw `SELECT id, status, group_id, season_id FROM season_teams WHERE id = ${seasonTeamId} FOR UPDATE`;
            const seasonTeam = seasonTeamRows[0];
            if (!seasonTeam)
                throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamId} not found`);
            // FIX: bọc backtick quanh `groups` — cùng nguyên nhân với
            // deactivateGroup() ở trên (GROUPS là reserved keyword MySQL 8+).
            const groupRows = await tx.$queryRaw `SELECT id, phase_id FROM \`groups\` WHERE id = ${groupId} AND is_active = 1 FOR UPDATE`;
            const group = groupRows[0];
            if (!group)
                throw createAppError("NOT_FOUND", `Group ${groupId} not found hoặc inactive`);
            if (seasonTeam.status !== SeasonTeamStatus.approved)
                throw createAppError("CONFLICT", "Chỉ assign team có status approved");
            const phase = await tx.phase.findUnique({
                where: { id: group.phase_id },
                select: { id: true, season_id: true, is_active: true, teams_per_group: true },
            });
            if (!phase)
                throw createAppError("NOT_FOUND", `Phase of group ${groupId} not found`);
            if (!phase.is_active)
                throw createAppError("CONFLICT", "Phase đã deactivate");
            if (phase.season_id !== seasonTeam.season_id)
                throw createAppError("CONFLICT", "Group thuộc season khác với SeasonTeam — cross-season assign bị chặn");
            if (seasonTeam.group_id !== null) {
                const currentGroup = await tx.group.findUnique({
                    where: { id: seasonTeam.group_id },
                    select: { phase_id: true },
                });
                if (currentGroup && currentGroup.phase_id !== group.phase_id)
                    throw createAppError("CONFLICT", `Team đang giữ group thuộc phase ${currentGroup.phase_id} — clear draw phase đó trước`);
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
    async swapTeams(seasonTeamIdA, seasonTeamIdB) {
        if (seasonTeamIdA === seasonTeamIdB)
            throw createAppError("VALIDATION_ERROR", "Không thể swap team với chính nó");
        return this.prisma.$transaction(async (tx) => {
            const [first, second] = [seasonTeamIdA, seasonTeamIdB].sort((a, b) => a - b);
            const rows = await tx.$queryRaw `
                SELECT id, group_id, status, season_id FROM season_teams
                WHERE id IN (${first}, ${second})
                FOR UPDATE
            `;
            const teamA = rows.find((r) => r.id === seasonTeamIdA);
            const teamB = rows.find((r) => r.id === seasonTeamIdB);
            if (!teamA)
                throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamIdA} not found`);
            if (!teamB)
                throw createAppError("NOT_FOUND", `SeasonTeam ${seasonTeamIdB} not found`);
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
                throw createAppError("CONFLICT", `2 team thuộc 2 phase khác nhau (phase ${groupA.phase_id} vs ${groupB.phase_id}) — chỉ swap trong cùng phase`);
            await tx.seasonTeam.update({ where: { id: seasonTeamIdA }, data: { group_id: teamB.group_id } });
            await tx.seasonTeam.update({ where: { id: seasonTeamIdB }, data: { group_id: teamA.group_id } });
        });
    }
    async drawGroupsSeeded(seasonId, opts) {
        if (opts.teams_per_group < 2)
            throw createAppError("VALIDATION_ERROR", "teams_per_group phải >= 2");
        if (opts.num_pots < 1)
            throw createAppError("VALIDATION_ERROR", "num_pots phải >= 1");
        return this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, seasonId);
            await this.assertSeasonAcceptsGroupOps(tx, seasonId);
            const phase = await this.findRoundRobinPhase(tx, seasonId);
            if (!phase)
                throw createAppError("CONFLICT", "Season chưa có group nào, tạo group trước khi draw");
            if (!phase.is_active)
                throw createAppError("CONFLICT", "Phase đã deactivate");
            this.assertPhaseIsDraft(phase, "bốc thăm");
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
                throw createAppError("CONFLICT", `Chỉ có ${approvedTeams.length} approved team, cần ít nhất ${minRequired} cho ${groups.length} group`);
            await this.assertNoForeignGroupAssignment(tx, phase.id, approvedTeams);
            const seeded = [...approvedTeams]
                .filter((t) => t.seed !== null)
                .sort((a, b) => (a.seed ?? 0) - (b.seed ?? 0));
            const unseeded = shuffle(approvedTeams.filter((t) => t.seed === null));
            const sorted = [...seeded, ...unseeded];
            const pots = this.splitIntoPots(sorted, opts.num_pots);
            const maxPotSize = Math.max(...pots.map((p) => p.length));
            if (maxPotSize > groups.length)
                throw createAppError("CONFLICT", `Pot lớn nhất có ${maxPotSize} team, vượt ${groups.length} group — không thể đảm bảo ` +
                    `mỗi group tối đa 1 team/pot. Giảm num_pots hoặc tăng số group.`);
            const assignments = [];
            const groupFillCount = new Array(groups.length).fill(0);
            for (const pot of pots) {
                const shuffledPot = shuffle(pot);
                const usedInPot = new Set();
                for (const st of shuffledPot) {
                    let targetIdx = -1;
                    for (let i = 0; i < groups.length; i++) {
                        if (usedInPot.has(i))
                            continue;
                        if (targetIdx === -1 || groupFillCount[i] < groupFillCount[targetIdx])
                            targetIdx = i;
                    }
                    usedInPot.add(targetIdx);
                    groupFillCount[targetIdx]++;
                    assignments.push({
                        seasonTeamId: st.id,
                        team_id: st.team_id,
                        group_id: groups[targetIdx].id,
                    });
                }
            }
            const maxFill = Math.max(...groupFillCount);
            if (maxFill > opts.teams_per_group)
                throw createAppError("CONFLICT", `Distribution tạo group với ${maxFill} team, vượt teams_per_group=${opts.teams_per_group} — ` +
                    `tăng teams_per_group hoặc tạo thêm group`);
            await this.applyAssignments(tx, assignments);
            await tx.phase.update({
                where: { id: phase.id },
                data: { teams_per_group: maxFill },
            });
            return assignments.map(({ group_id, team_id }) => ({ group_id, team_id }));
        });
    }
    async findByIdWithTeams(id) {
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
        if (!group)
            throw createAppError("NOT_FOUND", `Group ${id} not found`);
        return group;
    }
    // ============================================================
    // PRIVATE HELPERS
    // ============================================================
    snakeDistribute(items, groupCount) {
        const groups = Array.from({ length: groupCount }, () => []);
        let idx = 0;
        let dir = 1;
        for (const item of items) {
            groups[idx].push(item);
            idx += dir;
            if (idx === groupCount) {
                idx = groupCount - 1;
                dir = -1;
            }
            else if (idx === -1) {
                idx = 0;
                dir = 1;
            }
        }
        return groups;
    }
    splitIntoPots(items, numPots) {
        const pots = [];
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
    async applyAssignments(tx, assignments) {
        const byGroup = new Map();
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
    async createEmptyRoundRobinGroups(tx, seasonId, groupCount) {
        if (groupCount < 1 || groupCount > 26)
            throw createAppError("VALIDATION_ERROR", "group_count phải trong khoảng 1-26");
        const phase = await tx.phase.create({
            data: {
                season_id: seasonId,
                format: PhaseFormat.round_robin,
                status: PhaseStatus.draft,
                type: PhaseType.group_stage,
                order: 1,
                name: "Vòng bảng",
                is_active: true,
            },
        });
        const names = Array.from({ length: groupCount }, (_, i) => `Bảng ${String.fromCharCode(65 + i)}`);
        await tx.group.createMany({
            data: names.map((name) => ({ phase_id: phase.id, name, is_active: true })),
        });
        const groups = await tx.group.findMany({
            where: { phase_id: phase.id, name: { in: names } },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
        return { phaseId: phase.id, groups };
    }
    async autoAssignApprovedTeamToGroup(tx, seasonId, seasonTeamId) {
        const phase = await tx.phase.findFirst({
            where: {
                season_id: seasonId,
                format: PhaseFormat.round_robin,
                is_active: true,
                status: { not: PhaseStatus.locked },
            },
            orderBy: { order: "desc" },
            select: { id: true, teams_per_group: true },
        });
        if (!phase)
            return null;
        const groups = await tx.group.findMany({
            where: { phase_id: phase.id, is_active: true },
            select: { id: true, name: true },
            orderBy: { id: "asc" },
        });
        if (groups.length === 0)
            return null;
        // FIX: bọc backtick quanh `groups` — cùng nguyên nhân với
        // deactivateGroup() (GROUPS là reserved keyword MySQL 8+), tránh lỗi
        // 1064 tương tự khi auto-assign 1 team approved vào group ít quân nhất.
        await tx.$queryRaw `SELECT id FROM \`groups\` WHERE id IN (${Prisma.join(groups.map((g) => g.id))}) FOR UPDATE`;
        const counts = await tx.seasonTeam.groupBy({
            by: ["group_id"],
            where: { group_id: { in: groups.map((g) => g.id) }, deleted_at: null },
            _count: { id: true },
        });
        const countMap = new Map(counts.map((c) => [c.group_id, c._count.id]));
        const capacity = phase.teams_per_group ?? Infinity;
        let target = null;
        let minCount = Infinity;
        for (const g of groups) {
            const c = countMap.get(g.id) ?? 0;
            if (c >= capacity)
                continue;
            if (c < minCount) {
                minCount = c;
                target = g;
            }
        }
        if (!target)
            throw createAppError("CONFLICT", `Tất cả group của phase ${phase.id} đã đầy — không thể auto-assign SeasonTeam ${seasonTeamId}`);
        await tx.seasonTeam.update({ where: { id: seasonTeamId }, data: { group_id: target.id } });
        return { groupId: target.id, groupName: target.name };
    }
}
//# sourceMappingURL=group.service.js.map