import { createAppError } from "../common/app.error.js";
import { parseJsonField } from "../common/prisma.utils.js";
import {
    CreateTournamentRuleDto,
    TIEBREAKER_OPTIONS,
    TiebreakerOption,
    TournamentRuleDto,
    UpdateTournamentRuleDto
} from "../dtos/tournamentRule.schema.js";
import { MatchResultStatus, Prisma, PrismaClient, SeasonFormat } from "../generated/prisma/client.js";

const withRelations = {
    include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        tournament: { select: { id: true, name: true } },
    },
} satisfies Prisma.TournamentRuleFindManyArgs;

type TournamentRuleWithRelations = Prisma.TournamentRuleGetPayload<typeof withRelations>;

const TIEBREAKER_SET = new Set<string>(TIEBREAKER_OPTIONS);
const isTiebreakerArray = (v: unknown): v is TiebreakerOption[] =>
    Array.isArray(v) && v.every((x) => TIEBREAKER_SET.has(x));

const RETROACTIVE_FIELDS = [
    "points_per_win",
    "points_per_draw",
    "points_per_loss",
    "yellow_cards_suspension",
] as const satisfies readonly (keyof UpdateTournamentRuleDto)[];

const STRUCTURAL_FIELDS = [
    "format",
    "round_robin_stages",
] as const satisfies readonly (keyof UpdateTournamentRuleDto)[];

export class TournamentRuleService {
    constructor(private readonly prisma: PrismaClient) {
    }

    private mapToDto(rule: TournamentRuleWithRelations): TournamentRuleDto {
        return {
            ...rule,
            tiebreaker_order: parseJsonField(rule.tiebreaker_order, isTiebreakerArray, ["goal_diff"]),
        };
    }

    /**
     * DUY NHẤT nơi chứa business rule: format <-> round_robin_stages.
     * Nhận full resolved state (không phải partial) — caller chịu trách nhiệm
     * merge payload với DB hiện tại trước khi gọi (xem update()).
     */
    private validateFormatConsistency(
        format: SeasonFormat,
        round_robin_stages: number
    ): void {
        switch (format) {
            case SeasonFormat.knockout:
                if (round_robin_stages !== 0) {
                    throw createAppError(
                        "VALIDATION_ERROR",
                        "format = knockout (không có vòng bảng) yêu cầu round_robin_stages = 0"
                    );
                }
                break;

            case SeasonFormat.round_robin_knockout:
                if (round_robin_stages !== 1) {
                    throw createAppError(
                        "VALIDATION_ERROR",
                        "format = round_robin_knockout yêu cầu round_robin_stages = 1"
                    );
                }
                break;

            case SeasonFormat.multi_round_robin_knockout:
                if (round_robin_stages < 2) {
                    throw createAppError(
                        "VALIDATION_ERROR",
                        "format = multi_round_robin_knockout yêu cầu round_robin_stages >= 2"
                    );
                }
                break;

            case SeasonFormat.round_robin:
                if (round_robin_stages < 1) {
                    throw createAppError(
                        "VALIDATION_ERROR",
                        "format = round_robin yêu cầu round_robin_stages >= 1"
                    );
                }
                break;
        }
    }

    async findAll(): Promise<TournamentRuleDto[]> {
        const rules = await this.prisma.tournamentRule.findMany(withRelations);
        return rules.map((r) => this.mapToDto(r));
    }

    async findByIdOrFail(id: number): Promise<TournamentRuleDto> {
        const rule = await this.prisma.tournamentRule.findUnique({
            where: { id },
            ...withRelations,
        });
        if (!rule) throw createAppError("NOT_FOUND", `TournamentRule ${id} not found`);
        return this.mapToDto(rule);
    }

    async create(data: CreateTournamentRuleDto, userId: number): Promise<TournamentRuleDto> {
        // create(): schema đã resolve default cho cả 2 field liên quan -> validate thẳng
        this.validateFormatConsistency(data.format, data.round_robin_stages);

        const rule = await this.prisma.tournamentRule.create({
            data: {
                ...data,
                user_id: userId,
                tiebreaker_order: JSON.stringify(data.tiebreaker_order),
            },
            ...withRelations,
        });
        return this.mapToDto(rule);
    }

    async update(id: number, data: UpdateTournamentRuleDto, force = false): Promise<TournamentRuleDto> {
        const touchesRetroactive = RETROACTIVE_FIELDS.some((f) => data[f] !== undefined);
        const touchesStructural = STRUCTURAL_FIELDS.some((f) => data[f] !== undefined);

        let current: { id: number; format: SeasonFormat; round_robin_stages: number } | null = null;

        if (touchesRetroactive || touchesStructural) {
            current = await this.prisma.tournamentRule.findUnique({
                where: { id },
                select: { id: true, format: true, round_robin_stages: true },
            });
            if (!current)
                throw createAppError("NOT_FOUND", `TournamentRule ${id} not found`);
        }

        if (touchesStructural) {
            // Merge payload (partial) với DB state hiện tại -> resolved state đầy đủ,
            // rồi mới validate. Đây là chỗ trước đây bị bug: validate thẳng raw partial
            // payload khiến field không gửi lên bị coi là "không cần check".
            const resolvedFormat = data.format ?? current!.format;
            const resolvedStages = data.round_robin_stages ?? current!.round_robin_stages;
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
                    throw createAppError(
                        "CONFLICT",
                        `TournamentRule ${id}: (các) season đang dùng rule này đã có match official — đổi ` +
                        `points_per_win/draw/loss hoặc yellow_cards_suspension sẽ rewrite retroactive ` +
                        `standings/suspension đã tính (recomputeGroupStandings và _recomputeStatsForPlayers ` +
                        `full-scan, không snapshot). Tạo season/rule mới, hoặc gọi lại với force=true nếu chủ ` +
                        `đích đổi hồi tố.`,
                    );
                }
            }

            if (touchesStructural) {
                const hasAnyPhase = await this.prisma.phase.findFirst({
                    where: { season: { tournament_rule_id: id } },
                    select: { id: true },
                });
                if (hasAnyPhase) {
                    throw createAppError(
                        "CONFLICT",
                        `TournamentRule ${id}: đã có season dùng rule này để sinh phase — không thể ` +
                        `đổi format/round_robin_stages vì sẽ làm lệch cấu trúc bracket/group đã tạo. ` +
                        `Tạo TournamentRule mới cho season sau thay vì sửa rule này.`,
                    );
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

    async softDelete(id: number): Promise<void> {
        await this.prisma.tournamentRule.update({
            where: { id },
            data: {
                is_active: false,
                deleted_at: new Date()
            },
        });
    }

    async restore(id: number): Promise<TournamentRuleDto> {
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

    async listByTournament(tournamentId: number): Promise<TournamentRuleDto[]> {
        const rules = await this.prisma.tournamentRule.findMany({
            where: { tournament_id: tournamentId, is_active: true, deleted_at: null },
            ...withRelations,
        });
        return rules.map(r => this.mapToDto(r));
    }
}