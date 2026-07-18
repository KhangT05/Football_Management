import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Player
 *
 */
export type PlayerModel = runtime.Types.Result.DefaultSelection<Prisma.$PlayerPayload>;
export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null;
    _avg: PlayerAvgAggregateOutputType | null;
    _sum: PlayerSumAggregateOutputType | null;
    _min: PlayerMinAggregateOutputType | null;
    _max: PlayerMaxAggregateOutputType | null;
};
export type PlayerAvgAggregateOutputType = {
    id: number | null;
    height: runtime.Decimal | null;
    weight: runtime.Decimal | null;
    user_id: number | null;
};
export type PlayerSumAggregateOutputType = {
    id: number | null;
    height: runtime.Decimal | null;
    weight: runtime.Decimal | null;
    user_id: number | null;
};
export type PlayerMinAggregateOutputType = {
    id: number | null;
    date_of_birth: Date | null;
    position: $Enums.PlayerPosition | null;
    height: runtime.Decimal | null;
    weight: runtime.Decimal | null;
    nationality: string | null;
    avatar: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
};
export type PlayerMaxAggregateOutputType = {
    id: number | null;
    date_of_birth: Date | null;
    position: $Enums.PlayerPosition | null;
    height: runtime.Decimal | null;
    weight: runtime.Decimal | null;
    nationality: string | null;
    avatar: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
};
export type PlayerCountAggregateOutputType = {
    id: number;
    date_of_birth: number;
    position: number;
    height: number;
    weight: number;
    nationality: number;
    avatar: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    user_id: number;
    _all: number;
};
export type PlayerAvgAggregateInputType = {
    id?: true;
    height?: true;
    weight?: true;
    user_id?: true;
};
export type PlayerSumAggregateInputType = {
    id?: true;
    height?: true;
    weight?: true;
    user_id?: true;
};
export type PlayerMinAggregateInputType = {
    id?: true;
    date_of_birth?: true;
    position?: true;
    height?: true;
    weight?: true;
    nationality?: true;
    avatar?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
};
export type PlayerMaxAggregateInputType = {
    id?: true;
    date_of_birth?: true;
    position?: true;
    height?: true;
    weight?: true;
    nationality?: true;
    avatar?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
};
export type PlayerCountAggregateInputType = {
    id?: true;
    date_of_birth?: true;
    position?: true;
    height?: true;
    weight?: true;
    nationality?: true;
    avatar?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
    _all?: true;
};
export type PlayerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Player to aggregate.
     */
    where?: Prisma.PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Players to fetch.
     */
    orderBy?: Prisma.PlayerOrderByWithRelationInput | Prisma.PlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Players
    **/
    _count?: true | PlayerCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: PlayerAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: PlayerSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PlayerMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PlayerMaxAggregateInputType;
};
export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
    [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlayer[P]> : Prisma.GetScalarType<T[P], AggregatePlayer[P]>;
};
export type PlayerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlayerWhereInput;
    orderBy?: Prisma.PlayerOrderByWithAggregationInput | Prisma.PlayerOrderByWithAggregationInput[];
    by: Prisma.PlayerScalarFieldEnum[] | Prisma.PlayerScalarFieldEnum;
    having?: Prisma.PlayerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlayerCountAggregateInputType | true;
    _avg?: PlayerAvgAggregateInputType;
    _sum?: PlayerSumAggregateInputType;
    _min?: PlayerMinAggregateInputType;
    _max?: PlayerMaxAggregateInputType;
};
export type PlayerGroupByOutputType = {
    id: number;
    date_of_birth: Date;
    position: $Enums.PlayerPosition;
    height: runtime.Decimal | null;
    weight: runtime.Decimal | null;
    nationality: string | null;
    avatar: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number;
    _count: PlayerCountAggregateOutputType | null;
    _avg: PlayerAvgAggregateOutputType | null;
    _sum: PlayerSumAggregateOutputType | null;
    _min: PlayerMinAggregateOutputType | null;
    _max: PlayerMaxAggregateOutputType | null;
};
export type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlayerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlayerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlayerGroupByOutputType[P]>;
}>>;
export type PlayerWhereInput = {
    AND?: Prisma.PlayerWhereInput | Prisma.PlayerWhereInput[];
    OR?: Prisma.PlayerWhereInput[];
    NOT?: Prisma.PlayerWhereInput | Prisma.PlayerWhereInput[];
    id?: Prisma.IntFilter<"Player"> | number;
    date_of_birth?: Prisma.DateTimeFilter<"Player"> | Date | string;
    position?: Prisma.EnumPlayerPositionFilter<"Player"> | $Enums.PlayerPosition;
    height?: Prisma.DecimalNullableFilter<"Player"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.DecimalNullableFilter<"Player"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.StringNullableFilter<"Player"> | string | null;
    avatar?: Prisma.StringNullableFilter<"Player"> | string | null;
    is_active?: Prisma.BoolFilter<"Player"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Player"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Player"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Player"> | Date | string | null;
    user_id?: Prisma.IntFilter<"Player"> | number;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    team_players?: Prisma.TeamPlayerListRelationFilter;
    team_player_history?: Prisma.TeamPlayerHistoryListRelationFilter;
    playerStatistics?: Prisma.PlayerStatisticListRelationFilter;
    matchLineups?: Prisma.MatchLineupListRelationFilter;
    matchEvents?: Prisma.MatchEventListRelationFilter;
    matchEventsSubOut?: Prisma.MatchEventListRelationFilter;
};
export type PlayerOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    height?: Prisma.SortOrderInput | Prisma.SortOrder;
    weight?: Prisma.SortOrderInput | Prisma.SortOrder;
    nationality?: Prisma.SortOrderInput | Prisma.SortOrder;
    avatar?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    team_players?: Prisma.TeamPlayerOrderByRelationAggregateInput;
    team_player_history?: Prisma.TeamPlayerHistoryOrderByRelationAggregateInput;
    playerStatistics?: Prisma.PlayerStatisticOrderByRelationAggregateInput;
    matchLineups?: Prisma.MatchLineupOrderByRelationAggregateInput;
    matchEvents?: Prisma.MatchEventOrderByRelationAggregateInput;
    matchEventsSubOut?: Prisma.MatchEventOrderByRelationAggregateInput;
    _relevance?: Prisma.PlayerOrderByRelevanceInput;
};
export type PlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    user_id?: number;
    AND?: Prisma.PlayerWhereInput | Prisma.PlayerWhereInput[];
    OR?: Prisma.PlayerWhereInput[];
    NOT?: Prisma.PlayerWhereInput | Prisma.PlayerWhereInput[];
    date_of_birth?: Prisma.DateTimeFilter<"Player"> | Date | string;
    position?: Prisma.EnumPlayerPositionFilter<"Player"> | $Enums.PlayerPosition;
    height?: Prisma.DecimalNullableFilter<"Player"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.DecimalNullableFilter<"Player"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.StringNullableFilter<"Player"> | string | null;
    avatar?: Prisma.StringNullableFilter<"Player"> | string | null;
    is_active?: Prisma.BoolFilter<"Player"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Player"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Player"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Player"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    team_players?: Prisma.TeamPlayerListRelationFilter;
    team_player_history?: Prisma.TeamPlayerHistoryListRelationFilter;
    playerStatistics?: Prisma.PlayerStatisticListRelationFilter;
    matchLineups?: Prisma.MatchLineupListRelationFilter;
    matchEvents?: Prisma.MatchEventListRelationFilter;
    matchEventsSubOut?: Prisma.MatchEventListRelationFilter;
}, "id" | "user_id">;
export type PlayerOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    height?: Prisma.SortOrderInput | Prisma.SortOrder;
    weight?: Prisma.SortOrderInput | Prisma.SortOrder;
    nationality?: Prisma.SortOrderInput | Prisma.SortOrder;
    avatar?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    _count?: Prisma.PlayerCountOrderByAggregateInput;
    _avg?: Prisma.PlayerAvgOrderByAggregateInput;
    _max?: Prisma.PlayerMaxOrderByAggregateInput;
    _min?: Prisma.PlayerMinOrderByAggregateInput;
    _sum?: Prisma.PlayerSumOrderByAggregateInput;
};
export type PlayerScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlayerScalarWhereWithAggregatesInput | Prisma.PlayerScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlayerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlayerScalarWhereWithAggregatesInput | Prisma.PlayerScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Player"> | number;
    date_of_birth?: Prisma.DateTimeWithAggregatesFilter<"Player"> | Date | string;
    position?: Prisma.EnumPlayerPositionWithAggregatesFilter<"Player"> | $Enums.PlayerPosition;
    height?: Prisma.DecimalNullableWithAggregatesFilter<"Player"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.DecimalNullableWithAggregatesFilter<"Player"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.StringNullableWithAggregatesFilter<"Player"> | string | null;
    avatar?: Prisma.StringNullableWithAggregatesFilter<"Player"> | string | null;
    is_active?: Prisma.BoolWithAggregatesFilter<"Player"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Player"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Player"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Player"> | Date | string | null;
    user_id?: Prisma.IntWithAggregatesFilter<"Player"> | number;
};
export type PlayerCreateInput = {
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutPlayerInput;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerUncheckedCreateInput = {
    id?: number;
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id: number;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerUpdateInput = {
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutPlayerNestedInput;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerCreateManyInput = {
    id?: number;
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id: number;
};
export type PlayerUpdateManyMutationInput = {
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PlayerNullableScalarRelationFilter = {
    is?: Prisma.PlayerWhereInput | null;
    isNot?: Prisma.PlayerWhereInput | null;
};
export type PlayerOrderByRelevanceInput = {
    fields: Prisma.PlayerOrderByRelevanceFieldEnum | Prisma.PlayerOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type PlayerCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    weight?: Prisma.SortOrder;
    nationality?: Prisma.SortOrder;
    avatar?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type PlayerAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    weight?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type PlayerMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    weight?: Prisma.SortOrder;
    nationality?: Prisma.SortOrder;
    avatar?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type PlayerMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    weight?: Prisma.SortOrder;
    nationality?: Prisma.SortOrder;
    avatar?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type PlayerSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    weight?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type PlayerScalarRelationFilter = {
    is?: Prisma.PlayerWhereInput;
    isNot?: Prisma.PlayerWhereInput;
};
export type PlayerCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutUserInput, Prisma.PlayerUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutUserInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutUserInput, Prisma.PlayerUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutUserInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutUserInput, Prisma.PlayerUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutUserInput;
    upsert?: Prisma.PlayerUpsertWithoutUserInput;
    disconnect?: Prisma.PlayerWhereInput | boolean;
    delete?: Prisma.PlayerWhereInput | boolean;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutUserInput, Prisma.PlayerUpdateWithoutUserInput>, Prisma.PlayerUncheckedUpdateWithoutUserInput>;
};
export type PlayerUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutUserInput, Prisma.PlayerUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutUserInput;
    upsert?: Prisma.PlayerUpsertWithoutUserInput;
    disconnect?: Prisma.PlayerWhereInput | boolean;
    delete?: Prisma.PlayerWhereInput | boolean;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutUserInput, Prisma.PlayerUpdateWithoutUserInput>, Prisma.PlayerUncheckedUpdateWithoutUserInput>;
};
export type EnumPlayerPositionFieldUpdateOperationsInput = {
    set?: $Enums.PlayerPosition;
};
export type NullableDecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type PlayerCreateNestedOneWithoutTeam_playersInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutTeam_playersInput, Prisma.PlayerUncheckedCreateWithoutTeam_playersInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutTeam_playersInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUpdateOneRequiredWithoutTeam_playersNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutTeam_playersInput, Prisma.PlayerUncheckedCreateWithoutTeam_playersInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutTeam_playersInput;
    upsert?: Prisma.PlayerUpsertWithoutTeam_playersInput;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutTeam_playersInput, Prisma.PlayerUpdateWithoutTeam_playersInput>, Prisma.PlayerUncheckedUpdateWithoutTeam_playersInput>;
};
export type PlayerCreateNestedOneWithoutTeam_player_historyInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutTeam_player_historyInput, Prisma.PlayerUncheckedCreateWithoutTeam_player_historyInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutTeam_player_historyInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUpdateOneRequiredWithoutTeam_player_historyNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutTeam_player_historyInput, Prisma.PlayerUncheckedCreateWithoutTeam_player_historyInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutTeam_player_historyInput;
    upsert?: Prisma.PlayerUpsertWithoutTeam_player_historyInput;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutTeam_player_historyInput, Prisma.PlayerUpdateWithoutTeam_player_historyInput>, Prisma.PlayerUncheckedUpdateWithoutTeam_player_historyInput>;
};
export type PlayerCreateNestedOneWithoutMatchLineupsInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutMatchLineupsInput, Prisma.PlayerUncheckedCreateWithoutMatchLineupsInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutMatchLineupsInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUpdateOneRequiredWithoutMatchLineupsNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutMatchLineupsInput, Prisma.PlayerUncheckedCreateWithoutMatchLineupsInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutMatchLineupsInput;
    upsert?: Prisma.PlayerUpsertWithoutMatchLineupsInput;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutMatchLineupsInput, Prisma.PlayerUpdateWithoutMatchLineupsInput>, Prisma.PlayerUncheckedUpdateWithoutMatchLineupsInput>;
};
export type PlayerCreateNestedOneWithoutMatchEventsInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutMatchEventsInput, Prisma.PlayerUncheckedCreateWithoutMatchEventsInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutMatchEventsInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerCreateNestedOneWithoutMatchEventsSubOutInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutMatchEventsSubOutInput, Prisma.PlayerUncheckedCreateWithoutMatchEventsSubOutInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutMatchEventsSubOutInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUpdateOneWithoutMatchEventsNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutMatchEventsInput, Prisma.PlayerUncheckedCreateWithoutMatchEventsInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutMatchEventsInput;
    upsert?: Prisma.PlayerUpsertWithoutMatchEventsInput;
    disconnect?: Prisma.PlayerWhereInput | boolean;
    delete?: Prisma.PlayerWhereInput | boolean;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutMatchEventsInput, Prisma.PlayerUpdateWithoutMatchEventsInput>, Prisma.PlayerUncheckedUpdateWithoutMatchEventsInput>;
};
export type PlayerUpdateOneWithoutMatchEventsSubOutNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutMatchEventsSubOutInput, Prisma.PlayerUncheckedCreateWithoutMatchEventsSubOutInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutMatchEventsSubOutInput;
    upsert?: Prisma.PlayerUpsertWithoutMatchEventsSubOutInput;
    disconnect?: Prisma.PlayerWhereInput | boolean;
    delete?: Prisma.PlayerWhereInput | boolean;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutMatchEventsSubOutInput, Prisma.PlayerUpdateWithoutMatchEventsSubOutInput>, Prisma.PlayerUncheckedUpdateWithoutMatchEventsSubOutInput>;
};
export type PlayerCreateNestedOneWithoutPlayerStatisticsInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutPlayerStatisticsInput, Prisma.PlayerUncheckedCreateWithoutPlayerStatisticsInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutPlayerStatisticsInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUpdateOneRequiredWithoutPlayerStatisticsNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutPlayerStatisticsInput, Prisma.PlayerUncheckedCreateWithoutPlayerStatisticsInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutPlayerStatisticsInput;
    upsert?: Prisma.PlayerUpsertWithoutPlayerStatisticsInput;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutPlayerStatisticsInput, Prisma.PlayerUpdateWithoutPlayerStatisticsInput>, Prisma.PlayerUncheckedUpdateWithoutPlayerStatisticsInput>;
};
export type PlayerCreateWithoutUserInput = {
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerUncheckedCreateWithoutUserInput = {
    id?: number;
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerCreateOrConnectWithoutUserInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutUserInput, Prisma.PlayerUncheckedCreateWithoutUserInput>;
};
export type PlayerUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutUserInput, Prisma.PlayerUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutUserInput, Prisma.PlayerUncheckedCreateWithoutUserInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutUserInput, Prisma.PlayerUncheckedUpdateWithoutUserInput>;
};
export type PlayerUpdateWithoutUserInput = {
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerCreateWithoutTeam_playersInput = {
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerUncheckedCreateWithoutTeam_playersInput = {
    id?: number;
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id: number;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerCreateOrConnectWithoutTeam_playersInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutTeam_playersInput, Prisma.PlayerUncheckedCreateWithoutTeam_playersInput>;
};
export type PlayerUpsertWithoutTeam_playersInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutTeam_playersInput, Prisma.PlayerUncheckedUpdateWithoutTeam_playersInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutTeam_playersInput, Prisma.PlayerUncheckedCreateWithoutTeam_playersInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutTeam_playersInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutTeam_playersInput, Prisma.PlayerUncheckedUpdateWithoutTeam_playersInput>;
};
export type PlayerUpdateWithoutTeam_playersInput = {
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerUncheckedUpdateWithoutTeam_playersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerCreateWithoutTeam_player_historyInput = {
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutPlayerInput;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerUncheckedCreateWithoutTeam_player_historyInput = {
    id?: number;
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id: number;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerCreateOrConnectWithoutTeam_player_historyInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutTeam_player_historyInput, Prisma.PlayerUncheckedCreateWithoutTeam_player_historyInput>;
};
export type PlayerUpsertWithoutTeam_player_historyInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutTeam_player_historyInput, Prisma.PlayerUncheckedUpdateWithoutTeam_player_historyInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutTeam_player_historyInput, Prisma.PlayerUncheckedCreateWithoutTeam_player_historyInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutTeam_player_historyInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutTeam_player_historyInput, Prisma.PlayerUncheckedUpdateWithoutTeam_player_historyInput>;
};
export type PlayerUpdateWithoutTeam_player_historyInput = {
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutPlayerNestedInput;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerUncheckedUpdateWithoutTeam_player_historyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerCreateWithoutMatchLineupsInput = {
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutPlayerInput;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerUncheckedCreateWithoutMatchLineupsInput = {
    id?: number;
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id: number;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerCreateOrConnectWithoutMatchLineupsInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutMatchLineupsInput, Prisma.PlayerUncheckedCreateWithoutMatchLineupsInput>;
};
export type PlayerUpsertWithoutMatchLineupsInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutMatchLineupsInput, Prisma.PlayerUncheckedUpdateWithoutMatchLineupsInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutMatchLineupsInput, Prisma.PlayerUncheckedCreateWithoutMatchLineupsInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutMatchLineupsInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutMatchLineupsInput, Prisma.PlayerUncheckedUpdateWithoutMatchLineupsInput>;
};
export type PlayerUpdateWithoutMatchLineupsInput = {
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutPlayerNestedInput;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerUncheckedUpdateWithoutMatchLineupsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerCreateWithoutMatchEventsInput = {
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutPlayerInput;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerUncheckedCreateWithoutMatchEventsInput = {
    id?: number;
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id: number;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerCreateOrConnectWithoutMatchEventsInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutMatchEventsInput, Prisma.PlayerUncheckedCreateWithoutMatchEventsInput>;
};
export type PlayerCreateWithoutMatchEventsSubOutInput = {
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutPlayerInput;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutPlayerInput;
};
export type PlayerUncheckedCreateWithoutMatchEventsSubOutInput = {
    id?: number;
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id: number;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedCreateNestedManyWithoutPlayerInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutPlayerInput;
};
export type PlayerCreateOrConnectWithoutMatchEventsSubOutInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutMatchEventsSubOutInput, Prisma.PlayerUncheckedCreateWithoutMatchEventsSubOutInput>;
};
export type PlayerUpsertWithoutMatchEventsInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutMatchEventsInput, Prisma.PlayerUncheckedUpdateWithoutMatchEventsInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutMatchEventsInput, Prisma.PlayerUncheckedCreateWithoutMatchEventsInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutMatchEventsInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutMatchEventsInput, Prisma.PlayerUncheckedUpdateWithoutMatchEventsInput>;
};
export type PlayerUpdateWithoutMatchEventsInput = {
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutPlayerNestedInput;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerUncheckedUpdateWithoutMatchEventsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerUpsertWithoutMatchEventsSubOutInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutMatchEventsSubOutInput, Prisma.PlayerUncheckedUpdateWithoutMatchEventsSubOutInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutMatchEventsSubOutInput, Prisma.PlayerUncheckedCreateWithoutMatchEventsSubOutInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutMatchEventsSubOutInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutMatchEventsSubOutInput, Prisma.PlayerUncheckedUpdateWithoutMatchEventsSubOutInput>;
};
export type PlayerUpdateWithoutMatchEventsSubOutInput = {
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutPlayerNestedInput;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutPlayerNestedInput;
};
export type PlayerUncheckedUpdateWithoutMatchEventsSubOutInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutPlayerNestedInput;
};
export type PlayerCreateWithoutPlayerStatisticsInput = {
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutPlayerInput;
    team_players?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerUncheckedCreateWithoutPlayerStatisticsInput = {
    id?: number;
    date_of_birth: Date | string;
    position: $Enums.PlayerPosition;
    height?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: string | null;
    avatar?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id: number;
    team_players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedCreateNestedManyWithoutPlayerInput;
    matchLineups?: Prisma.MatchLineupUncheckedCreateNestedManyWithoutPlayerInput;
    matchEvents?: Prisma.MatchEventUncheckedCreateNestedManyWithoutPlayerInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedCreateNestedManyWithoutSub_out_playerInput;
};
export type PlayerCreateOrConnectWithoutPlayerStatisticsInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutPlayerStatisticsInput, Prisma.PlayerUncheckedCreateWithoutPlayerStatisticsInput>;
};
export type PlayerUpsertWithoutPlayerStatisticsInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutPlayerStatisticsInput, Prisma.PlayerUncheckedUpdateWithoutPlayerStatisticsInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutPlayerStatisticsInput, Prisma.PlayerUncheckedCreateWithoutPlayerStatisticsInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutPlayerStatisticsInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutPlayerStatisticsInput, Prisma.PlayerUncheckedUpdateWithoutPlayerStatisticsInput>;
};
export type PlayerUpdateWithoutPlayerStatisticsInput = {
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutPlayerNestedInput;
    team_players?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUpdateManyWithoutSub_out_playerNestedInput;
};
export type PlayerUncheckedUpdateWithoutPlayerStatisticsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date_of_birth?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    height?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    nationality?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    team_player_history?: Prisma.TeamPlayerHistoryUncheckedUpdateManyWithoutPlayerNestedInput;
    matchLineups?: Prisma.MatchLineupUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEvents?: Prisma.MatchEventUncheckedUpdateManyWithoutPlayerNestedInput;
    matchEventsSubOut?: Prisma.MatchEventUncheckedUpdateManyWithoutSub_out_playerNestedInput;
};
/**
 * Count Type PlayerCountOutputType
 */
export type PlayerCountOutputType = {
    team_players: number;
    team_player_history: number;
    playerStatistics: number;
    matchLineups: number;
    matchEvents: number;
    matchEventsSubOut: number;
};
export type PlayerCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team_players?: boolean | PlayerCountOutputTypeCountTeam_playersArgs;
    team_player_history?: boolean | PlayerCountOutputTypeCountTeam_player_historyArgs;
    playerStatistics?: boolean | PlayerCountOutputTypeCountPlayerStatisticsArgs;
    matchLineups?: boolean | PlayerCountOutputTypeCountMatchLineupsArgs;
    matchEvents?: boolean | PlayerCountOutputTypeCountMatchEventsArgs;
    matchEventsSubOut?: boolean | PlayerCountOutputTypeCountMatchEventsSubOutArgs;
};
/**
 * PlayerCountOutputType without action
 */
export type PlayerCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerCountOutputType
     */
    select?: Prisma.PlayerCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * PlayerCountOutputType without action
 */
export type PlayerCountOutputTypeCountTeam_playersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerWhereInput;
};
/**
 * PlayerCountOutputType without action
 */
export type PlayerCountOutputTypeCountTeam_player_historyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerHistoryWhereInput;
};
/**
 * PlayerCountOutputType without action
 */
export type PlayerCountOutputTypeCountPlayerStatisticsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlayerStatisticWhereInput;
};
/**
 * PlayerCountOutputType without action
 */
export type PlayerCountOutputTypeCountMatchLineupsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchLineupWhereInput;
};
/**
 * PlayerCountOutputType without action
 */
export type PlayerCountOutputTypeCountMatchEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchEventWhereInput;
};
/**
 * PlayerCountOutputType without action
 */
export type PlayerCountOutputTypeCountMatchEventsSubOutArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchEventWhereInput;
};
export type PlayerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date_of_birth?: boolean;
    position?: boolean;
    height?: boolean;
    weight?: boolean;
    nationality?: boolean;
    avatar?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    user_id?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    team_players?: boolean | Prisma.Player$team_playersArgs<ExtArgs>;
    team_player_history?: boolean | Prisma.Player$team_player_historyArgs<ExtArgs>;
    playerStatistics?: boolean | Prisma.Player$playerStatisticsArgs<ExtArgs>;
    matchLineups?: boolean | Prisma.Player$matchLineupsArgs<ExtArgs>;
    matchEvents?: boolean | Prisma.Player$matchEventsArgs<ExtArgs>;
    matchEventsSubOut?: boolean | Prisma.Player$matchEventsSubOutArgs<ExtArgs>;
    _count?: boolean | Prisma.PlayerCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["player"]>;
export type PlayerSelectScalar = {
    id?: boolean;
    date_of_birth?: boolean;
    position?: boolean;
    height?: boolean;
    weight?: boolean;
    nationality?: boolean;
    avatar?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    user_id?: boolean;
};
export type PlayerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "date_of_birth" | "position" | "height" | "weight" | "nationality" | "avatar" | "is_active" | "created_at" | "updated_at" | "deleted_at" | "user_id", ExtArgs["result"]["player"]>;
export type PlayerInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    team_players?: boolean | Prisma.Player$team_playersArgs<ExtArgs>;
    team_player_history?: boolean | Prisma.Player$team_player_historyArgs<ExtArgs>;
    playerStatistics?: boolean | Prisma.Player$playerStatisticsArgs<ExtArgs>;
    matchLineups?: boolean | Prisma.Player$matchLineupsArgs<ExtArgs>;
    matchEvents?: boolean | Prisma.Player$matchEventsArgs<ExtArgs>;
    matchEventsSubOut?: boolean | Prisma.Player$matchEventsSubOutArgs<ExtArgs>;
    _count?: boolean | Prisma.PlayerCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $PlayerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Player";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        team_players: Prisma.$TeamPlayerPayload<ExtArgs>[];
        team_player_history: Prisma.$TeamPlayerHistoryPayload<ExtArgs>[];
        playerStatistics: Prisma.$PlayerStatisticPayload<ExtArgs>[];
        matchLineups: Prisma.$MatchLineupPayload<ExtArgs>[];
        matchEvents: Prisma.$MatchEventPayload<ExtArgs>[];
        matchEventsSubOut: Prisma.$MatchEventPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        date_of_birth: Date;
        position: $Enums.PlayerPosition;
        height: runtime.Decimal | null;
        weight: runtime.Decimal | null;
        nationality: string | null;
        avatar: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        user_id: number;
    }, ExtArgs["result"]["player"]>;
    composites: {};
};
export type PlayerGetPayload<S extends boolean | null | undefined | PlayerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlayerPayload, S>;
export type PlayerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlayerCountAggregateInputType | true;
};
export interface PlayerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Player'];
        meta: {
            name: 'Player';
        };
    };
    /**
     * Find zero or one Player that matches the filter.
     * @param {PlayerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerFindUniqueArgs>(args: Prisma.SelectSubset<T, PlayerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Player that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerFindFirstArgs>(args?: Prisma.SelectSubset<T, PlayerFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Player that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     *
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const playerWithIdOnly = await prisma.player.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PlayerFindManyArgs>(args?: Prisma.SelectSubset<T, PlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Player.
     * @param {PlayerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     *
     */
    create<T extends PlayerCreateArgs>(args: Prisma.SelectSubset<T, PlayerCreateArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Players.
     * @param {PlayerCreateManyArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PlayerCreateManyArgs>(args?: Prisma.SelectSubset<T, PlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Player.
     * @param {PlayerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     *
     */
    delete<T extends PlayerDeleteArgs>(args: Prisma.SelectSubset<T, PlayerDeleteArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Player.
     * @param {PlayerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PlayerUpdateArgs>(args: Prisma.SelectSubset<T, PlayerUpdateArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Players.
     * @param {PlayerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PlayerDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PlayerUpdateManyArgs>(args: Prisma.SelectSubset<T, PlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Player.
     * @param {PlayerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends PlayerUpsertArgs>(args: Prisma.SelectSubset<T, PlayerUpsertArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
    **/
    count<T extends PlayerCountArgs>(args?: Prisma.Subset<T, PlayerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlayerCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PlayerAggregateArgs>(args: Prisma.Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>;
    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerGroupByArgs} args - Group by arguments.
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
    groupBy<T extends PlayerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlayerGroupByArgs['orderBy'];
    } : {
        orderBy?: PlayerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Player model
     */
    readonly fields: PlayerFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Player.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PlayerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    team_players<T extends Prisma.Player$team_playersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Player$team_playersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    team_player_history<T extends Prisma.Player$team_player_historyArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Player$team_player_historyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    playerStatistics<T extends Prisma.Player$playerStatisticsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Player$playerStatisticsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matchLineups<T extends Prisma.Player$matchLineupsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Player$matchLineupsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchLineupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matchEvents<T extends Prisma.Player$matchEventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Player$matchEventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matchEventsSubOut<T extends Prisma.Player$matchEventsSubOutArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Player$matchEventsSubOutArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Player model
 */
export interface PlayerFieldRefs {
    readonly id: Prisma.FieldRef<"Player", 'Int'>;
    readonly date_of_birth: Prisma.FieldRef<"Player", 'DateTime'>;
    readonly position: Prisma.FieldRef<"Player", 'PlayerPosition'>;
    readonly height: Prisma.FieldRef<"Player", 'Decimal'>;
    readonly weight: Prisma.FieldRef<"Player", 'Decimal'>;
    readonly nationality: Prisma.FieldRef<"Player", 'String'>;
    readonly avatar: Prisma.FieldRef<"Player", 'String'>;
    readonly is_active: Prisma.FieldRef<"Player", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Player", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Player", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"Player", 'DateTime'>;
    readonly user_id: Prisma.FieldRef<"Player", 'Int'>;
}
/**
 * Player findUnique
 */
export type PlayerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    /**
     * Filter, which Player to fetch.
     */
    where: Prisma.PlayerWhereUniqueInput;
};
/**
 * Player findUniqueOrThrow
 */
export type PlayerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    /**
     * Filter, which Player to fetch.
     */
    where: Prisma.PlayerWhereUniqueInput;
};
/**
 * Player findFirst
 */
export type PlayerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    /**
     * Filter, which Player to fetch.
     */
    where?: Prisma.PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Players to fetch.
     */
    orderBy?: Prisma.PlayerOrderByWithRelationInput | Prisma.PlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Players.
     */
    cursor?: Prisma.PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Players.
     */
    distinct?: Prisma.PlayerScalarFieldEnum | Prisma.PlayerScalarFieldEnum[];
};
/**
 * Player findFirstOrThrow
 */
export type PlayerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    /**
     * Filter, which Player to fetch.
     */
    where?: Prisma.PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Players to fetch.
     */
    orderBy?: Prisma.PlayerOrderByWithRelationInput | Prisma.PlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Players.
     */
    cursor?: Prisma.PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Players.
     */
    distinct?: Prisma.PlayerScalarFieldEnum | Prisma.PlayerScalarFieldEnum[];
};
/**
 * Player findMany
 */
export type PlayerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    /**
     * Filter, which Players to fetch.
     */
    where?: Prisma.PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Players to fetch.
     */
    orderBy?: Prisma.PlayerOrderByWithRelationInput | Prisma.PlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Players.
     */
    cursor?: Prisma.PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Players.
     */
    distinct?: Prisma.PlayerScalarFieldEnum | Prisma.PlayerScalarFieldEnum[];
};
/**
 * Player create
 */
export type PlayerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    /**
     * The data needed to create a Player.
     */
    data: Prisma.XOR<Prisma.PlayerCreateInput, Prisma.PlayerUncheckedCreateInput>;
};
/**
 * Player createMany
 */
export type PlayerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Players.
     */
    data: Prisma.PlayerCreateManyInput | Prisma.PlayerCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Player update
 */
export type PlayerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    /**
     * The data needed to update a Player.
     */
    data: Prisma.XOR<Prisma.PlayerUpdateInput, Prisma.PlayerUncheckedUpdateInput>;
    /**
     * Choose, which Player to update.
     */
    where: Prisma.PlayerWhereUniqueInput;
};
/**
 * Player updateMany
 */
export type PlayerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Players.
     */
    data: Prisma.XOR<Prisma.PlayerUpdateManyMutationInput, Prisma.PlayerUncheckedUpdateManyInput>;
    /**
     * Filter which Players to update
     */
    where?: Prisma.PlayerWhereInput;
    /**
     * Limit how many Players to update.
     */
    limit?: number;
};
/**
 * Player upsert
 */
export type PlayerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    /**
     * The filter to search for the Player to update in case it exists.
     */
    where: Prisma.PlayerWhereUniqueInput;
    /**
     * In case the Player found by the `where` argument doesn't exist, create a new Player with this data.
     */
    create: Prisma.XOR<Prisma.PlayerCreateInput, Prisma.PlayerUncheckedCreateInput>;
    /**
     * In case the Player was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PlayerUpdateInput, Prisma.PlayerUncheckedUpdateInput>;
};
/**
 * Player delete
 */
export type PlayerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    /**
     * Filter which Player to delete.
     */
    where: Prisma.PlayerWhereUniqueInput;
};
/**
 * Player deleteMany
 */
export type PlayerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Players to delete
     */
    where?: Prisma.PlayerWhereInput;
    /**
     * Limit how many Players to delete.
     */
    limit?: number;
};
/**
 * Player.team_players
 */
export type Player$team_playersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Player.team_player_history
 */
export type Player$team_player_historyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.TeamPlayerHistoryWhereInput;
    orderBy?: Prisma.TeamPlayerHistoryOrderByWithRelationInput | Prisma.TeamPlayerHistoryOrderByWithRelationInput[];
    cursor?: Prisma.TeamPlayerHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamPlayerHistoryScalarFieldEnum | Prisma.TeamPlayerHistoryScalarFieldEnum[];
};
/**
 * Player.playerStatistics
 */
export type Player$playerStatisticsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Player.matchLineups
 */
export type Player$matchLineupsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Player.matchEvents
 */
export type Player$matchEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Player.matchEventsSubOut
 */
export type Player$matchEventsSubOutArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Player without action
 */
export type PlayerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Player
     */
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerInclude<ExtArgs> | null;
};
//# sourceMappingURL=Player.d.ts.map