# Backend Architecture — Express + TSOA + Prisma

Tài liệu này mô tả toàn bộ luồng từ khi request vào đến khi response ra, cách các layer liên kết nhau, và cách dùng code generator để tạo controller mới.

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Middleware pipeline](#2-middleware-pipeline)
3. [Error handling](#3-error-handling)
4. [Response shape](#4-response-shape)
5. [Schema & DTO validation](#5-schema--dto-validation)
6. [Queryable — filter/sort/paginate](#6-queryable--filtersortpaginate)
7. [Service layer](#7-service-layer)
8. [Controller layer (TSOA)](#8-controller-layer-tsoa)
9. [Router wiring](#9-router-wiring)
10. [Tạo controller mới với generator](#10-tạo-controller-mới-với-generator)
11. [Checklist khi thêm một entity mới](#11-checklist-khi-thêm-một-entity-mới)

---

## 1. Tổng quan kiến trúc

```
Request
  │
  ▼
Express middleware pipeline
  ├── cors / helmet / json parser
  ├── asyncHandler (bắt lỗi async)
  └── validate (Zod schema)
  │
  ▼
TSOA Router  ──►  Controller  ──►  Service  ──►  Prisma (DB)
                                      │
                                  queryable (filter/sort/page)
  │
  ▼
makeResponse()  ──►  ApiResponseShape<T>
  │
  ▼
errorMiddleware (nếu throw AppError)
```

**Nguyên tắc phân layer:**

- **Controller** — nhận request, gọi service, wrap response. Không chứa business logic.
- **Service** — business logic, DB access qua Prisma. Không biết về HTTP.
- **DTO/Schema** — định nghĩa shape của request body và validate bằng Zod.
- **Queryable** — utility tái sử dụng cho filter/search/sort/paginate — service gọi, controller chỉ pass query params.

---

## 2. Middleware pipeline

```
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(validate(schema))      ← Zod validation, gắn trên route cụ thể
app.use(RegisterRoutes(app))   ← TSOA generated router
app.use(errorMiddleware)       ← PHẢI đứng SAU router, có 4 params
```


### `validate` middleware

```ts
// src/middleware/validate.middleware.ts
export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }
    req.body = result.data;  // replace bằng parsed data (type-safe, stripped unknown fields)
    next();
  };
```

**Gắn vào route:**

```ts
router.post("/roles", validate(CreateRoleSchema), asyncHandler(handler));
```

**Lưu ý:** `req.body = result.data` quan trọng — Zod `.parse()` strip các field không khai báo trong schema, tránh mass assignment. Nếu bỏ dòng này, controller nhận raw body chưa sanitize.

---

## 3. Error handling

### Error registry

```ts
// src/common/error.code.ts
export const ERROR_REGISTRY = {
  // Auth/Access — map về 403 để tránh leak thông tin (không cho biết resource có tồn tại không)
  UNAUTHORIZED:  { httpStatus: 401, expose: 403, isAuthError: true },
  FORBIDDEN:     { httpStatus: 403, expose: 403, isAuthError: true },
  NOT_FOUND:     { httpStatus: 404, expose: 403, isAuthError: true },  // ← intentional: 404 → 403

  // Business logic — expose thật để client handle
  CONFLICT:          { httpStatus: 409, expose: 409, isAuthError: false },
  VALIDATION_ERROR:  { httpStatus: 422, expose: 422, isAuthError: false },
  RATE_LIMITED:      { httpStatus: 429, expose: 429, isAuthError: false },

  // Server errors — che hết, log nội bộ
  DB_ERROR:           { httpStatus: 500, expose: 500, isAuthError: false },
  EXTERNAL_API_ERROR: { httpStatus: 502, expose: 500, isAuthError: false }, // không leak vendor
  TIMEOUT:            { httpStatus: 504, expose: 500, isAuthError: false },
} as const;

export type ErrorCode = keyof typeof ERROR_REGISTRY;
```

**Tại sao `NOT_FOUND` expose `403`:** Tránh enumeration attack — client không biết được resource không tồn tại hay không có quyền truy cập. Đây là intentional security decision, không phải bug.

### `AppError`

```ts
// src/common/app.error.ts
export class AppError extends Error {
  public readonly httpStatus: number;
  public readonly exposedStatus: number;

  constructor(
    public readonly code: ErrorCode,
    public readonly internalMessage?: string,  // chỉ log nội bộ, không trả về client
    public readonly clientMessage?: string,    // override message trả về client nếu cần
  ) {
    super(internalMessage);
    this.httpStatus = ERROR_REGISTRY[code].httpStatus;
    this.exposedStatus = ERROR_REGISTRY[code].expose;
    this.name = this.constructor.name;
  }
}

// Convenience factory — dùng thay new AppError() ở những chỗ cần ngắn gọn
export function createAppError(code: ErrorCode, internalMessage?: string, clientMessage?: string) {
  return new AppError(code, internalMessage, clientMessage);
}
```

**Dùng trong service:**

```ts
// Throw AppError — errorMiddleware sẽ catch
throw new AppError("NOT_FOUND", `Role ${id} not found in DB`);

// Hoặc dùng factory
throw createAppError("CONFLICT", "duplicate name", "Tên vai trò đã tồn tại");
```

**`internalMessage`** ghi vào log (Winston, Pino...), **không bao giờ** trả về response. `clientMessage` mới là cái client thấy.

### `errorMiddleware`

```ts
// src/middleware/error.middleware.ts
export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers["x-request-id"] as string) ?? crypto.randomUUID();

  if (err instanceof AppError) {
    const isAuthError = AUTH_CODE.has(err.code);
    res.status(err.exposedStatus).json({
      status: false,
      code: isAuthError ? "FORBIDDEN" : err.code,      // auth errors đều thành FORBIDDEN
      message: isAuthError ? "Access denied" : (err.clientMessage ?? "Request failed"),
      requestId,
    });
    return;
  }

  // Unhandled error — log đầy đủ, trả về generic message
  res.status(500).json({
    status: false,
    code: "INTERNAL_ERROR",
    message: "Something went wrong",
    requestId,
  });
}
```

**Quan trọng:** Middleware này PHẢI có đúng 4 params `(err, req, res, next)` — Express nhận diện error middleware bằng arity. Thiếu `next` dù không dùng sẽ làm middleware không hoạt động.

**Đăng ký PHẢI sau router:**

```ts
app.use(RegisterRoutes(app));    // router trước
app.use(errorMiddleware);        // error handler sau cùng
```

---

## 4. Response shape

```ts
// src/common/response.ts
export interface ApiResponseShape<T = null> {
  status: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export function makeResponse<T>(data: T | null, message: string): ApiResponseShape<T> {
  return {
    status: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}
```

**Dùng trong controller:**

```ts
@Get("/")
async findAll(): Promise<ApiResponseShape<PaginatedResult<Role>>> {
  const result = await this.service.findAll();
  return makeResponse(result, "OK");
}

@Post("/")
@SuccessResponse(201, "Created")
async create(@Body() body: CreateRoleDto): Promise<ApiResponseShape<Role>> {
  this.setStatus(201);
  const role = await this.service.create(body);
  return makeResponse(role, "Role created");
}
```

**Convention:**
- Success → `makeResponse(data, message)`, `status: true`
- Error → `errorMiddleware` tự build response, `status: false`
- Client phân biệt success/error qua HTTP status code + `status` field

---

## 5. Schema & DTO validation

```
src/dtos/
  role.schema.ts     ← Zod schema + inferred TypeScript types
```

**Pattern chuẩn:**

```ts
// src/dtos/role.schema.ts
import { z } from "zod";

export const CreateRoleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const UpdateRoleSchema = CreateRoleSchema.partial();  // tất cả field optional cho PATCH

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
```

**Naming convention:**
- `*Schema` — Zod object, dùng cho `validate()` middleware
- `*Dto` — TypeScript type, dùng trong service/controller type signature
- Hai cái này từ cùng một source, không bao giờ drift

**Generator check:** Script `generate-controller.ts` sẽ kiểm tra file schema tồn tại và export `Create{Entity}Dto` + `Update{Entity}Dto` trước khi generate.

---

## 6. Queryable — filter/sort/paginate

```
src/lib/queryable.ts
```

Utility tái sử dụng — wrap Prisma `findMany` + `count`, xử lý toàn bộ logic filter/search/sort/paginate. Service khai báo config 1 lần, controller chỉ pass query params.

### Types

```ts
// QueryRequest — raw params từ controller, chưa validate
interface QueryRequest {
  q?: string;                                           // full-text search
  sort?: string;                                        // field name
  direction?: "asc" | "desc";
  page?: string | number;
  per_page?: string | number;
  filter?: Record<string, Record<string, unknown>>;     // complex filter
  [key: string]: unknown;                               // simple filter fields
}

// PaginatedResult<T> — response shape
interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
    has_next: boolean;
  };
}
```

### Khai báo trong service

```ts
export class RoleService {
  private readonly query: (req: QueryRequest) => Promise<PaginatedResult<Role>>;

  constructor(private readonly db: PrismaClient) {
    this.query = createQueryable<Role>(this.db.role, {
      searchFields: ["name", "description"],     // fields dùng cho ?q=
      sortable: ["id", "name", "created_at"],    // whitelist sort fields
      defaultSort: { column: "id", direction: "asc" },
      filterable: ["is_active"],                 // whitelist simple filter
      defaultPerPage: 20,
      maxPerPage: 100,
      beforeBuild: (where) => {
        where.push({ is_active: true });         // fixed condition, client không override được
      },
    });
  }

  findAll(req: QueryRequest = {}): Promise<PaginatedResult<Role>> {
    return this.query(req);
  }
}
```

### Complex filter từ client

Client gửi qua query string:

```
GET /roles?filter[created_at][gte]=2024-01-01&filter[created_at][lte]=2024-12-31
GET /roles?filter[name][like]=admin
GET /roles?filter[id][in]=1,2,3
```

Các operator hỗ trợ: `lt`, `lte`, `gt`, `gte`, `eq`, `neq`, `like`, `in`, `not_in`, `null`, `not_null`, `between`

### Simple filter

```
GET /roles?is_active=true    ← phải có trong filterable whitelist
```

### Lưu ý security

`filterable` và `sortable` là **whitelist** — không khai báo thì không filter/sort được. Tránh tình huống client gửi `filter[password][like]=abc` lọc được field nhạy cảm.

`beforeBuild` hook push `where` condition **sau** khi client filter được apply — đảm bảo điều kiện cố định (soft delete, tenant isolation...) không bị override.

---

## 7. Service layer

```
src/services/
  role.service.ts
```

**Pattern chuẩn:**

```ts
// src/services/role.service.ts
import type { PrismaClient, Role } from "../generated/prisma/client.js";
import type { CreateRoleDto, UpdateRoleDto } from "../dtos/role.schema.js";
import { createQueryable, type QueryRequest, type PaginatedResult } from "../lib/queryable.js";

export class RoleService {
  private readonly query: (req: QueryRequest) => Promise<PaginatedResult<Role>>;

  constructor(private readonly db: PrismaClient) {
    this.query = createQueryable<Role>(this.db.role, {
      searchFields: ["name", "description"],
      sortable: ["id", "name", "created_at"],
      defaultSort: { column: "id", direction: "asc" },
      filterable: ["is_active"],
      defaultPerPage: 20,
      maxPerPage: 100,
      beforeBuild: (where) => {
        where.push({ is_active: true });
      },
    });
  }

  findAll(req: QueryRequest = {}): Promise<PaginatedResult<Role>> {
    return this.query(req);
  }

  findById(id: number): Promise<Role | null> {
    return this.db.role.findUnique({ where: { id } });
  }

  async findByIdOrFail(id: number): Promise<Role> {
    const role = await this.db.role.findUnique({ where: { id } });
    if (!role) throw new AppError("NOT_FOUND", `Role ${id} not found`);
    return role;
  }

  create(data: CreateRoleDto): Promise<Role> {
    return this.db.role.create({ data });
  }

  async update(id: number, data: UpdateRoleDto): Promise<Role> {
    await this.findByIdOrFail(id);
    return this.db.role.update({ where: { id }, data });
  }

  async softDelete(id: number): Promise<void> {
    await this.findByIdOrFail(id);
    await this.db.role.update({ where: { id }, data: { is_active: false } });
  }
}
```

**Conventions:**
- `findById` trả `null` nếu không tìm thấy — caller tự quyết định xử lý
- `findByIdOrFail` throw `AppError("NOT_FOUND")` — dùng khi chắc chắn phải có
- `softDelete` set `is_active: false`, không xóa row khỏi DB
- Constructor inject `PrismaClient` — không import global singleton, dễ test

---

## 8. Controller layer (TSOA)

```
src/controllers/
  role.controller.ts
```

TSOA đọc TypeScript decorators để generate Express router và OpenAPI spec tự động.

**Pattern chuẩn:**

```ts
// src/controllers/role.controller.ts
import {
  Controller, Get, Post, Patch, Delete,
  Path, Query, Body, Tags, Route, SuccessResponse
} from "tsoa";
import { RoleService } from "../services/role.service.js";
import type { Role } from "../generated/prisma/client.js";
import { type CreateRoleDto, type UpdateRoleDto } from "../dtos/role.schema.js";
import type { PaginatedResult, QueryRequest } from "../lib/queryable.js";
import { makeResponse, type ApiResponseShape } from "../common/response.js";

@Route("roles")
@Tags("Roles")
export class RoleController extends Controller {
  constructor(private service: RoleService) {
    super();
  }

  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc",
  ): Promise<ApiResponseShape<PaginatedResult<Role>>> {
    const result = await this.service.findAll({ page, per_page, q, sort, direction });
    return makeResponse(result, "OK");
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<ApiResponseShape<Role>> {
    const role = await this.service.findByIdOrFail(id);
    return makeResponse(role, "OK");
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  async create(@Body() body: CreateRoleDto): Promise<ApiResponseShape<Role>> {
    this.setStatus(201);
    const role = await this.service.create(body);
    return makeResponse(role, "Role created");
  }

  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: UpdateRoleDto,
  ): Promise<ApiResponseShape<Role>> {
    const role = await this.service.update(id, body);
    return makeResponse(role, "Role updated");
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    await this.service.softDelete(id);
  }
}
```

**TSOA decorators quan trọng:**

| Decorator | Tác dụng |
|-----------|----------|
| `@Route("roles")` | Base path cho tất cả endpoint trong controller |
| `@Tags("Roles")` | Group trong Swagger UI |
| `@Security("jwt")` | Require auth — gắn ở class level hoặc method level |
| `@Get`, `@Post`, `@Patch`, `@Delete` | HTTP method + sub-path |
| `@Path()` | Bind param từ URL path `/roles/{id}` |
| `@Query()` | Bind param từ query string `?page=1` |
| `@Body()` | Bind request body |
| `@SuccessResponse(201, "Created")` | Override default 200 trong Swagger spec |

---

## 9. Router wiring

TSOA generate file `src/routes/routes.ts` từ decorators. Không edit file này thủ công.

```ts
// src/app.ts
import express from "express";
import { RegisterRoutes } from "./routes/routes.js";     // TSOA generated
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
// ... cors, helmet, etc.

RegisterRoutes(app);          // mount tất cả controller routes

app.use(errorMiddleware);     // PHẢI sau RegisterRoutes

export default app;
```

**IoC container** — TSOA cần biết cách khởi tạo controller. Khai báo trong `ioc.ts`:

```ts
// src/ioc.ts
import { IocContainer } from "tsoa";
import { PrismaClient } from "./generated/prisma/client.js";
import { RoleController } from "./controllers/role.controller.js";
import { RoleService } from "./services/role.service.js";

const db = new PrismaClient();

export const iocContainer: IocContainer = {
  get<T>(controller: new (...args: never[]) => T): T {
    switch (controller) {
      case RoleController as never:
        return new RoleController(new RoleService(db)) as T;
      default:
        throw new Error(`Unknown controller: ${controller.name}`);
    }
  },
};
```

**Sau khi thêm controller mới**, luôn phải:
1. Đăng ký trong `ioc.ts`
2. Chạy `npm run tsoa:gen` để regenerate `routes.ts`

---

## 10. Tạo controller mới với generator

```
scripts/generate-controller.ts
```

Script đọc service + schema đã có, generate controller file. **Không** generate service hay schema.

### Prerequisites

Phải tạo trước khi chạy generator:

```
src/services/<entity>.service.ts   — export <Entity>Service class
src/dtos/<entity>.schema.ts        — export Create<Entity>Dto + Update<Entity>Dto
```

### Usage

```bash
tsx scripts/generate-controller.ts <EntityName> [flags]
```

### Flags

| Flag | Tác dụng |
|------|----------|
| `--queryable` | `findAll` với full query params (`page`, `per_page`, `q`, `sort`, `direction`), import từ `queryable.js` |
| `--paginate` | `findAll` với `page` + `limit` đơn giản, import từ `types/pagination.js` |
| `--no-delete` | Bỏ DELETE endpoint |
| `--readonly` | GET only — không cần schema file |
| `--auth` | Thêm `@Security("jwt")` ở class level |
| `--force` | Overwrite nếu controller đã tồn tại |

**`--queryable` vs `--paginate`:**
- Dùng `--queryable` nếu service đã có `createQueryable` — cho phép client filter/search/sort
- Dùng `--paginate` nếu chỉ cần page/limit đơn giản
- Hai flag không dùng cùng nhau — `--queryable` takes precedence

### Ví dụ

```bash
# Entity đơn giản, có queryable
tsx scripts/generate-controller.ts Role --queryable

# Readonly, có auth
tsx scripts/generate-controller.ts Permission --readonly --auth

# Không có soft delete
tsx scripts/generate-controller.ts Tag --queryable --no-delete

# Overwrite controller đã có
tsx scripts/generate-controller.ts Role --queryable --force
```

### Generator tự validate

Trước khi generate, script kiểm tra:
- Service file tồn tại
- `<Entity>Service` class được export
- Schema file tồn tại (trừ `--readonly`)
- `Create<Entity>Dto` + `Update<Entity>Dto` được export (warn nếu thiếu)

Nếu thiếu `Safe<Entity>` type, generator tự detect và dùng raw Prisma type thay thế — không cần khai báo alias thừa khi entity không có field nhạy cảm.

### Sau khi generate

```bash
# 1. Đăng ký controller trong ioc.ts
# 2. Regenerate TSOA routes
npm run tsoa:gen

# 3. Kiểm tra compile
npx tsc --noEmit
```

---

## 11. Checklist khi thêm một entity mới

```
□ 1. Thêm model vào schema.prisma
□ 2. chạy prisma migrate dev
□ 3. Tạo src/dtos/<entity>.schema.ts — Zod schema + inferred types
□ 4. Tạo src/services/<entity>.service.ts — inject PrismaClient, add queryable nếu cần
□ 5. Chạy generator:
       tsx scripts/generate-controller.ts <Entity> --queryable [--auth] [--no-delete]
□ 6. Đăng ký trong src/ioc.ts
□ 7. npm run tsoa:gen
□ 8. npx tsc --noEmit — đảm bảo không compile error
□ 9. Gắn validate middleware vào POST/PATCH route nếu cần (ngoài TSOA pipeline)
```

---

## Luồng request đầy đủ — ví dụ `GET /roles?q=admin&page=1`

```
1. Express nhận request
2. cors/helmet/json parser chạy
3. TSOA router match route → gọi RoleController.findAll()
4. TSOA inject RoleController qua ioc.ts → new RoleController(new RoleService(db))
5. Controller extract @Query params: { q: "admin", page: 1, per_page: 20 }
6. Gọi service.findAll({ q: "admin", page: 1, per_page: 20 })
7. Service pass vào this.query(req) — createQueryable
8. QueryBuilder:
   - applySimpleFilter: is_active không có trong req → skip (nhưng beforeBuild sẽ add)
   - applySearch: thêm OR [{ name: { contains: "admin" } }, { description: { contains: "admin" } }]
   - applySort: dùng defaultSort { id: "asc" }
   - applyPagination: skip=0, take=20
   - build() → beforeBuild push { is_active: true }
9. Prisma chạy findMany + count parallel
10. Trả PaginatedResult<Role> về controller
11. Controller wrap qua makeResponse() → ApiResponseShape<PaginatedResult<Role>>
12. TSOA serialize JSON, trả 200
```

```
Nếu bước 6 throw AppError("NOT_FOUND"):
→ asyncHandler catch → next(err)
→ errorMiddleware nhận err
→ err instanceof AppError → true
→ err.code = "NOT_FOUND" → isAuthError = true
→ res.status(403).json({ status: false, code: "FORBIDDEN", message: "Access denied", requestId })
```
