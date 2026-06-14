import { AuthController } from "../controllers/auth.controller.js";
import { RoleController } from "../controllers/role.controller.js";
import { TournamentController } from "../controllers/tournament.controller.js";
import { UserController } from "../controllers/user.controller.js";
import { VenueController } from "../controllers/venue.controller.js";
import { AuthService } from "../services/auth.service.js";
import { RoleService } from "../services/role.service.js";
import { TournamentService } from "../services/tournament.service.js";
import { UserService } from "../services/user.service.js";
import { VenueService } from "../services/venue.service.js";
import prisma from "./prisma.js";
// Map controller → factory function
const controllerFactory = new Map([
    [UserController, () => new UserController(new UserService(prisma))],
    [RoleController, () => new RoleController(new RoleService(prisma))],
    [AuthController, () => new AuthController(new AuthService(prisma))],
    [VenueController, () => new VenueController(new VenueService(prisma))],
    [TournamentController, () => new TournamentController(new TournamentService(prisma))],
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