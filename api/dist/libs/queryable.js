// ─── Builder ──────────────────────────────────────────────────────────────────
class QueryBuilder {
    config;
    wheres = [];
    orderBy = [];
    skip = 0;
    take;
    page = 1;
    cursorColumn = "id";
    cursorDir = "asc";
    constructor(config) {
        this.config = config;
        this.take = config.defaultPerPage ?? 15;
    }
    applySimpleFilter(req) {
        const { filterable = [] } = this.config;
        for (const field of filterable) {
            const value = req[field];
            if (value === undefined || value === null || value === "")
                continue;
            if (Array.isArray(value)) {
                this.wheres.push({ [field]: { in: value } });
            }
            else {
                this.wheres.push({ [field]: value });
            }
        }
        return this;
    }
    applyComplexFilter(filter = {}) {
        for (const [column, conditions] of Object.entries(filter)) {
            const clause = {};
            for (const [op, value] of Object.entries(conditions)) {
                switch (op) {
                    case "lt":
                        clause.lt = value;
                        break;
                    case "lte":
                        clause.lte = value;
                        break;
                    case "gt":
                        clause.gt = value;
                        break;
                    case "gte":
                        clause.gte = value;
                        break;
                    case "eq":
                        clause.equals = value;
                        break;
                    case "neq":
                        clause.not = value;
                        break;
                    case "like":
                        clause.contains = value;
                        break;
                    case "in":
                        clause.in = toArray(value);
                        break;
                    case "not_in":
                        clause.notIn = toArray(value);
                        break;
                    case "null":
                        clause.equals = null;
                        break;
                    case "not_null":
                        clause.not = null;
                        break;
                    case "between": {
                        const [min, max] = String(value).split(",");
                        if (min && max) {
                            clause.gte = min;
                            clause.lte = max;
                        }
                        break;
                    }
                }
            }
            if (Object.keys(clause).length)
                this.wheres.push({ [column]: clause });
        }
        return this;
    }
    applySearch(keyword) {
        const { searchFields = [] } = this.config;
        if (!keyword || !searchFields.length)
            return this;
        this.wheres.push({ OR: searchFields.map((f) => ({ [f]: { contains: keyword } })) });
        return this;
    }
    applySort(column, direction) {
        const { sortable = [], defaultSort } = this.config;
        const dir = direction === "desc" ? "desc" : "asc";
        if (column && sortable.includes(column)) {
            this.orderBy.push({ [column]: dir });
            return this;
        }
        if (defaultSort) {
            this.orderBy.push({ [defaultSort.column]: defaultSort.direction });
        }
        else {
            this.orderBy.push({ created_at: "desc" });
        }
        return this;
    }
    applyPagination(page, perPage) {
        const maxPerPage = this.config.maxPerPage ?? 100;
        this.page = Math.max(1, Number(page) || 1);
        this.take = Math.min(Math.max(1, Number(perPage) || this.take), maxPerPage);
        this.skip = (this.page - 1) * this.take;
        return this;
    }
    applyScrollSort(column, direction) {
        const { sortable = [], defaultSort } = this.config;
        const dir = direction === "desc" ? "desc" : "asc";
        const col = column && sortable.includes(column) ? column : defaultSort?.column ?? "id";
        this.cursorColumn = col;
        this.cursorDir = dir;
        this.orderBy = col === "id" ? [{ id: dir }] : [{ [col]: dir }, { id: dir }];
        return this;
    }
    applyCursor(cursor) {
        if (!cursor)
            return this;
        const { v, id } = decodeCursor(cursor);
        const op = this.cursorDir === "asc" ? "gt" : "lt";
        this.wheres.push(this.cursorColumn === "id"
            ? { id: { [op]: id } }
            : { OR: [{ [this.cursorColumn]: { [op]: v } }, { [this.cursorColumn]: v, id: { [op]: id } }] });
        return this;
    }
    getCursorColumn() { return this.cursorColumn; }
    buildScroll(limit) {
        this.config.beforeBuild?.(this.wheres);
        return {
            where: this.wheres.length ? { AND: this.wheres } : {},
            orderBy: this.orderBy,
            take: limit + 1, // +1 để biết hasMore mà không cần COUNT
        };
    }
    build() {
        // beforeBuild hook — thêm fixed where (deleted_at, tenant_id, ...)
        this.config.beforeBuild?.(this.wheres);
        return {
            where: this.wheres.length ? { AND: this.wheres } : {},
            orderBy: this.orderBy,
            skip: this.skip,
            take: this.take,
        };
    }
    buildMeta(total) {
        const last_page = Math.ceil(total / this.take) || 1;
        return { total, page: this.page, per_page: this.take, last_page, has_next: this.page < last_page };
    }
}
// ─── Queryable Factory ────────────────────────────────────────────────────────
/**
 * Trả về hàm `query()` gắn vào service.
 * Gọi 1 lần khi khởi tạo service, dùng lại cho mọi request.
 */
export class Queryable {
    delegate;
    baseConfig;
    constructor(delegate, baseConfig) {
        this.delegate = delegate;
        this.baseConfig = baseConfig;
    }
    async run(req, overrideConfig) {
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
    async runScroll(req, overrideConfig) {
        const config = overrideConfig ? { ...this.baseConfig, ...overrideConfig } : this.baseConfig;
        const builder = new QueryBuilder(config);
        const limit = Math.min(Math.max(1, Number(req.limit) || config.defaultPerPage || 20), config.maxPerPage ?? 100);
        const args = builder
            .applySimpleFilter(req)
            .applyComplexFilter(req.filter)
            .applySearch(req.q)
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
}
// ─── Utils ────────────────────────────────────────────────────────────────────
function toArray(value) {
    if (Array.isArray(value))
        return value;
    return String(value).split(",").map((v) => v.trim());
}
function encodeCursor(v, id) {
    return Buffer.from(JSON.stringify({ v, id })).toString("base64url");
}
function decodeCursor(cursor) {
    return JSON.parse(Buffer.from(cursor, "base64url").toString("utf-8"));
}
//# sourceMappingURL=queryable.js.map