import { createAppError } from "../common/app.error.js";
import { parseJsonField } from "../common/prisma.utils.js";
import {
    CreateTournamentRuleDto,
    TIEBREAKER_OPTIONS,
    TiebreakerOption,
    TournamentRuleDto,
    UpdateTournamentRuleDto
} from "../dtos/tournamentRule.schema.js";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";

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

    async create(data: CreateTournamentRuleDto, userId: number): Promise<CreateTournamentRuleDto> {
        const rule = await this.prisma.tournamentRule.create({
            data: { ...data, user_id: userId },
            ...withRelations,
        });
        return this.mapToDto(rule);
    }

    async update(id: number, data: UpdateTournamentRuleDto): Promise<TournamentRuleDto> {
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
}