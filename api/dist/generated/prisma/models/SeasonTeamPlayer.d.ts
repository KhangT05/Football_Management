import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model SeasonTeamPlayer
 *
 */
export type SeasonTeamPlayerModel = runtime.Types.Result.DefaultSelection<Prisma.$SeasonTeamPlayerPayload>;
export type AggregateSeasonTeamPlayer = {
    _count: SeasonTeamPlayerCountAggregateOutputType | null;
    _avg: SeasonTeamPlayerAvgAggregateOutputType | null;
    _sum: SeasonTeamPlayerSumAggregateOutputType | null;
    _min: SeasonTeamPlayerMinAggregateOutputType | null;
    _max: SeasonTeamPlayerMaxAggregateOutputType | null;
};
export type SeasonTeamPlayerAvgAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    team_player_id: number | null;
    jersey_number: number | null;
};
export type SeasonTeamPlayerSumAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    team_player_id: number | null;
    jersey_number: number | null;
};
export type SeasonTeamPlayerMinAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    team_player_id: number | null;
    jersey_number: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
};
export type SeasonTeamPlayerMaxAggregateOutputType = {
    id: number | null;
    season_team_id: number | null;
    team_player_id: number | null;
    jersey_number: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
};
export type SeasonTeamPlayerCountAggregateOutputType = {
    id: number;
    season_team_id: number;
    team_player_id: number;
    jersey_number: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    _all: number;
};
export type SeasonTeamPlayerAvgAggregateInputType = {
    id?: true;
    season_team_id?: true;
    team_player_id?: true;
    jersey_number?: true;
};
export type SeasonTeamPlayerSumAggregateInputType = {
    id?: true;
    season_team_id?: true;
    team_player_id?: true;
    jersey_number?: true;
};
export type SeasonTeamPlayerMinAggregateInputType = {
    id?: true;
    season_team_id?: true;
    team_player_id?: true;
    jersey_number?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
};
export type SeasonTeamPlayerMaxAggregateInputType = {
    id?: true;
    season_team_id?: true;
    team_player_id?: true;
    jersey_number?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
};
export type SeasonTeamPlayerCountAggregateInputType = {
    id?: true;
    season_team_id?: true;
    team_player_id?: true;
    jersey_number?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    _all?: true;
};
export type SeasonTeamPlayerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonTeamPlayer to aggregate.
     */
    where?: Prisma.SeasonTeamPlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeamPlayers to fetch.
     */
    orderBy?: Prisma.SeasonTeamPlayerOrderByWithRelationInput | Prisma.SeasonTeamPlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.SeasonTeamPlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeamPlayers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeamPlayers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SeasonTeamPlayers
    **/
    _count?: true | SeasonTeamPlayerCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: SeasonTeamPlayerAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: SeasonTeamPlayerSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SeasonTeamPlayerMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SeasonTeamPlayerMaxAggregateInputType;
};
export type GetSeasonTeamPlayerAggregateType<T extends SeasonTeamPlayerAggregateArgs> = {
    [P in keyof T & keyof AggregateSeasonTeamPlayer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSeasonTeamPlayer[P]> : Prisma.GetScalarType<T[P], AggregateSeasonTeamPlayer[P]>;
};
export type SeasonTeamPlayerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonTeamPlayerWhereInput;
    orderBy?: Prisma.SeasonTeamPlayerOrderByWithAggregationInput | Prisma.SeasonTeamPlayerOrderByWithAggregationInput[];
    by: Prisma.SeasonTeamPlayerScalarFieldEnum[] | Prisma.SeasonTeamPlayerScalarFieldEnum;
    having?: Prisma.SeasonTeamPlayerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SeasonTeamPlayerCountAggregateInputType | true;
    _avg?: SeasonTeamPlayerAvgAggregateInputType;
    _sum?: SeasonTeamPlayerSumAggregateInputType;
    _min?: SeasonTeamPlayerMinAggregateInputType;
    _max?: SeasonTeamPlayerMaxAggregateInputType;
};
export type SeasonTeamPlayerGroupByOutputType = {
    id: number;
    season_team_id: number;
    team_player_id: number;
    jersey_number: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    _count: SeasonTeamPlayerCountAggregateOutputType | null;
    _avg: SeasonTeamPlayerAvgAggregateOutputType | null;
    _sum: SeasonTeamPlayerSumAggregateOutputType | null;
    _min: SeasonTeamPlayerMinAggregateOutputType | null;
    _max: SeasonTeamPlayerMaxAggregateOutputType | null;
};
export type GetSeasonTeamPlayerGroupByPayload<T extends SeasonTeamPlayerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SeasonTeamPlayerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SeasonTeamPlayerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SeasonTeamPlayerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SeasonTeamPlayerGroupByOutputType[P]>;
}>>;
export type SeasonTeamPlayerWhereInput = {
    AND?: Prisma.SeasonTeamPlayerWhereInput | Prisma.SeasonTeamPlayerWhereInput[];
    OR?: Prisma.SeasonTeamPlayerWhereInput[];
    NOT?: Prisma.SeasonTeamPlayerWhereInput | Prisma.SeasonTeamPlayerWhereInput[];
    id?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    season_team_id?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    team_player_id?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    jersey_number?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    is_active?: Prisma.BoolFilter<"SeasonTeamPlayer"> | boolean;
    created_at?: Prisma.DateTimeFilter<"SeasonTeamPlayer"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"SeasonTeamPlayer"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"SeasonTeamPlayer"> | Date | string | null;
    season_team?: Prisma.XOR<Prisma.SeasonTeamScalarRelationFilter, Prisma.SeasonTeamWhereInput>;
    team_player?: Prisma.XOR<Prisma.TeamPlayerScalarRelationFilter, Prisma.TeamPlayerWhereInput>;
};
export type SeasonTeamPlayerOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    team_player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    season_team?: Prisma.SeasonTeamOrderByWithRelationInput;
    team_player?: Prisma.TeamPlayerOrderByWithRelationInput;
};
export type SeasonTeamPlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    season_team_id_team_player_id?: Prisma.SeasonTeamPlayerSeason_team_idTeam_player_idCompoundUniqueInput;
    AND?: Prisma.SeasonTeamPlayerWhereInput | Prisma.SeasonTeamPlayerWhereInput[];
    OR?: Prisma.SeasonTeamPlayerWhereInput[];
    NOT?: Prisma.SeasonTeamPlayerWhereInput | Prisma.SeasonTeamPlayerWhereInput[];
    season_team_id?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    team_player_id?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    jersey_number?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    is_active?: Prisma.BoolFilter<"SeasonTeamPlayer"> | boolean;
    created_at?: Prisma.DateTimeFilter<"SeasonTeamPlayer"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"SeasonTeamPlayer"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"SeasonTeamPlayer"> | Date | string | null;
    season_team?: Prisma.XOR<Prisma.SeasonTeamScalarRelationFilter, Prisma.SeasonTeamWhereInput>;
    team_player?: Prisma.XOR<Prisma.TeamPlayerScalarRelationFilter, Prisma.TeamPlayerWhereInput>;
}, "id" | "season_team_id_team_player_id">;
export type SeasonTeamPlayerOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    team_player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.SeasonTeamPlayerCountOrderByAggregateInput;
    _avg?: Prisma.SeasonTeamPlayerAvgOrderByAggregateInput;
    _max?: Prisma.SeasonTeamPlayerMaxOrderByAggregateInput;
    _min?: Prisma.SeasonTeamPlayerMinOrderByAggregateInput;
    _sum?: Prisma.SeasonTeamPlayerSumOrderByAggregateInput;
};
export type SeasonTeamPlayerScalarWhereWithAggregatesInput = {
    AND?: Prisma.SeasonTeamPlayerScalarWhereWithAggregatesInput | Prisma.SeasonTeamPlayerScalarWhereWithAggregatesInput[];
    OR?: Prisma.SeasonTeamPlayerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SeasonTeamPlayerScalarWhereWithAggregatesInput | Prisma.SeasonTeamPlayerScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"SeasonTeamPlayer"> | number;
    season_team_id?: Prisma.IntWithAggregatesFilter<"SeasonTeamPlayer"> | number;
    team_player_id?: Prisma.IntWithAggregatesFilter<"SeasonTeamPlayer"> | number;
    jersey_number?: Prisma.IntWithAggregatesFilter<"SeasonTeamPlayer"> | number;
    is_active?: Prisma.BoolWithAggregatesFilter<"SeasonTeamPlayer"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"SeasonTeamPlayer"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"SeasonTeamPlayer"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"SeasonTeamPlayer"> | Date | string | null;
};
export type SeasonTeamPlayerCreateInput = {
    jersey_number: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    season_team: Prisma.SeasonTeamCreateNestedOneWithoutSeasonTeamPlayersInput;
    team_player: Prisma.TeamPlayerCreateNestedOneWithoutSeasonTeamPlayersInput;
};
export type SeasonTeamPlayerUncheckedCreateInput = {
    id?: number;
    season_team_id: number;
    team_player_id: number;
    jersey_number: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type SeasonTeamPlayerUpdateInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    season_team?: Prisma.SeasonTeamUpdateOneRequiredWithoutSeasonTeamPlayersNestedInput;
    team_player?: Prisma.TeamPlayerUpdateOneRequiredWithoutSeasonTeamPlayersNestedInput;
};
export type SeasonTeamPlayerUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type SeasonTeamPlayerCreateManyInput = {
    id?: number;
    season_team_id: number;
    team_player_id: number;
    jersey_number: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type SeasonTeamPlayerUpdateManyMutationInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type SeasonTeamPlayerUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type SeasonTeamPlayerListRelationFilter = {
    every?: Prisma.SeasonTeamPlayerWhereInput;
    some?: Prisma.SeasonTeamPlayerWhereInput;
    none?: Prisma.SeasonTeamPlayerWhereInput;
};
export type SeasonTeamPlayerOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SeasonTeamPlayerSeason_team_idTeam_player_idCompoundUniqueInput = {
    season_team_id: number;
    team_player_id: number;
};
export type SeasonTeamPlayerCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    team_player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type SeasonTeamPlayerAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    team_player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
};
export type SeasonTeamPlayerMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    team_player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type SeasonTeamPlayerMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    team_player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type SeasonTeamPlayerSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_team_id?: Prisma.SortOrder;
    team_player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
};
export type SeasonTeamPlayerCreateNestedManyWithoutTeam_playerInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput> | Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput[] | Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput[];
    connectOrCreate?: Prisma.SeasonTeamPlayerCreateOrConnectWithoutTeam_playerInput | Prisma.SeasonTeamPlayerCreateOrConnectWithoutTeam_playerInput[];
    createMany?: Prisma.SeasonTeamPlayerCreateManyTeam_playerInputEnvelope;
    connect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
};
export type SeasonTeamPlayerUncheckedCreateNestedManyWithoutTeam_playerInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput> | Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput[] | Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput[];
    connectOrCreate?: Prisma.SeasonTeamPlayerCreateOrConnectWithoutTeam_playerInput | Prisma.SeasonTeamPlayerCreateOrConnectWithoutTeam_playerInput[];
    createMany?: Prisma.SeasonTeamPlayerCreateManyTeam_playerInputEnvelope;
    connect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
};
export type SeasonTeamPlayerUpdateManyWithoutTeam_playerNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput> | Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput[] | Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput[];
    connectOrCreate?: Prisma.SeasonTeamPlayerCreateOrConnectWithoutTeam_playerInput | Prisma.SeasonTeamPlayerCreateOrConnectWithoutTeam_playerInput[];
    upsert?: Prisma.SeasonTeamPlayerUpsertWithWhereUniqueWithoutTeam_playerInput | Prisma.SeasonTeamPlayerUpsertWithWhereUniqueWithoutTeam_playerInput[];
    createMany?: Prisma.SeasonTeamPlayerCreateManyTeam_playerInputEnvelope;
    set?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    delete?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    connect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    update?: Prisma.SeasonTeamPlayerUpdateWithWhereUniqueWithoutTeam_playerInput | Prisma.SeasonTeamPlayerUpdateWithWhereUniqueWithoutTeam_playerInput[];
    updateMany?: Prisma.SeasonTeamPlayerUpdateManyWithWhereWithoutTeam_playerInput | Prisma.SeasonTeamPlayerUpdateManyWithWhereWithoutTeam_playerInput[];
    deleteMany?: Prisma.SeasonTeamPlayerScalarWhereInput | Prisma.SeasonTeamPlayerScalarWhereInput[];
};
export type SeasonTeamPlayerUncheckedUpdateManyWithoutTeam_playerNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput> | Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput[] | Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput[];
    connectOrCreate?: Prisma.SeasonTeamPlayerCreateOrConnectWithoutTeam_playerInput | Prisma.SeasonTeamPlayerCreateOrConnectWithoutTeam_playerInput[];
    upsert?: Prisma.SeasonTeamPlayerUpsertWithWhereUniqueWithoutTeam_playerInput | Prisma.SeasonTeamPlayerUpsertWithWhereUniqueWithoutTeam_playerInput[];
    createMany?: Prisma.SeasonTeamPlayerCreateManyTeam_playerInputEnvelope;
    set?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    delete?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    connect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    update?: Prisma.SeasonTeamPlayerUpdateWithWhereUniqueWithoutTeam_playerInput | Prisma.SeasonTeamPlayerUpdateWithWhereUniqueWithoutTeam_playerInput[];
    updateMany?: Prisma.SeasonTeamPlayerUpdateManyWithWhereWithoutTeam_playerInput | Prisma.SeasonTeamPlayerUpdateManyWithWhereWithoutTeam_playerInput[];
    deleteMany?: Prisma.SeasonTeamPlayerScalarWhereInput | Prisma.SeasonTeamPlayerScalarWhereInput[];
};
export type SeasonTeamPlayerCreateNestedManyWithoutSeason_teamInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput> | Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput[] | Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.SeasonTeamPlayerCreateOrConnectWithoutSeason_teamInput | Prisma.SeasonTeamPlayerCreateOrConnectWithoutSeason_teamInput[];
    createMany?: Prisma.SeasonTeamPlayerCreateManySeason_teamInputEnvelope;
    connect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
};
export type SeasonTeamPlayerUncheckedCreateNestedManyWithoutSeason_teamInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput> | Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput[] | Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.SeasonTeamPlayerCreateOrConnectWithoutSeason_teamInput | Prisma.SeasonTeamPlayerCreateOrConnectWithoutSeason_teamInput[];
    createMany?: Prisma.SeasonTeamPlayerCreateManySeason_teamInputEnvelope;
    connect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
};
export type SeasonTeamPlayerUpdateManyWithoutSeason_teamNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput> | Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput[] | Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.SeasonTeamPlayerCreateOrConnectWithoutSeason_teamInput | Prisma.SeasonTeamPlayerCreateOrConnectWithoutSeason_teamInput[];
    upsert?: Prisma.SeasonTeamPlayerUpsertWithWhereUniqueWithoutSeason_teamInput | Prisma.SeasonTeamPlayerUpsertWithWhereUniqueWithoutSeason_teamInput[];
    createMany?: Prisma.SeasonTeamPlayerCreateManySeason_teamInputEnvelope;
    set?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    delete?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    connect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    update?: Prisma.SeasonTeamPlayerUpdateWithWhereUniqueWithoutSeason_teamInput | Prisma.SeasonTeamPlayerUpdateWithWhereUniqueWithoutSeason_teamInput[];
    updateMany?: Prisma.SeasonTeamPlayerUpdateManyWithWhereWithoutSeason_teamInput | Prisma.SeasonTeamPlayerUpdateManyWithWhereWithoutSeason_teamInput[];
    deleteMany?: Prisma.SeasonTeamPlayerScalarWhereInput | Prisma.SeasonTeamPlayerScalarWhereInput[];
};
export type SeasonTeamPlayerUncheckedUpdateManyWithoutSeason_teamNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput> | Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput[] | Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput[];
    connectOrCreate?: Prisma.SeasonTeamPlayerCreateOrConnectWithoutSeason_teamInput | Prisma.SeasonTeamPlayerCreateOrConnectWithoutSeason_teamInput[];
    upsert?: Prisma.SeasonTeamPlayerUpsertWithWhereUniqueWithoutSeason_teamInput | Prisma.SeasonTeamPlayerUpsertWithWhereUniqueWithoutSeason_teamInput[];
    createMany?: Prisma.SeasonTeamPlayerCreateManySeason_teamInputEnvelope;
    set?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    delete?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    connect?: Prisma.SeasonTeamPlayerWhereUniqueInput | Prisma.SeasonTeamPlayerWhereUniqueInput[];
    update?: Prisma.SeasonTeamPlayerUpdateWithWhereUniqueWithoutSeason_teamInput | Prisma.SeasonTeamPlayerUpdateWithWhereUniqueWithoutSeason_teamInput[];
    updateMany?: Prisma.SeasonTeamPlayerUpdateManyWithWhereWithoutSeason_teamInput | Prisma.SeasonTeamPlayerUpdateManyWithWhereWithoutSeason_teamInput[];
    deleteMany?: Prisma.SeasonTeamPlayerScalarWhereInput | Prisma.SeasonTeamPlayerScalarWhereInput[];
};
export type SeasonTeamPlayerCreateWithoutTeam_playerInput = {
    jersey_number: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    season_team: Prisma.SeasonTeamCreateNestedOneWithoutSeasonTeamPlayersInput;
};
export type SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput = {
    id?: number;
    season_team_id: number;
    jersey_number: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type SeasonTeamPlayerCreateOrConnectWithoutTeam_playerInput = {
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput>;
};
export type SeasonTeamPlayerCreateManyTeam_playerInputEnvelope = {
    data: Prisma.SeasonTeamPlayerCreateManyTeam_playerInput | Prisma.SeasonTeamPlayerCreateManyTeam_playerInput[];
    skipDuplicates?: boolean;
};
export type SeasonTeamPlayerUpsertWithWhereUniqueWithoutTeam_playerInput = {
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonTeamPlayerUpdateWithoutTeam_playerInput, Prisma.SeasonTeamPlayerUncheckedUpdateWithoutTeam_playerInput>;
    create: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutTeam_playerInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutTeam_playerInput>;
};
export type SeasonTeamPlayerUpdateWithWhereUniqueWithoutTeam_playerInput = {
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonTeamPlayerUpdateWithoutTeam_playerInput, Prisma.SeasonTeamPlayerUncheckedUpdateWithoutTeam_playerInput>;
};
export type SeasonTeamPlayerUpdateManyWithWhereWithoutTeam_playerInput = {
    where: Prisma.SeasonTeamPlayerScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamPlayerUpdateManyMutationInput, Prisma.SeasonTeamPlayerUncheckedUpdateManyWithoutTeam_playerInput>;
};
export type SeasonTeamPlayerScalarWhereInput = {
    AND?: Prisma.SeasonTeamPlayerScalarWhereInput | Prisma.SeasonTeamPlayerScalarWhereInput[];
    OR?: Prisma.SeasonTeamPlayerScalarWhereInput[];
    NOT?: Prisma.SeasonTeamPlayerScalarWhereInput | Prisma.SeasonTeamPlayerScalarWhereInput[];
    id?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    season_team_id?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    team_player_id?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    jersey_number?: Prisma.IntFilter<"SeasonTeamPlayer"> | number;
    is_active?: Prisma.BoolFilter<"SeasonTeamPlayer"> | boolean;
    created_at?: Prisma.DateTimeFilter<"SeasonTeamPlayer"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"SeasonTeamPlayer"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"SeasonTeamPlayer"> | Date | string | null;
};
export type SeasonTeamPlayerCreateWithoutSeason_teamInput = {
    jersey_number: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_player: Prisma.TeamPlayerCreateNestedOneWithoutSeasonTeamPlayersInput;
};
export type SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput = {
    id?: number;
    team_player_id: number;
    jersey_number: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type SeasonTeamPlayerCreateOrConnectWithoutSeason_teamInput = {
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput>;
};
export type SeasonTeamPlayerCreateManySeason_teamInputEnvelope = {
    data: Prisma.SeasonTeamPlayerCreateManySeason_teamInput | Prisma.SeasonTeamPlayerCreateManySeason_teamInput[];
    skipDuplicates?: boolean;
};
export type SeasonTeamPlayerUpsertWithWhereUniqueWithoutSeason_teamInput = {
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonTeamPlayerUpdateWithoutSeason_teamInput, Prisma.SeasonTeamPlayerUncheckedUpdateWithoutSeason_teamInput>;
    create: Prisma.XOR<Prisma.SeasonTeamPlayerCreateWithoutSeason_teamInput, Prisma.SeasonTeamPlayerUncheckedCreateWithoutSeason_teamInput>;
};
export type SeasonTeamPlayerUpdateWithWhereUniqueWithoutSeason_teamInput = {
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonTeamPlayerUpdateWithoutSeason_teamInput, Prisma.SeasonTeamPlayerUncheckedUpdateWithoutSeason_teamInput>;
};
export type SeasonTeamPlayerUpdateManyWithWhereWithoutSeason_teamInput = {
    where: Prisma.SeasonTeamPlayerScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonTeamPlayerUpdateManyMutationInput, Prisma.SeasonTeamPlayerUncheckedUpdateManyWithoutSeason_teamInput>;
};
export type SeasonTeamPlayerCreateManyTeam_playerInput = {
    id?: number;
    season_team_id: number;
    jersey_number: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type SeasonTeamPlayerUpdateWithoutTeam_playerInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    season_team?: Prisma.SeasonTeamUpdateOneRequiredWithoutSeasonTeamPlayersNestedInput;
};
export type SeasonTeamPlayerUncheckedUpdateWithoutTeam_playerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type SeasonTeamPlayerUncheckedUpdateManyWithoutTeam_playerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type SeasonTeamPlayerCreateManySeason_teamInput = {
    id?: number;
    team_player_id: number;
    jersey_number: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type SeasonTeamPlayerUpdateWithoutSeason_teamInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_player?: Prisma.TeamPlayerUpdateOneRequiredWithoutSeasonTeamPlayersNestedInput;
};
export type SeasonTeamPlayerUncheckedUpdateWithoutSeason_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type SeasonTeamPlayerUncheckedUpdateManyWithoutSeason_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type SeasonTeamPlayerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    season_team_id?: boolean;
    team_player_id?: boolean;
    jersey_number?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    season_team?: boolean | Prisma.SeasonTeamDefaultArgs<ExtArgs>;
    team_player?: boolean | Prisma.TeamPlayerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["seasonTeamPlayer"]>;
export type SeasonTeamPlayerSelectScalar = {
    id?: boolean;
    season_team_id?: boolean;
    team_player_id?: boolean;
    jersey_number?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
};
export type SeasonTeamPlayerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "season_team_id" | "team_player_id" | "jersey_number" | "is_active" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["seasonTeamPlayer"]>;
export type SeasonTeamPlayerInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    season_team?: boolean | Prisma.SeasonTeamDefaultArgs<ExtArgs>;
    team_player?: boolean | Prisma.TeamPlayerDefaultArgs<ExtArgs>;
};
export type $SeasonTeamPlayerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SeasonTeamPlayer";
    objects: {
        season_team: Prisma.$SeasonTeamPayload<ExtArgs>;
        team_player: Prisma.$TeamPlayerPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        season_team_id: number;
        team_player_id: number;
        jersey_number: number;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
    }, ExtArgs["result"]["seasonTeamPlayer"]>;
    composites: {};
};
export type SeasonTeamPlayerGetPayload<S extends boolean | null | undefined | SeasonTeamPlayerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload, S>;
export type SeasonTeamPlayerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SeasonTeamPlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SeasonTeamPlayerCountAggregateInputType | true;
};
export interface SeasonTeamPlayerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SeasonTeamPlayer'];
        meta: {
            name: 'SeasonTeamPlayer';
        };
    };
    /**
     * Find zero or one SeasonTeamPlayer that matches the filter.
     * @param {SeasonTeamPlayerFindUniqueArgs} args - Arguments to find a SeasonTeamPlayer
     * @example
     * // Get one SeasonTeamPlayer
     * const seasonTeamPlayer = await prisma.seasonTeamPlayer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeasonTeamPlayerFindUniqueArgs>(args: Prisma.SelectSubset<T, SeasonTeamPlayerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one SeasonTeamPlayer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeasonTeamPlayerFindUniqueOrThrowArgs} args - Arguments to find a SeasonTeamPlayer
     * @example
     * // Get one SeasonTeamPlayer
     * const seasonTeamPlayer = await prisma.seasonTeamPlayer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeasonTeamPlayerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SeasonTeamPlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SeasonTeamPlayer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamPlayerFindFirstArgs} args - Arguments to find a SeasonTeamPlayer
     * @example
     * // Get one SeasonTeamPlayer
     * const seasonTeamPlayer = await prisma.seasonTeamPlayer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeasonTeamPlayerFindFirstArgs>(args?: Prisma.SelectSubset<T, SeasonTeamPlayerFindFirstArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SeasonTeamPlayer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamPlayerFindFirstOrThrowArgs} args - Arguments to find a SeasonTeamPlayer
     * @example
     * // Get one SeasonTeamPlayer
     * const seasonTeamPlayer = await prisma.seasonTeamPlayer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeasonTeamPlayerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SeasonTeamPlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more SeasonTeamPlayers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamPlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeasonTeamPlayers
     * const seasonTeamPlayers = await prisma.seasonTeamPlayer.findMany()
     *
     * // Get first 10 SeasonTeamPlayers
     * const seasonTeamPlayers = await prisma.seasonTeamPlayer.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const seasonTeamPlayerWithIdOnly = await prisma.seasonTeamPlayer.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SeasonTeamPlayerFindManyArgs>(args?: Prisma.SelectSubset<T, SeasonTeamPlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a SeasonTeamPlayer.
     * @param {SeasonTeamPlayerCreateArgs} args - Arguments to create a SeasonTeamPlayer.
     * @example
     * // Create one SeasonTeamPlayer
     * const SeasonTeamPlayer = await prisma.seasonTeamPlayer.create({
     *   data: {
     *     // ... data to create a SeasonTeamPlayer
     *   }
     * })
     *
     */
    create<T extends SeasonTeamPlayerCreateArgs>(args: Prisma.SelectSubset<T, SeasonTeamPlayerCreateArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many SeasonTeamPlayers.
     * @param {SeasonTeamPlayerCreateManyArgs} args - Arguments to create many SeasonTeamPlayers.
     * @example
     * // Create many SeasonTeamPlayers
     * const seasonTeamPlayer = await prisma.seasonTeamPlayer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SeasonTeamPlayerCreateManyArgs>(args?: Prisma.SelectSubset<T, SeasonTeamPlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a SeasonTeamPlayer.
     * @param {SeasonTeamPlayerDeleteArgs} args - Arguments to delete one SeasonTeamPlayer.
     * @example
     * // Delete one SeasonTeamPlayer
     * const SeasonTeamPlayer = await prisma.seasonTeamPlayer.delete({
     *   where: {
     *     // ... filter to delete one SeasonTeamPlayer
     *   }
     * })
     *
     */
    delete<T extends SeasonTeamPlayerDeleteArgs>(args: Prisma.SelectSubset<T, SeasonTeamPlayerDeleteArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one SeasonTeamPlayer.
     * @param {SeasonTeamPlayerUpdateArgs} args - Arguments to update one SeasonTeamPlayer.
     * @example
     * // Update one SeasonTeamPlayer
     * const seasonTeamPlayer = await prisma.seasonTeamPlayer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SeasonTeamPlayerUpdateArgs>(args: Prisma.SelectSubset<T, SeasonTeamPlayerUpdateArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more SeasonTeamPlayers.
     * @param {SeasonTeamPlayerDeleteManyArgs} args - Arguments to filter SeasonTeamPlayers to delete.
     * @example
     * // Delete a few SeasonTeamPlayers
     * const { count } = await prisma.seasonTeamPlayer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SeasonTeamPlayerDeleteManyArgs>(args?: Prisma.SelectSubset<T, SeasonTeamPlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more SeasonTeamPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamPlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeasonTeamPlayers
     * const seasonTeamPlayer = await prisma.seasonTeamPlayer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SeasonTeamPlayerUpdateManyArgs>(args: Prisma.SelectSubset<T, SeasonTeamPlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one SeasonTeamPlayer.
     * @param {SeasonTeamPlayerUpsertArgs} args - Arguments to update or create a SeasonTeamPlayer.
     * @example
     * // Update or create a SeasonTeamPlayer
     * const seasonTeamPlayer = await prisma.seasonTeamPlayer.upsert({
     *   create: {
     *     // ... data to create a SeasonTeamPlayer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeasonTeamPlayer we want to update
     *   }
     * })
     */
    upsert<T extends SeasonTeamPlayerUpsertArgs>(args: Prisma.SelectSubset<T, SeasonTeamPlayerUpsertArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of SeasonTeamPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamPlayerCountArgs} args - Arguments to filter SeasonTeamPlayers to count.
     * @example
     * // Count the number of SeasonTeamPlayers
     * const count = await prisma.seasonTeamPlayer.count({
     *   where: {
     *     // ... the filter for the SeasonTeamPlayers we want to count
     *   }
     * })
    **/
    count<T extends SeasonTeamPlayerCountArgs>(args?: Prisma.Subset<T, SeasonTeamPlayerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SeasonTeamPlayerCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a SeasonTeamPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamPlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SeasonTeamPlayerAggregateArgs>(args: Prisma.Subset<T, SeasonTeamPlayerAggregateArgs>): Prisma.PrismaPromise<GetSeasonTeamPlayerAggregateType<T>>;
    /**
     * Group by SeasonTeamPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonTeamPlayerGroupByArgs} args - Group by arguments.
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
    groupBy<T extends SeasonTeamPlayerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SeasonTeamPlayerGroupByArgs['orderBy'];
    } : {
        orderBy?: SeasonTeamPlayerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SeasonTeamPlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeasonTeamPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the SeasonTeamPlayer model
     */
    readonly fields: SeasonTeamPlayerFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for SeasonTeamPlayer.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__SeasonTeamPlayerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    season_team<T extends Prisma.SeasonTeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonTeamDefaultArgs<ExtArgs>>): Prisma.Prisma__SeasonTeamClient<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    team_player<T extends Prisma.TeamPlayerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamPlayerDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the SeasonTeamPlayer model
 */
export interface SeasonTeamPlayerFieldRefs {
    readonly id: Prisma.FieldRef<"SeasonTeamPlayer", 'Int'>;
    readonly season_team_id: Prisma.FieldRef<"SeasonTeamPlayer", 'Int'>;
    readonly team_player_id: Prisma.FieldRef<"SeasonTeamPlayer", 'Int'>;
    readonly jersey_number: Prisma.FieldRef<"SeasonTeamPlayer", 'Int'>;
    readonly is_active: Prisma.FieldRef<"SeasonTeamPlayer", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"SeasonTeamPlayer", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"SeasonTeamPlayer", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"SeasonTeamPlayer", 'DateTime'>;
}
/**
 * SeasonTeamPlayer findUnique
 */
export type SeasonTeamPlayerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamPlayer to fetch.
     */
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
};
/**
 * SeasonTeamPlayer findUniqueOrThrow
 */
export type SeasonTeamPlayerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamPlayer to fetch.
     */
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
};
/**
 * SeasonTeamPlayer findFirst
 */
export type SeasonTeamPlayerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamPlayer to fetch.
     */
    where?: Prisma.SeasonTeamPlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeamPlayers to fetch.
     */
    orderBy?: Prisma.SeasonTeamPlayerOrderByWithRelationInput | Prisma.SeasonTeamPlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeasonTeamPlayers.
     */
    cursor?: Prisma.SeasonTeamPlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeamPlayers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeamPlayers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonTeamPlayers.
     */
    distinct?: Prisma.SeasonTeamPlayerScalarFieldEnum | Prisma.SeasonTeamPlayerScalarFieldEnum[];
};
/**
 * SeasonTeamPlayer findFirstOrThrow
 */
export type SeasonTeamPlayerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamPlayer to fetch.
     */
    where?: Prisma.SeasonTeamPlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeamPlayers to fetch.
     */
    orderBy?: Prisma.SeasonTeamPlayerOrderByWithRelationInput | Prisma.SeasonTeamPlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeasonTeamPlayers.
     */
    cursor?: Prisma.SeasonTeamPlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeamPlayers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeamPlayers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonTeamPlayers.
     */
    distinct?: Prisma.SeasonTeamPlayerScalarFieldEnum | Prisma.SeasonTeamPlayerScalarFieldEnum[];
};
/**
 * SeasonTeamPlayer findMany
 */
export type SeasonTeamPlayerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonTeamPlayers to fetch.
     */
    where?: Prisma.SeasonTeamPlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonTeamPlayers to fetch.
     */
    orderBy?: Prisma.SeasonTeamPlayerOrderByWithRelationInput | Prisma.SeasonTeamPlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SeasonTeamPlayers.
     */
    cursor?: Prisma.SeasonTeamPlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonTeamPlayers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonTeamPlayers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonTeamPlayers.
     */
    distinct?: Prisma.SeasonTeamPlayerScalarFieldEnum | Prisma.SeasonTeamPlayerScalarFieldEnum[];
};
/**
 * SeasonTeamPlayer create
 */
export type SeasonTeamPlayerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
    /**
     * The data needed to create a SeasonTeamPlayer.
     */
    data: Prisma.XOR<Prisma.SeasonTeamPlayerCreateInput, Prisma.SeasonTeamPlayerUncheckedCreateInput>;
};
/**
 * SeasonTeamPlayer createMany
 */
export type SeasonTeamPlayerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeasonTeamPlayers.
     */
    data: Prisma.SeasonTeamPlayerCreateManyInput | Prisma.SeasonTeamPlayerCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * SeasonTeamPlayer update
 */
export type SeasonTeamPlayerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
    /**
     * The data needed to update a SeasonTeamPlayer.
     */
    data: Prisma.XOR<Prisma.SeasonTeamPlayerUpdateInput, Prisma.SeasonTeamPlayerUncheckedUpdateInput>;
    /**
     * Choose, which SeasonTeamPlayer to update.
     */
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
};
/**
 * SeasonTeamPlayer updateMany
 */
export type SeasonTeamPlayerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update SeasonTeamPlayers.
     */
    data: Prisma.XOR<Prisma.SeasonTeamPlayerUpdateManyMutationInput, Prisma.SeasonTeamPlayerUncheckedUpdateManyInput>;
    /**
     * Filter which SeasonTeamPlayers to update
     */
    where?: Prisma.SeasonTeamPlayerWhereInput;
    /**
     * Limit how many SeasonTeamPlayers to update.
     */
    limit?: number;
};
/**
 * SeasonTeamPlayer upsert
 */
export type SeasonTeamPlayerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
    /**
     * The filter to search for the SeasonTeamPlayer to update in case it exists.
     */
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
    /**
     * In case the SeasonTeamPlayer found by the `where` argument doesn't exist, create a new SeasonTeamPlayer with this data.
     */
    create: Prisma.XOR<Prisma.SeasonTeamPlayerCreateInput, Prisma.SeasonTeamPlayerUncheckedCreateInput>;
    /**
     * In case the SeasonTeamPlayer was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.SeasonTeamPlayerUpdateInput, Prisma.SeasonTeamPlayerUncheckedUpdateInput>;
};
/**
 * SeasonTeamPlayer delete
 */
export type SeasonTeamPlayerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter which SeasonTeamPlayer to delete.
     */
    where: Prisma.SeasonTeamPlayerWhereUniqueInput;
};
/**
 * SeasonTeamPlayer deleteMany
 */
export type SeasonTeamPlayerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonTeamPlayers to delete
     */
    where?: Prisma.SeasonTeamPlayerWhereInput;
    /**
     * Limit how many SeasonTeamPlayers to delete.
     */
    limit?: number;
};
/**
 * SeasonTeamPlayer without action
 */
export type SeasonTeamPlayerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonTeamPlayer
     */
    select?: Prisma.SeasonTeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonTeamPlayer
     */
    omit?: Prisma.SeasonTeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonTeamPlayerInclude<ExtArgs> | null;
};
//# sourceMappingURL=SeasonTeamPlayer.d.ts.map