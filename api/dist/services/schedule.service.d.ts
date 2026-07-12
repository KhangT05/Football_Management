import { Match, PrismaClient } from '../generated/prisma/client.js';
import { GenerateFromGroupsOptions, GenerateOptions, GenerateResult, MatchByTeamRow, RescheduleInput, ScheduleOptions, SeasonSchedule } from '../types/schedule.type.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
export declare class ScheduleService extends ScheduleEngine {
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Match>>;
    /**
     * FIX (thiếu tên đội/venue/kết quả hiệp phụ-luân lưu/thẻ đỏ-vàng trên
     * card lịch thi đấu công khai): trước đây chỉ findMany() cột thô của
     * Match — không include quan hệ nào, không đếm thẻ. ScheduleMatchCard.jsx
     * (FE) đã code sẵn đầy đủ UI cho các field này (home_team.logo,
     * matchResult.home_penalty_score, home_red_cards...) nhưng luôn nhận
     * undefined vì BE chưa từng trả — bug hoàn toàn ở tầng BE, không phải FE.
     *
     * Giờ:
     *   1. include home_team/away_team/venue/matchResult (đủ cho tên đội,
     *      logo, sân, nhãn "Sau hiệp phụ"/"Luân lưu").
     *   2. Đếm thẻ vàng/đỏ theo từng match bằng 1 groupBy DUY NHẤT trên
     *      matchEvent (không loop query theo từng match — tránh N+1), rồi
     *      gắn phẳng vào từng match dưới dạng home_yellow_cards/
     *      away_yellow_cards/home_red_cards/away_red_cards — đúng shape mà
     *      hasRedCard()/getYellowCount() ở ScheduleMatchCard.jsx đã ưu tiên
     *      đọc (countField trước, fallback events sau).
     */
    findMatchesBySeason(seasonId: number, req?: QueryRequest): Promise<PaginatedResult<Match>>;
    /**
     * Đếm thẻ vàng/đỏ cho 1 batch match bằng 1 groupBy duy nhất trên
     * matchEvent (match_id IN [...]), rồi gắn phẳng field
     * home_yellow_cards/away_yellow_cards/home_red_cards/away_red_cards vào
     * từng match — khớp đúng field name ScheduleMatchCard.jsx (FE) đang ưu
     * tiên đọc trong hasRedCard()/getYellowCount().
     *
     * Không dùng include matchEvent trực tiếp trên match (sẽ kéo theo toàn
     * bộ event list, nặng và không cần thiết chỉ để đếm thẻ).
     */
    private _attachCardCounts;
    findMatchesByTeam(seasonId: number, teamId: number, req?: QueryRequest): Promise<PaginatedResult<MatchByTeamRow>>;
    generateGroupsAndSchedule(seasonId: number, options: GenerateOptions): Promise<GenerateResult>;
    /**
     * NEW: Sinh match round-robin cho các group ĐÃ tồn tại + đã bốc thăm qua
     * GroupService (createGroupsBulk + drawGroups/drawGroupsSeeded), rồi
     * auto-schedule giờ/sân. Dùng cho luồng: admin tạo bảng + bốc thăm trước
     * (GroupDrawUI) → sau đó bấm "Tạo lịch thi đấu" ở ScheduleTab.
     *
     * KHÁC generateGroupsAndSchedule(): method đó tự tạo Phase + Group + tự
     * chia đội (assignTeamsToGroups) và sẽ throw CONFLICT nếu season đã có
     * phase — nên không dùng được sau khi đã bốc thăm thủ công. Method này
     * ngược lại: BẮT BUỘC phải có phase + group + season_team.group_id đã
     * set sẵn, và KHÔNG tự tạo hay tự chia đội.
     *
     * Tiêu chí resolve Phase (format round_robin, type group_stage,
     * is_active true) và tiêu chí lọc season_teams hợp lệ trong group
     * (deleted_at null, is_active true, status approved) được giữ ĐỒNG BỘ
     * với GroupService (getOrCreateRoundRobinPhase / buildGroupsPayload) —
     * để 2 service luôn nhìn cùng 1 Phase/Group, tránh lệch trạng thái.
     */
    generateMatchesFromDrawnGroups(seasonId: number, options: GenerateFromGroupsOptions): Promise<GenerateResult>;
    autoScheduleMatches(seasonId: number, options: ScheduleOptions & {
        allowPastDate?: boolean;
    }): Promise<{
        matchesScheduled: number;
        failedMatchIds: number[];
    }>;
    /**
     * FIX (player-sharing conflict): trước đây chỉ check trùng
     * home_team_id/away_team_id CHÍNH XÁC của match đang reschedule — bỏ sót
     * trường hợp 2 team KHÁC NHAU (khác season, khác giải) nhưng share chung
     * 1 player. Player tham gia nhiều team/nhiều season là hợp lệ theo
     * nghiệp vụ (xem SeasonTeamService) — nhưng khi 2 match cụ thể của 2 team
     * đó rơi đúng cùng khung giờ, đó mới là xung đột thật (player không thể
     * có mặt 2 nơi cùng lúc). Check này KHÔNG giới hạn theo season — cố ý,
     * vì player có thể đá 2 giải khác nhau chạy song song.
     *
     * Toàn bộ hàm chạy trong 1 transaction với lock tuần tự trên match +
     * mọi team liên quan (2 team của match, cộng mọi team khác share player)
     * — đóng race giữa check và write khi 2 request reschedule chạy song
     * song đụng chung 1 phần team set. Không lock được sẽ block chờ, KHÔNG
     * throw ngay — đúng ngữ nghĩa serialize.
     */
    rescheduleMatch(matchId: number, input: RescheduleInput): Promise<void>;
    getSeasonSchedule(seasonId: number): Promise<SeasonSchedule>;
    private resolveGroupCount;
    private assignTeamsToGroups;
    private generateRoundRobin;
    private rotate;
}
//# sourceMappingURL=schedule.service.d.ts.map