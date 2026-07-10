import { Prisma } from '../generated/prisma/client.js';
import { MatchReportOutput } from '../types/matchReport.type.js';
export declare const matchForReportSelect: {
    id: true;
    played_at: true;
    referee: true;
    status: true;
    home_score: true;
    away_score: true;
    home_team_id: true;
    away_team_id: true;
    venue: {
        select: {
            name: true;
        };
    };
    home_team: {
        select: {
            id: true;
            name: true;
        };
    };
    away_team: {
        select: {
            id: true;
            name: true;
        };
    };
    matchJerseyAssignment: {
        select: {
            team_id: true;
            season_jersey: {
                select: {
                    image_url: true;
                    primary_color: true;
                    secondary_color: true;
                };
            };
        };
    };
    matchLineups: {
        select: {
            player_id: true;
            team_id: true;
            position: true;
            lineup_type: true;
            is_captain: true;
            minute_in: true;
            minute_out: true;
            player: {
                select: {
                    user: {
                        select: {
                            name: true;
                        };
                    };
                };
            };
        };
    };
    events: {
        select: {
            id: true;
            player_id: true;
            team_id: true;
            type: true;
            period: true;
            minute: true;
            added_minute: true;
        };
        orderBy: ({
            minute: "asc";
            id?: undefined;
        } | {
            id: "asc";
            minute?: undefined;
        })[];
    };
    matchResult: {
        select: {
            winner_team_id: true;
            home_extra_time_score: true;
            away_extra_time_score: true;
            home_penalty_score: true;
            away_penalty_score: true;
            home_final_score: true;
            away_final_score: true;
            result_type: true;
        };
    };
};
export type MatchForReport = Prisma.MatchGetPayload<{
    select: typeof matchForReportSelect;
}>;
export declare class MatchReportService {
    buildMatchReport(matchId: number): Promise<MatchReportOutput>;
    renderMatchReportPdf(matchId: number): Promise<Buffer>;
    private fetchMatchForReport;
    private resolveJersey;
    private buildTeamInfo;
    private fetchJerseyLookup;
    private computeHalfTimeScore;
}
//# sourceMappingURL=match.report.d.ts.map