import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema, source: "body" | "params" | "query" = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            res.status(400).json({ errors: result.error.flatten().fieldErrors });
            return;
        }
        req[source] = result.data;
        next();
    };