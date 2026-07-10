// services/match-lineup.service.ts
import { Prisma, PrismaClient, MatchLineup, MatchStatus } from '../generated/prisma/client.js';
import { createAppError } from '../common/app.error.js';
import { RegisterLineupDto, UpdateLineupEntryDto } from '../dtos/matchlineup.schema.js';

const REGISTER_CUTOFF_MS = 60 * 60 * 1000;
const UPDATE_CUTOFF_MS = 10 * 60 * 1000;

type MatchContext = {
    scheduled_at: Date;
    home_team_id: number;
    away_team_id: number;
    status: MatchStatus;
    tournament_rule: { min_players_per_team: number; max_players_per_team: number } | null;
};
const LINEUP_MUTABLE_STATUSES: MatchStatus[] = [MatchStatus.scheduled];

export class MatchLineupService {
    constructor(private readonly prisma: PrismaClient) { }

    private async getMatchContextOrFail(
        matchId: number,
        tx: PrismaClient | Prisma.TransactionClient = this.prisma,
    ): Promise<MatchContext> {
        const match = await tx.match.findUnique({
            where: { id: matchId },
            select: {
                scheduled_at: true,
                home_team_id: true,
                away_team_id: true,
                status: true,
                phase: {
                    select: {
                        season: {
                            select: {
                                tournamentRule: {
                                    select: { min_players_per_team: true, max_players_per_team: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!match) throw createAppError('NOT_FOUND', `Match ${matchId} not found`);
        if (!match.scheduled_at)
            throw createAppError('BAD_REQUEST', `Match ${matchId} chưa có lịch thi đấu`);

        return {
            scheduled_at: match.scheduled_at,
            home_team_id: match.home_team_id,
            away_team_id: match.away_team_id,
            status: match.status,
            tournament_rule: match.phase?.season?.tournamentRule ?? null,
        };
    }


    private assertTeamInMatch(ctx: MatchContext, teamId: number): void {
        if (teamId !== ctx.home_team_id && teamId !== ctx.away_team_id)
            throw createAppError('BAD_REQUEST', `Team ${teamId} không tham gia match này`);
    }

    private assertMatchMutable(ctx: MatchContext): void {
        if (!LINEUP_MUTABLE_STATUSES.includes(ctx.status))
            throw createAppError(
                'CONFLICT',
                `Match đang ở status '${ctx.status}' — không thể sửa lineup`,
            );
    }

    private assertCanRegister(scheduledTime: Date): void {
        if (scheduledTime.getTime() - Date.now() < REGISTER_CUTOFF_MS)
            throw createAppError('BAD_REQUEST', 'Đăng ký lineup phải trước giờ thi đấu ít nhất 1 giờ');
    }

    private assertCanUpdate(scheduledTime: Date): void {
        if (scheduledTime.getTime() - Date.now() < UPDATE_CUTOFF_MS)
            throw createAppError('BAD_REQUEST', 'Chỉ được sửa lineup trước giờ thi đấu ít nhất 10 phút');
    }

    private assertSingleCaptain(players: { is_captain?: boolean }[]): void {
        if (players.filter(p => p.is_captain).length > 1)
            throw createAppError('BAD_REQUEST', 'Mỗi team chỉ được có 1 đội trưởng');
    }

    // FIX: jersey_number không tồn tại trong MatchLineup — không có gì để check
    // trùng ở đây. Thay vào đó check player_id trùng trong payload, vì đây mới
    // là invariant thật sự được bảo vệ bởi @@unique([match_id, player_id]).
    private assertNoDuplicatePlayerId(players: { player_id: number }[]): void {
        const ids = players.map(p => p.player_id);
        if (new Set(ids).size !== ids.length)
            throw createAppError('BAD_REQUEST', 'Danh sách đăng ký có player_id bị trùng lặp');
    }

    private assertRule(ctx: MatchContext): { min: number; max: number } {
        if (!ctx.tournament_rule)
            throw createAppError('BAD_REQUEST', 'Không tìm thấy rule cho giải đấu này (season chưa gán TournamentRule)');
        return { min: ctx.tournament_rule.min_players_per_team, max: ctx.tournament_rule.max_players_per_team };
    }

    private assertSquadSize(count: number, min: number, max: number): void {
        if (count < min || count > max)
            throw createAppError(
                'BAD_REQUEST',
                `Số lượng đăng ký phải từ ${min} đến ${max} cầu thủ (hiện tại: ${count})`,
            );
    }
    getByMatch(matchId: number): Promise<MatchLineup[]> {
        return this.prisma.matchLineup.findMany({
            where: { match_id: matchId },
            // FIX: bỏ jersey_number khỏi orderBy (field không tồn tại trên model này)
            orderBy: [{ team_id: 'asc' }, { lineup_type: 'asc' }, { player_id: 'asc' }],
        });
    }

    getByTeam(matchId: number, teamId: number): Promise<MatchLineup[]> {
        return this.prisma.matchLineup.findMany({
            where: { match_id: matchId, team_id: teamId },
        });
    }

    // ─── Register (bulk upsert) ────────────────────────────────────────────────
    //
    // Toàn bộ validate + mutate chạy trong 1 $transaction, mở đầu bằng
    // SELECT ... FOR UPDATE trên row match — serialize 2 request register()
    // đồng thời cho cùng matchId, tránh last-write-wins âm thầm.
    //
    // Player.team_id không tồn tại trên schema — quan hệ Player↔Team đi qua
    // TeamPlayer. Chỉ chấp nhận player đang active + approved + không suspended.
    async register(dto: RegisterLineupDto): Promise<MatchLineup[]> {
        return this.prisma.$transaction(async tx => {
            await tx.$queryRaw`SELECT id FROM matches WHERE id = ${dto.match_id} FOR UPDATE`;

            const ctx = await this.getMatchContextOrFail(dto.match_id, tx);
            this.assertTeamInMatch(ctx, dto.team_id);
            this.assertMatchMutable(ctx);
            this.assertCanRegister(ctx.scheduled_at);
            this.assertSingleCaptain(dto.players);
            this.assertNoDuplicatePlayerId(dto.players);
            const { min, max } = await this.assertRule(ctx);
            this.assertSquadSize(dto.players.length, min, max);

            const playerIds = dto.players.map(p => p.player_id);

            const validTeamPlayers = await tx.teamPlayer.findMany({
                where: {
                    player_id: { in: playerIds },
                    team_id: dto.team_id,
                    is_active: true,
                    approval_status: 'approved',
                    status: 'active',
                },
                select: { player_id: true },
            });
            const validIds = new Set(validTeamPlayers.map(p => p.player_id));
            const invalid = playerIds.filter(id => !validIds.has(id));
            if (invalid.length > 0)
                throw createAppError(
                    'BAD_REQUEST',
                    `Player IDs không thuộc team (hoặc chưa approved/đang suspended): ${invalid.join(', ')}`,
                );

            try {
                await tx.matchLineup.deleteMany({
                    where: { match_id: dto.match_id, team_id: dto.team_id },
                });
                await tx.matchLineup.createMany({
                    data: dto.players.map(p => ({
                        match_id: dto.match_id,
                        team_id: dto.team_id,
                        player_id: p.player_id,
                        position: p.position,
                        lineup_type: p.lineup_type ?? 'starter',
                        is_captain: p.is_captain ?? false,
                        minute_in: p.minute_in,
                        minute_out: p.minute_out,
                        status: p.status ?? 'available',
                    })),
                });
            } catch (err) {
                // FIX: P2002 ở đây CHỈ có thể là @@unique([match_id, player_id])
                // — tức 1 player_id xuất hiện 2 lần trong batch insert. Không liên
                // quan gì tới "số áo" (field không tồn tại trên model này).
                if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')
                    throw createAppError(
                        'CONFLICT',
                        'Có player_id bị đăng ký trùng cho match này',
                    );
                throw err;
            }

            return tx.matchLineup.findMany({ where: { match_id: dto.match_id, team_id: dto.team_id } });
        });
    }

    // ─── Update single entry ──────────────────────────────────────────────────

    async updateEntry(dto: UpdateLineupEntryDto): Promise<MatchLineup> {
        const ctx = await this.getMatchContextOrFail(dto.match_id);
        this.assertMatchMutable(ctx);
        this.assertCanUpdate(ctx.scheduled_at);

        const existing = await this.prisma.matchLineup.findUnique({
            where: { match_id_player_id: { match_id: dto.match_id, player_id: dto.player_id } },
        });
        if (!existing) throw createAppError('NOT_FOUND', `Lineup entry không tồn tại`);
        if (existing.team_id !== dto.team_id)
            throw createAppError('FORBIDDEN', 'Entry không thuộc team này');

        const { match_id, team_id, player_id, ...patch } = dto;
        const data = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));

        try {
            if (data.is_captain === true) {
                const [, updated] = await this.prisma.$transaction([
                    this.prisma.matchLineup.updateMany({
                        where: { match_id, team_id, player_id: { not: player_id }, is_captain: true },
                        data: { is_captain: false },
                    }),
                    this.prisma.matchLineup.update({
                        where: { match_id_player_id: { match_id, player_id } },
                        data,
                    }),
                ]);
                return updated;
            }
            return await this.prisma.matchLineup.update({
                where: { match_id_player_id: { match_id, player_id } },
                data,
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                // updateEntry không đổi player_id (player_id nằm trong where, bị
                // destructure loại khỏi `data`), nên P2002 ở đây thực tế không thể
                // xảy ra trong code path hiện tại — giữ lại như defensive guard
                // phòng trường hợp DTO/where thay đổi sau này.
                if (err.code === 'P2002')
                    throw createAppError(
                        'CONFLICT',
                        'Vi phạm ràng buộc duy nhất (match_id, player_id) khi cập nhật',
                    );
                // Race giữa fetch `existing` và update — entry có thể đã bị
                // removeEntry() xoá trong lúc này.
                if (err.code === 'P2025')
                    throw createAppError('NOT_FOUND', `Lineup entry không tồn tại (đã bị xoá)`);
            }
            throw err;
        }
    }

    // ─── Remove ───────────────────────────────────────────────────────────────

    async removeEntry(matchId: number, teamId: number, playerId: number): Promise<void> {
        const ctx = await this.getMatchContextOrFail(matchId);
        this.assertMatchMutable(ctx);
        this.assertCanUpdate(ctx.scheduled_at);

        const existing = await this.prisma.matchLineup.findUnique({
            where: { match_id_player_id: { match_id: matchId, player_id: playerId } },
            select: { team_id: true },
        });
        if (!existing) throw createAppError('NOT_FOUND', 'Lineup entry không tồn tại');
        if (existing.team_id !== teamId)
            throw createAppError('FORBIDDEN', 'Entry không thuộc team này');

        try {
            await this.prisma.matchLineup.delete({
                where: { match_id_player_id: { match_id: matchId, player_id: playerId } },
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025')
                throw createAppError('NOT_FOUND', 'Lineup entry không tồn tại (đã bị xoá)');
            throw err;
        }
    }
}