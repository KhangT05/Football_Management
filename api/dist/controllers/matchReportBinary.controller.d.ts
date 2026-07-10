import { Request, Response } from 'express';
import { MatchResultService } from '../services/matchresult.service.js';
/**
 * Class thường — KHÔNG dùng tsoa @Route/@Get decorator, vì mọi return value
 * qua tsoa decorator bị routes.ts tự sinh gọi response.json(data), kể cả
 * Buffer cũng bị JSON.stringify sai thành {"type":"Buffer","data":[...]}.
 * Route này được mount thủ công trong app.ts, đứng trước RegisterRoutes.
 */
export declare class MatchReportBinaryController {
    private readonly matchResultService;
    constructor(matchResultService: MatchResultService);
    download(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=matchReportBinary.controller.d.ts.map