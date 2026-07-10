import { MatchReportOutput } from '../types/matchReport.type.js';
export declare class MatchReportPdfRenderer {
    private static fontsCache;
    private static fontsError;
    private doc;
    render(report: MatchReportOutput): Promise<Buffer>;
    private static resolveFontDir;
    private static getFonts;
    private fetchImageBuffer;
    private hasSpaceFor;
    private renderHeader;
    private renderScoreBlock;
    private renderEventsTimeline;
    private toEventRow;
    private collectCardEvents;
    private toCardEventRow;
    private eventIcon;
    private renderJerseySwatch;
    private renderTeamSection;
    private drawRow;
    private renderSignatureSection;
    private renderFooter;
}
export declare function renderMatchReportPdf(report: MatchReportOutput): Promise<Buffer>;
//# sourceMappingURL=matchReportPdf.service.d.ts.map