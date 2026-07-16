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
import { MatchReportBinaryController } from "./controllers/matchReportBinary.controller.js";
import { matchResultService } from "./libs/ioc.js";
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
const matchReportBinaryController = new MatchReportBinaryController(matchResultService);
app.get('/api/v1/matches/:id/report', (req, res) => matchReportBinaryController.download(req, res));
RegisterRoutes(router);
app.use("/api/v1/", router);
app.use(errorMiddleware);
const PORT = process.env.PORT ?? 3000;
// Seed KHÔNG được chạy tự động mỗi lần app khởi động — root cause của
// tournaments=3 / groups=15 trong DB là app.ts trước đây gọi seedDatabase()
// vô điều kiện trong bootstrap(), nên mỗi lần nodemon restart (dev) là
// một lần chạy seed đè lên state cũ. Giờ tách hẳn ra: chỉ chạy khi
// RUN_SEED_ON_BOOT=true được set tường minh (vd. lần deploy đầu tiên trên
// môi trường mới), production mặc định KHÔNG bao giờ seed khi boot.
//
// Cách seed data đúng: `npm run seed` (script riêng, xem prisma/seed/index.ts),
// chạy tay khi cần, không gắn vào app lifecycle.
async function bootstrap() {
    await connectRedis();
    await prisma.$connect();
    if (process.env.RUN_SEED_ON_BOOT === "true") {
        console.warn("[Seed] RUN_SEED_ON_BOOT=true — đang chạy seedDatabase() lúc boot. " +
            "Chỉ nên bật cờ này cho lần setup môi trường đầu tiên, KHÔNG bật ở production thường trực.");
    }
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