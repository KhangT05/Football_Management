import { Controller } from "tsoa";
import { MatchLifecycleService, AddEventInput, EditEventInput, EditScoreInput } from "../services/match.service.js";
import { MatchResultService } from "../services/matchresult.service.js";
import { MatchPeriod } from "../generated/prisma/client.js";
import { FinalizeMatchInput, ManualScoreInput, RecordEventInput, ResolveAppealInput } from "../types/match.type.js";
import { ConfirmResultOutput } from "../types/matchResult.type.js";
import { ScheduleOptions } from "../types/schedule.type.js";
interface TransitionPeriodBody {
    period: MatchPeriod;
}
interface RecordEventBody extends RecordEventInput {
}
interface FinalizeMatchBody extends FinalizeMatchInput {
}
interface ManualScoreBody extends ManualScoreInput {
}
interface ScheduleOptionsBody extends ScheduleOptions {
}
interface ForfeitMatchBody {
    forfeitingTeamId: number;
    scheduleOptions: ScheduleOptions;
}
interface AbandonMatchBody {
    minute: number;
    reason?: string;
}
interface FileDisputeBody {
    reason: string;
}
interface ResolveAppealBody extends ResolveAppealInput {
}
interface AddEventBody extends AddEventInput {
    period: MatchPeriod;
}
interface EditEventBody extends EditEventInput {
}
interface EditScoreBody extends EditScoreInput {
}
export declare class MatchController extends Controller {
    private readonly lifecycleService;
    private readonly matchResultService;
    constructor(lifecycleService: MatchLifecycleService, matchResultService: MatchResultService);
    /**
     * Bắt đầu trận đấu — chuyển scheduled → ongoing.
     * Khởi tạo home_score/away_score = 0, current_period = first_half.
     */
    startMatch(id: number): Promise<void>;
    /**
     * Chuyển period (first_half → second_half → extra_time_first...).
     * Validate transition hợp lệ theo PERIOD_TRANSITIONS map.
     */
    transitionPeriod(id: number, body: TransitionPeriodBody): Promise<void>;
    /**
     * Ghi nhận event trong trận (goal, thẻ, thay người...).
     * Cho phép nhập khi ongoing hoặc pending_official (grace period 15p).
     */
    recordEvent(id: number, body: RecordEventBody): Promise<void>;
    /**
     * Referee bấm kết thúc trận — chuyển ongoing → pending_official (grace period 15p).
     * KHÔNG tạo MatchResult. MatchResult chỉ tạo tại confirmOfficial.
     * Lưu referee input (resultType, penalty, half-time) để dùng lại khi confirm.
     */
    finalizeMatch(id: number, body: FinalizeMatchBody & {
        scheduleOptions: ScheduleOptions;
    }): Promise<void>;
    /**
     * Nhập tay kết quả — fallback khi referee không dùng app (giải nhỏ).
     * Reject nếu match đã có events. Manual path → needs_review sau timeout.
     */
    submitManualScore(id: number, body: ManualScoreBody & {
        scheduleOptions: ScheduleOptions;
    }): Promise<void>;
    /**
     * Xác nhận kết quả chính thức sau grace period.
     * Event path: compute score từ toàn bộ events.
     * Manual path: dùng manual_home_score / manual_away_score.
     * Tạo MatchResult, update standings, advance knockout bracket nếu có.
     */
    confirmOfficial(id: number, body: ScheduleOptionsBody): Promise<ConfirmResultOutput>;
    /**
     * Xử phạt thua cuộc (forfeit / walkover) — BTC quyết định.
     * Bypass grace period, tạo MatchResult trực tiếp.
     * walkover = scheduled + team không xuất hiện.
     * forfeit  = ongoing/finished + team bỏ cuộc / vi phạm.
     */
    forfeitMatch(id: number, body: ForfeitMatchBody): Promise<ConfirmResultOutput>;
    /**
     * Dừng trận giữa chừng (thời tiết, bạo lực...).
     * Match chuyển sang abandoned, không tạo MatchResult.
     */
    abandonMatch(id: number, body: AbandonMatchBody): Promise<void>;
    /**
     * File khiếu nại — chỉ khi MatchResult.status = official.
     * Chuyển → under_review.
     */
    fileAppeal(id: number, body: FileDisputeBody): Promise<void>;
    /**
     * File phản đối chính thức — chỉ khi MatchResult.status = official.
     * Chuyển → protested.
     */
    fileProtest(id: number, body: FileDisputeBody): Promise<void>;
    /**
     * Giải quyết khiếu nại / phản đối.
     * uphold   = giữ nguyên kết quả → official.
     * overturn = đảo ngược kết quả → overturned + recompute standings.
     * Knockout overturn chưa hỗ trợ tự động (bracket đã advance).
     */
    resolveAppeal(id: number, body: ResolveAppealBody): Promise<void>;
    /**
     * Thêm event bị sót sau khi match finished.
     * Chỉ trong 15p kể từ played_at. period bắt buộc.
     * Tự recompute MatchResult sau khi thêm.
     */
    addEvent(id: number, body: AddEventBody & {
        scheduleOptions: ScheduleOptions;
    }): Promise<void>;
    /**
     * Xóa event nhập sai sau khi match finished.
     * Chỉ trong 15p kể từ played_at.
     * Tự recompute MatchResult sau khi xóa.
     */
    deleteEvent(id: number, eventId: number, body: ScheduleOptionsBody): Promise<void>;
    /**
     * Sửa event (minute, type, player, period, note) sau khi match finished.
     * Chỉ trong 15p kể từ played_at. Partial patch — chỉ field được truyền.
     * Tự recompute MatchResult sau khi sửa.
     */
    editEvent(id: number, eventId: number, body: EditEventBody & {
        scheduleOptions: ScheduleOptions;
    }): Promise<void>;
    /**
     * Override score trực tiếp — chỉ dùng cho manual path (match không có events).
     * Chỉ trong 15p kể từ played_at.
     * Reject nếu match có events → dùng addEvent/deleteEvent/editEvent thay thế.
     */
    editScore(id: number, body: EditScoreBody & {
        scheduleOptions: ScheduleOptions;
    }): Promise<void>;
}
export {};
//# sourceMappingURL=match.controller.d.ts.map