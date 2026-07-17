var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Path, Tags, Route, Post, Body, Security, } from "tsoa";
import { CustomPipelineService } from "../services/customPipeline.service.js";
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
let CustomPipelineController = class CustomPipelineController extends Controller {
    pipelineService;
    constructor(pipelineService) {
        super();
        this.pipelineService = pipelineService;
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
    async advancePipeline(seasonId, fromPhaseId, body) {
        const scheduleOptions = pipelineSchema.AdvancePipelineSchema.parse(body);
        return this.pipelineService.advanceFromPhase(seasonId, fromPhaseId, scheduleOptions);
    }
};
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Post("{seasonId}/pipeline/advance/{fromPhaseId}"),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], CustomPipelineController.prototype, "advancePipeline", null);
CustomPipelineController = __decorate([
    Route("seasons"),
    Tags("CustomPipeline"),
    __metadata("design:paramtypes", [CustomPipelineService])
], CustomPipelineController);
export { CustomPipelineController };
//# sourceMappingURL=customPipeline.controller.js.map