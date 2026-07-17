import { Controller } from "tsoa";
import { CustomPipelineService } from "../services/customPipeline.service.js";
import type { AdvancePipelineResult } from "../services/customPipeline.service.js";
import * as pipelineSchema from "../dtos/pipeline.schema.js";
export declare class CustomPipelineController extends Controller {
    private readonly pipelineService;
    constructor(pipelineService: CustomPipelineService);
    /**
     * Admin bấm "Chạy stage tiếp theo" trong màn quản lý season (chỉ áp dụng
     * season có TournamentRule.format = 'custom'). fromPhaseId = phase VỪA
     * locked — controller/service KHÔNG tự phát hiện phase nào vừa xong, đó
     * là trách nhiệm của season management UI (xem comment gốc ở
     * CustomPipelineService.advanceFromPhase()).
     *
     * scheduleOptions optional: chỉ cần khi (các) stage con sinh ra là
     * knockout/classification cần venue+thời gian đá. Nếu toàn bộ stage con
     * là round_robin, gửi body {} là đủ.
     *
     * QUAN TRỌNG — luôn trả 200 (trừ lỗi validate season/phase ở đầu hàm,
     * ném qua createAppError → global error middleware xử lý như thường lệ).
     * Từng stage con lỗi (VD classification chưa implement, hoặc knockout
     * seed_mode=manual cần thao tác tay) KHÔNG làm fail cả request — nó nằm
     * trong result.startedStages[].requiresManualAction hoặc result.warnings.
     * FE bắt buộc phải đọc 2 field này để hiển thị đúng trạng thái, không
     * được suy luận "thành công toàn bộ" chỉ từ HTTP status 200.
     */
    advancePipeline(seasonId: number, fromPhaseId: number, body: pipelineSchema.AdvancePipelineDto): Promise<AdvancePipelineResult>;
}
//# sourceMappingURL=customPipeline.controller.d.ts.map