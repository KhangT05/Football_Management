import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MatchResult
 *
 */
export type MatchResultModel = runtime.Types.Result.DefaultSelection<Prisma.$MatchResultPayload>;
export type AggregateMatchResult = {
    _count: MatchResultCountAggregateOutputType | null;
    _avg: MatchResultAvgAggregateOutputType | null;
    _sum: MatchResultSumAggregateOutputType | null;
    _min: MatchResultMinAggregateOutputType | null;
    _max: MatchResultMaxAggregateOutputType | null;
};
export type MatchResultAvgAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    winner_team_id: number | null;
    home_score: number | null;
    away_score: number | null;
    home_half_time_score: number | null;
    away_half_time_score: number | null;
    home_extra_time_score: number | null;
    away_extra_time_score: number | null;
    home_penalty_score: number | null;
    away_penalty_score: number | null;
    home_final_score: number | null;
    away_final_score: number | null;
    duration: number | null;
};
export type MatchResultSumAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    winner_team_id: number | null;
    home_score: number | null;
    away_score: number | null;
    home_half_time_score: number | null;
    away_half_time_score: number | null;
    home_extra_time_score: number | null;
    away_extra_time_score: number | null;
    home_penalty_score: number | null;
    away_penalty_score: number | null;
    home_final_score: number | null;
    away_final_score: number | null;
    duration: number | null;
};
export type MatchResultMinAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    winner_team_id: number | null;
    home_score: number | null;
    away_score: number | null;
    home_half_time_score: number | null;
    away_half_time_score: number | null;
    home_extra_time_score: number | null;
    away_extra_time_score: number | null;
    home_penalty_score: number | null;
    away_penalty_score: number | null;
    home_final_score: number | null;
    away_final_score: number | null;
    result_type: $Enums.MatchResultType | null;
    status: $Enums.MatchResultStatus | null;
    duration: number | null;
    notes: string | null;
    appeal_reason: string | null;
    appeal_note: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
};
export type MatchResultMaxAggregateOutputType = {
    id: number | null;
    match_id: number | null;
    winner_team_id: number | null;
    home_score: number | null;
    away_score: number | null;
    home_half_time_score: number | null;
    away_half_time_score: number | null;
    home_extra_time_score: number | null;
    away_extra_time_score: number | null;
    home_penalty_score: number | null;
    away_penalty_score: number | null;
    home_final_score: number | null;
    away_final_score: number | null;
    result_type: $Enums.MatchResultType | null;
    status: $Enums.MatchResultStatus | null;
    duration: number | null;
    notes: string | null;
    appeal_reason: string | null;
    appeal_note: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
};
export type MatchResultCountAggregateOutputType = {
    id: number;
    match_id: number;
    winner_team_id: number;
    home_score: number;
    away_score: number;
    home_half_time_score: number;
    away_half_time_score: number;
    home_extra_time_score: number;
    away_extra_time_score: number;
    home_penalty_score: number;
    away_penalty_score: number;
    home_final_score: number;
    away_final_score: number;
    result_type: number;
    status: number;
    duration: number;
    notes: number;
    appeal_reason: number;
    appeal_note: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    _all: number;
};
export type MatchResultAvgAggregateInputType = {
    id?: true;
    match_id?: true;
    winner_team_id?: true;
    home_score?: true;
    away_score?: true;
    home_half_time_score?: true;
    away_half_time_score?: true;
    home_extra_time_score?: true;
    away_extra_time_score?: true;
    home_penalty_score?: true;
    away_penalty_score?: true;
    home_final_score?: true;
    away_final_score?: true;
    duration?: true;
};
export type MatchResultSumAggregateInputType = {
    id?: true;
    match_id?: true;
    winner_team_id?: true;
    home_score?: true;
    away_score?: true;
    home_half_time_score?: true;
    away_half_time_score?: true;
    home_extra_time_score?: true;
    away_extra_time_score?: true;
    home_penalty_score?: true;
    away_penalty_score?: true;
    home_final_score?: true;
    away_final_score?: true;
    duration?: true;
};
export type MatchResultMinAggregateInputType = {
    id?: true;
    match_id?: true;
    winner_team_id?: true;
    home_score?: true;
    away_score?: true;
    home_half_time_score?: true;
    away_half_time_score?: true;
    home_extra_time_score?: true;
    away_extra_time_score?: true;
    home_penalty_score?: true;
    away_penalty_score?: true;
    home_final_score?: true;
    away_final_score?: true;
    result_type?: true;
    status?: true;
    duration?: true;
    notes?: true;
    appeal_reason?: true;
    appeal_note?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
};
export type MatchResultMaxAggregateInputType = {
    id?: true;
    match_id?: true;
    winner_team_id?: true;
    home_score?: true;
    away_score?: true;
    home_half_time_score?: true;
    away_half_time_score?: true;
    home_extra_time_score?: true;
    away_extra_time_score?: true;
    home_penalty_score?: true;
    away_penalty_score?: true;
    home_final_score?: true;
    away_final_score?: true;
    result_type?: true;
    status?: true;
    duration?: true;
    notes?: true;
    appeal_reason?: true;
    appeal_note?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
};
export type MatchResultCountAggregateInputType = {
    id?: true;
    match_id?: true;
    winner_team_id?: true;
    home_score?: true;
    away_score?: true;
    home_half_time_score?: true;
    away_half_time_score?: true;
    home_extra_time_score?: true;
    away_extra_time_score?: true;
    home_penalty_score?: true;
    away_penalty_score?: true;
    home_final_score?: true;
    away_final_score?: true;
    result_type?: true;
    status?: true;
    duration?: true;
    notes?: true;
    appeal_reason?: true;
    appeal_note?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    _all?: true;
};
export type MatchResultAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MatchResult to aggregate.
     */
    where?: Prisma.MatchResultWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchResults to fetch.
     */
    orderBy?: Prisma.MatchResultOrderByWithRelationInput | Prisma.MatchResultOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MatchResultWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchResults from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchResults.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MatchResults
    **/
    _count?: true | MatchResultCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MatchResultAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MatchResultSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MatchResultMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MatchResultMaxAggregateInputType;
};
export type GetMatchResultAggregateType<T extends MatchResultAggregateArgs> = {
    [P in keyof T & keyof AggregateMatchResult]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMatchResult[P]> : Prisma.GetScalarType<T[P], AggregateMatchResult[P]>;
};
export type MatchResultGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchResultWhereInput;
    orderBy?: Prisma.MatchResultOrderByWithAggregationInput | Prisma.MatchResultOrderByWithAggregationInput[];
    by: Prisma.MatchResultScalarFieldEnum[] | Prisma.MatchResultScalarFieldEnum;
    having?: Prisma.MatchResultScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MatchResultCountAggregateInputType | true;
    _avg?: MatchResultAvgAggregateInputType;
    _sum?: MatchResultSumAggregateInputType;
    _min?: MatchResultMinAggregateInputType;
    _max?: MatchResultMaxAggregateInputType;
};
export type MatchResultGroupByOutputType = {
    id: number;
    match_id: number;
    winner_team_id: number | null;
    home_score: number;
    away_score: number;
    home_half_time_score: number;
    away_half_time_score: number;
    home_extra_time_score: number | null;
    away_extra_time_score: number | null;
    home_penalty_score: number | null;
    away_penalty_score: number | null;
    home_final_score: number;
    away_final_score: number;
    result_type: $Enums.MatchResultType;
    status: $Enums.MatchResultStatus;
    duration: number | null;
    notes: string | null;
    appeal_reason: string | null;
    appeal_note: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    _count: MatchResultCountAggregateOutputType | null;
    _avg: MatchResultAvgAggregateOutputType | null;
    _sum: MatchResultSumAggregateOutputType | null;
    _min: MatchResultMinAggregateOutputType | null;
    _max: MatchResultMaxAggregateOutputType | null;
};
export type GetMatchResultGroupByPayload<T extends MatchResultGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MatchResultGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MatchResultGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MatchResultGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MatchResultGroupByOutputType[P]>;
}>>;
export type MatchResultWhereInput = {
    AND?: Prisma.MatchResultWhereInput | Prisma.MatchResultWhereInput[];
    OR?: Prisma.MatchResultWhereInput[];
    NOT?: Prisma.MatchResultWhereInput | Prisma.MatchResultWhereInput[];
    id?: Prisma.IntFilter<"MatchResult"> | number;
    match_id?: Prisma.IntFilter<"MatchResult"> | number;
    winner_team_id?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    home_score?: Prisma.IntFilter<"MatchResult"> | number;
    away_score?: Prisma.IntFilter<"MatchResult"> | number;
    home_half_time_score?: Prisma.IntFilter<"MatchResult"> | number;
    away_half_time_score?: Prisma.IntFilter<"MatchResult"> | number;
    home_extra_time_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    away_extra_time_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    home_penalty_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    away_penalty_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    home_final_score?: Prisma.IntFilter<"MatchResult"> | number;
    away_final_score?: Prisma.IntFilter<"MatchResult"> | number;
    result_type?: Prisma.EnumMatchResultTypeFilter<"MatchResult"> | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFilter<"MatchResult"> | $Enums.MatchResultStatus;
    duration?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    notes?: Prisma.StringNullableFilter<"MatchResult"> | string | null;
    appeal_reason?: Prisma.StringNullableFilter<"MatchResult"> | string | null;
    appeal_note?: Prisma.StringNullableFilter<"MatchResult"> | string | null;
    is_active?: Prisma.BoolFilter<"MatchResult"> | boolean;
    created_at?: Prisma.DateTimeFilter<"MatchResult"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"MatchResult"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"MatchResult"> | Date | string | null;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    winner_team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
};
export type MatchResultOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    winner_team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    home_half_time_score?: Prisma.SortOrder;
    away_half_time_score?: Prisma.SortOrder;
    home_extra_time_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    away_extra_time_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_penalty_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    away_penalty_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_final_score?: Prisma.SortOrder;
    away_final_score?: Prisma.SortOrder;
    result_type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    duration?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    appeal_reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    appeal_note?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    match?: Prisma.MatchOrderByWithRelationInput;
    winner_team?: Prisma.TeamOrderByWithRelationInput;
    _relevance?: Prisma.MatchResultOrderByRelevanceInput;
};
export type MatchResultWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    match_id?: number;
    AND?: Prisma.MatchResultWhereInput | Prisma.MatchResultWhereInput[];
    OR?: Prisma.MatchResultWhereInput[];
    NOT?: Prisma.MatchResultWhereInput | Prisma.MatchResultWhereInput[];
    winner_team_id?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    home_score?: Prisma.IntFilter<"MatchResult"> | number;
    away_score?: Prisma.IntFilter<"MatchResult"> | number;
    home_half_time_score?: Prisma.IntFilter<"MatchResult"> | number;
    away_half_time_score?: Prisma.IntFilter<"MatchResult"> | number;
    home_extra_time_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    away_extra_time_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    home_penalty_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    away_penalty_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    home_final_score?: Prisma.IntFilter<"MatchResult"> | number;
    away_final_score?: Prisma.IntFilter<"MatchResult"> | number;
    result_type?: Prisma.EnumMatchResultTypeFilter<"MatchResult"> | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFilter<"MatchResult"> | $Enums.MatchResultStatus;
    duration?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    notes?: Prisma.StringNullableFilter<"MatchResult"> | string | null;
    appeal_reason?: Prisma.StringNullableFilter<"MatchResult"> | string | null;
    appeal_note?: Prisma.StringNullableFilter<"MatchResult"> | string | null;
    is_active?: Prisma.BoolFilter<"MatchResult"> | boolean;
    created_at?: Prisma.DateTimeFilter<"MatchResult"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"MatchResult"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"MatchResult"> | Date | string | null;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    winner_team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
}, "id" | "match_id">;
export type MatchResultOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    winner_team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    home_half_time_score?: Prisma.SortOrder;
    away_half_time_score?: Prisma.SortOrder;
    home_extra_time_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    away_extra_time_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_penalty_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    away_penalty_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    home_final_score?: Prisma.SortOrder;
    away_final_score?: Prisma.SortOrder;
    result_type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    duration?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    appeal_reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    appeal_note?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.MatchResultCountOrderByAggregateInput;
    _avg?: Prisma.MatchResultAvgOrderByAggregateInput;
    _max?: Prisma.MatchResultMaxOrderByAggregateInput;
    _min?: Prisma.MatchResultMinOrderByAggregateInput;
    _sum?: Prisma.MatchResultSumOrderByAggregateInput;
};
export type MatchResultScalarWhereWithAggregatesInput = {
    AND?: Prisma.MatchResultScalarWhereWithAggregatesInput | Prisma.MatchResultScalarWhereWithAggregatesInput[];
    OR?: Prisma.MatchResultScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MatchResultScalarWhereWithAggregatesInput | Prisma.MatchResultScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"MatchResult"> | number;
    match_id?: Prisma.IntWithAggregatesFilter<"MatchResult"> | number;
    winner_team_id?: Prisma.IntNullableWithAggregatesFilter<"MatchResult"> | number | null;
    home_score?: Prisma.IntWithAggregatesFilter<"MatchResult"> | number;
    away_score?: Prisma.IntWithAggregatesFilter<"MatchResult"> | number;
    home_half_time_score?: Prisma.IntWithAggregatesFilter<"MatchResult"> | number;
    away_half_time_score?: Prisma.IntWithAggregatesFilter<"MatchResult"> | number;
    home_extra_time_score?: Prisma.IntNullableWithAggregatesFilter<"MatchResult"> | number | null;
    away_extra_time_score?: Prisma.IntNullableWithAggregatesFilter<"MatchResult"> | number | null;
    home_penalty_score?: Prisma.IntNullableWithAggregatesFilter<"MatchResult"> | number | null;
    away_penalty_score?: Prisma.IntNullableWithAggregatesFilter<"MatchResult"> | number | null;
    home_final_score?: Prisma.IntWithAggregatesFilter<"MatchResult"> | number;
    away_final_score?: Prisma.IntWithAggregatesFilter<"MatchResult"> | number;
    result_type?: Prisma.EnumMatchResultTypeWithAggregatesFilter<"MatchResult"> | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusWithAggregatesFilter<"MatchResult"> | $Enums.MatchResultStatus;
    duration?: Prisma.IntNullableWithAggregatesFilter<"MatchResult"> | number | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"MatchResult"> | string | null;
    appeal_reason?: Prisma.StringNullableWithAggregatesFilter<"MatchResult"> | string | null;
    appeal_note?: Prisma.StringNullableWithAggregatesFilter<"MatchResult"> | string | null;
    is_active?: Prisma.BoolWithAggregatesFilter<"MatchResult"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"MatchResult"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"MatchResult"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"MatchResult"> | Date | string | null;
};
export type MatchResultCreateInput = {
    home_score?: number;
    away_score?: number;
    home_half_time_score?: number;
    away_half_time_score?: number;
    home_extra_time_score?: number | null;
    away_extra_time_score?: number | null;
    home_penalty_score?: number | null;
    away_penalty_score?: number | null;
    home_final_score?: number;
    away_final_score?: number;
    result_type: $Enums.MatchResultType;
    status?: $Enums.MatchResultStatus;
    duration?: number | null;
    notes?: string | null;
    appeal_reason?: string | null;
    appeal_note?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    match: Prisma.MatchCreateNestedOneWithoutMatchResultInput;
    winner_team?: Prisma.TeamCreateNestedOneWithoutMatchResultsInput;
};
export type MatchResultUncheckedCreateInput = {
    id?: number;
    match_id: number;
    winner_team_id?: number | null;
    home_score?: number;
    away_score?: number;
    home_half_time_score?: number;
    away_half_time_score?: number;
    home_extra_time_score?: number | null;
    away_extra_time_score?: number | null;
    home_penalty_score?: number | null;
    away_penalty_score?: number | null;
    home_final_score?: number;
    away_final_score?: number;
    result_type: $Enums.MatchResultType;
    status?: $Enums.MatchResultStatus;
    duration?: number | null;
    notes?: string | null;
    appeal_reason?: string | null;
    appeal_note?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type MatchResultUpdateInput = {
    home_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    result_type?: Prisma.EnumMatchResultTypeFieldUpdateOperationsInput | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFieldUpdateOperationsInput | $Enums.MatchResultStatus;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    match?: Prisma.MatchUpdateOneRequiredWithoutMatchResultNestedInput;
    winner_team?: Prisma.TeamUpdateOneWithoutMatchResultsNestedInput;
};
export type MatchResultUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    winner_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    result_type?: Prisma.EnumMatchResultTypeFieldUpdateOperationsInput | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFieldUpdateOperationsInput | $Enums.MatchResultStatus;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MatchResultCreateManyInput = {
    id?: number;
    match_id: number;
    winner_team_id?: number | null;
    home_score?: number;
    away_score?: number;
    home_half_time_score?: number;
    away_half_time_score?: number;
    home_extra_time_score?: number | null;
    away_extra_time_score?: number | null;
    home_penalty_score?: number | null;
    away_penalty_score?: number | null;
    home_final_score?: number;
    away_final_score?: number;
    result_type: $Enums.MatchResultType;
    status?: $Enums.MatchResultStatus;
    duration?: number | null;
    notes?: string | null;
    appeal_reason?: string | null;
    appeal_note?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type MatchResultUpdateManyMutationInput = {
    home_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    result_type?: Prisma.EnumMatchResultTypeFieldUpdateOperationsInput | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFieldUpdateOperationsInput | $Enums.MatchResultStatus;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MatchResultUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    winner_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    result_type?: Prisma.EnumMatchResultTypeFieldUpdateOperationsInput | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFieldUpdateOperationsInput | $Enums.MatchResultStatus;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MatchResultListRelationFilter = {
    every?: Prisma.MatchResultWhereInput;
    some?: Prisma.MatchResultWhereInput;
    none?: Prisma.MatchResultWhereInput;
};
export type MatchResultOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MatchResultNullableScalarRelationFilter = {
    is?: Prisma.MatchResultWhereInput | null;
    isNot?: Prisma.MatchResultWhereInput | null;
};
export type MatchResultOrderByRelevanceInput = {
    fields: Prisma.MatchResultOrderByRelevanceFieldEnum | Prisma.MatchResultOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type MatchResultCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    winner_team_id?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    home_half_time_score?: Prisma.SortOrder;
    away_half_time_score?: Prisma.SortOrder;
    home_extra_time_score?: Prisma.SortOrder;
    away_extra_time_score?: Prisma.SortOrder;
    home_penalty_score?: Prisma.SortOrder;
    away_penalty_score?: Prisma.SortOrder;
    home_final_score?: Prisma.SortOrder;
    away_final_score?: Prisma.SortOrder;
    result_type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    appeal_reason?: Prisma.SortOrder;
    appeal_note?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type MatchResultAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    winner_team_id?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    home_half_time_score?: Prisma.SortOrder;
    away_half_time_score?: Prisma.SortOrder;
    home_extra_time_score?: Prisma.SortOrder;
    away_extra_time_score?: Prisma.SortOrder;
    home_penalty_score?: Prisma.SortOrder;
    away_penalty_score?: Prisma.SortOrder;
    home_final_score?: Prisma.SortOrder;
    away_final_score?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
};
export type MatchResultMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    winner_team_id?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    home_half_time_score?: Prisma.SortOrder;
    away_half_time_score?: Prisma.SortOrder;
    home_extra_time_score?: Prisma.SortOrder;
    away_extra_time_score?: Prisma.SortOrder;
    home_penalty_score?: Prisma.SortOrder;
    away_penalty_score?: Prisma.SortOrder;
    home_final_score?: Prisma.SortOrder;
    away_final_score?: Prisma.SortOrder;
    result_type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    appeal_reason?: Prisma.SortOrder;
    appeal_note?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type MatchResultMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    winner_team_id?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    home_half_time_score?: Prisma.SortOrder;
    away_half_time_score?: Prisma.SortOrder;
    home_extra_time_score?: Prisma.SortOrder;
    away_extra_time_score?: Prisma.SortOrder;
    home_penalty_score?: Prisma.SortOrder;
    away_penalty_score?: Prisma.SortOrder;
    home_final_score?: Prisma.SortOrder;
    away_final_score?: Prisma.SortOrder;
    result_type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    appeal_reason?: Prisma.SortOrder;
    appeal_note?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type MatchResultSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    winner_team_id?: Prisma.SortOrder;
    home_score?: Prisma.SortOrder;
    away_score?: Prisma.SortOrder;
    home_half_time_score?: Prisma.SortOrder;
    away_half_time_score?: Prisma.SortOrder;
    home_extra_time_score?: Prisma.SortOrder;
    away_extra_time_score?: Prisma.SortOrder;
    home_penalty_score?: Prisma.SortOrder;
    away_penalty_score?: Prisma.SortOrder;
    home_final_score?: Prisma.SortOrder;
    away_final_score?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
};
export type MatchResultCreateNestedManyWithoutWinner_teamInput = {
    create?: Prisma.XOR<Prisma.MatchResultCreateWithoutWinner_teamInput, Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput> | Prisma.MatchResultCreateWithoutWinner_teamInput[] | Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput[];
    connectOrCreate?: Prisma.MatchResultCreateOrConnectWithoutWinner_teamInput | Prisma.MatchResultCreateOrConnectWithoutWinner_teamInput[];
    createMany?: Prisma.MatchResultCreateManyWinner_teamInputEnvelope;
    connect?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
};
export type MatchResultUncheckedCreateNestedManyWithoutWinner_teamInput = {
    create?: Prisma.XOR<Prisma.MatchResultCreateWithoutWinner_teamInput, Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput> | Prisma.MatchResultCreateWithoutWinner_teamInput[] | Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput[];
    connectOrCreate?: Prisma.MatchResultCreateOrConnectWithoutWinner_teamInput | Prisma.MatchResultCreateOrConnectWithoutWinner_teamInput[];
    createMany?: Prisma.MatchResultCreateManyWinner_teamInputEnvelope;
    connect?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
};
export type MatchResultUpdateManyWithoutWinner_teamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchResultCreateWithoutWinner_teamInput, Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput> | Prisma.MatchResultCreateWithoutWinner_teamInput[] | Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput[];
    connectOrCreate?: Prisma.MatchResultCreateOrConnectWithoutWinner_teamInput | Prisma.MatchResultCreateOrConnectWithoutWinner_teamInput[];
    upsert?: Prisma.MatchResultUpsertWithWhereUniqueWithoutWinner_teamInput | Prisma.MatchResultUpsertWithWhereUniqueWithoutWinner_teamInput[];
    createMany?: Prisma.MatchResultCreateManyWinner_teamInputEnvelope;
    set?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
    disconnect?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
    delete?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
    connect?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
    update?: Prisma.MatchResultUpdateWithWhereUniqueWithoutWinner_teamInput | Prisma.MatchResultUpdateWithWhereUniqueWithoutWinner_teamInput[];
    updateMany?: Prisma.MatchResultUpdateManyWithWhereWithoutWinner_teamInput | Prisma.MatchResultUpdateManyWithWhereWithoutWinner_teamInput[];
    deleteMany?: Prisma.MatchResultScalarWhereInput | Prisma.MatchResultScalarWhereInput[];
};
export type MatchResultUncheckedUpdateManyWithoutWinner_teamNestedInput = {
    create?: Prisma.XOR<Prisma.MatchResultCreateWithoutWinner_teamInput, Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput> | Prisma.MatchResultCreateWithoutWinner_teamInput[] | Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput[];
    connectOrCreate?: Prisma.MatchResultCreateOrConnectWithoutWinner_teamInput | Prisma.MatchResultCreateOrConnectWithoutWinner_teamInput[];
    upsert?: Prisma.MatchResultUpsertWithWhereUniqueWithoutWinner_teamInput | Prisma.MatchResultUpsertWithWhereUniqueWithoutWinner_teamInput[];
    createMany?: Prisma.MatchResultCreateManyWinner_teamInputEnvelope;
    set?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
    disconnect?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
    delete?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
    connect?: Prisma.MatchResultWhereUniqueInput | Prisma.MatchResultWhereUniqueInput[];
    update?: Prisma.MatchResultUpdateWithWhereUniqueWithoutWinner_teamInput | Prisma.MatchResultUpdateWithWhereUniqueWithoutWinner_teamInput[];
    updateMany?: Prisma.MatchResultUpdateManyWithWhereWithoutWinner_teamInput | Prisma.MatchResultUpdateManyWithWhereWithoutWinner_teamInput[];
    deleteMany?: Prisma.MatchResultScalarWhereInput | Prisma.MatchResultScalarWhereInput[];
};
export type MatchResultCreateNestedOneWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.MatchResultCreateWithoutMatchInput, Prisma.MatchResultUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.MatchResultCreateOrConnectWithoutMatchInput;
    connect?: Prisma.MatchResultWhereUniqueInput;
};
export type MatchResultUncheckedCreateNestedOneWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.MatchResultCreateWithoutMatchInput, Prisma.MatchResultUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.MatchResultCreateOrConnectWithoutMatchInput;
    connect?: Prisma.MatchResultWhereUniqueInput;
};
export type MatchResultUpdateOneWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchResultCreateWithoutMatchInput, Prisma.MatchResultUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.MatchResultCreateOrConnectWithoutMatchInput;
    upsert?: Prisma.MatchResultUpsertWithoutMatchInput;
    disconnect?: Prisma.MatchResultWhereInput | boolean;
    delete?: Prisma.MatchResultWhereInput | boolean;
    connect?: Prisma.MatchResultWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MatchResultUpdateToOneWithWhereWithoutMatchInput, Prisma.MatchResultUpdateWithoutMatchInput>, Prisma.MatchResultUncheckedUpdateWithoutMatchInput>;
};
export type MatchResultUncheckedUpdateOneWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.MatchResultCreateWithoutMatchInput, Prisma.MatchResultUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.MatchResultCreateOrConnectWithoutMatchInput;
    upsert?: Prisma.MatchResultUpsertWithoutMatchInput;
    disconnect?: Prisma.MatchResultWhereInput | boolean;
    delete?: Prisma.MatchResultWhereInput | boolean;
    connect?: Prisma.MatchResultWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MatchResultUpdateToOneWithWhereWithoutMatchInput, Prisma.MatchResultUpdateWithoutMatchInput>, Prisma.MatchResultUncheckedUpdateWithoutMatchInput>;
};
export type EnumMatchResultTypeFieldUpdateOperationsInput = {
    set?: $Enums.MatchResultType;
};
export type EnumMatchResultStatusFieldUpdateOperationsInput = {
    set?: $Enums.MatchResultStatus;
};
export type MatchResultCreateWithoutWinner_teamInput = {
    home_score?: number;
    away_score?: number;
    home_half_time_score?: number;
    away_half_time_score?: number;
    home_extra_time_score?: number | null;
    away_extra_time_score?: number | null;
    home_penalty_score?: number | null;
    away_penalty_score?: number | null;
    home_final_score?: number;
    away_final_score?: number;
    result_type: $Enums.MatchResultType;
    status?: $Enums.MatchResultStatus;
    duration?: number | null;
    notes?: string | null;
    appeal_reason?: string | null;
    appeal_note?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    match: Prisma.MatchCreateNestedOneWithoutMatchResultInput;
};
export type MatchResultUncheckedCreateWithoutWinner_teamInput = {
    id?: number;
    match_id: number;
    home_score?: number;
    away_score?: number;
    home_half_time_score?: number;
    away_half_time_score?: number;
    home_extra_time_score?: number | null;
    away_extra_time_score?: number | null;
    home_penalty_score?: number | null;
    away_penalty_score?: number | null;
    home_final_score?: number;
    away_final_score?: number;
    result_type: $Enums.MatchResultType;
    status?: $Enums.MatchResultStatus;
    duration?: number | null;
    notes?: string | null;
    appeal_reason?: string | null;
    appeal_note?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type MatchResultCreateOrConnectWithoutWinner_teamInput = {
    where: Prisma.MatchResultWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchResultCreateWithoutWinner_teamInput, Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput>;
};
export type MatchResultCreateManyWinner_teamInputEnvelope = {
    data: Prisma.MatchResultCreateManyWinner_teamInput | Prisma.MatchResultCreateManyWinner_teamInput[];
    skipDuplicates?: boolean;
};
export type MatchResultUpsertWithWhereUniqueWithoutWinner_teamInput = {
    where: Prisma.MatchResultWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchResultUpdateWithoutWinner_teamInput, Prisma.MatchResultUncheckedUpdateWithoutWinner_teamInput>;
    create: Prisma.XOR<Prisma.MatchResultCreateWithoutWinner_teamInput, Prisma.MatchResultUncheckedCreateWithoutWinner_teamInput>;
};
export type MatchResultUpdateWithWhereUniqueWithoutWinner_teamInput = {
    where: Prisma.MatchResultWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchResultUpdateWithoutWinner_teamInput, Prisma.MatchResultUncheckedUpdateWithoutWinner_teamInput>;
};
export type MatchResultUpdateManyWithWhereWithoutWinner_teamInput = {
    where: Prisma.MatchResultScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchResultUpdateManyMutationInput, Prisma.MatchResultUncheckedUpdateManyWithoutWinner_teamInput>;
};
export type MatchResultScalarWhereInput = {
    AND?: Prisma.MatchResultScalarWhereInput | Prisma.MatchResultScalarWhereInput[];
    OR?: Prisma.MatchResultScalarWhereInput[];
    NOT?: Prisma.MatchResultScalarWhereInput | Prisma.MatchResultScalarWhereInput[];
    id?: Prisma.IntFilter<"MatchResult"> | number;
    match_id?: Prisma.IntFilter<"MatchResult"> | number;
    winner_team_id?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    home_score?: Prisma.IntFilter<"MatchResult"> | number;
    away_score?: Prisma.IntFilter<"MatchResult"> | number;
    home_half_time_score?: Prisma.IntFilter<"MatchResult"> | number;
    away_half_time_score?: Prisma.IntFilter<"MatchResult"> | number;
    home_extra_time_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    away_extra_time_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    home_penalty_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    away_penalty_score?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    home_final_score?: Prisma.IntFilter<"MatchResult"> | number;
    away_final_score?: Prisma.IntFilter<"MatchResult"> | number;
    result_type?: Prisma.EnumMatchResultTypeFilter<"MatchResult"> | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFilter<"MatchResult"> | $Enums.MatchResultStatus;
    duration?: Prisma.IntNullableFilter<"MatchResult"> | number | null;
    notes?: Prisma.StringNullableFilter<"MatchResult"> | string | null;
    appeal_reason?: Prisma.StringNullableFilter<"MatchResult"> | string | null;
    appeal_note?: Prisma.StringNullableFilter<"MatchResult"> | string | null;
    is_active?: Prisma.BoolFilter<"MatchResult"> | boolean;
    created_at?: Prisma.DateTimeFilter<"MatchResult"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"MatchResult"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"MatchResult"> | Date | string | null;
};
export type MatchResultCreateWithoutMatchInput = {
    home_score?: number;
    away_score?: number;
    home_half_time_score?: number;
    away_half_time_score?: number;
    home_extra_time_score?: number | null;
    away_extra_time_score?: number | null;
    home_penalty_score?: number | null;
    away_penalty_score?: number | null;
    home_final_score?: number;
    away_final_score?: number;
    result_type: $Enums.MatchResultType;
    status?: $Enums.MatchResultStatus;
    duration?: number | null;
    notes?: string | null;
    appeal_reason?: string | null;
    appeal_note?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    winner_team?: Prisma.TeamCreateNestedOneWithoutMatchResultsInput;
};
export type MatchResultUncheckedCreateWithoutMatchInput = {
    id?: number;
    winner_team_id?: number | null;
    home_score?: number;
    away_score?: number;
    home_half_time_score?: number;
    away_half_time_score?: number;
    home_extra_time_score?: number | null;
    away_extra_time_score?: number | null;
    home_penalty_score?: number | null;
    away_penalty_score?: number | null;
    home_final_score?: number;
    away_final_score?: number;
    result_type: $Enums.MatchResultType;
    status?: $Enums.MatchResultStatus;
    duration?: number | null;
    notes?: string | null;
    appeal_reason?: string | null;
    appeal_note?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type MatchResultCreateOrConnectWithoutMatchInput = {
    where: Prisma.MatchResultWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchResultCreateWithoutMatchInput, Prisma.MatchResultUncheckedCreateWithoutMatchInput>;
};
export type MatchResultUpsertWithoutMatchInput = {
    update: Prisma.XOR<Prisma.MatchResultUpdateWithoutMatchInput, Prisma.MatchResultUncheckedUpdateWithoutMatchInput>;
    create: Prisma.XOR<Prisma.MatchResultCreateWithoutMatchInput, Prisma.MatchResultUncheckedCreateWithoutMatchInput>;
    where?: Prisma.MatchResultWhereInput;
};
export type MatchResultUpdateToOneWithWhereWithoutMatchInput = {
    where?: Prisma.MatchResultWhereInput;
    data: Prisma.XOR<Prisma.MatchResultUpdateWithoutMatchInput, Prisma.MatchResultUncheckedUpdateWithoutMatchInput>;
};
export type MatchResultUpdateWithoutMatchInput = {
    home_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    result_type?: Prisma.EnumMatchResultTypeFieldUpdateOperationsInput | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFieldUpdateOperationsInput | $Enums.MatchResultStatus;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    winner_team?: Prisma.TeamUpdateOneWithoutMatchResultsNestedInput;
};
export type MatchResultUncheckedUpdateWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    winner_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    result_type?: Prisma.EnumMatchResultTypeFieldUpdateOperationsInput | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFieldUpdateOperationsInput | $Enums.MatchResultStatus;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MatchResultCreateManyWinner_teamInput = {
    id?: number;
    match_id: number;
    home_score?: number;
    away_score?: number;
    home_half_time_score?: number;
    away_half_time_score?: number;
    home_extra_time_score?: number | null;
    away_extra_time_score?: number | null;
    home_penalty_score?: number | null;
    away_penalty_score?: number | null;
    home_final_score?: number;
    away_final_score?: number;
    result_type: $Enums.MatchResultType;
    status?: $Enums.MatchResultStatus;
    duration?: number | null;
    notes?: string | null;
    appeal_reason?: string | null;
    appeal_note?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type MatchResultUpdateWithoutWinner_teamInput = {
    home_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    result_type?: Prisma.EnumMatchResultTypeFieldUpdateOperationsInput | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFieldUpdateOperationsInput | $Enums.MatchResultStatus;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    match?: Prisma.MatchUpdateOneRequiredWithoutMatchResultNestedInput;
};
export type MatchResultUncheckedUpdateWithoutWinner_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    home_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    result_type?: Prisma.EnumMatchResultTypeFieldUpdateOperationsInput | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFieldUpdateOperationsInput | $Enums.MatchResultStatus;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MatchResultUncheckedUpdateManyWithoutWinner_teamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.IntFieldUpdateOperationsInput | number;
    home_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_half_time_score?: Prisma.IntFieldUpdateOperationsInput | number;
    home_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_extra_time_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    away_penalty_score?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    home_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    away_final_score?: Prisma.IntFieldUpdateOperationsInput | number;
    result_type?: Prisma.EnumMatchResultTypeFieldUpdateOperationsInput | $Enums.MatchResultType;
    status?: Prisma.EnumMatchResultStatusFieldUpdateOperationsInput | $Enums.MatchResultStatus;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    appeal_note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MatchResultSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    match_id?: boolean;
    winner_team_id?: boolean;
    home_score?: boolean;
    away_score?: boolean;
    home_half_time_score?: boolean;
    away_half_time_score?: boolean;
    home_extra_time_score?: boolean;
    away_extra_time_score?: boolean;
    home_penalty_score?: boolean;
    away_penalty_score?: boolean;
    home_final_score?: boolean;
    away_final_score?: boolean;
    result_type?: boolean;
    status?: boolean;
    duration?: boolean;
    notes?: boolean;
    appeal_reason?: boolean;
    appeal_note?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    winner_team?: boolean | Prisma.MatchResult$winner_teamArgs<ExtArgs>;
}, ExtArgs["result"]["matchResult"]>;
export type MatchResultSelectScalar = {
    id?: boolean;
    match_id?: boolean;
    winner_team_id?: boolean;
    home_score?: boolean;
    away_score?: boolean;
    home_half_time_score?: boolean;
    away_half_time_score?: boolean;
    home_extra_time_score?: boolean;
    away_extra_time_score?: boolean;
    home_penalty_score?: boolean;
    away_penalty_score?: boolean;
    home_final_score?: boolean;
    away_final_score?: boolean;
    result_type?: boolean;
    status?: boolean;
    duration?: boolean;
    notes?: boolean;
    appeal_reason?: boolean;
    appeal_note?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
};
export type MatchResultOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "match_id" | "winner_team_id" | "home_score" | "away_score" | "home_half_time_score" | "away_half_time_score" | "home_extra_time_score" | "away_extra_time_score" | "home_penalty_score" | "away_penalty_score" | "home_final_score" | "away_final_score" | "result_type" | "status" | "duration" | "notes" | "appeal_reason" | "appeal_note" | "is_active" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["matchResult"]>;
export type MatchResultInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    winner_team?: boolean | Prisma.MatchResult$winner_teamArgs<ExtArgs>;
};
export type $MatchResultPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MatchResult";
    objects: {
        match: Prisma.$MatchPayload<ExtArgs>;
        winner_team: Prisma.$TeamPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        match_id: number;
        winner_team_id: number | null;
        home_score: number;
        away_score: number;
        home_half_time_score: number;
        away_half_time_score: number;
        home_extra_time_score: number | null;
        away_extra_time_score: number | null;
        home_penalty_score: number | null;
        away_penalty_score: number | null;
        home_final_score: number;
        away_final_score: number;
        result_type: $Enums.MatchResultType;
        status: $Enums.MatchResultStatus;
        duration: number | null;
        notes: string | null;
        appeal_reason: string | null;
        appeal_note: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
    }, ExtArgs["result"]["matchResult"]>;
    composites: {};
};
export type MatchResultGetPayload<S extends boolean | null | undefined | MatchResultDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MatchResultPayload, S>;
export type MatchResultCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MatchResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MatchResultCountAggregateInputType | true;
};
export interface MatchResultDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MatchResult'];
        meta: {
            name: 'MatchResult';
        };
    };
    /**
     * Find zero or one MatchResult that matches the filter.
     * @param {MatchResultFindUniqueArgs} args - Arguments to find a MatchResult
     * @example
     * // Get one MatchResult
     * const matchResult = await prisma.matchResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchResultFindUniqueArgs>(args: Prisma.SelectSubset<T, MatchResultFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MatchResultClient<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MatchResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchResultFindUniqueOrThrowArgs} args - Arguments to find a MatchResult
     * @example
     * // Get one MatchResult
     * const matchResult = await prisma.matchResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchResultFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MatchResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchResultClient<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MatchResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchResultFindFirstArgs} args - Arguments to find a MatchResult
     * @example
     * // Get one MatchResult
     * const matchResult = await prisma.matchResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchResultFindFirstArgs>(args?: Prisma.SelectSubset<T, MatchResultFindFirstArgs<ExtArgs>>): Prisma.Prisma__MatchResultClient<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MatchResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchResultFindFirstOrThrowArgs} args - Arguments to find a MatchResult
     * @example
     * // Get one MatchResult
     * const matchResult = await prisma.matchResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchResultFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MatchResultFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchResultClient<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MatchResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchResults
     * const matchResults = await prisma.matchResult.findMany()
     *
     * // Get first 10 MatchResults
     * const matchResults = await prisma.matchResult.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const matchResultWithIdOnly = await prisma.matchResult.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MatchResultFindManyArgs>(args?: Prisma.SelectSubset<T, MatchResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MatchResult.
     * @param {MatchResultCreateArgs} args - Arguments to create a MatchResult.
     * @example
     * // Create one MatchResult
     * const MatchResult = await prisma.matchResult.create({
     *   data: {
     *     // ... data to create a MatchResult
     *   }
     * })
     *
     */
    create<T extends MatchResultCreateArgs>(args: Prisma.SelectSubset<T, MatchResultCreateArgs<ExtArgs>>): Prisma.Prisma__MatchResultClient<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MatchResults.
     * @param {MatchResultCreateManyArgs} args - Arguments to create many MatchResults.
     * @example
     * // Create many MatchResults
     * const matchResult = await prisma.matchResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MatchResultCreateManyArgs>(args?: Prisma.SelectSubset<T, MatchResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MatchResult.
     * @param {MatchResultDeleteArgs} args - Arguments to delete one MatchResult.
     * @example
     * // Delete one MatchResult
     * const MatchResult = await prisma.matchResult.delete({
     *   where: {
     *     // ... filter to delete one MatchResult
     *   }
     * })
     *
     */
    delete<T extends MatchResultDeleteArgs>(args: Prisma.SelectSubset<T, MatchResultDeleteArgs<ExtArgs>>): Prisma.Prisma__MatchResultClient<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MatchResult.
     * @param {MatchResultUpdateArgs} args - Arguments to update one MatchResult.
     * @example
     * // Update one MatchResult
     * const matchResult = await prisma.matchResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MatchResultUpdateArgs>(args: Prisma.SelectSubset<T, MatchResultUpdateArgs<ExtArgs>>): Prisma.Prisma__MatchResultClient<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MatchResults.
     * @param {MatchResultDeleteManyArgs} args - Arguments to filter MatchResults to delete.
     * @example
     * // Delete a few MatchResults
     * const { count } = await prisma.matchResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MatchResultDeleteManyArgs>(args?: Prisma.SelectSubset<T, MatchResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MatchResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchResults
     * const matchResult = await prisma.matchResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MatchResultUpdateManyArgs>(args: Prisma.SelectSubset<T, MatchResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MatchResult.
     * @param {MatchResultUpsertArgs} args - Arguments to update or create a MatchResult.
     * @example
     * // Update or create a MatchResult
     * const matchResult = await prisma.matchResult.upsert({
     *   create: {
     *     // ... data to create a MatchResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchResult we want to update
     *   }
     * })
     */
    upsert<T extends MatchResultUpsertArgs>(args: Prisma.SelectSubset<T, MatchResultUpsertArgs<ExtArgs>>): Prisma.Prisma__MatchResultClient<runtime.Types.Result.GetResult<Prisma.$MatchResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MatchResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchResultCountArgs} args - Arguments to filter MatchResults to count.
     * @example
     * // Count the number of MatchResults
     * const count = await prisma.matchResult.count({
     *   where: {
     *     // ... the filter for the MatchResults we want to count
     *   }
     * })
    **/
    count<T extends MatchResultCountArgs>(args?: Prisma.Subset<T, MatchResultCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MatchResultCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MatchResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MatchResultAggregateArgs>(args: Prisma.Subset<T, MatchResultAggregateArgs>): Prisma.PrismaPromise<GetMatchResultAggregateType<T>>;
    /**
     * Group by MatchResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchResultGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MatchResultGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MatchResultGroupByArgs['orderBy'];
    } : {
        orderBy?: MatchResultGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MatchResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MatchResult model
     */
    readonly fields: MatchResultFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MatchResult.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MatchResultClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    match<T extends Prisma.MatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchDefaultArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    winner_team<T extends Prisma.MatchResult$winner_teamArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchResult$winner_teamArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the MatchResult model
 */
export interface MatchResultFieldRefs {
    readonly id: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly match_id: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly winner_team_id: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly home_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly away_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly home_half_time_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly away_half_time_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly home_extra_time_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly away_extra_time_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly home_penalty_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly away_penalty_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly home_final_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly away_final_score: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly result_type: Prisma.FieldRef<"MatchResult", 'MatchResultType'>;
    readonly status: Prisma.FieldRef<"MatchResult", 'MatchResultStatus'>;
    readonly duration: Prisma.FieldRef<"MatchResult", 'Int'>;
    readonly notes: Prisma.FieldRef<"MatchResult", 'String'>;
    readonly appeal_reason: Prisma.FieldRef<"MatchResult", 'String'>;
    readonly appeal_note: Prisma.FieldRef<"MatchResult", 'String'>;
    readonly is_active: Prisma.FieldRef<"MatchResult", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"MatchResult", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"MatchResult", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"MatchResult", 'DateTime'>;
}
/**
 * MatchResult findUnique
 */
export type MatchResultFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchResult to fetch.
     */
    where: Prisma.MatchResultWhereUniqueInput;
};
/**
 * MatchResult findUniqueOrThrow
 */
export type MatchResultFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchResult to fetch.
     */
    where: Prisma.MatchResultWhereUniqueInput;
};
/**
 * MatchResult findFirst
 */
export type MatchResultFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchResult to fetch.
     */
    where?: Prisma.MatchResultWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchResults to fetch.
     */
    orderBy?: Prisma.MatchResultOrderByWithRelationInput | Prisma.MatchResultOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MatchResults.
     */
    cursor?: Prisma.MatchResultWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchResults from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchResults.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchResults.
     */
    distinct?: Prisma.MatchResultScalarFieldEnum | Prisma.MatchResultScalarFieldEnum[];
};
/**
 * MatchResult findFirstOrThrow
 */
export type MatchResultFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchResult to fetch.
     */
    where?: Prisma.MatchResultWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchResults to fetch.
     */
    orderBy?: Prisma.MatchResultOrderByWithRelationInput | Prisma.MatchResultOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MatchResults.
     */
    cursor?: Prisma.MatchResultWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchResults from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchResults.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchResults.
     */
    distinct?: Prisma.MatchResultScalarFieldEnum | Prisma.MatchResultScalarFieldEnum[];
};
/**
 * MatchResult findMany
 */
export type MatchResultFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MatchResults to fetch.
     */
    where?: Prisma.MatchResultWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MatchResults to fetch.
     */
    orderBy?: Prisma.MatchResultOrderByWithRelationInput | Prisma.MatchResultOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MatchResults.
     */
    cursor?: Prisma.MatchResultWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MatchResults from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MatchResults.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MatchResults.
     */
    distinct?: Prisma.MatchResultScalarFieldEnum | Prisma.MatchResultScalarFieldEnum[];
};
/**
 * MatchResult create
 */
export type MatchResultCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a MatchResult.
     */
    data: Prisma.XOR<Prisma.MatchResultCreateInput, Prisma.MatchResultUncheckedCreateInput>;
};
/**
 * MatchResult createMany
 */
export type MatchResultCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchResults.
     */
    data: Prisma.MatchResultCreateManyInput | Prisma.MatchResultCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * MatchResult update
 */
export type MatchResultUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a MatchResult.
     */
    data: Prisma.XOR<Prisma.MatchResultUpdateInput, Prisma.MatchResultUncheckedUpdateInput>;
    /**
     * Choose, which MatchResult to update.
     */
    where: Prisma.MatchResultWhereUniqueInput;
};
/**
 * MatchResult updateMany
 */
export type MatchResultUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchResults.
     */
    data: Prisma.XOR<Prisma.MatchResultUpdateManyMutationInput, Prisma.MatchResultUncheckedUpdateManyInput>;
    /**
     * Filter which MatchResults to update
     */
    where?: Prisma.MatchResultWhereInput;
    /**
     * Limit how many MatchResults to update.
     */
    limit?: number;
};
/**
 * MatchResult upsert
 */
export type MatchResultUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the MatchResult to update in case it exists.
     */
    where: Prisma.MatchResultWhereUniqueInput;
    /**
     * In case the MatchResult found by the `where` argument doesn't exist, create a new MatchResult with this data.
     */
    create: Prisma.XOR<Prisma.MatchResultCreateInput, Prisma.MatchResultUncheckedCreateInput>;
    /**
     * In case the MatchResult was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MatchResultUpdateInput, Prisma.MatchResultUncheckedUpdateInput>;
};
/**
 * MatchResult delete
 */
export type MatchResultDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which MatchResult to delete.
     */
    where: Prisma.MatchResultWhereUniqueInput;
};
/**
 * MatchResult deleteMany
 */
export type MatchResultDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MatchResults to delete
     */
    where?: Prisma.MatchResultWhereInput;
    /**
     * Limit how many MatchResults to delete.
     */
    limit?: number;
};
/**
 * MatchResult.winner_team
 */
export type MatchResult$winner_teamArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * MatchResult without action
 */
export type MatchResultDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=MatchResult.d.ts.map