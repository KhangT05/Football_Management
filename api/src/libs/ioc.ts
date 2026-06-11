// src/libs/ioc.ts
import { RoleController } from "../controllers/role.controller.js";
import { UserController } from "../controllers/user.controller.js";
import { RoleService } from "../services/role.service.js";
import { UserService } from "../services/user.service.js";
import prisma from "./prisma.js";

// Map controller → factory function
const controllerFactory = new Map<Function, () => unknown>([
    [UserController, () => new UserController(new UserService(prisma))],
    [RoleController, () => new RoleController(new RoleService(prisma))],
]);

export const iocContainer = {
    get<T>(controller: new (...args: unknown[]) => T): T {
        const factory = controllerFactory.get(controller);
        if (!factory) throw new Error(`No factory for ${controller.name}`);
        return factory() as T;
    },
};