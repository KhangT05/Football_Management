// src/libs/ioc.ts
import { UserController } from "../controllers/user.controller.js";
import { UserService } from "../services/user.service.js";
import prisma from "./prisma.js";
// Map controller → factory function
const controllerFactory = new Map([
    [UserController, () => new UserController(new UserService(prisma))],
]);
export const iocContainer = {
    get(controller) {
        const factory = controllerFactory.get(controller);
        if (!factory)
            throw new Error(`No factory for ${controller.name}`);
        return factory();
    },
};
//# sourceMappingURL=ioc.js.map