import { MatchResultType, MatchStatus } from '../generated/prisma/client.js';
// MatchResult.status sau khi confirm — mặc định là official
// forfeit/walkover → forfeited (Match.status = forfeited, không qua pending_official)
// full_time/extra_time/penalty → finished (qua pending_official → confirmOfficial)
// Các type không có trong map → MatchStatus.finished (default trong confirmResult)
export const STATUS_BY_RESULT_TYPE = {
    [MatchResultType.forfeit]: MatchStatus.forfeited,
    [MatchResultType.walkover]: MatchStatus.forfeited,
    // full_time/extra_time/penalty không list ở đây → caller dùng MatchStatus.finished
};
//# sourceMappingURL=matchResult.type.js.map