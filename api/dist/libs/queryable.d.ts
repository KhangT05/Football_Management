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
/** Request query đến từ controller — raw, chưa validate */
export interface QueryRequest {
    q?: string;
    sort?: string;
    direction?: SortDir;
    page?: string | number;
    per_page?: string | number;
    filter?: Record<string, Record<string, unknown>>;
    [key: string]: unknown;
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
type WhereClause = Record<string, unknown>;
/**
 * Trả về hàm `query()` gắn vào service.
 * Gọi 1 lần khi khởi tạo service, dùng lại cho mọi request.
 */
export declare function createQueryable<T>(delegate: {
    findMany: (a: any) => Promise<T[]>;
    count: (a: any) => Promise<number>;
}, config: QueryableConfig): (req: QueryRequest) => Promise<PaginatedResult<T>>;
export {};
//# sourceMappingURL=queryable.d.ts.map