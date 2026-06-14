import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({
    adapter,
    // log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});
export default prisma;
//# sourceMappingURL=prisma.js.map