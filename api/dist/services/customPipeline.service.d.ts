import { PrismaClient } from '../generated/prisma/client.js';
import { GroupService } from './group.service.js';
import { KnockoutService } from './knockout.service.js';
import { StandingsService } from './standing.service.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
type CustomStageRoundRobin = {
    order: number;
    type: 'round_robin';
    name: string;
    group_count: number;
    teams_advance_per_group: number;
    points_per_win: number;
    points_per_draw: number;
    points_per_loss: number;
    source_stage_order: number | null;
    source_rank_range: [number, number] | null;
};
type CustomStageKnockout = {
    order: number;
    type: 'knockout';
    name: string;
    source_stage_order: number | null;
    seed_mode: 'standing_straight' | 'standing_cross' | 'standing_random' | 'manual';
    leg_type: 'single_leg' | 'two_legged';
};
type CustomStageClassification = {
    order: number;
    type: 'classification';
    name: string;
    source_stage_order: number;
    source_kind: 'standing' | 'loser_of_stage';
    leg_type: 'single_leg' | 'two_legged';
};
type CustomStage = CustomStageRoundRobin | CustomStageKnockout | CustomStageClassification;
export type AdvancePipelineResult = {
    completedStageOrder: number;
    startedStages: {
        stageOrder: number;
        stageName: string;
        stageType: CustomStage['type'];
        phaseId: number | null;
        requiresManualAction: boolean;
        note?: string;
    }[];
    warnings: string[];
};
export declare class CustomPipelineService {
    private readonly prisma;
    private readonly groupService;
    private readonly knockoutService;
    private readonly standingsService;
    constructor(prisma: PrismaClient, groupService: GroupService, knockoutService: KnockoutService, standingsService: StandingsService);
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
    advanceFromPhase(seasonId: number, fromPhaseId: number, scheduleOptions: OptionalScheduleOptions): Promise<AdvancePipelineResult>;
    private startRoundRobinStage;
    private startKnockoutStage;
    private startClassificationStage;
    private loadCustomStages;
}
export {};
//# sourceMappingURL=customPipeline.service.d.ts.map