import { createAppError } from '../common/app.error.js';
import { PhaseFormat, PhaseStatus, SeasonFormat, } from '../generated/prisma/client.js';
export class CustomPipelineService {
    prisma;
    groupService;
    knockoutService;
    standingsService;
    constructor(prisma, groupService, knockoutService, standingsService) {
        this.prisma = prisma;
        this.groupService = groupService;
        this.knockoutService = knockoutService;
        this.standingsService = standingsService;
    }
    /**
     * Entry point duy nhất — gọi khi admin bấm "Chạy stage tiếp theo" trong
     * màn quản lý season (KHÔNG phải trong wizard — wizard chỉ tạo season,
     * không vận hành pipeline sau đó).
     *
     * fromPhaseId = phase VỪA locked (admin đã tự tay: đá xong RR -> lock
     * qua confirmGroups()+auto-lock-on-schedule-complete, hoặc knockout ->
     * confirmBracket() rồi trận cuối kết thúc). Hàm này KHÔNG tự phát hiện
     * "phase nào vừa xong" — đó là trách nhiệm của tầng gọi (season
     * management UI biết rõ phase nào user đang thao tác).
     */
    async advanceFromPhase(seasonId, fromPhaseId, scheduleOptions) {
        const season = await this.prisma.season.findUnique({
            where: { id: seasonId },
            select: {
                id: true,
                tournamentRule: { select: { format: true, custom_stages: true } },
            },
        });
        if (!season)
            throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
        if (season.tournamentRule?.format !== SeasonFormat.custom)
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} không dùng format 'custom' — pipeline tự động chỉ áp dụng cho format này. ` +
                `4 format chuẩn vận hành qua các API atomic sẵn có (autoScheduleMatches/advanceToNextRoundRobin/ ` +
                `generateKnockoutFromStandings gọi trực tiếp), không cần orchestration.`);
        const stages = this.loadCustomStages(season.tournamentRule.custom_stages);
        const fromPhase = await this.prisma.phase.findUnique({
            where: { id: fromPhaseId },
            select: { id: true, season_id: true, status: true, custom_stage_order: true, format: true },
        });
        if (!fromPhase)
            throw createAppError('NOT_FOUND', `Phase ${fromPhaseId} không tồn tại`);
        if (fromPhase.season_id !== seasonId)
            throw createAppError('VALIDATION_ERROR', `Phase ${fromPhaseId} không thuộc season ${seasonId}`);
        if (fromPhase.custom_stage_order === null)
            throw createAppError('CONFLICT', `Phase ${fromPhaseId} không có custom_stage_order — phase này không được tạo bởi ` +
                `CustomPipelineService (có thể được tạo thủ công qua UI atomic, không nằm trong pipeline khai báo).`);
        if (fromPhase.status !== PhaseStatus.locked)
            throw createAppError('CONFLICT', `Phase ${fromPhaseId} chưa locked (status hiện tại: ${fromPhase.status}) — chỉ advance được ` +
                `sau khi stage hiện tại đã hoàn toàn kết thúc và bị khoá.`);
        const completedOrder = fromPhase.custom_stage_order;
        const childStages = stages.filter(s => s.source_stage_order === completedOrder);
        if (childStages.length === 0) {
            return {
                completedStageOrder: completedOrder,
                startedStages: [],
                warnings: [`Stage order=${completedOrder} không có stage con nào trỏ nguồn về nó — đây có thể là stage cuối cùng của pipeline (giải đã kết thúc), hoặc dữ liệu custom_stages thiếu liên kết.`],
            };
        }
        const startedStages = [];
        const warnings = [];
        for (const stage of childStages) {
            // Idempotency: nếu Phase cho stage.order này đã tồn tại rồi (admin
            // bấm nút 2 lần, hoặc gọi lại sau lỗi giữa chừng), không tạo lại —
            // trả về phase đã có.
            const existingPhase = await this.prisma.phase.findFirst({
                where: { season_id: seasonId, custom_stage_order: stage.order, is_active: true },
                select: { id: true },
            });
            if (existingPhase) {
                startedStages.push({
                    stageOrder: stage.order,
                    stageName: stage.name,
                    stageType: stage.type,
                    phaseId: existingPhase.id,
                    requiresManualAction: false,
                    note: 'Đã tồn tại từ lần advance trước — bỏ qua, không tạo lại (idempotent).',
                });
                continue;
            }
            try {
                if (stage.type === 'round_robin') {
                    const result = await this.startRoundRobinStage(seasonId, fromPhase, stage);
                    startedStages.push(result);
                }
                else if (stage.type === 'knockout') {
                    const result = await this.startKnockoutStage(seasonId, fromPhase, stage, scheduleOptions);
                    startedStages.push(result);
                }
                else {
                    const result = await this.startClassificationStage(seasonId, fromPhase, stage, scheduleOptions);
                    startedStages.push(result);
                }
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                warnings.push(`Stage "${stage.name}" (order=${stage.order}) khởi tạo thất bại: ${msg}`);
            }
        }
        return { completedStageOrder: completedOrder, startedStages, warnings };
    }
    // ─── Stage: round_robin (source là round_robin trước đó, lấy theo rank range) ──
    async startRoundRobinStage(seasonId, fromPhase, stage) {
        if (fromPhase.format !== PhaseFormat.round_robin)
            throw new Error(`Nguồn của stage round_robin "${stage.name}" phải là 1 stage round_robin đã locked ` +
                `(hiện tại phase nguồn có format=${fromPhase.format}) — kiểm tra lại source_stage_order trong custom_stages.`);
        if (!stage.source_rank_range)
            throw new Error(`Stage "${stage.name}" thiếu source_rank_range — không biết lấy đội hạng mấy.`);
        // FIX (an toàn cho orchestration tự động): advanceToNextRoundRobin()
        // đọc thẳng TeamStanding.position mà KHÔNG tự recompute trước (xem
        // group.service.ts) — nó tin snapshot có sẵn là mới nhất, hợp lý khi
        // admin thao tác thủ công qua UI (thường vào xem standings ngay
        // trước khi advance, và flow confirm-kết-quả-trận đâu đó đã
        // recompute rồi). Với orchestration tự động chạy hàng loạt, KHÔNG
        // nên tin ngầm định 1 side-effect nằm ngoài lời gọi trực tiếp —
        // recompute tường minh mọi group nguồn ngay trước khi đọc, để đảm
        // bảo rankRange lấy đúng đội dù trận cuối cùng của group vừa mới
        // được confirm.
        const sourceGroups = await this.prisma.group.findMany({
            where: { phase_id: fromPhase.id, is_active: true },
            select: { id: true },
        });
        for (const g of sourceGroups) {
            await this.standingsService.recomputeGroupStandings(g.id);
        }
        const [from, to] = stage.source_rank_range;
        // advanceToNextRoundRobin() đã tự: lock season, đọc TeamStanding theo
        // rankRange, tạo Phase mới (order = fromPhase.order + 1 — LƯU Ý: đây
        // là "order" nội bộ của GroupService, KHÔNG phải custom_stages order,
        // xem comment ở advanceFromPhase()), tạo group rỗng theo group_count,
        // snake-distribute + assign đội. Ta chỉ cần patch thêm những việc
        // GroupService chưa làm.
        const { newPhaseId } = await this.groupService.advanceToNextRoundRobin(fromPhase.id, stage.group_count, { from, to });
        await this.prisma.phase.update({
            where: { id: newPhaseId },
            data: {
                custom_stage_order: stage.order,
                name: stage.name,
                // advanceToNextRoundRobin() kế thừa teams_advance_per_group từ
                // fromPhase — SAI với custom vì mỗi stage có con số riêng. Ghi
                // đè lại đúng giá trị khai báo trong custom_stages[stage.order].
                teams_advance_per_group: stage.teams_advance_per_group,
            },
        });
        // KHÔNG áp stage.points_per_win/draw/loss ở đây — xem block comment
        // đầu file + phần giải thích cuối file "Điểm số per-stage". Ghi đè
        // 3 field này vào đâu đó hiện KHÔNG có tác dụng vì
        // recomputeGroupStandings() chỉ đọc season.tournamentRule, không đọc
        // theo Phase. Đây là gap thật, cần quyết định schema trước khi làm.
        return {
            stageOrder: stage.order,
            stageName: stage.name,
            stageType: 'round_robin',
            phaseId: newPhaseId,
            requiresManualAction: false,
            note: 'Điểm thắng/hòa/thua riêng của stage này (nếu khai báo khác season-level) CHƯA được áp dụng — xem gap "Điểm số per-stage".',
        };
    }
    // ─── Stage: knockout (source là round_robin, bốc thăm từ standings) ──────────
    async startKnockoutStage(seasonId, fromPhase, stage, scheduleOptions) {
        if (stage.seed_mode === 'manual') {
            // Không có gì để tự động — trả về "cần thao tác thủ công", KHÔNG
            // cố đoán seed. Admin phải tự vào KnockoutUI, chọn seed_mode
            // manual, tick từng đội, generateKnockoutBracket() như bình thường.
            return {
                stageOrder: stage.order,
                stageName: stage.name,
                stageType: 'knockout',
                phaseId: null,
                requiresManualAction: true,
                note: 'seed_mode=manual — vào KnockoutUI, chọn thủ công từng seed rồi generate bracket. Sau khi tạo xong, gọi lại advanceFromPhase với phase knockout đó làm fromPhaseId ở bước tiếp theo trong pipeline (nếu có).',
            };
        }
        if (fromPhase.format !== PhaseFormat.round_robin)
            throw new Error(`Stage knockout "${stage.name}" seed từ standings nhưng nguồn không phải round_robin — ` +
                `chỉ hỗ trợ auto-seed từ bảng xếp hạng round_robin. Đổi seed_mode sang 'manual' nếu nguồn là knockout khác.`);
        const sourceGroups = await this.prisma.group.findMany({
            where: { phase_id: fromPhase.id, is_active: true },
            select: { id: true },
        });
        if (sourceGroups.length === 0)
            throw new Error(`Phase nguồn ${fromPhase.id} không có group nào — không seed được knockout.`);
        // teams_advance_per_group của round_robin nguồn = topN đưa vào
        // knockout (đúng thiết kế: knockout luôn lấy ĐÚNG số đội mà
        // round_robin đã cấu hình "đi tiếp" — không có field riêng nào khác
        // trong custom_stages cho knockout override con số này).
        const sourcePhase = await this.prisma.phase.findUnique({
            where: { id: fromPhase.id },
            select: { teams_advance_per_group: true },
        });
        const topN = sourcePhase?.teams_advance_per_group;
        if (!topN || topN < 1)
            throw new Error(`Phase nguồn ${fromPhase.id} chưa cấu hình teams_advance_per_group hợp lệ.`);
        const mode = stage.seed_mode === 'standing_straight' ? 'straight'
            : stage.seed_mode === 'standing_cross' ? 'cross'
                : 'random';
        // generateKnockoutFromStandings() TỰ recompute standings của mọi
        // groupIds trước khi seed (xem _ensureGroupsReadyAndRecompute trong
        // knockout.service.ts, gọi standingsService.recomputeGroupStandings)
        // — không cần recompute tay như nhánh round_robin ở trên.
        //
        // TODO-CONFIRM: legs cần map từ stage.leg_type ('single_leg' -> 1,
        // 'two_legged' -> 2) — kiểu union number literal 1|2 theo
        // KnockoutGenerateOptions (type file chưa có trong context tôi có,
        // suy từ generateKnockoutBracket() options.legs: 1 | 2). Cast `as any`
        // tạm cho AutoSeedKnockoutOptions vì type đầy đủ chưa có trong context
        // — bỏ khi có type thật.
        const legs = stage.leg_type === 'two_legged' ? 2 : 1;
        const result = await this.knockoutService.generateKnockoutFromStandings({
            seasonId,
            groupIds: sourceGroups.map(g => g.id),
            topN,
            mode,
            legs,
            ...scheduleOptions,
        });
        await this.prisma.phase.update({
            where: { id: result.phaseId },
            data: { custom_stage_order: stage.order, name: stage.name },
        });
        return {
            stageOrder: stage.order,
            stageName: stage.name,
            stageType: 'knockout',
            phaseId: result.phaseId,
            requiresManualAction: false,
            note: result.warnings.length > 0 ? result.warnings.join(' | ') : undefined,
        };
    }
    // ─── Stage: classification (tranh hạng — standing hoặc loser_of_stage) ──────
    async startClassificationStage(seasonId, fromPhase, stage, scheduleOptions) {
        // GAP THẬT, chưa có service method tương ứng ở BE:
        //
        // - source_kind='loser_of_stage': cần "tạo 1 trận độc lập giữa 2 đội
        //   cụ thể, không thuộc cây bracket knockout chuẩn" (VD tranh hạng 3
        //   giữa 2 đội thua bán kết). generateKnockoutBracket()/
        //   generateKnockoutFromStandings() luôn tạo CẢ CÂY bracket
        //   (BracketSlot + advanceWinner…) — không có method tạo 1 trận đơn
        //   lẻ. Cần bổ sung KnockoutService.createStandaloneMatch({
        //   seasonId, phaseType: 'third_place', homeTeamId, awayTeamId, legs
        //   }) mới — hiện KHÔNG tồn tại trong knockout.service.ts đã xem.
        //
        // - source_kind='standing': có thể tái dùng
        //   generateKnockoutFromStandings() (coi tranh hạng như 1 bracket nhỏ),
        //   nhưng ý nghĩa "tranh hạng 5-8" (không phải elimination thật, có
        //   thể chỉ cần xếp hạng cuối theo kết quả, không cần "advance
        //   winner") không khớp 100% với model BracketSlot (thiết kế cho
        //   single/double elimination có khái niệm thắng-tiến-tiếp).
        //
        // Dừng ở đây thay vì đoán mò tạo sai dữ liệu.
        throw new Error(`Stage classification "${stage.name}" (source_kind=${stage.source_kind}) chưa có service method ` +
            `tương ứng ở BE — cần bổ sung KnockoutService.createStandaloneMatch() (cho loser_of_stage) hoặc ` +
            `xác nhận cách generateKnockoutFromStandings được tái dùng cho classification (cho standing).`);
    }
    // ─── Helpers ──────────────────────────────────────────────────────────────
    loadCustomStages(raw) {
        if (!Array.isArray(raw))
            throw createAppError('CONFLICT', 'TournamentRule.custom_stages không hợp lệ (không phải mảng) — kiểm tra lại dữ liệu rule.');
        return raw.map(s => {
            if (typeof s.order !== 'number' || !s.type)
                throw createAppError('CONFLICT', 'Một phần tử trong custom_stages thiếu order/type.');
            return s;
        });
    }
}
//# sourceMappingURL=customPipeline.service.js.map