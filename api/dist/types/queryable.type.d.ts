export type SortDir = "asc" | "desc";
export interface PaginationMeta {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
    has_next: boolean;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}
/** Phần shape dùng chung giữa offset-based và cursor-based query */
export interface QueryRequestBase {
    q?: string;
    sort?: string;
    direction?: SortDir;
    filter?: Record<string, Record<string, unknown>>;
}
/** Index signature tách riêng để tránh TS collapse field cụ thể về unknown khi Omit/Pick */
export interface DynamicFields {
    [key: string]: unknown;
}
/** Request query đến từ controller — raw, chưa validate */
export interface QueryRequest extends QueryRequestBase, DynamicFields {
    page?: string | number;
    per_page?: string | number;
}
export interface CursorQueryRequest extends QueryRequestBase, DynamicFields {
    cursor?: string;
    limit?: string | number;
}
/** Config khai báo 1 lần ở service — không thay đổi theo request */
export interface CursorPage<T> {
    data: T[];
    hasMore: boolean;
    nextCursor: string | null;
}
/** Config khai báo 1 lần ở service — không thay đổi theo request */
export interface QueryableConfig<TInclude = object, TSelect = object> {
    searchFields?: string[];
    sortable?: string[];
    defaultSort?: {
        column: string;
        direction: SortDir;
    };
    filterable?: string[];
    defaultPerPage?: number;
    maxPerPage?: number;
    include?: TInclude;
    select?: TSelect;
    /** Hook chạy trước khi build — thêm where cố định (soft delete, tenant, ...) */
    beforeBuild?: (where: WhereClause[]) => void;
    /** Hook transform data sau khi query */
    afterFetch?: <T>(data: T[]) => T[];
}
export type WhereClause = Record<string, unknown>;
//# sourceMappingURL=queryable.type.d.ts.map