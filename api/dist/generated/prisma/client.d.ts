import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model Role
 *
 */
export type Role = Prisma.RoleModel;
/**
 * Model User_Role
 *
 */
export type User_Role = Prisma.User_RoleModel;
/**
 * Model Tournament
 *
 */
export type Tournament = Prisma.TournamentModel;
/**
 * Model Season
 *
 */
export type Season = Prisma.SeasonModel;
/**
 * Model TournamentRule
 *
 */
export type TournamentRule = Prisma.TournamentRuleModel;
/**
 * Model Phase
 *
 */
export type Phase = Prisma.PhaseModel;
/**
 * Model Group
 *
 */
export type Group = Prisma.GroupModel;
/**
 * Model Team
 *
 */
export type Team = Prisma.TeamModel;
/**
 * Model Player
 *
 */
export type Player = Prisma.PlayerModel;
/**
 * Model TeamPlayer
 *
 */
export type TeamPlayer = Prisma.TeamPlayerModel;
/**
 * Model SeasonTeam
 *
 */
export type SeasonTeam = Prisma.SeasonTeamModel;
/**
 * Model Match
 *
 */
export type Match = Prisma.MatchModel;
/**
 * Model MatchEvent
 *
 */
export type MatchEvent = Prisma.MatchEventModel;
/**
 * Model Venue
 *
 */
export type Venue = Prisma.VenueModel;
/**
 * Model TeamLeader
 *
 */
export type TeamLeader = Prisma.TeamLeaderModel;
/**
 * Model TeamStanding
 *
 */
export type TeamStanding = Prisma.TeamStandingModel;
/**
 * Model PlayerStatistic
 *
 */
export type PlayerStatistic = Prisma.PlayerStatisticModel;
/**
 * Model Notification
 *
 */
export type Notification = Prisma.NotificationModel;
/**
 * Model Payment
 *
 */
export type Payment = Prisma.PaymentModel;
/**
 * Model SeasonTeamPlayer
 *
 */
export type SeasonTeamPlayer = Prisma.SeasonTeamPlayerModel;
/**
 * Model MatchResult
 *
 */
export type MatchResult = Prisma.MatchResultModel;
//# sourceMappingURL=client.d.ts.map