import { createAppError } from "../common/app.error.js";
import { CreateTeamDto, UpdateTeamDto } from "../dtos/team.schema.js";
import { PrismaClient, Team, TeamLeader } from "../generated/prisma/client.js";
import { Queryable } from "../libs/queryable.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { CAPTAIN_WITH_USER, TEAM_WITH_OWNER, USER_SELECT } from "../types/team.type.js";

export class TeamService {
    private readonly query: Queryable<Team>;

    constructor(private readonly prisma: PrismaClient) {
        this.query = new Queryable<Team>(prisma.team, {
            searchFields: ["name", "description"],
            sortable: ["id", "name", "created_at"],
            defaultSort: { column: "id", direction: "asc" },
            filterable: ["is_active", "class_id", "user_id"],
            defaultPerPage: 20,
            maxPerPage: 100,
            beforeBuild: (where) => { where.push({ is_active: true }); },
        });
    }

    // ─── Read ──────────────────────────────────────────────────────────────────

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<Team>> {
        return this.query.run(req, TEAM_WITH_OWNER);
    }

    async findByIdOrFail(id: number): Promise<Team> {
        const team = await this.prisma.team.findUnique({
            where: { id, is_active: true },
            include: {
                user: USER_SELECT,
                // seasons include chỉ khi cần — tách ra endpoint riêng
            },
        });
        if (!team) throw createAppError("NOT_FOUND", `Team ${id} not found`);
        return team;
    }

    /** Lightweight existence check — không join, chỉ lấy fields cần thiết */
    private async assertExists(id: number): Promise<{ id: number; user_id: number | null; logo: string | null }> {
        const team = await this.prisma.team.findUnique({
            where: { id, is_active: true },
            select: { id: true, user_id: true, logo: true },
        });
        if (!team) throw createAppError("NOT_FOUND", `Team ${id} not found`);
        return team;
    }

    /**
     * FIX: mới thêm. class_id trên Team giờ là FK optional — Prisma không
     * validate trước insert/update, chỉ throw P2003 raw ở DB nếu id không
     * tồn tại. Check tường minh ở đây để trả CONFLICT/BAD_REQUEST rõ ràng
     * thay vì lỗi FK constraint lộ ra ngoài. Bỏ qua nếu class_id undefined
     * (không đổi) hoặc null (bỏ gán lớp — hợp lệ).
     */
    private async assertClassExists(classId: number | null | undefined): Promise<void> {
        if (classId == null) return;
        const cls = await this.prisma.class.findUnique({
            where: { id: classId, is_active: true },
            select: { id: true },
        });
        if (!cls) throw createAppError("BAD_REQUEST", `Class ${classId} not found hoặc đã bị vô hiệu hoá`);
    }

    // ─── Write ─────────────────────────────────────────────────────────────────

    /** user_id = creator, không phải captain */
    async create(data: CreateTeamDto, userId: number): Promise<Team> {
        await this.assertClassExists(data.class_id);

        return this.prisma.team.create({
            data: { ...data, user_id: userId },
            ...TEAM_WITH_OWNER,
        });
    }

    async update(id: number, data: UpdateTeamDto): Promise<Team> {
        await this.assertExists(id);
        await this.assertClassExists(data.class_id);

        const patch = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined)
        ) as UpdateTeamDto;

        // TODO: old logo leak until schema adds logo_public_id column
        return this.prisma.team.update({
            where: { id },
            data: patch,
            ...TEAM_WITH_OWNER,
        });
    }

    async softDelete(id: number): Promise<void> {
        await this.assertExists(id);

        const activeSeasonCount = await this.prisma.seasonTeam.count({
            where: {
                team_id: id,
                season: {
                    status: { in: ["registration_open", "ongoing"] },
                },
            },
        });
        if (activeSeasonCount > 0)
            throw createAppError(
                "VALIDATION_ERROR",
                "Cannot delete team with active seasons"
            );

        await this.prisma.team.update({
            where: { id },
            data: { is_active: false, deleted_at: new Date() },
        });
    }
    // ─── Captain ───────────────────────────────────────────────────────────────

    getCaptain(teamId: number): Promise<TeamLeader | null> {
        return this.prisma.teamLeader.findFirst({
            where: { team_id: teamId, is_active: true },
            ...CAPTAIN_WITH_USER,
        });
    }

    async assignCaptain(
        teamId: number,
        newUserId: number,
        requesterId: number,
        requesterIsAdmin: boolean
    ): Promise<TeamLeader> {
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

        if (!team) throw createAppError("NOT_FOUND", `Team ${teamId} not found`);
        if (!newUser) throw createAppError("NOT_FOUND", `User ${newUserId} not found`);

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

    async restore(id: number): Promise<Team> {
        const team = await this.prisma.team.findUnique({
            where: { id },
            select: { id: true, is_active: true, name: true },
        });
        if (!team) throw createAppError("NOT_FOUND", `Team ${id} not found`);
        if (team.is_active)
            throw createAppError("BAD_REQUEST", "Team đang active, không cần restore");

        try {
            return await this.prisma.team.update({
                where: { id },
                data: { is_active: true, deleted_at: null },
                ...TEAM_WITH_OWNER,
            });
        } catch (err: any) {
            if (err.code === "P2002")
                throw createAppError("CONFLICT", `Tên "${team.name}" đã bị đội khác sử dụng, không thể restore`);
            throw err;
        }
    }
}