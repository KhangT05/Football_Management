import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MatchEvent
 *
 */
export type MatchEventModel = runtime.Types.Result.DefaultSelection<Prisma.$MatchEventPayload>;
export type AggregateMatchEvent = {
    _count: MatchEventCountAggregateOutputType | null;
    _avg: MatchEventAvgAggregateOutputType | null;
    _sum: MatchEventSumAggregateOutputType | null;
    _min: MatchEventMinAggregateOutputType | null;
    _max: MatchEventMaxAggregateOutputType | null;
};
export type MatchEventAvgAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    player_id: number | null;
    team_id: number | null;
    minute: number | null;
    added_minute: number | null;
    sub_out_player_id: number | null;
};
export type MatchEventSumAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    player_id: number | null;
    team_id: number | null;
    minute: number | null;
    added_minute: number | null;
    sub_out_player_id: number | null;
};
export type MatchEventMinAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    player_id: number | null;
    team_id: number | null;
    type: $Enums.MatchEventType | null;
    minute: number | null;
    note: string | null;
    period: $Enums.MatchPeriod | null;
    added_minute: number | null;
    card_color: $Enums.CardColor | null;
    time_source: $Enums.MatchEventTimeSource | null;
    sub_out_player_id: number | null;
    created_at: Date | null;
};
export type MatchEventMaxAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    player_id: number | null;
    team_id: number | null;
    type: $Enums.MatchEventType | null;
    minute: number | null;
    note: string | null;
    period: $Enums.MatchPeriod | null;
    added_minute: number | null;
    card_color: $Enums.CardColor | null;
    time_source: $Enums.MatchEventTimeSource | null;
    sub_out_player_id: number | null;
    created_at: Date | null;
};
export type MatchEventCountAggregateOutputType = {
    id: number;
    match_id: number;
    player_id: number;
    team_id: number;
    type: number;
    minute: number;
    note: number;
    period: number;
    added_minute: number;
    card_color: number;
    time_source: number;
    sub_out_player_id: number;
    created_at: number;
    _all: number;
};
export type MatchEventAvgAggregateInputType = {
    id?: true;
    match_id?: true;
    player_id?: true;
    team_id?: true;
    minute?: true;
    added_minute?: true;
    sub_out_player_id?: true;
};
export type MatchEventSumAggregateInputType = {
    id?: true;
    match_id?: true;
    player_id?: true;
    team_id?: true;
    minute?: true;
    added_minute?: true;
    sub_out_player_id?: true;
};
export type MatchEventMinAggregateInputType = {
    id?: true;
    match_id?: true;
    player_id?: true;
    team_id?: true;
    type?: true;
    minute?: true;
    note?: true;
    period?: true;
    added_minute?: true;
    card_color?: true;
    time_source?: true;
    sub_out_player_id?: true;
    created_at?: true;
};
export type MatchEventMaxAggregateInputType = {
    id?: true;
    match_id?: true;
    player_id?: true;
    team_id?: true;
    type?: true;
    minute?: true;
    note?: true;
    period?: true;
    added_minute?: true;
    card_color?: true;
    time_source?: true;
    sub_out_player_id?: true;
    created_at?: true;
};
export type MatchEventCountAggregateInputType = {
    id?: true;
    match_id?: true;
    player_id?: true;
    team_id?: true;
    type?: true;
    minute?: true;
    note?: true;
    period?: true;
    added_minute?: true;
    card_color?: true;
    time_source?: true;
    sub_out_player_id?: true;
    created_at?: true;
    _all?: true;
};
export type MatchEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MatchEvent to aggregate.
     */
    where?: Prisma.MatchEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchEvents to fetch.
     */
    orderBy?: Prisma.MatchEventOrderByWithRelationInput | Prisma.MatchEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MatchEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MatchEvents
    **/
    _count?: true | MatchEventCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MatchEventAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MatchEventSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MatchEventMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MatchEventMaxAggregateInputType;
};
export type GetMatchEventAggregateType<T extends MatchEventAggregateArgs> = {
    [P in keyof T & keyof AggregateMatchEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMatchEvent[P]> : Prisma.GetScalarType<T[P], AggregateMatchEvent[P]>;
};
export type MatchEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchEventWhereInput;
    orderBy?: Prisma.MatchEventOrderByWithAggregationInput | Prisma.MatchEventOrderByWithAggregationInput[];
    by: Prisma.MatchEventScalarFieldEnum[] | Prisma.MatchEventScalarFieldEnum;
    having?: Prisma.MatchEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MatchEventCountAggregateInputType | true;
    _avg?: MatchEventAvgAggregateInputType;
    _sum?: MatchEventSumAggregateInputType;
    _min?: MatchEventMinAggregateInputType;
    _max?: MatchEventMaxAggregateInputType;
};
export type MatchEventGroupByOutputType = {
    id: number;
    match_id: number;
    player_id: number | null;
    team_id: number | null;
    type: $Enums.MatchEventType;
    minute: number | null;
    note: string | null;
    period: $Enums.MatchPeriod | null;
    added_minute: number | null;
    card_color: $Enums.CardColor | null;
    time_source: $Enums.MatchEventTimeSource;
    sub_out_player_id: number | null;
    created_at: Date;
    _count: MatchEventCountAggregateOutputType | null;
    _avg: MatchEventAvgAggregateOutputType | null;
    _sum: MatchEventSumAggregateOutputType | null;
    _min: MatchEventMinAggregateOutputType | null;
    _max: MatchEventMaxAggregateOutputType | null;
};
export type GetMatchEventGroupByPayload<T extends MatchEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MatchEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MatchEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MatchEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MatchEventGroupByOutputType[P]>;
}>>;
export type MatchEventWhereInput = {
    AND?: Prisma.MatchEventWhereInput | Prisma.MatchEventWhereInput[];
    OR?: Prisma.MatchEventWhereInput[];
    NOT?: Prisma.MatchEventWhereInput | Prisma.MatchEventWhereInput[];
    id?: Prisma.IntFilter<"MatchEvent"> | number;
    match_id?: Prisma.IntFilter<"MatchEvent"> | number;
    player_id?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    team_id?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    type?: Prisma.EnumMatchEventTypeFilter<"MatchEvent"> | $Enums.MatchEventType;
    minute?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    note?: Prisma.StringNullableFilter<"MatchEvent"> | string | null;
    period?: Prisma.EnumMatchPeriodNullableFilter<"MatchEvent"> | $Enums.MatchPeriod | null;
    added_minute?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    card_color?: Prisma.EnumCardColorNullableFilter<"MatchEvent"> | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFilter<"MatchEvent"> | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    created_at?: Prisma.DateTimeFilter<"MatchEvent"> | Date | string;
    player?: Prisma.XOR<Prisma.PlayerNullableScalarRelationFilter, Prisma.PlayerWhereInput> | null;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
    sub_out_player?: Prisma.XOR<Prisma.PlayerNullableScalarRelationFilter, Prisma.PlayerWhereInput> | null;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
};
export type MatchEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    minute?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    period?: Prisma.SortOrderInput | Prisma.SortOrder;
    added_minute?: Prisma.SortOrderInput | Prisma.SortOrder;
    card_color?: Prisma.SortOrderInput | Prisma.SortOrder;
    time_source?: Prisma.SortOrder;
    sub_out_player_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    player?: Prisma.PlayerOrderByWithRelationInput;
    team?: Prisma.TeamOrderByWithRelationInput;
    sub_out_player?: Prisma.PlayerOrderByWithRelationInput;
    match?: Prisma.MatchOrderByWithRelationInput;
    _relevance?: Prisma.MatchEventOrderByRelevanceInput;
};
export type MatchEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.MatchEventWhereInput | Prisma.MatchEventWhereInput[];
    OR?: Prisma.MatchEventWhereInput[];
    NOT?: Prisma.MatchEventWhereInput | Prisma.MatchEventWhereInput[];
    match_id?: Prisma.IntFilter<"MatchEvent"> | number;
    player_id?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    team_id?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    type?: Prisma.EnumMatchEventTypeFilter<"MatchEvent"> | $Enums.MatchEventType;
    minute?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    note?: Prisma.StringNullableFilter<"MatchEvent"> | string | null;
    period?: Prisma.EnumMatchPeriodNullableFilter<"MatchEvent"> | $Enums.MatchPeriod | null;
    added_minute?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    card_color?: Prisma.EnumCardColorNullableFilter<"MatchEvent"> | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFilter<"MatchEvent"> | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    created_at?: Prisma.DateTimeFilter<"MatchEvent"> | Date | string;
    player?: Prisma.XOR<Prisma.PlayerNullableScalarRelationFilter, Prisma.PlayerWhereInput> | null;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
    sub_out_player?: Prisma.XOR<Prisma.PlayerNullableScalarRelationFilter, Prisma.PlayerWhereInput> | null;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
}, "id">;
export type MatchEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    minute?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    period?: Prisma.SortOrderInput | Prisma.SortOrder;
    added_minute?: Prisma.SortOrderInput | Prisma.SortOrder;
    card_color?: Prisma.SortOrderInput | Prisma.SortOrder;
    time_source?: Prisma.SortOrder;
    sub_out_player_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.MatchEventCountOrderByAggregateInput;
    _avg?: Prisma.MatchEventAvgOrderByAggregateInput;
    _max?: Prisma.MatchEventMaxOrderByAggregateInput;
    _min?: Prisma.MatchEventMinOrderByAggregateInput;
    _sum?: Prisma.MatchEventSumOrderByAggregateInput;
};
export type MatchEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.MatchEventScalarWhereWithAggregatesInput | Prisma.MatchEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.MatchEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MatchEventScalarWhereWithAggregatesInput | Prisma.MatchEventScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"MatchEvent"> | number;
    match_id?: Prisma.IntWithAggregatesFilter<"MatchEvent"> | number;
    player_id?: Prisma.IntNullableWithAggregatesFilter<"MatchEvent"> | number | null;
    team_id?: Prisma.IntNullableWithAggregatesFilter<"MatchEvent"> | number | null;
    type?: Prisma.EnumMatchEventTypeWithAggregatesFilter<"MatchEvent"> | $Enums.MatchEventType;
    minute?: Prisma.IntNullableWithAggregatesFilter<"MatchEvent"> | number | null;
    note?: Prisma.StringNullableWithAggregatesFilter<"MatchEvent"> | string | null;
    period?: Prisma.EnumMatchPeriodNullableWithAggregatesFilter<"MatchEvent"> | $Enums.MatchPeriod | null;
    added_minute?: Prisma.IntNullableWithAggregatesFilter<"MatchEvent"> | number | null;
    card_color?: Prisma.EnumCardColorNullableWithAggregatesFilter<"MatchEvent"> | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceWithAggregatesFilter<"MatchEvent"> | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.IntNullableWithAggregatesFilter<"MatchEvent"> | number | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"MatchEvent"> | Date | string;
};
export type MatchEventCreateInput = {
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    created_at?: Date | string;
    player?: Prisma.PlayerCreateNestedOneWithoutMatchEventsInput;
    team?: Prisma.TeamCreateNestedOneWithoutMatchEventsInput;
    sub_out_player?: Prisma.PlayerCreateNestedOneWithoutMatchEventsSubOutInput;
    match: Prisma.MatchCreateNestedOneWithoutEventsInput;
};
export type MatchEventUncheckedCreateInput = {
    id?: number;
    match_id: number;
    player_id?: number | null;
    team_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    sub_out_player_id?: number | null;
    created_at?: Date | string;
};
export type MatchEventUpdateInput = {
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    player?: Prisma.PlayerUpdateOneWithoutMatchEventsNestedInput;
    team?: Prisma.TeamUpdateOneWithoutMatchEventsNestedInput;
    sub_out_player?: Prisma.PlayerUpdateOneWithoutMatchEventsSubOutNestedInput;
    match?: Prisma.MatchUpdateOneRequiredWithoutEventsNestedInput;
};
export type MatchEventUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventCreateManyInput = {
    id?: number;
    match_id: number;
    player_id?: number | null;
    team_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    sub_out_player_id?: number | null;
    created_at?: Date | string;
};
export type MatchEventUpdateManyMutationInput = {
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventListRelationFilter = {
    every?: Prisma.MatchEventWhereInput;
    some?: Prisma.MatchEventWhereInput;
    none?: Prisma.MatchEventWhereInput;
};
export type MatchEventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MatchEventOrderByRelevanceInput = {
    fields: Prisma.MatchEventOrderByRelevanceFieldEnum | Prisma.MatchEventOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type MatchEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    minute?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    added_minute?: Prisma.SortOrder;
    card_color?: Prisma.SortOrder;
    time_source?: Prisma.SortOrder;
    sub_out_player_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type MatchEventAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    minute?: Prisma.SortOrder;
    added_minute?: Prisma.SortOrder;
    sub_out_player_id?: Prisma.SortOrder;
};
export type MatchEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    minute?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    added_minute?: Prisma.SortOrder;
    card_color?: Prisma.SortOrder;
    time_source?: Prisma.SortOrder;
    sub_out_player_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type MatchEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    minute?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    added_minute?: Prisma.SortOrder;
    card_color?: Prisma.SortOrder;
    time_source?: Prisma.SortOrder;
    sub_out_player_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type MatchEventSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    minute?: Prisma.SortOrder;
    added_minute?: Prisma.SortOrder;
    sub_out_player_id?: Prisma.SortOrder;
};
export type MatchEventCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutTeamInput, Prisma.MatchEventUncheckedCreateWithoutTeamInput> | Prisma.MatchEventCreateWithoutTeamInput[] | Prisma.MatchEventUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutTeamInput | Prisma.MatchEventCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MatchEventCreateManyTeamInputEnvelope;
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
};
export type MatchEventUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutTeamInput, Prisma.MatchEventUncheckedCreateWithoutTeamInput> | Prisma.MatchEventCreateWithoutTeamInput[] | Prisma.MatchEventUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutTeamInput | Prisma.MatchEventCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MatchEventCreateManyTeamInputEnvelope;
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
};
export type MatchEventUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutTeamInput, Prisma.MatchEventUncheckedCreateWithoutTeamInput> | Prisma.MatchEventCreateWithoutTeamInput[] | Prisma.MatchEventUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutTeamInput | Prisma.MatchEventCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MatchEventUpsertWithWhereUniqueWithoutTeamInput | Prisma.MatchEventUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MatchEventCreateManyTeamInputEnvelope;
    set?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    disconnect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    delete?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    update?: Prisma.MatchEventUpdateWithWhereUniqueWithoutTeamInput | Prisma.MatchEventUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MatchEventUpdateManyWithWhereWithoutTeamInput | Prisma.MatchEventUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
};
export type MatchEventUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutTeamInput, Prisma.MatchEventUncheckedCreateWithoutTeamInput> | Prisma.MatchEventCreateWithoutTeamInput[] | Prisma.MatchEventUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutTeamInput | Prisma.MatchEventCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MatchEventUpsertWithWhereUniqueWithoutTeamInput | Prisma.MatchEventUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MatchEventCreateManyTeamInputEnvelope;
    set?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    disconnect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    delete?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    update?: Prisma.MatchEventUpdateWithWhereUniqueWithoutTeamInput | Prisma.MatchEventUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MatchEventUpdateManyWithWhereWithoutTeamInput | Prisma.MatchEventUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
};
export type MatchEventCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutPlayerInput, Prisma.MatchEventUncheckedCreateWithoutPlayerInput> | Prisma.MatchEventCreateWithoutPlayerInput[] | Prisma.MatchEventUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutPlayerInput | Prisma.MatchEventCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.MatchEventCreateManyPlayerInputEnvelope;
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
};
export type MatchEventCreateNestedManyWithoutSub_out_playerInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutSub_out_playerInput, Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput> | Prisma.MatchEventCreateWithoutSub_out_playerInput[] | Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutSub_out_playerInput | Prisma.MatchEventCreateOrConnectWithoutSub_out_playerInput[];
    createMany?: Prisma.MatchEventCreateManySub_out_playerInputEnvelope;
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
};
export type MatchEventUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutPlayerInput, Prisma.MatchEventUncheckedCreateWithoutPlayerInput> | Prisma.MatchEventCreateWithoutPlayerInput[] | Prisma.MatchEventUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutPlayerInput | Prisma.MatchEventCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.MatchEventCreateManyPlayerInputEnvelope;
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
};
export type MatchEventUncheckedCreateNestedManyWithoutSub_out_playerInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutSub_out_playerInput, Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput> | Prisma.MatchEventCreateWithoutSub_out_playerInput[] | Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutSub_out_playerInput | Prisma.MatchEventCreateOrConnectWithoutSub_out_playerInput[];
    createMany?: Prisma.MatchEventCreateManySub_out_playerInputEnvelope;
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
};
export type MatchEventUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutPlayerInput, Prisma.MatchEventUncheckedCreateWithoutPlayerInput> | Prisma.MatchEventCreateWithoutPlayerInput[] | Prisma.MatchEventUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutPlayerInput | Prisma.MatchEventCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.MatchEventUpsertWithWhereUniqueWithoutPlayerInput | Prisma.MatchEventUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.MatchEventCreateManyPlayerInputEnvelope;
    set?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    disconnect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    delete?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    update?: Prisma.MatchEventUpdateWithWhereUniqueWithoutPlayerInput | Prisma.MatchEventUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.MatchEventUpdateManyWithWhereWithoutPlayerInput | Prisma.MatchEventUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
};
export type MatchEventUpdateManyWithoutSub_out_playerNestedInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutSub_out_playerInput, Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput> | Prisma.MatchEventCreateWithoutSub_out_playerInput[] | Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutSub_out_playerInput | Prisma.MatchEventCreateOrConnectWithoutSub_out_playerInput[];
    upsert?: Prisma.MatchEventUpsertWithWhereUniqueWithoutSub_out_playerInput | Prisma.MatchEventUpsertWithWhereUniqueWithoutSub_out_playerInput[];
    createMany?: Prisma.MatchEventCreateManySub_out_playerInputEnvelope;
    set?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    disconnect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    delete?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    update?: Prisma.MatchEventUpdateWithWhereUniqueWithoutSub_out_playerInput | Prisma.MatchEventUpdateWithWhereUniqueWithoutSub_out_playerInput[];
    updateMany?: Prisma.MatchEventUpdateManyWithWhereWithoutSub_out_playerInput | Prisma.MatchEventUpdateManyWithWhereWithoutSub_out_playerInput[];
    deleteMany?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
};
export type MatchEventUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutPlayerInput, Prisma.MatchEventUncheckedCreateWithoutPlayerInput> | Prisma.MatchEventCreateWithoutPlayerInput[] | Prisma.MatchEventUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutPlayerInput | Prisma.MatchEventCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.MatchEventUpsertWithWhereUniqueWithoutPlayerInput | Prisma.MatchEventUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.MatchEventCreateManyPlayerInputEnvelope;
    set?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    disconnect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    delete?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    update?: Prisma.MatchEventUpdateWithWhereUniqueWithoutPlayerInput | Prisma.MatchEventUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.MatchEventUpdateManyWithWhereWithoutPlayerInput | Prisma.MatchEventUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
};
export type MatchEventUncheckedUpdateManyWithoutSub_out_playerNestedInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutSub_out_playerInput, Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput> | Prisma.MatchEventCreateWithoutSub_out_playerInput[] | Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutSub_out_playerInput | Prisma.MatchEventCreateOrConnectWithoutSub_out_playerInput[];
    upsert?: Prisma.MatchEventUpsertWithWhereUniqueWithoutSub_out_playerInput | Prisma.MatchEventUpsertWithWhereUniqueWithoutSub_out_playerInput[];
    createMany?: Prisma.MatchEventCreateManySub_out_playerInputEnvelope;
    set?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    disconnect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    delete?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    update?: Prisma.MatchEventUpdateWithWhereUniqueWithoutSub_out_playerInput | Prisma.MatchEventUpdateWithWhereUniqueWithoutSub_out_playerInput[];
    updateMany?: Prisma.MatchEventUpdateManyWithWhereWithoutSub_out_playerInput | Prisma.MatchEventUpdateManyWithWhereWithoutSub_out_playerInput[];
    deleteMany?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
};
export type MatchEventCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutMatchInput, Prisma.MatchEventUncheckedCreateWithoutMatchInput> | Prisma.MatchEventCreateWithoutMatchInput[] | Prisma.MatchEventUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutMatchInput | Prisma.MatchEventCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.MatchEventCreateManyMatchInputEnvelope;
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
};
export type MatchEventUncheckedCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutMatchInput, Prisma.MatchEventUncheckedCreateWithoutMatchInput> | Prisma.MatchEventCreateWithoutMatchInput[] | Prisma.MatchEventUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutMatchInput | Prisma.MatchEventCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.MatchEventCreateManyMatchInputEnvelope;
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
};
export type MatchEventUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutMatchInput, Prisma.MatchEventUncheckedCreateWithoutMatchInput> | Prisma.MatchEventCreateWithoutMatchInput[] | Prisma.MatchEventUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutMatchInput | Prisma.MatchEventCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.MatchEventUpsertWithWhereUniqueWithoutMatchInput | Prisma.MatchEventUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.MatchEventCreateManyMatchInputEnvelope;
    set?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    disconnect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    delete?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    update?: Prisma.MatchEventUpdateWithWhereUniqueWithoutMatchInput | Prisma.MatchEventUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.MatchEventUpdateManyWithWhereWithoutMatchInput | Prisma.MatchEventUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
};
export type MatchEventUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchEventCreateWithoutMatchInput, Prisma.MatchEventUncheckedCreateWithoutMatchInput> | Prisma.MatchEventCreateWithoutMatchInput[] | Prisma.MatchEventUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.MatchEventCreateOrConnectWithoutMatchInput | Prisma.MatchEventCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.MatchEventUpsertWithWhereUniqueWithoutMatchInput | Prisma.MatchEventUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.MatchEventCreateManyMatchInputEnvelope;
    set?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    disconnect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    delete?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    connect?: Prisma.MatchEventWhereUniqueInput | Prisma.MatchEventWhereUniqueInput[];
    update?: Prisma.MatchEventUpdateWithWhereUniqueWithoutMatchInput | Prisma.MatchEventUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.MatchEventUpdateManyWithWhereWithoutMatchInput | Prisma.MatchEventUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
};
export type EnumMatchEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.MatchEventType;
};
export type NullableEnumCardColorFieldUpdateOperationsInput = {
    set?: $Enums.CardColor | null;
};
export type EnumMatchEventTimeSourceFieldUpdateOperationsInput = {
    set?: $Enums.MatchEventTimeSource;
};
export type MatchEventCreateWithoutTeamInput = {
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    created_at?: Date | string;
    player?: Prisma.PlayerCreateNestedOneWithoutMatchEventsInput;
    sub_out_player?: Prisma.PlayerCreateNestedOneWithoutMatchEventsSubOutInput;
    match: Prisma.MatchCreateNestedOneWithoutEventsInput;
};
export type MatchEventUncheckedCreateWithoutTeamInput = {
    id?: number;
    match_id: number;
    player_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    sub_out_player_id?: number | null;
    created_at?: Date | string;
};
export type MatchEventCreateOrConnectWithoutTeamInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchEventCreateWithoutTeamInput, Prisma.MatchEventUncheckedCreateWithoutTeamInput>;
};
export type MatchEventCreateManyTeamInputEnvelope = {
    data: Prisma.MatchEventCreateManyTeamInput | Prisma.MatchEventCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type MatchEventUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchEventUpdateWithoutTeamInput, Prisma.MatchEventUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.MatchEventCreateWithoutTeamInput, Prisma.MatchEventUncheckedCreateWithoutTeamInput>;
};
export type MatchEventUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchEventUpdateWithoutTeamInput, Prisma.MatchEventUncheckedUpdateWithoutTeamInput>;
};
export type MatchEventUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.MatchEventScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchEventUpdateManyMutationInput, Prisma.MatchEventUncheckedUpdateManyWithoutTeamInput>;
};
export type MatchEventScalarWhereInput = {
    AND?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
    OR?: Prisma.MatchEventScalarWhereInput[];
    NOT?: Prisma.MatchEventScalarWhereInput | Prisma.MatchEventScalarWhereInput[];
    id?: Prisma.IntFilter<"MatchEvent"> | number;
    match_id?: Prisma.IntFilter<"MatchEvent"> | number;
    player_id?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    team_id?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    type?: Prisma.EnumMatchEventTypeFilter<"MatchEvent"> | $Enums.MatchEventType;
    minute?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    note?: Prisma.StringNullableFilter<"MatchEvent"> | string | null;
    period?: Prisma.EnumMatchPeriodNullableFilter<"MatchEvent"> | $Enums.MatchPeriod | null;
    added_minute?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    card_color?: Prisma.EnumCardColorNullableFilter<"MatchEvent"> | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFilter<"MatchEvent"> | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.IntNullableFilter<"MatchEvent"> | number | null;
    created_at?: Prisma.DateTimeFilter<"MatchEvent"> | Date | string;
};
export type MatchEventCreateWithoutPlayerInput = {
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    created_at?: Date | string;
    team?: Prisma.TeamCreateNestedOneWithoutMatchEventsInput;
    sub_out_player?: Prisma.PlayerCreateNestedOneWithoutMatchEventsSubOutInput;
    match: Prisma.MatchCreateNestedOneWithoutEventsInput;
};
export type MatchEventUncheckedCreateWithoutPlayerInput = {
    id?: number;
    match_id: number;
    team_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    sub_out_player_id?: number | null;
    created_at?: Date | string;
};
export type MatchEventCreateOrConnectWithoutPlayerInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchEventCreateWithoutPlayerInput, Prisma.MatchEventUncheckedCreateWithoutPlayerInput>;
};
export type MatchEventCreateManyPlayerInputEnvelope = {
    data: Prisma.MatchEventCreateManyPlayerInput | Prisma.MatchEventCreateManyPlayerInput[];
    skipDuplicates?: boolean;
};
export type MatchEventCreateWithoutSub_out_playerInput = {
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    created_at?: Date | string;
    player?: Prisma.PlayerCreateNestedOneWithoutMatchEventsInput;
    team?: Prisma.TeamCreateNestedOneWithoutMatchEventsInput;
    match: Prisma.MatchCreateNestedOneWithoutEventsInput;
};
export type MatchEventUncheckedCreateWithoutSub_out_playerInput = {
    id?: number;
    match_id: number;
    player_id?: number | null;
    team_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    created_at?: Date | string;
};
export type MatchEventCreateOrConnectWithoutSub_out_playerInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchEventCreateWithoutSub_out_playerInput, Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput>;
};
export type MatchEventCreateManySub_out_playerInputEnvelope = {
    data: Prisma.MatchEventCreateManySub_out_playerInput | Prisma.MatchEventCreateManySub_out_playerInput[];
    skipDuplicates?: boolean;
};
export type MatchEventUpsertWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchEventUpdateWithoutPlayerInput, Prisma.MatchEventUncheckedUpdateWithoutPlayerInput>;
    create: Prisma.XOR<Prisma.MatchEventCreateWithoutPlayerInput, Prisma.MatchEventUncheckedCreateWithoutPlayerInput>;
};
export type MatchEventUpdateWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchEventUpdateWithoutPlayerInput, Prisma.MatchEventUncheckedUpdateWithoutPlayerInput>;
};
export type MatchEventUpdateManyWithWhereWithoutPlayerInput = {
    where: Prisma.MatchEventScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchEventUpdateManyMutationInput, Prisma.MatchEventUncheckedUpdateManyWithoutPlayerInput>;
};
export type MatchEventUpsertWithWhereUniqueWithoutSub_out_playerInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchEventUpdateWithoutSub_out_playerInput, Prisma.MatchEventUncheckedUpdateWithoutSub_out_playerInput>;
    create: Prisma.XOR<Prisma.MatchEventCreateWithoutSub_out_playerInput, Prisma.MatchEventUncheckedCreateWithoutSub_out_playerInput>;
};
export type MatchEventUpdateWithWhereUniqueWithoutSub_out_playerInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchEventUpdateWithoutSub_out_playerInput, Prisma.MatchEventUncheckedUpdateWithoutSub_out_playerInput>;
};
export type MatchEventUpdateManyWithWhereWithoutSub_out_playerInput = {
    where: Prisma.MatchEventScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchEventUpdateManyMutationInput, Prisma.MatchEventUncheckedUpdateManyWithoutSub_out_playerInput>;
};
export type MatchEventCreateWithoutMatchInput = {
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    created_at?: Date | string;
    player?: Prisma.PlayerCreateNestedOneWithoutMatchEventsInput;
    team?: Prisma.TeamCreateNestedOneWithoutMatchEventsInput;
    sub_out_player?: Prisma.PlayerCreateNestedOneWithoutMatchEventsSubOutInput;
};
export type MatchEventUncheckedCreateWithoutMatchInput = {
    id?: number;
    player_id?: number | null;
    team_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    sub_out_player_id?: number | null;
    created_at?: Date | string;
};
export type MatchEventCreateOrConnectWithoutMatchInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchEventCreateWithoutMatchInput, Prisma.MatchEventUncheckedCreateWithoutMatchInput>;
};
export type MatchEventCreateManyMatchInputEnvelope = {
    data: Prisma.MatchEventCreateManyMatchInput | Prisma.MatchEventCreateManyMatchInput[];
    skipDuplicates?: boolean;
};
export type MatchEventUpsertWithWhereUniqueWithoutMatchInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchEventUpdateWithoutMatchInput, Prisma.MatchEventUncheckedUpdateWithoutMatchInput>;
    create: Prisma.XOR<Prisma.MatchEventCreateWithoutMatchInput, Prisma.MatchEventUncheckedCreateWithoutMatchInput>;
};
export type MatchEventUpdateWithWhereUniqueWithoutMatchInput = {
    where: Prisma.MatchEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchEventUpdateWithoutMatchInput, Prisma.MatchEventUncheckedUpdateWithoutMatchInput>;
};
export type MatchEventUpdateManyWithWhereWithoutMatchInput = {
    where: Prisma.MatchEventScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchEventUpdateManyMutationInput, Prisma.MatchEventUncheckedUpdateManyWithoutMatchInput>;
};
export type MatchEventCreateManyTeamInput = {
    id?: number;
    match_id: number;
    player_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    sub_out_player_id?: number | null;
    created_at?: Date | string;
};
export type MatchEventUpdateWithoutTeamInput = {
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    player?: Prisma.PlayerUpdateOneWithoutMatchEventsNestedInput;
    sub_out_player?: Prisma.PlayerUpdateOneWithoutMatchEventsSubOutNestedInput;
    match?: Prisma.MatchUpdateOneRequiredWithoutEventsNestedInput;
};
export type MatchEventUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventCreateManyPlayerInput = {
    id?: number;
    match_id: number;
    team_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    sub_out_player_id?: number | null;
    created_at?: Date | string;
};
export type MatchEventCreateManySub_out_playerInput = {
    id?: number;
    match_id: number;
    player_id?: number | null;
    team_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    created_at?: Date | string;
};
export type MatchEventUpdateWithoutPlayerInput = {
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    team?: Prisma.TeamUpdateOneWithoutMatchEventsNestedInput;
    sub_out_player?: Prisma.PlayerUpdateOneWithoutMatchEventsSubOutNestedInput;
    match?: Prisma.MatchUpdateOneRequiredWithoutEventsNestedInput;
};
export type MatchEventUncheckedUpdateWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventUncheckedUpdateManyWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventUpdateWithoutSub_out_playerInput = {
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    player?: Prisma.PlayerUpdateOneWithoutMatchEventsNestedInput;
    team?: Prisma.TeamUpdateOneWithoutMatchEventsNestedInput;
    match?: Prisma.MatchUpdateOneRequiredWithoutEventsNestedInput;
};
export type MatchEventUncheckedUpdateWithoutSub_out_playerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventUncheckedUpdateManyWithoutSub_out_playerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventCreateManyMatchInput = {
    id?: number;
    player_id?: number | null;
    team_id?: number | null;
    type: $Enums.MatchEventType;
    minute?: number | null;
    note?: string | null;
    period?: $Enums.MatchPeriod | null;
    added_minute?: number | null;
    card_color?: $Enums.CardColor | null;
    time_source?: $Enums.MatchEventTimeSource;
    sub_out_player_id?: number | null;
    created_at?: Date | string;
};
export type MatchEventUpdateWithoutMatchInput = {
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    player?: Prisma.PlayerUpdateOneWithoutMatchEventsNestedInput;
    team?: Prisma.TeamUpdateOneWithoutMatchEventsNestedInput;
    sub_out_player?: Prisma.PlayerUpdateOneWithoutMatchEventsSubOutNestedInput;
};
export type MatchEventUncheckedUpdateWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventUncheckedUpdateManyWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    type?: Prisma.EnumMatchEventTypeFieldUpdateOperationsInput | $Enums.MatchEventType;
    minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    period?: Prisma.NullableEnumMatchPeriodFieldUpdateOperationsInput | $Enums.MatchPeriod | null;
    added_minute?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    card_color?: Prisma.NullableEnumCardColorFieldUpdateOperationsInput | $Enums.CardColor | null;
    time_source?: Prisma.EnumMatchEventTimeSourceFieldUpdateOperationsInput | $Enums.MatchEventTimeSource;
    sub_out_player_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MatchEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    match_id?: boolean;
    player_id?: boolean;
    team_id?: boolean;
    type?: boolean;
    minute?: boolean;
    note?: boolean;
    period?: boolean;
    added_minute?: boolean;
    card_color?: boolean;
    time_source?: boolean;
    sub_out_player_id?: boolean;
    created_at?: boolean;
    player?: boolean | Prisma.MatchEvent$playerArgs<ExtArgs>;
    team?: boolean | Prisma.MatchEvent$teamArgs<ExtArgs>;
    sub_out_player?: boolean | Prisma.MatchEvent$sub_out_playerArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["matchEvent"]>;
export type MatchEventSelectScalar = {
    id?: boolean;
    match_id?: boolean;
    player_id?: boolean;
    team_id?: boolean;
    type?: boolean;
    minute?: boolean;
    note?: boolean;
    period?: boolean;
    added_minute?: boolean;
    card_color?: boolean;
    time_source?: boolean;
    sub_out_player_id?: boolean;
    created_at?: boolean;
};
export type MatchEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "match_id" | "player_id" | "team_id" | "type" | "minute" | "note" | "period" | "added_minute" | "card_color" | "time_source" | "sub_out_player_id" | "created_at", ExtArgs["result"]["matchEvent"]>;
export type MatchEventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    player?: boolean | Prisma.MatchEvent$playerArgs<ExtArgs>;
    team?: boolean | Prisma.MatchEvent$teamArgs<ExtArgs>;
    sub_out_player?: boolean | Prisma.MatchEvent$sub_out_playerArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
};
export type $MatchEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MatchEvent";
    objects: {
        player: Prisma.$PlayerPayload<ExtArgs> | null;
        team: Prisma.$TeamPayload<ExtArgs> | null;
        sub_out_player: Prisma.$PlayerPayload<ExtArgs> | null;
        match: Prisma.$MatchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        match_id: number;
        player_id: number | null;
        team_id: number | null;
        type: $Enums.MatchEventType;
        minute: number | null;
        note: string | null;
        period: $Enums.MatchPeriod | null;
        added_minute: number | null;
        card_color: $Enums.CardColor | null;
        time_source: $Enums.MatchEventTimeSource;
        sub_out_player_id: number | null;
        created_at: Date;
    }, ExtArgs["result"]["matchEvent"]>;
    composites: {};
};
export type MatchEventGetPayload<S extends boolean | null | undefined | MatchEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MatchEventPayload, S>;
export type MatchEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MatchEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MatchEventCountAggregateInputType | true;
};
export interface MatchEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MatchEvent'];
        meta: {
            name: 'MatchEvent';
        };
    };
    /**
     * Find zero or one MatchEvent that matches the filter.
     * @param {MatchEventFindUniqueArgs} args - Arguments to find a MatchEvent
     * @example
     * // Get one MatchEvent
     * const matchEvent = await prisma.matchEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchEventFindUniqueArgs>(args: Prisma.SelectSubset<T, MatchEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MatchEventClient<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MatchEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchEventFindUniqueOrThrowArgs} args - Arguments to find a MatchEvent
     * @example
     * // Get one MatchEvent
     * const matchEvent = await prisma.matchEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MatchEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchEventClient<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MatchEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventFindFirstArgs} args - Arguments to find a MatchEvent
     * @example
     * // Get one MatchEvent
     * const matchEvent = await prisma.matchEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchEventFindFirstArgs>(args?: Prisma.SelectSubset<T, MatchEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__MatchEventClient<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MatchEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventFindFirstOrThrowArgs} args - Arguments to find a MatchEvent
     * @example
     * // Get one MatchEvent
     * const matchEvent = await prisma.matchEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MatchEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchEventClient<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MatchEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchEvents
     * const matchEvents = await prisma.matchEvent.findMany()
     *
     * // Get first 10 MatchEvents
     * const matchEvents = await prisma.matchEvent.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const matchEventWithIdOnly = await prisma.matchEvent.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MatchEventFindManyArgs>(args?: Prisma.SelectSubset<T, MatchEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MatchEvent.
     * @param {MatchEventCreateArgs} args - Arguments to create a MatchEvent.
     * @example
     * // Create one MatchEvent
     * const MatchEvent = await prisma.matchEvent.create({
     *   data: {
     *     // ... data to create a MatchEvent
     *   }
     * })
     *
     */
    create<T extends MatchEventCreateArgs>(args: Prisma.SelectSubset<T, MatchEventCreateArgs<ExtArgs>>): Prisma.Prisma__MatchEventClient<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MatchEvents.
     * @param {MatchEventCreateManyArgs} args - Arguments to create many MatchEvents.
     * @example
     * // Create many MatchEvents
     * const matchEvent = await prisma.matchEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MatchEventCreateManyArgs>(args?: Prisma.SelectSubset<T, MatchEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MatchEvent.
     * @param {MatchEventDeleteArgs} args - Arguments to delete one MatchEvent.
     * @example
     * // Delete one MatchEvent
     * const MatchEvent = await prisma.matchEvent.delete({
     *   where: {
     *     // ... filter to delete one MatchEvent
     *   }
     * })
     *
     */
    delete<T extends MatchEventDeleteArgs>(args: Prisma.SelectSubset<T, MatchEventDeleteArgs<ExtArgs>>): Prisma.Prisma__MatchEventClient<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MatchEvent.
     * @param {MatchEventUpdateArgs} args - Arguments to update one MatchEvent.
     * @example
     * // Update one MatchEvent
     * const matchEvent = await prisma.matchEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MatchEventUpdateArgs>(args: Prisma.SelectSubset<T, MatchEventUpdateArgs<ExtArgs>>): Prisma.Prisma__MatchEventClient<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MatchEvents.
     * @param {MatchEventDeleteManyArgs} args - Arguments to filter MatchEvents to delete.
     * @example
     * // Delete a few MatchEvents
     * const { count } = await prisma.matchEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MatchEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, MatchEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MatchEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchEvents
     * const matchEvent = await prisma.matchEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MatchEventUpdateManyArgs>(args: Prisma.SelectSubset<T, MatchEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MatchEvent.
     * @param {MatchEventUpsertArgs} args - Arguments to update or create a MatchEvent.
     * @example
     * // Update or create a MatchEvent
     * const matchEvent = await prisma.matchEvent.upsert({
     *   create: {
     *     // ... data to create a MatchEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchEvent we want to update
     *   }
     * })
     */
    upsert<T extends MatchEventUpsertArgs>(args: Prisma.SelectSubset<T, MatchEventUpsertArgs<ExtArgs>>): Prisma.Prisma__MatchEventClient<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MatchEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventCountArgs} args - Arguments to filter MatchEvents to count.
     * @example
     * // Count the number of MatchEvents
     * const count = await prisma.matchEvent.count({
     *   where: {
     *     // ... the filter for the MatchEvents we want to count
     *   }
     * })
    **/
    count<T extends MatchEventCountArgs>(args?: Prisma.Subset<T, MatchEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MatchEventCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MatchEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MatchEventAggregateArgs>(args: Prisma.Subset<T, MatchEventAggregateArgs>): Prisma.PrismaPromise<GetMatchEventAggregateType<T>>;
    /**
     * Group by MatchEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MatchEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MatchEventGroupByArgs['orderBy'];
    } : {
        orderBy?: MatchEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MatchEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MatchEvent model
     */
    readonly fields: MatchEventFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MatchEvent.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MatchEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    player<T extends Prisma.MatchEvent$playerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchEvent$playerArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    team<T extends Prisma.MatchEvent$teamArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchEvent$teamArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    sub_out_player<T extends Prisma.MatchEvent$sub_out_playerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchEvent$sub_out_playerArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    match<T extends Prisma.MatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchDefaultArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the MatchEvent model
 */
export interface MatchEventFieldRefs {
    readonly id: Prisma.FieldRef<"MatchEvent", 'Int'>;
    readonly match_id: Prisma.FieldRef<"MatchEvent", 'Int'>;
    readonly player_id: Prisma.FieldRef<"MatchEvent", 'Int'>;
    readonly team_id: Prisma.FieldRef<"MatchEvent", 'Int'>;
    readonly type: Prisma.FieldRef<"MatchEvent", 'MatchEventType'>;
    readonly minute: Prisma.FieldRef<"MatchEvent", 'Int'>;
    readonly note: Prisma.FieldRef<"MatchEvent", 'String'>;
    readonly period: Prisma.FieldRef<"MatchEvent", 'MatchPeriod'>;
    readonly added_minute: Prisma.FieldRef<"MatchEvent", 'Int'>;
    readonly card_color: Prisma.FieldRef<"MatchEvent", 'CardColor'>;
    readonly time_source: Prisma.FieldRef<"MatchEvent", 'MatchEventTimeSource'>;
    readonly sub_out_player_id: Prisma.FieldRef<"MatchEvent", 'Int'>;
    readonly created_at: Prisma.FieldRef<"MatchEvent", 'DateTime'>;
}
/**
 * MatchEvent findUnique
 */
export type MatchEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchEvent to fetch.
     */
    where: Prisma.MatchEventWhereUniqueInput;
};
/**
 * MatchEvent findUniqueOrThrow
 */
export type MatchEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchEvent to fetch.
     */
    where: Prisma.MatchEventWhereUniqueInput;
};
/**
 * MatchEvent findFirst
 */
export type MatchEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchEvent to fetch.
     */
    where?: Prisma.MatchEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchEvents to fetch.
     */
    orderBy?: Prisma.MatchEventOrderByWithRelationInput | Prisma.MatchEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MatchEvents.
     */
    cursor?: Prisma.MatchEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchEvents.
     */
    distinct?: Prisma.MatchEventScalarFieldEnum | Prisma.MatchEventScalarFieldEnum[];
};
/**
 * MatchEvent findFirstOrThrow
 */
export type MatchEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchEvent to fetch.
     */
    where?: Prisma.MatchEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchEvents to fetch.
     */
    orderBy?: Prisma.MatchEventOrderByWithRelationInput | Prisma.MatchEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MatchEvents.
     */
    cursor?: Prisma.MatchEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchEvents.
     */
    distinct?: Prisma.MatchEventScalarFieldEnum | Prisma.MatchEventScalarFieldEnum[];
};
/**
 * MatchEvent findMany
 */
export type MatchEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchEvents to fetch.
     */
    where?: Prisma.MatchEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchEvents to fetch.
     */
    orderBy?: Prisma.MatchEventOrderByWithRelationInput | Prisma.MatchEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MatchEvents.
     */
    cursor?: Prisma.MatchEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchEvents.
     */
    distinct?: Prisma.MatchEventScalarFieldEnum | Prisma.MatchEventScalarFieldEnum[];
};
/**
 * MatchEvent create
 */
export type MatchEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a MatchEvent.
     */
    data: Prisma.XOR<Prisma.MatchEventCreateInput, Prisma.MatchEventUncheckedCreateInput>;
};
/**
 * MatchEvent createMany
 */
export type MatchEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchEvents.
     */
    data: Prisma.MatchEventCreateManyInput | Prisma.MatchEventCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * MatchEvent update
 */
export type MatchEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a MatchEvent.
     */
    data: Prisma.XOR<Prisma.MatchEventUpdateInput, Prisma.MatchEventUncheckedUpdateInput>;
    /**
     * Choose, which MatchEvent to update.
     */
    where: Prisma.MatchEventWhereUniqueInput;
};
/**
 * MatchEvent updateMany
 */
export type MatchEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchEvents.
     */
    data: Prisma.XOR<Prisma.MatchEventUpdateManyMutationInput, Prisma.MatchEventUncheckedUpdateManyInput>;
    /**
     * Filter which MatchEvents to update
     */
    where?: Prisma.MatchEventWhereInput;
    /**
     * Limit how many MatchEvents to update.
     */
    limit?: number;
};
/**
 * MatchEvent upsert
 */
export type MatchEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the MatchEvent to update in case it exists.
     */
    where: Prisma.MatchEventWhereUniqueInput;
    /**
     * In case the MatchEvent found by the `where` argument doesn't exist, create a new MatchEvent with this data.
     */
    create: Prisma.XOR<Prisma.MatchEventCreateInput, Prisma.MatchEventUncheckedCreateInput>;
    /**
     * In case the MatchEvent was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MatchEventUpdateInput, Prisma.MatchEventUncheckedUpdateInput>;
};
/**
 * MatchEvent delete
 */
export type MatchEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which MatchEvent to delete.
     */
    where: Prisma.MatchEventWhereUniqueInput;
};
/**
 * MatchEvent deleteMany
 */
export type MatchEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MatchEvents to delete
     */
    where?: Prisma.MatchEventWhereInput;
    /**
     * Limit how many MatchEvents to delete.
     */
    limit?: number;
};
/**
 * MatchEvent.player
 */
export type MatchEvent$playerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.PlayerWhereInput;
};
/**
 * MatchEvent.team
 */
export type MatchEvent$teamArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where?: Prisma.TeamWhereInput;
};
/**
 * MatchEvent.sub_out_player
 */
export type MatchEvent$sub_out_playerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.PlayerWhereInput;
};
/**
 * MatchEvent without action
 */
export type MatchEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=MatchEvent.d.ts.map