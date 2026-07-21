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

// Các status season_team được coi là "đang chiếm chỗ" player trong season —
// dùng chung cho assertNoPlayerConflict. withdrawn/eliminated KHÔNG tính,
// vì team đó coi như đã rời season, player được tự do "thuộc về" team khác
// trong cùng season đó nữa.
const ACTIVE_SEASON_TEAM_STATUSES: SeasonTeamStatus[] = [
    SeasonTeamStatus.pending,
    SeasonTeamStatus.approved,
    SeasonTeamStatus.active,
];

// Kết quả trả về cho FE của getTeamRegistrationEligibility — 1 entry cho
// mỗi season đang mở đăng ký, kèm lý do disable nếu có, để modal đăng ký
// hiển thị disabled + lý do NGAY, thay vì để user bấm rồi mới nhận lỗi từ
// selfRegister().
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
     * FIX (multi-team ownership bug): trước đây resolve team qua
     * `findFirst({ where: { user_id: userId } })` — không có orderBy, không
     * scope theo team_id nào cả. Với user sở hữu NHIỀU team, request đăng ký
     * season cho team B thực tế bị ghi nhầm vào team đầu tiên user tạo
     * (team A), vì Prisma trả về bản ghi bất kỳ khớp user_id đầu tiên.
     * Bug này SILENT — không throw lỗi, dữ liệu sai lặng lẽ.
     *
     * Fix: bắt buộc `data.team_id` trong request (FE phải gửi kèm, xem
     * SelfRegisterSeasonTeamDto), verify đúng team đó thuộc về user hiện
     * tại thay vì suy đoán "1 team bất kỳ của user".
     */
    async selfRegister(data: SelfRegisterSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations> {
        const team = await this.prisma.team.findFirst({
            where: { id: data.team_id, user_id: userId },
            select: { id: true },
        });
        if (!team) throw createAppError("FORBIDDEN", "You are not the leader of this team");

        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${data.season_id} FOR UPDATE`;

            const season = await tx.season.findUnique({ where: { id: data.season_id } });
            if (!season) throw createAppError("NOT_FOUND", `Season ${data.season_id} not found`);

            if (season.status !== SeasonStatus.registration_open)
                throw createAppError("FORBIDDEN", "Season is not open for registration");

            if (season.registration_deadline && season.registration_deadline < new Date())
                throw createAppError("FORBIDDEN", "Registration deadline has passed");

            await this.assertSlotAvailable(tx, data.season_id, season.max_teams);
            // Không check "season overlap" ở đây: 1 team hoàn toàn có thể
            // tham gia nhiều season chạy song song về mặt calendar range
            // (bình thường trong thực tế). Xung đột thật sự chỉ xảy ra ở
            // tầng LỊCH THI ĐẤU CỤ THỂ (2 match cùng ngày/cùng giờ cần
            // chung player) — xem MatchService (chưa có trong scope hiện
            // tại), không phải ở season registration.
            //
            // FIX (player conflict): nhưng "cùng player, cùng season, 2 team
            // khác nhau" thì PHẢI chặn ngay ở bước đăng ký — không đợi tới
            // MatchService, vì đây là xung đột về mặt đại diện thi đấu, xảy
            // ra ngay khi cả 2 team cùng có mặt trong season, chưa cần biết
            // lịch cụ thể. Check theo season_id + team_id (team đang đăng ký).
            await this.assertNoPlayerConflict(tx, data.season_id, team.id);

            // selfRegister luôn tạo pending — không cần auto-assign group ở đây.
            return this.createOrReactivate(tx, data.season_id, team.id, userId, SeasonTeamStatus.pending);
        });
    }

    /**
     * FIX (auto-assign hook): adminAdd() có thể tạo thẳng status='approved'
     * (bỏ qua approve()) — nếu season đang dùng flow group_count (group đã
     * pre-tạo rỗng lúc Season.create), team tạo qua đây cũng phải tự fill
     * vào group ngay, không chỉ team đi qua approve() mới được xử lý.
     */
    async adminAdd(data: AdminAddSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations> {
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${data.season_id} FOR UPDATE`;

            const season = await tx.season.findUnique({ where: { id: data.season_id } });
            if (!season) throw createAppError("NOT_FOUND", `Season ${data.season_id} not found`);

            if (season.status !== SeasonStatus.registration_open)
                throw createAppError("FORBIDDEN", "Season is not open for registration");

            await this.assertSlotAvailable(tx, data.season_id, season.max_teams);
            // Xem ghi chú ở selfRegister() — không check season overlap ở đây.

            // FIX (player conflict): admin thêm tay vẫn phải qua check này —
            // adminAdd bỏ qua approve() nên nếu không check ở đây, admin có
            // thể vô tình add 1 team có player đã bị "khoá" bởi team khác
            // trong cùng season, sinh đúng bug mà selfRegister đang chặn.
            await this.assertNoPlayerConflict(tx, data.season_id, data.team_id);

            const finalStatus = data.status ?? SeasonTeamStatus.approved;
            const created = await this.createOrReactivate(tx, data.season_id, data.team_id, userId, finalStatus);

            if (finalStatus === SeasonTeamStatus.approved) {
                await this.groupService.autoAssignApprovedTeamToGroup(tx, data.season_id, created.id);
                return tx.seasonTeam.findUniqueOrThrow({ where: { id: created.id }, ...withRelations });
            }
            return created;
        });
    }

    /**
     * FIX (race condition — capacity check thiếu season lock): trước đây
     * chỉ lock `season_teams WHERE id=${id}`, KHÔNG lock season. 2 request
     * approve() đồng thời cho 2 SeasonTeam KHÁC NHAU cùng season đều đọc
     * snapshot `count approved < maxTeams`, cùng pass check, cùng update —
     * approved count có thể vượt max_teams (giống lost-update pattern đã
     * fix ở StandingsService.recomputeGroupStandings). selfRegister/adminAdd
     * đã lock season đúng; approve() thiếu — bổ sung ngay đầu transaction.
     *
     * FIX (auto-assign hook): sau khi set approved, gọi
     * GroupService.autoAssignApprovedTeamToGroup — no-op (trả null) nếu
     * season không dùng flow group_count, group_id giữ nguyên null chờ
     * drawGroups thủ công như trước.
     *
     * NOTE (player conflict): KHÔNG re-check player conflict ở approve().
     * Lý do: selfRegister/adminAdd đã chặn conflict ngay lúc tạo pending,
     * nên tại thời điểm approve(), record đã tồn tại hợp lệ. Trường hợp
     * duy nhất phát sinh conflict MỚI giữa lúc pending -> approve là admin
     * chủ động thêm player trùng vào team khác sau khi team A đã pending —
     * đây là thao tác riêng ở TeamPlayer, nên chặn ở chỗ thêm player vào
     * team (ngoài scope service này), không chặn ở approve().
     */
    // approve() — sửa 2 chỗ: fetch season kèm tournamentRule + gọi check
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

    // ── transferSeason() — đổi signature, giữ nguyên phần đầu ─────────
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
            // NOTE: assertNoPlayerConflict(team-level) không còn cần gọi ở đây —
            // roster đích giờ do leader tự chọn (carry/add), conflict được check
            // per-player trong transferRosterPlayers() qua assertSinglePlayerNoConflict.
            // Giữ team-level check này sẽ SAI vì nó check nguyên roster CŨ của team,
            // trong khi roster THẬT sự sang season mới có thể đã khác (do bớt/thêm).

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

    /**
     * FIX (capacity check thiếu — inconsistent với GroupService.assignTeamToGroup):
     * trước đây method này set group_id trực tiếp KHÔNG check teams_per_group,
     * trong khi GroupService.assignTeamToGroup (route khác, cùng field
     * group_id) có FOR UPDATE + capacity check đầy đủ. 2 đường ghi cùng dữ
     * liệu nhưng validate khác nhau — group có thể vượt capacity nếu FE gọi
     * qua route seasonTeam.assignGroup. Thêm lock group + capacity check
     * đồng nhất với GroupService.
     */
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

    /**
     * FIX (player conflict): chặn trường hợp 1 player đang active/approved
     * ở `teamId` (team đang đăng ký/transfer) mà player đó ĐỒNG THỜI cũng
     * đang active/approved ở 1 team KHÁC, và team khác đó đã có season_team
     * (pending/approved/active, chưa xoá) trong CÙNG season này.
     *
     * Không chặn: player thuộc nhiều team nhưng các team đó không đụng
     * nhau ở season này (khác season, hoặc team kia đã withdrawn/eliminated).
     *
     * LIMITATION (race condition): check này đọc snapshot tại thời điểm
     * gọi, không có row nào đại diện cho cặp (player, season) để FOR UPDATE
     * trực tiếp. Nếu 2 request đăng ký của 2 team share player chạy TRÙNG
     * thời điểm (cùng mili-giây), lý thuyết cả 2 vẫn có thể pass check
     * trước khi bên kia commit. Case này hiếm (đăng ký giải không phải
     * high-frequency operation) — nếu cần chặn tuyệt đối, cân nhắc thêm
     * `pg_advisory_xact_lock(hashtext('player:' || player_id))` cho từng
     * player_id của team trước khi query, hoặc nâng isolation level lên
     * Serializable cho transaction này.
     */
    // assertNoPlayerConflict — bỏ is_active ở cả where ngoài lẫn nested
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

    /**
     * NEW — trả về eligibility đăng ký cho MỌI season đang mở đăng ký, tính
     * sẵn `already_registered` + `conflict` (player trùng với team khác đã
     * ở season đó) cho team truyền vào.
     *
     * Lý do cần endpoint riêng thay vì chỉ dựa vào lỗi từ selfRegister():
     * trước đây FE tự suy already_registered bằng cách diff 2 danh sách
     * (season mở + season_team đã có) và hoàn toàn không biết gì về
     * player-conflict — conflict chỉ lộ ra SAU khi user bấm "Đăng ký" và
     * request fail. Endpoint này cho phép disable nút + hiển thị lý do
     * NGAY trong modal, trước khi user thao tác.
     *
     * PERF: gom toàn bộ season mở vào 1-2 query (không loop per season) —
     * tránh N+1 khi season mở đăng ký cùng lúc nhiều giải.
     *
     * LIMITATION: đây là snapshot đọc, cùng race-condition window đã ghi ở
     * assertNoPlayerConflict (2 request đăng ký chạy trùng thời điểm vẫn có
     * thể lách qua bước hiển thị này). assertNoPlayerConflict trong
     * selfRegister() transaction vẫn là nguồn sự thật cuối cùng — endpoint
     * này CHỈ phục vụ UX, không thay thế check đó.
     */
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
            // FIX: TeamPlayer không có team_id — lọc qua season_team.team_id.
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

    // bulkApprove() — sửa fetch season + thêm check trong loop, gộp chung try/catch với player-conflict để giữ semantics "fail riêng id, không rollback batch"
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
        if (!rule) return; // season không gắn rule hợp lệ — không tự chặn ngầm định, để lỗi lộ ra chỗ khác nếu đây là data bug

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
    /**
     * Bulk reject = pending -> withdrawn hàng loạt. Không cần lock season vì
     * reject không tranh chấp capacity (khác approve) — chỉ lock các row
     * season_team đang xử lý để tránh 2 request đồng thời cùng update 1 id.
     *
     * LƯU Ý SCHEMA: SeasonTeam không có field lưu lý do từ chối (khác Season
     * có cancel_reason). Nếu cần audit "vì sao reject", phải thêm cột hoặc
     * ghi vào Notification (NotificationType đã có sẵn 'team_rejected') —
     * hiện tại action này KHÔNG lưu lý do, chỉ đổi status.
     */
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
    // ── services/seasonTeam.service.ts ────────────────────────────────

    /**
     * FIX (leader chọn roster khi transfer, thay vì copy nguyên toàn bộ):
     * trước đây transferRosterPlayers copy 100% roster approved cũ, không cho
     * bớt/thêm. Đổi sang nhận input tường minh từ leader — carry_player_ids
     * là subset của roster cũ (validate ⊆), add_players là player MỚI hoàn
     * toàn chưa từng ở season_team cũ.
     *
     * ATOMIC theo thiết kế: đây là 1 hành động "Confirm chuyển đội" của
     * leader trên roster nhỏ (~7-20 người) — nếu add_players có 1 player bị
     * conflict, toàn bộ transaction rollback (kể cả phần carry hợp lệ và cả
     * transferSeason() gọi hàm này), KHÔNG dùng partial-success kiểu
     * bulkApprove/bulkReject. Lý do: đây không phải batch xử lý nhiều entity
     * độc lập — để lại season_team mới với roster nửa vời buộc leader phải tự
     * dò thiếu ai, tệ hơn nhận 1 lỗi rõ ràng và làm lại.
     *
     * jersey_number uniqueness được validate CROSS-SET (carried vs add_players)
     * trước khi insert — nếu để DB constraint bắt, lỗi Prisma thô lộ ra thay
     * vì AppError sạch.
     */
    private async transferRosterPlayers(
        tx: Prisma.TransactionClient,
        oldSeasonTeamId: number,
        newSeasonTeamId: number,
        input: TransferRosterInput,
    ): Promise<void> {
        const oldRoster = await tx.teamPlayer.findMany({
            where: { season_team_id: oldSeasonTeamId, approval_status: ApprovalStatus.approved },
        });

        // --- validate carry_player_ids ⊆ oldRoster ---
        const oldRosterIds = new Set(oldRoster.map((tp) => tp.player_id));
        const invalidCarryIds = input.carry_player_ids.filter((id) => !oldRosterIds.has(id));
        if (invalidCarryIds.length > 0)
            throw createAppError(
                "BAD_REQUEST",
                `Cầu thủ ${invalidCarryIds.join(", ")} không thuộc roster hiện tại của đội, không thể giữ lại`
            );

        const carrySet = new Set(input.carry_player_ids);
        const carried = oldRoster.filter((tp) => carrySet.has(tp.player_id));

        // --- validate add_players không trùng player_id với carried, và không trùng nhau trong chính add_players ---
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

        // --- validate jersey_number uniqueness CROSS-SET (carried + add_players) ---
        const jerseyNumbers = [
            ...carried.map((tp) => tp.jersey_number),
            ...input.add_players.map((p) => p.jersey_number),
        ];
        const jerseySet = new Set(jerseyNumbers);
        if (jerseySet.size !== jerseyNumbers.length)
            throw createAppError("BAD_REQUEST", "Số áo bị trùng giữa các cầu thủ trong roster mới");

        // --- roster cap theo tournament_rule của season ĐÍCH ---
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

        // --- conflict check cho từng player MỚI add (player-level, không phải team-level) ---
        for (const p of input.add_players) {
            await this.assertSinglePlayerNoConflict(tx, newSeasonTeamId, p.player_id);
        }

        const now = new Date();

        // --- history cho TOÀN BỘ oldRoster: carried -> transferred, không carry -> dropped ---
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

        // --- ghi carried sang season_team mới, giữ nguyên jersey/position/role cũ ---
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

        // --- ghi add_players (net-new) ---
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

    /**
     * Player-level conflict check — KHÁC assertNoPlayerConflict (scope theo
     * team_id, đối chiếu roster nguyên team). Dùng khi cần check 1 player_id
     * đơn lẻ vừa được add vào roster (chưa chắc từng thuộc roster nào trước
     * đó ở season này) có đang bị "khoá" bởi 1 team KHÁC đã ở season đích hay
     * không.
     */
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