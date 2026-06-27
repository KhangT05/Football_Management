import { Controller } from 'tsoa';
import { WorkflowService, WorkflowReport } from '../services/workflow.service.js';
/**
 * Workflow Controller — test-only, no auth.
 *
 * POST /workflow/run
 *   Chạy toàn bộ workflow: group A → group B → final.
 *   Yêu cầu: teamIds tồn tại trong DB, venueId tồn tại trong DB.
 *   Không tạo team/venue mới — caller phải seed trước.
 */
export declare class WorkflowController extends Controller {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
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
    run(body: WorkflowRunRequest): Promise<WorkflowReport>;
}
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
//# sourceMappingURL=workflow.controller.d.ts.map