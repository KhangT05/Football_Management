import { z } from 'zod';
import { getFormatMeta, todayStr, newCid, ALL_TIEBREAKERS } from './wizard.constants';

// ---------------------------------------------------------------------------
// Custom stage builder schema
//
// Giữ nguyên model _cid từ bản gốc: mỗi stage có `_cid` (client-only, KHÔNG gửi BE) làm
// khóa tham chiếu ổn định. `source_stage_cid` trỏ tới `_cid` của 1 stage khác thay vì
// index/order số — index dịch chuyển khi thêm/xóa giữa chừng, _cid thì không.
// Convert `_cid` -> `order` số nguyên CHỈ 1 LẦN lúc build payload (xem toApiCustomStages
// trong wizard.mappers.js) — state RHF không bao giờ lưu dạng order.
// ---------------------------------------------------------------------------

const rankRangeSchema = z.tuple([z.number().int().min(1), z.number().int().min(1)])
    .refine(([from, to]) => to >= from, 'Khoảng hạng không hợp lệ');

const baseStageFields = {
    _cid: z.string(),
    name: z.string().trim().min(1, 'Tên stage không được để trống'),
};

export const roundRobinStageSchema = z.object({
    ...baseStageFields,
    type: z.literal('round_robin'),
    group_count: z.number().int().min(1, 'Số bảng phải từ 1 đến 32').max(32, 'Số bảng phải từ 1 đến 32'),
    teams_advance_per_group: z.number().int().min(1, 'Số đội đi tiếp mỗi bảng phải >= 1'),
    points_per_win: z.number().int().min(0, 'Điểm trận không được âm'),
    points_per_draw: z.number().int().min(0, 'Điểm trận không được âm'),
    points_per_loss: z.number().int().min(0, 'Điểm trận không được âm'),
    source_stage_cid: z.string().nullable(),
    source_rank_range: rankRangeSchema.nullable(),
});

export const knockoutStageSchema = z.object({
    ...baseStageFields,
    type: z.literal('knockout'),
    source_stage_cid: z.string().nullable(),
    seed_mode: z.enum(['standing_straight', 'standing_cross', 'standing_random', 'manual']),
    leg_type: z.enum(['single_leg', 'two_legged']),
});

export const classificationStageSchema = z.object({
    ...baseStageFields,
    type: z.literal('classification'),
    source_stage_cid: z.string().nullable(),
    source_kind: z.enum(['standing', 'loser_of_stage']),
    leg_type: z.enum(['single_leg', 'two_legged']),
});

export const customStageSchema = z.discriminatedUnion('type', [
    roundRobinStageSchema,
    knockoutStageSchema,
    classificationStageSchema,
]);

// Mirror validateCustomStagesLocal() bên BE ở mức đủ để chặn lỗi sớm trên FE.
// superRefine thay vì .refine() rời rạc để addIssue với `path` trỏ đúng field/index
// -> RHF hiển thị lỗi ngay dưới stage card tương ứng, không phải lỗi chung chung.
export const customStagesSchema = z.array(customStageSchema)
    .min(1, 'Vui lòng thêm ít nhất 1 stage cho thể thức tùy chỉnh')
    .superRefine((stages, ctx) => {
        if (stages.length === 0) return;
        const names = stages.map(s => s.name.trim().toLowerCase());
        const nameCount = new Map();
        names.forEach(n => nameCount.set(n, (nameCount.get(n) ?? 0) + 1));
        stages.forEach((s, i) => {
            if ((nameCount.get(s.name.trim().toLowerCase()) ?? 0) > 1) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: [i, 'name'], message: 'Tên các stage không được trùng nhau' });
            }
        });

        // if (!['round_robin', 'knockout'].includes(stages[0].type)) {
        //     ctx.addIssue({ code: z.ZodIssueCode.custom, path: [0, 'type'], message: 'Stage đầu tiên phải là "Vòng bảng" hoặc "Loại trực tiếp"' });
        // }
        if (stages[0].source_stage_cid) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [0, 'source_stage_cid'], message: `Stage "${stages[0].name}" là stage đầu tiên, không được có nguồn` });
        }

        const cidToIndex = new Map(stages.map((s, i) => [s._cid, i]));

        stages.forEach((s, i) => {
            if (s.type === 'round_robin') {
                if (i > 0 && s.source_stage_cid) {
                    const srcIdx = cidToIndex.get(s.source_stage_cid);
                    if (srcIdx === undefined || srcIdx >= i) {
                        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [i, 'source_stage_cid'], message: `Stage "${s.name}": nguồn không hợp lệ (phải trỏ về stage đứng trước nó)` });
                        return;
                    }
                    const src = stages[srcIdx];
                    if (!s.source_rank_range) {
                        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [i, 'source_rank_range'], message: `Stage "${s.name}": thiếu khoảng hạng lấy đội` });
                    } else if (src.type === 'round_robin' && s.source_rank_range[1] > src.teams_advance_per_group) {
                        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [i, 'source_rank_range'], message: `Stage "${s.name}": lấy tới hạng ${s.source_rank_range[1]} nhưng nguồn "${src.name}" chỉ cho ${src.teams_advance_per_group} đội đi tiếp/bảng` });
                    }
                }
                return;
            }

            if (i === 0) return; // knockout ở vị trí 0: hợp lệ, không cần nguồn (bốc thăm từ pool đăng ký)

            if (!s.source_stage_cid) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: [i, 'source_stage_cid'], message: `Stage "${s.name}": thiếu stage nguồn` });
                return;
            }
            const srcIdx = cidToIndex.get(s.source_stage_cid);
            if (srcIdx === undefined || srcIdx >= i) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: [i, 'source_stage_cid'], message: `Stage "${s.name}": nguồn không hợp lệ (phải trỏ về stage đứng trước nó)` });
            } else if (s.type === 'classification' && s.source_kind === 'loser_of_stage' && stages[srcIdx].type !== 'knockout') {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: [i, 'source_kind'], message: `Stage "${s.name}": "Đội thua ở stage nguồn" chỉ hợp lệ khi nguồn là Loại trực tiếp` });
            }
        });
    });

export const createDefaultStage = (type, cid, defaultSourceCid, sameTypeCount = 0) => {
    if (type === 'round_robin') {
        return {
            _cid: cid, type: 'round_robin',
            name: sameTypeCount === 0 ? 'Vòng bảng' : `Vòng bảng ${sameTypeCount + 1}`,
            group_count: 4, teams_advance_per_group: 2,
            points_per_win: 3, points_per_draw: 1, points_per_loss: 0,
            source_stage_cid: null, source_rank_range: null,
        };
    }
    if (type === 'knockout') {
        return {
            _cid: cid, type: 'knockout',
            name: sameTypeCount === 0 ? 'Loại trực tiếp' : `Loại trực tiếp ${sameTypeCount + 1}`,
            source_stage_cid: defaultSourceCid,
            seed_mode: 'standing_cross', leg_type: 'single_leg',
        };
    }
    return {
        _cid: cid, type: 'classification',
        name: sameTypeCount === 0 ? 'Tranh hạng 3' : `Tranh hạng ${sameTypeCount + 1}`,
        source_stage_cid: defaultSourceCid, source_kind: 'standing', leg_type: 'single_leg',
    };
};

// ---------------------------------------------------------------------------
// Rule form
// ---------------------------------------------------------------------------

export const ruleFormSchema = z.object({
    name: z.string().trim(), // required-ness phụ thuộc willCreateNewRule -> check ở wizard superRefine
    format: z.enum(['round_robin', 'knockout', 'round_robin_knockout', 'multi_round_robin_knockout', 'custom']),
    round_robin_stages: z.number().int(),
    points_per_win: z.number().int().min(0, 'Điểm trận không được âm'),
    points_per_draw: z.number().int().min(0, 'Điểm trận không được âm'),
    points_per_loss: z.number().int().min(0, 'Điểm trận không được âm'),
    max_players_per_team: z.number().int().min(1, 'Số người tối đa phải >= tối thiểu'),
    min_players_per_team: z.number().int().min(1, 'Số người tối thiểu phải >= 1'),
    suspension_match_count: z.number().int().min(1, 'Số trận treo giò phải >= 1'),
    yellow_cards_suspension: z.number().int().min(1, 'Số thẻ vàng tích lũy phải >= 1'),
    fine_per_yellow_card: z.number().min(0, 'Mức phạt không được âm'),
    fine_per_red_card: z.number().min(0, 'Mức phạt không được âm'),
    forfeit_score: z.number().int().min(0, 'Điểm xử thua không được âm'),
    bonus_per_goal: z.number().min(0, 'Mức thưởng không được âm'),
    bonus_per_assist: z.number().min(0, 'Mức thưởng không được âm'),
    teams_advance_per_group: z.number().int(),
    tiebreaker_order: z.array(z.enum(ALL_TIEBREAKERS)),
    custom_stages: customStagesSchema.or(z.array(customStageSchema).length(0)),
})
    .refine(r => r.max_players_per_team >= r.min_players_per_team, {
        message: 'Số người tối đa phải >= tối thiểu', path: ['max_players_per_team'],
    })
    .superRefine((r, ctx) => {
        const meta = getFormatMeta(r.format);

        if (meta.value === 'custom') {
            // custom_stages.superRefine (bên trên) đã tự add issue với path đúng index khi
            // .or() match nhánh array-1-phần-tử; khi length===0 sẽ fail .min(1) tự động.
            const result = customStagesSchema.safeParse(r.custom_stages);
            if (!result.success) {
                result.error.issues.forEach(issue => ctx.addIssue({ ...issue, path: ['custom_stages', ...issue.path] }));
            }
            return;
        }

        if (meta.hasGroupPhase) {
            if (meta.hasKnockout && r.teams_advance_per_group < 1) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['teams_advance_per_group'], message: 'Số đội đi tiếp mỗi bảng phải >= 1' });
            }
            if (r.tiebreaker_order.length === 0) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['tiebreaker_order'], message: 'Vui lòng chọn ít nhất 1 tiêu chí xếp hạng phụ' });
            }
        }
    });

// ---------------------------------------------------------------------------
// Tournament / Season / Wizard root
// ---------------------------------------------------------------------------

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày không hợp lệ');

export const wizardSchema = z.object({
    tournamentMode: z.enum(['new', 'existing']),
    tournamentNew: z.object({
        name: z.string().trim(),
        description: z.string().optional(),
        logo: z.instanceof(File).nullable(),
    }),
    existingTournamentId: z.string(),

    ruleMode: z.enum(['blank', 'template']),
    ruleSourceId: z.string(), // id của rule template đang chọn làm baseline, '' nếu chưa chọn
    rule: ruleFormSchema,

    groupCount: z.number().int(),

    season: z.object({
        name: z.string().trim().min(1, 'Tên mùa giải không được để trống'),
        start_date: dateStr.or(z.literal('')),
        end_date: dateStr.or(z.literal('')),
        registration_deadline: dateStr.or(z.literal('')),
        max_teams: z.number().int().min(2, 'Số đội tối đa ít nhất là 2'),
        is_registration_open: z.boolean(),
        pitch_type: z.enum(['san_5', 'san_7', 'san_11']),
    }),
})
    .superRefine((w, ctx) => {
        // --- step 1 ---
        if (w.tournamentMode === 'new') {
            if (!w.tournamentNew.name.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['tournamentNew', 'name'], message: 'Tên giải đấu không được để trống' });
            if (!w.tournamentNew.logo) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['tournamentNew', 'logo'], message: 'Vui lòng tải logo cho giải đấu' });
        } else if (!w.existingTournamentId) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['existingTournamentId'], message: 'Vui lòng chọn một giải đấu' });
        }

        // --- step 2 ---
        if (w.ruleMode === 'template' && !w.ruleSourceId) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ruleSourceId'], message: 'Vui lòng chọn một rule template làm baseline' });
        }
        const willCreateNewRule = w.ruleMode === 'blank' || w.ruleMode === 'template'; // dirty-check thật nằm ở component (so với snapshot) — ở đây chỉ validate field name khi có form hiển thị
        if (willCreateNewRule && !w.rule.name.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['rule', 'name'], message: 'Vui lòng nhập tên rule' });
        }

        const meta = getFormatMeta(w.rule.format);
        const isCustom = meta.value === 'custom';
        const hasGroupPhase = isCustom ? false : meta.hasGroupPhase;

        // --- step 3 (chỉ áp dụng khi format có group phase chuẩn, không phải custom) ---
        if (hasGroupPhase && (w.groupCount < 1 || w.groupCount > 32)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['groupCount'], message: 'Số lượng bảng đấu phải từ 1 đến 32' });
        }

        // --- step 4 ---
        const today = todayStr();
        if (!w.season.start_date || !w.season.end_date) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['season', 'start_date'], message: 'Vui lòng chọn ngày bắt đầu và kết thúc' });
        }
        if (!w.season.registration_deadline) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['season', 'registration_deadline'], message: 'Vui lòng chọn hạn chót đăng ký' });
        }
        if (w.season.start_date && w.season.start_date < today) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['season', 'start_date'], message: 'Ngày bắt đầu không được ở quá khứ' });
        }
        if (w.season.registration_deadline && w.season.registration_deadline < today) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['season', 'registration_deadline'], message: 'Hạn đăng ký không được ở quá khứ' });
        }
        if (w.season.registration_deadline && w.season.start_date && w.season.registration_deadline >= w.season.start_date) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['season', 'registration_deadline'], message: 'Hạn đăng ký phải trước ngày bắt đầu, không được trùng ngày' });
        }
        if (w.season.end_date && w.season.start_date && w.season.end_date < w.season.start_date) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['season', 'end_date'], message: 'Ngày kết thúc phải sau ngày bắt đầu' });
        }
        if (hasGroupPhase && w.season.max_teams < w.groupCount) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['season', 'max_teams'], message: `Số đội tối đa (${w.season.max_teams}) phải >= số lượng bảng đấu (${w.groupCount})` });
        }
    });

export const defaultRuleForm = {
    name: '', format: 'round_robin_knockout', round_robin_stages: 1,
    points_per_win: 3, points_per_draw: 1, points_per_loss: 0,
    max_players_per_team: 11, min_players_per_team: 7,
    suspension_match_count: 1, yellow_cards_suspension: 3,
    fine_per_yellow_card: 0, fine_per_red_card: 0, forfeit_score: 3,
    bonus_per_goal: 0, bonus_per_assist: 0, teams_advance_per_group: 2,
    tiebreaker_order: ['goal_diff', 'goals_scored', 'head_to_head'],
    custom_stages: [],
};

export const defaultWizardValues = {
    tournamentMode: 'new',
    tournamentNew: { name: '', description: '', logo: null },
    existingTournamentId: '',
    ruleMode: 'blank',
    ruleSourceId: '',
    rule: defaultRuleForm,
    groupCount: 4,
    season: {
        name: '', start_date: '', end_date: '', registration_deadline: '',
        max_teams: 16, is_registration_open: true, pitch_type: 'san_5',
    },
};

export const seedInitialCustomStage = () => [createDefaultStage('round_robin', newCid(), null, 0)];