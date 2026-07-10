import * as tsoa from 'tsoa';
import { MatchReportOutput } from '../types/matchReport.type.js';
import { MatchReportService } from '../services/match.report.js';

@tsoa.Route('')
@tsoa.Tags('Match Report')
export class MatchReportController extends tsoa.Controller {
    constructor(private service: MatchReportService) {
        super();
    }

    /**
     * Trả PDF binary trực tiếp — dùng @Res thay vì return value thường vì
     * tsoa mặc định serialize return value thành JSON, không phù hợp cho
     * binary response. Content-Disposition: attachment để frontend
     * (axios responseType: 'blob') tự động trigger download với filename
     * đúng — xem extractFilename() ở ScheduleTab.jsx đọc header này.
     */
    @tsoa.Security('jwt', ['admin'])
    @tsoa.Get('matches/{matchId}/report')
    async getMatchReport(
        @tsoa.Path() matchId: number,
        @tsoa.Res() pdfResponse: tsoa.TsoaResponse<200, Buffer, { 'Content-Type': string; 'Content-Disposition': string }>,
    ): Promise<void> {
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
    @tsoa.Security('jwt', ['admin'])
    @tsoa.Get('matches/{matchId}/report/data')
    async getMatchReportData(@tsoa.Path() matchId: number): Promise<MatchReportOutput> {
        return this.service.buildMatchReport(matchId);
    }
}