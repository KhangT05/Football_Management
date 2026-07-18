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
    /**
     * Nguồn định dạng phút DUY NHẤT trong file này — trước đây bị viết tay
     * lại ngay trong loop render (ternary trùng logic với
     * `formatMinuteLabel()` đã export sẵn ở match.helper.ts). Không gọi
     * thẳng `formatMinuteLabel` vì signature của nó yêu cầu nguyên object
     * `MatchReportGoalEntry` (kèm isOwnGoal/playerName/clockTime không liên
     * quan) — card events không có shape đó. Định nghĩa local 1 lần, dùng
     * lại cho cả goal lẫn card, để KHÔNG còn 2 chỗ tự quyết định format phút
     * khác nhau trong cùng file.
     */
    private formatMinute;
    /**
     * Giờ thực — cùng công thức với `formatClockLabel()` (match.helper.ts)
     * nhưng nhận thẳng (clockTime, clockConfidence) thay vì cả object
     * `MatchReportGoalEntry`, để card events (không có object đó) vẫn gọi
     * được nếu sau này match.helper.ts được mở rộng để tính clock cho thẻ.
     */
    private formatClock;
    private buildTimelineEntry;
    private goalToTimelineEntry;
    private collectCardEntries;
    /**
     * Vẽ badge màu bằng vector (rect/circle), KHÔNG dùng ký tự emoji —
     * đảm bảo hiển thị được bất kể font active có glyph emoji hay không.
     * Reset fillColor về đen sau khi vẽ — nếu không, `doc.text()` gọi ngay
     * sau đó (tên cầu thủ) sẽ bị nhuộm màu badge cuối cùng đã vẽ (cùng loại
     * bug mà `renderJerseySwatch()` trong file này đã né bằng cách reset
     * tương tự).
     */
    private drawEventBadge;
    private renderEventLegend;
    private renderEventsTimeline;
    private renderJerseySwatch;
    private renderTeamSection;
    private drawRow;
    private renderSignatureSection;
    private renderFooter;
}
export declare function renderMatchReportPdf(report: MatchReportOutput): Promise<Buffer>;
//# sourceMappingURL=matchReportPdf.service.d.ts.map