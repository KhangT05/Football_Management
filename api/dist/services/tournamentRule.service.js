import { createAppError } from "../common/app.error.js";
import { parseJsonField } from "../common/prisma.utils.js";
import { TIEBREAKER_OPTIONS } from "../dtos/tournamentRule.schema.js";
const withRelations = {
    include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        tournament: { select: { id: true, name: true } },
    },
};
const TIEBREAKER_SET = new Set(TIEBREAKER_OPTIONS);
const isTiebreakerArray = (v) => Array.isArray(v) && v.every((x) => TIEBREAKER_SET.has(x));
export class TournamentRuleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToDto(rule) {
        return {
            ...rule,
            tiebreaker_order: parseJsonField(rule.tiebreaker_order, isTiebreakerArray, ["goal_diff"]),
        };
    }
    async findAll() {
        const rules = await this.prisma.tournamentRule.findMany(withRelations);
        return rules.map((r) => this.mapToDto(r));
    }
    async findByIdOrFail(id) {
        const rule = await this.prisma.tournamentRule.findUnique({
            where: { id },
            ...withRelations,
        });
        if (!rule)
            throw createAppError("NOT_FOUND", `TournamentRule ${id} not found`);
        return this.mapToDto(rule);
    }
    async create(data, userId) {
        const rule = await this.prisma.tournamentRule.create({
            data: { ...data, user_id: userId },
            ...withRelations,
        });
        return this.mapToDto(rule);
    }
    async update(id, data) {
        const rule = await this.prisma.tournamentRule.update({
            where: { id },
            data: {
                ...data,
                tiebreaker_order: data.tiebreaker_order
                    ? JSON.stringify(data.tiebreaker_order)
                    : undefined,
            },
            ...withRelations,
        });
        return this.mapToDto(rule);
    }
    async softDelete(id) {
        await this.prisma.tournamentRule.update({
            where: { id },
            data: {
                is_active: false,
                deleted_at: new Date()
            },
        });
    }
    async restore(id) {
        const result = await this.prisma.tournamentRule.updateMany({
            where: { id, deleted_at: { not: null } },
            data: {
                deleted_at: null,
            },
        });
        if (result.count === 0) {
            throw createAppError("NOT_FOUND", `TournamentRule ${id} not found or not deleted`);
        }
        return this.findByIdOrFail(id);
    }
}
//# sourceMappingURL=tournamentRule.service.js.map