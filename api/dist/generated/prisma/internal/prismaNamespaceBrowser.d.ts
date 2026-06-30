import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Role: "Role";
    readonly User_Role: "User_Role";
    readonly Tournament: "Tournament";
    readonly TournamentRule: "TournamentRule";
    readonly Phase: "Phase";
    readonly BracketSlot: "BracketSlot";
    readonly Season: "Season";
    readonly Group: "Group";
    readonly Team: "Team";
    readonly MatchJerseyAssignment: "MatchJerseyAssignment";
    readonly Player: "Player";
    readonly TeamPlayer: "TeamPlayer";
    readonly TeamLeader: "TeamLeader";
    readonly SeasonTeam: "SeasonTeam";
    readonly SeasonTeamJersey: "SeasonTeamJersey";
    readonly Venue: "Venue";
    readonly MatchLineup: "MatchLineup";
    readonly Match: "Match";
    readonly MatchEvent: "MatchEvent";
    readonly TeamStanding: "TeamStanding";
    readonly PlayerStatistic: "PlayerStatistic";
    readonly MatchResult: "MatchResult";
    readonly Notification: "Notification";
    readonly Payment: "Payment";
    readonly Article: "Article";
    readonly ArticleTag: "ArticleTag";
    readonly ArticleMedia: "ArticleMedia";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly password: "password";
    readonly phone: "phone";
    readonly is_active: "is_active";
    readonly email_verified: "email_verified";
    readonly email_verified_at: "email_verified_at";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const RoleScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum];
export declare const User_RoleScalarFieldEnum: {
    readonly user_id: "user_id";
    readonly role_id: "role_id";
};
export type User_RoleScalarFieldEnum = (typeof User_RoleScalarFieldEnum)[keyof typeof User_RoleScalarFieldEnum];
export declare const TournamentScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly logo: "logo";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
    readonly user_id: "user_id";
};
export type TournamentScalarFieldEnum = (typeof TournamentScalarFieldEnum)[keyof typeof TournamentScalarFieldEnum];
export declare const TournamentRuleScalarFieldEnum: {
    readonly id: "id";
    readonly tournament_id: "tournament_id";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
    readonly points_per_win: "points_per_win";
    readonly points_per_draw: "points_per_draw";
    readonly points_per_loss: "points_per_loss";
    readonly forfeit_score: "forfeit_score";
    readonly yellow_cards_suspension: "yellow_cards_suspension";
    readonly max_players_per_team: "max_players_per_team";
    readonly min_players_per_team: "min_players_per_team";
    readonly teams_advance_per_group: "teams_advance_per_group";
    readonly tiebreaker_order: "tiebreaker_order";
    readonly user_id: "user_id";
};
export type TournamentRuleScalarFieldEnum = (typeof TournamentRuleScalarFieldEnum)[keyof typeof TournamentRuleScalarFieldEnum];
export declare const PhaseScalarFieldEnum: {
    readonly id: "id";
    readonly season_id: "season_id";
    readonly name: "name";
    readonly type: "type";
    readonly format: "format";
    readonly order: "order";
    readonly start_date: "start_date";
    readonly end_date: "end_date";
    readonly min_rest_days_per_team: "min_rest_days_per_team";
    readonly is_active: "is_active";
    readonly legs: "legs";
    readonly status: "status";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type PhaseScalarFieldEnum = (typeof PhaseScalarFieldEnum)[keyof typeof PhaseScalarFieldEnum];
export declare const BracketSlotScalarFieldEnum: {
    readonly id: "id";
    readonly phase_id: "phase_id";
    readonly round: "round";
    readonly slot_number: "slot_number";
    readonly match_id: "match_id";
    readonly source_a_slot_id: "source_a_slot_id";
    readonly source_b_slot_id: "source_b_slot_id";
    readonly seeded_home_team_id: "seeded_home_team_id";
    readonly seeded_away_team_id: "seeded_away_team_id";
    readonly is_bye: "is_bye";
};
export type BracketSlotScalarFieldEnum = (typeof BracketSlotScalarFieldEnum)[keyof typeof BracketSlotScalarFieldEnum];
export declare const SeasonScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly status: "status";
    readonly start_date: "start_date";
    readonly end_date: "end_date";
    readonly registration_deadline: "registration_deadline";
    readonly max_teams: "max_teams";
    readonly is_registration_open: "is_registration_open";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
    readonly registration_fee: "registration_fee";
    readonly tournament_id: "tournament_id";
    readonly user_id: "user_id";
};
export type SeasonScalarFieldEnum = (typeof SeasonScalarFieldEnum)[keyof typeof SeasonScalarFieldEnum];
export declare const GroupScalarFieldEnum: {
    readonly id: "id";
    readonly phase_id: "phase_id";
    readonly name: "name";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly scheduleGeneratedAt: "scheduleGeneratedAt";
    readonly status: "status";
};
export type GroupScalarFieldEnum = (typeof GroupScalarFieldEnum)[keyof typeof GroupScalarFieldEnum];
export declare const TeamScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly coach_name: "coach_name";
    readonly logo: "logo";
    readonly description: "description";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
    readonly user_id: "user_id";
};
export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum];
export declare const MatchJerseyAssignmentScalarFieldEnum: {
    readonly id: "id";
    readonly match_id: "match_id";
    readonly team_id: "team_id";
    readonly season_jersey_id: "season_jersey_id";
};
export type MatchJerseyAssignmentScalarFieldEnum = (typeof MatchJerseyAssignmentScalarFieldEnum)[keyof typeof MatchJerseyAssignmentScalarFieldEnum];
export declare const PlayerScalarFieldEnum: {
    readonly id: "id";
    readonly date_of_birth: "date_of_birth";
    readonly position: "position";
    readonly height: "height";
    readonly weight: "weight";
    readonly nationality: "nationality";
    readonly avatar: "avatar";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
    readonly user_id: "user_id";
};
export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum];
export declare const TeamPlayerScalarFieldEnum: {
    readonly id: "id";
    readonly team_id: "team_id";
    readonly player_id: "player_id";
    readonly jersey_number: "jersey_number";
    readonly position: "position";
    readonly role: "role";
    readonly status: "status";
    readonly approval_status: "approval_status";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
    readonly user_id: "user_id";
};
export type TeamPlayerScalarFieldEnum = (typeof TeamPlayerScalarFieldEnum)[keyof typeof TeamPlayerScalarFieldEnum];
export declare const TeamLeaderScalarFieldEnum: {
    readonly id: "id";
    readonly team_id: "team_id";
    readonly user_id: "user_id";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
};
export type TeamLeaderScalarFieldEnum = (typeof TeamLeaderScalarFieldEnum)[keyof typeof TeamLeaderScalarFieldEnum];
export declare const SeasonTeamScalarFieldEnum: {
    readonly id: "id";
    readonly season_id: "season_id";
    readonly team_id: "team_id";
    readonly status: "status";
    readonly seed: "seed";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
    readonly group_id: "group_id";
    readonly user_id: "user_id";
};
export type SeasonTeamScalarFieldEnum = (typeof SeasonTeamScalarFieldEnum)[keyof typeof SeasonTeamScalarFieldEnum];
export declare const SeasonTeamJerseyScalarFieldEnum: {
    readonly id: "id";
    readonly season_team_id: "season_team_id";
    readonly type: "type";
    readonly primary_color: "primary_color";
    readonly secondary_color: "secondary_color";
    readonly image_url: "image_url";
};
export type SeasonTeamJerseyScalarFieldEnum = (typeof SeasonTeamJerseyScalarFieldEnum)[keyof typeof SeasonTeamJerseyScalarFieldEnum];
export declare const VenueScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly address: "address";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
};
export type VenueScalarFieldEnum = (typeof VenueScalarFieldEnum)[keyof typeof VenueScalarFieldEnum];
export declare const MatchLineupScalarFieldEnum: {
    readonly id: "id";
    readonly match_id: "match_id";
    readonly team_id: "team_id";
    readonly player_id: "player_id";
    readonly position: "position";
    readonly lineup_type: "lineup_type";
    readonly is_captain: "is_captain";
    readonly minute_in: "minute_in";
    readonly minute_out: "minute_out";
    readonly status: "status";
    readonly created_at: "created_at";
};
export type MatchLineupScalarFieldEnum = (typeof MatchLineupScalarFieldEnum)[keyof typeof MatchLineupScalarFieldEnum];
export declare const MatchScalarFieldEnum: {
    readonly id: "id";
    readonly phase_id: "phase_id";
    readonly group_id: "group_id";
    readonly home_team_id: "home_team_id";
    readonly away_team_id: "away_team_id";
    readonly scheduled_at: "scheduled_at";
    readonly played_at: "played_at";
    readonly home_score: "home_score";
    readonly away_score: "away_score";
    readonly status: "status";
    readonly round: "round";
    readonly leg: "leg";
    readonly current_period: "current_period";
    readonly postponed_from: "postponed_from";
    readonly postponed_reason: "postponed_reason";
    readonly replay_of_match_id: "replay_of_match_id";
    readonly abandoned_minute: "abandoned_minute";
    readonly pending_official_at: "pending_official_at";
    readonly finalize_result_type: "finalize_result_type";
    readonly finalize_home_half_time: "finalize_home_half_time";
    readonly finalize_away_half_time: "finalize_away_half_time";
    readonly finalize_home_penalty: "finalize_home_penalty";
    readonly finalize_away_penalty: "finalize_away_penalty";
    readonly manual_home_score: "manual_home_score";
    readonly manual_away_score: "manual_away_score";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
    readonly user_id: "user_id";
    readonly venue_id: "venue_id";
    readonly is_published: "is_published";
    readonly referee: "referee";
};
export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum];
export declare const MatchEventScalarFieldEnum: {
    readonly id: "id";
    readonly match_id: "match_id";
    readonly player_id: "player_id";
    readonly team_id: "team_id";
    readonly type: "type";
    readonly minute: "minute";
    readonly note: "note";
    readonly period: "period";
    readonly added_minute: "added_minute";
    readonly card_color: "card_color";
    readonly sub_out_player_id: "sub_out_player_id";
    readonly created_at: "created_at";
};
export type MatchEventScalarFieldEnum = (typeof MatchEventScalarFieldEnum)[keyof typeof MatchEventScalarFieldEnum];
export declare const TeamStandingScalarFieldEnum: {
    readonly id: "id";
    readonly team_id: "team_id";
    readonly group_id: "group_id";
    readonly season_id: "season_id";
    readonly position: "position";
    readonly matches_played: "matches_played";
    readonly wins: "wins";
    readonly draws: "draws";
    readonly losses: "losses";
    readonly goals_for: "goals_for";
    readonly goals_against: "goals_against";
    readonly points: "points";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
};
export type TeamStandingScalarFieldEnum = (typeof TeamStandingScalarFieldEnum)[keyof typeof TeamStandingScalarFieldEnum];
export declare const PlayerStatisticScalarFieldEnum: {
    readonly id: "id";
    readonly player_id: "player_id";
    readonly team_id: "team_id";
    readonly season_id: "season_id";
    readonly matches_played: "matches_played";
    readonly goals_scored: "goals_scored";
    readonly assists: "assists";
    readonly yellow_cards: "yellow_cards";
    readonly red_cards: "red_cards";
    readonly minutes_played: "minutes_played";
    readonly accumulated_yellow_cards: "accumulated_yellow_cards";
    readonly is_suspended: "is_suspended";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type PlayerStatisticScalarFieldEnum = (typeof PlayerStatisticScalarFieldEnum)[keyof typeof PlayerStatisticScalarFieldEnum];
export declare const MatchResultScalarFieldEnum: {
    readonly id: "id";
    readonly match_id: "match_id";
    readonly winner_team_id: "winner_team_id";
    readonly home_extra_time_score: "home_extra_time_score";
    readonly away_extra_time_score: "away_extra_time_score";
    readonly home_penalty_score: "home_penalty_score";
    readonly away_penalty_score: "away_penalty_score";
    readonly home_final_score: "home_final_score";
    readonly away_final_score: "away_final_score";
    readonly result_type: "result_type";
    readonly status: "status";
    readonly duration: "duration";
    readonly notes: "notes";
    readonly appeal_reason: "appeal_reason";
    readonly appeal_note: "appeal_note";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
};
export type MatchResultScalarFieldEnum = (typeof MatchResultScalarFieldEnum)[keyof typeof MatchResultScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly content: "content";
    readonly type: "type";
    readonly source: "source";
    readonly season_id: "season_id";
    readonly target_team_id: "target_team_id";
    readonly recipient_user_id: "recipient_user_id";
    readonly is_read: "is_read";
    readonly ref_entity_type: "ref_entity_type";
    readonly ref_entity_id: "ref_entity_id";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly season_team_id: "season_team_id";
    readonly amount: "amount";
    readonly status: "status";
    readonly transaction_ref: "transaction_ref";
    readonly paid_at: "paid_at";
    readonly confirmed_at: "confirmed_at";
    readonly confirmed_by: "confirmed_by";
    readonly refunded_at: "refunded_at";
    readonly refunded_by: "refunded_by";
    readonly refund_amount: "refund_amount";
    readonly vnp_transaction_no: "vnp_transaction_no";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const ArticleScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly slug: "slug";
    readonly content: "content";
    readonly cover_image: "cover_image";
    readonly status: "status";
    readonly user_id: "user_id";
    readonly season_id: "season_id";
    readonly match_id: "match_id";
    readonly team_id: "team_id";
    readonly published_at: "published_at";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
};
export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum];
export declare const ArticleTagScalarFieldEnum: {
    readonly id: "id";
    readonly article_id: "article_id";
    readonly tag: "tag";
};
export type ArticleTagScalarFieldEnum = (typeof ArticleTagScalarFieldEnum)[keyof typeof ArticleTagScalarFieldEnum];
export declare const ArticleMediaScalarFieldEnum: {
    readonly id: "id";
    readonly article_id: "article_id";
    readonly type: "type";
    readonly url: "url";
    readonly caption: "caption";
    readonly order: "order";
    readonly created_at: "created_at";
};
export type ArticleMediaScalarFieldEnum = (typeof ArticleMediaScalarFieldEnum)[keyof typeof ArticleMediaScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const UserOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly email: "email";
    readonly password: "password";
    readonly phone: "phone";
};
export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum];
export declare const RoleOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly description: "description";
};
export type RoleOrderByRelevanceFieldEnum = (typeof RoleOrderByRelevanceFieldEnum)[keyof typeof RoleOrderByRelevanceFieldEnum];
export declare const TournamentOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly description: "description";
    readonly logo: "logo";
};
export type TournamentOrderByRelevanceFieldEnum = (typeof TournamentOrderByRelevanceFieldEnum)[keyof typeof TournamentOrderByRelevanceFieldEnum];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const PhaseOrderByRelevanceFieldEnum: {
    readonly name: "name";
};
export type PhaseOrderByRelevanceFieldEnum = (typeof PhaseOrderByRelevanceFieldEnum)[keyof typeof PhaseOrderByRelevanceFieldEnum];
export declare const SeasonOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly description: "description";
};
export type SeasonOrderByRelevanceFieldEnum = (typeof SeasonOrderByRelevanceFieldEnum)[keyof typeof SeasonOrderByRelevanceFieldEnum];
export declare const GroupOrderByRelevanceFieldEnum: {
    readonly name: "name";
};
export type GroupOrderByRelevanceFieldEnum = (typeof GroupOrderByRelevanceFieldEnum)[keyof typeof GroupOrderByRelevanceFieldEnum];
export declare const TeamOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly coach_name: "coach_name";
    readonly logo: "logo";
    readonly description: "description";
};
export type TeamOrderByRelevanceFieldEnum = (typeof TeamOrderByRelevanceFieldEnum)[keyof typeof TeamOrderByRelevanceFieldEnum];
export declare const PlayerOrderByRelevanceFieldEnum: {
    readonly nationality: "nationality";
    readonly avatar: "avatar";
};
export type PlayerOrderByRelevanceFieldEnum = (typeof PlayerOrderByRelevanceFieldEnum)[keyof typeof PlayerOrderByRelevanceFieldEnum];
export declare const SeasonTeamJerseyOrderByRelevanceFieldEnum: {
    readonly primary_color: "primary_color";
    readonly secondary_color: "secondary_color";
    readonly image_url: "image_url";
};
export type SeasonTeamJerseyOrderByRelevanceFieldEnum = (typeof SeasonTeamJerseyOrderByRelevanceFieldEnum)[keyof typeof SeasonTeamJerseyOrderByRelevanceFieldEnum];
export declare const VenueOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly address: "address";
};
export type VenueOrderByRelevanceFieldEnum = (typeof VenueOrderByRelevanceFieldEnum)[keyof typeof VenueOrderByRelevanceFieldEnum];
export declare const MatchOrderByRelevanceFieldEnum: {
    readonly round: "round";
    readonly postponed_reason: "postponed_reason";
    readonly referee: "referee";
};
export type MatchOrderByRelevanceFieldEnum = (typeof MatchOrderByRelevanceFieldEnum)[keyof typeof MatchOrderByRelevanceFieldEnum];
export declare const MatchEventOrderByRelevanceFieldEnum: {
    readonly note: "note";
};
export type MatchEventOrderByRelevanceFieldEnum = (typeof MatchEventOrderByRelevanceFieldEnum)[keyof typeof MatchEventOrderByRelevanceFieldEnum];
export declare const MatchResultOrderByRelevanceFieldEnum: {
    readonly notes: "notes";
    readonly appeal_reason: "appeal_reason";
    readonly appeal_note: "appeal_note";
};
export type MatchResultOrderByRelevanceFieldEnum = (typeof MatchResultOrderByRelevanceFieldEnum)[keyof typeof MatchResultOrderByRelevanceFieldEnum];
export declare const NotificationOrderByRelevanceFieldEnum: {
    readonly title: "title";
    readonly content: "content";
    readonly ref_entity_type: "ref_entity_type";
};
export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum];
export declare const PaymentOrderByRelevanceFieldEnum: {
    readonly transaction_ref: "transaction_ref";
    readonly vnp_transaction_no: "vnp_transaction_no";
};
export type PaymentOrderByRelevanceFieldEnum = (typeof PaymentOrderByRelevanceFieldEnum)[keyof typeof PaymentOrderByRelevanceFieldEnum];
export declare const ArticleOrderByRelevanceFieldEnum: {
    readonly title: "title";
    readonly slug: "slug";
    readonly content: "content";
    readonly cover_image: "cover_image";
};
export type ArticleOrderByRelevanceFieldEnum = (typeof ArticleOrderByRelevanceFieldEnum)[keyof typeof ArticleOrderByRelevanceFieldEnum];
export declare const ArticleTagOrderByRelevanceFieldEnum: {
    readonly tag: "tag";
};
export type ArticleTagOrderByRelevanceFieldEnum = (typeof ArticleTagOrderByRelevanceFieldEnum)[keyof typeof ArticleTagOrderByRelevanceFieldEnum];
export declare const ArticleMediaOrderByRelevanceFieldEnum: {
    readonly url: "url";
    readonly caption: "caption";
};
export type ArticleMediaOrderByRelevanceFieldEnum = (typeof ArticleMediaOrderByRelevanceFieldEnum)[keyof typeof ArticleMediaOrderByRelevanceFieldEnum];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map