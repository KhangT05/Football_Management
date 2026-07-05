import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model User
 *
 */
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserAvgAggregateOutputType = {
    id: number | null;
};
export type UserSumAggregateOutputType = {
    id: number | null;
};
export type UserMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    email: string | null;
    password: string | null;
    phone: string | null;
    is_active: boolean | null;
    email_verified: boolean | null;
    email_verified_at: Date | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    email: string | null;
    password: string | null;
    phone: string | null;
    is_active: boolean | null;
    email_verified: boolean | null;
    email_verified_at: Date | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    name: number;
    email: number;
    password: number;
    phone: number;
    is_active: number;
    email_verified: number;
    email_verified_at: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type UserAvgAggregateInputType = {
    id?: true;
};
export type UserSumAggregateInputType = {
    id?: true;
};
export type UserMinAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    password?: true;
    phone?: true;
    is_active?: true;
    email_verified?: true;
    email_verified_at?: true;
    created_at?: true;
    updated_at?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    password?: true;
    phone?: true;
    is_active?: true;
    email_verified?: true;
    email_verified_at?: true;
    created_at?: true;
    updated_at?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    password?: true;
    phone?: true;
    is_active?: true;
    email_verified?: true;
    email_verified_at?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _avg?: UserAvgAggregateInputType;
    _sum?: UserSumAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: number;
    name: string;
    email: string;
    password: string | null;
    phone: string | null;
    is_active: boolean;
    email_verified: boolean;
    email_verified_at: Date | null;
    created_at: Date;
    updated_at: Date | null;
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.IntFilter<"User"> | number;
    name?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    password?: Prisma.StringNullableFilter<"User"> | string | null;
    phone?: Prisma.StringNullableFilter<"User"> | string | null;
    is_active?: Prisma.BoolFilter<"User"> | boolean;
    email_verified?: Prisma.BoolFilter<"User"> | boolean;
    email_verified_at?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    user_roles?: Prisma.User_RoleListRelationFilter;
    tournaments?: Prisma.TournamentListRelationFilter;
    seasons?: Prisma.SeasonListRelationFilter;
    tournamentRules?: Prisma.TournamentRuleListRelationFilter;
    teams?: Prisma.TeamListRelationFilter;
    player?: Prisma.XOR<Prisma.PlayerNullableScalarRelationFilter, Prisma.PlayerWhereInput> | null;
    teamPlayers?: Prisma.TeamPlayerListRelationFilter;
    seasonTeams?: Prisma.SeasonTeamListRelationFilter;
    matches?: Prisma.MatchListRelationFilter;
    teamLeaders?: Prisma.TeamLeaderListRelationFilter;
    articles?: Prisma.ArticleListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    email_verified?: Prisma.SortOrder;
    email_verified_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_roles?: Prisma.User_RoleOrderByRelationAggregateInput;
    tournaments?: Prisma.TournamentOrderByRelationAggregateInput;
    seasons?: Prisma.SeasonOrderByRelationAggregateInput;
    tournamentRules?: Prisma.TournamentRuleOrderByRelationAggregateInput;
    teams?: Prisma.TeamOrderByRelationAggregateInput;
    player?: Prisma.PlayerOrderByWithRelationInput;
    teamPlayers?: Prisma.TeamPlayerOrderByRelationAggregateInput;
    seasonTeams?: Prisma.SeasonTeamOrderByRelationAggregateInput;
    matches?: Prisma.MatchOrderByRelationAggregateInput;
    teamLeaders?: Prisma.TeamLeaderOrderByRelationAggregateInput;
    articles?: Prisma.ArticleOrderByRelationAggregateInput;
    _relevance?: Prisma.UserOrderByRelevanceInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    name?: Prisma.StringFilter<"User"> | string;
    password?: Prisma.StringNullableFilter<"User"> | string | null;
    phone?: Prisma.StringNullableFilter<"User"> | string | null;
    is_active?: Prisma.BoolFilter<"User"> | boolean;
    email_verified?: Prisma.BoolFilter<"User"> | boolean;
    email_verified_at?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    user_roles?: Prisma.User_RoleListRelationFilter;
    tournaments?: Prisma.TournamentListRelationFilter;
    seasons?: Prisma.SeasonListRelationFilter;
    tournamentRules?: Prisma.TournamentRuleListRelationFilter;
    teams?: Prisma.TeamListRelationFilter;
    player?: Prisma.XOR<Prisma.PlayerNullableScalarRelationFilter, Prisma.PlayerWhereInput> | null;
    teamPlayers?: Prisma.TeamPlayerListRelationFilter;
    seasonTeams?: Prisma.SeasonTeamListRelationFilter;
    matches?: Prisma.MatchListRelationFilter;
    teamLeaders?: Prisma.TeamLeaderListRelationFilter;
    articles?: Prisma.ArticleListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    email_verified?: Prisma.SortOrder;
    email_verified_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _avg?: Prisma.UserAvgOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
    _sum?: Prisma.UserSumOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"User"> | number;
    name?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    password?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    is_active?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    email_verified?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    email_verified_at?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
};
export type UserCreateInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type UserUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserOrderByRelevanceInput = {
    fields: Prisma.UserOrderByRelevanceFieldEnum | Prisma.UserOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    email_verified?: Prisma.SortOrder;
    email_verified_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type UserAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    email_verified?: Prisma.SortOrder;
    email_verified_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    email_verified?: Prisma.SortOrder;
    email_verified_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type UserSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type UserCreateNestedOneWithoutUser_rolesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutUser_rolesInput, Prisma.UserUncheckedCreateWithoutUser_rolesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutUser_rolesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutUser_rolesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutUser_rolesInput, Prisma.UserUncheckedCreateWithoutUser_rolesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutUser_rolesInput;
    upsert?: Prisma.UserUpsertWithoutUser_rolesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutUser_rolesInput, Prisma.UserUpdateWithoutUser_rolesInput>, Prisma.UserUncheckedUpdateWithoutUser_rolesInput>;
};
export type UserCreateNestedOneWithoutTournamentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTournamentsInput, Prisma.UserUncheckedCreateWithoutTournamentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTournamentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutTournamentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTournamentsInput, Prisma.UserUncheckedCreateWithoutTournamentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTournamentsInput;
    upsert?: Prisma.UserUpsertWithoutTournamentsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTournamentsInput, Prisma.UserUpdateWithoutTournamentsInput>, Prisma.UserUncheckedUpdateWithoutTournamentsInput>;
};
export type UserCreateNestedOneWithoutTournamentRulesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTournamentRulesInput, Prisma.UserUncheckedCreateWithoutTournamentRulesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTournamentRulesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutTournamentRulesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTournamentRulesInput, Prisma.UserUncheckedCreateWithoutTournamentRulesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTournamentRulesInput;
    upsert?: Prisma.UserUpsertWithoutTournamentRulesInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTournamentRulesInput, Prisma.UserUpdateWithoutTournamentRulesInput>, Prisma.UserUncheckedUpdateWithoutTournamentRulesInput>;
};
export type UserCreateNestedOneWithoutSeasonsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSeasonsInput, Prisma.UserUncheckedCreateWithoutSeasonsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSeasonsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutSeasonsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSeasonsInput, Prisma.UserUncheckedCreateWithoutSeasonsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSeasonsInput;
    upsert?: Prisma.UserUpsertWithoutSeasonsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSeasonsInput, Prisma.UserUpdateWithoutSeasonsInput>, Prisma.UserUncheckedUpdateWithoutSeasonsInput>;
};
export type UserCreateNestedOneWithoutTeamsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamsInput, Prisma.UserUncheckedCreateWithoutTeamsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutTeamsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamsInput, Prisma.UserUncheckedCreateWithoutTeamsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamsInput;
    upsert?: Prisma.UserUpsertWithoutTeamsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTeamsInput, Prisma.UserUpdateWithoutTeamsInput>, Prisma.UserUncheckedUpdateWithoutTeamsInput>;
};
export type UserCreateNestedOneWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPlayerInput, Prisma.UserUncheckedCreateWithoutPlayerInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPlayerInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPlayerInput, Prisma.UserUncheckedCreateWithoutPlayerInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPlayerInput;
    upsert?: Prisma.UserUpsertWithoutPlayerInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPlayerInput, Prisma.UserUpdateWithoutPlayerInput>, Prisma.UserUncheckedUpdateWithoutPlayerInput>;
};
export type UserCreateNestedOneWithoutTeamPlayersInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamPlayersInput, Prisma.UserUncheckedCreateWithoutTeamPlayersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamPlayersInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutTeamPlayersNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamPlayersInput, Prisma.UserUncheckedCreateWithoutTeamPlayersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamPlayersInput;
    upsert?: Prisma.UserUpsertWithoutTeamPlayersInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTeamPlayersInput, Prisma.UserUpdateWithoutTeamPlayersInput>, Prisma.UserUncheckedUpdateWithoutTeamPlayersInput>;
};
export type UserCreateNestedOneWithoutTeamLeadersInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamLeadersInput, Prisma.UserUncheckedCreateWithoutTeamLeadersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamLeadersInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutTeamLeadersNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamLeadersInput, Prisma.UserUncheckedCreateWithoutTeamLeadersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamLeadersInput;
    upsert?: Prisma.UserUpsertWithoutTeamLeadersInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTeamLeadersInput, Prisma.UserUpdateWithoutTeamLeadersInput>, Prisma.UserUncheckedUpdateWithoutTeamLeadersInput>;
};
export type UserCreateNestedOneWithoutSeasonTeamsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSeasonTeamsInput, Prisma.UserUncheckedCreateWithoutSeasonTeamsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSeasonTeamsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutSeasonTeamsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSeasonTeamsInput, Prisma.UserUncheckedCreateWithoutSeasonTeamsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSeasonTeamsInput;
    upsert?: Prisma.UserUpsertWithoutSeasonTeamsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSeasonTeamsInput, Prisma.UserUpdateWithoutSeasonTeamsInput>, Prisma.UserUncheckedUpdateWithoutSeasonTeamsInput>;
};
export type UserCreateNestedOneWithoutMatchesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMatchesInput, Prisma.UserUncheckedCreateWithoutMatchesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMatchesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutMatchesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMatchesInput, Prisma.UserUncheckedCreateWithoutMatchesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMatchesInput;
    upsert?: Prisma.UserUpsertWithoutMatchesInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutMatchesInput, Prisma.UserUpdateWithoutMatchesInput>, Prisma.UserUncheckedUpdateWithoutMatchesInput>;
};
export type UserCreateNestedOneWithoutArticlesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutArticlesInput, Prisma.UserUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutArticlesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutArticlesInput, Prisma.UserUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutArticlesInput;
    upsert?: Prisma.UserUpsertWithoutArticlesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutArticlesInput, Prisma.UserUpdateWithoutArticlesInput>, Prisma.UserUncheckedUpdateWithoutArticlesInput>;
};
export type UserCreateWithoutUser_rolesInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutUser_rolesInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutUser_rolesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutUser_rolesInput, Prisma.UserUncheckedCreateWithoutUser_rolesInput>;
};
export type UserUpsertWithoutUser_rolesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutUser_rolesInput, Prisma.UserUncheckedUpdateWithoutUser_rolesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutUser_rolesInput, Prisma.UserUncheckedCreateWithoutUser_rolesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutUser_rolesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutUser_rolesInput, Prisma.UserUncheckedUpdateWithoutUser_rolesInput>;
};
export type UserUpdateWithoutUser_rolesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutUser_rolesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutTournamentsInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutTournamentsInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutTournamentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTournamentsInput, Prisma.UserUncheckedCreateWithoutTournamentsInput>;
};
export type UserUpsertWithoutTournamentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTournamentsInput, Prisma.UserUncheckedUpdateWithoutTournamentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTournamentsInput, Prisma.UserUncheckedCreateWithoutTournamentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTournamentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTournamentsInput, Prisma.UserUncheckedUpdateWithoutTournamentsInput>;
};
export type UserUpdateWithoutTournamentsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutTournamentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutTournamentRulesInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutTournamentRulesInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutTournamentRulesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTournamentRulesInput, Prisma.UserUncheckedCreateWithoutTournamentRulesInput>;
};
export type UserUpsertWithoutTournamentRulesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTournamentRulesInput, Prisma.UserUncheckedUpdateWithoutTournamentRulesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTournamentRulesInput, Prisma.UserUncheckedCreateWithoutTournamentRulesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTournamentRulesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTournamentRulesInput, Prisma.UserUncheckedUpdateWithoutTournamentRulesInput>;
};
export type UserUpdateWithoutTournamentRulesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutTournamentRulesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutSeasonsInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSeasonsInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSeasonsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSeasonsInput, Prisma.UserUncheckedCreateWithoutSeasonsInput>;
};
export type UserUpsertWithoutSeasonsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSeasonsInput, Prisma.UserUncheckedUpdateWithoutSeasonsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSeasonsInput, Prisma.UserUncheckedCreateWithoutSeasonsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSeasonsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSeasonsInput, Prisma.UserUncheckedUpdateWithoutSeasonsInput>;
};
export type UserUpdateWithoutSeasonsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSeasonsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutTeamsInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutTeamsInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutTeamsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamsInput, Prisma.UserUncheckedCreateWithoutTeamsInput>;
};
export type UserUpsertWithoutTeamsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTeamsInput, Prisma.UserUncheckedUpdateWithoutTeamsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamsInput, Prisma.UserUncheckedCreateWithoutTeamsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTeamsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTeamsInput, Prisma.UserUncheckedUpdateWithoutTeamsInput>;
};
export type UserUpdateWithoutTeamsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutTeamsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutPlayerInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutPlayerInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutPlayerInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPlayerInput, Prisma.UserUncheckedCreateWithoutPlayerInput>;
};
export type UserUpsertWithoutPlayerInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPlayerInput, Prisma.UserUncheckedUpdateWithoutPlayerInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPlayerInput, Prisma.UserUncheckedCreateWithoutPlayerInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPlayerInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPlayerInput, Prisma.UserUncheckedUpdateWithoutPlayerInput>;
};
export type UserUpdateWithoutPlayerInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutTeamPlayersInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutTeamPlayersInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutTeamPlayersInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamPlayersInput, Prisma.UserUncheckedCreateWithoutTeamPlayersInput>;
};
export type UserUpsertWithoutTeamPlayersInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTeamPlayersInput, Prisma.UserUncheckedUpdateWithoutTeamPlayersInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamPlayersInput, Prisma.UserUncheckedCreateWithoutTeamPlayersInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTeamPlayersInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTeamPlayersInput, Prisma.UserUncheckedUpdateWithoutTeamPlayersInput>;
};
export type UserUpdateWithoutTeamPlayersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutTeamPlayersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutTeamLeadersInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutTeamLeadersInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutTeamLeadersInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamLeadersInput, Prisma.UserUncheckedCreateWithoutTeamLeadersInput>;
};
export type UserUpsertWithoutTeamLeadersInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTeamLeadersInput, Prisma.UserUncheckedUpdateWithoutTeamLeadersInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamLeadersInput, Prisma.UserUncheckedCreateWithoutTeamLeadersInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTeamLeadersInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTeamLeadersInput, Prisma.UserUncheckedUpdateWithoutTeamLeadersInput>;
};
export type UserUpdateWithoutTeamLeadersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutTeamLeadersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutSeasonTeamsInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSeasonTeamsInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSeasonTeamsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSeasonTeamsInput, Prisma.UserUncheckedCreateWithoutSeasonTeamsInput>;
};
export type UserUpsertWithoutSeasonTeamsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSeasonTeamsInput, Prisma.UserUncheckedUpdateWithoutSeasonTeamsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSeasonTeamsInput, Prisma.UserUncheckedCreateWithoutSeasonTeamsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSeasonTeamsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSeasonTeamsInput, Prisma.UserUncheckedUpdateWithoutSeasonTeamsInput>;
};
export type UserUpdateWithoutSeasonTeamsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSeasonTeamsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutMatchesInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutMatchesInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutMatchesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutMatchesInput, Prisma.UserUncheckedCreateWithoutMatchesInput>;
};
export type UserUpsertWithoutMatchesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutMatchesInput, Prisma.UserUncheckedUpdateWithoutMatchesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutMatchesInput, Prisma.UserUncheckedCreateWithoutMatchesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutMatchesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutMatchesInput, Prisma.UserUncheckedUpdateWithoutMatchesInput>;
};
export type UserUpdateWithoutMatchesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutMatchesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutArticlesInput = {
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutArticlesInput = {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedCreateNestedManyWithoutUserInput;
    tournaments?: Prisma.TournamentUncheckedCreateNestedManyWithoutUserInput;
    seasons?: Prisma.SeasonUncheckedCreateNestedManyWithoutUserInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedCreateNestedManyWithoutUserInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutUserInput;
    player?: Prisma.PlayerUncheckedCreateNestedOneWithoutUserInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutUserInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutUserInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutUserInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutArticlesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutArticlesInput, Prisma.UserUncheckedCreateWithoutArticlesInput>;
};
export type UserUpsertWithoutArticlesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutArticlesInput, Prisma.UserUncheckedUpdateWithoutArticlesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutArticlesInput, Prisma.UserUncheckedCreateWithoutArticlesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutArticlesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutArticlesInput, Prisma.UserUncheckedUpdateWithoutArticlesInput>;
};
export type UserUpdateWithoutArticlesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutArticlesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email_verified_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_roles?: Prisma.User_RoleUncheckedUpdateManyWithoutUserNestedInput;
    tournaments?: Prisma.TournamentUncheckedUpdateManyWithoutUserNestedInput;
    seasons?: Prisma.SeasonUncheckedUpdateManyWithoutUserNestedInput;
    tournamentRules?: Prisma.TournamentRuleUncheckedUpdateManyWithoutUserNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutUserNestedInput;
    player?: Prisma.PlayerUncheckedUpdateOneWithoutUserNestedInput;
    teamPlayers?: Prisma.TeamPlayerUncheckedUpdateManyWithoutUserNestedInput;
    seasonTeams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutUserNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutUserNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutUserNestedInput;
};
/**
 * Count Type UserCountOutputType
 */
export type UserCountOutputType = {
    user_roles: number;
    tournaments: number;
    seasons: number;
    tournamentRules: number;
    teams: number;
    teamPlayers: number;
    seasonTeams: number;
    matches: number;
    teamLeaders: number;
    articles: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user_roles?: boolean | UserCountOutputTypeCountUser_rolesArgs;
    tournaments?: boolean | UserCountOutputTypeCountTournamentsArgs;
    seasons?: boolean | UserCountOutputTypeCountSeasonsArgs;
    tournamentRules?: boolean | UserCountOutputTypeCountTournamentRulesArgs;
    teams?: boolean | UserCountOutputTypeCountTeamsArgs;
    teamPlayers?: boolean | UserCountOutputTypeCountTeamPlayersArgs;
    seasonTeams?: boolean | UserCountOutputTypeCountSeasonTeamsArgs;
    matches?: boolean | UserCountOutputTypeCountMatchesArgs;
    teamLeaders?: boolean | UserCountOutputTypeCountTeamLeadersArgs;
    articles?: boolean | UserCountOutputTypeCountArticlesArgs;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountUser_rolesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.User_RoleWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountTournamentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TournamentWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountSeasonsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountTournamentRulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TournamentRuleWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountTeamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountTeamPlayersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountSeasonTeamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonTeamWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountMatchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountTeamLeadersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamLeaderWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountArticlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    password?: boolean;
    phone?: boolean;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    user_roles?: boolean | Prisma.User$user_rolesArgs<ExtArgs>;
    tournaments?: boolean | Prisma.User$tournamentsArgs<ExtArgs>;
    seasons?: boolean | Prisma.User$seasonsArgs<ExtArgs>;
    tournamentRules?: boolean | Prisma.User$tournamentRulesArgs<ExtArgs>;
    teams?: boolean | Prisma.User$teamsArgs<ExtArgs>;
    player?: boolean | Prisma.User$playerArgs<ExtArgs>;
    teamPlayers?: boolean | Prisma.User$teamPlayersArgs<ExtArgs>;
    seasonTeams?: boolean | Prisma.User$seasonTeamsArgs<ExtArgs>;
    matches?: boolean | Prisma.User$matchesArgs<ExtArgs>;
    teamLeaders?: boolean | Prisma.User$teamLeadersArgs<ExtArgs>;
    articles?: boolean | Prisma.User$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    password?: boolean;
    phone?: boolean;
    is_active?: boolean;
    email_verified?: boolean;
    email_verified_at?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "email" | "password" | "phone" | "is_active" | "email_verified" | "email_verified_at" | "created_at" | "updated_at", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user_roles?: boolean | Prisma.User$user_rolesArgs<ExtArgs>;
    tournaments?: boolean | Prisma.User$tournamentsArgs<ExtArgs>;
    seasons?: boolean | Prisma.User$seasonsArgs<ExtArgs>;
    tournamentRules?: boolean | Prisma.User$tournamentRulesArgs<ExtArgs>;
    teams?: boolean | Prisma.User$teamsArgs<ExtArgs>;
    player?: boolean | Prisma.User$playerArgs<ExtArgs>;
    teamPlayers?: boolean | Prisma.User$teamPlayersArgs<ExtArgs>;
    seasonTeams?: boolean | Prisma.User$seasonTeamsArgs<ExtArgs>;
    matches?: boolean | Prisma.User$matchesArgs<ExtArgs>;
    teamLeaders?: boolean | Prisma.User$teamLeadersArgs<ExtArgs>;
    articles?: boolean | Prisma.User$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        user_roles: Prisma.$User_RolePayload<ExtArgs>[];
        tournaments: Prisma.$TournamentPayload<ExtArgs>[];
        seasons: Prisma.$SeasonPayload<ExtArgs>[];
        tournamentRules: Prisma.$TournamentRulePayload<ExtArgs>[];
        teams: Prisma.$TeamPayload<ExtArgs>[];
        player: Prisma.$PlayerPayload<ExtArgs> | null;
        teamPlayers: Prisma.$TeamPlayerPayload<ExtArgs>[];
        seasonTeams: Prisma.$SeasonTeamPayload<ExtArgs>[];
        matches: Prisma.$MatchPayload<ExtArgs>[];
        teamLeaders: Prisma.$TeamLeaderPayload<ExtArgs>[];
        articles: Prisma.$ArticlePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        email: string;
        password: string | null;
        phone: string | null;
        is_active: boolean;
        email_verified: boolean;
        email_verified_at: Date | null;
        created_at: Date;
        updated_at: Date | null;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for User.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user_roles<T extends Prisma.User$user_rolesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$user_rolesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$User_RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tournaments<T extends Prisma.User$tournamentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$tournamentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    seasons<T extends Prisma.User$seasonsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$seasonsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tournamentRules<T extends Prisma.User$tournamentRulesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$tournamentRulesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    teams<T extends Prisma.User$teamsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$teamsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    player<T extends Prisma.User$playerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$playerArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    teamPlayers<T extends Prisma.User$teamPlayersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$teamPlayersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    seasonTeams<T extends Prisma.User$seasonTeamsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$seasonTeamsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matches<T extends Prisma.User$matchesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    teamLeaders<T extends Prisma.User$teamLeadersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$teamLeadersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    articles<T extends Prisma.User$articlesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the User model
 */
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'Int'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly password: Prisma.FieldRef<"User", 'String'>;
    readonly phone: Prisma.FieldRef<"User", 'String'>;
    readonly is_active: Prisma.FieldRef<"User", 'Boolean'>;
    readonly email_verified: Prisma.FieldRef<"User", 'Boolean'>;
    readonly email_verified_at: Prisma.FieldRef<"User", 'DateTime'>;
    readonly created_at: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"User", 'DateTime'>;
}
/**
 * User findUnique
 */
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findUniqueOrThrow
 */
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findFirst
 */
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findFirstOrThrow
 */
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findMany
 */
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which Users to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User create
 */
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
/**
 * User createMany
 */
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * User update
 */
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User updateMany
 */
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
};
/**
 * User upsert
 */
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: Prisma.UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
/**
 * User delete
 */
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User deleteMany
 */
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
};
/**
 * User.user_roles
 */
export type User$user_rolesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User_Role
     */
    select?: Prisma.User_RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User_Role
     */
    omit?: Prisma.User_RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.User_RoleInclude<ExtArgs> | null;
    where?: Prisma.User_RoleWhereInput;
    orderBy?: Prisma.User_RoleOrderByWithRelationInput | Prisma.User_RoleOrderByWithRelationInput[];
    cursor?: Prisma.User_RoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.User_RoleScalarFieldEnum | Prisma.User_RoleScalarFieldEnum[];
};
/**
 * User.tournaments
 */
export type User$tournamentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: Prisma.TournamentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Tournament
     */
    omit?: Prisma.TournamentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentInclude<ExtArgs> | null;
    where?: Prisma.TournamentWhereInput;
    orderBy?: Prisma.TournamentOrderByWithRelationInput | Prisma.TournamentOrderByWithRelationInput[];
    cursor?: Prisma.TournamentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TournamentScalarFieldEnum | Prisma.TournamentScalarFieldEnum[];
};
/**
 * User.seasons
 */
export type User$seasonsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Season
     */
    select?: Prisma.SeasonSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Season
     */
    omit?: Prisma.SeasonOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonInclude<ExtArgs> | null;
    where?: Prisma.SeasonWhereInput;
    orderBy?: Prisma.SeasonOrderByWithRelationInput | Prisma.SeasonOrderByWithRelationInput[];
    cursor?: Prisma.SeasonWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SeasonScalarFieldEnum | Prisma.SeasonScalarFieldEnum[];
};
/**
 * User.tournamentRules
 */
export type User$tournamentRulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    where?: Prisma.TournamentRuleWhereInput;
    orderBy?: Prisma.TournamentRuleOrderByWithRelationInput | Prisma.TournamentRuleOrderByWithRelationInput[];
    cursor?: Prisma.TournamentRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TournamentRuleScalarFieldEnum | Prisma.TournamentRuleScalarFieldEnum[];
};
/**
 * User.teams
 */
export type User$teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    cursor?: Prisma.TeamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
/**
 * User.player
 */
export type User$playerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    where?: Prisma.PlayerWhereInput;
};
/**
 * User.teamPlayers
 */
export type User$teamPlayersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    where?: Prisma.TeamPlayerWhereInput;
    orderBy?: Prisma.TeamPlayerOrderByWithRelationInput | Prisma.TeamPlayerOrderByWithRelationInput[];
    cursor?: Prisma.TeamPlayerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamPlayerScalarFieldEnum | Prisma.TeamPlayerScalarFieldEnum[];
};
/**
 * User.seasonTeams
 */
export type User$seasonTeamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeam
     */
    select?: Prisma.SeasonTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeam
     */
    omit?: Prisma.SeasonTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamInclude<ExtArgs> | null;
    where?: Prisma.SeasonTeamWhereInput;
    orderBy?: Prisma.SeasonTeamOrderByWithRelationInput | Prisma.SeasonTeamOrderByWithRelationInput[];
    cursor?: Prisma.SeasonTeamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SeasonTeamScalarFieldEnum | Prisma.SeasonTeamScalarFieldEnum[];
};
/**
 * User.matches
 */
export type User$matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    where?: Prisma.MatchWhereInput;
    orderBy?: Prisma.MatchOrderByWithRelationInput | Prisma.MatchOrderByWithRelationInput[];
    cursor?: Prisma.MatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MatchScalarFieldEnum | Prisma.MatchScalarFieldEnum[];
};
/**
 * User.teamLeaders
 */
export type User$teamLeadersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamLeader
     */
    select?: Prisma.TeamLeaderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamLeader
     */
    omit?: Prisma.TeamLeaderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamLeaderInclude<ExtArgs> | null;
    where?: Prisma.TeamLeaderWhereInput;
    orderBy?: Prisma.TeamLeaderOrderByWithRelationInput | Prisma.TeamLeaderOrderByWithRelationInput[];
    cursor?: Prisma.TeamLeaderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamLeaderScalarFieldEnum | Prisma.TeamLeaderScalarFieldEnum[];
};
/**
 * User.articles
 */
export type User$articlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    where?: Prisma.ArticleWhereInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput | Prisma.ArticleOrderByWithRelationInput[];
    cursor?: Prisma.ArticleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleScalarFieldEnum | Prisma.ArticleScalarFieldEnum[];
};
/**
 * User without action
 */
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
};
//# sourceMappingURL=User.d.ts.map