import { Router } from "express";
import { UserService } from "../services/user.service.js";
import prisma from "../libs/prisma.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "../dtos/user.schema.js";
import { UserController } from "../controllers/user.controller.js";
const userRouter = Router();
const ctrl = new UserController(new UserService(prisma));
userRouter.get("/", ctrl.findAll);
userRouter.get("/:id", ctrl.findById);
userRouter.post("/", validate(createUserSchema), ctrl.create);
userRouter.patch("/:id", validate(updateUserSchema), ctrl.update);
userRouter.delete("/:id", ctrl.softDelete);
export default userRouter;
//# sourceMappingURL=user.js.map