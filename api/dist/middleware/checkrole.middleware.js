// import { Request, Response, NextFunction } from "express";
// import { createAppError } from "../common/app.error.js";
export {};
// /**
//  * Role string thuần — không enum. Tạo role mới ở DB, gán cho user,
//  * gọi requireRoles("ten_role_moi") là check được ngay, không cần sửa code.
//  * "admin" luôn bypass.
//  */
// export function requireRoles(...roles: string[]) {
//     return (req: Request, _res: Response, next: NextFunction): void => {
//         console.log(req);
//         if (!req.user) {
//             next(createAppError("UNAUTHORIZED", "Not authenticated"));
//             return;
//         }
//         if (req.user.roles.includes("admin")) {
//             next();
//             return;
//         }
//         const hasRole = roles.some((r) => req.user.roles.includes(r));
//         if (!hasRole) {
//             next(createAppError("FORBIDDEN", "Insufficient permissions"));
//             return;
//         }
//         next();
//     };
// }
//# sourceMappingURL=checkrole.middleware.js.map