import "dotenv/config";
import "express-async-errors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import prisma from "./libs/prisma.js";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes.js";
import swaggerOutput from "./generated/swagger.json" with { type: "json" };
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerOutput));
const router = express.Router();
RegisterRoutes(router);
app.use("/api/v1/", router);
import { ValidateError } from "tsoa";
app.use((err, req, res, next) => {
    if (err instanceof ValidateError) {
        return res.status(422).json({ message: "Validation failed", details: err.fields });
    }
    if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
    }
    next(err);
});
const PORT = process.env.PORT ?? 3000;
async function bootstrap() {
    await prisma.$connect();
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