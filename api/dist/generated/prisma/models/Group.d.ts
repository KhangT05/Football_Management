import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Group
 *
 */
export type GroupModel = runtime.Types.Result.DefaultSelection<Prisma.$GroupPayload>;
export type AggregateGroup = {
    _count: GroupCountAggregateOutputType | null;
    _avg: GroupAvgAggregateOutputType | null;
    _sum: GroupSumAggregateOutputType | null;
    _min: GroupMinAggregateOutputType | null;
    _max: GroupMaxAggregateOutputType | null;
};
export type GroupAvgAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
};
export type GroupSumAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
};
export type GroupMinAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    name: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    scheduleGeneratedAt: Date | null;
    status: $Enums.GroupStatus | null;
};
export type GroupMaxAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    name: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    scheduleGeneratedAt: Date | null;
    status: $Enums.GroupStatus | null;
};
export type GroupCountAggregateOutputType = {
    id: number;
    phase_id: number;
    name: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    scheduleGeneratedAt: number;
    status: number;
    _all: number;
};
export type GroupAvgAggregateInputType = {
    id?: true;
    phase_id?: true;
};
export type GroupSumAggregateInputType = {
    id?: true;
    phase_id?: true;
};
export type GroupMinAggregateInputType = {
    id?: true;
    phase_id?: true;
    name?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    scheduleGeneratedAt?: true;
    status?: true;
};
export type GroupMaxAggregateInputType = {
    id?: true;
    phase_id?: true;
    name?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    scheduleGeneratedAt?: true;
    status?: true;
};
export type GroupCountAggregateInputType = {
    id?: true;
    phase_id?: true;
    name?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    scheduleGeneratedAt?: true;
    status?: true;
    _all?: true;
};
export type GroupAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Group to aggregate.
     */
    where?: Prisma.GroupWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Groups to fetch.
     */
    orderBy?: Prisma.GroupOrderByWithRelationInput | Prisma.GroupOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.GroupWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Groups from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Groups.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Groups
    **/
    _count?: true | GroupCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: GroupAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: GroupSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: GroupMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: GroupMaxAggregateInputType;
};
export type GetGroupAggregateType<T extends GroupAggregateArgs> = {
    [P in keyof T & keyof AggregateGroup]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateGroup[P]> : Prisma.GetScalarType<T[P], AggregateGroup[P]>;
};
export type GroupGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithAggregationInput | Prisma.GroupOrderByWithAggregationInput[];
    by: Prisma.GroupScalarFieldEnum[] | Prisma.GroupScalarFieldEnum;
    having?: Prisma.GroupScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: GroupCountAggregateInputType | true;
    _avg?: GroupAvgAggregateInputType;
    _sum?: GroupSumAggregateInputType;
    _min?: GroupMinAggregateInputType;
    _max?: GroupMaxAggregateInputType;
};
export type GroupGroupByOutputType = {
    id: number;
    phase_id: number;
    name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    scheduleGeneratedAt: Date | null;
    status: $Enums.GroupStatus;
    _count: GroupCountAggregateOutputType | null;
    _avg: GroupAvgAggregateOutputType | null;
    _sum: GroupSumAggregateOutputType | null;
    _min: GroupMinAggregateOutputType | null;
    _max: GroupMaxAggregateOutputType | null;
};
export type GetGroupGroupByPayload<T extends GroupGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<GroupGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof GroupGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], GroupGroupByOutputType[P]> : Prisma.GetScalarType<T[P], GroupGroupByOutputType[P]>;
}>>;
export type GroupWhereInput = {
    AND?: Prisma.GroupWhereInput | Prisma.GroupWhereInput[];
    OR?: Prisma.GroupWhereInput[];
    NOT?: Prisma.GroupWhereInput | Prisma.GroupWhereInput[];
    id?: Prisma.IntFilter<"Group"> | number;
    phase_id?: Prisma.IntFilter<"Group"> | number;
    name?: Prisma.StringFilter<"Group"> | string;
    is_active?: Prisma.BoolFilter<"Group"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Group"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Group"> | Date | string | null;
    scheduleGeneratedAt?: Prisma.DateTimeNullableFilter<"Group"> | Date | string | null;
    status?: Prisma.EnumGroupStatusFilter<"Group"> | $Enums.GroupStatus;
    phase?: Prisma.XOR<Prisma.PhaseScalarRelationFilter, Prisma.PhaseWhereInput>;
    matches?: Prisma.MatchListRelationFilter;
    season_teams?: Prisma.SeasonTeamListRelationFilter;
    teamStandings?: Prisma.TeamStandingListRelationFilter;
};
export type GroupOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    scheduleGeneratedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    phase?: Prisma.PhaseOrderByWithRelationInput;
    matches?: Prisma.MatchOrderByRelationAggregateInput;
    season_teams?: Prisma.SeasonTeamOrderByRelationAggregateInput;
    teamStandings?: Prisma.TeamStandingOrderByRelationAggregateInput;
    _relevance?: Prisma.GroupOrderByRelevanceInput;
};
export type GroupWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.GroupWhereInput | Prisma.GroupWhereInput[];
    OR?: Prisma.GroupWhereInput[];
    NOT?: Prisma.GroupWhereInput | Prisma.GroupWhereInput[];
    phase_id?: Prisma.IntFilter<"Group"> | number;
    name?: Prisma.StringFilter<"Group"> | string;
    is_active?: Prisma.BoolFilter<"Group"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Group"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Group"> | Date | string | null;
    scheduleGeneratedAt?: Prisma.DateTimeNullableFilter<"Group"> | Date | string | null;
    status?: Prisma.EnumGroupStatusFilter<"Group"> | $Enums.GroupStatus;
    phase?: Prisma.XOR<Prisma.PhaseScalarRelationFilter, Prisma.PhaseWhereInput>;
    matches?: Prisma.MatchListRelationFilter;
    season_teams?: Prisma.SeasonTeamListRelationFilter;
    teamStandings?: Prisma.TeamStandingListRelationFilter;
}, "id">;
export type GroupOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    scheduleGeneratedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    _count?: Prisma.GroupCountOrderByAggregateInput;
    _avg?: Prisma.GroupAvgOrderByAggregateInput;
    _max?: Prisma.GroupMaxOrderByAggregateInput;
    _min?: Prisma.GroupMinOrderByAggregateInput;
    _sum?: Prisma.GroupSumOrderByAggregateInput;
};
export type GroupScalarWhereWithAggregatesInput = {
    AND?: Prisma.GroupScalarWhereWithAggregatesInput | Prisma.GroupScalarWhereWithAggregatesInput[];
    OR?: Prisma.GroupScalarWhereWithAggregatesInput[];
    NOT?: Prisma.GroupScalarWhereWithAggregatesInput | Prisma.GroupScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Group"> | number;
    phase_id?: Prisma.IntWithAggregatesFilter<"Group"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Group"> | string;
    is_active?: Prisma.BoolWithAggregatesFilter<"Group"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Group"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Group"> | Date | string | null;
    scheduleGeneratedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Group"> | Date | string | null;
    status?: Prisma.EnumGroupStatusWithAggregatesFilter<"Group"> | $Enums.GroupStatus;
};
export type GroupCreateInput = {
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    phase: Prisma.PhaseCreateNestedOneWithoutGroupsInput;
    matches?: Prisma.MatchCreateNestedManyWithoutGroupInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutGroupInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutGroupInput;
};
export type GroupUncheckedCreateInput = {
    id?: number;
    phase_id: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutGroupInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutGroupInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutGroupInput;
};
export type GroupUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutGroupsNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutGroupNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutGroupNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutGroupNestedInput;
};
export type GroupUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutGroupNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutGroupNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutGroupNestedInput;
};
export type GroupCreateManyInput = {
    id?: number;
    phase_id: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
};
export type GroupUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
};
export type GroupUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
};
export type GroupListRelationFilter = {
    every?: Prisma.GroupWhereInput;
    some?: Prisma.GroupWhereInput;
    none?: Prisma.GroupWhereInput;
};
export type GroupOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type GroupOrderByRelevanceInput = {
    fields: Prisma.GroupOrderByRelevanceFieldEnum | Prisma.GroupOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type GroupCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    scheduleGeneratedAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type GroupAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
};
export type GroupMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    scheduleGeneratedAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type GroupMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    scheduleGeneratedAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type GroupSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
};
export type GroupNullableScalarRelationFilter = {
    is?: Prisma.GroupWhereInput | null;
    isNot?: Prisma.GroupWhereInput | null;
};
export type GroupScalarRelationFilter = {
    is?: Prisma.GroupWhereInput;
    isNot?: Prisma.GroupWhereInput;
};
export type GroupCreateNestedManyWithoutPhaseInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutPhaseInput, Prisma.GroupUncheckedCreateWithoutPhaseInput> | Prisma.GroupCreateWithoutPhaseInput[] | Prisma.GroupUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutPhaseInput | Prisma.GroupCreateOrConnectWithoutPhaseInput[];
    createMany?: Prisma.GroupCreateManyPhaseInputEnvelope;
    connect?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
};
export type GroupUncheckedCreateNestedManyWithoutPhaseInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutPhaseInput, Prisma.GroupUncheckedCreateWithoutPhaseInput> | Prisma.GroupCreateWithoutPhaseInput[] | Prisma.GroupUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutPhaseInput | Prisma.GroupCreateOrConnectWithoutPhaseInput[];
    createMany?: Prisma.GroupCreateManyPhaseInputEnvelope;
    connect?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
};
export type GroupUpdateManyWithoutPhaseNestedInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutPhaseInput, Prisma.GroupUncheckedCreateWithoutPhaseInput> | Prisma.GroupCreateWithoutPhaseInput[] | Prisma.GroupUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutPhaseInput | Prisma.GroupCreateOrConnectWithoutPhaseInput[];
    upsert?: Prisma.GroupUpsertWithWhereUniqueWithoutPhaseInput | Prisma.GroupUpsertWithWhereUniqueWithoutPhaseInput[];
    createMany?: Prisma.GroupCreateManyPhaseInputEnvelope;
    set?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
    disconnect?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
    delete?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
    connect?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
    update?: Prisma.GroupUpdateWithWhereUniqueWithoutPhaseInput | Prisma.GroupUpdateWithWhereUniqueWithoutPhaseInput[];
    updateMany?: Prisma.GroupUpdateManyWithWhereWithoutPhaseInput | Prisma.GroupUpdateManyWithWhereWithoutPhaseInput[];
    deleteMany?: Prisma.GroupScalarWhereInput | Prisma.GroupScalarWhereInput[];
};
export type GroupUncheckedUpdateManyWithoutPhaseNestedInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutPhaseInput, Prisma.GroupUncheckedCreateWithoutPhaseInput> | Prisma.GroupCreateWithoutPhaseInput[] | Prisma.GroupUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutPhaseInput | Prisma.GroupCreateOrConnectWithoutPhaseInput[];
    upsert?: Prisma.GroupUpsertWithWhereUniqueWithoutPhaseInput | Prisma.GroupUpsertWithWhereUniqueWithoutPhaseInput[];
    createMany?: Prisma.GroupCreateManyPhaseInputEnvelope;
    set?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
    disconnect?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
    delete?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
    connect?: Prisma.GroupWhereUniqueInput | Prisma.GroupWhereUniqueInput[];
    update?: Prisma.GroupUpdateWithWhereUniqueWithoutPhaseInput | Prisma.GroupUpdateWithWhereUniqueWithoutPhaseInput[];
    updateMany?: Prisma.GroupUpdateManyWithWhereWithoutPhaseInput | Prisma.GroupUpdateManyWithWhereWithoutPhaseInput[];
    deleteMany?: Prisma.GroupScalarWhereInput | Prisma.GroupScalarWhereInput[];
};
export type EnumGroupStatusFieldUpdateOperationsInput = {
    set?: $Enums.GroupStatus;
};
export type GroupCreateNestedOneWithoutSeason_teamsInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutSeason_teamsInput, Prisma.GroupUncheckedCreateWithoutSeason_teamsInput>;
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutSeason_teamsInput;
    connect?: Prisma.GroupWhereUniqueInput;
};
export type GroupUpdateOneWithoutSeason_teamsNestedInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutSeason_teamsInput, Prisma.GroupUncheckedCreateWithoutSeason_teamsInput>;
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutSeason_teamsInput;
    upsert?: Prisma.GroupUpsertWithoutSeason_teamsInput;
    disconnect?: Prisma.GroupWhereInput | boolean;
    delete?: Prisma.GroupWhereInput | boolean;
    connect?: Prisma.GroupWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.GroupUpdateToOneWithWhereWithoutSeason_teamsInput, Prisma.GroupUpdateWithoutSeason_teamsInput>, Prisma.GroupUncheckedUpdateWithoutSeason_teamsInput>;
};
export type GroupCreateNestedOneWithoutMatchesInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutMatchesInput, Prisma.GroupUncheckedCreateWithoutMatchesInput>;
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutMatchesInput;
    connect?: Prisma.GroupWhereUniqueInput;
};
export type GroupUpdateOneWithoutMatchesNestedInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutMatchesInput, Prisma.GroupUncheckedCreateWithoutMatchesInput>;
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutMatchesInput;
    upsert?: Prisma.GroupUpsertWithoutMatchesInput;
    disconnect?: Prisma.GroupWhereInput | boolean;
    delete?: Prisma.GroupWhereInput | boolean;
    connect?: Prisma.GroupWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.GroupUpdateToOneWithWhereWithoutMatchesInput, Prisma.GroupUpdateWithoutMatchesInput>, Prisma.GroupUncheckedUpdateWithoutMatchesInput>;
};
export type GroupCreateNestedOneWithoutTeamStandingsInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutTeamStandingsInput, Prisma.GroupUncheckedCreateWithoutTeamStandingsInput>;
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutTeamStandingsInput;
    connect?: Prisma.GroupWhereUniqueInput;
};
export type GroupUpdateOneRequiredWithoutTeamStandingsNestedInput = {
    create?: Prisma.XOR<Prisma.GroupCreateWithoutTeamStandingsInput, Prisma.GroupUncheckedCreateWithoutTeamStandingsInput>;
    connectOrCreate?: Prisma.GroupCreateOrConnectWithoutTeamStandingsInput;
    upsert?: Prisma.GroupUpsertWithoutTeamStandingsInput;
    connect?: Prisma.GroupWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.GroupUpdateToOneWithWhereWithoutTeamStandingsInput, Prisma.GroupUpdateWithoutTeamStandingsInput>, Prisma.GroupUncheckedUpdateWithoutTeamStandingsInput>;
};
export type GroupCreateWithoutPhaseInput = {
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    matches?: Prisma.MatchCreateNestedManyWithoutGroupInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutGroupInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutGroupInput;
};
export type GroupUncheckedCreateWithoutPhaseInput = {
    id?: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutGroupInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutGroupInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutGroupInput;
};
export type GroupCreateOrConnectWithoutPhaseInput = {
    where: Prisma.GroupWhereUniqueInput;
    create: Prisma.XOR<Prisma.GroupCreateWithoutPhaseInput, Prisma.GroupUncheckedCreateWithoutPhaseInput>;
};
export type GroupCreateManyPhaseInputEnvelope = {
    data: Prisma.GroupCreateManyPhaseInput | Prisma.GroupCreateManyPhaseInput[];
    skipDuplicates?: boolean;
};
export type GroupUpsertWithWhereUniqueWithoutPhaseInput = {
    where: Prisma.GroupWhereUniqueInput;
    update: Prisma.XOR<Prisma.GroupUpdateWithoutPhaseInput, Prisma.GroupUncheckedUpdateWithoutPhaseInput>;
    create: Prisma.XOR<Prisma.GroupCreateWithoutPhaseInput, Prisma.GroupUncheckedCreateWithoutPhaseInput>;
};
export type GroupUpdateWithWhereUniqueWithoutPhaseInput = {
    where: Prisma.GroupWhereUniqueInput;
    data: Prisma.XOR<Prisma.GroupUpdateWithoutPhaseInput, Prisma.GroupUncheckedUpdateWithoutPhaseInput>;
};
export type GroupUpdateManyWithWhereWithoutPhaseInput = {
    where: Prisma.GroupScalarWhereInput;
    data: Prisma.XOR<Prisma.GroupUpdateManyMutationInput, Prisma.GroupUncheckedUpdateManyWithoutPhaseInput>;
};
export type GroupScalarWhereInput = {
    AND?: Prisma.GroupScalarWhereInput | Prisma.GroupScalarWhereInput[];
    OR?: Prisma.GroupScalarWhereInput[];
    NOT?: Prisma.GroupScalarWhereInput | Prisma.GroupScalarWhereInput[];
    id?: Prisma.IntFilter<"Group"> | number;
    phase_id?: Prisma.IntFilter<"Group"> | number;
    name?: Prisma.StringFilter<"Group"> | string;
    is_active?: Prisma.BoolFilter<"Group"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Group"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Group"> | Date | string | null;
    scheduleGeneratedAt?: Prisma.DateTimeNullableFilter<"Group"> | Date | string | null;
    status?: Prisma.EnumGroupStatusFilter<"Group"> | $Enums.GroupStatus;
};
export type GroupCreateWithoutSeason_teamsInput = {
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    phase: Prisma.PhaseCreateNestedOneWithoutGroupsInput;
    matches?: Prisma.MatchCreateNestedManyWithoutGroupInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutGroupInput;
};
export type GroupUncheckedCreateWithoutSeason_teamsInput = {
    id?: number;
    phase_id: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutGroupInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutGroupInput;
};
export type GroupCreateOrConnectWithoutSeason_teamsInput = {
    where: Prisma.GroupWhereUniqueInput;
    create: Prisma.XOR<Prisma.GroupCreateWithoutSeason_teamsInput, Prisma.GroupUncheckedCreateWithoutSeason_teamsInput>;
};
export type GroupUpsertWithoutSeason_teamsInput = {
    update: Prisma.XOR<Prisma.GroupUpdateWithoutSeason_teamsInput, Prisma.GroupUncheckedUpdateWithoutSeason_teamsInput>;
    create: Prisma.XOR<Prisma.GroupCreateWithoutSeason_teamsInput, Prisma.GroupUncheckedCreateWithoutSeason_teamsInput>;
    where?: Prisma.GroupWhereInput;
};
export type GroupUpdateToOneWithWhereWithoutSeason_teamsInput = {
    where?: Prisma.GroupWhereInput;
    data: Prisma.XOR<Prisma.GroupUpdateWithoutSeason_teamsInput, Prisma.GroupUncheckedUpdateWithoutSeason_teamsInput>;
};
export type GroupUpdateWithoutSeason_teamsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutGroupsNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutGroupNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutGroupNestedInput;
};
export type GroupUncheckedUpdateWithoutSeason_teamsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutGroupNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutGroupNestedInput;
};
export type GroupCreateWithoutMatchesInput = {
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    phase: Prisma.PhaseCreateNestedOneWithoutGroupsInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutGroupInput;
    teamStandings?: Prisma.TeamStandingCreateNestedManyWithoutGroupInput;
};
export type GroupUncheckedCreateWithoutMatchesInput = {
    id?: number;
    phase_id: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutGroupInput;
    teamStandings?: Prisma.TeamStandingUncheckedCreateNestedManyWithoutGroupInput;
};
export type GroupCreateOrConnectWithoutMatchesInput = {
    where: Prisma.GroupWhereUniqueInput;
    create: Prisma.XOR<Prisma.GroupCreateWithoutMatchesInput, Prisma.GroupUncheckedCreateWithoutMatchesInput>;
};
export type GroupUpsertWithoutMatchesInput = {
    update: Prisma.XOR<Prisma.GroupUpdateWithoutMatchesInput, Prisma.GroupUncheckedUpdateWithoutMatchesInput>;
    create: Prisma.XOR<Prisma.GroupCreateWithoutMatchesInput, Prisma.GroupUncheckedCreateWithoutMatchesInput>;
    where?: Prisma.GroupWhereInput;
};
export type GroupUpdateToOneWithWhereWithoutMatchesInput = {
    where?: Prisma.GroupWhereInput;
    data: Prisma.XOR<Prisma.GroupUpdateWithoutMatchesInput, Prisma.GroupUncheckedUpdateWithoutMatchesInput>;
};
export type GroupUpdateWithoutMatchesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutGroupsNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutGroupNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutGroupNestedInput;
};
export type GroupUncheckedUpdateWithoutMatchesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutGroupNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutGroupNestedInput;
};
export type GroupCreateWithoutTeamStandingsInput = {
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    phase: Prisma.PhaseCreateNestedOneWithoutGroupsInput;
    matches?: Prisma.MatchCreateNestedManyWithoutGroupInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutGroupInput;
};
export type GroupUncheckedCreateWithoutTeamStandingsInput = {
    id?: number;
    phase_id: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutGroupInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutGroupInput;
};
export type GroupCreateOrConnectWithoutTeamStandingsInput = {
    where: Prisma.GroupWhereUniqueInput;
    create: Prisma.XOR<Prisma.GroupCreateWithoutTeamStandingsInput, Prisma.GroupUncheckedCreateWithoutTeamStandingsInput>;
};
export type GroupUpsertWithoutTeamStandingsInput = {
    update: Prisma.XOR<Prisma.GroupUpdateWithoutTeamStandingsInput, Prisma.GroupUncheckedUpdateWithoutTeamStandingsInput>;
    create: Prisma.XOR<Prisma.GroupCreateWithoutTeamStandingsInput, Prisma.GroupUncheckedCreateWithoutTeamStandingsInput>;
    where?: Prisma.GroupWhereInput;
};
export type GroupUpdateToOneWithWhereWithoutTeamStandingsInput = {
    where?: Prisma.GroupWhereInput;
    data: Prisma.XOR<Prisma.GroupUpdateWithoutTeamStandingsInput, Prisma.GroupUncheckedUpdateWithoutTeamStandingsInput>;
};
export type GroupUpdateWithoutTeamStandingsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutGroupsNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutGroupNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutGroupNestedInput;
};
export type GroupUncheckedUpdateWithoutTeamStandingsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutGroupNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutGroupNestedInput;
};
export type GroupCreateManyPhaseInput = {
    id?: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    scheduleGeneratedAt?: Date | string | null;
    status?: $Enums.GroupStatus;
};
export type GroupUpdateWithoutPhaseInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    matches?: Prisma.MatchUpdateManyWithoutGroupNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutGroupNestedInput;
    teamStandings?: Prisma.TeamStandingUpdateManyWithoutGroupNestedInput;
};
export type GroupUncheckedUpdateWithoutPhaseInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutGroupNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutGroupNestedInput;
    teamStandings?: Prisma.TeamStandingUncheckedUpdateManyWithoutGroupNestedInput;
};
export type GroupUncheckedUpdateManyWithoutPhaseInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scheduleGeneratedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumGroupStatusFieldUpdateOperationsInput | $Enums.GroupStatus;
};
/**
 * Count Type GroupCountOutputType
 */
export type GroupCountOutputType = {
    matches: number;
    season_teams: number;
    teamStandings: number;
};
export type GroupCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    matches?: boolean | GroupCountOutputTypeCountMatchesArgs;
    season_teams?: boolean | GroupCountOutputTypeCountSeason_teamsArgs;
    teamStandings?: boolean | GroupCountOutputTypeCountTeamStandingsArgs;
};
/**
 * GroupCountOutputType without action
 */
export type GroupCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupCountOutputType
     */
    select?: Prisma.GroupCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * GroupCountOutputType without action
 */
export type GroupCountOutputTypeCountMatchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
};
/**
 * GroupCountOutputType without action
 */
export type GroupCountOutputTypeCountSeason_teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonTeamWhereInput;
};
/**
 * GroupCountOutputType without action
 */
export type GroupCountOutputTypeCountTeamStandingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamStandingWhereInput;
};
export type GroupSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    phase_id?: boolean;
    name?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    scheduleGeneratedAt?: boolean;
    status?: boolean;
    phase?: boolean | Prisma.PhaseDefaultArgs<ExtArgs>;
    matches?: boolean | Prisma.Group$matchesArgs<ExtArgs>;
    season_teams?: boolean | Prisma.Group$season_teamsArgs<ExtArgs>;
    teamStandings?: boolean | Prisma.Group$teamStandingsArgs<ExtArgs>;
    _count?: boolean | Prisma.GroupCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["group"]>;
export type GroupSelectScalar = {
    id?: boolean;
    phase_id?: boolean;
    name?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    scheduleGeneratedAt?: boolean;
    status?: boolean;
};
export type GroupOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "phase_id" | "name" | "is_active" | "created_at" | "updated_at" | "scheduleGeneratedAt" | "status", ExtArgs["result"]["group"]>;
export type GroupInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    phase?: boolean | Prisma.PhaseDefaultArgs<ExtArgs>;
    matches?: boolean | Prisma.Group$matchesArgs<ExtArgs>;
    season_teams?: boolean | Prisma.Group$season_teamsArgs<ExtArgs>;
    teamStandings?: boolean | Prisma.Group$teamStandingsArgs<ExtArgs>;
    _count?: boolean | Prisma.GroupCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $GroupPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Group";
    objects: {
        phase: Prisma.$PhasePayload<ExtArgs>;
        matches: Prisma.$MatchPayload<ExtArgs>[];
        season_teams: Prisma.$SeasonTeamPayload<ExtArgs>[];
        teamStandings: Prisma.$TeamStandingPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        phase_id: number;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        scheduleGeneratedAt: Date | null;
        status: $Enums.GroupStatus;
    }, ExtArgs["result"]["group"]>;
    composites: {};
};
export type GroupGetPayload<S extends boolean | null | undefined | GroupDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$GroupPayload, S>;
export type GroupCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<GroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: GroupCountAggregateInputType | true;
};
export interface GroupDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Group'];
        meta: {
            name: 'Group';
        };
    };
    /**
     * Find zero or one Group that matches the filter.
     * @param {GroupFindUniqueArgs} args - Arguments to find a Group
     * @example
     * // Get one Group
     * const group = await prisma.group.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroupFindUniqueArgs>(args: Prisma.SelectSubset<T, GroupFindUniqueArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Group that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroupFindUniqueOrThrowArgs} args - Arguments to find a Group
     * @example
     * // Get one Group
     * const group = await prisma.group.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroupFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, GroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Group that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupFindFirstArgs} args - Arguments to find a Group
     * @example
     * // Get one Group
     * const group = await prisma.group.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroupFindFirstArgs>(args?: Prisma.SelectSubset<T, GroupFindFirstArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Group that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupFindFirstOrThrowArgs} args - Arguments to find a Group
     * @example
     * // Get one Group
     * const group = await prisma.group.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroupFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, GroupFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Groups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Groups
     * const groups = await prisma.group.findMany()
     *
     * // Get first 10 Groups
     * const groups = await prisma.group.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const groupWithIdOnly = await prisma.group.findMany({ select: { id: true } })
     *
     */
    findMany<T extends GroupFindManyArgs>(args?: Prisma.SelectSubset<T, GroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Group.
     * @param {GroupCreateArgs} args - Arguments to create a Group.
     * @example
     * // Create one Group
     * const Group = await prisma.group.create({
     *   data: {
     *     // ... data to create a Group
     *   }
     * })
     *
     */
    create<T extends GroupCreateArgs>(args: Prisma.SelectSubset<T, GroupCreateArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Groups.
     * @param {GroupCreateManyArgs} args - Arguments to create many Groups.
     * @example
     * // Create many Groups
     * const group = await prisma.group.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends GroupCreateManyArgs>(args?: Prisma.SelectSubset<T, GroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Group.
     * @param {GroupDeleteArgs} args - Arguments to delete one Group.
     * @example
     * // Delete one Group
     * const Group = await prisma.group.delete({
     *   where: {
     *     // ... filter to delete one Group
     *   }
     * })
     *
     */
    delete<T extends GroupDeleteArgs>(args: Prisma.SelectSubset<T, GroupDeleteArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Group.
     * @param {GroupUpdateArgs} args - Arguments to update one Group.
     * @example
     * // Update one Group
     * const group = await prisma.group.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends GroupUpdateArgs>(args: Prisma.SelectSubset<T, GroupUpdateArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Groups.
     * @param {GroupDeleteManyArgs} args - Arguments to filter Groups to delete.
     * @example
     * // Delete a few Groups
     * const { count } = await prisma.group.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends GroupDeleteManyArgs>(args?: Prisma.SelectSubset<T, GroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Groups
     * const group = await prisma.group.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends GroupUpdateManyArgs>(args: Prisma.SelectSubset<T, GroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Group.
     * @param {GroupUpsertArgs} args - Arguments to update or create a Group.
     * @example
     * // Update or create a Group
     * const group = await prisma.group.upsert({
     *   create: {
     *     // ... data to create a Group
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Group we want to update
     *   }
     * })
     */
    upsert<T extends GroupUpsertArgs>(args: Prisma.SelectSubset<T, GroupUpsertArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupCountArgs} args - Arguments to filter Groups to count.
     * @example
     * // Count the number of Groups
     * const count = await prisma.group.count({
     *   where: {
     *     // ... the filter for the Groups we want to count
     *   }
     * })
    **/
    count<T extends GroupCountArgs>(args?: Prisma.Subset<T, GroupCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], GroupCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Group.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroupAggregateArgs>(args: Prisma.Subset<T, GroupAggregateArgs>): Prisma.PrismaPromise<GetGroupAggregateType<T>>;
    /**
     * Group by Group.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupGroupByArgs} args - Group by arguments.
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
    groupBy<T extends GroupGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: GroupGroupByArgs['orderBy'];
    } : {
        orderBy?: GroupGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, GroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Group model
     */
    readonly fields: GroupFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Group.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__GroupClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    phase<T extends Prisma.PhaseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PhaseDefaultArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    matches<T extends Prisma.Group$matchesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Group$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    season_teams<T extends Prisma.Group$season_teamsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Group$season_teamsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    teamStandings<T extends Prisma.Group$teamStandingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Group$teamStandingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamStandingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Group model
 */
export interface GroupFieldRefs {
    readonly id: Prisma.FieldRef<"Group", 'Int'>;
    readonly phase_id: Prisma.FieldRef<"Group", 'Int'>;
    readonly name: Prisma.FieldRef<"Group", 'String'>;
    readonly is_active: Prisma.FieldRef<"Group", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Group", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Group", 'DateTime'>;
    readonly scheduleGeneratedAt: Prisma.FieldRef<"Group", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Group", 'GroupStatus'>;
}
/**
 * Group findUnique
 */
export type GroupFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
    /**
     * Filter, which Group to fetch.
     */
    where: Prisma.GroupWhereUniqueInput;
};
/**
 * Group findUniqueOrThrow
 */
export type GroupFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
    /**
     * Filter, which Group to fetch.
     */
    where: Prisma.GroupWhereUniqueInput;
};
/**
 * Group findFirst
 */
export type GroupFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
    /**
     * Filter, which Group to fetch.
     */
    where?: Prisma.GroupWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Groups to fetch.
     */
    orderBy?: Prisma.GroupOrderByWithRelationInput | Prisma.GroupOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Groups.
     */
    cursor?: Prisma.GroupWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Groups from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Groups.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Groups.
     */
    distinct?: Prisma.GroupScalarFieldEnum | Prisma.GroupScalarFieldEnum[];
};
/**
 * Group findFirstOrThrow
 */
export type GroupFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
    /**
     * Filter, which Group to fetch.
     */
    where?: Prisma.GroupWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Groups to fetch.
     */
    orderBy?: Prisma.GroupOrderByWithRelationInput | Prisma.GroupOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Groups.
     */
    cursor?: Prisma.GroupWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Groups from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Groups.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Groups.
     */
    distinct?: Prisma.GroupScalarFieldEnum | Prisma.GroupScalarFieldEnum[];
};
/**
 * Group findMany
 */
export type GroupFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
    /**
     * Filter, which Groups to fetch.
     */
    where?: Prisma.GroupWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Groups to fetch.
     */
    orderBy?: Prisma.GroupOrderByWithRelationInput | Prisma.GroupOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Groups.
     */
    cursor?: Prisma.GroupWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Groups from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Groups.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Groups.
     */
    distinct?: Prisma.GroupScalarFieldEnum | Prisma.GroupScalarFieldEnum[];
};
/**
 * Group create
 */
export type GroupCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
    /**
     * The data needed to create a Group.
     */
    data: Prisma.XOR<Prisma.GroupCreateInput, Prisma.GroupUncheckedCreateInput>;
};
/**
 * Group createMany
 */
export type GroupCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Groups.
     */
    data: Prisma.GroupCreateManyInput | Prisma.GroupCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Group update
 */
export type GroupUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
    /**
     * The data needed to update a Group.
     */
    data: Prisma.XOR<Prisma.GroupUpdateInput, Prisma.GroupUncheckedUpdateInput>;
    /**
     * Choose, which Group to update.
     */
    where: Prisma.GroupWhereUniqueInput;
};
/**
 * Group updateMany
 */
export type GroupUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Groups.
     */
    data: Prisma.XOR<Prisma.GroupUpdateManyMutationInput, Prisma.GroupUncheckedUpdateManyInput>;
    /**
     * Filter which Groups to update
     */
    where?: Prisma.GroupWhereInput;
    /**
     * Limit how many Groups to update.
     */
    limit?: number;
};
/**
 * Group upsert
 */
export type GroupUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
    /**
     * The filter to search for the Group to update in case it exists.
     */
    where: Prisma.GroupWhereUniqueInput;
    /**
     * In case the Group found by the `where` argument doesn't exist, create a new Group with this data.
     */
    create: Prisma.XOR<Prisma.GroupCreateInput, Prisma.GroupUncheckedCreateInput>;
    /**
     * In case the Group was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.GroupUpdateInput, Prisma.GroupUncheckedUpdateInput>;
};
/**
 * Group delete
 */
export type GroupDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
    /**
     * Filter which Group to delete.
     */
    where: Prisma.GroupWhereUniqueInput;
};
/**
 * Group deleteMany
 */
export type GroupDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Groups to delete
     */
    where?: Prisma.GroupWhereInput;
    /**
     * Limit how many Groups to delete.
     */
    limit?: number;
};
/**
 * Group.matches
 */
export type Group$matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Group.season_teams
 */
export type Group$season_teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Group.teamStandings
 */
export type Group$teamStandingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Group without action
 */
export type GroupDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: Prisma.GroupSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Group
     */
    omit?: Prisma.GroupOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GroupInclude<ExtArgs> | null;
};
//# sourceMappingURL=Group.d.ts.map