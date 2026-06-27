var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, Route, Tags, SuccessResponse, } from 'tsoa';
import { WorkflowService } from '../services/workflow.service.js';
/**
 * Workflow Controller — test-only, no auth.
 *
 * POST /workflow/run
 *   Chạy toàn bộ workflow: group A → group B → final.
 *   Yêu cầu: teamIds tồn tại trong DB, venueId tồn tại trong DB.
 *   Không tạo team/venue mới — caller phải seed trước.
 */
let WorkflowController = class WorkflowController extends Controller {
    workflowService;
    constructor(workflowService) {
        super();
        this.workflowService = workflowService;
    }
    /**
     * Chạy toàn bộ tournament workflow test.
     *
     * Body:
     *   - teamIds: số chẵn >= 4, phải tồn tại trong DB
     *   - venueId: phải tồn tại trong DB
     *   - seed?: optional — để RNG tái tạo được (debug)
     *
     * Response:
     *   - tournamentId, seasonId
     *   - groupA / groupB: matches + standings
     *   - final: match report + winner
     *   - log: execution trace
     */
    async run(body) {
        return this.workflowService.run({
            teamIds: body.teamIds,
            venueId: body.venueId,
            seed: body.seed,
        });
    }
};
__decorate([
    Post('run'),
    SuccessResponse(200, 'OK'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "run", null);
WorkflowController = __decorate([
    Route('workflow'),
    Tags('Workflow'),
    __metadata("design:paramtypes", [WorkflowService])
], WorkflowController);
export { WorkflowController };
//# sourceMappingURL=workflow.controller.js.map