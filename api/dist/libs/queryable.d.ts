import { CursorPage, CursorQueryRequest, PaginatedResult, QueryableConfig, QueryRequest } from "../types/queryable.type.js";
/**
 * Trả về hàm `query()` gắn vào service.
 * Gọi 1 lần khi khởi tạo service, dùng lại cho mọi request.
 */
export declare class Queryable<T, Delegate extends {
    findMany: (args: any) => Promise<any[]>;
    count: (args: any) => Promise<number>;
} = any> {
    private delegate;
    private baseConfig;
    constructor(delegate: Delegate, baseConfig: QueryableConfig);
    run(req: QueryRequest, overrideConfig?: Partial<QueryableConfig>): Promise<PaginatedResult<T>>;
    runScroll(req: CursorQueryRequest, overrideConfig?: Partial<QueryableConfig>): Promise<CursorPage<T>>;
}
//# sourceMappingURL=queryable.d.ts.map