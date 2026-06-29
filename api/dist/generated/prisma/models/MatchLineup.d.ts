import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MatchLineup
 *
 */
export type MatchLineupModel = runtime.Types.Result.DefaultSelection<Prisma.$MatchLineupPayload>;
export type AggregateMatchLineup = {
    _count: MatchLineupCountAggregateOutputType | null;
    _avg: MatchLineupAvgAggregateOutputType | null;
    _sum: MatchLineupSumAggregateOutputType | null;
    _min: MatchLineupMinAggregateOutputType | null;
    _max: MatchLineupMaxAggregateOutputType | null;
};
export type MatchLineupAvgAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    team_id: number | null;
    player_id: number | null;
    minute_in: number | null;
    minute_out: number | null;
};
export type MatchLineupSumAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    team_id: number | null;
    player_id: number | null;
    minute_in: number | null;
    minute_out: number | null;
};
export type MatchLineupMinAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    team_id: number | null;
    player_id: number | null;
    position: $Enums.PlayerPosition | null;
    lineup_type: $Enums.LineupType | null;
    is_captain: boolean | null;
    minute_in: number | null;
    minute_out: number | null;
    status: $Enums.MatchPlayerStatus | null;
    created_at: Date | null;
};
export type MatchLineupMaxAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    team_id: number | null;
    player_id: number | null;
    position: $Enums.PlayerPosition | null;
    lineup_type: $Enums.LineupType | null;
    is_captain: boolean | null;
    minute_in: number | null;
    minute_out: number | null;
    status: $Enums.MatchPlayerStatus | null;
    created_at: Date | null;
};
export type MatchLineupCountAggregateOutputType = {
    id: number;
    match_id: number;
    team_id: number;
    player_id: number;
    position: number;
    lineup_type: number;
    is_captain: number;
    minute_in: number;
    minute_out: number;
    status: number;
    created_at: number;
    _all: number;
};
export type MatchLineupAvgAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    player_id?: true;
    minute_in?: true;
    minute_out?: true;
};
export type MatchLineupSumAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    player_id?: true;
    minute_in?: true;
    minute_out?: true;
};
export type MatchLineupMinAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    player_id?: true;
    position?: true;
    lineup_type?: true;
    is_captain?: true;
    minute_in?: true;
    minute_out?: true;
    status?: true;
    created_at?: true;
};
export type MatchLineupMaxAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    player_id?: true;
    position?: true;
    lineup_type?: true;
    is_captain?: true;
    minute_in?: true;
    minute_out?: true;
    status?: true;
    created_at?: true;
};
export type MatchLineupCountAggregateInputType = {
    id?: true;
    match_id?: true;
    team_id?: true;
    player_id?: true;
    position?: true;
    lineup_type?: true;
    is_captain?: true;
    minute_in?: true;
    minute_out?: true;
    status?: true;
    created_at?: true;
    _all?: true;
};
export type MatchLineupAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MatchLineup to aggregate.
     */
    where?: Prisma.MatchLineupWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchLineups to fetch.
     */
    orderBy?: Prisma.MatchLineupOrderByWithRelationInput | Prisma.MatchLineupOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MatchLineupWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchLineups from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchLineups.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MatchLineups
    **/
    _count?: true | MatchLineupCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MatchLineupAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MatchLineupSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MatchLineupMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MatchLineupMaxAggregateInputType;
};
export type GetMatchLineupAggregateType<T extends MatchLineupAggregateArgs> = {
    [P in keyof T & keyof AggregateMatchLineup]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMatchLineup[P]> : Prisma.GetScalarType<T[P], AggregateMatchLineup[P]>;
};
export type MatchLineupGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchLineupWhereInput;
    orderBy?: Prisma.MatchLineupOrderByWithAggregationInput | Prisma.MatchLineupOrderByWithAggregationInput[];
    by: Prisma.MatchLineupScalarFieldEnum[] | Prisma.MatchLineupScalarFieldEnum;
    having?: Prisma.MatchLineupScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MatchLineupCountAggregateInputType | true;
    _avg?: MatchLineupAvgAggregateInputType;
    _sum?: MatchLineupSumAggregateInputType;
    _min?: MatchLineupMinAggregateInputType;
    _max?: MatchLineupMaxAggregateInputType;
};
export type MatchLineupGroupByOutputType = {
    id: number;
    match_id: number;
    team_id: number;
    player_id: number;
    position: $Enums.PlayerPosition;
    lineup_type: $Enums.LineupType;
    is_captain: boolean;
    minute_in: number | null;
    minute_out: number | null;
    status: $Enums.MatchPlayerStatus;
    created_at: Date;
    _count: MatchLineupCountAggregateOutputType | null;
    _avg: MatchLineupAvgAggregateOutputType | null;
    _sum: MatchLineupSumAggregateOutputType | null;
    _min: MatchLineupMinAggregateOutputType | null;
    _max: MatchLineupMaxAggregateOutputType | null;
};
export type GetMatchLineupGroupByPayload<T extends MatchLineupGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MatchLineupGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MatchLineupGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MatchLineupGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MatchLineupGroupByOutputType[P]>;
}>>;
export type MatchLineupWhereInput = {
    AND?: Prisma.MatchLineupWhereInput | Prisma.MatchLineupWhereInput[];
    OR?: Prisma.MatchLineupWhereInput[];
    NOT?: Prisma.MatchLineupWhereInput | Prisma.MatchLineupWhereInput[];
    id?: Prisma.IntFilter<"MatchLineup"> | number;
    match_id?: Prisma.IntFilter<"MatchLineup"> | number;
    team_id?: Prisma.IntFilter<"MatchLineup"> | number;
    player_id?: Prisma.IntFilter<"MatchLineup"> | number;
    position?: Prisma.EnumPlayerPositionFilter<"MatchLineup"> | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFilter<"MatchLineup"> | $Enums.LineupType;
    is_captain?: Prisma.BoolFilter<"MatchLineup"> | boolean;
    minute_in?: Prisma.IntNullableFilter<"MatchLineup"> | number | null;
    minute_out?: Prisma.IntNullableFilter<"MatchLineup"> | number | null;
    status?: Prisma.EnumMatchPlayerStatusFilter<"MatchLineup"> | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFilter<"MatchLineup"> | Date | string;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
};
export type MatchLineupOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    lineup_type?: Prisma.SortOrder;
    is_captain?: Prisma.SortOrder;
    minute_in?: Prisma.SortOrderInput | Prisma.SortOrder;
    minute_out?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    match?: Prisma.MatchOrderByWithRelationInput;
    team?: Prisma.TeamOrderByWithRelationInput;
    player?: Prisma.PlayerOrderByWithRelationInput;
};
export type MatchLineupWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    match_id_player_id?: Prisma.MatchLineupMatch_idPlayer_idCompoundUniqueInput;
    AND?: Prisma.MatchLineupWhereInput | Prisma.MatchLineupWhereInput[];
    OR?: Prisma.MatchLineupWhereInput[];
    NOT?: Prisma.MatchLineupWhereInput | Prisma.MatchLineupWhereInput[];
    match_id?: Prisma.IntFilter<"MatchLineup"> | number;
    team_id?: Prisma.IntFilter<"MatchLineup"> | number;
    player_id?: Prisma.IntFilter<"MatchLineup"> | number;
    position?: Prisma.EnumPlayerPositionFilter<"MatchLineup"> | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFilter<"MatchLineup"> | $Enums.LineupType;
    is_captain?: Prisma.BoolFilter<"MatchLineup"> | boolean;
    minute_in?: Prisma.IntNullableFilter<"MatchLineup"> | number | null;
    minute_out?: Prisma.IntNullableFilter<"MatchLineup"> | number | null;
    status?: Prisma.EnumMatchPlayerStatusFilter<"MatchLineup"> | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFilter<"MatchLineup"> | Date | string;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
}, "id" | "match_id_player_id">;
export type MatchLineupOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    lineup_type?: Prisma.SortOrder;
    is_captain?: Prisma.SortOrder;
    minute_in?: Prisma.SortOrderInput | Prisma.SortOrder;
    minute_out?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.MatchLineupCountOrderByAggregateInput;
    _avg?: Prisma.MatchLineupAvgOrderByAggregateInput;
    _max?: Prisma.MatchLineupMaxOrderByAggregateInput;
    _min?: Prisma.MatchLineupMinOrderByAggregateInput;
    _sum?: Prisma.MatchLineupSumOrderByAggregateInput;
};
export type MatchLineupScalarWhereWithAggregatesInput = {
    AND?: Prisma.MatchLineupScalarWhereWithAggregatesInput | Prisma.MatchLineupScalarWhereWithAggregatesInput[];
    OR?: Prisma.MatchLineupScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MatchLineupScalarWhereWithAggregatesInput | Prisma.MatchLineupScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"MatchLineup"> | number;
    match_id?: Prisma.IntWithAggregatesFilter<"MatchLineup"> | number;
    team_id?: Prisma.IntWithAggregatesFilter<"MatchLineup"> | number;
    player_id?: Prisma.IntWithAggregatesFilter<"MatchLineup"> | number;
    position?: Prisma.EnumPlayerPositionWithAggregatesFilter<"MatchLineup"> | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeWithAggregatesFilter<"MatchLineup"> | $Enums.LineupType;
    is_captain?: Prisma.BoolWithAggregatesFilter<"MatchLineup"> | boolean;
    minute_in?: Prisma.IntNullableWithAggregatesFilter<"MatchLineup"> | number | null;
    minute_out?: Prisma.IntNullableWithAggregatesFilter<"MatchLineup"> | number | null;
    status?: Prisma.EnumMatchPlayerStatusWithAggregatesFilter<"MatchLineup"> | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"MatchLineup"> | Date | string;
};
export type MatchLineupCreateInput = {
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
    match: Prisma.MatchCreateNestedOneWithoutMatchLineupsInput;
    team: Prisma.TeamCreateNestedOneWithoutMatchLineupsInput;
    player: Prisma.PlayerCreateNestedOneWithoutMatchLineupsInput;
};
export type MatchLineupUncheckedCreateInput = {
    id?: number;
    match_id: number;
    team_id: number;
    player_id: number;
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
};
export type MatchLineupUpdateInput = {
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    match?: Prisma.MatchUpdateOneRequiredWithoutMatchLineupsNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutMatchLineupsNestedInput;
    player?: Prisma.PlayerUpdateOneRequiredWithoutMatchLineupsNestedInput;
};
export type MatchLineupUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchLineupCreateManyInput = {
    id?: number;
    match_id: number;
    team_id: number;
    player_id: number;
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
};
export type MatchLineupUpdateManyMutationInput = {
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchLineupUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchLineupListRelationFilter = {
    every?: Prisma.MatchLineupWhereInput;
    some?: Prisma.MatchLineupWhereInput;
    none?: Prisma.MatchLineupWhereInput;
};
export type MatchLineupOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MatchLineupMatch_idPlayer_idCompoundUniqueInput = {
    match_id: number;
    player_id: number;
};
export type MatchLineupCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    lineup_type?: Prisma.SortOrder;
    is_captain?: Prisma.SortOrder;
    minute_in?: Prisma.SortOrder;
    minute_out?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type MatchLineupAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    minute_in?: Prisma.SortOrder;
    minute_out?: Prisma.SortOrder;
};
export type MatchLineupMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    lineup_type?: Prisma.SortOrder;
    is_captain?: Prisma.SortOrder;
    minute_in?: Prisma.SortOrder;
    minute_out?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type MatchLineupMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    lineup_type?: Prisma.SortOrder;
    is_captain?: Prisma.SortOrder;
    minute_in?: Prisma.SortOrder;
    minute_out?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type MatchLineupSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    minute_in?: Prisma.SortOrder;
    minute_out?: Prisma.SortOrder;
};
export type MatchLineupCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutTeamInput, Prisma.MatchLineupUncheckedCreateWithoutTeamInput> | Prisma.MatchLineupCreateWithoutTeamInput[] | Prisma.MatchLineupUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutTeamInput | Prisma.MatchLineupCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MatchLineupCreateManyTeamInputEnvelope;
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
};
export type MatchLineupUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutTeamInput, Prisma.MatchLineupUncheckedCreateWithoutTeamInput> | Prisma.MatchLineupCreateWithoutTeamInput[] | Prisma.MatchLineupUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutTeamInput | Prisma.MatchLineupCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MatchLineupCreateManyTeamInputEnvelope;
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
};
export type MatchLineupUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutTeamInput, Prisma.MatchLineupUncheckedCreateWithoutTeamInput> | Prisma.MatchLineupCreateWithoutTeamInput[] | Prisma.MatchLineupUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutTeamInput | Prisma.MatchLineupCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MatchLineupUpsertWithWhereUniqueWithoutTeamInput | Prisma.MatchLineupUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MatchLineupCreateManyTeamInputEnvelope;
    set?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    disconnect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    delete?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    update?: Prisma.MatchLineupUpdateWithWhereUniqueWithoutTeamInput | Prisma.MatchLineupUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MatchLineupUpdateManyWithWhereWithoutTeamInput | Prisma.MatchLineupUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MatchLineupScalarWhereInput | Prisma.MatchLineupScalarWhereInput[];
};
export type MatchLineupUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutTeamInput, Prisma.MatchLineupUncheckedCreateWithoutTeamInput> | Prisma.MatchLineupCreateWithoutTeamInput[] | Prisma.MatchLineupUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutTeamInput | Prisma.MatchLineupCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MatchLineupUpsertWithWhereUniqueWithoutTeamInput | Prisma.MatchLineupUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MatchLineupCreateManyTeamInputEnvelope;
    set?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    disconnect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    delete?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    update?: Prisma.MatchLineupUpdateWithWhereUniqueWithoutTeamInput | Prisma.MatchLineupUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MatchLineupUpdateManyWithWhereWithoutTeamInput | Prisma.MatchLineupUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MatchLineupScalarWhereInput | Prisma.MatchLineupScalarWhereInput[];
};
export type MatchLineupCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutPlayerInput, Prisma.MatchLineupUncheckedCreateWithoutPlayerInput> | Prisma.MatchLineupCreateWithoutPlayerInput[] | Prisma.MatchLineupUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutPlayerInput | Prisma.MatchLineupCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.MatchLineupCreateManyPlayerInputEnvelope;
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
};
export type MatchLineupUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutPlayerInput, Prisma.MatchLineupUncheckedCreateWithoutPlayerInput> | Prisma.MatchLineupCreateWithoutPlayerInput[] | Prisma.MatchLineupUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutPlayerInput | Prisma.MatchLineupCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.MatchLineupCreateManyPlayerInputEnvelope;
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
};
export type MatchLineupUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutPlayerInput, Prisma.MatchLineupUncheckedCreateWithoutPlayerInput> | Prisma.MatchLineupCreateWithoutPlayerInput[] | Prisma.MatchLineupUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutPlayerInput | Prisma.MatchLineupCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.MatchLineupUpsertWithWhereUniqueWithoutPlayerInput | Prisma.MatchLineupUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.MatchLineupCreateManyPlayerInputEnvelope;
    set?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    disconnect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    delete?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    update?: Prisma.MatchLineupUpdateWithWhereUniqueWithoutPlayerInput | Prisma.MatchLineupUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.MatchLineupUpdateManyWithWhereWithoutPlayerInput | Prisma.MatchLineupUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.MatchLineupScalarWhereInput | Prisma.MatchLineupScalarWhereInput[];
};
export type MatchLineupUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutPlayerInput, Prisma.MatchLineupUncheckedCreateWithoutPlayerInput> | Prisma.MatchLineupCreateWithoutPlayerInput[] | Prisma.MatchLineupUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutPlayerInput | Prisma.MatchLineupCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.MatchLineupUpsertWithWhereUniqueWithoutPlayerInput | Prisma.MatchLineupUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.MatchLineupCreateManyPlayerInputEnvelope;
    set?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    disconnect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    delete?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    update?: Prisma.MatchLineupUpdateWithWhereUniqueWithoutPlayerInput | Prisma.MatchLineupUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.MatchLineupUpdateManyWithWhereWithoutPlayerInput | Prisma.MatchLineupUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.MatchLineupScalarWhereInput | Prisma.MatchLineupScalarWhereInput[];
};
export type EnumLineupTypeFieldUpdateOperationsInput = {
    set?: $Enums.LineupType;
};
export type EnumMatchPlayerStatusFieldUpdateOperationsInput = {
    set?: $Enums.MatchPlayerStatus;
};
export type MatchLineupCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutMatchInput, Prisma.MatchLineupUncheckedCreateWithoutMatchInput> | Prisma.MatchLineupCreateWithoutMatchInput[] | Prisma.MatchLineupUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutMatchInput | Prisma.MatchLineupCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.MatchLineupCreateManyMatchInputEnvelope;
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
};
export type MatchLineupUncheckedCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutMatchInput, Prisma.MatchLineupUncheckedCreateWithoutMatchInput> | Prisma.MatchLineupCreateWithoutMatchInput[] | Prisma.MatchLineupUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutMatchInput | Prisma.MatchLineupCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.MatchLineupCreateManyMatchInputEnvelope;
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
};
export type MatchLineupUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutMatchInput, Prisma.MatchLineupUncheckedCreateWithoutMatchInput> | Prisma.MatchLineupCreateWithoutMatchInput[] | Prisma.MatchLineupUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutMatchInput | Prisma.MatchLineupCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.MatchLineupUpsertWithWhereUniqueWithoutMatchInput | Prisma.MatchLineupUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.MatchLineupCreateManyMatchInputEnvelope;
    set?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    disconnect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    delete?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    update?: Prisma.MatchLineupUpdateWithWhereUniqueWithoutMatchInput | Prisma.MatchLineupUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.MatchLineupUpdateManyWithWhereWithoutMatchInput | Prisma.MatchLineupUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.MatchLineupScalarWhereInput | Prisma.MatchLineupScalarWhereInput[];
};
export type MatchLineupUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchLineupCreateWithoutMatchInput, Prisma.MatchLineupUncheckedCreateWithoutMatchInput> | Prisma.MatchLineupCreateWithoutMatchInput[] | Prisma.MatchLineupUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchLineupCreateOrConnectWithoutMatchInput | Prisma.MatchLineupCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.MatchLineupUpsertWithWhereUniqueWithoutMatchInput | Prisma.MatchLineupUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.MatchLineupCreateManyMatchInputEnvelope;
    set?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    disconnect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    delete?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    connect?: Prisma.MatchLineupWhereUniqueInput | Prisma.MatchLineupWhereUniqueInput[];
    update?: Prisma.MatchLineupUpdateWithWhereUniqueWithoutMatchInput | Prisma.MatchLineupUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.MatchLineupUpdateManyWithWhereWithoutMatchInput | Prisma.MatchLineupUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.MatchLineupScalarWhereInput | Prisma.MatchLineupScalarWhereInput[];
};
export type MatchLineupCreateWithoutTeamInput = {
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
    match: Prisma.MatchCreateNestedOneWithoutMatchLineupsInput;
    player: Prisma.PlayerCreateNestedOneWithoutMatchLineupsInput;
};
export type MatchLineupUncheckedCreateWithoutTeamInput = {
    id?: number;
    match_id: number;
    player_id: number;
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
};
export type MatchLineupCreateOrConnectWithoutTeamInput = {
    where: Prisma.MatchLineupWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchLineupCreateWithoutTeamInput, Prisma.MatchLineupUncheckedCreateWithoutTeamInput>;
};
export type MatchLineupCreateManyTeamInputEnvelope = {
    data: Prisma.MatchLineupCreateManyTeamInput | Prisma.MatchLineupCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type MatchLineupUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MatchLineupWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchLineupUpdateWithoutTeamInput, Prisma.MatchLineupUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.MatchLineupCreateWithoutTeamInput, Prisma.MatchLineupUncheckedCreateWithoutTeamInput>;
};
export type MatchLineupUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MatchLineupWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchLineupUpdateWithoutTeamInput, Prisma.MatchLineupUncheckedUpdateWithoutTeamInput>;
};
export type MatchLineupUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.MatchLineupScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchLineupUpdateManyMutationInput, Prisma.MatchLineupUncheckedUpdateManyWithoutTeamInput>;
};
export type MatchLineupScalarWhereInput = {
    AND?: Prisma.MatchLineupScalarWhereInput | Prisma.MatchLineupScalarWhereInput[];
    OR?: Prisma.MatchLineupScalarWhereInput[];
    NOT?: Prisma.MatchLineupScalarWhereInput | Prisma.MatchLineupScalarWhereInput[];
    id?: Prisma.IntFilter<"MatchLineup"> | number;
    match_id?: Prisma.IntFilter<"MatchLineup"> | number;
    team_id?: Prisma.IntFilter<"MatchLineup"> | number;
    player_id?: Prisma.IntFilter<"MatchLineup"> | number;
    position?: Prisma.EnumPlayerPositionFilter<"MatchLineup"> | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFilter<"MatchLineup"> | $Enums.LineupType;
    is_captain?: Prisma.BoolFilter<"MatchLineup"> | boolean;
    minute_in?: Prisma.IntNullableFilter<"MatchLineup"> | number | null;
    minute_out?: Prisma.IntNullableFilter<"MatchLineup"> | number | null;
    status?: Prisma.EnumMatchPlayerStatusFilter<"MatchLineup"> | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFilter<"MatchLineup"> | Date | string;
};
export type MatchLineupCreateWithoutPlayerInput = {
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
    match: Prisma.MatchCreateNestedOneWithoutMatchLineupsInput;
    team: Prisma.TeamCreateNestedOneWithoutMatchLineupsInput;
};
export type MatchLineupUncheckedCreateWithoutPlayerInput = {
    id?: number;
    match_id: number;
    team_id: number;
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
};
export type MatchLineupCreateOrConnectWithoutPlayerInput = {
    where: Prisma.MatchLineupWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchLineupCreateWithoutPlayerInput, Prisma.MatchLineupUncheckedCreateWithoutPlayerInput>;
};
export type MatchLineupCreateManyPlayerInputEnvelope = {
    data: Prisma.MatchLineupCreateManyPlayerInput | Prisma.MatchLineupCreateManyPlayerInput[];
    skipDuplicates?: boolean;
};
export type MatchLineupUpsertWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.MatchLineupWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchLineupUpdateWithoutPlayerInput, Prisma.MatchLineupUncheckedUpdateWithoutPlayerInput>;
    create: Prisma.XOR<Prisma.MatchLineupCreateWithoutPlayerInput, Prisma.MatchLineupUncheckedCreateWithoutPlayerInput>;
};
export type MatchLineupUpdateWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.MatchLineupWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchLineupUpdateWithoutPlayerInput, Prisma.MatchLineupUncheckedUpdateWithoutPlayerInput>;
};
export type MatchLineupUpdateManyWithWhereWithoutPlayerInput = {
    where: Prisma.MatchLineupScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchLineupUpdateManyMutationInput, Prisma.MatchLineupUncheckedUpdateManyWithoutPlayerInput>;
};
export type MatchLineupCreateWithoutMatchInput = {
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
    team: Prisma.TeamCreateNestedOneWithoutMatchLineupsInput;
    player: Prisma.PlayerCreateNestedOneWithoutMatchLineupsInput;
};
export type MatchLineupUncheckedCreateWithoutMatchInput = {
    id?: number;
    team_id: number;
    player_id: number;
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
};
export type MatchLineupCreateOrConnectWithoutMatchInput = {
    where: Prisma.MatchLineupWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchLineupCreateWithoutMatchInput, Prisma.MatchLineupUncheckedCreateWithoutMatchInput>;
};
export type MatchLineupCreateManyMatchInputEnvelope = {
    data: Prisma.MatchLineupCreateManyMatchInput | Prisma.MatchLineupCreateManyMatchInput[];
    skipDuplicates?: boolean;
};
export type MatchLineupUpsertWithWhereUniqueWithoutMatchInput = {
    where: Prisma.MatchLineupWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchLineupUpdateWithoutMatchInput, Prisma.MatchLineupUncheckedUpdateWithoutMatchInput>;
    create: Prisma.XOR<Prisma.MatchLineupCreateWithoutMatchInput, Prisma.MatchLineupUncheckedCreateWithoutMatchInput>;
};
export type MatchLineupUpdateWithWhereUniqueWithoutMatchInput = {
    where: Prisma.MatchLineupWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchLineupUpdateWithoutMatchInput, Prisma.MatchLineupUncheckedUpdateWithoutMatchInput>;
};
export type MatchLineupUpdateManyWithWhereWithoutMatchInput = {
    where: Prisma.MatchLineupScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchLineupUpdateManyMutationInput, Prisma.MatchLineupUncheckedUpdateManyWithoutMatchInput>;
};
export type MatchLineupCreateManyTeamInput = {
    id?: number;
    match_id: number;
    player_id: number;
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
};
export type MatchLineupUpdateWithoutTeamInput = {
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    match?: Prisma.MatchUpdateOneRequiredWithoutMatchLineupsNestedInput;
    player?: Prisma.PlayerUpdateOneRequiredWithoutMatchLineupsNestedInput;
};
export type MatchLineupUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchLineupUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchLineupCreateManyPlayerInput = {
    id?: number;
    match_id: number;
    team_id: number;
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
};
export type MatchLineupUpdateWithoutPlayerInput = {
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    match?: Prisma.MatchUpdateOneRequiredWithoutMatchLineupsNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutMatchLineupsNestedInput;
};
export type MatchLineupUncheckedUpdateWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchLineupUncheckedUpdateManyWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchLineupCreateManyMatchInput = {
    id?: number;
    team_id: number;
    player_id: number;
    position: $Enums.PlayerPosition;
    lineup_type?: $Enums.LineupType;
    is_captain?: boolean;
    minute_in?: number | null;
    minute_out?: number | null;
    status?: $Enums.MatchPlayerStatus;
    created_at?: Date | string;
};
export type MatchLineupUpdateWithoutMatchInput = {
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    team?: Prisma.TeamUpdateOneRequiredWithoutMatchLineupsNestedInput;
    player?: Prisma.PlayerUpdateOneRequiredWithoutMatchLineupsNestedInput;
};
export type MatchLineupUncheckedUpdateWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchLineupUncheckedUpdateManyWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    lineup_type?: Prisma.EnumLineupTypeFieldUpdateOperationsInput | $Enums.LineupType;
    is_captain?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    minute_in?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    minute_out?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchPlayerStatusFieldUpdateOperationsInput | $Enums.MatchPlayerStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchLineupSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    match_id?: boolean;
    team_id?: boolean;
    player_id?: boolean;
    position?: boolean;
    lineup_type?: boolean;
    is_captain?: boolean;
    minute_in?: boolean;
    minute_out?: boolean;
    status?: boolean;
    created_at?: boolean;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["matchLineup"]>;
export type MatchLineupSelectScalar = {
    id?: boolean;
    match_id?: boolean;
    team_id?: boolean;
    player_id?: boolean;
    position?: boolean;
    lineup_type?: boolean;
    is_captain?: boolean;
    minute_in?: boolean;
    minute_out?: boolean;
    status?: boolean;
    created_at?: boolean;
};
export type MatchLineupOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "match_id" | "team_id" | "player_id" | "position" | "lineup_type" | "is_captain" | "minute_in" | "minute_out" | "status" | "created_at", ExtArgs["result"]["matchLineup"]>;
export type MatchLineupInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
};
export type $MatchLineupPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MatchLineup";
    objects: {
        match: Prisma.$MatchPayload<ExtArgs>;
        team: Prisma.$TeamPayload<ExtArgs>;
        player: Prisma.$PlayerPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        match_id: number;
        team_id: number;
        player_id: number;
        position: $Enums.PlayerPosition;
        lineup_type: $Enums.LineupType;
        is_captain: boolean;
        minute_in: number | null;
        minute_out: number | null;
        status: $Enums.MatchPlayerStatus;
        created_at: Date;
    }, ExtArgs["result"]["matchLineup"]>;
    composites: {};
};
export type MatchLineupGetPayload<S extends boolean | null | undefined | MatchLineupDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload, S>;
export type MatchLineupCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MatchLineupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MatchLineupCountAggregateInputType | true;
};
export interface MatchLineupDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MatchLineup'];
        meta: {
            name: 'MatchLineup';
        };
    };
    /**
     * Find zero or one MatchLineup that matches the filter.
     * @param {MatchLineupFindUniqueArgs} args - Arguments to find a MatchLineup
     * @example
     * // Get one MatchLineup
     * const matchLineup = await prisma.matchLineup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchLineupFindUniqueArgs>(args: Prisma.SelectSubset<T, MatchLineupFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MatchLineupClient<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MatchLineup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchLineupFindUniqueOrThrowArgs} args - Arguments to find a MatchLineup
     * @example
     * // Get one MatchLineup
     * const matchLineup = await prisma.matchLineup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchLineupFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MatchLineupFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchLineupClient<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MatchLineup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchLineupFindFirstArgs} args - Arguments to find a MatchLineup
     * @example
     * // Get one MatchLineup
     * const matchLineup = await prisma.matchLineup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchLineupFindFirstArgs>(args?: Prisma.SelectSubset<T, MatchLineupFindFirstArgs<ExtArgs>>): Prisma.Prisma__MatchLineupClient<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MatchLineup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchLineupFindFirstOrThrowArgs} args - Arguments to find a MatchLineup
     * @example
     * // Get one MatchLineup
     * const matchLineup = await prisma.matchLineup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchLineupFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MatchLineupFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchLineupClient<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MatchLineups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchLineupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchLineups
     * const matchLineups = await prisma.matchLineup.findMany()
     *
     * // Get first 10 MatchLineups
     * const matchLineups = await prisma.matchLineup.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const matchLineupWithIdOnly = await prisma.matchLineup.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MatchLineupFindManyArgs>(args?: Prisma.SelectSubset<T, MatchLineupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MatchLineup.
     * @param {MatchLineupCreateArgs} args - Arguments to create a MatchLineup.
     * @example
     * // Create one MatchLineup
     * const MatchLineup = await prisma.matchLineup.create({
     *   data: {
     *     // ... data to create a MatchLineup
     *   }
     * })
     *
     */
    create<T extends MatchLineupCreateArgs>(args: Prisma.SelectSubset<T, MatchLineupCreateArgs<ExtArgs>>): Prisma.Prisma__MatchLineupClient<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MatchLineups.
     * @param {MatchLineupCreateManyArgs} args - Arguments to create many MatchLineups.
     * @example
     * // Create many MatchLineups
     * const matchLineup = await prisma.matchLineup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MatchLineupCreateManyArgs>(args?: Prisma.SelectSubset<T, MatchLineupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MatchLineup.
     * @param {MatchLineupDeleteArgs} args - Arguments to delete one MatchLineup.
     * @example
     * // Delete one MatchLineup
     * const MatchLineup = await prisma.matchLineup.delete({
     *   where: {
     *     // ... filter to delete one MatchLineup
     *   }
     * })
     *
     */
    delete<T extends MatchLineupDeleteArgs>(args: Prisma.SelectSubset<T, MatchLineupDeleteArgs<ExtArgs>>): Prisma.Prisma__MatchLineupClient<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MatchLineup.
     * @param {MatchLineupUpdateArgs} args - Arguments to update one MatchLineup.
     * @example
     * // Update one MatchLineup
     * const matchLineup = await prisma.matchLineup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MatchLineupUpdateArgs>(args: Prisma.SelectSubset<T, MatchLineupUpdateArgs<ExtArgs>>): Prisma.Prisma__MatchLineupClient<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MatchLineups.
     * @param {MatchLineupDeleteManyArgs} args - Arguments to filter MatchLineups to delete.
     * @example
     * // Delete a few MatchLineups
     * const { count } = await prisma.matchLineup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MatchLineupDeleteManyArgs>(args?: Prisma.SelectSubset<T, MatchLineupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MatchLineups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchLineupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchLineups
     * const matchLineup = await prisma.matchLineup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MatchLineupUpdateManyArgs>(args: Prisma.SelectSubset<T, MatchLineupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MatchLineup.
     * @param {MatchLineupUpsertArgs} args - Arguments to update or create a MatchLineup.
     * @example
     * // Update or create a MatchLineup
     * const matchLineup = await prisma.matchLineup.upsert({
     *   create: {
     *     // ... data to create a MatchLineup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchLineup we want to update
     *   }
     * })
     */
    upsert<T extends MatchLineupUpsertArgs>(args: Prisma.SelectSubset<T, MatchLineupUpsertArgs<ExtArgs>>): Prisma.Prisma__MatchLineupClient<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MatchLineups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchLineupCountArgs} args - Arguments to filter MatchLineups to count.
     * @example
     * // Count the number of MatchLineups
     * const count = await prisma.matchLineup.count({
     *   where: {
     *     // ... the filter for the MatchLineups we want to count
     *   }
     * })
    **/
    count<T extends MatchLineupCountArgs>(args?: Prisma.Subset<T, MatchLineupCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MatchLineupCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MatchLineup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchLineupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MatchLineupAggregateArgs>(args: Prisma.Subset<T, MatchLineupAggregateArgs>): Prisma.PrismaPromise<GetMatchLineupAggregateType<T>>;
    /**
     * Group by MatchLineup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchLineupGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MatchLineupGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MatchLineupGroupByArgs['orderBy'];
    } : {
        orderBy?: MatchLineupGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MatchLineupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchLineupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MatchLineup model
     */
    readonly fields: MatchLineupFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MatchLineup.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MatchLineupClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    match<T extends Prisma.MatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchDefaultArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    player<T extends Prisma.PlayerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlayerDefaultArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the MatchLineup model
 */
export interface MatchLineupFieldRefs {
    readonly id: Prisma.FieldRef<"MatchLineup", 'Int'>;
    readonly match_id: Prisma.FieldRef<"MatchLineup", 'Int'>;
    readonly team_id: Prisma.FieldRef<"MatchLineup", 'Int'>;
    readonly player_id: Prisma.FieldRef<"MatchLineup", 'Int'>;
    readonly position: Prisma.FieldRef<"MatchLineup", 'PlayerPosition'>;
    readonly lineup_type: Prisma.FieldRef<"MatchLineup", 'LineupType'>;
    readonly is_captain: Prisma.FieldRef<"MatchLineup", 'Boolean'>;
    readonly minute_in: Prisma.FieldRef<"MatchLineup", 'Int'>;
    readonly minute_out: Prisma.FieldRef<"MatchLineup", 'Int'>;
    readonly status: Prisma.FieldRef<"MatchLineup", 'MatchPlayerStatus'>;
    readonly created_at: Prisma.FieldRef<"MatchLineup", 'DateTime'>;
}
/**
 * MatchLineup findUnique
 */
export type MatchLineupFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchLineup to fetch.
     */
    where: Prisma.MatchLineupWhereUniqueInput;
};
/**
 * MatchLineup findUniqueOrThrow
 */
export type MatchLineupFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchLineup to fetch.
     */
    where: Prisma.MatchLineupWhereUniqueInput;
};
/**
 * MatchLineup findFirst
 */
export type MatchLineupFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchLineup to fetch.
     */
    where?: Prisma.MatchLineupWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchLineups to fetch.
     */
    orderBy?: Prisma.MatchLineupOrderByWithRelationInput | Prisma.MatchLineupOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MatchLineups.
     */
    cursor?: Prisma.MatchLineupWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchLineups from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchLineups.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchLineups.
     */
    distinct?: Prisma.MatchLineupScalarFieldEnum | Prisma.MatchLineupScalarFieldEnum[];
};
/**
 * MatchLineup findFirstOrThrow
 */
export type MatchLineupFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchLineup to fetch.
     */
    where?: Prisma.MatchLineupWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchLineups to fetch.
     */
    orderBy?: Prisma.MatchLineupOrderByWithRelationInput | Prisma.MatchLineupOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MatchLineups.
     */
    cursor?: Prisma.MatchLineupWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchLineups from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchLineups.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchLineups.
     */
    distinct?: Prisma.MatchLineupScalarFieldEnum | Prisma.MatchLineupScalarFieldEnum[];
};
/**
 * MatchLineup findMany
 */
export type MatchLineupFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchLineups to fetch.
     */
    where?: Prisma.MatchLineupWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchLineups to fetch.
     */
    orderBy?: Prisma.MatchLineupOrderByWithRelationInput | Prisma.MatchLineupOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MatchLineups.
     */
    cursor?: Prisma.MatchLineupWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchLineups from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchLineups.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchLineups.
     */
    distinct?: Prisma.MatchLineupScalarFieldEnum | Prisma.MatchLineupScalarFieldEnum[];
};
/**
 * MatchLineup create
 */
export type MatchLineupCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a MatchLineup.
     */
    data: Prisma.XOR<Prisma.MatchLineupCreateInput, Prisma.MatchLineupUncheckedCreateInput>;
};
/**
 * MatchLineup createMany
 */
export type MatchLineupCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchLineups.
     */
    data: Prisma.MatchLineupCreateManyInput | Prisma.MatchLineupCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * MatchLineup update
 */
export type MatchLineupUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a MatchLineup.
     */
    data: Prisma.XOR<Prisma.MatchLineupUpdateInput, Prisma.MatchLineupUncheckedUpdateInput>;
    /**
     * Choose, which MatchLineup to update.
     */
    where: Prisma.MatchLineupWhereUniqueInput;
};
/**
 * MatchLineup updateMany
 */
export type MatchLineupUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchLineups.
     */
    data: Prisma.XOR<Prisma.MatchLineupUpdateManyMutationInput, Prisma.MatchLineupUncheckedUpdateManyInput>;
    /**
     * Filter which MatchLineups to update
     */
    where?: Prisma.MatchLineupWhereInput;
    /**
     * Limit how many MatchLineups to update.
     */
    limit?: number;
};
/**
 * MatchLineup upsert
 */
export type MatchLineupUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the MatchLineup to update in case it exists.
     */
    where: Prisma.MatchLineupWhereUniqueInput;
    /**
     * In case the MatchLineup found by the `where` argument doesn't exist, create a new MatchLineup with this data.
     */
    create: Prisma.XOR<Prisma.MatchLineupCreateInput, Prisma.MatchLineupUncheckedCreateInput>;
    /**
     * In case the MatchLineup was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MatchLineupUpdateInput, Prisma.MatchLineupUncheckedUpdateInput>;
};
/**
 * MatchLineup delete
 */
export type MatchLineupDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which MatchLineup to delete.
     */
    where: Prisma.MatchLineupWhereUniqueInput;
};
/**
 * MatchLineup deleteMany
 */
export type MatchLineupDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MatchLineups to delete
     */
    where?: Prisma.MatchLineupWhereInput;
    /**
     * Limit how many MatchLineups to delete.
     */
    limit?: number;
};
/**
 * MatchLineup without action
 */
export type MatchLineupDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=MatchLineup.d.ts.map