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
import { MatchResultService } from '../services/matchresult.service.js';
// FIX: đổi dependency từ MatchReportService (match.report.ts) sang
// MatchResultService — lý do:
//
// 1. Route PDF nhị phân (/matches/{id}/report) đã được mount THỦ CÔNG trong
//    app.ts, đứng TRƯỚC RegisterRoutes(), dùng matchResultService.getMatchReport()
//    + renderMatchReportPdf(). Trong Express, handler đăng ký trước thắng —
//    route @Get('matches/{matchId}/report') tsoa tự sinh ở đây KHÔNG BAO GIỜ
//    được gọi, chỉ tồn tại như dead code gây nhầm lẫn khi đọc/maintain. Đã
//    xoá khỏi controller này, giữ nguyên route thủ công trong app.ts làm 1
//    nguồn sự thật duy nhất cho endpoint PDF.
//
// 2. Route JSON preview (/matches/{id}/report/data) — cái ScheduleTab.jsx
//    (ConfirmExportModal) đang thực sự gọi — trước đây gọi
//    `MatchReportService.buildMatchReport()`, một implementation SONG SONG
//    và KHÔNG ĐỒNG BỘ với MatchResultService.getMatchReport():
//      - buildMatchReport() tính halfTime bằng cách đếm lại MatchEvent theo
//        period=first_half; getMatchReport() đọc thẳng
//        finalize_home_half_time/finalize_away_half_time đã lưu sẵn lúc
//        finalize — 2 nguồn có thể lệch nhau nếu logic tính half-time thay
//        đổi mà chỉ update 1 trong 2 chỗ.
//      - buildMatchReport() không có fallback logo Team khi
//        matchJerseyAssignment rỗng (business hiện tại CHƯA CÓ write path
//        nào ghi bảng này — đã xác nhận qua grep toàn repo), nên preview
//        trả logoUrl: null cho mọi trận, còn getMatchReport() fallback về
//        match.home_team.logo / away_team.logo.
//      - Cả 2 đều dùng chung buildGoalsTimeline()/buildMatchReportPlayerRows()
//        từ match.helper.ts nên phần lineup/goals logic giống nhau, nhưng
//        khác nhau ở nguồn field nêu trên → preview và PDF thật có thể hiện
//        khác nhau cho cùng 1 trận, tuỳ endpoint nào được gọi.
//    Dùng chung matchResultService.getMatchReport() cho cả preview lẫn PDF
//    đảm bảo preview luôn khớp 100% với PDF sẽ xuất ra.
let MatchReportController = class MatchReportController extends tsoa.Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    /**
     * JSON preview — dùng bởi ConfirmExportModal (ScheduleTab.jsx) để hiển
     * thị tỉ số/đội hình/bàn thắng trước khi admin bấm "Xác nhận xuất".
     * Cùng nguồn dữ liệu với PDF export (/matches/{id}/report, mount thủ
     * công trong app.ts) — không tự tính lại field nào ở đây.
     */
    async getMatchReportData(matchId) {
        return this.service.getMatchReport(matchId);
    }
};
__decorate([
    tsoa.Security('jwt', ['organizing']),
    tsoa.Get('matches/{matchId}/report/data'),
    __param(0, tsoa.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchReportController.prototype, "getMatchReportData", null);
MatchReportController = __decorate([
    tsoa.Route(''),
    tsoa.Tags('Match Report'),
    __metadata("design:paramtypes", [MatchResultService])
], MatchReportController);
export { MatchReportController };
//# sourceMappingURL=matchReport.controller.js.map