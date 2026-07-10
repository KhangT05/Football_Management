import * as tsoa from 'tsoa';
import { MatchReportOutput } from '../types/matchReport.type.js';
import { MatchReportService } from '../services/match.report.js';
export declare class MatchReportController extends tsoa.Controller {
    private service;
    constructor(service: MatchReportService);
    /**
     * Trả PDF binary trực tiếp — dùng @Res thay vì return value thường vì
     * tsoa mặc định serialize return value thành JSON, không phù hợp cho
     * binary response. Content-Disposition: attachment để frontend
     * (axios responseType: 'blob') tự động trigger download với filename
     * đúng — xem extractFilename() ở ScheduleTab.jsx đọc header này.
     */
    getMatchReport(matchId: number, pdfResponse: tsoa.TsoaResponse<200, Buffer, {
        'Content-Type': string;
        'Content-Disposition': string;
    }>): Promise<void>;
    /**
     * JSON preview — tách riêng khỏi PDF export để frontend có thể render
     * preview trước khi admin bấm "Xác nhận xuất" (ConfirmExportModal hiện
     * tại chỉ hiện lại data đã có sẵn trong match list, chưa gọi endpoint
     * này; optional nếu muốn preview đầy đủ lineup/goals trước khi export).
     */
    getMatchReportData(matchId: number): Promise<MatchReportOutput>;
}
//# sourceMappingURL=matchReport.controller.d.ts.map