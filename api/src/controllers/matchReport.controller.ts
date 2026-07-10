import * as tsoa from 'tsoa';
import { MatchReportOutput } from '../types/matchReport.type.js';
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
@tsoa.Route('')
@tsoa.Tags('Match Report')
export class MatchReportController extends tsoa.Controller {
    constructor(private service: MatchResultService) {
        super();
    }

    /**
     * JSON preview — dùng bởi ConfirmExportModal (ScheduleTab.jsx) để hiển
     * thị tỉ số/đội hình/bàn thắng trước khi admin bấm "Xác nhận xuất".
     * Cùng nguồn dữ liệu với PDF export (/matches/{id}/report, mount thủ
     * công trong app.ts) — không tự tính lại field nào ở đây.
     */
    @tsoa.Security('jwt', ['admin'])
    @tsoa.Get('matches/{matchId}/report/data')
    async getMatchReportData(@tsoa.Path() matchId: number): Promise<MatchReportOutput> {
        return this.service.getMatchReport(matchId);
    }
}