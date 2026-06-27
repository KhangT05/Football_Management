import {
    Controller,
    Post,
    Body,
    Route,
    Tags,
    SuccessResponse,
} from 'tsoa';
import { WorkflowService, WorkflowConfig, WorkflowReport } from '../services/workflow.service.js';

/**
 * Workflow Controller — test-only, no auth.
 *
 * POST /workflow/run
 *   Chạy toàn bộ workflow: group A → group B → final.
 *   Yêu cầu: teamIds tồn tại trong DB, venueId tồn tại trong DB.
 *   Không tạo team/venue mới — caller phải seed trước.
 */
@Route('workflow')
@Tags('Workflow')
export class WorkflowController extends Controller {
    constructor(
        private readonly workflowService: WorkflowService
    ) {
        super();
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
    @Post('run')
    @SuccessResponse(200, 'OK')
    async run(@Body() body: WorkflowRunRequest): Promise<WorkflowReport> {
        return this.workflowService.run({
            teamIds: body.teamIds,
            venueId: body.venueId,
            seed: body.seed,
        });
    }
}

// ─── DTO ──────────────────────────────────────────────────────────────────────

export interface WorkflowRunRequest {
    /**
     * IDs của teams đã tồn tại trong DB.
     * Phải là số chẵn, tối thiểu 4.
     * Một nửa vào Group A, một nửa vào Group B.
     *
     * @example [1, 2, 3, 4]
     * @minItems 4
     */
    teamIds: number[];

    /**
     * ID của venue đã tồn tại trong DB.
     * @example 1
     */
    venueId: number;

    /**
     * Optional seed cho RNG. Cùng seed → cùng kết quả score.
     * @example 42
     */
    seed?: number;
}