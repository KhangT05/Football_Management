import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model TeamLeader
 *
 */
export type TeamLeaderModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamLeaderPayload>;
export type AggregateTeamLeader = {
    _count: TeamLeaderCountAggregateOutputType | null;
    _avg: TeamLeaderAvgAggregateOutputType | null;
    _sum: TeamLeaderSumAggregateOutputType | null;
    _min: TeamLeaderMinAggregateOutputType | null;
    _max: TeamLeaderMaxAggregateOutputType | null;
};
export type TeamLeaderAvgAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    user_id: number | null;
};
export type TeamLeaderSumAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    user_id: number | null;
};
export type TeamLeaderMinAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    user_id: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
};
export type TeamLeaderMaxAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    user_id: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
};
export type TeamLeaderCountAggregateOutputType = {
    id: number;
    team_id: number;
    user_id: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    _all: number;
};
export type TeamLeaderAvgAggregateInputType = {
    id?: true;
    team_id?: true;
    user_id?: true;
};
export type TeamLeaderSumAggregateInputType = {
    id?: true;
    team_id?: true;
    user_id?: true;
};
export type TeamLeaderMinAggregateInputType = {
    id?: true;
    team_id?: true;
    user_id?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
};
export type TeamLeaderMaxAggregateInputType = {
    id?: true;
    team_id?: true;
    user_id?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
};
export type TeamLeaderCountAggregateInputType = {
    id?: true;
    team_id?: true;
    user_id?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    _all?: true;
};
export type TeamLeaderAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TeamLeader to aggregate.
     */
    where?: Prisma.TeamLeaderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamLeaders to fetch.
     */
    orderBy?: Prisma.TeamLeaderOrderByWithRelationInput | Prisma.TeamLeaderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.TeamLeaderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamLeaders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamLeaders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TeamLeaders
    **/
    _count?: true | TeamLeaderCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: TeamLeaderAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: TeamLeaderSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TeamLeaderMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TeamLeaderMaxAggregateInputType;
};
export type GetTeamLeaderAggregateType<T extends TeamLeaderAggregateArgs> = {
    [P in keyof T & keyof AggregateTeamLeader]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeamLeader[P]> : Prisma.GetScalarType<T[P], AggregateTeamLeader[P]>;
};
export type TeamLeaderGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamLeaderWhereInput;
    orderBy?: Prisma.TeamLeaderOrderByWithAggregationInput | Prisma.TeamLeaderOrderByWithAggregationInput[];
    by: Prisma.TeamLeaderScalarFieldEnum[] | Prisma.TeamLeaderScalarFieldEnum;
    having?: Prisma.TeamLeaderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamLeaderCountAggregateInputType | true;
    _avg?: TeamLeaderAvgAggregateInputType;
    _sum?: TeamLeaderSumAggregateInputType;
    _min?: TeamLeaderMinAggregateInputType;
    _max?: TeamLeaderMaxAggregateInputType;
};
export type TeamLeaderGroupByOutputType = {
    id: number;
    team_id: number;
    user_id: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    _count: TeamLeaderCountAggregateOutputType | null;
    _avg: TeamLeaderAvgAggregateOutputType | null;
    _sum: TeamLeaderSumAggregateOutputType | null;
    _min: TeamLeaderMinAggregateOutputType | null;
    _max: TeamLeaderMaxAggregateOutputType | null;
};
export type GetTeamLeaderGroupByPayload<T extends TeamLeaderGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamLeaderGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamLeaderGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamLeaderGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamLeaderGroupByOutputType[P]>;
}>>;
export type TeamLeaderWhereInput = {
    AND?: Prisma.TeamLeaderWhereInput | Prisma.TeamLeaderWhereInput[];
    OR?: Prisma.TeamLeaderWhereInput[];
    NOT?: Prisma.TeamLeaderWhereInput | Prisma.TeamLeaderWhereInput[];
    id?: Prisma.IntFilter<"TeamLeader"> | number;
    team_id?: Prisma.IntFilter<"TeamLeader"> | number;
    user_id?: Prisma.IntFilter<"TeamLeader"> | number;
    is_active?: Prisma.BoolFilter<"TeamLeader"> | boolean;
    created_at?: Prisma.DateTimeFilter<"TeamLeader"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"TeamLeader"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"TeamLeader"> | Date | string | null;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TeamLeaderOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    team?: Prisma.TeamOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type TeamLeaderWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.TeamLeaderWhereInput | Prisma.TeamLeaderWhereInput[];
    OR?: Prisma.TeamLeaderWhereInput[];
    NOT?: Prisma.TeamLeaderWhereInput | Prisma.TeamLeaderWhereInput[];
    team_id?: Prisma.IntFilter<"TeamLeader"> | number;
    user_id?: Prisma.IntFilter<"TeamLeader"> | number;
    is_active?: Prisma.BoolFilter<"TeamLeader"> | boolean;
    created_at?: Prisma.DateTimeFilter<"TeamLeader"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"TeamLeader"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"TeamLeader"> | Date | string | null;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type TeamLeaderOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TeamLeaderCountOrderByAggregateInput;
    _avg?: Prisma.TeamLeaderAvgOrderByAggregateInput;
    _max?: Prisma.TeamLeaderMaxOrderByAggregateInput;
    _min?: Prisma.TeamLeaderMinOrderByAggregateInput;
    _sum?: Prisma.TeamLeaderSumOrderByAggregateInput;
};
export type TeamLeaderScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamLeaderScalarWhereWithAggregatesInput | Prisma.TeamLeaderScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamLeaderScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamLeaderScalarWhereWithAggregatesInput | Prisma.TeamLeaderScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"TeamLeader"> | number;
    team_id?: Prisma.IntWithAggregatesFilter<"TeamLeader"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"TeamLeader"> | number;
    is_active?: Prisma.BoolWithAggregatesFilter<"TeamLeader"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"TeamLeader"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"TeamLeader"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"TeamLeader"> | Date | string | null;
};
export type TeamLeaderCreateInput = {
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team: Prisma.TeamCreateNestedOneWithoutTeamLeadersInput;
    user: Prisma.UserCreateNestedOneWithoutTeamLeadersInput;
};
export type TeamLeaderUncheckedCreateInput = {
    id?: number;
    team_id: number;
    user_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type TeamLeaderUpdateInput = {
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team?: Prisma.TeamUpdateOneRequiredWithoutTeamLeadersNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutTeamLeadersNestedInput;
};
export type TeamLeaderUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamLeaderCreateManyInput = {
    id?: number;
    team_id: number;
    user_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type TeamLeaderUpdateManyMutationInput = {
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamLeaderUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamLeaderListRelationFilter = {
    every?: Prisma.TeamLeaderWhereInput;
    some?: Prisma.TeamLeaderWhereInput;
    none?: Prisma.TeamLeaderWhereInput;
};
export type TeamLeaderOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TeamLeaderCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type TeamLeaderAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamLeaderMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type TeamLeaderMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type TeamLeaderSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamLeaderCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeamLeaderCreateWithoutUserInput, Prisma.TeamLeaderUncheckedCreateWithoutUserInput> | Prisma.TeamLeaderCreateWithoutUserInput[] | Prisma.TeamLeaderUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamLeaderCreateOrConnectWithoutUserInput | Prisma.TeamLeaderCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TeamLeaderCreateManyUserInputEnvelope;
    connect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
};
export type TeamLeaderUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeamLeaderCreateWithoutUserInput, Prisma.TeamLeaderUncheckedCreateWithoutUserInput> | Prisma.TeamLeaderCreateWithoutUserInput[] | Prisma.TeamLeaderUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamLeaderCreateOrConnectWithoutUserInput | Prisma.TeamLeaderCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TeamLeaderCreateManyUserInputEnvelope;
    connect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
};
export type TeamLeaderUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeamLeaderCreateWithoutUserInput, Prisma.TeamLeaderUncheckedCreateWithoutUserInput> | Prisma.TeamLeaderCreateWithoutUserInput[] | Prisma.TeamLeaderUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamLeaderCreateOrConnectWithoutUserInput | Prisma.TeamLeaderCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TeamLeaderUpsertWithWhereUniqueWithoutUserInput | Prisma.TeamLeaderUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TeamLeaderCreateManyUserInputEnvelope;
    set?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    disconnect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    delete?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    connect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    update?: Prisma.TeamLeaderUpdateWithWhereUniqueWithoutUserInput | Prisma.TeamLeaderUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TeamLeaderUpdateManyWithWhereWithoutUserInput | Prisma.TeamLeaderUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TeamLeaderScalarWhereInput | Prisma.TeamLeaderScalarWhereInput[];
};
export type TeamLeaderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeamLeaderCreateWithoutUserInput, Prisma.TeamLeaderUncheckedCreateWithoutUserInput> | Prisma.TeamLeaderCreateWithoutUserInput[] | Prisma.TeamLeaderUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamLeaderCreateOrConnectWithoutUserInput | Prisma.TeamLeaderCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TeamLeaderUpsertWithWhereUniqueWithoutUserInput | Prisma.TeamLeaderUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TeamLeaderCreateManyUserInputEnvelope;
    set?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    disconnect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    delete?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    connect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    update?: Prisma.TeamLeaderUpdateWithWhereUniqueWithoutUserInput | Prisma.TeamLeaderUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TeamLeaderUpdateManyWithWhereWithoutUserInput | Prisma.TeamLeaderUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TeamLeaderScalarWhereInput | Prisma.TeamLeaderScalarWhereInput[];
};
export type TeamLeaderCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamLeaderCreateWithoutTeamInput, Prisma.TeamLeaderUncheckedCreateWithoutTeamInput> | Prisma.TeamLeaderCreateWithoutTeamInput[] | Prisma.TeamLeaderUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamLeaderCreateOrConnectWithoutTeamInput | Prisma.TeamLeaderCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamLeaderCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
};
export type TeamLeaderUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamLeaderCreateWithoutTeamInput, Prisma.TeamLeaderUncheckedCreateWithoutTeamInput> | Prisma.TeamLeaderCreateWithoutTeamInput[] | Prisma.TeamLeaderUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamLeaderCreateOrConnectWithoutTeamInput | Prisma.TeamLeaderCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamLeaderCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
};
export type TeamLeaderUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamLeaderCreateWithoutTeamInput, Prisma.TeamLeaderUncheckedCreateWithoutTeamInput> | Prisma.TeamLeaderCreateWithoutTeamInput[] | Prisma.TeamLeaderUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamLeaderCreateOrConnectWithoutTeamInput | Prisma.TeamLeaderCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamLeaderUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamLeaderUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamLeaderCreateManyTeamInputEnvelope;
    set?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    disconnect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    delete?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    connect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    update?: Prisma.TeamLeaderUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamLeaderUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamLeaderUpdateManyWithWhereWithoutTeamInput | Prisma.TeamLeaderUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamLeaderScalarWhereInput | Prisma.TeamLeaderScalarWhereInput[];
};
export type TeamLeaderUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamLeaderCreateWithoutTeamInput, Prisma.TeamLeaderUncheckedCreateWithoutTeamInput> | Prisma.TeamLeaderCreateWithoutTeamInput[] | Prisma.TeamLeaderUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamLeaderCreateOrConnectWithoutTeamInput | Prisma.TeamLeaderCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamLeaderUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamLeaderUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamLeaderCreateManyTeamInputEnvelope;
    set?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    disconnect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    delete?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    connect?: Prisma.TeamLeaderWhereUniqueInput | Prisma.TeamLeaderWhereUniqueInput[];
    update?: Prisma.TeamLeaderUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamLeaderUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamLeaderUpdateManyWithWhereWithoutTeamInput | Prisma.TeamLeaderUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamLeaderScalarWhereInput | Prisma.TeamLeaderScalarWhereInput[];
};
export type TeamLeaderCreateWithoutUserInput = {
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team: Prisma.TeamCreateNestedOneWithoutTeamLeadersInput;
};
export type TeamLeaderUncheckedCreateWithoutUserInput = {
    id?: number;
    team_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type TeamLeaderCreateOrConnectWithoutUserInput = {
    where: Prisma.TeamLeaderWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamLeaderCreateWithoutUserInput, Prisma.TeamLeaderUncheckedCreateWithoutUserInput>;
};
export type TeamLeaderCreateManyUserInputEnvelope = {
    data: Prisma.TeamLeaderCreateManyUserInput | Prisma.TeamLeaderCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TeamLeaderUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TeamLeaderWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamLeaderUpdateWithoutUserInput, Prisma.TeamLeaderUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TeamLeaderCreateWithoutUserInput, Prisma.TeamLeaderUncheckedCreateWithoutUserInput>;
};
export type TeamLeaderUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TeamLeaderWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamLeaderUpdateWithoutUserInput, Prisma.TeamLeaderUncheckedUpdateWithoutUserInput>;
};
export type TeamLeaderUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TeamLeaderScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamLeaderUpdateManyMutationInput, Prisma.TeamLeaderUncheckedUpdateManyWithoutUserInput>;
};
export type TeamLeaderScalarWhereInput = {
    AND?: Prisma.TeamLeaderScalarWhereInput | Prisma.TeamLeaderScalarWhereInput[];
    OR?: Prisma.TeamLeaderScalarWhereInput[];
    NOT?: Prisma.TeamLeaderScalarWhereInput | Prisma.TeamLeaderScalarWhereInput[];
    id?: Prisma.IntFilter<"TeamLeader"> | number;
    team_id?: Prisma.IntFilter<"TeamLeader"> | number;
    user_id?: Prisma.IntFilter<"TeamLeader"> | number;
    is_active?: Prisma.BoolFilter<"TeamLeader"> | boolean;
    created_at?: Prisma.DateTimeFilter<"TeamLeader"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"TeamLeader"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"TeamLeader"> | Date | string | null;
};
export type TeamLeaderCreateWithoutTeamInput = {
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutTeamLeadersInput;
};
export type TeamLeaderUncheckedCreateWithoutTeamInput = {
    id?: number;
    user_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type TeamLeaderCreateOrConnectWithoutTeamInput = {
    where: Prisma.TeamLeaderWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamLeaderCreateWithoutTeamInput, Prisma.TeamLeaderUncheckedCreateWithoutTeamInput>;
};
export type TeamLeaderCreateManyTeamInputEnvelope = {
    data: Prisma.TeamLeaderCreateManyTeamInput | Prisma.TeamLeaderCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type TeamLeaderUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamLeaderWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamLeaderUpdateWithoutTeamInput, Prisma.TeamLeaderUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.TeamLeaderCreateWithoutTeamInput, Prisma.TeamLeaderUncheckedCreateWithoutTeamInput>;
};
export type TeamLeaderUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamLeaderWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamLeaderUpdateWithoutTeamInput, Prisma.TeamLeaderUncheckedUpdateWithoutTeamInput>;
};
export type TeamLeaderUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.TeamLeaderScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamLeaderUpdateManyMutationInput, Prisma.TeamLeaderUncheckedUpdateManyWithoutTeamInput>;
};
export type TeamLeaderCreateManyUserInput = {
    id?: number;
    team_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type TeamLeaderUpdateWithoutUserInput = {
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team?: Prisma.TeamUpdateOneRequiredWithoutTeamLeadersNestedInput;
};
export type TeamLeaderUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamLeaderUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamLeaderCreateManyTeamInput = {
    id?: number;
    user_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type TeamLeaderUpdateWithoutTeamInput = {
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutTeamLeadersNestedInput;
};
export type TeamLeaderUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamLeaderUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamLeaderSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    team_id?: boolean;
    user_id?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teamLeader"]>;
export type TeamLeaderSelectScalar = {
    id?: boolean;
    team_id?: boolean;
    user_id?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
};
export type TeamLeaderOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "team_id" | "user_id" | "is_active" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["teamLeader"]>;
export type TeamLeaderInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TeamLeaderPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TeamLeader";
    objects: {
        team: Prisma.$TeamPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        team_id: number;
        user_id: number;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
    }, ExtArgs["result"]["teamLeader"]>;
    composites: {};
};
export type TeamLeaderGetPayload<S extends boolean | null | undefined | TeamLeaderDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload, S>;
export type TeamLeaderCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamLeaderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamLeaderCountAggregateInputType | true;
};
export interface TeamLeaderDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TeamLeader'];
        meta: {
            name: 'TeamLeader';
        };
    };
    /**
     * Find zero or one TeamLeader that matches the filter.
     * @param {TeamLeaderFindUniqueArgs} args - Arguments to find a TeamLeader
     * @example
     * // Get one TeamLeader
     * const teamLeader = await prisma.teamLeader.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamLeaderFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamLeaderFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamLeaderClient<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one TeamLeader that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamLeaderFindUniqueOrThrowArgs} args - Arguments to find a TeamLeader
     * @example
     * // Get one TeamLeader
     * const teamLeader = await prisma.teamLeader.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamLeaderFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamLeaderFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamLeaderClient<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TeamLeader that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamLeaderFindFirstArgs} args - Arguments to find a TeamLeader
     * @example
     * // Get one TeamLeader
     * const teamLeader = await prisma.teamLeader.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamLeaderFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamLeaderFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamLeaderClient<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TeamLeader that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamLeaderFindFirstOrThrowArgs} args - Arguments to find a TeamLeader
     * @example
     * // Get one TeamLeader
     * const teamLeader = await prisma.teamLeader.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamLeaderFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamLeaderFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamLeaderClient<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more TeamLeaders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamLeaderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamLeaders
     * const teamLeaders = await prisma.teamLeader.findMany()
     *
     * // Get first 10 TeamLeaders
     * const teamLeaders = await prisma.teamLeader.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const teamLeaderWithIdOnly = await prisma.teamLeader.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TeamLeaderFindManyArgs>(args?: Prisma.SelectSubset<T, TeamLeaderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a TeamLeader.
     * @param {TeamLeaderCreateArgs} args - Arguments to create a TeamLeader.
     * @example
     * // Create one TeamLeader
     * const TeamLeader = await prisma.teamLeader.create({
     *   data: {
     *     // ... data to create a TeamLeader
     *   }
     * })
     *
     */
    create<T extends TeamLeaderCreateArgs>(args: Prisma.SelectSubset<T, TeamLeaderCreateArgs<ExtArgs>>): Prisma.Prisma__TeamLeaderClient<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many TeamLeaders.
     * @param {TeamLeaderCreateManyArgs} args - Arguments to create many TeamLeaders.
     * @example
     * // Create many TeamLeaders
     * const teamLeader = await prisma.teamLeader.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TeamLeaderCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamLeaderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a TeamLeader.
     * @param {TeamLeaderDeleteArgs} args - Arguments to delete one TeamLeader.
     * @example
     * // Delete one TeamLeader
     * const TeamLeader = await prisma.teamLeader.delete({
     *   where: {
     *     // ... filter to delete one TeamLeader
     *   }
     * })
     *
     */
    delete<T extends TeamLeaderDeleteArgs>(args: Prisma.SelectSubset<T, TeamLeaderDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamLeaderClient<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one TeamLeader.
     * @param {TeamLeaderUpdateArgs} args - Arguments to update one TeamLeader.
     * @example
     * // Update one TeamLeader
     * const teamLeader = await prisma.teamLeader.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TeamLeaderUpdateArgs>(args: Prisma.SelectSubset<T, TeamLeaderUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamLeaderClient<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more TeamLeaders.
     * @param {TeamLeaderDeleteManyArgs} args - Arguments to filter TeamLeaders to delete.
     * @example
     * // Delete a few TeamLeaders
     * const { count } = await prisma.teamLeader.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TeamLeaderDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamLeaderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more TeamLeaders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamLeaderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamLeaders
     * const teamLeader = await prisma.teamLeader.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TeamLeaderUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamLeaderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one TeamLeader.
     * @param {TeamLeaderUpsertArgs} args - Arguments to update or create a TeamLeader.
     * @example
     * // Update or create a TeamLeader
     * const teamLeader = await prisma.teamLeader.upsert({
     *   create: {
     *     // ... data to create a TeamLeader
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamLeader we want to update
     *   }
     * })
     */
    upsert<T extends TeamLeaderUpsertArgs>(args: Prisma.SelectSubset<T, TeamLeaderUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamLeaderClient<runtime.Types.Result.GetResult<Prisma.$TeamLeaderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of TeamLeaders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamLeaderCountArgs} args - Arguments to filter TeamLeaders to count.
     * @example
     * // Count the number of TeamLeaders
     * const count = await prisma.teamLeader.count({
     *   where: {
     *     // ... the filter for the TeamLeaders we want to count
     *   }
     * })
    **/
    count<T extends TeamLeaderCountArgs>(args?: Prisma.Subset<T, TeamLeaderCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamLeaderCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a TeamLeader.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamLeaderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeamLeaderAggregateArgs>(args: Prisma.Subset<T, TeamLeaderAggregateArgs>): Prisma.PrismaPromise<GetTeamLeaderAggregateType<T>>;
    /**
     * Group by TeamLeader.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamLeaderGroupByArgs} args - Group by arguments.
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
    groupBy<T extends TeamLeaderGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamLeaderGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamLeaderGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamLeaderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamLeaderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the TeamLeader model
     */
    readonly fields: TeamLeaderFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for TeamLeader.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__TeamLeaderClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the TeamLeader model
 */
export interface TeamLeaderFieldRefs {
    readonly id: Prisma.FieldRef<"TeamLeader", 'Int'>;
    readonly team_id: Prisma.FieldRef<"TeamLeader", 'Int'>;
    readonly user_id: Prisma.FieldRef<"TeamLeader", 'Int'>;
    readonly is_active: Prisma.FieldRef<"TeamLeader", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"TeamLeader", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"TeamLeader", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"TeamLeader", 'DateTime'>;
}
/**
 * TeamLeader findUnique
 */
export type TeamLeaderFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which TeamLeader to fetch.
     */
    where: Prisma.TeamLeaderWhereUniqueInput;
};
/**
 * TeamLeader findUniqueOrThrow
 */
export type TeamLeaderFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which TeamLeader to fetch.
     */
    where: Prisma.TeamLeaderWhereUniqueInput;
};
/**
 * TeamLeader findFirst
 */
export type TeamLeaderFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which TeamLeader to fetch.
     */
    where?: Prisma.TeamLeaderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamLeaders to fetch.
     */
    orderBy?: Prisma.TeamLeaderOrderByWithRelationInput | Prisma.TeamLeaderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TeamLeaders.
     */
    cursor?: Prisma.TeamLeaderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamLeaders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamLeaders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamLeaders.
     */
    distinct?: Prisma.TeamLeaderScalarFieldEnum | Prisma.TeamLeaderScalarFieldEnum[];
};
/**
 * TeamLeader findFirstOrThrow
 */
export type TeamLeaderFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which TeamLeader to fetch.
     */
    where?: Prisma.TeamLeaderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamLeaders to fetch.
     */
    orderBy?: Prisma.TeamLeaderOrderByWithRelationInput | Prisma.TeamLeaderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TeamLeaders.
     */
    cursor?: Prisma.TeamLeaderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamLeaders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamLeaders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamLeaders.
     */
    distinct?: Prisma.TeamLeaderScalarFieldEnum | Prisma.TeamLeaderScalarFieldEnum[];
};
/**
 * TeamLeader findMany
 */
export type TeamLeaderFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which TeamLeaders to fetch.
     */
    where?: Prisma.TeamLeaderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamLeaders to fetch.
     */
    orderBy?: Prisma.TeamLeaderOrderByWithRelationInput | Prisma.TeamLeaderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TeamLeaders.
     */
    cursor?: Prisma.TeamLeaderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamLeaders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamLeaders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamLeaders.
     */
    distinct?: Prisma.TeamLeaderScalarFieldEnum | Prisma.TeamLeaderScalarFieldEnum[];
};
/**
 * TeamLeader create
 */
export type TeamLeaderCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a TeamLeader.
     */
    data: Prisma.XOR<Prisma.TeamLeaderCreateInput, Prisma.TeamLeaderUncheckedCreateInput>;
};
/**
 * TeamLeader createMany
 */
export type TeamLeaderCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamLeaders.
     */
    data: Prisma.TeamLeaderCreateManyInput | Prisma.TeamLeaderCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * TeamLeader update
 */
export type TeamLeaderUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a TeamLeader.
     */
    data: Prisma.XOR<Prisma.TeamLeaderUpdateInput, Prisma.TeamLeaderUncheckedUpdateInput>;
    /**
     * Choose, which TeamLeader to update.
     */
    where: Prisma.TeamLeaderWhereUniqueInput;
};
/**
 * TeamLeader updateMany
 */
export type TeamLeaderUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamLeaders.
     */
    data: Prisma.XOR<Prisma.TeamLeaderUpdateManyMutationInput, Prisma.TeamLeaderUncheckedUpdateManyInput>;
    /**
     * Filter which TeamLeaders to update
     */
    where?: Prisma.TeamLeaderWhereInput;
    /**
     * Limit how many TeamLeaders to update.
     */
    limit?: number;
};
/**
 * TeamLeader upsert
 */
export type TeamLeaderUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the TeamLeader to update in case it exists.
     */
    where: Prisma.TeamLeaderWhereUniqueInput;
    /**
     * In case the TeamLeader found by the `where` argument doesn't exist, create a new TeamLeader with this data.
     */
    create: Prisma.XOR<Prisma.TeamLeaderCreateInput, Prisma.TeamLeaderUncheckedCreateInput>;
    /**
     * In case the TeamLeader was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.TeamLeaderUpdateInput, Prisma.TeamLeaderUncheckedUpdateInput>;
};
/**
 * TeamLeader delete
 */
export type TeamLeaderDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which TeamLeader to delete.
     */
    where: Prisma.TeamLeaderWhereUniqueInput;
};
/**
 * TeamLeader deleteMany
 */
export type TeamLeaderDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TeamLeaders to delete
     */
    where?: Prisma.TeamLeaderWhereInput;
    /**
     * Limit how many TeamLeaders to delete.
     */
    limit?: number;
};
/**
 * TeamLeader without action
 */
export type TeamLeaderDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=TeamLeader.d.ts.map