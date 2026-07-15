import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Class
 *
 */
export type ClassModel = runtime.Types.Result.DefaultSelection<Prisma.$ClassPayload>;
export type AggregateClass = {
    _count: ClassCountAggregateOutputType | null;
    _avg: ClassAvgAggregateOutputType | null;
    _sum: ClassSumAggregateOutputType | null;
    _min: ClassMinAggregateOutputType | null;
    _max: ClassMaxAggregateOutputType | null;
};
export type ClassAvgAggregateOutputType = {
    id: number | null;
};
export type ClassSumAggregateOutputType = {
    id: number | null;
};
export type ClassMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type ClassMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type ClassCountAggregateOutputType = {
    id: number;
    name: number;
    is_active: number;
    created_at: number;
    _all: number;
};
export type ClassAvgAggregateInputType = {
    id?: true;
};
export type ClassSumAggregateInputType = {
    id?: true;
};
export type ClassMinAggregateInputType = {
    id?: true;
    name?: true;
    is_active?: true;
    created_at?: true;
};
export type ClassMaxAggregateInputType = {
    id?: true;
    name?: true;
    is_active?: true;
    created_at?: true;
};
export type ClassCountAggregateInputType = {
    id?: true;
    name?: true;
    is_active?: true;
    created_at?: true;
    _all?: true;
};
export type ClassAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Class to aggregate.
     */
    where?: Prisma.ClassWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Classes to fetch.
     */
    orderBy?: Prisma.ClassOrderByWithRelationInput | Prisma.ClassOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ClassWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Classes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Classes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Classes
    **/
    _count?: true | ClassCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ClassAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ClassSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ClassMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ClassMaxAggregateInputType;
};
export type GetClassAggregateType<T extends ClassAggregateArgs> = {
    [P in keyof T & keyof AggregateClass]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateClass[P]> : Prisma.GetScalarType<T[P], AggregateClass[P]>;
};
export type ClassGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClassWhereInput;
    orderBy?: Prisma.ClassOrderByWithAggregationInput | Prisma.ClassOrderByWithAggregationInput[];
    by: Prisma.ClassScalarFieldEnum[] | Prisma.ClassScalarFieldEnum;
    having?: Prisma.ClassScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClassCountAggregateInputType | true;
    _avg?: ClassAvgAggregateInputType;
    _sum?: ClassSumAggregateInputType;
    _min?: ClassMinAggregateInputType;
    _max?: ClassMaxAggregateInputType;
};
export type ClassGroupByOutputType = {
    id: number;
    name: string;
    is_active: boolean;
    created_at: Date;
    _count: ClassCountAggregateOutputType | null;
    _avg: ClassAvgAggregateOutputType | null;
    _sum: ClassSumAggregateOutputType | null;
    _min: ClassMinAggregateOutputType | null;
    _max: ClassMaxAggregateOutputType | null;
};
export type GetClassGroupByPayload<T extends ClassGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ClassGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ClassGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ClassGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ClassGroupByOutputType[P]>;
}>>;
export type ClassWhereInput = {
    AND?: Prisma.ClassWhereInput | Prisma.ClassWhereInput[];
    OR?: Prisma.ClassWhereInput[];
    NOT?: Prisma.ClassWhereInput | Prisma.ClassWhereInput[];
    id?: Prisma.IntFilter<"Class"> | number;
    name?: Prisma.StringFilter<"Class"> | string;
    is_active?: Prisma.BoolFilter<"Class"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Class"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    teams?: Prisma.TeamListRelationFilter;
};
export type ClassOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    users?: Prisma.UserOrderByRelationAggregateInput;
    teams?: Prisma.TeamOrderByRelationAggregateInput;
    _relevance?: Prisma.ClassOrderByRelevanceInput;
};
export type ClassWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name?: string;
    AND?: Prisma.ClassWhereInput | Prisma.ClassWhereInput[];
    OR?: Prisma.ClassWhereInput[];
    NOT?: Prisma.ClassWhereInput | Prisma.ClassWhereInput[];
    is_active?: Prisma.BoolFilter<"Class"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Class"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    teams?: Prisma.TeamListRelationFilter;
}, "id" | "name">;
export type ClassOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.ClassCountOrderByAggregateInput;
    _avg?: Prisma.ClassAvgOrderByAggregateInput;
    _max?: Prisma.ClassMaxOrderByAggregateInput;
    _min?: Prisma.ClassMinOrderByAggregateInput;
    _sum?: Prisma.ClassSumOrderByAggregateInput;
};
export type ClassScalarWhereWithAggregatesInput = {
    AND?: Prisma.ClassScalarWhereWithAggregatesInput | Prisma.ClassScalarWhereWithAggregatesInput[];
    OR?: Prisma.ClassScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ClassScalarWhereWithAggregatesInput | Prisma.ClassScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Class"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Class"> | string;
    is_active?: Prisma.BoolWithAggregatesFilter<"Class"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Class"> | Date | string;
};
export type ClassCreateInput = {
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutClassInput;
    teams?: Prisma.TeamCreateNestedManyWithoutClassInput;
};
export type ClassUncheckedCreateInput = {
    id?: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutClassInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutClassInput;
};
export type ClassUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutClassNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutClassNestedInput;
};
export type ClassUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutClassNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutClassNestedInput;
};
export type ClassCreateManyInput = {
    id?: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
};
export type ClassUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassNullableScalarRelationFilter = {
    is?: Prisma.ClassWhereInput | null;
    isNot?: Prisma.ClassWhereInput | null;
};
export type ClassOrderByRelevanceInput = {
    fields: Prisma.ClassOrderByRelevanceFieldEnum | Prisma.ClassOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type ClassCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ClassAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type ClassMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ClassMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ClassSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type ClassCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.ClassCreateWithoutUsersInput, Prisma.ClassUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.ClassCreateOrConnectWithoutUsersInput;
    connect?: Prisma.ClassWhereUniqueInput;
};
export type ClassUpdateOneWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.ClassCreateWithoutUsersInput, Prisma.ClassUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.ClassCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.ClassUpsertWithoutUsersInput;
    disconnect?: Prisma.ClassWhereInput | boolean;
    delete?: Prisma.ClassWhereInput | boolean;
    connect?: Prisma.ClassWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ClassUpdateToOneWithWhereWithoutUsersInput, Prisma.ClassUpdateWithoutUsersInput>, Prisma.ClassUncheckedUpdateWithoutUsersInput>;
};
export type ClassCreateNestedOneWithoutTeamsInput = {
    create?: Prisma.XOR<Prisma.ClassCreateWithoutTeamsInput, Prisma.ClassUncheckedCreateWithoutTeamsInput>;
    connectOrCreate?: Prisma.ClassCreateOrConnectWithoutTeamsInput;
    connect?: Prisma.ClassWhereUniqueInput;
};
export type ClassUpdateOneWithoutTeamsNestedInput = {
    create?: Prisma.XOR<Prisma.ClassCreateWithoutTeamsInput, Prisma.ClassUncheckedCreateWithoutTeamsInput>;
    connectOrCreate?: Prisma.ClassCreateOrConnectWithoutTeamsInput;
    upsert?: Prisma.ClassUpsertWithoutTeamsInput;
    disconnect?: Prisma.ClassWhereInput | boolean;
    delete?: Prisma.ClassWhereInput | boolean;
    connect?: Prisma.ClassWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ClassUpdateToOneWithWhereWithoutTeamsInput, Prisma.ClassUpdateWithoutTeamsInput>, Prisma.ClassUncheckedUpdateWithoutTeamsInput>;
};
export type ClassCreateWithoutUsersInput = {
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    teams?: Prisma.TeamCreateNestedManyWithoutClassInput;
};
export type ClassUncheckedCreateWithoutUsersInput = {
    id?: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutClassInput;
};
export type ClassCreateOrConnectWithoutUsersInput = {
    where: Prisma.ClassWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClassCreateWithoutUsersInput, Prisma.ClassUncheckedCreateWithoutUsersInput>;
};
export type ClassUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.ClassUpdateWithoutUsersInput, Prisma.ClassUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.ClassCreateWithoutUsersInput, Prisma.ClassUncheckedCreateWithoutUsersInput>;
    where?: Prisma.ClassWhereInput;
};
export type ClassUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.ClassWhereInput;
    data: Prisma.XOR<Prisma.ClassUpdateWithoutUsersInput, Prisma.ClassUncheckedUpdateWithoutUsersInput>;
};
export type ClassUpdateWithoutUsersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    teams?: Prisma.TeamUpdateManyWithoutClassNestedInput;
};
export type ClassUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutClassNestedInput;
};
export type ClassCreateWithoutTeamsInput = {
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutClassInput;
};
export type ClassUncheckedCreateWithoutTeamsInput = {
    id?: number;
    name: string;
    is_active?: boolean;
    created_at?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutClassInput;
};
export type ClassCreateOrConnectWithoutTeamsInput = {
    where: Prisma.ClassWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClassCreateWithoutTeamsInput, Prisma.ClassUncheckedCreateWithoutTeamsInput>;
};
export type ClassUpsertWithoutTeamsInput = {
    update: Prisma.XOR<Prisma.ClassUpdateWithoutTeamsInput, Prisma.ClassUncheckedUpdateWithoutTeamsInput>;
    create: Prisma.XOR<Prisma.ClassCreateWithoutTeamsInput, Prisma.ClassUncheckedCreateWithoutTeamsInput>;
    where?: Prisma.ClassWhereInput;
};
export type ClassUpdateToOneWithWhereWithoutTeamsInput = {
    where?: Prisma.ClassWhereInput;
    data: Prisma.XOR<Prisma.ClassUpdateWithoutTeamsInput, Prisma.ClassUncheckedUpdateWithoutTeamsInput>;
};
export type ClassUpdateWithoutTeamsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutClassNestedInput;
};
export type ClassUncheckedUpdateWithoutTeamsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutClassNestedInput;
};
/**
 * Count Type ClassCountOutputType
 */
export type ClassCountOutputType = {
    users: number;
    teams: number;
};
export type ClassCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | ClassCountOutputTypeCountUsersArgs;
    teams?: boolean | ClassCountOutputTypeCountTeamsArgs;
};
/**
 * ClassCountOutputType without action
 */
export type ClassCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassCountOutputType
     */
    select?: Prisma.ClassCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * ClassCountOutputType without action
 */
export type ClassCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
/**
 * ClassCountOutputType without action
 */
export type ClassCountOutputTypeCountTeamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
};
export type ClassSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.Class$usersArgs<ExtArgs>;
    teams?: boolean | Prisma.Class$teamsArgs<ExtArgs>;
    _count?: boolean | Prisma.ClassCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["class"]>;
export type ClassSelectScalar = {
    id?: boolean;
    name?: boolean;
    is_active?: boolean;
    created_at?: boolean;
};
export type ClassOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "is_active" | "created_at", ExtArgs["result"]["class"]>;
export type ClassInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.Class$usersArgs<ExtArgs>;
    teams?: boolean | Prisma.Class$teamsArgs<ExtArgs>;
    _count?: boolean | Prisma.ClassCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $ClassPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Class";
    objects: {
        users: Prisma.$UserPayload<ExtArgs>[];
        teams: Prisma.$TeamPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        is_active: boolean;
        created_at: Date;
    }, ExtArgs["result"]["class"]>;
    composites: {};
};
export type ClassGetPayload<S extends boolean | null | undefined | ClassDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ClassPayload, S>;
export type ClassCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ClassFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ClassCountAggregateInputType | true;
};
export interface ClassDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Class'];
        meta: {
            name: 'Class';
        };
    };
    /**
     * Find zero or one Class that matches the filter.
     * @param {ClassFindUniqueArgs} args - Arguments to find a Class
     * @example
     * // Get one Class
     * const class = await prisma.class.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClassFindUniqueArgs>(args: Prisma.SelectSubset<T, ClassFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ClassClient<runtime.Types.Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Class that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClassFindUniqueOrThrowArgs} args - Arguments to find a Class
     * @example
     * // Get one Class
     * const class = await prisma.class.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClassFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ClassFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClassClient<runtime.Types.Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Class that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassFindFirstArgs} args - Arguments to find a Class
     * @example
     * // Get one Class
     * const class = await prisma.class.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClassFindFirstArgs>(args?: Prisma.SelectSubset<T, ClassFindFirstArgs<ExtArgs>>): Prisma.Prisma__ClassClient<runtime.Types.Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Class that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassFindFirstOrThrowArgs} args - Arguments to find a Class
     * @example
     * // Get one Class
     * const class = await prisma.class.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClassFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ClassFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClassClient<runtime.Types.Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Classes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Classes
     * const classes = await prisma.class.findMany()
     *
     * // Get first 10 Classes
     * const classes = await prisma.class.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const classWithIdOnly = await prisma.class.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ClassFindManyArgs>(args?: Prisma.SelectSubset<T, ClassFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Class.
     * @param {ClassCreateArgs} args - Arguments to create a Class.
     * @example
     * // Create one Class
     * const Class = await prisma.class.create({
     *   data: {
     *     // ... data to create a Class
     *   }
     * })
     *
     */
    create<T extends ClassCreateArgs>(args: Prisma.SelectSubset<T, ClassCreateArgs<ExtArgs>>): Prisma.Prisma__ClassClient<runtime.Types.Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Classes.
     * @param {ClassCreateManyArgs} args - Arguments to create many Classes.
     * @example
     * // Create many Classes
     * const class = await prisma.class.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ClassCreateManyArgs>(args?: Prisma.SelectSubset<T, ClassCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Class.
     * @param {ClassDeleteArgs} args - Arguments to delete one Class.
     * @example
     * // Delete one Class
     * const Class = await prisma.class.delete({
     *   where: {
     *     // ... filter to delete one Class
     *   }
     * })
     *
     */
    delete<T extends ClassDeleteArgs>(args: Prisma.SelectSubset<T, ClassDeleteArgs<ExtArgs>>): Prisma.Prisma__ClassClient<runtime.Types.Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Class.
     * @param {ClassUpdateArgs} args - Arguments to update one Class.
     * @example
     * // Update one Class
     * const class = await prisma.class.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ClassUpdateArgs>(args: Prisma.SelectSubset<T, ClassUpdateArgs<ExtArgs>>): Prisma.Prisma__ClassClient<runtime.Types.Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Classes.
     * @param {ClassDeleteManyArgs} args - Arguments to filter Classes to delete.
     * @example
     * // Delete a few Classes
     * const { count } = await prisma.class.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ClassDeleteManyArgs>(args?: Prisma.SelectSubset<T, ClassDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Classes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Classes
     * const class = await prisma.class.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ClassUpdateManyArgs>(args: Prisma.SelectSubset<T, ClassUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Class.
     * @param {ClassUpsertArgs} args - Arguments to update or create a Class.
     * @example
     * // Update or create a Class
     * const class = await prisma.class.upsert({
     *   create: {
     *     // ... data to create a Class
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Class we want to update
     *   }
     * })
     */
    upsert<T extends ClassUpsertArgs>(args: Prisma.SelectSubset<T, ClassUpsertArgs<ExtArgs>>): Prisma.Prisma__ClassClient<runtime.Types.Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Classes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassCountArgs} args - Arguments to filter Classes to count.
     * @example
     * // Count the number of Classes
     * const count = await prisma.class.count({
     *   where: {
     *     // ... the filter for the Classes we want to count
     *   }
     * })
    **/
    count<T extends ClassCountArgs>(args?: Prisma.Subset<T, ClassCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ClassCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Class.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClassAggregateArgs>(args: Prisma.Subset<T, ClassAggregateArgs>): Prisma.PrismaPromise<GetClassAggregateType<T>>;
    /**
     * Group by Class.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ClassGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ClassGroupByArgs['orderBy'];
    } : {
        orderBy?: ClassGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ClassGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Class model
     */
    readonly fields: ClassFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Class.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ClassClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.Class$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Class$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    teams<T extends Prisma.Class$teamsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Class$teamsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Class model
 */
export interface ClassFieldRefs {
    readonly id: Prisma.FieldRef<"Class", 'Int'>;
    readonly name: Prisma.FieldRef<"Class", 'String'>;
    readonly is_active: Prisma.FieldRef<"Class", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Class", 'DateTime'>;
}
/**
 * Class findUnique
 */
export type ClassFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
    /**
     * Filter, which Class to fetch.
     */
    where: Prisma.ClassWhereUniqueInput;
};
/**
 * Class findUniqueOrThrow
 */
export type ClassFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
    /**
     * Filter, which Class to fetch.
     */
    where: Prisma.ClassWhereUniqueInput;
};
/**
 * Class findFirst
 */
export type ClassFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
    /**
     * Filter, which Class to fetch.
     */
    where?: Prisma.ClassWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Classes to fetch.
     */
    orderBy?: Prisma.ClassOrderByWithRelationInput | Prisma.ClassOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Classes.
     */
    cursor?: Prisma.ClassWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Classes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Classes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Classes.
     */
    distinct?: Prisma.ClassScalarFieldEnum | Prisma.ClassScalarFieldEnum[];
};
/**
 * Class findFirstOrThrow
 */
export type ClassFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
    /**
     * Filter, which Class to fetch.
     */
    where?: Prisma.ClassWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Classes to fetch.
     */
    orderBy?: Prisma.ClassOrderByWithRelationInput | Prisma.ClassOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Classes.
     */
    cursor?: Prisma.ClassWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Classes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Classes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Classes.
     */
    distinct?: Prisma.ClassScalarFieldEnum | Prisma.ClassScalarFieldEnum[];
};
/**
 * Class findMany
 */
export type ClassFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
    /**
     * Filter, which Classes to fetch.
     */
    where?: Prisma.ClassWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Classes to fetch.
     */
    orderBy?: Prisma.ClassOrderByWithRelationInput | Prisma.ClassOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Classes.
     */
    cursor?: Prisma.ClassWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Classes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Classes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Classes.
     */
    distinct?: Prisma.ClassScalarFieldEnum | Prisma.ClassScalarFieldEnum[];
};
/**
 * Class create
 */
export type ClassCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
    /**
     * The data needed to create a Class.
     */
    data: Prisma.XOR<Prisma.ClassCreateInput, Prisma.ClassUncheckedCreateInput>;
};
/**
 * Class createMany
 */
export type ClassCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Classes.
     */
    data: Prisma.ClassCreateManyInput | Prisma.ClassCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Class update
 */
export type ClassUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
    /**
     * The data needed to update a Class.
     */
    data: Prisma.XOR<Prisma.ClassUpdateInput, Prisma.ClassUncheckedUpdateInput>;
    /**
     * Choose, which Class to update.
     */
    where: Prisma.ClassWhereUniqueInput;
};
/**
 * Class updateMany
 */
export type ClassUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Classes.
     */
    data: Prisma.XOR<Prisma.ClassUpdateManyMutationInput, Prisma.ClassUncheckedUpdateManyInput>;
    /**
     * Filter which Classes to update
     */
    where?: Prisma.ClassWhereInput;
    /**
     * Limit how many Classes to update.
     */
    limit?: number;
};
/**
 * Class upsert
 */
export type ClassUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
    /**
     * The filter to search for the Class to update in case it exists.
     */
    where: Prisma.ClassWhereUniqueInput;
    /**
     * In case the Class found by the `where` argument doesn't exist, create a new Class with this data.
     */
    create: Prisma.XOR<Prisma.ClassCreateInput, Prisma.ClassUncheckedCreateInput>;
    /**
     * In case the Class was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ClassUpdateInput, Prisma.ClassUncheckedUpdateInput>;
};
/**
 * Class delete
 */
export type ClassDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
    /**
     * Filter which Class to delete.
     */
    where: Prisma.ClassWhereUniqueInput;
};
/**
 * Class deleteMany
 */
export type ClassDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Classes to delete
     */
    where?: Prisma.ClassWhereInput;
    /**
     * Limit how many Classes to delete.
     */
    limit?: number;
};
/**
 * Class.users
 */
export type Class$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * Class.teams
 */
export type Class$teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    cursor?: Prisma.TeamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
/**
 * Class without action
 */
export type ClassDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: Prisma.ClassSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Class
     */
    omit?: Prisma.ClassOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassInclude<ExtArgs> | null;
};
//# sourceMappingURL=Class.d.ts.map