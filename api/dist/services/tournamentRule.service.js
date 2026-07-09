// tournamentRule.service.ts
import { createAppError } from "../common/app.error.js";
import { parseJsonField } from "../common/prisma.utils.js";
import { TIEBREAKER_OPTIONS } from "../dtos/tournamentRule.schema.js";
import { MatchResultStatus, SeasonFormat } from "../generated/prisma/client.js";
const withRelations = {
    include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        tournament: { select: { id: true, name: true } },
    },
};
const TIEBREAKER_SET = new Set(TIEBREAKER_OPTIONS);
const isTiebreakerArray = (v) => Array.isArray(v) && v.every((x) => TIEBREAKER_SET.has(x));
const RETROACTIVE_FIELDS = [
    "points_per_win",
    "points_per_draw",
    "points_per_loss",
    "yellow_cards_suspension",
];
const STRUCTURAL_FIELDS = [
    "format",
    "round_robin_stages",
];
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
    validateFormatConsistency(format, round_robin_stages) {
        if (format === undefined && round_robin_stages === undefined)
            return;
        if (format === SeasonFormat.round_robin_knockout
            && round_robin_stages !== undefined
            && round_robin_stages !== 1) {
            throw createAppError("VALIDATION_ERROR", "format = round_robin_knockout yêu cầu round_robin_stages = 1");
        }
        if (format === SeasonFormat.multi_round_robin_knockout
            && round_robin_stages !== undefined
            && round_robin_stages < 2) {
            throw createAppError("VALIDATION_ERROR", "format = multi_round_robin_knockout yêu cầu round_robin_stages >= 2");
        }
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
        this.validateFormatConsistency(data.format, data.round_robin_stages);
        const rule = await this.prisma.tournamentRule.create({
            data: {
                ...data,
                user_id: userId,
                ...(data.tiebreaker_order !== undefined && {
                    tiebreaker_order: JSON.stringify(data.tiebreaker_order),
                }),
            },
            ...withRelations,
        });
        return this.mapToDto(rule);
    }
    async update(id, data, force = false) {
        this.validateFormatConsistency(data.format, data.round_robin_stages);
        const touchesRetroactive = RETROACTIVE_FIELDS.some((f) => data[f] !== undefined);
        const touchesStructural = STRUCTURAL_FIELDS.some((f) => data[f] !== undefined);
        if ((touchesRetroactive || touchesStructural) && !force) {
            const current = await this.prisma.tournamentRule.findUnique({
                where: { id },
                select: { id: true },
            });
            if (!current)
                throw createAppError("NOT_FOUND", `TournamentRule ${id} not found`);
            if (touchesRetroactive) {
                const hasOfficialMatch = await this.prisma.matchResult.findFirst({
                    where: {
                        status: MatchResultStatus.official,
                        match: { phase: { season: { tournament_rule_id: id } } },
                    },
                    select: { id: true },
                });
                if (hasOfficialMatch) {
                    throw createAppError("CONFLICT", `TournamentRule ${id}: (các) season đang dùng rule này đã có match official — đổi ` +
                        `points_per_win/draw/loss hoặc yellow_cards_suspension sẽ rewrite retroactive ` +
                        `standings/suspension đã tính (recomputeGroupStandings và _recomputeStatsForPlayers ` +
                        `full-scan, không snapshot). Tạo season/rule mới, hoặc gọi lại với force=true nếu chủ ` +
                        `đích đổi hồi tố.`);
                }
            }
            if (touchesStructural) {
                const hasAnyPhase = await this.prisma.phase.findFirst({
                    where: { season: { tournament_rule_id: id } },
                    select: { id: true },
                });
                if (hasAnyPhase) {
                    throw createAppError("CONFLICT", `TournamentRule ${id}: đã có season dùng rule này để sinh phase — không thể ` +
                        `đổi format/round_robin_stages vì sẽ làm lệch cấu trúc bracket/group đã tạo. ` +
                        `Tạo TournamentRule mới cho season sau thay vì sửa rule này.`);
                }
            }
        }
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
                is_active: true,
            },
        });
        if (result.count === 0) {
            throw createAppError("NOT_FOUND", `TournamentRule ${id} not found or not deleted`);
        }
        return this.findByIdOrFail(id);
    }
    async listByTournament(tournamentId) {
        const rules = await this.prisma.tournamentRule.findMany({
            where: { tournament_id: tournamentId, is_active: true, deleted_at: null },
            ...withRelations,
        });
        return rules.map(r => this.mapToDto(r));
    }
}
//# sourceMappingURL=tournamentRule.service.js.map