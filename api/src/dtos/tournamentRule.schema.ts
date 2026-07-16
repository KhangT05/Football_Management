import { z } from "zod";



export interface TournamentRuleDto {
    id: number;
    tournament_id: number;
    name: string;
    is_active: boolean;
    points_per_win: number;
    points_per_draw: number;
    format: SeasonFormat;
    points_per_loss: number;
    forfeit_score: number;
    suspension_match_count: number;
    fine_per_yellow_card: number;
    fine_per_red_card: number;
    bonus_per_goal: number;
    bonus_per_assist: number;
    yellow_cards_suspension: number;
    max_players_per_team: number;
    min_players_per_team: number;
    teams_advance_per_group: number;
    tiebreaker_order: TiebreakerOption[];
    custom_stages: StageConfig[] | null; // NEW — thiếu ở bản trước, chỉ tồn tại khi format = "custom"
    created_at: Date;
    round_robin_stages: number;
    updated_at: Date | null;
    deleted_at: Date | null; // NEW — model có soft-delete, DTO phải expose để FE biết trạng thái
    user?: { id: number; name: string; email: string; phone: string | null } | null;
    tournament?: { id: number; name: string } | null;
}

interface BaseStage {
    order: number;
    name: string;
}

interface RoundRobinStage extends BaseStage {
    type: "round_robin";
    group_count: number;
    teams_advance_per_group: number;
    points_per_win: number;
    points_per_draw: number;
    points_per_loss: number;
    source_stage_order: number | null;
    source_rank_range: { from: number; to: number } | null;
}
export interface CreateTournamentRuleRequest {
    tournament_id: number;
    name?: string;
    points_per_win?: number;
    points_per_draw?: number;
    points_per_loss?: number;
    forfeit_score?: number;
    suspension_match_count?: number;
    yellow_cards_suspension?: number;
    fine_per_yellow_card?: number;
    fine_per_red_card?: number;
    bonus_per_goal?: number;
    bonus_per_assist?: number;
    max_players_per_team?: number;
    min_players_per_team?: number;
    teams_advance_per_group?: number;
    round_robin_stages?: number;
    format?: SeasonFormat;
    is_active?: boolean;
    tiebreaker_order?: TiebreakerOption[];
    custom_stages?: StageConfig[] | null;
}

export type UpdateTournamentRuleRequest = Partial<CreateTournamentRuleRequest>;

interface KnockoutStage extends BaseStage {
    type: "knockout";
    source_stage_order: number | null;
    seed_mode: "standing_straight" | "standing_cross" | "standing_random" | "manual";
    leg_type: "single_leg" | "two_legged";
}

interface ClassificationStage extends BaseStage {
    type: "classification";
    source_stage_order: number;
    source_kind: "loser_of_stage" | "standing";
    leg_type: "single_leg" | "two_legged";
}


export const TIEBREAKER_OPTIONS = [
    "goal_diff",
    "goals_scored",
    "head_to_head",
    "goals_conceded",
    "yellow_cards",
    "red_cards",
] as const;

export const SEASON_FORMATS = [
    "round_robin",
    "knockout",
    "round_robin_knockout",
    "multi_round_robin_knockout",
    "custom",
] as const;

// format nào có bảng xếp hạng round-robin thật sự (teams_advance_per_group / tiebreaker_order có ý nghĩa).
// "custom" không nằm trong list này vì stage nào là round_robin do custom_stages[].type quyết định,
// không phải field top-level teams_advance_per_group/tiebreaker_order.
const ROUND_ROBIN_BASED_FORMATS: SeasonFormat[] = [
    "round_robin",
    "round_robin_knockout",
    "multi_round_robin_knockout",
];

export type SeasonFormat = (typeof SEASON_FORMATS)[number];
export type TiebreakerOption = (typeof TIEBREAKER_OPTIONS)[number];



const baseStage = z.object({
    order: z.number().int().min(0),
    name: z.string().min(1).max(100), // hiển thị trên UI vận hành, vd "Vòng bảng", "Bán kết", "Tranh hạng 3"
});

const rankRangeSchema = z.object({
    from: z.number().int().min(1),
    to: z.number().int().min(1),
});

const roundRobinStageSchema = baseStage.extend({
    type: z.literal("round_robin"),
    group_count: z.number().int().min(1).max(32),
    teams_advance_per_group: z.number().int().min(1),
    points_per_win: z.number().int().min(0),
    points_per_draw: z.number().int().min(0),
    points_per_loss: z.number().int().min(0),
    // null nếu là stage đầu tiên (lấy toàn bộ approved team),
    // hoặc trỏ tới order của 1 stage trước để lấy đội advance ra từ đó
    source_stage_order: z.number().int().min(0).nullable(),
    source_rank_range: rankRangeSchema.nullable(),
});

const knockoutStageSchema = baseStage.extend({
    type: z.literal("knockout"),
    // source_stage_order đổi thành nullable — cho phép knockout ở order=0 (bốc thăm trực tiếp
    // từ pool đăng ký, không cần vòng bảng trước)
    source_stage_order: z.number().int().min(0).nullable(),
    seed_mode: z.enum(["standing_straight", "standing_cross", "standing_random", "manual"]),
    leg_type: z.enum(["single_leg", "two_legged"]),
});

const classificationStageSchema = baseStage.extend({
    type: z.literal("classification"), // tranh hạng — vd hạng 3-4
    source_stage_order: z.number().int().min(0),
    source_kind: z.enum(["loser_of_stage", "standing"]),
    leg_type: z.enum(["single_leg", "two_legged"]),
});

export const stageConfigSchema = z.discriminatedUnion("type", [
    roundRobinStageSchema,
    knockoutStageSchema,
    classificationStageSchema,
]);
// guard chống lệch giữa zod schema và static type — build sẽ fail nếu 2 bên khác nhau
type Expect<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type _StageConfigInSync = Expect<Equal<z.infer<typeof stageConfigSchema>, StageConfig>>;

export const customStagesSchema = z
    .array(stageConfigSchema)
    .min(1)
    .max(10)
    .superRefine((stages, ctx) => {
        const orderCount = new Map<number, number>();
        stages.forEach((s) => orderCount.set(s.order, (orderCount.get(s.order) ?? 0) + 1));

        stages.forEach((s, i) => {
            if ((orderCount.get(s.order) ?? 0) > 1) {
                ctx.addIssue({ code: "custom", path: [i, "order"], message: `order=${s.order} bị trùng` });
            }

            // Stage đầu (order=0): round_robin hoặc knockout, source phải null
            if (s.order === 0) {
                if (s.source_stage_order != null) {
                    ctx.addIssue({ code: "custom", path: [i, "source_stage_order"], message: "Stage đầu tiên không được có source_stage_order" });
                }
                return;
            }

            if (s.type === "round_robin" && s.source_stage_order == null) return; // pool mới — hợp lệ

            const sourceOrder = s.source_stage_order;
            const sourceStage = stages.find((x) => x.order === sourceOrder);

            if (sourceOrder == null || !sourceStage || sourceOrder >= s.order) {
                ctx.addIssue({ code: "custom", path: [i, "source_stage_order"], message: "source_stage_order phải trỏ tới order nhỏ hơn và tồn tại" });
                return;
            }

            if (s.type === "round_robin") {
                if (!s.source_rank_range) {
                    ctx.addIssue({ code: "custom", path: [i, "source_rank_range"], message: "source_rank_range bắt buộc khi có source_stage_order" });
                } else if (sourceStage.type === "round_robin" && s.source_rank_range.to > sourceStage.teams_advance_per_group) {
                    ctx.addIssue({ code: "custom", path: [i, "source_rank_range"], message: `Hạng lấy vượt quá teams_advance_per_group (${sourceStage.teams_advance_per_group}) của stage nguồn` });
                }
            }

            if (s.type === "classification" && s.source_kind === "loser_of_stage" && sourceStage.type !== "knockout") {
                ctx.addIssue({ code: "custom", path: [i, "source_kind"], message: "loser_of_stage chỉ hợp lệ khi source là knockout" });
            }
        });
    });

// ---------- tournament_rule ----------

const tournamentRuleBaseSchema = z.object({
    tournament_id: z.number().int().positive(),
    name: z.string().trim().min(1).max(100).default("Default Rule"),
    points_per_win: z.number().int().min(0).max(10).default(3),
    points_per_draw: z.number().int().min(0).max(10).default(1),
    points_per_loss: z.number().int().min(0).max(10).default(0),
    forfeit_score: z.number().int().min(0).max(20).default(3),
    suspension_match_count: z.number().int().min(1).max(20).default(1),
    yellow_cards_suspension: z.number().int().min(1).max(10).default(3),
    fine_per_yellow_card: z.number().min(0).max(99_999_999.99).default(0),
    fine_per_red_card: z.number().min(0).max(99_999_999.99).default(0),
    bonus_per_goal: z.number().min(0).max(99_999_999.99).default(0),
    bonus_per_assist: z.number().min(0).max(99_999_999.99).default(0),
    max_players_per_team: z.number().int().min(1).max(50).default(25),
    min_players_per_team: z.number().int().min(1).max(50).default(11),
    // chỉ có ý nghĩa khi format thuộc ROUND_ROBIN_BASED_FORMATS; với "knockout"/"custom" field này
    // vẫn tồn tại vì DB không nullable, nhưng bị service layer bỏ qua — xem note dưới createTournamentRuleSchema.
    // min(0) thay vì min(1): knockout/custom gửi 0 hợp lệ — service layer bỏ qua giá trị này.
    teams_advance_per_group: z.number().int().min(0).default(2),
    round_robin_stages: z.number().int().min(0).max(50).default(1),
    format: z.enum(SEASON_FORMATS).default("round_robin_knockout"),
    is_active: z.boolean().default(true),
    // min(0) thay vì min(1): format knockout/custom không có vòng bảng nên không cần tiêu chí
    // xếp hạng — FE gửi [] là hợp lệ. Service layer bỏ qua field này khi format không có group.
    tiebreaker_order: z
        .array(z.enum(TIEBREAKER_OPTIONS))
        .min(0)
        .default(["goal_diff", "goals_scored", "head_to_head"]),
    // required khi format="custom", cấm khi format khác — validate ở superRefine bên dưới
    custom_stages: customStagesSchema.nullish(),
});

function validateCrossFields(
    data: Partial<z.infer<typeof tournamentRuleBaseSchema>>,
    ctx: z.RefinementCtx,
    { partial }: { partial: boolean }
) {
    // max >= min — chỉ check khi cả 2 field có mặt (luôn đúng ở create vì có default)
    if (
        data.max_players_per_team !== undefined &&
        data.min_players_per_team !== undefined &&
        data.max_players_per_team < data.min_players_per_team
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["max_players_per_team"],
            message: "max_players_per_team phải >= min_players_per_team",
        });
    }

    // custom_stages bắt buộc <-> format
    // ở update: chỉ enforce khi field format thực sự có mặt trong payload (partial),
    // vì đổi custom_stages mà không đổi format phải được validate ở service layer (biết format hiện tại trong DB)
    if (!partial || data.format !== undefined) {
        const isCustom = data.format === "custom";
        if (isCustom && (!data.custom_stages || data.custom_stages.length === 0)) {
            ctx.addIssue({
                code: "custom",
                path: ["custom_stages"],
                message: "custom_stages bắt buộc và không được rỗng khi format='custom'",
            });
        }
        if (!isCustom && data.custom_stages) {
            ctx.addIssue({
                code: "custom",
                path: ["custom_stages"],
                message: "custom_stages chỉ hợp lệ khi format='custom', xoá field này nếu dùng format khác",
            });
        }
    }
}

export const createTournamentRuleSchema = tournamentRuleBaseSchema.superRefine((data, ctx) =>
    validateCrossFields(data, ctx, { partial: false })
);

// Update: chỉ validate nếu field liên quan có mặt trong payload.
// Nếu chỉ 1 trong 2 field (max/min, hoặc format/custom_stages) được gửi, so sánh với giá trị
// hiện tại trong DB phải làm ở service layer (giống pattern format/round_robin_stages hiện có
// trong TournamentRuleService).
export const updateTournamentRuleSchema = tournamentRuleBaseSchema
    .partial()
    .superRefine((data, ctx) => validateCrossFields(data, ctx, { partial: true }));

export type CreateTournamentRuleInput = z.input<typeof createTournamentRuleSchema>;
export type UpdateTournamentRuleInput = z.input<typeof updateTournamentRuleSchema>;
export type CreateTournamentRuleDto = z.output<typeof createTournamentRuleSchema>;
export type UpdateTournamentRuleDto = z.output<typeof updateTournamentRuleSchema>;
export type StageConfig = RoundRobinStage | KnockoutStage | ClassificationStage;