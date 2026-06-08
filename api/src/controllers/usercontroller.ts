// import { Request, Response, NextFunction } from "express";
// import { BaseController } from "./basecontroller.js";
import { Prisma } from "../generated/prisma/browser.js";
// import { Prisma } from "../generated/prisma/client.js";
// export class UserController extends BaseController<
//     User,
//     Prisma.UserCreateInput,
//     Prisma.UserUpdateInput
// > {
//     constructor(private readonly UserService: UserService) {
//         super(UserService);
//     }

//     findBySeason = async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             this.ok(res, await this.UserService.findBySeasonId(Number(req.params.seasonId)));
//         } catch (err) { next(err); }
//     };
// }