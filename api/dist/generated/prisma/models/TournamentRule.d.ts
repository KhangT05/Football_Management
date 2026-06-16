import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model TournamentRule
 *
 */
export type TournamentRuleModel = runtime.Types.Result.DefaultSelection<Prisma.$TournamentRulePayload>;
export type AggregateTournamentRule = {
    _count: TournamentRuleCountAggregateOutputType | null;
    _avg: TournamentRuleAvgAggregateOutputType | null;
    _sum: TournamentRuleSumAggregateOutputType | null;
    _min: TournamentRuleMinAggregateOutputType | null;
    _max: TournamentRuleMaxAggregateOutputType | null;
};
export type TournamentRuleAvgAggregateOutputType = {
    id: number | null;
    tournament_id: number | null;
    points_per_win: number | null;
    points_per_draw: number | null;
    points_per_loss: number | null;
    forfeit_score: number | null;
    yellow_cards_suspension: number | null;
    max_players_per_team: number | null;
    min_players_per_team: number | null;
    teams_advance_per_group: number | null;
    user_id: number | null;
};
export type TournamentRuleSumAggregateOutputType = {
    id: number | null;
    tournament_id: number | null;
    points_per_win: number | null;
    points_per_draw: number | null;
    points_per_loss: number | null;
    forfeit_score: number | null;
    yellow_cards_suspension: number | null;
    max_players_per_team: number | null;
    min_players_per_team: number | null;
    teams_advance_per_group: number | null;
    user_id: number | null;
};
export type TournamentRuleMinAggregateOutputType = {
    id: number | null;
    tournament_id: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    is_deleted: boolean | null;
    points_per_win: number | null;
    points_per_draw: number | null;
    points_per_loss: number | null;
    forfeit_score: number | null;
    yellow_cards_suspension: number | null;
    max_players_per_team: number | null;
    min_players_per_team: number | null;
    teams_advance_per_group: number | null;
    user_id: number | null;
};
export type TournamentRuleMaxAggregateOutputType = {
    id: number | null;
    tournament_id: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    is_deleted: boolean | null;
    points_per_win: number | null;
    points_per_draw: number | null;
    points_per_loss: number | null;
    forfeit_score: number | null;
    yellow_cards_suspension: number | null;
    max_players_per_team: number | null;
    min_players_per_team: number | null;
    teams_advance_per_group: number | null;
    user_id: number | null;
};
export type TournamentRuleCountAggregateOutputType = {
    id: number;
    tournament_id: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    is_deleted: number;
    points_per_win: number;
    points_per_draw: number;
    points_per_loss: number;
    forfeit_score: number;
    yellow_cards_suspension: number;
    max_players_per_team: number;
    min_players_per_team: number;
    teams_advance_per_group: number;
    tiebreaker_order: number;
    user_id: number;
    _all: number;
};
export type TournamentRuleAvgAggregateInputType = {
    id?: true;
    tournament_id?: true;
    points_per_win?: true;
    points_per_draw?: true;
    points_per_loss?: true;
    forfeit_score?: true;
    yellow_cards_suspension?: true;
    max_players_per_team?: true;
    min_players_per_team?: true;
    teams_advance_per_group?: true;
    user_id?: true;
};
export type TournamentRuleSumAggregateInputType = {
    id?: true;
    tournament_id?: true;
    points_per_win?: true;
    points_per_draw?: true;
    points_per_loss?: true;
    forfeit_score?: true;
    yellow_cards_suspension?: true;
    max_players_per_team?: true;
    min_players_per_team?: true;
    teams_advance_per_group?: true;
    user_id?: true;
};
export type TournamentRuleMinAggregateInputType = {
    id?: true;
    tournament_id?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    is_deleted?: true;
    points_per_win?: true;
    points_per_draw?: true;
    points_per_loss?: true;
    forfeit_score?: true;
    yellow_cards_suspension?: true;
    max_players_per_team?: true;
    min_players_per_team?: true;
    teams_advance_per_group?: true;
    user_id?: true;
};
export type TournamentRuleMaxAggregateInputType = {
    id?: true;
    tournament_id?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    is_deleted?: true;
    points_per_win?: true;
    points_per_draw?: true;
    points_per_loss?: true;
    forfeit_score?: true;
    yellow_cards_suspension?: true;
    max_players_per_team?: true;
    min_players_per_team?: true;
    teams_advance_per_group?: true;
    user_id?: true;
};
export type TournamentRuleCountAggregateInputType = {
    id?: true;
    tournament_id?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    is_deleted?: true;
    points_per_win?: true;
    points_per_draw?: true;
    points_per_loss?: true;
    forfeit_score?: true;
    yellow_cards_suspension?: true;
    max_players_per_team?: true;
    min_players_per_team?: true;
    teams_advance_per_group?: true;
    tiebreaker_order?: true;
    user_id?: true;
    _all?: true;
};
export type TournamentRuleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TournamentRule to aggregate.
     */
    where?: Prisma.TournamentRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TournamentRules to fetch.
     */
    orderBy?: Prisma.TournamentRuleOrderByWithRelationInput | Prisma.TournamentRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.TournamentRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TournamentRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TournamentRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TournamentRules
    **/
    _count?: true | TournamentRuleCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: TournamentRuleAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: TournamentRuleSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TournamentRuleMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TournamentRuleMaxAggregateInputType;
};
export type GetTournamentRuleAggregateType<T extends TournamentRuleAggregateArgs> = {
    [P in keyof T & keyof AggregateTournamentRule]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTournamentRule[P]> : Prisma.GetScalarType<T[P], AggregateTournamentRule[P]>;
};
export type TournamentRuleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TournamentRuleWhereInput;
    orderBy?: Prisma.TournamentRuleOrderByWithAggregationInput | Prisma.TournamentRuleOrderByWithAggregationInput[];
    by: Prisma.TournamentRuleScalarFieldEnum[] | Prisma.TournamentRuleScalarFieldEnum;
    having?: Prisma.TournamentRuleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TournamentRuleCountAggregateInputType | true;
    _avg?: TournamentRuleAvgAggregateInputType;
    _sum?: TournamentRuleSumAggregateInputType;
    _min?: TournamentRuleMinAggregateInputType;
    _max?: TournamentRuleMaxAggregateInputType;
};
export type TournamentRuleGroupByOutputType = {
    id: number;
    tournament_id: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    is_deleted: boolean;
    points_per_win: number;
    points_per_draw: number;
    points_per_loss: number;
    forfeit_score: number;
    yellow_cards_suspension: number;
    max_players_per_team: number;
    min_players_per_team: number;
    teams_advance_per_group: number;
    tiebreaker_order: runtime.JsonValue;
    user_id: number | null;
    _count: TournamentRuleCountAggregateOutputType | null;
    _avg: TournamentRuleAvgAggregateOutputType | null;
    _sum: TournamentRuleSumAggregateOutputType | null;
    _min: TournamentRuleMinAggregateOutputType | null;
    _max: TournamentRuleMaxAggregateOutputType | null;
};
export type GetTournamentRuleGroupByPayload<T extends TournamentRuleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TournamentRuleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TournamentRuleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TournamentRuleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TournamentRuleGroupByOutputType[P]>;
}>>;
export type TournamentRuleWhereInput = {
    AND?: Prisma.TournamentRuleWhereInput | Prisma.TournamentRuleWhereInput[];
    OR?: Prisma.TournamentRuleWhereInput[];
    NOT?: Prisma.TournamentRuleWhereInput | Prisma.TournamentRuleWhereInput[];
    id?: Prisma.IntFilter<"TournamentRule"> | number;
    tournament_id?: Prisma.IntFilter<"TournamentRule"> | number;
    is_active?: Prisma.BoolFilter<"TournamentRule"> | boolean;
    created_at?: Prisma.DateTimeFilter<"TournamentRule"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"TournamentRule"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"TournamentRule"> | Date | string | null;
    is_deleted?: Prisma.BoolFilter<"TournamentRule"> | boolean;
    points_per_win?: Prisma.IntFilter<"TournamentRule"> | number;
    points_per_draw?: Prisma.IntFilter<"TournamentRule"> | number;
    points_per_loss?: Prisma.IntFilter<"TournamentRule"> | number;
    forfeit_score?: Prisma.IntFilter<"TournamentRule"> | number;
    yellow_cards_suspension?: Prisma.IntFilter<"TournamentRule"> | number;
    max_players_per_team?: Prisma.IntFilter<"TournamentRule"> | number;
    min_players_per_team?: Prisma.IntFilter<"TournamentRule"> | number;
    teams_advance_per_group?: Prisma.IntFilter<"TournamentRule"> | number;
    tiebreaker_order?: Prisma.JsonFilter<"TournamentRule">;
    user_id?: Prisma.IntNullableFilter<"TournamentRule"> | number | null;
    tournament?: Prisma.XOR<Prisma.TournamentScalarRelationFilter, Prisma.TournamentWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type TournamentRuleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    points_per_win?: Prisma.SortOrder;
    points_per_draw?: Prisma.SortOrder;
    points_per_loss?: Prisma.SortOrder;
    forfeit_score?: Prisma.SortOrder;
    yellow_cards_suspension?: Prisma.SortOrder;
    max_players_per_team?: Prisma.SortOrder;
    min_players_per_team?: Prisma.SortOrder;
    teams_advance_per_group?: Prisma.SortOrder;
    tiebreaker_order?: Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    tournament?: Prisma.TournamentOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type TournamentRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    tournament_id?: number;
    AND?: Prisma.TournamentRuleWhereInput | Prisma.TournamentRuleWhereInput[];
    OR?: Prisma.TournamentRuleWhereInput[];
    NOT?: Prisma.TournamentRuleWhereInput | Prisma.TournamentRuleWhereInput[];
    is_active?: Prisma.BoolFilter<"TournamentRule"> | boolean;
    created_at?: Prisma.DateTimeFilter<"TournamentRule"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"TournamentRule"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"TournamentRule"> | Date | string | null;
    is_deleted?: Prisma.BoolFilter<"TournamentRule"> | boolean;
    points_per_win?: Prisma.IntFilter<"TournamentRule"> | number;
    points_per_draw?: Prisma.IntFilter<"TournamentRule"> | number;
    points_per_loss?: Prisma.IntFilter<"TournamentRule"> | number;
    forfeit_score?: Prisma.IntFilter<"TournamentRule"> | number;
    yellow_cards_suspension?: Prisma.IntFilter<"TournamentRule"> | number;
    max_players_per_team?: Prisma.IntFilter<"TournamentRule"> | number;
    min_players_per_team?: Prisma.IntFilter<"TournamentRule"> | number;
    teams_advance_per_group?: Prisma.IntFilter<"TournamentRule"> | number;
    tiebreaker_order?: Prisma.JsonFilter<"TournamentRule">;
    user_id?: Prisma.IntNullableFilter<"TournamentRule"> | number | null;
    tournament?: Prisma.XOR<Prisma.TournamentScalarRelationFilter, Prisma.TournamentWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "tournament_id">;
export type TournamentRuleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    points_per_win?: Prisma.SortOrder;
    points_per_draw?: Prisma.SortOrder;
    points_per_loss?: Prisma.SortOrder;
    forfeit_score?: Prisma.SortOrder;
    yellow_cards_suspension?: Prisma.SortOrder;
    max_players_per_team?: Prisma.SortOrder;
    min_players_per_team?: Prisma.SortOrder;
    teams_advance_per_group?: Prisma.SortOrder;
    tiebreaker_order?: Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TournamentRuleCountOrderByAggregateInput;
    _avg?: Prisma.TournamentRuleAvgOrderByAggregateInput;
    _max?: Prisma.TournamentRuleMaxOrderByAggregateInput;
    _min?: Prisma.TournamentRuleMinOrderByAggregateInput;
    _sum?: Prisma.TournamentRuleSumOrderByAggregateInput;
};
export type TournamentRuleScalarWhereWithAggregatesInput = {
    AND?: Prisma.TournamentRuleScalarWhereWithAggregatesInput | Prisma.TournamentRuleScalarWhereWithAggregatesInput[];
    OR?: Prisma.TournamentRuleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TournamentRuleScalarWhereWithAggregatesInput | Prisma.TournamentRuleScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    tournament_id?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    is_active?: Prisma.BoolWithAggregatesFilter<"TournamentRule"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"TournamentRule"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"TournamentRule"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"TournamentRule"> | Date | string | null;
    is_deleted?: Prisma.BoolWithAggregatesFilter<"TournamentRule"> | boolean;
    points_per_win?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    points_per_draw?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    points_per_loss?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    forfeit_score?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    yellow_cards_suspension?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    max_players_per_team?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    min_players_per_team?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    teams_advance_per_group?: Prisma.IntWithAggregatesFilter<"TournamentRule"> | number;
    tiebreaker_order?: Prisma.JsonWithAggregatesFilter<"TournamentRule">;
    user_id?: Prisma.IntNullableWithAggregatesFilter<"TournamentRule"> | number | null;
};
export type TournamentRuleCreateInput = {
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_deleted?: boolean;
    points_per_win?: number;
    points_per_draw?: number;
    points_per_loss?: number;
    forfeit_score?: number;
    yellow_cards_suspension?: number;
    max_players_per_team?: number;
    min_players_per_team?: number;
    teams_advance_per_group?: number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    tournament: Prisma.TournamentCreateNestedOneWithoutTournamentRuleInput;
    user?: Prisma.UserCreateNestedOneWithoutTournamentRulesInput;
};
export type TournamentRuleUncheckedCreateInput = {
    id?: number;
    tournament_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_deleted?: boolean;
    points_per_win?: number;
    points_per_draw?: number;
    points_per_loss?: number;
    forfeit_score?: number;
    yellow_cards_suspension?: number;
    max_players_per_team?: number;
    min_players_per_team?: number;
    teams_advance_per_group?: number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    user_id?: number | null;
};
export type TournamentRuleUpdateInput = {
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    points_per_win?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_draw?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_loss?: Prisma.IntFieldUpdateOperationsInput | number;
    forfeit_score?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_suspension?: Prisma.IntFieldUpdateOperationsInput | number;
    max_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    min_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_advance_per_group?: Prisma.IntFieldUpdateOperationsInput | number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    tournament?: Prisma.TournamentUpdateOneRequiredWithoutTournamentRuleNestedInput;
    user?: Prisma.UserUpdateOneWithoutTournamentRulesNestedInput;
};
export type TournamentRuleUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    points_per_win?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_draw?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_loss?: Prisma.IntFieldUpdateOperationsInput | number;
    forfeit_score?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_suspension?: Prisma.IntFieldUpdateOperationsInput | number;
    max_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    min_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_advance_per_group?: Prisma.IntFieldUpdateOperationsInput | number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TournamentRuleCreateManyInput = {
    id?: number;
    tournament_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_deleted?: boolean;
    points_per_win?: number;
    points_per_draw?: number;
    points_per_loss?: number;
    forfeit_score?: number;
    yellow_cards_suspension?: number;
    max_players_per_team?: number;
    min_players_per_team?: number;
    teams_advance_per_group?: number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    user_id?: number | null;
};
export type TournamentRuleUpdateManyMutationInput = {
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    points_per_win?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_draw?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_loss?: Prisma.IntFieldUpdateOperationsInput | number;
    forfeit_score?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_suspension?: Prisma.IntFieldUpdateOperationsInput | number;
    max_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    min_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_advance_per_group?: Prisma.IntFieldUpdateOperationsInput | number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type TournamentRuleUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    points_per_win?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_draw?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_loss?: Prisma.IntFieldUpdateOperationsInput | number;
    forfeit_score?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_suspension?: Prisma.IntFieldUpdateOperationsInput | number;
    max_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    min_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_advance_per_group?: Prisma.IntFieldUpdateOperationsInput | number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TournamentRuleListRelationFilter = {
    every?: Prisma.TournamentRuleWhereInput;
    some?: Prisma.TournamentRuleWhereInput;
    none?: Prisma.TournamentRuleWhereInput;
};
export type TournamentRuleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TournamentRuleNullableScalarRelationFilter = {
    is?: Prisma.TournamentRuleWhereInput | null;
    isNot?: Prisma.TournamentRuleWhereInput | null;
};
export type TournamentRuleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    points_per_win?: Prisma.SortOrder;
    points_per_draw?: Prisma.SortOrder;
    points_per_loss?: Prisma.SortOrder;
    forfeit_score?: Prisma.SortOrder;
    yellow_cards_suspension?: Prisma.SortOrder;
    max_players_per_team?: Prisma.SortOrder;
    min_players_per_team?: Prisma.SortOrder;
    teams_advance_per_group?: Prisma.SortOrder;
    tiebreaker_order?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TournamentRuleAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    points_per_win?: Prisma.SortOrder;
    points_per_draw?: Prisma.SortOrder;
    points_per_loss?: Prisma.SortOrder;
    forfeit_score?: Prisma.SortOrder;
    yellow_cards_suspension?: Prisma.SortOrder;
    max_players_per_team?: Prisma.SortOrder;
    min_players_per_team?: Prisma.SortOrder;
    teams_advance_per_group?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TournamentRuleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    points_per_win?: Prisma.SortOrder;
    points_per_draw?: Prisma.SortOrder;
    points_per_loss?: Prisma.SortOrder;
    forfeit_score?: Prisma.SortOrder;
    yellow_cards_suspension?: Prisma.SortOrder;
    max_players_per_team?: Prisma.SortOrder;
    min_players_per_team?: Prisma.SortOrder;
    teams_advance_per_group?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TournamentRuleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    points_per_win?: Prisma.SortOrder;
    points_per_draw?: Prisma.SortOrder;
    points_per_loss?: Prisma.SortOrder;
    forfeit_score?: Prisma.SortOrder;
    yellow_cards_suspension?: Prisma.SortOrder;
    max_players_per_team?: Prisma.SortOrder;
    min_players_per_team?: Prisma.SortOrder;
    teams_advance_per_group?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TournamentRuleSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tournament_id?: Prisma.SortOrder;
    points_per_win?: Prisma.SortOrder;
    points_per_draw?: Prisma.SortOrder;
    points_per_loss?: Prisma.SortOrder;
    forfeit_score?: Prisma.SortOrder;
    yellow_cards_suspension?: Prisma.SortOrder;
    max_players_per_team?: Prisma.SortOrder;
    min_players_per_team?: Prisma.SortOrder;
    teams_advance_per_group?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TournamentRuleCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TournamentRuleCreateWithoutUserInput, Prisma.TournamentRuleUncheckedCreateWithoutUserInput> | Prisma.TournamentRuleCreateWithoutUserInput[] | Prisma.TournamentRuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TournamentRuleCreateOrConnectWithoutUserInput | Prisma.TournamentRuleCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TournamentRuleCreateManyUserInputEnvelope;
    connect?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
};
export type TournamentRuleUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TournamentRuleCreateWithoutUserInput, Prisma.TournamentRuleUncheckedCreateWithoutUserInput> | Prisma.TournamentRuleCreateWithoutUserInput[] | Prisma.TournamentRuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TournamentRuleCreateOrConnectWithoutUserInput | Prisma.TournamentRuleCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TournamentRuleCreateManyUserInputEnvelope;
    connect?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
};
export type TournamentRuleUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TournamentRuleCreateWithoutUserInput, Prisma.TournamentRuleUncheckedCreateWithoutUserInput> | Prisma.TournamentRuleCreateWithoutUserInput[] | Prisma.TournamentRuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TournamentRuleCreateOrConnectWithoutUserInput | Prisma.TournamentRuleCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TournamentRuleUpsertWithWhereUniqueWithoutUserInput | Prisma.TournamentRuleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TournamentRuleCreateManyUserInputEnvelope;
    set?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
    disconnect?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
    delete?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
    connect?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
    update?: Prisma.TournamentRuleUpdateWithWhereUniqueWithoutUserInput | Prisma.TournamentRuleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TournamentRuleUpdateManyWithWhereWithoutUserInput | Prisma.TournamentRuleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TournamentRuleScalarWhereInput | Prisma.TournamentRuleScalarWhereInput[];
};
export type TournamentRuleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TournamentRuleCreateWithoutUserInput, Prisma.TournamentRuleUncheckedCreateWithoutUserInput> | Prisma.TournamentRuleCreateWithoutUserInput[] | Prisma.TournamentRuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TournamentRuleCreateOrConnectWithoutUserInput | Prisma.TournamentRuleCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TournamentRuleUpsertWithWhereUniqueWithoutUserInput | Prisma.TournamentRuleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TournamentRuleCreateManyUserInputEnvelope;
    set?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
    disconnect?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
    delete?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
    connect?: Prisma.TournamentRuleWhereUniqueInput | Prisma.TournamentRuleWhereUniqueInput[];
    update?: Prisma.TournamentRuleUpdateWithWhereUniqueWithoutUserInput | Prisma.TournamentRuleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TournamentRuleUpdateManyWithWhereWithoutUserInput | Prisma.TournamentRuleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TournamentRuleScalarWhereInput | Prisma.TournamentRuleScalarWhereInput[];
};
export type TournamentRuleCreateNestedOneWithoutTournamentInput = {
    create?: Prisma.XOR<Prisma.TournamentRuleCreateWithoutTournamentInput, Prisma.TournamentRuleUncheckedCreateWithoutTournamentInput>;
    connectOrCreate?: Prisma.TournamentRuleCreateOrConnectWithoutTournamentInput;
    connect?: Prisma.TournamentRuleWhereUniqueInput;
};
export type TournamentRuleUncheckedCreateNestedOneWithoutTournamentInput = {
    create?: Prisma.XOR<Prisma.TournamentRuleCreateWithoutTournamentInput, Prisma.TournamentRuleUncheckedCreateWithoutTournamentInput>;
    connectOrCreate?: Prisma.TournamentRuleCreateOrConnectWithoutTournamentInput;
    connect?: Prisma.TournamentRuleWhereUniqueInput;
};
export type TournamentRuleUpdateOneWithoutTournamentNestedInput = {
    create?: Prisma.XOR<Prisma.TournamentRuleCreateWithoutTournamentInput, Prisma.TournamentRuleUncheckedCreateWithoutTournamentInput>;
    connectOrCreate?: Prisma.TournamentRuleCreateOrConnectWithoutTournamentInput;
    upsert?: Prisma.TournamentRuleUpsertWithoutTournamentInput;
    disconnect?: Prisma.TournamentRuleWhereInput | boolean;
    delete?: Prisma.TournamentRuleWhereInput | boolean;
    connect?: Prisma.TournamentRuleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TournamentRuleUpdateToOneWithWhereWithoutTournamentInput, Prisma.TournamentRuleUpdateWithoutTournamentInput>, Prisma.TournamentRuleUncheckedUpdateWithoutTournamentInput>;
};
export type TournamentRuleUncheckedUpdateOneWithoutTournamentNestedInput = {
    create?: Prisma.XOR<Prisma.TournamentRuleCreateWithoutTournamentInput, Prisma.TournamentRuleUncheckedCreateWithoutTournamentInput>;
    connectOrCreate?: Prisma.TournamentRuleCreateOrConnectWithoutTournamentInput;
    upsert?: Prisma.TournamentRuleUpsertWithoutTournamentInput;
    disconnect?: Prisma.TournamentRuleWhereInput | boolean;
    delete?: Prisma.TournamentRuleWhereInput | boolean;
    connect?: Prisma.TournamentRuleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TournamentRuleUpdateToOneWithWhereWithoutTournamentInput, Prisma.TournamentRuleUpdateWithoutTournamentInput>, Prisma.TournamentRuleUncheckedUpdateWithoutTournamentInput>;
};
export type TournamentRuleCreateWithoutUserInput = {
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_deleted?: boolean;
    points_per_win?: number;
    points_per_draw?: number;
    points_per_loss?: number;
    forfeit_score?: number;
    yellow_cards_suspension?: number;
    max_players_per_team?: number;
    min_players_per_team?: number;
    teams_advance_per_group?: number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    tournament: Prisma.TournamentCreateNestedOneWithoutTournamentRuleInput;
};
export type TournamentRuleUncheckedCreateWithoutUserInput = {
    id?: number;
    tournament_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_deleted?: boolean;
    points_per_win?: number;
    points_per_draw?: number;
    points_per_loss?: number;
    forfeit_score?: number;
    yellow_cards_suspension?: number;
    max_players_per_team?: number;
    min_players_per_team?: number;
    teams_advance_per_group?: number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type TournamentRuleCreateOrConnectWithoutUserInput = {
    where: Prisma.TournamentRuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.TournamentRuleCreateWithoutUserInput, Prisma.TournamentRuleUncheckedCreateWithoutUserInput>;
};
export type TournamentRuleCreateManyUserInputEnvelope = {
    data: Prisma.TournamentRuleCreateManyUserInput | Prisma.TournamentRuleCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TournamentRuleUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TournamentRuleWhereUniqueInput;
    update: Prisma.XOR<Prisma.TournamentRuleUpdateWithoutUserInput, Prisma.TournamentRuleUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TournamentRuleCreateWithoutUserInput, Prisma.TournamentRuleUncheckedCreateWithoutUserInput>;
};
export type TournamentRuleUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TournamentRuleWhereUniqueInput;
    data: Prisma.XOR<Prisma.TournamentRuleUpdateWithoutUserInput, Prisma.TournamentRuleUncheckedUpdateWithoutUserInput>;
};
export type TournamentRuleUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TournamentRuleScalarWhereInput;
    data: Prisma.XOR<Prisma.TournamentRuleUpdateManyMutationInput, Prisma.TournamentRuleUncheckedUpdateManyWithoutUserInput>;
};
export type TournamentRuleScalarWhereInput = {
    AND?: Prisma.TournamentRuleScalarWhereInput | Prisma.TournamentRuleScalarWhereInput[];
    OR?: Prisma.TournamentRuleScalarWhereInput[];
    NOT?: Prisma.TournamentRuleScalarWhereInput | Prisma.TournamentRuleScalarWhereInput[];
    id?: Prisma.IntFilter<"TournamentRule"> | number;
    tournament_id?: Prisma.IntFilter<"TournamentRule"> | number;
    is_active?: Prisma.BoolFilter<"TournamentRule"> | boolean;
    created_at?: Prisma.DateTimeFilter<"TournamentRule"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"TournamentRule"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"TournamentRule"> | Date | string | null;
    is_deleted?: Prisma.BoolFilter<"TournamentRule"> | boolean;
    points_per_win?: Prisma.IntFilter<"TournamentRule"> | number;
    points_per_draw?: Prisma.IntFilter<"TournamentRule"> | number;
    points_per_loss?: Prisma.IntFilter<"TournamentRule"> | number;
    forfeit_score?: Prisma.IntFilter<"TournamentRule"> | number;
    yellow_cards_suspension?: Prisma.IntFilter<"TournamentRule"> | number;
    max_players_per_team?: Prisma.IntFilter<"TournamentRule"> | number;
    min_players_per_team?: Prisma.IntFilter<"TournamentRule"> | number;
    teams_advance_per_group?: Prisma.IntFilter<"TournamentRule"> | number;
    tiebreaker_order?: Prisma.JsonFilter<"TournamentRule">;
    user_id?: Prisma.IntNullableFilter<"TournamentRule"> | number | null;
};
export type TournamentRuleCreateWithoutTournamentInput = {
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_deleted?: boolean;
    points_per_win?: number;
    points_per_draw?: number;
    points_per_loss?: number;
    forfeit_score?: number;
    yellow_cards_suspension?: number;
    max_players_per_team?: number;
    min_players_per_team?: number;
    teams_advance_per_group?: number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    user?: Prisma.UserCreateNestedOneWithoutTournamentRulesInput;
};
export type TournamentRuleUncheckedCreateWithoutTournamentInput = {
    id?: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_deleted?: boolean;
    points_per_win?: number;
    points_per_draw?: number;
    points_per_loss?: number;
    forfeit_score?: number;
    yellow_cards_suspension?: number;
    max_players_per_team?: number;
    min_players_per_team?: number;
    teams_advance_per_group?: number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    user_id?: number | null;
};
export type TournamentRuleCreateOrConnectWithoutTournamentInput = {
    where: Prisma.TournamentRuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.TournamentRuleCreateWithoutTournamentInput, Prisma.TournamentRuleUncheckedCreateWithoutTournamentInput>;
};
export type TournamentRuleUpsertWithoutTournamentInput = {
    update: Prisma.XOR<Prisma.TournamentRuleUpdateWithoutTournamentInput, Prisma.TournamentRuleUncheckedUpdateWithoutTournamentInput>;
    create: Prisma.XOR<Prisma.TournamentRuleCreateWithoutTournamentInput, Prisma.TournamentRuleUncheckedCreateWithoutTournamentInput>;
    where?: Prisma.TournamentRuleWhereInput;
};
export type TournamentRuleUpdateToOneWithWhereWithoutTournamentInput = {
    where?: Prisma.TournamentRuleWhereInput;
    data: Prisma.XOR<Prisma.TournamentRuleUpdateWithoutTournamentInput, Prisma.TournamentRuleUncheckedUpdateWithoutTournamentInput>;
};
export type TournamentRuleUpdateWithoutTournamentInput = {
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    points_per_win?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_draw?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_loss?: Prisma.IntFieldUpdateOperationsInput | number;
    forfeit_score?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_suspension?: Prisma.IntFieldUpdateOperationsInput | number;
    max_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    min_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_advance_per_group?: Prisma.IntFieldUpdateOperationsInput | number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    user?: Prisma.UserUpdateOneWithoutTournamentRulesNestedInput;
};
export type TournamentRuleUncheckedUpdateWithoutTournamentInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    points_per_win?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_draw?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_loss?: Prisma.IntFieldUpdateOperationsInput | number;
    forfeit_score?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_suspension?: Prisma.IntFieldUpdateOperationsInput | number;
    max_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    min_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_advance_per_group?: Prisma.IntFieldUpdateOperationsInput | number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TournamentRuleCreateManyUserInput = {
    id?: number;
    tournament_id: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    is_deleted?: boolean;
    points_per_win?: number;
    points_per_draw?: number;
    points_per_loss?: number;
    forfeit_score?: number;
    yellow_cards_suspension?: number;
    max_players_per_team?: number;
    min_players_per_team?: number;
    teams_advance_per_group?: number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type TournamentRuleUpdateWithoutUserInput = {
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    points_per_win?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_draw?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_loss?: Prisma.IntFieldUpdateOperationsInput | number;
    forfeit_score?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_suspension?: Prisma.IntFieldUpdateOperationsInput | number;
    max_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    min_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_advance_per_group?: Prisma.IntFieldUpdateOperationsInput | number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    tournament?: Prisma.TournamentUpdateOneRequiredWithoutTournamentRuleNestedInput;
};
export type TournamentRuleUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    points_per_win?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_draw?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_loss?: Prisma.IntFieldUpdateOperationsInput | number;
    forfeit_score?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_suspension?: Prisma.IntFieldUpdateOperationsInput | number;
    max_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    min_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_advance_per_group?: Prisma.IntFieldUpdateOperationsInput | number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type TournamentRuleUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tournament_id?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    points_per_win?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_draw?: Prisma.IntFieldUpdateOperationsInput | number;
    points_per_loss?: Prisma.IntFieldUpdateOperationsInput | number;
    forfeit_score?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_suspension?: Prisma.IntFieldUpdateOperationsInput | number;
    max_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    min_players_per_team?: Prisma.IntFieldUpdateOperationsInput | number;
    teams_advance_per_group?: Prisma.IntFieldUpdateOperationsInput | number;
    tiebreaker_order?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type TournamentRuleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tournament_id?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    is_deleted?: boolean;
    points_per_win?: boolean;
    points_per_draw?: boolean;
    points_per_loss?: boolean;
    forfeit_score?: boolean;
    yellow_cards_suspension?: boolean;
    max_players_per_team?: boolean;
    min_players_per_team?: boolean;
    teams_advance_per_group?: boolean;
    tiebreaker_order?: boolean;
    user_id?: boolean;
    tournament?: boolean | Prisma.TournamentDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.TournamentRule$userArgs<ExtArgs>;
}, ExtArgs["result"]["tournamentRule"]>;
export type TournamentRuleSelectScalar = {
    id?: boolean;
    tournament_id?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    is_deleted?: boolean;
    points_per_win?: boolean;
    points_per_draw?: boolean;
    points_per_loss?: boolean;
    forfeit_score?: boolean;
    yellow_cards_suspension?: boolean;
    max_players_per_team?: boolean;
    min_players_per_team?: boolean;
    teams_advance_per_group?: boolean;
    tiebreaker_order?: boolean;
    user_id?: boolean;
};
export type TournamentRuleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tournament_id" | "is_active" | "created_at" | "updated_at" | "deleted_at" | "is_deleted" | "points_per_win" | "points_per_draw" | "points_per_loss" | "forfeit_score" | "yellow_cards_suspension" | "max_players_per_team" | "min_players_per_team" | "teams_advance_per_group" | "tiebreaker_order" | "user_id", ExtArgs["result"]["tournamentRule"]>;
export type TournamentRuleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tournament?: boolean | Prisma.TournamentDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.TournamentRule$userArgs<ExtArgs>;
};
export type $TournamentRulePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TournamentRule";
    objects: {
        tournament: Prisma.$TournamentPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        tournament_id: number;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        is_deleted: boolean;
        points_per_win: number;
        points_per_draw: number;
        points_per_loss: number;
        forfeit_score: number;
        yellow_cards_suspension: number;
        max_players_per_team: number;
        min_players_per_team: number;
        teams_advance_per_group: number;
        tiebreaker_order: runtime.JsonValue;
        user_id: number | null;
    }, ExtArgs["result"]["tournamentRule"]>;
    composites: {};
};
export type TournamentRuleGetPayload<S extends boolean | null | undefined | TournamentRuleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload, S>;
export type TournamentRuleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TournamentRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TournamentRuleCountAggregateInputType | true;
};
export interface TournamentRuleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TournamentRule'];
        meta: {
            name: 'TournamentRule';
        };
    };
    /**
     * Find zero or one TournamentRule that matches the filter.
     * @param {TournamentRuleFindUniqueArgs} args - Arguments to find a TournamentRule
     * @example
     * // Get one TournamentRule
     * const tournamentRule = await prisma.tournamentRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TournamentRuleFindUniqueArgs>(args: Prisma.SelectSubset<T, TournamentRuleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TournamentRuleClient<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one TournamentRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TournamentRuleFindUniqueOrThrowArgs} args - Arguments to find a TournamentRule
     * @example
     * // Get one TournamentRule
     * const tournamentRule = await prisma.tournamentRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TournamentRuleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TournamentRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TournamentRuleClient<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TournamentRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentRuleFindFirstArgs} args - Arguments to find a TournamentRule
     * @example
     * // Get one TournamentRule
     * const tournamentRule = await prisma.tournamentRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TournamentRuleFindFirstArgs>(args?: Prisma.SelectSubset<T, TournamentRuleFindFirstArgs<ExtArgs>>): Prisma.Prisma__TournamentRuleClient<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TournamentRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentRuleFindFirstOrThrowArgs} args - Arguments to find a TournamentRule
     * @example
     * // Get one TournamentRule
     * const tournamentRule = await prisma.tournamentRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TournamentRuleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TournamentRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TournamentRuleClient<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more TournamentRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TournamentRules
     * const tournamentRules = await prisma.tournamentRule.findMany()
     *
     * // Get first 10 TournamentRules
     * const tournamentRules = await prisma.tournamentRule.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tournamentRuleWithIdOnly = await prisma.tournamentRule.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TournamentRuleFindManyArgs>(args?: Prisma.SelectSubset<T, TournamentRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a TournamentRule.
     * @param {TournamentRuleCreateArgs} args - Arguments to create a TournamentRule.
     * @example
     * // Create one TournamentRule
     * const TournamentRule = await prisma.tournamentRule.create({
     *   data: {
     *     // ... data to create a TournamentRule
     *   }
     * })
     *
     */
    create<T extends TournamentRuleCreateArgs>(args: Prisma.SelectSubset<T, TournamentRuleCreateArgs<ExtArgs>>): Prisma.Prisma__TournamentRuleClient<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many TournamentRules.
     * @param {TournamentRuleCreateManyArgs} args - Arguments to create many TournamentRules.
     * @example
     * // Create many TournamentRules
     * const tournamentRule = await prisma.tournamentRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TournamentRuleCreateManyArgs>(args?: Prisma.SelectSubset<T, TournamentRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a TournamentRule.
     * @param {TournamentRuleDeleteArgs} args - Arguments to delete one TournamentRule.
     * @example
     * // Delete one TournamentRule
     * const TournamentRule = await prisma.tournamentRule.delete({
     *   where: {
     *     // ... filter to delete one TournamentRule
     *   }
     * })
     *
     */
    delete<T extends TournamentRuleDeleteArgs>(args: Prisma.SelectSubset<T, TournamentRuleDeleteArgs<ExtArgs>>): Prisma.Prisma__TournamentRuleClient<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one TournamentRule.
     * @param {TournamentRuleUpdateArgs} args - Arguments to update one TournamentRule.
     * @example
     * // Update one TournamentRule
     * const tournamentRule = await prisma.tournamentRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TournamentRuleUpdateArgs>(args: Prisma.SelectSubset<T, TournamentRuleUpdateArgs<ExtArgs>>): Prisma.Prisma__TournamentRuleClient<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more TournamentRules.
     * @param {TournamentRuleDeleteManyArgs} args - Arguments to filter TournamentRules to delete.
     * @example
     * // Delete a few TournamentRules
     * const { count } = await prisma.tournamentRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TournamentRuleDeleteManyArgs>(args?: Prisma.SelectSubset<T, TournamentRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more TournamentRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TournamentRules
     * const tournamentRule = await prisma.tournamentRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TournamentRuleUpdateManyArgs>(args: Prisma.SelectSubset<T, TournamentRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one TournamentRule.
     * @param {TournamentRuleUpsertArgs} args - Arguments to update or create a TournamentRule.
     * @example
     * // Update or create a TournamentRule
     * const tournamentRule = await prisma.tournamentRule.upsert({
     *   create: {
     *     // ... data to create a TournamentRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TournamentRule we want to update
     *   }
     * })
     */
    upsert<T extends TournamentRuleUpsertArgs>(args: Prisma.SelectSubset<T, TournamentRuleUpsertArgs<ExtArgs>>): Prisma.Prisma__TournamentRuleClient<runtime.Types.Result.GetResult<Prisma.$TournamentRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of TournamentRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentRuleCountArgs} args - Arguments to filter TournamentRules to count.
     * @example
     * // Count the number of TournamentRules
     * const count = await prisma.tournamentRule.count({
     *   where: {
     *     // ... the filter for the TournamentRules we want to count
     *   }
     * })
    **/
    count<T extends TournamentRuleCountArgs>(args?: Prisma.Subset<T, TournamentRuleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TournamentRuleCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a TournamentRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TournamentRuleAggregateArgs>(args: Prisma.Subset<T, TournamentRuleAggregateArgs>): Prisma.PrismaPromise<GetTournamentRuleAggregateType<T>>;
    /**
     * Group by TournamentRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentRuleGroupByArgs} args - Group by arguments.
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
    groupBy<T extends TournamentRuleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TournamentRuleGroupByArgs['orderBy'];
    } : {
        orderBy?: TournamentRuleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TournamentRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTournamentRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the TournamentRule model
     */
    readonly fields: TournamentRuleFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for TournamentRule.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__TournamentRuleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tournament<T extends Prisma.TournamentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TournamentDefaultArgs<ExtArgs>>): Prisma.Prisma__TournamentClient<runtime.Types.Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.TournamentRule$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TournamentRule$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the TournamentRule model
 */
export interface TournamentRuleFieldRefs {
    readonly id: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly tournament_id: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly is_active: Prisma.FieldRef<"TournamentRule", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"TournamentRule", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"TournamentRule", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"TournamentRule", 'DateTime'>;
    readonly is_deleted: Prisma.FieldRef<"TournamentRule", 'Boolean'>;
    readonly points_per_win: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly points_per_draw: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly points_per_loss: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly forfeit_score: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly yellow_cards_suspension: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly max_players_per_team: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly min_players_per_team: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly teams_advance_per_group: Prisma.FieldRef<"TournamentRule", 'Int'>;
    readonly tiebreaker_order: Prisma.FieldRef<"TournamentRule", 'Json'>;
    readonly user_id: Prisma.FieldRef<"TournamentRule", 'Int'>;
}
/**
 * TournamentRule findUnique
 */
export type TournamentRuleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    /**
     * Filter, which TournamentRule to fetch.
     */
    where: Prisma.TournamentRuleWhereUniqueInput;
};
/**
 * TournamentRule findUniqueOrThrow
 */
export type TournamentRuleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    /**
     * Filter, which TournamentRule to fetch.
     */
    where: Prisma.TournamentRuleWhereUniqueInput;
};
/**
 * TournamentRule findFirst
 */
export type TournamentRuleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    /**
     * Filter, which TournamentRule to fetch.
     */
    where?: Prisma.TournamentRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TournamentRules to fetch.
     */
    orderBy?: Prisma.TournamentRuleOrderByWithRelationInput | Prisma.TournamentRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TournamentRules.
     */
    cursor?: Prisma.TournamentRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TournamentRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TournamentRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TournamentRules.
     */
    distinct?: Prisma.TournamentRuleScalarFieldEnum | Prisma.TournamentRuleScalarFieldEnum[];
};
/**
 * TournamentRule findFirstOrThrow
 */
export type TournamentRuleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    /**
     * Filter, which TournamentRule to fetch.
     */
    where?: Prisma.TournamentRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TournamentRules to fetch.
     */
    orderBy?: Prisma.TournamentRuleOrderByWithRelationInput | Prisma.TournamentRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TournamentRules.
     */
    cursor?: Prisma.TournamentRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TournamentRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TournamentRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TournamentRules.
     */
    distinct?: Prisma.TournamentRuleScalarFieldEnum | Prisma.TournamentRuleScalarFieldEnum[];
};
/**
 * TournamentRule findMany
 */
export type TournamentRuleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    /**
     * Filter, which TournamentRules to fetch.
     */
    where?: Prisma.TournamentRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TournamentRules to fetch.
     */
    orderBy?: Prisma.TournamentRuleOrderByWithRelationInput | Prisma.TournamentRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TournamentRules.
     */
    cursor?: Prisma.TournamentRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TournamentRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TournamentRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TournamentRules.
     */
    distinct?: Prisma.TournamentRuleScalarFieldEnum | Prisma.TournamentRuleScalarFieldEnum[];
};
/**
 * TournamentRule create
 */
export type TournamentRuleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    /**
     * The data needed to create a TournamentRule.
     */
    data: Prisma.XOR<Prisma.TournamentRuleCreateInput, Prisma.TournamentRuleUncheckedCreateInput>;
};
/**
 * TournamentRule createMany
 */
export type TournamentRuleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many TournamentRules.
     */
    data: Prisma.TournamentRuleCreateManyInput | Prisma.TournamentRuleCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * TournamentRule update
 */
export type TournamentRuleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    /**
     * The data needed to update a TournamentRule.
     */
    data: Prisma.XOR<Prisma.TournamentRuleUpdateInput, Prisma.TournamentRuleUncheckedUpdateInput>;
    /**
     * Choose, which TournamentRule to update.
     */
    where: Prisma.TournamentRuleWhereUniqueInput;
};
/**
 * TournamentRule updateMany
 */
export type TournamentRuleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update TournamentRules.
     */
    data: Prisma.XOR<Prisma.TournamentRuleUpdateManyMutationInput, Prisma.TournamentRuleUncheckedUpdateManyInput>;
    /**
     * Filter which TournamentRules to update
     */
    where?: Prisma.TournamentRuleWhereInput;
    /**
     * Limit how many TournamentRules to update.
     */
    limit?: number;
};
/**
 * TournamentRule upsert
 */
export type TournamentRuleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    /**
     * The filter to search for the TournamentRule to update in case it exists.
     */
    where: Prisma.TournamentRuleWhereUniqueInput;
    /**
     * In case the TournamentRule found by the `where` argument doesn't exist, create a new TournamentRule with this data.
     */
    create: Prisma.XOR<Prisma.TournamentRuleCreateInput, Prisma.TournamentRuleUncheckedCreateInput>;
    /**
     * In case the TournamentRule was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.TournamentRuleUpdateInput, Prisma.TournamentRuleUncheckedUpdateInput>;
};
/**
 * TournamentRule delete
 */
export type TournamentRuleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
    /**
     * Filter which TournamentRule to delete.
     */
    where: Prisma.TournamentRuleWhereUniqueInput;
};
/**
 * TournamentRule deleteMany
 */
export type TournamentRuleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TournamentRules to delete
     */
    where?: Prisma.TournamentRuleWhereInput;
    /**
     * Limit how many TournamentRules to delete.
     */
    limit?: number;
};
/**
 * TournamentRule.user
 */
export type TournamentRule$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * TournamentRule without action
 */
export type TournamentRuleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentRule
     */
    select?: Prisma.TournamentRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TournamentRule
     */
    omit?: Prisma.TournamentRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TournamentRuleInclude<ExtArgs> | null;
};
//# sourceMappingURL=TournamentRule.d.ts.map