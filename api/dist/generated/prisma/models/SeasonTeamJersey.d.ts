import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model SeasonTeamJersey
 *
 */
export type SeasonTeamJerseyModel = runtime.Types.Result.DefaultSelection<Prisma.$SeasonTeamJerseyPayload>;
export type AggregateSeasonTeamJersey = {
    _count: SeasonTeamJerseyCountAggregateOutputType | null;
    _avg: SeasonTeamJerseyAvgAggregateOutputType | null;
    _sum: SeasonTeamJerseySumAggregateOutputType | null;
    _min: SeasonTeamJerseyMinAggregateOutputType | null;
    _max: SeasonTeamJerseyMaxAggregateOutputType | null;
};
export type SeasonTeamJerseyAvgAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
};
export type SeasonTeamJerseySumAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
};
export type SeasonTeamJerseyMinAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    type: $Enums.JerseyType | null;
    primary_color: string | null;
    secondary_color: string | null;
    image_url: string | null;
};
export type SeasonTeamJerseyMaxAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    type: $Enums.JerseyType | null;
    primary_color: string | null;
    secondary_color: string | null;
    image_url: string | null;
};
export type SeasonTeamJerseyCountAggregateOutputType = {
    id: number;
    season_team_id: number;
    type: number;
    primary_color: number;
    secondary_color: number;
    image_url: number;
    _all: number;
};
export type SeasonTeamJerseyAvgAggregateInputType = {
    id?: true;
    season_team_id?: true;
};
export type SeasonTeamJerseySumAggregateInputType = {
    id?: true;
    season_team_id?: true;
};
export type SeasonTeamJerseyMinAggregateInputType = {
    id?: true;
    season_team_id?: true;
    type?: true;
    primary_color?: true;
    secondary_color?: true;
    image_url?: true;
};
export type SeasonTeamJerseyMaxAggregateInputType = {
    id?: true;
    season_team_id?: true;
    type?: true;
    primary_color?: true;
    secondary_color?: true;
    image_url?: true;
};
export type SeasonTeamJerseyCountAggregateInputType = {
    id?: true;
    season_team_id?: true;
    type?: true;
    primary_color?: true;
    secondary_color?: true;
    image_url?: true;
    _all?: true;
};
export type SeasonTeamJerseyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonTeamJersey to aggregate.
     */
    where?: Prisma.SeasonTeamJerseyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeamJerseys to fetch.
     */
    orderBy?: Prisma.SeasonTeamJerseyOrderByWithRelationInput | Prisma.SeasonTeamJerseyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.SeasonTeamJerseyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeamJerseys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeamJerseys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SeasonTeamJerseys
    **/
    _count?: true | SeasonTeamJerseyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: SeasonTeamJerseyAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: SeasonTeamJerseySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SeasonTeamJerseyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SeasonTeamJerseyMaxAggregateInputType;
};
export type GetSeasonTeamJerseyAggregateType<T extends SeasonTeamJerseyAggregateArgs> = {
    [P in keyof T & keyof AggregateSeasonTeamJersey]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSeasonTeamJersey[P]> : Prisma.GetScalarType<T[P], AggregateSeasonTeamJersey[P]>;
};
export type SeasonTeamJerseyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonTeamJerseyWhereInput;
    orderBy?: Prisma.SeasonTeamJerseyOrderByWithAggregationInput | Prisma.SeasonTeamJerseyOrderByWithAggregationInput[];
    by: Prisma.SeasonTeamJerseyScalarFieldEnum[] | Prisma.SeasonTeamJerseyScalarFieldEnum;
    having?: Prisma.SeasonTeamJerseyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SeasonTeamJerseyCountAggregateInputType | true;
    _avg?: SeasonTeamJerseyAvgAggregateInputType;
    _sum?: SeasonTeamJerseySumAggregateInputType;
    _min?: SeasonTeamJerseyMinAggregateInputType;
    _max?: SeasonTeamJerseyMaxAggregateInputType;
};
export type SeasonTeamJerseyGroupByOutputType = {
    id: number;
    season_team_id: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color: string | null;
    image_url: string | null;
    _count: SeasonTeamJerseyCountAggregateOutputType | null;
    _avg: SeasonTeamJerseyAvgAggregateOutputType | null;
    _sum: SeasonTeamJerseySumAggregateOutputType | null;
    _min: SeasonTeamJerseyMinAggregateOutputType | null;
    _max: SeasonTeamJerseyMaxAggregateOutputType | null;
};
export type GetSeasonTeamJerseyGroupByPayload<T extends SeasonTeamJerseyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SeasonTeamJerseyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SeasonTeamJerseyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SeasonTeamJerseyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SeasonTeamJerseyGroupByOutputType[P]>;
}>>;
export type SeasonTeamJerseyWhereInput = {
    AND?: Prisma.SeasonTeamJerseyWhereInput | Prisma.SeasonTeamJerseyWhereInput[];
    OR?: Prisma.SeasonTeamJerseyWhereInput[];
    NOT?: Prisma.SeasonTeamJerseyWhereInput | Prisma.SeasonTeamJerseyWhereInput[];
    id?: Prisma.IntFilter<"SeasonTeamJersey"> | number;
    season_team_id?: Prisma.IntFilter<"SeasonTeamJersey"> | number;
    type?: Prisma.EnumJerseyTypeFilter<"SeasonTeamJersey"> | $Enums.JerseyType;
    primary_color?: Prisma.StringFilter<"SeasonTeamJersey"> | string;
    secondary_color?: Prisma.StringNullableFilter<"SeasonTeamJersey"> | string | null;
    image_url?: Prisma.StringNullableFilter<"SeasonTeamJersey"> | string | null;
    season_team?: Prisma.XOR<Prisma.SeasonTeamScalarRelationFilter, Prisma.SeasonTeamWhereInput>;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentListRelationFilter;
};
export type SeasonTeamJerseyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrderInput | Prisma.SortOrder;
    image_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    season_team?: Prisma.SeasonTeamOrderByWithRelationInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentOrderByRelationAggregateInput;
    _relevance?: Prisma.SeasonTeamJerseyOrderByRelevanceInput;
};
export type SeasonTeamJerseyWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    season_team_id_type?: Prisma.SeasonTeamJerseySeason_team_idTypeCompoundUniqueInput;
    AND?: Prisma.SeasonTeamJerseyWhereInput | Prisma.SeasonTeamJerseyWhereInput[];
    OR?: Prisma.SeasonTeamJerseyWhereInput[];
    NOT?: Prisma.SeasonTeamJerseyWhereInput | Prisma.SeasonTeamJerseyWhereInput[];
    season_team_id?: Prisma.IntFilter<"SeasonTeamJersey"> | number;
    type?: Prisma.EnumJerseyTypeFilter<"SeasonTeamJersey"> | $Enums.JerseyType;
    primary_color?: Prisma.StringFilter<"SeasonTeamJersey"> | string;
    secondary_color?: Prisma.StringNullableFilter<"SeasonTeamJersey"> | string | null;
    image_url?: Prisma.StringNullableFilter<"SeasonTeamJersey"> | string | null;
    season_team?: Prisma.XOR<Prisma.SeasonTeamScalarRelationFilter, Prisma.SeasonTeamWhereInput>;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentListRelationFilter;
}, "id" | "season_team_id_type">;
export type SeasonTeamJerseyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrderInput | Prisma.SortOrder;
    image_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.SeasonTeamJerseyCountOrderByAggregateInput;
    _avg?: Prisma.SeasonTeamJerseyAvgOrderByAggregateInput;
    _max?: Prisma.SeasonTeamJerseyMaxOrderByAggregateInput;
    _min?: Prisma.SeasonTeamJerseyMinOrderByAggregateInput;
    _sum?: Prisma.SeasonTeamJerseySumOrderByAggregateInput;
};
export type SeasonTeamJerseyScalarWhereWithAggregatesInput = {
    AND?: Prisma.SeasonTeamJerseyScalarWhereWithAggregatesInput | Prisma.SeasonTeamJerseyScalarWhereWithAggregatesInput[];
    OR?: Prisma.SeasonTeamJerseyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SeasonTeamJerseyScalarWhereWithAggregatesInput | Prisma.SeasonTeamJerseyScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"SeasonTeamJersey"> | number;
    season_team_id?: Prisma.IntWithAggregatesFilter<"SeasonTeamJersey"> | number;
    type?: Prisma.EnumJerseyTypeWithAggregatesFilter<"SeasonTeamJersey"> | $Enums.JerseyType;
    primary_color?: Prisma.StringWithAggregatesFilter<"SeasonTeamJersey"> | string;
    secondary_color?: Prisma.StringNullableWithAggregatesFilter<"SeasonTeamJersey"> | string | null;
    image_url?: Prisma.StringNullableWithAggregatesFilter<"SeasonTeamJersey"> | string | null;
};
export type SeasonTeamJerseyCreateInput = {
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
    image_url?: string | null;
    season_team: Prisma.SeasonTeamCreateNestedOneWithoutJerseysInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutSeason_jerseyInput;
};
export type SeasonTeamJerseyUncheckedCreateInput = {
    id?: number;
    season_team_id: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
    image_url?: string | null;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutSeason_jerseyInput;
};
export type SeasonTeamJerseyUpdateInput = {
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_team?: Prisma.SeasonTeamUpdateOneRequiredWithoutJerseysNestedInput;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutSeason_jerseyNestedInput;
};
export type SeasonTeamJerseyUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutSeason_jerseyNestedInput;
};
export type SeasonTeamJerseyCreateManyInput = {
    id?: number;
    season_team_id: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
    image_url?: string | null;
};
export type SeasonTeamJerseyUpdateManyMutationInput = {
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type SeasonTeamJerseyUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type SeasonTeamJerseyScalarRelationFilter = {
    is?: Prisma.SeasonTeamJerseyWhereInput;
    isNot?: Prisma.SeasonTeamJerseyWhereInput;
};
export type SeasonTeamJerseyListRelationFilter = {
    every?: Prisma.SeasonTeamJerseyWhereInput;
    some?: Prisma.SeasonTeamJerseyWhereInput;
    none?: Prisma.SeasonTeamJerseyWhereInput;
};
export type SeasonTeamJerseyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SeasonTeamJerseyOrderByRelevanceInput = {
    fields: Prisma.SeasonTeamJerseyOrderByRelevanceFieldEnum | Prisma.SeasonTeamJerseyOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type SeasonTeamJerseySeason_team_idTypeCompoundUniqueInput = {
    season_team_id: number;
    type: $Enums.JerseyType;
};
export type SeasonTeamJerseyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrder;
    image_url?: Prisma.SortOrder;
};
export type SeasonTeamJerseyAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
};
export type SeasonTeamJerseyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrder;
    image_url?: Prisma.SortOrder;
};
export type SeasonTeamJerseyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrder;
    image_url?: Prisma.SortOrder;
};
export type SeasonTeamJerseySumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
};
export type SeasonTeamJerseyCreateNestedOneWithoutMatchJerseyAssignmentsInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutMatchJerseyAssignmentsInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutMatchJerseyAssignmentsInput>;
    connectOrCreate?: Prisma.SeasonTeamJerseyCreateOrConnectWithoutMatchJerseyAssignmentsInput;
    connect?: Prisma.SeasonTeamJerseyWhereUniqueInput;
};
export type SeasonTeamJerseyUpdateOneRequiredWithoutMatchJerseyAssignmentsNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutMatchJerseyAssignmentsInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutMatchJerseyAssignmentsInput>;
    connectOrCreate?: Prisma.SeasonTeamJerseyCreateOrConnectWithoutMatchJerseyAssignmentsInput;
    upsert?: Prisma.SeasonTeamJerseyUpsertWithoutMatchJerseyAssignmentsInput;
    connect?: Prisma.SeasonTeamJerseyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SeasonTeamJerseyUpdateToOneWithWhereWithoutMatchJerseyAssignmentsInput, Prisma.SeasonTeamJerseyUpdateWithoutMatchJerseyAssignmentsInput>, Prisma.SeasonTeamJerseyUncheckedUpdateWithoutMatchJerseyAssignmentsInput>;
};
export type SeasonTeamJerseyCreateNestedManyWithoutSeason_teamInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput> | Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput[] | Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.SeasonTeamJerseyCreateOrConnectWithoutSeason_teamInput | Prisma.SeasonTeamJerseyCreateOrConnectWithoutSeason_teamInput[];
    createMany?: Prisma.SeasonTeamJerseyCreateManySeason_teamInputEnvelope;
    connect?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
};
export type SeasonTeamJerseyUncheckedCreateNestedManyWithoutSeason_teamInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput> | Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput[] | Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.SeasonTeamJerseyCreateOrConnectWithoutSeason_teamInput | Prisma.SeasonTeamJerseyCreateOrConnectWithoutSeason_teamInput[];
    createMany?: Prisma.SeasonTeamJerseyCreateManySeason_teamInputEnvelope;
    connect?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
};
export type SeasonTeamJerseyUpdateManyWithoutSeason_teamNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput> | Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput[] | Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.SeasonTeamJerseyCreateOrConnectWithoutSeason_teamInput | Prisma.SeasonTeamJerseyCreateOrConnectWithoutSeason_teamInput[];
    upsert?: Prisma.SeasonTeamJerseyUpsertWithWhereUniqueWithoutSeason_teamInput | Prisma.SeasonTeamJerseyUpsertWithWhereUniqueWithoutSeason_teamInput[];
    createMany?: Prisma.SeasonTeamJerseyCreateManySeason_teamInputEnvelope;
    set?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
    delete?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
    connect?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
    update?: Prisma.SeasonTeamJerseyUpdateWithWhereUniqueWithoutSeason_teamInput | Prisma.SeasonTeamJerseyUpdateWithWhereUniqueWithoutSeason_teamInput[];
    updateMany?: Prisma.SeasonTeamJerseyUpdateManyWithWhereWithoutSeason_teamInput | Prisma.SeasonTeamJerseyUpdateManyWithWhereWithoutSeason_teamInput[];
    deleteMany?: Prisma.SeasonTeamJerseyScalarWhereInput | Prisma.SeasonTeamJerseyScalarWhereInput[];
};
export type SeasonTeamJerseyUncheckedUpdateManyWithoutSeason_teamNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput> | Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput[] | Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.SeasonTeamJerseyCreateOrConnectWithoutSeason_teamInput | Prisma.SeasonTeamJerseyCreateOrConnectWithoutSeason_teamInput[];
    upsert?: Prisma.SeasonTeamJerseyUpsertWithWhereUniqueWithoutSeason_teamInput | Prisma.SeasonTeamJerseyUpsertWithWhereUniqueWithoutSeason_teamInput[];
    createMany?: Prisma.SeasonTeamJerseyCreateManySeason_teamInputEnvelope;
    set?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
    delete?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
    connect?: Prisma.SeasonTeamJerseyWhereUniqueInput | Prisma.SeasonTeamJerseyWhereUniqueInput[];
    update?: Prisma.SeasonTeamJerseyUpdateWithWhereUniqueWithoutSeason_teamInput | Prisma.SeasonTeamJerseyUpdateWithWhereUniqueWithoutSeason_teamInput[];
    updateMany?: Prisma.SeasonTeamJerseyUpdateManyWithWhereWithoutSeason_teamInput | Prisma.SeasonTeamJerseyUpdateManyWithWhereWithoutSeason_teamInput[];
    deleteMany?: Prisma.SeasonTeamJerseyScalarWhereInput | Prisma.SeasonTeamJerseyScalarWhereInput[];
};
export type EnumJerseyTypeFieldUpdateOperationsInput = {
    set?: $Enums.JerseyType;
};
export type SeasonTeamJerseyCreateWithoutMatchJerseyAssignmentsInput = {
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
    image_url?: string | null;
    season_team: Prisma.SeasonTeamCreateNestedOneWithoutJerseysInput;
};
export type SeasonTeamJerseyUncheckedCreateWithoutMatchJerseyAssignmentsInput = {
    id?: number;
    season_team_id: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
    image_url?: string | null;
};
export type SeasonTeamJerseyCreateOrConnectWithoutMatchJerseyAssignmentsInput = {
    where: Prisma.SeasonTeamJerseyWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutMatchJerseyAssignmentsInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutMatchJerseyAssignmentsInput>;
};
export type SeasonTeamJerseyUpsertWithoutMatchJerseyAssignmentsInput = {
    update: Prisma.XOR<Prisma.SeasonTeamJerseyUpdateWithoutMatchJerseyAssignmentsInput, Prisma.SeasonTeamJerseyUncheckedUpdateWithoutMatchJerseyAssignmentsInput>;
    create: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutMatchJerseyAssignmentsInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutMatchJerseyAssignmentsInput>;
    where?: Prisma.SeasonTeamJerseyWhereInput;
};
export type SeasonTeamJerseyUpdateToOneWithWhereWithoutMatchJerseyAssignmentsInput = {
    where?: Prisma.SeasonTeamJerseyWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamJerseyUpdateWithoutMatchJerseyAssignmentsInput, Prisma.SeasonTeamJerseyUncheckedUpdateWithoutMatchJerseyAssignmentsInput>;
};
export type SeasonTeamJerseyUpdateWithoutMatchJerseyAssignmentsInput = {
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_team?: Prisma.SeasonTeamUpdateOneRequiredWithoutJerseysNestedInput;
};
export type SeasonTeamJerseyUncheckedUpdateWithoutMatchJerseyAssignmentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type SeasonTeamJerseyCreateWithoutSeason_teamInput = {
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
    image_url?: string | null;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentCreateNestedManyWithoutSeason_jerseyInput;
};
export type SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput = {
    id?: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
    image_url?: string | null;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedCreateNestedManyWithoutSeason_jerseyInput;
};
export type SeasonTeamJerseyCreateOrConnectWithoutSeason_teamInput = {
    where: Prisma.SeasonTeamJerseyWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput>;
};
export type SeasonTeamJerseyCreateManySeason_teamInputEnvelope = {
    data: Prisma.SeasonTeamJerseyCreateManySeason_teamInput | Prisma.SeasonTeamJerseyCreateManySeason_teamInput[];
    skipDuplicates?: boolean;
};
export type SeasonTeamJerseyUpsertWithWhereUniqueWithoutSeason_teamInput = {
    where: Prisma.SeasonTeamJerseyWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonTeamJerseyUpdateWithoutSeason_teamInput, Prisma.SeasonTeamJerseyUncheckedUpdateWithoutSeason_teamInput>;
    create: Prisma.XOR<Prisma.SeasonTeamJerseyCreateWithoutSeason_teamInput, Prisma.SeasonTeamJerseyUncheckedCreateWithoutSeason_teamInput>;
};
export type SeasonTeamJerseyUpdateWithWhereUniqueWithoutSeason_teamInput = {
    where: Prisma.SeasonTeamJerseyWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonTeamJerseyUpdateWithoutSeason_teamInput, Prisma.SeasonTeamJerseyUncheckedUpdateWithoutSeason_teamInput>;
};
export type SeasonTeamJerseyUpdateManyWithWhereWithoutSeason_teamInput = {
    where: Prisma.SeasonTeamJerseyScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamJerseyUpdateManyMutationInput, Prisma.SeasonTeamJerseyUncheckedUpdateManyWithoutSeason_teamInput>;
};
export type SeasonTeamJerseyScalarWhereInput = {
    AND?: Prisma.SeasonTeamJerseyScalarWhereInput | Prisma.SeasonTeamJerseyScalarWhereInput[];
    OR?: Prisma.SeasonTeamJerseyScalarWhereInput[];
    NOT?: Prisma.SeasonTeamJerseyScalarWhereInput | Prisma.SeasonTeamJerseyScalarWhereInput[];
    id?: Prisma.IntFilter<"SeasonTeamJersey"> | number;
    season_team_id?: Prisma.IntFilter<"SeasonTeamJersey"> | number;
    type?: Prisma.EnumJerseyTypeFilter<"SeasonTeamJersey"> | $Enums.JerseyType;
    primary_color?: Prisma.StringFilter<"SeasonTeamJersey"> | string;
    secondary_color?: Prisma.StringNullableFilter<"SeasonTeamJersey"> | string | null;
    image_url?: Prisma.StringNullableFilter<"SeasonTeamJersey"> | string | null;
};
export type SeasonTeamJerseyCreateManySeason_teamInput = {
    id?: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
    image_url?: string | null;
};
export type SeasonTeamJerseyUpdateWithoutSeason_teamInput = {
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUpdateManyWithoutSeason_jerseyNestedInput;
};
export type SeasonTeamJerseyUncheckedUpdateWithoutSeason_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchJerseyAssignments?: Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutSeason_jerseyNestedInput;
};
export type SeasonTeamJerseyUncheckedUpdateManyWithoutSeason_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
/**
 * Count Type SeasonTeamJerseyCountOutputType
 */
export type SeasonTeamJerseyCountOutputType = {
    matchJerseyAssignments: number;
};
export type SeasonTeamJerseyCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    matchJerseyAssignments?: boolean | SeasonTeamJerseyCountOutputTypeCountMatchJerseyAssignmentsArgs;
};
/**
 * SeasonTeamJerseyCountOutputType without action
 */
export type SeasonTeamJerseyCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJerseyCountOutputType
     */
    select?: Prisma.SeasonTeamJerseyCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * SeasonTeamJerseyCountOutputType without action
 */
export type SeasonTeamJerseyCountOutputTypeCountMatchJerseyAssignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchJerseyAssignmentWhereInput;
};
export type SeasonTeamJerseySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    season_team_id?: boolean;
    type?: boolean;
    primary_color?: boolean;
    secondary_color?: boolean;
    image_url?: boolean;
    season_team?: boolean | Prisma.SeasonTeamDefaultArgs<ExtArgs>;
    matchJerseyAssignments?: boolean | Prisma.SeasonTeamJersey$matchJerseyAssignmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.SeasonTeamJerseyCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["seasonTeamJersey"]>;
export type SeasonTeamJerseySelectScalar = {
    id?: boolean;
    season_team_id?: boolean;
    type?: boolean;
    primary_color?: boolean;
    secondary_color?: boolean;
    image_url?: boolean;
};
export type SeasonTeamJerseyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "season_team_id" | "type" | "primary_color" | "secondary_color" | "image_url", ExtArgs["result"]["seasonTeamJersey"]>;
export type SeasonTeamJerseyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    season_team?: boolean | Prisma.SeasonTeamDefaultArgs<ExtArgs>;
    matchJerseyAssignments?: boolean | Prisma.SeasonTeamJersey$matchJerseyAssignmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.SeasonTeamJerseyCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $SeasonTeamJerseyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SeasonTeamJersey";
    objects: {
        season_team: Prisma.$SeasonTeamPayload<ExtArgs>;
        matchJerseyAssignments: Prisma.$MatchJerseyAssignmentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        season_team_id: number;
        type: $Enums.JerseyType;
        primary_color: string;
        secondary_color: string | null;
        image_url: string | null;
    }, ExtArgs["result"]["seasonTeamJersey"]>;
    composites: {};
};
export type SeasonTeamJerseyGetPayload<S extends boolean | null | undefined | SeasonTeamJerseyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload, S>;
export type SeasonTeamJerseyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SeasonTeamJerseyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SeasonTeamJerseyCountAggregateInputType | true;
};
export interface SeasonTeamJerseyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SeasonTeamJersey'];
        meta: {
            name: 'SeasonTeamJersey';
        };
    };
    /**
     * Find zero or one SeasonTeamJersey that matches the filter.
     * @param {SeasonTeamJerseyFindUniqueArgs} args - Arguments to find a SeasonTeamJersey
     * @example
     * // Get one SeasonTeamJersey
     * const seasonTeamJersey = await prisma.seasonTeamJersey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeasonTeamJerseyFindUniqueArgs>(args: Prisma.SelectSubset<T, SeasonTeamJerseyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one SeasonTeamJersey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeasonTeamJerseyFindUniqueOrThrowArgs} args - Arguments to find a SeasonTeamJersey
     * @example
     * // Get one SeasonTeamJersey
     * const seasonTeamJersey = await prisma.seasonTeamJersey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeasonTeamJerseyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SeasonTeamJerseyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SeasonTeamJersey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamJerseyFindFirstArgs} args - Arguments to find a SeasonTeamJersey
     * @example
     * // Get one SeasonTeamJersey
     * const seasonTeamJersey = await prisma.seasonTeamJersey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeasonTeamJerseyFindFirstArgs>(args?: Prisma.SelectSubset<T, SeasonTeamJerseyFindFirstArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SeasonTeamJersey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamJerseyFindFirstOrThrowArgs} args - Arguments to find a SeasonTeamJersey
     * @example
     * // Get one SeasonTeamJersey
     * const seasonTeamJersey = await prisma.seasonTeamJersey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeasonTeamJerseyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SeasonTeamJerseyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more SeasonTeamJerseys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamJerseyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeasonTeamJerseys
     * const seasonTeamJerseys = await prisma.seasonTeamJersey.findMany()
     *
     * // Get first 10 SeasonTeamJerseys
     * const seasonTeamJerseys = await prisma.seasonTeamJersey.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const seasonTeamJerseyWithIdOnly = await prisma.seasonTeamJersey.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SeasonTeamJerseyFindManyArgs>(args?: Prisma.SelectSubset<T, SeasonTeamJerseyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a SeasonTeamJersey.
     * @param {SeasonTeamJerseyCreateArgs} args - Arguments to create a SeasonTeamJersey.
     * @example
     * // Create one SeasonTeamJersey
     * const SeasonTeamJersey = await prisma.seasonTeamJersey.create({
     *   data: {
     *     // ... data to create a SeasonTeamJersey
     *   }
     * })
     *
     */
    create<T extends SeasonTeamJerseyCreateArgs>(args: Prisma.SelectSubset<T, SeasonTeamJerseyCreateArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many SeasonTeamJerseys.
     * @param {SeasonTeamJerseyCreateManyArgs} args - Arguments to create many SeasonTeamJerseys.
     * @example
     * // Create many SeasonTeamJerseys
     * const seasonTeamJersey = await prisma.seasonTeamJersey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SeasonTeamJerseyCreateManyArgs>(args?: Prisma.SelectSubset<T, SeasonTeamJerseyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a SeasonTeamJersey.
     * @param {SeasonTeamJerseyDeleteArgs} args - Arguments to delete one SeasonTeamJersey.
     * @example
     * // Delete one SeasonTeamJersey
     * const SeasonTeamJersey = await prisma.seasonTeamJersey.delete({
     *   where: {
     *     // ... filter to delete one SeasonTeamJersey
     *   }
     * })
     *
     */
    delete<T extends SeasonTeamJerseyDeleteArgs>(args: Prisma.SelectSubset<T, SeasonTeamJerseyDeleteArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one SeasonTeamJersey.
     * @param {SeasonTeamJerseyUpdateArgs} args - Arguments to update one SeasonTeamJersey.
     * @example
     * // Update one SeasonTeamJersey
     * const seasonTeamJersey = await prisma.seasonTeamJersey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SeasonTeamJerseyUpdateArgs>(args: Prisma.SelectSubset<T, SeasonTeamJerseyUpdateArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more SeasonTeamJerseys.
     * @param {SeasonTeamJerseyDeleteManyArgs} args - Arguments to filter SeasonTeamJerseys to delete.
     * @example
     * // Delete a few SeasonTeamJerseys
     * const { count } = await prisma.seasonTeamJersey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SeasonTeamJerseyDeleteManyArgs>(args?: Prisma.SelectSubset<T, SeasonTeamJerseyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more SeasonTeamJerseys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamJerseyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeasonTeamJerseys
     * const seasonTeamJersey = await prisma.seasonTeamJersey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SeasonTeamJerseyUpdateManyArgs>(args: Prisma.SelectSubset<T, SeasonTeamJerseyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one SeasonTeamJersey.
     * @param {SeasonTeamJerseyUpsertArgs} args - Arguments to update or create a SeasonTeamJersey.
     * @example
     * // Update or create a SeasonTeamJersey
     * const seasonTeamJersey = await prisma.seasonTeamJersey.upsert({
     *   create: {
     *     // ... data to create a SeasonTeamJersey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeasonTeamJersey we want to update
     *   }
     * })
     */
    upsert<T extends SeasonTeamJerseyUpsertArgs>(args: Prisma.SelectSubset<T, SeasonTeamJerseyUpsertArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of SeasonTeamJerseys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamJerseyCountArgs} args - Arguments to filter SeasonTeamJerseys to count.
     * @example
     * // Count the number of SeasonTeamJerseys
     * const count = await prisma.seasonTeamJersey.count({
     *   where: {
     *     // ... the filter for the SeasonTeamJerseys we want to count
     *   }
     * })
    **/
    count<T extends SeasonTeamJerseyCountArgs>(args?: Prisma.Subset<T, SeasonTeamJerseyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SeasonTeamJerseyCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a SeasonTeamJersey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamJerseyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SeasonTeamJerseyAggregateArgs>(args: Prisma.Subset<T, SeasonTeamJerseyAggregateArgs>): Prisma.PrismaPromise<GetSeasonTeamJerseyAggregateType<T>>;
    /**
     * Group by SeasonTeamJersey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamJerseyGroupByArgs} args - Group by arguments.
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
    groupBy<T extends SeasonTeamJerseyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SeasonTeamJerseyGroupByArgs['orderBy'];
    } : {
        orderBy?: SeasonTeamJerseyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SeasonTeamJerseyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeasonTeamJerseyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the SeasonTeamJersey model
     */
    readonly fields: SeasonTeamJerseyFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for SeasonTeamJersey.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__SeasonTeamJerseyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    season_team<T extends Prisma.SeasonTeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonTeamDefaultArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    matchJerseyAssignments<T extends Prisma.SeasonTeamJersey$matchJerseyAssignmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonTeamJersey$matchJerseyAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the SeasonTeamJersey model
 */
export interface SeasonTeamJerseyFieldRefs {
    readonly id: Prisma.FieldRef<"SeasonTeamJersey", 'Int'>;
    readonly season_team_id: Prisma.FieldRef<"SeasonTeamJersey", 'Int'>;
    readonly type: Prisma.FieldRef<"SeasonTeamJersey", 'JerseyType'>;
    readonly primary_color: Prisma.FieldRef<"SeasonTeamJersey", 'String'>;
    readonly secondary_color: Prisma.FieldRef<"SeasonTeamJersey", 'String'>;
    readonly image_url: Prisma.FieldRef<"SeasonTeamJersey", 'String'>;
}
/**
 * SeasonTeamJersey findUnique
 */
export type SeasonTeamJerseyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamJersey to fetch.
     */
    where: Prisma.SeasonTeamJerseyWhereUniqueInput;
};
/**
 * SeasonTeamJersey findUniqueOrThrow
 */
export type SeasonTeamJerseyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamJersey to fetch.
     */
    where: Prisma.SeasonTeamJerseyWhereUniqueInput;
};
/**
 * SeasonTeamJersey findFirst
 */
export type SeasonTeamJerseyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamJersey to fetch.
     */
    where?: Prisma.SeasonTeamJerseyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeamJerseys to fetch.
     */
    orderBy?: Prisma.SeasonTeamJerseyOrderByWithRelationInput | Prisma.SeasonTeamJerseyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeasonTeamJerseys.
     */
    cursor?: Prisma.SeasonTeamJerseyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeamJerseys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeamJerseys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonTeamJerseys.
     */
    distinct?: Prisma.SeasonTeamJerseyScalarFieldEnum | Prisma.SeasonTeamJerseyScalarFieldEnum[];
};
/**
 * SeasonTeamJersey findFirstOrThrow
 */
export type SeasonTeamJerseyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamJersey to fetch.
     */
    where?: Prisma.SeasonTeamJerseyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeamJerseys to fetch.
     */
    orderBy?: Prisma.SeasonTeamJerseyOrderByWithRelationInput | Prisma.SeasonTeamJerseyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeasonTeamJerseys.
     */
    cursor?: Prisma.SeasonTeamJerseyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeamJerseys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeamJerseys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonTeamJerseys.
     */
    distinct?: Prisma.SeasonTeamJerseyScalarFieldEnum | Prisma.SeasonTeamJerseyScalarFieldEnum[];
};
/**
 * SeasonTeamJersey findMany
 */
export type SeasonTeamJerseyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamJerseys to fetch.
     */
    where?: Prisma.SeasonTeamJerseyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeamJerseys to fetch.
     */
    orderBy?: Prisma.SeasonTeamJerseyOrderByWithRelationInput | Prisma.SeasonTeamJerseyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SeasonTeamJerseys.
     */
    cursor?: Prisma.SeasonTeamJerseyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeamJerseys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeamJerseys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonTeamJerseys.
     */
    distinct?: Prisma.SeasonTeamJerseyScalarFieldEnum | Prisma.SeasonTeamJerseyScalarFieldEnum[];
};
/**
 * SeasonTeamJersey create
 */
export type SeasonTeamJerseyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
    /**
     * The data needed to create a SeasonTeamJersey.
     */
    data: Prisma.XOR<Prisma.SeasonTeamJerseyCreateInput, Prisma.SeasonTeamJerseyUncheckedCreateInput>;
};
/**
 * SeasonTeamJersey createMany
 */
export type SeasonTeamJerseyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeasonTeamJerseys.
     */
    data: Prisma.SeasonTeamJerseyCreateManyInput | Prisma.SeasonTeamJerseyCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * SeasonTeamJersey update
 */
export type SeasonTeamJerseyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
    /**
     * The data needed to update a SeasonTeamJersey.
     */
    data: Prisma.XOR<Prisma.SeasonTeamJerseyUpdateInput, Prisma.SeasonTeamJerseyUncheckedUpdateInput>;
    /**
     * Choose, which SeasonTeamJersey to update.
     */
    where: Prisma.SeasonTeamJerseyWhereUniqueInput;
};
/**
 * SeasonTeamJersey updateMany
 */
export type SeasonTeamJerseyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update SeasonTeamJerseys.
     */
    data: Prisma.XOR<Prisma.SeasonTeamJerseyUpdateManyMutationInput, Prisma.SeasonTeamJerseyUncheckedUpdateManyInput>;
    /**
     * Filter which SeasonTeamJerseys to update
     */
    where?: Prisma.SeasonTeamJerseyWhereInput;
    /**
     * Limit how many SeasonTeamJerseys to update.
     */
    limit?: number;
};
/**
 * SeasonTeamJersey upsert
 */
export type SeasonTeamJerseyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
    /**
     * The filter to search for the SeasonTeamJersey to update in case it exists.
     */
    where: Prisma.SeasonTeamJerseyWhereUniqueInput;
    /**
     * In case the SeasonTeamJersey found by the `where` argument doesn't exist, create a new SeasonTeamJersey with this data.
     */
    create: Prisma.XOR<Prisma.SeasonTeamJerseyCreateInput, Prisma.SeasonTeamJerseyUncheckedCreateInput>;
    /**
     * In case the SeasonTeamJersey was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.SeasonTeamJerseyUpdateInput, Prisma.SeasonTeamJerseyUncheckedUpdateInput>;
};
/**
 * SeasonTeamJersey delete
 */
export type SeasonTeamJerseyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter which SeasonTeamJersey to delete.
     */
    where: Prisma.SeasonTeamJerseyWhereUniqueInput;
};
/**
 * SeasonTeamJersey deleteMany
 */
export type SeasonTeamJerseyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonTeamJerseys to delete
     */
    where?: Prisma.SeasonTeamJerseyWhereInput;
    /**
     * Limit how many SeasonTeamJerseys to delete.
     */
    limit?: number;
};
/**
 * SeasonTeamJersey.matchJerseyAssignments
 */
export type SeasonTeamJersey$matchJerseyAssignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * SeasonTeamJersey without action
 */
export type SeasonTeamJerseyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamJersey
     */
    select?: Prisma.SeasonTeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamJersey
     */
    omit?: Prisma.SeasonTeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamJerseyInclude<ExtArgs> | null;
};
//# sourceMappingURL=SeasonTeamJersey.d.ts.map