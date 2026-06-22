import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model BracketSlot
 *
 */
export type BracketSlotModel = runtime.Types.Result.DefaultSelection<Prisma.$BracketSlotPayload>;
export type AggregateBracketSlot = {
    _count: BracketSlotCountAggregateOutputType | null;
    _avg: BracketSlotAvgAggregateOutputType | null;
    _sum: BracketSlotSumAggregateOutputType | null;
    _min: BracketSlotMinAggregateOutputType | null;
    _max: BracketSlotMaxAggregateOutputType | null;
};
export type BracketSlotAvgAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    round: number | null;
    slot_number: number | null;
    match_id: number | null;
    source_a_slot_id: number | null;
    source_b_slot_id: number | null;
    seeded_home_team_id: number | null;
    seeded_away_team_id: number | null;
};
export type BracketSlotSumAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    round: number | null;
    slot_number: number | null;
    match_id: number | null;
    source_a_slot_id: number | null;
    source_b_slot_id: number | null;
    seeded_home_team_id: number | null;
    seeded_away_team_id: number | null;
};
export type BracketSlotMinAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    round: number | null;
    slot_number: number | null;
    match_id: number | null;
    source_a_slot_id: number | null;
    source_b_slot_id: number | null;
    seeded_home_team_id: number | null;
    seeded_away_team_id: number | null;
    is_bye: boolean | null;
};
export type BracketSlotMaxAggregateOutputType = {
    id: number | null;
    phase_id: number | null;
    round: number | null;
    slot_number: number | null;
    match_id: number | null;
    source_a_slot_id: number | null;
    source_b_slot_id: number | null;
    seeded_home_team_id: number | null;
    seeded_away_team_id: number | null;
    is_bye: boolean | null;
};
export type BracketSlotCountAggregateOutputType = {
    id: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id: number;
    source_a_slot_id: number;
    source_b_slot_id: number;
    seeded_home_team_id: number;
    seeded_away_team_id: number;
    is_bye: number;
    _all: number;
};
export type BracketSlotAvgAggregateInputType = {
    id?: true;
    phase_id?: true;
    round?: true;
    slot_number?: true;
    match_id?: true;
    source_a_slot_id?: true;
    source_b_slot_id?: true;
    seeded_home_team_id?: true;
    seeded_away_team_id?: true;
};
export type BracketSlotSumAggregateInputType = {
    id?: true;
    phase_id?: true;
    round?: true;
    slot_number?: true;
    match_id?: true;
    source_a_slot_id?: true;
    source_b_slot_id?: true;
    seeded_home_team_id?: true;
    seeded_away_team_id?: true;
};
export type BracketSlotMinAggregateInputType = {
    id?: true;
    phase_id?: true;
    round?: true;
    slot_number?: true;
    match_id?: true;
    source_a_slot_id?: true;
    source_b_slot_id?: true;
    seeded_home_team_id?: true;
    seeded_away_team_id?: true;
    is_bye?: true;
};
export type BracketSlotMaxAggregateInputType = {
    id?: true;
    phase_id?: true;
    round?: true;
    slot_number?: true;
    match_id?: true;
    source_a_slot_id?: true;
    source_b_slot_id?: true;
    seeded_home_team_id?: true;
    seeded_away_team_id?: true;
    is_bye?: true;
};
export type BracketSlotCountAggregateInputType = {
    id?: true;
    phase_id?: true;
    round?: true;
    slot_number?: true;
    match_id?: true;
    source_a_slot_id?: true;
    source_b_slot_id?: true;
    seeded_home_team_id?: true;
    seeded_away_team_id?: true;
    is_bye?: true;
    _all?: true;
};
export type BracketSlotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which BracketSlot to aggregate.
     */
    where?: Prisma.BracketSlotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BracketSlots to fetch.
     */
    orderBy?: Prisma.BracketSlotOrderByWithRelationInput | Prisma.BracketSlotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.BracketSlotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BracketSlots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BracketSlots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BracketSlots
    **/
    _count?: true | BracketSlotCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: BracketSlotAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: BracketSlotSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: BracketSlotMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: BracketSlotMaxAggregateInputType;
};
export type GetBracketSlotAggregateType<T extends BracketSlotAggregateArgs> = {
    [P in keyof T & keyof AggregateBracketSlot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBracketSlot[P]> : Prisma.GetScalarType<T[P], AggregateBracketSlot[P]>;
};
export type BracketSlotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BracketSlotWhereInput;
    orderBy?: Prisma.BracketSlotOrderByWithAggregationInput | Prisma.BracketSlotOrderByWithAggregationInput[];
    by: Prisma.BracketSlotScalarFieldEnum[] | Prisma.BracketSlotScalarFieldEnum;
    having?: Prisma.BracketSlotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BracketSlotCountAggregateInputType | true;
    _avg?: BracketSlotAvgAggregateInputType;
    _sum?: BracketSlotSumAggregateInputType;
    _min?: BracketSlotMinAggregateInputType;
    _max?: BracketSlotMaxAggregateInputType;
};
export type BracketSlotGroupByOutputType = {
    id: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id: number | null;
    source_a_slot_id: number | null;
    source_b_slot_id: number | null;
    seeded_home_team_id: number | null;
    seeded_away_team_id: number | null;
    is_bye: boolean;
    _count: BracketSlotCountAggregateOutputType | null;
    _avg: BracketSlotAvgAggregateOutputType | null;
    _sum: BracketSlotSumAggregateOutputType | null;
    _min: BracketSlotMinAggregateOutputType | null;
    _max: BracketSlotMaxAggregateOutputType | null;
};
export type GetBracketSlotGroupByPayload<T extends BracketSlotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BracketSlotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BracketSlotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BracketSlotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BracketSlotGroupByOutputType[P]>;
}>>;
export type BracketSlotWhereInput = {
    AND?: Prisma.BracketSlotWhereInput | Prisma.BracketSlotWhereInput[];
    OR?: Prisma.BracketSlotWhereInput[];
    NOT?: Prisma.BracketSlotWhereInput | Prisma.BracketSlotWhereInput[];
    id?: Prisma.IntFilter<"BracketSlot"> | number;
    phase_id?: Prisma.IntFilter<"BracketSlot"> | number;
    round?: Prisma.IntFilter<"BracketSlot"> | number;
    slot_number?: Prisma.IntFilter<"BracketSlot"> | number;
    match_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    source_a_slot_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    source_b_slot_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    seeded_home_team_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    seeded_away_team_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    is_bye?: Prisma.BoolFilter<"BracketSlot"> | boolean;
    phase?: Prisma.XOR<Prisma.PhaseScalarRelationFilter, Prisma.PhaseWhereInput>;
    match?: Prisma.XOR<Prisma.MatchNullableScalarRelationFilter, Prisma.MatchWhereInput> | null;
    source_a?: Prisma.XOR<Prisma.BracketSlotNullableScalarRelationFilter, Prisma.BracketSlotWhereInput> | null;
    source_b?: Prisma.XOR<Prisma.BracketSlotNullableScalarRelationFilter, Prisma.BracketSlotWhereInput> | null;
    fed_as_a?: Prisma.BracketSlotListRelationFilter;
    fed_as_b?: Prisma.BracketSlotListRelationFilter;
};
export type BracketSlotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    slot_number?: Prisma.SortOrder;
    match_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    source_a_slot_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    source_b_slot_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    seeded_home_team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    seeded_away_team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_bye?: Prisma.SortOrder;
    phase?: Prisma.PhaseOrderByWithRelationInput;
    match?: Prisma.MatchOrderByWithRelationInput;
    source_a?: Prisma.BracketSlotOrderByWithRelationInput;
    source_b?: Prisma.BracketSlotOrderByWithRelationInput;
    fed_as_a?: Prisma.BracketSlotOrderByRelationAggregateInput;
    fed_as_b?: Prisma.BracketSlotOrderByRelationAggregateInput;
};
export type BracketSlotWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    match_id?: number;
    phase_id_round_slot_number?: Prisma.BracketSlotPhase_idRoundSlot_numberCompoundUniqueInput;
    AND?: Prisma.BracketSlotWhereInput | Prisma.BracketSlotWhereInput[];
    OR?: Prisma.BracketSlotWhereInput[];
    NOT?: Prisma.BracketSlotWhereInput | Prisma.BracketSlotWhereInput[];
    phase_id?: Prisma.IntFilter<"BracketSlot"> | number;
    round?: Prisma.IntFilter<"BracketSlot"> | number;
    slot_number?: Prisma.IntFilter<"BracketSlot"> | number;
    source_a_slot_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    source_b_slot_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    seeded_home_team_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    seeded_away_team_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    is_bye?: Prisma.BoolFilter<"BracketSlot"> | boolean;
    phase?: Prisma.XOR<Prisma.PhaseScalarRelationFilter, Prisma.PhaseWhereInput>;
    match?: Prisma.XOR<Prisma.MatchNullableScalarRelationFilter, Prisma.MatchWhereInput> | null;
    source_a?: Prisma.XOR<Prisma.BracketSlotNullableScalarRelationFilter, Prisma.BracketSlotWhereInput> | null;
    source_b?: Prisma.XOR<Prisma.BracketSlotNullableScalarRelationFilter, Prisma.BracketSlotWhereInput> | null;
    fed_as_a?: Prisma.BracketSlotListRelationFilter;
    fed_as_b?: Prisma.BracketSlotListRelationFilter;
}, "id" | "match_id" | "phase_id_round_slot_number">;
export type BracketSlotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    slot_number?: Prisma.SortOrder;
    match_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    source_a_slot_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    source_b_slot_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    seeded_home_team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    seeded_away_team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_bye?: Prisma.SortOrder;
    _count?: Prisma.BracketSlotCountOrderByAggregateInput;
    _avg?: Prisma.BracketSlotAvgOrderByAggregateInput;
    _max?: Prisma.BracketSlotMaxOrderByAggregateInput;
    _min?: Prisma.BracketSlotMinOrderByAggregateInput;
    _sum?: Prisma.BracketSlotSumOrderByAggregateInput;
};
export type BracketSlotScalarWhereWithAggregatesInput = {
    AND?: Prisma.BracketSlotScalarWhereWithAggregatesInput | Prisma.BracketSlotScalarWhereWithAggregatesInput[];
    OR?: Prisma.BracketSlotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BracketSlotScalarWhereWithAggregatesInput | Prisma.BracketSlotScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"BracketSlot"> | number;
    phase_id?: Prisma.IntWithAggregatesFilter<"BracketSlot"> | number;
    round?: Prisma.IntWithAggregatesFilter<"BracketSlot"> | number;
    slot_number?: Prisma.IntWithAggregatesFilter<"BracketSlot"> | number;
    match_id?: Prisma.IntNullableWithAggregatesFilter<"BracketSlot"> | number | null;
    source_a_slot_id?: Prisma.IntNullableWithAggregatesFilter<"BracketSlot"> | number | null;
    source_b_slot_id?: Prisma.IntNullableWithAggregatesFilter<"BracketSlot"> | number | null;
    seeded_home_team_id?: Prisma.IntNullableWithAggregatesFilter<"BracketSlot"> | number | null;
    seeded_away_team_id?: Prisma.IntNullableWithAggregatesFilter<"BracketSlot"> | number | null;
    is_bye?: Prisma.BoolWithAggregatesFilter<"BracketSlot"> | boolean;
};
export type BracketSlotCreateInput = {
    round: number;
    slot_number: number;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    phase: Prisma.PhaseCreateNestedOneWithoutBracket_slotsInput;
    match?: Prisma.MatchCreateNestedOneWithoutBracketSlotInput;
    source_a?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_aInput;
    source_b?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_bInput;
    fed_as_a?: Prisma.BracketSlotCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotUncheckedCreateInput = {
    id?: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_a_slot_id?: number | null;
    source_b_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotUpdateInput = {
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutBracket_slotsNestedInput;
    match?: Prisma.MatchUpdateOneWithoutBracketSlotNestedInput;
    source_a?: Prisma.BracketSlotUpdateOneWithoutFed_as_aNestedInput;
    source_b?: Prisma.BracketSlotUpdateOneWithoutFed_as_bNestedInput;
    fed_as_a?: Prisma.BracketSlotUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_a_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_b_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotCreateManyInput = {
    id?: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_a_slot_id?: number | null;
    source_b_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
};
export type BracketSlotUpdateManyMutationInput = {
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type BracketSlotUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_a_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_b_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type BracketSlotListRelationFilter = {
    every?: Prisma.BracketSlotWhereInput;
    some?: Prisma.BracketSlotWhereInput;
    none?: Prisma.BracketSlotWhereInput;
};
export type BracketSlotOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BracketSlotNullableScalarRelationFilter = {
    is?: Prisma.BracketSlotWhereInput | null;
    isNot?: Prisma.BracketSlotWhereInput | null;
};
export type BracketSlotPhase_idRoundSlot_numberCompoundUniqueInput = {
    phase_id: number;
    round: number;
    slot_number: number;
};
export type BracketSlotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    slot_number?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    source_a_slot_id?: Prisma.SortOrder;
    source_b_slot_id?: Prisma.SortOrder;
    seeded_home_team_id?: Prisma.SortOrder;
    seeded_away_team_id?: Prisma.SortOrder;
    is_bye?: Prisma.SortOrder;
};
export type BracketSlotAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    slot_number?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    source_a_slot_id?: Prisma.SortOrder;
    source_b_slot_id?: Prisma.SortOrder;
    seeded_home_team_id?: Prisma.SortOrder;
    seeded_away_team_id?: Prisma.SortOrder;
};
export type BracketSlotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    slot_number?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    source_a_slot_id?: Prisma.SortOrder;
    source_b_slot_id?: Prisma.SortOrder;
    seeded_home_team_id?: Prisma.SortOrder;
    seeded_away_team_id?: Prisma.SortOrder;
    is_bye?: Prisma.SortOrder;
};
export type BracketSlotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    slot_number?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    source_a_slot_id?: Prisma.SortOrder;
    source_b_slot_id?: Prisma.SortOrder;
    seeded_home_team_id?: Prisma.SortOrder;
    seeded_away_team_id?: Prisma.SortOrder;
    is_bye?: Prisma.SortOrder;
};
export type BracketSlotSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    phase_id?: Prisma.SortOrder;
    round?: Prisma.SortOrder;
    slot_number?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    source_a_slot_id?: Prisma.SortOrder;
    source_b_slot_id?: Prisma.SortOrder;
    seeded_home_team_id?: Prisma.SortOrder;
    seeded_away_team_id?: Prisma.SortOrder;
};
export type BracketSlotCreateNestedManyWithoutPhaseInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutPhaseInput, Prisma.BracketSlotUncheckedCreateWithoutPhaseInput> | Prisma.BracketSlotCreateWithoutPhaseInput[] | Prisma.BracketSlotUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutPhaseInput | Prisma.BracketSlotCreateOrConnectWithoutPhaseInput[];
    createMany?: Prisma.BracketSlotCreateManyPhaseInputEnvelope;
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
};
export type BracketSlotUncheckedCreateNestedManyWithoutPhaseInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutPhaseInput, Prisma.BracketSlotUncheckedCreateWithoutPhaseInput> | Prisma.BracketSlotCreateWithoutPhaseInput[] | Prisma.BracketSlotUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutPhaseInput | Prisma.BracketSlotCreateOrConnectWithoutPhaseInput[];
    createMany?: Prisma.BracketSlotCreateManyPhaseInputEnvelope;
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
};
export type BracketSlotUpdateManyWithoutPhaseNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutPhaseInput, Prisma.BracketSlotUncheckedCreateWithoutPhaseInput> | Prisma.BracketSlotCreateWithoutPhaseInput[] | Prisma.BracketSlotUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutPhaseInput | Prisma.BracketSlotCreateOrConnectWithoutPhaseInput[];
    upsert?: Prisma.BracketSlotUpsertWithWhereUniqueWithoutPhaseInput | Prisma.BracketSlotUpsertWithWhereUniqueWithoutPhaseInput[];
    createMany?: Prisma.BracketSlotCreateManyPhaseInputEnvelope;
    set?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    disconnect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    delete?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    update?: Prisma.BracketSlotUpdateWithWhereUniqueWithoutPhaseInput | Prisma.BracketSlotUpdateWithWhereUniqueWithoutPhaseInput[];
    updateMany?: Prisma.BracketSlotUpdateManyWithWhereWithoutPhaseInput | Prisma.BracketSlotUpdateManyWithWhereWithoutPhaseInput[];
    deleteMany?: Prisma.BracketSlotScalarWhereInput | Prisma.BracketSlotScalarWhereInput[];
};
export type BracketSlotUncheckedUpdateManyWithoutPhaseNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutPhaseInput, Prisma.BracketSlotUncheckedCreateWithoutPhaseInput> | Prisma.BracketSlotCreateWithoutPhaseInput[] | Prisma.BracketSlotUncheckedCreateWithoutPhaseInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutPhaseInput | Prisma.BracketSlotCreateOrConnectWithoutPhaseInput[];
    upsert?: Prisma.BracketSlotUpsertWithWhereUniqueWithoutPhaseInput | Prisma.BracketSlotUpsertWithWhereUniqueWithoutPhaseInput[];
    createMany?: Prisma.BracketSlotCreateManyPhaseInputEnvelope;
    set?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    disconnect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    delete?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    update?: Prisma.BracketSlotUpdateWithWhereUniqueWithoutPhaseInput | Prisma.BracketSlotUpdateWithWhereUniqueWithoutPhaseInput[];
    updateMany?: Prisma.BracketSlotUpdateManyWithWhereWithoutPhaseInput | Prisma.BracketSlotUpdateManyWithWhereWithoutPhaseInput[];
    deleteMany?: Prisma.BracketSlotScalarWhereInput | Prisma.BracketSlotScalarWhereInput[];
};
export type BracketSlotCreateNestedOneWithoutFed_as_aInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutFed_as_aInput, Prisma.BracketSlotUncheckedCreateWithoutFed_as_aInput>;
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutFed_as_aInput;
    connect?: Prisma.BracketSlotWhereUniqueInput;
};
export type BracketSlotCreateNestedOneWithoutFed_as_bInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutFed_as_bInput, Prisma.BracketSlotUncheckedCreateWithoutFed_as_bInput>;
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutFed_as_bInput;
    connect?: Prisma.BracketSlotWhereUniqueInput;
};
export type BracketSlotCreateNestedManyWithoutSource_aInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_aInput, Prisma.BracketSlotUncheckedCreateWithoutSource_aInput> | Prisma.BracketSlotCreateWithoutSource_aInput[] | Prisma.BracketSlotUncheckedCreateWithoutSource_aInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutSource_aInput | Prisma.BracketSlotCreateOrConnectWithoutSource_aInput[];
    createMany?: Prisma.BracketSlotCreateManySource_aInputEnvelope;
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
};
export type BracketSlotCreateNestedManyWithoutSource_bInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_bInput, Prisma.BracketSlotUncheckedCreateWithoutSource_bInput> | Prisma.BracketSlotCreateWithoutSource_bInput[] | Prisma.BracketSlotUncheckedCreateWithoutSource_bInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutSource_bInput | Prisma.BracketSlotCreateOrConnectWithoutSource_bInput[];
    createMany?: Prisma.BracketSlotCreateManySource_bInputEnvelope;
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
};
export type BracketSlotUncheckedCreateNestedManyWithoutSource_aInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_aInput, Prisma.BracketSlotUncheckedCreateWithoutSource_aInput> | Prisma.BracketSlotCreateWithoutSource_aInput[] | Prisma.BracketSlotUncheckedCreateWithoutSource_aInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutSource_aInput | Prisma.BracketSlotCreateOrConnectWithoutSource_aInput[];
    createMany?: Prisma.BracketSlotCreateManySource_aInputEnvelope;
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
};
export type BracketSlotUncheckedCreateNestedManyWithoutSource_bInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_bInput, Prisma.BracketSlotUncheckedCreateWithoutSource_bInput> | Prisma.BracketSlotCreateWithoutSource_bInput[] | Prisma.BracketSlotUncheckedCreateWithoutSource_bInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutSource_bInput | Prisma.BracketSlotCreateOrConnectWithoutSource_bInput[];
    createMany?: Prisma.BracketSlotCreateManySource_bInputEnvelope;
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
};
export type BracketSlotUpdateOneWithoutFed_as_aNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutFed_as_aInput, Prisma.BracketSlotUncheckedCreateWithoutFed_as_aInput>;
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutFed_as_aInput;
    upsert?: Prisma.BracketSlotUpsertWithoutFed_as_aInput;
    disconnect?: Prisma.BracketSlotWhereInput | boolean;
    delete?: Prisma.BracketSlotWhereInput | boolean;
    connect?: Prisma.BracketSlotWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BracketSlotUpdateToOneWithWhereWithoutFed_as_aInput, Prisma.BracketSlotUpdateWithoutFed_as_aInput>, Prisma.BracketSlotUncheckedUpdateWithoutFed_as_aInput>;
};
export type BracketSlotUpdateOneWithoutFed_as_bNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutFed_as_bInput, Prisma.BracketSlotUncheckedCreateWithoutFed_as_bInput>;
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutFed_as_bInput;
    upsert?: Prisma.BracketSlotUpsertWithoutFed_as_bInput;
    disconnect?: Prisma.BracketSlotWhereInput | boolean;
    delete?: Prisma.BracketSlotWhereInput | boolean;
    connect?: Prisma.BracketSlotWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BracketSlotUpdateToOneWithWhereWithoutFed_as_bInput, Prisma.BracketSlotUpdateWithoutFed_as_bInput>, Prisma.BracketSlotUncheckedUpdateWithoutFed_as_bInput>;
};
export type BracketSlotUpdateManyWithoutSource_aNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_aInput, Prisma.BracketSlotUncheckedCreateWithoutSource_aInput> | Prisma.BracketSlotCreateWithoutSource_aInput[] | Prisma.BracketSlotUncheckedCreateWithoutSource_aInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutSource_aInput | Prisma.BracketSlotCreateOrConnectWithoutSource_aInput[];
    upsert?: Prisma.BracketSlotUpsertWithWhereUniqueWithoutSource_aInput | Prisma.BracketSlotUpsertWithWhereUniqueWithoutSource_aInput[];
    createMany?: Prisma.BracketSlotCreateManySource_aInputEnvelope;
    set?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    disconnect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    delete?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    update?: Prisma.BracketSlotUpdateWithWhereUniqueWithoutSource_aInput | Prisma.BracketSlotUpdateWithWhereUniqueWithoutSource_aInput[];
    updateMany?: Prisma.BracketSlotUpdateManyWithWhereWithoutSource_aInput | Prisma.BracketSlotUpdateManyWithWhereWithoutSource_aInput[];
    deleteMany?: Prisma.BracketSlotScalarWhereInput | Prisma.BracketSlotScalarWhereInput[];
};
export type BracketSlotUpdateManyWithoutSource_bNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_bInput, Prisma.BracketSlotUncheckedCreateWithoutSource_bInput> | Prisma.BracketSlotCreateWithoutSource_bInput[] | Prisma.BracketSlotUncheckedCreateWithoutSource_bInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutSource_bInput | Prisma.BracketSlotCreateOrConnectWithoutSource_bInput[];
    upsert?: Prisma.BracketSlotUpsertWithWhereUniqueWithoutSource_bInput | Prisma.BracketSlotUpsertWithWhereUniqueWithoutSource_bInput[];
    createMany?: Prisma.BracketSlotCreateManySource_bInputEnvelope;
    set?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    disconnect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    delete?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    update?: Prisma.BracketSlotUpdateWithWhereUniqueWithoutSource_bInput | Prisma.BracketSlotUpdateWithWhereUniqueWithoutSource_bInput[];
    updateMany?: Prisma.BracketSlotUpdateManyWithWhereWithoutSource_bInput | Prisma.BracketSlotUpdateManyWithWhereWithoutSource_bInput[];
    deleteMany?: Prisma.BracketSlotScalarWhereInput | Prisma.BracketSlotScalarWhereInput[];
};
export type BracketSlotUncheckedUpdateManyWithoutSource_aNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_aInput, Prisma.BracketSlotUncheckedCreateWithoutSource_aInput> | Prisma.BracketSlotCreateWithoutSource_aInput[] | Prisma.BracketSlotUncheckedCreateWithoutSource_aInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutSource_aInput | Prisma.BracketSlotCreateOrConnectWithoutSource_aInput[];
    upsert?: Prisma.BracketSlotUpsertWithWhereUniqueWithoutSource_aInput | Prisma.BracketSlotUpsertWithWhereUniqueWithoutSource_aInput[];
    createMany?: Prisma.BracketSlotCreateManySource_aInputEnvelope;
    set?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    disconnect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    delete?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    update?: Prisma.BracketSlotUpdateWithWhereUniqueWithoutSource_aInput | Prisma.BracketSlotUpdateWithWhereUniqueWithoutSource_aInput[];
    updateMany?: Prisma.BracketSlotUpdateManyWithWhereWithoutSource_aInput | Prisma.BracketSlotUpdateManyWithWhereWithoutSource_aInput[];
    deleteMany?: Prisma.BracketSlotScalarWhereInput | Prisma.BracketSlotScalarWhereInput[];
};
export type BracketSlotUncheckedUpdateManyWithoutSource_bNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_bInput, Prisma.BracketSlotUncheckedCreateWithoutSource_bInput> | Prisma.BracketSlotCreateWithoutSource_bInput[] | Prisma.BracketSlotUncheckedCreateWithoutSource_bInput[];
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutSource_bInput | Prisma.BracketSlotCreateOrConnectWithoutSource_bInput[];
    upsert?: Prisma.BracketSlotUpsertWithWhereUniqueWithoutSource_bInput | Prisma.BracketSlotUpsertWithWhereUniqueWithoutSource_bInput[];
    createMany?: Prisma.BracketSlotCreateManySource_bInputEnvelope;
    set?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    disconnect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    delete?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    connect?: Prisma.BracketSlotWhereUniqueInput | Prisma.BracketSlotWhereUniqueInput[];
    update?: Prisma.BracketSlotUpdateWithWhereUniqueWithoutSource_bInput | Prisma.BracketSlotUpdateWithWhereUniqueWithoutSource_bInput[];
    updateMany?: Prisma.BracketSlotUpdateManyWithWhereWithoutSource_bInput | Prisma.BracketSlotUpdateManyWithWhereWithoutSource_bInput[];
    deleteMany?: Prisma.BracketSlotScalarWhereInput | Prisma.BracketSlotScalarWhereInput[];
};
export type BracketSlotCreateNestedOneWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutMatchInput, Prisma.BracketSlotUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutMatchInput;
    connect?: Prisma.BracketSlotWhereUniqueInput;
};
export type BracketSlotUncheckedCreateNestedOneWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutMatchInput, Prisma.BracketSlotUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutMatchInput;
    connect?: Prisma.BracketSlotWhereUniqueInput;
};
export type BracketSlotUpdateOneWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutMatchInput, Prisma.BracketSlotUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutMatchInput;
    upsert?: Prisma.BracketSlotUpsertWithoutMatchInput;
    disconnect?: Prisma.BracketSlotWhereInput | boolean;
    delete?: Prisma.BracketSlotWhereInput | boolean;
    connect?: Prisma.BracketSlotWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BracketSlotUpdateToOneWithWhereWithoutMatchInput, Prisma.BracketSlotUpdateWithoutMatchInput>, Prisma.BracketSlotUncheckedUpdateWithoutMatchInput>;
};
export type BracketSlotUncheckedUpdateOneWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.BracketSlotCreateWithoutMatchInput, Prisma.BracketSlotUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.BracketSlotCreateOrConnectWithoutMatchInput;
    upsert?: Prisma.BracketSlotUpsertWithoutMatchInput;
    disconnect?: Prisma.BracketSlotWhereInput | boolean;
    delete?: Prisma.BracketSlotWhereInput | boolean;
    connect?: Prisma.BracketSlotWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BracketSlotUpdateToOneWithWhereWithoutMatchInput, Prisma.BracketSlotUpdateWithoutMatchInput>, Prisma.BracketSlotUncheckedUpdateWithoutMatchInput>;
};
export type BracketSlotCreateWithoutPhaseInput = {
    round: number;
    slot_number: number;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    match?: Prisma.MatchCreateNestedOneWithoutBracketSlotInput;
    source_a?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_aInput;
    source_b?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_bInput;
    fed_as_a?: Prisma.BracketSlotCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotUncheckedCreateWithoutPhaseInput = {
    id?: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_a_slot_id?: number | null;
    source_b_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotCreateOrConnectWithoutPhaseInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutPhaseInput, Prisma.BracketSlotUncheckedCreateWithoutPhaseInput>;
};
export type BracketSlotCreateManyPhaseInputEnvelope = {
    data: Prisma.BracketSlotCreateManyPhaseInput | Prisma.BracketSlotCreateManyPhaseInput[];
    skipDuplicates?: boolean;
};
export type BracketSlotUpsertWithWhereUniqueWithoutPhaseInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    update: Prisma.XOR<Prisma.BracketSlotUpdateWithoutPhaseInput, Prisma.BracketSlotUncheckedUpdateWithoutPhaseInput>;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutPhaseInput, Prisma.BracketSlotUncheckedCreateWithoutPhaseInput>;
};
export type BracketSlotUpdateWithWhereUniqueWithoutPhaseInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    data: Prisma.XOR<Prisma.BracketSlotUpdateWithoutPhaseInput, Prisma.BracketSlotUncheckedUpdateWithoutPhaseInput>;
};
export type BracketSlotUpdateManyWithWhereWithoutPhaseInput = {
    where: Prisma.BracketSlotScalarWhereInput;
    data: Prisma.XOR<Prisma.BracketSlotUpdateManyMutationInput, Prisma.BracketSlotUncheckedUpdateManyWithoutPhaseInput>;
};
export type BracketSlotScalarWhereInput = {
    AND?: Prisma.BracketSlotScalarWhereInput | Prisma.BracketSlotScalarWhereInput[];
    OR?: Prisma.BracketSlotScalarWhereInput[];
    NOT?: Prisma.BracketSlotScalarWhereInput | Prisma.BracketSlotScalarWhereInput[];
    id?: Prisma.IntFilter<"BracketSlot"> | number;
    phase_id?: Prisma.IntFilter<"BracketSlot"> | number;
    round?: Prisma.IntFilter<"BracketSlot"> | number;
    slot_number?: Prisma.IntFilter<"BracketSlot"> | number;
    match_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    source_a_slot_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    source_b_slot_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    seeded_home_team_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    seeded_away_team_id?: Prisma.IntNullableFilter<"BracketSlot"> | number | null;
    is_bye?: Prisma.BoolFilter<"BracketSlot"> | boolean;
};
export type BracketSlotCreateWithoutFed_as_aInput = {
    round: number;
    slot_number: number;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    phase: Prisma.PhaseCreateNestedOneWithoutBracket_slotsInput;
    match?: Prisma.MatchCreateNestedOneWithoutBracketSlotInput;
    source_a?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_aInput;
    source_b?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_bInput;
    fed_as_b?: Prisma.BracketSlotCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotUncheckedCreateWithoutFed_as_aInput = {
    id?: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_a_slot_id?: number | null;
    source_b_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    fed_as_b?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotCreateOrConnectWithoutFed_as_aInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutFed_as_aInput, Prisma.BracketSlotUncheckedCreateWithoutFed_as_aInput>;
};
export type BracketSlotCreateWithoutFed_as_bInput = {
    round: number;
    slot_number: number;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    phase: Prisma.PhaseCreateNestedOneWithoutBracket_slotsInput;
    match?: Prisma.MatchCreateNestedOneWithoutBracketSlotInput;
    source_a?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_aInput;
    source_b?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_bInput;
    fed_as_a?: Prisma.BracketSlotCreateNestedManyWithoutSource_aInput;
};
export type BracketSlotUncheckedCreateWithoutFed_as_bInput = {
    id?: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_a_slot_id?: number | null;
    source_b_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_aInput;
};
export type BracketSlotCreateOrConnectWithoutFed_as_bInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutFed_as_bInput, Prisma.BracketSlotUncheckedCreateWithoutFed_as_bInput>;
};
export type BracketSlotCreateWithoutSource_aInput = {
    round: number;
    slot_number: number;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    phase: Prisma.PhaseCreateNestedOneWithoutBracket_slotsInput;
    match?: Prisma.MatchCreateNestedOneWithoutBracketSlotInput;
    source_b?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_bInput;
    fed_as_a?: Prisma.BracketSlotCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotUncheckedCreateWithoutSource_aInput = {
    id?: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_b_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotCreateOrConnectWithoutSource_aInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_aInput, Prisma.BracketSlotUncheckedCreateWithoutSource_aInput>;
};
export type BracketSlotCreateManySource_aInputEnvelope = {
    data: Prisma.BracketSlotCreateManySource_aInput | Prisma.BracketSlotCreateManySource_aInput[];
    skipDuplicates?: boolean;
};
export type BracketSlotCreateWithoutSource_bInput = {
    round: number;
    slot_number: number;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    phase: Prisma.PhaseCreateNestedOneWithoutBracket_slotsInput;
    match?: Prisma.MatchCreateNestedOneWithoutBracketSlotInput;
    source_a?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_aInput;
    fed_as_a?: Prisma.BracketSlotCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotUncheckedCreateWithoutSource_bInput = {
    id?: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_a_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotCreateOrConnectWithoutSource_bInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_bInput, Prisma.BracketSlotUncheckedCreateWithoutSource_bInput>;
};
export type BracketSlotCreateManySource_bInputEnvelope = {
    data: Prisma.BracketSlotCreateManySource_bInput | Prisma.BracketSlotCreateManySource_bInput[];
    skipDuplicates?: boolean;
};
export type BracketSlotUpsertWithoutFed_as_aInput = {
    update: Prisma.XOR<Prisma.BracketSlotUpdateWithoutFed_as_aInput, Prisma.BracketSlotUncheckedUpdateWithoutFed_as_aInput>;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutFed_as_aInput, Prisma.BracketSlotUncheckedCreateWithoutFed_as_aInput>;
    where?: Prisma.BracketSlotWhereInput;
};
export type BracketSlotUpdateToOneWithWhereWithoutFed_as_aInput = {
    where?: Prisma.BracketSlotWhereInput;
    data: Prisma.XOR<Prisma.BracketSlotUpdateWithoutFed_as_aInput, Prisma.BracketSlotUncheckedUpdateWithoutFed_as_aInput>;
};
export type BracketSlotUpdateWithoutFed_as_aInput = {
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutBracket_slotsNestedInput;
    match?: Prisma.MatchUpdateOneWithoutBracketSlotNestedInput;
    source_a?: Prisma.BracketSlotUpdateOneWithoutFed_as_aNestedInput;
    source_b?: Prisma.BracketSlotUpdateOneWithoutFed_as_bNestedInput;
    fed_as_b?: Prisma.BracketSlotUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUncheckedUpdateWithoutFed_as_aInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_a_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_b_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fed_as_b?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUpsertWithoutFed_as_bInput = {
    update: Prisma.XOR<Prisma.BracketSlotUpdateWithoutFed_as_bInput, Prisma.BracketSlotUncheckedUpdateWithoutFed_as_bInput>;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutFed_as_bInput, Prisma.BracketSlotUncheckedCreateWithoutFed_as_bInput>;
    where?: Prisma.BracketSlotWhereInput;
};
export type BracketSlotUpdateToOneWithWhereWithoutFed_as_bInput = {
    where?: Prisma.BracketSlotWhereInput;
    data: Prisma.XOR<Prisma.BracketSlotUpdateWithoutFed_as_bInput, Prisma.BracketSlotUncheckedUpdateWithoutFed_as_bInput>;
};
export type BracketSlotUpdateWithoutFed_as_bInput = {
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutBracket_slotsNestedInput;
    match?: Prisma.MatchUpdateOneWithoutBracketSlotNestedInput;
    source_a?: Prisma.BracketSlotUpdateOneWithoutFed_as_aNestedInput;
    source_b?: Prisma.BracketSlotUpdateOneWithoutFed_as_bNestedInput;
    fed_as_a?: Prisma.BracketSlotUpdateManyWithoutSource_aNestedInput;
};
export type BracketSlotUncheckedUpdateWithoutFed_as_bInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_a_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_b_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_aNestedInput;
};
export type BracketSlotUpsertWithWhereUniqueWithoutSource_aInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    update: Prisma.XOR<Prisma.BracketSlotUpdateWithoutSource_aInput, Prisma.BracketSlotUncheckedUpdateWithoutSource_aInput>;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_aInput, Prisma.BracketSlotUncheckedCreateWithoutSource_aInput>;
};
export type BracketSlotUpdateWithWhereUniqueWithoutSource_aInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    data: Prisma.XOR<Prisma.BracketSlotUpdateWithoutSource_aInput, Prisma.BracketSlotUncheckedUpdateWithoutSource_aInput>;
};
export type BracketSlotUpdateManyWithWhereWithoutSource_aInput = {
    where: Prisma.BracketSlotScalarWhereInput;
    data: Prisma.XOR<Prisma.BracketSlotUpdateManyMutationInput, Prisma.BracketSlotUncheckedUpdateManyWithoutSource_aInput>;
};
export type BracketSlotUpsertWithWhereUniqueWithoutSource_bInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    update: Prisma.XOR<Prisma.BracketSlotUpdateWithoutSource_bInput, Prisma.BracketSlotUncheckedUpdateWithoutSource_bInput>;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutSource_bInput, Prisma.BracketSlotUncheckedCreateWithoutSource_bInput>;
};
export type BracketSlotUpdateWithWhereUniqueWithoutSource_bInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    data: Prisma.XOR<Prisma.BracketSlotUpdateWithoutSource_bInput, Prisma.BracketSlotUncheckedUpdateWithoutSource_bInput>;
};
export type BracketSlotUpdateManyWithWhereWithoutSource_bInput = {
    where: Prisma.BracketSlotScalarWhereInput;
    data: Prisma.XOR<Prisma.BracketSlotUpdateManyMutationInput, Prisma.BracketSlotUncheckedUpdateManyWithoutSource_bInput>;
};
export type BracketSlotCreateWithoutMatchInput = {
    round: number;
    slot_number: number;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    phase: Prisma.PhaseCreateNestedOneWithoutBracket_slotsInput;
    source_a?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_aInput;
    source_b?: Prisma.BracketSlotCreateNestedOneWithoutFed_as_bInput;
    fed_as_a?: Prisma.BracketSlotCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotUncheckedCreateWithoutMatchInput = {
    id?: number;
    phase_id: number;
    round: number;
    slot_number: number;
    source_a_slot_id?: number | null;
    source_b_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_aInput;
    fed_as_b?: Prisma.BracketSlotUncheckedCreateNestedManyWithoutSource_bInput;
};
export type BracketSlotCreateOrConnectWithoutMatchInput = {
    where: Prisma.BracketSlotWhereUniqueInput;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutMatchInput, Prisma.BracketSlotUncheckedCreateWithoutMatchInput>;
};
export type BracketSlotUpsertWithoutMatchInput = {
    update: Prisma.XOR<Prisma.BracketSlotUpdateWithoutMatchInput, Prisma.BracketSlotUncheckedUpdateWithoutMatchInput>;
    create: Prisma.XOR<Prisma.BracketSlotCreateWithoutMatchInput, Prisma.BracketSlotUncheckedCreateWithoutMatchInput>;
    where?: Prisma.BracketSlotWhereInput;
};
export type BracketSlotUpdateToOneWithWhereWithoutMatchInput = {
    where?: Prisma.BracketSlotWhereInput;
    data: Prisma.XOR<Prisma.BracketSlotUpdateWithoutMatchInput, Prisma.BracketSlotUncheckedUpdateWithoutMatchInput>;
};
export type BracketSlotUpdateWithoutMatchInput = {
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutBracket_slotsNestedInput;
    source_a?: Prisma.BracketSlotUpdateOneWithoutFed_as_aNestedInput;
    source_b?: Prisma.BracketSlotUpdateOneWithoutFed_as_bNestedInput;
    fed_as_a?: Prisma.BracketSlotUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUncheckedUpdateWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    source_a_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_b_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotCreateManyPhaseInput = {
    id?: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_a_slot_id?: number | null;
    source_b_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
};
export type BracketSlotUpdateWithoutPhaseInput = {
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    match?: Prisma.MatchUpdateOneWithoutBracketSlotNestedInput;
    source_a?: Prisma.BracketSlotUpdateOneWithoutFed_as_aNestedInput;
    source_b?: Prisma.BracketSlotUpdateOneWithoutFed_as_bNestedInput;
    fed_as_a?: Prisma.BracketSlotUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUncheckedUpdateWithoutPhaseInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_a_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_b_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUncheckedUpdateManyWithoutPhaseInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_a_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_b_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type BracketSlotCreateManySource_aInput = {
    id?: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_b_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
};
export type BracketSlotCreateManySource_bInput = {
    id?: number;
    phase_id: number;
    round: number;
    slot_number: number;
    match_id?: number | null;
    source_a_slot_id?: number | null;
    seeded_home_team_id?: number | null;
    seeded_away_team_id?: number | null;
    is_bye?: boolean;
};
export type BracketSlotUpdateWithoutSource_aInput = {
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutBracket_slotsNestedInput;
    match?: Prisma.MatchUpdateOneWithoutBracketSlotNestedInput;
    source_b?: Prisma.BracketSlotUpdateOneWithoutFed_as_bNestedInput;
    fed_as_a?: Prisma.BracketSlotUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUncheckedUpdateWithoutSource_aInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_b_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUncheckedUpdateManyWithoutSource_aInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_b_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type BracketSlotUpdateWithoutSource_bInput = {
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    phase?: Prisma.PhaseUpdateOneRequiredWithoutBracket_slotsNestedInput;
    match?: Prisma.MatchUpdateOneWithoutBracketSlotNestedInput;
    source_a?: Prisma.BracketSlotUpdateOneWithoutFed_as_aNestedInput;
    fed_as_a?: Prisma.BracketSlotUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUncheckedUpdateWithoutSource_bInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_a_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fed_as_a?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_aNestedInput;
    fed_as_b?: Prisma.BracketSlotUncheckedUpdateManyWithoutSource_bNestedInput;
};
export type BracketSlotUncheckedUpdateManyWithoutSource_bInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phase_id?: Prisma.IntFieldUpdateOperationsInput | number;
    round?: Prisma.IntFieldUpdateOperationsInput | number;
    slot_number?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    source_a_slot_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_home_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seeded_away_team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_bye?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
/**
 * Count Type BracketSlotCountOutputType
 */
export type BracketSlotCountOutputType = {
    fed_as_a: number;
    fed_as_b: number;
};
export type BracketSlotCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    fed_as_a?: boolean | BracketSlotCountOutputTypeCountFed_as_aArgs;
    fed_as_b?: boolean | BracketSlotCountOutputTypeCountFed_as_bArgs;
};
/**
 * BracketSlotCountOutputType without action
 */
export type BracketSlotCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BracketSlotCountOutputType
     */
    select?: Prisma.BracketSlotCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * BracketSlotCountOutputType without action
 */
export type BracketSlotCountOutputTypeCountFed_as_aArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BracketSlotWhereInput;
};
/**
 * BracketSlotCountOutputType without action
 */
export type BracketSlotCountOutputTypeCountFed_as_bArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BracketSlotWhereInput;
};
export type BracketSlotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    phase_id?: boolean;
    round?: boolean;
    slot_number?: boolean;
    match_id?: boolean;
    source_a_slot_id?: boolean;
    source_b_slot_id?: boolean;
    seeded_home_team_id?: boolean;
    seeded_away_team_id?: boolean;
    is_bye?: boolean;
    phase?: boolean | Prisma.PhaseDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.BracketSlot$matchArgs<ExtArgs>;
    source_a?: boolean | Prisma.BracketSlot$source_aArgs<ExtArgs>;
    source_b?: boolean | Prisma.BracketSlot$source_bArgs<ExtArgs>;
    fed_as_a?: boolean | Prisma.BracketSlot$fed_as_aArgs<ExtArgs>;
    fed_as_b?: boolean | Prisma.BracketSlot$fed_as_bArgs<ExtArgs>;
    _count?: boolean | Prisma.BracketSlotCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["bracketSlot"]>;
export type BracketSlotSelectScalar = {
    id?: boolean;
    phase_id?: boolean;
    round?: boolean;
    slot_number?: boolean;
    match_id?: boolean;
    source_a_slot_id?: boolean;
    source_b_slot_id?: boolean;
    seeded_home_team_id?: boolean;
    seeded_away_team_id?: boolean;
    is_bye?: boolean;
};
export type BracketSlotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "phase_id" | "round" | "slot_number" | "match_id" | "source_a_slot_id" | "source_b_slot_id" | "seeded_home_team_id" | "seeded_away_team_id" | "is_bye", ExtArgs["result"]["bracketSlot"]>;
export type BracketSlotInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    phase?: boolean | Prisma.PhaseDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.BracketSlot$matchArgs<ExtArgs>;
    source_a?: boolean | Prisma.BracketSlot$source_aArgs<ExtArgs>;
    source_b?: boolean | Prisma.BracketSlot$source_bArgs<ExtArgs>;
    fed_as_a?: boolean | Prisma.BracketSlot$fed_as_aArgs<ExtArgs>;
    fed_as_b?: boolean | Prisma.BracketSlot$fed_as_bArgs<ExtArgs>;
    _count?: boolean | Prisma.BracketSlotCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $BracketSlotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BracketSlot";
    objects: {
        phase: Prisma.$PhasePayload<ExtArgs>;
        match: Prisma.$MatchPayload<ExtArgs> | null;
        source_a: Prisma.$BracketSlotPayload<ExtArgs> | null;
        source_b: Prisma.$BracketSlotPayload<ExtArgs> | null;
        fed_as_a: Prisma.$BracketSlotPayload<ExtArgs>[];
        fed_as_b: Prisma.$BracketSlotPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        phase_id: number;
        round: number;
        slot_number: number;
        match_id: number | null;
        source_a_slot_id: number | null;
        source_b_slot_id: number | null;
        seeded_home_team_id: number | null;
        seeded_away_team_id: number | null;
        is_bye: boolean;
    }, ExtArgs["result"]["bracketSlot"]>;
    composites: {};
};
export type BracketSlotGetPayload<S extends boolean | null | undefined | BracketSlotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload, S>;
export type BracketSlotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BracketSlotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BracketSlotCountAggregateInputType | true;
};
export interface BracketSlotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BracketSlot'];
        meta: {
            name: 'BracketSlot';
        };
    };
    /**
     * Find zero or one BracketSlot that matches the filter.
     * @param {BracketSlotFindUniqueArgs} args - Arguments to find a BracketSlot
     * @example
     * // Get one BracketSlot
     * const bracketSlot = await prisma.bracketSlot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BracketSlotFindUniqueArgs>(args: Prisma.SelectSubset<T, BracketSlotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one BracketSlot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BracketSlotFindUniqueOrThrowArgs} args - Arguments to find a BracketSlot
     * @example
     * // Get one BracketSlot
     * const bracketSlot = await prisma.bracketSlot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BracketSlotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BracketSlotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first BracketSlot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketSlotFindFirstArgs} args - Arguments to find a BracketSlot
     * @example
     * // Get one BracketSlot
     * const bracketSlot = await prisma.bracketSlot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BracketSlotFindFirstArgs>(args?: Prisma.SelectSubset<T, BracketSlotFindFirstArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first BracketSlot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketSlotFindFirstOrThrowArgs} args - Arguments to find a BracketSlot
     * @example
     * // Get one BracketSlot
     * const bracketSlot = await prisma.bracketSlot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BracketSlotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BracketSlotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more BracketSlots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketSlotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BracketSlots
     * const bracketSlots = await prisma.bracketSlot.findMany()
     *
     * // Get first 10 BracketSlots
     * const bracketSlots = await prisma.bracketSlot.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const bracketSlotWithIdOnly = await prisma.bracketSlot.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BracketSlotFindManyArgs>(args?: Prisma.SelectSubset<T, BracketSlotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a BracketSlot.
     * @param {BracketSlotCreateArgs} args - Arguments to create a BracketSlot.
     * @example
     * // Create one BracketSlot
     * const BracketSlot = await prisma.bracketSlot.create({
     *   data: {
     *     // ... data to create a BracketSlot
     *   }
     * })
     *
     */
    create<T extends BracketSlotCreateArgs>(args: Prisma.SelectSubset<T, BracketSlotCreateArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many BracketSlots.
     * @param {BracketSlotCreateManyArgs} args - Arguments to create many BracketSlots.
     * @example
     * // Create many BracketSlots
     * const bracketSlot = await prisma.bracketSlot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BracketSlotCreateManyArgs>(args?: Prisma.SelectSubset<T, BracketSlotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a BracketSlot.
     * @param {BracketSlotDeleteArgs} args - Arguments to delete one BracketSlot.
     * @example
     * // Delete one BracketSlot
     * const BracketSlot = await prisma.bracketSlot.delete({
     *   where: {
     *     // ... filter to delete one BracketSlot
     *   }
     * })
     *
     */
    delete<T extends BracketSlotDeleteArgs>(args: Prisma.SelectSubset<T, BracketSlotDeleteArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one BracketSlot.
     * @param {BracketSlotUpdateArgs} args - Arguments to update one BracketSlot.
     * @example
     * // Update one BracketSlot
     * const bracketSlot = await prisma.bracketSlot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BracketSlotUpdateArgs>(args: Prisma.SelectSubset<T, BracketSlotUpdateArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more BracketSlots.
     * @param {BracketSlotDeleteManyArgs} args - Arguments to filter BracketSlots to delete.
     * @example
     * // Delete a few BracketSlots
     * const { count } = await prisma.bracketSlot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BracketSlotDeleteManyArgs>(args?: Prisma.SelectSubset<T, BracketSlotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more BracketSlots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketSlotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BracketSlots
     * const bracketSlot = await prisma.bracketSlot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BracketSlotUpdateManyArgs>(args: Prisma.SelectSubset<T, BracketSlotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one BracketSlot.
     * @param {BracketSlotUpsertArgs} args - Arguments to update or create a BracketSlot.
     * @example
     * // Update or create a BracketSlot
     * const bracketSlot = await prisma.bracketSlot.upsert({
     *   create: {
     *     // ... data to create a BracketSlot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BracketSlot we want to update
     *   }
     * })
     */
    upsert<T extends BracketSlotUpsertArgs>(args: Prisma.SelectSubset<T, BracketSlotUpsertArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of BracketSlots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketSlotCountArgs} args - Arguments to filter BracketSlots to count.
     * @example
     * // Count the number of BracketSlots
     * const count = await prisma.bracketSlot.count({
     *   where: {
     *     // ... the filter for the BracketSlots we want to count
     *   }
     * })
    **/
    count<T extends BracketSlotCountArgs>(args?: Prisma.Subset<T, BracketSlotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BracketSlotCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a BracketSlot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketSlotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BracketSlotAggregateArgs>(args: Prisma.Subset<T, BracketSlotAggregateArgs>): Prisma.PrismaPromise<GetBracketSlotAggregateType<T>>;
    /**
     * Group by BracketSlot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketSlotGroupByArgs} args - Group by arguments.
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
    groupBy<T extends BracketSlotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BracketSlotGroupByArgs['orderBy'];
    } : {
        orderBy?: BracketSlotGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BracketSlotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBracketSlotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the BracketSlot model
     */
    readonly fields: BracketSlotFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for BracketSlot.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__BracketSlotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    phase<T extends Prisma.PhaseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PhaseDefaultArgs<ExtArgs>>): Prisma.Prisma__PhaseClient<runtime.Types.Result.GetResult<Prisma.$PhasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    match<T extends Prisma.BracketSlot$matchArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BracketSlot$matchArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    source_a<T extends Prisma.BracketSlot$source_aArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BracketSlot$source_aArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    source_b<T extends Prisma.BracketSlot$source_bArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BracketSlot$source_bArgs<ExtArgs>>): Prisma.Prisma__BracketSlotClient<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    fed_as_a<T extends Prisma.BracketSlot$fed_as_aArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BracketSlot$fed_as_aArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    fed_as_b<T extends Prisma.BracketSlot$fed_as_bArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BracketSlot$fed_as_bArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BracketSlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the BracketSlot model
 */
export interface BracketSlotFieldRefs {
    readonly id: Prisma.FieldRef<"BracketSlot", 'Int'>;
    readonly phase_id: Prisma.FieldRef<"BracketSlot", 'Int'>;
    readonly round: Prisma.FieldRef<"BracketSlot", 'Int'>;
    readonly slot_number: Prisma.FieldRef<"BracketSlot", 'Int'>;
    readonly match_id: Prisma.FieldRef<"BracketSlot", 'Int'>;
    readonly source_a_slot_id: Prisma.FieldRef<"BracketSlot", 'Int'>;
    readonly source_b_slot_id: Prisma.FieldRef<"BracketSlot", 'Int'>;
    readonly seeded_home_team_id: Prisma.FieldRef<"BracketSlot", 'Int'>;
    readonly seeded_away_team_id: Prisma.FieldRef<"BracketSlot", 'Int'>;
    readonly is_bye: Prisma.FieldRef<"BracketSlot", 'Boolean'>;
}
/**
 * BracketSlot findUnique
 */
export type BracketSlotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which BracketSlot to fetch.
     */
    where: Prisma.BracketSlotWhereUniqueInput;
};
/**
 * BracketSlot findUniqueOrThrow
 */
export type BracketSlotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which BracketSlot to fetch.
     */
    where: Prisma.BracketSlotWhereUniqueInput;
};
/**
 * BracketSlot findFirst
 */
export type BracketSlotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which BracketSlot to fetch.
     */
    where?: Prisma.BracketSlotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BracketSlots to fetch.
     */
    orderBy?: Prisma.BracketSlotOrderByWithRelationInput | Prisma.BracketSlotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BracketSlots.
     */
    cursor?: Prisma.BracketSlotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BracketSlots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BracketSlots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BracketSlots.
     */
    distinct?: Prisma.BracketSlotScalarFieldEnum | Prisma.BracketSlotScalarFieldEnum[];
};
/**
 * BracketSlot findFirstOrThrow
 */
export type BracketSlotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which BracketSlot to fetch.
     */
    where?: Prisma.BracketSlotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BracketSlots to fetch.
     */
    orderBy?: Prisma.BracketSlotOrderByWithRelationInput | Prisma.BracketSlotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BracketSlots.
     */
    cursor?: Prisma.BracketSlotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BracketSlots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BracketSlots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BracketSlots.
     */
    distinct?: Prisma.BracketSlotScalarFieldEnum | Prisma.BracketSlotScalarFieldEnum[];
};
/**
 * BracketSlot findMany
 */
export type BracketSlotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which BracketSlots to fetch.
     */
    where?: Prisma.BracketSlotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BracketSlots to fetch.
     */
    orderBy?: Prisma.BracketSlotOrderByWithRelationInput | Prisma.BracketSlotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BracketSlots.
     */
    cursor?: Prisma.BracketSlotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BracketSlots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BracketSlots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BracketSlots.
     */
    distinct?: Prisma.BracketSlotScalarFieldEnum | Prisma.BracketSlotScalarFieldEnum[];
};
/**
 * BracketSlot create
 */
export type BracketSlotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a BracketSlot.
     */
    data: Prisma.XOR<Prisma.BracketSlotCreateInput, Prisma.BracketSlotUncheckedCreateInput>;
};
/**
 * BracketSlot createMany
 */
export type BracketSlotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many BracketSlots.
     */
    data: Prisma.BracketSlotCreateManyInput | Prisma.BracketSlotCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * BracketSlot update
 */
export type BracketSlotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a BracketSlot.
     */
    data: Prisma.XOR<Prisma.BracketSlotUpdateInput, Prisma.BracketSlotUncheckedUpdateInput>;
    /**
     * Choose, which BracketSlot to update.
     */
    where: Prisma.BracketSlotWhereUniqueInput;
};
/**
 * BracketSlot updateMany
 */
export type BracketSlotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update BracketSlots.
     */
    data: Prisma.XOR<Prisma.BracketSlotUpdateManyMutationInput, Prisma.BracketSlotUncheckedUpdateManyInput>;
    /**
     * Filter which BracketSlots to update
     */
    where?: Prisma.BracketSlotWhereInput;
    /**
     * Limit how many BracketSlots to update.
     */
    limit?: number;
};
/**
 * BracketSlot upsert
 */
export type BracketSlotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the BracketSlot to update in case it exists.
     */
    where: Prisma.BracketSlotWhereUniqueInput;
    /**
     * In case the BracketSlot found by the `where` argument doesn't exist, create a new BracketSlot with this data.
     */
    create: Prisma.XOR<Prisma.BracketSlotCreateInput, Prisma.BracketSlotUncheckedCreateInput>;
    /**
     * In case the BracketSlot was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.BracketSlotUpdateInput, Prisma.BracketSlotUncheckedUpdateInput>;
};
/**
 * BracketSlot delete
 */
export type BracketSlotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which BracketSlot to delete.
     */
    where: Prisma.BracketSlotWhereUniqueInput;
};
/**
 * BracketSlot deleteMany
 */
export type BracketSlotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which BracketSlots to delete
     */
    where?: Prisma.BracketSlotWhereInput;
    /**
     * Limit how many BracketSlots to delete.
     */
    limit?: number;
};
/**
 * BracketSlot.match
 */
export type BracketSlot$matchArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * BracketSlot.source_a
 */
export type BracketSlot$source_aArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * BracketSlot.source_b
 */
export type BracketSlot$source_bArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * BracketSlot.fed_as_a
 */
export type BracketSlot$fed_as_aArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * BracketSlot.fed_as_b
 */
export type BracketSlot$fed_as_bArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * BracketSlot without action
 */
export type BracketSlotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=BracketSlot.d.ts.map