export const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);
//# sourceMappingURL=async.handler.js.map