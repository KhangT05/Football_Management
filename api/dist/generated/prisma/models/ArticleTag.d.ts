import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model ArticleTag
 *
 */
export type ArticleTagModel = runtime.Types.Result.DefaultSelection<Prisma.$ArticleTagPayload>;
export type AggregateArticleTag = {
    _count: ArticleTagCountAggregateOutputType | null;
    _avg: ArticleTagAvgAggregateOutputType | null;
    _sum: ArticleTagSumAggregateOutputType | null;
    _min: ArticleTagMinAggregateOutputType | null;
    _max: ArticleTagMaxAggregateOutputType | null;
};
export type ArticleTagAvgAggregateOutputType = {
    id: number | null;
    article_id: number | null;
};
export type ArticleTagSumAggregateOutputType = {
    id: number | null;
    article_id: number | null;
};
export type ArticleTagMinAggregateOutputType = {
    id: number | null;
    article_id: number | null;
    tag: string | null;
};
export type ArticleTagMaxAggregateOutputType = {
    id: number | null;
    article_id: number | null;
    tag: string | null;
};
export type ArticleTagCountAggregateOutputType = {
    id: number;
    article_id: number;
    tag: number;
    _all: number;
};
export type ArticleTagAvgAggregateInputType = {
    id?: true;
    article_id?: true;
};
export type ArticleTagSumAggregateInputType = {
    id?: true;
    article_id?: true;
};
export type ArticleTagMinAggregateInputType = {
    id?: true;
    article_id?: true;
    tag?: true;
};
export type ArticleTagMaxAggregateInputType = {
    id?: true;
    article_id?: true;
    tag?: true;
};
export type ArticleTagCountAggregateInputType = {
    id?: true;
    article_id?: true;
    tag?: true;
    _all?: true;
};
export type ArticleTagAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleTag to aggregate.
     */
    where?: Prisma.ArticleTagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ArticleTags to fetch.
     */
    orderBy?: Prisma.ArticleTagOrderByWithRelationInput | Prisma.ArticleTagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ArticleTagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ArticleTags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ArticleTags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ArticleTags
    **/
    _count?: true | ArticleTagCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ArticleTagAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ArticleTagSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ArticleTagMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ArticleTagMaxAggregateInputType;
};
export type GetArticleTagAggregateType<T extends ArticleTagAggregateArgs> = {
    [P in keyof T & keyof AggregateArticleTag]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateArticleTag[P]> : Prisma.GetScalarType<T[P], AggregateArticleTag[P]>;
};
export type ArticleTagGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleTagWhereInput;
    orderBy?: Prisma.ArticleTagOrderByWithAggregationInput | Prisma.ArticleTagOrderByWithAggregationInput[];
    by: Prisma.ArticleTagScalarFieldEnum[] | Prisma.ArticleTagScalarFieldEnum;
    having?: Prisma.ArticleTagScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ArticleTagCountAggregateInputType | true;
    _avg?: ArticleTagAvgAggregateInputType;
    _sum?: ArticleTagSumAggregateInputType;
    _min?: ArticleTagMinAggregateInputType;
    _max?: ArticleTagMaxAggregateInputType;
};
export type ArticleTagGroupByOutputType = {
    id: number;
    article_id: number;
    tag: string;
    _count: ArticleTagCountAggregateOutputType | null;
    _avg: ArticleTagAvgAggregateOutputType | null;
    _sum: ArticleTagSumAggregateOutputType | null;
    _min: ArticleTagMinAggregateOutputType | null;
    _max: ArticleTagMaxAggregateOutputType | null;
};
export type GetArticleTagGroupByPayload<T extends ArticleTagGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ArticleTagGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ArticleTagGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ArticleTagGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ArticleTagGroupByOutputType[P]>;
}>>;
export type ArticleTagWhereInput = {
    AND?: Prisma.ArticleTagWhereInput | Prisma.ArticleTagWhereInput[];
    OR?: Prisma.ArticleTagWhereInput[];
    NOT?: Prisma.ArticleTagWhereInput | Prisma.ArticleTagWhereInput[];
    id?: Prisma.IntFilter<"ArticleTag"> | number;
    article_id?: Prisma.IntFilter<"ArticleTag"> | number;
    tag?: Prisma.StringFilter<"ArticleTag"> | string;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
};
export type ArticleTagOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    tag?: Prisma.SortOrder;
    article?: Prisma.ArticleOrderByWithRelationInput;
    _relevance?: Prisma.ArticleTagOrderByRelevanceInput;
};
export type ArticleTagWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    article_id_tag?: Prisma.ArticleTagArticle_idTagCompoundUniqueInput;
    AND?: Prisma.ArticleTagWhereInput | Prisma.ArticleTagWhereInput[];
    OR?: Prisma.ArticleTagWhereInput[];
    NOT?: Prisma.ArticleTagWhereInput | Prisma.ArticleTagWhereInput[];
    article_id?: Prisma.IntFilter<"ArticleTag"> | number;
    tag?: Prisma.StringFilter<"ArticleTag"> | string;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
}, "id" | "article_id_tag">;
export type ArticleTagOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    tag?: Prisma.SortOrder;
    _count?: Prisma.ArticleTagCountOrderByAggregateInput;
    _avg?: Prisma.ArticleTagAvgOrderByAggregateInput;
    _max?: Prisma.ArticleTagMaxOrderByAggregateInput;
    _min?: Prisma.ArticleTagMinOrderByAggregateInput;
    _sum?: Prisma.ArticleTagSumOrderByAggregateInput;
};
export type ArticleTagScalarWhereWithAggregatesInput = {
    AND?: Prisma.ArticleTagScalarWhereWithAggregatesInput | Prisma.ArticleTagScalarWhereWithAggregatesInput[];
    OR?: Prisma.ArticleTagScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ArticleTagScalarWhereWithAggregatesInput | Prisma.ArticleTagScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ArticleTag"> | number;
    article_id?: Prisma.IntWithAggregatesFilter<"ArticleTag"> | number;
    tag?: Prisma.StringWithAggregatesFilter<"ArticleTag"> | string;
};
export type ArticleTagCreateInput = {
    tag: string;
    article: Prisma.ArticleCreateNestedOneWithoutTagsInput;
};
export type ArticleTagUncheckedCreateInput = {
    id?: number;
    article_id: number;
    tag: string;
};
export type ArticleTagUpdateInput = {
    tag?: Prisma.StringFieldUpdateOperationsInput | string;
    article?: Prisma.ArticleUpdateOneRequiredWithoutTagsNestedInput;
};
export type ArticleTagUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    article_id?: Prisma.IntFieldUpdateOperationsInput | number;
    tag?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagCreateManyInput = {
    id?: number;
    article_id: number;
    tag: string;
};
export type ArticleTagUpdateManyMutationInput = {
    tag?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    article_id?: Prisma.IntFieldUpdateOperationsInput | number;
    tag?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagListRelationFilter = {
    every?: Prisma.ArticleTagWhereInput;
    some?: Prisma.ArticleTagWhereInput;
    none?: Prisma.ArticleTagWhereInput;
};
export type ArticleTagOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ArticleTagOrderByRelevanceInput = {
    fields: Prisma.ArticleTagOrderByRelevanceFieldEnum | Prisma.ArticleTagOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type ArticleTagArticle_idTagCompoundUniqueInput = {
    article_id: number;
    tag: string;
};
export type ArticleTagCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    tag?: Prisma.SortOrder;
};
export type ArticleTagAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
};
export type ArticleTagMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    tag?: Prisma.SortOrder;
};
export type ArticleTagMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
    tag?: Prisma.SortOrder;
};
export type ArticleTagSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    article_id?: Prisma.SortOrder;
};
export type ArticleTagCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput> | Prisma.ArticleTagCreateWithoutArticleInput[] | Prisma.ArticleTagUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutArticleInput | Prisma.ArticleTagCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleTagCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
};
export type ArticleTagUncheckedCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput> | Prisma.ArticleTagCreateWithoutArticleInput[] | Prisma.ArticleTagUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutArticleInput | Prisma.ArticleTagCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleTagCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
};
export type ArticleTagUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput> | Prisma.ArticleTagCreateWithoutArticleInput[] | Prisma.ArticleTagUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutArticleInput | Prisma.ArticleTagCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleTagUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleTagUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleTagCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    disconnect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    delete?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    update?: Prisma.ArticleTagUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleTagUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleTagUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleTagUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
};
export type ArticleTagUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput> | Prisma.ArticleTagCreateWithoutArticleInput[] | Prisma.ArticleTagUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutArticleInput | Prisma.ArticleTagCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleTagUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleTagUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleTagCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    disconnect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    delete?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    update?: Prisma.ArticleTagUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleTagUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleTagUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleTagUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
};
export type ArticleTagCreateWithoutArticleInput = {
    tag: string;
};
export type ArticleTagUncheckedCreateWithoutArticleInput = {
    id?: number;
    tag: string;
};
export type ArticleTagCreateOrConnectWithoutArticleInput = {
    where: Prisma.ArticleTagWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput>;
};
export type ArticleTagCreateManyArticleInputEnvelope = {
    data: Prisma.ArticleTagCreateManyArticleInput | Prisma.ArticleTagCreateManyArticleInput[];
    skipDuplicates?: boolean;
};
export type ArticleTagUpsertWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleTagWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleTagUpdateWithoutArticleInput, Prisma.ArticleTagUncheckedUpdateWithoutArticleInput>;
    create: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput>;
};
export type ArticleTagUpdateWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleTagWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleTagUpdateWithoutArticleInput, Prisma.ArticleTagUncheckedUpdateWithoutArticleInput>;
};
export type ArticleTagUpdateManyWithWhereWithoutArticleInput = {
    where: Prisma.ArticleTagScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleTagUpdateManyMutationInput, Prisma.ArticleTagUncheckedUpdateManyWithoutArticleInput>;
};
export type ArticleTagScalarWhereInput = {
    AND?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
    OR?: Prisma.ArticleTagScalarWhereInput[];
    NOT?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
    id?: Prisma.IntFilter<"ArticleTag"> | number;
    article_id?: Prisma.IntFilter<"ArticleTag"> | number;
    tag?: Prisma.StringFilter<"ArticleTag"> | string;
};
export type ArticleTagCreateManyArticleInput = {
    id?: number;
    tag: string;
};
export type ArticleTagUpdateWithoutArticleInput = {
    tag?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagUncheckedUpdateWithoutArticleInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tag?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagUncheckedUpdateManyWithoutArticleInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tag?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    article_id?: boolean;
    tag?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleTag"]>;
export type ArticleTagSelectScalar = {
    id?: boolean;
    article_id?: boolean;
    tag?: boolean;
};
export type ArticleTagOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "article_id" | "tag", ExtArgs["result"]["articleTag"]>;
export type ArticleTagInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
};
export type $ArticleTagPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ArticleTag";
    objects: {
        article: Prisma.$ArticlePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        article_id: number;
        tag: string;
    }, ExtArgs["result"]["articleTag"]>;
    composites: {};
};
export type ArticleTagGetPayload<S extends boolean | null | undefined | ArticleTagDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload, S>;
export type ArticleTagCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ArticleTagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ArticleTagCountAggregateInputType | true;
};
export interface ArticleTagDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ArticleTag'];
        meta: {
            name: 'ArticleTag';
        };
    };
    /**
     * Find zero or one ArticleTag that matches the filter.
     * @param {ArticleTagFindUniqueArgs} args - Arguments to find a ArticleTag
     * @example
     * // Get one ArticleTag
     * const articleTag = await prisma.articleTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleTagFindUniqueArgs>(args: Prisma.SelectSubset<T, ArticleTagFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ArticleTag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleTagFindUniqueOrThrowArgs} args - Arguments to find a ArticleTag
     * @example
     * // Get one ArticleTag
     * const articleTag = await prisma.articleTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleTagFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ArticleTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ArticleTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleTagFindFirstArgs} args - Arguments to find a ArticleTag
     * @example
     * // Get one ArticleTag
     * const articleTag = await prisma.articleTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleTagFindFirstArgs>(args?: Prisma.SelectSubset<T, ArticleTagFindFirstArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ArticleTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleTagFindFirstOrThrowArgs} args - Arguments to find a ArticleTag
     * @example
     * // Get one ArticleTag
     * const articleTag = await prisma.articleTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleTagFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ArticleTagFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ArticleTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleTags
     * const articleTags = await prisma.articleTag.findMany()
     *
     * // Get first 10 ArticleTags
     * const articleTags = await prisma.articleTag.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const articleTagWithIdOnly = await prisma.articleTag.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ArticleTagFindManyArgs>(args?: Prisma.SelectSubset<T, ArticleTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ArticleTag.
     * @param {ArticleTagCreateArgs} args - Arguments to create a ArticleTag.
     * @example
     * // Create one ArticleTag
     * const ArticleTag = await prisma.articleTag.create({
     *   data: {
     *     // ... data to create a ArticleTag
     *   }
     * })
     *
     */
    create<T extends ArticleTagCreateArgs>(args: Prisma.SelectSubset<T, ArticleTagCreateArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ArticleTags.
     * @param {ArticleTagCreateManyArgs} args - Arguments to create many ArticleTags.
     * @example
     * // Create many ArticleTags
     * const articleTag = await prisma.articleTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ArticleTagCreateManyArgs>(args?: Prisma.SelectSubset<T, ArticleTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a ArticleTag.
     * @param {ArticleTagDeleteArgs} args - Arguments to delete one ArticleTag.
     * @example
     * // Delete one ArticleTag
     * const ArticleTag = await prisma.articleTag.delete({
     *   where: {
     *     // ... filter to delete one ArticleTag
     *   }
     * })
     *
     */
    delete<T extends ArticleTagDeleteArgs>(args: Prisma.SelectSubset<T, ArticleTagDeleteArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ArticleTag.
     * @param {ArticleTagUpdateArgs} args - Arguments to update one ArticleTag.
     * @example
     * // Update one ArticleTag
     * const articleTag = await prisma.articleTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ArticleTagUpdateArgs>(args: Prisma.SelectSubset<T, ArticleTagUpdateArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ArticleTags.
     * @param {ArticleTagDeleteManyArgs} args - Arguments to filter ArticleTags to delete.
     * @example
     * // Delete a few ArticleTags
     * const { count } = await prisma.articleTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ArticleTagDeleteManyArgs>(args?: Prisma.SelectSubset<T, ArticleTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ArticleTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleTags
     * const articleTag = await prisma.articleTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ArticleTagUpdateManyArgs>(args: Prisma.SelectSubset<T, ArticleTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one ArticleTag.
     * @param {ArticleTagUpsertArgs} args - Arguments to update or create a ArticleTag.
     * @example
     * // Update or create a ArticleTag
     * const articleTag = await prisma.articleTag.upsert({
     *   create: {
     *     // ... data to create a ArticleTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleTag we want to update
     *   }
     * })
     */
    upsert<T extends ArticleTagUpsertArgs>(args: Prisma.SelectSubset<T, ArticleTagUpsertArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ArticleTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleTagCountArgs} args - Arguments to filter ArticleTags to count.
     * @example
     * // Count the number of ArticleTags
     * const count = await prisma.articleTag.count({
     *   where: {
     *     // ... the filter for the ArticleTags we want to count
     *   }
     * })
    **/
    count<T extends ArticleTagCountArgs>(args?: Prisma.Subset<T, ArticleTagCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ArticleTagCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ArticleTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ArticleTagAggregateArgs>(args: Prisma.Subset<T, ArticleTagAggregateArgs>): Prisma.PrismaPromise<GetArticleTagAggregateType<T>>;
    /**
     * Group by ArticleTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleTagGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ArticleTagGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ArticleTagGroupByArgs['orderBy'];
    } : {
        orderBy?: ArticleTagGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ArticleTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ArticleTag model
     */
    readonly fields: ArticleTagFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ArticleTag.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ArticleTagClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the ArticleTag model
 */
export interface ArticleTagFieldRefs {
    readonly id: Prisma.FieldRef<"ArticleTag", 'Int'>;
    readonly article_id: Prisma.FieldRef<"ArticleTag", 'Int'>;
    readonly tag: Prisma.FieldRef<"ArticleTag", 'String'>;
}
/**
 * ArticleTag findUnique
 */
export type ArticleTagFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleTag to fetch.
     */
    where: Prisma.ArticleTagWhereUniqueInput;
};
/**
 * ArticleTag findUniqueOrThrow
 */
export type ArticleTagFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleTag to fetch.
     */
    where: Prisma.ArticleTagWhereUniqueInput;
};
/**
 * ArticleTag findFirst
 */
export type ArticleTagFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleTag to fetch.
     */
    where?: Prisma.ArticleTagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ArticleTags to fetch.
     */
    orderBy?: Prisma.ArticleTagOrderByWithRelationInput | Prisma.ArticleTagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ArticleTags.
     */
    cursor?: Prisma.ArticleTagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ArticleTags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ArticleTags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ArticleTags.
     */
    distinct?: Prisma.ArticleTagScalarFieldEnum | Prisma.ArticleTagScalarFieldEnum[];
};
/**
 * ArticleTag findFirstOrThrow
 */
export type ArticleTagFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleTag to fetch.
     */
    where?: Prisma.ArticleTagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ArticleTags to fetch.
     */
    orderBy?: Prisma.ArticleTagOrderByWithRelationInput | Prisma.ArticleTagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ArticleTags.
     */
    cursor?: Prisma.ArticleTagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ArticleTags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ArticleTags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ArticleTags.
     */
    distinct?: Prisma.ArticleTagScalarFieldEnum | Prisma.ArticleTagScalarFieldEnum[];
};
/**
 * ArticleTag findMany
 */
export type ArticleTagFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    /**
     * Filter, which ArticleTags to fetch.
     */
    where?: Prisma.ArticleTagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ArticleTags to fetch.
     */
    orderBy?: Prisma.ArticleTagOrderByWithRelationInput | Prisma.ArticleTagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ArticleTags.
     */
    cursor?: Prisma.ArticleTagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ArticleTags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ArticleTags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ArticleTags.
     */
    distinct?: Prisma.ArticleTagScalarFieldEnum | Prisma.ArticleTagScalarFieldEnum[];
};
/**
 * ArticleTag create
 */
export type ArticleTagCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    /**
     * The data needed to create a ArticleTag.
     */
    data: Prisma.XOR<Prisma.ArticleTagCreateInput, Prisma.ArticleTagUncheckedCreateInput>;
};
/**
 * ArticleTag createMany
 */
export type ArticleTagCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleTags.
     */
    data: Prisma.ArticleTagCreateManyInput | Prisma.ArticleTagCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ArticleTag update
 */
export type ArticleTagUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    /**
     * The data needed to update a ArticleTag.
     */
    data: Prisma.XOR<Prisma.ArticleTagUpdateInput, Prisma.ArticleTagUncheckedUpdateInput>;
    /**
     * Choose, which ArticleTag to update.
     */
    where: Prisma.ArticleTagWhereUniqueInput;
};
/**
 * ArticleTag updateMany
 */
export type ArticleTagUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleTags.
     */
    data: Prisma.XOR<Prisma.ArticleTagUpdateManyMutationInput, Prisma.ArticleTagUncheckedUpdateManyInput>;
    /**
     * Filter which ArticleTags to update
     */
    where?: Prisma.ArticleTagWhereInput;
    /**
     * Limit how many ArticleTags to update.
     */
    limit?: number;
};
/**
 * ArticleTag upsert
 */
export type ArticleTagUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    /**
     * The filter to search for the ArticleTag to update in case it exists.
     */
    where: Prisma.ArticleTagWhereUniqueInput;
    /**
     * In case the ArticleTag found by the `where` argument doesn't exist, create a new ArticleTag with this data.
     */
    create: Prisma.XOR<Prisma.ArticleTagCreateInput, Prisma.ArticleTagUncheckedCreateInput>;
    /**
     * In case the ArticleTag was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ArticleTagUpdateInput, Prisma.ArticleTagUncheckedUpdateInput>;
};
/**
 * ArticleTag delete
 */
export type ArticleTagDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    /**
     * Filter which ArticleTag to delete.
     */
    where: Prisma.ArticleTagWhereUniqueInput;
};
/**
 * ArticleTag deleteMany
 */
export type ArticleTagDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleTags to delete
     */
    where?: Prisma.ArticleTagWhereInput;
    /**
     * Limit how many ArticleTags to delete.
     */
    limit?: number;
};
/**
 * ArticleTag without action
 */
export type ArticleTagDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleTag
     */
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ArticleTag
     */
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
};
//# sourceMappingURL=ArticleTag.d.ts.map