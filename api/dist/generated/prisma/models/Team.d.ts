import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Team
 *
 */
export type TeamModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamPayload>;
export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null;
    _avg: TeamAvgAggregateOutputType | null;
    _sum: TeamSumAggregateOutputType | null;
    _min: TeamMinAggregateOutputType | null;
    _max: TeamMaxAggregateOutputType | null;
};
export type TeamAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type TeamSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type TeamMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    coach_name: string | null;
    logo: string | null;
    description: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
};
export type TeamMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    coach_name: string | null;
    logo: string | null;
    description: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
};
export type TeamCountAggregateOutputType = {
    id: number;
    name: number;
    coach_name: number;
    logo: number;
    description: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    user_id: number;
    _all: number;
};
export type TeamAvgAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type TeamSumAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type TeamMinAggregateInputType = {
    id?: true;
    name?: true;
    coach_name?: true;
    logo?: true;
    description?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
};
export type TeamMaxAggregateInputType = {
    id?: true;
    name?: true;
    coach_name?: true;
    logo?: true;
    description?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
};
export type TeamCountAggregateInputType = {
    id?: true;
    name?: true;
    coach_name?: true;
    logo?: true;
    description?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
    _all?: true;
};
export type TeamAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: Prisma.TeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Teams to fetch.
     */
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.TeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Teams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: TeamAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: TeamSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType;
};
export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
    [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeam[P]> : Prisma.GetScalarType<T[P], AggregateTeam[P]>;
};
export type TeamGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithAggregationInput | Prisma.TeamOrderByWithAggregationInput[];
    by: Prisma.TeamScalarFieldEnum[] | Prisma.TeamScalarFieldEnum;
    having?: Prisma.TeamScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamCountAggregateInputType | true;
    _avg?: TeamAvgAggregateInputType;
    _sum?: TeamSumAggregateInputType;
    _min?: TeamMinAggregateInputType;
    _max?: TeamMaxAggregateInputType;
};
export type TeamGroupByOutputType = {
    id: number;
    name: string;
    coach_name: string | null;
    logo: string | null;
    description: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
    _count: TeamCountAggregateOutputType | null;
    _avg: TeamAvgAggregateOutputType | null;
    _sum: TeamSumAggregateOutputType | null;
    _min: TeamMinAggregateOutputType | null;
    _max: TeamMaxAggregateOutputType | null;
};
export type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamGroupByOutputType[P]>;
}>>;
export type TeamWhereInput = {
    AND?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    OR?: Prisma.TeamWhereInput[];
    NOT?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    id?: Prisma.IntFilter<"Team"> | number;
    name?: Prisma.StringFilter<"Team"> | string;
    coach_name?: Prisma.StringNullableFilter<"Team"> | string | null;
    logo?: Prisma.StringNullableFilter<"Team"> | string | null;
    description?: Prisma.StringNullableFilter<"Team"> | string | null;
    is_active?: Prisma.BoolFilter<"Team"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Team"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Team"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Team"> | Date | string | null;
    user_id?: Prisma.IntNullableFilter<"Team"> | number | null;
    team_players?: Prisma.TeamPlayerListRelationFilter;
    season_teams?: Prisma.SeasonTeamListRelationFilter;
    home_matches?: Prisma.MatchListRelationFilter;
    away_matches?: Prisma.MatchListRelationFilter;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    teamLeaders?: Prisma.TeamLeaderListRelationFilter;
    teamStandings?: Prisma.TeamStandingListRelationFilter;
    playerStatistics?: Prisma.PlayerStatisticListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
    matchResults?: Prisma.MatchResultListRelationFilter;
    articles?: Prisma.ArticleListRelationFilter;
    matchLineups?: Prisma.MatchLineupListRelationFilter;
    matchEvents?: Prisma.MatchEventListRelationFilter;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentListRelationFilter;
};
export type TeamOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    coach_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    logo?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    team_players?: Prisma.TeamPlayerOrderByRelationAggregateInput;
    season_teams?: Prisma.SeasonTeamOrderByRelationAggregateInput;
    home_matches?: Prisma.MatchOrderByRelationAggregateInput;
    away_matches?: Prisma.MatchOrderByRelationAggregateInput;
    user?: Prisma.UserOrderByWithRelationInput;
    teamLeaders?: Prisma.TeamLeaderOrderByRelationAggregateInput;
    teamStandings?: Prisma.TeamStandingOrderByRelationAggregateInput;
    playerStatistics?: Prisma.PlayerStatisticOrderByRelationAggregateInput;
    notifications?: Prisma.NotificationOrderByRelationAggregateInput;
    matchResults?: Prisma.MatchResultOrderByRelationAggregateInput;
    articles?: Prisma.ArticleOrderByRelationAggregateInput;
    matchLineups?: Prisma.MatchLineupOrderByRelationAggregateInput;
    matchEvents?: Prisma.MatchEventOrderByRelationAggregateInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentOrderByRelationAggregateInput;
    _relevance?: Prisma.TeamOrderByRelevanceInput;
};
export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name?: string;
    AND?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    OR?: Prisma.TeamWhereInput[];
    NOT?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    coach_name?: Prisma.StringNullableFilter<"Team"> | string | null;
    logo?: Prisma.StringNullableFilter<"Team"> | string | null;
    description?: Prisma.StringNullableFilter<"Team"> | string | null;
    is_active?: Prisma.BoolFilter<"Team"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Team"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Team"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Team"> | Date | string | null;
    user_id?: Prisma.IntNullableFilter<"Team"> | number | null;
    team_players?: Prisma.TeamPlayerListRelationFilter;
    season_teams?: Prisma.SeasonTeamListRelationFilter;
    home_matches?: Prisma.MatchListRelationFilter;
    away_matches?: Prisma.MatchListRelationFilter;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    teamLeaders?: Prisma.TeamLeaderListRelationFilter;
    teamStandings?: Prisma.TeamStandingListRelationFilter;
    playerStatistics?: Prisma.PlayerStatisticListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
    matchResults?: Prisma.MatchResultListRelationFilter;
    articles?: Prisma.ArticleListRelationFilter;
    matchLineups?: Prisma.MatchLineupListRelationFilter;
    matchEvents?: Prisma.MatchEventListRelationFilter;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentListRelationFilter;
}, "id" | "name">;
export type TeamOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    coach_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    logo?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TeamCountOrderByAggregateInput;
    _avg?: Prisma.TeamAvgOrderByAggregateInput;
    _max?: Prisma.TeamMaxOrderByAggregateInput;
    _min?: Prisma.TeamMinOrderByAggregateInput;
    _sum?: Prisma.TeamSumOrderByAggregateInput;
};
export type TeamScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamScalarWhereWithAggregatesInput | Prisma.TeamScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamScalarWhereWithAggregatesInput | Prisma.TeamScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Team"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Team"> | string;
    coach_name?: Prisma.StringNullableWithAggregatesFilter<"Team"> | string | null;
    logo?: Prisma.StringNullableWithAggregatesFilter<"Team"> | string | null;
    description?: Prisma.StringNullableWithAggregatesFilter<"Team"> | string | null;
    is_active?: Prisma.BoolWithAggregatesFilter<"Team"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Team"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Team"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Team"> | Date | string | null;
    user_id?: Prisma.IntNullableWithAggregatesFilter<"Team"> | number | null;
};
export type TeamCreateInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateManyInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
};
export type TeamUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TeamListRelationFilter = {
    every?: Prisma.TeamWhereInput;
    some?: Prisma.TeamWhereInput;
    none?: Prisma.TeamWhereInput;
};
export type TeamOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TeamOrderByRelevanceInput = {
    fields: Prisma.TeamOrderByRelevanceFieldEnum | Prisma.TeamOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type TeamCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    coach_name?: Prisma.SortOrder;
    logo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    coach_name?: Prisma.SortOrder;
    logo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    coach_name?: Prisma.SortOrder;
    logo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamScalarRelationFilter = {
    is?: Prisma.TeamWhereInput;
    isNot?: Prisma.TeamWhereInput;
};
export type TeamNullableScalarRelationFilter = {
    is?: Prisma.TeamWhereInput | null;
    isNot?: Prisma.TeamWhereInput | null;
};
export type TeamCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutUserInput, Prisma.TeamUncheckedCreateWithoutUserInput> | Prisma.TeamCreateWithoutUserInput[] | Prisma.TeamUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutUserInput | Prisma.TeamCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TeamCreateManyUserInputEnvelope;
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
};
export type TeamUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutUserInput, Prisma.TeamUncheckedCreateWithoutUserInput> | Prisma.TeamCreateWithoutUserInput[] | Prisma.TeamUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutUserInput | Prisma.TeamCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TeamCreateManyUserInputEnvelope;
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
};
export type TeamUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutUserInput, Prisma.TeamUncheckedCreateWithoutUserInput> | Prisma.TeamCreateWithoutUserInput[] | Prisma.TeamUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutUserInput | Prisma.TeamCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TeamUpsertWithWhereUniqueWithoutUserInput | Prisma.TeamUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TeamCreateManyUserInputEnvelope;
    set?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    disconnect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    delete?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    update?: Prisma.TeamUpdateWithWhereUniqueWithoutUserInput | Prisma.TeamUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TeamUpdateManyWithWhereWithoutUserInput | Prisma.TeamUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
};
export type TeamUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutUserInput, Prisma.TeamUncheckedCreateWithoutUserInput> | Prisma.TeamCreateWithoutUserInput[] | Prisma.TeamUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutUserInput | Prisma.TeamCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TeamUpsertWithWhereUniqueWithoutUserInput | Prisma.TeamUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TeamCreateManyUserInputEnvelope;
    set?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    disconnect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    delete?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    update?: Prisma.TeamUpdateWithWhereUniqueWithoutUserInput | Prisma.TeamUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TeamUpdateManyWithWhereWithoutUserInput | Prisma.TeamUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
};
export type TeamCreateNestedOneWithoutMatchJerseyAssignmentsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchJerseyAssignmentsInput, Prisma.TeamUncheckedCreateWithoutMatchJerseyAssignmentsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchJerseyAssignmentsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutMatchJerseyAssignmentsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchJerseyAssignmentsInput, Prisma.TeamUncheckedCreateWithoutMatchJerseyAssignmentsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchJerseyAssignmentsInput;
    upsert?: Prisma.TeamUpsertWithoutMatchJerseyAssignmentsInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMatchJerseyAssignmentsInput, Prisma.TeamUpdateWithoutMatchJerseyAssignmentsInput>, Prisma.TeamUncheckedUpdateWithoutMatchJerseyAssignmentsInput>;
};
export type TeamCreateNestedOneWithoutTeam_playersInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutTeam_playersInput, Prisma.TeamUncheckedCreateWithoutTeam_playersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutTeam_playersInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutTeam_playersNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutTeam_playersInput, Prisma.TeamUncheckedCreateWithoutTeam_playersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutTeam_playersInput;
    upsert?: Prisma.TeamUpsertWithoutTeam_playersInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutTeam_playersInput, Prisma.TeamUpdateWithoutTeam_playersInput>, Prisma.TeamUncheckedUpdateWithoutTeam_playersInput>;
};
export type TeamCreateNestedOneWithoutTeamLeadersInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutTeamLeadersInput, Prisma.TeamUncheckedCreateWithoutTeamLeadersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutTeamLeadersInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutTeamLeadersNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutTeamLeadersInput, Prisma.TeamUncheckedCreateWithoutTeamLeadersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutTeamLeadersInput;
    upsert?: Prisma.TeamUpsertWithoutTeamLeadersInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutTeamLeadersInput, Prisma.TeamUpdateWithoutTeamLeadersInput>, Prisma.TeamUncheckedUpdateWithoutTeamLeadersInput>;
};
export type TeamCreateNestedOneWithoutSeason_teamsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSeason_teamsInput, Prisma.TeamUncheckedCreateWithoutSeason_teamsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSeason_teamsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutSeason_teamsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSeason_teamsInput, Prisma.TeamUncheckedCreateWithoutSeason_teamsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSeason_teamsInput;
    upsert?: Prisma.TeamUpsertWithoutSeason_teamsInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutSeason_teamsInput, Prisma.TeamUpdateWithoutSeason_teamsInput>, Prisma.TeamUncheckedUpdateWithoutSeason_teamsInput>;
};
export type TeamCreateNestedOneWithoutMatchLineupsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchLineupsInput, Prisma.TeamUncheckedCreateWithoutMatchLineupsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchLineupsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutMatchLineupsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchLineupsInput, Prisma.TeamUncheckedCreateWithoutMatchLineupsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchLineupsInput;
    upsert?: Prisma.TeamUpsertWithoutMatchLineupsInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMatchLineupsInput, Prisma.TeamUpdateWithoutMatchLineupsInput>, Prisma.TeamUncheckedUpdateWithoutMatchLineupsInput>;
};
export type TeamCreateNestedOneWithoutHome_matchesInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutHome_matchesInput, Prisma.TeamUncheckedCreateWithoutHome_matchesInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutHome_matchesInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamCreateNestedOneWithoutAway_matchesInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutAway_matchesInput, Prisma.TeamUncheckedCreateWithoutAway_matchesInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutAway_matchesInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutHome_matchesNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutHome_matchesInput, Prisma.TeamUncheckedCreateWithoutHome_matchesInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutHome_matchesInput;
    upsert?: Prisma.TeamUpsertWithoutHome_matchesInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutHome_matchesInput, Prisma.TeamUpdateWithoutHome_matchesInput>, Prisma.TeamUncheckedUpdateWithoutHome_matchesInput>;
};
export type TeamUpdateOneRequiredWithoutAway_matchesNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutAway_matchesInput, Prisma.TeamUncheckedCreateWithoutAway_matchesInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutAway_matchesInput;
    upsert?: Prisma.TeamUpsertWithoutAway_matchesInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutAway_matchesInput, Prisma.TeamUpdateWithoutAway_matchesInput>, Prisma.TeamUncheckedUpdateWithoutAway_matchesInput>;
};
export type TeamCreateNestedOneWithoutMatchEventsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchEventsInput, Prisma.TeamUncheckedCreateWithoutMatchEventsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchEventsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneWithoutMatchEventsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchEventsInput, Prisma.TeamUncheckedCreateWithoutMatchEventsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchEventsInput;
    upsert?: Prisma.TeamUpsertWithoutMatchEventsInput;
    disconnect?: Prisma.TeamWhereInput | boolean;
    delete?: Prisma.TeamWhereInput | boolean;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMatchEventsInput, Prisma.TeamUpdateWithoutMatchEventsInput>, Prisma.TeamUncheckedUpdateWithoutMatchEventsInput>;
};
export type TeamCreateNestedOneWithoutTeamStandingsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutTeamStandingsInput, Prisma.TeamUncheckedCreateWithoutTeamStandingsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutTeamStandingsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutTeamStandingsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutTeamStandingsInput, Prisma.TeamUncheckedCreateWithoutTeamStandingsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutTeamStandingsInput;
    upsert?: Prisma.TeamUpsertWithoutTeamStandingsInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutTeamStandingsInput, Prisma.TeamUpdateWithoutTeamStandingsInput>, Prisma.TeamUncheckedUpdateWithoutTeamStandingsInput>;
};
export type TeamCreateNestedOneWithoutPlayerStatisticsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutPlayerStatisticsInput, Prisma.TeamUncheckedCreateWithoutPlayerStatisticsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutPlayerStatisticsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutPlayerStatisticsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutPlayerStatisticsInput, Prisma.TeamUncheckedCreateWithoutPlayerStatisticsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutPlayerStatisticsInput;
    upsert?: Prisma.TeamUpsertWithoutPlayerStatisticsInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutPlayerStatisticsInput, Prisma.TeamUpdateWithoutPlayerStatisticsInput>, Prisma.TeamUncheckedUpdateWithoutPlayerStatisticsInput>;
};
export type TeamCreateNestedOneWithoutMatchResultsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchResultsInput, Prisma.TeamUncheckedCreateWithoutMatchResultsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchResultsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneWithoutMatchResultsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchResultsInput, Prisma.TeamUncheckedCreateWithoutMatchResultsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchResultsInput;
    upsert?: Prisma.TeamUpsertWithoutMatchResultsInput;
    disconnect?: Prisma.TeamWhereInput | boolean;
    delete?: Prisma.TeamWhereInput | boolean;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMatchResultsInput, Prisma.TeamUpdateWithoutMatchResultsInput>, Prisma.TeamUncheckedUpdateWithoutMatchResultsInput>;
};
export type TeamCreateNestedOneWithoutNotificationsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutNotificationsInput, Prisma.TeamUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutNotificationsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneWithoutNotificationsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutNotificationsInput, Prisma.TeamUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutNotificationsInput;
    upsert?: Prisma.TeamUpsertWithoutNotificationsInput;
    disconnect?: Prisma.TeamWhereInput | boolean;
    delete?: Prisma.TeamWhereInput | boolean;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutNotificationsInput, Prisma.TeamUpdateWithoutNotificationsInput>, Prisma.TeamUncheckedUpdateWithoutNotificationsInput>;
};
export type TeamCreateNestedOneWithoutArticlesInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutArticlesInput, Prisma.TeamUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutArticlesInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneWithoutArticlesNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutArticlesInput, Prisma.TeamUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutArticlesInput;
    upsert?: Prisma.TeamUpsertWithoutArticlesInput;
    disconnect?: Prisma.TeamWhereInput | boolean;
    delete?: Prisma.TeamWhereInput | boolean;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutArticlesInput, Prisma.TeamUpdateWithoutArticlesInput>, Prisma.TeamUncheckedUpdateWithoutArticlesInput>;
};
export type TeamCreateWithoutUserInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutUserInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutUserInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutUserInput, Prisma.TeamUncheckedCreateWithoutUserInput>;
};
export type TeamCreateManyUserInputEnvelope = {
    data: Prisma.TeamCreateManyUserInput | Prisma.TeamCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TeamUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamUpdateWithoutUserInput, Prisma.TeamUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutUserInput, Prisma.TeamUncheckedCreateWithoutUserInput>;
};
export type TeamUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutUserInput, Prisma.TeamUncheckedUpdateWithoutUserInput>;
};
export type TeamUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TeamScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateManyMutationInput, Prisma.TeamUncheckedUpdateManyWithoutUserInput>;
};
export type TeamScalarWhereInput = {
    AND?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
    OR?: Prisma.TeamScalarWhereInput[];
    NOT?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
    id?: Prisma.IntFilter<"Team"> | number;
    name?: Prisma.StringFilter<"Team"> | string;
    coach_name?: Prisma.StringNullableFilter<"Team"> | string | null;
    logo?: Prisma.StringNullableFilter<"Team"> | string | null;
    description?: Prisma.StringNullableFilter<"Team"> | string | null;
    is_active?: Prisma.BoolFilter<"Team"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Team"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Team"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Team"> | Date | string | null;
    user_id?: Prisma.IntNullableFilter<"Team"> | number | null;
};
export type TeamCreateWithoutMatchJerseyAssignmentsInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutMatchJerseyAssignmentsInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutMatchJerseyAssignmentsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchJerseyAssignmentsInput, Prisma.TeamUncheckedCreateWithoutMatchJerseyAssignmentsInput>;
};
export type TeamUpsertWithoutMatchJerseyAssignmentsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMatchJerseyAssignmentsInput, Prisma.TeamUncheckedUpdateWithoutMatchJerseyAssignmentsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchJerseyAssignmentsInput, Prisma.TeamUncheckedCreateWithoutMatchJerseyAssignmentsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMatchJerseyAssignmentsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMatchJerseyAssignmentsInput, Prisma.TeamUncheckedUpdateWithoutMatchJerseyAssignmentsInput>;
};
export type TeamUpdateWithoutMatchJerseyAssignmentsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutMatchJerseyAssignmentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutTeam_playersInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutTeam_playersInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutTeam_playersInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutTeam_playersInput, Prisma.TeamUncheckedCreateWithoutTeam_playersInput>;
};
export type TeamUpsertWithoutTeam_playersInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutTeam_playersInput, Prisma.TeamUncheckedUpdateWithoutTeam_playersInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutTeam_playersInput, Prisma.TeamUncheckedCreateWithoutTeam_playersInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutTeam_playersInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutTeam_playersInput, Prisma.TeamUncheckedUpdateWithoutTeam_playersInput>;
};
export type TeamUpdateWithoutTeam_playersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutTeam_playersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutTeamLeadersInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutTeamLeadersInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutTeamLeadersInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutTeamLeadersInput, Prisma.TeamUncheckedCreateWithoutTeamLeadersInput>;
};
export type TeamUpsertWithoutTeamLeadersInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutTeamLeadersInput, Prisma.TeamUncheckedUpdateWithoutTeamLeadersInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutTeamLeadersInput, Prisma.TeamUncheckedCreateWithoutTeamLeadersInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutTeamLeadersInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutTeamLeadersInput, Prisma.TeamUncheckedUpdateWithoutTeamLeadersInput>;
};
export type TeamUpdateWithoutTeamLeadersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutTeamLeadersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutSeason_teamsInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutSeason_teamsInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutSeason_teamsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutSeason_teamsInput, Prisma.TeamUncheckedCreateWithoutSeason_teamsInput>;
};
export type TeamUpsertWithoutSeason_teamsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutSeason_teamsInput, Prisma.TeamUncheckedUpdateWithoutSeason_teamsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutSeason_teamsInput, Prisma.TeamUncheckedCreateWithoutSeason_teamsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutSeason_teamsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutSeason_teamsInput, Prisma.TeamUncheckedUpdateWithoutSeason_teamsInput>;
};
export type TeamUpdateWithoutSeason_teamsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutSeason_teamsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutMatchLineupsInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutMatchLineupsInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutMatchLineupsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchLineupsInput, Prisma.TeamUncheckedCreateWithoutMatchLineupsInput>;
};
export type TeamUpsertWithoutMatchLineupsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMatchLineupsInput, Prisma.TeamUncheckedUpdateWithoutMatchLineupsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchLineupsInput, Prisma.TeamUncheckedCreateWithoutMatchLineupsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMatchLineupsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMatchLineupsInput, Prisma.TeamUncheckedUpdateWithoutMatchLineupsInput>;
};
export type TeamUpdateWithoutMatchLineupsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutMatchLineupsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutHome_matchesInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutHome_matchesInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutHome_matchesInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutHome_matchesInput, Prisma.TeamUncheckedCreateWithoutHome_matchesInput>;
};
export type TeamCreateWithoutAway_matchesInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutAway_matchesInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutAway_matchesInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutAway_matchesInput, Prisma.TeamUncheckedCreateWithoutAway_matchesInput>;
};
export type TeamUpsertWithoutHome_matchesInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutHome_matchesInput, Prisma.TeamUncheckedUpdateWithoutHome_matchesInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutHome_matchesInput, Prisma.TeamUncheckedCreateWithoutHome_matchesInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutHome_matchesInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutHome_matchesInput, Prisma.TeamUncheckedUpdateWithoutHome_matchesInput>;
};
export type TeamUpdateWithoutHome_matchesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutHome_matchesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamUpsertWithoutAway_matchesInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutAway_matchesInput, Prisma.TeamUncheckedUpdateWithoutAway_matchesInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutAway_matchesInput, Prisma.TeamUncheckedCreateWithoutAway_matchesInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutAway_matchesInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutAway_matchesInput, Prisma.TeamUncheckedUpdateWithoutAway_matchesInput>;
};
export type TeamUpdateWithoutAway_matchesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutAway_matchesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutMatchEventsInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutMatchEventsInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutMatchEventsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchEventsInput, Prisma.TeamUncheckedCreateWithoutMatchEventsInput>;
};
export type TeamUpsertWithoutMatchEventsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMatchEventsInput, Prisma.TeamUncheckedUpdateWithoutMatchEventsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchEventsInput, Prisma.TeamUncheckedCreateWithoutMatchEventsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMatchEventsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMatchEventsInput, Prisma.TeamUncheckedUpdateWithoutMatchEventsInput>;
};
export type TeamUpdateWithoutMatchEventsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutMatchEventsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutTeamStandingsInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutTeamStandingsInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutTeamStandingsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutTeamStandingsInput, Prisma.TeamUncheckedCreateWithoutTeamStandingsInput>;
};
export type TeamUpsertWithoutTeamStandingsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutTeamStandingsInput, Prisma.TeamUncheckedUpdateWithoutTeamStandingsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutTeamStandingsInput, Prisma.TeamUncheckedCreateWithoutTeamStandingsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutTeamStandingsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutTeamStandingsInput, Prisma.TeamUncheckedUpdateWithoutTeamStandingsInput>;
};
export type TeamUpdateWithoutTeamStandingsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutTeamStandingsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutPlayerStatisticsInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutPlayerStatisticsInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutPlayerStatisticsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutPlayerStatisticsInput, Prisma.TeamUncheckedCreateWithoutPlayerStatisticsInput>;
};
export type TeamUpsertWithoutPlayerStatisticsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutPlayerStatisticsInput, Prisma.TeamUncheckedUpdateWithoutPlayerStatisticsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutPlayerStatisticsInput, Prisma.TeamUncheckedCreateWithoutPlayerStatisticsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutPlayerStatisticsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutPlayerStatisticsInput, Prisma.TeamUncheckedUpdateWithoutPlayerStatisticsInput>;
};
export type TeamUpdateWithoutPlayerStatisticsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutPlayerStatisticsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutMatchResultsInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutMatchResultsInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutMatchResultsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchResultsInput, Prisma.TeamUncheckedCreateWithoutMatchResultsInput>;
};
export type TeamUpsertWithoutMatchResultsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMatchResultsInput, Prisma.TeamUncheckedUpdateWithoutMatchResultsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchResultsInput, Prisma.TeamUncheckedCreateWithoutMatchResultsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMatchResultsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMatchResultsInput, Prisma.TeamUncheckedUpdateWithoutMatchResultsInput>;
};
export type TeamUpdateWithoutMatchResultsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutMatchResultsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutNotificationsInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutNotificationsInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutTeamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutNotificationsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutNotificationsInput, Prisma.TeamUncheckedCreateWithoutNotificationsInput>;
};
export type TeamUpsertWithoutNotificationsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutNotificationsInput, Prisma.TeamUncheckedUpdateWithoutNotificationsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutNotificationsInput, Prisma.TeamUncheckedCreateWithoutNotificationsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutNotificationsInput, Prisma.TeamUncheckedUpdateWithoutNotificationsInput>;
};
export type TeamUpdateWithoutNotificationsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutNotificationsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutArticlesInput = {
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchCreateNestedManyWithoutAway_teamInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamsInput;
    teamLeaders?: Prisma.TeamLeaderCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultCreateNestedManyWithoutWinner_teamInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutArticlesInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutTeamInput;
    home_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutHome_teamInput;
    away_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutAway_teamInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedCreateNestedManyWithoutTeamInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutTeamInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutTarget_teamInput;
    matchResults?: Prisma.MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutTeamInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutTeamInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutArticlesInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutArticlesInput, Prisma.TeamUncheckedCreateWithoutArticlesInput>;
};
export type TeamUpsertWithoutArticlesInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutArticlesInput, Prisma.TeamUncheckedUpdateWithoutArticlesInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutArticlesInput, Prisma.TeamUncheckedCreateWithoutArticlesInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutArticlesInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutArticlesInput, Prisma.TeamUncheckedUpdateWithoutArticlesInput>;
};
export type TeamUpdateWithoutArticlesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamsNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutArticlesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateManyUserInput = {
    id?: number;
    name: string;
    coach_name?: string | null;
    logo?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type TeamUpdateWithoutUserInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput;
    home_matches?: Prisma.MatchUncheckedUpdateManyWithoutHome_teamNestedInput;
    away_matches?: Prisma.MatchUncheckedUpdateManyWithoutAway_teamNestedInput;
    teamLeaders?: Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutTeamNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutTarget_teamNestedInput;
    matchResults?: Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutTeamNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutTeamNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutTeamNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    coach_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type TeamCountOutputType
 */
export type TeamCountOutputType = {
    team_players: number;
    season_teams: number;
    home_matches: number;
    away_matches: number;
    teamLeaders: number;
    teamStandings: number;
    playerStatistics: number;
    notifications: number;
    matchResults: number;
    articles: number;
    matchLineups: number;
    matchEvents: number;
    matchJerseyAssignments: number;
};
export type TeamCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team_players?: boolean | TeamCountOutputTypeCountTeam_playersArgs;
    season_teams?: boolean | TeamCountOutputTypeCountSeason_teamsArgs;
    home_matches?: boolean | TeamCountOutputTypeCountHome_matchesArgs;
    away_matches?: boolean | TeamCountOutputTypeCountAway_matchesArgs;
    teamLeaders?: boolean | TeamCountOutputTypeCountTeamLeadersArgs;
    teamStandings?: boolean | TeamCountOutputTypeCountTeamStandingsArgs;
    playerStatistics?: boolean | TeamCountOutputTypeCountPlayerStatisticsArgs;
    notifications?: boolean | TeamCountOutputTypeCountNotificationsArgs;
    matchResults?: boolean | TeamCountOutputTypeCountMatchResultsArgs;
    articles?: boolean | TeamCountOutputTypeCountArticlesArgs;
    matchLineups?: boolean | TeamCountOutputTypeCountMatchLineupsArgs;
    matchEvents?: boolean | TeamCountOutputTypeCountMatchEventsArgs;
    matchJerseyAssignments?: boolean | TeamCountOutputTypeCountMatchJerseyAssignmentsArgs;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: Prisma.TeamCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountTeam_playersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountSeason_teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonTeamWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountHome_matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountAway_matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountTeamLeadersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamLeaderWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountTeamStandingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamStandingWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountPlayerStatisticsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlayerStatisticWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountNotificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountMatchResultsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchResultWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountArticlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountMatchLineupsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchLineupWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountMatchEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchEventWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountMatchJerseyAssignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchJerseyAssignmentWhereInput;
};
export type TeamSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    coach_name?: boolean;
    logo?: boolean;
    description?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    user_id?: boolean;
    team_players?: boolean | Prisma.Team$team_playersArgs<ExtArgs>;
    season_teams?: boolean | Prisma.Team$season_teamsArgs<ExtArgs>;
    home_matches?: boolean | Prisma.Team$home_matchesArgs<ExtArgs>;
    away_matches?: boolean | Prisma.Team$away_matchesArgs<ExtArgs>;
    user?: boolean | Prisma.Team$userArgs<ExtArgs>;
    teamLeaders?: boolean | Prisma.Team$teamLeadersArgs<ExtArgs>;
    teamStandings?: boolean | Prisma.Team$teamStandingsArgs<ExtArgs>;
    playerStatistics?: boolean | Prisma.Team$playerStatisticsArgs<ExtArgs>;
    notifications?: boolean | Prisma.Team$notificationsArgs<ExtArgs>;
    matchResults?: boolean | Prisma.Team$matchResultsArgs<ExtArgs>;
    articles?: boolean | Prisma.Team$articlesArgs<ExtArgs>;
    matchLineups?: boolean | Prisma.Team$matchLineupsArgs<ExtArgs>;
    matchEvents?: boolean | Prisma.Team$matchEventsArgs<ExtArgs>;
    matchJerseyAssignments?: boolean | Prisma.Team$matchJerseyAssignmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.TeamCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["team"]>;
export type TeamSelectScalar = {
    id?: boolean;
    name?: boolean;
    coach_name?: boolean;
    logo?: boolean;
    description?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    user_id?: boolean;
};
export type TeamOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "coach_name" | "logo" | "description" | "is_active" | "created_at" | "updated_at" | "deleted_at" | "user_id", ExtArgs["result"]["team"]>;
export type TeamInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team_players?: boolean | Prisma.Team$team_playersArgs<ExtArgs>;
    season_teams?: boolean | Prisma.Team$season_teamsArgs<ExtArgs>;
    home_matches?: boolean | Prisma.Team$home_matchesArgs<ExtArgs>;
    away_matches?: boolean | Prisma.Team$away_matchesArgs<ExtArgs>;
    user?: boolean | Prisma.Team$userArgs<ExtArgs>;
    teamLeaders?: boolean | Prisma.Team$teamLeadersArgs<ExtArgs>;
    teamStandings?: boolean | Prisma.Team$teamStandingsArgs<ExtArgs>;
    playerStatistics?: boolean | Prisma.Team$playerStatisticsArgs<ExtArgs>;
    notifications?: boolean | Prisma.Team$notificationsArgs<ExtArgs>;
    matchResults?: boolean | Prisma.Team$matchResultsArgs<ExtArgs>;
    articles?: boolean | Prisma.Team$articlesArgs<ExtArgs>;
    matchLineups?: boolean | Prisma.Team$matchLineupsArgs<ExtArgs>;
    matchEvents?: boolean | Prisma.Team$matchEventsArgs<ExtArgs>;
    matchJerseyAssignments?: boolean | Prisma.Team$matchJerseyAssignmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.TeamCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $TeamPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Team";
    objects: {
        team_players: Prisma.$TeamPlayerPayload<ExtArgs>[];
        season_teams: Prisma.$SeasonTeamPayload<ExtArgs>[];
        home_matches: Prisma.$MatchPayload<ExtArgs>[];
        away_matches: Prisma.$MatchPayload<ExtArgs>[];
        user: Prisma.$UserPayload<ExtArgs> | null;
        teamLeaders: Prisma.$TeamLeaderPayload<ExtArgs>[];
        teamStandings: Prisma.$TeamStandingPayload<ExtArgs>[];
        playerStatistics: Prisma.$PlayerStatisticPayload<ExtArgs>[];
        notifications: Prisma.$NotificationPayload<ExtArgs>[];
        matchResults: Prisma.$MatchResultPayload<ExtArgs>[];
        articles: Prisma.$ArticlePayload<ExtArgs>[];
        matchLineups: Prisma.$MatchLineupPayload<ExtArgs>[];
        matchEvents: Prisma.$MatchEventPayload<ExtArgs>[];
        matchJerseyAssignments: Prisma.$MatchJerseyAssignmentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        coach_name: string | null;
        logo: string | null;
        description: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        user_id: number | null;
    }, ExtArgs["result"]["team"]>;
    composites: {};
};
export type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamPayload, S>;
export type TeamCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamCountAggregateInputType | true;
};
export interface TeamDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Team'];
        meta: {
            name: 'Team';
        };
    };
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     *
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TeamFindManyArgs>(args?: Prisma.SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     *
     */
    create<T extends TeamCreateArgs>(args: Prisma.SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TeamCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     *
     */
    delete<T extends TeamDeleteArgs>(args: Prisma.SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TeamUpdateArgs>(args: Prisma.SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TeamUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: Prisma.SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(args?: Prisma.Subset<T, TeamCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeamAggregateArgs>(args: Prisma.Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>;
    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
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
    groupBy<T extends TeamGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Team model
     */
    readonly fields: TeamFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Team.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__TeamClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    team_players<T extends Prisma.Team$team_playersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$team_playersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    season_teams<T extends Prisma.Team$season_teamsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$season_teamsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    home_matches<T extends Prisma.Team$home_matchesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$home_matchesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    away_matches<T extends Prisma.Team$away_matchesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$away_matchesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    user<T extends Prisma.Team$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    teamLeaders<T extends Prisma.Team$teamLeadersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$teamLeadersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    teamStandings<T extends Prisma.Team$teamStandingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$teamStandingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamStandingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    playerStatistics<T extends Prisma.Team$playerStatisticsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$playerStatisticsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    notifications<T extends Prisma.Team$notificationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matchResults<T extends Prisma.Team$matchResultsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$matchResultsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    articles<T extends Prisma.Team$articlesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matchLineups<T extends Prisma.Team$matchLineupsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$matchLineupsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matchEvents<T extends Prisma.Team$matchEventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$matchEventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matchJerseyAssignments<T extends Prisma.Team$matchJerseyAssignmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$matchJerseyAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Team model
 */
export interface TeamFieldRefs {
    readonly id: Prisma.FieldRef<"Team", 'Int'>;
    readonly name: Prisma.FieldRef<"Team", 'String'>;
    readonly coach_name: Prisma.FieldRef<"Team", 'String'>;
    readonly logo: Prisma.FieldRef<"Team", 'String'>;
    readonly description: Prisma.FieldRef<"Team", 'String'>;
    readonly is_active: Prisma.FieldRef<"Team", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Team", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Team", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"Team", 'DateTime'>;
    readonly user_id: Prisma.FieldRef<"Team", 'Int'>;
}
/**
 * Team findUnique
 */
export type TeamFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Team to fetch.
     */
    where: Prisma.TeamWhereUniqueInput;
};
/**
 * Team findUniqueOrThrow
 */
export type TeamFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Team to fetch.
     */
    where: Prisma.TeamWhereUniqueInput;
};
/**
 * Team findFirst
 */
export type TeamFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Team to fetch.
     */
    where?: Prisma.TeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Teams to fetch.
     */
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Teams.
     */
    cursor?: Prisma.TeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Teams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Teams.
     */
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
/**
 * Team findFirstOrThrow
 */
export type TeamFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Team to fetch.
     */
    where?: Prisma.TeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Teams to fetch.
     */
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Teams.
     */
    cursor?: Prisma.TeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Teams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Teams.
     */
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
/**
 * Team findMany
 */
export type TeamFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Teams to fetch.
     */
    where?: Prisma.TeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Teams to fetch.
     */
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Teams.
     */
    cursor?: Prisma.TeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Teams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Teams.
     */
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
/**
 * Team create
 */
export type TeamCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a Team.
     */
    data: Prisma.XOR<Prisma.TeamCreateInput, Prisma.TeamUncheckedCreateInput>;
};
/**
 * Team createMany
 */
export type TeamCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: Prisma.TeamCreateManyInput | Prisma.TeamCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Team update
 */
export type TeamUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a Team.
     */
    data: Prisma.XOR<Prisma.TeamUpdateInput, Prisma.TeamUncheckedUpdateInput>;
    /**
     * Choose, which Team to update.
     */
    where: Prisma.TeamWhereUniqueInput;
};
/**
 * Team updateMany
 */
export type TeamUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: Prisma.XOR<Prisma.TeamUpdateManyMutationInput, Prisma.TeamUncheckedUpdateManyInput>;
    /**
     * Filter which Teams to update
     */
    where?: Prisma.TeamWhereInput;
    /**
     * Limit how many Teams to update.
     */
    limit?: number;
};
/**
 * Team upsert
 */
export type TeamUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: Prisma.TeamWhereUniqueInput;
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: Prisma.XOR<Prisma.TeamCreateInput, Prisma.TeamUncheckedCreateInput>;
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.TeamUpdateInput, Prisma.TeamUncheckedUpdateInput>;
};
/**
 * Team delete
 */
export type TeamDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which Team to delete.
     */
    where: Prisma.TeamWhereUniqueInput;
};
/**
 * Team deleteMany
 */
export type TeamDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: Prisma.TeamWhereInput;
    /**
     * Limit how many Teams to delete.
     */
    limit?: number;
};
/**
 * Team.team_players
 */
export type Team$team_playersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.season_teams
 */
export type Team$season_teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.home_matches
 */
export type Team$home_matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.away_matches
 */
export type Team$away_matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.user
 */
export type Team$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.UserWhereInput;
};
/**
 * Team.teamLeaders
 */
export type Team$teamLeadersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.teamStandings
 */
export type Team$teamStandingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamStanding
     */
    select?: Prisma.TeamStandingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamStanding
     */
    omit?: Prisma.TeamStandingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamStandingInclude<ExtArgs> | null;
    where?: Prisma.TeamStandingWhereInput;
    orderBy?: Prisma.TeamStandingOrderByWithRelationInput | Prisma.TeamStandingOrderByWithRelationInput[];
    cursor?: Prisma.TeamStandingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamStandingScalarFieldEnum | Prisma.TeamStandingScalarFieldEnum[];
};
/**
 * Team.playerStatistics
 */
export type Team$playerStatisticsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    where?: Prisma.PlayerStatisticWhereInput;
    orderBy?: Prisma.PlayerStatisticOrderByWithRelationInput | Prisma.PlayerStatisticOrderByWithRelationInput[];
    cursor?: Prisma.PlayerStatisticWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlayerStatisticScalarFieldEnum | Prisma.PlayerStatisticScalarFieldEnum[];
};
/**
 * Team.notifications
 */
export type Team$notificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
/**
 * Team.matchResults
 */
export type Team$matchResultsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchResult
     */
    select?: Prisma.MatchResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MatchResult
     */
    omit?: Prisma.MatchResultOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchResultInclude<ExtArgs> | null;
    where?: Prisma.MatchResultWhereInput;
    orderBy?: Prisma.MatchResultOrderByWithRelationInput | Prisma.MatchResultOrderByWithRelationInput[];
    cursor?: Prisma.MatchResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MatchResultScalarFieldEnum | Prisma.MatchResultScalarFieldEnum[];
};
/**
 * Team.articles
 */
export type Team$articlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.matchLineups
 */
export type Team$matchLineupsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchLineup
     */
    select?: Prisma.MatchLineupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MatchLineup
     */
    omit?: Prisma.MatchLineupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchLineupInclude<ExtArgs> | null;
    where?: Prisma.MatchLineupWhereInput;
    orderBy?: Prisma.MatchLineupOrderByWithRelationInput | Prisma.MatchLineupOrderByWithRelationInput[];
    cursor?: Prisma.MatchLineupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MatchLineupScalarFieldEnum | Prisma.MatchLineupScalarFieldEnum[];
};
/**
 * Team.matchEvents
 */
export type Team$matchEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: Prisma.MatchEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: Prisma.MatchEventOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchEventInclude<ExtArgs> | null;
    where?: Prisma.MatchEventWhereInput;
    orderBy?: Prisma.MatchEventOrderByWithRelationInput | Prisma.MatchEventOrderByWithRelationInput[];
    cursor?: Prisma.MatchEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MatchEventScalarFieldEnum | Prisma.MatchEventScalarFieldEnum[];
};
/**
 * Team.matchJerseyAssignments
 */
export type Team$matchJerseyAssignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchJerseyAssignment
     */
    select?: Prisma.MatchJerseyAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MatchJerseyAssignment
     */
    omit?: Prisma.MatchJerseyAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchJerseyAssignmentInclude<ExtArgs> | null;
    where?: Prisma.MatchJerseyAssignmentWhereInput;
    orderBy?: Prisma.MatchJerseyAssignmentOrderByWithRelationInput | Prisma.MatchJerseyAssignmentOrderByWithRelationInput[];
    cursor?: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MatchJerseyAssignmentScalarFieldEnum | Prisma.MatchJerseyAssignmentScalarFieldEnum[];
};
/**
 * Team without action
 */
export type TeamDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=Team.d.ts.map