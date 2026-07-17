import {
    Controller,
    Path,
    Tags,
    Route,
    Post,
    Body,
    Security,
} from "tsoa";
import { CustomPipelineService } from "../services/customPipeline.service.js";
import type { AdvancePipelineResult } from "../services/customPipeline.service.js";
import * as pipelineSchema from "../dtos/pipeline.schema.js";

// ─── Controller ─────────────────────────────────────────────────────────────
// Route: /seasons/:seasonId/pipeline/*
//
// Chỉ có 1 endpoint: advance. Không có endpoint "preview stage tiếp theo"
// hay "list pipeline" — season management UI tự đọc TournamentRule.custom_stages
// (đã có sẵn qua tournamentRuleApi) để render, controller này chỉ lo phần
// THỰC THI (tạo Phase/Group/Bracket mới).
//
// Auth: admin + organizing — cùng tier với confirmOfficial/forfeitMatch bên
// MatchController (đều là action tạo dữ liệu chính thức, có side-effect lớn
// lên standings/bracket).
@Route("seasons")
@Tags("CustomPipeline")
export class CustomPipelineController extends Controller {
    constructor(
        private readonly pipelineService: CustomPipelineService,
    ) {
        super();
    }

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
    @Security("jwt", ["admin", "organizing"])
    @Post("{seasonId}/pipeline/advance/{fromPhaseId}")
    async advancePipeline(
        @Path() seasonId: number,
        @Path() fromPhaseId: number,
        @Body() body: pipelineSchema.AdvancePipelineDto,
    ): Promise<AdvancePipelineResult> {
        const scheduleOptions = pipelineSchema.AdvancePipelineSchema.parse(body);
        return this.pipelineService.advanceFromPhase(seasonId, fromPhaseId, scheduleOptions);
    }
}