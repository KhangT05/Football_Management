import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model SeasonTeam
 *
 */
export type SeasonTeamModel = runtime.Types.Result.DefaultSelection<Prisma.$SeasonTeamPayload>;
export type AggregateSeasonTeam = {
    _count: SeasonTeamCountAggregateOutputType | null;
    _avg: SeasonTeamAvgAggregateOutputType | null;
    _sum: SeasonTeamSumAggregateOutputType | null;
    _min: SeasonTeamMinAggregateOutputType | null;
    _max: SeasonTeamMaxAggregateOutputType | null;
};
export type SeasonTeamAvgAggregateOutputType = {
    id: number | null;
    season_id: number | null;
    team_id: number | null;
    seed: number | null;
    group_id: number | null;
    user_id: number | null;
};
export type SeasonTeamSumAggregateOutputType = {
    id: number | null;
    season_id: number | null;
    team_id: number | null;
    seed: number | null;
    group_id: number | null;
    user_id: number | null;
};
export type SeasonTeamMinAggregateOutputType = {
    id: number | null;
    season_id: number | null;
    team_id: number | null;
    status: $Enums.SeasonTeamStatus | null;
    seed: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    group_id: number | null;
    user_id: number | null;
};
export type SeasonTeamMaxAggregateOutputType = {
    id: number | null;
    season_id: number | null;
    team_id: number | null;
    status: $Enums.SeasonTeamStatus | null;
    seed: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    group_id: number | null;
    user_id: number | null;
};
export type SeasonTeamCountAggregateOutputType = {
    id: number;
    season_id: number;
    team_id: number;
    status: number;
    seed: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    group_id: number;
    user_id: number;
    _all: number;
};
export type SeasonTeamAvgAggregateInputType = {
    id?: true;
    season_id?: true;
    team_id?: true;
    seed?: true;
    group_id?: true;
    user_id?: true;
};
export type SeasonTeamSumAggregateInputType = {
    id?: true;
    season_id?: true;
    team_id?: true;
    seed?: true;
    group_id?: true;
    user_id?: true;
};
export type SeasonTeamMinAggregateInputType = {
    id?: true;
    season_id?: true;
    team_id?: true;
    status?: true;
    seed?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    group_id?: true;
    user_id?: true;
};
export type SeasonTeamMaxAggregateInputType = {
    id?: true;
    season_id?: true;
    team_id?: true;
    status?: true;
    seed?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    group_id?: true;
    user_id?: true;
};
export type SeasonTeamCountAggregateInputType = {
    id?: true;
    season_id?: true;
    team_id?: true;
    status?: true;
    seed?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    group_id?: true;
    user_id?: true;
    _all?: true;
};
export type SeasonTeamAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonTeam to aggregate.
     */
    where?: Prisma.SeasonTeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeams to fetch.
     */
    orderBy?: Prisma.SeasonTeamOrderByWithRelationInput | Prisma.SeasonTeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.SeasonTeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SeasonTeams
    **/
    _count?: true | SeasonTeamCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: SeasonTeamAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: SeasonTeamSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SeasonTeamMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SeasonTeamMaxAggregateInputType;
};
export type GetSeasonTeamAggregateType<T extends SeasonTeamAggregateArgs> = {
    [P in keyof T & keyof AggregateSeasonTeam]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSeasonTeam[P]> : Prisma.GetScalarType<T[P], AggregateSeasonTeam[P]>;
};
export type SeasonTeamGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonTeamWhereInput;
    orderBy?: Prisma.SeasonTeamOrderByWithAggregationInput | Prisma.SeasonTeamOrderByWithAggregationInput[];
    by: Prisma.SeasonTeamScalarFieldEnum[] | Prisma.SeasonTeamScalarFieldEnum;
    having?: Prisma.SeasonTeamScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SeasonTeamCountAggregateInputType | true;
    _avg?: SeasonTeamAvgAggregateInputType;
    _sum?: SeasonTeamSumAggregateInputType;
    _min?: SeasonTeamMinAggregateInputType;
    _max?: SeasonTeamMaxAggregateInputType;
};
export type SeasonTeamGroupByOutputType = {
    id: number;
    season_id: number;
    team_id: number;
    status: $Enums.SeasonTeamStatus;
    seed: number | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    group_id: number | null;
    user_id: number | null;
    _count: SeasonTeamCountAggregateOutputType | null;
    _avg: SeasonTeamAvgAggregateOutputType | null;
    _sum: SeasonTeamSumAggregateOutputType | null;
    _min: SeasonTeamMinAggregateOutputType | null;
    _max: SeasonTeamMaxAggregateOutputType | null;
};
export type GetSeasonTeamGroupByPayload<T extends SeasonTeamGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SeasonTeamGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SeasonTeamGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SeasonTeamGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SeasonTeamGroupByOutputType[P]>;
}>>;
export type SeasonTeamWhereInput = {
    AND?: Prisma.SeasonTeamWhereInput | Prisma.SeasonTeamWhereInput[];
    OR?: Prisma.SeasonTeamWhereInput[];
    NOT?: Prisma.SeasonTeamWhereInput | Prisma.SeasonTeamWhereInput[];
    id?: Prisma.IntFilter<"SeasonTeam"> | number;
    season_id?: Prisma.IntFilter<"SeasonTeam"> | number;
    team_id?: Prisma.IntFilter<"SeasonTeam"> | number;
    status?: Prisma.EnumSeasonTeamStatusFilter<"SeasonTeam"> | $Enums.SeasonTeamStatus;
    seed?: Prisma.IntNullableFilter<"SeasonTeam"> | number | null;
    is_active?: Prisma.BoolFilter<"SeasonTeam"> | boolean;
    created_at?: Prisma.DateTimeFilter<"SeasonTeam"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"SeasonTeam"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"SeasonTeam"> | Date | string | null;
    group_id?: Prisma.IntNullableFilter<"SeasonTeam"> | number | null;
    user_id?: Prisma.IntNullableFilter<"SeasonTeam"> | number | null;
    jerseys?: Prisma.SeasonTeamJerseyListRelationFilter;
    season?: Prisma.XOR<Prisma.SeasonScalarRelationFilter, Prisma.SeasonWhereInput>;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    group?: Prisma.XOR<Prisma.GroupNullableScalarRelationFilter, Prisma.GroupWhereInput> | null;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    payments?: Prisma.PaymentListRelationFilter;
};
export type SeasonTeamOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    seed?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    group_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    jerseys?: Prisma.SeasonTeamJerseyOrderByRelationAggregateInput;
    season?: Prisma.SeasonOrderByWithRelationInput;
    team?: Prisma.TeamOrderByWithRelationInput;
    group?: Prisma.GroupOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    payments?: Prisma.PaymentOrderByRelationAggregateInput;
};
export type SeasonTeamWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    season_id_team_id?: Prisma.SeasonTeamSeason_idTeam_idCompoundUniqueInput;
    AND?: Prisma.SeasonTeamWhereInput | Prisma.SeasonTeamWhereInput[];
    OR?: Prisma.SeasonTeamWhereInput[];
    NOT?: Prisma.SeasonTeamWhereInput | Prisma.SeasonTeamWhereInput[];
    season_id?: Prisma.IntFilter<"SeasonTeam"> | number;
    team_id?: Prisma.IntFilter<"SeasonTeam"> | number;
    status?: Prisma.EnumSeasonTeamStatusFilter<"SeasonTeam"> | $Enums.SeasonTeamStatus;
    seed?: Prisma.IntNullableFilter<"SeasonTeam"> | number | null;
    is_active?: Prisma.BoolFilter<"SeasonTeam"> | boolean;
    created_at?: Prisma.DateTimeFilter<"SeasonTeam"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"SeasonTeam"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"SeasonTeam"> | Date | string | null;
    group_id?: Prisma.IntNullableFilter<"SeasonTeam"> | number | null;
    user_id?: Prisma.IntNullableFilter<"SeasonTeam"> | number | null;
    jerseys?: Prisma.SeasonTeamJerseyListRelationFilter;
    season?: Prisma.XOR<Prisma.SeasonScalarRelationFilter, Prisma.SeasonWhereInput>;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    group?: Prisma.XOR<Prisma.GroupNullableScalarRelationFilter, Prisma.GroupWhereInput> | null;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    payments?: Prisma.PaymentListRelationFilter;
}, "id" | "season_id_team_id">;
export type SeasonTeamOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    seed?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    group_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.SeasonTeamCountOrderByAggregateInput;
    _avg?: Prisma.SeasonTeamAvgOrderByAggregateInput;
    _max?: Prisma.SeasonTeamMaxOrderByAggregateInput;
    _min?: Prisma.SeasonTeamMinOrderByAggregateInput;
    _sum?: Prisma.SeasonTeamSumOrderByAggregateInput;
};
export type SeasonTeamScalarWhereWithAggregatesInput = {
    AND?: Prisma.SeasonTeamScalarWhereWithAggregatesInput | Prisma.SeasonTeamScalarWhereWithAggregatesInput[];
    OR?: Prisma.SeasonTeamScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SeasonTeamScalarWhereWithAggregatesInput | Prisma.SeasonTeamScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"SeasonTeam"> | number;
    season_id?: Prisma.IntWithAggregatesFilter<"SeasonTeam"> | number;
    team_id?: Prisma.IntWithAggregatesFilter<"SeasonTeam"> | number;
    status?: Prisma.EnumSeasonTeamStatusWithAggregatesFilter<"SeasonTeam"> | $Enums.SeasonTeamStatus;
    seed?: Prisma.IntNullableWithAggregatesFilter<"SeasonTeam"> | number | null;
    is_active?: Prisma.BoolWithAggregatesFilter<"SeasonTeam"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"SeasonTeam"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"SeasonTeam"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"SeasonTeam"> | Date | string | null;
    group_id?: Prisma.IntNullableWithAggregatesFilter<"SeasonTeam"> | number | null;
    user_id?: Prisma.IntNullableWithAggregatesFilter<"SeasonTeam"> | number | null;
};
export type SeasonTeamCreateInput = {
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyCreateNestedManyWithoutSeason_teamInput;
    season: Prisma.SeasonCreateNestedOneWithoutSeason_teamsInput;
    team: Prisma.TeamCreateNestedOneWithoutSeason_teamsInput;
    group?: Prisma.GroupCreateNestedOneWithoutSeason_teamsInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonTeamsInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamUncheckedCreateInput = {
    id?: number;
    season_id: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
    user_id?: number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedCreateNestedManyWithoutSeason_teamInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamUpdateInput = {
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyUpdateManyWithoutSeason_teamNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutSeason_teamsNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutSeason_teamsNestedInput;
    group?: Prisma.GroupUpdateOneWithoutSeason_teamsNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonTeamsNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedUpdateManyWithoutSeason_teamNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamCreateManyInput = {
    id?: number;
    season_id: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
    user_id?: number | null;
};
export type SeasonTeamUpdateManyMutationInput = {
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type SeasonTeamUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type SeasonTeamListRelationFilter = {
    every?: Prisma.SeasonTeamWhereInput;
    some?: Prisma.SeasonTeamWhereInput;
    none?: Prisma.SeasonTeamWhereInput;
};
export type SeasonTeamOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SeasonTeamSeason_idTeam_idCompoundUniqueInput = {
    season_id: number;
    team_id: number;
};
export type SeasonTeamCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    seed?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonTeamAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    seed?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonTeamMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    seed?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonTeamMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    seed?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonTeamSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    seed?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonTeamScalarRelationFilter = {
    is?: Prisma.SeasonTeamWhereInput;
    isNot?: Prisma.SeasonTeamWhereInput;
};
export type SeasonTeamCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutUserInput, Prisma.SeasonTeamUncheckedCreateWithoutUserInput> | Prisma.SeasonTeamCreateWithoutUserInput[] | Prisma.SeasonTeamUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutUserInput | Prisma.SeasonTeamCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SeasonTeamCreateManyUserInputEnvelope;
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
};
export type SeasonTeamUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutUserInput, Prisma.SeasonTeamUncheckedCreateWithoutUserInput> | Prisma.SeasonTeamCreateWithoutUserInput[] | Prisma.SeasonTeamUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutUserInput | Prisma.SeasonTeamCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SeasonTeamCreateManyUserInputEnvelope;
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
};
export type SeasonTeamUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutUserInput, Prisma.SeasonTeamUncheckedCreateWithoutUserInput> | Prisma.SeasonTeamCreateWithoutUserInput[] | Prisma.SeasonTeamUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutUserInput | Prisma.SeasonTeamCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SeasonTeamUpsertWithWhereUniqueWithoutUserInput | Prisma.SeasonTeamUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SeasonTeamCreateManyUserInputEnvelope;
    set?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    delete?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    update?: Prisma.SeasonTeamUpdateWithWhereUniqueWithoutUserInput | Prisma.SeasonTeamUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SeasonTeamUpdateManyWithWhereWithoutUserInput | Prisma.SeasonTeamUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
};
export type SeasonTeamUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutUserInput, Prisma.SeasonTeamUncheckedCreateWithoutUserInput> | Prisma.SeasonTeamCreateWithoutUserInput[] | Prisma.SeasonTeamUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutUserInput | Prisma.SeasonTeamCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SeasonTeamUpsertWithWhereUniqueWithoutUserInput | Prisma.SeasonTeamUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SeasonTeamCreateManyUserInputEnvelope;
    set?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    delete?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    update?: Prisma.SeasonTeamUpdateWithWhereUniqueWithoutUserInput | Prisma.SeasonTeamUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SeasonTeamUpdateManyWithWhereWithoutUserInput | Prisma.SeasonTeamUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
};
export type SeasonTeamCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutSeasonInput, Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput> | Prisma.SeasonTeamCreateWithoutSeasonInput[] | Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutSeasonInput | Prisma.SeasonTeamCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.SeasonTeamCreateManySeasonInputEnvelope;
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
};
export type SeasonTeamUncheckedCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutSeasonInput, Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput> | Prisma.SeasonTeamCreateWithoutSeasonInput[] | Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutSeasonInput | Prisma.SeasonTeamCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.SeasonTeamCreateManySeasonInputEnvelope;
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
};
export type SeasonTeamUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutSeasonInput, Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput> | Prisma.SeasonTeamCreateWithoutSeasonInput[] | Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutSeasonInput | Prisma.SeasonTeamCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.SeasonTeamUpsertWithWhereUniqueWithoutSeasonInput | Prisma.SeasonTeamUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.SeasonTeamCreateManySeasonInputEnvelope;
    set?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    delete?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    update?: Prisma.SeasonTeamUpdateWithWhereUniqueWithoutSeasonInput | Prisma.SeasonTeamUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.SeasonTeamUpdateManyWithWhereWithoutSeasonInput | Prisma.SeasonTeamUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
};
export type SeasonTeamUncheckedUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutSeasonInput, Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput> | Prisma.SeasonTeamCreateWithoutSeasonInput[] | Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutSeasonInput | Prisma.SeasonTeamCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.SeasonTeamUpsertWithWhereUniqueWithoutSeasonInput | Prisma.SeasonTeamUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.SeasonTeamCreateManySeasonInputEnvelope;
    set?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    delete?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    update?: Prisma.SeasonTeamUpdateWithWhereUniqueWithoutSeasonInput | Prisma.SeasonTeamUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.SeasonTeamUpdateManyWithWhereWithoutSeasonInput | Prisma.SeasonTeamUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
};
export type SeasonTeamCreateNestedManyWithoutGroupInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutGroupInput, Prisma.SeasonTeamUncheckedCreateWithoutGroupInput> | Prisma.SeasonTeamCreateWithoutGroupInput[] | Prisma.SeasonTeamUncheckedCreateWithoutGroupInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutGroupInput | Prisma.SeasonTeamCreateOrConnectWithoutGroupInput[];
    createMany?: Prisma.SeasonTeamCreateManyGroupInputEnvelope;
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
};
export type SeasonTeamUncheckedCreateNestedManyWithoutGroupInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutGroupInput, Prisma.SeasonTeamUncheckedCreateWithoutGroupInput> | Prisma.SeasonTeamCreateWithoutGroupInput[] | Prisma.SeasonTeamUncheckedCreateWithoutGroupInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutGroupInput | Prisma.SeasonTeamCreateOrConnectWithoutGroupInput[];
    createMany?: Prisma.SeasonTeamCreateManyGroupInputEnvelope;
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
};
export type SeasonTeamUpdateManyWithoutGroupNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutGroupInput, Prisma.SeasonTeamUncheckedCreateWithoutGroupInput> | Prisma.SeasonTeamCreateWithoutGroupInput[] | Prisma.SeasonTeamUncheckedCreateWithoutGroupInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutGroupInput | Prisma.SeasonTeamCreateOrConnectWithoutGroupInput[];
    upsert?: Prisma.SeasonTeamUpsertWithWhereUniqueWithoutGroupInput | Prisma.SeasonTeamUpsertWithWhereUniqueWithoutGroupInput[];
    createMany?: Prisma.SeasonTeamCreateManyGroupInputEnvelope;
    set?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    delete?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    update?: Prisma.SeasonTeamUpdateWithWhereUniqueWithoutGroupInput | Prisma.SeasonTeamUpdateWithWhereUniqueWithoutGroupInput[];
    updateMany?: Prisma.SeasonTeamUpdateManyWithWhereWithoutGroupInput | Prisma.SeasonTeamUpdateManyWithWhereWithoutGroupInput[];
    deleteMany?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
};
export type SeasonTeamUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutGroupInput, Prisma.SeasonTeamUncheckedCreateWithoutGroupInput> | Prisma.SeasonTeamCreateWithoutGroupInput[] | Prisma.SeasonTeamUncheckedCreateWithoutGroupInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutGroupInput | Prisma.SeasonTeamCreateOrConnectWithoutGroupInput[];
    upsert?: Prisma.SeasonTeamUpsertWithWhereUniqueWithoutGroupInput | Prisma.SeasonTeamUpsertWithWhereUniqueWithoutGroupInput[];
    createMany?: Prisma.SeasonTeamCreateManyGroupInputEnvelope;
    set?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    delete?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    update?: Prisma.SeasonTeamUpdateWithWhereUniqueWithoutGroupInput | Prisma.SeasonTeamUpdateWithWhereUniqueWithoutGroupInput[];
    updateMany?: Prisma.SeasonTeamUpdateManyWithWhereWithoutGroupInput | Prisma.SeasonTeamUpdateManyWithWhereWithoutGroupInput[];
    deleteMany?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
};
export type SeasonTeamCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutTeamInput, Prisma.SeasonTeamUncheckedCreateWithoutTeamInput> | Prisma.SeasonTeamCreateWithoutTeamInput[] | Prisma.SeasonTeamUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutTeamInput | Prisma.SeasonTeamCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.SeasonTeamCreateManyTeamInputEnvelope;
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
};
export type SeasonTeamUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutTeamInput, Prisma.SeasonTeamUncheckedCreateWithoutTeamInput> | Prisma.SeasonTeamCreateWithoutTeamInput[] | Prisma.SeasonTeamUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutTeamInput | Prisma.SeasonTeamCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.SeasonTeamCreateManyTeamInputEnvelope;
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
};
export type SeasonTeamUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutTeamInput, Prisma.SeasonTeamUncheckedCreateWithoutTeamInput> | Prisma.SeasonTeamCreateWithoutTeamInput[] | Prisma.SeasonTeamUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutTeamInput | Prisma.SeasonTeamCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.SeasonTeamUpsertWithWhereUniqueWithoutTeamInput | Prisma.SeasonTeamUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.SeasonTeamCreateManyTeamInputEnvelope;
    set?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    delete?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    update?: Prisma.SeasonTeamUpdateWithWhereUniqueWithoutTeamInput | Prisma.SeasonTeamUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.SeasonTeamUpdateManyWithWhereWithoutTeamInput | Prisma.SeasonTeamUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
};
export type SeasonTeamUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutTeamInput, Prisma.SeasonTeamUncheckedCreateWithoutTeamInput> | Prisma.SeasonTeamCreateWithoutTeamInput[] | Prisma.SeasonTeamUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutTeamInput | Prisma.SeasonTeamCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.SeasonTeamUpsertWithWhereUniqueWithoutTeamInput | Prisma.SeasonTeamUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.SeasonTeamCreateManyTeamInputEnvelope;
    set?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    delete?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    connect?: Prisma.SeasonTeamWhereUniqueInput | Prisma.SeasonTeamWhereUniqueInput[];
    update?: Prisma.SeasonTeamUpdateWithWhereUniqueWithoutTeamInput | Prisma.SeasonTeamUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.SeasonTeamUpdateManyWithWhereWithoutTeamInput | Prisma.SeasonTeamUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
};
export type EnumSeasonTeamStatusFieldUpdateOperationsInput = {
    set?: $Enums.SeasonTeamStatus;
};
export type SeasonTeamCreateNestedOneWithoutJerseysInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutJerseysInput, Prisma.SeasonTeamUncheckedCreateWithoutJerseysInput>;
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutJerseysInput;
    connect?: Prisma.SeasonTeamWhereUniqueInput;
};
export type SeasonTeamUpdateOneRequiredWithoutJerseysNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutJerseysInput, Prisma.SeasonTeamUncheckedCreateWithoutJerseysInput>;
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutJerseysInput;
    upsert?: Prisma.SeasonTeamUpsertWithoutJerseysInput;
    connect?: Prisma.SeasonTeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SeasonTeamUpdateToOneWithWhereWithoutJerseysInput, Prisma.SeasonTeamUpdateWithoutJerseysInput>, Prisma.SeasonTeamUncheckedUpdateWithoutJerseysInput>;
};
export type SeasonTeamCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutPaymentsInput, Prisma.SeasonTeamUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.SeasonTeamWhereUniqueInput;
};
export type SeasonTeamUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamCreateWithoutPaymentsInput, Prisma.SeasonTeamUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.SeasonTeamCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.SeasonTeamUpsertWithoutPaymentsInput;
    connect?: Prisma.SeasonTeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SeasonTeamUpdateToOneWithWhereWithoutPaymentsInput, Prisma.SeasonTeamUpdateWithoutPaymentsInput>, Prisma.SeasonTeamUncheckedUpdateWithoutPaymentsInput>;
};
export type SeasonTeamCreateWithoutUserInput = {
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyCreateNestedManyWithoutSeason_teamInput;
    season: Prisma.SeasonCreateNestedOneWithoutSeason_teamsInput;
    team: Prisma.TeamCreateNestedOneWithoutSeason_teamsInput;
    group?: Prisma.GroupCreateNestedOneWithoutSeason_teamsInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamUncheckedCreateWithoutUserInput = {
    id?: number;
    season_id: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedCreateNestedManyWithoutSeason_teamInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamCreateOrConnectWithoutUserInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutUserInput, Prisma.SeasonTeamUncheckedCreateWithoutUserInput>;
};
export type SeasonTeamCreateManyUserInputEnvelope = {
    data: Prisma.SeasonTeamCreateManyUserInput | Prisma.SeasonTeamCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SeasonTeamUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutUserInput, Prisma.SeasonTeamUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutUserInput, Prisma.SeasonTeamUncheckedCreateWithoutUserInput>;
};
export type SeasonTeamUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutUserInput, Prisma.SeasonTeamUncheckedUpdateWithoutUserInput>;
};
export type SeasonTeamUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SeasonTeamScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateManyMutationInput, Prisma.SeasonTeamUncheckedUpdateManyWithoutUserInput>;
};
export type SeasonTeamScalarWhereInput = {
    AND?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
    OR?: Prisma.SeasonTeamScalarWhereInput[];
    NOT?: Prisma.SeasonTeamScalarWhereInput | Prisma.SeasonTeamScalarWhereInput[];
    id?: Prisma.IntFilter<"SeasonTeam"> | number;
    season_id?: Prisma.IntFilter<"SeasonTeam"> | number;
    team_id?: Prisma.IntFilter<"SeasonTeam"> | number;
    status?: Prisma.EnumSeasonTeamStatusFilter<"SeasonTeam"> | $Enums.SeasonTeamStatus;
    seed?: Prisma.IntNullableFilter<"SeasonTeam"> | number | null;
    is_active?: Prisma.BoolFilter<"SeasonTeam"> | boolean;
    created_at?: Prisma.DateTimeFilter<"SeasonTeam"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"SeasonTeam"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"SeasonTeam"> | Date | string | null;
    group_id?: Prisma.IntNullableFilter<"SeasonTeam"> | number | null;
    user_id?: Prisma.IntNullableFilter<"SeasonTeam"> | number | null;
};
export type SeasonTeamCreateWithoutSeasonInput = {
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyCreateNestedManyWithoutSeason_teamInput;
    team: Prisma.TeamCreateNestedOneWithoutSeason_teamsInput;
    group?: Prisma.GroupCreateNestedOneWithoutSeason_teamsInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonTeamsInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamUncheckedCreateWithoutSeasonInput = {
    id?: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
    user_id?: number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedCreateNestedManyWithoutSeason_teamInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamCreateOrConnectWithoutSeasonInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutSeasonInput, Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput>;
};
export type SeasonTeamCreateManySeasonInputEnvelope = {
    data: Prisma.SeasonTeamCreateManySeasonInput | Prisma.SeasonTeamCreateManySeasonInput[];
    skipDuplicates?: boolean;
};
export type SeasonTeamUpsertWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutSeasonInput, Prisma.SeasonTeamUncheckedUpdateWithoutSeasonInput>;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutSeasonInput, Prisma.SeasonTeamUncheckedCreateWithoutSeasonInput>;
};
export type SeasonTeamUpdateWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutSeasonInput, Prisma.SeasonTeamUncheckedUpdateWithoutSeasonInput>;
};
export type SeasonTeamUpdateManyWithWhereWithoutSeasonInput = {
    where: Prisma.SeasonTeamScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateManyMutationInput, Prisma.SeasonTeamUncheckedUpdateManyWithoutSeasonInput>;
};
export type SeasonTeamCreateWithoutGroupInput = {
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyCreateNestedManyWithoutSeason_teamInput;
    season: Prisma.SeasonCreateNestedOneWithoutSeason_teamsInput;
    team: Prisma.TeamCreateNestedOneWithoutSeason_teamsInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonTeamsInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamUncheckedCreateWithoutGroupInput = {
    id?: number;
    season_id: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedCreateNestedManyWithoutSeason_teamInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamCreateOrConnectWithoutGroupInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutGroupInput, Prisma.SeasonTeamUncheckedCreateWithoutGroupInput>;
};
export type SeasonTeamCreateManyGroupInputEnvelope = {
    data: Prisma.SeasonTeamCreateManyGroupInput | Prisma.SeasonTeamCreateManyGroupInput[];
    skipDuplicates?: boolean;
};
export type SeasonTeamUpsertWithWhereUniqueWithoutGroupInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutGroupInput, Prisma.SeasonTeamUncheckedUpdateWithoutGroupInput>;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutGroupInput, Prisma.SeasonTeamUncheckedCreateWithoutGroupInput>;
};
export type SeasonTeamUpdateWithWhereUniqueWithoutGroupInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutGroupInput, Prisma.SeasonTeamUncheckedUpdateWithoutGroupInput>;
};
export type SeasonTeamUpdateManyWithWhereWithoutGroupInput = {
    where: Prisma.SeasonTeamScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateManyMutationInput, Prisma.SeasonTeamUncheckedUpdateManyWithoutGroupInput>;
};
export type SeasonTeamCreateWithoutTeamInput = {
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyCreateNestedManyWithoutSeason_teamInput;
    season: Prisma.SeasonCreateNestedOneWithoutSeason_teamsInput;
    group?: Prisma.GroupCreateNestedOneWithoutSeason_teamsInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonTeamsInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamUncheckedCreateWithoutTeamInput = {
    id?: number;
    season_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
    user_id?: number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedCreateNestedManyWithoutSeason_teamInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamCreateOrConnectWithoutTeamInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutTeamInput, Prisma.SeasonTeamUncheckedCreateWithoutTeamInput>;
};
export type SeasonTeamCreateManyTeamInputEnvelope = {
    data: Prisma.SeasonTeamCreateManyTeamInput | Prisma.SeasonTeamCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type SeasonTeamUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutTeamInput, Prisma.SeasonTeamUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutTeamInput, Prisma.SeasonTeamUncheckedCreateWithoutTeamInput>;
};
export type SeasonTeamUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutTeamInput, Prisma.SeasonTeamUncheckedUpdateWithoutTeamInput>;
};
export type SeasonTeamUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.SeasonTeamScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateManyMutationInput, Prisma.SeasonTeamUncheckedUpdateManyWithoutTeamInput>;
};
export type SeasonTeamCreateWithoutJerseysInput = {
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    season: Prisma.SeasonCreateNestedOneWithoutSeason_teamsInput;
    team: Prisma.TeamCreateNestedOneWithoutSeason_teamsInput;
    group?: Prisma.GroupCreateNestedOneWithoutSeason_teamsInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonTeamsInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamUncheckedCreateWithoutJerseysInput = {
    id?: number;
    season_id: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
    user_id?: number | null;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamCreateOrConnectWithoutJerseysInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutJerseysInput, Prisma.SeasonTeamUncheckedCreateWithoutJerseysInput>;
};
export type SeasonTeamUpsertWithoutJerseysInput = {
    update: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutJerseysInput, Prisma.SeasonTeamUncheckedUpdateWithoutJerseysInput>;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutJerseysInput, Prisma.SeasonTeamUncheckedCreateWithoutJerseysInput>;
    where?: Prisma.SeasonTeamWhereInput;
};
export type SeasonTeamUpdateToOneWithWhereWithoutJerseysInput = {
    where?: Prisma.SeasonTeamWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutJerseysInput, Prisma.SeasonTeamUncheckedUpdateWithoutJerseysInput>;
};
export type SeasonTeamUpdateWithoutJerseysInput = {
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    season?: Prisma.SeasonUpdateOneRequiredWithoutSeason_teamsNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutSeason_teamsNestedInput;
    group?: Prisma.GroupUpdateOneWithoutSeason_teamsNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonTeamsNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateWithoutJerseysInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamCreateWithoutPaymentsInput = {
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyCreateNestedManyWithoutSeason_teamInput;
    season: Prisma.SeasonCreateNestedOneWithoutSeason_teamsInput;
    team: Prisma.TeamCreateNestedOneWithoutSeason_teamsInput;
    group?: Prisma.GroupCreateNestedOneWithoutSeason_teamsInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonTeamsInput;
};
export type SeasonTeamUncheckedCreateWithoutPaymentsInput = {
    id?: number;
    season_id: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
    user_id?: number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedCreateNestedManyWithoutSeason_teamInput;
};
export type SeasonTeamCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.SeasonTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutPaymentsInput, Prisma.SeasonTeamUncheckedCreateWithoutPaymentsInput>;
};
export type SeasonTeamUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutPaymentsInput, Prisma.SeasonTeamUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.SeasonTeamCreateWithoutPaymentsInput, Prisma.SeasonTeamUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.SeasonTeamWhereInput;
};
export type SeasonTeamUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.SeasonTeamWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamUpdateWithoutPaymentsInput, Prisma.SeasonTeamUncheckedUpdateWithoutPaymentsInput>;
};
export type SeasonTeamUpdateWithoutPaymentsInput = {
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyUpdateManyWithoutSeason_teamNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutSeason_teamsNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutSeason_teamsNestedInput;
    group?: Prisma.GroupUpdateOneWithoutSeason_teamsNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonTeamsNestedInput;
};
export type SeasonTeamUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamCreateManyUserInput = {
    id?: number;
    season_id: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
};
export type SeasonTeamUpdateWithoutUserInput = {
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyUpdateManyWithoutSeason_teamNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutSeason_teamsNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutSeason_teamsNestedInput;
    group?: Prisma.GroupUpdateOneWithoutSeason_teamsNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedUpdateManyWithoutSeason_teamNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type SeasonTeamCreateManySeasonInput = {
    id?: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
    user_id?: number | null;
};
export type SeasonTeamUpdateWithoutSeasonInput = {
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyUpdateManyWithoutSeason_teamNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutSeason_teamsNestedInput;
    group?: Prisma.GroupUpdateOneWithoutSeason_teamsNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonTeamsNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedUpdateManyWithoutSeason_teamNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateManyWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type SeasonTeamCreateManyGroupInput = {
    id?: number;
    season_id: number;
    team_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
};
export type SeasonTeamUpdateWithoutGroupInput = {
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyUpdateManyWithoutSeason_teamNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutSeason_teamsNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutSeason_teamsNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonTeamsNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateWithoutGroupInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedUpdateManyWithoutSeason_teamNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateManyWithoutGroupInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type SeasonTeamCreateManyTeamInput = {
    id?: number;
    season_id: number;
    status?: $Enums.SeasonTeamStatus;
    seed?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    group_id?: number | null;
    user_id?: number | null;
};
export type SeasonTeamUpdateWithoutTeamInput = {
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    jerseys?: Prisma.SeasonTeamJerseyUpdateManyWithoutSeason_teamNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutSeason_teamsNestedInput;
    group?: Prisma.GroupUpdateOneWithoutSeason_teamsNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonTeamsNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    jerseys?: Prisma.SeasonTeamJerseyUncheckedUpdateManyWithoutSeason_teamNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSeason_teamNestedInput;
};
export type SeasonTeamUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSeasonTeamStatusFieldUpdateOperationsInput | $Enums.SeasonTeamStatus;
    seed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
/**
 * Count Type SeasonTeamCountOutputType
 */
export type SeasonTeamCountOutputType = {
    jerseys: number;
    payments: number;
};
export type SeasonTeamCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    jerseys?: boolean | SeasonTeamCountOutputTypeCountJerseysArgs;
    payments?: boolean | SeasonTeamCountOutputTypeCountPaymentsArgs;
};
/**
 * SeasonTeamCountOutputType without action
 */
export type SeasonTeamCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamCountOutputType
     */
    select?: Prisma.SeasonTeamCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * SeasonTeamCountOutputType without action
 */
export type SeasonTeamCountOutputTypeCountJerseysArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonTeamJerseyWhereInput;
};
/**
 * SeasonTeamCountOutputType without action
 */
export type SeasonTeamCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentWhereInput;
};
export type SeasonTeamSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    season_id?: boolean;
    team_id?: boolean;
    status?: boolean;
    seed?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    group_id?: boolean;
    user_id?: boolean;
    jerseys?: boolean | Prisma.SeasonTeam$jerseysArgs<ExtArgs>;
    season?: boolean | Prisma.SeasonDefaultArgs<ExtArgs>;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    group?: boolean | Prisma.SeasonTeam$groupArgs<ExtArgs>;
    user?: boolean | Prisma.SeasonTeam$userArgs<ExtArgs>;
    payments?: boolean | Prisma.SeasonTeam$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.SeasonTeamCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["seasonTeam"]>;
export type SeasonTeamSelectScalar = {
    id?: boolean;
    season_id?: boolean;
    team_id?: boolean;
    status?: boolean;
    seed?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    group_id?: boolean;
    user_id?: boolean;
};
export type SeasonTeamOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "season_id" | "team_id" | "status" | "seed" | "is_active" | "created_at" | "updated_at" | "deleted_at" | "group_id" | "user_id", ExtArgs["result"]["seasonTeam"]>;
export type SeasonTeamInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    jerseys?: boolean | Prisma.SeasonTeam$jerseysArgs<ExtArgs>;
    season?: boolean | Prisma.SeasonDefaultArgs<ExtArgs>;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    group?: boolean | Prisma.SeasonTeam$groupArgs<ExtArgs>;
    user?: boolean | Prisma.SeasonTeam$userArgs<ExtArgs>;
    payments?: boolean | Prisma.SeasonTeam$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.SeasonTeamCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $SeasonTeamPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SeasonTeam";
    objects: {
        jerseys: Prisma.$SeasonTeamJerseyPayload<ExtArgs>[];
        season: Prisma.$SeasonPayload<ExtArgs>;
        team: Prisma.$TeamPayload<ExtArgs>;
        group: Prisma.$GroupPayload<ExtArgs> | null;
        user: Prisma.$UserPayload<ExtArgs> | null;
        payments: Prisma.$PaymentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        season_id: number;
        team_id: number;
        status: $Enums.SeasonTeamStatus;
        seed: number | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        group_id: number | null;
        user_id: number | null;
    }, ExtArgs["result"]["seasonTeam"]>;
    composites: {};
};
export type SeasonTeamGetPayload<S extends boolean | null | undefined | SeasonTeamDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload, S>;
export type SeasonTeamCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SeasonTeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SeasonTeamCountAggregateInputType | true;
};
export interface SeasonTeamDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SeasonTeam'];
        meta: {
            name: 'SeasonTeam';
        };
    };
    /**
     * Find zero or one SeasonTeam that matches the filter.
     * @param {SeasonTeamFindUniqueArgs} args - Arguments to find a SeasonTeam
     * @example
     * // Get one SeasonTeam
     * const seasonTeam = await prisma.seasonTeam.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeasonTeamFindUniqueArgs>(args: Prisma.SelectSubset<T, SeasonTeamFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one SeasonTeam that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeasonTeamFindUniqueOrThrowArgs} args - Arguments to find a SeasonTeam
     * @example
     * // Get one SeasonTeam
     * const seasonTeam = await prisma.seasonTeam.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeasonTeamFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SeasonTeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SeasonTeam that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamFindFirstArgs} args - Arguments to find a SeasonTeam
     * @example
     * // Get one SeasonTeam
     * const seasonTeam = await prisma.seasonTeam.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeasonTeamFindFirstArgs>(args?: Prisma.SelectSubset<T, SeasonTeamFindFirstArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SeasonTeam that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamFindFirstOrThrowArgs} args - Arguments to find a SeasonTeam
     * @example
     * // Get one SeasonTeam
     * const seasonTeam = await prisma.seasonTeam.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeasonTeamFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SeasonTeamFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more SeasonTeams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeasonTeams
     * const seasonTeams = await prisma.seasonTeam.findMany()
     *
     * // Get first 10 SeasonTeams
     * const seasonTeams = await prisma.seasonTeam.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const seasonTeamWithIdOnly = await prisma.seasonTeam.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SeasonTeamFindManyArgs>(args?: Prisma.SelectSubset<T, SeasonTeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a SeasonTeam.
     * @param {SeasonTeamCreateArgs} args - Arguments to create a SeasonTeam.
     * @example
     * // Create one SeasonTeam
     * const SeasonTeam = await prisma.seasonTeam.create({
     *   data: {
     *     // ... data to create a SeasonTeam
     *   }
     * })
     *
     */
    create<T extends SeasonTeamCreateArgs>(args: Prisma.SelectSubset<T, SeasonTeamCreateArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many SeasonTeams.
     * @param {SeasonTeamCreateManyArgs} args - Arguments to create many SeasonTeams.
     * @example
     * // Create many SeasonTeams
     * const seasonTeam = await prisma.seasonTeam.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SeasonTeamCreateManyArgs>(args?: Prisma.SelectSubset<T, SeasonTeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a SeasonTeam.
     * @param {SeasonTeamDeleteArgs} args - Arguments to delete one SeasonTeam.
     * @example
     * // Delete one SeasonTeam
     * const SeasonTeam = await prisma.seasonTeam.delete({
     *   where: {
     *     // ... filter to delete one SeasonTeam
     *   }
     * })
     *
     */
    delete<T extends SeasonTeamDeleteArgs>(args: Prisma.SelectSubset<T, SeasonTeamDeleteArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one SeasonTeam.
     * @param {SeasonTeamUpdateArgs} args - Arguments to update one SeasonTeam.
     * @example
     * // Update one SeasonTeam
     * const seasonTeam = await prisma.seasonTeam.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SeasonTeamUpdateArgs>(args: Prisma.SelectSubset<T, SeasonTeamUpdateArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more SeasonTeams.
     * @param {SeasonTeamDeleteManyArgs} args - Arguments to filter SeasonTeams to delete.
     * @example
     * // Delete a few SeasonTeams
     * const { count } = await prisma.seasonTeam.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SeasonTeamDeleteManyArgs>(args?: Prisma.SelectSubset<T, SeasonTeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more SeasonTeams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeasonTeams
     * const seasonTeam = await prisma.seasonTeam.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SeasonTeamUpdateManyArgs>(args: Prisma.SelectSubset<T, SeasonTeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one SeasonTeam.
     * @param {SeasonTeamUpsertArgs} args - Arguments to update or create a SeasonTeam.
     * @example
     * // Update or create a SeasonTeam
     * const seasonTeam = await prisma.seasonTeam.upsert({
     *   create: {
     *     // ... data to create a SeasonTeam
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeasonTeam we want to update
     *   }
     * })
     */
    upsert<T extends SeasonTeamUpsertArgs>(args: Prisma.SelectSubset<T, SeasonTeamUpsertArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of SeasonTeams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamCountArgs} args - Arguments to filter SeasonTeams to count.
     * @example
     * // Count the number of SeasonTeams
     * const count = await prisma.seasonTeam.count({
     *   where: {
     *     // ... the filter for the SeasonTeams we want to count
     *   }
     * })
    **/
    count<T extends SeasonTeamCountArgs>(args?: Prisma.Subset<T, SeasonTeamCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SeasonTeamCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a SeasonTeam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SeasonTeamAggregateArgs>(args: Prisma.Subset<T, SeasonTeamAggregateArgs>): Prisma.PrismaPromise<GetSeasonTeamAggregateType<T>>;
    /**
     * Group by SeasonTeam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamGroupByArgs} args - Group by arguments.
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
    groupBy<T extends SeasonTeamGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SeasonTeamGroupByArgs['orderBy'];
    } : {
        orderBy?: SeasonTeamGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SeasonTeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeasonTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the SeasonTeam model
     */
    readonly fields: SeasonTeamFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for SeasonTeam.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__SeasonTeamClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    jerseys<T extends Prisma.SeasonTeam$jerseysArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonTeam$jerseysArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonTeamJerseyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    season<T extends Prisma.SeasonDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonDefaultArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    group<T extends Prisma.SeasonTeam$groupArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonTeam$groupArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.SeasonTeam$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonTeam$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    payments<T extends Prisma.SeasonTeam$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonTeam$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the SeasonTeam model
 */
export interface SeasonTeamFieldRefs {
    readonly id: Prisma.FieldRef<"SeasonTeam", 'Int'>;
    readonly season_id: Prisma.FieldRef<"SeasonTeam", 'Int'>;
    readonly team_id: Prisma.FieldRef<"SeasonTeam", 'Int'>;
    readonly status: Prisma.FieldRef<"SeasonTeam", 'SeasonTeamStatus'>;
    readonly seed: Prisma.FieldRef<"SeasonTeam", 'Int'>;
    readonly is_active: Prisma.FieldRef<"SeasonTeam", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"SeasonTeam", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"SeasonTeam", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"SeasonTeam", 'DateTime'>;
    readonly group_id: Prisma.FieldRef<"SeasonTeam", 'Int'>;
    readonly user_id: Prisma.FieldRef<"SeasonTeam", 'Int'>;
}
/**
 * SeasonTeam findUnique
 */
export type SeasonTeamFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which SeasonTeam to fetch.
     */
    where: Prisma.SeasonTeamWhereUniqueInput;
};
/**
 * SeasonTeam findUniqueOrThrow
 */
export type SeasonTeamFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which SeasonTeam to fetch.
     */
    where: Prisma.SeasonTeamWhereUniqueInput;
};
/**
 * SeasonTeam findFirst
 */
export type SeasonTeamFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which SeasonTeam to fetch.
     */
    where?: Prisma.SeasonTeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeams to fetch.
     */
    orderBy?: Prisma.SeasonTeamOrderByWithRelationInput | Prisma.SeasonTeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeasonTeams.
     */
    cursor?: Prisma.SeasonTeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonTeams.
     */
    distinct?: Prisma.SeasonTeamScalarFieldEnum | Prisma.SeasonTeamScalarFieldEnum[];
};
/**
 * SeasonTeam findFirstOrThrow
 */
export type SeasonTeamFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which SeasonTeam to fetch.
     */
    where?: Prisma.SeasonTeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeams to fetch.
     */
    orderBy?: Prisma.SeasonTeamOrderByWithRelationInput | Prisma.SeasonTeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeasonTeams.
     */
    cursor?: Prisma.SeasonTeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonTeams.
     */
    distinct?: Prisma.SeasonTeamScalarFieldEnum | Prisma.SeasonTeamScalarFieldEnum[];
};
/**
 * SeasonTeam findMany
 */
export type SeasonTeamFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which SeasonTeams to fetch.
     */
    where?: Prisma.SeasonTeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeams to fetch.
     */
    orderBy?: Prisma.SeasonTeamOrderByWithRelationInput | Prisma.SeasonTeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SeasonTeams.
     */
    cursor?: Prisma.SeasonTeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonTeams.
     */
    distinct?: Prisma.SeasonTeamScalarFieldEnum | Prisma.SeasonTeamScalarFieldEnum[];
};
/**
 * SeasonTeam create
 */
export type SeasonTeamCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a SeasonTeam.
     */
    data: Prisma.XOR<Prisma.SeasonTeamCreateInput, Prisma.SeasonTeamUncheckedCreateInput>;
};
/**
 * SeasonTeam createMany
 */
export type SeasonTeamCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeasonTeams.
     */
    data: Prisma.SeasonTeamCreateManyInput | Prisma.SeasonTeamCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * SeasonTeam update
 */
export type SeasonTeamUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a SeasonTeam.
     */
    data: Prisma.XOR<Prisma.SeasonTeamUpdateInput, Prisma.SeasonTeamUncheckedUpdateInput>;
    /**
     * Choose, which SeasonTeam to update.
     */
    where: Prisma.SeasonTeamWhereUniqueInput;
};
/**
 * SeasonTeam updateMany
 */
export type SeasonTeamUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update SeasonTeams.
     */
    data: Prisma.XOR<Prisma.SeasonTeamUpdateManyMutationInput, Prisma.SeasonTeamUncheckedUpdateManyInput>;
    /**
     * Filter which SeasonTeams to update
     */
    where?: Prisma.SeasonTeamWhereInput;
    /**
     * Limit how many SeasonTeams to update.
     */
    limit?: number;
};
/**
 * SeasonTeam upsert
 */
export type SeasonTeamUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the SeasonTeam to update in case it exists.
     */
    where: Prisma.SeasonTeamWhereUniqueInput;
    /**
     * In case the SeasonTeam found by the `where` argument doesn't exist, create a new SeasonTeam with this data.
     */
    create: Prisma.XOR<Prisma.SeasonTeamCreateInput, Prisma.SeasonTeamUncheckedCreateInput>;
    /**
     * In case the SeasonTeam was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.SeasonTeamUpdateInput, Prisma.SeasonTeamUncheckedUpdateInput>;
};
/**
 * SeasonTeam delete
 */
export type SeasonTeamDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which SeasonTeam to delete.
     */
    where: Prisma.SeasonTeamWhereUniqueInput;
};
/**
 * SeasonTeam deleteMany
 */
export type SeasonTeamDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonTeams to delete
     */
    where?: Prisma.SeasonTeamWhereInput;
    /**
     * Limit how many SeasonTeams to delete.
     */
    limit?: number;
};
/**
 * SeasonTeam.jerseys
 */
export type SeasonTeam$jerseysArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.SeasonTeamJerseyWhereInput;
    orderBy?: Prisma.SeasonTeamJerseyOrderByWithRelationInput | Prisma.SeasonTeamJerseyOrderByWithRelationInput[];
    cursor?: Prisma.SeasonTeamJerseyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SeasonTeamJerseyScalarFieldEnum | Prisma.SeasonTeamJerseyScalarFieldEnum[];
};
/**
 * SeasonTeam.group
 */
export type SeasonTeam$groupArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.GroupWhereInput;
};
/**
 * SeasonTeam.user
 */
export type SeasonTeam$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * SeasonTeam.payments
 */
export type SeasonTeam$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: Prisma.PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: Prisma.PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentInclude<ExtArgs> | null;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput | Prisma.PaymentOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentScalarFieldEnum | Prisma.PaymentScalarFieldEnum[];
};
/**
 * SeasonTeam without action
 */
export type SeasonTeamDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=SeasonTeam.d.ts.map