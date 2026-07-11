import { PrismaClient } from "../generated/prisma/client.js";
export declare const ROLE_NAMES: readonly ["admin", "leader", "player", "referee", "user", "organizing"];
export type RoleName = (typeof ROLE_NAMES)[number];
export declare function seedRoles(db: PrismaClient): Promise<Record<RoleName, number>>;
//# sourceMappingURL=roleSeeder.d.ts.map