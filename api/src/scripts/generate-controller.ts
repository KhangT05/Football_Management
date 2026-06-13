#!/usr/bin/env tsx
/**
 * TSOA Controller Generator
 * Reads existing service + schema, generates controller only.
 *
 * Usage: tsx scripts/generate-controller.ts <EntityName> [flags]
 *
 * Core flags:
 *   --no-delete          Omit DELETE endpoint
 *   --readonly           GET only
 *   --auth               Add @Security("jwt")
 *   --paginate           findAll with @Query page/limit
 *   --queryable          findAll with full query params (overrides --paginate)
 *   --force              Overwrite existing controller
 *   --relation-service   N-N methods use RelationService (batch array body + sync)
 *                        instead of single-relatedId path params
 *
 * Relation flags:
 *   --relations "<spec>"
 *
 *   Spec format (comma-separated):
 *     <field>:<RelatedEntity>:n-n            → implicit (Prisma connect/disconnect)
 *     <field>:<RelatedEntity>:n-n:explicit   → explicit junction entity with extra fields
 *
 *   Examples:
 *     --relations "roles:Role:n-n"
 *     --relations "teams:Team:n-n,tags:Tag:n-n:explicit"
 *
 * Prerequisites (must exist before running):
 *   src/services/<entity>.service.ts   — must export <Entity>Service + Safe<Entity>
 *   src/dtos/<entity>.schema.ts        — must export Create<Entity>Dto + Update<Entity>Dto
 *
 * For explicit N-N, you also need:
 *   src/dtos/<entity>.schema.ts        — must export <Entity><Related>Dto
 *
 * For --relation-service implicit N-N, you also need:
 *   src/dtos/<entity>.schema.ts        — must export <Related>IdsDto per relation
 *   e.g. RoleIdsDto for roles:Role:n-n
 */

import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { resolve, dirname } from "path";

// ─── Config ───────────────────────────────────────────────────────────────────

const CONTROLLERS_DIR = resolve("src/controllers");
const DTOS_DIR = resolve("src/dtos");
const SERVICES_DIR = resolve("src/services");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const IRREGULARS: Record<string, string> = {
  match: "matches",
  category: "categories",
  penalty: "penalties",
  proxy: "proxies",
  trophy: "trophies",
  bench: "benches",
  coach: "coaches",
  index: "indices",
  status: "statuses",
};

function pluralize(word: string): string {
  const lower = word.toLowerCase();
  if (IRREGULARS[lower]) return IRREGULARS[lower];
  if (lower.endsWith("s") || lower.endsWith("x") || lower.endsWith("z")) return lower + "es";
  if (lower.endsWith("sh") || lower.endsWith("ch")) return lower + "es";
  if (lower.endsWith("y") && !/[aeiou]y$/.test(lower)) return lower.slice(0, -1) + "ies";
  return lower + "s";
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** "roles" → "role" (naive singular: strip trailing s) */
function singularize(field: string): string {
  return field.endsWith("s") ? field.slice(0, -1) : field;
}

// ─── Relation types ───────────────────────────────────────────────────────────

type RelationDef = {
  field: string;  // e.g. "roles"
  entity: string;  // e.g. "Role"
  explicit: boolean; // true = junction table has extra fields
};

function parseRelations(raw: string): RelationDef[] {
  return raw.split(",").map((part) => {
    const segments = part.trim().split(":");
    if (segments.length < 3) {
      console.error(`  ERROR  Invalid relation spec: "${part}" — expected <field>:<Entity>:n-n[:explicit]`);
      process.exit(1);
    }
    const [field, entity, type, modifier] = segments as [string, string, string, string];
    if (type !== "n-n") {
      console.error(`  ERROR  Only n-n relations supported, got: "${type}" in "${part}"`);
      process.exit(1);
    }
    return {
      field: field.trim(),
      entity: capitalize(entity.trim()),
      explicit: modifier?.trim() === "explicit",
    };
  });
}

// ─── Args ─────────────────────────────────────────────────────────────────────

const [, , entityNameArg, ...flags] = process.argv;

if (!entityNameArg) {
  console.error(
    "Usage: tsx scripts/generate-controller.ts <EntityName> " +
    "[--no-delete] [--readonly] [--auth] [--paginate] [--queryable] [--force] " +
    "[--relation-service] " +
    '[--relations "<field>:<Entity>:n-n[:explicit],..."]'
  );
  process.exit(1);
}

const entityName = capitalize(entityNameArg);
const noDelete = flags.includes("--no-delete");
const readonly = flags.includes("--readonly");
const auth = flags.includes("--auth");
const force = flags.includes("--force");
const queryable = flags.includes("--queryable");
const paginate = !queryable && flags.includes("--paginate");
const useRelationService = flags.includes("--relation-service");

const relationsIdx = flags.findIndex((f) => f === "--relations");
const relationsArg = relationsIdx !== -1 ? flags[relationsIdx + 1] : undefined;
const relations: RelationDef[] = relationsArg ? parseRelations(relationsArg) : [];

const entityLower = entityName.toLowerCase();
const routePath = pluralize(entityLower);

// ─── Validate prerequisites ───────────────────────────────────────────────────

const servicePath = resolve(SERVICES_DIR, `${entityLower}.service.ts`);
const schemaPath = resolve(DTOS_DIR, `${entityLower}.schema.ts`);

if (!existsSync(servicePath)) {
  console.error(`\n  ERROR  Service not found: ${servicePath}`);
  console.error(`         Create it first, then run generator.\n`);
  process.exit(1);
}

if (!readonly && !existsSync(schemaPath)) {
  console.error(`\n  ERROR  DTO schema not found: ${schemaPath}`);
  console.error(`         Create it first, or use --readonly flag.\n`);
  process.exit(1);
}

// ─── Validate exports ─────────────────────────────────────────────────────────

function checkExport(filePath: string, exportName: string): boolean {
  const content = readFileSync(filePath, "utf8");
  return content.includes("export") && content.includes(exportName);
}

const hasSafeType = checkExport(servicePath, `Safe${entityName}`);
const usesRawPrismaType = checkExport(servicePath, `} from "@prisma/client"`);

if (!hasSafeType && !usesRawPrismaType) {
  console.warn(`  WARN   No Safe${entityName} or Prisma type found in ${servicePath}`);
}
if (!hasSafeType) {
  console.warn(`  WARN   Safe${entityName} not found in ${servicePath} — make sure it's exported`);
}
if (!checkExport(servicePath, `${entityName}Service`)) {
  console.error(`\n  ERROR  ${entityName}Service class not found in ${servicePath}\n`);
  process.exit(1);
}

if (!readonly) {
  if (!checkExport(schemaPath, `Create${entityName}Dto`))
    console.warn(`  WARN   Create${entityName}Dto not found in ${schemaPath}`);
  if (!checkExport(schemaPath, `Update${entityName}Dto`))
    console.warn(`  WARN   Update${entityName}Dto not found in ${schemaPath}`);
}

for (const rel of relations) {
  if (rel.explicit) {
    const junctionDto = `${entityName}${rel.entity}Dto`;
    if (!checkExport(schemaPath, junctionDto))
      console.warn(`  WARN   ${junctionDto} not found in ${schemaPath} — needed for explicit N-N on "${rel.field}"`);
    const safeJunction = `Safe${entityName}${rel.entity}`;
    if (!checkExport(servicePath, safeJunction))
      console.warn(`  WARN   ${safeJunction} not found in ${servicePath} — needed as return type for explicit N-N`);
  }
  if (!rel.explicit && useRelationService) {
    const idsDto = `${capitalize(rel.entity)}IdsDto`;
    if (!checkExport(schemaPath, idsDto))
      console.warn(`  WARN   ${idsDto} not found in ${schemaPath} — needed for --relation-service on "${rel.field}"`);
  }
}

// ─── Template builders ────────────────────────────────────────────────────────

const returnType = hasSafeType ? `Safe${entityName}` : entityName;

/**
 * Implicit N-N — two modes:
 *
 * Default (single relatedId in path):
 *   POST/DELETE /{id}/{relPlural}/{relatedId}
 *
 * --relation-service (batch array body + PUT sync):
 *   POST/DELETE /{id}/{relPlural}  body: { role_ids: number[] }
 *   PUT         /{id}/{relPlural}  body: { role_ids: number[] }  ← replace set
 */
function implicitRelationMethods(rel: RelationDef): string {
  const field = rel.field;
  const related = rel.entity;
  const relPath = pluralize(field);
  const capField = capitalize(field);
  const idsDto = `${related}IdsDto`;
  const idField = `${singularize(field)}_ids`;

  if (useRelationService) {
    return `
  // ── ${related} (implicit N-N via RelationService) ────────────────────────

  @Get("{id}/${relPath}")
  async get${capField}(@Path() id: number): Promise<Safe${related}[]> {
    return this.service.get${capField}(id);
  }

  @Post("{id}/${relPath}")
  @SuccessResponse(204, "Attached")
  async attach${related}(
    @Path() id: number,
    @Body() body: ${idsDto}
  ): Promise<void> {
    this.setStatus(204);
    return this.service.attach${related}(id, body.${idField});
  }

  @Delete("{id}/${relPath}")
  @SuccessResponse(204, "Detached")
  async detach${related}(
    @Path() id: number,
    @Body() body: ${idsDto}
  ): Promise<void> {
    this.setStatus(204);
    return this.service.detach${related}(id, body.${idField});
  }

  @Put("{id}/${relPath}")
  @SuccessResponse(204, "Synced")
  async sync${related}(
    @Path() id: number,
    @Body() body: ${idsDto}
  ): Promise<void> {
    this.setStatus(204);
    return this.service.sync${related}(id, body.${idField});
  }`;
  }

  // Default: single relatedId path param
  return `
  // ── ${related} (implicit N-N) ─────────────────────────────────────────────

  @Get("{id}/${relPath}")
  async get${capField}(@Path() id: number): Promise<Safe${related}[]> {
    return this.service.get${capField}(id);
  }

  @Post("{id}/${relPath}/{relatedId}")
  @SuccessResponse(204, "Attached")
  async attach${related}(
    @Path() id: number,
    @Path() relatedId: number
  ): Promise<void> {
    this.setStatus(204);
    return this.service.attach${related}(id, relatedId);
  }

  @Delete("{id}/${relPath}/{relatedId}")
  @SuccessResponse(204, "Detached")
  async detach${related}(
    @Path() id: number,
    @Path() relatedId: number
  ): Promise<void> {
    this.setStatus(204);
    return this.service.detach${related}(id, relatedId);
  }`;
}

/**
 * Explicit N-N — junction table is a first-class Prisma model with extra fields.
 * Not affected by --relation-service (junction records need individual PATCH).
 */
function explicitRelationMethods(rel: RelationDef): string {
  const field = rel.field;
  const related = rel.entity;
  const relPath = pluralize(field);
  const capField = capitalize(field);
  const junctionDto = `${entityName}${related}Dto`;
  const safeJunction = `Safe${entityName}${related}`;

  return `
  // ── ${related} (explicit N-N junction) ───────────────────────────────────

  @Get("{id}/${relPath}")
  async get${capField}(@Path() id: number): Promise<${safeJunction}[]> {
    return this.service.get${capField}(id);
  }

  @Post("{id}/${relPath}/{relatedId}")
  @SuccessResponse(201, "Junction created")
  async add${related}(
    @Path() id: number,
    @Path() relatedId: number,
    @Body() body: ${junctionDto}
  ): Promise<${safeJunction}> {
    this.setStatus(201);
    return this.service.add${related}(id, relatedId, body);
  }

  @Patch("{id}/${relPath}/{relatedId}")
  async update${related}Junction(
    @Path() id: number,
    @Path() relatedId: number,
    @Body() body: Partial<${junctionDto}>
  ): Promise<${safeJunction}> {
    return this.service.update${related}Junction(id, relatedId, body);
  }

  @Delete("{id}/${relPath}/{relatedId}")
  @SuccessResponse(204, "Junction removed")
  async remove${related}(
    @Path() id: number,
    @Path() relatedId: number
  ): Promise<void> {
    this.setStatus(204);
    return this.service.remove${related}(id, relatedId);
  }`;
}

// ─── Controller template ──────────────────────────────────────────────────────

function controllerTemplate(): string {
  const tsoaImports = ["Controller", "Get", "Path", "Tags", "Route"];
  if (!readonly) tsoaImports.push("Post", "Patch", "Body", "SuccessResponse");
  if (!readonly && !noDelete) tsoaImports.push("Delete");
  if (queryable || paginate) tsoaImports.push("Query");
  if (auth) tsoaImports.push("Security");

  const hasImplicitRelations = relations.some((r) => !r.explicit);
  const hasExplicitRelations = relations.some((r) => r.explicit);
  const hasAnyRelation = relations.length > 0;

  if (hasAnyRelation && !tsoaImports.includes("Delete")) tsoaImports.push("Delete");
  if (hasExplicitRelations && !tsoaImports.includes("SuccessResponse")) tsoaImports.push("SuccessResponse");
  if (useRelationService && hasImplicitRelations && !tsoaImports.includes("Put")) tsoaImports.push("Put");

  // ── Imports ──

  const serviceImport = hasSafeType
    ? `import { ${entityName}Service, type Safe${entityName} } from "../services/${entityLower}.service.js";`
    : `import { ${entityName}Service } from "../services/${entityLower}.service.js";`;

  const prismaImport = !hasSafeType
    ? `import type { ${entityName} } from "../generated/prisma/client.js";`
    : null;

  const extraSafeTypes: string[] = [];
  for (const rel of relations) {
    extraSafeTypes.push(rel.explicit ? `Safe${entityName}${rel.entity}` : `Safe${rel.entity}`);
  }

  const lines: string[] = [
    `import { ${tsoaImports.join(", ")} } from "tsoa";`,
    serviceImport,
  ];

  if (prismaImport) lines.push(prismaImport);

  if (extraSafeTypes.length > 0) {
    lines.push(`// TODO: verify these types are exported from the correct service/model files`);
    for (const t of extraSafeTypes) lines.push(`// import { type ${t} } from "...";`);
  }

  if (!readonly) {
    const dtoNames = [`type Create${entityName}Dto`, `type Update${entityName}Dto`];
    for (const rel of relations) {
      if (rel.explicit) dtoNames.push(`type ${entityName}${rel.entity}Dto`);
      if (!rel.explicit && useRelationService) dtoNames.push(`type ${capitalize(rel.entity)}IdsDto`);
    }
    lines.push(`import { ${dtoNames.join(", ")} } from "../dtos/${entityLower}.schema.js";`);
  }

  if (queryable) {
    lines.push(`import { PaginatedResult, QueryRequest } from "../libs/queryable.js";`);
  } else if (paginate) {
    lines.push(`import { PaginatedResult } from "../types/pagination.js";`);
  }

  lines.push(``);

  // ── Class ──

  if (auth) lines.push(`@Security("jwt")`);
  lines.push(`@Route("${routePath}")`);
  lines.push(`@Tags("${entityName}s")`);
  lines.push(`export class ${entityName}Controller extends Controller {`);
  lines.push(`  constructor(private service: ${entityName}Service) {`);
  lines.push(`    super();`);
  lines.push(`  }`);

  // findAll
  if (queryable) {
    lines.push(`
  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<${returnType}>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }`);
  } else if (paginate) {
    lines.push(`
  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() limit = 20
  ): Promise<PaginatedResult<${returnType}>> {
    return this.service.findAll({ page, limit });
  }`);
  } else {
    lines.push(`
  @Get("/")
  async findAll(): Promise<${returnType}[]> {
    return this.service.findAll();
  }`);
  }

  lines.push(`
  @Get("{id}")
  async findById(@Path() id: number): Promise<${returnType}> {
    return this.service.findByIdOrFail(id);
  }`);

  if (!readonly) {
    lines.push(`
  @Post("/")
  @SuccessResponse(201, "Created")
  async create(@Body() body: Create${entityName}Dto): Promise<${returnType}> {
    this.setStatus(201);
    return this.service.create(body);
  }`);

    lines.push(`
  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: Update${entityName}Dto
  ): Promise<${returnType}> {
    return this.service.update(id, body);
  }`);
  }

  if (!readonly && !noDelete) {
    lines.push(`
  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }`);
  }

  for (const rel of relations) {
    lines.push(rel.explicit ? explicitRelationMethods(rel) : implicitRelationMethods(rel));
  }

  lines.push(`}\n`);
  return lines.join("\n");
}

// ─── Service stub generator ───────────────────────────────────────────────────

function printServiceStubs(): void {
  if (relations.length === 0) return;

  console.log(`\n── Service stubs to implement in ${entityLower}.service.ts ──\n`);

  for (const rel of relations) {
    const field = rel.field;
    const related = rel.entity;
    const capField = capitalize(field);

    if (!rel.explicit) {
      if (useRelationService) {
        const idField = `${singularize(field)}_ids`;
        const relSvc = `${field}RelationService`;

        console.log(`  // Implicit N-N: ${related} via RelationService`);
        console.log(`  // Add to constructor:`);
        console.log(`  //   private readonly ${relSvc} = new RelationService({`);
        console.log(`  //     table: "${entityLower}_${related.toLowerCase()}",`);
        console.log(`  //     ownerKey: "${entityLower}_id",`);
        console.log(`  //     targetKey: "${related.toLowerCase()}_id",`);
        console.log(`  //     validateOwner: async (id, db) => { /* assertExists */ },`);
        console.log(`  //     validateTargets: async (ids, db) => { /* assertValid */ },`);
        console.log(`  //   });`);
        console.log(``);
        console.log(`  async get${capField}(id: number): Promise<Safe${related}[]> {`);
        console.log(`    const result = await this.prisma.${entityLower}.findUniqueOrThrow({`);
        console.log(`      where: { id }, select: { ${field}: true },`);
        console.log(`    });`);
        console.log(`    return result.${field};`);
        console.log(`  }`);
        console.log(``);
        console.log(`  async attach${related}(id: number, ${idField}: number[]): Promise<void> {`);
        console.log(`    await this.${relSvc}.attach(id, ${idField}, this.prisma);`);
        console.log(`  }`);
        console.log(``);
        console.log(`  async detach${related}(id: number, ${idField}: number[]): Promise<void> {`);
        console.log(`    await this.${relSvc}.detach(id, ${idField}, this.prisma);`);
        console.log(`  }`);
        console.log(``);
        console.log(`  async sync${related}(id: number, ${idField}: number[]): Promise<void> {`);
        console.log(`    await this.prisma.$transaction((tx) =>`);
        console.log(`      this.${relSvc}.sync(id, ${idField}, tx)`);
        console.log(`    );`);
        console.log(`  }`);
      } else {
        console.log(`  // Implicit N-N: ${related}`);
        console.log(`  async get${capField}(id: number): Promise<Safe${related}[]> {`);
        console.log(`    const result = await this.prisma.${entityLower}.findUniqueOrThrow({`);
        console.log(`      where: { id }, select: { ${field}: true },`);
        console.log(`    });`);
        console.log(`    return result.${field};`);
        console.log(`  }`);
        console.log(``);
        console.log(`  async attach${related}(id: number, relatedId: number): Promise<void> {`);
        console.log(`    await this.prisma.${entityLower}.update({`);
        console.log(`      where: { id },`);
        console.log(`      data: { ${field}: { connect: { id: relatedId } } },`);
        console.log(`    });`);
        console.log(`  }`);
        console.log(``);
        console.log(`  async detach${related}(id: number, relatedId: number): Promise<void> {`);
        console.log(`    await this.prisma.${entityLower}.update({`);
        console.log(`      where: { id },`);
        console.log(`      data: { ${field}: { disconnect: { id: relatedId } } },`);
        console.log(`    });`);
        console.log(`  }`);
      }
    } else {
      const junctionModel = `${entityName}${related}`;
      const junctionLower = `${entityLower}${related.toLowerCase()}`;
      const fkThis = `${entityLower}Id`;
      const fkRelated = `${related.toLowerCase()}Id`;

      console.log(`  // Explicit N-N: ${related} via ${junctionModel}`);
      console.log(`  async get${capField}(id: number): Promise<Safe${junctionModel}[]> {`);
      console.log(`    return this.prisma.${junctionLower}.findMany({ where: { ${fkThis}: id } });`);
      console.log(`  }`);
      console.log(``);
      console.log(`  async add${related}(`);
      console.log(`    id: number, relatedId: number, body: ${junctionModel}Dto`);
      console.log(`  ): Promise<Safe${junctionModel}> {`);
      console.log(`    return this.prisma.${junctionLower}.create({`);
      console.log(`      data: { ${fkThis}: id, ${fkRelated}: relatedId, ...body },`);
      console.log(`    });`);
      console.log(`  }`);
      console.log(``);
      console.log(`  async update${related}Junction(`);
      console.log(`    id: number, relatedId: number, body: Partial<${junctionModel}Dto>`);
      console.log(`  ): Promise<Safe${junctionModel}> {`);
      console.log(`    return this.prisma.${junctionLower}.update({`);
      console.log(`      where: { ${fkThis}_${fkRelated}: { ${fkThis}: id, ${fkRelated}: relatedId } },`);
      console.log(`      data: body,`);
      console.log(`    });`);
      console.log(`  }`);
      console.log(``);
      console.log(`  async remove${related}(id: number, relatedId: number): Promise<void> {`);
      console.log(`    await this.prisma.${junctionLower}.delete({`);
      console.log(`      where: { ${fkThis}_${fkRelated}: { ${fkThis}: id, ${fkRelated}: relatedId } },`);
      console.log(`    });`);
      console.log(`  }`);
    }

    console.log(``);
  }
}

// ─── Write helper ─────────────────────────────────────────────────────────────

function writeFile(filePath: string, content: string, label: string) {
  const alreadyExists = existsSync(filePath);
  if (alreadyExists && !force) {
    console.warn(`  SKIP   ${label} already exists (use --force to overwrite): ${filePath}`);
    return;
  }
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
  console.log(`  ${alreadyExists ? "OVERWRITE" : "CREATE"}  ${label}: ${filePath}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log(`\nGenerating controller for: ${entityName}`);
console.log(`  Route     : /${routePath}`);
console.log(`  Service   : ${servicePath}`);
if (!readonly) console.log(`  Schema    : ${schemaPath}`);
console.log(
  `  Flags     : readonly=${readonly}, noDelete=${noDelete}, auth=${auth}, ` +
  `paginate=${paginate}, queryable=${queryable}, force=${force}, relationService=${useRelationService}`
);
if (relations.length > 0) {
  console.log(`  Relations :`);
  for (const r of relations) {
    console.log(`    - ${r.field} → ${r.entity} [${r.explicit ? "explicit junction" : "implicit"}]`);
  }
}
console.log(``);

writeFile(
  resolve(CONTROLLERS_DIR, `${entityLower}.controller.ts`),
  controllerTemplate(),
  "Controller"
);

printServiceStubs();

console.log(`Next steps:`);
console.log(`  1. Copy service stubs above into ${entityLower}.service.ts`);
console.log(`  2. Register ${entityName}Controller in ioc.ts`);
console.log(`  3. npm run tsoa:gen`);
if (relations.some((r) => r.explicit)) {
  console.log(`  4. Verify Prisma @@id([${entityLower}Id, relatedId]) on junction model`);
  console.log(`     and compound unique key name matches update/delete where clause`);
}
if (useRelationService) {
  console.log(`  5. Verify RelationService config: table name, ownerKey, targetKey`);
  console.log(`     validateOwner / validateTargets throw AppException, not raw Error`);
}
console.log(``);