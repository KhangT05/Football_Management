import { ArticleController } from "../controllers/article.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
import { GroupController } from "../controllers/group.controller.js";
import { JerseyController } from "../controllers/jersey.controller.js";
import { KnockoutController } from "../controllers/knockout.controller.js";
import { MatchController } from "../controllers/match.controller.js";
import { MatchLineupController } from "../controllers/matchlineup.controller.js";
import { MatchResultController } from "../controllers/matchResult.controller.js";
import { PlayerController } from "../controllers/player.controller.js";
import { RoleController } from "../controllers/role.controller.js";
import { ScheduleController } from "../controllers/schedule.controller.js";
import { SeasonController } from "../controllers/season.controller.js";
import { SeasonTeamController } from "../controllers/seasonteam.controller.js";
import { TeamController } from "../controllers/team.controller.js";
import { TournamentController } from "../controllers/tournament.controller.js";
import { TournamentRuleController } from "../controllers/tournamentrule.controller.js";
import { UserController } from "../controllers/user.controller.js";
import { VenueController } from "../controllers/venue.controller.js";
import { WorkflowController } from "../controllers/workflow.controller.js";
import { ArticleService } from "../services/article.service.js";
import { AuthService } from "../services/auth.service.js";
import { GroupService } from "../services/group.service.js";
import { JerseyService } from "../services/jersey.service.js";
import { KnockoutService } from "../services/knockout.service.js";
import { MatchLifecycleService } from "../services/match.service.js";
import { MatchLineupService } from "../services/matchlineup.service.js";
import { MatchResultService } from "../services/matchresult.service.js";
import { PlayerService } from "../services/player.service.js";
import { RoleService } from "../services/role.service.js";
import { ScheduleService } from "../services/schedule.service.js";
import { SeasonService } from "../services/season.service.js";
import { SeasonTeamService } from "../services/seasonTeam.service.js";
import { StandingsService } from "../services/standing.service.js";
import { TeamService } from "../services/team.service.js";
import { TournamentService } from "../services/tournament.service.js";
import { TournamentRuleService } from "../services/tournamentRule.service.js";
import { UserService } from "../services/user.service.js";
import { VenueService } from "../services/venue.service.js";
import { WorkflowService } from "../services/workflow.service.js";
import prisma from "./prisma.js";
const knockoutService = new KnockoutService(prisma);
const standingsService = new StandingsService(prisma);
const matchResultService = new MatchResultService(prisma, knockoutService, standingsService);
const lifecycleService = new MatchLifecycleService(prisma, matchResultService);
const workflowService = new WorkflowService(prisma, knockoutService, lifecycleService, matchResultService, standingsService);
// Map controller → factory function
const controllerFactory = new Map([
    [UserController, () => new UserController(new UserService(prisma))],
    [RoleController, () => new RoleController(new RoleService(prisma))],
    [AuthController, () => new AuthController(new AuthService(prisma))],
    [VenueController, () => new VenueController(new VenueService(prisma))],
    [TournamentController, () => new TournamentController(new TournamentService(prisma))],
    [SeasonController, () => new SeasonController(new SeasonService(prisma), standingsService)],
    [TournamentRuleController, () => new TournamentRuleController(new TournamentRuleService(prisma))],
    [TeamController, () => new TeamController(new TeamService(prisma))],
    [PlayerController, () => new PlayerController(new PlayerService(prisma))],
    [SeasonTeamController, () => new SeasonTeamController(new SeasonTeamService(prisma))],
    [GroupController, () => new GroupController(new GroupService(prisma))],
    [ScheduleController, () => new ScheduleController(new ScheduleService(prisma))],
    [KnockoutController, () => new KnockoutController(new KnockoutService(prisma))],
    [MatchController, () => new MatchController(lifecycleService)],
    [MatchResultController, () => new MatchResultController(matchResultService)],
    [MatchLineupController, () => new MatchLineupController(new MatchLineupService(prisma))],
    [WorkflowController, () => new WorkflowController(workflowService)],
    [JerseyController, () => new JerseyController(new JerseyService(prisma))],
    [ArticleController, () => new ArticleController(new ArticleService(prisma))],
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