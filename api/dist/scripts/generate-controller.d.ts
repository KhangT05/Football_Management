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
export {};
//# sourceMappingURL=generate-controller.d.ts.map