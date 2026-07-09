import { createAppError } from "../common/app.error.js";
import { CancelSeasonDto, CreateSeasonDto, UpdateSeasonDto } from "../dtos/season.schema.js";
import { PrismaClient, Season, SeasonStatus } from "../generated/prisma/client.js";
import { Queryable } from "../libs/queryable.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { GroupService } from "./group.service.js";

const STATUS_TRANSITIONS: Partial<Record<SeasonStatus, SeasonStatus[]>> = {
    [SeasonStatus.upcoming]: [SeasonStatus.registration_open, SeasonStatus.cancelled],
    [SeasonStatus.registration_open]: [SeasonStatus.ongoing, SeasonStatus.cancelled],
    [SeasonStatus.ongoing]: [SeasonStatus.finished, SeasonStatus.cancelled],
    [SeasonStatus.finished]: [SeasonStatus.finished],
    [SeasonStatus.cancelled]: [SeasonStatus.cancelled],
};

export class SeasonService {
    private readonly query: Queryable<Season>;

    constructor(
        private readonly prisma: PrismaClient,
        private readonly groupService: GroupService,
    ) {
        this.query = new Queryable<Season>(prisma.season, {
            searchFields: ["name", "description"],
            sortable: ["id", "name", "created_at"],
            defaultSort: { column: "id", direction: "asc" },
            filterable: ["is_active"],
            defaultPerPage: 20,
            maxPerPage: 100,
            beforeBuild: (where) => {
                where.push({ is_active: true });
            },
        });
    }

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<Season>> {
        return this.query.run(req, {
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true }
                },
            }
        });
    }

    async findByIdOrFail(id: number): Promise<Season> {
        const season = await this.prisma.season.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true }
                },
                tournament: true
            }
        });
        if (!season) throw createAppError('NOT_FOUND', `Season ${id} not found`);
        return season;
    }

    /**
     * FIX (stage 3 → stage 4 wizard): CreateSeasonDto.group_count (nếu có,
     * dùng cho flow round_robin nhập số group TRƯỚC khi season tồn tại) kích
     * hoạt GroupService.createEmptyRoundRobinGroups trong CÙNG transaction
     * với season insert — tạo Phase round_robin + N group RỖNG ngay. Team
     * approve sau tự fill dần (SeasonTeamService.approve/adminAdd gọi
     * GroupService.autoAssignApprovedTeamToGroup). group_count optional —
     * không truyền vẫn dùng được flow cũ (createGroupsBulk/drawGroups thủ
     * công sau khi có team).
     *
     * is_registration_open set tường minh false — season luôn khởi tạo
     * 'upcoming', field is_registration_open tách riêng khỏi status enum
     * (xem updateStatus/cancel) nên phải đồng bộ ngay từ create(), không để
     * default cột tự lo.
     */
    async create(data: CreateSeasonDto, userId: number): Promise<Season> {
        this.validateDateRelationships(data.start_date, data.end_date, data.registration_deadline);
        this.validateFutureIfProvided(data.start_date, data.registration_deadline);

        const rule = await this.prisma.tournamentRule.findUnique({ where: { id: data.tournament_rule_id } });
        if (!rule) throw createAppError('NOT_FOUND', `TournamentRule ${data.tournament_rule_id} not found`);
        if (rule.tournament_id !== data.tournament_id)
            throw createAppError('VALIDATION_ERROR', `Rule ${data.tournament_rule_id} không thuộc tournament ${data.tournament_id}`);

        const { group_count, ...seasonData } = data;

        return this.prisma.$transaction(async (tx) => {
            const season = await tx.season.create({
                data: {
                    ...seasonData,
                    user_id: userId,
                    description: data.description ?? null,
                    start_date: data.start_date ?? null,
                    end_date: data.end_date ?? null,
                    registration_deadline: data.registration_deadline ?? null,
                    is_registration_open: false,
                },
            });

            if (group_count && group_count > 0) {
                await this.groupService.createEmptyRoundRobinGroups(tx, season.id, group_count);
            }

            return season;
        });
    }

    async update(id: number, data: UpdateSeasonDto): Promise<Season> {
        const existing = await this.findByIdOrFail(id);
        this.validateStatusAllowsEdit(existing.status);

        const start_date = data.start_date ?? existing.start_date;
        const end_date = data.end_date ?? existing.end_date;
        const registration_deadline = data.registration_deadline ?? existing.registration_deadline;
        this.validateDateRelationships(start_date, end_date, registration_deadline);

        // future check chỉ trên field được gửi lên trong request — không suy ra
        // từ existing (season cũ có start_date đã qua vẫn phải edit được bình
        // thường, miễn không đổi start_date sang một mốc quá khứ mới).
        this.validateFutureIfProvided(data.start_date, data.registration_deadline);

        return this.prisma.season.update({
            where: { id },
            data: {
                ...data,
                start_date: start_date ?? undefined,
                end_date: end_date ?? undefined,
                registration_deadline: registration_deadline ?? undefined,
            },
        });
    }

    async cancel(id: number, data: CancelSeasonDto): Promise<Season> {
        const existing = await this.findByIdOrFail(id);
        this.validateStatusTransition(existing.status, SeasonStatus.cancelled);

        return this.prisma.season.update({
            where: { id },
            data: {
                status: SeasonStatus.cancelled,
                is_active: false,
                is_registration_open: false,
                cancel_reason: data.cancel_reason,
            },
        });
    }

    /**
     * FIX (is_registration_open dead field): schema có is_registration_open
     * TÁCH RIÊNG khỏi status enum, nhưng trước đây chỉ status được update —
     * is_registration_open giữ nguyên default (false) vĩnh viễn, kể cả khi
     * status đã chuyển sang 'registration_open'. Bất kỳ query/filter nào
     * dùng is_registration_open thay vì status (rất dễ xảy ra vì tên field
     * gợi ý đúng mục đích đó) sẽ luôn ra sai — season đang mở đăng ký vẫn bị
     * lọc ra ngoài. Set field này bám sát theo status transition ngay tại
     * đây, không để 2 nguồn sự thật (status vs is_registration_open) lệch nhau.
     *
     * FIX (auto-finalize groups khi đóng đăng ký): trước đây chuyển sang
     * 'ongoing' không đụng gì tới group cả — nếu season được tạo sẵn N group
     * rỗng (flow group_count lúc create) mà số team approved thực tế THẤP
     * HƠN NHIỀU so với dự kiến ban đầu (VD dự kiến 22 team/2 group nhưng chỉ
     * có 3 team đăng ký), season vẫn chuyển 'ongoing' bình thường và để lại
     * group với 1-2 team — vô nghĩa với thể thức round_robin, không ai được
     * cảnh báo. Gọi groupService.autoFinalizeGroups NGAY TRƯỚC khi update
     * status — tính lại số group cho khớp team thực tế và re-draw, hoặc
     * throw CONFLICT nếu team quá ít để tổ chức (chặn hẳn việc chuyển
     * 'ongoing' trong trường hợp đó thay vì âm thầm để lại group hỏng).
     *
     * Lưu ý: đây là 2 transaction riêng (autoFinalizeGroups tự mở
     * transaction, season.update là 1 statement rời) — không atomic tuyệt
     * đối, nhưng chấp nhận được vì đây là thao tác admin tần suất thấp;
     * nếu autoFinalizeGroups throw, season.update không chạy nên không có
     * state nửa vời (status vẫn giữ nguyên registration_open).
     */
    async updateStatus(
        id: number,
        newStatus: SeasonStatus,
        meta?: { cancel_reason?: string }
    ): Promise<Season> {
        if (newStatus === SeasonStatus.cancelled) {
            // Bắt buộc đi qua logic cancel() riêng — enforce cancel_reason tại
            // đây luôn để không có đường tắt bypass validation qua generic
            // status update.
            return this.cancel(id, { cancel_reason: meta?.cancel_reason ?? '' });
        }

        const existing = await this.findByIdOrFail(id);
        this.validateStatusTransition(existing.status, newStatus);
        this.validateStatusPreConditions(existing, newStatus);

        if (newStatus === SeasonStatus.ongoing) {
            // Chốt group theo số team approved thực tế trước khi khoá
            // registration — no-op nếu season không dùng flow group-based
            // (findRoundRobinPhase trả null bên trong autoFinalizeGroups).
            await this.groupService.autoFinalizeGroups(id);
        }

        return this.prisma.season.update({
            where: { id },
            data: {
                status: newStatus,
                is_registration_open: newStatus === SeasonStatus.registration_open,
                ...(newStatus === 'finished' && { is_active: false }),
            },
        });
    }

    async softDelete(id: number): Promise<void> {
        const existing = await this.findByIdOrFail(id);
        this.validateStatusAllowsEdit(existing.status);
        await this.prisma.season.update({
            where: { id },
            data: { is_active: false, deleted_at: new Date() },
        });
    }

    // ─── Private ────────────────────────────────────────────────

    private validateDateRelationships(
        start_date?: Date | null,
        end_date?: Date | null,
        registration_deadline?: Date | null
    ): void {
        if (start_date && end_date) {
            if (start_date >= end_date)
                throw createAppError('VALIDATION_ERROR', 'start_date must be before end_date');
        }

        if (registration_deadline && start_date) {
            if (registration_deadline >= start_date)
                throw createAppError('VALIDATION_ERROR', 'registration_deadline must be before start_date');
        }
    }

    private validateFutureIfProvided(
        start_date?: Date | null,
        registration_deadline?: Date | null
    ): void {
        const now = new Date();

        if (start_date && start_date <= now)
            throw createAppError('VALIDATION_ERROR', 'start_date must be in the future');

        if (registration_deadline && registration_deadline <= now)
            throw createAppError('VALIDATION_ERROR', 'registration_deadline must be in the future');
    }

    private validateStatusTransition(from: SeasonStatus, to: SeasonStatus): void {
        if (!STATUS_TRANSITIONS[from]?.includes(to)) {
            throw createAppError('VALIDATION_ERROR', `Cannot transition from '${from}' to '${to}'`);
        }
    }

    private validateStatusPreConditions(existing: Season, newStatus: SeasonStatus): void {
        const now = new Date();

        if (newStatus === 'registration_open') {
            if (!existing.start_date || !existing.end_date || !existing.registration_deadline)
                throw createAppError('VALIDATION_ERROR', 'start_date, end_date, registration_deadline are required before opening registration');

            if (existing.registration_deadline <= now)
                throw createAppError('VALIDATION_ERROR', 'registration_deadline has already passed');

            if (existing.start_date <= now)
                throw createAppError('VALIDATION_ERROR', 'start_date has already passed');
        }

        // ongoing, finished, cancelled: admin chủ động chuyển tay — không
        // enforce date check ở các transition này (riêng 'ongoing' có check
        // số lượng team/group qua groupService.autoFinalizeGroups ở
        // updateStatus(), không đặt ở đây vì cần query DB, không thuần date).
    }

    private validateStatusAllowsEdit(status: SeasonStatus): void {
        // Allow editing season details and status at any point to give admins
        // full control. No longer restrict based on 'registration_open',
        // 'ongoing', 'finished', or 'cancelled'.
    }
}