import {
    Controller,
    Get,
    Path,
    Tags,
    Route,
    Post,
    Body,
    Security,
    Query,
} from "tsoa";

import { MatchResultService } from "../services/matchresult.service.js";

import * as matchResultType from "../types/matchResult.type.js";
import { buildMatchEventsQueryRequest } from "../helper/match.helper.js";

@Route("matches")
@Tags("Match Result")
export class MatchResultController extends Controller {
    constructor(
        private readonly matchResultService: MatchResultService,
    ) {
        super();
    }

    @Get("{id}/result")
    async getMatchResult(@Path() id: number) {
        const result = await this.matchResultService.getMatchResult(id);
        return result;
    }

    @Get("{id}/events")
    async getMatchEvents(
        @Path() id: number,
        @Query() type?: string,
        @Query() period?: string,
        @Query() page?: number,
        @Query() per_page?: number,
        @Query() sort?: string,
        @Query() direction?: 'asc' | 'desc',
        @Query() q?: string,
    ) {
        const req = buildMatchEventsQueryRequest({
            type, period, page, per_page, sort, direction, q,
        });

        const result = await this.matchResultService.listMatchEvents(id, req);
        return result;
    }

    @Get("{id}/result/stats")
    async getMatchPlayerStats(@Path() id: number) {
        const stats = await this.matchResultService.getMatchPlayerStats(id);
        return stats;
    }

    /**
     * FIX (Critical #1 — auth bypass): @Security("jwt") trước đây không role-restrict
     * — bất kỳ authenticated user (user/leader/organizing) đều gọi được endpoint này
     * để confirmResult() trực tiếp, bypass toàn bộ state machine ở MatchController
     * (finalizeMatch → grace period → confirmOfficial), vốn siết admin cho mọi
     * confirm/forfeit/resolve-appeal operation. _guardConfirm chỉ chặn status
     * finished/cancelled — match ongoing/pending_official/needs_review/abandoned/
     * bye/postponed đều pass, và nếu body.input cho set explicitWinnerTeamId, đây
     * là privilege escalation thực sự (set winner tuỳ ý cho bất kỳ match).
     *
     * Siết về admin. Khuyến nghị đánh giá lại: endpoint này có còn cần thiết không
     * — MatchController đã có confirmOfficial/forfeitMatch/adminRecordResult cho
     * đầy đủ use case; nếu không có consumer riêng (integration test, internal
     * tool), nên xoá hẳn thay vì giữ 1 entrypoint thứ 2 vào cùng service method.
     */
    @Security("jwt", ["admin"])
    @Post("{id}/result/confirm")
    async confirmResult(
        @Path() id: number,
        @Body() body: matchResultType.ConfirmOfficialBody,
    ) {
        const result = await this.matchResultService.confirmResult(
            id,
            body.input,
            body.scheduleOptions,
        );

        this.setStatus(201);
        return result;
    }

}