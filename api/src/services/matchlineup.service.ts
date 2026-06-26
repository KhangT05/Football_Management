// services/match-lineup.service.ts
import { PrismaClient, MatchLineup } from '../generated/prisma/client.js';
import { createAppError } from '../common/app.error.js';
import { RegisterLineupDto, UpdateLineupEntryDto } from '../dtos/matchlineup.schema.js';

const REGISTER_CUTOFF_MS = 60 * 60 * 1000;   // 1 hour
const UPDATE_CUTOFF_MS = 10 * 60 * 1000;   // 10 minutes

export class MatchLineupService {
    constructor(private readonly prisma: PrismaClient) { }

    // ─── Guards ───────────────────────────────────────────────────────────────

    private async getScheduledAtOrFail(matchId: number): Promise<Date> {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: { scheduled_at: true },
        });
        if (!match) throw createAppError('NOT_FOUND', `Match ${matchId} not found`);
        if (!match.scheduled_at)
            throw createAppError('BAD_REQUEST', `Match ${matchId} chưa có lịch thi đấu`);
        return match.scheduled_at;
    }

    private assertCanRegister(scheduledTime: Date): void {
        const msUntil = scheduledTime.getTime() - Date.now();
        if (msUntil < REGISTER_CUTOFF_MS)
            throw createAppError('BAD_REQUEST', 'Đăng ký lineup phải trước giờ thi đấu ít nhất 1 giờ');
    }

    private assertCanUpdate(scheduledTime: Date): void {
        const msUntil = scheduledTime.getTime() - Date.now();
        if (msUntil < UPDATE_CUTOFF_MS)
            throw createAppError('BAD_REQUEST', 'Chỉ được sửa lineup trước giờ thi đấu ít nhất 10 phút');
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
        const scheduledTime = await this.getScheduledAtOrFail(dto.match_id);
        this.assertCanRegister(scheduledTime);

        // Validate players thuộc team này
        const playerIds = dto.players.map(p => p.player_id);
        const validPlayers = await this.prisma.player.findMany({
            where: { id: { in: playerIds }, team_id: dto.team_id },
            select: { id: true },
        });
        if (validPlayers.length !== playerIds.length) {
            const invalid = playerIds.filter(id => !validPlayers.some(p => p.id === id));
            throw createAppError('BAD_REQUEST', `Player IDs không thuộc team: ${invalid.join(', ')}`);
        }

        // createMany + skipDuplicates không trả về records trên mọi DB
        // → dùng transaction: deleteMany existing của team này rồi createMany
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

        return this.getByTeam(dto.match_id, dto.team_id);
    }

    // ─── Update single entry ──────────────────────────────────────────────────

    async updateEntry(dto: UpdateLineupEntryDto): Promise<MatchLineup> {
        const scheduledTime = await this.getScheduledAtOrFail(dto.match_id);
        this.assertCanUpdate(scheduledTime);

        const existing = await this.prisma.matchLineup.findUnique({
            where: {
                match_id_player_id: { match_id: dto.match_id, player_id: dto.player_id },
            },
        });
        if (!existing) throw createAppError('NOT_FOUND', `Lineup entry không tồn tại`);
        if (existing.team_id !== dto.team_id)
            throw createAppError('FORBIDDEN', 'Entry không thuộc team này');

        const { match_id, team_id, player_id, ...patch } = dto;
        const data = Object.fromEntries(
            Object.entries(patch).filter(([, v]) => v !== undefined)
        );

        return this.prisma.matchLineup.update({
            where: { match_id_player_id: { match_id, player_id } },
            data,
        });
    }

    // ─── Remove ───────────────────────────────────────────────────────────────

    async removeEntry(matchId: number, teamId: number, playerId: number): Promise<void> {
        const scheduledTime = await this.getScheduledAtOrFail(matchId);
        this.assertCanUpdate(scheduledTime); // sửa = xóa, dùng cùng cutoff

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