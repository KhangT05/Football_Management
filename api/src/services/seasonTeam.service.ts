import { createAppError } from "../common/app.error.js";
import {
    Prisma,
    PrismaClient,
    PhaseFormat,
    SeasonTeamStatus,
    SeasonStatus,
    PhaseType,
    PhaseStatus,
    Phase,
    ApprovalStatus,
    LeaveReason,
    PlayerRole,
} from "../generated/prisma/client.js";
import {
    AdminAddSeasonTeamDto,
    AssignGroupDto,
    SelfRegisterSeasonTeamDto,
    TransferRosterInput,
    UpdateSeasonTeamStatusDto,
} from "../dtos/seasonTeam.schema.js";
import { Queryable } from "../libs/queryable.js";
import { BulkActionResult, SeasonTeamWithRelations, withRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { GroupService } from "./group.service.js";

const ALLOWED_TRANSITIONS: Record<SeasonTeamStatus, SeasonTeamStatus[]> = {
    [SeasonTeamStatus.pending]: [SeasonTeamStatus.approved, SeasonTeamStatus.withdrawn],
    [SeasonTeamStatus.approved]: [SeasonTeamStatus.active, SeasonTeamStatus.withdrawn],
    [SeasonTeamStatus.active]: [SeasonTeamStatus.eliminated, SeasonTeamStatus.withdrawn],
    [SeasonTeamStatus.eliminated]: [],
    [SeasonTeamStatus.withdrawn]: [],
};

const ACTIVE_SEASON_TEAM_STATUSES: SeasonTeamStatus[] = [
    SeasonTeamStatus.pending,
    SeasonTeamStatus.approved,
    SeasonTeamStatus.active,
];

export type SeasonRegistrationEligibility = {
    season_id: number;
    name: string;
    start_date: Date | null;
    registration_deadline: Date | null;
    season_status: SeasonStatus;
    tournament: { id: number; name: string; logo: string | null };
    already_registered: boolean;
    conflict: { playerName: string; teamName: string } | null;
    eligible: boolean;
};

export class SeasonTeamService {
    private readonly query: Queryable<SeasonTeamWithRelations>;

    constructor(
        private readonly prisma: PrismaClient,
        private readonly groupService: GroupService,
    ) {
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

    /**
     * FIX (multi-team ownership bug): xem comment gốc — verify team_id thuộc
     * đúng user, không suy đoán team đầu tiên tìm thấy.
     *
     * FIX MỚI (race condition trên createOrReactivate): findUnique-then-create
     * trong createOrReactivate KHÔNG atomic với row chưa tồn tại — FOR UPDATE
     * ở đầu hàm này chỉ lock bảng `seasons`, không lock được cặp
     * (season_id, team_id) vì record đó chưa có để lock. Nếu 2 request
     * register() cùng season_id + team_id chạy gần như đồng thời (double-
     * click, hoặc network retry), cả 2 đều đọc `existing = null`, cả 2 đều
     * gọi tx.seasonTeam.create() — request commit sau vi phạm unique
     * constraint (season_id, team_id), Prisma ném P2002 THÔ, không đi qua
     * createAppError. FE nhận lỗi không đúng shape -> hiển thị message
     * generic "Request failed" thay vì lý do thật.
     *
     * Bọc toàn bộ transaction trong try/catch, bắt riêng P2002 -> convert
     * thành AppError CONFLICT có message rõ ràng. Đây là lớp phòng thủ cuối
     * — không thay thế việc chặn double-submit ở FE (xem MyTeam.jsx /
     * SeasonRegistrationModal.jsx), vì request hợp lệ vẫn có thể trùng thời
     * điểm do mạng chậm/retry ngoài tầm kiểm soát của FE.
     */
    async selfRegister(data: SelfRegisterSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations> {
        const team = await this.prisma.team.findFirst({
            where: { id: data.team_id, user_id: userId },
            select: { id: true },
        });
        if (!team) throw createAppError("FORBIDDEN", "You are not the leader of this team");

        try {
            return await this.prisma.$transaction(async (tx) => {
                await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${data.season_id} FOR UPDATE`;

                const season = await tx.season.findUnique({ where: { id: data.season_id } });
                if (!season) throw createAppError("NOT_FOUND", `Season ${data.season_id} not found`);

                if (season.status !== SeasonStatus.registration_open)
                    throw createAppError("FORBIDDEN", "Season is not open for registration");

                if (season.registration_deadline && season.registration_deadline < new Date())
                    throw createAppError("FORBIDDEN", "Registration deadline has passed");

                await this.assertSlotAvailable(tx, data.season_id, season.max_teams);
                await this.assertNoPlayerConflict(tx, data.season_id, team.id);

                return this.createOrReactivate(tx, data.season_id, team.id, userId, SeasonTeamStatus.pending);
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw createAppError(
                    "CONFLICT",
                    "Đội đã đăng ký mùa giải này rồi (có request khác vừa xử lý cùng lúc)"
                );
            }
            throw err;
        }
    }

    /**
     * FIX (cùng lý do với selfRegister): adminAdd cũng đi qua
     * createOrReactivate nên có cùng race window — bọc try/catch tương tự.
     */
    async adminAdd(data: AdminAddSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations> {
        try {
            return await this.prisma.$transaction(async (tx) => {
                await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${data.season_id} FOR UPDATE`;

                const season = await tx.season.findUnique({ where: { id: data.season_id } });
                if (!season) throw createAppError("NOT_FOUND", `Season ${data.season_id} not found`);

                if (season.status !== SeasonStatus.registration_open)
                    throw createAppError("FORBIDDEN", "Season is not open for registration");

                await this.assertSlotAvailable(tx, data.season_id, season.max_teams);
                await this.assertNoPlayerConflict(tx, data.season_id, data.team_id);

                const finalStatus = data.status ?? SeasonTeamStatus.approved;
                const created = await this.createOrReactivate(tx, data.season_id, data.team_id, userId, finalStatus);

                if (finalStatus === SeasonTeamStatus.approved) {
                    await this.groupService.autoAssignApprovedTeamToGroup(tx, data.season_id, created.id);
                    return tx.seasonTeam.findUniqueOrThrow({ where: { id: created.id }, ...withRelations });
                }
                return created;
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw createAppError(
                    "CONFLICT",
                    "Đội đã có đăng ký cho mùa giải này (có request khác vừa xử lý cùng lúc)"
                );
            }
            throw err;
        }
    }

    async approve(id: number, requesterId: number): Promise<SeasonTeamWithRelations> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM season_teams WHERE id = ${id} FOR UPDATE`;

            const st = await tx.seasonTeam.findUnique({ where: { id } });
            if (!st) throw createAppError("NOT_FOUND", `SeasonTeam ${id} not found`);
            if (st.status !== SeasonTeamStatus.pending)
                throw createAppError("CONFLICT", `Cannot approve team in status ${st.status}`);

            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${st.season_id} FOR UPDATE`;

            const season = await tx.season.findUnique({
                where: { id: st.season_id },
                include: { tournamentRule: { select: { min_players_per_team: true, max_players_per_team: true } } },
            });
            if (!season) throw createAppError("NOT_FOUND", `Season ${st.season_id} not found`);
            if (season.status !== SeasonStatus.registration_open)
                throw createAppError("FORBIDDEN", "Season is not open for registration");

            await this.assertSlotAvailable(tx, st.season_id, season.max_teams);
            await this.assertRosterWithinRule(tx, id, season.tournamentRule);

            await tx.seasonTeam.update({
                where: { id },
                data: { status: SeasonTeamStatus.approved, user_id: requesterId },
            });

            await this.groupService.autoAssignApprovedTeamToGroup(tx, st.season_id, id);

            return tx.seasonTeam.findUniqueOrThrow({ where: { id }, ...withRelations });
        });
    }

    async transferSeason(
        id: number,
        targetSeasonId: number,
        requesterId: number,
        rosterInput: TransferRosterInput,
        requesterIsAdmin: boolean = false,
    ): Promise<SeasonTeamWithRelations> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM season_teams WHERE id = ${id} FOR UPDATE`;

            const st = await tx.seasonTeam.findUnique({ where: { id }, include: { team: { select: { user_id: true } } } });
            if (!st) throw createAppError("NOT_FOUND", `SeasonTeam ${id} not found`);

            if (!requesterIsAdmin && st.team.user_id !== requesterId) {
                throw createAppError("FORBIDDEN", "Bạn không phải leader của đội này");
            }

            if (st.group_id !== null)
                throw createAppError("CONFLICT", `Cannot transfer team already assigned to group ${st.group_id}`);
            if (st.status !== SeasonTeamStatus.pending && st.status !== SeasonTeamStatus.approved)
                throw createAppError("CONFLICT", `Cannot transfer team in status ${st.status}`);
            if (st.season_id === targetSeasonId)
                throw createAppError("BAD_REQUEST", "Team already in this season");

            const [firstId, secondId] = [st.season_id, targetSeasonId].sort((a, b) => a - b);
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${firstId} FOR UPDATE`;
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${secondId} FOR UPDATE`;

            const targetSeason = await tx.season.findUnique({ where: { id: targetSeasonId } });
            if (!targetSeason) throw createAppError("NOT_FOUND", `Season ${targetSeasonId} not found`);
            if (targetSeason.status !== SeasonStatus.registration_open)
                throw createAppError("FORBIDDEN", "Target season is not open for registration");

            await this.assertSlotAvailable(tx, targetSeasonId, targetSeason.max_teams);

            await tx.seasonTeam.update({
                where: { id },
                data: { is_active: false, deleted_at: new Date() },
            });

            const newSeasonTeam = await this.createOrReactivate(
                tx, targetSeasonId, st.team_id, requesterId, SeasonTeamStatus.pending
            );

            await this.transferRosterPlayers(tx, id, newSeasonTeam.id, rosterInput);

            return tx.seasonTeam.findUniqueOrThrow({ where: { id: newSeasonTeam.id }, ...withRelations });
        });
    }

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

    async assignGroup(id: number, data: AssignGroupDto): Promise<SeasonTeamWithRelations> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM season_teams WHERE id = ${id} FOR UPDATE`;

            const seasonTeam = await tx.seasonTeam.findUnique({ where: { id }, ...withRelations });
            if (!seasonTeam) throw createAppError("NOT_FOUND", `SeasonTeam ${id} not found`);
            if (seasonTeam.status !== SeasonTeamStatus.approved)
                throw createAppError("CONFLICT", "Chỉ team đã approved mới được gán group");

            await tx.$queryRaw`SELECT id FROM groups WHERE id = ${data.group_id} FOR UPDATE`;

            const group = await tx.group.findUnique({
                where: { id: data.group_id },
                include: {
                    phase: {
                        select: { id: true, season_id: true, format: true, is_active: true, teams_per_group: true },
                    },
                },
            });
            if (!group) throw createAppError("NOT_FOUND", `Group ${data.group_id} not found`);
            if (!group.is_active || !group.phase.is_active)
                throw createAppError("CONFLICT", "Group hoặc phase đã bị deactivate");
            if (group.phase.format !== PhaseFormat.round_robin)
                throw createAppError("CONFLICT", "Chỉ gán group cho phase round_robin");
            if (group.phase.season_id !== seasonTeam.season.id)
                throw createAppError("CONFLICT", "Group không thuộc season của team này");

            const capacity = group.phase.teams_per_group ?? Infinity;
            const currentCount = await tx.seasonTeam.count({
                where: { group_id: data.group_id, deleted_at: null, id: { not: id } },
            });
            if (currentCount >= capacity)
                throw createAppError("CONFLICT", `Group ${data.group_id} đã full (${capacity} teams)`);

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

    private async assertNoPlayerConflict(
        tx: Prisma.TransactionClient,
        seasonId: number,
        teamId: number
    ): Promise<void> {
        const conflict = await tx.teamPlayer.findFirst({
            where: {
                approval_status: ApprovalStatus.approved,
                season_team: { team_id: teamId },
                player: {
                    team_players: {
                        some: {
                            approval_status: ApprovalStatus.approved,
                            season_team: {
                                team_id: { not: teamId },
                                team: {
                                    season_teams: {
                                        some: {
                                            season_id: seasonId,
                                            deleted_at: null,
                                            status: { in: ACTIVE_SEASON_TEAM_STATUSES },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            select: {
                player: { select: { id: true, user: { select: { name: true } } } },
            },
        });

        if (!conflict) return;

        const rivalTeamPlayer = await tx.teamPlayer.findFirst({
            where: {
                player_id: conflict.player.id,
                approval_status: ApprovalStatus.approved,
                season_team: {
                    team_id: { not: teamId },
                    team: {
                        season_teams: {
                            some: { season_id: seasonId, deleted_at: null, status: { in: ACTIVE_SEASON_TEAM_STATUSES } },
                        },
                    },
                },
            },
            select: { season_team: { select: { team: { select: { name: true } } } } },
        });

        const playerName = conflict.player.user?.name ?? `#${conflict.player.id}`;
        const rivalTeamName = rivalTeamPlayer?.season_team.team.name ?? "một đội khác";

        throw createAppError(
            "CONFLICT",
            `Cầu thủ ${playerName} đang thuộc đội ${rivalTeamName}, đội này đã đăng ký mùa giải này rồi — không thể đăng ký thêm đội có cùng cầu thủ vào cùng 1 mùa giải`
        );
    }

    async getTeamRegistrationEligibility(teamId: number): Promise<SeasonRegistrationEligibility[]> {
        const team = await this.prisma.team.findUnique({ where: { id: teamId }, select: { id: true } });
        if (!team) throw createAppError("NOT_FOUND", `Team ${teamId} not found`);

        const seasons = await this.prisma.season.findMany({
            where: { status: { in: [SeasonStatus.registration_open, SeasonStatus.upcoming] }, deleted_at: null },
            select: {
                id: true, name: true, status: true, start_date: true, registration_deadline: true,
                tournament: { select: { id: true, name: true, logo: true } },
            },
            orderBy: [{ status: "asc" }, { id: "desc" }],
        });
        if (seasons.length === 0) return [];
        const seasonIds = seasons.map((s) => s.id);

        const [registeredRows, myPlayerIdRows] = await Promise.all([
            this.prisma.seasonTeam.findMany({
                where: { team_id: teamId, season_id: { in: seasonIds }, deleted_at: null },
                select: { season_id: true },
            }),
            this.prisma.teamPlayer.findMany({
                where: { season_team: { team_id: teamId }, approval_status: ApprovalStatus.approved },
                select: { player_id: true },
            }),
        ]);
        const registeredSeasonIds = new Set(registeredRows.map((r) => r.season_id));
        const myPlayerIds = myPlayerIdRows.map((r) => r.player_id);

        const conflictBySeason = new Map<number, { playerName: string; teamName: string }>();
        if (myPlayerIds.length > 0) {
            const rivalTeamPlayers = await this.prisma.teamPlayer.findMany({
                where: {
                    player_id: { in: myPlayerIds },
                    approval_status: ApprovalStatus.approved,
                    season_team: {
                        team_id: { not: teamId },
                        season_id: { in: seasonIds },
                        deleted_at: null,
                        status: { in: ACTIVE_SEASON_TEAM_STATUSES },
                    },
                },
                select: {
                    player: { select: { user: { select: { name: true } } } },
                    season_team: { select: { season_id: true, team: { select: { name: true } } } },
                },
            });
            for (const tp of rivalTeamPlayers) {
                const sId = tp.season_team.season_id;
                if (!conflictBySeason.has(sId)) {
                    conflictBySeason.set(sId, {
                        playerName: tp.player.user?.name ?? "Cầu thủ",
                        teamName: tp.season_team.team.name,
                    });
                }
            }
        }

        return seasons.map((s) => {
            const already_registered = registeredSeasonIds.has(s.id);
            const conflict = conflictBySeason.get(s.id) ?? null;
            const isOpen = s.status === SeasonStatus.registration_open;
            return {
                season_id: s.id,
                name: s.name,
                season_status: s.status,
                start_date: s.start_date,
                registration_deadline: s.registration_deadline,
                already_registered,
                conflict,
                tournament: s.tournament,
                eligible: isOpen && !already_registered && !conflict,
            };
        });
    }

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
                    group_id: null,
                },
                ...withRelations,
            });
        }

        return tx.seasonTeam.create({
            data: { season_id: seasonId, team_id: teamId, user_id: userId, status, is_active: true },
            ...withRelations,
        });
    }

    async listBySeasonWithTeamInfo(
        seasonId: number,
        statuses: SeasonTeamStatus[] = [SeasonTeamStatus.approved]
    ) {
        const season = await this.prisma.season.findUnique({
            where: { id: seasonId },
            select: {
                id: true,
                name: true,
                status: true,
                tournament: { select: { id: true, name: true, logo: true } },
            },
        });
        if (!season) throw createAppError("NOT_FOUND", `Season ${seasonId} not found`);

        const seasonTeams = await this.prisma.seasonTeam.findMany({
            where: {
                season_id: seasonId,
                status: { in: statuses },
                deleted_at: null,
            },
            select: {
                id: true,
                status: true,
                group_id: true,
                team: {
                    select: { id: true, name: true, logo: true },
                },
            },
            orderBy: { id: "asc" },
        });

        return {
            season: {
                id: season.id,
                name: season.name,
                status: season.status,
                tournament: season.tournament,
            },
            teams: seasonTeams.map((st) => ({
                season_team_id: st.id,
                team_id: st.team.id,
                team_name: st.team.name,
                team_logo: st.team.logo,
                status: st.status,
                group_id: st.group_id,
            })),
        };
    }

    async getOrCreateGroupPhase(seasonId: number, stageOrder = 0): Promise<Phase> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;

            const season = await tx.season.findUnique({ where: { id: seasonId } });
            if (!season) throw createAppError("NOT_FOUND", `Season ${seasonId} not found`);

            const existing = await tx.phase.findFirst({
                where: {
                    season_id: seasonId,
                    type: PhaseType.group_stage,
                    format: PhaseFormat.round_robin,
                    order: stageOrder,
                    is_active: true,
                },
            });
            if (existing) return existing;

            return tx.phase.create({
                data: {
                    season_id: seasonId,
                    name: stageOrder === 0 ? "Vòng bảng" : `Vòng bảng - Vòng ${stageOrder + 1}`,
                    type: PhaseType.group_stage,
                    format: PhaseFormat.round_robin,
                    order: stageOrder,
                    status: PhaseStatus.draft,
                },
            });
        });
    }

    async bulkApprove(seasonId: number, ids: number[], requesterId: number): Promise<BulkActionResult> {
        if (ids.length === 0) return { succeeded: [], failed: [] };

        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;

            const season = await tx.season.findUnique({
                where: { id: seasonId },
                include: { tournamentRule: { select: { min_players_per_team: true, max_players_per_team: true } } },
            });
            if (!season) throw createAppError("NOT_FOUND", `Season ${seasonId} not found`);
            if (season.status !== SeasonStatus.registration_open)
                throw createAppError("FORBIDDEN", "Season is not open for registration");

            const sortedIds = [...ids].sort((a, b) => a - b);
            await tx.$queryRaw`SELECT id FROM season_teams WHERE id IN (${Prisma.join(sortedIds)}) FOR UPDATE`;

            const records = await tx.seasonTeam.findMany({
                where: { id: { in: sortedIds } },
                select: { id: true, season_id: true, status: true, team_id: true },
            });
            const recordMap = new Map(records.map((r) => [r.id, r]));

            let currentApprovedCount = await tx.seasonTeam.count({
                where: { season_id: seasonId, status: SeasonTeamStatus.approved, deleted_at: null },
            });

            const succeeded: number[] = [];
            const failed: { id: number; reason: string }[] = [];

            for (const id of sortedIds) {
                const st = recordMap.get(id);
                if (!st) { failed.push({ id, reason: "SeasonTeam not found" }); continue; }
                if (st.season_id !== seasonId) {
                    failed.push({ id, reason: `SeasonTeam thuộc season ${st.season_id}, không phải ${seasonId}` });
                    continue;
                }
                if (st.status !== SeasonTeamStatus.pending) {
                    failed.push({ id, reason: `Cannot approve team in status ${st.status}` });
                    continue;
                }
                if (currentApprovedCount >= season.max_teams) {
                    failed.push({ id, reason: "Season has reached maximum team capacity" });
                    continue;
                }

                try {
                    await this.assertNoPlayerConflict(tx, seasonId, st.team_id);
                    await this.assertRosterWithinRule(tx, id, season.tournamentRule);
                } catch (err) {
                    failed.push({ id, reason: err instanceof Error ? err.message : "Approve failed" });
                    continue;
                }

                await tx.seasonTeam.update({
                    where: { id },
                    data: { status: SeasonTeamStatus.approved, user_id: requesterId },
                });
                await this.groupService.autoAssignApprovedTeamToGroup(tx, seasonId, id);

                currentApprovedCount++;
                succeeded.push(id);
            }

            return { succeeded, failed };
        });
    }

    private async assertRosterWithinRule(
        tx: Prisma.TransactionClient,
        seasonTeamId: number,
        rule: { min_players_per_team: number; max_players_per_team: number } | null
    ): Promise<void> {
        if (!rule) return;

        const rosterCount = await tx.teamPlayer.count({
            where: { season_team_id: seasonTeamId, approval_status: ApprovalStatus.approved },
        });

        if (rosterCount < rule.min_players_per_team)
            throw createAppError(
                "CONFLICT",
                `Đội chưa đủ số cầu thủ tối thiểu để duyệt (hiện có ${rosterCount}, tối thiểu ${rule.min_players_per_team} theo tournament rule)`
            );
        if (rosterCount > rule.max_players_per_team)
            throw createAppError(
                "CONFLICT",
                `Đội vượt số cầu thủ tối đa được đăng ký (hiện có ${rosterCount}, tối đa ${rule.max_players_per_team} theo tournament rule)`
            );
    }

    async bulkReject(ids: number[]): Promise<BulkActionResult> {
        if (ids.length === 0) return { succeeded: [], failed: [] };

        return this.prisma.$transaction(async (tx) => {
            const sortedIds = [...ids].sort((a, b) => a - b);
            await tx.$queryRaw`SELECT id FROM season_teams WHERE id IN (${Prisma.join(sortedIds)}) FOR UPDATE`;

            const records = await tx.seasonTeam.findMany({
                where: { id: { in: sortedIds } },
                select: { id: true, status: true },
            });
            const recordMap = new Map(records.map((r) => [r.id, r]));

            const succeeded: number[] = [];
            const failed: { id: number; reason: string }[] = [];

            for (const id of sortedIds) {
                const st = recordMap.get(id);
                if (!st) { failed.push({ id, reason: "SeasonTeam not found" }); continue; }

                const allowed = ALLOWED_TRANSITIONS[st.status] ?? [];
                if (!allowed.includes(SeasonTeamStatus.withdrawn)) {
                    failed.push({ id, reason: `Cannot reject team in status ${st.status}` });
                    continue;
                }

                await tx.seasonTeam.update({ where: { id }, data: { status: SeasonTeamStatus.withdrawn } });
                succeeded.push(id);
            }

            return { succeeded, failed };
        });
    }

    private async transferRosterPlayers(
        tx: Prisma.TransactionClient,
        oldSeasonTeamId: number,
        newSeasonTeamId: number,
        input: TransferRosterInput,
    ): Promise<void> {
        const oldRoster = await tx.teamPlayer.findMany({
            where: { season_team_id: oldSeasonTeamId, approval_status: ApprovalStatus.approved },
        });

        const oldRosterIds = new Set(oldRoster.map((tp) => tp.player_id));
        const invalidCarryIds = input.carry_player_ids.filter((id) => !oldRosterIds.has(id));
        if (invalidCarryIds.length > 0)
            throw createAppError(
                "BAD_REQUEST",
                `Cầu thủ ${invalidCarryIds.join(", ")} không thuộc roster hiện tại của đội, không thể giữ lại`
            );

        const carrySet = new Set(input.carry_player_ids);
        const carried = oldRoster.filter((tp) => carrySet.has(tp.player_id));

        const addPlayerIds = input.add_players.map((p) => p.player_id);
        const dupWithCarry = addPlayerIds.filter((id) => carrySet.has(id));
        if (dupWithCarry.length > 0)
            throw createAppError(
                "BAD_REQUEST",
                `Cầu thủ ${dupWithCarry.join(", ")} vừa nằm trong carry_player_ids vừa trong add_players`
            );
        const addPlayerIdSet = new Set(addPlayerIds);
        if (addPlayerIdSet.size !== addPlayerIds.length)
            throw createAppError("BAD_REQUEST", "add_players chứa player_id trùng lặp");

        const jerseyNumbers = [
            ...carried.map((tp) => tp.jersey_number),
            ...input.add_players.map((p) => p.jersey_number),
        ];
        const jerseySet = new Set(jerseyNumbers);
        if (jerseySet.size !== jerseyNumbers.length)
            throw createAppError("BAD_REQUEST", "Số áo bị trùng giữa các cầu thủ trong roster mới");

        const newSeasonTeam = await tx.seasonTeam.findUniqueOrThrow({
            where: { id: newSeasonTeamId },
            select: { season: { select: { tournamentRule: { select: { max_players_per_team: true } } } } },
        });
        const maxPlayers = newSeasonTeam.season.tournamentRule?.max_players_per_team ?? null;
        const totalAfter = carried.length + input.add_players.length;
        if (maxPlayers != null && totalAfter > maxPlayers)
            throw createAppError(
                "CONFLICT",
                `Roster sau khi chuyển có ${totalAfter} cầu thủ, vượt giới hạn ${maxPlayers} của mùa giải đích`
            );

        for (const p of input.add_players) {
            await this.assertSinglePlayerNoConflict(tx, newSeasonTeamId, p.player_id);
        }

        const now = new Date();

        if (oldRoster.length > 0) {
            await tx.teamPlayerHistory.createMany({
                data: oldRoster.map((tp) => ({
                    season_team_id: oldSeasonTeamId,
                    player_id: tp.player_id,
                    jersey_number: tp.jersey_number,
                    position: tp.position,
                    role: tp.role,
                    joined_at: tp.joined_at,
                    left_at: now,
                    left_reason: carrySet.has(tp.player_id) ? LeaveReason.transferred : LeaveReason.dropped,
                })),
            });
        }

        if (carried.length > 0) {
            await tx.teamPlayer.createMany({
                data: carried.map((tp) => ({
                    season_team_id: newSeasonTeamId,
                    player_id: tp.player_id,
                    jersey_number: tp.jersey_number,
                    position: tp.position,
                    role: tp.role,
                    status: tp.status,
                    approval_status: ApprovalStatus.pending,
                    user_id: tp.user_id,
                })),
            });
        }

        if (input.add_players.length > 0) {
            await tx.teamPlayer.createMany({
                data: input.add_players.map((p) => ({
                    season_team_id: newSeasonTeamId,
                    player_id: p.player_id,
                    jersey_number: p.jersey_number,
                    position: p.position,
                    role: p.role ?? PlayerRole.player,
                    approval_status: ApprovalStatus.pending,
                })),
            });
        }
    }

    private async assertSinglePlayerNoConflict(
        tx: Prisma.TransactionClient,
        newSeasonTeamId: number,
        playerId: number,
    ): Promise<void> {
        const st = await tx.seasonTeam.findUniqueOrThrow({
            where: { id: newSeasonTeamId },
            select: { season_id: true, team_id: true },
        });

        const rival = await tx.teamPlayer.findFirst({
            where: {
                player_id: playerId,
                approval_status: ApprovalStatus.approved,
                season_team: {
                    team_id: { not: st.team_id },
                    deleted_at: null,
                    team: {
                        season_teams: {
                            some: {
                                season_id: st.season_id,
                                deleted_at: null,
                                status: { in: ACTIVE_SEASON_TEAM_STATUSES },
                            },
                        },
                    },
                },
            },
            select: {
                player: { select: { user: { select: { name: true } } } },
                season_team: { select: { team: { select: { name: true } } } },
            },
        });

        if (!rival) return;

        const playerName = rival.player.user?.name ?? `#${playerId}`;
        throw createAppError(
            "CONFLICT",
            `Cầu thủ ${playerName} đang thuộc đội ${rival.season_team.team.name}, đội này đã đăng ký mùa giải này rồi — không thể thêm vào roster`
        );
    }
}