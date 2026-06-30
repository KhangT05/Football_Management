import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MatchJerseyAssignment
 *
 */
export type MatchJerseyAssignmentModel = runtime.Types.Result.DefaultSelection<Prisma.$MatchJerseyAssignmentPayload>;
export type AggregateMatchJerseyAssignment = {
    _count: MatchJerseyAssignmentCountAggregateOutputType | null;
    _avg: MatchJerseyAssignmentAvgAggregateOutputType | null;
    _sum: MatchJerseyAssignmentSumAggregateOutputType | null;
    _min: MatchJerseyAssignmentMinAggregateOutputType | null;
    _max: MatchJerseyAssignmentMaxAggregateOutputType | null;
};
export type MatchJerseyAssignmentAvgAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    team_id: number | null;
    season_jersey_id: number | null;
};
export type MatchJerseyAssignmentSumAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    team_id: number | null;
    season_jersey_id: number | null;
};
export type MatchJerseyAssignmentMinAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    team_id: number | null;
    season_jersey_id: number | null;
};
export type MatchJerseyAssignmentMaxAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    team_id: number | null;
    season_jersey_id: number | null;
};
export type MatchJerseyAssignmentCountAggregateOutputType = {
    id: number;
    match_id: number;
    team_id: number;
    season_jersey_id: number;
    _all: number;
};
export type MatchJerseyAssignmentAvgAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    season_jersey_id?: true;
};
export type MatchJerseyAssignmentSumAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    season_jersey_id?: true;
};
export type MatchJerseyAssignmentMinAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    season_jersey_id?: true;
};
export type MatchJerseyAssignmentMaxAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    season_jersey_id?: true;
};
export type MatchJerseyAssignmentCountAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    season_jersey_id?: true;
    _all?: true;
};
export type MatchJerseyAssignmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MatchJerseyAssignment to aggregate.
     */
    where?: Prisma.MatchJerseyAssignmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchJerseyAssignments to fetch.
     */
    orderBy?: Prisma.MatchJerseyAssignmentOrderByWithRelationInput | Prisma.MatchJerseyAssignmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchJerseyAssignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchJerseyAssignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MatchJerseyAssignments
    **/
    _count?: true | MatchJerseyAssignmentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MatchJerseyAssignmentAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MatchJerseyAssignmentSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MatchJerseyAssignmentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MatchJerseyAssignmentMaxAggregateInputType;
};
export type GetMatchJerseyAssignmentAggregateType<T extends MatchJerseyAssignmentAggregateArgs> = {
    [P in keyof T & keyof AggregateMatchJerseyAssignment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMatchJerseyAssignment[P]> : Prisma.GetScalarType<T[P], AggregateMatchJerseyAssignment[P]>;
};
export type MatchJerseyAssignmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchJerseyAssignmentWhereInput;
    orderBy?: Prisma.MatchJerseyAssignmentOrderByWithAggregationInput | Prisma.MatchJerseyAssignmentOrderByWithAggregationInput[];
    by: Prisma.MatchJerseyAssignmentScalarFieldEnum[] | Prisma.MatchJerseyAssignmentScalarFieldEnum;
    having?: Prisma.MatchJerseyAssignmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MatchJerseyAssignmentCountAggregateInputType | true;
    _avg?: MatchJerseyAssignmentAvgAggregateInputType;
    _sum?: MatchJerseyAssignmentSumAggregateInputType;
    _min?: MatchJerseyAssignmentMinAggregateInputType;
    _max?: MatchJerseyAssignmentMaxAggregateInputType;
};
export type MatchJerseyAssignmentGroupByOutputType = {
    id: number;
    match_id: number;
    team_id: number;
    season_jersey_id: number;
    _count: MatchJerseyAssignmentCountAggregateOutputType | null;
    _avg: MatchJerseyAssignmentAvgAggregateOutputType | null;
    _sum: MatchJerseyAssignmentSumAggregateOutputType | null;
    _min: MatchJerseyAssignmentMinAggregateOutputType | null;
    _max: MatchJerseyAssignmentMaxAggregateOutputType | null;
};
export type GetMatchJerseyAssignmentGroupByPayload<T extends MatchJerseyAssignmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MatchJerseyAssignmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MatchJerseyAssignmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MatchJerseyAssignmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MatchJerseyAssignmentGroupByOutputType[P]>;
}>>;
export type MatchJerseyAssignmentWhereInput = {
    AND?: Prisma.MatchJerseyAssignmentWhereInput | Prisma.MatchJerseyAssignmentWhereInput[];
    OR?: Prisma.MatchJerseyAssignmentWhereInput[];
    NOT?: Prisma.MatchJerseyAssignmentWhereInput | Prisma.MatchJerseyAssignmentWhereInput[];
    id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    match_id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    team_id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    season_jersey_id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    season_jersey?: Prisma.XOR<Prisma.SeasonTeamJerseyScalarRelationFilter, Prisma.SeasonTeamJerseyWhereInput>;
};
export type MatchJerseyAssignmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_jersey_id?: Prisma.SortOrder;
    team?: Prisma.TeamOrderByWithRelationInput;
    match?: Prisma.MatchOrderByWithRelationInput;
    season_jersey?: Prisma.SeasonTeamJerseyOrderByWithRelationInput;
};
export type MatchJerseyAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    match_id_team_id?: Prisma.MatchJerseyAssignmentMatch_idTeam_idCompoundUniqueInput;
    AND?: Prisma.MatchJerseyAssignmentWhereInput | Prisma.MatchJerseyAssignmentWhereInput[];
    OR?: Prisma.MatchJerseyAssignmentWhereInput[];
    NOT?: Prisma.MatchJerseyAssignmentWhereInput | Prisma.MatchJerseyAssignmentWhereInput[];
    match_id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    team_id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    season_jersey_id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    season_jersey?: Prisma.XOR<Prisma.SeasonTeamJerseyScalarRelationFilter, Prisma.SeasonTeamJerseyWhereInput>;
}, "id" | "match_id_team_id">;
export type MatchJerseyAssignmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_jersey_id?: Prisma.SortOrder;
    _count?: Prisma.MatchJerseyAssignmentCountOrderByAggregateInput;
    _avg?: Prisma.MatchJerseyAssignmentAvgOrderByAggregateInput;
    _max?: Prisma.MatchJerseyAssignmentMaxOrderByAggregateInput;
    _min?: Prisma.MatchJerseyAssignmentMinOrderByAggregateInput;
    _sum?: Prisma.MatchJerseyAssignmentSumOrderByAggregateInput;
};
export type MatchJerseyAssignmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.MatchJerseyAssignmentScalarWhereWithAggregatesInput | Prisma.MatchJerseyAssignmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.MatchJerseyAssignmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MatchJerseyAssignmentScalarWhereWithAggregatesInput | Prisma.MatchJerseyAssignmentScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"MatchJerseyAssignment"> | number;
    match_id?: Prisma.IntWithAggregatesFilter<"MatchJerseyAssignment"> | number;
    team_id?: Prisma.IntWithAggregatesFilter<"MatchJerseyAssignment"> | number;
    season_jersey_id?: Prisma.IntWithAggregatesFilter<"MatchJerseyAssignment"> | number;
};
export type MatchJerseyAssignmentCreateInput = {
    team: Prisma.TeamCreateNestedOneWithoutMatchJerseyAssignmentsInput;
    match: Prisma.MatchCreateNestedOneWithoutMatchJerseyAssignmentInput;
    season_jersey: Prisma.SeasonTeamJerseyCreateNestedOneWithoutMatchJerseyAssignmentsInput;
};
export type MatchJerseyAssignmentUncheckedCreateInput = {
    id?: number;
    match_id: number;
    team_id: number;
    season_jersey_id: number;
};
export type MatchJerseyAssignmentUpdateInput = {
    team?: Prisma.TeamUpdateOneRequiredWithoutMatchJerseyAssignmentsNestedInput;
    match?: Prisma.MatchUpdateOneRequiredWithoutMatchJerseyAssignmentNestedInput;
    season_jersey?: Prisma.SeasonTeamJerseyUpdateOneRequiredWithoutMatchJerseyAssignmentsNestedInput;
};
export type MatchJerseyAssignmentUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_jersey_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MatchJerseyAssignmentCreateManyInput = {
    id?: number;
    match_id: number;
    team_id: number;
    season_jersey_id: number;
};
export type MatchJerseyAssignmentUpdateManyMutationInput = {};
export type MatchJerseyAssignmentUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_jersey_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MatchJerseyAssignmentListRelationFilter = {
    every?: Prisma.MatchJerseyAssignmentWhereInput;
    some?: Prisma.MatchJerseyAssignmentWhereInput;
    none?: Prisma.MatchJerseyAssignmentWhereInput;
};
export type MatchJerseyAssignmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MatchJerseyAssignmentMatch_idTeam_idCompoundUniqueInput = {
    match_id: number;
    team_id: number;
};
export type MatchJerseyAssignmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_jersey_id?: Prisma.SortOrder;
};
export type MatchJerseyAssignmentAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_jersey_id?: Prisma.SortOrder;
};
export type MatchJerseyAssignmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_jersey_id?: Prisma.SortOrder;
};
export type MatchJerseyAssignmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_jersey_id?: Prisma.SortOrder;
};
export type MatchJerseyAssignmentSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_jersey_id?: Prisma.SortOrder;
};
export type MatchJerseyAssignmentCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutTeamInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput> | Prisma.MatchJerseyAssignmentCreateWithoutTeamInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutTeamInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManyTeamInputEnvelope;
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
};
export type MatchJerseyAssignmentUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutTeamInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput> | Prisma.MatchJerseyAssignmentCreateWithoutTeamInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutTeamInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManyTeamInputEnvelope;
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
};
export type MatchJerseyAssignmentUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutTeamInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput> | Prisma.MatchJerseyAssignmentCreateWithoutTeamInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutTeamInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutTeamInput | Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManyTeamInputEnvelope;
    set?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    disconnect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    delete?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    update?: Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutTeamInput | Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutTeamInput | Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MatchJerseyAssignmentScalarWhereInput | Prisma.MatchJerseyAssignmentScalarWhereInput[];
};
export type MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutTeamInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput> | Prisma.MatchJerseyAssignmentCreateWithoutTeamInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutTeamInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutTeamInput | Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManyTeamInputEnvelope;
    set?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    disconnect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    delete?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    update?: Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutTeamInput | Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutTeamInput | Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MatchJerseyAssignmentScalarWhereInput | Prisma.MatchJerseyAssignmentScalarWhereInput[];
};
export type MatchJerseyAssignmentCreateNestedManyWithoutSeason_jerseyInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput> | Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutSeason_jerseyInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManySeason_jerseyInputEnvelope;
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
};
export type MatchJerseyAssignmentUncheckedCreateNestedManyWithoutSeason_jerseyInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput> | Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutSeason_jerseyInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManySeason_jerseyInputEnvelope;
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
};
export type MatchJerseyAssignmentUpdateManyWithoutSeason_jerseyNestedInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput> | Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutSeason_jerseyInput[];
    upsert?: Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutSeason_jerseyInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManySeason_jerseyInputEnvelope;
    set?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    disconnect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    delete?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    update?: Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutSeason_jerseyInput[];
    updateMany?: Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutSeason_jerseyInput[];
    deleteMany?: Prisma.MatchJerseyAssignmentScalarWhereInput | Prisma.MatchJerseyAssignmentScalarWhereInput[];
};
export type MatchJerseyAssignmentUncheckedUpdateManyWithoutSeason_jerseyNestedInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput> | Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutSeason_jerseyInput[];
    upsert?: Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutSeason_jerseyInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManySeason_jerseyInputEnvelope;
    set?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    disconnect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    delete?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    update?: Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutSeason_jerseyInput[];
    updateMany?: Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutSeason_jerseyInput | Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutSeason_jerseyInput[];
    deleteMany?: Prisma.MatchJerseyAssignmentScalarWhereInput | Prisma.MatchJerseyAssignmentScalarWhereInput[];
};
export type MatchJerseyAssignmentCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutMatchInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput> | Prisma.MatchJerseyAssignmentCreateWithoutMatchInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutMatchInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManyMatchInputEnvelope;
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
};
export type MatchJerseyAssignmentUncheckedCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutMatchInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput> | Prisma.MatchJerseyAssignmentCreateWithoutMatchInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutMatchInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManyMatchInputEnvelope;
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
};
export type MatchJerseyAssignmentUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutMatchInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput> | Prisma.MatchJerseyAssignmentCreateWithoutMatchInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutMatchInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutMatchInput | Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManyMatchInputEnvelope;
    set?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    disconnect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    delete?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    update?: Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutMatchInput | Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutMatchInput | Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.MatchJerseyAssignmentScalarWhereInput | Prisma.MatchJerseyAssignmentScalarWhereInput[];
};
export type MatchJerseyAssignmentUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutMatchInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput> | Prisma.MatchJerseyAssignmentCreateWithoutMatchInput[] | Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchJerseyAssignmentCreateOrConnectWithoutMatchInput | Prisma.MatchJerseyAssignmentCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutMatchInput | Prisma.MatchJerseyAssignmentUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.MatchJerseyAssignmentCreateManyMatchInputEnvelope;
    set?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    disconnect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    delete?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    connect?: Prisma.MatchJerseyAssignmentWhereUniqueInput | Prisma.MatchJerseyAssignmentWhereUniqueInput[];
    update?: Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutMatchInput | Prisma.MatchJerseyAssignmentUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutMatchInput | Prisma.MatchJerseyAssignmentUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.MatchJerseyAssignmentScalarWhereInput | Prisma.MatchJerseyAssignmentScalarWhereInput[];
};
export type MatchJerseyAssignmentCreateWithoutTeamInput = {
    match: Prisma.MatchCreateNestedOneWithoutMatchJerseyAssignmentInput;
    season_jersey: Prisma.SeasonTeamJerseyCreateNestedOneWithoutMatchJerseyAssignmentsInput;
};
export type MatchJerseyAssignmentUncheckedCreateWithoutTeamInput = {
    id?: number;
    match_id: number;
    season_jersey_id: number;
};
export type MatchJerseyAssignmentCreateOrConnectWithoutTeamInput = {
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutTeamInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput>;
};
export type MatchJerseyAssignmentCreateManyTeamInputEnvelope = {
    data: Prisma.MatchJerseyAssignmentCreateManyTeamInput | Prisma.MatchJerseyAssignmentCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type MatchJerseyAssignmentUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateWithoutTeamInput, Prisma.MatchJerseyAssignmentUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutTeamInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutTeamInput>;
};
export type MatchJerseyAssignmentUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateWithoutTeamInput, Prisma.MatchJerseyAssignmentUncheckedUpdateWithoutTeamInput>;
};
export type MatchJerseyAssignmentUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.MatchJerseyAssignmentScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateManyMutationInput, Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamInput>;
};
export type MatchJerseyAssignmentScalarWhereInput = {
    AND?: Prisma.MatchJerseyAssignmentScalarWhereInput | Prisma.MatchJerseyAssignmentScalarWhereInput[];
    OR?: Prisma.MatchJerseyAssignmentScalarWhereInput[];
    NOT?: Prisma.MatchJerseyAssignmentScalarWhereInput | Prisma.MatchJerseyAssignmentScalarWhereInput[];
    id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    match_id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    team_id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
    season_jersey_id?: Prisma.IntFilter<"MatchJerseyAssignment"> | number;
};
export type MatchJerseyAssignmentCreateWithoutSeason_jerseyInput = {
    team: Prisma.TeamCreateNestedOneWithoutMatchJerseyAssignmentsInput;
    match: Prisma.MatchCreateNestedOneWithoutMatchJerseyAssignmentInput;
};
export type MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput = {
    id?: number;
    match_id: number;
    team_id: number;
};
export type MatchJerseyAssignmentCreateOrConnectWithoutSeason_jerseyInput = {
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput>;
};
export type MatchJerseyAssignmentCreateManySeason_jerseyInputEnvelope = {
    data: Prisma.MatchJerseyAssignmentCreateManySeason_jerseyInput | Prisma.MatchJerseyAssignmentCreateManySeason_jerseyInput[];
    skipDuplicates?: boolean;
};
export type MatchJerseyAssignmentUpsertWithWhereUniqueWithoutSeason_jerseyInput = {
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateWithoutSeason_jerseyInput, Prisma.MatchJerseyAssignmentUncheckedUpdateWithoutSeason_jerseyInput>;
    create: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutSeason_jerseyInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutSeason_jerseyInput>;
};
export type MatchJerseyAssignmentUpdateWithWhereUniqueWithoutSeason_jerseyInput = {
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateWithoutSeason_jerseyInput, Prisma.MatchJerseyAssignmentUncheckedUpdateWithoutSeason_jerseyInput>;
};
export type MatchJerseyAssignmentUpdateManyWithWhereWithoutSeason_jerseyInput = {
    where: Prisma.MatchJerseyAssignmentScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateManyMutationInput, Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutSeason_jerseyInput>;
};
export type MatchJerseyAssignmentCreateWithoutMatchInput = {
    team: Prisma.TeamCreateNestedOneWithoutMatchJerseyAssignmentsInput;
    season_jersey: Prisma.SeasonTeamJerseyCreateNestedOneWithoutMatchJerseyAssignmentsInput;
};
export type MatchJerseyAssignmentUncheckedCreateWithoutMatchInput = {
    id?: number;
    team_id: number;
    season_jersey_id: number;
};
export type MatchJerseyAssignmentCreateOrConnectWithoutMatchInput = {
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutMatchInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput>;
};
export type MatchJerseyAssignmentCreateManyMatchInputEnvelope = {
    data: Prisma.MatchJerseyAssignmentCreateManyMatchInput | Prisma.MatchJerseyAssignmentCreateManyMatchInput[];
    skipDuplicates?: boolean;
};
export type MatchJerseyAssignmentUpsertWithWhereUniqueWithoutMatchInput = {
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateWithoutMatchInput, Prisma.MatchJerseyAssignmentUncheckedUpdateWithoutMatchInput>;
    create: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateWithoutMatchInput, Prisma.MatchJerseyAssignmentUncheckedCreateWithoutMatchInput>;
};
export type MatchJerseyAssignmentUpdateWithWhereUniqueWithoutMatchInput = {
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateWithoutMatchInput, Prisma.MatchJerseyAssignmentUncheckedUpdateWithoutMatchInput>;
};
export type MatchJerseyAssignmentUpdateManyWithWhereWithoutMatchInput = {
    where: Prisma.MatchJerseyAssignmentScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateManyMutationInput, Prisma.MatchJerseyAssignmentUncheckedUpdateManyWithoutMatchInput>;
};
export type MatchJerseyAssignmentCreateManyTeamInput = {
    id?: number;
    match_id: number;
    season_jersey_id: number;
};
export type MatchJerseyAssignmentUpdateWithoutTeamInput = {
    match?: Prisma.MatchUpdateOneRequiredWithoutMatchJerseyAssignmentNestedInput;
    season_jersey?: Prisma.SeasonTeamJerseyUpdateOneRequiredWithoutMatchJerseyAssignmentsNestedInput;
};
export type MatchJerseyAssignmentUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_jersey_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MatchJerseyAssignmentUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_jersey_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MatchJerseyAssignmentCreateManySeason_jerseyInput = {
    id?: number;
    match_id: number;
    team_id: number;
};
export type MatchJerseyAssignmentUpdateWithoutSeason_jerseyInput = {
    team?: Prisma.TeamUpdateOneRequiredWithoutMatchJerseyAssignmentsNestedInput;
    match?: Prisma.MatchUpdateOneRequiredWithoutMatchJerseyAssignmentNestedInput;
};
export type MatchJerseyAssignmentUncheckedUpdateWithoutSeason_jerseyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MatchJerseyAssignmentUncheckedUpdateManyWithoutSeason_jerseyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MatchJerseyAssignmentCreateManyMatchInput = {
    id?: number;
    team_id: number;
    season_jersey_id: number;
};
export type MatchJerseyAssignmentUpdateWithoutMatchInput = {
    team?: Prisma.TeamUpdateOneRequiredWithoutMatchJerseyAssignmentsNestedInput;
    season_jersey?: Prisma.SeasonTeamJerseyUpdateOneRequiredWithoutMatchJerseyAssignmentsNestedInput;
};
export type MatchJerseyAssignmentUncheckedUpdateWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_jersey_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MatchJerseyAssignmentUncheckedUpdateManyWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_jersey_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MatchJerseyAssignmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    match_id?: boolean;
    team_id?: boolean;
    season_jersey_id?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    season_jersey?: boolean | Prisma.SeasonTeamJerseyDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["matchJerseyAssignment"]>;
export type MatchJerseyAssignmentSelectScalar = {
    id?: boolean;
    match_id?: boolean;
    team_id?: boolean;
    season_jersey_id?: boolean;
};
export type MatchJerseyAssignmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "match_id" | "team_id" | "season_jersey_id", ExtArgs["result"]["matchJerseyAssignment"]>;
export type MatchJerseyAssignmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    season_jersey?: boolean | Prisma.SeasonTeamJerseyDefaultArgs<ExtArgs>;
};
export type $MatchJerseyAssignmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MatchJerseyAssignment";
    objects: {
        team: Prisma.$TeamPayload<ExtArgs>;
        match: Prisma.$MatchPayload<ExtArgs>;
        season_jersey: Prisma.$SeasonTeamJerseyPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        match_id: number;
        team_id: number;
        season_jersey_id: number;
    }, ExtArgs["result"]["matchJerseyAssignment"]>;
    composites: {};
};
export type MatchJerseyAssignmentGetPayload<S extends boolean | null | undefined | MatchJerseyAssignmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload, S>;
export type MatchJerseyAssignmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MatchJerseyAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MatchJerseyAssignmentCountAggregateInputType | true;
};
export interface MatchJerseyAssignmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MatchJerseyAssignment'];
        meta: {
            name: 'MatchJerseyAssignment';
        };
    };
    /**
     * Find zero or one MatchJerseyAssignment that matches the filter.
     * @param {MatchJerseyAssignmentFindUniqueArgs} args - Arguments to find a MatchJerseyAssignment
     * @example
     * // Get one MatchJerseyAssignment
     * const matchJerseyAssignment = await prisma.matchJerseyAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchJerseyAssignmentFindUniqueArgs>(args: Prisma.SelectSubset<T, MatchJerseyAssignmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MatchJerseyAssignmentClient<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MatchJerseyAssignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchJerseyAssignmentFindUniqueOrThrowArgs} args - Arguments to find a MatchJerseyAssignment
     * @example
     * // Get one MatchJerseyAssignment
     * const matchJerseyAssignment = await prisma.matchJerseyAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchJerseyAssignmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MatchJerseyAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchJerseyAssignmentClient<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MatchJerseyAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchJerseyAssignmentFindFirstArgs} args - Arguments to find a MatchJerseyAssignment
     * @example
     * // Get one MatchJerseyAssignment
     * const matchJerseyAssignment = await prisma.matchJerseyAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchJerseyAssignmentFindFirstArgs>(args?: Prisma.SelectSubset<T, MatchJerseyAssignmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__MatchJerseyAssignmentClient<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MatchJerseyAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchJerseyAssignmentFindFirstOrThrowArgs} args - Arguments to find a MatchJerseyAssignment
     * @example
     * // Get one MatchJerseyAssignment
     * const matchJerseyAssignment = await prisma.matchJerseyAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchJerseyAssignmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MatchJerseyAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchJerseyAssignmentClient<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MatchJerseyAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchJerseyAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchJerseyAssignments
     * const matchJerseyAssignments = await prisma.matchJerseyAssignment.findMany()
     *
     * // Get first 10 MatchJerseyAssignments
     * const matchJerseyAssignments = await prisma.matchJerseyAssignment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const matchJerseyAssignmentWithIdOnly = await prisma.matchJerseyAssignment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MatchJerseyAssignmentFindManyArgs>(args?: Prisma.SelectSubset<T, MatchJerseyAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MatchJerseyAssignment.
     * @param {MatchJerseyAssignmentCreateArgs} args - Arguments to create a MatchJerseyAssignment.
     * @example
     * // Create one MatchJerseyAssignment
     * const MatchJerseyAssignment = await prisma.matchJerseyAssignment.create({
     *   data: {
     *     // ... data to create a MatchJerseyAssignment
     *   }
     * })
     *
     */
    create<T extends MatchJerseyAssignmentCreateArgs>(args: Prisma.SelectSubset<T, MatchJerseyAssignmentCreateArgs<ExtArgs>>): Prisma.Prisma__MatchJerseyAssignmentClient<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MatchJerseyAssignments.
     * @param {MatchJerseyAssignmentCreateManyArgs} args - Arguments to create many MatchJerseyAssignments.
     * @example
     * // Create many MatchJerseyAssignments
     * const matchJerseyAssignment = await prisma.matchJerseyAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MatchJerseyAssignmentCreateManyArgs>(args?: Prisma.SelectSubset<T, MatchJerseyAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MatchJerseyAssignment.
     * @param {MatchJerseyAssignmentDeleteArgs} args - Arguments to delete one MatchJerseyAssignment.
     * @example
     * // Delete one MatchJerseyAssignment
     * const MatchJerseyAssignment = await prisma.matchJerseyAssignment.delete({
     *   where: {
     *     // ... filter to delete one MatchJerseyAssignment
     *   }
     * })
     *
     */
    delete<T extends MatchJerseyAssignmentDeleteArgs>(args: Prisma.SelectSubset<T, MatchJerseyAssignmentDeleteArgs<ExtArgs>>): Prisma.Prisma__MatchJerseyAssignmentClient<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MatchJerseyAssignment.
     * @param {MatchJerseyAssignmentUpdateArgs} args - Arguments to update one MatchJerseyAssignment.
     * @example
     * // Update one MatchJerseyAssignment
     * const matchJerseyAssignment = await prisma.matchJerseyAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MatchJerseyAssignmentUpdateArgs>(args: Prisma.SelectSubset<T, MatchJerseyAssignmentUpdateArgs<ExtArgs>>): Prisma.Prisma__MatchJerseyAssignmentClient<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MatchJerseyAssignments.
     * @param {MatchJerseyAssignmentDeleteManyArgs} args - Arguments to filter MatchJerseyAssignments to delete.
     * @example
     * // Delete a few MatchJerseyAssignments
     * const { count } = await prisma.matchJerseyAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MatchJerseyAssignmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, MatchJerseyAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MatchJerseyAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchJerseyAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchJerseyAssignments
     * const matchJerseyAssignment = await prisma.matchJerseyAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MatchJerseyAssignmentUpdateManyArgs>(args: Prisma.SelectSubset<T, MatchJerseyAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MatchJerseyAssignment.
     * @param {MatchJerseyAssignmentUpsertArgs} args - Arguments to update or create a MatchJerseyAssignment.
     * @example
     * // Update or create a MatchJerseyAssignment
     * const matchJerseyAssignment = await prisma.matchJerseyAssignment.upsert({
     *   create: {
     *     // ... data to create a MatchJerseyAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchJerseyAssignment we want to update
     *   }
     * })
     */
    upsert<T extends MatchJerseyAssignmentUpsertArgs>(args: Prisma.SelectSubset<T, MatchJerseyAssignmentUpsertArgs<ExtArgs>>): Prisma.Prisma__MatchJerseyAssignmentClient<runtime.Types.Result.GetResult<Prisma.$MatchJerseyAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MatchJerseyAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchJerseyAssignmentCountArgs} args - Arguments to filter MatchJerseyAssignments to count.
     * @example
     * // Count the number of MatchJerseyAssignments
     * const count = await prisma.matchJerseyAssignment.count({
     *   where: {
     *     // ... the filter for the MatchJerseyAssignments we want to count
     *   }
     * })
    **/
    count<T extends MatchJerseyAssignmentCountArgs>(args?: Prisma.Subset<T, MatchJerseyAssignmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MatchJerseyAssignmentCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MatchJerseyAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchJerseyAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MatchJerseyAssignmentAggregateArgs>(args: Prisma.Subset<T, MatchJerseyAssignmentAggregateArgs>): Prisma.PrismaPromise<GetMatchJerseyAssignmentAggregateType<T>>;
    /**
     * Group by MatchJerseyAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchJerseyAssignmentGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MatchJerseyAssignmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MatchJerseyAssignmentGroupByArgs['orderBy'];
    } : {
        orderBy?: MatchJerseyAssignmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MatchJerseyAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchJerseyAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MatchJerseyAssignment model
     */
    readonly fields: MatchJerseyAssignmentFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MatchJerseyAssignment.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MatchJerseyAssignmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    match<T extends Prisma.MatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchDefaultArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    season_jersey<T extends Prisma.SeasonTeamJerseyDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonTeamJerseyDefaultArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the MatchJerseyAssignment model
 */
export interface MatchJerseyAssignmentFieldRefs {
    readonly id: Prisma.FieldRef<"MatchJerseyAssignment", 'Int'>;
    readonly match_id: Prisma.FieldRef<"MatchJerseyAssignment", 'Int'>;
    readonly team_id: Prisma.FieldRef<"MatchJerseyAssignment", 'Int'>;
    readonly season_jersey_id: Prisma.FieldRef<"MatchJerseyAssignment", 'Int'>;
}
/**
 * MatchJerseyAssignment findUnique
 */
export type MatchJerseyAssignmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchJerseyAssignment to fetch.
     */
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
};
/**
 * MatchJerseyAssignment findUniqueOrThrow
 */
export type MatchJerseyAssignmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchJerseyAssignment to fetch.
     */
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
};
/**
 * MatchJerseyAssignment findFirst
 */
export type MatchJerseyAssignmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchJerseyAssignment to fetch.
     */
    where?: Prisma.MatchJerseyAssignmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchJerseyAssignments to fetch.
     */
    orderBy?: Prisma.MatchJerseyAssignmentOrderByWithRelationInput | Prisma.MatchJerseyAssignmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MatchJerseyAssignments.
     */
    cursor?: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchJerseyAssignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchJerseyAssignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchJerseyAssignments.
     */
    distinct?: Prisma.MatchJerseyAssignmentScalarFieldEnum | Prisma.MatchJerseyAssignmentScalarFieldEnum[];
};
/**
 * MatchJerseyAssignment findFirstOrThrow
 */
export type MatchJerseyAssignmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchJerseyAssignment to fetch.
     */
    where?: Prisma.MatchJerseyAssignmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchJerseyAssignments to fetch.
     */
    orderBy?: Prisma.MatchJerseyAssignmentOrderByWithRelationInput | Prisma.MatchJerseyAssignmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MatchJerseyAssignments.
     */
    cursor?: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchJerseyAssignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchJerseyAssignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchJerseyAssignments.
     */
    distinct?: Prisma.MatchJerseyAssignmentScalarFieldEnum | Prisma.MatchJerseyAssignmentScalarFieldEnum[];
};
/**
 * MatchJerseyAssignment findMany
 */
export type MatchJerseyAssignmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchJerseyAssignments to fetch.
     */
    where?: Prisma.MatchJerseyAssignmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchJerseyAssignments to fetch.
     */
    orderBy?: Prisma.MatchJerseyAssignmentOrderByWithRelationInput | Prisma.MatchJerseyAssignmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MatchJerseyAssignments.
     */
    cursor?: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchJerseyAssignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchJerseyAssignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchJerseyAssignments.
     */
    distinct?: Prisma.MatchJerseyAssignmentScalarFieldEnum | Prisma.MatchJerseyAssignmentScalarFieldEnum[];
};
/**
 * MatchJerseyAssignment create
 */
export type MatchJerseyAssignmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a MatchJerseyAssignment.
     */
    data: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateInput, Prisma.MatchJerseyAssignmentUncheckedCreateInput>;
};
/**
 * MatchJerseyAssignment createMany
 */
export type MatchJerseyAssignmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchJerseyAssignments.
     */
    data: Prisma.MatchJerseyAssignmentCreateManyInput | Prisma.MatchJerseyAssignmentCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * MatchJerseyAssignment update
 */
export type MatchJerseyAssignmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a MatchJerseyAssignment.
     */
    data: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateInput, Prisma.MatchJerseyAssignmentUncheckedUpdateInput>;
    /**
     * Choose, which MatchJerseyAssignment to update.
     */
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
};
/**
 * MatchJerseyAssignment updateMany
 */
export type MatchJerseyAssignmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchJerseyAssignments.
     */
    data: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateManyMutationInput, Prisma.MatchJerseyAssignmentUncheckedUpdateManyInput>;
    /**
     * Filter which MatchJerseyAssignments to update
     */
    where?: Prisma.MatchJerseyAssignmentWhereInput;
    /**
     * Limit how many MatchJerseyAssignments to update.
     */
    limit?: number;
};
/**
 * MatchJerseyAssignment upsert
 */
export type MatchJerseyAssignmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the MatchJerseyAssignment to update in case it exists.
     */
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
    /**
     * In case the MatchJerseyAssignment found by the `where` argument doesn't exist, create a new MatchJerseyAssignment with this data.
     */
    create: Prisma.XOR<Prisma.MatchJerseyAssignmentCreateInput, Prisma.MatchJerseyAssignmentUncheckedCreateInput>;
    /**
     * In case the MatchJerseyAssignment was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MatchJerseyAssignmentUpdateInput, Prisma.MatchJerseyAssignmentUncheckedUpdateInput>;
};
/**
 * MatchJerseyAssignment delete
 */
export type MatchJerseyAssignmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which MatchJerseyAssignment to delete.
     */
    where: Prisma.MatchJerseyAssignmentWhereUniqueInput;
};
/**
 * MatchJerseyAssignment deleteMany
 */
export type MatchJerseyAssignmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MatchJerseyAssignments to delete
     */
    where?: Prisma.MatchJerseyAssignmentWhereInput;
    /**
     * Limit how many MatchJerseyAssignments to delete.
     */
    limit?: number;
};
/**
 * MatchJerseyAssignment without action
 */
export type MatchJerseyAssignmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=MatchJerseyAssignment.d.ts.map