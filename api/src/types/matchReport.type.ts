import { MatchResultType, MatchStatus, PlayerPosition } from '../generated/prisma/client.js';
import { MatchReportEventEntry, MatchReportGoalEntry } from '../helper/match.helper.js';

export interface MatchReportJerseyInfo {
    logoUrl: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
}

export interface MatchReportTeamInfo {
    id: number;
    name: string;
    jersey: MatchReportJerseyInfo;
}

// FIX (row/type thừa): trước đây file này tự khai `MatchReportEventEntry`
// riêng (chỉ minute/addedMinute), TRÙNG với field lõi của `MatchReportGoalEntry`
// bên match.helper.ts (minute/addedMinute + clockTime/clockConfidence). 2 khai
// báo cùng ý nghĩa ở 2 nơi khiến lần thêm "giờ thực" trước chỉ sửa được phía
// goal, quên mất phía card (thẻ vàng/đỏ) — vì nó dùng type riêng ở đây, không
// liên quan gì tới type bên kia. Giờ import lại từ match.helper.ts — 1 nguồn
// duy nhất, card cũng tự động có clockTime/clockConfidence.
export interface MatchReportPlayerRow {
    playerId: number;
    jerseyNumber: number | null;
    fullName: string;
    position: PlayerPosition;
    isCaptain: boolean;
    isStarting: boolean;
    minuteIn: number | null;
    minuteOut: number | null;
    goals: MatchReportEventEntry[];        // GB
    ownGoals: MatchReportEventEntry[];     // PLN
    yellowCards: MatchReportEventEntry[];  // TV
    redCards: MatchReportEventEntry[];     // TĐ — gồm red_card + second_yellow
}

export interface MatchReportOutput {
    matchId: number;
    playedAt: Date | null;
    venueName: string | null;
    referee: string | null; // schema chỉ hỗ trợ 1 trọng tài, xem note
    status: MatchStatus;
    resultType: MatchResultType;
    score: {
        homeHalfTime: number | null;
        awayHalfTime: number | null;
        homeFullTime: number | null;   // Match.home_score
        awayFullTime: number | null;
        homeExtraTime: number | null;
        awayExtraTime: number | null;
        homePenalty: number | null;
        awayPenalty: number | null;
        homeFinal: number;
        awayFinal: number;
    };
    winnerTeamId: number | null;
    home: MatchReportTeamInfo;
    away: MatchReportTeamInfo;
    lineups: {
        home: MatchReportPlayerRow[];
        away: MatchReportPlayerRow[];
    };
    goalsTimeline: {
        home: MatchReportGoalEntry[];
        away: MatchReportGoalEntry[];
    };
}