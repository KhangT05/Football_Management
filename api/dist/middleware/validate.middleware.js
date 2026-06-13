export const validate = (schema, source = "body") => (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        res.status(400).json({ errors: result.error.flatten().fieldErrors });
        return;
    }
    req[source] = result.data;
    next();
};
//# sourceMappingURL=validate.middleware.js.map