import {
    GroupStatus,
    LineupType,
    MatchEventType,
    MatchPeriod,
    MatchResultType,
    MatchStatus,
    PhaseFormat,
    PhaseStatus,
    PhaseType,
    PlayerPosition,
    PrismaClient,
    SeasonTeamStatus,
} from '../generated/prisma/client.js';
import { createAppError } from '../common/app.error.js';
import { KnockoutService } from './knockout.service.js';
import { MatchLifecycleService } from './match.service.js';
import { MatchResultService } from './matchresult.service.js';
import { StandingsService } from './standing.service.js';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkflowConfig {
    /**
     * Phải là số chẵn >= 4 (2 groups, mỗi group ít nhất 2 team).
     * Chia đều: một nửa vào group A, một nửa vào group B.
     * Top 1 mỗi group advance vào Final.
     *
     * Lineup: pick từ TeamPlayer hiện có trong DB cho từng team.
     * Nếu team thiếu player → match vẫn chạy, lineup partial (không throw).
     */
    teamIds: number[];  // phải tồn tại trong DB
    venueId: number;    // phải tồn tại trong DB
    seed?: number;      // seeded RNG cho score random tái tạo được

    /**
     * Base timestamp cho TOÀN BỘ schedule trong workflow này (season dates,
     * group stage matches, Final). Default: thời điểm gọi run().
     * Truyền cố định để test reproducible theo thời gian, hoặc để dựng
     * nhiều season liên tiếp không bị lệch theo wall-clock thực tế.
     */
    startTime?: Date | string;

    /**
     * Khoảng cách giữa 2 match liên tiếp (đơn vị slot thời gian), phút.
     * Default 60. Phải > 0, nếu không sẽ fallback về default.
     */
    matchIntervalMinutes?: number;

    /**
     * Độ trễ tối thiểu (phút) giữa trận cuối group stage và trận Final.
     * Default 1440 (1 ngày). Tính theo phút thay vì slot để không leak
     * implementation detail (slot size) ra config public.
     */
    finalDelayMinutes?: number;
}

export interface MatchReport {
    id: number;
    home: string;
    away: string;
    score: string;     // "2-1"
    resultType: MatchResultType;
}

export interface WorkflowReport {
    tournamentId: number;
    seasonId: number;
    phases: {
        groupAPhaseId: number;
        groupBPhaseId: number;
        knockoutPhaseId: number;
    };
    groupA: {
        groupId: number;
        matches: MatchReport[];
        standings: StandingRow[];
    };
    groupB: {
        groupId: number;
        matches: MatchReport[];
        standings: StandingRow[];
    };
    final: {
        match: MatchReport | null;
        winner: string | null;
    };
    log: string[];
}

interface StandingRow {
    teamId: number;
    team: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    gf: number;
    ga: number;
    points: number;
}

interface TeamInfo {
    id: number;
    name: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// scheduleOptions stub — workflow không cần scheduling thật
const NO_SCHEDULE: { venueIds: number[]; matchTimes: string[] } = {
    venueIds: [],
    matchTimes: [],
};

const DEFAULT_MATCH_INTERVAL_MINUTES = 60;
const DEFAULT_FINAL_DELAY_MINUTES = 24 * 60;

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export class WorkflowService {
    private rng: () => number;
    private log: string[] = [];

    // ── Clock: nguồn thời gian DUY NHẤT cho toàn bộ scheduled_at trong workflow.
    // Không còn rải rác new Date() ở từng method — tất cả đi qua _nextSlot()/
    // _skipSlots(), điều khiển được qua WorkflowConfig.startTime/matchIntervalMinutes.
    private clockBase: Date = new Date();
    private matchSlot = 0;
    private matchIntervalMinutes = DEFAULT_MATCH_INTERVAL_MINUTES;

    constructor(
        private readonly prisma: PrismaClient,
        private readonly knockoutService: KnockoutService,
        private readonly matchLifecycleService: MatchLifecycleService,
        private readonly matchResultService: MatchResultService,
        private readonly standingsService: StandingsService,
    ) {
        this.rng = Math.random;
    }

    // ─── PUBLIC ───────────────────────────────────────────────────────────────

    async run(config: WorkflowConfig): Promise<WorkflowReport> {
        if (config.teamIds.length < 4 || config.teamIds.length % 2 !== 0)
            throw createAppError('VALIDATION_ERROR', 'teamIds phải là số chẵn >= 4');

        if (config.seed !== undefined) this._seedRng(config.seed);
        this.log = [];

        // ── Clock setup ─────────────────────────────────────────────────────
        this.clockBase = config.startTime ? new Date(config.startTime) : new Date();
        this.matchSlot = 0;
        this.matchIntervalMinutes =
            config.matchIntervalMinutes && config.matchIntervalMinutes > 0
                ? config.matchIntervalMinutes
                : DEFAULT_MATCH_INTERVAL_MINUTES;

        const finalDelayMinutes = config.finalDelayMinutes ?? DEFAULT_FINAL_DELAY_MINUTES;
        const finalDelaySlots = Math.max(1, Math.ceil(finalDelayMinutes / this.matchIntervalMinutes));

        // ── 1. Load teams ──────────────────────────────────────────────────
        const teams = await this.prisma.team.findMany({
            where: { id: { in: config.teamIds }, is_active: true },
            select: { id: true, name: true },
        });

        if (teams.length !== config.teamIds.length)
            throw createAppError('NOT_FOUND', `Một số teamId không tồn tại hoặc đã bị xóa`);

        const teamMap = new Map(teams.map(t => [t.id, t.name]));
        this._log(`Loaded ${teams.length} teams`);

        // ── 2. Tournament + Season ─────────────────────────────────────────
        const { tournamentId, seasonId } = await this._setupTournament();
        this._log(`Tournament ${tournamentId} / Season ${seasonId}`);

        // ── 3. Register teams vào Season ──────────────────────────────────
        await this._registerSeasonTeams(seasonId, teams.map(t => t.id));
        this._log(`Registered ${teams.length} teams into season`);

        // ── 4. Split → Group A / Group B ──────────────────────────────────
        const half = teams.length / 2;
        const groupATeams = teams.slice(0, half);
        const groupBTeams = teams.slice(half);

        // ── 5. Group Phase A ───────────────────────────────────────────────
        const { phaseId: groupAPhaseId, groupId: groupAId } =
            await this._createGroupPhase(seasonId, 'Group Stage A', groupATeams);
        this._log(`Group A phase=${groupAPhaseId} group=${groupAId}`);

        const groupAMatches = await this._createRoundRobinMatches(
            groupAPhaseId, groupAId, groupATeams, config.venueId,
        );
        this._log(`Group A: ${groupAMatches.length} matches scheduled`);

        const groupAReports = await this._executeMatches(groupAMatches, teamMap, config.venueId);
        this._log(`Group A: ${groupAReports.length} matches played`);

        // FIX: recompute tường minh — không dựa vào side-effect ngầm bên trong
        // confirmOfficial(). standingsService được inject nhưng trước đây không
        // hề được gọi ở workflow này; toàn bộ correctness của bước đọc standings
        // dưới đây phụ thuộc vào một hành vi mà WorkflowService không kiểm soát
        // được (race nếu recompute phía MatchLifecycleService là fire-and-forget).
        await this.standingsService.recomputeGroupStandings(groupAId);
        const groupAStandings = await this._getStandings(groupAId, teamMap);

        // ── 6. Group Phase B ───────────────────────────────────────────────
        const { phaseId: groupBPhaseId, groupId: groupBId } =
            await this._createGroupPhase(seasonId, 'Group Stage B', groupBTeams);
        this._log(`Group B phase=${groupBPhaseId} group=${groupBId}`);

        const groupBMatches = await this._createRoundRobinMatches(
            groupBPhaseId, groupBId, groupBTeams, config.venueId,
        );
        this._log(`Group B: ${groupBMatches.length} matches scheduled`);

        const groupBReports = await this._executeMatches(groupBMatches, teamMap, config.venueId);
        this._log(`Group B: ${groupBReports.length} matches played`);

        await this.standingsService.recomputeGroupStandings(groupBId);
        const groupBStandings = await this._getStandings(groupBId, teamMap);

        // ── 7. Knockout Phase ──────────────────────────────────────────────
        const groupAWinner = groupAStandings[0];
        const groupBWinner = groupBStandings[0];

        if (!groupAWinner || !groupBWinner)
            throw createAppError('INTERNAL_SERVER_ERROR', 'Không xác định được winner từ group standings');

        this._log(`Finalists: ${groupAWinner.team} (A) vs ${groupBWinner.team} (B)`);

        const { phaseId: knockoutPhaseId, match: finalMatch } =
            await this._createAndRunFinal(
                seasonId, groupAWinner.teamId, groupBWinner.teamId, config.venueId, finalDelaySlots,
            );

        const winnerName = finalMatch?.score
            ? this._resolveWinnerName(finalMatch, groupAWinner, groupBWinner)
            : null;

        const winnerTeamId = winnerName === groupAWinner.team
            ? groupAWinner.teamId
            : groupBWinner.teamId;

        await this._finalizeSeasonState(seasonId, winnerTeamId, teams.map(t => t.id));

        this._log(`Winner: ${winnerName ?? 'unknown'}`);
        this._log(`Season ${seasonId} → finished, SeasonTeams updated`);

        return {
            tournamentId,
            seasonId,
            phases: { groupAPhaseId, groupBPhaseId, knockoutPhaseId },
            groupA: { groupId: groupAId, matches: groupAReports, standings: groupAStandings },
            groupB: { groupId: groupBId, matches: groupBReports, standings: groupBStandings },
            final: { match: finalMatch ?? null, winner: winnerName },
            log: this.log,
        };
    }

    // ─── FINALIZE ─────────────────────────────────────────────────────────────

    private async _finalizeSeasonState(
        seasonId: number,
        winnerTeamId: number,
        allTeamIds: number[],
    ): Promise<void> {
        const eliminatedIds = allTeamIds.filter(id => id !== winnerTeamId);

        await this.prisma.$transaction([
            this.prisma.season.update({
                where: { id: seasonId },
                data: { status: 'finished', end_date: this.clockBase },
            }),
            this.prisma.seasonTeam.updateMany({
                where: { season_id: seasonId, team_id: winnerTeamId },
                data: { status: SeasonTeamStatus.active, seed: 1 },
            }),
            this.prisma.seasonTeam.updateMany({
                where: { season_id: seasonId, team_id: { in: eliminatedIds } },
                data: { status: SeasonTeamStatus.eliminated },
            }),
        ]);
    }

    // ─── SETUP ────────────────────────────────────────────────────────────────

    private async _setupTournament(): Promise<{ tournamentId: number; seasonId: number }> {
        const suffix = Date.now();

        const tournament = await this.prisma.tournament.create({
            data: {
                name: `Workflow Test ${suffix}`,
                tournamentRule: {
                    create: {
                        forfeit_score: 3,
                        yellow_cards_suspension: 3,
                        points_per_win: 3,
                        points_per_draw: 1,
                        points_per_loss: 0,
                    },
                },
            },
            select: { id: true },
        });

        // FIX: dùng clockBase thay vì new Date() trực tiếp — season dates phải
        // nhất quán với clock điều khiển được của workflow, không lệch theo
        // wall-clock thực khi caller truyền startTime cố định.
        const season = await this.prisma.season.create({
            data: {
                tournament_id: tournament.id,
                name: `Season ${suffix}`,
                status: 'ongoing',
                max_teams: 32,
                start_date: this.clockBase,
                end_date: new Date(this.clockBase.getTime() + 90 * 24 * 60 * 60 * 1000),
            },
            select: { id: true },
        });

        return { tournamentId: tournament.id, seasonId: season.id };
    }

    private async _registerSeasonTeams(seasonId: number, teamIds: number[]): Promise<void> {
        await this.prisma.seasonTeam.createMany({
            data: teamIds.map(teamId => ({
                season_id: seasonId,
                team_id: teamId,
                status: SeasonTeamStatus.active,
            })),
            skipDuplicates: true,
        });
    }

    // ─── GROUP PHASE ──────────────────────────────────────────────────────────

    private async _createGroupPhase(
        seasonId: number,
        name: string,
        teams: TeamInfo[],
    ): Promise<{ phaseId: number; groupId: number }> {
        // Phase order: lấy max order hiện tại + 1
        const maxOrder = await this.prisma.phase.aggregate({
            where: { season_id: seasonId },
            _max: { order: true },
        });
        const order = (maxOrder._max.order ?? 0) + 1;

        const phase = await this.prisma.phase.create({
            data: {
                season_id: seasonId,
                name,
                type: PhaseType.group_stage,
                format: PhaseFormat.round_robin,
                order,
                legs: 1,
                min_rest_days_per_team: 0,
                status: PhaseStatus.in_progress,
            },
            select: { id: true },
        });

        const group = await this.prisma.group.create({
            data: {
                phase_id: phase.id,
                name: name.includes('A') ? 'Bảng A' : 'Bảng B',
                status: GroupStatus.SCHEDULED,
            },
            select: { id: true },
        });

        // Gán group vào SeasonTeam
        await this.prisma.seasonTeam.updateMany({
            where: {
                season_id: seasonId,
                team_id: { in: teams.map(t => t.id) },
            },
            data: { group_id: group.id },
        });

        return { phaseId: phase.id, groupId: group.id };
    }

    private async _createRoundRobinMatches(
        phaseId: number,
        groupId: number,
        teams: TeamInfo[],
        venueId: number,
    ): Promise<{ id: number; home_team_id: number; away_team_id: number }[]> {
        // Single-leg round-robin: mỗi cặp 1 trận
        const pairs: { home: number; away: number }[] = [];
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                pairs.push({ home: teams[i]!.id, away: teams[j]!.id });
            }
        }

        const created: { id: number; home_team_id: number; away_team_id: number }[] = [];

        for (const pair of pairs) {
            const match = await this.prisma.match.create({
                data: {
                    phase_id: phaseId,
                    group_id: groupId,
                    home_team_id: pair.home,
                    away_team_id: pair.away,
                    status: MatchStatus.scheduled,
                    // FIX: trước đây mỗi lần gọi method này tự new Date() riêng rồi
                    // +idx giờ. Group A và Group B chạy 2 lần khác nhau, chỉ lệch
                    // vài ms theo tốc độ thực thi thực tế → có thể đụng unique
                    // constraint (venue_id, scheduled_at) nếu chạy đủ nhanh/đồng bộ.
                    // Giờ dùng 1 slot counter monotonic xuyên suốt cả workflow.
                    scheduled_at: this._nextSlot(),
                    venue_id: venueId,
                },
                select: { id: true, home_team_id: true, away_team_id: true },
            });
            created.push(match);
        }

        return created;
    }

    // ─── MATCH EXECUTION ──────────────────────────────────────────────────────

    private async _executeMatches(
        matches: { id: number; home_team_id: number; away_team_id: number }[],
        teamMap: Map<number, string>,
        venueId: number,
    ): Promise<MatchReport[]> {
        const reports: MatchReport[] = [];

        for (const m of matches) {
            const report = await this._playMatch(m, teamMap, venueId);
            reports.push(report);
            this._log(`  Match ${m.id}: ${report.home} ${report.score} ${report.away}`);
        }

        return reports;
    }

    private async _playMatch(
        m: { id: number; home_team_id: number; away_team_id: number },
        teamMap: Map<number, string>,
        venueId: number,
    ): Promise<MatchReport> {
        const homeName = teamMap.get(m.home_team_id) ?? `Team ${m.home_team_id}`;
        const awayName = teamMap.get(m.away_team_id) ?? `Team ${m.away_team_id}`;

        // 1. Lineup
        await this._createLineup(m.id, m.home_team_id, m.away_team_id);

        // 2. Start
        await this.matchLifecycleService.startMatch(m.id);

        // 3. Generate goals
        const homeGoals = Math.floor(this.rng() * 4); // 0-3
        const awayGoals = Math.floor(this.rng() * 4);

        const [homePlayers, awayPlayers] = await Promise.all([
            this._getMatchPlayers(m.id, m.home_team_id),
            this._getMatchPlayers(m.id, m.away_team_id),
        ]);

        await this._recordGoals(m.id, m.home_team_id, homeGoals, homePlayers, MatchPeriod.first_half);
        await this._recordGoals(m.id, m.away_team_id, awayGoals, awayPlayers, MatchPeriod.second_half);

        // 4. Finalize → pending_official
        await this.matchLifecycleService.finalizeMatch(
            m.id,
            { resultType: MatchResultType.full_time },
            NO_SCHEDULE,
        );

        // 5. Confirm official → MatchResult created + (kỳ vọng) standings recomputed
        // phía MatchLifecycleService. Workflow KHÔNG còn dựa vào điều này — xem
        // recomputeGroupStandings() tường minh ở run() sau khi hết group stage.
        await this.matchLifecycleService.confirmOfficial(m.id, NO_SCHEDULE);

        return {
            id: m.id,
            home: homeName,
            away: awayName,
            score: `${homeGoals}-${awayGoals}`,
            resultType: MatchResultType.full_time,
        };
    }

    // ─── LINEUP ───────────────────────────────────────────────────────────────

    /**
     * Tạo lineup cho 2 teams từ TeamPlayer records có sẵn trong DB.
     * Tối đa 11 starters + 3 substitutes per team.
     * Nếu team không đủ player → lineup partial, không throw.
     */
    private async _createLineup(
        matchId: number,
        homeTeamId: number,
        awayTeamId: number,
    ): Promise<void> {
        await Promise.all([
            this._createTeamLineup(matchId, homeTeamId),
            this._createTeamLineup(matchId, awayTeamId),
        ]);
    }

    private async _createTeamLineup(matchId: number, teamId: number): Promise<void> {
        const players = await this.prisma.teamPlayer.findMany({
            where: {
                team_id: teamId,
                is_active: true,
                approval_status: 'approved',
                status: 'active',
            },
            select: {
                player_id: true,
                jersey_number: true,
                position: true,
                role: true,
            },
            orderBy: { id: 'asc' },
            take: 14, // max 11 starters + 3 subs
        });

        if (players.length === 0) return; // team chưa có player → skip silently

        const lineupData = players.map((p, idx) => ({
            match_id: matchId,
            team_id: teamId,
            player_id: p.player_id,
            jersey_number: p.jersey_number,
            position: p.position,
            lineup_type: idx < 11 ? LineupType.starter : LineupType.substitute,
            is_captain: p.role === 'captain',
        }));

        await this.prisma.matchLineup.createMany({
            data: lineupData,
            skipDuplicates: true,
        });
    }

    /**
     * Lấy player_id có trong lineup của 1 team trong 1 match.
     * Dùng để gán scorer khi ghi event goal.
     */
    private async _getMatchPlayers(matchId: number, teamId: number): Promise<number[]> {
        const lineups = await this.prisma.matchLineup.findMany({
            where: { match_id: matchId, team_id: teamId, lineup_type: LineupType.starter },
            select: { player_id: true },
        });
        return lineups.map(l => l.player_id);
    }

    // ─── EVENT RECORDING ──────────────────────────────────────────────────────

    private async _recordGoals(
        matchId: number,
        teamId: number,
        count: number,
        playerIds: number[],
        period: MatchPeriod,
    ): Promise<void> {
        for (let i = 0; i < count; i++) {
            const minute = Math.floor(this.rng() * 45) + (period === MatchPeriod.first_half ? 1 : 46);
            // Pick random player nếu có lineup, không thì ghi goal không có player
            const playerId = playerIds.length > 0
                ? playerIds[Math.floor(this.rng() * playerIds.length)]
                : undefined;

            await this.matchLifecycleService.recordEvent(matchId, {
                type: MatchEventType.goal,
                teamId,
                playerId,
                minute,
                period,
            });
        }
    }

    // ─── STANDINGS ────────────────────────────────────────────────────────────

    private async _getStandings(groupId: number, teamMap: Map<number, string>): Promise<StandingRow[]> {
        const rows = await this.prisma.teamStanding.findMany({
            where: { group_id: groupId, is_active: true },
            // FIX: trước đây orderBy [{points:'desc'},{wins:'desc'}] — bỏ qua
            // hoàn toàn goal_diff/goals_scored/head_to_head/cards. 2 team cùng
            // điểm cùng số thắng nhưng goal_diff khác (rất phổ biến) sẽ ra thứ
            // tự không xác định, sai lệch với standings chính thức.
            // `position` là field đã được recomputeGroupStandings() tính đầy đủ
            // tiebreaker chain (kể cả H2H mini-league) — đó là single source
            // of truth, không nên tự tính lại sort ở đây.
            orderBy: { position: 'asc' },
            select: {
                team_id: true,
                matches_played: true,
                wins: true,
                draws: true,
                losses: true,
                goals_for: true,
                goals_against: true,
                points: true,
            },
        });

        return rows.map(r => ({
            teamId: r.team_id,
            team: teamMap.get(r.team_id) ?? `Team ${r.team_id}`,
            played: r.matches_played,
            wins: r.wins,
            draws: r.draws,
            losses: r.losses,
            gf: r.goals_for,
            ga: r.goals_against,
            points: r.points,
        }));
    }

    // ─── KNOCKOUT ─────────────────────────────────────────────────────────────

    /**
     * Final: tạo phase knockout + 1 match trực tiếp (không dùng generateKnockoutBracket
     * vì bracket engine cần PhaseType ∈ KNOCKOUT_PHASE_TYPE_SET và seeding phức tạp hơn).
     *
     * Với 2 teams → 1 trận Final duy nhất.
     * Nếu hòa: tung đồng xu để quyết định (penalty mock).
     */
    private async _createAndRunFinal(
        seasonId: number,
        homeTeamId: number,
        awayTeamId: number,
        venueId: number,
        finalDelaySlots: number,
    ): Promise<{ phaseId: number; match: MatchReport }> {
        // Phase order
        const maxOrder = await this.prisma.phase.aggregate({
            where: { season_id: seasonId },
            _max: { order: true },
        });

        const phase = await this.prisma.phase.create({
            data: {
                season_id: seasonId,
                name: 'Final',
                type: PhaseType.final,
                format: PhaseFormat.knockout,
                order: (maxOrder._max.order ?? 0) + 1,
                legs: 1,
                min_rest_days_per_team: 0,
                status: PhaseStatus.in_progress,
            },
            select: { id: true },
        });

        // FIX: trước đây new Date()+1 ngày cố định, không liên quan gì tới slot
        // của group stage → vẫn có thể đụng nếu group stage kéo dài hơn 1 ngày
        // (interval nhỏ + nhiều team → nhiều trận). Giờ nhảy tiếp từ slot cuối
        // cùng của group stage nên Final luôn nằm sau toàn bộ group stage,
        // không phụ thuộc wall-clock hay số lượng trận đã chạy.
        this._skipSlots(finalDelaySlots);
        const scheduledAt = this._nextSlot();

        // Tạo match trước
        const match = await this.prisma.match.create({
            data: {
                phase_id: phase.id,
                home_team_id: homeTeamId,
                away_team_id: awayTeamId,
                status: MatchStatus.scheduled,
                scheduled_at: scheduledAt,
                venue_id: venueId,
            },
            select: { id: true, home_team_id: true, away_team_id: true },
        });

        // BracketSlot cho Final — round=1, slot=1, không có source_a/source_b (là trận cuối).
        // advanceWinner lookup match → slot → parentSlot = null → early return { matchCreated: false }.
        // Nếu không có slot này: advanceWinner throw NOT_FOUND vì match không link với bracket.
        await this.prisma.bracketSlot.create({
            data: {
                phase_id: phase.id,
                round: 1,
                slot_number: 1,
                match_id: match.id,
                seeded_home_team_id: homeTeamId,
                seeded_away_team_id: awayTeamId,
                is_bye: false,
                source_a_slot_id: null,
                source_b_slot_id: null,
            },
        });

        this._log(`Final match created: id=${match.id}`);

        const teamMap = new Map<number, string>();
        const teams = await this.prisma.team.findMany({
            where: { id: { in: [homeTeamId, awayTeamId] } },
            select: { id: true, name: true },
        });
        teams.forEach(t => teamMap.set(t.id, t.name));

        const report = await this._playFinalMatch(match, teamMap, venueId);
        return { phaseId: phase.id, match: report };
    }

    /**
     * Final không được hòa → nếu hòa thì mock penalty.
     */
    private async _playFinalMatch(
        m: { id: number; home_team_id: number; away_team_id: number },
        teamMap: Map<number, string>,
        venueId: number,
    ): Promise<MatchReport> {
        const homeName = teamMap.get(m.home_team_id) ?? `Team ${m.home_team_id}`;
        const awayName = teamMap.get(m.away_team_id) ?? `Team ${m.away_team_id}`;

        await this._createLineup(m.id, m.home_team_id, m.away_team_id);
        await this.matchLifecycleService.startMatch(m.id);

        let homeGoals = Math.floor(this.rng() * 3);
        let awayGoals = Math.floor(this.rng() * 3);

        const [homePlayers, awayPlayers] = await Promise.all([
            this._getMatchPlayers(m.id, m.home_team_id),
            this._getMatchPlayers(m.id, m.away_team_id),
        ]);

        await this._recordGoals(m.id, m.home_team_id, homeGoals, homePlayers, MatchPeriod.first_half);
        await this._recordGoals(m.id, m.away_team_id, awayGoals, awayPlayers, MatchPeriod.second_half);

        const isDraw = homeGoals === awayGoals;

        if (isDraw) {
            // Mock penalty: winner ngẫu nhiên
            const homePenalty = 3 + Math.floor(this.rng() * 3); // 3-5
            let awayPenalty = 3 + Math.floor(this.rng() * 3);
            // Đảm bảo không hòa penalty
            if (awayPenalty === homePenalty) awayPenalty = homePenalty > 3 ? homePenalty - 1 : homePenalty + 1;

            await this.matchLifecycleService.finalizeMatch(
                m.id,
                {
                    resultType: MatchResultType.penalty,
                    homePenaltyScore: homePenalty,
                    awayPenaltyScore: awayPenalty,
                },
                NO_SCHEDULE,
            );

            await this.matchLifecycleService.confirmOfficial(m.id, NO_SCHEDULE);

            const winner = homePenalty > awayPenalty ? homeName : awayName;
            this._log(`  Final DRAW ${homeGoals}-${awayGoals} → Penalty ${homePenalty}-${awayPenalty} → ${winner}`);

            return {
                id: m.id,
                home: homeName,
                away: awayName,
                score: `${homeGoals}-${awayGoals} (pen ${homePenalty}-${awayPenalty})`,
                resultType: MatchResultType.penalty,
            };
        }

        await this.matchLifecycleService.finalizeMatch(
            m.id,
            { resultType: MatchResultType.full_time },
            NO_SCHEDULE,
        );

        await this.matchLifecycleService.confirmOfficial(m.id, NO_SCHEDULE);

        return {
            id: m.id,
            home: homeName,
            away: awayName,
            score: `${homeGoals}-${awayGoals}`,
            resultType: MatchResultType.full_time,
        };
    }

    // ─── UTILS ────────────────────────────────────────────────────────────────

    private _resolveWinnerName(
        finalMatch: MatchReport,
        groupAWinner: StandingRow,
        groupBWinner: StandingRow,
    ): string {
        // Parse score: "2-1" hoặc "1-1 (pen 5-4)"
        const basePart = finalMatch.score.split(' ')[0]!;
        const [homeStr, awayStr] = basePart.split('-');
        const homeScore = parseInt(homeStr ?? '0');
        const awayScore = parseInt(awayStr ?? '0');

        if (finalMatch.resultType === MatchResultType.penalty) {
            // Penalty: parse "(pen X-Y)"
            const penPart = finalMatch.score.match(/pen (\d+)-(\d+)/);
            if (penPart) {
                const homePen = parseInt(penPart[1]!);
                const awayPen = parseInt(penPart[2]!);
                return homePen > awayPen ? groupAWinner.team : groupBWinner.team;
            }
        }

        if (homeScore > awayScore) return groupAWinner.team;
        if (awayScore > homeScore) return groupBWinner.team;
        return 'Unknown';
    }

    /**
     * Lấy timestamp kế tiếp theo slot counter rồi advance slot lên 1.
     * Đây là nguồn thời gian DUY NHẤT cho mọi scheduled_at trong workflow —
     * điều khiển được qua config.startTime/matchIntervalMinutes, deterministic,
     * không phụ thuộc tốc độ thực thi (khác hẳn rải rác new Date() trước đây).
     */
    private _nextSlot(): Date {
        const t = new Date(this.clockBase);
        t.setMinutes(t.getMinutes() + this.matchSlot * this.matchIntervalMinutes);
        this.matchSlot++;
        return t;
    }

    /** Nhảy qua n slot mà không tạo match — dùng để tách Final ra khỏi group stage. */
    private _skipSlots(n: number): void {
        this.matchSlot += n;
    }

    private _seedRng(seed: number): void {
        let s = seed >>> 0;
        this.rng = () => {
            s ^= s << 13;
            s ^= s >> 17;
            s ^= s << 5;
            s = s >>> 0;
            return s * 2.3283064365386963e-10;
        };
    }

    private _log(msg: string): void {
        const entry = `[${new Date().toISOString()}] ${msg}`;
        this.log.push(entry);
        console.log(entry);
    }
}