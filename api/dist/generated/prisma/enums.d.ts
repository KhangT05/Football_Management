export declare const SeasonFormat: {
    readonly round_robin: "round_robin";
    readonly knockout: "knockout";
    readonly round_robin_knockout: "round_robin_knockout";
    readonly multi_round_robin_knockout: "multi_round_robin_knockout";
    readonly custom: "custom";
};
export type SeasonFormat = (typeof SeasonFormat)[keyof typeof SeasonFormat];
export declare const PhaseType: {
    readonly group_stage: "group_stage";
    readonly round_of_16: "round_of_16";
    readonly quarter_final: "quarter_final";
    readonly semi_final: "semi_final";
    readonly third_place: "third_place";
    readonly final: "final";
};
export type PhaseType = (typeof PhaseType)[keyof typeof PhaseType];
export declare const PhaseFormat: {
    readonly round_robin: "round_robin";
    readonly knockout: "knockout";
};
export type PhaseFormat = (typeof PhaseFormat)[keyof typeof PhaseFormat];
export declare const PhaseStatus: {
    readonly draft: "draft";
    readonly in_progress: "in_progress";
    readonly locked: "locked";
};
export type PhaseStatus = (typeof PhaseStatus)[keyof typeof PhaseStatus];
export declare const SeasonStatus: {
    readonly upcoming: "upcoming";
    readonly registration_open: "registration_open";
    readonly ongoing: "ongoing";
    readonly finished: "finished";
    readonly cancelled: "cancelled";
};
export type SeasonStatus = (typeof SeasonStatus)[keyof typeof SeasonStatus];
export declare const PitchType: {
    readonly san_5: "san_5";
    readonly san_7: "san_7";
    readonly san_11: "san_11";
};
export type PitchType = (typeof PitchType)[keyof typeof PitchType];
export declare const GroupStatus: {
    readonly DRAFT: "DRAFT";
    readonly LOCKED: "LOCKED";
    readonly SCHEDULED: "SCHEDULED";
    readonly SCHEDULE_FAILED: "SCHEDULE_FAILED";
};
export type GroupStatus = (typeof GroupStatus)[keyof typeof GroupStatus];
export declare const JerseyType: {
    readonly home: "home";
    readonly away: "away";
    readonly third: "third";
    readonly goalkeeper: "goalkeeper";
};
export type JerseyType = (typeof JerseyType)[keyof typeof JerseyType];
export declare const PlayerPosition: {
    readonly goalkeeper: "goalkeeper";
    readonly defender: "defender";
    readonly midfielder: "midfielder";
    readonly forward: "forward";
};
export type PlayerPosition = (typeof PlayerPosition)[keyof typeof PlayerPosition];
export declare const PlayerRole: {
    readonly player: "player";
    readonly captain: "captain";
    readonly vice_captain: "vice_captain";
};
export type PlayerRole = (typeof PlayerRole)[keyof typeof PlayerRole];
export declare const PlayerStatus: {
    readonly active: "active";
    readonly injured: "injured";
    readonly suspended: "suspended";
};
export type PlayerStatus = (typeof PlayerStatus)[keyof typeof PlayerStatus];
export declare const ApprovalStatus: {
    readonly pending: "pending";
    readonly approved: "approved";
    readonly rejected: "rejected";
};
export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];
export declare const LeaveReason: {
    readonly transferred: "transferred";
    readonly dropped: "dropped";
    readonly disqualified: "disqualified";
    readonly season_ended: "season_ended";
    readonly injured: "injured";
};
export type LeaveReason = (typeof LeaveReason)[keyof typeof LeaveReason];
export declare const SeasonTeamStatus: {
    readonly approved: "approved";
    readonly pending: "pending";
    readonly active: "active";
    readonly eliminated: "eliminated";
    readonly withdrawn: "withdrawn";
};
export type SeasonTeamStatus = (typeof SeasonTeamStatus)[keyof typeof SeasonTeamStatus];
export declare const LineupType: {
    readonly starter: "starter";
    readonly substitute: "substitute";
};
export type LineupType = (typeof LineupType)[keyof typeof LineupType];
export declare const MatchPlayerStatus: {
    readonly available: "available";
    readonly injured: "injured";
    readonly suspended: "suspended";
    readonly absent: "absent";
};
export type MatchPlayerStatus = (typeof MatchPlayerStatus)[keyof typeof MatchPlayerStatus];
export declare const MatchStatus: {
    readonly scheduled: "scheduled";
    readonly ongoing: "ongoing";
    readonly finished: "finished";
    readonly cancelled: "cancelled";
    readonly forfeited: "forfeited";
    readonly postponed: "postponed";
    readonly bye: "bye";
    readonly abandoned: "abandoned";
    readonly pending_official: "pending_official";
    readonly needs_review: "needs_review";
};
export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus];
export declare const MatchEventType: {
    readonly goal: "goal";
    readonly own_goal: "own_goal";
    readonly yellow_card: "yellow_card";
    readonly red_card: "red_card";
    readonly second_yellow: "second_yellow";
    readonly substitution_in: "substitution_in";
    readonly substitution_out: "substitution_out";
    readonly penalty_scored: "penalty_scored";
    readonly penalty_missed: "penalty_missed";
    readonly card_rescinded: "card_rescinded";
    readonly goal_disallowed: "goal_disallowed";
};
export type MatchEventType = (typeof MatchEventType)[keyof typeof MatchEventType];
export declare const MatchEventTimeSource: {
    readonly live: "live";
    readonly estimated: "estimated";
};
export type MatchEventTimeSource = (typeof MatchEventTimeSource)[keyof typeof MatchEventTimeSource];
export declare const CardColor: {
    readonly yellow: "yellow";
    readonly red: "red";
};
export type CardColor = (typeof CardColor)[keyof typeof CardColor];
export declare const MatchPeriod: {
    readonly first_half: "first_half";
    readonly second_half: "second_half";
    readonly extra_time_first: "extra_time_first";
    readonly extra_time_second: "extra_time_second";
    readonly penalty_shootout: "penalty_shootout";
};
export type MatchPeriod = (typeof MatchPeriod)[keyof typeof MatchPeriod];
export declare const MatchResultStatus: {
    readonly official: "official";
    readonly protested: "protested";
    readonly overturned: "overturned";
    readonly under_review: "under_review";
};
export type MatchResultStatus = (typeof MatchResultStatus)[keyof typeof MatchResultStatus];
export declare const MatchResultType: {
    readonly full_time: "full_time";
    readonly extra_time: "extra_time";
    readonly penalty: "penalty";
    readonly forfeit: "forfeit";
    readonly walkover: "walkover";
};
export type MatchResultType = (typeof MatchResultType)[keyof typeof MatchResultType];
export declare const NotificationSource: {
    readonly manual: "manual";
    readonly system: "system";
};
export type NotificationSource = (typeof NotificationSource)[keyof typeof NotificationSource];
export declare const NotificationType: {
    readonly match_schedule: "match_schedule";
    readonly match_result: "match_result";
    readonly standing_updated: "standing_updated";
    readonly registration_deadline: "registration_deadline";
    readonly team_advanced: "team_advanced";
    readonly payment_confirmed: "payment_confirmed";
    readonly payment_rejected: "payment_rejected";
    readonly player_approved: "player_approved";
    readonly player_rejected: "player_rejected";
    readonly team_approved: "team_approved";
    readonly team_rejected: "team_rejected";
    readonly general: "general";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export declare const PaymentStatus: {
    readonly pending: "pending";
    readonly confirmed: "confirmed";
    readonly rejected: "rejected";
    readonly refund_pending: "refund_pending";
    readonly refunded: "refunded";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const ArticleStatus: {
    readonly draft: "draft";
    readonly published: "published";
    readonly archived: "archived";
};
export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus];
export declare const MediaType: {
    readonly image: "image";
    readonly video: "video";
};
export type MediaType = (typeof MediaType)[keyof typeof MediaType];
//# sourceMappingURL=enums.d.ts.map