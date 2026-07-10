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
import * as tsoa from 'tsoa';
import { MatchReportService } from '../services/match.report.js';
let MatchReportController = class MatchReportController extends tsoa.Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    /**
     * Trả PDF binary trực tiếp — dùng @Res thay vì return value thường vì
     * tsoa mặc định serialize return value thành JSON, không phù hợp cho
     * binary response. Content-Disposition: attachment để frontend
     * (axios responseType: 'blob') tự động trigger download với filename
     * đúng — xem extractFilename() ở ScheduleTab.jsx đọc header này.
     */
    async getMatchReport(matchId, pdfResponse) {
        const pdfBuffer = await this.service.renderMatchReportPdf(matchId);
        pdfResponse(200, pdfBuffer, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="BienBanTranDau_${matchId}.pdf"`,
        });
    }
    /**
     * JSON preview — tách riêng khỏi PDF export để frontend có thể render
     * preview trước khi admin bấm "Xác nhận xuất" (ConfirmExportModal hiện
     * tại chỉ hiện lại data đã có sẵn trong match list, chưa gọi endpoint
     * này; optional nếu muốn preview đầy đủ lineup/goals trước khi export).
     */
    async getMatchReportData(matchId) {
        return this.service.buildMatchReport(matchId);
    }
};
__decorate([
    tsoa.Security('jwt', ['admin']),
    tsoa.Get('matches/{matchId}/report'),
    __param(0, tsoa.Path()),
    __param(1, tsoa.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Function]),
    __metadata("design:returntype", Promise)
], MatchReportController.prototype, "getMatchReport", null);
__decorate([
    tsoa.Security('jwt', ['admin']),
    tsoa.Get('matches/{matchId}/report/data'),
    __param(0, tsoa.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchReportController.prototype, "getMatchReportData", null);
MatchReportController = __decorate([
    tsoa.Route(''),
    tsoa.Tags('Match Report'),
    __metadata("design:paramtypes", [MatchReportService])
], MatchReportController);
export { MatchReportController };
//# sourceMappingURL=matchReport.controller.js.map