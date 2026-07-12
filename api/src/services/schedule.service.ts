import { createAppError } from '../common/app.error.js';
import {
    Match,
    MatchEventType,
    MatchStatus,
    PhaseFormat,
    PhaseStatus,
    PhaseType,
    Prisma,
    PrismaClient,
    SeasonStatus,
    SeasonTeamStatus,
} from '../generated/prisma/client.js';
import { Queryable } from '../libs/queryable.js';
import { shuffle } from '../libs/array.utils.js';
import {
    GenerateFromGroupsOptions,
    GenerateOptions,
    GenerateResult,
    MatchByTeamRow,
    MatchDraft,
    RescheduleInput,
    ScheduleOptions,
    SeasonSchedule,
} from '../types/schedule.type.js';
import { PaginatedResult, QueryRequest, SortDir } from '../types/queryable.type.js';
import { ScheduleEngine, ScheduleCandidateMatch, ASSUMED_MATCH_DURATION_MS } from '../libs/schedule.engine.js';

// Select dùng chung cho các query trả match kèm phase — thêm để FE (public
// ScheduleResults) phân biệt được match thuộc group_stage hay knockout thay
// vì chỉ có field `round` (knockout trước đây round luôn null/0, không đủ
// để hiển thị "Tứ kết"/"Bán kết").
const MATCH_WITH_PHASE_SELECT = {
    id: true, round: true, home_team_id: true, away_team_id: true,
    scheduled_at: true, venue_id: true, status: true,
    phase: { select: { id: true, name: true, type: true, format: true } },
} as const;

// FIX: select dùng cho danh sách match card công khai (ScheduleResults) —
// trước đây findMatchesBySeason chỉ trả cột thô của Match (không có tên
// đội, không có venue, không có kết quả hiệp phụ/luân lưu) khiến
// ScheduleMatchCard.jsx luôn rơi vào fallback "Đội #?" và không bao giờ
// hiện được nhãn "Sau hiệp phụ"/"Luân lưu" hay chấm thẻ đỏ — dù UI đã code
// sẵn đầy đủ, chỉ là dữ liệu chưa bao giờ được BE trả về.
const MATCH_CARD_INCLUDE = {
    home_team: { select: { id: true, name: true, logo: true } },
    away_team: { select: { id: true, name: true, logo: true } },
    venue: { select: { id: true, name: true } },
    matchResult: {
        select: {
            result_type: true,
            home_penalty_score: true,
            away_penalty_score: true,
            home_extra_time_score: true,
            away_extra_time_score: true,
        },
    },
} as const;

// Type thẻ vàng/đỏ tính vào "reds" — second_yellow (thẻ vàng thứ 2) thực
// chất là bị đuổi, nên gộp vào red_cards giống cách BE tự tính
// is_suspended ở matchresult.service.ts (_updatePlayerStatistics).
const RED_CARD_EVENT_TYPES: MatchEventType[] = [MatchEventType.red_card, MatchEventType.second_yellow];

// Status không tính vào conflict check (trận đã huỷ/xử thua không còn giữ
// chỗ lịch của team/player nữa).
const NON_BLOCKING_STATUSES: MatchStatus[] = [MatchStatus.cancelled, MatchStatus.forfeited];

export class ScheduleService extends ScheduleEngine {
    private readonly query: Queryable<Match>;

    constructor(prisma: PrismaClient) {
        // round là String column → DB-level orderBy là lexicographic ("10" < "2").
        // Chặn 'round' khỏi sortable ở Queryable; sort đúng chỉ ở app layer sau khi
        // parseInt. Muốn DB-level sort chuẩn phải migrate round sang Int.
        super(prisma);

        this.query = new Queryable<Match>(prisma.match, {
            filterable: ['status', 'venue_id', 'round'],
            sortable: ['scheduled_at'],
            defaultSort: { column: 'scheduled_at', direction: 'asc' },
            searchFields: [],
            defaultPerPage: 20,
            maxPerPage: 300,
            beforeBuild: (wheres) => { wheres.push({ is_active: true }); },
        });
    }

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<Match>> {
        return this.query.run(req);
    }

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
    async findMatchesBySeason(seasonId: number, req: QueryRequest = {}): Promise<PaginatedResult<Match>> {
        const page = Math.max(1, Number(req.page ?? 1));
        const perPage = Math.max(1, Math.min(Number(req.per_page ?? 20), 300));
        const sortCol = req.sort === 'scheduled_at' ? req.sort : 'scheduled_at';
        const direction: SortDir = (req.direction === 'asc' || req.direction === 'desc')
            ? req.direction
            : 'asc';

        const where = {
            phase: { season_id: seasonId },
            is_active: true,
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.match.findMany({
                where,
                orderBy: { [sortCol]: direction },
                skip: (page - 1) * perPage,
                take: perPage,
                include: MATCH_CARD_INCLUDE,
            }),
            this.prisma.match.count({ where }),
        ]);

        const withCardMeta = await this._attachCardCounts(data);

        const last_page = Math.max(1, Math.ceil(total / perPage));
        return {
            data: withCardMeta,
            meta: { total, page, per_page: perPage, last_page, has_next: page < last_page },
        };
    }

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
    private async _attachCardCounts<T extends { id: number; home_team_id: number; away_team_id: number }>(
        matches: T[],
    ): Promise<(T & {
        home_yellow_cards: number; away_yellow_cards: number;
        home_red_cards: number; away_red_cards: number;
    })[]> {
        if (matches.length === 0) return [];

        const matchIds = matches.map(m => m.id);
        const cardEvents = await this.prisma.matchEvent.groupBy({
            by: ['match_id', 'team_id', 'type'],
            where: {
                match_id: { in: matchIds },
                type: { in: [MatchEventType.yellow_card, ...RED_CARD_EVENT_TYPES] },
            },
            _count: { _all: true },
        });

        return matches.map(m => {
            const forThisMatch = cardEvents.filter(c => c.match_id === m.id);
            const countFor = (teamId: number, types: MatchEventType[]) =>
                forThisMatch
                    .filter(c => c.team_id === teamId && types.includes(c.type as MatchEventType))
                    .reduce((sum, c) => sum + c._count._all, 0);

            return {
                ...m,
                home_yellow_cards: countFor(m.home_team_id, [MatchEventType.yellow_card]),
                away_yellow_cards: countFor(m.away_team_id, [MatchEventType.yellow_card]),
                home_red_cards: countFor(m.home_team_id, RED_CARD_EVENT_TYPES),
                away_red_cards: countFor(m.away_team_id, RED_CARD_EVENT_TYPES),
            };
        });
    }
    async findMatchesByTeam(
        seasonId: number,
        teamId: number,
        req: QueryRequest = {},
    ): Promise<PaginatedResult<MatchByTeamRow>> {
        const page = Math.max(1, Number(req.page ?? 1));
        const perPage = Math.max(1, Math.min(Number(req.per_page ?? 20), 300));
        const sortCol = (req.sort === 'round' || req.sort === 'scheduled_at')
            ? req.sort
            : 'scheduled_at';
        const direction: SortDir = (req.direction === 'asc' || req.direction === 'desc')
            ? req.direction
            : 'asc';

        const where = {
            phase: { season_id: seasonId },
            is_active: true,
            OR: [{ home_team_id: teamId }, { away_team_id: teamId }],
        };

        // round là String → không thể dùng DB-level orderBy đúng nghĩa số.
        // Fetch toàn bộ dataset (bounded: vài chục match/team/season) rồi sort ở app.
        if (sortCol === 'round') {
            const [allRows, total] = await this.prisma.$transaction([
                this.prisma.match.findMany({ where, select: MATCH_WITH_PHASE_SELECT }),
                this.prisma.match.count({ where }),
            ]);

            allRows.sort((a, b) => {
                const ra = parseInt(a.round ?? '0', 10);
                const rb = parseInt(b.round ?? '0', 10);
                return direction === 'asc' ? ra - rb : rb - ra;
            });

            const data = allRows.slice((page - 1) * perPage, page * perPage);
            const last_page = Math.max(1, Math.ceil(total / perPage));

            return {
                data,
                meta: { total, page, per_page: perPage, last_page, has_next: page < last_page },
            };
        }

        // scheduled_at là DateTime → DB-level orderBy hợp lệ.
        const [data, total] = await this.prisma.$transaction([
            this.prisma.match.findMany({
                where,
                select: MATCH_WITH_PHASE_SELECT,
                orderBy: { [sortCol]: direction },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            this.prisma.match.count({ where }),
        ]);

        const last_page = Math.max(1, Math.ceil(total / perPage));

        return {
            data,
            meta: { total, page, per_page: perPage, last_page, has_next: page < last_page },
        };
    }

    async generateGroupsAndSchedule(
        seasonId: number,
        options: GenerateOptions,
    ): Promise<GenerateResult> {
        const warnings: string[] = [];

        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (options.matchTimes.length === 0)
            throw createAppError('VALIDATION_ERROR', 'matchTimes không được rỗng');

        const { groupCount, groupIds } = await this.prisma.$transaction(
            async tx => {
                await tx.$executeRaw`SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;

                const season = await tx.season.findUnique({
                    where: { id: seasonId },
                    include: {
                        season_teams: { where: { status: { not: SeasonTeamStatus.withdrawn } } },
                        phases: { select: { id: true } },
                    },
                });

                if (!season)
                    throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
                if (season.status !== SeasonStatus.registration_open)
                    throw createAppError(
                        'CONFLICT',
                        `Season phải ở 'registration_open' để generate, hiện tại: '${season.status}'`,
                    );
                if (season.phases.length > 0)
                    throw createAppError(
                        'CONFLICT',
                        `Season ${seasonId} đã có phase — không generate lại. Nếu bảng đã được tạo/bốc ` +
                        `thăm qua GroupService, dùng endpoint generate-from-groups thay vì endpoint này.`,
                    );

                const teamIds = season.season_teams.map(st => st.team_id);
                if (teamIds.length < 2)
                    throw createAppError(
                        'VALIDATION_ERROR',
                        `Chỉ có ${teamIds.length} team active — cần ít nhất 2`,
                    );

                const groupCount = this.resolveGroupCount(
                    teamIds.length,
                    options.desiredGroupCount,
                    options.minGroupSize,
                );

                if (groupCount === 1 && teamIds.length > options.maxGroupSize)
                    throw createAppError(
                        'VALIDATION_ERROR',
                        `${teamIds.length} team không fit 1 group (maxGroupSize=${options.maxGroupSize})`,
                    );

                const distributed = this.assignTeamsToGroups(teamIds, groupCount);

                // teams_per_group là approximate nominal capacity (groups có thể lệch
                // ±1 team do assignTeamsToGroups dùng snake-draft). Dùng giá trị lớn
                // nhất trong các group làm capacity — assignTeamToGroup (admin thêm 1
                // team lẻ sau draw) dùng số này để chặn group vượt quá. Yêu cầu field
                // Phase.teams_per_group (Int?) đã có trong schema.
                const nominalTeamsPerGroup = Math.max(...distributed.map(g => g.length));

                const phase = await tx.phase.create({
                    data: {
                        season_id: seasonId,
                        name: 'Vòng bảng',
                        type: PhaseType.group_stage,
                        format: PhaseFormat.round_robin,
                        order: 1,
                        status: PhaseStatus.in_progress,
                        min_rest_days_per_team: options.minRestDaysPerTeam ?? 3,
                        teams_per_group: nominalTeamsPerGroup,
                    },
                });

                const groupCreateData = distributed.map((teams, i) => ({
                    phase_id: phase.id,
                    name: `Bảng ${String.fromCharCode(65 + i)}`,
                    is_active: teams.length >= 2,
                }));

                // N round-trip riêng (không phải N+1: không có query lồng trong loop
                // dựa trên kết quả query trước). Không gộp được thành 1 createMany vì
                // cần group.id trả về ngay để gán group_id cho seasonTeam/match draft
                // bên dưới — MySQL createMany không có RETURNING. Ở scale vài group/
                // giải sinh viên, N round-trip song song (Promise.all) không đáng lo.
                const groups = await Promise.all(
                    groupCreateData.map(data => tx.group.create({ data })),
                );

                const createdGroupIds: number[] = [];
                const allMatches: MatchDraft[] = [];

                for (let i = 0; i < groups.length; i++) {
                    const group = groups[i]!;
                    const teamsInGroup = distributed[i]!;

                    await tx.seasonTeam.updateMany({
                        where: { season_id: seasonId, team_id: { in: teamsInGroup } },
                        data: { group_id: group.id },
                    });

                    if (teamsInGroup.length < 2) {
                        warnings.push(
                            `${group.name}: chỉ có ${teamsInGroup.length} team — bỏ qua generate match`,
                        );
                        continue;
                    }

                    const matches = this.generateRoundRobin(
                        teamsInGroup, group.id, phase.id, options.doubleRound ?? true,
                    );
                    allMatches.push(...matches);
                    createdGroupIds.push(group.id);
                }

                await tx.match.createMany({ data: allMatches });
                await tx.season.update({
                    where: { id: seasonId },
                    data: { status: SeasonStatus.ongoing },
                });

                return { groupCount, groupIds: createdGroupIds };
            },
            { timeout: 30_000 },
        );

        const scheduleResult = await this.autoScheduleMatches(seasonId, options);

        if (scheduleResult.failedMatchIds.length > 0) {
            warnings.push(
                `${scheduleResult.failedMatchIds.length} match chưa xếp lịch (thiếu slot hoặc ` +
                `thuật toán không tìm ra phương án — xem lại venueIds/matchTimes/minRestDays): ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`,
            );
        }

        return { groupCount, groupIds, ...scheduleResult, warnings };
    }

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
    async generateMatchesFromDrawnGroups(
        seasonId: number,
        options: GenerateFromGroupsOptions,
    ): Promise<GenerateResult> {
        const warnings: string[] = [];

        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (options.matchTimes.length === 0)
            throw createAppError('VALIDATION_ERROR', 'matchTimes không được rỗng');

        const { groupCount, groupIds } = await this.prisma.$transaction(
            async tx => {
                await tx.$executeRaw`SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;

                const season = await tx.season.findUnique({ where: { id: seasonId } });
                if (!season)
                    throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);

                // Cùng tiêu chí resolve phase với GroupService — KHÔNG tự tạo phase
                // (đây là read/generate-path, không phải create-path).
                const phase = await tx.phase.findFirst({
                    where: {
                        season_id: seasonId,
                        format: PhaseFormat.round_robin,
                        type: PhaseType.group_stage,
                        is_active: true,
                    },
                });

                if (!phase)
                    throw createAppError(
                        'CONFLICT',
                        `Season ${seasonId} chưa có bảng đấu — tạo bảng & bốc thăm qua GroupService ` +
                        `trước khi tạo lịch, hoặc dùng endpoint generate (tự tạo bảng) nếu chưa từng tạo.`,
                    );
                if (phase.status === PhaseStatus.locked)
                    throw createAppError('CONFLICT', `Phase ${phase.id} đã locked`);

                const existingMatches = await tx.match.count({
                    where: { phase_id: phase.id, deleted_at: null },
                });
                if (existingMatches > 0)
                    throw createAppError(
                        'CONFLICT',
                        `Season ${seasonId} đã có lịch thi đấu (${existingMatches} match) — xoá lịch cũ ` +
                        `trước khi tạo lại.`,
                    );

                // Filter giống hệt GroupService.buildGroupsPayload — đảm bảo chỉ tính
                // các season_team thực sự "đã bốc thăm và còn hợp lệ".
                const groups = await tx.group.findMany({
                    where: { phase_id: phase.id, is_active: true },
                    include: {
                        season_teams: {
                            where: {
                                deleted_at: null,
                                is_active: true,
                                status: SeasonTeamStatus.approved,
                            },
                            select: { team_id: true },
                        },
                    },
                    orderBy: { id: 'asc' },
                });

                if (groups.length === 0)
                    throw createAppError('CONFLICT', `Phase ${phase.id} chưa có group nào`);

                const allMatches: MatchDraft[] = [];
                const usedGroupIds: number[] = [];

                for (const group of groups) {
                    const teamIds = group.season_teams.map(st => st.team_id);
                    if (teamIds.length < 2) {
                        warnings.push(
                            `${group.name}: chỉ có ${teamIds.length} đội đã bốc thăm — bỏ qua generate match`,
                        );
                        continue;
                    }
                    const matches = this.generateRoundRobin(
                        teamIds, group.id, phase.id, options.doubleRound ?? false,
                    );
                    allMatches.push(...matches);
                    usedGroupIds.push(group.id);
                }

                if (allMatches.length === 0)
                    throw createAppError(
                        'CONFLICT',
                        'Không bảng nào đủ >= 2 đội đã bốc thăm — bốc thăm bảng trước khi tạo lịch.',
                    );

                await tx.match.createMany({ data: allMatches });

                if (options.minRestDaysPerTeam !== undefined) {
                    await tx.phase.update({
                        where: { id: phase.id },
                        data: { min_rest_days_per_team: options.minRestDaysPerTeam },
                    });
                }

                if (season.status === SeasonStatus.registration_open) {
                    await tx.season.update({
                        where: { id: seasonId },
                        data: { status: SeasonStatus.ongoing },
                    });
                }

                return { groupCount: usedGroupIds.length, groupIds: usedGroupIds };
            },
            { timeout: 30_000 },
        );

        const scheduleResult = await this.autoScheduleMatches(seasonId, {
            venueIds: options.venueIds,
            matchTimes: options.matchTimes,
            allowPastDate: options.allowPastDate,
        });

        if (scheduleResult.failedMatchIds.length > 0) {
            warnings.push(
                `${scheduleResult.failedMatchIds.length} match chưa xếp lịch (thiếu slot hoặc ` +
                `thuật toán không tìm ra phương án — xem lại venueIds/matchTimes/minRestDays): ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`,
            );
        }

        return { groupCount, groupIds, ...scheduleResult, warnings };
    }

    async autoScheduleMatches(
        seasonId: number,
        // allowPastDate optional — mặc định false (throw nếu start_date đã qua).
        // Trước đây chỉ console.warn rồi vẫn chạy tiếp, sinh ra slot pool toàn
        // nằm trong quá khứ — sai lặng lẽ, không observable qua log structured.
        options: ScheduleOptions & { allowPastDate?: boolean },
    ): Promise<{ matchesScheduled: number; failedMatchIds: number[] }> {
        const matches: ScheduleCandidateMatch[] = await this.prisma.match.findMany({
            where: {
                phase: { season_id: seasonId },
                scheduled_at: null,
                status: MatchStatus.scheduled,
                group_id: { not: null },
            },
            select: {
                id: true,
                home_team_id: true,
                away_team_id: true,
                round: true,
            },
            orderBy: { id: 'asc' }, // stable base order trước khi áp dụng MRV/restart
        });

        if (matches.length === 0) return { matchesScheduled: 0, failedMatchIds: [] };

        // FIX: select thêm end_date — trước đây rangeEnd luôn hardcode
        // start_date + 6 tháng, bỏ qua hoàn toàn thời điểm season thực sự kết
        // thúc. Match có thể bị xếp lịch sau khi season đã đóng. end_date giờ
        // là hard boundary bắt buộc, không có fallback im lặng.
        const [phase, season] = await Promise.all([
            this.prisma.phase.findFirst({
                where: { season_id: seasonId, type: PhaseType.group_stage },
                select: { min_rest_days_per_team: true },
            }),
            this.prisma.season.findUnique({
                where: { id: seasonId },
                select: { start_date: true, end_date: true },
            }),
        ]);

        if (!phase)
            throw createAppError('NOT_FOUND', `Không tìm thấy group_stage phase cho season ${seasonId}`);
        if (!season)
            throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
        if (!season.start_date)
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} chưa có start_date`);
        if (!season.end_date)
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} chưa có end_date`);

        const minRestDays = phase.min_rest_days_per_team ?? 3;
        const startDate = season.start_date;
        const rangeEnd = season.end_date;

        if (rangeEnd <= startDate)
            throw createAppError(
                'VALIDATION_ERROR',
                `Season ${seasonId} end_date (${rangeEnd.toISOString()}) phải sau start_date ` +
                `(${startDate.toISOString()})`,
            );

        // Throw thay vì chỉ warn — trừ khi caller chủ động bypass bằng
        // allowPastDate (vd backfill lịch sử có chủ đích).
        if (startDate < new Date() && !options.allowPastDate) {
            throw createAppError(
                'VALIDATION_ERROR',
                `Season ${seasonId} có start_date đã qua (${startDate.toISOString()}) — ` +
                `slot pool sẽ rơi vào quá khứ. Cập nhật start_date hoặc gọi với allowPastDate=true ` +
                `nếu đây là backfill có chủ đích.`,
            );
        }

        const takenSet = await this.loadTakenSlots(options.venueIds, startDate, rangeEnd);
        const pool = this.buildSlotPool(
            options.venueIds, startDate, rangeEnd, options.matchTimes, takenSet,
        );

        if (pool.length < matches.length) {
            throw createAppError(
                'VALIDATION_ERROR',
                `Không đủ slot: cần ${matches.length}, chỉ có ${pool.length}. ` +
                `Thêm venueId / matchTime, đẩy startDate sớm hơn, hoặc mở rộng end_date của season.`,
            );
        }

        // Orchestration (MRV + multi-restart) đã move lên ScheduleEngine —
        // dùng chung với KnockoutService, không còn duplicate ở đây.
        //
        // FIX (player-sharing conflict): trước đây ScheduleEngine chỉ biết
        // teams/rest-days TRONG PHẠM VI matches của season này — không có
        // khái niệm "team ở season khác share player với team đang xếp lịch
        // ở đây". Giờ load conflictContext (conflictMap + occupiedWindows TỪ
        // TOÀN BỘ HỆ THỐNG, không giới hạn season) TRƯỚC khi search, để
        // greedy pass tự né những slot đã bị chiếm bởi team/player liên
        // quan — thay vì assign rồi phát hiện conflict sau khi ghi.
        const allTeamIds = [...new Set(matches.flatMap(m => [m.home_team_id, m.away_team_id]))];
        const conflictContext = await this.loadPlayerConflictContext(this.prisma, allTeamIds);

        const { updates, unscheduled } = this.scheduleMatchesWithRetry(
            matches, pool, minRestDays, undefined, conflictContext,
        );

        const failedFromCollision = await this.writeScheduleBatch(updates);

        // Quarantine pass GIỜ CHỈ LÀ SAFETY NET cho race hiếm giữa lúc
        // loadPlayerConflictContext đọc (trên) và writeScheduleBatch ghi
        // (dưới) — ví dụ 1 rescheduleMatch khác commit đúng vào khoảng đó,
        // đụng đúng team/player trong batch này. Với avoidance đã chạy ở
        // bước search, số lượng bị quarantine ở đây kỳ vọng gần như luôn = 0
        // trong điều kiện bình thường (không có ghi đè đồng thời).
        const writtenIds = updates
            .map(u => u.id)
            .filter(id => !failedFromCollision.includes(id));

        const quarantinedIds = await this.prisma.$transaction(
            (tx) => this.quarantinePlayerConflicts(tx, writtenIds),
        );

        const finalUnscheduled = [...unscheduled, ...failedFromCollision, ...quarantinedIds];

        return {
            matchesScheduled: updates.length - failedFromCollision.length - quarantinedIds.length,
            failedMatchIds: finalUnscheduled,
        };
    }

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
    async rescheduleMatch(matchId: number, input: RescheduleInput): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw`SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;

            const match = await tx.match.findUnique({
                where: { id: matchId },
                select: { id: true, status: true, home_team_id: true, away_team_id: true },
            });

            if (!match)
                throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);

            const RESCHEDULABLE: MatchStatus[] = [MatchStatus.scheduled, MatchStatus.postponed];
            if (!RESCHEDULABLE.includes(match.status))
                throw createAppError(
                    'CONFLICT',
                    `Match ${matchId} đang ở status '${match.status}' — chỉ reschedule được khi scheduled/postponed`,
                );

            const conflictMap = await this.buildTeamConflictMap(
                tx, [match.home_team_id, match.away_team_id],
            );
            const conflictingTeamIds = [...new Set([
                ...(conflictMap.get(match.home_team_id) ?? [match.home_team_id]),
                ...(conflictMap.get(match.away_team_id) ?? [match.away_team_id]),
            ])];

            // Lock tất cả team liên quan theo thứ tự id cố định — tránh
            // deadlock khi 2 request reschedule song song đụng chung 1 phần
            // team set (cùng pattern SeasonTeamService.transferSeason lock 2
            // season theo [firstId, secondId]).
            for (const tid of [...conflictingTeamIds].sort((a, b) => a - b)) {
                await tx.$executeRaw`SELECT id FROM teams WHERE id = ${tid} FOR UPDATE`;
            }

            const windowStart = new Date(input.scheduledAt.getTime() - ASSUMED_MATCH_DURATION_MS);
            const windowEnd = new Date(input.scheduledAt.getTime() + ASSUMED_MATCH_DURATION_MS);

            // Venue conflict — độc lập hoàn toàn với player/team, chỉ cần
            // trùng sân trong khung giờ.
            const venueConflict = await tx.match.findFirst({
                where: {
                    id: { not: matchId },
                    venue_id: input.venueId,
                    scheduled_at: { gte: windowStart, lte: windowEnd },
                    status: { notIn: NON_BLOCKING_STATUSES },
                },
                select: { id: true, scheduled_at: true },
            });
            if (venueConflict)
                throw createAppError(
                    'CONFLICT',
                    `Venue ${input.venueId} đã có trận (match ${venueConflict.id}) trong khoảng ` +
                    `±${ASSUMED_MATCH_DURATION_MS / 60000} phút quanh ${input.scheduledAt.toISOString()}`,
                );

            // Team/player conflict — bất kỳ match nào khác (không giới hạn
            // season) có 1 trong các team liên quan (2 team trận này, hoặc
            // team share player với 1 trong 2) đá trong cùng khung giờ.
            const conflict = await tx.match.findFirst({
                where: {
                    id: { not: matchId },
                    scheduled_at: { gte: windowStart, lte: windowEnd },
                    status: { notIn: NON_BLOCKING_STATUSES },
                    OR: [
                        { home_team_id: { in: conflictingTeamIds } },
                        { away_team_id: { in: conflictingTeamIds } },
                    ],
                },
                select: { id: true, scheduled_at: true, home_team_id: true, away_team_id: true },
            });
            if (conflict)
                throw createAppError(
                    'CONFLICT',
                    `Trùng lịch: match ${conflict.id} (team ${conflict.home_team_id} vs ` +
                    `${conflict.away_team_id}) đã xếp lúc ${conflict.scheduled_at?.toISOString()} — ` +
                    `có team hoặc cầu thủ dùng chung roster với trận này trong khung ` +
                    `±${ASSUMED_MATCH_DURATION_MS / 60000} phút quanh ${input.scheduledAt.toISOString()}`,
                );

            await tx.match.update({
                where: { id: matchId },
                data: {
                    scheduled_at: input.scheduledAt,
                    venue_id: input.venueId,
                    status: MatchStatus.scheduled,
                },
            });
        });
    }

    async getSeasonSchedule(seasonId: number): Promise<SeasonSchedule> {
        const matches = await this.prisma.match.findMany({
            where: {
                phase: { season_id: seasonId },
                is_active: true,
            },
            select: MATCH_WITH_PHASE_SELECT,
            orderBy: [{ scheduled_at: 'asc' }, { id: 'asc' }],
        });

        matches.sort((a, b) => {
            // Round-robin dùng round để sort tuyến tính; knockout sort theo
            // scheduled_at là đủ (bracket round không tuyến tính theo thời
            // gian tuyệt đối giữa các phase khác nhau — vd 2 trận tứ kết có
            // thể đá sau 1 trận bán kết bị hoãn).
            if (a.phase?.format !== 'knockout' && b.phase?.format !== 'knockout') {
                const ra = parseInt(a.round ?? '0', 10);
                const rb = parseInt(b.round ?? '0', 10);
                if (ra !== rb) return ra - rb;
            }
            const ta = a.scheduled_at?.getTime() ?? Infinity;
            const tb = b.scheduled_at?.getTime() ?? Infinity;
            return ta - tb;
        });

        const scheduled = matches.filter(m => m.scheduled_at !== null).length;

        return {
            seasonId,
            totalMatches: matches.length,
            scheduledMatches: scheduled,
            unscheduledMatches: matches.length - scheduled,
            matches: matches.map(m => ({
                matchId: m.id,
                round: m.round,
                homeTeamId: m.home_team_id,
                awayTeamId: m.away_team_id,
                scheduledAt: m.scheduled_at,
                venueId: m.venue_id,
                status: m.status,
                // NEW — cho phép FE (ScheduleResults) phân biệt group_stage vs
                // knockout và hiển thị đúng nhãn (VD "Tứ kết") thay vì "Vòng 0".
                phaseId: m.phase?.id ?? null,
                phaseName: m.phase?.name ?? null,
                phaseType: m.phase?.type ?? null,
                phaseFormat: m.phase?.format ?? null,
            })),
        };
    }

    private resolveGroupCount(
        totalTeams: number,
        desiredGroups: number,
        minGroupSize: number,
    ): number {
        let g = Math.min(desiredGroups, totalTeams);
        while (g > 1) {
            if (Math.floor(totalTeams / g) >= minGroupSize) return g;
            g--;
        }
        return 1;
    }

    private assignTeamsToGroups(
        teamIds: number[],
        numberOfGroups: number,
        seedOrder?: number[],
    ): number[][] {
        const ordered = seedOrder ?? shuffle([...teamIds]);
        const groups: number[][] = Array.from({ length: numberOfGroups }, () => []);
        let idx = 0;
        let dir = 1;

        for (const teamId of ordered) {
            groups[idx]!.push(teamId);
            idx += dir;
            if (idx === numberOfGroups) { idx = numberOfGroups - 1; dir = -1; }
            else if (idx === -1) { idx = 0; dir = 1; }
        }
        return groups;
    }

    private generateRoundRobin(
        teamIds: number[],
        groupId: number,
        phaseId: number,
        doubleRound = true,
    ): MatchDraft[] {
        if (teamIds.length < 2) return [];

        const teams: (number | null)[] = [...teamIds];
        if (teams.length % 2 !== 0) teams.push(null); // bye slot

        const n = teams.length;
        const numRounds = n - 1;
        const drafts: { round: number; home: number; away: number }[] = [];
        let current = [...teams];

        for (let round = 0; round < numRounds; round++) {
            for (let i = 0; i < n / 2; i++) {
                const a = current[i];
                const b = current[n - 1 - i];
                if (a == null || b == null) continue;
                const [home, away] = round % 2 === 0 ? [a, b] : [b, a];
                drafts.push({ round: round + 1, home, away });
            }
            current = this.rotate(current);
        }

        if (doubleRound) {
            drafts.push(
                ...drafts.map(d => ({ round: d.round + numRounds, home: d.away, away: d.home })),
            );
        }

        return drafts.map(d => ({
            phase_id: phaseId,
            group_id: groupId,
            home_team_id: d.home,
            away_team_id: d.away,
            round: String(d.round),
            status: MatchStatus.scheduled,
        }));
    }

    private rotate<T>(arr: T[]): T[] {
        if (arr.length <= 2) return arr;
        // Giữ arr[0] cố định (round-robin rotation algorithm), xoay phần còn lại.
        return [arr[0]!, arr[arr.length - 1]!, ...arr.slice(1, arr.length - 1)];
    }
}