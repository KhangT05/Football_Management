import { createAppError } from "../common/app.error.js";
import { SeasonStatus } from "../generated/prisma/client.js";
import { Queryable } from "../libs/queryable.js";
const STATUS_TRANSITIONS = {
    [SeasonStatus.upcoming]: [SeasonStatus.registration_open, SeasonStatus.cancelled],
    [SeasonStatus.registration_open]: [SeasonStatus.ongoing, SeasonStatus.cancelled],
    [SeasonStatus.ongoing]: [SeasonStatus.finished, SeasonStatus.cancelled],
};
export class SeasonService {
    prisma;
    query;
    constructor(prisma) {
        this.prisma = prisma;
        this.query = new Queryable(prisma.season, {
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
    findAll(req = {}) {
        return this.query.run(req, {
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true }
                },
            }
        });
    }
    async findByIdOrFail(id) {
        const season = await this.prisma.season.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true }
                },
                tournament: true
            }
        });
        if (!season)
            throw createAppError('NOT_FOUND', `Season ${id} not found`);
        return season;
    }
    async create(data, userId) {
        this.validateDatesIfPresent(data.start_date, data.end_date, data.registration_deadline);
        return this.prisma.season.create({
            data: {
                ...data,
                user_id: userId,
                description: data.description ?? null,
                start_date: data.start_date ?? null,
                end_date: data.end_date ?? null,
                registration_deadline: data.registration_deadline ?? null,
            },
        });
    }
    async update(id, data) {
        const existing = await this.findByIdOrFail(id);
        this.validateStatusAllowsEdit(existing.status);
        const start_date = data.start_date ?? existing.start_date;
        const end_date = data.end_date ?? existing.end_date;
        const registration_deadline = data.registration_deadline ?? existing.registration_deadline;
        this.validateDatesIfPresent(start_date, end_date, registration_deadline);
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
    async cancel(id, data) {
        const existing = await this.findByIdOrFail(id);
        this.validateStatusTransition(existing.status, SeasonStatus.cancelled);
        return this.prisma.season.update({
            where: { id },
            data: {
                status: SeasonStatus.cancelled,
                is_active: false,
                cancel_reason: data.cancel_reason,
            },
        });
    }
    async updateStatus(id, newStatus, meta) {
        if (newStatus === SeasonStatus.cancelled) {
            // Bắt buộc dùng endpoint /cancel riêng — enforce reason tại đây luôn
            // để không có đường tắt bypass validation qua generic status update
            return this.cancel(id, { cancel_reason: meta?.cancel_reason ?? '' });
        }
        const existing = await this.findByIdOrFail(id);
        this.validateStatusTransition(existing.status, newStatus);
        this.validateStatusPreConditions(existing, newStatus);
        return this.prisma.season.update({
            where: { id },
            data: {
                status: newStatus,
                ...(newStatus === 'finished' && { is_active: false }),
            },
        });
    }
    async softDelete(id) {
        const existing = await this.findByIdOrFail(id);
        this.validateStatusAllowsEdit(existing.status);
        await this.prisma.season.update({
            where: { id },
            data: { is_active: false, deleted_at: new Date() },
        });
    }
    // ─── Private ────────────────────────────────────────────────
    validateDatesIfPresent(start_date, end_date, registration_deadline) {
        const now = new Date();
        // Chỉ validate relationship khi có đủ cặp liên quan
        if (start_date && end_date) {
            if (start_date >= end_date)
                throw createAppError('VALIDATION_ERROR', 'start_date must be before end_date');
        }
        if (registration_deadline && start_date) {
            if (registration_deadline >= start_date)
                throw createAppError('VALIDATION_ERROR', 'registration_deadline must be before start_date');
        }
        // future check chỉ trên field được gửi lên — không suy ra từ existing
        if (start_date && start_date <= now)
            throw createAppError('VALIDATION_ERROR', 'start_date must be in the future');
        if (registration_deadline && registration_deadline <= now)
            throw createAppError('VALIDATION_ERROR', 'registration_deadline must be in the future');
    }
    validateStatusTransition(from, to) {
        if (!STATUS_TRANSITIONS[from]?.includes(to)) {
            throw createAppError('VALIDATION_ERROR', `Cannot transition from '${from}' to '${to}'`);
        }
    }
    validateStatusPreConditions(existing, newStatus) {
        const now = new Date();
        if (newStatus === 'registration_open') {
            if (!existing.start_date || !existing.end_date || !existing.registration_deadline)
                throw createAppError('VALIDATION_ERROR', 'start_date, end_date, registration_deadline are required before opening registration');
            if (existing.registration_deadline <= now)
                throw createAppError('VALIDATION_ERROR', 'registration_deadline has already passed');
            if (existing.start_date <= now)
                throw createAppError('VALIDATION_ERROR', 'start_date has already passed');
        }
        // ongoing, finished, cancelled: admin chủ động — không enforce date check
    }
    validateStatusAllowsEdit(status) {
        // Allow editing season details and status at any point to give admins full control.
        // No longer restrict based on 'registration_open', 'ongoing', 'finished', or 'cancelled'.
    }
}
//# sourceMappingURL=season.service.js.map