import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model TeamPlayerHistory
 *
 */
export type TeamPlayerHistoryModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamPlayerHistoryPayload>;
export type AggregateTeamPlayerHistory = {
    _count: TeamPlayerHistoryCountAggregateOutputType | null;
    _avg: TeamPlayerHistoryAvgAggregateOutputType | null;
    _sum: TeamPlayerHistorySumAggregateOutputType | null;
    _min: TeamPlayerHistoryMinAggregateOutputType | null;
    _max: TeamPlayerHistoryMaxAggregateOutputType | null;
};
export type TeamPlayerHistoryAvgAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    player_id: number | null;
    jersey_number: number | null;
};
export type TeamPlayerHistorySumAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    player_id: number | null;
    jersey_number: number | null;
};
export type TeamPlayerHistoryMinAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    player_id: number | null;
    jersey_number: number | null;
    position: $Enums.PlayerPosition | null;
    role: $Enums.PlayerRole | null;
    joined_at: Date | null;
    left_at: Date | null;
    left_reason: $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryMaxAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    player_id: number | null;
    jersey_number: number | null;
    position: $Enums.PlayerPosition | null;
    role: $Enums.PlayerRole | null;
    joined_at: Date | null;
    left_at: Date | null;
    left_reason: $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryCountAggregateOutputType = {
    id: number;
    season_team_id: number;
    player_id: number;
    jersey_number: number;
    position: number;
    role: number;
    joined_at: number;
    left_at: number;
    left_reason: number;
    _all: number;
};
export type TeamPlayerHistoryAvgAggregateInputType = {
    id?: true;
    season_team_id?: true;
    player_id?: true;
    jersey_number?: true;
};
export type TeamPlayerHistorySumAggregateInputType = {
    id?: true;
    season_team_id?: true;
    player_id?: true;
    jersey_number?: true;
};
export type TeamPlayerHistoryMinAggregateInputType = {
    id?: true;
    season_team_id?: true;
    player_id?: true;
    jersey_number?: true;
    position?: true;
    role?: true;
    joined_at?: true;
    left_at?: true;
    left_reason?: true;
};
export type TeamPlayerHistoryMaxAggregateInputType = {
    id?: true;
    season_team_id?: true;
    player_id?: true;
    jersey_number?: true;
    position?: true;
    role?: true;
    joined_at?: true;
    left_at?: true;
    left_reason?: true;
};
export type TeamPlayerHistoryCountAggregateInputType = {
    id?: true;
    season_team_id?: true;
    player_id?: true;
    jersey_number?: true;
    position?: true;
    role?: true;
    joined_at?: true;
    left_at?: true;
    left_reason?: true;
    _all?: true;
};
export type TeamPlayerHistoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TeamPlayerHistory to aggregate.
     */
    where?: Prisma.TeamPlayerHistoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamPlayerHistories to fetch.
     */
    orderBy?: Prisma.TeamPlayerHistoryOrderByWithRelationInput | Prisma.TeamPlayerHistoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.TeamPlayerHistoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamPlayerHistories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamPlayerHistories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TeamPlayerHistories
    **/
    _count?: true | TeamPlayerHistoryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: TeamPlayerHistoryAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: TeamPlayerHistorySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TeamPlayerHistoryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TeamPlayerHistoryMaxAggregateInputType;
};
export type GetTeamPlayerHistoryAggregateType<T extends TeamPlayerHistoryAggregateArgs> = {
    [P in keyof T & keyof AggregateTeamPlayerHistory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeamPlayerHistory[P]> : Prisma.GetScalarType<T[P], AggregateTeamPlayerHistory[P]>;
};
export type TeamPlayerHistoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerHistoryWhereInput;
    orderBy?: Prisma.TeamPlayerHistoryOrderByWithAggregationInput | Prisma.TeamPlayerHistoryOrderByWithAggregationInput[];
    by: Prisma.TeamPlayerHistoryScalarFieldEnum[] | Prisma.TeamPlayerHistoryScalarFieldEnum;
    having?: Prisma.TeamPlayerHistoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamPlayerHistoryCountAggregateInputType | true;
    _avg?: TeamPlayerHistoryAvgAggregateInputType;
    _sum?: TeamPlayerHistorySumAggregateInputType;
    _min?: TeamPlayerHistoryMinAggregateInputType;
    _max?: TeamPlayerHistoryMaxAggregateInputType;
};
export type TeamPlayerHistoryGroupByOutputType = {
    id: number;
    season_team_id: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date;
    left_at: Date;
    left_reason: $Enums.LeaveReason | null;
    _count: TeamPlayerHistoryCountAggregateOutputType | null;
    _avg: TeamPlayerHistoryAvgAggregateOutputType | null;
    _sum: TeamPlayerHistorySumAggregateOutputType | null;
    _min: TeamPlayerHistoryMinAggregateOutputType | null;
    _max: TeamPlayerHistoryMaxAggregateOutputType | null;
};
export type GetTeamPlayerHistoryGroupByPayload<T extends TeamPlayerHistoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamPlayerHistoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamPlayerHistoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamPlayerHistoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamPlayerHistoryGroupByOutputType[P]>;
}>>;
export type TeamPlayerHistoryWhereInput = {
    AND?: Prisma.TeamPlayerHistoryWhereInput | Prisma.TeamPlayerHistoryWhereInput[];
    OR?: Prisma.TeamPlayerHistoryWhereInput[];
    NOT?: Prisma.TeamPlayerHistoryWhereInput | Prisma.TeamPlayerHistoryWhereInput[];
    id?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    season_team_id?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    player_id?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    jersey_number?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    position?: Prisma.EnumPlayerPositionFilter<"TeamPlayerHistory"> | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFilter<"TeamPlayerHistory"> | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFilter<"TeamPlayerHistory"> | Date | string;
    left_at?: Prisma.DateTimeFilter<"TeamPlayerHistory"> | Date | string;
    left_reason?: Prisma.EnumLeaveReasonNullableFilter<"TeamPlayerHistory"> | $Enums.LeaveReason | null;
    season_team?: Prisma.XOR<Prisma.SeasonTeamScalarRelationFilter, Prisma.SeasonTeamWhereInput>;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
};
export type TeamPlayerHistoryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joined_at?: Prisma.SortOrder;
    left_at?: Prisma.SortOrder;
    left_reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    season_team?: Prisma.SeasonTeamOrderByWithRelationInput;
    player?: Prisma.PlayerOrderByWithRelationInput;
};
export type TeamPlayerHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.TeamPlayerHistoryWhereInput | Prisma.TeamPlayerHistoryWhereInput[];
    OR?: Prisma.TeamPlayerHistoryWhereInput[];
    NOT?: Prisma.TeamPlayerHistoryWhereInput | Prisma.TeamPlayerHistoryWhereInput[];
    season_team_id?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    player_id?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    jersey_number?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    position?: Prisma.EnumPlayerPositionFilter<"TeamPlayerHistory"> | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFilter<"TeamPlayerHistory"> | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFilter<"TeamPlayerHistory"> | Date | string;
    left_at?: Prisma.DateTimeFilter<"TeamPlayerHistory"> | Date | string;
    left_reason?: Prisma.EnumLeaveReasonNullableFilter<"TeamPlayerHistory"> | $Enums.LeaveReason | null;
    season_team?: Prisma.XOR<Prisma.SeasonTeamScalarRelationFilter, Prisma.SeasonTeamWhereInput>;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
}, "id">;
export type TeamPlayerHistoryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joined_at?: Prisma.SortOrder;
    left_at?: Prisma.SortOrder;
    left_reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TeamPlayerHistoryCountOrderByAggregateInput;
    _avg?: Prisma.TeamPlayerHistoryAvgOrderByAggregateInput;
    _max?: Prisma.TeamPlayerHistoryMaxOrderByAggregateInput;
    _min?: Prisma.TeamPlayerHistoryMinOrderByAggregateInput;
    _sum?: Prisma.TeamPlayerHistorySumOrderByAggregateInput;
};
export type TeamPlayerHistoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamPlayerHistoryScalarWhereWithAggregatesInput | Prisma.TeamPlayerHistoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamPlayerHistoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamPlayerHistoryScalarWhereWithAggregatesInput | Prisma.TeamPlayerHistoryScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"TeamPlayerHistory"> | number;
    season_team_id?: Prisma.IntWithAggregatesFilter<"TeamPlayerHistory"> | number;
    player_id?: Prisma.IntWithAggregatesFilter<"TeamPlayerHistory"> | number;
    jersey_number?: Prisma.IntWithAggregatesFilter<"TeamPlayerHistory"> | number;
    position?: Prisma.EnumPlayerPositionWithAggregatesFilter<"TeamPlayerHistory"> | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleWithAggregatesFilter<"TeamPlayerHistory"> | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeWithAggregatesFilter<"TeamPlayerHistory"> | Date | string;
    left_at?: Prisma.DateTimeWithAggregatesFilter<"TeamPlayerHistory"> | Date | string;
    left_reason?: Prisma.EnumLeaveReasonNullableWithAggregatesFilter<"TeamPlayerHistory"> | $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryCreateInput = {
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date | string;
    left_at: Date | string;
    left_reason?: $Enums.LeaveReason | null;
    season_team: Prisma.SeasonTeamCreateNestedOneWithoutTeam_player_historyInput;
    player: Prisma.PlayerCreateNestedOneWithoutTeam_player_historyInput;
};
export type TeamPlayerHistoryUncheckedCreateInput = {
    id?: number;
    season_team_id: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date | string;
    left_at: Date | string;
    left_reason?: $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryUpdateInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
    season_team?: Prisma.SeasonTeamUpdateOneRequiredWithoutTeam_player_historyNestedInput;
    player?: Prisma.PlayerUpdateOneRequiredWithoutTeam_player_historyNestedInput;
};
export type TeamPlayerHistoryUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryCreateManyInput = {
    id?: number;
    season_team_id: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date | string;
    left_at: Date | string;
    left_reason?: $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryUpdateManyMutationInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryListRelationFilter = {
    every?: Prisma.TeamPlayerHistoryWhereInput;
    some?: Prisma.TeamPlayerHistoryWhereInput;
    none?: Prisma.TeamPlayerHistoryWhereInput;
};
export type TeamPlayerHistoryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TeamPlayerHistoryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joined_at?: Prisma.SortOrder;
    left_at?: Prisma.SortOrder;
    left_reason?: Prisma.SortOrder;
};
export type TeamPlayerHistoryAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
};
export type TeamPlayerHistoryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joined_at?: Prisma.SortOrder;
    left_at?: Prisma.SortOrder;
    left_reason?: Prisma.SortOrder;
};
export type TeamPlayerHistoryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joined_at?: Prisma.SortOrder;
    left_at?: Prisma.SortOrder;
    left_reason?: Prisma.SortOrder;
};
export type TeamPlayerHistorySumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
};
export type TeamPlayerHistoryCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutPlayerInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerHistoryCreateWithoutPlayerInput[] | Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerHistoryCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerHistoryCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerHistoryCreateManyPlayerInputEnvelope;
    connect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
};
export type TeamPlayerHistoryUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutPlayerInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerHistoryCreateWithoutPlayerInput[] | Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerHistoryCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerHistoryCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerHistoryCreateManyPlayerInputEnvelope;
    connect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
};
export type TeamPlayerHistoryUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutPlayerInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerHistoryCreateWithoutPlayerInput[] | Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerHistoryCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerHistoryCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.TeamPlayerHistoryUpsertWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerHistoryUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerHistoryCreateManyPlayerInputEnvelope;
    set?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    delete?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    connect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    update?: Prisma.TeamPlayerHistoryUpdateWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerHistoryUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.TeamPlayerHistoryUpdateManyWithWhereWithoutPlayerInput | Prisma.TeamPlayerHistoryUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.TeamPlayerHistoryScalarWhereInput | Prisma.TeamPlayerHistoryScalarWhereInput[];
};
export type TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutPlayerInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerHistoryCreateWithoutPlayerInput[] | Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerHistoryCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerHistoryCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.TeamPlayerHistoryUpsertWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerHistoryUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerHistoryCreateManyPlayerInputEnvelope;
    set?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    delete?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    connect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    update?: Prisma.TeamPlayerHistoryUpdateWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerHistoryUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.TeamPlayerHistoryUpdateManyWithWhereWithoutPlayerInput | Prisma.TeamPlayerHistoryUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.TeamPlayerHistoryScalarWhereInput | Prisma.TeamPlayerHistoryScalarWhereInput[];
};
export type NullableEnumLeaveReasonFieldUpdateOperationsInput = {
    set?: $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryCreateNestedManyWithoutSeason_teamInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput> | Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput[] | Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.TeamPlayerHistoryCreateOrConnectWithoutSeason_teamInput | Prisma.TeamPlayerHistoryCreateOrConnectWithoutSeason_teamInput[];
    createMany?: Prisma.TeamPlayerHistoryCreateManySeason_teamInputEnvelope;
    connect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
};
export type TeamPlayerHistoryUncheckedCreateNestedManyWithoutSeason_teamInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput> | Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput[] | Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.TeamPlayerHistoryCreateOrConnectWithoutSeason_teamInput | Prisma.TeamPlayerHistoryCreateOrConnectWithoutSeason_teamInput[];
    createMany?: Prisma.TeamPlayerHistoryCreateManySeason_teamInputEnvelope;
    connect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
};
export type TeamPlayerHistoryUpdateManyWithoutSeason_teamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput> | Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput[] | Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.TeamPlayerHistoryCreateOrConnectWithoutSeason_teamInput | Prisma.TeamPlayerHistoryCreateOrConnectWithoutSeason_teamInput[];
    upsert?: Prisma.TeamPlayerHistoryUpsertWithWhereUniqueWithoutSeason_teamInput | Prisma.TeamPlayerHistoryUpsertWithWhereUniqueWithoutSeason_teamInput[];
    createMany?: Prisma.TeamPlayerHistoryCreateManySeason_teamInputEnvelope;
    set?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    delete?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    connect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    update?: Prisma.TeamPlayerHistoryUpdateWithWhereUniqueWithoutSeason_teamInput | Prisma.TeamPlayerHistoryUpdateWithWhereUniqueWithoutSeason_teamInput[];
    updateMany?: Prisma.TeamPlayerHistoryUpdateManyWithWhereWithoutSeason_teamInput | Prisma.TeamPlayerHistoryUpdateManyWithWhereWithoutSeason_teamInput[];
    deleteMany?: Prisma.TeamPlayerHistoryScalarWhereInput | Prisma.TeamPlayerHistoryScalarWhereInput[];
};
export type TeamPlayerHistoryUncheckedUpdateManyWithoutSeason_teamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput> | Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput[] | Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.TeamPlayerHistoryCreateOrConnectWithoutSeason_teamInput | Prisma.TeamPlayerHistoryCreateOrConnectWithoutSeason_teamInput[];
    upsert?: Prisma.TeamPlayerHistoryUpsertWithWhereUniqueWithoutSeason_teamInput | Prisma.TeamPlayerHistoryUpsertWithWhereUniqueWithoutSeason_teamInput[];
    createMany?: Prisma.TeamPlayerHistoryCreateManySeason_teamInputEnvelope;
    set?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    delete?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    connect?: Prisma.TeamPlayerHistoryWhereUniqueInput | Prisma.TeamPlayerHistoryWhereUniqueInput[];
    update?: Prisma.TeamPlayerHistoryUpdateWithWhereUniqueWithoutSeason_teamInput | Prisma.TeamPlayerHistoryUpdateWithWhereUniqueWithoutSeason_teamInput[];
    updateMany?: Prisma.TeamPlayerHistoryUpdateManyWithWhereWithoutSeason_teamInput | Prisma.TeamPlayerHistoryUpdateManyWithWhereWithoutSeason_teamInput[];
    deleteMany?: Prisma.TeamPlayerHistoryScalarWhereInput | Prisma.TeamPlayerHistoryScalarWhereInput[];
};
export type TeamPlayerHistoryCreateWithoutPlayerInput = {
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date | string;
    left_at: Date | string;
    left_reason?: $Enums.LeaveReason | null;
    season_team: Prisma.SeasonTeamCreateNestedOneWithoutTeam_player_historyInput;
};
export type TeamPlayerHistoryUncheckedCreateWithoutPlayerInput = {
    id?: number;
    season_team_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date | string;
    left_at: Date | string;
    left_reason?: $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryCreateOrConnectWithoutPlayerInput = {
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutPlayerInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput>;
};
export type TeamPlayerHistoryCreateManyPlayerInputEnvelope = {
    data: Prisma.TeamPlayerHistoryCreateManyPlayerInput | Prisma.TeamPlayerHistoryCreateManyPlayerInput[];
    skipDuplicates?: boolean;
};
export type TeamPlayerHistoryUpsertWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamPlayerHistoryUpdateWithoutPlayerInput, Prisma.TeamPlayerHistoryUncheckedUpdateWithoutPlayerInput>;
    create: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutPlayerInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutPlayerInput>;
};
export type TeamPlayerHistoryUpdateWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamPlayerHistoryUpdateWithoutPlayerInput, Prisma.TeamPlayerHistoryUncheckedUpdateWithoutPlayerInput>;
};
export type TeamPlayerHistoryUpdateManyWithWhereWithoutPlayerInput = {
    where: Prisma.TeamPlayerHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamPlayerHistoryUpdateManyMutationInput, Prisma.TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerInput>;
};
export type TeamPlayerHistoryScalarWhereInput = {
    AND?: Prisma.TeamPlayerHistoryScalarWhereInput | Prisma.TeamPlayerHistoryScalarWhereInput[];
    OR?: Prisma.TeamPlayerHistoryScalarWhereInput[];
    NOT?: Prisma.TeamPlayerHistoryScalarWhereInput | Prisma.TeamPlayerHistoryScalarWhereInput[];
    id?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    season_team_id?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    player_id?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    jersey_number?: Prisma.IntFilter<"TeamPlayerHistory"> | number;
    position?: Prisma.EnumPlayerPositionFilter<"TeamPlayerHistory"> | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFilter<"TeamPlayerHistory"> | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFilter<"TeamPlayerHistory"> | Date | string;
    left_at?: Prisma.DateTimeFilter<"TeamPlayerHistory"> | Date | string;
    left_reason?: Prisma.EnumLeaveReasonNullableFilter<"TeamPlayerHistory"> | $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryCreateWithoutSeason_teamInput = {
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date | string;
    left_at: Date | string;
    left_reason?: $Enums.LeaveReason | null;
    player: Prisma.PlayerCreateNestedOneWithoutTeam_player_historyInput;
};
export type TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput = {
    id?: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date | string;
    left_at: Date | string;
    left_reason?: $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryCreateOrConnectWithoutSeason_teamInput = {
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput>;
};
export type TeamPlayerHistoryCreateManySeason_teamInputEnvelope = {
    data: Prisma.TeamPlayerHistoryCreateManySeason_teamInput | Prisma.TeamPlayerHistoryCreateManySeason_teamInput[];
    skipDuplicates?: boolean;
};
export type TeamPlayerHistoryUpsertWithWhereUniqueWithoutSeason_teamInput = {
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamPlayerHistoryUpdateWithoutSeason_teamInput, Prisma.TeamPlayerHistoryUncheckedUpdateWithoutSeason_teamInput>;
    create: Prisma.XOR<Prisma.TeamPlayerHistoryCreateWithoutSeason_teamInput, Prisma.TeamPlayerHistoryUncheckedCreateWithoutSeason_teamInput>;
};
export type TeamPlayerHistoryUpdateWithWhereUniqueWithoutSeason_teamInput = {
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamPlayerHistoryUpdateWithoutSeason_teamInput, Prisma.TeamPlayerHistoryUncheckedUpdateWithoutSeason_teamInput>;
};
export type TeamPlayerHistoryUpdateManyWithWhereWithoutSeason_teamInput = {
    where: Prisma.TeamPlayerHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamPlayerHistoryUpdateManyMutationInput, Prisma.TeamPlayerHistoryUncheckedUpdateManyWithoutSeason_teamInput>;
};
export type TeamPlayerHistoryCreateManyPlayerInput = {
    id?: number;
    season_team_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date | string;
    left_at: Date | string;
    left_reason?: $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryUpdateWithoutPlayerInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
    season_team?: Prisma.SeasonTeamUpdateOneRequiredWithoutTeam_player_historyNestedInput;
};
export type TeamPlayerHistoryUncheckedUpdateWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryCreateManySeason_teamInput = {
    id?: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    joined_at: Date | string;
    left_at: Date | string;
    left_reason?: $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryUpdateWithoutSeason_teamInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
    player?: Prisma.PlayerUpdateOneRequiredWithoutTeam_player_historyNestedInput;
};
export type TeamPlayerHistoryUncheckedUpdateWithoutSeason_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
};
export type TeamPlayerHistoryUncheckedUpdateManyWithoutSeason_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    joined_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    left_reason?: Prisma.NullableEnumLeaveReasonFieldUpdateOperationsInput | $Enums.LeaveReason | null;
};
export type TeamPlayerHistorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    season_team_id?: boolean;
    player_id?: boolean;
    jersey_number?: boolean;
    position?: boolean;
    role?: boolean;
    joined_at?: boolean;
    left_at?: boolean;
    left_reason?: boolean;
    season_team?: boolean | Prisma.SeasonTeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teamPlayerHistory"]>;
export type TeamPlayerHistorySelectScalar = {
    id?: boolean;
    season_team_id?: boolean;
    player_id?: boolean;
    jersey_number?: boolean;
    position?: boolean;
    role?: boolean;
    joined_at?: boolean;
    left_at?: boolean;
    left_reason?: boolean;
};
export type TeamPlayerHistoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "season_team_id" | "player_id" | "jersey_number" | "position" | "role" | "joined_at" | "left_at" | "left_reason", ExtArgs["result"]["teamPlayerHistory"]>;
export type TeamPlayerHistoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    season_team?: boolean | Prisma.SeasonTeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
};
export type $TeamPlayerHistoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TeamPlayerHistory";
    objects: {
        season_team: Prisma.$SeasonTeamPayload<ExtArgs>;
        player: Prisma.$PlayerPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        season_team_id: number;
        player_id: number;
        jersey_number: number;
        position: $Enums.PlayerPosition;
        role: $Enums.PlayerRole;
        joined_at: Date;
        left_at: Date;
        left_reason: $Enums.LeaveReason | null;
    }, ExtArgs["result"]["teamPlayerHistory"]>;
    composites: {};
};
export type TeamPlayerHistoryGetPayload<S extends boolean | null | undefined | TeamPlayerHistoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload, S>;
export type TeamPlayerHistoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamPlayerHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamPlayerHistoryCountAggregateInputType | true;
};
export interface TeamPlayerHistoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TeamPlayerHistory'];
        meta: {
            name: 'TeamPlayerHistory';
        };
    };
    /**
     * Find zero or one TeamPlayerHistory that matches the filter.
     * @param {TeamPlayerHistoryFindUniqueArgs} args - Arguments to find a TeamPlayerHistory
     * @example
     * // Get one TeamPlayerHistory
     * const teamPlayerHistory = await prisma.teamPlayerHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamPlayerHistoryFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamPlayerHistoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerHistoryClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one TeamPlayerHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamPlayerHistoryFindUniqueOrThrowArgs} args - Arguments to find a TeamPlayerHistory
     * @example
     * // Get one TeamPlayerHistory
     * const teamPlayerHistory = await prisma.teamPlayerHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamPlayerHistoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamPlayerHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerHistoryClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TeamPlayerHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerHistoryFindFirstArgs} args - Arguments to find a TeamPlayerHistory
     * @example
     * // Get one TeamPlayerHistory
     * const teamPlayerHistory = await prisma.teamPlayerHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamPlayerHistoryFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamPlayerHistoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerHistoryClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TeamPlayerHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerHistoryFindFirstOrThrowArgs} args - Arguments to find a TeamPlayerHistory
     * @example
     * // Get one TeamPlayerHistory
     * const teamPlayerHistory = await prisma.teamPlayerHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamPlayerHistoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamPlayerHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerHistoryClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more TeamPlayerHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamPlayerHistories
     * const teamPlayerHistories = await prisma.teamPlayerHistory.findMany()
     *
     * // Get first 10 TeamPlayerHistories
     * const teamPlayerHistories = await prisma.teamPlayerHistory.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const teamPlayerHistoryWithIdOnly = await prisma.teamPlayerHistory.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TeamPlayerHistoryFindManyArgs>(args?: Prisma.SelectSubset<T, TeamPlayerHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a TeamPlayerHistory.
     * @param {TeamPlayerHistoryCreateArgs} args - Arguments to create a TeamPlayerHistory.
     * @example
     * // Create one TeamPlayerHistory
     * const TeamPlayerHistory = await prisma.teamPlayerHistory.create({
     *   data: {
     *     // ... data to create a TeamPlayerHistory
     *   }
     * })
     *
     */
    create<T extends TeamPlayerHistoryCreateArgs>(args: Prisma.SelectSubset<T, TeamPlayerHistoryCreateArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerHistoryClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many TeamPlayerHistories.
     * @param {TeamPlayerHistoryCreateManyArgs} args - Arguments to create many TeamPlayerHistories.
     * @example
     * // Create many TeamPlayerHistories
     * const teamPlayerHistory = await prisma.teamPlayerHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TeamPlayerHistoryCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamPlayerHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a TeamPlayerHistory.
     * @param {TeamPlayerHistoryDeleteArgs} args - Arguments to delete one TeamPlayerHistory.
     * @example
     * // Delete one TeamPlayerHistory
     * const TeamPlayerHistory = await prisma.teamPlayerHistory.delete({
     *   where: {
     *     // ... filter to delete one TeamPlayerHistory
     *   }
     * })
     *
     */
    delete<T extends TeamPlayerHistoryDeleteArgs>(args: Prisma.SelectSubset<T, TeamPlayerHistoryDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerHistoryClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one TeamPlayerHistory.
     * @param {TeamPlayerHistoryUpdateArgs} args - Arguments to update one TeamPlayerHistory.
     * @example
     * // Update one TeamPlayerHistory
     * const teamPlayerHistory = await prisma.teamPlayerHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TeamPlayerHistoryUpdateArgs>(args: Prisma.SelectSubset<T, TeamPlayerHistoryUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerHistoryClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more TeamPlayerHistories.
     * @param {TeamPlayerHistoryDeleteManyArgs} args - Arguments to filter TeamPlayerHistories to delete.
     * @example
     * // Delete a few TeamPlayerHistories
     * const { count } = await prisma.teamPlayerHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TeamPlayerHistoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamPlayerHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more TeamPlayerHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamPlayerHistories
     * const teamPlayerHistory = await prisma.teamPlayerHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TeamPlayerHistoryUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamPlayerHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one TeamPlayerHistory.
     * @param {TeamPlayerHistoryUpsertArgs} args - Arguments to update or create a TeamPlayerHistory.
     * @example
     * // Update or create a TeamPlayerHistory
     * const teamPlayerHistory = await prisma.teamPlayerHistory.upsert({
     *   create: {
     *     // ... data to create a TeamPlayerHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamPlayerHistory we want to update
     *   }
     * })
     */
    upsert<T extends TeamPlayerHistoryUpsertArgs>(args: Prisma.SelectSubset<T, TeamPlayerHistoryUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerHistoryClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of TeamPlayerHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerHistoryCountArgs} args - Arguments to filter TeamPlayerHistories to count.
     * @example
     * // Count the number of TeamPlayerHistories
     * const count = await prisma.teamPlayerHistory.count({
     *   where: {
     *     // ... the filter for the TeamPlayerHistories we want to count
     *   }
     * })
    **/
    count<T extends TeamPlayerHistoryCountArgs>(args?: Prisma.Subset<T, TeamPlayerHistoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamPlayerHistoryCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a TeamPlayerHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeamPlayerHistoryAggregateArgs>(args: Prisma.Subset<T, TeamPlayerHistoryAggregateArgs>): Prisma.PrismaPromise<GetTeamPlayerHistoryAggregateType<T>>;
    /**
     * Group by TeamPlayerHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerHistoryGroupByArgs} args - Group by arguments.
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
    groupBy<T extends TeamPlayerHistoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamPlayerHistoryGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamPlayerHistoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamPlayerHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamPlayerHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the TeamPlayerHistory model
     */
    readonly fields: TeamPlayerHistoryFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for TeamPlayerHistory.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__TeamPlayerHistoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    season_team<T extends Prisma.SeasonTeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonTeamDefaultArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the TeamPlayerHistory model
 */
export interface TeamPlayerHistoryFieldRefs {
    readonly id: Prisma.FieldRef<"TeamPlayerHistory", 'Int'>;
    readonly season_team_id: Prisma.FieldRef<"TeamPlayerHistory", 'Int'>;
    readonly player_id: Prisma.FieldRef<"TeamPlayerHistory", 'Int'>;
    readonly jersey_number: Prisma.FieldRef<"TeamPlayerHistory", 'Int'>;
    readonly position: Prisma.FieldRef<"TeamPlayerHistory", 'PlayerPosition'>;
    readonly role: Prisma.FieldRef<"TeamPlayerHistory", 'PlayerRole'>;
    readonly joined_at: Prisma.FieldRef<"TeamPlayerHistory", 'DateTime'>;
    readonly left_at: Prisma.FieldRef<"TeamPlayerHistory", 'DateTime'>;
    readonly left_reason: Prisma.FieldRef<"TeamPlayerHistory", 'LeaveReason'>;
}
/**
 * TeamPlayerHistory findUnique
 */
export type TeamPlayerHistoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayerHistory to fetch.
     */
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
};
/**
 * TeamPlayerHistory findUniqueOrThrow
 */
export type TeamPlayerHistoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayerHistory to fetch.
     */
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
};
/**
 * TeamPlayerHistory findFirst
 */
export type TeamPlayerHistoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayerHistory to fetch.
     */
    where?: Prisma.TeamPlayerHistoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamPlayerHistories to fetch.
     */
    orderBy?: Prisma.TeamPlayerHistoryOrderByWithRelationInput | Prisma.TeamPlayerHistoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TeamPlayerHistories.
     */
    cursor?: Prisma.TeamPlayerHistoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamPlayerHistories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamPlayerHistories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamPlayerHistories.
     */
    distinct?: Prisma.TeamPlayerHistoryScalarFieldEnum | Prisma.TeamPlayerHistoryScalarFieldEnum[];
};
/**
 * TeamPlayerHistory findFirstOrThrow
 */
export type TeamPlayerHistoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayerHistory to fetch.
     */
    where?: Prisma.TeamPlayerHistoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamPlayerHistories to fetch.
     */
    orderBy?: Prisma.TeamPlayerHistoryOrderByWithRelationInput | Prisma.TeamPlayerHistoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TeamPlayerHistories.
     */
    cursor?: Prisma.TeamPlayerHistoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamPlayerHistories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamPlayerHistories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamPlayerHistories.
     */
    distinct?: Prisma.TeamPlayerHistoryScalarFieldEnum | Prisma.TeamPlayerHistoryScalarFieldEnum[];
};
/**
 * TeamPlayerHistory findMany
 */
export type TeamPlayerHistoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayerHistories to fetch.
     */
    where?: Prisma.TeamPlayerHistoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamPlayerHistories to fetch.
     */
    orderBy?: Prisma.TeamPlayerHistoryOrderByWithRelationInput | Prisma.TeamPlayerHistoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TeamPlayerHistories.
     */
    cursor?: Prisma.TeamPlayerHistoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamPlayerHistories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamPlayerHistories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamPlayerHistories.
     */
    distinct?: Prisma.TeamPlayerHistoryScalarFieldEnum | Prisma.TeamPlayerHistoryScalarFieldEnum[];
};
/**
 * TeamPlayerHistory create
 */
export type TeamPlayerHistoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
    /**
     * The data needed to create a TeamPlayerHistory.
     */
    data: Prisma.XOR<Prisma.TeamPlayerHistoryCreateInput, Prisma.TeamPlayerHistoryUncheckedCreateInput>;
};
/**
 * TeamPlayerHistory createMany
 */
export type TeamPlayerHistoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamPlayerHistories.
     */
    data: Prisma.TeamPlayerHistoryCreateManyInput | Prisma.TeamPlayerHistoryCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * TeamPlayerHistory update
 */
export type TeamPlayerHistoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
    /**
     * The data needed to update a TeamPlayerHistory.
     */
    data: Prisma.XOR<Prisma.TeamPlayerHistoryUpdateInput, Prisma.TeamPlayerHistoryUncheckedUpdateInput>;
    /**
     * Choose, which TeamPlayerHistory to update.
     */
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
};
/**
 * TeamPlayerHistory updateMany
 */
export type TeamPlayerHistoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamPlayerHistories.
     */
    data: Prisma.XOR<Prisma.TeamPlayerHistoryUpdateManyMutationInput, Prisma.TeamPlayerHistoryUncheckedUpdateManyInput>;
    /**
     * Filter which TeamPlayerHistories to update
     */
    where?: Prisma.TeamPlayerHistoryWhereInput;
    /**
     * Limit how many TeamPlayerHistories to update.
     */
    limit?: number;
};
/**
 * TeamPlayerHistory upsert
 */
export type TeamPlayerHistoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
    /**
     * The filter to search for the TeamPlayerHistory to update in case it exists.
     */
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
    /**
     * In case the TeamPlayerHistory found by the `where` argument doesn't exist, create a new TeamPlayerHistory with this data.
     */
    create: Prisma.XOR<Prisma.TeamPlayerHistoryCreateInput, Prisma.TeamPlayerHistoryUncheckedCreateInput>;
    /**
     * In case the TeamPlayerHistory was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.TeamPlayerHistoryUpdateInput, Prisma.TeamPlayerHistoryUncheckedUpdateInput>;
};
/**
 * TeamPlayerHistory delete
 */
export type TeamPlayerHistoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
    /**
     * Filter which TeamPlayerHistory to delete.
     */
    where: Prisma.TeamPlayerHistoryWhereUniqueInput;
};
/**
 * TeamPlayerHistory deleteMany
 */
export type TeamPlayerHistoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TeamPlayerHistories to delete
     */
    where?: Prisma.TeamPlayerHistoryWhereInput;
    /**
     * Limit how many TeamPlayerHistories to delete.
     */
    limit?: number;
};
/**
 * TeamPlayerHistory without action
 */
export type TeamPlayerHistoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayerHistory
     */
    select?: Prisma.TeamPlayerHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayerHistory
     */
    omit?: Prisma.TeamPlayerHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerHistoryInclude<ExtArgs> | null;
};
//# sourceMappingURL=TeamPlayerHistory.d.ts.map