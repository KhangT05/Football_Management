import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model SeasonDefaultVenue
 *
 */
export type SeasonDefaultVenueModel = runtime.Types.Result.DefaultSelection<Prisma.$SeasonDefaultVenuePayload>;
export type AggregateSeasonDefaultVenue = {
    _count: SeasonDefaultVenueCountAggregateOutputType | null;
    _avg: SeasonDefaultVenueAvgAggregateOutputType | null;
    _sum: SeasonDefaultVenueSumAggregateOutputType | null;
    _min: SeasonDefaultVenueMinAggregateOutputType | null;
    _max: SeasonDefaultVenueMaxAggregateOutputType | null;
};
export type SeasonDefaultVenueAvgAggregateOutputType = {
    season_id: number | null;
    venue_id: number | null;
};
export type SeasonDefaultVenueSumAggregateOutputType = {
    season_id: number | null;
    venue_id: number | null;
};
export type SeasonDefaultVenueMinAggregateOutputType = {
    season_id: number | null;
    venue_id: number | null;
};
export type SeasonDefaultVenueMaxAggregateOutputType = {
    season_id: number | null;
    venue_id: number | null;
};
export type SeasonDefaultVenueCountAggregateOutputType = {
    season_id: number;
    venue_id: number;
    _all: number;
};
export type SeasonDefaultVenueAvgAggregateInputType = {
    season_id?: true;
    venue_id?: true;
};
export type SeasonDefaultVenueSumAggregateInputType = {
    season_id?: true;
    venue_id?: true;
};
export type SeasonDefaultVenueMinAggregateInputType = {
    season_id?: true;
    venue_id?: true;
};
export type SeasonDefaultVenueMaxAggregateInputType = {
    season_id?: true;
    venue_id?: true;
};
export type SeasonDefaultVenueCountAggregateInputType = {
    season_id?: true;
    venue_id?: true;
    _all?: true;
};
export type SeasonDefaultVenueAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonDefaultVenue to aggregate.
     */
    where?: Prisma.SeasonDefaultVenueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonDefaultVenues to fetch.
     */
    orderBy?: Prisma.SeasonDefaultVenueOrderByWithRelationInput | Prisma.SeasonDefaultVenueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.SeasonDefaultVenueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonDefaultVenues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonDefaultVenues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SeasonDefaultVenues
    **/
    _count?: true | SeasonDefaultVenueCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: SeasonDefaultVenueAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: SeasonDefaultVenueSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SeasonDefaultVenueMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SeasonDefaultVenueMaxAggregateInputType;
};
export type GetSeasonDefaultVenueAggregateType<T extends SeasonDefaultVenueAggregateArgs> = {
    [P in keyof T & keyof AggregateSeasonDefaultVenue]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSeasonDefaultVenue[P]> : Prisma.GetScalarType<T[P], AggregateSeasonDefaultVenue[P]>;
};
export type SeasonDefaultVenueGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SeasonDefaultVenueWhereInput;
    orderBy?: Prisma.SeasonDefaultVenueOrderByWithAggregationInput | Prisma.SeasonDefaultVenueOrderByWithAggregationInput[];
    by: Prisma.SeasonDefaultVenueScalarFieldEnum[] | Prisma.SeasonDefaultVenueScalarFieldEnum;
    having?: Prisma.SeasonDefaultVenueScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SeasonDefaultVenueCountAggregateInputType | true;
    _avg?: SeasonDefaultVenueAvgAggregateInputType;
    _sum?: SeasonDefaultVenueSumAggregateInputType;
    _min?: SeasonDefaultVenueMinAggregateInputType;
    _max?: SeasonDefaultVenueMaxAggregateInputType;
};
export type SeasonDefaultVenueGroupByOutputType = {
    season_id: number;
    venue_id: number;
    _count: SeasonDefaultVenueCountAggregateOutputType | null;
    _avg: SeasonDefaultVenueAvgAggregateOutputType | null;
    _sum: SeasonDefaultVenueSumAggregateOutputType | null;
    _min: SeasonDefaultVenueMinAggregateOutputType | null;
    _max: SeasonDefaultVenueMaxAggregateOutputType | null;
};
export type GetSeasonDefaultVenueGroupByPayload<T extends SeasonDefaultVenueGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SeasonDefaultVenueGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SeasonDefaultVenueGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SeasonDefaultVenueGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SeasonDefaultVenueGroupByOutputType[P]>;
}>>;
export type SeasonDefaultVenueWhereInput = {
    AND?: Prisma.SeasonDefaultVenueWhereInput | Prisma.SeasonDefaultVenueWhereInput[];
    OR?: Prisma.SeasonDefaultVenueWhereInput[];
    NOT?: Prisma.SeasonDefaultVenueWhereInput | Prisma.SeasonDefaultVenueWhereInput[];
    season_id?: Prisma.IntFilter<"SeasonDefaultVenue"> | number;
    venue_id?: Prisma.IntFilter<"SeasonDefaultVenue"> | number;
    season?: Prisma.XOR<Prisma.SeasonScalarRelationFilter, Prisma.SeasonWhereInput>;
    venue?: Prisma.XOR<Prisma.VenueScalarRelationFilter, Prisma.VenueWhereInput>;
};
export type SeasonDefaultVenueOrderByWithRelationInput = {
    season_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
    season?: Prisma.SeasonOrderByWithRelationInput;
    venue?: Prisma.VenueOrderByWithRelationInput;
};
export type SeasonDefaultVenueWhereUniqueInput = Prisma.AtLeast<{
    season_id_venue_id?: Prisma.SeasonDefaultVenueSeason_idVenue_idCompoundUniqueInput;
    AND?: Prisma.SeasonDefaultVenueWhereInput | Prisma.SeasonDefaultVenueWhereInput[];
    OR?: Prisma.SeasonDefaultVenueWhereInput[];
    NOT?: Prisma.SeasonDefaultVenueWhereInput | Prisma.SeasonDefaultVenueWhereInput[];
    season_id?: Prisma.IntFilter<"SeasonDefaultVenue"> | number;
    venue_id?: Prisma.IntFilter<"SeasonDefaultVenue"> | number;
    season?: Prisma.XOR<Prisma.SeasonScalarRelationFilter, Prisma.SeasonWhereInput>;
    venue?: Prisma.XOR<Prisma.VenueScalarRelationFilter, Prisma.VenueWhereInput>;
}, "season_id_venue_id">;
export type SeasonDefaultVenueOrderByWithAggregationInput = {
    season_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
    _count?: Prisma.SeasonDefaultVenueCountOrderByAggregateInput;
    _avg?: Prisma.SeasonDefaultVenueAvgOrderByAggregateInput;
    _max?: Prisma.SeasonDefaultVenueMaxOrderByAggregateInput;
    _min?: Prisma.SeasonDefaultVenueMinOrderByAggregateInput;
    _sum?: Prisma.SeasonDefaultVenueSumOrderByAggregateInput;
};
export type SeasonDefaultVenueScalarWhereWithAggregatesInput = {
    AND?: Prisma.SeasonDefaultVenueScalarWhereWithAggregatesInput | Prisma.SeasonDefaultVenueScalarWhereWithAggregatesInput[];
    OR?: Prisma.SeasonDefaultVenueScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SeasonDefaultVenueScalarWhereWithAggregatesInput | Prisma.SeasonDefaultVenueScalarWhereWithAggregatesInput[];
    season_id?: Prisma.IntWithAggregatesFilter<"SeasonDefaultVenue"> | number;
    venue_id?: Prisma.IntWithAggregatesFilter<"SeasonDefaultVenue"> | number;
};
export type SeasonDefaultVenueCreateInput = {
    season: Prisma.SeasonCreateNestedOneWithoutDefault_venuesInput;
    venue: Prisma.VenueCreateNestedOneWithoutSeasonDefaultVenuesInput;
};
export type SeasonDefaultVenueUncheckedCreateInput = {
    season_id: number;
    venue_id: number;
};
export type SeasonDefaultVenueUpdateInput = {
    season?: Prisma.SeasonUpdateOneRequiredWithoutDefault_venuesNestedInput;
    venue?: Prisma.VenueUpdateOneRequiredWithoutSeasonDefaultVenuesNestedInput;
};
export type SeasonDefaultVenueUncheckedUpdateInput = {
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    venue_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SeasonDefaultVenueCreateManyInput = {
    season_id: number;
    venue_id: number;
};
export type SeasonDefaultVenueUpdateManyMutationInput = {};
export type SeasonDefaultVenueUncheckedUpdateManyInput = {
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    venue_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SeasonDefaultVenueListRelationFilter = {
    every?: Prisma.SeasonDefaultVenueWhereInput;
    some?: Prisma.SeasonDefaultVenueWhereInput;
    none?: Prisma.SeasonDefaultVenueWhereInput;
};
export type SeasonDefaultVenueOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SeasonDefaultVenueSeason_idVenue_idCompoundUniqueInput = {
    season_id: number;
    venue_id: number;
};
export type SeasonDefaultVenueCountOrderByAggregateInput = {
    season_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
};
export type SeasonDefaultVenueAvgOrderByAggregateInput = {
    season_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
};
export type SeasonDefaultVenueMaxOrderByAggregateInput = {
    season_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
};
export type SeasonDefaultVenueMinOrderByAggregateInput = {
    season_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
};
export type SeasonDefaultVenueSumOrderByAggregateInput = {
    season_id?: Prisma.SortOrder;
    venue_id?: Prisma.SortOrder;
};
export type SeasonDefaultVenueCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutSeasonInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput> | Prisma.SeasonDefaultVenueCreateWithoutSeasonInput[] | Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.SeasonDefaultVenueCreateOrConnectWithoutSeasonInput | Prisma.SeasonDefaultVenueCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.SeasonDefaultVenueCreateManySeasonInputEnvelope;
    connect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
};
export type SeasonDefaultVenueUncheckedCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutSeasonInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput> | Prisma.SeasonDefaultVenueCreateWithoutSeasonInput[] | Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.SeasonDefaultVenueCreateOrConnectWithoutSeasonInput | Prisma.SeasonDefaultVenueCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.SeasonDefaultVenueCreateManySeasonInputEnvelope;
    connect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
};
export type SeasonDefaultVenueUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutSeasonInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput> | Prisma.SeasonDefaultVenueCreateWithoutSeasonInput[] | Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.SeasonDefaultVenueCreateOrConnectWithoutSeasonInput | Prisma.SeasonDefaultVenueCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.SeasonDefaultVenueUpsertWithWhereUniqueWithoutSeasonInput | Prisma.SeasonDefaultVenueUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.SeasonDefaultVenueCreateManySeasonInputEnvelope;
    set?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    disconnect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    delete?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    connect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    update?: Prisma.SeasonDefaultVenueUpdateWithWhereUniqueWithoutSeasonInput | Prisma.SeasonDefaultVenueUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.SeasonDefaultVenueUpdateManyWithWhereWithoutSeasonInput | Prisma.SeasonDefaultVenueUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.SeasonDefaultVenueScalarWhereInput | Prisma.SeasonDefaultVenueScalarWhereInput[];
};
export type SeasonDefaultVenueUncheckedUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutSeasonInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput> | Prisma.SeasonDefaultVenueCreateWithoutSeasonInput[] | Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.SeasonDefaultVenueCreateOrConnectWithoutSeasonInput | Prisma.SeasonDefaultVenueCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.SeasonDefaultVenueUpsertWithWhereUniqueWithoutSeasonInput | Prisma.SeasonDefaultVenueUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.SeasonDefaultVenueCreateManySeasonInputEnvelope;
    set?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    disconnect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    delete?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    connect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    update?: Prisma.SeasonDefaultVenueUpdateWithWhereUniqueWithoutSeasonInput | Prisma.SeasonDefaultVenueUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.SeasonDefaultVenueUpdateManyWithWhereWithoutSeasonInput | Prisma.SeasonDefaultVenueUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.SeasonDefaultVenueScalarWhereInput | Prisma.SeasonDefaultVenueScalarWhereInput[];
};
export type SeasonDefaultVenueCreateNestedManyWithoutVenueInput = {
    create?: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutVenueInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput> | Prisma.SeasonDefaultVenueCreateWithoutVenueInput[] | Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput[];
    connectOrCreate?: Prisma.SeasonDefaultVenueCreateOrConnectWithoutVenueInput | Prisma.SeasonDefaultVenueCreateOrConnectWithoutVenueInput[];
    createMany?: Prisma.SeasonDefaultVenueCreateManyVenueInputEnvelope;
    connect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
};
export type SeasonDefaultVenueUncheckedCreateNestedManyWithoutVenueInput = {
    create?: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutVenueInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput> | Prisma.SeasonDefaultVenueCreateWithoutVenueInput[] | Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput[];
    connectOrCreate?: Prisma.SeasonDefaultVenueCreateOrConnectWithoutVenueInput | Prisma.SeasonDefaultVenueCreateOrConnectWithoutVenueInput[];
    createMany?: Prisma.SeasonDefaultVenueCreateManyVenueInputEnvelope;
    connect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
};
export type SeasonDefaultVenueUpdateManyWithoutVenueNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutVenueInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput> | Prisma.SeasonDefaultVenueCreateWithoutVenueInput[] | Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput[];
    connectOrCreate?: Prisma.SeasonDefaultVenueCreateOrConnectWithoutVenueInput | Prisma.SeasonDefaultVenueCreateOrConnectWithoutVenueInput[];
    upsert?: Prisma.SeasonDefaultVenueUpsertWithWhereUniqueWithoutVenueInput | Prisma.SeasonDefaultVenueUpsertWithWhereUniqueWithoutVenueInput[];
    createMany?: Prisma.SeasonDefaultVenueCreateManyVenueInputEnvelope;
    set?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    disconnect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    delete?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    connect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    update?: Prisma.SeasonDefaultVenueUpdateWithWhereUniqueWithoutVenueInput | Prisma.SeasonDefaultVenueUpdateWithWhereUniqueWithoutVenueInput[];
    updateMany?: Prisma.SeasonDefaultVenueUpdateManyWithWhereWithoutVenueInput | Prisma.SeasonDefaultVenueUpdateManyWithWhereWithoutVenueInput[];
    deleteMany?: Prisma.SeasonDefaultVenueScalarWhereInput | Prisma.SeasonDefaultVenueScalarWhereInput[];
};
export type SeasonDefaultVenueUncheckedUpdateManyWithoutVenueNestedInput = {
    create?: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutVenueInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput> | Prisma.SeasonDefaultVenueCreateWithoutVenueInput[] | Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput[];
    connectOrCreate?: Prisma.SeasonDefaultVenueCreateOrConnectWithoutVenueInput | Prisma.SeasonDefaultVenueCreateOrConnectWithoutVenueInput[];
    upsert?: Prisma.SeasonDefaultVenueUpsertWithWhereUniqueWithoutVenueInput | Prisma.SeasonDefaultVenueUpsertWithWhereUniqueWithoutVenueInput[];
    createMany?: Prisma.SeasonDefaultVenueCreateManyVenueInputEnvelope;
    set?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    disconnect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    delete?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    connect?: Prisma.SeasonDefaultVenueWhereUniqueInput | Prisma.SeasonDefaultVenueWhereUniqueInput[];
    update?: Prisma.SeasonDefaultVenueUpdateWithWhereUniqueWithoutVenueInput | Prisma.SeasonDefaultVenueUpdateWithWhereUniqueWithoutVenueInput[];
    updateMany?: Prisma.SeasonDefaultVenueUpdateManyWithWhereWithoutVenueInput | Prisma.SeasonDefaultVenueUpdateManyWithWhereWithoutVenueInput[];
    deleteMany?: Prisma.SeasonDefaultVenueScalarWhereInput | Prisma.SeasonDefaultVenueScalarWhereInput[];
};
export type SeasonDefaultVenueCreateWithoutSeasonInput = {
    venue: Prisma.VenueCreateNestedOneWithoutSeasonDefaultVenuesInput;
};
export type SeasonDefaultVenueUncheckedCreateWithoutSeasonInput = {
    venue_id: number;
};
export type SeasonDefaultVenueCreateOrConnectWithoutSeasonInput = {
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutSeasonInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput>;
};
export type SeasonDefaultVenueCreateManySeasonInputEnvelope = {
    data: Prisma.SeasonDefaultVenueCreateManySeasonInput | Prisma.SeasonDefaultVenueCreateManySeasonInput[];
    skipDuplicates?: boolean;
};
export type SeasonDefaultVenueUpsertWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonDefaultVenueUpdateWithoutSeasonInput, Prisma.SeasonDefaultVenueUncheckedUpdateWithoutSeasonInput>;
    create: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutSeasonInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutSeasonInput>;
};
export type SeasonDefaultVenueUpdateWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonDefaultVenueUpdateWithoutSeasonInput, Prisma.SeasonDefaultVenueUncheckedUpdateWithoutSeasonInput>;
};
export type SeasonDefaultVenueUpdateManyWithWhereWithoutSeasonInput = {
    where: Prisma.SeasonDefaultVenueScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonDefaultVenueUpdateManyMutationInput, Prisma.SeasonDefaultVenueUncheckedUpdateManyWithoutSeasonInput>;
};
export type SeasonDefaultVenueScalarWhereInput = {
    AND?: Prisma.SeasonDefaultVenueScalarWhereInput | Prisma.SeasonDefaultVenueScalarWhereInput[];
    OR?: Prisma.SeasonDefaultVenueScalarWhereInput[];
    NOT?: Prisma.SeasonDefaultVenueScalarWhereInput | Prisma.SeasonDefaultVenueScalarWhereInput[];
    season_id?: Prisma.IntFilter<"SeasonDefaultVenue"> | number;
    venue_id?: Prisma.IntFilter<"SeasonDefaultVenue"> | number;
};
export type SeasonDefaultVenueCreateWithoutVenueInput = {
    season: Prisma.SeasonCreateNestedOneWithoutDefault_venuesInput;
};
export type SeasonDefaultVenueUncheckedCreateWithoutVenueInput = {
    season_id: number;
};
export type SeasonDefaultVenueCreateOrConnectWithoutVenueInput = {
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
    create: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutVenueInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput>;
};
export type SeasonDefaultVenueCreateManyVenueInputEnvelope = {
    data: Prisma.SeasonDefaultVenueCreateManyVenueInput | Prisma.SeasonDefaultVenueCreateManyVenueInput[];
    skipDuplicates?: boolean;
};
export type SeasonDefaultVenueUpsertWithWhereUniqueWithoutVenueInput = {
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
    update: Prisma.XOR<Prisma.SeasonDefaultVenueUpdateWithoutVenueInput, Prisma.SeasonDefaultVenueUncheckedUpdateWithoutVenueInput>;
    create: Prisma.XOR<Prisma.SeasonDefaultVenueCreateWithoutVenueInput, Prisma.SeasonDefaultVenueUncheckedCreateWithoutVenueInput>;
};
export type SeasonDefaultVenueUpdateWithWhereUniqueWithoutVenueInput = {
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
    data: Prisma.XOR<Prisma.SeasonDefaultVenueUpdateWithoutVenueInput, Prisma.SeasonDefaultVenueUncheckedUpdateWithoutVenueInput>;
};
export type SeasonDefaultVenueUpdateManyWithWhereWithoutVenueInput = {
    where: Prisma.SeasonDefaultVenueScalarWhereInput;
    data: Prisma.XOR<Prisma.SeasonDefaultVenueUpdateManyMutationInput, Prisma.SeasonDefaultVenueUncheckedUpdateManyWithoutVenueInput>;
};
export type SeasonDefaultVenueCreateManySeasonInput = {
    venue_id: number;
};
export type SeasonDefaultVenueUpdateWithoutSeasonInput = {
    venue?: Prisma.VenueUpdateOneRequiredWithoutSeasonDefaultVenuesNestedInput;
};
export type SeasonDefaultVenueUncheckedUpdateWithoutSeasonInput = {
    venue_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SeasonDefaultVenueUncheckedUpdateManyWithoutSeasonInput = {
    venue_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SeasonDefaultVenueCreateManyVenueInput = {
    season_id: number;
};
export type SeasonDefaultVenueUpdateWithoutVenueInput = {
    season?: Prisma.SeasonUpdateOneRequiredWithoutDefault_venuesNestedInput;
};
export type SeasonDefaultVenueUncheckedUpdateWithoutVenueInput = {
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SeasonDefaultVenueUncheckedUpdateManyWithoutVenueInput = {
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SeasonDefaultVenueSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    season_id?: boolean;
    venue_id?: boolean;
    season?: boolean | Prisma.SeasonDefaultArgs<ExtArgs>;
    venue?: boolean | Prisma.VenueDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["seasonDefaultVenue"]>;
export type SeasonDefaultVenueSelectScalar = {
    season_id?: boolean;
    venue_id?: boolean;
};
export type SeasonDefaultVenueOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"season_id" | "venue_id", ExtArgs["result"]["seasonDefaultVenue"]>;
export type SeasonDefaultVenueInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    season?: boolean | Prisma.SeasonDefaultArgs<ExtArgs>;
    venue?: boolean | Prisma.VenueDefaultArgs<ExtArgs>;
};
export type $SeasonDefaultVenuePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SeasonDefaultVenue";
    objects: {
        season: Prisma.$SeasonPayload<ExtArgs>;
        venue: Prisma.$VenuePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        season_id: number;
        venue_id: number;
    }, ExtArgs["result"]["seasonDefaultVenue"]>;
    composites: {};
};
export type SeasonDefaultVenueGetPayload<S extends boolean | null | undefined | SeasonDefaultVenueDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload, S>;
export type SeasonDefaultVenueCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SeasonDefaultVenueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SeasonDefaultVenueCountAggregateInputType | true;
};
export interface SeasonDefaultVenueDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SeasonDefaultVenue'];
        meta: {
            name: 'SeasonDefaultVenue';
        };
    };
    /**
     * Find zero or one SeasonDefaultVenue that matches the filter.
     * @param {SeasonDefaultVenueFindUniqueArgs} args - Arguments to find a SeasonDefaultVenue
     * @example
     * // Get one SeasonDefaultVenue
     * const seasonDefaultVenue = await prisma.seasonDefaultVenue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeasonDefaultVenueFindUniqueArgs>(args: Prisma.SelectSubset<T, SeasonDefaultVenueFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SeasonDefaultVenueClient<runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one SeasonDefaultVenue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeasonDefaultVenueFindUniqueOrThrowArgs} args - Arguments to find a SeasonDefaultVenue
     * @example
     * // Get one SeasonDefaultVenue
     * const seasonDefaultVenue = await prisma.seasonDefaultVenue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeasonDefaultVenueFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SeasonDefaultVenueFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonDefaultVenueClient<runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SeasonDefaultVenue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonDefaultVenueFindFirstArgs} args - Arguments to find a SeasonDefaultVenue
     * @example
     * // Get one SeasonDefaultVenue
     * const seasonDefaultVenue = await prisma.seasonDefaultVenue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeasonDefaultVenueFindFirstArgs>(args?: Prisma.SelectSubset<T, SeasonDefaultVenueFindFirstArgs<ExtArgs>>): Prisma.Prisma__SeasonDefaultVenueClient<runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SeasonDefaultVenue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonDefaultVenueFindFirstOrThrowArgs} args - Arguments to find a SeasonDefaultVenue
     * @example
     * // Get one SeasonDefaultVenue
     * const seasonDefaultVenue = await prisma.seasonDefaultVenue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeasonDefaultVenueFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SeasonDefaultVenueFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SeasonDefaultVenueClient<runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more SeasonDefaultVenues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonDefaultVenueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeasonDefaultVenues
     * const seasonDefaultVenues = await prisma.seasonDefaultVenue.findMany()
     *
     * // Get first 10 SeasonDefaultVenues
     * const seasonDefaultVenues = await prisma.seasonDefaultVenue.findMany({ take: 10 })
     *
     * // Only select the `season_id`
     * const seasonDefaultVenueWithSeason_idOnly = await prisma.seasonDefaultVenue.findMany({ select: { season_id: true } })
     *
     */
    findMany<T extends SeasonDefaultVenueFindManyArgs>(args?: Prisma.SelectSubset<T, SeasonDefaultVenueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a SeasonDefaultVenue.
     * @param {SeasonDefaultVenueCreateArgs} args - Arguments to create a SeasonDefaultVenue.
     * @example
     * // Create one SeasonDefaultVenue
     * const SeasonDefaultVenue = await prisma.seasonDefaultVenue.create({
     *   data: {
     *     // ... data to create a SeasonDefaultVenue
     *   }
     * })
     *
     */
    create<T extends SeasonDefaultVenueCreateArgs>(args: Prisma.SelectSubset<T, SeasonDefaultVenueCreateArgs<ExtArgs>>): Prisma.Prisma__SeasonDefaultVenueClient<runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many SeasonDefaultVenues.
     * @param {SeasonDefaultVenueCreateManyArgs} args - Arguments to create many SeasonDefaultVenues.
     * @example
     * // Create many SeasonDefaultVenues
     * const seasonDefaultVenue = await prisma.seasonDefaultVenue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SeasonDefaultVenueCreateManyArgs>(args?: Prisma.SelectSubset<T, SeasonDefaultVenueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a SeasonDefaultVenue.
     * @param {SeasonDefaultVenueDeleteArgs} args - Arguments to delete one SeasonDefaultVenue.
     * @example
     * // Delete one SeasonDefaultVenue
     * const SeasonDefaultVenue = await prisma.seasonDefaultVenue.delete({
     *   where: {
     *     // ... filter to delete one SeasonDefaultVenue
     *   }
     * })
     *
     */
    delete<T extends SeasonDefaultVenueDeleteArgs>(args: Prisma.SelectSubset<T, SeasonDefaultVenueDeleteArgs<ExtArgs>>): Prisma.Prisma__SeasonDefaultVenueClient<runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one SeasonDefaultVenue.
     * @param {SeasonDefaultVenueUpdateArgs} args - Arguments to update one SeasonDefaultVenue.
     * @example
     * // Update one SeasonDefaultVenue
     * const seasonDefaultVenue = await prisma.seasonDefaultVenue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SeasonDefaultVenueUpdateArgs>(args: Prisma.SelectSubset<T, SeasonDefaultVenueUpdateArgs<ExtArgs>>): Prisma.Prisma__SeasonDefaultVenueClient<runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more SeasonDefaultVenues.
     * @param {SeasonDefaultVenueDeleteManyArgs} args - Arguments to filter SeasonDefaultVenues to delete.
     * @example
     * // Delete a few SeasonDefaultVenues
     * const { count } = await prisma.seasonDefaultVenue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SeasonDefaultVenueDeleteManyArgs>(args?: Prisma.SelectSubset<T, SeasonDefaultVenueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more SeasonDefaultVenues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonDefaultVenueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeasonDefaultVenues
     * const seasonDefaultVenue = await prisma.seasonDefaultVenue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SeasonDefaultVenueUpdateManyArgs>(args: Prisma.SelectSubset<T, SeasonDefaultVenueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one SeasonDefaultVenue.
     * @param {SeasonDefaultVenueUpsertArgs} args - Arguments to update or create a SeasonDefaultVenue.
     * @example
     * // Update or create a SeasonDefaultVenue
     * const seasonDefaultVenue = await prisma.seasonDefaultVenue.upsert({
     *   create: {
     *     // ... data to create a SeasonDefaultVenue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeasonDefaultVenue we want to update
     *   }
     * })
     */
    upsert<T extends SeasonDefaultVenueUpsertArgs>(args: Prisma.SelectSubset<T, SeasonDefaultVenueUpsertArgs<ExtArgs>>): Prisma.Prisma__SeasonDefaultVenueClient<runtime.Types.Result.GetResult<Prisma.$SeasonDefaultVenuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of SeasonDefaultVenues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonDefaultVenueCountArgs} args - Arguments to filter SeasonDefaultVenues to count.
     * @example
     * // Count the number of SeasonDefaultVenues
     * const count = await prisma.seasonDefaultVenue.count({
     *   where: {
     *     // ... the filter for the SeasonDefaultVenues we want to count
     *   }
     * })
    **/
    count<T extends SeasonDefaultVenueCountArgs>(args?: Prisma.Subset<T, SeasonDefaultVenueCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SeasonDefaultVenueCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a SeasonDefaultVenue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonDefaultVenueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SeasonDefaultVenueAggregateArgs>(args: Prisma.Subset<T, SeasonDefaultVenueAggregateArgs>): Prisma.PrismaPromise<GetSeasonDefaultVenueAggregateType<T>>;
    /**
     * Group by SeasonDefaultVenue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonDefaultVenueGroupByArgs} args - Group by arguments.
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
    groupBy<T extends SeasonDefaultVenueGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SeasonDefaultVenueGroupByArgs['orderBy'];
    } : {
        orderBy?: SeasonDefaultVenueGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SeasonDefaultVenueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeasonDefaultVenueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the SeasonDefaultVenue model
     */
    readonly fields: SeasonDefaultVenueFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for SeasonDefaultVenue.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__SeasonDefaultVenueClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    season<T extends Prisma.SeasonDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonDefaultArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    venue<T extends Prisma.VenueDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VenueDefaultArgs<ExtArgs>>): Prisma.Prisma__VenueClient<runtime.Types.Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the SeasonDefaultVenue model
 */
export interface SeasonDefaultVenueFieldRefs {
    readonly season_id: Prisma.FieldRef<"SeasonDefaultVenue", 'Int'>;
    readonly venue_id: Prisma.FieldRef<"SeasonDefaultVenue", 'Int'>;
}
/**
 * SeasonDefaultVenue findUnique
 */
export type SeasonDefaultVenueFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonDefaultVenue to fetch.
     */
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
};
/**
 * SeasonDefaultVenue findUniqueOrThrow
 */
export type SeasonDefaultVenueFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonDefaultVenue to fetch.
     */
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
};
/**
 * SeasonDefaultVenue findFirst
 */
export type SeasonDefaultVenueFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonDefaultVenue to fetch.
     */
    where?: Prisma.SeasonDefaultVenueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonDefaultVenues to fetch.
     */
    orderBy?: Prisma.SeasonDefaultVenueOrderByWithRelationInput | Prisma.SeasonDefaultVenueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeasonDefaultVenues.
     */
    cursor?: Prisma.SeasonDefaultVenueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonDefaultVenues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonDefaultVenues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonDefaultVenues.
     */
    distinct?: Prisma.SeasonDefaultVenueScalarFieldEnum | Prisma.SeasonDefaultVenueScalarFieldEnum[];
};
/**
 * SeasonDefaultVenue findFirstOrThrow
 */
export type SeasonDefaultVenueFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonDefaultVenue to fetch.
     */
    where?: Prisma.SeasonDefaultVenueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonDefaultVenues to fetch.
     */
    orderBy?: Prisma.SeasonDefaultVenueOrderByWithRelationInput | Prisma.SeasonDefaultVenueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeasonDefaultVenues.
     */
    cursor?: Prisma.SeasonDefaultVenueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonDefaultVenues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonDefaultVenues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonDefaultVenues.
     */
    distinct?: Prisma.SeasonDefaultVenueScalarFieldEnum | Prisma.SeasonDefaultVenueScalarFieldEnum[];
};
/**
 * SeasonDefaultVenue findMany
 */
export type SeasonDefaultVenueFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
    /**
     * Filter, which SeasonDefaultVenues to fetch.
     */
    where?: Prisma.SeasonDefaultVenueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeasonDefaultVenues to fetch.
     */
    orderBy?: Prisma.SeasonDefaultVenueOrderByWithRelationInput | Prisma.SeasonDefaultVenueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SeasonDefaultVenues.
     */
    cursor?: Prisma.SeasonDefaultVenueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeasonDefaultVenues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeasonDefaultVenues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeasonDefaultVenues.
     */
    distinct?: Prisma.SeasonDefaultVenueScalarFieldEnum | Prisma.SeasonDefaultVenueScalarFieldEnum[];
};
/**
 * SeasonDefaultVenue create
 */
export type SeasonDefaultVenueCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
    /**
     * The data needed to create a SeasonDefaultVenue.
     */
    data: Prisma.XOR<Prisma.SeasonDefaultVenueCreateInput, Prisma.SeasonDefaultVenueUncheckedCreateInput>;
};
/**
 * SeasonDefaultVenue createMany
 */
export type SeasonDefaultVenueCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeasonDefaultVenues.
     */
    data: Prisma.SeasonDefaultVenueCreateManyInput | Prisma.SeasonDefaultVenueCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * SeasonDefaultVenue update
 */
export type SeasonDefaultVenueUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
    /**
     * The data needed to update a SeasonDefaultVenue.
     */
    data: Prisma.XOR<Prisma.SeasonDefaultVenueUpdateInput, Prisma.SeasonDefaultVenueUncheckedUpdateInput>;
    /**
     * Choose, which SeasonDefaultVenue to update.
     */
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
};
/**
 * SeasonDefaultVenue updateMany
 */
export type SeasonDefaultVenueUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update SeasonDefaultVenues.
     */
    data: Prisma.XOR<Prisma.SeasonDefaultVenueUpdateManyMutationInput, Prisma.SeasonDefaultVenueUncheckedUpdateManyInput>;
    /**
     * Filter which SeasonDefaultVenues to update
     */
    where?: Prisma.SeasonDefaultVenueWhereInput;
    /**
     * Limit how many SeasonDefaultVenues to update.
     */
    limit?: number;
};
/**
 * SeasonDefaultVenue upsert
 */
export type SeasonDefaultVenueUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
    /**
     * The filter to search for the SeasonDefaultVenue to update in case it exists.
     */
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
    /**
     * In case the SeasonDefaultVenue found by the `where` argument doesn't exist, create a new SeasonDefaultVenue with this data.
     */
    create: Prisma.XOR<Prisma.SeasonDefaultVenueCreateInput, Prisma.SeasonDefaultVenueUncheckedCreateInput>;
    /**
     * In case the SeasonDefaultVenue was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.SeasonDefaultVenueUpdateInput, Prisma.SeasonDefaultVenueUncheckedUpdateInput>;
};
/**
 * SeasonDefaultVenue delete
 */
export type SeasonDefaultVenueDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
    /**
     * Filter which SeasonDefaultVenue to delete.
     */
    where: Prisma.SeasonDefaultVenueWhereUniqueInput;
};
/**
 * SeasonDefaultVenue deleteMany
 */
export type SeasonDefaultVenueDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonDefaultVenues to delete
     */
    where?: Prisma.SeasonDefaultVenueWhereInput;
    /**
     * Limit how many SeasonDefaultVenues to delete.
     */
    limit?: number;
};
/**
 * SeasonDefaultVenue without action
 */
export type SeasonDefaultVenueDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonDefaultVenue
     */
    select?: Prisma.SeasonDefaultVenueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SeasonDefaultVenue
     */
    omit?: Prisma.SeasonDefaultVenueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SeasonDefaultVenueInclude<ExtArgs> | null;
};
//# sourceMappingURL=SeasonDefaultVenue.d.ts.map