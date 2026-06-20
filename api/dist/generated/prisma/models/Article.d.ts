import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Article
 *
 */
export type ArticleModel = runtime.Types.Result.DefaultSelection<Prisma.$ArticlePayload>;
export type AggregateArticle = {
    _count: ArticleCountAggregateOutputType | null;
    _avg: ArticleAvgAggregateOutputType | null;
    _sum: ArticleSumAggregateOutputType | null;
    _min: ArticleMinAggregateOutputType | null;
    _max: ArticleMaxAggregateOutputType | null;
};
export type ArticleAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    season_id: number | null;
    match_id: number | null;
    team_id: number | null;
};
export type ArticleSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    season_id: number | null;
    match_id: number | null;
    team_id: number | null;
};
export type ArticleMinAggregateOutputType = {
    id: number | null;
    title: string | null;
    slug: string | null;
    content: string | null;
    cover_image: string | null;
    status: $Enums.ArticleStatus | null;
    user_id: number | null;
    season_id: number | null;
    match_id: number | null;
    team_id: number | null;
    published_at: Date | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
};
export type ArticleMaxAggregateOutputType = {
    id: number | null;
    title: string | null;
    slug: string | null;
    content: string | null;
    cover_image: string | null;
    status: $Enums.ArticleStatus | null;
    user_id: number | null;
    season_id: number | null;
    match_id: number | null;
    team_id: number | null;
    published_at: Date | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
};
export type ArticleCountAggregateOutputType = {
    id: number;
    title: number;
    slug: number;
    content: number;
    cover_image: number;
    status: number;
    user_id: number;
    season_id: number;
    match_id: number;
    team_id: number;
    published_at: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    _all: number;
};
export type ArticleAvgAggregateInputType = {
    id?: true;
    user_id?: true;
    season_id?: true;
    match_id?: true;
    team_id?: true;
};
export type ArticleSumAggregateInputType = {
    id?: true;
    user_id?: true;
    season_id?: true;
    match_id?: true;
    team_id?: true;
};
export type ArticleMinAggregateInputType = {
    id?: true;
    title?: true;
    slug?: true;
    content?: true;
    cover_image?: true;
    status?: true;
    user_id?: true;
    season_id?: true;
    match_id?: true;
    team_id?: true;
    published_at?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
};
export type ArticleMaxAggregateInputType = {
    id?: true;
    title?: true;
    slug?: true;
    content?: true;
    cover_image?: true;
    status?: true;
    user_id?: true;
    season_id?: true;
    match_id?: true;
    team_id?: true;
    published_at?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
};
export type ArticleCountAggregateInputType = {
    id?: true;
    title?: true;
    slug?: true;
    content?: true;
    cover_image?: true;
    status?: true;
    user_id?: true;
    season_id?: true;
    match_id?: true;
    team_id?: true;
    published_at?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    _all?: true;
};
export type ArticleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Article to aggregate.
     */
    where?: Prisma.ArticleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Articles to fetch.
     */
    orderBy?: Prisma.ArticleOrderByWithRelationInput | Prisma.ArticleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ArticleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Articles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Articles
    **/
    _count?: true | ArticleCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ArticleAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ArticleSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMaxAggregateInputType;
};
export type GetArticleAggregateType<T extends ArticleAggregateArgs> = {
    [P in keyof T & keyof AggregateArticle]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateArticle[P]> : Prisma.GetScalarType<T[P], AggregateArticle[P]>;
};
export type ArticleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleWhereInput;
    orderBy?: Prisma.ArticleOrderByWithAggregationInput | Prisma.ArticleOrderByWithAggregationInput[];
    by: Prisma.ArticleScalarFieldEnum[] | Prisma.ArticleScalarFieldEnum;
    having?: Prisma.ArticleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ArticleCountAggregateInputType | true;
    _avg?: ArticleAvgAggregateInputType;
    _sum?: ArticleSumAggregateInputType;
    _min?: ArticleMinAggregateInputType;
    _max?: ArticleMaxAggregateInputType;
};
export type ArticleGroupByOutputType = {
    id: number;
    title: string;
    slug: string;
    content: string;
    cover_image: string | null;
    status: $Enums.ArticleStatus;
    user_id: number;
    season_id: number | null;
    match_id: number | null;
    team_id: number | null;
    published_at: Date | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    _count: ArticleCountAggregateOutputType | null;
    _avg: ArticleAvgAggregateOutputType | null;
    _sum: ArticleSumAggregateOutputType | null;
    _min: ArticleMinAggregateOutputType | null;
    _max: ArticleMaxAggregateOutputType | null;
};
export type GetArticleGroupByPayload<T extends ArticleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ArticleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ArticleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ArticleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ArticleGroupByOutputType[P]>;
}>>;
export type ArticleWhereInput = {
    AND?: Prisma.ArticleWhereInput | Prisma.ArticleWhereInput[];
    OR?: Prisma.ArticleWhereInput[];
    NOT?: Prisma.ArticleWhereInput | Prisma.ArticleWhereInput[];
    id?: Prisma.IntFilter<"Article"> | number;
    title?: Prisma.StringFilter<"Article"> | string;
    slug?: Prisma.StringFilter<"Article"> | string;
    content?: Prisma.StringFilter<"Article"> | string;
    cover_image?: Prisma.StringNullableFilter<"Article"> | string | null;
    status?: Prisma.EnumArticleStatusFilter<"Article"> | $Enums.ArticleStatus;
    user_id?: Prisma.IntFilter<"Article"> | number;
    season_id?: Prisma.IntNullableFilter<"Article"> | number | null;
    match_id?: Prisma.IntNullableFilter<"Article"> | number | null;
    team_id?: Prisma.IntNullableFilter<"Article"> | number | null;
    published_at?: Prisma.DateTimeNullableFilter<"Article"> | Date | string | null;
    is_active?: Prisma.BoolFilter<"Article"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Article"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Article"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Article"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    season?: Prisma.XOR<Prisma.SeasonNullableScalarRelationFilter, Prisma.SeasonWhereInput> | null;
    match?: Prisma.XOR<Prisma.MatchNullableScalarRelationFilter, Prisma.MatchWhereInput> | null;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
    tags?: Prisma.ArticleTagListRelationFilter;
    media?: Prisma.ArticleMediaListRelationFilter;
};
export type ArticleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    cover_image?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    match_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    published_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    season?: Prisma.SeasonOrderByWithRelationInput;
    match?: Prisma.MatchOrderByWithRelationInput;
    team?: Prisma.TeamOrderByWithRelationInput;
    tags?: Prisma.ArticleTagOrderByRelationAggregateInput;
    media?: Prisma.ArticleMediaOrderByRelationAggregateInput;
    _relevance?: Prisma.ArticleOrderByRelevanceInput;
};
export type ArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    slug?: string;
    AND?: Prisma.ArticleWhereInput | Prisma.ArticleWhereInput[];
    OR?: Prisma.ArticleWhereInput[];
    NOT?: Prisma.ArticleWhereInput | Prisma.ArticleWhereInput[];
    title?: Prisma.StringFilter<"Article"> | string;
    content?: Prisma.StringFilter<"Article"> | string;
    cover_image?: Prisma.StringNullableFilter<"Article"> | string | null;
    status?: Prisma.EnumArticleStatusFilter<"Article"> | $Enums.ArticleStatus;
    user_id?: Prisma.IntFilter<"Article"> | number;
    season_id?: Prisma.IntNullableFilter<"Article"> | number | null;
    match_id?: Prisma.IntNullableFilter<"Article"> | number | null;
    team_id?: Prisma.IntNullableFilter<"Article"> | number | null;
    published_at?: Prisma.DateTimeNullableFilter<"Article"> | Date | string | null;
    is_active?: Prisma.BoolFilter<"Article"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Article"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Article"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Article"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    season?: Prisma.XOR<Prisma.SeasonNullableScalarRelationFilter, Prisma.SeasonWhereInput> | null;
    match?: Prisma.XOR<Prisma.MatchNullableScalarRelationFilter, Prisma.MatchWhereInput> | null;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
    tags?: Prisma.ArticleTagListRelationFilter;
    media?: Prisma.ArticleMediaListRelationFilter;
}, "id" | "slug">;
export type ArticleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    cover_image?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    match_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    team_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    published_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ArticleCountOrderByAggregateInput;
    _avg?: Prisma.ArticleAvgOrderByAggregateInput;
    _max?: Prisma.ArticleMaxOrderByAggregateInput;
    _min?: Prisma.ArticleMinOrderByAggregateInput;
    _sum?: Prisma.ArticleSumOrderByAggregateInput;
};
export type ArticleScalarWhereWithAggregatesInput = {
    AND?: Prisma.ArticleScalarWhereWithAggregatesInput | Prisma.ArticleScalarWhereWithAggregatesInput[];
    OR?: Prisma.ArticleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ArticleScalarWhereWithAggregatesInput | Prisma.ArticleScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Article"> | number;
    title?: Prisma.StringWithAggregatesFilter<"Article"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Article"> | string;
    content?: Prisma.StringWithAggregatesFilter<"Article"> | string;
    cover_image?: Prisma.StringNullableWithAggregatesFilter<"Article"> | string | null;
    status?: Prisma.EnumArticleStatusWithAggregatesFilter<"Article"> | $Enums.ArticleStatus;
    user_id?: Prisma.IntWithAggregatesFilter<"Article"> | number;
    season_id?: Prisma.IntNullableWithAggregatesFilter<"Article"> | number | null;
    match_id?: Prisma.IntNullableWithAggregatesFilter<"Article"> | number | null;
    team_id?: Prisma.IntNullableWithAggregatesFilter<"Article"> | number | null;
    published_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Article"> | Date | string | null;
    is_active?: Prisma.BoolWithAggregatesFilter<"Article"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Article"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Article"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Article"> | Date | string | null;
};
export type ArticleCreateInput = {
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutArticlesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutArticlesInput;
    match?: Prisma.MatchCreateNestedOneWithoutArticlesInput;
    team?: Prisma.TeamCreateNestedOneWithoutArticlesInput;
    tags?: Prisma.ArticleTagCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaCreateNestedManyWithoutArticleInput;
};
export type ArticleUncheckedCreateInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    season_id?: number | null;
    match_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    tags?: Prisma.ArticleTagUncheckedCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaUncheckedCreateNestedManyWithoutArticleInput;
};
export type ArticleUpdateInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutArticlesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutArticlesNestedInput;
    match?: Prisma.MatchUpdateOneWithoutArticlesNestedInput;
    team?: Prisma.TeamUpdateOneWithoutArticlesNestedInput;
    tags?: Prisma.ArticleTagUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tags?: Prisma.ArticleTagUncheckedUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUncheckedUpdateManyWithoutArticleNestedInput;
};
export type ArticleCreateManyInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    season_id?: number | null;
    match_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type ArticleUpdateManyMutationInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ArticleUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ArticleListRelationFilter = {
    every?: Prisma.ArticleWhereInput;
    some?: Prisma.ArticleWhereInput;
    none?: Prisma.ArticleWhereInput;
};
export type ArticleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ArticleOrderByRelevanceInput = {
    fields: Prisma.ArticleOrderByRelevanceFieldEnum | Prisma.ArticleOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type ArticleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    cover_image?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    published_at?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type ArticleAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
};
export type ArticleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    cover_image?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    published_at?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type ArticleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    cover_image?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    published_at?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
};
export type ArticleSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    match_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
};
export type ArticleScalarRelationFilter = {
    is?: Prisma.ArticleWhereInput;
    isNot?: Prisma.ArticleWhereInput;
};
export type ArticleCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutUserInput, Prisma.ArticleUncheckedCreateWithoutUserInput> | Prisma.ArticleCreateWithoutUserInput[] | Prisma.ArticleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutUserInput | Prisma.ArticleCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ArticleCreateManyUserInputEnvelope;
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
};
export type ArticleUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutUserInput, Prisma.ArticleUncheckedCreateWithoutUserInput> | Prisma.ArticleCreateWithoutUserInput[] | Prisma.ArticleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutUserInput | Prisma.ArticleCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ArticleCreateManyUserInputEnvelope;
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
};
export type ArticleUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutUserInput, Prisma.ArticleUncheckedCreateWithoutUserInput> | Prisma.ArticleCreateWithoutUserInput[] | Prisma.ArticleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutUserInput | Prisma.ArticleCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ArticleUpsertWithWhereUniqueWithoutUserInput | Prisma.ArticleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ArticleCreateManyUserInputEnvelope;
    set?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    disconnect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    delete?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    update?: Prisma.ArticleUpdateWithWhereUniqueWithoutUserInput | Prisma.ArticleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ArticleUpdateManyWithWhereWithoutUserInput | Prisma.ArticleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
};
export type ArticleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutUserInput, Prisma.ArticleUncheckedCreateWithoutUserInput> | Prisma.ArticleCreateWithoutUserInput[] | Prisma.ArticleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutUserInput | Prisma.ArticleCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ArticleUpsertWithWhereUniqueWithoutUserInput | Prisma.ArticleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ArticleCreateManyUserInputEnvelope;
    set?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    disconnect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    delete?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    update?: Prisma.ArticleUpdateWithWhereUniqueWithoutUserInput | Prisma.ArticleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ArticleUpdateManyWithWhereWithoutUserInput | Prisma.ArticleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
};
export type ArticleCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutSeasonInput, Prisma.ArticleUncheckedCreateWithoutSeasonInput> | Prisma.ArticleCreateWithoutSeasonInput[] | Prisma.ArticleUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutSeasonInput | Prisma.ArticleCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.ArticleCreateManySeasonInputEnvelope;
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
};
export type ArticleUncheckedCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutSeasonInput, Prisma.ArticleUncheckedCreateWithoutSeasonInput> | Prisma.ArticleCreateWithoutSeasonInput[] | Prisma.ArticleUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutSeasonInput | Prisma.ArticleCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.ArticleCreateManySeasonInputEnvelope;
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
};
export type ArticleUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutSeasonInput, Prisma.ArticleUncheckedCreateWithoutSeasonInput> | Prisma.ArticleCreateWithoutSeasonInput[] | Prisma.ArticleUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutSeasonInput | Prisma.ArticleCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.ArticleUpsertWithWhereUniqueWithoutSeasonInput | Prisma.ArticleUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.ArticleCreateManySeasonInputEnvelope;
    set?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    disconnect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    delete?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    update?: Prisma.ArticleUpdateWithWhereUniqueWithoutSeasonInput | Prisma.ArticleUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.ArticleUpdateManyWithWhereWithoutSeasonInput | Prisma.ArticleUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
};
export type ArticleUncheckedUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutSeasonInput, Prisma.ArticleUncheckedCreateWithoutSeasonInput> | Prisma.ArticleCreateWithoutSeasonInput[] | Prisma.ArticleUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutSeasonInput | Prisma.ArticleCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.ArticleUpsertWithWhereUniqueWithoutSeasonInput | Prisma.ArticleUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.ArticleCreateManySeasonInputEnvelope;
    set?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    disconnect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    delete?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    update?: Prisma.ArticleUpdateWithWhereUniqueWithoutSeasonInput | Prisma.ArticleUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.ArticleUpdateManyWithWhereWithoutSeasonInput | Prisma.ArticleUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
};
export type ArticleCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutTeamInput, Prisma.ArticleUncheckedCreateWithoutTeamInput> | Prisma.ArticleCreateWithoutTeamInput[] | Prisma.ArticleUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutTeamInput | Prisma.ArticleCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.ArticleCreateManyTeamInputEnvelope;
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
};
export type ArticleUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutTeamInput, Prisma.ArticleUncheckedCreateWithoutTeamInput> | Prisma.ArticleCreateWithoutTeamInput[] | Prisma.ArticleUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutTeamInput | Prisma.ArticleCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.ArticleCreateManyTeamInputEnvelope;
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
};
export type ArticleUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutTeamInput, Prisma.ArticleUncheckedCreateWithoutTeamInput> | Prisma.ArticleCreateWithoutTeamInput[] | Prisma.ArticleUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutTeamInput | Prisma.ArticleCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.ArticleUpsertWithWhereUniqueWithoutTeamInput | Prisma.ArticleUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.ArticleCreateManyTeamInputEnvelope;
    set?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    disconnect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    delete?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    update?: Prisma.ArticleUpdateWithWhereUniqueWithoutTeamInput | Prisma.ArticleUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.ArticleUpdateManyWithWhereWithoutTeamInput | Prisma.ArticleUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
};
export type ArticleUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutTeamInput, Prisma.ArticleUncheckedCreateWithoutTeamInput> | Prisma.ArticleCreateWithoutTeamInput[] | Prisma.ArticleUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutTeamInput | Prisma.ArticleCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.ArticleUpsertWithWhereUniqueWithoutTeamInput | Prisma.ArticleUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.ArticleCreateManyTeamInputEnvelope;
    set?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    disconnect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    delete?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    update?: Prisma.ArticleUpdateWithWhereUniqueWithoutTeamInput | Prisma.ArticleUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.ArticleUpdateManyWithWhereWithoutTeamInput | Prisma.ArticleUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
};
export type ArticleCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutMatchInput, Prisma.ArticleUncheckedCreateWithoutMatchInput> | Prisma.ArticleCreateWithoutMatchInput[] | Prisma.ArticleUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutMatchInput | Prisma.ArticleCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.ArticleCreateManyMatchInputEnvelope;
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
};
export type ArticleUncheckedCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutMatchInput, Prisma.ArticleUncheckedCreateWithoutMatchInput> | Prisma.ArticleCreateWithoutMatchInput[] | Prisma.ArticleUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutMatchInput | Prisma.ArticleCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.ArticleCreateManyMatchInputEnvelope;
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
};
export type ArticleUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutMatchInput, Prisma.ArticleUncheckedCreateWithoutMatchInput> | Prisma.ArticleCreateWithoutMatchInput[] | Prisma.ArticleUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutMatchInput | Prisma.ArticleCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.ArticleUpsertWithWhereUniqueWithoutMatchInput | Prisma.ArticleUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.ArticleCreateManyMatchInputEnvelope;
    set?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    disconnect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    delete?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    update?: Prisma.ArticleUpdateWithWhereUniqueWithoutMatchInput | Prisma.ArticleUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.ArticleUpdateManyWithWhereWithoutMatchInput | Prisma.ArticleUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
};
export type ArticleUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutMatchInput, Prisma.ArticleUncheckedCreateWithoutMatchInput> | Prisma.ArticleCreateWithoutMatchInput[] | Prisma.ArticleUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutMatchInput | Prisma.ArticleCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.ArticleUpsertWithWhereUniqueWithoutMatchInput | Prisma.ArticleUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.ArticleCreateManyMatchInputEnvelope;
    set?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    disconnect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    delete?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    connect?: Prisma.ArticleWhereUniqueInput | Prisma.ArticleWhereUniqueInput[];
    update?: Prisma.ArticleUpdateWithWhereUniqueWithoutMatchInput | Prisma.ArticleUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.ArticleUpdateManyWithWhereWithoutMatchInput | Prisma.ArticleUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
};
export type EnumArticleStatusFieldUpdateOperationsInput = {
    set?: $Enums.ArticleStatus;
};
export type ArticleCreateNestedOneWithoutTagsInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutTagsInput, Prisma.ArticleUncheckedCreateWithoutTagsInput>;
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutTagsInput;
    connect?: Prisma.ArticleWhereUniqueInput;
};
export type ArticleUpdateOneRequiredWithoutTagsNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutTagsInput, Prisma.ArticleUncheckedCreateWithoutTagsInput>;
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutTagsInput;
    upsert?: Prisma.ArticleUpsertWithoutTagsInput;
    connect?: Prisma.ArticleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ArticleUpdateToOneWithWhereWithoutTagsInput, Prisma.ArticleUpdateWithoutTagsInput>, Prisma.ArticleUncheckedUpdateWithoutTagsInput>;
};
export type ArticleCreateNestedOneWithoutMediaInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutMediaInput, Prisma.ArticleUncheckedCreateWithoutMediaInput>;
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutMediaInput;
    connect?: Prisma.ArticleWhereUniqueInput;
};
export type ArticleUpdateOneRequiredWithoutMediaNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCreateWithoutMediaInput, Prisma.ArticleUncheckedCreateWithoutMediaInput>;
    connectOrCreate?: Prisma.ArticleCreateOrConnectWithoutMediaInput;
    upsert?: Prisma.ArticleUpsertWithoutMediaInput;
    connect?: Prisma.ArticleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ArticleUpdateToOneWithWhereWithoutMediaInput, Prisma.ArticleUpdateWithoutMediaInput>, Prisma.ArticleUncheckedUpdateWithoutMediaInput>;
};
export type ArticleCreateWithoutUserInput = {
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    season?: Prisma.SeasonCreateNestedOneWithoutArticlesInput;
    match?: Prisma.MatchCreateNestedOneWithoutArticlesInput;
    team?: Prisma.TeamCreateNestedOneWithoutArticlesInput;
    tags?: Prisma.ArticleTagCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaCreateNestedManyWithoutArticleInput;
};
export type ArticleUncheckedCreateWithoutUserInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    season_id?: number | null;
    match_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    tags?: Prisma.ArticleTagUncheckedCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaUncheckedCreateNestedManyWithoutArticleInput;
};
export type ArticleCreateOrConnectWithoutUserInput = {
    where: Prisma.ArticleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutUserInput, Prisma.ArticleUncheckedCreateWithoutUserInput>;
};
export type ArticleCreateManyUserInputEnvelope = {
    data: Prisma.ArticleCreateManyUserInput | Prisma.ArticleCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ArticleUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ArticleWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleUpdateWithoutUserInput, Prisma.ArticleUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutUserInput, Prisma.ArticleUncheckedCreateWithoutUserInput>;
};
export type ArticleUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ArticleWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleUpdateWithoutUserInput, Prisma.ArticleUncheckedUpdateWithoutUserInput>;
};
export type ArticleUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ArticleScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleUpdateManyMutationInput, Prisma.ArticleUncheckedUpdateManyWithoutUserInput>;
};
export type ArticleScalarWhereInput = {
    AND?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
    OR?: Prisma.ArticleScalarWhereInput[];
    NOT?: Prisma.ArticleScalarWhereInput | Prisma.ArticleScalarWhereInput[];
    id?: Prisma.IntFilter<"Article"> | number;
    title?: Prisma.StringFilter<"Article"> | string;
    slug?: Prisma.StringFilter<"Article"> | string;
    content?: Prisma.StringFilter<"Article"> | string;
    cover_image?: Prisma.StringNullableFilter<"Article"> | string | null;
    status?: Prisma.EnumArticleStatusFilter<"Article"> | $Enums.ArticleStatus;
    user_id?: Prisma.IntFilter<"Article"> | number;
    season_id?: Prisma.IntNullableFilter<"Article"> | number | null;
    match_id?: Prisma.IntNullableFilter<"Article"> | number | null;
    team_id?: Prisma.IntNullableFilter<"Article"> | number | null;
    published_at?: Prisma.DateTimeNullableFilter<"Article"> | Date | string | null;
    is_active?: Prisma.BoolFilter<"Article"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Article"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"Article"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"Article"> | Date | string | null;
};
export type ArticleCreateWithoutSeasonInput = {
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutArticlesInput;
    match?: Prisma.MatchCreateNestedOneWithoutArticlesInput;
    team?: Prisma.TeamCreateNestedOneWithoutArticlesInput;
    tags?: Prisma.ArticleTagCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaCreateNestedManyWithoutArticleInput;
};
export type ArticleUncheckedCreateWithoutSeasonInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    match_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    tags?: Prisma.ArticleTagUncheckedCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaUncheckedCreateNestedManyWithoutArticleInput;
};
export type ArticleCreateOrConnectWithoutSeasonInput = {
    where: Prisma.ArticleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutSeasonInput, Prisma.ArticleUncheckedCreateWithoutSeasonInput>;
};
export type ArticleCreateManySeasonInputEnvelope = {
    data: Prisma.ArticleCreateManySeasonInput | Prisma.ArticleCreateManySeasonInput[];
    skipDuplicates?: boolean;
};
export type ArticleUpsertWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.ArticleWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleUpdateWithoutSeasonInput, Prisma.ArticleUncheckedUpdateWithoutSeasonInput>;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutSeasonInput, Prisma.ArticleUncheckedCreateWithoutSeasonInput>;
};
export type ArticleUpdateWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.ArticleWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleUpdateWithoutSeasonInput, Prisma.ArticleUncheckedUpdateWithoutSeasonInput>;
};
export type ArticleUpdateManyWithWhereWithoutSeasonInput = {
    where: Prisma.ArticleScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleUpdateManyMutationInput, Prisma.ArticleUncheckedUpdateManyWithoutSeasonInput>;
};
export type ArticleCreateWithoutTeamInput = {
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutArticlesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutArticlesInput;
    match?: Prisma.MatchCreateNestedOneWithoutArticlesInput;
    tags?: Prisma.ArticleTagCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaCreateNestedManyWithoutArticleInput;
};
export type ArticleUncheckedCreateWithoutTeamInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    season_id?: number | null;
    match_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    tags?: Prisma.ArticleTagUncheckedCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaUncheckedCreateNestedManyWithoutArticleInput;
};
export type ArticleCreateOrConnectWithoutTeamInput = {
    where: Prisma.ArticleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutTeamInput, Prisma.ArticleUncheckedCreateWithoutTeamInput>;
};
export type ArticleCreateManyTeamInputEnvelope = {
    data: Prisma.ArticleCreateManyTeamInput | Prisma.ArticleCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type ArticleUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.ArticleWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleUpdateWithoutTeamInput, Prisma.ArticleUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutTeamInput, Prisma.ArticleUncheckedCreateWithoutTeamInput>;
};
export type ArticleUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.ArticleWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleUpdateWithoutTeamInput, Prisma.ArticleUncheckedUpdateWithoutTeamInput>;
};
export type ArticleUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.ArticleScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleUpdateManyMutationInput, Prisma.ArticleUncheckedUpdateManyWithoutTeamInput>;
};
export type ArticleCreateWithoutMatchInput = {
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutArticlesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutArticlesInput;
    team?: Prisma.TeamCreateNestedOneWithoutArticlesInput;
    tags?: Prisma.ArticleTagCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaCreateNestedManyWithoutArticleInput;
};
export type ArticleUncheckedCreateWithoutMatchInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    season_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    tags?: Prisma.ArticleTagUncheckedCreateNestedManyWithoutArticleInput;
    media?: Prisma.ArticleMediaUncheckedCreateNestedManyWithoutArticleInput;
};
export type ArticleCreateOrConnectWithoutMatchInput = {
    where: Prisma.ArticleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutMatchInput, Prisma.ArticleUncheckedCreateWithoutMatchInput>;
};
export type ArticleCreateManyMatchInputEnvelope = {
    data: Prisma.ArticleCreateManyMatchInput | Prisma.ArticleCreateManyMatchInput[];
    skipDuplicates?: boolean;
};
export type ArticleUpsertWithWhereUniqueWithoutMatchInput = {
    where: Prisma.ArticleWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleUpdateWithoutMatchInput, Prisma.ArticleUncheckedUpdateWithoutMatchInput>;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutMatchInput, Prisma.ArticleUncheckedCreateWithoutMatchInput>;
};
export type ArticleUpdateWithWhereUniqueWithoutMatchInput = {
    where: Prisma.ArticleWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleUpdateWithoutMatchInput, Prisma.ArticleUncheckedUpdateWithoutMatchInput>;
};
export type ArticleUpdateManyWithWhereWithoutMatchInput = {
    where: Prisma.ArticleScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleUpdateManyMutationInput, Prisma.ArticleUncheckedUpdateManyWithoutMatchInput>;
};
export type ArticleCreateWithoutTagsInput = {
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutArticlesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutArticlesInput;
    match?: Prisma.MatchCreateNestedOneWithoutArticlesInput;
    team?: Prisma.TeamCreateNestedOneWithoutArticlesInput;
    media?: Prisma.ArticleMediaCreateNestedManyWithoutArticleInput;
};
export type ArticleUncheckedCreateWithoutTagsInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    season_id?: number | null;
    match_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    media?: Prisma.ArticleMediaUncheckedCreateNestedManyWithoutArticleInput;
};
export type ArticleCreateOrConnectWithoutTagsInput = {
    where: Prisma.ArticleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutTagsInput, Prisma.ArticleUncheckedCreateWithoutTagsInput>;
};
export type ArticleUpsertWithoutTagsInput = {
    update: Prisma.XOR<Prisma.ArticleUpdateWithoutTagsInput, Prisma.ArticleUncheckedUpdateWithoutTagsInput>;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutTagsInput, Prisma.ArticleUncheckedCreateWithoutTagsInput>;
    where?: Prisma.ArticleWhereInput;
};
export type ArticleUpdateToOneWithWhereWithoutTagsInput = {
    where?: Prisma.ArticleWhereInput;
    data: Prisma.XOR<Prisma.ArticleUpdateWithoutTagsInput, Prisma.ArticleUncheckedUpdateWithoutTagsInput>;
};
export type ArticleUpdateWithoutTagsInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutArticlesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutArticlesNestedInput;
    match?: Prisma.MatchUpdateOneWithoutArticlesNestedInput;
    team?: Prisma.TeamUpdateOneWithoutArticlesNestedInput;
    media?: Prisma.ArticleMediaUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateWithoutTagsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    media?: Prisma.ArticleMediaUncheckedUpdateManyWithoutArticleNestedInput;
};
export type ArticleCreateWithoutMediaInput = {
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutArticlesInput;
    season?: Prisma.SeasonCreateNestedOneWithoutArticlesInput;
    match?: Prisma.MatchCreateNestedOneWithoutArticlesInput;
    team?: Prisma.TeamCreateNestedOneWithoutArticlesInput;
    tags?: Prisma.ArticleTagCreateNestedManyWithoutArticleInput;
};
export type ArticleUncheckedCreateWithoutMediaInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    season_id?: number | null;
    match_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    tags?: Prisma.ArticleTagUncheckedCreateNestedManyWithoutArticleInput;
};
export type ArticleCreateOrConnectWithoutMediaInput = {
    where: Prisma.ArticleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutMediaInput, Prisma.ArticleUncheckedCreateWithoutMediaInput>;
};
export type ArticleUpsertWithoutMediaInput = {
    update: Prisma.XOR<Prisma.ArticleUpdateWithoutMediaInput, Prisma.ArticleUncheckedUpdateWithoutMediaInput>;
    create: Prisma.XOR<Prisma.ArticleCreateWithoutMediaInput, Prisma.ArticleUncheckedCreateWithoutMediaInput>;
    where?: Prisma.ArticleWhereInput;
};
export type ArticleUpdateToOneWithWhereWithoutMediaInput = {
    where?: Prisma.ArticleWhereInput;
    data: Prisma.XOR<Prisma.ArticleUpdateWithoutMediaInput, Prisma.ArticleUncheckedUpdateWithoutMediaInput>;
};
export type ArticleUpdateWithoutMediaInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutArticlesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutArticlesNestedInput;
    match?: Prisma.MatchUpdateOneWithoutArticlesNestedInput;
    team?: Prisma.TeamUpdateOneWithoutArticlesNestedInput;
    tags?: Prisma.ArticleTagUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateWithoutMediaInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tags?: Prisma.ArticleTagUncheckedUpdateManyWithoutArticleNestedInput;
};
export type ArticleCreateManyUserInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    season_id?: number | null;
    match_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type ArticleUpdateWithoutUserInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    season?: Prisma.SeasonUpdateOneWithoutArticlesNestedInput;
    match?: Prisma.MatchUpdateOneWithoutArticlesNestedInput;
    team?: Prisma.TeamUpdateOneWithoutArticlesNestedInput;
    tags?: Prisma.ArticleTagUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tags?: Prisma.ArticleTagUncheckedUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUncheckedUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ArticleCreateManySeasonInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    match_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type ArticleUpdateWithoutSeasonInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutArticlesNestedInput;
    match?: Prisma.MatchUpdateOneWithoutArticlesNestedInput;
    team?: Prisma.TeamUpdateOneWithoutArticlesNestedInput;
    tags?: Prisma.ArticleTagUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tags?: Prisma.ArticleTagUncheckedUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUncheckedUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateManyWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ArticleCreateManyTeamInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    season_id?: number | null;
    match_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type ArticleUpdateWithoutTeamInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutArticlesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutArticlesNestedInput;
    match?: Prisma.MatchUpdateOneWithoutArticlesNestedInput;
    tags?: Prisma.ArticleTagUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tags?: Prisma.ArticleTagUncheckedUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUncheckedUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    match_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ArticleCreateManyMatchInput = {
    id?: number;
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    status?: $Enums.ArticleStatus;
    user_id: number;
    season_id?: number | null;
    team_id?: number | null;
    published_at?: Date | string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type ArticleUpdateWithoutMatchInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutArticlesNestedInput;
    season?: Prisma.SeasonUpdateOneWithoutArticlesNestedInput;
    team?: Prisma.TeamUpdateOneWithoutArticlesNestedInput;
    tags?: Prisma.ArticleTagUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tags?: Prisma.ArticleTagUncheckedUpdateManyWithoutArticleNestedInput;
    media?: Prisma.ArticleMediaUncheckedUpdateManyWithoutArticleNestedInput;
};
export type ArticleUncheckedUpdateManyWithoutMatchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    cover_image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    team_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    published_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type ArticleCountOutputType
 */
export type ArticleCountOutputType = {
    tags: number;
    media: number;
};
export type ArticleCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tags?: boolean | ArticleCountOutputTypeCountTagsArgs;
    media?: boolean | ArticleCountOutputTypeCountMediaArgs;
};
/**
 * ArticleCountOutputType without action
 */
export type ArticleCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleCountOutputType
     */
    select?: Prisma.ArticleCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * ArticleCountOutputType without action
 */
export type ArticleCountOutputTypeCountTagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleTagWhereInput;
};
/**
 * ArticleCountOutputType without action
 */
export type ArticleCountOutputTypeCountMediaArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleMediaWhereInput;
};
export type ArticleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    slug?: boolean;
    content?: boolean;
    cover_image?: boolean;
    status?: boolean;
    user_id?: boolean;
    season_id?: boolean;
    match_id?: boolean;
    team_id?: boolean;
    published_at?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    season?: boolean | Prisma.Article$seasonArgs<ExtArgs>;
    match?: boolean | Prisma.Article$matchArgs<ExtArgs>;
    team?: boolean | Prisma.Article$teamArgs<ExtArgs>;
    tags?: boolean | Prisma.Article$tagsArgs<ExtArgs>;
    media?: boolean | Prisma.Article$mediaArgs<ExtArgs>;
    _count?: boolean | Prisma.ArticleCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["article"]>;
export type ArticleSelectScalar = {
    id?: boolean;
    title?: boolean;
    slug?: boolean;
    content?: boolean;
    cover_image?: boolean;
    status?: boolean;
    user_id?: boolean;
    season_id?: boolean;
    match_id?: boolean;
    team_id?: boolean;
    published_at?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
};
export type ArticleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "slug" | "content" | "cover_image" | "status" | "user_id" | "season_id" | "match_id" | "team_id" | "published_at" | "is_active" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["article"]>;
export type ArticleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    season?: boolean | Prisma.Article$seasonArgs<ExtArgs>;
    match?: boolean | Prisma.Article$matchArgs<ExtArgs>;
    team?: boolean | Prisma.Article$teamArgs<ExtArgs>;
    tags?: boolean | Prisma.Article$tagsArgs<ExtArgs>;
    media?: boolean | Prisma.Article$mediaArgs<ExtArgs>;
    _count?: boolean | Prisma.ArticleCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $ArticlePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Article";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        season: Prisma.$SeasonPayload<ExtArgs> | null;
        match: Prisma.$MatchPayload<ExtArgs> | null;
        team: Prisma.$TeamPayload<ExtArgs> | null;
        tags: Prisma.$ArticleTagPayload<ExtArgs>[];
        media: Prisma.$ArticleMediaPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        title: string;
        slug: string;
        content: string;
        cover_image: string | null;
        status: $Enums.ArticleStatus;
        user_id: number;
        season_id: number | null;
        match_id: number | null;
        team_id: number | null;
        published_at: Date | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
    }, ExtArgs["result"]["article"]>;
    composites: {};
};
export type ArticleGetPayload<S extends boolean | null | undefined | ArticleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ArticlePayload, S>;
export type ArticleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ArticleCountAggregateInputType | true;
};
export interface ArticleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Article'];
        meta: {
            name: 'Article';
        };
    };
    /**
     * Find zero or one Article that matches the filter.
     * @param {ArticleFindUniqueArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleFindUniqueArgs>(args: Prisma.SelectSubset<T, ArticleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Article that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleFindUniqueOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Article that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleFindFirstArgs>(args?: Prisma.SelectSubset<T, ArticleFindFirstArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Article that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.article.findMany()
     *
     * // Get first 10 Articles
     * const articles = await prisma.article.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const articleWithIdOnly = await prisma.article.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ArticleFindManyArgs>(args?: Prisma.SelectSubset<T, ArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Article.
     * @param {ArticleCreateArgs} args - Arguments to create a Article.
     * @example
     * // Create one Article
     * const Article = await prisma.article.create({
     *   data: {
     *     // ... data to create a Article
     *   }
     * })
     *
     */
    create<T extends ArticleCreateArgs>(args: Prisma.SelectSubset<T, ArticleCreateArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Articles.
     * @param {ArticleCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ArticleCreateManyArgs>(args?: Prisma.SelectSubset<T, ArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Article.
     * @param {ArticleDeleteArgs} args - Arguments to delete one Article.
     * @example
     * // Delete one Article
     * const Article = await prisma.article.delete({
     *   where: {
     *     // ... filter to delete one Article
     *   }
     * })
     *
     */
    delete<T extends ArticleDeleteArgs>(args: Prisma.SelectSubset<T, ArticleDeleteArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Article.
     * @param {ArticleUpdateArgs} args - Arguments to update one Article.
     * @example
     * // Update one Article
     * const article = await prisma.article.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ArticleUpdateArgs>(args: Prisma.SelectSubset<T, ArticleUpdateArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Articles.
     * @param {ArticleDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.article.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ArticleDeleteManyArgs>(args?: Prisma.SelectSubset<T, ArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ArticleUpdateManyArgs>(args: Prisma.SelectSubset<T, ArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Article.
     * @param {ArticleUpsertArgs} args - Arguments to update or create a Article.
     * @example
     * // Update or create a Article
     * const article = await prisma.article.upsert({
     *   create: {
     *     // ... data to create a Article
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article we want to update
     *   }
     * })
     */
    upsert<T extends ArticleUpsertArgs>(args: Prisma.SelectSubset<T, ArticleUpsertArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.article.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends ArticleCountArgs>(args?: Prisma.Subset<T, ArticleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ArticleCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ArticleAggregateArgs>(args: Prisma.Subset<T, ArticleAggregateArgs>): Prisma.PrismaPromise<GetArticleAggregateType<T>>;
    /**
     * Group by Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ArticleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ArticleGroupByArgs['orderBy'];
    } : {
        orderBy?: ArticleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Article model
     */
    readonly fields: ArticleFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Article.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ArticleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    season<T extends Prisma.Article$seasonArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Article$seasonArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    match<T extends Prisma.Article$matchArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Article$matchArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    team<T extends Prisma.Article$teamArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Article$teamArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    tags<T extends Prisma.Article$tagsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Article$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    media<T extends Prisma.Article$mediaArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Article$mediaArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Article model
 */
export interface ArticleFieldRefs {
    readonly id: Prisma.FieldRef<"Article", 'Int'>;
    readonly title: Prisma.FieldRef<"Article", 'String'>;
    readonly slug: Prisma.FieldRef<"Article", 'String'>;
    readonly content: Prisma.FieldRef<"Article", 'String'>;
    readonly cover_image: Prisma.FieldRef<"Article", 'String'>;
    readonly status: Prisma.FieldRef<"Article", 'ArticleStatus'>;
    readonly user_id: Prisma.FieldRef<"Article", 'Int'>;
    readonly season_id: Prisma.FieldRef<"Article", 'Int'>;
    readonly match_id: Prisma.FieldRef<"Article", 'Int'>;
    readonly team_id: Prisma.FieldRef<"Article", 'Int'>;
    readonly published_at: Prisma.FieldRef<"Article", 'DateTime'>;
    readonly is_active: Prisma.FieldRef<"Article", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Article", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Article", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"Article", 'DateTime'>;
}
/**
 * Article findUnique
 */
export type ArticleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    /**
     * Filter, which Article to fetch.
     */
    where: Prisma.ArticleWhereUniqueInput;
};
/**
 * Article findUniqueOrThrow
 */
export type ArticleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    /**
     * Filter, which Article to fetch.
     */
    where: Prisma.ArticleWhereUniqueInput;
};
/**
 * Article findFirst
 */
export type ArticleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    /**
     * Filter, which Article to fetch.
     */
    where?: Prisma.ArticleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Articles to fetch.
     */
    orderBy?: Prisma.ArticleOrderByWithRelationInput | Prisma.ArticleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Articles.
     */
    cursor?: Prisma.ArticleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Articles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Articles.
     */
    distinct?: Prisma.ArticleScalarFieldEnum | Prisma.ArticleScalarFieldEnum[];
};
/**
 * Article findFirstOrThrow
 */
export type ArticleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    /**
     * Filter, which Article to fetch.
     */
    where?: Prisma.ArticleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Articles to fetch.
     */
    orderBy?: Prisma.ArticleOrderByWithRelationInput | Prisma.ArticleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Articles.
     */
    cursor?: Prisma.ArticleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Articles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Articles.
     */
    distinct?: Prisma.ArticleScalarFieldEnum | Prisma.ArticleScalarFieldEnum[];
};
/**
 * Article findMany
 */
export type ArticleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    /**
     * Filter, which Articles to fetch.
     */
    where?: Prisma.ArticleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Articles to fetch.
     */
    orderBy?: Prisma.ArticleOrderByWithRelationInput | Prisma.ArticleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Articles.
     */
    cursor?: Prisma.ArticleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Articles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Articles.
     */
    distinct?: Prisma.ArticleScalarFieldEnum | Prisma.ArticleScalarFieldEnum[];
};
/**
 * Article create
 */
export type ArticleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    /**
     * The data needed to create a Article.
     */
    data: Prisma.XOR<Prisma.ArticleCreateInput, Prisma.ArticleUncheckedCreateInput>;
};
/**
 * Article createMany
 */
export type ArticleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Articles.
     */
    data: Prisma.ArticleCreateManyInput | Prisma.ArticleCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Article update
 */
export type ArticleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    /**
     * The data needed to update a Article.
     */
    data: Prisma.XOR<Prisma.ArticleUpdateInput, Prisma.ArticleUncheckedUpdateInput>;
    /**
     * Choose, which Article to update.
     */
    where: Prisma.ArticleWhereUniqueInput;
};
/**
 * Article updateMany
 */
export type ArticleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Articles.
     */
    data: Prisma.XOR<Prisma.ArticleUpdateManyMutationInput, Prisma.ArticleUncheckedUpdateManyInput>;
    /**
     * Filter which Articles to update
     */
    where?: Prisma.ArticleWhereInput;
    /**
     * Limit how many Articles to update.
     */
    limit?: number;
};
/**
 * Article upsert
 */
export type ArticleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    /**
     * The filter to search for the Article to update in case it exists.
     */
    where: Prisma.ArticleWhereUniqueInput;
    /**
     * In case the Article found by the `where` argument doesn't exist, create a new Article with this data.
     */
    create: Prisma.XOR<Prisma.ArticleCreateInput, Prisma.ArticleUncheckedCreateInput>;
    /**
     * In case the Article was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ArticleUpdateInput, Prisma.ArticleUncheckedUpdateInput>;
};
/**
 * Article delete
 */
export type ArticleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    /**
     * Filter which Article to delete.
     */
    where: Prisma.ArticleWhereUniqueInput;
};
/**
 * Article deleteMany
 */
export type ArticleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to delete
     */
    where?: Prisma.ArticleWhereInput;
    /**
     * Limit how many Articles to delete.
     */
    limit?: number;
};
/**
 * Article.season
 */
export type Article$seasonArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Article.match
 */
export type Article$matchArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Article.team
 */
export type Article$teamArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Article.tags
 */
export type Article$tagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.ArticleTagWhereInput;
    orderBy?: Prisma.ArticleTagOrderByWithRelationInput | Prisma.ArticleTagOrderByWithRelationInput[];
    cursor?: Prisma.ArticleTagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleTagScalarFieldEnum | Prisma.ArticleTagScalarFieldEnum[];
};
/**
 * Article.media
 */
export type Article$mediaArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.ArticleMediaWhereInput;
    orderBy?: Prisma.ArticleMediaOrderByWithRelationInput | Prisma.ArticleMediaOrderByWithRelationInput[];
    cursor?: Prisma.ArticleMediaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleMediaScalarFieldEnum | Prisma.ArticleMediaScalarFieldEnum[];
};
/**
 * Article without action
 */
export type ArticleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Article
     */
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ArticleInclude<ExtArgs> | null;
};
//# sourceMappingURL=Article.d.ts.map