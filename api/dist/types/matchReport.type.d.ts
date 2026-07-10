import { MatchResultType, MatchStatus, PlayerPosition } from '../generated/prisma/client.js';
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
    goals: MatchReportEventEntry[];
    ownGoals: MatchReportEventEntry[];
    yellowCards: MatchReportEventEntry[];
    redCards: MatchReportEventEntry[];
}
export interface MatchReportOutput {
    matchId: number;
    playedAt: Date | null;
    venueName: string | null;
    referee: string | null;
    status: MatchStatus;
    resultType: MatchResultType;
    score: {
        homeHalfTime: number | null;
        awayHalfTime: number | null;
        homeFullTime: number | null;
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
//# sourceMappingURL=matchReport.type.d.ts.map