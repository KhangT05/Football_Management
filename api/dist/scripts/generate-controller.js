#!/usr/bin/env tsx
/**
 * TSOA Controller Generator
 * Reads existing service + schema, generates controller only.
 *
 * Usage: tsx scripts/generate-controller.ts <EntityName> [flags]
 *
 * Flags:
 *   --no-delete   Omit DELETE endpoint
 *   --readonly    GET only
 *   --auth        Add @Security("jwt")
 *   --paginate    findAll with @Query page/limit
 *   --force       Overwrite existing controller
 *
 * Prerequisites (must exist before running):
 *   src/services/<entity>.service.ts   — must export <Entity>Service + Safe<Entity>
 *   src/dtos/<entity>.schema.ts        — must export Create<Entity>Dto + Update<Entity>Dto
 */
import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
// ─── Config ───────────────────────────────────────────────────────────────────
const CONTROLLERS_DIR = resolve("src/controllers");
const DTOS_DIR = resolve("src/dtos");
const SERVICES_DIR = resolve("src/services");
// ─── Pluralize ────────────────────────────────────────────────────────────────
const IRREGULARS = {
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
function pluralize(word) {
    const lower = word.toLowerCase();
    if (IRREGULARS[lower])
        return IRREGULARS[lower];
    if (lower.endsWith("s") || lower.endsWith("x") || lower.endsWith("z"))
        return lower + "es";
    if (lower.endsWith("sh") || lower.endsWith("ch"))
        return lower + "es";
    if (lower.endsWith("y") && !/[aeiou]y$/.test(lower))
        return lower.slice(0, -1) + "ies";
    return lower + "s";
}
// ─── Args ─────────────────────────────────────────────────────────────────────
const [, , entityNameArg, ...flags] = process.argv;
if (!entityNameArg) {
    console.error("Usage: tsx scripts/generate-controller.ts <EntityName> [--no-delete] [--readonly] [--auth] [--paginate] [--force]");
    process.exit(1);
}
const entityName = entityNameArg.charAt(0).toUpperCase() + entityNameArg.slice(1);
const noDelete = flags.includes("--no-delete");
const readonly = flags.includes("--readonly");
const auth = flags.includes("--auth");
const paginate = flags.includes("--paginate");
const force = flags.includes("--force");
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
// ─── Validate exports in service/schema ──────────────────────────────────────
function checkExport(filePath, exportName) {
    const content = readFileSync(filePath, "utf8");
    return content.includes(`export`) && content.includes(exportName);
}
const serviceContent = readFileSync(servicePath, "utf8");
if (!checkExport(servicePath, `Safe${entityName}`)) {
    console.warn(`  WARN   Safe${entityName} not found in ${servicePath} — make sure it's exported`);
}
if (!checkExport(servicePath, `${entityName}Service`)) {
    console.error(`\n  ERROR  ${entityName}Service class not found in ${servicePath}\n`);
    process.exit(1);
}
if (!readonly) {
    if (!checkExport(schemaPath, `Create${entityName}Dto`)) {
        console.warn(`  WARN   Create${entityName}Dto not found in ${schemaPath}`);
    }
    if (!checkExport(schemaPath, `Update${entityName}Dto`)) {
        console.warn(`  WARN   Update${entityName}Dto not found in ${schemaPath}`);
    }
}
// Detect if service has paginate signature
const hasPaginateInService = serviceContent.includes("PaginationOpts") ||
    serviceContent.includes("page:") ||
    serviceContent.includes("{ page,");
// ─── Controller template ──────────────────────────────────────────────────────
function controllerTemplate() {
    const tsoaImports = ["Controller", "Get", "Path", "Tags", "Route"];
    if (!readonly)
        tsoaImports.push("Post", "Patch", "Body", "SuccessResponse");
    if (!readonly && !noDelete)
        tsoaImports.push("Delete");
    if (paginate)
        tsoaImports.push("Query");
    if (auth)
        tsoaImports.push("Security");
    const lines = [
        `import { ${tsoaImports.join(", ")} } from "tsoa";`,
        `import { ${entityName}Service, type Safe${entityName} } from "../services/${entityLower}.service.js";`,
    ];
    if (!readonly) {
        lines.push(`import { type Create${entityName}Dto, type Update${entityName}Dto } from "../dtos/${entityLower}.schema.js";`);
    }
    if (paginate) {
        lines.push(`import type { PaginatedResult } from "../types/pagination.js";`);
    }
    lines.push(``);
    if (auth)
        lines.push(`@Security("jwt")`);
    lines.push(`@Route("${routePath}")`);
    lines.push(`@Tags("${entityName}s")`);
    lines.push(`export class ${entityName}Controller extends Controller {`);
    lines.push(`  constructor(private service: ${entityName}Service) {`);
    lines.push(`    super();`);
    lines.push(`  }`);
    if (paginate) {
        lines.push(`
  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() limit = 20
  ): Promise<PaginatedResult<Safe${entityName}>> {
    return this.service.findAll({ page, limit });
  }`);
    }
    else {
        lines.push(`
  @Get("/")
  async findAll(): Promise<Safe${entityName}[]> {
    return this.service.findAll();
  }`);
    }
    lines.push(`
  @Get("{id}")
  async findById(@Path() id: number): Promise<Safe${entityName}> {
    return this.service.findByIdOrFail(id);
  }`);
    if (!readonly) {
        lines.push(`
  @Post("/")
  @SuccessResponse(201, "Created")
  async create(@Body() body: Create${entityName}Dto): Promise<Safe${entityName}> {
    this.setStatus(201);
    return this.service.create(body);
  }`);
        lines.push(`
  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: Update${entityName}Dto
  ): Promise<Safe${entityName}> {
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
    lines.push(`}\n`);
    return lines.join("\n");
}
// ─── Write helper ─────────────────────────────────────────────────────────────
function writeFile(filePath, content, label) {
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
console.log(`  Route : /${routePath}`);
console.log(`  Reads : ${servicePath}`);
if (!readonly)
    console.log(`  Reads : ${schemaPath}`);
console.log(`  Flags : readonly=${readonly}, noDelete=${noDelete}, auth=${auth}, paginate=${paginate}, force=${force}\n`);
writeFile(resolve(CONTROLLERS_DIR, `${entityLower}.controller.ts`), controllerTemplate(), "Controller");
console.log(`\nNext steps:`);
console.log(`  1. Register ${entityName}Controller in ioc.ts`);
console.log(`  2. npm run tsoa:gen\n`);
//# sourceMappingURL=generate-controller.js.map