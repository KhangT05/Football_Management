import "dotenv/config";
import "express-async-errors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const app = express();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const db = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});

app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Football Management API",
            version: "1.0.0",
            description: "API documentation",
        },
        servers: [
            { url: process.env.API_BASE_URL ?? "http://localhost:3000" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/**/*.ts", "./src/docs/**/*.yaml"],
};

if (process.env.NODE_ENV !== "production" || process.env.SWAGGER_ENABLED === "true") {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(options));
    app.get("/docs.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(options);
    });
}
const PORT = process.env.PORT ?? 3000;

async function bootstrap() {

    await db.$connect();

    app.listen(PORT, () => {
        console.log(`[App] port ${PORT} (${process.env.NODE_ENV})`);
    });
}

bootstrap().catch((err) => {
    console.error("[db] Failed to connect:", err);
    process.exit(1);
});

process.on("SIGINT", async () => { await db.$disconnect(); process.exit(0); });
process.on("SIGTERM", async () => { await db.$disconnect(); process.exit(0); });
