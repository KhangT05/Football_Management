import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Season
 *
 */
export type SeasonModel = runtime.Types.Result.DefaultSelection<Prisma.$SeasonPayload>;
export type AggregateSeason = {
    _count: SeasonCountAggregateOutputType | null;
    _avg: SeasonAvgAggregateOutputType | null;
    _sum: SeasonSumAggregateOutputType | null;
    _min: SeasonMinAggregateOutputType | null;
    _max: SeasonMaxAggregateOutputType | null;
};
export type SeasonAvgAggregateOutputType = {
    id: number | null;
    max_teams: number | null;
    registration_fee: runtime.Decimal | null;
    tournament_id: number | null;
    user_id: number | null;
};
export type SeasonSumAggregateOutputType = {
    id: number | null;
    max_teams: number | null;
    registration_fee: runtime.Decimal | null;
    tournament_id: number | null;
    user_id: number | null;
};
export type SeasonMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    description: string | null;
    status: $Enums.SeasonStatus | null;
    start_date: Date | null;
    end_date: Date | null;
    registration_deadline: Date | null;
    max_teams: number | null;
    is_registration_open: boolean | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    registration_fee: runtime.Decimal | null;
    tournament_id: number | null;
    user_id: number | null;
};
export type SeasonMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    description: string | null;
    status: $Enums.SeasonStatus | null;
    start_date: Date | null;
    end_date: Date | null;
    registration_deadline: Date | null;
    max_teams: number | null;
    is_registration_open: boolean | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    registration_fee: runtime.Decimal | null;
    tournament_id: number | null;
    user_id: number | null;
};
export type SeasonCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    status: number;
    start_date: number;
    end_date: number;
    registration_deadline: number;
    max_teams: number;
    is_registration_open: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    registration_fee: number;
    tournament_id: number;
    user_id: number;
    _all: number;
};
export type SeasonAvgAggregateInputType = {
    id?: true;
    max_teams?: true;
    registration_fee?: true;
    tournament_id?: true;
    user_id?: true;
};
export type SeasonSumAggregateInputType = {
    id?: true;
    max_teams?: true;
    registration_fee?: true;
    tournament_id?: true;
    user_id?: true;
};
export type SeasonMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    status?: true;
    start_date?: true;
    end_date?: true;
    registration_deadline?: true;
    max_teams?: true;
    is_registration_open?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    registration_fee?: true;
    tournament_id?: true;
    user_id?: true;
};
export type SeasonMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    status?: true;
    start_date?: true;
    end_date?: true;
    registration_deadline?: true;
    max_teams?: true;
    is_registration_open?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    registration_fee?: true;
    tournament_id?: true;
    user_id?: true;
};
export type SeasonCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    status?: true;
    start_date?: true;
    end_date?: true;
    registration_deadline?: true;
    max_teams?: true;
    is_registration_open?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    registration_fee?: true;
    tournament_id?: true;
    user_id?: true;
    _all?: true;
};
export type SeasonAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Season to aggregate.
     */
    where?: Prisma.SeasonWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Seasons to fetch.
     */
    orderBy?: Prisma.SeasonOrderByWithRelationInput | Prisma.SeasonOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.SeasonWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Seasons from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Seasons.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Seasons
    **/
    _count?: true | SeasonCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: SeasonAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: SeasonSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SeasonMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SeasonMaxAggregateInputType;
};
export type GetSeasonAggregateType<T extends SeasonAggregateArgs> = {
    [P in keyof T & keyof AggregateSeason]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSeason[P]> : Prisma.GetScalarType<T[P], AggregateSeason[P]>;
};
export type SeasonGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonWhereInput;
    orderBy?: Prisma.SeasonOrderByWithAggregationInput | Prisma.SeasonOrderByWithAggregationInput[];
    by: Prisma.SeasonScalarFieldEnum[] | Prisma.SeasonScalarFieldEnum;
    having?: Prisma.SeasonScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SeasonCountAggregateInputType | true;
    _avg?: SeasonAvgAggregateInputType;
    _sum?: SeasonSumAggregateInputType;
    _min?: SeasonMinAggregateInputType;
    _max?: SeasonMaxAggregateInputType;
};
export type SeasonGroupByOutputType = {
    id: number;
    name: string;
    description: string | null;
    status: $Enums.SeasonStatus;
    start_date: Date | null;
    end_date: Date | null;
    registration_deadline: Date | null;
    max_teams: number;
    is_registration_open: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    registration_fee: runtime.Decimal;
    tournament_id: number;
    user_id: number | null;
    _count: SeasonCountAggregateOutputType | null;
    _avg: SeasonAvgAggregateOutputType | null;
    _sum: SeasonSumAggregateOutputType | null;
    _min: SeasonMinAggregateOutputType | null;
    _max: SeasonMaxAggregateOutputType | null;
};
export type GetSeasonGroupByPayload<T extends SeasonGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SeasonGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SeasonGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SeasonGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SeasonGroupByOutputType[P]>;
}>>;
export type SeasonWhereInput = {
    AND?: Prisma.SeasonWhereInput | Prisma.SeasonWhereInput[];
    OR?: Prisma.SeasonWhereInput[];
    NOT?: Prisma.SeasonWhereInput | Prisma.SeasonWhereInput[];
    id?: Prisma.IntFilter<"Season"> | number;
    name?: Prisma.StringFilter<"Season"> | string;
    description?: Prisma.StringNullableFilter<"Season"> | string | null;
    status?: Prisma.EnumSeasonStatusFilter<"Season"> | $Enums.SeasonStatus;
    start_date?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    registration_deadline?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    max_teams?: Prisma.IntFilter<"Season"> | number;
    is_registration_open?: Prisma.BoolFilter<"Season"> | boolean;
    is_active?: Prisma.BoolFilter<"Season"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Season"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    registration_fee?: Prisma.DecimalFilter<"Season"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFilter<"Season"> | number;
    user_id?: Prisma.IntNullableFilter<"Season"> | number | null;
    tournament?: Prisma.XOR<Prisma.TournamentScalarRelationFilter, Prisma.TournamentWhereInput>;
    phases?: Prisma.PhaseListRelationFilter;
    season_teams?: Prisma.SeasonTeamListRelationFilter;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    playerStatistics?: Prisma.PlayerStatisticListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
    matches?: Prisma.MatchListRelationFilter;
};
export type SeasonOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    start_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    registration_deadline?: Prisma.SortOrderInput | Prisma.SortOrder;
    max_teams?: Prisma.SortOrder;
    is_registration_open?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    registration_fee?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    tournament?: Prisma.TournamentOrderByWithRelationInput;
    phases?: Prisma.PhaseOrderByRelationAggregateInput;
    season_teams?: Prisma.SeasonTeamOrderByRelationAggregateInput;
    user?: Prisma.UserOrderByWithRelationInput;
    playerStatistics?: Prisma.PlayerStatisticOrderByRelationAggregateInput;
    notifications?: Prisma.NotificationOrderByRelationAggregateInput;
    matches?: Prisma.MatchOrderByRelationAggregateInput;
    _relevance?: Prisma.SeasonOrderByRelevanceInput;
};
export type SeasonWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name?: string;
    AND?: Prisma.SeasonWhereInput | Prisma.SeasonWhereInput[];
    OR?: Prisma.SeasonWhereInput[];
    NOT?: Prisma.SeasonWhereInput | Prisma.SeasonWhereInput[];
    description?: Prisma.StringNullableFilter<"Season"> | string | null;
    status?: Prisma.EnumSeasonStatusFilter<"Season"> | $Enums.SeasonStatus;
    start_date?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    registration_deadline?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    max_teams?: Prisma.IntFilter<"Season"> | number;
    is_registration_open?: Prisma.BoolFilter<"Season"> | boolean;
    is_active?: Prisma.BoolFilter<"Season"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Season"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    registration_fee?: Prisma.DecimalFilter<"Season"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFilter<"Season"> | number;
    user_id?: Prisma.IntNullableFilter<"Season"> | number | null;
    tournament?: Prisma.XOR<Prisma.TournamentScalarRelationFilter, Prisma.TournamentWhereInput>;
    phases?: Prisma.PhaseListRelationFilter;
    season_teams?: Prisma.SeasonTeamListRelationFilter;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    playerStatistics?: Prisma.PlayerStatisticListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
    matches?: Prisma.MatchListRelationFilter;
}, "id" | "name">;
export type SeasonOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    start_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    registration_deadline?: Prisma.SortOrderInput | Prisma.SortOrder;
    max_teams?: Prisma.SortOrder;
    is_registration_open?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    registration_fee?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.SeasonCountOrderByAggregateInput;
    _avg?: Prisma.SeasonAvgOrderByAggregateInput;
    _max?: Prisma.SeasonMaxOrderByAggregateInput;
    _min?: Prisma.SeasonMinOrderByAggregateInput;
    _sum?: Prisma.SeasonSumOrderByAggregateInput;
};
export type SeasonScalarWhereWithAggregatesInput = {
    AND?: Prisma.SeasonScalarWhereWithAggregatesInput | Prisma.SeasonScalarWhereWithAggregatesInput[];
    OR?: Prisma.SeasonScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SeasonScalarWhereWithAggregatesInput | Prisma.SeasonScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Season"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Season"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Season"> | string | null;
    status?: Prisma.EnumSeasonStatusWithAggregatesFilter<"Season"> | $Enums.SeasonStatus;
    start_date?: Prisma.DateTimeNullableWithAggregatesFilter<"Season"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableWithAggregatesFilter<"Season"> | Date | string | null;
    registration_deadline?: Prisma.DateTimeNullableWithAggregatesFilter<"Season"> | Date | string | null;
    max_teams?: Prisma.IntWithAggregatesFilter<"Season"> | number;
    is_registration_open?: Prisma.BoolWithAggregatesFilter<"Season"> | boolean;
    is_active?: Prisma.BoolWithAggregatesFilter<"Season"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Season"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Season"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Season"> | Date | string | null;
    registration_fee?: Prisma.DecimalWithAggregatesFilter<"Season"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntWithAggregatesFilter<"Season"> | number;
    user_id?: Prisma.IntNullableWithAggregatesFilter<"Season"> | number | null;
};
export type SeasonCreateInput = {
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament: Prisma.TournamentCreateNestedOneWithoutSeasonsInput;
    phases?: Prisma.PhaseCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutSeasonInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonsInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchCreateNestedManyWithoutSeasonInput;
};
export type SeasonUncheckedCreateInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id: number;
    user_id?: number | null;
    phases?: Prisma.PhaseUncheckedCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutSeasonInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutSeasonInput;
};
export type SeasonUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament?: Prisma.TournamentUpdateOneRequiredWithoutSeasonsNestedInput;
    phases?: Prisma.PhaseUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutSeasonNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonsNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    phases?: Prisma.PhaseUncheckedUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutSeasonNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutSeasonNestedInput;
};
export type SeasonCreateManyInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id: number;
    user_id?: number | null;
};
export type SeasonUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SeasonUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type SeasonListRelationFilter = {
    every?: Prisma.SeasonWhereInput;
    some?: Prisma.SeasonWhereInput;
    none?: Prisma.SeasonWhereInput;
};
export type SeasonOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SeasonOrderByRelevanceInput = {
    fields: Prisma.SeasonOrderByRelevanceFieldEnum | Prisma.SeasonOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type SeasonCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    registration_deadline?: Prisma.SortOrder;
    max_teams?: Prisma.SortOrder;
    is_registration_open?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    registration_fee?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    max_teams?: Prisma.SortOrder;
    registration_fee?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    registration_deadline?: Prisma.SortOrder;
    max_teams?: Prisma.SortOrder;
    is_registration_open?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    registration_fee?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    registration_deadline?: Prisma.SortOrder;
    max_teams?: Prisma.SortOrder;
    is_registration_open?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    registration_fee?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    max_teams?: Prisma.SortOrder;
    registration_fee?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type SeasonScalarRelationFilter = {
    is?: Prisma.SeasonWhereInput;
    isNot?: Prisma.SeasonWhereInput;
};
export type SeasonNullableScalarRelationFilter = {
    is?: Prisma.SeasonWhereInput | null;
    isNot?: Prisma.SeasonWhereInput | null;
};
export type SeasonCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutUserInput, Prisma.SeasonUncheckedCreateWithoutUserInput> | Prisma.SeasonCreateWithoutUserInput[] | Prisma.SeasonUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutUserInput | Prisma.SeasonCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SeasonCreateManyUserInputEnvelope;
    connect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
};
export type SeasonUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutUserInput, Prisma.SeasonUncheckedCreateWithoutUserInput> | Prisma.SeasonCreateWithoutUserInput[] | Prisma.SeasonUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutUserInput | Prisma.SeasonCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SeasonCreateManyUserInputEnvelope;
    connect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
};
export type SeasonUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutUserInput, Prisma.SeasonUncheckedCreateWithoutUserInput> | Prisma.SeasonCreateWithoutUserInput[] | Prisma.SeasonUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutUserInput | Prisma.SeasonCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SeasonUpsertWithWhereUniqueWithoutUserInput | Prisma.SeasonUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SeasonCreateManyUserInputEnvelope;
    set?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    disconnect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    delete?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    connect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    update?: Prisma.SeasonUpdateWithWhereUniqueWithoutUserInput | Prisma.SeasonUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SeasonUpdateManyWithWhereWithoutUserInput | Prisma.SeasonUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SeasonScalarWhereInput | Prisma.SeasonScalarWhereInput[];
};
export type SeasonUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutUserInput, Prisma.SeasonUncheckedCreateWithoutUserInput> | Prisma.SeasonCreateWithoutUserInput[] | Prisma.SeasonUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutUserInput | Prisma.SeasonCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SeasonUpsertWithWhereUniqueWithoutUserInput | Prisma.SeasonUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SeasonCreateManyUserInputEnvelope;
    set?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    disconnect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    delete?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    connect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    update?: Prisma.SeasonUpdateWithWhereUniqueWithoutUserInput | Prisma.SeasonUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SeasonUpdateManyWithWhereWithoutUserInput | Prisma.SeasonUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SeasonScalarWhereInput | Prisma.SeasonScalarWhereInput[];
};
export type SeasonCreateNestedManyWithoutTournamentInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutTournamentInput, Prisma.SeasonUncheckedCreateWithoutTournamentInput> | Prisma.SeasonCreateWithoutTournamentInput[] | Prisma.SeasonUncheckedCreateWithoutTournamentInput[];
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutTournamentInput | Prisma.SeasonCreateOrConnectWithoutTournamentInput[];
    createMany?: Prisma.SeasonCreateManyTournamentInputEnvelope;
    connect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
};
export type SeasonUncheckedCreateNestedManyWithoutTournamentInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutTournamentInput, Prisma.SeasonUncheckedCreateWithoutTournamentInput> | Prisma.SeasonCreateWithoutTournamentInput[] | Prisma.SeasonUncheckedCreateWithoutTournamentInput[];
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutTournamentInput | Prisma.SeasonCreateOrConnectWithoutTournamentInput[];
    createMany?: Prisma.SeasonCreateManyTournamentInputEnvelope;
    connect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
};
export type SeasonUpdateManyWithoutTournamentNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutTournamentInput, Prisma.SeasonUncheckedCreateWithoutTournamentInput> | Prisma.SeasonCreateWithoutTournamentInput[] | Prisma.SeasonUncheckedCreateWithoutTournamentInput[];
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutTournamentInput | Prisma.SeasonCreateOrConnectWithoutTournamentInput[];
    upsert?: Prisma.SeasonUpsertWithWhereUniqueWithoutTournamentInput | Prisma.SeasonUpsertWithWhereUniqueWithoutTournamentInput[];
    createMany?: Prisma.SeasonCreateManyTournamentInputEnvelope;
    set?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    disconnect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    delete?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    connect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    update?: Prisma.SeasonUpdateWithWhereUniqueWithoutTournamentInput | Prisma.SeasonUpdateWithWhereUniqueWithoutTournamentInput[];
    updateMany?: Prisma.SeasonUpdateManyWithWhereWithoutTournamentInput | Prisma.SeasonUpdateManyWithWhereWithoutTournamentInput[];
    deleteMany?: Prisma.SeasonScalarWhereInput | Prisma.SeasonScalarWhereInput[];
};
export type SeasonUncheckedUpdateManyWithoutTournamentNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutTournamentInput, Prisma.SeasonUncheckedCreateWithoutTournamentInput> | Prisma.SeasonCreateWithoutTournamentInput[] | Prisma.SeasonUncheckedCreateWithoutTournamentInput[];
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutTournamentInput | Prisma.SeasonCreateOrConnectWithoutTournamentInput[];
    upsert?: Prisma.SeasonUpsertWithWhereUniqueWithoutTournamentInput | Prisma.SeasonUpsertWithWhereUniqueWithoutTournamentInput[];
    createMany?: Prisma.SeasonCreateManyTournamentInputEnvelope;
    set?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    disconnect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    delete?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    connect?: Prisma.SeasonWhereUniqueInput | Prisma.SeasonWhereUniqueInput[];
    update?: Prisma.SeasonUpdateWithWhereUniqueWithoutTournamentInput | Prisma.SeasonUpdateWithWhereUniqueWithoutTournamentInput[];
    updateMany?: Prisma.SeasonUpdateManyWithWhereWithoutTournamentInput | Prisma.SeasonUpdateManyWithWhereWithoutTournamentInput[];
    deleteMany?: Prisma.SeasonScalarWhereInput | Prisma.SeasonScalarWhereInput[];
};
export type EnumSeasonStatusFieldUpdateOperationsInput = {
    set?: $Enums.SeasonStatus;
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SeasonCreateNestedOneWithoutPhasesInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutPhasesInput, Prisma.SeasonUncheckedCreateWithoutPhasesInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutPhasesInput;
    connect?: Prisma.SeasonWhereUniqueInput;
};
export type SeasonUpdateOneRequiredWithoutPhasesNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutPhasesInput, Prisma.SeasonUncheckedCreateWithoutPhasesInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutPhasesInput;
    upsert?: Prisma.SeasonUpsertWithoutPhasesInput;
    connect?: Prisma.SeasonWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SeasonUpdateToOneWithWhereWithoutPhasesInput, Prisma.SeasonUpdateWithoutPhasesInput>, Prisma.SeasonUncheckedUpdateWithoutPhasesInput>;
};
export type SeasonCreateNestedOneWithoutSeason_teamsInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutSeason_teamsInput, Prisma.SeasonUncheckedCreateWithoutSeason_teamsInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutSeason_teamsInput;
    connect?: Prisma.SeasonWhereUniqueInput;
};
export type SeasonUpdateOneRequiredWithoutSeason_teamsNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutSeason_teamsInput, Prisma.SeasonUncheckedCreateWithoutSeason_teamsInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutSeason_teamsInput;
    upsert?: Prisma.SeasonUpsertWithoutSeason_teamsInput;
    connect?: Prisma.SeasonWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SeasonUpdateToOneWithWhereWithoutSeason_teamsInput, Prisma.SeasonUpdateWithoutSeason_teamsInput>, Prisma.SeasonUncheckedUpdateWithoutSeason_teamsInput>;
};
export type SeasonCreateNestedOneWithoutMatchesInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutMatchesInput, Prisma.SeasonUncheckedCreateWithoutMatchesInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutMatchesInput;
    connect?: Prisma.SeasonWhereUniqueInput;
};
export type SeasonUpdateOneWithoutMatchesNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutMatchesInput, Prisma.SeasonUncheckedCreateWithoutMatchesInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutMatchesInput;
    upsert?: Prisma.SeasonUpsertWithoutMatchesInput;
    disconnect?: Prisma.SeasonWhereInput | boolean;
    delete?: Prisma.SeasonWhereInput | boolean;
    connect?: Prisma.SeasonWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SeasonUpdateToOneWithWhereWithoutMatchesInput, Prisma.SeasonUpdateWithoutMatchesInput>, Prisma.SeasonUncheckedUpdateWithoutMatchesInput>;
};
export type SeasonCreateNestedOneWithoutPlayerStatisticsInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutPlayerStatisticsInput, Prisma.SeasonUncheckedCreateWithoutPlayerStatisticsInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutPlayerStatisticsInput;
    connect?: Prisma.SeasonWhereUniqueInput;
};
export type SeasonUpdateOneRequiredWithoutPlayerStatisticsNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutPlayerStatisticsInput, Prisma.SeasonUncheckedCreateWithoutPlayerStatisticsInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutPlayerStatisticsInput;
    upsert?: Prisma.SeasonUpsertWithoutPlayerStatisticsInput;
    connect?: Prisma.SeasonWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SeasonUpdateToOneWithWhereWithoutPlayerStatisticsInput, Prisma.SeasonUpdateWithoutPlayerStatisticsInput>, Prisma.SeasonUncheckedUpdateWithoutPlayerStatisticsInput>;
};
export type SeasonCreateNestedOneWithoutNotificationsInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutNotificationsInput, Prisma.SeasonUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutNotificationsInput;
    connect?: Prisma.SeasonWhereUniqueInput;
};
export type SeasonUpdateOneWithoutNotificationsNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonCreateWithoutNotificationsInput, Prisma.SeasonUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.SeasonCreateOrConnectWithoutNotificationsInput;
    upsert?: Prisma.SeasonUpsertWithoutNotificationsInput;
    disconnect?: Prisma.SeasonWhereInput | boolean;
    delete?: Prisma.SeasonWhereInput | boolean;
    connect?: Prisma.SeasonWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SeasonUpdateToOneWithWhereWithoutNotificationsInput, Prisma.SeasonUpdateWithoutNotificationsInput>, Prisma.SeasonUncheckedUpdateWithoutNotificationsInput>;
};
export type SeasonCreateWithoutUserInput = {
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament: Prisma.TournamentCreateNestedOneWithoutSeasonsInput;
    phases?: Prisma.PhaseCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutSeasonInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchCreateNestedManyWithoutSeasonInput;
};
export type SeasonUncheckedCreateWithoutUserInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id: number;
    phases?: Prisma.PhaseUncheckedCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutSeasonInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutSeasonInput;
};
export type SeasonCreateOrConnectWithoutUserInput = {
    where: Prisma.SeasonWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutUserInput, Prisma.SeasonUncheckedCreateWithoutUserInput>;
};
export type SeasonCreateManyUserInputEnvelope = {
    data: Prisma.SeasonCreateManyUserInput | Prisma.SeasonCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SeasonUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SeasonWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonUpdateWithoutUserInput, Prisma.SeasonUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutUserInput, Prisma.SeasonUncheckedCreateWithoutUserInput>;
};
export type SeasonUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SeasonWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonUpdateWithoutUserInput, Prisma.SeasonUncheckedUpdateWithoutUserInput>;
};
export type SeasonUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SeasonScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonUpdateManyMutationInput, Prisma.SeasonUncheckedUpdateManyWithoutUserInput>;
};
export type SeasonScalarWhereInput = {
    AND?: Prisma.SeasonScalarWhereInput | Prisma.SeasonScalarWhereInput[];
    OR?: Prisma.SeasonScalarWhereInput[];
    NOT?: Prisma.SeasonScalarWhereInput | Prisma.SeasonScalarWhereInput[];
    id?: Prisma.IntFilter<"Season"> | number;
    name?: Prisma.StringFilter<"Season"> | string;
    description?: Prisma.StringNullableFilter<"Season"> | string | null;
    status?: Prisma.EnumSeasonStatusFilter<"Season"> | $Enums.SeasonStatus;
    start_date?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    registration_deadline?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    max_teams?: Prisma.IntFilter<"Season"> | number;
    is_registration_open?: Prisma.BoolFilter<"Season"> | boolean;
    is_active?: Prisma.BoolFilter<"Season"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Season"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Season"> | Date | string | null;
    registration_fee?: Prisma.DecimalFilter<"Season"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFilter<"Season"> | number;
    user_id?: Prisma.IntNullableFilter<"Season"> | number | null;
};
export type SeasonCreateWithoutTournamentInput = {
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    phases?: Prisma.PhaseCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutSeasonInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonsInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchCreateNestedManyWithoutSeasonInput;
};
export type SeasonUncheckedCreateWithoutTournamentInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    user_id?: number | null;
    phases?: Prisma.PhaseUncheckedCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutSeasonInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutSeasonInput;
};
export type SeasonCreateOrConnectWithoutTournamentInput = {
    where: Prisma.SeasonWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutTournamentInput, Prisma.SeasonUncheckedCreateWithoutTournamentInput>;
};
export type SeasonCreateManyTournamentInputEnvelope = {
    data: Prisma.SeasonCreateManyTournamentInput | Prisma.SeasonCreateManyTournamentInput[];
    skipDuplicates?: boolean;
};
export type SeasonUpsertWithWhereUniqueWithoutTournamentInput = {
    where: Prisma.SeasonWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonUpdateWithoutTournamentInput, Prisma.SeasonUncheckedUpdateWithoutTournamentInput>;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutTournamentInput, Prisma.SeasonUncheckedCreateWithoutTournamentInput>;
};
export type SeasonUpdateWithWhereUniqueWithoutTournamentInput = {
    where: Prisma.SeasonWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonUpdateWithoutTournamentInput, Prisma.SeasonUncheckedUpdateWithoutTournamentInput>;
};
export type SeasonUpdateManyWithWhereWithoutTournamentInput = {
    where: Prisma.SeasonScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonUpdateManyMutationInput, Prisma.SeasonUncheckedUpdateManyWithoutTournamentInput>;
};
export type SeasonCreateWithoutPhasesInput = {
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament: Prisma.TournamentCreateNestedOneWithoutSeasonsInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutSeasonInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonsInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchCreateNestedManyWithoutSeasonInput;
};
export type SeasonUncheckedCreateWithoutPhasesInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id: number;
    user_id?: number | null;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutSeasonInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutSeasonInput;
};
export type SeasonCreateOrConnectWithoutPhasesInput = {
    where: Prisma.SeasonWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutPhasesInput, Prisma.SeasonUncheckedCreateWithoutPhasesInput>;
};
export type SeasonUpsertWithoutPhasesInput = {
    update: Prisma.XOR<Prisma.SeasonUpdateWithoutPhasesInput, Prisma.SeasonUncheckedUpdateWithoutPhasesInput>;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutPhasesInput, Prisma.SeasonUncheckedCreateWithoutPhasesInput>;
    where?: Prisma.SeasonWhereInput;
};
export type SeasonUpdateToOneWithWhereWithoutPhasesInput = {
    where?: Prisma.SeasonWhereInput;
    data: Prisma.XOR<Prisma.SeasonUpdateWithoutPhasesInput, Prisma.SeasonUncheckedUpdateWithoutPhasesInput>;
};
export type SeasonUpdateWithoutPhasesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament?: Prisma.TournamentUpdateOneRequiredWithoutSeasonsNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutSeasonNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonsNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateWithoutPhasesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutSeasonNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutSeasonNestedInput;
};
export type SeasonCreateWithoutSeason_teamsInput = {
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament: Prisma.TournamentCreateNestedOneWithoutSeasonsInput;
    phases?: Prisma.PhaseCreateNestedManyWithoutSeasonInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonsInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchCreateNestedManyWithoutSeasonInput;
};
export type SeasonUncheckedCreateWithoutSeason_teamsInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id: number;
    user_id?: number | null;
    phases?: Prisma.PhaseUncheckedCreateNestedManyWithoutSeasonInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutSeasonInput;
};
export type SeasonCreateOrConnectWithoutSeason_teamsInput = {
    where: Prisma.SeasonWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutSeason_teamsInput, Prisma.SeasonUncheckedCreateWithoutSeason_teamsInput>;
};
export type SeasonUpsertWithoutSeason_teamsInput = {
    update: Prisma.XOR<Prisma.SeasonUpdateWithoutSeason_teamsInput, Prisma.SeasonUncheckedUpdateWithoutSeason_teamsInput>;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutSeason_teamsInput, Prisma.SeasonUncheckedCreateWithoutSeason_teamsInput>;
    where?: Prisma.SeasonWhereInput;
};
export type SeasonUpdateToOneWithWhereWithoutSeason_teamsInput = {
    where?: Prisma.SeasonWhereInput;
    data: Prisma.XOR<Prisma.SeasonUpdateWithoutSeason_teamsInput, Prisma.SeasonUncheckedUpdateWithoutSeason_teamsInput>;
};
export type SeasonUpdateWithoutSeason_teamsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament?: Prisma.TournamentUpdateOneRequiredWithoutSeasonsNestedInput;
    phases?: Prisma.PhaseUpdateManyWithoutSeasonNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonsNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateWithoutSeason_teamsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    phases?: Prisma.PhaseUncheckedUpdateManyWithoutSeasonNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutSeasonNestedInput;
};
export type SeasonCreateWithoutMatchesInput = {
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament: Prisma.TournamentCreateNestedOneWithoutSeasonsInput;
    phases?: Prisma.PhaseCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutSeasonInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonsInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutSeasonInput;
};
export type SeasonUncheckedCreateWithoutMatchesInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id: number;
    user_id?: number | null;
    phases?: Prisma.PhaseUncheckedCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutSeasonInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutSeasonInput;
};
export type SeasonCreateOrConnectWithoutMatchesInput = {
    where: Prisma.SeasonWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutMatchesInput, Prisma.SeasonUncheckedCreateWithoutMatchesInput>;
};
export type SeasonUpsertWithoutMatchesInput = {
    update: Prisma.XOR<Prisma.SeasonUpdateWithoutMatchesInput, Prisma.SeasonUncheckedUpdateWithoutMatchesInput>;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutMatchesInput, Prisma.SeasonUncheckedCreateWithoutMatchesInput>;
    where?: Prisma.SeasonWhereInput;
};
export type SeasonUpdateToOneWithWhereWithoutMatchesInput = {
    where?: Prisma.SeasonWhereInput;
    data: Prisma.XOR<Prisma.SeasonUpdateWithoutMatchesInput, Prisma.SeasonUncheckedUpdateWithoutMatchesInput>;
};
export type SeasonUpdateWithoutMatchesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament?: Prisma.TournamentUpdateOneRequiredWithoutSeasonsNestedInput;
    phases?: Prisma.PhaseUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutSeasonNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonsNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateWithoutMatchesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    phases?: Prisma.PhaseUncheckedUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutSeasonNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutSeasonNestedInput;
};
export type SeasonCreateWithoutPlayerStatisticsInput = {
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament: Prisma.TournamentCreateNestedOneWithoutSeasonsInput;
    phases?: Prisma.PhaseCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutSeasonInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonsInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchCreateNestedManyWithoutSeasonInput;
};
export type SeasonUncheckedCreateWithoutPlayerStatisticsInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id: number;
    user_id?: number | null;
    phases?: Prisma.PhaseUncheckedCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutSeasonInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutSeasonInput;
};
export type SeasonCreateOrConnectWithoutPlayerStatisticsInput = {
    where: Prisma.SeasonWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutPlayerStatisticsInput, Prisma.SeasonUncheckedCreateWithoutPlayerStatisticsInput>;
};
export type SeasonUpsertWithoutPlayerStatisticsInput = {
    update: Prisma.XOR<Prisma.SeasonUpdateWithoutPlayerStatisticsInput, Prisma.SeasonUncheckedUpdateWithoutPlayerStatisticsInput>;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutPlayerStatisticsInput, Prisma.SeasonUncheckedCreateWithoutPlayerStatisticsInput>;
    where?: Prisma.SeasonWhereInput;
};
export type SeasonUpdateToOneWithWhereWithoutPlayerStatisticsInput = {
    where?: Prisma.SeasonWhereInput;
    data: Prisma.XOR<Prisma.SeasonUpdateWithoutPlayerStatisticsInput, Prisma.SeasonUncheckedUpdateWithoutPlayerStatisticsInput>;
};
export type SeasonUpdateWithoutPlayerStatisticsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament?: Prisma.TournamentUpdateOneRequiredWithoutSeasonsNestedInput;
    phases?: Prisma.PhaseUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutSeasonNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonsNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateWithoutPlayerStatisticsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    phases?: Prisma.PhaseUncheckedUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutSeasonNestedInput;
};
export type SeasonCreateWithoutNotificationsInput = {
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament: Prisma.TournamentCreateNestedOneWithoutSeasonsInput;
    phases?: Prisma.PhaseCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamCreateNestedManyWithoutSeasonInput;
    user?: Prisma.UserCreateNestedOneWithoutSeasonsInput;
    playerStatistics?: Prisma.PlayerStatisticCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchCreateNestedManyWithoutSeasonInput;
};
export type SeasonUncheckedCreateWithoutNotificationsInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id: number;
    user_id?: number | null;
    phases?: Prisma.PhaseUncheckedCreateNestedManyWithoutSeasonInput;
    season_teams?: Prisma.SeasonTeamUncheckedCreateNestedManyWithoutSeasonInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedCreateNestedManyWithoutSeasonInput;
    matches?: Prisma.MatchUncheckedCreateNestedManyWithoutSeasonInput;
};
export type SeasonCreateOrConnectWithoutNotificationsInput = {
    where: Prisma.SeasonWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutNotificationsInput, Prisma.SeasonUncheckedCreateWithoutNotificationsInput>;
};
export type SeasonUpsertWithoutNotificationsInput = {
    update: Prisma.XOR<Prisma.SeasonUpdateWithoutNotificationsInput, Prisma.SeasonUncheckedUpdateWithoutNotificationsInput>;
    create: Prisma.XOR<Prisma.SeasonCreateWithoutNotificationsInput, Prisma.SeasonUncheckedCreateWithoutNotificationsInput>;
    where?: Prisma.SeasonWhereInput;
};
export type SeasonUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: Prisma.SeasonWhereInput;
    data: Prisma.XOR<Prisma.SeasonUpdateWithoutNotificationsInput, Prisma.SeasonUncheckedUpdateWithoutNotificationsInput>;
};
export type SeasonUpdateWithoutNotificationsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament?: Prisma.TournamentUpdateOneRequiredWithoutSeasonsNestedInput;
    phases?: Prisma.PhaseUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutSeasonNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonsNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateWithoutNotificationsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    phases?: Prisma.PhaseUncheckedUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutSeasonNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutSeasonNestedInput;
};
export type SeasonCreateManyUserInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id: number;
};
export type SeasonUpdateWithoutUserInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament?: Prisma.TournamentUpdateOneRequiredWithoutSeasonsNestedInput;
    phases?: Prisma.PhaseUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutSeasonNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phases?: Prisma.PhaseUncheckedUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutSeasonNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SeasonCreateManyTournamentInput = {
    id?: number;
    name: string;
    description?: string | null;
    status?: $Enums.SeasonStatus;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    registration_deadline?: Date | string | null;
    max_teams: number;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    registration_fee?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    user_id?: number | null;
};
export type SeasonUpdateWithoutTournamentInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    phases?: Prisma.PhaseUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUpdateManyWithoutSeasonNestedInput;
    user?: Prisma.UserUpdateOneWithoutSeasonsNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateWithoutTournamentInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    phases?: Prisma.PhaseUncheckedUpdateManyWithoutSeasonNestedInput;
    season_teams?: Prisma.SeasonTeamUncheckedUpdateManyWithoutSeasonNestedInput;
    playerStatistics?: Prisma.PlayerStatisticUncheckedUpdateManyWithoutSeasonNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutSeasonNestedInput;
    matches?: Prisma.MatchUncheckedUpdateManyWithoutSeasonNestedInput;
};
export type SeasonUncheckedUpdateManyWithoutTournamentInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSeasonStatusFieldUpdateOperationsInput | $Enums.SeasonStatus;
    start_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_deadline?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_teams?: Prisma.IntFieldUpdateOperationsInput | number;
    is_registration_open?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    registration_fee?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
/**
 * Count Type SeasonCountOutputType
 */
export type SeasonCountOutputType = {
    phases: number;
    season_teams: number;
    playerStatistics: number;
    notifications: number;
    matches: number;
};
export type SeasonCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    phases?: boolean | SeasonCountOutputTypeCountPhasesArgs;
    season_teams?: boolean | SeasonCountOutputTypeCountSeason_teamsArgs;
    playerStatistics?: boolean | SeasonCountOutputTypeCountPlayerStatisticsArgs;
    notifications?: boolean | SeasonCountOutputTypeCountNotificationsArgs;
    matches?: boolean | SeasonCountOutputTypeCountMatchesArgs;
};
/**
 * SeasonCountOutputType without action
 */
export type SeasonCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonCountOutputType
     */
    select?: Prisma.SeasonCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * SeasonCountOutputType without action
 */
export type SeasonCountOutputTypeCountPhasesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PhaseWhereInput;
};
/**
 * SeasonCountOutputType without action
 */
export type SeasonCountOutputTypeCountSeason_teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonTeamWhereInput;
};
/**
 * SeasonCountOutputType without action
 */
export type SeasonCountOutputTypeCountPlayerStatisticsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlayerStatisticWhereInput;
};
/**
 * SeasonCountOutputType without action
 */
export type SeasonCountOutputTypeCountNotificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
};
/**
 * SeasonCountOutputType without action
 */
export type SeasonCountOutputTypeCountMatchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
};
export type SeasonSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    status?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    registration_deadline?: boolean;
    max_teams?: boolean;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    registration_fee?: boolean;
    tournament_id?: boolean;
    user_id?: boolean;
    tournament?: boolean | Prisma.TournamentDefaultArgs<ExtArgs>;
    phases?: boolean | Prisma.Season$phasesArgs<ExtArgs>;
    season_teams?: boolean | Prisma.Season$season_teamsArgs<ExtArgs>;
    user?: boolean | Prisma.Season$userArgs<ExtArgs>;
    playerStatistics?: boolean | Prisma.Season$playerStatisticsArgs<ExtArgs>;
    notifications?: boolean | Prisma.Season$notificationsArgs<ExtArgs>;
    matches?: boolean | Prisma.Season$matchesArgs<ExtArgs>;
    _count?: boolean | Prisma.SeasonCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["season"]>;
export type SeasonSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    status?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    registration_deadline?: boolean;
    max_teams?: boolean;
    is_registration_open?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    registration_fee?: boolean;
    tournament_id?: boolean;
    user_id?: boolean;
};
export type SeasonOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "description" | "status" | "start_date" | "end_date" | "registration_deadline" | "max_teams" | "is_registration_open" | "is_active" | "created_at" | "updated_at" | "deleted_at" | "registration_fee" | "tournament_id" | "user_id", ExtArgs["result"]["season"]>;
export type SeasonInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tournament?: boolean | Prisma.TournamentDefaultArgs<ExtArgs>;
    phases?: boolean | Prisma.Season$phasesArgs<ExtArgs>;
    season_teams?: boolean | Prisma.Season$season_teamsArgs<ExtArgs>;
    user?: boolean | Prisma.Season$userArgs<ExtArgs>;
    playerStatistics?: boolean | Prisma.Season$playerStatisticsArgs<ExtArgs>;
    notifications?: boolean | Prisma.Season$notificationsArgs<ExtArgs>;
    matches?: boolean | Prisma.Season$matchesArgs<ExtArgs>;
    _count?: boolean | Prisma.SeasonCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $SeasonPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Season";
    objects: {
        tournament: Prisma.$TournamentPayload<ExtArgs>;
        phases: Prisma.$PhasePayload<ExtArgs>[];
        season_teams: Prisma.$SeasonTeamPayload<ExtArgs>[];
        user: Prisma.$UserPayload<ExtArgs> | null;
        playerStatistics: Prisma.$PlayerStatisticPayload<ExtArgs>[];
        notifications: Prisma.$NotificationPayload<ExtArgs>[];
        matches: Prisma.$MatchPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        description: string | null;
        status: $Enums.SeasonStatus;
        start_date: Date | null;
        end_date: Date | null;
        registration_deadline: Date | null;
        max_teams: number;
        is_registration_open: boolean;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        registration_fee: runtime.Decimal;
        tournament_id: number;
        user_id: number | null;
    }, ExtArgs["result"]["season"]>;
    composites: {};
};
export type SeasonGetPayload<S extends boolean | null | undefined | SeasonDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SeasonPayload, S>;
export type SeasonCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SeasonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SeasonCountAggregateInputType | true;
};
export interface SeasonDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Season'];
        meta: {
            name: 'Season';
        };
    };
    /**
     * Find zero or one Season that matches the filter.
     * @param {SeasonFindUniqueArgs} args - Arguments to find a Season
     * @example
     * // Get one Season
     * const season = await prisma.season.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeasonFindUniqueArgs>(args: Prisma.SelectSubset<T, SeasonFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Season that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeasonFindUniqueOrThrowArgs} args - Arguments to find a Season
     * @example
     * // Get one Season
     * const season = await prisma.season.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeasonFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SeasonFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Season that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonFindFirstArgs} args - Arguments to find a Season
     * @example
     * // Get one Season
     * const season = await prisma.season.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeasonFindFirstArgs>(args?: Prisma.SelectSubset<T, SeasonFindFirstArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Season that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonFindFirstOrThrowArgs} args - Arguments to find a Season
     * @example
     * // Get one Season
     * const season = await prisma.season.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeasonFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SeasonFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Seasons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Seasons
     * const seasons = await prisma.season.findMany()
     *
     * // Get first 10 Seasons
     * const seasons = await prisma.season.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const seasonWithIdOnly = await prisma.season.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SeasonFindManyArgs>(args?: Prisma.SelectSubset<T, SeasonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Season.
     * @param {SeasonCreateArgs} args - Arguments to create a Season.
     * @example
     * // Create one Season
     * const Season = await prisma.season.create({
     *   data: {
     *     // ... data to create a Season
     *   }
     * })
     *
     */
    create<T extends SeasonCreateArgs>(args: Prisma.SelectSubset<T, SeasonCreateArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Seasons.
     * @param {SeasonCreateManyArgs} args - Arguments to create many Seasons.
     * @example
     * // Create many Seasons
     * const season = await prisma.season.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SeasonCreateManyArgs>(args?: Prisma.SelectSubset<T, SeasonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Season.
     * @param {SeasonDeleteArgs} args - Arguments to delete one Season.
     * @example
     * // Delete one Season
     * const Season = await prisma.season.delete({
     *   where: {
     *     // ... filter to delete one Season
     *   }
     * })
     *
     */
    delete<T extends SeasonDeleteArgs>(args: Prisma.SelectSubset<T, SeasonDeleteArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Season.
     * @param {SeasonUpdateArgs} args - Arguments to update one Season.
     * @example
     * // Update one Season
     * const season = await prisma.season.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SeasonUpdateArgs>(args: Prisma.SelectSubset<T, SeasonUpdateArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Seasons.
     * @param {SeasonDeleteManyArgs} args - Arguments to filter Seasons to delete.
     * @example
     * // Delete a few Seasons
     * const { count } = await prisma.season.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SeasonDeleteManyArgs>(args?: Prisma.SelectSubset<T, SeasonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Seasons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Seasons
     * const season = await prisma.season.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SeasonUpdateManyArgs>(args: Prisma.SelectSubset<T, SeasonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Season.
     * @param {SeasonUpsertArgs} args - Arguments to update or create a Season.
     * @example
     * // Update or create a Season
     * const season = await prisma.season.upsert({
     *   create: {
     *     // ... data to create a Season
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Season we want to update
     *   }
     * })
     */
    upsert<T extends SeasonUpsertArgs>(args: Prisma.SelectSubset<T, SeasonUpsertArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Seasons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonCountArgs} args - Arguments to filter Seasons to count.
     * @example
     * // Count the number of Seasons
     * const count = await prisma.season.count({
     *   where: {
     *     // ... the filter for the Seasons we want to count
     *   }
     * })
    **/
    count<T extends SeasonCountArgs>(args?: Prisma.Subset<T, SeasonCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SeasonCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Season.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SeasonAggregateArgs>(args: Prisma.Subset<T, SeasonAggregateArgs>): Prisma.PrismaPromise<GetSeasonAggregateType<T>>;
    /**
     * Group by Season.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonGroupByArgs} args - Group by arguments.
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
    groupBy<T extends SeasonGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SeasonGroupByArgs['orderBy'];
    } : {
        orderBy?: SeasonGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SeasonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeasonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Season model
     */
    readonly fields: SeasonFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Season.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__SeasonClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tournament<T extends Prisma.TournamentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TournamentDefaultArgs<ExtArgs>>): Prisma.Prisma__TournamentClient<runtime.Types.Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    phases<T extends Prisma.Season$phasesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Season$phasesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    season_teams<T extends Prisma.Season$season_teamsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Season$season_teamsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonTeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    user<T extends Prisma.Season$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Season$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    playerStatistics<T extends Prisma.Season$playerStatisticsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Season$playerStatisticsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    notifications<T extends Prisma.Season$notificationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Season$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matches<T extends Prisma.Season$matchesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Season$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Season model
 */
export interface SeasonFieldRefs {
    readonly id: Prisma.FieldRef<"Season", 'Int'>;
    readonly name: Prisma.FieldRef<"Season", 'String'>;
    readonly description: Prisma.FieldRef<"Season", 'String'>;
    readonly status: Prisma.FieldRef<"Season", 'SeasonStatus'>;
    readonly start_date: Prisma.FieldRef<"Season", 'DateTime'>;
    readonly end_date: Prisma.FieldRef<"Season", 'DateTime'>;
    readonly registration_deadline: Prisma.FieldRef<"Season", 'DateTime'>;
    readonly max_teams: Prisma.FieldRef<"Season", 'Int'>;
    readonly is_registration_open: Prisma.FieldRef<"Season", 'Boolean'>;
    readonly is_active: Prisma.FieldRef<"Season", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Season", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Season", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"Season", 'DateTime'>;
    readonly registration_fee: Prisma.FieldRef<"Season", 'Decimal'>;
    readonly tournament_id: Prisma.FieldRef<"Season", 'Int'>;
    readonly user_id: Prisma.FieldRef<"Season", 'Int'>;
}
/**
 * Season findUnique
 */
export type SeasonFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Season to fetch.
     */
    where: Prisma.SeasonWhereUniqueInput;
};
/**
 * Season findUniqueOrThrow
 */
export type SeasonFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Season to fetch.
     */
    where: Prisma.SeasonWhereUniqueInput;
};
/**
 * Season findFirst
 */
export type SeasonFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Season to fetch.
     */
    where?: Prisma.SeasonWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Seasons to fetch.
     */
    orderBy?: Prisma.SeasonOrderByWithRelationInput | Prisma.SeasonOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Seasons.
     */
    cursor?: Prisma.SeasonWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Seasons from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Seasons.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Seasons.
     */
    distinct?: Prisma.SeasonScalarFieldEnum | Prisma.SeasonScalarFieldEnum[];
};
/**
 * Season findFirstOrThrow
 */
export type SeasonFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Season to fetch.
     */
    where?: Prisma.SeasonWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Seasons to fetch.
     */
    orderBy?: Prisma.SeasonOrderByWithRelationInput | Prisma.SeasonOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Seasons.
     */
    cursor?: Prisma.SeasonWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Seasons from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Seasons.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Seasons.
     */
    distinct?: Prisma.SeasonScalarFieldEnum | Prisma.SeasonScalarFieldEnum[];
};
/**
 * Season findMany
 */
export type SeasonFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Seasons to fetch.
     */
    where?: Prisma.SeasonWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Seasons to fetch.
     */
    orderBy?: Prisma.SeasonOrderByWithRelationInput | Prisma.SeasonOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Seasons.
     */
    cursor?: Prisma.SeasonWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Seasons from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Seasons.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Seasons.
     */
    distinct?: Prisma.SeasonScalarFieldEnum | Prisma.SeasonScalarFieldEnum[];
};
/**
 * Season create
 */
export type SeasonCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a Season.
     */
    data: Prisma.XOR<Prisma.SeasonCreateInput, Prisma.SeasonUncheckedCreateInput>;
};
/**
 * Season createMany
 */
export type SeasonCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Seasons.
     */
    data: Prisma.SeasonCreateManyInput | Prisma.SeasonCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Season update
 */
export type SeasonUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a Season.
     */
    data: Prisma.XOR<Prisma.SeasonUpdateInput, Prisma.SeasonUncheckedUpdateInput>;
    /**
     * Choose, which Season to update.
     */
    where: Prisma.SeasonWhereUniqueInput;
};
/**
 * Season updateMany
 */
export type SeasonUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Seasons.
     */
    data: Prisma.XOR<Prisma.SeasonUpdateManyMutationInput, Prisma.SeasonUncheckedUpdateManyInput>;
    /**
     * Filter which Seasons to update
     */
    where?: Prisma.SeasonWhereInput;
    /**
     * Limit how many Seasons to update.
     */
    limit?: number;
};
/**
 * Season upsert
 */
export type SeasonUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the Season to update in case it exists.
     */
    where: Prisma.SeasonWhereUniqueInput;
    /**
     * In case the Season found by the `where` argument doesn't exist, create a new Season with this data.
     */
    create: Prisma.XOR<Prisma.SeasonCreateInput, Prisma.SeasonUncheckedCreateInput>;
    /**
     * In case the Season was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.SeasonUpdateInput, Prisma.SeasonUncheckedUpdateInput>;
};
/**
 * Season delete
 */
export type SeasonDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which Season to delete.
     */
    where: Prisma.SeasonWhereUniqueInput;
};
/**
 * Season deleteMany
 */
export type SeasonDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Seasons to delete
     */
    where?: Prisma.SeasonWhereInput;
    /**
     * Limit how many Seasons to delete.
     */
    limit?: number;
};
/**
 * Season.phases
 */
export type Season$phasesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.PhaseWhereInput;
    orderBy?: Prisma.PhaseOrderByWithRelationInput | Prisma.PhaseOrderByWithRelationInput[];
    cursor?: Prisma.PhaseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PhaseScalarFieldEnum | Prisma.PhaseScalarFieldEnum[];
};
/**
 * Season.season_teams
 */
export type Season$season_teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.SeasonTeamWhereInput;
    orderBy?: Prisma.SeasonTeamOrderByWithRelationInput | Prisma.SeasonTeamOrderByWithRelationInput[];
    cursor?: Prisma.SeasonTeamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SeasonTeamScalarFieldEnum | Prisma.SeasonTeamScalarFieldEnum[];
};
/**
 * Season.user
 */
export type Season$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Season.playerStatistics
 */
export type Season$playerStatisticsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Season.notifications
 */
export type Season$notificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
/**
 * Season.matches
 */
export type Season$matchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Season without action
 */
export type SeasonDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=Season.d.ts.map