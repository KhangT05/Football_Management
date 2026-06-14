import { seedRoles } from "./roleSeeder.js";
import { seedUsers } from "./userSeeder.js";
import { seedVenues } from "./venueSeeder.js";
export async function runSeeders(db) {
    console.log("[DataSeeder] starting...\n");
    // Roles phải có trước — users FK vào roles
    // roleMap trả về ngay sau seed, tránh query lại
    const roleMap = await seedRoles(db);
    await seedUsers(db, roleMap);
    await seedVenues(db);
    console.log("\n[DataSeeder] done.");
}
//# sourceMappingURL=index.js.map