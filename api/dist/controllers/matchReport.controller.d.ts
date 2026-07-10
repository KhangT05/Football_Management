import * as tsoa from 'tsoa';
import { MatchReportOutput } from '../types/matchReport.type.js';
import { MatchResultService } from '../services/matchresult.service.js';
export declare class MatchReportController extends tsoa.Controller {
    private service;
    constructor(service: MatchResultService);
    /**
     * JSON preview — dùng bởi ConfirmExportModal (ScheduleTab.jsx) để hiển
     * thị tỉ số/đội hình/bàn thắng trước khi admin bấm "Xác nhận xuất".
     * Cùng nguồn dữ liệu với PDF export (/matches/{id}/report, mount thủ
     * công trong app.ts) — không tự tính lại field nào ở đây.
     */
    getMatchReportData(matchId: number): Promise<MatchReportOutput>;
}
//# sourceMappingURL=matchReport.controller.d.ts.map