// src/lib/queryable.ts
import { Prisma, PrismaClient } from "@prisma/client";

// ─── Core Types ───────────────────────────────────────────────────────────────

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
    filter?: Record<string, Record<string, unknown>>;  // complexFilter
    [key: string]: unknown;                             // simple filter fields
}

/** Config khai báo 1 lần ở service — không thay đổi theo request */
export interface QueryableConfig<TInclude = object, TSelect = object> {
    searchFields?: string[];
    sortable?: string[];
    defaultSort?: { column: string; direction: SortDir };
    filterable?: string[];          // whitelist simple filter fields
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

// ─── Builder ──────────────────────────────────────────────────────────────────

class QueryBuilder {
    private wheres: WhereClause[] = [];
    private orderBy: Record<string, SortDir>[] = [];
    private skip = 0;
    private take: number;
    private page = 1;

    constructor(private config: QueryableConfig) {
        this.take = config.defaultPerPage ?? 15;
    }

    applySimpleFilter(req: QueryRequest): this {
        const { filterable = [] } = this.config;
        for (const field of filterable) {
            const value = req[field];
            if (value === undefined || value === null || value === "") continue;
            if (Array.isArray(value)) {
                this.wheres.push({ [field]: { in: value } });
            } else {
                this.wheres.push({ [field]: value });
            }
        }
        return this;
    }

    applyComplexFilter(filter: QueryRequest["filter"] = {}): this {
        for (const [column, conditions] of Object.entries(filter)) {
            const clause: Record<string, unknown> = {};

            for (const [op, value] of Object.entries(conditions)) {
                switch (op) {
                    case "lt": clause.lt = value; break;
                    case "lte": clause.lte = value; break;
                    case "gt": clause.gt = value; break;
                    case "gte": clause.gte = value; break;
                    case "eq": clause.equals = value; break;
                    case "neq": clause.not = value; break;
                    case "like": clause.contains = value; break;
                    case "in": clause.in = toArray(value); break;
                    case "not_in": clause.notIn = toArray(value); break;
                    case "null": clause.equals = null; break;
                    case "not_null": clause.not = null; break;
                    case "between": {
                        const [min, max] = String(value).split(",");
                        if (min && max) { clause.gte = min; clause.lte = max; }
                        break;
                    }
                }
            }

            if (Object.keys(clause).length) this.wheres.push({ [column]: clause });
        }
        return this;
    }

    applySearch(keyword?: string): this {
        const { searchFields = [] } = this.config;
        if (!keyword || !searchFields.length) return this;
        this.wheres.push({ OR: searchFields.map((f) => ({ [f]: { contains: keyword } })) });
        return this;
    }

    applySort(column?: string, direction?: SortDir): this {
        const { sortable = [], defaultSort } = this.config;
        const dir: SortDir = direction === "desc" ? "desc" : "asc";

        if (column && sortable.includes(column)) {
            this.orderBy.push({ [column]: dir });
            return this;
        }

        if (defaultSort) {
            this.orderBy.push({ [defaultSort.column]: defaultSort.direction });
        } else {
            this.orderBy.push({ created_at: "desc" });
        }
        return this;
    }

    applyPagination(page?: string | number, perPage?: string | number): this {
        const maxPerPage = this.config.maxPerPage ?? 100;
        this.page = Math.max(1, Number(page) || 1);
        this.take = Math.min(Math.max(1, Number(perPage) || this.take), maxPerPage);
        this.skip = (this.page - 1) * this.take;
        return this;
    }

    build(): { where: object; orderBy: object[]; skip: number; take: number } {
        // beforeBuild hook — thêm fixed where (deleted_at, tenant_id, ...)
        this.config.beforeBuild?.(this.wheres);

        return {
            where: this.wheres.length ? { AND: this.wheres } : {},
            orderBy: this.orderBy,
            skip: this.skip,
            take: this.take,
        };
    }

    buildMeta(total: number): PaginationMeta {
        const last_page = Math.ceil(total / this.take) || 1;
        return { total, page: this.page, per_page: this.take, last_page, has_next: this.page < last_page };
    }
}

// ─── Queryable Factory ────────────────────────────────────────────────────────

/**
 * Trả về hàm `query()` gắn vào service.
 * Gọi 1 lần khi khởi tạo service, dùng lại cho mọi request.
 */
export class Queryable<T> {
    constructor(
        private delegate: { findMany: (a: any) => Promise<T[]>; count: (a: any) => Promise<number> },
        private baseConfig: QueryableConfig
    ) { }

    async run(req: QueryRequest, overrideConfig?: Partial<QueryableConfig>): Promise<PaginatedResult<T>> {
        const config = overrideConfig ? { ...this.baseConfig, ...overrideConfig } : this.baseConfig;
        const builder = new QueryBuilder(config);

        const args = builder
            .applySimpleFilter(req)
            .applyComplexFilter(req.filter)
            .applySearch(req.q)
            .applySort(req.sort, req.direction)
            .applyPagination(req.page, req.per_page)
            .build();

        const queryArgs = {
            ...args,
            ...(config.include && { include: config.include }),
            ...(config.select && { select: config.select }),
        };

        const [raw, total] = await Promise.all([
            this.delegate.findMany(queryArgs),
            this.delegate.count({ where: args.where }),
        ]);

        const data = config.afterFetch ? config.afterFetch(raw) : raw;
        return { data, meta: builder.buildMeta(total) };
    }
}
// ─── Utils ────────────────────────────────────────────────────────────────────

function toArray(value: unknown): unknown[] {
    if (Array.isArray(value)) return value;
    return String(value).split(",").map((v) => v.trim());
}