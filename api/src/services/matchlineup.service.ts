// services/match-lineup.service.ts
import { Prisma, PrismaClient, MatchLineup } from '../generated/prisma/client.js';
import { createAppError } from '../common/app.error.js';
import { RegisterLineupDto, UpdateLineupEntryDto } from '../dtos/matchlineup.schema.js';

const REGISTER_CUTOFF_MS = 60 * 60 * 1000;
const UPDATE_CUTOFF_MS = 10 * 60 * 1000;

type MatchContext = {
    scheduled_at: Date;
    home_team_id: number;
    away_team_id: number;
};

export class MatchLineupService {
    constructor(private readonly prisma: PrismaClient) { }

    // ─── Guards ───────────────────────────────────────────────────────────────

    private async getMatchContextOrFail(matchId: number): Promise<MatchContext> {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: { scheduled_at: true, home_team_id: true, away_team_id: true },
        });
        if (!match) throw createAppError('NOT_FOUND', `Match ${matchId} not found`);
        if (!match.scheduled_at)
            throw createAppError('BAD_REQUEST', `Match ${matchId} chưa có lịch thi đấu`);
        return match as MatchContext;
    }

    private assertTeamInMatch(ctx: MatchContext, teamId: number): void {
        if (teamId !== ctx.home_team_id && teamId !== ctx.away_team_id)
            throw createAppError('BAD_REQUEST', `Team ${teamId} không tham gia match này`);
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

    // ─── Read ─────────────────────────────────────────────────────────────────

    getByMatch(matchId: number): Promise<MatchLineup[]> {
        return this.prisma.matchLineup.findMany({
            where: { match_id: matchId },
            orderBy: [{ team_id: 'asc' }, { lineup_type: 'asc' }, { jersey_number: 'asc' }],
        });
    }

    getByTeam(matchId: number, teamId: number): Promise<MatchLineup[]> {
        return this.prisma.matchLineup.findMany({
            where: { match_id: matchId, team_id: teamId },
        });
    }

    // ─── Register (bulk upsert) ────────────────────────────────────────────────

    async register(dto: RegisterLineupDto): Promise<MatchLineup[]> {
        const ctx = await this.getMatchContextOrFail(dto.match_id);
        this.assertTeamInMatch(ctx, dto.team_id);
        this.assertCanRegister(ctx.scheduled_at);
        this.assertSingleCaptain(dto.players);

        const playerIds = dto.players.map(p => p.player_id);
        const validPlayers = await this.prisma.player.findMany({
            where: { id: { in: playerIds }, team_id: dto.team_id },
            select: { id: true },
        });
        if (validPlayers.length !== playerIds.length) {
            const invalid = playerIds.filter(id => !validPlayers.some(p => p.id === id));
            throw createAppError('BAD_REQUEST', `Player IDs không thuộc team: ${invalid.join(', ')}`);
        }

        const jerseyNumbers = dto.players.map(p => p.jersey_number);
        if (new Set(jerseyNumbers).size !== jerseyNumbers.length)
            throw createAppError('BAD_REQUEST', 'Số áo bị trùng trong danh sách đăng ký');

        try {
            await this.prisma.$transaction([
                this.prisma.matchLineup.deleteMany({
                    where: { match_id: dto.match_id, team_id: dto.team_id },
                }),
                this.prisma.matchLineup.createMany({
                    data: dto.players.map(p => ({
                        match_id: dto.match_id,
                        team_id: dto.team_id,
                        player_id: p.player_id,
                        jersey_number: p.jersey_number,
                        position: p.position,
                        lineup_type: p.lineup_type ?? 'starter',
                        is_captain: p.is_captain ?? false,
                        minute_in: p.minute_in,
                        minute_out: p.minute_out,
                        status: p.status ?? 'available',
                    })),
                }),
            ]);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')
                throw createAppError('CONFLICT', 'Số áo bị trùng trong team cho match này');
            throw err;
        }

        return this.getByTeam(dto.match_id, dto.team_id);
    }

    // ─── Update single entry ──────────────────────────────────────────────────

    async updateEntry(dto: UpdateLineupEntryDto): Promise<MatchLineup> {
        const ctx = await this.getMatchContextOrFail(dto.match_id);
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
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')
                throw createAppError('CONFLICT', 'Số áo bị trùng trong team cho match này');
            throw err;
        }
    }

    // ─── Remove ───────────────────────────────────────────────────────────────

    async removeEntry(matchId: number, teamId: number, playerId: number): Promise<void> {
        const ctx = await this.getMatchContextOrFail(matchId);
        this.assertCanUpdate(ctx.scheduled_at);

        const existing = await this.prisma.matchLineup.findUnique({
            where: { match_id_player_id: { match_id: matchId, player_id: playerId } },
            select: { team_id: true },
        });
        if (!existing) throw createAppError('NOT_FOUND', 'Lineup entry không tồn tại');
        if (existing.team_id !== teamId)
            throw createAppError('FORBIDDEN', 'Entry không thuộc team này');

        await this.prisma.matchLineup.delete({
            where: { match_id_player_id: { match_id: matchId, player_id: playerId } },
        });
    }
}