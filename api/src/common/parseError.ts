import { ZodError } from "zod";

export function formatZodError(err: ZodError): Record<string, string> {
    return Object.fromEntries(
        err.issues.map((e) => [e.path.join("."), e.message])
    );
}