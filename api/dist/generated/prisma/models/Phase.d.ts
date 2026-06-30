import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Phase
 *
 */
export type PhaseModel = runtime.Types.Result.DefaultSelection<Prisma.$PhasePayload>;
export type AggregatePhase = {
    _count: PhaseCountAggregateOutputType | null;
    _avg: PhaseAvgAggregateOutputType | null;
    _sum: PhaseSumAggregateOutputType | null;
    _min: PhaseMinAggregateOutputType | null;
    _max: PhaseMaxAggregateOutputType | null;
};
export type PhaseAvgAggregateOutputType = {
    id: number | null;
    season_id: number | null;
    order: number | null;
    min_rest_days_per_team: number | null;
    legs: number | null;
    teams_per_group: number | null;
};
export type PhaseSumAggregateOutputType = {
    id: number | null;
    season_id: number | null;
    order: number | null;
    min_rest_days_per_team: number | null;
    legs: number | null;
    teams_per_group: number | null;
};
export type PhaseMinAggregateOutputType = {
    id: number | null;
    season_id: number | null;
    name: string | null;
    type: $Enums.PhaseType | null;
    format: $Enums.PhaseFormat | null;
    order: number | null;
    start_date: Date | null;
    end_date: Date | null;
    min_rest_days_per_team: number | null;
    is_active: boolean | null;
    legs: number | null;
    teams_per_group: number | null;
    status: $Enums.PhaseStatus | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type PhaseMaxAggregateOutputType = {
    id: number | null;
    season_id: number | null;
    name: string | null;
    type: $Enums.PhaseType | null;
    format: $Enums.PhaseFormat | null;
    order: number | null;
    start_date: Date | null;
    end_date: Date | null;
    min_rest_days_per_team: number | null;
    is_active: boolean | null;
    legs: number | null;
    teams_per_group: number | null;
    status: $Enums.PhaseStatus | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type PhaseCountAggregateOutputType = {
    id: number;
    season_id: number;
    name: number;
    type: number;
    format: number;
    order: number;
    start_date: number;
    end_date: number;
    min_rest_days_per_team: number;
    is_active: number;
    legs: number;
    teams_per_group: number;
    status: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type PhaseAvgAggregateInputType = {
    id?: true;
    season_id?: true;
    order?: true;
    min_rest_days_per_team?: true;
    legs?: true;
    teams_per_group?: true;
};
export type PhaseSumAggregateInputType = {
    id?: true;
    season_id?: true;
    order?: true;
    min_rest_days_per_team?: true;
    legs?: true;
    teams_per_group?: true;
};
export type PhaseMinAggregateInputType = {
    id?: true;
    season_id?: true;
    name?: true;
    type?: true;
    format?: true;
    order?: true;
    start_date?: true;
    end_date?: true;
    min_rest_days_per_team?: true;
    is_active?: true;
    legs?: true;
    teams_per_group?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
};
export type PhaseMaxAggregateInputType = {
    id?: true;
    season_id?: true;
    name?: true;
    type?: true;
    format?: true;
    order?: true;
    start_date?: true;
    end_date?: true;
    min_rest_days_per_team?: true;
    is_active?: true;
    legs?: true;
    teams_per_group?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
};
export type PhaseCountAggregateInputType = {
    id?: true;
    season_id?: true;
    name?: true;
    type?: true;
    format?: true;
    order?: true;
    start_date?: true;
    end_date?: true;
    min_rest_days_per_team?: true;
    is_active?: true;
    legs?: true;
    teams_per_group?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type PhaseAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Phase to aggregate.
     */
    where?: Prisma.PhaseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Phases to fetch.
     */
    orderBy?: Prisma.PhaseOrderByWithRelationInput | Prisma.PhaseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PhaseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Phases from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Phases.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Phases
    **/
    _count?: true | PhaseCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: PhaseAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: PhaseSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PhaseMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PhaseMaxAggregateInputType;
};
export type GetPhaseAggregateType<T extends PhaseAggregateArgs> = {
    [P in keyof T & keyof AggregatePhase]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePhase[P]> : Prisma.GetScalarType<T[P], AggregatePhase[P]>;
};
export type PhaseGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PhaseWhereInput;
    orderBy?: Prisma.PhaseOrderByWithAggregationInput | Prisma.PhaseOrderByWithAggregationInput[];
    by: Prisma.PhaseScalarFieldEnum[] | Prisma.PhaseScalarFieldEnum;
    having?: Prisma.PhaseScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PhaseCountAggregateInputType | true;
    _avg?: PhaseAvgAggregateInputType;
    _sum?: PhaseSumAggregateInputType;
    _min?: PhaseMinAggregateInputType;
    _max?: PhaseMaxAggregateInputType;
};
export type PhaseGroupByOutputType = {
    id: number;
    season_id: number;
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date: Date | null;
    end_date: Date | null;
    min_rest_days_per_team: number;
    is_active: boolean;
    legs: number;
    teams_per_group: number | null;
    status: $Enums.PhaseStatus;
    created_at: Date;
    updated_at: Date | null;
    _count: PhaseCountAggregateOutputType | null;
    _avg: PhaseAvgAggregateOutputType | null;
    _sum: PhaseSumAggregateOutputType | null;
    _min: PhaseMinAggregateOutputType | null;
    _max: PhaseMaxAggregateOutputType | null;
};
export type GetPhaseGroupByPayload<T extends PhaseGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PhaseGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PhaseGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PhaseGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PhaseGroupByOutputType[P]>;
}>>;
export type PhaseWhereInput = {
    AND?: Prisma.PhaseWhereInput | Prisma.PhaseWhereInput[];
    OR?: Prisma.PhaseWhereInput[];
    NOT?: Prisma.PhaseWhereInput | Prisma.PhaseWhereInput[];
    id?: Prisma.IntFilter<"Phase"> | number;
    season_id?: Prisma.IntFilter<"Phase"> | number;
    name?: Prisma.StringFilter<"Phase"> | string;
    type?: Prisma.EnumPhaseTypeFilter<"Phase"> | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFilter<"Phase"> | $Enums.PhaseFormat;
    order?: Prisma.IntFilter<"Phase"> | number;
    start_date?: Prisma.DateTimeNullableFilter<"Phase"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableFilter<"Phase"> | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFilter<"Phase"> | number;
    is_active?: Prisma.BoolFilter<"Phase"> | boolean;
    legs?: Prisma.IntFilter<"Phase"> | number;
    teams_per_group?: Prisma.IntNullableFilter<"Phase"> | number | null;
    status?: Prisma.EnumPhaseStatusFilter<"Phase"> | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFilter<"Phase"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Phase"> | Date | string | null;
    bracket_slots?: Prisma.BracketSlotListRelationFilter;
    season?: Prisma.XOR<Prisma.SeasonScalarRelationFilter, Prisma.SeasonWhereInput>;
    groups?: Prisma.GroupListRelationFilter;
    matches?: Prisma.MatchListRelationFilter;
};
export type PhaseOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    format?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    start_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    min_rest_days_per_team?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    legs?: Prisma.SortOrder;
    teams_per_group?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    bracket_slots?: Prisma.BracketSlotOrderByRelationAggregateInput;
    season?: Prisma.SeasonOrderByWithRelationInput;
    groups?: Prisma.GroupOrderByRelationAggregateInput;
    matches?: Prisma.MatchOrderByRelationAggregateInput;
    _relevance?: Prisma.PhaseOrderByRelevanceInput;
};
export type PhaseWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.PhaseWhereInput | Prisma.PhaseWhereInput[];
    OR?: Prisma.PhaseWhereInput[];
    NOT?: Prisma.PhaseWhereInput | Prisma.PhaseWhereInput[];
    season_id?: Prisma.IntFilter<"Phase"> | number;
    name?: Prisma.StringFilter<"Phase"> | string;
    type?: Prisma.EnumPhaseTypeFilter<"Phase"> | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFilter<"Phase"> | $Enums.PhaseFormat;
    order?: Prisma.IntFilter<"Phase"> | number;
    start_date?: Prisma.DateTimeNullableFilter<"Phase"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableFilter<"Phase"> | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFilter<"Phase"> | number;
    is_active?: Prisma.BoolFilter<"Phase"> | boolean;
    legs?: Prisma.IntFilter<"Phase"> | number;
    teams_per_group?: Prisma.IntNullableFilter<"Phase"> | number | null;
    status?: Prisma.EnumPhaseStatusFilter<"Phase"> | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFilter<"Phase"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Phase"> | Date | string | null;
    bracket_slots?: Prisma.BracketSlotListRelationFilter;
    season?: Prisma.XOR<Prisma.SeasonScalarRelationFilter, Prisma.SeasonWhereInput>;
    groups?: Prisma.GroupListRelationFilter;
    matches?: Prisma.MatchListRelationFilter;
}, "id">;
export type PhaseOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    format?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    start_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    min_rest_days_per_team?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    legs?: Prisma.SortOrder;
    teams_per_group?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PhaseCountOrderByAggregateInput;
    _avg?: Prisma.PhaseAvgOrderByAggregateInput;
    _max?: Prisma.PhaseMaxOrderByAggregateInput;
    _min?: Prisma.PhaseMinOrderByAggregateInput;
    _sum?: Prisma.PhaseSumOrderByAggregateInput;
};
export type PhaseScalarWhereWithAggregatesInput = {
    AND?: Prisma.PhaseScalarWhereWithAggregatesInput | Prisma.PhaseScalarWhereWithAggregatesInput[];
    OR?: Prisma.PhaseScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PhaseScalarWhereWithAggregatesInput | Prisma.PhaseScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Phase"> | number;
    season_id?: Prisma.IntWithAggregatesFilter<"Phase"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Phase"> | string;
    type?: Prisma.EnumPhaseTypeWithAggregatesFilter<"Phase"> | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatWithAggregatesFilter<"Phase"> | $Enums.PhaseFormat;
    order?: Prisma.IntWithAggregatesFilter<"Phase"> | number;
    start_date?: Prisma.DateTimeNullableWithAggregatesFilter<"Phase"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableWithAggregatesFilter<"Phase"> | Date | string | null;
    min_rest_days_per_team?: Prisma.IntWithAggregatesFilter<"Phase"> | number;
    is_active?: Prisma.BoolWithAggregatesFilter<"Phase"> | boolean;
    legs?: Prisma.IntWithAggregatesFilter<"Phase"> | number;
    teams_per_group?: Prisma.IntNullableWithAggregatesFilter<"Phase"> | number | null;
    status?: Prisma.EnumPhaseStatusWithAggregatesFilter<"Phase"> | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Phase"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Phase"> | Date | string | null;
};
export type PhaseCreateInput = {
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    bracket_slots?: Prisma.BracketSlotCreateNestedManyWithoutPhaseInput;
    season: Prisma.SeasonCreateNestedOneWithoutPhasesInput;
    groups?: Prisma.GroupCreateNestedManyWithoutPhaseInput;
    matches?: Prisma.MatchCreateNestedManyWithoutPhaseInput;
};
export type PhaseUncheckedCreateInput = {
    id?: number;
    season_id: number;
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    bracket_slots?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutPhaseInput;
    groups?: Prisma.GroupUncheckedCreateNestedManyWithoutPhaseInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutPhaseInput;
};
export type PhaseUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bracket_slots?: Prisma.BracketSlotUpdateManyWithoutPhaseNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutPhasesNestedInput;
    groups?: Prisma.GroupUpdateManyWithoutPhaseNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutPhaseNestedInput;
};
export type PhaseUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bracket_slots?: Prisma.BracketSlotUncheckedUpdateManyWithoutPhaseNestedInput;
    groups?: Prisma.GroupUncheckedUpdateManyWithoutPhaseNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutPhaseNestedInput;
};
export type PhaseCreateManyInput = {
    id?: number;
    season_id: number;
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PhaseUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PhaseUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PhaseOrderByRelevanceInput = {
    fields: Prisma.PhaseOrderByRelevanceFieldEnum | Prisma.PhaseOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type PhaseCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    format?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    min_rest_days_per_team?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    legs?: Prisma.SortOrder;
    teams_per_group?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PhaseAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    min_rest_days_per_team?: Prisma.SortOrder;
    legs?: Prisma.SortOrder;
    teams_per_group?: Prisma.SortOrder;
};
export type PhaseMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    format?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    min_rest_days_per_team?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    legs?: Prisma.SortOrder;
    teams_per_group?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PhaseMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    format?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    min_rest_days_per_team?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    legs?: Prisma.SortOrder;
    teams_per_group?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PhaseSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    min_rest_days_per_team?: Prisma.SortOrder;
    legs?: Prisma.SortOrder;
    teams_per_group?: Prisma.SortOrder;
};
export type PhaseScalarRelationFilter = {
    is?: Prisma.PhaseWhereInput;
    isNot?: Prisma.PhaseWhereInput;
};
export type PhaseListRelationFilter = {
    every?: Prisma.PhaseWhereInput;
    some?: Prisma.PhaseWhereInput;
    none?: Prisma.PhaseWhereInput;
};
export type PhaseOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EnumPhaseTypeFieldUpdateOperationsInput = {
    set?: $Enums.PhaseType;
};
export type EnumPhaseFormatFieldUpdateOperationsInput = {
    set?: $Enums.PhaseFormat;
};
export type EnumPhaseStatusFieldUpdateOperationsInput = {
    set?: $Enums.PhaseStatus;
};
export type PhaseCreateNestedOneWithoutBracket_slotsInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutBracket_slotsInput, Prisma.PhaseUncheckedCreateWithoutBracket_slotsInput>;
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutBracket_slotsInput;
    connect?: Prisma.PhaseWhereUniqueInput;
};
export type PhaseUpdateOneRequiredWithoutBracket_slotsNestedInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutBracket_slotsInput, Prisma.PhaseUncheckedCreateWithoutBracket_slotsInput>;
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutBracket_slotsInput;
    upsert?: Prisma.PhaseUpsertWithoutBracket_slotsInput;
    connect?: Prisma.PhaseWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PhaseUpdateToOneWithWhereWithoutBracket_slotsInput, Prisma.PhaseUpdateWithoutBracket_slotsInput>, Prisma.PhaseUncheckedUpdateWithoutBracket_slotsInput>;
};
export type PhaseCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutSeasonInput, Prisma.PhaseUncheckedCreateWithoutSeasonInput> | Prisma.PhaseCreateWithoutSeasonInput[] | Prisma.PhaseUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutSeasonInput | Prisma.PhaseCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.PhaseCreateManySeasonInputEnvelope;
    connect?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
};
export type PhaseUncheckedCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutSeasonInput, Prisma.PhaseUncheckedCreateWithoutSeasonInput> | Prisma.PhaseCreateWithoutSeasonInput[] | Prisma.PhaseUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutSeasonInput | Prisma.PhaseCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.PhaseCreateManySeasonInputEnvelope;
    connect?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
};
export type PhaseUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutSeasonInput, Prisma.PhaseUncheckedCreateWithoutSeasonInput> | Prisma.PhaseCreateWithoutSeasonInput[] | Prisma.PhaseUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutSeasonInput | Prisma.PhaseCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.PhaseUpsertWithWhereUniqueWithoutSeasonInput | Prisma.PhaseUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.PhaseCreateManySeasonInputEnvelope;
    set?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
    disconnect?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
    delete?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
    connect?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
    update?: Prisma.PhaseUpdateWithWhereUniqueWithoutSeasonInput | Prisma.PhaseUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.PhaseUpdateManyWithWhereWithoutSeasonInput | Prisma.PhaseUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.PhaseScalarWhereInput | Prisma.PhaseScalarWhereInput[];
};
export type PhaseUncheckedUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutSeasonInput, Prisma.PhaseUncheckedCreateWithoutSeasonInput> | Prisma.PhaseCreateWithoutSeasonInput[] | Prisma.PhaseUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutSeasonInput | Prisma.PhaseCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.PhaseUpsertWithWhereUniqueWithoutSeasonInput | Prisma.PhaseUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.PhaseCreateManySeasonInputEnvelope;
    set?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
    disconnect?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
    delete?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
    connect?: Prisma.PhaseWhereUniqueInput | Prisma.PhaseWhereUniqueInput[];
    update?: Prisma.PhaseUpdateWithWhereUniqueWithoutSeasonInput | Prisma.PhaseUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.PhaseUpdateManyWithWhereWithoutSeasonInput | Prisma.PhaseUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.PhaseScalarWhereInput | Prisma.PhaseScalarWhereInput[];
};
export type PhaseCreateNestedOneWithoutGroupsInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutGroupsInput, Prisma.PhaseUncheckedCreateWithoutGroupsInput>;
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutGroupsInput;
    connect?: Prisma.PhaseWhereUniqueInput;
};
export type PhaseUpdateOneRequiredWithoutGroupsNestedInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutGroupsInput, Prisma.PhaseUncheckedCreateWithoutGroupsInput>;
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutGroupsInput;
    upsert?: Prisma.PhaseUpsertWithoutGroupsInput;
    connect?: Prisma.PhaseWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PhaseUpdateToOneWithWhereWithoutGroupsInput, Prisma.PhaseUpdateWithoutGroupsInput>, Prisma.PhaseUncheckedUpdateWithoutGroupsInput>;
};
export type PhaseCreateNestedOneWithoutMatchesInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutMatchesInput, Prisma.PhaseUncheckedCreateWithoutMatchesInput>;
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutMatchesInput;
    connect?: Prisma.PhaseWhereUniqueInput;
};
export type PhaseUpdateOneRequiredWithoutMatchesNestedInput = {
    create?: Prisma.XOR<Prisma.PhaseCreateWithoutMatchesInput, Prisma.PhaseUncheckedCreateWithoutMatchesInput>;
    connectOrCreate?: Prisma.PhaseCreateOrConnectWithoutMatchesInput;
    upsert?: Prisma.PhaseUpsertWithoutMatchesInput;
    connect?: Prisma.PhaseWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PhaseUpdateToOneWithWhereWithoutMatchesInput, Prisma.PhaseUpdateWithoutMatchesInput>, Prisma.PhaseUncheckedUpdateWithoutMatchesInput>;
};
export type PhaseCreateWithoutBracket_slotsInput = {
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    season: Prisma.SeasonCreateNestedOneWithoutPhasesInput;
    groups?: Prisma.GroupCreateNestedManyWithoutPhaseInput;
    matches?: Prisma.MatchCreateNestedManyWithoutPhaseInput;
};
export type PhaseUncheckedCreateWithoutBracket_slotsInput = {
    id?: number;
    season_id: number;
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    groups?: Prisma.GroupUncheckedCreateNestedManyWithoutPhaseInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutPhaseInput;
};
export type PhaseCreateOrConnectWithoutBracket_slotsInput = {
    where: Prisma.PhaseWhereUniqueInput;
    create: Prisma.XOR<Prisma.PhaseCreateWithoutBracket_slotsInput, Prisma.PhaseUncheckedCreateWithoutBracket_slotsInput>;
};
export type PhaseUpsertWithoutBracket_slotsInput = {
    update: Prisma.XOR<Prisma.PhaseUpdateWithoutBracket_slotsInput, Prisma.PhaseUncheckedUpdateWithoutBracket_slotsInput>;
    create: Prisma.XOR<Prisma.PhaseCreateWithoutBracket_slotsInput, Prisma.PhaseUncheckedCreateWithoutBracket_slotsInput>;
    where?: Prisma.PhaseWhereInput;
};
export type PhaseUpdateToOneWithWhereWithoutBracket_slotsInput = {
    where?: Prisma.PhaseWhereInput;
    data: Prisma.XOR<Prisma.PhaseUpdateWithoutBracket_slotsInput, Prisma.PhaseUncheckedUpdateWithoutBracket_slotsInput>;
};
export type PhaseUpdateWithoutBracket_slotsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    season?: Prisma.SeasonUpdateOneRequiredWithoutPhasesNestedInput;
    groups?: Prisma.GroupUpdateManyWithoutPhaseNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutPhaseNestedInput;
};
export type PhaseUncheckedUpdateWithoutBracket_slotsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    groups?: Prisma.GroupUncheckedUpdateManyWithoutPhaseNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutPhaseNestedInput;
};
export type PhaseCreateWithoutSeasonInput = {
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    bracket_slots?: Prisma.BracketSlotCreateNestedManyWithoutPhaseInput;
    groups?: Prisma.GroupCreateNestedManyWithoutPhaseInput;
    matches?: Prisma.MatchCreateNestedManyWithoutPhaseInput;
};
export type PhaseUncheckedCreateWithoutSeasonInput = {
    id?: number;
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    bracket_slots?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutPhaseInput;
    groups?: Prisma.GroupUncheckedCreateNestedManyWithoutPhaseInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutPhaseInput;
};
export type PhaseCreateOrConnectWithoutSeasonInput = {
    where: Prisma.PhaseWhereUniqueInput;
    create: Prisma.XOR<Prisma.PhaseCreateWithoutSeasonInput, Prisma.PhaseUncheckedCreateWithoutSeasonInput>;
};
export type PhaseCreateManySeasonInputEnvelope = {
    data: Prisma.PhaseCreateManySeasonInput | Prisma.PhaseCreateManySeasonInput[];
    skipDuplicates?: boolean;
};
export type PhaseUpsertWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.PhaseWhereUniqueInput;
    update: Prisma.XOR<Prisma.PhaseUpdateWithoutSeasonInput, Prisma.PhaseUncheckedUpdateWithoutSeasonInput>;
    create: Prisma.XOR<Prisma.PhaseCreateWithoutSeasonInput, Prisma.PhaseUncheckedCreateWithoutSeasonInput>;
};
export type PhaseUpdateWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.PhaseWhereUniqueInput;
    data: Prisma.XOR<Prisma.PhaseUpdateWithoutSeasonInput, Prisma.PhaseUncheckedUpdateWithoutSeasonInput>;
};
export type PhaseUpdateManyWithWhereWithoutSeasonInput = {
    where: Prisma.PhaseScalarWhereInput;
    data: Prisma.XOR<Prisma.PhaseUpdateManyMutationInput, Prisma.PhaseUncheckedUpdateManyWithoutSeasonInput>;
};
export type PhaseScalarWhereInput = {
    AND?: Prisma.PhaseScalarWhereInput | Prisma.PhaseScalarWhereInput[];
    OR?: Prisma.PhaseScalarWhereInput[];
    NOT?: Prisma.PhaseScalarWhereInput | Prisma.PhaseScalarWhereInput[];
    id?: Prisma.IntFilter<"Phase"> | number;
    season_id?: Prisma.IntFilter<"Phase"> | number;
    name?: Prisma.StringFilter<"Phase"> | string;
    type?: Prisma.EnumPhaseTypeFilter<"Phase"> | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFilter<"Phase"> | $Enums.PhaseFormat;
    order?: Prisma.IntFilter<"Phase"> | number;
    start_date?: Prisma.DateTimeNullableFilter<"Phase"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableFilter<"Phase"> | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFilter<"Phase"> | number;
    is_active?: Prisma.BoolFilter<"Phase"> | boolean;
    legs?: Prisma.IntFilter<"Phase"> | number;
    teams_per_group?: Prisma.IntNullableFilter<"Phase"> | number | null;
    status?: Prisma.EnumPhaseStatusFilter<"Phase"> | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFilter<"Phase"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Phase"> | Date | string | null;
};
export type PhaseCreateWithoutGroupsInput = {
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    bracket_slots?: Prisma.BracketSlotCreateNestedManyWithoutPhaseInput;
    season: Prisma.SeasonCreateNestedOneWithoutPhasesInput;
    matches?: Prisma.MatchCreateNestedManyWithoutPhaseInput;
};
export type PhaseUncheckedCreateWithoutGroupsInput = {
    id?: number;
    season_id: number;
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    bracket_slots?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutPhaseInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutPhaseInput;
};
export type PhaseCreateOrConnectWithoutGroupsInput = {
    where: Prisma.PhaseWhereUniqueInput;
    create: Prisma.XOR<Prisma.PhaseCreateWithoutGroupsInput, Prisma.PhaseUncheckedCreateWithoutGroupsInput>;
};
export type PhaseUpsertWithoutGroupsInput = {
    update: Prisma.XOR<Prisma.PhaseUpdateWithoutGroupsInput, Prisma.PhaseUncheckedUpdateWithoutGroupsInput>;
    create: Prisma.XOR<Prisma.PhaseCreateWithoutGroupsInput, Prisma.PhaseUncheckedCreateWithoutGroupsInput>;
    where?: Prisma.PhaseWhereInput;
};
export type PhaseUpdateToOneWithWhereWithoutGroupsInput = {
    where?: Prisma.PhaseWhereInput;
    data: Prisma.XOR<Prisma.PhaseUpdateWithoutGroupsInput, Prisma.PhaseUncheckedUpdateWithoutGroupsInput>;
};
export type PhaseUpdateWithoutGroupsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bracket_slots?: Prisma.BracketSlotUpdateManyWithoutPhaseNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutPhasesNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutPhaseNestedInput;
};
export type PhaseUncheckedUpdateWithoutGroupsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bracket_slots?: Prisma.BracketSlotUncheckedUpdateManyWithoutPhaseNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutPhaseNestedInput;
};
export type PhaseCreateWithoutMatchesInput = {
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    bracket_slots?: Prisma.BracketSlotCreateNestedManyWithoutPhaseInput;
    season: Prisma.SeasonCreateNestedOneWithoutPhasesInput;
    groups?: Prisma.GroupCreateNestedManyWithoutPhaseInput;
};
export type PhaseUncheckedCreateWithoutMatchesInput = {
    id?: number;
    season_id: number;
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    bracket_slots?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutPhaseInput;
    groups?: Prisma.GroupUncheckedCreateNestedManyWithoutPhaseInput;
};
export type PhaseCreateOrConnectWithoutMatchesInput = {
    where: Prisma.PhaseWhereUniqueInput;
    create: Prisma.XOR<Prisma.PhaseCreateWithoutMatchesInput, Prisma.PhaseUncheckedCreateWithoutMatchesInput>;
};
export type PhaseUpsertWithoutMatchesInput = {
    update: Prisma.XOR<Prisma.PhaseUpdateWithoutMatchesInput, Prisma.PhaseUncheckedUpdateWithoutMatchesInput>;
    create: Prisma.XOR<Prisma.PhaseCreateWithoutMatchesInput, Prisma.PhaseUncheckedCreateWithoutMatchesInput>;
    where?: Prisma.PhaseWhereInput;
};
export type PhaseUpdateToOneWithWhereWithoutMatchesInput = {
    where?: Prisma.PhaseWhereInput;
    data: Prisma.XOR<Prisma.PhaseUpdateWithoutMatchesInput, Prisma.PhaseUncheckedUpdateWithoutMatchesInput>;
};
export type PhaseUpdateWithoutMatchesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bracket_slots?: Prisma.BracketSlotUpdateManyWithoutPhaseNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutPhasesNestedInput;
    groups?: Prisma.GroupUpdateManyWithoutPhaseNestedInput;
};
export type PhaseUncheckedUpdateWithoutMatchesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bracket_slots?: Prisma.BracketSlotUncheckedUpdateManyWithoutPhaseNestedInput;
    groups?: Prisma.GroupUncheckedUpdateManyWithoutPhaseNestedInput;
};
export type PhaseCreateManySeasonInput = {
    id?: number;
    name: string;
    type: $Enums.PhaseType;
    format: $Enums.PhaseFormat;
    order: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    min_rest_days_per_team?: number;
    is_active?: boolean;
    legs?: number;
    teams_per_group?: number | null;
    status?: $Enums.PhaseStatus;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PhaseUpdateWithoutSeasonInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bracket_slots?: Prisma.BracketSlotUpdateManyWithoutPhaseNestedInput;
    groups?: Prisma.GroupUpdateManyWithoutPhaseNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutPhaseNestedInput;
};
export type PhaseUncheckedUpdateWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bracket_slots?: Prisma.BracketSlotUncheckedUpdateManyWithoutPhaseNestedInput;
    groups?: Prisma.GroupUncheckedUpdateManyWithoutPhaseNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutPhaseNestedInput;
};
export type PhaseUncheckedUpdateManyWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPhaseTypeFieldUpdateOperationsInput | $Enums.PhaseType;
    format?: Prisma.EnumPhaseFormatFieldUpdateOperationsInput | $Enums.PhaseFormat;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    min_rest_days_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    legs?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_per_group?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type PhaseCountOutputType
 */
export type PhaseCountOutputType = {
    bracket_slots: number;
    groups: number;
    matches: number;
};
export type PhaseCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bracket_slots?: boolean | PhaseCountOutputTypeCountBracket_slotsArgs;
    groups?: boolean | PhaseCountOutputTypeCountGroupsArgs;
    matches?: boolean | PhaseCountOutputTypeCountMatchesArgs;
};
/**
 * PhaseCountOutputType without action
 */
export type PhaseCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhaseCountOutputType
     */
    select?: Prisma.PhaseCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * PhaseCountOutputType without action
 */
export type PhaseCountOutputTypeCountBracket_slotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BracketSlotWhereInput;
};
/**
 * PhaseCountOutputType without action
 */
export type PhaseCountOutputTypeCountGroupsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GroupWhereInput;
};
/**
 * PhaseCountOutputType without action
 */
export type PhaseCountOutputTypeCountMatchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
};
export type PhaseSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    season_id?: boolean;
    name?: boolean;
    type?: boolean;
    format?: boolean;
    order?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    min_rest_days_per_team?: boolean;
    is_active?: boolean;
    legs?: boolean;
    teams_per_group?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    bracket_slots?: boolean | Prisma.Phase$bracket_slotsArgs<ExtArgs>;
    season?: boolean | Prisma.SeasonDefaultArgs<ExtArgs>;
    groups?: boolean | Prisma.Phase$groupsArgs<ExtArgs>;
    matches?: boolean | Prisma.Phase$matchesArgs<ExtArgs>;
    _count?: boolean | Prisma.PhaseCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["phase"]>;
export type PhaseSelectScalar = {
    id?: boolean;
    season_id?: boolean;
    name?: boolean;
    type?: boolean;
    format?: boolean;
    order?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    min_rest_days_per_team?: boolean;
    is_active?: boolean;
    legs?: boolean;
    teams_per_group?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type PhaseOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "season_id" | "name" | "type" | "format" | "order" | "start_date" | "end_date" | "min_rest_days_per_team" | "is_active" | "legs" | "teams_per_group" | "status" | "created_at" | "updated_at", ExtArgs["result"]["phase"]>;
export type PhaseInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bracket_slots?: boolean | Prisma.Phase$bracket_slotsArgs<ExtArgs>;
    season?: boolean | Prisma.SeasonDefaultArgs<ExtArgs>;
    groups?: boolean | Prisma.Phase$groupsArgs<ExtArgs>;
    matches?: boolean | Prisma.Phase$matchesArgs<ExtArgs>;
    _count?: boolean | Prisma.PhaseCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $PhasePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Phase";
    objects: {
        bracket_slots: Prisma.$BracketSlotPayload<ExtArgs>[];
        season: Prisma.$SeasonPayload<ExtArgs>;
        groups: Prisma.$GroupPayload<ExtArgs>[];
        matches: Prisma.$MatchPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        season_id: number;
        name: string;
        type: $Enums.PhaseType;
        format: $Enums.PhaseFormat;
        order: number;
        start_date: Date | null;
        end_date: Date | null;
        min_rest_days_per_team: number;
        is_active: boolean;
        legs: number;
        teams_per_group: number | null;
        status: $Enums.PhaseStatus;
        created_at: Date;
        updated_at: Date | null;
    }, ExtArgs["result"]["phase"]>;
    composites: {};
};
export type PhaseGetPayload<S extends boolean | null | undefined | PhaseDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PhasePayload, S>;
export type PhaseCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PhaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PhaseCountAggregateInputType | true;
};
export interface PhaseDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Phase'];
        meta: {
            name: 'Phase';
        };
    };
    /**
     * Find zero or one Phase that matches the filter.
     * @param {PhaseFindUniqueArgs} args - Arguments to find a Phase
     * @example
     * // Get one Phase
     * const phase = await prisma.phase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhaseFindUniqueArgs>(args: Prisma.SelectSubset<T, PhaseFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Phase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PhaseFindUniqueOrThrowArgs} args - Arguments to find a Phase
     * @example
     * // Get one Phase
     * const phase = await prisma.phase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhaseFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PhaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Phase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseFindFirstArgs} args - Arguments to find a Phase
     * @example
     * // Get one Phase
     * const phase = await prisma.phase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhaseFindFirstArgs>(args?: Prisma.SelectSubset<T, PhaseFindFirstArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Phase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseFindFirstOrThrowArgs} args - Arguments to find a Phase
     * @example
     * // Get one Phase
     * const phase = await prisma.phase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhaseFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PhaseFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Phases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Phases
     * const phases = await prisma.phase.findMany()
     *
     * // Get first 10 Phases
     * const phases = await prisma.phase.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const phaseWithIdOnly = await prisma.phase.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PhaseFindManyArgs>(args?: Prisma.SelectSubset<T, PhaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Phase.
     * @param {PhaseCreateArgs} args - Arguments to create a Phase.
     * @example
     * // Create one Phase
     * const Phase = await prisma.phase.create({
     *   data: {
     *     // ... data to create a Phase
     *   }
     * })
     *
     */
    create<T extends PhaseCreateArgs>(args: Prisma.SelectSubset<T, PhaseCreateArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Phases.
     * @param {PhaseCreateManyArgs} args - Arguments to create many Phases.
     * @example
     * // Create many Phases
     * const phase = await prisma.phase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PhaseCreateManyArgs>(args?: Prisma.SelectSubset<T, PhaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Phase.
     * @param {PhaseDeleteArgs} args - Arguments to delete one Phase.
     * @example
     * // Delete one Phase
     * const Phase = await prisma.phase.delete({
     *   where: {
     *     // ... filter to delete one Phase
     *   }
     * })
     *
     */
    delete<T extends PhaseDeleteArgs>(args: Prisma.SelectSubset<T, PhaseDeleteArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Phase.
     * @param {PhaseUpdateArgs} args - Arguments to update one Phase.
     * @example
     * // Update one Phase
     * const phase = await prisma.phase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PhaseUpdateArgs>(args: Prisma.SelectSubset<T, PhaseUpdateArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Phases.
     * @param {PhaseDeleteManyArgs} args - Arguments to filter Phases to delete.
     * @example
     * // Delete a few Phases
     * const { count } = await prisma.phase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PhaseDeleteManyArgs>(args?: Prisma.SelectSubset<T, PhaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Phases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Phases
     * const phase = await prisma.phase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PhaseUpdateManyArgs>(args: Prisma.SelectSubset<T, PhaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Phase.
     * @param {PhaseUpsertArgs} args - Arguments to update or create a Phase.
     * @example
     * // Update or create a Phase
     * const phase = await prisma.phase.upsert({
     *   create: {
     *     // ... data to create a Phase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Phase we want to update
     *   }
     * })
     */
    upsert<T extends PhaseUpsertArgs>(args: Prisma.SelectSubset<T, PhaseUpsertArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Phases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseCountArgs} args - Arguments to filter Phases to count.
     * @example
     * // Count the number of Phases
     * const count = await prisma.phase.count({
     *   where: {
     *     // ... the filter for the Phases we want to count
     *   }
     * })
    **/
    count<T extends PhaseCountArgs>(args?: Prisma.Subset<T, PhaseCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PhaseCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Phase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PhaseAggregateArgs>(args: Prisma.Subset<T, PhaseAggregateArgs>): Prisma.PrismaPromise<GetPhaseAggregateType<T>>;
    /**
     * Group by Phase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseGroupByArgs} args - Group by arguments.
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
    groupBy<T extends PhaseGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PhaseGroupByArgs['orderBy'];
    } : {
        orderBy?: PhaseGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PhaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Phase model
     */
    readonly fields: PhaseFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Phase.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PhaseClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    bracket_slots<T extends Prisma.Phase$bracket_slotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Phase$bracket_slotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    season<T extends Prisma.SeasonDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonDefaultArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    groups<T extends Prisma.Phase$groupsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Phase$groupsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matches<T extends Prisma.Phase$matchesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Phase$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Phase model
 */
export interface PhaseFieldRefs {
    readonly id: Prisma.FieldRef<"Phase", 'Int'>;
    readonly season_id: Prisma.FieldRef<"Phase", 'Int'>;
    readonly name: Prisma.FieldRef<"Phase", 'String'>;
    readonly type: Prisma.FieldRef<"Phase", 'PhaseType'>;
    readonly format: Prisma.FieldRef<"Phase", 'PhaseFormat'>;
    readonly order: Prisma.FieldRef<"Phase", 'Int'>;
    readonly start_date: Prisma.FieldRef<"Phase", 'DateTime'>;
    readonly end_date: Prisma.FieldRef<"Phase", 'DateTime'>;
    readonly min_rest_days_per_team: Prisma.FieldRef<"Phase", 'Int'>;
    readonly is_active: Prisma.FieldRef<"Phase", 'Boolean'>;
    readonly legs: Prisma.FieldRef<"Phase", 'Int'>;
    readonly teams_per_group: Prisma.FieldRef<"Phase", 'Int'>;
    readonly status: Prisma.FieldRef<"Phase", 'PhaseStatus'>;
    readonly created_at: Prisma.FieldRef<"Phase", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Phase", 'DateTime'>;
}
/**
 * Phase findUnique
 */
export type PhaseFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
    /**
     * Filter, which Phase to fetch.
     */
    where: Prisma.PhaseWhereUniqueInput;
};
/**
 * Phase findUniqueOrThrow
 */
export type PhaseFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
    /**
     * Filter, which Phase to fetch.
     */
    where: Prisma.PhaseWhereUniqueInput;
};
/**
 * Phase findFirst
 */
export type PhaseFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
    /**
     * Filter, which Phase to fetch.
     */
    where?: Prisma.PhaseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Phases to fetch.
     */
    orderBy?: Prisma.PhaseOrderByWithRelationInput | Prisma.PhaseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Phases.
     */
    cursor?: Prisma.PhaseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Phases from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Phases.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Phases.
     */
    distinct?: Prisma.PhaseScalarFieldEnum | Prisma.PhaseScalarFieldEnum[];
};
/**
 * Phase findFirstOrThrow
 */
export type PhaseFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
    /**
     * Filter, which Phase to fetch.
     */
    where?: Prisma.PhaseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Phases to fetch.
     */
    orderBy?: Prisma.PhaseOrderByWithRelationInput | Prisma.PhaseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Phases.
     */
    cursor?: Prisma.PhaseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Phases from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Phases.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Phases.
     */
    distinct?: Prisma.PhaseScalarFieldEnum | Prisma.PhaseScalarFieldEnum[];
};
/**
 * Phase findMany
 */
export type PhaseFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
    /**
     * Filter, which Phases to fetch.
     */
    where?: Prisma.PhaseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Phases to fetch.
     */
    orderBy?: Prisma.PhaseOrderByWithRelationInput | Prisma.PhaseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Phases.
     */
    cursor?: Prisma.PhaseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Phases from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Phases.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Phases.
     */
    distinct?: Prisma.PhaseScalarFieldEnum | Prisma.PhaseScalarFieldEnum[];
};
/**
 * Phase create
 */
export type PhaseCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
    /**
     * The data needed to create a Phase.
     */
    data: Prisma.XOR<Prisma.PhaseCreateInput, Prisma.PhaseUncheckedCreateInput>;
};
/**
 * Phase createMany
 */
export type PhaseCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Phases.
     */
    data: Prisma.PhaseCreateManyInput | Prisma.PhaseCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Phase update
 */
export type PhaseUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
    /**
     * The data needed to update a Phase.
     */
    data: Prisma.XOR<Prisma.PhaseUpdateInput, Prisma.PhaseUncheckedUpdateInput>;
    /**
     * Choose, which Phase to update.
     */
    where: Prisma.PhaseWhereUniqueInput;
};
/**
 * Phase updateMany
 */
export type PhaseUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Phases.
     */
    data: Prisma.XOR<Prisma.PhaseUpdateManyMutationInput, Prisma.PhaseUncheckedUpdateManyInput>;
    /**
     * Filter which Phases to update
     */
    where?: Prisma.PhaseWhereInput;
    /**
     * Limit how many Phases to update.
     */
    limit?: number;
};
/**
 * Phase upsert
 */
export type PhaseUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
    /**
     * The filter to search for the Phase to update in case it exists.
     */
    where: Prisma.PhaseWhereUniqueInput;
    /**
     * In case the Phase found by the `where` argument doesn't exist, create a new Phase with this data.
     */
    create: Prisma.XOR<Prisma.PhaseCreateInput, Prisma.PhaseUncheckedCreateInput>;
    /**
     * In case the Phase was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PhaseUpdateInput, Prisma.PhaseUncheckedUpdateInput>;
};
/**
 * Phase delete
 */
export type PhaseDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
    /**
     * Filter which Phase to delete.
     */
    where: Prisma.PhaseWhereUniqueInput;
};
/**
 * Phase deleteMany
 */
export type PhaseDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Phases to delete
     */
    where?: Prisma.PhaseWhereInput;
    /**
     * Limit how many Phases to delete.
     */
    limit?: number;
};
/**
 * Phase.bracket_slots
 */
export type Phase$bracket_slotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BracketSlot
     */
    select?: Prisma.BracketSlotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketSlot
     */
    omit?: Prisma.BracketSlotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BracketSlotInclude<ExtArgs> | null;
    where?: Prisma.BracketSlotWhereInput;
    orderBy?: Prisma.BracketSlotOrderByWithRelationInput | Prisma.BracketSlotOrderByWithRelationInput[];
    cursor?: Prisma.BracketSlotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BracketSlotScalarFieldEnum | Prisma.BracketSlotScalarFieldEnum[];
};
/**
 * Phase.groups
 */
export type Phase$groupsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    orderBy?: Prisma.GroupOrderByWithRelationInput | Prisma.GroupOrderByWithRelationInput[];
    cursor?: Prisma.GroupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.GroupScalarFieldEnum | Prisma.GroupScalarFieldEnum[];
};
/**
 * Phase.matches
 */
export type Phase$matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Phase without action
 */
export type PhaseDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: Prisma.PhaseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Phase
     */
    omit?: Prisma.PhaseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PhaseInclude<ExtArgs> | null;
};
//# sourceMappingURL=Phase.d.ts.map