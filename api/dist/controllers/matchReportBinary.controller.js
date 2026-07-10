import { renderMatchReportPdf } from '../services/matchReportPdf.service.js';
/**
 * Class thường — KHÔNG dùng tsoa @Route/@Get decorator, vì mọi return value
 * qua tsoa decorator bị routes.ts tự sinh gọi response.json(data), kể cả
 * Buffer cũng bị JSON.stringify sai thành {"type":"Buffer","data":[...]}.
 * Route này được mount thủ công trong app.ts, đứng trước RegisterRoutes.
 */
export class MatchReportBinaryController {
    matchResultService;
    constructor(matchResultService) {
        this.matchResultService = matchResultService;
    }
    async download(req, res) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ status: false, message: 'id không hợp lệ' });
            return;
        }
        try {
            const report = await this.matchResultService.getMatchReport(id);
            const pdfBuffer = await renderMatchReportPdf(report);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="BienBanTranDau_${id}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            res.status(200).send(pdfBuffer);
        }
        catch (err) {
            const status = typeof err?.statusCode === 'number' ? err.statusCode : 500;
            const message = err?.message ?? 'Không thể tạo biên bản trận đấu';
            console.error(`[MatchReportBinaryController] report failed for match ${id}:`, err);
            res.status(status).json({ status: false, message });
        }
    }
}
//# sourceMappingURL=matchReportBinary.controller.js.map