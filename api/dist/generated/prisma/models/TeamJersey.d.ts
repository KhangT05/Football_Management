import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model TeamJersey
 *
 */
export type TeamJerseyModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamJerseyPayload>;
export type AggregateTeamJersey = {
    _count: TeamJerseyCountAggregateOutputType | null;
    _avg: TeamJerseyAvgAggregateOutputType | null;
    _sum: TeamJerseySumAggregateOutputType | null;
    _min: TeamJerseyMinAggregateOutputType | null;
    _max: TeamJerseyMaxAggregateOutputType | null;
};
export type TeamJerseyAvgAggregateOutputType = {
    id: number | null;
    team_id: number | null;
};
export type TeamJerseySumAggregateOutputType = {
    id: number | null;
    team_id: number | null;
};
export type TeamJerseyMinAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    type: $Enums.JerseyType | null;
    primary_color: string | null;
    secondary_color: string | null;
};
export type TeamJerseyMaxAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    type: $Enums.JerseyType | null;
    primary_color: string | null;
    secondary_color: string | null;
};
export type TeamJerseyCountAggregateOutputType = {
    id: number;
    team_id: number;
    type: number;
    primary_color: number;
    secondary_color: number;
    _all: number;
};
export type TeamJerseyAvgAggregateInputType = {
    id?: true;
    team_id?: true;
};
export type TeamJerseySumAggregateInputType = {
    id?: true;
    team_id?: true;
};
export type TeamJerseyMinAggregateInputType = {
    id?: true;
    team_id?: true;
    type?: true;
    primary_color?: true;
    secondary_color?: true;
};
export type TeamJerseyMaxAggregateInputType = {
    id?: true;
    team_id?: true;
    type?: true;
    primary_color?: true;
    secondary_color?: true;
};
export type TeamJerseyCountAggregateInputType = {
    id?: true;
    team_id?: true;
    type?: true;
    primary_color?: true;
    secondary_color?: true;
    _all?: true;
};
export type TeamJerseyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TeamJersey to aggregate.
     */
    where?: Prisma.TeamJerseyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamJerseys to fetch.
     */
    orderBy?: Prisma.TeamJerseyOrderByWithRelationInput | Prisma.TeamJerseyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.TeamJerseyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamJerseys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamJerseys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TeamJerseys
    **/
    _count?: true | TeamJerseyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: TeamJerseyAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: TeamJerseySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TeamJerseyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TeamJerseyMaxAggregateInputType;
};
export type GetTeamJerseyAggregateType<T extends TeamJerseyAggregateArgs> = {
    [P in keyof T & keyof AggregateTeamJersey]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeamJersey[P]> : Prisma.GetScalarType<T[P], AggregateTeamJersey[P]>;
};
export type TeamJerseyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamJerseyWhereInput;
    orderBy?: Prisma.TeamJerseyOrderByWithAggregationInput | Prisma.TeamJerseyOrderByWithAggregationInput[];
    by: Prisma.TeamJerseyScalarFieldEnum[] | Prisma.TeamJerseyScalarFieldEnum;
    having?: Prisma.TeamJerseyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamJerseyCountAggregateInputType | true;
    _avg?: TeamJerseyAvgAggregateInputType;
    _sum?: TeamJerseySumAggregateInputType;
    _min?: TeamJerseyMinAggregateInputType;
    _max?: TeamJerseyMaxAggregateInputType;
};
export type TeamJerseyGroupByOutputType = {
    id: number;
    team_id: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color: string | null;
    _count: TeamJerseyCountAggregateOutputType | null;
    _avg: TeamJerseyAvgAggregateOutputType | null;
    _sum: TeamJerseySumAggregateOutputType | null;
    _min: TeamJerseyMinAggregateOutputType | null;
    _max: TeamJerseyMaxAggregateOutputType | null;
};
export type GetTeamJerseyGroupByPayload<T extends TeamJerseyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamJerseyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamJerseyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamJerseyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamJerseyGroupByOutputType[P]>;
}>>;
export type TeamJerseyWhereInput = {
    AND?: Prisma.TeamJerseyWhereInput | Prisma.TeamJerseyWhereInput[];
    OR?: Prisma.TeamJerseyWhereInput[];
    NOT?: Prisma.TeamJerseyWhereInput | Prisma.TeamJerseyWhereInput[];
    id?: Prisma.IntFilter<"TeamJersey"> | number;
    team_id?: Prisma.IntFilter<"TeamJersey"> | number;
    type?: Prisma.EnumJerseyTypeFilter<"TeamJersey"> | $Enums.JerseyType;
    primary_color?: Prisma.StringFilter<"TeamJersey"> | string;
    secondary_color?: Prisma.StringNullableFilter<"TeamJersey"> | string | null;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
};
export type TeamJerseyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrderInput | Prisma.SortOrder;
    team?: Prisma.TeamOrderByWithRelationInput;
    _relevance?: Prisma.TeamJerseyOrderByRelevanceInput;
};
export type TeamJerseyWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    team_id_type?: Prisma.TeamJerseyTeam_idTypeCompoundUniqueInput;
    AND?: Prisma.TeamJerseyWhereInput | Prisma.TeamJerseyWhereInput[];
    OR?: Prisma.TeamJerseyWhereInput[];
    NOT?: Prisma.TeamJerseyWhereInput | Prisma.TeamJerseyWhereInput[];
    team_id?: Prisma.IntFilter<"TeamJersey"> | number;
    type?: Prisma.EnumJerseyTypeFilter<"TeamJersey"> | $Enums.JerseyType;
    primary_color?: Prisma.StringFilter<"TeamJersey"> | string;
    secondary_color?: Prisma.StringNullableFilter<"TeamJersey"> | string | null;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
}, "id" | "team_id_type">;
export type TeamJerseyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TeamJerseyCountOrderByAggregateInput;
    _avg?: Prisma.TeamJerseyAvgOrderByAggregateInput;
    _max?: Prisma.TeamJerseyMaxOrderByAggregateInput;
    _min?: Prisma.TeamJerseyMinOrderByAggregateInput;
    _sum?: Prisma.TeamJerseySumOrderByAggregateInput;
};
export type TeamJerseyScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamJerseyScalarWhereWithAggregatesInput | Prisma.TeamJerseyScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamJerseyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamJerseyScalarWhereWithAggregatesInput | Prisma.TeamJerseyScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"TeamJersey"> | number;
    team_id?: Prisma.IntWithAggregatesFilter<"TeamJersey"> | number;
    type?: Prisma.EnumJerseyTypeWithAggregatesFilter<"TeamJersey"> | $Enums.JerseyType;
    primary_color?: Prisma.StringWithAggregatesFilter<"TeamJersey"> | string;
    secondary_color?: Prisma.StringNullableWithAggregatesFilter<"TeamJersey"> | string | null;
};
export type TeamJerseyCreateInput = {
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
    team: Prisma.TeamCreateNestedOneWithoutJerseysInput;
};
export type TeamJerseyUncheckedCreateInput = {
    id?: number;
    team_id: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
};
export type TeamJerseyUpdateInput = {
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.TeamUpdateOneRequiredWithoutJerseysNestedInput;
};
export type TeamJerseyUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TeamJerseyCreateManyInput = {
    id?: number;
    team_id: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
};
export type TeamJerseyUpdateManyMutationInput = {
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TeamJerseyUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TeamJerseyListRelationFilter = {
    every?: Prisma.TeamJerseyWhereInput;
    some?: Prisma.TeamJerseyWhereInput;
    none?: Prisma.TeamJerseyWhereInput;
};
export type TeamJerseyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TeamJerseyOrderByRelevanceInput = {
    fields: Prisma.TeamJerseyOrderByRelevanceFieldEnum | Prisma.TeamJerseyOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type TeamJerseyTeam_idTypeCompoundUniqueInput = {
    team_id: number;
    type: $Enums.JerseyType;
};
export type TeamJerseyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrder;
};
export type TeamJerseyAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
};
export type TeamJerseyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrder;
};
export type TeamJerseyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    primary_color?: Prisma.SortOrder;
    secondary_color?: Prisma.SortOrder;
};
export type TeamJerseySumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
};
export type TeamJerseyCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamJerseyCreateWithoutTeamInput, Prisma.TeamJerseyUncheckedCreateWithoutTeamInput> | Prisma.TeamJerseyCreateWithoutTeamInput[] | Prisma.TeamJerseyUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamJerseyCreateOrConnectWithoutTeamInput | Prisma.TeamJerseyCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamJerseyCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
};
export type TeamJerseyUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamJerseyCreateWithoutTeamInput, Prisma.TeamJerseyUncheckedCreateWithoutTeamInput> | Prisma.TeamJerseyCreateWithoutTeamInput[] | Prisma.TeamJerseyUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamJerseyCreateOrConnectWithoutTeamInput | Prisma.TeamJerseyCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamJerseyCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
};
export type TeamJerseyUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamJerseyCreateWithoutTeamInput, Prisma.TeamJerseyUncheckedCreateWithoutTeamInput> | Prisma.TeamJerseyCreateWithoutTeamInput[] | Prisma.TeamJerseyUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamJerseyCreateOrConnectWithoutTeamInput | Prisma.TeamJerseyCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamJerseyUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamJerseyUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamJerseyCreateManyTeamInputEnvelope;
    set?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
    disconnect?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
    delete?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
    connect?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
    update?: Prisma.TeamJerseyUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamJerseyUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamJerseyUpdateManyWithWhereWithoutTeamInput | Prisma.TeamJerseyUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamJerseyScalarWhereInput | Prisma.TeamJerseyScalarWhereInput[];
};
export type TeamJerseyUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamJerseyCreateWithoutTeamInput, Prisma.TeamJerseyUncheckedCreateWithoutTeamInput> | Prisma.TeamJerseyCreateWithoutTeamInput[] | Prisma.TeamJerseyUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamJerseyCreateOrConnectWithoutTeamInput | Prisma.TeamJerseyCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamJerseyUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamJerseyUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamJerseyCreateManyTeamInputEnvelope;
    set?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
    disconnect?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
    delete?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
    connect?: Prisma.TeamJerseyWhereUniqueInput | Prisma.TeamJerseyWhereUniqueInput[];
    update?: Prisma.TeamJerseyUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamJerseyUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamJerseyUpdateManyWithWhereWithoutTeamInput | Prisma.TeamJerseyUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamJerseyScalarWhereInput | Prisma.TeamJerseyScalarWhereInput[];
};
export type EnumJerseyTypeFieldUpdateOperationsInput = {
    set?: $Enums.JerseyType;
};
export type TeamJerseyCreateWithoutTeamInput = {
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
};
export type TeamJerseyUncheckedCreateWithoutTeamInput = {
    id?: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
};
export type TeamJerseyCreateOrConnectWithoutTeamInput = {
    where: Prisma.TeamJerseyWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamJerseyCreateWithoutTeamInput, Prisma.TeamJerseyUncheckedCreateWithoutTeamInput>;
};
export type TeamJerseyCreateManyTeamInputEnvelope = {
    data: Prisma.TeamJerseyCreateManyTeamInput | Prisma.TeamJerseyCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type TeamJerseyUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamJerseyWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamJerseyUpdateWithoutTeamInput, Prisma.TeamJerseyUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.TeamJerseyCreateWithoutTeamInput, Prisma.TeamJerseyUncheckedCreateWithoutTeamInput>;
};
export type TeamJerseyUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamJerseyWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamJerseyUpdateWithoutTeamInput, Prisma.TeamJerseyUncheckedUpdateWithoutTeamInput>;
};
export type TeamJerseyUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.TeamJerseyScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamJerseyUpdateManyMutationInput, Prisma.TeamJerseyUncheckedUpdateManyWithoutTeamInput>;
};
export type TeamJerseyScalarWhereInput = {
    AND?: Prisma.TeamJerseyScalarWhereInput | Prisma.TeamJerseyScalarWhereInput[];
    OR?: Prisma.TeamJerseyScalarWhereInput[];
    NOT?: Prisma.TeamJerseyScalarWhereInput | Prisma.TeamJerseyScalarWhereInput[];
    id?: Prisma.IntFilter<"TeamJersey"> | number;
    team_id?: Prisma.IntFilter<"TeamJersey"> | number;
    type?: Prisma.EnumJerseyTypeFilter<"TeamJersey"> | $Enums.JerseyType;
    primary_color?: Prisma.StringFilter<"TeamJersey"> | string;
    secondary_color?: Prisma.StringNullableFilter<"TeamJersey"> | string | null;
};
export type TeamJerseyCreateManyTeamInput = {
    id?: number;
    type: $Enums.JerseyType;
    primary_color: string;
    secondary_color?: string | null;
};
export type TeamJerseyUpdateWithoutTeamInput = {
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TeamJerseyUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TeamJerseyUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumJerseyTypeFieldUpdateOperationsInput | $Enums.JerseyType;
    primary_color?: Prisma.StringFieldUpdateOperationsInput | string;
    secondary_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TeamJerseySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    team_id?: boolean;
    type?: boolean;
    primary_color?: boolean;
    secondary_color?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teamJersey"]>;
export type TeamJerseySelectScalar = {
    id?: boolean;
    team_id?: boolean;
    type?: boolean;
    primary_color?: boolean;
    secondary_color?: boolean;
};
export type TeamJerseyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "team_id" | "type" | "primary_color" | "secondary_color", ExtArgs["result"]["teamJersey"]>;
export type TeamJerseyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
};
export type $TeamJerseyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TeamJersey";
    objects: {
        team: Prisma.$TeamPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        team_id: number;
        type: $Enums.JerseyType;
        primary_color: string;
        secondary_color: string | null;
    }, ExtArgs["result"]["teamJersey"]>;
    composites: {};
};
export type TeamJerseyGetPayload<S extends boolean | null | undefined | TeamJerseyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload, S>;
export type TeamJerseyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamJerseyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamJerseyCountAggregateInputType | true;
};
export interface TeamJerseyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TeamJersey'];
        meta: {
            name: 'TeamJersey';
        };
    };
    /**
     * Find zero or one TeamJersey that matches the filter.
     * @param {TeamJerseyFindUniqueArgs} args - Arguments to find a TeamJersey
     * @example
     * // Get one TeamJersey
     * const teamJersey = await prisma.teamJersey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamJerseyFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamJerseyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one TeamJersey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamJerseyFindUniqueOrThrowArgs} args - Arguments to find a TeamJersey
     * @example
     * // Get one TeamJersey
     * const teamJersey = await prisma.teamJersey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamJerseyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamJerseyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TeamJersey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamJerseyFindFirstArgs} args - Arguments to find a TeamJersey
     * @example
     * // Get one TeamJersey
     * const teamJersey = await prisma.teamJersey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamJerseyFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamJerseyFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TeamJersey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamJerseyFindFirstOrThrowArgs} args - Arguments to find a TeamJersey
     * @example
     * // Get one TeamJersey
     * const teamJersey = await prisma.teamJersey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamJerseyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamJerseyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more TeamJerseys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamJerseyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamJerseys
     * const teamJerseys = await prisma.teamJersey.findMany()
     *
     * // Get first 10 TeamJerseys
     * const teamJerseys = await prisma.teamJersey.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const teamJerseyWithIdOnly = await prisma.teamJersey.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TeamJerseyFindManyArgs>(args?: Prisma.SelectSubset<T, TeamJerseyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a TeamJersey.
     * @param {TeamJerseyCreateArgs} args - Arguments to create a TeamJersey.
     * @example
     * // Create one TeamJersey
     * const TeamJersey = await prisma.teamJersey.create({
     *   data: {
     *     // ... data to create a TeamJersey
     *   }
     * })
     *
     */
    create<T extends TeamJerseyCreateArgs>(args: Prisma.SelectSubset<T, TeamJerseyCreateArgs<ExtArgs>>): Prisma.Prisma__TeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many TeamJerseys.
     * @param {TeamJerseyCreateManyArgs} args - Arguments to create many TeamJerseys.
     * @example
     * // Create many TeamJerseys
     * const teamJersey = await prisma.teamJersey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TeamJerseyCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamJerseyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a TeamJersey.
     * @param {TeamJerseyDeleteArgs} args - Arguments to delete one TeamJersey.
     * @example
     * // Delete one TeamJersey
     * const TeamJersey = await prisma.teamJersey.delete({
     *   where: {
     *     // ... filter to delete one TeamJersey
     *   }
     * })
     *
     */
    delete<T extends TeamJerseyDeleteArgs>(args: Prisma.SelectSubset<T, TeamJerseyDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one TeamJersey.
     * @param {TeamJerseyUpdateArgs} args - Arguments to update one TeamJersey.
     * @example
     * // Update one TeamJersey
     * const teamJersey = await prisma.teamJersey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TeamJerseyUpdateArgs>(args: Prisma.SelectSubset<T, TeamJerseyUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more TeamJerseys.
     * @param {TeamJerseyDeleteManyArgs} args - Arguments to filter TeamJerseys to delete.
     * @example
     * // Delete a few TeamJerseys
     * const { count } = await prisma.teamJersey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TeamJerseyDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamJerseyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more TeamJerseys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamJerseyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamJerseys
     * const teamJersey = await prisma.teamJersey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TeamJerseyUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamJerseyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one TeamJersey.
     * @param {TeamJerseyUpsertArgs} args - Arguments to update or create a TeamJersey.
     * @example
     * // Update or create a TeamJersey
     * const teamJersey = await prisma.teamJersey.upsert({
     *   create: {
     *     // ... data to create a TeamJersey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamJersey we want to update
     *   }
     * })
     */
    upsert<T extends TeamJerseyUpsertArgs>(args: Prisma.SelectSubset<T, TeamJerseyUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamJerseyClient<runtime.Types.Result.GetResult<Prisma.$TeamJerseyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of TeamJerseys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamJerseyCountArgs} args - Arguments to filter TeamJerseys to count.
     * @example
     * // Count the number of TeamJerseys
     * const count = await prisma.teamJersey.count({
     *   where: {
     *     // ... the filter for the TeamJerseys we want to count
     *   }
     * })
    **/
    count<T extends TeamJerseyCountArgs>(args?: Prisma.Subset<T, TeamJerseyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamJerseyCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a TeamJersey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamJerseyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeamJerseyAggregateArgs>(args: Prisma.Subset<T, TeamJerseyAggregateArgs>): Prisma.PrismaPromise<GetTeamJerseyAggregateType<T>>;
    /**
     * Group by TeamJersey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamJerseyGroupByArgs} args - Group by arguments.
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
    groupBy<T extends TeamJerseyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamJerseyGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamJerseyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamJerseyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamJerseyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the TeamJersey model
     */
    readonly fields: TeamJerseyFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for TeamJersey.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__TeamJerseyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the TeamJersey model
 */
export interface TeamJerseyFieldRefs {
    readonly id: Prisma.FieldRef<"TeamJersey", 'Int'>;
    readonly team_id: Prisma.FieldRef<"TeamJersey", 'Int'>;
    readonly type: Prisma.FieldRef<"TeamJersey", 'JerseyType'>;
    readonly primary_color: Prisma.FieldRef<"TeamJersey", 'String'>;
    readonly secondary_color: Prisma.FieldRef<"TeamJersey", 'String'>;
}
/**
 * TeamJersey findUnique
 */
export type TeamJerseyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which TeamJersey to fetch.
     */
    where: Prisma.TeamJerseyWhereUniqueInput;
};
/**
 * TeamJersey findUniqueOrThrow
 */
export type TeamJerseyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which TeamJersey to fetch.
     */
    where: Prisma.TeamJerseyWhereUniqueInput;
};
/**
 * TeamJersey findFirst
 */
export type TeamJerseyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which TeamJersey to fetch.
     */
    where?: Prisma.TeamJerseyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamJerseys to fetch.
     */
    orderBy?: Prisma.TeamJerseyOrderByWithRelationInput | Prisma.TeamJerseyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TeamJerseys.
     */
    cursor?: Prisma.TeamJerseyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamJerseys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamJerseys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamJerseys.
     */
    distinct?: Prisma.TeamJerseyScalarFieldEnum | Prisma.TeamJerseyScalarFieldEnum[];
};
/**
 * TeamJersey findFirstOrThrow
 */
export type TeamJerseyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which TeamJersey to fetch.
     */
    where?: Prisma.TeamJerseyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamJerseys to fetch.
     */
    orderBy?: Prisma.TeamJerseyOrderByWithRelationInput | Prisma.TeamJerseyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TeamJerseys.
     */
    cursor?: Prisma.TeamJerseyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamJerseys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamJerseys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamJerseys.
     */
    distinct?: Prisma.TeamJerseyScalarFieldEnum | Prisma.TeamJerseyScalarFieldEnum[];
};
/**
 * TeamJersey findMany
 */
export type TeamJerseyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter, which TeamJerseys to fetch.
     */
    where?: Prisma.TeamJerseyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamJerseys to fetch.
     */
    orderBy?: Prisma.TeamJerseyOrderByWithRelationInput | Prisma.TeamJerseyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TeamJerseys.
     */
    cursor?: Prisma.TeamJerseyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamJerseys from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamJerseys.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamJerseys.
     */
    distinct?: Prisma.TeamJerseyScalarFieldEnum | Prisma.TeamJerseyScalarFieldEnum[];
};
/**
 * TeamJersey create
 */
export type TeamJerseyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
    /**
     * The data needed to create a TeamJersey.
     */
    data: Prisma.XOR<Prisma.TeamJerseyCreateInput, Prisma.TeamJerseyUncheckedCreateInput>;
};
/**
 * TeamJersey createMany
 */
export type TeamJerseyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamJerseys.
     */
    data: Prisma.TeamJerseyCreateManyInput | Prisma.TeamJerseyCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * TeamJersey update
 */
export type TeamJerseyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
    /**
     * The data needed to update a TeamJersey.
     */
    data: Prisma.XOR<Prisma.TeamJerseyUpdateInput, Prisma.TeamJerseyUncheckedUpdateInput>;
    /**
     * Choose, which TeamJersey to update.
     */
    where: Prisma.TeamJerseyWhereUniqueInput;
};
/**
 * TeamJersey updateMany
 */
export type TeamJerseyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamJerseys.
     */
    data: Prisma.XOR<Prisma.TeamJerseyUpdateManyMutationInput, Prisma.TeamJerseyUncheckedUpdateManyInput>;
    /**
     * Filter which TeamJerseys to update
     */
    where?: Prisma.TeamJerseyWhereInput;
    /**
     * Limit how many TeamJerseys to update.
     */
    limit?: number;
};
/**
 * TeamJersey upsert
 */
export type TeamJerseyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
    /**
     * The filter to search for the TeamJersey to update in case it exists.
     */
    where: Prisma.TeamJerseyWhereUniqueInput;
    /**
     * In case the TeamJersey found by the `where` argument doesn't exist, create a new TeamJersey with this data.
     */
    create: Prisma.XOR<Prisma.TeamJerseyCreateInput, Prisma.TeamJerseyUncheckedCreateInput>;
    /**
     * In case the TeamJersey was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.TeamJerseyUpdateInput, Prisma.TeamJerseyUncheckedUpdateInput>;
};
/**
 * TeamJersey delete
 */
export type TeamJerseyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
    /**
     * Filter which TeamJersey to delete.
     */
    where: Prisma.TeamJerseyWhereUniqueInput;
};
/**
 * TeamJersey deleteMany
 */
export type TeamJerseyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TeamJerseys to delete
     */
    where?: Prisma.TeamJerseyWhereInput;
    /**
     * Limit how many TeamJerseys to delete.
     */
    limit?: number;
};
/**
 * TeamJersey without action
 */
export type TeamJerseyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamJersey
     */
    select?: Prisma.TeamJerseySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamJersey
     */
    omit?: Prisma.TeamJerseyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamJerseyInclude<ExtArgs> | null;
};
//# sourceMappingURL=TeamJersey.d.ts.map