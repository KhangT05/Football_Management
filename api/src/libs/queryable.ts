// ─── Builder ──────────────────────────────────────────────────────────────────

import { createAppError } from "../common/app.error.js";
import {
    CursorPage,
    CursorQueryRequest,
    PaginatedResult, PaginationMeta,
    QueryableConfig, QueryRequest, SortDir,
    WhereClause
} from "../types/queryable.type.js";

class QueryBuilder {
    private wheres: WhereClause[] = [];
    private orderBy: Record<string, SortDir>[] = [];
    private skip = 0;
    private take: number;
    private page = 1;
    private cursorColumn = "id";
    private cursorDir: SortDir = "asc";

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
    applyScrollSort(column?: string, direction?: SortDir): this {
        const { sortable = [], defaultSort } = this.config;
        const dir: SortDir = direction === "desc" ? "desc" : "asc";
        const col = column && sortable.includes(column) ? column : defaultSort?.column ?? "id";
        this.cursorColumn = col;
        this.cursorDir = dir;
        this.orderBy = col === "id" ? [{ id: dir }] : [{ [col]: dir }, { id: dir }];
        return this;
    }

    applyCursor(cursor?: string): this {
        if (!cursor) return this;
        const { v, id } = decodeCursor(cursor);
        const op = this.cursorDir === "asc" ? "gt" : "lt";
        this.wheres.push(
            this.cursorColumn === "id"
                ? { id: { [op]: id } }
                : { OR: [{ [this.cursorColumn]: { [op]: v } }, { [this.cursorColumn]: v, id: { [op]: id } }] }
        );
        return this;
    }

    getCursorColumn(): string { return this.cursorColumn; }

    applyPeriod(period?: string): this {
        const { dateField } = this.config;
        if (!period || !dateField) return this; // opt-in: config phải khai báo dateField
        const normalized = period.trim();
        this.wheres.push({ [dateField]: { gte: parsePeriod(normalized) } });
        return this;
    }

    buildScroll(limit: number) {
        this.config.beforeBuild?.(this.wheres);
        return {
            where: this.wheres.length ? { AND: this.wheres } : {},
            orderBy: this.orderBy,
            take: limit + 1, // +1 để biết hasMore mà không cần COUNT
        };
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
export class Queryable<T, Delegate extends {
    findMany: (args: any) => Promise<any[]>;
    count: (args: any) => Promise<number>;
} = any> {
    constructor(
        private delegate: Delegate,
        private baseConfig: QueryableConfig
    ) { }

    async run(req: QueryRequest, overrideConfig?: Partial<QueryableConfig>): Promise<PaginatedResult<T>> {
        const config = overrideConfig ? { ...this.baseConfig, ...overrideConfig } : this.baseConfig;
        const builder = new QueryBuilder(config);

        const args = builder
            .applySimpleFilter(req)
            .applyComplexFilter(req.filter)
            .applySearch(req.q)
            .applyPeriod(req.period)
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

    async runScroll(req: CursorQueryRequest, overrideConfig?: Partial<QueryableConfig>): Promise<CursorPage<T>> {
        const config = overrideConfig ? { ...this.baseConfig, ...overrideConfig } : this.baseConfig;
        const builder = new QueryBuilder(config);
        const limit = Math.min(Math.max(1, Number(req.limit) || config.defaultPerPage || 20), config.maxPerPage ?? 100);

        const args = builder
            .applySimpleFilter(req)
            .applyComplexFilter(req.filter)
            .applySearch(req.q)
            .applyPeriod(req.period)
            .applyScrollSort(req.sort, req.direction)
            .applyCursor(req.cursor)
            .buildScroll(limit);

        // ép id + cursorColumn luôn có trong select, không thì cursor kế tiếp bị undefined
        const select = config.select
            ? { ...config.select, id: true, [builder.getCursorColumn()]: true }
            : undefined;

        const rows = await this.delegate.findMany({
            ...args,
            ...(config.include && { include: config.include }),
            ...(select && { select }),
        });

        const hasMore = rows.length > limit;
        const page = hasMore ? rows.slice(0, limit) : rows;
        const data = config.afterFetch ? config.afterFetch(page) : page;
        const last = page[page.length - 1];

        return {
            data,
            hasMore,
            nextCursor: hasMore && last ? encodeCursor(last[builder.getCursorColumn()], last.id) : null,
        };
    }

    async count(
        req: Pick<QueryRequest, "filter" | "q" | "period"> & Partial<Record<string, unknown>>,
        overrideConfig?: Partial<QueryableConfig>
    ): Promise<number> {
        const config = overrideConfig ? { ...this.baseConfig, ...overrideConfig } : this.baseConfig;
        const builder = new QueryBuilder(config);

        const { where } = builder
            .applySimpleFilter(req as QueryRequest)
            .applyComplexFilter(req.filter)
            .applySearch(req.q)
            .applyPeriod(req.period)
            .build();

        return this.delegate.count({ where });
    }
}
// ─── Utils ────────────────────────────────────────────────────────────────────
// queryable.ts

export const PERIOD_DAYS: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "3m": 90,
    "6m": 180,
    "1y": 365,
};

function parsePeriod(period: string): Date {
    const days = PERIOD_DAYS[period];
    if (!days) {
        throw createAppError(
            "VALIDATION_ERROR",
            `Invalid period: ${period}`,
            "period không hợp lệ, dùng: 7d, 30d, 90d, 3m, 6m, 1y",
        );
    }
    return new Date(Date.now() - days * 86_400_000);
}

function toArray(value: unknown): unknown[] {
    if (Array.isArray(value)) return value;
    return String(value).split(",").map((v) => v.trim());
}
function encodeCursor(v: unknown, id: number): string {
    return Buffer.from(JSON.stringify({ v, id })).toString("base64url");
}
function decodeCursor(cursor: string): { v: unknown; id: number } {
    return JSON.parse(Buffer.from(cursor, "base64url").toString("utf-8"));
}
