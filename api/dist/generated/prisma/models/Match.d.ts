import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Match
 *
 */
export type MatchModel = runtime.Types.Result.DefaultSelection<Prisma.$MatchPayload>;
export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null;
    _avg: MatchAvgAggregateOutputType | null;
    _sum: MatchSumAggregateOutputType | null;
    _min: MatchMinAggregateOutputType | null;
    _max: MatchMaxAggregateOutputType | null;
};
export type MatchAvgAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    group_id: number | null;
    home_team_id: number | null;
    away_team_id: number | null;
    home_score: number | null;
    away_score: number | null;
    leg: number | null;
    next_match_id: number | null;
    user_id: number | null;
    venue_id: number | null;
    season_id: number | null;
};
export type MatchSumAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    group_id: number | null;
    home_team_id: number | null;
    away_team_id: number | null;
    home_score: number | null;
    away_score: number | null;
    leg: number | null;
    next_match_id: number | null;
    user_id: number | null;
    venue_id: number | null;
    season_id: number | null;
};
export type MatchMinAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    group_id: number | null;
    home_team_id: number | null;
    away_team_id: number | null;
    scheduled_at: Date | null;
    played_at: Date | null;
    home_score: number | null;
    away_score: number | null;
    status: $Enums.MatchStatus | null;
    round: string | null;
    leg: number | null;
    next_match_id: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
    venue_id: number | null;
    is_published: boolean | null;
    referee: string | null;
    season_id: number | null;
};
export type MatchMaxAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    group_id: number | null;
    home_team_id: number | null;
    away_team_id: number | null;
    scheduled_at: Date | null;
    played_at: Date | null;
    home_score: number | null;
    away_score: number | null;
    status: $Enums.MatchStatus | null;
    round: string | null;
    leg: number | null;
    next_match_id: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
    venue_id: number | null;
    is_published: boolean | null;
    referee: string | null;
    season_id: number | null;
};
export type MatchCountAggregateOutputType = {
    id: number;
    phase_id: number;
    group_id: number;
    home_team_id: number;
    away_team_id: number;
    scheduled_at: number;
    played_at: number;
    home_score: number;
    away_score: number;
    status: number;
    round: number;
    leg: number;
    next_match_id: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    user_id: number;
    venue_id: number;
    is_published: number;
    referee: number;
    season_id: number;
    _all: number;
};
export type MatchAvgAggregateInputType = {
    id?: true;
    phase_id?: true;
    group_id?: true;
    home_team_id?: true;
    away_team_id?: true;
    home_score?: true;
    away_score?: true;
    leg?: true;
    next_match_id?: true;
    user_id?: true;
    venue_id?: true;
    season_id?: true;
};
export type MatchSumAggregateInputType = {
    id?: true;
    phase_id?: true;
    group_id?: true;
    home_team_id?: true;
    away_team_id?: true;
    home_score?: true;
    away_score?: true;
    leg?: true;
    next_match_id?: true;
    user_id?: true;
    venue_id?: true;
    season_id?: true;
};
export type MatchMinAggregateInputType = {
    id?: true;
    phase_id?: true;
    group_id?: true;
    home_team_id?: true;
    away_team_id?: true;
    scheduled_at?: true;
    played_at?: true;
    home_score?: true;
    away_score?: true;
    status?: true;
    round?: true;
    leg?: true;
    next_match_id?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
    venue_id?: true;
    is_published?: true;
    referee?: true;
    season_id?: true;
};
export type MatchMaxAggregateInputType = {
    id?: true;
    phase_id?: true;
    group_id?: true;
    home_team_id?: true;
    away_team_id?: true;
    scheduled_at?: true;
    played_at?: true;
    home_score?: true;
    away_score?: true;
    status?: true;
    round?: true;
    leg?: true;
    next_match_id?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
    venue_id?: true;
    is_published?: true;
    referee?: true;
    season_id?: true;
};
export type MatchCountAggregateInputType = {
    id?: true;
    phase_id?: true;
    group_id?: true;
    home_team_id?: true;
    away_team_id?: true;
    scheduled_at?: true;
    played_at?: true;
    home_score?: true;
    away_score?: true;
    status?: true;
    round?: true;
    leg?: true;
    next_match_id?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
    venue_id?: true;
    is_published?: true;
    referee?: true;
    season_id?: true;
    _all?: true;
};
export type MatchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Match to aggregate.
     */
    where?: Prisma.MatchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Matches to fetch.
     */
    orderBy?: Prisma.MatchOrderByWithRelationInput | Prisma.MatchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MatchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Matches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Matches
    **/
    _count?: true | MatchCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MatchAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MatchSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MatchMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MatchMaxAggregateInputType;
};
export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
    [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMatch[P]> : Prisma.GetScalarType<T[P], AggregateMatch[P]>;
};
export type MatchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
    orderBy?: Prisma.MatchOrderByWithAggregationInput | Prisma.MatchOrderByWithAggregationInput[];
    by: Prisma.MatchScalarFieldEnum[] | Prisma.MatchScalarFieldEnum;
    having?: Prisma.MatchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MatchCountAggregateInputType | true;
    _avg?: MatchAvgAggregateInputType;
    _sum?: MatchSumAggregateInputType;
    _min?: MatchMinAggregateInputType;
    _max?: MatchMaxAggregateInputType;
};
export type MatchGroupByOutputType = {
    id: number;
    phase_id: number;
    group_id: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at: Date | null;
    played_at: Date | null;
    home_score: number | null;
    away_score: number | null;
    status: $Enums.MatchStatus;
    round: string | null;
    leg: number | null;
    next_match_id: number | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
    venue_id: number | null;
    is_published: boolean;
    referee: string | null;
    season_id: number | null;
    _count: MatchCountAggregateOutputType | null;
    _avg: MatchAvgAggregateOutputType | null;
    _sum: MatchSumAggregateOutputType | null;
    _min: MatchMinAggregateOutputType | null;
    _max: MatchMaxAggregateOutputType | null;
};
export type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MatchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MatchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MatchGroupByOutputType[P]>;
}>>;
export type MatchWhereInput = {
    AND?: Prisma.MatchWhereInput | Prisma.MatchWhereInput[];
    OR?: Prisma.MatchWhereInput[];
    NOT?: Prisma.MatchWhereInput | Prisma.MatchWhereInput[];
    id?: Prisma.IntFilter<"Match"> | number;
    phase_id?: Prisma.IntFilter<"Match"> | number;
    group_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    home_team_id?: Prisma.IntFilter<"Match"> | number;
    away_team_id?: Prisma.IntFilter<"Match"> | number;
    scheduled_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    played_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    home_score?: Prisma.IntNullableFilter<"Match"> | number | null;
    away_score?: Prisma.IntNullableFilter<"Match"> | number | null;
    status?: Prisma.EnumMatchStatusFilter<"Match"> | $Enums.MatchStatus;
    round?: Prisma.StringNullableFilter<"Match"> | string | null;
    leg?: Prisma.IntNullableFilter<"Match"> | number | null;
    next_match_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    is_active?: Prisma.BoolFilter<"Match"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Match"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    user_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    venue_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    is_published?: Prisma.BoolFilter<"Match"> | boolean;
    referee?: Prisma.StringNullableFilter<"Match"> | string | null;
    season_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    phase?: Prisma.XOR<Prisma.PhaseScalarRelationFilter, Prisma.PhaseWhereInput>;
    group?: Prisma.XOR<Prisma.GroupNullableScalarRelationFilter, Prisma.GroupWhereInput> | null;
    home_team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    away_team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    next_match?: Prisma.XOR<Prisma.MatchNullableScalarRelationFilter, Prisma.MatchWhereInput> | null;
    prev_matches?: Prisma.MatchListRelationFilter;
    events?: Prisma.MatchEventListRelationFilter;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    matchResult?: Prisma.XOR<Prisma.MatchResultNullableScalarRelationFilter, Prisma.MatchResultWhereInput> | null;
    venue?: Prisma.XOR<Prisma.VenueNullableScalarRelationFilter, Prisma.VenueWhereInput> | null;
    season?: Prisma.XOR<Prisma.SeasonNullableScalarRelationFilter, Prisma.SeasonWhereInput> | null;
};
export type MatchOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    group_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_team_id?: Prisma.SortOrder;
    away_team_id?: Prisma.SortOrder;
    scheduled_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    played_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    away_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    round?: Prisma.SortOrderInput | Prisma.SortOrder;
    leg?: Prisma.SortOrderInput | Prisma.SortOrder;
    next_match_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    venue_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    referee?: Prisma.SortOrderInput | Prisma.SortOrder;
    season_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    phase?: Prisma.PhaseOrderByWithRelationInput;
    group?: Prisma.GroupOrderByWithRelationInput;
    home_team?: Prisma.TeamOrderByWithRelationInput;
    away_team?: Prisma.TeamOrderByWithRelationInput;
    next_match?: Prisma.MatchOrderByWithRelationInput;
    prev_matches?: Prisma.MatchOrderByRelationAggregateInput;
    events?: Prisma.MatchEventOrderByRelationAggregateInput;
    user?: Prisma.UserOrderByWithRelationInput;
    matchResult?: Prisma.MatchResultOrderByWithRelationInput;
    venue?: Prisma.VenueOrderByWithRelationInput;
    season?: Prisma.SeasonOrderByWithRelationInput;
    _relevance?: Prisma.MatchOrderByRelevanceInput;
};
export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.MatchWhereInput | Prisma.MatchWhereInput[];
    OR?: Prisma.MatchWhereInput[];
    NOT?: Prisma.MatchWhereInput | Prisma.MatchWhereInput[];
    phase_id?: Prisma.IntFilter<"Match"> | number;
    group_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    home_team_id?: Prisma.IntFilter<"Match"> | number;
    away_team_id?: Prisma.IntFilter<"Match"> | number;
    scheduled_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    played_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    home_score?: Prisma.IntNullableFilter<"Match"> | number | null;
    away_score?: Prisma.IntNullableFilter<"Match"> | number | null;
    status?: Prisma.EnumMatchStatusFilter<"Match"> | $Enums.MatchStatus;
    round?: Prisma.StringNullableFilter<"Match"> | string | null;
    leg?: Prisma.IntNullableFilter<"Match"> | number | null;
    next_match_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    is_active?: Prisma.BoolFilter<"Match"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Match"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    user_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    venue_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    is_published?: Prisma.BoolFilter<"Match"> | boolean;
    referee?: Prisma.StringNullableFilter<"Match"> | string | null;
    season_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    phase?: Prisma.XOR<Prisma.PhaseScalarRelationFilter, Prisma.PhaseWhereInput>;
    group?: Prisma.XOR<Prisma.GroupNullableScalarRelationFilter, Prisma.GroupWhereInput> | null;
    home_team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    away_team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    next_match?: Prisma.XOR<Prisma.MatchNullableScalarRelationFilter, Prisma.MatchWhereInput> | null;
    prev_matches?: Prisma.MatchListRelationFilter;
    events?: Prisma.MatchEventListRelationFilter;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    matchResult?: Prisma.XOR<Prisma.MatchResultNullableScalarRelationFilter, Prisma.MatchResultWhereInput> | null;
    venue?: Prisma.XOR<Prisma.VenueNullableScalarRelationFilter, Prisma.VenueWhereInput> | null;
    season?: Prisma.XOR<Prisma.SeasonNullableScalarRelationFilter, Prisma.SeasonWhereInput> | null;
}, "id">;
export type MatchOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    group_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_team_id?: Prisma.SortOrder;
    away_team_id?: Prisma.SortOrder;
    scheduled_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    played_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    away_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    round?: Prisma.SortOrderInput | Prisma.SortOrder;
    leg?: Prisma.SortOrderInput | Prisma.SortOrder;
    next_match_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    venue_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    referee?: Prisma.SortOrderInput | Prisma.SortOrder;
    season_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.MatchCountOrderByAggregateInput;
    _avg?: Prisma.MatchAvgOrderByAggregateInput;
    _max?: Prisma.MatchMaxOrderByAggregateInput;
    _min?: Prisma.MatchMinOrderByAggregateInput;
    _sum?: Prisma.MatchSumOrderByAggregateInput;
};
export type MatchScalarWhereWithAggregatesInput = {
    AND?: Prisma.MatchScalarWhereWithAggregatesInput | Prisma.MatchScalarWhereWithAggregatesInput[];
    OR?: Prisma.MatchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MatchScalarWhereWithAggregatesInput | Prisma.MatchScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Match"> | number;
    phase_id?: Prisma.IntWithAggregatesFilter<"Match"> | number;
    group_id?: Prisma.IntNullableWithAggregatesFilter<"Match"> | number | null;
    home_team_id?: Prisma.IntWithAggregatesFilter<"Match"> | number;
    away_team_id?: Prisma.IntWithAggregatesFilter<"Match"> | number;
    scheduled_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null;
    played_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null;
    home_score?: Prisma.IntNullableWithAggregatesFilter<"Match"> | number | null;
    away_score?: Prisma.IntNullableWithAggregatesFilter<"Match"> | number | null;
    status?: Prisma.EnumMatchStatusWithAggregatesFilter<"Match"> | $Enums.MatchStatus;
    round?: Prisma.StringNullableWithAggregatesFilter<"Match"> | string | null;
    leg?: Prisma.IntNullableWithAggregatesFilter<"Match"> | number | null;
    next_match_id?: Prisma.IntNullableWithAggregatesFilter<"Match"> | number | null;
    is_active?: Prisma.BoolWithAggregatesFilter<"Match"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Match"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null;
    user_id?: Prisma.IntNullableWithAggregatesFilter<"Match"> | number | null;
    venue_id?: Prisma.IntNullableWithAggregatesFilter<"Match"> | number | null;
    is_published?: Prisma.BoolWithAggregatesFilter<"Match"> | boolean;
    referee?: Prisma.StringNullableWithAggregatesFilter<"Match"> | string | null;
    season_id?: Prisma.IntNullableWithAggregatesFilter<"Match"> | number | null;
};
export type MatchCreateInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchUpdateInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchCreateManyInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
};
export type MatchUpdateManyMutationInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MatchUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type MatchListRelationFilter = {
    every?: Prisma.MatchWhereInput;
    some?: Prisma.MatchWhereInput;
    none?: Prisma.MatchWhereInput;
};
export type MatchOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MatchNullableScalarRelationFilter = {
    is?: Prisma.MatchWhereInput | null;
    isNot?: Prisma.MatchWhereInput | null;
};
export type MatchOrderByRelevanceInput = {
    fields: Prisma.MatchOrderByRelevanceFieldEnum | Prisma.MatchOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type MatchCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    home_team_id?: Prisma.SortOrder;
    away_team_id?: Prisma.SortOrder;
    scheduled_at?: Prisma.SortOrder;
    played_at?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    leg?: Prisma.SortOrder;
    next_match_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    referee?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
};
export type MatchAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    home_team_id?: Prisma.SortOrder;
    away_team_id?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    leg?: Prisma.SortOrder;
    next_match_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
};
export type MatchMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    home_team_id?: Prisma.SortOrder;
    away_team_id?: Prisma.SortOrder;
    scheduled_at?: Prisma.SortOrder;
    played_at?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    leg?: Prisma.SortOrder;
    next_match_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    referee?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
};
export type MatchMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    home_team_id?: Prisma.SortOrder;
    away_team_id?: Prisma.SortOrder;
    scheduled_at?: Prisma.SortOrder;
    played_at?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    leg?: Prisma.SortOrder;
    next_match_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    referee?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
};
export type MatchSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    group_id?: Prisma.SortOrder;
    home_team_id?: Prisma.SortOrder;
    away_team_id?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    leg?: Prisma.SortOrder;
    next_match_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
};
export type MatchScalarRelationFilter = {
    is?: Prisma.MatchWhereInput;
    isNot?: Prisma.MatchWhereInput;
};
export type MatchCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutUserInput, Prisma.MatchUncheckedCreateWithoutUserInput> | Prisma.MatchCreateWithoutUserInput[] | Prisma.MatchUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutUserInput | Prisma.MatchCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.MatchCreateManyUserInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutUserInput, Prisma.MatchUncheckedCreateWithoutUserInput> | Prisma.MatchCreateWithoutUserInput[] | Prisma.MatchUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutUserInput | Prisma.MatchCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.MatchCreateManyUserInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutUserInput, Prisma.MatchUncheckedCreateWithoutUserInput> | Prisma.MatchCreateWithoutUserInput[] | Prisma.MatchUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutUserInput | Prisma.MatchCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutUserInput | Prisma.MatchUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.MatchCreateManyUserInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutUserInput | Prisma.MatchUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutUserInput | Prisma.MatchUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutUserInput, Prisma.MatchUncheckedCreateWithoutUserInput> | Prisma.MatchCreateWithoutUserInput[] | Prisma.MatchUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutUserInput | Prisma.MatchCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutUserInput | Prisma.MatchUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.MatchCreateManyUserInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutUserInput | Prisma.MatchUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutUserInput | Prisma.MatchUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutSeasonInput, Prisma.MatchUncheckedCreateWithoutSeasonInput> | Prisma.MatchCreateWithoutSeasonInput[] | Prisma.MatchUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutSeasonInput | Prisma.MatchCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.MatchCreateManySeasonInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutSeasonInput, Prisma.MatchUncheckedCreateWithoutSeasonInput> | Prisma.MatchCreateWithoutSeasonInput[] | Prisma.MatchUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutSeasonInput | Prisma.MatchCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.MatchCreateManySeasonInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutSeasonInput, Prisma.MatchUncheckedCreateWithoutSeasonInput> | Prisma.MatchCreateWithoutSeasonInput[] | Prisma.MatchUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutSeasonInput | Prisma.MatchCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutSeasonInput | Prisma.MatchUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.MatchCreateManySeasonInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutSeasonInput | Prisma.MatchUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutSeasonInput | Prisma.MatchUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutSeasonInput, Prisma.MatchUncheckedCreateWithoutSeasonInput> | Prisma.MatchCreateWithoutSeasonInput[] | Prisma.MatchUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutSeasonInput | Prisma.MatchCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutSeasonInput | Prisma.MatchUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.MatchCreateManySeasonInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutSeasonInput | Prisma.MatchUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutSeasonInput | Prisma.MatchUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchCreateNestedManyWithoutPhaseInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutPhaseInput, Prisma.MatchUncheckedCreateWithoutPhaseInput> | Prisma.MatchCreateWithoutPhaseInput[] | Prisma.MatchUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutPhaseInput | Prisma.MatchCreateOrConnectWithoutPhaseInput[];
    createMany?: Prisma.MatchCreateManyPhaseInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutPhaseInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutPhaseInput, Prisma.MatchUncheckedCreateWithoutPhaseInput> | Prisma.MatchCreateWithoutPhaseInput[] | Prisma.MatchUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutPhaseInput | Prisma.MatchCreateOrConnectWithoutPhaseInput[];
    createMany?: Prisma.MatchCreateManyPhaseInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUpdateManyWithoutPhaseNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutPhaseInput, Prisma.MatchUncheckedCreateWithoutPhaseInput> | Prisma.MatchCreateWithoutPhaseInput[] | Prisma.MatchUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutPhaseInput | Prisma.MatchCreateOrConnectWithoutPhaseInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutPhaseInput | Prisma.MatchUpsertWithWhereUniqueWithoutPhaseInput[];
    createMany?: Prisma.MatchCreateManyPhaseInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutPhaseInput | Prisma.MatchUpdateWithWhereUniqueWithoutPhaseInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutPhaseInput | Prisma.MatchUpdateManyWithWhereWithoutPhaseInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutPhaseNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutPhaseInput, Prisma.MatchUncheckedCreateWithoutPhaseInput> | Prisma.MatchCreateWithoutPhaseInput[] | Prisma.MatchUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutPhaseInput | Prisma.MatchCreateOrConnectWithoutPhaseInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutPhaseInput | Prisma.MatchUpsertWithWhereUniqueWithoutPhaseInput[];
    createMany?: Prisma.MatchCreateManyPhaseInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutPhaseInput | Prisma.MatchUpdateWithWhereUniqueWithoutPhaseInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutPhaseInput | Prisma.MatchUpdateManyWithWhereWithoutPhaseInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchCreateNestedManyWithoutGroupInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutGroupInput, Prisma.MatchUncheckedCreateWithoutGroupInput> | Prisma.MatchCreateWithoutGroupInput[] | Prisma.MatchUncheckedCreateWithoutGroupInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutGroupInput | Prisma.MatchCreateOrConnectWithoutGroupInput[];
    createMany?: Prisma.MatchCreateManyGroupInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutGroupInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutGroupInput, Prisma.MatchUncheckedCreateWithoutGroupInput> | Prisma.MatchCreateWithoutGroupInput[] | Prisma.MatchUncheckedCreateWithoutGroupInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutGroupInput | Prisma.MatchCreateOrConnectWithoutGroupInput[];
    createMany?: Prisma.MatchCreateManyGroupInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUpdateManyWithoutGroupNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutGroupInput, Prisma.MatchUncheckedCreateWithoutGroupInput> | Prisma.MatchCreateWithoutGroupInput[] | Prisma.MatchUncheckedCreateWithoutGroupInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutGroupInput | Prisma.MatchCreateOrConnectWithoutGroupInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutGroupInput | Prisma.MatchUpsertWithWhereUniqueWithoutGroupInput[];
    createMany?: Prisma.MatchCreateManyGroupInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutGroupInput | Prisma.MatchUpdateWithWhereUniqueWithoutGroupInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutGroupInput | Prisma.MatchUpdateManyWithWhereWithoutGroupInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutGroupInput, Prisma.MatchUncheckedCreateWithoutGroupInput> | Prisma.MatchCreateWithoutGroupInput[] | Prisma.MatchUncheckedCreateWithoutGroupInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutGroupInput | Prisma.MatchCreateOrConnectWithoutGroupInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutGroupInput | Prisma.MatchUpsertWithWhereUniqueWithoutGroupInput[];
    createMany?: Prisma.MatchCreateManyGroupInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutGroupInput | Prisma.MatchUpdateWithWhereUniqueWithoutGroupInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutGroupInput | Prisma.MatchUpdateManyWithWhereWithoutGroupInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchCreateNestedManyWithoutHome_teamInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutHome_teamInput, Prisma.MatchUncheckedCreateWithoutHome_teamInput> | Prisma.MatchCreateWithoutHome_teamInput[] | Prisma.MatchUncheckedCreateWithoutHome_teamInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutHome_teamInput | Prisma.MatchCreateOrConnectWithoutHome_teamInput[];
    createMany?: Prisma.MatchCreateManyHome_teamInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchCreateNestedManyWithoutAway_teamInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutAway_teamInput, Prisma.MatchUncheckedCreateWithoutAway_teamInput> | Prisma.MatchCreateWithoutAway_teamInput[] | Prisma.MatchUncheckedCreateWithoutAway_teamInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutAway_teamInput | Prisma.MatchCreateOrConnectWithoutAway_teamInput[];
    createMany?: Prisma.MatchCreateManyAway_teamInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutHome_teamInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutHome_teamInput, Prisma.MatchUncheckedCreateWithoutHome_teamInput> | Prisma.MatchCreateWithoutHome_teamInput[] | Prisma.MatchUncheckedCreateWithoutHome_teamInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutHome_teamInput | Prisma.MatchCreateOrConnectWithoutHome_teamInput[];
    createMany?: Prisma.MatchCreateManyHome_teamInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutAway_teamInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutAway_teamInput, Prisma.MatchUncheckedCreateWithoutAway_teamInput> | Prisma.MatchCreateWithoutAway_teamInput[] | Prisma.MatchUncheckedCreateWithoutAway_teamInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutAway_teamInput | Prisma.MatchCreateOrConnectWithoutAway_teamInput[];
    createMany?: Prisma.MatchCreateManyAway_teamInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUpdateManyWithoutHome_teamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutHome_teamInput, Prisma.MatchUncheckedCreateWithoutHome_teamInput> | Prisma.MatchCreateWithoutHome_teamInput[] | Prisma.MatchUncheckedCreateWithoutHome_teamInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutHome_teamInput | Prisma.MatchCreateOrConnectWithoutHome_teamInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutHome_teamInput | Prisma.MatchUpsertWithWhereUniqueWithoutHome_teamInput[];
    createMany?: Prisma.MatchCreateManyHome_teamInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutHome_teamInput | Prisma.MatchUpdateWithWhereUniqueWithoutHome_teamInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutHome_teamInput | Prisma.MatchUpdateManyWithWhereWithoutHome_teamInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUpdateManyWithoutAway_teamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutAway_teamInput, Prisma.MatchUncheckedCreateWithoutAway_teamInput> | Prisma.MatchCreateWithoutAway_teamInput[] | Prisma.MatchUncheckedCreateWithoutAway_teamInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutAway_teamInput | Prisma.MatchCreateOrConnectWithoutAway_teamInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutAway_teamInput | Prisma.MatchUpsertWithWhereUniqueWithoutAway_teamInput[];
    createMany?: Prisma.MatchCreateManyAway_teamInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutAway_teamInput | Prisma.MatchUpdateWithWhereUniqueWithoutAway_teamInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutAway_teamInput | Prisma.MatchUpdateManyWithWhereWithoutAway_teamInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutHome_teamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutHome_teamInput, Prisma.MatchUncheckedCreateWithoutHome_teamInput> | Prisma.MatchCreateWithoutHome_teamInput[] | Prisma.MatchUncheckedCreateWithoutHome_teamInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutHome_teamInput | Prisma.MatchCreateOrConnectWithoutHome_teamInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutHome_teamInput | Prisma.MatchUpsertWithWhereUniqueWithoutHome_teamInput[];
    createMany?: Prisma.MatchCreateManyHome_teamInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutHome_teamInput | Prisma.MatchUpdateWithWhereUniqueWithoutHome_teamInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutHome_teamInput | Prisma.MatchUpdateManyWithWhereWithoutHome_teamInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutAway_teamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutAway_teamInput, Prisma.MatchUncheckedCreateWithoutAway_teamInput> | Prisma.MatchCreateWithoutAway_teamInput[] | Prisma.MatchUncheckedCreateWithoutAway_teamInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutAway_teamInput | Prisma.MatchCreateOrConnectWithoutAway_teamInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutAway_teamInput | Prisma.MatchUpsertWithWhereUniqueWithoutAway_teamInput[];
    createMany?: Prisma.MatchCreateManyAway_teamInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutAway_teamInput | Prisma.MatchUpdateWithWhereUniqueWithoutAway_teamInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutAway_teamInput | Prisma.MatchUpdateManyWithWhereWithoutAway_teamInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchCreateNestedOneWithoutPrev_matchesInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutPrev_matchesInput, Prisma.MatchUncheckedCreateWithoutPrev_matchesInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutPrev_matchesInput;
    connect?: Prisma.MatchWhereUniqueInput;
};
export type MatchCreateNestedManyWithoutNext_matchInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutNext_matchInput, Prisma.MatchUncheckedCreateWithoutNext_matchInput> | Prisma.MatchCreateWithoutNext_matchInput[] | Prisma.MatchUncheckedCreateWithoutNext_matchInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutNext_matchInput | Prisma.MatchCreateOrConnectWithoutNext_matchInput[];
    createMany?: Prisma.MatchCreateManyNext_matchInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutNext_matchInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutNext_matchInput, Prisma.MatchUncheckedCreateWithoutNext_matchInput> | Prisma.MatchCreateWithoutNext_matchInput[] | Prisma.MatchUncheckedCreateWithoutNext_matchInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutNext_matchInput | Prisma.MatchCreateOrConnectWithoutNext_matchInput[];
    createMany?: Prisma.MatchCreateManyNext_matchInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type EnumMatchStatusFieldUpdateOperationsInput = {
    set?: $Enums.MatchStatus;
};
export type MatchUpdateOneWithoutPrev_matchesNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutPrev_matchesInput, Prisma.MatchUncheckedCreateWithoutPrev_matchesInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutPrev_matchesInput;
    upsert?: Prisma.MatchUpsertWithoutPrev_matchesInput;
    disconnect?: Prisma.MatchWhereInput | boolean;
    delete?: Prisma.MatchWhereInput | boolean;
    connect?: Prisma.MatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MatchUpdateToOneWithWhereWithoutPrev_matchesInput, Prisma.MatchUpdateWithoutPrev_matchesInput>, Prisma.MatchUncheckedUpdateWithoutPrev_matchesInput>;
};
export type MatchUpdateManyWithoutNext_matchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutNext_matchInput, Prisma.MatchUncheckedCreateWithoutNext_matchInput> | Prisma.MatchCreateWithoutNext_matchInput[] | Prisma.MatchUncheckedCreateWithoutNext_matchInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutNext_matchInput | Prisma.MatchCreateOrConnectWithoutNext_matchInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutNext_matchInput | Prisma.MatchUpsertWithWhereUniqueWithoutNext_matchInput[];
    createMany?: Prisma.MatchCreateManyNext_matchInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutNext_matchInput | Prisma.MatchUpdateWithWhereUniqueWithoutNext_matchInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutNext_matchInput | Prisma.MatchUpdateManyWithWhereWithoutNext_matchInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutNext_matchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutNext_matchInput, Prisma.MatchUncheckedCreateWithoutNext_matchInput> | Prisma.MatchCreateWithoutNext_matchInput[] | Prisma.MatchUncheckedCreateWithoutNext_matchInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutNext_matchInput | Prisma.MatchCreateOrConnectWithoutNext_matchInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutNext_matchInput | Prisma.MatchUpsertWithWhereUniqueWithoutNext_matchInput[];
    createMany?: Prisma.MatchCreateManyNext_matchInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutNext_matchInput | Prisma.MatchUpdateWithWhereUniqueWithoutNext_matchInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutNext_matchInput | Prisma.MatchUpdateManyWithWhereWithoutNext_matchInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchCreateNestedOneWithoutEventsInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutEventsInput, Prisma.MatchUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutEventsInput;
    connect?: Prisma.MatchWhereUniqueInput;
};
export type MatchUpdateOneRequiredWithoutEventsNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutEventsInput, Prisma.MatchUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutEventsInput;
    upsert?: Prisma.MatchUpsertWithoutEventsInput;
    connect?: Prisma.MatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MatchUpdateToOneWithWhereWithoutEventsInput, Prisma.MatchUpdateWithoutEventsInput>, Prisma.MatchUncheckedUpdateWithoutEventsInput>;
};
export type MatchCreateNestedManyWithoutVenueInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutVenueInput, Prisma.MatchUncheckedCreateWithoutVenueInput> | Prisma.MatchCreateWithoutVenueInput[] | Prisma.MatchUncheckedCreateWithoutVenueInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutVenueInput | Prisma.MatchCreateOrConnectWithoutVenueInput[];
    createMany?: Prisma.MatchCreateManyVenueInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutVenueInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutVenueInput, Prisma.MatchUncheckedCreateWithoutVenueInput> | Prisma.MatchCreateWithoutVenueInput[] | Prisma.MatchUncheckedCreateWithoutVenueInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutVenueInput | Prisma.MatchCreateOrConnectWithoutVenueInput[];
    createMany?: Prisma.MatchCreateManyVenueInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUpdateManyWithoutVenueNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutVenueInput, Prisma.MatchUncheckedCreateWithoutVenueInput> | Prisma.MatchCreateWithoutVenueInput[] | Prisma.MatchUncheckedCreateWithoutVenueInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutVenueInput | Prisma.MatchCreateOrConnectWithoutVenueInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutVenueInput | Prisma.MatchUpsertWithWhereUniqueWithoutVenueInput[];
    createMany?: Prisma.MatchCreateManyVenueInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutVenueInput | Prisma.MatchUpdateWithWhereUniqueWithoutVenueInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutVenueInput | Prisma.MatchUpdateManyWithWhereWithoutVenueInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutVenueNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutVenueInput, Prisma.MatchUncheckedCreateWithoutVenueInput> | Prisma.MatchCreateWithoutVenueInput[] | Prisma.MatchUncheckedCreateWithoutVenueInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutVenueInput | Prisma.MatchCreateOrConnectWithoutVenueInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutVenueInput | Prisma.MatchUpsertWithWhereUniqueWithoutVenueInput[];
    createMany?: Prisma.MatchCreateManyVenueInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutVenueInput | Prisma.MatchUpdateWithWhereUniqueWithoutVenueInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutVenueInput | Prisma.MatchUpdateManyWithWhereWithoutVenueInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchCreateNestedOneWithoutMatchResultInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutMatchResultInput, Prisma.MatchUncheckedCreateWithoutMatchResultInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutMatchResultInput;
    connect?: Prisma.MatchWhereUniqueInput;
};
export type MatchUpdateOneRequiredWithoutMatchResultNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutMatchResultInput, Prisma.MatchUncheckedCreateWithoutMatchResultInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutMatchResultInput;
    upsert?: Prisma.MatchUpsertWithoutMatchResultInput;
    connect?: Prisma.MatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MatchUpdateToOneWithWhereWithoutMatchResultInput, Prisma.MatchUpdateWithoutMatchResultInput>, Prisma.MatchUncheckedUpdateWithoutMatchResultInput>;
};
export type MatchCreateWithoutUserInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutUserInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutUserInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutUserInput, Prisma.MatchUncheckedCreateWithoutUserInput>;
};
export type MatchCreateManyUserInputEnvelope = {
    data: Prisma.MatchCreateManyUserInput | Prisma.MatchCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type MatchUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutUserInput, Prisma.MatchUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutUserInput, Prisma.MatchUncheckedCreateWithoutUserInput>;
};
export type MatchUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutUserInput, Prisma.MatchUncheckedUpdateWithoutUserInput>;
};
export type MatchUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutUserInput>;
};
export type MatchScalarWhereInput = {
    AND?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
    OR?: Prisma.MatchScalarWhereInput[];
    NOT?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
    id?: Prisma.IntFilter<"Match"> | number;
    phase_id?: Prisma.IntFilter<"Match"> | number;
    group_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    home_team_id?: Prisma.IntFilter<"Match"> | number;
    away_team_id?: Prisma.IntFilter<"Match"> | number;
    scheduled_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    played_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    home_score?: Prisma.IntNullableFilter<"Match"> | number | null;
    away_score?: Prisma.IntNullableFilter<"Match"> | number | null;
    status?: Prisma.EnumMatchStatusFilter<"Match"> | $Enums.MatchStatus;
    round?: Prisma.StringNullableFilter<"Match"> | string | null;
    leg?: Prisma.IntNullableFilter<"Match"> | number | null;
    next_match_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    is_active?: Prisma.BoolFilter<"Match"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Match"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    user_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    venue_id?: Prisma.IntNullableFilter<"Match"> | number | null;
    is_published?: Prisma.BoolFilter<"Match"> | boolean;
    referee?: Prisma.StringNullableFilter<"Match"> | string | null;
    season_id?: Prisma.IntNullableFilter<"Match"> | number | null;
};
export type MatchCreateWithoutSeasonInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutSeasonInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutSeasonInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutSeasonInput, Prisma.MatchUncheckedCreateWithoutSeasonInput>;
};
export type MatchCreateManySeasonInputEnvelope = {
    data: Prisma.MatchCreateManySeasonInput | Prisma.MatchCreateManySeasonInput[];
    skipDuplicates?: boolean;
};
export type MatchUpsertWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutSeasonInput, Prisma.MatchUncheckedUpdateWithoutSeasonInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutSeasonInput, Prisma.MatchUncheckedCreateWithoutSeasonInput>;
};
export type MatchUpdateWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutSeasonInput, Prisma.MatchUncheckedUpdateWithoutSeasonInput>;
};
export type MatchUpdateManyWithWhereWithoutSeasonInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutSeasonInput>;
};
export type MatchCreateWithoutPhaseInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutPhaseInput = {
    id?: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutPhaseInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutPhaseInput, Prisma.MatchUncheckedCreateWithoutPhaseInput>;
};
export type MatchCreateManyPhaseInputEnvelope = {
    data: Prisma.MatchCreateManyPhaseInput | Prisma.MatchCreateManyPhaseInput[];
    skipDuplicates?: boolean;
};
export type MatchUpsertWithWhereUniqueWithoutPhaseInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutPhaseInput, Prisma.MatchUncheckedUpdateWithoutPhaseInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutPhaseInput, Prisma.MatchUncheckedCreateWithoutPhaseInput>;
};
export type MatchUpdateWithWhereUniqueWithoutPhaseInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutPhaseInput, Prisma.MatchUncheckedUpdateWithoutPhaseInput>;
};
export type MatchUpdateManyWithWhereWithoutPhaseInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutPhaseInput>;
};
export type MatchCreateWithoutGroupInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutGroupInput = {
    id?: number;
    phase_id: number;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutGroupInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutGroupInput, Prisma.MatchUncheckedCreateWithoutGroupInput>;
};
export type MatchCreateManyGroupInputEnvelope = {
    data: Prisma.MatchCreateManyGroupInput | Prisma.MatchCreateManyGroupInput[];
    skipDuplicates?: boolean;
};
export type MatchUpsertWithWhereUniqueWithoutGroupInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutGroupInput, Prisma.MatchUncheckedUpdateWithoutGroupInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutGroupInput, Prisma.MatchUncheckedCreateWithoutGroupInput>;
};
export type MatchUpdateWithWhereUniqueWithoutGroupInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutGroupInput, Prisma.MatchUncheckedUpdateWithoutGroupInput>;
};
export type MatchUpdateManyWithWhereWithoutGroupInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutGroupInput>;
};
export type MatchCreateWithoutHome_teamInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutHome_teamInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutHome_teamInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutHome_teamInput, Prisma.MatchUncheckedCreateWithoutHome_teamInput>;
};
export type MatchCreateManyHome_teamInputEnvelope = {
    data: Prisma.MatchCreateManyHome_teamInput | Prisma.MatchCreateManyHome_teamInput[];
    skipDuplicates?: boolean;
};
export type MatchCreateWithoutAway_teamInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutAway_teamInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutAway_teamInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutAway_teamInput, Prisma.MatchUncheckedCreateWithoutAway_teamInput>;
};
export type MatchCreateManyAway_teamInputEnvelope = {
    data: Prisma.MatchCreateManyAway_teamInput | Prisma.MatchCreateManyAway_teamInput[];
    skipDuplicates?: boolean;
};
export type MatchUpsertWithWhereUniqueWithoutHome_teamInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutHome_teamInput, Prisma.MatchUncheckedUpdateWithoutHome_teamInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutHome_teamInput, Prisma.MatchUncheckedCreateWithoutHome_teamInput>;
};
export type MatchUpdateWithWhereUniqueWithoutHome_teamInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutHome_teamInput, Prisma.MatchUncheckedUpdateWithoutHome_teamInput>;
};
export type MatchUpdateManyWithWhereWithoutHome_teamInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutHome_teamInput>;
};
export type MatchUpsertWithWhereUniqueWithoutAway_teamInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutAway_teamInput, Prisma.MatchUncheckedUpdateWithoutAway_teamInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutAway_teamInput, Prisma.MatchUncheckedCreateWithoutAway_teamInput>;
};
export type MatchUpdateWithWhereUniqueWithoutAway_teamInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutAway_teamInput, Prisma.MatchUncheckedUpdateWithoutAway_teamInput>;
};
export type MatchUpdateManyWithWhereWithoutAway_teamInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutAway_teamInput>;
};
export type MatchCreateWithoutPrev_matchesInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutPrev_matchesInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutPrev_matchesInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutPrev_matchesInput, Prisma.MatchUncheckedCreateWithoutPrev_matchesInput>;
};
export type MatchCreateWithoutNext_matchInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutNext_matchInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutNext_matchInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutNext_matchInput, Prisma.MatchUncheckedCreateWithoutNext_matchInput>;
};
export type MatchCreateManyNext_matchInputEnvelope = {
    data: Prisma.MatchCreateManyNext_matchInput | Prisma.MatchCreateManyNext_matchInput[];
    skipDuplicates?: boolean;
};
export type MatchUpsertWithoutPrev_matchesInput = {
    update: Prisma.XOR<Prisma.MatchUpdateWithoutPrev_matchesInput, Prisma.MatchUncheckedUpdateWithoutPrev_matchesInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutPrev_matchesInput, Prisma.MatchUncheckedCreateWithoutPrev_matchesInput>;
    where?: Prisma.MatchWhereInput;
};
export type MatchUpdateToOneWithWhereWithoutPrev_matchesInput = {
    where?: Prisma.MatchWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutPrev_matchesInput, Prisma.MatchUncheckedUpdateWithoutPrev_matchesInput>;
};
export type MatchUpdateWithoutPrev_matchesInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutPrev_matchesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchUpsertWithWhereUniqueWithoutNext_matchInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutNext_matchInput, Prisma.MatchUncheckedUpdateWithoutNext_matchInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutNext_matchInput, Prisma.MatchUncheckedCreateWithoutNext_matchInput>;
};
export type MatchUpdateWithWhereUniqueWithoutNext_matchInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutNext_matchInput, Prisma.MatchUncheckedUpdateWithoutNext_matchInput>;
};
export type MatchUpdateManyWithWhereWithoutNext_matchInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutNext_matchInput>;
};
export type MatchCreateWithoutEventsInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutEventsInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutEventsInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutEventsInput, Prisma.MatchUncheckedCreateWithoutEventsInput>;
};
export type MatchUpsertWithoutEventsInput = {
    update: Prisma.XOR<Prisma.MatchUpdateWithoutEventsInput, Prisma.MatchUncheckedUpdateWithoutEventsInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutEventsInput, Prisma.MatchUncheckedCreateWithoutEventsInput>;
    where?: Prisma.MatchWhereInput;
};
export type MatchUpdateToOneWithWhereWithoutEventsInput = {
    where?: Prisma.MatchWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutEventsInput, Prisma.MatchUncheckedUpdateWithoutEventsInput>;
};
export type MatchUpdateWithoutEventsInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutEventsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchCreateWithoutVenueInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    matchResult?: Prisma.MatchResultCreateNestedOneWithoutMatchInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutVenueInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
    matchResult?: Prisma.MatchResultUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutVenueInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutVenueInput, Prisma.MatchUncheckedCreateWithoutVenueInput>;
};
export type MatchCreateManyVenueInputEnvelope = {
    data: Prisma.MatchCreateManyVenueInput | Prisma.MatchCreateManyVenueInput[];
    skipDuplicates?: boolean;
};
export type MatchUpsertWithWhereUniqueWithoutVenueInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutVenueInput, Prisma.MatchUncheckedUpdateWithoutVenueInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutVenueInput, Prisma.MatchUncheckedCreateWithoutVenueInput>;
};
export type MatchUpdateWithWhereUniqueWithoutVenueInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutVenueInput, Prisma.MatchUncheckedUpdateWithoutVenueInput>;
};
export type MatchUpdateManyWithWhereWithoutVenueInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutVenueInput>;
};
export type MatchCreateWithoutMatchResultInput = {
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_published?: boolean;
    referee?: string | null;
    phase: Prisma.PhaseCreateNestedOneWithoutMatchesInput;
    group?: Prisma.GroupCreateNestedOneWithoutMatchesInput;
    home_team: Prisma.TeamCreateNestedOneWithoutHome_matchesInput;
    away_team: Prisma.TeamCreateNestedOneWithoutAway_matchesInput;
    next_match?: Prisma.MatchCreateNestedOneWithoutPrev_matchesInput;
    prev_matches?: Prisma.MatchCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventCreateNestedManyWithoutMatchInput;
    user?: Prisma.UserCreateNestedOneWithoutMatchesInput;
    venue?: Prisma.VenueCreateNestedOneWithoutMatchesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutMatchesInput;
};
export type MatchUncheckedCreateWithoutMatchResultInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
    prev_matches?: Prisma.MatchUncheckedCreateNestedManyWithoutNext_matchInput;
    events?: Prisma.MatchEventUncheckedCreateNestedManyWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutMatchResultInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutMatchResultInput, Prisma.MatchUncheckedCreateWithoutMatchResultInput>;
};
export type MatchUpsertWithoutMatchResultInput = {
    update: Prisma.XOR<Prisma.MatchUpdateWithoutMatchResultInput, Prisma.MatchUncheckedUpdateWithoutMatchResultInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutMatchResultInput, Prisma.MatchUncheckedCreateWithoutMatchResultInput>;
    where?: Prisma.MatchWhereInput;
};
export type MatchUpdateToOneWithWhereWithoutMatchResultInput = {
    where?: Prisma.MatchWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutMatchResultInput, Prisma.MatchUncheckedUpdateWithoutMatchResultInput>;
};
export type MatchUpdateWithoutMatchResultInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutMatchResultInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
};
export type MatchCreateManyUserInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
};
export type MatchUpdateWithoutUserInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type MatchCreateManySeasonInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
};
export type MatchUpdateWithoutSeasonInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MatchCreateManyPhaseInput = {
    id?: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
};
export type MatchUpdateWithoutPhaseInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutPhaseInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutPhaseInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type MatchCreateManyGroupInput = {
    id?: number;
    phase_id: number;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
};
export type MatchUpdateWithoutGroupInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutGroupInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutGroupInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type MatchCreateManyHome_teamInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
};
export type MatchCreateManyAway_teamInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
};
export type MatchUpdateWithoutHome_teamInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutHome_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutHome_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type MatchUpdateWithoutAway_teamInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutAway_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutAway_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type MatchCreateManyNext_matchInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    venue_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
};
export type MatchUpdateWithoutNext_matchInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    venue?: Prisma.VenueUpdateOneWithoutMatchesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutNext_matchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutNext_matchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    venue_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type MatchCreateManyVenueInput = {
    id?: number;
    phase_id: number;
    group_id?: number | null;
    home_team_id: number;
    away_team_id: number;
    scheduled_at?: Date | string | null;
    played_at?: Date | string | null;
    home_score?: number | null;
    away_score?: number | null;
    status?: $Enums.MatchStatus;
    round?: string | null;
    leg?: number | null;
    next_match_id?: number | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
    is_published?: boolean;
    referee?: string | null;
    season_id?: number | null;
};
export type MatchUpdateWithoutVenueInput = {
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutMatchesNestedInput;
    group?: Prisma.GroupUpdateOneWithoutMatchesNestedInput;
    home_team?: Prisma.TeamUpdateOneRequiredWithoutHome_matchesNestedInput;
    away_team?: Prisma.TeamUpdateOneRequiredWithoutAway_matchesNestedInput;
    next_match?: Prisma.MatchUpdateOneWithoutPrev_matchesNestedInput;
    prev_matches?: Prisma.MatchUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUpdateManyWithoutMatchNestedInput;
    user?: Prisma.UserUpdateOneWithoutMatchesNestedInput;
    matchResult?: Prisma.MatchResultUpdateOneWithoutMatchNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutMatchesNestedInput;
};
export type MatchUncheckedUpdateWithoutVenueInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    prev_matches?: Prisma.MatchUncheckedUpdateManyWithoutNext_matchNestedInput;
    events?: Prisma.MatchEventUncheckedUpdateManyWithoutMatchNestedInput;
    matchResult?: Prisma.MatchResultUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutVenueInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    group_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    away_team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    scheduled_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    played_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    home_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus;
    round?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leg?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    next_match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    referee?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
/**
 * Count Type MatchCountOutputType
 */
export type MatchCountOutputType = {
    prev_matches: number;
    events: number;
};
export type MatchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    prev_matches?: boolean | MatchCountOutputTypeCountPrev_matchesArgs;
    events?: boolean | MatchCountOutputTypeCountEventsArgs;
};
/**
 * MatchCountOutputType without action
 */
export type MatchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCountOutputType
     */
    select?: Prisma.MatchCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * MatchCountOutputType without action
 */
export type MatchCountOutputTypeCountPrev_matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
};
/**
 * MatchCountOutputType without action
 */
export type MatchCountOutputTypeCountEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchEventWhereInput;
};
export type MatchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    phase_id?: boolean;
    group_id?: boolean;
    home_team_id?: boolean;
    away_team_id?: boolean;
    scheduled_at?: boolean;
    played_at?: boolean;
    home_score?: boolean;
    away_score?: boolean;
    status?: boolean;
    round?: boolean;
    leg?: boolean;
    next_match_id?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    user_id?: boolean;
    venue_id?: boolean;
    is_published?: boolean;
    referee?: boolean;
    season_id?: boolean;
    phase?: boolean | Prisma.PhaseDefaultArgs<ExtArgs>;
    group?: boolean | Prisma.Match$groupArgs<ExtArgs>;
    home_team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    away_team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    next_match?: boolean | Prisma.Match$next_matchArgs<ExtArgs>;
    prev_matches?: boolean | Prisma.Match$prev_matchesArgs<ExtArgs>;
    events?: boolean | Prisma.Match$eventsArgs<ExtArgs>;
    user?: boolean | Prisma.Match$userArgs<ExtArgs>;
    matchResult?: boolean | Prisma.Match$matchResultArgs<ExtArgs>;
    venue?: boolean | Prisma.Match$venueArgs<ExtArgs>;
    season?: boolean | Prisma.Match$seasonArgs<ExtArgs>;
    _count?: boolean | Prisma.MatchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["match"]>;
export type MatchSelectScalar = {
    id?: boolean;
    phase_id?: boolean;
    group_id?: boolean;
    home_team_id?: boolean;
    away_team_id?: boolean;
    scheduled_at?: boolean;
    played_at?: boolean;
    home_score?: boolean;
    away_score?: boolean;
    status?: boolean;
    round?: boolean;
    leg?: boolean;
    next_match_id?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    user_id?: boolean;
    venue_id?: boolean;
    is_published?: boolean;
    referee?: boolean;
    season_id?: boolean;
};
export type MatchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "phase_id" | "group_id" | "home_team_id" | "away_team_id" | "scheduled_at" | "played_at" | "home_score" | "away_score" | "status" | "round" | "leg" | "next_match_id" | "is_active" | "created_at" | "updated_at" | "deleted_at" | "user_id" | "venue_id" | "is_published" | "referee" | "season_id", ExtArgs["result"]["match"]>;
export type MatchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    phase?: boolean | Prisma.PhaseDefaultArgs<ExtArgs>;
    group?: boolean | Prisma.Match$groupArgs<ExtArgs>;
    home_team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    away_team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    next_match?: boolean | Prisma.Match$next_matchArgs<ExtArgs>;
    prev_matches?: boolean | Prisma.Match$prev_matchesArgs<ExtArgs>;
    events?: boolean | Prisma.Match$eventsArgs<ExtArgs>;
    user?: boolean | Prisma.Match$userArgs<ExtArgs>;
    matchResult?: boolean | Prisma.Match$matchResultArgs<ExtArgs>;
    venue?: boolean | Prisma.Match$venueArgs<ExtArgs>;
    season?: boolean | Prisma.Match$seasonArgs<ExtArgs>;
    _count?: boolean | Prisma.MatchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $MatchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Match";
    objects: {
        phase: Prisma.$PhasePayload<ExtArgs>;
        group: Prisma.$GroupPayload<ExtArgs> | null;
        home_team: Prisma.$TeamPayload<ExtArgs>;
        away_team: Prisma.$TeamPayload<ExtArgs>;
        next_match: Prisma.$MatchPayload<ExtArgs> | null;
        prev_matches: Prisma.$MatchPayload<ExtArgs>[];
        events: Prisma.$MatchEventPayload<ExtArgs>[];
        user: Prisma.$UserPayload<ExtArgs> | null;
        matchResult: Prisma.$MatchResultPayload<ExtArgs> | null;
        venue: Prisma.$VenuePayload<ExtArgs> | null;
        season: Prisma.$SeasonPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        phase_id: number;
        group_id: number | null;
        home_team_id: number;
        away_team_id: number;
        scheduled_at: Date | null;
        played_at: Date | null;
        home_score: number | null;
        away_score: number | null;
        status: $Enums.MatchStatus;
        round: string | null;
        leg: number | null;
        next_match_id: number | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        user_id: number | null;
        venue_id: number | null;
        is_published: boolean;
        referee: string | null;
        season_id: number | null;
    }, ExtArgs["result"]["match"]>;
    composites: {};
};
export type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MatchPayload, S>;
export type MatchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MatchCountAggregateInputType | true;
};
export interface MatchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Match'];
        meta: {
            name: 'Match';
        };
    };
    /**
     * Find zero or one Match that matches the filter.
     * @param {MatchFindUniqueArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchFindUniqueArgs>(args: Prisma.SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Match that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchFindUniqueOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Match that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchFindFirstArgs>(args?: Prisma.SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Match that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Matches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matches
     * const matches = await prisma.match.findMany()
     *
     * // Get first 10 Matches
     * const matches = await prisma.match.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const matchWithIdOnly = await prisma.match.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MatchFindManyArgs>(args?: Prisma.SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Match.
     * @param {MatchCreateArgs} args - Arguments to create a Match.
     * @example
     * // Create one Match
     * const Match = await prisma.match.create({
     *   data: {
     *     // ... data to create a Match
     *   }
     * })
     *
     */
    create<T extends MatchCreateArgs>(args: Prisma.SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Matches.
     * @param {MatchCreateManyArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MatchCreateManyArgs>(args?: Prisma.SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Match.
     * @param {MatchDeleteArgs} args - Arguments to delete one Match.
     * @example
     * // Delete one Match
     * const Match = await prisma.match.delete({
     *   where: {
     *     // ... filter to delete one Match
     *   }
     * })
     *
     */
    delete<T extends MatchDeleteArgs>(args: Prisma.SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Match.
     * @param {MatchUpdateArgs} args - Arguments to update one Match.
     * @example
     * // Update one Match
     * const match = await prisma.match.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MatchUpdateArgs>(args: Prisma.SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Matches.
     * @param {MatchDeleteManyArgs} args - Arguments to filter Matches to delete.
     * @example
     * // Delete a few Matches
     * const { count } = await prisma.match.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MatchDeleteManyArgs>(args?: Prisma.SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MatchUpdateManyArgs>(args: Prisma.SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Match.
     * @param {MatchUpsertArgs} args - Arguments to update or create a Match.
     * @example
     * // Update or create a Match
     * const match = await prisma.match.upsert({
     *   create: {
     *     // ... data to create a Match
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Match we want to update
     *   }
     * })
     */
    upsert<T extends MatchUpsertArgs>(args: Prisma.SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCountArgs} args - Arguments to filter Matches to count.
     * @example
     * // Count the number of Matches
     * const count = await prisma.match.count({
     *   where: {
     *     // ... the filter for the Matches we want to count
     *   }
     * })
    **/
    count<T extends MatchCountArgs>(args?: Prisma.Subset<T, MatchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MatchCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MatchAggregateArgs>(args: Prisma.Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>;
    /**
     * Group by Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MatchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MatchGroupByArgs['orderBy'];
    } : {
        orderBy?: MatchGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Match model
     */
    readonly fields: MatchFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Match.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MatchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    phase<T extends Prisma.PhaseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PhaseDefaultArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    group<T extends Prisma.Match$groupArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$groupArgs<ExtArgs>>): Prisma.Prisma__GroupClient<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    home_team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    away_team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    next_match<T extends Prisma.Match$next_matchArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$next_matchArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    prev_matches<T extends Prisma.Match$prev_matchesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$prev_matchesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    events<T extends Prisma.Match$eventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    user<T extends Prisma.Match$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    matchResult<T extends Prisma.Match$matchResultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$matchResultArgs<ExtArgs>>): Prisma.Prisma__MatchResultClient<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    venue<T extends Prisma.Match$venueArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$venueArgs<ExtArgs>>): Prisma.Prisma__VenueClient<runtime.Types.Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    season<T extends Prisma.Match$seasonArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$seasonArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the Match model
 */
export interface MatchFieldRefs {
    readonly id: Prisma.FieldRef<"Match", 'Int'>;
    readonly phase_id: Prisma.FieldRef<"Match", 'Int'>;
    readonly group_id: Prisma.FieldRef<"Match", 'Int'>;
    readonly home_team_id: Prisma.FieldRef<"Match", 'Int'>;
    readonly away_team_id: Prisma.FieldRef<"Match", 'Int'>;
    readonly scheduled_at: Prisma.FieldRef<"Match", 'DateTime'>;
    readonly played_at: Prisma.FieldRef<"Match", 'DateTime'>;
    readonly home_score: Prisma.FieldRef<"Match", 'Int'>;
    readonly away_score: Prisma.FieldRef<"Match", 'Int'>;
    readonly status: Prisma.FieldRef<"Match", 'MatchStatus'>;
    readonly round: Prisma.FieldRef<"Match", 'String'>;
    readonly leg: Prisma.FieldRef<"Match", 'Int'>;
    readonly next_match_id: Prisma.FieldRef<"Match", 'Int'>;
    readonly is_active: Prisma.FieldRef<"Match", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Match", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Match", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"Match", 'DateTime'>;
    readonly user_id: Prisma.FieldRef<"Match", 'Int'>;
    readonly venue_id: Prisma.FieldRef<"Match", 'Int'>;
    readonly is_published: Prisma.FieldRef<"Match", 'Boolean'>;
    readonly referee: Prisma.FieldRef<"Match", 'String'>;
    readonly season_id: Prisma.FieldRef<"Match", 'Int'>;
}
/**
 * Match findUnique
 */
export type MatchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    /**
     * Filter, which Match to fetch.
     */
    where: Prisma.MatchWhereUniqueInput;
};
/**
 * Match findUniqueOrThrow
 */
export type MatchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    /**
     * Filter, which Match to fetch.
     */
    where: Prisma.MatchWhereUniqueInput;
};
/**
 * Match findFirst
 */
export type MatchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    /**
     * Filter, which Match to fetch.
     */
    where?: Prisma.MatchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Matches to fetch.
     */
    orderBy?: Prisma.MatchOrderByWithRelationInput | Prisma.MatchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Matches.
     */
    cursor?: Prisma.MatchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Matches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Matches.
     */
    distinct?: Prisma.MatchScalarFieldEnum | Prisma.MatchScalarFieldEnum[];
};
/**
 * Match findFirstOrThrow
 */
export type MatchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    /**
     * Filter, which Match to fetch.
     */
    where?: Prisma.MatchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Matches to fetch.
     */
    orderBy?: Prisma.MatchOrderByWithRelationInput | Prisma.MatchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Matches.
     */
    cursor?: Prisma.MatchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Matches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Matches.
     */
    distinct?: Prisma.MatchScalarFieldEnum | Prisma.MatchScalarFieldEnum[];
};
/**
 * Match findMany
 */
export type MatchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    /**
     * Filter, which Matches to fetch.
     */
    where?: Prisma.MatchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Matches to fetch.
     */
    orderBy?: Prisma.MatchOrderByWithRelationInput | Prisma.MatchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Matches.
     */
    cursor?: Prisma.MatchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Matches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Matches.
     */
    distinct?: Prisma.MatchScalarFieldEnum | Prisma.MatchScalarFieldEnum[];
};
/**
 * Match create
 */
export type MatchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    /**
     * The data needed to create a Match.
     */
    data: Prisma.XOR<Prisma.MatchCreateInput, Prisma.MatchUncheckedCreateInput>;
};
/**
 * Match createMany
 */
export type MatchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matches.
     */
    data: Prisma.MatchCreateManyInput | Prisma.MatchCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Match update
 */
export type MatchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    /**
     * The data needed to update a Match.
     */
    data: Prisma.XOR<Prisma.MatchUpdateInput, Prisma.MatchUncheckedUpdateInput>;
    /**
     * Choose, which Match to update.
     */
    where: Prisma.MatchWhereUniqueInput;
};
/**
 * Match updateMany
 */
export type MatchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Matches.
     */
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyInput>;
    /**
     * Filter which Matches to update
     */
    where?: Prisma.MatchWhereInput;
    /**
     * Limit how many Matches to update.
     */
    limit?: number;
};
/**
 * Match upsert
 */
export type MatchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    /**
     * The filter to search for the Match to update in case it exists.
     */
    where: Prisma.MatchWhereUniqueInput;
    /**
     * In case the Match found by the `where` argument doesn't exist, create a new Match with this data.
     */
    create: Prisma.XOR<Prisma.MatchCreateInput, Prisma.MatchUncheckedCreateInput>;
    /**
     * In case the Match was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MatchUpdateInput, Prisma.MatchUncheckedUpdateInput>;
};
/**
 * Match delete
 */
export type MatchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    /**
     * Filter which Match to delete.
     */
    where: Prisma.MatchWhereUniqueInput;
};
/**
 * Match deleteMany
 */
export type MatchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Matches to delete
     */
    where?: Prisma.MatchWhereInput;
    /**
     * Limit how many Matches to delete.
     */
    limit?: number;
};
/**
 * Match.group
 */
export type Match$groupArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Match.next_match
 */
export type Match$next_matchArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    where?: Prisma.MatchWhereInput;
};
/**
 * Match.prev_matches
 */
export type Match$prev_matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
    where?: Prisma.MatchWhereInput;
    orderBy?: Prisma.MatchOrderByWithRelationInput | Prisma.MatchOrderByWithRelationInput[];
    cursor?: Prisma.MatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MatchScalarFieldEnum | Prisma.MatchScalarFieldEnum[];
};
/**
 * Match.events
 */
export type Match$eventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Match.user
 */
export type Match$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Match.matchResult
 */
export type Match$matchResultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchResult
     */
    select?: Prisma.MatchResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MatchResult
     */
    omit?: Prisma.MatchResultOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchResultInclude<ExtArgs> | null;
    where?: Prisma.MatchResultWhereInput;
};
/**
 * Match.venue
 */
export type Match$venueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: Prisma.VenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Venue
     */
    omit?: Prisma.VenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.VenueInclude<ExtArgs> | null;
    where?: Prisma.VenueWhereInput;
};
/**
 * Match.season
 */
export type Match$seasonArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Season
     */
    select?: Prisma.SeasonSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Season
     */
    omit?: Prisma.SeasonOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonInclude<ExtArgs> | null;
    where?: Prisma.SeasonWhereInput;
};
/**
 * Match without action
 */
export type MatchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: Prisma.MatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Match
     */
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MatchInclude<ExtArgs> | null;
};
//# sourceMappingURL=Match.d.ts.map