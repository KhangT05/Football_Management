import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
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
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
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
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.role`: Exposes CRUD operations for the **Role** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Roles
      * const roles = await prisma.role.findMany()
      * ```
      */
    get role(): Prisma.RoleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.user_Role`: Exposes CRUD operations for the **User_Role** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more User_Roles
      * const user_Roles = await prisma.user_Role.findMany()
      * ```
      */
    get user_Role(): Prisma.User_RoleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.tournament`: Exposes CRUD operations for the **Tournament** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Tournaments
      * const tournaments = await prisma.tournament.findMany()
      * ```
      */
    get tournament(): Prisma.TournamentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.tournamentRule`: Exposes CRUD operations for the **TournamentRule** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TournamentRules
      * const tournamentRules = await prisma.tournamentRule.findMany()
      * ```
      */
    get tournamentRule(): Prisma.TournamentRuleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.class`: Exposes CRUD operations for the **Class** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Classes
      * const classes = await prisma.class.findMany()
      * ```
      */
    get class(): Prisma.ClassDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.phase`: Exposes CRUD operations for the **Phase** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Phases
      * const phases = await prisma.phase.findMany()
      * ```
      */
    get phase(): Prisma.PhaseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.bracketSlot`: Exposes CRUD operations for the **BracketSlot** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BracketSlots
      * const bracketSlots = await prisma.bracketSlot.findMany()
      * ```
      */
    get bracketSlot(): Prisma.BracketSlotDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.season`: Exposes CRUD operations for the **Season** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Seasons
      * const seasons = await prisma.season.findMany()
      * ```
      */
    get season(): Prisma.SeasonDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.seasonDefaultVenue`: Exposes CRUD operations for the **SeasonDefaultVenue** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SeasonDefaultVenues
      * const seasonDefaultVenues = await prisma.seasonDefaultVenue.findMany()
      * ```
      */
    get seasonDefaultVenue(): Prisma.SeasonDefaultVenueDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.group`: Exposes CRUD operations for the **Group** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Groups
      * const groups = await prisma.group.findMany()
      * ```
      */
    get group(): Prisma.GroupDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.team`: Exposes CRUD operations for the **Team** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Teams
      * const teams = await prisma.team.findMany()
      * ```
      */
    get team(): Prisma.TeamDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.matchJerseyAssignment`: Exposes CRUD operations for the **MatchJerseyAssignment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MatchJerseyAssignments
      * const matchJerseyAssignments = await prisma.matchJerseyAssignment.findMany()
      * ```
      */
    get matchJerseyAssignment(): Prisma.MatchJerseyAssignmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.player`: Exposes CRUD operations for the **Player** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Players
      * const players = await prisma.player.findMany()
      * ```
      */
    get player(): Prisma.PlayerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teamPlayer`: Exposes CRUD operations for the **TeamPlayer** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TeamPlayers
      * const teamPlayers = await prisma.teamPlayer.findMany()
      * ```
      */
    get teamPlayer(): Prisma.TeamPlayerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teamPlayerHistory`: Exposes CRUD operations for the **TeamPlayerHistory** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TeamPlayerHistories
      * const teamPlayerHistories = await prisma.teamPlayerHistory.findMany()
      * ```
      */
    get teamPlayerHistory(): Prisma.TeamPlayerHistoryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teamLeader`: Exposes CRUD operations for the **TeamLeader** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TeamLeaders
      * const teamLeaders = await prisma.teamLeader.findMany()
      * ```
      */
    get teamLeader(): Prisma.TeamLeaderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.seasonTeam`: Exposes CRUD operations for the **SeasonTeam** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SeasonTeams
      * const seasonTeams = await prisma.seasonTeam.findMany()
      * ```
      */
    get seasonTeam(): Prisma.SeasonTeamDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.seasonTeamJersey`: Exposes CRUD operations for the **SeasonTeamJersey** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SeasonTeamJerseys
      * const seasonTeamJerseys = await prisma.seasonTeamJersey.findMany()
      * ```
      */
    get seasonTeamJersey(): Prisma.SeasonTeamJerseyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.venue`: Exposes CRUD operations for the **Venue** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Venues
      * const venues = await prisma.venue.findMany()
      * ```
      */
    get venue(): Prisma.VenueDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.matchLineup`: Exposes CRUD operations for the **MatchLineup** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MatchLineups
      * const matchLineups = await prisma.matchLineup.findMany()
      * ```
      */
    get matchLineup(): Prisma.MatchLineupDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.match`: Exposes CRUD operations for the **Match** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Matches
      * const matches = await prisma.match.findMany()
      * ```
      */
    get match(): Prisma.MatchDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.matchEvent`: Exposes CRUD operations for the **MatchEvent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MatchEvents
      * const matchEvents = await prisma.matchEvent.findMany()
      * ```
      */
    get matchEvent(): Prisma.MatchEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teamStanding`: Exposes CRUD operations for the **TeamStanding** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TeamStandings
      * const teamStandings = await prisma.teamStanding.findMany()
      * ```
      */
    get teamStanding(): Prisma.TeamStandingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.playerStatistic`: Exposes CRUD operations for the **PlayerStatistic** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PlayerStatistics
      * const playerStatistics = await prisma.playerStatistic.findMany()
      * ```
      */
    get playerStatistic(): Prisma.PlayerStatisticDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.matchResult`: Exposes CRUD operations for the **MatchResult** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MatchResults
      * const matchResults = await prisma.matchResult.findMany()
      * ```
      */
    get matchResult(): Prisma.MatchResultDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Notifications
      * const notifications = await prisma.notification.findMany()
      * ```
      */
    get notification(): Prisma.NotificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Payments
      * const payments = await prisma.payment.findMany()
      * ```
      */
    get payment(): Prisma.PaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.article`: Exposes CRUD operations for the **Article** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Articles
      * const articles = await prisma.article.findMany()
      * ```
      */
    get article(): Prisma.ArticleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.articleTag`: Exposes CRUD operations for the **ArticleTag** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ArticleTags
      * const articleTags = await prisma.articleTag.findMany()
      * ```
      */
    get articleTag(): Prisma.ArticleTagDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.articleMedia`: Exposes CRUD operations for the **ArticleMedia** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ArticleMedias
      * const articleMedias = await prisma.articleMedia.findMany()
      * ```
      */
    get articleMedia(): Prisma.ArticleMediaDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map