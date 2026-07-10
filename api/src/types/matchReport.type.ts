import { MatchEventType, MatchResultType, MatchStatus, PlayerPosition } from '../generated/prisma/client.js';
import { MatchReportGoalEntry } from '../helper/match.helper.js';

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

export interface MatchReportEventEntry {
    minute: number | null;
    addedMinute: number | null;
}

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
    // FIX: trước đây service tính goalsTimeline nhưng không đưa vào response —
    // biến chết, và PDF/UI không thể hiển thị timeline bàn thắng theo phút.
    goalsTimeline: {
        home: MatchReportGoalEntry[];
        away: MatchReportGoalEntry[];
    };
}