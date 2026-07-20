import { createAppError } from "../common/app.error.js";
import { ApprovalStatus, SeasonStatus, SeasonTeamStatus } from "../generated/prisma/client.js";
import { Queryable } from "../libs/queryable.js";
// Manual transition map — admin có thể bấm tay ở BẤT KỲ bước nào trong
// vòng đời bình thường, kể cả ongoing/finished (VD giải sẵn sàng sớm hơn dự
// kiến, hoặc bấm bù nếu cron chưa kịp chạy). Đây không phải lối đi loại trừ
// cron (SeasonService.runAutoTransitions) — cả 2 cùng dẫn tới cùng 1
// service.update() nên luôn nhất quán, và đều idempotent: season đã
// 'ongoing' thì không match điều kiện WHERE của cron nữa, cũng không pass
// validateStatusTransition nếu admin bấm lại.
const STATUS_TRANSITIONS = {
    [SeasonStatus.upcoming]: [SeasonStatus.registration_open, SeasonStatus.cancelled],
    [SeasonStatus.registration_open]: [SeasonStatus.ongoing, SeasonStatus.cancelled],
    [SeasonStatus.ongoing]: [SeasonStatus.finished, SeasonStatus.cancelled],
    [SeasonStatus.finished]: [],
    [SeasonStatus.cancelled]: [],
};
const CANCELLABLE_FROM = [
    SeasonStatus.upcoming,
    SeasonStatus.registration_open,
    SeasonStatus.ongoing,
];
// Field-level edit policy theo status. 'full' = mọi field trong UpdateSeasonDto.
// 'bank' = chỉ 3 field ngân hàng (sửa nhầm số TK/tên chủ TK giữa giải là nhu
// cầu thật, KHÔNG đồng nghĩa cho sửa thể lệ/ngày tháng giữa giải đang chạy).
// finished/cancelled không match status nào bên dưới → immutable.
const FULLY_EDITABLE_STATUSES = [
    SeasonStatus.upcoming,
    SeasonStatus.registration_open,
];
const BANK_ONLY_EDITABLE_STATUSES = [SeasonStatus.ongoing];
const BANK_FIELDS = ['bank_id', 'bank_account_no', 'bank_account_name'];
// Season_team status coi là "sẽ thi đấu thật" trong season — dùng để tính
// sĩ số roster tối thiểu. pending KHÔNG tính (chưa được duyệt tham gia,
// không có nghĩa vụ đủ quân số); withdrawn/eliminated cũng không tính (đã
// rời hoặc bị loại).
const ROSTER_CHECK_SEASON_TEAM_STATUSES = [
    SeasonTeamStatus.approved,
    SeasonTeamStatus.active,
];
export class SeasonService {
    prisma;
    groupService;
    query;
    constructor(prisma, groupService) {
        this.prisma = prisma;
        this.groupService = groupService;
        this.query = new Queryable(prisma.season, {
            searchFields: ["name", "description"],
            sortable: ["id", "name", "created_at"],
            defaultSort: { column: "id", direction: "asc" },
            filterable: ["is_active", "status"],
            defaultPerPage: 20,
            maxPerPage: 100,
            beforeBuild: (where) => {
                where.push({ deleted_at: null });
            },
        });
    }
    findAll(req = {}) {
        return this.query.run(req, {
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true }
                },
            }
        });
    }
    async findByIdOrFail(id) {
        const season = await this.prisma.season.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true }
                },
                tournament: true
            }
        });
        if (!season)
            throw createAppError('NOT_FOUND', `Season ${id} not found`);
        return season;
    }
    /**
     * FIX (stage 3 → stage 4 wizard): CreateSeasonDto.group_count (nếu có,
     * dùng cho flow round_robin nhập số group TRƯỚC khi season tồn tại) kích
     * hoạt GroupService.createEmptyRoundRobinGroups trong CÙNG transaction
     * với season insert — tạo Phase round_robin + N group RỖNG ngay. Team
     * approve sau tự fill dần (SeasonTeamService.approve/adminAdd gọi
     * GroupService.autoAssignApprovedTeamToGroup). group_count optional —
     * không truyền vẫn dùng được flow cũ (createGroupsBulk/drawGroups thủ
     * công sau khi có team).
     *
     * is_registration_open set tường minh false — season luôn khởi tạo
     * 'upcoming', field is_registration_open tách riêng khỏi status enum
     * (xem updateStatus/cancel) nên phải đồng bộ ngay từ create(), không để
     * default cột tự lo.
     */
    async create(data, userId) {
        this.validateDateRelationships(data.start_date, data.end_date, data.registration_deadline);
        this.validateFutureIfProvided(data.start_date, data.registration_deadline);
        const rule = await this.prisma.tournamentRule.findUnique({ where: { id: data.tournament_rule_id } });
        if (!rule)
            throw createAppError('NOT_FOUND', `TournamentRule ${data.tournament_rule_id} not found`);
        if (rule.tournament_id !== data.tournament_id)
            throw createAppError('VALIDATION_ERROR', `Rule ${data.tournament_rule_id} không thuộc tournament ${data.tournament_id}`);
        const { group_count, ...seasonData } = data;
        return this.prisma.$transaction(async (tx) => {
            const season = await tx.season.create({
                data: {
                    ...seasonData,
                    user_id: userId,
                    status: SeasonStatus.upcoming,
                    description: data.description ?? null,
                    start_date: data.start_date ?? null,
                    end_date: data.end_date ?? null,
                    registration_deadline: data.registration_deadline ?? null,
                    is_registration_open: false,
                },
            });
            if (group_count && group_count > 0) {
                await this.groupService.createEmptyRoundRobinGroups(tx, season.id, group_count);
            }
            return season;
        });
    }
    /**
     * FIX (field-level authorization hole): trước đây validateStatusAllowsEdit
     * là no-op — update() nhận và ghi mọi field trong UpdateSeasonDto ở BẤT KỲ
     * status nào, kể cả 'finished'/'cancelled'. FE chỉ ẩn nút Edit (cosmetic),
     * gọi thẳng API vẫn sửa được toàn bộ. Giờ dùng filterUpdatableFields để
     * chặn ở tầng service — 'ongoing' chỉ cho sửa 3 field bank (fix sai sót
     * nhập liệu, KHÔNG cho đổi thể lệ/ngày tháng giữa giải đang chạy);
     * 'finished'/'cancelled' không match policy nào → reject toàn bộ.
     *
     * Nếu payload gửi lên toàn field KHÔNG được phép ở status hiện tại (VD FE
     * cũ vẫn gửi full payload cho season 'ongoing'), throw ngay thay vì âm
     * thầm no-op 200 — tránh admin tưởng đã lưu nhưng thực ra bị silently
     * ignore (đây là kiểu lỗi UX y hệt bankAllOrNothing đang tránh ở schema).
     */
    async update(id, data) {
        const existing = await this.findByIdOrFail(id);
        const allowed = this.filterUpdatableFields(existing.status, data);
        if (Object.keys(allowed).length === 0) {
            throw createAppError('VALIDATION_ERROR', `Season đang ở trạng thái '${existing.status}', không có field nào trong request được phép cập nhật.`);
        }
        const start_date = allowed.start_date ?? existing.start_date;
        const end_date = allowed.end_date ?? existing.end_date;
        const registration_deadline = allowed.registration_deadline ?? existing.registration_deadline;
        this.validateDateRelationships(start_date, end_date, registration_deadline);
        // future check chỉ trên field được gửi lên trong request — không suy ra
        // từ existing (season cũ có start_date đã qua vẫn phải edit được bình
        // thường, miễn không đổi start_date sang một mốc quá khứ mới).
        this.validateFutureIfProvided(allowed.start_date, allowed.registration_deadline);
        return this.prisma.season.update({
            where: { id },
            data: {
                ...allowed,
                start_date: start_date ?? undefined,
                end_date: end_date ?? undefined,
                registration_deadline: registration_deadline ?? undefined,
            },
        });
    }
    async cancel(id, data) {
        const existing = await this.findByIdOrFail(id);
        if (!CANCELLABLE_FROM.includes(existing.status)) {
            throw createAppError('VALIDATION_ERROR', `Không thể hủy season đang ở trạng thái '${existing.status}'.`);
        }
        return this.prisma.season.update({
            where: { id },
            data: {
                status: SeasonStatus.cancelled,
                is_active: false,
                is_registration_open: false,
                cancel_reason: data.cancel_reason,
            },
        });
    }
    /**
     * FIX (is_registration_open dead field): schema có is_registration_open
     * TÁCH RIÊNG khỏi status enum, nhưng trước đây chỉ status được update —
     * is_registration_open giữ nguyên default (false) vĩnh viễn, kể cả khi
     * status đã chuyển sang 'registration_open'. Bất kỳ query/filter nào
     * dùng is_registration_open thay vì status (rất dễ xảy ra vì tên field
     * gợi ý đúng mục đích đó) sẽ luôn ra sai — season đang mở đăng ký vẫn bị
     * lọc ra ngoài. Set field này bám sát theo status transition ngay tại
     * đây, không để 2 nguồn sự thật (status vs is_registration_open) lệch nhau.
     *
     * FIX (roster tối thiểu — bug mới phát hiện): tournament_rule.min_players_per_team
     * tồn tại trong schema nhưng trước đây KHÔNG được đọc ở đâu cả. Season
     * có thể chuyển 'ongoing' với 1 team chỉ có 2 cầu thủ đã approved —
     * assertRosterMinimums() chặn NGAY TRƯỚC autoFinalizeGroups, liệt kê rõ
     * team nào thiếu quân số thay vì để lộ ra muộn khi tạo match/lineup.
     * Đặt trước autoFinalizeGroups vì đây là check rẻ (đếm), nên fail sớm
     * trước khi tốn công re-draw group.
     *
     * FIX (auto-finalize groups khi đóng đăng ký): trước đây chuyển sang
     * 'ongoing' không đụng gì tới group cả — nếu season được tạo sẵn N group
     * rỗng (flow group_count lúc create) mà số team approved thực tế THẤP
     * HƠN NHIỀU so với dự kiến ban đầu (VD dự kiến 22 team/2 group nhưng chỉ
     * có 3 team đăng ký), season vẫn chuyển 'ongoing' bình thường và để lại
     * group với 1-2 team — vô nghĩa với thể thức round_robin, không ai được
     * cảnh báo. Gọi groupService.autoFinalizeGroups NGAY TRƯỚC khi update
     * status — tính lại số group cho khớp team thực tế và re-draw, hoặc
     * throw CONFLICT nếu team quá ít để tổ chức (chặn hẳn việc chuyển
     * 'ongoing' trong trường hợp đó thay vì âm thầm để lại group hỏng).
     *
     * Lưu ý: đây là NHIỀU thao tác riêng (assertRosterMinimums đọc thuần,
     * autoFinalizeGroups tự mở transaction, season.update là 1 statement
     * rời) — không atomic tuyệt đối, nhưng chấp nhận được vì đây là thao
     * tác admin tần suất thấp; nếu 1 bước throw, các bước sau không chạy
     * nên không có state nửa vời (status vẫn giữ nguyên registration_open).
     */
    /**
     * Manual — admin bấm tay ở bất kỳ transition hợp lệ nào trong
     * STATUS_TRANSITIONS, kể cả ongoing/finished. Route/controller validate
     * qua UpdateSeasonStatusSchema (loại 'cancelled' — đi qua cancel() riêng
     * với cancel_reason bắt buộc).
     *
     * Idempotent với cron: nếu cron đã tự chuyển season sang 'ongoing' rồi,
     * admin bấm lại 'ongoing' sẽ fail ở validateStatusTransition (vì
     * STATUS_TRANSITIONS['ongoing'] không chứa 'ongoing') — không có race
     * gây double-processing (autoFinalizeGroups chạy đúng 1 lần).
     */
    async updateStatus(id, newStatus) {
        const existing = await this.findByIdOrFail(id);
        this.validateStatusTransition(existing.status, newStatus);
        this.validateStatusPreConditions(existing, newStatus);
        if (newStatus === SeasonStatus.ongoing) {
            return this.activateSeason(existing);
        }
        return this.prisma.season.update({
            where: { id },
            data: {
                status: newStatus,
                is_registration_open: newStatus === SeasonStatus.registration_open,
                ...(newStatus === SeasonStatus.finished && { is_active: false }),
            },
        });
    }
    /**
     * FIX (chung logic ongoing-transition giữa updateStatus manual và cron):
     * trước đây updateStatus() và runAutoTransitions() mỗi bên tự viết lại
     * chuỗi "check roster -> finalize groups -> update status", dẫn tới rủi
     * ro 1 bên được vá (VD thêm assertRosterMinimums) còn bên kia bị bỏ
     * quên. Gộp về 1 hàm duy nhất — cả 2 entrypoint đều gọi qua đây, đảm
     * bảo luôn nhất quán.
     */
    async activateSeason(existing) {
        await this.assertRosterMinimums(existing.id, existing.tournament_rule_id);
        // Chốt group theo số team approved thực tế trước khi khoá
        // registration — no-op nếu season không dùng flow group-based.
        await this.groupService.autoFinalizeGroups(existing.id);
        return this.prisma.season.update({
            where: { id: existing.id },
            data: {
                status: SeasonStatus.ongoing,
                is_registration_open: false,
            },
        });
    }
    /**
     * FIX (roster tối thiểu): so sánh số TeamPlayer approved của mỗi
     * season_team (status approved/active — xem ROSTER_CHECK_SEASON_TEAM_STATUSES)
     * với tournament_rule.min_players_per_team. Season chưa gán rule
     * (tournament_rule_id null) -> bỏ qua, không phải lỗi (dù trong thực tế
     * create() luôn bắt buộc rule, giữ nhánh này cho an toàn/migration-safe).
     *
     * Throw liệt kê TÊN team thiếu quân số — admin cần biết ngay đội nào,
     * không chỉ biết "có lỗi", để xử lý (bổ sung cầu thủ hoặc rút team đó).
     */
    async assertRosterMinimums(seasonId, tournamentRuleId) {
        if (tournamentRuleId == null)
            return;
        const rule = await this.prisma.tournamentRule.findUnique({
            where: { id: tournamentRuleId },
            select: { min_players_per_team: true },
        });
        if (!rule)
            return;
        const seasonTeams = await this.prisma.seasonTeam.findMany({
            where: {
                season_id: seasonId,
                status: { in: ROSTER_CHECK_SEASON_TEAM_STATUSES },
                deleted_at: null,
            },
            select: {
                team: { select: { name: true } },
                _count: {
                    select: {
                        team_players: { where: { approval_status: ApprovalStatus.approved } },
                    },
                },
            },
        });
        const violations = seasonTeams.filter((st) => st._count.team_players < rule.min_players_per_team);
        if (violations.length > 0) {
            const names = violations.map((v) => v.team.name).join(', ');
            throw createAppError('VALIDATION_ERROR', `Không thể mở giải: các đội sau chưa đủ tối thiểu ${rule.min_players_per_team} cầu thủ (theo tournament rule) — ${names}`);
        }
    }
    /**
     * Cron entry point — bổ sung SONG SONG với updateStatus() manual ở trên,
     * không thay thế. Wire vào scheduler (node-cron, BullMQ repeatable job,
     * hoặc pg_cron) chạy mỗi vài phút:
     *
     *   cron.schedule('*\/5 * * * *', () => seasonService.runAutoTransitions());
     *
     * Mục đích: bấm HỘ nếu tới ngày mà chưa admin nào bấm tay. Nếu admin đã
     * bấm tay trước đó rồi thì season không còn match điều kiện WHERE
     * (status đã đổi) → cron bỏ qua, không double-process. Idempotent theo
     * cách chạy trễ/lặp không gây lệch state.
     *
     * FIX: registration_open -> ongoing giờ đi qua activateSeason() dùng
     * chung với updateStatus() — bao gồm cả assertRosterMinimums(). Trước
     * đây cron gọi thẳng autoFinalizeGroups + season.update, bỏ qua hoàn
     * toàn check roster tối thiểu (season có thể tự động mở dù có team
     * thiếu quân số, chỉ path admin bấm tay mới được bảo vệ — bug do 2 nơi
     * viết code trùng lặp, giờ không còn nữa).
     */
    async runAutoTransitions() {
        const now = new Date();
        const failed = [];
        // registration_open → ongoing khi start_date đã tới. Không dùng
        // updateMany vì mỗi season cần activateSeason() riêng (query DB, có
        // thể throw VALIDATION_ERROR/CONFLICT cho từng season) — không phải
        // bulk UPDATE thuần.
        const dueToStart = await this.prisma.season.findMany({
            where: { status: SeasonStatus.registration_open, start_date: { lte: now } },
        });
        let toOngoing = 0;
        for (const season of dueToStart) {
            try {
                await this.activateSeason(season);
                toOngoing++;
            }
            catch (err) {
                // 1 season lỗi (VD quá ít team để chia group, hoặc có team
                // chưa đủ quân số) không được chặn cron xử lý các season còn
                // lại. Season lỗi vẫn giữ nguyên 'registration_open' quá hạn
                // start_date — cần alert riêng (tối thiểu log ở đây, nên nối
                // thêm kênh cảnh báo thật khi có infra, VD Sentry/Slack
                // webhook), admin vẫn có thể vào bấm tay updateStatus() để
                // xử lý thủ công case lỗi này.
                failed.push(season.id);
                console.error(`[SeasonAutoTransition] season ${season.id} failed to auto-start:`, err);
            }
        }
        // ongoing → finished khi end_date đã tới. Bulk update thuần, không
        // có side-effect nào khác cần per-row transaction.
        const dueToFinish = await this.prisma.season.findMany({
            where: { status: SeasonStatus.ongoing, end_date: { lte: now } },
            select: { id: true },
        });
        if (dueToFinish.length > 0) {
            await this.prisma.season.updateMany({
                where: { id: { in: dueToFinish.map(s => s.id) } },
                data: { status: SeasonStatus.finished, is_active: false },
            });
        }
        return { toOngoing, toFinished: dueToFinish.length, failed };
    }
    async softDelete(id) {
        const existing = await this.findByIdOrFail(id);
        this.validateStatusAllowsDelete(existing.status);
        await this.prisma.season.update({
            where: { id },
            data: { is_active: false, deleted_at: new Date() },
        });
    }
    // ─── Private ────────────────────────────────────────────────
    /**
     * Trả về subset của `data` mà status hiện tại được phép ghi. Đây là
     * single source of truth cho field-level permission — FE chỉ dùng để
     * render UI, còn enforcement thật nằm ở đây.
     */
    filterUpdatableFields(status, data) {
        if (FULLY_EDITABLE_STATUSES.includes(status)) {
            return data;
        }
        if (BANK_ONLY_EDITABLE_STATUSES.includes(status)) {
            const filtered = {};
            for (const key of BANK_FIELDS) {
                if (data[key] !== undefined) {
                    filtered[key] = data[key];
                }
            }
            return filtered;
        }
        // finished, cancelled: immutable hoàn toàn.
        return {};
    }
    validateDateRelationships(start_date, end_date, registration_deadline) {
        if (start_date && end_date) {
            if (start_date >= end_date)
                throw createAppError('VALIDATION_ERROR', 'start_date must be before end_date');
        }
        if (registration_deadline && start_date) {
            if (registration_deadline >= start_date)
                throw createAppError('VALIDATION_ERROR', 'registration_deadline must be before start_date');
        }
    }
    validateFutureIfProvided(start_date, registration_deadline) {
        const now = new Date();
        if (start_date && start_date <= now)
            throw createAppError('VALIDATION_ERROR', 'start_date must be in the future');
        if (registration_deadline && registration_deadline <= now)
            throw createAppError('VALIDATION_ERROR', 'registration_deadline must be in the future');
    }
    validateStatusTransition(from, to) {
        if (!STATUS_TRANSITIONS[from]?.includes(to)) {
            throw createAppError('VALIDATION_ERROR', `Cannot transition from '${from}' to '${to}'`);
        }
    }
    validateStatusPreConditions(existing, newStatus) {
        const now = new Date();
        if (newStatus === 'registration_open') {
            if (!existing.start_date || !existing.end_date || !existing.registration_deadline)
                throw createAppError('VALIDATION_ERROR', 'start_date, end_date, registration_deadline are required before opening registration');
            if (existing.registration_deadline <= now)
                throw createAppError('VALIDATION_ERROR', 'registration_deadline has already passed');
            if (existing.start_date <= now)
                throw createAppError('VALIDATION_ERROR', 'start_date has already passed');
        }
        // ongoing, finished, cancelled: admin chủ động chuyển tay — không
        // enforce date check ở các transition này (riêng 'ongoing' có check
        // số lượng team/group + roster tối thiểu qua activateSeason(), không
        // đặt ở đây vì cần query DB, không thuần date).
    }
    validateStatusAllowsDelete(status) {
        if (status !== SeasonStatus.upcoming) {
            throw createAppError('VALIDATION_ERROR', `Chỉ có thể xóa season ở trạng thái 'upcoming', hiện tại đang '${status}'.`);
        }
    }
    async restore(id) {
        const result = await this.prisma.season.updateMany({
            where: { id, deleted_at: { not: null } },
            data: { deleted_at: null },
            // KHÔNG force is_active: true — nếu season bị soft-delete lúc đang
            // 'cancelled' (đã is_active=false do cancel() trước đó), restore
            // chỉ nên đưa record trở lại danh sách, không âm thầm "hồi sinh"
            // trạng thái active của nó. Business status (status field) không
            // đổi qua restore — nếu cần mở lại giải đã cancelled, đó là quyết
            // định khác, đi qua updateStatus() với transition hợp lệ (hiện
            // STATUS_TRANSITIONS không cho cancelled → bất kỳ đâu, đúng ý đồ).
        });
        if (result.count === 0) {
            throw createAppError("NOT_FOUND", `Season ${id} not found or not deleted`);
        }
        return this.findByIdOrFail(id);
    }
}
//# sourceMappingURL=season.service.js.map