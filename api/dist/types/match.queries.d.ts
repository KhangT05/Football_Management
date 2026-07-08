import { Prisma } from '../generated/prisma/client.js';
declare const phaseWithRuleSelect: {
    select: {
        id: true;
        format: true;
        season: {
            select: {
                id: true;
                tournamentRule: {
                    select: {
                        yellow_cards_suspension: true;
                        forfeit_score: true;
                    };
                };
            };
        };
    };
};
export declare const matchListSelect: {
    id: true;
    status: true;
    round: true;
    leg: true;
    scheduled_at: true;
    played_at: true;
    home_score: true;
    away_score: true;
    current_period: true;
    is_published: true;
    referee: true;
    phase_id: true;
    group_id: true;
    home_team_id: true;
    away_team_id: true;
    home_team: {
        select: {
            id: true;
            name: true;
            logo: true;
        };
    };
    away_team: {
        select: {
            id: true;
            name: true;
            logo: true;
        };
    };
    venue: {
        select: {
            id: true;
            name: true;
            address: true;
        };
    };
    phase: {
        select: {
            id: true;
            name: true;
            format: true;
        };
    };
    matchResult: {
        select: {
            result_type: true;
            status: true;
            home_final_score: true;
            away_final_score: true;
        };
    };
};
export declare const matchDetailSelect: {
    postponed_from: true;
    postponed_reason: true;
    abandoned_minute: true;
    matchResult: {
        select: {
            id: true;
            winner_team_id: true;
            home_extra_time_score: true;
            away_extra_time_score: true;
            home_penalty_score: true;
            away_penalty_score: true;
            home_final_score: true;
            away_final_score: true;
            result_type: true;
            status: true;
            notes: true;
        };
    };
    events: {
        select: {
            id: true;
            type: true;
            minute: true;
            added_minute: true;
            period: true;
            team_id: true;
            player_id: true;
            card_color: true;
            note: true;
        };
        orderBy: ({
            minute: "asc";
            id?: undefined;
        } | {
            id: "asc";
            minute?: undefined;
        })[];
    };
    id: true;
    status: true;
    round: true;
    leg: true;
    scheduled_at: true;
    played_at: true;
    home_score: true;
    away_score: true;
    current_period: true;
    is_published: true;
    referee: true;
    phase_id: true;
    group_id: true;
    home_team_id: true;
    away_team_id: true;
    home_team: {
        select: {
            id: true;
            name: true;
            logo: true;
        };
    };
    away_team: {
        select: {
            id: true;
            name: true;
            logo: true;
        };
    };
    venue: {
        select: {
            id: true;
            name: true;
            address: true;
        };
    };
    phase: {
        select: {
            id: true;
            name: true;
            format: true;
        };
    };
};
export declare const matchForConfirmSelect: {
    id: true;
    status: true;
    home_team_id: true;
    away_team_id: true;
    group_id: true;
    phase_id: true;
    phase: {
        select: {
            id: true;
            format: true;
            season: {
                select: {
                    id: true;
                    tournamentRule: {
                        select: {
                            yellow_cards_suspension: true;
                            forfeit_score: true;
                        };
                    };
                };
            };
        };
    };
    matchResult: {
        select: {
            id: true;
        };
    };
};
export declare const matchForOverrideSelect: {
    id: true;
    home_team_id: true;
    away_team_id: true;
    group_id: true;
    phase: {
        select: {
            format: true;
            season: {
                select: {
                    id: true;
                };
            };
        };
    };
    matchResult: {
        select: {
            id: true;
            result_type: true;
        };
    };
};
export declare const matchForFinalizeSelect: {
    id: true;
    status: true;
    home_team_id: true;
    group_id: true;
    phase: {
        select: {
            format: true;
        };
    };
};
export declare const matchForForfeitSelect: {
    id: true;
    status: true;
    home_team_id: true;
    away_team_id: true;
    phase: {
        select: {
            id: true;
            format: true;
            season: {
                select: {
                    id: true;
                    tournamentRule: {
                        select: {
                            yellow_cards_suspension: true;
                            forfeit_score: true;
                        };
                    };
                };
            };
        };
    };
};
export declare const Select: {
    is_active: true;
    created_at: true;
    updated_at: true;
    deleted_at: true;
    user_id: true;
    matchResult: {
        select: {
            appeal_reason: true;
            appeal_note: true;
            duration: true;
            is_active: true;
            created_at: true;
            updated_at: true;
            id: true;
            winner_team_id: true;
            home_extra_time_score: true;
            away_extra_time_score: true;
            home_penalty_score: true;
            away_penalty_score: true;
            home_final_score: true;
            away_final_score: true;
            result_type: true;
            status: true;
            notes: true;
        };
    };
    postponed_from: true;
    postponed_reason: true;
    abandoned_minute: true;
    events: {
        select: {
            id: true;
            type: true;
            minute: true;
            added_minute: true;
            period: true;
            team_id: true;
            player_id: true;
            card_color: true;
            note: true;
        };
        orderBy: ({
            minute: "asc";
            id?: undefined;
        } | {
            id: "asc";
            minute?: undefined;
        })[];
    };
    id: true;
    status: true;
    round: true;
    leg: true;
    scheduled_at: true;
    played_at: true;
    home_score: true;
    away_score: true;
    current_period: true;
    is_published: true;
    referee: true;
    phase_id: true;
    group_id: true;
    home_team_id: true;
    away_team_id: true;
    home_team: {
        select: {
            id: true;
            name: true;
            logo: true;
        };
    };
    away_team: {
        select: {
            id: true;
            name: true;
            logo: true;
        };
    };
    venue: {
        select: {
            id: true;
            name: true;
            address: true;
        };
    };
    phase: {
        select: {
            id: true;
            name: true;
            format: true;
        };
    };
};
export type MatchList = Prisma.MatchGetPayload<{
    select: typeof matchListSelect;
}>;
export type MatchDetail = Prisma.MatchGetPayload<{
    select: typeof matchDetailSelect;
}>;
export type MatchForConfirm = Prisma.MatchGetPayload<{
    select: typeof matchForConfirmSelect;
}>;
export type MatchForOverride = Prisma.MatchGetPayload<{
    select: typeof matchForOverrideSelect;
}>;
export type MatchForFinalize = Prisma.MatchGetPayload<{
    select: typeof matchForFinalizeSelect;
}>;
export type MatchForForfeit = Prisma.MatchGetPayload<{
    select: typeof matchForForfeitSelect;
}>;
export { phaseWithRuleSelect };
//# sourceMappingURL=match.queries.d.ts.map