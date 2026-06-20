import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model ArticleMedia
 *
 */
export type ArticleMediaModel = runtime.Types.Result.DefaultSelection<Prisma.$ArticleMediaPayload>;
export type AggregateArticleMedia = {
    _count: ArticleMediaCountAggregateOutputType | null;
    _avg: ArticleMediaAvgAggregateOutputType | null;
    _sum: ArticleMediaSumAggregateOutputType | null;
    _min: ArticleMediaMinAggregateOutputType | null;
    _max: ArticleMediaMaxAggregateOutputType | null;
};
export type ArticleMediaAvgAggregateOutputType = {
    id: number | null;
    article_id: number | null;
    order: number | null;
};
export type ArticleMediaSumAggregateOutputType = {
    id: number | null;
    article_id: number | null;
    order: number | null;
};
export type ArticleMediaMinAggregateOutputType = {
    id: number | null;
    article_id: number | null;
    type: $Enums.MediaType | null;
    url: string | null;
    caption: string | null;
    order: number | null;
    created_at: Date | null;
};
export type ArticleMediaMaxAggregateOutputType = {
    id: number | null;
    article_id: number | null;
    type: $Enums.MediaType | null;
    url: string | null;
    caption: string | null;
    order: number | null;
    created_at: Date | null;
};
export type ArticleMediaCountAggregateOutputType = {
    id: number;
    article_id: number;
    type: number;
    url: number;
    caption: number;
    order: number;
    created_at: number;
    _all: number;
};
export type ArticleMediaAvgAggregateInputType = {
    id?: true;
    article_id?: true;
    order?: true;
};
export type ArticleMediaSumAggregateInputType = {
    id?: true;
    article_id?: true;
    order?: true;
};
export type ArticleMediaMinAggregateInputType = {
    id?: true;
    article_id?: true;
    type?: true;
    url?: true;
    caption?: true;
    order?: true;
    created_at?: true;
};
export type ArticleMediaMaxAggregateInputType = {
    id?: true;
    article_id?: true;
    type?: true;
    url?: true;
    caption?: true;
    order?: true;
    created_at?: true;
};
export type ArticleMediaCountAggregateInputType = {
    id?: true;
    article_id?: true;
    type?: true;
    url?: true;
    caption?: true;
    order?: true;
    created_at?: true;
    _all?: true;
};
export type ArticleMediaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleMedia to aggregate.
     */
    where?: Prisma.ArticleMediaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ArticleMedias to fetch.
     */
    orderBy?: Prisma.ArticleMediaOrderByWithRelationInput | Prisma.ArticleMediaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ArticleMediaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ArticleMedias from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ArticleMedias.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ArticleMedias
    **/
    _count?: true | ArticleMediaCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ArticleMediaAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ArticleMediaSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMediaMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMediaMaxAggregateInputType;
};
export type GetArticleMediaAggregateType<T extends ArticleMediaAggregateArgs> = {
    [P in keyof T & keyof AggregateArticleMedia]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateArticleMedia[P]> : Prisma.GetScalarType<T[P], AggregateArticleMedia[P]>;
};
export type ArticleMediaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleMediaWhereInput;
    orderBy?: Prisma.ArticleMediaOrderByWithAggregationInput | Prisma.ArticleMediaOrderByWithAggregationInput[];
    by: Prisma.ArticleMediaScalarFieldEnum[] | Prisma.ArticleMediaScalarFieldEnum;
    having?: Prisma.ArticleMediaScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ArticleMediaCountAggregateInputType | true;
    _avg?: ArticleMediaAvgAggregateInputType;
    _sum?: ArticleMediaSumAggregateInputType;
    _min?: ArticleMediaMinAggregateInputType;
    _max?: ArticleMediaMaxAggregateInputType;
};
export type ArticleMediaGroupByOutputType = {
    id: number;
    article_id: number;
    type: $Enums.MediaType;
    url: string;
    caption: string | null;
    order: number;
    created_at: Date;
    _count: ArticleMediaCountAggregateOutputType | null;
    _avg: ArticleMediaAvgAggregateOutputType | null;
    _sum: ArticleMediaSumAggregateOutputType | null;
    _min: ArticleMediaMinAggregateOutputType | null;
    _max: ArticleMediaMaxAggregateOutputType | null;
};
export type GetArticleMediaGroupByPayload<T extends ArticleMediaGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ArticleMediaGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ArticleMediaGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ArticleMediaGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ArticleMediaGroupByOutputType[P]>;
}>>;
export type ArticleMediaWhereInput = {
    AND?: Prisma.ArticleMediaWhereInput | Prisma.ArticleMediaWhereInput[];
    OR?: Prisma.ArticleMediaWhereInput[];
    NOT?: Prisma.ArticleMediaWhereInput | Prisma.ArticleMediaWhereInput[];
    id?: Prisma.IntFilter<"ArticleMedia"> | number;
    article_id?: Prisma.IntFilter<"ArticleMedia"> | number;
    type?: Prisma.EnumMediaTypeFilter<"ArticleMedia"> | $Enums.MediaType;
    url?: Prisma.StringFilter<"ArticleMedia"> | string;
    caption?: Prisma.StringNullableFilter<"ArticleMedia"> | string | null;
    order?: Prisma.IntFilter<"ArticleMedia"> | number;
    created_at?: Prisma.DateTimeFilter<"ArticleMedia"> | Date | string;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
};
export type ArticleMediaOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    caption?: Prisma.SortOrderInput | Prisma.SortOrder;
    order?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    article?: Prisma.ArticleOrderByWithRelationInput;
    _relevance?: Prisma.ArticleMediaOrderByRelevanceInput;
};
export type ArticleMediaWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.ArticleMediaWhereInput | Prisma.ArticleMediaWhereInput[];
    OR?: Prisma.ArticleMediaWhereInput[];
    NOT?: Prisma.ArticleMediaWhereInput | Prisma.ArticleMediaWhereInput[];
    article_id?: Prisma.IntFilter<"ArticleMedia"> | number;
    type?: Prisma.EnumMediaTypeFilter<"ArticleMedia"> | $Enums.MediaType;
    url?: Prisma.StringFilter<"ArticleMedia"> | string;
    caption?: Prisma.StringNullableFilter<"ArticleMedia"> | string | null;
    order?: Prisma.IntFilter<"ArticleMedia"> | number;
    created_at?: Prisma.DateTimeFilter<"ArticleMedia"> | Date | string;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
}, "id">;
export type ArticleMediaOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    caption?: Prisma.SortOrderInput | Prisma.SortOrder;
    order?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.ArticleMediaCountOrderByAggregateInput;
    _avg?: Prisma.ArticleMediaAvgOrderByAggregateInput;
    _max?: Prisma.ArticleMediaMaxOrderByAggregateInput;
    _min?: Prisma.ArticleMediaMinOrderByAggregateInput;
    _sum?: Prisma.ArticleMediaSumOrderByAggregateInput;
};
export type ArticleMediaScalarWhereWithAggregatesInput = {
    AND?: Prisma.ArticleMediaScalarWhereWithAggregatesInput | Prisma.ArticleMediaScalarWhereWithAggregatesInput[];
    OR?: Prisma.ArticleMediaScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ArticleMediaScalarWhereWithAggregatesInput | Prisma.ArticleMediaScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ArticleMedia"> | number;
    article_id?: Prisma.IntWithAggregatesFilter<"ArticleMedia"> | number;
    type?: Prisma.EnumMediaTypeWithAggregatesFilter<"ArticleMedia"> | $Enums.MediaType;
    url?: Prisma.StringWithAggregatesFilter<"ArticleMedia"> | string;
    caption?: Prisma.StringNullableWithAggregatesFilter<"ArticleMedia"> | string | null;
    order?: Prisma.IntWithAggregatesFilter<"ArticleMedia"> | number;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"ArticleMedia"> | Date | string;
};
export type ArticleMediaCreateInput = {
    type: $Enums.MediaType;
    url: string;
    caption?: string | null;
    order?: number;
    created_at?: Date | string;
    article: Prisma.ArticleCreateNestedOneWithoutMediaInput;
};
export type ArticleMediaUncheckedCreateInput = {
    id?: number;
    article_id: number;
    type: $Enums.MediaType;
    url: string;
    caption?: string | null;
    order?: number;
    created_at?: Date | string;
};
export type ArticleMediaUpdateInput = {
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    article?: Prisma.ArticleUpdateOneRequiredWithoutMediaNestedInput;
};
export type ArticleMediaUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    article_id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ArticleMediaCreateManyInput = {
    id?: number;
    article_id: number;
    type: $Enums.MediaType;
    url: string;
    caption?: string | null;
    order?: number;
    created_at?: Date | string;
};
export type ArticleMediaUpdateManyMutationInput = {
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ArticleMediaUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    article_id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ArticleMediaListRelationFilter = {
    every?: Prisma.ArticleMediaWhereInput;
    some?: Prisma.ArticleMediaWhereInput;
    none?: Prisma.ArticleMediaWhereInput;
};
export type ArticleMediaOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ArticleMediaOrderByRelevanceInput = {
    fields: Prisma.ArticleMediaOrderByRelevanceFieldEnum | Prisma.ArticleMediaOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type ArticleMediaCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    caption?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ArticleMediaAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
};
export type ArticleMediaMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    caption?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ArticleMediaMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    caption?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ArticleMediaSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
};
export type ArticleMediaCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput> | Prisma.ArticleMediaCreateWithoutArticleInput[] | Prisma.ArticleMediaUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutArticleInput | Prisma.ArticleMediaCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleMediaCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
};
export type ArticleMediaUncheckedCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput> | Prisma.ArticleMediaCreateWithoutArticleInput[] | Prisma.ArticleMediaUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutArticleInput | Prisma.ArticleMediaCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleMediaCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
};
export type ArticleMediaUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput> | Prisma.ArticleMediaCreateWithoutArticleInput[] | Prisma.ArticleMediaUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutArticleInput | Prisma.ArticleMediaCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleMediaUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleMediaUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleMediaCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    disconnect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    delete?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    update?: Prisma.ArticleMediaUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleMediaUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleMediaUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleMediaUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
};
export type ArticleMediaUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput> | Prisma.ArticleMediaCreateWithoutArticleInput[] | Prisma.ArticleMediaUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutArticleInput | Prisma.ArticleMediaCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleMediaUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleMediaUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleMediaCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    disconnect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    delete?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    update?: Prisma.ArticleMediaUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleMediaUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleMediaUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleMediaUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
};
export type EnumMediaTypeFieldUpdateOperationsInput = {
    set?: $Enums.MediaType;
};
export type ArticleMediaCreateWithoutArticleInput = {
    type: $Enums.MediaType;
    url: string;
    caption?: string | null;
    order?: number;
    created_at?: Date | string;
};
export type ArticleMediaUncheckedCreateWithoutArticleInput = {
    id?: number;
    type: $Enums.MediaType;
    url: string;
    caption?: string | null;
    order?: number;
    created_at?: Date | string;
};
export type ArticleMediaCreateOrConnectWithoutArticleInput = {
    where: Prisma.ArticleMediaWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput>;
};
export type ArticleMediaCreateManyArticleInputEnvelope = {
    data: Prisma.ArticleMediaCreateManyArticleInput | Prisma.ArticleMediaCreateManyArticleInput[];
    skipDuplicates?: boolean;
};
export type ArticleMediaUpsertWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleMediaWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleMediaUpdateWithoutArticleInput, Prisma.ArticleMediaUncheckedUpdateWithoutArticleInput>;
    create: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput>;
};
export type ArticleMediaUpdateWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleMediaWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleMediaUpdateWithoutArticleInput, Prisma.ArticleMediaUncheckedUpdateWithoutArticleInput>;
};
export type ArticleMediaUpdateManyWithWhereWithoutArticleInput = {
    where: Prisma.ArticleMediaScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleMediaUpdateManyMutationInput, Prisma.ArticleMediaUncheckedUpdateManyWithoutArticleInput>;
};
export type ArticleMediaScalarWhereInput = {
    AND?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
    OR?: Prisma.ArticleMediaScalarWhereInput[];
    NOT?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
    id?: Prisma.IntFilter<"ArticleMedia"> | number;
    article_id?: Prisma.IntFilter<"ArticleMedia"> | number;
    type?: Prisma.EnumMediaTypeFilter<"ArticleMedia"> | $Enums.MediaType;
    url?: Prisma.StringFilter<"ArticleMedia"> | string;
    caption?: Prisma.StringNullableFilter<"ArticleMedia"> | string | null;
    order?: Prisma.IntFilter<"ArticleMedia"> | number;
    created_at?: Prisma.DateTimeFilter<"ArticleMedia"> | Date | string;
};
export type ArticleMediaCreateManyArticleInput = {
    id?: number;
    type: $Enums.MediaType;
    url: string;
    caption?: string | null;
    order?: number;
    created_at?: Date | string;
};
export type ArticleMediaUpdateWithoutArticleInput = {
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ArticleMediaUncheckedUpdateWithoutArticleInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ArticleMediaUncheckedUpdateManyWithoutArticleInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ArticleMediaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    article_id?: boolean;
    type?: boolean;
    url?: boolean;
    caption?: boolean;
    order?: boolean;
    created_at?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleMedia"]>;
export type ArticleMediaSelectScalar = {
    id?: boolean;
    article_id?: boolean;
    type?: boolean;
    url?: boolean;
    caption?: boolean;
    order?: boolean;
    created_at?: boolean;
};
export type ArticleMediaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "article_id" | "type" | "url" | "caption" | "order" | "created_at", ExtArgs["result"]["articleMedia"]>;
export type ArticleMediaInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
};
export type $ArticleMediaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ArticleMedia";
    objects: {
        article: Prisma.$ArticlePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        article_id: number;
        type: $Enums.MediaType;
        url: string;
        caption: string | null;
        order: number;
        created_at: Date;
    }, ExtArgs["result"]["articleMedia"]>;
    composites: {};
};
export type ArticleMediaGetPayload<S extends boolean | null | undefined | ArticleMediaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload, S>;
export type ArticleMediaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ArticleMediaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ArticleMediaCountAggregateInputType | true;
};
export interface ArticleMediaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ArticleMedia'];
        meta: {
            name: 'ArticleMedia';
        };
    };
    /**
     * Find zero or one ArticleMedia that matches the filter.
     * @param {ArticleMediaFindUniqueArgs} args - Arguments to find a ArticleMedia
     * @example
     * // Get one ArticleMedia
     * const articleMedia = await prisma.articleMedia.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleMediaFindUniqueArgs>(args: Prisma.SelectSubset<T, ArticleMediaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ArticleMedia that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleMediaFindUniqueOrThrowArgs} args - Arguments to find a ArticleMedia
     * @example
     * // Get one ArticleMedia
     * const articleMedia = await prisma.articleMedia.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleMediaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ArticleMediaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ArticleMedia that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleMediaFindFirstArgs} args - Arguments to find a ArticleMedia
     * @example
     * // Get one ArticleMedia
     * const articleMedia = await prisma.articleMedia.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleMediaFindFirstArgs>(args?: Prisma.SelectSubset<T, ArticleMediaFindFirstArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ArticleMedia that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleMediaFindFirstOrThrowArgs} args - Arguments to find a ArticleMedia
     * @example
     * // Get one ArticleMedia
     * const articleMedia = await prisma.articleMedia.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleMediaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ArticleMediaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ArticleMedias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleMediaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleMedias
     * const articleMedias = await prisma.articleMedia.findMany()
     *
     * // Get first 10 ArticleMedias
     * const articleMedias = await prisma.articleMedia.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const articleMediaWithIdOnly = await prisma.articleMedia.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ArticleMediaFindManyArgs>(args?: Prisma.SelectSubset<T, ArticleMediaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ArticleMedia.
     * @param {ArticleMediaCreateArgs} args - Arguments to create a ArticleMedia.
     * @example
     * // Create one ArticleMedia
     * const ArticleMedia = await prisma.articleMedia.create({
     *   data: {
     *     // ... data to create a ArticleMedia
     *   }
     * })
     *
     */
    create<T extends ArticleMediaCreateArgs>(args: Prisma.SelectSubset<T, ArticleMediaCreateArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ArticleMedias.
     * @param {ArticleMediaCreateManyArgs} args - Arguments to create many ArticleMedias.
     * @example
     * // Create many ArticleMedias
     * const articleMedia = await prisma.articleMedia.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ArticleMediaCreateManyArgs>(args?: Prisma.SelectSubset<T, ArticleMediaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a ArticleMedia.
     * @param {ArticleMediaDeleteArgs} args - Arguments to delete one ArticleMedia.
     * @example
     * // Delete one ArticleMedia
     * const ArticleMedia = await prisma.articleMedia.delete({
     *   where: {
     *     // ... filter to delete one ArticleMedia
     *   }
     * })
     *
     */
    delete<T extends ArticleMediaDeleteArgs>(args: Prisma.SelectSubset<T, ArticleMediaDeleteArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ArticleMedia.
     * @param {ArticleMediaUpdateArgs} args - Arguments to update one ArticleMedia.
     * @example
     * // Update one ArticleMedia
     * const articleMedia = await prisma.articleMedia.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ArticleMediaUpdateArgs>(args: Prisma.SelectSubset<T, ArticleMediaUpdateArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ArticleMedias.
     * @param {ArticleMediaDeleteManyArgs} args - Arguments to filter ArticleMedias to delete.
     * @example
     * // Delete a few ArticleMedias
     * const { count } = await prisma.articleMedia.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ArticleMediaDeleteManyArgs>(args?: Prisma.SelectSubset<T, ArticleMediaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ArticleMedias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleMediaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleMedias
     * const articleMedia = await prisma.articleMedia.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ArticleMediaUpdateManyArgs>(args: Prisma.SelectSubset<T, ArticleMediaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one ArticleMedia.
     * @param {ArticleMediaUpsertArgs} args - Arguments to update or create a ArticleMedia.
     * @example
     * // Update or create a ArticleMedia
     * const articleMedia = await prisma.articleMedia.upsert({
     *   create: {
     *     // ... data to create a ArticleMedia
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleMedia we want to update
     *   }
     * })
     */
    upsert<T extends ArticleMediaUpsertArgs>(args: Prisma.SelectSubset<T, ArticleMediaUpsertArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ArticleMedias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleMediaCountArgs} args - Arguments to filter ArticleMedias to count.
     * @example
     * // Count the number of ArticleMedias
     * const count = await prisma.articleMedia.count({
     *   where: {
     *     // ... the filter for the ArticleMedias we want to count
     *   }
     * })
    **/
    count<T extends ArticleMediaCountArgs>(args?: Prisma.Subset<T, ArticleMediaCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ArticleMediaCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ArticleMedia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleMediaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ArticleMediaAggregateArgs>(args: Prisma.Subset<T, ArticleMediaAggregateArgs>): Prisma.PrismaPromise<GetArticleMediaAggregateType<T>>;
    /**
     * Group by ArticleMedia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleMediaGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ArticleMediaGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ArticleMediaGroupByArgs['orderBy'];
    } : {
        orderBy?: ArticleMediaGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ArticleMediaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleMediaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ArticleMedia model
     */
    readonly fields: ArticleMediaFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ArticleMedia.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ArticleMediaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    article<T extends Prisma.ArticleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ArticleDefaultArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the ArticleMedia model
 */
export interface ArticleMediaFieldRefs {
    readonly id: Prisma.FieldRef<"ArticleMedia", 'Int'>;
    readonly article_id: Prisma.FieldRef<"ArticleMedia", 'Int'>;
    readonly type: Prisma.FieldRef<"ArticleMedia", 'MediaType'>;
    readonly url: Prisma.FieldRef<"ArticleMedia", 'String'>;
    readonly caption: Prisma.FieldRef<"ArticleMedia", 'String'>;
    readonly order: Prisma.FieldRef<"ArticleMedia", 'Int'>;
    readonly created_at: Prisma.FieldRef<"ArticleMedia", 'DateTime'>;
}
/**
 * ArticleMedia findUnique
 */
export type ArticleMediaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleMedia to fetch.
     */
    where: Prisma.ArticleMediaWhereUniqueInput;
};
/**
 * ArticleMedia findUniqueOrThrow
 */
export type ArticleMediaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleMedia to fetch.
     */
    where: Prisma.ArticleMediaWhereUniqueInput;
};
/**
 * ArticleMedia findFirst
 */
export type ArticleMediaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleMedia to fetch.
     */
    where?: Prisma.ArticleMediaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ArticleMedias to fetch.
     */
    orderBy?: Prisma.ArticleMediaOrderByWithRelationInput | Prisma.ArticleMediaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ArticleMedias.
     */
    cursor?: Prisma.ArticleMediaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ArticleMedias from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ArticleMedias.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ArticleMedias.
     */
    distinct?: Prisma.ArticleMediaScalarFieldEnum | Prisma.ArticleMediaScalarFieldEnum[];
};
/**
 * ArticleMedia findFirstOrThrow
 */
export type ArticleMediaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleMedia to fetch.
     */
    where?: Prisma.ArticleMediaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ArticleMedias to fetch.
     */
    orderBy?: Prisma.ArticleMediaOrderByWithRelationInput | Prisma.ArticleMediaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ArticleMedias.
     */
    cursor?: Prisma.ArticleMediaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ArticleMedias from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ArticleMedias.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ArticleMedias.
     */
    distinct?: Prisma.ArticleMediaScalarFieldEnum | Prisma.ArticleMediaScalarFieldEnum[];
};
/**
 * ArticleMedia findMany
 */
export type ArticleMediaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleMedias to fetch.
     */
    where?: Prisma.ArticleMediaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ArticleMedias to fetch.
     */
    orderBy?: Prisma.ArticleMediaOrderByWithRelationInput | Prisma.ArticleMediaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ArticleMedias.
     */
    cursor?: Prisma.ArticleMediaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ArticleMedias from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ArticleMedias.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ArticleMedias.
     */
    distinct?: Prisma.ArticleMediaScalarFieldEnum | Prisma.ArticleMediaScalarFieldEnum[];
};
/**
 * ArticleMedia create
 */
export type ArticleMediaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    /**
     * The data needed to create a ArticleMedia.
     */
    data: Prisma.XOR<Prisma.ArticleMediaCreateInput, Prisma.ArticleMediaUncheckedCreateInput>;
};
/**
 * ArticleMedia createMany
 */
export type ArticleMediaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleMedias.
     */
    data: Prisma.ArticleMediaCreateManyInput | Prisma.ArticleMediaCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ArticleMedia update
 */
export type ArticleMediaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    /**
     * The data needed to update a ArticleMedia.
     */
    data: Prisma.XOR<Prisma.ArticleMediaUpdateInput, Prisma.ArticleMediaUncheckedUpdateInput>;
    /**
     * Choose, which ArticleMedia to update.
     */
    where: Prisma.ArticleMediaWhereUniqueInput;
};
/**
 * ArticleMedia updateMany
 */
export type ArticleMediaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleMedias.
     */
    data: Prisma.XOR<Prisma.ArticleMediaUpdateManyMutationInput, Prisma.ArticleMediaUncheckedUpdateManyInput>;
    /**
     * Filter which ArticleMedias to update
     */
    where?: Prisma.ArticleMediaWhereInput;
    /**
     * Limit how many ArticleMedias to update.
     */
    limit?: number;
};
/**
 * ArticleMedia upsert
 */
export type ArticleMediaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    /**
     * The filter to search for the ArticleMedia to update in case it exists.
     */
    where: Prisma.ArticleMediaWhereUniqueInput;
    /**
     * In case the ArticleMedia found by the `where` argument doesn't exist, create a new ArticleMedia with this data.
     */
    create: Prisma.XOR<Prisma.ArticleMediaCreateInput, Prisma.ArticleMediaUncheckedCreateInput>;
    /**
     * In case the ArticleMedia was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ArticleMediaUpdateInput, Prisma.ArticleMediaUncheckedUpdateInput>;
};
/**
 * ArticleMedia delete
 */
export type ArticleMediaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    /**
     * Filter which ArticleMedia to delete.
     */
    where: Prisma.ArticleMediaWhereUniqueInput;
};
/**
 * ArticleMedia deleteMany
 */
export type ArticleMediaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleMedias to delete
     */
    where?: Prisma.ArticleMediaWhereInput;
    /**
     * Limit how many ArticleMedias to delete.
     */
    limit?: number;
};
/**
 * ArticleMedia without action
 */
export type ArticleMediaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleMedia
     */
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleMedia
     */
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
};
//# sourceMappingURL=ArticleMedia.d.ts.map