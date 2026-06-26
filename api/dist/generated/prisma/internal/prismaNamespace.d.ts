import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.8.0
 * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
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
export declare const DbNull: runtime.DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: runtime.JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
    readonly TeamJersey: "TeamJersey";
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "role" | "user_Role" | "tournament" | "tournamentRule" | "phase" | "bracketSlot" | "season" | "group" | "team" | "teamJersey" | "player" | "teamPlayer" | "teamLeader" | "seasonTeam" | "seasonTeamJersey" | "venue" | "matchLineup" | "match" | "matchEvent" | "teamStanding" | "playerStatistic" | "matchResult" | "notification" | "payment" | "article" | "articleTag" | "articleMedia";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Role: {
            payload: Prisma.$RolePayload<ExtArgs>;
            fields: Prisma.RoleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RoleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePayload>;
                };
                findFirst: {
                    args: Prisma.RoleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePayload>;
                };
                findMany: {
                    args: Prisma.RoleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePayload>[];
                };
                create: {
                    args: Prisma.RoleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePayload>;
                };
                createMany: {
                    args: Prisma.RoleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.RoleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePayload>;
                };
                update: {
                    args: Prisma.RoleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePayload>;
                };
                deleteMany: {
                    args: Prisma.RoleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RoleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.RoleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePayload>;
                };
                aggregate: {
                    args: Prisma.RoleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRole>;
                };
                groupBy: {
                    args: Prisma.RoleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RoleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoleCountAggregateOutputType> | number;
                };
            };
        };
        User_Role: {
            payload: Prisma.$User_RolePayload<ExtArgs>;
            fields: Prisma.User_RoleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.User_RoleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$User_RolePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.User_RoleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$User_RolePayload>;
                };
                findFirst: {
                    args: Prisma.User_RoleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$User_RolePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.User_RoleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$User_RolePayload>;
                };
                findMany: {
                    args: Prisma.User_RoleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$User_RolePayload>[];
                };
                create: {
                    args: Prisma.User_RoleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$User_RolePayload>;
                };
                createMany: {
                    args: Prisma.User_RoleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.User_RoleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$User_RolePayload>;
                };
                update: {
                    args: Prisma.User_RoleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$User_RolePayload>;
                };
                deleteMany: {
                    args: Prisma.User_RoleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.User_RoleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.User_RoleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$User_RolePayload>;
                };
                aggregate: {
                    args: Prisma.User_RoleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser_Role>;
                };
                groupBy: {
                    args: Prisma.User_RoleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.User_RoleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.User_RoleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.User_RoleCountAggregateOutputType> | number;
                };
            };
        };
        Tournament: {
            payload: Prisma.$TournamentPayload<ExtArgs>;
            fields: Prisma.TournamentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TournamentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TournamentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentPayload>;
                };
                findFirst: {
                    args: Prisma.TournamentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TournamentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentPayload>;
                };
                findMany: {
                    args: Prisma.TournamentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentPayload>[];
                };
                create: {
                    args: Prisma.TournamentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentPayload>;
                };
                createMany: {
                    args: Prisma.TournamentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TournamentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentPayload>;
                };
                update: {
                    args: Prisma.TournamentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentPayload>;
                };
                deleteMany: {
                    args: Prisma.TournamentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TournamentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TournamentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentPayload>;
                };
                aggregate: {
                    args: Prisma.TournamentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTournament>;
                };
                groupBy: {
                    args: Prisma.TournamentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TournamentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TournamentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TournamentCountAggregateOutputType> | number;
                };
            };
        };
        TournamentRule: {
            payload: Prisma.$TournamentRulePayload<ExtArgs>;
            fields: Prisma.TournamentRuleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TournamentRuleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentRulePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TournamentRuleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentRulePayload>;
                };
                findFirst: {
                    args: Prisma.TournamentRuleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentRulePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TournamentRuleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentRulePayload>;
                };
                findMany: {
                    args: Prisma.TournamentRuleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentRulePayload>[];
                };
                create: {
                    args: Prisma.TournamentRuleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentRulePayload>;
                };
                createMany: {
                    args: Prisma.TournamentRuleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TournamentRuleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentRulePayload>;
                };
                update: {
                    args: Prisma.TournamentRuleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentRulePayload>;
                };
                deleteMany: {
                    args: Prisma.TournamentRuleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TournamentRuleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TournamentRuleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TournamentRulePayload>;
                };
                aggregate: {
                    args: Prisma.TournamentRuleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTournamentRule>;
                };
                groupBy: {
                    args: Prisma.TournamentRuleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TournamentRuleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TournamentRuleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TournamentRuleCountAggregateOutputType> | number;
                };
            };
        };
        Phase: {
            payload: Prisma.$PhasePayload<ExtArgs>;
            fields: Prisma.PhaseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PhaseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PhasePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PhaseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PhasePayload>;
                };
                findFirst: {
                    args: Prisma.PhaseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PhasePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PhaseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PhasePayload>;
                };
                findMany: {
                    args: Prisma.PhaseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PhasePayload>[];
                };
                create: {
                    args: Prisma.PhaseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PhasePayload>;
                };
                createMany: {
                    args: Prisma.PhaseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PhaseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PhasePayload>;
                };
                update: {
                    args: Prisma.PhaseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PhasePayload>;
                };
                deleteMany: {
                    args: Prisma.PhaseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PhaseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PhaseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PhasePayload>;
                };
                aggregate: {
                    args: Prisma.PhaseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePhase>;
                };
                groupBy: {
                    args: Prisma.PhaseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PhaseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PhaseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PhaseCountAggregateOutputType> | number;
                };
            };
        };
        BracketSlot: {
            payload: Prisma.$BracketSlotPayload<ExtArgs>;
            fields: Prisma.BracketSlotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BracketSlotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BracketSlotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BracketSlotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BracketSlotPayload>;
                };
                findFirst: {
                    args: Prisma.BracketSlotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BracketSlotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BracketSlotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BracketSlotPayload>;
                };
                findMany: {
                    args: Prisma.BracketSlotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BracketSlotPayload>[];
                };
                create: {
                    args: Prisma.BracketSlotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BracketSlotPayload>;
                };
                createMany: {
                    args: Prisma.BracketSlotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.BracketSlotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BracketSlotPayload>;
                };
                update: {
                    args: Prisma.BracketSlotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BracketSlotPayload>;
                };
                deleteMany: {
                    args: Prisma.BracketSlotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BracketSlotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.BracketSlotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BracketSlotPayload>;
                };
                aggregate: {
                    args: Prisma.BracketSlotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBracketSlot>;
                };
                groupBy: {
                    args: Prisma.BracketSlotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BracketSlotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BracketSlotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BracketSlotCountAggregateOutputType> | number;
                };
            };
        };
        Season: {
            payload: Prisma.$SeasonPayload<ExtArgs>;
            fields: Prisma.SeasonFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SeasonFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SeasonFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonPayload>;
                };
                findFirst: {
                    args: Prisma.SeasonFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SeasonFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonPayload>;
                };
                findMany: {
                    args: Prisma.SeasonFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonPayload>[];
                };
                create: {
                    args: Prisma.SeasonCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonPayload>;
                };
                createMany: {
                    args: Prisma.SeasonCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.SeasonDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonPayload>;
                };
                update: {
                    args: Prisma.SeasonUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonPayload>;
                };
                deleteMany: {
                    args: Prisma.SeasonDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SeasonUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.SeasonUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonPayload>;
                };
                aggregate: {
                    args: Prisma.SeasonAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSeason>;
                };
                groupBy: {
                    args: Prisma.SeasonGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SeasonGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SeasonCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SeasonCountAggregateOutputType> | number;
                };
            };
        };
        Group: {
            payload: Prisma.$GroupPayload<ExtArgs>;
            fields: Prisma.GroupFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GroupFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GroupPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GroupFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GroupPayload>;
                };
                findFirst: {
                    args: Prisma.GroupFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GroupPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GroupFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GroupPayload>;
                };
                findMany: {
                    args: Prisma.GroupFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GroupPayload>[];
                };
                create: {
                    args: Prisma.GroupCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GroupPayload>;
                };
                createMany: {
                    args: Prisma.GroupCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.GroupDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GroupPayload>;
                };
                update: {
                    args: Prisma.GroupUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GroupPayload>;
                };
                deleteMany: {
                    args: Prisma.GroupDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GroupUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.GroupUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GroupPayload>;
                };
                aggregate: {
                    args: Prisma.GroupAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGroup>;
                };
                groupBy: {
                    args: Prisma.GroupGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GroupGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GroupCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GroupCountAggregateOutputType> | number;
                };
            };
        };
        Team: {
            payload: Prisma.$TeamPayload<ExtArgs>;
            fields: Prisma.TeamFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                findFirst: {
                    args: Prisma.TeamFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                findMany: {
                    args: Prisma.TeamFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>[];
                };
                create: {
                    args: Prisma.TeamCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                createMany: {
                    args: Prisma.TeamCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TeamDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                update: {
                    args: Prisma.TeamUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TeamUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                aggregate: {
                    args: Prisma.TeamAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeam>;
                };
                groupBy: {
                    args: Prisma.TeamGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TeamCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamCountAggregateOutputType> | number;
                };
            };
        };
        TeamJersey: {
            payload: Prisma.$TeamJerseyPayload<ExtArgs>;
            fields: Prisma.TeamJerseyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamJerseyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamJerseyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamJerseyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamJerseyPayload>;
                };
                findFirst: {
                    args: Prisma.TeamJerseyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamJerseyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamJerseyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamJerseyPayload>;
                };
                findMany: {
                    args: Prisma.TeamJerseyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamJerseyPayload>[];
                };
                create: {
                    args: Prisma.TeamJerseyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamJerseyPayload>;
                };
                createMany: {
                    args: Prisma.TeamJerseyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TeamJerseyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamJerseyPayload>;
                };
                update: {
                    args: Prisma.TeamJerseyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamJerseyPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamJerseyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamJerseyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TeamJerseyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamJerseyPayload>;
                };
                aggregate: {
                    args: Prisma.TeamJerseyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeamJersey>;
                };
                groupBy: {
                    args: Prisma.TeamJerseyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamJerseyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TeamJerseyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamJerseyCountAggregateOutputType> | number;
                };
            };
        };
        Player: {
            payload: Prisma.$PlayerPayload<ExtArgs>;
            fields: Prisma.PlayerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PlayerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PlayerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerPayload>;
                };
                findFirst: {
                    args: Prisma.PlayerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PlayerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerPayload>;
                };
                findMany: {
                    args: Prisma.PlayerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerPayload>[];
                };
                create: {
                    args: Prisma.PlayerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerPayload>;
                };
                createMany: {
                    args: Prisma.PlayerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PlayerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerPayload>;
                };
                update: {
                    args: Prisma.PlayerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerPayload>;
                };
                deleteMany: {
                    args: Prisma.PlayerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PlayerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PlayerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerPayload>;
                };
                aggregate: {
                    args: Prisma.PlayerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePlayer>;
                };
                groupBy: {
                    args: Prisma.PlayerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlayerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PlayerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlayerCountAggregateOutputType> | number;
                };
            };
        };
        TeamPlayer: {
            payload: Prisma.$TeamPlayerPayload<ExtArgs>;
            fields: Prisma.TeamPlayerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamPlayerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPlayerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamPlayerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPlayerPayload>;
                };
                findFirst: {
                    args: Prisma.TeamPlayerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPlayerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamPlayerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPlayerPayload>;
                };
                findMany: {
                    args: Prisma.TeamPlayerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPlayerPayload>[];
                };
                create: {
                    args: Prisma.TeamPlayerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPlayerPayload>;
                };
                createMany: {
                    args: Prisma.TeamPlayerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TeamPlayerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPlayerPayload>;
                };
                update: {
                    args: Prisma.TeamPlayerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPlayerPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamPlayerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamPlayerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TeamPlayerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPlayerPayload>;
                };
                aggregate: {
                    args: Prisma.TeamPlayerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeamPlayer>;
                };
                groupBy: {
                    args: Prisma.TeamPlayerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamPlayerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TeamPlayerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamPlayerCountAggregateOutputType> | number;
                };
            };
        };
        TeamLeader: {
            payload: Prisma.$TeamLeaderPayload<ExtArgs>;
            fields: Prisma.TeamLeaderFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamLeaderFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamLeaderPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamLeaderFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamLeaderPayload>;
                };
                findFirst: {
                    args: Prisma.TeamLeaderFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamLeaderPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamLeaderFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamLeaderPayload>;
                };
                findMany: {
                    args: Prisma.TeamLeaderFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamLeaderPayload>[];
                };
                create: {
                    args: Prisma.TeamLeaderCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamLeaderPayload>;
                };
                createMany: {
                    args: Prisma.TeamLeaderCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TeamLeaderDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamLeaderPayload>;
                };
                update: {
                    args: Prisma.TeamLeaderUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamLeaderPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamLeaderDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamLeaderUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TeamLeaderUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamLeaderPayload>;
                };
                aggregate: {
                    args: Prisma.TeamLeaderAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeamLeader>;
                };
                groupBy: {
                    args: Prisma.TeamLeaderGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamLeaderGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TeamLeaderCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamLeaderCountAggregateOutputType> | number;
                };
            };
        };
        SeasonTeam: {
            payload: Prisma.$SeasonTeamPayload<ExtArgs>;
            fields: Prisma.SeasonTeamFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SeasonTeamFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SeasonTeamFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamPayload>;
                };
                findFirst: {
                    args: Prisma.SeasonTeamFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SeasonTeamFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamPayload>;
                };
                findMany: {
                    args: Prisma.SeasonTeamFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamPayload>[];
                };
                create: {
                    args: Prisma.SeasonTeamCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamPayload>;
                };
                createMany: {
                    args: Prisma.SeasonTeamCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.SeasonTeamDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamPayload>;
                };
                update: {
                    args: Prisma.SeasonTeamUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamPayload>;
                };
                deleteMany: {
                    args: Prisma.SeasonTeamDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SeasonTeamUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.SeasonTeamUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamPayload>;
                };
                aggregate: {
                    args: Prisma.SeasonTeamAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSeasonTeam>;
                };
                groupBy: {
                    args: Prisma.SeasonTeamGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SeasonTeamGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SeasonTeamCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SeasonTeamCountAggregateOutputType> | number;
                };
            };
        };
        SeasonTeamJersey: {
            payload: Prisma.$SeasonTeamJerseyPayload<ExtArgs>;
            fields: Prisma.SeasonTeamJerseyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SeasonTeamJerseyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamJerseyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SeasonTeamJerseyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamJerseyPayload>;
                };
                findFirst: {
                    args: Prisma.SeasonTeamJerseyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamJerseyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SeasonTeamJerseyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamJerseyPayload>;
                };
                findMany: {
                    args: Prisma.SeasonTeamJerseyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamJerseyPayload>[];
                };
                create: {
                    args: Prisma.SeasonTeamJerseyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamJerseyPayload>;
                };
                createMany: {
                    args: Prisma.SeasonTeamJerseyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.SeasonTeamJerseyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamJerseyPayload>;
                };
                update: {
                    args: Prisma.SeasonTeamJerseyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamJerseyPayload>;
                };
                deleteMany: {
                    args: Prisma.SeasonTeamJerseyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SeasonTeamJerseyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.SeasonTeamJerseyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SeasonTeamJerseyPayload>;
                };
                aggregate: {
                    args: Prisma.SeasonTeamJerseyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSeasonTeamJersey>;
                };
                groupBy: {
                    args: Prisma.SeasonTeamJerseyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SeasonTeamJerseyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SeasonTeamJerseyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SeasonTeamJerseyCountAggregateOutputType> | number;
                };
            };
        };
        Venue: {
            payload: Prisma.$VenuePayload<ExtArgs>;
            fields: Prisma.VenueFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.VenueFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VenuePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.VenueFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VenuePayload>;
                };
                findFirst: {
                    args: Prisma.VenueFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VenuePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.VenueFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VenuePayload>;
                };
                findMany: {
                    args: Prisma.VenueFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VenuePayload>[];
                };
                create: {
                    args: Prisma.VenueCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VenuePayload>;
                };
                createMany: {
                    args: Prisma.VenueCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.VenueDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VenuePayload>;
                };
                update: {
                    args: Prisma.VenueUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VenuePayload>;
                };
                deleteMany: {
                    args: Prisma.VenueDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.VenueUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.VenueUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VenuePayload>;
                };
                aggregate: {
                    args: Prisma.VenueAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateVenue>;
                };
                groupBy: {
                    args: Prisma.VenueGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VenueGroupByOutputType>[];
                };
                count: {
                    args: Prisma.VenueCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VenueCountAggregateOutputType> | number;
                };
            };
        };
        MatchLineup: {
            payload: Prisma.$MatchLineupPayload<ExtArgs>;
            fields: Prisma.MatchLineupFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MatchLineupFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchLineupPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MatchLineupFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchLineupPayload>;
                };
                findFirst: {
                    args: Prisma.MatchLineupFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchLineupPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MatchLineupFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchLineupPayload>;
                };
                findMany: {
                    args: Prisma.MatchLineupFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchLineupPayload>[];
                };
                create: {
                    args: Prisma.MatchLineupCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchLineupPayload>;
                };
                createMany: {
                    args: Prisma.MatchLineupCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MatchLineupDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchLineupPayload>;
                };
                update: {
                    args: Prisma.MatchLineupUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchLineupPayload>;
                };
                deleteMany: {
                    args: Prisma.MatchLineupDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MatchLineupUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MatchLineupUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchLineupPayload>;
                };
                aggregate: {
                    args: Prisma.MatchLineupAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMatchLineup>;
                };
                groupBy: {
                    args: Prisma.MatchLineupGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MatchLineupGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MatchLineupCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MatchLineupCountAggregateOutputType> | number;
                };
            };
        };
        Match: {
            payload: Prisma.$MatchPayload<ExtArgs>;
            fields: Prisma.MatchFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MatchFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MatchFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchPayload>;
                };
                findFirst: {
                    args: Prisma.MatchFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MatchFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchPayload>;
                };
                findMany: {
                    args: Prisma.MatchFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchPayload>[];
                };
                create: {
                    args: Prisma.MatchCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchPayload>;
                };
                createMany: {
                    args: Prisma.MatchCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MatchDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchPayload>;
                };
                update: {
                    args: Prisma.MatchUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchPayload>;
                };
                deleteMany: {
                    args: Prisma.MatchDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MatchUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MatchUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchPayload>;
                };
                aggregate: {
                    args: Prisma.MatchAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMatch>;
                };
                groupBy: {
                    args: Prisma.MatchGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MatchGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MatchCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MatchCountAggregateOutputType> | number;
                };
            };
        };
        MatchEvent: {
            payload: Prisma.$MatchEventPayload<ExtArgs>;
            fields: Prisma.MatchEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MatchEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MatchEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchEventPayload>;
                };
                findFirst: {
                    args: Prisma.MatchEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MatchEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchEventPayload>;
                };
                findMany: {
                    args: Prisma.MatchEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchEventPayload>[];
                };
                create: {
                    args: Prisma.MatchEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchEventPayload>;
                };
                createMany: {
                    args: Prisma.MatchEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MatchEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchEventPayload>;
                };
                update: {
                    args: Prisma.MatchEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchEventPayload>;
                };
                deleteMany: {
                    args: Prisma.MatchEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MatchEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MatchEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchEventPayload>;
                };
                aggregate: {
                    args: Prisma.MatchEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMatchEvent>;
                };
                groupBy: {
                    args: Prisma.MatchEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MatchEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MatchEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MatchEventCountAggregateOutputType> | number;
                };
            };
        };
        TeamStanding: {
            payload: Prisma.$TeamStandingPayload<ExtArgs>;
            fields: Prisma.TeamStandingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamStandingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamStandingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamStandingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamStandingPayload>;
                };
                findFirst: {
                    args: Prisma.TeamStandingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamStandingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamStandingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamStandingPayload>;
                };
                findMany: {
                    args: Prisma.TeamStandingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamStandingPayload>[];
                };
                create: {
                    args: Prisma.TeamStandingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamStandingPayload>;
                };
                createMany: {
                    args: Prisma.TeamStandingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TeamStandingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamStandingPayload>;
                };
                update: {
                    args: Prisma.TeamStandingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamStandingPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamStandingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamStandingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TeamStandingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamStandingPayload>;
                };
                aggregate: {
                    args: Prisma.TeamStandingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeamStanding>;
                };
                groupBy: {
                    args: Prisma.TeamStandingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamStandingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TeamStandingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamStandingCountAggregateOutputType> | number;
                };
            };
        };
        PlayerStatistic: {
            payload: Prisma.$PlayerStatisticPayload<ExtArgs>;
            fields: Prisma.PlayerStatisticFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PlayerStatisticFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerStatisticPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PlayerStatisticFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerStatisticPayload>;
                };
                findFirst: {
                    args: Prisma.PlayerStatisticFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerStatisticPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PlayerStatisticFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerStatisticPayload>;
                };
                findMany: {
                    args: Prisma.PlayerStatisticFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerStatisticPayload>[];
                };
                create: {
                    args: Prisma.PlayerStatisticCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerStatisticPayload>;
                };
                createMany: {
                    args: Prisma.PlayerStatisticCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PlayerStatisticDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerStatisticPayload>;
                };
                update: {
                    args: Prisma.PlayerStatisticUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerStatisticPayload>;
                };
                deleteMany: {
                    args: Prisma.PlayerStatisticDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PlayerStatisticUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PlayerStatisticUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlayerStatisticPayload>;
                };
                aggregate: {
                    args: Prisma.PlayerStatisticAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePlayerStatistic>;
                };
                groupBy: {
                    args: Prisma.PlayerStatisticGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlayerStatisticGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PlayerStatisticCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlayerStatisticCountAggregateOutputType> | number;
                };
            };
        };
        MatchResult: {
            payload: Prisma.$MatchResultPayload<ExtArgs>;
            fields: Prisma.MatchResultFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MatchResultFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchResultPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MatchResultFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchResultPayload>;
                };
                findFirst: {
                    args: Prisma.MatchResultFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchResultPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MatchResultFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchResultPayload>;
                };
                findMany: {
                    args: Prisma.MatchResultFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchResultPayload>[];
                };
                create: {
                    args: Prisma.MatchResultCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchResultPayload>;
                };
                createMany: {
                    args: Prisma.MatchResultCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MatchResultDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchResultPayload>;
                };
                update: {
                    args: Prisma.MatchResultUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchResultPayload>;
                };
                deleteMany: {
                    args: Prisma.MatchResultDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MatchResultUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MatchResultUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MatchResultPayload>;
                };
                aggregate: {
                    args: Prisma.MatchResultAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMatchResult>;
                };
                groupBy: {
                    args: Prisma.MatchResultGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MatchResultGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MatchResultCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MatchResultCountAggregateOutputType> | number;
                };
            };
        };
        Notification: {
            payload: Prisma.$NotificationPayload<ExtArgs>;
            fields: Prisma.NotificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NotificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findFirst: {
                    args: Prisma.NotificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findMany: {
                    args: Prisma.NotificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                create: {
                    args: Prisma.NotificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                createMany: {
                    args: Prisma.NotificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.NotificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                update: {
                    args: Prisma.NotificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                deleteMany: {
                    args: Prisma.NotificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NotificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.NotificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                aggregate: {
                    args: Prisma.NotificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNotification>;
                };
                groupBy: {
                    args: Prisma.NotificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NotificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationCountAggregateOutputType> | number;
                };
            };
        };
        Payment: {
            payload: Prisma.$PaymentPayload<ExtArgs>;
            fields: Prisma.PaymentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PaymentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findFirst: {
                    args: Prisma.PaymentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findMany: {
                    args: Prisma.PaymentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                create: {
                    args: Prisma.PaymentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                createMany: {
                    args: Prisma.PaymentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PaymentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                update: {
                    args: Prisma.PaymentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                deleteMany: {
                    args: Prisma.PaymentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PaymentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PaymentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                aggregate: {
                    args: Prisma.PaymentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePayment>;
                };
                groupBy: {
                    args: Prisma.PaymentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PaymentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentCountAggregateOutputType> | number;
                };
            };
        };
        Article: {
            payload: Prisma.$ArticlePayload<ExtArgs>;
            fields: Prisma.ArticleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ArticleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ArticleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                findFirst: {
                    args: Prisma.ArticleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ArticleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                findMany: {
                    args: Prisma.ArticleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>[];
                };
                create: {
                    args: Prisma.ArticleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                createMany: {
                    args: Prisma.ArticleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ArticleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                update: {
                    args: Prisma.ArticleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                deleteMany: {
                    args: Prisma.ArticleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ArticleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ArticleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                aggregate: {
                    args: Prisma.ArticleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateArticle>;
                };
                groupBy: {
                    args: Prisma.ArticleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ArticleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleCountAggregateOutputType> | number;
                };
            };
        };
        ArticleTag: {
            payload: Prisma.$ArticleTagPayload<ExtArgs>;
            fields: Prisma.ArticleTagFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ArticleTagFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ArticleTagFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                findFirst: {
                    args: Prisma.ArticleTagFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ArticleTagFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                findMany: {
                    args: Prisma.ArticleTagFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>[];
                };
                create: {
                    args: Prisma.ArticleTagCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                createMany: {
                    args: Prisma.ArticleTagCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ArticleTagDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                update: {
                    args: Prisma.ArticleTagUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                deleteMany: {
                    args: Prisma.ArticleTagDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ArticleTagUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ArticleTagUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                aggregate: {
                    args: Prisma.ArticleTagAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateArticleTag>;
                };
                groupBy: {
                    args: Prisma.ArticleTagGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleTagGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ArticleTagCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleTagCountAggregateOutputType> | number;
                };
            };
        };
        ArticleMedia: {
            payload: Prisma.$ArticleMediaPayload<ExtArgs>;
            fields: Prisma.ArticleMediaFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ArticleMediaFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ArticleMediaFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                findFirst: {
                    args: Prisma.ArticleMediaFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ArticleMediaFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                findMany: {
                    args: Prisma.ArticleMediaFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>[];
                };
                create: {
                    args: Prisma.ArticleMediaCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                createMany: {
                    args: Prisma.ArticleMediaCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ArticleMediaDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                update: {
                    args: Prisma.ArticleMediaUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                deleteMany: {
                    args: Prisma.ArticleMediaDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ArticleMediaUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ArticleMediaUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                aggregate: {
                    args: Prisma.ArticleMediaAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateArticleMedia>;
                };
                groupBy: {
                    args: Prisma.ArticleMediaGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleMediaGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ArticleMediaCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleMediaCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
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
export declare const TeamJerseyScalarFieldEnum: {
    readonly id: "id";
    readonly team_id: "team_id";
    readonly type: "type";
    readonly primary_color: "primary_color";
    readonly secondary_color: "secondary_color";
};
export type TeamJerseyScalarFieldEnum = (typeof TeamJerseyScalarFieldEnum)[keyof typeof TeamJerseyScalarFieldEnum];
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
    readonly jersey_number: "jersey_number";
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
    readonly position: "position";
    readonly matches_played: "matches_played";
    readonly wins: "wins";
    readonly draws: "draws";
    readonly losses: "losses";
    readonly goals_for: "goals_for";
    readonly goals_against: "goals_against";
    readonly points: "points";
    readonly is_active: "is_active";
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
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly deleted_at: "deleted_at";
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
    readonly JsonNull: runtime.JsonNullClass;
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
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
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
export declare const TeamJerseyOrderByRelevanceFieldEnum: {
    readonly primary_color: "primary_color";
    readonly secondary_color: "secondary_color";
};
export type TeamJerseyOrderByRelevanceFieldEnum = (typeof TeamJerseyOrderByRelevanceFieldEnum)[keyof typeof TeamJerseyOrderByRelevanceFieldEnum];
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
/**
 * Field references
 */
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'Json'
 */
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
/**
 * Reference to a field of type 'QueryMode'
 */
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
/**
 * Reference to a field of type 'PhaseType'
 */
export type EnumPhaseTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PhaseType'>;
/**
 * Reference to a field of type 'PhaseFormat'
 */
export type EnumPhaseFormatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PhaseFormat'>;
/**
 * Reference to a field of type 'PhaseStatus'
 */
export type EnumPhaseStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PhaseStatus'>;
/**
 * Reference to a field of type 'SeasonStatus'
 */
export type EnumSeasonStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SeasonStatus'>;
/**
 * Reference to a field of type 'Decimal'
 */
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
/**
 * Reference to a field of type 'GroupStatus'
 */
export type EnumGroupStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GroupStatus'>;
/**
 * Reference to a field of type 'JerseyType'
 */
export type EnumJerseyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JerseyType'>;
/**
 * Reference to a field of type 'PlayerPosition'
 */
export type EnumPlayerPositionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerPosition'>;
/**
 * Reference to a field of type 'PlayerRole'
 */
export type EnumPlayerRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerRole'>;
/**
 * Reference to a field of type 'PlayerStatus'
 */
export type EnumPlayerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerStatus'>;
/**
 * Reference to a field of type 'ApprovalStatus'
 */
export type EnumApprovalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApprovalStatus'>;
/**
 * Reference to a field of type 'SeasonTeamStatus'
 */
export type EnumSeasonTeamStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SeasonTeamStatus'>;
/**
 * Reference to a field of type 'LineupType'
 */
export type EnumLineupTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LineupType'>;
/**
 * Reference to a field of type 'MatchPlayerStatus'
 */
export type EnumMatchPlayerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchPlayerStatus'>;
/**
 * Reference to a field of type 'MatchStatus'
 */
export type EnumMatchStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchStatus'>;
/**
 * Reference to a field of type 'MatchPeriod'
 */
export type EnumMatchPeriodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchPeriod'>;
/**
 * Reference to a field of type 'MatchResultType'
 */
export type EnumMatchResultTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchResultType'>;
/**
 * Reference to a field of type 'MatchEventType'
 */
export type EnumMatchEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchEventType'>;
/**
 * Reference to a field of type 'CardColor'
 */
export type EnumCardColorFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CardColor'>;
/**
 * Reference to a field of type 'MatchResultStatus'
 */
export type EnumMatchResultStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchResultStatus'>;
/**
 * Reference to a field of type 'NotificationType'
 */
export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>;
/**
 * Reference to a field of type 'NotificationSource'
 */
export type EnumNotificationSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationSource'>;
/**
 * Reference to a field of type 'PaymentStatus'
 */
export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>;
/**
 * Reference to a field of type 'ArticleStatus'
 */
export type EnumArticleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArticleStatus'>;
/**
 * Reference to a field of type 'MediaType'
 */
export type EnumMediaTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MediaType'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl: string;
    adapter?: never;
}) & {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
    /**
     * Optional maximum size for the query plan cache. If not provided, a default size will be used.
     * A value of `0` can be used to disable the cache entirely. A higher cache size can improve
     * performance for applications that execute a large number of unique queries, while a smaller
     * cache size can reduce memory usage.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   queryPlanCacheMaxSize: 100,
     * })
     * ```
     */
    queryPlanCacheMaxSize?: number;
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    role?: Prisma.RoleOmit;
    user_Role?: Prisma.User_RoleOmit;
    tournament?: Prisma.TournamentOmit;
    tournamentRule?: Prisma.TournamentRuleOmit;
    phase?: Prisma.PhaseOmit;
    bracketSlot?: Prisma.BracketSlotOmit;
    season?: Prisma.SeasonOmit;
    group?: Prisma.GroupOmit;
    team?: Prisma.TeamOmit;
    teamJersey?: Prisma.TeamJerseyOmit;
    player?: Prisma.PlayerOmit;
    teamPlayer?: Prisma.TeamPlayerOmit;
    teamLeader?: Prisma.TeamLeaderOmit;
    seasonTeam?: Prisma.SeasonTeamOmit;
    seasonTeamJersey?: Prisma.SeasonTeamJerseyOmit;
    venue?: Prisma.VenueOmit;
    matchLineup?: Prisma.MatchLineupOmit;
    match?: Prisma.MatchOmit;
    matchEvent?: Prisma.MatchEventOmit;
    teamStanding?: Prisma.TeamStandingOmit;
    playerStatistic?: Prisma.PlayerStatisticOmit;
    matchResult?: Prisma.MatchResultOmit;
    notification?: Prisma.NotificationOmit;
    payment?: Prisma.PaymentOmit;
    article?: Prisma.ArticleOmit;
    articleTag?: Prisma.ArticleTagOmit;
    articleMedia?: Prisma.ArticleMediaOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map