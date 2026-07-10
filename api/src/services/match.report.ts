import { Prisma } from '../generated/prisma/client.js';
import { MatchEventType, MatchPeriod, MatchResultType } from '../generated/prisma/client.js';

import {
    buildGoalsTimeline,
    buildMatchReportPlayerRows,
    isCreditedToHomeTeam,
} from '../helper/match.helper.js';
import { MatchReportJerseyInfo, MatchReportOutput, MatchReportTeamInfo } from '../types/matchReport.type.js';
import { createAppError } from '../common/app.error.js';
import prisma from '../libs/prisma.js';
// Factory function (tạo instance renderer MỚI mỗi lần gọi) — KHÔNG import
// class MatchReportPdfRenderer để giữ làm field của service. Xem lý do ở
// renderMatchReportPdf() bên dưới.
import { renderMatchReportPdf as renderPdf } from './matchReportPdf.service.js';

// ─── Select cho match report — 1 nguồn sự thật duy nhất cho query này ─────
// Nếu project đã có convention gom select vào match.queries.ts (theo pattern
// matchForConfirmSelect/matchForForfeitSelect), nên move khối này sang đó.
export const matchForReportSelect = {
    id: true,
    played_at: true,
    referee: true,
    status: true,
    home_score: true,
    away_score: true,
    home_team_id: true,
    away_team_id: true,
    venue: {
        select: { name: true },
    },
    home_team: {
        select: { id: true, name: true },
    },
    away_team: {
        select: { id: true, name: true },
    },
    matchJerseyAssignment: {
        select: {
            team_id: true,
            season_jersey: {
                select: {
                    image_url: true,
                    primary_color: true,
                    secondary_color: true,
                },
            },
        },
    },
    matchLineups: {
        select: {
            player_id: true,
            team_id: true,
            position: true,
            lineup_type: true,
            is_captain: true,
            minute_in: true,
            minute_out: true,
            player: {
                select: { user: { select: { name: true } } },
            },
        },
    },
    events: {
        select: {
            id: true,
            player_id: true,
            team_id: true,
            type: true,
            period: true,
            minute: true,
            added_minute: true,
        },
        orderBy: [{ minute: 'asc' }, { id: 'asc' }],
    },
    matchResult: {
        select: {
            winner_team_id: true,
            home_extra_time_score: true,
            away_extra_time_score: true,
            home_penalty_score: true,
            away_penalty_score: true,
            home_final_score: true,
            away_final_score: true,
            result_type: true,
        },
    },
} satisfies Prisma.MatchSelect;

export type MatchForReport = Prisma.MatchGetPayload<{ select: typeof matchForReportSelect }>;

export class MatchReportService {
    // ─── Public API — dùng bởi controller ──────────────────────────────────

    async buildMatchReport(matchId: number): Promise<MatchReportOutput> {
        const match = await this.fetchMatchForReport(matchId);
        if (!match) {
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);
        }

        const jerseyLookup = await this.fetchJerseyLookup(match);
        const halfTime = this.computeHalfTimeScore(match);

        const playerNameLookup = new Map<number, string>(
            match.matchLineups.map(l => [l.player_id, l.player.user.name]),
        );
        const goalsTimeline = buildGoalsTimeline(
            match.events,
            match.home_team_id,
            match.away_team_id,
            playerNameLookup,
        );

        const result = match.matchResult;

        return {
            matchId: match.id,
            playedAt: match.played_at,
            venueName: match.venue?.name ?? null,
            referee: match.referee,
            status: match.status,
            // ASSUMPTION: trận chưa finalize (chưa có MatchResult) fallback
            // full_time — xác nhận lại có đúng default mong muốn không.
            resultType: result?.result_type ?? MatchResultType.full_time,
            score: {
                homeHalfTime: halfTime.home,
                awayHalfTime: halfTime.away,
                homeFullTime: match.home_score,
                awayFullTime: match.away_score,
                homeExtraTime: result?.home_extra_time_score ?? null,
                awayExtraTime: result?.away_extra_time_score ?? null,
                homePenalty: result?.home_penalty_score ?? null,
                awayPenalty: result?.away_penalty_score ?? null,
                homeFinal: result?.home_final_score ?? match.home_score ?? 0,
                awayFinal: result?.away_final_score ?? match.away_score ?? 0,
            },
            winnerTeamId: result?.winner_team_id ?? null,
            home: this.buildTeamInfo(match, 'home'),
            away: this.buildTeamInfo(match, 'away'),
            lineups: {
                home: buildMatchReportPlayerRows(
                    match.matchLineups,
                    jerseyLookup,
                    match.events,
                    match.home_team_id,
                ),
                away: buildMatchReportPlayerRows(
                    match.matchLineups,
                    jerseyLookup,
                    match.events,
                    match.away_team_id,
                ),
            },
            goalsTimeline,
        };
    }

    // Orchestration: build data rồi render PDF — controller chỉ cần gọi 1
    // method, không phải biết build-report và render-pdf là 2 bước tách biệt.
    //
    // FIX quan trọng: KHÔNG giữ `MatchReportPdfRenderer` làm field/constructor
    // dependency của service. MatchReportService rất có thể được IOC container
    // đăng ký singleton (cùng pattern KnockoutService) — nếu renderer là shared
    // instance, 2 request export PDF đồng thời sẽ đua nhau ghi field `doc` bên
    // trong renderer, corrupt output lẫn nhau. `renderPdf()` là factory function
    // tạo `new MatchReportPdfRenderer()` MỚI cho mỗi lần gọi → an toàn concurrency
    // dù service có là singleton hay không.
    async renderMatchReportPdf(matchId: number): Promise<Buffer> {
        const report = await this.buildMatchReport(matchId);
        return renderPdf(report);
    }

    // ─── Private helpers ────────────────────────────────────────────────────

    private async fetchMatchForReport(matchId: number): Promise<MatchForReport | null> {
        return prisma.match.findUnique({
            where: { id: matchId },
            select: matchForReportSelect,
        });
    }

    // Jersey trận đấu — từ matchJerseyAssignment, KHÔNG phải Team.logo
    // (Team.logo là logo CLB chung; jersey ở đây là trang phục thi đấu của
    // đúng trận này, có thể đổi theo từng trận nếu trùng màu áo).
    private resolveJersey(match: MatchForReport, teamId: number): MatchReportJerseyInfo {
        const assignment = match.matchJerseyAssignment.find(a => a.team_id === teamId);
        return {
            logoUrl: assignment?.season_jersey.image_url ?? null,
            primaryColor: assignment?.season_jersey.primary_color ?? null,
            secondaryColor: assignment?.season_jersey.secondary_color ?? null,
        };
    }

    private buildTeamInfo(match: MatchForReport, side: 'home' | 'away'): MatchReportTeamInfo {
        const team = side === 'home' ? match.home_team : match.away_team;
        const teamId = side === 'home' ? match.home_team_id : match.away_team_id;
        return {
            id: team.id,
            name: team.name,
            jersey: this.resolveJersey(match, teamId),
        };
    }

    // Jersey number — MatchLineup không lưu jersey_number, phải join
    // TeamPlayer theo (team_id, player_id) bằng query riêng (không có FK trực
    // tiếp MatchLineup -> TeamPlayer trong schema để include lồng được).
    private async fetchJerseyLookup(match: MatchForReport) {
        const homePlayerIds = match.matchLineups
            .filter(l => l.team_id === match.home_team_id)
            .map(l => l.player_id);
        const awayPlayerIds = match.matchLineups
            .filter(l => l.team_id === match.away_team_id)
            .map(l => l.player_id);

        return prisma.teamPlayer.findMany({
            where: {
                OR: [
                    { team_id: match.home_team_id, player_id: { in: homePlayerIds } },
                    { team_id: match.away_team_id, player_id: { in: awayPlayerIds } },
                ],
            },
            select: { team_id: true, player_id: true, jersey_number: true },
        });
    }

    // Half-time score — schema không lưu cột riêng, derive từ MatchEvent theo
    // period = first_half. Tái dùng isCreditedToHomeTeam từ match.helper.ts để
    // logic crediting own-goal / goal_disallowed nhất quán với goalsTimeline
    // và player stats — KHÔNG viết lại rule crediting ở đây.
    private computeHalfTimeScore(match: MatchForReport): { home: number; away: number } {
        let home = 0;
        let away = 0;

        for (const e of match.events) {
            if (e.period !== MatchPeriod.first_half) continue;
            if (e.team_id == null) continue;

            const isGoal = e.type === MatchEventType.goal || e.type === MatchEventType.penalty_scored;
            const isOwnGoal = e.type === MatchEventType.own_goal;
            if (!isGoal && !isOwnGoal) continue;

            const creditedHome = isCreditedToHomeTeam(match.home_team_id, e.team_id, e.type);
            if (creditedHome) home += 1;
            else away += 1;
        }

        return { home, away };
    }
}