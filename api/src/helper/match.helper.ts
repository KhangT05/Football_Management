import { MatchEventType, MatchPeriod, MatchStatus, PhaseFormat, PlayerPosition, Prisma } from "../generated/prisma/client.js";
import { QueryRequest } from "../types/queryable.type.js";
import { createAppError } from "../common/app.error.js";
import { MAX_ADDED_MINUTE, MINUTE_BOUNDS } from "../types/match.type.js";
import { ConfirmResultInput, WinnerResolution } from "../types/matchResult.type.js";
// Circular type-only import với matchReport.type.ts (file đó import ngược lại
// MatchReportEventEntry/MatchReportGoalEntry từ đây) — ĐÃ tồn tại từ code gốc
// theo hướng ngược lại (match.helper.ts trước đây import MatchReportEventEntry/
// MatchReportPlayerRow từ matchReport.type.ts), không phải circular mới phát
// sinh do lần sửa này. TypeScript xử lý tốt circular import khi chỉ dùng cho
// type (bị erase lúc compile, không có circular value ở runtime).
import { MatchReportPlayerRow } from '../types/matchReport.type.js';

export function isKnockoutFormat(format: PhaseFormat): boolean {
    return format === PhaseFormat.knockout;
}

export const MATCH_EVENT_SELECT = {
    id: true,
    match_id: true,
    player_id: true,
    team_id: true,
    type: true,
    period: true,
    minute: true,
    time_source: true,
    added_minute: true,
    created_at: true,
} satisfies Prisma.MatchEventSelect;

export const MATCH_RESULT_SELECT = {
    id: true,
    match_id: true,
    home_final_score: true,
    away_final_score: true,
    home_extra_time_score: true,
    away_extra_time_score: true,
    home_penalty_score: true,
    away_penalty_score: true,
    result_type: true,
    status: true,
    notes: true,
    created_at: true,
} satisfies Prisma.MatchResultSelect;


// Baseline lý thuyết (chưa tính bù giờ — bù giờ là hướng phát triển sau,
// để field trống hiện tại nghĩa là dùng baseline chuẩn 45/90/105/120).
export const PERIOD_BASELINE_MINUTE: Record<MatchPeriod, number> = {
    first_half: 0,
    second_half: 45,
    extra_time_first: 90,
    extra_time_second: 105,
    penalty_shootout: 120,
};

export interface EventClockTime {
    time: Date;
    confidence: 'exact' | 'estimated';
}

/**
 * Tính giờ hiển thị cho 1 event.
 * - time_source='live': dùng created_at thẳng — admin đã bấm ngay lúc xảy ra,
 *   sai số chỉ là độ trễ thao tác (vài giây), coi là chính xác.
 * - time_source='estimated': suy từ scheduled_at + minute, baseline lý
 *   thuyết theo period (KHÔNG bù giờ thực tế — xem PERIOD_BASELINE_MINUTE).
 *   Đây là ước lượng thô, sai số có thể vài phút/hàng chục phút nếu hiệp
 *   trước đó có bù giờ dài hoặc nghỉ giữa hiệp không chuẩn 15p. Hướng phát
 *   triển sau: thêm Match.first_half_added_time/second_half_added_time để
 *   bù chính xác hơn — hàm này đã tách baseline riêng để dễ nâng cấp, không
 *   cần đổi chữ ký khi thêm bù giờ.
 */
export function computeEventClockTime(
    match: { scheduled_at: Date | null },
    evt: {
        time_source: 'live' | 'estimated';
        created_at: Date;
        period: MatchPeriod | null;
        minute: number | null;
        added_minute: number | null;
    },
): EventClockTime | null {
    if (evt.time_source === 'live') {
        return { time: evt.created_at, confidence: 'exact' };
    }

    if (!match.scheduled_at || evt.minute == null || !evt.period) return null;
    if (evt.period === MatchPeriod.penalty_shootout) return null; // pen không có "phút" thật

    // minute lưu theo chuẩn cumulative bóng đá (hiệp 2: 46-90...), nên
    // KHÔNG cộng thêm baseline vào minute — minute tự nó đã là tổng phút.
    const totalMinutes = evt.minute + (evt.added_minute ?? 0);

    return {
        time: new Date(match.scheduled_at.getTime() + totalMinutes * 60_000),
        confidence: 'estimated',
    };
}

/**
 * FIX (type trùng lặp): trước đây `MatchReportEventEntry` (dùng cho thẻ,
 * khai ở types/matchReport.type.ts) và field lõi của `MatchReportGoalEntry`
 * (dùng cho bàn thắng, khai ở đây) là 2 khai báo riêng nhưng CÙNG shape
 * (minute/addedMinute/clockTime/clockConfidence) — khi thêm giờ thực cho
 * goal trước đó, phải nhớ sửa cả 2 nơi, dễ lệch nếu quên 1 bên (thực tế đã
 * xảy ra: card bị bỏ sót clockTime/clockConfidence). Gộp về 1 interface lõi
 * DUY NHẤT ở đây — `matchReport.type.ts` giờ import lại, không tự khai nữa.
 */
export interface MatchReportEventEntry {
    minute: number | null;
    addedMinute: number | null;
    clockTime: Date | null;         // giờ thực (vd 9h + phút -> 09:05) — null nếu thiếu scheduled_at hoặc minute
    clockConfidence: 'exact' | 'estimated' | null;
}

export interface MatchReportGoalEntry extends MatchReportEventEntry {
    playerName: string;
    isOwnGoal: boolean;
}

export type MatchEventRow = Prisma.MatchEventGetPayload<{ select: typeof MATCH_EVENT_SELECT }>;
export type MatchResultRow = Prisma.MatchResultGetPayload<{ select: typeof MATCH_RESULT_SELECT }>;

// FIX (duplicate select bug): matchForConfirmSelect / MatchForConfirmFull KHÔNG
// còn định nghĩa ở đây nữa. Trước đây file này tự khai lại select với path SAI
// (season.tournament.tournamentRule — mảng, sai rule) song song với bản ĐÚNG ở
// data/match.queries.ts (season.tournamentRule — quan hệ 1-1), gây lỗi TS 'never'
// và đọc sai TournamentRule khi 2 import path bị lẫn. Giờ dùng thẳng
// `matchForConfirmSelect` / `MatchForConfirm` export từ match.queries.ts — 1
// nguồn sự thật duy nhất cho select này.

export type StatDelta = {
    goals: number;
    yellowCards: number;
    redCards: number;
};

// ─── Minute rounding ──────────────────────────────────────────────────────────

export function toMatchMinute(elapsedSeconds: number): number {
    if (elapsedSeconds < 0)
        throw createAppError('VALIDATION_ERROR', `elapsedSeconds không thể âm: ${elapsedSeconds}`);
    return Math.max(1, Math.ceil(elapsedSeconds / 60));
}

export const GOAL_EVENT_TYPES: MatchEventType[] = [
    MatchEventType.goal,
    MatchEventType.own_goal,
    MatchEventType.penalty_scored,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function statKey(playerId: number, teamId: number): string {
    return `${playerId}:${teamId}`;
}

export function buildStatDeltas(
    events: { player_id: number | null; team_id: number | null; type: string }[],
): { played: Set<string>; deltas: Map<string, StatDelta> } {
    const played = new Set<string>();
    const deltas = new Map<string, StatDelta>();

    for (const ev of events) {
        if (!ev.player_id || !ev.team_id) continue;
        const k = statKey(ev.player_id, ev.team_id);
        played.add(k);

        const d = deltas.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0 };
        switch (ev.type as MatchEventType) {
            case MatchEventType.goal:
            case MatchEventType.penalty_scored:
                d.goals++;
                break;
            case MatchEventType.yellow_card:
                d.yellowCards++;
                break;
            case MatchEventType.red_card:
            case MatchEventType.second_yellow:
                d.redCards++;
                break;
        }
        deltas.set(k, d);
    }

    return { played, deltas };
}

export function toMatchResultCreateInput(
    matchId: number,
    input: ConfirmResultInput,
    resolution: WinnerResolution,
): Prisma.MatchResultCreateInput {
    return {
        match: { connect: { id: matchId } },
        winner_team: resolution.winnerTeamId
            ? { connect: { id: resolution.winnerTeamId } }
            : undefined,
        home_extra_time_score: input.homeExtraTime ?? null,
        away_extra_time_score: input.awayExtraTime ?? null,
        home_penalty_score: input.homePenalty ?? null,
        away_penalty_score: input.awayPenalty ?? null,
        home_final_score: resolution.homeFinal,
        away_final_score: resolution.awayFinal,
        result_type: input.resultType,
        status: 'official',
        notes: input.notes ?? null,
    };
}

export function toMatchUpdateOnConfirm(
    resolution: WinnerResolution,
    targetMatchStatus: MatchStatus,
    homeHalfTimeScore?: number | null,
    awayHalfTimeScore?: number | null,
): Prisma.MatchUpdateInput {
    return {
        status: targetMatchStatus,
        played_at: new Date(),
        home_score: resolution.homeFinal,
        away_score: resolution.awayFinal,
        pending_official_at: null,
        manual_home_score: null,
        manual_away_score: null,
        finalize_result_type: null,
        finalize_home_half_time: homeHalfTimeScore ?? null,
        finalize_away_half_time: awayHalfTimeScore ?? null,
        finalize_home_penalty: null,
        finalize_away_penalty: null,
        finalize_home_extra_time: null,
        finalize_away_extra_time: null,
    };
}

export function buildMatchEventsQueryRequest(query: Record<string, any>): QueryRequest {
    return {
        type: query.type,
        period: query.period,
        filter: {
            ...query.filter,
        },
        page: query.page,
        per_page: query.per_page,
        sort: query.sort,
        direction: query.direction,
        q: query.q,
    };
}

export function buildStandingsQueryRequest(query: Record<string, any>): QueryRequest {
    return {
        is_active: true,
        filter: query.groupId ? { group_id: { eq: query.groupId } } : {},
        page: query.page,
        per_page: query.per_page,
        sort: query.sort,
        direction: query.direction,
    };
}

export function buildPlayerStatsQueryRequest(query: Record<string, any>): QueryRequest {
    return {
        filter: query.teamId ? { team_id: { eq: query.teamId } } : {},
        page: query.page,
        per_page: query.per_page,
        sort: query.sort,
        direction: query.direction,
    };
}

export function toMatchResultUpdateOnUphold(note?: string): Prisma.MatchResultUpdateInput {
    return {
        status: 'official',
        appeal_note: note ?? null,
    };
}

export function toMatchResultUpdateOnOverturn(
    newHomeScore: number,
    newAwayScore: number,
    newWinnerTeamId: number | null,
    note?: string,
): Prisma.MatchResultUpdateInput {
    return {
        home_final_score: newHomeScore,
        away_final_score: newAwayScore,
        winner_team: newWinnerTeamId
            ? { connect: { id: newWinnerTeamId } }
            : { disconnect: true },
        status: 'overturned',
        appeal_note: note ?? null,
    };
}

export function toMatchUpdateOnOverturn(
    newHomeScore: number,
    newAwayScore: number,
): Prisma.MatchUpdateInput {
    return {
        home_score: newHomeScore,
        away_score: newAwayScore,
    };
}

export function nextPowerOf2(n: number): number {
    let p = 1;
    while (p < n) p *= 2;
    return p;
}

export function buildRound1Pairings(
    seeding: (number | null)[],
): { home: number | null; away: number | null }[] {
    const n = seeding.length;
    return Array.from({ length: n / 2 }, (_, i) => ({
        home: seeding[i] ?? null,
        away: seeding[n - 1 - i] ?? null,
    }));
}

export function isCreditedToHomeTeam(
    homeTeamId: number,
    eventTeamId: number,
    type: MatchEventType,
    wasOwnGoal?: boolean,
): boolean {
    if (type === MatchEventType.own_goal) {
        return eventTeamId !== homeTeamId;
    }
    if (type === MatchEventType.goal_disallowed && wasOwnGoal) {
        return eventTeamId !== homeTeamId;
    }
    return eventTeamId === homeTeamId;
}

type LineupRow = {
    player_id: number;
    team_id: number;
    position: PlayerPosition;
    lineup_type: 'starter' | 'substitute';
    is_captain: boolean;
    minute_in: number | null;
    minute_out: number | null;
    player: { user: { name: string } };
};

type JerseyLookupRow = {
    team_id: number;
    player_id: number;
    jersey_number: number;
};

// FIX (thiếu field để tính giờ thực cho thẻ): trước đây type này chỉ có
// player_id/team_id/type/minute/added_minute — đủ cho stat đếm số nhưng
// KHÔNG đủ để tính clockTime (cần period + time_source + created_at, giống
// hệt cách buildGoalsTimeline() đã tính cho bàn thắng). Data này ĐÃ có sẵn
// trong DB và đã nằm trong MATCH_EVENT_SELECT — chỉ là chưa được truyền
// qua type này. Mở rộng để card cũng hiện được giờ thực trong report/PDF.
type EventRow = {
    player_id: number | null;
    team_id: number | null;
    type: MatchEventType;
    minute: number | null;
    added_minute: number | null;
    period: MatchPeriod | null;
    time_source: 'live' | 'estimated';
    created_at: Date;
};

export function buildMatchReportPlayerRows(
    lineup: LineupRow[],
    jerseyLookup: JerseyLookupRow[],
    events: EventRow[],
    teamId: number,
    scheduledAt: Date | null, // NEW — cần cho computeEventClockTime, xem toEntries bên dưới
): MatchReportPlayerRow[] {
    const jerseyMap = new Map<string, number>();
    for (const j of jerseyLookup) jerseyMap.set(`${j.team_id}:${j.player_id}`, j.jersey_number);

    const eventsByPlayer = new Map<number, EventRow[]>();
    for (const ev of events) {
        if (!ev.player_id) continue;
        const arr = eventsByPlayer.get(ev.player_id) ?? [];
        arr.push(ev);
        eventsByPlayer.set(ev.player_id, arr);
    }

    // FIX: tính clockTime/clockConfidence cho MỌI loại event (không riêng
    // goal) — trước đây chỉ map minute/addedMinute, bỏ hoàn toàn giờ thực dù
    // computeEventClockTime() đã có sẵn và dùng chung được (chỉ cần period/
    // time_source/created_at, đều đã có trong EventRow mở rộng ở trên).
    const toEntries = (evs: EventRow[], types: MatchEventType[]): MatchReportEventEntry[] =>
        evs.filter(e => types.includes(e.type))
            .sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0))
            .map(e => {
                const clock = computeEventClockTime({ scheduled_at: scheduledAt }, e);
                return {
                    minute: e.minute,
                    addedMinute: e.added_minute,
                    clockTime: clock?.time ?? null,
                    clockConfidence: clock?.confidence ?? null,
                };
            });

    return lineup
        .filter(l => l.team_id === teamId)
        .map(l => {
            const evs = eventsByPlayer.get(l.player_id) ?? [];
            return {
                playerId: l.player_id,
                jerseyNumber: jerseyMap.get(`${teamId}:${l.player_id}`) ?? null,
                fullName: l.player.user.name,
                position: l.position,
                isCaptain: l.is_captain,
                isStarting: l.lineup_type === 'starter',
                minuteIn: l.minute_in,
                minuteOut: l.minute_out,
                goals: toEntries(evs, [MatchEventType.goal, MatchEventType.penalty_scored]),
                ownGoals: toEntries(evs, [MatchEventType.own_goal]),
                yellowCards: toEntries(evs, [MatchEventType.yellow_card]),
                redCards: toEntries(evs, [MatchEventType.red_card, MatchEventType.second_yellow]),
            };
        })
        .sort((a, b) => Number(b.isStarting) - Number(a.isStarting) || (a.jerseyNumber ?? 999) - (b.jerseyNumber ?? 999));
}

export function buildGoalsTimeline(
    events: {
        player_id: number | null; team_id: number | null; type: MatchEventType; period: MatchPeriod | null;
        minute: number | null; added_minute: number | null,
        time_source: 'live' | 'estimated',
        created_at: Date,
    }[],
    homeTeamId: number,
    awayTeamId: number,
    playerNameLookup: Map<number, string>,
    scheduledAt: Date | null
): { home: MatchReportGoalEntry[]; away: MatchReportGoalEntry[] } {
    const home: MatchReportGoalEntry[] = [];
    const away: MatchReportGoalEntry[] = [];

    for (const ev of events) {
        if (!ev.player_id || ev.team_id === null) continue;

        const isGoalType = ev.type === MatchEventType.goal || ev.type === MatchEventType.penalty_scored;
        const isOwnGoal = ev.type === MatchEventType.own_goal;
        if (!isGoalType && !isOwnGoal) continue;

        const creditedHome = isCreditedToHomeTeam(homeTeamId, ev.team_id, ev.type);
        const clock = computeEventClockTime({ scheduled_at: scheduledAt }, ev);

        const entry: MatchReportGoalEntry = {
            playerName: playerNameLookup.get(ev.player_id) ?? 'Unknown',
            minute: ev.minute,
            addedMinute: ev.added_minute,
            isOwnGoal,
            clockTime: clock?.time ?? null,
            clockConfidence: clock?.confidence ?? null,
        };

        (creditedHome ? home : away).push(entry);
    }

    const byMinute = (a: MatchReportGoalEntry, b: MatchReportGoalEntry) => (a.minute ?? 0) - (b.minute ?? 0);
    return { home: home.sort(byMinute), away: away.sort(byMinute) };
}

export function formatMinuteLabel(e: MatchReportGoalEntry): string {
    const base = e.addedMinute ? `${e.minute}+${e.addedMinute}'` : `${e.minute}'`;
    return e.isOwnGoal ? `${base} (OG)` : base;
}
export function formatClockLabel(e: MatchReportGoalEntry): string | null {
    if (!e.clockTime) return null;
    const hh = e.clockTime.getHours().toString().padStart(2, '0');
    const mm = e.clockTime.getMinutes().toString().padStart(2, '0');
    const prefix = e.clockConfidence === 'estimated' ? '~' : '';
    return `${prefix}${hh}:${mm}`;
}
export function assertMinuteInBounds(
    period: MatchPeriod | null | undefined,
    minute: number | null | undefined,
    addedMinute?: number | null,
): void {
    if (period === MatchPeriod.penalty_shootout) return;

    if (minute === null || minute === undefined || !Number.isInteger(minute)) {
        throw createAppError('VALIDATION_ERROR', `minute phải là số nguyên, nhận được: ${minute}`);
    }
    if (addedMinute != null) {
        if (!Number.isInteger(addedMinute) || addedMinute < 0 || addedMinute > MAX_ADDED_MINUTE) {
            throw createAppError('VALIDATION_ERROR', `addedMinute phải trong khoảng 0-${MAX_ADDED_MINUTE}, nhận được: ${addedMinute}`);
        }
    }
    if (!period) {
        throw createAppError('CONFLICT', `Match chưa xác định period hiện tại — gọi transitionPeriod trước khi ghi event`);
    }
    const bounds = MINUTE_BOUNDS[period];
    if (!bounds) {
        throw createAppError('INTERNAL_SERVER_ERROR', `Không có minute bounds định nghĩa cho period '${period}'`);
    }
    const [min, max] = bounds;
    if (minute < min || minute > max) {
        throw createAppError(
            'VALIDATION_ERROR',
            `minute=${minute} không hợp lệ cho period '${period}' (khoảng cho phép: ${min}-${max})`,
        );
    }
}

export async function assertPlayerNotSentOff(
    tx: Prisma.TransactionClient,
    matchId: number,
    playerId: number | null | undefined,
): Promise<void> {
    if (!playerId) return;
    const sentOff = await tx.matchEvent.findFirst({
        where: {
            match_id: matchId,
            player_id: playerId,
            type: { in: [MatchEventType.red_card, MatchEventType.second_yellow] },
        },
        select: { id: true },
    });
    if (sentOff) {
        throw createAppError(
            'CONFLICT',
            `Player ${playerId} đã bị truất quyền thi đấu (thẻ đỏ/thẻ vàng thứ 2) trong trận ${matchId} — không thể ghi thêm sự kiện`,
        );
    }
}

export async function findAdvancedChildMatchId(
    tx: Prisma.TransactionClient,
    matchId: number,
): Promise<number | null> {
    const slot = await tx.bracketSlot.findFirst({
        where: { match_id: matchId },
        select: {
            fed_as_a: { select: { match_id: true } },
            fed_as_b: { select: { match_id: true } },
        },
    });
    return slot?.fed_as_a?.[0]?.match_id ?? slot?.fed_as_b?.[0]?.match_id ?? null;
}

export async function isKnockoutBracketSeeded(
    tx: Prisma.TransactionClient,
    seasonId: number,
): Promise<boolean> {
    const knockoutPhase = await tx.phase.findFirst({
        where: {
            season_id: seasonId,
            format: PhaseFormat.knockout,
            matches: { some: {} },
        },
        select: { id: true },
    });
    return knockoutPhase !== null;
}