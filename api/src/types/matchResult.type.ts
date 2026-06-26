import { MatchResultType, MatchStatus } from '../generated/prisma/client.js';
import { ScheduleOptions } from './schedule.type.js';

export interface ConfirmResultInput {
    homeScore: number;
    awayScore: number;
    resultType: MatchResultType;

    // Half-time snapshot — optional, chỉ dùng cho display (không ảnh hưởng winner logic)
    homeHalfTimeScore?: number;
    awayHalfTimeScore?: number;

    // ET score — cumulative (90+ET), bắt buộc nếu resultType = extra_time | penalty (knockout)
    // Nếu undefined + resultType = extra_time/penalty → _resolveWinner fallback về homeScore
    homeExtraTime?: number;
    awayExtraTime?: number;

    // Penalty tiebreaker — bắt buộc nếu resultType = penalty
    homePenalty?: number;
    awayPenalty?: number;

    notes?: string;
}

export interface ConfirmResultOutput {
    matchResultId: number;
    winnerTeamId: number | null;
    standingUpdated: boolean;   // true nếu round_robin + standings đã recompute
    knockoutAdvanced: boolean;  // true nếu knockout và match mới được tạo
    newMatchId?: number;
}

// Internal — trả từ _resolveWinner, không expose ra ngoài
export interface WinnerResolution {
    winnerTeamId: number | null;
    homeFinal: number;  // score dùng để determine winner và lưu vào home_final_score
    awayFinal: number;
}

// MatchResult.status sau khi confirm — mặc định là official
// forfeit/walkover → forfeited (Match.status = forfeited, không qua pending_official)
// full_time/extra_time/penalty → finished (qua pending_official → confirmOfficial)
// Các type không có trong map → MatchStatus.finished (default trong confirmResult)
export const STATUS_BY_RESULT_TYPE: Partial<Record<MatchResultType, MatchStatus>> = {
    [MatchResultType.forfeit]: MatchStatus.forfeited,
    [MatchResultType.walkover]: MatchStatus.forfeited,
    // full_time/extra_time/penalty không list ở đây → caller dùng MatchStatus.finished
};

export interface ConfirmOfficialBody {
    /**
     * resultType: MatchResultType — full_time | extra_time | penalty | forfeit | walkover
     * - full_time: homeScore + awayScore bắt buộc
     * - extra_time: thêm homeExtraTime + awayExtraTime (cumulative 90+ET)
     * - penalty: thêm homePenalty + awayPenalty (không được hoà)
     * - forfeit / walkover: score theo forfeit_score trong TournamentRule
     */
    input: ConfirmResultInput;
    scheduleOptions: ScheduleOptions;
}
export type StandingAccum = {
    teamId: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    yellowCards: number;
    redCards: number;
    points: number;
};

export type H2HRecord = {
    goalsFor: number;
    goalsAgainst: number;
    points: number;
};