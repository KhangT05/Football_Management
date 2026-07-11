import { createAppError } from "../common/app.error.js";
import { parseJsonField } from "../common/prisma.utils.js";
import { TIEBREAKER_OPTIONS } from "../dtos/tournamentRule.schema.js";
import { MatchResultStatus, SeasonFormat, SeasonStatus } from "../generated/prisma/client.js";
const withRelations = {
    include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        tournament: { select: { id: true, name: true } },
        // Cần cho FE hiển thị badge "Đã khoá" + tự disable nút Edit,
        // tránh user bấm Edit rồi mới nhận CONFLICT/RULE_LOCKED sau khi Save.
        seasons: { select: { id: true, name: true, status: true } },
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
// Season ở các status này -> rule còn sửa được. Khác các status này (ongoing/finished/
// cancelled...) -> khoá cứng, force cũng không qua được.
const EDITABLE_SEASON_STATUSES = [
    SeasonStatus.upcoming,
    SeasonStatus.registration_open,
];
export class TournamentRuleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToDto(rule) {
        return {
            ...rule,
            fine_per_yellow_card: rule.fine_per_yellow_card.toNumber(),
            fine_per_red_card: rule.fine_per_red_card.toNumber(),
            bonus_per_goal: rule.bonus_per_goal.toNumber(),
            bonus_per_assist: rule.bonus_per_assist.toNumber(),
            tiebreaker_order: parseJsonField(rule.tiebreaker_order, isTiebreakerArray, ["goal_diff"]),
        };
    }
    /**
     * DUY NHẤT nơi chứa business rule: format <-> round_robin_stages.
     * Nhận full resolved state (không phải partial) — caller chịu trách nhiệm
     * merge payload với DB hiện tại trước khi gọi (xem update()).
     */
    validateFormatConsistency(format, round_robin_stages) {
        switch (format) {
            case SeasonFormat.knockout:
                if (round_robin_stages !== 0) {
                    throw createAppError("VALIDATION_ERROR", "format = knockout (không có vòng bảng) yêu cầu round_robin_stages = 0");
                }
                break;
            case SeasonFormat.round_robin_knockout:
                if (round_robin_stages !== 1) {
                    throw createAppError("VALIDATION_ERROR", "format = round_robin_knockout yêu cầu round_robin_stages = 1");
                }
                break;
            case SeasonFormat.multi_round_robin_knockout:
                if (round_robin_stages < 2) {
                    throw createAppError("VALIDATION_ERROR", "format = multi_round_robin_knockout yêu cầu round_robin_stages >= 2");
                }
                break;
            case SeasonFormat.round_robin:
                if (round_robin_stages < 1) {
                    throw createAppError("VALIDATION_ERROR", "format = round_robin yêu cầu round_robin_stages >= 1");
                }
                break;
        }
    }
    /**
     * Lock hàng Tournament (SELECT ... FOR UPDATE) để serialize mọi transaction
     * đang cố set is_active=true cho rule của CÙNG tournament_id. Đây là cách
     * giả lập "unique constraint có điều kiện" mà không cần đổi schema/DDL —
     * đánh đổi: chỉ đúng khi MỌI code path set is_active=true đều đi qua hàm
     * này trong cùng transaction. Không có DB-level backstop nếu sau này có
     * chỗ khác (script, raw query, migration data) set is_active=true mà quên
     * gọi qua đây.
     *
     * Phải gọi bên trong transaction đang chạy create/update, và PHẢI gọi
     * TRƯỚC khi đọc/ghi tournamentRule để đảm bảo thứ tự lock nhất quán,
     * tránh deadlock với các transaction khác cũng lock theo tournament_id.
     */
    async lockTournamentForActiveRuleWrite(tx, tournamentId) {
        const rows = await tx.$queryRaw `
            SELECT id FROM tournaments WHERE id = ${tournamentId} FOR UPDATE
        `;
        if (rows.length === 0) {
            throw createAppError("NOT_FOUND", `Tournament ${tournamentId} not found`);
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
        // create(): schema đã resolve default cho cả 2 field liên quan -> validate thẳng
        this.validateFormatConsistency(data.format, data.round_robin_stages);
        const rule = await this.prisma.$transaction(async (tx) => {
            if (data.is_active) {
                // Lock trước, rồi mới deactivate + create — mọi request khác cùng
                // tournament_id set is_active=true sẽ phải chờ transaction này commit,
                // nên không thể có 2 rule active cùng lúc kể cả khi race sát nhau.
                await this.lockTournamentForActiveRuleWrite(tx, data.tournament_id);
                await tx.tournamentRule.updateMany({
                    where: { tournament_id: data.tournament_id, is_active: true, deleted_at: null },
                    data: { is_active: false },
                });
            }
            return tx.tournamentRule.create({
                data: {
                    ...data,
                    user_id: userId,
                    tiebreaker_order: JSON.stringify(data.tiebreaker_order),
                },
                ...withRelations,
            });
        });
        return this.mapToDto(rule);
    }
    async update(id, data, force = false) {
        // Luôn fetch current: cần tournament_id để lock đúng hàng, và
        // format/round_robin_stages hiện tại để merge trước khi validate structural.
        const current = await this.prisma.tournamentRule.findUnique({
            where: { id },
            select: { id: true, tournament_id: true, format: true, round_robin_stages: true, is_active: true },
        });
        if (!current)
            throw createAppError("NOT_FOUND", `TournamentRule ${id} not found`);
        // HARD LOCK — tầng khác hẳn CONFLICT bên dưới: season đã qua giai đoạn chuẩn bị
        // (không còn upcoming/registration_open) thì KHÔNG có force nào override được.
        const lockedSeason = await this.prisma.season.findFirst({
            where: {
                tournament_rule_id: id,
                status: { notIn: EDITABLE_SEASON_STATUSES },
            },
            select: { id: true, name: true, status: true },
        });
        if (lockedSeason) {
            throw createAppError("RULE_LOCKED", `TournamentRule ${id}: season "${lockedSeason.name}" đang ở trạng thái ${lockedSeason.status} ` +
                `— rule đã bị khoá, không thể sửa dù có force=true. Hãy tạo TournamentRule mới cho season sau.`);
        }
        const touchesRetroactive = RETROACTIVE_FIELDS.some((f) => data[f] !== undefined);
        const touchesStructural = STRUCTURAL_FIELDS.some((f) => data[f] !== undefined);
        if (touchesStructural) {
            // Merge payload (partial) với DB state hiện tại -> resolved state đầy đủ,
            // rồi mới validate. Đây là chỗ trước đây bị bug: validate thẳng raw partial
            // payload khiến field không gửi lên bị coi là "không cần check".
            const resolvedFormat = data.format ?? current.format;
            const resolvedStages = data.round_robin_stages ?? current.round_robin_stages;
            this.validateFormatConsistency(resolvedFormat, resolvedStages);
        }
        if ((touchesRetroactive || touchesStructural) && !force) {
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
        const rule = await this.prisma.$transaction(async (tx) => {
            if (data.is_active === true && !current.is_active) {
                // Lock trước khi đổi is_active của rule khác — tránh 2 request update
                // 2 rule khác nhau của CÙNG tournament thành active gần như đồng thời.
                await this.lockTournamentForActiveRuleWrite(tx, current.tournament_id);
                await tx.tournamentRule.updateMany({
                    where: {
                        tournament_id: current.tournament_id,
                        is_active: true,
                        deleted_at: null,
                        id: { not: id },
                    },
                    data: { is_active: false },
                });
            }
            return tx.tournamentRule.update({
                where: { id },
                data: {
                    ...data,
                    tiebreaker_order: data.tiebreaker_order
                        ? JSON.stringify(data.tiebreaker_order)
                        : undefined,
                },
                ...withRelations,
            });
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
        const target = await this.prisma.tournamentRule.findUnique({
            where: { id },
            select: { tournament_id: true, deleted_at: true },
        });
        if (!target || target.deleted_at === null) {
            throw createAppError("NOT_FOUND", `TournamentRule ${id} not found or not deleted`);
        }
        // restore() set is_active=true (theo hành vi cũ) -> cũng phải đi qua lock,
        // nếu không rule vừa restore có thể trùng active với rule khác của cùng
        // tournament đang bật sẵn.
        await this.prisma.$transaction(async (tx) => {
            await this.lockTournamentForActiveRuleWrite(tx, target.tournament_id);
            await tx.tournamentRule.updateMany({
                where: {
                    tournament_id: target.tournament_id,
                    is_active: true,
                    deleted_at: null,
                    id: { not: id },
                },
                data: { is_active: false },
            });
            const result = await tx.tournamentRule.updateMany({
                where: { id, deleted_at: { not: null } },
                data: {
                    deleted_at: null,
                    is_active: true,
                },
            });
            if (result.count === 0) {
                throw createAppError("NOT_FOUND", `TournamentRule ${id} not found or not deleted`);
            }
        });
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