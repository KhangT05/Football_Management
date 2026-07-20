// services/match-lineup.service.ts
import { Prisma, PrismaClient, MatchLineup, MatchStatus, PitchType } from '../generated/prisma/client.js';
import { createAppError } from '../common/app.error.js';
import { RegisterLineupDto, UpdateLineupEntryDto } from '../dtos/matchlineup.schema.js';

const REGISTER_CUTOFF_MS = 60 * 60 * 1000;
const UPDATE_CUTOFF_MS = 10 * 60 * 1000;

// Số lượng đá chính CỐ ĐỊNH theo loại sân (chỉ TỔNG SỐ, không ép cứng tỷ lệ
// DEF/MID/FW — đội bóng tự chọn sơ đồ chiến thuật riêng, vd sân 5 có thể đá
// 2-1-1 hoặc 1-2-1 tuỳ HLV, không phải lúc nào cũng 1-2-1-1). Đây KHÔNG phải
// tournament_rule.min/max_players_per_team (cái đó giới hạn TỔNG quân số đăng
// ký gồm cả dự bị) — đây là số người XUẤT PHÁT trên sân theo đúng luật sân
// 5/7/11 người.
const PITCH_TOTAL_STARTERS: Record<PitchType, number> = {
    san_5: 5,
    san_7: 7,
    san_11: 11,
};

type MatchContext = {
    scheduled_at: Date;
    home_team_id: number;
    away_team_id: number;
    status: MatchStatus;
    pitch_type: PitchType;
    season_id: number;
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
                                id: true,
                                pitch_type: true, // NEW — cần để tính sơ đồ đá chính theo sân
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
            season_id: match.phase?.season?.id ?? -1,
            pitch_type: match.phase?.season?.pitch_type ?? PitchType.san_5,
            tournament_rule: match.phase?.season?.tournamentRule ?? null,
        };
    }

    async getEligiblePlayers(matchId: number, teamId: number) {
        const ctx = await this.getMatchContextOrFail(matchId);
        this.assertTeamInMatch(ctx, teamId);

        return this.prisma.teamPlayer.findMany({
            where: {
                approval_status: 'approved',
                status: 'active',
                season_team: { season_id: ctx.season_id, team_id: teamId },
            },
            select: {
                player_id: true,
                jersey_number: true,
                position: true,
                role: true,
                player: { select: { user: { select: { name: true, avatar: true } } } },
            },
            orderBy: { jersey_number: 'asc' },
        });
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

    // jersey_number không tồn tại trong MatchLineup — không có gì để check
    // trùng ở đây. Check player_id trùng trong payload, vì đây mới là
    // invariant thật sự được bảo vệ bởi @@unique([match_id, player_id]).
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

    // Check TỔNG quân số đăng ký (đá chính + dự bị) nằm trong khoảng
    // tournament_rule cho phép. KHÔNG liên quan tới số lượng đá chính theo
    // từng vị trí — đó là việc của assertStartersFormation bên dưới.
    private assertSquadSize(count: number, min: number, max: number): void {
        if (count < min || count > max)
            throw createAppError(
                'BAD_REQUEST',
                `Số lượng đăng ký phải từ ${min} đến ${max} cầu thủ (hiện tại: ${count})`,
            );
    }

    // NEW — validate đội hình đá chính đúng LUẬT sân (sân 5/7/11), nhưng để
    // tự do chọn sơ đồ chiến thuật (DEF/MID/FW). Chỉ ép 2 điều duy nhất mà
    // luật bóng đá thực sự bắt buộc:
    //   1. Tổng số cầu thủ đá chính = đúng số người/sân (5, 7, hoặc 11)
    //   2. Đúng 1 thủ môn (không được 0 hoặc 2+ GK cùng lúc đá chính)
    // Tách biệt khỏi assertSquadSize: assertSquadSize check TỔNG đăng ký
    // (chính + dự bị) nằm trong khoảng tournament_rule; hàm này chỉ check
    // riêng đội hình XUẤT PHÁT. Validate lại ở BE là bắt buộc — payload có
    // thể bị sửa tay trước khi gửi, FE chỉ chặn UX chứ không phải nguồn sự thật.
    private assertStartersFormation(
        pitchType: PitchType,
        players: { position: string; lineup_type?: string }[],
    ): void {
        const needed = PITCH_TOTAL_STARTERS[pitchType];
        const starters = players.filter(p => (p.lineup_type ?? 'starter') === 'starter');

        if (starters.length !== needed)
            throw createAppError(
                'BAD_REQUEST',
                `Sân ${pitchType.replace('san_', '')} cần đúng ${needed} cầu thủ đá chính (hiện tại: ${starters.length})`,
            );

        const gkCount = starters.filter(p => p.position === 'goalkeeper').length;
        if (gkCount !== 1)
            throw createAppError(
                'BAD_REQUEST',
                `Đội hình chính phải có đúng 1 thủ môn (hiện tại: ${gkCount})`,
            );
    }

    getByMatch(matchId: number): Promise<MatchLineup[]> {
        return this.prisma.matchLineup.findMany({
            where: { match_id: matchId },
            orderBy: [{ team_id: 'asc' }, { lineup_type: 'asc' }, { player_id: 'asc' }],
        });
    }

    getByTeam(matchId: number, teamId: number): Promise<MatchLineup[]> {
        return this.prisma.matchLineup.findMany({
            where: { match_id: matchId, team_id: teamId },
        });
    }

    // NEW — expose thông tin sân của 1 match cho FE preview trước khi mở modal
    // xếp đội hình (vd hiển thị badge "Sân 7" + tổng số slot đá chính). FE tự
    // quyết định phân bổ DEF/MID/FW theo sơ đồ chiến thuật, chỉ cần đủ tổng
    // và đúng 1 thủ môn.
    async getFormationForMatch(matchId: number): Promise<{ pitchType: PitchType; totalStarters: number }> {
        const ctx = await this.getMatchContextOrFail(matchId);
        return { pitchType: ctx.pitch_type, totalStarters: PITCH_TOTAL_STARTERS[ctx.pitch_type] };
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
            const { min, max } = this.assertRule(ctx);
            this.assertSquadSize(dto.players.length, min, max);
            this.assertStartersFormation(ctx.pitch_type, dto.players); // NEW — chốt đúng sơ đồ sân

            const playerIds = dto.players.map(p => p.player_id);

            const validTeamPlayers = await tx.teamPlayer.findMany({
                where: {
                    player_id: { in: playerIds },
                    approval_status: 'approved',
                    status: 'active',
                    season_team: { season_id: ctx.season_id, team_id: dto.team_id },
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
                // P2002 ở đây CHỈ có thể là @@unique([match_id, player_id])
                // — tức 1 player_id xuất hiện 2 lần trong batch insert.
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
    //
    // Patch 1 entry đơn lẻ (đổi vị trí, chuyển chính<->dự bị, đổi captain...).
    // KHÔNG chạy assertStartersFormation ở đây — patch từng entry một có thể
    // tạm thời phá vỡ sơ đồ sân (vd đang đổi 2 cầu thủ chỗ nhau qua 2 lần gọi
    // liên tiếp), validate cứng ở mức "toàn đội hình phải đúng sơ đồ" chỉ áp
    // dụng cho hành động CHỐT đội hình cuối (register bulk) — đúng với cách
    // FE hiện tại hoạt động: LineupBuilderModal luôn gọi register() bulk qua
    // nút "Lưu Đội Hình", không có update-entry rời rạc nào là điểm chốt.
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