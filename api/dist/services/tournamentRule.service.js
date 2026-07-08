// tournamentRule.service.ts
import { createAppError } from "../common/app.error.js";
import { parseJsonField } from "../common/prisma.utils.js";
import { TIEBREAKER_OPTIONS } from "../dtos/tournamentRule.schema.js";
import { MatchResultStatus } from "../generated/prisma/client.js";
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
    /**
     * FIX (Medium #5): update() gọi JSON.stringify(tiebreaker_order) trước khi ghi
     * (cột lưu string, mapToDto parse lại qua parseJsonField). create() trước đây
     * ghi thẳng ...data (array) vào cùng cột — inconsistent. Nếu cột là String,
     * create() ghi sai type; nếu cột là Json, update() đang double-encode. Đồng bộ
     * theo hướng update() (stringify thủ công) vì mapToDto parse như đọc string.
     * Return type sửa từ CreateTournamentRuleDto → TournamentRuleDto cho khớp giá
     * trị thực trả về (mapToDto trả full object + relations).
     */
    async create(data, userId) {
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
        const touchesRetroactive = RETROACTIVE_FIELDS.some((f) => data[f] !== undefined);
        if (touchesRetroactive && !force) {
            const current = await this.prisma.tournamentRule.findUnique({
                where: { id },
                select: { tournament_id: true },
            });
            if (!current)
                throw createAppError("NOT_FOUND", `TournamentRule ${id} not found`);
            // FIX (Medium #6): raw string "official" bypass type-check — nếu enum
            // value đổi, điều kiện này silently break mà không compile error.
            const hasOfficialMatch = await this.prisma.matchResult.findFirst({
                where: {
                    status: MatchResultStatus.official,
                    match: { phase: { season: { tournament_id: current.tournament_id } } },
                },
                select: { id: true },
            });
            if (hasOfficialMatch) {
                throw createAppError("CONFLICT", `TournamentRule ${id}: tournament đã có match official — đổi points_per_win/draw/loss ` +
                    `hoặc yellow_cards_suspension sẽ rewrite retroactive standings/suspension đã tính ` +
                    `(recomputeGroupStandings và _recomputeStatsForPlayers full-scan, không snapshot). ` +
                    `Tạo season/rule mới, hoặc gọi lại với force=true nếu chủ đích đổi hồi tố.`);
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