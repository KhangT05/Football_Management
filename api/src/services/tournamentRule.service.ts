// tournamentRule.service.ts
import { createAppError } from "../common/app.error.js";
import { parseJsonField } from "../common/prisma.utils.js";
import {
    CreateTournamentRuleDto,
    TIEBREAKER_OPTIONS,
    TiebreakerOption,
    TournamentRuleDto,
    UpdateTournamentRuleDto
} from "../dtos/tournamentRule.schema.js";
import { MatchResultStatus, Prisma, PrismaClient } from "../generated/prisma/client.js";

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

export class TournamentRuleService {
    constructor(private readonly prisma: PrismaClient) {
    }

    private mapToDto(rule: TournamentRuleWithRelations): TournamentRuleDto {
        return {
            ...rule,
            tiebreaker_order: parseJsonField(rule.tiebreaker_order, isTiebreakerArray, ["goal_diff"]),
        };
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

    /**
     * FIX (Medium #5): update() gọi JSON.stringify(tiebreaker_order) trước khi ghi
     * (cột lưu string, mapToDto parse lại qua parseJsonField). create() trước đây
     * ghi thẳng ...data (array) vào cùng cột — inconsistent. Nếu cột là String,
     * create() ghi sai type; nếu cột là Json, update() đang double-encode. Đồng bộ
     * theo hướng update() (stringify thủ công) vì mapToDto parse như đọc string.
     * Return type sửa từ CreateTournamentRuleDto → TournamentRuleDto cho khớp giá
     * trị thực trả về (mapToDto trả full object + relations).
     */
    async create(data: CreateTournamentRuleDto, userId: number): Promise<TournamentRuleDto> {
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

    async update(id: number, data: UpdateTournamentRuleDto, force = false): Promise<TournamentRuleDto> {
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
                throw createAppError(
                    "CONFLICT",
                    `TournamentRule ${id}: tournament đã có match official — đổi points_per_win/draw/loss ` +
                    `hoặc yellow_cards_suspension sẽ rewrite retroactive standings/suspension đã tính ` +
                    `(recomputeGroupStandings và _recomputeStatsForPlayers full-scan, không snapshot). ` +
                    `Tạo season/rule mới, hoặc gọi lại với force=true nếu chủ đích đổi hồi tố.`,
                );
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
}