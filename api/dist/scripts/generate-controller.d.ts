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
export {};
//# sourceMappingURL=generate-controller.d.ts.map