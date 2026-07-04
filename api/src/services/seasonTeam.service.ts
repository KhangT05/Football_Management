import { createAppError } from "../common/app.error.js";
import { Prisma, PrismaClient, PhaseFormat, SeasonTeamStatus, SeasonStatus, PhaseType, PhaseStatus, Phase } from "../generated/prisma/client.js";
import {
    AdminAddSeasonTeamDto,
    AssignGroupDto,
    SelfRegisterSeasonTeamDto,
    UpdateSeasonTeamStatusDto,
} from "../dtos/seasonTeam.schema.js";
import { Queryable } from "../libs/queryable.js";
import { SeasonTeamWithRelations, withRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";

// Transition matrix tối thiểu cho updateStatus (generic, không phải approve/transfer)
// Không cho set ngược từ terminal state, không cho nhảy tắt pending -> active.
const ALLOWED_TRANSITIONS: Record<SeasonTeamStatus, SeasonTeamStatus[]> = {
    [SeasonTeamStatus.pending]: [SeasonTeamStatus.approved, SeasonTeamStatus.withdrawn],
    [SeasonTeamStatus.approved]: [SeasonTeamStatus.active, SeasonTeamStatus.withdrawn],
    [SeasonTeamStatus.active]: [SeasonTeamStatus.eliminated, SeasonTeamStatus.withdrawn],
    [SeasonTeamStatus.eliminated]: [],
    [SeasonTeamStatus.withdrawn]: [],
};

export class SeasonTeamService {
    private readonly query: Queryable<SeasonTeamWithRelations>;

    constructor(private readonly prisma: PrismaClient) {
        this.query = new Queryable<SeasonTeamWithRelations>(prisma.seasonTeam, {
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

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<SeasonTeamWithRelations>> {
        return this.query.run(req, { include: withRelations.include });
    }

    async findByIdOrFail(id: number): Promise<SeasonTeamWithRelations> {
        const record = await this.prisma.seasonTeam.findUnique({ where: { id }, ...withRelations });
        if (!record) throw createAppError("NOT_FOUND", `SeasonTeam ${id} not found`);
        return record;
    }

    async selfRegister(data: SelfRegisterSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations> {
        const team = await this.prisma.team.findFirst({
            where: { user_id: userId },
            select: { id: true },
        });
        if (!team) throw createAppError("FORBIDDEN", "You are not a leader of any team");

        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${data.season_id} FOR UPDATE`;

            const season = await tx.season.findUnique({ where: { id: data.season_id } });
            if (!season) throw createAppError("NOT_FOUND", `Season ${data.season_id} not found`);

            if (season.status !== SeasonStatus.registration_open)
                throw createAppError("FORBIDDEN", "Season is not open for registration");

            if (season.registration_deadline && season.registration_deadline < new Date())
                throw createAppError("FORBIDDEN", "Registration deadline has passed");

            await this.assertSlotAvailable(tx, data.season_id, season.max_teams);
            return this.createOrReactivate(tx, data.season_id, team.id, userId, SeasonTeamStatus.pending);
        });
    }

    async adminAdd(data: AdminAddSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${data.season_id} FOR UPDATE`;

            const season = await tx.season.findUnique({ where: { id: data.season_id } });
            if (!season) throw createAppError("NOT_FOUND", `Season ${data.season_id} not found`);

            if (season.status !== SeasonStatus.registration_open)
                throw createAppError("FORBIDDEN", "Season is not open for registration");

            await this.assertSlotAvailable(tx, data.season_id, season.max_teams);
            return this.createOrReactivate(
                tx, data.season_id, data.team_id, userId, data.status ?? SeasonTeamStatus.approved
            );
        });
    }

    /**
     * Duyệt team (ban tổ chức / admin). Tách khỏi updateStatus vì có
     * capacity check + season-state check riêng, không phải generic write.
     */
    async approve(id: number, requesterId: number): Promise<SeasonTeamWithRelations> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM season_teams WHERE id = ${id} FOR UPDATE`;

            const st = await tx.seasonTeam.findUnique({ where: { id } });
            if (!st) throw createAppError("NOT_FOUND", `SeasonTeam ${id} not found`);
            if (st.status !== SeasonTeamStatus.pending)
                throw createAppError("CONFLICT", `Cannot approve team in status ${st.status}`);

            const season = await tx.season.findUnique({ where: { id: st.season_id } });
            if (!season) throw createAppError("NOT_FOUND", `Season ${st.season_id} not found`);
            if (season.status !== SeasonStatus.registration_open)
                throw createAppError("FORBIDDEN", "Season is not open for registration");

            await this.assertSlotAvailable(tx, st.season_id, season.max_teams);

            return tx.seasonTeam.update({
                where: { id },
                data: { status: SeasonTeamStatus.approved, user_id: requesterId },
                ...withRelations,
            });
        });
    }

    /**
     * Chuyển season_team sang season khác (ban tổ chức / admin).
     * - Chỉ cho phép từ pending|approved — active/eliminated đã có match/group
     *   phụ thuộc (group_id, playerStatistics, matchLineups...), transfer sẽ
     *   orphan reference. Nếu sau này audit thấy FK an toàn, có thể nới.
     * - Deactivate record cũ (soft-delete) rồi createOrReactivate ở season đích,
     *   dùng lại đúng logic revive khi unique(season_id, team_id) đã tồn tại
     *   (case: team từng ở season đích rồi withdraw).
     * - Reset về pending ở season đích — buộc duyệt lại vì capacity/eligibility
     *   season mới có thể khác.
     */
    async transferSeason(
        id: number,
        targetSeasonId: number,
        requesterId: number
    ): Promise<SeasonTeamWithRelations> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM season_teams WHERE id = ${id} FOR UPDATE`;

            const st = await tx.seasonTeam.findUnique({ where: { id } });
            if (!st) throw createAppError("NOT_FOUND", `SeasonTeam ${id} not found`);
            if (st.group_id !== null)
                throw createAppError(
                    "CONFLICT",
                    `Cannot transfer team already assigned to group ${st.group_id}`
                );
            if (st.status !== SeasonTeamStatus.pending && st.status !== SeasonTeamStatus.approved)
                throw createAppError(
                    "CONFLICT",
                    `Cannot transfer team in status ${st.status}`
                );
            if (st.season_id === targetSeasonId)
                throw createAppError("BAD_REQUEST", "Team already in this season");

            // Lock cả season nguồn và đích theo thứ tự cố định (id tăng dần)
            // để tránh deadlock khi 2 transfer chạy song song ngược chiều nhau.
            const [firstId, secondId] = [st.season_id, targetSeasonId].sort((a, b) => a - b);
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${firstId} FOR UPDATE`;
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${secondId} FOR UPDATE`;

            const targetSeason = await tx.season.findUnique({ where: { id: targetSeasonId } });
            if (!targetSeason) throw createAppError("NOT_FOUND", `Season ${targetSeasonId} not found`);
            if (targetSeason.status !== SeasonStatus.registration_open)
                throw createAppError("FORBIDDEN", "Target season is not open for registration");

            await this.assertSlotAvailable(tx, targetSeasonId, targetSeason.max_teams, SeasonTeamStatus.pending);

            await tx.seasonTeam.update({
                where: { id },
                data: { is_active: false, deleted_at: new Date() },
            });

            return this.createOrReactivate(tx, targetSeasonId, st.team_id, requesterId, SeasonTeamStatus.pending);
        });
    }

    /**
     * Generic status update (eliminated/withdrawn...). KHÔNG dùng cho approve —
     * dùng approve() riêng vì có capacity check. Có transition guard tối thiểu,
     * chưa lock — các transition ở đây không cạnh tranh capacity nên rủi ro
     * race thấp hơn approve, nhưng nếu thêm transition ảnh hưởng slot count
     * (vd revert approved -> pending) phải bọc transaction + lock như approve.
     */
    async updateStatus(id: number, data: UpdateSeasonTeamStatusDto): Promise<SeasonTeamWithRelations> {
        const st = await this.findByIdOrFail(id);

        if (data.status === SeasonTeamStatus.approved)
            throw createAppError("BAD_REQUEST", "Use /approve endpoint to approve a team");

        const allowed = ALLOWED_TRANSITIONS[st.status] ?? [];
        if (!allowed.includes(data.status))
            throw createAppError("CONFLICT", `Cannot transition from ${st.status} to ${data.status}`);

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
    async assignGroup(id: number, data: AssignGroupDto): Promise<SeasonTeamWithRelations> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM season_teams WHERE id = ${id} FOR UPDATE`;

            const seasonTeam = await tx.seasonTeam.findUnique({ where: { id }, ...withRelations });
            if (!seasonTeam) throw createAppError("NOT_FOUND", `SeasonTeam ${id} not found`);
            if (seasonTeam.status !== SeasonTeamStatus.approved)
                throw createAppError("CONFLICT", "Chỉ team đã approved mới được gán group");

            const group = await tx.group.findUnique({
                where: { id: data.group_id },
                include: { phase: { select: { id: true, season_id: true, format: true, is_active: true } } },
            });
            if (!group) throw createAppError("NOT_FOUND", `Group ${data.group_id} not found`);
            if (!group.is_active || !group.phase.is_active)
                throw createAppError("CONFLICT", "Group hoặc phase đã bị deactivate");
            if (group.phase.format !== PhaseFormat.round_robin)
                throw createAppError("CONFLICT", "Chỉ gán group cho phase round_robin");
            if (group.phase.season_id !== seasonTeam.season.id)
                throw createAppError("CONFLICT", "Group không thuộc season của team này");

            return tx.seasonTeam.update({ where: { id }, data: { group_id: data.group_id }, ...withRelations });
        });
    }

    async softDelete(id: number): Promise<void> {
        await this.findByIdOrFail(id);
        await this.prisma.seasonTeam.update({
            where: { id },
            data: { is_active: false, deleted_at: new Date() },
        });
    }

    private async assertSlotAvailable(
        tx: Prisma.TransactionClient,
        seasonId: number,
        maxTeams: number,
        countStatus: SeasonTeamStatus = SeasonTeamStatus.approved
    ): Promise<void> {
        const count = await tx.seasonTeam.count({
            where: { season_id: seasonId, status: countStatus, deleted_at: null },
        });
        if (count >= maxTeams)
            throw createAppError("CONFLICT", "Season has reached maximum team capacity");
    }

    /**
     * @@unique([season_id, team_id]) không exclude deleted_at (MySQL không có
     * partial unique index). Team withdraw rồi đăng ký lại (hoặc được transfer
     * đến) phải reactivate row cũ, không create mới — create thẳng sẽ đụng
     * unique constraint.
     *
     * FIX: nhánh tạo mới (create) giờ set `is_active: true` TƯỜNG MINH thay
     * vì phụ thuộc default của cột trong Prisma schema. Đây chính là nguyên
     * nhân của bug "team đã approved nhưng không hiện trong danh sách" —
     * endpoint GET /seasonteams luôn ép where { is_active: true } (xem
     * constructor Queryable ở trên), nên bất kỳ record nào insert mà cột
     * is_active không đúng true (default sai, hoặc insert tay qua
     * phpMyAdmin bỏ trống cột) sẽ bị ẩn hoàn toàn khỏi mọi danh sách dù
     * status = approved. Set tường minh ở đây đảm bảo record tạo qua API
     * luôn đúng, không còn phụ thuộc vào default của DB.
     */
    private async createOrReactivate(
        tx: Prisma.TransactionClient,
        seasonId: number,
        teamId: number,
        userId: number,
        status: SeasonTeamStatus
    ): Promise<SeasonTeamWithRelations> {
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
            data: { season_id: seasonId, team_id: teamId, user_id: userId, status, is_active: true },
            ...withRelations,
        });
    }

    async getOrCreateGroupPhase(seasonId: number): Promise<Phase> {
        return this.prisma.$transaction(async (tx) => {
            // Lock season để tránh race: 2 request đồng thời cùng tạo 2 phase trùng nhau
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;

            const season = await tx.season.findUnique({ where: { id: seasonId } });
            if (!season) throw createAppError("NOT_FOUND", `Season ${seasonId} not found`);

            const existing = await tx.phase.findFirst({
                where: {
                    season_id: seasonId,
                    type: PhaseType.group_stage,
                    format: PhaseFormat.round_robin,
                    is_active: true,
                },
            });
            if (existing) return existing;

            return tx.phase.create({
                data: {
                    season_id: seasonId,
                    name: "Vòng bảng",
                    type: PhaseType.group_stage,
                    format: PhaseFormat.round_robin,
                    order: 0,
                    status: PhaseStatus.draft,
                },
            });
        });
    }
}