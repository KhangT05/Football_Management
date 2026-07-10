import { MatchReportOutput } from '../types/matchReport.type.js';
export declare class MatchReportPdfRenderer {
    private static fontsCache;
    private static fontsError;
    private doc;
    render(report: MatchReportOutput): Promise<Buffer>;
    private static resolveFontDir;
    private static getFonts;
    private fetchImageBuffer;
    private renderHeader;
    private renderScoreBlock;
    private renderGoalsTimeline;
    private formatGoalLabel;
    private renderJerseySwatch;
    private renderTeamSection;
    private drawRow;
    private renderSignatureSection;
    private renderFooter;
}
export declare function renderMatchReportPdf(report: MatchReportOutput): Promise<Buffer>;
//# sourceMappingURL=matchReportPdf.service.d.ts.map