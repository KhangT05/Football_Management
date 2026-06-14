import "dotenv/config";
import "express-async-errors";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import prisma from "./libs/prisma.js";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes.js";
import swaggerOutput from "./generated/swagger.json" with { type: "json" };
import { errorMiddleware } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { connectRedis } from "./libs/redis.js";
import { runSeeders } from "./seeders/index.js";
const app = express();
app.use(cors({
    origin: process.env.APP_ORIGIN ?? "http://localhost:3000",
    credentials: true
}));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerOutput));
const router = express.Router();
RegisterRoutes(router);
app.use("/api/v1/", router);
app.use(errorMiddleware);
const PORT = process.env.PORT ?? 3000;
async function bootstrap() {
    await connectRedis();
    await prisma.$connect();
    await runSeeders(prisma);
    app.listen(PORT, () => {
        console.log(`[App]  localhost:${PORT} (${process.env.NODE_ENV})`);
    });
}
bootstrap().catch((err) => {
    console.error("[prisma] Failed to connect:", err);
    process.exit(1);
});
process.on("SIGINT", async () => { await prisma.$disconnect(); process.exit(0); });
process.on("SIGTERM", async () => { await prisma.$disconnect(); process.exit(0); });
//# sourceMappingURL=app.js.map